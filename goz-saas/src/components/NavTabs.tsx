'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { t, type Lang } from '@/lib/i18n';

const items = [
  { href: '/dashboard', key: 'studio' as const },
  { href: '/dashboard/prompts', key: 'prompts' as const },
  { href: '/dashboard/history', key: 'history' as const },
  { href: '/pricing', key: 'packages' as const },
  { href: '/dashboard/settings', key: 'account' as const },
];

export default function NavTabs({ lang, mobile = false }: { lang: Lang; mobile?: boolean }) {
  const pathname = usePathname();

  if (mobile) {
    return (
      <nav className="bg-ink-800/80 backdrop-blur-md border border-white/10 rounded-2xl px-2 py-2 grid grid-cols-5 gap-1">
        {items.map((it) => {
          const active =
            it.href === '/dashboard'
              ? pathname === '/dashboard'
              : pathname.startsWith(it.href);
          return (
            <Link
              key={it.href}
              href={it.href}
              className={`text-center py-2 rounded-lg text-[11px] font-semibold transition-colors ${
                active ? 'bg-lime/10 text-lime' : 'text-bone-dim hover:text-bone'
              }`}
            >
              {t(it.key, lang)}
            </Link>
          );
        })}
      </nav>
    );
  }

  return (
    <nav className="hidden md:flex items-center gap-1">
      {items.map((it) => {
        const active =
          it.href === '/dashboard'
            ? pathname === '/dashboard'
            : pathname.startsWith(it.href);
        return (
          <Link
            key={it.href}
            href={it.href}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              active
                ? 'bg-lime/10 text-lime'
                : 'text-bone-dim hover:text-bone hover:bg-white/5'
            }`}
          >
            {t(it.key, lang)}
          </Link>
        );
      })}
    </nav>
  );
}
