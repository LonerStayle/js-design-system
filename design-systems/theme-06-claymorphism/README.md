# 🫧 theme-06 · Claymorphism Design System

> 말랑·통통·생기 넘치는 **점토(clay) 디자인 시스템**.
> 부풀어 오른 클레이 표면, 비비드한 캔디 컬러, 풀 컴포넌트 라이브러리, 그리고 9개의 실데모 화면.
> **외부 CSS/JS 프레임워크 0** — 순수 CSS 토큰 변수 + 바닐라 JS 로만 만들었습니다.
> 모든 HTML 은 더블클릭(`file://`)만으로 렌더·동작합니다.

---

## 1. 디자인 철학 (Design Intent)

Claymorphism 은 "점토/장난감처럼 두툼하게 부풀어 오른" 인터페이스를 지향합니다. 납작하거나
날카로운 면을 피하고, 모든 요소가 **만지고 싶을 만큼 말랑**해 보이도록 합니다.

### 입체 공식 (핵심)
모든 클레이 표면은 **세 겹의 그림자**가 합쳐져 부풀어 오른 느낌을 만듭니다:

| 레이어 | 토큰 | 역할 |
|---|---|---|
| ① 외부 소프트 드롭 | `--clay-shadow` | 아래로 크게 번지는 부드러운 그림자 → 떠 있는 느낌 |
| ② 내부 상단 라이트 | `--clay-inset-light` | 위쪽 안쪽의 밝은 하이라이트 → 빛 받는 윗면 |
| ③ 내부 하단 다크 | `--clay-inset-dark` | 아래쪽 안쪽의 어두운 그림자 → 두께감 |

→ 이 셋을 합친 게 **`--shadow-clay`** 입니다. 컴포넌트는 이 합성 토큰만 쓰면 자동으로 "점토"가 됩니다.

```css
.my-surface {
  background: var(--color-surface);
  border-radius: var(--radius-lg);   /* 아주 큰 라운드 */
  box-shadow: var(--shadow-clay);    /* ①+②+③ */
}
```

### 무드 원칙
- **형태**: 매우 큰 라운드(`--radius-lg` 34px), 버튼·뱃지·칩은 거의 알약형(`--radius-full`). 두툼한 패딩.
- **색**: 밝은 파스텔 배경 + 채도 있는 솔리드 캔디 컬러(코랄/바이올렛/민트/옐로/스카이).
- **모션**: 통통 튀는 스프링(`--ease-emphasized`). hover = 살짝 부풀고 떠오름(scale 1.025 + 섀도↑), active = 눌림(scale 0.97 + inset).
- **아이콘**: 전부 인라인 SVG, 둥근 스트로크(`stroke-linecap: round`).
- **포커스**: 또렷한 컬러 링(`--ring-*`).

---

## 2. 파일 구조

```
theme-06-claymorphism/
├── theme.css            ← 단일 진입점 (이 파일 하나만 링크하면 전체 로드)
├── tokens.css           원시 토큰: 색 램프 6종, 클레이 그림자 공식, 스케일 전부
├── semantic.css         시맨틱·컴포넌트 토큰 + 라이트/다크 (그림자 재계산)
├── base.css             리셋, 폰트, 타이포, 레이아웃 유틸, 배경 메시, 모션 정책
├── components/
│   ├── buttons.css      Button, ButtonGroup
│   ├── forms.css        Input, Textarea, Select, Search, FileUpload, Stepper, Combobox …
│   ├── selection.css    Checkbox, Radio, Switch, Segmented, Slider, Rating, ChipInput, MultiSelect
│   ├── cards.css        Card, StatCard, KanbanCard, PricingCard, EmptyState
│   ├── badges.css       Badge, Tag, Chip, Avatar, AvatarGroup
│   ├── navigation.css   Navbar, Sidebar, Breadcrumb, Pagination, Tabs, Steps, Menu/Dropdown
│   ├── overlays.css     Modal, Drawer, Tooltip, Popover, CommandPalette (⌘K)
│   ├── feedback.css     Alert, Toast, Progress(바/원형), Spinner, Skeleton, InlineNotification
│   └── data-display.css Table, List, Timeline, Accordion, CodeBlock, Carousel, Calendar
├── app.js               모든 인터랙션 + 테마 전환 (바닐라 JS, 의존성 0)
├── index.html           랜딩 + 토큰 비주얼 + 컴포넌트 갤러리 허브
├── pages/               실데모 화면 9종
│   ├── dashboard.html   분석 대시보드 (스탯·차트·테이블)
│   ├── kanban.html      칸반 보드 (드래그&드롭)
│   ├── inbox.html       이메일 인박스 (3패널)
│   ├── product.html     이커머스 상품 상세
│   ├── pricing.html     가격표 (월/연 토글)
│   ├── settings.html    설정 (탭+토글+위험영역)
│   ├── onboarding.html  온보딩 위저드 (Steps)
│   ├── profile.html     프로필 / 계정
│   └── 404.html         404 + 빈 상태 갤러리
├── README.md            (이 문서)
└── CHECKLIST.md         구현·접근성 자가점검 결과
```

