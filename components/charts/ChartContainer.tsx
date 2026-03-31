'use client';

import { ReactNode, useRef } from 'react';
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
    <div className={`w-full ${className}`} style={{ minHeight }}>
      <ParentSize debounceTime={50}>
        {({ width }) => {
          if (width <= 0) return null;
          const height = aspectRatio
            ? Math.max(width / aspectRatio, minHeight)
            : Math.max(minHeight, 350);
          return <>{children({ width, height })}</>;
        }}
      </ParentSize>
    </div>
  );
}

export default ChartContainer;
