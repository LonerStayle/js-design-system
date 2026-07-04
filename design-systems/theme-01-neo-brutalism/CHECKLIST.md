# CHECKLIST — THEME-01 · NEO-BRUTALISM

Self-audit of implementation, accessibility, and the brutalist design contract.
Legend: ✅ done · ➖ n/a · ⚠️ known limitation.

---

## A · Design DNA conformance

| Check | Status | Notes |
|-------|:------:|-------|
| Pure white bg / `#111` ink / 4 solid accents only | ✅ | `--blue/pink/lime/yellow-500` applied as flat planes |
| **No** gradients (decorative) | ✅ | Only flat patterns: dot/grid backgrounds, select chevron, progress hatch, hard 2-stop conic for circular progress |
| **No** blur / soft shadow / backdrop-filter | ✅ | Grep across `components/*`, `base.css`, `pages/*` → 0 hits for `blur(`, `backdrop-filter`, soft `box-shadow` |
| Hard offset shadows (blur 0) | ✅ | `--shadow-xs…xl` all `Npx Npx 0 0` |
| Press physics (hover lifts, active slams into shadow) | ✅ | `.btn`, `.pressable`, `.card--hover` |
| Thick borders (3–4px), near-zero radius | ✅ | `--border-3/4`, `--radius-md`=2px |
| Mono UPPERCASE labels, display headings | ✅ | `.mono-label`, `.eyebrow`, Space Grotesk/Archivo + JetBrains Mono |
| Sticker ±2° rotated badges | ✅ | `.sticker` / `.sticker--cw` |
| Accent 4px solid focus ring | ✅ | global `:focus-visible` in `base.css` |
| 404 hard text-shadow (blur 0) | ✅ | on-brand offset, not a soft shadow |

## B · Tokens (full scale)

| Check | Status |
|-------|:------:|
| Color ramps 50–950 (11 steps) × blue/pink/lime/yellow/neutral | ✅ |
| Spacing `--space-0 … --space-16` (+20/24/32), 4px base | ✅ |
| Type scale `--text-2xs … --text-6xl` (+7xl) with leading/tracking/weight | ✅ |
| Border widths `--border-1…6`, radii sm/md/lg/full | ✅ |
| Hard shadows xs/sm/md/lg/xl + press/hover | ✅ |
| z-index scale, breakpoints, rings, motion (ease/duration) | ✅ |
| Semantic tokens (bg/surface/text/border/intents + states) | ✅ |
| Component tokens (`--btn-* --card-* --input-* …`) | ✅ |
| Light **and** dark (dark inverts: dark surface, white border/shadow) | ✅ |
| `rem`-based sizes → user-scalable | ✅ |

## C · Components (every category, states/sizes/variants)

**Forms** — Button (primary/secondary/accent/ghost/danger/success/icon × sm/md/lg × hover/active/disabled/loading) ✅ · ButtonGroup ✅ · Input/Textarea/Select ✅ · InputGroup ✅ · SearchBar ✅ · Checkbox ✅ · Radio ✅ · Toggle/Switch ✅ · SegmentedControl ✅ · Slider ✅ · Stepper ✅ · FileUpload(dropzone) ✅ · Rating ✅ · ChipInput/TagInput ✅ · Combobox/MultiSelect ✅

**Display** — Card ✅ · StatCard ✅ · Badge/Tag ✅ · Sticker ✅ · Avatar/AvatarGroup ✅ · Tooltip ✅ · Popover ✅ · Accordion ✅ · Tabs ✅ · Table (sort/select/paginate) ✅ · List ✅ · Description list ✅ · Timeline ✅ · KanbanCard ✅ · CodeBlock ✅ · Skeleton ✅ · EmptyState ✅ · Carousel ✅ · Calendar/DatePicker ✅

**Feedback / overlay** — Alert/Banner ✅ · InlineNotification ✅ · Toast (stacking) ✅ · Modal/Dialog ✅ · Drawer ✅ · CommandPalette (⌘K) ✅ · Progress (bar + circular) ✅ · Spinner ✅

