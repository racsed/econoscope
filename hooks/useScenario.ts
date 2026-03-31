'use client';

import { useCallback } from 'react';
import type { Scenario } from '@/engine/types';

export function useScenario(
  scenarios: Scenario[],
  activeId: string | null,
  onApply: (id: string) => void
) {
  const activeScenario = scenarios.find((s) => s.id === activeId) ?? null;

  const apply = useCallback(
    (id: string) => {
      onApply(id);
    },
    [onApply]
  );

  const isActive = useCallback(
    (id: string) => id === activeId,
    [activeId]
  );

  return {
    scenarios,
    activeScenario,
    apply,
    isActive,
  };
}
