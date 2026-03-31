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
  return (
    <div className={`w-full h-full ${className}`} style={{ minHeight }}>
      <ParentSize debounceTime={50}>
        {({ width, height: parentHeight }) => {
          if (width <= 0) return null;
          // Use parent height if available (e.g. fullscreen), otherwise calculate
          let height: number;
          if (parentHeight > minHeight) {
            height = parentHeight;
          } else if (aspectRatio) {
            height = Math.max(width / aspectRatio, minHeight);
          } else {
            height = Math.max(minHeight, 350);
          }
          return <>{children({ width, height })}</>;
        }}
      </ParentSize>
    </div>
  );
}

export default ChartContainer;
