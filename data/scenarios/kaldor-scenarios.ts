export interface KaldorScenario {
  id: string;
  title: string;
  description: string;
  /** Taux de croissance du PIB reel (%) */
  growth: number;
  /** Taux de chomage (%) */
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
      'La France en 2023 presente un carre magique desequilibre : croissance faible, chomage encore eleve, inflation importante due aux effets retardes de la crise energetique, et un deficit commercial structurel. Le carre est loin de la situation ideale sur les quatre axes.',
  },
  {
    id: 'allemagne-2023',
    title: 'Allemagne 2023',
    description: 'Une recession technique dans la premiere economie europeenne.',
    growth: -0.3,
    unemployment: 3.0,
    inflation: 6.0,
    tradeBalance: 5.5,
    source: 'Destatis, Bundesbank',
    explanation:
      'L\'Allemagne illustre un profil atypique : un chomage tres bas et un excedent commercial important, mais une recession et une inflation elevee. Le modele industriel exportateur allemand est fragilise par la hausse des couts energetiques apres la fin du gaz russe bon marche.',
  },
  {
    id: 'france-1973',
    title: 'France 1973 (avant le choc petrolier)',
    description: 'Les Trente Glorieuses touchent a leur fin avec des indicateurs encore favorables.',
    growth: 6.5,
    unemployment: 2.6,
    inflation: 7.1,
    tradeBalance: 0.5,
    source: 'INSEE, donnees historiques',
    explanation:
      'En 1973, la France beneficie encore de la dynamique des Trente Glorieuses : forte croissance, quasi plein emploi et balance commerciale equilibree. Seule l\'inflation, deja elevee, annonce les tensions a venir. Le carre magique est presque optimal, sauf sur l\'axe des prix.',
  },
  {
    id: 'france-1975',
    title: 'France 1975 (apres le premier choc petrolier)',
    description: 'La stagflation frappe l\'economie francaise de plein fouet.',
    growth: -1.0,
    unemployment: 4.0,
    inflation: 11.7,
    tradeBalance: -0.3,
    source: 'INSEE, donnees historiques',
    explanation:
      'Le premier choc petrolier de 1973 produit ses effets pleins en 1975 : recession, montee du chomage et inflation a deux chiffres. Le contraste avec 1973 est saisissant. Le carre magique se deforme brutalement sur tous les axes, illustrant parfaitement la stagflation.',
  },
  {
    id: 'japon-1995',
    title: 'Japon 1995 (decennie perdue)',
    description: 'Le Japon s\'enlise dans la deflation apres l\'eclatement de la bulle.',
    growth: 1.9,
    unemployment: 3.2,
    inflation: -0.1,
    tradeBalance: 2.1,
    source: 'Bank of Japan, Cabinet Office',
    explanation:
      'Le Japon des annees 1990 presente un profil singulier : un chomage faible et un excedent commercial, mais une croissance molle et une inflation nulle voire negative. C\'est le debut de la "trappe a liquidite" japonaise. Le carre semble correct sur deux axes mais revele une economie en panne.',
  },
  {
    id: 'chine-2019',
    title: 'Chine 2019 (avant le Covid)',
    description: 'La deuxieme economie mondiale avant la pandemie.',
    growth: 6.0,
    unemployment: 3.6,
    inflation: 2.9,
    tradeBalance: 1.0,
    source: 'National Bureau of Statistics of China',
    explanation:
      'La Chine en 2019 affiche un carre magique presque ideal : forte croissance, chomage bas, inflation maitrisee et excedent commercial. Cependant, ces chiffres officiels masquent des desequilibres structurels (endettement, surinvestissement immobilier) qui eclateront les annees suivantes.',
  },
];

export function getKaldorScenario(id: string): KaldorScenario | undefined {
  return kaldorScenarios.find((s) => s.id === id);
}
