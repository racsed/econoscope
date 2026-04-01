export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface ModuleQuiz {
  moduleSlug: string;
  questions: QuizQuestion[];
}

export const quizzes: ModuleQuiz[] = [
  // ── offre-et-demande ──────────────────────────────────────────────────
  {
    moduleSlug: 'offre-et-demande',
    questions: [
      {
        question: 'Si le cout de production augmente, que se passe-t-il sur le marche ?',
        options: [
          'Le prix monte et la quantite echangee baisse',
          'Le prix baisse et la quantite echangee monte',
          'Rien ne change',
          'Le prix monte et la quantite echangee monte aussi',
        ],
        correctIndex: 0,
        explanation:
          "Une hausse des couts deplace la courbe d'offre vers la gauche : les producteurs offrent moins a chaque niveau de prix. Le nouvel equilibre se situe a un prix plus eleve et une quantite plus faible.",
      },
      {
        question: 'Qui supporte reellement une taxe imposee aux vendeurs ?',
        options: [
          'Uniquement les vendeurs',
          'Uniquement les acheteurs',
          'Les deux, selon les elasticites respectives',
          'Personne, la taxe est neutre',
        ],
        correctIndex: 2,
        explanation:
          "L'incidence fiscale depend des elasticites de l'offre et de la demande. Le cote le moins elastique (le moins reactif au prix) supporte la plus grande part de la taxe, quel que soit le cote legalement taxe.",
      },
      {
        question: 'Que represente la perte seche sur un marche ?',
        options: [
          'La recette fiscale de l\'Etat',
          'Le profit des vendeurs',
          'Des echanges mutuellement benefiques qui n\'ont plus lieu',
          'Le surplus du consommateur',
        ],
        correctIndex: 2,
        explanation:
          "La perte seche (deadweight loss) mesure la valeur des echanges qui auraient profite a la fois aux acheteurs et aux vendeurs mais qui ne se realisent plus a cause d'une distorsion (taxe, prix plafond, etc.).",
      },
    ],
  },

  // ── elasticite-prix ───────────────────────────────────────────────────
  {
    moduleSlug: 'elasticite-prix',
    questions: [
      {
        question: 'Un bien dont l\'elasticite-prix est de -0.3 est considere comme :',
        options: [
          'Tres elastique',
          'Inelastique (peu sensible au prix)',
          'Parfaitement elastique',
          'A elasticite unitaire',
        ],
        correctIndex: 1,
        explanation:
          "Une elasticite inferieure a 1 en valeur absolue signifie que la quantite demandee varie proportionnellement moins que le prix. C'est typique des biens de premiere necessite.",
      },
      {
        question: 'Pourquoi l\'essence a-t-elle une demande inelastique a court terme ?',
        options: [
          'Parce que c\'est un bien de luxe',
          'Parce que les consommateurs n\'ont pas de substitut immediat',
          'Parce que le prix est fixe par l\'Etat',
          'Parce que l\'offre est illimitee',
        ],
        correctIndex: 1,
        explanation:
          "A court terme, les automobilistes dependent de leur vehicule et ne peuvent pas facilement changer de mode de transport. L'absence de substituts immediats rend la demande inelastique.",
      },
      {
        question: 'Si un vendeur augmente le prix d\'un bien a demande elastique, que se passe-t-il pour son chiffre d\'affaires ?',
        options: [
          'Il augmente',
          'Il reste stable',
          'Il diminue',
          'On ne peut pas savoir',
        ],
        correctIndex: 2,
        explanation:
          "Quand la demande est elastique, la baisse de quantite vendue est proportionnellement plus forte que la hausse du prix. Le chiffre d'affaires total diminue donc.",
      },
    ],
  },

  // ── multiplicateur-keynesien ──────────────────────────────────────────
  {
    moduleSlug: 'multiplicateur-keynesien',
    questions: [
      {
        question: 'Pourquoi le multiplicateur keynesien est-il superieur a 1 ?',
        options: [
          'Parce que l\'Etat est plus efficace que le secteur prive',
          'Parce que chaque euro depense genere des revenus qui sont a leur tour depenses',
          'Parce que les prix baissent automatiquement',
          'Parce que les importations augmentent',
        ],
        correctIndex: 1,
        explanation:
          "Le multiplicateur fonctionne par vagues successives : une depense initiale devient le revenu de quelqu'un, qui en depense une partie, creant un nouveau revenu pour un autre, et ainsi de suite. L'effet cumule depasse donc l'injection initiale.",
      },
      {
        question: 'Qu\'est-ce qui reduit la valeur du multiplicateur ?',
        options: [
          'Une forte propension a consommer',
          'Un faible taux d\'imposition',
          'Une forte propension a importer',
          'Un grand nombre de tours de depense',
        ],
        correctIndex: 2,
        explanation:
          "Les importations constituent une fuite hors du circuit economique national. Plus les menages importent, moins la depense se diffuse dans l'economie domestique, ce qui reduit le multiplicateur.",
      },
      {
        question: 'Dans le modele keynesien simple, si la propension marginale a consommer est de 0.8 et qu\'il n\'y a ni impots ni importations, quel est le multiplicateur ?',
        options: [
          '2',
          '4',
          '5',
          '8',
        ],
        correctIndex: 2,
        explanation:
          "Le multiplicateur simple est 1 / (1 - PMC). Avec PMC = 0.8, on obtient 1 / (1 - 0.8) = 1 / 0.2 = 5. Chaque euro de depense publique genere 5 euros de PIB supplementaire.",
      },
    ],
  },

  // ── courbe-de-phillips ────────────────────────────────────────────────
  {
    moduleSlug: 'courbe-de-phillips',
    questions: [
      {
        question: 'Que decrit la courbe de Phillips originale ?',
        options: [
          'La relation entre croissance et dette',
          'Un arbitrage entre inflation et chomage',
          'La relation entre taux d\'interet et investissement',
          'Le lien entre impots et recettes fiscales',
        ],
        correctIndex: 1,
        explanation:
          "Phillips a observe empiriquement qu'un chomage faible s'accompagnait d'une inflation plus elevee, et inversement. Ce constat suggerait aux decideurs un arbitrage possible entre les deux maux.",
      },
      {
        question: 'Qu\'est-ce que la stagflation ?',
        options: [
          'Une croissance forte avec une inflation faible',
          'Une situation de chomage eleve accompagnee d\'inflation elevee',
          'Une baisse simultanee du chomage et de l\'inflation',
          'Une stagnation du taux de change',
        ],
        correctIndex: 1,
        explanation:
          "La stagflation des annees 1970, provoquee par les chocs petroliers, a remis en cause la courbe de Phillips : l'economie souffrait simultanement d'un chomage eleve et d'une inflation forte, contredisant l'arbitrage suppose.",
      },
      {
        question: 'Selon Friedman, pourquoi la courbe de Phillips est-elle verticale a long terme ?',
        options: [
          'Parce que les salaires sont rigides',
          'Parce que les agents economiques finissent par anticiper l\'inflation',
          'Parce que le gouvernement controle les prix',
          'Parce que le taux de chomage ne change jamais',
        ],
        correctIndex: 1,
        explanation:
          "Friedman a montre qu'a long terme, les agents anticipent l'inflation et ajustent leurs comportements (negociations salariales, etc.). L'inflation n'a alors plus d'effet sur le chomage, qui revient a son taux naturel.",
      },
    ],
  },

  // ── is-lm ────────────────────────────────────────────────────────────
  {
    moduleSlug: 'is-lm',
    questions: [
      {
        question: 'Dans le modele IS-LM, que represente la courbe IS ?',
        options: [
          'L\'equilibre sur le marche de la monnaie',
          'L\'equilibre sur le marche des biens et services',
          'La relation entre inflation et chomage',
          'La courbe d\'offre agregee',
        ],
        correctIndex: 1,
        explanation:
          "La courbe IS (Investment-Saving) represente l'ensemble des couples (revenu, taux d'interet) pour lesquels le marche des biens est en equilibre, c'est-a-dire ou l'investissement egal l'epargne.",
      },
      {
        question: 'Quel est l\'effet d\'une politique budgetaire expansionniste dans le modele IS-LM ?',
        options: [
          'La courbe LM se deplace vers la droite',
          'La courbe IS se deplace vers la droite, augmentant le revenu et le taux d\'interet',
          'Les deux courbes se deplacent vers la gauche',
          'Aucun effet sur l\'equilibre',
        ],
        correctIndex: 1,
        explanation:
          "Une hausse des depenses publiques deplace IS vers la droite. Le revenu augmente mais le taux d'interet monte aussi, provoquant un effet d'eviction partiel de l'investissement prive.",
      },
      {
        question: 'Qu\'est-ce que la trappe a liquidite dans le modele IS-LM ?',
        options: [
          'Un taux d\'interet tres eleve qui bloque l\'investissement',
          'Une situation ou la politique monetaire devient inefficace car le taux d\'interet est deja au plancher',
          'Un exces de liquidite qui provoque de l\'inflation',
          'Un manque de liquidite bancaire',
        ],
        correctIndex: 1,
        explanation:
          "Quand le taux d'interet est proche de zero, les agents preferent detenir de la monnaie plutot que des titres. La courbe LM devient horizontale et toute injection monetaire supplementaire est absorbee sans effet sur le taux d'interet ni sur l'activite.",
      },
    ],
  },

  // ── ad-as ─────────────────────────────────────────────────────────────
  {
    moduleSlug: 'ad-as',
    questions: [
      {
        question: 'Dans le modele AD-AS, qu\'est-ce qui peut provoquer une stagflation ?',
        options: [
          'Un choc positif de demande',
          'Un choc negatif d\'offre (ex. hausse du prix du petrole)',
          'Une baisse des impots',
          'Une augmentation de la masse monetaire',
        ],
        correctIndex: 1,
        explanation:
          "Un choc negatif d'offre deplace la courbe AS vers la gauche : la production baisse (stagnation/recession) tandis que le niveau general des prix augmente (inflation). C'est exactement la stagflation.",
      },
      {
        question: 'Que se passe-t-il si la demande agregee augmente alors que l\'economie est deja au plein emploi ?',
        options: [
          'La production augmente sans inflation',
          'Le chomage diminue fortement',
          'L\'inflation augmente sans effet durable sur la production',
          'Les importations diminuent',
        ],
        correctIndex: 2,
        explanation:
          "Au plein emploi, la courbe AS est quasi verticale. Une hausse de la demande agregee se traduit principalement par une hausse des prix, sans gain significatif de production reelle.",
      },
      {
        question: 'Pourquoi la courbe de demande agregee (AD) est-elle decroissante ?',
        options: [
          'Parce que les entreprises produisent moins quand les prix montent',
          'A cause des effets richesse, taux d\'interet et commerce exterieur',
          'Parce que l\'Etat reduit ses depenses quand les prix augmentent',
          'Parce que les salaires sont fixes',
        ],
        correctIndex: 1,
        explanation:
          "La courbe AD est decroissante pour trois raisons : l'effet richesse (Pigou), l'effet taux d'interet (Keynes) et l'effet commerce exterieur (Mundell-Fleming). Une hausse des prix reduit la demande reelle par ces trois canaux.",
      },
    ],
  },

  // ── carre-magique-kaldor ──────────────────────────────────────────────
  {
    moduleSlug: 'carre-magique-kaldor',
    questions: [
      {
        question: 'Quels sont les quatre objectifs du carre magique de Kaldor ?',
        options: [
          'PIB, dette, impots, exportations',
          'Croissance, emploi, stabilite des prix, equilibre exterieur',
          'Inflation, chomage, deficit, taux de change',
          'Consommation, investissement, depenses publiques, exportations nettes',
        ],
        correctIndex: 1,
        explanation:
          "Le carre magique de Kaldor synthetise la performance economique d'un pays a travers quatre indicateurs : le taux de croissance du PIB, le taux de chomage, le taux d'inflation et le solde de la balance courante.",
      },
      {
        question: 'Pourquoi le carre est-il qualifie de \"magique\" ?',
        options: [
          'Parce qu\'il fonctionne toujours parfaitement',
          'Parce qu\'il est impossible d\'atteindre simultanement les quatre objectifs',
          'Parce qu\'il a ete invente par un magicien',
          'Parce que les resultats sont toujours surprenants',
        ],
        correctIndex: 1,
        explanation:
          "Le carre est dit \"magique\" car les quatre objectifs sont en tension les uns avec les autres. Par exemple, stimuler la croissance et l'emploi tend a generer de l'inflation et a degrader la balance commerciale.",
      },
      {
        question: 'Quel arbitrage classique illustre le carre magique ?',
        options: [
          'Plus de croissance implique necessairement plus de dette',
          'Reduire le chomage tend a augmenter l\'inflation',
          'Un excedent commercial entraine toujours une recession',
          'La stabilite des prix empeche tout investissement',
        ],
        correctIndex: 1,
        explanation:
          "L'arbitrage chomage-inflation est un des plus celebres en economie (courbe de Phillips). Relancer l'economie pour reduire le chomage cree des tensions sur les prix. Le carre magique illustre ce type de dilemme.",
      },
    ],
  },

  // ── courbe-de-laffer ──────────────────────────────────────────────────
  {
    moduleSlug: 'courbe-de-laffer',
    questions: [
      {
        question: 'Que montre la courbe de Laffer ?',
        options: [
          'Que les impots sont toujours trop eleves',
          'Qu\'il existe un taux d\'imposition optimal maximisant les recettes fiscales',
          'Que les recettes fiscales augmentent toujours avec le taux d\'imposition',
          'Que les impots n\'ont aucun effet sur le comportement',
        ],
        correctIndex: 1,
        explanation:
          "La courbe de Laffer montre qu'au-dela d'un certain seuil, augmenter le taux d'imposition reduit les recettes fiscales car les agents economiques reduisent leur activite, fraudent ou s'exilent fiscalement.",
      },
      {
        question: 'Pourquoi un taux d\'imposition de 100% genere-t-il zero recettes ?',
        options: [
          'Parce que l\'Etat reverse tout aux citoyens',
          'Parce que personne n\'a interet a travailler si tout est confisque',
          'Parce que la monnaie perd sa valeur',
          'Parce que les entreprises font faillite',
        ],
        correctIndex: 1,
        explanation:
          "Si l'Etat prend 100% des revenus, il n'y a plus aucune incitation a produire ou a travailler. L'assiette fiscale tombe a zero, donc les recettes aussi. C'est un cas limite theorique qui illustre le principe.",
      },
      {
        question: 'Quelle est la principale critique de la courbe de Laffer ?',
        options: [
          'Elle n\'a pas de fondement mathematique',
          'On ne connait pas precisement le taux optimal, et il varie selon le contexte',
          'Elle ignore completement l\'inflation',
          'Elle ne s\'applique qu\'aux entreprises',
        ],
        correctIndex: 1,
        explanation:
          "Le principal probleme est empirique : personne ne connait avec certitude le sommet de la courbe. Il depend du type d'impot, du pays, de la periode. Certains l'utilisent pour justifier des baisses d'impots sans preuve que l'on se situe sur le versant descendant.",
      },
    ],
  },

  // ── courbe-de-lorenz-gini ─────────────────────────────────────────────
  {
    moduleSlug: 'courbe-de-lorenz-gini',
    questions: [
      {
        question: 'Que represente la diagonale dans le graphique de la courbe de Lorenz ?',
        options: [
          'La repartition reelle des revenus',
          'Une repartition parfaitement egalitaire',
          'Le seuil de pauvrete',
          'Le revenu median',
        ],
        correctIndex: 1,
        explanation:
          "La diagonale (droite a 45 degres) represente l'egalite parfaite : chaque pourcentage de la population detient le meme pourcentage du revenu total. Plus la courbe de Lorenz s'eloigne de cette diagonale, plus les inegalites sont fortes.",
      },
      {
        question: 'Un coefficient de Gini de 0.25 indique :',
        options: [
          'Des inegalites tres fortes',
          'Une egalite parfaite',
          'Des inegalites relativement faibles',
          'Un pays en recession',
        ],
        correctIndex: 2,
        explanation:
          "Le coefficient de Gini va de 0 (egalite parfaite) a 1 (un seul individu detient tout). Un Gini de 0.25 est typique des pays scandinaves et indique une distribution relativement egalitaire des revenus.",
      },
      {
        question: 'Comment l\'imposition progressive affecte-t-elle le coefficient de Gini ?',
        options: [
          'Elle l\'augmente',
          'Elle le diminue en reduisant l\'ecart entre hauts et bas revenus',
          'Elle n\'a aucun effet',
          'Elle le rend negatif',
        ],
        correctIndex: 1,
        explanation:
          "L'impot progressif preleve proportionnellement plus sur les hauts revenus, ce qui rapproche la courbe de Lorenz de la diagonale d'egalite et reduit donc le coefficient de Gini.",
      },
    ],
  },

  // ── creation-monetaire ────────────────────────────────────────────────
  {
    moduleSlug: 'creation-monetaire',
    questions: [
      {
        question: 'Qui cree la majorite de la monnaie en circulation ?',
        options: [
          'La banque centrale exclusivement',
          'Le gouvernement via le budget',
          'Les banques commerciales via le credit',
          'Les marches financiers',
        ],
        correctIndex: 2,
        explanation:
          "Contrairement a une idee recue, ce sont les banques commerciales qui creent l'essentiel de la monnaie en accordant des credits. Quand une banque prete, elle credite le compte de l'emprunteur, creant ainsi de la monnaie scripturale ex nihilo.",
      },
      {
        question: 'Si le taux de reserves obligatoires est de 10%, quel est le multiplicateur monetaire maximal ?',
        options: [
          '5',
          '10',
          '20',
          '100',
        ],
        correctIndex: 1,
        explanation:
          "Le multiplicateur monetaire maximal est 1 / taux de reserves obligatoires. Avec 10%, on obtient 1 / 0.10 = 10. Un depot initial de 100 euros peut theoriquement generer jusqu'a 1000 euros de monnaie dans l'economie.",
      },
      {
        question: 'Que se passe-t-il si la banque centrale augmente le taux de reserves obligatoires ?',
        options: [
          'Les banques peuvent preter davantage',
          'La creation monetaire est freinee',
          'L\'inflation augmente immediatement',
          'Le taux de change s\'apprecie',
        ],
        correctIndex: 1,
        explanation:
          "En augmentant les reserves obligatoires, la banque centrale oblige les banques commerciales a garder une plus grande part des depots en reserve. Le multiplicateur diminue, ce qui freine la creation monetaire et le credit.",
      },
    ],
  },

  // ── donnees-historiques ───────────────────────────────────────────────
  {
    moduleSlug: 'donnees-historiques',
    questions: [
      {
        question: 'Quelle periode est connue sous le nom de \"Trente Glorieuses\" en France ?',
        options: [
          '1920-1950',
          '1945-1975',
          '1975-2005',
          '1990-2020',
        ],
        correctIndex: 1,
        explanation:
          "Les Trente Glorieuses (1945-1975) designent une periode de forte croissance economique en France, avec un taux de croissance annuel moyen d'environ 5%, le plein emploi et une modernisation rapide de l'economie.",
      },
      {
        question: 'Quel evenement a provoque la fin des Trente Glorieuses ?',
        options: [
          'La chute du mur de Berlin',
          'Le premier choc petrolier de 1973',
          'La creation de l\'euro',
          'La crise des subprimes',
        ],
        correctIndex: 1,
        explanation:
          "Le premier choc petrolier de 1973 a quadruple le prix du petrole, provoquant inflation et recession simultanees (stagflation). Il marque symboliquement la fin des Trente Glorieuses et le debut d'une periode de croissance plus lente.",
      },
      {
        question: 'Comment a evolue la dette publique francaise depuis les annees 1980 ?',
        options: [
          'Elle a regulierement diminue',
          'Elle est restee stable autour de 30% du PIB',
          'Elle a augmente tendanciellement, depassant 100% du PIB',
          'Elle a fluctue sans tendance claire',
        ],
        correctIndex: 2,
        explanation:
          "La dette publique francaise est passee d'environ 20% du PIB au debut des annees 1980 a plus de 110% du PIB aujourd'hui. Cette hausse tendancielle est due aux deficits budgetaires chroniques, accentues par les crises (2008, Covid).",
      },
    ],
  },

  // ── frontiere-possibilites-production ─────────────────────────────────
  {
    moduleSlug: 'frontiere-possibilites-production',
    questions: [
      {
        question: 'Que represente un point situe a l\'interieur de la frontiere des possibilites de production ?',
        options: [
          'Un point impossible a atteindre',
          'Un point d\'efficacite maximale',
          'Une sous-utilisation des ressources disponibles',
          'Un equilibre de marche',
        ],
        correctIndex: 2,
        explanation:
          "Un point interieur a la FPP signifie que l'economie n'utilise pas toutes ses ressources de maniere efficace. Il serait possible de produire davantage de l'un des deux biens (ou des deux) sans sacrifier la production de l'autre.",
      },
      {
        question: 'Qu\'est-ce que le cout d\'opportunite sur la FPP ?',
        options: [
          'Le prix de vente d\'un bien',
          'La quantite d\'un bien a laquelle on renonce pour produire une unite supplementaire de l\'autre',
          'Le cout total de production',
          'La difference entre le prix et le cout',
        ],
        correctIndex: 1,
        explanation:
          "Sur la frontiere, les ressources sont pleinement utilisees. Produire plus d'un bien impose de reduire la production de l'autre. Le cout d'opportunite mesure ce sacrifice, c'est un concept fondamental en economie.",
      },
      {
        question: 'Qu\'est-ce qui peut deplacer la FPP vers l\'exterieur ?',
        options: [
          'Une recession economique',
          'Le progres technique ou l\'accumulation de capital',
          'Une hausse des impots',
          'Une baisse de la demande',
        ],
        correctIndex: 1,
        explanation:
          "La FPP se deplace vers l'exterieur lorsque les capacites productives augmentent : progres technologique, investissement en capital, amelioration de l'education, decouverte de nouvelles ressources. C'est la croissance du potentiel economique.",
      },
    ],
  },

  // ── avantages-comparatifs ─────────────────────────────────────────────
  {
    moduleSlug: 'avantages-comparatifs',
    questions: [
      {
        question: 'Selon Ricardo, quand le commerce international est-il benefique ?',
        options: [
          'Uniquement quand un pays a un avantage absolu',
          'Toujours, des lors que les couts d\'opportunite different entre pays',
          'Uniquement entre pays de niveaux de developpement similaires',
          'Jamais, car il y a toujours un perdant',
        ],
        correctIndex: 1,
        explanation:
          "Le theoreme des avantages comparatifs montre que meme si un pays est moins productif dans tous les domaines, il gagne a se specialiser la ou son desavantage est le moindre. C'est la difference de couts d'opportunite qui compte.",
      },
      {
        question: 'Quelle est la difference entre avantage absolu et avantage comparatif ?',
        options: [
          'L\'avantage absolu concerne la productivite, l\'avantage comparatif concerne le cout d\'opportunite',
          'Ce sont deux noms pour le meme concept',
          'L\'avantage absolu est toujours superieur',
          'L\'avantage comparatif ne s\'applique qu\'aux services',
        ],
        correctIndex: 0,
        explanation:
          "L'avantage absolu (Adam Smith) compare les productivites brutes. L'avantage comparatif (Ricardo) compare les couts d'opportunite relatifs. Un pays peut n'avoir aucun avantage absolu tout en ayant un avantage comparatif.",
      },
      {
        question: 'Pourquoi la specialisation selon les avantages comparatifs augmente-t-elle la production mondiale ?',
        options: [
          'Parce que chaque pays produit tout ce dont il a besoin',
          'Parce que chaque pays se concentre sur ce qu\'il fait de relativement mieux',
          'Parce que les salaires s\'egalisent entre pays',
          'Parce que les couts de transport disparaissent',
        ],
        correctIndex: 1,
        explanation:
          "Quand chaque pays se specialise dans le bien pour lequel il a le cout d'opportunite le plus faible, les ressources mondiales sont mieux allouees. La production totale augmente, et le commerce permet a chacun de consommer au-dela de sa propre FPP.",
      },
    ],
  },

  // ── externalites ──────────────────────────────────────────────────────
  {
    moduleSlug: 'externalites',
    questions: [
      {
        question: 'Qu\'est-ce qu\'une externalite negative ?',
        options: [
          'Un bien dont le prix baisse',
          'Un effet nefaste subi par un tiers non implique dans la transaction',
          'Un deficit commercial',
          'Une perte de profit pour l\'entreprise',
        ],
        correctIndex: 1,
        explanation:
          "Une externalite negative est un cout impose a des tiers qui ne participent pas a la transaction. La pollution d'une usine affectant les riverains en est l'exemple classique : le marche ne prend pas en compte ce cout social.",
      },
      {
        question: 'Pourquoi le marche produit-il trop d\'un bien ayant une externalite negative ?',
        options: [
          'Parce que les consommateurs sont irrationnels',
          'Parce que le cout social n\'est pas integre dans le prix de marche',
          'Parce que l\'offre est insuffisante',
          'Parce que l\'Etat subventionne ce bien',
        ],
        correctIndex: 1,
        explanation:
          "Le producteur ne supporte pas le cout de l'externalite (ex. la pollution). Son cout prive est inferieur au cout social reel. Il produit donc plus que le niveau socialement optimal. C'est une defaillance de marche.",
      },
      {
        question: 'Comment une taxe pigouvienne corrige-t-elle une externalite negative ?',
        options: [
          'En interdisant la production',
          'En faisant payer au producteur le cout social de son activite',
          'En subventionnant les victimes',
          'En fixant un prix maximum',
        ],
        correctIndex: 1,
        explanation:
          "La taxe pigouvienne (du nom de l'economiste Pigou) est calibree pour egaliser le cout prive et le cout social. En internalisant l'externalite, elle ramene la production au niveau socialement optimal sans interdire l'activite.",
      },
    ],
  },

  // ── concurrence-monopole ──────────────────────────────────────────────
  {
    moduleSlug: 'concurrence-monopole',
    questions: [
      {
        question: 'Pourquoi le monopole produit-il moins que la concurrence parfaite ?',
        options: [
          'Parce qu\'il n\'a pas assez de ressources',
          'Parce qu\'il restreint volontairement la production pour maintenir un prix eleve',
          'Parce que l\'Etat lui impose des quotas',
          'Parce que la demande est plus faible',
        ],
        correctIndex: 1,
        explanation:
          "Le monopoleur maximise son profit en egalisant recette marginale et cout marginal. Comme sa recette marginale est inferieure au prix, il produit moins qu'en concurrence parfaite et vend a un prix plus eleve.",
      },
      {
        question: 'Qu\'est-ce que la perte seche du monopole ?',
        options: [
          'Le profit du monopoleur',
          'Le surplus perdu par les consommateurs au profit du monopoleur',
          'La perte de bien-etre social due a la sous-production du monopole',
          'Les couts fixes du monopoleur',
        ],
        correctIndex: 2,
        explanation:
          "La perte seche represente les transactions mutuellement benefiques qui n'ont pas lieu a cause de la restriction de production. C'est une perte nette de bien-etre pour la societe que personne ne recupere.",
      },
      {
        question: 'Quand un monopole naturel peut-il etre souhaitable ?',
        options: [
          'Jamais, le monopole est toujours inefficace',
          'Quand les couts fixes sont si eleves qu\'un seul producteur est plus efficient que plusieurs',
          'Quand le bien est un bien de luxe',
          'Quand l\'entreprise est publique',
        ],
        correctIndex: 1,
        explanation:
          "Un monopole naturel existe quand les economies d'echelle sont telles qu'un seul producteur minimise le cout moyen (ex. reseaux d'eau, electricite). La duplication des infrastructures serait un gaspillage. L'Etat peut alors reguler le prix.",
      },
    ],
  },

  // ── taux-de-change ────────────────────────────────────────────────────
  {
    moduleSlug: 'taux-de-change',
    questions: [
      {
        question: 'Qu\'est-ce qu\'une depreciation de la monnaie nationale ?',
        options: [
          'Une hausse de la valeur de la monnaie par rapport aux autres devises',
          'Une baisse de la valeur de la monnaie par rapport aux autres devises',
          'Une baisse du taux d\'interet directeur',
          'Une reduction de la masse monetaire',
        ],
        correctIndex: 1,
        explanation:
          "Une depreciation signifie qu'il faut davantage de monnaie nationale pour acheter une unite de devise etrangere. Les exportations deviennent moins cheres pour les etrangers, mais les importations coutent plus cher.",
      },
      {
        question: 'Quel est l\'effet attendu d\'une depreciation sur la balance commerciale ?',
        options: [
          'Amelioration immediate et durable',
          'Deterioration initiale puis amelioration (courbe en J)',
          'Aucun effet',
          'Deterioration permanente',
        ],
        correctIndex: 1,
        explanation:
          "La courbe en J montre qu'apres une depreciation, la balance commerciale se degrade d'abord (les importations coutent plus cher immediatement) avant de s'ameliorer quand les volumes d'exportation augmentent grace a la meilleure competitivite-prix.",
      },
      {
        question: 'Quel mecanisme tend a egaliser le prix d\'un meme bien entre deux pays (en tenant compte du taux de change) ?',
        options: [
          'La regulation gouvernementale',
          'La parite de pouvoir d\'achat (PPA)',
          'Le multiplicateur keynesien',
          'La courbe de Phillips',
        ],
        correctIndex: 1,
        explanation:
          "La theorie de la parite de pouvoir d'achat stipule qu'a long terme, le taux de change s'ajuste pour que le meme panier de biens coute le meme prix dans les deux pays. Les ecarts sont corriges par l'arbitrage commercial.",
      },
    ],
  },

  // ── fiscalite-redistribution ──────────────────────────────────────────
  {
    moduleSlug: 'fiscalite-redistribution',
    questions: [
      {
        question: 'Qu\'est-ce qu\'un impot progressif ?',
        options: [
          'Un impot dont le taux augmente avec le revenu',
          'Un impot dont le taux est identique pour tous',
          'Un impot qui augmente chaque annee',
          'Un impot uniquement paye par les entreprises',
        ],
        correctIndex: 0,
        explanation:
          "Un impot progressif applique des taux marginaux croissants : les tranches de revenu les plus elevees sont taxees a des taux plus forts. L'impot sur le revenu en France est l'exemple type avec ses tranches a 0%, 11%, 30%, 41% et 45%.",
      },
      {
        question: 'Pourquoi dit-on que la TVA est un impot regressif ?',
        options: [
          'Parce que son taux diminue chaque annee',
          'Parce qu\'elle pese proportionnellement plus sur les bas revenus',
          'Parce qu\'elle ne concerne que les produits de luxe',
          'Parce que seuls les pauvres la paient',
        ],
        correctIndex: 1,
        explanation:
          "La TVA est proportionnelle a la consommation, pas au revenu. Or les menages modestes consomment une plus grande part de leur revenu. En proportion du revenu total, la TVA represente donc une charge plus lourde pour les bas revenus.",
      },
      {
        question: 'Quel est l\'objectif principal de la redistribution ?',
        options: [
          'Maximiser les recettes de l\'Etat',
          'Reduire les inegalites de revenus entre les menages',
          'Financer la dette publique',
          'Encourager l\'epargne des plus riches',
        ],
        correctIndex: 1,
        explanation:
          "La redistribution vise a reduire les ecarts de revenus via les prelevements (impots progressifs) et les transferts (allocations, minima sociaux). Elle transforme la repartition primaire (marche) en repartition secondaire plus egalitaire.",
      },
    ],
  },
];

export function getQuizBySlug(slug: string): ModuleQuiz | undefined {
  return quizzes.find((q) => q.moduleSlug === slug);
}
