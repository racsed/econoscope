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
  subtitle: 'Structures de marché et bien-être collectif',
  theme: 'micro',
  level: 'intermediate',
  introduction:
    "Ce module compare les équilibres de marché en concurrence parfaite et en monopole. En concurrence parfaite, le prix egal le coût marginal et la quantité produite est maximale. Le monopole restreint la production pour augmenter son prix, generant un profit mais aussi une perte sèche (deadweight loss) pour la société. L'écart entre les deux équilibres mesure le coût social du pouvoir de marché.",
  limites: [
    'Demande linéaire supposée, ce qui simplifie la réalité',
    'Coût marginal constant (pas d\'économies d\'échelle)',
    'Marché pour un seul produit homogène',
    'Pas de discrimination par les prix ni de concurrence monopolistique',
  ],
  economists: ['friedrich-hayek'],
  realite: [
    'La SNCF détient un monopole historique sur le rail longue distance en France',
    'Les brevets pharmaceutiques créent des monopoles temporaires (ex. vaccins COVID)',
    'La régulation des telecoms a brisé le monopole de France Telecom en 1998',
    'Les GAFAM illustrent des situations de quasi-monopole sur le numerique',
  ],
  course: {
    introduction: "La structure d'un marché determine la manière dont les prix se forment et la quantité de biens produits. Deux cas polaires encadrent le spectre : la concurrence parfaite, où une multitude de petites entreprises se font face sans pouvoir influencer le prix, et le monopole, où un seul producteur contrôle l'intégralité de l'offre. La comparaison de ces deux structures révèle un résultat fondamental : le monopole produit moins et vend plus cher que la concurrence, générant un profit pour le monopoleur mais une perte de bien-être pour la société.\n\nEn concurrence parfaite, les entreprises sont « preneuses de prix » (price takers) : elles acceptent le prix du marché car elles sont trop petites pour l'influencer. L'équilibre se situe au point où le prix égale le coût marginal de production. Le surplus total (somme du surplus du consommateur et du producteur) est maximal. Le monopoleur, en revanche, est « faiseur de prix » (price maker). Il sait que pour vendre davantage, il doit baisser son prix. Il choisit donc de restreindre sa production au point où la recette marginale égale le coût marginal, fixant un prix supérieur au coût marginal. La différence constitue sa marge.\n\nLe coût social du monopole se mesure par la perte sèche (deadweight loss) : l'aire du triangle entre les deux équilibres, représentant les échanges mutuellement bénéfiques qui n'ont pas lieu. C'est pourquoi les autorités de la concurrence (en France, l'Autorité de la concurrence) surveillent les concentrations et sanctionnent les abus de position dominante. Cependant, le monopole n'est pas toujours néfaste : les brevets créent des monopoles temporaires pour récompenser l'innovation (arbitrage entre incitation et accès), et les monopoles naturels (réseaux d'eau, d'électricité) sont plus efficaces qu'une concurrence fragmentée grâce aux économies d'échelle.",
    keyConcepts: [
      { term: "Concurrence parfaite", definition: "Structure de marché caractérisée par un grand nombre d'offreurs et de demandeurs, un produit homogène, une information parfaite et la libre entrée sur le marché. Aucune entreprise n'a de pouvoir de marché : le prix est fixé par la rencontre de l'offre et de la demande agrégées." },
      { term: "Monopole", definition: "Structure de marché où un seul producteur fournit l'ensemble du marché, sans substitut proche. Le monopoleur fixe le prix (ou la quantité) pour maximiser son profit. Sa courbe de demande est la courbe de demande du marché, ce qui lui confère un pouvoir de marché." },
      { term: "Recette marginale du monopoleur", definition: "Revenu supplémentaire obtenu en vendant une unité de plus. Pour le monopoleur, la recette marginale est inférieure au prix car, pour vendre une unité supplémentaire, il doit baisser le prix sur toutes les unités vendues. La courbe de recette marginale est en dessous de la courbe de demande." },
      { term: "Perte sèche (deadweight loss)", definition: "Perte de bien-être collectif due au monopole, mesurée par le triangle entre la courbe de demande, la courbe de coût marginal et les quantités de monopole et de concurrence. Elle représente la valeur des transactions qui auraient eu lieu en concurrence mais sont empêchées par le prix élevé du monopole." },
      { term: "Pouvoir de marché", definition: "Capacité d'une entreprise à fixer un prix supérieur au coût marginal. Il se mesure par l'indice de Lerner : L = (P - Cm) / P. En concurrence parfaite, L = 0. Pour un monopole, L dépend de l'élasticité de la demande. Plus la demande est inélastique, plus le pouvoir de marché est fort." },
    ],
    methodology: "Commencez par observer les deux équilibres simultanément : notez le prix et la quantité en concurrence et en monopole. Identifiez le surplus du consommateur, le profit du monopoleur et la perte sèche. Augmentez l'élasticité de la demande et observez comment l'écart entre les deux prix se réduit (le monopoleur a moins de pouvoir). Réduisez le coût marginal et constatez l'effet sur la production et le profit du monopole.",
    forTeachers: "Demandez aux élèves de citer des exemples de monopoles dans leur vie quotidienne (SNCF, brevets, GAFAM). Discutez : « Pourquoi l'État tolère-t-il certains monopoles (brevets) et en combat-il d'autres (ententes) ? ». Le simulateur permet de montrer visuellement pourquoi le monopole produit « trop peu et trop cher » par rapport à la concurrence.",
  },
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
    tooltip: 'Prix auquel la quantité demandée tombe a zéro',
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
    tooltip: 'Sensibilite de la quantité au prix (plus élevé = demande plus rigide)',
    group: 'Demande',
  },
  {
    id: 'cout_marginal',
    label: 'Coût marginal',
    type: 'slider',
    min: 5,
    max: 50,
    step: 1,
    defaultValue: 20,
    unit: 'EUR',
    tooltip: 'Coût de production d\'une unite supplémentaire (constant)',
    group: 'Coûts',
  },
  {
    id: 'cout_fixe',
    label: 'Coût fixe',
    type: 'slider',
    min: 0,
    max: 500,
    step: 10,
    defaultValue: 100,
    unit: 'EUR',
    tooltip: 'Coûts fixes de production (independants de la quantité)',
    group: 'Coûts',
  },
  {
    id: 'mode',
    label: 'Structure de marché',
    type: 'toggle',
    defaultValue: 'monopole',
    options: [
      { value: 'concurrence', label: 'Concurrence parfaite' },
      { value: 'monopole', label: 'Monopole' },
    ],
    tooltip: 'Comparer les deux structures de marché',
    group: 'Marche',
  },
];

