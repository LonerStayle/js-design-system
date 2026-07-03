# BAUHAUS — Theme 11

> **Form follows function.** A production-grade, framework-free design system built on pure
> primaries, the circle–triangle–square shape alphabet, and a strict modular grid.
> Pure CSS variables + vanilla JS. Every `.html` runs by double-click (`file://`).

---

## 1 · Design philosophy

The Bauhaus (Weimar, 1919) fused art, craft and industry around one principle: **form follows
function**. Ornament is removed; geometry, primary color and rational structure remain. This
system encodes that DNA literally:

| Principle | How it shows up here |
|-----------|----------------------|
| **Function over decoration** | Flat color blocks. No gradients, no soft drop-shadows. The only shadow is a hard, geometric offset (`--shadow-flat`). |
| **Pure primaries** | Red `#E63027`, Yellow `#F7C200`, Blue `#1E4FCC`, Black `#1A1A1A`, White. Full 50–900 ramps for each. |
| **The shape alphabet** | Circle · triangle · square · quarter-arc appear as icons, avatars, loaders, dividers, status cues and decoration — everywhere. |
| **Geometric duality** | Square things are perfectly right-angled (`--radius-none: 0`). Round things are perfectly circular (`--radius-full`). The contrast is the point. |
| **Geometric type** | Jost (a Futura surrogate) — even strokes, circular `O`. Headings are often UPPERCASE with wide tracking. |
| **Modular & asymmetric** | A 12-column modular grid, bold/thin rule lines, asymmetric balance, diagonal and quarter-arc motifs. |
| **Restrained motion** | Hover = a small shape rotate / color flip / offset lift. Focus = a solid primary outline. All motion respects `prefers-reduced-motion`. |

---

## 2 · File structure

```
theme-11-bauhaus/
├── tokens.css            # raw primitives: color ramps, shape motifs, all scales
├── semantic.css          # semantic roles + component tokens; light & dark
├── base.css              # reset, typography, modular grid, layout & shape utilities
├── components/
│   ├── shapes.css        # geometric icon set, motif compositions, logomark, hero
│   ├── buttons.css       # Button · ButtonGroup · SegmentedControl · FAB
│   ├── forms.css         # Input/Textarea/Select/Checkbox/Radio/Toggle/Slider/Stepper/
│   │                     #   Search/FileUpload/Rating/ChipInput/MultiSelect/Combobox/DatePicker
│   ├── cards.css         # Card · StatCard · KanbanCard · EmptyState · PricingCard
│   ├── data-display.css  # Badge · Avatar · Table · List · Timeline · Accordion · Tabs ·
│   │                     #   CodeBlock · Skeleton · Calendar · Carousel
│   ├── feedback.css      # Alert/Banner · Toast · InlineNotification · Progress · Spinner ·
│   │                     #   Tooltip · Popover
│   ├── overlays.css      # Modal · Drawer · CommandPalette (⌘K) · Menu · ContextMenu
│   └── navigation.css    # Navbar · Sidebar · Breadcrumb · Pagination · Steps/Wizard
├── app.js                # all interactions + theme switching (auto-init, data-attr driven)
├── index.html            # landing + token/shape visuals + full component gallery + demo hub
├── pages/                # 9 real demo screens (see §6)
├── README.md             # this file
└── CHECKLIST.md          # implementation + accessibility self-audit
```

**Load order matters:** `tokens.css → semantic.css → base.css → components/*.css`, then `app.js`
at the end of `<body>`. Demo pages reference these with `../` paths.

---

## 3 · Token reference

### Color ramps (tokens.css)
Each primary has a 50→900 ramp; neutral runs `--neutral-0` (white) → `--neutral-950`.

| Ramp | Anchor | Notes |
|------|--------|-------|
| `--red-50 … --red-900` | `--red-500` = `#E63027` | brand red / secondary / danger |
| `--yellow-50 … --yellow-900` | `--yellow-400` = `#F7C200` | accent / warning |
| `--blue-50 … --blue-900` | `--blue-500` = `#1E4FCC` | primary / info |
| `--neutral-0 … --neutral-950` | — | black ↔ white structure |

