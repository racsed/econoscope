'use client';

import {
  useState,
  useEffect,
  useMemo,
  useRef,
  createContext,
  useContext,
  useCallback,
} from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  X,
  FlaskConical,
  BookOpen,
  History,
  GraduationCap,
  Globe,
  ArrowRight,
} from 'lucide-react';
import { modulesCatalog } from '@/data/modules-catalog';
import { glossary } from '@/data/glossary';
import { economicFacts } from '@/data/economic-facts';
import { parcoursList } from '@/data/parcours';

interface SearchResult {
  type: 'module' | 'glossaire' | 'fait' | 'parcours';
  title: string;
  subtitle: string;
  href: string;
}

const TYPE_META: Record<
  SearchResult['type'],
  { label: string; icon: typeof FlaskConical; color: string }
> = {
  module: { label: 'Module', icon: FlaskConical, color: 'text-accent-indigo' },
  glossaire: { label: 'Glossaire', icon: BookOpen, color: 'text-emerald-500' },
  fait: { label: 'Fait', icon: History, color: 'text-amber-500' },
  parcours: { label: 'Parcours', icon: GraduationCap, color: 'text-sky-500' },
};

/* ── Context for opening the modal from anywhere ── */

interface SearchModalContextValue {
  openSearch: () => void;
}

const SearchModalContext = createContext<SearchModalContextValue>({
  openSearch: () => {},
});

export function useSearchModal() {
  return useContext(SearchModalContext);
}

/* ── Provider + Modal ── */

export function SearchModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const openSearch = useCallback(() => setIsOpen(true), []);

  return (
    <SearchModalContext.Provider value={{ openSearch }}>
      {children}
      <SearchModalInner isOpen={isOpen} setIsOpen={setIsOpen} />
    </SearchModalContext.Provider>
  );
}

/* ── Modal inner ── */

function SearchModalInner({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
}) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Cmd+K / Ctrl+K global listener
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [setIsOpen]);

  // Auto-focus when opened
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Debounced query
  const [debouncedQuery, setDebouncedQuery] = useState('');
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 150);
    return () => clearTimeout(t);
  }, [query]);

  // Search logic
  const results = useMemo(() => {
    if (!debouncedQuery.trim()) return [];
    const q = debouncedQuery.toLowerCase();
    const matches: SearchResult[] = [];

    // Modules
    modulesCatalog
      .filter((m) => m.available)
      .forEach((m) => {
        if (
          m.title.toLowerCase().includes(q) ||
          m.description.toLowerCase().includes(q)
        ) {
          matches.push({
            type: 'module',
            title: m.title,
            subtitle: m.subtitle,
            href: `/module/${m.slug}`,
          });
        }
      });

    // Glossary
    glossary.forEach((g) => {
      if (
        g.term.toLowerCase().includes(q) ||
        g.definition.toLowerCase().includes(q)
      ) {
        matches.push({
          type: 'glossaire',
          title: g.term,
          subtitle: g.definition.slice(0, 80) + '...',
          href: '/glossaire',
        });
      }
    });

    // Facts
    economicFacts.forEach((f) => {
      if (
        f.title.toLowerCase().includes(q) ||
        f.summary.toLowerCase().includes(q)
      ) {
        matches.push({
          type: 'fait',
          title: f.title,
          subtitle: f.year + ' - ' + f.summary.slice(0, 60) + '...',
          href: `/faits/${f.id}`,
        });
      }
    });

    // Parcours
    parcoursList.forEach((p) => {
      if (
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      ) {
        matches.push({
          type: 'parcours',
          title: p.title,
          subtitle: p.description.slice(0, 80) + '...',
          href: `/parcours/${p.id}`,
        });
      }
    });

    return matches.slice(0, 12);
  }, [debouncedQuery]);

  // Reset selection when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [results]);

  // Scroll selected item into view
  useEffect(() => {
    if (!listRef.current) return;
    const el = listRef.current.children[selectedIndex] as HTMLElement | undefined;
    el?.scrollIntoView({ block: 'nearest' });
  }, [selectedIndex]);

  const navigate = (href: string) => {
    router.push(href);
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      navigate(results[selectedIndex].href);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-x-0 top-[15vh] z-[101] mx-auto w-[calc(100%-2rem)] max-w-lg"
          >
            <div className="overflow-hidden rounded-2xl border border-border bg-bg-card shadow-2xl">
              {/* Search input */}
              <div className="flex items-center gap-3 border-b border-border px-4 py-3">
                <Search className="h-5 w-5 shrink-0 text-text-secondary" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Rechercher un module, un terme, un fait..."
                  className="flex-1 bg-transparent text-lg text-text-primary placeholder:text-text-secondary/50 outline-none"
                />
                <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded-md border border-border bg-bg-elevated px-1.5 py-0.5 text-[11px] font-medium text-text-secondary">
                  <span className="text-xs">&#8984;</span>K
                </kbd>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="rounded-md p-1 text-text-secondary hover:text-text-primary hover:bg-bg-elevated transition-colors"
                  aria-label="Fermer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Results */}
              <div
                ref={listRef}
                className="max-h-[50vh] overflow-y-auto overscroll-contain"
              >
                {debouncedQuery.trim() && results.length === 0 && (
                  <div className="px-4 py-10 text-center text-sm text-text-secondary">
                    Aucun resultat pour &laquo;&nbsp;{debouncedQuery}&nbsp;&raquo;
                  </div>
                )}

                {results.map((result, i) => {
                  const meta = TYPE_META[result.type];
                  const Icon = meta.icon;
                  const isSelected = i === selectedIndex;

                  return (
                    <button
                      key={`${result.type}-${result.href}-${i}`}
                      type="button"
                      onClick={() => navigate(result.href)}
                      onMouseEnter={() => setSelectedIndex(i)}
                      className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-colors ${
                        isSelected ? 'bg-bg-elevated' : ''
                      }`}
                    >
                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-bg-elevated ${meta.color}`}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-text-primary">
                          {result.title}
                        </p>
                        <p className="truncate text-xs text-text-secondary">
                          {result.subtitle}
                        </p>
                      </div>
                      <span className="shrink-0 rounded-full border border-border px-2 py-0.5 text-[10px] font-medium text-text-secondary">
                        {meta.label}
                      </span>
                      {isSelected && (
                        <ArrowRight className="h-3.5 w-3.5 shrink-0 text-text-secondary" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Footer hints */}
              <div className="flex items-center justify-between border-t border-border px-4 py-2">
                <span className="text-[11px] text-text-secondary/60">
                  Echap pour fermer
                </span>
                <div className="flex items-center gap-2 text-[11px] text-text-secondary/60">
                  <span className="flex items-center gap-1">
                    <kbd className="inline-flex items-center rounded border border-border bg-bg-elevated px-1 py-0.5 text-[10px]">
                      &#8593;
                    </kbd>
                    <kbd className="inline-flex items-center rounded border border-border bg-bg-elevated px-1 py-0.5 text-[10px]">
                      &#8595;
                    </kbd>
                    naviguer
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="inline-flex items-center rounded border border-border bg-bg-elevated px-1 py-0.5 text-[10px]">
                      &#9166;
                    </kbd>
                    ouvrir
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
