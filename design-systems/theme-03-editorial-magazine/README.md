# The Editorial — Editorial Magazine 디자인 시스템 (Theme N°03)

> 잡지의 스프레드를 화면으로. 종이 크림빛 배경 위 잉크빛 활자, 그리고 단 하나의 절제된 버건디.
> 외부 프레임워크 0 · 순수 CSS 변수 + 바닐라 JS · 모든 HTML 은 더블클릭(`file://`)만으로 렌더·동작.

---

## 1. 디자인 철학

인쇄 매체의 가장 큰 미덕은 **제약**이다. 정해진 판형·단·여백 안에서 위계는 색이 아니라 **타이포그래피와 공간**으로 세워진다. 이 시스템은 그 절제를 토큰으로 강제한다.

| 원칙 | 구현 |
|------|------|
| **위계는 타이포로** | 고대비 세리프 디스플레이(Fraunces) + 가독 세리프 본문(Newsreader) + 산세 스몰캡스 라벨(Inter). 색이 아니라 크기·굵기·위치로 강조. |
| **색은 절제** | 종이 크림(`#F7F3EC`) · 잉크 블랙(`#1A1714`) · **단 하나의 액센트** 딥 크림슨/버건디(`#8E2A2A`). 나머지는 따뜻한 세피아 그레이 + 채도 낮은 잉크톤 상태색. |
| **인쇄물의 형태** | 모서리 거의 0(`--radius-md` = 2px) · 그림자는 종이 한 장 두께의 미세 소프트만 · 1px 헤어라인 룰로 섹션 구분. |
| **에디토리얼 시그니처** | 드롭캡 · 풀쿼트 · 키커/바이라인 스몰캡스 · 멀티컬럼 + 하이픈네이션 · 피겨 캡션 · 대형 에디토리얼 넘버 · 비대칭 매거진 레이아웃. |
| **종이 질감** | 배경에 인라인 SVG fractalNoise 그레인을 아주 옅게 합성(다크/라이트 자동 조정). |

---

## 2. 파일 구조

```
theme-03-editorial-magazine/
├─ tokens.css          원시 토큰 — 색 램프·스케일·모션 (값의 단일 출처)
├─ semantic.css        시맨틱 + 컴포넌트 토큰 (tokens 참조, 라이트/다크)
├─ base.css            리셋·타이포 위계·멀티컬럼/매거진 유틸·접근성
├─ components/
│  ├─ index.css        전체 컴포넌트 묶음(@import) — HTML 은 이 한 줄만 링크
│  ├─ buttons.css      Button · ButtonGroup
│  ├─ forms.css        Input/Textarea/Select/Check/Radio/Switch/Segmented/Slider/Stepper/FileUpload/SearchBar/Rating/ChipInput/Combobox/DatePicker
│  ├─ display.css      Card/StatCard/Badge/Avatar/List/Timeline/KanbanCard/CodeBlock/Skeleton/EmptyState/Calendar/Carousel/Progress/Spinner
│  ├─ table.css        Table(정렬·선택·페이지네이션) · Pagination
│  ├─ tabs-accordion.css   Tabs · Accordion
│  ├─ magazine.css     ArticleHeader/PullQuote/DropCap/Figure/Blockquote/SectionHead/Masthead/Footnote
│  ├─ overlays.css     Alert/Banner/Toast/Modal/Drawer/CommandPalette/Tooltip/Popover/InlineNotification
│  ├─ navigation.css   Navbar/Sidebar/Breadcrumb/Menu/ContextMenu/Steps·Wizard
│  ├─ charts.css       BarChart/LineChart/Donut/Sparkline/Hbar/Legend (순수 CSS·SVG)
│  └─ layout.css       AppShell/PageHead/Kanban/Inbox/Pricing/Product/Settings/Profile/404/Gallery
├─ app.js              모든 인터랙션 + 테마 전환 (data-* 자동 바인딩)
├─ index.html          허브 — 표지·타이포/컬러 토큰·컴포넌트 갤러리·데모 링크
├─ pages/              실데모 10종 (아래 §6)
├─ README.md           (이 문서)
└─ CHECKLIST.md        구현·접근성 자가점검 결과
```

### HTML 에서 불러오는 법
```html
<head>
  <!-- 글꼴: 오프라인이면 Georgia/system 으로 우아하게 폴백 -->
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..900;1,9..144,300..900&family=Newsreader:ital,opsz,wght@0,6..72,300..700;1,6..72,300..600&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="tokens.css">
  <link rel="stylesheet" href="semantic.css">
  <link rel="stylesheet" href="base.css">
  <link rel="stylesheet" href="components/index.css">
</head>
<body>
  ... 마크업 ...
  <script src="app.js"></script>
</body>
```
> `pages/` 안에서는 경로를 `../tokens.css` … `../app.js` 로 쓴다.

