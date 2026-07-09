/* ============================================================================
   THEME 25 — MAXIMALIST COLOR-BLOCK · app.js
   Vanilla JS. No dependencies. Delegation-based so every page shares behavior.
   Modules: theme · toast · modal · drawer · cmdk · tabs · accordion · menu ·
   dropdown · table · slider · stepper · toggle · segmented · combobox ·
   rating · chipinput · fileupload · carousel · context-menu · copy · misc
   ============================================================================ */
(function () {
  "use strict";

  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from((ctx || document).querySelectorAll(sel));
  const on = (el, ev, fn, opts) => el && el.addEventListener(ev, fn, opts);

  /* ===================================================================== */
  /* THEME TOGGLE (light/dark) — persisted                                 */
  /* ===================================================================== */
  const Theme = {
    KEY: "t25-theme",
    init() {
      let saved = null;
      try { saved = localStorage.getItem(this.KEY); } catch (e) {}
      const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
      const theme = saved || (prefersDark ? "dark" : "light");
      this.apply(theme);
    },
    apply(theme) {
      document.documentElement.setAttribute("data-theme", theme);
      try { localStorage.setItem(this.KEY, theme); } catch (e) {}
      $$("[data-theme-toggle]").forEach((b) => {
        b.setAttribute("aria-pressed", String(theme === "dark"));
        const lbl = b.querySelector("[data-theme-label]");
        if (lbl) lbl.textContent = theme === "dark" ? "다크" : "라이트";
      });
    },
    toggle() {
      const cur = document.documentElement.getAttribute("data-theme");
      this.apply(cur === "dark" ? "light" : "dark");
    },
  };

  /* ===================================================================== */
  /* TOAST                                                                 */
  /* ===================================================================== */
  const ICONS = {
    success: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>',
    danger:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M15 9l-6 6M9 9l6 6"/></svg>',
    warning: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/></svg>',
    info:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>',
    close:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  };

  const Toast = {
    region: null,
    ensure() {
      if (!this.region) {
        this.region = document.createElement("div");
        this.region.className = "toast-region";
        this.region.setAttribute("role", "region");
        this.region.setAttribute("aria-label", "알림");
        this.region.setAttribute("aria-live", "polite");
        document.body.appendChild(this.region);
      }
      return this.region;
    },
    show(opts) {
      opts = opts || {};
      const type = opts.type || "info";
      const el = document.createElement("div");
      el.className = "toast toast--" + type;
      el.setAttribute("role", type === "danger" ? "alert" : "status");
      el.innerHTML =
        '<span class="toast-icon t-' + type + '">' + (ICONS[type] || ICONS.info) + "</span>" +
        '<div class="grow"><div class="toast-title">' + (opts.title || "알림") + "</div>" +
        (opts.message ? '<div class="toast-msg">' + opts.message + "</div>" : "") + "</div>" +
        '<button class="toast-close btn--icon" aria-label="닫기" style="background:none;border:none;width:1.4rem;height:1.4rem">' + ICONS.close + "</button>";
      this.ensure().appendChild(el);
      const close = () => {
        el.classList.add("is-leaving");
        setTimeout(() => el.remove(), 240);
      };
      on(el.querySelector(".toast-close"), "click", close);
      if (opts.duration !== 0) setTimeout(close, opts.duration || 4000);
      return el;
    },
  };
  window.t25toast = (o) => Toast.show(o);

  /* ===================================================================== */
  /* FOCUS TRAP helper (for modal/drawer/cmdk)                              */
  /* ===================================================================== */
  function trapFocus(container) {
    const sel = 'a[href],button:not([disabled]),textarea,input,select,[tabindex]:not([tabindex="-1"])';
    function handler(e) {
      if (e.key !== "Tab") return;
      const items = $$(sel, container).filter((el) => el.offsetParent !== null);
      if (!items.length) return;
      const first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
    container.addEventListener("keydown", handler);
    return () => container.removeEventListener("keydown", handler);
  }

  /* ===================================================================== */
  /* MODAL                                                                 */
  /* ===================================================================== */
  const Modal = {
    open(id, trigger) {
      const overlay = document.getElementById(id);
      if (!overlay) return;
      overlay.hidden = false;
      overlay._returnFocus = trigger || document.activeElement;
      overlay._untrap = trapFocus(overlay);
      const focusable = overlay.querySelector('[autofocus],button,input,a[href]');
      if (focusable) setTimeout(() => focusable.focus(), 30);
      document.body.style.overflow = "hidden";
    },
    close(overlay) {
      if (!overlay) return;
      overlay.hidden = true;
      if (overlay._untrap) overlay._untrap();
      document.body.style.overflow = "";
      if (overlay._returnFocus && overlay._returnFocus.focus) overlay._returnFocus.focus();
    },
  };

  /* ===================================================================== */
  /* DRAWER                                                                 */
  /* ===================================================================== */
  const Drawer = {
    open(id, trigger) {
      const root = document.getElementById(id);
      if (!root) return;
      const scrim = root.matches(".overlay") ? root : root.closest(".overlay");
      (scrim || root).hidden = false;
      root._returnFocus = trigger || document.activeElement;
      root._untrap = trapFocus(scrim || root);
      const f = (scrim || root).querySelector("button,a[href],input");
      if (f) setTimeout(() => f.focus(), 30);
      document.body.style.overflow = "hidden";
    },
    close(root) {
      const scrim = root.matches(".overlay") ? root : root.closest(".overlay");
      (scrim || root).hidden = true;
      if (root._untrap) root._untrap();
      document.body.style.overflow = "";
      if (root._returnFocus && root._returnFocus.focus) root._returnFocus.focus();
    },
  };

  /* ===================================================================== */
  /* COMMAND PALETTE (⌘K / Ctrl+K)                                          */
  /* ===================================================================== */
  const Cmdk = {
    el: null, input: null, list: null, items: [], active: 0,
    init() {
      this.el = document.getElementById("cmdk");
      if (!this.el) return;
      this.input = this.el.querySelector(".cmdk-search input");
      this.list = this.el.querySelector(".cmdk-list");
      this.allItems = $$(".cmdk-item", this.list);
      on(this.input, "input", () => this.filter());
      on(this.el, "keydown", (e) => this.onKey(e));
      this.allItems.forEach((it) => {
        on(it, "click", () => this.run(it));
        on(it, "mousemove", () => this.setActive(this.visible().indexOf(it)));
      });
    },
    open() {
      if (!this.el) return;
      this.el.hidden = false;
      this.input.value = "";
      this.filter();
      this._untrap = trapFocus(this.el);
      document.body.style.overflow = "hidden";
      setTimeout(() => this.input.focus(), 30);
    },
    close() {
      if (!this.el) return;
      this.el.hidden = true;
      if (this._untrap) this._untrap();
      document.body.style.overflow = "";
    },
    visible() { return this.allItems.filter((it) => !it.hidden); },
    filter() {
      const q = this.input.value.toLowerCase().trim();
      let anyVisible = false;
      this.allItems.forEach((it) => {
        const txt = (it.dataset.label || it.textContent).toLowerCase();
        const show = !q || txt.includes(q);
        it.hidden = !show;
        if (show) anyVisible = true;
      });
      $$(".cmdk-group-label", this.list).forEach((g) => {
        let sib = g.nextElementSibling, has = false;
        while (sib && sib.classList.contains("cmdk-item")) { if (!sib.hidden) has = true; sib = sib.nextElementSibling; }
        g.hidden = !has;
      });
      let empty = $(".cmdk-empty", this.list);
      if (!empty) { empty = document.createElement("div"); empty.className = "cmdk-empty"; empty.setAttribute("role", "status"); empty.setAttribute("aria-live", "polite"); empty.textContent = "결과 없음"; this.list.appendChild(empty); }
      empty.hidden = anyVisible;
      this.active = 0; this.paint();
    },
    setActive(i) { this.active = i; this.paint(); },
    paint() {
      const vis = this.visible();
      vis.forEach((it, i) => it.classList.toggle("is-active", i === this.active));
      if (vis[this.active]) vis[this.active].scrollIntoView({ block: "nearest" });
    },
    onKey(e) {
      const vis = this.visible();
      if (e.key === "ArrowDown") { e.preventDefault(); this.active = Math.min(this.active + 1, vis.length - 1); this.paint(); }
      else if (e.key === "ArrowUp") { e.preventDefault(); this.active = Math.max(this.active - 1, 0); this.paint(); }
      else if (e.key === "Enter") { e.preventDefault(); if (vis[this.active]) this.run(vis[this.active]); }
      else if (e.key === "Escape") { this.close(); }
    },
    run(item) {
      this.close();
      const href = item.dataset.href;
      const action = item.dataset.action;
      if (href) { window.location.href = href; return; }
      if (action === "toggle-theme") { Theme.toggle(); return; }
      Toast.show({ type: "info", title: "명령 실행", message: (item.dataset.label || item.textContent.trim()) });
    },
  };

  /* ===================================================================== */
  /* TABS                                                                   */
  /* ===================================================================== */
  function initTabs() {
    $$(".tabs").forEach((tabs) => {
      const tablist = $(".tablist", tabs);
      if (!tablist) return;
      const tabsArr = $$(".tab", tablist);
      function select(tab) {
        tabsArr.forEach((t) => {
          const sel = t === tab;
          t.setAttribute("aria-selected", String(sel));
          t.tabIndex = sel ? 0 : -1;
          const panel = document.getElementById(t.getAttribute("aria-controls"));
          if (panel) panel.hidden = !sel;
        });
      }
      tabsArr.forEach((tab, i) => {
        on(tab, "click", () => select(tab));
        on(tab, "keydown", (e) => {
          let idx = null;
          if (e.key === "ArrowRight") idx = (i + 1) % tabsArr.length;
          else if (e.key === "ArrowLeft") idx = (i - 1 + tabsArr.length) % tabsArr.length;
          else if (e.key === "Home") idx = 0;
          else if (e.key === "End") idx = tabsArr.length - 1;
          if (idx !== null) { e.preventDefault(); tabsArr[idx].focus(); select(tabsArr[idx]); }
        });
      });
    });
  }

  /* ===================================================================== */
  /* ACCORDION                                                              */
  /* ===================================================================== */
  function initAccordion() {
    $$(".acc-trigger").forEach((trig) => {
      on(trig, "click", () => {
        const expanded = trig.getAttribute("aria-expanded") === "true";
        const panel = document.getElementById(trig.getAttribute("aria-controls"));
        const single = trig.closest(".accordion") && trig.closest(".accordion").dataset.single === "true";
        if (single && !expanded) {
          $$(".acc-trigger", trig.closest(".accordion")).forEach((t) => {
            t.setAttribute("aria-expanded", "false");
            const p = document.getElementById(t.getAttribute("aria-controls"));
            if (p) p.classList.remove("is-open");
          });
        }
        trig.setAttribute("aria-expanded", String(!expanded));
        if (panel) panel.classList.toggle("is-open", !expanded);
      });
    });
  }

  /* ===================================================================== */
  /* MENU / DROPDOWN                                                        */
  /* ===================================================================== */
  function closeAllMenus(except) {
    $$(".menu:not([hidden])").forEach((m) => { if (m !== except) { m.hidden = true; const t = m._trigger; if (t) t.setAttribute("aria-expanded", "false"); } });
    $$(".popover:not([hidden])").forEach((p) => { if (p !== except) p.hidden = true; });
  }
  function initMenus() {
    $$("[data-menu]").forEach((trigger) => {
      const menu = document.getElementById(trigger.dataset.menu);
      if (!menu) return;
      menu._trigger = trigger;
      trigger.setAttribute("aria-haspopup", "true");
      trigger.setAttribute("aria-expanded", "false");
      on(trigger, "click", (e) => {
        e.stopPropagation();
        const willOpen = menu.hidden;
        closeAllMenus(willOpen ? menu : null);
        menu.hidden = !willOpen;
        trigger.setAttribute("aria-expanded", String(willOpen));
        if (willOpen) { const first = menu.querySelector(".menu-item"); if (first) first.focus(); }
      });
      on(menu, "keydown", (e) => {
        const items = $$(".menu-item", menu);
        const i = items.indexOf(document.activeElement);
        if (e.key === "ArrowDown") { e.preventDefault(); (items[i + 1] || items[0]).focus(); }
        else if (e.key === "ArrowUp") { e.preventDefault(); (items[i - 1] || items[items.length - 1]).focus(); }
        else if (e.key === "Escape") { menu.hidden = true; trigger.setAttribute("aria-expanded", "false"); trigger.focus(); }
      });
    });
  }

  /* ===================================================================== */
  /* POPOVER                                                                */
  /* ===================================================================== */
  function initPopovers() {
    $$("[data-popover]").forEach((trigger) => {
      const pop = document.getElementById(trigger.dataset.popover);
      if (!pop) return;
      on(trigger, "click", (e) => {
        e.stopPropagation();
        const willOpen = pop.hidden;
        closeAllMenus(willOpen ? pop : null);
        pop.hidden = !willOpen;
      });
    });
  }

  /* ===================================================================== */
  /* CONTEXT MENU                                                           */
  /* ===================================================================== */
  function initContextMenu() {
    $$("[data-context-menu]").forEach((zone) => {
      const menu = document.getElementById(zone.dataset.contextMenu);
      if (!menu) return;
      on(zone, "contextmenu", (e) => {
        e.preventDefault();
        closeAllMenus();
        menu.hidden = false;
        menu.classList.add("context-menu");
        const mw = menu.offsetWidth, mh = menu.offsetHeight;
        let x = e.clientX, y = e.clientY;
        if (x + mw > window.innerWidth) x = window.innerWidth - mw - 8;
        if (y + mh > window.innerHeight) y = window.innerHeight - mh - 8;
        menu.style.left = x + "px"; menu.style.top = y + "px";
      });
    });
  }

  /* ===================================================================== */
  /* TABLE — sort · select-all · row-select                                 */
  /* ===================================================================== */
  function initTables() {
    $$(".table[data-sortable]").forEach((table) => {
      $$("th.sortable", table).forEach((th, colIndex) => {
        on(th, "click", () => sortTable(table, th));
        th.tabIndex = 0;
        on(th, "keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); sortTable(table, th); } });
      });
    });
    // select-all
    $$(".table input[data-select-all]").forEach((master) => {
      const table = master.closest(".table");
      on(master, "change", () => {
        $$("tbody input[type=checkbox]", table).forEach((cb) => {
          cb.checked = master.checked;
          cb.closest("tr").classList.toggle("is-selected", master.checked);
        });
        updateSelCount(table);
      });
    });
    $$(".table tbody input[type=checkbox]").forEach((cb) => {
      on(cb, "change", () => {
        cb.closest("tr").classList.toggle("is-selected", cb.checked);
        const table = cb.closest(".table");
        const all = $$("tbody input[type=checkbox]", table);
        const master = $("input[data-select-all]", table);
        if (master) master.checked = all.every((x) => x.checked);
        updateSelCount(table);
      });
    });
  }
  function updateSelCount(table) {
    const n = $$("tbody input[type=checkbox]:checked", table).length;
    const out = table.closest(".table-wrap") && table.closest(".table-wrap").querySelector("[data-sel-count]");
    if (out) out.textContent = n ? n + "개 선택됨" : "";
  }
  function sortTable(table, th) {
    const allTh = $$("th", th.parentElement);
    const idx = allTh.indexOf(th);
    const cur = th.getAttribute("aria-sort");
    const dir = cur === "ascending" ? "descending" : "ascending";
    allTh.forEach((h) => h.removeAttribute("aria-sort"));
    th.setAttribute("aria-sort", dir);
    const tbody = $("tbody", table);
    const rows = $$("tr", tbody);
    const type = th.dataset.type || "text";
    rows.sort((a, b) => {
      let av = a.children[idx].dataset.value || a.children[idx].textContent.trim();
      let bv = b.children[idx].dataset.value || b.children[idx].textContent.trim();
      if (type === "number") { av = parseFloat(av.replace(/[^0-9.\-]/g, "")) || 0; bv = parseFloat(bv.replace(/[^0-9.\-]/g, "")) || 0; }
      let cmp = type === "number" ? av - bv : String(av).localeCompare(String(bv));
      return dir === "ascending" ? cmp : -cmp;
    });
    rows.forEach((r) => tbody.appendChild(r));
    // update sort indicators
    $$(".sort-ind", table).forEach((s) => (s.textContent = "↕"));
    const ind = $(".sort-ind", th);
    if (ind) ind.textContent = dir === "ascending" ? "↑" : "↓";
  }

  /* ===================================================================== */
  /* SLIDER (live value)                                                    */
  /* ===================================================================== */
  function initSliders() {
    $$('.slider input[type="range"]').forEach((r) => {
      const out = r.closest(".slider").querySelector(".slider-val");
      const upd = () => { if (out) out.textContent = (r.dataset.prefix || "") + r.value + (r.dataset.suffix || ""); };
      on(r, "input", upd); upd();
    });
  }

  /* ===================================================================== */
  /* STEPPER                                                                */
  /* ===================================================================== */
  function initSteppers() {
    $$(".stepper").forEach((st) => {
      const input = $("input", st);
      const dec = $("[data-step-dec]", st), inc = $("[data-step-inc]", st);
      const min = input.min !== "" ? +input.min : -Infinity;
      const max = input.max !== "" ? +input.max : Infinity;
      const step = +input.step || 1;
      on(dec, "click", () => { input.value = Math.max(min, (+input.value || 0) - step); });
      on(inc, "click", () => { input.value = Math.min(max, (+input.value || 0) + step); });
    });
  }

  /* ===================================================================== */
  /* SEGMENTED CONTROL                                                      */
  /* ===================================================================== */
  function initSegmented() {
    $$(".segmented").forEach((seg) => {
      const btns = $$("button", seg);
      if (!btns.length) return;
      // Use aria-checked for radiogroup markup, else legacy aria-selected.
      const attr = seg.getAttribute("role") === "radiogroup"
        || btns.some((b) => b.getAttribute("role") === "radio")
        ? "aria-checked" : "aria-selected";
      function select(btn, focus) {
        btns.forEach((x) => {
          const active = x === btn;
          x.setAttribute(attr, String(active));
          x.classList.toggle("is-active", active);
          x.tabIndex = active ? 0 : -1;
        });
        if (focus) btn.focus();
        if (seg.dataset.onchange === "billing") syncBilling(btn.dataset.value);
      }
      btns.forEach((b, i) => {
        on(b, "click", () => select(b));
        on(b, "keydown", (e) => {
          let idx = null;
          if (e.key === "ArrowRight" || e.key === "ArrowDown") idx = (i + 1) % btns.length;
          else if (e.key === "ArrowLeft" || e.key === "ArrowUp") idx = (i - 1 + btns.length) % btns.length;
          else if (e.key === "Home") idx = 0;
          else if (e.key === "End") idx = btns.length - 1;
          if (idx !== null) { e.preventDefault(); select(btns[idx], true); }
        });
      });
      // Roving tabindex from current selection
      const cur = btns.find((b) => b.getAttribute(attr) === "true") || btns[0];
      btns.forEach((b) => (b.tabIndex = b === cur ? 0 : -1));
    });
  }
  function syncBilling(period) {
    $$("[data-price]").forEach((el) => {
      el.textContent = period === "year" ? el.dataset.priceYear : el.dataset.priceMonth;
    });
    $$("[data-price-note]").forEach((el) => {
      el.textContent = period === "year" ? "/년 · 2개월 무료" : "/월";
    });
  }

  /* ===================================================================== */
  /* COMBOBOX / AUTOCOMPLETE / MULTISELECT                                  */
  /* ===================================================================== */
  function initComboboxes() {
    $$(".combo").forEach((combo) => {
      const input = $("input", combo);
      const listbox = $(".listbox", combo);
      const multi = combo.dataset.multi === "true";
      if (!input || !listbox) return;
      const options = $$(".option", listbox);
      let activeIdx = -1;
      const open = () => { listbox.hidden = false; combo.setAttribute("aria-expanded", "true"); };
      const close = () => { listbox.hidden = true; combo.setAttribute("aria-expanded", "false"); activeIdx = -1; paint(); };
      const visible = () => options.filter((o) => !o.hidden);
      function paint() { const vis = visible(); vis.forEach((o, i) => o.classList.toggle("is-active", i === activeIdx)); }
      function filter() {
        const q = input.value.toLowerCase().trim();
        options.forEach((o) => { o.hidden = q && !o.textContent.toLowerCase().includes(q); });
        let empty = $(".listbox-empty", listbox);
        if (!empty) { empty = document.createElement("div"); empty.className = "listbox-empty"; empty.textContent = "결과 없음"; listbox.appendChild(empty); }
        empty.hidden = visible().length > 0;
        activeIdx = visible().length ? 0 : -1; paint();
      }
      function choose(opt) {
        if (multi) {
          const selected = opt.getAttribute("aria-selected") === "true";
          opt.setAttribute("aria-selected", String(!selected));
          renderChips();
        } else {
          options.forEach((o) => o.setAttribute("aria-selected", "false"));
          opt.setAttribute("aria-selected", "true");
          input.value = opt.dataset.label || opt.textContent.trim();
          close();
        }
      }
      function renderChips() {
        $$(".chip", combo).forEach((c) => c.remove());
        options.filter((o) => o.getAttribute("aria-selected") === "true").reverse().forEach((o) => {
          const chip = document.createElement("span");
          chip.className = "chip";
          chip.innerHTML = (o.dataset.label || o.textContent.trim()) +
            '<button type="button" aria-label="제거">' + ICONS.close + "</button>";
          on(chip.querySelector("button"), "click", (e) => { e.stopPropagation(); o.setAttribute("aria-selected", "false"); chip.remove(); });
          combo.querySelector(".combo-control").insertBefore(chip, input);
        });
      }
      on(input, "focus", open);
      on(input, "input", () => { open(); filter(); });
      on(combo, "click", (e) => { if (e.target.closest(".combo-control")) input.focus(); });
      on(input, "keydown", (e) => {
        const vis = visible();
        if (e.key === "ArrowDown") { e.preventDefault(); open(); activeIdx = Math.min(activeIdx + 1, vis.length - 1); paint(); }
        else if (e.key === "ArrowUp") { e.preventDefault(); activeIdx = Math.max(activeIdx - 1, 0); paint(); }
        else if (e.key === "Enter") { e.preventDefault(); if (vis[activeIdx]) choose(vis[activeIdx]); }
        else if (e.key === "Escape") { close(); }
      });
      options.forEach((o) => on(o, "click", () => { choose(o); input.focus(); }));
      document.addEventListener("click", (e) => { if (!combo.contains(e.target)) close(); });
    });
  }

  /* ===================================================================== */
  /* RATING                                                                 */
  /* ===================================================================== */
  function initRatings() {
    $$(".rating").forEach((rt) => {
      const btns = $$("button", rt);
      function set(n) {
        btns.forEach((b, i) => { b.classList.toggle("is-on", i < n); b.setAttribute("aria-checked", String(i < n)); });
        rt.dataset.value = n;
      }
      btns.forEach((b, i) => {
        on(b, "click", () => set(i + 1));
        on(b, "mouseenter", () => btns.forEach((x, j) => x.classList.toggle("is-on", j <= i)));
        on(b, "keydown", (e) => {
          if (e.key === "ArrowRight") { e.preventDefault(); (btns[i + 1] || btns[0]).focus(); }
          if (e.key === "ArrowLeft") { e.preventDefault(); (btns[i - 1] || btns[btns.length - 1]).focus(); }
        });
      });
      on(rt, "mouseleave", () => set(+rt.dataset.value || 0));
      set(+rt.dataset.value || 0);
    });
  }

  /* ===================================================================== */
  /* CHIP INPUT                                                             */
  /* ===================================================================== */
  function initChipInputs() {
    $$(".chip-input").forEach((ci) => {
      const input = $("input", ci);
      function add(text) {
        text = text.trim(); if (!text) return;
        const chip = document.createElement("span");
        chip.className = "chip";
        chip.innerHTML = text + '<button type="button" aria-label="제거">' + ICONS.close + "</button>";
        on(chip.querySelector("button"), "click", () => chip.remove());
        ci.insertBefore(chip, input);
      }
      on(input, "keydown", (e) => {
        if (e.key === "Enter" || e.key === ",") { e.preventDefault(); add(input.value); input.value = ""; }
        else if (e.key === "Backspace" && !input.value) { const chips = $$(".chip", ci); if (chips.length) chips[chips.length - 1].remove(); }
      });
    });
  }

  /* ===================================================================== */
  /* FILE UPLOAD (dropzone)                                                 */
  /* ===================================================================== */
  function initFileUploads() {
    $$(".dropzone").forEach((dz) => {
      const input = $('input[type="file"]', dz);
      const list = dz.parentElement.querySelector("[data-file-list]");
      on(dz, "click", () => input && input.click());
      on(dz, "keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); input && input.click(); } });
      ["dragover", "dragenter"].forEach((ev) => on(dz, ev, (e) => { e.preventDefault(); dz.classList.add("is-drag"); }));
      ["dragleave", "drop"].forEach((ev) => on(dz, ev, (e) => { e.preventDefault(); dz.classList.remove("is-drag"); }));
      on(dz, "drop", (e) => addFiles(e.dataTransfer.files));
      on(input, "change", () => addFiles(input.files));
      function addFiles(files) {
        if (!list) return;
        Array.from(files).forEach((f) => {
          const item = document.createElement("div");
          item.className = "file-item";
          item.innerHTML =
            '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg>' +
            '<div class="grow"><div class="text-sm weight-bold">' + f.name + "</div>" +
            '<div class="file-bar"><span style="width:0%"></span></div></div>' +
            '<button class="btn--icon" aria-label="삭제" style="width:1.4rem;height:1.4rem;background:none;border:none">' + ICONS.close + "</button>";
          list.appendChild(item);
          on(item.querySelector("button"), "click", () => item.remove());
          // simulate progress
          let p = 0; const bar = item.querySelector(".file-bar span");
          const iv = setInterval(() => { p += 12; if (p >= 100) { p = 100; clearInterval(iv); } bar.style.width = p + "%"; }, 120);
        });
      }
    });
  }

  /* ===================================================================== */
  /* CAROUSEL                                                               */
  /* ===================================================================== */
  function initCarousels() {
    $$(".carousel").forEach((car) => {
      const track = $(".carousel-track", car);
      const slides = $$(".carousel-slide", track);
      const dotsWrap = $(".carousel-dots", car);
      let idx = 0;
      slides.forEach((_, i) => {
        const dot = document.createElement("button");
        dot.setAttribute("aria-label", (i + 1) + "번 슬라이드로 이동");
        on(dot, "click", () => go(i));
        if (dotsWrap) dotsWrap.appendChild(dot);
      });
      const dots = dotsWrap ? $$("button", dotsWrap) : [];
      function go(n) {
        idx = (n + slides.length) % slides.length;
        slides.forEach((s) => (s.style.transform = "translateX(" + -idx * 100 + "%)"));
        dots.forEach((d, i) => d.classList.toggle("is-active", i === idx));
      }
      on($(".carousel-btn.prev", car), "click", () => go(idx - 1));
      on($(".carousel-btn.next", car), "click", () => go(idx + 1));
      go(0);
    });
  }

  /* ===================================================================== */
  /* SIDEBAR COLLAPSE                                                       */
  /* ===================================================================== */
  function initSidebar() {
    $$("[data-sidebar-toggle]").forEach((btn) => {
      on(btn, "click", () => {
        const sb = document.getElementById(btn.dataset.sidebarToggle) || $(".sidebar");
        if (sb) sb.classList.toggle("is-collapsed");
      });
    });
  }

  /* ===================================================================== */
  /* WIZARD / STEPS navigation                                              */
  /* ===================================================================== */
  function initWizard() {
    $$("[data-wizard]").forEach((wiz) => {
      const steps = $$(".step", wiz.querySelector(".steps"));
      const panels = $$("[data-wizard-panel]", wiz);
      let cur = 0;
      function render() {
        steps.forEach((s, i) => {
          s.classList.toggle("is-active", i === cur);
          s.classList.toggle("is-complete", i < cur);
        });
        panels.forEach((p, i) => (p.hidden = i !== cur));
        const back = $("[data-wizard-back]", wiz), next = $("[data-wizard-next]", wiz);
        if (back) back.disabled = cur === 0;
        if (next) next.textContent = cur === panels.length - 1 ? "완료" : "다음 →";
      }
      on($("[data-wizard-next]", wiz), "click", () => {
        if (cur < panels.length - 1) { cur++; render(); }
        else { Toast.show({ type: "success", title: "온보딩 완료!", message: "모든 단계를 마쳤습니다." }); }
      });
      on($("[data-wizard-back]", wiz), "click", () => { if (cur > 0) { cur--; render(); } });
      render();
    });
  }

  /* ===================================================================== */
  /* COPY TO CLIPBOARD                                                      */
  /* ===================================================================== */
  function initCopy() {
    document.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-copy]");
      if (!btn) return;
      const text = btn.dataset.copy === "true"
        ? (btn.closest(".codeblock") ? btn.closest(".codeblock").querySelector("pre").innerText : "")
        : btn.dataset.copy;
      if (navigator.clipboard) navigator.clipboard.writeText(text).then(() => Toast.show({ type: "success", title: "복사됨", message: "클립보드에 복사했습니다." }));
    });
  }

  /* ===================================================================== */
  /* PROGRESS CIRCLE — set dash from data-value                             */
  /* ===================================================================== */
  function initProgressCircles() {
    $$(".progress-circle").forEach((pc) => {
      const bar = $(".pc-bar", pc);
      if (!bar) return;
      const r = +bar.getAttribute("r");
      const circ = 2 * Math.PI * r;
      const val = +(pc.dataset.value || 0);
      bar.style.strokeDasharray = circ;
      bar.style.strokeDashoffset = circ * (1 - val / 100);
    });
  }

  /* ===================================================================== */
  /* SCROLL REVEAL — one IntersectionObserver, effect via .is-in            */
  /* ===================================================================== */
  function initReveal() {
    const els = $$("[data-reveal]");
    if (!els.length) return;
    const reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });
    els.forEach((el) => io.observe(el));
  }

  /* ===================================================================== */
  /* GLOBAL EVENT WIRING                                                    */
  /* ===================================================================== */
  function initGlobal() {
    document.addEventListener("click", (e) => {
      // theme
      if (e.target.closest("[data-theme-toggle]")) { Theme.toggle(); return; }
      // open modal / drawer / cmdk
      const mOpen = e.target.closest("[data-modal-open]");
      if (mOpen) { Modal.open(mOpen.dataset.modalOpen, mOpen); return; }
      const dOpen = e.target.closest("[data-drawer-open]");
      if (dOpen) { Drawer.open(dOpen.dataset.drawerOpen, dOpen); return; }
      if (e.target.closest("[data-cmdk-open]")) { Cmdk.open(); return; }
      // close buttons
      const closeBtn = e.target.closest("[data-close]");
      if (closeBtn) {
        const overlay = closeBtn.closest(".overlay, .cmdk-overlay");
        if (overlay && overlay.id === "cmdk") Cmdk.close();
        else if (overlay && overlay.querySelector(".drawer")) Drawer.close(overlay.querySelector(".drawer"));
        else if (overlay) Modal.close(overlay);
        return;
      }
      // backdrop click closes overlay
      if (e.target.matches(".overlay") || e.target.matches(".cmdk-overlay")) {
        if (e.target.id === "cmdk") Cmdk.close();
        else if (e.target.querySelector(".drawer")) Drawer.close(e.target.querySelector(".drawer"));
        else Modal.close(e.target);
        return;
      }
      // toast demo
      const tBtn = e.target.closest("[data-toast]");
      if (tBtn) { Toast.show({ type: tBtn.dataset.toast || "info", title: tBtn.dataset.toastTitle || "알림", message: tBtn.dataset.toastMsg || "토스트 메시지입니다." }); return; }
      // close menus on outside click
      if (!e.target.closest(".menu") && !e.target.closest("[data-menu]") && !e.target.closest(".popover") && !e.target.closest("[data-popover]")) closeAllMenus();
    });

    // Global keyboard
    document.addEventListener("keydown", (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); Cmdk.open(); return; }
      if (e.key === "Escape") {
        if (Cmdk.el && !Cmdk.el.hidden) { Cmdk.close(); return; }
        const overlay = $(".overlay:not([hidden])");
        if (overlay) { if (overlay.querySelector(".drawer")) Drawer.close(overlay.querySelector(".drawer")); else Modal.close(overlay); return; }
        closeAllMenus();
      }
    });
  }

  /* ===================================================================== */
  /* BOOT                                                                   */
  /* ===================================================================== */
  function boot() {
    document.documentElement.classList.add("js");
    Theme.init();
    Cmdk.init();
    initTabs();
    initAccordion();
    initMenus();
    initPopovers();
    initContextMenu();
    initTables();
    initSliders();
    initSteppers();
    initSegmented();
    initComboboxes();
    initRatings();
    initChipInputs();
    initFileUploads();
    initCarousels();
    initSidebar();
    initWizard();
    initCopy();
    initProgressCircles();
    initReveal();
    initGlobal();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();

  // public API
  window.T25 = { Theme, Toast, Modal, Drawer, Cmdk };
})();
