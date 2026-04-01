'use client';

import { useMemo, useState, useCallback, useRef } from 'react';
import { scaleLinear } from '@visx/scale';
import { AxisLeft, AxisBottom } from '@visx/axis';
import { Group } from '@visx/group';
import { localPoint } from '@visx/event';
import { bisector } from 'd3-array';
import { line, area, curveMonotoneX } from 'd3-shape';
import { motion } from 'framer-motion';
import type { ChartData, Point } from '@/engine/types';
import { ChartContainer } from './ChartContainer';
import { EquilibriumPoint } from './EquilibriumPoint';
import { useChartColors } from '@/hooks/useChartColors';
import { useAnimatedPath } from '@/hooks/useAnimatedPath';

interface AreaChartProps {
  data: ChartData;
  themeColor?: string;
}

const margin = { top: 20, right: 30, bottom: 55, left: 60 };

function formatCompact(value: number): string {
  const abs = Math.abs(value);
  if (abs >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `${(value / 1_000).toFixed(1)}k`;
  if (abs >= 1 || abs === 0) return value.toFixed(Number.isInteger(value) ? 0 : 1);
  return value.toFixed(2);
}

const bisectX = bisector<Point, number>((d) => d.x).left;

/* ---------- Animated area fill ---------- */
function AnimatedAreaPath({
  pathString,
  fill,
  opacity,
  hasRendered,
  idx,
}: {
  pathString: string;
  fill: string;
  opacity?: number;
  hasRendered: boolean;
  idx: number;
}) {
  const animatedD = useAnimatedPath(pathString, { duration: 400 });

  if (!hasRendered) {
    return (
      <motion.path
        d={pathString}
        fill={fill}
        opacity={opacity ?? 1}
        initial={{ opacity: 0 }}
        animate={{ opacity: opacity ?? 1 }}
        transition={{ duration: 0.8, delay: idx * 0.15 }}
      />
    );
  }

  return <path d={animatedD} fill={fill} opacity={opacity ?? 1} />;
}

/* ---------- Animated line stroke ---------- */
function AnimatedLinePath({
  pathString,
  color,
  strokeWidth = 2.5,
  dashed,
  idx,
  hasRendered,
}: {
  pathString: string;
  color: string;
  strokeWidth?: number;
  dashed?: boolean;
  idx: number;
  hasRendered: boolean;
}) {
  const animatedD = useAnimatedPath(pathString, { duration: 400 });

  if (!hasRendered) {
    return (
      <motion.path
        d={pathString}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={dashed ? '6,4' : undefined}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{
          pathLength: { duration: 1.2, delay: idx * 0.15, ease: 'easeInOut' },
          opacity: { duration: 0.3, delay: idx * 0.15 },
        }}
      />
    );
  }

  return (
    <path
      d={animatedD}
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeDasharray={dashed ? '6,4' : undefined}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
}

/* ---------- Animated glow ---------- */
function AnimatedGlow({
  pathString,
  color,
  hasRendered,
}: {
  pathString: string;
  color: string;
  hasRendered: boolean;
}) {
  const animatedD = useAnimatedPath(pathString, { duration: 400 });
  const d = hasRendered ? animatedD : pathString;

  return (
    <path
      d={d}
      fill="none"
      stroke={color}
      strokeWidth={8}
      strokeOpacity={0.06}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
}

function AreaChartInner({
  data,
  width,
  height,
  themeColor = '#5B5EF4',
}: AreaChartProps & { width: number; height: number }) {
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  const colors = useChartColors();
  const [hoverX, setHoverX] = useState<number | null>(null);
  const renderCountRef = useRef(0);

  renderCountRef.current += 1;
  const hasRendered = renderCountRef.current > 2;

  const xScale = useMemo(() => {
    if (data.xDomain) {
      return scaleLinear({ domain: data.xDomain, range: [0, innerWidth] });
    }
    const allX = data.series.flatMap((s) => s.data.map((d) => d.x));
    return scaleLinear({
      domain: [Math.min(...allX), Math.max(...allX)],
      range: [0, innerWidth],
    });
  }, [data, innerWidth]);

  const yScale = useMemo(() => {
    if (data.yDomain) {
      return scaleLinear({ domain: data.yDomain, range: [innerHeight, 0] });
    }
    const allY = data.series.flatMap((s) => s.data.map((d) => d.y));
    return scaleLinear({
      domain: [0, Math.max(...allY) * 1.1],
      range: [innerHeight, 0],
      nice: true,
    });
  }, [data, innerHeight]);

  // d3 generators
  const lineGen = useMemo(
    () =>
      line<Point>()
        .x((d) => xScale(d.x) as number)
        .y((d) => yScale(d.y) as number)
        .curve(curveMonotoneX),
    [xScale, yScale],
  );

  const areaGen = useMemo(
    () =>
      area<Point>()
        .x((d) => xScale(d.x) as number)
        .y0(innerHeight)
        .y1((d) => yScale(d.y) as number)
        .curve(curveMonotoneX),
    [xScale, yScale, innerHeight],
  );

  const seriesPaths = useMemo(() => {
    return data.series.map((s) => ({
      line: lineGen(s.data) || 'M0,0',
      area: areaGen(s.data) || 'M0,0',
    }));
  }, [data.series, lineGen, areaGen]);

  const getValuesAtX = useCallback(
    (pixelX: number) => {
      const dataX = xScale.invert(pixelX);
      return data.series.map((series) => {
        const idx = bisectX(series.data, dataX, 1);
        const d0 = series.data[idx - 1];
        const d1 = series.data[idx];
        if (!d0) return { series, point: series.data[0] };
        if (!d1) return { series, point: d0 };
        const point = dataX - d0.x > d1.x - dataX ? d1 : d0;
        return { series, point };
      });
    },
    [data.series, xScale],
  );

  const handleMouseMove = useCallback(
    (event: React.MouseEvent<SVGRectElement>) => {
      const coords = localPoint(event);
      if (!coords) return;
      const x = coords.x - margin.left;
      if (x >= 0 && x <= innerWidth) {
        setHoverX(x);
      } else {
        setHoverX(null);
      }
    },
    [innerWidth],
  );

  const handleMouseLeave = useCallback(() => {
    setHoverX(null);
  }, []);

  const hoverValues = hoverX !== null ? getValuesAtX(hoverX) : null;

  return (
    <>
      <svg width={width} height={height}>
        <defs>
          {data.series.map((series) => (
            <linearGradient
              key={`area-gradient-${series.id}`}
              id={`area-gradient-${series.id}`}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="0%"
                stopColor={series.color}
                stopOpacity={series.areaOpacity ?? 0.25}
              />
              <stop offset="100%" stopColor={series.color} stopOpacity={0.02} />
            </linearGradient>
          ))}
        </defs>

        {/* Y-axis label */}
        {data.yLabel && (
          <text
            x={4}
            y={margin.top - 4}
            fill={colors.tickLabel}
            fontSize={9}
            fontFamily="var(--font-mono)"
            opacity={0.7}
          >
            {data.yLabel}
          </text>
        )}

        <Group left={margin.left} top={margin.top}>
          {/* Horizontal grid lines */}
          {yScale.ticks(5).map((tick) => (
            <line
              key={`grid-${tick}`}
              x1={0}
              x2={innerWidth}
              y1={yScale(tick)}
              y2={yScale(tick)}
              stroke={colors.grid}
              strokeWidth={1}
            />
          ))}

          {/* Annotation lines (e.g., diagonal for Lorenz) */}
          {data.annotations
            ?.filter((a) => a.type === 'line')
            .map((ann, i) => (
              <line
                key={`ann-line-${i}`}
                x1={ann.x1 != null ? xScale(ann.x1) : 0}
                y1={ann.y1 != null ? yScale(ann.y1) : innerHeight}
                x2={ann.x2 != null ? xScale(ann.x2) : innerWidth}
                y2={ann.y2 != null ? yScale(ann.y2) : 0}
                stroke={ann.color ?? colors.annotationLine}
                strokeWidth={1.5}
                strokeDasharray="6,4"
                opacity={0.7}
              />
            ))}

          {/* Area fills + lines for each series */}
          {data.series.map((series, idx) => {
            const lastPoint = series.data[series.data.length - 1];

            return (
              <g key={series.id}>
                {/* Gradient area fill - primary visual */}
                <AnimatedAreaPath
                  pathString={seriesPaths[idx].area}
                  fill={`url(#area-gradient-${series.id})`}
                  hasRendered={hasRendered}
                  idx={idx}
                />

                {/* Soft glow */}
                {!series.dashed && (
                  <AnimatedGlow
                    pathString={seriesPaths[idx].line}
                    color={series.color}
                    hasRendered={hasRendered}
                  />
                )}

                {/* Animated stroke line */}
                <AnimatedLinePath
                  pathString={seriesPaths[idx].line}
                  color={series.color}
                  strokeWidth={series.strokeWidth ?? 2.5}
                  dashed={series.dashed}
                  idx={idx}
                  hasRendered={hasRendered}
                />

                {/* End-point label */}
                {lastPoint && (
                  <text
                    x={xScale(lastPoint.x) + 6}
                    y={yScale(lastPoint.y) + 3}
                    fill={series.color}
                    fontSize={9}
                    fontFamily="var(--font-mono)"
                    fontWeight={600}
                    opacity={0.9}
                    style={{
                      transition: 'x 0.4s cubic-bezier(0.33,1,0.68,1), y 0.4s cubic-bezier(0.33,1,0.68,1)',
                    }}
                  >
                    {formatCompact(lastPoint.y)}
                  </text>
                )}
              </g>
            );
          })}

          {/* Annotation labels */}
          {data.annotations
            ?.filter((a) => a.type === 'label')
            .map((ann, i) => (
              <text
                key={`label-${i}`}
                x={ann.x != null ? xScale(ann.x) : 0}
                y={ann.y != null ? yScale(ann.y) : 0}
                fill={ann.color ?? colors.annotationLabel}
                fontSize={11}
                fontFamily="var(--font-mono)"
              >
                {ann.label}
              </text>
            ))}

          {/* Hover crosshair */}
          {hoverX !== null && (
            <>
              <line
                x1={hoverX}
                x2={hoverX}
                y1={0}
                y2={innerHeight}
                stroke={colors.tickLabel}
                strokeWidth={1}
                strokeDasharray="4,3"
                opacity={0.5}
                pointerEvents="none"
              />
              {hoverValues?.map(({ series, point }) => (
                <circle
                  key={`hover-dot-${series.id}`}
                  cx={xScale(point.x)}
                  cy={yScale(point.y)}
                  r={4}
                  fill={series.color}
                  stroke={colors.tooltipBg}
                  strokeWidth={2}
                  pointerEvents="none"
                />
              ))}
            </>
          )}

          {/* Equilibrium point */}
          {data.equilibrium && (
            <EquilibriumPoint
              cx={xScale(data.equilibrium.x) as number}
              cy={yScale(data.equilibrium.y) as number}
              color={themeColor}
              label={`(${data.equilibrium.x.toFixed(0)}, ${data.equilibrium.y.toFixed(1)})`}
            />
          )}

          {/* Axes */}
          <AxisLeft
            scale={yScale}
            numTicks={5}
            tickFormat={(v) => formatCompact(v as number)}
            stroke={colors.axis}
            tickStroke={colors.axis}
            tickLabelProps={() => ({
              fill: colors.tickLabel,
              fontSize: 10,
              fontFamily: 'var(--font-mono)',
              textAnchor: 'end' as const,
              dx: -4,
              dy: 4,
            })}
          />
          <AxisBottom
            scale={xScale}
            top={innerHeight}
            numTicks={5}
            tickFormat={(v) => formatCompact(v as number)}
            stroke={colors.axis}
            tickStroke={colors.axis}
            tickLabelProps={() => ({
              fill: colors.tickLabel,
              fontSize: 10,
              fontFamily: 'var(--font-mono)',
              textAnchor: 'middle' as const,
              dy: 4,
            })}
            label={data.xLabel}
            labelProps={{
              fill: colors.tickLabel,
              fontSize: 11,
              textAnchor: 'middle',
              dy: 14,
            }}
          />

          {/* Invisible hit area for hover */}
          <rect
            x={0}
            y={0}
            width={innerWidth}
            height={innerHeight}
            fill="transparent"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          />
        </Group>
      </svg>

      {/* Tooltip card with glass-morphism */}
      {hoverX !== null && hoverValues && (
        <div
          style={{
            position: 'absolute',
            top: margin.top + 8,
            left:
              hoverX + margin.left + 180 > width
                ? hoverX + margin.left - 170
                : hoverX + margin.left + 14,
            transition: 'left 0.08s ease-out, top 0.08s ease-out',
            background: colors.tooltipBg,
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: `1px solid ${colors.tooltipBorder}`,
            borderRadius: 8,
            padding: '8px 12px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
            pointerEvents: 'none' as const,
            zIndex: 10,
            minWidth: 120,
          }}
        >
          <div
            style={{
              fontSize: 10,
              fontFamily: 'var(--font-mono)',
              color: colors.tickLabel,
              marginBottom: 4,
              borderBottom: `1px solid ${colors.tooltipBorder}`,
              paddingBottom: 4,
            }}
          >
            {data.xLabel ? `${data.xLabel}: ` : ''}
            {formatCompact(hoverValues[0]?.point.x ?? 0)}
          </div>
          {hoverValues.map(({ series, point }) => (
            <div
              key={series.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '2px 0',
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: series.color,
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontSize: 11,
                  color: colors.legendText,
                  flex: 1,
                }}
              >
                {series.label}
              </span>
              <span
                style={{
                  fontSize: 11,
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 600,
                  color: series.color,
                }}
              >
                {point.y.toFixed(1)}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Legend */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '8px 18px',
          paddingTop: 8,
        }}
      >
        {data.series.map((s) => (
          <div
            key={s.id}
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: s.color,
                flexShrink: 0,
              }}
            />
            <span style={{ fontSize: 11, color: colors.legendText }}>
              {s.label}
            </span>
          </div>
        ))}
      </div>
    </>
  );
}

export function AreaChart({ data, themeColor }: AreaChartProps) {
  return (
    <ChartContainer>
      {({ width, height }) => (
        <div style={{ position: 'relative' }}>
          <AreaChartInner
            data={data}
            width={width}
            height={height}
            themeColor={themeColor}
          />
        </div>
      )}
    </ChartContainer>
  );
}

export default AreaChart;
