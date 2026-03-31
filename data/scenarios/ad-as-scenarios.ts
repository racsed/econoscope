export interface ADASScenario {
  id: string;
  title: string;
  description: string;
  /** Niveau de prix initial */
  initialPriceLevel: number;
  /** PIB reel initial */
  initialOutput: number;
  /** PIB potentiel (offre agregee de long terme) */
  potentialOutput: number;
  /** Deplacement de la demande agregee (positif = droite, negatif = gauche) */
  adShift: number;
  /** Deplacement de l'offre agregee de court terme (positif = droite, negatif = gauche) */
  asShift: number;
  /** Pente de la courbe AS de court terme */
  asSlope: number;
  explanation: string;
}

export const adasScenarios: ADASScenario[] = [
  {
    id: 'choc-demande-positif',
    title: 'Choc de demande positif',
    description:
      'Une relance budgetaire ou monetaire deplace la demande agregee vers la droite.',
    initialPriceLevel: 100,
    initialOutput: 1000,
    potentialOutput: 1000,
    adShift: 150,
    asShift: 0,
    asSlope: 0.15,
    explanation:
      'Un choc de demande positif (hausse des depenses publiques, baisse des impots, politique monetaire expansionniste) deplace la courbe AD vers la droite. A court terme, le PIB reel et le niveau des prix augmentent. L\'economie passe au-dessus de son potentiel, creant des tensions inflationnistes. A long terme, les salaires s\'ajustent et l\'offre agregee se deplace vers la gauche, ramenant le PIB a son niveau potentiel a un prix plus eleve.',
  },
  {
    id: 'choc-offre-negatif',
    title: 'Choc d\'offre negatif (choc petrolier)',
    description:
      'Une hausse brutale des couts de production deplace l\'offre agregee vers la gauche.',
    initialPriceLevel: 100,
    initialOutput: 1000,
    potentialOutput: 1000,
    adShift: 0,
    asShift: -150,
    asSlope: 0.15,
    explanation:
      'Un choc d\'offre negatif (hausse du prix du petrole, catastrophe naturelle, pandemie) deplace la courbe AS de court terme vers la gauche. Le PIB reel diminue tandis que le niveau des prix augmente : c\'est la stagflation. Le dilemme pour les decideurs est aigu : stimuler la demande aggrave l\'inflation, la restreindre aggrave la recession.',
  },
  {
    id: 'ecart-recessionniste',
    title: 'Ecart recessionniste',
    description:
      'L\'economie produit en dessous de son potentiel, avec du chomage involontaire.',
    initialPriceLevel: 100,
    initialOutput: 850,
    potentialOutput: 1000,
    adShift: 0,
    asShift: 0,
    asSlope: 0.15,
    explanation:
      'Quand le PIB reel est inferieur au PIB potentiel, l\'economie est en ecart recessionniste. Le chomage est superieur a son taux naturel. Les keynesiens preconisent une intervention de l\'Etat pour deplacer la courbe AD vers la droite. Les classiques estiment que les salaires flexibles rameneront l\'equilibre a long terme.',
  },
  {
    id: 'surchauffe',
    title: 'Surchauffe economique',
    description:
      'L\'economie produit au-dessus de son potentiel, generant des tensions inflationnistes.',
    initialPriceLevel: 100,
    initialOutput: 1150,
    potentialOutput: 1000,
    adShift: 0,
    asShift: 0,
    asSlope: 0.15,
    explanation:
      'En surchauffe, le PIB reel depasse le PIB potentiel. Le chomage est inferieur a son taux naturel et les entreprises peinent a recruter. Les salaires et les prix augmentent. La banque centrale doit intervenir en relevant les taux d\'interet pour ramener la demande agregee a un niveau soutenable et eviter une spirale inflationniste.',
  },
];

export function getADASScenario(id: string): ADASScenario | undefined {
  return adasScenarios.find((s) => s.id === id);
}
