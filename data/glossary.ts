export interface GlossaryTerm {
  term: string;
  definition: string;
  relatedModules: string[];
  category: string;
}

export const glossary: GlossaryTerm[] = [
  {
    term: 'PIB (Produit Intérieur Brut)',
    definition:
      'Valeur totale des biens et services finaux produits sur le territoire d\'un pays au cours d\'une période donnée (généralement un an). C\'est l\'indicateur le plus utilise pour mesurer la richesse nationale et la croissance économique.',
    relatedModules: ['multiplicateur-keynesien', 'ad-as', 'carré-magique-kaldor', 'is-lm'],
    category: 'Macroéconomie',
  },
  {
    term: 'Inflation',
    definition:
      'Hausse généralisée et durable du niveau général des prix. Elle réduit le pouvoir d\'achat de la monnaie. On la mesure généralement par l\'indice des prix à la consommation (IPC).',
    relatedModules: ['courbe-de-phillips', 'carré-magique-kaldor', 'ad-as', 'création-monétaire'],
    category: 'Macroéconomie',
  },
  {
    term: 'Chômage',
    definition:
      'Situation d\'une personne en age de travailler, sans emploi, disponible et en recherche active d\'emploi. Le taux de chômage est le rapport entre le nombre de chômeurs et la population active.',
    relatedModules: ['courbe-de-phillips', 'carré-magique-kaldor', 'ad-as'],
    category: 'Macroéconomie',
  },
  {
    term: 'Taux d\'intérêt',
    definition:
      'Prix de l\'emprunt ou rémunération de l\'épargne, exprimé en pourcentage du capital. Le taux directeur fixe par la banque centrale influence l\'ensemble des taux de l\'économie.',
    relatedModules: ['is-lm', 'création-monétaire', 'multiplicateur-keynesien'],
    category: 'Monnaie et finance',
  },
  {
    term: 'Politique monétaire',
    definition:
      'Ensemble des actions de la banque centrale visant a réguler la quantité de monnaie en circulation et le niveau des taux d\'intérêt. Elle peut etre expansionniste (baisse des taux) ou restrictive (hausse des taux).',
    relatedModules: ['is-lm', 'création-monétaire', 'courbe-de-phillips', 'ad-as'],
    category: 'Monnaie et finance',
  },
  {
    term: 'Politique budgétaire',
    definition:
      'Utilisation du budget de l\'État (dépenses publiques et impots) pour influencer l\'activité économique. Une politique expansionniste augmente les dépenses ou baisse les impots, une politique restrictive fait l\'inverse.',
    relatedModules: ['is-lm', 'multiplicateur-keynesien', 'courbe-de-laffer', 'ad-as'],
    category: 'Politique économique',
  },
  {
    term: 'Multiplicateur',
    definition:
      'Mécanisme par lequel une variation initiale de dépenses entraîne une variation plus que proportionnelle du revenu national. Le multiplicateur keynesien depend de la propension marginale à consommer.',
    relatedModules: ['multiplicateur-keynesien', 'is-lm'],
    category: 'Macroéconomie',
  },
  {
    term: 'Élasticité',
    definition:
      'Mesure de la sensibilite d\'une variable par rapport à une autre. L\'élasticité-prix de la demande mesure la variation en pourcentage de la quantité demandee en réponse à une variation de 1 % du prix.',
    relatedModules: ['élasticité-prix', 'offre-et-demande', 'courbe-de-laffer'],
    category: 'Microéconomie',
  },
  {
    term: 'Équilibre de marché',
    definition:
      'Situation ou la quantité offerte égale la quantité demandee. Le prix d\'équilibre est celui qui "vide" le marché : aucun agent n\'a intérêt a modifier son comportement.',
    relatedModules: ['offre-et-demande', 'ad-as'],
    category: 'Microéconomie',
  },
  {
    term: 'Offre agregee',
    definition:
      'Quantité totale de biens et services que l\'ensemble des entreprises d\'une économie sont disposées à produire pour chaque niveau de prix. A court terme, la courbe AS est croissante ; à long terme, elle est verticale au niveau du PIB potentiel.',
    relatedModules: ['ad-as'],
    category: 'Macroéconomie',
  },
  {
    term: 'Demande agregee',
    definition:
      'Quantité totale de biens et services demandes dans une économie pour chaque niveau de prix. Elle comprend la consommation, l\'investissement, les dépenses publiques et les exportations nettes. La courbe AD est décroissante.',
    relatedModules: ['ad-as', 'is-lm', 'multiplicateur-keynesien'],
    category: 'Macroéconomie',
  },
  {
    term: 'Modèle IS-LM',
    definition:
      'Modèle macroéconomique de Hicks-Hansen representant l\'équilibre simultane sur le marché des biens (courbe IS) et le marché de la monnaie (courbe LM). Il détermine le revenu national et le taux d\'intérêt d\'équilibre.',
    relatedModules: ['is-lm'],
    category: 'Macroéconomie',
  },
  {
    term: 'Courbe de Phillips',
    definition:
      'Relation empirique inverse entre le taux d\'inflation et le taux de chômage, observée par A.W. Phillips en 1958. A long terme, la plupart des economistes considerent que cette relation disparait : la courbe est verticale au NAIRU.',
    relatedModules: ['courbe-de-phillips'],
    category: 'Macroéconomie',
  },
  {
    term: 'NAIRU',
    definition:
      'Non-Accelerating Inflation Rate of Unemployment. Taux de chômage en dessous duquel l\'inflation tend a s\'accelerer. C\'est le taux de chômage "naturel" compatible avec une inflation stable.',
    relatedModules: ['courbe-de-phillips', 'ad-as'],
    category: 'Macroéconomie',
  },
  {
    term: 'Coefficient de Gini',
    definition:
      'Indicateur synthetique d\'inégalité compris entre 0 (égalité parfaite) et 1 (inégalité maximale). Il correspond a l\'aire entre la courbe de Lorenz et la diagonale d\'égalité, rapportee a l\'aire totale sous la diagonale.',
    relatedModules: ['courbe-de-lorenz-gini'],
    category: 'Inégalités',
  },
  {
    term: 'Courbe de Lorenz',
    definition:
      'Représentation graphique de la répartition des revenus (ou du patrimoine). L\'axe horizontal porte les parts cumulees de la population (du plus pauvre au plus riche), l\'axe vertical les parts cumulees du revenu. Plus la courbe s\'éloigne de la diagonale, plus les inégalités sont fortes.',
    relatedModules: ['courbe-de-lorenz-gini'],
    category: 'Inégalités',
  },
  {
    term: 'Masse monétaire',
    definition:
      'Quantité totale de monnaie en circulation dans une économie. On distingue M1 (billets, pieces, dépôts a vue), M2 (M1 + dépôts a terme < 2 ans) et M3 (M2 + titres négociables à court terme).',
    relatedModules: ['création-monétaire', 'is-lm'],
    category: 'Monnaie et finance',
  },
  {
    term: 'Reserve obligatoire',
    definition:
      'Fraction des dépôts que les banques commerciales sont tenues de conserver aupres de la banque centrale. C\'est un instrument de politique monétaire qui limite la création de monnaie par le credit.',
    relatedModules: ['création-monétaire'],
    category: 'Monnaie et finance',
  },
  {
    term: 'Effet d\'éviction',
    definition:
      'Phenomene par lequel une hausse des dépenses publiques provoque une hausse du taux d\'intérêt, qui réduit l\'investissement privé. Dans le modèle IS-LM, l\'effet d\'éviction est total dans le cas classique et nul en trappe a liquidite.',
    relatedModules: ['is-lm', 'multiplicateur-keynesien'],
    category: 'Macroéconomie',
  },
  {
    term: 'Externalite',
    definition:
      'Effet d\'une activité économique sur un tiers non implique dans la transaction. La pollution est une externalite négative ; la vaccination une externalite positive.',
    relatedModules: ['offre-et-demande', 'externalites'],
    category: 'Microéconomie',
  },
  {
    term: 'Bien public',
    definition:
      'Bien non rival et non excludable, comme la defense nationale ou l\'éclairage public. Le marché ne les produit pas en quantité optimale.',
    relatedModules: ['offre-et-demande', 'externalites'],
    category: 'Microéconomie',
  },
  {
    term: 'Avantage comparatif',
    definition:
      'Capacite d\'un pays à produire un bien à un coût d\'opportunité inférieur a celui d\'un autre pays. Théorisé par David Ricardo, ce concept fonde le libre-échange.',
    relatedModules: ['avantages-comparatifs'],
    category: 'Économie internationale',
  },
  {
    term: 'Coût marginal',
    definition:
      'Coût supplémentaire engendré par la production d\'une unite additionnelle d\'un bien. En concurrence parfaite, les entreprises fixent leur prix au niveau du coût marginal.',
    relatedModules: ['offre-et-demande', 'élasticité-prix'],
    category: 'Microéconomie',
  },
  {
    term: 'Utilite marginale',
    definition:
      'Satisfaction supplémentaire procurée par la consommation d\'une unite additionnelle d\'un bien. L\'utilite marginale est généralement décroissante : chaque unite supplémentaire apporte moins de satisfaction que la précédente.',
    relatedModules: ['offre-et-demande', 'élasticité-prix'],
    category: 'Microéconomie',
  },
  {
    term: 'Surplus du consommateur',
    definition:
      'Difference entre le prix maximum qu\'un consommateur est disposé à payer et le prix qu\'il paie effectivement. Graphiquement, c\'est l\'aire entre la courbe de demande et la ligne de prix, au-dessus du prix d\'équilibre.',
    relatedModules: ['offre-et-demande', 'élasticité-prix'],
    category: 'Microéconomie',
  },
  {
    term: 'Perte seche (deadweight loss)',
    definition:
      'Perte de bien-etre économique qui n\'est récupérée par aucun agent, résultant d\'une distorsion du marché (taxe, monopole, prix plancher ou plafond).',
    relatedModules: ['offre-et-demande', 'courbe-de-laffer', 'concurrence-monopole', 'externalites'],
    category: 'Microéconomie',
  },
  {
    term: 'Stagflation',
    definition:
      'Situation combinant stagnation économique (faible croissance, chômage élevé) et inflation élevée. Observée dans les années 1970 après les chocs petroliers, elle contredit la courbe de Phillips simple.',
    relatedModules: ['courbe-de-phillips', 'ad-as', 'carré-magique-kaldor'],
    category: 'Macroéconomie',
  },
  {
    term: 'Trappe a liquidite',
    definition:
      'Situation ou le taux d\'intérêt est si bas que la politique monétaire devient inefficace : les agents preferent conserver la monnaie plutot que d\'acheter des obligations. Théorisée par Keynes, cette situation a été observée au Japon dans les années 1990 et en zone euro après 2014.',
    relatedModules: ['is-lm', 'création-monétaire'],
    category: 'Monnaie et finance',
  },
  {
    term: 'Propension marginale à consommer',
    definition:
      'Part de chaque euro de revenu supplémentaire qui est consacree à la consommation (le reste etant épargne). Si la PMC est de 0,8, chaque euro de revenu supplémentaire génère 80 centimes de consommation. Elle détermine la valeur du multiplicateur keynesien.',
    relatedModules: ['multiplicateur-keynesien', 'is-lm'],
    category: 'Macroéconomie',
  },
  {
    term: 'Assiette fiscale',
    definition:
      'Base sur laquelle est calculé l\'impot. Pour l\'impot sur le revenu, c\'est le revenu imposable. La courbe de Laffer montre que l\'assiette fiscale peut se réduire si le taux d\'imposition est trop élevé (désincitation, évasion).',
    relatedModules: ['courbe-de-laffer'],
    category: 'Fiscalité',
  },
  {
    term: 'Courbe de Laffer',
    definition:
      'Relation en cloche entre le taux d\'imposition et les recettes fiscales. A un taux de 0 % et de 100 %, les recettes sont nulles. Il existe un taux optimal qui maximisé les recettes. Au-dela, toute hausse d\'impot réduit les recettes.',
    relatedModules: ['courbe-de-laffer'],
    category: 'Fiscalité',
  },
  {
    term: 'Carré magique de Kaldor',
    definition:
      'Représentation graphique sur quatre axes des quatre grands objectifs de la politique économique : croissance (PIB), plein emploi (chômage bas), stabilité des prix (inflation faible) et équilibre exterieur (balance commerciale). Plus le quadrilatere est grand, meilleure est la performance.',
    relatedModules: ['carré-magique-kaldor'],
    category: 'Macroéconomie',
  },
  {
    term: 'Balance commerciale',
    definition:
      'Difference entre la valeur des exportations et des importations de biens et services d\'un pays. Un excédent signifie que le pays exporte plus qu\'il n\'importe. Un déficit signifie l\'inverse.',
    relatedModules: ['carré-magique-kaldor'],
    category: 'Économie internationale',
  },
  {
    term: 'Multiplicateur de credit',
    definition:
      'Mécanisme par lequel le système bancaire crée de la monnaie scripturale à partir d\'un dépôt initial. Si le taux de reserves obligatoires est de 10 %, un dépôt de 100 euros peut theoriquement générer 1 000 euros de monnaie au total.',
    relatedModules: ['création-monétaire'],
    category: 'Monnaie et finance',
  },
  {
    term: 'Déflation',
    definition:
      'Baisse généralisée et durable du niveau général des prix. Elle peut provoquer un cercle vicieux : les agents reportent leurs achats en anticipant des prix plus bas, ce qui réduit la demande et accentue la baisse des prix.',
    relatedModules: ['courbe-de-phillips', 'ad-as', 'création-monétaire'],
    category: 'Macroéconomie',
  },
  {
    term: 'Frontiere des possibilites de production (FPP)',
    definition:
      'La courbe montrant les combinaisons maximales de deux biens qu\'une économie peut produire avec ses ressources disponibles.',
    relatedModules: ['frontiere-possibilites-production'],
    category: 'Microéconomie',
  },
  {
    term: 'Coût d\'opportunité',
    definition:
      'La valeur de la meilleure alternative sacrifiee lorsqu\'on fait un choix.',
    relatedModules: ['frontiere-possibilites-production'],
    category: 'Microéconomie',
  },
  {
    term: 'Avantage absolu',
    definition:
      'Capacite d\'un pays à produire un bien en utilisant moins de ressources qu\'un autre pays.',
    relatedModules: ['avantages-comparatifs'],
    category: 'Commerce international',
  },
  {
    term: 'Taxe pigouvienne',
    definition:
      'Taxe visant a corriger une externalite négative en internalisant le coût social dans le prix de marché.',
    relatedModules: ['externalites'],
    category: 'Microéconomie',
  },
  {
    term: 'Monopole',
    definition:
      'Structure de marché ou un seul producteur contrôle l\'ensemble de l\'offre d\'un bien sans substitut proche.',
    relatedModules: ['concurrence-monopole'],
    category: 'Microéconomie',
  },
  {
    term: 'Recette marginale',
    definition:
      'Supplement de recette obtenu par la vente d\'une unite supplémentaire. En monopole, elle est inférieure au prix.',
    relatedModules: ['concurrence-monopole'],
    category: 'Microéconomie',
  },
  {
    term: 'Taux de change réel',
    definition:
      'Taux de change nominal ajuste des niveaux de prix relatifs entre deux pays, mesurant la compétitivité-prix.',
    relatedModules: ['taux-de-change'],
    category: 'Commerce international',
  },
  {
    term: 'Condition de Marshall-Lerner',
    definition:
      'Une dévaluation ameliore la balance commerciale si la somme des elasticites export et import est supérieure a 1.',
    relatedModules: ['taux-de-change'],
    category: 'Commerce international',
  },
  {
    term: 'Impot progressif',
    definition:
      'Système fiscal ou le taux d\'imposition augmente avec le revenu. L\'impot sur le revenu en France est progressif.',
    relatedModules: ['fiscalité-redistribution', 'courbe-de-laffer'],
    category: 'Fiscalité',
  },
  {
    term: 'Taux effectif d\'imposition',
    definition:
      'Rapport entre l\'impot effectivement paye et le revenu total, qui differe du taux marginal en raison de la progressivité.',
    relatedModules: ['fiscalité-redistribution'],
    category: 'Fiscalité',
  },
  {
    term: 'Compétitivité-prix',
    definition:
      'Capacite d\'un pays à vendre ses produits à des prix inférieurs à ceux de ses concurrents, influencee par le taux de change et les coûts de production.',
    relatedModules: ['taux-de-change', 'avantages-comparatifs'],
    category: 'Commerce international',
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
