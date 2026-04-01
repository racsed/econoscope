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
  const heightRef = useRef(minHeight);

  const measure = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const w = Math.floor(el.clientWidth);
    if (w <= 0) return;

    // Determine height
    let h = minHeight;
    if (aspectRatio) {
      h = Math.max(Math.round(w / aspectRatio), minHeight);
    }

    // Use parent height if significantly larger (projection/fullscreen mode)
    const parentH = el.parentElement?.clientHeight ?? 0;
    if (parentH > minHeight + 80) {
      h = parentH - 4;
    }

    // Cap to prevent absurd sizes
    h = Math.min(h, 900);
    heightRef.current = h;

    setDims(prev => {
      if (prev && prev.width === w && prev.height === h) return prev;
      return { width: w, height: h };
    });
  }, [aspectRatio, minHeight]);

  useEffect(() => {
    measure();
    const observer = new ResizeObserver(() => {
      // Only measure width changes - ignore height to prevent loops
      const el = containerRef.current;
      if (!el) return;
      const w = Math.floor(el.clientWidth);
      if (dims && w === dims.width) return;
      measure();
    });
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [measure, dims]);

  return (
    <div
      ref={containerRef}
      className={`w-full ${className}`}
      style={{ height: heightRef.current }}
    >
      {dims && dims.width > 0 && children(dims)}
    </div>
  );
}

export default ChartContainer;
