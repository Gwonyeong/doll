'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import TossLoginButton from '@/components/auth/TossLoginButton';

export default function LoginPage() {
  const searchParams = useSearchParams();
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const error = searchParams.get('error');

    switch (error) {
      case 'auth_failed':
        setErrorMessage('토스 로그인에 실패했습니다. 다시 시도해주세요.');
        break;
      case 'no_code':
        setErrorMessage('인증 코드가 없습니다. 다시 시도해주세요.');
        break;
      case 'callback_failed':
        setErrorMessage('로그인 처리 중 오류가 발생했습니다. 다시 시도해주세요.');
        break;
      case 'auth_check_failed':
        setErrorMessage('인증 확인 중 오류가 발생했습니다. 다시 로그인해주세요.');
        break;
      default:
        setErrorMessage('');
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        {/* 로그인 카드 */}
        <div className="bg-white rounded-2xl shadow-xl p-8 backdrop-blur-lg border border-white/20">
          {/* 로고 및 타이틀 */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="w-20 h-20 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center"
            >
              <span className="text-3xl">🎯</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-2xl font-bold text-gray-900 mb-2"
            >
              DollCatcher
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-gray-600"
            >
              인형뽑기 매장 정보를 확인하려면<br />
              로그인이 필요합니다
            </motion.p>
          </div>

          {/* 에러 메시지 */}
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
            >
              <p className="text-sm text-red-700 text-center">{errorMessage}</p>
            </motion.div>
          )}

          {/* 로그인 버튼 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <TossLoginButton />
          </motion.div>

          {/* 로그인 안내 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mt-6 text-center"
          >
            <p className="text-xs text-gray-500">
              토스 앱에서 이용 시 자동으로 로그인됩니다
            </p>
          </motion.div>

          {/* 기능 소개 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="mt-8 space-y-3"
          >
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <div className="w-6 h-6 bg-pink-100 rounded-full flex items-center justify-center">
                <span className="text-xs">📍</span>
              </div>
              <span>전국 인형뽑기 매장 위치 확인</span>
            </div>

            <div className="flex items-center gap-3 text-sm text-gray-600">
              <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-xs">⭐</span>
              </div>
              <span>실시간 리뷰 및 평점 시스템</span>
            </div>

            <div className="flex items-center gap-3 text-sm text-gray-600">
              <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center">
                <span className="text-xs">🎯</span>
              </div>
              <span>개인화된 매장 추천</span>
            </div>
          </motion.div>
        </div>

        {/* 하단 정보 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="text-center mt-6"
        >
          <p className="text-xs text-gray-400">
            로그인 시 <span className="underline">서비스 약관</span> 및{' '}
            <span className="underline">개인정보처리방침</span>에 동의하게 됩니다
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}