'use client';

import { ReactNode, createContext, useContext, useRef, useState, useEffect, useCallback } from 'react';

/* ---------- Chart Height Context ---------- */
const ChartHeightContext = createContext<number | null>(null);

export function ChartHeightProvider({ height, children }: { height: number; children: ReactNode }) {
  return <ChartHeightContext.Provider value={height}>{children}</ChartHeightContext.Provider>;
}

export function useChartHeight() {
  return useContext(ChartHeightContext);
}

/* ---------- ChartContainer ---------- */
interface ChartContainerProps {
  children: (dimensions: { width: number; height: number }) => ReactNode;
  aspectRatio?: number;
  minHeight?: number;
  className?: string;
}

export function ChartContainer({
  children,
  aspectRatio,
  minHeight = 340,
  className = '',
}: ChartContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState<{ width: number; height: number } | null>(null);
  const lastWidthRef = useRef(0);
  const computedHeightRef = useRef(minHeight);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const contextHeight = useContext(ChartHeightContext);

  const measure = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const w = Math.floor(el.clientWidth);
    if (w <= 0) return;

    let h = minHeight;

    // Context height takes priority (projection mode)
    if (contextHeight && contextHeight > minHeight) {
      h = contextHeight;
    } else if (aspectRatio) {
      h = Math.max(Math.round(w / aspectRatio), minHeight);
    }

    h = Math.min(h, 1200); // higher cap for fullscreen

    computedHeightRef.current = h;
    setDims(prev => {
      if (prev && prev.width === w && prev.height === h) return prev;
      return { width: w, height: h };
    });
  }, [aspectRatio, minHeight, contextHeight]);

  useEffect(() => {
    measure();
    const timer = setTimeout(measure, 200);

    const observer = new ResizeObserver(() => {
      const el = containerRef.current;
      if (!el) return;
      const w = Math.floor(el.clientWidth);
      if (w === lastWidthRef.current) return;
      lastWidthRef.current = w;
      clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(measure, 60);
    });

    if (containerRef.current) {
      lastWidthRef.current = Math.floor(containerRef.current.clientWidth);
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
      clearTimeout(debounceRef.current);
      clearTimeout(timer);
    };
  }, [measure]);

  return (
    <div
      ref={containerRef}
      className={`w-full flex items-center justify-center ${className}`}
      style={{ height: computedHeightRef.current, minHeight }}
    >
      {dims && dims.width > 0 && children(dims)}
    </div>
  );
}

export default ChartContainer;
