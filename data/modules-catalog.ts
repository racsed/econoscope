export interface ModuleCatalogEntry {
  slug: string;
  title: string;
  subtitle: string;
  theme: 'micro' | 'macro' | 'monetary' | 'international' | 'inequality' | 'fiscal';
  level: 'accessible' | 'intermediate' | 'advanced';
  description: string;
  icon: string;
  tier: 1 | 2 | 3;
  available: boolean;
}

export const modulesCatalog: ModuleCatalogEntry[] = [
  // ── Tier 1 - MVP ──────────────────────────────────────────────────────
  {
    slug: 'offre-et-demande',
    title: 'Offre et Demande',
    subtitle: 'Le mecanisme de base de tout marche',
    theme: 'micro',
    level: 'accessible',
    description:
      'Explorez comment les courbes d\'offre et de demande determinent le prix et la quantite d\'equilibre sur un marche. Simulez des chocs de demande, des hausses de couts, des taxes et des controles de prix pour comprendre leurs effets sur l\'equilibre.',
    icon: 'TrendingUpDown',
    tier: 1,
    available: true,
  },
  {
    slug: 'elasticite-prix',
    title: 'Elasticite-prix',
    subtitle: 'Mesurer la sensibilite de la demande au prix',
    theme: 'micro',
    level: 'accessible',
    description:
      'Decouvrez comment la demande reagit aux variations de prix selon le type de bien. Comparez des biens de luxe, de premiere necessite et des produits addictifs pour comprendre pourquoi certains marches sont plus sensibles que d\'autres.',
    icon: 'Activity',
    tier: 1,
    available: true,
  },
  {
    slug: 'multiplicateur-keynesien',
    title: 'Multiplicateur keynesien',
    subtitle: 'Comment une depense initiale se multiplie',
    theme: 'macro',
    level: 'intermediate',
    description:
      'Visualisez comment une injection de depenses publiques se propage dans l\'economie a travers des vagues successives de consommation. Ajustez la propension marginale a consommer pour observer l\'effet multiplicateur en action.',
    icon: 'Layers',
    tier: 1,
    available: true,
  },
  {
    slug: 'courbe-de-phillips',
    title: 'Courbe de Phillips',
    subtitle: 'La relation inflation-chomage',
    theme: 'macro',
    level: 'intermediate',
    description:
      'Analysez la relation historique entre inflation et chomage. Des annees 1960 a aujourd\'hui, decouvrez comment cette relation a evolue, du compromis stable a la stagflation des annees 1970 jusqu\'aux debats contemporains.',
    icon: 'GitBranch',
    tier: 1,
    available: true,
  },
  {
    slug: 'is-lm',
    title: 'Modele IS-LM',
    subtitle: 'L\'equilibre marche des biens et de la monnaie',
    theme: 'macro',
    level: 'advanced',
    description:
      'Explorez le modele fondamental de la macroeconomie keynesienne. Simulez des politiques budgetaires et monetaires pour comprendre comment elles affectent simultanement le taux d\'interet et la production.',
    icon: 'Crosshair',
    tier: 1,
    available: true,
  },
  {
    slug: 'ad-as',
    title: 'Offre et Demande agregees (AD-AS)',
    subtitle: 'Offre et demande agregees',
    theme: 'macro',
    level: 'advanced',
    description:
      'Analysez l\'equilibre macroeconomique global a travers le modele AD-AS. Simulez des chocs de demande et d\'offre pour comprendre les mecanismes de recession, de surchauffe et de stagflation.',
    icon: 'BarChart3',
    tier: 1,
    available: true,
  },
  {
    slug: 'carre-magique-kaldor',
    title: 'Carre magique de Kaldor',
    subtitle: 'Performance macroeconomique en 4 dimensions',
    theme: 'macro',
    level: 'intermediate',
    description:
      'Comparez les performances economiques de differents pays a travers les quatre objectifs fondamentaux : croissance, emploi, stabilite des prix et equilibre exterieur. Utilisez des donnees reelles pour evaluer les arbitrages.',
    icon: 'Diamond',
    tier: 1,
    available: true,
  },
  {
    slug: 'courbe-de-laffer',
    title: 'Courbe de Laffer',
    subtitle: 'Trop d\'impot tue-t-il l\'impot ?',
    theme: 'fiscal',
    level: 'accessible',
    description:
      'Explorez la relation entre le taux d\'imposition et les recettes fiscales. Decouvrez le point au-dela duquel augmenter les impots reduit paradoxalement les recettes, et comprenez les debats autour de la fiscalite optimale.',
    icon: 'Mountain',
    tier: 1,
    available: true,
  },
  {
    slug: 'courbe-de-lorenz-gini',
    title: 'Courbe de Lorenz et coefficient de Gini',
    subtitle: 'Mesurer les inegalites de revenus',
    theme: 'inequality',
    level: 'intermediate',
    description:
      'Visualisez la repartition des revenus dans differents pays a l\'aide de la courbe de Lorenz. Calculez le coefficient de Gini et comparez les niveaux d\'inegalite entre la France, les Etats-Unis, la Scandinavie et d\'autres economies.',
    icon: 'PieChart',
    tier: 1,
    available: true,
  },
  {
    slug: 'creation-monetaire',
    title: 'Creation monetaire',
    subtitle: 'Comment les banques creent la monnaie',
    theme: 'monetary',
    level: 'intermediate',
    description:
      'Comprenez le mecanisme du multiplicateur de credit et le role des reserves obligatoires. Simulez le processus par lequel les banques commerciales creent de la monnaie scripturale a partir d\'un depot initial.',
    icon: 'Banknote',
    tier: 1,
    available: true,
  },

  // ── Tier 2 - A venir ──────────────────────────────────────────────────
  {
    slug: 'frontiere-possibilites-production',
    title: 'Frontiere des possibilites de production',
    subtitle: 'Les choix sous contrainte de ressources',
    theme: 'micro',
    level: 'accessible',
    description:
      'Visualisez les arbitrages entre deux biens lorsque les ressources sont limitees. Comprenez les couts d\'opportunite et l\'efficacite productive.',
    icon: 'Maximize2',
    tier: 2,
    available: true,
  },
  {
    slug: 'avantages-comparatifs',
    title: 'Avantages comparatifs',
    subtitle: 'Pourquoi les pays echangent entre eux',
    theme: 'international',
    level: 'intermediate',
    description:
      'Decouvrez le theoreme de Ricardo et comprenez pourquoi le commerce international est mutuellement benefique, meme lorsqu\'un pays est plus productif dans tous les domaines.',
    icon: 'ArrowLeftRight',
    tier: 2,
    available: true,
  },
  {
    slug: 'externalites',
    title: 'Externalites',
    subtitle: 'Quand le marche echoue',
    theme: 'micro',
    level: 'intermediate',
    description:
      'Analysez les situations ou l\'activite economique genere des effets non compenses sur des tiers. Explorez les solutions par la taxation, la subvention ou la reglementation.',
    icon: 'Cloud',
    tier: 2,
    available: true,
  },
  {
    slug: 'concurrence-monopole',
    title: 'Concurrence et monopole',
    subtitle: 'Structures de marche et pouvoir de prix',
    theme: 'micro',
    level: 'intermediate',
    description:
      'Comparez les equilibres en concurrence parfaite et en monopole. Mesurez la perte seche et comprenez les politiques de regulation de la concurrence.',
    icon: 'Scale',
    tier: 2,
    available: true,
  },
  {
    slug: 'taux-de-change',
    title: 'Taux de change',
    subtitle: 'La valeur relative des monnaies',
    theme: 'international',
    level: 'intermediate',
    description:
      'Explorez les determinants du taux de change et ses effets sur les exportations, les importations et la competitivite. Simulez des devaluations et des politiques de change.',
    icon: 'RefreshCw',
    tier: 2,
    available: true,
  },
  {
    slug: 'fiscalite-redistribution',
    title: 'Fiscalite et redistribution',
    subtitle: 'L\'impot comme outil de justice sociale',
    theme: 'fiscal',
    level: 'intermediate',
    description:
      'Analysez les effets redistributifs des differents types d\'imposition. Comparez les systemes progressifs, proportionnels et regressifs sur les inegalites de revenus.',
    icon: 'Scale',
    tier: 2,
    available: true,
  },
];

export function getModuleBySlug(slug: string): ModuleCatalogEntry | undefined {
  return modulesCatalog.find((m) => m.slug === slug);
}

export function getModulesByTheme(theme: ModuleCatalogEntry['theme']): ModuleCatalogEntry[] {
  return modulesCatalog.filter((m) => m.theme === theme);
}

export function getModulesByTier(tier: 1 | 2 | 3): ModuleCatalogEntry[] {
  return modulesCatalog.filter((m) => m.tier === tier);
}

export function getAvailableModules(): ModuleCatalogEntry[] {
  return modulesCatalog.filter((m) => m.available);
}
