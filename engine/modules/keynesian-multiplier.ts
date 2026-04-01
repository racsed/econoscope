import type {
  SimulationModule,
  SimulationInput,
  Scenario,
  ComputeResult,
  ModuleMeta,
  CascadeData,
  CascadeBar,
} from '../types';
import { registerModule } from '../core/registry';

const meta: ModuleMeta = {
  slug: 'multiplicateur-keynesien',
  title: 'Multiplicateur keynésien',
  subtitle: "L'effet amplificateur de la dépense publique",
  theme: 'macro',
  level: 'accessible',
  introduction:
    "Le multiplicateur keynésien montre comment une injection initiale de dépenses se propage dans l'économie par des tours successifs de consommation. Chaque euro dépensé génère des revenus qui sont à leur tour partiellement dépensés, créant un effet en cascade.",
  limites: [
    "Suppose des capacités de production inutilisées (pas de plein-emploi)",
    "Ignore les effets sur les taux d'intérêt (pas d'éviction financière)",
    "Ne tient pas compte du délai de propagation",
    "Propensions marginales supposées constantes",
  ],
  economists: ['john-maynard-keynes'],
  realite: [
    "Le FMI estime le multiplicateur budgétaire entre 0.4 et 2.5 selon le contexte",
    "En récession, le multiplicateur est généralement plus élevé (>1)",
    "Les dépenses d'infrastructures ont un multiplicateur plus fort que les baisses d'impôts",
  ],
};

const inputs: SimulationInput[] = [
  {
    id: 'depense_initiale',
    label: 'Dépense initiale',
    type: 'slider',
    min: 1,
    max: 100,
    step: 1,
    defaultValue: 10,
    unit: 'Mds\u20ac',
    tooltip: "Montant de la dépense publique initiale injectee dans l'économie",
    group: 'Injection',
  },
  {
    id: 'propension_consommer',
    label: 'Propension marginale à consommer (c)',
    type: 'slider',
    min: 0.1,
    max: 0.95,
    step: 0.05,
    defaultValue: 0.8,
    tooltip: "Part de chaque euro supplémentaire de revenu qui est consommee",
    group: 'Comportement',
  },
  {
    id: 'taux_imposition',
    label: "Taux d'imposition (t)",
    type: 'slider',
    min: 0,
    max: 0.5,
    step: 0.01,
    defaultValue: 0.2,
    tooltip: "Part prélevée sous forme de taxes à chaque tour",
    group: 'Fuites',
  },
  {
    id: 'propension_importer',
    label: "Propension marginale à importer (m)",
    type: 'slider',
    min: 0,
    max: 0.4,
    step: 0.01,
    defaultValue: 0.1,
    tooltip: "Part de la consommation supplémentaire consacrée aux importations",
    group: 'Fuites',
  },
  {
    id: 'nb_tours',
    label: 'Nombre de tours',
    type: 'slider',
    min: 1,
    max: 20,
    step: 1,
    defaultValue: 10,
    group: 'Simulation',
  },
];

const scenarios: Scenario[] = [
  {
    id: 'keynes_simple',
    label: 'Multiplicateur simple',
    description: "Économie fermee sans impôts, propension de 0.8",
    values: { depense_initiale: 10, propension_consommer: 0.8, taux_imposition: 0, propension_importer: 0, nb_tours: 15 },
  },
  {
    id: 'economie_ouverte',
    label: 'Économie ouverte',
    description: "Avec impôts et importations, multiplicateur réduit",
    values: { depense_initiale: 10, propension_consommer: 0.8, taux_imposition: 0.2, propension_importer: 0.15, nb_tours: 15 },
  },
  {
    id: 'relance_france',
    label: 'Relance budgétaire France',
    description: "Paramètres proches de l'économie française",
    values: { depense_initiale: 20, propension_consommer: 0.85, taux_imposition: 0.25, propension_importer: 0.2, nb_tours: 15 },
  },
  {
    id: 'multiplicateur_faible',
    label: 'Multiplicateur faible',
    description: "Fortes fuites : épargne élevée, impôts élevés, importations",
    values: { depense_initiale: 10, propension_consommer: 0.5, taux_imposition: 0.3, propension_importer: 0.2, nb_tours: 15 },
  },
];

