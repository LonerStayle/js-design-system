# 🌅 VAPORWAVE — Design System (Theme 08)

> Nostalgia rendered as an interface. A production-grade, accessible, **zero-dependency**
> design system built on sunset gradients, endless perspective grids, VHS scanlines and
> chrome — pure CSS custom properties + vanilla JavaScript. Every HTML file runs by
> double-clicking it (`file://`); no build step, no server, no framework.

```
theme-08-vaporwave/
├── tokens.css            # primitive tokens — color ramps, sunset/grid/chrome FX, all scales
├── semantic.css          # semantic + component tokens; light/dark themes (dark default)
├── base.css              # reset, fonts, typography, THE vapor scene, layout utilities
├── styles.css            # single @import entry point (load just this on any page)
├── components/           # one CSS file per component family (12 files)
│   ├── button.css  form.css   choice.css  range.css  upload.css  picker.css
│   └── card.css    badge.css  disclosure.css table.css overlay.css nav.css
├── app.js                # all interactions + grid scroll/VHS + theme switch (vanilla)
├── index.html            # landing + token visuals + full component gallery hub
├── pages/                # 9 real, responsive demo screens
│   ├── dashboard.html  kanban.html   inbox.html    product.html  pricing.html
│   └── settings.html   onboarding.html profile.html 404.html
├── README.md             # ← you are here
└── CHECKLIST.md          # implementation + accessibility self-audit
```

**Scale:** 390 design tokens · 12 component files (~6,100 lines of CSS) · 873-line JS engine ·
1 hub + 9 demo screens (~4,200 lines of HTML).

---

## 1 · Design Philosophy

Vaporwave is a **mood**, not a gimmick: 80s/90s consumer-tech optimism filtered through faded
VHS tape and a synthwave sunset. The system commits to that mood hard and everywhere:

| Pillar | How it shows up |
| --- | --- |
| **Sunset, not flat color** | The page background *is* a sky — a magenta→purple→cyan gradient with a hot horizon glow. Never a flat fill. |
| **Endless grid** | A perspective grid floor converges to the horizon and slowly scrolls toward you. A banded retro **sun disc** rises behind it. |
| **VHS & chrome** | Soft scanlines, film grain, a subtle magenta/cyan **chromatic aberration** split on display headings, and glossy chrome-gradient text. |
| **Glossy glass** | Surfaces are translucent, blurred, medium-rounded (8–12px) with a top sheen and **neon glow** shadows — never flat grey drop-shadows. |
| **Neon focus** | Magenta/cyan glow rings on every focusable control; hover intensifies glow + aberration. |
| **Dark by default** | Deep-purple dusk is the home mood; a pale pastel **dawn** light theme is one toggle away. |

### Color DNA
- **Magenta / hot pink** `#FF6AD5` — the brand key & primary.
- **Purple / blueviolet** `#8A2BE2` — the twilight core.
- **Cyan** `#2DE2E6` — the cool neon accent.
- **Mint** `#05FFA1` — success / spring-green neon.
- Cool, lilac-tinted **neutrals** down to a `#0C0818` twilight-black (never pure grey).

### Typography
- **Display:** Orbitron (wide, retro-futurist) — headings, buttons, labels.
- **Serif accent:** Cormorant Garamond (italic) — statuesque pull-quotes & eyebrows.
- **Body:** Outfit — solid, high-contrast, readable.
- **Mono:** IBM Plex Mono — numbers, code, shortcuts.

Fonts load from Google Fonts via `@import` in `base.css`, each with a robust system fallback
stack so the page still renders offline.

---

## 2 · Getting Started

Open **`index.html`** in any modern browser (double-click works). To use the system in your
own page, link the single aggregator and the script:

```html
<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="stylesheet" href="styles.css" />   <!-- ../styles.css from inside pages/ -->
  <script src="app.js" defer></script>          <!-- ../app.js  from inside pages/ -->
</head>
<body>
  <!-- app.js auto-injects the fixed animated scene and wraps your content in .vapor-page -->
  <main id="main"> … </main>
</body>
</html>
```

`app.js` boots on `DOMContentLoaded`, injects the vapor scene, restores the saved theme, and
wires every component by class/`data-` attribute. Nothing else to call.

---

## 3 · Token Reference

All tokens are CSS custom properties. **Primitives** live in `tokens.css`; **semantic** and
**component** tokens in `semantic.css`. Re-theme by editing values — names are stable.

