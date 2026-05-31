import type { Lang } from '@/lib/i18n';

type Doc = {
  title: string;
  intro: string;
  sections: { heading: string; body: string }[];
};

export default function LegalDoc({ doc, lang }: { doc: Record<Lang, Doc>; lang: Lang }) {
  const d = doc[lang];
  return (
    <article className="space-y-8">
      <header className="space-y-4 pb-6 border-b border-white/10">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">{d.title}</h1>
        <p className="text-sm text-bone-dim leading-relaxed">{d.intro}</p>
      </header>

      {d.sections.map((s) => (
        <section key={s.heading} className="space-y-2">
          <h2 className="text-lg md:text-xl font-bold tracking-tight">{s.heading}</h2>
          <p className="text-sm text-bone-dim leading-relaxed whitespace-pre-line">{s.body}</p>
        </section>
      ))}
    </article>
  );
}
