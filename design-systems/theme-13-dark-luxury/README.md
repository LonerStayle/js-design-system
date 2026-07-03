# AURUM — Theme 13 · Dark Luxury

> 여백이 곧 럭셔리다. 깊은 차콜, 소프트 화이트, 그리고 아주 가끔의 골드.
> 순수 CSS 토큰 + 바닐라 JS로 만든 프로덕션급 디자인 시스템 — 외부 프레임워크 0, 의존성 0.

하이엔드 패션·시계 메종의 미니멀 럭셔리를 코드로 옮긴 디자인 시스템입니다.
장식하지 않는 것을 장식으로 삼습니다. 넓은 네거티브 스페이스, 1px 골드 헤어라인,
대문자 와이드 트래킹 라벨, 고대비 세리프 헤드라인. 모든 HTML은 더블클릭(`file://`)만으로 렌더·동작합니다.

---

## 1. 디자인 철학

| 원칙 | 적용 |
|------|------|
| **여백이 럭셔리** | 상위 스페이싱 스텝을 넉넉히(`--space-14`~`20` = 160~480px). 섹션 사이를 비웁니다. |
| **헤어라인, 박스가 아니라** | 면은 그림자 박스가 아니라 `--border-1`(1px) 선으로 정의. 골드 헤어라인은 강조 지점에만. |
| **골드는 포인트로만** | 무채색(차콜/화이트)이 90%. 골드(`--color-primary`)는 CTA·포커스·키커·구분선 등 의도된 순간에만. |
| **고대비 세리프 타이포** | 디스플레이는 가늘고 우아한 세리프(Cormorant Garamond), 본문은 차분한 산세리프(Archivo). 라벨은 와이드 트래킹. |
| **느리고 우아한 모션** | `--ease-emphasized`의 느린 페이드. 시선을 빼앗지 않고 안내. `prefers-reduced-motion`에서 전부 정지. |
| **접근성 정본** | 다크 위 텍스트·골드 대비 4.5:1↑, 또렷한 골드 포커스 링, 상태는 색+아이콘 병행. |

### 색 팔레트 (핵심)
- 배경: `#0C0C0E`(neutral-900) · 표면: `#141416`(neutral-880)
- 텍스트: `#EDEAE3`(neutral-100, 소프트 화이트)
- 골드: `#BFA06A`(gold-500) — `#0C0C0E` 위 대비 ≈ **7.9:1** (AA 통과)
- 샴페인: `#CBB994`(champagne-500) — 보조 온기
- 상태색은 전부 채도 낮게(세이지/브래스/옥스블러드/슬레이트).

---

## 2. 파일 구조

```
theme-13-dark-luxury/
├── tokens.css          원시 토큰 — 색 램프·스페이싱·타이포·모서리·그림자·모션·z-index·브레이크포인트
├── semantic.css        시맨틱 토큰(--color-*) + 컴포넌트 토큰(--btn-*/--card-*/--input-*); 다크(정본)+라이트
├── base.css            리셋·웹폰트·타이포그래피·여백 중심 레이아웃 유틸·포커스·리빌·reduced-motion
├── theme.css           단일 링크 집계자(@import 순서 보장) — 이 한 파일만 링크하면 전체 로드
├── components/
│   ├── buttons.css     Button(5변형×3사이즈×상태) · ButtonGroup
│   ├── badge.css       Badge/Tag/Chip · Avatar/AvatarGroup · badge-dot/count
│   ├── card.css        Card · StatCard · EmptyState · Skeleton
│   ├── inputs.css      Input/Textarea/Select/Search/Combobox/MultiSelect/ChipInput/FileUpload/Stepper/DatePicker·Calendar
│   ├── controls.css    Checkbox · Radio · Toggle · SegmentedControl · Slider · Rating
│   ├── data.css        Table(정렬·선택·페이지) · List · Timeline · KanbanCard · CodeBlock · KV
│   ├── disclosure.css  Accordion · Tabs(pill/vertical) · Carousel
│   ├── navigation.css  Navbar · Sidebar(접힘) · Breadcrumb · Pagination · Menu/Dropdown/ContextMenu · Steps/Wizard
│   ├── overlay.css     Modal · Drawer · Tooltip · Popover · Toast(스택) · CommandPalette(⌘K)
│   └── feedback.css    Alert/Banner · Progress(바/원형) · Spinner · InlineNotification
├── app.js              모든 인터랙션 + 테마 전환(바닐라 JS, 자가 초기화)
├── index.html          허브 — 럭셔리 히어로 + 토큰 비주얼 + 컴포넌트 갤러리 + 페이지 링크
├── pages/              실데모 9화면 (아래 §5)
├── README.md           (이 문서)
└── CHECKLIST.md        구현·접근성 자가점검 결과
```

