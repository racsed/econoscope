export interface PhillipsScenario {
  id: string;
  title: string;
  period: string;
  description: string;
  /** Points de données [chômage %, inflation %] */
  dataPoints: Array<{ year: number; unemployment: number; inflation: number }>;
  nairu: number | null;
  explanation: string;
}

export const phillipsScenarios: PhillipsScenario[] = [
  {
    id: 'années-60',
    title: 'Le compromis stable des années 1960',
    period: '1960-1969',
    description:
      'La relation inverse entre inflation et chômage semble stable et exploitable.',
    dataPoints: [
      { year: 1960, unemployment: 5.5, inflation: 1.5 },
      { year: 1961, unemployment: 6.7, inflation: 1.0 },
      { year: 1962, unemployment: 5.5, inflation: 1.2 },
      { year: 1963, unemployment: 5.7, inflation: 1.3 },
      { year: 1964, unemployment: 5.2, inflation: 1.3 },
      { year: 1965, unemployment: 4.5, inflation: 1.6 },
      { year: 1966, unemployment: 3.8, inflation: 3.0 },
      { year: 1967, unemployment: 3.8, inflation: 2.8 },
      { year: 1968, unemployment: 3.6, inflation: 4.2 },
      { year: 1969, unemployment: 3.5, inflation: 5.5 },
    ],
    nairu: null,
    explanation:
      'Dans les années 1960, la courbe de Phillips semblait offrir un compromis stable aux decideurs : accepter plus d\'inflation pour réduire le chômage, ou inversement. Ce modèle a guide les politiques keynesiennes de cette epoque.',
  },
  {
    id: 'stagflation-70s',
    title: 'La stagflation des années 1970',
    period: '1970-1982',
    description:
      'Les chocs pétroliers brisent la relation : inflation et chômage augmentent simultanément.',
    dataPoints: [
      { year: 1970, unemployment: 4.9, inflation: 5.7 },
      { year: 1971, unemployment: 5.9, inflation: 4.4 },
      { year: 1972, unemployment: 5.6, inflation: 3.2 },
      { year: 1973, unemployment: 4.9, inflation: 6.2 },
      { year: 1974, unemployment: 5.6, inflation: 11.0 },
      { year: 1975, unemployment: 8.5, inflation: 9.1 },
      { year: 1976, unemployment: 7.7, inflation: 5.8 },
      { year: 1977, unemployment: 7.1, inflation: 6.5 },
      { year: 1978, unemployment: 6.1, inflation: 7.6 },
      { year: 1979, unemployment: 5.8, inflation: 11.3 },
      { year: 1980, unemployment: 7.1, inflation: 13.5 },
      { year: 1981, unemployment: 7.6, inflation: 10.3 },
      { year: 1982, unemployment: 9.7, inflation: 6.1 },
    ],
    nairu: null,
    explanation:
      'Les chocs pétroliers de 1973 et 1979 ont provoque une stagflation : hausse simultanee de l\'inflation et du chômage. Friedman et Phelps avaient predit ce phénomène en distinguant la courbe de Phillips de court terme (qui se déplace) et l\'absence de compromis à long terme. Les anticipations d\'inflation jouent un rôle central.',
  },
  {
    id: 'désinflation-volcker',
    title: 'La désinflation Volcker',
    period: '1979-1986',
    description:
      'Paul Volcker, president de la Fed, impose une politique monétaire restrictive brutale.',
    dataPoints: [
      { year: 1979, unemployment: 5.8, inflation: 11.3 },
      { year: 1980, unemployment: 7.1, inflation: 13.5 },
      { year: 1981, unemployment: 7.6, inflation: 10.3 },
      { year: 1982, unemployment: 9.7, inflation: 6.1 },
      { year: 1983, unemployment: 9.6, inflation: 3.2 },
      { year: 1984, unemployment: 7.5, inflation: 4.3 },
      { year: 1985, unemployment: 7.2, inflation: 3.6 },
      { year: 1986, unemployment: 7.0, inflation: 1.9 },
    ],
    nairu: 6.0,
    explanation:
      'Paul Volcker a élevé les taux d\'intérêt au-dessus de 20 % pour briser les anticipations inflationnistes. Le coût a été une sévère récession avec un chômage a presque 10 %. Mais l\'inflation est passee de 13,5 % à moins de 2 %. Ce sacrifice illustre le "ratio de sacrifice" : le coût en chômage pour chaque point d\'inflation élimine.',
  },
  {
    id: 'phillips-morte-2010s',
    title: 'La courbe de Phillips est-elle morte ?',
    period: '2010-2023',
    description:
      'Le chômage baisse mais l\'inflation reste faible, puis bondit après le Covid.',
    dataPoints: [
      { year: 2010, unemployment: 9.6, inflation: 1.6 },
      { year: 2012, unemployment: 8.1, inflation: 2.1 },
      { year: 2014, unemployment: 6.2, inflation: 1.6 },
      { year: 2016, unemployment: 4.9, inflation: 1.3 },
      { year: 2018, unemployment: 3.9, inflation: 2.4 },
      { year: 2019, unemployment: 3.7, inflation: 1.8 },
      { year: 2020, unemployment: 8.1, inflation: 1.2 },
      { year: 2021, unemployment: 5.4, inflation: 4.7 },
      { year: 2022, unemployment: 3.6, inflation: 8.0 },
      { year: 2023, unemployment: 3.6, inflation: 4.1 },
    ],
    nairu: 4.0,
    explanation:
      'Depuis 2010, la relation entre chômage et inflation semble affaiblie, voire inexistante. Le chômage a fortement baisse aux États-Unis sans générer d\'inflation notable -- jusqu\'au choc post-Covid de 2021-2022. Ce retour brutal de l\'inflation relance le debat : la courbe de Phillips n\'est pas morte, mais elle est devenue non linéaire et très sensible aux chocs d\'offre.',
  },
];

export function getPhillipsScenario(id: string): PhillipsScenario | undefined {
  return phillipsScenarios.find((s) => s.id === id);
}
