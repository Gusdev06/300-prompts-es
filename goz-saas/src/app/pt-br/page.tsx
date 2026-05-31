import type { Metadata } from 'next';
import Landing from '@/components/Landing';

export const metadata: Metadata = {
  title: 'goz.ai — A plataforma para criar a nova geração de Influenciadoras +18',
  description: 'Com goz.ai você cria fotos e vídeos +18 com influenciadoras digitais em segundos — sem bloqueios e 100% permitido no mercado.',
  alternates: { canonical: '/pt-br', languages: { en: '/en', es: '/es', 'pt-BR': '/pt-br' } },
};

export default function HomePtBrPage() {
  return <Landing lang="pt" />;
}
