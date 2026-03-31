'use client';

import { ReactNode, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize2, SlidersHorizontal, ChevronUp } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { ExportButton } from '@/components/charts/ExportButton';
import { ProjectionMode } from '@/components/module/ProjectionMode';
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
  isProjectionMode: _isProjectionMode = false,
}: ModuleLayoutProps) {
  const themeColor = THEME_COLORS[theme];
  const chartRef = useRef<HTMLDivElement>(null);
  const [projectionActive, setProjectionActive] = useState(false);
  const [controlsOpen, setControlsOpen] = useState(false);

  // Generate a slug-friendly filename from the title
  const exportFilename = `econoscope-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '')}`;

  return (
    <>
      {/* Projection Mode overlay */}
      <ProjectionMode
        isActive={projectionActive}
        onClose={() => setProjectionActive(false)}
        visualization={visualization}
        scenarios={scenarios}
        controls={controls}
        title={title}
      />

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
          <h1 className="text-3xl sm:text-4xl font-bold text-text-primary mb-2">
            {title}
          </h1>
          <p className="text-lg text-text-secondary">{subtitle}</p>
          <p className="mt-4 text-text-secondary max-w-3xl leading-relaxed">
            {introduction}
          </p>
        </div>

        {/* Main: Controls + Visualization */}
        <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-6 mb-8">
          {/* Control Panel */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="bg-bg-card border border-border shadow-sm rounded-2xl p-5 space-y-1">
              {/* Mobile toggle */}
              <button
                onClick={() => setControlsOpen((v) => !v)}
                className="flex items-center justify-between w-full lg:hidden mb-2"
              >
                <span
                  className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider"
                  style={{ color: themeColor }}
                >
                  <SlidersHorizontal size={16} />
                  Variables
                </span>
                <motion.span
                  animate={{ rotate: controlsOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronUp size={18} className="text-text-secondary" />
                </motion.span>
              </button>
              {/* Desktop heading */}
              <h2
                className="hidden lg:block text-sm font-semibold uppercase tracking-wider mb-4"
                style={{ color: themeColor }}
              >
                Variables
              </h2>
              {/* Controls: always visible on desktop, collapsible on mobile */}
              <div className="hidden lg:block">{controls}</div>
              <AnimatePresence initial={false}>
                {controlsOpen && (
                  <motion.div
                    key="mobile-controls"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                    className="overflow-hidden lg:hidden"
                  >
                    {controls}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Visualization */}
          <div className="bg-bg-card border border-border shadow-sm rounded-2xl p-5 min-h-[300px] sm:min-h-[400px] flex flex-col">
            {/* Toolbar row */}
            <div className="flex items-center justify-end gap-2 mb-2">
              <ExportButton targetRef={chartRef} filename={exportFilename} />
              <button
                onClick={() => setProjectionActive(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-text-secondary border border-border rounded-lg hover:bg-bg-hover hover:text-text-primary transition-colors"
                title="Mode projection"
              >
                <Maximize2 size={14} />
                Projection
              </button>
            </div>
            {/* Chart container with ref for PNG export */}
            <div ref={chartRef} className="flex-1 flex items-center justify-center">
              {visualization}
            </div>
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
    </>
  );
}

export default ModuleLayout;
