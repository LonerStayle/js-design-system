# THEME 07 — CYBERPUNK TERMINAL

> 깊은 보이드 / CRT 터미널 미감의 프로덕션급 디자인 시스템.
> 네온 시안·마젠타 주축, 전면 모노스페이스, 직각(노치) 모서리, 스캔라인 + 글로우.
> **외부 CSS 프레임워크 0 · 순수 CSS 토큰 + 바닐라 JS · 모든 화면 `file://` 더블클릭으로 동작.**

```
 ▟███████████████████████████████████████████████████▙
 █  > boot theme-07 :: CYBERPUNK TERMINAL              █
 █  OK  tokens mounted        [318]                    █
 █  OK  components linked      [70+]                   █
 █  OK  theme engine          :: dark (light ready)    █
 █  > _                                                █
 ▜███████████████████████████████████████████████████▛
```

---

## 1. 디자인 철학 (Design DNA)

| 축 | 결정 |
|----|------|
| **무드** | 다크·하이테크·날선 네온. 터미널/CRT 화면 미감. 파스텔·소프트·둥근 느낌 **배제**. |
| **색** | 딥 보이드 배경(`#070A0F`~`#0B0F1A`) + 네온 시안 `#00F0FF`(primary)·마젠타 `#FF2BD6`(accent). 보조로 네온 그린 `#39FF14`(success)·앰버 `#FFB000`(warning)·네온 레드 `#FF3B47`(danger). |
| **네온의 역할** | 네온은 **장식**(text-shadow·box-shadow glow). 가독성은 항상 **충분히 밝은 솔리드 색 + 대비 4.5:1↑** 가 책임진다. |
| **타이포** | 전면 모노스페이스(JetBrains Mono → IBM Plex Mono → 시스템 모노 폴백). 대문자 라벨, 와이드 트래킹, ASCII/명령행 느낌. |
| **형태** | 직각 모서리(`--radius-0`) 기본. 일부 컴포넌트는 `clip-path` 노치(코너컷). 카드는 **터미널 윈도우 크롬**(상단 바 + 점 3개). |
| **시그니처** | 스캔라인 오버레이 + CRT 비네팅, 네온 글로우 보더, 깜빡이는 커서, 타이핑/부팅 시퀀스, 호버 글리치(색분리), HUD 코너 브래킷, 포커스 = 네온 글로우 링. 데이터는 모노 그리드/표. |

---

## 2. 빠른 시작

```bash
# 그냥 더블클릭 — 빌드 스텝 없음
open index.html          # 컴포넌트 갤러리 허브
open pages/dashboard.html # 실데모 화면
```

CSS 로드 순서는 **반드시** `tokens → semantic → base → components/*` 입니다.

```html
<link rel="stylesheet" href="tokens.css">    <!-- 1. 원시 토큰 (값) -->
<link rel="stylesheet" href="semantic.css">  <!-- 2. 시맨틱·컴포넌트 토큰 (역할) -->
<link rel="stylesheet" href="base.css">      <!-- 3. 리셋·타이포·CRT 오버레이·유틸 -->
<link rel="stylesheet" href="components/button.css"> <!-- 4. 컴포넌트 (필요한 것만) -->
<!-- … forms / card / display / table / feedback / nav … -->
<script src="app.js"></script>               <!-- 5. 인터랙션 엔진 -->
```

> 폰트는 base.css가 Google Fonts에서 `@import` 하지만 **오프라인이면 시스템 모노로 우아하게 폴백**합니다 — `file://` 동작에 인터넷이 필요 없습니다.

---

## 3. 파일 구조

