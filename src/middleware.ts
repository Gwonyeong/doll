import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 허용된 오리진 목록
const allowedOrigins = [
  'https://dollpickmap.apps.tossmini.com',
  'https://dollpickmap.private-apps.tossmini.com',
  'http://localhost:3000', // 로컬 개발 환경
];

export function middleware(request: NextRequest) {
  // API 라우트에 대해서만 CORS 처리
  if (request.nextUrl.pathname.startsWith('/api')) {
    const origin = request.headers.get('origin');
    const response = NextResponse.next();

    // OPTIONS 요청 (Preflight) 처리
    if (request.method === 'OPTIONS') {
      response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
      response.headers.set('Access-Control-Max-Age', '86400');
    }

    // 허용된 오리진인 경우 CORS 헤더 설정
    if (origin && allowedOrigins.includes(origin)) {
      response.headers.set('Access-Control-Allow-Origin', origin);
      response.headers.set('Access-Control-Allow-Credentials', 'true');
    } else if (process.env.NODE_ENV === 'development') {
      // 개발 환경에서는 모든 오리진 허용
      response.headers.set('Access-Control-Allow-Origin', '*');
    }

    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};