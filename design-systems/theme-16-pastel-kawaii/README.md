# 🎀 Pastel Kawaii — Design System (theme-16)

> 말랑말랑하고 귀여운 일본 카와이 감성의 프로덕션급 디자인 시스템.
> 하이키 파스텔 · 통통한 라운드 · 하트와 별과 반짝이. **순수 CSS + 바닐라 JS, 외부 프레임워크 0개.**

브라우저에서 `index.html` 을 **더블클릭**하면 바로 열립니다. (빌드 단계 없음 · `file://` 그대로 동작)

---

## ✦ 디자인 철학

| 축 | 선택 | 이유 |
|----|------|------|
| **무드** | 귀엽·말랑·달콤 (Japanese kawaii) | 무겁거나 날카롭거나 채도 강한 느낌을 모두 배제. 보는 순간 미소 짓게 하는 인터페이스. |
| **색** | 하이키 파스텔 (핑크·민트·라벤더·피치·스카이·버터) | 부드럽고 달콤한 사탕 같은 팔레트. 배경은 아주 옅은 파스텔로 공기감. |
| **형태** | 아주 큰 라운드 + 알약형 | 모든 모서리를 둥글게. 버튼·배지는 pill 형태로 말랑한 촉감. |
| **모티프** | 하트 ♡ · 별 ★ · 반짝이 ✦ · 큐트 페이스 | 스티커처럼 흩뿌려진 큐트 액센트가 시그니처. |
| **모션** | 통통 바운스 + 떠다니는 반짝이 | 호버=통통 튀고, active=살짝 눌리고, 클릭=반짝이 버스트. |
| **타이포** | Baloo 2 (display) + Quicksand (body) | 둥글고 친근한 폰트로 통통한 위계. |

**시그니처 한 줄:** *"둥근 모든 것 위에 반짝이가 떠다니고, 누르면 통통 튀며 반짝인다."*

---

## 📁 파일 구조

```
theme-16-pastel-kawaii/
├── tokens.css          원시 토큰 — 파스텔 색 램프(6×9)·큐트 모티프 SVG·스케일 전부
├── semantic.css        시맨틱·컴포넌트 토큰 (tokens 참조) · 라이트/다크 테마
├── base.css            리셋·타이포·큐트 패턴 배경·데코 애니메이션·레이아웃 유틸·reduced-motion
├── theme.css           ⭐ 번들 엔트리 — HTML 은 이 파일 1개만 link
├── components/
│   ├── buttons.css     Button · ButtonGroup · Segmented(일부) · FAB
│   ├── forms.css       Input · Textarea · Select · Check(하트/별) · Radio · Toggle · Slider · Stepper · Rating · ChipInput · Combobox · DatePicker · Dropzone · SearchBar
│   ├── display.css     Card · StatCard · Badge · Avatar · List · Timeline · KanbanCard · CodeBlock · Skeleton · EmptyState
│   ├── data.css        Table · Progress(bar/ring) · Spinner · Carousel · Calendar · BarChart · Donut · Sparkline
│   ├── overlays.css    Alert · Banner · Toast · Modal · Drawer · CommandPalette(⌘K) · Tooltip · Popover · InlineNotification
│   └── navigation.css  Navbar · Sidebar · Breadcrumb · Pagination · Menu/Dropdown · ContextMenu · Tabs · Accordion · Steps
├── app.js              모든 인터랙션 + 반짝이 버스트 + 테마 전환 (바닐라 JS, 의존성 0)
├── index.html          허브 — 큐트 히어로 + 토큰/모티프 비주얼 + 컴포넌트 갤러리 + pages 링크
├── pages/              실데모 9화면 (각각 독립 html)
│   ├── dashboard.html      분석 대시보드 (위젯·테이블·차트)
│   ├── kanban.html         칸반 보드
│   ├── inbox.html          이메일/인박스 3패널
│   ├── product.html        이커머스 상품 상세 (큐트 굿즈 스토어)
│   ├── pricing.html        가격표 (플랜 3개 · 월/연 토글)
│   ├── settings.html       설정 (탭 + 토글 + 위험 영역)
│   ├── onboarding.html     온보딩 위저드 (Steps 4단계)
│   ├── profile.html        프로필/계정
│   └── 404.html            404 + 빈 상태 갤러리
├── README.md           이 문서
└── CHECKLIST.md        구현·접근성 자가점검 결과
```

---

## 🚀 사용법

### 1. HTML 에 연결
```html
<!-- 루트에서 -->
<link rel="stylesheet" href="theme.css">
<script src="app.js"></script>

<!-- pages/ 안에서는 상대경로 -->
<link rel="stylesheet" href="../theme.css">
<script src="../app.js"></script>
```
폰트(선택)는 Google Fonts 를 쓰되, 오프라인에서도 `ui-rounded` 둥근 폴백으로 안전하게 렌더됩니다.

