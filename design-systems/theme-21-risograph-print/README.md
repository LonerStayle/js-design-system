# theme-21 · Risograph Print

> 형광 스폿 잉크, 오버프린트, 그레인, 어긋난 정합 — 인쇄소의 불완전함을 그대로 토큰으로 옮긴 **프로덕션급 디자인 시스템**.
> 외부 CSS 프레임워크 0개. 순수 CSS 변수 + 바닐라 JS. 모든 화면이 **더블클릭(`file://`)만으로** 렌더·동작합니다.

---

## 1. 디자인 철학

리소그래프(등사 인쇄)는 형광 스폿 잉크를 한 색씩 겹쳐 찍는 아날로그 인쇄 기법입니다. 정합(registration)이 미세하게 어긋나고, 잉크가 종이 결을 따라 번지고, 중간톤은 도트로 표현됩니다. 디지털의 매끈한 완벽함과 정반대에 있는 이 "불완전함의 매력"을 디자인 언어로 삼았습니다.

| 원칙 | 적용 |
|---|---|
| **제한된 형광 스폿 2~3색** | 플루오 핑크 `#FF48B0` · 플루오 블루 `#2B45FF` 주축 + 옵션 옐로/그린. 종이 톤 배경. |
| **오버프린트** | 두 스폿이 겹치면 `mix-blend-mode: multiply` 로 제3색 생성. 플랫 컬러만, 중간톤은 하프톤 도트. |
| **그레인 텍스처** | 전체 화면에 SVG `feTurbulence` 노이즈를 곱연산으로 덧씌워 잉크 입자감. |
| **미스레지스터** | 요소·제목에 2~5px 어긋난 색 레이어. 호버 시 어긋남이 강조됨. |
| **그라데이션·소프트섀도 금지** | 깊이는 흐림이 아니라 **하드 오프셋(press offset)** 그림자로. |
| **굵은 그로테스크 타이포** | 진(zine) 포스터풍 큰 제목 — Bricolage Grotesque + Archivo + Space Mono. |

라이트 테마는 **종이 톤(뉴스프린트) 정본**, 다크 테마는 **잉크 다크 배경 위에서 형광 스폿이 빛나는** 인쇄물입니다.

---

## 2. 폴더 구조

```
theme-21-risograph-print/
├── tokens.css            # 원시 토큰: 형광 램프(50~900), 리소 토큰, 전체 스케일
├── semantic.css          # 시맨틱·컴포넌트 토큰 (라이트/다크), tokens.css 참조
├── base.css              # 리셋, 타이포, 그레인 오버레이, 오버프린트/하프톤/미스레지스터 유틸, 레이아웃
├── styles.css            # ⭐ 단일 진입점 — 위 + 아래 컴포넌트를 @import (이 파일만 link)
├── components/
│   ├── buttons.css       # Button, ButtonGroup, IconButton
│   ├── forms.css         # Input·Select·Checkbox·Radio·Toggle·Slider·Stepper·DatePicker·FileUpload·Combobox·MultiSelect·ChipInput·Rating·SearchBar·SegmentedControl
│   ├── display.css       # Card·StatCard·Badge·Avatar·Tooltip·Popover·Accordion·Tabs·Table·List·Timeline·KanbanCard·CodeBlock·Skeleton·EmptyState·Carousel·Calendar
│   ├── feedback.css      # Alert·Banner·Toast·Modal·Drawer·CommandPalette·Progress·Spinner·InlineNotification
│   ├── navigation.css    # Navbar·Sidebar·Breadcrumb·Pagination·Menu·ContextMenu·Steps/Wizard
│   └── shell.css         # 앱 셸·페이지 헤더·툴바·차트바·스와치 등 데모 chrome
├── app.js                # 모든 인터랙션 + 미스레지스터 효과 + 테마 전환 (의존성 0)
├── index.html            # 허브: 진 포스터 히어로 + 토큰/오버프린트 비주얼 + 컴포넌트 갤러리 + pages 링크
├── pages/                # 실데모 화면 9종
│   ├── dashboard.html    # 1) 분석 대시보드 (스폿 위젯 + 하프톤 차트 + 정렬 테이블)
│   ├── kanban.html       # 2) 칸반 보드 (드래그 카드)
│   ├── inbox.html        # 3) 이메일/인박스 3패널
│   ├── product.html      # 4) 이커머스 상품 상세 (아트북/굿즈)
│   ├── pricing.html      # 5) 가격표 (3플랜, 월/연 토글)
│   ├── settings.html     # 6) 설정 (탭 + 토글 + 위험 영역)
│   ├── onboarding.html   # 7) 온보딩 위저드 (Steps)
│   ├── profile.html      # 8) 프로필/계정
│   └── 404.html          # 9) 404 + 빈 상태
├── README.md
└── CHECKLIST.md
```

