import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 인증이 필요하지 않은 경로들
  const publicPaths = [
    '/login',
    '/api/auth/toss/callback',
    '/api/auth/toss/refresh',
    '/api/auth/toss/logout',
    '/terms',
    '/_next',
    '/favicon.ico',
    '/images',
    '/icons',
  ];

  // API 라우트는 별도 처리
  if (pathname.startsWith('/api/')) {
    // 인증 API는 통과
    if (pathname.startsWith('/api/auth/')) {
      return NextResponse.next();
    }

    // 다른 API는 액세스 토큰 확인
    const accessToken = request.cookies.get('toss_access_token')?.value;
    if (!accessToken) {
      return NextResponse.json(
        { error: 'unauthorized', message: '로그인이 필요합니다' },
        { status: 401 }
      );
    }

    return NextResponse.next();
  }

  // 공개 경로는 통과
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // 정적 파일들은 통과
  if (
    pathname.includes('.') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/static/')
  ) {
    return NextResponse.next();
  }

  // 액세스 토큰 확인
  const accessToken = request.cookies.get('toss_access_token')?.value;

  if (!accessToken) {
    // 로그인되지 않은 사용자를 로그인 페이지로 리다이렉트
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 로그인된 사용자는 통과
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};