### Primitives (`tokens.css`)
| Group | Tokens |
| --- | --- |
| Color ramps | `--magenta-50…900`, `--purple-50…900`, `--cyan-50…900`, `--mint-50…900`, `--neutral-50…950`, plus `--amber/--coral/--sky-300…600` |
| Sunset FX | `--grad-sunset`, `--grad-sunset-light`, `--grad-sun-disc`, `--chrome-grad`, `--neon-text-grad` |
| Grid / scene | `--grid-floor-color`, `--grid-floor-color-2`, `--horizon-glow`, `--star-color` |
| Glitch | `--aberration-offset`, `--aberration-offset-strong`, `--scanline-opacity`, `--scanline-size`, `--grain-opacity`, `--gloss-sheen` |
| Type | `--font-display/-serif/-body/-mono`, `--text-2xs…7xl`, `--leading-*`, `--tracking-* (incl. widest)`, `--weight-*` |
| Spacing | `--space-0…16` (4px base) |
| Radius | `--radius-xs/sm/md/lg/xl/2xl/pill/full` (md = 10px) |
| Border | `--border-1/2/3` |
| Shadow | `--shadow-glow-sm/md/lg`, `--glow-magenta/cyan/mint/purple/coral`, `--shadow-inset-gloss` |
| Ring | `--ring-pink`, `--ring-cyan`, `--ring-width/offset` |
| Motion | `--duration-instant…slower`, `--ease-emphasized/standard/in/out/spring`, ambient speeds |
| System | `--z-below…max`, `--bp-xs…2xl`, `--container-max/wide/narrow` |

### Semantic (`semantic.css`)
`--color-bg` (the gradient sky) · `--color-bg-solid/-deep` · `--color-surface` /`-2`/`-3`
(glassy) · `--color-text` /`-strong`/`-muted`/`-subtle` · `--color-primary` (=magenta) /`-fg`
· `--color-accent` (=cyan) /`-fg` · `--color-secondary` · `--color-border` /`-strong`/`-neon`
· `--color-divider` · `--color-success/-warning/-danger/-info` (+ `-fg` / `-soft`) ·
`--color-overlay` · effect knobs `--fx-grid-floor/-horizon/-scanline/-sun/-page-grad/-vignette`.

### Component tokens
`--btn-*`, `--card-*`, `--input-*`, `--toggle-*`, `--tooltip/-popover-*`, `--table-*`,
`--modal-*`, `--nav-*`, `--sidebar-*`, `--progress-*` — each maps to the semantic layer so a
single change cascades everywhere.

### Theming
The active theme is set by `data-theme="dark|light"` on `<html>`. With **no** attribute the
system resolves to **dark**, but honours `prefers-color-scheme: light`. The persisted user
choice (localStorage `vw-theme`) wins. Toggle via any element with `data-theme-toggle`, or
`VW.setTheme('light')` / `VW.toggleTheme()`.

---

## 4 · Component Catalog

Every component is keyboard-operable with appropriate ARIA. Classes use a lowercase BEM-ish
convention (`.block__part`, `.block--modifier`).

**Forms** — `button.css` Button (primary/secondary/ghost/danger/icon × sm/md/lg ×
hover/active/disabled/loading), ButtonGroup · `form.css` Field, Input, Textarea, Select,
InputGroup, SearchBar · `choice.css` Checkbox, Radio, Switch, SegmentedControl · `range.css`
Slider, Stepper, Rating, Progress (bar/ring), Spinner · `upload.css` FileUpload (drag&drop),
ChipInput · `picker.css` Menu, Dropdown, ContextMenu, MultiSelect, Combobox/Autocomplete,
Calendar, DatePicker.

**Display** — `card.css` Card (glossy/interactive/gradient/flat), StatCard, retro Window ·
`badge.css` Badge, Tag, Avatar, AvatarGroup, Tooltip, Popover · `disclosure.css` Accordion,
Tabs (line/pill), Steps/Wizard, Breadcrumb · `table.css` Table (sort·select·sticky·striped),
Pagination, List, DescriptionList, Timeline, KanbanCard · `nav.css` Codeblock, Carousel.

**Feedback / Overlay** — `overlay.css` Modal/Dialog (+ retro-window skin), Drawer, Toast stack,
Alert/Banner, InlineNotification, CommandPalette (⌘K), Skeleton, EmptyState.

**Navigation** — `nav.css` Navbar (mobile-collapsing), Sidebar (collapsible) · `disclosure.css`
Breadcrumb, Steps · `table.css` Pagination · `picker.css` Menu/Dropdown, ContextMenu.

