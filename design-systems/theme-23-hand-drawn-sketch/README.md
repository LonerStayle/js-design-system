# ✎ THEME 23 — HAND-DRAWN SKETCH

> A production-grade, framework-free design system that looks like a page torn
> from a sketchbook. Rough ink borders on everything, warm note-paper, highlighter
> accents, doodle arrows / circles / stars, hand-drawn underlines and speech
> bubbles — all wired up with real, keyboard-accessible vanilla JS.

```
┌─────────────────────────────────────────────────────────┐
│  paper #F7F1E3   ✎ ink #243042                           │
│  highlighters →  yellow #FFE45C  pink #FF9EC4  mint #9EE6C4 │
└─────────────────────────────────────────────────────────┘
```

The whole thing is built around one demo product — **“sketchbook”**, a visual
notes / brainstorming app — so every screen feels like a real, lived-in product.

---

## 1. Design philosophy

Hand-drawn Sketch is **friendly, hand-made, and a little imperfect on purpose.**
Where most systems chase pixel-perfect vectors, this one chases the warmth of a
pen on paper. Every rule below is deliberate.

| Principle | What it means here |
|-----------|--------------------|
| **Nothing is perfectly straight** | Borders use slightly *irregular* radii (the “hand-drawn box” trick) + a 2–2.5px ink stroke, often with a tiny rotation, so no two boxes look cloned. |
| **Paper, not screens** | Warm cream note-paper (`--paper-200`) with faint ruled / dotted texture as the page ground. |
| **Pen ink for structure** | Dark navy ink (`--ink-700`) for text, borders and strokes. |
| **Highlighters for emphasis** | Yellow / pink / mint marker swipes behind text instead of bold color fills. |
| **Hand-drawn shadows** | Soft offset “sketch shadows”, never blurred elevation. |
| **Doodles carry personality** | Arrows that point, circles that annotate, stars that celebrate, wavy underlines, hatch shading, washi-tape strips. |
| **Readable first** | Marker face (**Caveat**) for titles & labels; a clean readable hand (**Patrick Hand**) for body; **Inter** only for dense data (tables/numbers). Long copy is never set in a hard-to-read script. |
| **Gentle motion** | Tiny wobble on hover, pop-in on appear — never slick or fast. Fully stilled under `prefers-reduced-motion`. |

It reads instantly as “sketchbook”, yet stays usable: AA contrast, visible focus
rings, full keyboard support, light **and** dark (chalkboard) themes.

---

## 2. File structure

```
theme-23-hand-drawn-sketch/
├── theme.css              ← single entry point (@imports everything in order)
├── tokens.css             ← primitive tokens (paper/ink/highlighter ramps, sketch motifs, scales)
├── semantic.css           ← semantic + component tokens (light + dark) → maps primitives
├── base.css               ← reset, handwriting type, paper texture, rough-border/doodle utils, layout, a11y
├── components/
│   ├── buttons.css        ← Button, ButtonGroup
│   ├── forms.css          ← Input/Textarea/Select/Checkbox/Radio/Toggle/Segmented/Slider/
│   │                         Stepper/Search/Rating/Combo/Chip/Calendar/FileUpload/Fieldset
│   ├── display.css        ← Card/StatCard/Badge/Avatar/Tooltip/Popover/Accordion/Tabs/Table/
│   │                         List/Timeline/KanbanCard/CodeBlock/Skeleton/EmptyState/Carousel
│   ├── feedback.css       ← Alert/Banner/Toast/Modal/Drawer/CommandPalette/Progress/Spinner/InlineNote
│   └── navigation.css     ← Navbar/Sidebar/Breadcrumb/Pagination/Menu/ContextMenu/Steps/Wizard
├── app.js                 ← all interactions (theme, doodle bursts, toast, modal, drawer, ⌘K,
│                             tabs, table sort, kanban DnD, wizard, calendar, carousel, …)
├── index.html             ← landing hub: whiteboard hero + token/motif viz + component gallery + page links
├── pages/                 ← assembled real-world demo screens (see §6)
├── README.md              ← you are here
└── CHECKLIST.md           ← implementation & accessibility self-audit
```

**Load order matters — link the one entry point:**

```html
<link rel="stylesheet" href="theme.css">       <!-- from root -->
<link rel="stylesheet" href="../theme.css">    <!-- from /pages -->
<script src="app.js"></script>                  <!-- or ../app.js, at end of body -->
```

