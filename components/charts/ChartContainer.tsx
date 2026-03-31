'use client';

import { ReactNode } from 'react';
import { ParentSize } from '@visx/responsive';

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
  // Lower minimum height on mobile for better fit
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
  const effectiveMinHeight = isMobile ? Math.min(minHeight, 250) : minHeight;

  return (
    <div
      className={`w-full h-full overflow-x-auto ${className}`}
      style={{ minHeight: effectiveMinHeight }}
    >
      <ParentSize debounceTime={50}>
        {({ width, height: parentHeight }) => {
          if (width <= 0) return null;
          let height: number;
          if (parentHeight > effectiveMinHeight) {
            height = parentHeight;
          } else if (aspectRatio) {
            height = Math.max(width / aspectRatio, effectiveMinHeight);
          } else {
            height = Math.max(effectiveMinHeight, isMobile ? 250 : 350);
          }
          return <>{children({ width, height })}</>;
        }}
      </ParentSize>
    </div>
  );
}

export default ChartContainer;
