'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowLeft,
  Clock,
  BookOpen,
  CheckCircle2,
  Circle,
  ExternalLink,
  GraduationCap,
  Landmark,
  Target,
  Globe,
  Scale,
} from 'lucide-react';
import { getParcoursById } from '@/data/parcours';
import { getModuleBySlug } from '@/data/modules-catalog';
import { Badge } from '@/components/ui/Badge';

const iconMap: Record<string, React.ElementType> = {
  GraduationCap,
  BookOpen,
  University: Landmark,
  Target,
  Globe,
  Scale,
};

function useParcoursProgress(parcoursId: string, totalSteps: number) {
  const storageKey = `parcours-progress-${parcoursId}`;

  const [completedSteps, setCompletedSteps] = useState<Set<number>>(() => {
    if (typeof window === 'undefined') return new Set<number>();
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) return new Set<number>(JSON.parse(stored));
    } catch {
      // ignore
    }
    return new Set<number>();
  });

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify([...completedSteps]));
    } catch {
      // ignore
    }
  }, [completedSteps, storageKey]);

  const toggleStep = (stepIndex: number) => {
    setCompletedSteps((prev) => {
      const next = new Set(prev);
      if (next.has(stepIndex)) {
        next.delete(stepIndex);
      } else {
        next.add(stepIndex);
      }
      return next;
    });
  };

  const progress = totalSteps > 0 ? Math.round((completedSteps.size / totalSteps) * 100) : 0;

  return { completedSteps, toggleStep, progress };
}

export default function ParcoursDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const parcours = useMemo(() => getParcoursById(id), [id]);

  const { completedSteps, toggleStep, progress } = useParcoursProgress(
    id,
    parcours?.modules.length ?? 0
  );

  if (!parcours) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md mx-auto">
          <h1 className="text-2xl font-bold text-text-primary mb-3">Parcours introuvable</h1>
          <p className="text-text-secondary mb-6">
            Ce parcours n&apos;existe pas ou a ete deplace.
          </p>
          <Link
            href="/parcours"
            className="inline-flex items-center gap-2 text-accent-indigo hover:underline"
          >
            <ArrowLeft size={16} />
            Retour aux parcours
          </Link>
        </div>
      </div>
    );
  }

  const Icon = iconMap[parcours.icon] || BookOpen;

  return (
    <main className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Back link */}
        <Link
          href="/parcours"
          className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text-primary transition-colors mb-8"
        >
          <ArrowLeft size={16} />
          Tous les parcours
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-start gap-4 mb-4">
            <div
              className="flex items-center justify-center w-14 h-14 rounded-xl shrink-0"
              style={{ backgroundColor: `${parcours.color}1A` }}
            >
              <Icon size={28} style={{ color: parcours.color }} />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-text-primary mb-1">
                {parcours.title}
              </h1>
              <p className="text-text-secondary">{parcours.description}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Badge label={parcours.level} color={parcours.color} />
            <span className="flex items-center gap-1.5 text-sm text-text-muted">
              <Clock size={15} />
              {parcours.duration}
            </span>
            <span className="flex items-center gap-1.5 text-sm text-text-muted">
              <BookOpen size={15} />
              {parcours.modules.length} modules
            </span>
          </div>
        </motion.div>

        {/* Progress bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-10 rounded-xl border border-border bg-bg-card p-4"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-text-primary">Progression</span>
            <span className="text-sm font-semibold" style={{ color: parcours.color }}>
              {progress}%
            </span>
          </div>
          <div className="h-2 rounded-full bg-bg-primary overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: parcours.color }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
          <p className="text-xs text-text-muted mt-2">
            {completedSteps.size} sur {parcours.modules.length} modules termines
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {parcours.modules.map((mod, index) => {
            const catalogEntry = getModuleBySlug(mod.slug);
            const isCompleted = completedSteps.has(index);
            const isLast = index === parcours.modules.length - 1;

            return (
              <motion.div
                key={mod.slug}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + index * 0.06 }}
                className="relative flex gap-4 pb-8"
              >
                {/* Vertical line + circle */}
                <div className="flex flex-col items-center">
                  <button
                    onClick={() => toggleStep(index)}
                    className="relative z-10 flex items-center justify-center w-9 h-9 rounded-full border-2 transition-all duration-200 shrink-0"
                    style={{
                      borderColor: isCompleted ? parcours.color : 'var(--color-border)',
                      backgroundColor: isCompleted ? parcours.color : 'var(--color-bg-card)',
                    }}
                    aria-label={
                      isCompleted
                        ? `Marquer l'etape ${index + 1} comme non terminee`
                        : `Marquer l'etape ${index + 1} comme terminee`
                    }
                  >
                    {isCompleted ? (
                      <CheckCircle2 size={18} className="text-white" />
                    ) : (
                      <span
                        className="text-sm font-semibold"
                        style={{ color: 'var(--color-text-muted)' }}
                      >
                        {index + 1}
                      </span>
                    )}
                  </button>
                  {!isLast && (
                    <div
                      className="w-0.5 flex-1 mt-1 transition-colors duration-200"
                      style={{
                        backgroundColor: isCompleted ? parcours.color : 'var(--color-border)',
                      }}
                    />
                  )}
                </div>

                {/* Content card */}
                <div
                  className="flex-1 rounded-xl border bg-bg-card p-4 transition-all duration-200"
                  style={{
                    borderColor: isCompleted
                      ? `${parcours.color}40`
                      : 'var(--color-border)',
                  }}
                >
                  <div className="flex items-start justify-between gap-3 mb-1">
                    <h3 className="font-semibold text-text-primary">
                      {catalogEntry?.title ?? mod.slug}
                    </h3>
                    {catalogEntry?.available && (
                      <Link
                        href={`/module/${mod.slug}`}
                        className="inline-flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap"
                        style={{
                          backgroundColor: `${parcours.color}1A`,
                          color: parcours.color,
                        }}
                      >
                        Ouvrir le module
                        <ExternalLink size={12} />
                      </Link>
                    )}
                  </div>
                  <p className="text-sm text-text-secondary">{mod.objective}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
