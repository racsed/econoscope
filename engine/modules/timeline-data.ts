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
  slug: 'donnees-historiques',
  title: 'Donnees historiques de la France',
  subtitle: 'Visualisez les grands indicateurs economiques depuis 1960',
  theme: 'macro',
  level: 'accessible',
  introduction:
    "Explorez l'evolution des principaux indicateurs macroeconomiques de la France depuis 1960. Deplacez le curseur pour voyager dans le temps et observer la croissance, l'inflation, le chomage et la dette publique a travers les grandes periodes de l'histoire economique francaise : des Trente Glorieuses a aujourd'hui.",
  limites: [
    'Donnees interpolees lineairement entre les points connus',
    'Les series ne couvrent pas toutes les memes periodes',
    'Sources : INSEE, Banque de France, FMI -- les methodologies ont evolue dans le temps',
  ],
  realite: [
    'Le PIB francais a ete multiplie par 5 en volume entre 1960 et 2024',
    "L'inflation a depasse 13% en 1974, un record dans la France moderne",
    'La dette publique est passee de 20% du PIB en 1980 a 112% en 2024',
  ],
  course: {
    introduction: "Comprendre l'économie actuelle exige de connaître son histoire. Les grandes séries statistiques (croissance, inflation, chômage, dette) racontent l'histoire économique d'un pays mieux que n'importe quel récit. La France offre un cas d'étude particulièrement riche : des Trente Glorieuses (1945-1973), période de croissance exceptionnelle à 5-6 % par an, aux crises qui ont suivi (chocs pétroliers, désindustrialisation, crise financière de 2008, pandémie de 2020), chaque rupture a laissé une empreinte visible dans les données.\n\nLa lecture des données historiques n'est pas un exercice passif. Elle demande de mettre en relation les indicateurs entre eux et de les relier aux événements politiques, sociaux et internationaux. Par exemple, la hausse brutale de l'inflation en 1974 s'explique par le premier choc pétrolier (quadruplement du prix du baril par l'OPEP). La montée du chômage à partir de 1975 résulte du ralentissement de la croissance et de la restructuration industrielle. L'envolée de la dette publique à partir des années 1980 traduit l'accumulation des déficits budgétaires liés au ralentissement de la croissance et à la hausse des dépenses sociales.\n\nCe module vous permet de voyager dans le temps et d'observer comment les grands indicateurs évoluent ensemble. Vous constaterez que les Trente Glorieuses cumulaient forte croissance, faible chômage et endettement modéré, mais avec une inflation non négligeable. Vous verrez que la période actuelle est marquée par une croissance faible, un chômage structurel élevé et une dette publique record, mais une inflation longtemps très basse (avant le retour inflationniste de 2021-2023). Ces données sont les briques de base de l'analyse conjoncturelle et structurelle que pratiquent les économistes, les banques centrales et les gouvernements.",
    keyConcepts: [
      { term: "Taux de croissance du PIB", definition: "Variation annuelle en pourcentage du Produit Intérieur Brut en volume (corrigé de l'inflation). C'est l'indicateur le plus synthétique de la performance économique. En France, il est passé de 5-6 % par an dans les années 1960 à environ 1-2 % depuis les années 2000." },
      { term: "Taux d'inflation", definition: "Variation annuelle du niveau général des prix, mesurée par l'indice des prix à la consommation (IPC). L'inflation érode le pouvoir d'achat de la monnaie. La BCE vise une inflation de 2 % à moyen terme. La France a connu des périodes de forte inflation (>10 % dans les années 1970) et de quasi-déflation (0,1 % en 2015)." },
      { term: "Taux de chômage", definition: "Part de la population active qui est sans emploi et en recherche active d'emploi (définition BIT). En France, il est passé de moins de 3 % dans les années 1960 à un pic de plus de 10 % dans les années 1990 et 2010. C'est un indicateur retardé : il réagit avec un délai aux cycles économiques." },
      { term: "Dette publique (en % du PIB)", definition: "Encours total de la dette de l'État, des collectivités locales et de la Sécurité sociale, rapporté au PIB. Ce ratio permet de comparer l'endettement dans le temps et entre pays. En France, il est passé de 20 % du PIB en 1980 à 112 % en 2024, franchissant le seuil symbolique de 100 % en 2020." },
      { term: "Analyse conjoncturelle", definition: "Étude de la situation économique à un instant donné, à travers les indicateurs de court terme (croissance trimestrielle, inflation mensuelle, chômage). Elle permet de situer l'économie dans le cycle (expansion, ralentissement, récession, reprise) et d'orienter les politiques de stabilisation." },
    ],
    methodology: "Déplacez le curseur temporel pour voyager dans l'histoire économique française. Commencez par les Trente Glorieuses (1960-1973) et observez la forte croissance et la faible dette. Avancez jusqu'au premier choc pétrolier (1973) et notez l'explosion de l'inflation. Observez la montée du chômage dans les années 1980-90. Arrivez à 2008 pour voir l'impact de la crise financière. Terminez par la période Covid (2020). A chaque étape, reliez les mouvements des différents indicateurs entre eux.",
    forTeachers: "Utilisez ce module comme introduction à un cours d'histoire économique. Demandez aux élèves de repérer les grandes ruptures dans les séries et de proposer des explications. L'exercice « Quelle est la meilleure époque pour l'économie française ? » oblige à pondérer les différents indicateurs et à découvrir les arbitrages (croissance forte mais inflation élevée dans les années 1960, par exemple).",
  },
};

