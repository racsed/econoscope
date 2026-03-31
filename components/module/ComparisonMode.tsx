'use client';

import { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GitCompareArrows } from 'lucide-react';

interface ComparisonModeProps {
  isComparing: boolean;
  onToggle: () => void;
  renderA: () => ReactNode;
  renderB: () => ReactNode;
  labelA?: string;
  labelB?: string;
  themeColor: string;
}

export function ComparisonMode({
  isComparing,
  onToggle,
  renderA,
  renderB,
  labelA = 'Scenario A',
  labelB = 'Scenario B',
  themeColor,
}: ComparisonModeProps) {
  return (
    <div>
      <button
        onClick={onToggle}
        className="flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-all duration-200"
        style={{
          borderColor: isComparing ? themeColor : undefined,
          backgroundColor: isComparing ? `${themeColor}15` : 'transparent',
          color: isComparing ? themeColor : undefined,
        }}
      >
        <span className={isComparing ? '' : 'text-text-secondary'}>
          <GitCompareArrows size={16} />
        </span>
        <span className={isComparing ? '' : 'text-text-secondary'}>Mode comparaison</span>
      </button>

      <AnimatePresence>
        {isComparing && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4"
          >
            <div className="bg-bg-card border border-border shadow-sm rounded-xl p-4">
              <h4 className="text-xs font-medium uppercase tracking-wider text-text-secondary mb-3">
                {labelA}
              </h4>
              {renderA()}
            </div>
            <div className="bg-bg-card border border-border shadow-sm rounded-xl p-4">
              <h4 className="text-xs font-medium uppercase tracking-wider mb-3" style={{ color: themeColor }}>
                {labelB}
              </h4>
              {renderB()}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ComparisonMode;
