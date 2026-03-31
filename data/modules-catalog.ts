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
    subtitle: 'Le mécanisme de base de tout marche',
    theme: 'micro',
    level: 'accessible',
    description:
      'Explorez comment les courbes d\'offre et de demande déterminent le prix et la quantité d\'équilibre sur un marché. Simulez des chocs de demande, des hausses de coûts, des taxes et des controles de prix pour comprendre leurs effets sur l\'équilibre.',
    icon: 'TrendingUpDown',
    tier: 1,
    available: true,
  },
  {
    slug: 'elasticite-prix',
    title: 'Élasticité-prix',
    subtitle: 'Mesurer la sensibilite de la demande au prix',
    theme: 'micro',
    level: 'accessible',
    description:
      'Découvrez comment la demande réagit aux variations de prix selon le type de bien. Comparez des biens de luxe, de première nécessité et des produits addictifs pour comprendre pourquoi certains marchés sont plus sensibles que d\'autres.',
    icon: 'Activity',
    tier: 1,
    available: true,
  },
  {
    slug: 'multiplicateur-keynesien',
    title: 'Multiplicateur keynesien',
    subtitle: 'Comment une dépense initiale se multiplie',
    theme: 'macro',
    level: 'intermediate',
    description:
      'Visualisez comment une injection de dépenses publiques se propage dans l\'économie à travers des vagues successives de consommation. Ajustez la propension marginale à consommer pour observer l\'effet multiplicateur en action.',
    icon: 'Layers',
    tier: 1,
    available: true,
  },
  {
    slug: 'courbe-de-phillips',
    title: 'Courbe de Phillips',
    subtitle: 'La relation inflation-chômage',
    theme: 'macro',
    level: 'intermediate',
    description:
      'Analysez la relation historique entre inflation et chômage. Des années 1960 a aujourd\'hui, découvrez comment cette relation a évolué, du compromis stable à la stagflation des années 1970 jusqu\'aux debats contemporains.',
    icon: 'GitBranch',
    tier: 1,
    available: true,
  },
  {
    slug: 'is-lm',
    title: 'Modèle IS-LM',
    subtitle: 'L\'équilibre marché des biens et de la monnaie',
    theme: 'macro',
    level: 'advanced',
    description:
      'Explorez le modèle fondamental de la macroéconomie keynesienne. Simulez des politiques budgétaires et monétaires pour comprendre comment elles affectent simultanément le taux d\'intérêt et la production.',
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
      'Analysez l\'équilibre macroéconomique global à travers le modèle AD-AS. Simulez des chocs de demande et d\'offre pour comprendre les mécanismes de récession, de surchauffe et de stagflation.',
    icon: 'BarChart3',
    tier: 1,
    available: true,
  },
  {
    slug: 'carre-magique-kaldor',
    title: 'Carré magique de Kaldor',
    subtitle: 'Performance macroéconomique en 4 dimensions',
    theme: 'macro',
    level: 'intermediate',
    description:
      'Comparez les performances économiques de différents pays à travers les quatre objectifs fondamentaux : croissance, emploi, stabilité des prix et équilibre exterieur. Utilisez des données réelles pour evaluer les arbitrages.',
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
      'Explorez la relation entre le taux d\'imposition et les recettes fiscales. Découvrez le point au-dela duquel augmenter les impots réduit paradoxalement les recettes, et comprenez les debats autour de la fiscalité optimale.',
    icon: 'Mountain',
    tier: 1,
    available: true,
  },
  {
    slug: 'courbe-de-lorenz-gini',
    title: 'Courbe de Lorenz et coefficient de Gini',
    subtitle: 'Mesurer les inégalités de revenus',
    theme: 'inequality',
    level: 'intermediate',
    description:
      'Visualisez la répartition des revenus dans différents pays a l\'aide de la courbe de Lorenz. Calculez le coefficient de Gini et comparez les niveaux d\'inégalité entre la France, les États-Unis, la Scandinavie et d\'autres économies.',
    icon: 'PieChart',
    tier: 1,
    available: true,
  },
  {
    slug: 'creation-monetaire',
    title: 'Création monétaire',
    subtitle: 'Comment les banques créent la monnaie',
    theme: 'monetary',
    level: 'intermediate',
    description:
      'Comprenez le mécanisme du multiplicateur de credit et le role des reserves obligatoires. Simulez le processus par lequel les banques commerciales créent de la monnaie scripturale à partir d\'un dépôt initial.',
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
      'Visualisez les arbitrages entre deux biens lorsque les ressources sont limitees. Comprenez les coûts d\'opportunité et l\'efficacité productive.',
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
      'Découvrez le théorème de Ricardo et comprenez pourquoi le commerce international est mutuellement bénéfique, même lorsqu\'un pays est plus productif dans tous les domaines.',
    icon: 'ArrowLeftRight',
    tier: 2,
    available: true,
  },
  {
    slug: 'externalites',
    title: 'Externalites',
    subtitle: 'Quand le marché echoue',
    theme: 'micro',
    level: 'intermediate',
    description:
      'Analysez les situations ou l\'activité économique génère des effets non compenses sur des tiers. Explorez les solutions par la taxation, la subvention ou la réglementation.',
    icon: 'Cloud',
    tier: 2,
    available: true,
  },
  {
    slug: 'concurrence-monopole',
    title: 'Concurrence et monopole',
    subtitle: 'Structures de marché et pouvoir de prix',
    theme: 'micro',
    level: 'intermediate',
    description:
      'Comparez les équilibres en concurrence parfaite et en monopole. Mesurez la perte seche et comprenez les politiques de régulation de la concurrence.',
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
      'Explorez les déterminants du taux de change et ses effets sur les exportations, les importations et la compétitivité. Simulez des dévaluations et des politiques de change.',
    icon: 'RefreshCw',
    tier: 2,
    available: true,
  },
  {
    slug: 'fiscalite-redistribution',
    title: 'Fiscalité et redistribution',
    subtitle: 'L\'impot comme outil de justice sociale',
    theme: 'fiscal',
    level: 'intermediate',
    description:
      'Analysez les effets redistributifs des différents types d\'imposition. Comparez les systèmes progressifs, proportionnels et régressifs sur les inégalités de revenus.',
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
