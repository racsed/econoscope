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
  slug: 'offre-et-demande',
  title: 'Offre et Demande',
  subtitle: 'Le mecanisme fondamental du marche',
  theme: 'micro',
  level: 'accessible',
  introduction:
    "Le modele de l'offre et de la demande est le cadre fondamental de la microeconomie. Il montre comment le prix d'un bien se determine par l'interaction entre les acheteurs (demande) et les vendeurs (offre) sur un marche concurrentiel.",
  limites: [
    'Suppose un marche parfaitement concurrentiel',
    'Courbes lineaires : simplification de la realite',
    'Ne tient pas compte des externalites',
    'Equilibre partiel : ignore les interactions entre marches',
  ],
  realite: [
    "La taxe sur les sodas en France (2012) a reduit la consommation d'environ 3,4%",
    "L'augmentation du SMIC deplace la courbe d'offre de travail",
    "Le marche du petrole illustre les chocs d'offre et de demande",
  ],
};

const inputs: SimulationInput[] = [
  {
    id: 'revenu',
    label: 'Revenu moyen des consommateurs',
    type: 'slider',
    min: 500,
    max: 5000,
    step: 50,
    defaultValue: 2000,
    unit: '\u20ac',
    tooltip: "Un revenu plus eleve deplace la courbe de demande vers la droite",
    group: 'Demande',
  },
  {
    id: 'nb_acheteurs',
    label: "Nombre d'acheteurs",
    type: 'slider',
    min: 10,
    max: 1000,
    step: 10,
    defaultValue: 200,
    tooltip: "Plus d'acheteurs augmente la demande globale",
    group: 'Demande',
  },
  {
    id: 'cout_production',
    label: 'Cout de production unitaire',
    type: 'slider',
    min: 1,
    max: 50,
    step: 1,
    defaultValue: 10,
    unit: '\u20ac',
    tooltip: "Un cout plus eleve deplace la courbe d'offre vers la gauche",
    group: 'Offre',
  },
  {
    id: 'taxe',
    label: 'Taxe unitaire',
    type: 'slider',
    min: 0,
    max: 30,
    step: 0.5,
    defaultValue: 0,
    unit: '\u20ac',
    tooltip: "Taxe prelevee sur chaque unite vendue",
    group: 'Fiscalite',
  },
  {
    id: 'taxe_side',
    label: 'Taxe sur le vendeur',
    type: 'toggle',
    defaultValue: true,
    tooltip: "Si active, la taxe est prelevee sur le vendeur (deplace l'offre). Sinon, sur l'acheteur (deplace la demande).",
    group: 'Fiscalite',
  },
];

const scenarios: Scenario[] = [
  {
    id: 'equilibre_base',
    label: 'Equilibre de base',
    description: 'Marche sans intervention fiscale',
    values: { revenu: 2000, nb_acheteurs: 200, cout_production: 10, taxe: 0, taxe_side: true },
  },
  {
    id: 'taxe_vendeur',
    label: 'Taxe sur le vendeur (5\u20ac)',
    description: "Introduction d'une taxe de 5\u20ac supportee par le vendeur",
    values: { revenu: 2000, nb_acheteurs: 200, cout_production: 10, taxe: 5, taxe_side: true },
  },
  {
    id: 'taxe_acheteur',
    label: "Taxe sur l'acheteur (5\u20ac)",
    description: "Introduction d'une taxe de 5\u20ac supportee par l'acheteur",
    values: { revenu: 2000, nb_acheteurs: 200, cout_production: 10, taxe: 5, taxe_side: false },
  },
  {
    id: 'hausse_revenus',
    label: 'Hausse des revenus',
    description: 'Augmentation du pouvoir d\'achat des consommateurs',
    values: { revenu: 3500, nb_acheteurs: 200, cout_production: 10, taxe: 0, taxe_side: true },
  },
  {
    id: 'choc_offre',
    label: "Choc d'offre negatif",
    description: 'Augmentation brutale des couts de production',
    values: { revenu: 2000, nb_acheteurs: 200, cout_production: 35, taxe: 0, taxe_side: true },
  },
];

/**
 * Demand: Qd = 100 - 2*P + 0.05*R * (n/100)
 * Supply: Qs = -20 + 3*P - 2*C
 * With tax on seller: Qs_taxed = -20 + 3*(P - T) - 2*C
 * With tax on buyer:  Qd_taxed = 100 - 2*(P + T) + 0.05*R * (n/100)
 */
function demandQuantity(price: number, revenu: number, nbAcheteurs: number): number {
  return 100 - 2 * price + 0.05 * revenu * (nbAcheteurs / 100);
}

