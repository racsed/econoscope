'use client';

import { useParams } from 'next/navigation';
import { useMemo, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Calendar, Tag, SlidersHorizontal, RotateCcw } from 'lucide-react';
import { economicFacts } from '@/data/economic-facts';
import { getModule } from '@/engine/init';
import { THEME_COLORS, type ThemeType } from '@/lib/constants';
import { VisualizationPane } from '@/components/module/VisualizationPane';
import { ControlPanel } from '@/components/module/ControlPanel';
import { ScenarioBar } from '@/components/ui/ScenarioBar';
import { ObservationBlock } from '@/components/module/ObservationBlock';
import { InterpretationBlock } from '@/components/module/InterpretationBlock';
import { DataTable } from '@/components/module/DataTable';
import type { SimulationModule, ComputeResult } from '@/engine/types';

const categoryLabels: Record<string, { label: string; color: string }> = {
  crise: { label: 'Crise', color: '#EF4444' },
  politique: { label: 'Politique economique', color: '#5B5EF4' },
  commerce: { label: 'Commerce', color: '#F59E0B' },
  monetaire: { label: 'Monetaire', color: '#0EA5E9' },
  social: { label: 'Social', color: '#EC4899' },
  histoire: { label: 'Histoire', color: '#8B5CF6' },
};

function getDefaults(mod: SimulationModule): Record<string, number | boolean | string> {
  const defaults: Record<string, number | boolean | string> = {};
  for (const input of mod.inputs) {
    defaults[input.id] = input.defaultValue;
  }
  return defaults;
}

export default function FactArticlePage() {
  const params = useParams();
  const id = params.id as string;

  const fact = economicFacts.find(f => f.id === id);
  const simulationModule = useMemo(
    () => (fact ? getModule(fact.moduleSlug) : undefined),
    [fact]
  );

  if (!fact || !simulationModule) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-text-primary mb-2">Fait introuvable</h1>
          <Link href="/faits" className="text-accent-indigo hover:underline">
            Retour aux faits economiques
          </Link>
        </div>
      </div>
    );
  }

  return <FactArticle fact={fact} module={simulationModule} />;
}

