import Link from 'next/link';
import { notFound } from 'next/navigation';
import { fetchPromptSection } from '@/lib/promptsApi';
import { getLang } from '@/lib/lang';
import type { Lang } from '@/lib/i18n';
import PromptCard from '@/components/PromptCard';

export const revalidate = 600;

const COPY: Record<Lang, { back: string; empty: string; copy: string; copied: string }> = {
  pt: { back: '← Voltar para prompts', empty: 'Sem prompts nesta categoria.', copy: 'copiar prompt', copied: 'copiado' },
  en: { back: '← Back to prompts', empty: 'No prompts in this category.', copy: 'copy prompt', copied: 'copied' },
  es: { back: '← Volver a prompts', empty: 'Sin prompts en esta categoría.', copy: 'copiar prompt', copied: 'copiado' },
};

export default async function PromptSectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [lang, section] = await Promise.all([getLang(), fetchPromptSection(slug)]);
  if (!section) notFound();

  const c = COPY[lang];

  return (
    <div className="space-y-10">
      <header className="pb-6 border-b border-white/10">
        <Link href="/dashboard/prompts" className="text-xs font-bold tracking-widest text-bone-mute uppercase hover:text-lime transition-colors">
          {c.back}
        </Link>
        <div className="flex items-center gap-3 mt-4 mb-2">
          {section.icon && <span className="text-3xl">{section.icon}</span>}
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">{section.title}</h1>
        </div>
        {section.description && (
          <p className="text-sm text-bone-dim max-w-[640px] mt-2">{section.description}</p>
        )}
      </header>

      {section.categories.map((category) => (
        <section key={category.id} className="space-y-4">
          <h2 className="text-xl md:text-2xl font-bold tracking-tight">{category.title}</h2>
          {category.prompts.length === 0 ? (
            <p className="text-xs text-bone-mute">{c.empty}</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              {category.prompts.map((p) => (
                <PromptCard key={p.id} prompt={p} copyLabel={c.copy} copiedLabel={c.copied} />
              ))}
            </div>
          )}
        </section>
      ))}
    </div>
  );
}
