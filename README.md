# 🚀 00.NEW Base Template

향후 모든 프로젝트(웹앱, 게임, 대시보드, SaaS 등) 개발 시 범용 시작점으로 삼을 **궁극의 AI-인간 협업 스타터 템플릿**입니다.

---

## 🛠 Tech Stack

- **React 19**: 최신 버전의 React UI 라이브러리
- **React Router v7**: 직관적인 SPA 라우팅 및 중첩 레이아웃 아키텍처
- **Vite 8**: 초고속 개발 서버 & HMR 번들러
- **TypeScript 6**: 엄격한 정적 타입 검사 (`verbatimModuleSyntax`, `erasableSyntaxOnly`)
- **Tailwind CSS v4**: `@tailwindcss/vite` 기반 설정 파일 없는 초고속 모던 유틸리티 CSS
- **Sonner**: React 19 호환 초경량 글로벌 토스트 피드백 시스템
- **Vitest**: Vite 네이티브 초고속 단위 테스트 러너 (비즈니스 로직/연산/판단 검증)
- **Lucide Icons**: 최신 모던 SVG 아이콘 팩 (`lucide-react`)
- **cn Utility**: `clsx` + `tailwind-merge` 조건부 클래스 병합 유틸리티

---

## 🧩 Visual Scripting & Architecture Inspector (`http://localhost:5174/`)

프로젝트 내 모든 파일의 연결성과 흐름을 **단일 화면(Single-Screen) 블록형 아키텍처**로 시각화해 주는 듀얼 서버 시스템입니다.

1. **3단계 계층 구조 (Hierarchy)**:
   - **`[도메인/모듈 (Domain)]` ➡️ `[단위 기능 (Feature)]` ➡️ `[파이프라인 블록 (Phase)]`**
   - 상단 **도메인 빠른 필터 바** 및 **도메인별 원클릭 접기/펼치기(아코디언)** 지원으로 수십 개의 기능이 쌓여도 시각적 피로도 제로.
2. **실시간 미니 컴포넌트 프리뷰 (`👁️ LIVE PREVIEW`)**:
   - 텍스트나 파일명을 유추할 필요 없이, 실제 화면 속 버튼/컨트롤의 **살아있는 React 실물 미니어처**가 카드 안에 표시됩니다.
   - `src/components/`에 새 컴포넌트를 만들고 하단에 `MyComponent._previewProps = { ... }`를 선언하면 **Zero-Config 실물 프리뷰**가 동작합니다.
   - 프리뷰 렌더링 도중 예외가 발생해도 독립 ErrorBoundary가 격리하여 인스펙터 보드 전체의 안전을 보장합니다.
3. **인간 중심의 논리적 서순**:
   - 카드 표면에는 물리 파일명이 아닌 **본질과 기능 문장(`Sun/Moon 토글 버튼` / `트리거: 클릭`)**이 우선 노출됩니다.
   - 블록을 클릭하면 비로소 구현체 파일명(`ThemeToggle.tsx`), 코드 위치, 세부 주석, 다음 단계 연결 링크가 펼쳐집니다.
4. **저장소 입출력 허브 (Store Hub)**:
   - `localStorage` 등 저장소에 어디서 쓰고(Writes), 어디서 읽는지(Reads) 실시간 양방향 매핑을 제공합니다.

---

## ⚡ Quick Start & Commands

```bash
# 의존성 설치
npm install

# 서비스 앱(5173)과 아키텍처 인스펙터(5174) 동시 실행 (강력 추천)
npm run dev:all
```

---

## 🎯 새 프로젝트 시작 & 온보딩 가이드 (Zero-to-One Guide)

새로운 웹앱, 게임, 대시보드 프로젝트를 시작할 때 사람(개발자)과 AI가 거치는 표준 워크플로우입니다.

### 👤 1. 개발자(인간) 시작 3단계
1. **폴더 복사 & 프로젝트명 변경**:
   - `00.NEW Base` 폴더를 복사하여 새 이름(예: `01.MyMonsterGame`)으로 지정합니다.
   - `package.json`의 `"name"` 필드를 새 프로젝트명으로 변경합니다.
