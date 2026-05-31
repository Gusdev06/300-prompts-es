import type { Metadata } from 'next';
import { getLang } from '@/lib/lang';
import LegalDoc from '@/components/LegalDoc';
import { TERMS } from '@/lib/legal-content';

export const metadata: Metadata = {
  title: 'Terms of Use — goz.ai',
  robots: { index: true, follow: true },
};

export default async function TermsPage() {
  const lang = await getLang();
  return <LegalDoc doc={TERMS} lang={lang} />;
}
