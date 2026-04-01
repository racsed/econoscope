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

    // Height is FIXED once calculated - never grows from content
    // Only changes if: 1) aspect ratio, 2) parent has explicit height via CSS
    let h = minHeight;
    if (aspectRatio) {
      h = Math.max(Math.round(w / aspectRatio), minHeight);
    }

    // Check if parent has explicit height set (projection mode)
    const parent = el.parentElement;
    if (parent) {
      const parentStyle = getComputedStyle(parent);
      const parentH = parent.clientHeight;
      // Only use parent height if it's explicitly set (not auto/min-content)
      if (parentStyle.height !== 'auto' && parentH > h + 50) {
        h = parentH - 8;
      }
    }

    // Cap at reasonable max
    h = Math.min(h, 800);
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
