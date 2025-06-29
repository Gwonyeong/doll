import fs from "fs";
import path from "path";
import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

interface GameBusinessData {
  번호?: number | null;
  개방서비스명?: string | null;
  개방서비스아이디?: string | null;
  개방자치단체코드?: string | null;
  관리번호?: string | null;
  인허가일자?: string | null;
  인허가취소일자?: string | null;
  영업상태구분코드?: string | null;
  영업상태명?: string | null;
  상세영업상태코드?: string | null;
  상세영업상태명?: string | null;
  폐업일자?: string | null;
  휴업시작일자?: string | null;
  휴업종료일자?: string | null;
  재개업일자?: string | null;
  소재지전화?: string | null;
  소재지면적?: string | null;
  소재지우편번호?: string | null;
  소재지전체주소?: string | null;
  도로명전체주소?: string | null;
  도로명우편번호?: string | null;
  사업장명?: string | null;
  최종수정시점?: string | null;
  데이터갱신구분?: string | null;
  데이터갱신일자?: string | null;
  업태구분명?: string | null;
  좌표정보x?: string | null;
  좌표정보y?: string | null;
  문화체육업종명?: string | null;
  문화사업자구분명?: string | null;
  총층수?: string | null;
  주변환경명?: string | null;
  제작취급품목내용?: string | null;
  시설면적?: string | null;
  지상층수?: string | null;
  지하층수?: string | null;
  건물용도명?: string | null;
  통로너비?: string | null;
  조명시설조도?: string | null;
  노래방실수?: string | null;
  청소년실수?: string | null;
  비상계단여부?: string | null;
  비상구여부?: string | null;
  자동환기여부?: string | null;
  청소년실여부?: string | null;
  특수조명여부?: string | null;
  방음시설여부?: string | null;
  비디오재생기명?: string | null;
  조명시설유무?: string | null;
  음향시설여부?: string | null;
  편의시설여부?: string | null;
  소방시설여부?: string | null;
  총게임기수?: string | null;
  기존게임업외업종명?: string | null;
  제공게임물명?: string | null;
  공연장형태구분명?: string | null;
  품목명?: string | null;
  최초등록시점?: string | null;
  지역구분명?: string | null;
}

async function importCSV(): Promise<void> {
  try {
    console.log("CSV 데이터 가져오기 시작...");

    // CSV 파일 경로
    const csvFilePath = path.join(
      process.cwd(),
      "public/csv/fulldata_03_05_07_P_청소년게임제공업.csv"
    );

    // CSV 파일 읽기
    const csvData = fs.readFileSync(csvFilePath, "utf-8");
    const lines = csvData.split("\n");

    // 헤더 제거
    const headers = lines[0].split("\t");
    const dataLines = lines.slice(1).filter((line) => line.trim() !== "");

    console.log(`총 ${dataLines.length}개의 데이터 행을 처리합니다.`);

    // 배치 처리를 위한 설정
    const batchSize = 1000;
    let processedCount = 0;

    for (let i = 0; i < dataLines.length; i += batchSize) {
      const batch = dataLines.slice(i, i + batchSize);
      const batchData: GameBusinessData[] = [];

      for (const line of batch) {
        const values = line.split("\t");

        // 빈 값이나 잘못된 데이터 행 건너뛰기
        if (values.length < headers.length - 10) continue;

        const data: GameBusinessData = {
          번호: values[0] ? parseInt(values[0]) || null : null,
          개방서비스명: values[1] || null,
          개방서비스아이디: values[2] || null,
          개방자치단체코드: values[3] || null,
          관리번호: values[4] || null,
          인허가일자: values[5] || null,
          인허가취소일자: values[6] || null,
          영업상태구분코드: values[7] || null,
          영업상태명: values[8] || null,
          상세영업상태코드: values[9] || null,
          상세영업상태명: values[10] || null,
          폐업일자: values[11] || null,
          휴업시작일자: values[12] || null,
          휴업종료일자: values[13] || null,
          재개업일자: values[14] || null,
          소재지전화: values[15] || null,
          소재지면적: values[16] || null,
          소재지우편번호: values[17] || null,
          소재지전체주소: values[18] || null,
          도로명전체주소: values[19] || null,
          도로명우편번호: values[20] || null,
          사업장명: values[21] || null,
          최종수정시점: values[22] || null,
          데이터갱신구분: values[23] || null,
          데이터갱신일자: values[24] || null,
          업태구분명: values[25] || null,
          좌표정보x: values[26] || null,
          좌표정보y: values[27] || null,
          문화체육업종명: values[28] || null,
          문화사업자구분명: values[29] || null,
          총층수: values[30] || null,
          주변환경명: values[31] || null,
          제작취급품목내용: values[32] || null,
          시설면적: values[33] || null,
          지상층수: values[34] || null,
          지하층수: values[35] || null,
          건물용도명: values[36] || null,
          통로너비: values[37] || null,
          조명시설조도: values[38] || null,
          노래방실수: values[39] || null,
          청소년실수: values[40] || null,
          비상계단여부: values[41] || null,
          비상구여부: values[42] || null,
          자동환기여부: values[43] || null,
          청소년실여부: values[44] || null,
          특수조명여부: values[45] || null,
          방음시설여부: values[46] || null,
          비디오재생기명: values[47] || null,
          조명시설유무: values[48] || null,
          음향시설여부: values[49] || null,
          편의시설여부: values[50] || null,
          소방시설여부: values[51] || null,
          총게임기수: values[52] || null,
          기존게임업외업종명: values[53] || null,
          제공게임물명: values[54] || null,
          공연장형태구분명: values[55] || null,
          품목명: values[56] || null,
          최초등록시점: values[57] || null,
          지역구분명: values[58] || null,
        };

        batchData.push(data);
      }

      if (batchData.length > 0) {
        await prisma.gameBusiness.createMany({
          data: batchData,
          skipDuplicates: true,
        });

        processedCount += batchData.length;
        console.log(
          `진행률: ${processedCount}/${dataLines.length} (${Math.round(
            (processedCount / dataLines.length) * 100
          )}%)`
        );
      }
    }

    console.log("CSV 데이터 가져오기 완료!");
    console.log(
      `총 ${processedCount}개의 레코드가 데이터베이스에 추가되었습니다.`
    );
  } catch (error) {
    console.error("CSV 가져오기 중 오류 발생:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// 스크립트 실행
importCSV();