**Navigation** — Navbar ✅ · Sidebar (collapsible) ✅ · Breadcrumb ✅ · Pagination ✅ · Menu/Dropdown ✅ · ContextMenu ✅ · Steps/Wizard ✅

## D · Interactions (app.js, vanilla, file://)

| Behavior | Status |
|----------|:------:|
| Theme toggle (persist + system default) | ✅ |
| Tabs (arrow-key roving) | ✅ |
| Accordion (single/multi) | ✅ |
| Modal + Drawer (focus trap, Esc, backdrop, scroll lock) | ✅ |
| Toast stack + public `NB.toast()` | ✅ |
| Dropdown / Popover / Context menu (outside-click, Esc) | ✅ |
| Command palette (⌘K, filter, arrow nav, Enter) | ✅ |
| Stepper / Slider output / Rating / ChipInput / FileDrop | ✅ |
| Table sort + select-all | ✅ |
| Kanban drag-and-drop (HTML5 DnD) | ✅ |
| Carousel (dots, prev/next) | ✅ |
| Sidebar collapse / Combobox / Wizard / Copy / Count-up | ✅ |

## E · Showcase pages (pages/) — all responsive, realistic data

| # | Page | File | Status |
|---|------|------|:------:|
| 1 | Analytics dashboard (nav+sidebar+stats+table+CSS charts) | `dashboard.html` | ✅ |
| 2 | Kanban board (drag, 5 columns, ~18 cards) | `kanban.html` | ✅ |
| 3 | Email / inbox (3-pane) | `inbox.html` | ✅ |
| 4 | Ecommerce product detail (gallery/options/reviews) | `product.html` | ✅ |
| 5 | Pricing (3 plans, 1 highlighted, monthly/yearly) | `pricing.html` | ✅ |
| 6 | Settings (tabs+toggles+select+danger zone) | `settings.html` | ✅ |
| 7 | Onboarding wizard (multi-step) | `onboarding.html` | ✅ |
| 8 | Profile / account | `profile.html` | ✅ |
| 9 | 404 + empty states | `404.html` | ✅ |
| — | Hub (landing + tokens + gallery + page links) | `index.html` | ✅ |

## F · Accessibility & quality

| Check | Status | Notes |
|-------|:------:|-------|
| Contrast ≥ 4.5:1 on accent planes | ✅ | ink on lime/yellow, paper on blue/pink; verified pairs |
| Visible focus ring on every interactive element | ✅ | 4px accent outline, components opt-out only when drawing their own |
| `prefers-reduced-motion` honored | ✅ | global reduce block neutralizes transitions/animations + JS count-up/toasts check the query |
| Landmarks + ARIA roles/states | ✅ | header/nav/main/aside/footer; `role`/`aria-*` on tabs, menus, dialogs, sort headers |
| Keyboard operable | ✅ | tabs arrows, modal focus-trap, Esc closes, ⌘K palette, menu outside-click |
| No external CSS framework | ✅ | pure CSS + tokens |
| Icons inline SVG | ✅ | sprite in `index.html`, inline per page |
| Runs from `file://` (double-click) | ✅ | one `styles.css` + one `app.js`, relative paths |
| Responsive mobile/tablet/desktop | ✅ | grid utilities collapse at 1024/768/640; sidebars/panes adapt |

## G · Static verification performed

- **Brace balance**: all CSS files balanced `{` / `}`. ✅
- **DNA grep**: 0 forbidden blur/soft-shadow/gradient hits in components or pages. ✅
- **Class-existence audit** (`707` classes defined): every HTML references defined classes; remaining audit flags are intentional non-style hooks — `btn--md` (default size), `row-check`/`cb-demo` (JS hooks), `pagination__prev/next` (semantic hooks), `mail__pane--list` (responsive grid hook), single static theme icons. ✅
- **Headless render** of `index.html` via Chrome for Testing: no uncaught JS errors; layout renders. ✅

## H · Known limitations / notes

