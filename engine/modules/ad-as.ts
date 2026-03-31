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
  title: 'Modele AD-AS',
  subtitle: "Demande globale et offre globale",
  theme: 'macro',
  level: 'advanced',
  introduction:
    "Le modele AD-AS (Aggregate Demand - Aggregate Supply) determine simultanement le niveau des prix et la production. La courbe AD represente l'ensemble des equilibres IS-LM pour differents niveaux de prix. Les courbes AS (court et long terme) refletent les conditions d'offre de l'economie.",
  limites: [
    "Simplification des ajustements dynamiques",
    "Les courbes sont supposees stables dans le temps",
    "Ne modelise pas explicitement les anticipations",
    "LRAS suppose un PIB potentiel fixe a court terme",
  ],
  realite: [
    "La crise Covid (2020) : choc d'offre ET de demande simultane",
    "La hausse des prix de l'energie (2022) : deplacement de SRAS vers la gauche",
    "Les plans de relance post-Covid : deplacement de AD vers la droite",
  ],
};

const inputs: SimulationInput[] = [
  {
    id: 'depenses_publiques',
    label: 'Depenses publiques',
    type: 'slider',
    min: 0,
    max: 500,
    step: 10,
    defaultValue: 200,
    unit: 'Mds\u20ac',
    tooltip: "Augmenter G deplace AD vers la droite",
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
    tooltip: "Augmenter M deplace AD vers la droite",
    group: 'Demande globale',
  },
  {
    id: 'prix_petrole',
    label: 'Prix du petrole (indice)',
    type: 'slider',
    min: 50,
    max: 300,
    step: 10,
    defaultValue: 100,
    tooltip: "Une hausse deplace SRAS vers la gauche (choc d'offre negatif)",
    group: 'Offre globale',
  },
  {
    id: 'productivite',
    label: 'Productivite (indice)',
    type: 'slider',
    min: 50,
    max: 200,
    step: 5,
    defaultValue: 100,
    tooltip: "Une hausse deplace SRAS et LRAS vers la droite",
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
    tooltip: "Une hausse deplace SRAS vers la gauche",
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
    label: 'Equilibre macroeconomique',
    description: "Situation initiale de reference",
    values: { depenses_publiques: 200, offre_monnaie: 800, prix_petrole: 100, productivite: 100, salaire_nominal: 100, mode_long_terme: true },
  },
  {
    id: 'relance_budgetaire',
    label: 'Relance budgetaire',
    description: "Augmentation massive des depenses publiques",
    values: { depenses_publiques: 350, offre_monnaie: 800, prix_petrole: 100, productivite: 100, salaire_nominal: 100, mode_long_terme: true },
  },
  {
    id: 'choc_petrolier',
    label: 'Choc petrolier',
    description: "Doublement du prix du petrole",
    values: { depenses_publiques: 200, offre_monnaie: 800, prix_petrole: 200, productivite: 100, salaire_nominal: 100, mode_long_terme: true },
  },
  {
    id: 'gains_productivite',
    label: 'Gains de productivite',
    description: "Progres technologique augmentant la productivite de 50%",
    values: { depenses_publiques: 200, offre_monnaie: 800, prix_petrole: 100, productivite: 150, salaire_nominal: 100, mode_long_terme: true },
  },
  {
    id: 'stagflation',
    label: 'Stagflation',
    description: "Choc d'offre negatif combinant hausse des prix et baisse de production",
    values: { depenses_publiques: 200, offre_monnaie: 800, prix_petrole: 250, productivite: 85, salaire_nominal: 130, mode_long_terme: true },
  },
];

