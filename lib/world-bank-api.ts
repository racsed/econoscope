const WB_BASE = 'https://api.worldbank.org/v2';

export interface WBDataPoint {
  country: string;
  countryiso3code: string;
  date: string;
  value: number | null;
}

// Indicator codes:
// NY.GDP.MKTP.KD.ZG = GDP growth (annual %)
// FP.CPI.TOTL.ZG = Inflation (annual %)
// SL.UEM.TOTL.ZS = Unemployment (% of total labor force)
// GC.DOD.TOTL.GD.ZS = Central government debt (% of GDP)
// SI.POV.GINI = Gini index
// BN.CAB.XOKA.GD.ZS = Current account balance (% of GDP)

export const INDICATORS = {
  gdpGrowth: 'NY.GDP.MKTP.KD.ZG',
  inflation: 'FP.CPI.TOTL.ZG',
  unemployment: 'SL.UEM.TOTL.ZS',
  debt: 'GC.DOD.TOTL.GD.ZS',
  gini: 'SI.POV.GINI',
  tradeBalance: 'BN.CAB.XOKA.GD.ZS',
} as const;

export const INDICATOR_LABELS: Record<string, string> = {
  [INDICATORS.gdpGrowth]: 'Croissance du PIB (% annuel)',
  [INDICATORS.inflation]: 'Inflation (% annuel)',
  [INDICATORS.unemployment]: 'Chomage (% de la pop. active)',
  [INDICATORS.debt]: 'Dette publique (% du PIB)',
  [INDICATORS.gini]: 'Indice de Gini',
  [INDICATORS.tradeBalance]: 'Balance courante (% du PIB)',
};

export const TOP_COUNTRIES = [
  { code: 'FRA', name: 'France' },
  { code: 'DEU', name: 'Allemagne' },
  { code: 'USA', name: 'Etats-Unis' },
  { code: 'GBR', name: 'Royaume-Uni' },
  { code: 'JPN', name: 'Japon' },
  { code: 'CHN', name: 'Chine' },
  { code: 'IND', name: 'Inde' },
  { code: 'BRA', name: 'Bresil' },
  { code: 'CAN', name: 'Canada' },
  { code: 'ITA', name: 'Italie' },
  { code: 'ESP', name: 'Espagne' },
  { code: 'KOR', name: 'Coree du Sud' },
  { code: 'AUS', name: 'Australie' },
  { code: 'MEX', name: 'Mexique' },
  { code: 'IDN', name: 'Indonesie' },
  { code: 'TUR', name: 'Turquie' },
  { code: 'SAU', name: 'Arabie saoudite' },
  { code: 'NLD', name: 'Pays-Bas' },
  { code: 'CHE', name: 'Suisse' },
  { code: 'POL', name: 'Pologne' },
  { code: 'SWE', name: 'Suede' },
  { code: 'BEL', name: 'Belgique' },
  { code: 'ARG', name: 'Argentine' },
  { code: 'NGA', name: 'Nigeria' },
  { code: 'ZAF', name: 'Afrique du Sud' },
  { code: 'EGY', name: 'Egypte' },
  { code: 'THA', name: 'Thailande' },
  { code: 'COL', name: 'Colombie' },
  { code: 'MAR', name: 'Maroc' },
  { code: 'DZA', name: 'Algerie' },
] as const;

export async function fetchIndicator(
  indicator: string,
  country: string = 'all',
  year: string = '2023'
): Promise<WBDataPoint[]> {
  const url = `${WB_BASE}/country/${country}/indicator/${indicator}?date=${year}&format=json&per_page=300`;
  try {
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    if (!Array.isArray(data) || data.length < 2) return [];
    return (data[1] || [])
      .filter((d: any) => d.value !== null)
      .map((d: any) => ({
        country: d.country.value,
        countryiso3code: d.countryiso3code,
        date: d.date,
        value: d.value,
      }));
  } catch {
    return [];
  }
}

export async function fetchCountryTimeSeries(
  indicator: string,
  countryCode: string,
  startYear: number = 1960,
  endYear: number = 2024
): Promise<{ year: number; value: number }[]> {
  const url = `${WB_BASE}/country/${countryCode}/indicator/${indicator}?date=${startYear}:${endYear}&format=json&per_page=100`;
  try {
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    if (!Array.isArray(data) || data.length < 2) return [];
    return (data[1] || [])
      .filter((d: any) => d.value !== null)
      .map((d: any) => ({ year: parseInt(d.date), value: d.value }))
      .sort((a: any, b: any) => a.year - b.year);
  } catch {
    return [];
  }
}
