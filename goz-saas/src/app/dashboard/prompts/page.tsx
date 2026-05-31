import Link from 'next/link';
import { fetchAllPromptSections } from '@/lib/promptsApi';
import { getLang } from '@/lib/lang';
import type { Lang } from '@/lib/i18n';
import PromptCard from '@/components/PromptCard';
import PromptsSearch from '@/components/PromptsSearch';

export const revalidate = 600;

const COPY: Record<Lang, {
  eyebrow: string;
  title: string;
  subtitle: string;
  searchPlaceholder: string;
  searchHint: string;
  noResults: string;
  searching: string;
  copy: string;
  copied: string;
  viewSection: string;
  empty: string;
  loadError: string;
}> = {
  pt: {
    eyebrow: 'Biblioteca',
    title: 'Prompts prontos',
    subtitle: 'Centenas de prompts validados. Clique no card para copiar.',
    searchPlaceholder: 'Buscar prompts (ex: outono, lingerie, fitness)…',
    searchHint: 'Digite para buscar em toda a biblioteca.',
    noResults: 'Nada encontrado.',
    searching: 'Buscando…',
    copy: 'copiar prompt',
    copied: 'copiado',
    viewSection: 'Ver seção',
    empty: 'Sem prompts nesta seção.',
    loadError: 'Não conseguimos carregar os prompts agora. Tente recarregar.',
  },
  en: {
    eyebrow: 'Library',
    title: 'Ready-made prompts',
    subtitle: 'Hundreds of validated prompts. Click a card to copy.',
    searchPlaceholder: 'Search prompts (e.g. autumn, lingerie, fitness)…',
    searchHint: 'Type to search the full library.',
    noResults: 'Nothing found.',
    searching: 'Searching…',
    copy: 'copy prompt',
    copied: 'copied',
    viewSection: 'View section',
    empty: 'No prompts in this section.',
    loadError: 'We could not load prompts right now. Try reloading.',
  },
  es: {
    eyebrow: 'Biblioteca',
    title: 'Prompts listos',
    subtitle: 'Cientos de prompts validados. Haz clic en una tarjeta para copiar.',
    searchPlaceholder: 'Buscar prompts (ej: otoño, lencería, fitness)…',
    searchHint: 'Escribe para buscar en toda la biblioteca.',
    noResults: 'Nada encontrado.',
    searching: 'Buscando…',
    copy: 'copiar prompt',
    copied: 'copiado',
    viewSection: 'Ver sección',
    empty: 'Sin prompts en esta sección.',
    loadError: 'No pudimos cargar los prompts ahora. Intenta recargar.',
  },
};

export default async function PromptsPage() {
  const lang = await getLang();
  const c = COPY[lang];

  let sections;
  try {
    sections = await fetchAllPromptSections();
  } catch {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{c.title}</h1>
        <div className="card text-sm text-bone-dim">{c.loadError}</div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <header className="pb-6 border-b border-white/10">
        <p className="text-xs font-bold tracking-widest text-bone-mute uppercase mb-3">{c.eyebrow}</p>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">{c.title}</h1>
        <p className="text-sm text-bone-dim mt-3 max-w-[640px]">{c.subtitle}</p>
      </header>

      <PromptsSearch
        strings={{
          placeholder: c.searchPlaceholder,
          emptyHint: c.searchHint,
          noResults: c.noResults,
          searching: c.searching,
          copy: c.copy,
          copied: c.copied,
        }}
      />

      {sections.length === 0 ? (
        <p className="text-center text-sm text-bone-mute py-12">{c.empty}</p>
      ) : (
        sections.map((section) => (
          <section key={section.id} className="space-y-6">
            <div className="flex items-end justify-between gap-4 flex-wrap">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  {section.icon && <span className="text-2xl">{section.icon}</span>}
                  <h2 className="text-2xl md:text-3xl font-bold tracking-tight">{section.title}</h2>
                </div>
                {section.description && (
                  <p className="text-sm text-bone-dim max-w-[640px]">{section.description}</p>
                )}
              </div>
              <Link
                href={`/dashboard/prompts/${section.slug}`}
                className="text-sm text-lime font-semibold hover:underline shrink-0"
              >
                {c.viewSection} →
              </Link>
            </div>

            {section.categories.map((category) => (
              <div key={category.id} className="space-y-3">
                <h3 className="text-[11px] font-bold tracking-[0.18em] text-bone-mute uppercase">
                  {category.title}
                </h3>
                {category.prompts.length === 0 ? (
                  <p className="text-xs text-bone-mute">{c.empty}</p>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                    {category.prompts.map((p) => (
                      <PromptCard key={p.id} prompt={p} copyLabel={c.copy} copiedLabel={c.copied} />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </section>
        ))
      )}
    </div>
  );
}
