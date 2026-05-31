import type { Metadata } from 'next';
import Landing from '@/components/Landing';

export const metadata: Metadata = {
  title: 'goz.ai — The platform to create the next generation of +18 Influencers',
  description: 'With goz.ai you create +18 photos and videos with digital influencers in seconds — no blocks, 100% market-approved.',
  alternates: { canonical: '/en', languages: { en: '/en', es: '/es', 'pt-BR': '/pt-br' } },
};

export default function HomeEnPage() {
  return <Landing lang="en" />;
}
