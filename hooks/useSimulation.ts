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
    setAllValues(prev => {
      const next = { ...prev, [key]: value };
      // Auto-switch to 'personnalise' if user changes a decile slider
      if (key.match(/^d\d+$/) && prev.preset !== undefined && prev.preset !== 'personnalise') {
        next.preset = 'personnalise';
      }
      // Auto-set elasticite when type_bien changes
      if (key === 'type_bien') {
        const presets: Record<string, number> = { necessaire: -0.3, normal: -1, luxe: -2.5 };
        if (presets[value as string] !== undefined) {
          next.elasticite = presets[value as string];
        }
      }
      return next;
    });
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
    secondaryChartData: result.secondaryChartData,
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
