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
  title: 'Carre magique de Kaldor',
  subtitle: "Les quatre objectifs de la politique economique",
  theme: 'macro',
  level: 'intermediate',
  introduction:
    "Le carre magique de Kaldor (1971) represente graphiquement les quatre objectifs fondamentaux de la politique economique : croissance, plein emploi, stabilite des prix et equilibre exterieur. Plus la surface du quadrilatere est grande, meilleure est la situation economique. On le dit \"magique\" car il est tres difficile d'atteindre les quatre objectifs simultanement.",
  limites: [
    "Ne tient pas compte des inegalites, de l'environnement, du bien-etre",
    "Les quatre objectifs ne sont pas independants (courbe de Phillips)",
    "Ponderation implicite egale des quatre objectifs",
    "Donnees annuelles qui masquent les variations infra-annuelles",
  ],
  realite: [
    "Aucun pays n'a jamais atteint le carre parfait de maniere durable",
    "L'Allemagne des annees 2010 s'en est approchee (croissance, excedent commercial, chomage bas)",
    "La France presente typiquement un deficit du solde commercial et un chomage eleve",
  ],
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
    tooltip: "Variation annuelle du PIB reel",
    group: 'Indicateurs',
  },
  {
    id: 'chomage',
    label: 'Taux de chomage',
    type: 'slider',
    min: 0,
    max: 25,
    step: 0.1,
    defaultValue: 7.5,
    unit: '%',
    tooltip: "Part de la population active au chomage (axe inverse : moins = mieux)",
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
    description: "Croissance molle, chomage moyen, inflation post-crise energetique",
    values: { croissance: 0.9, chomage: 7.3, inflation: 4.9, solde_commercial: -3.5 },
  },
  {
    id: 'allemagne_2023',
    label: 'Allemagne 2023',
    description: "Recession technique, chomage bas, fort excedent commercial",
    values: { croissance: -0.3, chomage: 3.0, inflation: 5.9, solde_commercial: 5.5 },
  },
  {
    id: 'usa_2023',
    label: 'Etats-Unis 2023',
    description: "Croissance resiliente, marche du travail tendu",
    values: { croissance: 2.5, chomage: 3.6, inflation: 4.1, solde_commercial: -3.0 },
  },
  {
    id: 'japon_2023',
    label: 'Japon 2023',
    description: "Croissance moderee, retour de l'inflation apres des decennies",
    values: { croissance: 1.9, chomage: 2.6, inflation: 3.3, solde_commercial: -1.5 },
  },
  {
    id: 'ideal',
    label: 'Situation ideale',
    description: "Le carre magique parfait (theorique)",
    values: { croissance: 5, chomage: 2, inflation: 0.5, solde_commercial: 3 },
  },
  {
    id: 'crise',
    label: 'Crise economique',
    description: "Tous les indicateurs au rouge",
    values: { croissance: -3, chomage: 12, inflation: 8, solde_commercial: -5 },
  },
];

