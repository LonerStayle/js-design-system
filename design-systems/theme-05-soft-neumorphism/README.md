# Theme 05 — Soft Neumorphism

> 배경과 표면이 **하나의 재질**이다. 깊이는 색이나 보더가 아니라, 오직 **이중 그림자**에서 태어난다.

차분하고 촉각적인 미니멀 디자인 시스템. 요소가 부드러운 블루그레이 평면에서 솟아오르거나(raised) 눌려 들어가며(pressed), 좌상단에 고정된 광원이 모든 형태에 일관된 입체감을 부여한다. 순수 CSS + 바닐라 JS로만 구현되었고, 외부 프레임워크가 0이며, 모든 HTML은 **더블클릭(`file://`)** 만으로 렌더·동작한다.

---

## 1. 디자인 철학 (Design DNA)

| 원칙 | 내용 |
|---|---|
| **표면 = 배경** | `--color-bg`와 `--color-surface`는 **같은 색**이다. 카드는 다른 색으로 칠해지지 않고, 그림자로 *조각*된다. |
| **이중 그림자** | 솟음 = 좌상단 밝은 하이라이트 + 우하단 어두운 그림자. 눌림 = 같은 그림자를 안쪽(inset)으로 뒤집은 것. 광원은 항상 좌상단. |
| **절제된 색** | 단일 뉴트럴 베이스(소프트 블루그레이) + 인디고 primary + 민트 accent. 요란한 색·하드 섀도·하드 보더 금지. |
| **큰 라운드** | `--radius-md 16`, `--radius-lg 24`, `--radius-xl 32`. 조약돌처럼 부드러운 실루엣. |
| **물리적 인터랙션** | 호버 시 그림자 강조, `:active` 시 안으로 눌림. 토글은 진짜 스위치처럼, 인풋·트랙은 파인 홈처럼. |
| **접근성 우선 예외** | 소프트 룩의 약점(낮은 대비)을 보완하기 위해, 텍스트는 진하게(≥4.5:1), Primary·상태는 솔리드 색 채움, 포커스는 뚜렷한 액센트 링으로 강제한다. |

### 시그니처
- **솟은 카드/버튼** · **눌린 인풋(inset well)** · **물리 스위치풍 토글** · **솟은 핸들 + 파인 트랙 슬라이더**
- 라이트/다크 양쪽 지원 — 다크는 베이스만 어둡게 바꾸면 그림자/하이라이트가 자동 재계산된다.

---

## 2. 파일 구조

```
theme-05-soft-neumorphism/
├── tokens.css          원시 토큰 (뉴모픽 그림자 합성, 색 램프, 스케일, 모션, z-index, 브레이크포인트) — 라이트+다크
├── semantic.css        시맨틱 토큰(--color-*) + 컴포넌트 토큰(--btn-*, --card-*, --input-* …)
├── base.css            리셋·타이포그래피·레이아웃 유틸·애니메이션·reduced-motion
├── theme.css           ★ 마스터 번들 (위 + 아래 컴포넌트를 순서대로 @import) — HTML은 이 한 줄만 링크
├── components/
│   ├── buttons.css     Button(5변형×3크기×상태), ButtonGroup, IconButton
│   ├── forms.css       Input·Textarea·Select·Checkbox·Radio·Switch·Segmented·Slider·Stepper·Search·Rating·ChipInput·FileUpload·Combobox
│   ├── cards.css       Card·StatCard·KanbanCard·PriceCard·MediaCard
│   ├── badges.css      Badge/Tag·Avatar/AvatarGroup·Tooltip·Popover
│   ├── data-display.css Table(정렬/선택)·List·Timeline·Accordion·Tabs·CodeBlock·Calendar·Carousel
│   ├── feedback.css    Alert/Banner·Toast·Progress(바/원형)·Spinner·Skeleton·EmptyState·InlineNotification
│   ├── overlays.css    Modal·Drawer·Menu/Dropdown·ContextMenu·CommandPalette(⌘K)·kbd
│   └── navigation.css  Navbar·Sidebar(접힘)·Breadcrumb·Pagination·Steps/Wizard·AppShell·ThemeToggle
├── app.js              모든 인터랙션 + 테마 전환 (data-속성 위임)
├── index.html          허브: 토큰 비주얼 + 전 컴포넌트 갤러리 + 페이지 링크
├── pages/              9개 실데모 화면
│   ├── dashboard.html  분석 대시보드 (솟은 위젯 + 차트 + 정렬 테이블 + 타임라인)
│   ├── kanban.html     칸반 보드 (4컬럼 + 드래그 느낌 카드)
│   ├── inbox.html      이메일 인박스 (폴더/목록/본문 3패널)
│   ├── product.html    이커머스 상품 상세 (갤러리·옵션·리뷰·관련상품)
│   ├── pricing.html    가격표 (3플랜 + 월/연 토글 + 비교표 + FAQ)
│   ├── settings.html   설정 (5탭 + 토글 + 위험 영역)
│   ├── onboarding.html 온보딩 위저드 (4단계 Steps)
│   ├── profile.html    프로필/계정 (헤더·통계·탭·캘린더)
│   └── not-found.html  404 + 빈 상태 모음 + 스켈레톤
├── README.md
└── CHECKLIST.md        구현·접근성 자가점검 (대비 측정값 포함)
```

