# Botanical Journal — Design System № 17

> *Herbarium digitalis* — a design system pressed and catalogued like a flower.

A production-grade, framework-free design system with the mood of a Victorian **pressed-plant
field journal**: sage, olive and moss greens laid on cream parchment, written in soft brown
sepia ink, with mustard-pollen and dusty-rose blooms for accent. Pen-drawn botanical line
illustrations, herbarium specimen labels, and ink hairline rules carry the personality.

Everything is pure CSS custom properties + vanilla JS. Every `.html` file renders and works by
**double-click (`file://`)** — no build step, no external CSS/JS frameworks, all icons and plant
motifs are **inline SVG**.

---

## 1. Design philosophy

| Principle | How it shows up |
|---|---|
| **Natural, low-saturation palette** | Desaturated greens, warm parchment, sepia ink. No neon, no pure black, no cold grey — even shadows are brown-toned. |
| **Scholarly / herbarium tone** | Oldstyle serif type (Cormorant + EB Garamond), small-caps specimen labels, italic scientific binomials, oldstyle numerals. |
| **Pressed-paper materiality** | Faint global paper-grain texture, soft "paper lift" shadows, small radii (4–8px) or square corners, ink **hairline** borders and **double-rules**. |
| **Botanical motifs as signature** | Hand-drawn leaf / fern / flower / vine SVGs on card corners, watermarks, dividers, and empty states. All decorative motifs are `aria-hidden`. |
| **Restraint in motion** | Quiet easing, gentle page-load reveals, ink-underline hovers. Fully honors `prefers-reduced-motion`. |
| **Accessible by construction** | Ink-on-parchment text clears **4.5:1**; status is color **+ icon + text**; a moss-green **2px focus ring** is global. |

Two themes ship: **light** (parchment — the canonical journal page) and **dark** (*dusk* — a deep
forest-green ground with cream ink and lit blooms). Toggle persists to `localStorage`.

---

## 2. File structure

```
theme-17-botanical-journal/
├── tokens.css          Primitive tokens — color ramps, plant motifs, scales (the raw pigments)
├── semantic.css        Semantic + component tokens, light & dark (the meaning layer)
├── base.css            Reset, web fonts, typography, paper texture, journal layout utilities
├── components/
│   ├── index.css       One @import bundle for everything below
│   ├── buttons.css     Button, ButtonGroup, SegmentedControl
│   ├── forms.css       Input, Textarea, Select, Checkbox, Radio, Switch, Slider, Stepper,
│   │                   SearchBar, Rating, ChipInput, Combobox, FileUpload/Dropzone
│   ├── display.css     Card, StatCard, Badge/Tag, SpecimenTag, Avatar, List, Timeline,
│   │                   KanbanCard, CodeBlock, Skeleton, EmptyState, Carousel, Calendar
│   ├── table.css       Sortable / selectable / paginated / responsive table
│   ├── overlay.css     Tooltip, Popover, Alert, InlineNotification, Progress (bar/ring),
│   │                   Spinner, Toast, Modal, Drawer, CommandPalette
│   ├── navigation.css  Navbar, Sidebar, Tabs, Accordion, Breadcrumb, Pagination,
│   │                   Menu/Dropdown, ContextMenu, Steps/Wizard
│   └── charts.css      Bar chart, sparkline, donut, legend, meter (pure CSS/SVG)
├── app.js              All interactions + theme switching (vanilla, self-initializing)
├── index.html          Hub — hero, token & motif visuals, live component gallery, page links
├── pages/              Nine fully-assembled demo screens (see §6)
├── README.md           ← you are here
└── CHECKLIST.md        Implementation & accessibility self-audit
```

**Load order matters:** `tokens.css → semantic.css → base.css → components/index.css`, then
`app.js` before `</body>`. Pages in `pages/` reference these with `../` paths.

---

## 3. Token reference

### Color ramps (primitives — `tokens.css`)
Each ramp runs `50 → 900` (plus `950` on green).

