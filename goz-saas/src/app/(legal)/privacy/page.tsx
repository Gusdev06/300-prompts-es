import type { Metadata } from 'next';
import { getLang } from '@/lib/lang';
import LegalDoc from '@/components/LegalDoc';
import { PRIVACY } from '@/lib/legal-content';

export const metadata: Metadata = {
  title: 'Privacy Policy — goz.ai',
  robots: { index: true, follow: true },
};

export default async function PrivacyPage() {
  const lang = await getLang();
  return <LegalDoc doc={PRIVACY} lang={lang} />;
}
