import type {
  SimulationModule,
  SimulationInput,
  Scenario,
  ComputeResult,
  ModuleMeta,
  ChartData,
  Point,
  Series,
  Annotation,
} from '../types';
import { registerModule } from '../core/registry';

const meta: ModuleMeta = {
  slug: 'fiscalite-redistribution',
  title: 'Fiscalite et redistribution',
  subtitle: 'Progressivite, prelevements et reduction des inegalites',
  theme: 'fiscal',
  level: 'intermediate',
  introduction:
    "Ce module compare les effets de differents baremes fiscaux sur la distribution des revenus. L'impot progressif preleve davantage sur les hauts revenus, tandis qu'un impot proportionnel (flat tax) applique le meme taux a tous. En combinant prelevements et transferts sociaux, on mesure l'effet redistributif a travers le coefficient de Gini avant et apres intervention publique.",
  limites: [
    'Pas d\'effets comportementaux (offre de travail, evasion fiscale)',
    'Pas de TVA ni de cotisations sociales dans le modele',
    'Distribution des revenus simplifiee (approximation log-normale)',
    'Transferts sociaux forfaitaires, pas de ciblage selon la situation familiale',
  ],
  realite: [
    'Le bareme de l\'IR francais 2024 comporte 5 tranches (0%, 11%, 30%, 41%, 45%)',
    'Le RSA socle s\'eleve a 635 EUR/mois pour une personne seule en 2024',
    'La prime d\'activite complete les revenus des travailleurs modestes',
    'La France reduit son Gini de 0.52 (avant redistribution) a 0.29 (apres)',
  ],
};

const inputs: SimulationInput[] = [
  {
    id: 'revenu_median',
    label: 'Revenu median mensuel',
    type: 'slider',
    min: 1500,
    max: 5000,
    step: 50,
    defaultValue: 2500,
    unit: 'EUR',
    tooltip: 'Revenu median de la population (avant impot)',
    group: 'Revenus',
  },
  {
    id: 'taux_tranche1',
    label: 'Taux tranche 1 (0-10k EUR)',
    type: 'slider',
    min: 0,
    max: 30,
    step: 1,
    defaultValue: 0,
    unit: '%',
    tooltip: 'Taux marginal sur les revenus annuels de 0 a 10 000 EUR',
    group: 'Bareme fiscal',
  },
  {
    id: 'taux_tranche2',
    label: 'Taux tranche 2 (10-25k EUR)',
    type: 'slider',
    min: 0,
    max: 40,
    step: 1,
    defaultValue: 14,
    unit: '%',
    tooltip: 'Taux marginal sur les revenus annuels de 10 000 a 25 000 EUR',
    group: 'Bareme fiscal',
  },
  {
    id: 'taux_tranche3',
    label: 'Taux tranche 3 (25-50k EUR)',
    type: 'slider',
    min: 0,
    max: 50,
    step: 1,
    defaultValue: 30,
    unit: '%',
    tooltip: 'Taux marginal sur les revenus annuels de 25 000 a 50 000 EUR',
    group: 'Bareme fiscal',
  },
  {
    id: 'taux_tranche4',
    label: 'Taux tranche 4 (>50k EUR)',
    type: 'slider',
    min: 0,
    max: 60,
    step: 1,
    defaultValue: 41,
    unit: '%',
    tooltip: 'Taux marginal sur les revenus annuels superieurs a 50 000 EUR',
    group: 'Bareme fiscal',
  },
  {
    id: 'transfert_social',
    label: 'Transfert social mensuel',
    type: 'slider',
    min: 0,
    max: 800,
    step: 10,
    defaultValue: 200,
    unit: 'EUR/mois',
    tooltip: 'Montant forfaitaire verse a chaque menage (RSA, prime activite...)',
    group: 'Transferts',
  },
];

const scenarios: Scenario[] = [
  {
    id: 'systeme-francais',
    label: 'Systeme francais (approx.)',
    description: 'Bareme progressif inspire de l\'IR francais 2024',
    values: { revenu_median: 2500, taux_tranche1: 0, taux_tranche2: 11, taux_tranche3: 30, taux_tranche4: 41, transfert_social: 200 },
  },
  {
    id: 'flat-tax-20',
    label: 'Flat tax a 20%',
    description: 'Impot proportionnel unique, meme taux pour tous',
    values: { revenu_median: 2500, taux_tranche1: 20, taux_tranche2: 20, taux_tranche3: 20, taux_tranche4: 20, transfert_social: 200 },
  },
  {
    id: 'tres-progressif',
    label: 'Systeme tres progressif',
    description: 'Forte redistribution avec transferts eleves',
    values: { revenu_median: 2500, taux_tranche1: 0, taux_tranche2: 20, taux_tranche3: 40, taux_tranche4: 55, transfert_social: 600 },
  },
  {
    id: 'zero-impot-transferts',
    label: 'Zero impot, zero transfert',
    description: 'Etat minimal, pas d\'intervention fiscale',
    values: { revenu_median: 2500, taux_tranche1: 0, taux_tranche2: 0, taux_tranche3: 0, taux_tranche4: 0, transfert_social: 0 },
  },
];

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

