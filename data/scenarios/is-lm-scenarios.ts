export interface ISLMScenario {
  id: string;
  title: string;
  description: string;
  /** Depenses autonomes (consommation, investissement, depenses publiques) */
  autonomousSpending: number;
  /** Propension marginale a consommer */
  mpc: number;
  /** Sensibilite de l'investissement au taux d'interet */
  investmentSensitivity: number;
  /** Offre de monnaie reelle (M/P) */
  moneySupply: number;
  /** Sensibilite de la demande de monnaie au revenu */
  moneyDemandIncomeSensitivity: number;
  /** Sensibilite de la demande de monnaie au taux d'interet */
  moneyDemandInterestSensitivity: number;
  /** Taux d'imposition */
  taxRate: number;
  explanation: string;
}

export const islmScenarios: ISLMScenario[] = [
  {
    id: 'politique-budgetaire',
    title: 'Politique budgetaire expansionniste',
    description:
      'L\'Etat augmente ses depenses publiques pour relancer l\'activite economique.',
    autonomousSpending: 250,
    mpc: 0.75,
    investmentSensitivity: 50,
    moneySupply: 500,
    moneyDemandIncomeSensitivity: 0.5,
    moneyDemandInterestSensitivity: 100,
    taxRate: 0.2,
    explanation:
      'L\'augmentation des depenses publiques deplace la courbe IS vers la droite. Le revenu augmente mais le taux d\'interet monte egalement, ce qui evince partiellement l\'investissement prive. C\'est l\'effet d\'eviction.',
  },
  {
    id: 'politique-monetaire',
    title: 'Politique monetaire expansionniste',
    description:
      'La banque centrale augmente l\'offre de monnaie pour stimuler l\'economie.',
    autonomousSpending: 200,
    mpc: 0.75,
    investmentSensitivity: 50,
    moneySupply: 650,
    moneyDemandIncomeSensitivity: 0.5,
    moneyDemandInterestSensitivity: 100,
    taxRate: 0.2,
    explanation:
      'L\'augmentation de l\'offre de monnaie deplace la courbe LM vers la droite. Le taux d\'interet baisse, ce qui stimule l\'investissement et donc le revenu. La politique monetaire est efficace tant que l\'economie n\'est pas en trappe a liquidite.',
  },
  {
    id: 'policy-mix',
    title: 'Policy mix (relance combinee)',
    description:
      'L\'Etat et la banque centrale coordonnent une relance budgetaire et monetaire.',
    autonomousSpending: 250,
    mpc: 0.75,
    investmentSensitivity: 50,
    moneySupply: 650,
    moneyDemandIncomeSensitivity: 0.5,
    moneyDemandInterestSensitivity: 100,
    taxRate: 0.2,
    explanation:
      'En combinant politique budgetaire et monetaire expansionnistes, le revenu augmente fortement. La politique monetaire accommodante limite la hausse du taux d\'interet, reduisant l\'effet d\'eviction. C\'est le policy mix ideal pour une relance.',
  },
  {
    id: 'trappe-liquidite',
    title: 'Trappe a liquidite',
    description:
      'Le taux d\'interet est si bas que la politique monetaire devient inefficace.',
    autonomousSpending: 180,
    mpc: 0.75,
    investmentSensitivity: 50,
    moneySupply: 800,
    moneyDemandIncomeSensitivity: 0.5,
    moneyDemandInterestSensitivity: 5000,
    taxRate: 0.2,
    explanation:
      'Quand la courbe LM est quasi horizontale (sensibilite tres elevee de la demande de monnaie au taux d\'interet), toute injection de monnaie supplementaire est absorbee sans baisser le taux. Seule la politique budgetaire reste efficace. C\'est la situation decrite par Keynes lors de la Grande Depression, et revisitee apres 2008.',
  },
  {
    id: 'cas-classique',
    title: 'Cas classique',
    description:
      'La demande de monnaie depend uniquement du revenu, pas du taux d\'interet.',
    autonomousSpending: 200,
    mpc: 0.75,
    investmentSensitivity: 50,
    moneySupply: 500,
    moneyDemandIncomeSensitivity: 0.5,
    moneyDemandInterestSensitivity: 5,
    taxRate: 0.2,
    explanation:
      'Quand la courbe LM est quasi verticale (faible sensibilite au taux d\'interet), la politique budgetaire est totalement evincee : toute hausse des depenses publiques provoque une hausse du taux d\'interet qui reduit d\'autant l\'investissement prive. Seule la politique monetaire est efficace.',
  },
];

export function getISLMScenario(id: string): ISLMScenario | undefined {
  return islmScenarios.find((s) => s.id === id);
}