| Ramp | Role | Anchor values |
|---|---|---|
| `--green-*` | sage → moss, the living pigment / **primary** | `500 #8a9a6b` (sage), `600 #6e7a52` (moss), `700 #586341` (AA text) |
| `--parchment-*` | warm-neutral paper / **backgrounds & surfaces** | `100 #f4eedf` (canonical page), `50 #fbf8f0` (surface) |
| `--ink-*` | sepia writing ink / **text & hairlines** | `600 #4a3f2e` (body), `500 #5f503a` (muted), `300` (hairline) |
| `--bloom-*` | mustard pollen / **accent** | `500 #b5892a` |
| `--rose-*` | dried dusty-rose / **secondary bloom** | `500 #a05a47` |
| functional | `--clay-500` (warning), `--berry-500` (danger), `--sky-500` (info) | derived naturals |

### Botanical motif tokens
`--motif-leaf`, `--motif-fern`, `--motif-flower`, `--motif-vine`, `--motif-sprig` — inline-SVG
data-URIs (pen-line, re-tinted to cream in dark theme). `--paper-texture` (fractal-noise grain),
`--ink-hairline` (double-rule gradient).

### Scales
- **Spacing** `--space-0 … --space-16` (4px base).
- **Type** `--text-2xs … --text-6xl`; `--leading-none … --leading-loose`; `--tracking-tighter … --tracking-widest`.
- **Radii** `--radius-sm 3px`, `--radius-md 6px`, `--radius-lg 10px`, `--radius-pill`.
- **Borders** `--border-1 1px` (ink hairline) … `--border-3`.
- **Shadows** `--shadow-xs/sm/md/lg`, `--shadow-inset`, `--shadow-paper` (brown-toned).
- **Z-index** `--z-base … --z-tooltip`. **Breakpoints** `--bp-sm 480 … --bp-2xl 1536`.
- **Rings** `--ring-width/-offset/-color` (moss). **Motion** `--ease-standard`, `--duration-fast/base/slow`.

### Semantic tokens (`semantic.css`, themed)
`--color-bg`, `--color-surface`, `--color-surface-2/3`, `--color-text`, `--color-text-strong/muted/faint`,
`--color-primary` (=moss) `+-hover/-active/-fg/-soft`, `--color-accent` (=bloom), `--color-rose`,
`--color-border`, `--color-border-strong`, `--color-hairline`, `--color-divider`,
`--color-success/-warning/-danger/-info` (each `+-fg` and `+-soft/-soft-fg`).

### Component tokens
`--btn-*`, `--card-*`, `--input-*`, `--badge-*`, `--table-*`, `--tooltip-*`, `--nav-*`, `--sidebar-*`,
`--toast-*`, `--modal-*`, `--drawer-w` — each resolves to semantic tokens, so re-skinning is a
one-layer change.

---

## 4. Component catalogue

**Forms** — Button (primary/secondary/ghost/accent/danger/icon × sm/md/lg × hover/active/disabled/loading),
ButtonGroup, SegmentedControl, Input, Textarea, Select, Combobox/Autocomplete, Checkbox, Radio,
Switch/Toggle, Slider, Stepper, SearchBar, Rating, ChipInput, FileUpload/Dropzone.

**Display** — Card (with botanical corner sprigs / specimen / accent variants), StatCard, Badge/Tag,
SpecimenTag (herbarium label), Avatar / AvatarGroup / status, List (leaf bullets), Timeline,
KanbanCard, CodeBlock, Skeleton, EmptyState, Carousel, Calendar, Table (sortable · selectable ·
paginated · responsive-stacking).

**Feedback & overlay** — Alert/Banner, InlineNotification, Toast (stacking), Modal/Dialog, Drawer,
CommandPalette (⌘K), Progress (bar + circular ring), Spinner.

**Navigation** — Navbar, Sidebar (collapsible), Tabs (underline + pill), Accordion, Breadcrumb,
Pagination, Menu/Dropdown, ContextMenu, Steps/Wizard (horizontal + vertical).

**Data viz** — Bar chart, sparkline, donut, legend, meter — pure CSS / inline SVG, natural-tone palette.

Each interactive component carries ARIA roles/states and full keyboard operation (see §5 & CHECKLIST).

---

## 5. JavaScript hooks (`app.js`)

`app.js` is self-initializing, idempotent, and event-delegated — drop the data-attributes into
markup and it wires up on load. Key hooks:

