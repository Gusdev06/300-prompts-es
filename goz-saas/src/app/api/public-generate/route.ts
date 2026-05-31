/**
 * Public generation endpoint — for the goz.ai landing page demo.
 *
 * Flow:
 *   1. Accept multipart/form-data with `image` (File)
 *   2. Validate size + MIME
 *   3. Check anon rate-limit (cookie + IP-hash header)
 *   4. Call Replicate (UNDRESS_PROMPT by default)
 *   5. Apply HARD watermark via sharp + SVG composite
 *   6. Return data:image/jpeg;base64 result
 *
 * CORS is open by default (Origin: *). Tighten ALLOWED_ORIGINS for prod.
 */

import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';
import { generateImage } from '@/lib/replicate';
import { UNDRESS_PROMPT } from '@/lib/prompts';

export const runtime = 'nodejs';
export const maxDuration = 60;

const MAX_FILE_BYTES = 8 * 1024 * 1024;
const ANON_COOKIE = 'goz_anon_used';
const ALLOWED_MIME = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

/* Whitelist de origens permitidas. Adicione o domínio de produção da LP aqui.
   '*' significa: ecoar qualquer origin recebida (precisa pra credentials=include funcionar). */
const ALLOWED_ORIGINS: string[] = ['*'];

function corsHeaders(origin: string | null) {
  // Quando '*' está na lista, ecoamos a origin recebida (necessário para credentials=include,
  // pois browsers rejeitam ACAO='*' com credenciais).
  const allowOrigin = origin && (ALLOWED_ORIGINS.includes('*') || ALLOWED_ORIGINS.includes(origin))
    ? origin
    : '';
  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Methods': 'POST, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Device-Hash',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  };
}

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, { status: 204, headers: corsHeaders(req.headers.get('origin')) });
}

/* DELETE: clears the anon-used cookie. Útil para dev/QA e para ser chamado
   pelo backend principal quando o usuário se registra (libera 1 free generation). */
export async function DELETE(req: NextRequest) {
  const r = NextResponse.json({ ok: true }, { headers: corsHeaders(req.headers.get('origin')) });
  r.cookies.set(ANON_COOKIE, '', { path: '/', maxAge: 0, httpOnly: true, sameSite: 'lax' });
  return r;
}

function fail(req: NextRequest, status: number, error: string) {
  return NextResponse.json({ ok: false, error }, { status, headers: corsHeaders(req.headers.get('origin')) });
}

