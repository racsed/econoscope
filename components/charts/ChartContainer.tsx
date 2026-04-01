'use client';

import { ReactNode, useRef, useState, useEffect, useCallback } from 'react';

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
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const measure = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const w = Math.floor(el.clientWidth);
    if (w <= 0) return;

    let h = minHeight;
    if (aspectRatio) {
      h = Math.max(Math.round(w / aspectRatio), minHeight);
    }

    // Use parent height if significantly larger (projection/fullscreen mode)
    const parentH = el.parentElement?.clientHeight ?? 0;
    if (parentH > minHeight + 80) {
      h = parentH - 4;
    }

    h = Math.min(h, 900);

    setDims(prev => {
      if (prev && prev.width === w && prev.height === h) return prev;
      return { width: w, height: h };
    });
  }, [aspectRatio, minHeight]);

  useEffect(() => {
    measure();

    const observer = new ResizeObserver(() => {
      const el = containerRef.current;
      if (!el) return;
      const w = Math.floor(el.clientWidth);
      // Only react to width changes - never height, to prevent loops
      if (w === lastWidthRef.current) return;
      lastWidthRef.current = w;

      // Debounce resize to prevent janky re-renders during window resize
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
    };
  }, [measure]);

  return (
    <div
      ref={containerRef}
      className={`w-full ${className}`}
      style={{ height: minHeight }}
    >
      {dims && dims.width > 0 && children(dims)}
    </div>
  );
}

export default ChartContainer;
