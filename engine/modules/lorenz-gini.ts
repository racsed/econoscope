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
import { lorenzScenarios, getLorenzScenario } from '../../data/scenarios/lorenz-scenarios';

const meta: ModuleMeta = {
  slug: 'courbe-de-lorenz-gini',
  title: 'Courbe de Lorenz et coefficient de Gini',
  subtitle: 'Mesurer et visualiser les inegalites de revenus',
  theme: 'inequality',
  level: 'intermediate',
  introduction:
    "La courbe de Lorenz represente graphiquement la repartition des revenus dans une economie. Le coefficient de Gini, compris entre 0 (egalite parfaite) et 1 (inegalite maximale), mesure l'ecart entre la distribution observee et l'egalite parfaite. Ces outils sont essentiels pour comparer les inegalites entre pays et evaluer l'impact des politiques redistributives.",
  limites: [
    'La courbe de Lorenz ne capte pas les inegalites de patrimoine, souvent bien plus prononcees',
    'Le coefficient de Gini est une mesure synthetique : deux distributions tres differentes peuvent avoir le meme Gini',
    'Les donnees par deciles lissent les ecarts extremes (top 1 %, top 0,1 %)',
    'Les transferts forfaitaires modelises ici sont une simplification des mecanismes redistributifs reels',
    'Les revenus non declares et l\'economie informelle ne sont pas pris en compte',
  ],
  realite: [
    'En France, le systeme socio-fiscal reduit le Gini de 0,37 (avant redistribution) a 0,29 (apres)',
    'Les pays scandinaves maintiennent un Gini autour de 0,25 grace a une fiscalite fortement progressive',
    'Aux Etats-Unis, le Gini est passe de 0,35 en 1980 a 0,39 en 2023, illustrant la montee des inegalites',
    'Le RSA, la prime d\'activite et les allocations logement sont les principaux outils redistributifs en France',
  ],
};

/** Preset IDs mapped to slider index */
const PRESET_IDS = [
  'egalite-parfaite',
  'france-2023',
  'etats-unis',
  'scandinavie',
  'tres-inegalitaire',
] as const;

const PRESET_LABELS: Record<number, string> = {
  0: 'Egalite parfaite',
  1: 'France 2023',
  2: 'Etats-Unis',
  3: 'Scandinavie',
  4: 'Tres inegalitaire',
};

const inputs: SimulationInput[] = [
  {
    id: 'preset',
    label: 'Distribution de reference',
    type: 'slider',
    min: 0,
    max: 4,
    step: 1,
    defaultValue: 1,
    tooltip: '0 = Egalite parfaite, 1 = France 2023, 2 = Etats-Unis, 3 = Scandinavie, 4 = Tres inegalitaire',
    group: 'Distribution',
  },
  {
    id: 'transferts',
    label: 'Transferts forfaitaires',
    type: 'slider',
    min: 0,
    max: 500,
    step: 10,
    defaultValue: 0,
    unit: 'EUR/mois',
    tooltip:
      'Montant forfaitaire redistribue aux deciles inferieurs, finance par les deciles superieurs. Simule l\'effet d\'une politique redistributive.',
    group: 'Redistribution',
  },
];

const scenarios: Scenario[] = [
  {
    id: 'france_base',
    label: 'France 2023 (sans transferts)',
    description: 'Distribution francaise actuelle apres redistribution existante',
    values: { preset: 1, transferts: 0 },
  },
  {
    id: 'france_redistribution',
    label: 'France + transferts 200 EUR',
    description: 'Impact d\'un transfert forfaitaire supplementaire de 200 EUR/mois',
    values: { preset: 1, transferts: 200 },
  },
  {
    id: 'usa_base',
    label: 'Etats-Unis (sans transferts)',
    description: 'Distribution americaine, inegalites plus marquees',
    values: { preset: 2, transferts: 0 },
  },
  {
    id: 'usa_redistribution',
    label: 'Etats-Unis + transferts 300 EUR',
    description: 'Que se passerait-il avec une redistribution forte aux Etats-Unis ?',
    values: { preset: 2, transferts: 300 },
  },
  {
    id: 'scandinavie_base',
    label: 'Scandinavie',
    description: 'Le modele scandinave, reference en egalite',
    values: { preset: 3, transferts: 0 },
  },
  {
    id: 'inegalitaire_base',
    label: 'Economie tres inegalitaire',
    description: 'Cas stylise d\'extreme concentration des revenus',
    values: { preset: 4, transferts: 0 },
  },
  {
    id: 'inegalitaire_forte_redistribution',
    label: 'Tres inegalitaire + transferts 500 EUR',
    description: 'Redistribution maximale appliquee a une economie tres inegalitaire',
    values: { preset: 4, transferts: 500 },
  },
];

