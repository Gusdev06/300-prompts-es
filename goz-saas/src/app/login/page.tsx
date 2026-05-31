import Link from 'next/link';
import { t } from '@/lib/i18n';
import { getLang } from '@/lib/lang';
import LoginForm from './form';
import Logo from '@/components/Logo';

export default async function LoginPage() {
  const lang = await getLang();
  return (
    <main className="min-h-screen flex flex-col bg-ink-900">
      {/* top nav */}
      <header className="fixed top-4 left-2 right-2 md:top-5 md:left-6 md:right-6 z-50">
        <nav className="max-w-[980px] mx-auto flex items-center justify-between px-4 md:px-6 py-3 bg-ink-800/60 backdrop-blur-md border border-white/10 rounded-2xl">
          <Link href="/" className="flex items-center gap-2 font-bold text-base md:text-lg text-bone">
            <Logo />
            goz.ai
          </Link>
          <Link href="/signup" className="text-sm text-bone-dim hover:text-bone transition-colors">
            {t('noAccount', lang)} <span className="text-lime font-semibold">{t('signup', lang)}</span>
          </Link>
        </nav>
      </header>

      {/* form */}
      <div className="flex-1 flex items-center justify-center px-6 pt-32 pb-12">
        <div className="w-full max-w-[420px]">
          <div className="card p-8 md:p-10">
            <h1 className="text-3xl font-bold tracking-tight mb-2">{t('welcomeBack', lang)}</h1>
            <p className="text-bone-dim text-sm mb-8">
              {lang === 'pt'
                ? 'Entre para acessar seu estúdio.'
                : lang === 'es'
                ? 'Entra para acceder a tu estudio.'
                : 'Sign in to access your studio.'}
            </p>
            <LoginForm lang={lang} />
          </div>
          <p className="text-center text-sm text-bone-dim mt-6">
            {t('noAccount', lang)}{' '}
            <Link href="/signup" className="text-lime font-semibold hover:underline">
              {t('signup', lang)}
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
