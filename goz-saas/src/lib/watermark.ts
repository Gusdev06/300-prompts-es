import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import * as opentype from 'opentype.js';

const FONT_REL = 'node_modules/geist/dist/fonts/geist-sans/Geist-Black.ttf';

let cachedFont: opentype.Font | null = null;

function loadFont(): opentype.Font {
  if (cachedFont) return cachedFont;
  const abs = path.join(process.cwd(), FONT_REL);
  const buf = fs.readFileSync(abs);
  // opentype.parse expects an ArrayBuffer
  const ab = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer;
  cachedFont = opentype.parse(ab);
  return cachedFont;
}

type Anchor = 'start' | 'middle' | 'end';

function textPath(
  font: opentype.Font,
  text: string,
  x: number,
  y: number,
  fontSize: number,
  letterSpacing: number,
  anchor: Anchor,
): string {
  // Measure with letter spacing
  const baseAdvance = font.getAdvanceWidth(text, fontSize);
  const spacingAdvance = letterSpacing * Math.max(0, text.length - 1);
  const totalWidth = baseAdvance + spacingAdvance;

  let originX = x;
  if (anchor === 'middle') originX = x - totalWidth / 2;
  else if (anchor === 'end') originX = x - totalWidth;

  if (letterSpacing === 0) {
    return font.getPath(text, originX, y, fontSize).toPathData(2);
  }

  // Manual layout for letter-spacing
  let cursor = originX;
  const parts: string[] = [];
  for (const ch of text) {
    parts.push(font.getPath(ch, cursor, y, fontSize).toPathData(2));
    cursor += font.getAdvanceWidth(ch, fontSize) + letterSpacing;
  }
  return parts.join(' ');
}

export async function applyWatermark(buf: Buffer): Promise<Buffer> {
  const meta = await sharp(buf).metadata();
  const W = meta.width ?? 1024;
  const H = meta.height ?? 1024;
  const diag = Math.sqrt(W * W + H * H);

  const tileFont = Math.max(44, Math.floor(W / 12));
  const centerFont = Math.max(120, Math.floor(W / 4.5));
  const subFont = Math.max(34, Math.floor(centerFont / 3.6));
  const cornerFont = Math.max(26, Math.floor(W / 24));

  const font = loadFont();

  // ---- Tiled diagonal text ----
  const tileText = 'goz.ai · FREE PREVIEW · ';
  const tileUnitWidth = font.getAdvanceWidth(tileText, tileFont);
  const lineRepeats = Math.ceil((diag * 2.5) / Math.max(1, tileUnitWidth));
  const tileLine = tileText.repeat(lineRepeats);
  const step = Math.floor(tileFont * 2.0);

  const tilePaths: string[] = [];
  for (let y = -Math.floor(diag); y < diag; y += step) {
    tilePaths.push(textPath(font, tileLine, -Math.floor(diag), y, tileFont, 0, 'start'));
  }
  const tilePathD = tilePaths.join(' ');

  const cx = Math.floor(W / 2);
  const cy = Math.floor(H / 2);

  // ---- Center hero text ----
  const heroD = textPath(font, 'goz.ai', cx, cy - Math.floor(centerFont * 0.25), centerFont, 0, 'middle');
  const subD = textPath(font, 'FREE PREVIEW · SIGN UP TO REMOVE', cx, cy + Math.floor(centerFont * 0.55), subFont, 4, 'middle');

  // ---- Corner labels ----
  const cornerTL = textPath(font, 'goz.ai', cornerFont * 1.2, cornerFont * 2, cornerFont, 3, 'start');
  const cornerBR = textPath(font, 'FREE PREVIEW', W - cornerFont * 1.2, H - cornerFont * 1.2, cornerFont, 3, 'end');

  const tileStroke = Math.max(1, tileFont / 18);
  const heroStroke = Math.max(3, centerFont / 14);
  const subStroke = Math.max(1.5, subFont / 10);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    <g transform="rotate(-30 ${cx} ${cy})">
      <path d="${tilePathD}" fill="rgba(255,255,255,0.55)" stroke="rgba(0,0,0,0.75)" stroke-width="${tileStroke}" paint-order="stroke"/>
    </g>
    <g transform="rotate(-18 ${cx} ${cy})">
      <path d="${heroD}" fill="rgba(212,255,0,0.98)" stroke="rgba(0,0,0,0.95)" stroke-width="${heroStroke}" paint-order="stroke"/>
      <path d="${subD}" fill="rgba(244,237,228,1)" stroke="rgba(0,0,0,0.95)" stroke-width="${subStroke}" paint-order="stroke"/>
    </g>
    <path d="${cornerTL}" fill="rgba(255,255,255,0.98)" stroke="rgba(0,0,0,0.95)" stroke-width="2" paint-order="stroke"/>
    <path d="${cornerBR}" fill="rgba(212,255,0,0.98)" stroke="rgba(0,0,0,0.95)" stroke-width="2" paint-order="stroke"/>
  </svg>`;

  return sharp(buf)
    .composite([{ input: Buffer.from(svg), top: 0, left: 0 }])
    .jpeg({ quality: 88 })
    .toBuffer();
}
