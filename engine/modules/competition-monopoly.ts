import type {
  SimulationModule,
  SimulationInput,
  Scenario,
  ComputeResult,
  ModuleMeta,
  ChartData,
  Point,
  Series,
  Annotation,
} from '../types';
import { registerModule } from '../core/registry';

const meta: ModuleMeta = {
  slug: 'concurrence-monopole',
  title: 'Concurrence parfaite vs Monopole',
  subtitle: 'Structures de marche et bien-etre collectif',
  theme: 'micro',
  level: 'intermediate',
  introduction:
    "Ce module compare les equilibres de marche en concurrence parfaite et en monopole. En concurrence parfaite, le prix egal le cout marginal et la quantite produite est maximale. Le monopole restreint la production pour augmenter son prix, generant un profit mais aussi une perte seche (deadweight loss) pour la societe. L'ecart entre les deux equilibres mesure le cout social du pouvoir de marche.",
  limites: [
    'Demande lineaire supposee, ce qui simplifie la realite',
    'Cout marginal constant (pas d\'economies d\'echelle)',
    'Marche pour un seul produit homogene',
    'Pas de discrimination par les prix ni de concurrence monopolistique',
  ],
  realite: [
    'La SNCF detient un monopole historique sur le rail longue distance en France',
    'Les brevets pharmaceutiques creent des monopoles temporaires (ex. vaccins COVID)',
    'La regulation des telecoms a brise le monopole de France Telecom en 1998',
    'Les GAFAM illustrent des situations de quasi-monopole sur le numerique',
  ],
};

const inputs: SimulationInput[] = [
  {
    id: 'demande_intercept',
    label: 'Prix maximum (intercept demande)',
    type: 'slider',
    min: 50,
    max: 200,
    step: 1,
    defaultValue: 100,
    unit: 'EUR',
    tooltip: 'Prix auquel la quantite demandee tombe a zero',
    group: 'Demande',
  },
  {
    id: 'pente_demande',
    label: 'Pente de la demande',
    type: 'slider',
    min: 0.5,
    max: 5,
    step: 0.1,
    defaultValue: 1,
    tooltip: 'Sensibilite de la quantite au prix (plus eleve = demande plus rigide)',
    group: 'Demande',
  },
  {
    id: 'cout_marginal',
    label: 'Cout marginal',
    type: 'slider',
    min: 5,
    max: 50,
    step: 1,
    defaultValue: 20,
    unit: 'EUR',
    tooltip: 'Cout de production d\'une unite supplementaire (constant)',
    group: 'Couts',
  },
  {
    id: 'cout_fixe',
    label: 'Cout fixe',
    type: 'slider',
    min: 0,
    max: 500,
    step: 10,
    defaultValue: 100,
    unit: 'EUR',
    tooltip: 'Couts fixes de production (independants de la quantite)',
    group: 'Couts',
  },
  {
    id: 'mode',
    label: 'Structure de marche',
    type: 'toggle',
    defaultValue: 'monopole',
    options: [
      { value: 'concurrence', label: 'Concurrence parfaite' },
      { value: 'monopole', label: 'Monopole' },
    ],
    tooltip: 'Comparer les deux structures de marche',
    group: 'Marche',
  },
];

const scenarios: Scenario[] = [
  {
    id: 'concurrence-pure',
    label: 'Concurrence pure et parfaite',
    description: 'Marche atomise, prix = cout marginal, profit nul a long terme',
    values: { demande_intercept: 100, pente_demande: 1, cout_marginal: 20, cout_fixe: 0, mode: 'concurrence' },
  },
  {
    id: 'monopole-naturel',
    label: 'Monopole naturel',
    description: 'Couts fixes tres eleves, un seul producteur efficace',
    values: { demande_intercept: 100, pente_demande: 1, cout_marginal: 10, cout_fixe: 400, mode: 'monopole' },
  },
  {
    id: 'monopole-couts-eleves',
    label: 'Monopole a couts eleves',
    description: 'Cout marginal eleve, marge reduite meme en monopole',
    values: { demande_intercept: 100, pente_demande: 1, cout_marginal: 45, cout_fixe: 100, mode: 'monopole' },
  },
  {
    id: 'quasi-concurrence',
    label: 'Quasi-concurrence',
    description: 'Demande tres elastique, le monopole a peu de pouvoir de marche',
    values: { demande_intercept: 60, pente_demande: 0.5, cout_marginal: 20, cout_fixe: 50, mode: 'monopole' },
  },
];

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

