'use client';
import { useEffect, useRef, useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { generateAction, type GenResult } from '@/lib/actions/generate';
import Lightbox from './Lightbox';
import WatermarkedResult from './WatermarkedResult';
import { t, type Lang } from '@/lib/i18n';

const ANON_KEY = 'goz_free_used';

type Kind = 'enhance' | 'undress' | 'faceswap' | 'edit' | 'video';

const TABS: { id: Kind; en: string; pt: string; es: string; icon: string }[] = [
  { id: 'enhance', en: 'Enhance', pt: 'Enhance', es: 'Mejorar', icon: '✨' },
  { id: 'undress', en: 'Undress', pt: 'Undress', es: 'Undress', icon: '🔥' },
  { id: 'faceswap', en: 'Face Swap', pt: 'Face Swap', es: 'Face Swap', icon: '🎭' },
  { id: 'edit', en: 'Edit', pt: 'Editar', es: 'Editar', icon: '✏️' },
  { id: 'video', en: 'Video', pt: 'Vídeo', es: 'Video', icon: '🎬' },
];

const labelFor = (tab: typeof TABS[number], lang: Lang) =>
  lang === 'pt' ? tab.pt : lang === 'es' ? tab.es : tab.en;

export default function GenPanel({
  lang,
  credits,
  isAnon = false,
}: {
  lang: Lang;
  credits: number;
  isAnon?: boolean;
}) {
  const [kind, setKind] = useState<Kind>('enhance');
  const [editPrompt, setEditPrompt] = useState('');
  const [reusedUrl, setReusedUrl] = useState<string | null>(null);
  const [result, setResult] = useState<GenResult | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [drag, setDrag] = useState(false);
  const [open, setOpen] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const [freeUsed, setFreeUsed] = useState(false);
  const [videoPoll, setVideoPoll] = useState<{
    runId: string;
    remaining: number;
    status: string;
    progress: number;
    liveStatus: string | null;
  } | null>(null);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isAnon && typeof window !== 'undefined') {
      setFreeUsed(window.localStorage.getItem(ANON_KEY) === '1');
    }
  }, [isAnon]);

  useEffect(() => {
    if (!videoPoll || result?.ok) return;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | null = null;

    const tick = async () => {
      try {
        const res = await fetch(`/api/video-status/${videoPoll.runId}`, { cache: 'no-store' });
        const data = await res.json();
        if (cancelled) return;

        if (data.status === 'success' && data.outputUrl) {
          setResult({ ok: true, outputUrl: data.outputUrl, remaining: videoPoll.remaining });
          setVideoPoll(null);
          router.refresh();
          return;
        }
        if (data.status === 'failed' || data.status === 'cancelled' || data.status === 'timeout') {
          setResult({
            ok: false,
            error: data.error || `Run ${data.status}`,
            refunded: Boolean(data.refunded),
          });
          setVideoPoll(null);
          router.refresh();
          return;
        }

        setVideoPoll((prev) =>
          prev
            ? {
                ...prev,
                status: data.status ?? prev.status,
                progress: typeof data.progress === 'number' ? data.progress : prev.progress,
                liveStatus: data.liveStatus ?? prev.liveStatus,
              }
            : prev
        );
        timer = setTimeout(tick, 4000);
      } catch {
        if (cancelled) return;
        timer = setTimeout(tick, 6000);
      }
    };

    timer = setTimeout(tick, 2000);
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [videoPoll, result, router]);

  const expectedFiles = kind === 'faceswap' ? 2 : 1;
  const cost = kind === 'video' ? 25 : 5;
  const showUpload = !((kind === 'edit' || kind === 'video') && reusedUrl);
  const blockedAnon = isAnon && (freeUsed || kind === 'video');
  const insufficient = !isAnon && credits < cost;
  const needsPrompt = kind === 'edit' || kind === 'video';
  const canSubmit =
    !pending &&
    !videoPoll &&
    !insufficient &&
    !blockedAnon &&
    (needsPrompt
      ? editPrompt.trim().length > 1 && (reusedUrl || files.length >= 1)
      : files.length >= expectedFiles);

  function handleFiles(list: FileList | File[]) {
    const arr = Array.from(list).filter((f) => f.type.startsWith('image/'));
    setFiles(arr.slice(0, expectedFiles));
    setResult(null);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const fd = new FormData();
    fd.set('kind', kind);
    if (kind === 'edit' || kind === 'video') {
      fd.set('prompt', editPrompt);
      if (reusedUrl) fd.set('reused_url', reusedUrl);
    }
    for (const f of files) fd.append('images', f);
    start(async () => {
      const r = await generateAction(fd);
      if (r.ok && 'isVideo' in r && r.isVideo) {
        setResult(null);
        setVideoPoll({
          runId: r.runId,
          remaining: r.remaining,
          status: 'queued',
          progress: 0,
          liveStatus: null,
        });
        setFiles([]);
        router.refresh();
        return;
      }
      setResult(r);
      if (r.ok && 'outputUrl' in r) {
        setReusedUrl(r.outputUrl);
        setFiles([]);
        if (isAnon && typeof window !== 'undefined') {
          window.localStorage.setItem(ANON_KEY, '1');
          setFreeUsed(true);
        }
        if (!isAnon) router.refresh();
      }
    });
  }

  function resetKind(id: Kind) {
    setKind(id);
    setResult(null);
    setFiles([]);
  }

  const uploadHint =
    kind === 'faceswap'
      ? t('uploadTwoFace', lang)
      : kind === 'enhance'
      ? t('uploadOneEnhance', lang)
      : t('uploadOne', lang);

  return (
    <section className="card !p-0 overflow-hidden">
      {/* tabs */}
      <div className="border-b border-white/10 px-2 pt-2 flex gap-1 overflow-x-auto">
        {TABS.map((tb) => {
          const active = kind === tb.id;
          return (
            <button
              key={tb.id}
              type="button"
              onClick={() => resetKind(tb.id)}
              className={`relative px-4 py-3 text-sm font-semibold rounded-t-lg transition-colors whitespace-nowrap ${
                active
                  ? 'bg-ink-700 text-bone border-b-2 border-lime'
                  : 'text-bone-dim hover:text-bone hover:bg-white/5'
              }`}
            >
              <span className="mr-2">{tb.icon}</span>
              {labelFor(tb, lang)}
            </button>
          );
        })}
      </div>

      {!isAnon && (
        <div className="mx-6 md:mx-8 mt-6 border border-amber-500/40 bg-amber-500/[0.06] rounded-xl px-4 py-3 text-xs text-amber-200/90 flex items-start gap-2">
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
              ? 'Os links de saída expiram em até 48h. Baixe imediatamente — depois disso o conteúdo é perdido e não pode ser recuperado.'
              : lang === 'es'
              ? 'Los enlaces de salida expiran en hasta 48h. Descarga al instante — luego el contenido se pierde y no puede recuperarse.'
              : 'Output links expire within 48h. Download immediately — after that the content is lost and cannot be recovered.'}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-6 md:p-8 grid lg:grid-cols-[1fr_300px] gap-8">
        {/* input area */}
        <div className="space-y-5">
          {showUpload && (
            <div>
              <label className="field-label">{uploadHint}</label>

              <div
                onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
                onDragLeave={() => setDrag(false)}
                onDrop={(e) => { e.preventDefault(); setDrag(false); handleFiles(e.dataTransfer.files); }}
                onClick={() => inputRef.current?.click()}
                className={`relative border-2 border-dashed cursor-pointer transition-all rounded-2xl p-10 grid place-items-center min-h-[280px] ${
                  drag ? 'border-lime bg-lime/10' : 'border-lime/50 bg-lime/5 hover:border-lime hover:bg-lime/5'
                }`}
              >
                <input
                  ref={inputRef}
                  type="file"
                  accept="image/*"
                  multiple={expectedFiles > 1}
                  className="hidden"
                  onChange={(e) => e.target.files && handleFiles(e.target.files)}
                />
                {files.length === 0 ? (
                  <div className="text-center">
                    <div className="text-4xl mb-2">📤</div>
                    <p className="font-bold text-base mb-1.5">
                      {lang === 'pt' ? 'Arraste sua imagem aqui ou clique' : lang === 'es' ? 'Arrastra tu imagen aquí o haz clic' : 'Drag your image here or click'}
                    </p>
                    <p className="text-xs text-bone-dim">
                      {expectedFiles > 1
                        ? lang === 'pt'
                          ? '2 imagens — rosto + corpo/cena'
                          : lang === 'es'
                          ? '2 imágenes — rostro + cuerpo/escena'
                          : '2 images — face + body/scene'
                        : 'JPG · PNG · WEBP — max 8MB'}
                    </p>
                  </div>
                ) : (
                  <div className={`grid ${files.length > 1 ? 'grid-cols-2' : 'grid-cols-1'} gap-3 w-full`}>
                    {files.map((f, i) => (
                      <div key={i} className="relative aspect-square overflow-hidden bg-ink-900 border border-white/10 rounded-xl">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={URL.createObjectURL(f)} alt="" className="w-full h-full object-cover" />
                        <div className="absolute top-2 left-2 text-[10px] font-bold tracking-widest bg-ink-900/80 backdrop-blur-sm px-2 py-1 rounded">
                          {expectedFiles > 1 ? (i === 0 ? 'FACE' : 'TARGET') : '01'}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {needsPrompt && (
            <div>
              <label className="field-label">
                {kind === 'video'
                  ? lang === 'pt'
                    ? 'Descreva o que deve acontecer no vídeo.'
                    : lang === 'es'
                    ? 'Describe lo que debe pasar en el video.'
                    : 'Describe what should happen in the video.'
                  : t('editHint', lang)}
              </label>
              <textarea
                value={editPrompt}
                onChange={(e) => setEditPrompt(e.target.value)}
                rows={kind === 'video' ? 4 : 3}
                placeholder={
                  kind === 'video'
                    ? lang === 'pt'
                      ? 'Ex: a mulher caminha lentamente em direção à câmera, balançando os cabelos'
                      : lang === 'es'
                      ? 'Ej: la mujer camina lentamente hacia la cámara, balanceando el pelo'
                      : 'Ex: the woman walks slowly toward the camera, swaying her hair'
                    : lang === 'pt'
                    ? 'Ex: troque o fundo por uma praia ao entardecer'
                    : lang === 'es'
                    ? 'Ej: cambia el fondo por una playa al atardecer'
                    : 'Ex: change the background to a beach at sunset'
                }
                className="input resize-none"
              />
              {reusedUrl && (
                <p className="text-xs text-bone-dim mt-2 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-lime" />
                  {t('reusing', lang)} ·{' '}
                  <button type="button" className="text-lime font-semibold hover:underline" onClick={() => setReusedUrl(null)}>
                    {t('uploadNew', lang)}
                  </button>
                </p>
              )}
            </div>
          )}

          {insufficient && (
            <div className="border border-red-500/30 bg-red-500/10 rounded-xl p-4 text-sm space-y-2">
              <div className="font-bold text-red-400">⚠ {t('insufficient', lang)}</div>
              <p className="text-bone-dim">
                {lang === 'pt' ? 'Compre um pacote para liberar renders.' : lang === 'es' ? 'Compra un paquete para liberar renders.' : 'Buy a pack to unlock renders.'}
              </p>
              <Link href="/pricing" className="btn-primary text-xs mt-1">{t('buy', lang)}</Link>
            </div>
          )}

          {blockedAnon && (
            <div className="border border-lime/30 bg-lime/10 rounded-xl p-4 text-sm space-y-2">
              <div className="font-bold text-lime">🔒 {lang === 'pt' ? 'Free preview usado' : lang === 'es' ? 'Free preview usado' : 'Free preview used'}</div>
              <p className="text-bone-dim">
                {lang === 'pt' ? 'Você já usou seu render grátis. Cadastre-se para mais.' : lang === 'es' ? 'Ya usaste tu render gratis. Crea tu cuenta para más.' : 'You\'ve used your free render. Sign up for more.'}
              </p>
              <Link href="/signup" className="btn-primary text-xs">{t('signupCta', lang)} →</Link>
            </div>
          )}

          {videoPoll && (
            <div className="border border-lime/30 bg-lime/5 rounded-xl p-4 text-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="font-bold text-lime flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-lime animate-pulse" />
                  {videoPoll.status === 'queued'
                    ? lang === 'pt' ? 'Vídeo na fila' : lang === 'es' ? 'Video en cola' : 'Video queued'
                    : lang === 'pt' ? 'Gerando vídeo' : lang === 'es' ? 'Generando video' : 'Generating video'}
                </div>
                <span className="font-mono text-xs text-bone-dim">{Math.round((videoPoll.progress ?? 0) * 100)}%</span>
              </div>
              <div className="h-2 bg-ink-900 rounded-full overflow-hidden">
                <div
                  className="h-full bg-lime transition-all duration-500"
                  style={{ width: `${Math.max(2, Math.round((videoPoll.progress ?? 0) * 100))}%` }}
                />
              </div>
              {videoPoll.liveStatus && (
                <p className="text-[11px] text-bone-mute font-mono truncate">{videoPoll.liveStatus}</p>
              )}
              <p className="text-xs text-bone-dim">
                {lang === 'pt'
                  ? 'Você pode fechar a aba — o vídeo aparece no histórico quando ficar pronto.'
                  : lang === 'es'
                  ? 'Puedes cerrar la pestaña — el video aparece en el historial cuando esté listo.'
                  : 'You can close this tab — the video will appear in your history when ready.'}
              </p>
            </div>
          )}

          {result?.ok === false && (
            <div className="border border-red-500/30 bg-red-500/10 rounded-xl p-4 text-sm text-red-400 space-y-1.5">
              <div>{result.error}</div>
              {result.refunded && (
                <div className="text-lime text-xs font-semibold">
                  ✓{' '}
                  {lang === 'pt'
                    ? 'Créditos devolvidos automaticamente ao seu saldo.'
                    : lang === 'es'
                    ? 'Créditos devueltos automáticamente a tu saldo.'
                    : 'Credits automatically refunded to your balance.'}
                </div>
              )}
            </div>
          )}
        </div>

        {/* summary panel */}
        <aside className="bg-ink-900 border border-white/10 rounded-2xl p-5 flex flex-col">
          <div className="text-xs font-bold tracking-widest text-bone-mute uppercase mb-4">
            {lang === 'pt' ? 'Resumo' : lang === 'es' ? 'Resumen' : 'Summary'}
          </div>

          <div className="space-y-3.5 text-sm">
            <Row label={lang === 'pt' ? 'Motor' : lang === 'es' ? 'Motor' : 'Engine'} value={labelFor(TABS.find((x) => x.id === kind)!, lang)} />
            <Row label={lang === 'pt' ? 'Entradas' : lang === 'es' ? 'Entradas' : 'Inputs'} value={`${reusedUrl && kind === 'edit' ? 1 : files.length}/${expectedFiles}`} />
            {isAnon ? (
              <>
                <Row label={lang === 'pt' ? 'Custo' : lang === 'es' ? 'Costo' : 'Cost'} value="FREE" accent />
                <Row label={lang === 'pt' ? 'Restante' : lang === 'es' ? 'Restante' : 'Remaining'} value={freeUsed ? '0' : '1'} />
                <Row label={lang === 'pt' ? 'Saída' : lang === 'es' ? 'Salida' : 'Output'} value={lang === 'pt' ? 'com marca' : lang === 'es' ? 'con marca' : 'watermarked'} />
              </>
            ) : (
              <>
                <Row label={lang === 'pt' ? 'Custo' : lang === 'es' ? 'Costo' : 'Cost'} value={`${cost} cr`} accent />
                <Row label={lang === 'pt' ? 'Saldo' : lang === 'es' ? 'Saldo' : 'Balance'} value={`${credits} cr`} />
                <Row label={lang === 'pt' ? 'Após render' : lang === 'es' ? 'Después del render' : 'After render'} value={`${Math.max(0, credits - cost)} cr`} />
              </>
            )}
          </div>

          <div className="mt-auto pt-6">
            <button type="submit" disabled={!canSubmit} className="btn-primary w-full">
              {pending || videoPoll ? (
                <span className="inline-flex items-center gap-2">
                  <span className="inline-block w-4 h-4 border-2 border-ink-900/30 border-t-ink-900 rounded-full animate-spin" />
                  {videoPoll
                    ? videoPoll.status === 'queued'
                      ? lang === 'pt' ? 'Na fila…' : lang === 'es' ? 'En cola…' : 'Queued…'
                      : `${Math.round((videoPoll.progress ?? 0) * 100)}%`
                    : null}
                </span>
              ) : isAnon ? (
                <>{lang === 'pt' ? 'Gerar grátis' : lang === 'es' ? 'Generar gratis' : 'Render free'} →</>
              ) : (
                <>{t('generate', lang)} → {cost} CR</>
              )}
            </button>
            {videoPoll && videoPoll.liveStatus && (
              <p className="text-[11px] text-bone-mute mt-2 text-center font-mono truncate">
                {videoPoll.liveStatus}
              </p>
            )}
            <p className="text-xs text-bone-mute mt-2.5 text-center">
              {kind === 'video'
                ? lang === 'pt' ? '~ 2 a 3 min' : lang === 'es' ? '~ 2 a 3 min' : '~ 2 to 3 min'
                : lang === 'pt' ? '~ 30 a 60s' : lang === 'es' ? '~ 30 a 60s' : '~ 30 to 60s'}
            </p>
          </div>
        </aside>

        {/* result */}
        {result?.ok && 'outputUrl' in result && result.watermarked && (
          <div className="lg:col-span-2 border-t border-lime/40 pt-8 mt-2">
            <div className="flex items-center justify-between mb-4">
              <div className="text-xs font-bold tracking-widest text-lime uppercase">
                {lang === 'pt' ? 'Free preview entregue' : lang === 'es' ? 'Free preview entregado' : 'Free preview delivered'}
              </div>
              <span className="pill">FREE</span>
            </div>
            <WatermarkedResult src={result.outputUrl} lang={lang} onOpen={() => setOpen(result.outputUrl)} />
          </div>
        )}

        {result?.ok && 'outputUrl' in result && !result.watermarked && (() => {
          const isVid = /\.(mp4|webm|mov)(\?|$)/i.test(result.outputUrl);
          return (
            <div className="lg:col-span-2 border-t border-white/10 pt-8 mt-2">
              <div className="flex items-center justify-between mb-4">
                <div className="text-xs font-bold tracking-widest text-bone-mute uppercase">
                  {isVid
                    ? lang === 'pt' ? 'Vídeo entregue' : lang === 'es' ? 'Video entregado' : 'Video delivered'
                    : lang === 'pt' ? 'Render entregue' : lang === 'es' ? 'Render entregado' : 'Render delivered'}
                </div>
                <span className="text-xs text-bone-dim">↓ {result.remaining} CR remaining</span>
              </div>
              {isVid ? (
                <video
                  src={result.outputUrl}
                  controls
                  autoPlay
                  loop
                  playsInline
                  className="max-h-[700px] w-auto mx-auto rounded-2xl border border-white/10"
                />
              ) : (
                <button type="button" onClick={() => setOpen(result.outputUrl)} className="block w-full">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={result.outputUrl} alt="" className="max-h-[700px] w-auto mx-auto rounded-2xl border border-white/10" />
                </button>
              )}
              <div className="mt-4 flex flex-col items-center gap-3">
                <div className="text-center text-[11px] text-amber-300 font-semibold uppercase tracking-widest">
                  {lang === 'pt'
                    ? '⚠ Baixe agora — link expira em ~48h e não fica salvo'
                    : lang === 'es'
                    ? '⚠ Descarga ahora — el enlace expira en ~48h y no se guarda'
                    : '⚠ Download now — link expires in ~48h and is not saved'}
                </div>
                <div className="flex justify-center gap-3">
                  <a href={result.outputUrl} download className="btn-primary text-xs">↓ {t('download', lang)}</a>
                  {!isVid && (
                    <button type="button" onClick={() => { setKind('edit'); setReusedUrl(result.outputUrl); setResult(null); }} className="btn-ghost text-xs">
                      ↻ {t('reuse', lang)}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })()}
      </form>

      <Lightbox src={open} onClose={() => setOpen(null)} />
    </section>
  );
}

function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-bone-mute text-xs uppercase tracking-wide">{label}</span>
      <span className={`font-mono text-sm font-semibold ${accent ? 'text-lime' : 'text-bone'}`}>{value}</span>
    </div>
  );
}
