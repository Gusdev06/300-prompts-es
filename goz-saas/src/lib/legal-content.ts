import type { Lang } from './i18n';

export const LEGAL_COMPANY = {
  name: 'goz.ai',
  legalEntity: '[INSERIR RAZÃO SOCIAL]',
  cnpj: '[INSERIR CNPJ]',
  address: '[INSERIR ENDEREÇO]',
  email: 'contato@goz.ai',
  jurisdiction: 'São Paulo / SP — Brasil',
};

export const LEGAL_UPDATED_AT = '2026-05-31';

type LegalSection = { heading: string; body: string };
type LegalDoc = { title: string; intro: string; sections: LegalSection[] };

const C = LEGAL_COMPANY;
const U = LEGAL_UPDATED_AT;

export const TERMS: Record<Lang, LegalDoc> = {
  pt: {
    title: 'Termos de Uso',
    intro: `Última atualização: ${U}. Bem-vindo ao ${C.name}. Estes Termos regulam o uso da plataforma operada por ${C.legalEntity} (CNPJ ${C.cnpj}), com sede em ${C.address}. Ao criar uma conta ou usar qualquer parte do serviço, você concorda com todas as cláusulas abaixo.`,
    sections: [
      {
        heading: '1. Elegibilidade — somente maiores de 18 anos',
        body: `O ${C.name} é uma plataforma de conteúdo adulto gerado por inteligência artificial e é destinada EXCLUSIVAMENTE a pessoas com 18 anos ou mais. Ao se cadastrar, você declara, sob as penas da lei, ter 18 anos completos. Constatada qualquer violação, sua conta será encerrada imediatamente e os créditos remanescentes não serão reembolsados.`,
      },
      {
        heading: '2. O serviço',
        body: `O ${C.name} oferece geração de imagens e vídeos com IA a partir de prompts de texto ou referências enviadas pelo usuário. O serviço é prestado "como está", sem garantia de disponibilidade ininterrupta, e está sujeito a janelas de manutenção e indisponibilidade dos fornecedores de modelos (Replicate, ComfyDeploy e congêneres).`,
      },
      {
        heading: '3. Créditos, pagamentos e reembolso',
        body: `Os pacotes de créditos são vendidos por meio do gateway PerfectPay e processados em BRL ou USD conforme a sua origem. Os créditos não expiram, não são transferíveis e não são reembolsáveis após o consumo. Se uma geração falhar por erro técnico nosso, os créditos são automaticamente devolvidos ao seu saldo. Direito de arrependimento de 7 dias (art. 49 do CDC) aplica-se apenas a pacotes ainda totalmente não utilizados.`,
      },
      {
        heading: '4. Conteúdo gerado e propriedade intelectual',
        body: `Você é o único responsável pelos prompts enviados e pelo conteúdo gerado a partir deles. Concedemos licença comercial completa sobre o conteúdo gerado pela sua conta, permitindo uso em OnlyFans, Fanvue, Fansly, UGC para marcas e redes sociais próprias. O ${C.name} não reivindica autoria sobre o material gerado.`,
      },
      {
        heading: '5. Não armazenamos suas gerações',
        body: `IMPORTANTE: o ${C.name} NÃO armazena permanentemente os arquivos resultantes das suas gerações. Os links de saída são fornecidos pelos provedores de IA e expiram em até 48 horas após a criação. Cabe a você baixar e armazenar localmente todo conteúdo que desejar preservar. Não nos responsabilizamos por perda de arquivos por falha de download ou expiração dos links.`,
      },
      {
        heading: '6. Conduta proibida',
        body: `É terminantemente proibido: (a) gerar conteúdo com a face ou semelhança de pessoa real identificável sem consentimento documentado dela; (b) gerar qualquer conteúdo sexual envolvendo menores, animais ou cenas de violência não consensual; (c) usar a plataforma para difamação, perseguição, extorsão ou qualquer crime; (d) revender acesso à plataforma; (e) tentar contornar limites técnicos, filtros ou cobranças. Violações resultam em banimento imediato e podem ser comunicadas às autoridades.`,
      },
      {
        heading: '7. Suspensão e encerramento',
        body: `Podemos suspender ou encerrar sua conta a qualquer momento, com ou sem aviso prévio, se identificarmos violação destes Termos, ordem judicial ou exigência regulatória. Você pode encerrar sua conta a qualquer momento pelo painel.`,
      },
      {
        heading: '8. Limitação de responsabilidade',
        body: `Na máxima extensão permitida em lei, o ${C.name} não responde por danos indiretos, lucros cessantes, perda de dados ou de reputação decorrentes do uso ou impossibilidade de uso do serviço. Em qualquer hipótese, a responsabilidade total agregada do ${C.name} fica limitada ao valor efetivamente pago por você nos 12 meses anteriores ao evento.`,
      },
      {
        heading: '9. Alterações destes Termos',
        body: `Podemos atualizar estes Termos a qualquer momento. A versão vigente sempre estará nesta página com a data de atualização no topo. Mudanças materiais serão comunicadas por email com pelo menos 15 dias de antecedência.`,
      },
      {
        heading: '10. Lei aplicável e foro',
        body: `Estes Termos são regidos pela legislação brasileira. Fica eleito o foro da comarca de ${C.jurisdiction} para dirimir quaisquer controvérsias, com renúncia a qualquer outro, por mais privilegiado que seja.`,
      },
      {
        heading: '11. Contato',
        body: `Dúvidas sobre estes Termos: ${C.email}.`,
      },
    ],
  },
  en: {
    title: 'Terms of Use',
    intro: `Last updated: ${U}. Welcome to ${C.name}. These Terms govern your use of the platform operated by ${C.legalEntity}. By creating an account or using any part of the service you agree to all clauses below.`,
    sections: [
      {
        heading: '1. Eligibility — 18+ only',
        body: `${C.name} is an AI-generated adult content platform reserved EXCLUSIVELY for users aged 18 or older. By signing up you represent, under penalty of perjury, that you are 18+. Any violation results in immediate account termination and forfeiture of remaining credits.`,
      },
      {
        heading: '2. The service',
        body: `${C.name} provides AI image and video generation from text prompts or user-supplied references. The service is provided "as is" without guarantee of uninterrupted availability, and is subject to maintenance windows and downtime of upstream model providers (Replicate, ComfyDeploy and similar).`,
      },
      {
        heading: '3. Credits, payments and refunds',
        body: `Credit packs are sold through the PerfectPay gateway in BRL or USD depending on your location. Credits never expire, are non-transferable and non-refundable once consumed. If a generation fails due to a technical error on our side, credits are automatically refunded to your balance. Consumer-law cooling-off rights apply only to packs that remain fully unused.`,
      },
      {
        heading: '4. Generated content and IP',
        body: `You are solely responsible for the prompts you submit and the content generated from them. We grant you a full commercial license over content generated by your account, including use on OnlyFans, Fanvue, Fansly, paid UGC for brands and your own social media. ${C.name} claims no authorship over the generated material.`,
      },
      {
        heading: '5. We do NOT store your generations',
        body: `IMPORTANT: ${C.name} does NOT permanently store your generated files. Output URLs are provided by the AI providers and expire within 48 hours of creation. You are responsible for downloading and storing locally anything you wish to preserve. We are not liable for any loss caused by failed downloads or expired links.`,
      },
      {
        heading: '6. Prohibited conduct',
        body: `You may not: (a) generate content depicting the face or likeness of a real, identifiable person without their documented consent; (b) generate any sexual content involving minors, animals or non-consensual violence; (c) use the platform for defamation, stalking, extortion or any criminal activity; (d) resell platform access; (e) try to bypass technical limits, filters or billing. Violations result in immediate ban and may be reported to authorities.`,
      },
      {
        heading: '7. Suspension and termination',
        body: `We may suspend or terminate your account at any time, with or without notice, upon violation of these Terms, judicial order or regulatory requirement. You may close your account at any time from the dashboard.`,
      },
      {
        heading: '8. Limitation of liability',
        body: `To the maximum extent permitted by law, ${C.name} is not liable for indirect damages, lost profits, lost data or reputational harm arising from use or inability to use the service. In any case, ${C.name}'s aggregate liability is capped at the amount you actually paid in the 12 months prior to the event.`,
      },
      {
        heading: '9. Changes to these Terms',
        body: `We may update these Terms at any time. The current version is always on this page with the update date at the top. Material changes are notified by email at least 15 days in advance.`,
      },
      {
        heading: '10. Governing law',
        body: `These Terms are governed by the laws of Brazil. Exclusive jurisdiction lies with the courts of ${C.jurisdiction}, with waiver of any other forum.`,
      },
      {
        heading: '11. Contact',
        body: `Questions about these Terms: ${C.email}.`,
      },
    ],
  },
  es: {
    title: 'Términos de Uso',
    intro: `Última actualización: ${U}. Bienvenido a ${C.name}. Estos Términos rigen el uso de la plataforma operada por ${C.legalEntity}. Al crear una cuenta o usar cualquier parte del servicio aceptas todas las cláusulas a continuación.`,
    sections: [
      {
        heading: '1. Elegibilidad — solo mayores de 18 años',
        body: `${C.name} es una plataforma de contenido adulto generado por IA, reservada EXCLUSIVAMENTE para personas de 18 años o más. Al registrarte declaras, bajo pena de perjurio, que tienes 18+ años. Cualquier violación implica el cierre inmediato de la cuenta y la pérdida de los créditos restantes.`,
      },
      {
        heading: '2. El servicio',
        body: `${C.name} ofrece generación de imágenes y videos con IA a partir de prompts de texto o referencias enviadas por el usuario. El servicio se presta "tal cual", sin garantía de disponibilidad ininterrumpida, y está sujeto a ventanas de mantenimiento e indisponibilidad de los proveedores de modelos (Replicate, ComfyDeploy y similares).`,
      },
      {
        heading: '3. Créditos, pagos y reembolsos',
        body: `Los paquetes de créditos se venden a través del gateway PerfectPay en BRL o USD según tu ubicación. Los créditos no caducan, no son transferibles y no son reembolsables una vez consumidos. Si una generación falla por un error técnico nuestro, los créditos se devuelven automáticamente a tu saldo. El derecho de desistimiento del consumidor se aplica solo a paquetes que permanezcan totalmente sin usar.`,
      },
      {
        heading: '4. Contenido generado y propiedad intelectual',
        body: `Eres el único responsable por los prompts que envías y el contenido generado a partir de ellos. Te concedemos licencia comercial completa sobre el contenido generado por tu cuenta, permitiendo uso en OnlyFans, Fanvue, Fansly, UGC para marcas y redes sociales propias. ${C.name} no reclama autoría sobre el material generado.`,
      },
      {
        heading: '5. NO almacenamos tus generaciones',
        body: `IMPORTANTE: ${C.name} NO almacena de forma permanente los archivos resultantes de tus generaciones. Los enlaces de salida los proporcionan los proveedores de IA y expiran en hasta 48 horas tras la creación. Es tu responsabilidad descargar y guardar localmente todo lo que quieras conservar. No nos hacemos responsables por pérdidas debidas a descargas fallidas o enlaces expirados.`,
      },
      {
        heading: '6. Conducta prohibida',
        body: `Está terminantemente prohibido: (a) generar contenido con el rostro o semejanza de una persona real identificable sin su consentimiento documentado; (b) generar cualquier contenido sexual que involucre menores, animales o violencia no consentida; (c) usar la plataforma para difamación, acoso, extorsión o cualquier delito; (d) revender acceso a la plataforma; (e) intentar eludir límites técnicos, filtros o cobros. Las violaciones resultan en baneo inmediato y pueden ser reportadas a las autoridades.`,
      },
      {
        heading: '7. Suspensión y cierre',
        body: `Podemos suspender o cerrar tu cuenta en cualquier momento, con o sin previo aviso, ante violación de estos Términos, orden judicial o exigencia regulatoria. Puedes cerrar tu cuenta en cualquier momento desde el panel.`,
      },
      {
        heading: '8. Limitación de responsabilidad',
        body: `En la máxima medida permitida por la ley, ${C.name} no responde por daños indirectos, lucro cesante, pérdida de datos o de reputación derivados del uso o imposibilidad de uso del servicio. En cualquier caso, la responsabilidad total agregada de ${C.name} queda limitada al valor efectivamente pagado por ti en los 12 meses anteriores al evento.`,
      },
      {
        heading: '9. Cambios a estos Términos',
        body: `Podemos actualizar estos Términos en cualquier momento. La versión vigente siempre estará en esta página con la fecha de actualización en la parte superior. Los cambios materiales se notifican por correo electrónico con al menos 15 días de antelación.`,
      },
      {
        heading: '10. Ley aplicable y jurisdicción',
        body: `Estos Términos se rigen por la legislación brasileña. Las partes se someten a la jurisdicción exclusiva de los tribunales de ${C.jurisdiction}.`,
      },
      {
        heading: '11. Contacto',
        body: `Consultas sobre estos Términos: ${C.email}.`,
      },
    ],
  },
};

