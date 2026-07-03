# THEME 20 — BLUEPRINT / WIREFRAME

> 건축 도면·CAD 와이어프레임의 언어로 만든 프로덕션급 디자인 시스템.
> **채움이 아니라 선으로 그린다(Drawn, not filled).**

블루프린트 네이비 배경 위에 시안·화이트 라인워크, 엔지니어링 모눈 격자, 그리고
치수선·주석 콜아웃·크로스헤어 같은 제도 모티프로 모든 요소를 "설명"하는 시스템입니다.
외부 CSS 프레임워크 0 · 순수 CSS 토큰 변수 · 인라인 SVG · 바닐라 JS.
모든 HTML은 더블클릭(`file://`)만으로 렌더·동작합니다.

---

## 1. 디자인 철학 (Design DNA)

| 축 | 결정 |
|---|---|
| **무드** | 설계·기술·정밀. 건축 도면 / CAD 와이어프레임 |
| **색** | 블루프린트 네이비 배경(`#0E2A47`) + 시안(`#5BC8FF`) · 화이트 라인. 면은 거의 안 칠함 |
| **배경** | 미세 라인 + 굵은 기준선의 엔지니어링 격자, 코너 크로스헤어/등록 마크 |
| **모티프** | 치수선(양끝 화살표+측정값) · 주석 콜아웃(지시선+노트) · 단면 해치 · 스케일 바 |
| **형태** | 직각(`--radius: 0`), 1px 헤어라인 스트로크. 윤곽선 위주 와이어프레임 |
| **타이포** | 모노스페이스(JetBrains Mono / IBM Plex Mono) + 기술 산세리프 라벨, 대문자 와이드 트래킹 |
| **호버/포커스** | 호버 = 시안 라인 하이라이트 · 포커스 = 시안 2px 아웃라인 |

**금지**: 채움색 위주 디자인 · 그라데이션 · 소프트 섀도 · 곡선 장식 · 둥근 모서리.
깊이는 그림자가 아니라 **라인 굵기**로 표현합니다(`--shadow-*: none`).

---

## 2. 파일 구조

```
theme-20-blueprint-wireframe/
├── tokens.css          원시 토큰 (네이비/시안/뉴트럴 램프 · 제도 토큰 · 풀 스케일)
├── semantic.css        시맨틱·컴포넌트 토큰 (tokens.css 참조, 라이트/다크)
├── base.css            리셋 · 타이포 · 모눈 격자 배경 · 치수선/크로스헤어/해치 유틸 · 레이아웃
├── components/
│   ├── all.css         전체 import 진입점
│   ├── buttons.css     Button · ButtonGroup
│   ├── forms.css       Input·Textarea·Select·Combobox·Checkbox·Radio·Switch·Slider·Stepper·
│   │                   DatePicker·FileUpload·SearchBar·Rating·ChipInput·SegmentedControl
│   ├── display.css     Card·StatCard·Badge·Avatar·Tooltip·Popover·Accordion·Tabs·List·
│   │                   Timeline·KanbanCard·CodeBlock·Skeleton·EmptyState·Carousel·Calendar
│   ├── table.css       Table / 데이터 그리드 (정렬·선택·페이지네이션)
│   ├── feedback.css    Alert·Banner·Toast·Modal·Drawer·CommandPalette·Progress·Spinner·InlineNotification
│   ├── nav.css         Navbar·Sidebar·Breadcrumb·Pagination·Menu·ContextMenu·Steps·kbd
│   ├── charts.css      LineChart·Sparkline·BarChart·Donut·Gauge (전부 라인, 채움 없음)
│   └── layout.css      AppShell·Kanban·Inbox 3-pane·Pricing·TitleBlock·SpecList·DangerZone
├── app.js              모든 인터랙션 + 격자/치수선 토글 + 테마 전환 (바닐라 JS)
├── index.html          랜딩 + 토큰/모티프 비주얼 + 컴포넌트 갤러리 + pages 링크 허브
├── pages/              9개 실데모 화면 (각각 독립 html)
│   ├── dashboard.html  ① 분석 대시보드 (위젯 + 데이터 그리드 + 라인 차트)
│   ├── kanban.html     ② 칸반 보드 (드래그&드롭)
│   ├── inbox.html      ③ 이메일 인박스 (폴더·목록·본문 3패널)
│   ├── product.html    ④ 이커머스 상품 상세 (스펙/치수 강조)
│   ├── pricing.html    ⑤ 가격표 (3플랜 · 월/연 토글)
│   ├── settings.html   ⑥ 설정 (탭 + 토글 + 위험영역)
│   ├── onboarding.html ⑦ 온보딩 위저드 (Steps)
│   ├── profile.html    ⑧ 프로필 / 계정
│   └── 404.html        ⑨ 404 + 빈 상태 (미완성 도면풍)
├── README.md
└── CHECKLIST.md
```

