'use client';
import { useActionState } from 'react';
import { signupAction, type AuthState } from '@/lib/actions/auth';
import { t, type Lang } from '@/lib/i18n';

const initial: AuthState = {};

export default function SignupForm({ lang }: { lang: Lang }) {
  const [state, action, pending] = useActionState(signupAction, initial);
  const usernameLabel = lang === 'pt' ? 'Nome de usuário' : lang === 'es' ? 'Nombre de usuario' : 'Username';
  const usernamePh = lang === 'pt' ? 'como quer ser chamado' : lang === 'es' ? 'cómo quieres ser llamado' : 'how should we call you';
  const passwordHint = lang === 'pt' ? 'mín. 6 caracteres' : lang === 'es' ? 'mín. 6 caracteres' : 'min 6 chars';
  const terms = lang === 'pt'
    ? 'Ao continuar você concorda com os termos.'
    : lang === 'es'
    ? 'Al continuar aceptas los términos.'
    : 'By continuing you accept the terms.';

  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="lang" value={lang} />
      <div>
        <label className="field-label">{usernameLabel}</label>
        <input className="input" name="username" type="text" required maxLength={60} autoComplete="username" placeholder={usernamePh} />
      </div>
      <div>
        <label className="field-label">{t('email', lang)}</label>
        <input className="input" name="email" type="email" required autoComplete="email" placeholder="you@goz.ai" />
      </div>
      <div>
        <label className="field-label">{t('password', lang)} <span className="text-bone-mute font-normal">— {passwordHint}</span></label>
        <input className="input" name="password" type="password" required minLength={6} autoComplete="new-password" placeholder="••••••••" />
      </div>
      {state.error && (
        <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/25 rounded-lg px-3 py-2.5">{state.error}</div>
      )}
      {state.info && !state.error && (
        <div className="text-sm text-lime bg-lime/10 border border-lime/25 rounded-lg px-3 py-2.5">{state.info}</div>
      )}
      <button type="submit" className="btn-primary w-full" disabled={pending}>
        {pending ? (
          <span className="inline-block w-4 h-4 border-2 border-ink-900/30 border-t-ink-900 rounded-full animate-spin" />
        ) : (
          <>{t('signupCta', lang)} →</>
        )}
      </button>
      <p className="text-xs text-bone-mute text-center">{terms}</p>
    </form>
  );
}
