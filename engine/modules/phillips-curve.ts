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
  course: {
    introduction: "En 1958, l'économiste néo-zélandais Alban William Phillips publie une étude empirique montrant une relation inverse stable entre le taux de chômage et le taux de variation des salaires nominaux au Royaume-Uni sur près d'un siècle (1861-1957). Paul Samuelson et Robert Solow reformulent cette relation en termes d'inflation des prix, créant la célèbre « courbe de Phillips » : quand le chômage baisse, l'inflation augmente, et inversement. Ce résultat semblait offrir aux gouvernements un menu de choix : accepter un peu plus d'inflation pour réduire le chômage, ou l'inverse.\n\nCette vision optimiste est remise en cause dans les années 1960-70 par Milton Friedman et Edmund Phelps, qui introduisent le rôle des anticipations d'inflation. Selon eux, la courbe de Phillips n'est stable qu'à court terme. A long terme, les agents anticipent l'inflation et réclament des hausses de salaires correspondantes, annulant l'effet sur l'emploi. L'économie revient alors au taux de chômage naturel, appelé NAIRU (Non-Accelerating Inflation Rate of Unemployment). Toute tentative de maintenir le chômage en dessous du NAIRU se traduit par une inflation toujours plus élevée sans gain durable d'emploi.\n\nLa stagflation des années 1970 (chômage ET inflation élevés simultanément) a validé spectaculairement la critique de Friedman. Depuis, la version « augmentée des anticipations » est devenue le cadre standard. Toutefois, depuis les années 2000, la courbe semble s'être aplatie : de grands écarts de chômage ne produisent que de faibles variations d'inflation. Ce phénomène, appelé « aplatissement de la courbe de Phillips », reste un sujet de recherche actif et interroge l'efficacité des politiques monétaires conventionnelles.",
    keyConcepts: [
      { term: "Courbe de Phillips originale", definition: "Relation empirique inverse entre le taux de chômage et le taux d'inflation. Quand le chômage est bas, les tensions sur le marché du travail poussent les salaires et les prix à la hausse. Quand il est élevé, la faible demande de travail modère l'inflation." },
      { term: "NAIRU", definition: "Non-Accelerating Inflation Rate of Unemployment. Taux de chômage compatible avec une inflation stable. En dessous du NAIRU, l'inflation accélère ; au-dessus, elle décélère. Le NAIRU n'est pas directement observable et dépend de facteurs structurels (régulation du marché du travail, démographie)." },
      { term: "Anticipations d'inflation", definition: "Inflation future attendue par les agents économiques. Selon Friedman, les travailleurs négocient leurs salaires en fonction de l'inflation anticipée. Si la banque centrale tente de surprendre les agents par une inflation plus élevée, l'effet sur l'emploi n'est que temporaire." },
      { term: "Stagflation", definition: "Situation où l'inflation et le chômage sont simultanément élevés. Observée dans les années 1970 suite aux chocs pétroliers. La stagflation est incompatible avec la courbe de Phillips originale mais s'explique par des chocs d'offre combinés à des anticipations d'inflation élevées." },
      { term: "Arbitrage court terme / long terme", definition: "A court terme, une politique monétaire expansionniste peut réduire le chômage au prix d'un peu plus d'inflation (mouvement le long de la courbe). A long terme, les anticipations s'ajustent et la courbe se déplace vers le haut, ramenant le chômage au NAIRU avec une inflation durablement plus forte." },
    ],
    methodology: "Fixez d'abord les anticipations d'inflation à 0 % et observez la courbe de Phillips de court terme. Déplacez le curseur du chômage et notez la relation inverse avec l'inflation. Augmentez ensuite les anticipations d'inflation et observez le déplacement vers le haut de la courbe entière. Essayez de maintenir le chômage en dessous du NAIRU : voyez comment cela oblige à accepter une inflation croissante. Le scénario « stagflation » illustre un choc d'offre qui déplace simultanément la courbe.",
    forTeachers: "Racontez l'histoire chronologique : Phillips (1958), Samuelson-Solow (1960), Friedman (1968), stagflation (1973-79). Demandez aux élèves de placer la France actuelle sur la courbe. Le débat « Peut-on réduire le chômage par l'inflation ? » est un excellent exercice d'argumentation.",
  },
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
    yDomain: (() => {
      const allY = series.flatMap(s => s.data.map(p => p.y));
      const minY = Math.min(...allY);
      const maxY = Math.max(...allY);
      const pad = Math.max((maxY - minY) * 0.15, 1);
      return [Math.floor(minY - pad), Math.ceil(maxY + pad)];
    })(),
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