### 시작하기

별도 빌드 도구가 필요 없습니다. `index.html` 을 브라우저에서 더블클릭하면 됩니다.

```html
<!-- 루트(index.html)에서 -->
<link rel="stylesheet" href="tokens.css">
<link rel="stylesheet" href="semantic.css">
<link rel="stylesheet" href="base.css">
<link rel="stylesheet" href="components/all.css">
<script src="app.js"></script>

<!-- pages/ 하위에서는 ../ 접두 -->
<link rel="stylesheet" href="../tokens.css"> … <script src="../app.js"></script>
```

> 로드 순서: **tokens → semantic → base → components**. (app.js는 `defer` 불필요, body 끝에서 로드)

---

## 3. 토큰 레퍼런스

### 3.1 색 램프 (원시)

| 그룹 | 스케일 | 정본 값 |
|---|---|---|
| `--navy-50…950` | 11단계 | `--navy-800 = #0E2A47` (블루프린트 배경) |
| `--cyan-50…950` | 11단계 | `--cyan-400 = #5BC8FF` (시그니처 시안) |
| `--neutral-50…950` | 11단계 | 라인 그레이 → 화이트 |
| 기능색 | amber / lime / coral / violet | 경고 / 성공 / 위험 / 정보·주석 |

### 3.2 제도(드래프팅) 토큰

| 토큰 | 용도 |
|---|---|
| `--grid-fine-*` / `--grid-major-*` | 미세 모눈(20px) / 굵은 기준선(100px) |
| `--dimension-line` / `--dimension-tick` / `--dimension-gap` | 치수선 색·화살표·오프셋 |
| `--callout-line` / `--callout-dot` | 주석 지시선·앵커 |
| `--crosshair-*` / `--registration-*` | 코너 크로스헤어 · 등록 마크 |
| `--hatch-*` | 45° 단면 해치 (색·간격·굵기·각도) |

### 3.3 스케일

| 카테고리 | 토큰 | 비고 |
|---|---|---|
| 간격 | `--space-0 … --space-16` | 4px/20px 격자 모듈 정렬 |
| 타이포 | `--text-2xs … --text-6xl` | 10px → 62px |
| 행간/자간 | `--leading-*` / `--tracking-*` | `--tracking-widest = 0.18em` (캡션) |
| 모서리 | `--radius-* = 0` | `--radius-full`만 진짜 원(노드/점) |
| 보더 | `--border-1/2/3` | 헤어라인 1·2·3px |
| 그림자 | `--shadow-* = none` | 깊이는 라인 굵기로. `--ink-echo`(무블러)만 예외 |
| 링 | `--ring-*` | 시안 포커스 |
| 모션 | `--ease-standard` / `--duration-fast` 등 | 절제된 기계적 모션 |
| z-index | `--z-base … --z-toast` | |
| 브레이크포인트 | `--bp-xs … --bp-2xl` | 420 → 1600px |

### 3.4 시맨틱 토큰 (semantic.css)

