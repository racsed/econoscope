'use client';

import { useParams } from 'next/navigation';
import { useMemo } from 'react';
import { getModule } from '@/engine/init';
import { useSimulation } from '@/hooks/useSimulation';
import { THEME_COLORS, type ThemeType } from '@/lib/constants';
import Link from 'next/link';
import { SearchX, ArrowLeft } from 'lucide-react';
import { ModuleLayout } from '@/components/module/ModuleLayout';
import { ControlPanel } from '@/components/module/ControlPanel';
import { VisualizationPane } from '@/components/module/VisualizationPane';
import { ObservationBlock } from '@/components/module/ObservationBlock';
import { InterpretationBlock } from '@/components/module/InterpretationBlock';
import { LimitesBlock } from '@/components/module/LimitesBlock';
import { RealiteBlock } from '@/components/module/RealiteBlock';
import { DataTable } from '@/components/module/DataTable';
import { EconomistBlock } from '@/components/module/EconomistBlock';
import { ScenarioBar } from '@/components/ui/ScenarioBar';

export default function ModulePage() {
  const params = useParams();
  const slug = params.slug as string;

  const simulationModule = useMemo(() => getModule(slug), [slug]);

  if (!simulationModule) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-accent-indigo/10 flex items-center justify-center mx-auto mb-6">
            <SearchX size={28} className="text-accent-indigo" />
          </div>
          <h1 className="text-2xl font-bold text-text-primary mb-3">
            Module introuvable
          </h1>
          <p className="text-text-secondary mb-8 leading-relaxed">
            Le module &quot;{slug}&quot; n&apos;existe pas encore.
            Il sera peut-être disponible prochainement.
          </p>
          <Link
            href="/explorer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-accent-indigo text-white font-semibold rounded-full hover:bg-[#4F52E0] transition-all duration-200 hover:shadow-lg hover:shadow-accent-indigo/25"
          >
            <ArrowLeft size={16} />
            Retour au catalogue
          </Link>
        </div>
      </div>
    );
  }

  return <ModuleContent module={simulationModule} />;
}

function ModuleContent({ module }: { module: NonNullable<ReturnType<typeof getModule>> }) {
  const {
    inputs,
    values,
    setValue,
    outputs,
    chartData,
    secondaryChartData,
    narration,
    scenarios,
    activeScenarioId,
    applyScenario,
    meta,
    isProjectionMode,
  } = useSimulation(module);

  const themeColor = THEME_COLORS[meta.theme as ThemeType] ?? '#6366F1';

  return (
    <ModuleLayout
      title={meta.title}
      subtitle={meta.subtitle}
      theme={meta.theme as ThemeType}
      level={meta.level as 'accessible' | 'intermediate' | 'advanced'}
      introduction={meta.introduction}
      isProjectionMode={isProjectionMode}
      controls={
        <ControlPanel
          inputs={inputs}
          values={values}
          onChange={setValue}
          themeColor={themeColor}
        />
      }
      visualization={
        <VisualizationPane chartData={chartData} secondaryChartData={secondaryChartData} themeColor={themeColor} />
      }
      scenarios={
        <ScenarioBar
          scenarios={scenarios}
          activeId={activeScenarioId}
          onSelect={applyScenario}
        />
      }
      narration={
        <>
          <ObservationBlock content={narration.observation} themeColor={themeColor} />
          <InterpretationBlock content={narration.interpretation} themeColor={themeColor} />
        </>
      }
      limites={<LimitesBlock limites={meta.limites} themeColor={themeColor} />}
      realite={<RealiteBlock items={meta.realite} themeColor={themeColor} />}
      economists={meta.economists ? <EconomistBlock economistIds={meta.economists} themeColor={themeColor} /> : undefined}
      dataTable={<DataTable outputs={outputs} themeColor={themeColor} />}
    />
  );
}
