export interface ParcoursModule {
  slug: string;
  objective: string;
}

export interface Parcours {
  id: string;
  title: string;
  description: string;
  level: string;
  duration: string;
  modules: ParcoursModule[];
  icon: string;
  color: string;
}

export const parcoursList: Parcours[] = [
  {
    id: 'stmg-eco-gestion',
    title: 'STMG Economie-Gestion',
    description: 'Les fondamentaux economiques du programme STMG',
    level: 'Premiere/Terminale STMG',
    duration: '3h',
    modules: [
      { slug: 'offre-et-demande', objective: 'Comprendre la formation des prix' },
      { slug: 'elasticite-prix', objective: 'Mesurer la sensibilite de la demande' },
      { slug: 'multiplicateur-keynesien', objective: "L'effet des depenses publiques" },
      { slug: 'carre-magique-kaldor', objective: 'Evaluer la performance macroeconomique' },
      { slug: 'courbe-de-laffer', objective: 'Le debat sur la fiscalite' },
      { slug: 'fiscalite-redistribution', objective: 'Les outils de la redistribution' },
    ],
    icon: 'GraduationCap',
    color: '#5B5EF4',
  },
  {
    id: 'ses-terminale',
    title: 'SES Terminale',
    description: 'Preparer le bac : les grands mecanismes economiques',
    level: 'Terminale SES',
    duration: '4h',
    modules: [
      { slug: 'offre-et-demande', objective: 'Les mecanismes de marche' },
      { slug: 'multiplicateur-keynesien', objective: "Le role de l'Etat dans l'economie" },
      { slug: 'courbe-de-phillips', objective: 'La relation inflation-chomage' },
      { slug: 'is-lm', objective: "L'equilibre macroeconomique" },
      { slug: 'carre-magique-kaldor', objective: 'Analyser la conjoncture en 4 dimensions' },
      { slug: 'courbe-de-lorenz-gini', objective: 'Mesurer les inegalites' },
      { slug: 'creation-monetaire', objective: 'Le role des banques' },
    ],
    icon: 'BookOpen',
    color: '#8B5CF6',
  },
  {
    id: 'macro-l1',
    title: 'Macroeconomie L1',
    description: "Introduction a la macroeconomie universitaire",
    level: 'Licence 1',
    duration: '5h',
    modules: [
      { slug: 'multiplicateur-keynesien', objective: "L'analyse keynesienne de base" },
      { slug: 'is-lm', objective: "L'equilibre simultane biens-monnaie" },
      { slug: 'ad-as', objective: "L'offre et la demande agregees" },
      { slug: 'courbe-de-phillips', objective: 'Arbitrage inflation-chomage' },
      { slug: 'creation-monetaire', objective: 'Le multiplicateur de credit' },
      { slug: 'carre-magique-kaldor', objective: 'Les objectifs macroeconomiques' },
      { slug: 'donnees-historiques', objective: 'Contextualiser avec les donnees reelles' },
    ],
    icon: 'University',
    color: '#0EA5E9',
  },
  {
    id: 'micro-fondamentaux',
    title: 'Microeconomie fondamentale',
    description: "Les bases de l'analyse microeconomique",
    level: 'Accessible',
    duration: '2h30',
    modules: [
      { slug: 'offre-et-demande', objective: "L'equilibre de marche" },
      { slug: 'elasticite-prix', objective: 'La sensibilite au prix' },
      { slug: 'frontiere-possibilites-production', objective: "Les choix sous contrainte" },
      { slug: 'externalites', objective: 'Les defaillances de marche' },
      { slug: 'concurrence-monopole', objective: 'Les structures de marche' },
    ],
    icon: 'Target',
    color: '#10B981',
  },
  {
    id: 'commerce-international',
    title: 'Commerce international',
    description: 'Comprendre les echanges mondiaux',
    level: 'Intermediaire',
    duration: '2h',
    modules: [
      { slug: 'avantages-comparatifs', objective: 'La theorie de Ricardo' },
      { slug: 'taux-de-change', objective: 'Les monnaies et la competitivite' },
      { slug: 'carre-magique-kaldor', objective: "L'equilibre exterieur" },
      { slug: 'donnees-historiques', objective: "L'ouverture commerciale en France" },
    ],
    icon: 'Globe',
    color: '#F59E0B',
  },
  {
    id: 'inegalites-redistribution',
    title: 'Inegalites et redistribution',
    description: 'Mesurer et corriger les inegalites',
    level: 'Intermediaire',
    duration: '2h',
    modules: [
      { slug: 'courbe-de-lorenz-gini', objective: 'Quantifier les inegalites' },
      { slug: 'fiscalite-redistribution', objective: "L'impot redistributif" },
      { slug: 'courbe-de-laffer', objective: 'Les limites de la fiscalite' },
      { slug: 'donnees-historiques', objective: "L'evolution des inegalites en France" },
    ],
    icon: 'Scale',
    color: '#EC4899',
  },
  {
    id: 'dcg5-eco-contemporaine',
    title: 'DCG 5 - Economie contemporaine',
    description: "Parcours complet couvrant le programme officiel DCG UE5 Économie contemporaine. Fondements de l'activite economique, fonctionnement des marches, acteurs financiers, regulation publique, croissance et desequilibres sociaux.",
    level: 'DCG / Licence',
    duration: '8h',
    modules: [
      { slug: 'offre-et-demande', objective: 'Partie 2 - Mecanismes de formation des prix et equilibre de marche' },
      { slug: 'elasticite-prix', objective: 'Partie 2 - Sensibilite de la demande et comportement des agents' },
      { slug: 'concurrence-monopole', objective: 'Partie 2 - Structures de marche : concurrence, monopole, regulation (Walras, Pareto, Schumpeter, Hayek)' },
      { slug: 'externalites', objective: 'Partie 2 - Defaillances de marche : externalites, biens collectifs (Marshall, Pigou, Coase)' },
      { slug: 'frontiere-possibilites-production', objective: 'Partie 1 - Allocation des ressources et couts d\'opportunite' },
      { slug: 'creation-monetaire', objective: 'Partie 3 - Role des banques et des marches financiers, multiplicateur de credit' },
      { slug: 'multiplicateur-keynesien', objective: 'Partie 4 - Intervention economique de l\'Etat, politique budgetaire' },
      { slug: 'is-lm', objective: 'Partie 4 - Politique economique : equilibre marche des biens et de la monnaie' },
      { slug: 'ad-as', objective: 'Partie 4 - Regulation publique, offre et demande agregees' },
      { slug: 'carre-magique-kaldor', objective: 'Partie 5 - Mesurer la performance macroeconomique (croissance, emploi, prix, exterieur)' },
      { slug: 'donnees-historiques', objective: 'Partie 5 - Croissance economique : origines, potentiel et enjeux' },
      { slug: 'avantages-comparatifs', objective: 'Partie 5 - Ouverture internationale et croissance (Ricardo)' },
      { slug: 'taux-de-change', objective: 'Partie 5 - Commerce exterieur, competitivite et taux de change' },
      { slug: 'courbe-de-phillips', objective: 'Partie 6 - Desequilibres du marche du travail, relation inflation-chomage' },
      { slug: 'courbe-de-lorenz-gini', objective: 'Partie 6 - Inegalites sociales et pauvrete, mesure et analyse' },
      { slug: 'fiscalite-redistribution', objective: 'Partie 6 - Redistribution des revenus, politiques sociales' },
    ],
    icon: 'BookOpen',
    color: '#F97316',
  },
];

export function getParcoursById(id: string): Parcours | undefined {
  return parcoursList.find((p) => p.id === id);
}
