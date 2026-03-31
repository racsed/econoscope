export interface ISLMScenario {
  id: string;
  title: string;
  description: string;
  /** Dépenses autonomes (consommation, investissement, dépenses publiques) */
  autonomousSpending: number;
  /** Propension marginale à consommer */
  mpc: number;
  /** Sensibilite de l'investissement au taux d'intérêt */
  investmentSensitivity: number;
  /** Offre de monnaie réelle (M/P) */
  moneySupply: number;
  /** Sensibilite de la demande de monnaie au revenu */
  moneyDemandIncomeSensitivity: number;
  /** Sensibilite de la demande de monnaie au taux d'intérêt */
  moneyDemandInterestSensitivity: number;
  /** Taux d'imposition */
  taxRate: number;
  explanation: string;
}

export const islmScenarios: ISLMScenario[] = [
  {
    id: 'politique-budgétaire',
    title: 'Politique budgétaire expansionniste',
    description:
      'L\'État augmente ses dépenses publiques pour relancer l\'activité économique.',
    autonomousSpending: 250,
    mpc: 0.75,
    investmentSensitivity: 50,
    moneySupply: 500,
    moneyDemandIncomeSensitivity: 0.5,
    moneyDemandInterestSensitivity: 100,
    taxRate: 0.2,
    explanation:
      'L\'augmentation des dépenses publiques déplace la courbe IS vers la droite. Le revenu augmente mais le taux d\'intérêt monte également, ce qui evince partiellement l\'investissement privé. C\'est l\'effet d\'éviction.',
  },
  {
    id: 'politique-monétaire',
    title: 'Politique monétaire expansionniste',
    description:
      'La banque centrale augmente l\'offre de monnaie pour stimuler l\'économie.',
    autonomousSpending: 200,
    mpc: 0.75,
    investmentSensitivity: 50,
    moneySupply: 650,
    moneyDemandIncomeSensitivity: 0.5,
    moneyDemandInterestSensitivity: 100,
    taxRate: 0.2,
    explanation:
      'L\'augmentation de l\'offre de monnaie déplace la courbe LM vers la droite. Le taux d\'intérêt baisse, ce qui stimule l\'investissement et donc le revenu. La politique monétaire est efficace tant que l\'économie n\'est pas en trappe a liquidite.',
  },
  {
    id: 'policy-mix',
    title: 'Policy mix (relance combinee)',
    description:
      'L\'État et la banque centrale coordonnent une relance budgétaire et monétaire.',
    autonomousSpending: 250,
    mpc: 0.75,
    investmentSensitivity: 50,
    moneySupply: 650,
    moneyDemandIncomeSensitivity: 0.5,
    moneyDemandInterestSensitivity: 100,
    taxRate: 0.2,
    explanation:
      'En combinant politique budgétaire et monétaire expansionnistes, le revenu augmente fortement. La politique monétaire accommodante limite la hausse du taux d\'intérêt, réduisant l\'effet d\'éviction. C\'est le policy mix ideal pour une relance.',
  },
  {
    id: 'trappe-liquidite',
    title: 'Trappe a liquidite',
    description:
      'Le taux d\'intérêt est si bas que la politique monétaire devient inefficace.',
    autonomousSpending: 180,
    mpc: 0.75,
    investmentSensitivity: 50,
    moneySupply: 800,
    moneyDemandIncomeSensitivity: 0.5,
    moneyDemandInterestSensitivity: 5000,
    taxRate: 0.2,
    explanation:
      'Quand la courbe LM est quasi horizontale (sensibilite tres élevée de la demande de monnaie au taux d\'intérêt), toute injection de monnaie supplémentaire est absorbee sans baisser le taux. Seule la politique budgétaire reste efficace. C\'est la situation decrite par Keynes lors de la Grande Depression, et revisitee après 2008.',
  },
  {
    id: 'cas-classique',
    title: 'Cas classique',
    description:
      'La demande de monnaie depend uniquement du revenu, pas du taux d\'intérêt.',
    autonomousSpending: 200,
    mpc: 0.75,
    investmentSensitivity: 50,
    moneySupply: 500,
    moneyDemandIncomeSensitivity: 0.5,
    moneyDemandInterestSensitivity: 5,
    taxRate: 0.2,
    explanation:
      'Quand la courbe LM est quasi verticale (faible sensibilite au taux d\'intérêt), la politique budgétaire est totalement evincee : toute hausse des dépenses publiques provoque une hausse du taux d\'intérêt qui réduit d\'autant l\'investissement privé. Seule la politique monétaire est efficace.',
  },
];

export function getISLMScenario(id: string): ISLMScenario | undefined {
  return islmScenarios.find((s) => s.id === id);
}
