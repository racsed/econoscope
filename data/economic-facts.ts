export interface EconomicFact {
  id: string;
  title: string;
  year: string;
  summary: string;
  detail: string;
  moduleSlug: string;
  scenarioValues: Record<string, number | boolean | string>;
  category: 'crise' | 'politique' | 'commerce' | 'monetaire' | 'social';
  icon: string;
}

export const economicFacts: EconomicFact[] = [
  // Crises
  {
    id: 'choc-petrolier-1973',
    title: 'Premier choc petrolier',
    year: '1973',
    summary: "Le prix du petrole quadruple suite a l'embargo de l'OPEP, provoquant inflation et recession simultanees.",
    detail: "En octobre 1973, les pays de l'OPEP decident un embargo petrolier en represailles au soutien occidental a Israel. Le prix du baril passe de 3$ a 12$ en quelques mois. C'est la fin des Trente Glorieuses : pour la premiere fois, les economies occidentales connaissent la stagflation -- inflation et chomage augmentent simultanement, contredisant la courbe de Phillips traditionnelle.",
    moduleSlug: 'ad-as',
    scenarioValues: { depenses_publiques: 200, offre_monnaie: 600, prix_petrole: 200, productivite: 100, salaire_nominal: 120 },
    category: 'crise',
    icon: 'Flame',
  },
  {
    id: 'stagflation-1975',
    title: 'La stagflation des annees 70',
    year: '1974-1982',
    summary: "Inflation a deux chiffres et chomage en hausse : la courbe de Phillips semble brisee.",
    detail: "Apres le choc petrolier, les economies occidentales decouvrent que l'inflation peut coexister avec le chomage. En France, l'inflation depasse 13% en 1974 tandis que le chomage double. Milton Friedman avait predit ce phenomene : a long terme, la courbe de Phillips est verticale au taux de chomage naturel (NAIRU). Tenter de reduire le chomage sous ce seuil ne fait qu'accelerer l'inflation.",
    moduleSlug: 'courbe-de-phillips',
    scenarioValues: { nairu: 6, anticipations_inflation: 8, choc_offre: 4, version_augmentee: true, mode_long_terme: false },
    category: 'crise',
    icon: 'TrendingDown',
  },
  {
    id: 'desinflation-volcker-1980',
    title: 'Le choc Volcker',
    year: '1979-1982',
    summary: "Paul Volcker, president de la Fed, monte les taux a 20% pour briser l'inflation -- au prix d'une recession severe.",
    detail: "Face a une inflation de 13%, Paul Volcker decide une politique monetaire ultra-restrictive. Les taux d'interet atteignent 20% en juin 1981. L'inflation tombe de 13% a 3% en trois ans, mais le chomage depasse 10%. Le ratio de sacrifice (chomage supplementaire par point d'inflation elimine) est d'environ 2 -- chaque point d'inflation en moins a coute 2 points de chomage en plus.",
    moduleSlug: 'is-lm',
    scenarioValues: { depenses_publiques: 200, taux_imposition: 0.3, offre_monnaie: 300, niveau_prix: 2, investissement_autonome: 200, sensibilite_investissement: 40, sensibilite_monnaie: 50 },
    category: 'politique',
    icon: 'Landmark',
  },
  {
    id: 'relance-keynesian-2009',
    title: 'Plan de relance 2008-2009',
    year: '2009',
    summary: "Face a la crise financiere, les Etats injectent massivement : 787 milliards $ aux USA, 26 milliards EUR en France.",
    detail: "Apres la faillite de Lehman Brothers, l'economie mondiale plonge dans la pire recession depuis 1929. Les gouvernements appliquent la recette keynesienne : depenses publiques massives pour compenser l'effondrement de la demande privee. En France, avec une propension a consommer d'environ 0.8, un taux d'imposition de 0.3 et une propension a importer de 0.25, le multiplicateur effectif etait d'environ 1.3 -- chaque euro depense generait 1.30 EUR d'activite.",
    moduleSlug: 'multiplicateur-keynesien',
    scenarioValues: { propension_consommer: 0.8, depense_initiale: 26, taux_imposition: 0.3, propension_importer: 0.25, nb_tours: 20 },
    category: 'politique',
    icon: 'ArrowUpCircle',
  },
  {
    id: 'taxe-soda-france-2012',
    title: 'Taxe soda en France',
    year: '2012',
    summary: "L'introduction d'une taxe de 7.5 centimes par canette reduit la consommation de sodas d'environ 3.4%.",
    detail: "En 2012, la France introduit une taxe sur les boissons sucrees. Avec une elasticite-prix estimee a -0.4 pour les sodas (bien relativement inelastique car partiellement addictif), la hausse de prix de ~8% n'a reduit la consommation que de 3.4%. La recette fiscale a ete significative (environ 400M EUR/an) car la demande est inelastique : les consommateurs absorbent la majeure partie de la hausse.",
    moduleSlug: 'elasticite-prix',
    scenarioValues: { prix_initial: 1.5, elasticite: -0.4, variation_prix: 8 },
    category: 'politique',
    icon: 'CupSoda',
  },
  {
    id: 'inegalites-france-us',
    title: 'France vs Etats-Unis : le poids de la redistribution',
    year: '2023',
    summary: "Avant redistribution, les inegalites sont comparables. Apres, la France est nettement plus egalitaire (Gini 0.29 vs 0.39).",
    detail: "Les inegalites de revenu primaire (avant impots et transferts) sont proches entre la France et les Etats-Unis. C'est le systeme de redistribution qui fait la difference : l'impot progressif et les transferts sociaux (RSA, allocations, prime d'activite) reduisent le coefficient de Gini francais de 0.47 a 0.29, tandis que le systeme americain, moins redistributif, ne le reduit que de 0.51 a 0.39.",
    moduleSlug: 'courbe-de-lorenz-gini',
    scenarioValues: { preset: 1, transferts: 300 },
    category: 'social',
    icon: 'Scale',
  },
  {
    id: 'creation-monetaire-qe-bce',
    title: "Le Quantitative Easing de la BCE",
    year: '2015-2022',
    summary: "La BCE injecte 5 000 milliards d'euros de base monetaire -- mais le multiplicateur reste faible.",
    detail: "A partir de 2015, la BCE rachete massivement des obligations d'Etat pour injecter de la liquidite. Malgre l'explosion de la base monetaire, le multiplicateur de credit reste bien en-dessous de son potentiel theorique : les banques accumulent des reserves excedentaires plutot que de preter. Avec un taux de reserves effectif de ~15% (au lieu des 1% reglementaires) et une forte preference pour la liquidite, le multiplicateur tombe de 100 (theorique) a environ 6.",
    moduleSlug: 'creation-monetaire',
    scenarioValues: { depot_initial: 50000, taux_reserves: 15, taux_fuite_billets: 5, nb_tours: 20 },
    category: 'monetaire',
    icon: 'Banknote',
  },
  {
    id: 'courbe-laffer-france-ir',
    title: "Le debat sur la fiscalite optimale en France",
    year: '2013',
    summary: "La taxe a 75% sur les hauts revenus rapporte peu et pousse certains contribuables a l'exil fiscal.",
    detail: "En 2013, le gouvernement Hollande introduit une contribution exceptionnelle de 75% sur les revenus superieurs a 1M EUR. L'assiette fiscale se contracte (departs a l'etranger, optimisation), et la mesure ne rapporte que 260M EUR au lieu des 500M prevus. Avec une elasticite de l'assiette estimee a 0.5-0.8 pour les tres hauts revenus, le taux optimal se situerait autour de 55-67% selon les estimations -- bien en-dessous de 75%.",
    moduleSlug: 'courbe-de-laffer',
    scenarioValues: { taux_imposition: 75, elasticite_assiette: 0.7 },
    category: 'politique',
    icon: 'Receipt',
  },
  {
    id: 'depreciation-euro-2022',
    title: "La chute de l'euro face au dollar",
    year: '2022',
    summary: "L'euro passe sous la parite avec le dollar pour la premiere fois en 20 ans, revelant la crise energetique europeenne.",
    detail: "En 2022, la guerre en Ukraine et la crise energetique font chuter l'euro sous la parite (0.95 USD). Cette depreciation rend les importations d'energie (facturees en dollars) encore plus cheres, alimentant l'inflation. Cependant, les exportations europeennes gagnent en competitivite. La condition de Marshall-Lerner est satisfaite a moyen terme (elasticites export+import > 1), mais l'effet-J fait que le deficit commercial se creuse d'abord avant de s'ameliorer.",
    moduleSlug: 'taux-de-change',
    scenarioValues: { taux_change: 0.95, prix_domestiques: 110, prix_etrangers: 100, elasticite_export: 1.5, elasticite_import: 1.2 },
    category: 'commerce',
    icon: 'Euro',
  },
  {
    id: 'monopole-sncf',
    title: "L'ouverture a la concurrence du rail",
    year: '2020-2024',
    summary: "Le monopole historique de la SNCF se fissure : les premiers concurrents arrivent sur le TGV.",
    detail: "Pendant des decennies, la SNCF operait en monopole sur le transport ferroviaire de passagers. En situation de monopole, le prix est plus eleve et la quantite plus faible qu'en concurrence : la SNCF fixait ses tarifs bien au-dessus du cout marginal. L'ouverture progressive a la concurrence (Trenitalia sur Paris-Lyon en 2022) devrait theoriquement rapprocher les prix du cout marginal et augmenter le nombre de voyageurs, reduisant la perte seche.",
    moduleSlug: 'concurrence-monopole',
    scenarioValues: { demande_intercept: 150, pente_demande: 1, cout_marginal: 30, cout_fixe: 200, mode_monopole: true },
    category: 'politique',
    icon: 'Train',
  },
];

export function getFactsByCategory(category: EconomicFact['category']): EconomicFact[] {
  return economicFacts.filter(f => f.category === category);
}

export function getFactByModule(moduleSlug: string): EconomicFact[] {
  return economicFacts.filter(f => f.moduleSlug === moduleSlug);
}
