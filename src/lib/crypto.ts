import CryptoJS from 'crypto-js';

export interface DecryptedUserInfo {
  id: string;
  nickname: string;
  email?: string;
  avatar?: string;
}

/**
 * 토스에서 제공하는 AES-256-CBC 암호화된 사용자 정보를 복호화합니다.
 * @param encryptedData 암호화된 데이터
 * @param encryptionKey 토스에서 제공한 암호화 키
 * @returns 복호화된 사용자 정보
 */
export function decryptTossUserInfo(
  encryptedData: string,
  encryptionKey: string
): DecryptedUserInfo {
  try {
    // Base64 디코딩
    const encrypted = CryptoJS.enc.Base64.parse(encryptedData);

    // 키를 UTF8로 파싱
    const key = CryptoJS.enc.Utf8.parse(encryptionKey);

    // AES-256-CBC 복호화 (IV는 데이터의 첫 16바이트)
    const iv = CryptoJS.lib.WordArray.create(encrypted.words.slice(0, 4));
    const ciphertext = CryptoJS.lib.WordArray.create(encrypted.words.slice(4));

    const decrypted = CryptoJS.AES.decrypt(
      { ciphertext },
      key,
      {
        iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      }
    );

    // UTF8 문자열로 변환
    const decryptedString = decrypted.toString(CryptoJS.enc.Utf8);

    if (!decryptedString) {
      throw new Error('복호화 결과가 빈 문자열입니다');
    }

    // JSON 파싱
    const userInfo = JSON.parse(decryptedString);

    return {
      id: userInfo.id || userInfo.userId,
      nickname: userInfo.nickname || userInfo.name,
      email: userInfo.email,
      avatar: userInfo.avatar || userInfo.profileImage
    };
  } catch (error) {
    console.error('토스 사용자 정보 복호화 실패:', error);
    throw new Error('사용자 정보 복호화에 실패했습니다');
  }
}

/**
 * JWT 토큰을 검증하고 페이로드를 반환합니다.
 * @param token JWT 토큰
 * @returns 토큰 페이로드
 */
export function parseJWTPayload(token: string): any {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('JWT 토큰 파싱 실패:', error);
    throw new Error('토큰 파싱에 실패했습니다');
  }
}

/**
 * 토큰의 만료 시간을 확인합니다.
 * @param token JWT 토큰
 * @returns 만료 여부
 */
export function isTokenExpired(token: string): boolean {
  try {
    const payload = parseJWTPayload(token);
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
  } catch {
    return true; // 파싱 실패 시 만료된 것으로 처리
  }
}

/**
 * 토큰의 남은 유효 시간을 분 단위로 반환합니다.
 * @param token JWT 토큰
 * @returns 남은 시간(분) 또는 null (만료된 경우)
 */
export function getTokenRemainingTime(token: string): number | null {
  try {
    const payload = parseJWTPayload(token);
    const currentTime = Math.floor(Date.now() / 1000);
    const remainingSeconds = payload.exp - currentTime;

    if (remainingSeconds <= 0) {
      return null;
    }

    return Math.floor(remainingSeconds / 60);
  } catch {
    return null;
  }
}