### 사용법
모든 페이지 `<head>`에 한 줄, body 끝에 한 줄이면 끝.
```html
<link rel="stylesheet" href="./theme.css">   <!-- pages/ 안에서는 ../theme.css -->
...
<script src="./app.js"></script>             <!-- pages/ 안에서는 ../app.js -->
```

---

## 3. 토큰 레퍼런스

### 3.1 뉴모픽 베이스 & 그림자 (시스템의 심장)
| 토큰 | 라이트 | 다크 | 용도 |
|---|---|---|---|
| `--nm-base` | `#e4eaf2` | `#2a2e37` | 배경 = 표면 |
| `--nm-light` | `#ffffff` | `#353a47` | 좌상단 하이라이트 |
| `--nm-dark` | `#bcc6d6` | `#1f2229` | 우하단 그림자 |
| `--nm-base-sunken` | `#dde4ee` | `#262a32` | 인풋이 놓이는 파인 바닥 |
| `--nm-distance` / `--nm-blur` | `6px` / `12px` | — | 그림자 오프셋·번짐 (이 둘만 바꾸면 전체 재튜닝) |

**합성 그림자** — 컴포넌트는 이 토큰만 참조한다:
`--shadow-flat` · `--shadow-raised` · `--shadow-raised-sm` · `--shadow-raised-lg` · `--shadow-pressed` · `--shadow-pressed-sm` · `--shadow-float`(오버레이용 단일 캐스트)

### 3.2 색 램프
- **neutral** 50–900 — 베이스가 속한 블루그레이 패밀리. 텍스트·UI.
- **indigo** 50–900 — primary 액센트. `--indigo-600 #4f46e5`가 Primary 버튼 채움(흰 글씨 6.3:1).
- **mint** 50–900 — 보조 시그니처 액센트.
- **status** — `--green/amber/red/blue` (success/warning/danger/info). 라이트에서는 4.5:1을 위해 의도적으로 깊은 톤, 다크에서는 밝은 톤으로 재정의.

### 3.3 시맨틱 토큰 (semantic.css)
`--color-bg` · `--color-surface`(=bg) · `--color-surface-2` · `--color-well`(인풋 바닥) · `--color-text` · `--color-text-strong` · `--color-text-muted` · `--color-text-faint` · `--color-primary` / `-hover` / `-fg` / `-soft` · `--color-accent` / `-fg` / `-soft` · `--color-border` · `--color-success|warning|danger|info` (+ `-fg`, `-soft`)

### 3.4 컴포넌트 토큰 (raised/pressed 상태 매핑)
`--btn-*` (radius, shadow, shadow-hover, shadow-active, primary-bg/fg, padding) · `--card-*` · `--input-*` (bg=well, shadow=pressed, focus) · `--switch-*` · `--track-*`(슬라이더/프로그레스 파인 트랙) · `--modal-*` · `--pop-*` · `--table-*` · `--tag-*`

### 3.5 그 외 스케일
- 간격 `--space-0 … --space-16` (4px 리듬)
- 타이포 `--text-2xs … --text-6xl`, `--leading-*`, `--tracking-*`, `--weight-*` — 폰트는 **Quicksand**(디스플레이) + **Nunito**(본문), 둥근 산세리프
- 모서리 `--radius-xs … --radius-2xl`, `--radius-full`
- 모션 `--ease-standard` / `--ease-soft`(부드러운 오버슈트) / `--ease-out`, `--duration-fast|base|slow`
- 포커스 `--ring`, `--ring-inset`, `--ring-color`
- `--z-*` 스케일, `--bp-*` 브레이크포인트(480/768/1024/1280/1536)

---

## 4. 컴포넌트 목록

