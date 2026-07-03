# Scandinavian Hygge — Design System (theme-15)

> Warm, calm, functional. An off-white cream canvas, muted earth tones, soft
> rounding and plenty of room to breathe. Built as **pure CSS + vanilla JS** —
> zero frameworks, zero build step. Every `.html` opens and works from
> `file://` on a double-click.

---

## 1. Design philosophy

**Hygge** (Danish: cosy contentment) is the whole brief. The system aims to feel
like a sunlit room with oak, linen and ceramic — never cold, never loud.

| Principle | How it shows up |
|---|---|
| **Warm minimalism** | Cream background (`#F6F2EC`), warm-white cards, low visual noise, generous whitespace. |
| **Muted earth palette** | Sage green, terracotta, dusty blue, oatmeal/warm-grey. Low saturation, warm bias. No neon, no hard contrast. |
| **Soft, natural form** | Restrained rounding (`--radius-md` = 12px), gentle warm-toned shadows, a faint pure-CSS linen/paper grain over the page. |
| **Friendly humanist type** | **Fraunces** (soft serif) for display, **Hanken Grotesk** for body/UI. Soft hierarchy, loose restful leading. |
| **Calm motion** | Gentle easings, short durations, hover = soft lift / tone shift, focus = earth-toned ring. Fully honours `prefers-reduced-motion`. |
| **Accessible despite muted tones** | Body & label text is always dark enough for **≥4.5:1**. States use **colour + icon/text**, never colour alone. |

---

## 2. File structure

```
theme-15-scandinavian-hygge/
├── tokens.css            Primitive tokens (raw colour ramps, scales — no meaning)
├── semantic.css          Semantic + component tokens; light & dark themes
├── base.css              Reset, typography, layout utilities, texture, a11y
├── components/
│   ├── buttons.css       Button, ButtonGroup, icon, loading
│   ├── forms.css         Input, Textarea, Select, Checkbox, Radio, Switch,
│   │                     SegmentedControl, Slider, Stepper, SearchBar,
│   │                     ChipInput, FileUpload, Rating, Combobox, DatePicker
│   ├── cards.css         Card, StatCard, KanbanCard, feature tile
│   ├── data-display.css  Badge/Tag, Avatar(Group), Table, List, Timeline,
│   │                     CodeBlock, Skeleton, EmptyState, Carousel, Calendar
│   ├── feedback.css      Alert/Banner, Toast, Modal, Drawer, CommandPalette,
│   │                     Progress (bar/ring), Spinner, Tooltip, Popover
│   └── navigation.css    Navbar, Sidebar, Breadcrumb, Pagination, Menu/Dropdown,
│                         ContextMenu, Tabs, Accordion, Steps/Wizard
├── app.js                All interactions + theme switching (vanilla, delegated)
├── index.html            Landing + token visuals + component gallery hub
├── pages/                9 real, responsive demo screens (+ _shell.css)
│   ├── _shell.css        Shared app-shell layout + pure-CSS chart helpers
│   ├── dashboard.html    Analytics (stat cards, CSS charts, sortable table)
│   ├── kanban.html       Drag-and-drop board
│   ├── inbox.html        Three-pane email client
│   ├── product.html      E-commerce product detail (home & living)
│   ├── pricing.html      3 plans, monthly/yearly toggle, compare table, FAQ
│   ├── settings.html     Tabs + toggles + danger zone
│   ├── onboarding.html   4-step wizard
│   ├── profile.html      Account profile with cover, stats, timeline
│   └── not-found.html    404 + empty-states gallery
├── README.md
└── CHECKLIST.md          Implementation & accessibility self-audit
```

### How to view
Open `index.html` in any modern browser (double-click — no server needed).
Fonts load from Google Fonts when online; offline they fall back to a system
humanist stack, so layout and behaviour are unaffected.

---

## 3. Token reference

### 3.1 Layers
`tokens.css` (primitives) → `semantic.css` (meaning + components) → `base.css` /
`components/*` (consumption). **Only ever consume semantic/component tokens in
markup.** To retheme, change the primitives once and everything re-tunes.

