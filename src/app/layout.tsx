"use client";

import { usePathname } from "next/navigation";
import localFont from "next/font/local";
import "./globals.css";
import Script from "next/script";
import { Toaster } from "@/components/ui/sonner";

const pretendard = localFont({
  src: "../../public/fonts/PretendardVariable.woff2",
  variable: "--font-pretendard",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith("/admin");

  return (
    <html lang="ko">
      <head>
        <Script
          src={`https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID}`}
          strategy="beforeInteractive"
        />
        <title>DollCatcher - 인형뽑기 매장 찾기</title>
        <meta
          name="description"
          content="내 주변 인형뽑기 매장을 쉽고 빠르게 찾아보세요. 실시간 정보와 후기로 완벽한 인형뽑기 경험을 만들어드립니다."
        />
        <meta name="keywords" content="인형뽑기, 크레인게임, 매장찾기, 지도, 후기" />
      </head>
      <body className={`${pretendard.variable} antialiased bg-gray-50`}>
        <div className={`mx-auto min-h-screen bg-white ${!isAdminPage ? "max-w-[600px] shadow-lg" : ""}`}>
          {children}
        </div>
        <Toaster position="bottom-center" />
      </body>
    </html>
  );
}
