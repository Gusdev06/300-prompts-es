-- Hot Web — Supabase schema
-- Rode no SQL Editor do Supabase ou via `supabase db push`.

create extension if not exists pgcrypto;

-- profiles: 1:1 com auth.users, guarda saldo de créditos
create table if not exists public.profiles (
  user_id        uuid primary key references auth.users(id) on delete cascade,
  email          text,
  username       text,
  credits        integer not null default 0,
  language_code  text,
  banned         boolean not null default false,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

alter table public.profiles add column if not exists username text;

create table if not exists public.generations (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  prompt        text not null,
  credits_spent integer not null,
  output_url    text,
  input_urls    text[],
  kind          text,
  created_at    timestamptz not null default now()
);

-- Lifecycle: pending → succeeded | failed | refunded. Legacy rows default to succeeded.
alter table public.generations add column if not exists status text not null default 'succeeded';
alter table public.generations add column if not exists refunded_at timestamptz;
alter table public.generations add column if not exists error text;

create index if not exists generations_user_idx on public.generations(user_id, created_at desc);
create index if not exists generations_pending_video_idx
  on public.generations(created_at)
  where status = 'pending' and kind = 'video';

create table if not exists public.processed_orders (
  order_id    text primary key,
  user_id     uuid references auth.users(id) on delete set null,
  pkg_id      text,
  credits     integer not null,
  amount      numeric not null,
  raw_payload jsonb not null,
  created_at  timestamptz not null default now()
);

-- Cria profile automaticamente quando user faz signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (user_id, email, username, language_code)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'username',
    new.raw_user_meta_data->>'language_code'
  )
  on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- RLS
alter table public.profiles enable row level security;
alter table public.generations enable row level security;
alter table public.processed_orders enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = user_id);

drop policy if exists "generations_select_own" on public.generations;
create policy "generations_select_own" on public.generations
  for select using (auth.uid() = user_id);

-- Sem policies de insert/update/delete: somente service-role (server actions/webhooks) podem mutar.

-- RPC atômico para debitar créditos
create or replace function public.debit_credits(p_user_id uuid, p_amount integer)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  affected integer;
begin
  update public.profiles
     set credits = credits - p_amount,
         updated_at = now()
   where user_id = p_user_id
     and credits >= p_amount
     and banned = false;
  get diagnostics affected = row_count;
  return affected = 1;
end;
$$;

create or replace function public.add_credits(p_user_id uuid, p_amount integer)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  new_balance integer;
begin
  update public.profiles
     set credits = credits + p_amount,
         updated_at = now()
   where user_id = p_user_id
   returning credits into new_balance;
  return coalesce(new_balance, 0);
end;
$$;

-- Idempotent refund. Returns true only on the first call for a given pending/failed generation;
-- subsequent calls (race with sweeper/poller) are no-ops.
create or replace function public.refund_generation(p_gen_id uuid, p_reason text default null)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  gen record;
begin
  select id, user_id, credits_spent, status
    into gen
    from public.generations
   where id = p_gen_id
   for update;
  if not found then return false; end if;
  if gen.status in ('succeeded', 'refunded') then return false; end if;
  if gen.credits_spent <= 0 then
    update public.generations
       set status = 'failed', error = coalesce(p_reason, error), refunded_at = now()
     where id = p_gen_id;
    return false;
  end if;

  update public.profiles
     set credits = credits + gen.credits_spent,
         updated_at = now()
   where user_id = gen.user_id;

  update public.generations
     set status = 'refunded',
         refunded_at = now(),
         error = coalesce(p_reason, error)
   where id = p_gen_id;

  return true;
end;
$$;
