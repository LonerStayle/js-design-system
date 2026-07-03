# THEME 25 — Maximalist Color-block (`COLOR/CLASH`)

> 충돌·에너지·과잉. 큰 색면의 폭발. 미니멀·여백·절제·무채색은 없다.
> 풀채도 멀티휴 색면이 부딪히고 겹치고 대각으로 갈라지는, 거대 타이포의 프로덕션급 디자인 시스템.

순수 CSS + 바닐라 JS. 외부 프레임워크 0. 모든 화면은 **더블클릭(`file://`)만으로** 렌더·동작합니다.

---

## 1. 디자인 철학

| 축 | 결정 |
|----|------|
| **무드** | 충돌·에너지·과잉. 색면이 일부러 부딪힌다. |
| **색** | 핫핑크·일렉트릭블루·라임·오렌지·퍼플·시안·레드·옐로 — 풀채도 8휴를 한꺼번에. |
| **컬러 블록** | 화면을 큰 단색 면으로 분할(대각/기하), 색면 겹침/레이어, 색면 위에 또 다른 색 텍스트. **패턴이 아니라 색면.** |
| **형태** | 중간 라운드(`--radius-md` 8px) 또는 직각. 블록 경계는 또렷. 보더보다 **색 대비**로 구분. |
| **타이포** | 오버사이즈 디스플레이(Archivo Black) — 화면을 채우는 거대 헤드라인. 본문은 가독 산세리프(Space Grotesk). |
| **시그니처** | 거대 헤드라인 + 충돌 색면, 겹치는 레이어, 대각 색 분할. 호버 = 색면 시프트. 포커스 = 보색 솔리드 링. |

### 접근성 우선 (색-온-색 위험 관리)
이 테마의 가장 큰 리스크는 "비비드 위 비비드 텍스트"입니다. 그래서:
- **색면 위 텍스트는 사전 검증된 조합만** 사용합니다. `tokens.css`의 `--block-combo-1..8`은 모두 WCAG AA **4.5:1 이상**을 통과하도록 계산된 (배경, 안전 전경) 쌍입니다.
- 상태는 **색만으로 구분하지 않습니다** — 아이콘 + 형태(`.status-dot--success/warning/danger/info`: 원/다이아몬드/사각/물방울)를 병행해 색맹에 대응합니다.
- `prefers-reduced-motion` 대응, 모든 인터랙티브 요소에 **보색 포커스 링**.

---

## 2. 파일 구조

```
theme-25-maximalist-colorblock/
├── tokens.css            원시 토큰 (8휴×9단계 램프, 블록 토큰, 스케일 전부)
├── semantic.css          시맨틱·컴포넌트 토큰 (라이트/다크 매핑)
├── base.css              리셋·오버사이즈 타이포·컬러블록 유틸·레이아웃·모션
├── theme.css             단일 진입점 (위 3개 + components 전부 @import)
├── components/
│   ├── index.css         컴포넌트 번들 (@import)
│   ├── buttons.css       Button, ButtonGroup
│   ├── forms.css         Input/Textarea/Select/Checkbox/Radio/Switch/Segmented/Slider/Stepper/Search/Rating/ChipInput/FileUpload/DatePicker
│   ├── combobox.css      Combobox/Autocomplete/MultiSelect/listbox
│   ├── display.css       Card/StatCard/Badge/Tag/Avatar/List/Timeline/KanbanCard/CodeBlock/Skeleton/EmptyState
│   ├── interactive.css   Tooltip/Popover/Accordion/Tabs/Table/Carousel/Calendar
│   ├── feedback.css      Alert/Banner/Toast/Modal/Drawer/CommandPalette/Progress/Spinner/InlineNotification
│   └── navigation.css    Navbar/Sidebar/Breadcrumb/Pagination/Menu/ContextMenu/Steps·Wizard
├── app.js                모든 인터랙션 + 테마전환 (의존성 0, DOMContentLoaded 자동 init)
├── index.html            허브 — 거대 히어로 + 토큰/블록 비주얼 + 컴포넌트 갤러리 + 데모 링크
├── pages/                실데모 9종 (아래)
├── README.md
└── CHECKLIST.md
```

### 사용법
어떤 HTML이든 한 줄로 전체 시스템을 불러옵니다 (CSS `@import`는 CSS 파일 기준 상대경로로 해석되므로 `pages/`에서도 동일):

```html
<!-- 루트에서 -->
<link rel="stylesheet" href="theme.css">
<script src="app.js"></script>

<!-- pages/ 안에서 -->
<link rel="stylesheet" href="../theme.css">
<script src="../app.js"></script>
```

