export interface LafferScenario {
  id: string;
  title: string;
  description: string;
  /** Taux d'imposition optimal (sommet de la courbe, en %) */
  optimalRate: number;
  /** Recettes maximales au taux optimal (indice base 100) */
  maxRevenue: number;
  /** Elasticite du revenu imposable par rapport au taux */
  elasticity: number;
  /** Taux actuel a afficher comme reference */
  currentRate: number;
  explanation: string;
}

export const lafferScenarios: LafferScenario[] = [
  {
    id: 'modele-standard',
    title: 'Modele standard',
    description:
      'La courbe de Laffer symetrique classique avec un sommet a 50 %.',
    optimalRate: 50,
    maxRevenue: 100,
    elasticity: 1.0,
    currentRate: 45,
    explanation:
      'Dans le modele symetrique le plus simple, les recettes fiscales sont maximales a un taux de 50 %. Au-dela, la desincitation au travail et l\'evasion fiscale reduisent l\'assiette plus vite que le taux ne l\'augmente. C\'est la forme theorique pure de la courbe de Laffer.',
  },
  {
    id: 'faible-elasticite',
    title: 'Faible elasticite (travail peu qualifie)',
    description:
      'Les contribuables ont peu de marge pour ajuster leur comportement.',
    optimalRate: 70,
    maxRevenue: 100,
    elasticity: 0.3,
    currentRate: 45,
    explanation:
      'Quand l\'elasticite du revenu imposable est faible (travailleurs peu qualifies, salaries captifs), le sommet de la courbe se deplace vers la droite. L\'Etat peut prelever un taux eleve sans trop reduire l\'assiette. Le taux optimal monte a environ 70 %.',
  },
  {
    id: 'forte-elasticite',
    title: 'Forte elasticite (hauts revenus, capital)',
    description:
      'Les contribuables mobiles reagissent fortement au taux d\'imposition.',
    optimalRate: 35,
    maxRevenue: 100,
    elasticity: 2.0,
    currentRate: 45,
    explanation:
      'Les hauts revenus et les detenteurs de capitaux ont une forte capacite d\'optimisation fiscale et de mobilite internationale. Avec une elasticite elevee, le sommet de la courbe se situe autour de 35 %. Au-dela, les recettes diminuent rapidement par exil fiscal et optimisation.',
  },
  {
    id: 'france-impot-revenu',
    title: 'France -- impot sur le revenu',
    description:
      'Application au cas francais avec son systeme progressif.',
    optimalRate: 55,
    maxRevenue: 100,
    elasticity: 0.7,
    currentRate: 45,
    explanation:
      'En France, les estimations empiriques suggerent une elasticite du revenu imposable autour de 0,5-0,8 pour les tranches superieures. Le taux marginal optimal se situerait entre 50 % et 60 %. Le debat autour de la "taxe a 75 %" de 2012 illustre parfaitement les enjeux de la courbe de Laffer appliquee a la politique fiscale francaise.',
  },
  {
    id: 'tva-consommation',
    title: 'TVA et taxation de la consommation',
    description:
      'La courbe de Laffer appliquee a la taxe sur la valeur ajoutee.',
    optimalRate: 40,
    maxRevenue: 100,
    elasticity: 1.2,
    currentRate: 20,
    explanation:
      'Pour la TVA, l\'elasticite est moderement elevee car les consommateurs peuvent reporter leurs achats ou se tourner vers l\'economie souterraine. Avec un taux actuel de 20 % en France, on se situe bien en deca du sommet theorique, ce qui signifie qu\'une hausse de TVA augmenterait effectivement les recettes.',
  },
];

export function getLafferScenario(id: string): LafferScenario | undefined {
  return lafferScenarios.find((s) => s.id === id);
}