function round2(v: number): number {
  return Math.round(v * 100) / 100;
}

/**
 * Generate 10 income deciles from the median using a log-normal-ish distribution.
 * Returns annual incomes sorted ascending.
 */
function generateDeciles(medianMensuel: number): number[] {
  const medianAnnuel = medianMensuel * 12;
  // Approximate decile multipliers based on French income distribution
  const multipliers = [0.25, 0.45, 0.60, 0.75, 0.90, 1.10, 1.35, 1.70, 2.30, 4.00];
  return multipliers.map((m) => Math.max(0, medianAnnuel * m));
}

/**
 * Compute progressive tax on annual income.
 * Tranches: 0-10k, 10k-25k, 25k-50k, >50k
 */
function computeTax(revenuAnnuel: number, t1: number, t2: number, t3: number, t4: number): number {
  let tax = 0;
  const brackets = [
    { limit: 10000, rate: t1 / 100 },
    { limit: 25000, rate: t2 / 100 },
    { limit: 50000, rate: t3 / 100 },
    { limit: Infinity, rate: t4 / 100 },
  ];

  let remaining = Math.max(0, revenuAnnuel);
  let lower = 0;

  for (const bracket of brackets) {
    const taxable = Math.min(remaining, bracket.limit - lower);
    if (taxable <= 0) break;
    tax += taxable * bracket.rate;
    remaining -= taxable;
    lower = bracket.limit;
  }

  return tax;
}

/**
 * Compute Gini coefficient from a sorted array of incomes.
 */
function computeGini(incomes: number[]): number {
  const n = incomes.length;
  if (n === 0) return 0;
  const total = incomes.reduce((a, b) => a + b, 0);
  if (total <= 0) return 0;

  let sumNumerator = 0;
  for (let i = 0; i < n; i++) {
    sumNumerator += (2 * (i + 1) - n - 1) * incomes[i];
  }
  const gini = sumNumerator / (n * total);
  return clamp(gini, 0, 1);
}

