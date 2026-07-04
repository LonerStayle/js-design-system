# Folio · XXIV — Implementation & Accessibility Checklist

Self-audit for the Gothic / Dark Academia design system.
Legend: ✅ done · ⚠️ partial / noted · — n/a

_Last swept: 2026-07-04 — fable-upgrade 시스템 레이어 + 페이지 레이어 + 마감 수리까지 반영._

---

## A. Foundation

| Item | Status | Note |
|------|:--:|------|
| `tokens.css` — burgundy/forest/gold/neutral ramps 50–900 | ✅ | Anchors: oxblood `#5C1A1B`, forest `#22372B`, gold `#A6843C`, parchment `#E7DCC4` |
| Decorative tokens (drop-cap, flourish, fleur, rule, corner, textures, blackletter) | ✅ | Inline-SVG data URIs, offline-safe |
| Full scales: spacing 0–16, type 2xs–7xl, leading, tracking, radii, borders, shadows, glow, z-index, breakpoints, motion | ✅ | |
| `semantic.css` — light & dark, all required roles | ✅ | Dark canonical; light = aged parchment |
| Component tokens `--btn/-card/-input/-table/-code/-tooltip/-nav/-sidebar-*` | ✅ | |
| `base.css` — reset, typography, textures, ornament utilities, layout, a11y, motion | ✅ | |

## B. Components implemented

| Category | Components | Status |
|----------|-----------|:--:|
| Forms | Button (5 variants × 3 sizes × states + icon + loading), ButtonGroup, Segmented, Input, Textarea, Select, Combobox/MultiSelect (listbox), Checkbox, Radio, Toggle, Slider, Stepper, ChipInput, Rating, FileUpload, SearchBar | ✅ |
| Display | Card (+illuminated/hover/accent), StatCard, Badge (+wax), Avatar/Group, Tooltip, Popover, Accordion, Tabs (line+pill), Table (sort/select/stripe), List, Timeline, KanbanCard, CodeBlock, Skeleton, EmptyState, Carousel, Calendar | ✅ |
| Feedback | Alert/Banner, InlineNotification, Toast (stack), Modal, Drawer, CommandPalette, Progress (bar/ring/striped), Spinner | ✅ |
| Navigation | Navbar, Sidebar (collapse), Breadcrumb, Pagination, Menu, ContextMenu, Steps/Wizard | ✅ |

## C. Interactions (`app.js`, vanilla, zero deps)

| Behaviour | Status |
|-----------|:--:|
| Theme toggle (persisted, dark default) | ✅ |
| Tabs (roving tabindex, arrow/Home/End keys) | ✅ |
| Accordion (single & multi, height anim) | ✅ |
| Modal (focus trap, ESC, backdrop, scroll lock) | ✅ |
| Drawer (left/right, overlay, ESC) | ✅ |
| Toast (stacking, auto-dismiss, variants, programmatic API) | ✅ |
| Command Palette ⌘K (filter, arrow nav, group hide, actions) | ✅ |
| Menu / Popover / Context menu (outside-click close, ESC) | ✅ |
| Stepper, Slider live output, ChipInput, FileUpload dropzone | ✅ |
| Table sort + select-all, Carousel, Sidebar collapse, Copy | ✅ |
| Pricing toggle, Wizard, Password reveal, Live filter, Scroll reveal, Radio-cards | ✅ |

## D. Demonstration pages

| № | Page | Built | Renders file:// | Responsive | Notes |
|---|------|:--:|:--:|:--:|------|
| I | dashboard.html | ✅ | ✅ | ✅ | sidebar + stats + charts + sortable ledger + timeline |
| II | kanban.html | ✅ | ✅ | ✅ | real HTML5 drag-and-drop across 4 columns |
| III | inbox.html | ✅ | ✅ | ✅ | 3-panel epistolary, collapses to 1 col |
| IV | product.html | ✅ | ✅ | ✅ | carousel gallery, radio-card variants, tabs |
| V | pricing.html | ✅ | ✅ | ✅ | monthly/annual toggle, comparison table, FAQ |
| VI | settings.html | ✅ | ✅ | ✅ | vertical tabs, switches, danger-zone modal |
| VII | onboarding.html | ✅ | ✅ | ✅ | multi-step wizard with progress |
| VIII | profile.html | ✅ | ✅ | ✅ | dossier hero, tabs, timeline, aside |
| IX | 404.html | ✅ | ✅ | ✅ | lost-page hero + empty-states gallery |
| X | article.html | ✅ | ✅ | ✅ | showpiece: drop cap, flourishes, TOC, marginalia, reading progress |

