'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Globe, ChevronDown } from 'lucide-react';
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from 'react-simple-maps';
import { scaleLinear } from '@visx/scale';
import { worldData, numericToIso, type CountryData } from '@/data/world-data';

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

type Indicator = 'gini' | 'pibGrowth' | 'inflation' | 'unemployment' | 'debtToGdp' | 'tradeBalance';

interface IndicatorConfig {
  key: Indicator;
  label: string;
  unit: string;
  domain: [number, number];
  colors: [string, string];
  format: (v: number) => string;
}

const INDICATORS: IndicatorConfig[] = [
  {
    key: 'gini',
    label: 'Coefficient de Gini',
    unit: '',
    domain: [25, 65],
    colors: ['#10B981', '#EF4444'],
    format: (v) => v.toFixed(1),
  },
  {
    key: 'pibGrowth',
    label: 'Croissance du PIB',
    unit: '%',
    domain: [-2, 8],
    colors: ['#EF4444', '#10B981'],
    format: (v) => `${v >= 0 ? '+' : ''}${v.toFixed(1)}%`,
  },
  {
    key: 'inflation',
    label: 'Inflation',
    unit: '%',
    domain: [0, 50],
    colors: ['#10B981', '#EF4444'],
    format: (v) => `${v.toFixed(1)}%`,
  },
  {
    key: 'unemployment',
    label: 'Chomage',
    unit: '%',
    domain: [0, 35],
    colors: ['#10B981', '#EF4444'],
    format: (v) => `${v.toFixed(1)}%`,
  },
  {
    key: 'debtToGdp',
    label: 'Dette / PIB',
    unit: '%',
    domain: [15, 260],
    colors: ['#10B981', '#EF4444'],
    format: (v) => `${v.toFixed(1)}%`,
  },
  {
    key: 'tradeBalance',
    label: 'Balance commerciale',
    unit: '% PIB',
    domain: [-10, 18],
    colors: ['#EF4444', '#3B82F6'],
    format: (v) => `${v >= 0 ? '+' : ''}${v.toFixed(1)}%`,
  },
];

// Build lookup by ISO
const dataByIso = new Map<string, CountryData>();
worldData.forEach((c) => dataByIso.set(c.iso, c));

