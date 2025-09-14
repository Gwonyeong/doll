import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#DD45F1",
          50: "#F9E8FC",
          100: "#F2D1F9",
          200: "#E7A3F3",
          300: "#DC75ED",
          400: "#DD45F1",
          500: "#DD45F1",
          600: "#C936DC",
          700: "#A62BB8",
          800: "#832294",
          900: "#5F1970",
        },
        // 토스 디자인 시스템 색상
        toss: {
          blue: {
            DEFAULT: "#3182F6",
            50: "#E8F2FF",
            100: "#C9E2FF",
            200: "#90C2FF",
            300: "#64A8FF",
            400: "#4593FC",
            500: "#3182F6",
            600: "#2272EB",
            700: "#1B64DA",
            800: "#1957C2",
            900: "#194AA2",
          },
          gray: {
            DEFAULT: "#8B95A1",
            50: "#F9FAFB",
            100: "#F2F4F6",
            200: "#E5E8EB",
            300: "#D1D6DB",
            400: "#B0B8C1",
            500: "#8B95A1",
            600: "#6B7684",
            700: "#4E5968",
            800: "#333D4B",
            900: "#191F28",
          },
          success: "#00BF40",
          warning: "#FFC043",
          error: "#FF5B5B",
        },
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "pulse-soft": "pulse-soft 2s ease-in-out infinite",
        "slide-up": "slide-up 0.6s ease-out",
        "slide-in-left": "slide-in-left 0.8s ease-out",
        "slide-in-right": "slide-in-right 0.8s ease-out",
        "bounce-soft": "bounce-soft 2s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
        "slide-up": {
          "0%": { transform: "translateY(30px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "slide-in-left": {
          "0%": { transform: "translateX(-50px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        "slide-in-right": {
          "0%": { transform: "translateX(50px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        "bounce-soft": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      fontFamily: {
        sans: ["var(--font-pretendard)"],
      },
    },
  },
  plugins: [],
};
export default config;