```
theme-07-cyberpunk-terminal/
├─ tokens.css          원시 토큰 — 네온 램프, 글로우/스캔라인, 풀 스케일, 키프레임
├─ semantic.css        시맨틱 + 컴포넌트 토큰 (다크 기본 / 고대비 반전 라이트)
├─ base.css            리셋, 모노 타이포, CRT 오버레이, HUD 유틸, 포커스 링, reduced-motion 가드
├─ components/
│  ├─ button.css       Button(정본 패턴) · ButtonGroup
│  ├─ forms.css        Input/Textarea/Select/Checkbox/Radio/Switch/Segmented/Slider/Stepper/
│  │                   Combobox/MultiSelect/ChipInput/Rating/SearchBar/FileUpload/DatePicker + Field
│  ├─ card.css         Card(터미널 윈도우) · StatCard(HUD) · KanbanCard · EmptyState
│  ├─ display.css      Badge/Tag · Avatar(+Group) · Tooltip · Popover · List · Timeline ·
│  │                   CodeBlock · Skeleton · Carousel · Calendar
│  ├─ table.css        Table(모노 데이터 그리드) · Tabs · Accordion
│  ├─ feedback.css     Alert/Banner · Toast · Modal · Drawer · Progress(bar/ring/ascii) · Spinner · InlineNote
│  └─ nav.css          Navbar · Sidebar(디렉터리 트리) · Breadcrumb · Pagination · Menu/Dropdown ·
│                      ContextMenu · Steps/Wizard · Kbd · CommandPalette(⌘K)
├─ app.js              모든 인터랙션 + 글리치/타이핑/부팅 + 테마전환 (data-attribute 구동)
├─ index.html          허브 — 부팅 인트로 + 토큰 비주얼 + 컴포넌트 갤러리 + 페이지 링크
├─ pages/              9개 실데모 화면 (아래 §8)
├─ README.md           이 문서
└─ CHECKLIST.md        구현·접근성 자가점검 결과
```

---

## 4. 토큰 아키텍처 (3-레이어)

```
tokens.css  ─►  semantic.css  ─►  components/*.css
(원시 값)        (역할 매핑)        (컴포넌트는 시맨틱 토큰만 소비)
--cyan-400      --color-primary    --btn-primary-bg / .ct-btn--primary
```

컴포넌트는 **원시 램프(`--cyan-400`)를 직접 쓰지 않고** 시맨틱/컴포넌트 토큰만 참조합니다. 그래서 브랜드 색·다크/라이트 전환을 **semantic.css 몇 줄**만 고쳐 끝낼 수 있습니다.

### 4.1 원시 색 램프 (tokens.css)
| 램프 | 스톱 | 시그니처 |
|------|------|----------|
| `--ink-*` | 0(밝은 인광백) → 1000(절대 보이드) | 표면 `--ink-950 #070A0F`, 카드 `--ink-850 #0B0F1A` |
| `--cyan-*` | 50 → 900 | **`--cyan-400 #00F0FF`** (primary) |
| `--magenta-*` | 50 → 900 | **`--magenta-400 #FF2BD6`** (accent) |
| `--green-*` | 50 → 900 | **`--green-400 #39FF14`** (success) |
| `--amber-*` | 50 → 900 | **`--amber-400 #FFB000`** (warning) |
| `--red-*` | 50 → 900 | **`--red-400 #FF3B47`** (danger) |

> 규칙: 숫자가 **작을수록 밝고**, 클수록 깊다. 각 색의 시그니처 네온은 `-400` 스톱.

### 4.2 효과·글로우 토큰
`--glow-cyan` / `--glow-magenta` / `--glow-green` / `--glow-amber` / `--glow-red`(+`-strong`) ·
`--shadow-glow-sm|md|lg`(네온 박스 글로우) · `--shadow-1|2|3`(순수 깊이) ·
`--scanline-opacity` · `--scanline-size` · `--crt-vignette` · `--grid-line` · `--noise-opacity`.

### 4.3 시맨틱 토큰 (semantic.css) — 컴포넌트가 쓰는 것
| 그룹 | 토큰 |
|------|------|
| 표면 | `--color-bg / -bg-2 / -surface / -surface-2 / -surface-3 / -overlay / -chrome` |
| 텍스트 | `--color-text / -text-muted / -text-subtle / -text-invert / -text-on-neon` |
| 브랜드 | `--color-primary(-bright/-dim/-fg/-weak)` · `--color-accent(-bright/-dim/-fg/-weak)` |
| 보더 | `--color-border / -border-strong / -border-muted / -border-glow / -divider` |
| 상태 | `--color-success / -warning / -danger / -info` (각 `-fg / -weak / -text`) |
| 포커스 | `--focus-ring`(네온) |
| 컴포넌트 | `--btn-*` · `--card-*` · `--input-*` · `--table-*` · `--tooltip-*` · `--nav-* / --sidebar-*` · `--modal-* / --drawer-* / --toast-* / --cmdk-*` |

