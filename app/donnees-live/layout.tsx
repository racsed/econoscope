import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Donnees en direct',
  description:
    'Indicateurs economiques mondiaux en temps reel via l\'API Banque mondiale : PIB, inflation, chomage, dette publique, indice de Gini et balance commerciale.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
