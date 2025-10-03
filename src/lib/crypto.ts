import * as crypto from 'crypto';

export interface DecryptedUserInfo {
  id: string;
  nickname: string;
  email?: string;
  avatar?: string;
  // 토스에서 제공하는 추가 정보
  name?: string;      // 실명
  phone?: string;     // 전화번호
  birthday?: string;  // 생년월일
  gender?: string;    // 성별
  ci?: string;        // 연결정보
  di?: string;        // 중복가입확인정보
}

/**
 * 토스에서 제공하는 개별 필드 암호화 데이터를 복호화합니다.
 * @param encryptedData Base64로 인코딩된 암호화 데이터
 * @param encryptionKey 32바이트 암호화 키
 * @param aad AAD (Additional Authenticated Data)
 * @returns 복호화된 문자열
 */
export function decryptTossField(
  encryptedData: string,
  encryptionKey: string,
  aad?: string
): string {
  try {
    // Base64 디코딩
    const encryptedBuffer = Buffer.from(encryptedData, 'base64');

    // 암호화 키 준비 (32바이트)
    let keyBuffer: Buffer;
    if (encryptionKey.length === 64) {
      // 16진수 문자열인 경우
      keyBuffer = Buffer.from(encryptionKey, 'hex');
    } else if (encryptionKey.length === 44) {
      // Base64 인코딩된 경우
      keyBuffer = Buffer.from(encryptionKey, 'base64');
    } else {
      // UTF-8 문자열인 경우 (32바이트로 패딩/자르기)
      const key = encryptionKey.padEnd(32, '\0').slice(0, 32);
      keyBuffer = Buffer.from(key, 'utf8');
    }

    // GCM 모드의 표준 구조: IV(12바이트) + 암호문 + 인증태그(16바이트)
    const ivLength = 12;
    const tagLength = 16;

    // 데이터 추출
    const iv = encryptedBuffer.subarray(0, ivLength);
    const authTag = encryptedBuffer.subarray(encryptedBuffer.length - tagLength);
    const ciphertext = encryptedBuffer.subarray(ivLength, encryptedBuffer.length - tagLength);

    // AES-256-GCM 복호화
    const decipher = crypto.createDecipheriv('aes-256-gcm', keyBuffer, iv);
    decipher.setAuthTag(authTag);

    // AAD 설정 (있는 경우)
    if (aad) {
      decipher.setAAD(Buffer.from(aad, 'utf8'));
    }

    // 복호화
    let decrypted = decipher.update(ciphertext);
    decrypted = Buffer.concat([decrypted, decipher.final()]);

    // UTF8 문자열로 변환
    return decrypted.toString('utf8');
  } catch (error) {
    console.error('토스 필드 복호화 실패:', error);
    throw new Error(`필드 복호화에 실패했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
  }
}

/**
 * 토스 사용자 정보 객체의 암호화된 필드들을 복호화합니다.
 * @param tossUserData 토스 API에서 받은 사용자 데이터
 * @param encryptionKey 암호화 키
 * @param aad AAD
 * @returns 복호화된 사용자 정보
 */
export function decryptTossUserInfo(
  tossUserData: any,
  encryptionKey: string,
  aad?: string
): DecryptedUserInfo {
  try {
    // 각 암호화된 필드를 개별적으로 복호화
    const decryptedName = tossUserData.name ? decryptTossField(tossUserData.name, encryptionKey, aad) : undefined;
    const decryptedEmail = tossUserData.email ? decryptTossField(tossUserData.email, encryptionKey, aad) : undefined;
    const decryptedPhone = tossUserData.phone ? decryptTossField(tossUserData.phone, encryptionKey, aad) : undefined;
    const decryptedBirthday = tossUserData.birthday ? decryptTossField(tossUserData.birthday, encryptionKey, aad) : undefined;
    const decryptedGender = tossUserData.gender ? decryptTossField(tossUserData.gender, encryptionKey, aad) : undefined;
    const decryptedCi = tossUserData.ci ? decryptTossField(tossUserData.ci, encryptionKey, aad) : undefined;
    const decryptedDi = tossUserData.di ? decryptTossField(tossUserData.di, encryptionKey, aad) : undefined;

    return {
      id: tossUserData.userKey.toString(),
      nickname: decryptedName || `사용자${tossUserData.userKey}`, // 실명을 닉네임으로 사용, 없으면 기본값
      email: decryptedEmail,
      avatar: undefined, // 토스에서 아바타 정보를 제공하지 않음
      name: decryptedName,
      phone: decryptedPhone,
      birthday: decryptedBirthday,
      gender: decryptedGender,
      ci: decryptedCi,
      di: decryptedDi
    };
  } catch (error) {
    console.error('토스 사용자 정보 복호화 실패:', error);
    throw new Error(`사용자 정보 복호화에 실패했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
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