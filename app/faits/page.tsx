'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { History, ArrowRight, Flame, TrendingDown, Landmark, ArrowUpCircle, Scale, Banknote, Receipt, Euro, Train, Globe, Factory, Crown, Ship, Wheat, Coins, Building, Zap, Shield, Smartphone } from 'lucide-react';
import { economicFacts, type EconomicFact } from '@/data/economic-facts';

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>> = {
  Flame, TrendingDown, Landmark, ArrowUpCircle, Scale, Banknote, Receipt, Euro, Train, Globe, Factory, Crown, Ship, Wheat, Coins, Building, Zap, Shield, Smartphone,
};

const categoryLabels: Record<string, { label: string; color: string }> = {
  crise: { label: 'Crise', color: '#EF4444' },
  politique: { label: 'Politique economique', color: '#5B5EF4' },
  commerce: { label: 'Commerce', color: '#F59E0B' },
  monetaire: { label: 'Monetaire', color: '#0EA5E9' },
  social: { label: 'Social', color: '#EC4899' },
  histoire: { label: 'Histoire', color: '#8B5CF6' },
};

const categories = ['all', 'histoire', 'crise', 'politique', 'commerce', 'monetaire', 'social'];

export default function FaitsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = selectedCategory === 'all'
    ? economicFacts
    : economicFacts.filter(f => f.category === selectedCategory);

  return (
    <main className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-3">
            <History size={24} className="text-accent-indigo" />
            <h1 className="text-3xl font-bold text-text-primary">Faits economiques</h1>
          </div>
          <p className="text-text-secondary text-lg">
            Des evenements reels illustres par les modeles. Cliquez pour explorer avec les parametres historiques.
          </p>
        </motion.div>

        {/* Category filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map(cat => {
            const info = cat === 'all' ? { label: 'Tous', color: '#5B5EF4' } : categoryLabels[cat];
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className="px-3.5 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border"
                style={{
                  borderColor: selectedCategory === cat ? info.color : 'var(--color-border)',
                  backgroundColor: selectedCategory === cat ? `${info.color}12` : 'var(--color-bg-card)',
                  color: selectedCategory === cat ? info.color : 'var(--color-text-secondary)',
                }}
              >
                {info.label}
              </button>
            );
          })}
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-6 top-0 bottom-0 w-px bg-border hidden md:block" />

          <div className="space-y-6">
            {filtered.map((fact, i) => (
              <FactCard
                key={fact.id}
                fact={fact}
                index={i}
                isExpanded={expandedId === fact.id}
                onToggle={() => setExpandedId(expandedId === fact.id ? null : fact.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

function FactCard({
  fact,
  index,
  isExpanded,
  onToggle,
}: {
  fact: EconomicFact;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const catInfo = categoryLabels[fact.category];
  const Icon = iconMap[fact.icon] || History;

  // Build URL with scenario values as query params
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(fact.scenarioValues)) {
    params.set(key, String(value));
  }
  const articleUrl = `/faits/${fact.id}`;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="md:pl-14 relative"
    >
      {/* Timeline dot */}
      <div
        className="absolute left-4 top-6 w-4 h-4 rounded-full border-2 border-bg-primary hidden md:block"
        style={{ backgroundColor: catInfo.color }}
      />

      <div
        className="bg-bg-card border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer"
        onClick={onToggle}
      >
        <div className="p-5">
          <div className="flex items-start gap-4">
            {/* Icon */}
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: `${catInfo.color}15` }}
            >
              <Icon size={18} style={{ color: catInfo.color }} />
            </div>

            <div className="flex-1 min-w-0">
              {/* Header */}
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono font-semibold" style={{ color: catInfo.color }}>
                  {fact.year}
                </span>
                <span
                  className="text-xs px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: `${catInfo.color}12`, color: catInfo.color }}
                >
                  {catInfo.label}
                </span>
              </div>

              <h3 className="text-base font-semibold text-text-primary mb-1">{fact.title}</h3>
              <p className="text-sm text-text-secondary leading-relaxed">{fact.summary}</p>
            </div>
          </div>

          {/* Expanded detail */}
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.2 }}
              className="mt-4 pt-4 border-t border-border-subtle"
            >
              <p className="text-sm text-text-primary/80 leading-relaxed mb-4">
                {fact.detail}
              </p>
              <Link
                href={articleUrl}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition-all hover:shadow-md"
                style={{ backgroundColor: catInfo.color }}
              >
                Lire l&apos;article et simuler
                <ArrowRight size={14} />
              </Link>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
