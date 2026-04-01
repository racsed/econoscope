'use client';

import { useMemo, useState, useCallback } from 'react';
import { scaleLinear } from '@visx/scale';
import { LinePath, AreaClosed } from '@visx/shape';
import { AxisLeft, AxisBottom } from '@visx/axis';
import { Group } from '@visx/group';
import { localPoint } from '@visx/event';
import { bisector } from 'd3-array';
import { curveMonotoneX } from 'd3-shape';
import { motion } from 'framer-motion';
import type { ChartData, Point } from '@/engine/types';
import { ChartContainer } from './ChartContainer';
import { EquilibriumPoint } from './EquilibriumPoint';
import { useChartColors } from '@/hooks/useChartColors';

interface LineChartProps {
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

function LineChartInner({
  data,
  width,
  height,
  themeColor = '#5B5EF4',
}: LineChartProps & { width: number; height: number }) {
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  const colors = useChartColors();
  const [hoverX, setHoverX] = useState<number | null>(null);

  const xScale = useMemo(() => {
    if (data.xDomain) {
      return scaleLinear({ domain: data.xDomain, range: [0, innerWidth] });
    }
    const allX = data.series.flatMap((s) => s.data.map((d) => d.x));
    return scaleLinear({
      domain: [Math.min(...allX), Math.max(...allX)],
      range: [0, innerWidth],
      nice: true,
    });
  }, [data, innerWidth]);

  const yScale = useMemo(() => {
    if (data.yDomain) {
      return scaleLinear({ domain: data.yDomain, range: [innerHeight, 0] });
    }
    const allY = data.series.flatMap((s) => s.data.map((d) => d.y));
    return scaleLinear({
      domain: [Math.min(0, Math.min(...allY)), Math.max(...allY) * 1.1],
      range: [innerHeight, 0],
      nice: true,
    });
  }, [data, innerHeight]);

  // Find nearest data points at a given pixel X
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
          {data.series
            .filter((s) => !s.dashed)
            .map((series) => (
              <linearGradient
                key={`gradient-${series.id}`}
                id={`line-gradient-${series.id}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor={series.color} stopOpacity={0.15} />
                <stop offset="100%" stopColor={series.color} stopOpacity={0} />
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
          {/* Horizontal grid lines only */}
          {yScale.ticks(5).map((tick) => (
            <line
              key={`grid-y-${tick}`}
              x1={0}
              x2={innerWidth}
              y1={yScale(tick)}
              y2={yScale(tick)}
              stroke={colors.grid}
              strokeWidth={1}
            />
          ))}

          {/* Gradient area fills under non-dashed curves */}
          {data.series
            .filter((s) => !s.dashed)
            .map((series) => (
              <AreaClosed<Point>
                key={`area-fill-${series.id}`}
                data={series.data}
                x={(d) => xScale(d.x)}
                y={(d) => yScale(d.y)}
                yScale={yScale}
                curve={curveMonotoneX}
                fill={`url(#line-gradient-${series.id})`}
              />
            ))}

          {/* Explicit area series (if flagged) */}
          {data.series
            .filter((s) => s.area)
            .map((series) => (
              <AreaClosed<Point>
                key={`area-${series.id}`}
                data={series.data}
                x={(d) => xScale(d.x)}
                y={(d) => yScale(d.y)}
                yScale={yScale}
                curve={curveMonotoneX}
                fill={series.color}
                opacity={series.areaOpacity ?? 0.15}
              />
            ))}

          {/* Annotations - areas */}
          {data.annotations
            ?.filter((a) => a.type === 'area')
            .map((ann, i) => {
              if (
                ann.x1 == null ||
                ann.y1 == null ||
                ann.x2 == null ||
                ann.y2 == null
              )
                return null;
              return (
                <rect
                  key={`ann-area-${i}`}
                  x={xScale(Math.min(ann.x1, ann.x2))}
                  y={yScale(Math.max(ann.y1, ann.y2))}
                  width={Math.abs(xScale(ann.x2) - xScale(ann.x1))}
                  height={Math.abs(yScale(ann.y2) - yScale(ann.y1))}
                  fill={ann.color ?? themeColor}
                  opacity={0.15}
                  rx={2}
                />
              );
            })}

          {/* Lines with draw animation + glow */}
          {data.series.map((series, idx) => {
            // Build a smooth path with curveMonotoneX via d3
            const pathData =
              series.data
                .map((d, i) => {
                  const px = xScale(d.x);
                  const py = yScale(d.y);
                  return `${i === 0 ? 'M' : 'L'} ${px} ${py}`;
                })
                .join(' ') || 'M 0 0';

            const lastPoint = series.data[series.data.length - 1];

            return (
              <g key={series.id}>
                {/* Soft glow under curve */}
                {!series.dashed && (
                  <LinePath<Point>
                    data={series.data}
                    x={(d) => xScale(d.x)}
                    y={(d) => yScale(d.y)}
                    stroke={series.color}
                    strokeWidth={10}
                    strokeOpacity={0.06}
                    curve={curveMonotoneX}
                  />
                )}

                {/* Animated line */}
                <motion.path
                  d={pathData}
                  fill="none"
                  stroke={series.color}
                  strokeWidth={series.strokeWidth ?? 2.5}
                  strokeDasharray={series.dashed ? '8,4' : undefined}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{
                    pathLength: {
                      duration: 1.2,
                      delay: idx * 0.15,
                      ease: 'easeInOut',
                    },
                    opacity: { duration: 0.3, delay: idx * 0.15 },
                  }}
                />

                {/* End-point label */}
                {lastPoint && (
                  <motion.text
                    x={xScale(lastPoint.x) + 6}
                    y={yScale(lastPoint.y) + 3}
                    fill={series.color}
                    fontSize={9}
                    fontFamily="var(--font-mono)"
                    fontWeight={600}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.9 }}
                    transition={{ delay: idx * 0.15 + 1.2 }}
                  >
                    {formatCompact(lastPoint.y)}
                  </motion.text>
                )}
              </g>
            );
          })}

