export interface ExchangeRateScenario {
  id: string;
  title: string;
  description: string;
  /** Taux de change nominal EUR/USD */
  tauxChange: number;
  /** Indice des prix domestiques (base 100) */
  prixDomestiques: number;
  /** Indice des prix étrangers (base 100) */
  prixEtrangers: number;
  /** Élasticité des exportations au taux de change réel */
  elasticiteExport: number;
  /** Élasticité des importations au taux de change réel */
  elasticiteImport: number;
  explanation: string;
}

export const exchangeRateScenarios: ExchangeRateScenario[] = [
  {
    id: 'équilibre-initial',
    title: 'Équilibre initial',
    description:
      'Point de depart avec taux de change a parité et prix identiques.',
    tauxChange: 1.0,
    prixDomestiques: 100,
    prixEtrangers: 100,
    elasticiteExport: 1.5,
    elasticiteImport: 1.2,
    explanation:
      'A parité (1 EUR = 1 USD) et avec des niveaux de prix identiques, le taux de change réel est egal a 1. Exportations et importations s\'equilibrent. La condition de Marshall-Lerner est largement remplie (1.5 + 1.2 = 2.7 > 1), ce qui signifie qu\'une dépréciation ameliorerait la balance commerciale.',
  },
  {
    id: 'euro-fort',
    title: 'Euro fort (appreciation)',
    description:
      'L\'euro s\'apprecie, les exportations deviennent moins competitives.',
    tauxChange: 0.7,
    prixDomestiques: 100,
    prixEtrangers: 100,
    elasticiteExport: 1.5,
    elasticiteImport: 1.2,
    explanation:
      'Avec un euro fort (0.70 EUR/USD), les produits européens coutent plus cher a l\'etranger et les importations deviennent bon marche. Les exportations chutent tandis que les importations augmentent, creusant le déficit commercial. C\'est la situation typique qui a pénalisé l\'industrie française dans les années 2000-2010.',
  },
  {
    id: 'euro-faible',
    title: 'Euro faible (dépréciation)',
    description:
      'L\'euro se deprecie, boost des exportations mais rencherissement des importations.',
    tauxChange: 1.4,
    prixDomestiques: 100,
    prixEtrangers: 100,
    elasticiteExport: 1.5,
    elasticiteImport: 1.2,
    explanation:
      'Un euro faible (1.40 EUR/USD) ameliore la compétitivité-prix des exportations européennes. Cependant, les importations (énergie, matières premières) coutent plus cher. Si la condition de Marshall-Lerner est remplie, l\'effet net est positif pour la balance commerciale. C\'est ce qui s\'est produit avec la dépréciation de l\'euro en 2022.',
  },
  {
    id: 'choc-pétrolier',
    title: 'Choc pétrolier (prix étrangers en hausse)',
    description:
      'Hausse des prix mondiaux de l\'énergie, balance commerciale dégradée.',
    tauxChange: 1.0,
    prixDomestiques: 100,
    prixEtrangers: 120,
    elasticiteExport: 1.5,
    elasticiteImport: 0.8,
    explanation:
      'Quand les prix étrangers augmentent (choc énergétique), le taux de change réel se deprecie mecaniquement, mais l\'élasticité des importations energetiques est faible (0.8) car la demande est peu substituable. Le déficit se creuse par les importations incompressibles. C\'est le scénario de la crise énergétique de 2022 en Europe.',
  },
  {
    id: 'désinflation-competitive',
    title: 'Désinflation competitive',
    description:
      'Baisse des prix domestiques pour gagner en compétitivité sans devaluer.',
    tauxChange: 1.0,
    prixDomestiques: 85,
    prixEtrangers: 100,
    elasticiteExport: 1.5,
    elasticiteImport: 1.2,
    explanation:
      'En zone euro, un pays ne peut pas devaluer sa monnaie. La désinflation competitive consiste a réduire les coûts interieurs (gel des salaires, réformes structurelles) pour ameliorer la compétitivité-prix. C\'est la stratégie suivie par l\'Allemagne avec les réformes Hartz (2003-2005), qui a contribue à son excédent commercial record.',
  },
];

export function getExchangeRateScenario(id: string): ExchangeRateScenario | undefined {
  return exchangeRateScenarios.find((s) => s.id === id);
}
