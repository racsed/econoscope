'use client';

import { useMemo } from 'react';
import { scaleLinear } from '@visx/scale';
import { LinePath, AreaClosed } from '@visx/shape';
import { AxisLeft, AxisBottom } from '@visx/axis';
import { Group } from '@visx/group';
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
  if (abs >= 1_000) return `${(value / 1_000).toFixed(0)}k`;
  return String(value);
}

function LineChartInner({
  data,
  width,
  height,
  themeColor = '#5B5EF4',
}: LineChartProps & { width: number; height: number }) {
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  const colors = useChartColors();

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

  return (
    <>
    <svg width={width} height={height}>
      {/* Y-axis label (compact, top-left) */}
      {data.yLabel && (
        <text x={4} y={margin.top - 4} fill={colors.tickLabel} fontSize={9} fontFamily="var(--font-mono)" opacity={0.7}>
          {data.yLabel}
        </text>
      )}
      <Group left={margin.left} top={margin.top}>
        {/* Grid lines */}
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
        {xScale.ticks(5).map((tick) => (
          <line
            key={`grid-x-${tick}`}
            x1={xScale(tick)}
            x2={xScale(tick)}
            y1={0}
            y2={innerHeight}
            stroke={colors.grid}
            strokeWidth={1}
          />
        ))}

        {/* Areas */}
        {data.series
          .filter((s) => s.area)
          .map((series) => (
            <AreaClosed
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

        {/* Lines with draw animation */}
        {data.series.map((series, idx) => (
          <g key={series.id}>
            {/* Glow effect under curve */}
            {!series.dashed && (
              <LinePath
                data={series.data}
                x={(d) => xScale(d.x)}
                y={(d) => yScale(d.y)}
                stroke={series.color}
                strokeWidth={8}
                strokeOpacity={0.08}
                curve={curveMonotoneX}
              />
            )}
            <motion.path
              d={
                series.data
                  .map((d, i) => {
                    const x = xScale(d.x);
                    const y = yScale(d.y);
                    // Simple curve approximation via L commands (curveMonotoneX applied by LinePath already)
                    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                  })
                  .join(' ') || 'M 0 0'
              }
              fill="none"
              stroke={series.color}
              strokeWidth={series.strokeWidth ?? 2.5}
              strokeDasharray={series.dashed ? '8,4' : undefined}
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{
                pathLength: { duration: 1.2, delay: idx * 0.2, ease: 'easeInOut' },
                opacity: { duration: 0.3, delay: idx * 0.2 },
              }}
            />
          </g>
        ))}

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
            fontSize: 11,
            fontFamily: 'var(--font-mono)',
            textAnchor: 'middle' as const,
            dy: 4,
          })}
          label={data.xLabel}
          labelProps={{
            fill: colors.tickLabel,
            fontSize: 12,
            textAnchor: 'middle',
            dy: 14,
          }}
        />
      </Group>

    </svg>
    <Legend series={data.series} colors={colors} />
    </>
  );
}

function Legend({ series, colors }: { series: ChartData['series']; colors: ReturnType<typeof useChartColors> }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '12px 20px', paddingTop: 6 }}>
      {series.map((s) => (
        <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <svg width={20} height={3}>
            <line
              x1={0} y1={1.5} x2={20} y2={1.5}
              stroke={s.color}
              strokeWidth={2.5}
              strokeDasharray={s.dashed ? '4,2' : undefined}
            />
          </svg>
          <span style={{ fontSize: 11, color: colors.legendText }}>{s.label}</span>
        </div>
      ))}
    </div>
  );
}

export function LineChart({ data, themeColor }: LineChartProps) {
  return (
    <ChartContainer>
      {({ width, height }) => (
        <LineChartInner
          data={data}
          width={width}
          height={height}
          themeColor={themeColor}
        />
      )}
    </ChartContainer>
  );
}

export default LineChart;
