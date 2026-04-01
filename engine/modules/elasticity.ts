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
  slug: 'elasticite-prix',
  title: 'Élasticité-prix de la demande',
  subtitle: 'Mesurer la sensibilité des consommateurs au prix',
  theme: 'micro',
  level: 'accessible',
  introduction:
    "L'élasticité-prix de la demande mesure la variation en pourcentage de la quantité demandée en réponse à une variation de 1% du prix. Elle détermine si la demande est élastique (|e| > 1), unitaire (|e| = 1) ou inélastique (|e| < 1).",
  limites: [
    "Élasticité supposée constante le long de la courbe (modèle iso-élastique)",
    "Ne tient pas compte des effets de substitution entre biens",
    "Analyse statique : pas de dimension temporelle",
  ],
  economists: ['alfred-marshall'],
  realite: [
    "L'élasticité-prix de l'essence est d'environ -0.3 à court terme",
    "Les biens de luxe ont une élasticité-prix généralement supérieure à 1",
    "Le tabac a une élasticité d'environ -0.4, justifiant la taxation",
  ],
};

const inputs: SimulationInput[] = [
  {
    id: 'prix_initial',
    label: 'Prix initial',
    type: 'slider',
    min: 10,
    max: 200,
    step: 1,
    defaultValue: 50,
    unit: '\u20ac',
    group: 'Paramètres',
  },
  {
    id: 'elasticite',
    label: 'Élasticité-prix',
    type: 'slider',
    min: -5,
    max: -0.1,
    step: 0.1,
    defaultValue: -1,
    tooltip: 'Valeur négative : quand le prix monte, la demande baisse',
    group: 'Paramètres',
  },
  {
    id: 'type_bien',
    label: 'Type de bien',
    type: 'select',
    defaultValue: 'normal',
    options: [
      { value: 'necessaire', label: 'Bien nécessaire (|e| < 1)' },
      { value: 'normal', label: 'Bien normal (|e| ~ 1)' },
      { value: 'luxe', label: 'Bien de luxe (|e| > 1)' },
    ],
    group: 'Paramètres',
  },
  {
    id: 'variation_prix',
    label: 'Variation du prix (%)',
    type: 'slider',
    min: -50,
    max: 100,
    step: 1,
    defaultValue: 20,
    unit: '%',
    tooltip: 'Variation appliquée au prix initial',
    group: 'Simulation',
  },
];

const scenarios: Scenario[] = [
  {
    id: 'essence',
    label: 'Essence (inélastique)',
    description: "Demande peu sensible au prix, bien indispensable",
    values: { prix_initial: 80, elasticite: -0.3, type_bien: 'necessaire', variation_prix: 20 },
  },
  {
    id: 'restaurant_luxe',
    label: 'Restaurant gastronomique',
    description: "Demande très sensible au prix, bien substituable",
    values: { prix_initial: 150, elasticite: -2.5, type_bien: 'luxe', variation_prix: 10 },
  },
  {
    id: 'elasticite_unitaire',
    label: 'Élasticité unitaire',
    description: "La recette totale est maximisée",
    values: { prix_initial: 50, elasticite: -1, type_bien: 'normal', variation_prix: 0 },
  },
  {
    id: 'tabac',
    label: 'Tabac',
    description: "Demande peu élastique, forte dépendance",
    values: { prix_initial: 12, elasticite: -0.4, type_bien: 'necessaire', variation_prix: 30 },
  },
  {
    id: 'electricite',
    label: 'Électricité (inélastique)',
    description: "Bien essentiel, peu de substituts à court terme",
    values: { prix_initial: 150, elasticite: -0.2, type_bien: 'necessaire', variation_prix: 15 },
  },
  {
    id: 'netflix',
    label: 'Abonnement Netflix',
    description: "Loisir substituable, demande élastique",
    values: { prix_initial: 14, elasticite: -1.8, type_bien: 'luxe', variation_prix: 20 },
  },
  {
    id: 'baguette',
    label: 'Baguette de pain',
    description: "Bien de première nécessité, très inélastique",
    values: { prix_initial: 1.2, elasticite: -0.15, type_bien: 'necessaire', variation_prix: 25 },
  },
  {
    id: 'vol_low_cost',
    label: 'Vol low-cost',
    description: "Très substituable, demande très élastique",
    values: { prix_initial: 50, elasticite: -3.5, type_bien: 'luxe', variation_prix: 10 },
  },
  {
    id: 'medicament_vital',
    label: 'Médicament vital',
    description: "Aucun substitut, demande parfaitement inélastique",
    values: { prix_initial: 30, elasticite: -0.05, type_bien: 'necessaire', variation_prix: 50 },
  },
];

/**
 * Iso-elastic demand: Q(P) = Q0 * (P / P0)^e
 * where Q0 = 1000 (normalised base quantity), P0 = prix_initial, e = élasticité
 * Total revenue: RT(P) = P * Q(P)
 */
