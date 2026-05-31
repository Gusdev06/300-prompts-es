'use client';
import { useActionState } from 'react';
import { updateLanguageAction, type SettingsState } from '@/lib/actions/settings';
import { t, type Lang } from '@/lib/i18n';

const initial: SettingsState = {};

const LANGS: { code: Lang; flag: string; label: string }[] = [
  { code: 'en', flag: '🇺🇸', label: 'English' },
  { code: 'es', flag: '🇪🇸', label: 'Español' },
  { code: 'pt', flag: '🇧🇷', label: 'Português' },
];

export default function SettingsForm({
  lang,
  currentLang,
}: {
  lang: Lang;
  currentLang: Lang;
}) {
  const [state, action, pending] = useActionState(updateLanguageAction, initial);
  return (
    <form action={action} className="space-y-5">
      <div>
        <label className="field-label">{t('language', lang)}</label>
        <div className="grid grid-cols-3 gap-2">
          {LANGS.map((l) => {
            const checked = l.code === currentLang;
            return (
              <label
                key={l.code}
                className={`cursor-pointer rounded-xl border p-4 transition-all text-center ${
                  checked
                    ? 'border-lime bg-lime/10 text-bone'
                    : 'border-white/10 bg-ink-900 text-bone-dim hover:border-white/25 hover:text-bone'
                }`}
              >
                <input type="radio" name="language" value={l.code} defaultChecked={checked} className="sr-only" />
                <div className="text-2xl mb-2">{l.flag}</div>
                <div className="text-xs font-bold tracking-wider uppercase">{l.label}</div>
              </label>
            );
          })}
        </div>
      </div>

      {state.error && (
        <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/25 rounded-lg px-3 py-2.5">{state.error}</div>
      )}
      {state.ok && (
        <div className="text-sm text-lime bg-lime/10 border border-lime/25 rounded-lg px-3 py-2.5">✓ {t('saved', lang)}</div>
      )}

      <button type="submit" className="btn-primary w-full" disabled={pending}>
        {pending ? (
          <span className="inline-block w-4 h-4 border-2 border-ink-900/30 border-t-ink-900 rounded-full animate-spin" />
        ) : (
          <>{t('save', lang)} →</>
        )}
      </button>
    </form>
  );
}
