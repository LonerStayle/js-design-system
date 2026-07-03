# Organic Warm Earth — Design System № 29

> Sun-dried clay, plaster and desert sand, shaped into soft blobs, sinuous waves
> and tactile grain. A warm, grounded, hand-thrown design language — never cold,
> digital, or sharp.

**Brand used in the showcase:** *Terraforma*, a fictional hand-thrown ceramics studio.

Everything here is **pure CSS + vanilla JS** — zero frameworks, zero build step.
Every `.html` file renders and is fully interactive on a plain double-click
(`file://`). The only external resource is the Google Fonts stylesheet; with no
network, the system falls back gracefully to humanist system fonts.

---

## 1. Design philosophy

| Principle | How it shows up |
|-----------|-----------------|
| **Earth, not screen** | A six-ramp palette pulled from terracotta, sand, clay, warm-brown, olive and dusty teal. Cream canvas, espresso ink. No pure white, no cool grey. |
| **Nothing was ever square** | Asymmetric `border-radius` "blob" presets read as pebbles and water droplets. Buttons & inputs use a soft *pebble* radius. Sections are split by **wave dividers**, not straight rules. |
| **Made by hand** | Subtle clay / plaster / sand **grain textures** (SVG fractal noise, inlined as data-URIs) sit under surfaces so they feel thrown, not printed. |
| **Warm hierarchy** | A soft humanist serif (**Fraunces**, low SOFT/WONK) for display, paired with a round humanist sans (**Hanken Grotesk**) for body. |
| **Calm motion** | Gentle `--ease-emphasized` overshoot, slow durations, floating blobs. All of it collapses under `prefers-reduced-motion`. |
| **Legible first** | Every text-on-surface pairing targets **WCAG AA (4.5:1)**. Status is always **colour + icon**, never colour alone. Focus rings are an always-visible terracotta. |

### Signature gestures
- **Blob cards / avatars** — `.blob-1..4`, `.pebble`, `.blob-mask`, `.blob-morph`.
- **Wave section dividers** — `.wave-divider` (mask-based, recolourable via `--wave-fill`).
- **Clay grain surfaces** — `.clay`, `.plaster`, `.has-grain`, `.clay-card`.
- **Organic curved buttons** with soft lift on hover, terracotta focus ring.

---

## 2. File structure

```
theme-29-organic-warm-earth/
├── tokens.css          Raw/primitive tokens — colour ramps, organic shapes,
│                       textures, spacing, type, radii, shadows, motion, z-index.
├── semantic.css        Semantic tokens (bg/surface/text/primary/…) + component
│                       tokens (--btn-*, --card-*, --input-*). Light + Dark.
├── base.css            Reset, typography, organic utilities (blob/wave/clay),
│                       layout primitives, a11y helpers, entrance animations.
├── components/
│   ├── buttons.css     Button (all variants/sizes/states), ButtonGroup
│   ├── forms.css       Input, Textarea, Select, Multi/Combo, Check, Radio,
│   │                   Switch, Segmented, Slider, Stepper, Search, Rating,
│   │                   ChipInput, FileUpload, DatePicker
│   ├── display.css     Card, StatCard, Badge/Tag, Avatar(Group), Tooltip,
│   │                   Popover, Accordion, Tabs, Table, List, Timeline,
│   │                   KanbanCard, CodeBlock, Skeleton, EmptyState,
│   │                   Carousel, Calendar
│   ├── feedback.css    Alert/Banner, Toast, Modal, Drawer, CommandPalette,
│   │                   Progress(bar/circular), Spinner, InlineNotification
│   ├── navigation.css  Navbar, Sidebar, Breadcrumb, Pagination, Menu/Dropdown,
│   │                   ContextMenu, Steps/Wizard
│   └── patterns.css    Composites: app-shell, hero, CSS charts, pricing,
│                       kanban columns, inbox 3-pane, token swatches, product,
│                       profile, 404.
├── app.js              All interactivity + theme switching (vanilla, delegated).
├── index.html          Landing hub: hero, token & shape visuals, component
│                       gallery, links to every demo page.
├── pages/
│   ├── dashboard.html   Analytics dashboard (stats, charts, sortable table)
│   ├── kanban.html      Drag-and-drop production board
│   ├── inbox.html       3-pane email / inbox
│   ├── product.html     Ceramics e-commerce product detail
│   ├── pricing.html     3 plans, monthly/yearly toggle, comparison, FAQ
│   ├── settings.html    Tabs + toggles + danger zone
│   ├── onboarding.html  Multi-step Steps wizard
│   ├── profile.html     Maker profile / account
│   └── 404.html         404 + empty-state & skeleton gallery
├── README.md
└── CHECKLIST.md
```

**Load order matters:** `tokens.css → semantic.css → base.css → components/*`.

---

