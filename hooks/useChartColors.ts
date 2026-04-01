'use client';

import { useTheme } from '@/components/layout/ThemeProvider';

export function useChartColors() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return {
    // Grid lines - more visible
    grid: isDark ? '#2D3044' : '#E2E4E9',
    // Axis lines - stronger
    axis: isDark ? '#4A4E66' : '#94A3B8',
    // Tick labels - readable
    tickLabel: isDark ? '#7882A0' : '#64748B',
    // Legend text
    legendText: isDark ? '#9096A8' : '#475569',
    // Annotations
    annotationLine: isDark ? '#6E78A0' : '#94A3B8',
    annotationLabel: isDark ? '#7882A0' : '#64748B',
    // Equilibrium
    equilibriumDot: '#FFFFFF',
    // Radar
    radarRing: isDark ? '#2D3044' : '#E2E4E9',
    radarAxis: isDark ? '#3D4156' : '#CBD5E1',
    // Tooltip
    tooltipBg: isDark ? '#1E2130' : '#FFFFFF',
    tooltipBorder: isDark ? '#2D3044' : '#E2E4E9',
  };
}