### 사용법
HTML 에서 **`theme.css` 하나만** 링크하면 토큰·베이스·전 컴포넌트가 모두 로드됩니다:

```html
<!DOCTYPE html>
<html lang="ko" data-theme="light">
<head>
  <link rel="stylesheet" href="theme.css">     <!-- pages/ 안에서는 ../theme.css -->
</head>
<body>
  …
  <script src="app.js"></script>                <!-- pages/ 안에서는 ../app.js -->
</body>
</html>
```

`data-theme="light"` 또는 `"dark"` 로 테마를 지정합니다. 미지정 시 OS 선호를 따릅니다.

---

## 3. 토큰 레퍼런스

### 3.1 색 램프 (tokens.css)
각 램프는 `50`(가장 밝음) → `900`(가장 짙음) 10단계.

| 램프 | 변수 | 용도 |
|---|---|---|
| Coral | `--coral-50…900` | 강조·accent·danger 계열 |
| Violet | `--violet-50…900` | **primary** (브랜드) |
| Mint | `--mint-50…900` | success |
| Yellow | `--yellow-50…900` | warning |
| Sky | `--sky-50…900` | info |
| Neutral | `--neutral-50…900` | 텍스트·표면·경계 |

### 3.2 클레이 그림자 (tokens.css)
| 토큰 | 설명 |
|---|---|
| `--shadow-clay` | 기본 부푼 표면 (①+②+③) |
| `--shadow-clay-sm` | 칩·뱃지용 미니 |
| `--shadow-clay-lg` | hover·강조 표면 |
| `--shadow-clay-pressed` | 눌림/우물(well) — inset 위주 |
| `--shadow-clay-float` | 모달·팝오버용 깊은 드롭 |
| `--shadow-clay-{coral,violet,mint,yellow,sky}` | 컬러 솔리드 요소용 (틴트 inset) |

### 3.3 시맨틱 토큰 (semantic.css) — 라이트/다크 자동 전환
| 역할 | 변수 |
|---|---|
| 배경 / 표면 | `--color-bg`, `--color-surface`, `--color-surface-2`, `--color-surface-sunken` |
| 텍스트 | `--color-text`, `--color-text-muted`, `--color-text-subtle` |
| 브랜드 | `--color-primary` / `--color-primary-fg` / `--color-primary-soft` |
| 강조 | `--color-accent` / `--color-accent-soft` |
| 상태 | `--color-success`/`warning`/`danger`/`info` (+ `-fg`, `-soft`, `-soft-fg`) |
| 경계·링 | `--color-border`, `--color-ring` |

> **다크 테마**는 `[data-theme="dark"]` 에서 딥 톤 배경 + 채도 유지한 캔디 요소 + **그림자 재계산**
> (드롭은 짙은 블랙, 하이라이트는 은은하게)으로 전환됩니다.

### 3.4 스케일
| 카테고리 | 토큰 |
|---|---|
| 간격 | `--space-0 … --space-16` (4px → 160px) |
| 타이포 크기 | `--text-2xs … --text-6xl` |
| 폰트 | `--font-display`(Baloo 2), `--font-body`(Nunito), `--font-mono`(Fira Code) |
| 라인/자간 | `--leading-*`, `--tracking-*` |
| 모서리 | `--radius-sm`(14) / `md`(22) / `lg`(34) / `xl`(48) / `full` |
| z-index | `--z-dropdown … --z-tooltip` |
| 모션 | `--duration-fast/base/slow`, `--ease-emphasized/spring/out` |

---

## 4. 컴포넌트 목록 (요청 카테고리 전수 구현)

**폼**: Button(primary/secondary/ghost/danger/accent/soft/icon × sm/md/lg × hover/active/disabled/loading), ButtonGroup, Input, Textarea, Select, MultiSelect, Combobox/Autocomplete, Checkbox, Radio, Toggle/Switch, SegmentedControl, Slider, Stepper, DatePicker, FileUpload, SearchBar, Rating, ChipInput.

**표시**: Card, StatCard, Badge/Tag, Avatar/AvatarGroup, Tooltip, Popover, Accordion, Tabs, Table(정렬·선택·페이지네이션), List, Timeline, KanbanCard, CodeBlock, Skeleton, EmptyState, Carousel, Calendar.

