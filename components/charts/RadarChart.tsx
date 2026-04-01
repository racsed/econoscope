'use client';

import { useMemo, useState, useCallback, useRef, useContext } from 'react';
import { motion } from 'framer-motion';
import type { RadarData } from '@/engine/types';
import { ChartContainer, useChartHeight } from './ChartContainer';
import { useChartColors } from '@/hooks/useChartColors';
import { useAnimatedPath } from '@/hooks/useAnimatedPath';
import { useAnimatedValue } from '@/hooks/useAnimatedScale';

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

/* ---------- Animated polygon ---------- */
function AnimatedPolygon({
  pathD,
  fillId,
  color,
  hasRendered,
  dsIdx,
  cx,
  cy,
}: {
  pathD: string;
  fillId: string;
  color: string;
  hasRendered: boolean;
  dsIdx: number;
  cx: number;
  cy: number;
}) {
  const animatedD = useAnimatedPath(pathD, { duration: 450 });

  if (!hasRendered) {
    return (
      <motion.path
        d={pathD}
        fill={fillId}
        stroke={color}
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
    );
  }

  return (
    <path
      d={animatedD}
      fill={fillId}
      stroke={color}
      strokeWidth={2}
      strokeLinejoin="round"
    />
  );
}

/* ---------- Animated data point ---------- */
function AnimatedDataPoint({
  targetX,
  targetY,
  color,
  tooltipBg,
  isHovered,
  hasRendered,
  delay,
}: {
  targetX: number;
  targetY: number;
  color: string;
  tooltipBg: string;
  isHovered: boolean;
  hasRendered: boolean;
  delay: number;
}) {
  const animX = useAnimatedValue(targetX, 450);
  const animY = useAnimatedValue(targetY, 450);
  const cx = hasRendered ? animX : targetX;
  const cy = hasRendered ? animY : targetY;

  return (
    <>
      <motion.circle
        cx={cx}
        cy={cy}
        r={isHovered ? 6 : 4}
        fill={color}
        stroke={tooltipBg}
        strokeWidth={2}
        initial={hasRendered ? false : { scale: 0 }}
        animate={{ scale: 1 }}
        transition={hasRendered ? undefined : { delay }}
      />
      {isHovered && (
        <motion.circle
          cx={cx}
          cy={cy}
          r={6}
          fill="none"
          stroke={color}
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
    </>
  );
}

function RadarChartInner({
  data,
  width,
  height,
  themeColor = '#5B5EF4',
}: RadarChartProps & { width: number; height: number }) {
  const cx = width / 2;
  const cy = height / 2;
  const radius = Math.min(width, height) / 2 - 75;
  const numAxes = data.axes.length;
  const angleStep = 360 / numAxes;
  const colors = useChartColors();
  const [hoveredPoint, setHoveredPoint] = useState<{
    datasetIdx: number;
    axisIdx: number;
  } | null>(null);
  const renderCountRef = useRef(0);

  renderCountRef.current += 1;
  const hasRendered = renderCountRef.current > 2;

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

  // Pre-compute polygon path strings
  const polygonPaths = useMemo(() => {
    return polygonsData.map((ds) => {
      return (
        ds.points
          .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
          .join(' ') + ' Z'
      );
    });
  }, [polygonsData]);

  const handlePointEnter = useCallback(
    (datasetIdx: number, axisIdx: number) => {
      setHoveredPoint({ datasetIdx, axisIdx });
    },
    [],
  );

  const handlePointLeave = useCallback(() => {
    setHoveredPoint(null);
  }, []);

  // Animated area percentage
  const areaPercent = data.currentArea != null && data.idealArea != null
    ? (data.currentArea / data.idealArea) * 100
    : null;

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

        {/* Data polygons - animated morphing */}
        {polygonsData.map((ds, dsIdx) => {
          return (
            <g key={ds.label}>
              <AnimatedPolygon
                pathD={polygonPaths[dsIdx]}
                fillId={`url(#radar-grad-${dsIdx})`}
                color={ds.color}
                hasRendered={hasRendered}
                dsIdx={dsIdx}
                cx={cx}
                cy={cy}
              />

              {/* Data points with hover */}
              {ds.points.map((p, i) => {
                const isHovered =
                  hoveredPoint?.datasetIdx === dsIdx &&
                  hoveredPoint?.axisIdx === i;

                return (
                  <g key={i}>
                    {/* Value label at each point */}
                    <text
                      x={p.x + (p.x > cx ? 8 : -8)}
                      y={p.y + (p.y > cy ? 14 : -8)}
                      fill={ds.color}
                      fontSize={9}
                      fontFamily="var(--font-mono)"
                      fontWeight={600}
                      textAnchor={p.x > cx ? 'start' : 'end'}
                      opacity={0.8}
                      style={{
                        transition: 'x 0.4s ease-out, y 0.4s ease-out',
                      }}
                    >
                      {formatValue(p.value)}
                    </text>

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

                    {/* Visible dot - position animates */}
                    <AnimatedDataPoint
                      targetX={p.x}
                      targetY={p.y}
                      color={ds.color}
                      tooltipBg={colors.tooltipBg}
                      isHovered={isHovered}
                      hasRendered={hasRendered}
                      delay={i * 0.05 + 0.2}
                    />
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
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
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

        {/* Area percentage indicator with animated value */}
        {areaPercent != null && (
          <AreaPercentBadge
            percent={areaPercent}
            x={width - 140}
            color={themeColor}
          />
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

/* ---------- Animated area percent badge ---------- */
function AreaPercentBadge({
  percent,
  x,
  color,
}: {
  percent: number;
  x: number;
  color: string;
}) {
  const animPercent = useAnimatedValue(percent, 400);

  return (
    <g>
      <rect
        x={x}
        y={10}
        width={130}
        height={36}
        rx={18}
        fill={color}
        opacity={0.1}
      />
      <text
        x={x + 65}
        y={33}
        fill={color}
        fontSize={13}
        fontFamily="var(--font-mono)"
        fontWeight={600}
        textAnchor="middle"
      >
        {animPercent.toFixed(1)}% ideal
      </text>
    </g>
  );
}

export function RadarChart({ data, themeColor }: RadarChartProps) {
  const contextHeight = useChartHeight();
  return (
    <ChartContainer aspectRatio={1} minHeight={400}>
      {({ width, height }) => {
        // In projection mode, constrain to square using the smaller of width and contextHeight
        const effectiveHeight = contextHeight && contextHeight > 400
          ? Math.min(width, contextHeight)
          : Math.min(width, height);
        const size = effectiveHeight;
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
