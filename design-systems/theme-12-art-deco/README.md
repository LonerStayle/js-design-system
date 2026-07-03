# Maison Déco — Theme 12 · Art Deco 디자인 시스템

> 검은 밤과 메탈릭 골드, 에메랄드의 광채. 1920~30년대의 글래머(개츠비·크라이슬러
> 빌딩)를 현대의 프로덕션 UI로 옮긴 **순수 CSS 디자인 시스템**. 외부 프레임워크 0,
> 빌드 스텝 0 — 모든 HTML이 더블클릭(`file://`)만으로 렌더·동작합니다.

---

## 1. 디자인 철학

Art Deco는 *장식이 곧 구조*인 양식입니다. 미니멀·플랫·캐주얼의 반대편 —
**화려함, 우아함, 좌우 대칭, 기하학적 광채**를 지향합니다.

| 원칙 | 적용 |
|------|------|
| **흑금(黑金)이 정본** | 다크가 기본 무드. 블랙(`#0E0E10`)·딥 네이비 배경 위에 메탈릭 골드(`#C9A24B`)가 라인·테두리·강조로 빛납니다. |
| **에메랄드 보조** | 제이드/에메랄드(`#0F7A6B`)가 성공·강조·차트에 절제되어 등장합니다. |
| **크림 텍스트** | 본문 텍스트는 크림(`#F3ECDD`) — 블랙 위에서 4.5:1 이상 대비. |
| **기하학적 장식** | 부채꼴 선버스트 · 계단형 지구라트 · 셰브론/지그재그 · 세로 플루팅 · 방사형 대칭 프레임. 전부 순수 CSS·인라인 SVG. |
| **거의 직각** | 모서리는 `2~4px` 또는 계단형 코너(`--corner-step`). 둥근 디자인을 지양합니다. |
| **대칭 중심 정렬** | 히어로·헤더·모달은 중앙 정렬. 골드 더블 헤어라인으로 마감. |
| **우아한 모션** | `--ease-emphasized` 기반의 페이드/라이즈. 화려하되 차분하게. |

### 타이포그래피
- **디스플레이**: `Cinzel`(개츠비 타이틀풍 세리프, 와이드 캡스) — 폴백 `Copperplate`/`Didot`/`Bodoni 72`.
- **본문**: `Cormorant Garamond`(정갈한 세리프) — 폴백 `Didot`/`Georgia`.
- **UI/캡스 라벨**: `Poiret One`(가는 기하학 산세리프) — 폴백 `Century Gothic`/`Futura`.
- **모노**: `DM Mono`.
- Google Fonts 를 우선 로드하되, 오프라인에서도 macOS 데코 폴백으로 무드를 유지합니다.

---

## 2. 파일 구조

```
theme-12-art-deco/
├── tokens.css          # 원시 토큰 (색 램프·스케일·장식/메탈릭·모션)
├── semantic.css        # 시맨틱 + 컴포넌트 토큰 (다크 정본 / 라이트)
├── base.css            # 리셋·타이포·접근성·장식 유틸·레이아웃 유틸
├── components/
│   ├── index.css       # 애그리게이터 (@import 6종)
│   ├── buttons.css     # Button · ButtonGroup
│   ├── forms.css       # Input·Select·Check·Toggle·Slider·Combobox·FileUpload …
│   ├── display.css     # Card·StatCard·Badge·Avatar·Timeline·Carousel …
│   ├── data.css        # Table·Accordion·Tabs·Calendar·DatePicker
│   ├── navigation.css  # Navbar·Sidebar·Breadcrumb·Pagination·Menu·Steps
│   └── feedback.css    # Alert·Toast·Modal·Drawer·CommandPalette·Progress …
├── app.js              # 모든 인터랙션 + 테마 전환 (바닐라 JS, 의존성 0)
├── index.html          # 허브: 선버스트 히어로 + 토큰/장식 비주얼 + 갤러리 + pages 링크
├── pages/              # 9개 실데모 화면
│   ├── dashboard.html  # 01 분석 대시보드
│   ├── kanban.html     # 02 칸반 보드 (드래그앤드롭)
│   ├── inbox.html      # 03 이메일 인박스 (3패널)
│   ├── product.html    # 04 상품 상세 (럭셔리 부티크)
│   ├── pricing.html    # 05 가격표 (월/연 토글)
│   ├── settings.html   # 06 설정 (탭+토글+위험영역)
│   ├── onboarding.html # 07 온보딩 위저드 (Steps)
│   ├── profile.html    # 08 프로필/계정
│   └── 404.html        # 09 404 + 빈 상태
├── README.md
└── CHECKLIST.md
```