### JavaScript API (`window.VW`)
```js
VW.toast({ variant:'success', title:'Saved', message:'…', duration:4200 });
VW.openModal('id');   VW.closeModal('id');
VW.openDrawer('id');  VW.closeDrawer('id');
VW.openCommandPalette();
VW.setTheme('light'); VW.toggleTheme();
```
Declarative hooks (no JS to write): `data-modal-open`, `data-drawer-open`,
`data-modal-close`/`-drawer-close`, `data-toast` (+`-title`/`-msg`), `data-dropdown-trigger`,
`data-popover-trigger`, `data-context-menu`, `data-cmdk-open`, `data-theme-toggle`,
`data-sidebar-toggle`, `data-navbar-toggle`, `data-copy`, `data-calendar`, `data-reveal`,
`data-chip-input`. Extend the palette by setting `window.VW_COMMANDS = [{group,label,icon,href|action,shortcut}]` **before** `app.js` runs.

---

## 5 · Demo Screens (`pages/`)

1. **dashboard.html** — analytics: glossy KPI cards, an inline-SVG neon area chart, progress
   rings, a sortable/selectable transactions table, an activity timeline, filter drawer.
2. **kanban.html** — 4-column board of neon task cards, right-click context menu, new-task modal.
3. **inbox.html** — 3-pane mail (folders / list / reading pane), compose modal with chip-input To.
4. **product.html** — e-commerce detail: gallery carousel, variant pickers, reviews tabs, mini-cart drawer.
5. **pricing.html** — 3 plans, **CSS-only** monthly/yearly toggle, comparison table, FAQ accordion.
6. **settings.html** — 5 tabs (Profile/Account/Notifications/Billing/Danger Zone) + confirm modal.
7. **onboarding.html** — 4-step wizard with a live neon Steps indicator (page-local JS).
8. **profile.html** — banner, avatar, stat blocks, activity timeline, badges, edit drawer.
9. **404.html** — chromatic-aberration "404" hero + a gallery of EmptyState patterns.

---

## 6 · Swapping the Theme (re-skin guide)

The whole look pivots on a handful of tokens. To make it *your* brand:

1. **Recolor** — in `tokens.css`, retune the four ramps (`--magenta/--purple/--cyan/--mint
   -50…900`). Keep the 400-level as each ramp's "signature".
2. **Re-point semantics** — in `semantic.css`, `--color-primary` and `--color-accent` decide
   the neon pair; `--grad-sunset` / `--grad-sun-disc` decide the sky.
3. **Dial the FX** — tune `--aberration-offset`, `--scanline-opacity`, `--grain-opacity`,
   `--grid-scroll-speed`, `--sun-rise-speed` to taste (or to calm the motion down).
4. **Component knobs** — override any `--btn-*`/`--card-*`/`--input-*` token to restyle a
   component family without touching its CSS.

Example — turn the system "cyber-lime" in three lines:
```css
:root {
  --color-primary: var(--mint-400);
  --color-accent:  var(--cyan-400);
  --grad-sunset: linear-gradient(180deg, #04140f, #073, #0a5, #05ffa1);
}
```

---

## 7 · Accessibility & Safety

- **Contrast** — body/label text always resolves to a solid, opaque, ≥4.5:1 color. Gradient
  and chrome text is reserved for **large display headings only** and carries a solid
  text-shadow fallback if `background-clip:text` is unsupported.
- **Reduced motion** — `@media (prefers-reduced-motion: reduce)` freezes the grid scroll, sun
  rise, star twinkle, scanline roll, chrome shimmer, hover aberration and reveal animations;
  film grain is hidden. No flashing/strobing anywhere.
- **Focus** — every interactive element shows a visible magenta/cyan glow ring on
  `:focus-visible` (keyboard only).
- **State by color + icon/shape** — status never relies on hue alone (badges carry dots/icons,
  errors carry a warning glyph, trends carry ▲/▼).
- **Keyboard + ARIA** — tabs/menus/ratings/segmented use arrow keys; modal/drawer/⌘K trap focus,
  close on Esc/backdrop, and restore focus to the trigger. Roles and `aria-*` throughout.

See **CHECKLIST.md** for the full self-audit.

---

## 8 · Constraints honored

- **Zero external CSS/JS frameworks.** Pure CSS custom properties + vanilla JS. Icons are inline SVG.
- **Runs from `file://`** — every HTML renders and every interaction works on double-click.
- **Responsive** — fluid type, collapsing grids, mobile navbar/sidebar at the documented breakpoints.
- **Self-contained** — nothing outside `theme-08-vaporwave/` is read or written.
