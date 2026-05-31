'use server';

import { revalidatePath } from 'next/cache';
import { createClient, createServiceClient } from '@/lib/supabase/server';

export type SettingsState = { ok?: boolean; error?: string };

export async function updateLanguageAction(
  _prev: SettingsState,
  formData: FormData,
): Promise<SettingsState> {
  const lang = String(formData.get('language') ?? '');
  if (!['pt', 'en', 'es'].includes(lang)) return { error: 'invalid language' };

  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;
  if (!user) return { error: 'unauthorized' };

  const service = createServiceClient();
  const { error } = await service
    .from('profiles')
    .update({ language_code: lang })
    .eq('user_id', user.id);
  if (error) return { error: error.message };

  revalidatePath('/', 'layout');
  return { ok: true };
}