## 3. Token reference

### 3.1 Colour ramps (raw — `tokens.css`)
Each ramp runs `50` (lightest) → `900` (deepest).

| Ramp | Token prefix | Key value | Role |
|------|--------------|-----------|------|
| Terracotta | `--terracotta-50..900` | `500 = #C66B47` | Primary / brand |
| Sand | `--sand-50..900` | `300 = #E4CBA6` | Warm dunes, borders |
| Clay / Ochre | `--clay-50..900` | `500 = #B98A5E` | Accent, warning |
| Neutral (cream→espresso) | `--neutral-50..900` | `100 = #F3E9D9` (cream) | Bg, surface, text |
| Olive | `--olive-50..900` | `500` | Success / secondary accent |
| Brick | `--brick-50..900` | `600` | Danger |
| Teal (dusty) | `--teal-50..900` | `600` | Info |
| Cream alias | `--cream` | `#F3E9D9` | — |

### 3.2 Organic tokens
| Token | Purpose |
|-------|---------|
| `--blob-radius-1..4` | Asymmetric `border-radius` presets (pebble/droplet) |
| `--pebble`, `--pebble-sm` | Softer near-symmetric squircle for buttons/inputs |
| `--clay-texture`, `--sand-texture`, `--plaster-texture` | SVG noise grain (data-URI) |
| `--wave-divider` | Sinuous edge mask for `.wave-divider` |
| `--texture-opacity`, `--texture-blend` | Grain strength / blend mode (theme-aware) |

### 3.3 Semantic tokens (`semantic.css`) — light & dark
`--color-bg`, `--color-bg-tint`, `--color-surface`, `--color-surface-2`,
`--color-surface-sunk`, `--color-overlay`,
`--color-text`, `--color-text-soft`, `--color-text-muted`, `--color-text-subtle`,
`--color-primary` (+ `-hover/-active/-strong/-soft/-fg`),
`--color-accent` (+ `-strong/-soft`), `--color-accent-2`,
`--color-border` (+ `-soft/-strong`), `--color-divider`,
`--color-success` / `--color-warning` / `--color-danger` / `--color-info`
(each with `-soft` and `-fg`), `--chart-1..6`.

### 3.4 Scales
- **Spacing:** `--space-0 … --space-16` (4px → 192px).
- **Type:** `--text-2xs … --text-6xl`; `--leading-none…loose`; `--tracking-tighter…widest`.
- **Radius:** `--radius-xs/sm/md/lg/xl/2xl/full` + `--blob-1..4`.
- **Border:** `--border-1/2/3`.
- **Shadow:** `--shadow-xs/sm/md/lg/xl` (warm-tinted), `--shadow-inset`, `--shadow-glow`.
- **Motion:** `--ease-standard/emphasized/out-soft/in-soft`; `--duration-fast/base/slow/slower`.
- **Z-index:** `--z-base … --z-tooltip … --z-command`.
- **Rings:** `--ring-width/offset/color` (terracotta).

### 3.5 Component tokens
`--btn-*` (radius, padding per size, variant bg/fg), `--card-*` (bg, border,
radius, pad, shadow + hover), `--input-*` (bg, border, focus, radius, height),
`--badge-*`, `--tooltip-*`, `--table-*`, `--nav-*`.

---

## 4. Component catalogue

**Forms** — Button (primary/secondary/ghost/danger/accent/icon × sm/md/lg ×
hover/active/disabled/loading), ButtonGroup, Input, Textarea, Select,
MultiSelect, Combobox/Autocomplete, Checkbox, Radio, Toggle/Switch,
SegmentedControl, Slider, Stepper, DatePicker (trigger), FileUpload (dropzone),
SearchBar, Rating, ChipInput.

**Display** — Card (blob/clay variants), StatCard, Badge/Tag, Avatar &
AvatarGroup (blob mask), Tooltip, Popover, Accordion, Tabs (underline + pill),
Table (sort · select · paginate), List, Timeline, KanbanCard, CodeBlock (copy),
Skeleton, EmptyState, Carousel, Calendar.

**Feedback / overlay** — Alert/Banner, Toast (stacked, auto-dismiss),
Modal/Dialog, Drawer, CommandPalette (⌘K), Progress (bar + circular), Spinner
(ring + dots), InlineNotification.

**Navigation** — Navbar, Sidebar (collapsible), Breadcrumb, Pagination,
Menu/Dropdown, ContextMenu, Steps/Wizard.

Each interactive component ships keyboard support and ARIA roles/states (see
`CHECKLIST.md` for the per-component audit).

---

## 5. Interactivity — the `data-*` API

`app.js` auto-wires everything via delegation. You add attributes; no glue code.

