import { NextRequest, NextResponse } from "next/server";
import {
  exchangeCodeForToken,
  setSessionCookies,
  fetchTossUserInfo,
  upsertUser,
} from "@/lib/toss-auth";

// GET 요청 처리 (기존 OAuth 리다이렉트)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const error = searchParams.get("error");

    // 에러가 있는 경우 로그인 페이지로 리다이렉트
    if (error) {
      console.error("토스 인증 에러:", error);
      return NextResponse.redirect(
        new URL("/login?error=auth_failed", request.url)
      );
    }

    // 인가 코드가 없는 경우
    if (!code) {
      return NextResponse.redirect(
        new URL("/login?error=no_code", request.url)
      );
    }

    // 인가 코드를 액세스 토큰으로 교환
    const tokens = await exchangeCodeForToken(code);

    // 사용자 정보 조회
    const userInfo = await fetchTossUserInfo(tokens.access_token);

    // 사용자 정보를 데이터베이스에 저장/업데이트
    await upsertUser(userInfo);

    // 세션 쿠키 설정
    await setSessionCookies(tokens);

    // 메인 페이지로 리다이렉트
    return NextResponse.redirect(new URL("/", request.url));
  } catch (error) {
    console.error("토스 콜백 처리 실패:", error);
    return NextResponse.redirect(
      new URL("/login?error=callback_failed", request.url)
    );
  }
}

// POST 요청 처리 (appLogin 함수에서 호출)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, referrer } = body;

    // 인가 코드가 없는 경우
    if (!code) {
      return NextResponse.json(
        {
          error: "authorization_code_required",
          message: "인가 코드가 필요합니다",
        },
        { status: 400 }
      );
    }

    // 인가 코드를 액세스 토큰으로 교환
    const tokens = await exchangeCodeForToken(code, referrer);

    // 사용자 정보 조회
    const userInfo = await fetchTossUserInfo(tokens.accessToken);

    // 사용자 정보를 데이터베이스에 저장/업데이트
    const user = await upsertUser(userInfo);

    // 세션 쿠키 설정
    await setSessionCookies(tokens);

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        tossId: user.tossId,
        nickname: user.nickname,
        email: user.email,
        avatar: user.avatar,
      },
      referrer,
    });
  } catch (error) {
    console.error("토스 콜백 처리 실패:", error);
    return NextResponse.json(
      {
        error: "callback_failed",
        message: "로그인 처리 중 오류가 발생했습니다",
      },
      { status: 500 }
    );
  }
}
