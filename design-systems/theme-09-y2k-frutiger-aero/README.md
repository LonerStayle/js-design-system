# Aero — Y2K / Frutiger Aero 디자인 시스템

> 하늘·물·잎과 하이글로스 글래스. 2003년이 상상한 미래를 위한,
> 순수 CSS 토큰 + 바닐라 JS로 만든 프로덕션급 컴포넌트 라이브러리.

밝고 낙관적이며 청량한 **Frutiger Aero / Y2K** 미학을 코드로 옮긴 디자인 시스템입니다.
스카이 블루·아쿠아·라임 그린·화이트를 중심으로, 상단 화이트 샤인 + 하단 반사 + 가장자리
라이트 림으로 이루어진 "젖은 유리(wet glass)" 표면, 떠다니는 물방울, 잎사귀 액센트가
시그니처입니다. 외부 프레임워크 의존성은 **0** 입니다.

모든 HTML은 빌드 단계 없이 **더블클릭(`file://`)** 만으로 렌더링·동작합니다.

---

## 1. 빠른 시작

```
theme-09-y2k-frutiger-aero/
├── index.html          ← 여기부터 여세요 (허브: 히어로 + 토큰 + 컴포넌트 갤러리 + 페이지 링크)
├── tokens.css          원시 토큰 (색 램프, 글로스 효과, 스케일)
├── semantic.css        시맨틱 + 컴포넌트 토큰 (라이트/다크)
├── base.css            리셋, 타이포, 하늘/버블 배경, 레이아웃 유틸
├── components/         컴포넌트별 CSS (10개 파일)
├── app.js              모든 인터랙션 (바닐라 JS, 의존성 0)
├── pages/              실데모 화면 9종
├── README.md           이 문서
└── CHECKLIST.md        구현·접근성 자가점검 결과
```

새 페이지에서 사용하려면 **로드 순서**를 지켜 CSS를 불러오고, 마지막에 `app.js`를 넣습니다.

```html
<!-- 1) 토큰 → 2) 시맨틱 → 3) 베이스 → 4) 컴포넌트 -->
<link rel="stylesheet" href="tokens.css" />
<link rel="stylesheet" href="semantic.css" />
<link rel="stylesheet" href="base.css" />
<link rel="stylesheet" href="components/buttons.css" />
<link rel="stylesheet" href="components/forms.css" />
<link rel="stylesheet" href="components/forms-advanced.css" />
<link rel="stylesheet" href="components/card.css" />
<link rel="stylesheet" href="components/badge.css" />
<link rel="stylesheet" href="components/data-display.css" />
<link rel="stylesheet" href="components/overlay.css" />
<link rel="stylesheet" href="components/feedback.css" />
<link rel="stylesheet" href="components/nav.css" />
<link rel="stylesheet" href="components/carousel.css" />
<!-- ... 마크업 ... -->
<script src="app.js"></script>
```

배경 분위기를 켜려면 `<body>` 맨 위에:

```html
<div class="aero-sky" aria-hidden="true"></div>
<div class="aero-bubbles" data-bubbles="14" aria-hidden="true"></div>
```

---

## 2. 디자인 철학

| 축 | 선택 | 이유 |
|----|------|------|
| **무드** | 밝고 낙관적·청량·하이글로스 | 자연(물·하늘·잎)과 테크의 결합. 무채색·매트·날카로움을 금지합니다. |
| **색** | 스카이 블루 `#39B6FF` · 아쿠아 `#00D6C8` · 라임 `#9BE15D` · 화이트 | 맑은 하늘과 깨끗한 물의 색. 배경은 하늘 그라데이션 + 떠다니는 버블. |
| **표면** | 하이글로스 글래스 | 상단 강한 화이트 샤인 + 하단 은은한 반사 + 가장자리 라이트 림. 젤리 같은 반투명. |
| **타이포** | Mulish + Hind (휴머니스트 산세리프) | Frutiger 계열 대용. 둥글고 깔끔하며 친근한 위계. 오프라인 시 system humanist로 폴백. |
| **형태** | 중간~큰 라운드 (`--radius-md` 14px), 버튼은 알약형 | 매끈한 곡면. 날카로운 모서리 없음. |
| **모션** | 부드러운 부상(lift) + 샤인 강화, 아쿠아 글로우 포커스 | 호버 시 살짝 떠오르고 광택이 강해집니다. 포커스는 아쿠아 글로우 링. |

