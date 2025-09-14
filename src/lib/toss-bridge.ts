export interface TossBridge {
  isWebView: boolean;
  platform: 'ios' | 'android' | 'web';
  safeAreaInsets: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
  requestPermission: (permission: string) => Promise<boolean>;
  getLocation: () => Promise<{ lat: number; lng: number }>;
  openExternalUrl: (url: string) => void;
  share: (title: string, text: string, url?: string) => void;
  logEvent: (eventName: string, params?: Record<string, any>) => void;
  showToast: (message: string) => void;
  hapticFeedback: (type: 'light' | 'medium' | 'heavy') => void;
  getDeviceInfo: () => {
    model: string;
    os: string;
    version: string;
    appVersion: string;
  };
  networkStatus: () => Promise<'wifi' | 'cellular' | 'offline'>;
  enableSecureMode: (enable: boolean) => void;
}

declare global {
  interface Window {
    tossBridge?: TossBridge;
    webkit?: {
      messageHandlers?: {
        tossBridge?: {
          postMessage: (message: any) => void;
        };
      };
    };
    Android?: {
      tossBridge?: (message: string) => void;
    };
  }
}

class TossBridgeImpl implements TossBridge {
  private isIOSWebView: boolean;
  private isAndroidWebView: boolean;

  constructor() {
    this.isIOSWebView = !!(
      window.webkit?.messageHandlers?.tossBridge ||
      (navigator.userAgent.includes('iPhone') && navigator.userAgent.includes('Toss'))
    );

    this.isAndroidWebView = !!(
      window.Android?.tossBridge ||
      (navigator.userAgent.includes('Android') && navigator.userAgent.includes('Toss'))
    );
  }

  get isWebView(): boolean {
    return this.isIOSWebView || this.isAndroidWebView;
  }

  get platform(): 'ios' | 'android' | 'web' {
    if (this.isIOSWebView) return 'ios';
    if (this.isAndroidWebView) return 'android';
    return 'web';
  }

  get safeAreaInsets() {
    const root = document.documentElement;
    return {
      top: parseInt(getComputedStyle(root).getPropertyValue('--sat') || '0'),
      bottom: parseInt(getComputedStyle(root).getPropertyValue('--sab') || '0'),
      left: parseInt(getComputedStyle(root).getPropertyValue('--sal') || '0'),
      right: parseInt(getComputedStyle(root).getPropertyValue('--sar') || '0'),
    };
  }

  private postMessage(method: string, params?: any) {
    const message = { method, params };

    if (this.isIOSWebView && window.webkit?.messageHandlers?.tossBridge) {
      window.webkit.messageHandlers.tossBridge.postMessage(message);
    } else if (this.isAndroidWebView && window.Android?.tossBridge) {
      window.Android.tossBridge(JSON.stringify(message));
    }
  }

  async requestPermission(permission: string): Promise<boolean> {
    if (!this.isWebView) {
      // 웹 환경에서는 브라우저 API 사용
      if (permission === 'location') {
        try {
          const result = await navigator.permissions.query({ name: 'geolocation' });
          return result.state === 'granted';
        } catch {
          return false;
        }
      }
      return false;
    }

    return new Promise((resolve) => {
      const callbackId = `permission_${Date.now()}`;
      (window as any)[callbackId] = (granted: boolean) => {
        delete (window as any)[callbackId];
        resolve(granted);
      };

      this.postMessage('requestPermission', { permission, callbackId });

      // 타임아웃 설정
      setTimeout(() => {
        if ((window as any)[callbackId]) {
          delete (window as any)[callbackId];
          resolve(false);
        }
      }, 5000);
    });
  }