// ── Real data arrays ────────────────────────────────────────────────────

const pibCroissance: [number, number][] = [
  [1960, 8.0], [1965, 4.8], [1970, 5.7], [1973, 6.5], [1975, -1.0],
  [1980, 1.6], [1985, 1.6], [1990, 2.6], [1993, -0.6], [1995, 2.1],
  [2000, 3.9], [2003, 0.8], [2007, 2.4], [2008, 0.3], [2009, -2.9],
  [2010, 1.9], [2012, 0.3], [2015, 1.1], [2017, 2.4], [2019, 1.8],
  [2020, -7.9], [2021, 6.8], [2022, 2.5], [2023, 0.7], [2024, 1.1],
];

const inflation: [number, number][] = [
  [1960, 3.6], [1965, 2.5], [1970, 5.2], [1974, 13.7], [1975, 11.8],
  [1980, 13.6], [1985, 5.8], [1990, 3.4], [1995, 1.8], [2000, 1.8],
  [2005, 1.9], [2010, 1.7], [2015, 0.1], [2020, 0.5], [2021, 2.1],
  [2022, 5.9], [2023, 4.9], [2024, 2.2],
];

const chomage: [number, number][] = [
  [1970, 2.4], [1975, 4.2], [1980, 6.2], [1985, 10.2], [1990, 8.5],
  [1993, 11.1], [1997, 11.4], [2000, 8.6], [2005, 8.9], [2008, 7.4],
  [2009, 9.1], [2012, 9.8], [2015, 10.4], [2017, 9.4], [2019, 8.4],
  [2020, 8.0], [2022, 7.3], [2023, 7.1], [2024, 7.3],
];

const dettePublique: [number, number][] = [
  [1980, 20], [1990, 35], [1995, 55], [2000, 58], [2005, 67],
  [2008, 68], [2009, 83], [2012, 90], [2015, 96], [2017, 98],
  [2019, 98], [2020, 115], [2021, 113], [2022, 112], [2023, 111],
  [2024, 112],
];

type IndicateurKey = 'pib_croissance' | 'inflation' | 'chomage' | 'dette_publique';

