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
      className="fixed inset-0 z-[100] bg-bg-primary flex flex-col overflow-hidden"
    >
      {/* Compact top bar */}
      <div className="flex items-center justify-between px-6 py-2 border-b border-border shrink-0">
        <h2 className="text-lg font-semibold text-text-primary">{title}</h2>
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-bg-hover text-text-secondary transition-colors"
          title="Fermer (Echap)"
        >
          <X size={20} />
        </button>
      </div>

      {/* Chart area - fills all available space */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="flex-1 min-h-0 p-4"
        style={{ height: 'calc(100vh - 160px)' }}
      >
        <div className="w-full h-full [&_svg]:w-full [&_svg]:h-full">{visualization}</div>
      </motion.div>

      {/* Compact bottom bar: scenarios + controls side by side */}
      <div className="border-t border-border px-6 py-3 shrink-0">
        <div className="flex items-center gap-6 max-w-6xl mx-auto">
          {/* Scenarios on the left */}
          <div className="shrink-0">{scenarios}</div>
          {/* Divider */}
          <div className="w-px h-8 bg-border shrink-0" />
          {/* Controls spread horizontally */}
          <div className="flex-1 grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-2">
            {controls}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectionMode;
