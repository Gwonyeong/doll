import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

// 후기 수정
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const reviewId = params.id;
    const body = await request.json();
    const { rating, content, tags, userName } = body;

    // 유효성 검사
    if (!rating || !content) {
      return NextResponse.json(
        { error: "rating과 content는 필수입니다." },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "별점은 1-5 사이의 값이어야 합니다." },
        { status: 400 }
      );
    }

    // 후기 존재 여부 확인
    const existingReview = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!existingReview) {
      return NextResponse.json(
        { error: "존재하지 않는 후기입니다." },
        { status: 404 }
      );
    }

    // 후기 수정
    const updatedReview = await prisma.review.update({
      where: { id: reviewId },
      data: {
        rating,
        content,
        tags: tags || [],
        ...(userName && { userName }),
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(updatedReview);
  } catch (error) {
    console.error("후기 수정 에러:", error);
    return NextResponse.json(
      { error: "후기 수정 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

// 후기 삭제
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const reviewId = params.id;

    // 후기 존재 여부 확인
    const existingReview = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!existingReview) {
      return NextResponse.json(
        { error: "존재하지 않는 후기입니다." },
        { status: 404 }
      );
    }

    // 후기 삭제
    await prisma.review.delete({
      where: { id: reviewId },
    });

    return NextResponse.json({ message: "후기가 삭제되었습니다." });
  } catch (error) {
    console.error("후기 삭제 에러:", error);
    return NextResponse.json(
      { error: "후기 삭제 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}