# Botanical Journal № 17 — Implementation & Accessibility Checklist

Self-audit of the design system against its brief. ✅ done · ⚠️ partial/note.

---

## 1. Folder & scope rules

- ✅ All output lives only in `design-systems/theme-17-botanical-journal/`.
- ✅ No other `theme-*` folder or shared file was read or written.
- ✅ Structure matches the brief: `tokens.css`, `semantic.css`, `base.css`, `components/`,
  `app.js`, `index.html`, `pages/`, `README.md`, `CHECKLIST.md`.

---

## 2. Design DNA — Botanical Journal

- ✅ Mood is natural / tidy / scholarly — a pressed-plant field journal. No neon, glass, or flat-modern.
- ✅ Palette: sage/olive/moss green (`#8a9a6b`, `#6e7a52`) + cream parchment (`#f4eedf`) + sepia ink (`#4a3f2e`). Low-saturation naturals only.
- ✅ Motifs: hand-drawn leaf / fern / flower / vine / sprig as **inline SVG** (pen-line, etching feel) — used on card corners, watermarks, dividers, empty states, hero plate.
- ✅ Specimen / herbarium labels (`.specimen-tag` with string-hole + tilt) and badge labels.
- ✅ Ink **hairline** borders (`--border-1`) and **double-rule** dividers (`.rule-double`, `.rule-sprig`).
- ✅ Small radii (`--radius-md` = 6px, within the 4–8px brief) and faint global paper grain (`--paper-texture`).
- ✅ Typography: Cormorant Garamond (display) + EB Garamond (body), oldstyle figures, small-caps labels, italic binomials.
- ✅ Signatures: corner sprig line-art on cards, specimen-label badges, ink double-hairlines, restrained ink-underline hover, moss-green 2px focus ring.

---

## 3. Tokens (names fixed, values per DNA)

### Primitive (`tokens.css`)
- ✅ Color ramps 50→900: `--green-*` (+950), `--parchment-*`, `--ink-*`, `--bloom-*` (mustard), `--rose-*` (dusty rose).
- ✅ Functional naturals: `--clay-500` (warning), `--berry-500` (danger), `--sky-500` (info).
- ✅ Botanical motif tokens: `--motif-leaf/-fern/-flower/-vine/-sprig`, `--paper-texture`, `--ink-hairline`.
- ✅ Spacing `--space-0…16`. Type `--text-2xs…6xl` + `--leading-*` (loose) + `--tracking-*`.
- ✅ Radii `--radius-sm/md` (small) + lg/pill. Border `--border-1` (hairline) …3.
- ✅ Shadows `--shadow-xs/sm/md/lg` + `--shadow-paper` (brown-toned, micro paper lift).
- ✅ Z-index scale, breakpoints, `--ring-*` (moss), motion (`--ease-standard`, `--duration-fast/base/slow` — quiet).

### Semantic (`semantic.css`)
- ✅ `--color-bg` (parchment) / surface / surface-2 / text (ink brown) / text-muted / primary (moss) / primary-fg / accent (bloom) / border (hairline) / success (sage) / warning / danger / info.
- ✅ Component tokens: `--btn-*`, `--card-*`, `--input-*`, `--badge-*`, `--table-*`, `--nav-*`, `--sidebar-*`, `--toast-*`, `--modal-*`, etc.
- ✅ **Light** (parchment, canonical) and **dark** (deep forest green ground, cream ink) both defined; motif strokes re-tinted for dark.

---

## 4. Components (all categories, with states/sizes/variants)

- ✅ **Forms**: Button (primary/secondary/ghost/accent/danger/icon × sm/md/lg × hover/active/disabled/loading), ButtonGroup, SegmentedControl, Input, Textarea, Select, Combobox/Autocomplete, Checkbox, Radio, Switch/Toggle, Slider, Stepper, SearchBar, Rating, ChipInput, FileUpload/Dropzone, MultiSelect (chip-token).
- ✅ **Display**: Card (botanical line decoration), StatCard, Badge/Tag (specimen-label style), Avatar/AvatarGroup/status, Tooltip, Popover, Accordion, Tabs, Table (sort · select · paginate · responsive), List, Timeline, KanbanCard, CodeBlock, Skeleton, EmptyState (plant illustration), Carousel, Calendar.
- ✅ **Feedback/overlay**: Alert/Banner, Toast (stacking), Modal/Dialog, Drawer, CommandPalette (⌘K), Progress (bar + circular ring), Spinner, InlineNotification.
- ✅ **Navigation**: Navbar, Sidebar (collapsible), Breadcrumb, Pagination, Menu/Dropdown, ContextMenu, Steps/Wizard, Tabs.
- ✅ Keyboard operation + ARIA on interactive components (tabs roving arrows, accordion `aria-expanded`, modal focus-trap + Esc, menu `aria-haspopup`, table `aria-sort`, switches/checks as native inputs, cmdk arrow/enter/esc).

