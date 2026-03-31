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

export function AnimatedNumber({
  value,
  format = (n) => n.toLocaleString(),
  duration = 500,
  className = "",
}: AnimatedNumberProps) {
  const [display, setDisplay] = useState(format(value));
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

      setDisplay(format(current));

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        setDisplay(format(to));
      }
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      clearTimeout(flashTimeout);
    };
  }, [value, duration, format]);

  const flashColor = flash === "up"
    ? "text-emerald-400"
    : flash === "down"
      ? "text-red-400"
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