/**
 * Multiplicateur en économie ouverte avec impôts:
 * k = 1 / (1 - c*(1-t) + m)
 *
 * A chaque tour n :
 *   revenu_n = depense_initiale * [c*(1-t) - m]^(n-1)  (for n >= 1, round 0 is the initial injection)
 *   Actually more precisely: the marginal propensity to spend domestically = c*(1-t) - m
 *   Wait - standard formula: spending at round n = G * [c(1-t)(1-m)]^n... let me be precise.
 *
 * Round 0: G (full injection)
 * Round n: income_n = G * alpha^n where alpha = c * (1 - t) * (1 - m)
 *   - consumption_n = income_n * c * (1 - t)   (but part goes to imports)
 *   - domestic consumption = income_n * c * (1 - t) * (1 - m)
 *   - taxes_n = income_n * t  (from the previous round's income before consumption décision)
 *
 * More carefully:
 * Round 0: spending = G, no tax/savings/import breakdown (it's the injection)
 * Round 1: income = G
 *   taxes = G * t
 *   disposable = G * (1 - t)
 *   consumption = G * (1 - t) * c
 *   imports = consumption * m/(1-m)...
 *
 * Simplest correct approach:
 * Round 0 (injection): total = G
 * Round n >= 1:
 *   income at start of round = previous round's domestic spending
 *   taxes = income * t
 *   disposable = income * (1 - t)
 *   total_consumption = disposable * c
 *   savings = disposable * (1 - c)
 *   imports = total_consumption * m  (propension to import from consumption)
 *   domestic_spending = total_consumption * (1 - m) = c * (1-t) * (1-m) * income
 *   => alpha = c * (1-t) * (1-m)
 *
 * Multiplier k = 1 / (1 - alpha) = 1 / (1 - c*(1-t)*(1-m))
 */
function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

