'use client';

import { useState, useMemo, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, BookOpen, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { glossary } from '@/data/glossary';

const ECONOMIST_NAMES = [
  'Keynes', 'Friedman', 'Ricardo', 'Smith', 'Marx', 'Hayek', 'Pigou',
  'Marshall', 'Walras', 'Samuelson', 'Hicks', 'Hansen', 'Phillips',
  'Okun', 'Laffer', 'Solow', 'Lucas', 'Mundell', 'Fleming', 'Fisher',
  'Akerlof', 'Nash', 'Arrow', 'Coase', 'Beveridge', 'Lorenz', 'Gini',
  'Kaldor', 'Engel', 'Veblen', 'Giffen', 'Phelps', 'Modigliani',
  'Barro', 'Romer', 'Aghion', 'Howitt', 'Krugman', 'Stiglitz',
  'Piketty', 'Schumpeter', 'Bourdieu', 'Boudon', 'Jevons', 'Menger',
  'Chamberlin', 'Robinson', 'Dupuit', 'Wieser', 'List', 'Prebisch',
  'Singer', 'Sargent', 'Khaldoun',
];

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

function renderDefinition(
  text: string,
  allTermNames: string[],
  onTermClick: (termName: string) => void
) {
  const sentences = text.split(/(?<=\.)\s+/);
  const paragraphs: string[][] = [];
  for (let i = 0; i < sentences.length; i += 2) {
    paragraphs.push(sentences.slice(i, i + 2));
  }

  return paragraphs.map((para, pIdx) => {
    const paraText = para.join(' ');
    return (
      <p key={pIdx} className="mb-3 last:mb-0 text-sm text-text-primary/80 leading-relaxed">
        {processText(paraText, allTermNames, onTermClick)}
      </p>
    );
  });
}

function processText(
  text: string,
  allTermNames: string[],
  onTermClick: (termName: string) => void
) {
  const numberPattern = /(\d+[\s,.]?\d*\s*(%|milliard[s]?|million[s]?|Md|EUR|USD|euros?|dollars?|points?|ans?))/g;
  const economistPattern = new RegExp(`\\b(${ECONOMIST_NAMES.join('|')})\\b`, 'g');

  const shortTermNames = allTermNames
    .map((name) => {
      const match = name.match(/^([^(]+)/);
      return match ? match[1].trim() : name;
    })
    .filter((n) => n.length > 4)
    .sort((a, b) => b.length - a.length);

  type Segment = { type: 'text' | 'number' | 'economist' | 'termLink'; value: string; termName?: string };
  const segments: Segment[] = [];
  let remaining = text;

  while (remaining.length > 0) {
    let earliestMatch: { index: number; length: number; type: Segment['type']; value: string; termName?: string } | null = null as { index: number; length: number; type: Segment['type']; value: string; termName?: string } | null;

    const numMatch = remaining.match(numberPattern);
    if (numMatch) {
      const idx = remaining.indexOf(numMatch[0]);
      if (!earliestMatch || idx < earliestMatch.index) {
        earliestMatch = { index: idx, length: numMatch[0].length, type: 'number', value: numMatch[0] };
      }
    }

    const econMatch = remaining.match(economistPattern);
    if (econMatch) {
      const idx = remaining.indexOf(econMatch[0]);
      if (!earliestMatch || idx < earliestMatch.index) {
        earliestMatch = { index: idx, length: econMatch[0].length, type: 'economist', value: econMatch[0] };
      }
    }

    if (!earliestMatch) {
      segments.push({ type: 'text', value: remaining });
      break;
    }

    if (earliestMatch.index > 0) {
      segments.push({ type: 'text', value: remaining.substring(0, earliestMatch.index) });
    }
    segments.push({ type: earliestMatch.type, value: earliestMatch.value, termName: earliestMatch.termName });
    remaining = remaining.substring(earliestMatch.index + earliestMatch.length);
  }

  return segments.map((seg, i) => {
    if (seg.type === 'number') {
      return (
        <span key={i} className="font-mono font-semibold text-accent-indigo">
          {seg.value}
        </span>
      );
    }
    if (seg.type === 'economist') {
      return (
        <span key={i} className="font-semibold">
          {seg.value}
        </span>
      );
    }
    return <span key={i}>{seg.value}</span>;
  });
}

export default function GlossairePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedTerm, setExpandedTerm] = useState<string | null>(null);
  const [highlightedTerm, setHighlightedTerm] = useState<string | null>(null);
  const termRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const allTermNames = useMemo(() => glossary.map((t) => t.term), []);

  const categories = useMemo(() => {
    const cats = new Set(glossary.map((t) => t.category));
    return ['all', ...Array.from(cats).sort()];
  }, []);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    glossary.forEach((t) => {
      counts[t.category] = (counts[t.category] || 0) + 1;
    });
    return counts;
  }, []);

  const filteredTerms = useMemo(() => {
    return glossary
      .filter((term) => {
        if (
          searchQuery &&
          !term.term.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !term.definition.toLowerCase().includes(searchQuery.toLowerCase())
        ) {
          return false;
        }
        if (selectedCategory !== 'all' && term.category !== selectedCategory) {
          return false;
        }
        return true;
      })
      .sort((a, b) => a.term.localeCompare(b.term, 'fr'));
  }, [searchQuery, selectedCategory]);

  const availableLetters = useMemo(() => {
    const letters = new Set(
      filteredTerms.map((t) => {
        const first = t.term.charAt(0).toUpperCase();
        return first.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      })
    );
    return letters;
  }, [filteredTerms]);

  const scrollToLetter = useCallback((letter: string) => {
    const term = filteredTerms.find((t) => {
      const first = t.term.charAt(0).toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      return first === letter;
    });
    if (term && termRefs.current[term.term]) {
      termRefs.current[term.term]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [filteredTerms]);

  const navigateToTerm = useCallback((termName: string) => {
    setSelectedCategory('all');
    setSearchQuery('');
    setExpandedTerm(termName);
    setHighlightedTerm(termName);
    setTimeout(() => {
      termRefs.current[termName]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
    setTimeout(() => {
      setHighlightedTerm(null);
    }, 2000);
  }, []);

  return (
    <main className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-3">
            <BookOpen size={24} className="text-accent-indigo" />
            <h1 className="text-3xl font-bold text-text-primary">Glossaire</h1>
          </div>
          <p className="text-text-secondary">
            {glossary.length} termes economiques expliques simplement
          </p>
        </motion.div>

        {/* Search */}
        <div className="mb-6 relative max-w-md">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
          />
          <input
            type="text"
            placeholder="Rechercher un terme..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-bg-card border border-border rounded-xl text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-indigo/50 transition-colors"
          />
        </div>

        {/* Alphabet navigation */}
        <div className="flex flex-wrap gap-1 mb-6">
          {ALPHABET.map((letter) => {
            const hasTerms = availableLetters.has(letter);
            return (
              <button
                key={letter}
                onClick={() => hasTerms && scrollToLetter(letter)}
                disabled={!hasTerms}
                className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all ${
                  hasTerms
                    ? 'bg-bg-card border border-border text-text-primary hover:border-accent-indigo hover:text-accent-indigo cursor-pointer'
                    : 'bg-transparent text-text-muted/30 cursor-default'
                }`}
              >
                {letter}
              </button>
            );
          })}
        </div>

        {/* Category filters with counts */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                selectedCategory === cat
                  ? 'border-accent-indigo bg-accent-indigo/[0.07] text-accent-indigo'
                  : 'border-border bg-bg-card text-text-secondary'
              }`}
            >
              {cat === 'all'
                ? `Toutes categories (${glossary.length})`
                : `${cat} (${categoryCounts[cat] || 0})`}
            </button>
          ))}
        </div>

        {/* Terms list */}
        <div className="space-y-2">
          {filteredTerms.map((term, i) => (
            <motion.div
              key={term.term}
              ref={(el) => { termRefs.current[term.term] = el; }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.02, 0.5) }}
              className={`bg-bg-card border rounded-xl overflow-hidden transition-all duration-500 ${
                highlightedTerm === term.term
                  ? 'border-accent-indigo ring-2 ring-accent-indigo/20'
                  : 'border-border'
              }`}
            >
              <button
                onClick={() =>
                  setExpandedTerm(
                    expandedTerm === term.term ? null : term.term
                  )
                }
                className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-bg-narration transition-colors"
              >
                <div>
                  <span className="font-semibold text-text-primary">
                    {term.term}
                  </span>
                  <span className="ml-3 text-xs text-text-muted">
                    {term.category}
                  </span>
                </div>
                <ChevronRight
                  size={16}
                  className={`text-text-muted transition-transform ${
                    expandedTerm === term.term ? 'rotate-90' : ''
                  }`}
                />
              </button>

              <AnimatePresence>
                {expandedTerm === term.term && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="border-t border-border-subtle"
                  >
                    <div className="px-5 py-5 bg-bg-narration space-y-4">
                      {/* Header */}
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs font-bold tracking-widest text-text-muted uppercase">
                          {term.term}
                        </h3>
                        <span className="text-[10px] font-medium px-2.5 py-1 rounded-full bg-accent-indigo/[0.07] text-accent-indigo border border-accent-indigo/20">
                          {term.category}
                        </span>
                      </div>

                      {/* Definition */}
                      <div>
                        {renderDefinition(term.definition, allTermNames, navigateToTerm)}
                      </div>

                      {/* Formula */}
                      {term.keyFormula && (
                        <div className="bg-bg-elevated rounded-lg p-4 border border-border-subtle">
                          <div className="text-[10px] font-bold tracking-widest text-text-muted uppercase mb-2">
                            Formule
                          </div>
                          <div className="font-mono text-[15px] text-text-primary leading-relaxed">
                            {term.keyFormula}
                          </div>
                        </div>
                      )}

                      {/* Key figures */}
                      {term.keyFigure && (
                        <div className="bg-bg-elevated rounded-lg p-4 border-l-[3px] border-l-accent-indigo border border-border-subtle">
                          <div className="text-[10px] font-bold tracking-widest text-text-muted uppercase mb-2">
                            Chiffres cles
                          </div>
                          <div className="text-sm text-text-primary leading-relaxed">
                            {term.keyFigure.split('|').map((part, idx) => (
                              <span key={idx} className="inline-block mr-1">
                                {idx > 0 && <span className="text-text-muted mx-1">|</span>}
                                {part.split(/(\d[\d\s,.]*\s*(?:%|Md|EUR|USD|M|milliard[s]?|million[s]?)?)/).map((seg, sIdx) => {
                                  if (/\d/.test(seg) && /(%|Md|EUR|USD|M|milliard|million)/.test(seg)) {
                                    return (
                                      <span key={sIdx} className="font-mono font-bold text-accent-indigo">
                                        {seg}
                                      </span>
                                    );
                                  }
                                  return <span key={sIdx}>{seg}</span>;
                                })}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* See also */}
                      {term.seeAlso && term.seeAlso.length > 0 && (
                        <div>
                          <span className="text-[10px] font-bold tracking-widest text-text-muted uppercase">
                            Voir aussi
                          </span>
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {term.seeAlso.map((related) => {
                              const exists = glossary.some((g) => g.term === related);
                              if (!exists) return null;
                              return (
                                <button
                                  key={related}
                                  onClick={() => navigateToTerm(related)}
                                  className="px-2.5 py-1 rounded-full text-xs font-medium bg-accent-indigo/[0.07] text-accent-indigo border border-accent-indigo/20 hover:bg-accent-indigo/[0.15] transition-colors cursor-pointer"
                                >
                                  {related}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Related modules */}
                      {term.relatedModules.length > 0 && (
                        <div>
                          <span className="text-[10px] font-bold tracking-widest text-text-muted uppercase">
                            Modules lies
                          </span>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {term.relatedModules.map((slug) => (
                              <Link
                                key={slug}
                                href={`/module/${slug}`}
                                className="text-xs text-accent-indigo hover:underline"
                              >
                                {slug}
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {filteredTerms.length === 0 && (
          <div className="text-center py-16 text-text-muted">
            Aucun terme ne correspond a votre recherche.
          </div>
        )}
      </div>
    </main>
  );
}
