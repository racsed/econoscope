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
    <div className="bg-bg-card border border-border rounded-xl p-6 sm:p-8 relative overflow-hidden">
      {/* Large decorative quotation mark */}
      <svg
        className="absolute top-4 left-5 w-12 h-12 opacity-10"
        style={{ color: themeColor }}
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z" />
      </svg>

      <blockquote className="relative z-10 text-base italic text-text-secondary leading-relaxed mb-4 pl-10">
        &laquo; {economist.quote} &raquo;
      </blockquote>

      {economist.quoteContext && (
        <p className="text-xs text-text-muted leading-relaxed pl-10 mb-4">
          {economist.quoteContext}
        </p>
      )}

      <div className="pl-10 flex items-center gap-3">
        {economist.portrait ? (
          <img
            src={economist.portrait}
            alt={`Portrait de ${economist.name}`}
            loading="lazy"
            className="w-12 h-12 rounded-full object-cover flex-shrink-0 border border-border"
          />
        ) : (
          <div
            className="w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold text-lg"
            style={{ backgroundColor: themeColor }}
            aria-hidden="true"
          >
            {economist.name.charAt(0)}
          </div>
        )}
        <div>
          <p className="text-sm font-bold text-text-primary">
            {economist.name}
          </p>
          <p className="text-xs text-text-muted">
            {economist.years} -- {economist.school}
          </p>
        </div>
      </div>
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
      <div className="grid grid-cols-1 gap-4">
        {economistsData.map(economist => (
          <EconomistCard key={economist.id} economist={economist} themeColor={themeColor} />
        ))}
      </div>
    </motion.div>
  );
}

export default EconomistBlock;
