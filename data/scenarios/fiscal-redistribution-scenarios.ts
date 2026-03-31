export interface FiscalRedistributionScenario {
  id: string;
  title: string;
  description: string;
  /** Revenu median mensuel en EUR */
  revenuMedian: number;
  /** Taux tranche 1 (0-10k EUR) en % */
  tauxTranche1: number;
  /** Taux tranche 2 (10-25k EUR) en % */
  tauxTranche2: number;
  /** Taux tranche 3 (25-50k EUR) en % */
  tauxTranche3: number;
  /** Taux tranche 4 (>50k EUR) en % */
  tauxTranche4: number;
  /** Transfert social mensuel en EUR */
  transfertSocial: number;
  explanation: string;
}

export const fiscalRedistributionScenarios: FiscalRedistributionScenario[] = [
  {
    id: 'système-français',
    title: 'Système français (approx. IR 2024)',
    description:
      'Barème progressif inspire du barème de l\'impot sur le revenu français.',
    revenuMedian: 2500,
    tauxTranche1: 0,
    tauxTranche2: 11,
    tauxTranche3: 30,
    tauxTranche4: 41,
    transfertSocial: 200,
    explanation:
      'Le système fiscal français est l\'un des plus redistributifs d\'Europe. Avec une première tranche a 0% (qui exonere la moitie des foyers), une progressivité marquee et des transferts sociaux significatifs (RSA, prime d\'activité, APL), il réduit le Gini d\'environ 45%. Cependant, ce modèle génère aussi un taux de prélèvement obligatoire parmi les plus élevés au monde (45% du PIB).',
  },
  {
    id: 'flat-tax-20',
    title: 'Flat tax a 20%',
    description:
      'Impot proportionnel a taux unique, comme en Estonie ou en Bulgarie.',
    revenuMedian: 2500,
    tauxTranche1: 20,
    tauxTranche2: 20,
    tauxTranche3: 20,
    tauxTranche4: 20,
    transfertSocial: 200,
    explanation:
      'La flat tax applique le même taux a tous les revenus. Ses partisans avancent la simplicite, la transparence et la réduction de l\'évasion fiscale. Ses detracteurs soulignent la faible progressivité : les bas revenus paient proportionnellement autant que les hauts revenus. Plusieurs pays d\'Europe de l\'Est (Estonie, Bulgarie, Roumanie) ont adopte ce système.',
  },
  {
    id: 'tres-progressif',
    title: 'Système tres progressif',
    description:
      'Forte redistribution avec des taux élevés et des transferts généreux.',
    revenuMedian: 2500,
    tauxTranche1: 0,
    tauxTranche2: 20,
    tauxTranche3: 40,
    tauxTranche4: 55,
    transfertSocial: 600,
    explanation:
      'Un système tres progressif avec des taux marginaux élevés et des transferts généreux réduit fortement les inégalités. C\'est l\'approche des pays scandinaves (Danemark, Suede) qui combinent taux marginaux supérieurs a 50% et prestations sociales universelles. Le risque est l\'effet desincitatif sur l\'offre de travail et l\'exil fiscal des hauts revenus.',
  },
  {
    id: 'zero-impot-transferts',
    title: 'Zero impot, zero transfert',
    description:
      'Absence totale d\'intervention fiscale et sociale.',
    revenuMedian: 2500,
    tauxTranche1: 0,
    tauxTranche2: 0,
    tauxTranche3: 0,
    tauxTranche4: 0,
    transfertSocial: 0,
    explanation:
      'Sans fiscalité ni transferts, les inégalités de marché sont intactes. Le Gini reste à son niveau initial (environ 0.45 en France). Ce scénario théorique illustre l\'ampleur de la redistribution opérée par l\'État. Dans la réalité, même les pays les plus liberaux (États-Unis, Singapour) ont un minimum de redistribution.',
  },
  {
    id: 'impot-négatif',
    title: 'Impot négatif (Friedman)',
    description:
      'Les bas revenus recoivent un complement plutot que de payer l\'impot.',
    revenuMedian: 2500,
    tauxTranche1: 0,
    tauxTranche2: 10,
    tauxTranche3: 25,
    tauxTranche4: 35,
    transfertSocial: 500,
    explanation:
      'L\'impot négatif, propose par Milton Friedman, consiste a verser un complement de revenu aux ménages en dessous d\'un seuil plutot que de les imposer. La prime d\'activité française s\'en inspire partiellement. Ce système preserve l\'incitation au travail tout en garantissant un revenu minimum. Le taux effectif devient négatif pour les premiers déciles.',
  },
];

export function getFiscalRedistributionScenario(id: string): FiscalRedistributionScenario | undefined {
  return fiscalRedistributionScenarios.find((s) => s.id === id);
}
