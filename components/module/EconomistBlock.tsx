'use client';

import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import { getEconomistById, type Economist } from '@/data/economists';

interface EconomistBlockProps {
  economistIds: string[];
  themeColor: string;
}

function EconomistCard({ economist, themeColor }: { economist: Economist; themeColor: string }) {
  return (
    <div className="bg-bg-card border border-border rounded-xl p-5 space-y-3">
      <div className="flex items-start gap-3">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
          style={{ backgroundColor: `${themeColor}15` }}
        >
          <Quote size={14} style={{ color: themeColor }} />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-text-primary">
            {economist.name}
          </h4>
          <p className="text-xs text-text-muted">
            {economist.years} -- {economist.school}
          </p>
        </div>
      </div>

      <blockquote
        className="text-sm italic text-text-secondary leading-relaxed pl-4"
        style={{ borderLeft: `3px solid ${themeColor}` }}
      >
        &laquo; {economist.quote} &raquo;
      </blockquote>

      {economist.quoteContext && (
        <p className="text-xs text-text-muted leading-relaxed pl-4">
          {economist.quoteContext}
        </p>
      )}
    </div>
  );
}

export function EconomistBlock({ economistIds, themeColor }: EconomistBlockProps) {
  const economistsData = economistIds
    .map(id => getEconomistById(id))
    .filter((e): e is Economist => e !== undefined);

  if (economistsData.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35 }}
      className="space-y-3"
    >
      <div className="flex items-center gap-2 mb-1">
        <Quote size={18} style={{ color: themeColor }} />
        <h3
          className="text-sm font-semibold uppercase tracking-wider"
          style={{ color: themeColor }}
        >
          Economistes associes
        </h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {economistsData.map(economist => (
          <EconomistCard key={economist.id} economist={economist} themeColor={themeColor} />
        ))}
      </div>
    </motion.div>
  );
}

export default EconomistBlock;
