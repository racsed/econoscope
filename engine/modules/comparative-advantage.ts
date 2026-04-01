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
  slug: 'avantages-comparatifs',
  title: 'Avantages comparatifs (Ricardo)',
  subtitle: "Pourquoi le commerce international profite a tous",
  theme: 'international',
  level: 'intermediate',
  introduction:
    "La théorie des avantages comparatifs de David Ricardo (1817) demontre que même si un pays est moins productif que l'autre dans tous les domaines, le libre-échange reste mutuellement bénéfique. Chaque pays a intérêt à se spécialiser dans le bien pour lequel son coût d'opportunité est le plus faible.",
  limites: [
    'Modèle simplifie a 2 pays et 2 biens',
    "Pas de coûts de transport ni de barrieres douanières",
    "Hypothese de spécialisation complete",
    "Ignore les effets redistributifs au sein des pays",
  ],
  economists: ['david-ricardo', 'adam-smith'],
  realite: [
    "Le commerce France-Chine illustre la spécialisation : luxe/aeronautique vs manufacturier",
    "La spécialisation agricole de la Nouvelle-Zelande (lait, viande) est un cas ricardien classique",
    "Les accords de libre-échange (UE-Canada, CETA) reposent sur cette logique d'avantages mutuels",
  ],
};

const inputs: SimulationInput[] = [
  {
    id: 'productivite_pays1_bienA',
    label: 'Pays 1 - Productivité bien A',
    type: 'slider',
    min: 1,
    max: 20,
    step: 1,
    defaultValue: 10,
    tooltip: "Unites de bien A produites par heure de travail dans le pays 1",
    group: 'Pays 1',
  },
  {
    id: 'productivite_pays1_bienB',
    label: 'Pays 1 - Productivité bien B',
    type: 'slider',
    min: 1,
    max: 20,
    step: 1,
    defaultValue: 5,
    tooltip: "Unites de bien B produites par heure de travail dans le pays 1",
    group: 'Pays 1',
  },
  {
    id: 'productivite_pays2_bienA',
    label: 'Pays 2 - Productivité bien A',
    type: 'slider',
    min: 1,
    max: 20,
    step: 1,
    defaultValue: 4,
    tooltip: "Unites de bien A produites par heure de travail dans le pays 2",
    group: 'Pays 2',
  },
  {
    id: 'productivite_pays2_bienB',
    label: 'Pays 2 - Productivité bien B',
    type: 'slider',
    min: 1,
    max: 20,
    step: 1,
    defaultValue: 8,
    tooltip: "Unites de bien B produites par heure de travail dans le pays 2",
    group: 'Pays 2',
  },
  {
    id: 'spécialisation',
    label: 'Regime commercial',
    type: 'toggle',
    defaultValue: 'autarcie',
    tooltip: "Autarcie : chaque pays produit seul. Libre-échange : spécialisation selon l'avantage comparatif.",
    options: [
      { value: 'autarcie', label: 'Autarcie' },
      { value: 'libre-échange', label: 'Libre-échange' },
    ],
  },
];

const scenarios: Scenario[] = [
  {
    id: 'avantage-absolu-mutuel',
    label: 'Avantage absolu mutuel',
    description: "Chaque pays est meilleur dans un bien différent",
    values: { productivite_pays1_bienA: 10, productivite_pays1_bienB: 4, productivite_pays2_bienA: 3, productivite_pays2_bienB: 12, spécialisation: 'libre-échange' },
  },
  {
    id: 'ricardo-classique',
    label: 'Ricardo classique',
    description: "Un pays est plus productif partout, mais le commerce reste bénéfique",
    values: { productivite_pays1_bienA: 10, productivite_pays1_bienB: 5, productivite_pays2_bienA: 4, productivite_pays2_bienB: 8, spécialisation: 'libre-échange' },
  },
  {
    id: 'productivité-égale',
    label: 'Productivité égale',
    description: "Les deux pays ont les mêmes productivités : pas de gain à l'échange",
    values: { productivite_pays1_bienA: 6, productivite_pays1_bienB: 6, productivite_pays2_bienA: 6, productivite_pays2_bienB: 6, spécialisation: 'libre-échange' },
  },
  {
    id: 'avantage-ecrasant',
    label: 'Avantage ecrasant',
    description: "Un pays domine fortement dans les deux biens",
    values: { productivite_pays1_bienA: 20, productivite_pays1_bienB: 15, productivite_pays2_bienA: 2, productivite_pays2_bienB: 3, spécialisation: 'libre-échange' },
  },
];

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

function round2(v: number): number {
  return Math.round(v * 100) / 100;
}

