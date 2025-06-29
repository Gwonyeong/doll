import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "../../../../generated/prisma";

const prisma = new PrismaClient();

interface GameBusinessData {
  id: number;
  사업장명: string | null;
  영업상태명: string | null;
  소재지전화: string | null;
  소재지전체주소: string | null;
  최종수정시점: string | null;
  총게임기수: string | null;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // 페이지네이션 파라미터
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    // 필터 파라미터
    const isOperating = searchParams.get("isOperating"); // 'true', 'false', 또는 null
    const hasPhone = searchParams.get("hasPhone"); // 'true', 'false', 또는 null
    const addressSearch = searchParams.get("addressSearch") || "";
    const businessNameSearch = searchParams.get("businessNameSearch") || "";
    const minGameMachines = parseInt(
      searchParams.get("minGameMachines") || "0"
    );
    const maxGameMachines = parseInt(
      searchParams.get("maxGameMachines") || "100"
    );

    // Prisma where 조건 구성
    const whereConditions: any = {
      AND: [],
    };

    // 영업상태 필터
    if (isOperating === "true") {
      whereConditions.AND.push({ 영업상태명: "영업/정상" });
    } else if (isOperating === "false") {
      whereConditions.AND.push({
        NOT: { 영업상태명: "영업/정상" },
      });
    }

    // 전화번호 존재 여부 필터
    if (hasPhone === "true") {
      whereConditions.AND.push({
        AND: [{ 소재지전화: { not: null } }, { 소재지전화: { not: "" } }],
      });
    } else if (hasPhone === "false") {
      whereConditions.AND.push({
        OR: [{ 소재지전화: null }, { 소재지전화: "" }],
      });
    }

    // 주소 검색
    if (addressSearch) {
      whereConditions.AND.push({
        소재지전체주소: {
          contains: addressSearch,
          mode: "insensitive",
        },
      });
    }

    // 사업장명 검색
    if (businessNameSearch) {
      whereConditions.AND.push({
        사업장명: {
          contains: businessNameSearch,
          mode: "insensitive",
        },
      });
    }

    // 게임기 수 범위 필터 (문자열로 저장된 숫자 처리)
    if (minGameMachines > 0 || maxGameMachines < 100) {
      // 먼저 null이 아니고 빈 문자열이 아닌 것들만 필터링
      whereConditions.AND.push({
        총게임기수: { not: null },
      });
      whereConditions.AND.push({
        총게임기수: { not: "" },
      });
    }

    // AND 배열이 비어있으면 제거
    if (whereConditions.AND.length === 0) {
      delete whereConditions.AND;
    }

    // 게임기 수 필터가 있는 경우, 모든 데이터를 가져와서 필터링
    const needsGameMachineFilter = minGameMachines > 0 || maxGameMachines < 100;

    if (needsGameMachineFilter) {
      // 모든 데이터를 가져와서 클라이언트 사이드에서 필터링
      const allBusinesses = await prisma.gameBusiness.findMany({
        where: whereConditions,
        select: {
          id: true,
          사업장명: true,
          영업상태명: true,
          소재지전화: true,
          소재지전체주소: true,
          최종수정시점: true,
          총게임기수: true,
        },
        orderBy: {
          id: "desc",
        },
      });

      // 게임기 수 범위 필터 적용
      const filteredBusinesses = allBusinesses.filter(
        (business: GameBusinessData) => {
          const gameCount = parseInt(business.총게임기수 || "0");
          return gameCount >= minGameMachines && gameCount <= maxGameMachines;
        }
      );

      const totalCount = filteredBusinesses.length;
      const businesses = filteredBusinesses.slice(skip, skip + limit);
      const totalPages = Math.ceil(totalCount / limit);

      return NextResponse.json({
        success: true,
        data: businesses,
        pagination: {
          currentPage: page,
          totalPages,
          totalCount,
          limit,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      });
    } else {
      // 일반적인 페이지네이션
      const [businesses, totalCount] = await Promise.all([
        prisma.gameBusiness.findMany({
          where: whereConditions,
          select: {
            id: true,
            사업장명: true,
            영업상태명: true,
            소재지전화: true,
            소재지전체주소: true,
            최종수정시점: true,
            총게임기수: true,
          },
          skip: skip,
          take: limit,
          orderBy: {
            id: "desc",
          },
        }),
        prisma.gameBusiness.count({
          where: whereConditions,
        }),
      ]);

      const totalPages = Math.ceil(totalCount / limit);

      return NextResponse.json({
        success: true,
        data: businesses,
        pagination: {
          currentPage: page,
          totalPages,
          totalCount,
          limit,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      });
    }
  } catch (error) {
    console.error("GameBusiness API Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
