import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'ZERODEVLLC.EU — Security engineering, made legible',
  metadataBase: new URL('https://zerodevllc.eu'),
  description:
    'The public evidence layer for independent security engineering, defensive research, and carefully gated software.',
  openGraph: {
    title: 'ZERODEVLLC.EU — Security engineering, made legible',
    description:
      'Proof in public. Depth in private. Explore the operations console and the build map.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ZERODEVLLC.EU — Security engineering, made legible',
    description:
      'Proof in public. Depth in private. Explore the operations console and the build map.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
