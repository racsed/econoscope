"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

interface SliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  color?: string;
  tooltip?: string;
}

export function Slider({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  unit = "",
  color = "#5B5EF4",
  tooltip,
}: SliderProps) {
  const [editing, setEditing] = useState(false);
  const [inputValue, setInputValue] = useState(String(value));
  const inputRef = useRef<HTMLInputElement>(null);
  const prevValueRef = useRef(value);
  const [valuePulse, setValuePulse] = useState(false);

  useEffect(() => {
    if (prevValueRef.current !== value) {
      prevValueRef.current = value;
      setValuePulse(true);
      const timer = setTimeout(() => setValuePulse(false), 300);
      return () => clearTimeout(timer);
    }
  }, [value]);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  useEffect(() => {
    if (!editing) {
      setInputValue(String(value));
    }
  }, [value, editing]);

  const commitInput = useCallback(() => {
    const parsed = parseFloat(inputValue);
    if (!isNaN(parsed)) {
      const clamped = Math.min(max, Math.max(min, parsed));
      onChange(clamped);
    }
    setEditing(false);
  }, [inputValue, min, max, onChange]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") commitInput();
    if (e.key === "Escape") setEditing(false);
  };

  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="flex flex-col gap-2" title={tooltip}>
      <div className="flex items-center justify-between">
        <span className="text-sm text-text-secondary">{label}</span>
        {editing ? (
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onBlur={commitInput}
            onKeyDown={handleKeyDown}
            className="w-20 rounded bg-bg-elevated px-2 py-0.5 text-right font-mono text-sm text-text-primary outline-none border border-border focus:ring-1 focus:ring-accent-indigo focus:border-accent-indigo"
          />
        ) : (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="cursor-text rounded px-1 py-0.5 font-mono text-sm text-text-primary transition-all duration-150 hover:bg-bg-elevated"
            style={{
              fontVariantNumeric: "tabular-nums",
              ...(valuePulse
                ? { color, transform: "scale(1.08)" }
                : { transform: "scale(1)" }),
            }}
          >
            {value}
            {unit}
          </button>
        )}
      </div>

      <SliderPrimitive.Root
        className="relative flex h-5 w-full touch-none select-none items-center"
        value={[value]}
        onValueChange={([v]) => onChange(v)}
        min={min}
        max={max}
        step={step}
      >
        <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-border">
          <SliderPrimitive.Range
            className="absolute h-full rounded-full transition-[width] duration-150"
            style={{ backgroundColor: color, width: `${percentage}%` }}
          />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb
          className="block h-4 w-4 rounded-full border-2 bg-bg-card shadow-md transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-card active:scale-110"
          style={{ borderColor: color } as React.CSSProperties}
        />
      </SliderPrimitive.Root>
    </div>
  );
}

export default Slider;
