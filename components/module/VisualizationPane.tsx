'use client';

import type { ChartData, CascadeData, RadarData } from '@/engine/types';
import { LineChart } from '@/components/charts/LineChart';
import { AreaChart } from '@/components/charts/AreaChart';
import { BarCascade } from '@/components/charts/BarCascade';
import { RadarChart } from '@/components/charts/RadarChart';

interface VisualizationPaneProps {
  chartData: ChartData | CascadeData | RadarData;
  secondaryChartData?: ChartData;
  themeColor: string;
}

function renderChart(chartData: ChartData | CascadeData | RadarData, themeColor: string) {
  if (chartData.type === 'bar-cascade') {
    return <BarCascade data={chartData as CascadeData} themeColor={themeColor} />;
  }

  if (chartData.type === 'radar') {
    return <RadarChart data={chartData as RadarData} themeColor={themeColor} />;
  }

  if (chartData.type === 'area') {
    return <AreaChart data={chartData as ChartData} themeColor={themeColor} />;
  }

  return <LineChart data={chartData as ChartData} themeColor={themeColor} />;
}

export function VisualizationPane({ chartData, secondaryChartData, themeColor }: VisualizationPaneProps) {
  if (!secondaryChartData) {
    return renderChart(chartData, themeColor);
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex-1">{renderChart(chartData, themeColor)}</div>
      <div className="flex-1 border-t border-border pt-4">
        {renderChart(secondaryChartData, themeColor)}
      </div>
    </div>
  );
}

export default VisualizationPane;
