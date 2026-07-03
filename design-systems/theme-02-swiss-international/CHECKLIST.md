# CHECKLIST — Theme 02 · Swiss International

Self-audit of implementation + accessibility. Verified statically (grep/tag audits)
and by **headless Chromium render** (Google Chrome for Testing 147) of `index.html`
and all nine `pages/*.html` from `file://`. ✅ = verified · — = n/a.

---

## 1. Deliverables present

| File | Status |
|------|--------|
| `tokens.css` | ✅ full primitive set (neutral 50–900, red 50–900, space/type/leading/tracking/border/radius/shadow/z/bp/ring/motion/grid) |
| `semantic.css` | ✅ roles + component tokens, light **and** dark + `prefers-color-scheme` fallback |
| `base.css` | ✅ reset, typography, 12-col grid, baseline, layout utils, grid overlay |
| `components/` | ✅ 19 component stylesheets + `index.css` barrel |
| `theme.css` | ✅ single entry point (@imports all four layers) |
| `app.js` | ✅ 795 lines, `node --check` clean, all interactions |
| `index.html` | ✅ hub: token visuals + full component gallery + screen links |
| `pages/*.html` | ✅ 9 screens (dashboard, kanban, inbox, product, pricing, settings, onboarding, profile, 404) |
| `README.md` / `CHECKLIST.md` | ✅ |

---

## 2. Design DNA compliance (Swiss / International Typographic Style)

| Rule | Result |
|------|--------|
| Ground = white, text = ink `#0A0A0A` | ✅ |
| Exactly one accent — Swiss Red `#E2231A` | ✅ `--red-500`; status hues kept low-chroma |
| Hierarchy from type + grid, **not** colour | ✅ display sizes, weight, mono labels carry rank |
| **No rounded corners** | ✅ `--radius-*` all `0`; audit found 0 rounded rectangles (only `border-radius:50%` on the functional spinner) |
| **No drop shadows** | ✅ `--shadow-*` all `none`; audit found only `inset` hairline rings + 1px avatar separators (no blur, no elevation) |
| **No gradients / blur** | ✅ audit found 0 decorative `linear-gradient`; only functional `repeating-linear-gradient` hairline patterns (baseline lines, chart gridlines, image-placeholder hatch) |
| 1px hairline rules separate regions | ✅ `.border*`, `.rule`, `.divide-y`, component borders |
| Strict 12-column grid, 8px baseline, 24px gutter | ✅ `.grid` + `.col-*`/`.md-col-*`/`.lg-col-*`; grid overlay toggles via `g` / button |
| Mono numbered section labels (`01 — …`) | ✅ `.section-label`, `.overline` |
| Focus = red 2px outline; hover = underline / red shift, no movement | ✅ `:focus-visible` + component hovers |
| Square avatars | ✅ |

---

## 3. Components implemented

**Forms** ✅ Button (primary/secondary/ink/ghost/danger/icon × sm/md/lg ×
hover/active/disabled/loading) · ButtonGroup · Toolbar · Input · Textarea · Select ·
MultiSelect · Combobox/Autocomplete · Checkbox · Radio · Toggle · SegmentedControl ·
Slider · Stepper · DatePicker · Calendar · FileUpload · SearchBar · Rating · ChipInput.

**Display** ✅ Card · StatCard · StatStrip · Badge/Tag · Avatar/AvatarGroup · Tooltip ·
Popover · Accordion · Tabs (underline/bordered/vertical) · Table (sort/select/paginate) ·
List · Description list · Timeline · KanbanCard · CodeBlock · Skeleton · EmptyState · Carousel.

**Feedback & Overlay** ✅ Alert/Banner · Toast (stacked, auto-dismiss) ·
InlineNotification · Modal · Drawer · CommandPalette (⌘K) · Progress (bar + ring) · Spinner.

**Navigation** ✅ Navbar · Sidebar (collapsible) · Breadcrumb · Pagination ·
Menu/Dropdown · ContextMenu · Steps/Wizard (horizontal + vertical).

