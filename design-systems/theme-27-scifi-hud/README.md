# THEME 27 · SCI-FI HUD — `AETHER-HUD`

> A production-grade, framework-free design system for holographic ship & suit
> interfaces. Cyan glow on deep navy, beveled clip-path panels, corner brackets,
> hexagon meshes, targeting reticles, and live telemetry gauges.
> **Pure CSS + vanilla JS. Zero dependencies. Double-click any `.html` to run.**

---

## 1 · Design Philosophy

The Sci-Fi HUD aesthetic is **future · precision · holographic** — think the
heads-up display inside an Iron Man helmet or a Halo cockpit. Every decision
serves the illusion that you are reading data projected onto glass in front of you:

| Principle | How it shows up |
|-----------|-----------------|
| **Light, not paint** | Surfaces are nearly unfilled; structure is drawn with thin glow lines and corner brackets instead of solid fills. |
| **Cut, never rounded** | Corners are *notched/beveled* with `clip-path`, not radiused. Warm, soft, retro shapes are deliberately avoided. |
| **Data is the decoration** | Coordinate readouts, telemetry jitter, reticles, gauges and scanlines are the ornament — the chrome *is* the content. |
| **Cyan commands, amber cautions, red alerts** | A disciplined signal palette: electric cyan `#22E0FF` leads, amber `#FFB020` accents/warns, alert-red `#FB2D45` for danger, signal-green for "all systems go". |
| **Motion = system activity** | Scan sweeps, radar rotation and data streams imply a *live* machine — and all of it halts under `prefers-reduced-motion`. |

**Typography:** wide tech sans — `Orbitron` (display), `Rajdhani` (body), with
`Share Tech Mono` for all data/telemetry. Uppercase + wide tracking everywhere.

---

## 2 · File Structure

```
theme-27-scifi-hud/
├── tokens.css            Raw primitives: color ramps, HUD motifs, scales, keyframes
├── semantic.css          Semantic + component tokens; light & dark themes (dark = canonical)
├── base.css              Reset, tech typography, hex-grid/scanline atmosphere, brackets, layout, a11y
├── components/
│   ├── index.css         @imports all component layers (link this one file)
│   ├── buttons.css       Button (5 variants × 3 sizes × states), ButtonGroup
│   ├── forms.css         Input, Textarea, Select, Checkbox, Radio, Toggle, Segmented, Slider, Stepper, SearchBar, Rating, ChipInput, FileUpload, Combobox
│   ├── display.css       Card/Panel, StatCard/Gauge, Badge/Tag, Avatar, Tooltip, Popover, Accordion, Tabs, Table, List, Timeline, KanbanCard, CodeBlock, Skeleton, EmptyState, Carousel, Calendar
│   ├── feedback.css      Alert/Banner, Toast, Modal, Drawer, CommandPalette, Progress (bar/radial/radar), Spinner, InlineNotification
│   ├── nav.css           Navbar, Sidebar (collapsible), Breadcrumb, Pagination, Menu/Dropdown, ContextMenu, Steps/Wizard
│   └── charts.css        Glow line/area/bar charts, sparklines, readouts, meters, ticker, reticle, radar legend
├── app.js                All interactions: theme, ⌘K palette, modal/drawer/toast, tabs, table sort/select/paginate, kanban DnD, gauges, telemetry…
├── index.html            Hub: boot HUD hero + token/motif showcase + full component gallery + screen links
├── pages/
│   ├── dashboard.html    1 · Analytics dashboard (gauges, radar, glow charts, data grid)
│   ├── kanban.html       2 · Kanban mission board (drag & drop)
│   ├── inbox.html        3 · 3-pane comms console
│   ├── product.html      4 · Tech-gear e-commerce detail
│   ├── pricing.html      5 · 3-tier pricing + monthly/annual toggle
│   ├── settings.html     6 · Settings (tabs + toggles + danger zone)
│   ├── onboarding.html   7 · Boot-sequence wizard (Steps)
│   ├── profile.html      8 · Operator dossier / account
│   └── 404.html          9 · Signal-lost 404 + empty states
├── README.md
└── CHECKLIST.md
```

### How to load (every page does this)

