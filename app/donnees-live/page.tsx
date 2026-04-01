'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Radio, ChevronDown, Loader2, AlertTriangle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { LineChart } from '@/components/charts/LineChart';
import type { ChartData } from '@/engine/types';
import {
  INDICATORS,
  INDICATOR_LABELS,
  TOP_COUNTRIES,
  fetchCountryTimeSeries,
} from '@/lib/world-bank-api';

const INDICATOR_OPTIONS = [
  { value: INDICATORS.gdpGrowth, label: 'Croissance du PIB (%)' },
  { value: INDICATORS.inflation, label: 'Inflation (%)' },
  { value: INDICATORS.unemployment, label: 'Chomage (%)' },
  { value: INDICATORS.debt, label: 'Dette publique (% du PIB)' },
  { value: INDICATORS.gini, label: 'Indice de Gini' },
  { value: INDICATORS.tradeBalance, label: 'Balance courante (% du PIB)' },
];

// Fallback data in case the API is unavailable
const FALLBACK_DATA: Record<string, { year: number; value: number }[]> = {
  [`FRA-${INDICATORS.gdpGrowth}`]: [
    { year: 2015, value: 1.1 },
    { year: 2016, value: 1.1 },
    { year: 2017, value: 2.4 },
    { year: 2018, value: 1.8 },
    { year: 2019, value: 1.8 },
    { year: 2020, value: -7.5 },
    { year: 2021, value: 6.4 },
    { year: 2022, value: 2.5 },
    { year: 2023, value: 0.9 },
  ],
};

function buildChartData(
  timeSeries: { year: number; value: number }[],
  indicator: string,
  countryName: string
): ChartData {
  return {
    type: 'line',
    series: [
      {
        id: 'main-series',
        label: `${countryName} - ${INDICATOR_LABELS[indicator] ?? indicator}`,
        color: '#5B5EF4',
        data: timeSeries.map((d) => ({ x: d.year, y: d.value })),
      },
    ],
    xLabel: 'Annee',
    yLabel: INDICATOR_LABELS[indicator] ?? '',
  };
}

