'use client';

import { useState } from 'react';
import type { PromptTemplate } from '@/lib/promptsApi';

const TYPE_LABEL: Record<string, string> = {
  text_to_image: 'TEXT → IMG',
  image_to_image: 'IMG → IMG',
  text_to_video: 'TEXT → VIDEO',
  image_to_video: 'IMG → VIDEO',
  motion_control: 'MOTION',
};

export default function PromptCard({
  prompt,
  copyLabel,
  copiedLabel,
}: {
  prompt: PromptTemplate;
  copyLabel: string;
  copiedLabel: string;
}) {
  const [copied, setCopied] = useState(false);

  const thumb = prompt.thumbnailUrl ?? prompt.imageUrl;
  const typeLabel = TYPE_LABEL[prompt.type] ?? prompt.type.toUpperCase();

  async function copy() {
    try {
      await navigator.clipboard.writeText(prompt.prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* ignore */
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="group text-left bg-ink-800 border border-white/10 rounded-2xl overflow-hidden hover:border-lime/40 hover:-translate-y-0.5 transition-all duration-200 flex flex-col"
    >
      <div className="aspect-[9/16] bg-ink-700 overflow-hidden relative">
        {thumb ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={thumb}
            alt={prompt.title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-bone-mute text-xs">no preview</div>
        )}
        <span className="absolute top-2 left-2 text-[9px] font-bold tracking-widest bg-ink-900/80 text-bone px-2 py-1 rounded-md border border-white/10">
          {typeLabel}
        </span>
        {prompt.aiModel && (
          <span className="absolute top-2 right-2 text-[9px] font-bold tracking-widest bg-lime/15 text-lime px-2 py-1 rounded-md border border-lime/30">
            {prompt.aiModel}
          </span>
        )}
      </div>
      <div className="p-3 flex-1 flex flex-col gap-2">
        <h3 className="text-sm font-semibold text-bone leading-snug line-clamp-2 group-hover:text-lime transition-colors">
          {prompt.title}
        </h3>
        <p className="text-[11px] text-bone-mute line-clamp-2 leading-relaxed">{prompt.prompt}</p>
        <span
          className={`mt-auto text-[10px] font-bold tracking-widest uppercase transition-colors ${
            copied ? 'text-lime' : 'text-bone-mute group-hover:text-bone'
          }`}
        >
          {copied ? `✓ ${copiedLabel}` : copyLabel}
        </span>
      </div>
    </button>
  );
}
