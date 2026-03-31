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
  slug: 'is-lm',
  title: 'Modele IS-LM',
  subtitle: "L'equilibre simultane sur les marches des biens et de la monnaie",
  theme: 'macro',
  level: 'advanced',
  introduction:
    "Le modele IS-LM (Hicks-Hansen, 1937) represente l'equilibre macroeconomique simultanee sur le marche des biens (courbe IS) et le marche monetaire (courbe LM). Il permet d'analyser les effets des politiques budgetaire et monetaire sur le revenu national et le taux d'interet.",
  limites: [
    "Modele a prix fixes (court terme keynesien)",
    "Ignore le marche du travail et l'offre globale",
    "Economie fermee dans la version de base",
    "Les courbes sont supposees lineaires",
    "Ne tient pas compte des anticipations",
  ],
  realite: [
    "La BCE fixe les taux directeurs, influencant la position de LM",
    "Le plan de relance europeen (2020) illustre un deplacement de IS vers la droite",
    "L'effet d'eviction est visible quand la relance budgetaire fait monter les taux",
  ],
};

const inputs: SimulationInput[] = [
  {
    id: 'depenses_publiques',
    label: 'Depenses publiques (G)',
    type: 'slider',
    min: 0,
    max: 500,
    step: 10,
    defaultValue: 200,
    unit: 'Mds\u20ac',
    tooltip: "Les depenses de l'Etat deplacent IS vers la droite",
    group: 'Politique budgetaire',
  },
  {
    id: 'taux_imposition',
    label: "Taux d'imposition (t)",
    type: 'slider',
    min: 0,
    max: 0.6,
    step: 0.05,
    defaultValue: 0.2,
    tooltip: "Un taux plus eleve reduit le multiplicateur et aplatit IS",
    group: 'Politique budgetaire',
  },
  {
    id: 'investissement_autonome',
    label: 'Investissement autonome (I0)',
    type: 'slider',
    min: 50,
    max: 500,
    step: 10,
    defaultValue: 200,
    unit: 'Mds\u20ac',
    tooltip: "Composante de l'investissement independante du taux d'interet",
    group: 'Investissement',
  },
  {
    id: 'sensibilite_investissement',
    label: "Sensibilite de l'investissement au taux (b)",
    type: 'slider',
    min: 1,
    max: 100,
    step: 1,
    defaultValue: 30,
    tooltip: "Plus b est grand, plus l'investissement reagit au taux d'interet",
    group: 'Investissement',
  },
  {
    id: 'offre_monnaie',
    label: 'Offre de monnaie (M)',
    type: 'slider',
    min: 100,
    max: 2000,
    step: 50,
    defaultValue: 800,
    unit: 'Mds\u20ac',
    tooltip: "Masse monetaire controlee par la banque centrale",
    group: 'Politique monetaire',
  },
  {
    id: 'niveau_prix',
    label: 'Niveau general des prix (P)',
    type: 'slider',
    min: 1,
    max: 5,
    step: 0.1,
    defaultValue: 1,
    tooltip: "Offre reelle de monnaie = M / P",
    group: 'Politique monetaire',
  },
  {
    id: 'sensibilite_monnaie',
    label: "Sensibilite de la demande de monnaie au taux (h)",
    type: 'slider',
    min: 1,
    max: 100,
    step: 1,
    defaultValue: 40,
    tooltip: "Plus h est grand, plus LM est plate (trappe a liquidite)",
    group: 'Politique monetaire',
  },
];

