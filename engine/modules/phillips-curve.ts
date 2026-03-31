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
  slug: 'courbe-de-phillips',
  title: 'Courbe de Phillips',
  subtitle: "L'arbitrage inflation-chomage",
  theme: 'macro',
  level: 'intermediate',
  introduction:
    "La courbe de Phillips illustre la relation inverse entre inflation et chomage. Dans sa version originale (1958), elle suggere un arbitrage stable. La version augmentee des anticipations (Friedman-Phelps) montre que cet arbitrage n'existe qu'a court terme : a long terme, l'economie revient au NAIRU.",
  limites: [
    "Relation instable dans le temps (stagflation des annees 1970)",
    "Le NAIRU est difficile a estimer avec precision",
    "Ignore les chocs d'offre dans la version originale",
    "Les anticipations rationnelles remettent en cause l'arbitrage meme a court terme",
  ],
  realite: [
    "La stagflation des annees 1970 a invalide la version originale",
    "Le NAIRU de la France est estime autour de 7-8% par l'OCDE",
    "La courbe de Phillips semble s'etre aplatie depuis les annees 2000",
  ],
};

const inputs: SimulationInput[] = [
  {
    id: 'nairu',
    label: 'NAIRU (taux de chomage naturel)',
    type: 'slider',
    min: 2,
    max: 12,
    step: 0.5,
    defaultValue: 7,
    unit: '%',
    tooltip: "Taux de chomage en dessous duquel l'inflation accelere",
    group: 'Structure',
  },
  {
    id: 'anticipations_inflation',
    label: "Anticipations d'inflation",
    type: 'slider',
    min: 0,
    max: 10,
    step: 0.5,
    defaultValue: 2,
    unit: '%',
    tooltip: "Taux d'inflation anticipe par les agents economiques",
    group: 'Anticipations',
  },
  {
    id: 'choc_offre',
    label: "Choc d'offre",
    type: 'slider',
    min: -5,
    max: 5,
    step: 0.5,
    defaultValue: 0,
    unit: '%',
    tooltip: "Choc exogene (ex: choc petrolier = valeur positive)",
    group: 'Chocs',
  },
  {
    id: 'mode_long_terme',
    label: 'Afficher le long terme',
    type: 'toggle',
    defaultValue: false,
    tooltip: "Affiche la courbe de Phillips verticale de long terme au NAIRU",
    group: 'Affichage',
  },
  {
    id: 'version_augmentee',
    label: 'Version augmentee (Friedman-Phelps)',
    type: 'toggle',
    defaultValue: true,
    tooltip: "Integre les anticipations d'inflation dans la courbe",
    group: 'Modele',
  },
];

const scenarios: Scenario[] = [
  {
    id: 'phillips_originale',
    label: 'Phillips originale (1958)',
    description: "Relation stable sans anticipations",
    values: { nairu: 5, anticipations_inflation: 0, choc_offre: 0, mode_long_terme: false, version_augmentee: false },
  },
  {
    id: 'friedman_phelps',
    label: 'Friedman-Phelps',
    description: "Avec anticipations adaptatives, arbitrage court terme seulement",
    values: { nairu: 7, anticipations_inflation: 2, choc_offre: 0, mode_long_terme: true, version_augmentee: true },
  },
  {
    id: 'choc_petrolier',
    label: 'Choc petrolier (1973)',
    description: "Choc d'offre positif, stagflation",
    values: { nairu: 6, anticipations_inflation: 4, choc_offre: 3, mode_long_terme: true, version_augmentee: true },
  },
  {
    id: 'desinflation',
    label: 'Politique de desinflation',
    description: "Anticipations elevees, politique restrictive pour les reduire",
    values: { nairu: 7, anticipations_inflation: 8, choc_offre: 0, mode_long_terme: true, version_augmentee: true },
  },
];

/**
 * Phillips originale: pi = -a * (u - u*) + epsilon
 *   where a is the slope coefficient, u* is NAIRU, epsilon is supply shock
 *
 * Phillips augmentee: pi = pi_e - a * (u - u*) + epsilon
 *   where pi_e is expected inflation
 *
 * We use a = 0.5 as default slope coefficient
 */
const SLOPE_COEFFICIENT = 0.5;

function phillipsCurve(
  chomage: number,
  nairu: number,
  anticipations: number,
  chocOffre: number,
  augmentee: boolean
): number {
  const base = augmentee ? anticipations : 0;
  return base - SLOPE_COEFFICIENT * (chomage - nairu) + chocOffre;
}

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