### Shape motifs
`--clip-triangle`, `--clip-diamond`, `--clip-quarter-*`, `--clip-diagonal` (clip-path geometry);
`--svg-circle-red` … `--svg-grid-mod` (inline-SVG tiles); `--shape-accent-1…4` (primary stops).

### Scales
- **Spacing** `--space-0 … --space-20` — modular, 8px base.
- **Type** `--text-2xs … --text-6xl`; `--leading-*`; `--tracking-tighter … --tracking-widest`; weights `--weight-light … --weight-black`.
- **Radius** `--radius-none/sm/md/lg` (≈0) vs `--radius-full` (circle).
- **Border** `--border-1 … --border-4`, `--rule-thin`, `--rule-thick` (black).
- **Shadow** `--shadow-none`, `--shadow-flat`, `--shadow-flat-lg` (hard offsets only).
- **Rings** `--ring-blue/red/black`, `--ring-width`, `--ring-offset`.
- **Motion** `--ease-standard/in/out/spring`, `--duration-fast/base/slow`.
- **Grid** `--grid-cols: 12`, `--module`, `--container-max`. **Z-index** `--z-base … --z-command`. **Breakpoints** `--bp-sm … --bp-2xl`.

### Semantic roles (semantic.css)
`--color-bg`, `--color-surface{,-2,-3}`, `--color-text{,-muted,-subtle,-inverse}`,
`--color-primary{,-hover,-active,-fg,-subtle}`, `--color-secondary*`, `--color-accent*`,
`--color-border{,-subtle,-strong}`, `--color-divider`,
`--color-success/warning/danger/info{,-fg,-subtle,-border}`, `--color-ring`, `--color-scrim`,
plus convenience aliases `--color-red/yellow/blue`, `--color-surface-raised`, `--color-focus`.

