"use client";

import React from "react";
import { motion } from "framer-motion";
import * as Tooltip from "@radix-ui/react-tooltip";

interface Scenario {
  id: string;
  label: string;
  description: string;
}

interface ScenarioBarProps {
  scenarios: Scenario[];
  activeId: string | null;
  onSelect: (id: string) => void;
}

export function ScenarioBar({ scenarios, activeId, onSelect }: ScenarioBarProps) {
  return (
    <Tooltip.Provider delayDuration={300}>
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {scenarios.map((scenario) => {
          const isActive = scenario.id === activeId;

          return (
            <Tooltip.Root key={scenario.id}>
              <Tooltip.Trigger asChild>
                <button
                  type="button"
                  onClick={() => onSelect(scenario.id)}
                  className={`relative shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "text-white"
                      : "border border-[#E2E4E9] text-[#5F6980] hover:border-[#CBD5E1] hover:text-[#1A1D26]"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="scenario-active-pill"
                      className="absolute inset-0 rounded-full bg-[#5B5EF4]"
                      transition={{ type: "spring", stiffness: 500, damping: 35 }}
                    />
                  )}
                  <span className="relative z-10">{scenario.label}</span>
                </button>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content
                  side="bottom"
                  sideOffset={8}
                  className="max-w-xs rounded-lg bg-white px-3 py-2 text-xs text-[#5F6980] shadow-lg border border-[#E2E4E9]"
                >
                  {scenario.description}
                  <Tooltip.Arrow className="fill-white" />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          );
        })}
      </div>
    </Tooltip.Provider>
  );
}

export default ScenarioBar;
