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

  let observation = `Le carre magique couvre ${scorePercent.toFixed(0)}% de la surface ideale. Le point fort est ${best.label} (${best.raw}${best.unit}), le point faible est ${worst.label} (${worst.raw}${worst.unit}).`;

  let interpretation = `Avec une croissance de ${croissance}%, un chomage de ${chomage}%, une inflation de ${inflation}% et un solde commercial de ${soldeCommercial}% du PIB, `;

  if (scorePercent >= 70) {
    interpretation += "la situation economique est globalement favorable. La plupart des objectifs macroeconomiques sont atteints ou en bonne voie.";
  } else if (scorePercent >= 40) {
    interpretation += "la situation economique est mitigee. Des arbitrages sont necessaires entre les differents objectifs de politique economique.";
  } else {
    interpretation += "la situation economique est degradee. Plusieurs indicateurs sont loin de leurs niveaux optimaux, ce qui appelle des mesures correctives.";
  }

  // Specific trade-offs
  if (chomage > 8 && inflation < 2) {
    interpretation += " Le faible niveau d'inflation associe a un chomage eleve suggere une insuffisance de la demande globale (courbe de Phillips).";
  }
  if (chomage < 4 && inflation > 4) {
    interpretation += " La combinaison chomage bas / inflation elevee illustre l'arbitrage de Phillips : l'economie est en surchauffe.";
  }
  if (soldeCommercial < -3) {
    interpretation += " Le deficit commercial important traduit un manque de competitivite ou une demande interieure excessive par rapport a l'offre domestique.";
  }

  // Coherence warnings
  const coherenceWarnings: string[] = [];
  if (chomage < 4 && inflation < 1) {
    coherenceWarnings.push("Historiquement rare : un chomage si bas s'accompagne generalement d'une inflation plus elevee (courbe de Phillips)");
  }
  if (croissance > 5 && soldeCommercial < -3) {
    coherenceWarnings.push("Une forte croissance tend a augmenter les importations et creuser le deficit commercial");
  }
  if (chomage < 3 && croissance < 0) {
    coherenceWarnings.push("Incoherent : une recession s'accompagne generalement d'une hausse du chomage");
  }
  if (inflation > 10 && croissance > 5) {
    coherenceWarnings.push("Combinaison possible mais instable : une croissance forte avec une inflation a deux chiffres suggere une surchauffe");
  }
  if (chomage > 15 && inflation > 8) {
    coherenceWarnings.push("Situation de stagflation : combinaison rare en dehors de chocs d'offre majeurs");
  }

  if (coherenceWarnings.length > 0) {
    const warningText = coherenceWarnings.map(w => `\u26a0 ${w}`).join('. ');
    observation += ` ${warningText}.`;
    interpretation += ` Attention : ${coherenceWarnings.join(' ; ')}.`;
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
