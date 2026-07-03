# CHECKLIST — Theme 28 “Newsprint” (The Ledger)

Implementation & accessibility self-audit. Verified in Chromium at 1366px desktop
and 390px mobile, both Day and Night editions, via a local server + screenshots.

Legend: ✅ done & verified · ☑ implemented (spot-checked) · — n/a

---

## 1. Scope & Folder Rules
- ✅ All output written only inside `design-systems/theme-28-newsprint/`.
- ✅ No other `theme-*` folder read or written; no shared files touched.
- ✅ Folder structure matches spec (tokens / semantic / base / components / app.js / index / pages / README / CHECKLIST) + a `theme.css` bundle for convenience.

## 2. Tokens (`tokens.css`)
- ✅ Ramps `newsprint-neutral`, `ink`, `red-spot` — each `50…900`.
- ✅ Anchors: paper `#F1ECE3`, ink `#16130F`, red `#B81E1E`.
- ✅ Newspaper tokens: `--column-rule`, `--rule-heavy/--rule-thin` (+hairline/medium/banner), `--masthead*`, `--halftone-photo`, `--dateline-tracking`, `--paper-grain`, `--fold-line`, `--columns`, `--column-gap`.
- ✅ Spacing `--space-0…16` (dense). Type `--text-2xs…7xl`, `--leading-*`, `--tracking-*`, `--weight-*`.
- ✅ `--radius-* = 0` (all). Borders `--border-1/2/3`.
- ✅ Shadows minimal (`--shadow-flat` + hard offsets). `--z-*`, `--bp-*`, `--ring-red/--ring-black`, motion `--ease-*`/`--duration-*`.

## 3. Semantic + Component Tokens (`semantic.css`)
- ✅ Roles: bg / surface(+2,3,ink) / text(+strong,muted,subtle,invert) / primary(+fg) / accent(+fg,text) / border(+variants,column-rule) / success / warning / danger(=red) / info.
- ✅ Component token sets: btn, card, input, badge, table, pop, overlay, toast, nav, sidebar, track, focus-ring.
- ✅ **Light = Day Edition** (newsprint, canonical) and **Dark = Night Edition** (ink ground + paper type, brighter red). `auto` follows `prefers-color-scheme`.

## 4. Base / Layout (`base.css`)
- ✅ Reset, font-smoothing, selection, skip-link, focus-visible ring.
- ✅ Editorial type helpers: kicker (small-caps red), deck, byline, dateline, smallcaps, drop-cap, section-head.
- ✅ Rule system (`.rule*`), multi-column setting (`.columns-2…5`, justified + `hyphens:auto`), halftone (`.halftone`, `.halftone-plate`), masthead, article-header, pull-quote, fold-line.
- ✅ Layout primitives: container(+broadsheet/text), grid, broadsheet 12-col, stack/cluster/row/col, spacing utils.
- ✅ Responsive collapse (columns→1, grids→1) at 1024 / 768 / 480.

## 5. Components — coverage
**Forms** ✅ Button (primary/secondary/ghost/danger/icon × sm/md/lg × hover/active/disabled/loading), ButtonGroup, Input, Textarea, Select, MultiSelect/Combobox/Autocomplete, Checkbox, Radio, Toggle, SegmentedControl, Slider, Stepper, DatePicker, FileUpload, SearchBar, Rating, ChipInput.
**Display** ✅ Card (ruled article block), StatCard, Badge/Tag/SectionLabel, Avatar/AvatarGroup, Tooltip, Popover, Accordion, Tabs, Table (sort·select·paginate), List, DescriptionList, Timeline, KanbanCard, CodeBlock, Skeleton, EmptyState, Carousel, Calendar.
**Newspaper** ✅ Masthead, ArticleHeader, MultiColumnArticle, PullQuote, FigureWithCaption (halftone), IndexBox, WeatherStrip, Stamp, ChartBars, Sparkline, HBar, PriceTag, Ribbon, Folio.
**Feedback/Overlay** ✅ Alert/BreakingBand, Toast (stack), Modal/Dialog, Drawer, CommandPalette (⌘K), Progress (bar+ring), Spinner, InlineNotification.
**Nav** ✅ Navbar, Sidebar (collapsible), Breadcrumb, Pagination, Menu/Dropdown, ContextMenu, Steps/Wizard.

