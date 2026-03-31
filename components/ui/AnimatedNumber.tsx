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
  const prevValue = useRef(value);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const from = prevValue.current;
    const to = value;
    prevValue.current = value;

    if (from === to) return;

    // Flash direction
    setFlash(to > from ? "up" : "down");
    const flashTimeout = setTimeout(() => setFlash(null), 600);

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
    };
  }, [value, duration, format]);

  const flashColor = flash === "up"
    ? "text-emerald-500"
    : flash === "down"
      ? "text-red-500"
      : "";

  return (
    <span
      className={`font-mono transition-colors duration-500 ${flashColor} ${className}`}
    >
      {display}
    </span>
  );
}

export default AnimatedNumber;
