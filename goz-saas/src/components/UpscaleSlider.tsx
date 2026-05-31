'use client';

import { useEffect, useRef, useState } from 'react';

export default function UpscaleSlider({ src }: { src: string }) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const draggingRef = useRef(false);
  const [x, setX] = useState(50);

  function setFromClient(clientX: number) {
    const el = cardRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = Math.max(0, Math.min(100, ((clientX - r.left) / r.width) * 100));
    setX(px);
  }

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    function onDown(e: MouseEvent | TouchEvent) {
      draggingRef.current = true;
      const cx = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
      setFromClient(cx);
    }
    function onMove(e: MouseEvent | TouchEvent) {
      if (!draggingRef.current) return;
      if (e.cancelable) e.preventDefault();
      const cx = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
      setFromClient(cx);
    }
    function onUp() { draggingRef.current = false; }

    el.addEventListener('mousedown', onDown);
    el.addEventListener('touchstart', onDown, { passive: true });
    window.addEventListener('mousemove', onMove);
    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchend', onUp);

    /* animação inicial uma vez visível */
    let raf = 0;
    let t = 0;
    const from = 50, to = 75;
    function tick() {
      if (draggingRef.current) return;
      t += 0.012;
      if (t >= 1) return;
      const ease = t < 0.5 ? from + (to - from) * (t * 2) : to - (to - from) * ((t - 0.5) * 2);
      setX(ease);
      raf = requestAnimationFrame(tick);
    }
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) { tick(); obs.unobserve(el); }
      }),
      { threshold: 0.4 }
    );
    obs.observe(el);

    return () => {
      el.removeEventListener('mousedown', onDown);
      el.removeEventListener('touchstart', onDown);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchend', onUp);
      cancelAnimationFrame(raf);
      obs.disconnect();
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className="relative aspect-[4/5] rounded-2xl overflow-hidden border border-white/10 cursor-ew-resize select-none touch-none bg-black"
      style={{ ['--x' as string]: `${x}%` }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="4K" className="absolute inset-0 w-full h-full object-cover pointer-events-none" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src} alt="144P"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        style={{
          filter: 'blur(0.6px) brightness(0.88) contrast(0.9) saturate(0.2) sepia(0.45)',
          clipPath: `inset(0 calc(100% - ${x}%) 0 0)`,
        }}
      />
      <span className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm text-white px-2.5 py-1 rounded text-[0.7rem] font-bold tracking-wider pointer-events-none">144P</span>
      <span className="absolute top-3 right-3 bg-lime text-ink-900 px-2.5 py-1 rounded text-[0.7rem] font-bold tracking-wider pointer-events-none">4K</span>
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-lime pointer-events-none"
        style={{ left: `${x}%`, boxShadow: '0 0 18px rgba(212,255,0,0.45)' }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-lime flex items-center justify-center text-ink-900 font-black text-[0.7rem] tracking-[4px]" style={{ boxShadow: '0 0 24px rgba(212,255,0,0.55)' }}>
          ◂▸
        </div>
      </div>
    </div>
  );
}
