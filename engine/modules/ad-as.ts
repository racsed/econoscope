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
  slug: 'ad-as',
  title: 'Modèle AD-AS',
  subtitle: "Demande globale et offre globale",
  theme: 'macro',
  level: 'advanced',
  introduction:
    "Le modèle AD-AS (Aggregate Demand - Aggregate Supply) détermine simultanément le niveau des prix et la production. La courbe AD représente l'ensemble des équilibres IS-LM pour différents niveaux de prix. Les courbes AS (court et long terme) refletent les conditions d'offre de l'économie.",
  limites: [
    "Simplification des ajustements dynamiques",
    "Les courbes sont supposées stables dans le temps",
    "Ne modelise pas explicitement les anticipations",
    "LRAS suppose un PIB potentiel fixe à court terme",
  ],
  economists: ['john-maynard-keynes', 'jean-baptiste-say', 'paul-samuelson'],
  realite: [
    "La crise Covid (2020) : choc d'offre ET de demande simultané",
    "La hausse des prix de l'énergie (2022) : déplacement de SRAS vers la gauche",
    "Les plans de relance post-Covid : déplacement de AD vers la droite",
  ],
  course: {
    introduction: "Le modèle AD-AS (Aggregate Demand - Aggregate Supply) est le cadre macroéconomique de référence pour analyser simultanément le niveau général des prix et le volume de production d'une économie. Il synthétise les apports de Keynes (demande globale) et des classiques (offre globale) dans un schéma unifié. La courbe de demande globale (AD) est décroissante : quand le niveau des prix baisse, le pouvoir d'achat de la monnaie augmente, les taux d'intérêt diminuent et la demande de biens et services s'accroît. Elle correspond en fait à l'ensemble des équilibres IS-LM pour chaque niveau de prix.\n\nL'offre globale se décompose en deux courbes. A court terme (SRAS), la courbe est croissante : les entreprises augmentent leur production quand les prix montent, car les salaires nominaux s'ajustent lentement. A long terme (LRAS), la courbe est verticale au niveau du PIB potentiel : la production dépend uniquement des facteurs structurels (travail, capital, technologie) et non du niveau des prix. Cette distinction est cruciale : elle signifie que les politiques de relance de la demande ne peuvent augmenter durablement la production au-delà du potentiel sans générer de l'inflation.\n\nLe modèle permet d'analyser les chocs économiques et les réponses politiques. Un choc de demande positif (plan de relance, baisse des taux) déplace AD vers la droite : à court terme, la production et les prix augmentent. Un choc d'offre négatif (hausse du pétrole, pandémie) déplace SRAS vers la gauche : la production baisse et les prix montent, créant de la stagflation. L'ajustement de long terme ramène toujours l'économie au PIB potentiel, mais par des chemins différents selon la nature du choc et la réponse politique.",
    keyConcepts: [
      { term: "Demande globale (AD)", definition: "Quantité totale de biens et services demandés dans une économie pour chaque niveau de prix. Elle est décroissante via trois effets : l'effet richesse (Pigou), l'effet taux d'intérêt (Keynes) et l'effet taux de change. Un déplacement de AD résulte d'un changement de politique budgétaire, monétaire ou de confiance des agents." },
      { term: "Offre globale de court terme (SRAS)", definition: "Quantité totale de biens et services que les entreprises sont disposées à produire pour chaque niveau de prix, les salaires nominaux étant fixes. Elle est croissante car une hausse des prix augmente les marges des entreprises à salaires constants, les incitant à produire davantage." },
      { term: "PIB potentiel (LRAS)", definition: "Niveau de production maximal soutenable sans accélération de l'inflation, déterminé par les ressources disponibles (travail, capital) et la productivité. La courbe LRAS est verticale car, à long terme, la production ne dépend pas du niveau des prix mais de facteurs réels." },
      { term: "Choc d'offre", definition: "Evénement qui modifie les coûts de production et déplace la courbe SRAS. Un choc négatif (hausse du pétrole, catastrophe naturelle) déplace SRAS vers la gauche, réduisant la production et augmentant les prix. Un choc positif (progrès technique, baisse des matières premières) fait l'inverse." },
      { term: "Écart de production (output gap)", definition: "Différence entre le PIB réel et le PIB potentiel. Un output gap positif signifie que l'économie surchauffe (pressions inflationnistes). Un output gap négatif traduit une sous-utilisation des capacités (chômage, déflation). Les politiques de stabilisation visent à réduire cet écart." },
    ],
    methodology: "Commencez par repérer l'équilibre initial à l'intersection d'AD et SRAS. Augmentez les dépenses publiques pour simuler un choc de demande positif : AD se déplace, observez l'effet sur le prix et la production. Simulez ensuite un choc pétrolier en augmentant les coûts de production : SRAS se déplace vers la gauche. Notez la stagflation. Enfin, comparez la position de long terme (LRAS) avec l'équilibre de court terme pour comprendre l'ajustement temporel.",
    forTeachers: "Utilisez le scénario « crise Covid » pour illustrer un double choc (offre ET demande). Demandez aux élèves d'identifier la nature du choc avant de modifier les curseurs. Le passage du court au long terme est un excellent support pour expliquer pourquoi les politiques de relance ne peuvent pas augmenter durablement la production.",
  },
};

