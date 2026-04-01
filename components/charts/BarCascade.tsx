'use client';

import { useMemo, useState, useCallback } from 'react';
import { scaleLinear, scaleBand } from '@visx/scale';
import { Group } from '@visx/group';
import { AxisLeft, AxisBottom } from '@visx/axis';
import { AreaClosed } from '@visx/shape';
import { localPoint } from '@visx/event';
import { curveMonotoneX } from 'd3-shape';
import { motion } from 'framer-motion';
import type { CascadeData, CascadeBar } from '@/engine/types';
import { ChartContainer } from './ChartContainer';
import { useChartColors } from '@/hooks/useChartColors';

interface BarCascadeProps {
  data: CascadeData;
  themeColor?: string;
}

const margin = { top: 35, right: 30, bottom: 55, left: 65 };

function formatCompact(value: number): string {
  const abs = Math.abs(value);
  if (abs >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `${(value / 1_000).toFixed(1)}k`;
  if (abs >= 1 || abs === 0) return value.toFixed(Number.isInteger(value) ? 0 : 1);
  return value.toFixed(2);
}

const CUMULATIVE_COLOR = '#22D3EE';

function BarCascadeInner({
  data,
  width,
  height,
  themeColor = '#5B5EF4',
}: BarCascadeProps & { width: number; height: number }) {
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  const colors = useChartColors();
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  const xScale = useMemo(
    () =>
      scaleBand({
        domain: data.bars.map((b) => String(b.round)),
        range: [0, innerWidth],
        padding: 0.3,
      }),
    [data.bars, innerWidth],
  );

  const yScale = useMemo(
    () =>
      scaleLinear({
        domain: [0, data.asymptote * 1.15],
        range: [innerHeight, 0],
        nice: true,
      }),
    [data.asymptote, innerHeight],
  );

  // Build cumulative area points for gradient fill
  const cumulativePoints = useMemo(
    () =>
      data.bars.map((bar) => ({
        x: (xScale(String(bar.round)) ?? 0) + xScale.bandwidth() / 2,
        y: bar.cumulative,
      })),
    [data.bars, xScale],
  );

  const handleBarEnter = useCallback((round: number) => {
    setHoveredBar(round);
  }, []);

  const handleBarLeave = useCallback(() => {
    setHoveredBar(null);
  }, []);

  const hoveredBarData = hoveredBar !== null
    ? data.bars.find((b) => b.round === hoveredBar)
    : null;

  return (
    <>
      <svg width={width} height={height}>
        <defs>
          {/* Bar gradient */}
          <linearGradient id="bar-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={themeColor} stopOpacity={0.95} />
            <stop offset="100%" stopColor={themeColor} stopOpacity={0.6} />
          </linearGradient>
          {/* Cumulative area gradient */}
          <linearGradient id="cumulative-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={CUMULATIVE_COLOR} stopOpacity={0.15} />
            <stop offset="100%" stopColor={CUMULATIVE_COLOR} stopOpacity={0} />
          </linearGradient>
        </defs>

        <Group left={margin.left} top={margin.top}>
          {/* Horizontal grid lines only */}
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

          {/* Cumulative area fill */}
          {cumulativePoints.length > 1 && (
            <AreaClosed
              data={cumulativePoints}
              x={(d) => d.x}
              y={(d) => yScale(d.y)}
              yScale={yScale}
              curve={curveMonotoneX}
              fill="url(#cumulative-grad)"
            />
          )}

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
            animate={{ opacity: 0.5 }}
            transition={{ delay: 0.8 }}
          />
          <motion.text
            x={innerWidth - 4}
            y={yScale(data.asymptote) - 8}
            fill={themeColor}
            fontSize={10}
            fontFamily="var(--font-mono)"
            fontWeight={600}
            textAnchor="end"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            transition={{ delay: 1 }}
          >
            Total: {formatCompact(data.asymptote)}
          </motion.text>

          {/* Bars with gradient fill */}
          {data.bars.map((bar, i) => {
            const barWidth = xScale.bandwidth();
            const barHeight = innerHeight - yScale(bar.total);
            const x = xScale(String(bar.round)) ?? 0;
            const y = yScale(bar.total);
            const isHovered = hoveredBar === bar.round;

            return (
              <g key={bar.round}>
                <motion.rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={Math.max(0, barHeight)}
                  rx={3}
                  fill="url(#bar-grad)"
                  opacity={isHovered ? 1 : 0.85}
                  initial={{ y: innerHeight, height: 0, opacity: 0 }}
                  animate={{
                    y,
                    height: Math.max(0, barHeight),
                    opacity: isHovered ? 1 : 0.85,
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 120,
                    damping: 18,
                    delay: i * 0.06,
                  }}
                  onMouseEnter={() => handleBarEnter(bar.round)}
                  onMouseLeave={handleBarLeave}
                  style={{ cursor: 'pointer' }}
                />
                {/* Value label on top */}
                <motion.text
                  x={x + barWidth / 2}
                  y={y - 6}
                  fill={colors.tickLabel}
                  fontSize={9}
                  fontFamily="var(--font-mono)"
                  fontWeight={500}
                  textAnchor="middle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.8 }}
                  transition={{ delay: i * 0.06 + 0.4 }}
                >
                  {formatCompact(bar.total)}
                </motion.text>
              </g>
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
            stroke={CUMULATIVE_COLOR}
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
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
                r={3.5}
                fill={CUMULATIVE_COLOR}
                stroke={colors.tooltipBg}
                strokeWidth={2}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.06 + 0.3 }}
              />
            );
          })}

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
            stroke={colors.axis}
            tickStroke={colors.axis}
            tickLabelProps={() => ({
              fill: colors.tickLabel,
              fontSize: 10,
              fontFamily: 'var(--font-mono)',
              textAnchor: 'middle' as const,
              dy: 4,
            })}
            label="Tour"
            labelProps={{
              fill: colors.tickLabel,
              fontSize: 11,
              textAnchor: 'middle',
              dy: 14,
            }}
          />
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

      {/* Tooltip on bar hover */}
      {hoveredBarData && (() => {
        const barX = (xScale(String(hoveredBarData.round)) ?? 0) + margin.left;
        const tooltipLeft = barX + xScale.bandwidth() + 12;
        const flipLeft = tooltipLeft + 180 > width;
        return (
          <div
            style={{
              position: 'absolute',
              top: margin.top + 30,
              left: flipLeft ? barX - 175 : tooltipLeft,
              background: colors.tooltipBg,
              border: `1px solid ${colors.tooltipBorder}`,
              borderRadius: 8,
              padding: '8px 12px',
              boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
              pointerEvents: 'none',
              zIndex: 10,
              minWidth: 150,
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
              Tour {hoveredBarData.round}
            </div>
            {[
              { label: 'Consommation', value: hoveredBarData.consumption, color: themeColor },
              { label: 'Epargne', value: hoveredBarData.savings, color: '#F59E0B' },
              { label: 'Taxes', value: hoveredBarData.taxes, color: '#EF4444' },
              { label: 'Imports', value: hoveredBarData.imports, color: '#8B5CF6' },
            ].map((row) => (
              <div
                key={row.label}
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
                    background: row.color,
                    flexShrink: 0,
                  }}
                />
                <span style={{ fontSize: 11, color: colors.legendText, flex: 1 }}>
                  {row.label}
                </span>
                <span
                  style={{
                    fontSize: 11,
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 600,
                    color: colors.legendText,
                  }}
                >
                  {row.value.toFixed(1)}
                </span>
              </div>
            ))}
            <div
              style={{
                borderTop: `1px solid ${colors.tooltipBorder}`,
                marginTop: 4,
                paddingTop: 4,
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: 11,
                fontFamily: 'var(--font-mono)',
                fontWeight: 600,
              }}
            >
              <span style={{ color: colors.legendText }}>Cumulatif</span>
              <span style={{ color: CUMULATIVE_COLOR }}>
                {formatCompact(hoveredBarData.cumulative)}
              </span>
            </div>
          </div>
        );
      })()}

      {/* Legend below chart */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '8px 18px',
          paddingTop: 8,
        }}
      >
        {[
          { label: 'Effet par tour', color: themeColor },
          { label: 'Cumulatif', color: CUMULATIVE_COLOR },
        ].map((item) => (
          <div
            key={item.label}
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: item.color,
                flexShrink: 0,
              }}
            />
            <span style={{ fontSize: 11, color: colors.legendText }}>
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </>
  );
}

export function BarCascade({ data, themeColor }: BarCascadeProps) {
  return (
    <ChartContainer minHeight={380}>
      {({ width, height }) => (
        <div style={{ position: 'relative' }}>
          <BarCascadeInner
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

export default BarCascade;