**피드백/오버레이**: Alert/Banner, Toast(스택), Modal/Dialog, Drawer, CommandPalette(⌘K), Progress(바/원형), Spinner, InlineNotification.

**내비**: Navbar, Sidebar(접힘), Breadcrumb, Pagination, Menu/Dropdown, ContextMenu, Steps/Wizard.

> 각 컴포넌트의 정확한 마크업은 **`index.html` 의 컴포넌트 갤러리**에서 라이브로 확인할 수 있습니다.

### JS 자동 와이어링 (app.js)
대부분의 인터랙션은 `data-*` 속성만 붙이면 자동 동작합니다:

| 속성 | 동작 |
|---|---|
| `data-theme-toggle` | 라이트/다크 전환 (localStorage 영속) |
| `data-open="#id"` / `data-close` | 오버레이(모달/드로어/⌘K) 열고 닫기 |
| `data-toast data-toast-title="…" data-toast-variant="success"` | 토스트 띄우기 |
| `[data-tabs]` + `[role=tab]` | 탭 (방향키 지원) |
| `[data-accordion="single"]` | 아코디언 |
| `[data-dropdown-toggle]` / `[data-popover-toggle]` | 드롭다운·팝오버 |
| `[data-context-menu="#id"]` | 우클릭 컨텍스트 메뉴 |
| `table[data-sortable]` / `[data-select-all]` | 테이블 정렬·전체선택 |
| `data-rating="4"` | 별점 위젯 자동 생성 |
| `data-carousel` (+`data-autoplay`) | 캐러셀 |
| `[data-calendar]` / `[data-datepicker]` | 캘린더·날짜선택 |
| `.slider` / `.stepper` / `.chip-input` / `.multiselect` / `.combobox` / `.file-upload` | 자동 활성화 |

**전역 API**: `window.Clay.toast({title,text,variant})`, `Clay.openModal('#id')`, `Clay.closeModal('#id')`, `Clay.setTheme('dark')`.

`⌘K` / `Ctrl+K` 로 어디서든 커맨드 팔레트가 열립니다(해당 페이지에 `#cmdk`가 있을 때).

---

## 5. 테마 교체 가이드 (Re-theming)

이 시스템은 **토큰만 바꾸면** 전혀 다른 룩으로 바뀌도록 설계되었습니다. 컴포넌트 CSS 는 손대지 마세요.

1. **색 바꾸기** — `tokens.css` 의 램프 값(`--violet-500` 등)만 교체하면 전 컴포넌트에 전파됩니다.
   브랜드 색을 바꾸려면 `semantic.css` 의 `--color-primary` 가 가리키는 램프를 바꾸세요.
2. **덜 부풀게 / 더 부풀게** — `tokens.css` 의 `--clay-shadow` / `--clay-inset-*` 의 blur·offset·alpha 만
   조정하면 클레이 강도가 전체적으로 바뀝니다.
3. **모서리 둥글기** — `--radius-sm/md/lg/xl` 값만 조정.
4. **폰트** — `--font-display` / `--font-body` 교체 + `base.css` 상단 `@import` 의 구글폰트 URL 수정.
5. **다크 톤 조정** — `semantic.css` 의 `[data-theme="dark"]` 블록에서 배경/표면/그림자 재계산 값만 수정.

> 새 컴포넌트를 추가할 땐 항상 **원시 값 대신 시맨틱/컴포넌트 토큰**(`var(--shadow-clay)`, `var(--color-surface)` …)을
> 참조하세요. 그래야 테마 교체와 다크 모드가 공짜로 따라옵니다.

---

## 6. 접근성

- 모든 텍스트/표면 조합 **대비 4.5:1 이상** (파스텔·컬러 클레이 위 텍스트 포함). 자세한 측정은 `CHECKLIST.md`.
- 상태는 **색만이 아니라 아이콘/형태 단서**를 병행 (뱃지 점, 체크/경고 아이콘 등).
- 키보드: 모든 인터랙티브 요소 포커스 가능, **또렷한 컬러 포커스 링**, 모달 포커스 트랩, 탭 방향키.
- `prefers-reduced-motion: reduce` 시 통통 애니메이션·시머·플로팅을 모두 축소/정지.
- ARIA: `role`, `aria-selected`, `aria-expanded`, `aria-current`, `aria-modal`, `aria-live`(토스트) 등 적용.

---

## 7. 라이선스 / 비고
- 폰트는 Google Fonts(Baloo 2 / Nunito / Fira Code)를 CDN 으로 로드합니다. 오프라인이면 시스템 라운드 산세리프로 폴백됩니다.
- 이미지·아이콘은 전부 인라인 SVG·CSS — 외부 에셋 의존성이 없습니다.