const dataMap: Record<IndicateurKey, { data: [number, number][]; label: string; unit: string; color: string }> = {
  pib_croissance: { data: pibCroissance, label: 'Croissance du PIB', unit: '%', color: '#3b82f6' },
  inflation: { data: inflation, label: 'Inflation', unit: '%', color: '#ef4444' },
  chomage: { data: chomage, label: 'Chomage', unit: '%', color: '#f59e0b' },
  dette_publique: { data: dettePublique, label: 'Dette publique (% PIB)', unit: '% PIB', color: '#8b5cf6' },
};

// ── Linear interpolation ────────────────────────────────────────────────

function interpolate(data: [number, number][], year: number): number | null {
  if (data.length === 0) return null;
  if (year <= data[0][0]) return data[0][1];
  if (year >= data[data.length - 1][0]) return data[data.length - 1][1];

  for (let i = 0; i < data.length - 1; i++) {
    const [y0, v0] = data[i];
    const [y1, v1] = data[i + 1];
    if (year >= y0 && year <= y1) {
      const t = (year - y0) / (y1 - y0);
      return v0 + t * (v1 - v0);
    }
  }
  return null;
}

function getFullSeries(data: [number, number][]): Point[] {
  if (data.length === 0) return [];
  const startYear = data[0][0];
  const endYear = data[data.length - 1][0];
  const points: Point[] = [];
  for (let y = startYear; y <= endYear; y++) {
    const val = interpolate(data, y);
    if (val !== null) {
      points.push({ x: y, y: val });
    }
  }
  return points;
}

// ── Narration by period ─────────────────────────────────────────────────

function getNarration(year: number, indicateur: IndicateurKey, value: number): { observation: string; interpretation: string } {
  const labelMap: Record<IndicateurKey, string> = {
    pib_croissance: 'la croissance du PIB',
    inflation: "l'inflation",
    chomage: 'le taux de chomage',
    dette_publique: 'la dette publique',
  };
  const ind = labelMap[indicateur];
  const valStr = value.toFixed(1);

  let period = '';
  let context = '';

  if (year >= 1960 && year <= 1973) {
    period = 'les Trente Glorieuses';
    context = "La France connait une croissance exceptionnelle portee par l'industrialisation, l'exode rural et la reconstruction d'apres-guerre. Le plein emploi est quasi atteint, et l'inflation reste moderee grace aux gains de productivite.";
  } else if (year >= 1974 && year <= 1982) {
    period = "la periode des chocs petroliers";
    context = "Les chocs petroliers de 1973 et 1979 provoquent la stagflation : inflation a deux chiffres et montee du chomage. La fin des Trente Glorieuses marque un tournant structurel pour l'economie francaise.";
  } else if (year >= 1983 && year <= 1995) {
    period = "l'ere Mitterrand et la desinflation competitive";
    context = "Le tournant de la rigueur (1983) marque l'abandon de la relance keynesienne au profit de la desinflation competitive. La France s'arrime au mark allemand via le SME, ce qui fait baisser l'inflation mais maintient un chomage eleve.";
  } else if (year >= 1996 && year <= 2002) {
    period = "la convergence vers l'euro";
    context = "La France se conforme aux criteres de Maastricht pour adopter l'euro. L'inflation est maitrisee, la croissance repart grace a la bulle internet, et le chomage recule lentement. L'euro entre en circulation le 1er janvier 2002.";
  } else if (year >= 2003 && year <= 2007) {
    period = "l'expansion d'avant-crise";
    context = "La croissance mondiale tire l'economie francaise, mais les desequilibres s'accumulent dans le systeme financier international. La dette publique continue de progresser malgre la croissance.";
  } else if (year >= 2008 && year <= 2012) {
    period = "la Grande Recession et la crise de la zone euro";
    context = "La crise des subprimes (2008) puis la crise des dettes souveraines (2010-2012) frappent durement l'economie. Les plans de relance puis l'austerite se succedent, la dette publique bondit et le chomage s'envole.";
  } else if (year >= 2013 && year <= 2019) {
    period = "la reprise lente post-crise";
    context = "La croissance reprend lentement, soutenue par la politique monetaire ultra-accommodante de la BCE (taux negatifs, QE). Le chomage recule progressivement mais la dette reste a des niveaux eleves.";
  } else if (year === 2020) {
    period = "la crise du COVID-19";
    context = "Les confinements provoquent un choc d'offre et de demande inedit. Le PIB chute de 7.9%, le 'quoi qu'il en coute' fait exploser la dette publique de 98% a 115% du PIB en un an.";
  } else if (year >= 2021 && year <= 2022) {
    period = "le rebond post-COVID et le retour de l'inflation";
    context = "L'economie rebondit vigoureusement en 2021, mais l'inflation fait son retour, alimentee par les ruptures d'approvisionnement et la guerre en Ukraine. La BCE commence a remonter ses taux en 2022.";
  } else {
    period = "la periode recente";
    context = "L'economie francaise fait face a un triple defi : maitriser l'inflation residuelle, reduire la dette publique et maintenir la croissance dans un contexte geopolitique incertain.";
  }

  const observation = `En ${year}, durant ${period}, ${ind} en France est de ${valStr}${indicateur === 'dette_publique' ? '% du PIB' : '%'}.`;
  const interpretation = context;

  return { observation, interpretation };
}

