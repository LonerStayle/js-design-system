# Atomic — Mid-Century Modern Design System (Theme 18)

> 따뜻하고 낙관적인 **원자시대(Atomic Age) 복고 모던** 디자인 시스템.
> 임스 시대의 손맛, 굵은 플랫 컬러 블록, 유기적 곡선, 스타버스트·부메랑·아톰 모티프.
> 외부 프레임워크 0 — 순수 CSS 토큰 + 바닐라 JS. 모든 HTML은 **더블클릭(`file://`)만으로 렌더·동작**합니다.

---

## 1. 디자인 철학

미드센추리 모던은 1945–1969년, 전후의 낙관과 우주·원자 시대의 호기심이 가구와 그래픽으로 흘러든 양식입니다. 이 시스템은 그 무드를 **차갑지 않게, 미니멀하지 않게, 네온틱하지 않게** 코드로 옮깁니다.

| 축 | 결정 |
|---|---|
| **무드** | 따뜻·낙관·복고 모던. 크림 바탕에 굵은 컬러 면. |
| **색** | 머스타드 옐로 · 틸 · 버트 오렌지 · 아보카도 그린 · 웜 브라운/크림. |
| **모티프** | 스타버스트/아톰, 부메랑, 키드니(콩) 곡선, 가는 furniture-leg 라인. |
| **형태** | 중간 라운드(`--radius-md` 11px) + 유기적 곡선(키드니/타원). 굵은 면 분할. |
| **타이포** | 지오메트릭 산세리프(Jost/Poppins) + 레트로 슬랩 액센트(Bitter). |
| **시그니처** | 아토믹 장식 · 굵은 컬러 블록 · 곡선 카드 · 따뜻한 톤 호버 · 틸/오렌지 솔리드 포커스 링. |

### 접근성 원칙
- **대비 4.5:1 이상.** 머스타드/크림 같은 밝은 면 위에는 **다크 잉크**(`--color-text-on-accent`)를 강제. 틸·오렌지·아보카도는 600단계 채도로 흰 텍스트 대비를 확보.
- **상태는 색 + 아이콘 병행** (배지의 `badge--dot`, 알림의 아이콘 등).
- `prefers-reduced-motion` 전면 대응 — 모든 애니메이션/트랜지션을 무력화.
- `prefers-color-scheme` 폴백(무 JS 시에도 다크 동작) + 또렷한 `:focus-visible` 링.

---

## 2. 파일 구조

```
theme-18-mid-century-modern/
├── tokens.css            원시 토큰 (컬러 램프 50–900, 아토믹 모티프 SVG, 스케일 전부)
├── semantic.css          시맨틱·컴포넌트 토큰 (라이트/다크, tokens.css 참조)
├── base.css              리셋·타이포·컬러블록/곡선 유틸·모티프·접근성
├── components/
│   ├── index.css         아래 전부 @import (HTML은 이 한 파일만 링크)
│   ├── buttons.css       Button, ButtonGroup
│   ├── forms.css         Input·Textarea·Select·Checkbox·Radio·Switch·Segmented·
│   │                     Slider·Stepper·SearchBar·ChipInput·FileUpload·Rating
│   ├── cards.css         Card·StatCard·KanbanCard·PricingCard·ProductCard·EmptyState
│   ├── badges-avatars.css Badge·Tag·Avatar·AvatarGroup·Tooltip
│   ├── data-display.css  Table·List·Timeline·Accordion·Tabs·CodeBlock·Skeleton·Carousel·Calendar
│   ├── overlays.css      Modal·Drawer·Popover·Toast·CommandPalette·Menu/Dropdown·ContextMenu
│   ├── feedback.css      Alert/Banner·InlineNotification·Progress(바/원형)·Spinner(아톰)
│   ├── navigation.css    Navbar·Sidebar·Breadcrumb·Pagination·Steps/Wizard
│   ├── misc.css          Combobox·MultiSelect·DatePicker·Charts(bar/donut/spark)
│   └── layouts.css       App-shell·Atomic hero·Dashboard grid·Kanban·Mail 3-pane·Swatch
├── app.js                모든 인터랙션 + 테마전환 (바닐라, 의존성 0)
├── index.html            허브 (아토믹 히어로 + 토큰/모티프 비주얼 + 컴포넌트 갤러리 + 페이지 링크)
├── pages/                실데모 9종 (dashboard·kanban·inbox·product·pricing·settings·onboarding·profile·404)
├── README.md             (이 파일)
└── CHECKLIST.md          구현·접근성 자가점검 결과
```

### HTML에서 링크하는 순서 (4개)
```html
<link rel="stylesheet" href="tokens.css" />
<link rel="stylesheet" href="semantic.css" />
<link rel="stylesheet" href="base.css" />
<link rel="stylesheet" href="components/index.css" />
<!-- ... 본문 ... -->
<script src="app.js"></script>
```
> `pages/` 안의 파일은 `../tokens.css` 처럼 한 단계 위를 참조합니다.
> 폰트는 Google Fonts(`Jost`, `Poppins`, `Bitter`, `Space Mono`)를 `<link>` 로 불러오되, 오프라인에서도 견고한 시스템 폴백(Futura/Century Gothic 등)을 토큰에 내장했습니다.

