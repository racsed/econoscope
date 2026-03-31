'use client';

import { useEffect, useCallback } from 'react';
import { useSimulationStore } from '@/stores/simulation-store';

export function useProjectionMode() {
  const { isProjectionMode, toggleProjectionMode } = useSimulationStore();

  // Toggle with keyboard shortcut (F11 or Cmd+Shift+P)
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (
        e.key === 'F11' ||
        ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'p')
      ) {
        e.preventDefault();
        toggleProjectionMode();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleProjectionMode]);

  // Add body class for global styling
  useEffect(() => {
    if (isProjectionMode) {
      document.body.classList.add('projection-mode');
      document.documentElement.requestFullscreen?.().catch(() => {});
    } else {
      document.body.classList.remove('projection-mode');
      if (document.fullscreenElement) {
        document.exitFullscreen?.().catch(() => {});
      }
    }
  }, [isProjectionMode]);

  const toggle = useCallback(() => {
    toggleProjectionMode();
  }, [toggleProjectionMode]);

  return {
    isProjectionMode,
    toggle,
  };
}
