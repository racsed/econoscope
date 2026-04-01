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
  const computedHeightRef = useRef(minHeight);
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

    // Detect fullscreen/projection: check if any ancestor has large explicit height
    let parent = el.parentElement;
    while (parent) {
      const pH = parent.clientHeight;
      if (pH > minHeight + 100 && parent.style.height) {
        h = Math.max(h, pH - 8);
        break;
      }
      // Also check for flex containers with large height
      const cs = getComputedStyle(parent);
      if (cs.display === 'flex' && pH > minHeight + 100 && cs.flexGrow !== '0') {
        h = Math.max(h, pH - 8);
        break;
      }
      parent = parent.parentElement;
    }

    h = Math.min(h, 900);
    computedHeightRef.current = h;

    setDims(prev => {
      if (prev && prev.width === w && prev.height === h) return prev;
      return { width: w, height: h };
    });
  }, [aspectRatio, minHeight]);

  useEffect(() => {
    // Initial measure + delayed re-measure for fullscreen detection
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
