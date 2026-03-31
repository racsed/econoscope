export interface GlossaryTerm {
  term: string;
  definition: string;
  relatedModules: string[];
  category: string;
}

export const glossary: GlossaryTerm[] = [
  {
    term: 'PIB (Produit Interieur Brut)',
    definition:
      'Valeur totale des biens et services finaux produits sur le territoire d\'un pays au cours d\'une periode donnee (generalement un an). C\'est l\'indicateur le plus utilise pour mesurer la richesse nationale et la croissance economique.',
    relatedModules: ['multiplicateur-keynesien', 'ad-as', 'carre-magique-kaldor', 'is-lm'],
    category: 'Macroeconomie',
  },
  {
    term: 'Inflation',
    definition:
      'Hausse generalisee et durable du niveau general des prix. Elle reduit le pouvoir d\'achat de la monnaie. On la mesure generalement par l\'indice des prix a la consommation (IPC).',
    relatedModules: ['courbe-de-phillips', 'carre-magique-kaldor', 'ad-as', 'creation-monetaire'],
    category: 'Macroeconomie',
  },
  {
    term: 'Chomage',
    definition:
      'Situation d\'une personne en age de travailler, sans emploi, disponible et en recherche active d\'emploi. Le taux de chomage est le rapport entre le nombre de chomeurs et la population active.',
    relatedModules: ['courbe-de-phillips', 'carre-magique-kaldor', 'ad-as'],
    category: 'Macroeconomie',
  },
  {
    term: 'Taux d\'interet',
    definition:
      'Prix de l\'emprunt ou remuneration de l\'epargne, exprime en pourcentage du capital. Le taux directeur fixe par la banque centrale influence l\'ensemble des taux de l\'economie.',
    relatedModules: ['is-lm', 'creation-monetaire', 'multiplicateur-keynesien'],
    category: 'Monnaie et finance',
  },
  {
    term: 'Politique monetaire',
    definition:
      'Ensemble des actions de la banque centrale visant a reguler la quantite de monnaie en circulation et le niveau des taux d\'interet. Elle peut etre expansionniste (baisse des taux) ou restrictive (hausse des taux).',
    relatedModules: ['is-lm', 'creation-monetaire', 'courbe-de-phillips', 'ad-as'],
    category: 'Monnaie et finance',
  },
  {
    term: 'Politique budgetaire',
    definition:
      'Utilisation du budget de l\'Etat (depenses publiques et impots) pour influencer l\'activite economique. Une politique expansionniste augmente les depenses ou baisse les impots, une politique restrictive fait l\'inverse.',
    relatedModules: ['is-lm', 'multiplicateur-keynesien', 'courbe-de-laffer', 'ad-as'],
    category: 'Politique economique',
  },
  {
    term: 'Multiplicateur',
    definition:
      'Mecanisme par lequel une variation initiale de depenses entraine une variation plus que proportionnelle du revenu national. Le multiplicateur keynesien depend de la propension marginale a consommer.',
    relatedModules: ['multiplicateur-keynesien', 'is-lm'],
    category: 'Macroeconomie',
  },
  {
    term: 'Elasticite',
    definition:
      'Mesure de la sensibilite d\'une variable par rapport a une autre. L\'elasticite-prix de la demande mesure la variation en pourcentage de la quantite demandee en reponse a une variation de 1 % du prix.',
    relatedModules: ['elasticite-prix', 'offre-et-demande', 'courbe-de-laffer'],
    category: 'Microeconomie',
  },
  {
    term: 'Equilibre de marche',
    definition:
      'Situation ou la quantite offerte egale la quantite demandee. Le prix d\'equilibre est celui qui "vide" le marche : aucun agent n\'a interet a modifier son comportement.',
    relatedModules: ['offre-et-demande', 'ad-as'],
    category: 'Microeconomie',
  },
  {
    term: 'Offre agregee',
    definition:
      'Quantite totale de biens et services que l\'ensemble des entreprises d\'une economie sont disposees a produire pour chaque niveau de prix. A court terme, la courbe AS est croissante ; a long terme, elle est verticale au niveau du PIB potentiel.',
    relatedModules: ['ad-as'],
    category: 'Macroeconomie',
  },
  {
    term: 'Demande agregee',
    definition:
      'Quantite totale de biens et services demandes dans une economie pour chaque niveau de prix. Elle comprend la consommation, l\'investissement, les depenses publiques et les exportations nettes. La courbe AD est decroissante.',
    relatedModules: ['ad-as', 'is-lm', 'multiplicateur-keynesien'],
    category: 'Macroeconomie',
  },
  {
    term: 'Modele IS-LM',
    definition:
      'Modele macroeconomique de Hicks-Hansen representant l\'equilibre simultane sur le marche des biens (courbe IS) et le marche de la monnaie (courbe LM). Il determine le revenu national et le taux d\'interet d\'equilibre.',
    relatedModules: ['is-lm'],
    category: 'Macroeconomie',
  },
  {
    term: 'Courbe de Phillips',
    definition:
      'Relation empirique inverse entre le taux d\'inflation et le taux de chomage, observee par A.W. Phillips en 1958. A long terme, la plupart des economistes considerent que cette relation disparait : la courbe est verticale au NAIRU.',
    relatedModules: ['courbe-de-phillips'],
    category: 'Macroeconomie',
  },
  {
    term: 'NAIRU',
    definition:
      'Non-Accelerating Inflation Rate of Unemployment. Taux de chomage en dessous duquel l\'inflation tend a s\'accelerer. C\'est le taux de chomage "naturel" compatible avec une inflation stable.',
    relatedModules: ['courbe-de-phillips', 'ad-as'],
    category: 'Macroeconomie',
  },
  {
    term: 'Coefficient de Gini',
    definition:
      'Indicateur synthetique d\'inegalite compris entre 0 (egalite parfaite) et 1 (inegalite maximale). Il correspond a l\'aire entre la courbe de Lorenz et la diagonale d\'egalite, rapportee a l\'aire totale sous la diagonale.',
    relatedModules: ['courbe-de-lorenz-gini'],
    category: 'Inegalites',
  },
  {
    term: 'Courbe de Lorenz',
    definition:
      'Representation graphique de la repartition des revenus (ou du patrimoine). L\'axe horizontal porte les parts cumulees de la population (du plus pauvre au plus riche), l\'axe vertical les parts cumulees du revenu. Plus la courbe s\'eloigne de la diagonale, plus les inegalites sont fortes.',
    relatedModules: ['courbe-de-lorenz-gini'],
    category: 'Inegalites',
  },
  {
    term: 'Masse monetaire',
    definition:
      'Quantite totale de monnaie en circulation dans une economie. On distingue M1 (billets, pieces, depots a vue), M2 (M1 + depots a terme < 2 ans) et M3 (M2 + titres negociables a court terme).',
    relatedModules: ['creation-monetaire', 'is-lm'],
    category: 'Monnaie et finance',
  },
  {
    term: 'Reserve obligatoire',
    definition:
      'Fraction des depots que les banques commerciales sont tenues de conserver aupres de la banque centrale. C\'est un instrument de politique monetaire qui limite la creation de monnaie par le credit.',
    relatedModules: ['creation-monetaire'],
    category: 'Monnaie et finance',
  },
  {
    term: 'Effet d\'eviction',
    definition:
      'Phenomene par lequel une hausse des depenses publiques provoque une hausse du taux d\'interet, qui reduit l\'investissement prive. Dans le modele IS-LM, l\'effet d\'eviction est total dans le cas classique et nul en trappe a liquidite.',
    relatedModules: ['is-lm', 'multiplicateur-keynesien'],
    category: 'Macroeconomie',
  },
  {
    term: 'Externalite',
    definition:
      'Effet positif ou negatif de l\'activite d\'un agent economique sur le bien-etre d\'un tiers, sans que cet effet soit compense par le marche. La pollution est une externalite negative ; la vaccination une externalite positive.',
    relatedModules: ['offre-et-demande'],
    category: 'Microeconomie',
  },
  {
    term: 'Bien public',
    definition:
      'Bien non rival (la consommation par un agent ne reduit pas celle des autres) et non excluable (on ne peut empecher quiconque d\'en beneficier). Exemples : eclairage public, defense nationale. Le marche ne les produit pas en quantite optimale.',
    relatedModules: ['offre-et-demande'],
    category: 'Microeconomie',
  },
  {
    term: 'Avantage comparatif',
    definition:
      'Un pays possede un avantage comparatif dans la production d\'un bien s\'il peut le produire a un cout d\'opportunite plus faible que ses partenaires commerciaux. Theorise par David Ricardo, ce concept fonde le libre-echange.',
    relatedModules: [],
    category: 'Economie internationale',
  },
  {
    term: 'Cout marginal',
    definition:
      'Cout supplementaire engendre par la production d\'une unite additionnelle d\'un bien. En concurrence parfaite, les entreprises fixent leur prix au niveau du cout marginal.',
    relatedModules: ['offre-et-demande', 'elasticite-prix'],
    category: 'Microeconomie',
  },
  {
    term: 'Utilite marginale',
    definition:
      'Satisfaction supplementaire procuree par la consommation d\'une unite additionnelle d\'un bien. L\'utilite marginale est generalement decroissante : chaque unite supplementaire apporte moins de satisfaction que la precedente.',
    relatedModules: ['offre-et-demande', 'elasticite-prix'],
    category: 'Microeconomie',
  },
  {
    term: 'Surplus du consommateur',
    definition:
      'Difference entre le prix maximum qu\'un consommateur est dispose a payer et le prix qu\'il paie effectivement. Graphiquement, c\'est l\'aire entre la courbe de demande et la ligne de prix, au-dessus du prix d\'equilibre.',
    relatedModules: ['offre-et-demande', 'elasticite-prix'],
    category: 'Microeconomie',
  },
  {
    term: 'Perte seche',
    definition:
      'Reduction du surplus total (consommateur + producteur) due a une distorsion du marche (taxe, monopole, prix plancher ou plafond). C\'est le cout social net de l\'intervention, qui ne profite a personne.',
    relatedModules: ['offre-et-demande', 'courbe-de-laffer'],
    category: 'Microeconomie',
  },
  {
    term: 'Stagflation',
    definition:
      'Situation combinant stagnation economique (faible croissance, chomage eleve) et inflation elevee. Observee dans les annees 1970 apres les chocs petroliers, elle contredit la courbe de Phillips simple.',
    relatedModules: ['courbe-de-phillips', 'ad-as', 'carre-magique-kaldor'],
    category: 'Macroeconomie',
  },
  {
    term: 'Trappe a liquidite',
    definition:
      'Situation ou le taux d\'interet est si bas que la politique monetaire devient inefficace : les agents preferent conserver la monnaie plutot que d\'acheter des obligations. Theorisee par Keynes, cette situation a ete observee au Japon dans les annees 1990 et en zone euro apres 2014.',
    relatedModules: ['is-lm', 'creation-monetaire'],
    category: 'Monnaie et finance',
  },
  {
    term: 'Propension marginale a consommer',
    definition:
      'Part de chaque euro de revenu supplementaire qui est consacree a la consommation (le reste etant epargne). Si la PMC est de 0,8, chaque euro de revenu supplementaire genere 80 centimes de consommation. Elle determine la valeur du multiplicateur keynesien.',
    relatedModules: ['multiplicateur-keynesien', 'is-lm'],
    category: 'Macroeconomie',
  },
  {
    term: 'Assiette fiscale',
    definition:
      'Base sur laquelle est calcule l\'impot. Pour l\'impot sur le revenu, c\'est le revenu imposable. La courbe de Laffer montre que l\'assiette fiscale peut se reduire si le taux d\'imposition est trop eleve (desincitation, evasion).',
    relatedModules: ['courbe-de-laffer'],
    category: 'Fiscalite',
  },
  {
    term: 'Courbe de Laffer',
    definition:
      'Relation en cloche entre le taux d\'imposition et les recettes fiscales. A un taux de 0 % et de 100 %, les recettes sont nulles. Il existe un taux optimal qui maximise les recettes. Au-dela, toute hausse d\'impot reduit les recettes.',
    relatedModules: ['courbe-de-laffer'],
    category: 'Fiscalite',
  },
  {
    term: 'Carre magique de Kaldor',
    definition:
      'Representation graphique sur quatre axes des quatre grands objectifs de la politique economique : croissance (PIB), plein emploi (chomage bas), stabilite des prix (inflation faible) et equilibre exterieur (balance commerciale). Plus le quadrilatere est grand, meilleure est la performance.',
    relatedModules: ['carre-magique-kaldor'],
    category: 'Macroeconomie',
  },
  {
    term: 'Balance commerciale',
    definition:
      'Difference entre la valeur des exportations et des importations de biens et services d\'un pays. Un excedent signifie que le pays exporte plus qu\'il n\'importe. Un deficit signifie l\'inverse.',
    relatedModules: ['carre-magique-kaldor'],
    category: 'Economie internationale',
  },
  {
    term: 'Multiplicateur de credit',
    definition:
      'Mecanisme par lequel le systeme bancaire cree de la monnaie scripturale a partir d\'un depot initial. Si le taux de reserves obligatoires est de 10 %, un depot de 100 euros peut theoriquement generer 1 000 euros de monnaie au total.',
    relatedModules: ['creation-monetaire'],
    category: 'Monnaie et finance',
  },
  {
    term: 'Deflation',
    definition:
      'Baisse generalisee et durable du niveau general des prix. Elle peut provoquer un cercle vicieux : les agents reportent leurs achats en anticipant des prix plus bas, ce qui reduit la demande et accentue la baisse des prix.',
    relatedModules: ['courbe-de-phillips', 'ad-as', 'creation-monetaire'],
    category: 'Macroeconomie',
  },
];

export function getTermByName(term: string): GlossaryTerm | undefined {
  return glossary.find(
    (g) => g.term.toLowerCase().includes(term.toLowerCase())
  );
}

export function getTermsByCategory(category: string): GlossaryTerm[] {
  return glossary.filter((g) => g.category === category);
}

export function getTermsByModule(moduleSlug: string): GlossaryTerm[] {
  return glossary.filter((g) => g.relatedModules.includes(moduleSlug));
}

export function getGlossaryCategories(): string[] {
  return [...new Set(glossary.map((g) => g.category))];
}
