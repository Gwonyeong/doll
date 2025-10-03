import { NextRequest, NextResponse } from 'next/server';
import { logout } from '@/lib/toss-auth';

export async function POST(request: NextRequest) {
  try {
    // 세션 쿠키 삭제
    await logout();

    return NextResponse.json({
      success: true,
      message: '로그아웃되었습니다',
    });

  } catch (error) {
    console.error('로그아웃 처리 실패:', error);

    return NextResponse.json(
      { error: 'logout_failed', message: '로그아웃 처리에 실패했습니다' },
      { status: 500 }
    );
  }
}