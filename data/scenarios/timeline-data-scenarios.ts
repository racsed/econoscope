export interface TimelineDataScenario {
  id: string;
  title: string;
  description: string;
  annee: number;
  indicateur: 'pib_croissance' | 'inflation' | 'chomage' | 'dette_publique';
  explanation: string;
}

export const timelineDataScenarios: TimelineDataScenario[] = [
  {
    id: 'trente-glorieuses',
    title: 'Les Trente Glorieuses (1968)',
    description: "L'age d'or de l'economie francaise : croissance soutenue, plein emploi et modernisation rapide.",
    annee: 1968,
    indicateur: 'pib_croissance',
    explanation:
      "Entre 1945 et 1973, la France connait une croissance annuelle moyenne de 5%, portee par l'industrialisation, l'exode rural et la reconstruction. En 1968, la croissance depasse 5%, le chomage est quasi inexistant et le pouvoir d'achat des menages progresse rapidement. C'est la periode la plus prospere de l'histoire economique francaise contemporaine.",
  },
  {
    id: 'choc-petrolier',
    title: 'Le premier choc petrolier (1975)',
    description: "Le quadruplement du prix du petrole met fin aux Trente Glorieuses et provoque la stagflation.",
    annee: 1975,
    indicateur: 'inflation',
    explanation:
      "L'embargo de l'OPEP en 1973 fait quadrupler le prix du petrole. L'inflation depasse 13% en 1974 tandis que la croissance devient negative en 1975 (-1%). C'est la decouverte de la stagflation : inflation et chomage augmentent simultanement, contredisant la courbe de Phillips traditionnelle. Le modele de croissance des Trente Glorieuses est brise.",
  },
  {
    id: 'mitterrand',
    title: 'Le tournant de la rigueur (1983)',
    description: "Mitterrand abandonne la relance keynesienne au profit de la desinflation competitive.",
    annee: 1983,
    indicateur: 'chomage',
    explanation:
      "Apres deux ans de politique de relance (1981-1982) qui ont aggrave le deficit exterieur et affaibli le franc, le gouvernement opte pour la rigueur. L'objectif est de reduire l'inflation pour maintenir la parite franc-mark dans le SME. Le chomage depasse 8% et continuera de monter pendant toute la decennie. La desinflation est un succes (l'inflation passe de 14% a 3%), mais au prix d'un chomage de masse durable.",
  },
  {
    id: 'crise-2008',
    title: 'La Grande Recession (2009)',
    description: "La crise financiere mondiale provoque la pire recession depuis 1945.",
    annee: 2009,
    indicateur: 'pib_croissance',
    explanation:
      "La faillite de Lehman Brothers en septembre 2008 declenche une crise financiere mondiale. Le PIB francais recule de 2.9% en 2009, du jamais vu depuis la Seconde Guerre mondiale. Le chomage bondit, la dette publique passe de 68% a 83% du PIB en un an sous l'effet des plans de relance et de la chute des recettes fiscales. La BCE abaisse ses taux a 1% et commence a injecter massivement des liquidites.",
  },
  {
    id: 'covid',
    title: 'Le choc COVID-19 (2020)',
    description: "Les confinements provoquent une chute du PIB de 7.9%, un record historique.",
    annee: 2020,
    indicateur: 'pib_croissance',
    explanation:
      "La pandemie de COVID-19 et les confinements successifs provoquent un choc d'offre et de demande inedit. Le PIB francais chute de 7.9%, un record en temps de paix. Le 'quoi qu'il en coute' du president Macron fait exploser la dette de 98% a 115% du PIB. Le chomage partiel touche 12 millions de salaries, limitant la hausse du chomage officiel. Le rebond de 2021 (+6.8%) est spectaculaire mais laisse des sequelles durables sur les finances publiques.",
  },
  {
    id: 'today',
    title: "La France en 2024",
    description: "Croissance moderee, dette elevee et defi de la reindustrialisation.",
    annee: 2024,
    indicateur: 'dette_publique',
    explanation:
      "En 2024, l'economie francaise croit de 1.1%, l'inflation redescend a 2.2% et le chomage reste a 7.3%. Mais la dette publique, a 112% du PIB, reste a un niveau historiquement eleve. Le triple defi de la France est de reduire sa dette, maintenir sa competitivite face a la concurrence mondiale et financer la transition ecologique. L'ecart de taux avec l'Allemagne (spread) se creuse, signe de la nervosité des marches face a la trajectoire budgetaire francaise.",
  },
];
