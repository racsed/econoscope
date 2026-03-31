'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Search, ArrowRight, Lock } from 'lucide-react';
import { modulesCatalog, type ModuleCatalogEntry } from '@/data/modules-catalog';
import { THEME_COLORS, LEVEL_LABELS, type ThemeType, type LevelType } from '@/lib/constants';
import { Badge } from '@/components/ui/Badge';

const themes = [
  { key: 'all', label: 'Tous' },
  { key: 'micro', label: 'Micro' },
  { key: 'macro', label: 'Macro' },
  { key: 'monetary', label: 'Monetaire' },
  { key: 'fiscal', label: 'Fiscalite' },
  { key: 'inequality', label: 'Inegalites' },
  { key: 'international', label: 'International' },
];

const levels = [
  { key: 'all', label: 'Tous niveaux' },
  { key: 'accessible', label: 'Accessible' },
  { key: 'intermediate', label: 'Intermediaire' },
  { key: 'advanced', label: 'Avance' },
];

export default function ExplorerPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTheme, setSelectedTheme] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');

  const filteredModules = useMemo(() => {
    return modulesCatalog.filter((mod) => {
      if (
        searchQuery &&
        !mod.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !mod.description.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }
      if (selectedTheme !== 'all' && mod.theme !== selectedTheme) return false;
      if (selectedLevel !== 'all' && mod.level !== selectedLevel) return false;
      return true;
    });
  }, [searchQuery, selectedTheme, selectedLevel]);

  return (
    <main className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-[#1A1D26] mb-3">
            Explorer les mecanismes
          </h1>
          <p className="text-[#5F6980] text-lg">
            {modulesCatalog.length} modules economiques interactifs
          </p>
        </motion.div>

        {/* Filters */}
        <div className="mb-8 space-y-4">
          {/* Search */}
          <div className="relative max-w-md">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3B4]"
            />
            <input
              type="text"
              placeholder="Rechercher un module..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E2E4E9] rounded-xl text-[#1A1D26] placeholder:text-[#9CA3B4] focus:outline-none focus:border-[#5B5EF4]/50 transition-colors"
            />
          </div>

          {/* Theme filters */}
          <div className="flex flex-wrap gap-2">
            {themes.map((theme) => (
              <button
                key={theme.key}
                onClick={() => setSelectedTheme(theme.key)}
                className="px-3.5 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border"
                style={{
                  borderColor:
                    selectedTheme === theme.key
                      ? theme.key === 'all'
                        ? '#5B5EF4'
                        : THEME_COLORS[theme.key as ThemeType] ?? '#5B5EF4'
                      : '#E2E4E9',
                  backgroundColor:
                    selectedTheme === theme.key
                      ? `${theme.key === 'all' ? '#5B5EF4' : THEME_COLORS[theme.key as ThemeType] ?? '#5B5EF4'}12`
                      : 'white',
                  color:
                    selectedTheme === theme.key
                      ? theme.key === 'all'
                        ? '#5B5EF4'
                        : THEME_COLORS[theme.key as ThemeType] ?? '#5B5EF4'
                      : '#5F6980',
                }}
              >
                {theme.label}
              </button>
            ))}
          </div>

          {/* Level filters */}
          <div className="flex flex-wrap gap-2">
            {levels.map((level) => (
              <button
                key={level.key}
                onClick={() => setSelectedLevel(level.key)}
                className="px-3.5 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border"
                style={{
                  borderColor: selectedLevel === level.key ? '#5F6980' : '#E2E4E9',
                  backgroundColor: selectedLevel === level.key ? '#5F698012' : 'white',
                  color: selectedLevel === level.key ? '#1A1D26' : '#9CA3B4',
                }}
              >
                {level.label}
              </button>
            ))}
          </div>
        </div>

        {/* Module Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredModules.map((mod, i) => (
            <ModuleCard key={mod.slug} module={mod} index={i} />
          ))}
        </div>

        {filteredModules.length === 0 && (
          <div className="text-center py-20 text-[#9CA3B4]">
            Aucun module ne correspond a votre recherche.
          </div>
        )}
      </div>
    </main>
  );
}

function ModuleCard({
  module: mod,
  index,
}: {
  module: ModuleCatalogEntry;
  index: number;
}) {
  const color = THEME_COLORS[mod.theme as ThemeType] ?? '#5B5EF4';
  const isAvailable = mod.available;

  const content = (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className={`relative bg-white border border-[#E2E4E9] rounded-2xl p-5 h-full shadow-sm transition-all duration-300 ${
        isAvailable
          ? 'hover:shadow-md cursor-pointer'
          : 'opacity-50 cursor-default'
      }`}
      onMouseEnter={(e) => {
        if (isAvailable) {
          (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
          (e.currentTarget as HTMLElement).style.borderColor = `${color}60`;
        }
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)';
        (e.currentTarget as HTMLElement).style.borderColor = '#E2E4E9';
      }}
    >
      {/* Top row */}
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: `${color}15` }}
        >
          {isAvailable ? (
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: color }}
            />
          ) : (
            <Lock size={14} style={{ color }} />
          )}
        </div>
        <div className="flex gap-2">
          <Badge label={mod.theme} color={color} size="sm" />
          <Badge
            label={LEVEL_LABELS[mod.level as LevelType]}
            color="#9CA3B4"
            size="sm"
          />
        </div>
      </div>

      {/* Content */}
      <h3 className="text-base font-semibold text-[#1A1D26] mb-1.5">
        {mod.title}
      </h3>
      <p className="text-sm text-[#5F6980] leading-relaxed mb-4">
        {mod.description}
      </p>

      {/* Footer */}
      {isAvailable ? (
        <div
          className="flex items-center gap-1 text-sm font-medium"
          style={{ color }}
        >
          Explorer
          <ArrowRight size={14} />
        </div>
      ) : (
        <div className="text-xs text-[#9CA3B4] font-medium">
          Bientot disponible
        </div>
      )}
    </motion.div>
  );

  if (isAvailable) {
    return <Link href={`/module/${mod.slug}`}>{content}</Link>;
  }

  return content;
}
