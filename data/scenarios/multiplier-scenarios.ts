export interface MultiplierScenario {
  id: string;
  title: string;
  description: string;
  /** Depense initiale (en milliards d'euros) */
  initialSpending: number;
  /** Propension marginale a consommer (0 < c < 1) */
  mpc: number;
  /** Taux d'imposition (0 < t < 1) */
  taxRate: number;
  /** Propension marginale a importer (0 < m < 1) */
  importRate: number;
  /** Nombre de vagues a afficher */
  rounds: number;
  explanation: string;
}

export const multiplierScenarios: MultiplierScenario[] = [
  {
    id: 'relance-classique',
    title: 'Relance budgetaire classique',
    description:
      'L\'Etat injecte 10 milliards d\'euros dans l\'economie avec une propension a consommer typique.',
    initialSpending: 10,
    mpc: 0.75,
    taxRate: 0.2,
    importRate: 0.1,
    rounds: 10,
    explanation:
      'Avec une propension marginale a consommer de 0,75, un taux d\'imposition de 20 % et un taux d\'importation de 10 %, le multiplicateur vaut environ 1 / (1 - 0,75 x (1 - 0,2) x (1 - 0,1)) = 1 / (1 - 0,54) = 2,17. Les 10 milliards initiaux generent environ 21,7 milliards de revenu supplementaire.',
  },
  {
    id: 'economie-fermee',
    title: 'Economie fermee (modele simplifie)',
    description:
      'Le cas theorique sans impot ni importation, pour comprendre le mecanisme pur.',
    initialSpending: 10,
    mpc: 0.8,
    taxRate: 0,
    importRate: 0,
    rounds: 15,
    explanation:
      'Dans le modele le plus simple, sans fiscalite ni commerce exterieur, le multiplicateur vaut 1 / (1 - c) = 1 / (1 - 0,8) = 5. Chaque euro depense par l\'Etat genere 5 euros de revenu total. Ce cas theorique montre la puissance maximale du multiplicateur.',
  },
  {
    id: 'economie-ouverte',
    title: 'Economie tres ouverte',
    description:
      'Un petit pays tres dependant du commerce international, avec de fortes fuites.',
    initialSpending: 10,
    mpc: 0.7,
    taxRate: 0.25,
    importRate: 0.3,
    rounds: 10,
    explanation:
      'Dans une economie tres ouverte (taux d\'importation de 30 %), une part importante de la depense "fuit" vers l\'etranger a chaque vague. Le multiplicateur chute a environ 1,58. L\'ouverture commerciale reduit l\'efficacite de la relance budgetaire nationale.',
  },
  {
    id: 'austerite',
    title: 'Politique d\'austerite',
    description:
      'L\'Etat reduit ses depenses de 10 milliards : le multiplicateur joue en sens inverse.',
    initialSpending: -10,
    mpc: 0.75,
    taxRate: 0.2,
    importRate: 0.1,
    rounds: 10,
    explanation:
      'Le multiplicateur fonctionne dans les deux sens. Une reduction de depenses publiques de 10 milliards, avec les memes parametres que la relance classique, detruit environ 21,7 milliards de revenu. C\'est l\'argument keynesien contre l\'austerite en periode de recession.',
  },
];

export function getMultiplierScenario(id: string): MultiplierScenario | undefined {
  return multiplierScenarios.find((s) => s.id === id);
}
