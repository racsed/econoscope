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
  title: 'Fiscalité et redistribution',
  subtitle: 'Progressivité, prélèvements et réduction des inégalités',
  theme: 'fiscal',
  level: 'intermediate',
  introduction:
    "Ce module compare les effets de différents barèmes fiscaux sur la distribution des revenus. L'impot progressif prélevé davantage sur les hauts revenus, tandis qu'un impot proportionnel (flat tax) applique le même taux a tous. En combinant prélèvements et transferts sociaux, on mesure l'effet redistributif à travers le coefficient de Gini avant et après intervention publique.",
  limites: [
    'Pas d\'effets comportementaux (offre de travail, évasion fiscale)',
    'Pas de TVA ni de cotisations sociales dans le modèle',
    'Distribution des revenus simplifiee (approximation log-normale)',
    'Transferts sociaux forfaitaires, pas de ciblage selon la situation familiale',
  ],
  realite: [
    'Le barème de l\'IR français 2024 comporte 5 tranches (0%, 11%, 30%, 41%, 45%)',
    'Le RSA socle s\'élevé a 635 EUR/mois pour une personne seule en 2024',
    'La prime d\'activité complete les revenus des travailleurs modestes',
    'La France réduit son Gini de 0.52 (avant redistribution) a 0.29 (après)',
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
    tooltip: 'Taux marginal sur les revenus annuels de 0 à 10 000 EUR',
    group: 'Barème fiscal',
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
    tooltip: 'Taux marginal sur les revenus annuels de 10 000 à 25 000 EUR',
    group: 'Barème fiscal',
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
    tooltip: 'Taux marginal sur les revenus annuels de 25 000 à 50 000 EUR',
    group: 'Barème fiscal',
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
    tooltip: 'Taux marginal sur les revenus annuels supérieurs a 50 000 EUR',
    group: 'Barème fiscal',
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
    tooltip: 'Montant forfaitaire verse à chaque ménage (RSA, prime activité...)',
    group: 'Transferts',
  },
];

