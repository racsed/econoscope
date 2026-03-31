'use client';

import { Globe } from 'lucide-react';
import { motion } from 'framer-motion';

interface RealiteBlockProps {
  items: string[];
  themeColor: string;
}

export function RealiteBlock({ items, themeColor }: RealiteBlockProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-bg-narration border border-border rounded-xl p-5"
    >
      <div className="flex items-center gap-2 mb-3">
        <Globe size={18} style={{ color: themeColor }} />
        <h3
          className="text-sm font-semibold uppercase tracking-wider"
          style={{ color: themeColor }}
        >
          Dans la réalité
        </h3>
      </div>
      <p className="text-sm text-text-secondary mb-3">
        Voici comment ce mécanisme se manifeste dans le monde réel :
      </p>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
            <span
              className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: themeColor, opacity: 0.5 }}
            />
            {item}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

export default RealiteBlock;