/**
 * AD curve: derived from IS-LM
 *   Y_AD(P) = A_d / P + B_d
 *   More specifically, from IS-LM equilibrium Y = f(M/P, G, ...)
 *   Simplified: Y_AD = alpha * (G + I0) + beta * M/P
 *   where alpha and beta depend on IS-LM parameters
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
  productivite: number,
  prixPetrole: number
): number {
  const costFactor = (salaire / 100) * (prixPetrole / 100) / (productivite / 100);
  return P0_BASE * costFactor + GAMMA_SRAS * (y - yPotential) * costFactor;
}

function findAdAsEquilibrium(
  g: number, m: number, salaire: number, productivite: number, prixPetrole: number
): { y: number; p: number } {
  // Numerical solver: find intersection of AD and SRAS
  // AD: Y = K_G * G + K_M * M / P => P = K_M * M / (Y - K_G * G)
  // SRAS: P = srasPrice(Y, ...)
  // Set them equal and solve numerically

  const yPotential = BASE_POTENTIAL * (productivite / 100);

  // Newton-like bisection on Y
  let yLow = 100;
  let yHigh = 3000;

  for (let iter = 0; iter < 100; iter++) {
    const yMid = (yLow + yHigh) / 2;
    const pAD = yMid > K_G * g ? K_M * m / (yMid - K_G * g) : 100;
    const pSRAS = srasPrice(yMid, yPotential, salaire, productivite, prixPetrole);

    if (pAD > pSRAS) {
      yLow = yMid;
    } else {
      yHigh = yMid;
    }

    if (Math.abs(yHigh - yLow) < 0.1) break;
  }

  const yEq = (yLow + yHigh) / 2;
  const pEq = srasPrice(yEq, yPotential, salaire, productivite, prixPetrole);
  return { y: yEq, p: pEq };
}

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

function compute(values: Record<string, number | boolean | string>): ComputeResult {
  const g = clamp(Number(values.depenses_publiques) || 200, 0, 500);
  const m = clamp(Number(values.offre_monnaie) || 800, 100, 2000);
  const prixPetrole = clamp(Number(values.prix_petrole) || 100, 50, 300);
  const productivite = clamp(Number(values.productivite) || 100, 50, 200);
  const salaire = clamp(Number(values.salaire_nominal) || 100, 50, 200);
  const modeLongTerme = typeof values.mode_long_terme === 'boolean' ? values.mode_long_terme : true;

  const yPotential = BASE_POTENTIAL * (productivite / 100);
  const eq = findAdAsEquilibrium(g, m, salaire, productivite, prixPetrole);
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
    const pSRAS = srasPrice(y, yPotential, salaire, productivite, prixPetrole);
    if (pSRAS > 0 && pSRAS < 10) {
      srasCurve.push({ x: y, y: pSRAS });
    }
  }

  const series: Series[] = [
    {
      id: 'ad',
      label: 'Demande globale (AD)',
      color: '#3b82f6',
      data: adCurve,
      strokeWidth: 2.5,
    },
    {
      id: 'sras',
      label: 'Offre globale CT (SRAS)',
      color: '#ef4444',
      data: srasCurve,
      strokeWidth: 2.5,
    },
  ];

  if (modeLongTerme) {
    series.push({
      id: 'lras',
      label: `Offre globale LT (Yp = ${yPotential.toFixed(0)})`,
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
    yDomain: [0, 5],
    equilibrium: { x: eq.y, y: eq.p },
    annotations,
  };

  // Narration
  let observation = `L'equilibre macroeconomique se situe a Y = ${eq.y.toFixed(0)} Mds\u20ac avec un niveau des prix P = ${eq.p.toFixed(2)}.`;
  if (modeLongTerme) {
    observation += ` Le PIB potentiel est de ${yPotential.toFixed(0)} Mds\u20ac. L'ecart de production (output gap) est de ${outputGap.toFixed(1)}%.`;
  }

  let interpretation: string;

  if (outputGap > 2) {
    interpretation = `L'economie est en surchauffe : la production depasse le potentiel de ${outputGap.toFixed(1)}%. Cela exerce une pression a la hausse sur les prix. A long terme, les salaires s'ajusteront a la hausse, deplacant SRAS vers la gauche jusqu'au retour au potentiel avec un niveau des prix plus eleve.`;
  } else if (outputGap < -2) {
    interpretation = `L'economie est en recession : la production est inferieure au potentiel de ${Math.abs(outputGap).toFixed(1)}%. Il existe des capacites inutilisees et du chomage conjoncturel. Une politique de relance (budgetaire ou monetaire) pourrait combler cet ecart.`;
  } else {
    interpretation = `L'economie est proche de son potentiel. L'ecart de production est faible (${outputGap.toFixed(1)}%), indiquant un equilibre macroeconomique relativement sain.`;
  }

  if (prixPetrole > 150) {
    interpretation += ` La hausse du prix du petrole (indice ${prixPetrole}) agit comme un choc d'offre negatif, deplacant SRAS vers la gauche et provoquant une situation de stagflation (hausse des prix et baisse de la production).`;
  }

  if (g > 300) {
    interpretation += ` Les depenses publiques elevees (${g} Mds\u20ac) deplacent AD vers la droite, stimulant la production mais exercant une pression inflationniste.`;
  }

  return {
    outputs: [
      { id: 'production', label: 'Production (Y)', value: round2(eq.y), unit: 'Mds\u20ac', direction: eq.y > eqBase.y ? 'up' : eq.y < eqBase.y ? 'down' : 'neutral' },
      { id: 'niveau_prix', label: 'Niveau des prix (P)', value: round2(eq.p), direction: eq.p > eqBase.p ? 'up' : eq.p < eqBase.p ? 'down' : 'neutral' },
      { id: 'pib_potentiel', label: 'PIB potentiel', value: round2(yPotential), unit: 'Mds\u20ac' },
      { id: 'output_gap', label: 'Ecart de production', value: round2(outputGap), unit: '%', direction: outputGap > 0 ? 'up' : outputGap < 0 ? 'down' : 'neutral' },
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
