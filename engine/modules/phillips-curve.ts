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
  subtitle: "L'arbitrage inflation-chômage",
  theme: 'macro',
  level: 'intermediate',
  introduction:
    "La courbe de Phillips illustre la relation inverse entre inflation et chômage. Dans sa version originale (1958), elle suggere un arbitrage stable. La version augmentée des anticipations (Friedman-Phelps) montre que cet arbitrage n'existe qu'a court terme : à long terme, l'économie revient au NAIRU.",
  limites: [
    "Relation instable dans le temps (stagflation des années 1970)",
    "Le NAIRU est difficile a estimer avec précision",
    "Ignore les chocs d'offre dans la version originale",
    "Les anticipations rationnelles remettent en cause l'arbitrage même à court terme",
  ],
  economists: ['alban-william-phillips', 'milton-friedman'],
  realite: [
    "La stagflation des années 1970 a invalide la version originale",
    "Le NAIRU de la France est estime autour de 7-8% par l'OCDE",
    "La courbe de Phillips semble s'être aplatie depuis les années 2000",
  ],
};

const inputs: SimulationInput[] = [
  {
    id: 'nairu',
    label: 'NAIRU (taux de chômage naturel)',
    type: 'slider',
    min: 2,
    max: 12,
    step: 0.5,
    defaultValue: 7,
    unit: '%',
    tooltip: "Taux de chômage en dessous duquel l'inflation accélère",
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
    tooltip: "Taux d'inflation anticipe par les agents économiques",
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
    tooltip: "Choc exogene (ex: choc pétrolier = valeur positive)",
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
    label: 'Version augmentée (Friedman-Phelps)',
    type: 'toggle',
    defaultValue: true,
    tooltip: "Integre les anticipations d'inflation dans la courbe",
    group: 'Modèle',
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
    label: 'Choc pétrolier (1973)',
    description: "Choc d'offre positif, stagflation",
    values: { nairu: 6, anticipations_inflation: 4, choc_offre: 3, mode_long_terme: true, version_augmentee: true },
  },
  {
    id: 'désinflation',
    label: 'Politique de désinflation',
    description: "Anticipations élevées, politique restrictive pour les réduire",
    values: { nairu: 7, anticipations_inflation: 8, choc_offre: 0, mode_long_terme: true, version_augmentee: true },
  },
];

/**
 * Phillips originale: pi = -a * (u - u*) + epsilon
 *   where a is the slope coefficient, u* is NAIRU, epsilon is supply shock
 *
 * Phillips augmentée: pi = pi_e - a * (u - u*) + epsilon
 *   where pi_e is expected inflation
 *
 * We use a = 0.5 as default slope coefficient
 */
const SLOPE_COEFFICIENT = 0.5;

