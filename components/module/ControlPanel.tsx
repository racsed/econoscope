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
            <h3 className="text-xs font-medium uppercase tracking-wider text-text-secondary mb-3">
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
                const currentVal = values[input.id] ?? input.defaultValue;

                // Toggle with string options (e.g., 'concurrence'/'monopole')
                if (input.options && input.options.length === 2) {
                  const isSecond = currentVal === input.options[1].value;
                  return (
                    <Toggle
                      key={input.id}
                      label={input.label}
                      checked={isSecond}
                      onChange={(checked) =>
                        onChange(input.id, checked ? input.options![1].value : input.options![0].value)
                      }
                      options={[input.options[0].label, input.options[1].label]}
                    />
                  );
                }

                // Simple boolean toggle
                return (
                  <Toggle
                    key={input.id}
                    label={input.label}
                    checked={Boolean(currentVal)}
                    onChange={(v) => onChange(input.id, v)}
                  />
                );
              }

              if (input.type === 'select' && input.options) {
                const currentVal = String(values[input.id] ?? input.defaultValue);
                return (
                  <div key={input.id} className="flex flex-col gap-1.5">
                    <span className="text-sm text-text-secondary truncate">{input.label}</span>
                    <select
                      value={currentVal}
                      onChange={(e) => onChange(input.id, e.target.value)}
                      className="w-full min-w-[140px] px-3 py-2 text-sm rounded-lg border border-border bg-bg-card text-text-primary focus:outline-none focus:border-accent-indigo/50 transition-colors appearance-none cursor-pointer"
                      style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 12 12\'%3E%3Cpath d=\'M3 5l3 3 3-3\' fill=\'none\' stroke=\'%239CA3B4\' stroke-width=\'1.5\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center' }}
                    >
                      {input.options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
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
