'use client';

import { useRef, useEffect, useState, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import type { SimulationOutput } from '@/engine/types';

interface ProjectionModeProps {
  isActive: boolean;
  onClose: () => void;
  visualization: ReactNode;
  scenarios: ReactNode;
  controls: ReactNode;
  title: string;
  outputs?: SimulationOutput[];
}

function AnimatedValue({ value, unit }: { value: number; unit?: string }) {
  const [display, setDisplay] = useState(value);
  const prevRef = useRef(value);

  useEffect(() => {
    const from = prevRef.current;
    const to = value;
    prevRef.current = to;
    if (from === to) return;

    let start: number | null = null;
    const duration = 400;
    const step = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(from + (to - from) * eased);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [value]);

  const formatted =
    Math.abs(display) >= 1_000_000
      ? `${(display / 1_000_000).toFixed(1)}M`
      : Math.abs(display) >= 1_000
        ? `${(display / 1_000).toFixed(1)}k`
        : display.toFixed(Number.isInteger(display) && Math.abs(display - Math.round(display)) < 0.01 ? 0 : 1);

  return (
    <span className="text-lg font-bold font-mono text-text-primary tabular-nums">
      {formatted}
      {unit && <span className="text-xs font-normal text-text-secondary ml-0.5">{unit}</span>}
    </span>
  );
}

export function ProjectionMode({
  isActive,
  onClose,
  visualization,
  scenarios,
  controls,
  title,
  outputs = [],
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
        setChartHeight(rect.height - 16);
      }
    };
    measure();
    window.addEventListener('resize', measure);
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
      {/* Top bar */}
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

      {/* Main content: chart (70%) + side panel (30%) */}
      <div className="flex-1 min-h-0 flex">
        {/* Chart area */}
        <div ref={chartAreaRef} className="flex-[7] min-w-0 p-2">
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

        {/* Side panel */}
        <div className="flex-[3] min-w-[260px] max-w-[380px] border-l border-border flex flex-col overflow-hidden">
          {/* Indicators section */}
          {outputs.length > 0 && (
            <div className="px-4 pt-4 pb-3 border-b border-border shrink-0">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-3">
                Indicateurs
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {outputs.map((out) => (
                  <div
                    key={out.id}
                    className="bg-bg-hover/50 border border-border rounded-lg px-3 py-2"
                  >
                    <div className="text-[10px] text-text-secondary truncate mb-0.5">
                      {out.label}
                    </div>
                    <div className="flex items-baseline gap-1">
                      <AnimatedValue value={out.value} unit={out.unit} />
                      {out.direction && out.direction !== 'neutral' && (
                        <span
                          className={`text-xs ${
                            out.direction === 'up' ? 'text-green-500' : 'text-red-500'
                          }`}
                        >
                          {out.direction === 'up' ? '\u2191' : '\u2193'}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Variables / controls section - scrollable */}
          <div className="flex-1 min-h-0 overflow-y-auto px-4 pt-3 pb-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-3">
              Variables
            </h3>
            <div className="space-y-1">
              {controls}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar: scenarios */}
      <div className="border-t border-border px-6 py-2.5 shrink-0">
        <div className="flex justify-center overflow-x-auto">
          {scenarios}
        </div>
      </div>
    </div>
  );
}

export default ProjectionMode;
