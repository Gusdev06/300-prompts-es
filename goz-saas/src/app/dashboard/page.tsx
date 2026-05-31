import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

export const maxDuration = 300;
import { t } from '@/lib/i18n';
import { getLang } from '@/lib/lang';
import GenPanel from '@/components/GenPanel';
import HistoryGrid from '@/components/HistoryGrid';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;

  if (!user) {
    const lang = await getLang();
    return (
      <div className="space-y-8">
        <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <p className="text-xs font-bold tracking-widest text-bone-mute uppercase mb-3">
              {lang === 'pt' ? 'Visitante' : lang === 'es' ? 'Visitante' : 'Guest'}
            </p>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              {lang === 'pt' ? 'Teste' : lang === 'es' ? 'Prueba' : 'Try'}{' '}
              <span className="text-lime">1</span>{' '}
              <span className="text-bone-dim font-normal">
                {lang === 'pt' ? 'render grátis' : lang === 'es' ? 'render gratis' : 'free render'}.
              </span>
            </h1>
            <p className="text-sm text-bone-dim mt-3">
              {lang === 'pt' ? 'Sem cadastro. Saída com marca d\'água.' : lang === 'es' ? 'Sin registro. Salida con marca de agua.' : 'No sign-up. Watermarked output.'}
            </p>
          </div>
          <Link href="/signup" className="btn-primary text-sm">
            {t('signupCta', lang)} →
          </Link>
        </header>

        <div className="card bg-lime/10 border-lime/30 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold tracking-widest text-lime uppercase mb-1">⚡ FREE PREVIEW</p>
            <p className="text-sm text-bone-dim max-w-xl">
              {lang === 'pt'
                ? 'Crie 1 render sem custo. O download sai com marca. Cadastre-se para créditos limpos.'
                : lang === 'es'
                ? 'Crea 1 render gratis. La descarga sale con marca. Regístrate para créditos limpios.'
                : 'Generate 1 render for free. Download is watermarked. Sign up for clean credits.'}
            </p>
          </div>
          <Link href="/signup" className="btn-primary text-xs whitespace-nowrap">
            {t('signupCta', lang)} →
          </Link>
        </div>

        <section>
          <h2 className="text-2xl font-bold tracking-tight mb-5">{t('newRender', lang)}</h2>
          <GenPanel lang={lang} credits={5} isAnon />
        </section>
      </div>
    );
  }

  const [{ data: profile }, { data: recent }, { count: totalRenders }] = await Promise.all([
    supabase.from('profiles').select('credits, language_code').eq('user_id', user.id).single(),
    supabase
      .from('generations')
      .select('id, prompt, output_url, kind, created_at, credits_spent')
      .eq('user_id', user.id)
      .not('output_url', 'is', null)
      .order('created_at', { ascending: false })
      .limit(8),
    supabase
      .from('generations')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .not('output_url', 'is', null),
  ]);

  const lang = await getLang(profile?.language_code);
  const credits = profile?.credits ?? 0;
  const imagesAvailable = Math.floor(credits / 5);
  const totalSpent = (totalRenders ?? 0) * 5;

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <p className="text-xs font-bold tracking-widest text-bone-mute uppercase mb-3">
            {t('studio', lang)}
          </p>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            {lang === 'pt' ? 'Saldo' : lang === 'es' ? 'Saldo' : 'Balance'}{' '}
            <span className="text-lime">{credits}</span>{' '}
            <span className="text-bone-dim font-normal">cr.</span>
          </h1>
          <p className="text-sm text-bone-dim mt-3">
            ≈ <strong className="text-bone">{imagesAvailable}</strong> {lang === 'pt' ? 'imagens disponíveis' : lang === 'es' ? 'imágenes disponibles' : 'images available'}
          </p>
        </div>
        <Link href="/pricing" className="btn-primary text-sm">
          ↑ {t('buyMore', lang)}
        </Link>
      </header>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { k: t('credits', lang), v: credits.toString() },
          { k: t('totalRenders', lang), v: (totalRenders ?? 0).toString().padStart(2, '0') },
          { k: t('totalSpent', lang), v: `${totalSpent} cr` },
          { k: 'STATUS', v: credits >= 5 ? 'READY' : 'EMPTY' },
        ].map((s) => (
          <div key={s.k} className="card">
            <p className="text-[10px] font-bold tracking-widest text-bone-mute uppercase mb-2">{s.k}</p>
            <p className="text-2xl font-bold tracking-tight">{s.v}</p>
          </div>
        ))}
      </section>

      <section>
        <h2 className="text-2xl font-bold tracking-tight mb-5">{t('newRender', lang)}</h2>
        <GenPanel lang={lang} credits={credits} />
      </section>

      <section>
        <div className="flex items-end justify-between mb-5">
          <h2 className="text-2xl font-bold tracking-tight">{t('recentRenders', lang)}</h2>
          <Link href="/dashboard/history" className="text-sm text-lime font-semibold hover:underline">
            {t('viewAll', lang)} →
          </Link>
        </div>
        <HistoryGrid items={recent ?? []} lang={lang} />
      </section>
    </div>
  );
}