const scenarios: Scenario[] = [
  {
    id: 'concurrence-pure',
    label: 'Concurrence pure et parfaite',
    description: 'Marché atomisé, prix = coût marginal, profit nul à long terme',
    values: { demande_intercept: 100, pente_demande: 1, cout_marginal: 20, cout_fixe: 0, mode: 'concurrence' },
  },
  {
    id: 'monopole-naturel',
    label: 'Monopole naturel',
    description: 'Coûts fixes très élevés, un seul producteur efficace',
    values: { demande_intercept: 100, pente_demande: 1, cout_marginal: 10, cout_fixe: 400, mode: 'monopole' },
  },
  {
    id: 'monopole-coûts-élevés',
    label: 'Monopole a coûts élevés',
    description: 'Coût marginal élevé, marge reduite même en monopole',
    values: { demande_intercept: 100, pente_demande: 1, cout_marginal: 45, cout_fixe: 100, mode: 'monopole' },
  },
  {
    id: 'quasi-concurrence',
    label: 'Quasi-concurrence',
    description: 'Demande très élastique, le monopole a peu de pouvoir de marché',
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

  // Perte sèche (DWL)
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
      label: 'Demande',
      color: '#3b82f6',
      data: demandCurve,
      strokeWidth: 2.5,
    },
    {
      id: 'cout_marginal',
      label: 'Cout marginal',
      color: '#10b981',
      data: cmLine,
      strokeWidth: 2,
      dashed: true,
    },
  ];

  if (mode === 'monopole') {
    series.push({
      id: 'recette_marginale',
      label: 'Recette marginale',
      color: '#f59e0b',
      data: mrCurve,
      strokeWidth: 2,
      dashed: true,
    });
  }

  const annotations: Annotation[] = [];

  // Équilibre concurrence
  annotations.push({
    type: 'point',
    x: Q_c,
    y: P_c,
    label: `Concurrence (Q=${Q_c.toFixed(1)}, P=${P_c.toFixed(0)})`,
    color: '#10b981',
  });

  if (mode === 'monopole') {
    // Équilibre monopole
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
      label: `Perte sèche = ${DWL.toFixed(0)}`,
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
    xLabel: 'Quantite',
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
    observation = `En concurrence parfaite, le prix s'établit au coût marginal (${Cm} EUR) car la libre entree des firmes élimine tout profit économique. La quantité échangée est de ${Q_c.toFixed(1)} unites. Le surplus du consommateur atteint ${surplusConsoConcurrence.toFixed(0)} EUR.`;
    interpretation = `La concurrence parfaite maximisé le surplus total (consommateur + producteur) de la société. Aucune perte sèche n'existe car toutes les unites dont la valeur pour le consommateur dépasse le coût de production sont échangées. Le prix egal au coût marginal est la condition d'efficacité allocative.`;
    if (CF > 200) {
      interpretation += ` Attention : des coûts fixes de ${CF} EUR rendent cette structure de marché difficile à maintenir. Si les prix restent au coût marginal, les entreprises ne couvrent pas leurs coûts fixes et quittent le marché. En pratique, un marché avec des coûts fixes élevés tend naturellement vers le monopole ou l'oligopole.`;
    }
  } else {
    const pctPrixHausse = ((P_m - P_c) / P_c * 100);
    const pctQteBaisse = ((Q_c - Q_m) / Q_c * 100);
    const markup = ((P_m - Cm) / P_m * 100);
    observation = `Le monopole fixe un prix de ${P_m.toFixed(0)} EUR (+${pctPrixHausse.toFixed(0)}% vs concurrence) pour une quantité de ${Q_m.toFixed(1)} unites (-${pctQteBaisse.toFixed(0)}%). Son taux de marge est de ${markup.toFixed(0)}%. La perte sèche s'élevé a ${DWL.toFixed(0)} EUR et le profit a ${profitMonopole.toFixed(0)} EUR.`;
    interpretation = `Le monopoleur egalise recette marginale et coût marginal (Rm = Cm), pas prix et Cm. Comme la recette marginale est inférieure au prix (vendre plus exige de baisser le prix sur toutes les unites), le monopoleur restreint volontairement la production. Le surplus du consommateur chute de ${surplusConsoConcurrence.toFixed(0)} a ${surplusConsoMonopole.toFixed(0)} EUR. La perte sèche de ${DWL.toFixed(0)} EUR représente des échanges mutuellement avantageux qui n'ont pas lieu : des consommateurs prêts à payer plus que le coût marginal sont exclus du marché.`;

    if (profitMonopole < 0) {
      interpretation += ` Malgre le pouvoir de marché, les coûts fixes de ${CF} EUR sont si élevés que le monopole est déficitaire. C'est le cas typique du monopole naturel (réseau ferroviaire, distribution d'eau) ou les coûts fixes sont énormes mais le coût marginal est bas : une seule entreprise est plus efficace que plusieurs, mais elle ne peut pas couvrir ses coûts au prix concurrentiel. D'ou la nécessité d'une régulation publique (tarification au coût moyen, subvention).`;
    } else if (profitMonopole > 0 && markup > 50) {
      interpretation += ` Le taux de marge de ${markup.toFixed(0)}% est très élevé, signe d'un fort pouvoir de marché. En pratique, une telle rente attire des concurrents potentiels : seules des barrieres à l'entree (brevets, monopole legal, effets de réseau) peuvent maintenir cette situation.`;
    }
  }

  return {
    outputs: [
      { id: 'prix_concurrence', label: 'Prix concurrence', value: round2(P_c), unit: 'EUR' },
      { id: 'quantite_concurrence', label: 'Quantité concurrence', value: round2(Q_c) },
      { id: 'prix_monopole', label: 'Prix monopole', value: round2(P_m), unit: 'EUR' },
      { id: 'quantite_monopole', label: 'Quantité monopole', value: round2(Q_m) },
      { id: 'profit_monopole', label: 'Profit monopole', value: round2(profitMonopole), unit: 'EUR' },
      { id: 'perte_seche', label: 'Perte seche', value: round2(DWL), unit: 'EUR' },
      { id: 'surplus_conso_cpp', label: 'Surplus consommateur en concurrence', value: round2(surplusConsoConcurrence), unit: 'EUR' },
      { id: 'surplus_conso_monopole', label: 'Surplus consommateur en monopole', value: round2(surplusConsoMonopole), unit: 'EUR' },
    ],
    chartData,
    narration: { observation, interpretation },
  };
}

const competitionMonopolyModule: SimulationModule = { meta, inputs, scenarios, compute };

registerModule(competitionMonopolyModule);

export { competitionMonopolyModule };
export default competitionMonopolyModule;
