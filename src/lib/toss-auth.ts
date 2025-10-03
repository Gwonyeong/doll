import { cookies } from 'next/headers';
import { decryptTossUserInfo, isTokenExpired, type DecryptedUserInfo } from './crypto';
import { prisma } from './prisma';

export interface TossTokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export interface TossUserInfoResponse {
  user_id: string;
  encrypted_user_info: string;
}

export interface AuthSession {
  user: {
    id: string;
    tossId: string;
    nickname: string;
    email?: string;
    avatar?: string;
  };
  accessToken: string;
}

/**
 * 토스 인가 코드를 사용하여 액세스 토큰을 발급받습니다.
 */
export async function exchangeCodeForToken(code: string): Promise<TossTokenResponse> {
  const clientId = process.env.NEXT_PUBLIC_TOSS_CLIENT_ID;
  const clientSecret = process.env.TOSS_CLIENT_SECRET;
  const redirectUri = process.env.NEXT_PUBLIC_TOSS_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    throw new Error('토스 인증 환경변수가 설정되지 않았습니다');
  }

  const response = await fetch(process.env.TOSS_TOKEN_URL!, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: clientId,
      client_secret: clientSecret,
      code,
      redirect_uri: redirectUri,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('토스 토큰 발급 실패:', errorText);
    throw new Error('토큰 발급에 실패했습니다');
  }

  return response.json();
}

/**
 * 리프레시 토큰을 사용하여 새로운 액세스 토큰을 발급받습니다.
 */
export async function refreshAccessToken(refreshToken: string): Promise<TossTokenResponse> {
  const clientId = process.env.NEXT_PUBLIC_TOSS_CLIENT_ID;
  const clientSecret = process.env.TOSS_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('토스 인증 환경변수가 설정되지 않았습니다');
  }

  const response = await fetch(process.env.TOSS_REFRESH_TOKEN_URL!, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('토스 토큰 갱신 실패:', errorText);
    throw new Error('토큰 갱신에 실패했습니다');
  }

  return response.json();
}

/**
 * 액세스 토큰을 사용하여 사용자 정보를 조회합니다.
 */
export async function fetchTossUserInfo(accessToken: string): Promise<DecryptedUserInfo> {
  const response = await fetch(process.env.TOSS_USER_INFO_URL!, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('토스 사용자 정보 조회 실패:', errorText);
    throw new Error('사용자 정보 조회에 실패했습니다');
  }

  const data: TossUserInfoResponse = await response.json();
  const encryptionKey = process.env.TOSS_ENCRYPTION_KEY;

  if (!encryptionKey) {
    throw new Error('토스 암호화 키가 설정되지 않았습니다');
  }

  return decryptTossUserInfo(data.encrypted_user_info, encryptionKey);
}

/**
 * 토스 사용자 정보를 데이터베이스에 저장하거나 업데이트합니다.
 */
export async function upsertUser(userInfo: DecryptedUserInfo) {
  return await prisma.user.upsert({
    where: { tossId: userInfo.id },
    update: {
      nickname: userInfo.nickname,
      email: userInfo.email,
      avatar: userInfo.avatar,
      updatedAt: new Date(),
    },
    create: {
      tossId: userInfo.id,
      nickname: userInfo.nickname,
      email: userInfo.email,
      avatar: userInfo.avatar,
    },
  });
}

/**
 * 세션 쿠키를 설정합니다.
 */
export async function setSessionCookies(tokens: TossTokenResponse) {
  const cookieStore = await cookies();

  // Access Token (1시간)
  cookieStore.set('toss_access_token', tokens.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: tokens.expires_in,
    path: '/',
  });

  // Refresh Token (14일)
  cookieStore.set('toss_refresh_token', tokens.refresh_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 14 * 24 * 60 * 60, // 14일
    path: '/',
  });
}

/**
 * 세션 쿠키를 삭제합니다.
 */
export async function clearSessionCookies() {
  const cookieStore = await cookies();

  cookieStore.delete('toss_access_token');
  cookieStore.delete('toss_refresh_token');
}

/**
 * 현재 세션을 조회합니다.
 */
export async function getSession(): Promise<AuthSession | null> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('toss_access_token')?.value;
    const refreshToken = cookieStore.get('toss_refresh_token')?.value;

    if (!accessToken) {
      return null;
    }

    // 액세스 토큰이 만료된 경우 리프레시 시도
    if (isTokenExpired(accessToken)) {
      if (!refreshToken) {
        return null;
      }

      try {
        const newTokens = await refreshAccessToken(refreshToken);
        await setSessionCookies(newTokens);

        // 새로운 토큰으로 사용자 정보 조회
        const userInfo = await fetchTossUserInfo(newTokens.access_token);
        const user = await upsertUser(userInfo);

        return {
          user: {
            id: user.id,
            tossId: user.tossId!,
            nickname: user.nickname!,
            email: user.email,
            avatar: user.avatar,
          },
          accessToken: newTokens.access_token,
        };
      } catch (error) {
        console.error('토큰 갱신 실패:', error);
        await clearSessionCookies();
        return null;
      }
    }

    // 액세스 토큰으로 사용자 정보 조회
    const userInfo = await fetchTossUserInfo(accessToken);
    const user = await upsertUser(userInfo);

    return {
      user: {
        id: user.id,
        tossId: user.tossId!,
        nickname: user.nickname!,
        email: user.email,
        avatar: user.avatar,
      },
      accessToken,
    };
  } catch (error) {
    console.error('세션 조회 실패:', error);
    await clearSessionCookies();
    return null;
  }
}

// generateTossLoginUrl 함수는 appLogin을 사용하므로 제거

/**
 * 로그아웃을 처리합니다.
 */
export async function logout() {
  await clearSessionCookies();
}