const scenarios: Scenario[] = [
  {
    id: 'equilibre_base',
    label: 'Equilibre de base',
    description: "Parametres standard, equilibre initial",
    values: { depenses_publiques: 200, taux_imposition: 0.2, investissement_autonome: 200, sensibilite_investissement: 30, offre_monnaie: 800, niveau_prix: 1, sensibilite_monnaie: 40 },
  },
  {
    id: 'relance_budgetaire',
    label: 'Relance budgetaire',
    description: "Augmentation des depenses publiques de 50%",
    values: { depenses_publiques: 300, taux_imposition: 0.2, investissement_autonome: 200, sensibilite_investissement: 30, offre_monnaie: 800, niveau_prix: 1, sensibilite_monnaie: 40 },
  },
  {
    id: 'relance_monetaire',
    label: 'Relance monetaire',
    description: "Expansion de l'offre de monnaie",
    values: { depenses_publiques: 200, taux_imposition: 0.2, investissement_autonome: 200, sensibilite_investissement: 30, offre_monnaie: 1200, niveau_prix: 1, sensibilite_monnaie: 40 },
  },
  {
    id: 'policy_mix',
    label: 'Policy mix expansionniste',
    description: "Combinaison de relance budgetaire et monetaire",
    values: { depenses_publiques: 300, taux_imposition: 0.2, investissement_autonome: 200, sensibilite_investissement: 30, offre_monnaie: 1200, niveau_prix: 1, sensibilite_monnaie: 40 },
  },
  {
    id: 'trappe_liquidite',
    label: 'Trappe a liquidite',
    description: "Sensibilite monetaire tres elevee, LM quasi-plate",
    values: { depenses_publiques: 200, taux_imposition: 0.2, investissement_autonome: 200, sensibilite_investissement: 30, offre_monnaie: 800, niveau_prix: 1, sensibilite_monnaie: 95 },
  },
];

/**
 * IS curve derivation:
 *   Y = C + I + G
 *   C = c0 + c1*(Y - T) with T = t*Y, c0 = 100 (autonomous consumption), c1 = 0.8
 *   I = I0 - b*r
 *   Y = c0 + c1*(1-t)*Y + I0 - b*r + G
 *   Y * (1 - c1*(1-t)) = c0 + I0 + G - b*r
 *   Y = (c0 + I0 + G - b*r) / (1 - c1*(1-t))
 *
 *   IS: r = (c0 + I0 + G) / b - Y * (1 - c1*(1-t)) / b
 *
 * LM curve derivation:
 *   M/P = kY - h*r  (money demand = money supply)
 *   where k = 0.5 (income sensitivity of money demand)
 *   r = (k*Y - M/P) / h
 *
 *   LM: r = (k/h)*Y - (M/P)/h
 *
 * Equilibrium: IS = LM intersection
 */
const C0 = 100; // autonomous consumption
const C1 = 0.8; // marginal propensity to consume
const K_MONEY = 0.5; // income sensitivity of money demand

function isRate(y: number, g: number, t: number, i0: number, b: number): number {
  return (C0 + i0 + g) / b - y * (1 - C1 * (1 - t)) / b;
}

function lmRate(y: number, m: number, p: number, h: number): number {
  return (K_MONEY * y - m / p) / h;
}

function findEquilibrium(
  g: number, t: number, i0: number, b: number, m: number, p: number, h: number
): { y: number; r: number } {
  // IS: r = (C0 + I0 + G)/b - Y*(1 - C1*(1-t))/b
  // LM: r = (K*Y - M/P)/h
  // Setting equal:
  // (C0 + I0 + G)/b - Y*s/b = K*Y/h - (M/P)/h   where s = 1 - C1*(1-t)
  // (C0 + I0 + G)/b + (M/P)/h = Y * (s/b + K/h)
  const s = 1 - C1 * (1 - t);
  const numerator = (C0 + i0 + g) / b + (m / p) / h;
  const denominator = s / b + K_MONEY / h;
  const yEq = numerator / denominator;
  const rEq = lmRate(yEq, m, p, h);
  return { y: yEq, r: rEq };
}