### 3.2 Colour ramps (primitives, 50→900)
| Ramp | Role | Signature stop |
|---|---|---|
| `--warm-neutral-*` | cream / oatmeal / warm grey / ink | `100` `#F6F2EC` bg · `900` `#2A241E` ink |
| `--sage-*` | **primary / success** | `400` `#9DAE96` · `600` `#5C7053` |
| `--terracotta-*` | **accent / warning** | `400` `#C98B6B` · `600` `#9C5E3C` |
| `--dusty-blue-*` | **info** | `400` `#8AA1B1` · `600` `#566F7E` |
| `--clay-*` | **danger** (muted brick, warmer than pure red) | `600` `#8C3D2D` |

### 3.3 Semantic tokens (excerpt)
| Token | Light | Meaning |
|---|---|---|
| `--color-bg` | `#F6F2EC` | page cream |
| `--color-surface` | `#FFFDF9` | warm-white card |
| `--color-surface-2/3` | oatmeal / deeper well | sunken panels |
| `--color-text` | `#2A241E` | warm ink (13.8:1) |
| `--color-text-muted` | warm-neutral-700 | secondary text (6.9:1) |
| `--color-text-subtle` | `#736654` | captions (5.0:1) |
| `--color-primary` (+`-hover/-active/-fg/-soft/-soft-fg`) | sage | brand actions |
| `--color-accent` | terracotta | emphasis |
| `--color-success / warning / danger / info` | sage / terracotta / clay / dusty-blue | status (each has `-soft` + `-soft-fg` + `-border`) |
| `--color-border` | warm-neutral-300 | soft hairline |
| `--color-ring` | sage @ 45% | focus ring |

Every status colour ships a **soft** background + a **soft-fg** text pairing that
is itself ≥4.5:1, so tinted badges/alerts stay readable.

### 3.4 Scales
- **Spacing** `--space-0 … --space-16` (4px base, generous).
- **Type** `--text-2xs … --text-6xl`; `--leading-*` (loose); `--tracking-*`.
- **Radius** `--radius-xs/sm/md/lg/xl/2xl/pill`.
- **Shadow** `--shadow-xs/sm/md/lg/xl` (warm brown, low-alpha) + `--shadow-inset`.
- **Motion** `--ease-standard/out/in/soft`, `--duration-instant…slower`.
- **Z-index**, **breakpoints** (`--bp-sm…2xl`), **rings** (earth-toned).

### 3.5 Component tokens
Buttons (`--btn-*`), cards (`--card-*`), inputs (`--input-*`), tints
(`--tint-hover/-selected/-press`), tooltip, scrollbar, and a 6-colour chart
palette (`--chart-1…6`).

---

## 4. Component catalogue

**Forms** — Button (primary/secondary/ghost/soft/danger/accent/icon × sm/md/lg ×
hover/active/disabled/loading), ButtonGroup, Input, Textarea, Select, MultiSelect,
Combobox/Autocomplete, Checkbox (+indeterminate), Radio, Toggle/Switch,
SegmentedControl, Slider, Stepper, DatePicker, FileUpload (dropzone), SearchBar,
Rating, ChipInput.

**Display** — Card (warm/soft + hover/flush/accent-top), StatCard, Badge/Tag,
Avatar/AvatarGroup (+presence), Tooltip, Popover, Accordion, Tabs (+pill),
Table (sortable, row-select, pagination footer), List, Timeline, KanbanCard,
CodeBlock (+copy), Skeleton, EmptyState, Carousel, Calendar.

**Feedback / overlay** — Alert/Banner, Toast (stacking, auto-dismiss, variants),
Modal/Dialog (focus-trap, ESC), Drawer (left/right), CommandPalette (⌘K),
Progress (linear + circular), Spinner / dots loader, InlineNotification.

**Navigation** — Navbar, Sidebar (collapsible + mobile off-canvas), Breadcrumb,
Pagination, Menu/Dropdown, ContextMenu, Steps/Wizard (horizontal + vertical),
Tabs.

