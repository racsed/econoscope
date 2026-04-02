'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  GraduationCap,
  BookOpen,
  Landmark,
  Target,
  Globe,
  Scale,
  Clock,
  ArrowRight,
  BookMarked,
} from 'lucide-react';
import { parcoursList } from '@/data/parcours';
import { Badge } from '@/components/ui/Badge';

const iconMap: Record<string, React.ElementType> = {
  GraduationCap,
  BookOpen,
  University: Landmark,
  Target,
  Globe,
  Scale,
};

export default function ParcoursPage() {
  return (
    <main className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-3">
            <BookMarked size={24} className="text-accent-indigo" />
            <h1 className="text-3xl sm:text-4xl font-bold text-text-primary">
              Parcours guidés
            </h1>
          </div>
          <p className="text-text-secondary text-lg">
            Des sequences pedagogiques pour structurer votre apprentissage
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {parcoursList.map((parcours, index) => {
            const Icon = iconMap[parcours.icon] || BookOpen;

            return (
              <motion.div
                key={parcours.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
              >
                <Link href={`/parcours/${parcours.id}`} className="block group">
                  <div className="h-full rounded-2xl border border-border bg-bg-card overflow-hidden transition-all duration-200 hover:border-transparent hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/20">
                    <div className="h-[3px]" style={{ background: parcours.color }} />
                    <div className="p-6">
                    {/* Icon + badge row */}
                    <div className="flex items-start justify-between mb-4">
                      <div
                        className="flex items-center justify-center w-12 h-12 rounded-xl"
                        style={{ backgroundColor: `${parcours.color}1A` }}
                      >
                        <Icon size={24} style={{ color: parcours.color }} />
                      </div>
                      <Badge label={parcours.level} color={parcours.color} size="sm" />
                    </div>

                    {/* Title */}
                    <h2 className="text-lg font-semibold text-text-primary mb-2 group-hover:text-accent-indigo transition-colors">
                      {parcours.title}
                    </h2>

                    {/* Description */}
                    <p className="text-sm text-text-secondary mb-4 leading-relaxed">
                      {parcours.description}
                    </p>

                    {/* Meta row */}
                    <div className="flex items-center gap-4 text-xs text-text-muted mb-4">
                      <span className="flex items-center gap-1">
                        <Clock size={14} />
                        {parcours.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <BookOpen size={14} />
                        {parcours.modules.length} modules
                      </span>
                    </div>

                    {/* CTA */}
                    <div
                      className="flex items-center gap-1.5 text-sm font-medium transition-colors"
                      style={{ color: parcours.color }}
                    >
                      Commencer
                      <ArrowRight
                        size={16}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </div>
                    </div>
                    {/* Progress-style bar at bottom */}
                    <div className="h-1 bg-bg-elevated">
                      <div className="h-full w-0 group-hover:w-full transition-all duration-500" style={{ background: `linear-gradient(90deg, ${parcours.color}, ${parcours.color}60)` }} />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