> 폰트: Google Fonts(Archivo Black / Space Grotesk / JetBrains Mono)를 사용하되, 오프라인(`file://` + 인터넷 없음)에서는 `Arial Black` / system-ui 폴백으로 자동 대체됩니다.

---

## 3. 토큰 레퍼런스

### 색 램프 (원시) — 각 `50`(밝은 틴트) → `500`(시그니처 비비드) → `900`(깊은 셰이드)
`--pink-* --blue-* --lime-* --orange-* --purple-* --cyan-* --red-* --yellow-* --neutral-*` + `--white --black`

```css
--pink-500: #ff0093;   --blue-500: #004eff;   --lime-300: #c4ff47;   --orange-500: #f56b00;
--purple-500: #8400ff; --cyan-300: #38dbff;   --red-500: #f5001d;    --yellow-500: #ffd400;
```

### 블록 토큰
| 토큰 | 용도 |
|------|------|
| `--block-divide-diagonal` / `-rev` / `--block-divide-wedge` / `-slash` / `-corner` | clip-path 기하 분할 |
| `--block-overlap` (28px) / `-lg` / `-sm` | 레이어 겹침 오프셋 |
| `--block-combo-1..8-bg` / `-fg` | **검증된 색-온-색 조합** (배경 + 4.5:1↑ 안전 전경) |

검증된 조합 (대비):
`1` 핑크/화이트 5.07 · `2` 블루/화이트 5.95 · `3` 옐로/블랙 15.9 · `4` 라임/블랙 14+ · `5` 퍼플/화이트 8.49 · `6` 시안/블랙 12.8 · `7` 오렌지/블랙 6.98 · `8` 레드/화이트 6.12

### 스케일
- 간격 `--space-0 … --space-16` (0 → 256px)
- 타이포 `--text-2xs … --text-7xl` (11px → 화면 채우는 14rem clamp) · `--leading-*` · `--tracking-*` · `--weight-normal/medium/bold/black`
- 모서리 `--radius-sm(4)/md(8)/lg(14)/pill` · 보더 `--border-2/3/4`
- 그림자 `--shadow-flat`(none) / `--shadow-offset`(보색 오프셋) / `--shadow-drop`
- `--z-*` (레이어 겹침 ~ cmdk 1000) · 브레이크포인트 `--bp-sm..2xl` · 보색 링 `--ring-*` · 모션 `--ease-emphasized`, `--duration-fast`

### 시맨틱 (라이트/다크 모두 비비드, 단 대비 안전)
`--color-bg/surface/surface-2/surface-3`, `--color-text/-muted/-faint/-inverse`,
`--color-primary(/-fg/-soft/-soft-fg)`, `--color-accent(...)`,
`--color-success/warning/danger/info(각 /-fg /-soft /-soft-fg)`,
`--color-border/-strong/-divider`, `--color-ring`, `--color-overlay`, `--plane-1..8`

다크 모드는 `data-theme="dark"`로 전환 — 블랙 캔버스 위 네온 블록, 포커스 링은 보색 옐로로 교체.

### 컴포넌트 토큰
`--btn-*`, `--card-*`, `--input-*`, `--badge-*`, `--table-*`, `--tooltip-*`, `--nav-h`, `--sidebar-w`, `--focus-ring` — 모두 시맨틱 변수를 참조하므로 테마 전환 시 자동 적응.

---

## 4. 컴포넌트 목록 (전부 키보드·ARIA 포함)

**폼** — Button(primary/secondary/ghost/danger/success/invert/link × sm/md/lg × hover/active/disabled/loading/icon) · ButtonGroup · Input · Textarea · Select · MultiSelect · Combobox/Autocomplete · Checkbox · Radio · Toggle/Switch · SegmentedControl · Slider · Stepper · DatePicker · FileUpload(드롭존) · SearchBar · Rating · ChipInput

**표시** — Card(컬러 블록) · StatCard(거대 숫자) · Badge/Tag · Avatar/AvatarGroup · Tooltip · Popover · Accordion · Tabs · Table(정렬·선택·페이지네이션) · List · Timeline · KanbanCard · CodeBlock · Skeleton · EmptyState · Carousel · Calendar

**피드백/오버레이** — Alert/Banner(풀 컬러) · Toast(스택) · Modal/Dialog · Drawer · CommandPalette(⌘K) · Progress(바/원형) · Spinner · BlockLoader · InlineNotification

**내비** — Navbar · Sidebar(접힘) · Breadcrumb · Pagination · Menu/Dropdown · ContextMenu · Steps/Wizard

