import { cookies } from "next/headers";
import https from "https";
import {
  decryptTossUserInfo,
  isTokenExpired,
  type DecryptedUserInfo,
} from "./crypto";
import { prisma } from "./prisma";

export interface TossTokenResponse {
  tokenType: "bearer";
  accessToken: string;
  refreshToken: string;
  scope: string;
  expiresIn: number;
}

export interface TossUserInfoResponse {
  resultType: "SUCCESS";

  success: {
    userKey: number;
    scope: string;
    agreedTerms: string[];
    policy: string;
    certTxId: string;
    name: string;
    phone: string;
    birthday: string;
    ci: string;
    di: string | null;
    gender: string;
    nationality: string;
    email: string | null;
  };
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
export async function exchangeCodeForToken(
  code: string,
  referrer: string
): Promise<TossTokenResponse> {
  const redirectUri = process.env.NEXT_PUBLIC_TOSS_REDIRECT_URI;

  if (!redirectUri) {
    throw new Error("토스 인증 환경변수가 설정되지 않았습니다");
  }

  return new Promise((resolve, reject) => {
    const url = new URL(process.env.TOSS_TOKEN_URL!);
    const postData = JSON.stringify({
      authorizationCode: code,
      referrer: referrer,
    });

    const cert = process.env.TOSS_CERT;

    const key = process.env.TOSS_PRIVATE;

    const options = {
      hostname: url.hostname,
      port: url.port || 443,
      path: url.pathname,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(postData),
      },
      cert: cert,
      key: key,
      rejectUnauthorized: true,
    };

    const req = https.request(options, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        if (res.statusCode === 200) {
          try {
            const jsonData = JSON.parse(data);
            resolve(jsonData.success);
          } catch (error) {
            console.error("토스 토큰 파싱 실패:", error);
            reject(new Error("토큰 파싱에 실패했습니다"));
          }
        } else {
          console.error("토스 토큰 발급 실패:", data);
          reject(new Error("토큰 발급에 실패했습니다"));
        }
      });
    });

    req.on("error", (error) => {
      console.error("토스 토큰 발급 실패:", error);
      reject(new Error("토큰 발급에 실패했습니다"));
    });

    req.write(postData);
    req.end();
  });
}

/**
 * 리프레시 토큰을 사용하여 새로운 액세스 토큰을 발급받습니다.
 */
export async function refreshAccessToken(
  refreshToken: string
): Promise<TossTokenResponse> {
  const clientId = process.env.NEXT_PUBLIC_TOSS_CLIENT_ID;
  const clientSecret = process.env.TOSS_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("토스 인증 환경변수가 설정되지 않았습니다");
  }

  return new Promise((resolve, reject) => {
    const url = new URL(process.env.TOSS_REFRESH_TOKEN_URL!);
    const postData = new URLSearchParams({
      grant_type: "refresh_token",
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
    }).toString();

    const cert = process.env.TOSS_CERT;
    const key = process.env.TOSS_PRIVATE;

    const options = {
      hostname: url.hostname,
      port: url.port || 443,
      path: url.pathname,
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Content-Length": Buffer.byteLength(postData),
      },
      cert: cert,
      key: key,
      rejectUnauthorized: true,
    };

    const req = https.request(options, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        if (res.statusCode === 200) {
          try {
            const jsonData = JSON.parse(data);
            resolve(jsonData);
          } catch (error) {
            console.error("토스 토큰 갱신 파싱 실패:", error);
            reject(new Error("토큰 갱신에 실패했습니다"));
          }
        } else {
          console.error("토스 토큰 갱신 실패:", data);
          reject(new Error("토큰 갱신에 실패했습니다"));
        }
      });
    });

    req.on("error", (error) => {
      console.error("토스 토큰 갱신 실패:", error);
      reject(new Error("토큰 갱신에 실패했습니다"));
    });

    req.write(postData);
    req.end();
  });
}

