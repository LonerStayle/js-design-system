/* ============================================================================
   theme-15 · Scandinavian Hygge — app.js
   Vanilla JS for every interaction. No dependencies. Works from file://.
   Uses event delegation + small declarative attributes so any page that
   loads this file gets working components for free.
   ----------------------------------------------------------------------------
   data-* API (attach to elements in HTML):
     data-theme-toggle              → toggle light/dark (persists)
     data-modal-open="id"           → open <div class="modal" id="id" hidden>
     data-modal-close               → close nearest modal
     data-drawer-open="id"          → open drawer
     data-drawer-close              → close nearest drawer
     data-toast='{"title","msg","variant"}' → push a toast
     data-command-open              → open ⌘K palette
     data-dropdown-toggle           → toggle sibling/nearby .menu in .dropdown
     data-tabs (container) + role=tab/[aria-controls] + [role=tabpanel]
     data-accordion (container) + .accordion-trigger
     data-tab-stepper               → wizard next/prev via data-step-next/prev
   ============================================================================ */
(function () {
  "use strict";

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const prefersReduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ====================================================================
   * THEME (light / dark) — persisted in localStorage, OS-aware default
   * ================================================================== */
  const THEME_KEY = "hygge-theme";
  const Theme = {
    get() {
      try { return localStorage.getItem(THEME_KEY); } catch (e) { return null; }
    },
    apply(mode) {
      document.documentElement.setAttribute("data-theme", mode);
      $$("[data-theme-toggle]").forEach((b) => {
        b.setAttribute("aria-pressed", String(mode === "dark"));
        const lbl = b.querySelector("[data-theme-label]");
        if (lbl) lbl.textContent = mode === "dark" ? "Light" : "Dark";
      });
    },
    set(mode) {
      try { localStorage.setItem(THEME_KEY, mode); } catch (e) {}
      this.apply(mode);
    },
    toggle() {
      const cur = document.documentElement.getAttribute("data-theme") ||
        (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
      this.set(cur === "dark" ? "light" : "dark");
    },
    init() {
      const saved = this.get();
      if (saved) this.apply(saved);
      else this.apply(window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    },
  };
  Theme.init();

  /* Candle "lighting" bloom — warm light irises out from the click point when
     the theme flips. Skipped under reduced motion. */
  function themeFlash(x, y) {
    if (prefersReduced()) return;
    const f = document.createElement("div");
    f.className = "theme-flash";
    f.style.setProperty("--flash-x", (typeof x === "number" ? x : window.innerWidth / 2) + "px");
    f.style.setProperty("--flash-y", (typeof y === "number" ? y : window.innerHeight * 0.12) + "px");
    document.body.appendChild(f);
    setTimeout(() => f.remove(), 640);
  }

  /* Polite live-region announcer (kanban moves, etc.) */
  function announce(msg) {
    let live = document.getElementById("hygge-live");
    if (!live) {
      live = document.createElement("div");
      live.id = "hygge-live";
      live.className = "sr-only";
      live.setAttribute("aria-live", "polite");
      document.body.appendChild(live);
    }
    live.textContent = "";
    setTimeout(() => { live.textContent = msg; }, 40);
  }

  /* ====================================================================
   * FOCUS TRAP helper (for modal / drawer / command palette)
   * ================================================================== */
  const FOCUSABLE = 'a[href],button:not([disabled]),textarea,input,select,[tabindex]:not([tabindex="-1"])';
  function trapFocus(container, e) {
    const items = $$(FOCUSABLE, container).filter((el) => el.offsetParent !== null);
    if (!items.length) return;
    const first = items[0], last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) { last.focus(); e.preventDefault(); }
    else if (!e.shiftKey && document.activeElement === last) { first.focus(); e.preventDefault(); }
  }

  /* ====================================================================
   * OVERLAY MANAGER — shared scrim + ESC stack for modal/drawer/command
   * ================================================================== */
  const openLayers = []; // {el, type, overlay, restoreFocus}

  function lockScroll(on) {
    document.body.style.overflow = on ? "hidden" : "";
  }

  function mountOverlay(onClick) {
    const ov = document.createElement("div");
    ov.className = "overlay";
    ov.addEventListener("click", onClick);
    document.body.appendChild(ov);
    return ov;
  }

  function closeLayer(layer, immediate) {
    const idx = openLayers.indexOf(layer);
    if (idx === -1) return;
    openLayers.splice(idx, 1);
    // Visually hide the panel. Default overlays fade out via [hidden]; a layer
    // may supply layer.hide() to close another way (the off-canvas sidebar strips
    // its .open class so it slides out on its own transform transition).
    const hideNow = () => {
      layer.el.classList.remove("is-closing");
      if (layer.hide) layer.hide();
      else layer.el.hidden = true;
    };
    const cleanup = () => {
      if (layer.overlay && layer.overlay.parentNode) layer.overlay.remove();
      if (!openLayers.length) lockScroll(false);
      if (layer.restoreFocus && layer.restoreFocus.focus) layer.restoreFocus.focus();
    };
    if (immediate || prefersReduced()) { hideNow(); cleanup(); return; }
    if (layer.slide) {
      // Sidebar: start the transform slide-out now, fade the scrim alongside,
      // then clean up (scrim node, scroll lock, focus restore) once it settles.
      hideNow();
      if (layer.overlay) layer.overlay.classList.add("is-closing");
      setTimeout(cleanup, 200);
      return;
    }
    // modal / drawer / command: fade out in place, then hide + clean up.
    layer.el.classList.add("is-closing");
    if (layer.overlay) layer.overlay.classList.add("is-closing");
    setTimeout(() => { hideNow(); cleanup(); }, 200);
  }

  function openLayer(el, type) {
    if (!el || openLayers.some((l) => l.el === el)) return;
    const restoreFocus = document.activeElement;
    const layer = { el, type, restoreFocus, overlay: null };
    layer.overlay = mountOverlay(() => closeLayer(layer));
    el.hidden = false;
    lockScroll(true);
    openLayers.push(layer);
    // focus first focusable / the panel
    const panel = el.querySelector(".modal-panel, .drawer, .command, [data-autofocus]") || el;
    const focusTarget = el.querySelector("[data-autofocus]") || $$(FOCUSABLE, el)[0] || panel;
    setTimeout(() => focusTarget && focusTarget.focus && focusTarget.focus(), 30);
    return layer;
  }

  /* Off-canvas sidebar (mobile) — joins the same overlay stack as modal/drawer so
     it gets scrim (click-outside close), ESC, Tab focus-trap, scroll lock and
     focus restore. It slides via its .open class rather than the [hidden] attr,
     so it never hides the desktop sidebar. */
  function openSidebar(sb) {
    if (!sb || openLayers.some((l) => l.el === sb)) return;
    const restoreFocus = document.activeElement;
    const layer = {
      el: sb, type: "sidebar", restoreFocus, overlay: null,
      slide: true,
      hide: () => sb.classList.remove("open"),
    };
    layer.overlay = mountOverlay(() => closeLayer(layer));
    sb.classList.add("open");
    lockScroll(true);
    openLayers.push(layer);
    const focusTarget = $$(FOCUSABLE, sb)[0] || sb;
    setTimeout(() => focusTarget && focusTarget.focus && focusTarget.focus(), 30);
    return layer;
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && openLayers.length) {
      closeLayer(openLayers[openLayers.length - 1]);
    }
    if (e.key === "Tab" && openLayers.length) {
      const top = openLayers[openLayers.length - 1];
      const trapEl = top.el.querySelector(".modal-panel, .drawer, .command") || top.el;
      trapFocus(trapEl, e);
    }
  });

  /* ====================================================================
   * TOASTS
   * ================================================================== */
  function toastRegion() {
    let r = $(".toast-region");
    if (!r) {
      r = document.createElement("div");
      r.className = "toast-region";
      r.setAttribute("role", "region");
      r.setAttribute("aria-label", "알림");
      r.setAttribute("aria-live", "polite");
      document.body.appendChild(r);
    }
    return r;
  }
  const TOAST_ICONS = {
    success: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
    danger: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16h.01"/></svg>',
    warning: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4M12 17h.01"/></svg>',
    info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 16v-4M12 8h.01"/></svg>',
  };
  function pushToast(opts) {
    opts = opts || {};
    const variant = opts.variant || "info";
    const region = toastRegion();
    const el = document.createElement("div");
    el.className = "toast " + variant;
    el.setAttribute("role", "status");
    el.innerHTML =
      '<span class="toast-icon">' + (TOAST_ICONS[variant] || TOAST_ICONS.info) + "</span>" +
      '<div class="toast-body"><div class="toast-title"></div>' +
      (opts.msg ? '<div class="toast-msg"></div>' : "") + "</div>" +
      '<button class="toast-close" aria-label="닫기"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg></button>';
    el.querySelector(".toast-title").textContent = opts.title || "알림";
    if (opts.msg) el.querySelector(".toast-msg").textContent = opts.msg;
    region.appendChild(el);
    let timer;
    const remove = () => {
      clearTimeout(timer);
      if (prefersReduced()) { el.remove(); return; }
      el.classList.add("is-leaving");
      setTimeout(() => el.remove(), 260);
    };
    el.querySelector(".toast-close").addEventListener("click", remove);
    const dur = opts.duration || 4000;
    if (dur > 0 && !prefersReduced()) timer = setTimeout(remove, dur);
    return el;
  }
  window.hygge = window.hygge || {};
  window.hygge.toast = pushToast;
  window.hygge.theme = Theme;

  /* ====================================================================
   * COMMAND PALETTE (⌘K / Ctrl-K)
   * ================================================================== */
  function initCommandPalette() {
    let palette = $("#command-palette");
    function getPalette() {
      if (palette) return palette;
      // Build a default palette if the page didn't provide one
      palette = document.createElement("div");
      palette.id = "command-palette";
      palette.className = "command";
      palette.hidden = true;
      palette.setAttribute("role", "dialog");
      palette.setAttribute("aria-modal", "true");
      palette.setAttribute("aria-label", "명령 팔레트");
      const items = (window.HYGGE_COMMANDS || [
        { label: "대시보드로 이동", group: "이동", href: "pages/dashboard.html", icon: "grid" },
        { label: "칸반 보드 열기", group: "이동", href: "pages/kanban.html", icon: "columns" },
        { label: "다크 모드 전환", group: "작업", action: "theme" },
        { label: "토스트 표시", group: "작업", action: "toast" },
      ]);
      palette.innerHTML = commandMarkup(items);
      document.body.appendChild(palette);
      wireCommand(palette, items);
      return palette;
    }
    function commandMarkup() {
      return (
        '<div class="command-input-row">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>' +
        '<input type="text" placeholder="명령을 입력하거나 검색하세요…" aria-label="명령 검색" data-autofocus>' +
        "<kbd>ESC</kbd></div>" +
        '<div class="command-list" role="listbox"></div>'
      );
    }
    function wireCommand(pal, items) {
      const input = $("input", pal);
      const list = $(".command-list", pal);
      let active = 0, filtered = items.slice();
      function render() {
        const q = input.value.toLowerCase().trim();
        filtered = items.filter((it) => it.label.toLowerCase().includes(q));
        if (!filtered.length) { list.innerHTML = '<div class="command-empty">찾는 명령이 없어요. 다른 말로 검색해 보세요.</div>'; return; }
        const groups = {};
        filtered.forEach((it) => { (groups[it.group || "Results"] = groups[it.group || "Results"] || []).push(it); });
        let html = "", i = 0;
        for (const g in groups) {
          html += '<div class="command-group-label">' + g + "</div>";
          groups[g].forEach((it) => {
            html += '<div class="command-item' + (i === active ? " is-active" : "") + '" role="option" data-i="' + i + '">' +
              '<span class="ci-icon">' + cmdIcon(it.icon) + "</span>" +
              '<span class="ci-label">' + it.label + "</span>" +
              (it.shortcut ? "<kbd>" + it.shortcut + "</kbd>" : "") + "</div>";
            i++;
          });
        }
        list.innerHTML = html;
      }
      function run(it) {
        closeTop();
        if (!it) return;
        if (it.href) window.location.href = it.href;
        else if (it.action === "theme") { themeFlash(); Theme.toggle(); }
        else if (it.action === "toast") pushToast({ title: "명령을 실행했어요", msg: "⌘K 팔레트에서 실행한 예시 알림입니다.", variant: "success" });
        else if (typeof it.action === "function") it.action();
      }
      function closeTop() { const l = openLayers.find((x) => x.el === pal); if (l) closeLayer(l); }
      input.addEventListener("input", () => { active = 0; render(); });
      input.addEventListener("keydown", (e) => {
        if (e.key === "ArrowDown") { active = Math.min(active + 1, filtered.length - 1); render(); e.preventDefault(); }
        else if (e.key === "ArrowUp") { active = Math.max(active - 1, 0); render(); e.preventDefault(); }
        else if (e.key === "Enter") { run(filtered[active]); e.preventDefault(); }
      });
      list.addEventListener("click", (e) => {
        const item = e.target.closest(".command-item");
        if (item) run(filtered[+item.dataset.i]);
      });
      pal._open = () => { input.value = ""; active = 0; render(); openLayer(pal, "command"); };
    }
    function cmdIcon() {
      return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2"/></svg>';
    }
    // If page provided markup, wire it too
    if (palette && palette.dataset.wired !== "true") {
      const provided = $$(".command-item", palette).map((el) => ({
        label: el.querySelector(".ci-label") ? el.querySelector(".ci-label").textContent : el.textContent,
        href: el.dataset.href, action: el.dataset.action,
      }));
      // keep provided markup; just enable open/close + arrow nav
      palette.dataset.wired = "true";
    }
    document.addEventListener("keydown", (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        const p = getPalette();
        if (p._open) p._open(); else openLayer(p, "command");
      }
    });
    document.addEventListener("click", (e) => {
      if (e.target.closest("[data-command-open]")) {
        const p = getPalette();
        if (p._open) p._open(); else openLayer(p, "command");
      }
    });
  }
  initCommandPalette();

  /* ====================================================================
   * DELEGATED CLICK HANDLERS
   * ================================================================== */
  document.addEventListener("click", (e) => {
    // Modal
    const mo = e.target.closest("[data-modal-open]");
    if (mo) { openLayer($("#" + mo.getAttribute("data-modal-open")), "modal"); return; }
    if (e.target.closest("[data-modal-close]")) {
      const m = e.target.closest(".modal"); const l = openLayers.find((x) => x.el === m); if (l) closeLayer(l); return;
    }
    // Drawer
    const dro = e.target.closest("[data-drawer-open]");
    if (dro) { openLayer($("#" + dro.getAttribute("data-drawer-open")), "drawer"); return; }
    if (e.target.closest("[data-drawer-close]")) {
      const d = e.target.closest(".drawer"); const l = openLayers.find((x) => x.el === d); if (l) closeLayer(l); return;
    }
    // Toast trigger
    const tt = e.target.closest("[data-toast]");
    if (tt) {
      let cfg = {};
      try { cfg = JSON.parse(tt.getAttribute("data-toast")); } catch (err) { cfg = { title: tt.getAttribute("data-toast") }; }
      pushToast(cfg); return;
    }
    // Theme toggle — bloom warm light from the button's centre
    const tg = e.target.closest("[data-theme-toggle]");
    if (tg) {
      const r = tg.getBoundingClientRect();
      themeFlash(r.left + r.width / 2, r.top + r.height / 2);
      Theme.toggle();
      return;
    }

    // Dropdown toggle
    const dd = e.target.closest("[data-dropdown-toggle]");
    if (dd) {
      const wrap = dd.closest(".dropdown");
      const menu = wrap && wrap.querySelector(".menu");
      if (menu) {
        const isOpen = menu.classList.contains("is-open");
        closeAllMenus();
        if (!isOpen) {
          menu.classList.add("is-open"); menu.style.display = "flex"; dd.setAttribute("aria-expanded", "true");
          // make menu items keyboard-reachable and land focus on the first
          const mi = $$('[role="menuitem"], .menu-item', menu);
          mi.forEach((x) => { if (!x.matches("a[href],button")) x.tabIndex = 0; });
          if (mi[0]) setTimeout(() => mi[0].focus && mi[0].focus(), 20);
        }
      }
      return;
    }

    // Sidebar collapse (desktop)
    const sc = e.target.closest("[data-sidebar-toggle]");
    if (sc) {
      const sb = $("#" + (sc.getAttribute("data-sidebar-toggle") || "")) || $(".sidebar");
      if (sb) sb.classList.toggle("collapsed");
      return;
    }
    // Sidebar off-canvas (mobile) — toggle through the shared overlay manager
    const so = e.target.closest("[data-sidebar-open]");
    if (so) {
      const sb = $("#" + (so.getAttribute("data-sidebar-open") || "")) || $(".sidebar");
      if (sb) {
        const existing = openLayers.find((l) => l.el === sb);
        if (existing) closeLayer(existing); else openSidebar(sb);
      }
      return;
    }

    // close menus when clicking outside
    if (!e.target.closest(".menu")) closeAllMenus();
  });

  function closeAllMenus() {
    $$(".menu.is-open").forEach((m) => { m.classList.remove("is-open"); m.style.display = ""; });
    $$("[data-dropdown-toggle][aria-expanded='true']").forEach((b) => b.setAttribute("aria-expanded", "false"));
  }

  // Arrow-key navigation inside any open menu (role="menu" or .menu)
  document.addEventListener("keydown", (e) => {
    const item = e.target.closest && e.target.closest('.menu [role="menuitem"], .menu .menu-item');
    if (!item) return;
    const menu = item.closest(".menu");
    const items = $$('[role="menuitem"], .menu-item', menu).filter((x) => !x.disabled);
    if (!items.length) return;
    let i = items.indexOf(item);
    if (e.key === "ArrowDown") { i = (i + 1) % items.length; items[i].focus(); e.preventDefault(); }
    else if (e.key === "ArrowUp") { i = (i - 1 + items.length) % items.length; items[i].focus(); e.preventDefault(); }
    else if (e.key === "Home") { items[0].focus(); e.preventDefault(); }
    else if (e.key === "End") { items[items.length - 1].focus(); e.preventDefault(); }
    else if (e.key === "Escape") {
      const wrap = menu.closest(".dropdown");
      const toggle = wrap && wrap.querySelector("[data-dropdown-toggle]");
      closeAllMenus();
      if (toggle && toggle.focus) toggle.focus();
      e.preventDefault();
    }
  });

  /* ====================================================================
   * TABS (role-based, keyboard accessible)
   * ================================================================== */
  function initTabs() {
    $$("[data-tabs]").forEach((group) => {
      const tabs = $$('[role="tab"]', group);
      tabs.forEach((tab, i) => {
        tab.addEventListener("click", () => selectTab(group, tabs, tab));
        tab.addEventListener("keydown", (e) => {
          let idx = tabs.indexOf(tab);
          if (e.key === "ArrowRight" || e.key === "ArrowDown") { idx = (idx + 1) % tabs.length; tabs[idx].focus(); selectTab(group, tabs, tabs[idx]); e.preventDefault(); }
          else if (e.key === "ArrowLeft" || e.key === "ArrowUp") { idx = (idx - 1 + tabs.length) % tabs.length; tabs[idx].focus(); selectTab(group, tabs, tabs[idx]); e.preventDefault(); }
          else if (e.key === "Home") { tabs[0].focus(); selectTab(group, tabs, tabs[0]); e.preventDefault(); }
          else if (e.key === "End") { tabs[tabs.length - 1].focus(); selectTab(group, tabs, tabs[tabs.length - 1]); e.preventDefault(); }
        });
      });
    });
  }
  function selectTab(group, tabs, tab) {
    tabs.forEach((t) => {
      const selected = t === tab;
      t.setAttribute("aria-selected", String(selected));
      t.tabIndex = selected ? 0 : -1;
      const panel = document.getElementById(t.getAttribute("aria-controls"));
      if (panel) panel.hidden = !selected;
    });
  }
  initTabs();

  /* ====================================================================
   * ACCORDION
   * ================================================================== */
  function initAccordion() {
    $$(".accordion-trigger").forEach((trigger) => {
      trigger.addEventListener("click", () => {
        const expanded = trigger.getAttribute("aria-expanded") === "true";
        const content = document.getElementById(trigger.getAttribute("aria-controls")) ||
          trigger.nextElementSibling;
        const single = trigger.closest("[data-accordion-single]");
        if (single && !expanded) {
          $$(".accordion-trigger", single).forEach((t) => {
            if (t !== trigger) {
              t.setAttribute("aria-expanded", "false");
              const c = document.getElementById(t.getAttribute("aria-controls")) || t.nextElementSibling;
              if (c) c.setAttribute("data-open", "false");
            }
          });
        }
        trigger.setAttribute("aria-expanded", String(!expanded));
        if (content) content.setAttribute("data-open", String(!expanded));
      });
    });
  }
  initAccordion();

  /* ====================================================================
   * WIZARD / STEPS
   * ================================================================== */
  function initWizards() {
    $$("[data-wizard]").forEach((wiz) => {
      const steps = $$("[data-step-panel]", wiz);
      const dots = $$(".step", wiz);
      let cur = 0;
      function show(n) {
        cur = Math.max(0, Math.min(n, steps.length - 1));
        steps.forEach((p, i) => (p.hidden = i !== cur));
        dots.forEach((d, i) => {
          d.classList.toggle("active", i === cur);
          d.classList.toggle("done", i < cur);
        });
        const prog = $("[data-wizard-progress]", wiz);
        if (prog) prog.querySelector(".bar").style.width = ((cur) / (steps.length - 1) * 100) + "%";
      }
      wiz.addEventListener("click", (e) => {
        if (e.target.closest("[data-step-next]")) show(cur + 1);
        if (e.target.closest("[data-step-prev]")) show(cur - 1);
      });
      show(0);
    });
  }
  initWizards();

  /* ====================================================================
   * SORTABLE TABLE
   * ================================================================== */
  function initSortTables() {
    $$("table.table").forEach((table) => {
      $$("th.sortable", table).forEach((th) => {
        // Prefer an inner <button class="th-sort"> (natively focusable);
        // otherwise make the <th> itself keyboard-operable.
        const trigger = th.querySelector(".th-sort") || th;
        const isBareTh = trigger === th;
        if (isBareTh) th.tabIndex = 0;
        function doSort() {
          const tbody = table.querySelector("tbody");
          if (!tbody) return;
          const rows = Array.from(tbody.rows);
          const idx = Array.from(th.parentNode.children).indexOf(th);
          const asc = th.getAttribute("aria-sort") !== "ascending";
          $$("th", table).forEach((o) => o.removeAttribute("aria-sort"));
          th.setAttribute("aria-sort", asc ? "ascending" : "descending");
          rows.sort((a, b) => {
            const av = (a.cells[idx].dataset.sort || a.cells[idx].textContent).trim();
            const bv = (b.cells[idx].dataset.sort || b.cells[idx].textContent).trim();
            const an = parseFloat(av.replace(/[^0-9.-]/g, "")), bn = parseFloat(bv.replace(/[^0-9.-]/g, ""));
            const cmp = (!isNaN(an) && !isNaN(bn)) ? an - bn : av.localeCompare(bv, "ko");
            return asc ? cmp : -cmp;
          });
          rows.forEach((r) => tbody.appendChild(r));
        }
        trigger.addEventListener("click", doSort);
        if (isBareTh) {
          th.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") { e.preventDefault(); doSort(); }
          });
        }
      });
      // select-all checkbox
      const selectAll = table.querySelector("[data-select-all]");
      if (selectAll) {
        selectAll.addEventListener("change", () => {
          $$("tbody [data-row-check]", table).forEach((cb) => {
            cb.checked = selectAll.checked;
            cb.closest("tr").classList.toggle("is-selected", cb.checked);
          });
        });
        table.addEventListener("change", (e) => {
          if (e.target.matches("[data-row-check]")) {
            e.target.closest("tr").classList.toggle("is-selected", e.target.checked);
            const all = $$("tbody [data-row-check]", table);
            selectAll.checked = all.every((c) => c.checked);
            selectAll.indeterminate = !selectAll.checked && all.some((c) => c.checked);
          }
        });
      }
    });
  }
  initSortTables();

  /* ====================================================================
   * SLIDER / STEPPER live values
   * ================================================================== */
  function initInputs() {
    $$('input[type="range"][data-output]').forEach((s) => {
      const out = document.getElementById(s.getAttribute("data-output"));
      const upd = () => { if (out) out.textContent = s.value + (s.dataset.suffix || ""); };
      s.addEventListener("input", upd); upd();
    });
    $$(".stepper").forEach((st) => {
      const input = $("input", st);
      st.addEventListener("click", (e) => {
        const dec = e.target.closest("[data-dec]"), inc = e.target.closest("[data-inc]");
        if (!input) return;
        let v = parseInt(input.value || "0", 10);
        const min = input.min !== "" ? parseInt(input.min, 10) : -Infinity;
        const max = input.max !== "" ? parseInt(input.max, 10) : Infinity;
        if (dec) v = Math.max(min, v - 1);
        if (inc) v = Math.min(max, v + 1);
        input.value = v;
      });
    });
    // Rating (input). Display-only ratings use [data-readonly] or role="img"
    // with <span> stars and are left untouched.
    $$(".rating").forEach((r) => {
      if (r.hasAttribute("data-readonly") || r.getAttribute("role") === "img") return;
      const stars = $$("button", r);
      if (!stars.length) return;
      const isRadio = stars[0].getAttribute("role") === "radio";
      function setVal(v) {
        r.dataset.value = v;
        stars.forEach((s, j) => {
          s.classList.toggle("is-filled", j < v);
          if (isRadio) {
            s.setAttribute("aria-checked", String(j + 1 === v));
            s.tabIndex = j + 1 === v ? 0 : -1;
          }
        });
      }
      const initial = parseInt(r.dataset.value || "0", 10) || 0;
      if (isRadio && !initial && stars[0]) stars[0].tabIndex = 0;
      stars.forEach((star, i) => {
        star.addEventListener("click", () => setVal(i + 1));
        star.addEventListener("mouseenter", () => stars.forEach((s, j) => s.classList.toggle("is-filled", j <= i)));
        star.addEventListener("keydown", (e) => {
          const n = stars.length;
          let v = parseInt(r.dataset.value || "0", 10) || 1;
          if (e.key === "ArrowRight" || e.key === "ArrowUp") v = Math.min(n, v + 1);
          else if (e.key === "ArrowLeft" || e.key === "ArrowDown") v = Math.max(1, v - 1);
          else if (e.key === "Home") v = 1;
          else if (e.key === "End") v = n;
          else return;
          e.preventDefault(); setVal(v); stars[v - 1].focus();
        });
      });
      r.addEventListener("mouseleave", () => {
        const v = parseInt(r.dataset.value || "0", 10);
        stars.forEach((s, j) => s.classList.toggle("is-filled", j < v));
      });
    });
    // ChipInput
    $$(".chip-input").forEach((ci) => {
      const input = $("input", ci);
      if (!input) return;
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && input.value.trim()) {
          e.preventDefault();
          addChip(ci, input, input.value.trim());
          input.value = "";
        } else if (e.key === "Backspace" && !input.value) {
          const chips = $$(".chip", ci);
          if (chips.length) chips[chips.length - 1].remove();
        }
      });
    });
    document.addEventListener("click", (e) => {
      const x = e.target.closest(".chip button");
      if (x) x.closest(".chip").remove();
    });
  }
  function addChip(container, input, text) {
    const chip = document.createElement("span");
    chip.className = "chip";
    chip.innerHTML = '<span></span><button type="button"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg></button>';
    chip.querySelector("span").textContent = text;
    chip.querySelector("button").setAttribute("aria-label", text + " 삭제");
    container.insertBefore(chip, input);
  }
  initInputs();

  /* ====================================================================
   * SEARCHBAR clear button
   * ================================================================== */
  document.addEventListener("click", (e) => {
    const clr = e.target.closest(".search-clear");
    if (clr) { const inp = clr.closest(".searchbar").querySelector("input"); if (inp) { inp.value = ""; inp.focus(); } }
  });

  /* ====================================================================
   * CONTEXT MENU
   * ================================================================== */
  function initContextMenus() {
    $$("[data-context-menu]").forEach((zone) => {
      const tmplId = zone.getAttribute("data-context-menu");
      zone.addEventListener("contextmenu", (e) => {
        const tmpl = document.getElementById(tmplId);
        if (!tmpl) return;
        e.preventDefault();
        closeContext();
        const menu = tmpl.cloneNode(true);
        menu.removeAttribute("id"); menu.hidden = false;
        menu.classList.add("context-menu");
        document.body.appendChild(menu);
        const x = Math.min(e.clientX, window.innerWidth - menu.offsetWidth - 8);
        const y = Math.min(e.clientY, window.innerHeight - menu.offsetHeight - 8);
        menu.style.left = x + "px"; menu.style.top = y + "px";
        menu._ctx = true;
      });
    });
    document.addEventListener("click", closeContext);
    document.addEventListener("scroll", closeContext, true);
  }
  function closeContext() { $$(".context-menu").forEach((m) => m._ctx && m.remove()); }
  initContextMenus();

  /* ====================================================================
   * CAROUSEL
   * ================================================================== */
  function initCarousels() {
    $$(".carousel").forEach((car) => {
      const track = $(".carousel-track", car);
      if (!track) return;
      const slides = $$(".carousel-slide", track);
      const step = () => (slides[0] ? slides[0].offsetWidth + 16 : 300);
      const prev = $(".carousel-btn.prev", car), next = $(".carousel-btn.next", car);
      if (prev) prev.addEventListener("click", () => track.scrollBy({ left: -step(), behavior: prefersReduced() ? "auto" : "smooth" }));
      if (next) next.addEventListener("click", () => track.scrollBy({ left: step(), behavior: prefersReduced() ? "auto" : "smooth" }));
      const dots = $$(".carousel-dots button", car);
      if (dots.length) {
        dots.forEach((d, i) => d.addEventListener("click", () => track.scrollTo({ left: i * step(), behavior: prefersReduced() ? "auto" : "smooth" })));
        track.addEventListener("scroll", () => {
          const i = Math.round(track.scrollLeft / step());
          dots.forEach((d, j) => d.classList.toggle("is-active", j === i));
        });
      }
    });
  }
  initCarousels();

  /* ====================================================================
   * KANBAN — keyboard/touch alternative to drag & drop.
   * Page markup: each column = [data-kanban-col][data-kanban-name],
   * drop area = [data-kanban-list], each card carries move buttons
   *   <button data-kanban-move="prev|next">…</button>.
   * ================================================================== */
  document.addEventListener("click", (e) => {
    const mv = e.target.closest("[data-kanban-move]");
    if (!mv) return;
    const dir = mv.getAttribute("data-kanban-move");
    const card = mv.closest(".kanban-card");
    const col = card && card.closest("[data-kanban-col]");
    if (!card || !col) return;
    const cols = $$("[data-kanban-col]");
    const ci = cols.indexOf(col);
    const target = dir === "next" ? cols[ci + 1] : cols[ci - 1];
    if (!target) return;
    const list = target.querySelector("[data-kanban-list]") || target;
    list.appendChild(card);
    if (card.focus) card.focus();
    const title = card.querySelector(".kc-title");
    const name = target.getAttribute("data-kanban-name") || "다른 열";
    announce((title ? title.textContent : "카드") + "을(를) " + name + " 열로 옮겼습니다.");
  });

  /* ====================================================================
   * SCROLL REVEAL (respects reduced motion)
   * ================================================================== */
  function initReveal() {
    const els = $$("[data-reveal]");
    if (!els.length) return;
    if (prefersReduced() || !("IntersectionObserver" in window)) { els.forEach((el) => el.classList.add("reveal-in")); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("reveal-in"); io.unobserve(en.target); } });
    }, { threshold: 0.12 });
    els.forEach((el) => io.observe(el));
  }
  initReveal();

  /* ====================================================================
   * COPY-TO-CLIPBOARD (code blocks, tokens)
   * ================================================================== */
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-copy]");
    if (!btn) return;
    const text = btn.getAttribute("data-copy") || (btn.closest(".code-block") && btn.closest(".code-block").querySelector("pre").innerText);
    if (!text) return;
    const done = () => pushToast({ title: "Copied", msg: text.length > 40 ? text.slice(0, 40) + "…" : text, variant: "success", duration: 2000 });
    if (navigator.clipboard) navigator.clipboard.writeText(text).then(done).catch(done);
    else done();
  });

  /* ====================================================================
   * PRICING TOGGLE (monthly / yearly) — generic
   * ================================================================== */
  document.addEventListener("change", (e) => {
    const t = e.target.closest("[data-price-toggle]");
    if (!t) return;
    const yearly = t.checked;
    $$("[data-price-monthly]").forEach((el) => (el.hidden = yearly));
    $$("[data-price-yearly]").forEach((el) => (el.hidden = !yearly));
  });

  console.info("%c🌿 Hygge design system ready", "color:#5C7053;font-weight:600");
})();
