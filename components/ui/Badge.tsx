"use client";

import React from "react";

interface BadgeProps {
  label: string;
  color: string;
  size?: "sm" | "md";
}

export function Badge({ label, color, size = "md" }: BadgeProps) {
  const sizeClasses = size === "sm"
    ? "px-2 py-0.5 text-xs"
    : "px-3 py-1 text-sm";

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${sizeClasses}`}
      style={{
        backgroundColor: `${color}26`,
        color,
        border: `1px solid ${color}4D`,
      }}
    >
      {label}
    </span>
  );
}

export default Badge;