export default function DonneesLivePage() {
  const [country, setCountry] = useState('FRA');
  const [indicator, setIndicator] = useState(INDICATORS.gdpGrowth);
  const [timeSeries, setTimeSeries] = useState<{ year: number; value: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const countryName = TOP_COUNTRIES.find((c) => c.code === country)?.name ?? country;

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await fetchCountryTimeSeries(indicator, country, 1960, 2024);
      if (data.length === 0) {
        // Try fallback
        const fallbackKey = `${country}-${indicator}`;
        if (FALLBACK_DATA[fallbackKey]) {
          setTimeSeries(FALLBACK_DATA[fallbackKey]);
          setError(true);
        } else {
          setTimeSeries([]);
          setError(true);
        }
      } else {
        setTimeSeries(data);
      }
    } catch {
      const fallbackKey = `${country}-${indicator}`;
      if (FALLBACK_DATA[fallbackKey]) {
        setTimeSeries(FALLBACK_DATA[fallbackKey]);
      } else {
        setTimeSeries([]);
      }
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [country, indicator]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const chartData = buildChartData(timeSeries, indicator, countryName);
  const lastTenYears = timeSeries.slice(-10);

  return (
    <main className="min-h-screen py-16 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text-primary transition-colors mb-8"
        >
          <ArrowLeft size={14} />
          Accueil
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-9 h-9 rounded-lg bg-accent-indigo/10 flex items-center justify-center">
              <Radio size={18} className="text-accent-indigo" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-text-primary">
              Donnees en direct
            </h1>
          </div>
          <p className="text-text-secondary max-w-2xl">
            Indicateurs economiques mondiaux via l&apos;API Banque mondiale.
            Selectionnez un pays et un indicateur pour explorer les donnees historiques.
          </p>
        </motion.div>

        {/* Selectors */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-4 mb-8"
        >
          {/* Country selector */}
          <div className="relative flex-1">
            <label className="block text-xs font-medium text-text-muted mb-1.5 uppercase tracking-wider">
              Pays
            </label>
            <div className="relative">
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full appearance-none bg-bg-card border border-border rounded-xl px-4 py-3 pr-10 text-text-primary text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent-indigo/30 focus:border-accent-indigo/50 transition-all cursor-pointer"
              >
                {TOP_COUNTRIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={16}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
              />
            </div>
          </div>

          {/* Indicator selector */}
          <div className="relative flex-1">
            <label className="block text-xs font-medium text-text-muted mb-1.5 uppercase tracking-wider">
              Indicateur
            </label>
            <div className="relative">
              <select
                value={indicator}
                onChange={(e) => setIndicator(e.target.value)}
                className="w-full appearance-none bg-bg-card border border-border rounded-xl px-4 py-3 pr-10 text-text-primary text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent-indigo/30 focus:border-accent-indigo/50 transition-all cursor-pointer"
              >
                {INDICATOR_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={16}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
              />
            </div>
          </div>
        </motion.div>

        {/* Chart section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-bg-card border border-border rounded-2xl p-6 mb-8"
        >
          <h2 className="text-lg font-semibold text-text-primary mb-1">
            {countryName} - {INDICATOR_LABELS[indicator] ?? 'Indicateur'}
          </h2>
          <p className="text-xs text-text-muted mb-4">
            Serie temporelle 1960 - 2024
          </p>

          {loading ? (
            <div className="flex items-center justify-center h-[340px]">
              <div className="flex flex-col items-center gap-3">
                <Loader2 size={28} className="text-accent-indigo animate-spin" />
                <span className="text-sm text-text-muted">
                  Chargement des donnees...
                </span>
              </div>
            </div>
          ) : timeSeries.length === 0 ? (
            <div className="flex items-center justify-center h-[340px]">
              <div className="flex flex-col items-center gap-3 text-center">
                <AlertTriangle size={28} className="text-amber-500" />
                <span className="text-sm text-text-secondary">
                  Aucune donnee disponible pour cette combinaison pays/indicateur.
                </span>
                <button
                  onClick={loadData}
                  className="text-sm text-accent-indigo hover:underline"
                >
                  Reessayer
                </button>
              </div>
            </div>
          ) : (
            <>
              {error && (
                <div className="flex items-center gap-2 mb-3 px-3 py-2 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                  <AlertTriangle size={14} className="text-amber-500 flex-shrink-0" />
                  <span className="text-xs text-amber-600 dark:text-amber-400">
                    Donnees hors ligne - les valeurs affichees peuvent ne pas etre a jour.
                  </span>
                </div>
              )}
              <LineChart data={chartData} themeColor="#5B5EF4" />
            </>
          )}
        </motion.div>

        {/* Data table */}
        {!loading && lastTenYears.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="bg-bg-card border border-border rounded-2xl p-6 mb-8"
          >
            <h3 className="text-base font-semibold text-text-primary mb-4">
              Valeurs recentes ({lastTenYears[0]?.year} - {lastTenYears[lastTenYears.length - 1]?.year})
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 px-3 text-text-muted font-medium text-xs uppercase tracking-wider">
                      Annee
                    </th>
                    <th className="text-right py-2 px-3 text-text-muted font-medium text-xs uppercase tracking-wider">
                      Valeur
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {lastTenYears.map((row, i) => (
                    <tr
                      key={row.year}
                      className={`border-b border-border/50 ${
                        i % 2 === 0 ? 'bg-bg-elevated/30' : ''
                      }`}
                    >
                      <td className="py-2.5 px-3 font-mono text-text-primary">
                        {row.year}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-text-primary">
                        {row.value.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Source citation */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="text-xs text-text-muted text-center"
        >
          Source : Banque mondiale, World Development Indicators
          {' - '}
          <a
            href="https://data.worldbank.org"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-text-secondary transition-colors"
          >
            data.worldbank.org
          </a>
        </motion.p>
      </div>
    </main>
  );
}