/**
 * 액세스 토큰을 사용하여 사용자 정보를 조회합니다.
 */
export async function fetchTossUserInfo(
  accessToken: string
): Promise<DecryptedUserInfo> {
  return new Promise((resolve, reject) => {
    const url = new URL(process.env.TOSS_USER_INFO_URL!);

    const cert = process.env.TOSS_CERT;
    const key = process.env.TOSS_PRIVATE;

    const options = {
      hostname: url.hostname,
      port: url.port || 443,
      path: url.pathname,
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      cert: cert,
      key: key,
      rejectUnauthorized: true,
    };

    const req = https.request(options, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        if (res.statusCode === 200) {
          try {
            const jsonData: TossUserInfoResponse = JSON.parse(data);
            const encryptionKey = process.env.TOSS_ENCRYPTION_KEY;

            if (!encryptionKey) {
              reject(new Error("토스 암호화 키가 설정되지 않았습니다"));
              return;
            }

            // AAD는 환경변수나 토스에서 별도로 제공받아야 합니다
            const aad = process.env.TOSS_AAD || undefined;

            // success 객체 확인
            if (!jsonData.success) {
              reject(new Error("사용자 정보를 찾을 수 없습니다"));
              return;
            }

            // 각 필드가 개별적으로 암호화되어 있으므로 복호화 수행
            const userInfo = decryptTossUserInfo(
              jsonData.success,
              encryptionKey,
              aad
            );
            resolve(userInfo);
          } catch (error) {
            console.error("토스 사용자 정보 파싱 실패:", error);
            reject(new Error("사용자 정보 조회에 실패했습니다"));
          }
        } else {
          console.error("토스 사용자 정보 조회 실패:", data);
          reject(new Error("사용자 정보 조회에 실패했습니다"));
        }
      });
    });

    req.on("error", (error) => {
      console.error("토스 사용자 정보 조회 실패:", error);
      reject(new Error("사용자 정보 조회에 실패했습니다"));
    });

    req.end();
  });
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
      name: userInfo.name,
      phone: userInfo.phone,
      birthday: userInfo.birthday,
      gender: userInfo.gender,
      ci: userInfo.ci,
      di: userInfo.di,
      updatedAt: new Date(),
    },
    create: {
      tossId: userInfo.id,
      nickname: userInfo.nickname,
      email: userInfo.email,
      avatar: userInfo.avatar,
      name: userInfo.name,
      phone: userInfo.phone,
      birthday: userInfo.birthday,
      gender: userInfo.gender,
      ci: userInfo.ci,
      di: userInfo.di,
    },
  });
}

/**
 * 세션 쿠키를 설정합니다.
 */
export async function setSessionCookies(tokens: TossTokenResponse) {
  const cookieStore = await cookies();

  // Access Token (1시간)
  cookieStore.set("toss_access_token", tokens.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: tokens.expiresIn,
    path: "/",
  });

  // Refresh Token (14일)
  cookieStore.set("toss_refresh_token", tokens.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 14 * 24 * 60 * 60, // 14일
    path: "/",
  });
}

/**
 * 세션 쿠키를 삭제합니다.
 */
export async function clearSessionCookies() {
  const cookieStore = await cookies();

  cookieStore.delete("toss_access_token");
  cookieStore.delete("toss_refresh_token");
}

/**
 * 현재 세션을 조회합니다.
 */
export async function getSession(): Promise<AuthSession | null> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("toss_access_token")?.value;
    const refreshToken = cookieStore.get("toss_refresh_token")?.value;

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
        const userInfo = await fetchTossUserInfo(newTokens.accessToken);
        const user = await upsertUser(userInfo);

        return {
          user: {
            id: user.id,
            tossId: user.tossId!,
            nickname: user.nickname!,
            email: user.email,
            avatar: user.avatar,
          },
          accessToken: newTokens.accessToken,
        };
      } catch (error) {
        console.error("토큰 갱신 실패:", error);
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
    console.error("세션 조회 실패:", error);
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