/**
 * Radar axes:
 * - Croissance: higher = better, range [-5, 10]
 * - Chomage: lower = better (inverted), range [0, 25]
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
  const chomage = clamp(Number(values.chomage) || 7.5, 0, 25);
  const inflation = clamp(Number(values.inflation) || 2.5, -2, 20);
  const soldeCommercial = clamp(Number(values.solde_commercial) || -1.5, -10, 10);

  const axes = [
    { id: 'croissance', label: 'Croissance (%)', min: -5, max: 10, invert: false },
    { id: 'solde_commercial', label: 'Solde commercial (% PIB)', min: -10, max: 10, invert: false },
    { id: 'chomage', label: 'Chomage (%)', min: 0, max: 25, invert: true },
    { id: 'inflation', label: 'Inflation (%)', min: -2, max: 20, invert: true },
  ];

  const currentValues: Record<string, number> = {
    croissance,
    chomage,
    solde_commercial: soldeCommercial,
    inflation,
  };

  const idealValues: Record<string, number> = {
    croissance: 5,
    chomage: 2,
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
    { label: 'chomage', value: normalizedCurrent[2], raw: chomage, unit: '%' },
    { label: 'inflation', value: normalizedCurrent[3], raw: inflation, unit: '%' },
  ];

  const sorted = [...indicators].sort((a, b) => b.value - a.value);
  const best = sorted[0];
  const worst = sorted[sorted.length - 1];

  let observation = `Le carre magique couvre ${scorePercent.toFixed(0)}% de la surface ideale. Le point fort est ${best.label} (${best.raw}${best.unit}), le point faible est ${worst.label} (${worst.raw}${worst.unit}). La surface du quadrilatere est d'autant plus grande que les quatre indicateurs sont proches de leurs valeurs "ideales" (croissance forte, chomage bas, inflation basse, excedent commercial).`;

  let interpretation = `Avec une croissance de ${croissance}%, un chomage de ${chomage}%, une inflation de ${inflation}% et un solde commercial de ${soldeCommercial}% du PIB, `;

  if (scorePercent >= 70) {
    interpretation += "la situation economique est globalement favorable. La surface couvre plus de 70% de l'ideal, ce qui signifie que la plupart des objectifs macroeconomiques sont simultanement atteints - une configuration rare et difficile a maintenir car ces objectifs sont souvent contradictoires.";
  } else if (scorePercent >= 40) {
    interpretation += "la situation economique est mitigee. Le carre est deforme, ce qui revele des arbitrages entre objectifs : on ne peut pas tout avoir en meme temps. Par exemple, stimuler la croissance (via la demande) risque d'augmenter l'inflation et de creuser le deficit commercial.";
  } else {
    interpretation += "la situation economique est degradee. Plusieurs indicateurs sont loin de leurs niveaux optimaux. Le faible score reflete une economie desequilibree ou la politique economique doit prioriser les urgences.";
  }

  // Specific trade-offs
  if (chomage > 8 && inflation < 2) {
    interpretation += " Le faible niveau d'inflation associe a un chomage eleve suggere une insuffisance de la demande globale : c'est le mecanisme de la courbe de Phillips. Une politique de relance (budgetaire ou monetaire) pourrait reduire le chomage, mais au prix d'une inflation plus elevee.";
  }
  if (chomage < 4 && inflation > 4) {
    interpretation += " La combinaison chomage bas / inflation elevee illustre l'arbitrage de Phillips : l'economie est en surchauffe, les entreprises se disputent les travailleurs et les couts grimpent. La banque centrale devrait durcir sa politique monetaire.";
  }
  if (soldeCommercial < -3) {
    interpretation += ` Le deficit commercial de ${soldeCommercial}% du PIB traduit soit un manque de competitivite-prix (couts trop eleves, monnaie trop forte), soit une demande interieure excessive qui aspire les importations. Ce deficit doit etre finance par des emprunts exterieurs.`;
  }
  if (soldeCommercial > 5) {
    interpretation += ` L'excedent commercial de ${soldeCommercial}% du PIB peut refleter une forte competitivite, mais aussi une demande interieure trop faible (epargne excessive). Un excedent persistant cree des tensions avec les partenaires commerciaux.`;
  }
  if (croissance < 0 && croissance > -3) {
    interpretation += ` La croissance legerement negative (${croissance}%) indique un ralentissement ou une recession technique. Le PIB recule mais la situation n'est pas encore une crise profonde.`;
  }
  if (inflation < 0) {
    interpretation += ` L'inflation negative (deflation de ${Math.abs(inflation)}%) est preoccupante : la baisse des prix incite les menages a reporter leurs achats, deprimant davantage la demande. C'est le piege deflationniste redoute par les banques centrales.`;
  }

  // Coherence warnings - more pedagogical
  const coherenceWarnings: string[] = [];
  if (chomage < 4 && inflation < 1) {
    coherenceWarnings.push("Historiquement rare : un chomage si bas s'accompagne generalement d'une inflation plus elevee. La courbe de Phillips predit que les tensions sur le marche du travail alimentent la hausse des salaires puis des prix");
  }
  if (croissance > 5 && soldeCommercial < -3) {
    coherenceWarnings.push("Coherent mais fragile : une forte croissance stimule les importations (les menages consomment plus, y compris des produits etrangers), ce qui creuse naturellement le deficit commercial");
  }
  if (chomage < 3 && croissance < 0) {
    coherenceWarnings.push("Combinaison incoherente : une recession detruit des emplois et augmente le chomage (loi d'Okun). Un chomage bas avec un PIB en recul est quasi impossible hors contexte demographique exceptionnel");
  }
  if (inflation > 10 && croissance > 5) {
    coherenceWarnings.push("Surchauffe : une croissance forte avec une inflation a deux chiffres indique une economie qui depasse ses capacites productives. Les marches de matieres premieres et du travail sont en tension");
  }
  if (chomage > 15 && inflation > 8) {
    coherenceWarnings.push("Stagflation : cette combinaison rare (chomage ET inflation eleves) resulte generalement d'un choc d'offre majeur (crise petroliere, pandemie) et non d'un exces de demande");
  }

  if (coherenceWarnings.length > 0) {
    const warningText = coherenceWarnings.map(w => `\u26a0 ${w}`).join('. ');
    observation += ` ${warningText}.`;
  }

  return {
    outputs: [
      { id: 'score', label: 'Score du carre magique', value: round2(scorePercent), unit: '%' },
      { id: 'croissance', label: 'Croissance', value: croissance, unit: '%' },
      { id: 'chomage', label: 'Chomage', value: chomage, unit: '%' },
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