export default function CartePage() {
  const [indicator, setIndicator] = useState<Indicator>('gini');
  const [hoveredCountry, setHoveredCountry] = useState<CountryData | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [selectedCountry, setSelectedCountry] = useState<CountryData | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const config = useMemo(
    () => INDICATORS.find((i) => i.key === indicator)!,
    [indicator]
  );

  const colorScale = useMemo(
    () =>
      scaleLinear<string>({
        domain: config.domain,
        range: config.colors,
        clamp: true,
      }),
    [config]
  );

  const getCountryColor = useCallback(
    (geo: { id?: string }) => {
      const iso = geo.id ? numericToIso[geo.id] : undefined;
      if (!iso) return '#D1D5DB';
      const country = dataByIso.get(iso);
      if (!country) return '#D1D5DB';
      const value = country[config.key];
      if (value === undefined) return '#D1D5DB';
      return colorScale(value) as string;
    },
    [config.key, colorScale]
  );

  // Close dropdown on outside click
  useEffect(() => {
    if (!dropdownOpen) return;
    const handler = () => setDropdownOpen(false);
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, [dropdownOpen]);

  // Legend stops
  const legendStops = useMemo(() => {
    const count = 6;
    const [min, max] = config.domain;
    return Array.from({ length: count }, (_, i) => {
      const t = i / (count - 1);
      const value = min + t * (max - min);
      return { value, color: colorScale(value) as string };
    });
  }, [config, colorScale]);

  return (
    <main className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-3">
            <Globe size={24} className="text-accent-indigo" />
            <h1 className="text-3xl font-bold text-text-primary">
              Carte economique mondiale
            </h1>
          </div>
          <p className="text-text-secondary text-lg">
            Explorez les indicateurs economiques de 30 pays. Survolez un pays
            pour voir ses donnees, cliquez pour afficher le detail.
          </p>
        </motion.div>

        {/* Indicator selector */}
        <div className="mb-6 relative inline-block">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setDropdownOpen((o) => !o);
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-bg-card border border-border text-text-primary font-medium shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-shadow cursor-pointer"
          >
            <span>{config.label}</span>
            <ChevronDown
              size={16}
              className={`text-text-muted transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
            />
          </button>
          {dropdownOpen && (
            <div className="absolute top-full left-0 mt-1 z-50 bg-bg-card border border-border rounded-lg shadow-[var(--shadow-card-hover)] py-1 min-w-[220px]">
              {INDICATORS.map((ind) => (
                <button
                  key={ind.key}
                  onClick={() => {
                    setIndicator(ind.key);
                    setDropdownOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm transition-colors cursor-pointer ${
                    ind.key === indicator
                      ? 'bg-bg-hover text-accent-indigo font-medium'
                      : 'text-text-primary hover:bg-bg-hover'
                  }`}
                >
                  {ind.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Map */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-bg-card rounded-xl border border-border shadow-[var(--shadow-card)] overflow-hidden"
        >
          <div className="w-full" style={{ height: 500 }}>
            <ComposableMap
              projectionConfig={{ scale: 147, center: [10, 5] }}
              width={800}
              height={450}
              style={{ width: '100%', height: '100%' }}
            >
              <ZoomableGroup>
                <Geographies geography={GEO_URL}>
                  {({ geographies }) =>
                    geographies.map((geo) => {
                      const iso = geo.id ? numericToIso[geo.id] : undefined;
                      const country = iso ? dataByIso.get(iso) : undefined;
                      const isSelected =
                        selectedCountry && country?.iso === selectedCountry.iso;

                      return (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          fill={getCountryColor(geo)}
                          stroke={isSelected ? '#5B5EF4' : '#FFF'}
                          strokeWidth={isSelected ? 1.5 : 0.5}
                          style={{
                            default: { outline: 'none' },
                            hover: {
                              outline: 'none',
                              fill: country
                                ? getCountryColor(geo)
                                : '#D1D5DB',
                              stroke: '#5B5EF4',
                              strokeWidth: 1,
                              cursor: country ? 'pointer' : 'default',
                            },
                            pressed: { outline: 'none' },
                          }}
                          onMouseEnter={(evt) => {
                            if (country) {
                              setHoveredCountry(country);
                              setTooltipPos({
                                x: evt.clientX,
                                y: evt.clientY,
                              });
                            }
                          }}
                          onMouseMove={(evt) => {
                            if (country) {
                              setTooltipPos({
                                x: evt.clientX,
                                y: evt.clientY,
                              });
                            }
                          }}
                          onMouseLeave={() => setHoveredCountry(null)}
                          onClick={() => {
                            if (country) {
                              setSelectedCountry((prev) =>
                                prev?.iso === country.iso ? null : country
                              );
                            }
                          }}
                        />
                      );
                    })
                  }
                </Geographies>
              </ZoomableGroup>
            </ComposableMap>
          </div>

          {/* Legend */}
          <div className="px-6 py-4 border-t border-border-subtle">
            <div className="flex items-center gap-3 max-w-md">
              <span className="text-xs text-text-muted whitespace-nowrap">
                {config.format(config.domain[0])}
              </span>
              <div
                className="flex-1 h-3 rounded-full"
                style={{
                  background: `linear-gradient(to right, ${legendStops.map((s) => s.color).join(', ')})`,
                }}
              />
              <span className="text-xs text-text-muted whitespace-nowrap">
                {config.format(config.domain[1])}
              </span>
            </div>
            <p className="text-xs text-text-muted mt-1">{config.label}{config.unit ? ` (${config.unit})` : ''}</p>
          </div>
        </motion.div>

        {/* Tooltip */}
        {hoveredCountry && (
          <div
            className="fixed z-[100] pointer-events-none px-4 py-3 rounded-lg bg-bg-card border border-border shadow-[var(--shadow-card-hover)] text-sm max-w-[260px]"
            style={{
              left: tooltipPos.x + 12,
              top: tooltipPos.y - 10,
              transform: 'translateY(-100%)',
            }}
          >
            <p className="font-semibold text-text-primary mb-1.5">
              {hoveredCountry.name}
            </p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-xs">
              {INDICATORS.map((ind) => {
                const val = hoveredCountry[ind.key];
                return (
                  <div key={ind.key} className="flex justify-between gap-2">
                    <span className="text-text-muted">{ind.label}</span>
                    <span className="text-text-primary font-medium">
                      {val !== undefined ? ind.format(val) : '-'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Detail panel */}
        {selectedCountry && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 bg-bg-card rounded-xl border border-border shadow-[var(--shadow-card)] p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-text-primary">
                {selectedCountry.name}
              </h2>
              <button
                onClick={() => setSelectedCountry(null)}
                className="text-text-muted hover:text-text-primary text-sm cursor-pointer"
              >
                Fermer
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              {INDICATORS.map((ind) => {
                const val = selectedCountry[ind.key];
                return (
                  <div
                    key={ind.key}
                    className={`p-3 rounded-lg border ${
                      ind.key === indicator
                        ? 'border-accent-indigo bg-bg-elevated'
                        : 'border-border-subtle bg-bg-primary'
                    }`}
                  >
                    <p className="text-xs text-text-muted mb-1">{ind.label}</p>
                    <p className="text-lg font-bold text-text-primary">
                      {val !== undefined ? ind.format(val) : '-'}
                    </p>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Source */}
        <p className="text-xs text-text-muted mt-4">
          Sources : Banque mondiale, FMI -- estimations 2023
        </p>
      </div>
    </main>
  );
}
