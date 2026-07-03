# Minimal Monochrome — theme-14

> 색이 사라질 때 남는 것. 침묵·집중·중립의 무채색 디자인 시스템.

순수 흑백과 그레이 단계만으로 구성된 프로덕션급 디자인 시스템입니다. 외부 CSS 프레임워크 없이 순수 CSS 변수와 바닐라 JavaScript로만 만들어졌으며, 모든 HTML은 **더블클릭(file://)** 만으로 렌더·동작합니다.

---

## 1. 디자인 철학

**“무스타일의 스타일.”** 콘텐츠가 주인공이 되고, 스타일은 사라집니다.

| 원칙 | 적용 |
|------|------|
| **색 없음** | 순수 흑백 + 16단계 그레이 램프. 유채색·액센트·그라데이션 **0**. |
| **위계는 빛으로** | 색이 아니라 **명도 · 굵기(400/500/600) · 크기 · 여백**으로 위계를 만듭니다. |
| **헤어라인** | 1px 헤어라인으로 구분. 박스·그림자는 최소(거의 헤어라인 대체 수준). |
| **광활한 여백** | 극단적 화이트스페이스, 콘텐츠 폭 제한, 좌측 정렬, 차분한 리듬. |
| **조용한 타이포** | 휴머니스트 산세리프(Inter / 시스템 폴백). 넉넉한 레딩. |
| **유일한 강조** | 솔리드 블랙 Primary 버튼(다크모드에선 화이트). 호버 = 미세 명도 변화. |
| **색 의존 0 접근성** | 상태(성공/경고/오류)는 **아이콘 + 텍스트 + 명도 대비**로만 구분. |

라이트(갤러리 화이트)와 다크(뉴트럴 블랙) 두 테마 모두 완전한 무채색입니다.

---

## 2. 파일 구조

```
theme-14-minimal-monochrome/
├── tokens.css          원시 토큰 — 그레이스케일 램프, 간격/타이포/모서리/그림자/모션 스케일 전부
├── semantic.css        시맨틱·컴포넌트 토큰 — 라이트/다크, 상태색(무채색화), --btn-/--card-/--input- 등
├── base.css            리셋 · 본문 타이포그래피 · 여백 중심 레이아웃 유틸 · 접근성 · reduced-motion
├── components/
│   ├── index.css       전체 @import 집계(이 한 줄만 링크하면 됨)
│   ├── buttons.css     Button(5변형×3사이즈×상태), ButtonGroup
│   ├── forms.css       Input/Textarea/Select/SearchBar/FileUpload/Combobox/MultiSelect/DatePicker
│   ├── selection.css   Checkbox/Radio/Toggle/Segmented/Slider/Stepper/Rating/ChipInput
│   ├── cards.css       Card/StatCard/List/Timeline/KanbanCard/EmptyState/Skeleton
│   ├── badges.css      Badge/Tag/Count/Avatar(+Group)/Tooltip/CodeBlock
│   ├── data.css        Table(정렬·선택)/Accordion/Tabs/Calendar/Carousel
│   ├── feedback.css    Alert/Banner/Toast/Progress(바·원형)/Spinner/InlineNotification
│   ├── overlays.css    Modal/Drawer/Popover/Menu·Dropdown/ContextMenu/CommandPalette(⌘K)
│   ├── navigation.css  Navbar/Sidebar(접힘)/Breadcrumb/Pagination/Steps·Wizard
│   └── charts.css      그레이스케일 차트(막대/라인/스파크/도넛/범례/비교바) + 앱 셸 유틸
├── app.js              모든 인터랙션 + 테마전환(바닐라 JS, data-* 위임)
├── index.html          허브 — 여백 중심 히어로 + 토큰 비주얼 + 컴포넌트 갤러리 + pages 링크
├── pages/              9개 실데모 화면
│   ├── dashboard.html   01 분석 대시보드(사이드바·차트·테이블·타임라인)
│   ├── kanban.html      02 칸반 보드(드래그앤드롭)
│   ├── inbox.html       03 이메일 인박스(3패널)
│   ├── product.html     04 이커머스 상품 상세(갤러리·옵션·장바구니 드로어)
│   ├── pricing.html     05 가격표(월/연 토글·비교표)
│   ├── settings.html    06 설정(탭·토글·위험 영역)
│   ├── onboarding.html  07 온보딩 위저드(Steps)
│   ├── profile.html     08 프로필/계정(기여 그리드·배지·탭)
│   └── 404.html         09 404 + 빈 상태 패턴
├── README.md           (이 문서)
└── CHECKLIST.md        구현·접근성 자가점검 결과
```

### 로드 순서

```html
<link rel="stylesheet" href="tokens.css">      <!-- 1. 원시 토큰 -->
<link rel="stylesheet" href="semantic.css">    <!-- 2. 의미·컴포넌트 토큰 -->
<link rel="stylesheet" href="base.css">        <!-- 3. 리셋·타이포·레이아웃 -->
<link rel="stylesheet" href="components/index.css">  <!-- 4. 컴포넌트 전체 -->
...
<script src="app.js"></script>                 <!-- body 끝 -->
```

깜빡임 방지를 위해 `<head>` 최상단에 테마 선적용 인라인 스크립트를 둡니다(각 HTML 참고).

---

## 3. 토큰 레퍼런스

### 3.1 색 — Neutral Ramp (원시)

완전 무채색(R=G=B) 16단계. 숫자 N ≈ 명도 N/10 %. **컬러 램프 없음.**

| 토큰 | 값 | 토큰 | 값 |
|------|-----|------|-----|
| `--neutral-0` | `#000000` (순흑) | `--neutral-500` | `#6e6e6e` |
| `--neutral-50` | `#0a0a0a` | `--neutral-600` | `#8a8a8a` |
| `--neutral-100` | `#141414` | `--neutral-700` | `#a6a6a6` |
| `--neutral-150` | `#1c1c1c` | `--neutral-800` | `#c4c4c4` |
| `--neutral-200` | `#242424` | `--neutral-850` | `#d4d4d4` |
| `--neutral-250` | `#2b2b2b` | `--neutral-900` | `#e2e2e2` |
| `--neutral-300` | `#333333` | `--neutral-950` | `#f0f0f0` |
| `--neutral-400` | `#4d4d4d` | `--neutral-975` | `#f7f7f7` |
| | | `--neutral-1000` | `#ffffff` (순백) |

투명 무채색 틴트: `--black-a04…a60`, `--white-a06…a40` (호버/스크림/오버레이용).

### 3.2 시맨틱 토큰(라이트/다크 자동 스왑)

| 토큰 | 의미 |
|------|------|
| `--color-bg` / `--color-surface` / `--color-surface-2` / `--color-surface-3` | 배경·표면 명도 단계 |
| `--color-text` / `--color-text-strong` / `--color-text-muted` / `--color-text-subtle` | 텍스트 위계 |
| `--color-border` / `--color-border-strong` / `--color-border-subtle` | 헤어라인 |
| `--color-primary` / `--color-primary-hover` / `--color-primary-fg` | 유일한 강조(블랙↔화이트) |
| `--color-accent` | 다크 그레이 보조 강조 |
| `--color-success / -warning / -danger / -info` (+ `-fg / -surface / -border`) | **전부 무채색 명도.** 의미 구분은 아이콘+텍스트로. |
| `--color-ring` | 포커스 링(블랙/화이트) |
| `--chart-ink-1…4`, `--chart-grid`, `--chart-axis`, `--chart-fill` | 그레이스케일 차트 |

### 3.3 스케일

- **간격** `--space-0 … --space-20` (0 → 256px, 끝단이 넓은 “여백 큰” 스케일)
- **타이포** `--text-2xs … --text-6xl` (11px → 88px) · `--leading-none … -loose` · `--tracking-tighter … -widest` · `--weight-light/regular/medium/semibold`
- **모서리** `--radius-xs/sm/md(6px)/lg/xl/full` (작게)
- **보더** `--border-1`(헤어라인) / `--border-2`
- **그림자** `--shadow-xs/sm/md/lg` (아주 미세) — 다크모드는 보더 기반으로 대체
- **모션** `--ease-standard/out/in-out` · `--duration-fast(120)/base(200)/slow(320)`
- **z-index** `--z-base … --z-tooltip(1700)/--z-command(1800)`
- **컨테이너** `--container-prose(68ch)/sm/md/lg/xl`

### 3.4 컴포넌트 토큰

`--btn-*`(height/px/radius/font/weight), `--input-*`(height/border/bg/placeholder), `--card-*`(bg/border/radius/padding), `--panel-*`, `--nav-height`, `--sidebar-width(-collapsed)`, `--table-*`, `--tooltip-*`, `--badge-*`, `--toast-*`, `--focus-ring`.

---

## 4. 컴포넌트 목록 (60+)

**폼** — Button(primary/secondary/ghost/danger/link/icon × sm/md/lg × hover/active/disabled/loading), ButtonGroup, Input, Textarea, Select, SearchBar, FileUpload(드롭존), Combobox/Autocomplete, MultiSelect, DatePicker, Checkbox(+indeterminate), Radio, Toggle/Switch, SegmentedControl, Slider, Stepper, Rating, ChipInput.

**표시** — Card(헤어라인/hover/interactive), StatCard(추세 아이콘), Badge/Tag/Count, Avatar/AvatarGroup(presence), Tooltip, Popover, Accordion, Tabs(underline/pill), Table(정렬·선택·페이지네이션), List, Timeline, KanbanCard, CodeBlock(복사), Skeleton, EmptyState, Carousel, Calendar.

**피드백/오버레이** — Alert/Banner(아이콘 구분), Toast(스택), Modal/Dialog(sm/lg), Drawer(좌/우), CommandPalette(⌘K), Progress(바/원형/indeterminate), Spinner(ring/dots), InlineNotification.

**내비** — Navbar, Sidebar(접힘), Breadcrumb, Pagination, Menu/Dropdown, ContextMenu, Steps/Wizard(가로/세로).

**차트(전부 그레이)** — 막대, 라인/영역, 스파크라인, 도넛, 범례, 비교 미터.

각 컴포넌트는 키보드 조작·ARIA·포커스 링을 전제로 설계되었습니다.

### 사용 예

```html
<!-- Primary 버튼(유일한 강조) -->
<button class="btn btn-primary">저장</button>

<!-- 상태 배지 — 색이 아니라 아이콘+텍스트로 -->
<span class="badge badge-status">
  <svg class="icon-sm icon" viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></svg>완료
</span>

<!-- 토스트(JS) -->
<script>MM.toast({ title: '저장됨', body: '변경 사항이 저장되었습니다.', icon: 'success' });</script>
```

---

## 5. JavaScript API (`app.js`)

전역 `window.MM` 네임스페이스 + `data-*` 속성 위임. 마크업에 속성만 붙이면 자동 동작합니다.

| 기능 | 트리거 | 프로그램 호출 |
|------|--------|---------------|
| 테마 전환 | `data-theme-toggle` | `MM.toggleTheme()` / `MM.setTheme('dark')` |
| 모달 | `data-modal-open="id"` / `data-modal-close` | `MM.openModal(id)` / `MM.closeModal(id)` |
| 드로어 | `data-drawer-open="id"` / `data-drawer-close` | `MM.openDrawer(id)` / `MM.closeDrawer(id)` |
| 토스트 | `data-toast="제목"`(+`-body`/`-icon`) | `MM.toast({title,body,icon,duration})` |
| 커맨드 팔레트 | `data-command-open` 또는 `⌘K`/`Ctrl+K` | `MM.openCommand()` |
| 드롭다운/팝오버 | `data-dropdown-toggle` / `data-popover-toggle="id"` | — |
| 탭/아코디언/세그먼트 | `role=tab` / `.accordion-trigger` / `.segmented` | — |
| 테이블 정렬·선택 | `.th-sort` / `data-select-all` / `data-row-select` | — |
| 스테퍼/레이팅/슬라이더/칩/콤보/파일 | 해당 클래스 + data 속성 | — |
| 캐러셀 | `[data-carousel]` + prev/next/dot | — |
| 위저드 | `[data-wizard]` + `[data-wizard-next/prev]` | `MM.moveWizard(±1)` |
| 사이드바 | `data-sidebar-toggle`(접기) / `data-sidebar-open`(모바일) | — |

테마는 `localStorage('mm-theme')`에 영속되며, `prefers-color-scheme`를 기본값으로 따릅니다.
`prefers-reduced-motion: reduce`에서 모든 애니메이션이 무력화됩니다.

---

## 6. 교체 가이드 (다른 미학으로 바꾸기)

이 시스템은 **토큰 레이어가 단일 진실**입니다. 컴포넌트 CSS는 시맨틱 토큰만 참조하므로, 토큰만 바꾸면 전체가 따라옵니다.

1. **명도만 조정** — `tokens.css`의 `--neutral-*` 값만 손보면 전체 대비/톤이 바뀝니다(무채색 유지).
2. **색을 도입하려면(이 테마의 의도와는 반대)** — `semantic.css`에서 `--color-primary`, `--color-accent`, 상태색(`--color-success` 등)을 유채색으로 교체하세요. 단, 컴포넌트는 그대로 동작합니다(상태는 아이콘+텍스트로도 구분되므로 색을 더해도 접근성은 유지됨).
3. **모서리/그림자/여백 성격 변경** — `--radius-*`, `--shadow-*`, `--space-*` 스케일만 조정.
4. **폰트 교체** — `tokens.css`의 `--font-sans` / `--font-mono` 한 줄.
5. **컴포넌트 추가** — `components/`에 새 파일을 만들고 `components/index.css`에 `@import` 한 줄 추가. 시맨틱 토큰만 사용할 것(원시값 직접 참조 금지).

> 규칙: 컴포넌트는 `--color-*`/`--space-*` 같은 **시맨틱·스케일 토큰만** 참조하고, `--neutral-500` 같은 **원시값을 직접 쓰지 않습니다.** 이 경계가 테마 교체를 가능하게 합니다.

---

## 7. 브라우저 지원

모던 에버그린 브라우저(Chrome/Edge/Safari/Firefox 최신). CSS 변수, `:has()`, `grid-template-rows` 트랜지션, `backdrop-filter`를 사용합니다. 외부 의존성 없음.
