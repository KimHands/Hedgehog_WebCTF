# Hedgehog WebCTF

> 순천향대 정보보호 동아리 **Hedgehog**가 동아리 박람회·오픈랩에서 운영한 체험형 웹 해킹 CTF 플랫폼
> 비전공자 모드 + 전공자 타임어택 모드의 6문제로 구성된 행사용 사이트

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com)

---

## 행사 종료 안내

이 저장소는 **이미 종료된 교내 행사**(동아리 박람회·오픈랩)의 결과물이며, 운영자/스태프 풀이가 함께 공개돼 있습니다. 동일 플래그는 더 이상 활용되지 않으며, 코드를 학습 자료로 자유롭게 참고하셔도 됩니다.

- 풀이 해설: [`docs/WALKTHROUGH.md`](./docs/WALKTHROUGH.md)

---

## 두 가지 모드

| 모드 | 대상 | 활성화 방법 |
|---|---|---|
| **비전공자 (일반)** | 보안 지식이 없는 참가자 | 기본값 |
| **전공자 (타임어택)** | CS/보안 전공 참가자 | 메인 페이지에서 타임어택 선택 또는 `localStorage.ctf_mode = "speedrun"` |

---

## 문제 구성 (각 모드 3문제)

### 비전공자 모드
| # | 제목 | 난이도 | 카테고리 |
|---|---|---|---|
| 1 | 보이지 않는 잉크 | ★☆☆ | View Source |
| 2 | 브라우저의 기억 | ★☆☆ | Client Storage |
| 3 | 개발자 도구의 마법 | ★★☆ | JS Console |

### 전공자 모드 (타임어택)
| # | 제목 | 난이도 | 카테고리 |
|---|---|---|---|
| 1 | 인코딩된 비밀 | ★★☆ | JS Obfuscation |
| 2 | 헤더를 보내라 | ★★☆ | HTTP Headers |
| 3 | UNION 탈출 | ★★★ | Advanced SQLi |

---

## 주요 기능

- 메인 페이지 타이핑 이펙트 및 난이도 표시
- 타임어택 모드 타이머 (밀리초 단위)
- 클라이언트 사이드 모드 전환 (localStorage)
- 모바일/PC 반응형 UI (Tailwind CSS)
- 문제별 독립 라우트 (`/challenge/[id]`)

---

## 기술 스택

| 분류 | 사용 기술 |
|---|---|
| Framework | Next.js 15 (App Router) · React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS 4 |
| Runtime | Node.js |

---

## 프로젝트 구조

```
.
├── app/
│   ├── page.tsx              # 메인 페이지 (모드 선택)
│   ├── layout.tsx            # 공통 레이아웃
│   ├── api/                  # 서버 라우트
│   └── challenge/
│       ├── 1/page.tsx        # 문제 1
│       ├── 2/page.tsx        # 문제 2
│       └── 3/page.tsx        # 문제 3
├── components/               # 공용 UI 컴포넌트
├── lib/
│   └── challenges.ts         # 문제 메타데이터
├── docs/
│   └── WALKTHROUGH.md        # 운영자/스태프 풀이 해설
└── public/                   # 정적 자산
```

---

## 로컬 실행

```bash
npm install
npm run dev
```

[http://localhost:3000](http://localhost:3000)에서 확인할 수 있습니다.
