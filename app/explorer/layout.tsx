import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Explorer les mécanismes économiques',
  description:
    '16 modules de simulation interactive : microéconomie, macroéconomie, monétaire, commerce international, fiscalité et inégalités.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