### 4.4 스케일
- **공간** `--space-0 … --space-16` (4px 그리드)
- **타이포** `--text-2xs … --text-6xl`, `--leading-*`, `--tracking-*`(wide/wider/widest)
- **모서리** `--radius-0`(기본 0) · `--radius-sm/md/lg` · `--radius-full`(아바타/토글) · `--corner-cut`(clip-path 노치)
- **보더** `--border-1 / -2 / -thick`
- **z-index** `--z-sticky/-dropdown/-overlay/-drawer/-modal/-popover/-toast/-tooltip/-cmdk/-scanline`
- **모션** `--ease-standard/-out/-in` · `--duration-instant/-fast/-base/-slow/-slower` · 키프레임 `ct-cursor-blink/ct-glitch/ct-scan/ct-flicker/ct-sweep/ct-skeleton/ct-rise/…`

---

## 5. 컴포넌트 카탈로그 (70+)

명명 규칙(BEM-ish): **블록** `.ct-<name>` · **요소** `.ct-<name>__<part>` · **변형** `.ct-<name>--<variant>` · **상태** `.is-*` / 네이티브 `:checked`·`:disabled` / `[aria-*]`.

**폼** — `.ct-btn`(primary/secondary/ghost/danger/icon × sm/md/lg × hover-glitch/active/disabled/loading-scan) · `.ct-btn-group` · `.ct-input`(--prompt 명령행) · `.ct-textarea` · `.ct-select` · `.ct-multiselect` · `.ct-combobox` · `.ct-checkbox` · `.ct-radio` · `.ct-switch` · `.ct-segmented` · `.ct-slider` · `.ct-stepper` · `.ct-datepicker` · `.ct-fileupload` · `.ct-searchbar`(>_) · `.ct-rating` · `.ct-chipinput` · `.ct-field`(label/hint/error)

**표시** — `.ct-card`(터미널 윈도우: chrome+dots) · `.ct-stat`(HUD) · `.ct-badge` · `.ct-tag` · `.ct-avatar`(+`-group`) · `.ct-tooltip` · `.ct-popover` · `.ct-accordion` · `.ct-tabs`(underline/boxed/pill/vertical) · `.ct-table`(정렬·선택·페이지네이션) · `.ct-list`(+`--log`) · `.ct-timeline`(로그 스트림) · `.ct-kanban-card` · `.ct-code`(신택스 토큰) · `.ct-skeleton`(스캔) · `.ct-empty` · `.ct-carousel` · `.ct-calendar`

**피드백/오버레이** — `.ct-alert`(+`--banner`) · `.ct-toast`(스택·로그풍) · `.ct-modal`(터미널 팝업) · `.ct-drawer` · `.ct-cmdk`(⌘K 커맨드 팔레트) · `.ct-progress`(bar/circular/ascii 게이지) · `.ct-spinner`(braille ASCII) · `.ct-inline-note`

**내비** — `.ct-navbar` · `.ct-sidebar`(접힘·디렉터리 트리) · `.ct-breadcrumb`(path) · `.ct-pagination` · `.ct-menu`/`.ct-dropdown` · `.ct-context-menu` · `.ct-steps`(위저드) · `.ct-kbd`

---

## 6. JS 인터랙션 (app.js)

전부 **data-attribute 구동** — 마크업만 넣으면 자동 연결됩니다. 페이지가 일부 위젯만 써도 안전(각 모듈이 요소 부재를 가드).

| 기능 | 마크업 |
|------|--------|
| 테마 전환 | `[data-theme-toggle]` (localStorage 영속) |
| 커맨드 팔레트 | `⌘K`/`Ctrl+K` 또는 `[data-cmdk-open]` + `.ct-cmdk[data-cmdk]` |
| 타이핑 / 부팅 / 스크램블 | `[data-typing]` · `[data-boot="line|line"]` · `[data-scramble]` |
| 탭 / 아코디언 | `.ct-tabs[data-tabs]`(role=tab) · `.ct-accordion[data-accordion]` |
| 모달 / 드로어 | `[data-modal-open="#id"]` · `[data-drawer-open="#id"]` (+ `[data-*-close]`) |
| 토스트 | `[data-toast="msg" data-toast-variant=success]` 또는 `CT.toast({...})` |
| 드롭다운 / 컨텍스트 | `.ct-dropdown[data-dropdown]` · `[data-context-menu="#id"]` |
| 테이블 정렬·선택 | `th.ct-table__sort[data-sort]` · `[data-select-all]` + `[data-row-check]` |
| 스텝퍼/슬라이더 | `[data-stepper]` · `.ct-slider[data-slider]` |
| 스피너/게이지 | `[data-spinner]`(braille) · `[data-ascii-progress="42" data-width="20"]` |
| 사이드바/내비 토글 | `[data-sidebar-toggle]` · `[data-nav-toggle]` |
| 콤보박스/칩/평점/파일/달력 | `[data-combobox]` · `[data-chipinput]` · `[data-rating]` · `[data-fileupload]` · `[data-datepicker]` |

