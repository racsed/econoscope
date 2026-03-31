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
  slug: 'externalites',
  title: 'Externalites et taxe pigouvienne',
  subtitle: "Quand le marche ne reflete pas le vrai cout social",
  theme: 'micro',
  level: 'intermediate',
  introduction:
    "Une externalite existe lorsqu'une activite de production ou de consommation engendre un cout (externalite negative) ou un benefice (externalite positive) pour des tiers, sans que ce cout ou benefice soit reflete dans le prix de marche. La taxe pigouvienne vise a corriger cette defaillance en egalisant le cout prive et le cout social.",
  limites: [
    "Suppose que l'externalite est mesurable et quantifiable avec precision",
    "Ignore le theoreme de Coase (negociation privee comme alternative)",
    "Couts marginaux supposes lineaires",
    "Ne tient pas compte des effets dynamiques et comportementaux",
  ],
  realite: [
    "La taxe carbone europeenne (EU ETS) est l'exemple le plus vaste de taxe pigouvienne",
    "Les subventions aux vaccins corrigent une externalite positive (immunite collective)",
    "Le marche des quotas d'emission de CO2 est une alternative aux taxes pigouviennes",
  ],
};

const inputs: SimulationInput[] = [
  {
    id: 'cout_marginal_prive',
    label: 'Cout marginal prive',
    type: 'slider',
    min: 5,
    max: 50,
    step: 1,
    defaultValue: 15,
    unit: '\u20ac',
    tooltip: "Cout de production supporte par le producteur pour chaque unite supplementaire",
    group: 'Couts',
  },
  {
    id: 'cout_externe_unitaire',
    label: 'Cout externe unitaire',
    type: 'slider',
    min: 0,
    max: 30,
    step: 1,
    defaultValue: 10,
    unit: '\u20ac',
    tooltip: "Cout impose a la societe par chaque unite produite (ex. pollution)",
    group: 'Couts',
  },
  {
    id: 'type_externalite',
    label: "Type d'externalite",
    type: 'toggle',
    defaultValue: 'negative',
    tooltip: "Negative : cout social non compense (pollution). Positive : benefice social non remunere (education).",
    options: [
      { value: 'negative', label: 'Negative' },
      { value: 'positive', label: 'Positive' },
    ],
  },
  {
    id: 'taxe_pigouvienne',
    label: 'Taxe/Subvention pigouvienne',
    type: 'slider',
    min: 0,
    max: 30,
    step: 1,
    defaultValue: 0,
    unit: '\u20ac',
    tooltip: "Montant de la taxe (ext. negative) ou subvention (ext. positive) par unite",
    group: 'Politique',
  },
];

const scenarios: Scenario[] = [
  {
    id: 'pollution-usine',
    label: "Pollution d'usine",
    description: "Production industrielle avec externalite negative non corrigee",
    values: { cout_marginal_prive: 15, cout_externe_unitaire: 10, type_externalite: 'negative', taxe_pigouvienne: 0 },
  },
  {
    id: 'vaccination',
    label: 'Vaccination (ext. positive)',
    description: "La vaccination produit une externalite positive (immunite collective)",
    values: { cout_marginal_prive: 20, cout_externe_unitaire: 12, type_externalite: 'positive', taxe_pigouvienne: 0 },
  },
  {
    id: 'taxe-carbone',
    label: 'Taxe carbone optimale',
    description: "Taxe pigouvienne exactement egale au cout externe",
    values: { cout_marginal_prive: 15, cout_externe_unitaire: 10, type_externalite: 'negative', taxe_pigouvienne: 10 },
  },
  {
    id: 'subvention-education',
    label: "Subvention a l'education",
    description: "Subvention pour encourager une activite a externalite positive",
    values: { cout_marginal_prive: 25, cout_externe_unitaire: 15, type_externalite: 'positive', taxe_pigouvienne: 15 },
  },
];

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

function round2(v: number): number {
  return Math.round(v * 100) / 100;
}