export const PRIVACY: Record<Lang, LegalDoc> = {
  pt: {
    title: 'Política de Privacidade',
    intro: `Última atualização: ${U}. Esta Política descreve como o ${C.name}, operado por ${C.legalEntity}, coleta, usa, compartilha e protege seus dados pessoais, em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018 — LGPD) e, quando aplicável, com o GDPR.`,
    sections: [
      {
        heading: '1. Dados que coletamos',
        body: `(a) Cadastrais: email, senha (hash), idioma e país inferido pelo IP. (b) Transacionais: pacotes de crédito adquiridos, valor pago, ID do pedido no PerfectPay. (c) Uso: prompts enviados, tipo de geração, custos em créditos, timestamps. (d) Técnicos: endereço IP, user-agent, cookies de sessão. Nunca coletamos dados sensíveis sobre raça, religião, opinião política, saúde ou orientação sexual.`,
      },
      {
        heading: '2. Como usamos seus dados',
        body: `Usamos seus dados para: criar e manter sua conta, processar pagamentos, executar gerações de IA, debitar/creditar saldo, prevenir fraude e abuso, atender obrigações legais e fiscais, e comunicar atualizações importantes da plataforma.`,
      },
      {
        heading: '3. Bases legais (LGPD/GDPR)',
        body: `Tratamos seus dados com base em: execução de contrato (operação da plataforma), cumprimento de obrigação legal (notas fiscais, prevenção a fraude), legítimo interesse (segurança, melhorias) e consentimento (cookies não-essenciais, comunicações de marketing — quando aplicável).`,
      },
      {
        heading: '4. Compartilhamento com terceiros',
        body: `Compartilhamos dados estritamente necessários com: Supabase (banco de dados e autenticação), Replicate e ComfyDeploy (provedores de modelos de IA — recebem o prompt e arquivos enviados, mas não dados de identidade), PerfectPay (gateway de pagamento — recebe nome, email e dados de cobrança), Vercel (hospedagem). Não vendemos seus dados a terceiros.`,
      },
      {
        heading: '5. Retenção e armazenamento de gerações',
        body: `Mantemos sua conta e histórico de transações enquanto a conta estiver ativa e por até 5 anos após o encerramento, para fins fiscais. IMPORTANTE: NÃO armazenamos os arquivos resultantes das suas gerações. Os links de saída são gerados pelos provedores de IA e expiram em até 48 horas. Não temos cópia desses arquivos em nenhum momento.`,
      },
      {
        heading: '6. Seus direitos',
        body: `Sob a LGPD/GDPR você tem direito a: confirmar a existência de tratamento, acessar seus dados, corrigir dados incompletos ou desatualizados, anonimizar, portabilidade, eliminar dados tratados com base em consentimento, revogar consentimento e ser informado sobre compartilhamentos. Para exercer: envie email a ${C.email}.`,
      },
      {
        heading: '7. Cookies',
        body: `Usamos cookies estritamente necessários para autenticação e preferências (idioma, país, sessão). Não usamos cookies de publicidade comportamental nem rastreadores de terceiros sem consentimento explícito.`,
      },
      {
        heading: '8. Segurança',
        body: `Aplicamos criptografia em trânsito (TLS) e em repouso, controle de acesso por função e princípio do menor privilégio. Em caso de incidente de segurança que possa causar risco relevante a você, comunicaremos em até 72 horas, conforme exige a LGPD.`,
      },
      {
        heading: '9. Crianças',
        body: `O serviço é proibido a menores de 18 anos. Não coletamos intencionalmente dados de menores. Se identificarmos cadastro de menor, encerraremos a conta e excluiremos os dados.`,
      },
      {
        heading: '10. Transferência internacional',
        body: `Alguns parceiros (Supabase, Replicate, ComfyDeploy, Vercel) podem processar dados fora do Brasil. Garantimos contratos adequados de proteção de dados com cada um deles.`,
      },
      {
        heading: '11. Encarregado (DPO) e contato',
        body: `Encarregado de Proteção de Dados: ${C.email}. Responderemos em até 15 dias.`,
      },
    ],
  },
  en: {
    title: 'Privacy Policy',
    intro: `Last updated: ${U}. This Policy describes how ${C.name}, operated by ${C.legalEntity}, collects, uses, shares and protects your personal data, in compliance with Brazil's LGPD and, where applicable, the EU GDPR.`,
    sections: [
      {
        heading: '1. Data we collect',
        body: `(a) Account: email, password (hashed), language and IP-inferred country. (b) Transactional: credit packs purchased, amount paid, PerfectPay order ID. (c) Usage: prompts submitted, generation type, credits spent, timestamps. (d) Technical: IP address, user-agent, session cookies. We never collect sensitive data on race, religion, political opinion, health or sexual orientation.`,
      },
      {
        heading: '2. How we use your data',
        body: `We use your data to: create and maintain your account, process payments, run AI generations, debit/credit balance, prevent fraud and abuse, meet legal and tax obligations, and communicate critical platform updates.`,
      },
      {
        heading: '3. Legal bases (LGPD/GDPR)',
        body: `We process data based on: contract performance (running the platform), legal obligation (tax, fraud prevention), legitimate interest (security, improvements) and consent (non-essential cookies, marketing — where applicable).`,
      },
      {
        heading: '4. Sharing with third parties',
        body: `We share strictly necessary data with: Supabase (database and auth), Replicate and ComfyDeploy (AI model providers — receive prompt and uploaded files, no identity data), PerfectPay (payment gateway — receives name, email and billing data), Vercel (hosting). We do NOT sell your data.`,
      },
      {
        heading: '5. Retention and storage of generations',
        body: `We retain your account and transaction history while your account is active and up to 5 years after closure for tax purposes. IMPORTANT: we do NOT store the files resulting from your generations. Output URLs are produced by the AI providers and expire within 48 hours. We never hold a copy of these files.`,
      },
      {
        heading: '6. Your rights',
        body: `Under LGPD/GDPR you have the right to: confirm processing, access your data, correct incomplete or outdated data, anonymize, portability, delete data processed on consent basis, withdraw consent and be informed about sharing. To exercise: email ${C.email}.`,
      },
      {
        heading: '7. Cookies',
        body: `We use strictly necessary cookies for authentication and preferences (language, country, session). We do not use behavioral ad cookies or third-party trackers without explicit consent.`,
      },
      {
        heading: '8. Security',
        body: `We apply TLS in transit, encryption at rest, role-based access control and least-privilege principles. On a security incident that may cause material risk to you, we will notify within 72 hours as required by LGPD.`,
      },
      {
        heading: '9. Children',
        body: `The service is prohibited to users under 18. We do not knowingly collect data from minors. If we identify a minor's account we will close it and delete the data.`,
      },
      {
        heading: '10. International transfers',
        body: `Some partners (Supabase, Replicate, ComfyDeploy, Vercel) may process data outside Brazil. We maintain appropriate data-protection agreements with each of them.`,
      },
      {
        heading: '11. DPO and contact',
        body: `Data Protection Officer: ${C.email}. We reply within 15 days.`,
      },
    ],
  },
  es: {
    title: 'Política de Privacidad',
    intro: `Última actualización: ${U}. Esta Política describe cómo ${C.name}, operado por ${C.legalEntity}, recoge, usa, comparte y protege tus datos personales, en cumplimiento de la LGPD brasileña y, cuando aplicable, del GDPR.`,
    sections: [
      {
        heading: '1. Datos que recogemos',
        body: `(a) De cuenta: email, contraseña (hash), idioma y país inferido por IP. (b) Transaccionales: paquetes de crédito comprados, importe pagado, ID de pedido en PerfectPay. (c) De uso: prompts enviados, tipo de generación, créditos gastados, timestamps. (d) Técnicos: dirección IP, user-agent, cookies de sesión. Nunca recogemos datos sensibles sobre raza, religión, opinión política, salud u orientación sexual.`,
      },
      {
        heading: '2. Cómo usamos tus datos',
        body: `Usamos tus datos para: crear y mantener tu cuenta, procesar pagos, ejecutar generaciones de IA, debitar/acreditar saldo, prevenir fraude y abuso, atender obligaciones legales y fiscales, y comunicar actualizaciones importantes de la plataforma.`,
      },
      {
        heading: '3. Bases legales (LGPD/GDPR)',
        body: `Tratamos tus datos sobre la base de: ejecución del contrato (operación de la plataforma), cumplimiento de obligación legal (facturas, prevención de fraude), interés legítimo (seguridad, mejoras) y consentimiento (cookies no esenciales, marketing — cuando aplicable).`,
      },
      {
        heading: '4. Compartición con terceros',
        body: `Compartimos datos estrictamente necesarios con: Supabase (base de datos y autenticación), Replicate y ComfyDeploy (proveedores de modelos de IA — reciben el prompt y archivos enviados, sin datos de identidad), PerfectPay (pasarela de pago — recibe nombre, email y datos de facturación), Vercel (hosting). NO vendemos tus datos.`,
      },
      {
        heading: '5. Retención y almacenamiento de generaciones',
        body: `Conservamos tu cuenta y el historial de transacciones mientras la cuenta esté activa y hasta 5 años tras el cierre, con fines fiscales. IMPORTANTE: NO almacenamos los archivos resultantes de tus generaciones. Los enlaces de salida los generan los proveedores de IA y expiran en hasta 48 horas. En ningún momento conservamos copia de esos archivos.`,
      },
      {
        heading: '6. Tus derechos',
        body: `Bajo LGPD/GDPR tienes derecho a: confirmar la existencia de tratamiento, acceder a tus datos, corregir datos incompletos o desactualizados, anonimizar, portabilidad, eliminar datos tratados sobre la base de consentimiento, retirar consentimiento y ser informado sobre comparticiones. Para ejercer: escribe a ${C.email}.`,
      },
      {
        heading: '7. Cookies',
        body: `Usamos cookies estrictamente necesarias para autenticación y preferencias (idioma, país, sesión). No usamos cookies de publicidad conductual ni rastreadores de terceros sin consentimiento explícito.`,
      },
      {
        heading: '8. Seguridad',
        body: `Aplicamos cifrado en tránsito (TLS) y en reposo, control de acceso por rol y principio de mínimo privilegio. Ante un incidente de seguridad que pueda generar riesgo relevante para ti, comunicaremos en hasta 72 horas conforme exige la LGPD.`,
      },
      {
        heading: '9. Menores',
        body: `El servicio está prohibido para menores de 18 años. No recogemos datos de menores intencionadamente. Si identificamos una cuenta de menor, la cerraremos y eliminaremos los datos.`,
      },
      {
        heading: '10. Transferencia internacional',
        body: `Algunos socios (Supabase, Replicate, ComfyDeploy, Vercel) pueden procesar datos fuera de Brasil. Garantizamos acuerdos adecuados de protección de datos con cada uno de ellos.`,
      },
      {
        heading: '11. DPO y contacto',
        body: `Encargado de Protección de Datos: ${C.email}. Respondemos en hasta 15 días.`,
      },
    ],
  },
};
