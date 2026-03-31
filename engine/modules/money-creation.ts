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
  title: 'Creation monetaire',
  subtitle: "Le multiplicateur de credit bancaire",
  theme: 'monetary',
  level: 'intermediate',
  introduction:
    "Les banques commerciales creent de la monnaie par le credit. Quand une banque accorde un pret, elle cree un depot du meme montant. Ce depot est partiellement conserve en reserves, partiellement retire en billets, et le reste est reprete. Le processus se repete, multipliant le depot initial. La banque centrale controle ce processus par le taux de reserves obligatoires.",
  limites: [
    "Suppose que les banques pretent tout ce qu'elles peuvent (pas de reserves excedentaires)",
    "Ignore les contraintes de demande de credit",
    "Taux de fuite en billets suppose constant",
    "Ne tient pas compte des ratios prudentiels (Bale III)",
  ],
  realite: [
    "Le taux de reserves obligatoires de la BCE est de 1% depuis 2012",
    "En pratique, les banques detiennent des reserves excedentaires importantes",
    "La creation monetaire depend aussi de la demande de credit des entreprises et menages",
    "Le multiplicateur theorique surestime la creation monetaire reelle",
  ],
};

const inputs: SimulationInput[] = [
  {
    id: 'depot_initial',
    label: 'Depot initial',
    type: 'slider',
    min: 1000,
    max: 100000,
    step: 1000,
    defaultValue: 10000,
    unit: '\u20ac',
    tooltip: "Montant du depot initial dans le systeme bancaire",
    group: 'Injection',
  },
  {
    id: 'taux_reserves',
    label: 'Taux de reserves obligatoires',
    type: 'slider',
    min: 1,
    max: 25,
    step: 0.5,
    defaultValue: 10,
    unit: '%',
    tooltip: "Pourcentage des depots que les banques doivent garder en reserves",
    group: 'Reglementation',
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
    tooltip: "Pourcentage des depots retires sous forme de billets par les menages",
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
    label: 'Reserves elevees',
    description: "Reglementation stricte, multiplicateur faible",
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

  let observation = `A partir d'un depot initial de ${depotInitial.toLocaleString('fr-FR')}\u20ac, le systeme bancaire cree ${round2(monnaieCreee).toLocaleString('fr-FR')}\u20ac de monnaie supplementaire apres ${nbTours} tours (total des depots : ${round2(cumulativeDepots).toLocaleString('fr-FR')}\u20ac). L'asymptote theorique est de ${round2(asymptote).toLocaleString('fr-FR')}\u20ac.`;

  let interpretation = `Le multiplicateur monetaire est de ${round2(multiplicateur)}, avec un coefficient de propagation de ${round2(alpha)}. `;

  if (r + b > 0.5) {
    interpretation += `Les fuites sont elevees (reserves ${(r * 100).toFixed(0)}% + billets ${(b * 100).toFixed(0)}% = ${((r + b) * 100).toFixed(0)}%), limitant fortement la creation monetaire. `;
  }

  interpretation += `A chaque tour, ${(alpha * 100).toFixed(0)}% du depot est reprete, ${(r * 100).toFixed(0)}% est garde en reserves et ${(b * 100).toFixed(0)}% est retire en billets.`;

  if (r <= 0.02) {
    interpretation += " Avec des reserves obligatoires aussi faibles (comme celles de la BCE actuellement), le multiplicateur theorique est tres eleve. En pratique, d'autres contraintes (ratios prudentiels, demande de credit) limitent la creation monetaire.";
  }

  if (b > 0.2) {
    interpretation += " La forte preference pour les billets reduit considerablement le multiplicateur : la monnaie \"fuit\" du circuit bancaire a chaque tour.";
  }

  return {
    outputs: [
      { id: 'multiplicateur', label: 'Multiplicateur monetaire', value: round2(multiplicateur) },
      { id: 'total_depots', label: 'Total des depots', value: round2(cumulativeDepots), unit: '\u20ac' },
      { id: 'monnaie_creee', label: 'Monnaie creee', value: round2(monnaieCreee), unit: '\u20ac' },
      { id: 'total_reserves', label: 'Total des reserves', value: round2(cumulativeReserves), unit: '\u20ac' },
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