function compute(values: Record<string, number | boolean | string>): ComputeResult {
  const g = values.depenses_publiques as number;
  const t = values.taux_imposition as number;
  const i0 = values.investissement_autonome as number;
  const b = values.sensibilite_investissement as number;
  const m = values.offre_monnaie as number;
  const p = values.niveau_prix as number;
  const h = values.sensibilite_monnaie as number;

  const eq = findEquilibrium(g, t, i0, b, m, p, h);

  // Base equilibrium (for comparison / eviction calculation)
  const eqBase = findEquilibrium(200, 0.2, 200, 30, 800, 1, 40);

  // Y range for plotting
  const yMax = Math.max(eq.y * 2, 2000);
  const nbPoints = 100;

  const isCurve: Point[] = [];
  const lmCurve: Point[] = [];

  for (let i = 0; i <= nbPoints; i++) {
    const y = (yMax * i) / nbPoints;
    const rIS = isRate(y, g, t, i0, b);
    const rLM = lmRate(y, m, p, h);

    if (rIS >= -5 && rIS <= 30) isCurve.push({ x: y, y: rIS });
    if (rLM >= -5 && rLM <= 30) lmCurve.push({ x: y, y: rLM });
  }

  const series: Series[] = [
    {
      id: 'is',
      label: 'IS (marche des biens)',
      color: '#3b82f6',
      data: isCurve,
      strokeWidth: 2.5,
    },
    {
      id: 'lm',
      label: 'LM (marche monetaire)',
      color: '#ef4444',
      data: lmCurve,
      strokeWidth: 2.5,
    },
  ];

  const annotations: Annotation[] = [
    {
      type: 'point',
      x: eq.y,
      y: eq.r,
      label: `E* (Y=${eq.y.toFixed(0)}, r=${eq.r.toFixed(1)}%)`,
      color: '#10b981',
    },
  ];

  // Eviction effect: with more G, Y increases but r also increases, crowding out private I
  const investissement = i0 - b * eq.r;
  const investissementBase = i0 - b * eqBase.r;
  const eviction = investissementBase - investissement;

  // Multiplier with monetary feedback
  const s = 1 - C1 * (1 - t);
  const multiplicateurIS = 1 / s; // without monetary constraint
  const multiplicateurEffectif = g !== 200
    ? (eq.y - eqBase.y) / (g - 200 !== 0 ? g - 200 : 1)
    : multiplicateurIS * (h / (h + K_MONEY * b / s)); // theoretical

  const chartData: ChartData = {
    type: 'line',
    series,
    xLabel: 'Revenu national Y (Mds\u20ac)',
    yLabel: "Taux d'interet r (%)",
    xDomain: [0, yMax],
    yDomain: [-2, 20],
    equilibrium: { x: eq.y, y: eq.r },
    annotations,
  };

  // Narration
  let observation = `L'equilibre IS-LM se situe a Y* = ${eq.y.toFixed(0)} Mds\u20ac avec un taux d'interet r* = ${eq.r.toFixed(1)}%. L'investissement prive est de ${investissement.toFixed(0)} Mds\u20ac.`;

  let interpretation: string;

  if (g > 200) {
    const deltaG = g - 200;
    interpretation = `L'augmentation des depenses publiques de ${deltaG} Mds\u20ac deplace IS vers la droite. Le revenu augmente mais le taux d'interet monte egalement de ${eqBase.r.toFixed(1)}% a ${eq.r.toFixed(1)}%. `;
    if (eviction > 0) {
      interpretation += `L'effet d'eviction est de ${eviction.toFixed(0)} Mds\u20ac : la hausse du taux d'interet reduit l'investissement prive, attenuant partiellement l'effet de la relance.`;
    }
  } else if (m > 800) {
    interpretation = `L'expansion monetaire deplace LM vers la droite : le taux d'interet baisse a ${eq.r.toFixed(1)}%, stimulant l'investissement (+${(investissement - investissementBase).toFixed(0)} Mds\u20ac) et donc le revenu.`;
  } else if (h > 80) {
    interpretation = `Avec une sensibilite monetaire de ${h}, LM est quasi-horizontale : c'est la trappe a liquidite. La politique monetaire est inefficace car la monnaie supplementaire est absorbee par la speculation. Seule la politique budgetaire peut relancer l'economie.`;
  } else {
    interpretation = `A l'equilibre, le marche des biens (IS) et le marche monetaire (LM) sont simultanement en equilibre. Le multiplicateur budgetaire effectif (tenant compte de l'eviction) est de ${multiplicateurEffectif.toFixed(2)}, inferieur au multiplicateur keynesien simple de ${multiplicateurIS.toFixed(2)}.`;
  }

  return {
    outputs: [
      { id: 'revenu_equilibre', label: "Revenu d'equilibre (Y*)", value: round2(eq.y), unit: 'Mds\u20ac' },
      { id: 'taux_interet', label: "Taux d'interet (r*)", value: round2(eq.r), unit: '%' },
      { id: 'investissement', label: 'Investissement prive', value: round2(investissement), unit: 'Mds\u20ac' },
      { id: 'eviction', label: "Effet d'eviction", value: round2(Math.max(0, eviction)), unit: 'Mds\u20ac' },
      { id: 'multiplicateur_effectif', label: 'Multiplicateur effectif', value: round2(multiplicateurEffectif) },
    ],
    chartData,
    narration: { observation, interpretation },
  };
}

function round2(v: number): number {
  return Math.round(v * 100) / 100;
}

const isLmModule: SimulationModule = { meta, inputs, scenarios, compute };

registerModule(isLmModule);

export { isLmModule };
export default isLmModule;
