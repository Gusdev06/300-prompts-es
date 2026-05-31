import { NextResponse } from 'next/server';
import { searchPrompts } from '@/lib/promptsApi';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = url.searchParams.get('q') ?? '';
  try {
    const data = await searchPrompts(q);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}
