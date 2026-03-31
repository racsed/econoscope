export interface ExchangeRateScenario {
  id: string;
  title: string;
  description: string;
  /** Taux de change nominal EUR/USD */
  tauxChange: number;
  /** Indice des prix domestiques (base 100) */
  prixDomestiques: number;
  /** Indice des prix etrangers (base 100) */
  prixEtrangers: number;
  /** Elasticite des exportations au taux de change reel */
  elasticiteExport: number;
  /** Elasticite des importations au taux de change reel */
  elasticiteImport: number;
  explanation: string;
}

export const exchangeRateScenarios: ExchangeRateScenario[] = [
  {
    id: 'equilibre-initial',
    title: 'Equilibre initial',
    description:
      'Point de depart avec taux de change a parite et prix identiques.',
    tauxChange: 1.0,
    prixDomestiques: 100,
    prixEtrangers: 100,
    elasticiteExport: 1.5,
    elasticiteImport: 1.2,
    explanation:
      'A parite (1 EUR = 1 USD) et avec des niveaux de prix identiques, le taux de change reel est egal a 1. Exportations et importations s\'equilibrent. La condition de Marshall-Lerner est largement remplie (1.5 + 1.2 = 2.7 > 1), ce qui signifie qu\'une depreciation ameliorerait la balance commerciale.',
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
      'Avec un euro fort (0.70 EUR/USD), les produits europeens coutent plus cher a l\'etranger et les importations deviennent bon marche. Les exportations chutent tandis que les importations augmentent, creusant le deficit commercial. C\'est la situation typique qui a penalise l\'industrie francaise dans les annees 2000-2010.',
  },
  {
    id: 'euro-faible',
    title: 'Euro faible (depreciation)',
    description:
      'L\'euro se deprecie, boost des exportations mais rencherissement des importations.',
    tauxChange: 1.4,
    prixDomestiques: 100,
    prixEtrangers: 100,
    elasticiteExport: 1.5,
    elasticiteImport: 1.2,
    explanation:
      'Un euro faible (1.40 EUR/USD) ameliore la competitivite-prix des exportations europeennes. Cependant, les importations (energie, matieres premieres) coutent plus cher. Si la condition de Marshall-Lerner est remplie, l\'effet net est positif pour la balance commerciale. C\'est ce qui s\'est produit avec la depreciation de l\'euro en 2022.',
  },
  {
    id: 'choc-petrolier',
    title: 'Choc petrolier (prix etrangers en hausse)',
    description:
      'Hausse des prix mondiaux de l\'energie, balance commerciale degradee.',
    tauxChange: 1.0,
    prixDomestiques: 100,
    prixEtrangers: 120,
    elasticiteExport: 1.5,
    elasticiteImport: 0.8,
    explanation:
      'Quand les prix etrangers augmentent (choc energetique), le taux de change reel se deprecie mecaniquement, mais l\'elasticite des importations energetiques est faible (0.8) car la demande est peu substituable. Le deficit se creuse par les importations incompressibles. C\'est le scenario de la crise energetique de 2022 en Europe.',
  },
  {
    id: 'desinflation-competitive',
    title: 'Desinflation competitive',
    description:
      'Baisse des prix domestiques pour gagner en competitivite sans devaluer.',
    tauxChange: 1.0,
    prixDomestiques: 85,
    prixEtrangers: 100,
    elasticiteExport: 1.5,
    elasticiteImport: 1.2,
    explanation:
      'En zone euro, un pays ne peut pas devaluer sa monnaie. La desinflation competitive consiste a reduire les couts interieurs (gel des salaires, reformes structurelles) pour ameliorer la competitivite-prix. C\'est la strategie suivie par l\'Allemagne avec les reformes Hartz (2003-2005), qui a contribue a son excedent commercial record.',
  },
];

export function getExchangeRateScenario(id: string): ExchangeRateScenario | undefined {
  return exchangeRateScenarios.find((s) => s.id === id);
}
