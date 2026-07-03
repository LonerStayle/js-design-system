# THE LEDGER — Theme 28 · “Newsprint”

> *A daily-of-record design system. Warm newsprint paper, ink black, one red spot.*
> Right angles, rules instead of boxes, dense multi-column setting. No framework — pure CSS tokens + vanilla JS.

---

## 1. Design Philosophy

The Ledger is what happens when a newsroom style guide meets a modern component
library. It borrows the discipline of the printed page — the broadsheet — and
translates it into tokens, rules and components that render anywhere a browser does.

**The five commitments**

| Principle | How it shows up |
|-----------|-----------------|
| **Authority & density** | Information is the luxury, not whitespace. Tight type, packed columns, high data-ink. |
| **Paper + ink + one red** | Achromatic by default (warm newsprint `#F1ECE3`, ink `#16130F`) with a single editorial red `#B81E1E` reserved for the masthead flourish, breaking band and danger. |
| **Rules, not boxes** | Structure is drawn with horizontal rules and vertical column rules — heavy section rules, hairline alleys. Shadows are nearly absent; every `--radius` is `0`. |
| **Real typesetting** | Condensed didone/slab headlines (Playfair Display, Zilla Slab); a readable serif body (Source Serif 4) set **justified + hyphenated** in columns; small-caps kickers; oldstyle figures; a monospace (IBM Plex Mono) for data and datelines. |
| **Two editions** | **Day Edition** (light, the canonical newsprint) and **Night Edition** (dark — pressed-ink ground, paper-coloured type, a brighter red). |

**Signature moves:** masthead nameplate · kicker → headline → deck → byline → dateline
hierarchy · CSS/SVG halftone photo screens · pull quotes between heavy rules ·
hover = ink/red underline · focus = red (or black) 2px outline.

---

## 2. File Structure

```
theme-28-newsprint/
├── theme.css            ← single import bundle (link this one file)
├── tokens.css           ← primitive tokens (ramps, scales, newspaper motifs)
├── semantic.css         ← role + component tokens (light & dark editions)
├── base.css             ← reset, typography, column/rule system, layout utils, masthead
├── components/
│   ├── buttons.css      Button (5 variants × 3 sizes × states), ButtonGroup
│   ├── forms.css        Input, Textarea, Select, Checkbox, Radio, Toggle, Segmented,
│   │                    Slider, Stepper, SearchBar, FileUpload, Rating, ChipInput,
│   │                    Combobox/Autocomplete, DatePicker
│   ├── cards.css        Card, StatCard, KanbanCard, EmptyState
│   ├── badges.css       Badge/Tag, SectionLabel, Count, Avatar/AvatarGroup
│   ├── table.css        Table (sort/select/paginate), List, DescriptionList, Pagination
│   ├── disclosure.css   Accordion, Tabs
│   ├── navigation.css   Navbar, Sidebar, Breadcrumb, Steps/Wizard, Menu/Dropdown, ContextMenu
│   ├── feedback.css     BreakingBand, Alert, InlineNotification, Toast, Progress (bar/ring),
│   │                    Spinner, Skeleton
│   ├── overlays.css     Modal/Dialog, Drawer, Tooltip, Popover, CommandPalette (⌘K)
│   ├── misc.css         Timeline, CodeBlock, Carousel, Calendar, Kbd, Scrollbar
│   └── newspaper.css    Masthead extras, MultiColumnArticle, FigureWithCaption, IndexBox,
│                        WeatherStrip, Stamp, ChartBars, Sparkline, HBar, PriceTag, Ribbon, Folio
├── app.js               ← all interactions + theme toggle (vanilla, zero deps, self-init)
├── index.html           ← hub: masthead hero + token visuals + component gallery + page links
├── pages/               ← 10 production demo screens (see §6)
├── README.md            ← this file
└── CHECKLIST.md         ← implementation & accessibility self-audit
```

Load order matters — always `tokens → semantic → base → components`. `theme.css`
does this for you; just `<link rel="stylesheet" href="theme.css">` (use `../theme.css`
from inside `pages/`).

