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
    "La theorie des avantages comparatifs de David Ricardo (1817) demontre que meme si un pays est moins productif que l'autre dans tous les domaines, le libre-echange reste mutuellement benefique. Chaque pays a interet a se specialiser dans le bien pour lequel son cout d'opportunite est le plus faible.",
  limites: [
    'Modele simplifie a 2 pays et 2 biens',
    "Pas de couts de transport ni de barrieres douanieres",
    "Hypothese de specialisation complete",
    "Ignore les effets redistributifs au sein des pays",
  ],
  realite: [
    "Le commerce France-Chine illustre la specialisation : luxe/aeronautique vs manufacturier",
    "La specialisation agricole de la Nouvelle-Zelande (lait, viande) est un cas ricardien classique",
    "Les accords de libre-echange (UE-Canada, CETA) reposent sur cette logique d'avantages mutuels",
  ],
};

const inputs: SimulationInput[] = [
  {
    id: 'productivite_pays1_bienA',
    label: 'Pays 1 - Productivite bien A',
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
    label: 'Pays 1 - Productivite bien B',
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
    label: 'Pays 2 - Productivite bien A',
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
    label: 'Pays 2 - Productivite bien B',
    type: 'slider',
    min: 1,
    max: 20,
    step: 1,
    defaultValue: 8,
    tooltip: "Unites de bien B produites par heure de travail dans le pays 2",
    group: 'Pays 2',
  },
  {
    id: 'specialisation',
    label: 'Regime commercial',
    type: 'toggle',
    defaultValue: 'autarcie',
    tooltip: "Autarcie : chaque pays produit seul. Libre-echange : specialisation selon l'avantage comparatif.",
    options: [
      { value: 'autarcie', label: 'Autarcie' },
      { value: 'libre-echange', label: 'Libre-echange' },
    ],
  },
];

const scenarios: Scenario[] = [
  {
    id: 'avantage-absolu-mutuel',
    label: 'Avantage absolu mutuel',
    description: "Chaque pays est meilleur dans un bien different",
    values: { productivite_pays1_bienA: 10, productivite_pays1_bienB: 4, productivite_pays2_bienA: 3, productivite_pays2_bienB: 12, specialisation: 'libre-echange' },
  },
  {
    id: 'ricardo-classique',
    label: 'Ricardo classique',
    description: "Un pays est plus productif partout, mais le commerce reste benefique",
    values: { productivite_pays1_bienA: 10, productivite_pays1_bienB: 5, productivite_pays2_bienA: 4, productivite_pays2_bienB: 8, specialisation: 'libre-echange' },
  },
  {
    id: 'productivite-egale',
    label: 'Productivite egale',
    description: "Les deux pays ont les memes productivites : pas de gain a l'echange",
    values: { productivite_pays1_bienA: 6, productivite_pays1_bienB: 6, productivite_pays2_bienA: 6, productivite_pays2_bienB: 6, specialisation: 'libre-echange' },
  },
  {
    id: 'avantage-ecrasant',
    label: 'Avantage ecrasant',
    description: "Un pays domine fortement dans les deux biens",
    values: { productivite_pays1_bienA: 20, productivite_pays1_bienB: 15, productivite_pays2_bienA: 2, productivite_pays2_bienB: 3, specialisation: 'libre-echange' },
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
  const regime = String(values.specialisation || 'autarcie');

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
  const parite = Math.abs(coutOpp1A - coutOpp2A) < 0.001;

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

  if (parite) {
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

  // Determine which production points to show based on regime
  const isLibreEchange = regime === 'libre-echange';
  const currentA1 = isLibreEchange ? trade1A : autarky1A;
  const currentB1 = isLibreEchange ? trade1B : autarky1B;
  const currentA2 = isLibreEchange ? trade2A : autarky2A;
  const currentB2 = isLibreEchange ? trade2B : autarky2B;

  const series: Series[] = [
    {
      id: 'ppf-pays1',
      label: 'FPP Pays 1',
      color: '#3b82f6',
      data: ppfPays1,
      strokeWidth: 2.5,
    },
    {
      id: 'ppf-pays2',
      label: 'FPP Pays 2',
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
    xLabel: 'Quantite bien A',
    yLabel: 'Quantite bien B',
    xDomain: [0, maxX],
    yDomain: [0, maxY],
    annotations,
  };

  // Narration
  let observation: string;
  let interpretation: string;

  if (parite) {
    observation = "Les deux pays ont des couts d'opportunite identiques. Il n'y a pas d'avantage comparatif.";
    interpretation = "Le libre-echange n'apporte aucun gain dans cette configuration. Les deux pays sont dans la meme situation relative.";
  } else {
    const specA = pays1SpecialiseA ? 'Pays 1' : 'Pays 2';
    const specB = pays1SpecialiseA ? 'Pays 2' : 'Pays 1';
    observation = `${specA} a l'avantage comparatif dans le bien A (cout d'opportunite : ${pays1SpecialiseA ? coutOpp1A.toFixed(2) : coutOpp2A.toFixed(2)} B). ${specB} a l'avantage comparatif dans le bien B.`;

    if (isLibreEchange) {
      interpretation = `Avec le libre-echange et la specialisation, la production mondiale passe de ${totalAutarkyA.toFixed(0)} a ${totalTradeA.toFixed(0)} unites de A (${gainA >= 0 ? '+' : ''}${gainA.toFixed(0)}) et de ${totalAutarkyB.toFixed(0)} a ${totalTradeB.toFixed(0)} unites de B (${gainB >= 0 ? '+' : ''}${gainB.toFixed(0)}). Le commerce international augmente la richesse totale disponible.`;
    } else {
      interpretation = `En autarcie, chaque pays produit les deux biens. La production mondiale totale est de ${totalAutarkyA.toFixed(0)} unites de A et ${totalAutarkyB.toFixed(0)} unites de B. Le passage au libre-echange permettrait un gain de ${Math.max(0, gainA).toFixed(0)} A et/ou ${Math.max(0, gainB).toFixed(0)} B.`;
    }
  }

  return {
    outputs: [
      { id: 'cout_opp_pays1_A', label: "Cout d'opp. Pays 1 pour A (en B)", value: round2(coutOpp1A) },
      { id: 'cout_opp_pays2_A', label: "Cout d'opp. Pays 2 pour A (en B)", value: round2(coutOpp2A) },
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