| Behaviour | Markup |
|-----------|--------|
| Dark mode | `<button data-theme-toggle aria-label="Toggle theme">` (persists to `localStorage`, falls back to OS) |
| Tabs | container `data-tabs`; `role="tab" aria-controls aria-selected`; panels `role="tabpanel" hidden` |
| Accordion | `data-accordion` (+ `data-single`); `.accordion-trigger[aria-expanded]` |
| Modal | open `data-open="#id"`, close `data-close`; `<div class="overlay" id="id">` |
| Drawer | open `data-drawer="#id"`, close `data-drawer-close` |
| Command palette | `data-cmdk-open` **or** ⌘K / Ctrl-K |
| Toast | `data-toast="Title" data-toast-msg="…" data-toast-type="success"` |
| Dropdown / Popover | `.dropdown`+`data-dropdown` / `.popover`+`data-popover` |
| Context menu | `data-context-menu="#menuId"` + a `.context-menu#menuId` |
| Sidebar collapse | `data-sidebar-toggle="#sidebar"` |
| Slider fill | `.slider` (+ sibling `[data-slider-out]`, `data-prefix/suffix`) |
| Stepper | `.stepper` + buttons `data-step="-"` / `data-step="+"` |
| Rating | `.rating[data-interactive]` with `.star` children |
| Chip input | `.chip-input` with an `<input>` |
| Combo/Multiselect | `.combo` (+ `data-multi`) |
| Table | `table[data-sortable]`, `th.sortable`, `[data-select-all]`, `[data-row-select]`, numeric `data-sort="123"` |
| Pagination | `.pagination[data-demo]` with `button[data-page]` |
| Carousel | `.carousel` > `.carousel-track` + `.carousel-btn.prev/.next` + `.carousel-dots>button` |
| Wizard | `[data-wizard]` with `.step`s, `[data-wizard-panel]`, `[data-wizard-back/next/done]` |
| Pricing toggle | `.switch[data-price-toggle]`; `[data-price-month]` / `[data-price-year]` |
| Copy | `data-copy="self"` inside a `.codeblock` |
| Scroll reveal | `data-reveal` (optional `data-reveal="120"` ms delay) |
| Kanban DnD | `.kanban-card` (auto-draggable) inside `.kanban-col > .col-body` (auto-recount via `[data-col-count]`) |

`window.oweToast({title, msg, type, duration})` is exposed for programmatic toasts.

---

## 6. Light & dark

Set the theme on the root element:

```html
<html data-theme="light">   <!-- or "dark" -->
```

- **Light** — cream canvas, espresso ink, terracotta primary, multiply grain.
- **Dark** — espresso/deep-clay ground, warm parchment text, brighter terracotta
  point light, soft-light grain, deeper shadows.
- With **no** `data-theme` attribute the system honours `prefers-color-scheme`.
- The toggle button persists the choice to `localStorage["owe-theme"]`.

---

## 7. How to reskin / swap the theme

The system is layered so you can re-theme without touching components.

1. **Re-hue everything** → edit the ramps in `tokens.css`. Keep the token
   *names*; change only the *values*. Every component re-colours automatically.
2. **Re-map meaning** → edit `semantic.css` (e.g. point `--color-primary` at a
   different ramp, or change which ramp means "success").
3. **Change the shapes** → edit `--blob-radius-*` / `--pebble` for a different
   organic feel, or set them to `--radius-md` for a flatter, squarer system.
4. **Dial the texture** → change `--texture-opacity` / `--texture-blend`, or
   swap the `*-texture` data-URIs. Set opacity to `0` for a flat look.
5. **Swap the type** → change `--font-display` / `--font-body` (and the matching
   `<link>` in each HTML head). `--fraunces-soft` controls Fraunces' softness.
6. **Retune motion** → `--duration-*` and `--ease-*`. (`prefers-reduced-motion`
   already neutralises animation for users who ask.)

Because components only ever read tokens, a full rebrand is a `tokens.css` +
`semantic.css` edit — no HTML or component-CSS changes required.

---

## 8. Accessibility summary

- Text/background pairings meet **WCAG AA (≥ 4.5:1)**; muted text stays on the
  legible side of the ramp (no pale-on-pale).
- Status uses **colour + icon** together.
- Always-visible **terracotta focus ring** (`:focus-visible`), plus a
  **skip link** on every page.
- `prefers-reduced-motion` removes transitions, blob morphing and float loops.
- Icon-only controls carry `aria-label`; disclosure/overlay widgets carry the
  appropriate `role` / `aria-*` state.

See `CHECKLIST.md` for the full self-audit.

---

## 9. Browser support

Modern evergreen browsers. Uses CSS custom properties, `color-mix()`,
`backdrop-filter`, CSS masks, `:focus-visible`, and `IntersectionObserver`
(reveal degrades to "always visible" if unavailable). No polyfills, no build.
```
Just open index.html.
```
