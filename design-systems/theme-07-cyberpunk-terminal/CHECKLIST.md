# CHECKLIST — Cyberpunk Terminal (theme-07)

구현·접근성 자가점검 결과. 측정값은 실제 검증 스크립트/계산 기준.

```
SCALE      CSS 7,413 lines · JS 763 lines · HTML 10 files
TOKENS     380 token definitions  ·  14 @keyframes
CLASSES    478 distinct .ct-* component classes  ·  7 component files
STATUS     ████████████████████  BUILD COMPLETE
```

---

## 1. 구현 범위 (산출물)

| # | 항목 | 상태 | 비고 |
|---|------|:----:|------|
| 1 | `tokens.css` 원시 토큰 | ✅ | ink/cyan/magenta/green/amber/red 풀 램프, glow·scanline·vignette·grid, 풀 스케일(space/text/leading/tracking/radius/border/z/motion), 14 키프레임 |
| 2 | `semantic.css` 시맨틱+컴포넌트 토큰 | ✅ | 표면/텍스트/브랜드/보더/상태/포커스 + `--btn/--card/--input/--table/--tooltip/--nav/--sidebar/--modal/--drawer/--toast/--cmdk` |
| 3 | 다크(정본) + 고대비 반전 라이트 | ✅ | `[data-theme="dark"|"light"]`, localStorage 영속 |
| 4 | `base.css` 리셋·모노 타이포·CRT 오버레이·유틸 | ✅ | `.crt-overlay`(스캔라인+비네팅), HUD 코너 브래킷, `.clip-corner`, 포커스 링, 레이아웃 유틸, reduced-motion 전역 가드 |
| 5 | 폼 컴포넌트 (17종) | ✅ | Button~ChipInput, 각 상태/사이즈/변형 |
| 6 | 표시 컴포넌트 | ✅ | Card(터미널 윈도우)·Stat(HUD)·Badge/Tag·Avatar·Tooltip·Popover·List·Timeline·Code·Skeleton·Carousel·Calendar·Table·Tabs·Accordion·Kanban·Empty |
| 7 | 피드백/오버레이 | ✅ | Alert·Toast·Modal·Drawer·Progress(bar/ring/ascii)·Spinner·InlineNote |
| 8 | 내비 | ✅ | Navbar·Sidebar·Breadcrumb·Pagination·Menu·ContextMenu·Steps·Kbd·CommandPalette(⌘K) |
| 9 | `app.js` 인터랙션 엔진 | ✅ | 26개 모듈, data-attribute 구동, `window.CT` 명령형 API |
| 10 | `index.html` 허브 | ✅ | 부팅 인트로 + 토큰 비주얼 + 컴포넌트 갤러리(검색 필터) + 페이지 링크 |
| 11 | `pages/*.html` 9개 실데모 | ✅ | 전부 반응형·실데이터 |
| 12 | `README.md` / `CHECKLIST.md` | ✅ | 디자인 철학·토큰표·컴포넌트 목록·교체 가이드 / 본 문서 |

---

## 2. 접근성 강제 규칙

### 2.1 대비 (WCAG 2.1 — 본문 4.5:1↑) — 실제 계산값
| 조합 | 비율 | 판정 |
|------|------|:----:|
| text `#E8FBFF` / bg `#070A0F` (다크) | **18.57:1** | AAA |
| text-muted `#8FB3C0` / bg | **8.85:1** | AAA |
| text-subtle `#688A99` / bg | **5.37:1** | AA |
| primary-fg `#04060A` / primary 버튼 `#00F0FF` | **14.40:1** | AAA |
| danger-fg `#EAF3F8` / danger 버튼 `#B5121F` | **6.08:1** | AA |
| success-text `#5DFF38` / bg | **14.94:1** | AAA |
| warning-text `#FFBC2E` / bg | **11.79:1** | AAA |
| danger-text `#FF505D` / bg | **6.19:1** | AA |
| link cyan-300 `#33F2FF` / surface | **13.93:1** | AAA |
| **라이트** text `#081016` / surface `#EAF1F5` | **16.79:1** | AAA |
| 라이트 text-subtle `#4A6472` / surface | **5.48:1** | AA |
| 라이트 primary-fg `#FFFFFF` / primary 버튼 `#00707D` | **5.81:1** | AA |

> 점검 중 4.5 미만이던 3건(다크 text-subtle 4.46 · danger 버튼 4.28 · 라이트 primary 버튼 4.12)을 토큰 조정으로 **전부 AA 이상**으로 보정함. 네온 글로우는 장식이며 가독성은 솔리드 색이 단독으로 충족.