**폼** — Button(primary·secondary·accent·ghost·danger·icon × sm·md·lg × hover·active·disabled·loading), ButtonGroup, Input(inset), Textarea, Select, Combobox/MultiSelect, Checkbox, Radio, Switch, SegmentedControl, Slider, Stepper, SearchBar, Rating, ChipInput, FileUpload
**표시** — Card·StatCard·PriceCard·KanbanCard·MediaCard, Badge/Tag, Avatar/AvatarGroup, Tooltip, Popover, Accordion, Tabs(+underline), Table(정렬·선택·페이지네이션), List, Timeline, CodeBlock, Skeleton, EmptyState, Carousel, Calendar
**피드백/오버레이** — Alert/Banner, Toast(스택·자동소멸), Modal/Dialog, Drawer, CommandPalette(⌘K), Progress(바·원형·줄무늬), Spinner(링·도트), InlineNotification
**내비** — Navbar(+floating), Sidebar(접힘·모바일 드로어), Breadcrumb, Pagination, Menu/Dropdown, ContextMenu, Steps/Wizard(가로·세로), AppShell, ThemeToggle

각 인터랙티브 컴포넌트는 키보드 조작과 ARIA를 갖춘다. 자세한 마크업 예시는 `index.html`의 갤러리 섹션을 참고.

### app.js 공개 API
```js
NM.toast({ title, text, variant:'success|warning|danger|info', timeout })
NM.openModal(id) / NM.closeModal(id)
NM.openDrawer(id) / NM.closeDrawer(id)
NM.theme.toggle() / NM.theme.set('light'|'dark')   // localStorage 영속
NM.cmdk.open() / NM.cmdk.close()                    // ⌘K / Ctrl-K 자동 바인딩
```
선언적 트리거(HTML 속성만으로 동작): `data-theme-toggle` · `data-modal-open/close` · `data-drawer-open/close` · `data-menu-toggle` · `data-popover-toggle` · `data-tab` · `data-accordion`(+`data-accordion-single`) · `data-segment` · `data-pricing-toggle` · `data-stepper` · `data-rating` · `data-copy` · `data-context-menu` · `data-cmdk-open` · `data-sidebar-toggle` · `data-collapse-sidebar` · `data-toast`

---

## 5. 교체 가이드 (테마 커스터마이징)

이 시스템은 **토큰 우선** 설계라, 대부분의 변경은 `tokens.css` 한 곳만 만진다.

1. **재질(베이스 색) 바꾸기** — `tokens.css`의 `--nm-base`, `--nm-light`(하이라이트), `--nm-dark`(그림자) 세 값만 바꾸면 모든 그림자가 자동 재합성된다. 하이라이트는 베이스보다 밝게, 그림자는 어둡게 유지하라(같은 색조 권장).
2. **깊이감 조절** — `--nm-distance`(오프셋)와 `--nm-blur`(번짐)를 키우면 더 도드라지고, 줄이면 더 미묘해진다. `*-sm`/`*-lg` 합성 토큰도 함께 따라온다.
3. **액센트 색 바꾸기** — `--indigo-*`(primary)와 `--mint-*`(accent) 램프를 교체. ⚠️ Primary 버튼·솔리드 채움은 **흰 글씨 대비 4.5:1**을 유지해야 하니, 600 단계가 충분히 어두운지 확인(`CHECKLIST.md`의 측정 방식 참고).
4. **다크 테마** — `tokens.css`의 `[data-theme="dark"]` 블록에서 베이스 3색 + neutral 램프(텍스트가 near-white가 되도록 반전) + 상태색만 재정의하면 된다.
5. **모양(라운드/간격)** — `--radius-*`, `--space-*` 스케일만 조정.
6. **폰트 교체** — `tokens.css`의 `--font-display`, `--font-body`와 `base.css` 상단의 `@import`(Google Fonts) URL을 교체. 둥근 산세리프 권장(Quicksand/Nunito/Comfortaa 등).

> 컴포넌트 CSS는 시맨틱·컴포넌트 토큰만 참조하므로, 토큰을 바꾸면 컴포넌트 코드를 건드리지 않고 전체 룩이 바뀐다.

---

## 6. 품질·접근성
- 본문/라벨 텍스트 대비 **≥ 4.5:1** (라이트·다크 양쪽, 측정값은 `CHECKLIST.md`).
- Primary·상태는 **솔리드 색 채움**으로 구분(이중 그림자에만 의존하지 않음). 상태는 **색 + 아이콘/점** 다중 단서.
- 모든 인터랙티브 요소에 **뚜렷한 액센트 포커스 링**.
- `prefers-reduced-motion` 대응(모션 전역 비활성).
- 외부 CSS 프레임워크 0 · 아이콘 전부 인라인 SVG · `file://` 더블클릭 동작 · 반응형(480/768/1024/1280).
