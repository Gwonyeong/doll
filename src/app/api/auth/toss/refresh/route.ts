import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { refreshAccessToken, setSessionCookies, clearSessionCookies } from '@/lib/toss-auth';

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('toss_refresh_token')?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { error: 'refresh_token_not_found', message: '리프레시 토큰이 없습니다' },
        { status: 401 }
      );
    }

    // 리프레시 토큰으로 새로운 액세스 토큰 발급
    const newTokens = await refreshAccessToken(refreshToken);

    // 새로운 세션 쿠키 설정
    await setSessionCookies(newTokens);

    return NextResponse.json({
      success: true,
      message: '토큰이 갱신되었습니다',
    });

  } catch (error) {
    console.error('토큰 갱신 실패:', error);

    // 토큰 갱신 실패 시 세션 쿠키 삭제
    await clearSessionCookies();

    return NextResponse.json(
      { error: 'token_refresh_failed', message: '토큰 갱신에 실패했습니다' },
      { status: 401 }
    );
  }
}