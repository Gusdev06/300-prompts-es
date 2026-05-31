import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { t } from '@/lib/i18n';
import { getLang } from '@/lib/lang';
import SettingsForm from './form';

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;
  if (!user) redirect('/login');

  const [{ data: profile }, { count: totalRenders }] = await Promise.all([
    supabase
      .from('profiles')
      .select('credits, language_code, created_at')
      .eq('user_id', user.id)
      .single(),
    supabase
      .from('generations')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .not('output_url', 'is', null),
  ]);

  const lang = await getLang(profile?.language_code);
  const localeMap = { pt: 'pt-BR', en: 'en-US', es: 'es-ES' } as const;
  const memberSince = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString(localeMap[lang], { year: 'numeric', month: 'short', day: '2-digit' })
    : '—';

  return (
    <div className="space-y-10">
      <header className="pb-6 border-b border-white/10">
        <p className="text-xs font-bold tracking-widest text-bone-mute uppercase mb-3">{t('account', lang)}</p>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">{t('account', lang)}</h1>
      </header>

      <section className="grid lg:grid-cols-2 gap-6">
        {/* identity */}
        <div className="card">
          <h2 className="text-lg font-bold mb-5">
            {lang === 'pt' ? 'Identidade' : lang === 'es' ? 'Identidad' : 'Identity'}
          </h2>
          <dl className="divide-y divide-white/10">
            <Row label={t('email', lang)} value={user.email ?? '—'} />
            <Row label={lang === 'pt' ? 'ID de usuário' : lang === 'es' ? 'ID de usuario' : 'User ID'} value={user.id.slice(0, 12) + '…'} mono />
            <Row label={lang === 'pt' ? 'Membro desde' : lang === 'es' ? 'Miembro desde' : 'Member since'} value={memberSince} />
            <Row label={t('credits', lang)} value={`${profile?.credits ?? 0} cr`} accent />
            <Row label={t('totalRenders', lang)} value={(totalRenders ?? 0).toString().padStart(3, '0')} />
          </dl>
        </div>

        {/* preferences */}
        <div className="card">
          <h2 className="text-lg font-bold mb-5">
            {lang === 'pt' ? 'Preferências' : lang === 'es' ? 'Preferencias' : 'Preferences'}
          </h2>
          <SettingsForm lang={lang} currentLang={(profile?.language_code as 'pt' | 'en' | 'es') ?? lang} />
        </div>
      </section>
    </div>
  );
}

function Row({ label, value, mono, accent }: { label: string; value: string; mono?: boolean; accent?: boolean }) {
  return (
    <div className="flex items-center justify-between py-3.5">
      <dt className="text-xs font-bold tracking-widest text-bone-mute uppercase">{label}</dt>
      <dd className={`text-sm font-semibold ${mono ? 'font-mono' : ''} ${accent ? 'text-lime' : 'text-bone'}`}>{value}</dd>
    </div>
  );
}
