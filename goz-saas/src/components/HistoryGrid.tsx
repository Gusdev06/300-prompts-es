'use client';
import { useState } from 'react';
import Lightbox from './Lightbox';
import { type Lang, t } from '@/lib/i18n';

type Item = {
  id: string;
  prompt: string;
  output_url: string | null;
  kind: string | null;
  created_at: string;
  credits_spent: number;
};

const kindLabel: Record<string, string> = {
  enhance: 'Enhance',
  undress: 'Undress',
  faceswap: 'Face Swap',
  edit: 'Edit',
  video: 'Video',
};

const isVideoUrl = (url: string) => /\.(mp4|webm|mov)(\?|$)/i.test(url);

export default function HistoryGrid({
  items,
  lang,
  cols = 4,
}: {
  items: Item[];
  lang: Lang;
  cols?: number;
}) {
  const [open, setOpen] = useState<string | null>(null);

  if (!items.length) {
    return (
      <div className="card py-14 text-center">
        <div className="text-5xl mb-3 opacity-40">📭</div>
        <p className="text-xl font-bold text-bone-dim">{t('emptyHistory', lang)}</p>
      </div>
    );
  }

  const colClass =
    cols === 3
      ? 'sm:grid-cols-2 md:grid-cols-3'
      : 'sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4';

  return (
    <>
      <div className={`grid ${colClass} gap-3`}>
        {items.map((g) => (
          <figure key={g.id} className="group relative rounded-2xl overflow-hidden border border-white/10 bg-ink-800 hover:border-lime/40 transition-colors">
            <button
              onClick={() => {
                if (!g.output_url) return;
                if (isVideoUrl(g.output_url)) {
                  window.open(g.output_url, '_blank');
                } else {
                  setOpen(g.output_url);
                }
              }}
              className="block aspect-square w-full overflow-hidden"
              aria-label="open"
            >
              {g.output_url ? (
                isVideoUrl(g.output_url) ? (
                  <video
                    src={g.output_url}
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    onMouseEnter={(e) => e.currentTarget.play().catch(() => {})}
                    onMouseLeave={(e) => { e.currentTarget.pause(); e.currentTarget.currentTime = 0; }}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={g.output_url}
                    alt=""
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                )
              ) : (
                <div className="w-full h-full grid place-items-center text-bone-mute text-xs">
                  {kindLabel[g.kind ?? ''] ?? '—'}
                </div>
              )}
            </button>
            <figcaption className="absolute inset-x-0 bottom-0 p-3 flex items-center justify-between bg-gradient-to-t from-black/80 via-black/40 to-transparent">
              <span className="text-[10px] font-bold tracking-widest text-bone-dim uppercase">
                {kindLabel[g.kind ?? ''] ?? '—'}
              </span>
              {g.output_url && (
                <a
                  href={g.output_url}
                  download
                  onClick={(e) => e.stopPropagation()}
                  className="text-[10px] font-bold bg-lime text-ink-900 px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity hover:brightness-110"
                >
                  ↓ DOWNLOAD
                </a>
              )}
            </figcaption>
          </figure>
        ))}
      </div>
      <Lightbox src={open} onClose={() => setOpen(null)} />
    </>
  );
}