function phillipsCurve(
  chômage: number,
  nairu: number,
  anticipations: number,
  chocOffre: number,
  augmentée: boolean
): number {
  const base = augmentée ? anticipations : 0;
  return base - SLOPE_COEFFICIENT * (chômage - nairu) + chocOffre;
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

  // If augmented, show a second curve with différent anticipations for comparison
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
        ? `Court terme (anticipations ${anticipations}%)`
        : 'Courbe originale',
      color: '#3b82f6',
      data: shortRunCurve,
      strokeWidth: 2.5,
    },
  ];

  if (versionAugmentee && altCurve.length > 0) {
    series.push({
      id: 'phillips_ct_alt',
      label: `Court terme (anticipations ${altAnticipations}%)`,
      color: '#8b5cf6',
      data: altCurve,
      strokeWidth: 2,
      dashed: true,
    });
  }

  if (originalCurve.length > 0) {
    series.push({
      id: 'phillips_originale',
      label: 'Courbe originale (sans anticipations)',
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
      label: `Long terme (vertical a ${nairu}%)`,
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
    xLabel: 'Taux de chômage (%)',
    yLabel: "Taux d'inflation (%)",
    xDomain: [uMin, uMax],
    yDomain: [Math.min(-3, inflationAtNairu - 4), Math.max(inflationAtNairu + 6, 12)],
    annotations,
    equilibrium: { x: nairu, y: inflationAtNairu },
  };

  // Current inflation at NAIRU
  const inflationEquilibre = inflationAtNairu;
  // Sacrifice ratio: how much unemployment increase for 1% disinflation
  const ratioSacrifice = 1 / SLOPE_COEFFICIENT;

  // Narration
  let observation: string;
  let interpretation: string;

  if (!versionAugmentee) {
    observation = `La courbe de Phillips originale montre une relation inverse stable : au NAIRU de ${nairu}%, l'inflation serait de ${inflationEquilibre.toFixed(1)}%. Reduire le chômage de 1 point augmenterait l'inflation de ${SLOPE_COEFFICIENT} point.`;
    interpretation = "Cette version suppose que les agents ne forment pas d'anticipations d'inflation. Elle a été remise en cause par la stagflation des années 1970 : l'inflation et le chômage augmentaient simultanément, ce qui était impossible selon la courbe originale.";
    if (nairu > 8) {
      interpretation += ` Un NAIRU élevé de ${nairu}% suggere des rigidités structurelles du marché du travail (protection de l'emploi, salaire minimum élevé, inadéquation des qualifications). La politique de demande ne peut pas réduire durablement le chômage en dessous de ce seuil.`;
    } else if (nairu < 4) {
      interpretation += ` Un NAIRU bas de ${nairu}% indique un marché du travail flexible, ou le chômage frictionnel est le seul irréductible.`;
    }
  } else {
    observation = `Avec des anticipations d'inflation a ${anticipations}%, la courbe de Phillips de court terme se déplace vers le haut. Au NAIRU (${nairu}%), l'inflation effective est de ${inflationEquilibre.toFixed(1)}%. Chaque point de chômage en dessous du NAIRU ajoute ${SLOPE_COEFFICIENT} point d'inflation.`;
    interpretation = `Le ratio de sacrifice est de ${ratioSacrifice.toFixed(1)} : pour réduire l'inflation de 1 point, il faut accepter une hausse du chômage de ${ratioSacrifice.toFixed(1)} point au-dessus du NAIRU pendant un an. C'est le "prix" de la désinflation.`;

    if (anticipations > 5) {
      interpretation += ` Les anticipations élevées (${anticipations}%) créent une inertie inflationniste : même au NAIRU, l'inflation reste a ${anticipations}% car les agents intèg la hausse des prix future dans leurs décisions salariales et contractuelles. Reduire ces anticipations nécessité une politique restrictive couteuse en chômage (credibilite de la banque centrale).`;
    } else if (anticipations >= 1.5 && anticipations <= 3) {
      interpretation += ` Les anticipations d'inflation sont bien ancrees autour de la cible de la banque centrale (environ 2%). C'est la situation ideale ou la politique monétaire est credible.`;
    }

    if (chocOffre > 0) {
      interpretation += ` Le choc d'offre positif de ${chocOffre}% (hausse des coûts de production, ex. pétrole) déplace la courbe vers le haut : c'est le mécanisme de la stagflation. La banque centrale fait face à un dilemme : lutter contre l'inflation aggraverait le chômage, et stimuler l'emploi alimenterait l'inflation.`;
    } else if (chocOffre < 0) {
      interpretation += ` Le choc d'offre favorable de ${Math.abs(chocOffre)}% (baisse des coûts, progrès technique) déplace la courbe vers le bas, permettant une désinflation sans coût en chômage - c'est la situation rêvée des banques centrales.`;
    }

    if (modeLongTerme) {
      interpretation += ` A long terme, la courbe est verticale au NAIRU (${nairu}%) : les anticipations s'ajustent à l'inflation réelle et il n'y a pas d'arbitrage permanent entre inflation et chômage. Toute tentative de maintenir le chômage sous le NAIRU se traduit par une accélération indefinie de l'inflation (accélérationniste de Friedman).`;
    }
  }

  return {
    outputs: [
      { id: 'nairu', label: 'NAIRU', value: nairu, unit: '%' },
      { id: 'inflation_equilibre', label: "Inflation à l'équilibre", value: round2(inflationEquilibre), unit: '%' },
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