## E. Accessibility

| Item | Status | Note |
|------|:--:|------|
| Text contrast ≥ 4.5:1 | ✅ | **2026-07-04 실측 (node WCAG 계산):** parchment `#e7dcc4`/ink `#141210` = 13.73:1 · subtle `#9c9077`(신설 neutral-350) = 5.32:1 on surface, 4.51:1 on surface-2 · danger 텍스트 `#d17c77`(burgundy-300으로 승격) = 6.11:1 on bg · danger 보더 `#b5524c` = 3.41:1 (비텍스트 3:1) · 차트 라인 gold-400 6.38 / burgundy-300 5.47 / forest-300 5.46:1 · 방주 잉크 8.42:1 · input 보더(다크) 3.22:1 on inset · 라이트: subtle 6.02 / danger 10.07 / 차트 gold-600 4.14(비텍스트)·forest-600 8.56·burgundy-600 9.01:1 |
| Blackletter not used for body copy | ✅ | Large decorative only (hero, drop cap, ornaments) |
| Decoration `aria-hidden`, meaning in text | ✅ | Ornaments, icons, charts decorative-marked |
| Visible focus ring (gold, 2px, offset) | ✅ | Global `:focus-visible` rule |
| `prefers-reduced-motion` honoured | ✅ | Animations, transitions, smooth-scroll disabled |
| Keyboard operable + ARIA roles/states | ✅ | tabs, dialog, menu, table, switch, steps |
| Skip-link to main content | ✅ | On hub + app pages |

## F. Quality gates

| Item | Status |
|------|:--:|
| Zero external CSS/JS frameworks | ✅ |
| Pure CSS + token variables; ornaments & icons inline SVG | ✅ |
| Every HTML renders by double-click (`file://`) | ✅ |
| Responsive breakpoints (≤480 / ≤768 / ≤1024) | ✅ |
| No writes outside `theme-24-gothic-dark-academia/` | ✅ |
| README: philosophy, token tables, component list, replacement guide | ✅ |

---

### Verification method
Validated statically (a live headless browser was occupied by a parallel
process at audit time): all 22 files present; every page links `base.css` + the
five component sheets + `app.js` with correct `../` paths and a valid doctype;
CSS brace-balance OK on all sheets; `app.js` and every inline page `<script>`
pass `node --check`/parse; HTML structure well-formed (one `html`/`head`/`body`
each); all referenced component classes resolved (the one gap found — `.radio-card`
— was added to `forms.css`); two `settings.html` hook mismatches (`data-toast-body`,
`data-pw-target`) fixed by making `app.js` tolerant of both spellings; no
references to any other `theme-*` folder.

### 2026-07-04 시스템 레이어 재고도화 (fable-upgrade)

**자동 검증 결과 (전부 통과):**
- SVG 표현 속성 `var()` — index.html 0건 (`grep 'stroke="var(\|fill="var('` — 히어로 크레스트는 currentColor/style 패턴으로 교체). pages/ 잔여분은 이후 페이지 레이어 작업에서 해소 — 아래 최종 절 실측 0건.
- index.html 하드코딩 `stroke="#`/`fill="#` 0건 · `href="#"` 0건 · 인라인 grid-template 0건 · 서구권 filler(£·$·€) 0건.
- `node --check app.js` 통과 · 토큰 참조 diff — 미정의 참조 0건 (시스템 레이어).
- `keep-all` — base.css body에 전역 적용 + `:lang(ko)` 한글 조판 레이어 신설.
- 폰트 로딩 — @import 2곳 → base.css 1곳 통합, 미사용 Cinzel Decorative·Cormorant Garamond 로드 제거, index에 preconnect 추가.

**신규/변경 (요약 — 상세는 `docs/fable-upgrade/worklog/theme-24-gothic-dark-academia-system.md`):**
- 시그니처: 커서 촛불 광원(`.candle-pool`, 다크 전용, reduced-motion/터치 스킵) · 테마 전환 점화/채광 베일 · ink-settle 등장 모션 · 밀랍 스탬프(`stamp-in`).
- 방주 유틸 `.margin-note`(Nanum Pen Script + `--ink-annotation`) · 동판화 차트 토큰 `--chart-*` · 닫힌 오버레이/드로어/메뉴 visibility 비간섭 · th 정렬 버튼 자동 승격(키보드) · cmdk combobox/listbox ARIA · segmented radiogroup 패턴(`data-segmented`) · 모바일 내비 클래스 기반.
- app.js 사용자 노출 문자열 전면 한글화 (토스트·위저드·캐러셀·칩·복사·요금 주기).
- index.html: FOUC 스니펫 + `data-theme` 하드코딩 제거, 표제지 히어로(세로쓰기 책등 + XXIV 워터마크), 폴리오 스프레드(비대칭 12컬럼 + 판면 밖 폴리오 번호 + 관통 괘선), 콜로폰 푸터, 자기참조 dev-tool 카피 제거.

