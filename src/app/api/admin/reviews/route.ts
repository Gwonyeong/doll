import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

// 후기 목록 조회 (특정 매장의 후기들)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const storeId = searchParams.get("storeId");

    if (!storeId) {
      return NextResponse.json(
        { error: "storeId가 필요합니다." },
        { status: 400 }
      );
    }

    const reviews = await prisma.review.findMany({
      where: {
        storeId: parseInt(storeId),
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(reviews);
  } catch (error) {
    console.error("후기 조회 에러:", error);
    return NextResponse.json(
      { error: "후기를 불러오는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

// 새 후기 추가
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { storeId, rating, content, tags, userName } = body;

    // 유효성 검사
    if (!storeId || !rating || !content) {
      return NextResponse.json(
        { error: "storeId, rating, content는 필수입니다." },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "별점은 1-5 사이의 값이어야 합니다." },
        { status: 400 }
      );
    }

    // 매장 존재 여부 확인
    const store = await prisma.gameBusiness.findUnique({
      where: { id: storeId },
    });

    if (!store) {
      return NextResponse.json(
        { error: "존재하지 않는 매장입니다." },
        { status: 404 }
      );
    }

    // 후기 생성
    const review = await prisma.review.create({
      data: {
        storeId,
        rating,
        content,
        tags: tags || [],
        images: [], // 현재는 이미지 업로드 기능 없음
        userName: userName || "익명",
      },
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error("후기 추가 에러:", error);
    return NextResponse.json(
      { error: "후기 추가 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}