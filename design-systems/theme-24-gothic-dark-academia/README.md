# Folio · XXIV — Gothic / Dark Academia Design System

> *A candlelit, leather-bound design system. Burgundy, hunter green and aged gold,
> inscribed on charcoal and aged parchment.*

A complete, production-grade, framework-free design system: full token scale,
50&plus; accessible components, and **ten** fully-assembled demonstration pages —
all rendering by double-click (`file://`), no build step, no dependencies.

---

## 1. Design Philosophy

Dark Academia is the romance of the old library: gilt-tooled spines under
candlelight, the hush of an Oxford cloister, marginalia in a careful hand.
This system translates that mood into an interface language.

| Principle | Expression |
|-----------|-----------|
| **Dark, scholarly, classical** | Charcoal/ink canonical surface; parchment & cream ink. Never bright, neon, minimal-startup or casual. |
| **Restrained colour, singular accent** | Deep **burgundy/oxblood** primary, **hunter green** for success, a single **aged gold/brass** accent. Oxblood danger, brass warning. |
| **Illuminated, not decorated** | Drop caps, manuscript flourishes, fleurs-de-lis, gold double rules, corner filigree, aged-paper texture & grain — atmosphere with intent. |
| **Bookish typography** | Body in **EB Garamond** (loose, warm leading), display in **Cinzel**. Blackletter (**UnifrakturCook**) is *large decorative only* — never body copy. |
| **Quiet, candle-soft motion** | Slow fades, gentle reveals, a warm candle glow on hover and a gold ring on focus. |

The light theme is not a different system — it is the same folio printed on
**aged parchment**: a warm cream leaf with burgundy/forest ink and gold rules.

---

## 2. File Structure

```
theme-24-gothic-dark-academia/
├── tokens.css          Raw primitives: colour ramps, scales, decorative tokens
├── semantic.css        Semantic + component tokens (light & dark), references tokens
├── base.css            Reset, typography, textures, ornament utilities, layout
├── components/
│   ├── buttons.css     Button, ButtonGroup, Segmented, FAB
│   ├── forms.css       Input, Textarea, Select, Combobox, Checkbox, Radio,
│   │                   Toggle, Slider, Stepper, ChipInput, Rating, FileUpload…
│   ├── display.css     Card, StatCard, Badge, Avatar, Tooltip, Popover,
│   │                   Accordion, Tabs, Table, List, Timeline, Kanban, Code,
│   │                   Skeleton, EmptyState, Carousel, Calendar
│   ├── feedback.css    Alert, Banner, Toast, Modal, Drawer, CommandPalette,
│   │                   Progress, Spinner, InlineNotification
│   └── navigation.css  Navbar, Sidebar, Breadcrumb, Pagination, Menu,
│                       ContextMenu, Steps/Wizard
├── app.js              All interactions + theme switching (vanilla, zero deps)
├── index.html          Landing hub + token visuals + component gallery
├── pages/              Ten real demonstration screens (see §6)
├── README.md           This document
└── CHECKLIST.md        Implementation & accessibility self-audit
```

Load order on every page: `base.css` (which `@import`s `tokens.css` +
`semantic.css`) → whichever `components/*.css` you need → `app.js` before `</body>`.

---

## 3. Token Reference

### Colour ramps (`tokens.css`) — each 50 → 900

| Ramp | Role | Anchor |
|------|------|--------|
| `--burgundy-*` | Primary / oxblood | `--burgundy-700` `#5C1A1B` |
| `--forest-*` | Success / hunter green | `--forest-700` `#22372B` |
| `--gold-*` | Accent / brass | `--gold-500` `#A6843C` |
| `--neutral-*` | Surface ↔ ink | `--neutral-100` parchment `#E7DCC4`, `--neutral-800` charcoal `#1E1B19` |

Convenience swatches: `--oxblood`, `--parchment`, `--charcoal`, `--brass`, `--ink`.

### Decorative tokens (the soul)

| Token | What it is |
|-------|-----------|
| `--drop-cap` | Font family for illuminated initials (blackletter) |
| `--flourish` | Symmetrical manuscript scroll (inline-SVG data URI) |
| `--fleur` | Fleur-de-lis glyph |
| `--rule-ornate` | Ornate horizontal rule with centre diamond |
| `--corner-ornament` | Filigree for card corners |
| `--aged-paper-texture` / `--aged-vellum-texture` | Layered warm stains for light / dark |
| `--paper-grain` | Tiled fractal-noise grain overlay |
| `--blackletter` | Decorative blackletter stack (large ornament only) |

### Scales

- **Spacing** `--space-0 … --space-16` (4px base).
- **Type** `--text-2xs … --text-7xl`; **leading** `--leading-none … --loose` (loose, bookish); **tracking** `--tracking-tighter … --widest`.
- **Radii** `--radius-sm` 2px, `--radius-md` 4px (cap — nothing larger by convention), `--radius-pill` (avatars/seals only).
- **Borders** `--border-1`, `--border-2`, `--border-double` (gold/deep-tone).
- **Shadows** `--shadow-sm/md/lg` (deep warm) + `--glow-candle`, `--glow-candle-sm`.
- **Focus** `--ring-gold`, `--ring-gold-strong`.
- **Motion** `--ease-standard/emphasized/out`, `--duration-fast/base/slow/slower`.
- **Z-index** `--z-base … --z-max`; **breakpoints** `--bp-sm … --bp-2xl`.

### Semantic tokens (`semantic.css`)

