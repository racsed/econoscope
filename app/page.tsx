'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowRight,
  SlidersHorizontal,
  Eye,
  Lightbulb,
  FlaskConical,
} from 'lucide-react';
import { modulesCatalog } from '@/data/modules-catalog';
import { THEME_COLORS, type ThemeType } from '@/lib/constants';

const featuredSlugs = [
  'offre-et-demande',
  'multiplicateur-keynesien',
  'carre-magique-kaldor',
];

export default function HomePage() {
  const featuredModules = modulesCatalog.filter((m) =>
    featuredSlugs.includes(m.slug)
  );

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Animated grid background */}
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                'linear-gradient(#5B5EF4 1px, transparent 1px), linear-gradient(90deg, #5B5EF4 1px, transparent 1px)',
              backgroundSize: '60px 60px',
            }}
          />
          {/* Gradient orbs */}
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-accent-indigo/5 blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-[#22D3EE]/5 blur-[120px]" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <div className="flex items-center justify-center gap-2 mb-6">
              <FlaskConical className="text-accent-indigo" size={20} />
              <span className="text-sm font-medium text-accent-indigo uppercase tracking-widest">
                Econoscope
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
              <span className="text-text-primary">L&apos;economie,</span>
              <br />
              <span className="bg-gradient-to-r from-accent-indigo to-[#22D3EE] bg-clip-text text-transparent">
                enfin visible.
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed">
              Un laboratoire interactif pour comprendre les mecanismes economiques.
              Manipulez les variables, observez les effets, construisez votre intuition.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/explorer"
                className="group flex items-center gap-2 px-8 py-3.5 bg-accent-indigo text-white font-semibold rounded-full hover:bg-[#4F52E0] transition-all duration-200 hover:shadow-lg hover:shadow-accent-indigo/25"
              >
                Explorer les mecanismes
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>
              <Link
                href="/a-propos"
                className="px-8 py-3.5 border border-border text-text-secondary font-medium rounded-full hover:border-accent-indigo/30 hover:text-text-primary transition-all duration-200"
              >
                En savoir plus
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-center mb-16 text-text-primary"
          >
            Comment ca marche
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: SlidersHorizontal,
                title: 'Choisis un mecanisme',
                description:
                  'Offre et demande, multiplicateur keynesien, IS-LM... Chaque module isole un concept economique.',
                color: '#5B5EF4',
              },
              {
                icon: Eye,
                title: 'Manipule les variables',
                description:
                  'Deplace les curseurs, change les parametres. Les graphiques reagissent en temps reel.',
                color: '#22D3EE',
              },
              {
                icon: Lightbulb,
                title: 'Comprends les effets',
                description:
                  "La narration s'adapte a tes choix. Tu vois ce qui se passe et pourquoi.",
                color: '#34D399',
              },
            ].map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="text-center"
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
                  style={{ backgroundColor: `${step.color}1A` }}
                >
                  <step.icon size={24} style={{ color: step.color }} />
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Modules */}
      <section className="py-24 px-4 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-text-primary mb-4">
              Modules en vedette
            </h2>
            <p className="text-text-secondary">
              Commencez par ces trois mecanismes fondamentaux
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredModules.map((mod, i) => {
              const color =
                THEME_COLORS[mod.theme as ThemeType] ?? '#5B5EF4';
              return (
                <motion.div
                  key={mod.slug}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link
                    href={`/module/${mod.slug}`}
                    className="block bg-bg-card border border-border rounded-2xl p-6 h-full shadow-sm transition-all duration-300 hover:shadow-md"
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = `${color}60`;
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = '';
                    }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: `${color}15` }}
                      >
                        <div
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: color }}
                        />
                      </div>
                      <span
                        className="text-xs font-medium px-2.5 py-1 rounded-full"
                        style={{
                          backgroundColor: `${color}15`,
                          color: color,
                        }}
                      >
                        {mod.theme}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-text-primary mb-2">
                      {mod.title}
                    </h3>
                    <p className="text-sm text-text-secondary leading-relaxed">
                      {mod.description}
                    </p>
                    <div className="mt-4 flex items-center gap-1 text-sm font-medium" style={{ color }}>
                      Explorer
                      <ArrowRight size={14} />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/explorer"
              className="inline-flex items-center gap-2 px-6 py-3 border border-border text-text-secondary font-medium rounded-full hover:border-accent-indigo/30 hover:text-text-primary transition-all duration-200"
            >
              Voir tous les modules
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats/Trust */}
      <section className="py-20 px-4 bg-bg-elevated border-t border-border">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '10', label: 'Modules interactifs' },
              { value: '40+', label: 'Scenarios reels' },
              { value: '100%', label: 'Gratuit et ouvert' },
              { value: '0', label: 'Cookie de tracking' },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-2xl font-bold font-mono text-accent-indigo mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-text-secondary">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
