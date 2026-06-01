import 'server-only';
import { createServiceClient } from '@/lib/supabase/server';
import { getRun } from '@/lib/comfydeploy';

const STALE_AFTER_MS = 8 * 60 * 1000;
const MAX_PER_CALL = 3;

// Lazily reconciles a user's stale video generations on demand
// (e.g. when they load the dashboard). Complements the daily cron.
// Caps work and runs in parallel so we never block the render meaningfully.
export async function reconcileUserPendingVideos(userId: string): Promise<void> {
  const service = createServiceClient();
  const cutoff = new Date(Date.now() - STALE_AFTER_MS).toISOString();

  const { data: rows } = await service
    .from('generations')
    .select('id, input_urls')
    .eq('user_id', userId)
    .eq('kind', 'video')
    .eq('status', 'pending')
    .lt('created_at', cutoff)
    .order('created_at', { ascending: true })
    .limit(MAX_PER_CALL);

  if (!rows || rows.length === 0) return;

  await Promise.allSettled(
    rows.map(async (row) => {
      const marker = (row.input_urls ?? []).find((u: string) => u.startsWith('run:'));
      if (!marker) {
        await service.rpc('refund_generation', {
          p_gen_id: row.id,
          p_reason: 'missing run id',
        });
        return;
      }
      const runId = marker.slice(4);
      try {
        const run = await getRun(runId);
        if (run.status === 'success') {
          const url = run.outputs?.[0]?.data?.files?.[0]?.url;
          if (url) {
            await service
              .from('generations')
              .update({ output_url: url, status: 'succeeded' })
              .eq('id', row.id);
          } else {
            await service.rpc('refund_generation', {
              p_gen_id: row.id,
              p_reason: 'success without output',
            });
          }
        } else if (
          run.status === 'failed' ||
          run.status === 'cancelled' ||
          run.status === 'timeout'
        ) {
          await service.rpc('refund_generation', {
            p_gen_id: row.id,
            p_reason: `Run ${run.status}`,
          });
        }
      } catch {
        /* swallow — daily cron will catch it */
      }
    })
  );
}
