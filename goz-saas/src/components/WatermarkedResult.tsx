'use client';
import type { Lang } from '@/lib/i18n';
import Link from 'next/link';

export default function WatermarkedResult({
  src,
  lang,
  onOpen,
}: {
  src: string;
  lang: Lang;
  onOpen?: () => void;
}) {
  return (
    <div className="space-y-4">
      <button type="button" onClick={() => onOpen?.()} className="block w-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt=""
          className="block max-h-[700px] w-auto mx-auto rounded-2xl border border-lime/40 cursor-zoom-in shadow-2xl"
        />
      </button>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <a href={src} download="goz-preview.jpg" className="btn-ghost text-xs">
          ↓ {lang === 'pt' ? 'Baixar (com marca)' : lang === 'es' ? 'Descargar (con marca)' : 'Download (watermarked)'}
        </a>
        <Link href="/signup" className="btn-primary text-xs">
          {lang === 'pt' ? 'Liberar versão limpa →' : lang === 'es' ? 'Liberar versión limpia →' : 'Unlock clean version →'}
        </Link>
      </div>
      <p className="text-xs text-bone-mute text-center max-w-md mx-auto">
        {lang === 'pt'
          ? 'Esta é uma prévia gratuita. Cadastre-se para baixar sem marca d\'água.'
          : lang === 'es'
          ? 'Esta es una vista previa gratis. Regístrate para descargar sin marca de agua.'
          : 'This is a free preview. Sign up to download without watermark.'}
      </p>
    </div>
  );
}
