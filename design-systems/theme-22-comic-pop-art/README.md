# 💥 Theme 22 — Comic Pop Art Design System

> A flat-ink, halftone, action-burst design system built like a single panel of a comic book. Thick black outlines on **everything**, Ben-Day dot shading, speech bubbles, and "POW!" star badges. Production-grade tokens, a full component library, and nine assembled demo screens — all pure CSS + vanilla JS, zero frameworks, and every file opens straight from `file://` with a double-click.

---

## 1. Design Philosophy

Comic Pop Art is **loud, exaggerated, and unmistakably hand-inked**. It is the opposite of calm minimalism: no gradients, no soft drop-shadows, no timid pastels. Instead it leans on the visual grammar of mid-century comic books and Roy Lichtenstein pop art.

**The mood**: a single comic-book panel — energetic, playful, larger-than-life.

**Six signature moves (the DNA):**

| Move | What it is | Where it shows up |
|------|-----------|-------------------|
| **Thick black outline** | 3–4px ink border on every surface | buttons, cards, inputs, badges, panels |
| **Ben-Day halftone** | CSS radial-dot shading | shaded fills, progress bars, skeletons, backgrounds |
| **Speech bubble** | rounded body + ink tail | tooltips, callouts, onboarding story cells |
| **Thought bubble** | pill body + puff trail | popovers, "thinking" empty states |
| **Action burst** | multi-point star ("POW!") | badges, click feedback, hero flags |
| **Speed lines** | radiating / streaking hatch | hero backgrounds, "zoom" energy on hover |

**Color** is strictly **flat primary ink**: Comic Red `#E8222B`, Pop Yellow `#FFD400`, Comic Blue `#1E6FE8`, plus black ink and paper white. **Shadows** are hard offset (`5px 5px 0 #000`) — printed, never blurred. **Motion** pops and bounces (`cubic-bezier(.2,1.6,.4,1)` overshoot) rather than easing smoothly.

**Typography** pairs a comic letterer display face (**Bangers / Luckiest Guy**, with **Black Han Sans** as the Hangul display face) used only on titles and action words, with a **bold, highly-readable sans** (**Nunito** for Latin, **Gothic A1** for Hangul) for all body copy — comic display faces are never used for running text, to protect readability. The hub and all nine demo screens ship in Korean (`lang="ko"`, `word-break: keep-all`), with in-app JS strings (toasts, palette, calendar) localized too.

---

## 2. File Structure

```
theme-22-comic-pop-art/
├── tokens.css            Primitive tokens — color ramps, comic motifs, scales
├── semantic.css          Semantic + component tokens (light & dark)
├── base.css              Reset, typography, halftone/panel/bubble/burst utils
├── theme.css             ⭐ Single entry point — @imports everything in order
├── components/
│   ├── buttons.css       Button, ButtonGroup
│   ├── forms.css         Inputs, Select, Checkbox, Radio, Toggle, Slider,
│   │                     Stepper, Combobox/MultiSelect/ChipInput, DatePicker,
│   │                     FileUpload, SearchBar, Rating, SegmentedControl
│   ├── display.css       Card, StatCard, Badge, Avatar, Tooltip, Popover,
│   │                     Accordion, Tabs, Table, List, Timeline, KanbanCard,
│   │                     CodeBlock, Skeleton, EmptyState, Carousel
│   ├── feedback.css      Alert/Banner, Toast, Modal, Drawer, CommandPalette,
│   │                     Progress (bar + ring), Spinner, InlineNotification
│   └── navigation.css    Navbar (+ injected mobile off-canvas), Breadcrumb,
│                         Pagination, Menu, ContextMenu, Steps/Wizard
├── app.js                All interactions (vanilla JS, self-initializing)
├── index.html            Hub — comic cover hero + token/motif viz + gallery
├── pages/
│   ├── dashboard.html    #1 Analytics dashboard (pop widgets, table, charts)
│   ├── kanban.html       #2 Kanban board (panel gutters, drag & drop)
│   ├── inbox.html        #3 Email / inbox (three-panel)
│   ├── product.html      #4 E-commerce product detail (comic goods store)
│   ├── pricing.html      #5 Pricing table (3 plans, month/year toggle)
│   ├── settings.html     #6 Settings (tabs + toggles + danger zone)
│   ├── onboarding.html   #7 Onboarding wizard (Steps, comic-panel story)
│   ├── profile.html      #8 Profile / account
│   └── 404.html          #9 404 + empty-state collection ("OOPS!" burst)
├── README.md             (this file)
└── CHECKLIST.md          Implementation & accessibility self-audit
```

