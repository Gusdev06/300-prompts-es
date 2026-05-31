'use client';

import { useEffect, useRef, useState } from 'react';
import type { PromptTemplate } from '@/lib/promptsApi';
import PromptCard from './PromptCard';

type Strings = {
  placeholder: string;
  emptyHint: string;
  noResults: string;
  searching: string;
  copy: string;
  copied: string;
};

export default function PromptsSearch({ strings }: { strings: Strings }) {
  const [q, setQ] = useState('');
  const [results, setResults] = useState<PromptTemplate[] | null>(null);
  const [loading, setLoading] = useState(false);
  const lastReqId = useRef(0);

  useEffect(() => {
    const term = q.trim();
    if (!term) {
      setResults(null);
      setLoading(false);
      return;
    }
    const id = ++lastReqId.current;
    setLoading(true);
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/prompts/search?q=${encodeURIComponent(term)}`);
        const data = (await res.json()) as PromptTemplate[];
        if (id === lastReqId.current) setResults(data);
      } catch {
        if (id === lastReqId.current) setResults([]);
      } finally {
        if (id === lastReqId.current) setLoading(false);
      }
    }, 280);
    return () => clearTimeout(t);
  }, [q]);

  return (
    <div className="space-y-6">
      <div className="relative">
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={strings.placeholder}
          className="w-full bg-ink-800 border border-white/10 rounded-2xl px-5 py-4 pl-12 text-sm text-bone placeholder:text-bone-mute focus:outline-none focus:border-lime/50 transition-colors"
        />
        <svg
          aria-hidden
          className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-bone-mute"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        {loading && (
          <span className="absolute right-5 top-1/2 -translate-y-1/2 text-[11px] font-semibold tracking-widest text-bone-mute uppercase">
            {strings.searching}
          </span>
        )}
      </div>

      {results !== null && (
        <div>
          {results.length === 0 ? (
            <p className="text-center text-sm text-bone-mute py-12">{strings.noResults}</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              {results.map((p) => (
                <PromptCard key={p.id} prompt={p} copyLabel={strings.copy} copiedLabel={strings.copied} />
              ))}
            </div>
          )}
        </div>
      )}

      {results === null && (
        <p className="text-center text-xs text-bone-mute">{strings.emptyHint}</p>
      )}
    </div>
  );
}
