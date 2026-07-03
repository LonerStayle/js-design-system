/* ============================================================================
   THEME 13 — DARK LUXURY · app.js
   ----------------------------------------------------------------------------
   All interactions, vanilla JS. Self-initializing via data-attributes and
   conventional classes. Load with: <script src="app.js" defer></script>
   (use ../app.js from inside pages/). No dependencies. Accessibility-minded:
   focus trapping, Escape handling, ARIA state, keyboard navigation.
   ========================================================================== */
(function () {
  "use strict";

  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const reduceMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ───────────────────────────── THEME ───────────────────────────── */
  const Theme = {
    key: "dl-theme",
    get() { return localStorage.getItem(this.key) || document.documentElement.getAttribute("data-theme") || "dark"; },
    set(mode) {
      document.documentElement.setAttribute("data-theme", mode);
      try { localStorage.setItem(this.key, mode); } catch (e) {}
      $$("[data-theme-toggle]").forEach((b) => b.setAttribute("aria-pressed", String(mode === "light")));
      document.dispatchEvent(new CustomEvent("themechange", { detail: { mode } }));
    },
    toggle() { this.set(this.get() === "dark" ? "light" : "dark"); },
    init() {
      const stored = localStorage.getItem(this.key);
      if (stored) document.documentElement.setAttribute("data-theme", stored);
      this.set(this.get());
      document.addEventListener("click", (e) => {
        const t = e.target.closest("[data-theme-toggle]");
        if (t) { e.preventDefault(); this.toggle(); }
      });
    },
  };

  /* ───────────────────── NAV / SIDEBAR ───────────────────── */
  function initNav() {
    document.addEventListener("click", (e) => {
      const burger = e.target.closest("[data-nav-toggle]");
      if (burger) {
        const menu = $("[data-nav-menu]");
        if (menu) { const open = menu.classList.toggle("is-open"); burger.setAttribute("aria-expanded", String(open)); }
      }
      const sb = e.target.closest("[data-sidebar-toggle]");
      if (sb) {
        const sel = sb.getAttribute("data-sidebar-toggle");
        const sidebar = sel ? $(sel) : $(".sidebar");
        if (sidebar) { const c = sidebar.classList.toggle("is-collapsed"); sb.setAttribute("aria-pressed", String(c)); }
      }
    });
  }

  /* ───────────────────── FOCUS TRAP HELPER ───────────────────── */
  const FOCUSABLE = 'a[href],button:not([disabled]),textarea,input,select,[tabindex]:not([tabindex="-1"])';
  function trapFocus(container, e) {
    const nodes = $$(FOCUSABLE, container).filter((n) => n.offsetParent !== null || n === document.activeElement);
    if (!nodes.length) return;
    const first = nodes[0], last = nodes[nodes.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  /* ───────────────────── OVERLAY STACK (modal/drawer/cmdk) ───────────────────── */
  const OverlayStack = [];
  function lockScroll(lock) { document.documentElement.style.overflow = lock ? "hidden" : ""; }
  function pushOverlay(el, closeFn) {
    OverlayStack.push({ el, closeFn, lastFocus: document.activeElement });
    lockScroll(true);
  }
  function popOverlay() {
    const top = OverlayStack.pop();
    if (!OverlayStack.length) lockScroll(false);
    if (top && top.lastFocus && top.lastFocus.focus) setTimeout(() => top.lastFocus.focus(), 0);
    return top;
  }

  /* ───────────────────── MODAL ───────────────────── */
  function openModal(modal) {
    if (!modal) return;
    modal.classList.add("is-open");
    modal.removeAttribute("hidden");
    modal.setAttribute("aria-hidden", "false");
    pushOverlay(modal, () => closeModal(modal));
    const focusTarget = modal.querySelector("[data-autofocus]") || modal.querySelector(FOCUSABLE);
    setTimeout(() => focusTarget && focusTarget.focus(), 60);
  }
  function closeModal(modal) {
    if (!modal || !modal.classList.contains("is-open")) return;
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    const idx = OverlayStack.findIndex((o) => o.el === modal);
    if (idx > -1) { OverlayStack.splice(idx, 1); if (!OverlayStack.length) lockScroll(false); }
  }
  function initModals() {
    document.addEventListener("click", (e) => {
      const opener = e.target.closest("[data-modal-open]");
      if (opener) { e.preventDefault(); openModal($("#" + opener.getAttribute("data-modal-open"))); return; }
      const closer = e.target.closest("[data-modal-close]");
      if (closer) { const m = closer.closest(".modal"); closeModal(m); return; }
      // backdrop click
      if (e.target.classList && e.target.classList.contains("modal")) closeModal(e.target);
    });
  }

  /* ───────────────────── DRAWER ───────────────────── */
  function getOverlay() {
    let ov = $("[data-overlay]");
    if (!ov) { ov = document.createElement("div"); ov.className = "overlay"; ov.setAttribute("data-overlay", ""); document.body.appendChild(ov); }
    return ov;
  }
  function openDrawer(drawer) {
    if (!drawer) return;
    const ov = getOverlay();
    ov.classList.add("is-open");
    drawer.classList.add("is-open");
    drawer.setAttribute("aria-hidden", "false");
    pushOverlay(drawer, () => closeDrawer(drawer));
    setTimeout(() => { const f = drawer.querySelector(FOCUSABLE); f && f.focus(); }, 60);
  }
  function closeDrawer(drawer) {
    if (!drawer || !drawer.classList.contains("is-open")) return;
    drawer.classList.remove("is-open");
    drawer.setAttribute("aria-hidden", "true");
    const anyDrawerOpen = $$(".drawer.is-open").length > 0;
    if (!anyDrawerOpen) { const ov = $("[data-overlay]"); ov && ov.classList.remove("is-open"); }
    const idx = OverlayStack.findIndex((o) => o.el === drawer);
    if (idx > -1) { OverlayStack.splice(idx, 1); if (!OverlayStack.length) lockScroll(false); }
  }
  function initDrawers() {
    document.addEventListener("click", (e) => {
      const opener = e.target.closest("[data-drawer-open]");
      if (opener) { e.preventDefault(); openDrawer($("#" + opener.getAttribute("data-drawer-open"))); return; }
      const closer = e.target.closest("[data-drawer-close]");
      if (closer) { closeDrawer(closer.closest(".drawer")); return; }
      if (e.target.matches && e.target.matches("[data-overlay]")) { $$(".drawer.is-open").forEach(closeDrawer); }
    });
  }

  /* ───────────────────── GLOBAL ESC + FOCUS TRAP ───────────────────── */
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && OverlayStack.length) {
      e.preventDefault();
      OverlayStack[OverlayStack.length - 1].closeFn();
    }
    if (e.key === "Tab" && OverlayStack.length) {
      trapFocus(OverlayStack[OverlayStack.length - 1].el, e);
    }
  });

  /* ───────────────────── TABS ───────────────────── */
  function initTabs() {
    $$("[data-tabs]").forEach((root) => {
      const tabs = $$('[role="tab"]', root);
      const select = (tab) => {
        tabs.forEach((t) => {
          const sel = t === tab;
          t.setAttribute("aria-selected", String(sel));
          t.tabIndex = sel ? 0 : -1;
          const panel = $("#" + t.getAttribute("aria-controls"));
          if (panel) panel.hidden = !sel;
        });
      };
      root.addEventListener("click", (e) => { const t = e.target.closest('[role="tab"]'); if (t) select(t); });
      root.addEventListener("keydown", (e) => {
        const i = tabs.indexOf(document.activeElement);
        if (i < 0) return;
        let n = null;
        if (e.key === "ArrowRight" || e.key === "ArrowDown") n = tabs[(i + 1) % tabs.length];
        if (e.key === "ArrowLeft" || e.key === "ArrowUp") n = tabs[(i - 1 + tabs.length) % tabs.length];
        if (e.key === "Home") n = tabs[0];
        if (e.key === "End") n = tabs[tabs.length - 1];
        if (n) { e.preventDefault(); n.focus(); select(n); }
      });
    });
  }

  /* ───────────────────── ACCORDION ───────────────────── */
  function initAccordion() {
    $$(".accordion").forEach((acc) => {
      const single = acc.getAttribute("data-accordion") === "single";
      $$(".accordion__trigger", acc).forEach((trig) => {
        trig.addEventListener("click", () => {
          const panel = $("#" + trig.getAttribute("aria-controls"));
          const open = trig.getAttribute("aria-expanded") === "true";
          if (single && !open) {
            $$(".accordion__trigger", acc).forEach((o) => {
              o.setAttribute("aria-expanded", "false");
              const p = $("#" + o.getAttribute("aria-controls")); if (p) p.style.maxHeight = null;
            });
          }
          trig.setAttribute("aria-expanded", String(!open));
          if (panel) panel.style.maxHeight = open ? null : panel.scrollHeight + "px";
        });
      });
    });
  }

  /* ───────────────────── DROPDOWN / MENU ───────────────────── */
  function closeAllDropdowns(except) {
    $$("[data-dropdown].is-open").forEach((d) => { if (d !== except) { d.classList.remove("is-open"); const t = $("[data-dropdown-trigger]", d); t && t.setAttribute("aria-expanded", "false"); } });
  }
  function initDropdowns() {
    document.addEventListener("click", (e) => {
      const trig = e.target.closest("[data-dropdown-trigger]");
      if (trig) {
        e.preventDefault();
        const dd = trig.closest("[data-dropdown]");
        const open = dd.classList.contains("is-open");
        closeAllDropdowns(dd);
        dd.classList.toggle("is-open", !open);
        trig.setAttribute("aria-expanded", String(!open));
        return;
      }
      if (!e.target.closest("[data-dropdown-menu]")) closeAllDropdowns();
    });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeAllDropdowns(); });
  }

  /* ───────────────────── CONTEXT MENU ───────────────────── */
  function initContextMenus() {
    $$("[data-context-menu]").forEach((region) => {
      const menu = $("#" + region.getAttribute("data-context-menu"));
      if (!menu) return;
      menu.style.position = "fixed"; menu.hidden = true; menu.style.zIndex = "var(--z-popover)";
      region.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        menu.hidden = false;
        const w = menu.offsetWidth, h = menu.offsetHeight;
        menu.style.left = Math.min(e.clientX, window.innerWidth - w - 8) + "px";
        menu.style.top = Math.min(e.clientY, window.innerHeight - h - 8) + "px";
      });
      document.addEventListener("click", () => { menu.hidden = true; });
      document.addEventListener("keydown", (e) => { if (e.key === "Escape") menu.hidden = true; });
    });
  }

  /* ───────────────────── TOAST ───────────────────── */
  const ICONS = {
    success: '<svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg>',
    warning: '<svg viewBox="0 0 24 24"><path d="M12 9v4m0 4h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/></svg>',
    danger:  '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M15 9l-6 6M9 9l6 6"/></svg>',
    info:    '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 11v5m0-8h.01"/></svg>',
    gold:    '<svg viewBox="0 0 24 24"><path d="M12 2l2.4 6.9H22l-6 4.6 2.3 7L12 16.9 5.7 20.5 8 13.5 2 8.9h7.6z"/></svg>',
  };
  function toast(opts) {
    opts = typeof opts === "string" ? { message: opts } : (opts || {});
    let stack = $(".toast-stack");
    if (!stack) { stack = document.createElement("div"); stack.className = "toast-stack"; stack.setAttribute("role", "region"); stack.setAttribute("aria-label", "알림"); document.body.appendChild(stack); }
    const variant = opts.variant || "gold";
    const el = document.createElement("div");
    el.className = "toast toast--" + variant;
    el.setAttribute("role", "status");
    el.innerHTML =
      '<span class="toast__icon">' + (ICONS[variant] || ICONS.gold) + "</span>" +
      '<div class="toast__body">' +
        (opts.title ? '<div class="toast__title">' + opts.title + "</div>" : "") +
        (opts.message ? '<div class="toast__msg">' + opts.message + "</div>" : "") +
      "</div>" +
      '<button class="toast__close" aria-label="닫기"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></button>';
    stack.appendChild(el);
    requestAnimationFrame(() => el.classList.add("is-visible"));
    const dismiss = () => { el.classList.add("is-leaving"); el.classList.remove("is-visible"); setTimeout(() => el.remove(), 500); };
    el.querySelector(".toast__close").addEventListener("click", dismiss);
    const dur = opts.duration == null ? 4200 : opts.duration;
    if (dur > 0) setTimeout(dismiss, dur);
    return dismiss;
  }
  window.dlToast = toast;
  function initToastTriggers() {
    document.addEventListener("click", (e) => {
      const t = e.target.closest("[data-toast]");
      if (!t) return;
      e.preventDefault();
      toast({ title: t.getAttribute("data-toast-title") || "", message: t.getAttribute("data-toast") || "완료되었습니다.", variant: t.getAttribute("data-toast-variant") || "gold" });
    });
  }

  /* ───────────────────── COMMAND PALETTE (⌘K) ───────────────────── */
  function initCommandPalette() {
    const cmdk = $("[data-cmdk]");
    if (!cmdk) return;
    const input = $("[data-cmdk-input]", cmdk);
    const list = $(".cmdk__list", cmdk);
    const items = () => $$(".cmdk__item", cmdk).filter((i) => i.offsetParent !== null);
    let activeIdx = 0;

    const open = () => {
      cmdk.classList.add("is-open"); cmdk.setAttribute("aria-hidden", "false");
      pushOverlay(cmdk, close);
      if (input) { input.value = ""; filter(""); setTimeout(() => input.focus(), 50); }
    };
    const close = () => {
      cmdk.classList.remove("is-open"); cmdk.setAttribute("aria-hidden", "true");
      const idx = OverlayStack.findIndex((o) => o.el === cmdk);
      if (idx > -1) { OverlayStack.splice(idx, 1); if (!OverlayStack.length) lockScroll(false); }
    };
    const setActive = (idx) => {
      const its = items();
      if (!its.length) return;
      activeIdx = (idx + its.length) % its.length;
      $$(".cmdk__item", cmdk).forEach((i) => i.classList.remove("is-active"));
      its[activeIdx].classList.add("is-active");
      its[activeIdx].scrollIntoView({ block: "nearest" });
    };
    const filter = (q) => {
      q = q.toLowerCase().trim();
      $$(".cmdk__item", cmdk).forEach((i) => {
        const txt = (i.textContent || "").toLowerCase();
        i.style.display = !q || txt.includes(q) ? "" : "none";
      });
      $$(".cmdk__group-label", cmdk).forEach((g) => {
        let sib = g.nextElementSibling, any = false;
        while (sib && !sib.classList.contains("cmdk__group-label")) { if (sib.classList.contains("cmdk__item") && sib.style.display !== "none") any = true; sib = sib.nextElementSibling; }
        g.style.display = any ? "" : "none";
      });
      let empty = $(".cmdk__empty", cmdk);
      const none = items().length === 0;
      if (none && !empty) { empty = document.createElement("div"); empty.className = "cmdk__empty"; empty.textContent = "결과가 없습니다"; list.appendChild(empty); }
      if (empty) empty.style.display = none ? "" : "none";
      setActive(0);
    };
    const exec = (item) => {
      if (!item) return;
      const href = item.getAttribute("data-href");
      const action = item.getAttribute("data-action");
      close();
      if (action === "toggle-theme") Theme.toggle();
      else if (href) window.location.href = href;
      else toast({ message: (item.querySelector("span:not(svg)")?.textContent || item.textContent || "").trim() + " 실행" });
    };

    if (input) input.addEventListener("input", () => filter(input.value));
    cmdk.addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown") { e.preventDefault(); setActive(activeIdx + 1); }
      else if (e.key === "ArrowUp") { e.preventDefault(); setActive(activeIdx - 1); }
      else if (e.key === "Enter") { e.preventDefault(); exec(items()[activeIdx]); }
    });
    list.addEventListener("click", (e) => { const it = e.target.closest(".cmdk__item"); if (it) exec(it); });
    cmdk.addEventListener("click", (e) => { if (e.target === cmdk) close(); });

    document.addEventListener("keydown", (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); cmdk.classList.contains("is-open") ? close() : open(); }
    });
    document.addEventListener("click", (e) => { if (e.target.closest("[data-cmdk-open]")) { e.preventDefault(); open(); } });
  }

  /* ───────────────────── SEGMENTED CONTROL ───────────────────── */
  function initSegmented() {
    $$("[data-segmented]").forEach((seg) => {
      const btns = $$("button, [role=tab]", seg);
      seg.addEventListener("click", (e) => {
        const b = e.target.closest("button, [role=tab]"); if (!b) return;
        btns.forEach((x) => x.setAttribute("aria-selected", String(x === b)));
        seg.dispatchEvent(new CustomEvent("segmentchange", { detail: { value: b.getAttribute("data-value") || b.textContent.trim() } }));
      });
    });
  }

  /* ───────────────────── SLIDER ───────────────────── */
  function paintSlider(input) {
    const min = +input.min || 0, max = +input.max || 100, val = +input.value;
    const pct = ((val - min) / (max - min)) * 100;
    input.style.background = "linear-gradient(90deg, var(--color-primary) " + pct + "%, var(--color-border-strong) " + pct + "%)";
    const out = input.closest(".slider")?.querySelector("[data-slider-value]") || (input.getAttribute("data-output") && $("#" + input.getAttribute("data-output")));
    if (out) out.textContent = (input.getAttribute("data-prefix") || "") + val + (input.getAttribute("data-suffix") || "");
  }
  function initSliders() {
    $$('input[type="range"]').forEach((input) => { paintSlider(input); input.addEventListener("input", () => paintSlider(input)); });
  }

  /* ───────────────────── STEPPER ───────────────────── */
  function initSteppers() {
    $$(".stepper").forEach((st) => {
      const input = $("input", st);
      st.addEventListener("click", (e) => {
        const b = e.target.closest("button[data-step]"); if (!b || !input) return;
        const delta = +b.getAttribute("data-step");
        const min = input.min === "" ? -Infinity : +input.min, max = input.max === "" ? Infinity : +input.max;
        input.value = Math.max(min, Math.min(max, (+input.value || 0) + delta));
        input.dispatchEvent(new Event("change", { bubbles: true }));
      });
    });
  }

  /* ───────────────────── COMBOBOX / MULTISELECT ───────────────────── */
  function initComboboxes() {
    $$("[data-combobox]").forEach((cb) => {
      const input = $("input", cb), menu = $(".combobox__menu", cb);
      if (!input || !menu) return;
      const multi = cb.hasAttribute("data-multi");
      const opts = () => $$(".combobox__option", menu);
      const show = () => { menu.hidden = false; };
      const hide = () => { menu.hidden = true; };
      input.addEventListener("focus", show);
      input.addEventListener("input", () => {
        show();
        const q = input.value.toLowerCase();
        opts().forEach((o) => { o.style.display = o.textContent.toLowerCase().includes(q) ? "" : "none"; });
      });
      menu.addEventListener("click", (e) => {
        const o = e.target.closest(".combobox__option"); if (!o) return;
        if (multi) {
          o.setAttribute("aria-selected", String(o.getAttribute("aria-selected") !== "true"));
        } else {
          opts().forEach((x) => x.setAttribute("aria-selected", "false"));
          o.setAttribute("aria-selected", "true");
          input.value = o.getAttribute("data-value") || o.textContent.trim();
          hide();
        }
      });
      document.addEventListener("click", (e) => { if (!cb.contains(e.target)) hide(); });
      input.addEventListener("keydown", (e) => { if (e.key === "Escape") hide(); });
      hide();
    });
  }

  /* ───────────────────── TABLE: sort · select · paginate ───────────────────── */
  function initTables() {
    $$("[data-table]").forEach((table) => {
      const tbody = $("tbody", table);
      if (!tbody) return;
      let rows = $$("tr", tbody);

      // sorting
      $$("th[data-sort]", table).forEach((th, colVisual) => {
        const colIndex = Array.from(th.parentNode.children).indexOf(th);
        th.classList.add("is-sortable");
        if (!$(".sort-ic", th)) {
          const ic = document.createElement("span"); ic.className = "sort-ic";
          ic.innerHTML = '<svg viewBox="0 0 24 24"><path d="M8 9l4-4 4 4M8 15l4 4 4-4"/></svg>';
          th.appendChild(ic);
        }
        th.addEventListener("click", () => {
          const numeric = th.getAttribute("data-sort") === "num";
          const cur = th.getAttribute("aria-sort");
          const dir = cur === "ascending" ? "descending" : "ascending";
          $$("th[data-sort]", table).forEach((o) => o.removeAttribute("aria-sort"));
          th.setAttribute("aria-sort", dir);
          const sorted = $$("tr", tbody).sort((a, b) => {
            let av = a.children[colIndex]?.getAttribute("data-value") ?? a.children[colIndex]?.textContent.trim() ?? "";
            let bv = b.children[colIndex]?.getAttribute("data-value") ?? b.children[colIndex]?.textContent.trim() ?? "";
            if (numeric) { av = parseFloat(String(av).replace(/[^0-9.\-]/g, "")) || 0; bv = parseFloat(String(bv).replace(/[^0-9.\-]/g, "")) || 0; }
            return (av > bv ? 1 : av < bv ? -1 : 0) * (dir === "ascending" ? 1 : -1);
          });
          sorted.forEach((r) => tbody.appendChild(r));
          if (paginate) applyPage(1);
        });
      });

      // select all / row select
      const selAll = $("[data-select-all]", table);
      const countEl = table.closest("[data-table-root]")?.querySelector("[data-selected-count]") || document.querySelector("[data-selected-count]");
      const updateCount = () => {
        const n = $$('[data-row-check]:checked', table).length;
        if (countEl) countEl.textContent = n;
        $$('[data-row-check]', table).forEach((c) => c.closest("tr").classList.toggle("is-selected", c.checked));
        if (selAll) { const all = $$('[data-row-check]', table); selAll.indeterminate = n > 0 && n < all.length; selAll.checked = n > 0 && n === all.length; }
      };
      if (selAll) selAll.addEventListener("change", () => { $$('[data-row-check]', table).forEach((c) => { c.checked = selAll.checked; }); updateCount(); });
      table.addEventListener("change", (e) => { if (e.target.matches("[data-row-check]")) updateCount(); });

      // pagination
      const paginate = table.hasAttribute("data-paginate") ? (+table.getAttribute("data-paginate") || 8) : 0;
      const pager = table.closest("[data-table-root]")?.querySelector("[data-pager]") || (table.nextElementSibling?.matches?.("[data-pager]") ? table.nextElementSibling : null);
      function applyPage(page) {
        rows = $$("tr", tbody);
        const total = Math.max(1, Math.ceil(rows.length / paginate));
        page = Math.max(1, Math.min(total, page));
        rows.forEach((r, i) => { r.style.display = (i >= (page - 1) * paginate && i < page * paginate) ? "" : "none"; });
        if (pager) buildPager(page, total);
      }
      function buildPager(page, total) {
        pager.innerHTML = "";
        const mk = (label, p, opts = {}) => {
          const b = document.createElement("button"); b.className = "pagination__btn"; b.innerHTML = label;
          if (opts.current) b.setAttribute("aria-current", "page");
          if (opts.disabled) b.disabled = true;
          if (!opts.disabled) b.addEventListener("click", () => applyPage(p));
          return b;
        };
        pager.appendChild(mk('<svg viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg>', page - 1, { disabled: page === 1 }));
        for (let i = 1; i <= total; i++) {
          if (total > 7 && i > 2 && i < total - 1 && Math.abs(i - page) > 1) {
            if (i === 3 || i === total - 2) { const e = document.createElement("span"); e.className = "pagination__ellipsis"; e.textContent = "…"; pager.appendChild(e); }
            continue;
          }
          pager.appendChild(mk(String(i), i, { current: i === page }));
        }
        pager.appendChild(mk('<svg viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>', page + 1, { disabled: page === total }));
      }
      if (paginate) applyPage(1);
      updateCount();
    });
  }

  /* ───────────────────── CAROUSEL ───────────────────── */
  function initCarousels() {
    $$("[data-carousel]").forEach((car) => {
      const track = $(".carousel__track", car);
      const slides = $$(".carousel__slide", car);
      const dotsWrap = $(".carousel__dots", car);
      let idx = 0;
      if (dotsWrap && !dotsWrap.children.length) slides.forEach((_, i) => { const d = document.createElement("button"); d.className = "carousel__dot" + (i === 0 ? " is-active" : ""); d.setAttribute("aria-label", "슬라이드 " + (i + 1)); d.addEventListener("click", () => go(i)); dotsWrap.appendChild(d); });
      const dots = dotsWrap ? $$(".carousel__dot", dotsWrap) : [];
      function go(n) {
        idx = (n + slides.length) % slides.length;
        track.style.transform = "translateX(-" + idx * 100 + "%)";
        dots.forEach((d, i) => d.classList.toggle("is-active", i === idx));
      }
      $(".carousel__btn--next", car)?.addEventListener("click", () => go(idx + 1));
      $(".carousel__btn--prev", car)?.addEventListener("click", () => go(idx - 1));
      car.setAttribute("tabindex", "0");
      car.addEventListener("keydown", (e) => { if (e.key === "ArrowRight") go(idx + 1); if (e.key === "ArrowLeft") go(idx - 1); });
      if (car.hasAttribute("data-autoplay") && !reduceMotion()) {
        let timer = setInterval(() => go(idx + 1), +car.getAttribute("data-autoplay") || 5000);
        car.addEventListener("mouseenter", () => clearInterval(timer));
      }
    });
  }

  /* ───────────────────── COPY TO CLIPBOARD ───────────────────── */
  function initCopy() {
    document.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-copy]"); if (!btn) return;
      const sel = btn.getAttribute("data-copy");
      let text = sel && sel.startsWith("#") ? ($(sel)?.innerText || "") : (sel || btn.getAttribute("data-copy-text") || "");
      const done = () => toast({ message: "클립보드에 복사됨", variant: "success", duration: 1800 });
      if (navigator.clipboard && text) navigator.clipboard.writeText(text).then(done).catch(done);
      else done();
    });
  }

  /* ───────────────────── PROGRESS RING ───────────────────── */
  function initRings() {
    $$("[data-ring]").forEach((ring) => {
      const val = Math.max(0, Math.min(100, +ring.getAttribute("data-ring") || 0));
      const circle = $(".progress-ring__fill", ring);
      const label = $(".progress-ring__label", ring);
      if (circle) {
        const r = circle.r.baseVal.value, c = 2 * Math.PI * r;
        circle.style.strokeDasharray = c;
        circle.style.strokeDashoffset = reduceMotion() ? c * (1 - val / 100) : c;
        if (!reduceMotion()) requestAnimationFrame(() => setTimeout(() => { circle.style.strokeDashoffset = c * (1 - val / 100); }, 100));
      }
      if (label && !label.textContent.trim()) label.textContent = val + "%";
    });
  }

  /* ───────────────────── WIZARD ───────────────────── */
  function initWizards() {
    $$("[data-wizard]").forEach((wz) => {
      const steps = $$("[data-step-index]", wz);
      const panels = $$("[data-step-panel]", wz);
      let cur = 0;
      const render = () => {
        steps.forEach((s, i) => { s.classList.toggle("is-active", i === cur); s.classList.toggle("is-done", i < cur); });
        panels.forEach((p, i) => { p.hidden = i !== cur; });
        wz.querySelectorAll("[data-wizard-prev]").forEach((b) => b.disabled = cur === 0);
        const last = cur === panels.length - 1;
        wz.querySelectorAll("[data-wizard-next]").forEach((b) => { b.textContent = last ? "완료" : "다음 단계"; });
      };
      wz.addEventListener("click", (e) => {
        if (e.target.closest("[data-wizard-next]")) { if (cur < panels.length - 1) { cur++; render(); } else toast({ title: "완료", message: "온보딩이 끝났습니다.", variant: "success" }); }
        if (e.target.closest("[data-wizard-prev]")) { if (cur > 0) { cur--; render(); } }
      });
      render();
    });
  }

  /* ───────────────────── PRICING TOGGLE ───────────────────── */
  function initPricing() {
    $$("[data-pricing-toggle]").forEach((tog) => {
      const apply = (yearly) => {
        $$("[data-price]").forEach((el) => { el.textContent = el.getAttribute(yearly ? "data-price-yearly" : "data-price-monthly"); });
        $$("[data-period]").forEach((el) => { el.textContent = yearly ? "/ 년" : "/ 월"; });
        $$("[data-save]").forEach((el) => { el.style.visibility = yearly ? "visible" : "hidden"; });
      };
      tog.addEventListener("segmentchange", (e) => apply(e.detail.value === "yearly"));
      tog.addEventListener("change", (e) => { if (e.target.matches("input")) apply(e.target.checked); });
    });
  }

  /* ───────────────────── SCROLL REVEAL ─────────────────────
   * IO-driven entrance, with a safety net so content is NEVER permanently
   * hidden: anything still concealed after the grace window (no scroll, or a
   * reveal nested in a display:none tab/wizard panel) is simply shown.       */
  function initReveal() {
    const els = $$("[data-reveal]");
    if (!els.length) return;
    const showAll = () => els.forEach((e) => e.classList.add("reveal-in"));
    if (reduceMotion() || !("IntersectionObserver" in window)) { showAll(); return; }

    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("reveal-in"); io.unobserve(en.target); } });
    }, { threshold: 0, rootMargin: "0px 0px -6% 0px" });
    els.forEach((e) => io.observe(e));

    // Safety net 1: if the user never scrolls, reveal what's at/above the fold
    // plus a screenful below, so a no-scroll view is never blank.
    const revealNearTop = () => els.forEach((e) => {
      if (e.classList.contains("reveal-in")) return;
      const r = e.getBoundingClientRect();
      if (r.top < window.innerHeight * 1.6) e.classList.add("reveal-in");
    });
    if (window.requestIdleCallback) requestIdleCallback(revealNearTop, { timeout: 800 });
    else setTimeout(revealNearTop, 600);

    // Safety net 2: absolute fallback — nothing stays hidden forever (covers
    // reveals that became visible via tab/accordion/wizard toggles).
    let armed = true;
    const disarm = () => { armed = false; };
    window.addEventListener("scroll", disarm, { once: true, passive: true });
    setTimeout(() => { if (armed) showAll(); }, 2600);
  }

  /* ───────────────────── LIVE CLOCK / year ───────────────────── */
  function initMisc() {
    $$("[data-year]").forEach((e) => { e.textContent = new Date().getFullYear(); });
    // smooth in-page anchor
    document.addEventListener("click", (e) => {
      const a = e.target.closest('a[href^="#"]:not([href="#"])');
      if (a) { const t = $(a.getAttribute("href")); if (t) { e.preventDefault(); t.scrollIntoView({ behavior: reduceMotion() ? "auto" : "smooth", block: "start" }); } }
    });
  }

  /* ───────────────────── BOOT ───────────────────── */
  function boot() {
    Theme.init();
    initNav(); initModals(); initDrawers(); initTabs(); initAccordion();
    initDropdowns(); initContextMenus(); initToastTriggers(); initCommandPalette();
    initSegmented(); initSliders(); initSteppers(); initComboboxes();
    initTables(); initCarousels(); initCopy(); initRings(); initWizards();
    initPricing(); initReveal(); initMisc();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
