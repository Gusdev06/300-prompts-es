import Link from 'next/link';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { t, type Lang } from '@/lib/i18n';
import { getLang } from '@/lib/lang';
import {
  packagesFor,
  formatPrice,
  CREDITS_PER_IMAGE,
  type Currency,
} from '@/lib/packages';
import { checkoutUrlFor } from '@/lib/perfectpay-offers';

function payUrl(pkgId: string, userId: string) {
  return checkoutUrlFor(pkgId, userId) ?? '#';
}

export default async function PricingPage({
  searchParams,
}: {
  searchParams: Promise<{ cur?: string }>;
}) {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user!;
  const { data: profile } = await supabase
    .from('profiles')
    .select('language_code, credits')
    .eq('user_id', user.id)
    .single();

  const lang: Lang = await getLang(profile?.language_code);
  const sp = await searchParams;
  const country = (await cookies()).get('country')?.value?.toUpperCase();
  const allowBRL = country === 'BR' || (!country && lang === 'pt');
  const defaultCur: Currency = allowBRL ? 'BRL' : 'USD';
  const requested: Currency | null =
    sp?.cur === 'BRL' || sp?.cur === 'USD' ? (sp.cur as Currency) : null;
  const currency: Currency = !allowBRL ? 'USD' : (requested ?? defaultCur);

  const pkgs = packagesFor(currency);
  const credits = profile?.credits ?? 0;
  const popularIdx = Math.min(3, pkgs.length - 1);
  const bestIdx = pkgs.length - 1;

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 pb-6 border-b border-white/10">
        <div>
          <p className="text-xs font-bold tracking-widest text-bone-mute uppercase mb-3">{t('packages', lang)}</p>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">{t('pricingTitle', lang)}</h1>
          <p className="text-bone-dim mt-3 max-w-xl text-sm">{t('pricingSub', lang)}</p>
          <p className="text-xs text-bone-mute mt-2">
            {CREDITS_PER_IMAGE} {t('credits', lang).toLowerCase()} = 1{' '}
            {lang === 'pt' ? 'imagem' : lang === 'es' ? 'imagen' : 'image'} ·{' '}
            {lang === 'pt' ? 'saldo' : lang === 'es' ? 'saldo' : 'balance'}{' '}
            <strong className="text-lime">{credits} cr</strong>
          </p>
        </div>

        {allowBRL && (
          <div className="inline-flex bg-ink-800 border border-white/10 p-1 rounded-full self-start">
            {(['BRL', 'USD'] as Currency[]).map((c) => {
              const active = c === currency;
              return (
                <Link
                  key={c}
                  href={`/pricing?cur=${c}`}
                  className={`px-4 py-1.5 text-xs font-semibold tracking-wider rounded-full transition-colors ${
                    active ? 'bg-lime text-ink-900' : 'text-bone-dim hover:text-bone'
                  }`}
                >
                  {c === 'BRL' ? 'R$ BRL' : '$ USD'}
                </Link>
              );
            })}
          </div>
        )}
      </header>

      <section className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {pkgs.map((p, i) => {
          const bonusCredits = p.bonusImages ? p.bonusImages * CREDITS_PER_IMAGE : 0;
          const images = p.credits / CREDITS_PER_IMAGE;
          const featured = i === popularIdx;
          const best = i === bestIdx && bestIdx !== popularIdx;

          return (
            <div
              key={p.id}
              className={`relative card flex flex-col transition-all ${
                featured ? '!border-lime !bg-lime/[0.04] shadow-[0_20px_60px_rgba(212,255,0,0.12)]' : 'hover:border-white/20'
              }`}
            >
              {(featured || best) && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className={`px-3 py-1 text-[10px] font-bold tracking-widest uppercase rounded-full ${
                    featured ? 'bg-lime text-ink-900' : 'bg-bone text-ink-900'
                  }`}>
                    {featured ? '⭐ ' + t('featured', lang) : t('bestValue', lang)}
                  </span>
                </div>
              )}

              <div className="flex items-baseline justify-between mb-5">
                <span className="text-[10px] font-bold tracking-widest text-bone-mute uppercase">PACK {String(i + 1).padStart(2, '0')}</span>
                {bonusCredits > 0 && (
                  <span className="text-[10px] font-bold text-lime uppercase tracking-widest">+ {bonusCredits} {t('bonus', lang)}</span>
                )}
              </div>

              <div className="text-4xl font-bold tracking-tight mb-2">
                {formatPrice(p.price, p.currency)}
              </div>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-2xl font-bold text-lime">{p.credits}</span>
                <span className="text-xs text-bone-dim font-semibold">CR</span>
              </div>
              <a
                href={payUrl(p.id, user.id)}
                target="_blank"
                rel="noreferrer"
                className={`mt-auto ${featured ? 'btn-primary' : 'btn-ghost'} w-full text-sm`}
              >
                {t('pay', lang)} →
              </a>
            </div>
          );
        })}
      </section>

      <section className="border-t border-white/10 pt-10 grid md:grid-cols-3 gap-6">
        {[
          { n: '01', t: lang === 'pt' ? 'Sem assinatura' : lang === 'es' ? 'Sin suscripción' : 'No subscription',
            d: lang === 'pt' ? 'Pague uma vez, use quando quiser. Créditos nunca expiram.' : lang === 'es' ? 'Pago único, úsalos cuando quieras. Los créditos no caducan.' : 'Pay once, use anytime. Credits never expire.' },
          { n: '02', t: lang === 'pt' ? 'Pagamento PerfectPay' : lang === 'es' ? 'Pago PerfectPay' : 'PerfectPay payment',
            d: lang === 'pt' ? 'Cartão, Pix, boleto. Créditos liberados em segundos.' : lang === 'es' ? 'Tarjeta, Pix, boleto. Créditos liberados en segundos.' : 'Card, Pix, boleto. Credits unlocked in seconds.' },
          { n: '03', t: lang === 'pt' ? 'Renders ilimitados' : lang === 'es' ? 'Renders ilimitados' : 'Unlimited renders',
            d: lang === 'pt' ? 'Sem fila pública, sem cap diário.' : lang === 'es' ? 'Sin cola pública, sin tope diario.' : 'No public queue, no daily cap.' },
        ].map((row) => (
          <div key={row.n} className="card">
            <div className="text-[10px] font-bold tracking-widest text-lime uppercase mb-2">{row.n}</div>
            <h3 className="text-lg font-bold mb-2">{row.t}</h3>
            <p className="text-sm text-bone-dim leading-relaxed">{row.d}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
