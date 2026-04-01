import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Parcours guides',
  description:
    'Des sequences pedagogiques pour structurer votre apprentissage de l\'economie. Parcours STMG, SES, universitaires et thematiques.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
