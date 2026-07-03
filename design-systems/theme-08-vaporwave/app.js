/* ============================================================================
   THEME 08 — VAPORWAVE  ·  app.js
   ----------------------------------------------------------------------------
   One vanilla-JS module that powers every interaction in the system:
     · injects the animated vapor scene (sky/sun/grid/scanlines)
     · light/dark theme switch (persisted) + subtle pointer parallax
     · tabs · accordion · segmented · dropdown/menu · context-menu · popover
     · modal · drawer · toast stack · ⌘K command palette
     · table sort + row-select · pagination · stepper · rating · slider bubble
     · chip-input · file-upload · carousel · calendar/datepicker
     · sidebar collapse · navbar mobile · copy buttons · scroll reveal
   No dependencies. Works from file://. Honours prefers-reduced-motion.
   Public API exposed on `window.VW`.
   ========================================================================== */
(function () {
  "use strict";

  const REDUCE_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.prototype.slice.call(ctx.querySelectorAll(sel));
  const on = (el, ev, fn, opt) => el && el.addEventListener(ev, fn, opt);
  const isMac = /Mac|iPhone|iPad/.test(navigator.platform);

  /* ---------------------------------------------------------------------- */
  /* 1 · VAPOR SCENE — inject the fixed animated background if absent        */
  /* ---------------------------------------------------------------------- */
  function injectScene() {
    if ($(".vapor-scene")) return;
    const scene = document.createElement("div");
    scene.className = "vapor-scene";
    scene.setAttribute("aria-hidden", "true");
    scene.innerHTML =
      '<div class="vapor-stars"></div>' +
      '<div class="vapor-sun"></div>' +
      '<div class="vapor-horizon"></div>' +
      '<div class="vapor-grid"></div>' +
      '<div class="vapor-scanlines"></div>' +
      '<div class="vapor-grain"></div>';
    document.body.insertBefore(scene, document.body.firstChild);

    // wrap remaining body content so it sits above the scene (z-index)
    if (!$(".vapor-page")) {
      const page = document.createElement("div");
      page.className = "vapor-page";
      while (scene.nextSibling) page.appendChild(scene.nextSibling);
      document.body.appendChild(page);
    }
  }

  // gentle pointer parallax on the sun / grid (off under reduced-motion)
  function initParallax() {
    if (REDUCE_MOTION) return;
    const sun = $(".vapor-sun"), grid = $(".vapor-grid");
    if (!sun) return;
    let raf = null;
    on(window, "pointermove", (e) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        const dx = (e.clientX / window.innerWidth - 0.5);
        const dy = (e.clientY / window.innerHeight - 0.5);
        sun.style.setProperty("transform", `translateX(calc(-50% + ${dx * -22}px)) translateY(${dy * -10}px)`);
        if (grid) grid.style.setProperty("--px", (dx * 30).toFixed(1) + "px");
        raf = null;
      });
    });
  }

  /* ---------------------------------------------------------------------- */
  /* 2 · THEME — dark (default) / light, persisted                           */
  /* ---------------------------------------------------------------------- */
  const THEME_KEY = "vw-theme";
  function getTheme() {
    return document.documentElement.getAttribute("data-theme") ||
      (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
  }
  function applyTheme(t) {
    document.documentElement.setAttribute("data-theme", t);
    try { localStorage.setItem(THEME_KEY, t); } catch (e) {}
    $$("[data-theme-toggle]").forEach((b) => {
      b.setAttribute("aria-pressed", String(t === "light"));
      const lbl = b.querySelector("[data-theme-label]");
      if (lbl) lbl.textContent = t === "light" ? "Dawn" : "Dusk";
    });
    document.dispatchEvent(new CustomEvent("vw:themechange", { detail: { theme: t } }));
  }
  function toggleTheme() { applyTheme(getTheme() === "light" ? "dark" : "light"); }
  function initTheme() {
    let stored = null;
    try { stored = localStorage.getItem(THEME_KEY); } catch (e) {}
    if (stored) applyTheme(stored);
    else applyTheme(getTheme());
    document.addEventListener("click", (e) => {
      const t = e.target.closest("[data-theme-toggle]");
      if (t) { e.preventDefault(); toggleTheme(); }
    });
  }

  /* ---------------------------------------------------------------------- */
  /* 3 · FOCUS TRAP helper (modal / drawer / cmdk)                           */
  /* ---------------------------------------------------------------------- */
  const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';
  function trapFocus(container, e) {
    const f = $$(FOCUSABLE, container).filter((el) => el.offsetParent !== null);
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  /* ---------------------------------------------------------------------- */
  /* 4 · MODAL                                                               */
  /* ---------------------------------------------------------------------- */
  let lastFocused = null;
  function openOverlay(el) {
    lastFocused = document.activeElement;
    el.classList.add("is-open");
    el.removeAttribute("hidden");
    document.body.style.overflow = "hidden";
    const focusTarget = el.querySelector("[autofocus]") || $$(FOCUSABLE, el)[0];
    if (focusTarget) setTimeout(() => focusTarget.focus(), 30);
  }
  function closeOverlay(el) {
    el.classList.remove("is-open");
    document.body.style.overflow = "";
    if (lastFocused && lastFocused.focus) lastFocused.focus();
    const others = $$(".modal-backdrop.is-open, .drawer-backdrop.is-open, .cmdk-backdrop.is-open");
    if (!others.length) document.body.style.overflow = "";
  }
  function initModals() {
    document.addEventListener("click", (e) => {
      const opener = e.target.closest("[data-modal-open]");
      if (opener) {
        const m = document.getElementById(opener.getAttribute("data-modal-open"));
        if (m) { e.preventDefault(); openOverlay(m); }
        return;
      }
      const closer = e.target.closest("[data-modal-close]");
      if (closer) {
        const m = closer.closest(".modal-backdrop");
        if (m) closeOverlay(m);
        return;
      }
      // click on backdrop (outside dialog) closes
      if (e.target.classList.contains("modal-backdrop") && e.target.classList.contains("is-open")) {
        closeOverlay(e.target);
      }
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        const open = $(".modal-backdrop.is-open");
        if (open) { closeOverlay(open); return; }
      }
      if (e.key === "Tab") {
        const open = $(".modal-backdrop.is-open .modal__dialog") || $(".modal-backdrop.is-open");
        if (open) trapFocus(open, e);
      }
    });
  }

  /* ---------------------------------------------------------------------- */
  /* 5 · DRAWER                                                              */
  /* ---------------------------------------------------------------------- */
  function initDrawers() {
    document.addEventListener("click", (e) => {
      const opener = e.target.closest("[data-drawer-open]");
      if (opener) {
        const d = document.getElementById(opener.getAttribute("data-drawer-open"));
        if (d) { e.preventDefault(); openOverlay(d); }
        return;
      }
      const closer = e.target.closest("[data-drawer-close]");
      if (closer) { const d = closer.closest(".drawer-backdrop"); if (d) closeOverlay(d); return; }
      if (e.target.classList.contains("drawer-backdrop") && e.target.classList.contains("is-open")) {
        closeOverlay(e.target);
      }
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") { const o = $(".drawer-backdrop.is-open"); if (o) closeOverlay(o); }
      if (e.key === "Tab") { const o = $(".drawer-backdrop.is-open .drawer__panel"); if (o) trapFocus(o, e); }
    });
  }

  /* ---------------------------------------------------------------------- */
  /* 6 · TOAST stack — VW.toast({title,message,variant,duration})            */
  /* ---------------------------------------------------------------------- */
  const ICONS = {
    success: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
    warning: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 9v4M12 17h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/></svg>',
    danger:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6M9 9l6 6"/></svg>',
    info:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>',
  };
  function toastRegion() {
    let r = $(".toast-region");
    if (!r) {
      r = document.createElement("div");
      r.className = "toast-region";
      r.setAttribute("role", "region");
      r.setAttribute("aria-label", "Notifications");
      r.setAttribute("aria-live", "polite");
      document.body.appendChild(r);
    }
    return r;
  }
  function toast(opts) {
    opts = opts || {};
    const variant = opts.variant || "info";
    const dur = opts.duration == null ? 4200 : opts.duration;
    const r = toastRegion();
    const t = document.createElement("div");
    t.className = "toast toast--" + variant;
    t.setAttribute("role", variant === "danger" ? "alert" : "status");
    t.innerHTML =
      '<span class="toast__icon">' + (ICONS[variant] || ICONS.info) + '</span>' +
      '<div class="toast__content">' +
        (opts.title ? '<div class="toast__title">' + esc(opts.title) + '</div>' : '') +
        (opts.message ? '<div class="toast__msg">' + esc(opts.message) + '</div>' : '') +
      '</div>' +
      '<button class="toast__close" aria-label="Dismiss">&times;</button>' +
      (dur > 0 ? '<span class="toast__progress"></span>' : '');
    r.appendChild(t);
    const remove = () => {
      t.classList.add("toast--leaving");
      setTimeout(() => t.remove(), REDUCE_MOTION ? 0 : 280);
    };
    on(t.querySelector(".toast__close"), "click", remove);
    if (dur > 0) {
      const bar = t.querySelector(".toast__progress");
      if (bar && !REDUCE_MOTION) {
        bar.style.transition = `width ${dur}ms linear`;
        requestAnimationFrame(() => (bar.style.width = "0%"));
      }
      setTimeout(remove, dur);
    }
    return { dismiss: remove };
  }
  function esc(s) { const d = document.createElement("div"); d.textContent = s == null ? "" : String(s); return d.innerHTML; }

  function initToastDemos() {
    document.addEventListener("click", (e) => {
      const b = e.target.closest("[data-toast]");
      if (!b) return;
      e.preventDefault();
      toast({
        variant: b.getAttribute("data-toast") || "info",
        title: b.getAttribute("data-toast-title") || "Signal received",
        message: b.getAttribute("data-toast-msg") || "Transmission logged to the grid.",
      });
    });
  }

  /* ---------------------------------------------------------------------- */
  /* 7 · TABS — ARIA + arrow keys                                            */
  /* ---------------------------------------------------------------------- */
  function initTabs() {
    $$(".tabs").forEach((tabs) => {
      const tabEls = $$('[role="tab"], .tabs__tab', tabs);
      const select = (tab) => {
        tabEls.forEach((t) => {
          const sel = t === tab;
          t.setAttribute("aria-selected", String(sel));
          t.classList.toggle("is-active", sel);
          t.tabIndex = sel ? 0 : -1;
          const panelId = t.getAttribute("aria-controls");
          if (panelId) {
            const panel = document.getElementById(panelId);
            if (panel) { panel.hidden = !sel; panel.classList.toggle("is-active", sel); }
          }
        });
      };
      tabEls.forEach((t, i) => {
        on(t, "click", (e) => { e.preventDefault(); select(t); t.focus(); });
        on(t, "keydown", (e) => {
          let ni = null;
          if (e.key === "ArrowRight" || e.key === "ArrowDown") ni = (i + 1) % tabEls.length;
          else if (e.key === "ArrowLeft" || e.key === "ArrowUp") ni = (i - 1 + tabEls.length) % tabEls.length;
          else if (e.key === "Home") ni = 0;
          else if (e.key === "End") ni = tabEls.length - 1;
          if (ni != null) { e.preventDefault(); select(tabEls[ni]); tabEls[ni].focus(); }
        });
      });
    });
  }

  /* ---------------------------------------------------------------------- */
  /* 8 · ACCORDION                                                           */
  /* ---------------------------------------------------------------------- */
  function initAccordions() {
    $$(".accordion").forEach((acc) => {
      const single = acc.hasAttribute("data-single");
      $$(".accordion__trigger", acc).forEach((trig) => {
        on(trig, "click", () => {
          const item = trig.closest(".accordion__item");
          const panel = $(".accordion__panel", item);
          const open = trig.getAttribute("aria-expanded") === "true";
          if (single && !open) {
            $$(".accordion__trigger", acc).forEach((t) => {
              t.setAttribute("aria-expanded", "false");
              const p = $(".accordion__panel", t.closest(".accordion__item"));
              if (p) p.hidden = true;
              t.closest(".accordion__item").classList.remove("is-open");
            });
          }
          trig.setAttribute("aria-expanded", String(!open));
          if (panel) panel.hidden = open;
          item.classList.toggle("is-open", !open);
        });
      });
    });
  }

  /* ---------------------------------------------------------------------- */
  /* 9 · SEGMENTED control                                                   */
  /* ---------------------------------------------------------------------- */
  function initSegmented() {
    $$(".segmented").forEach((seg) => {
      const opts = $$(".segmented__option", seg);
      opts.forEach((o, i) => {
        on(o, "click", () => {
          opts.forEach((x) => { x.setAttribute("aria-checked", "false"); x.classList.remove("is-active"); });
          o.setAttribute("aria-checked", "true"); o.classList.add("is-active");
          seg.dispatchEvent(new CustomEvent("vw:change", { detail: { value: o.dataset.value || o.textContent.trim(), index: i } }));
        });
        on(o, "keydown", (e) => {
          let ni = null;
          if (e.key === "ArrowRight") ni = (i + 1) % opts.length;
          else if (e.key === "ArrowLeft") ni = (i - 1 + opts.length) % opts.length;
          if (ni != null) { e.preventDefault(); opts[ni].click(); opts[ni].focus(); }
        });
      });
    });
  }

  /* ---------------------------------------------------------------------- */
  /* 10 · DROPDOWN / MENU + CONTEXT MENU + POPOVER                           */
  /* ---------------------------------------------------------------------- */
  function closeAllPanels(except) {
    $$(".dropdown__panel.is-open, .popover.is-open, .context-menu.is-open").forEach((p) => {
      if (p !== except) {
        p.classList.remove("is-open");
        const trig = p.closest(".dropdown") && $(".dropdown__panel", p.closest(".dropdown"));
        const t = p.parentElement && p.parentElement.querySelector('[aria-expanded="true"]');
        if (t) t.setAttribute("aria-expanded", "false");
      }
    });
  }
  function initDropdowns() {
    document.addEventListener("click", (e) => {
      const trig = e.target.closest("[data-dropdown-trigger]");
      if (trig) {
        e.preventDefault();
        const dd = trig.closest(".dropdown");
        const panel = dd && $(".dropdown__panel", dd);
        if (panel) {
          const open = panel.classList.contains("is-open");
          closeAllPanels();
          if (!open) {
            panel.classList.add("is-open");
            trig.setAttribute("aria-expanded", "true");
            const first = $$('.menu__item, [role="menuitem"]', panel)[0];
            if (first) setTimeout(() => first.focus && first.focus(), 20);
          }
        }
        return;
      }
      // popover toggles
      const pTrig = e.target.closest("[data-popover-trigger]");
      if (pTrig) {
        e.preventDefault();
        const pop = document.getElementById(pTrig.getAttribute("data-popover-trigger"));
        if (pop) { const open = pop.classList.contains("is-open"); closeAllPanels(); if (!open) pop.classList.add("is-open"); pTrig.setAttribute("aria-expanded", String(!open)); }
        return;
      }
      if (!e.target.closest(".dropdown__panel, .popover, .context-menu")) closeAllPanels();
    });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeAllPanels(); });

    // menu item arrow-key navigation
    $$(".menu, .dropdown__panel").forEach((menu) => {
      on(menu, "keydown", (e) => {
        const items = $$('.menu__item:not([aria-disabled="true"]), [role="menuitem"]', menu);
        const idx = items.indexOf(document.activeElement);
        if (e.key === "ArrowDown") { e.preventDefault(); (items[idx + 1] || items[0]).focus(); }
        else if (e.key === "ArrowUp") { e.preventDefault(); (items[idx - 1] || items[items.length - 1]).focus(); }
      });
    });

    // context menus
    $$("[data-context-menu]").forEach((host) => {
      const menu = document.getElementById(host.getAttribute("data-context-menu"));
      if (!menu) return;
      on(host, "contextmenu", (e) => {
        e.preventDefault();
        closeAllPanels();
        menu.classList.add("is-open");
        const x = Math.min(e.clientX, window.innerWidth - menu.offsetWidth - 8);
        const y = Math.min(e.clientY, window.innerHeight - menu.offsetHeight - 8);
        menu.style.left = x + "px"; menu.style.top = y + "px";
      });
    });
  }

  /* ---------------------------------------------------------------------- */
  /* 11 · COMMAND PALETTE (⌘K)                                               */
  /* ---------------------------------------------------------------------- */
  const DEFAULT_COMMANDS = [
    { group: "Navigate", label: "Dashboard",        icon: grid(), href: "pages/dashboard.html" },
    { group: "Navigate", label: "Kanban Board",     icon: grid(), href: "pages/kanban.html" },
    { group: "Navigate", label: "Inbox",            icon: grid(), href: "pages/inbox.html" },
    { group: "Navigate", label: "Product",          icon: grid(), href: "pages/product.html" },
    { group: "Navigate", label: "Pricing",          icon: grid(), href: "pages/pricing.html" },
    { group: "Navigate", label: "Settings",         icon: grid(), href: "pages/settings.html" },
    { group: "Navigate", label: "Onboarding",       icon: grid(), href: "pages/onboarding.html" },
    { group: "Navigate", label: "Profile",          icon: grid(), href: "pages/profile.html" },
    { group: "Navigate", label: "Component Gallery", icon: grid(), href: "index.html" },
    { group: "Actions",  label: "Toggle Dusk / Dawn theme", icon: spark(), action: toggleTheme, shortcut: "T" },
    { group: "Actions",  label: "Scroll to top",     icon: spark(), action: () => window.scrollTo({ top: 0, behavior: REDUCE_MOTION ? "auto" : "smooth" }) },
    { group: "Actions",  label: "Fire a test toast", icon: spark(), action: () => toast({ variant: "success", title: "Hello from the grid", message: "The command palette works." }) },
  ];
  function grid() { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>'; }
  function spark() { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18"/></svg>'; }

  let cmdkEl = null, cmdkItems = [], cmdkActive = 0;
  function buildCmdk() {
    const commands = (window.VW_COMMANDS || []).concat(DEFAULT_COMMANDS);
    const back = document.createElement("div");
    back.className = "cmdk-backdrop";
    back.innerHTML =
      '<div class="cmdk" role="dialog" aria-modal="true" aria-label="Command palette">' +
        '<div class="cmdk__inputwrap">' +
          '<svg class="cmdk__searchicon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>' +
          '<input class="cmdk__input" type="text" placeholder="Type a command or search…" aria-label="Command" autocomplete="off" />' +
          '<kbd class="cmdk__esc">ESC</kbd>' +
        '</div>' +
        '<div class="cmdk__list" role="listbox"></div>' +
        '<div class="cmdk__empty" hidden>No matching commands</div>' +
      '</div>';
    document.body.appendChild(back);
    cmdkEl = back;
    const input = $(".cmdk__input", back);
    const list = $(".cmdk__list", back);

    function render(filter) {
      list.innerHTML = "";
      const f = (filter || "").toLowerCase().trim();
      const matches = commands.filter((c) => c.label.toLowerCase().includes(f));
      $(".cmdk__empty", back).hidden = matches.length > 0;
      let lastGroup = null;
      cmdkItems = [];
      matches.forEach((c) => {
        if (c.group && c.group !== lastGroup) {
          const g = document.createElement("div");
          g.className = "cmdk__group-label"; g.textContent = c.group;
          list.appendChild(g); lastGroup = c.group;
        }
        const item = document.createElement("button");
        item.className = "cmdk__item"; item.type = "button"; item.setAttribute("role", "option");
        item.innerHTML = '<span class="cmdk__item-icon">' + (c.icon || "") + '</span>' +
          '<span class="cmdk__item-label">' + esc(c.label) + '</span>' +
          (c.shortcut ? '<kbd class="cmdk__shortcut">' + esc(c.shortcut) + '</kbd>' : '');
        on(item, "click", () => runCmd(c));
        on(item, "mousemove", () => setActive(cmdkItems.indexOf(item)));
        list.appendChild(item); cmdkItems.push(item);
      });
      cmdkActive = 0; setActive(0);
    }
    function setActive(i) {
      if (!cmdkItems.length) return;
      cmdkActive = (i + cmdkItems.length) % cmdkItems.length;
      cmdkItems.forEach((it, n) => it.setAttribute("aria-selected", String(n === cmdkActive)));
      const el = cmdkItems[cmdkActive];
      if (el) el.scrollIntoView({ block: "nearest" });
    }
    function runCmd(c) {
      closeCmdk();
      if (c.action) c.action();
      else if (c.href) window.location.href = c.href;
    }
    on(input, "input", () => render(input.value));
    on(input, "keydown", (e) => {
      if (e.key === "ArrowDown") { e.preventDefault(); setActive(cmdkActive + 1); }
      else if (e.key === "ArrowUp") { e.preventDefault(); setActive(cmdkActive - 1); }
      else if (e.key === "Enter") {
        e.preventDefault();
        const f = input.value.toLowerCase().trim();
        const matches = commands.filter((c) => c.label.toLowerCase().includes(f));
        if (matches[cmdkActive]) runCmd(matches[cmdkActive]);
      } else if (e.key === "Escape") { closeCmdk(); }
    });
    on(back, "click", (e) => { if (e.target === back) closeCmdk(); });
    back._render = render;
    return back;
  }
  function openCmdk() {
    if (!cmdkEl) buildCmdk();
    lastFocused = document.activeElement;
    cmdkEl.classList.add("is-open");
    document.body.style.overflow = "hidden";
    const input = $(".cmdk__input", cmdkEl);
    cmdkEl._render("");
    input.value = "";
    setTimeout(() => input.focus(), 30);
  }
  function closeCmdk() {
    if (!cmdkEl) return;
    cmdkEl.classList.remove("is-open");
    document.body.style.overflow = "";
    if (lastFocused && lastFocused.focus) lastFocused.focus();
  }
  function initCmdk() {
    document.addEventListener("keydown", (e) => {
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        if (cmdkEl && cmdkEl.classList.contains("is-open")) closeCmdk(); else openCmdk();
      }
    });
    document.addEventListener("click", (e) => {
      if (e.target.closest("[data-cmdk-open]")) { e.preventDefault(); openCmdk(); }
    });
  }

  /* ---------------------------------------------------------------------- */
  /* 12 · TABLE — sort + select-all + row select                            */
  /* ---------------------------------------------------------------------- */
  function initTables() {
    $$("table.table").forEach((table) => {
      // sorting
      $$('th.is-sortable, th[data-sort]', table).forEach((th, ci) => {
        const colIndex = Array.prototype.indexOf.call(th.parentElement.children, th);
        on(th, "click", () => {
          const cur = th.getAttribute("aria-sort");
          const dir = cur === "ascending" ? "descending" : "ascending";
          $$("th", table).forEach((h) => h.removeAttribute("aria-sort"));
          th.setAttribute("aria-sort", dir);
          const tbody = $("tbody", table);
          const rows = $$("tr", tbody);
          const type = th.getAttribute("data-sort") || "text";
          rows.sort((a, b) => {
            let av = (a.children[colIndex] && a.children[colIndex].textContent || "").trim();
            let bv = (b.children[colIndex] && b.children[colIndex].textContent || "").trim();
            if (type === "number") { av = parseFloat(av.replace(/[^0-9.\-]/g, "")) || 0; bv = parseFloat(bv.replace(/[^0-9.\-]/g, "")) || 0; return dir === "ascending" ? av - bv : bv - av; }
            return dir === "ascending" ? av.localeCompare(bv) : bv.localeCompare(av);
          });
          rows.forEach((r) => tbody.appendChild(r));
        });
        on(th, "keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); th.click(); } });
      });
      // select all
      const selectAll = $('thead input[type="checkbox"][data-select-all]', table);
      const rowBoxes = $$('tbody input[type="checkbox"]', table);
      function syncRow(box) {
        const tr = box.closest("tr");
        if (tr) tr.setAttribute("aria-selected", String(box.checked));
        tr && tr.classList.toggle("table__row--selected", box.checked);
      }
      if (selectAll) {
        on(selectAll, "change", () => { rowBoxes.forEach((b) => { b.checked = selectAll.checked; syncRow(b); }); });
      }
      rowBoxes.forEach((b) => on(b, "change", () => {
        syncRow(b);
        if (selectAll) {
          const checked = rowBoxes.filter((x) => x.checked).length;
          selectAll.indeterminate = checked > 0 && checked < rowBoxes.length;
          selectAll.checked = checked === rowBoxes.length;
        }
      }));
    });
  }

  /* ---------------------------------------------------------------------- */
  /* 13 · STEPPER · RATING · SLIDER bubble                                   */
  /* ---------------------------------------------------------------------- */
  function initSteppers() {
    $$(".stepper").forEach((s) => {
      const input = $(".stepper__input", s);
      const dec = $('[data-step="down"], .stepper__btn--down', s) || $$(".stepper__btn", s)[0];
      const inc = $('[data-step="up"], .stepper__btn--up', s) || $$(".stepper__btn", s)[1];
      const min = input && input.min !== "" ? parseFloat(input.min) : -Infinity;
      const max = input && input.max !== "" ? parseFloat(input.max) : Infinity;
      const step = input && input.step ? parseFloat(input.step) : 1;
      const set = (v) => { v = Math.max(min, Math.min(max, v)); input.value = v; if (dec) dec.disabled = v <= min; if (inc) inc.disabled = v >= max; };
      if (input) {
        on(dec, "click", () => set((parseFloat(input.value) || 0) - step));
        on(inc, "click", () => set((parseFloat(input.value) || 0) + step));
        set(parseFloat(input.value) || 0);
      }
    });
  }
  function initRatings() {
    $$(".rating").forEach((r) => {
      const stars = $$(".rating__star", r);
      const setVal = (n) => {
        stars.forEach((s, i) => {
          const on_ = i < n;
          s.classList.toggle("is-filled", on_);
          s.setAttribute("aria-checked", String(i === n - 1));
        });
        r.setAttribute("data-value", n);
        r.dispatchEvent(new CustomEvent("vw:change", { detail: { value: n } }));
      };
      stars.forEach((s, i) => {
        on(s, "click", () => setVal(i + 1));
        on(s, "mouseenter", () => { if (!REDUCE_MOTION) stars.forEach((x, j) => x.classList.toggle("is-hover", j <= i)); });
        on(s, "keydown", (e) => {
          if (e.key === "ArrowRight" || e.key === "ArrowUp") { e.preventDefault(); (stars[i + 1] || stars[0]).focus(); }
          else if (e.key === "ArrowLeft" || e.key === "ArrowDown") { e.preventDefault(); (stars[i - 1] || stars[stars.length - 1]).focus(); }
          else if (e.key === " " || e.key === "Enter") { e.preventDefault(); setVal(i + 1); }
        });
      });
      on(r, "mouseleave", () => stars.forEach((x) => x.classList.remove("is-hover")));
      const init = parseInt(r.getAttribute("data-value") || "0", 10);
      if (init) setVal(init);
    });
  }
  function initSliders() {
    $$(".slider").forEach((wrap) => {
      const input = $(".slider__input", wrap) || (wrap.matches('input[type="range"]') ? wrap : null);
      const bubble = $(".slider__value", wrap);
      if (!input) return;
      const update = () => {
        const min = parseFloat(input.min || 0), max = parseFloat(input.max || 100);
        const pct = ((parseFloat(input.value) - min) / (max - min)) * 100;
        input.style.setProperty("--slider-pct", pct + "%");
        if (bubble) { bubble.textContent = input.value; bubble.style.left = pct + "%"; }
      };
      on(input, "input", update); update();
    });
  }

  /* ---------------------------------------------------------------------- */
  /* 14 · CHIP INPUT                                                         */
  /* ---------------------------------------------------------------------- */
  function chip(label) {
    return '<span class="chip"><span class="chip__label">' + esc(label) + '</span>' +
      '<button type="button" class="chip__remove" aria-label="Remove ' + esc(label) + '">&times;</button></span>';
  }
  function initChipInputs() {
    $$(".chip-input").forEach((ci) => {
      const field = $(".chip-input__field", ci);
      if (!field) return;
      on(field, "keydown", (e) => {
        if ((e.key === "Enter" || e.key === ",") && field.value.trim()) {
          e.preventDefault();
          field.insertAdjacentHTML("beforebegin", chip(field.value.trim()));
          field.value = "";
        } else if (e.key === "Backspace" && !field.value) {
          const last = $$(".chip", ci).pop(); if (last) last.remove();
        }
      });
      on(ci, "click", (e) => {
        if (e.target.closest(".chip__remove")) { e.target.closest(".chip").remove(); }
        else field.focus();
      });
    });
  }

  /* ---------------------------------------------------------------------- */
  /* 15 · FILE UPLOAD                                                        */
  /* ---------------------------------------------------------------------- */
  function fmtSize(b) { if (b < 1024) return b + " B"; if (b < 1048576) return (b / 1024).toFixed(1) + " KB"; return (b / 1048576).toFixed(1) + " MB"; }
  function initUploads() {
    $$(".upload").forEach((up) => {
      const zone = $(".upload__zone", up) || up;
      const input = $('input[type="file"]', up);
      const list = $(".upload__list", up);
      function addFiles(files) {
        if (!list) return;
        Array.prototype.forEach.call(files, (f) => {
          const row = document.createElement("div");
          row.className = "upload__file";
          row.innerHTML =
            '<span class="upload__file-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg></span>' +
            '<div class="upload__file-info"><div class="upload__file-name">' + esc(f.name) + '</div>' +
            '<div class="upload__file-size">' + fmtSize(f.size) + '</div>' +
            '<div class="upload__file-progress"><span></span></div></div>' +
            '<button type="button" class="upload__file-remove" aria-label="Remove file">&times;</button>';
          list.appendChild(row);
          const bar = $(".upload__file-progress span", row);
          if (bar) { if (REDUCE_MOTION) bar.style.width = "100%"; else { bar.style.width = "0%"; setTimeout(() => { bar.style.transition = "width 1.2s var(--ease-emphasized)"; bar.style.width = "100%"; }, 40); } }
          on($(".upload__file-remove", row), "click", () => row.remove());
        });
      }
      if (input) on(input, "change", () => addFiles(input.files));
      ["dragenter", "dragover"].forEach((ev) => on(zone, ev, (e) => { e.preventDefault(); up.classList.add("upload--dragover"); }));
      ["dragleave", "drop"].forEach((ev) => on(zone, ev, (e) => { e.preventDefault(); up.classList.remove("upload--dragover"); }));
      on(zone, "drop", (e) => { if (e.dataTransfer && e.dataTransfer.files) addFiles(e.dataTransfer.files); });
    });
  }

  /* ---------------------------------------------------------------------- */
  /* 16 · CAROUSEL                                                           */
  /* ---------------------------------------------------------------------- */
  function initCarousels() {
    $$(".carousel").forEach((car) => {
      const track = $(".carousel__track", car);
      const slides = $$(".carousel__slide", car);
      if (!track || !slides.length) return;
      let idx = 0;
      const dotsWrap = $(".carousel__dots", car);
      if (dotsWrap && !dotsWrap.children.length) {
        slides.forEach((_, i) => {
          const d = document.createElement("button");
          d.className = "carousel__dot"; d.type = "button"; d.setAttribute("aria-label", "Go to slide " + (i + 1));
          on(d, "click", () => go(i)); dotsWrap.appendChild(d);
        });
      }
      const dots = $$(".carousel__dot", car);
      function go(n) {
        idx = (n + slides.length) % slides.length;
        track.style.transform = "translateX(" + (-idx * 100) + "%)";
        dots.forEach((d, i) => d.classList.toggle("is-active", i === idx));
        slides.forEach((s, i) => s.setAttribute("aria-hidden", String(i !== idx)));
      }
      on($('.carousel__btn--prev, [data-carousel="prev"]', car), "click", () => go(idx - 1));
      on($('.carousel__btn--next, [data-carousel="next"]', car), "click", () => go(idx + 1));
      on(car, "keydown", (e) => { if (e.key === "ArrowLeft") go(idx - 1); else if (e.key === "ArrowRight") go(idx + 1); });
      go(0);
    });
  }

  /* ---------------------------------------------------------------------- */
  /* 17 · SIDEBAR collapse · NAVBAR mobile                                   */
  /* ---------------------------------------------------------------------- */
  function initNav() {
    document.addEventListener("click", (e) => {
      const sTog = e.target.closest("[data-sidebar-toggle]");
      if (sTog) {
        const sb = $(".sidebar");
        if (sb) { sb.classList.toggle("sidebar--collapsed"); const ex = !sb.classList.contains("sidebar--collapsed"); sTog.setAttribute("aria-expanded", String(ex)); }
      }
      const nTog = e.target.closest("[data-navbar-toggle]");
      if (nTog) {
        const nav = $(".navbar__nav");
        if (nav) { const open = nav.classList.toggle("is-open"); nTog.setAttribute("aria-expanded", String(open)); }
      }
    });
  }

  /* ---------------------------------------------------------------------- */
  /* 18 · COPY buttons (codeblock etc.)                                      */
  /* ---------------------------------------------------------------------- */
  function initCopy() {
    document.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-copy], .codeblock__copy");
      if (!btn) return;
      let text = btn.getAttribute("data-copy");
      if (!text) { const block = btn.closest(".codeblock"); const code = block && $("code", block); text = code ? code.textContent : ""; }
      const done = () => { const old = btn.getAttribute("data-label") || btn.textContent; btn.classList.add("is-copied"); const lbl = btn.querySelector("[data-copy-label]"); if (lbl) { lbl.textContent = "Copied!"; setTimeout(() => { lbl.textContent = old; btn.classList.remove("is-copied"); }, 1500); } else { toast({ variant: "success", title: "Copied to clipboard", duration: 1600 }); } };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done).catch(done);
      else done();
    });
  }

  /* ---------------------------------------------------------------------- */
  /* 19 · CALENDAR / DATEPICKER                                              */
  /* ---------------------------------------------------------------------- */
  const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const WD = ["Su","Mo","Tu","We","Th","Fr","Sa"];
  function initCalendars() {
    $$("[data-calendar]").forEach((cal) => {
      let view = new Date();
      let selected = null;
      function render() {
        const y = view.getFullYear(), m = view.getMonth();
        const first = new Date(y, m, 1).getDay();
        const days = new Date(y, m + 1, 0).getDate();
        const today = new Date();
        let html = '<div class="calendar__header">' +
          '<button class="btn btn--icon btn--sm" data-cal="prev" aria-label="Previous month"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m15 18-6-6 6-6"/></svg></button>' +
          '<span class="calendar__title">' + MONTHS[m] + " " + y + '</span>' +
          '<button class="btn btn--icon btn--sm" data-cal="next" aria-label="Next month"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 18 6-6-6-6"/></svg></button>' +
          '</div><div class="calendar__weekdays">' + WD.map((d) => '<span class="calendar__weekday">' + d + "</span>").join("") + '</div>' +
          '<div class="calendar__grid">';
        for (let i = 0; i < first; i++) html += '<button class="calendar__day calendar__day--muted" tabindex="-1"></button>';
        for (let d = 1; d <= days; d++) {
          const isToday = d === today.getDate() && m === today.getMonth() && y === today.getFullYear();
          const isSel = selected && d === selected.d && m === selected.m && y === selected.y;
          html += '<button class="calendar__day' + (isToday ? " calendar__day--today" : "") + (isSel ? " calendar__day--selected" : "") + '" data-day="' + d + '">' + d + "</button>";
        }
        html += "</div>";
        cal.innerHTML = html;
      }
      on(cal, "click", (e) => {
        const nav = e.target.closest("[data-cal]");
        if (nav) { view.setMonth(view.getMonth() + (nav.getAttribute("data-cal") === "next" ? 1 : -1)); render(); return; }
        const day = e.target.closest(".calendar__day[data-day]");
        if (day) { selected = { d: +day.getAttribute("data-day"), m: view.getMonth(), y: view.getFullYear() }; render(); cal.dispatchEvent(new CustomEvent("vw:date", { detail: selected })); }
      });
      render();
    });
  }

  /* ---------------------------------------------------------------------- */
  /* 20 · SCROLL REVEAL                                                      */
  /* ---------------------------------------------------------------------- */
  function initReveal() {
    const els = $$("[data-reveal]");
    if (!els.length) return;
    if (REDUCE_MOTION || !("IntersectionObserver" in window)) { els.forEach((el) => el.classList.add("is-visible")); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); } });
    }, { threshold: 0.12 });
    els.forEach((el) => io.observe(el));
  }

  /* ---------------------------------------------------------------------- */
  /* 21 · PROGRESS RING — set stroke-dashoffset from data-value             */
  /* ---------------------------------------------------------------------- */
  function initProgressRings() {
    $$(".progress-ring").forEach((ring) => {
      const bar = $(".progress-ring__bar", ring);
      if (!bar) return;
      const r = bar.r ? bar.r.baseVal.value : 42;
      const c = 2 * Math.PI * r;
      const val = parseFloat(ring.getAttribute("data-value") || "0");
      bar.style.strokeDasharray = c;
      bar.style.strokeDashoffset = REDUCE_MOTION ? c * (1 - val / 100) : c;
      if (!REDUCE_MOTION) { requestAnimationFrame(() => { bar.style.transition = "stroke-dashoffset 1s var(--ease-emphasized)"; bar.style.strokeDashoffset = c * (1 - val / 100); }); }
      const lbl = $(".progress-ring__label", ring);
      if (lbl && !lbl.textContent.trim()) lbl.textContent = val + "%";
    });
  }

  /* ---------------------------------------------------------------------- */
  /* 22 · KBD hint — replace ⌘ with Ctrl on non-mac                          */
  /* ---------------------------------------------------------------------- */
  function initKbd() {
    if (!isMac) $$("[data-kbd-cmd]").forEach((k) => { k.textContent = k.textContent.replace("⌘", "Ctrl "); });
  }

  /* ---------------------------------------------------------------------- */
  /* BOOT                                                                    */
  /* ---------------------------------------------------------------------- */
  function boot() {
    injectScene();
    initTheme();
    initParallax();
    initModals();
    initDrawers();
    initToastDemos();
    initTabs();
    initAccordions();
    initSegmented();
    initDropdowns();
    initCmdk();
    initTables();
    initSteppers();
    initRatings();
    initSliders();
    initChipInputs();
    initUploads();
    initCarousels();
    initNav();
    initCopy();
    initCalendars();
    initReveal();
    initProgressRings();
    initKbd();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();

  /* public API */
  window.VW = {
    toast: toast,
    openModal: (id) => { const m = document.getElementById(id); if (m) openOverlay(m); },
    closeModal: (id) => { const m = document.getElementById(id); if (m) closeOverlay(m); },
    openDrawer: (id) => { const d = document.getElementById(id); if (d) openOverlay(d); },
    closeDrawer: (id) => { const d = document.getElementById(id); if (d) closeOverlay(d); },
    openCommandPalette: openCmdk,
    setTheme: applyTheme,
    toggleTheme: toggleTheme,
  };
})();
