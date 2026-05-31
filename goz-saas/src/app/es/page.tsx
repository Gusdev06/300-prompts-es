import type { Metadata } from 'next';
import Landing from '@/components/Landing';

export const metadata: Metadata = {
  title: 'goz.ai — La plataforma para crear la nueva generación de Influencers +18',
  description: 'Con goz.ai creas fotos y videos +18 con influencers digitales en segundos — sin bloqueos y 100% permitido en el mercado.',
  alternates: { canonical: '/es', languages: { en: '/en', es: '/es', 'pt-BR': '/pt-br' } },
};

export default function HomeEsPage() {
  return <Landing lang="es" />;
}
