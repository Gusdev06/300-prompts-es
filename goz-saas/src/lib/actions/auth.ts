'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

export type AuthState = { error?: string; info?: string };

type Lang = 'pt' | 'en';
const isLang = (v: unknown): v is Lang => v === 'pt' || v === 'en';

const M = {
  empty: { pt: 'Preencha e-mail e senha.', en: 'Enter email and password.' },
  shortPw: { pt: 'A senha precisa ter ao menos 6 caracteres.', en: 'Password must be at least 6 characters.' },
  emptyUser: { pt: 'Escolha um nome de usuário.', en: 'Pick a username.' },
  exists: {
    pt: 'Este e-mail já está cadastrado. Faça login.',
    en: 'This email is already registered. Please sign in.',
  },
  confirm: {
    pt: 'Confira seu e-mail para confirmar a conta.',
    en: 'Check your email to confirm your account.',
  },
  invalidLogin: { pt: 'E-mail ou senha inválidos.', en: 'Invalid email or password.' },
};

function pickLang(formData: FormData): Lang {
  const raw = formData.get('lang');
  return isLang(raw) ? raw : 'pt';
}

export async function loginAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const lang = pickLang(formData);
  const email = String(formData.get('email') ?? '').trim().toLowerCase();
  const password = String(formData.get('password') ?? '');
  if (!email || !password) return { error: M.empty[lang] };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    if (/invalid login credentials/i.test(error.message)) return { error: M.invalidLogin[lang] };
    return { error: error.message };
  }

  revalidatePath('/', 'layout');
  redirect('/dashboard');
}

export async function signupAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const lang = pickLang(formData);
  const email = String(formData.get('email') ?? '').trim().toLowerCase();
  const password = String(formData.get('password') ?? '');
  const username = String(formData.get('username') ?? '').trim().slice(0, 60);
  if (!email || !password) return { error: M.empty[lang] };
  if (!username) return { error: M.emptyUser[lang] };
  if (password.length < 6) return { error: M.shortPw[lang] };

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
      data: { username, language_code: lang },
    },
  });
  if (error) {
    if (/already (registered|exists)|user.*exists/i.test(error.message)) {
      return { error: M.exists[lang] };
    }
    return { error: error.message };
  }

  // Supabase obscures duplicate emails when email-confirmation is on:
  // it returns a user with an empty `identities` array instead of an error.
  if (data.user && (data.user.identities?.length ?? 0) === 0) {
    return { error: M.exists[lang] };
  }

  if (data.session) {
    revalidatePath('/', 'layout');
    redirect('/dashboard');
  }
  return { info: M.confirm[lang] };
}

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/login');
}