function FactArticle({
  fact,
  module,
}: {
  fact: (typeof economicFacts)[0];
  module: SimulationModule;
}) {
  // Initialize with the fact's historical values merged with defaults
  const initialValues = useMemo(
    () => ({ ...getDefaults(module), ...fact.scenarioValues }),
    [module, fact]
  );

  const [values, setAllValues] = useState(initialValues);
  const [activeScenarioId, setActiveScenarioId] = useState<string | null>(null);

  const setValue = useCallback((key: string, value: number | boolean | string) => {
    setAllValues(prev => ({ ...prev, [key]: value }));
    setActiveScenarioId(null);
  }, []);

  const resetToFact = useCallback(() => {
    setAllValues(initialValues);
    setActiveScenarioId(null);
  }, [initialValues]);

  const applyScenario = useCallback((scenarioId: string) => {
    const scenario = module.scenarios.find(s => s.id === scenarioId);
    if (scenario) {
      setAllValues({ ...getDefaults(module), ...scenario.values });
      setActiveScenarioId(scenarioId);
    }
  }, [module]);

  const result: ComputeResult = useMemo(() => {
    try {
      return module.compute(values);
    } catch {
      return module.compute(getDefaults(module));
    }
  }, [values, module]);

  const catInfo = categoryLabels[fact.category] ?? categoryLabels.histoire;
  const themeColor = THEME_COLORS[module.meta.theme as ThemeType] ?? '#5B5EF4';

  return (
    <main className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Back link */}
        <Link
          href="/faits"
          className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors mb-6"
        >
          <ArrowLeft size={14} />
          Retour aux faits economiques
        </Link>

        {/* Hero image + Article header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          {fact.image && (
            <div className="relative rounded-xl overflow-hidden mb-6">
              <img
                src={fact.image}
                alt={fact.title}
                loading="lazy"
                className="w-full h-[250px] object-cover"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg-primary)] via-[var(--color-bg-primary)]/40 to-transparent" />
              {/* Title overlay at bottom */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="flex items-center gap-3 mb-2">
                  <span
                    className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
                    style={{ backgroundColor: `${catInfo.color}30`, color: catInfo.color }}
                  >
                    <Tag size={12} />
                    {catInfo.label}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs font-mono text-text-secondary">
                    <Calendar size={12} />
                    {fact.year}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">
                  {fact.title}
                </h1>
              </div>
            </div>
          )}

          {!fact.image && (
            <>
              <div className="flex items-center gap-3 mb-4">
                <span
                  className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
                  style={{ backgroundColor: `${catInfo.color}15`, color: catInfo.color }}
                >
                  <Tag size={12} />
                  {catInfo.label}
                </span>
                <span className="flex items-center gap-1.5 text-xs font-mono text-text-muted">
                  <Calendar size={12} />
                  {fact.year}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
                {fact.title}
              </h1>
            </>
          )}

          <p className="text-lg text-text-secondary leading-relaxed max-w-3xl">
            {fact.summary}
          </p>
        </motion.div>

        {/* Article body + embedded simulator */}
        <div className="space-y-8">
          {/* Context section */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-bg-card border border-border rounded-2xl p-6"
          >
            <h2 className="text-lg font-semibold text-text-primary mb-3">Contexte historique</h2>
            <p className="text-text-secondary leading-relaxed whitespace-pre-line">
              {fact.detail}
            </p>
          </motion.div>

          {/* Embedded simulator */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-text-primary flex items-center gap-2">
                <SlidersHorizontal size={18} style={{ color: themeColor }} />
                Simulateur : {module.meta.title}
              </h2>
              <button
                onClick={resetToFact}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-border rounded-lg hover:bg-bg-hover text-text-secondary transition-colors"
              >
                <RotateCcw size={12} />
                Valeurs historiques
              </button>
            </div>

            <p className="text-sm text-text-muted mb-4">
              Le simulateur est preconfigure avec les parametres correspondant a cet evenement.
              Modifiez les curseurs pour explorer des scenarios alternatifs.
            </p>

            {/* Simulator grid */}
            <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-5">
              {/* Controls */}
              <div className="bg-bg-card border border-border rounded-xl p-4 lg:sticky lg:top-24 lg:self-start">
                <h3
                  className="text-xs font-semibold uppercase tracking-wider mb-3"
                  style={{ color: themeColor }}
                >
                  Variables
                </h3>
                <ControlPanel
                  inputs={module.inputs}
                  values={values}
                  onChange={setValue}
                  themeColor={themeColor}
                />
              </div>

              {/* Chart */}
              <div className="bg-bg-card border border-border rounded-xl p-4 min-h-[400px] flex items-center justify-center">
                <VisualizationPane
                  chartData={result.chartData}
                  secondaryChartData={result.secondaryChartData}
                  themeColor={themeColor}
                />
              </div>
            </div>

            {/* Scenarios */}
            <div className="mt-4">
              <ScenarioBar
                scenarios={module.scenarios}
                activeId={activeScenarioId}
                onSelect={applyScenario}
              />
            </div>
          </motion.div>

          {/* Dynamic narration */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            <ObservationBlock content={result.narration.observation} themeColor={themeColor} />
            <InterpretationBlock content={result.narration.interpretation} themeColor={themeColor} />
          </motion.div>

          {/* Data table */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <DataTable outputs={result.outputs} themeColor={themeColor} />
          </motion.div>

          {/* Link to full module */}
          <div className="text-center pt-4">
            <Link
              href={`/module/${fact.moduleSlug}`}
              className="inline-flex items-center gap-2 px-6 py-3 border border-border rounded-full text-text-secondary hover:text-text-primary hover:border-accent-indigo/30 transition-all text-sm font-medium"
            >
              Ouvrir le module complet : {module.meta.title}
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
