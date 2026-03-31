'use client';

import { useState, useEffect, useCallback } from 'react';

export function useProjectionMode() {
  const [isProjectionMode, setIsProjectionMode] = useState(false);

  // Toggle with keyboard shortcut (F11 or Cmd+Shift+P)
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (
        e.key === 'F11' ||
        ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'p')
      ) {
        e.preventDefault();
        setIsProjectionMode(prev => !prev);
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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
    setIsProjectionMode(prev => !prev);
  }, []);

  return {
    isProjectionMode,
    toggle,
  };
}
