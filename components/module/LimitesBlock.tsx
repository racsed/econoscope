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
      className="bg-[#12121A] border border-[#2A2A35] rounded-xl p-5"
    >
      <div className="flex items-center gap-2 mb-3">
        <AlertTriangle size={18} className="text-[#FBBF24]" />
        <h3 className="text-sm font-semibold uppercase tracking-wider text-[#FBBF24]">
          Limites du modele
        </h3>
      </div>
      <ul className="space-y-2">
        {limites.map((limite, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-[#8888A0]">
            <span
              className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: themeColor, opacity: 0.5 }}
            />
            {limite}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

export default LimitesBlock;
