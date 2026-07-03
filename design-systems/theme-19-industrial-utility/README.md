# THEME 19 — INDUSTRIAL UTILITY

> 콘크리트·스틸 무채색 베이스에 안전 옐로를 박은, **기능 제일(function-first)** 의 산업/작업장 디자인 시스템.
> 직각·굵은 보더·하드 플랫 그림자, 위험 줄무늬·리벳·메탈 패널·스텐실 레터링이 시그니처.
> 외부 CSS 프레임워크 0. 순수 CSS 변수 + 바닐라 JS. 모든 HTML은 **더블클릭(file://)** 만으로 렌더·동작합니다.

---

## 1. 디자인 철학

| 축 | 방향 |
|---|---|
| **무드** | 무뚝뚝·견고·기능 제일. 공장/중장비/작업장. 부드러움·장식·파스텔 금지. |
| **색** | 콘크리트 그레이(`#3A3D42`)·스틸 무채색 베이스 + 안전 옐로(`#F2C200`)·위험 오렌지(`#E8521E`) 포인트 + 머신 그린/레드 신호등. |
| **형태** | 직각(`--radius` 대부분 0), 굵은 보더(2~4px), 메탈 패널 분할, 모서리 리벳. |
| **타이포** | 콘덴스드 산세리프(Oswald) 헤더 + 그로테스크(Archivo) 본문 + 모노(JetBrains Mono) 라벨. 라벨은 전부 대문자 + 와이드 트래킹. |
| **모티프** | 옐로-블랙 위험 줄무늬, 스텐실 대문자, 리벳/메탈 플레이트, 케어 라벨, 케이블/볼트. |
| **시그니처 동작** | 호버 = 옐로 하이라이트/스위치 느낌. 포커스 = 안전 옐로 3px 아웃라인. 모션은 짧고 기계적인 스냅. |

핵심 원칙: **안전 신호처럼 명확하게.** 상태는 색에만 의존하지 않고 항상 **색 + 아이콘 + 라벨** 을 함께 쓴다. 옐로 위 텍스트는 항상 블랙(대비 확보).

---

## 2. 파일 구조

```
theme-19-industrial-utility/
├── tokens.css           # 원시 토큰 (색 램프·산업 모티프·스케일 전부)
├── semantic.css         # 시맨틱 토큰(다크 정본/라이트) + 컴포넌트 토큰
├── base.css             # 리셋·콘덴스드 타이포·위험줄무늬/메탈/리벳/스텐실 유틸·레이아웃·접근성
├── components/
│   ├── buttons.css      # Button · ButtonGroup · SegmentedControl
│   ├── forms.css        # Input · Select · Checkbox · Radio · Toggle · Slider · Stepper · FileUpload · SearchBar · Rating · ChipInput · Combobox · MultiSelect
│   ├── display.css      # Card · StatCard · Badge · Avatar · Tooltip · Popover · Accordion · Tabs · List · Timeline · KanbanCard · CodeBlock · Skeleton · EmptyState · Carousel · Gauge
│   ├── table.css        # Table(정렬·선택·페이지네이션) · Calendar · Pagination
│   ├── feedback.css     # Alert · Banner · Toast · Modal · Drawer · CommandPalette · Progress · Spinner · InlineNotification
│   ├── navigation.css   # Navbar · Sidebar(접힘) · Breadcrumb · Menu/Dropdown · ContextMenu · Steps/Wizard
│   └── charts.css       # BarChart · Sparkline · LED Readout · Linear Gauge · HeatGrid · Metric Row
├── app.js               # 모든 인터랙션 + 테마 전환 (바닐라 JS, 이벤트 위임)
├── index.html           # 허브 — 히어로 + 토큰/모티프 비주얼 + 컴포넌트 갤러리 + pages 링크
├── pages/               # 9개 실데모 화면
│   ├── dashboard.html   # 1) 분석 대시보드 (게이지·계기판 + 데이터 그리드 + 차트)
│   ├── kanban.html      # 2) 칸반 보드 (드래그 앤 드롭)
│   ├── inbox.html       # 3) 인박스 (3패널 이메일)
│   ├── product.html     # 4) 이커머스 상품 상세 (공구/장비 스토어)
│   ├── pricing.html     # 5) 가격표 (플랜 3개, 월/연 토글)
│   ├── settings.html    # 6) 설정 (탭 + 토글 + 위험 영역)
│   ├── onboarding.html  # 7) 온보딩 위저드 (Steps)
│   ├── profile.html     # 8) 프로필/계정
│   └── 404.html         # 9) 404 + 빈 상태 (경고 표지풍)
├── README.md
└── CHECKLIST.md
```

로드 순서는 항상 **tokens → semantic → base → components/\* → app.js**.

---

## 3. 빠른 시작

새 HTML에 아래 `<head>` 를 붙이면 끝(페이지가 `pages/` 안이면 경로에 `../` 추가):

```html
<link href="https://fonts.googleapis.com/css2?family=Oswald:wght@300;400;500;600;700&family=Archivo:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="tokens.css">
<link rel="stylesheet" href="semantic.css">
<link rel="stylesheet" href="base.css">
<link rel="stylesheet" href="components/buttons.css">
<link rel="stylesheet" href="components/forms.css">
<link rel="stylesheet" href="components/display.css">
<link rel="stylesheet" href="components/table.css">
<link rel="stylesheet" href="components/feedback.css">
<link rel="stylesheet" href="components/navigation.css">
<link rel="stylesheet" href="components/charts.css">
...
<script src="app.js"></script>
```

테마는 `<html data-theme="dark">` (정본) 또는 `data-theme="light">`. 어디든 `data-action="toggle-theme"` 버튼을 두면 전환·localStorage 저장이 자동 동작.

---

## 4. 토큰 레퍼런스

### 4.1 색 램프 (tokens.css)
| 램프 | 변수 | 핵심 값 |
|---|---|---|
| 콘크리트/스틸 | `--concrete-0 … --concrete-900` | 700 = `#3A3D42` (시그니처), 900 = `#1A1C1F` (차콜 메탈) |
| 안전 옐로 | `--safety-yellow-50 … 900` | 500 = `#F2C200` (primary) |
| 위험 오렌지 | `--hazard-orange-50 … 900` | 500 = `#E8521E` (accent) |
| 머신 그린 | `--signal-green-50 … 900` | 500 = `#2E9E5B` (success) |
| 머신 레드 | `--signal-red-50 … 900` | 500 = `#CC2424` (danger) |
| 스틸 코발트 | `--signal-blue-50 … 900` | 500 = `#2D6CC4` (info) |

### 4.2 산업 모티프 토큰
| 변수 | 용도 |
|---|---|
| `--hazard-stripes` / `--hazard-stripes-fine` | 옐로-블랙 대각 줄무늬 (`.hazard-band` 에 사용) |
| `--caution-tape` | 오렌지-블랙 대각 줄무늬 (`.caution-band`) |
| `--rivet` / `--rivet-dark` | 입체 메탈 리벳/볼트 머리 (`.rivet`, `.rivet-corner`) |
| `--metal-texture` / `--plate-texture` / `--grid-texture` | 브러시드 메탈·체커 플레이트·블루프린트 그리드 |
| `--metal-surface` / `--metal-surface-raised` | 패널 표면 그라데이션 (`.metal-panel`) |
| `--stencil-tracking` | 스텐실 레터링 트래킹 (`.stencil`) |

### 4.3 스케일
- **간격** `--space-0 … --space-16` (0 → 160px, 타이트 베이스)
- **타이포** `--text-2xs … --text-6xl`, `--leading-*`, `--tracking-*` (라벨 = `--tracking-wider/widest`)
- **모서리** `--radius-none/sm/md = 0`, `--radius-full` (원형 전용)
- **보더** `--border-1/2/3/4`
- **그림자** `--shadow-sm/md/lg/xl` (하드 플랫), `--shadow-inset-metal/-deep` (눌린 메탈)
- **링** `--ring` (안전 옐로 3px + 오프셋), `--ring-width/-color`
- **모션** `--ease-standard/-snap`, `--duration-fast(90ms)/-base(160ms)/-slow(280ms)`
- **z-index** `--z-dropdown … --z-tooltip … --z-max`

### 4.4 시맨틱 토큰 (semantic.css)
`--color-bg / -surface / -surface-2 / -surface-3 / -text / -text-muted / -primary(=옐로) / -primary-fg(=블랙) / -accent(=오렌지) / -border / -success / -warning / -danger / -info` + 각 상태의 `-bg / -border`. 다크/라이트 양쪽 정의.

컴포넌트 토큰: `--btn-*`, `--card-*`(메탈 패널), `--input-*`, `--badge-*`, `--table-*`, `--toggle-*`, `--gauge-*` 등.

---

## 5. 컴포넌트 목록 (110+ 변형)

**폼** — Button(primary/secondary/ghost/danger/accent/icon × sm/md/lg × hover/active/disabled/loading), ButtonGroup, SegmentedControl, Input, Textarea, Select, MultiSelect, Combobox/Autocomplete, Checkbox, Radio, Toggle/Switch(물리 스위치), Slider, Stepper, DatePicker, FileUpload, SearchBar, Rating, ChipInput.

**표시** — Card(메탈 패널/리벳/danger-zone), StatCard(게이지풍), Badge/Tag(스텐실), Avatar/AvatarGroup, Tooltip, Popover, Accordion, Tabs, Table(데이터 그리드), List, Timeline(로그), KanbanCard, CodeBlock, Skeleton, EmptyState, Carousel, Calendar, Gauge(원형/선형).

**피드백/오버레이** — Alert, Banner(경고 띠), Toast(스택), Modal/Dialog, Drawer, CommandPalette(⌘K), Progress(바/원형), Spinner, InlineNotification.

**내비** — Navbar, Sidebar(접힘), Breadcrumb, Pagination, Menu/Dropdown, ContextMenu, Steps/Wizard.

**차트/계기** — BarChart, Sparkline, LED Readout, Linear Gauge, HeatGrid, Metric Row.

### 인터랙션 훅 (app.js, 이벤트 위임)
| 훅 | 동작 |
|---|---|
| `[data-action="toggle-theme"]` | 다크/라이트 전환 + localStorage |
| `[data-action="toggle-sidebar"]` | 사이드바 접기/펴기 |
| `[data-tabs]` + `[role=tab][aria-controls]` | 탭 (화살표 키 지원) |
| `[data-accordion="single"]` | 아코디언 (단일 오픈) |
| `[data-modal-open="ID"]` / `[data-modal-close]` | 모달 (ESC·백드롭·포커스 복귀) |
| `[data-drawer-open="ID"]` / `[data-drawer-close]` | 드로어 |
| `[data-action="open-cmdk"]` / `⌘K` `Ctrl+K` | 커맨드 팔레트 (검색·↑↓·Enter) |
| `[data-action="demo-toast"]` 또는 `window.Industrial.toast({type,title,msg})` | 토스트 |
| `[data-segmented]` | 슬라이딩 세그먼트 |
| `[data-sortable-table]` + `[data-select-all]/[data-row-select]` | 테이블 정렬·선택 |
| `[data-stepper]` `[data-slider]` `[data-rating]` `[data-chipinput]` `[data-combo]` `[data-multiselect]` | 폼 인터랙션 |
| `[data-carousel]` | 캐러셀 |
| `[data-kanban-col]` + `draggable="true"` | 칸반 드래그 앤 드롭 |
| `[data-wizard]` | 단계 위저드 (이전/다음/완료) |
| `[data-billing-toggle]` + `[data-price]` | 가격 월/연 토글 |
| `[data-animate-meters]` 조상 | 게이지·프로그래스·바차트 진입 시 애니메이션 |
| `[data-clock]` | 실시간 시계 |

---

## 6. 교체 가이드 (리브랜딩)

1. **포인트 색 교체** — `tokens.css` 의 `--safety-yellow-500`(primary)·`--hazard-orange-500`(accent)만 바꾸면 전체 톤이 따라옵니다. 램프 50~900은 비례 유지 권장.
2. **무채색 베이스 교체** — `--concrete-*` 램프를 원하는 중립색으로. 다크가 정본이므로 700~900의 명도가 분위기를 좌우.
3. **시맨틱 매핑만 바꾸기** — 원시 램프는 두고 `semantic.css` 의 `--color-primary/-accent/...` 가 어느 램프를 가리키는지만 교체하면 안전하게 테마 변형 가능.
4. **모서리/보더 톤 조절** — 덜 거칠게 하려면 `--radius-md` 를 2~4px로, `--border-2` 기본을 1px로. (단, 산업 무드는 직각이 핵심)
5. **모티프 제거/완화** — 위험 줄무늬가 과하면 `.hazard-band` 사용을 줄이고 `--hazard-stripes` 의 색을 무채색으로. 리벳은 `.has-rivets > .rivet-corner` 만 빼면 됩니다.
6. **폰트 교체** — `--font-display`(헤더)·`--font-body`·`--font-mono` 세 변수만 교체. 콘덴스드 헤더 + 모노 라벨 조합을 유지하면 정체성이 살아남습니다.

---

## 7. 접근성 요약

- 모든 안전색-무채색 조합 대비 **4.5:1 이상** (옐로 위 텍스트는 블랙).
- 상태 표현은 **색 + 아이콘 + 라벨** 병행 (색맹 안전).
- `:focus-visible` 안전 옐로 3px 아웃라인 / 어두운 패널은 `--ring` box-shadow.
- `prefers-reduced-motion: reduce` 시 모든 애니메이션·트랜지션 무력화.
- 장식(위험 줄무늬·리벳·메탈 텍스처)은 전부 `aria-hidden="true"`.
- 시맨틱 role/aria (`tablist/tab/tabpanel`, `dialog`, `progressbar`, `aria-sort`, `aria-pressed`, `aria-expanded`) + 키보드 조작(탭 화살표, ⌘K 검색, ESC 닫기).
- `.skip-link` 본문 바로가기 제공.

자세한 점검 결과는 [CHECKLIST.md](CHECKLIST.md) 참고.