/**
 * Compute cumulative Lorenz curve points from decile shares.
 * Returns 11 points: (0,0) then cumulative for each decile.
 * Values in percentages (0-100).
 */
function computeLorenzPoints(deciles: number[]): Point[] {
  const points: Point[] = [{ x: 0, y: 0 }];
  let cumulative = 0;
  for (let i = 0; i < deciles.length; i++) {
    cumulative += deciles[i];
    points.push({ x: (i + 1) * 10, y: round2(cumulative) });
  }
  return points;
}

/**
 * Compute Gini coefficient from Lorenz curve points using the trapezoidal rule.
 * Gini = 1 - 2 * area under Lorenz curve
 * Area computed with points in [0,1] scale.
 */
function computeGini(lorenzPoints: Point[]): number {
  let area = 0;
  for (let i = 1; i < lorenzPoints.length; i++) {
    const dx = (lorenzPoints[i].x - lorenzPoints[i - 1].x) / 100;
    const avgY = (lorenzPoints[i].y + lorenzPoints[i - 1].y) / 200;
    area += dx * avgY;
  }
  return round4(1 - 2 * area);
}

/**
 * Apply flat transfers: add a fixed monthly amount to lower deciles,
 * financed proportionally by upper deciles.
 * Returns adjusted decile shares (still summing to 100).
 */
function applyTransfers(
  deciles: number[],
  transfertMensuel: number
): number[] {
  if (transfertMensuel === 0) return [...deciles];

  // Convert shares to absolute units (treat total as 10000 for precision)
  const total = 10000;
  const absolutes = deciles.map((d) => (d / 100) * total);

  // Transfer amount as proportion of total income
  // Assume median income ~2000 EUR/month => total decile income ~20000
  // transfert is per person in bottom 5 deciles, financed by top 5
  const transferPerDecile = transfertMensuel * 12; // annual
  const baseIncome = 2000 * 12; // annual reference per decile unit
  const transferShare = (transferPerDecile / baseIncome) * (total / 10);

  const adjusted = [...absolutes];

  // Bottom 5 deciles receive, top 5 finance
  // Amount received decreases as you go up, amount paid increases as you go up
  const receiveWeights = [5, 4, 3, 2, 1]; // bottom deciles receive more
  const payWeights = [1, 2, 3, 4, 5]; // top deciles pay more
  const totalReceiveWeight = receiveWeights.reduce((a, b) => a + b, 0);
  const totalPayWeight = payWeights.reduce((a, b) => a + b, 0);

  const totalTransfer = transferShare * 5;

  for (let i = 0; i < 5; i++) {
    adjusted[i] += (totalTransfer * receiveWeights[i]) / totalReceiveWeight;
  }
  for (let i = 5; i < 10; i++) {
    adjusted[i] -= (totalTransfer * payWeights[i - 5]) / totalPayWeight;
    // Ensure no negative share
    if (adjusted[i] < 0) adjusted[i] = 0;
  }

  // Renormalize to sum = 100
  const newTotal = adjusted.reduce((a, b) => a + b, 0);
  return adjusted.map((v) => round2((v / newTotal) * 100));
}

