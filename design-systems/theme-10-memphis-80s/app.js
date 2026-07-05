/* ============================================================================
   THEME 10 — MEMPHIS 80s · app.js
   ----------------------------------------------------------------------------
   Vanilla JS. Zero dependencies. Powers every interaction across all pages.
   Initializes by scanning the DOM for data-* hooks, so the same script drives
   index.html and every page in pages/. Idempotent + defensive.

   Public API (window.Memphis):
     .toast({title, text, variant, timeout})
     .openModal(id) / .closeModal(el)
     .openDrawer(id) / .closeDrawer(el)
     .setTheme('light'|'dark') / .toggleTheme()
   ========================================================================== */
(function () {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $  = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const on = (el, ev, fn, opts) => el && el.addEventListener(ev, fn, opts);

  const Memphis = {};
  window.Memphis = Memphis;

  /* ===================================================================== *
   * THEME (light / dark) + persistence                                    *
   * ===================================================================== */
  const THEME_KEY = "memphis-theme";
  Memphis.setTheme = function (mode) {
    document.documentElement.setAttribute("data-theme", mode);
    try { localStorage.setItem(THEME_KEY, mode); } catch (e) {}
    $$("[data-theme-toggle]").forEach((b) => {
      b.setAttribute("aria-pressed", String(mode === "dark"));
      const lbl = b.querySelector("[data-theme-label]");
      if (lbl) lbl.textContent = mode === "dark" ? "다크" : "라이트";
    });
  };
  Memphis.toggleTheme = function () {
    const cur = document.documentElement.getAttribute("data-theme") || "light";
    Memphis.setTheme(cur === "dark" ? "light" : "dark");
  };
  function initTheme() {
    let saved = null;
    try { saved = localStorage.getItem(THEME_KEY); } catch (e) {}
    if (saved) document.documentElement.setAttribute("data-theme", saved);
    else if (window.matchMedia("(prefers-color-scheme: dark)").matches)
      document.documentElement.setAttribute("data-theme", "dark");
    else document.documentElement.setAttribute("data-theme", "light");
    Memphis.setTheme(document.documentElement.getAttribute("data-theme"));
    $$("[data-theme-toggle]").forEach((b) => on(b, "click", Memphis.toggleTheme));
  }

  /* ===================================================================== *
   * FLOATING SHAPES (background confetti)                                  *
   * ===================================================================== */
  function initFloatingShapes() {
    const layer = $("#floating-shapes");
    if (!layer || reduceMotion) return;
    const shapes = [
      "deco--squiggle", "deco--triangle", "deco--halfcircle", "deco--dot",
      "deco--ring", "deco--zigzag", "deco--star", "deco--blob", "deco--cross",
    ];
    const count = Math.min(14, Math.max(7, Math.round(window.innerWidth / 110)));
    for (let i = 0; i < count; i++) {
      const s = document.createElement("span");
      s.className = "float-shape deco " + shapes[i % shapes.length];
      const size = 30 + Math.random() * 64;
      s.style.width = size + "px";
      s.style.height = size + "px";
      s.style.left = Math.random() * 96 + "vw";
      s.style.top = Math.random() * 92 + "vh";
      s.style.setProperty("--dur", (14 + Math.random() * 16) + "s");
      s.style.setProperty("--delay", (-Math.random() * 18) + "s");
      s.style.opacity = (0.55 + Math.random() * 0.35).toFixed(2);
      layer.appendChild(s);
    }
  }

  /* ===================================================================== *
   * SCROLL LOCK + FOCUS TRAP helpers                                      *
   * ===================================================================== */
  let lockCount = 0;
  function lockScroll() { if (lockCount++ === 0) document.body.style.overflow = "hidden"; }
  function unlockScroll() { if (--lockCount <= 0) { lockCount = 0; document.body.style.overflow = ""; } }
  const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';
  function trapFocus(container, e) {
    const items = $$(FOCUSABLE, container).filter((el) => el.offsetParent !== null);
    if (!items.length) return;
    const first = items[0], last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  /* ===================================================================== *
   * MODAL / DIALOG                                                         *
   * ===================================================================== */
  let lastFocused = null;
  Memphis.openModal = function (id) {
    const scrim = document.getElementById(id);
    if (!scrim) return;
    lastFocused = document.activeElement;
    scrim.hidden = false;
    lockScroll();
    const dialog = $(".modal", scrim) || scrim;
    const focusEl = $("[data-autofocus]", scrim) || $("[autofocus]", scrim) || $(FOCUSABLE, scrim);
    if (focusEl) focusEl.focus();
    scrim._keyHandler = function (e) {
      if (e.key === "Escape") Memphis.closeModal(scrim);
      else if (e.key === "Tab") trapFocus(dialog, e);
    };
    on(document, "keydown", scrim._keyHandler);
  };
  Memphis.closeModal = function (scrim) {
    if (typeof scrim === "string") scrim = document.getElementById(scrim);
    if (!scrim || scrim.hidden) return;
    scrim.classList.add("is-closing");
    document.removeEventListener("keydown", scrim._keyHandler);
    const finish = () => { scrim.hidden = true; scrim.classList.remove("is-closing"); unlockScroll(); if (lastFocused) lastFocused.focus(); };
    if (reduceMotion) finish();
    else setTimeout(finish, 150);
  };
  function initModals() {
    $$("[data-modal-open]").forEach((t) => on(t, "click", () => Memphis.openModal(t.getAttribute("data-modal-open"))));
    $$(".scrim[data-modal]").forEach((scrim) => {
      on(scrim, "mousedown", (e) => { if (e.target === scrim) Memphis.closeModal(scrim); });
      $$("[data-modal-close]", scrim).forEach((c) => on(c, "click", () => Memphis.closeModal(scrim)));
    });
  }

  /* ===================================================================== *
   * DRAWER                                                                 *
   * ===================================================================== */
  Memphis.openDrawer = function (id) {
    const wrap = document.getElementById(id);
    if (!wrap) return;
    lastFocused = document.activeElement;
    wrap.hidden = false;
    lockScroll();
    const panel = $(".drawer", wrap) || wrap;
    const f = $(FOCUSABLE, panel); if (f) f.focus();
    wrap._keyHandler = function (e) {
      if (e.key === "Escape") Memphis.closeDrawer(wrap);
      else if (e.key === "Tab") trapFocus(panel, e);
    };
    on(document, "keydown", wrap._keyHandler);
  };
  Memphis.closeDrawer = function (wrap) {
    if (typeof wrap === "string") wrap = document.getElementById(wrap);
    if (!wrap || wrap.hidden) return;
    const panel = $(".drawer", wrap);
    if (panel) panel.classList.add("is-closing");
    wrap.classList.add("is-closing");
    document.removeEventListener("keydown", wrap._keyHandler);
    const finish = () => { wrap.hidden = true; wrap.classList.remove("is-closing"); if (panel) panel.classList.remove("is-closing"); unlockScroll(); if (lastFocused) lastFocused.focus(); };
    if (reduceMotion) finish();
    else setTimeout(finish, 200);
  };
  function initDrawers() {
    $$("[data-drawer-open]").forEach((t) => on(t, "click", () => Memphis.openDrawer(t.getAttribute("data-drawer-open"))));
    $$("[data-drawer]").forEach((wrap) => {
      on(wrap, "mousedown", (e) => { if (e.target === wrap) Memphis.closeDrawer(wrap); });
      $$("[data-drawer-close]", wrap).forEach((c) => on(c, "click", () => Memphis.closeDrawer(wrap)));
    });
  }

  /* ===================================================================== *
   * TOAST                                                                  *
   * ===================================================================== */
  function toastRegion() {
    let r = $(".toast-region");
    if (!r) { r = document.createElement("div"); r.className = "toast-region"; r.setAttribute("role", "region"); r.setAttribute("aria-label", "알림"); document.body.appendChild(r); }
    return r;
  }
  const TOAST_ICON = {
    success: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
    danger:  '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M12 8v5M12 17h.01"/><path d="M12 3 2 20h20z"/></svg>',
    warning: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M12 9v4M12 17h.01"/><circle cx="12" cy="12" r="9"/></svg>',
    info:    '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M12 11v5M12 7h.01"/><circle cx="12" cy="12" r="9"/></svg>',
  };
  Memphis.toast = function (opts) {
    opts = opts || {};
    const variant = opts.variant || "info";
    const region = toastRegion();
    const el = document.createElement("div");
    el.className = "toast toast--" + variant;
    el.setAttribute("role", variant === "danger" ? "alert" : "status");
    el.innerHTML =
      '<span class="toast__icon" aria-hidden="true">' + (TOAST_ICON[variant] || TOAST_ICON.info) + "</span>" +
      '<div class="toast__body">' +
        (opts.title ? '<div class="toast__title">' + escapeHtml(opts.title) + "</div>" : "") +
        (opts.text ? '<div class="toast__text">' + escapeHtml(opts.text) + "</div>" : "") +
      "</div>" +
      '<button class="toast__close" aria-label="닫기">✕</button>';
    region.appendChild(el);
    const close = () => {
      el.classList.add("is-leaving");
      const done = () => el.remove();
      if (reduceMotion) done(); else setTimeout(done, 240);
    };
    on($(".toast__close", el), "click", close);
    const timeout = opts.timeout == null ? 4200 : opts.timeout;
    if (timeout > 0) setTimeout(close, timeout);
    return el;
  };
  function initToastTriggers() {
    $$("[data-toast]").forEach((t) => on(t, "click", () => {
      Memphis.toast({
        title: t.getAttribute("data-toast-title") || "알려드려요",
        text: t.getAttribute("data-toast-text") || "",
        variant: t.getAttribute("data-toast") || "info",
      });
    }));
  }

  /* ===================================================================== *
   * TABS  (role=tablist, arrow-key navigation)                            *
   * ===================================================================== */
  function initTabs() {
    $$("[data-tabs]").forEach((group) => {
      const tabs = $$('[role="tab"]', group);
      const panels = $$('[role="tabpanel"]', group);
      function select(idx) {
        tabs.forEach((t, i) => {
          const on_ = i === idx;
          t.setAttribute("aria-selected", String(on_));
          t.tabIndex = on_ ? 0 : -1;
          if (panels[i]) panels[i].hidden = !on_;
        });
      }
      tabs.forEach((tab, i) => {
        on(tab, "click", () => { select(i); tab.focus(); });
        on(tab, "keydown", (e) => {
          let n = null;
          if (e.key === "ArrowRight" || e.key === "ArrowDown") n = (i + 1) % tabs.length;
          else if (e.key === "ArrowLeft" || e.key === "ArrowUp") n = (i - 1 + tabs.length) % tabs.length;
          else if (e.key === "Home") n = 0;
          else if (e.key === "End") n = tabs.length - 1;
          if (n !== null) { e.preventDefault(); select(n); tabs[n].focus(); }
        });
      });
      const start = tabs.findIndex((t) => t.getAttribute("aria-selected") === "true");
      select(start < 0 ? 0 : start);
    });
  }

  /* ===================================================================== *
   * ACCORDION                                                             *
   * ===================================================================== */
  function initAccordion() {
    $$("[data-accordion]").forEach((acc) => {
      const single = acc.getAttribute("data-accordion") === "single";
      $$(".accordion__trigger", acc).forEach((trig) => {
        on(trig, "click", () => {
          const expanded = trig.getAttribute("aria-expanded") === "true";
          if (single && !expanded) {
            $$(".accordion__trigger", acc).forEach((o) => {
              o.setAttribute("aria-expanded", "false");
              const p = document.getElementById(o.getAttribute("aria-controls"));
              if (p) p.hidden = true;
            });
          }
          trig.setAttribute("aria-expanded", String(!expanded));
          const panel = document.getElementById(trig.getAttribute("aria-controls"));
          if (panel) panel.hidden = expanded;
        });
      });
    });
  }

  /* ===================================================================== *
   * DROPDOWN / MENU / POPOVER (click toggle, outside-close, ESC)          *
   * ===================================================================== */
  function initDropdowns() {
    $$("[data-dropdown]").forEach((dd) => {
      const trigger = $("[data-dropdown-trigger]", dd);
      const menu = $(".dropdown__menu, .popover__panel, .menu", dd);
      if (!trigger || !menu) return;
      menu.hidden = true;
      trigger.setAttribute("aria-haspopup", "true");
      trigger.setAttribute("aria-expanded", "false");
      const close = () => { menu.hidden = true; trigger.setAttribute("aria-expanded", "false"); };
      const open = () => {
        $$("[data-dropdown] .dropdown__menu, [data-dropdown] .popover__panel, [data-dropdown] .menu").forEach((m) => { if (m !== menu) m.hidden = true; });
        menu.hidden = false; trigger.setAttribute("aria-expanded", "true");
        const f = $(FOCUSABLE, menu); if (f) f.focus();
      };
      on(trigger, "click", (e) => { e.stopPropagation(); menu.hidden ? open() : close(); });
      on(menu, "click", (e) => { if (e.target.closest(".menu__item, [data-close-menu]")) close(); });
      on(document, "keydown", (e) => { if (e.key === "Escape" && !menu.hidden) { close(); trigger.focus(); } });
    });
    on(document, "click", (e) => {
      $$("[data-dropdown]").forEach((dd) => {
        if (!dd.contains(e.target)) {
          const menu = $(".dropdown__menu, .popover__panel, .menu", dd);
          const trigger = $("[data-dropdown-trigger]", dd);
          if (menu && !menu.hidden) { menu.hidden = true; if (trigger) trigger.setAttribute("aria-expanded", "false"); }
        }
      });
    });
  }

  /* ===================================================================== *
   * CONTEXT MENU                                                          *
   * ===================================================================== */
  function initContextMenus() {
    $$("[data-context-menu]").forEach((zone) => {
      const menu = document.getElementById(zone.getAttribute("data-context-menu"));
      if (!menu) return;
      on(zone, "contextmenu", (e) => {
        e.preventDefault();
        menu.hidden = false;
        const w = menu.offsetWidth, h = menu.offsetHeight;
        menu.style.left = Math.min(e.clientX, window.innerWidth - w - 8) + "px";
        menu.style.top = Math.min(e.clientY, window.innerHeight - h - 8) + "px";
      });
      const hide = () => (menu.hidden = true);
      on(document, "click", hide);
      on(document, "keydown", (e) => { if (e.key === "Escape") hide(); });
      $$(".menu__item", menu).forEach((it) => on(it, "click", hide));
    });
  }

  /* ===================================================================== *
   * COMMAND PALETTE (⌘K / Ctrl+K)                                        *
   * ===================================================================== */
  function initCommandPalette() {
    const scrim = $("#cmdk");
    if (!scrim) return;
    const input = $(".cmdk__input", scrim);
    const list = $(".cmdk__list", scrim);
    const items = $$(".cmdk__item", list);
    let active = 0;

    function visibleItems() { return items.filter((i) => !i.hidden); }
    function setActive(idx) {
      const vis = visibleItems();
      if (!vis.length) return;
      active = (idx + vis.length) % vis.length;
      items.forEach((i) => i.setAttribute("aria-selected", "false"));
      vis[active].setAttribute("aria-selected", "true");
      vis[active].scrollIntoView({ block: "nearest" });
    }
    function filter(q) {
      q = q.trim().toLowerCase();
      let any = false;
      items.forEach((i) => {
        const match = i.textContent.toLowerCase().includes(q);
        i.hidden = !match;
        if (match) any = true;
      });
      $$(".cmdk__group-label", list).forEach((g) => {
        let sib = g.nextElementSibling, vis = false;
        while (sib && sib.classList.contains("cmdk__item")) { if (!sib.hidden) vis = true; sib = sib.nextElementSibling; }
        g.hidden = !vis;
      });
      let empty = $(".cmdk__empty", list);
      if (!any) { if (!empty) { empty = document.createElement("div"); empty.className = "cmdk__empty"; empty.setAttribute("role", "status"); empty.setAttribute("aria-live", "polite"); empty.textContent = "결과가 없어요 — 더 요란하게 검색해 보세요."; list.appendChild(empty); } empty.hidden = false; }
      else if (empty) empty.hidden = true;
      active = 0; setActive(0);
    }
    const open = () => {
      scrim.hidden = false; lockScroll();
      input.value = ""; filter(""); input.focus();
    };
    const close = () => { scrim.hidden = true; unlockScroll(); };
    Memphis.openCommandPalette = open;

    $$("[data-cmdk-open]").forEach((b) => on(b, "click", open));
    on(document, "keydown", (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); scrim.hidden ? open() : close(); }
      if (scrim.hidden) return;
      if (e.key === "Escape") close();
      else if (e.key === "ArrowDown") { e.preventDefault(); setActive(active + 1); }
      else if (e.key === "ArrowUp") { e.preventDefault(); setActive(active - 1); }
      else if (e.key === "Enter") { const vis = visibleItems(); if (vis[active]) vis[active].click(); }
    });
    on(input, "input", () => filter(input.value));
    on(scrim, "mousedown", (e) => { if (e.target === scrim) close(); });
    items.forEach((it) => on(it, "click", () => {
      close();
      const label = (it.querySelector(".cmdk__label") || it).textContent.trim();
      if (it.dataset.href) window.location.href = it.dataset.href;
      else Memphis.toast({ title: "명령 실행", text: label, variant: "info" });
    }));
  }

  /* ===================================================================== *
   * TABLE (sort · select-all · live count)                               *
   * ===================================================================== */
  function initTables() {
    $$("[data-table]").forEach((wrap) => {
      const table = $("table", wrap) || wrap;
      const tbody = $("tbody", table);
      // Sorting
      $$("th.is-sortable", table).forEach((th, colIndex) => {
        const idx = Array.from(th.parentNode.children).indexOf(th);
        th.setAttribute("aria-sort", "none");
        on(th, "click", () => {
          const asc = th.getAttribute("aria-sort") !== "ascending";
          $$("th", table).forEach((o) => o.setAttribute("aria-sort", "none"));
          th.setAttribute("aria-sort", asc ? "ascending" : "descending");
          const rows = $$("tr", tbody);
          const type = th.getAttribute("data-sort") || "text";
          rows.sort((a, b) => {
            let x = a.children[idx].getAttribute("data-value") || a.children[idx].textContent.trim();
            let y = b.children[idx].getAttribute("data-value") || b.children[idx].textContent.trim();
            if (type === "number") { x = parseFloat(x.replace(/[^0-9.\-]/g, "")) || 0; y = parseFloat(y.replace(/[^0-9.\-]/g, "")) || 0; return asc ? x - y : y - x; }
            return asc ? String(x).localeCompare(y) : String(y).localeCompare(x);
          });
          rows.forEach((r) => tbody.appendChild(r));
        });
      });
      // Select all + per-row
      const selectAll = $('[data-select-all]', wrap);
      const updateCount = () => {
        const n = $$('tbody [data-row-check]:checked', table).length;
        const c = $('[data-selected-count]', wrap);
        if (c) c.textContent = n ? n + "개 선택됨" : "";
        $$("tbody tr", table).forEach((tr) => {
          const cb = $('[data-row-check]', tr);
          tr.classList.toggle("is-selected", !!(cb && cb.checked));
        });
      };
      if (selectAll) on(selectAll, "change", () => {
        $$('tbody [data-row-check]', table).forEach((cb) => (cb.checked = selectAll.checked));
        updateCount();
      });
      $$('tbody [data-row-check]', table).forEach((cb) => on(cb, "change", () => {
        if (selectAll) { const all = $$('tbody [data-row-check]', table); selectAll.checked = all.every((c) => c.checked); selectAll.indeterminate = !selectAll.checked && all.some((c) => c.checked); }
        updateCount();
      }));
    });
  }

  /* ===================================================================== *
   * PAGINATION (visual, emits data-page)                                 *
   * ===================================================================== */
  function initPagination() {
    $$("[data-pagination]").forEach((pg) => {
      $$(".pagination__btn[data-page]", pg).forEach((btn) => on(btn, "click", () => {
        $$(".pagination__btn", pg).forEach((b) => b.removeAttribute("aria-current"));
        btn.setAttribute("aria-current", "page");
      }));
    });
  }

  /* ===================================================================== *
   * CAROUSEL                                                             *
   * ===================================================================== */
  function initCarousels() {
    $$("[data-carousel]").forEach((car) => {
      const track = $(".carousel__track", car);
      const slides = $$(".carousel__slide", track);
      const dotsWrap = $(".carousel__dots", car);
      let idx = 0;
      if (dotsWrap) {
        slides.forEach((_, i) => {
          const d = document.createElement("button");
          d.className = "carousel__dot" + (i === 0 ? " is-active" : "");
          d.type = "button";
          d.setAttribute("aria-label", (i + 1) + "번 슬라이드");
          if (i === 0) d.setAttribute("aria-current", "true");
          on(d, "click", () => go(i));
          on(d, "keydown", (e) => {
            if (e.key === "ArrowRight") { e.preventDefault(); go(idx + 1); focusDot(); }
            else if (e.key === "ArrowLeft") { e.preventDefault(); go(idx - 1); focusDot(); }
          });
          dotsWrap.appendChild(d);
        });
      }
      function focusDot() { if (dotsWrap) { const a = $(".carousel__dot.is-active", dotsWrap); if (a) a.focus(); } }
      function go(n) {
        idx = (n + slides.length) % slides.length;
        track.style.transform = "translateX(" + (-idx * 100) + "%)";
        if (dotsWrap) $$(".carousel__dot", dotsWrap).forEach((d, i) => {
          const on_ = i === idx;
          d.classList.toggle("is-active", on_);
          if (on_) d.setAttribute("aria-current", "true"); else d.removeAttribute("aria-current");
        });
      }
      on($(".carousel__btn--next", car), "click", () => go(idx + 1));
      on($(".carousel__btn--prev", car), "click", () => go(idx - 1));
      if (car.hasAttribute("data-autoplay") && !reduceMotion) {
        let timer = setInterval(() => go(idx + 1), 4500);
        on(car, "mouseenter", () => clearInterval(timer));
        on(car, "mouseleave", () => (timer = setInterval(() => go(idx + 1), 4500)));
      }
    });
  }

  /* ===================================================================== *
   * SLIDER value readout                                                 *
   * ===================================================================== */
  function initSliders() {
    $$("[data-slider]").forEach((wrap) => {
      const input = $('input[type="range"]', wrap);
      const out = $(".slider__value", wrap);
      if (!input) return;
      const fmt = wrap.getAttribute("data-suffix") || "";
      const sync = () => { if (out) out.textContent = input.value + fmt; };
      on(input, "input", sync); sync();
    });
  }

  /* ===================================================================== *
   * STEPPER                                                              *
   * ===================================================================== */
  function initSteppers() {
    $$("[data-stepper]").forEach((st) => {
      const input = $(".stepper__value", st);
      const min = input.hasAttribute("min") ? parseFloat(input.min) : -Infinity;
      const max = input.hasAttribute("max") ? parseFloat(input.max) : Infinity;
      const step = parseFloat(input.getAttribute("step") || "1");
      const clamp = (v) => Math.max(min, Math.min(max, v));
      $$("[data-step]", st).forEach((b) => on(b, "click", () => {
        input.value = clamp((parseFloat(input.value) || 0) + parseFloat(b.getAttribute("data-step")) * step);
      }));
    });
  }

  /* ===================================================================== *
   * RATING                                                               *
   * ===================================================================== */
  function initRatings() {
    $$("[data-rating]").forEach((r) => {
      const stars = $$(".rating__star", r);
      let value = parseInt(r.getAttribute("data-value") || "0", 10);
      const paint = (v) => stars.forEach((s, i) => s.classList.toggle("is-on", i < v));
      stars.forEach((s, i) => {
        s.setAttribute("tabindex", "0"); s.setAttribute("role", "radio");
        on(s, "click", () => { value = i + 1; paint(value); r.setAttribute("data-value", value); });
        on(s, "mouseenter", () => paint(i + 1));
        on(s, "keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); value = i + 1; paint(value); } });
      });
      on(r, "mouseleave", () => paint(value));
      paint(value);
    });
  }

  /* ===================================================================== *
   * CHIP INPUT                                                           *
   * ===================================================================== */
  function initChipInputs() {
    $$("[data-chip-input]").forEach((ci) => {
      const input = $("input", ci);
      const addChip = (text) => {
        text = text.trim(); if (!text) return;
        const chip = document.createElement("span");
        chip.className = "chip";
        chip.innerHTML = escapeHtml(text) + ' <button type="button" aria-label="' + escapeHtml(text) + ' 제거">✕</button>';
        ci.insertBefore(chip, input);
        on($("button", chip), "click", () => chip.remove());
      };
      on(input, "keydown", (e) => {
        if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addChip(input.value); input.value = ""; }
        else if (e.key === "Backspace" && !input.value) { const chips = $$(".chip", ci); if (chips.length) chips[chips.length - 1].remove(); }
      });
      $$(".chip button", ci).forEach((b) => on(b, "click", (e) => e.target.closest(".chip").remove()));
    });
  }

  /* ===================================================================== *
   * SEGMENTED CONTROL                                                    *
   * ===================================================================== */
  function initSegmented() {
    $$("[data-segmented]").forEach((seg) => {
      if (!seg.getAttribute("role")) seg.setAttribute("role", "radiogroup");
      const opts = $$(".segmented__option", seg);
      if (!opts.length) return;
      // Derive the initial choice from whatever legacy attribute the markup used…
      let current = opts.findIndex((o) =>
        o.getAttribute("aria-checked") === "true" ||
        o.getAttribute("aria-selected") === "true" ||
        o.classList.contains("is-active"));
      if (current < 0) current = 0;
      // …then re-express the whole group as a valid radiogroup (kills the invalid
      // plain-button + aria-selected combo flagged in the audit).
      const paint = (idx) => {
        opts.forEach((o, i) => {
          o.setAttribute("role", "radio");
          o.removeAttribute("aria-selected");
          o.setAttribute("aria-checked", String(i === idx));
          o.tabIndex = i === idx ? 0 : -1;
          o.classList.toggle("is-active", i === idx);
        });
      };
      const choose = (idx, focus) => {
        current = (idx + opts.length) % opts.length;
        paint(current);
        if (focus) opts[current].focus();
        seg.dispatchEvent(new CustomEvent("segmented:change", { detail: { value: opts[current].dataset.value } }));
      };
      paint(current);   // silent on load — never fires segmented:change
      opts.forEach((o, i) => {
        on(o, "click", () => choose(i, false));
        on(o, "keydown", (e) => {
          let n = null;
          if (e.key === "ArrowRight" || e.key === "ArrowDown") n = current + 1;
          else if (e.key === "ArrowLeft" || e.key === "ArrowUp") n = current - 1;
          else if (e.key === "Home") n = 0;
          else if (e.key === "End") n = opts.length - 1;
          if (n !== null) { e.preventDefault(); choose(n, true); }
        });
      });
    });
  }

  /* ===================================================================== *
   * CUSTOM SELECT / MULTISELECT / COMBOBOX                               *
   * ===================================================================== */
  function initCustomSelects() {
    $$("[data-select]").forEach((sel) => {
      const control = $(".select__control", sel);
      const menu = $(".select__menu", sel);
      const valueEl = $(".select__value", sel);
      const multi = sel.hasAttribute("data-multi");
      const input = $('input[data-combobox]', sel);
      if (!control || !menu) return;
      menu.hidden = true;
      const open = () => { menu.hidden = false; control.setAttribute("aria-expanded", "true"); if (input) input.focus(); };
      const close = () => { menu.hidden = true; control.setAttribute("aria-expanded", "false"); };
      const render = () => {
        const chosen = $$('.select__option[aria-selected="true"]', menu).map((o) => o.textContent.trim());
        if (!chosen.length) { valueEl.textContent = valueEl.getAttribute("data-placeholder") || "선택하세요…"; valueEl.classList.add("is-placeholder"); }
        else { valueEl.textContent = multi ? chosen.join(", ") : chosen[0]; valueEl.classList.remove("is-placeholder"); }
      };
      on(control, "click", () => (menu.hidden ? open() : close()));
      $$(".select__option", menu).forEach((opt) => on(opt, "click", () => {
        if (multi) opt.setAttribute("aria-selected", opt.getAttribute("aria-selected") === "true" ? "false" : "true");
        else { $$(".select__option", menu).forEach((o) => o.setAttribute("aria-selected", "false")); opt.setAttribute("aria-selected", "true"); close(); }
        render();
      }));
      if (input) on(input, "input", () => {
        const q = input.value.toLowerCase();
        $$(".select__option", menu).forEach((o) => (o.hidden = !o.textContent.toLowerCase().includes(q)));
      });
      on(document, "click", (e) => { if (!sel.contains(e.target)) close(); });
      on(document, "keydown", (e) => { if (e.key === "Escape") close(); });
      render();
    });
  }

  /* ===================================================================== *
   * CALENDAR / DATEPICKER                                                *
   * ===================================================================== */
  const DOW = ["일", "월", "화", "수", "목", "금", "토"];
  function buildCalendar(cal, onPick) {
    let view = new Date();
    view.setDate(1);
    let selected = null;
    function render() {
      const y = view.getFullYear(), m = view.getMonth();
      const first = new Date(y, m, 1).getDay();
      const days = new Date(y, m + 1, 0).getDate();
      const today = new Date();
      let html =
        '<div class="calendar__head">' +
          '<button class="calendar__nav" data-cal="-1" aria-label="이전 달">‹</button>' +
          '<span class="calendar__title">' + y + "년 " + (m + 1) + "월</span>" +
          '<button class="calendar__nav" data-cal="1" aria-label="다음 달">›</button>' +
        "</div><div class=\"calendar__grid\">";
      DOW.forEach((d) => (html += '<div class="calendar__dow">' + d + "</div>"));
      for (let i = 0; i < first; i++) html += '<div class="calendar__day is-muted"></div>';
      for (let d = 1; d <= days; d++) {
        const isToday = d === today.getDate() && m === today.getMonth() && y === today.getFullYear();
        const isSel = selected && d === selected.d && m === selected.m && y === selected.y;
        html += '<button class="calendar__day' + (isToday ? " is-today" : "") + (isSel ? " is-selected" : "") + '" data-day="' + d + '">' + d + "</button>";
      }
      html += "</div>";
      cal.innerHTML = html;
      $$("[data-cal]", cal).forEach((b) => on(b, "click", () => { view.setMonth(view.getMonth() + parseInt(b.dataset.cal, 10)); render(); }));
      $$("[data-day]", cal).forEach((b) => on(b, "click", () => {
        selected = { d: parseInt(b.dataset.day, 10), m: view.getMonth(), y: view.getFullYear() };
        render();
        if (onPick) onPick(new Date(selected.y, selected.m, selected.d));
      }));
    }
    render();
  }
  function initCalendars() {
    $$("[data-calendar]").forEach((cal) => buildCalendar(cal, null));
    $$("[data-datepicker]").forEach((dp) => {
      const input = $(".input", dp);
      const pop = $(".datepicker__pop", dp);
      const cal = $("[data-calendar-host]", dp) || pop;
      if (!cal) return;
      buildCalendar(cal, (date) => {
        input.value = date.getFullYear() + ". " + (date.getMonth() + 1) + ". " + date.getDate() + ".";
        pop.hidden = true;
      });
      on(input, "click", () => (pop.hidden = !pop.hidden));
      on(document, "click", (e) => { if (!dp.contains(e.target)) pop.hidden = true; });
    });
  }

  /* ===================================================================== *
   * DROPZONE (FileUpload)                                                *
   * ===================================================================== */
  function initDropzones() {
    $$("[data-dropzone]").forEach((dz) => {
      const input = $('input[type="file"]', dz);
      const list = $("[data-file-list]", dz) || (function () { const l = document.createElement("div"); l.className = "file-list"; l.setAttribute("data-file-list",""); dz.after(l); return l; })();
      const addFiles = (files) => {
        Array.from(files).forEach((f) => {
          const item = document.createElement("div");
          item.className = "file-item";
          item.innerHTML = '<span class="file-item__ico" aria-hidden="true"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/></svg></span><div class="grow"><div style="font-weight:600">' + escapeHtml(f.name) + '</div><div class="file-item__bar"><span style="width:100%"></span></div></div><button class="btn btn--ghost btn--sm btn--icon" aria-label="파일 제거">✕</button>';
          on($("button", item), "click", () => item.remove());
          list.appendChild(item);
        });
      };
      on(dz, "click", () => input && input.click());
      on(dz, "keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); input && input.click(); } });
      if (!dz.hasAttribute("tabindex")) dz.tabIndex = 0;
      if (input) on(input, "change", () => addFiles(input.files));
      ["dragover", "dragenter"].forEach((ev) => on(dz, ev, (e) => { e.preventDefault(); dz.classList.add("is-drag"); }));
      ["dragleave", "drop"].forEach((ev) => on(dz, ev, (e) => { e.preventDefault(); dz.classList.remove("is-drag"); }));
      on(dz, "drop", (e) => { if (e.dataTransfer) addFiles(e.dataTransfer.files); });
    });
  }

  /* ===================================================================== *
   * COPY-TO-CLIPBOARD                                                    *
   * ===================================================================== */
  function initCopy() {
    $$("[data-copy]").forEach((btn) => on(btn, "click", () => {
      const sel = btn.getAttribute("data-copy");
      const src = sel ? document.querySelector(sel) : btn.closest(".codeblock") && $(".codeblock pre", btn.closest(".codeblock"));
      const text = src ? src.textContent : "";
      const done = () => { const o = btn.textContent; btn.textContent = "복사됨!"; setTimeout(() => (btn.textContent = o), 1400); };
      if (navigator.clipboard) navigator.clipboard.writeText(text).then(done, done); else done();
    }));
  }

  /* ===================================================================== *
   * PRICING toggle (monthly / yearly)                                   *
   * ===================================================================== */
  function initPriceToggle() {
    $$("[data-price-toggle]").forEach((tg) => {
      const update = (yearly) => {
        $$("[data-price]").forEach((p) => { p.textContent = yearly ? p.getAttribute("data-yearly") : p.getAttribute("data-monthly"); });
        $$("[data-price-period]").forEach((p) => (p.textContent = yearly ? "/년" : "/월"));
        $$("[data-price-note]").forEach((n) => (n.hidden = !yearly));
      };
      if (tg.matches('input[type="checkbox"]')) on(tg, "change", () => update(tg.checked));
      else tg.addEventListener("segmented:change", (e) => update(e.detail.value === "yearly"));
    });
  }

  /* ===================================================================== *
   * WIZARD (Steps)                                                       *
   * ===================================================================== */
  function initWizards() {
    $$("[data-wizard]").forEach((wz) => {
      const steps = $$(".step", wz);
      const panels = $$("[data-wizard-panel]", wz);
      let cur = 0;
      function show(n) {
        cur = Math.max(0, Math.min(panels.length - 1, n));
        steps.forEach((s, i) => { s.classList.toggle("is-active", i === cur); s.classList.toggle("is-done", i < cur); });
        panels.forEach((p, i) => (p.hidden = i !== cur));
        const prev = $("[data-wizard-prev]", wz), next = $("[data-wizard-next]", wz), fin = $("[data-wizard-finish]", wz);
        if (prev) prev.disabled = cur === 0;
        if (next) next.hidden = cur === panels.length - 1;
        if (fin) fin.hidden = cur !== panels.length - 1;
      }
      on($("[data-wizard-next]", wz), "click", () => show(cur + 1));
      on($("[data-wizard-prev]", wz), "click", () => show(cur - 1));
      const fin = $("[data-wizard-finish]", wz);
      if (fin) on(fin, "click", () => Memphis.toast({ title: "준비 끝!", text: "설정을 모두 마쳤어요 — 이제 요란하게 시작해요.", variant: "success" }));
      show(0);
    });
  }

  /* ===================================================================== *
   * SIDEBAR collapse + mobile nav                                        *
   * ===================================================================== */
  function initSidebar() {
    $$("[data-sidebar-toggle]").forEach((b) => on(b, "click", () => {
      const sb = document.getElementById(b.getAttribute("data-sidebar-toggle")) || $(".sidebar");
      if (sb) sb.classList.toggle("is-collapsed");
    }));
  }

  /* ===================================================================== *
   * PROGRESS RING + animated bars                                       *
   * ===================================================================== */
  function initProgress() {
    $$("[data-progress-ring]").forEach((ring) => {
      const pct = Math.max(0, Math.min(100, parseFloat(ring.getAttribute("data-progress-ring")) || 0));
      const bar = $(".progress-ring__bar", ring);
      const num = $(".progress-ring__num", ring);
      if (!bar) return;
      const r = bar.r.baseVal.value;
      const c = 2 * Math.PI * r;
      bar.style.strokeDasharray = c;
      bar.style.strokeDashoffset = c;
      requestAnimationFrame(() => { bar.style.strokeDashoffset = c * (1 - pct / 100); });
      if (num) num.textContent = pct + "%";
    });
    $$("[data-progress]").forEach((p) => {
      const fill = $(".progress__fill", p);
      if (fill) requestAnimationFrame(() => (fill.style.width = (p.getAttribute("data-progress") || "0") + "%"));
    });
  }

  /* ===================================================================== *
   * POPOVER (standalone, not in dropdown wrapper)                        *
   * ===================================================================== */
  function initPopovers() {
    $$("[data-popover]").forEach((trigger) => {
      const panel = document.getElementById(trigger.getAttribute("data-popover"));
      if (!panel) return;
      panel.hidden = true;
      on(trigger, "click", (e) => { e.stopPropagation(); panel.hidden = !panel.hidden; });
      on(document, "click", (e) => { if (!panel.contains(e.target) && e.target !== trigger) panel.hidden = true; });
      on(document, "keydown", (e) => { if (e.key === "Escape") panel.hidden = true; });
    });
  }

  /* ===================================================================== *
   * STAGGERED REVEAL on load                                             *
   * ===================================================================== */
  function initReveal() {
    $$("[data-reveal]").forEach((el, i) => {
      el.classList.add("reveal");
      el.style.setProperty("--reveal-delay", (i % 12) * 60 + "ms");
      /* each element settles from a slightly different tilt — springy, not a uniform fade */
      el.style.setProperty("--reveal-rot", (i % 2 ? 1.6 : -1.6) + "deg");
    });
  }

  /* ===================================================================== *
   * SIGNATURE MOTION — CONFETTI BURST on primary press                    *
   * The theme's one-liner: pressing a primary button flings Memphis shapes *
   * out of it. Fully gated on reduced-motion (never spawns).              *
   * ===================================================================== */
  const BURST_SHAPES = [
    "--shape-squiggle", "--shape-triangle", "--shape-halfcircle", "--shape-dot",
    "--shape-ring", "--shape-zigzag", "--shape-star", "--shape-blob", "--shape-cross",
  ];
  function confettiLayer() {
    let l = document.getElementById("confetti-layer");
    if (!l) { l = document.createElement("div"); l.id = "confetti-layer"; l.setAttribute("aria-hidden", "true"); document.body.appendChild(l); }
    return l;
  }
  Memphis.burst = function (x, y, n) {
    if (reduceMotion) return;
    const layer = confettiLayer();
    n = n || 7;
    for (let i = 0; i < n; i++) {
      const bit = document.createElement("span");
      bit.className = "confetti-bit";
      bit.style.backgroundImage = "var(" + BURST_SHAPES[Math.floor(Math.random() * BURST_SHAPES.length)] + ")";
      bit.style.left = x + "px";
      bit.style.top = y + "px";
      bit.style.setProperty("--sz", (18 + Math.random() * 26).toFixed(0) + "px");
      const ang = (Math.PI * 2 * i) / n + (Math.random() - 0.5);
      const dist = 60 + Math.random() * 90;
      bit.style.setProperty("--dx", (Math.cos(ang) * dist).toFixed(1) + "px");
      bit.style.setProperty("--dy", (Math.sin(ang) * dist - 30).toFixed(1) + "px");   /* slight upward bias */
      bit.style.setProperty("--rot", (Math.random() * 540 - 270).toFixed(0) + "deg");
      bit.style.setProperty("--dur", (520 + Math.random() * 260).toFixed(0) + "ms");
      layer.appendChild(bit);
      setTimeout(() => bit.remove(), 900);
    }
  };
  function initConfetti() {
    if (reduceMotion) return;
    on(document, "click", (e) => {
      const t = e.target.closest("[data-confetti], .btn--primary");
      if (!t || t.disabled || t.classList.contains("is-disabled")) return;
      let x = e.clientX, y = e.clientY;
      if (!x && !y) { const r = t.getBoundingClientRect(); x = r.left + r.width / 2; y = r.top + r.height / 2; }
      Memphis.burst(x, y, 7);
    });
  }

  /* ===================================================================== *
   * HERO CURSOR-REPEL — scattered shapes dodge the pointer (playful)      *
   * ===================================================================== */
  function initHeroRepel() {
    if (reduceMotion) return;
    const hero = $(".hero");
    if (!hero) return;
    const decos = $$(".deco", hero);
    if (!decos.length) return;
    const R = 150;
    const reset = () => decos.forEach((d) => { d.style.translate = "0px 0px"; });
    on(hero, "pointermove", (e) => {
      const r = hero.getBoundingClientRect();
      const mx = e.clientX - r.left, my = e.clientY - r.top;
      decos.forEach((d) => {
        const dr = d.getBoundingClientRect();
        const cx = dr.left - r.left + dr.width / 2, cy = dr.top - r.top + dr.height / 2;
        const dx = cx - mx, dy = cy - my;
        const dist = Math.hypot(dx, dy) || 1;
        if (dist < R) {
          const push = (1 - dist / R) * 28;
          d.style.translate = (dx / dist * push).toFixed(1) + "px " + (dy / dist * push).toFixed(1) + "px";
        } else {
          d.style.translate = "0px 0px";
        }
      });
    });
    on(hero, "pointerleave", reset);
  }

  /* utils ------------------------------------------------------------- */
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  /* ===================================================================== *
   * BOOT                                                                  *
   * ===================================================================== */
  function init() {
    initTheme();
    initFloatingShapes();
    initModals();
    initDrawers();
    initToastTriggers();
    initTabs();
    initAccordion();
    initDropdowns();
    initContextMenus();
    initCommandPalette();
    initTables();
    initPagination();
    initCarousels();
    initSliders();
    initSteppers();
    initRatings();
    initChipInputs();
    initSegmented();
    initCustomSelects();
    initCalendars();
    initDropzones();
    initCopy();
    initPriceToggle();
    initWizards();
    initSidebar();
    initProgress();
    initPopovers();
    initReveal();
    initConfetti();
    initHeroRepel();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
