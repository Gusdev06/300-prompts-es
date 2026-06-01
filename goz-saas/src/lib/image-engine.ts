import Replicate from 'replicate';

const client = new Replicate({ auth: process.env.REPLICATE_API_TOKEN });

const GENERATION_TIMEOUT_MS = 110_000;
const MAX_ATTEMPTS = 2;
const BACKOFF_BASE_MS = 1500;

export type ImageEngineErrorCode =
  | 'timeout'
  | 'auth_missing'
  | 'rate_limited'
  | 'content_rejected'
  | 'invalid_input'
  | 'upstream_5xx'
  | 'network'
  | 'unexpected_response'
  | 'unknown';

export class ImageEngineError extends Error {
  code: ImageEngineErrorCode;
  attempts: number;
  detail?: string;
  constructor(code: ImageEngineErrorCode, message: string, attempts: number, detail?: string) {
    super(message);
    this.name = 'ImageEngineError';
    this.code = code;
    this.attempts = attempts;
    this.detail = detail;
  }
}

const TRANSIENT = new Set<ImageEngineErrorCode>([
  'timeout',
  'upstream_5xx',
  'network',
  'unexpected_response',
  'rate_limited',
]);

function classify(err: unknown): { code: ImageEngineErrorCode; message: string } {
  const msg = err instanceof Error ? err.message : String(err);

  if (msg === 'image_engine_timeout') return { code: 'timeout', message: 'generation timed out' };
  if (msg === 'image_engine_unexpected_response') return { code: 'unexpected_response', message: msg };

  const e = err as { response?: { status?: number }; status?: number; name?: string };
  const status = e?.response?.status ?? e?.status;
  if (typeof status === 'number') {
    if (status === 401 || status === 403) return { code: 'auth_missing', message: `replicate auth ${status}` };
    if (status === 422) return { code: 'invalid_input', message: `replicate rejected input (422)` };
    if (status === 429) return { code: 'rate_limited', message: `replicate rate limit (429)` };
    if (status >= 500 && status < 600) return { code: 'upstream_5xx', message: `replicate ${status}` };
    if (status === 400) return { code: 'invalid_input', message: `replicate bad request (400)` };
  }

  if (/safety|nsfw|moderation|policy|sensitive|flagged/i.test(msg)) {
    return { code: 'content_rejected', message: msg };
  }
  if (/network|fetch|ENOTFOUND|ECONNRESET|ETIMEDOUT|EAI_AGAIN|socket/i.test(msg)) {
    return { code: 'network', message: msg };
  }

  return { code: 'unknown', message: msg };
}

export async function generateImage(
  prompt: string,
  imageInput?: string[]
): Promise<string> {
  if (!process.env.REPLICATE_API_TOKEN) {
    throw new ImageEngineError('auth_missing', 'REPLICATE_API_TOKEN not set', 0);
  }

  const hasImages = !!imageInput && imageInput.length > 0;
  const input: Record<string, unknown> = {
    prompt,
    size: '2K',
    max_images: 1,
    aspect_ratio: hasImages ? 'match_input_image' : '1:1',
    disable_safety_checker: true,
    sequential_image_generation: 'disabled',
  };
  if (hasImages) input.image_input = imageInput;

  let lastCode: ImageEngineErrorCode = 'unknown';
  let lastMessage = 'unknown';

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const output = await Promise.race([
        client.run('bytedance/seedream-4.5', { input }),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('image_engine_timeout')), GENERATION_TIMEOUT_MS)
        ),
      ]);

      const first = Array.isArray(output) ? output[0] : output;
      if (typeof first === 'string') return first;
      if (first && typeof (first as { url?: unknown }).url === 'function') {
        const u = (first as { url: () => URL | string }).url();
        return u instanceof URL ? u.href : String(u);
      }
      throw new Error('image_engine_unexpected_response');
    } catch (err) {
      const { code, message } = classify(err);
      lastCode = code;
      lastMessage = message;

      console.error('[image-engine] attempt fail', { attempt, code, message });

      const isLast = attempt === MAX_ATTEMPTS;
      if (!TRANSIENT.has(code) || isLast) {
        throw new ImageEngineError(code, message, attempt);
      }

      const backoff = BACKOFF_BASE_MS * Math.pow(2, attempt - 1) + Math.floor(Math.random() * 400);
      await new Promise((r) => setTimeout(r, backoff));
    }
  }

  throw new ImageEngineError(lastCode, lastMessage, MAX_ATTEMPTS);
}
