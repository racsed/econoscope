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
  title: 'Modèle IS-LM',
  subtitle: "L'équilibre simultané sur les marchés des biens et de la monnaie",
  theme: 'macro',
  level: 'advanced',
  introduction:
    "Le modèle IS-LM (Hicks-Hansen, 1937) représente l'équilibre macroéconomique simultanee sur le marché des biens (courbe IS) et le marché monétaire (courbe LM). Il permet d'analyser les effets des politiques budgétaire et monétaire sur le revenu national et le taux d'intérêt.",
  limites: [
    "Modèle à prix fixes (court terme keynésien)",
    "Ignore le marché du travail et l'offre globale",
    "Économie fermee dans la version de base",
    "Les courbes sont supposées linéaires",
    "Ne tient pas compte des anticipations",
  ],
  economists: ['john-hicks', 'john-maynard-keynes', 'paul-samuelson'],
  realite: [
    "La BCE fixe les taux directeurs, influencant la position de LM",
    "Le plan de relance européen (2020) illustre un déplacement de IS vers la droite",
    "L'effet d'éviction est visible quand la relance budgétaire fait monter les taux",
  ],
};

const inputs: SimulationInput[] = [
  {
    id: 'depenses_publiques',
    label: 'Dépenses publiques (G)',
    type: 'slider',
    min: 0,
    max: 500,
    step: 10,
    defaultValue: 200,
    unit: 'Mds\u20ac',
    tooltip: "Les dépenses de l'État deplacent IS vers la droite",
    group: 'Politique budgétaire',
  },
  {
    id: 'taux_imposition',
    label: "Taux d'imposition (t)",
    type: 'slider',
    min: 0,
    max: 0.6,
    step: 0.05,
    defaultValue: 0.2,
    tooltip: "Un taux plus élevé réduit le multiplicateur et aplatit IS",
    group: 'Politique budgétaire',
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
    tooltip: "Composante de l'investissement independante du taux d'intérêt",
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
    tooltip: "Plus b est grand, plus l'investissement réagit au taux d'intérêt",
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
    tooltip: "Masse monétaire contrôlée par la banque centrale",
    group: 'Politique monétaire',
  },
  {
    id: 'niveau_prix',
    label: 'Niveau général des prix (P)',
    type: 'slider',
    min: 1,
    max: 5,
    step: 0.1,
    defaultValue: 1,
    tooltip: "Offre réelle de monnaie = M / P",
    group: 'Politique monétaire',
  },
  {
    id: 'sensibilite_monnaie',
    label: "Sensibilite de la demande de monnaie au taux (h)",
    type: 'slider',
    min: 1,
    max: 100,
    step: 1,
    defaultValue: 40,
    tooltip: "Plus h est grand, plus LM est plate (trappe a liquidité)",
    group: 'Politique monétaire',
  },
];

