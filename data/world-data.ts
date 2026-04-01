export interface CountryData {
  iso: string; // ISO 3166-1 alpha-3 (FRA, USA, DEU, etc.)
  name: string;
  gini?: number;
  pibGrowth?: number;
  inflation?: number;
  unemployment?: number;
  debtToGdp?: number;
  tradeBalance?: number; // % of GDP
}

// Sources: World Bank, IMF World Economic Outlook 2023 estimates
export const worldData: CountryData[] = [
  // Europe
  { iso: 'FRA', name: 'France', gini: 31.6, pibGrowth: 0.9, inflation: 5.7, unemployment: 7.3, debtToGdp: 110.6, tradeBalance: -3.6 },
  { iso: 'DEU', name: 'Allemagne', gini: 31.7, pibGrowth: -0.3, inflation: 6.0, unemployment: 3.0, debtToGdp: 64.3, tradeBalance: 5.5 },
  { iso: 'GBR', name: 'Royaume-Uni', gini: 35.1, pibGrowth: 0.1, inflation: 7.3, unemployment: 4.0, debtToGdp: 101.0, tradeBalance: -3.1 },
  { iso: 'ITA', name: 'Italie', gini: 34.8, pibGrowth: 0.7, inflation: 5.9, unemployment: 7.6, debtToGdp: 137.3, tradeBalance: 0.3 },
  { iso: 'ESP', name: 'Espagne', gini: 33.0, pibGrowth: 2.5, inflation: 3.5, unemployment: 12.1, debtToGdp: 107.7, tradeBalance: -3.2 },
  { iso: 'NLD', name: 'Pays-Bas', gini: 28.5, pibGrowth: 0.1, inflation: 4.1, unemployment: 3.6, debtToGdp: 46.5, tradeBalance: 9.2 },
  { iso: 'SWE', name: 'Suede', gini: 28.8, pibGrowth: -0.1, inflation: 5.9, unemployment: 7.7, debtToGdp: 31.2, tradeBalance: 4.8 },
  { iso: 'DNK', name: 'Danemark', gini: 27.7, pibGrowth: 1.9, inflation: 3.4, unemployment: 5.1, debtToGdp: 29.3, tradeBalance: 11.2 },
  { iso: 'NOR', name: 'Norvege', gini: 27.6, pibGrowth: 0.5, inflation: 5.5, unemployment: 3.6, debtToGdp: 42.3, tradeBalance: 17.5 },
  { iso: 'POL', name: 'Pologne', gini: 29.7, pibGrowth: 0.2, inflation: 11.4, unemployment: 2.8, debtToGdp: 49.3, tradeBalance: -1.0 },

  // Ameriques
  { iso: 'USA', name: 'Etats-Unis', gini: 39.8, pibGrowth: 2.5, inflation: 4.1, unemployment: 3.6, debtToGdp: 123.3, tradeBalance: -3.0 },
  { iso: 'CAN', name: 'Canada', gini: 33.3, pibGrowth: 1.2, inflation: 3.9, unemployment: 5.4, debtToGdp: 106.4, tradeBalance: -0.5 },
  { iso: 'MEX', name: 'Mexique', gini: 45.4, pibGrowth: 3.2, inflation: 5.5, unemployment: 2.8, debtToGdp: 53.3, tradeBalance: -1.4 },
  { iso: 'BRA', name: 'Bresil', gini: 52.9, pibGrowth: 2.9, inflation: 4.6, unemployment: 7.9, debtToGdp: 74.4, tradeBalance: 1.4 },
  { iso: 'ARG', name: 'Argentine', gini: 42.3, pibGrowth: -1.6, inflation: 133.5, unemployment: 6.2, debtToGdp: 89.5, tradeBalance: -1.8 },

  // Asie-Pacifique
  { iso: 'CHN', name: 'Chine', gini: 38.2, pibGrowth: 5.2, inflation: 0.2, unemployment: 5.2, debtToGdp: 83.6, tradeBalance: 2.2 },
  { iso: 'JPN', name: 'Japon', gini: 32.9, pibGrowth: 1.9, inflation: 3.3, unemployment: 2.6, debtToGdp: 255.2, tradeBalance: -1.8 },
  { iso: 'KOR', name: 'Coree du Sud', gini: 31.4, pibGrowth: 1.4, inflation: 3.6, unemployment: 2.7, debtToGdp: 54.3, tradeBalance: 1.9 },
  { iso: 'IND', name: 'Inde', gini: 35.7, pibGrowth: 7.8, inflation: 5.4, unemployment: 7.7, debtToGdp: 81.0, tradeBalance: -2.1 },
  { iso: 'AUS', name: 'Australie', gini: 34.3, pibGrowth: 2.0, inflation: 5.6, unemployment: 3.7, debtToGdp: 51.6, tradeBalance: 2.1 },
  { iso: 'IDN', name: 'Indonesie', gini: 37.9, pibGrowth: 5.1, inflation: 3.7, unemployment: 5.3, debtToGdp: 39.0, tradeBalance: 0.7 },
  { iso: 'THA', name: 'Thailande', gini: 34.9, pibGrowth: 1.9, inflation: 1.2, unemployment: 1.0, debtToGdp: 61.7, tradeBalance: 1.5 },
  { iso: 'VNM', name: 'Vietnam', gini: 36.8, pibGrowth: 5.1, inflation: 3.3, unemployment: 2.3, debtToGdp: 37.0, tradeBalance: 2.8 },

  // Moyen-Orient et Afrique
  { iso: 'RUS', name: 'Russie', gini: 36.0, pibGrowth: 3.6, inflation: 5.3, unemployment: 3.2, debtToGdp: 18.9, tradeBalance: 6.8 },
  { iso: 'TUR', name: 'Turquie', gini: 44.4, pibGrowth: 4.5, inflation: 53.9, unemployment: 9.4, debtToGdp: 35.0, tradeBalance: -5.5 },
  { iso: 'ZAF', name: 'Afrique du Sud', gini: 63.0, pibGrowth: 0.7, inflation: 6.1, unemployment: 32.9, debtToGdp: 72.2, tradeBalance: -0.6 },
  { iso: 'NGA', name: 'Nigeria', gini: 35.1, pibGrowth: 2.9, inflation: 24.7, unemployment: 4.2, debtToGdp: 38.8, tradeBalance: -0.2 },
  { iso: 'EGY', name: 'Egypte', gini: 31.5, pibGrowth: 3.8, inflation: 33.9, unemployment: 7.0, debtToGdp: 92.7, tradeBalance: -7.4 },
  { iso: 'SAU', name: 'Arabie saoudite', gini: 45.9, pibGrowth: -0.8, inflation: 2.3, unemployment: 4.7, debtToGdp: 26.2, tradeBalance: 9.7 },
  { iso: 'ARE', name: 'Emirats arabes unis', gini: 32.5, pibGrowth: 3.4, inflation: 3.1, unemployment: 2.9, debtToGdp: 30.3, tradeBalance: 15.2 },
];

// Mapping ISO alpha-3 to numeric codes (used in world-atlas topojson)
export const isoToNumeric: Record<string, string> = {
  FRA: '250', DEU: '276', GBR: '826', ITA: '380', ESP: '724',
  NLD: '528', SWE: '752', DNK: '208', NOR: '578', POL: '616',
  USA: '840', CAN: '124', MEX: '484', BRA: '076', ARG: '032',
  CHN: '156', JPN: '392', KOR: '410', IND: '356', AUS: '036',
  IDN: '360', THA: '764', VNM: '704',
  RUS: '643', TUR: '792', ZAF: '710', NGA: '566', EGY: '818',
  SAU: '682', ARE: '784',
};

// Reverse mapping: numeric to ISO alpha-3
export const numericToIso: Record<string, string> = Object.fromEntries(
  Object.entries(isoToNumeric).map(([iso, num]) => [num, iso])
);