---

## 3. 토큰 레퍼런스

### 3.1 색 램프 (tokens.css)
| 그룹 | 토큰 | 비고 |
|------|------|------|
| Warm Neutral | `--warm-neutral-50` … `--warm-neutral-950` (11단계) | 세피아 기운 종이→잉크. `100`=종이 크림, `950`=잉크 블랙 |
| Crimson | `--crimson-50` … `--crimson-950` (11단계) | 유일한 액센트. `600`=`#8E2A2A` 프라이머리 |
| 잉크톤 상태 | `--ink-green-*` `--ink-amber-*` `--ink-blue-*` | success/warning/info — 전부 저채도 |

### 3.2 스케일
| 종류 | 토큰 |
|------|------|
| 간격 | `--space-0` … `--space-16` (0 → 20rem, 넉넉한 에디토리얼 마진) |
| 타이포 크기 | `--text-2xs`(11px) … `--text-7xl`(120px) |
| 줄높이 | `--leading-none/tight/snug/normal/relaxed(본문)/loose` |
| 자간 | `--tracking-tighter` … `--tracking-widest`(0.2em, 스몰캡스) |
| 굵기 | `--weight-light` … `--weight-black` |
| 보더 | `--border-1`(헤어라인) `--border-2` `--border-3` |
| 모서리 | `--radius-sm/md(2px)/lg/full` |
| 그림자 | `--shadow-xs/sm/md` (미세 소프트만) |
| 모션 | `--ease-standard/emphasized/out` · `--duration-fast(130)/base(240)/slow(420)` |
| 컬럼 | `--columns`(3) · `--column-gap` · `--measure`(가독 폭) |
| z-index | `--z-dropdown/sticky/drawer/modal/popover/toast/tooltip` |

### 3.3 시맨틱 (semantic.css — 라이트/다크 자동)
`--color-bg` · `surface` · `surface-2` · `text` · `text-muted` · `text-subtle` ·
`primary`(=버건디) · `primary-fg` · `primary-soft` · `accent` · `link` ·
`border`(=헤어라인) · `border-strong` · `rule` ·
`success` · `warning` · `danger` · `info` (+ 각 `-bg`/`-fg`) · `overlay` · `selection-*`.

컴포넌트 토큰: `--btn-*` · `--card-*` · `--input-*` · `--badge-*` · `--table-*` · `--nav-height` · `--sidebar-width` · `--toast-width` 등.

---

## 4. 컴포넌트 목록 (60+)

- **폼** — Button(primary/secondary/ghost/danger/icon × sm/md/lg × hover/active/disabled/loading), ButtonGroup, Input, Textarea, Select, MultiSelect/Combobox(Autocomplete), Checkbox, Radio, Toggle/Switch, SegmentedControl, Slider, Stepper, DatePicker(입력), FileUpload(드롭존), SearchBar, Rating, ChipInput.
- **표시** — Card/StatCard/ArticleCard, Badge/Tag, Avatar/AvatarGroup, List/DefList, Timeline, KanbanCard, CodeBlock, Skeleton, EmptyState, Calendar, Carousel, Progress(바/원형), Spinner, Donut.
- **매거진 특화** — ArticleHeader(키커+제목+디크+바이라인), PullQuote(+aside 변형), DropCap 단락, FigureWithCaption, BlockquoteCitation, SectionHead(대형 넘버), Masthead, Footnote.
- **피드백/오버레이** — Alert/Banner(success/warning/danger/info), Toast(스택), Modal/Dialog, Drawer, CommandPalette(⌘K), Tooltip, Popover, InlineNotification.
- **내비** — Navbar, Sidebar(접힘/모바일), Breadcrumb, Pagination, Menu/Dropdown, ContextMenu, Steps/Wizard.
- **차트** — BarChart, LineChart(SVG), Donut, Hbar(랭킹), Sparkline, Legend.

### app.js 인터랙션 (data-* 훅, 자동 바인딩)
`data-theme-toggle` · `data-tabs`(role=tab/tabpanel) · `data-accordion="single"` · 모달(`data-modal-open="id"`/`data-modal-close`) · 드로어(`data-drawer-open/close`) · 토스트(`data-toast="success|danger|info"` + `-title`/`-text`, 또는 `window.emToast({...})`) · 메뉴(`data-menu-trigger`) · 팝오버(`data-popover-trigger`) · 커맨드팔레트(`data-cmdk` + `data-cmdk-open`, ⌘K/Ctrl K) · 사이드바(`data-sidebar-toggle="id"`) · `.segmented` · `.stepper`(`data-step-dec/inc`) · `.slider`(`data-slider-value`, `data-format`) · `.rating` · `.chipinput` · `data-combobox` · `.fileupload`(드래그) · `.searchbar`(clear) · `data-carousel`(`data-carousel-prev/next`) · 칸반 DnD(`data-kanban`) · 테이블(`data-sortable`/`data-selectable`) · 가격 토글(`data-pricing-toggle` + `data-price-monthly`/`data-price-annual`) · 컨텍스트메뉴(`data-context-menu="id"`) · `data-copy` · `data-reveal`(스크롤 인뷰) · `data-reading-progress` · `data-back-to-top` · `data-year` · `data-dismiss`.