const inputs: SimulationInput[] = [
  {
    id: 'depenses_publiques',
    label: 'Dépenses publiques',
    type: 'slider',
    min: 0,
    max: 500,
    step: 10,
    defaultValue: 200,
    unit: 'Mds\u20ac',
    tooltip: "Augmenter G déplace AD vers la droite",
    group: 'Demande globale',
  },
  {
    id: 'offre_monnaie',
    label: 'Offre de monnaie',
    type: 'slider',
    min: 100,
    max: 2000,
    step: 50,
    defaultValue: 800,
    unit: 'Mds\u20ac',
    tooltip: "Augmenter M déplace AD vers la droite",
    group: 'Demande globale',
  },
  {
    id: 'prix_petrole',
    label: 'Prix du pétrole (indice)',
    type: 'slider',
    min: 50,
    max: 300,
    step: 10,
    defaultValue: 100,
    tooltip: "Une hausse déplace SRAS vers la gauche (choc d'offre négatif)",
    group: 'Offre globale',
  },
  {
    id: 'productivite',
    label: 'Productivité (indice)',
    type: 'slider',
    min: 50,
    max: 200,
    step: 5,
    defaultValue: 100,
    tooltip: "Une hausse déplace SRAS et LRAS vers la droite",
    group: 'Offre globale',
  },
  {
    id: 'salaire_nominal',
    label: 'Salaire nominal (indice)',
    type: 'slider',
    min: 50,
    max: 200,
    step: 5,
    defaultValue: 100,
    tooltip: "Une hausse déplace SRAS vers la gauche",
    group: 'Offre globale',
  },
  {
    id: 'mode_long_terme',
    label: 'Afficher le long terme (LRAS)',
    type: 'toggle',
    defaultValue: true,
    tooltip: "Affiche la courbe d'offre de long terme verticale au PIB potentiel",
    group: 'Affichage',
  },
];

const scenarios: Scenario[] = [
  {
    id: 'equilibre_base',
    label: 'Équilibre macroéconomique',
    description: "Situation initiale de référence",
    values: { depenses_publiques: 200, offre_monnaie: 800, prix_petrole: 100, productivité: 100, salaire_nominal: 100, mode_long_terme: true },
  },
  {
    id: 'relance_budgetaire',
    label: 'Relance budgétaire',
    description: "Augmentation massive des dépenses publiques",
    values: { depenses_publiques: 350, offre_monnaie: 800, prix_petrole: 100, productivité: 100, salaire_nominal: 100, mode_long_terme: true },
  },
  {
    id: 'choc_petrolier',
    label: 'Choc pétrolier',
    description: "Doublement du prix du pétrole",
    values: { depenses_publiques: 200, offre_monnaie: 800, prix_petrole: 200, productivité: 100, salaire_nominal: 100, mode_long_terme: true },
  },
  {
    id: 'gains_productivite',
    label: 'Gains de productivité',
    description: "Progrès technologique augmentant la productivité de 50%",
    values: { depenses_publiques: 200, offre_monnaie: 800, prix_petrole: 100, productivité: 150, salaire_nominal: 100, mode_long_terme: true },
  },
  {
    id: 'stagflation',
    label: 'Stagflation',
    description: "Choc d'offre négatif combinant hausse des prix et baisse de production",
    values: { depenses_publiques: 200, offre_monnaie: 800, prix_petrole: 250, productivité: 85, salaire_nominal: 130, mode_long_terme: true },
  },
];