`--color-bg`(네이비) · `--color-surface`(투명/라인) · `--color-surface-2` ·
`--color-text`(화이트) · `--color-text-muted`(시안) · `--color-primary`(=시안) ·
`--color-primary-fg` · `--color-accent` · `--color-border`(헤어라인) ·
`--color-success/warning/danger/info`.

라이트/다크 모두 정의 — **다크(네이비)가 정본**, 라이트는 드래프팅 화이트 페이퍼 + 블루 라인.
컴포넌트 토큰: `--btn-*`, `--card-*`, `--input-*`, `--table-*`, `--switch-*`, `--progress-*` 등.

---

## 4. 컴포넌트 목록

**폼**: Button(primary/secondary/ghost/danger/icon × sm/md/lg × hover/active/disabled/loading) ·
ButtonGroup · Input · Textarea · Select · MultiSelect · Combobox/Autocomplete · Checkbox · Radio ·
Toggle/Switch · SegmentedControl · Slider · Stepper · DatePicker · FileUpload · SearchBar · Rating · ChipInput

**표시**: Card(와이어프레임 박스+치수선) · StatCard · Badge/Tag · Avatar/AvatarGroup · Tooltip(콜아웃풍) ·
Popover · Accordion · Tabs · Table(정렬·선택·페이지네이션) · List · Timeline · KanbanCard · CodeBlock ·
Skeleton · EmptyState · Carousel · Calendar

**피드백/오버레이**: Alert/Banner · Toast(스택) · Modal/Dialog · Drawer · CommandPalette(⌘K) ·
Progress(바/원형) · Spinner · InlineNotification

**내비**: Navbar · Sidebar(접힘) · Breadcrumb · Pagination · Menu/Dropdown · ContextMenu · Steps/Wizard

**데이터 viz**: LineChart · Sparkline · BarChart · Donut · Gauge (전부 라인 스트로크)

### 모티프 유틸리티 클래스

| 클래스 | 효과 |
|---|---|
| `.bp-grid` | 엔지니어링 모눈 격자 배경 (body 또는 컨테이너) |
| `.bp-frame` / `.bp-frame--full` | 코너 크로스헤어 프레임 |
| `.bp-reg-mark` | 등록 마크(원+십자) 스탬프 |
| `.bp-dim.bp-dim--h` / `--v` | 수평/수직 치수선 (`<span>`에 측정값) |
| `.bp-callout` / `.bp-callout-tag` | 주석 콜아웃 (지시선+노트) |
| `.bp-hatch` / `--dense` / `--cross` | 45° 단면 해치 |
| `.bp-scalebar` / `.bp-ruler-x` | 스케일 바 / 좌표 룰러 |
| `.plate` + `.plate-corner` | 도면 시트 플레이트 (히어로용) |
| `.title-block` | 도면 표제란(타이틀 블록) 푸터 |

모든 장식 모티프는 `aria-hidden="true"` 로 처리하고, 의미는 텍스트로 별도 제공합니다.

---

## 5. 인터랙션 (app.js)

데이터 속성 기반, 전부 바닐라 JS. 페이지마다 안전하게 재실행됩니다(idempotent).

| 트리거 속성 | 동작 |
|---|---|
| `data-toggle-theme` | 다크 ↔ 라이트 (localStorage 저장) |
| `data-toggle-grid` / `data-toggle-dims` | 격자 / 치수선 표시 토글 |
| `data-tabs` + `role="tab"` | 탭 (←/→ 키보드) |
| `data-accordion="single\|multi"` | 아코디언 |
| `data-open-modal="id"` / `data-close-modal` | 모달 (포커스 트랩 · ESC) |
| `data-open-drawer="id"` / `data-close-drawer` | 드로어 |
| `data-toast[-title][-body]` | 토스트 스택 |
| `data-cmdk` / `⌘K`·`Ctrl+K` | 커맨드 팔레트 (↑↓ Enter ESC) |
| `data-menu` / `.popover` / `data-context` | 드롭다운 · 팝오버 · 우클릭 컨텍스트 메뉴 |
| `.combo[data-multi]` | 콤보박스 / 멀티셀렉트 |
| `.switch` `.slider` `.stepper` `.rating` `.chipinput` | 폼 컨트롤 라이브 상태 |
| `.dropzone` | 파일 드래그&드롭 |
| `table.table` (`.sortable`, `data-select-all`, `data-row-select`) | 정렬 · 행 선택 |
| `.kanban-card` | 칸반 드래그&드롭 |
| `.carousel` `[data-calendar]` `[data-wizard]` | 캐러셀 · 캘린더 · 위저드 |
| `[data-copy]` | 클립보드 복사 |
| `[data-reveal]` | 스크롤 등장 (IntersectionObserver) |