## 6. Interactions (`app.js`, vanilla, zero deps)
- ✅ Theme toggle + persistence + live dateline.
- ✅ Tabs (roving arrow keys), Accordion (single/multi), Segmented.
- ✅ Modal & Drawer (focus trap, ESC, scrim click, body scroll lock, focus restore).
- ✅ Toast API + triggers; Dropdown/Menu (outside-click close); ContextMenu (right-click, viewport-clamped).
- ✅ Command Palette: ⌘K/Ctrl-K open, filter, ↑/↓ + Enter, group hide, ESC.
- ✅ Slider readout, Stepper min/max, Rating, ChipInput, Combobox, Table sort + select-all, Carousel, Sidebar/Nav toggles, Copy, Progress-ring draw, scroll-reveal.
- ✅ Verified live: wizard advances (step→progress), kanban drag updates counts, inbox row marks read + decrements count, theme persists across pages.

## 7. Showcase Pages (10 + hub)
- ✅ `index.html` hub — masthead hero, token swatches, component gallery, editions, page links, typography.
- ✅ `front-page.html` (showpiece), `dashboard.html`, `kanban.html`, `inbox.html`, `product.html`, `pricing.html`, `settings.html`, `onboarding.html`, `profile.html`, `not-found.html`.
- ✅ Each links `../theme.css` + `../app.js`, includes a working ⌘K palette, filled with realistic data.
- ✅ All open via `file://` double-click; webfonts degrade to Georgia/Times offline.

## 8. Accessibility & Contrast (WCAG AA target 4.5:1)
Computed luminance-based ratios (Day Edition):

| Pair | Ratio | Pass |
|------|-------|------|
| Ink `#16130F` on paper `#F1ECE3` (body) | ≈ **15.8 : 1** | ✅ AAA |
| Muted ink `#4C463B` on paper (min muted) | ≈ **7.8 : 1** | ✅ AAA |
| Red text `#9E1818` on paper | ≈ 5.9 : 1 | ✅ AA |
| White `#FBF8F2` on red `#B81E1E` (breaking) | ≈ **6.35 : 1** | ✅ AA |
| Paper on red (knockout) | ≈ 5.4 : 1 | ✅ AA |
| Night: paper text `#F1ECE3` on ink `#14110D` | ≈ 14 : 1 | ✅ AAA |
| Night: red-300 accent text on ink ground | ≈ 5.0 : 1 | ✅ AA |

- ✅ Focus: visible 2px red (black on red surfaces) rings; never removed without replacement.
- ✅ Keyboard: tabs, accordion, menus, command palette, table sort, carousel, wizard, steppers all reachable/operable.
- ✅ `prefers-reduced-motion`: animations/transitions disabled; ticker & reveal pinned visible.
- ✅ No-JS / JS-failure safety: `[data-reveal]` forced visible unless `html.js` set — content never permanently hidden.
- ✅ State = colour **+** icon **+** text (badges, alerts, deltas, status pips).
- ✅ ARIA: `role="dialog"`+`aria-modal` on overlays, `role="tab/tablist/tabpanel"`, `aria-selected/expanded/current/sort`, `aria-live` on toast region, `aria-label` on icon-only buttons, skip link.
- ✅ Multi-column readability: capped measures, snug-but-readable leading, halftone kept out of running text.

## 9. Quality Constraints
- ✅ Zero external CSS frameworks. Pure CSS + custom properties; vanilla JS only.
- ✅ Icons are inline SVG; halftone via CSS/SVG dot screens (no raster images required).
- ✅ Every `.html` renders & functions from `file://`.
- ✅ Responsive: multi-column → single column at defined breakpoints; nav → hamburger; board → horizontal scroll; app shells stack on mobile (verified at 390px).
- ✅ README documents intent, token tables, component list, theming & swap guide.

## 10. Fixes applied during QA
- ✅ Added global no-JS / reduced-motion reveal safety net (`base.css` + `html.js` flag in `app.js`).
- ✅ Settings → Profile: avatar/file-upload overlap → compact inline “Change photo” control.
- ✅ 404: oversized numeral overflowed into correction text + referenced a non-existent `--color-ink` token → resized to fit its column, switched to `--color-text-strong`, widened the hero container.

## Known notes
- ☑ Webfonts load from Google Fonts; offline they fall back to Georgia/Times (graceful, on-theme).
- ☑ Drag-and-drop (kanban) uses native HTML5 DnD — pointer-based; not keyboard-reorderable (cards remain readable/operable, move is an enhancement).
- ☑ Browser may emit a verbose “password field not in a form” hint on settings — informational only, not an error.

*Audit complete. — 30 —*
