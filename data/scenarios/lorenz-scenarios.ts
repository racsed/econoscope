export interface LorenzScenario {
  id: string;
  title: string;
  description: string;
  /** Coefficient de Gini (0 = égalité parfaite, 1 = inégalité maximale) */
  gini: number;
  /**
   * Distribution des revenus par décile (10 valeurs).
   * Chaque valeur représente la part du revenu total detenue par ce décile (en %).
   * La somme doit valoir 100.
   */
  déciles: [number, number, number, number, number, number, number, number, number, number];
  source: string;
  explanation: string;
}

export const lorenzScenarios: LorenzScenario[] = [
  {
    id: 'égalité-parfaite',
    title: 'Égalité parfaite',
    description: 'Chaque décile détient exactement 10 % du revenu total.',
    gini: 0,
    déciles: [10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
    source: 'Cas théorique',
    explanation:
      'L\'égalité parfaite correspond à une courbe de Lorenz confondue avec la diagonale. Le coefficient de Gini vaut 0. C\'est un cas théorique qui n\'existe dans aucune économie réelle, mais qui sert de référence pour mesurer les écarts.',
  },
  {
    id: 'france-2023',
    title: 'France 2023',
    description: 'La distribution des revenus en France après redistribution.',
    gini: 0.29,
    déciles: [3.5, 5.0, 6.0, 7.0, 8.0, 9.5, 11.0, 13.0, 16.0, 21.0],
    source: 'INSEE, enquete Revenus fiscaux et sociaux 2023',
    explanation:
      'La France presente un coefficient de Gini relativement faible (0,29 après redistribution) grâce à un système socio-fiscal fortement redistributif. Les 10 % les plus riches détiennent environ 21 % des revenus, tandis que les 10 % les plus pauvres en percoivent 3,5 %. Avant redistribution, le Gini serait autour de 0,37.',
  },
  {
    id: 'etats-unis',
    title: 'États-Unis 2023',
    description: 'La distribution des revenus dans la première puissance mondiale.',
    gini: 0.39,
    déciles: [2.0, 3.5, 4.5, 5.5, 7.0, 8.5, 10.5, 13.5, 18.0, 27.0],
    source: 'U.S. Census Bureau, Current Population Survey',
    explanation:
      'Les États-Unis affichent un Gini nettement plus élevé que la France (0,39). Les inégalités y sont plus marquees en raison d\'un système de redistribution moins généreux et de tres hauts revenus concentres dans le dernier décile. Les 10 % les plus riches captent 27 % des revenus.',
  },
  {
    id: 'scandinavie',
    title: 'Scandinavie (modèle suedois)',
    description: 'Le modèle scandinave, référence en matière d\'égalité.',
    gini: 0.25,
    déciles: [4.0, 5.5, 6.5, 7.5, 8.5, 10.0, 11.0, 12.5, 15.0, 19.5],
    source: 'Statistics Sweden, OCDE',
    explanation:
      'La Suede et les pays scandinaves presentent les coefficients de Gini les plus bas du monde developpe (0,25). Ce résultat est obtenu grâce à une fiscalité fortement progressive, des services publics universels et des négociations salariales centralisees qui compriment l\'échelle des revenus.',
  },
  {
    id: 'tres-inégalitaire',
    title: 'Économie tres inégalitaire',
    description: 'Un cas stylise illustrant une extreme concentration des revenus.',
    gini: 0.6,
    déciles: [1.0, 1.5, 2.0, 3.0, 4.0, 5.5, 8.0, 12.0, 20.0, 43.0],
    source: 'Cas stylise inspire de pays a forte inégalité',
    explanation:
      'Dans les économies les plus inegalitaires (certains pays d\'Amerique latine ou d\'Afrique), le coefficient de Gini peut dépasser 0,55. Les 10 % les plus riches captent pres de la moitie du revenu total, tandis que les 40 % les plus pauvres se partagent moins de 8 %. La courbe de Lorenz est tres eloignee de la diagonale.',
  },
];

export function getLorenzScenario(id: string): LorenzScenario | undefined {
  return lorenzScenarios.find((s) => s.id === id);
}
