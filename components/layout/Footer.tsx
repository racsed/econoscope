import Link from 'next/link';
import { NAV_LINKS } from '@/lib/constants';

export default function Footer() {
  return (
    <footer className="border-t border-[#E2E4E9] bg-[#F4F5F7] mt-auto">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {/* Marque */}
          <div>
            <p className="text-lg font-bold text-[#1A1D26]">
              Econoscope
            </p>
            <p className="mt-2 text-sm text-[#5F6980] leading-relaxed">
              L&apos;economie rendue visible, interactive et comprehensible.
              Un laboratoire numerique pour explorer les mecanismes economiques.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <p className="text-sm font-semibold text-[#1A1D26] uppercase tracking-wider">
              Navigation
            </p>
            <ul className="mt-3 space-y-2">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#5F6980] hover:text-[#1A1D26] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Projet */}
          <div>
            <p className="text-sm font-semibold text-[#1A1D26] uppercase tracking-wider">
              Projet
            </p>
            <p className="mt-3 text-sm text-[#5F6980] leading-relaxed">
              Un projet open-source a vocation pedagogique.
              Concu pour rendre l&apos;economie accessible a tous.
            </p>
          </div>
        </div>

        <div className="mt-10 border-t border-[#E2E4E9] pt-6 text-center">
          <p className="text-xs text-[#5F6980]/60">
            Econoscope -- Laboratoire interactif d&apos;economie
          </p>
        </div>
      </div>
    </footer>
  );
}
