"use client";

import React, { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { appLogin } from "@apps-in-toss/web-framework";
import { useAuth } from "@/components/auth/AuthProvider";

function LoginContent() {
  const searchParams = useSearchParams();
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { refreshAuth } = useAuth();

  const handleTossLogin = useCallback(async () => {
    try {
      setIsLoading(true); // 로그인 시작 시 로딩 상태 설정

      // 토스 앱인토스의 appLogin 함수 사용
      const { authorizationCode, referrer } = await appLogin();

      // 획득한 인가 코드와 referrer를 서버로 전달
      const response = await fetch("/api/auth/toss/callback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: authorizationCode,
          referrer,
        }),
      });

      if (response.ok) {
        // 로그인 성공 시 사용자 정보 새로고침
        await refreshAuth();
        // 이전 페이지로 이동 (없으면 메인 페이지)
        const returnUrl = searchParams.get("returnUrl") || "/";
        window.location.href = returnUrl;
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "로그인 처리 실패");
      }
    } catch (error) {
      console.error("토스 로그인 실패:", error);
      setErrorMessage(
        "로그인 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
      );
      setIsLoading(false);
    }
  }, [searchParams, refreshAuth]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const error = searchParams.get("error");

    if (error) {
      // 에러가 있는 경우 에러 메시지 설정
      switch (error) {
        case "auth_failed":
          setErrorMessage("토스 로그인에 실패했습니다. 다시 시도해주세요.");
          break;
        case "no_code":
          setErrorMessage("인증 코드가 없습니다. 다시 시도해주세요.");
          break;
        case "callback_failed":
          setErrorMessage(
            "로그인 처리 중 오류가 발생했습니다. 다시 시도해주세요."
          );
          break;
        case "auth_check_failed":
          setErrorMessage(
            "인증 확인 중 오류가 발생했습니다. 다시 로그인해주세요."
          );
          break;
        default:
          setErrorMessage("");
      }
    }

    // 로딩 상태 해제 - 사용자가 버튼을 클릭할 수 있도록
    setIsLoading(false);
  }, [mounted, searchParams]);

  if (!mounted) {
    // 초기 마운트 중
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // 에러 상태 (수동 재시도 버튼 제공)
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4">
        {/* 에러 메시지 */}
        {errorMessage && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700 text-center">{errorMessage}</p>
          </div>
        )}

        {/* 토스로 로그인 버튼 */}
        <button
          onClick={handleTossLogin}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-3
            bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400
            text-white font-semibold
            px-6 py-4 rounded-xl
            transition-all duration-200
            hover:scale-105 active:scale-95 disabled:hover:scale-100
            focus:outline-none focus:ring-4 focus:ring-blue-200
            shadow-lg hover:shadow-xl disabled:shadow-md
            disabled:cursor-not-allowed"
        >
          <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
            <svg
              viewBox="0 0 24 24"
              className="w-4 h-4 text-blue-600"
              fill="currentColor"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
          </div>
          <span className="text-lg">
            {isLoading ? "로그인 중..." : "토스로 로그인"}
          </span>
          <svg
            className="w-5 h-5 opacity-70"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
