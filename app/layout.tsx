import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ToastProvider } from '@/components/ui/Toast';

export const metadata: Metadata = {
  title: 'Pathwise — Guidance for what\u2019s next',
  description: 'Thoughtful guidance for life\u2019s important decisions. Explore advice, talk to experts, and figure out your next step.',
  openGraph: {
    title: 'Pathwise — Guidance for what\u2019s next',
    description: 'Thoughtful guidance for life\u2019s important decisions.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ToastProvider>
          <Navbar />
          <main className="min-h-[60vh]">{children}</main>
          <Footer />
        </ToastProvider>
      </body>
    </html>
  );
}
