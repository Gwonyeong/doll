import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "../../../../generated/prisma";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const storeId = parseInt(id);
    
    if (isNaN(storeId)) {
      return NextResponse.json(
        { error: "Invalid store ID" },
        { status: 400 }
      );
    }

    const store = await prisma.gameBusiness.findUnique({
      where: { id: storeId },
      include: {
        _count: {
          select: { reviews: true }
        }
      }
    });

    if (!store) {
      return NextResponse.json(
        { error: "Store not found" },
        { status: 404 }
      );
    }

    // 평균 평점 계산
    const reviewsWithRating = await prisma.review.findMany({
      where: { storeId },
      select: { rating: true }
    });

    const averageRating = reviewsWithRating.length > 0
      ? reviewsWithRating.reduce((sum, review) => sum + review.rating, 0) / reviewsWithRating.length
      : 0;

    return NextResponse.json({
      id: store.id,
      name: store.사업장명,
      address: store.소재지전체주소,
      phone: store.소재지전화,
      status: store.영업상태명,
      reviewCount: store._count.reviews,
      averageRating: Math.round(averageRating * 10) / 10
    });
  } catch (error) {
    console.error("Error fetching store:", error);
    return NextResponse.json(
      { error: "Failed to fetch store" },
      { status: 500 }
    );
  }
}