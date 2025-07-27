-- 복합 인덱스 추가 SQL
-- WHERE 절 최적화를 위한 복합 인덱스

-- 기존 인덱스가 있다면 삭제 (선택사항)
-- DROP INDEX IF EXISTS doll.idx_active_stores_with_location;

-- 새로운 복합 인덱스 생성
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_active_stores_with_location 
ON doll.game_businesses (영업상태명, 좌표정보x, 좌표정보y, 사업장명, 소재지전체주소)
WHERE 영업상태명 = '영업/정상' 
  AND 좌표정보x IS NOT NULL 
  AND 좌표정보y IS NOT NULL 
  AND 사업장명 IS NOT NULL 
  AND 소재지전체주소 IS NOT NULL;

-- 부분 인덱스 (영업/정상 데이터만 포함)
-- 이 인덱스는 WHERE 절의 조건과 정확히 일치하므로 가장 효율적입니다
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_active_business_partial
ON doll.game_businesses (좌표정보x, 좌표정보y)
WHERE 영업상태명 = '영업/정상' 
  AND 좌표정보x IS NOT NULL 
  AND 좌표정보y IS NOT NULL 
  AND 사업장명 IS NOT NULL 
  AND 소재지전체주소 IS NOT NULL;

-- 통계 업데이트
ANALYZE doll.game_businesses;