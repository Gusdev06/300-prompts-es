import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { t } from '@/lib/i18n';
import { getLang } from '@/lib/lang';
import HistoryGrid from '@/components/HistoryGrid';

const KINDS = ['enhance', 'undress', 'faceswap', 'edit'] as const;

export default async function HistoryPage({
  searchParams,
}: {
  searchParams: Promise<{ kind?: string }>;
}) {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;
  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('language_code')
    .eq('user_id', user.id)
    .single();

  const lang = await getLang(profile?.language_code);

  const sp = await searchParams;
  const kind = (KINDS as readonly string[]).includes(sp?.kind ?? '') ? sp!.kind! : null;

  let q = supabase
    .from('generations')
    .select('id, prompt, output_url, kind, created_at, credits_spent')
    .eq('user_id', user.id)
    .not('output_url', 'is', null)
    .order('created_at', { ascending: false })
    .limit(60);
  if (kind) q = q.eq('kind', kind);
  const { data: items } = await q;

  return (
    <div className="space-y-8">
      <header className="pb-6 border-b border-white/10">
        <p className="text-xs font-bold tracking-widest text-bone-mute uppercase mb-3">{t('history', lang)}</p>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          {t('history', lang)} <span className="text-lime">{(items?.length ?? 0).toString().padStart(2, '0')}</span>
        </h1>
        <p className="text-sm text-bone-dim mt-3">
          {(items?.length ?? 0)} {lang === 'pt' ? 'entradas' : lang === 'es' ? 'entradas' : 'entries'}
        </p>
        <div className="mt-5 border border-amber-500/40 bg-amber-500/[0.06] rounded-xl px-4 py-3 text-xs text-amber-200/90 flex items-start gap-2">
          <span aria-hidden className="text-amber-400 font-bold leading-none mt-px">⚠</span>
          <div>
            <strong className="text-amber-300 font-bold">
              {lang === 'pt'
                ? 'Não armazenamos suas gerações.'
                : lang === 'es'
                ? 'No almacenamos tus generaciones.'
                : "We don't store your generations."}
            </strong>{' '}
            {lang === 'pt'
              ? 'Os links abaixo expiram em até 48h após a criação. Baixe o que quiser manter — depois não dá pra recuperar.'
              : lang === 'es'
              ? 'Los enlaces de abajo expiran en hasta 48h tras la creación. Descarga lo que quieras conservar — luego no se puede recuperar.'
              : 'The links below expire within 48h of creation. Download whatever you want to keep — after that it cannot be recovered.'}
          </div>
        </div>
      </header>

      <section className="flex flex-wrap gap-2 items-center">
        <span className="text-xs font-bold tracking-widest text-bone-mute uppercase mr-2">{t('filters', lang)}</span>
        <FilterChip href="/dashboard/history" label={t('all', lang)} active={!kind} />
        {KINDS.map((k) => (
          <FilterChip
            key={k}
            href={`/dashboard/history?kind=${k}`}
            label={k.charAt(0).toUpperCase() + k.slice(1)}
            active={kind === k}
          />
        ))}
      </section>

      <HistoryGrid items={items ?? []} lang={lang} cols={4} />
    </div>
  );
}

function FilterChip({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors border ${
        active
          ? 'bg-lime text-ink-900 border-lime'
          : 'border-white/10 text-bone-dim hover:border-white/30 hover:text-bone'
      }`}
    >
      {label}
    </Link>
  );
}
