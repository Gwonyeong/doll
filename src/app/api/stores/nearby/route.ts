import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "../../../../generated/prisma";
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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = parseFloat(searchParams.get("lat") || "37.5665");
    const lng = parseFloat(searchParams.get("lng") || "126.978");
    const radius = parseFloat(searchParams.get("radius") || "5"); // 기본 5km
    const limit = parseInt(searchParams.get("limit") || "50");

    console.log(
      `API 호출: lat=${lat}, lng=${lng}, radius=${radius}, limit=${limit}`
    );

    // 데이터베이스에서 좌표가 있는 게임업소 조회
    const gameBusinesses = await prisma.gameBusiness.findMany({
      where: {
        AND: [
          { 좌표정보x: { not: null } },
          { 좌표정보y: { not: null } },
          { 영업상태명: "영업/정상" },
          { 사업장명: { not: null } },
          { 소재지전체주소: { not: null } },
        ],
      },
      select: {
        id: true,
        사업장명: true,
        소재지전체주소: true,
        소재지전화: true,
        좌표정보x: true,
        좌표정보y: true,
        영업상태명: true,
        업태구분명: true,
        총게임기수: true,
        시설면적: true,
      },
      take: 2000, // 성능을 위해 제한
    });

    console.log(`데이터베이스에서 ${gameBusinesses.length}개 데이터 조회`);

    // 좌표 변환 및 거리 필터링
    const nearbyStores = [];
    let processedCount = 0;
    let validCoordCount = 0;
    let withinRadiusCount = 0;

    for (const business of gameBusinesses) {
      processedCount++;

      const x = parseFloat(business.좌표정보x || "0");
      const y = parseFloat(business.좌표정보y || "0");

      if (x === 0 || y === 0) continue;
      validCoordCount++;

      const coords = convertEPSG5174ToWGS84(x, y);

      // 좌표 유효성 검사 (한국 영역 내)
      if (
        coords.lat < 33 ||
        coords.lat > 39 ||
        coords.lng < 124 ||
        coords.lng > 132 ||
        coords.lat === 0 ||
        coords.lng === 0
      ) {
        continue;
      }

      const distance = calculateDistance(lat, lng, coords.lat, coords.lng);

      if (distance <= radius) {
        withinRadiusCount++;
        nearbyStores.push({
          id: business.id,
          name: business.사업장명,
          address: business.소재지전체주소,
          phone: business.소재지전화,
          lat: coords.lat,
          lng: coords.lng,
          distance: Math.round(distance * 100) / 100,
          status: business.영업상태명,
          category: business.업태구분명 || "게임제공업",
          gameCount:
            business.총게임기수 && business.총게임기수 !== "0"
              ? parseInt(business.총게임기수)
              : null,
          area: business.시설면적,
        });
      }

      // 처리 진행 상황 로그 (100개마다)
      if (processedCount % 100 === 0) {
        console.log(
          `처리 진행: ${processedCount}/${gameBusinesses.length}, 유효좌표: ${validCoordCount}, 반경내: ${withinRadiusCount}`
        );
      }
    }

    console.log(
      `최종 결과: 처리=${processedCount}, 유효좌표=${validCoordCount}, 반경내=${withinRadiusCount}`
    );

    // 거리순으로 정렬하고 제한
    const sortedStores = nearbyStores
      .sort((a, b) => a.distance - b.distance)
      .slice(0, limit);
    console.log(sortedStores.map((store) => store.phone));
    console.log(`응답 데이터: ${sortedStores.length}개`);

    return NextResponse.json({
      success: true,
      data: sortedStores,
      total: sortedStores.length,
      debug: {
        processed: processedCount,
        validCoords: validCoordCount,
        withinRadius: withinRadiusCount,
        searchParams: { lat, lng, radius, limit },
      },
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch nearby stores" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
