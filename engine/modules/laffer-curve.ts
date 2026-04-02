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
  slug: 'courbe-de-laffer',
  title: 'Courbe de Laffer',
  subtitle: "Trop d'impôt tue l'impôt",
  theme: 'fiscal',
  level: 'accessible',
  introduction:
    "La courbe de Laffer illustre la relation entre le taux d'imposition et les recettes fiscales. A taux 0%, les recettes sont nulles. A taux 100%, personne ne travaille, les recettes sont nulles aussi. Il existe donc un taux optimal qui maximisé les recettes. La position exacte de ce sommet fait l'objet de vifs debats.",
  limites: [
    "La forme exacte de la courbe est inconnue et dépend de nombreux facteurs",
    "Le taux optimal varie selon le type d'impôt et le contexte",
    "Ignore les effets redistributifs et les biens publics",
    "L'elasticite de l'assiette fiscale est difficile a estimer",
  ],
  economists: ['arthur-laffer', 'david-ricardo'],
  realite: [
    "Le taux marginal supérieur de l'IR en France est passe de 75% (2012) a 45%",
    "Les études empiriques situent le sommet de la courbe entre 50% et 70%",
    "La taxe a 75% de 2012 a rapporte très peu : effet Laffer visible",
    "L'impôt sur les sociétés a baisse mondialement (course fiscale)",
  ],
  course: {
    introduction: "La courbe de Laffer, popularisée par l'économiste américain Arthur Laffer dans les années 1970, illustre une idée simple mais puissante : il existe une relation non linéaire entre le taux d'imposition et les recettes fiscales. A un taux de 0 %, les recettes sont évidemment nulles. Mais à un taux de 100 %, elles le sont aussi car personne n'a intérêt à travailler ou à déclarer ses revenus. Entre ces deux extrêmes, il existe un taux optimal qui maximise les recettes de l'État. Cette idée n'est pas nouvelle : déjà au XIVe siècle, le penseur arabe Ibn Khaldoun avait formulé une intuition similaire.\n\nLa forme exacte de la courbe dépend de l'élasticité de l'assiette fiscale au taux d'imposition. Si les contribuables réagissent fortement aux hausses d'impôts (en travaillant moins, en s'expatriant, en recourant à l'optimisation fiscale), le sommet de la courbe se situe à un taux relativement bas. Si au contraire l'assiette est peu sensible au taux (biens de première nécessité, revenus du travail peu qualifié), le sommet est plus élevé. Les études empiriques, notamment celles de Saez, Slemrod et Giertz, situent le taux optimal entre 50 % et 70 % pour l'impôt sur le revenu dans les pays développés.\n\nLa courbe de Laffer est au coeur du débat politique sur la fiscalité. Les partisans de la baisse des impôts (supply-side economics, reaganomics) l'invoquent pour affirmer qu'une réduction des taux peut s'autofinancer par l'élargissement de l'assiette. Leurs critiques objectent que la plupart des pays développés se situent sur la partie gauche de la courbe (en dessous du sommet), ce qui signifie qu'une hausse des taux augmenterait bien les recettes. En France, l'épisode de la taxe à 75 % sur les hauts revenus (2012-2014) a fourni un cas d'étude concret : les recettes ont été très inférieures aux prévisions, suggérant un effet Laffer significatif au-delà de 70 %.",
    keyConcepts: [
      { term: "Taux optimal d'imposition", definition: "Taux d'imposition qui maximise les recettes fiscales. Au-delà de ce taux, toute hausse supplémentaire réduit les recettes car la contraction de l'assiette fiscale (évasion, moindre activité) l'emporte sur le gain mécanique du taux plus élevé." },
      { term: "Assiette fiscale", definition: "Base sur laquelle l'impôt est calculé (revenus, bénéfices, consommation, patrimoine). L'assiette n'est pas fixe : elle réagit au taux d'imposition. Des taux élevés peuvent réduire l'assiette par des effets comportementaux (baisse de l'offre de travail, délocalisation, optimisation fiscale)." },
      { term: "Élasticité de l'assiette fiscale", definition: "Mesure de la sensibilité de l'assiette fiscale au taux d'imposition. Une élasticité élevée signifie que l'assiette se contracte fortement quand le taux augmente, ce qui déplace le sommet de la courbe vers la gauche (taux optimal plus bas)." },
      { term: "Effet mécanique vs effet comportemental", definition: "L'effet mécanique est la hausse de recettes qu'on obtiendrait si l'assiette ne changeait pas. L'effet comportemental est la baisse de recettes due à la contraction de l'assiette. L'effet net dépend de la position sur la courbe : à gauche du sommet, l'effet mécanique domine ; à droite, l'effet comportemental l'emporte." },
      { term: "Course fiscale (tax competition)", definition: "Tendance des pays à baisser leurs taux d'imposition pour attirer les entreprises et les capitaux. L'impôt sur les sociétés est passé en moyenne de 50 % dans les années 1980 à 23 % en 2023 dans l'OCDE. Cette concurrence peut réduire les recettes fiscales globales si elle est non coopérative." },
    ],
    methodology: "Commencez par positionner le taux d'imposition à 40 % et notez les recettes fiscales. Augmentez progressivement le taux et observez : les recettes augmentent d'abord, puis diminuent après le sommet. Repérez le taux optimal exact. Modifiez ensuite l'élasticité de l'assiette et constatez comment le sommet se déplace. Avec une forte élasticité, le taux optimal baisse considérablement. Comparez les scénarios « économie flexible » et « économie rigide ».",
    forTeachers: "Lancez le débat : « Baisser les impôts peut-il augmenter les recettes de l'État ? ». Les élèves ont souvent une opinion tranchée. Utilisez le simulateur pour montrer que la réponse dépend de la position sur la courbe. L'épisode de la taxe à 75 % est un excellent cas concret à analyser en classe.",
  },
};

