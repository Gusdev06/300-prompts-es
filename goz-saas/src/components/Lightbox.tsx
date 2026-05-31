'use client';
import { useEffect } from 'react';

export default function Lightbox({
  src,
  onClose,
}: {
  src: string | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!src) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [src, onClose]);

  if (!src) return null;
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[9998] bg-ink-900/95 backdrop-blur-xl flex items-center justify-center p-6"
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute top-5 left-5 text-xs text-bone-dim hover:text-bone bg-ink-800 border border-white/10 rounded-lg px-3 py-1.5"
      >
        ESC · Close
      </button>
      <a
        href={src}
        download
        onClick={(e) => e.stopPropagation()}
        className="absolute top-5 right-5 btn-primary text-xs"
      >
        ↓ Download
      </a>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        onClick={(e) => e.stopPropagation()}
        className="max-h-[88vh] max-w-[92vw] object-contain rounded-2xl border border-white/10"
      />
    </div>
  );
}
