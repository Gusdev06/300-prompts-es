import { NextResponse, type NextRequest } from 'next/server';
import { timingSafeEqual } from 'crypto';
import { createServiceClient } from '@/lib/supabase/server';
import { findPackage } from '@/lib/packages';
import { planCodeToPkgId } from '@/lib/perfectpay-offers';

type PerfectPayPayload = {
  token?: string;
  code?: string;
  sale_amount?: number;
  sale_status_enum?: number;
  sale_status_detail?: string;
  product?: { code?: string; name?: string };
  plan?: { code?: string; name?: string };
  customer?: { email?: string; full_name?: string };
  metadata?: {
    src?: string | null;
    utm_content?: string | null;
    utm_term?: string | null;
    sck?: string | null;
  };
};

const APPROVED = 2;

function safeEqualStr(a: string, b: string): boolean {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ba.length !== bb.length) return false;
  return timingSafeEqual(ba, bb);
}

function parseSrc(src: string): { userId: string; pkgId: string } | null {
  // formato: web_<uuid>_<pkgId>
  const m = /^web_([0-9a-f-]{36})_([a-z0-9]+)$/i.exec(src);
  if (!m) return null;
  return { userId: m[1], pkgId: m[2] };
}

function extractTracking(p: PerfectPayPayload): { userId: string | null; pkgId: string | null } {
  const candidates = [p.metadata?.src, p.metadata?.utm_content, p.metadata?.utm_term, p.metadata?.sck];
  for (const c of candidates) {
    if (typeof c !== 'string') continue;
    const parsed = parseSrc(c);
    if (parsed) return parsed;
  }
  // fallback: identifica o pkg pelo plan code mesmo sem userId (gera unmatched order)
  const planCode = p.plan?.code;
  const pkgId = planCode ? planCodeToPkgId(planCode) : null;
  return { userId: null, pkgId };
}

export async function POST(req: NextRequest) {
  const raw = await req.text();
  let payload: PerfectPayPayload;
  try {
    payload = JSON.parse(raw) as PerfectPayPayload;
  } catch {
    return NextResponse.json({ error: 'invalid json' }, { status: 400 });
  }

  const expected = process.env.PERFECTPAY_WEBHOOK_TOKEN;
  if (!expected) {
    console.error('[perfectpay] PERFECTPAY_WEBHOOK_TOKEN not configured — rejecting webhook');
    return NextResponse.json({ error: 'misconfigured' }, { status: 500 });
  }
  if (typeof payload.token !== 'string' || !safeEqualStr(payload.token, expected)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const orderId = payload.code;
  if (!orderId) return NextResponse.json({ ok: false, body: 'no order id' });
  if (payload.sale_status_enum !== APPROVED) {
    return NextResponse.json({ ok: false, body: 'not approved' });
  }

  const service = createServiceClient();
  const { userId, pkgId } = extractTracking(payload);
  const pkg = pkgId ? findPackage(pkgId) : null;
  const credits = pkg?.credits ?? 0;

  const { data: existing } = await service
    .from('processed_orders')
    .select('order_id')
    .eq('order_id', orderId)
    .maybeSingle();
  if (existing) return NextResponse.json({ ok: true, body: 'duplicate' });

  const { error: insErr } = await service.from('processed_orders').insert({
    order_id: orderId,
    user_id: userId,
    pkg_id: pkgId,
    credits,
    amount: payload.sale_amount ?? pkg?.price ?? 0,
    raw_payload: payload,
  });
  if (insErr) {
    console.error('[perfectpay] insert order falhou:', insErr);
    return NextResponse.json({ error: 'db error' }, { status: 500 });
  }

  if (userId && credits > 0) {
    const { error: addErr } = await service.rpc('add_credits', {
      p_user_id: userId,
      p_amount: credits,
    });
    if (addErr) console.error('[perfectpay] add_credits falhou:', addErr);
    console.log(`[perfectpay] creditado user=${userId} pkg=${pkgId} credits=${credits} order=${orderId}`);
  } else {
    console.warn(`[perfectpay] unmatched order=${orderId} userId=${userId} pkgId=${pkgId}`);
  }

  return NextResponse.json({ ok: true });
}