function demandAtPrice(price: number, prixInitial: number, elasticite: number, q0: number): number {
  if (price <= 0) return q0 * 10; // asymptotic behaviour
  return q0 * Math.pow(price / prixInitial, elasticite);
}

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

function compute(values: Record<string, number | boolean | string>): ComputeResult {
  const prixInitial = clamp(Number(values.prix_initial) || 50, 10, 200);
  const elasticite = clamp(Number(values.elasticite) || -1, -5, -0.1);
  const variationPrix = clamp(Number(values.variation_prix) || 20, -50, 100);
  const q0 = 1000;

  const prixNouveau = prixInitial * (1 + variationPrix / 100);
  const quantiteInitiale = q0;
  const quantiteNouvelle = demandAtPrice(prixNouveau, prixInitial, elasticite, q0);
  const variationQuantite = ((quantiteNouvelle - quantiteInitiale) / quantiteInitiale) * 100;

  const recetteInitiale = prixInitial * quantiteInitiale;
  const recetteNouvelle = prixNouveau * quantiteNouvelle;
  const variationRecette = recetteNouvelle - recetteInitiale;

  // Price range: 10% to 300% of initial price
  const pMin = prixInitial * 0.1;
  const pMax = prixInitial * 3;
  const nbPoints = 120;

  const demandCurve: Point[] = [];
  const revenueCurve: Point[] = [];

  for (let i = 0; i <= nbPoints; i++) {
    const price = pMin + (pMax - pMin) * (i / nbPoints);
    const quantity = demandAtPrice(price, prixInitial, elasticite, q0);
    const revenue = price * quantity;

    demandCurve.push({ x: price, y: quantity });
    revenueCurve.push({ x: price, y: revenue });
  }

  // Find revenue-maximizing price
  // dRT/dP = Q + P * dQ/dP = Q(1 + e) = 0 when e = -1
  // For iso-elastic: RT = P * Q0 * (P/P0)^e = Q0 * P0^(-e) * P^(1+e)
  // dRT/dP = Q0 * P0^(-e) * (1+e) * P^e = 0 only if e = -1
  // If e > -1 (inelastic), RT always increases with P
  // If e < -1 (elastic), RT always decreases with P
  // If e = -1, RT is constant

  const demandAnnotations: Annotation[] = [
    {
      type: 'point',
      x: prixInitial,
      y: q0,
      label: `Initial (${prixInitial}\u20ac, ${q0})`,
      color: '#3b82f6',
    },
  ];

  if (variationPrix !== 0) {
    demandAnnotations.push({
      type: 'point',
      x: prixNouveau,
      y: quantiteNouvelle,
      label: `Nouveau (${prixNouveau.toFixed(0)}\u20ac, ${quantiteNouvelle.toFixed(0)})`,
      color: '#ef4444',
    });
  }

  const revenueAnnotations: Annotation[] = [
    {
      type: 'point',
      x: prixInitial,
      y: recetteInitiale,
      label: `Recette initiale : ${recetteInitiale.toFixed(0)} \u20ac`,
      color: '#3b82f6',
    },
  ];

  if (variationPrix !== 0) {
    revenueAnnotations.push({
      type: 'point',
      x: prixNouveau,
      y: recetteNouvelle,
      label: `Recette apres variation : ${recetteNouvelle.toFixed(0)} \u20ac`,
      color: '#ef4444',
    });
  }

  // Primary chart: demand curve only
  const chartData: ChartData = {
    type: 'line',
    series: [
      {
        id: 'demande',
        label: 'Courbe de demande',
        color: '#3b82f6',
        data: demandCurve,
        strokeWidth: 2.5,
      },
    ],
    xLabel: 'Prix (\u20ac)',
    yLabel: 'Quantité demandée',
    xDomain: [pMin, pMax],
    annotations: demandAnnotations,
    equilibrium: { x: prixNouveau, y: quantiteNouvelle },
  };

  // Secondary chart: revenue curve
  const secondaryChartData: ChartData = {
    type: 'line',
    series: [
      {
        id: 'recette_totale',
        label: 'Recette totale',
        color: '#10b981',
        data: revenueCurve,
        strokeWidth: 2.5,
      },
    ],
    xLabel: 'Prix (\u20ac)',
    yLabel: 'Recette totale (\u20ac)',
    xDomain: [pMin, pMax],
    annotations: revenueAnnotations,
  };

  // Narration
  const typeBien = String(values.type_bien || 'normal');
  const typeBienLabel = typeBien === 'necessaire' ? 'bien nécessaire' : typeBien === 'luxe' ? 'bien de luxe' : 'bien normal';
  let observation: string;
  let interpretation: string;

  if (variationPrix === 0) {
    observation = `Au prix initial de ${prixInitial}\u20ac, la quantité demandée est de ${q0} unités pour ce ${typeBienLabel}, générant une recette totale de ${recetteInitiale.toFixed(0)}\u20ac.`;
    interpretation = `Avec une élasticité de ${elasticite.toFixed(1)}, la demande est ${classifyElasticity(elasticite)}. ${elasticityImplication(elasticite)}`;
    if (typeBien === 'necessaire') {
      interpretation += ` Pour un bien nécessaire (alimentation de base, énergie, médicaments), les consommateurs n'ont pas de substitut : ils continuent d'acheter même si le prix augmente, d'où une faible elasticite.`;
    } else if (typeBien === 'luxe') {
      interpretation += ` Pour un bien de luxe (restaurants gastronomiques, voyages, biens de marque), les consommateurs peuvent facilement s'en passer ou se tourner vers des substituts, d'où une forte elasticite.`;
    }
  } else {
    const directionPrix = variationPrix > 0 ? 'hausse' : 'baisse';
    const directionQuantite = variationQuantite > 0 ? 'hausse' : 'baisse';
    observation = `Une ${directionPrix} du prix de ${Math.abs(variationPrix)}% (de ${prixInitial}\u20ac à ${prixNouveau.toFixed(0)}\u20ac) entraîne une ${directionQuantite} de la quantité de ${Math.abs(variationQuantite).toFixed(1)}% (de ${q0} à ${quantiteNouvelle.toFixed(0)} unités) pour ce ${typeBienLabel}.`;
    interpretation = `La recette totale passe de ${recetteInitiale.toFixed(0)}\u20ac à ${recetteNouvelle.toFixed(0)}\u20ac (${variationRecette >= 0 ? '+' : ''}${variationRecette.toFixed(0)}\u20ac). ${elasticityImplication(elasticite)}`;

    // Mid-range commentary
    if (Math.abs(elasticite) > 0.8 && Math.abs(elasticite) < 1.2) {
      interpretation += ` Près de l'élasticité unitaire, la recette totale est quasi insensible aux variations de prix : l'effet-prix et l'effet-volume se compensent presque parfaitement.`;
    }

    if (variationPrix < 0 && variationRecette > 0 && Math.abs(elasticite) > 1) {
      interpretation += ` La baisse du prix fait augmenter la recette : c'est la stratégie de volume, efficace quand la demande est élastique.`;
    } else if (variationPrix > 0 && variationRecette > 0 && Math.abs(elasticite) < 1) {
      interpretation += ` La hausse du prix fait augmenter la recette malgré la perte de volume : c'est la stratégie de marge, efficace quand la demande est inélastique (typique des ${typeBien === 'necessaire' ? 'biens de première nécessité' : 'marchés captifs'}).`;
    }

    if (variationPrix > 50) {
      interpretation += ` Attention : une variation de prix aussi importante (${variationPrix}%) rend l'hypothèse d'élasticité constante moins réaliste. En pratique, l'élasticité change le long de la courbe de demande.`;
    }
  }

  return {
    outputs: [
      { id: 'quantite_nouvelle', label: 'Quantité après variation', value: round2(quantiteNouvelle), direction: quantiteNouvelle > q0 ? 'up' : quantiteNouvelle < q0 ? 'down' : 'neutral' },
      { id: 'variation_quantite', label: 'Variation de la quantité', value: round2(variationQuantite), unit: '%', direction: variationQuantite > 0 ? 'up' : variationQuantite < 0 ? 'down' : 'neutral' },
      { id: 'recette_initiale', label: 'Recette totale initiale', value: round2(recetteInitiale), unit: '\u20ac' },
      { id: 'recette_nouvelle', label: 'Recette totale nouvelle', value: round2(recetteNouvelle), unit: '\u20ac', direction: recetteNouvelle > recetteInitiale ? 'up' : recetteNouvelle < recetteInitiale ? 'down' : 'neutral' },
      { id: 'elasticite_valeur', label: 'Élasticité-prix', value: round2(elasticite) },
      { id: 'type_demande', label: 'Type de demande', value: Math.abs(elasticite) },
    ],
    chartData,
    secondaryChartData,
    narration: { observation, interpretation },
  };
}

function classifyElasticity(e: number): string {
  const abs = Math.abs(e);
  if (abs < 0.5) return 'très inélastique';
  if (abs < 1) return 'inélastique';
  if (Math.abs(abs - 1) < 0.05) return 'unitaire';
  if (abs < 2) return 'élastique';
  return 'très élastique';
}

function elasticityImplication(e: number): string {
  const abs = Math.abs(e);
  if (abs < 1) {
    return "Avec une demande inélastique, une hausse des prix augmente la recette totale : l'effet-prix domine l'effet-volume. Le producteur a intérêt à augmenter ses prix.";
  }
  if (Math.abs(abs - 1) < 0.05) {
    return "Avec une élasticité unitaire, la recette totale est insensible aux variations de prix : l'effet-prix compense exactement l'effet-volume.";
  }
  return "Avec une demande élastique, une hausse des prix réduit la recette totale : l'effet-volume domine l'effet-prix. Le producteur a intérêt à baisser ses prix pour augmenter ses ventes.";
}

function round2(v: number): number {
  return Math.round(v * 100) / 100;
}

const elasticityModule: SimulationModule = { meta, inputs, scenarios, compute };

registerModule(elasticityModule);

export { elasticityModule };
export default elasticityModule;