**Charts** ✅ hairline bar chart · line chart · sparkline · legend · proportion bar.

---

## 4. Interaction (app.js) — render-verified

`js-ready` class is added on the **last line** of the app.js IIFE, so its presence in the
post-load DOM proves the script initialised without throwing.

| Page | `js-ready` | JS console errors |
|------|:---------:|:-----------------:|
| index.html | ✅ | 0 |
| dashboard / kanban / inbox / product / pricing / settings / onboarding / profile / 404 | ✅ (all) | 0 (all) |

Behaviours wired & present: theme toggle (persisted) · grid overlay (`g`) · ⌘K command
palette (filter + arrow-nav) · modal (scrim, Esc, focus-trap) · drawer · toast stack ·
tabs (arrow roving) · accordion · segmented / billing toggle (price swap) · dropdown /
popover / context-menu (outside-click, Esc) · combobox · slider · stepper · rating ·
switch · table sort + select-all/row-select + bulk bar · kanban drag-and-drop ·
multi-step wizard · carousel · datepicker + live calendar renderer (verified: 60 day
cells generated on index) · copy-to-clipboard. No inline `onclick` anywhere.

---

## 5. Accessibility

| Check | Result |
|------|--------|
| Semantic landmarks (header/nav/main#main/aside/footer) | ✅ all pages |
| Skip-link to `#main` | ✅ all 9 pages + hub |
| `lang="en"` + responsive `viewport` (user-scalable, no max-scale) | ✅ all pages |
| Icon buttons have `aria-label` | ✅ |
| Widget roles/states (tab/tablist/tabpanel, dialog/aria-modal, listbox/option, menu/menuitem, aria-expanded/selected/sort/current) | ✅ per index.html patterns, reused on pages |
| Keyboard: Tab/Shift-Tab, arrows (tabs/menus/cmdk), Esc dismiss, focus trap in overlays | ✅ in app.js |
| Visible focus ring (red 2px) on every interactive element | ✅ `:focus-visible` |
| `prefers-reduced-motion` honoured (durations→0, transforms dropped) | ✅ tokens + per-component guards |
| `prefers-color-scheme` fallback when no theme chosen | ✅ semantic.css |
| Contrast ≥ 4.5:1 | ✅ ink `#0A0A0A` on white ≈ 19:1; white on red-500 ≈ 4.6:1; `--color-text-muted` (neutral-600 `#565656`) on white ≈ 7:1; dark-mode `#f2f2f2` on `#0a0a0a` ≈ 18:1 |

---

## 6. Portability / build constraints

| Check | Result |
|------|--------|
| Zero external CSS frameworks | ✅ pure CSS + custom properties |
| Renders & runs from `file://` (double-click) | ✅ headless render of all pages clean |
| Relative asset paths (`../theme.css`, `../app.js`) | ✅ link-integrity sweep: 0 broken local links across hub + 9 pages |
| ⌘K block paths corrected inside `pages/` (no `pages/…` prefix) | ✅ verified |
| Icons = inline thin-line SVG | ✅ |
| Web fonts (Inter / JetBrains Mono) | ✅ load online; graceful system grotesque/mono fallback offline (layout unaffected) |
| Responsive (360 / 768 / 1280) | ✅ sidebars collapse, multi-pane layouts stack, tables scroll-x, grids reflow |

---

## 7. Known notes (by design, not defects)

- The only `border-radius` is `50%` on the loading **spinner** — a functional circle, not
  a rounded rectangle. Everything structural is square.
- `repeating-linear-gradient` is used solely to draw **hairline patterns** (baseline grid,
  chart gridlines, placeholder hatch) — these render as lines, consistent with the DNA.
- Image areas use a hatched `.imgbox` placeholder (no binary assets shipped), so the system
  stays self-contained and double-click-runnable.
- Dark mode was render-verified separately: black ground, white text + hairlines, the same
  Swiss red — hairline aesthetic preserved.

**Conclusion:** production-scale, render-verified, DNA-compliant. No missing components,
no broken screens, no JS errors.
