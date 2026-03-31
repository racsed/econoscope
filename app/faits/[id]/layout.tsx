import type { Metadata } from 'next';
import { economicFacts } from '@/data/economic-facts';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const fact = economicFacts.find(f => f.id === params.id);
  if (!fact) return { title: 'Fait introuvable' };
  return {
    title: `${fact.title} (${fact.year})`,
    description: fact.summary,
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