Everything works by **double-clicking the HTML (file://)** — no build, no server,
no framework. Fonts load from Google Fonts online and fall back to readable
hand-style faces offline.

> **Tip — the rough-edge filter.** For true wobble on decorative elements
> (`.rough-edge`), each page includes a tiny inline `<svg>` with the `#roughpaper`
> turbulence filter. The core boxes don’t need it — their hand-drawn look comes
> from irregular `--radius-*` values, so text always stays crisp.

---

## 3. Token reference

Raw values live in `tokens.css`; never use them directly — go through the
semantic names in `semantic.css` so re-skinning stays a one-file job.

### Color ramps (primitive)
| Ramp | Signature | Role |
|------|-----------|------|
| `--paper-50…900` | `--paper-200 = #F7F1E3` | note-paper page & surfaces |
| `--ink-50…900` | `--ink-700 = #243042` | pen ink: text, borders, strokes |
| `--hl-yellow-50…900` | `300 = #FFE45C` | highlighter accent |
| `--hl-pink-50…900` | `300 = #FF9EC4` | highlighter accent |
| `--hl-mint-50…900` | `300 = #9EE6C4` | highlighter accent |
| `--pen-red/blue/green/orange/purple/teal` (+`-dark`) | — | status & chart pens |

### Sketch motif tokens
| Token | Purpose |
|-------|---------|
| `--paper-ruled` / `--paper-dotted` / `--paper-grid` | notebook / bullet / graph backgrounds |
| `--hatch-fill` (+`-light`) / `--crosshatch-fill` | pen-stroke shading fills |
| `--highlighter-mark` (recolor via `--hl-mark-color`) | the marker swipe behind text |
| `--hand-underline` | wavy hand-drawn underline (SVG) |
| `--doodle-arrow` / `--doodle-circle` / `--doodle-star` | decorative doodles (SVG) |
| `--rough-filter` (= `url(#roughpaper)`) | turbulence wobble for `.rough-edge` |
| `--sketch-shadow-sm/(base)/lg/pop` | hand-drawn offset shadows |

### Scales
Spacing `--space-0…16` · type `--text-2xs…6xl` + `--leading-*`/`--tracking-*`/`--weight-*` ·
**radii** `--radius-xs/sm/md/lg/xl/pill/bubble` (intentionally *irregular*) + `--radius-md-alt`/`--radius-round` ·
borders `--border-w-1…4`, `--border-1/2/3/dashed` · rings `--ring-ink/-pink/-mint/-blue` ·
z-index `--z-*` · breakpoints `--bp-*` · motion `--duration-*` + `--ease-standard/out/in/wobble`.

### Semantic roles (`semantic.css`)
`--color-bg(/-texture)`, `--color-surface(/-2/-3)`, `--color-text(/-muted/-subtle/-inverse)`,
`--color-primary` (ink) `(/-hover/-press/-fg)`, `--color-secondary` (pen-blue), `--color-accent`
(highlighter) `(/-hover/-fg/-pink/-mint)`, `--color-border(/-soft)`, `--color-divider`,
`--color-success/-warning/-danger/-info` (+ `-bg`/`-fg`), `--focus-ring-color`, `--color-scrim`,
`--hl-mark-color`, `--chart-1…6`. Component groups: `--btn-*`, `--card-*`, `--input-*`, `--badge-*`,
`--tooltip-*`, `--table-*`, `--nav-*`, `--sidebar-*`, `--modal-*`, `--toast-*`, `--progress-*`.

### Light & dark
**Light** = the canonical notebook page (cream paper, pen ink, highlighters).
**Dark** = a chalkboard — slate-green ground, chalk-white writing, pastel chalk accents;
`--ink` re-points to chalk-white so every rough border still reads, and highlighter
marks become translucent so chalk text stays legible. Toggle via the navbar button
(persists to `localStorage["sketch-theme"]`) or `document.documentElement.dataset.theme`.

---

## 4. Component catalogue

Every component ships its states, sizes & variants with ARIA + keyboard support.

**Forms** — Button (primary/secondary/accent/ghost/outline/danger × sm/md/lg ×
hover/active/disabled/loading × icon/block), ButtonGroup, Input, Textarea, Select,
Input-group, SearchBar, Checkbox (hand ✓), Radio, Toggle, SegmentedControl, Slider,
Stepper, Rating (doodle stars), Combobox/MultiSelect, ChipInput, Calendar/DatePicker,
FileUpload (dropzone), Fieldset.

**Display** — Card, StatCard, Badge/Tag (+ doodle-star), Avatar/AvatarGroup (+ status),
Tooltip (sketch speech bubble), Popover (sticky note), Accordion, Tabs (+ pills),
Table (sort · select · paginate), List, Timeline, KanbanCard, CodeBlock (copy),
Skeleton, EmptyState, Carousel.

**Feedback / overlay** — Alert, Banner, Toast (stacked, auto-dismiss), Modal/Dialog
(sm/lg, focus-trapped), Drawer (left/right), CommandPalette (⌘K), Progress (bar + ring,
hatch variant), Spinner, InlineNotification.

**Navigation** — Navbar, Sidebar (collapsible app-shell), Breadcrumb, Pagination,
Menu/Dropdown, ContextMenu, Steps (horizontal + vertical), Wizard.

---

## 5. JavaScript API (`app.js`)

Self-initialising via **event delegation on data-attributes** — no manual wiring,
works on dynamically-added DOM, safe over `file://`.

| Feature | Trigger | Notes |
|---------|---------|-------|
| Theme toggle | `[data-theme-toggle]` | flips `<html data-theme>`, persists `localStorage["sketch-theme"]` |
| **Doodle burst** | `[data-doodle]` / `[data-doodle="3"]` | spawns hand-drawn scribbles at the cursor on click |
| Toast | `[data-toast]` + `-title`/`-body`, or `window.sketchToast({type,title,body,duration})` | bottom-right stack, auto-dismiss |
| Modal | `[data-modal-open="id"]` / `[data-modal-close]` | ESC + scrim close, focus trap & restore |
| Drawer | `[data-drawer-open="id"]` / `[data-drawer-close="id"]` | paired scrim, ESC close |
| Command palette | `⌘K` / `Ctrl-K` / `[data-cmdk-open]` | filter, ↑/↓, Enter, `data-href`/`data-action` |
| Tabs / Accordion | `[role=tab]` (arrows) / `.accordion-trigger` (`data-single`) | |
| Menu / Context menu / Popover | `[data-menu]` / `[data-context-menu]` (right-click) / `[data-popover]` | outside-click close |
| Segmented / Button-group | `.segmented > button` (fires `segment-change`) / `.btn-group[data-toggle]` | |
| Slider / Stepper / Rating | `.slider input` / `.stepper [data-step]` / `.rating` | live value, clamp, star fill |
| Combo / Chip / Search | `.combo[data-multi]` / `[data-chip]` / `.searchbar` | filter, Enter/Comma chips, clear |
| Calendar / FileUpload | `[data-calendar][data-output]` / `.dropzone[data-file-list]` | month grid; drag-drop list |
| Carousel / Table / Kanban | `.carousel[data-autoplay]` / `.table[data-sortable]` / `[data-kanban]` | slide, sort+select, drag-drop |
| Wizard | `[data-wizard]` + `[data-wizard-next/back/done]` | syncs panels & `.steps`, toast on done |
| Progress | `.progress[data-value]` / `.progress-ring[data-value]` | auto fill / stroke |
| Scroll reveal / Copy / Sidebar | `[data-reveal]` (+`.stagger`) / `.code-copy` / `[data-sidebar-collapse]` | |

---

## 6. Demo pages (`pages/`)

Each is a fully-assembled, responsive, real-data screen — not a component list:

1. **dashboard.html** — Studio HQ analytics: stat cards, hand-drawn bar chart, progress-ring, sortable table.
2. **kanban.html** — sticky-note board with draggable cards across 4 columns.
3. **inbox.html** — 3-pane email/inbox layout.
4. **product.html** — maker-store product detail (a real sketchbook + pen kit).
5. **pricing.html** — 3 plans, monthly/yearly toggle, comparison table, FAQ.
6. **settings.html** — pill tabs + toggles + a red **DANGER ZONE** with confirm modal.
7. **onboarding.html** — Steps wizard told as a doodle-guided setup.
8. **profile.html** — “My Desk”: cover, avatar, tabs, timeline, sketches, edit drawer.
9. **404.html** — a lost-page doodle + comic empty state.

---

## 7. Re-skinning / replacement guide

Layered so you can retarget without touching components:

1. **Re-color the brand** → edit *only* `semantic.css`. e.g. make pink the accent:
   `:root { --color-accent: var(--hl-pink-300); }` — every highlight, focus, badge follows.
2. **Change a primitive ink** → edit the ramp in `tokens.css` (e.g. swap `--ink-700`); both themes update.
3. **Dial the sketchiness** → in `tokens.css`: rounder/calmer via the `--radius-*` values; softer borders via `--border-w-*`; lighter texture via `--paper-ruled`/`--paper-dotted`; flatter via `--sketch-shadow*`.
4. **Swap fonts** → replace `--font-display` / `--font-hand` / `--font-sans` (and the `@import` in `base.css`). Fallback stacks keep it readable offline.
5. **Dark mode** → already shipped (chalkboard); toggle in the navbar or set `data-theme`.
6. **Drop a component** → delete its `@import` line in `theme.css` and the file.

No component file references a raw ramp directly — every color flows through tokens,
so a re-skin is a tokens-only edit and dark mode keeps working automatically.

---

## 8. Accessibility

- **Contrast ≥ 4.5:1** for body text (ink on paper, ink on highlighters, white on pen colors).
  Script faces are limited to headers/labels; long copy uses the readable hand/sans.
- **Focus** — a solid ink (light: ink / dark: highlighter) `:focus-visible` ring on every focusable element.
- **Keyboard** — tabs (arrows), menus, command palette (↑/↓/Enter/Esc), modal/drawer focus-trap + Esc,
  wizard, accordion, rating, stepper all operable without a mouse.
- **ARIA** — dialogs use `role="dialog" aria-modal`, tabs use the tab/tabpanel pattern, toasts announce,
  decorative doodles / bursts / textures are `aria-hidden`; meaning always lives in text.
- **Reduced motion** — `@media (prefers-reduced-motion: reduce)` stills doodle bursts, wobble, pop-in,
  carousel autoplay and scroll reveals.
- **Skip link** — every page starts with a `.skip-link` to `#main`.

---

*No external CSS/JS frameworks. Pure CSS custom properties + vanilla JS. Inline SVG
for icons, doodles & motifs; textures via CSS gradients. Built to open with a double-click.*
