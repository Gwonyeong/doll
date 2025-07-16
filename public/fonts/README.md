# Pretendard 폰트 다운로드 가이드

Pretendard 폰트 파일을 다운로드하여 이 디렉토리에 추가해야 합니다.

## 다운로드 방법

1. [Pretendard 공식 GitHub 저장소](https://github.com/orioncactus/pretendard/releases)에서 최신 릴리스를 다운로드합니다.

2. 다운로드한 파일에서 다음 woff2 파일들을 이 폴더(`/public/fonts/`)에 복사합니다:
   - Pretendard-Regular.woff2
   - Pretendard-Medium.woff2
   - Pretendard-SemiBold.woff2
   - Pretendard-Bold.woff2

## 대안: CDN 사용

폰트 파일을 직접 호스팅하지 않고 CDN을 사용하려면, `src/app/layout.tsx` 파일을 다음과 같이 수정할 수 있습니다:

```typescript
// layout.tsx의 <head> 태그 안에 추가
<link
  rel="stylesheet"
  as="style"
  href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
/>
```

그리고 globals.css에서:
```css
body {
  font-family: "Pretendard", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}
```