'use client';

import { motion } from 'framer-motion';
import { Table } from 'lucide-react';
import type { SimulationOutput } from '@/engine/types';
import { AnimatedNumber } from '@/components/ui/AnimatedNumber';

interface DataTableProps {
  outputs: SimulationOutput[];
  themeColor: string;
}

export function DataTable({ outputs, themeColor }: DataTableProps) {
  if (outputs.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-white border border-[#E2E4E9] shadow-sm rounded-xl overflow-hidden"
    >
      <div className="flex items-center gap-2 p-4 border-b border-[#EDEEF1]">
        <Table size={16} style={{ color: themeColor }} />
        <h3
          className="text-sm font-semibold uppercase tracking-wider"
          style={{ color: themeColor }}
        >
          Synthese
        </h3>
      </div>
      <div className="divide-y divide-[#EDEEF1]">
        {outputs.map((output) => (
          <div
            key={output.id}
            className="flex items-center justify-between px-4 py-3"
          >
            <span className="text-sm text-[#5F6980]">{output.label}</span>
            <div className="flex items-center gap-2">
              <AnimatedNumber
                value={output.value}
                className="text-sm font-mono font-medium text-[#1A1D26]"
              />
              {output.unit && (
                <span className="text-xs text-[#9CA3B4]">{output.unit}</span>
              )}
              {output.direction && output.direction !== 'neutral' && (
                <span
                  className={`text-xs ${
                    output.direction === 'up'
                      ? 'text-[#34D399]'
                      : 'text-[#F87171]'
                  }`}
                >
                  {output.direction === 'up' ? '\u2191' : '\u2193'}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export default DataTable;
