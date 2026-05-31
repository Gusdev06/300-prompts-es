import { redirect } from 'next/navigation';
import { getLang } from '@/lib/lang';

export default async function HomePage() {
  const lang = await getLang();
  const target = lang === 'pt' ? '/pt-br' : lang === 'es' ? '/es' : '/en';
  redirect(target);
}
