export interface ADASScenario {
  id: string;
  title: string;
  description: string;
  /** Niveau de prix initial */
  initialPriceLevel: number;
  /** PIB réel initial */
  initialOutput: number;
  /** PIB potentiel (offre agrégée de long terme) */
  potentialOutput: number;
  /** Deplacement de la demande agrégée (positif = droite, négatif = gauche) */
  adShift: number;
  /** Deplacement de l'offre agrégée de court terme (positif = droite, négatif = gauche) */
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
      'Une relance budgétaire ou monétaire déplace la demande agrégée vers la droite.',
    initialPriceLevel: 100,
    initialOutput: 1000,
    potentialOutput: 1000,
    adShift: 150,
    asShift: 0,
    asSlope: 0.15,
    explanation:
      'Un choc de demande positif (hausse des dépenses publiques, baisse des impôts, politique monétaire expansionniste) déplace la courbe AD vers la droite. A court terme, le PIB réel et le niveau des prix augmentent. L\'économie passe au-dessus de son potentiel, créant des tensions inflationnistes. A long terme, les salaires s\'ajustent et l\'offre agrégée se déplace vers la gauche, ramenant le PIB à son niveau potentiel à un prix plus élevé.',
  },
  {
    id: 'choc-offre-négatif',
    title: 'Choc d\'offre négatif (choc pétrolier)',
    description:
      'Une hausse brutale des coûts de production déplace l\'offre agrégée vers la gauche.',
    initialPriceLevel: 100,
    initialOutput: 1000,
    potentialOutput: 1000,
    adShift: 0,
    asShift: -150,
    asSlope: 0.15,
    explanation:
      'Un choc d\'offre négatif (hausse du prix du pétrole, catastrophe naturelle, pandemie) déplace la courbe AS de court terme vers la gauche. Le PIB réel diminue tandis que le niveau des prix augmente : c\'est la stagflation. Le dilemme pour les decideurs est aigu : stimuler la demande aggrave l\'inflation, la restreindre aggrave la récession.',
  },
  {
    id: 'écart-recessionniste',
    title: 'Écart recessionniste',
    description:
      'L\'économie produit en dessous de son potentiel, avec du chômage involontaire.',
    initialPriceLevel: 100,
    initialOutput: 850,
    potentialOutput: 1000,
    adShift: 0,
    asShift: 0,
    asSlope: 0.15,
    explanation:
      'Quand le PIB réel est inférieur au PIB potentiel, l\'économie est en écart recessionniste. Le chômage est supérieur à son taux naturel. Les keynesiens preconisent une intervention de l\'État pour deplacer la courbe AD vers la droite. Les classiques estiment que les salaires flexibles rameneront l\'équilibre à long terme.',
  },
  {
    id: 'surchauffe',
    title: 'Surchauffe économique',
    description:
      'L\'économie produit au-dessus de son potentiel, generant des tensions inflationnistes.',
    initialPriceLevel: 100,
    initialOutput: 1150,
    potentialOutput: 1000,
    adShift: 0,
    asShift: 0,
    asSlope: 0.15,
    explanation:
      'En surchauffe, le PIB réel dépasse le PIB potentiel. Le chômage est inférieur à son taux naturel et les entreprises peinent a recruter. Les salaires et les prix augmentent. La banque centrale doit intervenir en relevant les taux d\'intérêt pour ramener la demande agrégée à un niveau soutenable et eviter une spirale inflationniste.',
  },
];

export function getADASScenario(id: string): ADASScenario | undefined {
  return adasScenarios.find((s) => s.id === id);
}