### 빠른 시작
```html
<!DOCTYPE html>
<html lang="ko" data-theme="dark">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <!-- 깜빡임(FOUC) 방지: 페인트 전 저장된 테마 적용 -->
  <script>try{var t=localStorage.getItem('dl-theme');if(t)document.documentElement.setAttribute('data-theme',t);}catch(e){}</script>
  <link rel="stylesheet" href="theme.css" />
  <script src="app.js" defer></script>
</head>
<body> … </body>
</html>
```
> `theme.css` 한 줄이면 전체 시스템이 올바른 순서로 로드됩니다. 개별 컴포넌트 파일만 골라 링크해도 됩니다(단, `tokens.css → semantic.css → base.css` 순서는 먼저).

---

## 3. 토큰 레퍼런스

### 색
- **Neutral 램프**: `--neutral-0`(웜 페이퍼) … `--neutral-100`(소프트 화이트 텍스트) … `--neutral-880`(표면) `--neutral-900`(배경) `--neutral-950`(딥 블랙)
- **Gold 램프**: `--gold-50 … --gold-900` (정본 액센트 = `--gold-500`)
- **Champagne 램프**: `--champagne-50 … --champagne-900`
- **Status**: `--success-/--warning-/--danger-/--info-` (300/400/500/700/900, 저채도)

### 시맨틱 (테마 전환 시 값이 바뀜)
`--color-bg` · `--color-surface` · `--color-surface-2/3` · `--color-surface-sunken` ·
`--color-text` · `--color-text-strong/muted/subtle` ·
`--color-primary`(=골드) · `--color-primary-fg`(=블랙) · `--color-primary-soft` ·
`--color-accent`(=샴페인) · `--color-border` · `--color-border-gold`(헤어라인) · `--color-divider` ·
`--color-success/warning/danger/info`(+`-soft`/`-border`/`-fg`) · `--color-overlay` · `--glass-bg`

### 스페이싱 (4px 베이스, 상위 넉넉)
`--space-0`(0) `1`(4) `2`(8) `3`(12) `4`(16) `5`(24) `6`(32) `7`(40) `8`(48) `9`(64) `10`(80) `11`(96) `12`(112) `13`(128) `14`(160) `15`(192) `16`(224) `17`(256) `18`(320) `19`(384) `20`(480)

### 타이포
- 패밀리: `--font-display`(Cormorant Garamond) · `--font-body`(Archivo) · `--font-mono`(IBM Plex Mono)
- 크기: `--text-2xs`(11) `xs`(12) `sm`(13) `base`(15) `md`(16) `lg`(19) `xl`(24) `2xl`(32) `3xl`(44) `4xl`(56) `5xl`(72) `6xl`(96) `7xl`(128)
- 행간: `--leading-tight`(1.12) … `--leading-relaxed`(1.72)
- 자간: `--tracking-tighter`(-0.03em, 디스플레이) … `--tracking-widest`(0.24em, 키커)

### 형태·깊이·모션
- 모서리: `--radius-sm`(2) `md`(3) `lg`(5) `xl`(8) — 거의 직각
- 보더: `--border-1`(1px 헤어라인) `--border-2`(1.5) `--border-3`(2) · `--hairline-gold`
- 그림자: `--shadow-xs/sm/md/lg/xl`(깊고 부드러운 다크) · `--glow-gold`(미세) · `--glow-gold-soft`
- 포커스: `--ring-width`(1.5px) `--ring-offset`(2px) `--ring-color`(gold-400)
- 모션: `--duration-fast/base/slow/slower` · `--ease-emphasized`(럭셔리 슬로아웃)
- 기타: `--z-*`(레이어), `--bp-*`(브레이크포인트), `--container-*`, `--measure-prose`(68ch)

