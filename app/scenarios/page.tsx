'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { PlayCircle, ArrowRight } from 'lucide-react';
import { modulesCatalog } from '@/data/modules-catalog';
import { THEME_COLORS, type ThemeType } from '@/lib/constants';
import { getModule } from '@/engine/init';

export default function ScenariosPage() {
  const allScenarios = useMemo(() => {
    const result: {
      moduleSlug: string;
      moduleTitle: string;
      moduleTheme: string;
      scenarioId: string;
      scenarioLabel: string;
      scenarioDescription: string;
    }[] = [];

    for (const entry of modulesCatalog) {
      if (!entry.available) continue;
      const mod = getModule(entry.slug);
      if (!mod) continue;
      for (const scenario of mod.scenarios) {
        result.push({
          moduleSlug: entry.slug,
          moduleTitle: entry.title,
          moduleTheme: entry.theme,
          scenarioId: scenario.id,
          scenarioLabel: scenario.label,
          scenarioDescription: scenario.description,
        });
      }
    }

    return result;
  }, []);

  // Group by module
  const grouped = useMemo(() => {
    const map = new Map<string, typeof allScenarios>();
    for (const s of allScenarios) {
      if (!map.has(s.moduleSlug)) map.set(s.moduleSlug, []);
      map.get(s.moduleSlug)!.push(s);
    }
    return Array.from(map.entries());
  }, [allScenarios]);

  return (
    <main className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-3">
            <PlayCircle size={24} className="text-[#22D3EE]" />
            <h1 className="text-3xl font-bold text-text-primary">Scénarios</h1>
          </div>
          <p className="text-text-secondary text-lg">
            {allScenarios.length} situations économiques préconfigurées à explorer
          </p>
        </motion.div>

        <div className="space-y-10">
          {grouped.map(([moduleSlug, scenarios], gi) => {
            const color =
              THEME_COLORS[scenarios[0].moduleTheme as ThemeType] ?? '#5B5EF4';
            return (
              <motion.div
                key={moduleSlug}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: gi * 0.08 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                  <h2 className="text-lg font-semibold text-text-primary">
                    {scenarios[0].moduleTitle}
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {scenarios.map((scenario) => (
                    <Link
                      key={`${moduleSlug}-${scenario.scenarioId}`}
                      href={`/module/${moduleSlug}?scenario=${scenario.scenarioId}`}
                      className="group bg-bg-card border border-border rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200"
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.borderColor = `${color}60`;
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.borderColor = '';
                      }}
                    >
                      <h3 className="font-medium text-text-primary text-sm mb-1">
                        {scenario.scenarioLabel}
                      </h3>
                      <p className="text-xs text-text-secondary leading-relaxed mb-3">
                        {scenario.scenarioDescription}
                      </p>
                      <div
                        className="flex items-center gap-1 text-xs font-medium group-hover:gap-2 transition-all"
                        style={{ color }}
                      >
                        Lancer
                        <ArrowRight size={12} />
                      </div>
                    </Link>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