### 인터랙션 트리거 (app.js, 모두 자동 init)
| 동작 | 마크업 |
|------|--------|
| 테마 전환 | `data-theme-toggle` |
| 모달 | `data-modal-open="ID"` + `.overlay#ID > .modal` · 닫기 `data-close` · ESC/백드롭 |
| 드로어 | `data-drawer-open="ID"` + `.overlay#ID > .drawer.right\|left` |
| 커맨드 팔레트 | `data-cmdk-open` 또는 `⌘K`/`Ctrl+K` (+ `#cmdk` 마크업) |
| 토스트 | `data-toast="success\|danger\|info\|warning"` + `data-toast-title/-msg` · 또는 `window.t25toast({...})` |
| 탭/아코디언/메뉴/팝오버/테이블 정렬·선택/슬라이더/스테퍼/세그먼트/콤보박스/레이팅/칩입력/파일업로드/캐러셀/사이드바/위저드/복사 | 위 컴포넌트 마크업 그대로 (자동) |

---

## 5. 쇼케이스 (멀티 페이지)

| # | 파일 | 내용 |
|---|------|------|
| — | `index.html` | 허브 — 히어로 + 토큰/램프/조합 비주얼 + 컴포넌트 갤러리 + 데모 링크 |
| 1 | `pages/dashboard.html` | 분석 대시보드 — 컬러블록 StatCard + CSS 막대차트 + 정렬/선택 테이블 + 타임라인 + 진행 게이지, 필터 드로어·위젯 모달 |
| 2 | `pages/kanban.html` | 칸반 보드 — 5컬럼, **네이티브 드래그앤드롭**(카드 이동 시 카운트 갱신·토스트) |
| 3 | `pages/inbox.html` | 이메일 3패널 — 폴더/목록/읽기창, 클릭하면 읽기창 로드·읽음 처리, 답장·보관·삭제 |
| 4 | `pages/product.html` | 이커머스 상품 상세 — 캐러셀, 색/사이즈/수량, 탭, 리뷰, 관련상품, 장바구니 카운트 |
| 5 | `pages/pricing.html` | 가격표 — **월/연 토글이 실제 가격 변경**, 3플랜, 비교표, FAQ 아코디언 |
| 6 | `pages/settings.html` | 설정 — 탭(일반/알림/보안/결제) + 토글 + **위험 영역**(삭제 확인 모달) |
| 7 | `pages/onboarding.html` | 온보딩 위저드 — 4단계 Steps 실제 진행, 칩입력 초대 |
| 8 | `pages/profile.html` | 프로필/계정 — 커버 색면, 통계, 활동 타임라인, 스킬, 편집 드로어 |
| 9 | `pages/404.html` | 404(색면 그리드) + 빈 상태 3종 |

---

## 6. 교체·커스터마이즈 가이드

**브랜드 색 바꾸기** — `semantic.css`의 매핑만 바꾸면 전체가 따라옵니다. 단, 대비 안전을 유지하세요:
```css
:root {
  --color-primary: var(--blue-600);   /* 핑크 → 블루 */
  --color-primary-fg: var(--white);   /* 반드시 4.5:1↑ 통과하는 전경 */
}
```

**새 색면 조합 추가** — `tokens.css`에서 검증 후 추가:
```css
--block-combo-9-bg: var(--cyan-600);  --block-combo-9-fg: var(--white);  /* 대비 계산 후 */
```
그리고 `base.css`에 `.combo-9 { background:var(--block-combo-9-bg); color:var(--block-combo-9-fg);}`.

**라운드/보더 톤 조절** — `--radius-md`, `--border-3` 한 값만 바꾸면 모든 컴포넌트 반영.

**모션 끄기** — 사용자 OS 설정 `prefers-reduced-motion`이 자동 처리. 전역으로 줄이려면 `--duration-*`을 낮추세요.

**다크를 기본으로** — `<html data-theme="dark">`. (app.js가 localStorage에 마지막 선택을 저장)

---

## 7. 품질 기준 충족
- 색-온-색 대비 4.5:1↑ (검증된 combo만 텍스트 사용) · 상태 = 색 + 아이콘 + 형태 · `prefers-reduced-motion` · 키보드 포커스 링 · ARIA·role
- 외부 CSS 프레임워크 0 · 순수 CSS 변수 · 아이콘 전부 인라인 SVG
- 모든 HTML `file://` 더블클릭 렌더·동작 · 반응형 브레이크포인트 대응

자세한 자가점검 결과는 [`CHECKLIST.md`](./CHECKLIST.md) 참조.
