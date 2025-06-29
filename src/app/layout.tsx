import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "DollCatcher - 인형뽑기 매장 찾기",
  description:
    "내 주변 인형뽑기 매장을 쉽고 빠르게 찾아보세요. 실시간 정보와 후기로 완벽한 인형뽑기 경험을 만들어드립니다.",
  keywords: "인형뽑기, 크레인게임, 매장찾기, 지도, 후기",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <Script
          src={`https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID}`}
          strategy="beforeInteractive"
        />
      </head>
      <body className={`${inter.variable} antialiased`}>{children}</body>
    </html>
  );
}