function supplyQuantity(price: number, coutProduction: number): number {
  return -20 + 3 * price - 2 * coutProduction;
}

function findEquilibrium(
  revenu: number,
  nbAcheteurs: number,
  coutProduction: number,
  taxe: number,
  taxeSurVendeur: boolean
): { price: number; quantity: number } {
  // Without tax: 100 - 2P + 0.05*R*(n/100) = -20 + 3P - 2C
  // 120 + 0.05*R*(n/100) + 2C = 5P
  // P* = (120 + 0.05*R*(n/100) + 2C) / 5

  if (taxe === 0) {
    const demandIntercept = 100 + 0.05 * revenu * (nbAcheteurs / 100);
    const supplyIntercept = -20 - 2 * coutProduction;
    // Qd = demandIntercept - 2P, Qs = supplyIntercept + 3P
    // demandIntercept - 2P = supplyIntercept + 3P
    const priceEq = (demandIntercept - supplyIntercept) / 5;
    const quantityEq = demandIntercept - 2 * priceEq;
    return { price: priceEq, quantity: quantityEq };
  }

  if (taxeSurVendeur) {
    // Qs_taxed = -20 + 3*(P - T) - 2*C = -20 + 3P - 3T - 2C
    // Qd = Qs_taxed: 100 - 2P + 0.05*R*(n/100) = -20 + 3P - 3T - 2C
    const demandIntercept = 100 + 0.05 * revenu * (nbAcheteurs / 100);
    const supplyIntercept = -20 - 3 * taxe - 2 * coutProduction;
    const priceEq = (demandIntercept - supplyIntercept) / 5;
    const quantityEq = demandIntercept - 2 * priceEq;
    return { price: priceEq, quantity: quantityEq };
  } else {
    // Qd_taxed = 100 - 2*(P + T) + 0.05*R*(n/100) = 100 - 2P - 2T + 0.05*R*(n/100)
    const demandIntercept = 100 - 2 * taxe + 0.05 * revenu * (nbAcheteurs / 100);
    const supplyIntercept = -20 - 2 * coutProduction;
    const priceEq = (demandIntercept - supplyIntercept) / 5;
    const quantityEq = demandIntercept - 2 * priceEq;
    return { price: priceEq, quantity: quantityEq };
  }
}

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

