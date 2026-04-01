'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FlaskConical, Menu, X, Sun, Moon, Search } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { NAV_LINKS } from '@/lib/constants';
import { useTheme } from '@/components/layout/ThemeProvider';
import { useSearchModal } from '@/components/layout/SearchModal';

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { openSearch } = useSearchModal();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-bg-card/80 backdrop-blur-lg border-b border-border">
      <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <FlaskConical className="h-5 w-5 text-accent-indigo" />
          <span className="text-lg font-bold text-text-primary">
            Econoscope
          </span>
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-indigo opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-indigo" />
          </span>
        </Link>

        {/* Nav desktop */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? 'text-accent-indigo bg-accent-indigo/[0.08]'
                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-elevated'
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          {/* Search */}
          <button
            type="button"
            onClick={openSearch}
            className="ml-2 p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-elevated transition-colors"
            aria-label="Rechercher"
          >
            <Search className="h-4.5 w-4.5" />
          </button>

          {/* Theme toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-elevated transition-colors"
            aria-label={theme === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre'}
          >
            {theme === 'dark' ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
          </button>
        </nav>

        {/* Right side mobile */}
        <div className="flex items-center gap-1 md:hidden">
          {/* Search mobile */}
          <button
            type="button"
            onClick={openSearch}
            className="p-2 text-text-secondary hover:text-text-primary transition-colors"
            aria-label="Rechercher"
          >
            <Search className="h-5 w-5" />
          </button>

          {/* Theme toggle mobile */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 text-text-secondary hover:text-text-primary transition-colors"
            aria-label={theme === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre'}
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          {/* Bouton menu mobile */}
          <button
            type="button"
            className="p-2 text-text-secondary hover:text-text-primary transition-colors"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Menu mobile */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="md:hidden overflow-hidden border-b border-border bg-bg-card/95 backdrop-blur-lg"
          >
            <div className="px-6 py-4 space-y-1">
              {NAV_LINKS.map((link) => {
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      active
                        ? 'text-accent-indigo bg-accent-indigo/[0.08]'
                        : 'text-text-secondary hover:text-text-primary hover:bg-bg-elevated'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
