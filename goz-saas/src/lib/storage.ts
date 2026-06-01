import { createServiceClient } from '@/lib/supabase/server';

function extFromContentType(ct: string | null): string {
  if (!ct) return 'jpg';
  if (ct.includes('png')) return 'png';
  if (ct.includes('webp')) return 'webp';
  if (ct.includes('mp4')) return 'mp4';
  return 'jpg';
}

export async function uploadToSupabase(
  remoteUrl: string,
  pathHint = 'image'
): Promise<string> {
  const res = await fetch(remoteUrl);
  if (!res.ok) throw new Error('storage_fetch_failed');
  const ct = res.headers.get('content-type');
  const ext = extFromContentType(ct);
  const bytes = new Uint8Array(await res.arrayBuffer());

  const bucket = process.env.SUPABASE_STORAGE_BUCKET || 'generations';
  const key = `${pathHint}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const supabase = createServiceClient();
  const { error } = await supabase.storage.from(bucket).upload(key, bytes, {
    contentType: ct ?? 'image/jpeg',
    upsert: false,
  });
  if (error) throw new Error(`storage_upload_failed_${error.message}`);

  const { data } = supabase.storage.from(bucket).getPublicUrl(key);
  if (!data?.publicUrl) throw new Error('storage_upload_no_url');
  return data.publicUrl;
}
