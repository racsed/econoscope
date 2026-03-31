import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'À propos d\'Econoscope',
  description:
    'Econoscope est un laboratoire interactif d\'économie. Découvrez le projet, sa mission pédagogique et les technologies utilisées.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
