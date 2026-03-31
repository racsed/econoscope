import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { ThemeProvider } from '@/components/layout/ThemeProvider';
import { ServiceWorkerRegister } from '@/components/layout/ServiceWorkerRegister';
import '@/styles/globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: {
    default: "Econoscope — L'économie, enfin visible",
    template: '%s | Econoscope',
  },
  description: "Laboratoire interactif d'économie. 16 simulations visuelles pour comprendre les mécanismes économiques : offre-demande, IS-LM, multiplicateur keynésien, et plus.",
  keywords: ['économie', 'simulation', 'interactif', 'pédagogique', 'IS-LM', 'offre demande', 'multiplicateur keynésien', 'courbe de Phillips', 'macroéconomie', 'microéconomie'],
  authors: [{ name: 'Econoscope' }],
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    siteName: 'Econoscope',
    title: "Econoscope — L'économie, enfin visible",
    description: "Laboratoire interactif d'économie. Manipulez les variables, observez les effets, construisez votre intuition.",
  },
  twitter: {
    card: 'summary_large_image',
    title: "Econoscope — L'économie, enfin visible",
    description: "Laboratoire interactif d'économie.",
  },
  robots: {
    index: true,
    follow: true,
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Econoscope',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" data-theme="light" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icon.svg" />
      </head>
      <body className="min-h-screen flex flex-col antialiased bg-bg-primary text-text-primary">
        <ThemeProvider>
          <Header />
          <div className="flex-1">{children}</div>
          <Footer />
          <ServiceWorkerRegister />
        </ThemeProvider>
      </body>
    </html>
  );
}
