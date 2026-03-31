'use client';

import { motion } from 'framer-motion';
import { FlaskConical, BookOpen, Code, Users, Scale, Lightbulb } from 'lucide-react';

export default function AProposPage() {
  return (
    <main className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <FlaskConical size={28} className="text-accent-indigo" />
            <h1 className="text-3xl font-bold text-text-primary">
              A propos d&apos;Econoscope
            </h1>
          </div>

          <p className="text-lg text-text-secondary leading-relaxed mb-12">
            Econoscope est un laboratoire interactif d&apos;économie. Pas un site de
            cours, pas un manuel numerise -- un instrument pour comprendre les
            mécanismes économiques en les manipulant.
          </p>

          {/* Sections */}
          <div className="space-y-10">
            <Section
              icon={Lightbulb}
              title="Philosophie"
              color="#5B5EF4"
            >
              <p>
                L&apos;économie est souvent enseignee de manière abstraite : des
                equations, des graphiques statiques, des textes denses. Econoscope
                prend le contrepied : chaque concept devient une simulation
                interactive ou l&apos;utilisateur manipule directement les variables et
                observe les effets en temps réel.
              </p>
              <p className="mt-3">
                Ce que PhET (University of Colorado) fait pour la physique,
                Econoscope le fait pour l&apos;économie -- avec un design premium, une
                narration intelligente, et une ambition grand public.
              </p>
            </Section>

            <Section
              icon={Scale}
              title="Honnetete intellectuelle"
              color="#FBBF24"
            >
              <p>
                Chaque module affiche explicitement ses hypothèses et ses limites.
                Les modèles économiques sont des simplifications utiles, pas des
                verites absolues. Econoscope ne vend pas une ideologie : il donne
                des outils pour penser.
              </p>
              <p className="mt-3">
                Les sections "Limites du modèle" et "Dans la réalité" sont
                presentes dans chaque simulation pour ancrer la théorie dans le
                réel.
              </p>
            </Section>

            <Section
              icon={Users}
              title="Pour qui ?"
              color="#22D3EE"
            >
              <ul className="space-y-2 text-text-primary/70">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#22D3EE] mt-2 flex-shrink-0" />
                  <span>
                    <strong>Etudiants</strong> (lycee, fac, prepa, BTS) qui veulent
                    comprendre un concept vu en cours
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#22D3EE] mt-2 flex-shrink-0" />
                  <span>
                    <strong>Enseignants</strong> (SES, eco-gestion, universite) qui
                    veulent illustrer un mécanisme en classe
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#22D3EE] mt-2 flex-shrink-0" />
                  <span>
                    <strong>Curieux et autodidactes</strong> qui veulent comprendre
                    l&apos;actualite économique
                  </span>
                </li>
              </ul>
            </Section>

            <Section
              icon={Code}
              title="Technologie"
              color="#34D399"
            >
              <p>
                Econoscope est construit avec Next.js, TypeScript, Tailwind CSS,
                Framer Motion pour les animations, et D3.js/Visx pour les
                visualisations. Le moteur de simulation est modulaire : chaque
                module économique est un fichier independant avec ses equations,
                ses scenarios et sa narration.
              </p>
            </Section>

            <Section
              icon={BookOpen}
              title="Sources et références"
              color="#EC4899"
            >
              <p>
                Les modèles implementes s&apos;appuient sur les manuels de référence en
                économie : Mankiw, Blanchard, Stiglitz, Krugman. Les données
                réelles proviennent d&apos;Eurostat, de l&apos;INSEE, de la Banque mondiale
                et de l&apos;OCDE. Les scenarios historiques sont documentes.
              </p>
            </Section>
          </div>
        </motion.div>
      </div>
    </main>
  );
}

function Section({
  icon: Icon,
  title,
  color,
  children,
}: {
  icon: React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>;
  title: string;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <div className="flex items-center gap-2 mb-3">
        <Icon size={18} style={{ color }} />
        <h2 className="text-xl font-semibold text-text-primary">{title}</h2>
      </div>
      <div className="text-sm text-text-secondary leading-relaxed pl-7">
        {children}
      </div>
    </motion.div>
  );
}