---

## 4. 컴포넌트 목록 (54+)

**폼** — Button(primary/secondary/ghost/danger/icon × sm/md/lg × hover/active/disabled/loading), ButtonGroup,
Input, Textarea, Select, MultiSelect, Combobox/Autocomplete, Checkbox, Radio, Toggle/Switch, SegmentedControl,
Slider, Stepper, DatePicker, FileUpload(Dropzone), SearchBar, Rating, ChipInput.

**표시** — Card(헤어라인 프레임), StatCard, Badge/Tag/Chip, Avatar/AvatarGroup, Tooltip, Popover, Accordion,
Tabs(line/pill/vertical), Table(정렬·선택·페이지네이션), List, Timeline, KanbanCard, CodeBlock, Skeleton,
EmptyState, Carousel, Calendar, KeyValue.

**피드백/오버레이** — Alert/Banner, Toast(스택), Modal/Dialog, Drawer, CommandPalette(⌘K),
Progress(바/원형), Spinner(ring/dots), InlineNotification.

**내비** — Navbar, Sidebar(접힘), Breadcrumb, Pagination, Menu/Dropdown, ContextMenu, Steps/Wizard.

각 컴포넌트의 정확한 마크업은 `index.html`(컴포넌트 갤러리)에서 실제 동작 형태로 확인하세요.

### 자바스크립트 동작 — data-속성 관례
`app.js`는 DOM 로드 시 자동 초기화됩니다. 마크업에 아래 속성만 부여하면 동작합니다(추가 코드 불필요):

| 기능 | 마크업 훅 |
|------|-----------|
| 테마 전환 | `[data-theme-toggle]` 버튼 |
| 모달 | 열기 `[data-modal-open="id"]`, 닫기 `[data-modal-close]`, 패널 `#id.modal` |
| 드로어 | 열기 `[data-drawer-open="id"]`, 닫기 `[data-drawer-close]`, `#id.drawer` |
| 토스트 | `[data-toast="메시지"][data-toast-title][data-toast-variant]` 또는 JS `dlToast({title,message,variant})` |
| ⌘K 팔레트 | `[data-cmdk]` 컨테이너 + `[data-cmdk-input]`; 항목 `.cmdk__item[data-href|data-action]` |
| 탭 | `[data-tabs]` + `[role=tab][aria-controls]` + `.tabs__panel[id]` (방향키 지원) |
| 아코디언 | `.accordion[data-accordion="single"]` + `.accordion__trigger[aria-controls]` |
| 드롭다운 | `[data-dropdown]` + `[data-dropdown-trigger]` + `[data-dropdown-menu]` |
| 컨텍스트 메뉴 | 영역 `[data-context-menu="id"]` + `.menu#id` |
| 세그먼트 | `[data-segmented]` (→ `segmentchange` 이벤트) |
| 슬라이더 | `input[type=range]` (골드 필 자동, `[data-slider-value]`/`data-prefix`/`data-suffix`) |
| 스테퍼 | `.stepper` + `button[data-step="-1|1"]` |
| 콤보박스 | `[data-combobox]`(+`data-multi`) |
| 테이블 | `[data-table]`(+`data-paginate="N"`), `th[data-sort="str|num"]`, `[data-select-all]`, `[data-row-check]`, 래퍼 `[data-table-root]` 안 `[data-selected-count]`·`[data-pager]` |
| 캐러셀 | `[data-carousel]`(+`data-autoplay="ms"`) |
| 위저드 | `[data-wizard]` + `[data-step-index]` + `[data-step-panel]` + `[data-wizard-prev|next]` |
| 가격 토글 | `[data-pricing-toggle]` + 세그먼트 + `[data-price][data-price-monthly][data-price-yearly][data-period][data-save]` |
| 진행 원 | `[data-ring="0~100"]` |
| 복사 | `[data-copy="#id"]` 또는 `[data-copy-text]` |
| 스크롤 리빌 | `[data-reveal]`(+`data-delay="1..4"`) |

