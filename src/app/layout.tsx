import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Script from "next/script";
import { Toaster } from "@/components/ui/sonner";

const pretendard = localFont({
  src: [
    {
      path: "../../public/fonts/Pretendard-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/Pretendard-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/Pretendard-SemiBold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/Pretendard-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-pretendard",
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
      <body className={`${pretendard.variable} antialiased`}>
        {children}
        <Toaster position="bottom-center" />
      </body>
    </html>
  );
}