**공개 API**: `window.BP.toast(opts)`, `BP.openModal(id)`, `BP.closeModal(id)`,
`BP.openDrawer/closeDrawer`, `BP.openCmdk/closeCmdk`, `BP.setTheme('dark'|'light')`.

```js
BP.toast({ type: "success", title: "저장됨", body: "도면이 동기화되었습니다." });
```

---

## 6. 다른 프로젝트에 이식하기 (교체 가이드)

1. **색 교체** — `tokens.css` 의 `--navy-*`, `--cyan-*` 램프 값만 바꾸면 전체 톤이 바뀝니다.
   시맨틱 레이어가 램프를 참조하므로 컴포넌트는 건드릴 필요가 없습니다.
2. **브랜드 컬러** — `--color-primary` (기본 `= --cyan-400`)를 다른 시안 톤이나 브랜드색으로 교체.
   `--color-primary-fg`(솔리드 위 텍스트) 대비를 4.5:1 이상으로 맞추세요.
3. **모서리** — 직각이 핵심이지만, 부드럽게 가려면 `--radius-md` 등에 값을 주면 됩니다(권장 안 함).
4. **격자 밀도** — `--grid-fine-size`(20px) / `--grid-major-size`(100px) 조정.
5. **폰트** — `--font-mono` / `--font-label` 만 교체. 모노 우선 원칙은 유지 권장.
6. **컴포넌트 토큰** — `--btn-*`, `--card-*`, `--input-*` 로 컴포넌트별 미세 조정.
7. **다크/라이트** — `semantic.css` 의 `[data-theme="light"]` 블록 값만 수정.

> 토큰 이름은 고정되어 있으므로, **값만** 바꾸면 디자인 의도를 유지한 채 리브랜딩됩니다.

---

## 7. 접근성

- 시안/화이트-온-네이비 대비 4.5:1 이상 (본문 텍스트).
- 격자·치수선·해치 등 장식은 `aria-hidden`, 의미는 텍스트 병행.
- 상태는 **색 + 아이콘/라벨** 병행 (색만으로 구분하지 않음).
- `prefers-reduced-motion` 대응 (애니메이션·트랜지션 무력화).
- 또렷한 시안 포커스 링(`:focus-visible`), 모달/드로어 포커스 트랩, ESC 닫기.
- 시맨틱 role/aria 속성: `role="dialog"`, `aria-modal`, `aria-selected`, `aria-sort`,
  `aria-current`, `aria-live` (토스트) 등.

자세한 점검 결과는 [`CHECKLIST.md`](./CHECKLIST.md) 참조.

---

## 8. 기술 제약 준수

- ✅ 외부 CSS 프레임워크 **0** — 순수 CSS + 토큰 변수만
- ✅ 모티프/아이콘 전부 **인라인 SVG**(라인 스트로크)
- ✅ 모든 HTML은 더블클릭(`file://`)만으로 렌더·동작 (빌드/서버 불필요)
- ✅ 반응형 브레이크포인트 대응 (사이드바 모바일 접힘, 그리드 단/복열 전환)
- ✅ 외부 의존성은 Google Fonts 1건뿐 — 폰트 미로드 시 시스템 모노로 graceful fallback

---

**SHEET 20 / 20 · REV 1.0 · 2026-06-21 — DRAWN, NOT FILLED.**
