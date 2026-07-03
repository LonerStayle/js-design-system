# Memphis 80s — Design System (Theme 10)

> Loud. Flat. Fearless. An anarchic postmodern toolkit where **pattern is the protagonist** —
> clashing primaries, scattered geometry, and thick black ink. Pure CSS + vanilla JS, zero frameworks,
> renders by double-clicking any `.html` (`file://`).

![themes: light + dark](https://img.shields.io/badge/themes-light%20%2B%20dark-FF2E93) ![a11y: WCAG AA](https://img.shields.io/badge/a11y-WCAG%20AA-2D5BFF) ![deps: none](https://img.shields.io/badge/dependencies-0-00C2A8)

---

## 1. Design philosophy

The Memphis Group (Milan, 1981) rebelled against "good taste" — they made furniture that clashed on
purpose, drowned in squiggles and terrazzo, and treated decoration as the whole point. This system
ports that energy to the screen:

| Principle | How it shows up |
|---|---|
| **Pattern is the protagonist** | Squiggle, dots, zigzag, stripes, terrazzo + a confetti shape set scattered across backgrounds, blocks and dividers. |
| **Clashing flat primaries** | Hot pink `#FF2E93`, electric blue `#2D5BFF`, acid yellow `#FFD400`, teal `#00C2A8`, coral, black, cream — placed adjacent so they fight. **No gradients.** |
| **Thick black ink** | 2–4px black borders everywhere; flat *offset* shadows in clashing colors instead of soft blur. |
| **Medium round, flat** | `--radius-md` 8px. Shapes poke out of card corners. |
| **Bold geometric type** | Space Grotesk (display) + Poppins (body). Headlines large, colorful, sometimes rotated. |
| **Anarchic motion** | Hover = shapes spin/bounce. Springy `--ease-bounce`. Drifting background confetti. |

**Safety rule that never bends:** busy patterns are *decoration only*. Body text always sits on a
solid `.panel` / `.card` / fill block at **≥4.5:1 contrast**. Motion stops under
`prefers-reduced-motion`. Status is signalled by **color + icon/shape**, never color alone.

---

## 2. File structure

```
theme-10-memphis-80s/
├── tokens.css          Primitive tokens — color ramps, patterns, shapes, scales, motion
├── semantic.css        Semantic + component tokens; light & dark themes
├── base.css            Reset, typography, pattern/decoration utilities, layout, a11y
├── theme.css           ⭐ Single entry point — @imports everything below in order
├── components/
│   ├── buttons.css     Button, ButtonGroup, SegmentedControl, Stepper
│   ├── forms.css       Input, Textarea, Select, MultiSelect, Combobox, Checkbox, Radio,
│   │                   Toggle, Slider, SearchBar, Rating, ChipInput, FileUpload, DatePicker
│   ├── display.css     Card, StatCard, Badge/Tag, Avatar(Group), List, Timeline,
│   │                   KanbanCard, CodeBlock, Skeleton, EmptyState
│   ├── data.css        Table (sort/select/paginate), Tabs, Accordion, Carousel, Calendar, Pagination
│   ├── feedback.css    Alert/Banner, Toast, Progress (bar+ring), Spinner, InlineNotification
│   ├── overlay.css     Modal, Drawer, CommandPalette (⌘K), Tooltip, Popover, Menu, ContextMenu
│   └── nav.css         Navbar, Sidebar (collapsible), Breadcrumb, Steps/Wizard
├── app.js              All interactions + floating shapes + theme switch (vanilla, zero deps)
├── index.html          Hub: shape-explosion hero + token/pattern visuals + component gallery + page links
├── pages/              9 fully-assembled demo screens (see §6)
├── README.md           This file
└── CHECKLIST.md        Implementation + accessibility self-audit
```

**Load order matters:** `tokens → semantic → base → components`. Just link `theme.css` — it `@import`s
all of them in the right sequence.

```html
<!-- root pages -->
<link rel="stylesheet" href="theme.css">
<script src="app.js"></script>

<!-- pages/ subfolder -->
<link rel="stylesheet" href="../theme.css">
<script src="../app.js"></script>
```

---

## 3. Token reference

### Color ramps (`tokens.css`) — each 50→900, `500` is the signature anchor

| Ramp | Anchor (500) | Role |
|---|---|---|
| `--pink-*` | `#FF2E93` | **primary** |
| `--blue-*` | `#2D5BFF` | **accent** / info |
| `--yellow-*` | `#FFD400` | accent-2 / warning |
| `--teal-*` | `#00C2A8` | success |
| `--coral-*` | `#FF6B5C` | danger |
| `--neutral-*` | cream `#FFF8E7` → ink `#0A0A0F` | surfaces & text |

### Patterns & shapes
- **Background patterns:** `--pattern-dots`, `--pattern-stripes`, `--pattern-squiggle`, `--pattern-zigzag`, `--pattern-triangles`, `--pattern-crosses`, `--pattern-terrazzo` (+ matching `*-size`).
- **Confetti shapes:** `--shape-squiggle / -triangle / -halfcircle / -dot / -ring / -zigzag / -star / -blob / -cross`.
- Gradient-based patterns (dots/stripes) recolor via local `--pat-fg`.

### Scales
- **Spacing** `--space-0 … --space-16` (0 → 10rem).
- **Type** `--text-2xs … --text-6xl`; `--leading-*`, `--tracking-*`, `--weight-regular…black`.
- **Fonts** `--font-display` (Space Grotesk), `--font-body` (Poppins), `--font-mono` (Space Mono).
- **Radius** `--radius-sm/md/lg/xl/pill/blob`. **Borders** `--border-1…4` (themeable ink).
- **Shadows** `--shadow-flat-pink/blue/yellow/teal/coral/black` + themeable `--shadow-pop / -sm / -lg`.
- **Rings** `--ring-pink/blue/yellow/teal` (used by `--focus-ring`). **Z-index** `--z-sticky…tooltip`.
- **Motion** `--ease-bounce/emphasized/out-back`, `--duration-fast/base/slow/float`.

### Semantic tokens (`semantic.css`)
`--color-bg`, `-surface`, `-surface-2/3`, `-text`, `-text-muted`, `-text-subtle`, `-primary` (+`-hover/-active/-fg/-soft`), `-accent` (+variants), `-border`, `-divider`, plus `-success / -warning / -danger / -info` each with `-fg / -soft / -text`. Component tokens: `--btn-*`, `--card-*`, `--input-*`, `--pop-*`, `--badge-*`, `--tooltip-*`.

> **Contrast is baked into the `*-fg` tokens.** e.g. text on hot-pink is **black** (6.1:1) — white would fail at 3.5:1.

---

## 4. Component catalogue

**Forms:** Button (primary/secondary/ghost/danger/accent/yellow/teal/icon × sm/md/lg × hover-bounce/active/disabled/loading), ButtonGroup, SegmentedControl, Stepper, Input, Textarea, Select (native + custom), MultiSelect, Combobox/Autocomplete, Checkbox, Radio, Toggle, Slider, SearchBar, Rating, ChipInput, FileUpload (dropzone), DatePicker.

**Display:** Card (+ pattern/shape decoration, corner pokes, hover tilt), StatCard, Badge/Tag, Avatar + AvatarGroup, List, Timeline, KanbanCard, CodeBlock (with copy), Skeleton, EmptyState.

**Data:** Table (sortable, select-all, row select, pagination), Tabs (ARIA + arrow keys), Accordion (single/multi), Carousel (autoplay + dots), Calendar, Pagination.

**Feedback / overlays:** Alert/Banner, Toast (stacking), Modal/Dialog (focus-trapped), Drawer (left/right), CommandPalette (⌘K, filter + arrow nav), Progress (bar + circular ring), Spinner, dots-loader, InlineNotification, Tooltip, Popover, Menu/Dropdown, ContextMenu.

**Navigation:** Navbar, Sidebar (collapsible), Breadcrumb, Steps/Wizard (horizontal + vertical).

Every interactive component ships keyboard support and ARIA roles/states. See `CHECKLIST.md` for the
per-component audit.

---

## 5. Interactions (`app.js`)

Auto-initialises on load by scanning for `data-*` hooks, so the same script drives every page.

| Hook | Component |
|---|---|
| `data-theme-toggle` | Light/dark switch (persisted to `localStorage`) |
| `data-modal-open="ID"` / `data-modal-close` | Modal |
| `data-drawer-open="ID"` / `data-drawer-close` | Drawer |
| `data-toast="success\|danger\|info\|warning"` (+ `-title`/`-text`) | Toast |
| `data-cmdk-open` / `⌘K` / `Ctrl+K` | Command palette |
| `data-tabs` · `data-accordion` · `data-dropdown` · `data-popover` · `data-context-menu="ID"` | Disclosure & menus |
| `data-table` (+ `is-sortable`, `data-select-all`, `data-row-check`) · `data-pagination` | Table |
| `data-carousel` (+ `data-autoplay`) · `data-calendar` · `data-datepicker` | Data widgets |
| `data-slider` · `data-stepper` · `data-rating` · `data-chip-input` · `data-segmented` · `data-select` (+`data-multi`/`data-combobox`) · `data-dropzone` | Form widgets |
| `data-wizard` (+ `data-wizard-panel`/`-prev`/`-next`/`-finish`) | Onboarding wizard |
| `data-price-toggle` (+ `data-price` / `data-price-period` / `data-price-note`) | Pricing toggle |
| `data-sidebar-toggle="ID"` · `data-progress` / `data-progress-ring` · `data-copy` · `data-reveal` | Misc |

**Public JS API:** `window.Memphis.toast({title,text,variant,timeout})`, `.openModal/closeModal(id)`,
`.openDrawer/closeDrawer(id)`, `.setTheme('light'|'dark')`, `.toggleTheme()`, `.openCommandPalette()`.

---

## 6. Showcase pages (`pages/`)

| # | Page | What it demonstrates |
|---|---|---|
| 1 | `dashboard.html` | Sidebar app-shell, stat cards, bar chart, donut ring, sortable/selectable table, activity timeline, filter drawer |
| 2 | `kanban.html` | 4-column sprint board, 17 cards, per-card dropdown menus, "new task" modal |
| 3 | `inbox.html` | 3-pane email (folders / list / reading), compose modal, attachment chips, reply box |
| 4 | `product.html` | E-commerce PDP — gallery, variants, stepper, tabs, related grid, cart drawer |
| 5 | `pricing.html` | 3 plans, monthly/yearly toggle, comparison table, FAQ accordion, CTA band |
| 6 | `settings.html` | Tabs (Profile/Notifications/Appearance/Billing), toggles, danger zone w/ confirm modal |
| 7 | `onboarding.html` | 5-step wizard with progress bar, live theme + accent preview, celebratory finish |
| 8 | `profile.html` | Cover banner, stat strip, about/skills/links, activity/projects/reviews tabs, edit modal |
| 9 | `404.html` | Playful 404 + a gallery of 4 on-brand empty states |

All pages are responsive (breakpoints at 1024 / 768 / 640px) and filled with realistic data.

---

## 7. How to retheme / swap

Because everything flows from tokens, you reskin the whole system by editing values — not components.

1. **Recolor** — change the ramp anchors in `tokens.css` (e.g. swap `--pink-500`). Every button,
   badge, focus ring and shadow that maps to it updates automatically.
2. **Remap meaning** — in `semantic.css`, point `--color-primary`, `--color-accent`, `--color-success`,
   etc. at different ramps. (Want blue as primary? `--color-primary: var(--blue-500)` — but **re-check
   `--color-primary-fg`** so text contrast stays ≥4.5:1.)
3. **Calm it down** — reduce border widths (`--border-width-*`), soften `--radius-md`, drop the flat
   offset shadows for `--shadow-pop: none`, and remove `pat-*` classes from blocks.
4. **Swap fonts** — change `--font-display` / `--font-body` and the `@import` URL at the top of `base.css`.
5. **Add a component** — create `components/your-thing.css`, style it from tokens only, and add one
   `@import` line to `theme.css`. Wire behaviour in `app.js` behind a `data-*` hook.

**Dark mode** is driven by `data-theme="dark"` on `<html>` (toggle persists). It also follows the OS
`prefers-color-scheme` when the user hasn't chosen explicitly.

---

## 8. Browser support & constraints

- Modern evergreen browsers (CSS custom properties, `:focus-visible`, `color-mix`, `aspect-ratio`).
- **No build step, no framework, no external CSS.** Fonts load from Google Fonts over HTTPS; everything
  else (patterns, icons, shapes) is inline SVG / CSS.
- Every page works offline from `file://` by double-click (fonts fall back to system geometric sans if
  offline).
