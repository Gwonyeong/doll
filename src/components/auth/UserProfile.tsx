'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, User, Settings } from 'lucide-react';
import { apiClient } from '@/lib/api-client';

interface UserProfileProps {
  user: {
    id: string;
    nickname: string;
    email?: string;
    avatar?: string;
  };
  onLogout: () => void;
}

export default function UserProfile({ user, onLogout }: UserProfileProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      const response = await apiClient.post('/api/auth/toss/logout');

      if (response.ok) {
        onLogout();
        window.location.href = '/login';
      } else {
        console.error('로그아웃 실패');
        alert('로그아웃 처리 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('로그아웃 요청 실패:', error);
      alert('로그아웃 처리 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="relative">
      {/* 프로필 버튼 */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="flex items-center gap-2 p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-all duration-200"
      >
        {user.avatar ? (
          <Image
            src={user.avatar}
            alt={user.nickname}
            width={32}
            height={32}
            className="rounded-full"
          />
        ) : (
          <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
        )}
        <span className="text-sm font-medium text-gray-700 hidden sm:block">
          {user.nickname}
        </span>
        <svg
          className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
            isMenuOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* 드롭다운 메뉴 */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50"
          >
            {/* 사용자 정보 */}
            <div className="p-4 bg-gradient-to-r from-pink-50 to-purple-50 border-b border-gray-100">
              <div className="flex items-center gap-3">
                {user.avatar ? (
                  <Image
                    src={user.avatar}
                    alt={user.nickname}
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                )}
                <div>
                  <p className="font-semibold text-gray-900">{user.nickname}</p>
                  {user.email && (
                    <p className="text-sm text-gray-600">{user.email}</p>
                  )}
                </div>
              </div>
            </div>

            {/* 메뉴 항목들 */}
            <div className="py-2">
              <button
                className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-150 flex items-center gap-3"
                onClick={() => setIsMenuOpen(false)}
              >
                <Settings className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-700">설정</span>
              </button>

              <button
                onClick={handleLogout}
                className="w-full px-4 py-3 text-left hover:bg-red-50 transition-colors duration-150 flex items-center gap-3 text-red-600"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm">로그아웃</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 배경 클릭 시 메뉴 닫기 */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </div>
  );
}