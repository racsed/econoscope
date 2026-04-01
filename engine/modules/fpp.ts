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
  slug: 'frontiere-possibilites-production',
  title: 'Frontière des possibilités de production',
  subtitle: "Arbitrage, coût d'opportunité et efficacité productive",
  theme: 'micro',
  level: 'accessible',
  introduction:
    "La frontière des possibilités de production (FPP) représente l'ensemble des combinaisons maximales de deux biens qu'une économie peut produire avec ses ressources et sa technologie. Tout point sur la frontière est efficient ; tout point à l'intérieur révèle un gaspillage de ressources.",
  limites: [
    'Modèle simplifie à deux biens uniquement',
    'Technologie supposée constante à court terme',
    'Hypothese de plein emploi des ressources',
    'Ne tient pas compte du commerce international',
  ],
  economists: ['joseph-schumpeter'],
  realite: [
    "L'arbitrage classique entre beurre et canons illustre les choix budgétaires des États",
    "La désindustrialisation française reflète un déplacement le long de la FPP vers les services",
    "L'innovation technologique déplace la FPP vers l'exterieur (croissance économique)",
  ],
};

const inputs: SimulationInput[] = [
  {
    id: 'ressources_totales',
    label: 'Ressources totales',
    type: 'slider',
    min: 100,
    max: 1000,
    step: 50,
    defaultValue: 500,
    tooltip: "Quantité totale de ressources disponibles dans l'économie",
    group: 'Ressources',
  },
  {
    id: 'productivite_A',
    label: 'Productivité bien A',
    type: 'slider',
    min: 1,
    max: 10,
    step: 0.5,
    defaultValue: 5,
    tooltip: 'Efficacité de production du bien A',
    group: 'Productivité',
  },
  {
    id: 'productivite_B',
    label: 'Productivité bien B',
    type: 'slider',
    min: 1,
    max: 10,
    step: 0.5,
    defaultValue: 3,
    tooltip: 'Efficacité de production du bien B',
    group: 'Productivité',
  },
  {
    id: 'point_production_A',
    label: 'Allocation au bien A',
    type: 'slider',
    min: 0,
    max: 100,
    step: 1,
    defaultValue: 50,
    unit: '%',
    tooltip: "Pourcentage des ressources allouees au bien A",
    group: 'Production',
  },
];

const scenarios: Scenario[] = [
  {
    id: 'spécialisation-A',
    label: 'Spécialisation bien A',
    description: "Toutes les ressources sont allouees à la production du bien A",
    values: { ressources_totales: 500, productivite_A: 5, productivite_B: 3, point_production_A: 100 },
  },
  {
    id: 'spécialisation-B',
    label: 'Spécialisation bien B',
    description: "Toutes les ressources sont allouees à la production du bien B",
    values: { ressources_totales: 500, productivite_A: 5, productivite_B: 3, point_production_A: 0 },
  },
  {
    id: 'équilibre',
    label: 'Équilibre 50/50',
    description: "Repartition égale des ressources entre les deux biens",
    values: { ressources_totales: 500, productivite_A: 5, productivite_B: 3, point_production_A: 50 },
  },
  {
    id: 'sous-production',
    label: 'Sous-production',
    description: "L'économie n'utilise pas toutes ses ressources (point intérieur)",
    values: { ressources_totales: 500, productivite_A: 5, productivite_B: 3, point_production_A: 30 },
  },
  {
    id: 'progrès-technique',
    label: 'Progrès technique',
    description: "Hausse des productivités simulant une avancee technologique",
    values: { ressources_totales: 500, productivite_A: 8, productivite_B: 6, point_production_A: 50 },
  },
];

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

function round2(v: number): number {
  return Math.round(v * 100) / 100;
}