```html
<link rel="stylesheet" href="tokens.css">
<link rel="stylesheet" href="semantic.css">
<link rel="stylesheet" href="base.css">
<link rel="stylesheet" href="components/index.css">
<!-- …content… -->
<script src="app.js"></script>
```

Order matters: **tokens → semantic → base → components**. Pages in `pages/`
use `../` prefixes. Relative `@import` paths inside `components/index.css`
resolve against the stylesheet's own location, so it works from any depth.

---

## 3 · Token Reference

### Color ramps (`tokens.css`) — 50 (light) → 900 (dark)

| Ramp | Role | Key step |
|------|------|----------|
| `--navy-50…900` | The void — bg & surfaces | `--navy-900 #060B16` bg · `--navy-800 #0A1424` surface |
| `--cyan-50…900` | **Primary** signal / glow | `--cyan-400 #22E0FF` |
| `--amber-50…900` | Accent / warning | `--amber-400 #FFB020` |
| `--alert-red-50…900` | Danger / critical | `--alert-red-400 #FB2D45` |
| `--green-50…900` | Success / "nominal" | `--green-400 #16E08C` |
| `--neutral-50…900` | Gunmetal text/chrome | `--neutral-400 #6E8099` |

### HUD motif tokens

| Token | Purpose |
|-------|---------|
| `--clip-bevel`, `--clip-bevel-4`, `--clip-tab` | Notched/beveled corner geometries (`clip-path`) |
| `--corner-bracket` via `.bracket-frame` / `.panel > .brackets` | L-shaped corner brackets |
| `--hex-grid` | Tileable cyan honeycomb background SVG |
| `--reticle` | Standalone targeting crosshair SVG |
| `--scanline` | Fine CRT horizontal-line gradient |
| `--data-stream` | Vertical moving gradient band |
| `--glow-cyan / -amber / -red / -green` | Glow color stops |
| `--gauge` | Conic-gradient gauge template (`--gauge-deg` per instance) |

### Scales

- **Spacing** `--space-0 … --space-16` (0 → 200px)
- **Type** `--text-2xs … --text-6xl` (10 → 80px) + `--leading-*` + `--tracking-*` (wide → mega)
- **Radius** `--radius-none … --radius-pill` (mostly `0`; bevels do the softening)
- **Borders** `--border-1` / `--border-2` (glow), `--border-faint`, `--border-dashed`
- **Shadows = glows** `--glow-sm/md/lg`, `--shadow-panel`, `--shadow-pop`, `--text-glow`
- **Rings** `--ring-cyan`, `--ring-amber` (focus)
- **Z-index** `--z-base … --z-tooltip`
- **Breakpoints** `--bp-sm 480 … --bp-2xl 1536`
- **Motion** `--ease-standard/out/in/snap`, `--duration-fast/base/slow/scan/radar/stream` + keyframes (`hud-scan`, `hud-stream`, `hud-radar-sweep`, `hud-pulse`, `hud-boot-flicker`, …)

### Semantic tokens (`semantic.css`)

`--color-bg` · `--color-surface(-2/-3)` · `--color-text(-strong/-muted/-faint)` ·
`--color-primary(=cyan)` · `--color-primary-fg` · `--color-accent(=amber)` ·
`--color-border(-strong/-faint)` · `--color-success` · `--color-warning(=amber)` ·
`--color-danger(=alert-red)` · `--color-info(=cyan)` — plus component tokens
`--btn-*`, `--card-*`, `--input-*`, `--table-*`, etc.

Both **dark** (canonical) and **light** (bright holographic glass + cyan lines)
themes are defined. Light recolors the cyan to a darker `#0892B5` so text/line
contrast stays AA on near-white.

---

## 4 · Component Catalogue

**Forms** — Button (primary/secondary/ghost/danger/icon × sm/md/lg ×
hover/active/disabled/loading-scan), ButtonGroup, Input, Textarea, Select,
MultiSelect/Combobox/Autocomplete, Checkbox, Radio, Toggle/Switch,
SegmentedControl, Slider, Stepper, DatePicker (calendar), FileUpload (drag/drop),
SearchBar, Rating, ChipInput.