### 시그니처 요소
- **웹 2.0 글로시 배지/버튼** — 상단 샤인 + 하단 반사 + 라이트 림.
- **물방울/버블 모티프** — 배경에 떠오르는 반투명 버블 (`app.js`가 생성, reduced-motion 시 정지).
- **잎/풀 액센트 & 렌즈 플레어** — 인라인 SVG로 자연 친화 디테일.
- **아쿠아 글로우 포커스 링** — 모든 인터랙티브 요소에 또렷하게.

---

## 3. 토큰 레퍼런스

### 3.1 색 램프 (`tokens.css`)
각 램프는 `50`(가장 밝음) → `900`(가장 깊음).

| 램프 | 변수 | 베이스 | 용도 |
|------|------|--------|------|
| Sky | `--sky-50…900` | `--sky-500` `#39B6FF` | primary(주 색) · 하늘 분위기 |
| Aqua | `--aqua-50…900` | `--aqua-500` `#00D6C8` | accent · 포커스 글로우 · 물 |
| Lime | `--lime-50…900` | `--lime-400` `#9BE15D` | nature 액센트 · 잎 |
| Neutral | `--neutral-50…900` | — | 쿨 슬레이트(살짝 블루 틴트) 텍스트·보더 |

상태색: `--success-*` `--warning-*` `--danger-*` `--info-*` (각 400/500/600).

### 3.2 시그니처 효과 토큰
| 토큰 | 설명 |
|------|------|
| `--gloss-shine` | 상단 화이트 하이라이트 그라데이션 |
| `--gloss-reflection` | 하단 은은한 반사 |
| `--gloss-inset` | 내부 글로스 베벨 (밝은 상단 입술 + 하단 음영) |
| `--rim-light` | 가장자리 라이트 림 (inset box-shadow) |
| `--bubble-tint` | 단일 물방울/버블 채움 (radial) |
| `--bg-sky` | 페이지 하늘 그라데이션 (밝은 블루→화이트) |
| `--flare` | 코너 렌즈 플레어 |
| `--glow-aqua` / `--glow-sky` | 아쿠아/스카이 글로우 |

### 3.3 스케일
- **간격**: `--space-0 … --space-16` (0 → 10rem)
- **타이포**: `--text-2xs … --text-6xl`, `--leading-*`, `--tracking-*`, `--weight-*`
- **모서리**: `--radius-sm`(8) `--radius-md`(14) `--radius-lg`(22) `--radius-xl`(30) `--radius-2xl`(40) `--radius-full`(알약)
- **그림자**: `--shadow-xs/sm/md/lg/xl` (소프트 쿨 드롭) + 컬러 아우라 `--shadow-sky/aqua/lime`
- **포커스 링**: `--ring` (아쿠아 글로우), `--ring-width` `--ring-color` `--ring-offset`
- **모션**: `--ease-standard/emphasized/spring/out`, `--duration-fast/base/slow/slower`
- **z-index**: `--z-sticky/dropdown/drawer/modal/popover/toast/tooltip`
- **브레이크포인트**: `--bp-sm`(640) `--bp-md`(768) `--bp-lg`(1024) `--bp-xl`(1280) `--bp-2xl`(1536)

### 3.4 시맨틱 토큰 (`semantic.css`)
컴포넌트는 **원시 램프가 아니라 이 토큰만** 참조합니다.

`--color-bg` · `--color-surface` / `-2` / `-3` · `--color-text` / `-muted` / `-subtle` ·
`--color-primary` (=sky) / `-hover` / `-active` / `-soft` / `-fg` · `--color-accent` (=aqua) ·
`--color-leaf` (=lime) · `--color-border` / `-strong` / `-soft` · `--color-divider` ·
`--color-success/warning/danger/info` (+ `-soft` / `-fg`) · `--color-scrim`.

