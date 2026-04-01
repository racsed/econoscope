'use client';

import { ReactNode, useRef, useState, useEffect } from 'react';

interface ChartContainerProps {
  children: (dimensions: { width: number; height: number }) => ReactNode;
  aspectRatio?: number;
  minHeight?: number;
  className?: string;
}

export function ChartContainer({
  children,
  aspectRatio,
  minHeight = 350,
  className = '',
}: ChartContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const measure = () => {
      const rect = el.getBoundingClientRect();
      const w = Math.floor(rect.width);
      // Use parent height if available (e.g., projection mode), else calculate
      const parentH = Math.floor(rect.height);
      let h: number;
      if (parentH > minHeight + 10) {
        // Parent has explicit height (projection mode) - use it
        h = parentH;
      } else if (aspectRatio) {
        h = Math.max(Math.round(w / aspectRatio), minHeight);
      } else {
        h = minHeight;
      }
      setDimensions((prev) => {
        if (prev && prev.width === w && prev.height === h) return prev;
        return { width: w, height: h };
      });
    };

    measure();

    const observer = new ResizeObserver(() => {
      requestAnimationFrame(measure);
    });
    observer.observe(el);

    return () => observer.disconnect();
  }, [aspectRatio, minHeight]);

  return (
    <div
      ref={containerRef}
      className={`w-full h-full ${className}`}
      style={{ minHeight }}
    >
      {dimensions && dimensions.width > 0 && children(dimensions)}
    </div>
  );
}

export default ChartContainer;