const scenarios: Scenario[] = [
  {
    id: 'système-français',
    label: 'Système français (approx.)',
    description: 'Barème progressif inspire de l\'IR français 2024',
    values: { revenu_median: 2500, taux_tranche1: 0, taux_tranche2: 11, taux_tranche3: 30, taux_tranche4: 41, transfert_social: 200 },
  },
  {
    id: 'flat-tax-20',
    label: 'Flat tax a 20%',
    description: 'Impot proportionnel unique, même taux pour tous',
    values: { revenu_median: 2500, taux_tranche1: 20, taux_tranche2: 20, taux_tranche3: 20, taux_tranche4: 20, transfert_social: 200 },
  },
  {
    id: 'tres-progressif',
    label: 'Système tres progressif',
    description: 'Forte redistribution avec transferts élevés',
    values: { revenu_median: 2500, taux_tranche1: 0, taux_tranche2: 20, taux_tranche3: 40, taux_tranche4: 55, transfert_social: 600 },
  },
  {
    id: 'zero-impot-transferts',
    label: 'Zero impot, zero transfert',
    description: 'État minimal, pas d\'intervention fiscale',
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
 * Generate 10 income déciles from the median using a log-normal-ish distribution.
 * Returns annual incomes sorted ascending.
 */
function generateDeciles(medianMensuel: number): number[] {
  const medianAnnuel = medianMensuel * 12;
  // Approximate décile multipliers based on French income distribution
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

  const déciles = generateDeciles(medianMensuel);

  // Compute taxes and net incomes
  const taxes = déciles.map((rev) => computeTax(rev, t1, t2, t3, t4));
  const revenusApres = déciles.map((rev, i) => Math.max(0, rev - taxes[i] + transfertAnnuel));
  const tauxEffectifs = déciles.map((rev, i) => (rev > 0 ? ((taxes[i] - transfertAnnuel) / rev) * 100 : 0));

  // Gini before and after
  const giniAvant = computeGini([...déciles].sort((a, b) => a - b));
  const giniApres = computeGini([...revenusApres].sort((a, b) => a - b));
  const reductionGini = giniAvant > 0 ? ((giniAvant - giniApres) / giniAvant) * 100 : 0;

  // Total tax revenue
  const recettesFiscales = taxes.reduce((a, b) => a + b, 0);
  const coutTransferts = transfertAnnuel * 10; // 10 déciles
  const soldeBudgetaire = recettesFiscales - coutTransferts;

  // Chart: déciles on X, bars for revenu avant/après, line for taux effectif
  const revenuAvantSeries: Point[] = déciles.map((rev, i) => ({ x: i + 1, y: rev / 12 }));
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
      label: 'Revenu net après redistribution',
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

  const maxRevenuMensuel = Math.max(...déciles, ...revenusApres) / 12;
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
      label: `Gini avant: ${giniAvant.toFixed(3)} / après: ${giniApres.toFixed(3)}`,
      color: '#6b7280',
    },
  ];

  const chartData: ChartData = {
    type: 'line',
    series,
    xLabel: 'Décile de revenu',
    yLabel: 'Revenu mensuel (EUR) / Taux effectif (%)',
    xDomain: [1, 10],
    yDomain: [Math.min(-200, ...tauxEffectifSeries.map((p) => p.y) as number[]), maxRevenuMensuel * 1.1],
    annotations,
  };

  // Narration
  const isProgressif = t1 < t2 && t2 < t3 && t3 < t4;
  const isFlat = t1 === t2 && t2 === t3 && t3 === t4;
  const isRegressif = t1 > t2 || t2 > t3 || t3 > t4;
  const typeBareme = isFlat ? 'proportionnel (flat tax)' : isProgressif ? 'progressif' : isRegressif ? 'régressif (les taux diminuent avec le revenu)' : 'non monotone';

  const observation = `Avec un barème ${typeBareme} (tranches : ${t1}%/${t2}%/${t3}%/${t4}%) et un transfert de ${transfertMensuel} EUR/mois, le Gini passe de ${giniAvant.toFixed(3)} (avant) a ${giniApres.toFixed(3)} (après), soit une réduction de ${reductionGini.toFixed(1)}%. Le taux effectif net varie de ${tauxEffectifs[0].toFixed(1)}% (D1) a ${tauxEffectifs[9].toFixed(1)}% (D10). Les recettes fiscales totales s'elevent a ${(recettesFiscales / 12).toFixed(0)} EUR/mois.`;

  let interpretation: string;

  if (reductionGini > 30) {
    interpretation = `Le système fiscal est fortement redistributif (réduction du Gini de ${reductionGini.toFixed(0)}%). Pourquoi ? La progressivité de l'impot fait que les hauts revenus contribuent proportionnellement plus : le D10 paie un taux effectif de ${tauxEffectifs[9].toFixed(1)}% tandis que le D1 à un taux effectif de ${tauxEffectifs[0].toFixed(1)}%. Les transferts forfaitaires amplifient l'effet : ils representent une part plus importante du revenu des ménages modestes (effet redistributif "par le bas"). Les premiers déciles sont bénéficiaires nets (taux effectif négatif).`;
  } else if (reductionGini > 10) {
    interpretation = `Le système fiscal à un effet redistributif modere (réduction du Gini de ${reductionGini.toFixed(0)}%). La progressivité du barème prélevé davantage sur les hauts revenus, et les transferts completent les bas revenus, mais l'écart entre D1 et D10 reste significatif. Pour une redistribution plus forte, il faudrait augmenter la progressivité (slider des tranches hautes) ou les transferts.`;
  } else {
    interpretation = `Le système fiscal à un faible effet redistributif (réduction du Gini de ${reductionGini.toFixed(0)}% seulement). `;
    if (isFlat) {
      interpretation += `Un impot proportionnel (même taux pour tous) ne redistribue que par les transferts : il prélevé le même pourcentage à chaque décile, donc l'écart relatif entre riches et pauvres reste quasiment inchange.`;
    } else if (isRegressif) {
      interpretation += `Le barème régressif accentue les inégalités au lieu de les réduire : les bas revenus paient un taux effectif plus élevé que les hauts revenus. Ce type de configuration est l'inverse de l'objectif redistributif.`;
    } else {
      interpretation += `Les taux sont trop faibles ou les transferts insuffisants pour réduire significativement les inégalités.`;
    }
  }

  // Equity-efficiency trade-off
  if (t4 > 50) {
    interpretation += ` Attention à l'arbitrage equite-efficacité : un taux marginal supérieur de ${t4}% peut décourager l'effort de travail, l'entrepreneuriat ou inciter à l'optimisation fiscale, réduisant l'assiette imposable (effet Laffer). Le gain redistributif doit etre mis en balance avec ces effets comportementaux.`;
  }

  if (transfertMensuel > 500 && t4 < 30) {
    interpretation += ` Des transferts généreux (${transfertMensuel} EUR/mois) associes à un barème peu progressif créent un déficit structurel et interrogent la soutenabilité du système.`;
  }

  if (soldeBudgetaire < 0) {
    interpretation += ` Le coût des transferts (${(coutTransferts / 12).toFixed(0)} EUR/mois) dépasse les recettes fiscales, generant un déficit budgétaire de ${(-soldeBudgetaire / 12).toFixed(0)} EUR/mois. Ce système n'est pas soutenable sans emprunt ou création monétaire.`;
  } else if (soldeBudgetaire > 0) {
    interpretation += ` Le système dégage un excédent budgétaire de ${(soldeBudgetaire / 12).toFixed(0)} EUR/mois, ce qui pourrait permettre de financer d'autres politiques publiques ou de réduire la dette.`;
  }

  return {
    outputs: [
      { id: 'gini_avant', label: 'Gini avant redistribution', value: round2(giniAvant) },
      { id: 'gini_apres', label: 'Gini après redistribution', value: round2(giniApres) },
      { id: 'reduction_gini', label: 'Réduction du Gini', value: round2(reductionGini), unit: '%' },
      { id: 'recettes_fiscales', label: 'Recettes fiscales mensuelles', value: round2(recettesFiscales / 12), unit: 'EUR' },
      { id: 'cout_transferts', label: 'Coût transferts mensuel', value: round2(coutTransferts / 12), unit: 'EUR' },
      { id: 'solde_budgetaire', label: 'Solde budgétaire mensuel', value: round2(soldeBudgetaire / 12), unit: 'EUR' },
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