function compute(values: Record<string, number | boolean | string>): ComputeResult {
  const presetIndex = Math.round(values.preset as number);
  const transferts = values.transferts as number;

  const presetId = PRESET_IDS[presetIndex] ?? PRESET_IDS[1];
  const scenario = getLorenzScenario(presetId);
  const deciles = scenario ? [...scenario.deciles] : [10, 10, 10, 10, 10, 10, 10, 10, 10, 10];

  // Lorenz curve before transfers
  const lorenzAvant = computeLorenzPoints(deciles);
  const giniAvant = computeGini(lorenzAvant);

  // Apply transfers and recompute
  const decilesApres = applyTransfers(deciles, transferts);
  const lorenzApres = computeLorenzPoints(decilesApres);
  const giniApres = computeGini(lorenzApres);

  // Diagonal (equality line)
  const diagonal: Point[] = [];
  for (let i = 0; i <= 10; i++) {
    diagonal.push({ x: i * 10, y: i * 10 });
  }

  // Build series
  const series: Series[] = [];

  // Lorenz curve area (after transfers if applicable, otherwise before)
  const lorenzPrimary = transferts > 0 ? lorenzApres : lorenzAvant;

  if (transferts > 0) {
    // Lorenz avant (dashed, in background)
    series.push({
      id: 'lorenz_avant',
      label: 'Lorenz avant transferts',
      color: '#94a3b8',
      data: lorenzAvant,
      strokeWidth: 2,
      dashed: true,
    });
  }

  // Lorenz curve with area fill
  series.push({
    id: 'lorenz',
    label: transferts > 0 ? 'Lorenz apres transferts' : 'Courbe de Lorenz',
    color: '#3b82f6',
    data: lorenzPrimary,
    strokeWidth: 2.5,
    area: true,
    areaOpacity: 0.15,
  });

  // Annotations
  const annotations: Annotation[] = [
    {
      type: 'line',
      x1: 0,
      y1: 0,
      x2: 100,
      y2: 100,
      label: 'Egalite parfaite',
      color: '#10b981',
    },
  ];

  // Gini annotation
  annotations.push({
    type: 'label',
    x: 60,
    y: 25,
    label: `Gini = ${(transferts > 0 ? giniApres : giniAvant).toFixed(3)}`,
    color: '#3b82f6',
  });

  if (transferts > 0) {
    annotations.push({
      type: 'label',
      x: 60,
      y: 15,
      label: `Gini avant = ${giniAvant.toFixed(3)}`,
      color: '#94a3b8',
    });
  }

  const chartData: ChartData = {
    type: 'area',
    series,
    xLabel: 'Part cumulee de la population (%)',
    yLabel: 'Part cumulee des revenus (%)',
    xDomain: [0, 100],
    yDomain: [0, 100],
    annotations,
  };

  // Outputs
  const decilesRef = transferts > 0 ? decilesApres : deciles;
  const partD1 = decilesRef[0];
  const partD10 = decilesRef[9];
  const rapportInterdecile = partD1 > 0 ? round2(partD10 / partD1) : 999;

  const presetLabel = PRESET_LABELS[presetIndex] ?? 'Inconnu';

  // Narration
  let observation = `Pour la distribution "${presetLabel}", les 10 % les plus pauvres detiennent ${partD1.toFixed(1)} % des revenus et les 10 % les plus riches en captent ${partD10.toFixed(1)} %. Le rapport interdecile (D10/D1) est de ${rapportInterdecile.toFixed(1)}.`;

  let interpretation = `Le coefficient de Gini est de ${giniAvant.toFixed(3)}.`;

  if (transferts > 0) {
    const reductionGini = ((giniAvant - giniApres) / giniAvant) * 100;
    observation += ` Avec des transferts de ${transferts} EUR/mois, le Gini passe de ${giniAvant.toFixed(3)} a ${giniApres.toFixed(3)}, soit une reduction de ${reductionGini.toFixed(1)} %.`;
    interpretation = `Les transferts forfaitaires reduisent les inegalites en augmentant la part relative des deciles inferieurs. La courbe de Lorenz se rapproche de la diagonale. Cependant, un transfert forfaitaire est moins cible qu'un transfert sous conditions de ressources et son financement peut avoir des effets desincitatifs sur les deciles superieurs.`;
  } else if (giniAvant < 0.28) {
    interpretation += ' Cette valeur traduit une distribution relativement egalitaire, typique des pays a forte redistribution.';
  } else if (giniAvant < 0.35) {
    interpretation += ' Cette valeur est intermediaire, caracteristique des economies europeennes apres redistribution.';
  } else if (giniAvant < 0.45) {
    interpretation += ' Cette valeur traduit des inegalites significatives, comme aux Etats-Unis ou dans certains pays emergents.';
  } else {
    interpretation += ' Cette valeur elevee traduit une forte concentration des revenus, ou les classes les plus aisees captent une part disproportionnee du revenu national.';
  }

  return {
    outputs: [
      {
        id: 'gini_avant',
        label: 'Gini avant transferts',
        value: round2(giniAvant),
        direction: 'neutral',
      },
      {
        id: 'gini_apres',
        label: 'Gini apres transferts',
        value: round2(giniApres),
        direction: transferts > 0 ? 'down' : 'neutral',
      },
      {
        id: 'part_d1',
        label: 'Part D1 (10 % les plus pauvres)',
        value: round2(partD1),
        unit: '%',
        direction: transferts > 0 ? 'up' : 'neutral',
      },
      {
        id: 'part_d10',
        label: 'Part D10 (10 % les plus riches)',
        value: round2(partD10),
        unit: '%',
        direction: transferts > 0 ? 'down' : 'neutral',
      },
      {
        id: 'rapport_interdecile',
        label: 'Rapport interdecile (D10/D1)',
        value: rapportInterdecile,
        direction: transferts > 0 ? 'down' : 'neutral',
      },
    ],
    chartData,
    narration: { observation, interpretation },
  };
}

function round2(v: number): number {
  return Math.round(v * 100) / 100;
}

function round4(v: number): number {
  return Math.round(v * 10000) / 10000;
}

const lorenzGiniModule: SimulationModule = { meta, inputs, scenarios, compute };

registerModule(lorenzGiniModule);

export { lorenzGiniModule };
export default lorenzGiniModule;
