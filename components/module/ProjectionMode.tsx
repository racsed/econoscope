'use client';

import { useRef, useEffect, useState, ReactNode } from 'react';
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
  const chartAreaRef = useRef<HTMLDivElement>(null);
  const [chartHeight, setChartHeight] = useState(500);

  useEffect(() => {
    if (isActive && containerRef.current) {
      containerRef.current.requestFullscreen?.().catch(() => {});
    }
    if (!isActive && document.fullscreenElement) {
      document.exitFullscreen?.().catch(() => {});
    }
  }, [isActive]);

  // Measure available chart height
  useEffect(() => {
    if (!isActive) return;
    const measure = () => {
      if (chartAreaRef.current) {
        const rect = chartAreaRef.current.getBoundingClientRect();
        setChartHeight(rect.height - 16); // minus padding
      }
    };
    measure();
    window.addEventListener('resize', measure);
    // Delay measure for fullscreen transition
    const timer = setTimeout(measure, 300);
    return () => {
      window.removeEventListener('resize', measure);
      clearTimeout(timer);
    };
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
      <div ref={chartAreaRef} className="flex-1 min-h-0 p-2">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          style={{ width: '100%', height: chartHeight }}
          className="[&>div]:!h-full [&>div>div]:!h-full [&_svg]:max-h-full"
        >
          {visualization}
        </motion.div>
      </div>

      {/* Bottom bar: scenarios above, controls below */}
      <div className="border-t border-border px-6 py-2.5 shrink-0">
        <div className="max-w-5xl mx-auto space-y-2">
          <div className="flex justify-center overflow-x-auto">{scenarios}</div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-4 gap-y-1.5">
            {controls}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectionMode;
