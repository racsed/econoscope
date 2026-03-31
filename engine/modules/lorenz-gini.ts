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
  slug: 'courbe-de-lorenz-gini',
  title: 'Courbe de Lorenz et coefficient de Gini',
  subtitle: "Mesurer les inégalités de revenus",
  theme: 'inequality',
  level: 'intermediate',
  introduction:
    "La courbe de Lorenz représente graphiquement la répartition des revenus : elle indique quelle part du revenu total est detenue par quel pourcentage de la population. Le coefficient de Gini (entre 0 et 1) mesure l'écart entre cette répartition et l'égalité parfaite. Plus le Gini est élevé, plus les inégalités sont fortes.",
  limites: [
    "Ne distingue pas les inégalités en haut et en bas de la distribution",
    "Deux distributions différentes peuvent avoir le même Gini",
    "Ne tient pas compte des transferts en nature (sante, education)",
    "Sensible à la definition du revenu retenue (avant/après impots)",
  ],
  realite: [
    "Le Gini de la France est d'environ 0.29 (après redistribution), parmi les plus bas de l'OCDE",
    "Les pays scandinaves ont un Gini autour de 0.25, les États-Unis autour de 0.39",
    "Le Gini mondial est d'environ 0.70, refletant les inégalités entre pays",
    "En France, les 10% les plus riches détiennent environ 25% du revenu total",
  ],
};

const inputs: SimulationInput[] = [
  {
    id: 'preset',
    label: 'Distribution prédéfinie',
    type: 'select',
    defaultValue: 'france',
    options: [
      { value: 'égalité', label: 'Égalité parfaite' },
      { value: 'france', label: 'France (2022)' },
      { value: 'usa', label: 'États-Unis (2022)' },
      { value: 'bresil', label: 'Bresil (2022)' },
      { value: 'personnalise', label: 'Personnalise' },
    ],
    group: 'Distribution',
  },
  { id: 'd1', label: 'D1 (10% les plus pauvres)', type: 'slider', min: 0, max: 20, step: 0.1, defaultValue: 3.5, unit: '%', group: 'Deciles' },
  { id: 'd2', label: 'D2', type: 'slider', min: 0, max: 20, step: 0.1, defaultValue: 5.0, unit: '%', group: 'Deciles' },
  { id: 'd3', label: 'D3', type: 'slider', min: 0, max: 20, step: 0.1, defaultValue: 6.0, unit: '%', group: 'Deciles' },
  { id: 'd4', label: 'D4', type: 'slider', min: 0, max: 20, step: 0.1, defaultValue: 7.0, unit: '%', group: 'Deciles' },
  { id: 'd5', label: 'D5', type: 'slider', min: 0, max: 20, step: 0.1, defaultValue: 8.0, unit: '%', group: 'Deciles' },
  { id: 'd6', label: 'D6', type: 'slider', min: 0, max: 20, step: 0.1, defaultValue: 9.5, unit: '%', group: 'Deciles' },
  { id: 'd7', label: 'D7', type: 'slider', min: 0, max: 20, step: 0.1, defaultValue: 11.0, unit: '%', group: 'Deciles' },
  { id: 'd8', label: 'D8', type: 'slider', min: 0, max: 25, step: 0.1, defaultValue: 13.0, unit: '%', group: 'Deciles' },
  { id: 'd9', label: 'D9', type: 'slider', min: 0, max: 30, step: 0.1, defaultValue: 16.0, unit: '%', group: 'Deciles' },
  { id: 'd10', label: 'D10 (10% les plus riches)', type: 'slider', min: 0, max: 50, step: 0.1, defaultValue: 21.0, unit: '%', group: 'Deciles' },
  {
    id: 'taux_tranche1',
    label: "Taux d'imposition tranche 1 (D1-D4)",
    type: 'slider',
    min: 0,
    max: 50,
    step: 1,
    defaultValue: 5,
    unit: '%',
    tooltip: "Taux applique aux 40% les plus modestes",
    group: 'Redistribution',
  },
  {
    id: 'taux_tranche2',
    label: "Taux d'imposition tranche 2 (D5-D7)",
    type: 'slider',
    min: 0,
    max: 60,
    step: 1,
    defaultValue: 20,
    unit: '%',
    tooltip: "Taux applique aux classes moyennes",
    group: 'Redistribution',
  },
  {
    id: 'taux_tranche3',
    label: "Taux d'imposition tranche 3 (D8-D10)",
    type: 'slider',
    min: 0,
    max: 70,
    step: 1,
    defaultValue: 35,
    unit: '%',
    tooltip: "Taux applique aux 30% les plus aises",
    group: 'Redistribution',
  },
  {
    id: 'transferts',
    label: 'Transferts forfaitaires',
    type: 'slider',
    min: 0,
    max: 10,
    step: 0.5,
    defaultValue: 2,
    unit: '%',
    tooltip: "Transfert redistributif verse à chaque décile (en % du revenu total)",
    group: 'Redistribution',
  },
];

