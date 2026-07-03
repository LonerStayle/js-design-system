# Aurora Glass — Glassmorphism Design System

> **theme-04** · 비비드한 오로라 메시 위에 떠 있는 반투명 유리 패널.
> 순수 CSS + 바닐라 JS, 외부 프레임워크 0. 모든 HTML은 더블클릭(`file://`)만으로 렌더·동작합니다.

![themes](light/dark) · 60+ 컴포넌트 · 9개 데모 화면 · 풀 토큰 스케일

---

## 1. 디자인 철학

글래스모피즘의 핵심은 **"깊이"** 입니다. 이 시스템은 세 겹의 레이어로 깊이를 만듭니다.

1. **배경 (Aurora Mesh)** — 화면 전체를 덮는 고정 레이어. 바이올렛 → 블루 → 마젠타 → 시안의 멀티컬러 메시 그라데이션과, 천천히 떠다니는 컬러 블롭(blob)이 분위기를 만듭니다.
2. **유리 표면 (Frosted Glass)** — 반투명 패널(`rgba alpha`) + `backdrop-filter: blur(12~28px)` + 1px 라이트 보더 + 상단 스페큘러 하이라이트 라인. 모든 표면은 그 뒤의 오로라를 **굴절시켜** 비춰 보입니다.
3. **콘텐츠 (Readable Layer)** — 텍스트는 항상 충분히 불투명한 `--glass-bg-strong` 위에 올려 대비 4.5:1 이상을 확보합니다.

**무드**: 투명 · 부유 · 경쾌. 무겁고 불투명한 면은 쓰지 않습니다.
**시그니처 모션**: 호버 시 글로우가 강해지고 살짝 떠오릅니다(`translateY(-2px)`). 포커스는 평평한 아웃라인이 아니라 **비비드 글로우 링**입니다.
**형태**: 큰 라운드(`--radius-lg` 24px)와 알약형 버튼, 부드러운 소프트 섀도 + 컬러 글로우.

---

## 2. 파일 구조

```
theme-04-glassmorphism/
├── theme.css            # 단일 진입점 — 이 한 줄만 링크하면 전체 로드 (@import 순서 보장)
├── tokens.css           # 원시 토큰: 색 램프, 유리 토큰, 전 스케일
├── semantic.css         # 시맨틱·컴포넌트 토큰 + 라이트/다크 + 투명도 폴백
├── base.css             # 리셋, 타이포, 오로라 메시 배경, 레이아웃 유틸
├── components/
│   ├── layout.css       # app-shell · topbar · 3-pane
│   ├── buttons.css      # Button · ButtonGroup · IconButton · FAB
│   ├── forms.css        # Input · Textarea · Select · Search · FileUpload · Combobox
│   ├── controls.css     # Checkbox · Radio · Switch · Segmented · Slider · Stepper · Rating · ChipInput
│   ├── card.css         # Card · StatCard · KanbanCard · Tile
│   ├── badge.css        # Badge · Tag · Chip · Avatar · AvatarGroup
│   ├── table.css        # 정렬 · 선택 · 페이지네이션 테이블
│   ├── data-display.css # List · Timeline · Accordion · Tabs · CodeBlock · Calendar · Carousel · Skeleton · EmptyState
│   ├── navigation.css   # Navbar · Sidebar · Breadcrumb · Pagination · Steps · Menu · ContextMenu
│   ├── overlay.css      # Modal · Drawer · Popover · Tooltip · CommandPalette(⌘K)
│   └── feedback.css     # Alert · Banner · Toast · Progress · Spinner · InlineNotification
├── app.js               # 모든 인터랙션 (테마/패럴랙스/모달/드로어/토스트/탭/⌘K/테이블/칸반/위저드 …)
├── index.html           # 허브 — 랜딩 + 토큰 비주얼 + 컴포넌트 갤러리 + 페이지 링크
├── pages/               # 9개 실데모 화면
│   ├── dashboard.html   # 1) 분석 대시보드 (글래스 위젯 + 차트 + 정렬 테이블)
│   ├── kanban.html      # 2) 칸반 보드 (드래그&드롭)
│   ├── inbox.html       # 3) 이메일 인박스 (3패널)
│   ├── product.html     # 4) 이커머스 상품 상세
│   ├── pricing.html     # 5) 가격표 (월/연 토글)
│   ├── settings.html    # 6) 설정 (탭 + 토글 + 위험 영역)
│   ├── onboarding.html  # 7) 온보딩 위저드 (Steps)
│   ├── profile.html     # 8) 프로필 / 계정
│   └── 404.html         # 9) 404 + 빈 상태
├── README.md            # 이 문서
└── CHECKLIST.md         # 구현·접근성 자가점검 결과
```

### 사용법

HTML `<head>`에 한 줄만 추가하면 전체 시스템이 로드됩니다.

```html
<!-- 루트(index.html)에서 -->
<link rel="stylesheet" href="./theme.css" />
<!-- 하위 폴더(pages/*.html)에서 -->
<link rel="stylesheet" href="../theme.css" />

<!-- 인터랙션 (</body> 직전) -->
<script src="./app.js"></script>
```