Each interactive component carries the appropriate **ARIA roles/attributes** and
**keyboard support** (see CHECKLIST).

---

## 5. JavaScript API (`app.js`)

`app.js` is dependency-free and uses **event delegation + declarative
`data-*` attributes**, so any page that loads it gets working components for free.

| Attribute | Effect |
|---|---|
| `data-theme-toggle` | Toggle light/dark (persisted in `localStorage`, OS-aware default). |
| `data-modal-open="id"` / `data-modal-close` | Open/close a `.modal` (scrim, ESC, focus-trap, focus-restore). |
| `data-drawer-open="id"` / `data-drawer-close` | Open/close a `.drawer`. |
| `data-toast='{"title","msg","variant"}'` | Push a toast (`variant`: success/danger/warning/info). |
| `data-command-open` / `⌘K` `Ctrl-K` | Open the command palette (`window.HYGGE_COMMANDS` to customise). |
| `data-dropdown-toggle` | Toggle the `.menu` inside a `.dropdown`. |
| `data-sidebar-toggle="id"` / `data-sidebar-open="id"` | Collapse (desktop) / off-canvas (mobile). |
| `data-tabs` + `role="tab"`/`aria-controls` | Accessible tabs with arrow-key nav. |
| `data-accordion-single` + `.accordion-trigger` | Accordion (single-open variant). |
| `data-wizard` + `data-step-next/-prev` + `[data-step-panel]` | Multi-step wizard, updates `.step` dots + progress bar. |
| `th.sortable`, `[data-row-check]`, `[data-select-all]` | Table sorting + row selection. |
| `input[type=range][data-output]` | Live slider value. |
| `.stepper [data-inc]/[data-dec]` · `.rating` · `.chip-input` | Steppers, star rating, tag input. |
| `.carousel` | Prev/next + dot navigation. |
| `data-copy` / `.code-block .cb-copy` | Copy to clipboard + confirmation toast. |
| `data-reveal` | Scroll-reveal (skipped under reduced-motion). |
| `data-price-toggle` + `data-price-monthly/-yearly` | Pricing monthly↔yearly switch. |

Programmatic: `window.hygge.toast({...})`, `window.hygge.theme.toggle()`.

---

## 6. Theming / swap guide

**A. Re-tint the whole system** — edit the primitive ramps in `tokens.css`. e.g.
to make the brand terracotta instead of sage, you don't even need new colours —
just repoint the semantic layer:
```css
/* semantic.css */
:root {
  --color-primary: var(--terracotta-500);
  --color-primary-hover: var(--terracotta-600);
  --color-primary-fg: #fff;
  --color-primary-soft: var(--terracotta-100);
  --color-primary-soft-fg: var(--terracotta-700);
  --color-ring: var(--ring-terracotta);
}
```
Everything (buttons, links, focus rings, active nav, charts) follows.

**B. Add a brand colour** — add a new `--myhue-50…900` ramp in `tokens.css`, then
map it to a semantic token. Keep the chosen text/`-soft-fg` pairing ≥4.5:1
(use the formula in CHECKLIST §A).

**C. Adjust roundness / density** — change `--radius-md` and the `--space-*`
scale; components inherit.

**D. Fonts** — swap the `@import` in `base.css` and the `--font-display` /
`--font-body` tokens. The system fallback stack keeps things humanist offline.

**E. Dark theme** — already provided (`[data-theme="dark"]` + a
`prefers-color-scheme` fallback). It's a warm cabin-at-dusk: brown-charcoal
surfaces, accents lifted to the 300/400 range for contrast.

---

## 7. Constraints honoured
- **No external CSS/JS frameworks.** Pure CSS + token variables; vanilla JS.
- **Icons are inline SVG** (`stroke="currentColor"`), no icon fonts/CDN.
- **Runs from `file://`** — every page double-clickable, no build/server.
- **Responsive** across the documented breakpoints.
- Scoped entirely to this folder; no other `theme-*` folder is read or written.

See **CHECKLIST.md** for the full implementation & accessibility audit.
