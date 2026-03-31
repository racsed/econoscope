'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, BookOpen, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { glossary } from '@/data/glossary';

export default function GlossairePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedTerm, setExpandedTerm] = useState<string | null>(null);

  const categories = useMemo(() => {
    const cats = new Set(glossary.map((t) => t.category));
    return ['all', ...Array.from(cats).sort()];
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

  return (
    <main className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-3">
            <BookOpen size={24} className="text-[#6366F1]" />
            <h1 className="text-3xl font-bold text-[#E8E8ED]">Glossaire</h1>
          </div>
          <p className="text-[#8888A0]">
            {glossary.length} termes economiques expliques simplement
          </p>
        </motion.div>

        {/* Search */}
        <div className="mb-6 relative max-w-md">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5A5A70]"
          />
          <input
            type="text"
            placeholder="Rechercher un terme..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#141419] border border-[#2A2A35] rounded-xl text-[#E8E8ED] placeholder:text-[#5A5A70] focus:outline-none focus:border-[#6366F1]/50 transition-colors"
          />
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className="px-3 py-1.5 rounded-full text-xs font-medium border transition-all"
              style={{
                borderColor: selectedCategory === cat ? '#6366F1' : '#2A2A35',
                backgroundColor: selectedCategory === cat ? '#6366F115' : 'transparent',
                color: selectedCategory === cat ? '#6366F1' : '#8888A0',
              }}
            >
              {cat === 'all' ? 'Toutes categories' : cat}
            </button>
          ))}
        </div>

        {/* Terms list */}
        <div className="space-y-2">
          {filteredTerms.map((term, i) => (
            <motion.div
              key={term.term}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.02 }}
              className="bg-[#141419] border border-[#2A2A35] rounded-xl overflow-hidden"
            >
              <button
                onClick={() =>
                  setExpandedTerm(
                    expandedTerm === term.term ? null : term.term
                  )
                }
                className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-[#1C1C24] transition-colors"
              >
                <div>
                  <span className="font-semibold text-[#E8E8ED]">
                    {term.term}
                  </span>
                  <span className="ml-3 text-xs text-[#5A5A70]">
                    {term.category}
                  </span>
                </div>
                <ChevronRight
                  size={16}
                  className={`text-[#5A5A70] transition-transform ${
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
                    className="border-t border-[#1E1E28]"
                  >
                    <div className="px-5 py-4">
                      <p className="text-sm text-[#E8E8ED]/80 leading-relaxed mb-3">
                        {term.definition}
                      </p>
                      {term.relatedModules.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          <span className="text-xs text-[#5A5A70]">
                            Modules lies :
                          </span>
                          {term.relatedModules.map((slug) => (
                            <Link
                              key={slug}
                              href={`/module/${slug}`}
                              className="text-xs text-[#6366F1] hover:underline"
                            >
                              {slug}
                            </Link>
                          ))}
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
          <div className="text-center py-16 text-[#5A5A70]">
            Aucun terme ne correspond a votre recherche.
          </div>
        )}
      </div>
    </main>
  );
}