### 빠른 시작
1. `index.html` 을 브라우저에서 더블클릭 → 전체 시스템 허브.
2. 새 화면에서는 단일 진입점만 링크하면 됩니다.
   ```html
   <!-- 루트 페이지 -->
   <link rel="stylesheet" href="styles.css">
   <!-- pages/ 하위 페이지 -->
   <link rel="stylesheet" href="../styles.css">
   <script src="../app.js" defer></script>
   ```
   `styles.css` 의 `@import` 경로는 자기 자신 기준으로 해석되므로 하위 폴더에서도 그대로 동작합니다.

> 폰트는 Google Fonts 를 사용합니다. 오프라인이면 시스템 그로테스크/모노 폰트로 자동 폴백되며 레이아웃은 동일하게 유지됩니다.

---

## 3. 토큰 레퍼런스

### 3.1 색 램프 (원시, `tokens.css`)
각 램프는 `50`(종이쪽 옅은 틴트) → `500`(정본 형광 스폿) → `900`(가장 짙은 잉크).

| 램프 | 변수 prefix | 스폿(500) |
|---|---|---|
| 플루오 핑크 | `--fluoro-pink-{50..900}` | `#FF48B0` |
| 플루오 블루 | `--fluoro-blue-{50..900}` | `#2B45FF` |
| 플루오 옐로 | `--fluoro-yellow-{50..900}` | `#F5D800` |
| 플루오 그린 | `--fluoro-green-{50..900}` | `#1FE08A` |
| 페이퍼 뉴트럴 | `--paper-neutral-{50..900}` | `#8A8369` |
| 앵커 | `--ink-black` `#15140E` · `--paper-white` `#FBFAF4` | |

### 3.2 리소 토큰
| 토큰 | 의미 |
|---|---|
| `--grain-texture` | 타일 SVG 노이즈 오버레이 (newsprint tooth) |
| `--grain-opacity` / `--grain-opacity-dark` | 라이트/다크 그레인 농도 |
| `--overprint` | `multiply` — 스폿 겹침 블렌드 |
| `--misregister-offset` (`-sm`/`-lg`) | 색 정합 어긋남 거리 (2/3/5px) |
| `--halftone` / `--halftone-pitch` | 도트 채움 그라데이션 + 간격 |
| `--paper-tone` / `--ink-edge` | 종이 톤 / 잉크 가장자리 색 |

### 3.3 스케일
- **간격** `--space-0 … --space-16` (4px 그리드).
- **타이포** `--text-2xs … --text-6xl`, `--leading-*`, `--tracking-*`, `--weight-regular … --weight-black`.
- **모서리** `--radius-sm 3px` / `--radius-md 6px`(정본) / `--radius-lg 10px` / `--radius-pill`.
- **보더** `--border-1 … --border-4` (잉크 라인).
- **그림자** `--shadow-flat`(하드 오프셋), `--shadow-spot`(스폿 오프셋), `--shadow-press`. 블러 그림자 없음.
- **링** `--ring-pink/blue/yellow`, `--ring-width 2px`.
- **z-index** `--z-base … --z-tooltip`(1500).
- **브레이크포인트** `--bp-sm 480 / md 768 / lg 1024 / xl 1280 / 2xl 1536`.
- **모션** `--duration-fast 140ms` 등, `--ease-standard`, `--ease-stamp`(스탬프 오버슈트).

### 3.4 시맨틱 토큰 (`semantic.css`)
`--color-bg`(종이톤) · `surface` · `surface-2` · `text`(잉크 다크) · `text-muted` · `primary`(=플루오 핑크) · `primary-fg` · `accent`(=플루오 블루) · `border`(=잉크) · `success`/`warning`/`danger`/`info`(스폿 매핑) · `color-ring`.
컴포넌트 토큰: `--btn-*`, `--card-*`, `--input-*`, `--badge-*`, `--nav-*`, `--sidebar-w`, `--modal-*`, `--drawer-w`, `--toast-w`, `--table-*` …

> **접근성 규칙**: 형광 스폿 채움 위 텍스트는 항상 `--ink-black` 또는 종이톤. **형광 위 형광 금지** — 본문 대비 4.5:1 이상.

---

## 4. 컴포넌트 목록

**폼** — Button(primary/secondary/accent/ghost/danger/outline/icon × sm/md/lg × hover/active/disabled/loading), ButtonGroup, Input, Textarea, Select, MultiSelect, Combobox/Autocomplete, Checkbox, Radio, Toggle/Switch, SegmentedControl, Slider, Stepper, DatePicker, FileUpload(dropzone), SearchBar, Rating, ChipInput.

**표시** — Card(overprint/grain/link), StatCard, Badge/Tag, Avatar/AvatarGroup(halftone), Tooltip, Popover, Accordion, Tabs, Table(정렬·선택·페이지네이션), List, Timeline, KanbanCard, CodeBlock, Skeleton, EmptyState, Carousel, Calendar.

**피드백/오버레이** — Alert/Banner, Toast(스택), Modal/Dialog, Drawer, CommandPalette(⌘K), Progress(바/원형 하프톤), Spinner(+dots), InlineNotification.

**내비** — Navbar, Sidebar(접힘), Breadcrumb, Pagination, Menu/Dropdown, ContextMenu, Steps/Wizard.

