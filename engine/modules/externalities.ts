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
  title: 'Externalités et taxe pigouvienne',
  subtitle: "Quand le marché ne reflète pas le vrai coût social",
  theme: 'micro',
  level: 'intermediate',
  introduction:
    "Une externalité existe lorsqu'une activité de production ou de consommation engendre un coût (externalité négative) ou un bénéfice (externalité positive) pour des tiers, sans que ce coût ou bénéfice soit reflété dans le prix de marché. La taxe pigouvienne vise à corriger cette défaillance en égalisant le coût privé et le coût social.",
  limites: [
    "Suppose que l'externalité est mesurable et quantifiable avec précision",
    "Ignore le théorème de Coase (négociation privée comme alternative)",
    "Coûts marginaux supposés linéaires",
    "Ne tient pas compte des effets dynamiques et comportementaux",
  ],
  realite: [
    "La taxe carbone européenne (EU ETS) est l'exemple le plus vaste de taxe pigouvienne",
    "Les subventions aux vaccins corrigent une externalité positive (immunité collective)",
    "Le marché des quotas d'émission de CO2 est une alternative aux taxes pigouviennes",
  ],
};

const inputs: SimulationInput[] = [
  {
    id: 'cout_marginal_prive',
    label: 'Coût marginal privé',
    type: 'slider',
    min: 5,
    max: 50,
    step: 1,
    defaultValue: 15,
    unit: '\u20ac',
    tooltip: "Coût de production supporté par le producteur pour chaque unité supplémentaire",
    group: 'Coûts',
  },
  {
    id: 'cout_externe_unitaire',
    label: 'Coût externe unitaire',
    type: 'slider',
    min: 0,
    max: 30,
    step: 1,
    defaultValue: 10,
    unit: '\u20ac',
    tooltip: "Coût imposé à la société par chaque unité produite (ex. pollution)",
    group: 'Coûts',
  },
  {
    id: 'type_externalite',
    label: "Type d'externalité",
    type: 'toggle',
    defaultValue: 'negative',
    tooltip: "Négative : coût social non compensé (pollution). Positive : bénéfice social non rémunéré (éducation).",
    options: [
      { value: 'negative', label: 'Négative' },
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
    tooltip: "Montant de la taxe (ext. négative) ou subvention (ext. positive) par unité",
    group: 'Politique',
  },
];

const scenarios: Scenario[] = [
  {
    id: 'pollution-usine',
    label: "Pollution d'usine",
    description: "Production industrielle avec externalité négative non corrigée",
    values: { cout_marginal_prive: 15, cout_externe_unitaire: 10, type_externalite: 'negative', taxe_pigouvienne: 0 },
  },
  {
    id: 'vaccination',
    label: 'Vaccination (ext. positive)',
    description: "La vaccination produit une externalité positive (immunité collective)",
    values: { cout_marginal_prive: 20, cout_externe_unitaire: 12, type_externalite: 'positive', taxe_pigouvienne: 0 },
  },
  {
    id: 'taxe-carbone',
    label: 'Taxe carbone optimale',
    description: "Taxe pigouvienne exactement égale au coût externe",
    values: { cout_marginal_prive: 15, cout_externe_unitaire: 10, type_externalite: 'negative', taxe_pigouvienne: 10 },
  },
  {
    id: 'subvention-education',
    label: "Subvention à l'éducation",
    description: "Subvention pour encourager une activité à externalité positive",
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
  // Private supply (Cm privé): P = cmPrive + 0.5 * Q
  // Social supply: P = (cmPrive + coutExterne) + 0.5 * Q  (négative ext)
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
      label: 'Demande (bénéfice marginal)',
      color: '#3b82f6',
      data: demandCurve,
      strokeWidth: 2.5,
    },
    {
      id: 'cm-prive',
      label: 'Cm privé (offre)',
      color: '#ef4444',
      data: supplyPrive,
      strokeWidth: 2.5,
    },
    {
      id: 'cm-social',
      label: isNegative ? 'Cm social (Cm privé + coût externe)' : 'Cm social (Cm privé - bénéfice externe)',
      color: '#8b5cf6',
      data: supplySocial,
      strokeWidth: 2,
      dashed: true,
    },
  ];

  if (taxe > 0 && supplyWithTax.length > 0) {
    series.push({
      id: 'cm-avec-taxe',
      label: isNegative ? 'Cm privé + taxe' : 'Cm privé - subvention',
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
      label: `Éq. marché (Q=${eqMarche.q.toFixed(0)}, P=${eqMarche.p.toFixed(1)})`,
      color: '#ef4444',
    },
    {
      type: 'point',
      x: eqSocial.q,
      y: eqSocial.p,
      label: `Éq. social (Q=${eqSocial.q.toFixed(0)}, P=${eqSocial.p.toFixed(1)})`,
      color: '#8b5cf6',
    },
  ];

  if (taxe > 0) {
    annotations.push({
      type: 'point',
      x: eqTax.q,
      y: eqTax.p,
      label: `Éq. avec ${isNegative ? 'taxe' : 'subvention'} (Q=${eqTax.q.toFixed(0)})`,
      color: '#f59e0b',
    });
  }

  if (deadweightLoss > 0) {
    annotations.push({
      type: 'area',
      label: `Perte sèche : ${deadweightLoss.toFixed(1)}\u20ac`,
      color: '#dc2626',
    });
  }

  const chartData: ChartData = {
    type: 'line',
    series,
    xLabel: 'Quantité',
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
    observation = `Le marché produit ${eqMarche.q.toFixed(0)} unités alors que l'optimum social est de ${eqSocial.q.toFixed(0)} unités. Il y a surproduction de ${qEcart.toFixed(0)} unités car les producteurs ne supportent pas le coût externe de ${coutExterne}\u20ac par unité (pollution, nuisances) qu'ils imposent à la société. Le coût marginal privé (${cmPrive}\u20ac) est inférieur au coût marginal social (${(cmPrive + coutExterne)}\u20ac).`;
  } else {
    observation = `Le marché produit ${eqMarche.q.toFixed(0)} unités alors que l'optimum social est de ${eqSocial.q.toFixed(0)} unités. Il y a sous-production de ${qEcart.toFixed(0)} unités car les producteurs ne captent pas le bénéfice externe de ${coutExterne}\u20ac par unité (immunité collective, savoir partagé) qu'ils procurent à la société. Le bénéfice social marginal dépasse le bénéfice privé.`;
  }

  if (taxe > 0) {
    const correction = isNegative ? 'taxe' : 'subvention';
    if (Math.abs(taxe - coutExterne) < 0.5) {
      interpretation = `La ${correction} pigouvienne de ${taxe}\u20ac est optimale : elle internalise l'externalité en faisant coïncider le coût privé avec le coût social. Le producteur intègre désormais le "vrai" coût de son activité dans ses décisions. L'équilibre de marché coïncide avec l'optimum social, éliminant la perte sèche.`;
    } else if (taxe < coutExterne) {
      interpretation = `La ${correction} de ${taxe}\u20ac corrige partiellement la défaillance mais reste insuffisante : le coût externe réel est de ${coutExterne}\u20ac. L'écart résiduel (${(coutExterne - taxe)}\u20ac) génère encore une perte sèche de ${residualDWL.toFixed(1)}\u20ac. Augmenter la ${correction} vers ${coutExterne}\u20ac rapprocherait le marché de l'optimum.`;
    } else {
      interpretation = `La ${correction} de ${taxe}\u20ac dépasse le coût externe (${coutExterne}\u20ac), créant une sur-correction : on passe d'une ${isNegative ? 'surproduction' : 'sous-production'} à une ${isNegative ? 'sous-production' : 'surproduction'} par rapport à l'optimum social. La ${correction} optimale serait de ${coutExterne}\u20ac exactement.`;
    }
  } else {
    interpretation = `Sans intervention, la perte sèche due à la ${surplusSous} est de ${deadweightLoss.toFixed(1)}\u20ac. C'est une défaillance de marché : le prix de marché ne reflète pas le "vrai" coût (ou bénéfice) pour la société. Une ${isNegative ? 'taxe' : 'subvention'} pigouvienne de ${coutExterne}\u20ac par unité (slider "${isNegative ? 'Taxe' : 'Subvention'} pigouvienne") permettrait de rétablir l'optimum social en forçant les agents à prendre en compte l'externalité.`;
  }

  if (coutExterne > 20) {
    interpretation += ` Le coût externe élevé (${coutExterne}\u20ac) suggère une externalité majeure : sans correction, la distorsion par rapport à l'optimum social est très importante.`;
  } else if (coutExterne > 0 && coutExterne < 5) {
    interpretation += ` Le coût externe modeste (${coutExterne}\u20ac) génère une faible distorsion. Le coût administratif de la taxe ou subvention pourrait dépasser le gain de bien-être.`;
  }

  return {
    outputs: [
      { id: 'q_marche', label: "Quantité d'équilibre marché", value: round2(eqMarche.q) },
      { id: 'q_social', label: "Quantité optimale sociale", value: round2(eqSocial.q) },
      { id: 'q_avec_taxe', label: `Quantité avec ${isNegative ? 'taxe' : 'subvention'}`, value: round2(taxe > 0 ? eqTax.q : eqMarche.q) },
      { id: 'cout_social_total', label: 'Coût social marginal', value: round2(isNegative ? cmPrive + coutExterne : Math.max(0, cmPrive - coutExterne)), unit: '\u20ac' },
      { id: 'perte_seche', label: 'Perte sèche', value: round2(taxe > 0 ? residualDWL : deadweightLoss), unit: '\u20ac', direction: taxe > 0 && residualDWL < deadweightLoss ? 'down' : 'neutral' },
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
