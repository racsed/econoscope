'use client';

import { useState, useCallback } from 'react';
import type { SimulationModule, ComputeResult } from '@/engine/types';

export function useComparison(module: SimulationModule, currentValues: Record<string, number | boolean | string>) {
  const [comparisonValues, setComparisonValues] = useState<Record<string, number | boolean | string> | null>(null);
  const [isComparing, setIsComparing] = useState(false);

  const toggleComparison = useCallback(() => {
    setIsComparing(prev => {
      if (!prev) {
        // Snapshot current values when entering comparison mode
        setComparisonValues({ ...currentValues });
      } else {
        setComparisonValues(null);
      }
      return !prev;
    });
  }, [currentValues]);

  const snapshotCurrent = useCallback(() => {
    setComparisonValues({ ...currentValues });
  }, [currentValues]);

  const resultA: ComputeResult | null = isComparing && comparisonValues
    ? module.compute(comparisonValues)
    : null;

  const resultB: ComputeResult | null = isComparing
    ? module.compute(currentValues)
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
