'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { t, type Lang } from '@/lib/i18n';

type Stage = 'upload' | 'preview' | 'loading' | 'result' | 'blocked';

const MAX_FILE_MB = 8;

export default function DemoPanel({ lang, registerUrl }: { lang: Lang; registerUrl: string }) {
  const tr = (k: Parameters<typeof t>[0]) => t(k, lang);
  const [stage, setStage] = useState<Stage>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [resultDataUrl, setResultDataUrl] = useState<string>('');
  const [loaderStep, setLoaderStep] = useState<string>('');
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  /* cleanup blob URL */
  useEffect(() => () => { if (previewUrl) URL.revokeObjectURL(previewUrl); }, [previewUrl]);

  function handleFile(f: File) {
    if (!f.type.startsWith('image/')) { alert(tr('demoBlockedTitle')); return; }
    if (f.size > MAX_FILE_MB * 1024 * 1024) {
      alert(`${tr('demoDropHint')} (${(f.size/1024/1024).toFixed(1)}MB)`);
      return;
    }
    setFile(f);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(f));
    setStage('preview');
  }

  async function generate() {
    if (!file) return;
    setStage('loading');
    setLoaderStep(tr('demoStarting'));

    const fd = new FormData();
    fd.append('image', file);

    const ac = new AbortController();
    const timeout = setTimeout(() => ac.abort(), 120000);
    try {
      setLoaderStep(tr('demoGenerating'));
      const res = await fetch('/api/public-generate', {
        method: 'POST',
        body: fd,
        credentials: 'include',
        signal: ac.signal,
      });
      clearTimeout(timeout);

      if (res.status === 429) { setStage('blocked'); return; }

      const json = await res.json().catch(() => null);
      if (!res.ok || !json?.ok) {
        alert(json?.error ?? `Error ${res.status}`);
        setStage('preview');
        return;
      }
      setResultDataUrl(json.outputUrl);
      setStage('result');
    } catch (e) {
      clearTimeout(timeout);
      alert(ac.signal.aborted ? 'Timeout' : 'Connection error');
      setStage('preview');
    }
  }

  function reset() {
    setFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl('');
    setResultDataUrl('');
    if (inputRef.current) inputRef.current.value = '';
    setStage('upload');
  }

  /* ---- check rate-limit on mount (via HEAD/OPTIONS not available; use a no-op fetch that returns 429 if cookie set) ---- */
  /* We skip that check here — the actual generate call returns 429 if already used. */

  return (
    <div className="max-w-[720px] mx-auto bg-ink-800 border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl">
      {stage === 'upload' && (
        <div className="flex flex-col gap-4">
          <label
            htmlFor="demo-file"
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files?.[0]; if (f) handleFile(f); }}
            className={`block border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all ${
              dragOver ? 'border-lime bg-lime/10' : 'border-lime/50 bg-lime/5 hover:border-lime hover:bg-lime/5'
            }`}
          >
            <input
              ref={inputRef}
              id="demo-file"
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
            />
            <div className="text-4xl mb-2">📤</div>
            <p className="font-bold mb-1.5">{tr('demoDropTitle')}</p>
            <p className="text-bone-dim text-xs">{tr('demoDropHint')}</p>
          </label>
        </div>
      )}

      {stage === 'preview' && previewUrl && (
        <div className="flex flex-col gap-5">
          <div className="max-w-[420px] mx-auto rounded-2xl overflow-hidden border border-white/10 bg-black">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={previewUrl} alt="Preview" className="w-full block" />
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={reset} className="bg-transparent text-bone-dim border border-white/20 px-5 py-3 rounded-xl font-semibold text-sm hover:border-lime hover:text-bone transition-colors">
              {tr('demoChange')}
            </button>
            <button onClick={generate} className="bg-lime text-ink-900 px-6 py-3 rounded-xl font-bold text-sm hover:-translate-y-px transition-transform">
              {tr('demoGo')}
            </button>
          </div>
        </div>
      )}

      {stage === 'loading' && (
        <div className="text-center py-10">
          <div className="w-13 h-13 mx-auto mb-4 border-[3px] border-lime/10 border-t-lime rounded-full animate-spin" style={{ width: 52, height: 52 }} />
          <p className="font-bold text-lg mb-1.5">{tr('demoGenerating')}</p>
          <p className="text-lime font-semibold text-sm">{loaderStep}</p>
        </div>
      )}

      {stage === 'result' && resultDataUrl && (
        <div className="flex flex-col gap-5">
          <div className="max-w-[480px] mx-auto rounded-2xl overflow-hidden border border-lime/40 bg-black shadow-2xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={resultDataUrl} alt="Generated" className="w-full block" />
          </div>
          <p className="text-bone-dim text-center text-sm max-w-[520px] mx-auto leading-relaxed">
            {tr('demoResultCaption')}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={resultDataUrl}
              download="goz-preview.jpg"
              className="bg-transparent text-bone-dim border border-white/20 px-5 py-3 rounded-xl font-semibold text-sm hover:border-lime hover:text-bone transition-colors text-center"
            >
              {tr('demoDownload')}
            </a>
            <Link
              href={registerUrl}
              className="bg-lime text-ink-900 px-6 py-3 rounded-xl font-bold text-sm hover:-translate-y-px transition-transform text-center"
            >
              {tr('demoUpgrade')}
            </Link>
          </div>
        </div>
      )}

      {stage === 'blocked' && (
        <div className="text-center py-6 px-3">
          <div className="text-5xl mb-3">🔒</div>
          <h3 className="text-xl font-bold mb-3">{tr('demoBlockedTitle')}</h3>
          <p className="text-bone-dim text-sm max-w-[480px] mx-auto mb-6 leading-relaxed">{tr('demoBlockedBody')}</p>
          <Link
            href={registerUrl}
            className="inline-flex items-center gap-2 bg-lime text-ink-900 font-extrabold px-7 py-4 rounded-xl hover:-translate-y-px transition-transform"
          >
            {tr('demoBlockedCta')}
          </Link>
        </div>
      )}
    </div>
  );
}