const inputs: SimulationInput[] = [
  {
    id: 'taux_imposition',
    label: "Taux d'imposition",
    type: 'slider',
    min: 0,
    max: 100,
    step: 1,
    defaultValue: 40,
    unit: '%',
    tooltip: "Taux marginal d'imposition applique",
    group: 'Fiscalité',
  },
  {
    id: 'elasticite_assiette',
    label: "Élasticité de l'assiette fiscale",
    type: 'slider',
    min: 0.1,
    max: 3,
    step: 0.1,
    defaultValue: 1,
    tooltip: "Sensibilite du revenu imposable au taux d'imposition. Plus elle est élevée, plus le sommet de la courbe est bas.",
    group: 'Comportement',
  },
];

const scenarios: Scenario[] = [
  {
    id: 'elasticite_faible',
    label: 'Élasticité faible (0.3)',
    description: "Revenu peu sensible au taux, sommet élevé",
    values: { taux_imposition: 40, elasticite_assiette: 0.3 },
  },
  {
    id: 'elasticite_moyenne',
    label: 'Élasticité moyenne (1.0)',
    description: "Cas intermédiaire souvent cite",
    values: { taux_imposition: 50, elasticite_assiette: 1 },
  },
  {
    id: 'elasticite_forte',
    label: 'Élasticité forte (2.0)',
    description: "Revenu très sensible, sommet bas",
    values: { taux_imposition: 30, elasticite_assiette: 2 },
  },
  {
    id: 'france_ir',
    label: "France IR (taux marginal 45%)",
    description: "Taux marginal supérieur français actuel",
    values: { taux_imposition: 45, elasticite_assiette: 0.8 },
  },
];

