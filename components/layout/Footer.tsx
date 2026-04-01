import Link from 'next/link';
import { FOOTER_LINKS } from '@/lib/constants';

export default function Footer() {
  return (
    <footer className="border-t border-border bg-bg-elevated mt-auto">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {/* Marque */}
          <div>
            <p className="text-lg font-bold text-text-primary">
              Econoscope
            </p>
            <p className="mt-2 text-sm text-text-secondary leading-relaxed">
              L&apos;économie rendue visible, interactive et comprehensible.
              Un laboratoire numerique pour explorer les mécanismes économiques.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <p className="text-sm font-semibold text-text-primary uppercase tracking-wider">
              Navigation
            </p>
            <ul className="mt-3 space-y-2">
              {FOOTER_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-secondary hover:text-text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Projet */}
          <div>
            <p className="text-sm font-semibold text-text-primary uppercase tracking-wider">
              Projet
            </p>
            <p className="mt-3 text-sm text-text-secondary leading-relaxed">
              Un projet a vocation pédagogique.
              Concu pour rendre l&apos;économie accessible a tous.
            </p>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6 text-center">
          <p className="text-xs text-text-secondary/60">
            Econoscope -- Laboratoire interactif d&apos;économie
          </p>
        </div>
      </div>
    </footer>
  );
}