### 2. 라이트/다크 테마
```html
<html data-theme="light">  <!-- 또는 "dark" -->
```
`data-theme-toggle` 속성을 가진 버튼을 두면 `app.js` 가 자동으로 토글 + `localStorage` 저장합니다.

### 3. 컴포넌트는 클래스만 붙이면 동작
```html
<button class="btn btn--primary btn--lg">시작하기</button>
<span class="badge badge--solid">NEW ✦</span>
<label class="toggle"><input type="checkbox"><span class="track"></span> 알림</label>
```
탭·아코디언·모달·드로어·토스트·⌘K·테이블 정렬·별점 등은 **data-속성**만 붙이면 JS가 자동 연결됩니다 (아래 참조).

---

## 🎨 토큰 레퍼런스

### 색 램프 (원시 — `tokens.css`)
각 hue 는 `50`(가장 옅음) → `900`(가장 진함) 9단계. **600 이상은 파스텔 위 텍스트용**으로 충분히 진하게 설계되어 대비 4.5:1 을 만족합니다.

| 램프 | 변수 | 앵커 | 역할 |
|------|------|------|------|
| Pink | `--pink-50…900` | `--pink-200 #FFD1E3` | primary(시그니처) |
| Mint | `--mint-50…900` | `--mint-200 #C8F1E0` | success / accent |
| Lavender | `--lavender-50…900` | `--lavender-200 #E2D5FF` | accent |
| Peach | `--peach-50…900` | `--peach-200 #FFE0C7` | warning |
| Sky | `--sky-50…900` | `--sky-200 #CDE8FF` | info |
| Butter | `--butter-50…900` | `--butter-300 #FFE57D` | sweet pop |
| Neutral | `--neutral-0…900` | warm plum-gray | 텍스트/보더 |

### 큐트 모티프 / 패턴
| 변수 | 내용 |
|------|------|
| `--motif-heart` `--motif-star` `--motif-sparkle` `--motif-face` | 인라인 SVG data-URI (배경/마스크로 사용) |
| `--pattern-dots` `--pattern-gingham` `--pattern-confetti` | 은은한 반복 패턴 배경 |
| `--grad-candy` `--grad-sunset` `--grad-mintsky` `--grad-primary` `--grad-hero` | 큐트 그라데이션 |

### 스케일
| 그룹 | 변수 |
|------|------|
| 간격 | `--space-0 … --space-16` (4px 기준) |
| 타이포 | `--text-2xs … --text-6xl`, `--leading-*`, `--tracking-*`, `--weight-*` |
| 라운드 | `--radius-2xs/xs/sm/md/lg/xl/2xl/full` (lg=24px, full=pill) |
| 보더 | `--border-1/2/3` |
| 그림자 | `--shadow-xs…xl`, `--shadow-inset`, `--glow-pink/mint/lavender/sky/pastel` |
| 모션 | `--duration-fast/base/slow`, `--ease-emphasized`(바운스)/`--ease-bounce`/`--ease-soft`/`--ease-out` |
| z-index | `--z-base/raised/sticky/drawer/overlay/modal/popover/toast/cursor` |
| 포커스 | `--ring-width/offset`, `--ring-pink/lavender/sky` |

### 시맨틱 토큰 (`semantic.css`) — 라이트/다크 자동 전환
`--color-bg` · `--color-surface` / `-2` / `-3` · `--color-text` / `-muted` / `-subtle` ·
`--color-primary`(+soft/strong/fg) · `--color-accent`(라벤더) / `--color-accent-2`(민트) ·
`--color-border`(+strong/muted) · `--color-success / warning / danger / info`(각 soft/fg/border) · `--color-ring`.

### 컴포넌트 토큰
`--btn-*` · `--card-*` · `--input-*` · `--badge-*` · `--table-*` · `--nav-*` / `--sidebar-*` · `--modal-* / --drawer-* / --toast-*` · `--chart-1…6` 등. 컴포넌트 모양을 통째로 바꾸려면 이 토큰만 수정하세요.

---

## 🧩 컴포넌트 목록 (60+)

**폼** — Button(primary/secondary/ghost/danger/mint/sky/icon × sm/md/lg × hover/active/disabled/loading) · ButtonGroup · SegmentedControl · Input · Textarea · Select · Combobox/Autocomplete · Checkbox(+하트/별 변형) · Radio · Toggle/Switch · Slider · Stepper · DatePicker · FileUpload(Dropzone) · SearchBar · Rating(별) · ChipInput

**표시** — Card(+candy/mint/lav/soft/sticker) · StatCard · Badge/Tag(+8색·상태·dot) · CountBadge · Avatar(+상태점)/AvatarGroup · List · Timeline · KanbanCard · CodeBlock · Skeleton · EmptyState · Tooltip · Popover · Accordion · Tabs · Table(정렬·선택·페이지네이션) · Carousel · Calendar

