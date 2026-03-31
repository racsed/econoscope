'use client';

import { useMemo } from 'react';
import { scaleLinear } from '@visx/scale';
import { AreaClosed, LinePath } from '@visx/shape';
import { AxisLeft, AxisBottom } from '@visx/axis';
import { Group } from '@visx/group';
import { curveMonotoneX } from 'd3-shape';
import { motion } from 'framer-motion';
import type { ChartData, Point } from '@/engine/types';
import { ChartContainer } from './ChartContainer';

interface AreaChartProps {
  data: ChartData;
  themeColor?: string;
}

const margin = { top: 20, right: 30, bottom: 50, left: 60 };

function AreaChartInner({
  data,
  width,
  height,
  themeColor = '#5B5EF4',
}: AreaChartProps & { width: number; height: number }) {
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

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

  return (
    <svg width={width} height={height}>
      <Group left={margin.left} top={margin.top}>
        {/* Grid */}
        {yScale.ticks(5).map((tick) => (
          <line
            key={`grid-${tick}`}
            x1={0}
            x2={innerWidth}
            y1={yScale(tick)}
            y2={yScale(tick)}
            stroke="#F1F3F5"
            strokeWidth={1}
          />
        ))}

        {/* Diagonal (for Lorenz) */}
        {data.annotations
          ?.filter((a) => a.type === 'line')
          .map((ann, i) => (
            <line
              key={`ann-line-${i}`}
              x1={ann.x1 != null ? xScale(ann.x1) : 0}
              y1={ann.y1 != null ? yScale(ann.y1) : innerHeight}
              x2={ann.x2 != null ? xScale(ann.x2) : innerWidth}
              y2={ann.y2 != null ? yScale(ann.y2) : 0}
              stroke={ann.color ?? '#CBD5E1'}
              strokeWidth={1.5}
              strokeDasharray="6,4"
            />
          ))}

        {/* Areas */}
        {data.series.map((series) => (
          <motion.g
            key={series.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <AreaClosed
              data={series.data}
              x={(d) => xScale(d.x)}
              y={(d) => yScale(d.y)}
              yScale={yScale}
              curve={curveMonotoneX}
              fill={series.color}
              fillOpacity={series.areaOpacity ?? 0.2}
            />
            <LinePath
              data={series.data}
              x={(d) => xScale(d.x)}
              y={(d) => yScale(d.y)}
              stroke={series.color}
              strokeWidth={series.strokeWidth ?? 2.5}
              strokeDasharray={series.dashed ? '6,4' : undefined}
              curve={curveMonotoneX}
            />
          </motion.g>
        ))}

        {/* Annotation labels */}
        {data.annotations
          ?.filter((a) => a.type === 'label')
          .map((ann, i) => (
            <text
              key={`label-${i}`}
              x={ann.x != null ? xScale(ann.x) : 0}
              y={ann.y != null ? yScale(ann.y) : 0}
              fill={ann.color ?? '#9CA3B4'}
              fontSize={11}
              fontFamily="var(--font-mono)"
            >
              {ann.label}
            </text>
          ))}

        {/* Axes */}
        <AxisLeft
          scale={yScale}
          numTicks={5}
          stroke="#CBD5E1"
          tickStroke="#CBD5E1"
          tickLabelProps={() => ({
            fill: '#9CA3B4',
            fontSize: 11,
            fontFamily: 'var(--font-mono)',
            textAnchor: 'end' as const,
            dx: -4,
            dy: 4,
          })}
          label={data.yLabel}
          labelProps={{
            fill: '#9CA3B4',
            fontSize: 12,
            textAnchor: 'middle',
          }}
        />
        <AxisBottom
          scale={xScale}
          top={innerHeight}
          numTicks={5}
          stroke="#CBD5E1"
          tickStroke="#CBD5E1"
          tickLabelProps={() => ({
            fill: '#9CA3B4',
            fontSize: 11,
            fontFamily: 'var(--font-mono)',
            textAnchor: 'middle' as const,
            dy: 4,
          })}
          label={data.xLabel}
          labelProps={{
            fill: '#9CA3B4',
            fontSize: 12,
            textAnchor: 'middle',
            dy: 14,
          }}
        />
      </Group>

      {/* Legend */}
      <Group left={margin.left + 10} top={margin.top + 5}>
        {data.series.map((series, i) => (
          <g key={series.id} transform={`translate(0, ${i * 20})`}>
            <rect width={14} height={10} rx={2} fill={series.color} opacity={0.4} />
            <text x={20} y={9} fill="#5F6980" fontSize={11}>
              {series.label}
            </text>
          </g>
        ))}
      </Group>
    </svg>
  );
}

export function AreaChart({ data, themeColor }: AreaChartProps) {
  return (
    <ChartContainer>
      {({ width, height }) => (
        <AreaChartInner data={data} width={width} height={height} themeColor={themeColor} />
      )}
    </ChartContainer>
  );
}

export default AreaChart;
