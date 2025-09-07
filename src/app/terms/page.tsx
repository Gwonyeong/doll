import React from "react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="border-b border-gray-200 pb-6 mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              서비스 이용약관
            </h1>
          </div>

          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                제1조 목적
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                본 약관은 &ldquo;트라이(이하 &ldquo;회사&rdquo;)&rdquo;가
                제공하는 인형뽑기 및 오락실 매장 정보 제공 서비스, 후기 공유
                서비스 등(이하 &ldquo;서비스&rdquo;)의 이용과 관련하여 회사와
                회원 간의 권리, 의무 및 책임사항을 명확히 규정함으로써, 회사와
                회원이 상호 신뢰를 바탕으로 서비스를 원활히 이용할 수 있도록
                하는 것을 목적으로 합니다.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                제2조 정의
              </h2>
              <p className="text-gray-700 mb-4">
                본 약관에서 사용하는 용어의 정의는 다음과 같습니다.
              </p>
              <ul className="list-decimal list-inside space-y-2 text-gray-700 pl-4">
                <li>
                  &ldquo;서비스&rdquo;란 회사가 제공하는 웹사이트, 모바일
                  애플리케이션 등을 통하여 제공되는 지도 기반 매장 검색, 후기
                  작성 및 열람, 즐겨찾기, 매장 알림 신청 등 일체의 기능을
                  의미합니다.
                </li>
                <li>
                  &ldquo;회원&rdquo;이란 본 약관에 동의하고 회사와 이용계약을
                  체결하여 서비스를 이용하는 자를 의미합니다.
                </li>
                <li>
                  &ldquo;매장회원&rdquo;이란 인형뽑기 매장 또는 오락실을
                  운영하는 자로서 회사가 제공하는 매장 관리, 알림 신청 등의
                  기능을 이용하는 회원을 의미합니다.
                </li>
                <li>
                  &ldquo;콘텐츠&rdquo;란 회원이 서비스에 등록하거나 게시하는
                  텍스트, 사진, 이미지, 리뷰, 평점, 기타 자료 일체를 의미합니다.
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                제3조 약관의 효력 및 변경
              </h2>
              <ul className="list-decimal list-inside space-y-3 text-gray-700 pl-4">
                <li>
                  본 약관은 서비스를 이용하고자 하는 모든 회원에게 그 효력이
                  발생합니다.
                </li>
                <li>
                  회사는 관계 법령을 위배하지 않는 범위에서 본 약관을 개정할 수
                  있으며, 개정 시 최소 7일 전 서비스 내 공지사항 또는 기타
                  합리적인 방법을 통해 공지합니다. 다만, 회원에게 불리하거나
                  중요한 내용이 포함된 개정의 경우 최소 30일 전에 공지합니다.
                </li>
                <li>
                  회원이 개정된 약관에 동의하지 않는 경우 서비스 이용을 중단하고
                  탈퇴할 수 있으며, 개정 약관의 효력이 발생한 이후에도 계속
                  서비스를 이용하는 경우 변경된 약관에 동의한 것으로 간주됩니다.
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                제4조 이용계약의 체결
              </h2>
              <ul className="list-decimal list-inside space-y-3 text-gray-700 pl-4">
                <li>
                  서비스 이용계약은 회원이 본 약관에 동의하고 회사가 정한 절차에
                  따라 회원가입을 신청한 후, 회사가 이를 승인함으로써
                  성립합니다.
                </li>
                <li>
                  회사는 다음 각 호의 경우 회원가입 신청을 승낙하지 않거나, 승낙
                  이후에도 취소할 수 있습니다.
                  <ul className="list-disc list-inside mt-2 space-y-1 pl-6">
                    <li>허위 또는 부정확한 정보를 기재한 경우</li>
                    <li>타인의 명의를 도용한 경우</li>
                    <li>
                      서비스의 정상적인 운영을 고의로 방해하거나 방해할 우려가
                      있는 경우
                    </li>
                    <li>
                      사회질서, 미풍양속에 위배되는 목적이나 방법으로 신청한
                      경우
                    </li>
                  </ul>
                </li>
                <li>
                  회사는 서비스 정책상 필요에 따라 일부 서비스에 대해 이용 가능
                  연령, 인증 절차, 추가 약관 동의 등을 요구할 수 있습니다.
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                제5조 서비스의 제공
              </h2>
              <ul className="list-decimal list-inside space-y-3 text-gray-700 pl-4">
                <li>
                  회사는 회원에게 다음과 같은 서비스를 제공합니다.
                  <ul className="list-disc list-inside mt-2 space-y-1 pl-6">
                    <li>위치 기반 인형뽑기 및 오락실 매장 검색 서비스</li>
                    <li>후기, 평점, 사진 등 정보 등록 및 열람 서비스</li>
                    <li>매장 즐겨찾기, 신규 매장 알림 기능</li>
                    <li>매장회원의 매장 정보 등록 및 알림 신청 기능</li>
                  </ul>
                </li>
                <li>
                  회사는 서비스 개선을 위하여 정기 점검을 실시할 수 있으며, 이
                  경우 사전 공지 후 서비스 제공을 일시적으로 중단할 수 있습니다.
                </li>
                <li>
                  회사는 운영상, 기술상의 필요에 따라 서비스의 전부 또는 일부를
                  변경하거나 중단할 수 있으며, 그 경우 회원에게 사전 고지합니다.
                  다만, 긴급한 보안 문제 해결, 서버 장애 등 불가피한 사유가 있는
                  경우 사후에 통지할 수 있습니다.
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                제6조 회원의 의무
              </h2>
              <ul className="list-decimal list-inside space-y-3 text-gray-700 pl-4">
                <li>
                  회원은 서비스 이용 시 다음 행위를 해서는 안 됩니다.
                  <ul className="list-disc list-inside mt-2 space-y-1 pl-6">
                    <li>
                      허위 정보 또는 타인의 정보를 도용하여 가입하거나 이용하는
                      행위
                    </li>
                    <li>
                      욕설, 음란물, 불법정보, 타인을 비방하거나 명예를 훼손하는
                      콘텐츠 게시 행위
                    </li>
                    <li>
                      회사 또는 제3자의 지식재산권, 초상권, 기타 권리를 침해하는
                      행위
                    </li>
                    <li>
                      서비스의 정상적인 운영을 방해하거나 고의로 오류를
                      발생시키는 행위
                    </li>
                    <li>법령에 위반되는 행위 또는 범죄와 관련된 행위</li>
                  </ul>
                </li>
                <li>
                  회원이 위 의무를 위반한 경우, 회사는 사전 통보 없이 해당
                  콘텐츠 삭제, 서비스 제한, 계정 정지 또는 해지 등의 조치를 취할
                  수 있습니다.
                </li>
                <li>
                  회원은 본 약관 및 회사가 정한 정책, 공지사항 등을 준수할
                  의무가 있습니다.
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                제7조 콘텐츠의 권리와 이용
              </h2>
              <ul className="list-decimal list-inside space-y-3 text-gray-700 pl-4">
                <li>
                  회원이 서비스 내에 게시하거나 등록한 모든 콘텐츠(후기, 사진,
                  평점 등)의 저작권은 회사에 귀속됩니다.
                </li>
                <li>
                  회사는 회원이 작성한 콘텐츠를 서비스 운영, 홍보, 개선, 신규
                  서비스 개발을 위해 자유롭게 사용할 수 있으며, 복제, 배포,
                  전시, 전송, 2차 저작물 작성 등의 방식으로 활용할 수 있습니다.
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                제8조 면책조항
              </h2>
              <ul className="list-decimal list-inside space-y-3 text-gray-700 pl-4">
                <li>
                  회사는 천재지변, 전쟁, 서버 장애, 통신 두절 등 불가항력적인
                  사유로 인하여 서비스를 제공할 수 없는 경우, 그에 대한 책임을
                  지지 않습니다.
                </li>
                <li>
                  회사는 회원 간 또는 회원과 매장 간에 발생한 거래, 분쟁, 손해에
                  개입하지 않으며, 이에 대한 책임을 지지 않습니다.
                </li>
                <li>
                  회사는 회원이 서비스를 통하여 얻은 정보에 의존하여 발생한
                  손해에 대하여 책임을 지지 않습니다.
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                제9조 관할법원
              </h2>
              <p className="text-gray-700 leading-relaxed">
                본 약관과 관련하여 분쟁이 발생할 경우, 회사 본점 소재지를
                관할하는 법원을 전속적 합의관할 법원으로 합니다.
              </p>
            </section>

            <div className="border-t border-gray-200 pt-6 mt-8">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  회사 정보
                </h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>
                    <strong>상호:</strong> 트라이
                  </p>
                  <p>
                    <strong>대표자명:</strong> 김수경
                  </p>
                  <p>
                    <strong>사업자등록번호:</strong> 755-03-03767
                  </p>
                  <p>
                    <strong>주소:</strong> 서울특별시 송파구 올림픽로 435
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