**Display** — Card (HUD panel + brackets), StatCard (gauge/readout), Badge/Tag,
Avatar/AvatarGroup (hexagon), Tooltip, Popover, Accordion, Tabs (+pills), Table
(sort · select · paginate), List, Timeline, KanbanCard, CodeBlock, Skeleton
(scan), EmptyState, Carousel, Calendar.

**Feedback / Overlays** — Alert/Banner, Toast (stacked, auto-dismiss),
Modal/Dialog (focus-trapped), Drawer, CommandPalette (⌘K), Progress
(bar / radial / radar), Spinner (reticle), InlineNotification.

**Navigation** — Navbar, Sidebar (collapsible), Breadcrumb, Pagination,
Menu/Dropdown, ContextMenu, Steps/Wizard.

Every interactive component carries keyboard support and ARIA roles/states.

---

## 5 · Interaction API (`app.js`)

Self-initialising on `DOMContentLoaded` via `data-*` attributes — no manual
wiring. Highlights:

- `data-theme-toggle` — dark/light switch (persisted in `localStorage`)
- `data-open-modal="#id"` / `data-close-modal` — focus-trapped dialogs
- `data-open-drawer="#id"` / `data-close-drawer`
- `data-cmdk` + `⌘K` / `Ctrl+K` — command palette with fuzzy filter + arrow nav
- `data-toast="success|warning|danger|info"` — or call `window.HUD.toast({type,title,message})`
- `data-tabs` / `role="tab"` — roving-focus tabs (also drives the settings & wizard)
- `data-table` (`data-page-size`, `data-pager`) — sortable / selectable / paginated grid
- `data-kanban` + `data-kanban-col` — drag & drop with live column counts
- `data-slider`, `data-stepper`, `data-rating`, `data-chip-input`, `data-file-upload`, `data-combobox`, `data-segmented`, `data-accordion`
- `data-radial` / `.gauge[data-value]` / `.meter[data-value]` / `.progress[data-value]` — animate to value on load
- `data-telemetry` (`data-base`, `data-range`, `data-dp`) — live jittering readouts (frozen under reduced-motion)

---

## 6 · Theming & Replacement Guide

**Swap the accent color** — change one primitive, the whole system follows:

```css
:root { --cyan-400: #00FFA3; }   /* now the HUD glows green */
```

Because every semantic + component token references the ramps, re-pointing a
ramp step recolors buttons, borders, glows, gauges, focus rings and charts at once.

**Re-skin to another brand** — override the semantic layer only:

```css
:root[data-theme="dark"] {
  --color-primary: #FF5E00;          /* amber-hot HUD */
  --color-primary-fg: #150500;
  --glow-cyan: rgba(255,94,0,.55);   /* glows/rings follow */
}
```

**Change the corner language** — the bevel size is a single variable:

```css
:root { --bevel-md: 4px; }   /* subtler notches everywhere */
```

**Add a component** — create `components/yourthing.css`, add one `@import` line
to `components/index.css`, and consume the existing tokens (`--color-surface`,
`--card-clip`, `--glow-md`, …) so it inherits the look for free.

**Light mode** — already built. Toggle in-app, or default it with
`<html data-theme="light">`.

---

## 7 · Accessibility

- Body text uses bright **solid** colors (`#DCEEFB` on `#060B16`) — never glow-dependent — for ≥ 4.5:1 contrast. Light mode darkens cyan to `#0892B5` to keep AA on white.
- All decorative atmosphere (hex grid, scanlines, reticles, radar, glows) is `aria-hidden` / pseudo-element only.
- `prefers-reduced-motion` halts every scan, stream, radar rotation, telemetry jitter and toast bar; no element blinks faster than ~1.4s (well under the 3-flash/sec threshold).
- Visible cyan **focus rings** (`--ring-cyan`) on every interactive element; modal/drawer trap focus and restore it on close.
- Status is always conveyed by **color + icon + text**, never color alone.
- Semantic landmarks, `skip-link`, ARIA roles (`tablist`, `dialog`, `listbox`, `status`/`alert`), and full keyboard operation throughout.

See **CHECKLIST.md** for the line-by-line self-audit.
