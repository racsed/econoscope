'use client';

import { useMemo } from 'react';
import { scaleLinear, scaleBand } from '@visx/scale';
import { Group } from '@visx/group';
import { AxisLeft, AxisBottom } from '@visx/axis';
import { motion } from 'framer-motion';
import type { CascadeData } from '@/engine/types';
import { ChartContainer } from './ChartContainer';

interface BarCascadeProps {
  data: CascadeData;
  themeColor?: string;
}

const margin = { top: 30, right: 30, bottom: 50, left: 70 };

function BarCascadeInner({
  data,
  width,
  height,
  themeColor = '#5B5EF4',
}: BarCascadeProps & { width: number; height: number }) {
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const xScale = useMemo(
    () =>
      scaleBand({
        domain: data.bars.map((b) => String(b.round)),
        range: [0, innerWidth],
        padding: 0.3,
      }),
    [data.bars, innerWidth]
  );

  const yScale = useMemo(
    () =>
      scaleLinear({
        domain: [0, data.asymptote * 1.15],
        range: [innerHeight, 0],
        nice: true,
      }),
    [data.asymptote, innerHeight]
  );

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

        {/* Asymptote line */}
        <motion.line
          x1={0}
          x2={innerWidth}
          y1={yScale(data.asymptote)}
          y2={yScale(data.asymptote)}
          stroke={themeColor}
          strokeWidth={1.5}
          strokeDasharray="8,4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 0.8 }}
        />
        <motion.text
          x={innerWidth - 4}
          y={yScale(data.asymptote) - 8}
          fill={themeColor}
          fontSize={11}
          fontFamily="var(--font-mono)"
          textAnchor="end"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          transition={{ delay: 1 }}
        >
          Total: {data.asymptote.toFixed(1)}
        </motion.text>

        {/* Bars */}
        {data.bars.map((bar, i) => {
          const barWidth = xScale.bandwidth();
          const barHeight = innerHeight - yScale(bar.total);
          const x = xScale(String(bar.round)) ?? 0;
          const y = yScale(bar.total);

          return (
            <motion.rect
              key={bar.round}
              x={x}
              y={y}
              width={barWidth}
              height={Math.max(0, barHeight)}
              rx={3}
              fill={themeColor}
              initial={{ y: innerHeight, height: 0, opacity: 0 }}
              animate={{ y, height: Math.max(0, barHeight), opacity: 0.85 }}
              transition={{
                type: 'spring',
                stiffness: 120,
                damping: 18,
                delay: i * 0.08,
              }}
            />
          );
        })}

        {/* Cumulative line */}
        <motion.path
          d={data.bars
            .map((bar, i) => {
              const x =
                (xScale(String(bar.round)) ?? 0) + xScale.bandwidth() / 2;
              const y = yScale(bar.cumulative);
              return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
            })
            .join(' ')}
          fill="none"
          stroke="#22D3EE"
          strokeWidth={2.5}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.3, ease: 'easeOut' }}
        />

        {/* Cumulative dots */}
        {data.bars.map((bar, i) => {
          const x =
            (xScale(String(bar.round)) ?? 0) + xScale.bandwidth() / 2;
          const y = yScale(bar.cumulative);
          return (
            <motion.circle
              key={`dot-${bar.round}`}
              cx={x}
              cy={y}
              r={3}
              fill="#22D3EE"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.08 + 0.3 }}
            />
          );
        })}

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
        />
        <AxisBottom
          scale={xScale}
          top={innerHeight}
          stroke="#CBD5E1"
          tickStroke="#CBD5E1"
          tickLabelProps={() => ({
            fill: '#9CA3B4',
            fontSize: 10,
            fontFamily: 'var(--font-mono)',
            textAnchor: 'middle' as const,
            dy: 4,
          })}
          label="Tour"
          labelProps={{
            fill: '#9CA3B4',
            fontSize: 12,
            textAnchor: 'middle',
            dy: 14,
          }}
        />

        {/* Legend */}
        <g transform={`translate(${innerWidth - 180}, -10)`}>
          <rect width={8} height={8} rx={2} fill={themeColor} opacity={0.85} />
          <text x={14} y={8} fill="#5F6980" fontSize={10}>
            Effet par tour
          </text>
          <line x1={80} y1={4} x2={100} y2={4} stroke="#22D3EE" strokeWidth={2} />
          <circle cx={90} cy={4} r={2.5} fill="#22D3EE" />
          <text x={106} y={8} fill="#5F6980" fontSize={10}>
            Cumulatif
          </text>
        </g>
      </Group>

      {/* Multiplier badge */}
      <motion.g
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <rect
          x={margin.left}
          y={4}
          width={130}
          height={22}
          rx={11}
          fill={themeColor}
          opacity={0.1}
        />
        <text
          x={margin.left + 65}
          y={18}
          fill={themeColor}
          fontSize={11}
          fontFamily="var(--font-mono)"
          fontWeight={600}
          textAnchor="middle"
        >
          k = {data.multiplier.toFixed(2)}
        </text>
      </motion.g>
    </svg>
  );
}

export function BarCascade({ data, themeColor }: BarCascadeProps) {
  return (
    <ChartContainer minHeight={380}>
      {({ width, height }) => (
        <BarCascadeInner
          data={data}
          width={width}
          height={height}
          themeColor={themeColor}
        />
      )}
    </ChartContainer>
  );
}

export default BarCascade;