컴포넌트 토큰: `--btn-*` · `--card-*` · `--input-*` · `--nav-*` / `--sidebar-*` ·
`--toggle-*` · `--track-*` · `--table-*` · `--code-*` · `--tooltip-*` / `--popover-*`.

### 3.5 라이트/다크
- **라이트(기본)**: 밝은 하늘 + 글로시 화이트 글래스 표면.
- **다크 `[data-theme="dark"]`**: 딥 틸·네이비 물 위에 아쿠아 글로스.

다크는 `<html data-theme="dark">` 로 전환되며, `app.js`가 `[data-theme-toggle]` 버튼과
`localStorage('aero-theme')`로 자동 처리합니다. 컴포넌트가 시맨틱 토큰만 쓰기 때문에
별도 다크 스타일 없이 자동 대응됩니다.

---

## 4. 컴포넌트 목록

### 폼 (`buttons.css`, `forms.css`, `forms-advanced.css`)
Button(primary/secondary/ghost/danger/accent/icon × sm/md/lg × hover/active/disabled/loading),
ButtonGroup, Input, Textarea, Select, Field(label/hint/error), InputGroup, SearchBar,
Checkbox, Radio, Switch(젤리 토글), SegmentedControl, Slider(글로시 트랙), Stepper,
FileUpload, ChipInput, Rating, MultiSelect, Combobox/Autocomplete, DatePicker, Calendar.

### 표시 (`card.css`, `badge.css`, `data-display.css`)
Card(글로시) · CardHeader/Body/Footer/Media, StatCard(델타 ▲▼), Badge/Tag(웹2.0 글로시),
Avatar/AvatarGroup(상태 링), Table(정렬·선택·줄무늬·호버), List, Timeline, KanbanCard,
CodeBlock(복사), Skeleton, EmptyState, Accordion, Tabs.

### 피드백 / 오버레이 (`feedback.css`, `overlay.css`)
Alert/Banner, Toast(스택·aria-live), Modal/Dialog(아쿠아 글로스·포커스 트랩),
Drawer, CommandPalette(⌘K), Progress(바·원형), Spinner, InlineNotification,
Tooltip(속성형), Popover, Menu/Dropdown, ContextMenu.

### 내비 (`nav.css`, `carousel.css`)
Navbar(글로시 바·모바일 토글), Sidebar(접힘), Breadcrumb, Pagination, Steps/Wizard, Carousel.

> 컴포넌트별 정확한 클래스 이름과 상태는 각 `components/*.css` 파일 상단의 배너 주석을 참고하세요.

---

## 5. 인터랙션 (JS 훅)

`app.js`는 마크업의 `data-*` 속성을 읽어 동작을 연결합니다. 주요 훅:

| 기능 | 훅 |
|------|----|
| 테마 전환 | `[data-theme-toggle]` (→ `<html data-theme>`, localStorage 저장) |
| 버블 배경 | `<div class="aero-bubbles" data-bubbles="14">` |
| 모달 | `[data-modal-open="ID"]` / `.modal#ID[data-modal]` / `[data-modal-close]` (Esc·배경·포커스트랩) |
| 드로어 | `[data-drawer-open="ID"]` / `.drawer#ID[data-drawer]` |
| 토스트 | `[data-toast]` + `data-toast-msg` + `data-toast-variant` |
| 탭 | `[data-tabs]` + `[role=tab][aria-controls]` (방향키 이동) |
| 아코디언 | `[data-accordion]` (`data-accordion-single` 단일 개방) |
| 메뉴/드롭다운 | `[data-menu-trigger="ID"]` / `.menu#ID[data-menu]` |
| 컨텍스트 메뉴 | `[data-context-menu="ID"]` (우클릭) |
| 팝오버 | `[data-popover-trigger="ID"]` / `.popover#ID` |
| 커맨드 팔레트 | `[data-command-open]` 또는 ⌘K / Ctrl-K, `.command-palette[data-command-palette]` |
| 캐러셀 | `[data-carousel]` + `[data-carousel-prev/next]` (방향키·`data-autoplay`) |
| 테이블 | `th[data-sort]`, `[data-select-all]`, `[data-row-select]` |
| 슬라이더 값 | `input[type=range][data-slider]` + `[data-slider-value]` |
| 스텝퍼 | `[data-stepper]` + `[data-step-dec/inc]` + `[data-step-input]` |
| 별점 | `[data-rating][data-value]` |
| 칩 입력 | `[data-chip-input]` (Enter 추가, Backspace 삭제) |
| 콤보박스/멀티셀렉트 | `[data-combobox]` / `[data-multiselect]` |
| 가격 토글 | `[data-pricing-toggle]` + `.price[data-monthly][data-annual]` |
| 위저드 | `[data-wizard]` + `[data-wizard-prev/next]` + `.wizard__step` |
| 복사 | `[data-copy]` (+ `data-copy-target`) |
| 사이드바 접기 | `[data-sidebar-toggle]` |
| 모바일 내비 | `[data-nav-toggle]` |

