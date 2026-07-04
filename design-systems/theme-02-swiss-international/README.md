# Theme 02 — Swiss International

> A production-grade, **dependency-free** design system in the *International
> Typographic Style* (Swiss design). Order, precision, objectivity. Typography
> and a strict 12-column grid carry the entire system. No gradients, no rounded
> corners, no drop shadows — only the **hairline rule** and **one** accent.

Open `index.html` by double-clicking it. Everything runs from `file://` with pure
CSS + vanilla JS. No build step, no framework, no npm install.

---

## 1. Design philosophy

The International Typographic Style emerged in 1950s Switzerland (Müller-Brockmann,
Hofmann, Ruder, the journal *Neue Grafik*). Its rules are this system's rules:

| Principle | How it shows up here |
|-----------|----------------------|
| **The grid is the design** | A strict 12-column grid, 24px gutters, snapped to an 8px baseline. Press `g` (or the grid button) to reveal it over any page. |
| **Typography builds hierarchy** | Size, weight and tracking — *not* colour — establish rank. Neutral grotesque (Inter ≈ Neue Haas Grotesk) for content, mono (JetBrains Mono) for labels/numbers. Flush-left, ragged-right. |
| **Objectivity over decoration** | Zero gradients, zero shadows, zero radius. Regions are separated by **1px hairline rules**, never boxes or elevation. |
| **One accent, used sparingly** | White ground, ink-black text, and a single **Swiss Red `#E2231A`**. Red marks focus, the primary action, and the one thing that should draw the eye. Everything else is a neutral grey step. |
| **Signature details** | Numbered mono section labels (`01 — Components`), large display numerals, left-aligned label columns, focus = red 2px outline, hover = underline or red shift (never movement). |

If you remember one thing about a screen, it should be its *structure*.

---

## 2. File structure

```
theme-02-swiss-international/
├── theme.css            ← single entry point (@imports the four layers below)
├── tokens.css           ← primitive tokens: colour ramps + all scales
├── semantic.css         ← semantic roles + component tokens; light & dark
├── base.css             ← reset, typography, 12-col grid, layout utilities
├── components/          ← one stylesheet per component family
│   ├── index.css        ← barrel @import of every component file
│   ├── button.css  input.css  select.css  choice.css  slider.css
│   ├── upload.css  datepicker.css  card.css  badge.css  table.css
│   ├── list.css  disclosure.css  code.css  feedback.css  overlay.css
│   ├── menu.css  nav.css  carousel.css  chart.css
├── app.js               ← all interactions (theme, grid overlay, ⌘K, modals…)
├── index.html           ← hub: token visuals + full component gallery + links
├── pages/               ← nine fully-assembled demo screens
│   ├── dashboard.html  kanban.html  inbox.html  product.html  pricing.html
│   ├── settings.html  onboarding.html  profile.html  404.html
├── README.md            ← this file
└── CHECKLIST.md         ← implementation + accessibility self-audit
```

### Wiring a page

```html
<!DOCTYPE html>
<html lang="ko" data-theme="light">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="theme.css">            <!-- ../theme.css from pages/ -->
</head>
<body>
  …
  <script src="app.js"></script>                       <!-- ../app.js from pages/ -->
</body>
</html>
```

`theme.css` pulls the four layers in the correct cascade order. That's the only
stylesheet a page needs.

---

## 3. Token reference

### Colour — neutral ramp (the workhorse)

`--neutral-50 … --neutral-900` (11 steps) plus `--white` and `--black (#0A0A0A)`.
All structural greys, text, and rules come from here.

### Colour — Swiss Red (the only accent)

`--red-50 … --red-900`, base **`--red-500 = #E2231A`**. Status hues
(`--green-500`, `--amber-500`, `--blue-500`) exist but are deliberately low-chroma.

### Semantic roles (use these in markup, never the raw ramp)