// ── Inputs ──────────────────────────────────────────────────────────────

const inputs: SimulationInput[] = [
  {
    id: 'annee',
    label: 'Annee',
    type: 'slider',
    min: 1960,
    max: 2024,
    step: 1,
    defaultValue: 2023,
    tooltip: "Deplacez le curseur pour voyager dans le temps",
    group: 'Parametres',
  },
  {
    id: 'indicateur',
    label: 'Indicateur',
    type: 'select',
    defaultValue: 'pib_croissance',
    options: [
      { value: 'pib_croissance', label: 'Croissance du PIB (%)' },
      { value: 'inflation', label: 'Inflation (%)' },
      { value: 'chomage', label: 'Chomage (%)' },
      { value: 'dette_publique', label: 'Dette publique (% du PIB)' },
    ],
    tooltip: "Choisissez l'indicateur economique a afficher",
    group: 'Parametres',
  },
];

// ── Scenarios ───────────────────────────────────────────────────────────

const scenarios: Scenario[] = [
  {
    id: 'trente-glorieuses',
    label: 'Trente Glorieuses (1968)',
    description: 'Croissance de 5% et plein emploi',
    values: { annee: 1968, indicateur: 'pib_croissance' },
  },
  {
    id: 'choc-petrolier',
    label: 'Choc petrolier (1975)',
    description: 'Stagflation et inflation a deux chiffres',
    values: { annee: 1975, indicateur: 'inflation' },
  },
  {
    id: 'mitterrand',
    label: 'Tournant de la rigueur (1983)',
    description: 'Desinflation competitive et montee du chomage',
    values: { annee: 1983, indicateur: 'chomage' },
  },
  {
    id: 'crise-2008',
    label: 'Crise financiere (2009)',
    description: 'Recession mondiale et explosion de la dette',
    values: { annee: 2009, indicateur: 'pib_croissance' },
  },
  {
    id: 'covid',
    label: 'COVID-19 (2020)',
    description: 'Choc inedit : -7.9% de PIB et dette a 115%',
    values: { annee: 2020, indicateur: 'pib_croissance' },
  },
  {
    id: 'today',
    label: "Aujourd'hui (2024)",
    description: 'Reprise moderee et dette elevee',
    values: { annee: 2024, indicateur: 'dette_publique' },
  },
];

// ── Compute ─────────────────────────────────────────────────────────────

