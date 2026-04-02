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
  subtitle: 'Compétitivité-prix et condition de Marshall-Lerner',
  theme: 'international',
  level: 'intermediate',
  introduction:
    "Le taux de change réel mesure la compétitivité-prix d'une économie. Une dépréciation rend les exportations moins cheres et les importations plus couteuses. Selon la condition de Marshall-Lerner, une dépréciation ameliore la balance commerciale si la somme des elasticites des exportations et des importations dépasse 1. Ce module simule l'impact du taux de change sur les flux commerciaux.",
  limites: [
    'Pas de modèle dynamique de courbe en J (effets instantanes)',
    'Elasticites supposées constantes sur toute la plage',
    'Modèle à deux pays seulement (domestique vs etranger)',
    'Pas de prise en compte des flux de capitaux ni de la balance financière',
  ],
  economists: ['alfred-marshall'],
  realite: [
    'La dépréciation de l\'euro de 20% en 2022 a renchéri les importations energetiques',
    'L\'excédent commercial allemand repose en partie sur un euro sous-évalué pour l\'Allemagne',
    'Le déficit commercial français atteint 164 milliards EUR en 2022',
    'La Chine a longtemps maintenu un yuan sous-évalué pour doper ses exportations',
  ],
  course: {
    introduction: "Le taux de change est le prix d'une monnaie exprimé en une autre monnaie. Il joue un rôle central dans les échanges internationaux car il détermine la compétitivité-prix des exportations et le coût des importations. Quand l'euro se déprécie face au dollar, les produits européens deviennent moins chers pour les acheteurs américains (les exportations sont stimulées), tandis que les produits américains deviennent plus chers pour les européens (les importations sont freinées). Mais cet effet est-il toujours favorable à la balance commerciale ? La réponse n'est pas aussi simple qu'il y paraît.\n\nLa condition de Marshall-Lerner, du nom d'Alfred Marshall et Abba Lerner, établit que la dépréciation améliore la balance commerciale uniquement si la somme des élasticités-prix des exportations et des importations (en valeur absolue) est supérieure à 1. Intuitivement, si les volumes d'échanges réagissent suffisamment aux prix (forte élasticité), l'effet volume (plus d'exportations, moins d'importations) l'emporte sur l'effet prix (importations plus coûteuses). Si les élasticités sont faibles, la dépréciation aggrave le déficit à court terme car la facture des importations augmente sans que les volumes s'ajustent.\n\nCe phénomène d'ajustement temporel donne naissance à la célèbre « courbe en J ». Juste après une dépréciation, la balance commerciale se détériore (la barre descend, formant le creux du J) car les contrats existants sont libellés aux anciens prix. Au fil du temps, les exportateurs gagnent des parts de marché et les importateurs trouvent des substituts locaux, améliorant progressivement la balance. La durée de cette phase de transition varie selon les pays : elle est plus longue pour les économies qui importent beaucoup de matières premières incompressibles (comme la France avec l'énergie) et plus courte pour les économies industrielles diversifiées.",
    keyConcepts: [
      { term: "Taux de change nominal", definition: "Prix d'une monnaie en termes d'une autre (par exemple, 1 EUR = 1,10 USD). Une hausse signifie une appréciation (la monnaie domestique vaut plus cher), une baisse une dépréciation. Il fluctue en fonction de l'offre et de la demande sur le marché des changes." },
      { term: "Taux de change réel", definition: "Taux de change nominal corrigé des différences de niveaux de prix entre les deux pays. C'est la vraie mesure de compétitivité-prix : TCR = TCN x (P*/P), où P* est le niveau des prix étrangers et P le niveau des prix domestiques. Une hausse du TCR améliore la compétitivité." },
      { term: "Condition de Marshall-Lerner", definition: "La dépréciation améliore la balance commerciale si et seulement si la somme des élasticités-prix des exportations et des importations (en valeur absolue) dépasse 1. Si cette condition n'est pas remplie, la dépréciation aggrave le déficit commercial." },
      { term: "Courbe en J", definition: "Trajectoire temporelle de la balance commerciale après une dépréciation. A court terme, la balance se détériore (effet prix dominant car les volumes ne s'ajustent pas encore). A moyen terme, elle s'améliore (effet volume dominant). La forme résultante ressemble à la lettre J." },
      { term: "Compétitivité-prix vs hors-prix", definition: "La compétitivité-prix dépend des coûts de production et du taux de change. La compétitivité hors-prix dépend de la qualité, de l'innovation, de la marque et du service. L'Allemagne exporte beaucoup malgré un euro fort grâce à sa compétitivité hors-prix. La France a davantage besoin d'un euro faible car sa compétitivité hors-prix est moindre dans l'industrie." },
    ],
    methodology: "Commencez par observer la balance commerciale à l'équilibre. Provoquez une dépréciation de 20 % et notez l'effet immédiat sur les exportations, les importations et le solde commercial. Observez si la condition de Marshall-Lerner est vérifiée avec les élasticités par défaut. Réduisez les élasticités en dessous de 1 en somme et constatez que la dépréciation dégrade la balance. Comparez les scénarios « France » et « Allemagne » pour comprendre les différences de compétitivité.",
    forTeachers: "Utilisez l'actualité : la parité euro-dollar, les effets de la politique monétaire de la BCE. Demandez aux élèves : « La France a-t-elle intérêt à un euro fort ou faible ? ». La réponse nuancée (selon les secteurs, les élasticités) est un excellent exercice de réflexion. La courbe en J peut être tracée au tableau avant simulation.",
  },
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
    tooltip: 'Nombre d\'EUR pour 1 USD. Une hausse = dépréciation de l\'euro',
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
    label: 'Niveau des prix étrangers',
    type: 'slider',
    min: 80,
    max: 120,
    step: 1,
    defaultValue: 100,
    tooltip: 'Indice des prix étrangers en USD (base 100)',
    group: 'Prix',
  },
  {
    id: 'elasticite_export',
    label: 'Élasticité des exportations',
    type: 'slider',
    min: 0.5,
    max: 3,
    step: 0.1,
    defaultValue: 1.5,
    tooltip: 'Sensibilite des exportations au taux de change réel',
    group: 'Elasticites',
  },
  {
    id: 'elasticite_import',
    label: 'Élasticité des importations',
    type: 'slider',
    min: 0.5,
    max: 3,
    step: 0.1,
    defaultValue: 1.2,
    tooltip: 'Sensibilite des importations au taux de change réel',
    group: 'Elasticites',
  },
];