| Role | Light value |
|------|-------------|
| `--color-bg` / `--color-surface` | white |
| `--color-surface-2 / -3` | neutral-50 / -100 |
| `--color-text` | neutral-900 |
| `--color-text-muted / -subtle / -faint` | neutral-600 / -500 / -400 |
| `--color-border` | neutral-200 (the default hairline) |
| `--color-border-strong` | neutral-900 (the ink rule) |
| `--color-primary` / `--color-accent` | red-500 |
| `--color-success / -warning / -danger / -info` | low-chroma green / amber / red-600 / blue |
| `--color-focus` | red-500 |
| `--color-inverse` / `--color-inverse-fg` | ink panel / white text |

Dark mode (`[data-theme="dark"]`) inverts ground to black, text to white, keeps the
same red, and keeps everything hairline-based.

### Scales

| Token group | Values |
|-------------|--------|
| Spacing | `--space-0 … --space-16` — 8px baseline, 4px sub-steps (0,4,8,12,16,20,24,32,40,48,56,64,80,96,128,160,192) |
| Type size | `--text-2xs … --text-6xl` (+ `--text-7xl`) — 11→120px |
| Leading | `--leading-none / tight / snug / normal / relaxed` |
| Tracking | `--tracking-tighter … --tracking-widest` (headlines negative, mono labels wide) |
| Weight | `--weight-regular … --weight-black` (400–800) |
| Border | `--border-1` (hairline) `--border-2` `--border-3` |
| **Radius** | `--radius-sm/md/lg/full` — **all 0** |
| **Shadow** | `--shadow-xs … --shadow-xl` — **all `none`**; `--shadow-hairline` is a 1px ring |
| Z-index | `--z-sticky … --z-tooltip` (1100–1800) |
| Ring | `--ring-width 2px`, `--ring-color` red |
| Motion | `--ease-standard`, `--duration-fast/base/slow` (120/200/320ms) |
| Grid | `--grid-cols 12`, `--grid-gap 24px`, `--grid-margin`, `--baseline 8px`, `--measure 68ch` |

---

## 4. Grid & layout utilities (`base.css`)

- `.container` (`--narrow`, `--wide`) — centred max-width with responsive side margins.
- `.grid` — 12 equal columns + 24px gap. Children take `.col-1 … .col-12`,
  with responsive overrides `.sm-col-*`, `.md-col-*`, `.lg-col-*` (mobile-first).
- Flex helpers: `.row .col .stack .cluster .items-* .justify-* .gap-1…9 .grow .wrap`.
- Rules: `.border .border-t|b|l|r .border-*-strong .rule .rule--accent .divide-y`.
- Type: `.display .h1…h6 .lead .body .small .caption .overline .mono .section-label .num .measure`.
- Spacing: `.mt-* .mb-* .p-* .py-* .px-* .flow .flow-sm .flow-lg .section`.
- Helpers: `.visually-hidden .skip-link .hide-md .show-md .hide-lg .show-lg .truncate .clamp-2 .page-head`.
- Grid overlay: `.grid-overlay` (built by JS) + `body.grid-overlay-on`.

---

## 5. Component catalogue

**Forms** — Button (primary/secondary/ink/ghost/danger/icon × sm/md/lg ×
hover/active/disabled/loading), ButtonGroup, Toolbar, Input, Textarea, Select,
MultiSelect, Combobox/Autocomplete, Checkbox, Radio, Toggle/Switch,
SegmentedControl, Slider, Stepper, DatePicker, Calendar, FileUpload, SearchBar,
Rating, ChipInput.

**Display** — Card, StatCard, StatStrip, Badge/Tag, Avatar/AvatarGroup, Tooltip,
Popover, Accordion, Tabs (underline/bordered/vertical), Table (sortable, selectable,
paginated), List, Description list, Timeline, KanbanCard, CodeBlock, Skeleton,
EmptyState, Carousel.

**Feedback & Overlay** — Alert/Banner, Toast (stacked, auto-dismiss),
InlineNotification, Modal/Dialog, Drawer, CommandPalette (⌘K), Progress (bar +
ring), Spinner.

**Navigation** — Navbar, Sidebar (collapsible), Breadcrumb, Pagination,
Menu/Dropdown, ContextMenu, Steps/Wizard (horizontal + vertical).