function compute(values: Record<string, number | boolean | string>): ComputeResult {
  const annee = Math.round(Math.max(1960, Math.min(2024, Number(values.annee) || 2023)));
  const indicateur = (String(values.indicateur) || 'pib_croissance') as IndicateurKey;

  const config = dataMap[indicateur] || dataMap.pib_croissance;
  const rawData = config.data;
  const currentValue = interpolate(rawData, annee);
  const fullSeries = getFullSeries(rawData);

  // Build main line series
  const mainSeries: Series = {
    id: 'serie_principale',
    label: config.label,
    color: config.color,
    data: fullSeries,
    strokeWidth: 2.5,
    area: true,
    areaOpacity: 0.15,
  };

  // Build a highlight segment up to the selected year
  const highlightData = fullSeries.filter((p) => p.x <= annee);
  const highlightSeries: Series = {
    id: 'serie_highlight',
    label: `${config.label} (jusqu'a ${annee})`,
    color: config.color,
    data: highlightData,
    strokeWidth: 3,
    area: true,
    areaOpacity: 0.3,
  };

  const series: Series[] = [mainSeries, highlightSeries];

  // Annotations: vertical line + point at selected year
  const annotations: Annotation[] = [];

  if (currentValue !== null) {
    // Vertical line at selected year
    annotations.push({
      type: 'line',
      x: annee,
      y: 0,
      x1: annee,
      y1: annee,
      label: String(annee),
      color: '#6b7280',
    });

    // Point at the selected year
    annotations.push({
      type: 'point',
      x: annee,
      y: currentValue,
      label: `${annee} : ${currentValue.toFixed(1)}${config.unit}`,
      color: config.color,
    });
  }

  // Compute y domain
  const allY = fullSeries.map((p) => p.y);
  const yMin = Math.min(...allY, 0);
  const yMax = Math.max(...allY);
  const yPadding = (yMax - yMin) * 0.1;

  const startYear = rawData[0][0];
  const endYear = rawData[rawData.length - 1][0];

  const chartData: ChartData = {
    type: 'line',
    series,
    xLabel: 'Annee',
    yLabel: `${config.label} (${config.unit})`,
    xDomain: [startYear, endYear],
    yDomain: [Math.floor(yMin - yPadding), Math.ceil(yMax + yPadding)],
    equilibrium: currentValue !== null ? { x: annee, y: currentValue } : undefined,
    annotations,
  };

  // Narration
  const displayValue = currentValue !== null ? currentValue : 0;
  const { observation, interpretation } = getNarration(annee, indicateur, displayValue);

  // Find min/max values for the indicator
  const minPoint = rawData.reduce((prev, curr) => (curr[1] < prev[1] ? curr : prev));
  const maxPoint = rawData.reduce((prev, curr) => (curr[1] > prev[1] ? curr : prev));

  // Previous year value for direction
  const prevValue = interpolate(rawData, annee - 1);
  const direction = prevValue !== null && currentValue !== null
    ? currentValue > prevValue ? 'up' : currentValue < prevValue ? 'down' : 'neutral'
    : 'neutral';

  return {
    outputs: [
      {
        id: 'valeur_actuelle',
        label: `${config.label} en ${annee}`,
        value: round2(displayValue),
        unit: config.unit,
        direction: direction as 'up' | 'down' | 'neutral',
      },
      {
        id: 'minimum_historique',
        label: `Minimum (${minPoint[0]})`,
        value: round2(minPoint[1]),
        unit: config.unit,
      },
      {
        id: 'maximum_historique',
        label: `Maximum (${maxPoint[0]})`,
        value: round2(maxPoint[1]),
        unit: config.unit,
      },
      {
        id: 'variation',
        label: 'Variation sur 1 an',
        value: prevValue !== null && currentValue !== null ? round2(currentValue - prevValue) : 0,
        unit: 'pts',
        direction: direction as 'up' | 'down' | 'neutral',
      },
    ],
    chartData,
    narration: { observation, interpretation },
  };
}

function round2(v: number): number {
  return Math.round(v * 100) / 100;
}

const timelineDataModule: SimulationModule = { meta, inputs, scenarios, compute };

registerModule(timelineDataModule);

export { timelineDataModule };
export default timelineDataModule;
