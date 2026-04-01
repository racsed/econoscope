import type {
  SimulationModule,
  SimulationInput,
  Scenario,
  ComputeResult,
  ModuleMeta,
  CascadeData,
  CascadeBar,
} from '../types';
import { registerModule } from '../core/registry';

const meta: ModuleMeta = {
  slug: 'creation-monetaire',
  title: 'Création monétaire',
  subtitle: "Le multiplicateur de crédit bancaire",
  theme: 'monetary',
  level: 'intermediate',
  introduction:
    "Les banques commerciales créent de la monnaie par le crédit. Quand une banque accorde un prêt, elle crée un dépôt du même montant. Ce dépôt est partiellement conserve en réserves, partiellement retire en billets, et le reste est reprêté. Le processus se repete, multipliant le dépôt initial. La banque centrale contrôle ce processus par le taux de réserves obligatoires.",
  limites: [
    "Suppose que les banques prêtent tout ce qu'elles peuvent (pas de réserves excedentaires)",
    "Ignore les contraintes de demande de crédit",
    "Taux de fuite en billets suppose constant",
    "Ne tient pas compte des ratios prudentiels (Bale III)",
  ],
  economists: ['milton-friedman', 'irving-fisher'],
  realite: [
    "Le taux de réserves obligatoires de la BCE est de 1% depuis 2012",
    "En pratique, les banques détiennent des réserves excedentaires importantes",
    "La création monétaire dépend aussi de la demande de crédit des entreprises et ménages",
    "Le multiplicateur théorique surestime la création monétaire réelle",
  ],
};

const inputs: SimulationInput[] = [
  {
    id: 'depot_initial',
    label: 'Dépôt initial',
    type: 'slider',
    min: 1000,
    max: 100000,
    step: 1000,
    defaultValue: 10000,
    unit: '\u20ac',
    tooltip: "Montant du dépôt initial dans le système bancaire",
    group: 'Injection',
  },
  {
    id: 'taux_reserves',
    label: 'Taux de réserves obligatoires',
    type: 'slider',
    min: 1,
    max: 25,
    step: 0.5,
    defaultValue: 10,
    unit: '%',
    tooltip: "Pourcentage des dépôts que les banques doivent garder en réserves",
    group: 'Réglementation',
  },
  {
    id: 'taux_fuite_billets',
    label: 'Taux de fuite en billets',
    type: 'slider',
    min: 0,
    max: 30,
    step: 1,
    defaultValue: 10,
    unit: '%',
    tooltip: "Pourcentage des dépôts retires sous forme de billets par les ménages",
    group: 'Comportement',
  },
  {
    id: 'nb_tours',
    label: 'Nombre de tours',
    type: 'slider',
    min: 1,
    max: 30,
    step: 1,
    defaultValue: 15,
    group: 'Simulation',
  },
];

const scenarios: Scenario[] = [
  {
    id: 'base',
    label: 'Cas de base',
    description: "Reserves de 10%, fuite de 10%",
    values: { depot_initial: 10000, taux_reserves: 10, taux_fuite_billets: 10, nb_tours: 15 },
  },
  {
    id: 'bce_actuel',
    label: 'BCE actuelle',
    description: "Reserves obligatoires de 1%, faible fuite",
    values: { depot_initial: 10000, taux_reserves: 1, taux_fuite_billets: 5, nb_tours: 20 },
  },
  {
    id: 'reserves_elevees',
    label: 'Reserves élevées',
    description: "Réglementation stricte, multiplicateur faible",
    values: { depot_initial: 10000, taux_reserves: 20, taux_fuite_billets: 15, nb_tours: 15 },
  },
  {
    id: 'full_reserve',
    label: '100% monnaie (Fisher)',
    description: "Reserves integrales : pas de multiplication",
    values: { depot_initial: 10000, taux_reserves: 25, taux_fuite_billets: 0, nb_tours: 10 },
  },
];

/**
 * Money multiplication process:
 *
 * Round 0: Initial deposit D
 * Round n:
 *   - Deposit entering the round: D_n
 *   - Reserves: D_n * r   (kept by the bank)
 *   - Cash leakage: D_n * b  (withdrawn by depositors)
 *   - New loans (= new deposits in next round): D_n * (1 - r - b)
 *
 * D_{n+1} = D_n * (1 - r - b) = D_0 * (1 - r - b)^n
 *
 * Total deposits: sum_{n=0}^{inf} D_n = D / (r + b)
 * Multiplier: k = 1 / (r + b)
 */
function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

