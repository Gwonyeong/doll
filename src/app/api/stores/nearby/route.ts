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
      // take: 1000, // 성능 최적화를 위해 제한 감소
    });

    // 좌표 변환 및 거리 필터링 최적화
    const nearbyStores = [];

    for (const business of gameBusinesses) {
      const x = parseFloat(business.좌표정보x || "0");
      const y = parseFloat(business.좌표정보y || "0");

      if (x === 0 || y === 0) continue;

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

      // 간단한 거리 체크로 먼저 필터링 (정확한 계산 전에)
      const latDiff = Math.abs(coords.lat - lat);
      const lngDiff = Math.abs(coords.lng - lng);

      // 대략적인 거리 체크 (1도 ≈ 111km)
      if (
        latDiff > radius / 111 ||
        lngDiff > radius / (111 * Math.cos((lat * Math.PI) / 180))
      ) {
        continue;
      }

      const distance = calculateDistance(lat, lng, coords.lat, coords.lng);

      if (distance <= radius) {
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

        // 충분한 결과가 있으면 조기 종료
        if (nearbyStores.length >= limit * 2) {
          break;
        }
      }
    }

    // 거리순으로 정렬하고 제한
    const sortedStores = nearbyStores
      .sort((a, b) => a.distance - b.distance)
      .slice(0, limit);

    return NextResponse.json({
      success: true,
      data: sortedStores,
      total: sortedStores.length,
      searchParams: { lat, lng, radius, limit },
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
