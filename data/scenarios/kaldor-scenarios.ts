export interface KaldorScenario {
  id: string;
  title: string;
  description: string;
  /** Taux de croissance du PIB réel (%) */
  growth: number;
  /** Taux de chômage (%) */
  unemployment: number;
  /** Taux d'inflation (%) */
  inflation: number;
  /** Solde de la balance commerciale (% du PIB) */
  tradeBalance: number;
  source: string;
  explanation: string;
}

export const kaldorScenarios: KaldorScenario[] = [
  {
    id: 'france-2023',
    title: 'France 2023',
    description: 'Une croissance atone avec une inflation en recul progressif.',
    growth: 0.7,
    unemployment: 7.1,
    inflation: 4.9,
    tradeBalance: -3.2,
    source: 'INSEE, Banque de France',
    explanation:
      'La France en 2023 presente un carré magique desequilibre : croissance faible, chômage encore élevé, inflation importante due aux effets retardes de la crise énergétique, et un déficit commercial structurel. Le carré est loin de la situation ideale sur les quatre axes.',
  },
  {
    id: 'allemagne-2023',
    title: 'Allemagne 2023',
    description: 'Une récession technique dans la première économie européenne.',
    growth: -0.3,
    unemployment: 3.0,
    inflation: 6.0,
    tradeBalance: 5.5,
    source: 'Destatis, Bundesbank',
    explanation:
      'L\'Allemagne illustre un profil atypique : un chômage très bas et un excédent commercial important, mais une récession et une inflation élevée. Le modèle industriel exportateur allemand est fragilise par la hausse des coûts energetiques après la fin du gaz russe bon marché.',
  },
  {
    id: 'france-1973',
    title: 'France 1973 (avant le choc pétrolier)',
    description: 'Les Trente Glorieuses touchent à leur fin avec des indicateurs encore favorables.',
    growth: 6.5,
    unemployment: 2.6,
    inflation: 7.1,
    tradeBalance: 0.5,
    source: 'INSEE, données historiques',
    explanation:
      'En 1973, la France bénéficie encore de la dynamique des Trente Glorieuses : forte croissance, quasi plein emploi et balance commerciale equilibree. Seule l\'inflation, déjà élevée, annonce les tensions a venir. Le carré magique est presque optimal, sauf sur l\'axe des prix.',
  },
  {
    id: 'france-1975',
    title: 'France 1975 (après le premier choc pétrolier)',
    description: 'La stagflation frappe l\'économie française de plein fouet.',
    growth: -1.0,
    unemployment: 4.0,
    inflation: 11.7,
    tradeBalance: -0.3,
    source: 'INSEE, données historiques',
    explanation:
      'Le premier choc pétrolier de 1973 produit ses effets pleins en 1975 : récession, montee du chômage et inflation à deux chiffres. Le contraste avec 1973 est saisissant. Le carré magique se déformé brutalement sur tous les axes, illustrant parfaitement la stagflation.',
  },
  {
    id: 'japon-1995',
    title: 'Japon 1995 (décennie perdue)',
    description: 'Le Japon s\'enlise dans la déflation après l\'eclatement de la bulle.',
    growth: 1.9,
    unemployment: 3.2,
    inflation: -0.1,
    tradeBalance: 2.1,
    source: 'Bank of Japan, Cabinet Office',
    explanation:
      'Le Japon des années 1990 presente un profil singulier : un chômage faible et un excédent commercial, mais une croissance molle et une inflation nulle voire négative. C\'est le debut de la "trappe a liquidité" japonaise. Le carré semble correct sur deux axes mais révèle une économie en panne.',
  },
  {
    id: 'chine-2019',
    title: 'Chine 2019 (avant le Covid)',
    description: 'La deuxieme économie mondiale avant la pandemie.',
    growth: 6.0,
    unemployment: 3.6,
    inflation: 2.9,
    tradeBalance: 1.0,
    source: 'National Bureau of Statistics of China',
    explanation:
      'La Chine en 2019 affiche un carré magique presque ideal : forte croissance, chômage bas, inflation maitrisee et excédent commercial. Cependant, ces chiffres officiels masquent des desequilibres structurels (endettement, surinvestissement immobilier) qui eclateront les années suivantes.',
  },
];

export function getKaldorScenario(id: string): KaldorScenario | undefined {
  return kaldorScenarios.find((s) => s.id === id);
}