---

## 5. Showcase (multi-page, real assembly)

- ✅ `index.html` hub: field-note hero, token + motif visuals, live component gallery, links to all pages.
- ✅ `pages/` demo screens, responsive, filled with realistic botanical data:
  1. ✅ Analytics dashboard (natural-tone widgets + table + CSS charts)
  2. ✅ Kanban board (drag & drop)
  3. ✅ Email/inbox 3-pane
  4. ✅ E-commerce product detail (plant/gardening store)
  5. ✅ Pricing (3 plans, monthly/annual toggle)
  6. ✅ Settings (tabs + toggles + danger zone)
  7. ✅ Onboarding wizard (Steps)
  8. ✅ Profile / account
  9. ✅ 404 + empty states (plant illustration)
- ✅ Interactions (modal/drawer/toast/tabs/toggle/⌘K/dark-mode) work via vanilla `app.js`.

> Pages 4/6/7/8 are produced by isolated sub-builders against a shared class/hook contract; all
> reference the same shared CSS + `app.js`, so visual + behavioural consistency holds.

---

## 6. Accessibility

- ✅ **Contrast** — primary text `--ink-600` on parchment `--color-bg` ≈ **8.9:1**; muted `--ink-500` ≈ **6.7:1**; link/`--green-700` ≈ **5.5:1**; all clear 4.5:1. No pale-green body text. Dark theme uses cream `#ece4d0` on `#181d12` ≈ **12:1**.
- ✅ **Decorative plant art** is `aria-hidden="true"` (motifs, hero plate, empty-state illustrations, corner sprigs).
- ✅ **Status = color + icon + text** (alerts, toasts, badges all pair an icon/label with the hue).
- ✅ **Focus** — global moss-green 2px `:focus-visible` ring with offset; custom controls (checkbox/radio/switch/segmented) show the ring via `--focus-ring`.
- ✅ **Reduced motion** — `@media (prefers-reduced-motion: reduce)` collapses animations/transitions, disables skeleton shimmer, and short-circuits count-up & smooth-scroll in JS.
- ✅ Skip-link on every page; semantic landmarks (`header`/`main`/`footer`/`nav`), `aria-label`s on icon buttons, `role`/`aria-modal` on overlays, `aria-live` on the toast stack.

---

## 7. Quality bar

- ✅ Contrast ≥ 4.5:1, keyboard focus ring, reduced-motion, ARIA/roles.
- ✅ **Zero external CSS/JS frameworks** — pure CSS custom properties + vanilla JS only.
- ✅ Plant motifs & all icons are **inline SVG** (no icon font, no image files).
- ✅ Every `.html` renders & operates from `file://` (double-click), `../`-relative asset paths from `pages/`.
- ✅ Responsive breakpoints: grids collapse, sidebar collapses/stacks, tables go card-stacked (`.table--responsive`), carousels scroll, wizard/split layouts stack.
- ✅ README documents intent, token tables, component list, and a re-skin guide; this CHECKLIST records the audit.

---

## 8. Known notes / limitations

- ⚠️ Web fonts load from Google Fonts (`@import` in `base.css`). Offline, the stack degrades to local
  oldstyle serifs (Hoefler Text / Palatino / Georgia) — the journal mood is preserved but exact
  letterforms differ.
- ⚠️ Contrast figures are computed for the canonical token pairings; if you re-map semantic tokens to
  different ramp steps during re-skinning, re-verify the new pairings.
- ⚠️ Charts are presentational (static CSS/SVG sized by inline values), not data-bound — by design, as
  this is a design-system showcase, not an app backend.
- ⚠️ Drag-and-drop (Kanban) uses the native HTML5 DnD API; on touch-only devices it falls back to a
  non-draggable but fully readable board.

*Audit complete — № 17, pressed & catalogued.*
