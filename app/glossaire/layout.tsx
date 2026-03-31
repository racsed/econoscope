import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Glossaire économique',
  description:
    'Plus de 45 termes économiques expliqués simplement : PIB, inflation, taux directeur, élasticité, externalité, et bien plus.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
