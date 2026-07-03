# CHECKLIST — Organic Warm Earth (Theme № 29)

Self-audit of implementation completeness, accessibility, and quality.
Legend: ✅ done · ➖ n/a.

---

## 1. Architecture & scope

- ✅ All output confined to `design-systems/theme-29-organic-warm-earth/`.
- ✅ No other `theme-*` folder read or written; no shared files touched.
- ✅ Folder structure matches spec (tokens/semantic/base/components/app.js/index/pages/README/CHECKLIST).
- ✅ Layered token architecture: `tokens.css` (raw) → `semantic.css` (meaning + component tokens) → `base.css` → `components/*`.
- ✅ Zero external CSS/JS frameworks. Only external resource = Google Fonts `<link>` (graceful system-font fallback offline).
- ✅ Pure CSS + inline-SVG icons. Textures are CSS/SVG noise (data-URI), no image files.
- ✅ Every page opens & works via double-click (`file://`) — all asset paths relative.

## 2. Tokens (raw — tokens.css)

- ✅ Colour ramps 50–900: terracotta, sand, clay/ochre, neutral(cream→espresso), olive, plus brick (danger) & teal (info).
- ✅ DNA key values present: terracotta `#C66B47`, sand `#E4CBA6`, clay `#B98A5E`, cream `#F3E9D9`.
- ✅ Organic tokens: `--blob-radius-1..4`, `--pebble(-sm)`, `--clay-texture`, `--sand-texture`, `--plaster-texture`, `--wave-divider`.
- ✅ Spacing `--space-0..16`; type `--text-2xs..6xl` + `--leading-*` (loose) + `--tracking-*`.
- ✅ Radii `--radius-sm/md/lg/full` (+ xs/xl/2xl) + `--blob-*`; border `--border-1` (+2/3).
- ✅ Warm-soft shadows `--shadow-sm/md/lg` (+xs/xl/inset/glow); z-index scale; breakpoints; `--ring-*` (terracotta); motion `--ease-emphasized` + `--duration-base`.

## 3. Semantic + component tokens (semantic.css)

- ✅ `--color-bg/surface/surface-2/text/text-muted/primary/primary-fg/accent/border/success/warning/danger/info` all defined.
- ✅ Component tokens: `--btn-*`, `--card-*`, `--input-*` (+ badge/tooltip/table/nav).
- ✅ **Light** theme (cream/sand bg, espresso/brown ink).
- ✅ **Dark** theme (deep clay / espresso brown ground + terracotta point light); shadows retuned for dark.
- ✅ `prefers-color-scheme` honoured when no explicit `data-theme`.

## 4. Component coverage

**Forms** — ✅ Button (primary/secondary/ghost/danger/accent/icon × sm/md/lg × hover/active/disabled/loading), ButtonGroup, Input, Textarea, Select, MultiSelect, Combobox/Autocomplete, Checkbox, Radio, Toggle/Switch, SegmentedControl, Slider, Stepper, DatePicker (trigger+panel), FileUpload (dropzone), SearchBar, Rating, ChipInput.

**Display** — ✅ Card (+blob/clay), StatCard, Badge/Tag, Avatar/AvatarGroup (blob mask), Tooltip, Popover, Accordion, Tabs (underline+pill), Table (sort/select/paginate), List, Timeline, KanbanCard, CodeBlock, Skeleton, EmptyState, Carousel, Calendar.

**Feedback / overlay** — ✅ Alert/Banner, Toast (stacked), Modal/Dialog, Drawer, CommandPalette (⌘K), Progress (bar + circular), Spinner (ring + dots), InlineNotification.

**Navigation** — ✅ Navbar, Sidebar (collapsible), Breadcrumb, Pagination, Menu/Dropdown, ContextMenu, Steps/Wizard.

## 5. Interactivity (app.js — vanilla, delegated)

- ✅ Theme toggle w/ `localStorage` + system fallback.
- ✅ Tabs (+ arrow-key roving), Accordion (single/multi), Dropdown/Menu, Popover, Context menu.
- ✅ Modal, Drawer (L/R), Command palette (⌘K/Ctrl-K, type-filter, ↑/↓/↵ nav).
- ✅ Toasts (stack, auto-dismiss, hover-pause, manual close).
- ✅ Segmented control, button-group toggle, Slider fill+bubble, Stepper clamp.
- ✅ Rating, ChipInput (add/remove/backspace), Combo/MultiSelect (filter, chips), SearchBar clear.
- ✅ Table sort (numeric+text) + select-all/row-select, Pagination demo.
- ✅ Carousel (buttons + dots + snap), Sidebar collapse/mobile, Steps wizard.
- ✅ Copy-to-clipboard, FileUpload dropzone (drag/drop + list), Kanban drag-and-drop + live counts.
- ✅ Scroll reveal (IntersectionObserver, reduced-motion aware), pricing month/year toggle, subtle tilt.
- ✅ ESC closes top-most overlay; backdrop click closes; focus returned to opener.

