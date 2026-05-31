import 'server-only';
import { cookies, headers } from 'next/headers';
import { resolveLang, type Lang } from './i18n';

export async function getLang(override?: string | null): Promise<Lang> {
  if (override === 'pt' || override === 'en' || override === 'es') return override;
  const [c, h] = await Promise.all([cookies(), headers()]);
  return resolveLang(c.get('lang')?.value, h.get('accept-language'));
}
