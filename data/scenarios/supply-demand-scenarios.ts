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
    id: 'equilibre-initial',
    title: 'Equilibre initial',
    description: 'Un marche en equilibre sans intervention exterieure.',
    demandIntercept: 100,
    demandSlope: -2,
    supplyIntercept: 10,
    supplySlope: 1.5,
    taxAmount: 0,
    priceFloor: null,
    priceCeiling: null,
    explanation:
      'Le prix d\'equilibre se situe a l\'intersection des courbes d\'offre et de demande. A ce prix, la quantite offerte egale la quantite demandee : le marche est en equilibre.',
  },
  {
    id: 'hausse-revenu',
    title: 'Hausse du revenu des menages',
    description: 'Une augmentation du pouvoir d\'achat deplace la demande vers la droite.',
    demandIntercept: 130,
    demandSlope: -2,
    supplyIntercept: 10,
    supplySlope: 1.5,
    taxAmount: 0,
    priceFloor: null,
    priceCeiling: null,
    explanation:
      'Lorsque le revenu des menages augmente, la demande pour les biens normaux se deplace vers la droite. Le nouveau prix d\'equilibre est plus eleve, et la quantite echangee augmente egalement.',
  },
  {
    id: 'hausse-couts',
    title: 'Hausse des couts de production',
    description: 'Une augmentation des matieres premieres deplace l\'offre vers la gauche.',
    demandIntercept: 100,
    demandSlope: -2,
    supplyIntercept: 30,
    supplySlope: 1.5,
    taxAmount: 0,
    priceFloor: null,
    priceCeiling: null,
    explanation:
      'La hausse des couts de production (matieres premieres, salaires, energie) deplace la courbe d\'offre vers la gauche. Le prix d\'equilibre augmente tandis que la quantite echangee diminue.',
  },
  {
    id: 'introduction-taxe',
    title: 'Introduction d\'une taxe',
    description: 'L\'Etat impose une taxe unitaire de 8 euros sur chaque unite vendue.',
    demandIntercept: 100,
    demandSlope: -2,
    supplyIntercept: 10,
    supplySlope: 1.5,
    taxAmount: 8,
    priceFloor: null,
    priceCeiling: null,
    explanation:
      'La taxe cree un ecart entre le prix paye par l\'acheteur et le prix recu par le vendeur. La quantite echangee diminue et une perte seche apparait : c\'est le cout social de la taxe.',
  },
  {
    id: 'prix-plafond',
    title: 'Prix plafond (loyer encadre)',
    description: 'L\'Etat fixe un prix maximum en dessous du prix d\'equilibre.',
    demandIntercept: 100,
    demandSlope: -2,
    supplyIntercept: 10,
    supplySlope: 1.5,
    taxAmount: 0,
    priceFloor: null,
    priceCeiling: 20,
    explanation:
      'Un prix plafond fixe en dessous du prix d\'equilibre cree une penurie : la quantite demandee depasse la quantite offerte. Des files d\'attente ou des marches noirs peuvent apparaitre, comme dans le cas de l\'encadrement des loyers.',
  },
  {
    id: 'prix-plancher',
    title: 'Prix plancher (salaire minimum)',
    description: 'L\'Etat fixe un prix minimum au-dessus du prix d\'equilibre.',
    demandIntercept: 100,
    demandSlope: -2,
    supplyIntercept: 10,
    supplySlope: 1.5,
    taxAmount: 0,
    priceFloor: 35,
    priceCeiling: null,
    explanation:
      'Un prix plancher fixe au-dessus du prix d\'equilibre cree un surplus : la quantite offerte depasse la quantite demandee. Sur le marche du travail, cela correspond au salaire minimum, qui peut generer du chomage si fixe trop haut, mais protege les travailleurs les plus vulnerables.',
  },
];

export function getSupplyDemandScenario(id: string): SupplyDemandScenario | undefined {
  return supplyDemandScenarios.find((s) => s.id === id);
}
