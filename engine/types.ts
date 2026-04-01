export interface SimulationInput {
  id: string;
  label: string;
  type: 'slider' | 'toggle' | 'select';
  min?: number;
  max?: number;
  step?: number;
  defaultValue: number | boolean | string;
  unit?: string;
  tooltip?: string;
  group?: string;
  options?: { value: string; label: string }[];
}

export interface SimulationOutput {
  id: string;
  label: string;
  value: number;
  previousValue?: number;
  unit?: string;
  direction?: 'up' | 'down' | 'neutral';
}

export interface Point {
  x: number;
  y: number;
}

export interface Series {
  id: string;
  label: string;
  color: string;
  data: Point[];
  strokeWidth?: number;
  dashed?: boolean;
  area?: boolean;
  areaOpacity?: number;
}

export interface Annotation {
  type: 'point' | 'line' | 'area' | 'label';
  x?: number;
  y?: number;
  x1?: number;
  y1?: number;
  x2?: number;
  y2?: number;
  label?: string;
  color?: string;
}

export interface ChartData {
  type: 'line' | 'area' | 'radar' | 'bar-cascade' | 'scatter';
  series: Series[];
  xLabel?: string;
  yLabel?: string;
  xDomain?: [number, number];
  yDomain?: [number, number];
  equilibrium?: Point;
  annotations?: Annotation[];
}

export interface CascadeBar {
  round: number;
  total: number;
  consumption: number;
  savings: number;
  taxes: number;
  imports: number;
  cumulative: number;
}

export interface CascadeData {
  type: 'bar-cascade';
  bars: CascadeBar[];
  asymptote: number;
  multiplier: number;
}

export interface RadarData {
  type: 'radar';
  axes: { id: string; label: string; min: number; max: number; invert?: boolean }[];
  datasets: { label: string; values: Record<string, number>; color: string; opacity?: number }[];
  idealArea: number;
  currentArea: number;
}

export interface Narration {
  observation: string;
  interpretation: string;
}

export interface Scenario {
  id: string;
  label: string;
  description: string;
  values: Record<string, number | boolean | string>;
}

export interface ModuleMeta {
  slug: string;
  title: string;
  subtitle: string;
  theme: 'micro' | 'macro' | 'monetary' | 'international' | 'inequality' | 'fiscal';
  level: 'accessible' | 'intermediate' | 'advanced';
  introduction: string;
  limites: string[];
  realite: string[];
  economists?: string[];
}

export interface ComputeResult {
  outputs: SimulationOutput[];
  chartData: ChartData | CascadeData | RadarData;
  secondaryChartData?: ChartData;
  narration: Narration;
}

export interface SimulationModule {
  meta: ModuleMeta;
  inputs: SimulationInput[];
  scenarios: Scenario[];
  compute(values: Record<string, number | boolean | string>): ComputeResult;
}