function compute(values: Record<string, number | boolean | string>): ComputeResult {
  const nairu = clamp(Number(values.nairu) || 7, 2, 12);
  const anticipations = clamp(Number(values.anticipations_inflation) || 2, 0, 10);
  const chocOffre = clamp(Number(values.choc_offre) || 0, -5, 5);
  const modeLongTerme = typeof values.mode_long_terme === 'boolean' ? values.mode_long_terme : false;
  const versionAugmentee = typeof values.version_augmentee === 'boolean' ? values.version_augmentee : true;

  const uMin = 0;
  const uMax = 20;
  const nbPoints = 100;

  // Short-run Phillips curve
  const shortRunCurve: Point[] = [];
  for (let i = 0; i <= nbPoints; i++) {
    const u = uMin + (uMax - uMin) * (i / nbPoints);
    const inflation = phillipsCurve(u, nairu, anticipations, chocOffre, versionAugmentee);
    shortRunCurve.push({ x: u, y: inflation });
  }

  // If augmented, show a second curve with different anticipations for comparison
  const altAnticipations = anticipations + 3;
  const altCurve: Point[] = [];
  if (versionAugmentee) {
    for (let i = 0; i <= nbPoints; i++) {
      const u = uMin + (uMax - uMin) * (i / nbPoints);
      const inflation = phillipsCurve(u, nairu, altAnticipations, chocOffre, true);
      altCurve.push({ x: u, y: inflation });
    }
  }

  // If no supply shock, show original (no anticipations) for comparison
  const originalCurve: Point[] = [];
  if (versionAugmentee && anticipations > 0) {
    for (let i = 0; i <= nbPoints; i++) {
      const u = uMin + (uMax - uMin) * (i / nbPoints);
      const inflation = phillipsCurve(u, nairu, 0, chocOffre, false);
      originalCurve.push({ x: u, y: inflation });
    }
  }

  const series: Series[] = [
    {
      id: 'phillips_ct',
      label: versionAugmentee
        ? `Phillips CT (pi_e = ${anticipations}%)`
        : 'Phillips originale',
      color: '#3b82f6',
      data: shortRunCurve,
      strokeWidth: 2.5,
    },
  ];

  if (versionAugmentee && altCurve.length > 0) {
    series.push({
      id: 'phillips_ct_alt',
      label: `Phillips CT (pi_e = ${altAnticipations}%)`,
      color: '#8b5cf6',
      data: altCurve,
      strokeWidth: 2,
      dashed: true,
    });
  }

  if (originalCurve.length > 0) {
    series.push({
      id: 'phillips_originale',
      label: 'Phillips originale (pi_e = 0)',
      color: '#94a3b8',
      data: originalCurve,
      strokeWidth: 1.5,
      dashed: true,
    });
  }

  if (modeLongTerme) {
    // Long-run Phillips curve: vertical at NAIRU
    series.push({
      id: 'phillips_lt',
      label: `LRPC (NAIRU = ${nairu}%)`,
      color: '#ef4444',
      data: [
        { x: nairu, y: -5 },
        { x: nairu, y: 20 },
      ],
      strokeWidth: 2.5,
      dashed: true,
    });
  }

  const inflationAtNairu = phillipsCurve(nairu, nairu, anticipations, chocOffre, versionAugmentee);

  const annotations: Annotation[] = [
    {
      type: 'point',
      x: nairu,
      y: inflationAtNairu,
      label: `NAIRU (${nairu}%, ${inflationAtNairu.toFixed(1)}%)`,
      color: '#10b981',
    },
  ];

  if (chocOffre !== 0) {
    annotations.push({
      type: 'label',
      x: 15,
      y: inflationAtNairu + chocOffre,
      label: `Choc d'offre: ${chocOffre > 0 ? '+' : ''}${chocOffre}%`,
      color: '#f59e0b',
    });
  }

  const chartData: ChartData = {
    type: 'line',
    series,
    xLabel: 'Taux de chomage (%)',
    yLabel: "Taux d'inflation (%)",
    xDomain: [uMin, uMax],
    yDomain: [-5, 15],
    annotations,
  };

  // Current inflation at NAIRU
  const inflationEquilibre = inflationAtNairu;
  // Sacrifice ratio: how much unemployment increase for 1% disinflation
  const ratioSacrifice = 1 / SLOPE_COEFFICIENT;

  // Narration
  let observation: string;
  let interpretation: string;

  if (!versionAugmentee) {
    observation = `La courbe de Phillips originale montre une relation inverse stable : au NAIRU de ${nairu}%, l'inflation serait de ${inflationEquilibre.toFixed(1)}%. Reduire le chomage de 1 point augmenterait l'inflation de ${SLOPE_COEFFICIENT} point.`;
    interpretation = "Cette version suppose que les agents ne forment pas d'anticipations d'inflation. Elle a ete remise en cause par la stagflation des annees 1970.";
  } else {
    observation = `Avec des anticipations d'inflation a ${anticipations}%, la courbe de Phillips de court terme se deplace vers le haut. Au NAIRU (${nairu}%), l'inflation effective est de ${inflationEquilibre.toFixed(1)}%.`;
    interpretation = `Le ratio de sacrifice est de ${ratioSacrifice.toFixed(1)} : pour reduire l'inflation de 1 point, il faut accepter une hausse du chomage de ${ratioSacrifice.toFixed(1)} point au-dessus du NAIRU pendant un an.`;

    if (chocOffre > 0) {
      interpretation += ` Le choc d'offre positif de ${chocOffre}% deplace la courbe vers le haut : c'est le mecanisme de la stagflation (inflation et chomage augmentent simultanement).`;
    } else if (chocOffre < 0) {
      interpretation += ` Le choc d'offre negatif de ${chocOffre}% deplace la courbe vers le bas, permettant une desinflation sans cout en chomage.`;
    }

    if (modeLongTerme) {
      interpretation += ` A long terme, la courbe est verticale au NAIRU : il n'y a pas d'arbitrage permanent entre inflation et chomage.`;
    }
  }

  return {
    outputs: [
      { id: 'nairu', label: 'NAIRU', value: nairu, unit: '%' },
      { id: 'inflation_equilibre', label: "Inflation a l'equilibre", value: round2(inflationEquilibre), unit: '%' },
      { id: 'ratio_sacrifice', label: 'Ratio de sacrifice', value: round2(ratioSacrifice) },
      { id: 'pente', label: 'Pente de la courbe', value: round2(SLOPE_COEFFICIENT) },
    ],
    chartData,
    narration: { observation, interpretation },
  };
}

function round2(v: number): number {
  return Math.round(v * 100) / 100;
}

const phillipsCurveModule: SimulationModule = { meta, inputs, scenarios, compute };

registerModule(phillipsCurveModule);

export { phillipsCurveModule };
export default phillipsCurveModule;
