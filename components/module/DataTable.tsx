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
      className="bg-[#141419] border border-[#2A2A35] rounded-xl overflow-hidden"
    >
      <div className="flex items-center gap-2 p-4 border-b border-[#2A2A35]">
        <Table size={16} style={{ color: themeColor }} />
        <h3
          className="text-sm font-semibold uppercase tracking-wider"
          style={{ color: themeColor }}
        >
          Synthese
        </h3>
      </div>
      <div className="divide-y divide-[#1E1E28]">
        {outputs.map((output) => (
          <div
            key={output.id}
            className="flex items-center justify-between px-4 py-3"
          >
            <span className="text-sm text-[#8888A0]">{output.label}</span>
            <div className="flex items-center gap-2">
              <AnimatedNumber
                value={output.value}
                className="text-sm font-mono font-medium text-[#E8E8ED]"
              />
              {output.unit && (
                <span className="text-xs text-[#5A5A70]">{output.unit}</span>
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
