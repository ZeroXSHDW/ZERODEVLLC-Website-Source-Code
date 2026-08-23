import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ZeroDev LLC // Build for the edge',
  description: 'ZeroDev LLC builds high-signal software, threat intelligence surfaces, and resilient interfaces from Ireland, including the DEFCON Signal Fusion EU gateway.',
  keywords: ['ZeroDev LLC', 'software engineering', 'threat intelligence', 'DEFCON', 'Ireland'],
  alternates: {
    canonical: 'https://zerodevllc.com',
  },
  openGraph: {
    title: 'ZeroDev LLC // Build for the edge',
    description: 'High-signal software, threat intelligence surfaces, and the DEFCON Signal Fusion EU gateway from Ireland.',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'ZeroDev LLC // Build for the edge',
    description: 'High-signal software, threat intelligence surfaces, and the DEFCON Signal Fusion EU gateway from Ireland.',
  },
};

export const dynamic = 'force-dynamic';

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
