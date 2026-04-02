import type {
  SimulationModule,
  SimulationInput,
  Scenario,
  ComputeResult,
  ModuleMeta,
  RadarData,
} from '../types';
import { registerModule } from '../core/registry';

const meta: ModuleMeta = {
  slug: 'carre-magique-kaldor',
  title: 'Carré magique de Kaldor',
  subtitle: "Les quatre objectifs de la politique économique",
  theme: 'macro',
  level: 'intermediate',
  introduction:
    "Le carré magique de Kaldor (1971) représente graphiquement les quatre objectifs fondamentaux de la politique économique : croissance, plein emploi, stabilité des prix et équilibre exterieur. Plus la surface du quadrilatere est grande, meilleure est la situation économique. On le dit \"magique\" car il est très difficile d'atteindre les quatre objectifs simultanément.",
  limites: [
    "Ne tient pas compte des inégalités, de l'environnement, du bien-être",
    "Les quatre objectifs ne sont pas independants (courbe de Phillips)",
    "Ponderation implicite égale des quatre objectifs",
    "Donnees annuelles qui masquent les variations infra-annuelles",
  ],
  economists: ['nicholas-kaldor'],
  realite: [
    "Aucun pays n'a jamais atteint le carré parfait de manière durable",
    "L'Allemagne des années 2010 s'en est approchee (croissance, excédent commercial, chômage bas)",
    "La France presente typiquement un déficit du solde commercial et un chômage élevé",
  ],
  course: {
    introduction: "Le carré magique est un outil graphique proposé par l'économiste britannique Nicholas Kaldor en 1971 pour représenter de manière synthétique la performance macroéconomique d'un pays. Il place sur quatre axes les grands objectifs de la politique économique : la croissance du PIB (dynamisme de l'économie), le taux de chômage (situation de l'emploi), le taux d'inflation (stabilité des prix) et le solde de la balance courante (équilibre extérieur). En reliant les quatre points, on obtient un quadrilatère dont la surface résume la « santé » économique du pays.\n\nOn le qualifie de « magique » parce qu'il est pratiquement impossible d'atteindre simultanément les quatre objectifs optimaux. La courbe de Phillips enseigne que faible chômage et faible inflation sont difficiles à concilier. Une forte croissance attire les importations et dégrade la balance commerciale. Un excédent commercial peut masquer une demande intérieure atone. Ces tensions illustrent le concept fondamental d'arbitrage en politique économique : améliorer un indicateur se fait souvent au détriment d'un autre.\n\nLe carré magique reste un outil de comparaison très utile, tant dans le temps (comparer la France de 2000 et de 2024) que dans l'espace (comparer la France et l'Allemagne). Il permet de visualiser immédiatement les points forts et les faiblesses d'une économie, et de mesurer les effets d'une politique économique. Toutefois, il ne prend pas en compte des dimensions essentielles comme les inégalités, la soutenabilité environnementale ou le bien-être des populations, ce qui a conduit à des propositions d'enrichissement (pentagone, hexagone magique).",
    keyConcepts: [
      { term: "Croissance du PIB", definition: "Variation annuelle en pourcentage du Produit Intérieur Brut en volume. Une croissance forte signifie que l'économie produit davantage de richesses. L'objectif classique pour un pays développé se situe autour de 2-3 % par an." },
      { term: "Taux de chômage", definition: "Part de la population active qui est sans emploi et en recherche d'emploi. L'objectif est de minimiser ce taux. On considère généralement qu'un taux inférieur à 5 % correspond au plein emploi dans les économies avancées." },
      { term: "Taux d'inflation", definition: "Variation annuelle du niveau général des prix. Une inflation modérée (autour de 2 %, cible de la BCE) est considérée comme saine. Une inflation trop élevée érode le pouvoir d'achat ; une inflation négative (déflation) freine l'activité." },
      { term: "Solde de la balance courante", definition: "Différence entre les exportations et les importations de biens, services et revenus, exprimée en pourcentage du PIB. Un solde positif indique que le pays vend plus au reste du monde qu'il n'achète. Un déficit signifie que le pays vit au-dessus de ses moyens extérieurs." },
      { term: "Arbitrage de politique économique", definition: "Impossibilité d'atteindre simultanément tous les objectifs. Par exemple, stimuler la croissance par la demande peut accélérer l'inflation et dégrader la balance commerciale. Chaque gouvernement doit choisir ses priorités en fonction du contexte." },
    ],
    methodology: "Commencez par entrer les données réelles de la France actuelle et observez la forme du quadrilatère. Comparez ensuite avec les données de l'Allemagne ou des pays scandinaves. Modifiez un seul indicateur à la fois et observez comment la surface évolue. Essayez d'obtenir le carré parfait : vous constaterez que c'est impossible sans violer les contraintes économiques. Les scénarios prédéfinis permettent de comparer les performances des pays à différentes époques.",
    forTeachers: "Distribuez les données macroéconomiques de 4-5 pays aux élèves et demandez-leur de tracer les carrés à la main avant d'utiliser le simulateur. La comparaison France/Allemagne est très parlante. Utilisez le carré magique comme point de départ pour discuter des limites du PIB comme indicateur de bien-être.",
  },
};

