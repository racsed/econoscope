export interface CompetitionMonopolyScenario {
  id: string;
  title: string;
  description: string;
  /** Intercept de la demande (prix max) */
  demandeIntercept: number;
  /** Pente de la courbe de demande */
  penteDemande: number;
  /** Coût marginal constant */
  coutMarginal: number;
  /** Coûts fixes de production */
  coutFixe: number;
  /** Structure de marché */
  mode: 'concurrence' | 'monopole';
  explanation: string;
}

export const competitionMonopolyScenarios: CompetitionMonopolyScenario[] = [
  {
    id: 'concurrence-pure',
    title: 'Concurrence pure et parfaite',
    description:
      'Marché atomisé ou de nombreuses entreprises identiques produisent un bien homogène.',
    demandeIntercept: 100,
    penteDemande: 1,
    coutMarginal: 20,
    coutFixe: 0,
    mode: 'concurrence',
    explanation:
      'En concurrence parfaite, aucune entreprise n\'a de pouvoir de marché. Le prix s\'etablit au coût marginal (20 EUR). La quantité échangée est maximale (80 unites). Le surplus du consommateur est maximal et il n\'y a aucune perte sèche. C\'est l\'équilibre de référence en microéconomie.',
  },
  {
    id: 'monopole-classique',
    title: 'Monopole classique',
    description:
      'Un seul producteur maitrise l\'offre et fixe le prix au-dessus du coût marginal.',
    demandeIntercept: 100,
    penteDemande: 1,
    coutMarginal: 20,
    coutFixe: 100,
    mode: 'monopole',
    explanation:
      'Le monopoleur egalise sa recette marginale au coût marginal, produisant 40 unites à un prix de 60 EUR. Le profit est de (60-20)*40 - 100 = 1 500 EUR. La perte sèche (triangle de Harberger) s\'élevé a 800 EUR : c\'est la valeur des échanges mutuellement avantageux qui n\'ont pas lieu.',
  },
  {
    id: 'monopole-naturel',
    title: 'Monopole naturel',
    description:
      'Coûts fixes très élevés rendant inefficace la presence de plusieurs producteurs.',
    demandeIntercept: 100,
    penteDemande: 1,
    coutMarginal: 10,
    coutFixe: 400,
    mode: 'monopole',
    explanation:
      'Un monopole naturel se caracterise par des coûts fixes si élevés qu\'un seul producteur est plus efficace que plusieurs. C\'est le cas des réseaux (électricité, rail, eau). La tarification au coût marginal entrainerait des pertes ; le regulateur doit trouver un équilibre entre couverture des coûts et accessibilite.',
  },
  {
    id: 'monopole-coûts-élevés',
    title: 'Monopole a coûts élevés',
    description:
      'Coût marginal élevé qui réduit fortement la marge du monopoleur.',
    demandeIntercept: 100,
    penteDemande: 1,
    coutMarginal: 45,
    coutFixe: 100,
    mode: 'monopole',
    explanation:
      'Quand le coût marginal est proche de l\'intercept de la demande, même le monopoleur ne peut degager une forte marge. La quantité produite est faible, le prix élevé, et le profit réduit. C\'est le cas de certains secteurs de haute technologie ou les coûts unitaires restent élevés.',
  },
  {
    id: 'quasi-concurrence',
    title: 'Quasi-concurrence (marché contestable)',
    description:
      'Demande très élastique qui limite le pouvoir du monopoleur.',
    demandeIntercept: 60,
    penteDemande: 0.5,
    coutMarginal: 20,
    coutFixe: 50,
    mode: 'monopole',
    explanation:
      'Quand la demande est très élastique (pente faible), les consommateurs sont très sensibles au prix. Le monopoleur ne peut augmenter significativement son prix sans perdre l\'essentiel de sa clientele. C\'est la théorie des marchés contestables de Baumol : la menace d\'entree suffit a discipliner le monopoleur.',
  },
];

export function getCompetitionMonopolyScenario(id: string): CompetitionMonopolyScenario | undefined {
  return competitionMonopolyScenarios.find((s) => s.id === id);
}
