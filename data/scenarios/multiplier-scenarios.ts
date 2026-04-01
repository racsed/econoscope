export interface MultiplierScenario {
  id: string;
  title: string;
  description: string;
  /** Dépense initiale (en milliards d'euros) */
  initialSpending: number;
  /** Propension marginale à consommer (0 < c < 1) */
  mpc: number;
  /** Taux d'imposition (0 < t < 1) */
  taxRate: number;
  /** Propension marginale à importer (0 < m < 1) */
  importRate: number;
  /** Nombre de vagues a afficher */
  rounds: number;
  explanation: string;
}

export const multiplierScenarios: MultiplierScenario[] = [
  {
    id: 'relance-classique',
    title: 'Relance budgétaire classique',
    description:
      'L\'État injecte 10 milliards d\'euros dans l\'économie avec une propension à consommer typique.',
    initialSpending: 10,
    mpc: 0.75,
    taxRate: 0.2,
    importRate: 0.1,
    rounds: 10,
    explanation:
      'Avec une propension marginale à consommer de 0,75, un taux d\'imposition de 20 % et un taux d\'importation de 10 %, le multiplicateur vaut environ 1 / (1 - 0,75 x (1 - 0,2) x (1 - 0,1)) = 1 / (1 - 0,54) = 2,17. Les 10 milliards initiaux génèrent environ 21,7 milliards de revenu supplémentaire.',
  },
  {
    id: 'économie-fermee',
    title: 'Économie fermee (modèle simplifie)',
    description:
      'Le cas théorique sans impôt ni importation, pour comprendre le mécanisme pur.',
    initialSpending: 10,
    mpc: 0.8,
    taxRate: 0,
    importRate: 0,
    rounds: 15,
    explanation:
      'Dans le modèle le plus simple, sans fiscalité ni commerce exterieur, le multiplicateur vaut 1 / (1 - c) = 1 / (1 - 0,8) = 5. Chaque euro dépense par l\'État génère 5 euros de revenu total. Ce cas théorique montre la puissance maximale du multiplicateur.',
  },
  {
    id: 'économie-ouverte',
    title: 'Économie très ouverte',
    description:
      'Un petit pays très dependant du commerce international, avec de fortes fuites.',
    initialSpending: 10,
    mpc: 0.7,
    taxRate: 0.25,
    importRate: 0.3,
    rounds: 10,
    explanation:
      'Dans une économie très ouverte (taux d\'importation de 30 %), une part importante de la dépense "fuit" vers l\'etranger à chaque vague. Le multiplicateur chute a environ 1,58. L\'ouverture commerciale réduit l\'efficacité de la relance budgétaire nationale.',
  },
  {
    id: 'austérité',
    title: 'Politique d\'austérité',
    description:
      'L\'État réduit ses dépenses de 10 milliards : le multiplicateur joue en sens inverse.',
    initialSpending: -10,
    mpc: 0.75,
    taxRate: 0.2,
    importRate: 0.1,
    rounds: 10,
    explanation:
      'Le multiplicateur fonctionne dans les deux sens. Une réduction de dépenses publiques de 10 milliards, avec les mêmes paramètres que la relance classique, détruit environ 21,7 milliards de revenu. C\'est l\'argument keynésien contre l\'austérité en période de récession.',
  },
];

export function getMultiplierScenario(id: string): MultiplierScenario | undefined {
  return multiplierScenarios.find((s) => s.id === id);
}
