export interface GlossaryTerm {
  term: string;
  definition: string;
  relatedModules: string[];
  category: string;
}

export const glossary: GlossaryTerm[] = [
  // ═══════════════════════════════════════════════════════════════════════
  // MACROECONOMIE
  // ═══════════════════════════════════════════════════════════════════════
  {
    term: 'PIB (Produit Intérieur Brut)',
    definition:
      "Agrégat mesurant la valeur totale de la production de biens et services finaux réalisée sur le territoire économique d'un pays au cours d'une période donnée, généralement une année ou un trimestre. Selon la comptabilité nationale (base INSEE/SEC 2010), le PIB peut être calculé par trois approches équivalentes : l'approche production (somme des valeurs ajoutées brutes + impôts sur les produits - subventions sur les produits), l'approche revenu (rémunération des salariés + EBE + revenus mixtes + impôts nets sur la production et les importations), et l'approche demande (consommation finale + FBCF + variations de stocks + exportations - importations). Le PIB en volume (ou à prix constants) corrige l'effet de l'inflation pour mesurer la croissance réelle de la production. C'est l'indicateur de référence pour la croissance économique, bien qu'il ne mesure ni le bien-être, ni les inégalités, ni les dégradations environnementales - ce que la commission Stiglitz-Sen-Fitoussi (2009) a souligné.",
    relatedModules: ['multiplicateur-keynesien', 'ad-as', 'carre-magique-kaldor', 'is-lm', 'donnees-historiques'],
    category: 'Macroéconomie',
  },
  {
    term: 'Inflation',
    definition:
      "Hausse généralisée et durable du niveau général des prix, mesurée par la variation de l'indice des prix à la consommation (IPC) publié mensuellement par l'INSEE, ou par l'indice des prix à la consommation harmonisé (IPCH) au niveau européen (Eurostat). On distingue classiquement l'inflation par la demande (excès de demande globale sur l'offre disponible, analyse keynésienne), l'inflation par les coûts (hausse des coûts de production - salaires, matières premières, énergie - répercutée sur les prix de vente), et l'inflation monétaire (création excessive de monnaie selon la théorie quantitative de la monnaie, MV = PY, de Fisher puis Friedman). L'inflation réduit le pouvoir d'achat de la monnaie mais peut alléger le poids réel de la dette (effet favorisant les emprunteurs au détriment des créanciers). La BCE cible une inflation de 2 % à moyen terme pour la zone euro, considérant qu'un taux modéré facilite les ajustements de prix relatifs et éloigne le risque déflationniste.",
    relatedModules: ['courbe-de-phillips', 'carre-magique-kaldor', 'ad-as', 'creation-monetaire', 'donnees-historiques'],
    category: 'Macroéconomie',
  },
  {
    term: 'Chômage au sens du BIT',
    definition:
      "Selon la définition du Bureau International du Travail (BIT), adoptée par l'INSEE et Eurostat pour les comparaisons internationales, est chômeur toute personne en âge de travailler (15 ans ou plus) qui remplit simultanément trois critères : (1) être sans emploi, c'est-à-dire ne pas avoir travaillé ne serait-ce qu'une heure au cours de la semaine de référence ; (2) être disponible pour prendre un emploi dans les deux semaines ; (3) avoir entrepris des démarches actives de recherche d'emploi au cours des quatre dernières semaines ou avoir trouvé un emploi commençant dans les trois mois. Cette définition, plus restrictive que celle des demandeurs d'emploi inscrits à France Travail (ex-Pôle emploi), exclut notamment les personnes découragées (halo du chômage) et celles en sous-emploi (temps partiel subi). Le taux de chômage (nombre de chômeurs / population active x 100) est l'indicateur de référence du carré magique de Kaldor.",
    relatedModules: ['courbe-de-phillips', 'carre-magique-kaldor', 'ad-as', 'donnees-historiques'],
    category: 'Marché du travail',
  },
  {
    term: 'Taux d\'emploi, taux d\'activité, taux de chômage',
    definition:
      "Ces trois indicateurs du marché du travail mesurent des réalités distinctes et ne doivent pas être confondus. Le taux d'emploi rapporte le nombre de personnes en emploi à la population en âge de travailler (15-64 ans selon la convention européenne) : il mesure la capacité d'une économie à mobiliser sa main-d'oeuvre. Le taux d'activité rapporte la population active (personnes en emploi + chômeurs au sens du BIT) à la population en âge de travailler : il intègre donc aussi les chômeurs. Le taux de chômage rapporte le nombre de chômeurs au sens du BIT à la population active (et non à la population totale). En France en 2024, le taux d'emploi des 15-64 ans est d'environ 68 %, le taux d'activité de 73 % et le taux de chômage d'environ 7,3 % (INSEE). Ces distinctions sont essentielles pour comprendre que le taux de chômage peut baisser sans que l'emploi progresse, si des personnes sortent de la population active.",
    relatedModules: ['courbe-de-phillips', 'carre-magique-kaldor', 'donnees-historiques'],
    category: 'Marché du travail',
  },
  {
    term: 'Demande agrégée (AD)',
    definition:
      "Quantité totale de biens et services demandés dans une économie pour chaque niveau de prix. Elle se décompose en quatre composantes : la consommation finale des ménages (C), l'investissement des entreprises et des ménages (I, mesuré par la FBCF), les dépenses publiques (G) et les exportations nettes (X - M). La courbe AD est décroissante dans le plan (prix, production) en raison de trois effets : l'effet d'encaisse réelle (Pigou) - une baisse des prix augmente la valeur réelle de la monnaie détenue et stimule la consommation ; l'effet taux d'intérêt (Keynes) - une baisse des prix réduit la demande de monnaie et fait baisser le taux d'intérêt, stimulant l'investissement ; l'effet commerce extérieur (Mundell-Fleming) - une baisse des prix nationaux améliore la compétitivité-prix et stimule les exportations nettes. Un déplacement de la courbe AD vers la droite traduit une politique de relance (budgétaire ou monétaire).",
    relatedModules: ['ad-as', 'is-lm', 'multiplicateur-keynesien'],
    category: 'Macroéconomie',
  },
  {
    term: 'Offre agrégée (AS)',
    definition:
      "Quantité totale de biens et services que l'ensemble des entreprises d'une économie sont disposées à produire pour chaque niveau de prix. La distinction entre court terme et long terme est fondamentale. À court terme (SRAS), la courbe est croissante car les salaires nominaux sont rigides (contrats, négociations) : une hausse des prix augmente les profits et stimule la production. À long terme (LRAS), la courbe est verticale au niveau du PIB potentiel car tous les prix et salaires se sont ajustés : la production ne dépend plus que des facteurs structurels (capital, travail, productivité). Un choc d'offre négatif (hausse du prix du pétrole, catastrophe naturelle) déplace la courbe SRAS vers la gauche, provoquant simultanément inflation et récession - c'est le mécanisme de la stagflation observée lors des chocs pétroliers de 1973 et 1979.",
    relatedModules: ['ad-as'],
    category: 'Macroéconomie',
  },
  {
    term: 'Multiplicateur keynésien',
    definition:
      "Mécanisme théorisé par John Maynard Keynes (Théorie générale, 1936) selon lequel une variation initiale de la dépense autonome (investissement, dépenses publiques, exportations) entraîne une variation plus que proportionnelle du revenu national. Le multiplicateur k = 1/(1-c), où c est la propension marginale à consommer. Si c = 0,8, le multiplicateur vaut 5 : une injection de 1 milliard d'euros de dépenses publiques génère 5 milliards de revenu national à travers des vagues successives de consommation. Ce résultat repose sur des hypothèses : existence de capacités de production inutilisées (sous-emploi keynésien), rigidité des prix à court terme, économie fermée (en économie ouverte, les fuites par les importations réduisent le multiplicateur). L'effet est d'autant plus fort que la propension marginale à consommer est élevée et que le taux d'imposition est faible. En pratique, les estimations empiriques du FMI situent le multiplicateur budgétaire entre 0,5 et 2,5 selon le contexte conjoncturel.",
    relatedModules: ['multiplicateur-keynesien', 'is-lm'],
    category: 'Macroéconomie',
  },
  {
    term: 'Propension marginale à consommer (PmC)',
    definition:
      "Part de chaque euro de revenu supplémentaire consacrée à la consommation, le complément étant épargné (propension marginale à épargner, PmS = 1 - PmC). Concept central de la théorie keynésienne, la PmC est comprise entre 0 et 1 et détermine la valeur du multiplicateur (k = 1/(1 - PmC)). Keynes formule la « loi psychologique fondamentale » selon laquelle les hommes tendent à accroître leur consommation lorsque le revenu augmente, mais moins que proportionnellement. Une PmC de 0,8 signifie que pour chaque euro de revenu supplémentaire, 80 centimes sont consommés et 20 centimes épargnés. La PmC varie selon le niveau de revenu (plus élevée pour les ménages modestes, qui consomment une plus grande part de leur revenu) et selon la phase du cycle économique, ce qui a des implications directes pour l'efficacité de la politique budgétaire et le ciblage des transferts sociaux.",
    relatedModules: ['multiplicateur-keynesien', 'is-lm'],
    category: 'Macroéconomie',
  },
  {
    term: 'Modèle IS-LM',
    definition:
      "Modèle macroéconomique de synthèse développé par John Hicks (1937) et Alvin Hansen, formalisant l'analyse de la Théorie générale de Keynes. La courbe IS (Investment-Saving) représente l'ensemble des combinaisons de taux d'intérêt (r) et de revenu national (Y) assurant l'équilibre sur le marché des biens et services : elle est décroissante car une baisse du taux d'intérêt stimule l'investissement et donc le revenu. La courbe LM (Liquidity preference-Money supply) représente l'équilibre sur le marché de la monnaie : elle est croissante car une hausse du revenu augmente la demande de monnaie pour motif de transaction, ce qui élève le taux d'intérêt. L'intersection détermine l'équilibre simultané (Y*, r*). Le modèle permet d'analyser les effets des politiques budgétaire (déplacement de IS) et monétaire (déplacement de LM), et de mettre en évidence l'effet d'éviction. Ses cas limites sont la trappe à liquidité (LM horizontale, politique monétaire inefficace) et le cas classique (LM verticale, politique budgétaire inefficace).",
    relatedModules: ['is-lm'],
    category: 'Macroéconomie',
  },
  {
    term: 'Courbe de Phillips',
    definition:
      "Relation empirique mise en évidence par l'économiste néo-zélandais Alban William Phillips en 1958, établissant une corrélation inverse entre le taux de chômage et le taux de variation des salaires nominaux au Royaume-Uni (1861-1957). Samuelson et Solow (1960) l'ont reformulée comme un arbitrage inflation-chômage, offrant aux décideurs un « menu de politique économique ». Milton Friedman (1968) et Edmund Phelps ont remis en cause cette relation à long terme en introduisant les anticipations adaptatives : à long terme, la courbe est verticale au taux de chômage naturel (NAIRU), car les agents ajustent leurs anticipations d'inflation. Les nouveaux classiques (Lucas, Sargent) ont radicalisé cette critique avec les anticipations rationnelles : même à court terme, une politique monétaire anticipée est sans effet réel. La stagflation des années 1970 a confirmé l'instabilité de la relation de Phillips simple.",
    relatedModules: ['courbe-de-phillips', 'ad-as'],
    category: 'Macroéconomie',
  },
  {
    term: 'NAIRU (Non-Accelerating Inflation Rate of Unemployment)',
    definition:
      "Taux de chômage en dessous duquel l'inflation tend à s'accélérer, concept développé par Franco Modigliani et Lucas Papademos (1975) puis popularisé dans le débat de politique économique. Il correspond au taux de chômage compatible avec une inflation stable, c'est-à-dire un taux de chômage « d'équilibre » déterminé par les caractéristiques structurelles du marché du travail : degré de rigidité des salaires, pouvoir de négociation des syndicats, efficacité de l'appariement entre offre et demande d'emploi, niveau des allocations chômage. Lorsque le chômage effectif est inférieur au NAIRU, les tensions sur le marché du travail poussent les salaires puis les prix à la hausse ; lorsqu'il est supérieur, l'inflation décélère. Le NAIRU n'est pas directement observable et fait l'objet d'estimations (OCDE, Commission européenne). Il est estimé entre 7 % et 8 % en France et autour de 4 % aux États-Unis, mais ces estimations sont entourées d'une forte incertitude.",
    relatedModules: ['courbe-de-phillips', 'ad-as'],
    category: 'Macroéconomie',
  },
  {
    term: 'Carré magique de Kaldor',
    definition:
      "Représentation graphique proposée par l'économiste Nicholas Kaldor (1971), synthétisant sur quatre axes les quatre objectifs fondamentaux de la politique économique conjoncturelle : la croissance du PIB réel (en %), le taux de chômage (en %), le taux d'inflation (en %) et le solde de la balance courante (en % du PIB). Plus le quadrilatère formé est étendu (en plaçant les valeurs souhaitables vers l'extérieur), meilleure est la performance économique globale. Le terme « magique » souligne qu'il est en pratique impossible d'atteindre simultanément les quatre objectifs optimaux, en raison des arbitrages (trade-offs) : par exemple, une relance pour réduire le chômage peut aggraver l'inflation et le déficit extérieur. Ce diagramme est un outil pédagogique courant en STMG et SES pour comparer les performances de différents pays ou les résultats de politiques économiques successives.",
    relatedModules: ['carre-magique-kaldor', 'donnees-historiques'],
    category: 'Macroéconomie',
  },
  {
    term: 'Stagflation',
    definition:
      "Situation macroéconomique combinant simultanément stagnation économique (croissance faible ou nulle, chômage élevé) et inflation élevée. Ce phénomène, observé dans les économies occidentales après les chocs pétroliers de 1973 (quadruplement du prix du pétrole par l'OPEP) et 1979, a constitué un défi majeur pour la théorie keynésienne traditionnelle qui postulait un arbitrage entre inflation et chômage (courbe de Phillips). La stagflation s'explique par un choc d'offre négatif : la hausse du prix des intrants (énergie, matières premières) déplace la courbe d'offre agrégée vers la gauche, provoquant simultanément une hausse des prix et une baisse de la production. Les politiques de demande sont alors inefficaces - une relance aggrave l'inflation, une rigueur aggrave le chômage. Ce constat a favorisé l'essor des politiques de l'offre et du monétarisme dans les années 1980 (Thatcher, Reagan).",
    relatedModules: ['courbe-de-phillips', 'ad-as', 'carre-magique-kaldor'],
    category: 'Macroéconomie',
  },
  {
    term: 'Désinflation',
    definition:
      "Ralentissement du rythme de hausse du niveau général des prix, c'est-à-dire une baisse du taux d'inflation (qui reste positif). À ne pas confondre avec la déflation (baisse absolue des prix). Par exemple, si l'inflation passe de 10 % à 3 %, on parle de désinflation. La France a connu une désinflation majeure entre 1983 et 1986 sous l'effet de la politique de rigueur menée par le gouvernement Mauroy puis Fabius (blocage des salaires, austérité budgétaire) et de la politique du « franc fort » arrimé au mark allemand. La désinflation compétitive visait à restaurer la compétitivité-prix des entreprises françaises en réduisant l'écart d'inflation avec l'Allemagne. Au niveau mondial, la « Grande Modération » (1985-2007) s'est caractérisée par une désinflation progressive, attribuée à la crédibilité des banques centrales indépendantes et à la concurrence internationale accrue.",
    relatedModules: ['courbe-de-phillips', 'ad-as', 'carre-magique-kaldor', 'donnees-historiques'],
    category: 'Macroéconomie',
  },
  {
    term: 'Déflation',
    definition:
      "Baisse généralisée et durable du niveau général des prix (taux d'inflation négatif), à distinguer de la désinflation (simple ralentissement de la hausse des prix). La déflation peut enclencher un cercle vicieux auto-entretenu théorisé par Irving Fisher (debt-deflation, 1933) : la baisse des prix augmente la valeur réelle des dettes, fragilisant les emprunteurs qui réduisent leurs dépenses ; les anticipations de baisse future des prix incitent les consommateurs à reporter leurs achats, ce qui déprime la demande agrégée et accentue la baisse des prix. La politique monétaire conventionnelle (baisse des taux directeurs) perd son efficacité lorsque les taux atteignent leur plancher (trappe à liquidité). Le Japon a connu une déflation persistante entre 1999 et 2013, avec des conséquences durables sur la croissance (« décennies perdues »). La zone euro a frôlé la déflation en 2014-2015, ce qui a conduit la BCE à adopter le quantitative easing.",
    relatedModules: ['courbe-de-phillips', 'ad-as', 'creation-monetaire', 'donnees-historiques'],
    category: 'Macroéconomie',
  },
  {
    term: 'Paradoxe de l\'épargne (Keynes)',
    definition:
      "Proposition paradoxale formulée par Keynes selon laquelle si tous les agents économiques décident simultanément d'épargner davantage (hausse de la propension marginale à épargner), la demande globale diminue, ce qui réduit le revenu national et, in fine, l'épargne agrégée elle-même. Ce qui est rationnel au niveau individuel (épargner pour se prémunir contre l'incertitude) devient contre-productif au niveau macroéconomique : c'est un cas typique de « sophisme de composition ». Le mécanisme passe par le multiplicateur keynésien : une hausse de l'épargne réduit la consommation, donc la production, les revenus, et finalement l'épargne totale. Ce paradoxe a retrouvé une actualité forte pendant la crise de 2008-2009, lorsque le désendettement simultané des ménages américains a amplifié la récession. Il justifie l'intervention de l'État comme « dépenseur en dernier ressort » lorsque le secteur privé se contracte.",
    relatedModules: ['multiplicateur-keynesien', 'is-lm'],
    category: 'Macroéconomie',
  },
  {
    term: 'Effet d\'éviction',
    definition:
      "Phénomène par lequel une hausse des dépenses publiques financée par l'emprunt provoque une augmentation du taux d'intérêt sur le marché des capitaux, ce qui réduit (« évince ») l'investissement privé. Dans le cadre du modèle IS-LM, la politique budgétaire expansionniste déplace IS vers la droite, ce qui augmente à la fois le revenu et le taux d'intérêt ; la hausse du taux d'intérêt décourage partiellement l'investissement privé, atténuant l'effet multiplicateur initial. L'éviction est totale dans le cas classique (courbe LM verticale : tout l'effet de la relance est absorbé par la hausse des taux) et nulle en trappe à liquidité (LM horizontale : les taux ne montent pas car la demande de monnaie est parfaitement élastique). L'éviction peut aussi être « ricardienne » (théorème d'équivalence de Barro-Ricardo) : les agents anticipent de futures hausses d'impôts pour rembourser la dette et réduisent leur consommation présente.",
    relatedModules: ['is-lm', 'multiplicateur-keynesien'],
    category: 'Macroéconomie',
  },
  {
    term: 'Loi d\'Okun',
    definition:
      "Relation empirique mise en évidence par l'économiste Arthur Okun (1962), établissant un lien négatif entre la variation du taux de chômage et l'écart de production (output gap). Dans sa formulation courante, une croissance du PIB réel supérieure de 1 point au taux de croissance potentiel fait baisser le taux de chômage d'environ 0,5 point (le coefficient varie selon les pays et les périodes). Inversement, il faut en général une croissance supérieure à un certain seuil (environ 1,5 % en France) pour que le chômage commence à baisser, en raison des gains de productivité et de la croissance de la population active. Cette « loi » n'est pas une relation structurelle mais une régularité statistique robuste, utile pour prévoir l'évolution du chômage en fonction des perspectives de croissance. Elle illustre le coût social de la récession en termes d'emplois détruits.",
    relatedModules: ['courbe-de-phillips', 'carre-magique-kaldor', 'ad-as', 'donnees-historiques'],
    category: 'Macroéconomie',
  },
  {
    term: 'Courbe de Beveridge',
    definition:
      "Relation empirique inverse entre le taux de chômage et le taux d'emplois vacants dans une économie, du nom de l'économiste britannique William Beveridge. Lorsque le taux de vacance est élevé et le chômage faible, le marché du travail est tendu (difficultés de recrutement) ; lorsque le taux de vacance est faible et le chômage élevé, le marché du travail est détendu. Un déplacement de la courbe vers l'extérieur (hausse simultanée du chômage et des emplois vacants) signale une dégradation de l'appariement (mismatch) entre offre et demande de travail, due à l'inadéquation des qualifications, à la mobilité géographique insuffisante ou à des rigidités institutionnelles. Cet indicateur est suivi par la DARES en France et par Eurostat au niveau européen pour diagnostiquer la nature structurelle ou conjoncturelle du chômage.",
    relatedModules: ['courbe-de-phillips', 'carre-magique-kaldor'],
    category: 'Marché du travail',
  },
  {
    term: 'Politique de la demande vs politique de l\'offre',
    definition:
      "Deux grandes orientations de politique économique. Les politiques de la demande, d'inspiration keynésienne, visent à stimuler la demande globale (consommation, investissement) par la relance budgétaire (hausse des dépenses publiques, baisse des impôts) ou la politique monétaire expansionniste (baisse des taux directeurs). Elles sont efficaces en situation de sous-emploi des capacités de production (chômage keynésien). Les politiques de l'offre visent à améliorer les conditions de production : baisse du coût du travail (allègements de charges), flexibilisation du marché du travail, réduction de la fiscalité sur les entreprises, dérégulation, investissement en éducation et R&D. Elles ciblent la croissance potentielle à long terme. La distinction renvoie au débat classique : pour les keynésiens, « la demande crée sa propre offre » (principe de la demande effective) ; pour les classiques et l'école de l'offre (Laffer, Mundell), la loi de Say prévaut (« l'offre crée sa propre demande »). En pratique, les gouvernements combinent souvent les deux approches.",
    relatedModules: ['ad-as', 'is-lm', 'multiplicateur-keynesien', 'courbe-de-laffer'],
    category: 'Politique économique',
  },

  // ═══════════════════════════════════════════════════════════════════════
  // MICROECONOMIE
  // ═══════════════════════════════════════════════════════════════════════
  {
    term: 'Élasticité-prix de la demande',
    definition:
      "Mesure de la sensibilité de la quantité demandée d'un bien à une variation de son prix, définie comme le rapport entre la variation relative de la quantité demandée et la variation relative du prix : Ep = (%ΔQd) / (%ΔP). Elle est généralement négative (loi de la demande) et s'exprime en valeur absolue. Si |Ep| > 1, la demande est élastique (biens de luxe, biens substituables) : une hausse de 1 % du prix entraîne une baisse de plus de 1 % de la quantité demandée. Si |Ep| < 1, la demande est inélastique (biens de première nécessité, biens addictifs, biens sans substitut). Si |Ep| = 1, l'élasticité est unitaire et la recette totale est maximisée. L'élasticité dépend de la disponibilité de substituts, du poids du bien dans le budget, et de l'horizon temporel (plus élastique à long terme). C'est un concept fondamental pour la tarification, la fiscalité (incidence de la taxe) et l'analyse des structures de marché.",
    relatedModules: ['elasticite-prix', 'offre-et-demande', 'courbe-de-laffer'],
    category: 'Microéconomie',
  },
  {
    term: 'Élasticité-revenu de la demande',
    definition:
      "Mesure de la sensibilité de la quantité demandée d'un bien à une variation du revenu du consommateur : Er = (%ΔQd) / (%ΔR). Elle permet de classer les biens selon la nomenclature d'Ernst Engel. Si Er < 0, le bien est un bien inférieur (sa consommation diminue quand le revenu augmente, comme les transports en commun pour certains ménages). Si 0 < Er < 1, le bien est un bien normal ou de première nécessité (l'alimentation de base, dont la part budgétaire diminue avec le revenu, conformément à la loi d'Engel). Si Er > 1, le bien est un bien supérieur ou de luxe (voyages, culture, haute technologie). La connaissance des élasticités-revenu est cruciale pour la prospective économique : les secteurs produisant des biens supérieurs voient leur demande croître plus que proportionnellement avec le développement économique, tandis que les secteurs de biens inférieurs déclinent.",
    relatedModules: ['elasticite-prix', 'offre-et-demande'],
    category: 'Microéconomie',
  },
  {
    term: 'Équilibre de marché',
    definition:
      "Situation dans laquelle la quantité offerte est exactement égale à la quantité demandée, déterminant un prix d'équilibre (P*) et une quantité d'équilibre (Q*). Ce prix « vide le marché » : il n'existe ni excès d'offre (surplus) ni excès de demande (pénurie). L'équilibre est stable si le marché revient spontanément vers cet état après une perturbation (condition de stabilité walrasienne : excès de demande quand P < P*, excès d'offre quand P > P*). Toute modification des déterminants de l'offre (coûts de production, technologie, nombre de producteurs) ou de la demande (revenu, préférences, prix des biens liés, nombre de consommateurs) déplace les courbes et modifie l'équilibre. L'intervention publique (prix plafond, prix plancher, taxe, quota) crée des distorsions par rapport à l'équilibre concurrentiel, générant typiquement une perte sèche (deadweight loss).",
    relatedModules: ['offre-et-demande', 'ad-as'],
    category: 'Microéconomie',
  },
  {
    term: 'Coût marginal et coût moyen',
    definition:
      "Le coût marginal (Cm) est le supplément de coût engendré par la production d'une unité additionnelle : Cm = ΔCT/ΔQ, ou la dérivée du coût total par rapport à la quantité. Le coût moyen (CM) est le coût total rapporté à la quantité produite : CM = CT/Q. La relation entre les deux est fondamentale : le coût marginal coupe la courbe de coût moyen en son minimum. Quand Cm < CM, le coût moyen est décroissant (économies d'échelle) ; quand Cm > CM, le coût moyen est croissant (déséconomies d'échelle). En concurrence parfaite, la condition de maximisation du profit impose P = Cm (le producteur est « preneur de prix »). En monopole, la maximisation du profit se fait à Rm = Cm (recette marginale = coût marginal), avec un prix supérieur au coût marginal, générant un pouvoir de marché mesurable par l'indice de Lerner : L = (P - Cm)/P.",
    relatedModules: ['offre-et-demande', 'concurrence-monopole'],
    category: 'Microéconomie',
  },
  {
    term: 'Rendements d\'échelle',
    definition:
      "Les rendements d'échelle décrivent la manière dont la production varie lorsque tous les facteurs de production sont multipliés dans la même proportion. Si l'on multiplie tous les inputs par un facteur λ > 1 : les rendements sont croissants si la production est multipliée par plus de λ (par exemple, doubler les inputs triple la production) - ce qui génère des économies d'échelle et favorise la concentration ; les rendements sont constants si la production est exactement multipliée par λ ; les rendements sont décroissants si la production est multipliée par moins de λ. Pour une fonction de production Cobb-Douglas Y = A.K^α.L^β, les rendements sont croissants si α+β > 1, constants si α+β = 1, et décroissants si α+β < 1. Les rendements croissants sont à l'origine des monopoles naturels (coût moyen continûment décroissant) et jouent un rôle central dans les nouvelles théories du commerce international (Paul Krugman, prix Nobel 2008).",
    relatedModules: ['concurrence-monopole', 'frontiere-possibilites-production'],
    category: 'Microéconomie',
  },
  {
    term: 'Surplus du consommateur et du producteur',
    definition:
      "Le surplus du consommateur mesure le gain net retiré de l'échange par les acheteurs : c'est la différence entre le prix maximal qu'ils étaient disposés à payer (consentement à payer) et le prix effectivement payé, agrégée sur l'ensemble des unités achetées. Graphiquement, c'est l'aire comprise entre la courbe de demande et la droite de prix, au-dessus du prix d'équilibre. Le surplus du producteur mesure le gain net des vendeurs : c'est la différence entre le prix reçu et le coût marginal de production (prix minimal acceptable), agrégée sur les unités vendues. C'est l'aire entre la droite de prix et la courbe d'offre. Le surplus total (somme des deux) est maximisé à l'équilibre concurrentiel - tout écart (taxe, monopole, prix réglementé) engendre une perte sèche (deadweight loss). Ce cadre d'analyse, fondé sur les travaux de Marshall et Dupuit, est central pour l'évaluation des politiques publiques (analyse coût-bénéfice).",
    relatedModules: ['offre-et-demande', 'elasticite-prix', 'concurrence-monopole'],
    category: 'Microéconomie',
  },
  {
    term: 'Perte sèche (deadweight loss)',
    definition:
      "Perte nette de bien-être économique qui n'est récupérée par aucun agent (ni consommateurs, ni producteurs, ni État), résultant d'une distorsion par rapport à l'équilibre concurrentiel. Elle apparaît chaque fois qu'une intervention empêche certains échanges mutuellement bénéfiques de se réaliser. Les principales sources de perte sèche sont : les taxes indirectes (le triangle de Harberger entre les courbes d'offre et de demande, entre la quantité d'équilibre libre et la quantité avec taxe), le monopole (quantité produite inférieure à l'optimum concurrentiel), les prix plafonds (rationnement et files d'attente) et les prix planchers (surplus invendus). L'ampleur de la perte sèche dépend des élasticités de l'offre et de la demande : plus elles sont élevées, plus la distorsion est coûteuse. Le concept est fondamental en économie publique pour évaluer le coût social de la fiscalité et de la régulation.",
    relatedModules: ['offre-et-demande', 'courbe-de-laffer', 'concurrence-monopole', 'externalites'],
    category: 'Microéconomie',
  },
  {
    term: 'Bien de Giffen et bien de Veblen',
    definition:
      "Deux exceptions apparentes à la loi de la demande (relation inverse prix-quantité). Le bien de Giffen, théorisé par Alfred Marshall d'après les observations de Robert Giffen sur la pomme de terre en Irlande, est un bien inférieur pour lequel l'effet revenu (la hausse du prix appauvrit le consommateur qui consomme davantage du bien inférieur bon marché) domine l'effet substitution, de sorte que la quantité demandée augmente quand le prix augmente. C'est un cas théorique rarissime empiriquement (Jensen et Miller, 2008, l'ont documenté pour le riz en Chine). Le bien de Veblen (Théorie de la classe de loisir, 1899), en revanche, relève de la sociologie de la consommation : c'est un bien dont la demande augmente avec le prix parce que le prix élevé est un signal de statut social (montres de luxe, voitures haut de gamme). Il ne contredit pas la théorie du consommateur rationnel si l'on intègre la valeur de prestige dans l'utilité.",
    relatedModules: ['elasticite-prix', 'offre-et-demande'],
    category: 'Microéconomie',
  },
  {
    term: 'Utilité marginale décroissante',
    definition:
      "Principe fondamental de la théorie du consommateur, formalisé par les marginalistes (Jevons, Menger, Walras, années 1870), selon lequel la satisfaction supplémentaire (utilité marginale) procurée par la consommation d'une unité additionnelle d'un bien décroît à mesure que la quantité consommée augmente. Le premier verre d'eau procure une utilité très élevée à une personne assoiffée, le dixième beaucoup moins. Ce principe fonde la courbe de demande décroissante : le consommateur n'accepte de consommer une unité supplémentaire que si le prix baisse. La condition d'optimum du consommateur (maximisation de l'utilité sous contrainte budgétaire) exige l'égalisation des utilités marginales pondérées par les prix : Um_A/P_A = Um_B/P_B pour tous les biens A et B. Ce principe a été remis en question pour certains biens (biens addictifs, biens de réseau) où l'utilité peut être croissante sur certains intervalles.",
    relatedModules: ['offre-et-demande', 'elasticite-prix'],
    category: 'Microéconomie',
  },
  {
    term: 'Externalité',
    definition:
      "Effet d'une activité économique (production ou consommation) sur le bien-être d'un tiers qui n'est pas partie à la transaction, et pour lequel aucune compensation monétaire n'est versée via le mécanisme de prix. L'externalité négative (pollution industrielle, bruit, tabagisme passif) impose un coût social supérieur au coût privé : le coût social marginal excède le coût marginal privé, et la production de marché est excessive par rapport à l'optimum social. L'externalité positive (éducation, vaccination, recherche fondamentale) génère un bénéfice social supérieur au bénéfice privé : la production de marché est insuffisante. Deux grandes familles de solutions existent : la solution pigouvienne (taxe pour internaliser le coût social, subvention pour les externalités positives) et la solution coasienne (négociation directe entre les parties, possible si les droits de propriété sont bien définis et les coûts de transaction faibles, théorème de Coase, 1960). Les externalités sont l'une des principales défaillances de marché.",
    relatedModules: ['externalites', 'offre-et-demande'],
    category: 'Microéconomie',
  },
  {
    term: 'Taxe pigouvienne',
    definition:
      "Taxe mise en place par l'État pour corriger une externalité négative en internalisant le coût social dans le prix de marché, du nom de l'économiste Arthur Cecil Pigou (The Economics of Welfare, 1920). Le montant optimal de la taxe est égal à la différence entre le coût social marginal et le coût privé marginal au niveau de production socialement optimal. Par exemple, une taxe carbone fixée au coût social marginal d'une tonne de CO2 (estimé entre 50 et 200 euros selon les modèles) incite les producteurs et consommateurs à réduire leurs émissions jusqu'au point où le coût de réduction marginal égale la taxe. L'avantage de la taxe pigouvienne par rapport à la réglementation directe (normes, interdictions) est qu'elle laisse les agents choisir la manière la plus efficace de réduire l'externalité (efficacité allocative), tout en générant des recettes fiscales (double dividende environnemental et fiscal).",
    relatedModules: ['externalites'],
    category: 'Microéconomie',
  },
  {
    term: 'Bien public',
    definition:
      "Bien caractérisé par deux propriétés fondamentales : la non-rivalité (la consommation du bien par un agent ne réduit pas la quantité disponible pour les autres) et la non-exclusion (il est impossible ou trop coûteux d'empêcher un agent de consommer le bien sans payer). Les exemples canoniques sont la défense nationale, l'éclairage public, un phare maritime, ou la recherche fondamentale. Le marché produit spontanément les biens publics en quantité sous-optimale en raison du problème du passager clandestin (free rider) : chaque agent a intérêt à ne pas révéler sa préférence et à bénéficier du bien financé par les autres. C'est pourquoi les biens publics sont généralement fournis par l'État et financés par l'impôt. La condition d'optimalité de Samuelson (1954) stipule que la somme des dispositions marginales à payer de tous les agents doit être égale au coût marginal de production du bien public.",
    relatedModules: ['externalites', 'offre-et-demande'],
    category: 'Microéconomie',
  },
  {
    term: 'Défaillance de marché',
    definition:
      "Situation dans laquelle le libre fonctionnement du marché ne conduit pas à une allocation optimale des ressources au sens de Pareto (premier théorème de l'économie du bien-être). Les principales défaillances de marché sont : les externalités (coûts ou bénéfices non pris en compte par le prix), les biens publics (sous-production par le marché en raison du passager clandestin), les asymétries d'information (sélection adverse et aléa moral), le pouvoir de marché (monopole, oligopole qui fixent des prix supérieurs au coût marginal), et les rendements croissants (monopoles naturels). Ces défaillances constituent le fondement théorique de l'intervention publique (régulation, taxation, subvention, production publique). Toutefois, l'école du Public Choice (Buchanan, Tullock) met en garde contre les « défaillances de l'État » (capture réglementaire, recherche de rente, inefficacité bureaucratique) qui peuvent être aussi coûteuses que les défaillances de marché.",
    relatedModules: ['externalites', 'concurrence-monopole', 'offre-et-demande'],
    category: 'Microéconomie',
  },
  {
    term: 'Équilibre de Nash',
    definition:
      "Concept central de la théorie des jeux, développé par John Nash (1950, prix Nobel 1994). Un équilibre de Nash est un profil de stratégies (une stratégie par joueur) tel qu'aucun joueur n'a intérêt à dévier unilatéralement de sa stratégie, étant donné les stratégies des autres joueurs. Autrement dit, chaque joueur joue la meilleure réponse aux stratégies adverses. L'exemple classique est le dilemme du prisonnier, où l'équilibre de Nash (trahir, trahir) est un résultat sous-optimal pour les deux joueurs - aucun ne peut améliorer sa situation en changeant seul de stratégie, mais les deux auraient gagné à coopérer. Ce concept s'applique à l'oligopole (équilibre de Cournot est un équilibre de Nash en quantités), à la négociation internationale (accords commerciaux), et à la politique monétaire (jeu entre banque centrale et anticipations des agents). Un jeu peut avoir zéro, un ou plusieurs équilibres de Nash.",
    relatedModules: ['concurrence-monopole'],
    category: 'Microéconomie',
  },
  {
    term: 'Aléa moral',
    definition:
      "Forme d'asymétrie d'information ex post (après la signature du contrat) dans laquelle un agent modifie son comportement au détriment de l'autre partie parce qu'il est protégé contre les conséquences de ses actes. L'exemple classique est celui de l'assurance : un individu assuré contre le vol prend moins de précautions (ne ferme plus sa porte à clé), augmentant la probabilité du sinistre. En économie financière, le sauvetage systématique des banques « too big to fail » par l'État crée un aléa moral : les banques prennent des risques excessifs en sachant qu'elles seront renflouées en cas de crise. Ce concept, formalisé par Kenneth Arrow (1963) dans le domaine de l'assurance santé, est central pour comprendre la crise des subprimes de 2008. Les solutions incluent les franchises et co-paiements (partage du risque), les clauses de bonus-malus, et la régulation prudentielle (ratios de fonds propres, Bâle III).",
    relatedModules: ['concurrence-monopole', 'creation-monetaire'],
    category: 'Microéconomie',
  },
  {
    term: 'Sélection adverse (Akerlof)',
    definition:
      "Forme d'asymétrie d'information ex ante (avant la transaction) dans laquelle une partie dispose d'informations privées que l'autre ne peut observer, conduisant à une dégradation de la qualité des biens ou services échangés. Le modèle fondateur est celui du « marché des lemons » (voitures d'occasion) de George Akerlof (1970, prix Nobel 2001) : les vendeurs connaissent la qualité de leur véhicule mais pas les acheteurs, qui n'acceptent de payer qu'un prix moyen. Les vendeurs de bonnes voitures se retirent du marché, ne restent que les mauvaises (« lemons »), jusqu'à l'effondrement potentiel du marché. En assurance, ce sont les individus à haut risque qui s'assurent le plus, ce qui fait monter les primes et décourage les individus à faible risque. Les solutions incluent le signalement (le vendeur certifie la qualité, labels, diplômes), le filtrage (screening, l'acheteur propose des contrats différenciés) et l'obligation d'assurance (assurance maladie universelle).",
    relatedModules: ['concurrence-monopole'],
    category: 'Microéconomie',
  },
  {
    term: 'Monopole',
    definition:
      "Structure de marché dans laquelle un seul producteur contrôle l'intégralité de l'offre d'un bien ou service sans substitut proche, lui conférant un pouvoir de marché : la capacité d'influencer le prix. Contrairement à l'entreprise en concurrence parfaite (price-taker), le monopoleur est « faiseur de prix » (price-maker). Il maximise son profit au point où la recette marginale égale le coût marginal (Rm = Cm), ce qui conduit à un prix supérieur au coût marginal et à une quantité produite inférieure à l'optimum concurrentiel, générant une perte sèche. Les sources du monopole sont : les barrières légales (brevets, licences, monopoles publics), les barrières naturelles (rendements d'échelle croissants conduisant au monopole naturel, comme les réseaux de distribution d'eau), et les barrières stratégiques (prix prédateurs, contrôle des ressources). La régulation des monopoles (tarification au coût marginal, régulation du taux de rendement, droit de la concurrence) est un domaine central de l'économie publique.",
    relatedModules: ['concurrence-monopole'],
    category: 'Microéconomie',
  },
  {
    term: 'Frontière des possibilités de production (FPP)',
    definition:
      "Courbe représentant l'ensemble des combinaisons maximales de deux biens (ou catégories de biens) qu'une économie peut produire en utilisant pleinement et efficacement toutes ses ressources disponibles (travail, capital, ressources naturelles) et sa technologie. Tout point sur la FPP correspond à une allocation efficace (pas de gaspillage) ; un point à l'intérieur traduit une sous-utilisation des ressources (chômage, capacités ocieuves) ; un point au-delà est inaccessible avec les ressources actuelles. La FPP est généralement concave (courbée vers l'extérieur) en raison de la loi des rendements décroissants et de la spécialisation des facteurs. La pente de la FPP en un point mesure le coût d'opportunité : la quantité d'un bien à laquelle il faut renoncer pour produire une unité supplémentaire de l'autre. La FPP se déplace vers l'extérieur grâce à la croissance économique (accumulation de capital, progrès technique, augmentation de la population active).",
    relatedModules: ['frontiere-possibilites-production', 'avantages-comparatifs'],
    category: 'Microéconomie',
  },
  {
    term: 'Coût d\'opportunité',
    definition:
      "Valeur de la meilleure alternative sacrifiée lorsqu'un choix économique est effectué, c'est-à-dire le bénéfice auquel on renonce en choisissant une option plutôt qu'une autre. Ce concept, formalisé par Friedrich von Wieser (1914), est au fondement du raisonnement économique : la rareté des ressources implique que tout choix comporte un coût, même en l'absence de dépense monétaire. Par exemple, le coût d'opportunité d'une année d'études supérieures n'est pas seulement le coût des frais d'inscription, mais aussi le salaire auquel l'étudiant renonce en ne travaillant pas. Sur la frontière des possibilités de production, le coût d'opportunité d'un bien est mesuré par la pente de la FPP (quantité de l'autre bien sacrifiée). En théorie du commerce international, c'est la différence de coûts d'opportunité entre pays qui fonde l'avantage comparatif de Ricardo et justifie la spécialisation et l'échange mutuellement bénéfique.",
    relatedModules: ['frontiere-possibilites-production', 'avantages-comparatifs'],
    category: 'Microéconomie',
  },
  {
    term: 'Recette marginale',
    definition:
      "Supplément de recette totale obtenu par la vente d'une unité supplémentaire : Rm = ΔRT/ΔQ, ou la dérivée de la recette totale par rapport à la quantité. En concurrence parfaite, l'entreprise est preneuse de prix et la recette marginale est constante, égale au prix de marché (Rm = P). En monopole ou en concurrence imparfaite, le producteur doit baisser son prix pour vendre une unité supplémentaire, de sorte que la recette marginale est inférieure au prix (Rm < P) : la courbe de Rm est en dessous de la courbe de demande et décroît plus rapidement. La condition de maximisation du profit pour toute entreprise est Rm = Cm (recette marginale = coût marginal). Lorsque Rm > Cm, l'entreprise a intérêt à produire davantage ; lorsque Rm < Cm, elle doit réduire sa production. L'écart entre P et Rm en monopole est à l'origine du pouvoir de marché et de la perte sèche.",
    relatedModules: ['concurrence-monopole', 'offre-et-demande'],
    category: 'Microéconomie',
  },

  // ═══════════════════════════════════════════════════════════════════════
  // MONNAIE ET FINANCE
  // ═══════════════════════════════════════════════════════════════════════
  {
    term: 'Taux d\'intérêt',
    definition:
      "Prix du temps et du risque, exprimé en pourcentage annuel, représentant la rémunération du prêteur (ou le coût pour l'emprunteur). On distingue le taux d'intérêt nominal (affiché dans le contrat) et le taux d'intérêt réel (corrigé de l'inflation, selon la relation de Fisher : r ≈ i - π). Le taux directeur fixé par la banque centrale (taux de refinancement pour la BCE, fed funds rate pour la Fed) constitue le taux de référence à court terme qui se transmet à l'ensemble des taux de l'économie par le canal du crédit bancaire. Les taux d'intérêt jouent un rôle central dans le modèle IS-LM : ils déterminent l'investissement (via le coût du capital) et la demande de monnaie (arbitrage entre liquidité et rendement). Keynes distingue trois motifs de détention de monnaie : transaction, précaution et spéculation, ce dernier étant inversement lié au taux d'intérêt.",
    relatedModules: ['is-lm', 'creation-monetaire', 'multiplicateur-keynesien'],
    category: 'Monnaie et finance',
  },
  {
    term: 'Politique monétaire',
    definition:
      "Ensemble des décisions prises par la banque centrale pour réguler la quantité de monnaie en circulation, le niveau des taux d'intérêt et les conditions de crédit dans l'économie. La politique monétaire conventionnelle utilise trois instruments principaux : la fixation des taux directeurs (taux de refinancement, taux de facilité de dépôt, taux de facilité de prêt marginal pour la BCE), les opérations d'open market (achat/vente de titres sur le marché interbancaire) et le taux de réserves obligatoires. La politique monétaire est expansionniste (accommodante) lorsqu'elle vise à stimuler l'activité par la baisse des taux et restrictive lorsqu'elle lutte contre l'inflation par la hausse des taux. Face à la trappe à liquidité (taux directeurs proches de zéro), les banques centrales ont recouru à des politiques non conventionnelles après 2008 : quantitative easing (achats massifs de titres), forward guidance (communication sur l'orientation future de la politique), et taux négatifs sur les facilités de dépôt.",
    relatedModules: ['is-lm', 'creation-monetaire', 'courbe-de-phillips', 'ad-as'],
    category: 'Monnaie et finance',
  },
  {
    term: 'Masse monétaire (M1, M2, M3)',
    definition:
      "Quantité totale de monnaie en circulation dans une économie, mesurée par des agrégats classés par degré de liquidité décroissant. M1 (monnaie au sens strict) comprend les billets et pièces en circulation et les dépôts à vue (comptes courants) : c'est la monnaie immédiatement utilisable pour les transactions. M2 inclut M1 plus les dépôts à terme d'une durée inférieure ou égale à 2 ans et les dépôts remboursables avec un préavis inférieur ou égal à 3 mois (livret A, LDDS, LEP en France). M3 inclut M2 plus les instruments négociables émis par les institutions financières monétaires : pensions, titres d'OPCVM monétaires et titres de créance d'une durée inférieure ou égale à 2 ans. La BCE surveille principalement M3 comme indicateur avancé de l'inflation. En zone euro, M3 représente environ 16 000 milliards d'euros, dont plus de 90 % est de la monnaie scripturale créée par les banques commerciales via le mécanisme du crédit.",
    relatedModules: ['creation-monetaire', 'is-lm'],
    category: 'Monnaie et finance',
  },
  {
    term: 'Création monétaire et multiplicateur de crédit',
    definition:
      "La création monétaire dans les économies modernes résulte principalement de l'octroi de crédit par les banques commerciales (« les crédits font les dépôts »). Lorsqu'une banque accorde un prêt de 1 000 euros, elle crédite le compte de l'emprunteur d'un simple jeu d'écriture, augmentant la masse monétaire M1. Le multiplicateur de crédit décrit le processus par lequel un dépôt initial (ou une injection de monnaie banque centrale) se transforme en un volume de crédits (et donc de monnaie) multiple : si le taux de réserves obligatoires est r, le multiplicateur maximal est k = 1/r. Avec r = 2 % (taux actuel en zone euro), un dépôt de 100 euros peut théoriquement générer 5 000 euros de monnaie. En réalité, le multiplicateur effectif est inférieur en raison des fuites en billets, des réserves excédentaires, et du comportement prudent des banques (ratios Bâle III). La vision contemporaine (endogène) souligne que ce sont les banques qui créent la monnaie en fonction de la demande de crédit, et non la banque centrale qui contrôle mécaniquement la quantité de monnaie.",
    relatedModules: ['creation-monetaire'],
    category: 'Monnaie et finance',
  },
  {
    term: 'Réserves obligatoires',
    definition:
      "Fraction des dépôts que les banques commerciales sont légalement tenues de conserver sous forme de réserves auprès de la banque centrale, constituant l'un des instruments de la politique monétaire. En zone euro, le taux de réserves obligatoires est fixé à 1 % depuis 2012 (il était de 2 % auparavant). Ce mécanisme remplit plusieurs fonctions : limiter la création monétaire en contraignant la capacité de prêt des banques, stabiliser les taux du marché interbancaire, et créer une demande structurelle de monnaie banque centrale qui renforce le canal de transmission de la politique monétaire. Toutefois, dans le système bancaire moderne avec excès de liquidité (post-quantitative easing), les réserves obligatoires sont rarement une contrainte effective : les banques détiennent des réserves excédentaires massives. L'instrument principal est désormais le taux d'intérêt sur les facilités de dépôt, qui rémunère (ou pénalise) les réserves excédentaires.",
    relatedModules: ['creation-monetaire'],
    category: 'Monnaie et finance',
  },
  {
    term: 'Trappe à liquidité',
    definition:
      "Situation théorisée par Keynes (Théorie générale, 1936) dans laquelle le taux d'intérêt est si bas que la demande de monnaie pour motif de spéculation devient parfaitement élastique : les agents préfèrent conserver toute monnaie supplémentaire sous forme liquide plutôt que d'acheter des obligations dont ils anticipent une baisse de cours (hausse future des taux). Dans le modèle IS-LM, la courbe LM devient horizontale dans sa partie gauche, rendant la politique monétaire totalement inefficace (l'augmentation de l'offre de monnaie ne fait plus baisser le taux d'intérêt) tandis que la politique budgétaire est pleinement efficace (pas d'effet d'éviction). Le Japon a connu cette situation entre 1995 et 2013, avec des taux directeurs proches de zéro et une croissance atone malgré des injections massives de liquidités. La zone euro s'en est approchée après 2014, amenant la BCE à adopter des taux négatifs et le quantitative easing pour tenter de contourner cette limite théorique.",
    relatedModules: ['is-lm', 'creation-monetaire'],
    category: 'Monnaie et finance',
  },

  // ═══════════════════════════════════════════════════════════════════════
  // POLITIQUE ECONOMIQUE ET FISCALITE
  // ═══════════════════════════════════════════════════════════════════════
  {
    term: 'Politique budgétaire',
    definition:
      "Utilisation du budget de l'État (recettes fiscales et dépenses publiques) pour influencer le niveau d'activité économique. Une politique budgétaire expansionniste (augmentation des dépenses publiques et/ou baisse des impôts) accroît la demande globale et stimule la production via l'effet multiplicateur keynésien, au prix d'un creusement du déficit public. Une politique restrictive (austérité) réduit les dépenses et/ou augmente les impôts pour assainir les finances publiques, avec un effet récessif à court terme. L'efficacité de la politique budgétaire dépend du contexte : elle est maximale en économie fermée, en trappe à liquidité (pas d'éviction par les taux d'intérêt), et en présence de capacités de production inutilisées. Elle est réduite par l'effet d'éviction (hausse des taux), les fuites par les importations (économie ouverte), et l'équivalence ricardienne (anticipation de hausses d'impôts futures). En zone euro, la politique budgétaire est encadrée par le Pacte de stabilité et de croissance (déficit < 3 % du PIB, dette < 60 % du PIB).",
    relatedModules: ['is-lm', 'multiplicateur-keynesien', 'courbe-de-laffer', 'ad-as'],
    category: 'Politique économique',
  },
  {
    term: 'Courbe de Laffer',
    definition:
      "Relation en cloche entre le taux d'imposition et les recettes fiscales totales, popularisée par l'économiste Arthur Laffer dans les années 1970 (bien que l'idée remonte à Ibn Khaldoun et Dupuit). À un taux de 0 %, les recettes sont nulles ; à un taux de 100 %, elles le sont aussi car plus personne n'a intérêt à produire ou à déclarer ses revenus. Entre ces extrêmes, il existe un taux optimal (t*) qui maximise les recettes fiscales. Au-delà de t*, toute hausse du taux réduit paradoxalement les recettes par trois mécanismes : effet désincitatif sur l'offre de travail et l'investissement, développement de l'évasion et de la fraude fiscale, et délocalisation de la base imposable. L'estimation empirique de t* fait l'objet de débats intenses : les travaux de Piketty, Saez et Stantcheva (2014) situent le taux marginal optimal sur les hauts revenus autour de 80 %, bien au-dessus des estimations de l'école supply-side. La courbe illustre que la même recette peut être obtenue par deux taux différents (un bas et un élevé).",
    relatedModules: ['courbe-de-laffer', 'fiscalite-redistribution'],
    category: 'Politique économique',
  },
  {
    term: 'Impôt progressif, proportionnel, régressif',
    definition:
      "Classification des systèmes d'imposition selon l'évolution du taux moyen d'imposition en fonction du revenu. Un impôt progressif applique un taux moyen qui augmente avec le revenu (l'impôt sur le revenu en France avec ses tranches à 0 %, 11 %, 30 %, 41 % et 45 %) : il réduit les inégalités de revenus après redistribution. Un impôt proportionnel (flat tax) applique un taux constant quel que soit le revenu : il prélève davantage en valeur absolue aux plus riches mais ne modifie pas la distribution relative. Un impôt régressif prélève proportionnellement davantage aux revenus modestes : c'est le cas de la TVA et des accises, car les ménages à bas revenus consacrent une part plus importante de leur revenu à la consommation. En France, le système fiscal dans son ensemble est légèrement progressif jusqu'au 95e percentile de revenu, mais peut devenir régressif pour les très hauts revenus en raison du poids des revenus du capital taxés à taux forfaitaire (PFU de 30 %).",
    relatedModules: ['fiscalite-redistribution', 'courbe-de-laffer', 'courbe-de-lorenz-gini'],
    category: 'Politique économique',
  },
  {
    term: 'Taux effectif d\'imposition',
    definition:
      "Rapport entre l'impôt effectivement payé et le revenu total (ou le bénéfice total pour une entreprise), à distinguer du taux marginal qui ne s'applique qu'à la dernière tranche de revenu. En France, un contribuable célibataire gagnant 50 000 euros bruts a un taux marginal de 30 % (tranche à 30 % du barème de l'IR) mais un taux effectif bien inférieur (environ 12-14 %) en raison de la progressivité (les premières tranches sont imposées à 0 % puis 11 %). Le taux effectif est l'indicateur pertinent pour mesurer la charge fiscale réelle pesant sur un contribuable. Pour les entreprises, le taux effectif d'imposition sur les sociétés (impôt effectivement payé / bénéfice comptable) est souvent très inférieur au taux nominal (25 % en France depuis 2022) en raison des crédits d'impôt (CIR, CICE historique), des régimes dérogatoires et de l'optimisation fiscale. La comparaison internationale des taux effectifs est un outil central de l'analyse de la compétitivité fiscale.",
    relatedModules: ['fiscalite-redistribution', 'courbe-de-laffer'],
    category: 'Politique économique',
  },
  {
    term: 'Assiette fiscale',
    definition:
      "Base sur laquelle est calculé l'impôt, c'est-à-dire la matière imposable retenue pour le calcul de la dette fiscale. Pour l'impôt sur le revenu, l'assiette est le revenu net imposable (revenus bruts moins charges déductibles et abattements). Pour la TVA, l'assiette est le prix hors taxe du bien ou service. Pour l'impôt sur les sociétés, c'est le bénéfice imposable. L'élargissement de l'assiette fiscale (suppression des niches fiscales, lutte contre la fraude) permet de collecter davantage de recettes à taux inchangé, ou de baisser le taux à recettes constantes, réduisant les distorsions économiques. La courbe de Laffer montre que l'assiette fiscale est sensible au taux d'imposition : un taux trop élevé réduit l'assiette par trois canaux - contraction de l'activité économique, évasion fiscale (délocalisation légale de la base) et fraude fiscale (dissimulation). La notion d'érosion de l'assiette fiscale est au coeur des travaux BEPS de l'OCDE sur la fiscalité internationale.",
    relatedModules: ['courbe-de-laffer', 'fiscalite-redistribution'],
    category: 'Politique économique',
  },

  // ═══════════════════════════════════════════════════════════════════════
  // COMMERCE INTERNATIONAL
  // ═══════════════════════════════════════════════════════════════════════
  {
    term: 'Avantage comparatif (Ricardo)',
    definition:
      "Principe théorisé par David Ricardo (Des principes de l'économie politique et de l'impôt, 1817) selon lequel un pays a intérêt à se spécialiser dans la production du bien pour lequel il dispose du coût d'opportunité le plus faible (avantage comparatif), même s'il est moins productif que son partenaire dans tous les domaines (pas d'avantage absolu). L'exemple classique oppose le Portugal et l'Angleterre pour le vin et le drap : même si le Portugal est plus efficace dans les deux productions, il a avantage à se spécialiser dans le vin (où son avantage est le plus grand) et à importer le drap d'Angleterre. Le commerce international est donc mutuellement bénéfique car il permet à chaque pays de consommer au-delà de sa frontière des possibilités de production. Ce modèle repose sur des hypothèses fortes : deux pays, deux biens, un seul facteur de production (travail), mobilité parfaite du travail au sein de chaque pays mais immobilité internationale, rendements constants. Le théorème HOS (Heckscher-Ohlin-Samuelson) étend l'analyse à deux facteurs de production.",
    relatedModules: ['avantages-comparatifs', 'frontiere-possibilites-production'],
    category: 'Commerce international',
  },
  {
    term: 'Avantage absolu (Adam Smith)',
    definition:
      "Concept développé par Adam Smith (La Richesse des nations, 1776) selon lequel un pays dispose d'un avantage absolu dans la production d'un bien s'il peut le produire en utilisant moins de ressources (moins d'heures de travail, par exemple) que tout autre pays. Smith en déduit que chaque pays devrait se spécialiser dans les biens où il est le plus productif et échanger les autres. Toutefois, cette théorie ne peut expliquer le commerce entre un pays productif dans tous les domaines et un pays moins productif partout. C'est la limite que Ricardo a dépassée avec la théorie de l'avantage comparatif : même un pays sans avantage absolu dans aucun bien a intérêt à commercer en se spécialisant dans le bien où son désavantage est le moindre. L'avantage absolu reste pertinent pour comprendre les spécialisations fondées sur les dotations naturelles (pétrole pour l'Arabie Saoudite, terres agricoles pour le Brésil).",
    relatedModules: ['avantages-comparatifs'],
    category: 'Commerce international',
  },
  {
    term: 'Termes de l\'échange',
    definition:
      "Rapport entre l'indice des prix des exportations et l'indice des prix des importations d'un pays : T = (Px/Pm) x 100. Une amélioration des termes de l'échange (hausse de l'indice) signifie qu'une même quantité d'exportations permet d'acheter davantage d'importations : le pouvoir d'achat international du pays augmente. Une détérioration (baisse) signifie l'inverse. Les pays exportateurs de matières premières subissent souvent une détérioration séculaire de leurs termes de l'échange (thèse Prebisch-Singer), justifiant historiquement les stratégies d'industrialisation par substitution aux importations en Amérique latine. Les chocs pétroliers de 1973 et 1979 ont constitué une amélioration brutale des termes de l'échange pour les pays de l'OPEP et une détérioration pour les pays importateurs. La France, importatrice nette d'énergie, a subi une dégradation de ses termes de l'échange en 2021-2022 avec la hausse des prix du gaz et du pétrole.",
    relatedModules: ['avantages-comparatifs', 'taux-de-change', 'carre-magique-kaldor'],
    category: 'Commerce international',
  },
  {
    term: 'Balance commerciale et balance des paiements',
    definition:
      "La balance commerciale mesure la différence entre la valeur des exportations et des importations de biens et services d'un pays sur une période donnée. Un excédent commercial signifie que les exportations dépassent les importations. La balance des paiements est un document comptable plus large, établi par la Banque de France selon les normes du FMI (BPM6), qui enregistre l'ensemble des transactions économiques entre résidents et non-résidents. Elle comprend trois comptes : le compte des transactions courantes (balance commerciale + revenus primaires + revenus secondaires), le compte de capital (transferts en capital, acquisitions d'actifs non financiers) et le compte financier (investissements directs, investissements de portefeuille, autres investissements, avoirs de réserve). Par construction comptable, la somme des trois comptes (plus les erreurs et omissions) est nulle : un déficit courant est nécessairement financé par un excédent du compte financier (entrées de capitaux). La France affiche un déficit courant d'environ 1 % du PIB depuis les années 2000.",
    relatedModules: ['carre-magique-kaldor', 'taux-de-change'],
    category: 'Commerce international',
  },
  {
    term: 'Protectionnisme vs libre-échange',
    definition:
      "Le libre-échange désigne une politique commerciale fondée sur l'absence de barrières aux échanges internationaux, justifiée théoriquement par les gains mutuels du commerce (Ricardo, HOS). Le protectionnisme désigne l'ensemble des mesures visant à protéger la production nationale de la concurrence étrangère : droits de douane (tarifs), quotas (contingentements), subventions à l'exportation, normes techniques et sanitaires (barrières non tarifaires), et manipulations de change. Les arguments en faveur du protectionnisme incluent : la protection des industries naissantes (Friedrich List, industrie dans l'enfance), le maintien de l'emploi dans les secteurs menacés, la préservation de l'indépendance stratégique, la lutte contre le dumping social et environnemental, et l'argument des termes de l'échange (tarif optimal). Le mouvement historique va de l'ouverture progressive sous le GATT/OMC (1947-2000) à un retour du néo-protectionnisme (guerre commerciale USA-Chine depuis 2018, relocalisation post-Covid).",
    relatedModules: ['avantages-comparatifs', 'taux-de-change'],
    category: 'Commerce international',
  },
  {
    term: 'Division internationale du travail (DIT)',
    definition:
      "Spécialisation des pays dans certaines productions, fondée sur les avantages comparatifs, les dotations factorielles et les choix stratégiques. La DIT traditionnelle (XIXe-milieu XXe siècle) opposait les pays du Nord, spécialisés dans les produits manufacturés, aux pays du Sud, exportateurs de matières premières et de produits agricoles. La nouvelle DIT (à partir des années 1970-1980) est marquée par l'émergence des nouveaux pays industrialisés (NPI - Corée du Sud, Taïwan, puis Chine, Inde) et par la fragmentation des chaînes de valeur mondiales : un même produit (iPhone, Airbus) est conçu, fabriqué et assemblé dans plusieurs pays différents. Cette décomposition internationale des processus productifs (DIPP, concept de Bernis et Lassudrie-Duchêne) est favorisée par la baisse des coûts de transport et de communication, la libéralisation commerciale et les IDE. Elle crée des interdépendances mais aussi des vulnérabilités (ruptures d'approvisionnement, comme pendant la crise Covid-19).",
    relatedModules: ['avantages-comparatifs'],
    category: 'Commerce international',
  },
  {
    term: 'Fragmentation de la chaîne de valeur',
    definition:
      "Décomposition du processus de production d'un bien ou service en étapes distinctes réalisées dans différents pays, en fonction des avantages comparatifs de chacun. Également appelée décomposition internationale des processus productifs (DIPP) ou « commerce de tâches » (trade in tasks, Grossman et Rossi-Hansberg, 2008). Par exemple, un smartphone peut être conçu aux États-Unis (R&D), ses composants fabriqués en Corée du Sud (semi-conducteurs), au Japon (écrans) et en Chine (assemblage final). Selon l'OMC et l'OCDE, le commerce en valeur ajoutée montre que 60 à 70 % du commerce mondial est constitué de biens intermédiaires circulant au sein de ces chaînes globales de valeur (CGV). Cette organisation accroît l'efficacité productive mais augmente la vulnérabilité aux chocs (pandémie, guerre, catastrophe naturelle) et pose des défis de mesure statistique (les exportations brutes surestiment la valeur ajoutée domestique). La crise Covid-19 et les tensions géopolitiques ont relancé les débats sur la « relocalisation » et la « résilience » des chaînes d'approvisionnement.",
    relatedModules: ['avantages-comparatifs', 'taux-de-change'],
    category: 'Commerce international',
  },
  {
    term: 'Taux de change réel et compétitivité-prix',
    definition:
      "Le taux de change réel (TCR) est le taux de change nominal ajusté des niveaux de prix relatifs entre deux pays : TCR = e x (P*/P), où e est le taux de change nominal (nombre d'unités de monnaie nationale pour une unité de monnaie étrangère), P* le niveau des prix étrangers et P le niveau des prix nationaux. Une appréciation réelle (hausse du TCR en cotation au certain, ou baisse en cotation à l'incertain) signifie une perte de compétitivité-prix : les produits nationaux deviennent relativement plus chers que les produits étrangers. La compétitivité-prix dépend donc à la fois du taux de change nominal et de l'écart d'inflation avec les partenaires commerciaux. C'est pourquoi, au sein de la zone euro (taux de change nominal fixe entre pays membres), les divergences d'inflation créent des écarts de compétitivité-prix persistants : l'Allemagne, avec une inflation structurellement plus basse, a gagné en compétitivité par rapport à l'Europe du Sud dans les années 2000.",
    relatedModules: ['taux-de-change', 'avantages-comparatifs', 'carre-magique-kaldor'],
    category: 'Commerce international',
  },
  {
    term: 'Dévaluation vs dépréciation',
    definition:
      "La dévaluation est une décision politique des autorités monétaires de réduire la valeur officielle de la monnaie nationale par rapport à une ou plusieurs monnaies étrangères, dans un régime de change fixe (ou semi-fixe). La France a procédé à plusieurs dévaluations du franc entre 1981 et 1986, notamment en 1982 et 1983, dans le cadre du Système monétaire européen (SME). La dépréciation, en revanche, est une baisse de la valeur de la monnaie résultant des forces du marché (offre et demande de devises) dans un régime de change flottant. Par exemple, l'euro s'est déprécié face au dollar en 2022, passant brièvement sous la parité. Les deux phénomènes ont des effets économiques similaires : amélioration de la compétitivité-prix (les exportations deviennent moins chères en devises étrangères), renchérissement des importations, et inflation importée. L'amélioration de la balance commerciale n'est pas immédiate - la courbe en J décrit la détérioration initiale avant l'amélioration, conformément à la condition de Marshall-Lerner.",
    relatedModules: ['taux-de-change', 'carre-magique-kaldor'],
    category: 'Commerce international',
  },
  {
    term: 'Condition de Marshall-Lerner et courbe en J',
    definition:
      "La condition de Marshall-Lerner stipule qu'une dévaluation (ou dépréciation) de la monnaie nationale améliore la balance commerciale si, et seulement si, la somme des élasticités-prix de la demande d'exportations et de la demande d'importations est supérieure à 1 en valeur absolue (|εx| + |εm| > 1). Lorsque cette condition est vérifiée, l'effet volume (hausse des quantités exportées, baisse des quantités importées) l'emporte sur l'effet prix (renchérissement des importations). La courbe en J décrit la dynamique temporelle : à court terme, les élasticités sont faibles (les contrats sont en cours, les habitudes de consommation sont rigides) et la balance commerciale se détériore (partie descendante du J) car le renchérissement des importations domine. À moyen terme (6-18 mois), les quantités s'ajustent, les exportations augmentent et les importations diminuent, améliorant la balance (partie ascendante du J). Ce délai d'ajustement est un argument classique contre les politiques de dévaluation compétitive.",
    relatedModules: ['taux-de-change'],
    category: 'Commerce international',
  },

  // ═══════════════════════════════════════════════════════════════════════
  // INEGALITES ET PROTECTION SOCIALE
  // ═══════════════════════════════════════════════════════════════════════
  {
    term: 'Coefficient de Gini',
    definition:
      "Indicateur synthétique de mesure des inégalités, compris entre 0 (égalité parfaite : tous les individus ont le même revenu) et 1 (inégalité maximale : un seul individu détient tout le revenu). Mathématiquement, il correspond au rapport de l'aire comprise entre la courbe de Lorenz et la diagonale d'égalité (aire de concentration) sur l'aire totale du triangle sous la diagonale : G = A/(A+B), soit G = 2A. Le coefficient de Gini des revenus disponibles (après redistribution) est d'environ 0,29 en France (INSEE, 2023), 0,39 aux États-Unis (Census Bureau), 0,26 en Suède et 0,63 en Afrique du Sud, l'un des pays les plus inégalitaires au monde. Le Gini peut être calculé pour les revenus, le patrimoine (généralement plus élevé, autour de 0,65 en France), les salaires, ou toute autre distribution. Ses limites : il ne renseigne pas sur la localisation des inégalités (deux distributions très différentes peuvent avoir le même Gini si les courbes de Lorenz se croisent).",
    relatedModules: ['courbe-de-lorenz-gini', 'fiscalite-redistribution'],
    category: 'Inégalités et protection sociale',
  },
  {
    term: 'Courbe de Lorenz',
    definition:
      "Représentation graphique de la répartition des revenus (ou du patrimoine) dans une population, développée par Max Lorenz (1905). L'axe horizontal porte les parts cumulées de la population, classées du plus pauvre au plus riche (en %). L'axe vertical porte les parts cumulées du revenu (ou patrimoine) total détenues par ces populations cumulées. La diagonale (droite à 45°) représente l'égalité parfaite : les x % les plus pauvres détiennent x % du revenu. Plus la courbe de Lorenz s'éloigne de la diagonale (se creuse vers le bas), plus les inégalités sont fortes. Par exemple, en France, les 20 % les plus pauvres détiennent environ 9 % du revenu disponible total, tandis que les 20 % les plus riches en détiennent environ 38 %. La courbe de Lorenz permet de visualiser l'effet de la redistribution : la courbe des revenus disponibles (après impôts et transferts) est plus proche de la diagonale que celle des revenus primaires (avant redistribution), illustrant l'effet réducteur d'inégalités du système socio-fiscal.",
    relatedModules: ['courbe-de-lorenz-gini', 'fiscalite-redistribution'],
    category: 'Inégalités et protection sociale',
  },
  {
    term: 'Déciles et centiles de revenus',
    definition:
      "Outils statistiques de découpage d'une distribution en parts égales, utilisés pour analyser les inégalités de revenus. Les déciles divisent la population, classée par revenu croissant, en 10 groupes de taille égale (10 % chacun). Le premier décile (D1) est le seuil de revenu en dessous duquel se situent les 10 % les plus pauvres ; le neuvième décile (D9) est le seuil en dessous duquel se situent 90 % de la population. Le rapport interdécile D9/D1 est un indicateur d'inégalité courant : en France, il est d'environ 3,4 pour le niveau de vie (INSEE), signifiant que le seuil du décile le plus aisé est 3,4 fois supérieur au seuil du décile le plus modeste. Les centiles divisent la population en 100 groupes de 1 %. Le centile P99 (les 1 % les plus riches) concentre environ 10 % des revenus en France et 20 % aux États-Unis (données World Inequality Database, Piketty-Saez-Zucman). L'analyse par centiles supérieurs est indispensable pour étudier la concentration des richesses au sommet de la distribution.",
    relatedModules: ['courbe-de-lorenz-gini', 'fiscalite-redistribution'],
    category: 'Inégalités et protection sociale',
  },
  {
    term: 'Revenu disponible',
    definition:
      "Revenu dont disposent effectivement les ménages pour consommer et épargner, après prise en compte de l'ensemble des prélèvements obligatoires et des transferts sociaux. Selon la définition de l'INSEE : Revenu disponible = Revenus primaires (salaires + revenus du patrimoine + revenus mixtes des indépendants) - Prélèvements obligatoires (impôt sur le revenu, CSG, CRDS, cotisations sociales) + Prestations sociales (allocations familiales, minima sociaux, aides au logement). Le revenu disponible ajusté (RDA) intègre en outre les transferts sociaux en nature (éducation, santé publique). Le niveau de vie est le revenu disponible du ménage divisé par le nombre d'unités de consommation (échelle d'équivalence de l'OCDE modifiée : 1 UC pour le premier adulte, 0,5 pour les autres personnes de 14 ans ou plus, 0,3 pour les enfants de moins de 14 ans). En France, le niveau de vie médian est d'environ 24 000 euros par an et par UC (INSEE, 2023).",
    relatedModules: ['fiscalite-redistribution', 'courbe-de-lorenz-gini'],
    category: 'Inégalités et protection sociale',
  },
  {
    term: 'Prestations sociales contributives vs non contributives',
    definition:
      "Les prestations sociales contributives sont des droits acquis en contrepartie de cotisations sociales préalables, relevant de la logique assurantielle (bismarckienne). Elles sont proportionnelles aux cotisations versées et à la durée de cotisation : retraites (pensions proportionnelles au salaire de référence et à la durée de cotisation), indemnités journalières de maladie, allocations chômage (ARE, dont le montant dépend du salaire antérieur et de la durée d'affiliation). Les prestations non contributives sont versées sous condition de ressources, indépendamment de toute cotisation préalable, relevant de la logique d'assistance (beveridgienne). Elles visent à garantir un revenu minimum : RSA (Revenu de solidarité active), AAH (Allocation aux adultes handicapés), ASS (Allocation de solidarité spécifique), allocations familiales sous conditions de ressources, CMU-C/C2S. Le système français de protection sociale est hybride, combinant les deux logiques. Le financement a évolué : la CSG (1991), impôt proportionnel sur tous les revenus, a partiellement remplacé les cotisations salariales, « fiscalisant » une partie de la protection sociale.",
    relatedModules: ['fiscalite-redistribution', 'courbe-de-lorenz-gini'],
    category: 'Inégalités et protection sociale',
  },
  {
    term: 'Pauvreté relative vs pauvreté absolue',
    definition:
      "Deux approches complémentaires de la mesure de la pauvreté. La pauvreté absolue, utilisée par la Banque mondiale, définit un seuil fixe de revenu en dessous duquel un individu ne peut satisfaire ses besoins fondamentaux (alimentation, logement, habillement). Le seuil international de pauvreté extrême est de 2,15 dollars PPA par jour (révisé en 2022). La pauvreté relative, privilégiée en Europe (Eurostat, INSEE), est définie par rapport au niveau de vie médian de la société : est considéré comme pauvre tout individu dont le niveau de vie est inférieur à un seuil conventionnel, fixé à 60 % du niveau de vie médian (convention européenne) ou 50 % (convention OCDE et ancienne convention INSEE). En France, au seuil de 60 %, le taux de pauvreté est d'environ 14,5 % (soit 9,1 millions de personnes, INSEE 2023), avec un seuil d'environ 1 200 euros mensuels pour une personne seule. La pauvreté relative peut augmenter même si le niveau de vie des plus pauvres s'améliore, dès lors que le revenu médian progresse plus vite.",
    relatedModules: ['courbe-de-lorenz-gini', 'fiscalite-redistribution'],
    category: 'Inégalités et protection sociale',
  },
  {
    term: 'Mobilité sociale',
    definition:
      "Changement de position dans la hiérarchie sociale, analysé selon deux dimensions principales. La mobilité intergénérationnelle compare la position sociale d'un individu à celle de ses parents (généralement le père, dans les tables de mobilité de l'INSEE) : elle mesure la fluidité sociale et l'égalité des chances. La mobilité professionnelle (intragénérationnelle) concerne les changements de position au cours de la carrière d'un même individu. On distingue la mobilité structurelle (due aux transformations de la structure des emplois - tertiarisation, montée des qualifications - qui créent mécaniquement de la mobilité ascendante) de la mobilité nette ou de circulation (mobilité « pure » une fois corrigée des effets structurels). Les tables de mobilité (INSEE) et les odds ratios (rapports des chances relatives, Erikson-Goldthorpe) montrent qu'en France, malgré une mobilité structurelle importante, la reproduction sociale reste forte : un fils de cadre a 4,5 fois plus de chances de devenir cadre qu'un fils d'ouvrier (données INSEE 2023). Les travaux de Pierre Bourdieu sur le capital culturel et de Raymond Boudon sur l'inégalité des chances éclairent les mécanismes de cette reproduction.",
    relatedModules: ['courbe-de-lorenz-gini'],
    category: 'Inégalités et protection sociale',
  },

  // ═══════════════════════════════════════════════════════════════════════
  // INSTITUTIONS
  // ═══════════════════════════════════════════════════════════════════════
  {
    term: 'BCE (Banque Centrale Européenne)',
    definition:
      "Institution monétaire de la zone euro, créée en 1998 et siégeant à Francfort, chargée de conduire la politique monétaire unique pour les pays ayant adopté l'euro (20 pays en 2024). Son mandat principal, inscrit dans le traité de Maastricht (article 127 TFUE), est la stabilité des prix, définie comme une inflation de 2 % à moyen terme (objectif symétrique révisé en 2021). La BCE est indépendante du pouvoir politique (indépendance organique et fonctionnelle). Son organe de décision est le Conseil des gouverneurs (6 membres du directoire + gouverneurs des banques centrales nationales). Ses instruments sont les taux directeurs (taux de refinancement, taux de facilité de dépôt, taux de prêt marginal), les opérations d'open market, les réserves obligatoires, et depuis 2015 les programmes d'achats d'actifs (APP, PEPP). La BCE supervise également les banques systémiques de la zone euro dans le cadre du Mécanisme de surveillance unique (MSU/SSM) depuis 2014.",
    relatedModules: ['creation-monetaire', 'is-lm', 'courbe-de-phillips'],
    category: 'Institutions',
  },
  {
    term: 'FMI (Fonds Monétaire International) et Banque mondiale',
    definition:
      "Deux institutions de Bretton Woods créées en 1944, aux missions distinctes mais complémentaires. Le FMI (189 pays membres, siège à Washington) a pour mission d'assurer la stabilité du système monétaire international : surveillance des politiques macroéconomiques (Article IV), assistance financière aux pays en difficulté de balance des paiements (prêts conditionnels assortis de programmes d'ajustement structurel), et assistance technique. Ses ressources proviennent des quotes-parts des pays membres (DTS - Droits de Tirage Spéciaux). La Banque mondiale (BIRD + AID) finance des projets de développement à long terme (infrastructures, éducation, santé) dans les pays en développement, par des prêts à taux préférentiel ou des dons. Ces deux institutions ont fait l'objet de critiques : conditionnalité excessive et effets sociaux négatifs des plans d'ajustement structurel (consensus de Washington), sous-représentation des pays émergents dans la gouvernance, et inadaptation aux crises financières modernes. Les réformes de 2010 ont partiellement rééquilibré les droits de vote au profit des BRICS.",
    relatedModules: ['taux-de-change', 'carre-magique-kaldor'],
    category: 'Institutions',
  },
  {
    term: 'OMC (Organisation Mondiale du Commerce) et GATT',
    definition:
      "Le GATT (General Agreement on Tariffs and Trade, 1947) était un accord multilatéral visant à libéraliser le commerce international par la réduction progressive des droits de douane et l'élimination des barrières non tarifaires. Ses principes fondamentaux étaient la clause de la nation la plus favorisée (NPF : tout avantage commercial accordé à un pays doit être étendu à tous les membres), le traitement national (les produits importés ne doivent pas être discriminés par rapport aux produits nationaux une fois sur le territoire) et la réciprocité. Huit cycles de négociations (dont le Kennedy Round et le Tokyo Round) ont réduit les droits de douane moyens de 40 % à environ 4 %. L'OMC, créée en 1995 à l'issue du cycle d'Uruguay (Accords de Marrakech), a remplacé le GATT avec un cadre institutionnel permanent, un mécanisme contraignant de règlement des différends (Organe d'appel) et un champ élargi aux services (AGCS) et à la propriété intellectuelle (ADPIC). Le cycle de Doha (2001), censé intégrer les préoccupations des pays en développement, est dans l'impasse depuis 2008. L'OMC compte 164 membres en 2024.",
    relatedModules: ['avantages-comparatifs', 'taux-de-change'],
    category: 'Institutions',
  },
  {
    term: 'Pacte de stabilité et de croissance (PSC)',
    definition:
      "Cadre de gouvernance budgétaire de l'Union européenne, adopté en 1997 (Conseil d'Amsterdam), visant à maintenir la discipline budgétaire des États membres et à prévenir les déficits excessifs qui pourraient menacer la stabilité de la monnaie unique. Les critères centraux, hérités du traité de Maastricht (1992), sont : un déficit public inférieur à 3 % du PIB et une dette publique inférieure à 60 % du PIB (ou en diminution suffisante). Le volet préventif fixe des objectifs de moyen terme (OMT) de solde structurel proche de l'équilibre. Le volet correctif (procédure de déficit excessif, PDE) peut théoriquement conduire à des sanctions financières, mais celles-ci n'ont jamais été appliquées, même lorsque la France et l'Allemagne ont enfreint les règles en 2003. Le PSC a été suspendu entre 2020 et 2023 (clause dérogatoire Covid) puis réformé en 2024, avec des trajectoires d'ajustement plus individualisées et une prise en compte de l'investissement public. Ses critiques pointent son caractère pro-cyclique (austérité en récession) et l'absence de coordination budgétaire positive entre pays membres.",
    relatedModules: ['carre-magique-kaldor', 'multiplicateur-keynesien', 'donnees-historiques'],
    category: 'Institutions',
  },

  // ═══════════════════════════════════════════════════════════════════════
  // MARCHE DU TRAVAIL (compléments)
  // ═══════════════════════════════════════════════════════════════════════
  {
    term: 'Salaire minimum (SMIC)',
    definition:
      "Salaire horaire minimum légal en dessous duquel aucun salarié ne peut être rémunéré en France, instauré en 1950 (SMIG) puis réformé en 1970 (SMIC - Salaire Minimum Interprofessionnel de Croissance). Son montant est revalorisé au 1er janvier de chaque année en fonction de l'inflation (indice des prix à la consommation des ménages du premier quintile) et de la moitié du gain de pouvoir d'achat du salaire horaire moyen des ouvriers et employés. Le gouvernement peut ajouter un « coup de pouce » discrétionnaire. En 2024, le SMIC brut est d'environ 1 767 euros mensuels (pour 35 heures). Le débat économique sur le salaire minimum oppose deux visions : l'analyse néoclassique standard prédit qu'un salaire plancher supérieur au salaire d'équilibre crée du chômage (excès d'offre de travail) ; les travaux empiriques de Card et Krueger (1994) sur le New Jersey ont montré qu'une hausse modérée du salaire minimum peut être neutre, voire positive sur l'emploi (modèle de monopsone). L'effet dépend du niveau du SMIC par rapport au salaire médian (indice de Kaitz, environ 61 % en France, parmi les plus élevés de l'OCDE).",
    relatedModules: ['offre-et-demande', 'courbe-de-phillips'],
    category: 'Marché du travail',
  },
  {
    term: 'Chômage structurel vs chômage conjoncturel',
    definition:
      "Le chômage conjoncturel (ou cyclique) résulte d'une insuffisance temporaire de la demande globale par rapport aux capacités de production de l'économie. Il apparaît en période de récession et se résorbe lors de la reprise : c'est le « chômage keynésien », traitable par des politiques de relance (budgétaire ou monétaire). Le chômage structurel résulte de facteurs durables liés au fonctionnement du marché du travail : inadéquation entre les qualifications offertes et demandées (mismatch), rigidités salariales (SMIC, conventions collectives), réglementation du travail (coût du licenciement), insuffisante mobilité géographique, ou transformation technologique. Il correspond au NAIRU et ne peut être réduit que par des réformes structurelles (formation professionnelle, flexibilisation, allègements de charges). On peut ajouter le chômage frictionnel (temps de transition entre deux emplois, incompressible et même souhaitable) et le chômage classique (salaire réel supérieur à la productivité marginale, analyse néoclassique). En France, le débat porte sur la part respective du chômage structurel (estimé entre 7 % et 8 %) et conjoncturel.",
    relatedModules: ['courbe-de-phillips', 'ad-as', 'carre-magique-kaldor'],
    category: 'Marché du travail',
  },

  // ═══════════════════════════════════════════════════════════════════════
  // MONNAIE ET FINANCE (compléments)
  // ═══════════════════════════════════════════════════════════════════════
  {
    term: 'Quantitative easing (assouplissement quantitatif)',
    definition:
      "Politique monétaire non conventionnelle consistant, pour une banque centrale, à acheter massivement des titres financiers (obligations d'État, titres de dette d'entreprise, titres adossés à des créances hypothécaires) sur les marchés secondaires, dans le but d'injecter de la liquidité dans l'économie et de faire baisser les taux d'intérêt à long terme lorsque les taux directeurs ont atteint leur plancher effectif (zero lower bound). Le mécanisme agit par plusieurs canaux : effet de portefeuille (les vendeurs de titres réinvestissent dans des actifs plus risqués), effet de signalement (engagement implicite de maintenir les taux bas), et effet de richesse (hausse des prix des actifs financiers). La Fed a mené trois programmes de QE entre 2008 et 2014 (total de plus de 4 500 milliards de dollars). La BCE a lancé son programme d'achats d'actifs (APP) en mars 2015 puis le PEPP en 2020 (pandémie), totalisant plus de 5 000 milliards d'euros. Les critiques portent sur le risque de bulles financières, l'accroissement des inégalités de patrimoine et la dépendance des marchés à la liquidité de la banque centrale.",
    relatedModules: ['creation-monetaire', 'is-lm'],
    category: 'Monnaie et finance',
  },
  {
    term: 'Théorie quantitative de la monnaie',
    definition:
      "Théorie selon laquelle le niveau général des prix est proportionnel à la quantité de monnaie en circulation, formalisée par l'équation des échanges d'Irving Fisher (1911) : MV = PY, où M est la masse monétaire, V la vitesse de circulation de la monnaie, P le niveau général des prix et Y le volume de la production réelle. Si l'on suppose V stable (hypothèse monétariste) et Y déterminé par les facteurs réels à long terme (PIB potentiel), alors toute augmentation de M se traduit par une hausse proportionnelle de P : « l'inflation est toujours et partout un phénomène monétaire » (Milton Friedman). Cette théorie, dont les origines remontent à Jean Bodin (XVIe siècle) et David Hume (XVIIIe siècle), a été réactivée par le courant monétariste dans les années 1970. Keynes la conteste en montrant que V n'est pas stable (elle dépend du taux d'intérêt via la préférence pour la liquidité) et que Y peut varier (sous-emploi). Empiriquement, la relation M-P est vérifiée à long terme et pour les fortes inflations, mais beaucoup plus instable à court terme et dans les économies à faible inflation.",
    relatedModules: ['creation-monetaire', 'courbe-de-phillips', 'is-lm'],
    category: 'Monnaie et finance',
  },

  // ═══════════════════════════════════════════════════════════════════════
  // MACROECONOMIE (compléments)
  // ═══════════════════════════════════════════════════════════════════════
  {
    term: 'PIB potentiel et écart de production (output gap)',
    definition:
      "Le PIB potentiel représente le niveau maximal de production qu'une économie peut soutenir durablement sans générer de tensions inflationnistes, c'est-à-dire en utilisant pleinement ses facteurs de production (travail, capital) à leur niveau d'équilibre. Il n'est pas directement observable et fait l'objet d'estimations (méthodes statistiques : filtre de Hodrick-Prescott ; méthodes structurelles : fonction de production, Commission européenne). L'écart de production (output gap) mesure la différence entre le PIB effectif et le PIB potentiel, en pourcentage du PIB potentiel. Un output gap négatif (PIB effectif < PIB potentiel) signale une sous-utilisation des capacités et des pressions déflationnistes ; un output gap positif signale une surchauffe et des pressions inflationnistes. Ce concept est central pour la politique économique : la politique budgétaire discrétionnaire devrait être contra-cyclique (expansionniste quand l'output gap est négatif, restrictive quand il est positif). Le solde structurel des finances publiques est calculé en corrigeant le solde effectif de l'effet du cycle (output gap).",
    relatedModules: ['ad-as', 'courbe-de-phillips', 'carre-magique-kaldor', 'donnees-historiques'],
    category: 'Macroéconomie',
  },
  {
    term: 'Croissance endogène',
    definition:
      "Famille de modèles théoriques développés à partir des années 1980 (Romer, 1986 ; Lucas, 1988 ; Barro, 1990 ; Aghion et Howitt, 1992) qui endogénéisent le progrès technique, c'est-à-dire l'expliquent par des décisions économiques, contrairement au modèle de Solow (1956) où le progrès technique est exogène (« tombé du ciel »). Les sources de la croissance endogène sont : le capital humain (investissement en éducation et santé, Lucas), la R&D et l'innovation (Romer : les idées sont des biens non rivaux qui génèrent des rendements croissants), les infrastructures publiques (Barro : les dépenses publiques productives améliorent la productivité privée), et la destruction créatrice (Aghion-Howitt, reprenant Schumpeter). Ces modèles justifient l'intervention publique en faveur de l'éducation, de la recherche et des infrastructures, car le marché sous-investit dans ces domaines en raison des externalités positives et de la non-rivalité des connaissances. Ils expliquent aussi la persistance des écarts de développement entre pays (absence de convergence automatique).",
    relatedModules: ['ad-as', 'frontiere-possibilites-production', 'donnees-historiques'],
    category: 'Macroéconomie',
  },
  {
    term: 'Investissement (FBCF)',
    definition:
      "La Formation Brute de Capital Fixe (FBCF) mesure la valeur des actifs fixes acquis par les agents économiques (entreprises, ménages, administrations publiques) pour être utilisés dans le processus de production pendant au moins un an. Elle comprend les achats de biens d'équipement (machines, matériel de transport), les constructions (bâtiments industriels, logements neufs), les logiciels et bases de données, et la R&D capitalisée (depuis le SEC 2010). La FBCF représente environ 25 % du PIB en France. Le taux d'investissement (FBCF/PIB) est un déterminant crucial de la croissance future. L'investissement dépend du taux d'intérêt réel (coût du capital), des anticipations de demande (principe de l'accélérateur), du taux de profit (autofinancement), du climat des affaires et de l'incertitude. Keynes insistait sur le rôle des « esprits animaux » (animal spirits) des entrepreneurs : l'investissement est la composante la plus volatile de la demande agrégée, source majeure des fluctuations conjoncturelles.",
    relatedModules: ['is-lm', 'multiplicateur-keynesien', 'ad-as', 'donnees-historiques'],
    category: 'Macroéconomie',
  },
  {
    term: 'Dette publique',
    definition:
      "Ensemble des engagements financiers de l'État et des administrations publiques (État, collectivités locales, sécurité sociale) résultant de l'accumulation des déficits budgétaires passés. Elle est mesurée au sens de Maastricht (dette brute consolidée, selon le protocole du traité) et rapportée au PIB pour les comparaisons internationales. En France, la dette publique a franchi le seuil de 110 % du PIB en 2024 (environ 3 200 milliards d'euros). Le débat sur la soutenabilité de la dette porte sur plusieurs indicateurs : le ratio dette/PIB et sa dynamique (condition de stabilisation : solde primaire suffisant pour compenser l'effet « boule de neige » - quand le taux d'intérêt apparent dépasse le taux de croissance nominale), la charge d'intérêts (environ 50 milliards d'euros en France, deuxième poste budgétaire), et la structure de la dette (maturité, part détenue par les non-résidents, taux fixe vs variable). L'approche ricardienne (Barro, 1974) considère que dette et impôt sont équivalents car les agents anticipent les impôts futurs. Les keynésiens soulignent que la dette peut être soutenable si elle finance des investissements productifs qui augmentent le PIB futur.",
    relatedModules: ['multiplicateur-keynesien', 'courbe-de-laffer', 'donnees-historiques'],
    category: 'Macroéconomie',
  },

  // ═══════════════════════════════════════════════════════════════════════
  // MICROECONOMIE (compléments)
  // ═══════════════════════════════════════════════════════════════════════
  {
    term: 'Concurrence pure et parfaite',
    definition:
      "Modèle théorique de marché reposant sur cinq conditions : atomicité (grand nombre d'acheteurs et de vendeurs, aucun ne pouvant influencer le prix), homogénéité du produit (biens identiques, substituables parfaitement), libre entrée et sortie (absence de barrières), transparence de l'information (tous les agents connaissent les prix et les qualités), et mobilité parfaite des facteurs de production. Dans ce cadre, le prix est un « donné » pour chaque agent (price-taker). À l'équilibre de long terme, le prix est égal au coût marginal (P = Cm) et au minimum du coût moyen : le profit économique est nul (les entreprises couvrent exactement leurs coûts, y compris la rémunération normale du capital). Ce modèle, formalisé par Walras et Marshall, sert de benchmark (référence) pour évaluer les inefficiences des marchés réels. Les écarts par rapport à la concurrence parfaite (monopole, oligopole, concurrence monopolistique) sont étudiés en économie industrielle. Edward Chamberlin (1933) et Joan Robinson (1933) ont développé la théorie de la concurrence imparfaite.",
    relatedModules: ['concurrence-monopole', 'offre-et-demande'],
    category: 'Microéconomie',
  },

  // ═══════════════════════════════════════════════════════════════════════
  // COMMERCE INTERNATIONAL (compléments)
  // ═══════════════════════════════════════════════════════════════════════
  {
    term: 'IDE (Investissements Directs à l\'Étranger)',
    definition:
      "Investissements réalisés par une entreprise résidente d'un pays dans une entreprise située dans un autre pays, avec l'intention d'acquérir un intérêt durable et d'exercer une influence significative sur la gestion (seuil conventionnel : détention d'au moins 10 % du capital social, selon la définition du FMI et de l'OCDE). On distingue les IDE entrants (investissements étrangers dans le pays) et les IDE sortants (investissements du pays à l'étranger). Les IDE prennent trois formes : création d'une filiale ex nihilo (greenfield investment), acquisition ou fusion avec une entreprise existante (brownfield), et investissement d'expansion d'une filiale existante. Les déterminants des IDE combinent des facteurs d'attraction (taille du marché, coûts de production, fiscalité, stabilité institutionnelle, qualité des infrastructures) et des motivations stratégiques des entreprises (accès aux marchés, accès aux ressources, efficacité productive, actifs stratégiques). La France est à la fois un grand pays d'accueil et d'origine des IDE (environ 40 milliards d'euros entrants par an, Banque de France).",
    relatedModules: ['avantages-comparatifs', 'taux-de-change'],
    category: 'Commerce international',
  },

  // ═══════════════════════════════════════════════════════════════════════
  // POLITIQUE ECONOMIQUE (compléments)
  // ═══════════════════════════════════════════════════════════════════════
  {
    term: 'Policy mix',
    definition:
      "Combinaison de la politique budgétaire (responsabilité du gouvernement) et de la politique monétaire (responsabilité de la banque centrale) mises en oeuvre simultanément pour atteindre les objectifs macroéconomiques. Le policy mix optimal dépend de la nature du choc et du régime de change. En économie fermée (modèle IS-LM), une relance budgétaire déplace IS vers la droite (hausse de Y et de r), tandis qu'une politique monétaire accommodante déplace LM vers la droite (baisse de r), neutralisant l'effet d'éviction. En zone euro, la configuration institutionnelle crée une asymétrie : la politique monétaire est centralisée (BCE) tandis que les politiques budgétaires restent nationales (encadrées par le PSC). Le policy mix européen a souvent été critiqué : politique monétaire trop restrictive dans les années 2000, puis budgets trop austères en 2011-2013 alors que la BCE était expansionniste. Le Modèle Mundell-Fleming (IS-LM en économie ouverte) montre que l'efficacité relative des politiques dépend du régime de change (fixe ou flottant) et du degré de mobilité des capitaux.",
    relatedModules: ['is-lm', 'multiplicateur-keynesien', 'ad-as', 'carre-magique-kaldor'],
    category: 'Politique économique',
  },
  {
    term: 'Stabilisateurs automatiques',
    definition:
      "Mécanismes budgétaires qui atténuent spontanément les fluctuations conjoncturelles sans décision discrétionnaire du gouvernement. En période de récession, les recettes fiscales diminuent mécaniquement (baisse des revenus imposables, des bénéfices, de la consommation taxée à la TVA) tandis que les dépenses sociales augmentent automatiquement (hausse des allocations chômage, du RSA, des aides sociales) : le déficit se creuse et soutient la demande. En période d'expansion, le phénomène inverse freine la surchauffe. L'ampleur des stabilisateurs automatiques dépend de la taille du secteur public dans l'économie : ils sont plus puissants en France (dépenses publiques à 57 % du PIB) qu'aux États-Unis (38 %). Selon l'OCDE, les stabilisateurs automatiques absorbent environ 25-30 % d'un choc conjoncturel dans les pays de la zone euro. Leur avantage est la rapidité et l'absence de délai décisionnel (contrairement aux plans de relance discrétionnaires qui nécessitent un vote parlementaire et une mise en oeuvre administrative).",
    relatedModules: ['multiplicateur-keynesien', 'carre-magique-kaldor', 'courbe-de-laffer'],
    category: 'Politique économique',
  },

  // ═══════════════════════════════════════════════════════════════════════
  // MONNAIE ET FINANCE (compléments supplémentaires)
  // ═══════════════════════════════════════════════════════════════════════
  {
    term: 'Inflation sous-jacente (core inflation)',
    definition:
      "Mesure de l'inflation qui exclut les composantes les plus volatiles de l'indice des prix à la consommation, principalement l'énergie et l'alimentation fraîche (produits dont les prix fluctuent fortement en raison de facteurs saisonniers, géopolitiques ou climatiques). L'INSEE publie un indice d'inflation sous-jacente qui exclut également les prix soumis à l'intervention de l'État (tabac, tarifs publics). Cette mesure permet de dégager la tendance de fond de l'inflation, reflétant les pressions internes sur les prix (salaires, marges, demande domestique). Elle est suivie de près par les banques centrales pour piloter la politique monétaire, car les variations temporaires des prix de l'énergie ne nécessitent pas de réponse monétaire. Lors du choc inflationniste de 2021-2023, l'inflation totale a atteint 6 % en zone euro tandis que l'inflation sous-jacente a culminé autour de 5,5 %, confirmant la diffusion des hausses de prix de l'énergie à l'ensemble de l'économie (effets de second tour).",
    relatedModules: ['courbe-de-phillips', 'carre-magique-kaldor', 'donnees-historiques'],
    category: 'Monnaie et finance',
  },

  // ═══════════════════════════════════════════════════════════════════════
  // MARCHE DU TRAVAIL (compléments supplémentaires)
  // ═══════════════════════════════════════════════════════════════════════
  {
    term: 'Halo du chômage',
    definition:
      "Ensemble des personnes qui ne sont pas comptabilisées comme chômeurs au sens du BIT mais qui se trouvent dans une situation de frontière entre inactivité et chômage. L'INSEE distingue trois composantes du halo du chômage : les personnes qui souhaitent travailler mais ne sont pas disponibles dans les deux semaines (maladie, garde d'enfants), celles qui souhaitent travailler et sont disponibles mais n'ont pas fait de recherche active dans les quatre dernières semaines (personnes « découragées »), et celles qui recherchent un emploi mais ne sont pas disponibles. En France, le halo du chômage concerne environ 1,9 million de personnes (INSEE, 2023), soit presque autant que le nombre de chômeurs BIT (2,3 millions). Ajouté au sous-emploi (personnes à temps partiel subi, environ 1,2 million), il révèle une réalité du marché du travail bien plus dégradée que ne le suggère le seul taux de chômage officiel. Le concept de « taux de non-emploi » (incluant chômeurs + halo + inactifs en âge de travailler) donne une image plus complète.",
    relatedModules: ['courbe-de-phillips', 'carre-magique-kaldor'],
    category: 'Marché du travail',
  },

  // ═══════════════════════════════════════════════════════════════════════
  // INEGALITES (compléments)
  // ═══════════════════════════════════════════════════════════════════════
  {
    term: 'Rapport interdécile (D9/D1)',
    definition:
      "Indicateur de dispersion des revenus calculé comme le rapport entre le neuvième décile (D9, seuil en dessous duquel se situent 90 % des individus) et le premier décile (D1, seuil en dessous duquel se situent 10 % des individus). En France, le rapport interdécile du niveau de vie est d'environ 3,4 (INSEE, 2023) : le seuil d'entrée dans les 10 % les plus aisés est 3,4 fois supérieur au seuil des 10 % les plus modestes. Cet indicateur est moins sensible aux valeurs extrêmes que le coefficient de Gini, car il ignore les revenus situés en dessous de D1 et au-dessus de D9. Il est complété par d'autres ratios : D5/D1 (inégalités dans la moitié basse de la distribution), D9/D5 (inégalités dans la moitié haute), et par les parts de revenu des centiles supérieurs (part du top 1 %, top 10 %) pour capter la concentration au sommet. Après redistribution (impôts et transferts), le rapport interdécile en France passe d'environ 5,5 (revenus primaires) à 3,4 (revenus disponibles), illustrant l'effet redistributif du système socio-fiscal.",
    relatedModules: ['courbe-de-lorenz-gini', 'fiscalite-redistribution'],
    category: 'Inégalités et protection sociale',
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