function compute(values: Record<string, number | boolean | string>): ComputeResult {
  const revenu = clamp(Number(values.revenu) || 2000, 500, 5000);
  const nbAcheteurs = clamp(Number(values.nb_acheteurs) || 200, 10, 1000);
  const coutProduction = clamp(Number(values.cout_production) || 10, 1, 50);
  const taxe = clamp(Number(values.taxe) || 0, 0, 30);
  const taxeSurVendeur = typeof values.taxe_side === 'boolean' ? values.taxe_side : true;

  // Equilibrium without tax
  const eqBase = findEquilibrium(revenu, nbAcheteurs, coutProduction, 0, true);
  // Equilibrium with tax
  const eqTaxRaw = findEquilibrium(revenu, nbAcheteurs, coutProduction, taxe, taxeSurVendeur);
  const marcheNonViable = eqTaxRaw.quantity < 0;
  const eqTax = marcheNonViable
    ? { price: Math.max(0, eqTaxRaw.price), quantity: 0 }
    : eqTaxRaw;

  // Price range for curves
  const maxPrice = Math.max(eqBase.price, eqTax.price) * 1.8;
  const priceStep = maxPrice / 100;

  // Build demand curve points (P on Y axis, Q on X axis for economics convention)
  const demandCurve: Point[] = [];
  const supplyCurve: Point[] = [];
  const shiftedCurve: Point[] = [];

  for (let i = 0; i <= 100; i++) {
    const price = i * priceStep;
    const qd = demandQuantity(price, revenu, nbAcheteurs);
    const qs = supplyQuantity(price, coutProduction);

    if (qd >= 0) demandCurve.push({ x: qd, y: price });
    if (qs >= 0) supplyCurve.push({ x: qs, y: price });

    if (taxe > 0) {
      if (taxeSurVendeur) {
        const qsTaxed = supplyQuantity(price - taxe, coutProduction);
        if (qsTaxed >= 0 && price >= taxe) shiftedCurve.push({ x: qsTaxed, y: price });
      } else {
        const qdTaxed = demandQuantity(price + taxe, revenu, nbAcheteurs);
        if (qdTaxed >= 0) shiftedCurve.push({ x: qdTaxed, y: price });
      }
    }
  }

  // Sort by x for proper rendering
  demandCurve.sort((a, b) => a.x - b.x);
  supplyCurve.sort((a, b) => a.x - b.x);
  shiftedCurve.sort((a, b) => a.x - b.x);

  // Simplified surplus calculations
  const demandPriceIntercept = (100 + 0.05 * revenu * (nbAcheteurs / 100)) / 2;
  const supplyPriceIntercept = (20 + 2 * coutProduction) / 3;

  const surplusConsommateur = eqTax.quantity > 0
    ? 0.5 * (demandPriceIntercept - eqTax.price) * eqTax.quantity
    : 0;

  const prixProducteur = taxeSurVendeur ? eqTax.price - taxe : eqTax.price;
  const surplusProducteur = eqTax.quantity > 0
    ? 0.5 * (prixProducteur - supplyPriceIntercept) * eqTax.quantity
    : 0;

  const recetteFiscale = taxe * eqTax.quantity;

  // Deadweight loss (Harberger triangle)
  const pertSeche = taxe > 0 && eqBase.quantity > eqTax.quantity
    ? 0.5 * taxe * (eqBase.quantity - eqTax.quantity)
    : 0;

  // Build series
  const series: Series[] = [
    {
      id: 'demande',
      label: 'Demande (D)',
      color: '#3b82f6',
      data: demandCurve,
      strokeWidth: 2.5,
    },
    {
      id: 'offre',
      label: 'Offre (S)',
      color: '#ef4444',
      data: supplyCurve,
      strokeWidth: 2.5,
    },
  ];

  if (taxe > 0 && shiftedCurve.length > 0) {
    series.push({
      id: 'courbe_deplacee',
      label: taxeSurVendeur ? "Offre avec taxe (S')" : "Demande avec taxe (D')",
      color: taxeSurVendeur ? '#f97316' : '#8b5cf6',
      data: shiftedCurve,
      strokeWidth: 2,
      dashed: true,
    });
  }

  const annotations: Annotation[] = [
    {
      type: 'point',
      x: eqBase.quantity,
      y: eqBase.price,
      label: `E* (Q=${eqBase.quantity.toFixed(0)}, P=${eqBase.price.toFixed(1)})`,
      color: '#10b981',
    },
  ];

  if (taxe > 0) {
    annotations.push({
      type: 'point',
      x: eqTax.quantity,
      y: eqTax.price,
      label: `E' (Q=${eqTax.quantity.toFixed(0)}, P=${eqTax.price.toFixed(1)})`,
      color: '#f59e0b',
    });

    if (pertSeche > 0) {
      annotations.push({
        type: 'area',
        label: `Perte seche: ${pertSeche.toFixed(1)}\u20ac`,
        color: '#dc2626',
      });
    }
  }

  const chartData: ChartData = {
    type: 'line',
    series,
    xLabel: 'Quantite',
    yLabel: 'Prix (\u20ac)',
    xDomain: [0, Math.max(...demandCurve.map((p) => p.x)) * 1.1],
    yDomain: [0, maxPrice],
    equilibrium: { x: eqTax.quantity, y: eqTax.price },
    annotations,
  };

  // Narration
  let observation: string;
  let interpretation: string;

  if (marcheNonViable) {
    observation = `Avec ces parametres, le marche n'est pas viable : les couts sont trop eleves par rapport a la disposition a payer des consommateurs.`;
    interpretation = `La quantite d'equilibre calculee est negative, ce qui signifie qu'aucun echange mutuellement avantageux n'est possible. Le prix minimum acceptable par les producteurs depasse le prix maximum que les acheteurs sont prets a payer. Il faudrait reduire les couts de production (slider "Cout de production"), baisser la taxe, ou augmenter le revenu des consommateurs pour qu'offre et demande puissent se croiser.`;
  } else if (taxe === 0) {
    observation = `Au prix d'equilibre de ${eqBase.price.toFixed(1)}\u20ac, la quantite echangee est de ${eqBase.quantity.toFixed(0)} unites. Ce prix resulte de la confrontation entre l'offre et la demande : c'est le seul prix auquel la quantite que les acheteurs souhaitent acheter egal celle que les vendeurs souhaitent vendre.`;
    interpretation = `Le surplus du consommateur (${Math.max(0, surplusConsommateur).toFixed(0)}\u20ac) mesure le gain des acheteurs qui auraient paye plus cher. Le surplus du producteur (${Math.max(0, surplusProducteur).toFixed(0)}\u20ac) mesure le gain des vendeurs qui auraient accepte moins. Le surplus total (${(Math.max(0, surplusConsommateur) + Math.max(0, surplusProducteur)).toFixed(0)}\u20ac) est maximal a l'equilibre : tout autre prix reduirait le bien-etre collectif.`;
  } else {
    observation = `Au prix d'equilibre de ${eqBase.price.toFixed(1)}\u20ac, la quantite echangee est de ${eqBase.quantity.toFixed(0)} unites.`;
    interpretation = `Le surplus du consommateur est de ${Math.max(0, surplusConsommateur).toFixed(0)}\u20ac et le surplus du producteur de ${Math.max(0, surplusProducteur).toFixed(0)}\u20ac.`;
  }

  if (!marcheNonViable && taxe > 0) {
    const prixAcheteur = taxeSurVendeur ? eqTax.price : eqTax.price + taxe;
    const prixVendeur = taxeSurVendeur ? eqTax.price - taxe : eqTax.price;
    const incidenceAcheteur = ((prixAcheteur - eqBase.price) / taxe * 100).toFixed(0);
    const incidenceVendeur = ((eqBase.price - prixVendeur) / taxe * 100).toFixed(0);
    observation = `La taxe de ${taxe}\u20ac ${taxeSurVendeur ? 'sur le vendeur deplace la courbe d\'offre vers le haut' : 'sur l\'acheteur deplace la courbe de demande vers le bas'} : le prix passe de ${eqBase.price.toFixed(1)}\u20ac a ${eqTax.price.toFixed(1)}\u20ac et la quantite chute de ${eqBase.quantity.toFixed(0)} a ${eqTax.quantity.toFixed(0)} unites. La taxe cree un ecart (coin fiscal) entre ce que paie l'acheteur et ce que recoit le vendeur.`;
    interpretation = `L'acheteur paie effectivement ${prixAcheteur.toFixed(1)}\u20ac, le vendeur ne recoit que ${prixVendeur.toFixed(1)}\u20ac. L'incidence fiscale se repartit : environ ${incidenceAcheteur}% de la taxe est supportee par l'acheteur et ${incidenceVendeur}% par le vendeur. Cette repartition depend des elasticites relatives : le cote le plus inelastique (le moins sensible au prix) supporte la plus grande part. La recette fiscale est de ${recetteFiscale.toFixed(0)}\u20ac, mais la perte seche (triangle de Harberger) de ${pertSeche.toFixed(1)}\u20ac represente des echanges mutuellement avantageux qui n'ont plus lieu a cause de la taxe.`;
  }

  if (!marcheNonViable && taxe === 0 && coutProduction > 25) {
    observation += ` Le cout de production eleve (${coutProduction}\u20ac) deplace la courbe d'offre vers la gauche : les producteurs exigent un prix plus eleve pour chaque unite, ce qui reduit la quantite echangee et augmente le prix d'equilibre.`;
  }

  if (!marcheNonViable && revenu > 3000) {
    observation += ` Le revenu eleve (${revenu}\u20ac) deplace la courbe de demande vers la droite par l'effet-revenu : les consommateurs plus riches souhaitent acheter davantage a chaque niveau de prix, ce qui tire le prix d'equilibre vers le haut.`;
  } else if (!marcheNonViable && revenu < 1000) {
    observation += ` Le faible revenu (${revenu}\u20ac) limite la demande : la courbe de demande est deplacee vers la gauche, ce qui reduit a la fois le prix et la quantite d'equilibre.`;
  }

  if (!marcheNonViable && nbAcheteurs > 500) {
    observation += ` Le grand nombre d'acheteurs (${nbAcheteurs}) amplifie la demande globale, poussant le prix d'equilibre a la hausse.`;
  }

  return {
    outputs: [
      { id: 'prix_equilibre', label: "Prix d'equilibre", value: round2(eqTax.price), unit: '\u20ac', direction: taxe > 0 ? (eqTax.price > eqBase.price ? 'up' : 'down') : 'neutral' },
      { id: 'quantite_equilibre', label: "Quantite d'equilibre", value: round2(eqTax.quantity), direction: taxe > 0 ? (eqTax.quantity < eqBase.quantity ? 'down' : 'up') : 'neutral' },
      { id: 'surplus_consommateur', label: 'Surplus du consommateur', value: round2(Math.max(0, surplusConsommateur)), unit: '\u20ac' },
      { id: 'surplus_producteur', label: 'Surplus du producteur', value: round2(Math.max(0, surplusProducteur)), unit: '\u20ac' },
      { id: 'recette_fiscale', label: 'Recette fiscale', value: round2(recetteFiscale), unit: '\u20ac' },
      { id: 'perte_seche', label: 'Perte seche', value: round2(pertSeche), unit: '\u20ac' },
    ],
    chartData,
    narration: { observation, interpretation },
  };
}

function round2(v: number): number {
  return Math.round(v * 100) / 100;
}

const supplyDemandModule: SimulationModule = { meta, inputs, scenarios, compute };

registerModule(supplyDemandModule);

export { supplyDemandModule };
export default supplyDemandModule;
