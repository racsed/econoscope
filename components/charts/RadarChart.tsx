'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import type { RadarData } from '@/engine/types';
import { ChartContainer } from './ChartContainer';
import { useChartColors } from '@/hooks/useChartColors';

interface RadarChartProps {
  data: RadarData;
  themeColor?: string;
}

function polarToCartesian(
  cx: number,
  cy: number,
  radius: number,
  angleInDegrees: number
): { x: number; y: number } {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180;
  return {
    x: cx + radius * Math.cos(angleInRadians),
    y: cy + radius * Math.sin(angleInRadians),
  };
}

function RadarChartInner({
  data,
  width,
  height,
  themeColor = '#5B5EF4',
}: RadarChartProps & { width: number; height: number }) {
  const cx = width / 2;
  const cy = height / 2;
  const radius = Math.min(width, height) / 2 - 50;
  const numAxes = data.axes.length;
  const angleStep = 360 / numAxes;
  const colors = useChartColors();

  // Concentric rings
  const rings = [0.2, 0.4, 0.6, 0.8, 1.0];

  // Compute polygon points for a dataset
  const getPolygonPoints = (values: Record<string, number>) => {
    return data.axes.map((axis, i) => {
      const angle = i * angleStep;
      let raw = values[axis.id] ?? 0;
      // Normalize to 0-1 range
      const range = axis.max - axis.min;
      let normalized = (raw - axis.min) / range;
      if (axis.invert) normalized = 1 - normalized;
      normalized = Math.max(0, Math.min(1, normalized));
      const r = normalized * radius;
      return polarToCartesian(cx, cy, r, angle);
    });
  };

  const polygonsData = useMemo(() => {
    return data.datasets.map((ds) => ({
      ...ds,
      points: getPolygonPoints(ds.values),
    }));
  }, [data.datasets, data.axes, cx, cy, radius]);

  return (
    <svg width={width} height={height}>
      {/* Background rings */}
      {rings.map((ringScale) => {
        const r = ringScale * radius;
        const points = data.axes
          .map((_, i) => {
            const angle = i * angleStep;
            const p = polarToCartesian(cx, cy, r, angle);
            return `${p.x},${p.y}`;
          })
          .join(' ');

        return (
          <polygon
            key={`ring-${ringScale}`}
            points={points}
            fill="none"
            stroke={colors.radarRing}
            strokeWidth={1}
          />
        );
      })}

      {/* Axis lines and labels */}
      {data.axes.map((axis, i) => {
        const angle = i * angleStep;
        const end = polarToCartesian(cx, cy, radius, angle);
        const labelPos = polarToCartesian(cx, cy, radius + 20, angle);

        // Show which end is "best" for inverted axes
        const bestLabel = axis.invert ? `${axis.min}%` : `${axis.max}%`;
        const worstLabel = axis.invert ? `${axis.max}%` : `${axis.min}%`;
        const bestPos = polarToCartesian(cx, cy, radius + 8, angle);
        const worstPos = polarToCartesian(cx, cy, 18, angle);

        return (
          <g key={axis.id}>
            <line
              x1={cx}
              y1={cy}
              x2={end.x}
              y2={end.y}
              stroke={colors.radarAxis}
              strokeWidth={1}
            />
            <text
              x={labelPos.x}
              y={labelPos.y}
              fill={colors.legendText}
              fontSize={11}
              fontWeight={500}
              textAnchor="middle"
              dominantBaseline="middle"
            >
              {axis.label}
            </text>
            {/* Best value indicator at outer edge */}
            <text
              x={bestPos.x}
              y={bestPos.y + 14}
              fill={colors.tickLabel}
              fontSize={8}
              fontFamily="var(--font-mono)"
              textAnchor="middle"
              dominantBaseline="middle"
            >
              {axis.invert ? 'min' : 'max'}
            </text>
          </g>
        );
      })}

      {/* Data polygons */}
      {polygonsData.map((ds) => {
        const pathD =
          ds.points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';

        return (
          <g key={ds.label}>
            <motion.path
              d={pathD}
              fill={ds.color}
              fillOpacity={ds.opacity ?? 0.2}
              stroke={ds.color}
              strokeWidth={2}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 100, damping: 15 }}
              style={{ transformOrigin: `${cx}px ${cy}px` }}
            />
            {/* Data points */}
            {ds.points.map((p, i) => (
              <motion.circle
                key={i}
                cx={p.x}
                cy={p.y}
                r={4}
                fill={ds.color}
                stroke={colors.equilibriumDot}
                strokeWidth={2}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.05 + 0.2 }}
              />
            ))}
          </g>
        );
      })}

      {/* Area percentage indicator */}
      {data.currentArea != null && data.idealArea != null && (
        <g>
          <rect
            x={width - 140}
            y={10}
            width={130}
            height={36}
            rx={18}
            fill={themeColor}
            opacity={0.1}
          />
          <text
            x={width - 75}
            y={33}
            fill={themeColor}
            fontSize={13}
            fontFamily="var(--font-mono)"
            fontWeight={600}
            textAnchor="middle"
          >
            {((data.currentArea / data.idealArea) * 100).toFixed(1)}% ideal
          </text>
        </g>
      )}

      {/* Legend */}
      {polygonsData.length > 1 && (
        <g transform={`translate(10, ${height - 30})`}>
          {polygonsData.map((ds, i) => (
            <g key={ds.label} transform={`translate(${i * 140}, 0)`}>
              <rect width={12} height={12} rx={3} fill={ds.color} opacity={0.6} />
              <text x={18} y={10} fill={colors.legendText} fontSize={11}>
                {ds.label}
              </text>
            </g>
          ))}
        </g>
      )}
    </svg>
  );
}

export function RadarChart({ data, themeColor }: RadarChartProps) {
  return (
    <ChartContainer aspectRatio={1} minHeight={400}>
      {({ width, height }) => {
        const size = Math.min(width, height);
        return (
          <RadarChartInner data={data} width={size} height={size} themeColor={themeColor} />
        );
      }}
    </ChartContainer>
  );
}

export default RadarChart;
