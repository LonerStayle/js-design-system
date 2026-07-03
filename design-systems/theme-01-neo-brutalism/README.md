# THEME-01 · NEO-BRUTALISM

A production-scale, framework-free design system built on **pure CSS custom properties + vanilla JS**.
Raw, bold, structure-exposed. Flat color planes, thick black borders, near-zero corners, and the
signature **hard offset shadow** that physically "presses" on click. Double-click any `.html` and it runs — no build, no dependencies.

```
┌─────────────────────────────────────────────┐
│  NEO-BRUTALISM            ▓▓ ⌘K   ◐ THEME    │
│                                              │
│   ███  BUILD LOUD.        [ GET STARTED → ]  │
│   ███  SHIP RAW.            ⌐ 6px 6px 0 #111 │
└─────────────────────────────────────────────┘
```

---

## 1 · Design philosophy

| Principle | How it shows up |
|-----------|-----------------|
| **Raw & honest** | No gradients, no blur, no soft shadows. Every edge is declared with a thick `#111` border. |
| **Flat color planes** | 4 solid accents (blue / pink / lime / yellow) are applied as whole surfaces, never blended. |
| **Hard offset shadow** | `6px 6px 0 #111` (blur **0**). On hover the offset grows; on `:active` the element translates into its shadow and the shadow collapses → a tactile *press*. |
| **Loud type** | Display grotesque (Space Grotesk / Archivo) at weight 700–900 with slightly wide tracking; mono (JetBrains Mono) for labels/meta in UPPERCASE. |
| **Stickers & structure** | ±2° rotated sticker badges, bold underlines, exposed grids, mono kicker labels. |
| **Accent focus rings** | Focus = a 4px solid accent outline. Always visible, never subtle. |

---

## 2 · File structure

```
theme-01-neo-brutalism/
├── tokens.css        # primitive tokens — color ramps + every scale
├── semantic.css      # semantic + component tokens; light & dark themes
├── base.css          # reset, typography, layout + signature utilities, focus, reduced-motion
├── styles.css        # SINGLE entry point — @imports tokens→semantic→base→components/*
├── components/        # one file per component / category
│   ├── button.css  form.css  card.css  badge.css
│   ├── tabs.css  navbar.css  sidebar.css  breadcrumb.css  pagination.css  menu.css  steps.css
│   ├── modal.css  drawer.css  command.css  popover.css  tooltip.css
│   ├── toast.css  alert.css  progress.css  spinner.css  skeleton.css  empty.css
│   └── table.css  list.css  timeline.css  accordion.css  code.css  kanban.css  carousel.css  calendar.css
├── app.js            # all interactions (modal/tabs/toast/command palette/theme/…)
├── index.html        # landing + token visuals + component gallery hub
├── pages/            # 9 real assembled demo screens
├── README.md
└── CHECKLIST.md
```

**Using it in a page** — link one stylesheet + one script:

```html
<link rel="stylesheet" href="styles.css">      <!-- from theme root -->
<link rel="stylesheet" href="../styles.css">    <!-- from pages/ -->
…
<script src="app.js"></script>                  <!-- or ../app.js -->
```

`@import` paths inside `styles.css` resolve relative to that file, so the same bundle works from any depth.

---

## 3 · Token reference

### Color ramps (`tokens.css`) — 11 steps, canonical accent at `500`

| Ramp | 500 (canonical) | Notes |
|------|-----------------|-------|
| `--blue-50 … --blue-950`   | `#2D5BFF` | Electric blue — primary intent |
| `--pink-50 … --pink-950`   | `#FF3D8B` | Hot pink — secondary accent / danger |
| `--lime-50 … --lime-950`   | `#B6FF3D` | Lime — success |
| `--yellow-50 … --yellow-950`| `#FFE000` | Yellow — warning / highlight |
| `--neutral-0 … --neutral-950`| `#6E6E6E` | `--neutral-0` = `#FFFFFF`, `--neutral-900` = `#111111` |
| `--ink` / `--paper` | `#111111` / `#FFFFFF` | the core brutalist contract |