function compute(values: Record<string, number | boolean | string>): ComputeResult {
  const depotInitial = clamp(Number(values.depot_initial) || 10000, 1000, 100000);
  const r = clamp(Number(values.taux_reserves) || 10, 1, 25) / 100;
  const b = clamp(Number(values.taux_fuite_billets) || 10, 0, 30) / 100;
  const nbTours = clamp(Number(values.nb_tours) || 15, 1, 30);

  const alpha = Math.max(0, Math.min(1 - r - b, 0.999));
  const divisor = r + b;
  const multiplicateur = divisor > 0 ? 1 / divisor : 100;
  const asymptote = depotInitial * multiplicateur;

  const bars: CascadeBar[] = [];
  let cumulativeDepots = 0;
  let cumulativeReserves = 0;
  let cumulativeBillets = 0;

  for (let n = 0; n <= nbTours; n++) {
    const depotN = depotInitial * Math.pow(Math.max(0, alpha), n);
    const reservesN = depotN * r;
    const billetsN = depotN * b;
    const pretsN = depotN * Math.max(0, alpha);

    cumulativeDepots += depotN;
    cumulativeReserves += reservesN;
    cumulativeBillets += billetsN;

    bars.push({
      round: n,
      total: round2(depotN),
      consumption: round2(pretsN),
      savings: round2(reservesN),
      taxes: round2(billetsN),
      imports: 0,
      cumulative: round2(cumulativeDepots),
    });
  }

  const cascadeData: CascadeData = {
    type: 'bar-cascade',
    bars,
    asymptote: round2(asymptote),
    multiplier: round2(multiplicateur),
  };

  const convergencePercent = asymptote > 0 ? (cumulativeDepots / asymptote) * 100 : 100;
  const monnaieCreee = cumulativeDepots - depotInitial;

  let observation = `A partir d'un dépôt initial de ${depotInitial.toLocaleString('fr-FR')}\u20ac, le système bancaire crée ${round2(monnaieCreee).toLocaleString('fr-FR')}\u20ac de monnaie supplémentaire après ${nbTours} tours (total des dépôts : ${round2(cumulativeDepots).toLocaleString('fr-FR')}\u20ac). L'asymptote théorique est de ${round2(asymptote).toLocaleString('fr-FR')}\u20ac.`;

  let interpretation = `Le multiplicateur monétaire est de ${round2(multiplicateur)}, avec un coefficient de propagation de ${round2(alpha)}. `;

  if (r + b > 0.5) {
    interpretation += `Les fuites sont élevées (réserves ${(r * 100).toFixed(0)}% + billets ${(b * 100).toFixed(0)}% = ${((r + b) * 100).toFixed(0)}%), limitant fortement la création monétaire. `;
  }

  interpretation += `A chaque tour, ${(alpha * 100).toFixed(0)}% du dépôt est reprêté, ${(r * 100).toFixed(0)}% est garde en réserves et ${(b * 100).toFixed(0)}% est retire en billets.`;

  if (r <= 0.02) {
    interpretation += " Avec des réserves obligatoires aussi faibles (comme celles de la BCE a 1% depuis 2012), le multiplicateur théorique est très élevé. En pratique, d'autres contraintes (ratios prudentiels Bale III, demande de crédit des entreprises, risk appetite des banques) limitent la création monétaire effective bien en deca du maximum théorique.";
  }

  if (b > 0.2) {
    interpretation += ` La forte préférence pour les billets (${(b * 100).toFixed(0)}%) réduit considérablement le multiplicateur : à chaque tour, une part importante de la monnaie "sort" du circuit bancaire sous forme de billets et ne peut plus être reprêtée. C'est une fuite definitive du processus de création monétaire.`;
  }

  if (multiplicateur > 5 && multiplicateur < 20) {
    interpretation += ` Le multiplicateur de ${round2(multiplicateur)} signifie que chaque euro de dépôt initial génère theoriquement ${round2(multiplicateur)} euros de dépôts dans l'ensemble du système bancaire. C'est le pouvoir de création monétaire des banques commerciales, sous contrôle de la banque centrale via le taux de réserves.`;
  }

  if (r > 0.15) {
    interpretation += ` Le taux de réserves élevé (${(r * 100).toFixed(0)}%) bride fortement la création monétaire. C'est un outil de politique monétaire restrictive utilise notamment par la Banque de Chine ou en Inde pour contrôler l'expansion du crédit.`;
  }

  return {
    outputs: [
      { id: 'multiplicateur', label: 'Multiplicateur monétaire', value: round2(multiplicateur) },
      { id: 'total_depots', label: 'Total des dépôts', value: round2(cumulativeDepots), unit: '\u20ac' },
      { id: 'monnaie_creee', label: 'Monnaie créée', value: round2(monnaieCreee), unit: '\u20ac' },
      { id: 'total_reserves', label: 'Total des réserves', value: round2(cumulativeReserves), unit: '\u20ac' },
      { id: 'total_billets', label: 'Fuite en billets', value: round2(cumulativeBillets), unit: '\u20ac' },
      { id: 'convergence', label: 'Convergence', value: round2(convergencePercent), unit: '%' },
    ],
    chartData: cascadeData,
    narration: { observation, interpretation },
  };
}

function round2(v: number): number {
  return Math.round(v * 100) / 100;
}

const moneyCreationModule: SimulationModule = { meta, inputs, scenarios, compute };

registerModule(moneyCreationModule);

export { moneyCreationModule };
export default moneyCreationModule;
