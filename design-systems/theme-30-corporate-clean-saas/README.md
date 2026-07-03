# Aperture — Corporate Clean SaaS Design System

> **theme-30** · 신뢰·산뜻·전문을 지향하는 B2B 제품 대시보드용 디자인 시스템.
> 순수 CSS + 바닐라 JavaScript. 외부 프레임워크·빌드 도구 0. 모든 HTML은 더블클릭(`file://`)만으로 렌더·동작합니다.

---

## 1. 디자인 철학

**Corporate Clean SaaS** 는 Linear·Vercel·Notion 으로 대표되는 정통 B2B 제품 UI의 결을 따릅니다. 핵심은 **요란함의 제거와 위계의 명료함**입니다.

| 축 | 방향 |
|----|------|
| **무드** | 신뢰·산뜻·전문. 레트로/실험적 장식 배제 |
| **색** | 화이트·라이트 그레이 배경 + **인디고 프라이머리(#4F46E5)** + 정돈된 슬레이트 뉴트럴. 상태색(그린/앰버/레드)은 또렷하되 절제 |
| **형태** | 중간 라운드(`--radius-md` 9px), 소프트 엘리베이션 그림자, 미세 보더. 그라데이션은 버튼 호버/헤더 정도만 |
| **타이포** | Inter 산세리프. 타이트한 트래킹의 헤딩 + 가독 본문(14px 기준). 데이터 친화적 tabular-nums |
| **레이아웃** | 카드 기반 대시보드, 깔끔한 테이블, 정렬된 폼. 정보 위계가 분명 |
| **시그니처** | 소프트 엘리베이션 카드 · 인디고 프라이머리 · 호버=미세 엘리베이션/틴트 · 포커스=인디고 2px 링 |

**접근성이 곧 품질**입니다. 텍스트 대비 4.5:1↑, UI 요소·포커스 3:1↑, 상태는 색+아이콘+텍스트 병행, 모든 인터랙티브 요소는 키보드 조작·또렷한 포커스 링·완전한 ARIA·`prefers-reduced-motion`을 갖춥니다.

---

## 2. 파일 구조

```
theme-30-corporate-clean-saas/
├── tokens.css          원시 토큰 (색 램프·간격·타이포·그림자·모션·z-index)
├── semantic.css        시맨틱·컴포넌트 토큰 (라이트 정본 + 다크)
├── base.css            리셋·타이포그래피·레이아웃 유틸·애니메이션
├── theme.css           ★ 번들 — 이 파일 하나만 link 하면 전체 로드
├── components/
│   ├── buttons.css     Button·ButtonGroup·Segmented·Stepper
│   ├── forms.css       Input·Select·Checkbox·Radio·Toggle·Slider·File·Rating·Chip·Combo·DatePicker
│   ├── display.css     Card·StatCard·Badge·Avatar·Table·List·Timeline·Kanban·Code·Skeleton·Empty·Accordion·Tabs·Progress·Calendar·Carousel
│   ├── overlays.css    Alert·Toast·Modal·Drawer·CommandPalette·Tooltip·Popover·Menu·InlineNotification
│   ├── navigation.css  Navbar·Sidebar·Breadcrumb·Pagination·Steps·Dropdown·AppShell
│   └── charts.css      Bar·Line/Area·Donut·Legend·Metric·Heatmap (순수 CSS/SVG)
├── app.js              모든 인터랙션 + 테마 전환 (바닐라, 의존성 0)
├── index.html          허브 — 랜딩 히어로 + 토큰 비주얼 + 컴포넌트 갤러리 + 페이지 링크
├── pages/
│   ├── dashboard.html    분석 대시보드 (KPI·차트·정렬/선택/필터 테이블)
│   ├── kanban.html       칸반 보드 (드래그앤드롭)
│   ├── inbox.html        이메일 인박스 (3패널)
│   ├── billing.html      빌링 & 구독
│   ├── pricing.html      가격표 (월/연 토글)
│   ├── settings.html     설정 (탭·토글·위험 영역)
│   ├── onboarding.html   온보딩 위저드 (Steps)
│   ├── profile.html      프로필 / 계정
│   └── 404.html          404 + 빈 상태
├── README.md
└── CHECKLIST.md
```

### 사용법
```html
<!-- 단 한 줄로 전체 디자인 시스템 로드 -->
<link rel="stylesheet" href="./theme.css" />
<!-- 인터랙션 (body 끝) -->
<script src="./app.js"></script>
```
`index.html`을 더블클릭해서 여세요. 모든 페이지가 상대경로로 연결돼 있어 서버 없이 동작합니다.

---

## 3. 토큰 레퍼런스

### 3.1 색 (원시 — `tokens.css`)
모든 색 램프는 의미를 갖지 않는 팔레트입니다. 컴포넌트는 직접 참조하지 않고 시맨틱을 거칩니다.

| 램프 | 스케일 | 코어 |
|------|--------|------|
| `--neutral-*` (슬레이트) | 0, 50, 100, 150, 200, 300, 400, 500, 600, 700, 800, 850, 900, 950 | 표면·보더·텍스트 |
| `--indigo-*` (프라이머리) | 50–950 | `--indigo-600 #4F46E5` |
| `--blue-*` (액센트/인포) | 50–950 | `--blue-600 #2563EB` |
| `--green-*` (성공) | 50–950 | `--green-600` |
| `--amber-*` (경고) | 50–950 | `--amber-500` |
| `--red-*` (위험) | 50–950 | `--red-600` |

### 3.2 스케일
- **간격** `--space-0 … --space-24` (4px 기준; px/0 포함)
- **타이포 크기** `--text-2xs(11) · xs(12) · sm(13) · base(14) · md(15) · lg(17) · xl(20) · 2xl(24) · 3xl(30) · 4xl(36) · 5xl(48) · 6xl(60)`
- **라인하이트** `--leading-none/tight/snug/normal/relaxed`
- **자간** `--tracking-tighter … widest`
- **라운드** `--radius-xs(3) · sm(5) · md(9) · lg(14) · xl(20) · 2xl(28) · full`
- **그림자** `--shadow-xs/sm/md/lg/xl/2xl` (+ `--shadow-primary` 인디고 틴트, `--shadow-inner`)
- **보더** `--border-1/2/3`
- **링** `--ring-width/offset/color` (인디고)
- **모션** `--ease-standard/emphasized/decel/accel/spring`, `--duration-instant/fast/base/slow/slower`
- **z-index** `--z-base … --z-command(1700)` 표준 레이어

### 3.3 시맨틱 (`semantic.css`)
| 그룹 | 토큰 |
|------|------|
| 표면 | `--color-bg · bg-subtle · surface · surface-2 · surface-3 · overlay` |
| 텍스트 | `--color-text · text-strong · text-muted · text-subtle · text-link` |
| 보더 | `--color-border · border-strong · border-subtle · divider` |
| 프라이머리 | `--color-primary · primary-hover · primary-active · primary-fg · primary-subtle · primary-text` |
| 상태 | `--color-success / warning / danger / info` (+ `-hover/-fg/-subtle/-border/-text` 변형) |
| 차트 | `--chart-1 … chart-6 · chart-grid · chart-axis` |
| 컴포넌트 | `--btn-* · --card-* · --input-* · --table-* · --nav-* · --toast-* · --modal-*` |

**라이트가 정본**이며, `[data-theme="dark"]`는 슬레이트 다크 표면 + 인디고로 동일한 위계를 유지합니다. `prefers-color-scheme: dark`도 자동 대응합니다.

---

## 4. 컴포넌트 목록

**폼** — Button(primary/secondary/ghost/ghost-primary/danger/danger-soft/success/icon × sm/md/lg × hover/active/disabled/loading), ButtonGroup, SegmentedControl, Stepper, Input(+adornment/affix), Textarea, Select, Combobox/MultiSelect, Checkbox, Radio(+카드형), Toggle/Switch, Slider, SearchBar, FileUpload(dropzone), Rating, ChipInput, DatePicker, Field(label/help/error)

**표시** — Card, StatCard(+sparkline), Badge/Tag/Chip, Avatar/AvatarGroup(+status), Table(정렬·선택·필터·페이지네이션·줄무늬·compact), List, Timeline, KanbanCard, CodeBlock, Skeleton, EmptyState, Accordion, Tabs(line/pill), Progress(바/원형/줄무늬), Spinner, Calendar, Carousel, Tooltip

**피드백/오버레이** — Alert/Banner(info/success/warning/danger), InlineNotification, Toast(스택·자동 닫힘·진행바), Modal/Dialog(+confirm), Drawer(좌/우), CommandPalette(⌘K), Popover, Menu/Dropdown/ContextMenu

**내비게이션** — Navbar, Sidebar(접힘·중첩·모바일), Breadcrumb, Pagination, Steps/Wizard(가로/세로), AppShell, UserChip

각 컴포넌트는 키보드 조작과 ARIA 속성을 포함합니다. 상세 클래스는 각 `components/*.css` 상단 주석을 참고하세요.

---

## 5. 인터랙션 (app.js)

| 모듈 | 트리거 | 동작 |
|------|--------|------|
| 테마 전환 | `[data-theme-toggle]` | 라이트/다크 토글 + `localStorage` 영속 |
| 모달 | `[data-modal-open="id"]` / `[data-modal-close]` | 포커스 트랩·ESC·백드롭 클릭 닫기 |
| 드로어 | `[data-drawer-open="id"]` / `[data-drawer-close]` | 좌/우 슬라이드 |
| 토스트 | `[data-toast]` 속성 또는 `Theme30.Toast.show()` | 스택·자동 닫힘·진행바 |
| 탭 | `[data-tabs]` | 좌우 화살표·Home/End 키보드 내비 |
| 아코디언 | `.accordion-trigger` (`[data-accordion-single]`) | 단일/다중 펼침 |
| 드롭다운/메뉴 | `[data-dropdown]` | 외부 클릭·ESC 닫기 |
| 사이드바 | `[data-sidebar-toggle]` | 데스크톱 접힘 / 모바일 오버레이 |
| 테이블 | `[data-sortable]` `[data-selectable]` `[data-table-filter]` | 정렬·전체/개별 선택·실시간 필터 |
| 커맨드 팔레트 | `⌘K` / `Ctrl K` / `[data-cmdk-open]` | 검색·화살표 내비·Enter 실행 |
| 가격 토글 | `[data-billing-toggle]` + `[data-price]` | 월/연 가격 교체 |
| 그 외 | Stepper·Rating·ChipInput·Combobox·비번 토글·복사·Carousel·ScrollSpy·Reveal·Kanban DnD | 자동 바인딩 |

전역 API: `window.Theme30 = { Toast, Modal, Drawer, ThemeManager, CommandPalette }`

---

## 6. 다른 제품에 적용 / 교체 가이드

이 시스템은 **토큰 우선** 구조라 색·형태를 바꿔도 컴포넌트 코드를 건드릴 필요가 없습니다.

1. **브랜드 색 교체** — `tokens.css`의 `--indigo-*` 램프를 자사 프라이머리 램프로 교체하면 버튼·링크·포커스 링·차트가 일괄 변경됩니다. 상태색(`--green/amber/red-*`)도 동일.
2. **시맨틱만 손보기** — 램프는 두되 `semantic.css`의 `--color-primary` 매핑만 다른 램프로 바꿔도 됩니다(예: 블루 프라이머리로 전환 = `--color-primary: var(--blue-600)`).
3. **형태 조정** — `--radius-md`(라운드), `--shadow-*`(엘리베이션 강도)만 바꾸면 전체 톤이 달라집니다.
4. **폰트 교체** — `--font-sans`/`--font-mono` 한 줄. 시스템 폴백이 강해 오프라인에서도 안전합니다.
5. **다크 테마 커스터마이즈** — `[data-theme="dark"]` 블록의 표면/텍스트 토큰만 조정.
6. **새 컴포넌트 추가** — 시맨틱 토큰(`--color-*`)만 참조하면 라이트/다크가 자동으로 따라옵니다. 원시 램프 직접 참조는 지양하세요.

---

## 7. 품질 기준 (요약)

- 외부 CSS 프레임워크 **0** · 순수 CSS 변수 · 아이콘은 전부 인라인 SVG
- 모든 HTML `file://` 더블클릭 렌더·동작 · 반응형(`sm 640 / md 768 / lg 1024 / xl 1280`)
- WCAG AA 대비 · 키보드 포커스 링 · `prefers-reduced-motion` · 완전한 ARIA·role

자세한 점검 결과는 [`CHECKLIST.md`](./CHECKLIST.md) 참고.