**로드 순서** (HTML `<head>`):
```html
<link rel="stylesheet" href="tokens.css" />     <!-- 1. 원시 토큰 -->
<link rel="stylesheet" href="semantic.css" />   <!-- 2. 시맨틱 매핑 -->
<link rel="stylesheet" href="base.css" />        <!-- 3. 리셋·유틸 -->
<link rel="stylesheet" href="components/index.css" /> <!-- 4. 컴포넌트 -->
...
<script src="app.js"></script>                   <!-- 본문 끝 -->
```
`pages/` 안의 파일은 경로에 `../` 접두사를 붙입니다.

---

## 3. 토큰 레퍼런스

### 3.1 색 램프 (원시 — `tokens.css`)
각 램프는 `50`(밝음) → `900`(어두움). 컴포넌트는 직접 쓰지 말고 시맨틱 토큰을 거칩니다.

| 램프 | 시그니처 | 용도 |
|------|----------|------|
| `--gold-50 … 900` | `--gold-400` `#C9A24B` | 라인·테두리·강조·메탈릭 텍스트 |
| `--emerald-50 … 900` | `--emerald-600` `#0F7A6B` | 보조 강조·성공·차트 |
| `--neutral-50 … 900` | 크림 `#F3ECDD` ↔ 블랙 `#0E0E10` | 배경·표면·텍스트 |
| `--navy-50 … 900` | `--navy-800` `#0D1322` | 딥 네이비 배경 계열 |
| 상태 | `--ruby-*` `--amber-*` `--sapphire-*` | danger·warning·info |

### 3.2 메탈릭 / 장식 토큰
| 토큰 | 설명 |
|------|------|
| `--metal-gold` | 7-스톱 메탈릭 골드 그라데이션 (버튼·텍스트 클립·프레임) |
| `--metal-gold-soft` | 부드러운 3-스톱 골드 |
| `--gold-hairline` / `--gold-hairline-strong` | 골드 1px 테두리 색 |
| `--gold-double` | 더블 헤어라인 box-shadow 조합 |
| `--ornament-sunburst` / `--ornament-sunburst-full` | 부채꼴/방사형 선버스트 (conic-gradient) |
| `--ornament-chevron` | 셰브론/지그재그 패턴 |
| `--ornament-ziggurat` | 계단형 스텝 라인 |
| `--fluting` / `--fluting-tight` | 세로 플루팅(홈) 텍스처 |
| `--corner-step` | 계단형 코너 clip-path 폴리곤 |
| `--grain` | 미세 그레인 노이즈 (data-URI SVG) |

### 3.3 스케일
- **간격**: `--space-0 … 16` (0 → 192px)
- **타이포 사이즈**: `--text-2xs … 7xl` (11px → 76px)
- **줄간격**: `--leading-none/tight/snug/normal/relaxed`
- **자간**: `--tracking-tight … caps` (`--tracking-caps` = `0.34em`, 개츠비 캡스)
- **모서리**: `--radius-none/sm(2px)/md(4px)/pill` + `--corner-step`
- **보더**: `--border-1/2/thick`
- **그림자/글로우**: `--shadow-xs/sm/md/lg`, `--glow-gold/-sm`, `--glow-emerald`
- **포커스 링**: `--ring-shadow` (골드 2px + 오프셋)
- **z-index**: `--z-base … max` (sticky/dropdown/overlay/drawer/modal/popover/toast/tooltip)
- **모션**: `--ease-emphasized/standard/decelerate/accelerate`, `--duration-fast(160)/base(280)/slow(460)/slower(720)`