---

## 3. Token Reference

### Colour ramps (`tokens.css`)
Each ramp runs `50 → 900`.

| Ramp | Anchor | Role |
|------|--------|------|
| `--newsprint-neutral-50…900` | `200` = `#F1ECE3` (the paper) | page, surfaces, rules-on-paper, faint print |
| `--ink-50…900` | `800` = `#16130F` (press black) | text, primary actions, knockout panels |
| `--red-spot-50…900` | `500` = `#B81E1E` (spot red) | masthead flourish, breaking, danger, accents |

Helpers: `--paper-white #FBF8F2`, `--press-black #0B0906`.

### Newspaper motif tokens
`--rule-hairline/thin/medium/heavy/banner`, `--column-rule`, `--columns`,
`--column-gap`, `--masthead-rule`, `--halftone-photo` (CSS dot-screen),
`--paper-grain`, `--fold-line`, `--dateline-tracking`, `--kicker-tracking`.

### Typography
- Families: `--font-masthead` (Playfair Display), `--font-head` (Zilla Slab),
  `--font-body` (Source Serif 4), `--font-ui` (Zilla Slab), `--font-mono` (IBM Plex Mono).
  All degrade to Georgia / Times so `file://` renders offline.
- Scale: `--text-2xs … --text-7xl` (11px → 104px).
- `--leading-none…loose`, `--tracking-tightest…widest`, `--weight-regular…black`.

### Spacing / shape / motion
- `--space-0 … --space-16` (dense; 0 → 128px).
- `--radius-* = 0` (all), `--border-1/2/3` (rule weights).
- `--shadow-flat` (none) + `--shadow-hair/lift/press/cut` (hard editorial offsets only).
- `--ring-red`, `--ring-black`, `--ring-width 2px`, `--focus-ring` composites.
- `--ease-standard/in/out/mech`, `--duration-instant…slow`.
- `--z-*` scale, `--bp-sm…2xl` breakpoints, `--measure-broadsheet/page/text`.

### Semantic roles (`semantic.css`)
`--color-bg / surface / surface-2 / surface-3 / surface-ink`,
`--color-text / text-strong / text-muted / text-subtle / text-invert`,
`--color-primary(+fg,hover) / accent(+fg,hover,text)`,
`--color-border / border-strong / border-muted / column-rule / rule-heavy`,
`--color-success / warning / danger / info` (+ `-bg`, `-fg`),
`--color-scrim`, `--color-selection-*`. Component tokens: `--btn-*`, `--card-*`,
`--input-*`, `--badge-*`, `--table-*`, `--pop-*`, `--overlay-*`, `--toast-*`,
`--nav-*`, `--sidebar-*`, `--track-*`.

---

## 4. Theming (Day / Night)

Theme is driven by `data-theme` on `<html>`:

```html
<html data-theme="light">  <!-- Day Edition (default/canonical) -->
<html data-theme="dark">   <!-- Night Edition -->
<html data-theme="auto">   <!-- follow prefers-color-scheme -->
```

`app.js` persists the choice to `localStorage` and wires every
`[data-theme-toggle]` button. Programmatic: `Ledger.setTheme('dark')`.

To **retheme the whole system**, you only edit `semantic.css` — remap the role
tokens (e.g. point `--color-accent` at a different ramp). To **change the palette**,
edit the three ramps in `tokens.css`; everything downstream follows.

---

## 5. Using Components

Markup-only — link `theme.css` + `app.js` and write the classes. Examples:

```html
<!-- Button -->
<button class="btn btn--primary">Send to Press</button>
<button class="btn btn--danger btn--sm">Spike</button>

<!-- Article block -->
<article class="card card--ruled">
  <span class="kicker">Business</span>
  <h3 class="card__title">Markets Close Higher</h3>
  <p class="card__body">…</p>
</article>

<!-- Multi-column article -->
<div class="article-body is-columned" style="--columns:3">
  <p class="drop-cap">…</p><p>…</p>
</div>

<!-- Modal (JS-wired) -->
<button class="btn btn--primary" data-modal-open="m1">Open</button>
<div class="modal" id="m1" role="dialog" aria-modal="true" hidden> … </div>
```

