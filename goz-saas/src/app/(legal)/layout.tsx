import Link from 'next/link';
import Logo from '@/components/Logo';

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-ink-900 text-bone">
      <header className="fixed top-4 left-2 right-2 md:top-5 md:left-6 md:right-6 z-50">
        <nav className="max-w-[980px] mx-auto flex items-center justify-between px-4 md:px-6 py-3 bg-ink-800/60 backdrop-blur-md border border-white/10 rounded-2xl">
          <Link href="/" className="flex items-center gap-2 font-bold text-base md:text-lg text-bone">
            <Logo />
            goz.ai
          </Link>
          <Link href="/" className="text-sm text-bone-dim hover:text-bone transition-colors">
            ← home
          </Link>
        </nav>
      </header>

      <main className="max-w-[760px] mx-auto px-5 pt-32 pb-20">{children}</main>

      <footer className="border-t border-white/10 py-8 text-center text-bone-mute text-xs space-y-1.5">
        <p>goz.ai © {new Date().getFullYear()}</p>
        <p>
          <Link href="/terms" className="hover:text-bone">Terms</Link>
          <span className="mx-2">•</span>
          <Link href="/privacy" className="hover:text-bone">Privacy</Link>
        </p>
      </footer>
    </div>
  );
}
