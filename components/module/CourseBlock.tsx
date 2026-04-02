'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, ChevronDown, GraduationCap, Lightbulb } from 'lucide-react';
import type { CourseContent } from '@/engine/types';

interface CourseBlockProps {
  course: CourseContent;
  themeColor: string;
}

export function CourseBlock({ course, themeColor }: CourseBlockProps) {
  const [expanded, setExpanded] = useState(false);

  // Show only the first paragraph when collapsed
  const firstParagraph = course.introduction.split('\n\n')[0];

  return (
    <div className="relative bg-bg-card border border-border shadow-sm rounded-2xl overflow-hidden mb-8">
      {/* Gradient left accent */}
      <div className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-2xl" style={{ background: `linear-gradient(180deg, ${themeColor}, #22D3EE)` }} />
      {/* Header */}
      <div className="px-5 pt-5 pb-4">
        <div className="flex items-center gap-2 mb-3">
          <BookOpen size={18} style={{ color: themeColor }} />
          <h2
            className="text-sm font-semibold uppercase tracking-wider"
            style={{ color: themeColor }}
          >
            Cours
          </h2>
        </div>

        {/* First paragraph always visible */}
        <p className="text-text-secondary leading-relaxed">{firstParagraph}</p>

        {/* Expand button */}
        {!expanded && (
          <button
            onClick={() => setExpanded(true)}
            className="mt-3 flex items-center gap-1.5 text-sm font-medium transition-colors hover:opacity-80"
            style={{ color: themeColor }}
          >
            Lire le cours complet
            <ChevronDown size={16} />
          </button>
        )}
      </div>

      {/* Expanded content */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="course-expanded"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 space-y-6">
              {/* Remaining paragraphs */}
              {course.introduction
                .split('\n\n')
                .slice(1)
                .map((paragraph, i) => (
                  <p key={i} className="text-text-secondary leading-relaxed">
                    {paragraph}
                  </p>
                ))}

              {/* Key Concepts Grid */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Lightbulb size={16} style={{ color: themeColor }} />
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-text-primary">
                    Concepts cles
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {course.keyConcepts.map((concept, i) => (
                    <div
                      key={i}
                      className="rounded-xl border border-border bg-bg-hover/50 p-4"
                      style={{ borderLeft: `2px solid ${themeColor}40` }}
                    >
                      <dt
                        className="font-semibold text-sm mb-1"
                        style={{ color: themeColor }}
                      >
                        {concept.term}
                      </dt>
                      <dd className="text-sm text-text-secondary leading-relaxed">
                        {concept.definition}
                      </dd>
                    </div>
                  ))}
                </div>
              </div>

              {/* Methodology */}
              <div
                className="rounded-xl p-4 border"
                style={{
                  background: `linear-gradient(135deg, ${themeColor}08, ${themeColor}03)`,
                  borderColor: `${themeColor}20`,
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <GraduationCap size={16} style={{ color: themeColor }} />
                  <h3
                    className="text-sm font-semibold uppercase tracking-wider"
                    style={{ color: themeColor }}
                  >
                    Comment utiliser ce simulateur
                  </h3>
                </div>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {course.methodology}
                </p>
              </div>

              {/* For Teachers */}
              {course.forTeachers && (
                <div className="rounded-xl bg-bg-hover/30 border border-border p-4">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
                    Piste pedagogique
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {course.forTeachers}
                  </p>
                </div>
              )}

              {/* Collapse button */}
              <button
                onClick={() => setExpanded(false)}
                className="flex items-center gap-1.5 text-sm font-medium transition-colors hover:opacity-80"
                style={{ color: themeColor }}
              >
                Replier le cours
                <motion.span
                  animate={{ rotate: 180 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown size={16} />
                </motion.span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default CourseBlock;