(당시 "미완(페이지 에이전트 몫)"으로 남겼던 항목 — pages/ 전면 한글화 · SVG var() 16곳 · 오프팔레트 hex · 칸반 키보드 대체 · FOUC 스니펫 이식 · 모바일 내비 토글 — 은 전부 완료되었고, 아래 최종 절에 실측 근거를 기록했다.)

### 2026-07-04 페이지 레이어 완료 + 마감 수리 (fable-upgrade · 최종)

페이지 레이어 실측: pages/ 10장 전면 한글화 완료, SVG 표현 속성 var() 0건, FOUC 스니펫 11/11 이식(`data-theme` 하드코딩 0), 모바일 내비 토글 실존(하단 표 참조), 칸반 키보드 대체 버튼(`data-move` "이전/다음 열로 이동" × 5카드) + 라이브 리전 구현.

**§7-1 자동 검증 (grep 실측 · 전 HTML/CSS/JS):**

| # | 항목 | 결과 |
|---|------|------|
| 1 | SVG 표현 속성 var() (`stroke=\|fill=\|stop-color=\|color=\|font-family="var("`) | **0건** (index + pages 11개 전체) |
| 2 | `lang="ko"` 미포함 HTML | **0개** (11/11 포함) |
| 3 | 하드코딩 hex — components/*.css (intentional 주석 제외) | **0건** · pages/*.html 6자리 hex **0건** |
| 4 | 폰트 로딩 | base.css `@import` 1곳 단일화 · 전 11페이지 preconnect 2줄 · 미사용 패밀리 로드 0 |
| 5 | raw `.md` 링크 / `href="#"` / inline `onclick` | **0건** |
| 6 | 인라인 `grid-template-columns` | **0건** |
| 7 | `aria-selected` 21건 | 전부 `role="tab"` 문맥(진짜 탭) 또는 CSS 셀렉터 — plain button 오용 **0건** |
| 8 | 미정의 토큰 참조 (정의 목록 diff) | **0건** (`--mx`/`--my`는 app.js `setProperty` 런타임 주입 노브 — 폴백 내장) |
| 9 | 서구권 filler (`$`·`€`·`PM<`·`ago<`·Trusted by·Acme·Lorem·>Claude<) | **0건** |
| 10 | `keep-all` | base.css body 전역 + `:lang(ko)` 한글 조판 레이어 |

**§7-2 수동 검증 매트릭스 (headless Chromium 실측 + 스크린샷 육안):**

| 항목 | 방법 | 결과 |
|------|------|------|
| 4뷰포트 × 2테마 | 360/768/1024/1440 × 다크/라이트 × 11페이지 = **88조합** scrollWidth 실측 | 가로 스크롤 **0건** (최초 실측에서 2건 발견 → 수리 → 재실측 0건, 하단 참조) |
| 내비 수단 (360px) | 가시 토글 실존 검사 | 9페이지 `data-nav-toggle` · dashboard = 사이드바 오프캔버스 토글(`mob-sidebar-btn`, aria-expanded) · onboarding = 슬림바(내비 리스트 자체가 없음 — 죽은 버거 금지 원칙에 따라 토글 없음이 정답) |
| FOUC | localStorage `theme-24-mode` 저장 후 로드 ×11, domcontentloaded 시점 `data-theme` 검사 | 11/11 **'dark' 즉시 적용** — head 최상단 동기 스니펫이 스타일시트보다 먼저 실행 |
| file:// 콘솔 | pageerror + console.error + requestfailed 수집 (22회 로드) | **0건** (깨진 리소스 0) |
| reduced-motion | `emulateMedia: reduce` — index/article | `[data-reveal]` 숨김 잔존 **0** · `.candle-pool` 생성 스킵 · 전 애니 0.001ms/1회 강제 (base.css 473~481행) |
| 육안 (스크린샷 4장) | index 다크 1440 / dashboard 다크 360 / article 라이트 768 / pricing 라이트 1440 | 보더 소실·라이트 잔존 패턴 없음 · 무드 한글폰트(Nanum Myeongjo/Song Myung/Nanum Pen Script) 실적용 확인 · 블랙레터는 장식 전용 유지 |

**§7-2 실측에서 발견 → 수리한 결함 2건:**
- dashboard 360px 가로 스크롤 +322px: 장부 카드 그리드 아이템 min-content 폭주(검색바 인라인 `width:200px` + no-wrap 헤더 + 테이블) → `.lower-row/.chart-row > * { min-width:0 }` + 카드 헤더 `flex-wrap` + 검색바 `.ledger-search` 클래스 승격(≤640에서 100%). `.page-header__right`의 `flex-shrink:0`(+7px)도 `min-width:0`으로 교정.
- index 768px 가로 스크롤 +55px: 닫힌 팝오버 패널(좌측 앵커, min-width 16rem, `visibility:hidden`이라도 scrollWidth에 기여)이 재단면 침범 → 우측 앵커 미디어쿼리 640→**1024px** 확대 + `max-width: calc(100vw - var(--space-6))` 상한 (display.css).

**죽은 자산 정리 (§7-3 서약):**
- 키프레임: `fade-up`/`fade-in` **삭제** — ink-settle 교체 후 소비 0건이었고, `filter` 미지원 환경에서는 blur 선언만 무시된 채 opacity/transform 페이드가 동작하므로 별도 폴백 키프레임이 불필요(주석도 갱신). 잔존 키프레임 9종(ink-settle·candle-flicker·spin·shimmer·smoke-rise·stamp-in·toast-in/out·veil-kindle) 전부 소비처 ≥1 실측.
- 토큰 점화 3+2종: `--color-primary-active`/`--color-accent-active` → `.btn--primary:active`/`.btn--gold:active` 배경(§4-3 active 상태 시연 보강) · `--input-focus-ring` → input/textarea/select `:focus` 보더 · `--shadow-inset` → `.segmented` 파인 우물 깊이.
- 토큰 삭제 5종: `--color-surface-3`·`--color-text-inverse`(양 테마 블록)·`--card-rule`·`--panel-bg`·`--panel-border` — 자연 소비자 부재, README 공개 API 아님.
- 재검증: tokens.css+semantic.css 정의 전수 vs 전 파일 `var()` 소비 diff — 0-소비 잔존은 §G 스케일 완결성 목록 22종뿐.

## G. Intentional scale completeness — 0-소비 보존 토큰 근거

README(§Tokens)가 공개 API로 문서화한 스케일의 **완결성 유지 목적**으로, 현재 소비처가 없어도 보존하는 토큰 22종 (tokens.css 헤더 주석에도 명기):

| 군 | 토큰 | 근거 |
|----|------|------|
| Breakpoints | `--bp-sm/md/lg/xl/2xl` | README "breakpoints `--bp-sm … --bp-2xl`" — 미디어쿼리는 var()를 해석하지 못해 CSS 소비 0이 구조적 정상(JS/문서 참조용) |
| Spacing | `--space-0/13/15/16` | README "`--space-0 … --space-16`" 램프 완결 |
| Leading/Tracking | `--leading-none/loose` · `--tracking-tighter/tight` | README "`--leading-none … --loose`", "`--tracking-tighter … --widest`" |
| 기타 스케일 | `--radius-none` · `--border-width-2` · `--duration-slower` · `--z-base/raised` | radius/border/duration/z 스케일 완결 (README "`--z-base … --z-max`") |
| 색 램프 | `--burgundy-50` · `--forest-200` | 50–900 램프 완결 (Foundation A행 "ramps 50–900" 계약) |
| 스와치 | `--parchment` · `--charcoal` | README "Convenience swatches" 5종 세트 유지 (`--oxblood`/`--brass`/`--ink`는 소비 중) |

### Known limitations / honest notes
- Fonts load from Google Fonts via `@import` in `base.css`; **offline**, the
  stacks fall back to high-quality system serifs (Palatino/Georgia/Times) and
  the blackletter falls back to "Old English Text MT"/serif — layout & meaning
  are unaffected, only the display flavour.
- `backdrop-filter` (navbar/overlay blur) degrades gracefully where unsupported.
- DatePicker is presented as a styled trigger + Calendar component; full
  popover date-selection logic is illustrative, not a full calendar engine.
- Charts on the dashboard are hand-authored inline SVG (static illustrative
  data), not a live charting library.