const PRESETS: Record<string, number[]> = {
  égalité: [10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
  france: [3.5, 5.0, 6.0, 7.0, 8.0, 9.5, 11.0, 13.0, 16.0, 21.0],
  usa: [2.0, 3.5, 4.5, 5.5, 7.0, 8.5, 11.0, 14.0, 18.5, 25.5],
  bresil: [1.0, 2.0, 3.0, 4.0, 5.5, 7.0, 9.0, 13.0, 18.5, 37.0],
};

const scenarios: Scenario[] = [
  {
    id: 'france_avant',
    label: 'France avant redistribution',
    description: "Distribution primaire des revenus",
    values: { preset: 'france', d1: 3.5, d2: 5.0, d3: 6.0, d4: 7.0, d5: 8.0, d6: 9.5, d7: 11.0, d8: 13.0, d9: 16.0, d10: 21.0, taux_tranche1: 0, taux_tranche2: 0, taux_tranche3: 0, transferts: 0 },
  },
  {
    id: 'france_apres',
    label: 'France après redistribution',
    description: "Avec impots progressifs et transferts",
    values: { preset: 'france', d1: 3.5, d2: 5.0, d3: 6.0, d4: 7.0, d5: 8.0, d6: 9.5, d7: 11.0, d8: 13.0, d9: 16.0, d10: 21.0, taux_tranche1: 5, taux_tranche2: 20, taux_tranche3: 35, transferts: 2 },
  },
  {
    id: 'usa_inegalitaire',
    label: 'États-Unis',
    description: "Distribution plus inégalitaire",
    values: { preset: 'usa', d1: 2.0, d2: 3.5, d3: 4.5, d4: 5.5, d5: 7.0, d6: 8.5, d7: 11.0, d8: 14.0, d9: 18.5, d10: 25.5, taux_tranche1: 0, taux_tranche2: 0, taux_tranche3: 0, transferts: 0 },
  },
  {
    id: 'redistribution_forte',
    label: 'Redistribution forte',
    description: "Impots progressifs élevés et transferts généreux",
    values: { preset: 'france', d1: 3.5, d2: 5.0, d3: 6.0, d4: 7.0, d5: 8.0, d6: 9.5, d7: 11.0, d8: 13.0, d9: 16.0, d10: 21.0, taux_tranche1: 0, taux_tranche2: 25, taux_tranche3: 50, transferts: 5 },
  },
];

function getDeciles(values: Record<string, number | boolean | string>): number[] {
  const preset = values.preset as string;
  if (preset !== 'personnalise' && PRESETS[preset]) {
    return [...PRESETS[preset]];
  }
  return [
    Number(values.d1) || 10, Number(values.d2) || 10, Number(values.d3) || 10,
    Number(values.d4) || 10, Number(values.d5) || 10, Number(values.d6) || 10,
    Number(values.d7) || 10, Number(values.d8) || 10, Number(values.d9) || 10,
    Number(values.d10) || 10,
  ];
}

function normalizeDeciles(déciles: number[]): number[] {
  const sum = déciles.reduce((a, b) => a + b, 0);
  if (sum === 0) return déciles.map(() => 10);
  return déciles.map((d) => (d / sum) * 100);
}

function computeGini(déciles: number[]): number {
  const normalized = normalizeDeciles(déciles);
  const n = normalized.length;

  const cumShares: number[] = [0];
  let cumSum = 0;
  for (const share of normalized) {
    cumSum += share / 100;
    cumShares.push(cumSum);
  }

  let areaUnderLorenz = 0;
  for (let i = 0; i < n; i++) {
    const x0 = i / n;
    const x1 = (i + 1) / n;
    const y0 = cumShares[i];
    const y1 = cumShares[i + 1];
    areaUnderLorenz += 0.5 * (y0 + y1) * (x1 - x0);
  }

  return Math.max(0, Math.min(1, 1 - 2 * areaUnderLorenz));
}

function buildLorenzPoints(déciles: number[]): Point[] {
  const normalized = normalizeDeciles(déciles);
  const points: Point[] = [{ x: 0, y: 0 }];
  let cumPop = 0;
  let cumIncome = 0;

  for (let i = 0; i < normalized.length; i++) {
    cumPop += 10;
    cumIncome += normalized[i];
    points.push({ x: cumPop, y: cumIncome });
  }

  return points;
}

function applyRedistribution(
  déciles: number[],
  tauxTranche1: number,
  tauxTranche2: number,
  tauxTranche3: number,
  transferts: number
): number[] {
  const normalized = normalizeDeciles(déciles);
  const rates = [
    tauxTranche1 / 100, tauxTranche1 / 100, tauxTranche1 / 100, tauxTranche1 / 100,
    tauxTranche2 / 100, tauxTranche2 / 100, tauxTranche2 / 100,
    tauxTranche3 / 100, tauxTranche3 / 100, tauxTranche3 / 100,
  ];

  const afterTax = normalized.map((d, i) => d * (1 - rates[i]));
  const totalTax = normalized.reduce((sum, d, i) => sum + d * rates[i], 0);

  const transfertPerDecile = transferts;
  const totalTransferts = transfertPerDecile * 10;
  const remainingTax = totalTax - totalTransferts;

  const afterRedistribution = afterTax.map((d) => d + transfertPerDecile);

  if (remainingTax > 0) {
    const perDecile = remainingTax / 10;
    return afterRedistribution.map((d) => d + perDecile);
  }

  return afterRedistribution;
}

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

function compute(values: Record<string, number | boolean | string>): ComputeResult {
  const rawDeciles = getDeciles(values).map((d, i) => {
    const maxVal = i === 7 ? 25 : i === 8 ? 30 : i === 9 ? 50 : 20;
    return clamp(Number(d) || 10, 0, maxVal);
  });
  const tauxTranche1 = clamp(Number(values.taux_tranche1) || 5, 0, 50);
  const tauxTranche2 = clamp(Number(values.taux_tranche2) || 20, 0, 60);
  const tauxTranche3 = clamp(Number(values.taux_tranche3) || 35, 0, 70);
  const transferts = clamp(Number(values.transferts) || 2, 0, 10);

  const hasRedistribution = tauxTranche1 > 0 || tauxTranche2 > 0 || tauxTranche3 > 0 || transferts > 0;

  const giniAvant = computeGini(rawDeciles);
  const lorenzAvant = buildLorenzPoints(rawDeciles);

  let giniApres = giniAvant;
  let lorenzApres: Point[] = [];

  if (hasRedistribution) {
    const redistributed = applyRedistribution(rawDeciles, tauxTranche1, tauxTranche2, tauxTranche3, transferts);
    giniApres = computeGini(redistributed);
    lorenzApres = buildLorenzPoints(redistributed);
  }

  const equalityLine: Point[] = [
    { x: 0, y: 0 },
    { x: 100, y: 100 },
  ];

  const normalizedDeciles = normalizeDeciles(rawDeciles);
  const d10d1 = normalizedDeciles[9] / Math.max(0.01, normalizedDeciles[0]);
  const d9d1 = normalizedDeciles[8] / Math.max(0.01, normalizedDeciles[0]);
  const partTop10 = normalizedDeciles[9];
  const partBottom50 = normalizedDeciles.slice(0, 5).reduce((a, b) => a + b, 0);

  const series: Series[] = [
    {
      id: 'égalité',
      label: 'Égalité parfaite',
      color: '#94a3b8',
      data: equalityLine,
      strokeWidth: 1.5,
      dashed: true,
    },
    {
      id: 'lorenz_avant',
      label: hasRedistribution ? 'Lorenz avant redistribution' : 'Courbe de Lorenz',
      color: '#3b82f6',
      data: lorenzAvant,
      strokeWidth: 2.5,
      area: true,
      areaOpacity: 0.15,
    },
  ];

  if (hasRedistribution && lorenzApres.length > 0) {
    series.push({
      id: 'lorenz_apres',
      label: 'Lorenz après redistribution',
      color: '#10b981',
      data: lorenzApres,
      strokeWidth: 2.5,
      area: true,
      areaOpacity: 0.1,
    });
  }

  const annotations: Annotation[] = [
    {
      type: 'label',
      x: 30,
      y: 70,
      label: `Gini = ${giniAvant.toFixed(3)}`,
      color: '#3b82f6',
    },
  ];

  if (hasRedistribution) {
    annotations.push({
      type: 'label',
      x: 50,
      y: 40,
      label: `Gini après = ${giniApres.toFixed(3)}`,
      color: '#10b981',
    });
  }

  const chartData: ChartData = {
    type: 'area',
    series,
    xLabel: 'Part cumulee de la population (%)',
    yLabel: 'Part cumulee du revenu (%)',
    xDomain: [0, 100],
    yDomain: [0, 100],
    annotations,
  };

  const preset = values.preset as string;
  let observation = `Le coefficient de Gini est de ${giniAvant.toFixed(3)}. Geometriquement, le Gini représente le rapport entre l'aire situee entre la droite d'égalité parfaite et la courbe de Lorenz, et l'aire totale sous la droite d'égalité. Plus la courbe de Lorenz s'éloigne de la diagonale, plus le Gini est élevé. Les 10% les plus riches (D10) détiennent ${partTop10.toFixed(1)}% du revenu total, tandis que les 50% les plus modestes en détiennent ${partBottom50.toFixed(1)}%. Le rapport interdecile D10/D1 est de ${d10d1.toFixed(1)}.`;

  let interpretation: string;

  if (giniAvant < 0.25) {
    interpretation = "Cette distribution est relativement égalitaire (Gini < 0.25), comparable aux pays scandinaves (Suede ~0.25, Danemark ~0.26). Ces pays combinent impots élevés, transferts généreux et négociation salariale centralisee pour comprimer les écarts.";
  } else if (giniAvant < 0.35) {
    interpretation = "Cette distribution presente des inégalités moderees (Gini entre 0.25 et 0.35), typique des pays européens continentaux. La France se situe autour de 0.29 après redistribution grâce à un système socio-fiscal puissant.";
  } else if (giniAvant < 0.45) {
    interpretation = "Cette distribution presente des inégalités significatives (Gini entre 0.35 et 0.45), comparable aux États-Unis (~0.39). Les écarts de revenus sont marques, avec une concentration importante au sommet de la distribution.";
  } else {
    interpretation = "Cette distribution est tres inégalitaire (Gini > 0.45), comparable aux pays émergents comme le Bresil (~0.49) ou l'Afrique du Sud (~0.63). Une petite fraction de la population concentre l'essentiel des revenus.";
  }

  // Country-specific context for presets
  if (preset === 'france') {
    interpretation += " La distribution française avant redistribution presente des inégalités moderees. Le système fiscal et social (IR progressif, RSA, prime d'activité, aides au logement) réduit le Gini d'environ 45% - un des taux de redistribution les plus élevés de l'OCDE.";
  } else if (preset === 'usa') {
    interpretation += " La distribution americaine est marquee par de fortes inégalités de revenus primaires et une redistribution plus faible qu'en Europe. Les revenus du capital (tres concentres) et la fiscalité moins progressive expliquent cet écart.";
  } else if (preset === 'bresil') {
    interpretation += " La distribution bresilienne est l'une des plus inegalitaires au monde. L'héritage historique (esclavage, concentration fonciere), un système fiscal peu progressif et des services publics inegalement repartis expliquent cette situation.";
  }

  if (hasRedistribution) {
    const reductionGini = ((giniAvant - giniApres) / giniAvant) * 100;
    observation += ` Après redistribution, le Gini passe a ${giniApres.toFixed(3)} (la courbe de Lorenz après redistribution se rapproche de la diagonale).`;
    interpretation += ` La redistribution (impots progressifs + transferts forfaitaires de ${transferts}%) réduit le Gini de ${reductionGini.toFixed(1)}%. `;

    if (reductionGini > 30) {
      interpretation += "L'effet redistributif est tres fort. Le mécanisme est double : les impots progressifs compressent les hauts revenus (redistribution \"par le haut\") et les transferts forfaitaires augmentent proportionnellement plus les bas revenus (redistribution \"par le bas\").";
    } else if (reductionGini > 15) {
      interpretation += "L'effet redistributif est notable mais les inégalités restent presentes. Pour aller plus loin, il faudrait augmenter les taux des tranches supérieures ou les transferts forfaitaires.";
    } else if (reductionGini > 0) {
      interpretation += "L'effet redistributif est modeste. Des taux plus progressifs (augmenter le slider de la tranche 3) ou des transferts plus généreux seraient nécessaires pour une réduction significative des inégalités.";
    }
  }

  return {
    outputs: [
      { id: 'gini_avant', label: 'Gini avant redistribution', value: round3(giniAvant) },
      { id: 'gini_apres', label: 'Gini après redistribution', value: round3(giniApres), direction: giniApres < giniAvant ? 'down' : 'neutral' },
      { id: 'd10_d1', label: 'Rapport D10/D1', value: round2(d10d1) },
      { id: 'd9_d1', label: 'Rapport D9/D1', value: round2(d9d1) },
      { id: 'part_top10', label: 'Part des 10% les plus riches', value: round2(partTop10), unit: '%' },
      { id: 'part_bottom50', label: 'Part des 50% les plus modestes', value: round2(partBottom50), unit: '%' },
    ],
    chartData,
    narration: { observation, interpretation },
  };
}

function round2(v: number): number {
  return Math.round(v * 100) / 100;
}

function round3(v: number): number {
  return Math.round(v * 1000) / 1000;
}

const lorenzGiniModule: SimulationModule = { meta, inputs, scenarios, compute };

registerModule(lorenzGiniModule);

export { lorenzGiniModule };
export default lorenzGiniModule;
