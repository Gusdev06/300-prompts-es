import Link from 'next/link';
import { t, type Lang } from '@/lib/i18n';
import { logoutAction } from '@/lib/actions/auth';
import NavTabs from './NavTabs';
import Logo from './Logo';

export default function AppShell({
  children,
  lang,
  credits,
  email,
}: {
  children: React.ReactNode;
  lang: Lang;
  credits: number;
  email: string | null;
}) {
  const isAnon = !email;
  return (
    <div className="min-h-screen flex flex-col bg-ink-900">
      {/* Floating nav matching landing */}
      <header className="fixed top-4 left-2 right-2 md:top-5 md:left-6 md:right-6 z-50">
        <nav className="max-w-[1280px] mx-auto flex items-center justify-between gap-4 px-4 md:px-6 py-3 bg-ink-800/60 backdrop-blur-md border border-white/10 rounded-2xl">
          <div className="flex items-center gap-6 md:gap-8 min-w-0">
            <Link href="/dashboard" className="flex items-center gap-2 font-bold text-base md:text-lg shrink-0">
              <Logo />
              goz.ai
            </Link>
            {!isAnon && <NavTabs lang={lang} />}
          </div>

          <div className="flex items-center gap-2 md:gap-3 shrink-0">
            {!isAnon && (
              <Link href="/pricing" className="pill hidden sm:inline-flex hover:brightness-110 transition-all">
                <span className="w-1.5 h-1.5 rounded-full bg-lime animate-pulse" />
                <span><b>{credits}</b> {t('credits', lang).toLowerCase()}</span>
              </Link>
            )}
            {isAnon ? (
              <>
                <Link href="/login" className="text-sm text-bone-dim hover:text-bone transition-colors">
                  {t('login', lang)}
                </Link>
                <Link href="/signup" className="bg-lime text-ink-900 font-bold px-4 py-2 rounded-full text-sm hover:-translate-y-px transition-transform">
                  {t('signupCta', lang)}
                </Link>
              </>
            ) : (
              <form action={logoutAction}>
                <button type="submit" className="text-sm text-bone-dim hover:text-bone transition-colors">
                  {t('logout', lang)}
                </button>
              </form>
            )}
          </div>
        </nav>
      </header>

      {/* Mobile tabs (below sticky nav) */}
      {!isAnon && (
        <div className="md:hidden fixed bottom-3 left-2 right-2 z-40">
          <NavTabs lang={lang} mobile />
        </div>
      )}

      <main className="flex-1 max-w-[1280px] w-full mx-auto px-5 lg:px-8 pt-28 pb-20 md:pb-12">
        {children}
      </main>

      <footer className="border-t border-white/10 py-5 text-center text-xs text-bone-mute">
        <span>{email ?? (lang === 'pt' ? 'Visitante' : lang === 'es' ? 'Visitante' : 'Guest')}</span>
        <span className="mx-3">•</span>
        <span>goz.ai © {new Date().getFullYear()}</span>
      </footer>
    </div>
  );
}
