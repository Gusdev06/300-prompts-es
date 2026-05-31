import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';
import { getRun } from '@/lib/comfydeploy';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

// Pending videos older than this with no terminal status get reconciled / refunded.
const STALE_AFTER_MS = 8 * 60 * 1000;
// Hard cap so a single invocation never runs away.
const MAX_PER_RUN = 50;

function authorized(req: NextRequest): boolean {
  const expected = process.env.CRON_SECRET;
  if (!expected) return false;
  const header = req.headers.get('authorization') ?? '';
  if (header === `Bearer ${expected}`) return true;
  // Vercel cron requests carry this header automatically.
  return req.headers.get('x-vercel-cron') === '1';
}

export async function GET(req: NextRequest) {
  if (!authorized(req)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const service = createServiceClient();
  const cutoff = new Date(Date.now() - STALE_AFTER_MS).toISOString();

  const { data: rows, error } = await service
    .from('generations')
    .select('id, input_urls, created_at')
    .eq('kind', 'video')
    .eq('status', 'pending')
    .lt('created_at', cutoff)
    .order('created_at', { ascending: true })
    .limit(MAX_PER_RUN);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const results = { checked: 0, succeeded: 0, refunded: 0, stillPending: 0, errors: 0 };

  for (const row of rows ?? []) {
    results.checked += 1;
    const runMarker = (row.input_urls ?? []).find((u: string) => u.startsWith('run:'));
    if (!runMarker) {
      const { data: refunded } = await service.rpc('refund_generation', {
        p_gen_id: row.id,
        p_reason: 'missing run id',
      });
      if (refunded) results.refunded += 1;
      continue;
    }
    const runId = runMarker.slice(4);

    try {
      const run = await getRun(runId);
      if (run.status === 'success') {
        const url = run.outputs?.[0]?.data?.files?.[0]?.url;
        if (url) {
          await service
            .from('generations')
            .update({ output_url: url, status: 'succeeded' })
            .eq('id', row.id);
          results.succeeded += 1;
        } else {
          const { data: refunded } = await service.rpc('refund_generation', {
            p_gen_id: row.id,
            p_reason: 'success without output',
          });
          if (refunded) results.refunded += 1;
        }
      } else if (
        run.status === 'failed' ||
        run.status === 'cancelled' ||
        run.status === 'timeout'
      ) {
        const { data: refunded } = await service.rpc('refund_generation', {
          p_gen_id: row.id,
          p_reason: `Run ${run.status}`,
        });
        if (refunded) results.refunded += 1;
      } else {
        results.stillPending += 1;
      }
    } catch {
      results.errors += 1;
    }
  }

  return NextResponse.json({ ok: true, ...results });
}
