"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getTossBridge, isTossWebView, getTossPlatform } from '@/lib/toss-bridge';

interface TossWebViewContextType {
  isWebView: boolean;
  platform: 'ios' | 'android' | 'web';
  bridge: ReturnType<typeof getTossBridge>;
  safeAreaInsets: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
}

const TossWebViewContext = createContext<TossWebViewContextType | null>(null);

export function TossWebViewProvider({ children }: { children: ReactNode }) {
  const [isWebView, setIsWebView] = useState(false);
  const [platform, setPlatform] = useState<'ios' | 'android' | 'web'>('web');
  const [safeAreaInsets, setSafeAreaInsets] = useState({
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  });

  useEffect(() => {
    // 클라이언트 사이드에서만 실행
    const webView = isTossWebView();
    const plat = getTossPlatform();
    const bridge = getTossBridge();

    setIsWebView(webView);
    setPlatform(plat);
    setSafeAreaInsets(bridge.safeAreaInsets);

    // 웹뷰 환경일 때 보안 모드 활성화
    if (webView) {
      bridge.enableSecureMode(true);

      // 토스 웹뷰 초기화 로그
      bridge.logEvent('webview_initialized', {
        platform: plat,
        safeAreaInsets: bridge.safeAreaInsets,
        userAgent: navigator.userAgent,
      });
    }

    // Safe Area 변경 감지 (iOS 회전 등)
    const handleResize = () => {
      const newInsets = bridge.safeAreaInsets;
      setSafeAreaInsets(newInsets);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  return (
    <TossWebViewContext.Provider
      value={{
        isWebView,
        platform,
        bridge: getTossBridge(),
        safeAreaInsets,
      }}
    >
      {children}
    </TossWebViewContext.Provider>
  );
}

export function useTossWebView() {
  const context = useContext(TossWebViewContext);
  if (!context) {
    // Provider 없이 사용될 경우 기본값 반환
    return {
      isWebView: false,
      platform: 'web' as const,
      bridge: getTossBridge(),
      safeAreaInsets: { top: 0, bottom: 0, left: 0, right: 0 },
    };
  }
  return context;
}