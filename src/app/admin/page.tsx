"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleAuthentication = () => {
      const password = prompt("관리자 비밀번호를 입력하세요:");

      // 여기에 원하는 비밀번호를 설정하세요
      const ADMIN_PASSWORD = "admin123";

      if (password === ADMIN_PASSWORD) {
        setIsAuthenticated(true);
      } else {
        alert("비밀번호가 올바르지 않습니다. 접근이 거부되었습니다.");
        router.push("/");
      }
    };

    handleAuthentication();
  }, [router]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-800 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800 mx-auto mb-4"></div>
          <p className="text-lg">인증 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="text-3xl">⚙️</div>
              <h1 className="text-2xl font-bold text-gray-900">
                DollCatcher Admin
              </h1>
            </div>
            <button
              onClick={() => {
                setIsAuthenticated(false);
                router.push("/");
              }}
              className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg transition-colors border border-gray-800"
            >
              로그아웃
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              관리자 대시보드
            </h2>
            <p className="text-gray-600 text-lg">
              DollCatcher 백오피스에 오신 것을 환영합니다!
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <div className="text-center">
                <div className="text-4xl mb-3">🎮</div>
                <h3 className="text-gray-900 font-semibold text-lg mb-2">
                  등록된 매장
                </h3>
                <p className="text-gray-500">개발 예정</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <div className="text-center">
                <div className="text-4xl mb-3">👥</div>
                <h3 className="text-gray-900 font-semibold text-lg mb-2">
                  사용자
                </h3>
                <p className="text-gray-500">개발 예정</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <div className="text-center">
                <div className="text-4xl mb-3">📊</div>
                <h3 className="text-gray-900 font-semibold text-lg mb-2">
                  통계
                </h3>
                <p className="text-gray-500">개발 예정</p>
              </div>
            </div>
          </div>

          {/* Welcome Message */}
          <div className="text-center bg-gray-50 rounded-lg p-8 border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              ✅ 백오피스 페이지 구축 완료!
            </h3>
            <p className="text-gray-700 text-lg leading-relaxed max-w-2xl mx-auto">
              비밀번호 인증을 통해 관리자만 접근할 수 있는 백오피스 페이지가
              성공적으로 구축되었습니다. 향후 매장 관리, 사용자 관리, 통계 분석
              등의 기능이 추가될 예정입니다.
            </p>
            <div className="mt-8">
              <button
                onClick={() => router.push("/")}
                className="px-8 py-3 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-lg transition-colors"
              >
                메인 페이지로 돌아가기
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