`theme.css`의 `@import` 경로는 **자기 자신 기준**으로 해석되므로, 루트든 `pages/`든 상대 경로(`./` 또는 `../`)만 맞추면 동일하게 동작합니다.

폰트는 Google Fonts(Plus Jakarta Sans + JetBrains Mono)를 쓰지만, 오프라인이어도 시스템 산세리프로 **우아하게 폴백**됩니다.

---

## 3. 토큰 레퍼런스

### 3.1 색 램프 (tokens.css)

| 램프 | 스텝 | 대표값 | 용도 |
|---|---|---|---|
| `--violet-{50..900}` | 50~900 | `--violet-500` `#7C5CFF` | Primary · 시그니처 |
| `--cyan-{50..900}` | 50~900 | `--cyan-400` `#22D3EE` | Accent · 일렉트릭 |
| `--magenta-{50..900}` | 50~900 | `--magenta-500` `#EC4DAE` | 메시의 열기 · 강조 |
| `--neutral-{50..950}` | 50~950 | — | 텍스트 · 중립 |

배경 메시 스톱: `--bg-grad-1`(violet) · `--bg-grad-2`(blue) · `--bg-grad-3`(magenta) · `--bg-grad-4`(cyan).

### 3.2 유리 토큰

| 토큰 | 의미 |
|---|---|
| `--glass-bg` | 기본 프로스티드 패널 (낮은 alpha) |
| `--glass-bg-strong` | **가독용** 더 불투명한 표면 (텍스트는 여기 위에) |
| `--glass-bg-solid` | backdrop-filter 미지원/투명도 축소 시 폴백 |
| `--glass-border` | 1px 라이트 림 |
| `--glass-highlight` | 상단 스페큘러 하이라이트 |
| `--glass-inner` | 내부 하이라이트 워시 |
| `--glass-blur` / `--glass-blur-strong` | `backdrop-filter` 블러 (18 / 28px) |
| `--glass-tint` | 미세 바이올렛 필름 |
| `--glass-edge` | 상단 림 + 내부 1px 하이라이트 조합 박스섀도 |

### 3.3 스케일

| 그룹 | 토큰 |
|---|---|
| 간격 | `--space-0 … --space-16` (4px 리듬) |
| 타이포 | `--text-2xs … --text-6xl`, `--leading-*`, `--tracking-*`, `--weight-*` |
| 모서리 | `--radius-xs/sm/md/lg/xl/2xl/full` (전반적으로 큼) |
| 보더 | `--border-1`, `--border-2` |
| 그림자 | `--shadow-sm/md/lg/xl` (소프트) |
| 글로우 | `--glow-violet/cyan/magenta`, `--glow-accent` |
| 링(포커스) | `--ring-violet/cyan/danger` |
| 모션 | `--ease-emphasized/out/spring`, `--duration-fast/base/slow` |
| z-index | `--z-sticky … --z-cmdk` |
| 브레이크포인트 | `--bp-sm/md/lg/xl/2xl` |

### 3.4 시맨틱 토큰 (semantic.css)

`--color-bg` · `--color-surface`(=glass) · `--color-surface-2`(=glass-strong) · `--color-text` / `--color-text-muted` / `--color-text-subtle` · `--color-primary`(=violet) / `--color-primary-fg` · `--color-accent`(=cyan) · `--color-border`(=glass-border) · `--color-success/warning/danger/info`.

컴포넌트 토큰: `--btn-*`, `--card-*`, `--input-*`, `--nav-*`, `--modal-*`, `--table-*` … (전부 유리 기반).

라이트/다크 두 테마 모두 제공. `prefers-reduced-transparency`와 backdrop-filter 미지원 브라우저에는 **불투명 폴백**이 자동 적용됩니다.

---

## 4. 컴포넌트 목록 (카테고리별)

- **폼**: Button(primary/secondary/ghost/accent/danger/icon × sm/md/lg × hover/active/disabled/loading), ButtonGroup, Input, Textarea, Select, MultiSelect, Combobox/Autocomplete, Checkbox, Radio, Toggle/Switch, SegmentedControl, Slider, Stepper, DatePicker(Calendar), FileUpload, SearchBar, Rating, ChipInput.
- **표시**: Card, StatCard, Badge/Tag, Chip, Avatar/AvatarGroup, Tooltip, Popover, Accordion, Tabs, Table(정렬·선택·페이지네이션), List, Timeline, KanbanCard, CodeBlock, Skeleton, EmptyState, Carousel, Calendar.
- **피드백/오버레이**: Alert/Banner, Toast(스택, 글래스), Modal/Dialog, Drawer, CommandPalette(⌘K), Progress(바/원형), Spinner, InlineNotification.
- **내비**: Navbar(글래스 고정), Sidebar(접힘), Breadcrumb, Pagination, Menu/Dropdown, ContextMenu, Steps/Wizard.

