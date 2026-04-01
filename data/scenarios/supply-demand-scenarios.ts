export interface SupplyDemandScenario {
  id: string;
  title: string;
  description: string;
  demandIntercept: number;
  demandSlope: number;
  supplyIntercept: number;
  supplySlope: number;
  taxAmount: number;
  priceFloor: number | null;
  priceCeiling: number | null;
  explanation: string;
}

export const supplyDemandScenarios: SupplyDemandScenario[] = [
  {
    id: 'équilibre-initial',
    title: 'Équilibre initial',
    description: 'Un marché en équilibre sans intervention exterieure.',
    demandIntercept: 100,
    demandSlope: -2,
    supplyIntercept: 10,
    supplySlope: 1.5,
    taxAmount: 0,
    priceFloor: null,
    priceCeiling: null,
    explanation:
      'Le prix d\'équilibre se situe a l\'intersection des courbes d\'offre et de demande. A ce prix, la quantité offerte égale la quantité demandée : le marché est en équilibre.',
  },
  {
    id: 'hausse-revenu',
    title: 'Hausse du revenu des ménages',
    description: 'Une augmentation du pouvoir d\'achat déplace la demande vers la droite.',
    demandIntercept: 130,
    demandSlope: -2,
    supplyIntercept: 10,
    supplySlope: 1.5,
    taxAmount: 0,
    priceFloor: null,
    priceCeiling: null,
    explanation:
      'Lorsque le revenu des ménages augmente, la demande pour les biens normaux se déplace vers la droite. Le nouveau prix d\'équilibre est plus élevé, et la quantité échangée augmente également.',
  },
  {
    id: 'hausse-coûts',
    title: 'Hausse des coûts de production',
    description: 'Une augmentation des matières premières déplace l\'offre vers la gauche.',
    demandIntercept: 100,
    demandSlope: -2,
    supplyIntercept: 30,
    supplySlope: 1.5,
    taxAmount: 0,
    priceFloor: null,
    priceCeiling: null,
    explanation:
      'La hausse des coûts de production (matières premières, salaires, énergie) déplace la courbe d\'offre vers la gauche. Le prix d\'équilibre augmente tandis que la quantité échangée diminue.',
  },
  {
    id: 'introduction-taxe',
    title: 'Introduction d\'une taxe',
    description: 'L\'État impose une taxe unitaire de 8 euros sur chaque unite vendue.',
    demandIntercept: 100,
    demandSlope: -2,
    supplyIntercept: 10,
    supplySlope: 1.5,
    taxAmount: 8,
    priceFloor: null,
    priceCeiling: null,
    explanation:
      'La taxe crée un écart entre le prix paye par l\'acheteur et le prix recu par le vendeur. La quantité échangée diminue et une perte sèche apparait : c\'est le coût social de la taxe.',
  },
  {
    id: 'prix-plafond',
    title: 'Prix plafond (loyer encadre)',
    description: 'L\'État fixe un prix maximum en dessous du prix d\'équilibre.',
    demandIntercept: 100,
    demandSlope: -2,
    supplyIntercept: 10,
    supplySlope: 1.5,
    taxAmount: 0,
    priceFloor: null,
    priceCeiling: 20,
    explanation:
      'Un prix plafond fixé en dessous du prix d\'équilibre crée une pénurie : la quantité demandée dépasse la quantité offerte. Des files d\'attente ou des marchés noirs peuvent apparaître, comme dans le cas de l\'encadrement des loyers.',
  },
  {
    id: 'prix-plancher',
    title: 'Prix plancher (salaire minimum)',
    description: 'L\'État fixe un prix minimum au-dessus du prix d\'équilibre.',
    demandIntercept: 100,
    demandSlope: -2,
    supplyIntercept: 10,
    supplySlope: 1.5,
    taxAmount: 0,
    priceFloor: 35,
    priceCeiling: null,
    explanation:
      'Un prix plancher fixé au-dessus du prix d\'équilibre crée un surplus : la quantité offerte dépasse la quantité demandée. Sur le marché du travail, cela correspond au salaire minimum, qui peut générer du chômage si fixé trop haut, mais protège les travailleurs les plus vulnérables.',
  },
];

export function getSupplyDemandScenario(id: string): SupplyDemandScenario | undefined {
  return supplyDemandScenarios.find((s) => s.id === id);
}
