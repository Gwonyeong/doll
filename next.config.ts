import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 토스 웹뷰 최적화 설정
  reactStrictMode: true,

  // 이미지 최적화
  images: {
    domains: ["localhost", "supabase.co"],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60,
  },

  // 성능 최적화
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  // PWA 지원 (토스 웹뷰에서도 오프라인 지원)
  headers: async () => [
    {
      source: "/:path*",
      headers: [
        // CORS 헤더 추가
        {
          key: "Access-Control-Allow-Origin",
          value: "*",
        },
        {
          key: "Access-Control-Allow-Methods",
          value: "GET, POST, PUT, DELETE, OPTIONS, PATCH",
        },
        {
          key: "Access-Control-Allow-Headers",
          value: "*",
        },
        {
          key: "Access-Control-Allow-Credentials",
          value: "true",
        },
        // 보안 헤더 제거 또는 완화 (토스 앱인토스 테스트용)
        {
          key: "X-Frame-Options",
          value: "ALLOWALL",
        },
        {
          key: "X-Content-Type-Options",
          value: "nosniff",
        },
        {
          key: "X-XSS-Protection",
          value: "1; mode=block",
        },
        // 토스 웹뷰 캐싱 최적화
        {
          key: "Cache-Control",
          value: "public, max-age=3600, must-revalidate",
        },
      ],
    },
  ],

  // 웹팩 최적화
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // 번들 사이즈 최적화
      config.optimization.splitChunks = {
        chunks: "all",
        cacheGroups: {
          default: false,
          vendors: false,
          vendor: {
            name: "vendor",
            chunks: "all",
            test: /node_modules/,
            priority: 20,
          },
          common: {
            name: "common",
            minChunks: 2,
            chunks: "async",
            priority: 10,
            reuseExistingChunk: true,
            enforce: true,
          },
        },
      };
    }
    return config;
  },

  // 실험적 기능
  experimental: {
    scrollRestoration: true,
  },

  async rewrites() {
    return [
      // Toss Mini앱 도메인에서 접근 허용
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "dollpickmap.private-apps.tossmini.com",
          },
        ],
        destination: "/:path*",
      },
    ];
  },
};

export default nextConfig;
