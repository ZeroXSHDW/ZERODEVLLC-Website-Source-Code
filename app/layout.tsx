import type { Metadata } from 'next';
import './globals.css';
import StructuredData from './structured-data';

export const metadata: Metadata = {
  metadataBase: new URL('https://zerodevllc.com'),
  title: 'ZeroDev LLC // Defensive cyber risk and resilience',
  description: 'Authorized defensive cybersecurity, cyber-risk, technical and vendor due diligence, compliance readiness, and operational resilience services from Ireland.',
  keywords: ['ZeroDev LLC', 'authorized penetration testing', 'vulnerability assessment', 'cyber risk management', 'technical due diligence', 'vendor due diligence', 'compliance readiness', 'disaster recovery', 'business continuity', 'incident readiness', 'DEFCON', 'Ireland'],
  applicationName: 'ZeroDev LLC',
  creator: 'ZeroDev LLC',
  alternates: {
    canonical: 'https://zerodevllc.com',
  },
  openGraph: {
    title: 'ZeroDev LLC // Defensive cyber risk and resilience',
    description: 'Authorized defensive cybersecurity, due diligence, readiness, and resilience services from Ireland.',
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
    title: 'ZeroDev LLC // Defensive cyber risk and resilience',
    description: 'Authorized defensive cybersecurity, due diligence, readiness, and resilience services from Ireland.',
    images: ['/og.png'],
  },
  icons: { icon: '/favicon.svg' },
};

export const dynamic = 'force-dynamic';

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body><StructuredData />{children}</body>
    </html>
  );
}
