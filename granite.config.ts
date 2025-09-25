import { defineConfig } from "@apps-in-toss/web-framework/config";

export default defineConfig({
  appName: "dollpickmap",
  brand: {
    displayName: "dollpickmap", // 화면에 노출될 앱의 한글 이름으로 바꿔주세요.
    primaryColor: "#3182F6", // 화면에 노출될 앱의 기본 색상으로 바꿔주세요.
    icon: "https://lh4.googleusercontent.com/proxy/f_-X6Tgh94FMFcQySRM9rQN4xldxl8Odx0EuvS30kI4fJGxcm88RXsHQBAWoYMhWWkTHTRZwEm-wptVM9wjJkpDfml2peMvHMRW9BfhoRBpTDUp8A9S4GIQ6ThQ", // 화면에 노출될 앱의 아이콘 이미지 주소로 바꿔주세요.
    bridgeColorMode: "basic",
  },
  web: {
    host: "dollbbobgosu.vercel.app",
    port: 443,
    commands: {
      dev: "next dev",
      build: "prisma generate && next build",
    },
  },
  permissions: [],
  outdir: ".next/server/app",
});