const scenarios: Scenario[] = [
  {
    id: 'euro-fort',
    label: 'Euro fort',
    description: 'Euro apprecie, importations bon marché mais exportations pénalisées',
    values: { taux_change: 0.7, prix_domestiques: 100, prix_etrangers: 100, elasticite_export: 1.5, elasticite_import: 1.2 },
  },
  {
    id: 'euro-faible',
    label: 'Euro faible',
    description: 'Euro deprecie, exportations competitives mais importations couteuses',
    values: { taux_change: 1.4, prix_domestiques: 100, prix_etrangers: 100, elasticite_export: 1.5, elasticite_import: 1.2 },
  },
  {
    id: 'choc-pétrolier',
    label: 'Choc pétrolier',
    description: 'Hausse des prix étrangers (énergie), balance dégradée',
    values: { taux_change: 1.0, prix_domestiques: 100, prix_etrangers: 120, elasticite_export: 1.5, elasticite_import: 0.8 },
  },
  {
    id: 'désinflation-competitive',
    label: 'Désinflation competitive',
    description: 'Baisse des prix domestiques pour gagner en compétitivité',
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
  // Exports increase when TCR increases (dépréciation)
  return X0 * Math.pow(tcr, elX);
}

function computeImports(tcr: number, elM: number): number {
  // Imports decrease when TCR increases (dépréciation = imports more expensive)
  if (tcr <= 0) return M0 * 1000; // guard
  return M0 * Math.pow(1 / tcr, elM);
}

function compute(values: Record<string, number | boolean | string>): ComputeResult {
  const e = clamp(Number(values.taux_change) || 1.0, 0.5, 2.0);
  const P = clamp(Number(values.prix_domestiques) || 100, 80, 120);
  const Pstar = clamp(Number(values.prix_etrangers) || 100, 80, 120);
  const elX = clamp(Number(values.elasticite_export) || 1.5, 0.5, 3);
  const elM = clamp(Number(values.elasticite_import) || 1.2, 0.5, 3);

  // Taux de change réel = e * P* / P
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
      label: 'Équilibre (BC = 0)',
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
  const directionChange = e > 1 ? 'deprecie' : e < 1 ? 'apprecie' : 'a parité';
  const observation = `Avec un taux de change de ${e.toFixed(2)} EUR/USD (euro ${directionChange}), le taux de change réel est de ${TCR.toFixed(2)}. Les exportations atteignent ${exports.toFixed(0)} et les importations ${imports.toFixed(0)}, soit une balance commerciale de ${balance >= 0 ? '+' : ''}${balance.toFixed(0)}.`;

  let interpretation = `La condition de Marshall-Lerner (somme des elasticites = ${marshallLerner.toFixed(1)}) est ${conditionRemplie ? 'remplie (> 1)' : 'non remplie (< 1)'} : une dépréciation de l'euro ${conditionRemplie ? 'ameliore' : 'degrade paradoxalement'} la balance commerciale. `;

  if (balance > 0) {
    interpretation += `L'économie dégage un excédent commercial de ${balance.toFixed(0)}. La compétitivité-prix est favorable grâce à ${TCR > 1 ? 'un taux de change réel deprecie qui rend les produits domestiques relativement bon marché a l\'etranger' : 'des prix domestiques relativement bas par rapport aux prix étrangers convertis'}.`;
  } else if (balance < 0) {
    interpretation += `L'économie est en déficit commercial de ${Math.abs(balance).toFixed(0)}. ${TCR < 1 ? 'L\'appreciation réelle de la monnaie rend les produits domestiques plus chers a l\'etranger et les importations meilleur marché : les exportations chutent et les importations augmentent.' : 'Malgre un change nominalement favorable, d\'autres facteurs (prix domestiques élevés, elasticites faibles) maintiennent un déficit.'} A court terme, la courbe en J suggere qu'une dépréciation aggrave d'abord le déficit (les volumes s'ajustent lentement) avant de l'ameliorer.`;
  } else {
    interpretation += 'La balance commerciale est a l\'équilibre : les exportations financent exactement les importations.';
  }

  if (P > 110) {
    interpretation += ` Les prix domestiques élevés (indice ${P}) reduisent la compétitivité : même sans variation du taux de change nominal, l'inflation intérieure apprecie la monnaie en termes réels.`;
  }

  if (elX + elM < 1.2 && elX + elM > 1) {
    interpretation += ` La condition de Marshall-Lerner est tout juste satisfaite (somme = ${marshallLerner.toFixed(1)}). L'effet d'une dépréciation sur la balance sera modeste et lent à se materialiser.`;
  }

  return {
    outputs: [
      { id: 'taux_change_reel', label: 'Taux de change réel', value: round2(TCR) },
      { id: 'exportations', label: 'Exportations', value: round2(exports) },
      { id: 'importations', label: 'Importations', value: round2(imports) },
      { id: 'balance_commerciale', label: 'Balance commerciale', value: round2(balance) },
      { id: 'marshall_lerner', label: 'Somme des elasticites', value: round2(marshallLerner) },
      { id: 'condition_ml', label: 'Condition Marshall-Lerner', value: conditionRemplie ? 1 : 0 },
    ],
    chartData,
    narration: { observation, interpretation },
  };
}

const exchangeRateModule: SimulationModule = { meta, inputs, scenarios, compute };

registerModule(exchangeRateModule);

export { exchangeRateModule };
export default exchangeRateModule;
