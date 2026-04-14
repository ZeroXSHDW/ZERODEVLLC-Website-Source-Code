import type { Metadata, Viewport } from 'next';
import './globals.css';
import { ServiceWorkerProvider } from '@/components/ServiceWorkerProvider';
import { Toaster } from 'sonner';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'ZeroDevLLC - Enterprise Software Solutions',
  description: 'ZeroDevLLC is an Irish-based enterprise software development company specializing in 3D visualization, trading systems, and cybersecurity.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'ZeroDevLLC',
  },
  applicationName: 'ZeroDevLLC',
  keywords: ['ZeroDevLLC', 'Software Development', 'Ireland', '3D Visualization', 'Trading Systems', 'Cybersecurity'],
  authors: [{ name: 'ZeroDevLLC' }],
  icons: {
    icon: '/icon-192x192.png',
    apple: '/icon-192x192.png',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#000000',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ServiceWorkerProvider>
          {children}
          <Footer />
          <Toaster
            position="top-right"
            richColors
            closeButton
            toastOptions={{
              duration: 4000,
            }}
          />
        </ServiceWorkerProvider>
      </body>
    </html>
  );
}
