import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { createClient, createServiceClient } from '@/lib/supabase/server';
import { getRun } from '@/lib/comfydeploy';

export const runtime = 'nodejs';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ runId: string }> }
) {
  const { runId } = await params;

  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;
  if (!user) return NextResponse.json({ error: 'auth' }, { status: 401 });

  const service = createServiceClient();
  const { data: gen } = await service
    .from('generations')
    .select('id, output_url, status')
    .eq('user_id', user.id)
    .eq('kind', 'video')
    .contains('input_urls', [`run:${runId}`])
    .maybeSingle();

  if (!gen) return NextResponse.json({ error: 'not found' }, { status: 404 });

  if (gen.output_url) {
    return NextResponse.json({
      status: 'success',
      progress: 1,
      outputUrl: gen.output_url,
    });
  }

  if (gen.status === 'refunded' || gen.status === 'failed') {
    return NextResponse.json({
      status: 'failed',
      error: 'Run failed',
      refunded: gen.status === 'refunded',
    });
  }

  let run;
  try {
    run = await getRun(runId);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'comfydeploy error' },
      { status: 502 }
    );
  }

  if (run.status === 'success') {
    const url = run.outputs?.[0]?.data?.files?.[0]?.url;
    if (url) {
      await service
        .from('generations')
        .update({ output_url: url, status: 'succeeded' })
        .eq('id', gen.id);
      revalidatePath('/dashboard');
      return NextResponse.json({ status: 'success', progress: 1, outputUrl: url });
    }
    return NextResponse.json({ status: 'success', progress: 1, outputUrl: null });
  }

  if (run.status === 'failed' || run.status === 'cancelled' || run.status === 'timeout') {
    const reason = `Run ${run.status}`;
    const { data: refunded } = await service.rpc('refund_generation', {
      p_gen_id: gen.id,
      p_reason: reason,
    });
    revalidatePath('/dashboard');
    return NextResponse.json({
      status: 'failed',
      error: reason,
      refunded: Boolean(refunded),
    });
  }

  return NextResponse.json({
    status: run.status,
    progress: run.progress ?? 0,
    liveStatus: run.live_status ?? null,
  });
}