### How to use it

**One include gives you the whole system:**

```html
<!-- from the theme root -->
<link rel="stylesheet" href="theme.css">
<script src="app.js"></script>

<!-- from inside /pages -->
<link rel="stylesheet" href="../theme.css">
<script src="../app.js"></script>
```

`theme.css` `@import`s the five layers in the correct cascade order. No build step, no bundler — just double-click any `.html`.

---

## 3. Token Reference

### Color ramps (primitives, `tokens.css`)

Each primary has a full **50 → 900** ramp; signature value noted.

| Ramp | Signature | Notes |
|------|-----------|-------|
| `--red-50…900` | `--red-500 = #E8222B` | hero ink, primary, danger |
| `--yellow-50…900` | `--yellow-400 = #FFD400` | accent, highlights, focus (dark) |
| `--blue-50…900` | `--blue-500 = #1E6FE8` | secondary, info, links |
| `--neutral-50…900` | `50 = paper #fff`, `900 = ink #0a0a09` | outlines, text, surfaces |
| extras | `--green-500 --orange-500 --purple-500 --pink-500 --cyan-500` | chart series & accents |

### Comic motif tokens

| Token | Purpose |
|-------|---------|
| `--halftone-dots` / `--halftone-red` / `--halftone-blue` / `--halftone-yellow` | Ben-Day dot background-images |
| `--speed-lines` / `--speed-streaks` | radiating & horizontal motion hatch |
| `--action-burst` | star `clip-path` polygon for POW badges |
| `--comic-outline` / `--comic-outline-thick` / `--comic-outline-hair` | the universal ink stroke |
| `--panel-gutter` (+ `-sm` / `-lg`) | gap between comic panels |
| `--speech-bubble-tail-size`, `--thought-bubble-puff` | bubble part sizing |

### Scales

- **Spacing** `--space-0 … --space-16` (0 → 200px)
- **Type sizes** `--text-2xs … --text-7xl`; line-heights `--leading-*`; tracking `--tracking-*`; weights `--weight-normal…black`
- **Radii** `--radius-xs/sm/md/lg/xl/pill/bubble` (md = 8px, the comic mid-round)
- **Borders** `--border-2/3/4` + raw `--border-w-*`
- **Shadows** `--shadow-comic-xs/sm/(base)/lg/xl/pop` + colored `--shadow-red/blue/yellow` (all hard-offset, zero blur)
- **Rings** `--ring-red/yellow/blue/ink` with `--ring-width` / `--ring-offset`
- **Z-index** `--z-base … --z-burst` (1800)
- **Breakpoints** `--bp-xs…2xl`
- **Motion** `--duration-instant…pop`; eases `--ease-emphasized` (overshoot pop), `--ease-bounce`, `--ease-snap`, `--ease-out/in`

### Semantic roles (`semantic.css`)

`--color-bg` · `--color-bg-dots` · `--color-surface` / `-2` / `-3` · `--color-text` / `-muted` / `-subtle` / `-inverse` · `--color-primary` (+ hover/press/fg) · `--color-secondary` · `--color-accent` · `--color-border` · `--color-divider` · `--color-success` / `--warning` / `--danger` / `--info` (each + `-bg` / `-fg`) · `--focus-ring-color` · `--color-scrim`.

**Component tokens** are namespaced: `--btn-*`, `--card-*`, `--input-*`, `--badge-*`, `--tooltip-*`, `--table-*`, `--nav-*`, `--modal-*`, `--toast-*`, `--cmdk-*`, `--progress-*`, `--chart-1…6`.

### Light & Dark

Both themes ship. **Light** = paper white + subtle yellow dot atmosphere, black ink outlines. **Dark** = black newsprint where the *ink outline inverts to bright paper* so panels still read as cut-out cells, and the primary inks pop off the void. Toggle with `data-theme="light|dark"` on `<html>`; `app.js` persists the choice in `localStorage` and respects `prefers-color-scheme` on first load.

---

## 4. Component Catalogue

**Forms** — Button (primary/secondary/accent/ghost/outline/danger/icon × sm/md/lg × hover-pop/active-press/disabled/loading), ButtonGroup, Input, Textarea, Select, MultiSelect, Combobox/Autocomplete, Checkbox, Radio, Toggle/Switch, SegmentedControl, Slider, Stepper, DatePicker (calendar), FileUpload (dropzone), SearchBar, Rating, ChipInput.

