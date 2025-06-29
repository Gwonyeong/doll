import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

async function checkPhoneData() {
  try {
    console.log("=== 전화번호 데이터 확인 ===");

    // 전화번호가 있는 영업중 게임업소 확인
    const withPhone = await prisma.gameBusiness.findMany({
      where: {
        AND: [
          { 소재지전화: { not: null } },
          { 소재지전화: { not: "" } },
          { 영업상태명: "영업/정상" },
          { 소재지전체주소: { contains: "서울" } },
          { 좌표정보x: { not: null } },
          { 좌표정보y: { not: null } },
        ],
      },
      select: {
        사업장명: true,
        소재지전체주소: true,
        소재지전화: true,
      },
      take: 5,
    });

    console.log(`전화번호가 있는 서울 게임업소 샘플 (${withPhone.length}개):`);
    withPhone.forEach((store, index) => {
      console.log(`${index + 1}. ${store.사업장명}`);
      console.log(`   주소: ${store.소재지전체주소}`);
      console.log(`   전화: ${store.소재지전화}`);
      console.log("");
    });

    // 전화번호 없는 경우도 확인
    const withoutPhone = await prisma.gameBusiness.count({
      where: {
        AND: [
          { 영업상태명: "영업/정상" },
          { 소재지전체주소: { contains: "서울" } },
          { 좌표정보x: { not: null } },
          { 좌표정보y: { not: null } },
          {
            OR: [{ 소재지전화: null }, { 소재지전화: "" }],
          },
        ],
      },
    });

    console.log(`전화번호가 없는 서울 영업중 게임업소: ${withoutPhone}개`);
    console.log(`전화번호가 있는 서울 영업중 게임업소: ${withPhone.length}개`);
  } catch (error) {
    console.error("오류:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkPhoneData();