          {/* Annotations - lines */}
          {data.annotations
            ?.filter((a) => a.type === 'line')
            .map((ann, i) => (
              <line
                key={`ann-line-${i}`}
                x1={ann.x1 != null ? xScale(ann.x1) : 0}
                y1={ann.y1 != null ? yScale(ann.y1) : 0}
                x2={ann.x2 != null ? xScale(ann.x2) : innerWidth}
                y2={ann.y2 != null ? yScale(ann.y2) : innerHeight}
                stroke={ann.color ?? colors.annotationLine}
                strokeWidth={1}
                strokeDasharray="6,3"
              />
            ))}

          {/* Annotations - labels */}
          {data.annotations
            ?.filter((a) => a.type === 'label')
            .map((ann, i) => (
              <text
                key={`ann-label-${i}`}
                x={ann.x != null ? xScale(ann.x) : 0}
                y={ann.y != null ? yScale(ann.y) : 0}
                fill={ann.color ?? colors.annotationLabel}
                fontSize={11}
                fontFamily="var(--font-mono)"
              >
                {ann.label}
              </text>
            ))}

          {/* Equilibrium point */}
          {data.equilibrium && (
            <EquilibriumPoint
              cx={xScale(data.equilibrium.x)}
              cy={yScale(data.equilibrium.y)}
              color={themeColor}
              label={`(${data.equilibrium.x.toFixed(0)}, ${data.equilibrium.y.toFixed(1)})`}
            />
          )}

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
              {/* Hover dots on each series */}
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

      {/* Tooltip card */}
      {hoverX !== null && hoverValues && (
        <div
          style={{
            position: 'absolute',
            top: margin.top + 8,
            left:
              hoverX + margin.left + 180 > width
                ? hoverX + margin.left - 170
                : hoverX + margin.left + 14,
            background: colors.tooltipBg,
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
      <Legend series={data.series} colors={colors} />
    </>
  );
}

function Legend({
  series,
  colors,
}: {
  series: ChartData['series'];
  colors: ReturnType<typeof useChartColors>;
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '8px 18px',
        paddingTop: 8,
      }}
    >
      {series.map((s) => (
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
              opacity: s.dashed ? 0.5 : 1,
              border: s.dashed ? `2px dashed ${s.color}` : 'none',
              flexShrink: 0,
            }}
          />
          <span style={{ fontSize: 11, color: colors.legendText }}>
            {s.label}
          </span>
        </div>
      ))}
    </div>
  );
}

export function LineChart({ data, themeColor }: LineChartProps) {
  return (
    <ChartContainer>
      {({ width, height }) => (
        <div style={{ position: 'relative' }}>
          <LineChartInner
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

export default LineChart;
