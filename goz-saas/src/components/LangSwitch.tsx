'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import type { Lang } from '@/lib/i18n';

const ALL = [
  { code: 'en' as Lang, flag: '🇺🇸', label: 'English', short: 'EN', href: '/en' },
  { code: 'es' as Lang, flag: '🇪🇸', label: 'Español', short: 'ES', href: '/es' },
  { code: 'pt' as Lang, flag: '🇧🇷', label: 'Português', short: 'PT', href: '/pt-br' },
];

export default function LangSwitch({ current }: { current: Lang }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const me = ALL.find((l) => l.code === current) ?? ALL[0];

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('click', onDoc);
    return () => document.removeEventListener('click', onDoc);
  }, []);

  return (
    <div
      ref={ref}
      className="relative inline-flex"
      onClick={(e) => { e.stopPropagation(); setOpen((v) => !v); }}
    >
      <button
        type="button"
        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-white/10 bg-white/5 text-xs font-bold tracking-wide hover:border-white/20 cursor-pointer"
      >
        <span className="text-base leading-none">{me.flag}</span>
        <span>{me.short}</span>
        <span className="text-bone-dim text-[10px]">▾</span>
      </button>
      {open && (
        <div className="absolute top-full right-0 mt-1.5 min-w-[140px] bg-ink-800 border border-white/10 rounded-xl p-1.5 shadow-xl z-[100]">
          {ALL.map((l) => (
            <Link
              key={l.code}
              href={l.href}
              className={`flex items-center gap-2 px-2.5 py-2 rounded-md text-sm font-semibold hover:bg-ink-700 hover:text-lime ${
                l.code === current ? 'bg-lime/10 text-lime' : 'text-bone'
              }`}
            >
              <span className="text-base">{l.flag}</span>
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
