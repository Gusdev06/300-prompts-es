import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const sans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'goz.ai — AI image studio',
  description: 'Create +18 photos and videos with digital influencers in seconds — no blocks, 100% market-approved.',
  openGraph: {
    title: 'goz.ai — AI image studio',
    description: 'Create +18 photos and videos with digital influencers.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={sans.variable}>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
