# goz.ai — Web SaaS

Versão web do bot de geração de imagens (antes em `NH-203/`). Mesmas funcionalidades — Undress, Face Swap, Enhance, Edit — agora com login por e-mail/senha (Supabase), saldo de créditos e checkout via Perfect Pay.

## Stack

- Next.js 15 (App Router, Server Actions, React 19)
- Supabase (Auth + Postgres + Storage)
- Replicate (`bytedance/seedream-4.5`)
- Perfect Pay (webhook + checkout externo)
- Tailwind CSS

## Setup

1. **Instalar deps**
   ```bash
   cd web
   npm install
   ```

2. **Supabase**
   - Crie um projeto em https://supabase.com.
   - SQL Editor → cole e rode `supabase/schema.sql`.
   - Storage → crie o bucket **`inputs`** (private).
   - Auth → ative provider Email; desligue "Confirm email" em dev se quiser pular o e-mail de confirmação.

3. **Variáveis** (`.env.local`):
   ```
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   SUPABASE_SERVICE_ROLE_KEY=...    # secret, server-only
   REPLICATE_API_TOKEN=...
   PERFECTPAY_WEBHOOK_TOKEN=...
   PERFECTPAY_CHECKOUT_BRL=https://go.perfectpay.com.br/PPU...
   PERFECTPAY_CHECKOUT_USD=https://go.perfectpay.com.br/PPU...
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Rodar**
   ```bash
   npm run dev
   ```

## Fluxos

- `/` → landing pública.
- `/login`, `/signup` → auth via Supabase (e-mail/senha).
- `/dashboard` → painel: saldo, geradores (4 tabs) e histórico.
- `/pricing` → pacotes BRL/USD com botão "Pagar" levando ao Perfect Pay. O `src=web_<userId>_<pkgId>` permite o webhook identificar o usuário.
- `/api/webhooks/perfectpay` → recebe confirmação, idempotente por `order_id`, credita via RPC `add_credits`.

## Esquema de créditos

- 1 imagem = **5 créditos**.
- Débito atômico via RPC `debit_credits` (não permite saldo negativo).
- Falha de geração → `add_credits` reembolsa o usuário.

## Adaptação do bot

| Bot (NH-203)                | Web                                |
|-----------------------------|------------------------------------|
| `src/db.ts` (SQLite)        | `supabase/schema.sql` + RPC        |
| `src/replicate.ts`          | `src/lib/replicate.ts`             |
| `src/packages.ts`           | `src/lib/packages.ts`              |
| `src/webhook-perfectpay.ts` | `src/app/api/webhooks/perfectpay/` |
| `src/bot.ts` (Grammy)       | `src/app/dashboard` + Server Action `generate` |

## Deploy

Compatível com Vercel. Adicione as envs em Project Settings e configure o webhook do Perfect Pay para `https://SEU_DOMINIO/api/webhooks/perfectpay`.
