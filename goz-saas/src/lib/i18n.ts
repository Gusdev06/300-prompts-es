export type Lang = 'pt' | 'en' | 'es';

export function langFromHeader(accept: string | null | undefined): Lang {
  if (!accept) return 'en';
  if (/^pt/i.test(accept) || /,pt/i.test(accept)) return 'pt';
  if (/^es/i.test(accept) || /,es/i.test(accept)) return 'es';
  return 'en';
}

export function resolveLang(cookie: string | null | undefined, accept: string | null | undefined): Lang {
  if (cookie === 'pt' || cookie === 'en' || cookie === 'es') return cookie;
  return langFromHeader(accept);
}

/* Translation table.
   Keys with `es` missing fall back to `en` via `t()`. */
export const T = {
  app: { pt: 'goz.ai', en: 'goz.ai', es: 'goz.ai' },

  // ===== Landing — Hero =====
  navLogin: { pt: 'Entrar', en: 'Log in', es: 'Iniciar sesión' },
  navStart: { pt: 'Começar', en: 'Get Started', es: 'Empezar' },
  heroHeadline1: { pt: 'A plataforma que cria', en: 'The platform that creates', es: 'La plataforma que crea' },
  heroHeadline2: { pt: 'tudo para a sua', en: 'everything for your', es: 'todo para tu' },
  heroHeadlineMark: { pt: 'influencer de IA', en: 'AI influencer', es: 'influencer de IA' },
  heroSubtitle: {
    pt: 'Com goz.ai você cria fotos e vídeos +18 com influenciadoras digitais em segundos — sem bloqueios e 100% permitido no mercado.',
    en: 'With goz.ai you create +18 photos and videos with digital influencers in seconds — no blocks, 100% market-approved.',
    es: 'Con goz.ai creas fotos y videos +18 con influencers digitales en segundos — sin bloqueos y 100% permitido en el mercado.',
  },
  heroCta: { pt: 'Começar grátis', en: 'Start free', es: 'Empezar gratis' },
  heroRating: { pt: '22.000+ criadores ativos', en: '22,000+ active creators', es: '22.000+ creadores activos' },

  // ===== Demo =====
  demoEyebrow: { pt: 'Teste agora', en: 'Try it now', es: 'Pruébalo ahora' },
  demoTitle: { pt: 'Envie uma foto e veja', en: 'Upload a photo and see', es: 'Sube una foto y mira' },
  demoTitleMark: { pt: 'a mágica', en: 'the magic', es: 'la magia' },
  demoSub: {
    pt: 'Manda a foto da sua influencer e veja a mágica 😈',
    en: 'Send your influencer\'s photo and see the magic 😈',
    es: 'Manda la foto de tu influencer y mira la magia 😈',
  },
  demoDropTitle: { pt: 'Arraste sua imagem aqui ou clique', en: 'Drag your image here or click', es: 'Arrastra tu imagen aquí o haz clic' },
  demoDropHint: { pt: 'JPG, PNG ou WEBP — máx. 8MB', en: 'JPG, PNG or WEBP — max 8MB', es: 'JPG, PNG o WEBP — máx. 8MB' },
  demoWarn: {
    pt: '<strong>1 geração grátis</strong> por dispositivo. Para uso ilimitado, crie sua conta grátis.',
    en: 'Only <strong>1 free generation</strong> per device. For unlimited use, open your free account.',
    es: 'Solo se permite <strong>1 generación gratuita</strong> por dispositivo. Para uso ilimitado, abre tu cuenta gratis.',
  },
  demoChange: { pt: 'Trocar imagem', en: 'Change image', es: 'Cambiar imagen' },
  demoGo: { pt: 'Gerar agora →', en: 'Generate now →', es: 'Generar ahora →' },
  demoGenerating: { pt: 'Gerando…', en: 'Generating…', es: 'Generando…' },
  demoStarting: { pt: 'Iniciando goz.ai', en: 'Starting goz.ai', es: 'Iniciando goz.ai' },
  demoResultCaption: {
    pt: '✅ Geração grátis pronta. Para baixar SEM marca d\'água e gerar ilimitado, crie sua conta grátis.',
    en: '✅ Free generation ready. To download WITHOUT watermark and generate unlimited, create your free account.',
    es: '✅ Generación gratis lista. Para descargar SIN marca de agua y generar ilimitado, crea tu cuenta gratis.',
  },
  demoDownload: { pt: 'Baixar com marca', en: 'Download with watermark', es: 'Descargar con marca' },
  demoUpgrade: { pt: 'Remover marca e gerar mais →', en: 'Remove watermark and generate more →', es: 'Quitar marca y generar más →' },
  demoBlockedTitle: { pt: 'Você já usou sua geração grátis', en: 'You already used your free generation', es: 'Ya usaste tu generación gratuita' },
  demoBlockedBody: {
    pt: 'Detectamos que você já gerou uma imagem deste dispositivo ou IP. Crie sua conta grátis para gerações ilimitadas (10 créditos, sem cartão).',
    en: 'We detected you already generated an image from this device or IP. Create your free account for unlimited generations (10 credits, no card).',
    es: 'Detectamos que ya generaste una imagen desde este dispositivo o IP. Crea tu cuenta gratis para generaciones ilimitadas (10 créditos sin tarjeta).',
  },
  demoBlockedCta: { pt: 'Criar conta grátis', en: 'Create free account', es: 'Crear cuenta gratis' },

  // ===== Results =====
  resultsTitle: { pt: 'Resultados criados com', en: 'Results created with', es: 'Resultados creados con' },
  resultsSub: {
    pt: 'Cada influenciadora foi gerada 100% com inteligência artificial. Sem fotos reais. Sem modelos. Sem estúdio.',
    en: 'Every influencer was generated 100% by artificial intelligence. No real photos. No models. No studio.',
    es: 'Cada influencer fue generada 100% con inteligencia artificial. Sin fotos reales. Sin modelos. Sin estudio.',
  },

  // ===== Features =====
  featEyebrow: { pt: 'Tudo o que você precisa', en: 'Everything you need', es: 'Todo lo que necesitas' },
  featTitle: { pt: 'Uma plataforma completa para criar conteúdo', en: 'A complete platform to create content', es: 'Una plataforma completa para crear contenido' },
  featSub: {
    pt: 'Fotos, vídeos, áudio e edição. Tudo com IA, tudo em um só lugar.',
    en: 'Photos, videos, audio and editing. All AI, all in one place.',
    es: 'Fotos, videos, audio y edición. Todo con IA, todo en un solo lugar.',
  },

  // 9 features
  feat1Title: { pt: 'Criação de Influenciadoras', en: 'Influencer Creation', es: 'Creación de Influencers' },
  feat1Desc: {
    pt: 'Gere personas únicas com qualidade de estúdio profissional. Cada detalhe — pele, expressão, iluminação — projetado para parecer real.',
    en: 'Generate unique personas with professional studio quality. Every detail — skin, expression, lighting — designed to look real.',
    es: 'Genera personas únicas con calidad de estudio profesional. Cada detalle — piel, expresión, iluminación — diseñado para parecer real.',
  },
  feat2Title: { pt: 'Vídeos Ultra-Realistas', en: 'Ultra-Realistic Videos', es: 'Videos Ultra-Realistas' },
  feat2Desc: {
    pt: 'Transforme qualquer imagem em vídeo com movimentos naturais. Pronto para Reels, TikTok e Stories em segundos.',
    en: 'Transform any image into video with natural movements. Ready for Reels, TikTok and Stories in seconds.',
    es: 'Transforma cualquier imagen en video con movimientos naturales. Listo para Reels, TikTok y Stories en segundos.',
  },
  feat3Title: { pt: 'Motion Control', en: 'Motion Control', es: 'Motion Control' },
  feat3Desc: {
    pt: 'Copie o movimento de qualquer vídeo de referência e aplique à sua persona. Danças, gestos, expressões — com um clique.',
    en: 'Copy the movement from any reference video and apply it to your persona. Dances, gestures, expressions — with one click.',
    es: 'Copia el movimiento de cualquier video de referencia y aplícalo a tu persona. Bailes, gestos, expresiones — con un clic.',
  },
  feat4Title: { pt: 'Face Swap', en: 'Face Swap', es: 'Face Swap' },
  feat4Desc: {
    pt: 'Troque rostos em qualquer imagem ou vídeo. Perfeito para reviews de produto, UGC e anúncios criativos.',
    en: 'Swap faces in any image or video. Perfect for product reviews, UGC and creative ads.',
    es: 'Intercambia rostros en cualquier imagen o video. Perfecto para reseñas de producto, UGC y anuncios creativos.',
  },
  feat5Title: { pt: 'Biblioteca de Prompts', en: 'Prompt Library', es: 'Biblioteca de Prompts' },
  feat5Desc: {
    pt: 'Centenas de prompts prontos por nicho. Moda, fitness, beleza, lifestyle, lingerie — só escolher e gerar.',
    en: 'Hundreds of ready-made prompts by niche. Fashion, fitness, beauty, lifestyle, lingerie — just pick and generate.',
    es: 'Cientos de prompts listos por nicho. Moda, fitness, belleza, lifestyle, lencería — solo elige y genera.',
  },
  feat6Title: { pt: 'Áudio Realista', en: 'Realistic Audio', es: 'Audio Realista' },
  feat6Desc: {
    pt: 'Vozes naturais para narrar seu conteúdo. Masculino, feminino — perfeito para UGC, anúncios e stories.',
    en: 'Natural voices to narrate your content. Male, female — perfect for UGC, ads and stories.',
    es: 'Voces naturales para narrar tu contenido. Masculino, femenino — perfecto para UGC, anuncios y stories.',
  },
  feat7Title: { pt: 'Upscale 4K', en: 'Upscale 4K', es: 'Upscale 4K' },
  feat7Desc: {
    pt: 'Restaure imagens antigas ou de baixa qualidade para 4K Ultra HD com um clique. Nitidez profissional na hora.',
    en: 'Restore old or low-quality images to 4K Ultra HD with one click. Professional sharpness instantly.',
    es: 'Restaura imágenes antiguas o de baja calidad a 4K Ultra HD con un clic. Nitidez profesional al instante.',
  },
  feat8Title: { pt: 'Tendências Virais', en: 'Viral Trends', es: 'Tendencias Virales' },
  feat8Desc: {
    pt: 'Pódio semanal com as tendências mais virais e tutoriais para replicar cada uma com suas influenciadoras.',
    en: 'Weekly podium with the most viral trends and tutorials to replicate each one with your influencers.',
    es: 'Podio semanal con las tendencias más virales y tutoriales para que replicas cada una con tus influencers.',
  },
  feat9Title: { pt: 'Prompt Cloner', en: 'Prompt Cloner', es: 'Prompt Cloner' },
  feat9Desc: {
    pt: 'Envie qualquer imagem de referência e a IA faz engenharia reversa, gerando o prompt exato pronto para usar.',
    en: 'Upload any reference image and AI reverse-engineers it, generating the exact prompt ready to use.',
    es: 'Sube cualquier imagen de referencia y la IA hace ingeniería inversa, generando el prompt exacto listo para usar.',
  },

  // ===== Motion Control Showcase =====
  motion1: { pt: 'COPIE OS', en: 'COPY THE', es: 'COPIA LOS' },
  motion2: { pt: 'MOVIMENTOS', en: 'MOVEMENTS', es: 'MOVIMIENTOS' },
  motion3: { pt: 'DO SEU VÍDEO', en: 'FROM YOUR VIDEO', es: 'DE TU VIDEO' },
  motionDesc: {
    pt: 'Copie o movimento de qualquer vídeo e coloque seu personagem na mesma ação. Crie vídeos virais em segundos.',
    en: 'Copy the movement from any video and put your character in the same action. Create viral videos in seconds.',
    es: 'Copia el movimiento de cualquier video y coloca a tu personaje en la misma acción. Crea videos virales en segundos.',
  },

  // ===== Upscale =====
  upscale1: { pt: 'TRANSFORME SUAS', en: 'TRANSFORM YOUR', es: 'TRANSFORMA TUS' },
  upscale2: { pt: 'FOTOS EM 4K', en: 'PHOTOS TO 4K', es: 'FOTOS A 4K' },
  upscaleDesc: {
    pt: 'Restaure imagens antigas ou de baixa qualidade para 4K Ultra HD com um clique. Arraste o controle para ver o poder do Upscale.',
    en: 'Restore old or low-quality images to 4K Ultra HD with one click. Drag the slider to see the power of Upscale.',
    es: 'Restaura imágenes antiguas o de baja calidad a 4K Ultra HD con un solo clic. Mueve el control para ver el poder del Upscale.',
  },

  // ===== Expressions =====
  expr1: { pt: 'MOVIMENTOS E', en: 'MOVEMENTS AND', es: 'MOVIMIENTOS Y' },
  expr2: { pt: 'EXPRESSÕES', en: 'EXPRESSIONS', es: 'EXPRESIONES' },
  expr3: { pt: 'REALISTAS', en: 'REALISTIC', es: 'REALISTAS' },
  exprDesc: {
    pt: 'Crie vídeos com expressões e movimentos realistas em minutos, prontos para publicar e viralizar nas redes sociais.',
    en: 'Create videos with realistic expressions and movements in minutes, ready to publish and go viral on social media.',
    es: 'Crea videos con expresiones y movimientos realistas en minutos, listos para publicar y viralizar en redes sociales.',
  },

  // ===== Single CTA =====
  ctaTitle1: { pt: 'Comece a gerar', en: 'Start generating', es: 'Empieza a generar' },
  ctaTitleMark: { pt: 'sem bloqueio', en: 'without limits', es: 'sin bloqueo' },
  ctaTitle2: { pt: 'hoje', en: 'today', es: 'hoy' },
  ctaSub: {
    pt: 'Sem cartão de crédito. Sem compromisso. Cancele quando quiser.',
    en: 'No credit card. No commitment. Cancel anytime.',
    es: 'Sin tarjeta de crédito. Sin compromiso. Cancela cuando quieras.',
  },
  ctaButton: { pt: 'Criar conta grátis', en: 'Create free account', es: 'Crear cuenta gratis' },
  ctaFine: {
    pt: 'Acesso imediato • 10 créditos grátis ao se cadastrar',
    en: 'Immediate access • 10 free credits on signup',
    es: 'Acceso inmediato • 10 créditos gratis al registrarte',
  },

  // ===== FAQ =====
  faqTitle: { pt: 'Perguntas Frequentes', en: 'Frequently Asked Questions', es: 'Preguntas Frecuentes' },
  q1: { pt: 'O que é o goz.ai?', en: 'What is goz.ai?', es: '¿Qué es goz.ai?' },
  a1: {
    pt: 'Um SaaS online que gera fotos e vídeos +18 hiper-realistas com IA, sem bloqueios. Funciona pelo navegador — sem instalação, sem VPN.',
    en: 'An online SaaS that generates hyper-realistic +18 photos and videos with AI, no blocks. Works in your browser — no install, no VPN.',
    es: 'Un SaaS online que genera fotos y videos +18 hiper-realistas con IA, sin bloqueos. Funciona desde el navegador — sin instalación, sin VPN.',
  },
  q2: { pt: 'É 100% legal?', en: 'Is it 100% legal?', es: '¿Es 100% legal?' },
  a2: {
    pt: 'Sim. goz.ai cumpre todas as regulações do mercado de conteúdo adulto gerado com IA. Não clonamos rostos reais sem consentimento nem geramos conteúdo com menores. Licença comercial incluída.',
    en: 'Yes. goz.ai complies with all regulations of the AI-generated adult content market. We do not clone real faces without consent or generate content involving minors. Commercial license included.',
    es: 'Sí. goz.ai cumple todas las regulaciones del mercado de contenido adulto generado con IA. No clonamos rostros reales sin consentimiento ni generamos contenido con menores. Licencia comercial incluida.',
  },
  q3: { pt: 'Preciso saber escrever prompts?', en: 'Do I need to know how to write prompts?', es: '¿Necesito saber escribir prompts?' },
  a3: {
    pt: 'Não. Temos templates prontos — você escolhe, envia o rosto e a IA gera tudo por você.',
    en: 'No. We have ready-made templates — pick one, upload a face and AI generates everything for you.',
    es: 'No. Tenemos plantillas listas — eliges la que quieras, subes el rostro y la IA genera todo por ti.',
  },
  q4: { pt: 'Realmente não bloqueia nenhum conteúdo?', en: 'Does it really not block any content?', es: '¿Realmente no bloquea ningún contenido?' },
  a4: {
    pt: 'Correto. goz.ai foi construído do zero para criar +18 sem filtros morais.',
    en: 'Correct. goz.ai was built from scratch to create +18 without moral filters.',
    es: 'Correcto. goz.ai fue construida desde cero para crear +18 sin filtros morales.',
  },
  q5: { pt: 'Posso vender o que gerar?', en: 'Can I sell what I generate?', es: '¿Puedo vender lo que genere?' },
  a5: {
    pt: 'Sim. Licença comercial completa: OnlyFans, Fanvue, Fansly, UGC pago para marcas, suas próprias redes sociais — tudo seu.',
    en: 'Yes. Full commercial license: OnlyFans, Fanvue, Fansly, paid UGC for brands, your own social media — all yours.',
    es: 'Sí. Licencia comercial completa: OnlyFans, Fanvue, Fansly, UGC pagado para marcas, redes sociales propias — todo tuyo.',
  },
  q6: { pt: 'Como funciona o plano grátis?', en: 'How does the free plan work?', es: '¿Cómo funciona el plan gratis?' },
  a6: {
    pt: 'Você se cadastra sem cartão e recebe 10 créditos grátis. Se gostar, faz upgrade para o plano Pro. Se não, sem cobrança.',
    en: 'Sign up with no card and get 10 free credits. If you like it, upgrade to the Pro plan. If not, no charges.',
    es: 'Te registras sin tarjeta y recibes 10 créditos gratis. Si te gusta, subes al plan Pro. Si no, no hay cargos.',
  },
  q7: { pt: 'Posso cancelar quando quiser?', en: 'Can I cancel anytime?', es: '¿Puedo cancelar cuando quiera?' },
  a7: {
    pt: 'Sim, com 1 clique pelo seu painel. Sem contrato, sem taxa de cancelamento.',
    en: 'Yes, with 1 click from your panel. No contract, no cancellation fee.',
    es: 'Sí, con 1 clic desde tu panel. Sin contrato, sin tarifa de cancelación.',
  },

  // ===== Footer =====
  footCopyright: {
    pt: 'goz.ai © 2026 — Todos os direitos reservados',
    en: 'goz.ai © 2026 — All rights reserved',
    es: 'goz.ai © 2026 — Todos los derechos reservados',
  },
  footTerms: { pt: 'Termos de Uso', en: 'Terms of Use', es: 'Términos de Uso' },
  footPrivacy: { pt: 'Política de Privacidade', en: 'Privacy Policy', es: 'Política de Privacidad' },
  footLegal: {
    pt: 'Plataforma exclusiva para maiores de 18 anos. Proibido gerar imagens de pessoas reais sem consentimento.',
    en: 'Platform exclusively for 18+. Generating images of real people without consent is prohibited.',
    es: 'Plataforma exclusiva para mayores de 18 años. Prohibido generar imágenes de personas reales sin consentimiento.',
  },

  // ===== Dashboard / SaaS internals (mantém PT/EN; ES cai em EN por fallback) =====
  tagline: { pt: 'Estúdio editorial de imagens com IA. Sem freios.', en: 'Editorial-grade AI image studio. Unfiltered.' },
  login: { pt: 'Entrar', en: 'Sign in' },
  signup: { pt: 'Criar conta', en: 'Sign up' },
  signupCta: { pt: 'Começar agora', en: 'Get started' },
  logout: { pt: 'Sair', en: 'Sign out' },
  email: { pt: 'E-mail', en: 'Email' },
  password: { pt: 'Senha', en: 'Password' },
  credits: { pt: 'Créditos', en: 'Credits' },
  balance: { pt: 'Saldo atual', en: 'Current balance' },
  buy: { pt: 'Comprar créditos', en: 'Buy credits' },
  buyMore: { pt: 'Comprar mais', en: 'Buy more' },
  packages: { pt: 'Pacotes', en: 'Packages' },
  prompts: { pt: 'Prompts', en: 'Prompts', es: 'Prompts' },
  dashboard: { pt: 'Estúdio', en: 'Studio' },
  history: { pt: 'Histórico', en: 'History' },
  settings: { pt: 'Conta', en: 'Account' },
  undress: { pt: 'Undress', en: 'Undress' },
  faceswap: { pt: 'Face Swap', en: 'Face Swap' },
  enhance: { pt: 'Enhance', en: 'Enhance' },
  edit: { pt: 'Editar', en: 'Edit' },
  generate: { pt: 'Gerar', en: 'Render' },
  generating: { pt: 'Renderizando…', en: 'Rendering…' },
  uploadOne: { pt: 'Envie 1 foto', en: 'Upload 1 photo' },
  uploadTwoFace: { pt: 'Envie 2 fotos: rosto + corpo/cena', en: 'Upload 2 photos: face + target body/scene' },
  uploadOneEnhance: { pt: 'Envie a foto da garota.', en: 'Upload the photo of the girl.' },
  editHint: { pt: 'Descreva o que mudar.', en: 'Describe what to change.' },
  cost: { pt: '5 créditos', en: '5 credits' },
  costPerImage: { pt: '5 créditos / imagem', en: '5 credits / image' },
  insufficient: { pt: 'Créditos insuficientes', en: 'Insufficient credits' },
  pay: { pt: 'Pagar', en: 'Pay' },
  bonus: { pt: 'bônus', en: 'bonus' },
  welcomeBack: { pt: 'Bem-vindo de volta', en: 'Welcome back' },
  createAccount: { pt: 'Crie sua conta', en: 'Create your account' },
  alreadyAccount: { pt: 'Já tem conta?', en: 'Already have an account?' },
  noAccount: { pt: 'Não tem conta?', en: "Don't have an account?" },
  error: { pt: 'Erro', en: 'Error' },
  confirmEmail: { pt: 'Confira seu e-mail para confirmar a conta.', en: 'Check your email to confirm your account.' },
  studio: { pt: 'Estúdio', en: 'Studio' },
  newRender: { pt: 'Novo render', en: 'New render' },
  recentRenders: { pt: 'Renders recentes', en: 'Recent renders' },
  viewAll: { pt: 'Ver tudo', en: 'View all' },
  emptyHistory: { pt: 'Sem renders por enquanto.', en: 'No renders yet.' },
  download: { pt: 'Baixar', en: 'Download' },
  reuse: { pt: 'Reusar', en: 'Reuse' },
  reusing: { pt: 'Reaproveitando última imagem', en: 'Reusing last output' },
  uploadNew: { pt: 'enviar nova', en: 'upload new' },
  pricingTitle: { pt: 'Pacotes de crédito', en: 'Credit packs' },
  pricingSub: { pt: 'Compre uma vez. Use quando quiser. Sem assinatura.', en: 'Pay once. Use anytime. No subscription.' },
  featured: { pt: 'Mais popular', en: 'Most popular' },
  bestValue: { pt: 'Maior valor', en: 'Best value' },
  imagesShort: { pt: 'imgs', en: 'imgs' },
  account: { pt: 'Conta', en: 'Account' },
  language: { pt: 'Idioma', en: 'Language' },
  save: { pt: 'Salvar', en: 'Save' },
  saved: { pt: 'Salvo.', en: 'Saved.' },
  totalRenders: { pt: 'Total de renders', en: 'Total renders' },
  totalSpent: { pt: 'Total gasto', en: 'Total spent' },
  filters: { pt: 'Filtros', en: 'Filters' },
  all: { pt: 'Todos', en: 'All' },
} as const;

type Dict = { pt?: string; en?: string; es?: string };

export function t<K extends keyof typeof T>(key: K, lang: Lang): string {
  const dict = T[key] as Dict;
  return (dict[lang] ?? dict.en ?? dict.pt ?? '') as string;
}
