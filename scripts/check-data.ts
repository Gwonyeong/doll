import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

async function checkData() {
  try {
    console.log("=== 데이터베이스 데이터 확인 ===");

    // 전체 데이터 개수
    const totalCount = await prisma.gameBusiness.count();
    console.log(`전체 게임업소 수: ${totalCount}`);

    // 좌표가 있는 데이터 개수
    const withCoords = await prisma.gameBusiness.count({
      where: {
        AND: [{ 좌표정보x: { not: null } }, { 좌표정보y: { not: null } }],
      },
    });
    console.log(`좌표가 있는 게임업소 수: ${withCoords}`);

    // 영업상태별 개수
    const statusCounts = await prisma.gameBusiness.groupBy({
      by: ["영업상태명"],
      _count: {
        _all: true,
      },
    });
    console.log("\n영업상태별 개수:");
    statusCounts.forEach((status) => {
      console.log(`  ${status.영업상태명}: ${status._count._all}개`);
    });

    // 좌표가 있고 영업중인 데이터 개수
    const activeWithCoords = await prisma.gameBusiness.count({
      where: {
        AND: [
          { 좌표정보x: { not: null } },
          { 좌표정보y: { not: null } },
          { 영업상태명: "영업/정상" },
          { 사업장명: { not: null } },
          { 소재지전체주소: { not: null } },
        ],
      },
    });
    console.log(`\n조건을 만족하는 게임업소 수: ${activeWithCoords}`);

    // 샘플 데이터 몇 개 확인
    const sampleData = await prisma.gameBusiness.findMany({
      where: {
        AND: [{ 좌표정보x: { not: null } }, { 좌표정보y: { not: null } }],
      },
      select: {
        id: true,
        사업장명: true,
        소재지전체주소: true,
        좌표정보x: true,
        좌표정보y: true,
        영업상태명: true,
        업태구분명: true,
      },
      take: 5,
    });

    console.log("\n샘플 데이터:");
    sampleData.forEach((data, index) => {
      console.log(`${index + 1}. ${data.사업장명}`);
      console.log(`   주소: ${data.소재지전체주소}`);
      console.log(`   좌표: (${data.좌표정보x}, ${data.좌표정보y})`);
      console.log(`   상태: ${data.영업상태명}`);
      console.log(`   업태: ${data.업태구분명}`);
      console.log("");
    });
  } catch (error) {
    console.error("데이터 확인 중 오류:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkData();