/**
 * AD curve: derived from IS-LM
 *   Y_AD(P) = A_d / P + B_d
 *   More specifically, from IS-LM equilibrium Y = f(M/P, G, ...)
 *   Simplified: Y_AD = alpha * (G + I0) + beta * M/P
 *   where alpha and beta dépend on IS-LM parameters
 *
 *   We use: Y_AD(P) = k_g * G + k_m * (M / P)
 *   where k_g = 2.0, k_m = 1.5
 *
 * SRAS curve:
 *   P_SRAS(Y) = P0 + gamma * (Y - Yp) * (W/Prod) * (Oil/100)
 *   where Yp is potential output, gamma is slope
 *
 * LRAS: vertical at Y_potential
 *   Y_potential = base_potential * (Prod/100)
 */
const K_G = 2.0;
const K_M = 1.5;
const BASE_POTENTIAL = 1000;
const GAMMA_SRAS = 0.005;
const P0_BASE = 1.0;

function adOutput(price: number, g: number, m: number): number {
  if (price <= 0) return Infinity;
  return K_G * g + K_M * (m / price);
}

function srasPrice(
  y: number,
  yPotential: number,
  salaire: number,
  productivité: number,
  prixPetrole: number
): number {
  const costFactor = (salaire / 100) * (prixPetrole / 100) / (productivité / 100);
  return P0_BASE * costFactor + GAMMA_SRAS * (y - yPotential) * costFactor;
}

function findAdAsEquilibrium(
  g: number, m: number, salaire: number, productivité: number, prixPetrole: number
): { y: number; p: number } {
  // Numerical solver: find intersection of AD and SRAS
  // AD: Y = K_G * G + K_M * M / P => P = K_M * M / (Y - K_G * G)
  // SRAS: P = srasPrice(Y, ...)
  // Set them equal and solve numerically

  const yPotential = BASE_POTENTIAL * (productivité / 100);

  // Newton-like bisection on Y
  let yLow = 100;
  let yHigh = Math.max(5000, K_G * g + K_M * m / 0.5 + 2000);

  for (let iter = 0; iter < 100; iter++) {
    const yMid = (yLow + yHigh) / 2;
    const pAD = yMid > K_G * g ? K_M * m / (yMid - K_G * g) : 100;
    const pSRAS = srasPrice(yMid, yPotential, salaire, productivité, prixPetrole);

    if (pAD > pSRAS) {
      yLow = yMid;
    } else {
      yHigh = yMid;
    }

    if (Math.abs(yHigh - yLow) < 0.1) break;
  }

  const yEq = (yLow + yHigh) / 2;
  const pEq = srasPrice(yEq, yPotential, salaire, productivité, prixPetrole);
  return { y: yEq, p: pEq };
}

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