function compute(values: Record<string, number | boolean | string>): ComputeResult {
  const cmPrive = clamp(Number(values.cout_marginal_prive) || 15, 5, 50);
  const coutExterne = clamp(Number(values.cout_externe_unitaire) || 10, 0, 30);
  const typeExt = String(values.type_externalite || 'negative');
  const taxe = clamp(Number(values.taxe_pigouvienne) || 0, 0, 30);

  const isNegative = typeExt === 'negative';

  // Linear demand: P = 100 - Q (inverse demand)
  // Private supply (Cm prive): P = cmPrive + 0.5 * Q
  // Social supply: P = (cmPrive + coutExterne) + 0.5 * Q  (negative ext)
  //            or: P = (cmPrive - coutExterne) + 0.5 * Q  (positive ext)
  // With tax/subsidy: P = (cmPrive + taxe) + 0.5 * Q (negative, tax shifts up)
  //               or: P = (cmPrive - taxe) + 0.5 * Q (positive, subsidy shifts down)

  const demandIntercept = 100;
  const demandSlope = -1; // P = 100 - Q => Q = 100 - P

  // Supply intercepts (price-axis)
  const supplyInterceptPrive = cmPrive;
  const supplySlope = 0.5;

  const supplyInterceptSocial = isNegative
    ? cmPrive + coutExterne
    : Math.max(1, cmPrive - coutExterne);

  const supplyInterceptWithTax = isNegative
    ? cmPrive + taxe
    : Math.max(1, cmPrive - taxe);

  // Equilibrium: demand = supply => 100 - Q = intercept + 0.5*Q => Q = (100 - intercept) / 1.5
  function equilibrium(supplyIntercept: number): { q: number; p: number } {
    const q = Math.max(0, (demandIntercept - supplyIntercept) / (1 - demandSlope + supplySlope));
    // Actually: P = 100 - Q, P = intercept + 0.5Q => 100 - Q = intercept + 0.5Q => 100 - intercept = 1.5Q
    const qEq = Math.max(0, (demandIntercept - supplyIntercept) / 1.5);
    const pEq = demandIntercept - qEq;
    return { q: qEq, p: pEq };
  }

  const eqMarche = equilibrium(supplyInterceptPrive);
  const eqSocial = equilibrium(supplyInterceptSocial);
  const eqTax = equilibrium(supplyInterceptWithTax);

  // Quantity range for curves
  const maxQ = Math.max(eqMarche.q, eqSocial.q, eqTax.q) * 1.4;
  const steps = 100;

  const demandCurve: Point[] = [];
  const supplyPrive: Point[] = [];
  const supplySocial: Point[] = [];
  const supplyWithTax: Point[] = [];

  for (let i = 0; i <= steps; i++) {
    const q = (i / steps) * maxQ;
    const pDemand = demandIntercept - q;
    const pPrive = supplyInterceptPrive + supplySlope * q;
    const pSocial = supplyInterceptSocial + supplySlope * q;
    const pTax = supplyInterceptWithTax + supplySlope * q;

    if (pDemand >= 0) demandCurve.push({ x: round2(q), y: round2(pDemand) });
    if (pPrive >= 0 && pPrive <= demandIntercept * 1.2) supplyPrive.push({ x: round2(q), y: round2(pPrive) });
    if (pSocial >= 0 && pSocial <= demandIntercept * 1.2) supplySocial.push({ x: round2(q), y: round2(pSocial) });
    if (taxe > 0 && pTax >= 0 && pTax <= demandIntercept * 1.2) supplyWithTax.push({ x: round2(q), y: round2(pTax) });
  }

  // Deadweight loss (triangle between market eq and social eq)
  const qDiff = Math.abs(eqMarche.q - eqSocial.q);
  const pDiff = Math.abs(
    (supplyInterceptSocial + supplySlope * eqMarche.q) - (demandIntercept - eqMarche.q)
  );
  // For negative: overproduction => DWL = 0.5 * |qMarche - qSocial| * coutExterne at margin
  const pertSeche = coutExterne > 0 ? 0.5 * qDiff * Math.abs(
    (supplyInterceptSocial + supplySlope * eqMarche.q) - (supplyInterceptPrive + supplySlope * eqMarche.q)
  ) : 0;
  // Simplified: DWL = 0.5 * (qMarche - qSocial) * coutExterne
  const deadweightLoss = 0.5 * qDiff * coutExterne;

  // Remaining DWL with tax
  const qDiffTax = Math.abs(eqTax.q - eqSocial.q);
  const residualDWL = taxe > 0 ? 0.5 * qDiffTax * Math.abs(taxe - coutExterne) : deadweightLoss;

  const series: Series[] = [
    {
      id: 'demande',
      label: 'Demande (benefice marginal)',
      color: '#3b82f6',
      data: demandCurve,
      strokeWidth: 2.5,
    },
    {
      id: 'cm-prive',
      label: 'Cm prive (offre)',
      color: '#ef4444',
      data: supplyPrive,
      strokeWidth: 2.5,
    },
    {
      id: 'cm-social',
      label: isNegative ? 'Cm social (Cm prive + cout externe)' : 'Cm social (Cm prive - benefice externe)',
      color: '#8b5cf6',
      data: supplySocial,
      strokeWidth: 2,
      dashed: true,
    },
  ];

  if (taxe > 0 && supplyWithTax.length > 0) {
    series.push({
      id: 'cm-avec-taxe',
      label: isNegative ? 'Cm prive + taxe' : 'Cm prive - subvention',
      color: '#f59e0b',
      data: supplyWithTax,
      strokeWidth: 2,
      dashed: true,
    });
  }

  const annotations: Annotation[] = [
    {
      type: 'point',
      x: eqMarche.q,
      y: eqMarche.p,
      label: `Eq. marche (Q=${eqMarche.q.toFixed(0)}, P=${eqMarche.p.toFixed(1)})`,
      color: '#ef4444',
    },
    {
      type: 'point',
      x: eqSocial.q,
      y: eqSocial.p,
      label: `Eq. social (Q=${eqSocial.q.toFixed(0)}, P=${eqSocial.p.toFixed(1)})`,
      color: '#8b5cf6',
    },
  ];

  if (taxe > 0) {
    annotations.push({
      type: 'point',
      x: eqTax.q,
      y: eqTax.p,
      label: `Eq. avec ${isNegative ? 'taxe' : 'subvention'} (Q=${eqTax.q.toFixed(0)})`,
      color: '#f59e0b',
    });
  }

  if (deadweightLoss > 0) {
    annotations.push({
      type: 'area',
      label: `Perte seche : ${deadweightLoss.toFixed(1)}\u20ac`,
      color: '#dc2626',
    });
  }

  const chartData: ChartData = {
    type: 'line',
    series,
    xLabel: 'Quantite',
    yLabel: 'Prix (\u20ac)',
    xDomain: [0, maxQ],
    yDomain: [0, demandIntercept * 1.1],
    equilibrium: { x: eqTax.q > 0 ? eqTax.q : eqMarche.q, y: eqTax.q > 0 ? eqTax.p : eqMarche.p },
    annotations,
  };

  // Narration
  let observation: string;
  let interpretation: string;

  const surplusSous = isNegative ? 'surproduction' : 'sous-production';
  const qEcart = Math.abs(eqMarche.q - eqSocial.q);

  if (isNegative) {
    observation = `Le marche produit ${eqMarche.q.toFixed(0)} unites alors que l'optimum social est de ${eqSocial.q.toFixed(0)} unites. Il y a surproduction de ${qEcart.toFixed(0)} unites due a l'externalite negative.`;
  } else {
    observation = `Le marche produit ${eqMarche.q.toFixed(0)} unites alors que l'optimum social est de ${eqSocial.q.toFixed(0)} unites. Il y a sous-production de ${qEcart.toFixed(0)} unites car le benefice social n'est pas remunere.`;
  }

  if (taxe > 0) {
    const correction = isNegative ? 'taxe' : 'subvention';
    if (Math.abs(taxe - coutExterne) < 0.5) {
      interpretation = `La ${correction} de ${taxe}\u20ac est optimale : elle egalise le cout prive et le cout social. L'equilibre de marche coincide desormais avec l'optimum social, eliminant la perte seche.`;
    } else if (taxe < coutExterne) {
      interpretation = `La ${correction} de ${taxe}\u20ac corrige partiellement la defaillance mais reste insuffisante (cout externe = ${coutExterne}\u20ac). La perte seche residuelle est de ${residualDWL.toFixed(1)}\u20ac.`;
    } else {
      interpretation = `La ${correction} de ${taxe}\u20ac depasse le cout externe (${coutExterne}\u20ac), creant une distorsion en sens inverse. La ${correction} optimale serait de ${coutExterne}\u20ac exactement.`;
    }
  } else {
    interpretation = `Sans intervention, la perte seche due a la ${surplusSous} est de ${deadweightLoss.toFixed(1)}\u20ac. Une ${isNegative ? 'taxe' : 'subvention'} pigouvienne de ${coutExterne}\u20ac permettrait de retablir l'optimum social.`;
  }

  return {
    outputs: [
      { id: 'q_marche', label: "Quantite d'equilibre marche", value: round2(eqMarche.q) },
      { id: 'q_social', label: "Quantite optimale sociale", value: round2(eqSocial.q) },
      { id: 'q_avec_taxe', label: `Quantite avec ${isNegative ? 'taxe' : 'subvention'}`, value: round2(taxe > 0 ? eqTax.q : eqMarche.q) },
      { id: 'cout_social_total', label: 'Cout social marginal', value: round2(isNegative ? cmPrive + coutExterne : Math.max(0, cmPrive - coutExterne)), unit: '\u20ac' },
      { id: 'perte_seche', label: 'Perte seche', value: round2(taxe > 0 ? residualDWL : deadweightLoss), unit: '\u20ac', direction: taxe > 0 && residualDWL < deadweightLoss ? 'down' : 'neutral' },
      { id: 'taxe_optimale', label: `${isNegative ? 'Taxe' : 'Subvention'} optimale`, value: round2(coutExterne), unit: '\u20ac' },
    ],
    chartData,
    narration: { observation, interpretation },
  };
}

const externalitiesModule: SimulationModule = { meta, inputs, scenarios, compute };

registerModule(externalitiesModule);

export { externalitiesModule };
export default externalitiesModule;
