'use client';

import { useMemo, useCallback, useEffect } from 'react';
import { useSimulationStore } from '@/stores/simulation-store';
import type { SimulationModule, ComputeResult } from '@/engine/types';

export function useSimulation(module: SimulationModule) {
  const {
    values,
    activeScenarioId,
    comparisonValues,
    isComparing,
    isProjectionMode,
    setValues,
    setValue,
    setActiveScenario,
    toggleComparison,
    toggleProjectionMode,
    reset,
  } = useSimulationStore();

  // Initialize with defaults on mount
  useEffect(() => {
    const defaults: Record<string, number | boolean | string> = {};
    for (const input of module.inputs) {
      defaults[input.id] = input.defaultValue;
    }
    setValues(defaults);
  }, [module.inputs, setValues]);

  const result: ComputeResult = useMemo(() => {
    if (Object.keys(values).length === 0) {
      // Return with defaults before store is initialized
      const defaults: Record<string, number | boolean | string> = {};
      for (const input of module.inputs) {
        defaults[input.id] = input.defaultValue;
      }
      return module.compute(defaults);
    }
    return module.compute(values);
  }, [values, module]);

  const comparisonResult: ComputeResult | null = useMemo(() => {
    if (!isComparing || !comparisonValues) return null;
    return module.compute(comparisonValues);
  }, [isComparing, comparisonValues, module]);

  const applyScenario = useCallback(
    (scenarioId: string) => {
      const scenario = module.scenarios.find((s) => s.id === scenarioId);
      if (scenario) {
        const defaults: Record<string, number | boolean | string> = {};
        for (const input of module.inputs) {
          defaults[input.id] = input.defaultValue;
        }
        setValues({ ...defaults, ...scenario.values });
        setActiveScenario(scenarioId);
      }
    },
    [module, setValues, setActiveScenario]
  );

  const resetToDefaults = useCallback(() => {
    const defaults: Record<string, number | boolean | string> = {};
    for (const input of module.inputs) {
      defaults[input.id] = input.defaultValue;
    }
    reset(defaults);
  }, [module.inputs, reset]);

  return {
    inputs: module.inputs,
    values,
    setValue,
    setValues,
    outputs: result.outputs,
    chartData: result.chartData,
    narration: result.narration,
    scenarios: module.scenarios,
    activeScenarioId,
    applyScenario,
    resetToDefaults,
    comparisonResult,
    isComparing,
    toggleComparison,
    isProjectionMode,
    toggleProjectionMode,
    meta: module.meta,
  };
}
