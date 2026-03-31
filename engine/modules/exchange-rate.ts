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
  slug: 'taux-de-change',
  title: 'Taux de change et balance commerciale',
  subtitle: 'Competitivite-prix et condition de Marshall-Lerner',
  theme: 'international',
  level: 'intermediate',
  introduction:
    "Le taux de change reel mesure la competitivite-prix d'une economie. Une depreciation rend les exportations moins cheres et les importations plus couteuses. Selon la condition de Marshall-Lerner, une depreciation ameliore la balance commerciale si la somme des elasticites des exportations et des importations depasse 1. Ce module simule l'impact du taux de change sur les flux commerciaux.",
  limites: [
    'Pas de modele dynamique de courbe en J (effets instantanes)',
    'Elasticites supposees constantes sur toute la plage',
    'Modele a deux pays seulement (domestique vs etranger)',
    'Pas de prise en compte des flux de capitaux ni de la balance financiere',
  ],
  realite: [
    'La depreciation de l\'euro de 20% en 2022 a rencheri les importations energetiques',
    'L\'excedent commercial allemand repose en partie sur un euro sous-evalue pour l\'Allemagne',
    'Le deficit commercial francais atteint 164 milliards EUR en 2022',
    'La Chine a longtemps maintenu un yuan sous-evalue pour doper ses exportations',
  ],
};

const X0 = 100; // Base exports
const M0 = 100; // Base imports

const inputs: SimulationInput[] = [
  {
    id: 'taux_change',
    label: 'Taux de change nominal',
    type: 'slider',
    min: 0.5,
    max: 2.0,
    step: 0.01,
    defaultValue: 1.0,
    unit: 'EUR/USD',
    tooltip: 'Nombre d\'EUR pour 1 USD. Une hausse = depreciation de l\'euro',
    group: 'Change',
  },
  {
    id: 'prix_domestiques',
    label: 'Niveau des prix domestiques',
    type: 'slider',
    min: 80,
    max: 120,
    step: 1,
    defaultValue: 100,
    tooltip: 'Indice des prix interieurs (base 100)',
    group: 'Prix',
  },
  {
    id: 'prix_etrangers',
    label: 'Niveau des prix etrangers',
    type: 'slider',
    min: 80,
    max: 120,
    step: 1,
    defaultValue: 100,
    tooltip: 'Indice des prix etrangers en USD (base 100)',
    group: 'Prix',
  },
  {
    id: 'elasticite_export',
    label: 'Elasticite des exportations',
    type: 'slider',
    min: 0.5,
    max: 3,
    step: 0.1,
    defaultValue: 1.5,
    tooltip: 'Sensibilite des exportations au taux de change reel',
    group: 'Elasticites',
  },
  {
    id: 'elasticite_import',
    label: 'Elasticite des importations',
    type: 'slider',
    min: 0.5,
    max: 3,
    step: 0.1,
    defaultValue: 1.2,
    tooltip: 'Sensibilite des importations au taux de change reel',
    group: 'Elasticites',
  },
];

const scenarios: Scenario[] = [
  {
    id: 'euro-fort',
    label: 'Euro fort',
    description: 'Euro apprecie, importations bon marche mais exportations penalisees',
    values: { taux_change: 0.7, prix_domestiques: 100, prix_etrangers: 100, elasticite_export: 1.5, elasticite_import: 1.2 },
  },
  {
    id: 'euro-faible',
    label: 'Euro faible',
    description: 'Euro deprecie, exportations competitives mais importations couteuses',
    values: { taux_change: 1.4, prix_domestiques: 100, prix_etrangers: 100, elasticite_export: 1.5, elasticite_import: 1.2 },
  },
  {
    id: 'choc-petrolier',
    label: 'Choc petrolier',
    description: 'Hausse des prix etrangers (energie), balance degradee',
    values: { taux_change: 1.0, prix_domestiques: 100, prix_etrangers: 120, elasticite_export: 1.5, elasticite_import: 0.8 },
  },
  {
    id: 'desinflation-competitive',
    label: 'Desinflation competitive',
    description: 'Baisse des prix domestiques pour gagner en competitivite',
    values: { taux_change: 1.0, prix_domestiques: 85, prix_etrangers: 100, elasticite_export: 1.5, elasticite_import: 1.2 },
  },
];

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