전역: `Escape`로 최상위 오버레이 닫기, 오버레이 내 `Tab` 포커스 트랩, `⌘/Ctrl+K`로 팔레트 토글.

---

## 5. 데모 화면 (`pages/`)

| # | 파일 | 내용 |
|---|------|------|
| 1 | `dashboard.html` | 분석 대시보드 — 접이식 사이드바, KPI 카드, 골드 에어리어 차트, 채널 막대/목표 링, 정렬·페이지네이션 테이블, 활동 타임라인 |
| 2 | `kanban.html` | 칸반 보드 — 4컬럼 가로 스크롤, 풍부한 카드(우선순위·태그·진행바·담당), 작업 상세 드로어 |
| 3 | `inbox.html` | 이메일 인박스 — 3패널(폴더/목록/읽기), 라벨, 답장 작성 |
| 4 | `product.html` | 이커머스 상품 상세 — 하이엔드 부티크, 캐러셀 갤러리, 색·사이즈 선택, 아코디언, 추천 상품 |
| 5 | `pricing.html` | 가격표 — 3플랜, 월/연 토글, 기능 비교표, FAQ |
| 6 | `settings.html` | 설정 — 세로 탭(프로필/계정/알림/결제/보안), 토글, 위험 영역(삭제 확인 모달) |
| 7 | `onboarding.html` | 온보딩 위저드 — Steps 다단계 폼, 진행률, 완료 화면 |
| 8 | `profile.html` | 프로필/계정 — 커버 헤더, 통계, 탭(개요/주문/활동/리뷰), 멤버십 카드, 편집 드로어 |
| 9 | `404.html` | 404 + 빈 상태 갤러리(검색없음/빈 장바구니/주문없음/에러) |

모두 반응형이며 `index.html` 또는 `app.js`가 있는 위치에서 더블클릭으로 열립니다.

---

## 6. 교체 가이드 (브랜드 리스킨)

이 시스템은 **시맨틱 토큰**으로 추상화돼 있어, 원시 값 몇 개만 바꾸면 전혀 다른 브랜드가 됩니다.

1. **액센트 색 바꾸기** — `tokens.css`의 `--gold-500`(과 주변 램프)을 원하는 색으로. 자동으로 CTA·포커스·키커·헤어라인에 반영됩니다. (대비 4.5:1↑ 유지 필수 — §품질 참고)
2. **배경/표면 톤** — `semantic.css`의 `--color-bg/surface/surface-2`만 조정. 더 어둡게/밝게.
3. **폰트 교체** — `tokens.css`의 `--font-display`/`--font-body`만 변경, `base.css`의 `@import` 폰트 URL 교체. 나머지 코드는 그대로.
4. **모서리 라운드** — `--radius-md`를 키우면(예: 8px) 전체가 부드러워집니다. 럭셔리감을 위해 기본은 ≤4px.
5. **라이트 테마 조정** — `semantic.css`의 `:root[data-theme="light"]` 블록만. 다크는 정본, 라이트는 웜 아이보리.
6. **간격 스케일** — `--space-*`는 비율 유지 권장. 더 빽빽하게 하려면 상위 스텝만 축소.

> 핵심: **컴포넌트 CSS는 건드리지 않습니다.** 모두 토큰을 참조하므로 토큰만 바꾸면 됩니다.

---

## 7. 품질 기준

- 외부 CSS 프레임워크 **0**, 순수 CSS 변수 + 바닐라 JS. 빌드 스텝 없음.
- 아이콘은 전부 인라인 SVG(가는 라인). 이미지 의존 없음 — 갤러리는 그라데이션+헤어라인 플레이스홀더.
- 다크 배경 위 본문/라벨 대비 **4.5:1↑**. 골드는 충분히 밝게(작은 텍스트엔 화이트).
- 또렷한 골드 포커스 링, `prefers-reduced-motion`에서 모든 모션 정지, 상태는 색+아이콘 병행, ARIA·role 부여.
- 모든 HTML은 더블클릭(`file://`)만으로 렌더·동작, 반응형 브레이크포인트 대응.

자세한 자가점검은 [`CHECKLIST.md`](./CHECKLIST.md) 참고.