모든 인터랙티브 컴포넌트는 키보드 조작과 ARIA 속성을 갖췄습니다. 전체 클래스·동작 표는 `index.html`의 컴포넌트 갤러리에서 살아있는 예제로 확인할 수 있습니다.

### app.js 동작 훅 (data 속성)

| 기능 | 사용법 |
|---|---|
| 다크 모드 | `<button data-theme-toggle>` (localStorage 저장) |
| 배경 패럴랙스 | `<button data-parallax-toggle>` (마우스 추적) |
| 커맨드 팔레트 | `<button data-cmdk-open>` 또는 `⌘K`/`Ctrl+K` + `#cmdk` 마크업 |
| 모달 | `data-open-target="id"` 트리거 · `.scrim#id` · `data-close` |
| 드로어 | `.drawer#id` + `.drawer-scrim` · `data-open-target` · `data-close` |
| 토스트 | `data-toast="success|info|warning|danger"` `data-toast-title` `data-toast-text` (또는 `AuroraToast.show({...})`) |
| 탭 | `[data-tabs]` + `role=tab/tabpanel` + `aria-selected/controls` |
| 아코디언 | `.accordion[data-single]` + `.accordion-trigger[aria-expanded]` |
| 세그먼트 | `.segmented > button[data-value]` (슬라이딩 thumb 자동, `segchange` 이벤트) |
| 드롭다운 | `.dropdown > [data-dropdown-toggle] + .dropdown-menu[hidden]` |
| 컨텍스트 메뉴 | `[data-contextmenu]` 영역 + `#context-menu` |
| 테이블 | `table[data-sortable]`, `th.sortable[data-type]`, `[data-select-all]`, `[data-row-select]` |
| 슬라이더/스텝퍼/레이팅/칩인풋 | `.range.is-filled` · `.stepper` · `.rating[data-value]` · `.chipinput` |
| 가격 토글 | `.segmented[data-pricing-toggle]` + `[data-price][data-price-month][data-price-year]` |
| 위저드 | `[data-wizard]` + `.step` + `[data-wizard-panel]` + `[data-wizard-back/next]` |
| 칸반 | `[data-kanban]` > `[data-kanban-col]` > `[data-kanban-list]` > `.kanban-card` |
| 스크롤 리빌 | 요소에 `data-reveal` |
| 카운터 애니메이션 | `[data-count]` (+ `data-prefix/suffix/decimals`) |

---

## 5. 교체 가이드 (커스터마이징)

이 시스템은 **토큰 우선** 구조라, 거의 모든 변경이 변수 한두 개로 끝납니다.

- **브랜드 색 바꾸기** → `semantic.css`의 `--color-primary`(와 다크 블록의 같은 변수)만 교체. 버튼/링크/포커스 링/글로우가 전부 따라옵니다.
- **유리 농도 조절** → `--glass-bg`·`--glass-bg-strong`의 alpha 값, 또는 `--glass-blur`만 조절.
- **배경 무드 변경** → `semantic.css`의 `--mesh-1..4`(라이트/다크 각각) 색을 바꾸면 오로라가 통째로 바뀝니다.
- **둥글기/밀도** → `--radius-*`, `--space-*` 스케일.
- **특정 컴포넌트만 리스킨** → 해당 컴포넌트의 `--btn-*`/`--card-*`/`--input-*` 토큰만 오버라이드 (전역 토큰은 그대로).
- **새 테마 추가** → `[data-theme="..."]` 블록을 만들어 시맨틱 변수를 재정의하고, `<html data-theme>` 값만 바꾸면 됩니다.

> 컴포넌트 CSS는 항상 **로컬 컴포넌트 토큰**만 읽고, 그 토큰이 시맨틱 → 원시 순으로 상속받습니다. 따라서 안쪽 레이어를 바꿔도 바깥 마크업은 손대지 않습니다.

---

## 6. 브라우저 지원 & 접근성

- **backdrop-filter 미지원** 브라우저: `@supports` 쿼리로 유리 표면을 충분히 불투명하게 폴백 → 가독성 유지.
- **prefers-reduced-transparency**: 블러 0 + 불투명 표면으로 전환.
- **prefers-reduced-motion**: 모든 애니메이션/패럴랙스/리빌 비활성, 즉시 표시.
- **대비**: 본문 텍스트는 `--glass-bg-strong` 등 불투명 레이어 위에 두어 4.5:1 이상 확보.
- **키보드**: 포커스 글로우 링(`:focus-visible`), 오버레이 포커스 트랩 + ESC 닫기, 스킵 링크, 화살표 키 내비(탭/⌘K).
- **ARIA/시맨틱**: 랜드마크(`header/main/aside/nav`), `role`, `aria-*`, `aria-live` 토스트, 아이콘 버튼 `aria-label`.

자세한 점검 결과는 [`CHECKLIST.md`](./CHECKLIST.md) 참고.

---

## 7. 라이선스 / 크레딧

순수 CSS + 바닐라 JS로 작성되었으며 어떤 외부 런타임 의존성도 없습니다. 아이콘은 전부 인라인 SVG입니다. 자유롭게 복제·수정해 사용하세요.
