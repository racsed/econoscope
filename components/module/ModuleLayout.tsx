'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/Badge';
import { THEME_COLORS, LEVEL_LABELS, type ThemeType, type LevelType } from '@/lib/constants';

interface ModuleLayoutProps {
  title: string;
  subtitle: string;
  theme: ThemeType;
  level: LevelType;
  introduction: string;
  controls: ReactNode;
  visualization: ReactNode;
  scenarios: ReactNode;
  narration: ReactNode;
  limites: ReactNode;
  realite: ReactNode;
  dataTable?: ReactNode;
  comparison?: ReactNode;
  isProjectionMode?: boolean;
}

export function ModuleLayout({
  title,
  subtitle,
  theme,
  level,
  introduction,
  controls,
  visualization,
  scenarios,
  narration,
  limites,
  realite,
  dataTable,
  comparison,
  isProjectionMode = false,
}: ModuleLayoutProps) {
  const themeColor = THEME_COLORS[theme];

  if (isProjectionMode) {
    return (
      <div className="fixed inset-0 z-50 bg-white flex flex-col">
        <div className="flex-1 p-8">{visualization}</div>
        <div className="p-4 border-t border-[#E2E4E9]">
          <div className="flex gap-4 items-center justify-center">
            {scenarios}
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24"
    >
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <Badge label={theme} color={themeColor} size="sm" />
          <Badge label={LEVEL_LABELS[level]} color="#9CA3B4" size="sm" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-[#1A1D26] mb-2">
          {title}
        </h1>
        <p className="text-lg text-[#5F6980]">{subtitle}</p>
        <p className="mt-4 text-[#5F6980] max-w-3xl leading-relaxed">
          {introduction}
        </p>
      </div>

      {/* Main: Controls + Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-6 mb-8">
        {/* Control Panel */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="bg-white border border-[#E2E4E9] shadow-sm rounded-2xl p-5 space-y-1">
            <h2
              className="text-sm font-semibold uppercase tracking-wider mb-4"
              style={{ color: themeColor }}
            >
              Variables
            </h2>
            {controls}
          </div>
        </div>

        {/* Visualization */}
        <div className="bg-white border border-[#E2E4E9] shadow-sm rounded-2xl p-5 min-h-[400px] flex items-center justify-center">
          {visualization}
        </div>
      </div>

      {/* Scenarios */}
      <div className="mb-8">{scenarios}</div>

      {/* Narration blocks */}
      <div className="space-y-6 mb-8">{narration}</div>

      {/* Limites */}
      <div className="mb-8">{limites}</div>

      {/* Realite */}
      <div className="mb-8">{realite}</div>

      {/* Data Table */}
      {dataTable && <div className="mb-8">{dataTable}</div>}

      {/* Comparison */}
      {comparison && <div className="mb-8">{comparison}</div>}
    </motion.div>
  );
}

export default ModuleLayout;
