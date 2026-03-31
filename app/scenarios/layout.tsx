import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Scénarios économiques',
  description:
    'Des scenarios pré-configurés pour explorer des situations économiques concrètes : crises, politiques monétaires, chocs pétroliers et plus.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
