import Link from 'next/link';
import { t, type Lang } from '@/lib/i18n';
import LangSwitch from './LangSwitch';
import DemoPanel from './DemoPanel';
import Logo from './Logo';

const REGISTER_URL = '/signup';
const LOGIN_URL = '/login';

export default function Landing({ lang }: { lang: Lang }) {
  const tr = (k: Parameters<typeof t>[0]) => t(k, lang);

  return (
    <div className="bg-ink-900 text-bone min-h-screen">
      {/* ============ NAV ============ */}
      <div className="fixed top-4 left-2 right-2 md:top-5 md:left-6 md:right-6 z-50">
        <nav className="max-w-[980px] mx-auto flex items-center justify-between px-4 md:px-6 py-3 bg-ink-800/60 backdrop-blur-md border border-white/10 rounded-2xl">
          <Link href="/" className="flex items-center gap-2 font-bold text-base md:text-lg">
            <Logo />
            goz.ai
          </Link>
          <div className="flex items-center gap-2 md:gap-4">
            <LangSwitch current={lang} />
            <Link href={LOGIN_URL} className="text-sm text-bone-dim hover:text-bone transition-colors hidden sm:inline">
              {tr('navLogin')}
            </Link>
            <Link
              href={REGISTER_URL}
              className="bg-lime text-ink-900 font-bold px-4 py-2 rounded-full text-sm hover:-translate-y-px transition-transform"
            >
              {tr('navStart')}
            </Link>
          </div>
        </nav>
      </div>

      {/* ============ HERO ============ */}
      <section className="pt-32 md:pt-40 pb-16 md:pb-20 text-center">
        <div className="container max-w-[1200px] mx-auto px-5">
          <h1 className="text-[2.25rem] sm:text-5xl md:text-[4rem] font-bold tracking-tight leading-[1.08] mb-6">
            {tr('heroHeadline1')}<br />
            {tr('heroHeadline2')}<br />
            <span className="relative inline-block isolate">
              <span aria-hidden className="absolute left-0 right-0 bottom-1 h-[0.3em] bg-lime" />
              <span className="relative">{tr('heroHeadlineMark')}</span>
            </span>.
          </h1>
          <p className="max-w-[580px] mx-auto text-bone-dim mb-8 text-sm md:text-base leading-relaxed">
            {tr('heroSubtitle')}
          </p>

          <div className="max-w-[320px] mx-auto mb-7 aspect-[9/16] rounded-3xl overflow-hidden border border-white/10 bg-black">
            <video
              autoPlay muted loop playsInline preload="metadata"
              className="w-full h-full object-cover"
            >
              <source src="/landing/hero-novo.mp4" type="video/mp4" />
            </video>
          </div>

          <Link
            href={REGISTER_URL}
            className="inline-flex items-center gap-2 bg-lime text-ink-900 font-extrabold px-7 py-4 rounded-xl hover:-translate-y-px transition-transform"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5"><path d="M8 5v14l11-7z"/></svg>
            {tr('heroCta')}
          </Link>

          <div className="mt-5 inline-flex items-center gap-3 text-xs text-bone-dim">
            <div className="flex">
              {[1,2,3,4].map(i => (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img key={i} src={`/zayra/images/avatar-${i}.webp`} alt=""
                  className="w-7 h-7 rounded-full border-2 border-ink-900 -ml-2 first:ml-0 object-cover" />
              ))}
            </div>
            <div>
              <div className="text-lime tracking-[2px] text-sm">★★★★★</div>
              <div><strong className="text-bone font-bold">22,000+</strong> {tr('heroRating').replace('22.000+', '').replace('22,000+', '').trim()}</div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ DEMO ============ */}
      <section className="py-10 md:py-20" id="demo">
        <div className="container max-w-[1200px] mx-auto px-5">
          <p className="text-center text-[0.72rem] font-bold tracking-[0.18em] text-bone-mute uppercase mb-3">{tr('demoEyebrow')}</p>
          <h2 className="text-center text-3xl md:text-4xl font-bold tracking-tight mb-3">
            {tr('demoTitle')} <span className="text-lime">{tr('demoTitleMark')}</span>
          </h2>
          <p className="text-center text-bone-dim max-w-[580px] mx-auto mb-10 text-sm">{tr('demoSub')}</p>

          <DemoPanel lang={lang} registerUrl={REGISTER_URL} />
        </div>
      </section>

      {/* ============ RESULTS ============ */}
      <section className="py-14 md:py-20">
        <div className="container max-w-[1200px] mx-auto px-5">
          <h2 className="text-center text-3xl md:text-4xl font-bold tracking-tight mb-3">
            {tr('resultsTitle')} <span className="text-lime">goz.ai</span>
          </h2>
          <p className="text-center text-bone-dim max-w-[580px] mx-auto mb-12 text-sm">{tr('resultsSub')}</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 max-w-[1000px] mx-auto">
            {['influencer1','influencer-eye','influencer5','influencer-new4'].map((name) => (
              <figure key={name} className="aspect-[9/16] rounded-2xl overflow-hidden border border-white/10 bg-ink-700 group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/zayra/images/${name}.webp`} alt="AI Influencer"
                  className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700"
                  loading="lazy" />
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FEATURES ============ */}
      <section className="py-14 md:py-20">
        <div className="container max-w-[1200px] mx-auto px-5">
          <p className="text-center text-[0.72rem] font-bold tracking-[0.18em] text-bone-mute uppercase mb-3">{tr('featEyebrow')}</p>
          <h2 className="text-center text-3xl md:text-4xl font-bold tracking-tight mb-3">{tr('featTitle')}</h2>
          <p className="text-center text-bone-dim max-w-[580px] mx-auto mb-12 text-sm">{tr('featSub')}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-[1100px] mx-auto">
            {featureSpecs.map(({ key, icon }) => (
              <FeatureCard
                key={key}
                title={tr(`feat${key}Title` as keyof typeof import('@/lib/i18n').T)}
                desc={tr(`feat${key}Desc` as keyof typeof import('@/lib/i18n').T)}
                icon={icon}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ============ MOTION CONTROL SHOWCASE ============ */}
      <section className="py-14 md:py-20">
        <div className="container max-w-[1200px] mx-auto px-5">
          <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center max-w-[1100px] mx-auto">
            <div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black italic tracking-tight leading-[1.05] uppercase mb-5">
                {tr('motion1')}<br />
                <span className="bg-lime text-ink-900 px-2 italic">{tr('motion2')}</span><br />
                {tr('motion3')}
              </h2>
              <p className="text-bone-dim text-sm md:text-base leading-relaxed max-w-[460px]">{tr('motionDesc')}</p>
            </div>
            <div className="max-w-[340px] w-full mx-auto aspect-[9/16] rounded-3xl overflow-hidden border border-white/10 bg-black">
              <video autoPlay muted loop playsInline preload="metadata"
                poster="/zayra/images/motion-zaza-poster.jpg"
                className="w-full h-full object-cover"
              >
                <source src="/zayra/videos/motion-zaza.mp4" type="video/mp4" />
              </video>
            </div>
          </div>
        </div>
      </section>

      {/* ============ MOVEMENTS + EXPRESSIONS ============ */}
      <section className="py-14 md:py-20">
        <div className="container max-w-[1200px] mx-auto px-5">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black italic tracking-tight leading-[1.05] uppercase text-center mb-5">
            {tr('expr1')}<br />
            <span className="bg-lime text-ink-900 px-2 italic">{tr('expr2')}</span> {tr('expr3')}
          </h2>
          <p className="text-center text-bone-dim max-w-[580px] mx-auto mb-12 text-sm">{tr('exprDesc')}</p>
          <div className="grid grid-cols-3 gap-3 md:gap-4 max-w-[900px] mx-auto">
            {[
              { v: 'motion-zaza', p: 'motion-zaza-poster' },
              { v: 'motion-3', p: 'motion-3-poster' },
              { v: 'motion-cara', p: 'motion-cara-poster' },
            ].map(({ v, p }) => (
              <figure key={v} className="aspect-[9/16] rounded-2xl overflow-hidden border border-white/10 bg-ink-700">
                <video autoPlay muted loop playsInline preload="metadata"
                  poster={`/zayra/images/${p}.jpg`}
                  className="w-full h-full object-cover">
                  <source src={`/zayra/videos/${v}.mp4`} type="video/mp4" />
                </video>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ============ SINGLE CTA ============ */}
      <section className="py-14 md:py-20">
        <div className="container max-w-[1200px] mx-auto px-5">
          <div className="max-w-[720px] mx-auto bg-gradient-to-br from-lime/10 to-lime/2 border border-lime/40 rounded-3xl p-10 md:p-12 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-lime to-transparent" />
            <h2 className="text-2xl md:text-4xl font-bold tracking-tight mb-4">
              {tr('ctaTitle1')} <span className="text-lime">{tr('ctaTitleMark')}</span> {tr('ctaTitle2')}
            </h2>
            <Link
              href={REGISTER_URL}
              className="inline-flex items-center gap-2 bg-lime text-ink-900 font-extrabold px-7 py-4 rounded-xl hover:-translate-y-px transition-transform"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5"><path d="M8 5v14l11-7z"/></svg>
              {tr('ctaButton')}
            </Link>
            <p className="text-bone-mute text-xs mt-3">{tr('ctaFine')}</p>
          </div>
        </div>
      </section>

      {/* ============ FAQ ============ */}
      <section className="py-14 md:py-20">
        <div className="container max-w-[1200px] mx-auto px-5">
          <h2 className="text-center text-3xl md:text-4xl font-bold tracking-tight mb-10">{tr('faqTitle')}</h2>
          <div className="max-w-[720px] mx-auto space-y-2.5">
            {[1, 2, 3, 4, 5, 6, 7].map((n) => (
              <details key={n} className="group bg-ink-800 border border-white/10 rounded-2xl overflow-hidden hover:border-lime/30 transition-colors">
                <summary className="px-6 py-4 font-semibold text-sm cursor-pointer list-none flex justify-between items-center gap-4">
                  {tr(`q${n}` as keyof typeof import('@/lib/i18n').T)}
                  <span className="text-lime text-lg shrink-0 group-open:rotate-45 transition-transform">+</span>
                </summary>
                <div className="px-6 pb-5 text-bone-dim text-sm leading-relaxed">
                  {tr(`a${n}` as keyof typeof import('@/lib/i18n').T)}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="border-t border-white/10 py-8 text-center text-bone-mute text-xs space-y-1.5">
        <p>{tr('footCopyright')}</p>
        <p>
          <Link href="/terms" className="hover:text-bone">{tr('footTerms')}</Link>
          <span className="mx-2">•</span>
          <Link href="/privacy" className="hover:text-bone">{tr('footPrivacy')}</Link>
        </p>
        <p className="max-w-[560px] mx-auto pt-2">{tr('footLegal')}</p>
      </footer>
    </div>
  );
}

const featureSpecs = [
  { key: '1', icon: <IconUser /> },
  { key: '2', icon: <IconVideo /> },
  { key: '3', icon: <IconArrow /> },
  { key: '4', icon: <IconFace /> },
  { key: '5', icon: <IconBook /> },
  { key: '6', icon: <IconWave /> },
  { key: '7', icon: <IconGrid /> },
  { key: '8', icon: <IconBolt /> },
  { key: '9', icon: <IconCube /> },
] as const;

function FeatureCard({ title, desc, icon }: { title: string; desc: string; icon: React.ReactNode }) {
  return (
    <div className="group bg-ink-800 border border-white/10 rounded-2xl p-5 hover:bg-ink-700 hover:border-lime/40 hover:-translate-y-0.5 transition-all duration-300">
      <div className="w-10 h-10 rounded-xl bg-lime/10 group-hover:bg-lime flex items-center justify-center text-lime group-hover:text-ink-900 mb-3 transition-colors">
        {icon}
      </div>
      <h3 className="text-base font-semibold mb-2 group-hover:text-lime transition-colors">{title}</h3>
      <p className="text-bone-dim text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

/* ---- icons (inline SVG, 20x20) ---- */
const svgProps = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, className: 'w-5 h-5' } as const;
function IconUser() { return <svg {...svgProps}><path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z"/></svg>; }
function IconVideo() { return <svg {...svgProps}><path d="M23 7l-7 5 7 5V7zM3 5h12v14H3z"/></svg>; }
function IconArrow() { return <svg {...svgProps}><path d="M12 5l7 7-7 7M5 12h14"/></svg>; }
function IconFace() { return <svg {...svgProps}><circle cx="12" cy="8" r="4"/><path d="M16 14h2a4 4 0 014 4v2H2v-2a4 4 0 014-4h2"/></svg>; }
function IconBook() { return <svg {...svgProps}><path d="M4 19V5a2 2 0 012-2h12a2 2 0 012 2v14M4 19h16M9 9h6M9 13h4"/></svg>; }
function IconWave() { return <svg {...svgProps}><path d="M12 2v20M6 6c0 6 12 6 12 0M6 18c0-6 12-6 12 0"/></svg>; }
function IconGrid() { return <svg {...svgProps}><path d="M3 3h7v7H3zm11 0h7v7h-7zM3 14h7v7H3zm11 0h7v7h-7z"/></svg>; }
function IconBolt() { return <svg {...svgProps}><path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z"/></svg>; }
function IconCube() { return <svg {...svgProps}><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16zM3.27 6.96L12 12.01l8.73-5.05M12 22.08V12"/></svg>; }
