'use client';

import React from 'react';
import { generateTossLoginUrl } from '@/lib/toss-auth';

interface TossLoginButtonProps {
  className?: string;
}

export default function TossLoginButton({ className = '' }: TossLoginButtonProps) {
  const handleLogin = () => {
    try {
      const loginUrl = generateTossLoginUrl();
      window.location.href = loginUrl;
    } catch (error) {
      console.error('토스 로그인 URL 생성 실패:', error);
      alert('로그인 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    }
  };

  return (
    <button
      onClick={handleLogin}
      className={`
        w-full flex items-center justify-center gap-3
        bg-blue-600 hover:bg-blue-700
        text-white font-semibold
        px-6 py-4 rounded-xl
        transition-all duration-200
        hover:scale-105 active:scale-95
        focus:outline-none focus:ring-4 focus:ring-blue-200
        shadow-lg hover:shadow-xl
        ${className}
      `}
    >
      {/* 토스 로고 */}
      <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
        <svg
          viewBox="0 0 24 24"
          className="w-4 h-4 text-blue-600"
          fill="currentColor"
        >
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
      </div>

      <span className="text-lg">토스로 로그인</span>

      {/* 화살표 아이콘 */}
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
  );
}