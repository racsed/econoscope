"use client";

import React, { useEffect, useRef, useState } from "react";

interface AnimatedNumberProps {
  value: number;
  format?: (n: number) => string;
  duration?: number;
  className?: string;
}

function easeOutExpo(t: number): number {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

function safeFormat(n: number, format: (n: number) => string): string {
  try {
    if (typeof n !== 'number' || isNaN(n) || !isFinite(n)) return '—';
    return format(n);
  } catch {
    return '—';
  }
}

export function AnimatedNumber({
  value,
  format = (n) => n.toLocaleString(),
  duration = 500,
  className = "",
}: AnimatedNumberProps) {
  // Guard: if value is not a valid number, render fallback immediately
  if (typeof value !== 'number' || isNaN(value) || !isFinite(value)) {
    return (
      <span className={`font-mono ${className}`}>—</span>
    );
  }

  const [display, setDisplay] = useState(() => safeFormat(value, format));
  const [flash, setFlash] = useState<"up" | "down" | null>(null);
  const [scaleUp, setScaleUp] = useState(false);
  const prevValue = useRef(value);
  const prevDirection = useRef<"up" | "down" | null>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const from = prevValue.current;
    const to = value;
    prevValue.current = value;

    if (from === to) return;

    // Flash direction
    const direction = to > from ? "up" : "down";
    setFlash(direction);
    const flashTimeout = setTimeout(() => setFlash(null), 600);

    // Scale bump when direction changes
    let scaleTimeout: ReturnType<typeof setTimeout> | undefined;
    if (prevDirection.current !== null && prevDirection.current !== direction) {
      setScaleUp(true);
      scaleTimeout = setTimeout(() => setScaleUp(false), 300);
    }
    prevDirection.current = direction;

    const start = performance.now();

    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutExpo(progress);
      const current = from + (to - from) * eased;

      setDisplay(safeFormat(current, format));

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        setDisplay(safeFormat(to, format));
      }
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      clearTimeout(flashTimeout);
      if (scaleTimeout) clearTimeout(scaleTimeout);
    };
  }, [value, duration, format]);

  const flashColor = flash === "up"
    ? "text-emerald-500"
    : flash === "down"
      ? "text-red-500"
      : "";

  return (
    <span
      className={`font-mono transition-all duration-500 ${flashColor} ${className}`}
      style={{
        fontVariantNumeric: "tabular-nums",
        transform: scaleUp ? "scale(1.05)" : "scale(1)",
      }}
    >
      {display}
    </span>
  );
}

export default AnimatedNumber;
