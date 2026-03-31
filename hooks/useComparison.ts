'use client';

import { useCallback } from 'react';
import { useSimulationStore } from '@/stores/simulation-store';
import type { SimulationModule, ComputeResult } from '@/engine/types';

export function useComparison(module: SimulationModule) {
  const {
    values,
    comparisonValues,
    isComparing,
    setComparisonValues,
    toggleComparison,
  } = useSimulationStore();

  const snapshotCurrent = useCallback(() => {
    setComparisonValues({ ...values });
  }, [values, setComparisonValues]);

  const resultA: ComputeResult | null = isComparing && comparisonValues
    ? module.compute(comparisonValues)
    : null;

  const resultB: ComputeResult | null = isComparing
    ? module.compute(values)
    : null;

  return {
    isComparing,
    toggleComparison,
    snapshotCurrent,
    resultA,
    resultB,
    labelsA: 'Scenario A',
    labelsB: 'Scenario B',
  };
}
