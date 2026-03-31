import type { Metadata } from 'next';
import { modulesCatalog } from '@/data/modules-catalog';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const mod = modulesCatalog.find(m => m.slug === params.slug);
  if (!mod) return { title: 'Module introuvable' };
  return {
    title: mod.title,
    description: mod.description,
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