  async getLocation(): Promise<{ lat: number; lng: number }> {
    if (!this.isWebView) {
      // 웹 환경에서는 브라우저 Geolocation API 사용
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          },
          () => reject(new Error('위치 정보를 가져올 수 없습니다.')),
        );
      });
    }

    return new Promise((resolve, reject) => {
      const callbackId = `location_${Date.now()}`;
      (window as any)[callbackId] = (location: { lat: number; lng: number }) => {
        delete (window as any)[callbackId];
        resolve(location);
      };

      this.postMessage('getLocation', { callbackId });

      setTimeout(() => {
        if ((window as any)[callbackId]) {
          delete (window as any)[callbackId];
          reject(new Error('위치 정보를 가져올 수 없습니다.'));
        }
      }, 10000);
    });
  }

  openExternalUrl(url: string): void {
    if (this.isWebView) {
      this.postMessage('openExternalUrl', { url });
    } else {
      window.open(url, '_blank');
    }
  }

  share(title: string, text: string, url?: string): void {
    if (this.isWebView) {
      this.postMessage('share', { title, text, url });
    } else if (navigator.share) {
      navigator.share({ title, text, url });
    }
  }

  logEvent(eventName: string, params?: Record<string, any>): void {
    if (this.isWebView) {
      this.postMessage('logEvent', { eventName, params });
    } else {
      console.log('Event:', eventName, params);
    }
  }

  showToast(message: string): void {
    if (this.isWebView) {
      this.postMessage('showToast', { message });
    } else {
      // 웹에서는 Sonner 토스트 사용
      import('sonner').then(({ toast }) => {
        toast(message);
      });
    }
  }

  hapticFeedback(type: 'light' | 'medium' | 'heavy'): void {
    if (this.isWebView) {
      this.postMessage('hapticFeedback', { type });
    } else if ('vibrate' in navigator) {
      const duration = type === 'light' ? 10 : type === 'medium' ? 20 : 30;
      navigator.vibrate(duration);
    }
  }

  getDeviceInfo() {
    const userAgent = navigator.userAgent;
    const platform = navigator.platform;

    return {
      model: platform,
      os: this.platform,
      version: userAgent,
      appVersion: '1.0.0',
    };
  }

  async networkStatus(): Promise<'wifi' | 'cellular' | 'offline'> {
    if (!navigator.onLine) return 'offline';

    if (this.isWebView) {
      return new Promise((resolve) => {
        const callbackId = `network_${Date.now()}`;
        (window as any)[callbackId] = (status: 'wifi' | 'cellular' | 'offline') => {
          delete (window as any)[callbackId];
          resolve(status);
        };

        this.postMessage('networkStatus', { callbackId });

        setTimeout(() => {
          if ((window as any)[callbackId]) {
            delete (window as any)[callbackId];
            resolve('wifi'); // 기본값
          }
        }, 3000);
      });
    }

    // 웹 환경에서는 connection API 사용
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    if (connection?.effectiveType) {
      return connection.effectiveType.includes('wifi') ? 'wifi' : 'cellular';
    }

    return 'wifi'; // 기본값
  }

  enableSecureMode(enable: boolean): void {
    if (this.isWebView) {
      this.postMessage('enableSecureMode', { enable });
    }
  }
}

// 싱글톤 인스턴스
let bridgeInstance: TossBridge | null = null;

export function getTossBridge(): TossBridge {
  if (typeof window === 'undefined') {
    // 서버 사이드에서는 더미 객체 반환
    return {
      isWebView: false,
      platform: 'web',
      safeAreaInsets: { top: 0, bottom: 0, left: 0, right: 0 },
      requestPermission: async () => false,
      getLocation: async () => ({ lat: 37.5665, lng: 126.9780 }),
      openExternalUrl: () => {},
      share: () => {},
      logEvent: () => {},
      showToast: () => {},
      hapticFeedback: () => {},
      getDeviceInfo: () => ({ model: '', os: 'web', version: '', appVersion: '' }),
      networkStatus: async () => 'wifi' as const,
      enableSecureMode: () => {},
    };
  }

  if (!bridgeInstance) {
    bridgeInstance = new TossBridgeImpl();
  }

  return bridgeInstance;
}

// 토스 웹뷰 환경 체크 유틸리티
export function isTossWebView(): boolean {
  if (typeof window === 'undefined') return false;
  return getTossBridge().isWebView;
}

// 토스 플랫폼 체크
export function getTossPlatform(): 'ios' | 'android' | 'web' {
  if (typeof window === 'undefined') return 'web';
  return getTossBridge().platform;
}

// Safe Area Insets 훅
export function useSafeAreaInsets() {
  if (typeof window === 'undefined') {
    return { top: 0, bottom: 0, left: 0, right: 0 };
  }
  return getTossBridge().safeAreaInsets;
}