**Charts (pure CSS/SVG)** — hairline bar chart, line chart, sparkline, legend,
proportion bar.

Every component's canonical markup lives in `index.html` (the gallery) — copy from
there.

---

## 6. JavaScript hooks (`app.js`)

`app.js` is dependency-free, idempotent, and entirely **data-attribute driven** —
no inline handlers. Load it once at the end of `<body>`.

| Hook | Behaviour |
|------|-----------|
| `data-action="toggle-theme"` | light ⇄ dark, persisted to `localStorage` |
| `data-action="toggle-grid"` (or key `g`) | 12-column grid overlay |
| `data-action="open-cmdk"` / `⌘K` `Ctrl+K` | command palette |
| `data-action="toggle-sidebar" data-target="#id"` | collapse sidebar |
| `data-open-modal="#id"` / `data-close-modal` | modal (scrim, Esc, focus-trap) |
| `data-open-drawer="#id"` / `data-close-drawer` | drawer |
| `data-toast data-title data-text data-variant` | toast (or `Swiss.toast({…})`) |
| `[data-tabs]` + `role="tab"` | tabs with arrow-key roving |
| `[data-accordion="single"]` | accordion |
| `.segmented__item`, `[data-toggle-group] data-bind` | segmented / billing toggle |
| `[data-dropdown-trigger]`, `[data-popover-trigger]` | poppers (outside-click, Esc) |
| `.combobox`, `[data-combobox-filter]` | custom select / autocomplete |
| `data-slider`, `data-step`, `data-rating`, `data-toggle` | inputs |
| `[data-select-all]`, `[data-row-select]`, `.table__sort` | table select + sort |
| `[data-kanban]` + `[data-kanban-col]` | drag & drop board |
| `[data-wizard]` + `[data-wizard-next/prev/go]` | multi-step wizard |
| `[data-carousel]`, `[data-context-menu]`, `[data-datepicker]`, `[data-calendar]`, `[data-copy]` | misc widgets |

Public API: `Swiss.toast()`, `Swiss.openModal(id)`, `Swiss.closeTop()`,
`Swiss.openCmdk()`, `Swiss.setTheme(name)`, `Swiss.toggleGrid()`.

---

## 7. Re-theming / swapping the look

The system is layered so a re-skin never touches component or page markup:

1. **Change values only** → edit `tokens.css`. Want a different accent? Replace the
   `--red-*` ramp (and `--color-grid-*`). Want tighter rhythm? Change `--baseline`,
   `--space-*`, `--grid-gap`.
2. **Re-map roles** → edit `semantic.css`. e.g. make `--color-primary` point at
   `--neutral-900` instead of red, or soften `--color-border`.
3. **Dark palette** → already provided under `[data-theme="dark"]`; adjust there.
4. **Add a component** → drop a `components/<name>.css` file and add one `@import`
   line to `components/index.css`. Reference only semantic + component tokens.

Because components read semantic variables (never the raw ramp), steps 1–2 cascade
everywhere automatically, including dark mode.

> To turn this into a *different* aesthetic entirely (e.g. re-introduce shadows or
> radius), you would relax the DNA constraints in `tokens.css`
> (`--radius-*`, `--shadow-*`) — but that is, by definition, no longer Swiss.

---

## 8. Accessibility & browser support

- Colour contrast ≥ 4.5:1 for text (ink on white, white on red, muted ≥ 4.5:1 on white).
- Visible focus on every interactive element (red 2px outline).
- `prefers-reduced-motion` respected (durations collapse, no transforms).
- `prefers-color-scheme` honoured when no explicit theme is set.
- Semantic landmarks, ARIA roles/states on every widget, keyboard operation
  (Tab/Shift-Tab, arrows in tabs/menus/cmdk, Esc to dismiss, focus trapping in overlays).
- User-scalable type (root uses `%`/`rem`, no `maximum-scale`).
- Works in current Chrome, Firefox, Safari, Edge. No external CSS framework.
  (Online, web-fonts load from Google Fonts; offline they fall back to system
  grotesque/mono — layout is unaffected.)

See `CHECKLIST.md` for the full self-audit.
