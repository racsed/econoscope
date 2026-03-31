"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

interface NarrationBlockProps {
  icon: LucideIcon;
  title: string;
  content: string;
  themeColor?: string;
}

/**
 * Wraps numeric values in styled mono spans.
 * Detects numbers (optionally with decimals, commas, spaces, %, currency symbols).
 */
export function renderNarration(text: string, accentColor: string = "#5B5EF4"): React.ReactNode[] {
  const parts = text.split(/(\d[\d\s,.']*\d*\s*[%€$£]?)/g);

  return parts.map((part, i) => {
    if (/^\d/.test(part.trim())) {
      return (
        <span
          key={i}
          data-value
          className="font-mono font-semibold"
          style={{ color: accentColor }}
        >
          {part}
        </span>
      );
    }
    return <React.Fragment key={i}>{part}</React.Fragment>;
  });
}

export function NarrationBlock({
  icon: Icon,
  title,
  content,
  themeColor = "#5B5EF4",
}: NarrationBlockProps) {
  // Use first 50 chars as stable key for AnimatePresence
  const contentKey = content.slice(0, 50);

  return (
    <div
      className="rounded-xl bg-bg-narration p-5"
      style={{ borderLeft: `3px solid ${themeColor}` }}
    >
      {/* Header */}
      <div className="mb-3 flex items-center gap-2">
        <Icon size={18} style={{ color: themeColor }} />
        <span className="text-sm font-semibold text-text-primary">{title}</span>
      </div>

      {/* Animated content */}
      <AnimatePresence mode="wait">
        <motion.p
          key={contentKey}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.25 }}
          className="text-sm leading-relaxed text-text-secondary"
        >
          {renderNarration(content, themeColor)}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}

export default NarrationBlock;