**Display** — Card (panel + halftone), StatCard, Badge/Tag (+ star-burst), Avatar/AvatarGroup (+ status), Tooltip (speech bubble), Popover (thought bubble), Accordion, Tabs (+ pills), Table (sort · select · paginate), List, Timeline, KanbanCard, CodeBlock, Skeleton, EmptyState, Carousel.

**Feedback / Overlay** — Alert/Banner (action words), Toast (stacked speech bubbles), Modal/Dialog (panel pop, focus-trapped), Drawer, CommandPalette (⌘K), Progress (bar + circular, halftone variants), Spinner (+ loading dots), InlineNotification.

**Navigation** — Navbar (with an auto-injected hamburger + off-canvas link panel below 880px, so every page keeps a nav path on mobile), Breadcrumb, Pagination, Menu/Dropdown, ContextMenu, Steps/Wizard (horizontal + vertical).

Every interactive component ships with **keyboard support and ARIA** — see CHECKLIST.md for the per-component audit.

### Interaction hooks (`app.js`, data-attribute driven)

| Attribute | Effect |
|-----------|--------|
| `data-theme-toggle` | flip light/dark (persisted) |
| `data-burst="WORD!"` | spawn an action-burst at the element on click |
| `data-toast` / `-title` / `-body` | fire a toast (`success`/`info`/`warning`/`danger`) |
| `data-modal-open="id"` / `data-modal-close` | open/close modal |
| `data-drawer-open="id"` / `data-drawer-close="id"` | open/close drawer |
| `data-menu="id"` / `data-popover="id"` / `data-context-menu="id"` | overlays |
| `data-cmdk-open` (or ⌘K / Ctrl-K) | command palette (`role="listbox"` + `role="option"`, ↑/↓/Enter) |
| `data-sortable` + `th.sortable` + `data-row-select` / `data-select-all` | table behaviors |
| `data-billing-toggle` + `data-price-month/-year` + `data-price-note` | pricing switch |
| `data-wizard` + `data-wizard-panel/-next/-back/-done` | multi-step wizard |
| `data-reveal` | scroll-reveal pop (auto-disabled under reduced-motion) |
| `data-kanban` + `data-kanban-col` | drag-and-drop board |

`window.comicToast({type,title,body,duration})` is exposed for programmatic toasts.

---

## 5. Swapping the Theme (re-skin guide)

Because every value flows through tokens, you can re-brand without touching component CSS:

1. **Change the inks** — edit the three primary ramps in `tokens.css` (`--red-*`, `--yellow-*`, `--blue-*`). Keep the 50→900 structure.
2. **Re-point roles** — in `semantic.css`, `--color-primary` can map to red *or* blue; `--color-accent` to yellow; status colors are role aliases. Change them in one place.
3. **Dial the comic-ness** — soften by raising `--radius-md`, thinning `--border-w-3`, or reducing `--shadow-comic` offset. Make it louder by doing the opposite.
4. **Swap fonts** — replace `--font-display` / `--font-action` / `--font-body` (and the `@import` in `base.css`). The fallback stacks keep it readable offline.
5. **Halftone density** — globally adjust `--halftone-size` / `--halftone-color`, or per-surface override the same variables on a parent.

No component file references a raw ramp value directly — they only read semantic/component tokens, so a re-skin is a tokens-only edit.

---

## 6. Accessibility & Quality

- **Contrast ≥ 4.5:1** on text over primaries (black on yellow, white on red/blue — verified in CHECKLIST.md).
- **Halftone** is kept off running-text backgrounds; used only for shading/decoration so body copy stays crisp.
- **Decorative** action words & bursts are `aria-hidden`; meaning is always carried by real text.
- **`prefers-reduced-motion`** stops speed lines, bounces, jitter, and scroll reveals.
- **Focus rings** are solid 4px primary-ink outlines, always visible on keyboard nav.
- **Keyboard + ARIA** on tabs (arrow roving), menus, dialogs (focus trap, ESC, restore), command palette, accordion, wizard, table.
- **Zero external CSS frameworks.** Pure CSS + custom properties; all icons & motifs are inline SVG / CSS — no image assets, no network needed.
- **`file://` ready** — double-click any HTML; fonts gracefully fall back if offline.

See **CHECKLIST.md** for the full self-audit results.
