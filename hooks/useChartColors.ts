'use client';

import { useTheme } from '@/components/layout/ThemeProvider';

export function useChartColors() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return {
    grid: isDark ? '#232638' : '#F1F3F5',
    axis: isDark ? '#3D4156' : '#CBD5E1',
    tickLabel: isDark ? '#5E6478' : '#9CA3B4',
    legendText: isDark ? '#9096A8' : '#5F6980',
    annotationLine: isDark ? '#5E6478' : '#9CA3B4',
    annotationLabel: isDark ? '#5E6478' : '#9CA3B4',
    equilibriumDot: '#FFFFFF',
    radarRing: isDark ? '#2D3044' : '#F1F3F5',
    radarAxis: isDark ? '#2D3044' : '#E2E4E9',
    tooltipBg: isDark ? '#1E2130' : '#FFFFFF',
    tooltipBorder: isDark ? '#2D3044' : '#E2E4E9',
  };
}
