# 🎯 DollCatcher

## 📋 프로젝트 개요

DollCatcher는 MZ세대를 타겟으로 한 인형뽑기 매장 찾기 서비스입니다. 이 랜딩페이지는 서비스의 핵심 가치와 기능을 트렌디하고 인터랙티브한 방식으로 소개합니다.

### 🎨 디자인 컨셉

- **메인 컬러**: #DD45F1 (핑크-퍼플 그라데이션)
- **타겟**: 젊은 여성층
- **스타일**: 트렌디하고 모던한 UI/UX

### ✨ 주요 특징

- Framer Motion을 활용한 부드러운 애니메이션
- 스크롤 인터랙션과 호버 효과
- 반응형 디자인 (모바일 퍼스트)
- 글래스모피즘 효과
- 커스텀 스크롤바

## 🛠️ 기술 스택

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion
- **Icons**: Lucide React
- **Package Manager**: Yarn

## 🚀 시작하기

### 필수 요구사항

- Node.js 18.17 이상
- Yarn

### 설치 및 실행

```bash
# 의존성 설치
yarn install

# 개발 서버 실행
yarn dev

# 빌드
yarn build

# 프로덕션 서버 실행
yarn start
```

개발 서버는 [http://localhost:3000](http://localhost:3000)에서 실행됩니다.

## 📁 프로젝트 구조

```
doll-catcher-landing/
├── src/
│   ├── app/
│   │   ├── globals.css      # 글로벌 스타일
│   │   ├── layout.tsx       # 레이아웃 컴포넌트
│   │   └── page.tsx         # 메인 랜딩페이지
├── tailwind.config.ts       # Tailwind 설정
├── package.json
└── README.md
```

## 🎨 디자인 시스템

### 컬러 팔레트

```css
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
}
```

### 애니메이션

- `float`: 부유하는 효과
- `pulse-soft`: 부드러운 펄스 효과
- `slide-up/left/right`: 슬라이드 인 효과
- `bounce-soft`: 부드러운 바운스 효과

## 📱 페이지 구성

1. **Header**: 고정 네비게이션 바
2. **Hero Section**: 메인 타이틀과 CTA 버튼
3. **Features Section**: 서비스 핵심 기능 소개
4. **Stats Section**: 서비스 통계 정보
5. **CTA Section**: 최종 행동 유도
6. **Footer**: 서비스 정보 및 저작권

## 🔧 커스터마이징

### 컬러 변경

`tailwind.config.ts`에서 primary 컬러를 수정할 수 있습니다.

### 애니메이션 수정

`src/app/globals.css`에서 커스텀 애니메이션을 추가하거나 수정할 수 있습니다.

### 콘텐츠 수정

`src/app/page.tsx`에서 텍스트 내용과 구조를 수정할 수 있습니다.

## 📋 할일 목록

- [ ] 다크모드 지원
- [ ] 더 많은 인터랙션 효과 추가
- [ ] 성능 최적화
- [ ] SEO 최적화
- [ ] 접근성 개선

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 있습니다.

---

**Made with ❤️ for DollCatcher**
