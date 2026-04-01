export interface MoneyCreationScenario {
  id: string;
  title: string;
  description: string;
  /** Dépôt initial (en euros) */
  initialDeposit: number;
  /** Taux de réserves obligatoires (0 < r < 1) */
  reserveRatio: number;
  /** Taux de préférence pour les billets (part du crédit retiree en especes, 0 < b < 1) */
  cashPreference: number;
  /** Nombre de vagues de crédit a afficher */
  rounds: number;
  explanation: string;
}

export const moneyCreationScenarios: MoneyCreationScenario[] = [
  {
    id: 'modèle-simple',
    title: 'Modèle simple du multiplicateur de crédit',
    description:
      'Le cas classique avec un taux de réserves de 10 % et sans fuite en billets.',
    initialDeposit: 1000,
    reserveRatio: 0.1,
    cashPreference: 0,
    rounds: 12,
    explanation:
      'Avec un taux de réserves obligatoires de 10 % et sans préférence pour les billets, le multiplicateur de crédit vaut 1 / 0,10 = 10. Un dépôt initial de 1 000 euros permet au système bancaire de creer jusqu\'a 10 000 euros de monnaie scripturale au total. A chaque etape, la banque conserve 10 % en réserves et prête le reste.',
  },
  {
    id: 'réserves-élevées',
    title: 'Reserves obligatoires élevées',
    description:
      'La banque centrale impose un taux de réserves de 20 % pour freiner le crédit.',
    initialDeposit: 1000,
    reserveRatio: 0.2,
    cashPreference: 0,
    rounds: 10,
    explanation:
      'En doublant le taux de réserves obligatoires a 20 %, le multiplicateur tombe a 5. La création monétaire est reduite de moitie. C\'est un outil de politique monétaire restrictive utilise historiquement par certaines banques centrales pour lutter contre l\'inflation.',
  },
  {
    id: 'fuite-billets',
    title: 'Fuite en billets',
    description:
      'Les agents retirent une partie de leurs prêts en especes, ce qui réduit la création monétaire.',
    initialDeposit: 1000,
    reserveRatio: 0.1,
    cashPreference: 0.15,
    rounds: 10,
    explanation:
      'Quand les agents économiques conservent 15 % de la monnaie créée sous forme de billets, ces billets "sortent" du circuit bancaire et ne peuvent pas être repretes. Le multiplicateur effectif tombe a 1 / (r + b) = 1 / (0,10 + 0,15) = 4. La préférence pour les billets est une fuite qui réduit significativement la création monétaire.',
  },
  {
    id: 'zone-euro-actuelle',
    title: 'Zone euro (paramètres actuels)',
    description:
      'Le système de la zone euro avec un taux de réserves de 1 % (depuis 2012).',
    initialDeposit: 1000,
    reserveRatio: 0.01,
    cashPreference: 0.1,
    rounds: 15,
    explanation:
      'En zone euro, le taux de réserves obligatoires est de seulement 1 % depuis 2012. Le multiplicateur théorique serait de 100, mais les fuites en billets (environ 10 %) et les réserves excedentaires volontaires des banques limitent fortement la création monétaire réelle. Le multiplicateur effectif est bien inférieur au maximum théorique.',
  },
];

export function getMoneyCreationScenario(id: string): MoneyCreationScenario | undefined {
  return moneyCreationScenarios.find((s) => s.id === id);
}
