# Gradient Mesh Modern — Theme 26

A production-grade, token-driven design system with **animated mesh / aurora backgrounds**, soft-vivid gradients, a full component library, and nine real demo screens. Pure CSS + vanilla JS — **no frameworks, no build step**. Every file opens straight from `file://` (double-click).

---

## 1. Design philosophy

> Soft, modern, alive. The feel of a 2026 SaaS / AI-startup landing page — but as a complete system.

| Principle | How it shows up |
|---|---|
| **Mesh, not flat** | The background is a slow-drifting field of four colour blobs + an aurora wash. Ambient, never distracting. Matte — not glassy. |
| **Gradient as signal** | Gradients are reserved for *action* and *emphasis*: primary buttons, active states, one or two stat icons, chart fills, large headlines. Surfaces stay near-solid. |
| **Soft depth** | Generous rounding (12–24px), diffuse low-contrast shadows, hairline borders. Cards float gently; hover lifts and blooms. |
| **Calm motion** | Long, eased transitions (`--ease-emphasized`, 260–480ms). Page-load stagger. The whole mesh freezes under `prefers-reduced-motion`. |
| **Accessible by default** | 4.5:1 text contrast, gradient text limited to large headings, clear gradient focus rings, status conveyed by colour **and** icon. |

**Palette:** purple `#7C5CFF` · blue `#3B82F6` · pink `#EC4899` · teal `#14B8A6` · indigo `#6366F1`, on a cool indigo-tinted neutral ramp. Light = bright mesh + white matte cards. Dark = deep-navy mesh + dark matte cards.

**Typography:** Plus Jakarta Sans (display + body, geometric sans) with JetBrains Mono for code. Loaded from Google Fonts with a system-sans fallback so it still renders offline.

---

## 2. File structure

```
theme-26-gradient-mesh-modern/
├── tokens.css            Raw tokens: colour ramps, mesh/aurora, spacing, type, radius, shadow, motion, z, breakpoints
├── semantic.css          Semantic + component tokens; light & dark themes (references tokens.css)
├── base.css              Reset, typography, the animated mesh background, layout utilities, reduced-motion
├── components/
│   ├── index.css         @imports all component files (link this one)
│   ├── buttons.css       Button (5 variants × 3 sizes × states), ButtonGroup, FAB
│   ├── forms.css         Input, Textarea, Select, Combobox, MultiSelect, Checkbox, Radio, Switch,
│   │                     SegmentedControl, Slider, Stepper, Rating, ChipInput, FileUpload, SearchBar
│   ├── display.css       Card, StatCard, Badge/Tag, Avatar(+Group), List, Timeline, KanbanCard,
│   │                     CodeBlock, Skeleton, EmptyState
│   ├── navigation.css    Navbar, Sidebar(collapsible), Breadcrumb, Pagination, Menu/Dropdown,
│   │                     ContextMenu, Steps/Wizard
│   ├── feedback.css      Alert/Banner, Toast(stack), Modal, Drawer, CommandPalette(⌘K),
│   │                     Progress(bar+ring), Spinner, InlineNotification, Tooltip, Popover
│   └── data.css          Tabs, Accordion, Table(sort/select/paginate), Carousel, Calendar, charts
├── app.js                All interactions + mesh parallax + theme/motion toggle (self-initialising)
├── index.html            Landing hub: mesh hero + token visuals + component gallery + page links
├── pages/                9 real demo screens (see §6)
├── README.md             ← you are here
└── CHECKLIST.md          Implementation + accessibility self-audit
```

**Load order** in any HTML: `tokens.css → semantic.css → base.css → components/index.css`, then `app.js` before `</body>`.

---

## 3. Token reference

### Colour ramps (tokens.css)
`--purple-50…900`, `--blue-50…900`, `--pink-50…900`, `--teal-50…900`, `--indigo-50…900`, `--neutral-0…950`.

### Mesh / gradient tokens
| Token | Purpose |
|---|---|
| `--mesh-blob-1…5` | The five colour blobs (rgba) that compose the background field |
| `--mesh-pos-1…5` | Blob positions (animated by `app.js` pointer parallax) |
| `--aurora` | Conic-gradient aurora wash layer |
| `--gradient-primary` / `-hover` | Action gradient — **white-text safe** (deep stops) |
| `--gradient-vivid` | Decorative display gradient — **large headings only** |
| `--gradient-accent` | Teal→blue (charts, secondary) |
| `--gradient-warm` | Pink→purple (badges, energy) |
| `--glow-gradient`, `--glow-soft`, `--glow-teal` | Coloured bloom shadows |

### Scales
- **Spacing:** `--space-0 … --space-16` (4px base)
- **Type:** `--text-2xs … --text-7xl`, `--leading-*`, `--tracking-*`, `--weight-*`
- **Radius:** `--radius-xs/sm/md/lg/xl/full` (md ≈ 14px, lg ≈ 22px)
- **Border:** `--border-1/2/thick`
- **Shadow:** `--shadow-xs/sm/md/lg/xl` (soft) + glows
- **Motion:** `--ease-standard/emphasized/out/in-out/spring`, `--duration-fast/base/slow/mesh/aurora`
- **Ring:** `--ring`, `--ring-color`, `--ring-width`
- **Z-index:** `--z-base … --z-cmdk`
- **Breakpoints:** `--bp-sm 480 / md 768 / lg 1024 / xl 1280 / 2xl 1536`