**피드백/오버레이** — Alert/Banner · Toast(스택) · Modal/Dialog · Drawer · CommandPalette(⌘K) · Progress(바/원형) · Spinner(+dots) · InlineNotification

**내비** — Navbar · Sidebar(접힘) · Breadcrumb · Pagination · Menu/Dropdown · ContextMenu · Steps/Wizard

**데이터 시각화** — BarChart · Donut(conic-gradient) · Sparkline · ProgressRing (전부 순수 CSS/SVG)

---

## ⌨️ JS 동작 (data-속성으로 선언적 연결)

| 속성 / 패턴 | 동작 |
|-------------|------|
| `data-theme-toggle` | 라이트/다크 전환 + 저장 |
| `data-modal-open="ID"` / `data-modal-close` | 모달 열기/닫기 (ESC·배경 클릭·포커스 관리) |
| `data-drawer-open="ID"` / `data-drawer-close` | 드로어 열기/닫기 |
| `data-toast="success\|info\|warning\|error"` + `data-toast-title/-msg` | 토스트 띄우기 |
| `data-cmdk-open` 또는 **⌘K / Ctrl+K** | 커맨드 팔레트 (↑↓ 이동, ↵ 선택, ESC 닫기) |
| `data-dropdown-trigger` (`.dropdown` 안) | 드롭다운 메뉴 |
| `data-popover-trigger="ID"` | 팝오버 |
| `[data-context]` | 우클릭 컨텍스트 메뉴 |
| `data-tabs` (role=tab/tabpanel) | 탭 (←→ 키보드) |
| `.accordion[data-single]` | 아코디언 (단일/다중) |
| `data-sidebar-toggle` | 사이드바 접기 |
| `data-sparkle="10"` | 클릭 시 반짝이 버스트 |
| `data-copy="텍스트"` 또는 `.code-copy` | 클립보드 복사 |
| `.rating` / `.slider` / `.stepper` / `.chip-input` / `.combobox` / `.carousel` / `.dropzone` / `.progress-ring` / `table.table` | 자동 초기화 |

프로그래밍 방식: `Kawaii.toast({type,title,msg})`, `Kawaii.burst(el)`, `Kawaii.openOverlay(el)`, `Kawaii.applyTheme('dark')`.

---

## 🔄 테마 교체 가이드

이 시스템은 **토큰 우선** 설계라 값만 바꾸면 무드가 통째로 바뀝니다.

1. **색만 바꾸기** — `tokens.css` 의 6개 램프 hex 값을 새 팔레트로 교체. 시맨틱/컴포넌트 토큰은 램프를 참조하므로 자동 반영.
2. **둥글기/촉감 조절** — `--radius-lg`, `--shadow-*`, `--glow-pastel` 만 조정하면 전체 곡률·그림자가 함께 변경.
3. **모티프 교체** — `--motif-*` / `--pattern-*` data-URI 를 다른 SVG 로 바꾸면 하트·별 대신 다른 액센트로.
4. **모션 톤** — `--ease-emphasized`, `--duration-*` 로 바운스 강도/속도 조절.
5. **다크 테마** — `semantic.css` 의 `[data-theme="dark"]` 블록만 수정.
6. **컴포넌트 단위 변경** — 해당 `--btn-*` / `--card-*` / `--input-*` 토큰만 손대면 됩니다.

> 컴포넌트 CSS 는 거의 손대지 않고 토큰만으로 리브랜딩이 가능하도록 작성했습니다.

---

## ♿ 접근성

- 파스텔 표면 위 텍스트는 모두 진한 색(plum/gray 700~900)으로 **대비 4.5:1↑** 확보. 파스텔 위 파스텔 텍스트 없음.
- 상태는 **색 + 아이콘/텍스트 병행** (색만으로 의미 전달하지 않음).
- 또렷한 `:focus-visible` 파스텔 포커스 링, 키보드 조작(탭/메뉴/모달/⌘K/캐러셀 등) 지원.
- `prefers-reduced-motion: reduce` 에서 반짝이·바운스·shimmer 등 모든 비필수 모션 정지, 급격한 점멸 없음.
- 의미있는 ARIA role/속성, Skip link, `aria-hidden` 처리된 장식 SVG.

자세한 점검 결과는 [CHECKLIST.md](CHECKLIST.md) 참고.

---

## 📐 반응형 브레이크포인트

| 변수 | 값 | 동작 |
|------|----|----|
| `--bp-md` | 768px | 그리드 축소 시작 |
| `--bp-lg` | 1024px | 4열→2열, 사이드바 접힘/오프캔버스 |
| ~680px | 모바일 | 1열, nav-links 숨김, 패딩 축소 |

모든 페이지는 모바일·태블릿·데스크탑에서 검증되었습니다.

---

made with ♡ &amp; ✦ — **Pastel Kawaii**, theme-16
