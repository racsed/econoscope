'use client';

import { useMemo, useState, useCallback } from 'react';
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
  angleInDegrees: number,
): { x: number; y: number } {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180;
  return {
    x: cx + radius * Math.cos(angleInRadians),
    y: cy + radius * Math.sin(angleInRadians),
  };
}

function formatValue(value: number): string {
  const abs = Math.abs(value);
  if (abs >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `${(value / 1_000).toFixed(1)}k`;
  return value.toFixed(1);
}

function RadarChartInner({
  data,
  width,
  height,
  themeColor = '#5B5EF4',
}: RadarChartProps & { width: number; height: number }) {
  const cx = width / 2;
  const cy = height / 2;
  const radius = Math.min(width, height) / 2 - 55;
  const numAxes = data.axes.length;
  const angleStep = 360 / numAxes;
  const colors = useChartColors();
  const [hoveredPoint, setHoveredPoint] = useState<{
    datasetIdx: number;
    axisIdx: number;
  } | null>(null);

  const rings = [0.2, 0.4, 0.6, 0.8, 1.0];

  const getPolygonPoints = useCallback(
    (values: Record<string, number>) => {
      return data.axes.map((axis, i) => {
        const angle = i * angleStep;
        const raw = values[axis.id] ?? 0;
        const range = axis.max - axis.min;
        let normalized = (raw - axis.min) / range;
        if (axis.invert) normalized = 1 - normalized;
        normalized = Math.max(0, Math.min(1, normalized));
        const r = normalized * radius;
        return { ...polarToCartesian(cx, cy, r, angle), value: raw, normalized };
      });
    },
    [data.axes, angleStep, cx, cy, radius],
  );

  const polygonsData = useMemo(() => {
    return data.datasets.map((ds) => ({
      ...ds,
      points: getPolygonPoints(ds.values),
    }));
  }, [data.datasets, getPolygonPoints]);

  const handlePointEnter = useCallback(
    (datasetIdx: number, axisIdx: number) => {
      setHoveredPoint({ datasetIdx, axisIdx });
    },
    [],
  );

  const handlePointLeave = useCallback(() => {
    setHoveredPoint(null);
  }, []);

  return (
    <>
      <svg width={width} height={height}>
        <defs>
          {data.datasets.map((ds, i) => (
            <radialGradient
              key={`radar-grad-${i}`}
              id={`radar-grad-${i}`}
              cx="50%"
              cy="50%"
              r="50%"
            >
              <stop offset="0%" stopColor={ds.color} stopOpacity={0.05} />
              <stop
                offset="100%"
                stopColor={ds.color}
                stopOpacity={ds.opacity ?? 0.2}
              />
            </radialGradient>
          ))}
        </defs>

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

        {/* Ring labels (percentage) */}
        {rings.map((ringScale) => {
          const r = ringScale * radius;
          const labelPos = polarToCartesian(cx, cy, r, 0);
          return (
            <text
              key={`ring-label-${ringScale}`}
              x={labelPos.x + 4}
              y={labelPos.y}
              fill={colors.tickLabel}
              fontSize={8}
              fontFamily="var(--font-mono)"
              opacity={0.5}
              dominantBaseline="middle"
            >
              {Math.round(ringScale * 100)}%
            </text>
          );
        })}

        {/* Axis lines and labels */}
        {data.axes.map((axis, i) => {
          const angle = i * angleStep;
          const end = polarToCartesian(cx, cy, radius, angle);
          const labelPos = polarToCartesian(cx, cy, radius + 22, angle);

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
              {/* Min/max hint */}
              <text
                x={polarToCartesian(cx, cy, radius + 10, angle).x}
                y={polarToCartesian(cx, cy, radius + 10, angle).y + 14}
                fill={colors.tickLabel}
                fontSize={8}
                fontFamily="var(--font-mono)"
                textAnchor="middle"
                dominantBaseline="middle"
                opacity={0.5}
              >
                {axis.invert ? 'min' : 'max'}
              </text>
            </g>
          );
        })}

        {/* Data polygons */}
        {polygonsData.map((ds, dsIdx) => {
          const pathD =
            ds.points
              .map(
                (p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`,
              )
              .join(' ') + ' Z';

          return (
            <g key={ds.label}>
              {/* Fill */}
              <motion.path
                d={pathD}
                fill={`url(#radar-grad-${dsIdx})`}
                stroke={ds.color}
                strokeWidth={2}
                strokeLinejoin="round"
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  type: 'spring',
                  stiffness: 80,
                  damping: 15,
                  delay: dsIdx * 0.15,
                }}
                style={{ transformOrigin: `${cx}px ${cy}px` }}
              />

              {/* Data points with hover */}
              {ds.points.map((p, i) => {
                const isHovered =
                  hoveredPoint?.datasetIdx === dsIdx &&
                  hoveredPoint?.axisIdx === i;

                return (
                  <g key={i}>
                    {/* Value label at each point */}
                    <motion.text
                      x={p.x + (p.x > cx ? 8 : -8)}
                      y={p.y + (p.y > cy ? 14 : -8)}
                      fill={ds.color}
                      fontSize={9}
                      fontFamily="var(--font-mono)"
                      fontWeight={600}
                      textAnchor={p.x > cx ? 'start' : 'end'}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.8 }}
                      transition={{ delay: i * 0.05 + 0.5 }}
                    >
                      {formatValue(p.value)}
                    </motion.text>

                    {/* Invisible larger hit area */}
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r={12}
                      fill="transparent"
                      onMouseEnter={() => handlePointEnter(dsIdx, i)}
                      onMouseLeave={handlePointLeave}
                      style={{ cursor: 'pointer' }}
                    />

                    {/* Visible dot */}
                    <motion.circle
                      cx={p.x}
                      cy={p.y}
                      r={isHovered ? 6 : 4}
                      fill={ds.color}
                      stroke={colors.tooltipBg}
                      strokeWidth={2}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: i * 0.05 + 0.2 }}
                    />

                    {/* Hover pulse */}
                    {isHovered && (
                      <motion.circle
                        cx={p.x}
                        cy={p.y}
                        r={6}
                        fill="none"
                        stroke={ds.color}
                        strokeWidth={1.5}
                        initial={{ r: 6, opacity: 0.8 }}
                        animate={{
                          r: [6, 14, 6],
                          opacity: [0.8, 0, 0.8],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: 'easeInOut',
                        }}
                      />
                    )}
                  </g>
                );
              })}
            </g>
          );
        })}

        {/* Hover tooltip */}
        {hoveredPoint && (() => {
          const ds = polygonsData[hoveredPoint.datasetIdx];
          const pt = ds?.points[hoveredPoint.axisIdx];
          const axis = data.axes[hoveredPoint.axisIdx];
          if (!ds || !pt || !axis) return null;

          const tooltipX = pt.x + (pt.x > cx ? 16 : -130);
          const tooltipY = pt.y + (pt.y > cy ? 16 : -50);

          return (
            <foreignObject
              x={tooltipX}
              y={tooltipY}
              width={120}
              height={50}
              pointerEvents="none"
            >
              <div
                style={{
                  background: colors.tooltipBg,
                  border: `1px solid ${colors.tooltipBorder}`,
                  borderRadius: 8,
                  padding: '6px 10px',
                  boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
                }}
              >
                <div
                  style={{
                    fontSize: 10,
                    color: colors.tickLabel,
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  {axis.label}
                </div>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    fontFamily: 'var(--font-mono)',
                    color: ds.color,
                  }}
                >
                  {formatValue(pt.value)}
                  {axis.max <= 100 ? '%' : ''}
                </div>
              </div>
            </foreignObject>
          );
        })()}

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
      </svg>

      {/* Legend below */}
      {polygonsData.length > 1 && (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '8px 18px',
            paddingTop: 8,
          }}
        >
          {polygonsData.map((ds) => (
            <div
              key={ds.label}
              style={{ display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: ds.color,
                  flexShrink: 0,
                }}
              />
              <span style={{ fontSize: 11, color: colors.legendText }}>
                {ds.label}
              </span>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export function RadarChart({ data, themeColor }: RadarChartProps) {
  return (
    <ChartContainer aspectRatio={1} minHeight={400}>
      {({ width, height }) => {
        const size = Math.min(width, height);
        return (
          <div style={{ position: 'relative' }}>
            <RadarChartInner
              data={data}
              width={size}
              height={size}
              themeColor={themeColor}
            />
          </div>
        );
      }}
    </ChartContainer>
  );
}

export default RadarChart;