### 3.4 시맨틱 토큰 (`semantic.css`)
`:root`/`[data-theme="dark"]` = 정본, `[data-theme="light"]` = 크림 글래머.

| 그룹 | 토큰 |
|------|------|
| 배경/표면 | `--color-bg` `--color-bg-elevated` `--color-surface` `--color-surface-2/3` `--color-surface-inset` `--color-backdrop` |
| 텍스트 | `--color-text` `--color-text-strong/muted/subtle/inverse` |
| 브랜드 | `--color-primary`(=gold) `-hover/-active/-fg/-soft/-border` |
| 강조 | `--color-accent`(=emerald) `-hover/-fg/-soft` |
| 보더 | `--color-border` `-strong/-muted` `--color-divider` |
| 상태 | `--color-success/warning/danger/info` (+`-fg`/`-soft`) |
| 컴포넌트 | `--btn-*` `--card-*` `--input-*` `--overlay-*` `--table-*` `--tooltip-*` `--chart-1…5` |

---

## 4. 컴포넌트 목록 (68종)

**폼** — Button(primary/secondary/ghost/danger/icon × sm/md/lg × hover/active/disabled/loading),
ButtonGroup, Input, Textarea, Select, MultiSelect, Combobox/Autocomplete, Checkbox, Radio,
Toggle/Switch, SegmentedControl, Slider, Stepper, DatePicker, FileUpload, SearchBar, Rating, ChipInput.

**표시** — Card(+ornate 프레임), StatCard, Badge/Tag, Avatar/AvatarGroup, Tooltip, Popover,
Accordion, Tabs, Table(정렬·선택·페이지네이션), List, Timeline, KanbanCard, CodeBlock, Skeleton,
EmptyState, Carousel, Calendar.

**피드백/오버레이** — Alert/Banner, Toast(스택), Modal/Dialog(선버스트 헤더), Drawer,
CommandPalette(⌘K), Progress(바/원형), Spinner, InlineNotification.

**내비** — Navbar, Sidebar(접힘), Breadcrumb, Pagination, Menu/Dropdown, ContextMenu, Steps/Wizard.

> 각 컴포넌트의 정확한 클래스·마크업은 `index.html`의 컴포넌트 갤러리가 살아있는
> 레퍼런스입니다. 모든 컴포넌트는 키보드 조작·ARIA 속성을 갖춥니다.

### 인터랙션 (선언형 `data-*` — `app.js`가 자동 연결)
| 속성 | 동작 |
|------|------|
| `data-theme-toggle` | 다크/라이트 전환 (localStorage 저장) |
| `data-tabs` / `data-accordion`(+`-single`) | 탭 / 아코디언 |
| `data-modal-open="id"` `data-modal-close` | 모달 (포커스 트랩·ESC·백드롭) |
| `data-drawer-open="id"` `data-drawer-close` | 드로어 |
| `data-toast` `data-toast-title` `data-toast-msg` | 토스트 (스택·자동 소멸) |
| `data-dropdown-toggle` / `data-contextmenu="id"` | 드롭다운 / 우클릭 메뉴 |
| `data-toggle`(+`data-onchange="billing"`) | 세그먼트/버튼그룹, 가격표 월/연 연동 |
| `data-carousel` `data-sidebar-toggle` `data-sidebar-mobile` | 캐러셀 / 사이드바 |
| `data-copy` `data-calendar` `data-datepicker-toggle` `data-combo`(+`-multi`) | 복사 / 캘린더 / 콤보박스 |
| `data-reveal` | 스크롤 진입 페이드업 |
| `⌘K` / `Ctrl+K` | 명령 팔레트(페이지에 `#cmdk` 존재 시) |

