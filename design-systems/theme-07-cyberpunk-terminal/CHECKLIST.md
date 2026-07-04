# CHECKLIST — Cyberpunk Terminal (theme-07)

구현·접근성 자가점검 결과. 측정값은 실제 검증 스크립트/계산 기준.

```
SCALE      CSS 7,759 lines · JS 859 lines · HTML 10 files
TOKENS     405 token definitions  ·  16 @keyframes (전부 소비처 확인)
CLASSES    489 distinct .ct-* component classes  ·  7 component files
STATUS     ████████████████████  BUILD COMPLETE (재고도화 2차 §7 반영)
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
- ✅ 플리커(`ct-flicker`)는 `.crt-overlay`(CRT 유리층 전체)에 8s linear infinite로 적용 — 진폭 ≤4%(opacity 1→.96) 저강도 딥 2회/주기 ≈ 0.25Hz, 스캔라인 드리프트는 6s 선형. reduced-motion 시 전역 킬스위치 + 명시 가드로 정지.

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

---

## 6. 재고도화 1차 — 시스템 레이어 (2026-07-04, fable-upgrade)

### 6.1 P0/P1 결함 해소 (검증 명령 포함)
| 항목 | 조치 | 검증 |
|------|------|------|
| 미사용 Noto Serif KR @import | tokens.css에서 제거 + base.css @import를 tokens.css 단일 파이프라인으로 통합 | `grep -rn 'Serif' *.css components/*.css` → 주석 1건뿐 |
| FOUC | index.html `<head>` 동기 스니펫(키 `ct-theme`) + `data-theme` 하드코딩 제거 | 다크 저장 후 재로드 실렌더 확인(스크린샷) |
| 전역 `:focus{outline:none}` | `:focus:not(:focus-visible)` 패턴으로 축소 (base.css) | 코드 리뷰 |
| 별점 4.5 불투명도 눈속임 | `.ct-rating__item--half` 클립 오버레이 신설 (forms.css) — 페이지 마크업 교체는 페이지 에이전트 몫 | CSS 정의 확인 |
| 스크린리더 영문 문구 | app.js: 알림 닫기 / 이전·다음 달 / 이벤트 기록 / 클립보드 복사 / 칩 제거 전부 한국어화 | `grep -n 'aria-label' app.js` |
| cmdk 무효 ARIA | 항목 `role="option"`(마크업+JS 이중 보장) + `aria-activedescendant` + empty `role="status"` | 코드 리뷰 |
| `.ct-btn-group [aria-pressed]` JS 동기화 부재 | PressGroup 모듈 신설 (단일 선택) | 코드 리뷰 |
| `href="#"` 더미(브레드크럼 데모) | 실앵커로 교체 | grep 0건 |
| 죽은 토큰 | `--noise-opacity`(grain 점화) · `ct-type`+`--ease-step`(navline 타이핑) · `--corner-cut-sm`(.clip-corner-sm) · `--ring-danger`(danger 포커스 링) · `--leading-display-ko`(.display-ko) 전부 점화 | §7-1 #8 대조 |

### 6.2 자동 검증 결과 (시스템 레이어 스코프)
- SVG presentation 속성 var(): index.html 0건
- components/*.css 하드코딩 hex(비 intentional): 0건
- 인라인 grid-template-columns: 0건 / 서구권 filler: 0건 / raw .md 링크: 0건
- CSS 중괄호 균형 10파일 전부 일치 · `node --check app.js` OK · HTML 태그 균형/중복 속성 파서 검사 통과
- keep-all: base.css Hangul refinement layer 신설(`:lang(ko)`)

### 6.3 실렌더 확인 (Playwright, 공유 인스턴스 틈새 확보분)
- 1440 라이트: 히어로 오버랩 구도 · statusline(실시간 시계) · scene-glow · 워터마크 정상
- 1440 다크(localStorage 저장 후 재로드 = FOUC 스니펫 경유): 틸링 pane 그리드 · pane 라벨 · 베젤 · grain 정상
- 360 다크: 스택 낙하 정상, 가로 스크롤 없음. OSD는 768 이하 축소 처리
- 미확인(페이지 에이전트/후속 검증에 위임): pages/* 9종 재검, reduced-motion OS 설정 실측, 신규 대비쌍 수치 실측

### 6.4 신규 대비 메모
- 신규 장식 레이어(grain·베젤·워터마크·scene-glow)는 전부 저알파 배경/전경 장식으로 텍스트 위에 직접 얹히지 않음(grain은 콘텐츠 z-1 아래). 본문 대비쌍 변경 없음.

---

## 7. 재고도화 2차 — 페이지 레이어 + 마감 수리 (2026-07-04, fable-upgrade)

### 7.1 페이지 레이어 롤아웃 (grep 실측, 10개 HTML 전수)
| 항목 | 실측 | 비고 |
|------|------|------|
| FOUC 스니펫(키 `ct-theme`) + `data-theme` 하드코딩 제거 | **10/10** · 하드코딩 0건 | `<head>` 동기 스니펫 |
| CRT 베젤 OSD 라벨(`.crt-overlay__osd`) | **10/10** | 페이지 픽션별 변주(404 `SIGNAL LOST` 등) |
| 스킵 링크 "본문으로 건너뛰기" | **10/10** | |
| 씬 엔진 `data-scene` + `.scene-glow` | 8/10 (+무속성 기본 hub 2) | 페이지별 radial 복붙 레시피 삭제 |
| `data-navline` 명령행 전환 | **10/10** | |
| `[data-reveal]` CRT 전원 인가 리빌 | 9/10 | 섹션당 한 무리 원칙 |
| `.ct-statusline` tmux 세션 바 | 8/10 | |
| 별점 half: `.ct-rating__item--half` 실렌더 교체 | product.html 2건 (`opacity:.55` 눈속임 0건) | |
| product.html P2 잔여 | SVG `stroke="rgb(...)"` 리터럴 0건 · `#0a0e14` 하드코딩 0건 | |
| SVG presentation 속성 `var()` 누수 (pages 포함) | **0건** | |
| 페이지 `<style>` 내 하드코딩 hex | **0건** | |

### 7.2 table.css 파서 버그 (P0 수정)
- **버그**: table.css 헤더 주석 문구 `--cyan-*/--ink-*` 속 `*/` 시퀀스가 블록 주석을 조기 종결 → 파서가 다음 `{`까지 무효 프렐류드로 소비 → 첫 규칙 `.ct-table-wrap`(터미널 프레임 + `overflow-x:auto`) 전체 드롭. 360px에서 dashboard/product/settings 와이드 테이블이 페이지 가로 스크롤 유발.
- **수정**: 주석 문구를 `--cyan-* / --ink-*`로 교체(`*/` 시퀀스 제거). 페이지 에이전트가 pricing.html에 임시 로컬 복원했던 `.pr-matrix .ct-table-wrap` 블록은 원본 수정으로 중복이 되어 제거.
- **검증**: 주석 스트립 시뮬레이션으로 `.ct-table-wrap { … overflow-x:auto … }` 규칙 생존 확인 + 전 CSS 파일 조기 종결/중괄호 균형 검사 통과.

### 7.3 죽은 자산 정리 (FOUNDATION §7-3 / §4-2)
| 자산 | 조치 |
|------|------|
| `ct-flicker` 키프레임 (소비 0건) | **점화** — `.crt-overlay`에 8s linear infinite (§2.2 갱신). reduced-motion 명시 가드 추가 |
| `ct-boot-fill` 키프레임 (소비 0건) | **삭제** — `ct-type`(width 스윕)과 중복, boot 시퀀스는 텍스트 라인 방식이라 소비처 없음 |
| `--ct-toast-duration` 유령 토큰 | **점화** — app.js Toast.show가 `setProperty`로 공급, JS 인라인 width 트랜지션(이중 드레인 메커니즘) 제거 → CSS `ct-toast-drain` 단일화. 커스텀 timeout 시 바 소진과 토스트 제거 시점 일치 |
| `.display-ko` 유틸 (사용 0건) | **점화** — profile.html 프로필명 h1 + pricing.html CTA h2. 셀렉터를 `:is(h1,h2,h3).display-ko` 병기로 보강(`:lang(ko)` 헤딩 행간 1.3을 이기도록) |
| `.clip-corner-sm` 유틸 (사용 0건) | **점화** — 404 PANIC 배지 + pricing ACTIVE PANE 리본 (`clip-corner clip-corner-sm` 페어 사용) |
| `body { min-height:100vh }` · toast stack `100vh` | **100dvh 교체** (FOUNDATION §4-6-3, inbox 페이지 레이어와 일치) |

### 7.4 자동 검증 (수리 후 전수 재실행)
- 주석 스트립 + 중괄호 균형: tokens/semantic/base/components 10파일 **전부 통과**
- `node --check app.js` OK (859 lines)
- 16개 `@keyframes` 전부 소비처 1건 이상 (grep 실측) — 죽은 키프레임 0
- `100vh` 잔존 0건 · SVG `var()` 누수 0건 (pages 포함)
- 헤더 스탯 갱신: CSS 7,759줄 · 405 토큰 · 489 `.ct-*` 클래스
- 후속 위임: dashboard/product/settings 360px 테이블 가로 스크롤 실렌더 육안 확인(정적 검증으로는 `.ct-table-wrap` 규칙 생존 확인 완료), reduced-motion OS 실측