function compute(values: Record<string, number | boolean | string>): ComputeResult {
  const medianMensuel = clamp(Number(values.revenu_median) || 2500, 1500, 5000);
  const t1 = clamp(Number(values.taux_tranche1) || 0, 0, 30);
  const t2 = clamp(Number(values.taux_tranche2) || 14, 0, 40);
  const t3 = clamp(Number(values.taux_tranche3) || 30, 0, 50);
  const t4 = clamp(Number(values.taux_tranche4) || 41, 0, 60);
  const transfertMensuel = clamp(Number(values.transfert_social) || 200, 0, 800);
  const transfertAnnuel = transfertMensuel * 12;

  const deciles = generateDeciles(medianMensuel);

  // Compute taxes and net incomes
  const taxes = deciles.map((rev) => computeTax(rev, t1, t2, t3, t4));
  const revenusApres = deciles.map((rev, i) => Math.max(0, rev - taxes[i] + transfertAnnuel));
  const tauxEffectifs = deciles.map((rev, i) => (rev > 0 ? ((taxes[i] - transfertAnnuel) / rev) * 100 : 0));

  // Gini before and after
  const giniAvant = computeGini([...deciles].sort((a, b) => a - b));
  const giniApres = computeGini([...revenusApres].sort((a, b) => a - b));
  const reductionGini = giniAvant > 0 ? ((giniAvant - giniApres) / giniAvant) * 100 : 0;

  // Total tax revenue
  const recettesFiscales = taxes.reduce((a, b) => a + b, 0);
  const coutTransferts = transfertAnnuel * 10; // 10 deciles
  const soldeBudgetaire = recettesFiscales - coutTransferts;

  // Chart: deciles on X, bars for revenu avant/apres, line for taux effectif
  const revenuAvantSeries: Point[] = deciles.map((rev, i) => ({ x: i + 1, y: rev / 12 }));
  const revenuApresSeries: Point[] = revenusApres.map((rev, i) => ({ x: i + 1, y: rev / 12 }));
  const tauxEffectifSeries: Point[] = tauxEffectifs.map((t, i) => ({ x: i + 1, y: t }));

  const series: Series[] = [
    {
      id: 'revenu_avant',
      label: 'Revenu brut mensuel',
      color: '#94a3b8',
      data: revenuAvantSeries,
      strokeWidth: 2.5,
      area: true,
      areaOpacity: 0.2,
    },
    {
      id: 'revenu_apres',
      label: 'Revenu net apres redistribution',
      color: '#3b82f6',
      data: revenuApresSeries,
      strokeWidth: 2.5,
      area: true,
      areaOpacity: 0.2,
    },
    {
      id: 'taux_effectif',
      label: 'Taux effectif net (%)',
      color: '#f59e0b',
      data: tauxEffectifSeries,
      strokeWidth: 2,
      dashed: true,
    },
  ];

  const maxRevenuMensuel = Math.max(...deciles, ...revenusApres) / 12;
  const maxTaux = Math.max(...tauxEffectifs.map(Math.abs));

  const annotations: Annotation[] = [
    {
      type: 'line',
      x1: 1,
      y1: 0,
      x2: 10,
      y2: 0,
      label: 'Taux effectif net = 0%',
      color: '#94a3b8',
    },
    {
      type: 'label',
      x: 5,
      y: maxRevenuMensuel * 0.95,
      label: `Gini avant: ${giniAvant.toFixed(3)} / apres: ${giniApres.toFixed(3)}`,
      color: '#6b7280',
    },
  ];

  const chartData: ChartData = {
    type: 'line',
    series,
    xLabel: 'Decile de revenu',
    yLabel: 'Revenu mensuel (EUR) / Taux effectif (%)',
    xDomain: [1, 10],
    yDomain: [Math.min(-200, ...tauxEffectifSeries.map((p) => p.y) as number[]), maxRevenuMensuel * 1.1],
    annotations,
  };

  // Narration
  const isProgressif = t1 < t2 && t2 < t3 && t3 < t4;
  const isFlat = t1 === t2 && t2 === t3 && t3 === t4;
  const typeBareme = isFlat ? 'proportionnel (flat tax)' : isProgressif ? 'progressif' : 'non monotone';

  const observation = `Avec un bareme ${typeBareme} et un transfert de ${transfertMensuel} EUR/mois, le Gini passe de ${giniAvant.toFixed(3)} (avant) a ${giniApres.toFixed(3)} (apres), soit une reduction de ${reductionGini.toFixed(1)}%. Le taux effectif net varie de ${tauxEffectifs[0].toFixed(1)}% (D1) a ${tauxEffectifs[9].toFixed(1)}% (D10). Les recettes fiscales totales s'elevent a ${(recettesFiscales / 12).toFixed(0)} EUR/mois.`;

  let interpretation: string;

  if (reductionGini > 30) {
    interpretation = `Le systeme fiscal est fortement redistributif. La combinaison d'un bareme progressif et de transferts sociaux reduit les inegalites de ${reductionGini.toFixed(0)}%. Les premiers deciles sont beneficiaires nets (taux effectif negatif grace aux transferts).`;
  } else if (reductionGini > 10) {
    interpretation = `Le systeme fiscal a un effet redistributif modere (reduction du Gini de ${reductionGini.toFixed(0)}%). La progressivite du bareme et les transferts attenuent les ecarts de revenus sans les supprimer.`;
  } else {
    interpretation = `Le systeme fiscal a un faible effet redistributif (reduction du Gini de ${reductionGini.toFixed(0)}% seulement). ${isFlat ? 'Un impot proportionnel sans forte progressivite redistribue peu.' : 'Les taux sont trop faibles ou les transferts insuffisants pour reduire significativement les inegalites.'}`;
  }

  if (soldeBudgetaire < 0) {
    interpretation += ` Attention : le cout des transferts (${(coutTransferts / 12).toFixed(0)} EUR/mois) depasse les recettes fiscales, generant un deficit budgetaire de ${(-soldeBudgetaire / 12).toFixed(0)} EUR/mois.`;
  }

  return {
    outputs: [
      { id: 'gini_avant', label: 'Gini avant redistribution', value: round2(giniAvant) },
      { id: 'gini_apres', label: 'Gini apres redistribution', value: round2(giniApres) },
      { id: 'reduction_gini', label: 'Reduction du Gini', value: round2(reductionGini), unit: '%' },
      { id: 'recettes_fiscales', label: 'Recettes fiscales mensuelles', value: round2(recettesFiscales / 12), unit: 'EUR' },
      { id: 'cout_transferts', label: 'Cout transferts mensuel', value: round2(coutTransferts / 12), unit: 'EUR' },
      { id: 'solde_budgetaire', label: 'Solde budgetaire mensuel', value: round2(soldeBudgetaire / 12), unit: 'EUR' },
      { id: 'taux_effectif_d1', label: 'Taux effectif D1', value: round2(tauxEffectifs[0]), unit: '%' },
      { id: 'taux_effectif_d10', label: 'Taux effectif D10', value: round2(tauxEffectifs[9]), unit: '%' },
    ],
    chartData,
    narration: { observation, interpretation },
  };
}

const fiscalRedistributionModule: SimulationModule = { meta, inputs, scenarios, compute };

registerModule(fiscalRedistributionModule);

export { fiscalRedistributionModule };
export default fiscalRedistributionModule;
