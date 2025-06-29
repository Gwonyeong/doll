import { PrismaClient } from "../src/generated/prisma";
import proj4 from "proj4";

const prisma = new PrismaClient();

// EPSG:5174 (Korea 2000 / Central Belt 2010) 좌표계 정의
const epsg5174 =
  "+proj=tmerc +lat_0=38 +lon_0=127 +k=1 +x_0=200000 +y_0=500000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs";
// WGS84 좌표계 정의
const wgs84 = "+proj=longlat +datum=WGS84 +no_defs";

// 좌표 변환 함수 (EPSG5174 -> WGS84)
function convertEPSG5174ToWGS84(
  x: number,
  y: number
): { lat: number; lng: number } {
  try {
    const [lng, lat] = proj4(epsg5174, wgs84, [x, y]);
    return { lat, lng };
  } catch (error) {
    console.error("좌표 변환 오류:", error);
    return { lat: 0, lng: 0 };
  }
}

// 두 지점 간 거리 계산 (하버사인 공식)
function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // 지구 반지름 (km)
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

async function testCoords() {
  try {
    // 서울 중심 좌표 (광화문)
    const targetLat = 37.5665;
    const targetLng = 126.978;

    // 서울 지역 데이터만 가져오기
    console.log(`=== 서울 지역 데이터 확인 ===`);
    const seoulSamples = await prisma.gameBusiness.findMany({
      where: {
        AND: [
          { 좌표정보x: { not: null } },
          { 좌표정보y: { not: null } },
          { 영업상태명: "영업/정상" },
          { 소재지전체주소: { contains: "서울" } },
        ],
      },
      select: {
        id: true,
        사업장명: true,
        소재지전체주소: true,
        좌표정보x: true,
        좌표정보y: true,
      },
      take: 10,
    });

    console.log(`목표 위치: ${targetLat}, ${targetLng} (광화문)`);
    console.log(`서울 지역 샘플 수: ${seoulSamples.length}`);
    console.log("");

    let withinRadius = 0;

    for (const sample of seoulSamples) {
      const x = parseFloat(sample.좌표정보x || "0");
      const y = parseFloat(sample.좌표정보y || "0");

      console.log(`--- ${sample.사업장명} ---`);
      console.log(`주소: ${sample.소재지전체주소}`);
      console.log(`원본 좌표 (EPSG5174): x=${x}, y=${y}`);

      const converted = convertEPSG5174ToWGS84(x, y);
      console.log(
        `변환 좌표 (WGS84): lat=${converted.lat}, lng=${converted.lng}`
      );

      const distance = calculateDistance(
        targetLat,
        targetLng,
        converted.lat,
        converted.lng
      );
      console.log(`거리: ${distance.toFixed(2)}km`);

      // 좌표 유효성 체크
      const isValid =
        converted.lat >= 33 &&
        converted.lat <= 39 &&
        converted.lng >= 124 &&
        converted.lng <= 132 &&
        converted.lat !== 0 &&
        converted.lng !== 0;
      console.log(`좌표 유효성: ${isValid ? "유효" : "무효"}`);

      if (distance <= 10) {
        withinRadius++;
        console.log(`✅ 10km 반경 내!`);
      }
      console.log("");
    }

    console.log(`=== 요약 ===`);
    console.log(`총 서울 샘플: ${seoulSamples.length}개`);
    console.log(`10km 반경 내: ${withinRadius}개`);

    // 전체 서울 지역 데이터 개수 확인
    const totalSeoul = await prisma.gameBusiness.count({
      where: {
        AND: [
          { 좌표정보x: { not: null } },
          { 좌표정보y: { not: null } },
          { 영업상태명: "영업/정상" },
          { 소재지전체주소: { contains: "서울" } },
        ],
      },
    });

    console.log(`전체 서울 지역 영업중 게임업소: ${totalSeoul}개`);
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testCoords();
