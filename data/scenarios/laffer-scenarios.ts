export interface LafferScenario {
  id: string;
  title: string;
  description: string;
  /** Taux d'imposition optimal (sommet de la courbe, en %) */
  optimalRate: number;
  /** Recettes maximales au taux optimal (indice base 100) */
  maxRevenue: number;
  /** Élasticité du revenu imposable par rapport au taux */
  elasticity: number;
  /** Taux actuel a afficher comme référence */
  currentRate: number;
  explanation: string;
}

export const lafferScenarios: LafferScenario[] = [
  {
    id: 'modèle-standard',
    title: 'Modèle standard',
    description:
      'La courbe de Laffer symetrique classique avec un sommet a 50 %.',
    optimalRate: 50,
    maxRevenue: 100,
    elasticity: 1.0,
    currentRate: 45,
    explanation:
      'Dans le modèle symetrique le plus simple, les recettes fiscales sont maximales à un taux de 50 %. Au-dela, la désincitation au travail et l\'évasion fiscale reduisent l\'assiette plus vite que le taux ne l\'augmente. C\'est la forme théorique pure de la courbe de Laffer.',
  },
  {
    id: 'faible-élasticité',
    title: 'Faible élasticité (travail peu qualifie)',
    description:
      'Les contribuables ont peu de marge pour ajuster leur comportement.',
    optimalRate: 70,
    maxRevenue: 100,
    elasticity: 0.3,
    currentRate: 45,
    explanation:
      'Quand l\'élasticité du revenu imposable est faible (travailleurs peu qualifies, salariés captifs), le sommet de la courbe se déplace vers la droite. L\'État peut prelever un taux élevé sans trop réduire l\'assiette. Le taux optimal monte a environ 70 %.',
  },
  {
    id: 'forte-élasticité',
    title: 'Forte élasticité (hauts revenus, capital)',
    description:
      'Les contribuables mobiles reagissent fortement au taux d\'imposition.',
    optimalRate: 35,
    maxRevenue: 100,
    elasticity: 2.0,
    currentRate: 45,
    explanation:
      'Les hauts revenus et les detenteurs de capitaux ont une forte capacité d\'optimisation fiscale et de mobilite internationale. Avec une élasticité élevée, le sommet de la courbe se situe autour de 35 %. Au-dela, les recettes diminuent rapidement par exil fiscal et optimisation.',
  },
  {
    id: 'france-impot-revenu',
    title: 'France -- impot sur le revenu',
    description:
      'Application au cas français avec son système progressif.',
    optimalRate: 55,
    maxRevenue: 100,
    elasticity: 0.7,
    currentRate: 45,
    explanation:
      'En France, les estimations empiriques suggerent une élasticité du revenu imposable autour de 0,5-0,8 pour les tranches supérieures. Le taux marginal optimal se situerait entre 50 % et 60 %. Le debat autour de la "taxe a 75 %" de 2012 illustre parfaitement les enjeux de la courbe de Laffer appliquée à la politique fiscale française.',
  },
  {
    id: 'tva-consommation',
    title: 'TVA et taxation de la consommation',
    description:
      'La courbe de Laffer appliquée à la taxe sur la valeur ajoutee.',
    optimalRate: 40,
    maxRevenue: 100,
    elasticity: 1.2,
    currentRate: 20,
    explanation:
      'Pour la TVA, l\'élasticité est moderement élevée car les consommateurs peuvent reporter leurs achats ou se tourner vers l\'économie souterraine. Avec un taux actuel de 20 % en France, on se situe bien en deca du sommet théorique, ce qui signifie qu\'une hausse de TVA augmenterait effectivement les recettes.',
  },
];

export function getLafferScenario(id: string): LafferScenario | undefined {
  return lafferScenarios.find((s) => s.id === id);
}
