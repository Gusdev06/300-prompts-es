import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getLang } from '@/lib/lang';
import AppShell from '@/components/AppShell';

export default async function PricingLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('credits, language_code')
    .eq('user_id', data.user.id)
    .single();

  const lang = await getLang(profile?.language_code);
  return (
    <AppShell lang={lang} credits={profile?.credits ?? 0} email={data.user.email ?? ''}>
      {children}
    </AppShell>
  );
}
