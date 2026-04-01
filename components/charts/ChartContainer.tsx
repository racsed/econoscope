'use client';

import { ReactNode } from 'react';
import { ParentSize } from '@visx/responsive';

interface ChartContainerProps {
  children: (dimensions: { width: number; height: number }) => ReactNode;
  aspectRatio?: number;
  minHeight?: number;
  maxHeight?: number;
  className?: string;
}

export function ChartContainer({
  children,
  aspectRatio,
  minHeight = 350,
  maxHeight = 600,
  className = '',
}: ChartContainerProps) {
  return (
    <div
      className={`w-full ${className}`}
      style={{ height: minHeight, maxHeight }}
    >
      <ParentSize debounceTime={100}>
        {({ width, height: parentHeight }) => {
          if (width <= 0) return null;
          // Use a stable height: either from aspect ratio or the fixed minHeight
          // Never grow beyond maxHeight to prevent infinite growth loops
          let height: number;
          if (aspectRatio) {
            height = Math.min(Math.max(width / aspectRatio, minHeight), maxHeight);
          } else {
            height = Math.min(Math.max(parentHeight, minHeight), maxHeight);
          }
          return <>{children({ width, height })}</>;
        }}
      </ParentSize>
    </div>
  );
}

export default ChartContainer;