### Spacing — 4px base
`--space-0`(0) `--space-1`(4px) `--space-2`(8) `--space-3`(12) `--space-4`(16) `--space-5`(20) `--space-6`(24) … `--space-16`(64) plus `-20/-24/-32`.

### Type scale
`--text-2xs`(10px) `--text-xs`(12) `--text-sm`(14) `--text-base`(16) `--text-lg`(18) `--text-xl`(20) `--text-2xl`(24) `--text-3xl`(30) `--text-4xl`(36) `--text-5xl`(48) `--text-6xl`(64) `--text-7xl`(80).
Line height `--leading-none/tight/snug/normal/relaxed`; tracking `--tracking-tighter…widest`; weights `--weight-regular…black` (400–900).

### Borders & radii
Widths `--border-1…6` (1–6px). Radii `--radius-sm`(0) `--radius-md`(2px) `--radius-lg`(4px) `--radius-full`(9999px).

### Hard shadows (blur always 0)
`--shadow-xs`(2px) `--shadow-sm`(3px) `--shadow-md`(6px) `--shadow-lg`(10px) `--shadow-xl`(14px), plus `--shadow-press` / `--shadow-hover`. Color = `--shadow-color` (ink in light, white in dark).

### System scales
z-index `--z-base…--z-max` (dropdown/overlay/drawer/modal/popover/toast/tooltip). Breakpoints `--bp-sm/md/lg/xl` (640/768/1024/1280). Rings `--ring-width`(4px) `--ring-blue/pink/lime/yellow`. Motion `--ease-standard/emphasized/snap`, `--duration-fast/base/slow` (80/140/240ms).

### Semantic tokens (`semantic.css`)
`--color-bg`, `--color-surface`, `--color-surface-2/3`, `--color-inset`, `--color-text`, `--color-text-muted/subtle/invert`, `--color-border`, `--color-border-subtle`, `--color-primary(+-hover/-active/-fg/-subtle)`, `--color-accent`, `--color-success / -warning / -danger / -info` (each with `-fg` and `-subtle`), `--color-disabled-*`, `--color-ring`, `--color-scrim`.
Component tokens: `--btn-*`, `--card-*`, `--input-*`, `--badge-*`, `--modal-*`, `--toast-*`, `--table-*`, `--tooltip-*`, `--surface-*`, `--tilt-cw/ccw`.

---

## 4 · Light & dark

Theme is driven by `data-theme="light|dark"` on `<html>`. `app.js` sets it from `localStorage` → system preference, and any `[data-theme-toggle]` button flips + persists it.
Dark **inverts the contract**: dark surfaces, **white** borders, white hard shadows. Because every component reads semantic tokens, the inversion is automatic. Font size uses `rem`, so OS/browser zoom scales the whole system (user-scalable).

---

## 5 · Component catalogue

**Forms** — Button (primary/secondary/accent/ghost/danger/success/icon × sm/md/lg × hover/active/disabled/loading), ButtonGroup, Input, Textarea, Select, Input group, SearchBar, Checkbox, Radio, Toggle/Switch, SegmentedControl, Slider, Stepper, FileUpload (dropzone), Rating, ChipInput/TagInput, Combobox/MultiSelect (JS).

**Display** — Card, StatCard, Badge/Tag, Sticker, Avatar/AvatarGroup, Tooltip, Popover, Accordion, Tabs, Table (sort · select · pagination), List, Description list, Timeline, KanbanCard, CodeBlock, Skeleton, EmptyState, Carousel, Calendar/DatePicker.

**Feedback / overlay** — Alert/Banner, InlineNotification, Toast (stacking), Modal/Dialog, Drawer, CommandPalette (⌘K), Progress (bar + circular), Spinner.

**Navigation** — Navbar, Sidebar (collapsible), Breadcrumb, Pagination, Menu/Dropdown, ContextMenu, Steps/Wizard.

