'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
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

  // Read initial values from URL params if present
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    if (params.size === 0) return;

    const urlValues: Record<string, number | boolean | string> = { ...getDefaults(module) };
    let hasUrlValues = false;
    for (const input of module.inputs) {
      const paramVal = params.get(input.id);
      if (paramVal !== null) {
        hasUrlValues = true;
        if (input.type === 'toggle' && !input.options) {
          urlValues[input.id] = paramVal === 'true';
        } else if (input.type === 'slider') {
          urlValues[input.id] = Number(paramVal);
        } else {
          urlValues[input.id] = paramVal;
        }
      }
    }
    if (hasUrlValues) setAllValues(urlValues);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync values to URL (debounced)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const timer = setTimeout(() => {
      const params = new URLSearchParams();
      const defaults = getDefaults(module);
      for (const [key, val] of Object.entries(values)) {
        if (val !== defaults[key]) {
          params.set(key, String(val));
        }
      }
      const url = params.size > 0
        ? `${window.location.pathname}?${params.toString()}`
        : window.location.pathname;
      window.history.replaceState(null, '', url);
    }, 300);
    return () => clearTimeout(timer);
  }, [values, module]);

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
    getShareUrl: () => {
      if (typeof window === 'undefined') return '';
      return window.location.href;
    },
  };
}