function compute(values: Record<string, number | boolean | string>): ComputeResult {
  const g = clamp(Number(values.depenses_publiques) || 200, 0, 500);
  const m = clamp(Number(values.offre_monnaie) || 800, 100, 2000);
  const prixPetrole = clamp(Number(values.prix_petrole) || 100, 50, 300);
  const productivité = clamp(Number(values.productivite) || 100, 50, 200);
  const salaire = clamp(Number(values.salaire_nominal) || 100, 50, 200);
  const modeLongTerme = typeof values.mode_long_terme === 'boolean' ? values.mode_long_terme : true;

  const yPotential = BASE_POTENTIAL * (productivité / 100);
  const eq = findAdAsEquilibrium(g, m, salaire, productivité, prixPetrole);
  const eqBase = findAdAsEquilibrium(200, 800, 100, 100, 100);

  // Build curves
  const nbPoints = 120;
  const yMin = 200;
  const yMax = 2500;

  const adCurve: Point[] = [];
  const srasCurve: Point[] = [];

  for (let i = 0; i <= nbPoints; i++) {
    const y = yMin + (yMax - yMin) * (i / nbPoints);

    // AD: P as function of Y
    const denominator = y - K_G * g;
    if (denominator > 10) {
      const pAD = K_M * m / denominator;
      if (pAD > 0 && pAD < 10) {
        adCurve.push({ x: y, y: pAD });
      }
    }

    // SRAS: P as function of Y
    const pSRAS = srasPrice(y, yPotential, salaire, productivité, prixPetrole);
    if (pSRAS > 0 && pSRAS < 10) {
      srasCurve.push({ x: y, y: pSRAS });
    }
  }

  const series: Series[] = [
    {
      id: 'ad',
      label: 'Demande globale',
      color: '#3b82f6',
      data: adCurve,
      strokeWidth: 2.5,
    },
    {
      id: 'sras',
      label: 'Offre globale (court terme)',
      color: '#ef4444',
      data: srasCurve,
      strokeWidth: 2.5,
    },
  ];

  if (modeLongTerme) {
    series.push({
      id: 'lras',
      label: `Production potentielle (${yPotential.toFixed(0)} Mds)`,
      color: '#10b981',
      data: [
        { x: yPotential, y: 0.2 },
        { x: yPotential, y: 8 },
      ],
      strokeWidth: 2.5,
      dashed: true,
    });
  }

  const annotations: Annotation[] = [
    {
      type: 'point',
      x: eq.y,
      y: eq.p,
      label: `E* (Y=${eq.y.toFixed(0)}, P=${eq.p.toFixed(2)})`,
      color: '#f59e0b',
    },
  ];

  const outputGap = ((eq.y - yPotential) / yPotential) * 100;

  const chartData: ChartData = {
    type: 'line',
    series,
    xLabel: 'Production Y (Mds\u20ac)',
    yLabel: 'Niveau des prix P',
    xDomain: [yMin, yMax],
    yDomain: (() => {
      const allY = series.flatMap(s => s.data.map(p => p.y));
      const maxY = Math.max(...allY);
      return [0, Math.min(maxY * 1.1, 10)];
    })(),
    equilibrium: { x: eq.y, y: eq.p },
    annotations,
  };

  // Narration
  let observation = `L'équilibre macroéconomique se situe a Y = ${eq.y.toFixed(0)} Mds\u20ac avec un niveau des prix P = ${eq.p.toFixed(2)}.`;
  if (modeLongTerme) {
    observation += ` Le PIB potentiel (LRAS) est de ${yPotential.toFixed(0)} Mds\u20ac. L'écart de production (output gap) est de ${outputGap.toFixed(1)}%.`;
    observation += ` La distinction SRAS/LRAS est essentielle : à court terme (SRAS), les prix des inputs (salaires, énergie) sont rigides, donc la production peut s'écarter du potentiel. A long terme (LRAS), tous les prix s'ajustent et l'économie revient au PIB potentiel.`;
  }

  let interpretation: string;

  if (outputGap > 2) {
    interpretation = `L'économie est en surchauffe : la production dépasse le potentiel de ${outputGap.toFixed(1)}%. Les entreprises produisent au-dela de leurs capacités normales, ce qui exerce une pression à la hausse sur les coûts (heures supplémentaires, raréfaction des inputs). A long terme, les salaires s'ajusteront à la hausse, deplacant SRAS vers la gauche jusqu'au retour au potentiel avec un niveau des prix plus élevé - c'est le mécanisme d'ajustement automatique.`;
  } else if (outputGap < -2) {
    interpretation = `L'économie est en récession : la production est inférieure au potentiel de ${Math.abs(outputGap).toFixed(1)}%. Cela signifie que des usines tournent en sous-régime, des travailleurs sont au chômage conjoncturel. Une politique de relance budgétaire (hausse de G, déplacement d'AD) ou monétaire (hausse de M, déplacement d'AD) pourrait combler cet écart en stimulant la demande globale.`;
  } else {
    interpretation = `L'économie est proche de son potentiel. L'écart de production est faible (${outputGap.toFixed(1)}%), indiquant un équilibre macroéconomique relativement sain ou l'offre et la demande globales s'accordent pres du plein emploi.`;
  }

  if (prixPetrole > 150) {
    interpretation += ` Le prix du pétrole élevé (indice ${prixPetrole}) agit comme un choc d'offre négatif : il augmente les coûts de production de toutes les entreprises, deplacant SRAS vers la gauche. Le résultat est une stagflation - la production baisse ET les prix montent - un dilemme pour la politique économique car relancer la demande aggraverait l'inflation.`;
  } else if (prixPetrole < 70) {
    interpretation += ` Le faible prix du pétrole (indice ${prixPetrole}) agit comme un choc d'offre positif : il réduit les coûts de production, deplacant SRAS vers la droite. L'économie bénéficie d'une croissance plus forte avec moins d'inflation - c'est la situation ideale.`;
  }

  if (productivité > 120) {
    interpretation += ` La productivité élevée (indice ${productivité}) déplace à la fois SRAS et LRAS vers la droite : le PIB potentiel augmente a ${yPotential.toFixed(0)} Mds\u20ac. C'est le mécanisme de la croissance de long terme - le progrès technique repousse les limites de l'économie.`;
  } else if (productivité < 80) {
    interpretation += ` La faible productivité (indice ${productivité}) contracte le PIB potentiel a ${yPotential.toFixed(0)} Mds\u20ac et déplace SRAS vers la gauche. L'économie produit moins avec les mêmes ressources.`;
  }

  if (salaire > 130) {
    interpretation += ` Les salaires nominaux élevés (indice ${salaire}) deplacent SRAS vers la gauche sans affecter LRAS : les coûts de production augmentent, ce qui pousse les prix à la hausse à court terme. C'est le mécanisme de la spirale prix-salaires.`;
  } else if (salaire < 80) {
    interpretation += ` Les faibles salaires nominaux (indice ${salaire}) deplacent SRAS vers la droite : les coûts de production bas permettent de produire davantage à prix egal, mais cela peut refleter une compression des revenus des travailleurs.`;
  }

  if (g > 300) {
    interpretation += ` Les dépenses publiques élevées (${g} Mds\u20ac) deplacent AD vers la droite, stimulant la production mais exerçant une pression inflationniste. L'ampleur de l'effet dépend de la pente de SRAS : plus l'économie est proche du potentiel, plus la hausse de G se traduit en inflation plutôt qu'en production.`;
  } else if (g < 100) {
    interpretation += ` Les faibles dépenses publiques (${g} Mds\u20ac) positionnent AD plus a gauche, limitant la demande globale. C'est le choix de l'austérité budgétaire.`;
  }

  if (m > 1200) {
    interpretation += ` L'offre de monnaie abondante (${m} Mds\u20ac) déplace AD vers la droite via la baisse des taux d'intérêt qui stimule l'investissement et la consommation. C'est le levier de la politique monétaire expansionniste.`;
  } else if (m < 500) {
    interpretation += ` L'offre de monnaie restreinte (${m} Mds\u20ac) limite la demande globale en maintenant des taux d'intérêt élevés. C'est une politique monétaire restrictive visant a contenir l'inflation.`;
  }

  return {
    outputs: [
      { id: 'production', label: 'Production', value: round2(eq.y), unit: 'Mds\u20ac', direction: eq.y > eqBase.y ? 'up' : eq.y < eqBase.y ? 'down' : 'neutral' },
      { id: 'niveau_prix', label: 'Niveau des prix', value: round2(eq.p), direction: eq.p > eqBase.p ? 'up' : eq.p < eqBase.p ? 'down' : 'neutral' },
      { id: 'pib_potentiel', label: 'PIB potentiel', value: round2(yPotential), unit: 'Mds\u20ac' },
      { id: 'output_gap', label: 'Écart de production', value: round2(outputGap), unit: '%', direction: outputGap > 0 ? 'up' : outputGap < 0 ? 'down' : 'neutral' },
    ],
    chartData,
    narration: { observation, interpretation },
  };
}

function round2(v: number): number {
  return Math.round(v * 100) / 100;
}

const adAsModule: SimulationModule = { meta, inputs, scenarios, compute };

registerModule(adAsModule);

export { adAsModule };
export default adAsModule;
