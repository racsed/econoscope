'use client';

import type { ChartData, CascadeData, RadarData } from '@/engine/types';
import { LineChart } from '@/components/charts/LineChart';
import { AreaChart } from '@/components/charts/AreaChart';
import { BarCascade } from '@/components/charts/BarCascade';
import { RadarChart } from '@/components/charts/RadarChart';

interface VisualizationPaneProps {
  chartData: ChartData | CascadeData | RadarData;
  themeColor: string;
}

export function VisualizationPane({ chartData, themeColor }: VisualizationPaneProps) {
  if (chartData.type === 'bar-cascade') {
    return <BarCascade data={chartData as CascadeData} themeColor={themeColor} />;
  }

  if (chartData.type === 'radar') {
    return <RadarChart data={chartData as RadarData} themeColor={themeColor} />;
  }

  if (chartData.type === 'area') {
    return <AreaChart data={chartData as ChartData} themeColor={themeColor} />;
  }

  // Default: line chart (handles 'line' and 'scatter')
  return <LineChart data={chartData as ChartData} themeColor={themeColor} />;
}

export default VisualizationPane;
