import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(items: { name: string; value: string; options?: Record<string, unknown> }[]) {
          for (const { name, value } of items) request.cookies.set(name, value);
          response = NextResponse.next({ request });
          for (const { name, value, options } of items) {
            response.cookies.set(name, value, options as never);
          }
        },
      },
    }
  );

  const { data } = await supabase.auth.getUser();
  const user = data.user;
  const path = request.nextUrl.pathname;
  const isAuthRoute = path.startsWith('/login') || path.startsWith('/signup') || path.startsWith('/auth');
  const isProtected = path.startsWith('/pricing') || path.startsWith('/admin');

  const country = (
    request.headers.get('x-vercel-ip-country') ??
    request.headers.get('cf-ipcountry') ??
    ''
  ).toUpperCase();
  const oneYear = 60 * 60 * 24 * 365;
  if (country && request.cookies.get('country')?.value !== country) {
    response.cookies.set('country', country, { path: '/', maxAge: oneYear, sameSite: 'lax' });
  }

  if (path === '/en' || path.startsWith('/en/')) {
    response.cookies.set('lang', 'en', { path: '/', maxAge: oneYear, sameSite: 'lax' });
  } else if (path === '/pt-br' || path.startsWith('/pt-br/')) {
    response.cookies.set('lang', 'pt', { path: '/', maxAge: oneYear, sameSite: 'lax' });
  } else if (country && !request.cookies.get('lang')) {
    response.cookies.set('lang', country === 'BR' ? 'pt' : 'en', {
      path: '/',
      maxAge: oneYear,
      sameSite: 'lax',
    });
  }

  if (!user && isProtected) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('redirect', path);
    return NextResponse.redirect(url);
  }

  if (user && isAuthRoute && !path.startsWith('/auth/callback')) {
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  return response;
}