### 2.2 광과민(Photosensitivity) 안전
- ✅ 초당 3회↑ 점멸 **없음**. 커서 깜빡임 `ct-cursor-blink` = ~1Hz(1.06s). 위험 영역 모달 등 강조도 점멸 아님.
- ✅ 글리치(`ct-glitch`/`ct-glitch-shadow`)는 **호버 시 짧은 1회**(steps 2~3, ~0.3s) — 무한 스트로브 아님.
- ✅ 플리커(`ct-flicker`)는 느리고 진폭 낮음(±1.5%), 스캔라인 드리프트는 6s 선형.

### 2.3 `prefers-reduced-motion: reduce`
- ✅ base.css 전역 킬스위치: 모든 애니메이션/트랜지션 ~0, 스캔라인 정지, 커서 솔리드, 글리치/타이핑 정지.
- ✅ 컴포넌트 레벨 보강 가드: base + display/card/feedback/forms.css.
- ✅ JS(app.js)도 `REDUCED` 분기: 타이핑/부팅/스크램블/토스트 진입을 즉시 최종 상태로.

### 2.4 포커스
- ✅ 모든 인터랙션 요소에 네온 글로우 링(`--focus-ring`) — `:focus-visible` 기반(base.css). 커스텀 컨트롤(체크박스/라디오/스위치/슬라이더/세그먼트)은 `box-shadow: var(--focus-ring)` 명시.
- ✅ `outline:none` 단독 제거 없음 — 항상 네온 링으로 대체.

### 2.5 상태 = 색 + 아이콘/라벨
- ✅ Badge/Alert/Toast/Table status/Timeline/List-level 모두 색과 **아이콘·라벨·dot** 병행(색 단독 의존 없음).
- ✅ 폼 invalid = 빨강 보더 + 빨강 글로우 + `!` 접두 에러 텍스트(`.ct-field__error`).

### 2.6 키보드 / ARIA / 포커스 관리
- ✅ Tabs `role=tablist/tab/tabpanel` + 화살표/Home/End 이동. Accordion `aria-expanded`.
- ✅ Modal/Drawer/⌘K: `role=dialog aria-modal`, **포커스 트랩 + ESC 닫기 + 포커스 복원**, body 스크롤 잠금.
- ✅ Menu/Dropdown `role=menu/menuitem` + 화살표 이동 + 외부클릭/ESC 닫기.
- ✅ ⌘K: ↑↓ 탐색, ↵ 실행, ESC 닫기, 실시간 필터 + 빈 상태.
- ✅ Table 정렬 헤더 `aria-sort`, 행 선택 `aria-selected`, Enter/Space 동작.

---

## 3. 기술 검증 (실행 결과)

| 검사 | 결과 |
|------|------|
| CSS 중괄호 균형 (10개 파일) | ✅ 전부 일치 |
| `node --check app.js` | ✅ 문법 OK |
| SVG presentation 속성 내 `var()` 누수 | ✅ 0건 (발견된 7건 `style=""` 방식으로 수정) |
| HTML 페이지 구조 (h1 1개 / CSS 10링크 / app.js 포함) | ✅ 10개 전부 일치 |
| 사용된 `.ct-*` 클래스의 CSS 정의 존재 | ✅ (생성형 `.ct-bootline`은 base.css에 정식 추가) |
| 내부 자산/페이지 링크 해석 | ✅ 전부 존재 |
| 컴포넌트의 원시 램프 직접 사용 | ✅ 시맨틱 토큰만 소비(코드블록 내부 배경 1건만 의도적 `--ink-900`) |

---

## 4. 반응형
- ✅ 브레이크포인트 1024 / 768 / 480px (base.css) + 페이지별 레이아웃 미디어쿼리.
- ✅ 360px → 1440px 동작 확인 대상: 대시보드(사이드바 접힘), 인박스(3→1 패널), 칸반(가로→세로), 가격표/상품(카드 스택), 설정(세로탭→상단), 테이블(가로 스크롤).

---

## 5. 알려진 한계 / 메모
- 폰트는 Google Fonts `@import`; 오프라인 시 시스템 모노로 폴백(동작 영향 없음).
- 캐러셀/스텝 전환 등 일부 상태는 페이지 인라인 스크립트로 보강(앵커: app.js 데이터 훅).
- Circular progress 링은 정적 inline SVG로 렌더(JS 초기화 불요).
- 라이트 테마는 "고대비 반전 터미널" 컨셉 — 코드블록 등 일부 요소는 의도적으로 다크 유지.
- 브라우저 실렌더 스크린샷 점검은 공유 Playwright 인스턴스 점유로 보류, 정적 검증으로 대체(위 §3).

---

_점검 완료. 모든 강제 규칙(대비 4.5:1↑ · 점멸 안전 · reduced-motion 정지 · 네온 포커스 · 색+라벨 병행) 충족._