---

## 3. 토큰 레퍼런스

### 3.1 컬러 램프 (원시, `tokens.css`)
각 램프는 `50`(가장 밝음) → `900`(가장 어두움). 앵커는 500(중성은 100=크림).

| 램프 | 변수 prefix | 앵커 | 용도 |
|---|---|---|---|
| Mustard | `--mustard-50…900` | `#E0A526` (500) | accent · warning |
| Teal | `--teal-50…900` | `#2E8B8B` (500) | primary · info |
| Burnt Orange | `--orange-50…900` | `#C65D34` (500) | secondary · danger |
| Avocado | `--avocado-50…900` | `#7A8B3C` (500) | success |
| Warm Neutral | `--neutral-50…950` | `#F2E8D5` (100 크림) | bg·surface·text·border |

### 3.2 아토믹 모티프 토큰 (인라인 SVG data-URI)
| 토큰 | 모양 | 사용 |
|---|---|---|
| `--motif-starburst` | 스타버스트/선버스트 | `.motif-starburst`, `.has-starburst`, `.atomic-divider__mark` |
| `--motif-atom` | 3궤도 아톰 | `.motif-atom`, 스피너 |
| `--motif-boomerang` | 부메랑 | `.motif-boomerang`, 히어로 장식 |
| `--shape-kidney` | 키드니(콩) 곡선 | `.motif-kidney`, 빈상태 아트 |
| `--pattern-retro` | 반복 아토믹 타일 | `.pattern-retro` 배경 |
| `--pattern-legs` | 대각 furniture-leg | `.pattern-legs` 배경 |
| `--texture-grain` | 웜 페이퍼 그레인 | `.grain::after` 오버레이 |

### 3.3 스케일
- **간격** `--space-0 … --space-16` (4px 리듬: 0,4,8,12,16,20,24,28,32,40,48,56,64,80,96,128,160)
- **타이포** `--text-2xs … --text-6xl` (11 → 84px) · `--leading-*` · `--tracking-*` · `--weight-*`
- **라운드** `--radius-sm 6` / `--radius-md 11` / `--radius-lg 18` / `--radius-xl 28` / `--radius-pill`
- **유기 곡선** `--curve-organic`, `--curve-organic-2`, `--curve-capsule-l`, `--curve-leaf`
- **보더** `--border-1 1.5px` / `--border-2 3px` / `--border-3 5px`
- **그림자** `--shadow-xs…xl` (웜톤) + `--shadow-block`(레트로 하드 오프셋)
- **포커스 링** `--ring-teal` / `--ring-orange` + `--ring-shadow-*`
- **모션** `--duration-fast/base/slow/slower` · `--ease-standard/emphasized/exit/out-soft`
- **z-index** base → command(1700), **브레이크포인트** `--bp-sm…2xl`

### 3.4 시맨틱 토큰 (`semantic.css`)
의미 기반 — 라이트/다크가 같은 이름을 공유하며 값만 바뀝니다.

| 역할 | 변수 | 라이트 매핑 |
|---|---|---|
| 배경 | `--color-bg` | 크림 (`--neutral-100`) |
| 표면 | `--color-surface`, `--color-surface-2` | 웜 화이트 |
| 본문 | `--color-text`, `--color-text-muted` | 웜 잉크 |
| primary | `--color-primary` (+`-hover/-fg/-soft`) | 틸 600 |
| secondary | `--color-secondary` | 버트 오렌지 600 |
| accent | `--color-accent` (+`-fg`=다크잉크) | 머스타드 400 |
| success/warning/danger/info | `--color-success`… | 아보카도/머스타드/오렌지/틸 |
| 컬러 블록 | `--block-{teal,mustard,orange,avocado,cream,brown}-bg/-fg` | bg+보장대비 fg 쌍 |

컴포넌트 토큰: `--btn-*`, `--card-*`, `--input-*`, `--table-*`, `--sidebar-*`, `--toast-*`, `--track-*`, `--switch-*` 등.

---

## 4. 컴포넌트 목록

**폼** — Button(primary/secondary/accent/ghost/outline/danger/block/icon × sm/md/lg × hover/active/disabled/loading) · ButtonGroup · Input(+adornment) · Textarea · Select · MultiSelect · Combobox/Autocomplete · Checkbox · Radio · Switch · SegmentedControl · Slider · Stepper · SearchBar · ChipInput · FileUpload(dropzone) · Rating

**표시** — Card(곡선/컬러블록/print) · StatCard · Badge/Tag · Avatar/AvatarGroup · Tooltip · Accordion · Tabs(line/pill) · Table(정렬·선택·페이지네이션) · List · Timeline · KanbanCard · CodeBlock · Skeleton · Carousel · Calendar · Charts(bar/donut/sparkline)

