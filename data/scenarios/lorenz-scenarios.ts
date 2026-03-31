export interface LorenzScenario {
  id: string;
  title: string;
  description: string;
  /** Coefficient de Gini (0 = egalite parfaite, 1 = inegalite maximale) */
  gini: number;
  /**
   * Distribution des revenus par decile (10 valeurs).
   * Chaque valeur represente la part du revenu total detenue par ce decile (en %).
   * La somme doit valoir 100.
   */
  deciles: [number, number, number, number, number, number, number, number, number, number];
  source: string;
  explanation: string;
}

export const lorenzScenarios: LorenzScenario[] = [
  {
    id: 'egalite-parfaite',
    title: 'Egalite parfaite',
    description: 'Chaque decile detient exactement 10 % du revenu total.',
    gini: 0,
    deciles: [10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
    source: 'Cas theorique',
    explanation:
      'L\'egalite parfaite correspond a une courbe de Lorenz confondue avec la diagonale. Le coefficient de Gini vaut 0. C\'est un cas theorique qui n\'existe dans aucune economie reelle, mais qui sert de reference pour mesurer les ecarts.',
  },
  {
    id: 'france-2023',
    title: 'France 2023',
    description: 'La distribution des revenus en France apres redistribution.',
    gini: 0.29,
    deciles: [3.5, 5.0, 6.0, 7.0, 8.0, 9.5, 11.0, 13.0, 16.0, 21.0],
    source: 'INSEE, enquete Revenus fiscaux et sociaux 2023',
    explanation:
      'La France presente un coefficient de Gini relativement faible (0,29 apres redistribution) grace a un systeme socio-fiscal fortement redistributif. Les 10 % les plus riches detiennent environ 21 % des revenus, tandis que les 10 % les plus pauvres en percoivent 3,5 %. Avant redistribution, le Gini serait autour de 0,37.',
  },
  {
    id: 'etats-unis',
    title: 'Etats-Unis 2023',
    description: 'La distribution des revenus dans la premiere puissance mondiale.',
    gini: 0.39,
    deciles: [2.0, 3.5, 4.5, 5.5, 7.0, 8.5, 10.5, 13.5, 18.0, 27.0],
    source: 'U.S. Census Bureau, Current Population Survey',
    explanation:
      'Les Etats-Unis affichent un Gini nettement plus eleve que la France (0,39). Les inegalites y sont plus marquees en raison d\'un systeme de redistribution moins genereux et de tres hauts revenus concentres dans le dernier decile. Les 10 % les plus riches captent 27 % des revenus.',
  },
  {
    id: 'scandinavie',
    title: 'Scandinavie (modele suedois)',
    description: 'Le modele scandinave, reference en matiere d\'egalite.',
    gini: 0.25,
    deciles: [4.0, 5.5, 6.5, 7.5, 8.5, 10.0, 11.0, 12.5, 15.0, 19.5],
    source: 'Statistics Sweden, OCDE',
    explanation:
      'La Suede et les pays scandinaves presentent les coefficients de Gini les plus bas du monde developpe (0,25). Ce resultat est obtenu grace a une fiscalite fortement progressive, des services publics universels et des negociations salariales centralisees qui compriment l\'echelle des revenus.',
  },
  {
    id: 'tres-inegalitaire',
    title: 'Economie tres inegalitaire',
    description: 'Un cas stylise illustrant une extreme concentration des revenus.',
    gini: 0.6,
    deciles: [1.0, 1.5, 2.0, 3.0, 4.0, 5.5, 8.0, 12.0, 20.0, 43.0],
    source: 'Cas stylise inspire de pays a forte inegalite',
    explanation:
      'Dans les economies les plus inegalitaires (certains pays d\'Amerique latine ou d\'Afrique), le coefficient de Gini peut depasser 0,55. Les 10 % les plus riches captent pres de la moitie du revenu total, tandis que les 40 % les plus pauvres se partagent moins de 8 %. La courbe de Lorenz est tres eloignee de la diagonale.',
  },
];

export function getLorenzScenario(id: string): LorenzScenario | undefined {
  return lorenzScenarios.find((s) => s.id === id);
}