async function watermark(buf: Buffer): Promise<Buffer> {
  const meta = await sharp(buf).metadata();
  const W = meta.width ?? 1024;
  const H = meta.height ?? 1024;
  const diag = Math.sqrt(W * W + H * H);
  const tileFont = Math.max(28, Math.floor(W / 22));
  const centerFont = Math.max(72, Math.floor(W / 8));
  const subFont = Math.max(22, Math.floor(centerFont / 3.2));
  const cornerFont = Math.max(18, Math.floor(W / 36));

  const tileText = 'goz.ai · FREE PREVIEW · ';
  const charsPerLine = Math.ceil((diag * 2.5) / (tileFont * 0.55));
  const tileLine = tileText.repeat(Math.ceil(charsPerLine / tileText.length));
  const step = Math.floor(tileFont * 3.2);
  const lines: string[] = [];
  for (let y = -Math.floor(diag); y < diag; y += step) {
    lines.push(
      `<text x="${-Math.floor(diag)}" y="${y}" font-family="Inter, Arial, sans-serif" font-weight="900" font-size="${tileFont}" fill="rgba(255,255,255,0.34)" stroke="rgba(0,0,0,0.6)" stroke-width="${Math.max(1, tileFont / 18)}">${tileLine}</text>`
    );
  }

  const cx = Math.floor(W / 2);
  const cy = Math.floor(H / 2);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    <g transform="rotate(-30 ${cx} ${cy})">${lines.join('')}</g>
    <g transform="rotate(-18 ${cx} ${cy})">
      <text x="${cx}" y="${cy - Math.floor(centerFont * 0.25)}" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-weight="900" font-size="${centerFont}" fill="rgba(212,255,0,0.92)" stroke="rgba(0,0,0,0.92)" stroke-width="${Math.max(3, centerFont / 14)}" paint-order="stroke">goz.ai</text>
      <text x="${cx}" y="${cy + Math.floor(centerFont * 0.55)}" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-weight="700" font-size="${subFont}" fill="rgba(244,237,228,0.98)" stroke="rgba(0,0,0,0.92)" stroke-width="${Math.max(1.5, subFont / 10)}" paint-order="stroke" letter-spacing="4">FREE PREVIEW · SIGN UP TO REMOVE</text>
    </g>
    <text x="${cornerFont * 1.2}" y="${cornerFont * 2}" font-family="Inter, Arial, sans-serif" font-weight="700" font-size="${cornerFont}" fill="rgba(255,255,255,0.95)" stroke="rgba(0,0,0,0.9)" stroke-width="1" paint-order="stroke" letter-spacing="3">goz.ai</text>
    <text x="${W - cornerFont * 1.2}" y="${H - cornerFont * 1.2}" text-anchor="end" font-family="Inter, Arial, sans-serif" font-weight="700" font-size="${cornerFont}" fill="rgba(212,255,0,0.95)" stroke="rgba(0,0,0,0.9)" stroke-width="1" paint-order="stroke" letter-spacing="3">FREE PREVIEW</text>
  </svg>`;

  return sharp(buf)
    .composite([{ input: Buffer.from(svg), top: 0, left: 0 }])
    .jpeg({ quality: 88 })
    .toBuffer();
}

export async function POST(req: NextRequest) {
  const origin = req.headers.get('origin');

  // ---- rate limit (cookie httpOnly) ----
  const cookieHeader = req.headers.get('cookie') ?? '';
  if (cookieHeader.includes(`${ANON_COOKIE}=1`)) {
    return fail(req, 429, 'Free preview already used. Sign up to generate more.');
  }

  // ---- parse ----
  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return fail(req, 400, 'Invalid form data');
  }

  const file = form.get('image');
  if (!(file instanceof File) || file.size === 0) {
    return fail(req, 400, 'Missing image');
  }
  if (file.size > MAX_FILE_BYTES) {
    return fail(req, 400, `Image too large (max ${MAX_FILE_BYTES / 1024 / 1024}MB)`);
  }
  if (!ALLOWED_MIME.includes(file.type)) {
    return fail(req, 400, 'Unsupported image type');
  }

  const customPrompt = form.get('prompt');
  const prompt =
    typeof customPrompt === 'string' && customPrompt.trim().length >= 2
      ? customPrompt.trim().slice(0, 2000)
      : UNDRESS_PROMPT;

  const t0 = Date.now();
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';

  // ---- call Replicate ----
  let rawUrl: string;
  try {
    const buf = Buffer.from(await file.arrayBuffer());
    const dataUri = `data:${file.type};base64,${buf.toString('base64')}`;
    rawUrl = await generateImage(prompt, [dataUri]);
  } catch (err) {
    console.error('[public-generate] replicate fail', { ip, ms: Date.now() - t0, err: err instanceof Error ? err.message : err });
    return fail(req, 502, err instanceof Error ? err.message : 'Generation failed');
  }

  // ---- fetch result + watermark ----
  let watermarkedB64: string;
  try {
    const res = await fetch(rawUrl);
    if (!res.ok) throw new Error('failed to fetch render');
    const buf = Buffer.from(await res.arrayBuffer());
    const out = await watermark(buf);
    watermarkedB64 = `data:image/jpeg;base64,${out.toString('base64')}`;
  } catch (err) {
    console.error('[public-generate] watermark fail', { ip, ms: Date.now() - t0, err: err instanceof Error ? err.message : err });
    return fail(req, 500, err instanceof Error ? err.message : 'Watermark failed');
  }

  console.log('[public-generate] ok', { ip, ms: Date.now() - t0, kb: Math.round(watermarkedB64.length / 1024) });

  const response = NextResponse.json(
    { ok: true, outputUrl: watermarkedB64, watermarked: true },
    { headers: corsHeaders(origin) }
  );
  // set anon-used cookie (1 year)
  response.cookies.set(ANON_COOKIE, '1', {
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
    httpOnly: true,
    sameSite: 'lax',
  });
  return response;
}