**JS API**: `Deco.toast({title, message, variant, timeout})`, `Deco.openModal(id)`,
`Deco.closeModal(id)`, `Deco.openDrawer(id)`, `Deco.closeDrawer(id)`.

---

## 5. 테마 교체 가이드

이 시스템의 색·무드는 **전부 토큰**으로 흐릅니다. 컴포넌트 CSS를 건드리지 않고
다음 두 파일만으로 리스킨할 수 있습니다.

### 5.1 브랜드 색 바꾸기
`tokens.css`의 램프 값만 교체하면 전 컴포넌트에 전파됩니다.
```css
/* 예: 골드 → 로즈골드, 에메랄드 → 사파이어로 */
--gold-400: #C9A24B;   /* → #C98B7A 로 변경 */
--emerald-600: #0F7A6B; /* → #2E6390 로 변경 */
--metal-gold: linear-gradient(135deg, …);  /* 그라데이션 스톱도 함께 */
--rgb-gold: 201 162 75; /* rgba() 조립용 — 같이 갱신 */
```

### 5.2 시맨틱 매핑 바꾸기
`semantic.css`에서 의미↔색 연결만 조정합니다 (예: primary를 emerald로).
```css
--color-primary: var(--emerald-600);
--color-accent:  var(--gold-400);
```

### 5.3 라이트/다크
`<html data-theme="dark">`가 기본. `data-theme-toggle` 버튼 또는
`document.documentElement.setAttribute('data-theme','light')`로 전환합니다.
선택값은 `localStorage["deco-theme"]`에 저장됩니다.

### 5.4 장식 강도 조절
선버스트/플루팅의 골드 알파(`rgba(var(--rgb-gold), 0.xx)`)를 낮추면 더 절제된,
높이면 더 화려한 무드가 됩니다. `--corner-step` 폴리곤의 `10px`을 키우면 계단이 깊어집니다.

---

## 6. 접근성

- **대비**: 골드/에메랄드 면 위 텍스트는 항상 진한 fg 토큰(`--color-on-gold`, `--color-primary-fg`)을
  사용해 4.5:1 이상을 확보합니다. 골드 위 흰색 조합은 쓰지 않습니다.
- **장식**: 모든 선버스트/플루팅/코너 마커는 `aria-hidden` — 의미는 텍스트가 전달합니다.
- **포커스**: 키보드 사용자에게 골드 2px 포커스 링(`:focus-visible`)이 또렷하게 보입니다.
- **모션**: `prefers-reduced-motion: reduce`에서 모든 애니메이션/트랜지션이 사실상 0이 됩니다.
- **키보드**: 탭/아코디언/모달/드로어/팔레트/메뉴/캐러셀/칸반 모두 키보드로 조작 가능,
  모달·드로어는 포커스 트랩과 ESC 닫기를 지원합니다.
- **시맨틱**: `role`/`aria-*`/`aria-current`/`aria-selected`/`aria-expanded`를 일관되게 부여합니다.

자세한 자가 점검 결과는 [CHECKLIST.md](./CHECKLIST.md)를 참고하세요.

---

## 7. 사용법

별도 빌드·서버 없이 **파일을 더블클릭**하면 됩니다.
1. `index.html` — 디자인 시스템 허브 (토큰·장식·컴포넌트·데모 링크).
2. `pages/*.html` — 9개 실데모 화면.

새 화면을 만들 때는 `index.html`의 갤러리 마크업을 복사해 조합하고,
색은 항상 시맨틱 토큰(`var(--color-*)`)으로 칠하세요.

---

*Maison Déco · Theme 12 — Art Deco. 순수 CSS, 0 프레임워크, © 1925–2026.*