`--color-bg`, `--color-bg-2`, `--color-surface`, `--color-surface-2/3/-inset`,
`--color-text`, `--color-text-strong/muted/subtle/inverse`,
`--color-primary(+hover/active/fg/soft)`, `--color-accent(+…)`,
`--color-border(+strong/subtle)`, `--color-rule`,
`--color-success/warning/danger/info` (each `+ -bg / -fg / -border`),
`--color-ring`, `--color-overlay`, `--color-link(+hover)`, `--surface-texture`.

Component tokens: `--btn-*`, `--card-*`, `--input-*`, `--table-*`, `--code-*`,
`--tooltip-*`, `--nav-*`, `--sidebar-*`.

---

## 4. Component Catalogue

**Forms** — Button (primary/secondary/ghost/danger/gold/icon × sm/md/lg ×
hover/active/disabled/loading), ButtonGroup, SegmentedControl, Input, Textarea,
Select, Combobox/Autocomplete, MultiSelect, Checkbox, Radio, Toggle/Switch,
Slider, Stepper, ChipInput, Rating, FileUpload (dropzone), SearchBar, DatePicker
trigger.

**Display** — Card (+ illuminated/accent-top/hover), StatCard, Badge/Tag (+ wax
seal), Avatar / AvatarGroup, Tooltip, Popover, Accordion, Tabs (line + pill),
Table (sort / select / stripe / pagination), List, Timeline, KanbanCard,
CodeBlock, Skeleton, EmptyState, Carousel, Calendar.

**Feedback / Overlay** — Alert/Banner, InlineNotification, Toast (stacking),
Modal/Dialog (focus-trapped), Drawer, CommandPalette (⌘K), Progress (bar +
ring + striped), Spinner.

**Navigation** — Navbar, Sidebar (collapsible), Breadcrumb, Pagination,
Menu/Dropdown, ContextMenu, Steps/Wizard.

Every interactive component is keyboard-operable, carries appropriate ARIA, and
shows the gold focus ring.

---

## 5. Interactions (`app.js`)

Pure vanilla JS, no dependencies, progressive enhancement. Behaviours wire up
from `data-*` hooks at load:

`data-theme-toggle` · `data-tabs` (+ `role=tab`/`aria-controls`, arrow keys) ·
`data-accordion[-single]` · `data-modal-open/-close` (focus trap, ESC) ·
`data-drawer-open/-close` + `data-drawer-overlay` · `data-toast` (+ title /
variant) · `data-cmdk-open` (⌘K / Ctrl-K) · `data-menu`/`-trigger` ·
`data-popover`/`-trigger` · `data-stepper` · slider `data-output` ·
`data-chip-input` · `data-dropzone` · table `data-sortable` /
`data-select-all` / `data-row-select` · `data-carousel` · `data-sidebar-toggle` ·
`data-copy` · `data-pricing-toggle` · `data-wizard` · `data-pw-toggle` ·
`data-filter` · `data-reveal` (scroll reveal) · `data-radio-cards`.

Programmatic toast: `window.gothicToast({ title, body, variant, timeout })`.

---

## 6. Demonstration Pages (`pages/`)

| № | File | Screen |
|---|------|--------|
| I | `dashboard.html` | Analytics dashboard — classical widgets, sortable ledger, hand-drawn charts |
| II | `kanban.html` | Kanban board with real drag-and-drop |
| III | `inbox.html` | Three-panel epistolary correspondence |
| IV | `product.html` | Antiquarian boutique product detail |
| V | `pricing.html` | Three memberships, monthly/annual toggle |
| VI | `settings.html` | Tabbed preferences + danger zone |
| VII | `onboarding.html` | Matriculation wizard (Steps) |
| VIII | `profile.html` | A scholar's dossier |
| IX | `404.html` | Lost-page leaf + empty states |
| X | `article.html` | Long-form essay — the drop-cap & flourish showpiece |

Open `index.html` and follow the links, or open any page directly.

---

## 7. Theming & Replacement Guide

**Switch theme at runtime:** the toggle sets `data-theme="light|dark"` on
`<html>` and persists to `localStorage`. Dark is the default & canonical.

**Re-skin to a different brand** without touching components — edit only ramps
in `tokens.css`:

```css
:root {
  --burgundy-700: #4a2c5a;   /* swap the primary anchor … */
  --gold-500:     #b8924a;   /* … and the accent */
}
```

Because semantic tokens reference ramps and components reference semantics,
changing a single ramp cascades everywhere.

**Re-map a semantic role** (e.g. make gold the primary instead of burgundy):
edit `semantic.css` only —

```css
:root[data-theme="dark"] { --color-primary: var(--gold-600); }
```

**Add a component:** create `components/your-thing.css`, consume semantic /
component tokens (never hard-code hex), link it after the others, and add any
`data-*` behaviour to `app.js`.

**Tune the mood:** ornaments live as inline-SVG data URIs in `tokens.css`
(`--flourish`, `--fleur`, `--rule-ornate`, `--corner-ornament`) — recolour by
editing the `%23a6843c` (gold) fill inside each.

---

## 8. Accessibility

- Text contrast ≥ 4.5:1 (parchment/cream on dark surfaces; ink on parchment).
- Blackletter restricted to large decorative use; **never** body copy.
- All decoration is `aria-hidden`; meaning is always carried by text.
- Visible **gold focus ring** on every interactive element.
- `prefers-reduced-motion` honoured (animations & smooth scroll disabled).
- Full keyboard operation; ARIA roles/states on tabs, dialogs, menus, tables.

See `CHECKLIST.md` for the full self-audit.

---

## 9. Browser Support

Modern evergreen browsers. Uses CSS custom properties, `color-mix()`,
`backdrop-filter`, `conic-gradient`, container-friendly grids. No polyfills, no
build tooling, no external CSS/JS frameworks — every ornament and icon is
inline SVG.

*Bound in CSS & vanilla JavaScript — MMXXVI.*
