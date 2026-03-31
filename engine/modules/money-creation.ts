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
import { moneyCreationScenarios } from '../../data/scenarios/money-creation-scenarios';

const meta: ModuleMeta = {
  slug: 'creation-monetaire',
  title: 'Creation monetaire par le credit',
  subtitle: 'Le mecanisme du multiplicateur de credit et des reserves fractionnaires',
  theme: 'monetary',
  level: 'intermediate',
  introduction:
    "Lorsqu'une banque recoit un depot, elle en conserve une fraction en reserves obligatoires et prete le reste. Ce pret, une fois depense, revient dans le systeme bancaire sous forme de nouveau depot, permettant un nouveau credit. Ce processus en cascade multiplie la quantite de monnaie en circulation bien au-dela du depot initial.",
  limites: [
    "Le modele suppose que chaque banque prete le maximum autorise a chaque tour",
    "Il ignore les reserves excedentaires volontaires des banques",
    "La demande de credit est supposee illimitee",
    "Le modele ne tient pas compte du risque de defaut sur les prets",
    "Les taux de reserves et de fuite sont supposes constants a chaque tour",
  ],
  realite: [
    "En zone euro, le taux de reserves obligatoires est de 1 % depuis 2012",
    "Les banques centrales modernes pilotent la creation monetaire par les taux directeurs plutot que par les reserves obligatoires",
    "La creation monetaire reelle depend de la volonte des banques de preter et des agents d'emprunter",
    "En pratique, les banques ne pretent pas mecaniquement a partir des depots : elles creent la monnaie au moment du credit",
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
    unit: 'EUR',
    tooltip: "Montant du depot initial place dans le systeme bancaire",
    group: 'Depot',
  },
  {
    id: 'taux_reserves',
    label: 'Taux de reserves obligatoires',
    type: 'slider',
    min: 1,
    max: 25,
    step: 0.5,
    defaultValue: 2,
    unit: '%',
    tooltip: "Part du depot que la banque doit conserver en reserves aupres de la banque centrale",
    group: 'Parametres bancaires',
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
    tooltip: "Part de la monnaie creee retiree en especes a chaque tour (sort du circuit bancaire)",
    group: 'Parametres bancaires',
  },
  {
    id: 'nb_tours',
    label: 'Nombre de tours de credit',
    type: 'slider',
    min: 1,
    max: 30,
    step: 1,
    defaultValue: 15,
    group: 'Simulation',
  },
];

const scenarios: Scenario[] = moneyCreationScenarios.map((s) => ({
  id: s.id,
  label: s.title,
  description: s.description,
  values: {
    depot_initial: s.initialDeposit,
    taux_reserves: s.reserveRatio * 100,
    taux_fuite_billets: s.cashPreference * 100,
    nb_tours: s.rounds,
  },
}));

/**
 * Creation monetaire par reserves fractionnaires
 *
 * Reserve rate r = taux_reserves / 100
 * Leak rate (billets) b = taux_fuite_billets / 100
 * Money multiplier m = 1 / (r + b)
 *
 * A chaque tour n :
 *   depot_n = D0 * (1 - r - b)^n
 *   reserves_n = depot_n * r
 *   billets_n = depot_n * b
 *   credit_n = depot_n * (1 - r - b)  (= depot au tour suivant)
 *
 * Monnaie totale creee (asymptote) = D0 * m = D0 / (r + b)
 */
function compute(values: Record<string, number | boolean | string>): ComputeResult {
  const D0 = values.depot_initial as number;
  const r = (values.taux_reserves as number) / 100;
  const b = (values.taux_fuite_billets as number) / 100;
  const nbTours = values.nb_tours as number;

  const alpha = 1 - r - b;
  const m = 1 / (r + b);
  const asymptote = D0 * m;

  const bars: CascadeBar[] = [];
  let cumulative = 0;
  let reservesTotales = 0;
  let billetsTotaux = 0;

  for (let n = 0; n <= nbTours; n++) {
    const depot = D0 * Math.pow(alpha, n);
    const reserves = depot * r;
    const billets = depot * b;
    const credit = depot * alpha; // pret accorde, qui deviendra le depot du tour suivant

    cumulative += depot;
    reservesTotales += reserves;
    billetsTotaux += billets;

    bars.push({
      round: n,
      total: round2(depot),
      consumption: round2(credit),  // credit accorde (analogue a la consommation dans le Keynesian)
      savings: round2(reserves),    // reserves obligatoires (analogue a l'epargne)
      taxes: 0,
      imports: round2(billets),     // fuite en billets (analogue aux importations)
      cumulative: round2(cumulative),
    });
  }

  const cascadeData: CascadeData = {
    type: 'bar-cascade',
    bars,
    asymptote: round2(asymptote),
    multiplier: round2(m),
  };

  // Narration
  const convergencePct = round2((cumulative / asymptote) * 100);
  const observation =
    `Un depot initial de ${D0.toLocaleString('fr-FR')} EUR genere, apres ${nbTours} tours de credit, ` +
    `une masse monetaire cumulee de ${round2(cumulative).toLocaleString('fr-FR')} EUR ` +
    `(soit ${convergencePct}% de l'asymptote theorique de ${round2(asymptote).toLocaleString('fr-FR')} EUR).`;

  let interpretation =
    `Le multiplicateur de credit est de ${round2(m)}, ce qui signifie que chaque euro depose permet ` +
    `theoriquement de creer ${round2(m)} euros de monnaie au total. `;

  interpretation +=
    `A chaque tour, la banque conserve ${(r * 100).toFixed(1)}% en reserves obligatoires`;
  if (b > 0) {
    interpretation += ` et ${(b * 100).toFixed(0)}% sort du circuit sous forme de billets`;
  }
  interpretation += `. Le reste (${(alpha * 100).toFixed(1)}%) est prete et revient dans le systeme bancaire comme nouveau depot. `;

  interpretation +=
    `Ce processus en cascade converge vers l'asymptote car les depots diminuent geometriquement ` +
    `(facteur ${round2(alpha)} a chaque tour).`;

  if (m > 20) {
    interpretation +=
      " Attention : un multiplicateur aussi eleve est theorique. En pratique, les banques detiennent des reserves excedentaires et la demande de credit n'est pas illimitee.";
  } else if (m < 3) {
    interpretation +=
      " Le multiplicateur est relativement faible, ce qui traduit un systeme bancaire tres contraint par les reserves et/ou les fuites en billets.";
  }

  return {
    outputs: [
      { id: 'multiplicateur_monetaire', label: 'Multiplicateur monetaire', value: round2(m) },
      { id: 'monnaie_totale_creee', label: 'Monnaie totale creee (asymptote)', value: round2(asymptote), unit: 'EUR' },
      { id: 'reserves_totales', label: 'Reserves totales', value: round2(reservesTotales), unit: 'EUR' },
      { id: 'billets_total', label: 'Billets en circulation', value: round2(billetsTotaux), unit: 'EUR' },
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
