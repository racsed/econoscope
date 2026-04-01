import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Carte economique mondiale',
  description:
    'Visualisez les indicateurs economiques par pays : coefficient de Gini, croissance du PIB, inflation, chomage, dette publique et balance commerciale.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