**명령형 API**: `window.CT.toast()`, `.openModal()`, `.closeModal()`, `.openDrawer()`, `.openCmdk()`, `.toggleTheme()`, `.asciiProgress(el, pct)`.

---

## 7. 테마 전환 & 교체 가이드

### 다크 ↔ 라이트
`<html data-theme="dark">` 가 정본. 라이트는 **고대비 반전 터미널**(밝은 인광 종이 + 근검정 텍스트 + 네온 보더 유지).
```js
CT.toggleTheme();                               // 또는
document.documentElement.setAttribute('data-theme','light');
```

### 브랜드 색 바꾸기 (예: 시안 → 네온 그린)
`semantic.css` 의 `:root,[data-theme="dark"]` 블록에서:
```css
--color-primary: var(--green-400);
--color-primary-fg: var(--ink-1000);
--glow-primary: var(--glow-green);
--focus-ring: /* green ring */ ...;
```
원시 램프(`tokens.css`)는 그대로 두고 매핑만 바꾸면 전 컴포넌트에 전파됩니다.

### 새 테마(예: 앰버 모노크롬) 추가
`semantic.css` 에 `[data-theme="amber"] { … }` 블록을 복제·수정하고 `data-theme="amber"` 로 적용.

### 글로우 끄기 / 스캔라인 조절
```css
:root { --glow-cyan: none; --scanline-opacity: 0; }   /* 미니멀 모드 */
```

---

## 8. 데모 페이지 (pages/)

| # | 파일 | 내용 |
|---|------|------|
| 01 | `dashboard.html` | 분석 대시보드 — HUD 위젯 + 네온 라인차트(SVG) + 데이터 그리드 + 로그 스트림 |
| 02 | `kanban.html` | 칸반 보드 — 4컬럼 + 우선순위 카드 + 새 작업 모달 |
| 03 | `inbox.html` | 3패널 인박스 — 폴더 / 메시지 로그 / 리딩 페인 + 작성 드로어 |
| 04 | `product.html` | 이커머스 상품 상세 — 캐러셀 갤러리 + 옵션 + 탭(스펙/리뷰) |
| 05 | `pricing.html` | 가격표 — 플랜 3개 + 월/연 토글 + 비교표 + FAQ |
| 06 | `settings.html` | 설정 — 세로 탭 + 토글/슬라이더 + 위험 영역(삭제 확인 모달) |
| 07 | `onboarding.html` | 온보딩 위저드 — Steps + 부팅 시퀀스 + 단계 전환 |
| 08 | `profile.html` | 프로필/계정 — 헤더 + 기여 히트맵 + 활동 타임라인 |
| 09 | `404.html` | 404(글리치) + 빈 상태 갤러리(NO_DATA/검색없음/연결끊김/스켈레톤) |

---

## 9. 접근성 (요약 — 상세는 CHECKLIST.md)

- **대비**: 본문/뮤트/서브틀 전부 AA(4.5:1↑) 검증. 네온 글로우는 장식이며 가독성은 솔리드 색이 책임.
- **광과민 안전**: 어떤 애니메이션도 초당 3회↑ 점멸 없음. 커서 깜빡임 ~1Hz, 글리치는 호버 시 짧은 1회.
- **`prefers-reduced-motion`**: 글리치·깜빡임·스캔라인·스윕·플로트 전역 정지(정적 표시) — base.css.
- **포커스**: 모든 인터랙션에 네온 글로우 링(절대 `outline:none` 단독 제거 금지).
- **상태 표현**: 색 단독 금지 — 항상 아이콘/라벨 병행.
- **키보드/ARIA**: 탭/아코디언/메뉴/모달/드로어/⌘K 키보드 조작 + role·aria 속성 + 포커스 트랩/복원.

---

## 10. 의존성 / 호환성

- 의존성 **0** (외부 CSS/JS 프레임워크 없음). 아이콘은 인라인 라인 SVG.
- 모던 브라우저(Chromium/Firefox/Safari) — CSS 변수, `clip-path`, `:has()`, `backdrop-filter`, `grid-template-rows: 0fr→1fr` 사용.
- 모든 HTML은 `file://` 더블클릭으로 렌더·동작. 360px → 1440px 반응형.
