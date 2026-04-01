'use client';

import type { ChartData, CascadeData, RadarData } from '@/engine/types';
import { LineChart } from '@/components/charts/LineChart';
import { AreaChart } from '@/components/charts/AreaChart';
import { BarCascade } from '@/components/charts/BarCascade';
import { RadarChart } from '@/components/charts/RadarChart';
import { ChartHeightProvider, useChartHeight } from '@/components/charts/ChartContainer';

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

function DualChartLayout({
  chartData,
  secondaryChartData,
  themeColor,
}: {
  chartData: ChartData | CascadeData | RadarData;
  secondaryChartData: ChartData;
  themeColor: string;
}) {
  const contextHeight = useChartHeight();

  // In projection mode, split the available height between the two charts
  if (contextHeight && contextHeight > 200) {
    const halfHeight = Math.floor(contextHeight / 2 - 10);
    return (
      <div className="flex flex-col gap-3 w-full h-full">
        <div style={{ flex: 1, minHeight: 200 }}>
          <ChartHeightProvider height={halfHeight}>
            {renderChart(chartData, themeColor)}
          </ChartHeightProvider>
        </div>
        <div className="border-t border-border pt-3" style={{ flex: 1, minHeight: 200 }}>
          <ChartHeightProvider height={halfHeight}>
            {renderChart(secondaryChartData, themeColor)}
          </ChartHeightProvider>
        </div>
      </div>
    );
  }

  // Normal mode
  return (
    <div className="flex flex-col gap-3 w-full h-full">
      <div style={{ maxHeight: '50%', minHeight: 200 }}>
        {renderChart(chartData, themeColor)}
      </div>
      <div className="border-t border-border pt-3" style={{ maxHeight: '50%', minHeight: 200 }}>
        {renderChart(secondaryChartData, themeColor)}
      </div>
    </div>
  );
}

export function VisualizationPane({ chartData, secondaryChartData, themeColor }: VisualizationPaneProps) {
  if (!secondaryChartData) {
    return renderChart(chartData, themeColor);
  }

  return (
    <DualChartLayout
      chartData={chartData}
      secondaryChartData={secondaryChartData}
      themeColor={themeColor}
    />
  );
}

export default VisualizationPane;