| Behaviour | Markup hook |
|---|---|
| Theme toggle | `data-theme-toggle` (persists; `Dusk`/`Daylight` label) |
| Tabs | `data-tabs` + `role="tab"`/`role="tabpanel"` + `aria-controls` (arrow-key roving) |
| Accordion | `data-accordion` (+`data-accordion-single`) |
| Modal / Drawer | `data-modal-open="id"` / `data-modal-close` (focus-trapped, Esc to close) |
| Toast | `data-toast` / `data-toast-title` / `data-toast-variant`, or `bjToast({…})` |
| Command palette | `data-cmdk` container + `data-cmdk-open`; **⌘K / Ctrl-K** global |
| Dropdown / Context menu | `data-dropdown-trigger` / `data-context-menu="id"` |
| Segmented control | `data-segmented` + `data-target` → `[data-seg-panel]` |
| Sortable table | `data-sortable` + `th.sortable` (`.num` for numeric, `data-sort` for keys) |
| Row selection | `data-select-all` + `.row-check` + `[data-select-count]` |
| Stepper · Rating · Chips · Combobox · Slider readout | `.stepper` · `.rating[data-rating]` · `.chips[data-chip-input]` · `[data-combobox]` · `.slider[data-slider]` |
| Pricing toggle | `data-pricing-toggle` + `[data-price]`/`[data-price-annual]` |
| Wizard | `data-wizard` + `[data-step]` + prev/next/done buttons |
| Dropzone | `.dropzone` + `[data-file-list]` (drag & drop) |
| Kanban DnD | `data-kanban` + `[data-kanban-col]`/`[data-kanban-drop]`/`[data-kanban-count]` |
| Count-up · Scroll reveal · Year | `data-countup` · `data-reveal` · `data-year` |
| Sidebar collapse | `data-sidebar-toggle` → `.sidebar.is-collapsed` |

---

## 6. Showcase pages (`pages/`)

1. **dashboard.html** — analytics: collapsible sidebar, stat cards, CSS bar/donut charts, sortable ledger, timeline, calendar.
2. **kanban.html** — drag-and-drop "pressing pipeline" board with live column counts + new-specimen modal.
3. **inbox.html** — 3-pane mail client (folders · message list · reading pane) for a seed-exchange society.
4. **product.html** — plant-shop product detail with gallery, variants, quantity stepper, reviews, cart drawer.
5. **pricing.html** — three plans with working monthly/annual toggle, comparison table, FAQ accordion.
6. **settings.html** — tabbed settings (profile, notifications, appearance) with a confirm-to-delete danger zone.
7. **onboarding.html** — multi-step wizard with progress, interest selection, success state.
8. **profile.html** — curator profile: botanical cover, stat cards, tabbed collection / activity / about.
9. **404.html** — not-found page + a gallery of botanical empty states.

`index.html` is the hub: hero, palette & motif visuals, a live gallery of every component, and links
to all nine pages.

---

## 7. Re-skinning guide (make it your own)

Because the system is strictly layered (primitive → semantic → component), you rarely touch components:

1. **Shift the whole mood** — edit the ramps in `tokens.css`. e.g. swap `--green-*` for a blue ramp
   and the primary, focus ring, success, charts, and every soft-tint follow automatically.
2. **Re-map roles** — in `semantic.css`, point `--color-primary`, `--color-accent`, etc. at different
   ramp steps. Want rose as primary? `--color-primary: var(--rose-600);`.
3. **Re-theme dark** — adjust the `[data-theme="dark"]` block only; light stays untouched.
4. **Swap the botany** — replace the `--motif-*` data-URIs with your own inline-SVG line art (keep
   `stroke='%234a3f2e'` so they pick up ink color, and add a cream-tinted copy in the dark block).
5. **Retune scale/shape** — change `--radius-md`, `--space-*`, or the font stack in one place.
6. **Component tokens** — for surgical tweaks (button height, card padding) edit the `--btn-*` /
   `--card-*` group at the bottom of `semantic.css` without opening any component file.

Keep contrast ≥ 4.5:1 when changing text/background pairings — see CHECKLIST.md for the validated set.

---

## 8. Browser support & constraints

- Modern evergreen browsers (Chromium, Firefox, Safari). Uses `color-mix()`, `conic-gradient`,
  `backdrop-filter`, `aspect-ratio`, `:focus-visible` — all widely supported in 2024+.
- **Zero dependencies.** Web fonts load from Google Fonts when online; offline, the stack degrades
  gracefully to local oldstyle serifs (Hoefler Text / Palatino / Georgia).
- Works from `file://` — no server required.

*Pressed & catalogued, № 17.*