> **Accessibility note on red:** `--red-500` (#E63027) measures 4.36:1 against white — just under
> AA. It is kept as the **decorative brand block** color (used only behind large display text /
> non-text graphics). Roles that place small white text on red (`--color-secondary`,
> `--color-danger`, `.badge--red`, `.chip--red`, `.card--fill-red`, `.block-red`) resolve to
> **`--red-600` (#C8241C → 5.64:1)** so normal-size text always clears 4.5:1.

### Component tokens
`--btn-*`, `--card-*`, `--input-*`, `--control-size`, `--toggle-*`, `--table-*`, `--badge-*`,
`--avatar-sm/md/lg`, `--modal-*`, `--drawer-w`, `--progress-*`, `--navbar-h`, `--sidebar-w*`.

---

## 4 · Theming (light / dark)

Set the theme on `<html>`:

```html
<html data-theme="light">   <!-- or data-theme="dark" -->
```

- **Light** = white field, black text, primary blocks.
- **Dark** = near-black field (`--neutral-950`) with the same primaries as vivid blocks; the focus
  ring shifts to yellow for visibility; the hard offset shadow flips to white.
- With **no** `data-theme`, the system honors `prefers-color-scheme`.
- `app.js` persists the user's choice in `localStorage` (`bauhaus-theme`). Any element with
  `data-theme-toggle` flips it; `Bauhaus.setTheme('dark'|'light')` does it programmatically.

---

## 5 · Components & how to wire them

Everything in `app.js` **auto-initializes from data-attributes** — include the script and use the
documented markup. No per-page wiring code required.

| Interaction | Markup hook |
|-------------|-------------|
| Theme toggle | `data-theme-toggle` |
| Modal | open `data-open-modal="id"`, close `data-close-modal`, element `.modal#id` |
| Drawer | open `data-open-drawer="id"`, close `data-close-drawer`, element `.drawer#id` |
| Toast | button `data-toast data-toast-variant data-toast-title data-toast-text`, or `Bauhaus.toast({...})` |
| Tabs | `[data-tabs]` + `[role=tab][aria-controls]` + `[role=tabpanel]` (arrow-key nav) |
| Accordion | `.accordion[data-accordion="single"]` + `.accordion__trigger[aria-expanded]` |
| Command palette | `[data-cmdk]`; open with ⌘K / Ctrl-K or `[data-open-cmdk]` |
| Menu / Popover | `[data-menu-toggle]` / `[data-popover-toggle]` + `.menu__panel[hidden]` |
| Context menu | zone `[data-context-menu="id"]` + `.context-menu#id[hidden]` |
| Slider | `input.slider[data-slider]` + `.slider__value` (`data-prefix/suffix`) |
| Stepper | `.stepper` + `[data-step="-1|1"]` |
| Search clear | `.searchbar` (auto) |
| File upload | `.fileupload` + `input[type=file]` + `[data-file-list]` (drag-drop) |
| Chip input | `[data-chipinput]` (Enter/comma adds, Backspace removes) |
| Combobox | `[data-combobox]` (+`data-multi`) + `.listbox` |
| Table | `[data-table]`, `th[data-sort="text|number"]`, `[data-select-all]`, `[data-row-check]`, cell `data-value` |
| Carousel | `[data-carousel][data-autoplay]` |
| Calendar | `[data-calendar]` (JS renders the month) |
| Wizard | `[data-wizard]` + `[data-wizard-panel]` + `[data-wizard-prev/next/done]` |
| Progress ring | `[data-ring="0-100"]` + two `circle`s |
| Segmented / billing | `.segmented` (+`[data-billing]` swaps `[data-price-month]`/`[data-price-year]`) |
| Sidebar | `[data-sidebar-toggle]` (collapse), `[data-sidebar-mobile]` (off-canvas) |
| Copy | `[data-copy]` or `.codeblock__copy` |

Full markup for every component lives in `index.html` (the gallery) — copy from there.

---

## 6 · Demo screens (`pages/`)

1. **dashboard.html** — analytics: stat cards, a shape bar-chart, a progress ring, a sortable/selectable table, a filter drawer, an activity timeline.
2. **kanban.html** — 4-column board with real HTML5 drag-and-drop, a new-task modal, a filter drawer.
3. **inbox.html** — 3-pane email (folders · list · reading pane) with live message selection + compose modal.
4. **product.html** — e-commerce detail: shape-composition gallery with thumbnail swap, variants, stepper, add-to-cart, accordion, related grid.
5. **pricing.html** — three plans, monthly/yearly toggle, comparison table, FAQ accordion.
6. **settings.html** — tabbed settings, toggles, segmented controls, a danger-zone modal with typed confirmation.
7. **onboarding.html** — 4-step wizard with progress markers, validation-style fields, completion state.
8. **profile.html** — cover + overlapping avatar, stat row, tabs (overview / activity / projects), edit modal.
9. **404.html** — geometric not-found composition + a gallery of empty-state and error patterns.

---

## 7 · Swapping the theme out (re-skinning)

Because every surface reads from tokens, you can repurpose this system without touching components:

1. **Recolor** — edit the ramps in `tokens.css` (e.g. swap the three primaries). Keep contrast in mind (see §3 note); if a new mid-tone fails 4.5:1 with white, point the small-text roles in `semantic.css` at a darker step as done for red.
2. **Re-shape** — to soften the look, raise `--radius-sm/md`; to harden it, keep them at 0. Toggle `--radius-full` usage where you want circles vs squares.
3. **Re-type** — change `--font-display` / `--font-body` (and the `@import` in `base.css`). Jost ↔ Poppins ↔ any geometric grotesque drops in cleanly.
4. **Re-space** — the whole rhythm scales from the 8px module (`--space-*`) and `--module`.
5. **Rename nothing** — token *names* are stable contracts; only their *values* change. Components never hardcode hex (decorative `fill-*`/`block-*` aside) — they read `var(--…)`.

---

## 8 · Constraints honored

- **Zero external CSS/JS frameworks.** Pure CSS variables + one vanilla `app.js`.
- **All icons & shapes are inline** (CSS-masked SVG / clip-path / borders) — no icon fonts, no image files.
- **Runs from `file://`** by double-click. (The only network request is the Google-Fonts `@import` for Jost; if offline, the geometric fallback stack — Poppins → Futura → Century Gothic → sans-serif — takes over with no layout shift.)
- **Responsive** at `--bp-sm … --bp-2xl` via the modular grid's `.col-*` / `.lg:col-*` / `.md:col-*` helpers.

See **CHECKLIST.md** for the full implementation & accessibility self-audit.
