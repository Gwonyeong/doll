import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/toss-auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { error: 'unauthorized', message: '인증되지 않은 사용자입니다' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      user: session.user,
    });

  } catch (error) {
    console.error('사용자 정보 조회 실패:', error);

    return NextResponse.json(
      { error: 'user_info_failed', message: '사용자 정보 조회에 실패했습니다' },
      { status: 500 }
    );
  }
}