const inputs: SimulationInput[] = [
  {
    id: 'croissance',
    label: 'Taux de croissance du PIB',
    type: 'slider',
    min: -5,
    max: 10,
    step: 0.1,
    defaultValue: 1.5,
    unit: '%',
    tooltip: "Variation annuelle du PIB réel",
    group: 'Indicateurs',
  },
  {
    id: 'chômage',
    label: 'Taux de chômage',
    type: 'slider',
    min: 0,
    max: 25,
    step: 0.1,
    defaultValue: 7.5,
    unit: '%',
    tooltip: "Part de la population active au chômage (axe inverse : moins = mieux)",
    group: 'Indicateurs',
  },
  {
    id: 'inflation',
    label: "Taux d'inflation",
    type: 'slider',
    min: -2,
    max: 20,
    step: 0.1,
    defaultValue: 2.5,
    unit: '%',
    tooltip: "Variation annuelle de l'indice des prix (axe inverse : moins = mieux)",
    group: 'Indicateurs',
  },
  {
    id: 'solde_commercial',
    label: 'Solde commercial (% du PIB)',
    type: 'slider',
    min: -10,
    max: 10,
    step: 0.1,
    defaultValue: -1.5,
    unit: '%',
    tooltip: "Exportations moins importations en pourcentage du PIB",
    group: 'Indicateurs',
  },
];

const scenarios: Scenario[] = [
  {
    id: 'france_2023',
    label: 'France 2023',
    description: "Croissance molle, chômage moyen, inflation post-crise énergétique",
    values: { croissance: 0.9, chômage: 7.3, inflation: 4.9, solde_commercial: -3.5 },
  },
  {
    id: 'allemagne_2023',
    label: 'Allemagne 2023',
    description: "Récession technique, chômage bas, fort excédent commercial",
    values: { croissance: -0.3, chômage: 3.0, inflation: 5.9, solde_commercial: 5.5 },
  },
  {
    id: 'usa_2023',
    label: 'États-Unis 2023',
    description: "Croissance résiliente, marché du travail tendu",
    values: { croissance: 2.5, chômage: 3.6, inflation: 4.1, solde_commercial: -3.0 },
  },
  {
    id: 'japon_2023',
    label: 'Japon 2023',
    description: "Croissance modérée, retour de l'inflation après des décennies",
    values: { croissance: 1.9, chômage: 2.6, inflation: 3.3, solde_commercial: -1.5 },
  },
  {
    id: 'ideal',
    label: 'Situation ideale',
    description: "Le carré magique parfait (théorique)",
    values: { croissance: 5, chômage: 2, inflation: 0.5, solde_commercial: 3 },
  },
  {
    id: 'crise',
    label: 'Crise économique',
    description: "Tous les indicateurs au rouge",
    values: { croissance: -3, chômage: 12, inflation: 8, solde_commercial: -5 },
  },
];

/**
 * Radar axes:
 * - Croissance: higher = better, range [-5, 10]
 * - Chômage: lower = better (inverted), range [0, 25]
 * - Inflation: lower = better (inverted), range [-2, 20]
 * - Solde commercial: higher = better, range [-10, 10]
 *
 * To compute area, we normalize each axis to [0, 1] (1 = best)
 * then compute the area of the quadrilateral.
 */
function normalizeAxis(value: number, min: number, max: number, invert: boolean): number {
  const clamped = Math.max(min, Math.min(max, value));
  const normalized = (clamped - min) / (max - min);
  return invert ? 1 - normalized : normalized;
}

