export interface CompetitionMonopolyScenario {
  id: string;
  title: string;
  description: string;
  /** Intercept de la demande (prix max) */
  demandeIntercept: number;
  /** Pente de la courbe de demande */
  penteDemande: number;
  /** Cout marginal constant */
  coutMarginal: number;
  /** Couts fixes de production */
  coutFixe: number;
  /** Structure de marche */
  mode: 'concurrence' | 'monopole';
  explanation: string;
}

export const competitionMonopolyScenarios: CompetitionMonopolyScenario[] = [
  {
    id: 'concurrence-pure',
    title: 'Concurrence pure et parfaite',
    description:
      'Marche atomise ou de nombreuses entreprises identiques produisent un bien homogene.',
    demandeIntercept: 100,
    penteDemande: 1,
    coutMarginal: 20,
    coutFixe: 0,
    mode: 'concurrence',
    explanation:
      'En concurrence parfaite, aucune entreprise n\'a de pouvoir de marche. Le prix s\'etablit au cout marginal (20 EUR). La quantite echangee est maximale (80 unites). Le surplus du consommateur est maximal et il n\'y a aucune perte seche. C\'est l\'equilibre de reference en microeconomie.',
  },
  {
    id: 'monopole-classique',
    title: 'Monopole classique',
    description:
      'Un seul producteur maitrise l\'offre et fixe le prix au-dessus du cout marginal.',
    demandeIntercept: 100,
    penteDemande: 1,
    coutMarginal: 20,
    coutFixe: 100,
    mode: 'monopole',
    explanation:
      'Le monopoleur egalise sa recette marginale au cout marginal, produisant 40 unites a un prix de 60 EUR. Le profit est de (60-20)*40 - 100 = 1 500 EUR. La perte seche (triangle de Harberger) s\'eleve a 800 EUR : c\'est la valeur des echanges mutuellement avantageux qui n\'ont pas lieu.',
  },
  {
    id: 'monopole-naturel',
    title: 'Monopole naturel',
    description:
      'Couts fixes tres eleves rendant inefficace la presence de plusieurs producteurs.',
    demandeIntercept: 100,
    penteDemande: 1,
    coutMarginal: 10,
    coutFixe: 400,
    mode: 'monopole',
    explanation:
      'Un monopole naturel se caracterise par des couts fixes si eleves qu\'un seul producteur est plus efficace que plusieurs. C\'est le cas des reseaux (electricite, rail, eau). La tarification au cout marginal entrainerait des pertes ; le regulateur doit trouver un equilibre entre couverture des couts et accessibilite.',
  },
  {
    id: 'monopole-couts-eleves',
    title: 'Monopole a couts eleves',
    description:
      'Cout marginal eleve qui reduit fortement la marge du monopoleur.',
    demandeIntercept: 100,
    penteDemande: 1,
    coutMarginal: 45,
    coutFixe: 100,
    mode: 'monopole',
    explanation:
      'Quand le cout marginal est proche de l\'intercept de la demande, meme le monopoleur ne peut degager une forte marge. La quantite produite est faible, le prix eleve, et le profit reduit. C\'est le cas de certains secteurs de haute technologie ou les couts unitaires restent eleves.',
  },
  {
    id: 'quasi-concurrence',
    title: 'Quasi-concurrence (marche contestable)',
    description:
      'Demande tres elastique qui limite le pouvoir du monopoleur.',
    demandeIntercept: 60,
    penteDemande: 0.5,
    coutMarginal: 20,
    coutFixe: 50,
    mode: 'monopole',
    explanation:
      'Quand la demande est tres elastique (pente faible), les consommateurs sont tres sensibles au prix. Le monopoleur ne peut augmenter significativement son prix sans perdre l\'essentiel de sa clientele. C\'est la theorie des marches contestables de Baumol : la menace d\'entree suffit a discipliner le monopoleur.',
  },
];

export function getCompetitionMonopolyScenario(id: string): CompetitionMonopolyScenario | undefined {
  return competitionMonopolyScenarios.find((s) => s.id === id);
}