---

## 5. 테마 / 교체 가이드

### 라이트 ↔ 다크
`<html data-theme="light|dark">`. `app.js` 의 `Theme` 가 첫 로드 시 `localStorage` → OS 선호를 읽어 자동 적용하고, `[data-theme-toggle]` 버튼이 토글한다. 깜빡임 없이 즉시 적용된다.

### 액센트 색 바꾸기
`semantic.css` 의 `--color-primary` (와 `-strong`/`-soft`/`-fg`) 한 곳만 바꾸면 전 컴포넌트에 전파된다. 예: 잉크 블루 계열로 바꾸려면
```css
:root { --color-primary: #2C3D4B; --color-primary-strong: #1f2c37; --color-primary-soft:#DCE2E6; }
```
> 단, 이 테마의 정체성은 **단일 버건디**다. 다른 액센트로 바꾸면 무드가 달라진다.

### 글꼴 교체
`tokens.css` 의 `--font-display` / `--font-serif` / `--font-sans` 를 바꾸고 `<head>` 의 폰트 링크만 교체. 예: Playfair Display ↔ Fraunces, Source Serif 4 ↔ Newsreader 는 폴백에 이미 포함.

### 밀도/형태 조정
- 더 촘촘하게: `--space-*` 또는 `--card-pad` 축소.
- 모서리: `--radius-md` 는 인쇄 무드상 2px 권장(올려도 ≤4px 추천).
- 멀티컬럼 단 수: `--columns`.

### 새 컴포넌트 추가
`components/` 에 파일을 만들고 `components/index.css` 에 `@import` 한 줄 추가. **반드시 시맨틱 토큰**(`var(--color-*)`, `var(--space-*)`)만 사용 — 하드코드 색 금지.

---

## 6. 데모 페이지 (`pages/`)

| # | 파일 | 내용 |
|---|------|------|
| 1 | `dashboard.html` | 분석 대시보드 — 스탯·라인/막대/도넛/랭킹 차트·정렬·선택·페이지네이션 테이블 |
| 2 | `kanban.html` | 칸반 보드 — 5컬럼 드래그앤드롭, 새 카드 모달 |
| 3 | `inbox.html` | 이메일 인박스 3패널 — 폴더·목록·읽기, 항목 전환 |
| 4 | `product.html` | 이커머스 상품 상세 — 갤러리·옵션·수량·아코디언·리뷰 |
| 5 | `pricing.html` | 가격표 — 플랜 3종, 월/연 토글, FAQ |
| 6 | `settings.html` | 설정 — 탭·토글·인보이스·위험 영역(삭제 모달) |
| 7 | `onboarding.html` | 온보딩 위저드 — Steps 4단계 |
| 8 | `profile.html` | 프로필/계정 — 커버·통계·탭(기사/활동/소개) |
| 9 | `404.html` | 404 + 빈 상태 패턴 모음 |
| 10 | `article.html` | **쇼피스** 롱폼 아티클 — 드롭캡·멀티컬럼·풀쿼트·피겨캡션·각주 총동원 |

`index.html` 이 전체 허브다. 어떤 파일이든 더블클릭으로 열면 된다.

---

## 7. 접근성 & 품질

- 본문/액센트 색 대비 **4.5:1 이상**(라이트·다크 모두 측정 검증, [CHECKLIST.md](CHECKLIST.md) 참조).
- 버건디 2px **포커스 링**(`:focus-visible`), 키보드 조작(탭/메뉴/커맨드팔레트/모달 포커스 트랩·Esc).
- `prefers-reduced-motion` 대응(애니메이션·스크롤 비활성).
- 시맨틱 랜드마크 + ARIA(role/aria-selected/aria-expanded/aria-current/aria-modal), 아이콘 버튼 `aria-label`, 폼 `<label>` 연결.
- 반응형 브레이크포인트(640 / 768 / 880 / 1024 / 1280px).
- 외부 의존성 0 — 아이콘은 전부 인라인 SVG, 이미지는 SVG 플레이스홀더로 오프라인 동작.