Every interactive component ships keyboard support + ARIA roles/states.

---

## 6 · JavaScript API (`app.js`)

Zero-dependency, auto-initialises on `DOMContentLoaded`, uses event delegation. Drive everything with data-attributes:

| Feature | Hook |
|---|---|
| Theme toggle | `[data-theme-toggle]` |
| Tabs | `[data-tabs]` › `[role=tab][data-tab=ID]` + `[data-tab-panel=ID]` |
| Accordion | `[data-accordion]` › `[data-accordion-trigger]` + `[data-accordion-panel]` |
| Modal | open `[data-modal-open=ID]` · panel `[data-modal=ID]` · `[data-modal-close]` |
| Drawer | open `[data-drawer-open=ID]` · `[data-drawer=ID data-side=left\|right]` · `[data-drawer-close]` |
| Toast | `[data-toast data-title data-message data-variant]` or `NB.toast({title,message,variant})` |
| Dropdown | `[data-dropdown]` › `[data-dropdown-trigger]` + `[data-dropdown-menu]` |
| Context menu | target `[data-context-target=ID]` + `[data-context-menu=ID]` |
| Command palette | `⌘K` / `Ctrl-K` / `[data-command-open]` · `[data-command-item]` |
| Popover | `[data-popover-trigger=ID]` + `[data-popover=ID]` |
| Stepper | `[data-stepper]` › `[data-step=-1\|1]` |
| Slider | `input[type=range][data-slider]` → `[data-slider-output]` |
| Rating | `[data-rating data-value=N]` |
| Chip input | `[data-chip-input]` |
| File drop | `[data-file-drop]` |
| Table | `th[data-sort]` · `[data-select-all]` · `.row-check` |
| Kanban | `[data-kanban-col]` · `.kanban-card[draggable=true]` |
| Carousel | `[data-carousel]` › track + prev/next + dots |
| Sidebar | `[data-sidebar-toggle]` → `[data-sidebar]` |
| Combobox | `[data-combobox]` (`data-multi` for chips) |
| Wizard | `[data-wizard]` › steps + dots + next/prev/goto + progress |
| Copy / Password / Count-up | `[data-copy]` · `[data-toggle-password]` · `[data-countup data-to=N]` |

Public API: `window.NB.toast(opts)`, `NB.openOverlay(el)`, `NB.closeOverlay(el)`.

---

## 7 · Re-skinning guide (교체 가이드)

The system is built so a full re-theme touches **only two files**:

1. **`tokens.css`** — change the *values* of the ramps and scales. Keep the **names** identical (`--blue-500`, `--space-4`, `--text-3xl`, `--shadow-md` …). e.g. to soften the look, raise `--radius-md` and reduce `--border-3`; to change palette, swap the ramp hexes.
2. **`semantic.css`** — re-point semantic tokens at the new primitives (e.g. `--color-primary: var(--blue-500)` → another ramp), and tweak the per-component tokens (`--btn-*`, `--card-*`, …).

Because **components never hardcode raw values** (they consume semantic/component tokens), nothing in `components/*` needs editing for a re-skin. To kill the brutalist signature entirely, set `--shadow-md`/`--shadow-lg` to `none`, raise `--radius-md`, and drop border widths — the same markup becomes a soft, neutral system.

To add a component: create `components/x.css`, consume existing tokens, add one `@import` line to `styles.css`, and (if interactive) follow the data-attribute conventions so `app.js` picks it up.

---

## 8 · Quality & accessibility

- Contrast ≥ 4.5:1 for text on every accent plane (ink on lime/yellow, paper on blue/pink).
- Every interactive element has a visible 4px accent focus ring.
- `prefers-reduced-motion: reduce` neutralises all transitions/animations.
- Landmarks, ARIA roles/states, keyboard operation (arrow-key tabs, focus-trapped modals, ⌘K palette, Esc to close).
- No external CSS framework. Icons are inline SVG. Runs from `file://`.

See **CHECKLIST.md** for the full self-audit.