프로그램적으로 토스트를 띄우려면: `window.Aero.toast('메시지', 'success')`.

---

## 6. 교체 / 커스터마이즈 가이드

이 시스템은 **3계층 토큰 구조**라 브랜드를 바꿔도 컴포넌트 코드를 건드릴 필요가 없습니다.

1. **색을 바꾸려면** → `tokens.css`의 램프 값만 교체하세요.
   예: 청록 대신 보라 액센트를 원하면 `--aqua-*` 값을 보라 계열로 바꾸면
   포커스 링·accent·토글·차트가 한 번에 따라옵니다.

2. **의미(역할)를 재배치하려면** → `semantic.css`에서 매핑을 바꾸세요.
   예: `--color-primary: var(--lime-500);` 로 두면 primary가 라임이 됩니다.

3. **글로스 강도를 조절하려면** → `--gloss-shine` / `--gloss-reflection` / `--gloss-inset`의
   alpha 값을 낮추면 더 차분해지고, 높이면 더 광택이 강해집니다.

4. **모서리/간격/타이포 톤** → `--radius-*`, `--space-*`, `--text-*`만 조정.

5. **다크 팔레트** → `semantic.css`의 `[data-theme="dark"]` 블록만 수정.

6. **모션을 끄려면** → 사용자가 OS에서 "동작 줄이기"를 켜면 자동으로 버블·반사·전환이
   멈춥니다(`prefers-reduced-motion`). 전역 강제 정지가 필요하면 `base.css`의 해당
   미디어 쿼리 규칙을 항상 적용으로 바꾸세요.

> 원칙: **컴포넌트 CSS는 시맨틱/컴포넌트 토큰만 참조**합니다. 하드코딩된 색은 장식용
> 그라데이션/SVG 내부에만 존재합니다. 그래서 토큰 한 곳만 바꿔도 전역에 반영됩니다.

---

## 7. 접근성

- 모든 인터랙티브 요소는 키보드로 조작 가능하며 **아쿠아 글로우 포커스 링**(`--ring`)이 또렷합니다.
- 다이얼로그/드로어/팔레트는 `role`, `aria-modal`, 포커스 트랩, Esc 닫기.
- 탭·아코디언·메뉴는 ARIA 패턴 + 방향키 내비게이션.
- 토스트/인라인 알림은 `aria-live="polite"`.
- **색만으로 상태를 전달하지 않습니다** — 성공/경고/오류는 항상 아이콘 또는 텍스트를 동반.
- 글로시 그라데이션 버튼 위 텍스트도 대비 4.5:1 이상을 유지합니다.
- `prefers-reduced-motion` 존중: 버블·반사·전환 애니메이션 정지.

자세한 점검 결과는 [CHECKLIST.md](CHECKLIST.md)를 참고하세요.

---

## 8. 기술 메모

- **외부 의존성 0** — 순수 CSS + 바닐라 JS. 아이콘은 모두 인라인 SVG.
- 폰트는 Google Fonts(Mulish/Hind)를 `@import` 하되, 오프라인에서는 system humanist로 폴백.
- `:has()`를 일부 폼 상태에 사용 — 현대 브라우저 지원. `.is-active`/`[aria-selected]` 폴백 제공.
- `backdrop-filter` 글래스 — 미지원 브라우저에서도 반투명 배경으로 우아하게 폴백.
```
