'use client';

import { useState, useMemo, useCallback } from 'react';
import type { SimulationModule, ComputeResult } from '@/engine/types';

function getDefaults(module: SimulationModule): Record<string, number | boolean | string> {
  const defaults: Record<string, number | boolean | string> = {};
  for (const input of module.inputs) {
    defaults[input.id] = input.defaultValue;
  }
  return defaults;
}

export function useSimulation(module: SimulationModule) {
  const [values, setAllValues] = useState(() => getDefaults(module));
  const [activeScenarioId, setActiveScenarioId] = useState<string | null>(null);
  const [isProjectionMode, setIsProjectionMode] = useState(false);

  const setValue = useCallback((key: string, value: number | boolean | string) => {
    setAllValues(prev => ({ ...prev, [key]: value }));
    setActiveScenarioId(null);
  }, []);

  const result: ComputeResult = useMemo(() => {
    try {
      return module.compute(values);
    } catch {
      // Fallback to defaults if compute crashes
      return module.compute(getDefaults(module));
    }
  }, [values, module]);

  const applyScenario = useCallback((scenarioId: string) => {
    const scenario = module.scenarios.find(s => s.id === scenarioId);
    if (scenario) {
      setAllValues({ ...getDefaults(module), ...scenario.values });
      setActiveScenarioId(scenarioId);
    }
  }, [module]);

  const resetToDefaults = useCallback(() => {
    setAllValues(getDefaults(module));
    setActiveScenarioId(null);
  }, [module]);

  const toggleProjectionMode = useCallback(() => {
    setIsProjectionMode(prev => !prev);
  }, []);

  return {
    inputs: module.inputs,
    values,
    setValue,
    setValues: setAllValues,
    outputs: result.outputs,
    chartData: result.chartData,
    narration: result.narration,
    scenarios: module.scenarios,
    activeScenarioId,
    applyScenario,
    resetToDefaults,
    isProjectionMode,
    toggleProjectionMode,
    meta: module.meta,
  };
}