## 6. Showcase pages (pages/)

- ✅ `index.html` — hub: blob/wave hero, live colour ramps, shape & texture visuals, component gallery, links to all demos, modal+drawer+cmdk.
- ✅ `dashboard.html` — stat cards, line/donut/bar CSS charts, activity timeline, sortable+selectable table, pagination.
- ✅ `kanban.html` — 5-column drag-and-drop production board, varied cards, live counts.
- ✅ `inbox.html` — 3-pane folders / list / reading view + compose modal.
- ✅ `product.html` — ceramics product detail: media+thumbs, options, stepper, accordion, related carousel, cart drawer.
- ✅ `pricing.html` — 3 plans, monthly/yearly toggle, comparison table, FAQ accordion, CTA.
- ✅ `settings.html` — tabs (profile/account/notifications/appearance/billing/danger), toggles, danger-zone confirm modal.
- ✅ `onboarding.html` — multi-step Steps wizard with rich forms + summary.
- ✅ `profile.html` — cover blob, stats, gallery/about/reviews/activity tabs, rating breakdown, timeline.
- ✅ `404.html` — gradient 404 + empty-state gallery + skeleton loading example.
- ✅ All pages responsive (mobile breakpoints) and filled with realistic "Terraforma" data (no lorem ipsum).

## 7. Accessibility

- ✅ Text/surface contrast targets WCAG AA (≥4.5:1); muted text kept on legible side; no pale-on-pale on sand.
- ✅ Status conveyed by colour **and** icon (alerts, badges, toasts, deltas).
- ✅ Always-visible terracotta `:focus-visible` ring; ring offset for clarity.
- ✅ Skip link + `id="main"` on every page.
- ✅ `prefers-reduced-motion`: transitions/animations/blob-morph/float neutralised.
- ✅ ARIA: `role`/`aria-selected`/`aria-controls` (tabs), `aria-expanded` (accordion/dropdown), `aria-modal`/`aria-hidden` (overlays), `aria-current` (breadcrumb/nav), `aria-label` on icon-only buttons, `aria-live` on toast region.
- ✅ Keyboard: tabs (arrows/home/end), command palette (↑/↓/↵/esc), all controls reachable & operable; ESC closes overlays.

## 8. Visual / DNA fidelity

- ✅ Organic blobs (asymmetric radii) on cards, avatars, icons, hero art (`blob-morph`).
- ✅ Wave dividers between major sections (recolourable via `--wave-fill`).
- ✅ Clay/sand/plaster grain textures on surfaces + page-wide sand grain overlay.
- ✅ Soft curved (pebble) buttons & inputs; hover = gentle lift, focus = terracotta ring.
- ✅ Fraunces (soft serif) display + Hanken Grotesk body hierarchy.
- ✅ Warm, grounded palette throughout; no cold/sharp/digital surfaces.

## 9. Verification performed

- ✅ Brace balance verified on all CSS files (open == close).
- ✅ `app.js` parses without syntax error (`new Function(src)`).
- ✅ All `<link href>` / `<script src>` references resolve to existing files.
- ✅ No leftover typos / TODO / placeholder tokens in CSS.
- ✅ Pages built against a frozen class/token contract (shared brief) for consistency.
- ✅ Final full sweep: every page's CSS/JS refs and structure re-checked after assembly.
- ✅ `<div>` open/close balance verified on all 10 HTML files.
- ✅ All internal page-to-page links resolve to existing files.
- ✅ **Browser render confirmed for ALL 10 HTML files** (headless Chromium):
  `index.html` (light **and** dark), `dashboard`, `kanban`, `inbox`, `product`,
  `pricing`, `settings`, `onboarding`, `profile`, `404` — every page renders with
  the full earthen palette, blob/wave atmosphere, charts, and components.
- ✅ **Bug found & fixed during visual QA:** `app.js` carousel init used the
  invalid selector `querySelectorAll("> *")`, which threw on any page containing a
  `.carousel` (only `product.html`), aborting the script before the scroll-reveal
  ran and leaving `data-reveal` content stuck at `opacity:0` (blank page). Fixed to
  `Array.from(track.children)` + a `if(!track) return;` guard. Added a global
  `error` safety-net that un-hides all `[data-reveal]` content if any future init
  throws, so a single faulty widget can never blank a page again. Re-rendered
  `product.html` → full content confirmed.

> Note: theme behaviour — pages ship with a hardcoded `data-theme` for no-FOUC,
> but `app.js` applies the saved choice (localStorage) or the OS
> `prefers-color-scheme` on load, so system preference wins until the user toggles
> (the toggle then persists). Verified working in both modes.
