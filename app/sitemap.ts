import { MetadataRoute } from 'next';
import { modulesCatalog } from '@/data/modules-catalog';
import { economicFacts } from '@/data/economic-facts';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://econoscope-six.vercel.app';

  const staticPages = ['', '/explorer', '/glossaire', '/scenarios', '/faits', '/a-propos'].map(path => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: path === '' ? 1 : 0.8,
  }));

  const modulePages = modulesCatalog.filter(m => m.available).map(m => ({
    url: `${base}/module/${m.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.9,
  }));

  const factPages = economicFacts.map(f => ({
    url: `${base}/faits/${f.id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...modulePages, ...factPages];
}