### Semantic tokens (semantic.css)
`--color-bg` (the mesh), `--color-surface`/`-2`/`-3`/`-solid`, `--color-text`/`-muted`/`-subtle`, `--color-primary` (gradient) / `-fg` / `-weak`, `--color-accent`, `--color-border`(`-strong`/`-weak`), `--color-success`/`warning`/`danger`/`info` (+ `-weak`/`-fg`), `--color-scrim`, chart palette `--chart-1…5`.

### Component tokens
`--btn-*`, `--card-*`, `--input-*`, `--modal-*`, `--drawer-w`, `--toast-*`, `--table-*`, `--nav-*`, `--track-*`, `--switch-*` — all derived from the semantic layer, so re-theming happens in **one place**.

---

## 4. Components

**Forms:** Button (primary/secondary/ghost/danger/outline/icon × sm/md/lg × hover/active/disabled/loading), ButtonGroup, Input, Textarea, Select, MultiSelect, Combobox/Autocomplete, Checkbox, Radio, Toggle/Switch, SegmentedControl, Slider, Stepper, DatePicker field, FileUpload, SearchBar, Rating, ChipInput.

**Display:** Card (soft / hover / glow / gradient-edge), StatCard, Badge/Tag (gradient variants), Avatar/AvatarGroup (+ status dot), Tooltip, Popover, Accordion, Tabs (underline + pills), Table (sort · select · paginate), List, Timeline, KanbanCard, CodeBlock, Skeleton, EmptyState, Carousel, Calendar.

**Feedback / overlay:** Alert/Banner, Toast (stacking, auto-dismiss, progress bar), Modal/Dialog, Drawer, CommandPalette (⌘K), Progress (bar + circular gradient ring), Spinner, InlineNotification.

**Navigation:** Navbar, Sidebar (collapsible), Breadcrumb, Pagination, Menu/Dropdown, ContextMenu, Steps/Wizard.

Every interactive component ships with keyboard support and ARIA roles/attributes (see CHECKLIST.md).

### JS hooks (app.js)
Markup-driven — add an attribute, `app.js` does the rest:

| Attribute | Effect |
|---|---|
| `data-theme-toggle` | Toggle light/dark (persisted in `localStorage`) |
| `data-motion-toggle` | Freeze / resume the ambient mesh |
| `data-tabs` | Tab group (with arrow-key roving focus) |
| `data-accordion` (`data-accordion-single`) | Accordion |
| `data-dropdown` + `data-dropdown-trigger` | Dropdown menu |
| `data-open="#id"` / `data-close` | Open / close a modal or drawer (focus-trapped) |
| `data-toast` (`-title`, `-type`) | Fire a toast on click — or `GMM.toast({...})` |
| `data-cmdk` | Open the command palette (also ⌘K / Ctrl-K) |
| `data-sortable` + `data-select-all` | Sortable / selectable table |
| `data-carousel` | Carousel with prev/next + dots |
| `data-context-menu="#id"` | Right-click context menu |
| `data-popover` + `data-popover-trigger` | Popover |
| `data-countup="123"` | Animate a number into view |
| `data-reveal` | Fade/slide in on scroll |
| `data-copy` | Copy to clipboard |

Public API: `window.GMM = { init, toast, Theme, Motion, CommandPalette, openOverlay, closeOverlay }`. Call `GMM.init(rootEl)` after injecting markup dynamically.

---

## 5. Theming & how to re-skin

1. **Change the brand colour:** edit the `--purple-*` ramp + `--gradient-primary` in `tokens.css`. Everything (buttons, focus rings, active states, mesh blob 1) follows.
2. **Change the mesh mood:** edit `--mesh-blob-1…5` (colours/alpha) and `--mesh-pos-*` in `tokens.css`, and the `--color-bg` radial layout in `semantic.css`.
3. **Light/dark:** values live under `:root,[data-theme="light"]` and `[data-theme="dark"]` in `semantic.css`. Add a third theme by copying that block with a new `[data-theme="…"]` and pointing the toggle at it.
4. **Component look:** adjust the `--btn-*` / `--card-*` / `--input-*` component tokens — never hard-code colours in component CSS.
5. **Density / shape:** retune `--space-*` and `--radius-*`.

Because components only read semantic + component tokens (never raw ramps), a full re-skin is a handful of variable edits — no component file needs touching.

---

## 6. Demo pages (`pages/`)

| # | File | What it shows |
|---|---|---|
| 1 | `dashboard.html` | Analytics: KPI stat cards, gradient SVG area chart, donut, bar chart, sortable/selectable transactions table |
| 2 | `kanban.html` | Four-column board, draggable cards, priority accents, new-task modal |
| 3 | `inbox.html` | 3-pane email: folders · message list (pill-tab filters) · reading pane + compose drawer |
| 4 | `product.html` | E-commerce detail: gallery + swatches, variants, qty, tabs (desc/specs/reviews), related carousel |
| 5 | `pricing.html` | Three plans, monthly/annual toggle (live price swap), comparison table, FAQ accordion, CTA band |
| 6 | `settings.html` | Tabs (Profile/Account/Notifications/Billing/Danger), switches, sessions list, delete-confirm modal |
| 7 | `onboarding.html` | Four-step wizard with the Steps component and live progress |
| 8 | `profile.html` | Cover, avatar, stats, skills, activity timeline, projects grid, achievements |
| 9 | `404.html` | 404 with gradient code + a trio of empty-state cards |

Start at **`index.html`** — the hub links to all of them.

---

## 7. Running it

Just open `index.html` in any modern browser (double-click / `file://`). No server, no install. Fonts load from Google Fonts when online and gracefully fall back to system sans offline.
