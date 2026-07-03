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

- ⚠️ Google Fonts load over the network (`@import` in `base.css`). Offline, the stack falls back to system grotesque/mono — layout and weights still read as brutalist.
- ⚠️ DatePicker/Calendar and some "images" (product gallery) are visual/static demos (solid color blocks, no backend).
- ➖ No build step, bundler, or package manager by design — this is a zero-dependency, copy-the-folder system.