function computeRadarArea(values: number[]): number {
  // Area of a polygon inscribed in a unit circle with n vertices
  // at equal angles, with radii r_i
  // A = 0.5 * sum(r_i * r_{i+1} * sin(2*pi/n))
  const n = values.length;
  const angle = (2 * Math.PI) / n;
  let area = 0;
  for (let i = 0; i < n; i++) {
    const next = (i + 1) % n;
    area += values[i] * values[next] * Math.sin(angle);
  }
  return Math.abs(area) / 2;
}

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

function compute(values: Record<string, number | boolean | string>): ComputeResult {
  const croissance = clamp(Number(values.croissance) || 1.5, -5, 10);
  const chômage = clamp(Number(values.chômage) || 7.5, 0, 25);
  const inflation = clamp(Number(values.inflation) || 2.5, -2, 20);
  const soldeCommercial = clamp(Number(values.solde_commercial) || -1.5, -10, 10);

  const axes = [
    { id: 'croissance', label: 'Croissance (%)', min: -5, max: 10, invert: false },
    { id: 'solde_commercial', label: 'Solde commercial (% PIB)', min: -10, max: 10, invert: false },
    { id: 'chômage', label: 'Chômage (%)', min: 0, max: 25, invert: true },
    { id: 'inflation', label: 'Inflation (%)', min: -2, max: 20, invert: true },
  ];

  const currentValues: Record<string, number> = {
    croissance,
    chômage,
    solde_commercial: soldeCommercial,
    inflation,
  };

  const idealValues: Record<string, number> = {
    croissance: 5,
    chômage: 2,
    solde_commercial: 3,
    inflation: 0.5,
  };

  // Normalized values for area calculation
  const normalizedCurrent = axes.map((a) =>
    normalizeAxis(currentValues[a.id], a.min, a.max, a.invert)
  );
  const normalizedIdeal = axes.map((a) =>
    normalizeAxis(idealValues[a.id], a.min, a.max, a.invert)
  );

  const currentArea = computeRadarArea(normalizedCurrent);
  const idealArea = computeRadarArea(normalizedIdeal);
  const maxArea = computeRadarArea([1, 1, 1, 1]);
  const scorePercent = (currentArea / maxArea) * 100;

  const radarData: RadarData = {
    type: 'radar',
    axes,
    datasets: [
      {
        label: 'Situation actuelle',
        values: currentValues,
        color: '#3b82f6',
        opacity: 0.3,
      },
      {
        label: 'Situation ideale',
        values: idealValues,
        color: '#10b981',
        opacity: 0.1,
      },
    ],
    idealArea: round2(idealArea),
    currentArea: round2(currentArea),
  };

  // Identify strengths and weaknesses
  const indicators = [
    { label: 'croissance', value: normalizedCurrent[0], raw: croissance, unit: '%' },
    { label: 'solde commercial', value: normalizedCurrent[1], raw: soldeCommercial, unit: '% du PIB' },
    { label: 'chômage', value: normalizedCurrent[2], raw: chômage, unit: '%' },
    { label: 'inflation', value: normalizedCurrent[3], raw: inflation, unit: '%' },
  ];

  const sorted = [...indicators].sort((a, b) => b.value - a.value);
  const best = sorted[0];
  const worst = sorted[sorted.length - 1];

  let observation = `Le carré magique couvre ${scorePercent.toFixed(0)}% de la surface ideale. Le point fort est ${best.label} (${best.raw}${best.unit}), le point faible est ${worst.label} (${worst.raw}${worst.unit}). La surface du quadrilatere est d'autant plus grande que les quatre indicateurs sont proches de leurs valeurs "ideales" (croissance forte, chômage bas, inflation basse, excédent commercial).`;

  let interpretation = `Avec une croissance de ${croissance}%, un chômage de ${chômage}%, une inflation de ${inflation}% et un solde commercial de ${soldeCommercial}% du PIB, `;

  if (scorePercent >= 70) {
    interpretation += "la situation économique est globalement favorable. La surface couvre plus de 70% de l'ideal, ce qui signifie que la plupart des objectifs macroéconomiques sont simultanément atteints - une configuration rare et difficile à maintenir car ces objectifs sont souvent contradictoires.";
  } else if (scorePercent >= 40) {
    interpretation += "la situation économique est mitigee. Le carré est déformé, ce qui révèle des arbitrages entre objectifs : on ne peut pas tout avoir en même temps. Par exemple, stimuler la croissance (via la demande) risque d'augmenter l'inflation et de creuser le déficit commercial.";
  } else {
    interpretation += "la situation économique est dégradée. Plusieurs indicateurs sont loin de leurs niveaux optimaux. Le faible score reflète une économie déséquilibrée ou la politique économique doit prioriser les urgences.";
  }

  // Specific trade-offs
  if (chômage > 8 && inflation < 2) {
    interpretation += " Le faible niveau d'inflation associe à un chômage élevé suggere une insuffisance de la demande globale : c'est le mécanisme de la courbe de Phillips. Une politique de relance (budgétaire ou monétaire) pourrait réduire le chômage, mais au prix d'une inflation plus élevée.";
  }
  if (chômage < 4 && inflation > 4) {
    interpretation += " La combinaison chômage bas / inflation élevée illustre l'arbitrage de Phillips : l'économie est en surchauffe, les entreprises se disputent les travailleurs et les coûts grimpent. La banque centrale devrait durcir sa politique monétaire.";
  }
  if (soldeCommercial < -3) {
    interpretation += ` Le déficit commercial de ${soldeCommercial}% du PIB traduit soit un manque de compétitivité-prix (coûts trop élevés, monnaie trop forte), soit une demande intérieure excessive qui aspire les importations. Ce déficit doit être finance par des emprunts exterieurs.`;
  }
  if (soldeCommercial > 5) {
    interpretation += ` L'excédent commercial de ${soldeCommercial}% du PIB peut refleter une forte compétitivité, mais aussi une demande intérieure trop faible (épargne excessive). Un excédent persistant crée des tensions avec les partenaires commerciaux.`;
  }
  if (croissance < 0 && croissance > -3) {
    interpretation += ` La croissance légèrement négative (${croissance}%) indique un ralentissement ou une récession technique. Le PIB recule mais la situation n'est pas encore une crise profonde.`;
  }
  if (inflation < 0) {
    interpretation += ` L'inflation négative (déflation de ${Math.abs(inflation)}%) est preoccupante : la baisse des prix incite les ménages a reporter leurs achats, déprimant davantage la demande. C'est le piege déflationniste redoute par les banques centrales.`;
  }

  // Coherence warnings - more pedagogical
  const coherenceWarnings: string[] = [];
  if (chômage < 4 && inflation < 1) {
    coherenceWarnings.push("Historiquement rare : un chômage si bas s'accompagne généralement d'une inflation plus élevée. La courbe de Phillips predit que les tensions sur le marché du travail alimentent la hausse des salaires puis des prix");
  }
  if (croissance > 5 && soldeCommercial < -3) {
    coherenceWarnings.push("Coherent mais fragile : une forte croissance stimule les importations (les ménages consomment plus, y compris des produits étrangers), ce qui creuse naturellement le déficit commercial");
  }
  if (chômage < 3 && croissance < 0) {
    coherenceWarnings.push("Combinaison incoherente : une récession détruit des emplois et augmente le chômage (loi d'Okun). Un chômage bas avec un PIB en recul est quasi impossible hors contexte demographique exceptionnel");
  }
  if (inflation > 10 && croissance > 5) {
    coherenceWarnings.push("Surchauffe : une croissance forte avec une inflation à deux chiffres indique une économie qui dépasse ses capacités productives. Les marchés de matières premières et du travail sont en tension");
  }
  if (chômage > 15 && inflation > 8) {
    coherenceWarnings.push("Stagflation : cette combinaison rare (chômage ET inflation élevés) résulte généralement d'un choc d'offre majeur (crise pétrolière, pandemie) et non d'un exces de demande");
  }

  if (coherenceWarnings.length > 0) {
    const warningText = coherenceWarnings.map(w => `\u26a0 ${w}`).join('. ');
    observation += ` ${warningText}.`;
  }

  return {
    outputs: [
      { id: 'score', label: 'Score du carré magique', value: round2(scorePercent), unit: '%' },
      { id: 'croissance', label: 'Croissance', value: croissance, unit: '%' },
      { id: 'chômage', label: 'Chômage', value: chômage, unit: '%' },
      { id: 'inflation', label: 'Inflation', value: inflation, unit: '%' },
      { id: 'solde_commercial', label: 'Solde commercial', value: soldeCommercial, unit: '% PIB' },
    ],
    chartData: radarData,
    narration: { observation, interpretation },
  };
}

function round2(v: number): number {
  return Math.round(v * 100) / 100;
}

const kaldorSquareModule: SimulationModule = { meta, inputs, scenarios, compute };

registerModule(kaldorSquareModule);

export { kaldorSquareModule };
export default kaldorSquareModule;
