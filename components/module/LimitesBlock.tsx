'use client';

import { AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

interface LimitesBlockProps {
  limites: string[];
  themeColor: string;
}

export function LimitesBlock({ limites, themeColor }: LimitesBlockProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="limites-block bg-[#FFFBEB] border border-[#FDE68A]/40 rounded-xl p-5"
    >
      <div className="flex items-center gap-2 mb-3">
        <AlertTriangle size={18} className="text-[#FBBF24]" />
        <h3 className="limites-title text-sm font-semibold uppercase tracking-wider text-[#92400E]">
          Limites du modèle
        </h3>
      </div>
      <ul className="space-y-2">
        {limites.map((limite, i) => (
          <li key={i} className="limites-text flex items-start gap-2 text-sm text-[#78716C]">
            <span
              className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 bg-[#FBBF24] opacity-50"
            />
            {limite}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

export default LimitesBlock;