function compute(values: Record<string, number | boolean | string>): ComputeResult {
  const depenseInitiale = clamp(Number(values.depense_initiale) || 10, 1, 100);
  const c = clamp(Number(values.propension_consommer) || 0.8, 0.1, 0.95);
  const t = clamp(Number(values.taux_imposition) || 0.2, 0, 0.5);
  const m = clamp(Number(values.propension_importer) || 0.1, 0, 0.4);
  const nbTours = clamp(Number(values.nb_tours) || 10, 1, 20);

  const alpha = Math.min(c * (1 - t) * (1 - m), 0.999);
  const multiplicateur = 1 / (1 - alpha);
  const asymptote = depenseInitiale * multiplicateur;

  const bars: CascadeBar[] = [];
  let cumulative = 0;

  for (let n = 0; n <= nbTours; n++) {
    if (n === 0) {
      cumulative = depenseInitiale;
      bars.push({
        round: 0,
        total: depenseInitiale,
        consumption: depenseInitiale,
        savings: 0,
        taxes: 0,
        imports: 0,
        cumulative,
      });
    } else {
      // Round n income = G * alpha^(n-1). Round n domestic spending = G * alpha^n.
      const roundIncome = depenseInitiale * Math.pow(alpha, n - 1);
      const roundTaxes = roundIncome * t;
      const roundDisposable = roundIncome * (1 - t);
      const roundConsumption = roundDisposable * c;
      const roundSavings = roundDisposable * (1 - c);
      const roundImports = roundConsumption * m;
      const roundDomesticSpending = roundConsumption * (1 - m);
      // roundDomesticSpending should equal depenseInitiale * alpha^n... let's verify:
      // roundIncome * (1-t) * c * (1-m) = depenseInitiale * alpha^(n-1) * alpha = depenseInitiale * alpha^n. Correct.

      cumulative += roundDomesticSpending;

      bars.push({
        round: n,
        total: round2(roundDomesticSpending),
        consumption: round2(roundConsumption),
        savings: round2(roundSavings),
        taxes: round2(roundTaxes),
        imports: round2(roundImports),
        cumulative: round2(cumulative),
      });
    }
  }

  const cascadeData: CascadeData = {
    type: 'bar-cascade',
    bars,
    asymptote: round2(asymptote),
    multiplier: round2(multiplicateur),
  };

  // Narration
  const fuites = 1 - alpha;
  const observation = `Une injection initiale de ${depenseInitiale} Mds\u20ac génère, après ${nbTours} tours, un revenu cumule de ${round2(cumulative)} Mds\u20ac (soit ${(cumulative / depenseInitiale * 100).toFixed(0)}% de l'injection initiale). L'asymptote théorique est de ${round2(asymptote)} Mds\u20ac.`;

  let interpretation = `Le multiplicateur est de ${round2(multiplicateur)}, avec un coefficient de propagation alpha = ${round2(alpha)}. `;
  interpretation += `A chaque tour, ${(alpha * 100).toFixed(0)}% du revenu est redépensé localement. Les fuites totales representent ${(fuites * 100).toFixed(0)}% : `;

  const fuitesDetail: string[] = [];
  if (t > 0) fuitesDetail.push(`impôts (${(t * 100).toFixed(0)}%)`);
  if (1 - c > 0.01) fuitesDetail.push(`épargne (${((1 - c) * 100).toFixed(0)}% du disponible)`);
  if (m > 0) fuitesDetail.push(`importations (${(m * 100).toFixed(0)}% de la consommation)`);
  interpretation += fuitesDetail.join(', ') + '.';

  if (multiplicateur < 1.2) {
    interpretation += " Le multiplicateur est très faible : les fuites absorbent l'essentiel de l'injection. La politique budgétaire serait peu efficace dans ce contexte. L'essentiel de la dépense publique \"fuit\" vers l'épargne, les impôts ou l'étranger dès le premier tour.";
  } else if (multiplicateur > 3) {
    interpretation += " Le multiplicateur est très élevé : l'économie amplifie fortement l'impulsion budgétaire. Cela suppose toutefois des capacités productives inutilisées (chômage, usines en sous-régime), sinon l'effet se dissipe en inflation plutôt qu'en production réelle.";
  } else if (multiplicateur > 1.5 && multiplicateur <= 3) {
    interpretation += ` Le multiplicateur de ${round2(multiplicateur)} est dans la fourchette typique des économies développées en récession. Chaque euro de dépense publique génère environ ${round2(multiplicateur)} euros de revenu total, l'effet en cascade étant modéré par les fuites.`;
  }

  if (c > 0.85) {
    interpretation += ` La forte propension à consommer (${(c * 100).toFixed(0)}%) indique une population qui dépense rapidement ses revenus supplémentaires, amplifiant la propagation. C'est typique des ménages a bas revenus.`;
  } else if (c < 0.5) {
    interpretation += ` La faible propension à consommer (${(c * 100).toFixed(0)}%) signifie que les ménages épargnent l'essentiel de leur revenu supplémentaire, freinant la propagation. Le multiplicateur s'en trouve considérablement réduit.`;
  }

  return {
    outputs: [
      { id: 'multiplicateur', label: 'Multiplicateur', value: round2(multiplicateur) },
      { id: 'alpha', label: 'Coefficient de propagation', value: round2(alpha) },
      { id: 'effet_total', label: 'Effet total (asymptote)', value: round2(asymptote), unit: 'Mds\u20ac' },
      { id: 'cumul_apres_n', label: `Cumul après ${nbTours} tours`, value: round2(cumulative), unit: 'Mds\u20ac' },
      { id: 'convergence', label: 'Convergence', value: round2((cumulative / asymptote) * 100), unit: '%' },
    ],
    chartData: cascadeData,
    narration: { observation, interpretation },
  };
}

function round2(v: number): number {
  return Math.round(v * 100) / 100;
}

const keynesianMultiplierModule: SimulationModule = { meta, inputs, scenarios, compute };

registerModule(keynesianMultiplierModule);

export { keynesianMultiplierModule };
export default keynesianMultiplierModule;
