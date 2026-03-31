'use client';

import { useRef, useEffect, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

interface ProjectionModeProps {
  isActive: boolean;
  onClose: () => void;
  visualization: ReactNode;
  scenarios: ReactNode;
  controls: ReactNode;
  title: string;
}

export function ProjectionMode({
  isActive,
  onClose,
  visualization,
  scenarios,
  controls,
  title,
}: ProjectionModeProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isActive && containerRef.current) {
      containerRef.current.requestFullscreen?.().catch(() => {});
    }
    if (!isActive && document.fullscreenElement) {
      document.exitFullscreen?.().catch(() => {});
    }
  }, [isActive]);

  // Listen for fullscreen exit (e.g. Escape key) to sync state
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && isActive) {
        onClose();
      }
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, [isActive, onClose]);

  if (!isActive) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] bg-bg-primary flex flex-col"
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-8 py-4 border-b border-border">
        <h2 className="text-xl font-bold text-text-primary">{title}</h2>
        <button
          onClick={onClose}
          className="p-2.5 rounded-xl hover:bg-bg-hover text-text-secondary transition-colors"
          title="Fermer le mode projection"
        >
          <X size={24} />
        </button>
      </div>

      {/* Main chart area */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="flex-1 p-8 flex items-center justify-center min-h-0"
      >
        <div className="w-full h-full">{visualization}</div>
      </motion.div>

      {/* Bottom: scenarios + key controls */}
      <div className="border-t border-border px-8 py-5 space-y-4">
        <div className="flex justify-center">{scenarios}</div>
        <div className="flex gap-8 justify-center max-w-4xl mx-auto text-base [&_label]:text-sm [&_input]:h-2">
          {controls}
        </div>
      </div>
    </div>
  );
}

export default ProjectionMode;
