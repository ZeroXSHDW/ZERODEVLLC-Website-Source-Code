import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://zerodevllc.com'),
  title: 'ZeroDev LLC // Build for the edge',
  description: 'ZeroDev LLC builds high-signal software, threat intelligence surfaces, and resilient interfaces from Ireland, including the DEFCON Signal Fusion EU gateway.',
  keywords: ['ZeroDev LLC', 'software engineering', 'threat intelligence', 'DEFCON', 'Ireland'],
  applicationName: 'ZeroDev LLC',
  creator: 'ZeroDev LLC',
  alternates: {
    canonical: 'https://zerodevllc.com',
  },
  openGraph: {
    title: 'ZeroDev LLC // Build for the edge',
    description: 'High-signal software, threat intelligence surfaces, and the DEFCON Signal Fusion EU gateway from Ireland.',
    url: 'https://zerodevllc.com',
    siteName: 'ZeroDev LLC',
    type: 'website',
    locale: 'en_IE',
    images: [{
      url: '/og.png',
      width: 1200,
      height: 630,
      alt: 'ZeroDev LLC — Signal in. Systems out.',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ZeroDev LLC // Build for the edge',
    description: 'High-signal software, threat intelligence surfaces, and the DEFCON Signal Fusion EU gateway from Ireland.',
    images: ['/og.png'],
  },
  icons: { icon: '/favicon.svg' },
};

export const dynamic = 'force-dynamic';

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