function round2(v: number): number {
  return Math.round(v * 100) / 100;
}

function compute(values: Record<string, number | boolean | string>): ComputeResult {
  const a = clamp(Number(values.demande_intercept) || 100, 50, 200);
  const b = clamp(Number(values.pente_demande) || 1, 0.5, 5);
  const Cm = clamp(Number(values.cout_marginal) || 20, 5, 50);
  const CF = clamp(Number(values.cout_fixe) || 100, 0, 500);
  const mode = String(values.mode || 'monopole');

  // Guard: demand intercept must exceed marginal cost
  const effectiveA = Math.max(a, Cm + 1);

  // Concurrence parfaite: P = Cm, Q_c = (a - Cm) / b
  const Q_c = Math.max(0, (effectiveA - Cm) / b);
  const P_c = Cm;
  const profitConcurrence = -CF; // long run economic profit = 0, accounting profit = -CF

  // Monopole: MR = a - 2bQ, set MR = Cm => Q_m = (a - Cm) / (2b)
  const Q_m = Math.max(0, (effectiveA - Cm) / (2 * b));
  const P_m = effectiveA - b * Q_m;
  const profitMonopole = (P_m - Cm) * Q_m - CF;

  // Perte seche (DWL)
  const DWL = 0.5 * (P_m - Cm) * (Q_c - Q_m);

  // Surplus du consommateur
  const surplusConsoConcurrence = 0.5 * (effectiveA - P_c) * Q_c;
  const surplusConsoMonopole = 0.5 * (effectiveA - P_m) * Q_m;

  // Build chart curves
  const maxQ = Q_c * 1.3;
  const nbPoints = 200;
  const demandCurve: Point[] = [];
  const mrCurve: Point[] = [];
  const cmLine: Point[] = [];

  for (let i = 0; i <= nbPoints; i++) {
    const q = (maxQ * i) / nbPoints;
    const pDemand = effectiveA - b * q;
    demandCurve.push({ x: q, y: Math.max(0, pDemand) });
    mrCurve.push({ x: q, y: Math.max(0, effectiveA - 2 * b * q) });
    cmLine.push({ x: q, y: Cm });
  }

  const series: Series[] = [
    {
      id: 'demande',
      label: 'Demande (P = a - bQ)',
      color: '#3b82f6',
      data: demandCurve,
      strokeWidth: 2.5,
    },
    {
      id: 'cout_marginal',
      label: 'Cout marginal (Cm)',
      color: '#10b981',
      data: cmLine,
      strokeWidth: 2,
      dashed: true,
    },
  ];

  if (mode === 'monopole') {
    series.push({
      id: 'recette_marginale',
      label: 'Recette marginale (MR)',
      color: '#f59e0b',
      data: mrCurve,
      strokeWidth: 2,
      dashed: true,
    });
  }

  const annotations: Annotation[] = [];

  // Equilibre concurrence
  annotations.push({
    type: 'point',
    x: Q_c,
    y: P_c,
    label: `Concurrence (Q=${Q_c.toFixed(1)}, P=${P_c.toFixed(0)})`,
    color: '#10b981',
  });

  if (mode === 'monopole') {
    // Equilibre monopole
    annotations.push({
      type: 'point',
      x: Q_m,
      y: P_m,
      label: `Monopole (Q=${Q_m.toFixed(1)}, P=${P_m.toFixed(0)})`,
      color: '#ef4444',
    });

    // DWL triangle area
    annotations.push({
      type: 'area',
      x1: Q_m,
      y1: P_m,
      x2: Q_c,
      y2: Cm,
      label: `Perte seche = ${DWL.toFixed(0)}`,
      color: '#ef4444',
    });

    // Monopoly profit area
    annotations.push({
      type: 'area',
      x1: 0,
      y1: P_m,
      x2: Q_m,
      y2: Cm,
      label: `Profit monopole = ${profitMonopole.toFixed(0)}`,
      color: '#8b5cf6',
    });
  }

  const maxPrice = effectiveA * 1.1;
  const chartData: ChartData = {
    type: 'line',
    series,
    xLabel: 'Quantite (Q)',
    yLabel: 'Prix (EUR)',
    xDomain: [0, maxQ],
    yDomain: [0, maxPrice],
    equilibrium: mode === 'monopole' ? { x: Q_m, y: P_m } : { x: Q_c, y: P_c },
    annotations,
  };

  // Narration
  let observation: string;
  let interpretation: string;

  if (mode === 'concurrence') {
    observation = `En concurrence parfaite, le prix s'etablit au cout marginal (${Cm} EUR) car la libre entree des firmes elimine tout profit economique. La quantite echangee est de ${Q_c.toFixed(1)} unites. Le surplus du consommateur atteint ${surplusConsoConcurrence.toFixed(0)} EUR.`;
    interpretation = `La concurrence parfaite maximise le surplus total (consommateur + producteur) de la societe. Aucune perte seche n'existe car toutes les unites dont la valeur pour le consommateur depasse le cout de production sont echangees. Le prix egal au cout marginal est la condition d'efficacite allocative.`;
    if (CF > 200) {
      interpretation += ` Attention : des couts fixes de ${CF} EUR rendent cette structure de marche difficile a maintenir. Si les prix restent au cout marginal, les entreprises ne couvrent pas leurs couts fixes et quittent le marche. En pratique, un marche avec des couts fixes eleves tend naturellement vers le monopole ou l'oligopole.`;
    }
  } else {
    const pctPrixHausse = ((P_m - P_c) / P_c * 100);
    const pctQteBaisse = ((Q_c - Q_m) / Q_c * 100);
    const markup = ((P_m - Cm) / P_m * 100);
    observation = `Le monopole fixe un prix de ${P_m.toFixed(0)} EUR (+${pctPrixHausse.toFixed(0)}% vs concurrence) pour une quantite de ${Q_m.toFixed(1)} unites (-${pctQteBaisse.toFixed(0)}%). Son taux de marge est de ${markup.toFixed(0)}%. La perte seche s'eleve a ${DWL.toFixed(0)} EUR et le profit a ${profitMonopole.toFixed(0)} EUR.`;
    interpretation = `Le monopoleur egalise recette marginale et cout marginal (Rm = Cm), pas prix et Cm. Comme la recette marginale est inferieure au prix (vendre plus exige de baisser le prix sur toutes les unites), le monopoleur restreint volontairement la production. Le surplus du consommateur chute de ${surplusConsoConcurrence.toFixed(0)} a ${surplusConsoMonopole.toFixed(0)} EUR. La perte seche de ${DWL.toFixed(0)} EUR represente des echanges mutuellement avantageux qui n'ont pas lieu : des consommateurs prets a payer plus que le cout marginal sont exclus du marche.`;

    if (profitMonopole < 0) {
      interpretation += ` Malgre le pouvoir de marche, les couts fixes de ${CF} EUR sont si eleves que le monopole est deficitaire. C'est le cas typique du monopole naturel (reseau ferroviaire, distribution d'eau) ou les couts fixes sont enormes mais le cout marginal est bas : une seule entreprise est plus efficace que plusieurs, mais elle ne peut pas couvrir ses couts au prix concurrentiel. D'ou la necessite d'une regulation publique (tarification au cout moyen, subvention).`;
    } else if (profitMonopole > 0 && markup > 50) {
      interpretation += ` Le taux de marge de ${markup.toFixed(0)}% est tres eleve, signe d'un fort pouvoir de marche. En pratique, une telle rente attire des concurrents potentiels : seules des barrieres a l'entree (brevets, monopole legal, effets de reseau) peuvent maintenir cette situation.`;
    }
  }

  return {
    outputs: [
      { id: 'prix_concurrence', label: 'Prix concurrence', value: round2(P_c), unit: 'EUR' },
      { id: 'quantite_concurrence', label: 'Quantite concurrence', value: round2(Q_c) },
      { id: 'prix_monopole', label: 'Prix monopole', value: round2(P_m), unit: 'EUR' },
      { id: 'quantite_monopole', label: 'Quantite monopole', value: round2(Q_m) },
      { id: 'profit_monopole', label: 'Profit monopole', value: round2(profitMonopole), unit: 'EUR' },
      { id: 'perte_seche', label: 'Perte seche (DWL)', value: round2(DWL), unit: 'EUR' },
      { id: 'surplus_conso_cpp', label: 'Surplus conso. (CPP)', value: round2(surplusConsoConcurrence), unit: 'EUR' },
      { id: 'surplus_conso_monopole', label: 'Surplus conso. (monopole)', value: round2(surplusConsoMonopole), unit: 'EUR' },
    ],
    chartData,
    narration: { observation, interpretation },
  };
}

const competitionMonopolyModule: SimulationModule = { meta, inputs, scenarios, compute };

registerModule(competitionMonopolyModule);

export { competitionMonopolyModule };
export default competitionMonopolyModule;