- ⚠️ Google Fonts load over the network (single `@import` in `tokens.css`). Offline, the stack falls back to system grotesque/mono — layout and weights still read as brutalist.
- ⚠️ DatePicker/Calendar and some "images" (product gallery) are visual/static demos (solid color blocks, no backend).
- ➖ No build step, bundler, or package manager by design — this is a zero-dependency, copy-the-folder system.

---

## I · 2026-07-04 시스템 레이어 재고도화 (fable-upgrade)

변경 노트: `docs/fable-upgrade/worklog/theme-01-neo-brutalism-system.md` · pages/ 9개는 같은 날 11:37–12:22 재고도화 완료 — 검증 기록은 §J.

| Check | Status | 근거 |
|-------|:------:|------|
| 폰트: 임포트 1곳 통합, Noto Serif KR 제거, 스택 순서(라틴→한글무드→Noto→system) | ✅ | `grep '@import\|fonts.googleapis' *.css` → tokens.css 1건. 1440 렌더에서 Black Han Sans 실적용 육안 확인 |
| SVG presentation attr `var()` (index+app.js) | ✅ 0건 | `grep 'stroke="var(\|fill="var(' index.html app.js` → 0 (app.js 별 아이콘 → `style=""`) |
| `href="#"` / 인라인 onclick / raw `.md` 링크 (index) | ✅ 0건 | grep 검증 |
| 인라인 `grid-template-columns` | ✅ 0건 | grep 검증 |
| FOUC 스니펫(head, nb-theme 키) + `data-theme` 하드코딩 제거 + app.js 우선순위(저장값→속성→OS) | ✅ | 다크 강제 렌더로 육안 확인 |
| 한글 조판 레이어(keep-all, ko 행간/자간, 이탤릭 무효화, tabular-nums) | ✅ | base.css `:lang(ko)` 블록 |
| 모바일 내비: 버거 → `mobile-nav` 드로어 계약 (index 구현, pages 이식 지침 전달) | ✅(index) | 같은 브레이크포인트(1024px) 공유 |
| 시그니처: 스탬프 리빌(motion.css) + 마퀴(marquee.css, 색 변주) + 색면 침수(.flood) + 포스터 히어로 | ✅ | 라이트/다크 1440 풀페이지 육안 확인 |
| reduced-motion: 스탬프 딜레이 포함 즉시 완성, 마퀴 정지 | ✅ | motion.css/marquee.css 전용 가드 |
| 360px: scrollWidth=360(가로 오버플로 0), 마퀴만 자체 클리핑 | ✅ | iframe 프로브 측정 |
| 유령 토큰: 점화(--ring-blue/pink, --surface-shadow, --color-accent-subtle, --leading-none) / 삭제(--ring-lime/yellow) / 스케일 램프는 intentional 주석 | ✅ | 정의-사용 diff |
| 상태 시연: invalid 필드(+에러문+핑크 링), disabled/loading, empty — index 장면 내 노출 | ✅ | 폼 탭 "팀 이름" 필드 등 |
| 대비(신규 쌍): paper/blue-500 ≈4.6:1, ink/yellow-500 ≈14:1, paper/ink 18.9:1 | ✅ | flood 섹션·콜로폰 |
| 콘솔 에러 0 (favicon 요청 제외) | ✅ | http 서빙 헤드리스 렌더 |

---

## J · 2026-07-04 pages 레이어 재고도화 검증 + 마감 수리 (fable-upgrade)

pages/ 9개 재고도화(11:37–12:22) 직후 API 장애로 검증·기록이 누락되어, 마감 수리(12:30–13:00)에서
① dashboard 사이드바 모바일 도달성 ② 어체 통일 ③ 인라인 반복 패턴 승격 ④ progress.css intentional 주석을
처리한 뒤 아래를 실측했다.

### J-1 · 자동 검증 (grep — index.html + pages/*.html 10개)

