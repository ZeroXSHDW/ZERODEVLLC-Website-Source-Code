import type { Metadata } from 'next';
import './globals.css';
import StructuredData from './structured-data';

export const metadata: Metadata = {
  metadataBase: new URL('https://zerodevllc.com'),
  title: 'ZeroDev LLC // Defensive cyber risk and resilience',
  description: 'Authorized defensive cybersecurity for public-sector programs, military and defense suppliers, essential services, and regulated technology teams: penetration testing, vulnerability assessment, cyber-risk management, technical and vendor due diligence, penetration-testing frameworks, compliance readiness, disaster recovery, business continuity planning, and incident readiness from Ireland.',
  keywords: ['ZeroDev LLC', 'public-sector cybersecurity', 'government cybersecurity', 'military cybersecurity', 'defense supplier assurance', 'authorized penetration testing', 'vulnerability assessment', 'cyber risk management', 'technical due diligence', 'vendor due diligence', 'vendor risk management', 'penetration testing frameworks', 'compliance readiness', 'CMMC applicability', 'NIST CSF 2.0', 'NIS2', 'DORA', 'disaster recovery', 'business continuity planning', 'BCP', 'incident readiness', 'DEFCON', 'Ireland'],
  applicationName: 'ZeroDev LLC',
  creator: 'ZeroDev LLC',
  alternates: {
    canonical: 'https://zerodevllc.com',
  },
  openGraph: {
    title: 'ZeroDev LLC // Defensive cyber risk and resilience',
    description: 'Authorized defensive cybersecurity, penetration testing, due diligence, compliance readiness, disaster recovery, BCP, and resilience services for public-sector and defense-oriented teams from Ireland.',
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
    description: 'Authorized defensive cybersecurity, penetration testing, due diligence, compliance readiness, disaster recovery, BCP, and resilience services for public-sector and defense-oriented teams from Ireland.',
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
