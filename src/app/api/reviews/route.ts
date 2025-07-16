import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma/client';

const prisma = new PrismaClient();

// 리뷰 생성
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { storeId, rating, content, tags, images } = body;

    // 필수 값 검증
    if (!storeId || !rating || !content || !tags || tags.length === 0) {
      return NextResponse.json(
        { error: '필수 정보가 누락되었습니다.' },
        { status: 400 }
      );
    }

    // 별점 범위 검증
    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: '별점은 1-5 사이여야 합니다.' },
        { status: 400 }
      );
    }

    // 텍스트 길이 검증
    if (content.length < 10 || content.length > 200) {
      return NextResponse.json(
        { error: '리뷰는 10자 이상 200자 이하여야 합니다.' },
        { status: 400 }
      );
    }

    // 리뷰 생성
    const review = await prisma.review.create({
      data: {
        storeId: parseInt(storeId),
        rating,
        content,
        tags,
        images: images || [],
      },
    });

    return NextResponse.json({ success: true, data: review });
  } catch (error) {
    console.error('리뷰 생성 에러:', error);
    return NextResponse.json(
      { error: '리뷰 생성 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// 리뷰 조회
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const storeId = searchParams.get('storeId');

    if (!storeId) {
      return NextResponse.json(
        { error: 'storeId가 필요합니다.' },
        { status: 400 }
      );
    }

    const reviews = await prisma.review.findMany({
      where: {
        storeId: parseInt(storeId),
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // 평균 별점 계산
    const averageRating = reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;

    return NextResponse.json({
      success: true,
      data: {
        reviews,
        totalCount: reviews.length,
        averageRating: Math.round(averageRating * 10) / 10,
      },
    });
  } catch (error) {
    console.error('리뷰 조회 에러:', error);
    return NextResponse.json(
      { error: '리뷰 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}