/**
 * Laffer curve model:
 *
 * Base income (before behavioral response): Y0 = 1000
 * Taxable income: Y(t) = Y0 * (1 - t)^e   where e = elasticity of taxable income
 * Tax revenue: R(t) = t * Y(t) = t * Y0 * (1 - t)^e
 *
 * Optimal rate: dR/dt = 0
 *   Y0 * [(1-t)^e + t * e * (1-t)^(e-1) * (-1)] = 0
 *   (1-t)^(e-1) * [(1-t) - t*e] = 0
 *   (1-t) = t*e
 *   t* = 1 / (1 + e)
 */
const Y0 = 1000;

function taxRevenue(taux: number, elasticite: number): number {
  const t = taux / 100;
  if (t <= 0 || t >= 1) return 0;
  return t * Y0 * Math.pow(1 - t, elasticite);
}

function taxableIncome(taux: number, elasticite: number): number {
  const t = taux / 100;
  if (t >= 1) return 0;
  return Y0 * Math.pow(1 - t, elasticite);
}

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

function compute(values: Record<string, number | boolean | string>): ComputeResult {
  const taux = clamp(Number(values.taux_imposition) || 40, 0, 100);
  const elasticite = clamp(Number(values.elasticite_assiette) || 1, 0.1, 3);

  const tauxOptimal = 100 / (1 + elasticite);
  const recetteOptimale = taxRevenue(tauxOptimal, elasticite);
  const recetteActuelle = taxRevenue(taux, elasticite);
  const revenuImposable = taxableIncome(taux, elasticite);
  const manqueAGagner = recetteOptimale - recetteActuelle;

  const nbPoints = 200;
  const lafferCurve: Point[] = [];
  const revenuCurve: Point[] = [];

  for (let i = 0; i <= nbPoints; i++) {
    const t = (100 * i) / nbPoints;
    lafferCurve.push({ x: t, y: taxRevenue(t, elasticite) });
    revenuCurve.push({ x: t, y: taxableIncome(t, elasticite) });
  }

  const series: Series[] = [
    {
      id: 'laffer',
      label: 'Recettes fiscales',
      color: '#3b82f6',
      data: lafferCurve,
      strokeWidth: 2.5,
      area: true,
      areaOpacity: 0.1,
    },
    {
      id: 'revenu_imposable',
      label: 'Revenu imposable',
      color: '#94a3b8',
      data: revenuCurve,
      strokeWidth: 1.5,
      dashed: true,
    },
  ];

  const annotations: Annotation[] = [
    {
      type: 'point',
      x: tauxOptimal,
      y: recetteOptimale,
      label: `Sommet (t*=${tauxOptimal.toFixed(0)}%, R=${recetteOptimale.toFixed(0)})`,
      color: '#10b981',
    },
    {
      type: 'point',
      x: taux,
      y: recetteActuelle,
      label: `Actuel (t=${taux}%, R=${recetteActuelle.toFixed(0)})`,
      color: '#f59e0b',
    },
    {
      type: 'line',
      x1: tauxOptimal,
      y1: 0,
      x2: tauxOptimal,
      y2: recetteOptimale,
      label: 'Taux optimal',
      color: '#10b981',
    },
  ];

  const chartData: ChartData = {
    type: 'area',
    series,
    xLabel: "Taux d'imposition (%)",
    yLabel: 'Montant',
    xDomain: [0, 100],
    yDomain: [0, Math.max(recetteOptimale, Y0) * 1.1],
    equilibrium: { x: taux, y: recetteActuelle },
    annotations,
  };

  const efficacité = recetteOptimale > 0 ? (recetteActuelle / recetteOptimale) * 100 : 0;
  const positionRelative = taux < tauxOptimal ? 'gauche' : taux > tauxOptimal ? 'droite' : 'sommet';

  const observation = `Avec une elasticite de ${elasticite.toFixed(1)}, le taux optimal de Laffer est de ${tauxOptimal.toFixed(0)}%, generant des recettes maximales de ${recetteOptimale.toFixed(0)}. Au taux actuel de ${taux}%, les recettes sont de ${recetteActuelle.toFixed(0)} (${efficacité.toFixed(0)}% du maximum).`;

  let interpretation: string;

  if (positionRelative === 'gauche') {
    const écart = tauxOptimal - taux;
    interpretation = `L'économie se situe sur le versant gauche (ascendant) de la courbe de Laffer : une hausse du taux de ${écart.toFixed(0)} points augmenterait les recettes de ${manqueAGagner.toFixed(0)}. L'effet-taux (plus de recettes par unite) domine l'effet-assiette (réduction de l'activité).`;
  } else if (positionRelative === 'droite') {
    const écart = taux - tauxOptimal;
    interpretation = `L'économie se situe sur le versant droit (descendant) de la courbe de Laffer : \"trop d'impôt tue l'impôt\". Une baisse du taux de ${écart.toFixed(0)} points augmenterait paradoxalement les recettes de ${manqueAGagner.toFixed(0)}. L'effet-assiette (retrait de l'activité) domine l'effet-taux.`;
  } else {
    interpretation = "L'économie se situe exactement au sommet de la courbe de Laffer : les recettes fiscales sont maximisees. Toute variation du taux réduirait les recettes.";
  }

  if (elasticite > 1.5) {
    interpretation += ` Avec une elasticite élevée (${elasticite.toFixed(1)}), les agents économiques sont très reactifs à la fiscalité (évasion, delocalisation, réduction de l'effort de travail) : le sommet de la courbe est relativement bas (${tauxOptimal.toFixed(0)}%). Cela correspond à des revenus très mobiles (capital financier, hauts salaires).`;
  } else if (elasticite < 0.5) {
    interpretation += ` Avec une elasticite faible (${elasticite.toFixed(1)}), les agents économiques sont peu reactifs à la fiscalité : le sommet de la courbe est élevé (${tauxOptimal.toFixed(0)}%), laissant une marge de manoeuvre fiscale importante. Cela correspond à des revenus peu mobiles (salaires moyens, immobilier).`;
  } else {
    interpretation += ` Avec une elasticite moyenne (${elasticite.toFixed(1)}), le sommet se situe a ${tauxOptimal.toFixed(0)}%. C'est la valeur souvent citee dans les estimations empiriques pour l'impôt sur le revenu des classes moyennes.`;
  }

  if (taux > 80) {
    interpretation += ` Un taux de ${taux}% est quasi confiscatoire : le revenu imposable s'effondre a ${revenuImposable.toFixed(0)} (contre ${Y0} sans impôt). L'assiette fiscale rétrécit tellement que les recettes chutent malgre le taux élevé.`;
  } else if (taux < 10 && taux > 0) {
    interpretation += ` Un taux de ${taux}% est très faible : l'assiette fiscale est quasi intacte (${revenuImposable.toFixed(0)}) mais les recettes sont modestes car le taux est bas. Il y à une large marge avant d'atteindre le sommet.`;
  }

  return {
    outputs: [
      { id: 'taux_optimal', label: 'Taux optimal de Laffer', value: round2(tauxOptimal), unit: '%' },
      { id: 'recette_optimale', label: 'Recette maximale', value: round2(recetteOptimale) },
      { id: 'recette_actuelle', label: 'Recette actuelle', value: round2(recetteActuelle) },
      { id: 'efficacité', label: 'Efficacité fiscale', value: round2(efficacité), unit: '%' },
      { id: 'revenu_imposable', label: 'Revenu imposable', value: round2(revenuImposable) },
      { id: 'manque_a_gagner', label: 'Manque a gagner', value: round2(Math.max(0, manqueAGagner)) },
    ],
    chartData,
    narration: { observation, interpretation },
  };
}

function round2(v: number): number {
  return Math.round(v * 100) / 100;
}

const lafferCurveModule: SimulationModule = { meta, inputs, scenarios, compute };

registerModule(lafferCurveModule);

export { lafferCurveModule };
export default lafferCurveModule;
