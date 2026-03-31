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
  title: 'Frontiere des possibilites de production',
  subtitle: "Arbitrage, cout d'opportunite et efficacite productive",
  theme: 'micro',
  level: 'accessible',
  introduction:
    "La frontiere des possibilites de production (FPP) represente l'ensemble des combinaisons maximales de deux biens qu'une economie peut produire avec ses ressources et sa technologie. Tout point sur la frontiere est efficient ; tout point a l'interieur revele un gaspillage de ressources.",
  limites: [
    'Modele simplifie a deux biens uniquement',
    'Technologie supposee constante a court terme',
    'Hypothese de plein emploi des ressources',
    'Ne tient pas compte du commerce international',
  ],
  realite: [
    "L'arbitrage classique entre beurre et canons illustre les choix budgetaires des Etats",
    "La desindustrialisation francaise reflete un deplacement le long de la FPP vers les services",
    "L'innovation technologique deplace la FPP vers l'exterieur (croissance economique)",
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
    tooltip: "Quantite totale de ressources disponibles dans l'economie",
    group: 'Ressources',
  },
  {
    id: 'productivite_A',
    label: 'Productivite bien A',
    type: 'slider',
    min: 1,
    max: 10,
    step: 0.5,
    defaultValue: 5,
    tooltip: 'Efficacite de production du bien A',
    group: 'Productivite',
  },
  {
    id: 'productivite_B',
    label: 'Productivite bien B',
    type: 'slider',
    min: 1,
    max: 10,
    step: 0.5,
    defaultValue: 3,
    tooltip: 'Efficacite de production du bien B',
    group: 'Productivite',
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
    id: 'specialisation-A',
    label: 'Specialisation bien A',
    description: "Toutes les ressources sont allouees a la production du bien A",
    values: { ressources_totales: 500, productivite_A: 5, productivite_B: 3, point_production_A: 100 },
  },
  {
    id: 'specialisation-B',
    label: 'Specialisation bien B',
    description: "Toutes les ressources sont allouees a la production du bien B",
    values: { ressources_totales: 500, productivite_A: 5, productivite_B: 3, point_production_A: 0 },
  },
  {
    id: 'equilibre',
    label: 'Equilibre 50/50',
    description: "Repartition egale des ressources entre les deux biens",
    values: { ressources_totales: 500, productivite_A: 5, productivite_B: 3, point_production_A: 50 },
  },
  {
    id: 'sous-production',
    label: 'Sous-production',
    description: "L'economie n'utilise pas toutes ses ressources (point interieur)",
    values: { ressources_totales: 500, productivite_A: 5, productivite_B: 3, point_production_A: 30 },
  },
  {
    id: 'progres-technique',
    label: 'Progres technique',
    description: "Hausse des productivites simulant une avancee technologique",
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
      label: 'Frontiere des possibilites (FPP)',
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
    xLabel: 'Quantite bien A',
    yLabel: 'Quantite bien B',
    xDomain: [0, maxQA * 1.1],
    yDomain: [0, maxQB * 1.1],
    annotations,
  };

  // Narration
  const allocPct = (allocA * 100).toFixed(0);
  let observation = `Avec ${R} unites de ressources (productivite A = ${prodA}, productivite B = ${prodB}), l'economie produit ${qaFrontier.toFixed(0)} unites de bien A et ${qbFrontier.toFixed(0)} unites de bien B (allocation de ${allocPct}% au bien A). La capacite maximale est de ${maxQA.toFixed(0)} A ou ${maxQB.toFixed(0)} B en specialisation totale.`;
  let interpretation = `Le cout d'opportunite marginal d'une unite supplementaire de bien A est de ${coutOpportunite.toFixed(2)} unites de bien B. Ce cout augmente a mesure qu'on se specialise dans A (concavite de la frontiere), car les ressources les moins adaptees a A sont mobilisees en dernier. `;

  if (allocA > 0.9) {
    interpretation += `L'economie est quasi specialisee dans le bien A (${allocPct}% des ressources). Le cout d'opportunite est tres eleve (${coutOpportunite.toFixed(2)} B par A supplementaire) : les dernieres unites de A "coutent" cher car il faut renoncer a beaucoup de B. Diversifier legerement la production reduirait ce cout et pourrait etre plus efficient.`;
  } else if (allocA < 0.1) {
    interpretation += `L'economie est quasi specialisee dans le bien B (seulement ${allocPct}% des ressources au bien A). Le cout d'opportunite de A est faible (${coutOpportunite.toFixed(2)} B) : produire un peu plus de A ne sacrifierait presque rien en B. C'est le signe que la specialisation dans B est poussee au maximum.`;
  } else if (allocA > 0.4 && allocA < 0.6) {
    interpretation += `L'economie diversifie sa production de maniere equilibree. Le point se situe sur la frontiere, ce qui signifie que toutes les ressources sont utilisees efficacement (pas de chomage ni de gaspillage). Tout deplacement le long de la courbe implique un arbitrage : produire plus de A exige de renoncer a du B, et inversement.`;
  } else {
    interpretation += `Le point de production se situe sur la frontiere, ce qui signifie que l'economie utilise efficacement toutes ses ressources. Tout deplacement le long de la courbe implique un arbitrage : produire plus de A signifie renoncer a du B.`;
  }

  if (prodA > 7 || prodB > 7) {
    interpretation += ` La productivite elevee ${prodA > 7 ? 'du bien A' : ''}${prodA > 7 && prodB > 7 ? ' et ' : ''}${prodB > 7 ? 'du bien B' : ''} repousse la frontiere vers l'exterieur, ce qui correspond a un progres technique : l'economie peut produire davantage avec les memes ressources.`;
  }

  if (R > 700) {
    interpretation += ` Les ressources abondantes (${R}) etirent la frontiere : une economie plus grande dispose de plus de possibilites, mais les couts d'opportunite restent determines par les productivites relatives.`;
  } else if (R < 250) {
    interpretation += ` Avec des ressources limitees (${R}), la frontiere est etroite : les choix d'allocation sont d'autant plus cruciaux car la marge d'erreur est faible.`;
  }

  return {
    outputs: [
      { id: 'quantite_A', label: 'Production bien A', value: round2(qaFrontier) },
      { id: 'quantite_B', label: 'Production bien B', value: round2(qbFrontier) },
      { id: 'cout_opportunite_A', label: "Cout d'opportunite de A (en B)", value: round2(coutOpportunite) },
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