const scenarios: Scenario[] = [
  {
    id: 'equilibre_base',
    label: 'Équilibre de base',
    description: "Paramètres standard, équilibre initial",
    values: { depenses_publiques: 200, taux_imposition: 0.2, investissement_autonome: 200, sensibilite_investissement: 30, offre_monnaie: 800, niveau_prix: 1, sensibilite_monnaie: 40 },
  },
  {
    id: 'relance_budgetaire',
    label: 'Relance budgétaire',
    description: "Augmentation des dépenses publiques de 50%",
    values: { depenses_publiques: 300, taux_imposition: 0.2, investissement_autonome: 200, sensibilite_investissement: 30, offre_monnaie: 800, niveau_prix: 1, sensibilite_monnaie: 40 },
  },
  {
    id: 'relance_monetaire',
    label: 'Relance monétaire',
    description: "Expansion de l'offre de monnaie",
    values: { depenses_publiques: 200, taux_imposition: 0.2, investissement_autonome: 200, sensibilite_investissement: 30, offre_monnaie: 1200, niveau_prix: 1, sensibilite_monnaie: 40 },
  },
  {
    id: 'policy_mix',
    label: 'Policy mix expansionniste',
    description: "Combinaison de relance budgétaire et monétaire",
    values: { depenses_publiques: 300, taux_imposition: 0.2, investissement_autonome: 200, sensibilite_investissement: 30, offre_monnaie: 1200, niveau_prix: 1, sensibilite_monnaie: 40 },
  },
  {
    id: 'trappe_liquidite',
    label: 'Trappe a liquidité',
    description: "Sensibilite monétaire très élevée, LM quasi-plate",
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
  const safeb = b || 1;
  const safeh = h || 1;
  const safep = p || 1;
  const numerator = (C0 + i0 + g) / safeb + (m / safep) / safeh;
  const denominator = s / safeb + K_MONEY / safeh;
  if (denominator === 0) return { y: 0, r: 0 };
  const yEq = numerator / denominator;
  const rEq = lmRate(yEq, m, safep, safeh);
  return { y: yEq, r: rEq };
}

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

function compute(values: Record<string, number | boolean | string>): ComputeResult {
  const g = clamp(Number(values.depenses_publiques) || 200, 0, 500);
  const t = clamp(Number(values.taux_imposition) || 0.2, 0, 0.6);
  const i0 = clamp(Number(values.investissement_autonome) || 200, 50, 500);
  const b = clamp(Number(values.sensibilite_investissement) || 30, 1, 100);
  const m = clamp(Number(values.offre_monnaie) || 800, 100, 2000);
  const p = clamp(Number(values.niveau_prix) || 1, 1, 5);
  const h = clamp(Number(values.sensibilite_monnaie) || 40, 1, 100);

  const eq = findEquilibrium(g, t, i0, b, m, p, h);

  // Base equilibrium (for comparison / éviction calculation)
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
      label: 'Marche des biens',
      color: '#3b82f6',
      data: isCurve,
      strokeWidth: 2.5,
    },
    {
      id: 'lm',
      label: 'Marche monetaire',
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
  const éviction = investissementBase - investissement;

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
    yLabel: "Taux d'intérêt r (%)",
    xDomain: [0, yMax],
    yDomain: [-2, 20],
    equilibrium: { x: eq.y, y: eq.r },
    annotations,
  };

  // Narration
  let observation = `L'équilibre IS-LM se situe a Y* = ${eq.y.toFixed(0)} Mds\u20ac avec un taux d'intérêt r* = ${eq.r.toFixed(1)}%. L'investissement privé est de ${investissement.toFixed(0)} Mds\u20ac.`;

  // Dynamic narration: compare current equilibrium to baseline
  const deltaY = eq.y - eqBase.y;
  const deltaR = eq.r - eqBase.r;
  const deltaI = investissement - investissementBase;

  let interpretation: string;
  const changes: string[] = [];

  if (Math.abs(deltaY) > 10 || Math.abs(deltaR) > 0.2) {
    // Describe what changed relative to baseline
    if (deltaY > 10) {
      changes.push(`le revenu augmente de ${deltaY.toFixed(0)} Mds\u20ac par rapport à l'équilibre de référence`);
    } else if (deltaY < -10) {
      changes.push(`le revenu diminué de ${Math.abs(deltaY).toFixed(0)} Mds\u20ac par rapport à l'équilibre de référence`);
    }

    if (deltaR > 0.2) {
      changes.push(`le taux d'intérêt monte de ${eqBase.r.toFixed(1)}% a ${eq.r.toFixed(1)}%`);
    } else if (deltaR < -0.2) {
      changes.push(`le taux d'intérêt baisse de ${eqBase.r.toFixed(1)}% a ${eq.r.toFixed(1)}%`);
    }

    interpretation = `Par rapport à l'équilibre de référence, ${changes.join(' et ')}. `;

    // Explain the causes based on what parameters diverged from defaults
    const causes: string[] = [];
    if (g !== 200) {
      const deltaG = g - 200;
      causes.push(deltaG > 0
        ? `les dépenses publiques plus élevées (+${deltaG} Mds\u20ac) deplacent IS vers la droite`
        : `les dépenses publiques plus faibles (${deltaG} Mds\u20ac) deplacent IS vers la gauche`);
    }
    if (m !== 800 || p !== 1) {
      const mReelCurrent = m / p;
      const mReelBase = 800 / 1;
      if (mReelCurrent > mReelBase * 1.05) {
        causes.push(`l'offre réelle de monnaie plus abondante déplace LM vers la droite`);
      } else if (mReelCurrent < mReelBase * 0.95) {
        causes.push(`l'offre réelle de monnaie plus faible déplace LM vers la gauche`);
      }
    }
    if (causes.length > 0) {
      interpretation += causes.join(', et ') + '. ';
    }

    // Eviction effect
    if (éviction > 5) {
      interpretation += `L'effet d'éviction est de ${éviction.toFixed(0)} Mds\u20ac : la hausse du taux d'intérêt réduit l'investissement privé, atténuant partiellement l'effet de la relance.`;
    } else if (deltaI > 5) {
      interpretation += `L'investissement privé augmente de ${deltaI.toFixed(0)} Mds\u20ac grace à la baisse du taux d'intérêt.`;
    }

    // Liquidity trap detection (dynamic: LM slope is K_MONEY/h, very flat when h is high relative to b)
    if (h > 3 * b) {
      interpretation += ` Avec h = ${h} (bien supérieur a b = ${b}), LM est quasi-horizontale : on approche la trappe a liquidité. La politique monétaire perd en efficacité au profit de la politique budgétaire.`;
    }
  } else {
    interpretation = `A l'équilibre, le marché des biens (IS) et le marché monétaire (LM) sont simultanément en équilibre. Le multiplicateur budgétaire effectif (tenant compte de l'éviction) est de ${multiplicateurEffectif.toFixed(2)}, inférieur au multiplicateur keynésien simple de ${multiplicateurIS.toFixed(2)}. Pourquoi cette différence ? Parce que la hausse du revenu augmente la demande de monnaie, ce qui fait monter le taux d'intérêt et freine l'investissement privé : c'est l'effet d'éviction (crowding out).`;
  }

  if (t > 0.4) {
    interpretation += ` Le taux d'imposition élevé (${(t * 100).toFixed(0)}%) aplatit la courbe IS car il réduit le multiplicateur : chaque euro de revenu supplémentaire est davantage prélevé, limitant la propagation de la dépense.`;
  }

  if (b > 60 && h < 20) {
    interpretation += ` Avec un investissement très sensible au taux (b = ${b}) et une demande de monnaie peu sensible (h = ${h}), l'effet d'éviction est maximal : toute relance budgétaire fait fortement monter les taux, annulant une grande partie de l'effet sur Y.`;
  }

  return {
    outputs: [
      { id: 'revenu_equilibre', label: "Revenu d'equilibre", value: round2(eq.y), unit: 'Mds\u20ac' },
      { id: 'taux_interet', label: "Taux d'interet", value: round2(eq.r), unit: '%' },
      { id: 'investissement', label: 'Investissement privé', value: round2(investissement), unit: 'Mds\u20ac' },
      { id: 'éviction', label: "Effet d'éviction", value: round2(Math.max(0, éviction)), unit: 'Mds\u20ac' },
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