| Check | 실측 | 근거 |
|-------|------|------|
| SVG presentation attr `var()` | **0건** | `grep 'stroke="var(\|fill="var(\|stop-color="var(\|color="var(\|font-family="var('` — product.html의 `data-fill/data-fg` 4건은 JS가 `style`로 소비하는 오탐(브리프 §4-1 명시) |
| `lang="ko"` | **10/10** | `grep -L 'lang="ko"'` 출력 0 |
| components hex (intentional 제외) | **0건** | progress.css:139,141 mask `#000` 2건에 `/* intentional: mask color — alpha only */` 부여 후 grep 0 |
| raw `.md` 링크 / `href="#"` / 인라인 onclick | **0건** | grep 0 |
| 인라인 `grid-template-columns` | **0건** | grep 0 |
| `aria-selected` | 19건 전부 `role="tab"` 문맥 | 무효 ARIA 0 |
| 서구권 filler (`$n`/`€`/`PM<`/`ago<`/Trusted by/Acme/Lorem) | **0건** | grep 0 |
| 인라인 style 50+ 페이지의 3회+ 반복 패턴 | **0건** | index 105→99 · profile 72→37 · product 65→47 (`.text-lg/.text-sm/.text-2xs.text-muted/.text-xl/.gap-0/.gap-2/.mt-6/.text-blue/.text-pink` 승격, 잔여는 `--stack-gap` 노브·1회성 데이터 값) |

### J-2 · 뷰포트·모바일 내비 (headless Chrome 145 iframe 프로브 실측)

- **360px 정지 상태 가로 오버플로 0**: 10/10 페이지 `scrollWidth == clientWidth(349)`. 스탬프 리빌 재생 중에는 scale 1.18 오버슈트가 일시적 우측 오버플로를 만들 수 있으나(시그니처 물리) 정지 상태 기준 통과.
- **내비 수단 0 뷰포트 없음**: 8/10 페이지 버거+`mobile-nav` 드로어 실존. 404·onboarding은 의도된 무-navbar 무대 — 각각 앵커 11·5개로 홈/대시보드 복귀 경로 실존.
- **dashboard 워크스페이스 사이드바 (§4-6-2)**: ≤1024px에서 `display:none` + 드로어에 사이드바 전 경로(작업보드/상품/요금제/설정/프로필/받은편지함) 포함 — 800px 프로브로 실측(`sidebar display=none`, `drawer missing routes=none`). 이전 off-canvas `.sidebar.is-open`은 오프너 없는 데드 CSS + translateX 은닉의 탭 누수였음 → 제거, 숨김 사이드바 링크 포커스 불가(`focusable=false`) 실측. index 데모는 신설 `.sidebar--static`(in-flow 변형)으로 800px에서도 `display:flex` 유지 실측.
- 768px 라이트 스크린샷 육안: 사이드바 숨김 + 버거 노출 + KPI 벤토 1→2열 낙하 정상.

### J-3 · 콘솔·다크·대비·어체

- **콘솔 에러 0**: 10/10 페이지 headless 로그 `CONSOLE|Uncaught|net::ERR` 0건 (favicon 제외).
- **다크모드 육안**: dashboard 1440 라이트/다크 풀페이지 스크린샷 — 흰 보더·흰 하드섀도 계약, flood 히어로 stat, 차트, 알럿 전부 정상.
- **신규 색 쌍 실측 (WCAG)**: 액센트 "텍스트" 전용 시맨틱 토큰 신설(`--color-text-blue/pink`) — 라이트 blue-500/paper **5.18:1** · pink-600/paper **4.54:1**, 다크 blue-400/neutral-900 **5.62:1** · pink-400/neutral-900 **6.55:1** (배경 색면용 500과 분리, 인라인 pink-500/paper 3.34:1 미달분 교정. profile 타임라인·`.profile-meta a` 적용).
- **어체 단일화 (§5-C-5, 선언·명령 군)**: settings 도움말·토스트·버튼 합니다체 통일(해요체 선언문 15곳 교정, 삭제 모달 "마지막 확인"/"남겨두기·영구 삭제"), profile 3곳 · dashboard 2곳 · inbox 토스트 1곳 · index 도움말 1곳 동일 교정. 명령형 "~세요"와 명사형 종결 디스플레이 카피는 유지. product 리뷰·inbox 메일 본문 등 세계관 콘텐츠는 판정 제외.
