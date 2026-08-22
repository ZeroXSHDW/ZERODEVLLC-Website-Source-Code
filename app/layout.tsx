import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ZeroDev LLC // European Operations Index',
  description: 'The European operations index for ZeroDev DEFCON and Threat Ops live systems.',
  keywords: ['ZeroDev LLC', 'DEFCON', 'Threat Ops', 'threat intelligence', 'signal fusion'],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