**피드백·오버레이** — Alert/Banner · InlineNotification · Toast(스택) · Modal/Dialog · Drawer · Popover · CommandPalette(⌘K) · Progress(바/원형) · Spinner(아톰 회전)

**내비** — Navbar · Sidebar(접힘) · Breadcrumb · Pagination · Menu/Dropdown · ContextMenu · Steps/Wizard

모든 인터랙티브 컴포넌트는 키보드 조작과 ARIA(role/aria-*) 를 포함합니다.

---

## 5. JS 인터랙션 (`app.js`)

의존성 없는 IIFE. **data-attribute 기반**으로 자동 초기화되며, `window.MCM` 으로 일부 API를 노출합니다.

| 기능 | 트리거 |
|---|---|
| 테마 전환 | `[data-theme-toggle]` · `MCM.Theme.toggle()` (localStorage 저장) |
| 모달 | `[data-modal-open="id"]` / `[data-modal-close]` (포커스 트랩 · Esc) |
| 드로어 | `[data-drawer-open="id"]` / `[data-drawer-close]` |
| 토스트 | `[data-toast="success|danger|warning|info"]` + `-title`/`-msg` · `MCM.Toast.show()` |
| 탭 | `.tabs` + role=tab/tabpanel (←/→/Home/End 키) |
| 아코디언 | `.accordion__trigger` (`data-single` = 한 번에 하나) |
| 드롭다운/메뉴 | `[data-dropdown-trigger]` |
| 커맨드 팔레트 | `⌘K`/`Ctrl K` 또는 `[data-cmdk-open]` (↑↓ 이동, ↵ 선택) |
| 세그먼티드 | `.segmented` (`segmentchange` 이벤트) |
| 슬라이더/스테퍼 | `.slider input[type=range]` / `.stepper` |
| 캐러셀 | `.carousel` (`data-auto`=자동재생 ms) |
| 사이드바 | `[data-sidebar-toggle="id"]` (데스크톱=접힘, 모바일=오버레이) |
| 복사 | `[data-copy="텍스트"]` 또는 코드블록 |
| 테이블 정렬/전체선택 | `table[data-sortable]` / `[data-select-all="id"]` |
| 콤보박스·멀티셀렉트 | `.combobox` / `.multiselect` |
| 파일 업로드 | `.fileupload` (드래그&드롭) |
| 컨텍스트 메뉴 | `[data-context-menu="id"]` |
| 위저드 | `[data-wizard]` + `[data-wizard-panel]` + `[data-wizard-next/prev]` |
| 가격 토글 | `[data-billing-toggle]` + `[data-price-monthly]`/`[data-price-annual]` |
| 스크롤 리빌 | `[data-reveal]` (IntersectionObserver) |

---

## 6. 교체 가이드 (테마 갈아끼우기)

이 시스템은 **토큰 레이어 분리** 덕분에 색·형태를 빠르게 바꿀 수 있습니다.

### 색을 바꾸려면 — `tokens.css`의 램프만 교체
```css
/* 예: 버트 오렌지를 테라코타로 */
--orange-500: #B85C38;   /* 앵커만 바꿔도 모든 secondary/danger가 따라감 */
```
시맨틱·컴포넌트 토큰은 램프를 **참조**하므로, 램프 값만 바꾸면 전 컴포넌트에 전파됩니다. 역할 자체를 바꾸려면(예: primary를 틸 대신 오렌지로) `semantic.css`의 `--color-primary` 한 줄만 수정.

### 형태를 바꾸려면 — `tokens.css`의 radius/curve
```css
--radius-md: 4px;                 /* 더 각지게 */
--curve-organic: 50%;             /* 완전 둥글게 */
```

### 모티프를 바꾸려면 — `--motif-*` data-URI 교체
SVG 한 줄을 새 모양으로 바꾸면 장식·배경·스피너가 일괄 변경됩니다.

### 다크 톤 조정 — `semantic.css`의 `:root[data-theme="dark"]`
다크는 라이트와 **같은 변수 이름**을 재정의하므로, 해당 블록의 값만 손보면 됩니다.

### 새 컴포넌트 추가
`components/`에 `my-thing.css`를 만들고 `components/index.css`에 `@import url("my-thing.css");` 한 줄 추가. 색·간격·라운드는 반드시 시맨틱/원시 토큰 변수를 쓰세요(하드코딩 금지) — 그래야 테마 전환과 교체가 자동으로 따라옵니다.

---

## 7. 빠른 시작
1. `index.html` 을 더블클릭 → 허브에서 토큰·모티프·전 컴포넌트·9개 데모를 둘러봅니다.
2. `⌘K` 로 명령 팔레트를, 우상단 토글로 다크모드를 시험해 보세요.
3. `pages/` 의 각 화면이 실제 컴포넌트 조립 예시입니다 — 마크업을 그대로 복사해 시작하면 됩니다.

---

*Theme 18 · Mid-Century Modern · 2026 — 순수 CSS + 바닐라 JS, 프레임워크 0.*