function compute(values: Record<string, number | boolean | string>): ComputeResult {
  const R = clamp(Number(values.ressources_totales) || 500, 100, 1000);
  const prodA = clamp(Number(values.productivite_A) || 5, 1, 10);
  const prodB = clamp(Number(values.productivite_B) || 3, 1, 10);
  const allocA = clamp(Number(values.point_production_A) || 50, 0, 100) / 100;

  // Maximum possible outputs
  const maxQA = prodA * R;
  const maxQB = prodB * R;

  // Concave PPF: QB = prodB * sqrt(R^2 - (QA/prodA)^2)
  // Parametric: for fraction t in [0,1], QA = prodA * R * sin(t * pi/2), QB = prodB * R * cos(t * pi/2)
  const ppfCurve: Point[] = [];
  const steps = 100;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const angle = t * Math.PI / 2;
    const qa = prodA * R * Math.sin(angle);
    const qb = prodB * R * Math.cos(angle);
    ppfCurve.push({ x: round2(qa), y: round2(qb) });
  }

  // Current production point on the frontier
  const angleAlloc = allocA * Math.PI / 2;
  const qaFrontier = prodA * R * Math.sin(angleAlloc);
  const qbFrontier = prodB * R * Math.cos(angleAlloc);

  // Opportunity cost of A at current point: -dQB/dQA
  // dQA/dt = prodA * R * cos(t*pi/2) * pi/2
  // dQB/dt = -prodB * R * sin(t*pi/2) * pi/2
  // dQB/dQA = (-prodB * sin(angle)) / (prodA * cos(angle)) = -(prodB/prodA) * tan(angle)
  const safeAngle = clamp(angleAlloc, 0.01, Math.PI / 2 - 0.01);
  const coutOpportunite = Math.abs((prodB / prodA) * Math.tan(safeAngle));

  // Efficiency ratio (1.0 = on frontier)
  const efficiencyRatio = 1.0; // Point is on frontier by construction

  const series: Series[] = [
    {
      id: 'fpp',
      label: 'Frontiere des possibilites',
      color: '#3b82f6',
      data: ppfCurve,
      strokeWidth: 2.5,
    },
  ];

  const annotations: Annotation[] = [
    {
      type: 'point',
      x: qaFrontier,
      y: qbFrontier,
      label: `Production (A=${qaFrontier.toFixed(0)}, B=${qbFrontier.toFixed(0)})`,
      color: '#10b981',
    },
    {
      type: 'point',
      x: maxQA,
      y: 0,
      label: `Max A = ${maxQA.toFixed(0)}`,
      color: '#6366f1',
    },
    {
      type: 'point',
      x: 0,
      y: maxQB,
      label: `Max B = ${maxQB.toFixed(0)}`,
      color: '#f59e0b',
    },
  ];

  const chartData: ChartData = {
    type: 'line',
    series,
    xLabel: 'Quantité bien A',
    yLabel: 'Quantité bien B',
    xDomain: [0, maxQA * 1.1],
    yDomain: [0, maxQB * 1.1],
    annotations,
    equilibrium: { x: qaFrontier, y: qbFrontier },
  };

  // Narration
  const allocPct = (allocA * 100).toFixed(0);
  let observation = `Avec ${R} unites de ressources (productivité A = ${prodA}, productivité B = ${prodB}), l'économie produit ${qaFrontier.toFixed(0)} unites de bien A et ${qbFrontier.toFixed(0)} unites de bien B (allocation de ${allocPct}% au bien A). La capacité maximale est de ${maxQA.toFixed(0)} A ou ${maxQB.toFixed(0)} B en spécialisation totale.`;
  let interpretation = `Le coût d'opportunité marginal d'une unite supplémentaire de bien A est de ${coutOpportunite.toFixed(2)} unites de bien B. Ce coût augmente à mesure qu'on se spécialisé dans A (concavite de la frontière), car les ressources les moins adaptees a A sont mobilisees en dernier. `;

  if (allocA > 0.9) {
    interpretation += `L'économie est quasi spécialisée dans le bien A (${allocPct}% des ressources). Le coût d'opportunité est très élevé (${coutOpportunite.toFixed(2)} B par A supplémentaire) : les dernières unites de A "coutent" cher car il faut renoncer a beaucoup de B. Diversifier légèrement la production réduirait ce coût et pourrait être plus efficient.`;
  } else if (allocA < 0.1) {
    interpretation += `L'économie est quasi spécialisée dans le bien B (seulement ${allocPct}% des ressources au bien A). Le coût d'opportunité de A est faible (${coutOpportunite.toFixed(2)} B) : produire un peu plus de A ne sacrifierait presque rien en B. C'est le signe que la spécialisation dans B est poussee au maximum.`;
  } else if (allocA > 0.4 && allocA < 0.6) {
    interpretation += `L'économie diversifie sa production de manière equilibree. Le point se situe sur la frontière, ce qui signifie que toutes les ressources sont utilisées efficacement (pas de chômage ni de gaspillage). Tout déplacement le long de la courbe impliqué un arbitrage : produire plus de A exige de renoncer a du B, et inversement.`;
  } else {
    interpretation += `Le point de production se situe sur la frontière, ce qui signifie que l'économie utilise efficacement toutes ses ressources. Tout déplacement le long de la courbe impliqué un arbitrage : produire plus de A signifie renoncer a du B.`;
  }

  if (prodA > 7 || prodB > 7) {
    interpretation += ` La productivité élevée ${prodA > 7 ? 'du bien A' : ''}${prodA > 7 && prodB > 7 ? ' et ' : ''}${prodB > 7 ? 'du bien B' : ''} repousse la frontière vers l'exterieur, ce qui correspond à un progrès technique : l'économie peut produire davantage avec les mêmes ressources.`;
  }

  if (R > 700) {
    interpretation += ` Les ressources abondantes (${R}) étirent la frontière : une économie plus grande disposé de plus de possibilités, mais les coûts d'opportunité restent determines par les productivités relatives.`;
  } else if (R < 250) {
    interpretation += ` Avec des ressources limitées (${R}), la frontière est étroite : les choix d'allocation sont d'autant plus cruciaux car la marge d'erreur est faible.`;
  }

  return {
    outputs: [
      { id: 'quantite_A', label: 'Production bien A', value: round2(qaFrontier) },
      { id: 'quantite_B', label: 'Production bien B', value: round2(qbFrontier) },
      { id: 'cout_opportunite_A', label: "Coût d'opportunité de A (en B)", value: round2(coutOpportunite) },
      { id: 'max_A', label: 'Production maximale A', value: round2(maxQA) },
      { id: 'max_B', label: 'Production maximale B', value: round2(maxQB) },
    ],
    chartData,
    narration: { observation, interpretation },
  };
}

const fppModule: SimulationModule = { meta, inputs, scenarios, compute };

registerModule(fppModule);

export { fppModule };
export default fppModule;
