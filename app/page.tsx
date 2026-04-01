'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowRight,
  SlidersHorizontal,
  Eye,
  Lightbulb,
  FlaskConical,
  History,
  GraduationCap,
  BookOpen,
  Globe,
  Presentation,
} from 'lucide-react';
import { modulesCatalog } from '@/data/modules-catalog';
import { THEME_COLORS, type ThemeType } from '@/lib/constants';

function CountUpNumber({ value, suffix = '', duration = 1.5 }: { value: number; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start: number | null = null;
    const animate = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(value * eased));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [isInView, value, duration]);

  return <span ref={ref} className="font-mono font-bold text-4xl text-white tabular-nums">{display}{suffix}</span>;
}

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
      {/* ─── Hero ─── */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background grid + chart lines */}
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage:
                'linear-gradient(#5B5EF4 1px, transparent 1px), linear-gradient(90deg, #5B5EF4 1px, transparent 1px)',
              backgroundSize: '60px 60px',
            }}
          />
          {/* Animated SVG line chart */}
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 1200 800"
            preserveAspectRatio="xMidYMid slice"
            style={{ opacity: 0.05 }}
          >
            <style>{`
              @keyframes drawLine {
                from { stroke-dashoffset: 2000; }
                to { stroke-dashoffset: 0; }
              }
              @keyframes drawLineSecond {
                from { stroke-dashoffset: 2000; }
                to { stroke-dashoffset: 0; }
              }
              @keyframes pulse1 {
                0%, 100% { r: 4; opacity: 0.6; }
                50% { r: 7; opacity: 1; }
              }
              @keyframes pulse2 {
                0%, 100% { r: 3; opacity: 0.5; }
                50% { r: 6; opacity: 0.9; }
              }
              @keyframes pulse3 {
                0%, 100% { r: 5; opacity: 0.4; }
                50% { r: 8; opacity: 0.8; }
              }
              .hero-line-1 {
                stroke-dasharray: 2000;
                animation: drawLine 4s ease-in-out forwards, drawLine 4s ease-in-out 6s infinite;
              }
              .hero-line-2 {
                stroke-dasharray: 2000;
                animation: drawLineSecond 4s ease-in-out 1s forwards, drawLineSecond 4s ease-in-out 7s infinite;
              }
              .hero-dot-1 { animation: pulse1 3s ease-in-out infinite; }
              .hero-dot-2 { animation: pulse2 3.5s ease-in-out 0.5s infinite; }
              .hero-dot-3 { animation: pulse3 4s ease-in-out 1s infinite; }
            `}</style>
            <path
              className="hero-line-1"
              d="M 50 600 C 200 580, 300 400, 450 350 S 650 200, 800 280 S 1000 150, 1150 100"
              fill="none"
              stroke="#5B5EF4"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <path
              className="hero-line-2"
              d="M 50 650 C 200 630, 350 550, 500 500 S 700 380, 850 420 S 1050 300, 1150 250"
              fill="none"
              stroke="#22D3EE"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <circle className="hero-dot-1" cx="450" cy="350" fill="#5B5EF4" />
            <circle className="hero-dot-2" cx="800" cy="280" fill="#22D3EE" />
            <circle className="hero-dot-3" cx="1050" cy="160" fill="#5B5EF4" />
          </svg>
          {/* Gradient orbs */}
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-accent-indigo/[0.02] blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-[#22D3EE]/[0.02] blur-[120px]" />
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
                className="group flex items-center gap-2 px-8 py-3.5 bg-accent-indigo text-white font-semibold rounded-full shadow-lg shadow-accent-indigo/0 hover:shadow-accent-indigo/25 hover:bg-[#4F52E0] active:scale-[0.98] transition-all duration-200"
              >
                Explorer les simulateurs
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>
              <Link
                href="/glossaire"
                className="px-8 py-3.5 border border-border text-text-secondary font-medium rounded-full hover:border-accent-indigo/30 hover:text-text-primary active:scale-[0.98] transition-all duration-200"
              >
                Decouvrir le glossaire
              </Link>
            </div>

            {/* Mini stats row */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="mt-10 text-sm text-text-muted"
            >
              17 simulateurs &bull; 40 faits historiques &bull; 20 economistes
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ─── How it works ─── */}
      <section className="py-28 px-4 bg-bg-elevated">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-text-primary mb-3">
              Trois etapes pour comprendre
            </h2>
            <p className="text-text-secondary max-w-xl mx-auto">
              Une experience pedagogique pensee pour la classe et l&apos;etudiant.
            </p>
          </motion.div>

          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Connecting line between steps on desktop */}
            <div className="hidden md:block absolute top-[3.5rem] left-[calc(16.67%+1rem)] right-[calc(16.67%+1rem)] h-px bg-gradient-to-r from-[#5B5EF4]/30 via-[#22D3EE]/30 to-[#34D399]/30" />

            {[
              {
                icon: SlidersHorizontal,
                title: 'Choisissez un mecanisme',
                description:
                  'Offre et demande, multiplicateur keynesien, IS-LM... Chaque module isole un concept economique precis.',
                color: '#5B5EF4',
                step: '01',
              },
              {
                icon: Eye,
                title: 'Manipulez les variables',
                description:
                  'Deplacez les curseurs, changez les parametres. Les graphiques reagissent en temps reel sous vos yeux.',
                color: '#22D3EE',
                step: '02',
              },
              {
                icon: Lightbulb,
                title: 'Comprenez les effets',
                description:
                  "La narration s'adapte a vos choix. Vous voyez ce qui se passe et pourquoi.",
                color: '#34D399',
                step: '03',
              },
            ].map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative text-center bg-bg-card border border-border rounded-2xl p-8 pt-10 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/5"
              >
                {/* Large step number behind icon */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 text-7xl font-black font-mono text-text-primary/[0.03] select-none pointer-events-none leading-none">
                  {step.step}
                </div>
                <div
                  className="relative w-14 h-14 rounded-full bg-bg-elevated flex items-center justify-center mx-auto mb-5"
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

      {/* ─── Featured Modules ─── */}
      <section className="py-28 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-text-primary mb-4">
              Explorez nos modules interactifs
            </h2>
            <p className="text-text-secondary max-w-2xl mx-auto">
              Des simulations conçues pour rendre les concepts economiques tangibles et manipulables.
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
                    className="group block bg-bg-card border border-border rounded-2xl p-8 h-full shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = `${color}60`;
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = '';
                    }}
                  >
                    <div className="flex items-start justify-between mb-6">
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
                    <h3 className="text-lg font-semibold text-text-primary mb-3">
                      {mod.title}
                    </h3>
                    <p className="text-sm text-text-secondary leading-relaxed mb-6">
                      {mod.description}
                    </p>
                    <div className="flex items-center gap-1 text-sm font-medium" style={{ color }}>
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

      {/* ─── Testimonials ─── */}
      <section className="py-28 px-4 bg-bg-elevated">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-text-primary mb-3">
              Ce qu&apos;en disent nos utilisateurs
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                number: '#1',
                label: 'Etudiant',
                quote: 'Je comprends enfin IS-LM grace aux simulations interactives. Les concepts deviennent concrets.',
                name: 'Lucas M.',
                color: '#5B5EF4',
              },
              {
                number: '#2',
                label: 'Enseignant',
                quote: 'Je projette les modules en cours, mes eleves manipulent en direct. Un vrai outil pedagogique.',
                name: 'Sophie R.',
                color: '#22D3EE',
              },
              {
                number: '#3',
                label: 'Autodidacte',
                quote: "Les faits historiques avec simulateur integre, c'est exactement ce qu'il manquait pour apprendre.",
                name: 'Karim B.',
                color: '#34D399',
              },
            ].map((item, i) => (
              <motion.div
                key={item.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className="bg-bg-card border border-border rounded-2xl p-8 flex flex-col shadow-sm"
              >
                <span
                  className="text-3xl font-black font-mono mb-4"
                  style={{ color: item.color }}
                >
                  {item.number}
                </span>
                <p className="text-sm text-text-secondary italic leading-relaxed mb-6 flex-1">
                  &laquo;&nbsp;{item.quote}&nbsp;&raquo;
                </p>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-text-primary">{item.name}</span>
                  <span
                    className="text-xs font-semibold px-3 py-1 rounded-full"
                    style={{ backgroundColor: `${item.color}15`, color: item.color }}
                  >
                    {item.label}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Stats (dark section) ─── */}
      <section className="py-28 px-4 bg-[#1A1D26]">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-white mb-3">
              Econoscope en chiffres
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Une plateforme riche et en constante evolution.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 text-center">
            {[
              { value: 17, suffix: '', label: 'Simulateurs interactifs' },
              { value: 40, suffix: '', label: 'Faits historiques' },
              { value: 20, suffix: '', label: 'Economistes cites' },
              { value: 48, suffix: '', label: 'Termes au glossaire' },
              { value: 30, suffix: '+', label: 'Pays sur la carte' },
              { value: 80, suffix: '+', label: 'Scenarios preconfigures' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex flex-col items-center gap-2"
              >
                <CountUpNumber value={stat.value} suffix={stat.suffix} />
                <div className="text-sm text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Final CTA ─── */}
      <section className="py-28 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="bg-accent-indigo rounded-2xl px-8 py-16 sm:px-16 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Pret a explorer l&apos;economie autrement ?
              </h2>
              <p className="text-white/80 max-w-xl mx-auto mb-10 leading-relaxed">
                Rejoignez les milliers d&apos;etudiants et enseignants qui utilisent Econoscope au quotidien.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/explorer"
                  className="px-8 py-3.5 bg-white text-accent-indigo font-semibold rounded-full hover:bg-white/90 active:scale-[0.98] transition-all duration-200"
                >
                  Commencer gratuitement
                </Link>
                <Link
                  href="/a-propos"
                  className="px-8 py-3.5 border border-white/40 text-white font-medium rounded-full hover:border-white/70 active:scale-[0.98] transition-all duration-200"
                >
                  En savoir plus
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
}