2. **첫 캔버스 정리 (Cleanup)**:
   - [src/pages/HomePage.tsx](file:///c:/Users/Dolveul/Desktop/Project/00.NEW%20Base/src/pages/HomePage.tsx)에서 불필요한 데모 섹션(인터랙션 데모, 기술 스택 카드 등)을 지우고 내 서비스의 첫 화면 레이아웃을 잡습니다.
   - [src/components/CounterDemo.tsx](file:///c:/Users/Dolveul/Desktop/Project/00.NEW%20Base/src/components/CounterDemo.tsx), [TechBadge.tsx](file:///c:/Users/Dolveul/Desktop/Project/00.NEW%20Base/src/components/TechBadge.tsx)는 **아키텍처 주석 및 실시간 프리뷰 작성 예시(Reference)**로 참고한 뒤 필요 없을 때 삭제합니다.
3. **듀얼 서버 실행**:
   - `npm run dev:all`을 실행하면 서비스 화면(`5173`)과 실시간 아키텍처 인스펙터(`5174`)가 나란히 열립니다.

### 🤖 2. AI 에이전트 협업 표준 프롬프트 & 루프
새 프로젝트를 맡은 AI에게 아래와 같이 첫 프롬프트를 전달하면 헌법에 따라 가장 정확하게 동작합니다:

> 💬 **권장 프롬프트 예시**:  
> *"이 프로젝트의 `AGENTS.md` 헌법에 따라 [몬스터 소환 및 인벤토리 시스템]을 구현해줘. 코드를 작성하기 전에 먼저 `implementation_plan.md`에 6단계 노드 파이프라인 표(`[도메인] ➡️ [기능] ➡️ 6단계 표`)를 작성해서 내 승인을 받아줘."*

**AI의 자동 행동 4단계 사이클**:
```text
[1. 기획 단계] ➡️ [2. 사용자 승인] ➡️ [3. 구현 & 주석] ➡️ [4. 기술 무결성 검증]
  implementation_plan.md        사전 승인 대기          파일 상단 @domain/@phase        lint + test + headless
  (6단계 파이프라인 표)         (임의 코드 수정 금지)     표준 JSDoc 필수 기재          (무결성 100% 확인 후 인계)
```

| 명령어 | 설명 |
| :--- | :--- |
| `npm run dev:all` | **서비스 앱(5173)과 인스펙터 보드(5174)를 동시에 실행** |
| `npm run dev` | 서비스 앱만 단독 실행 (`http://localhost:5173/`) |
| `npm run dev:admin` | 인스펙터 보드만 단독 실행 (`http://localhost:5174/`) (포트 충돌 시 자동 다음 포트 전환) |
| `npm run test` | Vitest 인터랙티브 감시 테스트 실행 |
| `npm run test:run` | **Vitest 1회성 전체 단위 테스트 실행** |
| `npm run lint` | **초고속 코드 린트(`oxlint`) + 아키텍처 주석 검증(`lint:arch`) 연쇄 실행** |
| `npm run lint:arch` | 소스 파일 내 `@domain`, `@feature`, `@phase` 주석 누락 기계적 검증 (테스트 파일 자동 제외) |
| `npm run build` | TypeScript 검사 (`tsc -b`), 300줄 응집도 점검 및 프로덕션 빌드 |
| `npm run check:headless` | 시스템 브라우저를 백그라운드 헤드리스로 띄워 런타임/콘솔 오류 자동 점검 |
| `npm run preview` | 프로덕션 빌드 결과물 로컬 미리보기 |

---

## 📋 핵심 개발 원칙 & 규칙 (`AGENTS.md` & `GEMINI.md`)

1. **글자 깨짐 방지 & UTF-8 표준화**:
   - `.editorconfig`, `.gitattributes`, `.vscode/settings.json`을 통해 모든 코드와 마크다운의 인코딩을 UTF-8(LF)로 통일했습니다.
2. **계획서 6단계 파이프라인 표 의무화**:
   - AI 에이전트는 `implementation_plan.md` 작성 시 반드시 `[도메인] ➡️ [기능] ➡️ 6단계 노드 파이프라인 표`를 명시하여 사전 승인을 받아야 합니다.
3. **아키텍처 주석 자동 검증 (`npm run lint`)**:
   - 파일 상단에 `@domain`, `@feature`, `@phase` (입력/판단/연산/API/저장소/출력) 주석이 누락되면 린트/빌드가 실패하도록 기계적으로 강제됩니다.
4. **글로벌 에러 바운더리 & 토스트 기본 탑재**:
   - 런타임 에러 복구를 위한 `ErrorBoundary` 및 인터랙션 알림을 위한 `sonner` 토스트가 최상위에 기본 통합되어 있습니다.
5. **라우터 기반 페이지 분리 (`src/pages/`)**:
   - 멀티 페이지 개발 시 `src/pages/` 디렉토리에 뷰를 구성하고 `src/router/AppRouter.tsx`에 라우트를 등록합니다.
6. **단위 테스트 자동 검증 (`npm run test:run`)**:
   - 비즈니스 연산 및 판단 로직은 Vitest 단위 테스트(`*.test.ts`)로 사전에 검증합니다.
7. **수동 검증 사용자 전담 원칙**:
   - 실제 인터랙션 체감, 디자인 감각, 세부 사용성 테스트는 **사용자가 직접 수행**하며, AI 에이전트는 기술적 무결성(빌드/린트/테스트/콘솔 에러 0건)만을 검증하고 사용자에게 인계합니다.
8. **안전한 Git 푸쉬 (사전 승인 필수)**:
   - `git push`는 항상 사용자에게 변경 내역 설명 후 명시적 허가를 얻은 뒤에만 실행합니다.

---

## 📁 Directory Structure

```text
00.NEW Base/
├── dev-admin/              # 아키텍처 & 파이프라인 인스펙터 서버 및 대시보드
│   ├── public/             # 인스펙터 프론트엔드 (index.html, style.css, app.js)
│   └── server.mjs          # Node HTTP + SSE 실시간 주석 파서 서버 (포트 5174, 충돌 방지 지원)
├── scripts/
│   ├── check-architecture-annotations.mjs  # 필수 JSDoc 주석 자동 린터 (테스트 파일 예외)
│   └── headless-check.mjs                 # 시스템 브라우저 헤드리스 무결성 점검
├── src/
│   ├── components/         # 재사용 가능한 컴포넌트 (ThemeToggle, CounterDemo, TechBadge)
│   │   └── ui/             # 공통 시스템 UI 컴포넌트 (ErrorBoundary)
│   ├── hooks/              # 비즈니스 로직 훅 (useTheme)
│   ├── lib/
│   │   ├── utils.ts        # cn() 클래스네임 병합 유틸리티
│   │   └── utils.test.ts   # Vitest 단위 테스트
│   ├── pages/              # 라우트 페이지 뷰 (HomePage, NotFoundPage)
│   ├── router/             # 라우팅 매핑 정의 (AppRouter.tsx)
│   ├── App.tsx             # 최상위 셸 (ErrorBoundary + Toaster + AppRouter)
│   ├── PreviewHost.tsx     # 컴포넌트 실시간 미니 프리뷰 호스트 (에러 격리 & _previewProps)
│   ├── index.css           # Tailwind CSS 진입점
│   └── main.tsx            # React 마운트 진입점 (?preview= 분기 지원)
├── AGENTS.md               # AI 에이전트 공통 행동 규칙 및 아키텍처 헌법
├── GEMINI.md               # IDE 시스템 최상위 에이전트 가이드라인
├── vite.config.ts          # Vite 설정 (Tailwind v4, @ 별칭, 300줄 경고 플러그인, host 개방)
└── package.json
```