function compute(values: Record<string, number | boolean | string>): ComputeResult {
  const p1A = clamp(Number(values.productivite_pays1_bienA) || 10, 1, 20);
  const p1B = clamp(Number(values.productivite_pays1_bienB) || 5, 1, 20);
  const p2A = clamp(Number(values.productivite_pays2_bienA) || 4, 1, 20);
  const p2B = clamp(Number(values.productivite_pays2_bienB) || 8, 1, 20);
  const régime = String(values.spécialisation || 'autarcie');

  // Total labor endowment (hours) for each country
  const L = 100;

  // PPF for each country (linear: QA/pA + QB/pB = L)
  // Country 1: QA max = p1A * L, QB max = p1B * L
  // Country 2: QA max = p2A * L, QB max = p2B * L
  const maxQA1 = p1A * L;
  const maxQB1 = p1B * L;
  const maxQA2 = p2A * L;
  const maxQB2 = p2B * L;

  // Opportunity costs
  // Country 1: cost of 1 unit of A = p1B / p1A units of B
  // Country 2: cost of 1 unit of A = p2B / p2A units of B
  const coutOpp1A = p1B / p1A; // Cost of A in terms of B for country 1
  const coutOpp2A = p2B / p2A; // Cost of A in terms of B for country 2

  // Comparative advantage: country with lower opportunity cost for A specializes in A
  const pays1SpecialiseA = coutOpp1A < coutOpp2A;
  const pays1SpecialiseB = coutOpp1A > coutOpp2A;
  const parité = Math.abs(coutOpp1A - coutOpp2A) < 0.001;

  // PPF curves
  const ppfPays1: Point[] = [];
  const ppfPays2: Point[] = [];
  for (let i = 0; i <= 100; i++) {
    const t = i / 100;
    ppfPays1.push({ x: round2(t * maxQA1), y: round2((1 - t) * maxQB1) });
    ppfPays2.push({ x: round2(t * maxQA2), y: round2((1 - t) * maxQB2) });
  }

  // Production and consumption in autarky (50/50 split)
  const autarky1A = maxQA1 / 2;
  const autarky1B = maxQB1 / 2;
  const autarky2A = maxQA2 / 2;
  const autarky2B = maxQB2 / 2;
  const totalAutarkyA = autarky1A + autarky2A;
  const totalAutarkyB = autarky1B + autarky2B;

  // Free trade with full specialization
  let trade1A: number, trade1B: number, trade2A: number, trade2B: number;
  let totalTradeA: number, totalTradeB: number;

  if (parité) {
    // No gains from trade
    trade1A = autarky1A;
    trade1B = autarky1B;
    trade2A = autarky2A;
    trade2B = autarky2B;
  } else if (pays1SpecialiseA) {
    // Country 1 specializes in A, country 2 in B
    trade1A = maxQA1;
    trade1B = 0;
    trade2A = 0;
    trade2B = maxQB2;
  } else {
    // Country 1 specializes in B, country 2 in A
    trade1A = 0;
    trade1B = maxQB1;
    trade2A = maxQA2;
    trade2B = 0;
  }
  totalTradeA = trade1A + trade2A;
  totalTradeB = trade1B + trade2B;

  const gainA = totalTradeA - totalAutarkyA;
  const gainB = totalTradeB - totalAutarkyB;

  // Determine which production points to show based on régime
  const isLibreEchange = régime === 'libre-échange';
  const currentA1 = isLibreEchange ? trade1A : autarky1A;
  const currentB1 = isLibreEchange ? trade1B : autarky1B;
  const currentA2 = isLibreEchange ? trade2A : autarky2A;
  const currentB2 = isLibreEchange ? trade2B : autarky2B;

  const series: Series[] = [
    {
      id: 'ppf-pays1',
      label: 'Frontiere Pays 1',
      color: '#3b82f6',
      data: ppfPays1,
      strokeWidth: 2.5,
    },
    {
      id: 'ppf-pays2',
      label: 'Frontiere Pays 2',
      color: '#ef4444',
      data: ppfPays2,
      strokeWidth: 2.5,
    },
  ];

  const annotations: Annotation[] = [
    {
      type: 'point',
      x: currentA1,
      y: currentB1,
      label: `Pays 1 (A=${currentA1.toFixed(0)}, B=${currentB1.toFixed(0)})`,
      color: '#3b82f6',
    },
    {
      type: 'point',
      x: currentA2,
      y: currentB2,
      label: `Pays 2 (A=${currentA2.toFixed(0)}, B=${currentB2.toFixed(0)})`,
      color: '#ef4444',
    },
  ];

  const maxX = Math.max(maxQA1, maxQA2) * 1.1;
  const maxY = Math.max(maxQB1, maxQB2) * 1.1;

  const chartData: ChartData = {
    type: 'line',
    series,
    xLabel: 'Quantité bien A',
    yLabel: 'Quantité bien B',
    xDomain: [0, maxX],
    yDomain: [0, maxY],
    annotations,
    equilibrium: { x: currentA1, y: currentB1 },
  };

  // Narration
  let observation: string;
  let interpretation: string;

  // Detect absolute advantage pattern
  const pays1AvanAbsA = p1A > p2A;
  const pays1AvanAbsB = p1B > p2B;
  const pays1AvanAbsTotal = pays1AvanAbsA && pays1AvanAbsB;
  const pays2AvanAbsTotal = !pays1AvanAbsA && !pays1AvanAbsB;

  if (parité) {
    observation = `Les deux pays ont des coûts d'opportunité identiques (${coutOpp1A.toFixed(2)} B pour 1 A dans les deux cas). Il n'y a pas d'avantage comparatif.`;
    interpretation = "Le libre-échange n'apporte aucun gain dans cette configuration. Les deux pays ont exactement les mêmes productivités relatives, donc aucune spécialisation n'est mutuellement avantageuse. Pour que des gains à l'échange existent, il faut que les ratios de productivité différent entre les deux pays.";
  } else {
    const specA = pays1SpecialiseA ? 'Pays 1' : 'Pays 2';
    const specB = pays1SpecialiseA ? 'Pays 2' : 'Pays 1';
    const coutOppSpecA = pays1SpecialiseA ? coutOpp1A : coutOpp2A;
    const coutOppAutreA = pays1SpecialiseA ? coutOpp2A : coutOpp1A;

    observation = `${specA} à l'avantage comparatif dans le bien A : son coût d'opportunité est de ${coutOppSpecA.toFixed(2)} B par unite de A, contre ${coutOppAutreA.toFixed(2)} pour ${specB}. Autrement dit, ${specA} renonce à moins de B pour produire une unite de A, c'est donc lui qui doit se spécialiser dans A.`;

    // Key Ricardian insight
    if (pays1AvanAbsTotal || pays2AvanAbsTotal) {
      const paysDominant = pays1AvanAbsTotal ? 'Pays 1' : 'Pays 2';
      const paysDomini = pays1AvanAbsTotal ? 'Pays 2' : 'Pays 1';
      observation += ` Resultat contre-intuitif de Ricardo : ${paysDominant} est plus productif que ${paysDomini} dans les DEUX biens (avantage absolu dans A et B), pourtant le commerce reste bénéfique pour les deux. Ce qui compte n'est pas la productivité absolue, mais la productivité RELATIVE (les coûts d'opportunité).`;
    }

    if (isLibreEchange) {
      interpretation = `Avec le libre-échange et la spécialisation complete, la production mondiale passe de ${totalAutarkyA.toFixed(0)} a ${totalTradeA.toFixed(0)} unites de A (${gainA >= 0 ? '+' : ''}${gainA.toFixed(0)}) et de ${totalAutarkyB.toFixed(0)} a ${totalTradeB.toFixed(0)} unites de B (${gainB >= 0 ? '+' : ''}${gainB.toFixed(0)}). Ce gain net est crée "a partir de rien" : les mêmes ressources, mieux allouees par la spécialisation, produisent davantage au niveau mondial. Chaque pays consomme ensuite les deux biens en echangeant à un prix compris entre les deux coûts d'opportunité.`;
      if (gainA < 0 && gainB > 0) {
        interpretation += ` La production de A diminue mais celle de B augmente davantage : le gain global est positif car les ressources libérées dans A sont utilisées plus efficacement dans B.`;
      } else if (gainA > 0 && gainB < 0) {
        interpretation += ` La production de B diminue mais celle de A augmente davantage : le gain global est positif car les ressources libérées dans B sont utilisées plus efficacement dans A.`;
      }
    } else {
      interpretation = `En autarcie (sans commerce), chaque pays doit produire les deux biens par lui-même. La production mondiale totale est de ${totalAutarkyA.toFixed(0)} unites de A et ${totalAutarkyB.toFixed(0)} unites de B. Le passage au libre-échange permettrait un gain de production grâce à la spécialisation selon l'avantage comparatif. Chaque pays se concentrerait sur le bien pour lequel il à le coût d'opportunité le plus faible.`;
    }
  }

  return {
    outputs: [
      { id: 'cout_opp_pays1_A', label: "Coût d'opp. Pays 1 pour A (en B)", value: round2(coutOpp1A) },
      { id: 'cout_opp_pays2_A', label: "Coût d'opp. Pays 2 pour A (en B)", value: round2(coutOpp2A) },
      { id: 'production_totale_A', label: 'Production mondiale A', value: round2(isLibreEchange ? totalTradeA : totalAutarkyA) },
      { id: 'production_totale_B', label: 'Production mondiale B', value: round2(isLibreEchange ? totalTradeB : totalAutarkyB) },
      { id: 'gain_echange_A', label: 'Gain du commerce (A)', value: round2(gainA), direction: gainA > 0 ? 'up' : gainA < 0 ? 'down' : 'neutral' },
      { id: 'gain_echange_B', label: 'Gain du commerce (B)', value: round2(gainB), direction: gainB > 0 ? 'up' : gainB < 0 ? 'down' : 'neutral' },
    ],
    chartData,
    narration: { observation, interpretation },
  };
}

const comparativeAdvantageModule: SimulationModule = { meta, inputs, scenarios, compute };

registerModule(comparativeAdvantageModule);

export { comparativeAdvantageModule };
export default comparativeAdvantageModule;
