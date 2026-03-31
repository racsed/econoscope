'use client';

import { useParams } from 'next/navigation';
import { useMemo } from 'react';
import { getModule } from '@/engine/init';
import { useSimulation } from '@/hooks/useSimulation';
import { THEME_COLORS, type ThemeType } from '@/lib/constants';
import { ModuleLayout } from '@/components/module/ModuleLayout';
import { ControlPanel } from '@/components/module/ControlPanel';
import { VisualizationPane } from '@/components/module/VisualizationPane';
import { ObservationBlock } from '@/components/module/ObservationBlock';
import { InterpretationBlock } from '@/components/module/InterpretationBlock';
import { LimitesBlock } from '@/components/module/LimitesBlock';
import { RealiteBlock } from '@/components/module/RealiteBlock';
import { DataTable } from '@/components/module/DataTable';
import { ScenarioBar } from '@/components/ui/ScenarioBar';

export default function ModulePage() {
  const params = useParams();
  const slug = params.slug as string;

  const simulationModule = useMemo(() => getModule(slug), [slug]);

  if (!simulationModule) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-text-primary mb-2">Module introuvable</h1>
          <p className="text-text-secondary">Le module &quot;{slug}&quot; n&apos;existe pas encore.</p>
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
      dataTable={<DataTable outputs={outputs} themeColor={themeColor} />}
    />
  );
}
