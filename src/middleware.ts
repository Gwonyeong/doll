import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 토스 미니앱 도메인들을 최우선으로 허용
const allowedOrigins = [
  'https://dollpickmap.apps.tossmini.com',
  'https://dollpickmap.private-apps.tossmini.com',
  'https://dollbbobgosu.vercel.app',
  'http://localhost:3000',
  'http://localhost:3001',
];

export function middleware(request: NextRequest) {
  // API 라우트에 대해서만 CORS 처리
  if (request.nextUrl.pathname.startsWith('/api')) {
    const origin = request.headers.get('origin');

    // OPTIONS 요청 (Preflight) 처리
    if (request.method === 'OPTIONS') {
      const response = new NextResponse(null, { status: 200 });

      // 토스 미니앱 도메인인 경우 허용
      if (origin && allowedOrigins.includes(origin)) {
        response.headers.set('Access-Control-Allow-Origin', origin);
        response.headers.set('Access-Control-Allow-Credentials', 'true');
      }

      response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
      response.headers.set('Access-Control-Max-Age', '86400');

      return response;
    }

    const response = NextResponse.next();

    // 허용된 오리진인 경우 CORS 헤더 설정
    if (origin && allowedOrigins.includes(origin)) {
      response.headers.set('Access-Control-Allow-Origin', origin);
      response.headers.set('Access-Control-Allow-Credentials', 'true');
      response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    }

    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};