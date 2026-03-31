"use client";

import React from "react";
import { motion } from "framer-motion";

interface ToggleProps {
  label?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  options?: [string, string];
}

export function Toggle({
  label,
  checked,
  onChange,
  options = ["Off", "On"],
}: ToggleProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <span className="text-sm text-[#5F6980]">{label}</span>
      )}
      <div className="relative inline-flex h-9 rounded-full bg-[#F4F5F7] p-0.5">
        {/* Sliding indicator */}
        <motion.div
          layout
          transition={{ type: "spring", stiffness: 500, damping: 35 }}
          className="absolute inset-y-0.5 w-[calc(50%-2px)] rounded-full bg-[#5B5EF4]"
          style={{ [checked ? "right" : "left"]: "2px" }}
        />

        <button
          type="button"
          onClick={() => onChange(false)}
          className={`relative z-10 flex-1 rounded-full px-4 text-sm font-medium transition-colors ${
            !checked ? "text-white" : "text-[#5F6980]"
          }`}
        >
          {options[0]}
        </button>
        <button
          type="button"
          onClick={() => onChange(true)}
          className={`relative z-10 flex-1 rounded-full px-4 text-sm font-medium transition-colors ${
            checked ? "text-white" : "text-[#5F6980]"
          }`}
        >
          {options[1]}
        </button>
      </div>
    </div>
  );
}

export default Toggle;