### JS behaviour hooks (auto-initialised on DOM ready)
`data-theme-toggle`, `data-command-open`, `data-nav-toggle="id"`,
`data-sidebar-toggle="id"`, `data-modal-open/close`, `data-drawer-open/close`,
`data-toast` (+`-title`,`-variant`), `data-dropdown` + `data-dropdown-toggle`,
`data-context-menu="id"`, `data-tooltip`, `data-segmented`, `data-carousel`
(+ `data-carousel-prev/next`), `data-sortable` (+ `data-select-all`,
`data-row-check`, `th data-type="number"`), `data-combobox`, `data-copy`,
`data-reveal` (scroll fade-in), `data-dateline` (auto today’s date),
`.progress-ring[data-value]`, stepper `[data-step-up/down]`.

### Public API (`window.Ledger`)
`toast({title,text,variant,timeout})`, `openModal(id)`, `closeModal(id)`,
`openDrawer(id)`, `closeDrawer(id)`, `setTheme('light'|'dark'|'auto')`.

---

## 6. Demo Pages (`pages/`)

| # | File | Screen |
|---|------|--------|
| 10★ | `front-page.html` | **The Front Page** — broadsheet showpiece (masthead, multi-column lead, halftones, many stories) |
| 1 | `dashboard.html` | **Analytics Desk** — sidebar shell, statcards + sparklines, charts, sortable table, goals, timeline |
| 2 | `kanban.html` | **The Story Board** — 5-column kanban with HTML5 drag-and-drop, new-story drawer |
| 3 | `inbox.html` | **The Wire** — 3-panel mail (folders / list / reading pane), compose modal |
| 4 | `product.html` | **Pressroom Goods** — e-commerce detail (gallery, options, reviews, related) |
| 5 | `pricing.html` | **Subscription Plans** — 3 tiers, month/annum toggle, comparison table, FAQ |
| 6 | `settings.html` | **The Settings Desk** — vertical tabs, toggles, danger zone w/ confirm modal |
| 7 | `onboarding.html` | **New Subscriber** — 4-step wizard with live progress |
| 8 | `profile.html` | **Staff Profile** — byline page, statcards, tabbed bylines/activity/about/awards |
| 9 | `not-found.html` | **404 + Empty States** — errata-style 404 and an empty-states gallery |

Every page is responsive (multi-column → single column), keyboard-operable, and
runs from `file://` by double-click (webfonts degrade to Georgia/Times offline).

### Previewing
Double-click any `.html`, **or** serve the folder:
```bash
cd theme-28-newsprint && python3 -m http.server 8000
# → http://localhost:8000/index.html
```

---

## 7. Accessibility

- Ink-on-newsprint body contrast ≈ **15.8:1**; muted text ≥ 7.8:1; white-on-red
  6.35:1; paper-on-red 5.4:1 — all ≥ WCAG AA. (See `CHECKLIST.md`.)
- Visible focus rings (red, or black on red surfaces), keyboard nav for tabs,
  accordion, menus, command palette, table sort, carousel, wizard.
- `prefers-reduced-motion` respected (animations/transitions disabled; reveals
  shown immediately). Scroll-reveal degrades to fully-visible without JS.
- State conveyed by **colour + icon + text**, never colour alone.
- ARIA roles/labels on dialogs, tablists, status regions, icon-only buttons.

---

## 8. Swapping / Extending

1. **New palette** → edit the 3 ramps in `tokens.css`.
2. **New role mapping or a third edition** → add a `[data-theme="…"]` block in `semantic.css`.
3. **New component** → add `components/your-thing.css`, consume role tokens only,
   add an `@import` line to `theme.css`. Keep radius 0, lean on rules over shadows.
4. **New page** → copy the `<head>` + navbar + footer + command-palette boilerplate
   from any file in `pages/`, link `../theme.css` and `../app.js`.

---

*Set in Playfair Display, Zilla Slab, Source Serif 4 & IBM Plex Mono. — 30 —*