### 인터랙션 훅 (app.js, `data-*`)
| 동작 | 마크업 |
|---|---|
| 모달 열기/닫기 | `data-modal-open="id"` / `data-modal-close` |
| 드로어 | `data-drawer-open="id"` / `data-drawer-close` |
| 명령 팔레트 | `data-command-open="id"` + `⌘K`/`Ctrl K` |
| 토스트 | `data-toast="메시지" data-toast-title="제목" data-toast-variant="success\|danger\|info"` |
| 탭 | `[data-tabs]` + `role="tab"`/`aria-controls`/`aria-selected` |
| 아코디언 | `[data-accordion-single]` + `aria-expanded`/`aria-controls` |
| 테이블 정렬·선택 | `[data-table]`, `th.is-sortable`(+`data-sort-number`), `[data-row-select]`/`[data-select-all]` |
| 테마 전환 | `data-theme-toggle` (localStorage 저장) |
| 사이드바 접기 | `data-sidebar-toggle` |
| 슬라이더 출력 | `data-slider-output="outId"` |
| 스텝퍼 | `[data-stepper]` + `.stepper__btn[data-step]` |
| 위저드 | `[data-wizard]` + `[data-wizard-panel]` + `[data-wizard-prev/next]` |
| 캐러셀 | `[data-carousel]` |
| 콤보/멀티셀렉트/데이트픽커/칩인풋/별점/드롭존 | `[data-combobox]` / `[data-multiselect]` / `[data-datepicker]` / `[data-chip-input]` / `[data-rating]` / `[data-dropzone]` |
| 미스레지스터 | `data-misregister-auto`(호버 슬립) · `data-reprint="셀렉터"`(재인쇄 플래시) |
| 등장 애니메이션 | `data-reveal` |

전역 API: `window.Riso.toast({title,msg,variant,duration})`, `Riso.openModal(id)`, `Riso.closeTopLayer()`, `Riso.toggleTheme()`.

---

## 5. 교체 가이드 (리테마)

이 시스템은 **토큰 우선** 구조라 값만 바꾸면 전 컴포넌트에 전파됩니다.

1. **스폿 잉크 교체** — `tokens.css` 의 `--fluoro-pink-500` / `--fluoro-blue-500`(및 램프 50~900)만 바꾸면 버튼·배지·차트·오버프린트가 일괄 변경됩니다. 램프를 통째로 갈려면 동일 prefix의 10단계를 새 색으로 교체.
2. **시맨틱 재배정** — 핑크를 accent로, 블루를 primary로 바꾸고 싶다면 `semantic.css` 의 `--color-primary`/`--color-accent` 매핑만 수정 (원시 램프는 그대로).
3. **종이 톤 변경** — `--paper-neutral-100`(라이트 배경) / 다크의 `--color-bg` 계열을 조정.
4. **질감 강도** — 그레인은 `--grain-opacity`, 미스레지스터는 `--misregister-offset`, 하프톤은 `--halftone-pitch` / `--halftone-dot` 로 제어.
5. **형태 톤** — 모서리(`--radius-md`), 보더 두께(`--border-2/3`), 오프셋 그림자(`--shadow-flat`) 한 줄로 전체 인상 전환.
6. **새 컴포넌트 추가** — `components/` 에 파일을 만들고 `styles.css` 에 `@import` 한 줄 추가. 항상 시맨틱/컴포넌트 토큰만 참조하고 원시 값을 하드코딩하지 말 것.

> ⚠️ 리테마 시에도 **형광 위 텍스트 대비 4.5:1**, **형광 위 형광 금지** 규칙을 유지하세요. 새 스폿을 추가하면 그 위 텍스트는 `--ink-black` 또는 종이톤으로.

---

## 6. 접근성 & 품질 기준

- 본문/형광 위 텍스트 대비 **4.5:1 이상**. 형광 채움 위 텍스트는 잉크 다크/종이톤 고정.
- 상태는 **색 단독이 아니라 색 + 아이콘/텍스트** 병행 (얼럿·배지·토스트·인라인 노트).
- **키보드 조작**: 탭/아코디언/메뉴/테이블 정렬/콤보박스/캐러셀/위저드 모두 키보드 가능. 모달·드로어·⌘K 는 포커스 트랩 + `Esc` 닫기 + 포커스 복원.
- **포커스 링**: 전역 `:focus-visible` 2px 스폿 아웃라인.
- **`prefers-reduced-motion: reduce`**: 그레인 드리프트·미스레지스터 지터·재인쇄 플래시·등장 애니메이션 전부 정지. 본질적 색 분리는 정적으로 유지.
- 외부 CSS/JS 프레임워크 **0개**. 아이콘은 인라인 SVG, 그레인은 SVG/CSS 노이즈.
- 모든 HTML 은 `file://` 더블클릭만으로 렌더·동작하며 반응형 브레이크포인트에 대응.

자세한 자가 점검 결과는 [`CHECKLIST.md`](./CHECKLIST.md) 참고.