function round2(v: number): number {
  return Math.round(v * 100) / 100;
}

function computeExports(tcr: number, elX: number): number {
  // Exports increase when TCR increases (depreciation)
  return X0 * Math.pow(tcr, elX);
}

function computeImports(tcr: number, elM: number): number {
  // Imports decrease when TCR increases (depreciation = imports more expensive)
  if (tcr <= 0) return M0 * 1000; // guard
  return M0 * Math.pow(1 / tcr, elM);
}

function compute(values: Record<string, number | boolean | string>): ComputeResult {
  const e = clamp(Number(values.taux_change) || 1.0, 0.5, 2.0);
  const P = clamp(Number(values.prix_domestiques) || 100, 80, 120);
  const Pstar = clamp(Number(values.prix_etrangers) || 100, 80, 120);
  const elX = clamp(Number(values.elasticite_export) || 1.5, 0.5, 3);
  const elM = clamp(Number(values.elasticite_import) || 1.2, 0.5, 3);

  // Taux de change reel = e * P* / P
  const TCR = (e * Pstar) / P;

  // Current values
  const exports = computeExports(TCR, elX);
  const imports = computeImports(TCR, elM);
  const balance = exports - imports;

  // Marshall-Lerner condition
  const marshallLerner = elX + elM;
  const conditionRemplie = marshallLerner > 1;

  // Build curves over range of taux de change
  const nbPoints = 200;
  const eMin = 0.5;
  const eMax = 2.0;
  const exportsCurve: Point[] = [];
  const importsCurve: Point[] = [];
  const balanceCurve: Point[] = [];

  for (let i = 0; i <= nbPoints; i++) {
    const ei = eMin + (eMax - eMin) * i / nbPoints;
    const tcri = (ei * Pstar) / P;
    const xi = computeExports(tcri, elX);
    const mi = computeImports(tcri, elM);
    exportsCurve.push({ x: ei, y: xi });
    importsCurve.push({ x: ei, y: mi });
    balanceCurve.push({ x: ei, y: xi - mi });
  }

  const series: Series[] = [
    {
      id: 'exportations',
      label: 'Exportations',
      color: '#10b981',
      data: exportsCurve,
      strokeWidth: 2.5,
    },
    {
      id: 'importations',
      label: 'Importations',
      color: '#ef4444',
      data: importsCurve,
      strokeWidth: 2.5,
    },
    {
      id: 'balance',
      label: 'Balance commerciale',
      color: '#3b82f6',
      data: balanceCurve,
      strokeWidth: 2.5,
      area: true,
      areaOpacity: 0.15,
    },
  ];

  // Find y-range
  const allY = [...exportsCurve, ...importsCurve, ...balanceCurve].map((p) => p.y);
  const yMin = Math.min(...allY);
  const yMax = Math.max(...allY);

  const annotations: Annotation[] = [
    {
      type: 'point',
      x: e,
      y: exports,
      label: `X = ${exports.toFixed(0)}`,
      color: '#10b981',
    },
    {
      type: 'point',
      x: e,
      y: imports,
      label: `M = ${imports.toFixed(0)}`,
      color: '#ef4444',
    },
    {
      type: 'point',
      x: e,
      y: balance,
      label: `Solde = ${balance.toFixed(0)}`,
      color: '#3b82f6',
    },
    {
      type: 'line',
      x1: e,
      y1: yMin * 1.1,
      x2: e,
      y2: yMax * 1.1,
      label: `e = ${e.toFixed(2)}`,
      color: '#6b7280',
    },
    {
      type: 'line',
      x1: eMin,
      y1: 0,
      x2: eMax,
      y2: 0,
      label: 'Equilibre (BC = 0)',
      color: '#94a3b8',
    },
  ];

  const chartData: ChartData = {
    type: 'line',
    series,
    xLabel: 'Taux de change nominal (EUR/USD)',
    yLabel: 'Volume (indice base 100)',
    xDomain: [eMin, eMax],
    yDomain: [Math.min(yMin * 1.1, -50), yMax * 1.1],
    equilibrium: { x: e, y: balance },
    annotations,
  };

  // Narration
  const directionChange = e > 1 ? 'deprecie' : e < 1 ? 'apprecie' : 'a parite';
  const observation = `Avec un taux de change de ${e.toFixed(2)} EUR/USD (euro ${directionChange}), le taux de change reel est de ${TCR.toFixed(2)}. Les exportations atteignent ${exports.toFixed(0)} et les importations ${imports.toFixed(0)}, soit une balance commerciale de ${balance >= 0 ? '+' : ''}${balance.toFixed(0)}.`;

  let interpretation = `La condition de Marshall-Lerner (somme des elasticites = ${marshallLerner.toFixed(1)}) est ${conditionRemplie ? 'remplie (> 1)' : 'non remplie (< 1)'} : une depreciation de l'euro ${conditionRemplie ? 'ameliore' : 'degrade paradoxalement'} la balance commerciale. `;

  if (balance > 0) {
    interpretation += `L'economie degage un excedent commercial de ${balance.toFixed(0)}. La competitivite-prix est favorable grace a ${TCR > 1 ? 'un taux de change reel deprecie qui rend les produits domestiques relativement bon marche a l\'etranger' : 'des prix domestiques relativement bas par rapport aux prix etrangers convertis'}.`;
  } else if (balance < 0) {
    interpretation += `L'economie est en deficit commercial de ${Math.abs(balance).toFixed(0)}. ${TCR < 1 ? 'L\'appreciation reelle de la monnaie rend les produits domestiques plus chers a l\'etranger et les importations meilleur marche : les exportations chutent et les importations augmentent.' : 'Malgre un change nominalement favorable, d\'autres facteurs (prix domestiques eleves, elasticites faibles) maintiennent un deficit.'} A court terme, la courbe en J suggere qu'une depreciation aggrave d'abord le deficit (les volumes s'ajustent lentement) avant de l'ameliorer.`;
  } else {
    interpretation += 'La balance commerciale est a l\'equilibre : les exportations financent exactement les importations.';
  }

  if (P > 110) {
    interpretation += ` Les prix domestiques eleves (indice ${P}) reduisent la competitivite : meme sans variation du taux de change nominal, l'inflation interieure apprecie la monnaie en termes reels.`;
  }

  if (elX + elM < 1.2 && elX + elM > 1) {
    interpretation += ` La condition de Marshall-Lerner est tout juste satisfaite (somme = ${marshallLerner.toFixed(1)}). L'effet d'une depreciation sur la balance sera modeste et lent a se materialiser.`;
  }

  return {
    outputs: [
      { id: 'taux_change_reel', label: 'Taux de change reel', value: round2(TCR) },
      { id: 'exportations', label: 'Exportations', value: round2(exports) },
      { id: 'importations', label: 'Importations', value: round2(imports) },
      { id: 'balance_commerciale', label: 'Balance commerciale', value: round2(balance) },
      { id: 'marshall_lerner', label: 'Somme elasticites (M-L)', value: round2(marshallLerner) },
      { id: 'condition_ml', label: 'Condition M-L remplie', value: conditionRemplie ? 1 : 0 },
    ],
    chartData,
    narration: { observation, interpretation },
  };
}

const exchangeRateModule: SimulationModule = { meta, inputs, scenarios, compute };

registerModule(exchangeRateModule);

export { exchangeRateModule };
export default exchangeRateModule;
