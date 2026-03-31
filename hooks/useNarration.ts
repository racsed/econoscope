'use client';

import { useMemo, useRef } from 'react';
import type { Narration } from '@/engine/types';

export function useNarration(narration: Narration) {
  const prevRef = useRef<Narration>(narration);

  const hasChanged = useMemo(() => {
    const changed =
      prevRef.current.observation !== narration.observation ||
      prevRef.current.interpretation !== narration.interpretation;
    prevRef.current = narration;
    return changed;
  }, [narration]);

  // Generate a stable key for animation transitions
  const observationKey = useMemo(
    () => narration.observation.slice(0, 60),
    [narration.observation]
  );

  const interpretationKey = useMemo(
    () => narration.interpretation.slice(0, 60),
    [narration.interpretation]
  );

  return {
    observation: narration.observation,
    interpretation: narration.interpretation,
    hasChanged,
    observationKey,
    interpretationKey,
  };
}
