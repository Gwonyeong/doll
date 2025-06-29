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
      <div className="min-h-screen bg-gradient-to-br from-pink-500 via-purple-600 to-indigo-700 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-lg">인증 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 via-purple-600 to-indigo-700">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="text-3xl">🎯</div>
              <h1 className="text-2xl font-bold text-white">
                DollCatcher Admin
              </h1>
            </div>
            <button
              onClick={() => {
                setIsAuthenticated(false);
                router.push("/");
              }}
              className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-white rounded-lg transition-colors backdrop-blur-sm border border-red-400/30"
            >
              로그아웃
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">
              관리자 대시보드
            </h2>
            <p className="text-white/70 text-lg">
              DollCatcher 백오피스에 오신 것을 환영합니다!
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <div className="text-center">
                <div className="text-4xl mb-2">🎮</div>
                <h3 className="text-white font-semibold text-lg mb-1">
                  등록된 매장
                </h3>
                <p className="text-white/70">개발 예정</p>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <div className="text-center">
                <div className="text-4xl mb-2">👥</div>
                <h3 className="text-white font-semibold text-lg mb-1">
                  사용자
                </h3>
                <p className="text-white/70">개발 예정</p>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <div className="text-center">
                <div className="text-4xl mb-2">📊</div>
                <h3 className="text-white font-semibold text-lg mb-1">통계</h3>
                <p className="text-white/70">개발 예정</p>
              </div>
            </div>
          </div>

          {/* Welcome Message */}
          <div className="text-center bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
            <h3 className="text-2xl font-bold text-white mb-4">
              🎉 백오피스 페이지 구축 완료!
            </h3>
            <p className="text-white/80 text-lg leading-relaxed max-w-2xl mx-auto">
              비밀번호 인증을 통해 관리자만 접근할 수 있는 백오피스 페이지가
              성공적으로 구축되었습니다. 향후 매장 관리, 사용자 관리, 통계 분석
              등의 기능이 추가될 예정입니다.
            </p>
            <div className="mt-6">
              <button
                onClick={() => router.push("/")}
                className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
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
