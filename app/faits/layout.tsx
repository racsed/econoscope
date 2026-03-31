import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Faits économiques historiques',
  description:
    'Plus de 40 événements économiques majeurs de l\'Antiquité à nos jours, reliés à des simulations interactives pour comprendre leur impact.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
