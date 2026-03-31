'use client';

import { SimulationInput } from '@/engine/types';
import { Slider } from '@/components/ui/Slider';
import { Toggle } from '@/components/ui/Toggle';

interface ControlPanelProps {
  inputs: SimulationInput[];
  values: Record<string, number | boolean | string>;
  onChange: (key: string, value: number | boolean | string) => void;
  themeColor: string;
}

export function ControlPanel({ inputs, values, onChange, themeColor }: ControlPanelProps) {
  const groups = new Map<string, SimulationInput[]>();
  for (const input of inputs) {
    const group = input.group ?? '';
    if (!groups.has(group)) groups.set(group, []);
    groups.get(group)!.push(input);
  }

  return (
    <div className="space-y-5">
      {Array.from(groups.entries()).map(([groupName, groupInputs]) => (
        <div key={groupName}>
          {groupName && (
            <h3 className="text-xs font-medium uppercase tracking-wider text-[#8888A0] mb-3">
              {groupName}
            </h3>
          )}
          <div className="space-y-4">
            {groupInputs.map((input) => {
              if (input.type === 'slider') {
                return (
                  <Slider
                    key={input.id}
                    label={input.label}
                    value={Number(values[input.id] ?? input.defaultValue)}
                    onChange={(v) => onChange(input.id, v)}
                    min={input.min ?? 0}
                    max={input.max ?? 100}
                    step={input.step ?? 1}
                    unit={input.unit}
                    color={themeColor}
                    tooltip={input.tooltip}
                  />
                );
              }

              if (input.type === 'toggle') {
                return (
                  <Toggle
                    key={input.id}
                    label={input.label}
                    checked={Boolean(values[input.id] ?? input.defaultValue)}
                    onChange={(v) => onChange(input.id, v)}
                  />
                );
              }

              return null;
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

export default ControlPanel;
