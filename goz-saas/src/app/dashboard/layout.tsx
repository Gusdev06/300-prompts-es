import { createClient } from '@/lib/supabase/server';
import { getLang } from '@/lib/lang';
import AppShell from '@/components/AppShell';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const user = data.user;

  let credits = 0;
  let languageCode: string | null = null;
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('credits, language_code')
      .eq('user_id', user.id)
      .single();
    credits = profile?.credits ?? 0;
    languageCode = profile?.language_code ?? null;
  }

  const lang = await getLang(languageCode);
  return (
    <AppShell lang={lang} credits={credits} email={user?.email ?? null}>
      {children}
    </AppShell>
  );
}
