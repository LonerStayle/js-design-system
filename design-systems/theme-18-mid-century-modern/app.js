/* =============================================================================
   THEME 18 — MID-CENTURY MODERN  ·  app.js
   All interactions, vanilla JS, data-attribute driven. No dependencies.
   Works from file:// — every page links this single script.
   Modules: theme · modal · drawer · toast · tabs · accordion · dropdown/menu
            command palette (⌘K) · segmented · slider · stepper · carousel
            sidebar · copy · table sort · combobox · multiselect · fileupload
            rating · context menu · wizard · scroll reveal
   ============================================================================= */
(function () {
  "use strict";
  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const on = (el, ev, fn, opts) => el && el.addEventListener(ev, fn, opts);
  const FOCUSABLE = 'a[href],button:not([disabled]),textarea,input,select,[tabindex]:not([tabindex="-1"])';

  /* ---------------------------------------------------------------- THEME */
  const Theme = (() => {
    const KEY = "mcm-theme";
    const root = document.documentElement;
    function apply(mode) {
      if (mode === "light" || mode === "dark") root.setAttribute("data-theme", mode);
      else root.removeAttribute("data-theme");
      $$("[data-theme-toggle]").forEach(syncBtn);
    }
    function current() {
      return root.getAttribute("data-theme") ||
        (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    }
    function syncBtn(btn) {
      const dark = current() === "dark";
      btn.setAttribute("aria-pressed", String(dark));
      const sun = $(".icon-sun", btn), moon = $(".icon-moon", btn);
      if (sun) sun.style.display = dark ? "none" : "";
      if (moon) moon.style.display = dark ? "" : "none";
    }
    function toggle() {
      const next = current() === "dark" ? "light" : "dark";
      try { localStorage.setItem(KEY, next); } catch (e) {}
      apply(next);
    }
    function init() {
      let saved = null;
      try { saved = localStorage.getItem(KEY); } catch (e) {}
      if (saved) apply(saved);
      $$("[data-theme-toggle]").forEach((b) => { on(b, "click", toggle); syncBtn(b); });
    }
    return { init, toggle, current };
  })();

  /* ----------------------------------------------------- FOCUS TRAP utility */
  function trapFocus(container, e) {
    const f = $$(FOCUSABLE, container).filter((el) => el.offsetParent !== null);
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { last.focus(); e.preventDefault(); }
    else if (!e.shiftKey && document.activeElement === last) { first.focus(); e.preventDefault(); }
  }

  /* ---------------------------------------------------------------- MODAL */
  const Modal = (() => {
    let active = null, lastFocus = null;
    function open(id) {
      const m = document.getElementById(id); if (!m) return;
      lastFocus = document.activeElement;
      m.classList.add("is-open"); m.removeAttribute("aria-hidden");
      backdrop(true);
      document.body.style.overflow = "hidden";
      active = m;
      const f = $$(FOCUSABLE, m).filter((el) => el.offsetParent !== null);
      (f[0] || m).focus();
    }
    function close(m) {
      m = m || active; if (!m) return;
      m.classList.remove("is-open"); m.setAttribute("aria-hidden", "true");
      backdrop(false);
      document.body.style.overflow = "";
      if (lastFocus) lastFocus.focus();
      if (m === active) active = null;
    }
    function backdrop(show) {
      let bd = $(".scrim[data-role=modal-scrim]");
      if (!bd) { bd = document.createElement("div"); bd.className = "scrim"; bd.dataset.role = "modal-scrim"; document.body.appendChild(bd); }
      requestAnimationFrame(() => bd.classList.toggle("is-open", show));
      on(bd, "click", () => active && close(active));
    }
    function init() {
      on(document, "click", (e) => {
        const o = e.target.closest("[data-modal-open]"); if (o) { e.preventDefault(); open(o.dataset.modalOpen); }
        const c = e.target.closest("[data-modal-close]"); if (c) { e.preventDefault(); close(c.closest(".modal")); }
      });
      on(document, "keydown", (e) => {
        if (!active) return;
        if (e.key === "Escape") close(active);
        if (e.key === "Tab") trapFocus(active.querySelector(".modal__panel") || active, e);
      });
    }
    return { init, open, close };
  })();

  /* --------------------------------------------------------------- DRAWER */
  const Drawer = (() => {
    let active = null, lastFocus = null;
    function open(id) {
      const d = document.getElementById(id); if (!d) return;
      lastFocus = document.activeElement;
      d.classList.add("is-open"); d.removeAttribute("aria-hidden");
      backdrop(true); document.body.style.overflow = "hidden"; active = d;
      const f = $$(FOCUSABLE, d).filter((el) => el.offsetParent !== null); (f[0] || d).focus();
    }
    function close(d) {
      d = d || active; if (!d) return;
      d.classList.remove("is-open"); d.setAttribute("aria-hidden", "true");
      backdrop(false); document.body.style.overflow = "";
      if (lastFocus) lastFocus.focus(); if (d === active) active = null;
    }
    function backdrop(show) {
      let bd = $(".scrim[data-role=drawer-scrim]");
      if (!bd) { bd = document.createElement("div"); bd.className = "scrim"; bd.dataset.role = "drawer-scrim"; document.body.appendChild(bd); on(bd, "click", () => active && close(active)); }
      requestAnimationFrame(() => bd.classList.toggle("is-open", show));
    }
    function init() {
      on(document, "click", (e) => {
        const o = e.target.closest("[data-drawer-open]"); if (o) { e.preventDefault(); open(o.dataset.drawerOpen); }
        const c = e.target.closest("[data-drawer-close]"); if (c) { e.preventDefault(); close(c.closest(".drawer")); }
      });
      on(document, "keydown", (e) => {
        if (!active) return;
        if (e.key === "Escape") close(active);
        if (e.key === "Tab") trapFocus(active, e);
      });
    }
    return { init, open, close };
  })();

  /* ---------------------------------------------------------------- TOAST */
  const Toast = (() => {
    function region() {
      let r = $(".toast-region");
      if (!r) { r = document.createElement("div"); r.className = "toast-region"; r.setAttribute("aria-live", "polite"); r.setAttribute("role", "status"); document.body.appendChild(r); }
      return r;
    }
    const ICONS = {
      success: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>',
      danger:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16.5v.01"/></svg>',
      warning: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/></svg>',
      info:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 7.5v.01"/></svg>'
    };
    function show(opts) {
      opts = opts || {};
      const variant = opts.variant || "info";
      const t = document.createElement("div");
      t.className = "toast toast--" + variant; t.setAttribute("role", "alert");
      t.innerHTML =
        '<span class="toast__icon">' + (ICONS[variant] || ICONS.info) + "</span>" +
        '<div class="toast__body"><div class="toast__title">' + (opts.title || "알림") + "</div>" +
        (opts.msg ? '<div class="toast__msg">' + opts.msg + "</div>" : "") + "</div>" +
        '<button class="btn btn--ghost btn--icon btn--sm" aria-label="닫기"><svg viewBox="0 0 24 24" width="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg></button>';
      region().appendChild(t);
      const dismiss = () => { t.classList.add("is-leaving"); setTimeout(() => t.remove(), 260); };
      on($("button", t), "click", dismiss);
      if (opts.duration !== 0) setTimeout(dismiss, opts.duration || 4200);
    }
    function init() {
      on(document, "click", (e) => {
        const b = e.target.closest("[data-toast]"); if (!b) return;
        show({ variant: b.dataset.toast || "info", title: b.dataset.toastTitle || "알림", msg: b.dataset.toastMsg || "" });
      });
    }
    return { init, show };
  })();

  /* ----------------------------------------------------------------- TABS */
  function initTabs() {
    $$(".tabs").forEach((tabs) => {
      const tabEls = $$('[role="tab"]', tabs);
      function select(tab) {
        tabEls.forEach((t) => {
          const sel = t === tab; t.setAttribute("aria-selected", String(sel)); t.tabIndex = sel ? 0 : -1;
          const panel = document.getElementById(t.getAttribute("aria-controls"));
          if (panel) panel.hidden = !sel;
        });
      }
      tabEls.forEach((tab, i) => {
        on(tab, "click", () => select(tab));
        on(tab, "keydown", (e) => {
          let idx = null;
          if (e.key === "ArrowRight") idx = (i + 1) % tabEls.length;
          else if (e.key === "ArrowLeft") idx = (i - 1 + tabEls.length) % tabEls.length;
          else if (e.key === "Home") idx = 0;
          else if (e.key === "End") idx = tabEls.length - 1;
          if (idx !== null) { e.preventDefault(); tabEls[idx].focus(); select(tabEls[idx]); }
        });
      });
    });
  }

  /* ------------------------------------------------------------ ACCORDION */
  function initAccordion() {
    on(document, "click", (e) => {
      const trig = e.target.closest(".accordion__trigger"); if (!trig) return;
      const open = trig.getAttribute("aria-expanded") === "true";
      const single = trig.closest(".accordion")?.dataset.single !== undefined;
      if (single && !open) {
        $$(".accordion__trigger", trig.closest(".accordion")).forEach((t) => t.setAttribute("aria-expanded", "false"));
      }
      trig.setAttribute("aria-expanded", String(!open));
    });
  }

  /* ----------------------------------------------------- DROPDOWN / MENU */
  function initDropdown() {
    on(document, "click", (e) => {
      const trig = e.target.closest("[data-dropdown-trigger]");
      $$(".dropdown.is-open").forEach((d) => { if (!trig || d !== trig.closest(".dropdown")) d.classList.remove("is-open"); });
      if (trig) {
        const dd = trig.closest(".dropdown");
        const willOpen = !dd.classList.contains("is-open");
        dd.classList.toggle("is-open", willOpen);
        trig.setAttribute("aria-expanded", String(willOpen));
        if (willOpen) { const it = $(".menu__item", dd); it && it.focus(); }
      }
      if (e.target.closest(".menu__item") && !e.target.closest("[data-keep-open]")) {
        $$(".dropdown.is-open").forEach((d) => d.classList.remove("is-open"));
      }
    });
    on(document, "keydown", (e) => {
      if (e.key !== "Escape") return;
      $$(".dropdown.is-open").forEach((d) => { d.classList.remove("is-open"); const t = $("[data-dropdown-trigger]", d); t && t.focus(); });
    });
  }

  /* ------------------------------------------------- COMMAND PALETTE (⌘K) */
  const Cmdk = (() => {
    let el, input, list, items = [], active = 0, lastFocus = null;
    function open() {
      el = $(".cmdk"); if (!el) return;
      lastFocus = document.activeElement;
      el.classList.add("is-open"); document.body.style.overflow = "hidden";
      input = $(".cmdk__search input", el); list = $(".cmdk__list", el);
      input.value = ""; filter(""); input.focus();
    }
    function close() { if (!el) return; el.classList.remove("is-open"); document.body.style.overflow = ""; if (lastFocus) lastFocus.focus(); }
    function visible() { return items.filter((i) => i.style.display !== "none"); }
    function setActive(n) {
      items.forEach((i) => { i.classList.remove("is-active"); i.setAttribute("aria-selected", "false"); });
      const v = visible();
      if (!v.length) { if (input) input.removeAttribute("aria-activedescendant"); return; }
      active = (n + v.length) % v.length;
      const cur = v[active];
      cur.classList.add("is-active");
      cur.setAttribute("aria-selected", "true");
      if (input && cur.id) input.setAttribute("aria-activedescendant", cur.id);
      cur.scrollIntoView({ block: "nearest" });
    }
    function filter(q) {
      q = q.toLowerCase().trim();
      let any = false;
      items.forEach((i) => {
        const match = i.textContent.toLowerCase().includes(q);
        i.style.display = match ? "" : "none"; if (match) any = true;
      });
      $$(".cmdk__group-label", el).forEach((g) => {
        let n = g.nextElementSibling, has = false;
        while (n && n.classList.contains("cmdk__item")) { if (n.style.display !== "none") has = true; n = n.nextElementSibling; }
        g.style.display = has ? "" : "none";
      });
      let empty = $(".cmdk__empty", el);
      if (empty) empty.hidden = any;
      active = 0; setActive(0);
    }
    function init() {
      el = $(".cmdk"); if (!el) return;
      items = $$(".cmdk__item", el);
      on(document, "keydown", (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); el.classList.contains("is-open") ? close() : open(); }
      });
      $$("[data-cmdk-open]").forEach((b) => on(b, "click", open));
      on(el, "click", (e) => {
        if (e.target === el) close();
        const it = e.target.closest(".cmdk__item"); if (!it) return;
        close();
        if (it.dataset.href) location.href = it.dataset.href;
        else if (it.dataset.cmdkAction === "theme-toggle") Theme.toggle();
      });
      input = $(".cmdk__search input", el);
      on(input, "input", () => filter(input.value));
      on(el, "keydown", (e) => {
        if (e.key === "Escape") close();
        else if (e.key === "ArrowDown") { e.preventDefault(); setActive(active + 1); }
        else if (e.key === "ArrowUp") { e.preventDefault(); setActive(active - 1); }
        else if (e.key === "Enter") { const v = visible()[active]; if (v) v.click(); }
      });
    }
    return { init, open, close };
  })();

  /* ----------------------------------------------------- SEGMENTED control */
  function initSegmented() {
    $$(".segmented").forEach((seg) => {
      const btns = $$(".segmented__btn", seg);
      btns.forEach((b) => on(b, "click", () => {
        btns.forEach((x) => x.setAttribute("aria-pressed", "false"));
        b.setAttribute("aria-pressed", "true");
        seg.dispatchEvent(new CustomEvent("segmentchange", { detail: { value: b.dataset.value } }));
      }));
    });
  }

  /* --------------------------------------------------------------- SLIDER */
  function initSlider() {
    $$(".slider input[type=range]").forEach((r) => {
      const out = r.closest(".slider")?.querySelector(".slider__value");
      const upd = () => {
        if (out) out.textContent = (r.dataset.prefix || "") + r.value + (r.dataset.suffix || "");
        const pct = ((r.value - r.min) / (r.max - r.min)) * 100;
        r.style.background = `linear-gradient(90deg, var(--track-fill) ${pct}%, var(--track-bg) ${pct}%)`;
      };
      on(r, "input", upd); upd();
    });
  }

  /* -------------------------------------------------------------- STEPPER */
  function initStepper() {
    $$(".stepper").forEach((s) => {
      const input = $("input", s), dec = $("[data-step=dec]", s), inc = $("[data-step=inc]", s);
      const min = input.min !== "" ? +input.min : -Infinity, max = input.max !== "" ? +input.max : Infinity;
      const set = (v) => { input.value = Math.max(min, Math.min(max, v)); };
      on(dec, "click", () => set((+input.value || 0) - (+input.step || 1)));
      on(inc, "click", () => set((+input.value || 0) + (+input.step || 1)));
    });
  }

  /* ------------------------------------------------------------- CAROUSEL */
  function initCarousel() {
    $$(".carousel").forEach((c) => {
      const track = $(".carousel__track", c), slides = $$(".carousel__slide", c);
      const dotsWrap = $(".carousel__dots", c); let idx = 0;
      slides.forEach((_, i) => {
        if (!dotsWrap) return;
        const d = document.createElement("button"); d.className = "carousel__dot" + (i === 0 ? " is-active" : "");
        d.setAttribute("aria-label", "슬라이드 " + (i + 1)); on(d, "click", () => go(i)); dotsWrap.appendChild(d);
      });
      function go(n) {
        idx = (n + slides.length) % slides.length;
        track.style.transform = `translateX(-${idx * 100}%)`;
        if (dotsWrap) $$(".carousel__dot", dotsWrap).forEach((d, i) => d.classList.toggle("is-active", i === idx));
      }
      on($(".carousel__btn--prev", c), "click", () => go(idx - 1));
      on($(".carousel__btn--next", c), "click", () => go(idx + 1));
      if (c.dataset.auto) setInterval(() => go(idx + 1), +c.dataset.auto || 5000);
    });
  }

  /* -------------------------------------------------------------- SIDEBAR */
  function initSidebar() {
    on(document, "click", (e) => {
      const t = e.target.closest("[data-sidebar-toggle]"); if (!t) return;
      const sb = document.getElementById(t.dataset.sidebarToggle) || $(".sidebar");
      if (!sb) return;
      if (window.matchMedia("(max-width: 860px)").matches) sb.classList.toggle("is-open");
      else sb.classList.toggle("is-collapsed");
    });
  }

  /* ------------------------------------------------------- COPY to clipboard */
  function initCopy() {
    on(document, "click", (e) => {
      const b = e.target.closest("[data-copy]"); if (!b) return;
      const text = b.dataset.copy || (b.closest(".codeblock") && $("pre", b.closest(".codeblock")).innerText) || "";
      const done = () => Toast.show({ variant: "success", title: "복사됨", msg: "클립보드에 복사되었습니다." });
      if (navigator.clipboard) navigator.clipboard.writeText(text).then(done).catch(done); else done();
    });
  }

  /* ---------------------------------------------------------- TABLE SORT */
  function initTableSort() {
    $$("table[data-sortable]").forEach((table) => {
      const tbody = $("tbody", table);
      $$("th.is-sortable", table).forEach((th, col) => {
        on(th, "click", () => {
          const cur = th.getAttribute("aria-sort");
          const dir = cur === "ascending" ? "descending" : "ascending";
          $$("th", table).forEach((h) => h.removeAttribute("aria-sort"));
          th.setAttribute("aria-sort", dir);
          const rows = $$("tr", tbody);
          const idx = $$("th", table).indexOf(th);
          rows.sort((a, b) => {
            let A = a.children[idx].dataset.sort ?? a.children[idx].innerText;
            let B = b.children[idx].dataset.sort ?? b.children[idx].innerText;
            const nA = parseFloat(String(A).replace(/[^0-9.-]/g, "")), nB = parseFloat(String(B).replace(/[^0-9.-]/g, ""));
            let r = (!isNaN(nA) && !isNaN(nB)) ? nA - nB : String(A).localeCompare(String(B), "ko");
            return dir === "ascending" ? r : -r;
          });
          rows.forEach((r) => tbody.appendChild(r));
        });
      });
    });
  }

  /* ------------------------------------------------ SELECT-ALL checkbox (table) */
  function initSelectAll() {
    $$("[data-select-all]").forEach((master) => {
      const scope = document.getElementById(master.dataset.selectAll) || master.closest("table");
      const boxes = () => $$('tbody input[type=checkbox]', scope);
      on(master, "change", () => boxes().forEach((b) => { b.checked = master.checked; b.closest("tr")?.classList.toggle("is-selected", master.checked); }));
      scope && on(scope, "change", (e) => {
        if (!e.target.matches('tbody input[type=checkbox]')) return;
        e.target.closest("tr")?.classList.toggle("is-selected", e.target.checked);
        const all = boxes(); master.checked = all.every((b) => b.checked);
        master.indeterminate = !master.checked && all.some((b) => b.checked);
      });
    });
  }

  /* ------------------------------------------------------------ COMBOBOX */
  function initCombobox() {
    $$(".combobox").forEach((cb) => {
      const input = $("input", cb), listbox = $(".combobox__listbox", cb);
      const options = $$(".combobox__option", cb);
      let act = -1;
      const openList = (o) => { cb.classList.toggle("is-open", o); input.setAttribute("aria-expanded", String(o)); };
      function filter() {
        const q = input.value.toLowerCase(); let any = false;
        options.forEach((o) => { const m = o.dataset.value.toLowerCase().includes(q); o.style.display = m ? "" : "none"; if (m) any = true; });
        const empty = $(".combobox__empty", cb); if (empty) empty.hidden = any;
        act = -1;
      }
      const vis = () => options.filter((o) => o.style.display !== "none");
      on(input, "focus", () => { filter(); openList(true); });
      on(input, "input", () => { filter(); openList(true); });
      on(input, "keydown", (e) => {
        const v = vis();
        if (e.key === "ArrowDown") { e.preventDefault(); act = Math.min(act + 1, v.length - 1); v.forEach((o, i) => o.classList.toggle("is-active", i === act)); }
        else if (e.key === "ArrowUp") { e.preventDefault(); act = Math.max(act - 1, 0); v.forEach((o, i) => o.classList.toggle("is-active", i === act)); }
        else if (e.key === "Enter" && act >= 0) { e.preventDefault(); v[act].click(); }
        else if (e.key === "Escape") openList(false);
      });
      options.forEach((o) => on(o, "click", () => { input.value = o.dataset.value; openList(false); }));
      on(document, "click", (e) => { if (!cb.contains(e.target)) openList(false); });
    });
  }

  /* ---------------------------------------------------------- MULTISELECT */
  function initMultiselect() {
    $$(".multiselect").forEach((ms) => {
      const control = $(".multiselect__control", ms), menu = $(".multiselect__menu", ms);
      const placeholder = $(".multiselect__placeholder", ms), options = $$(".multiselect__option", ms);
      const selected = new Set();
      const openMenu = (o) => ms.classList.toggle("is-open", o);
      function render() {
        $$(".chip", control).forEach((c) => c.remove());
        if (placeholder) placeholder.style.display = selected.size ? "none" : "";
        selected.forEach((val) => {
          const opt = options.find((o) => o.dataset.value === val);
          const chip = document.createElement("span"); chip.className = "chip";
          chip.innerHTML = (opt ? opt.dataset.label || opt.textContent.trim() : val) +
            '<button type="button" aria-label="제거"><svg viewBox="0 0 24 24" width="12" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg></button>';
          on($("button", chip), "click", (e) => { e.stopPropagation(); selected.delete(val); sync(); });
          control.insertBefore(chip, placeholder);
        });
      }
      function sync() { options.forEach((o) => o.setAttribute("aria-selected", String(selected.has(o.dataset.value)))); render(); }
      on(control, "click", () => openMenu(!ms.classList.contains("is-open")));
      options.forEach((o) => on(o, "click", () => { const v = o.dataset.value; selected.has(v) ? selected.delete(v) : selected.add(v); sync(); }));
      on(document, "click", (e) => { if (!ms.contains(e.target)) openMenu(false); });
      sync();
    });
  }

  /* ---------------------------------------------------------- FILEUPLOAD */
  function initFileUpload() {
    $$(".fileupload").forEach((fu) => {
      const input = $('input[type=file]', fu), label = $(".fileupload__text", fu);
      on(fu, "click", (e) => { if (e.target !== input) input && input.click(); });
      ["dragover", "dragenter"].forEach((ev) => on(fu, ev, (e) => { e.preventDefault(); fu.classList.add("is-drag"); }));
      ["dragleave", "drop"].forEach((ev) => on(fu, ev, (e) => { e.preventDefault(); fu.classList.remove("is-drag"); }));
      on(fu, "drop", (e) => { if (input && e.dataTransfer.files.length) { input.files = e.dataTransfer.files; update(); } });
      on(input, "change", update);
      function update() {
        if (!input.files.length) return;
        const names = Array.from(input.files).map((f) => f.name).join(", ");
        if (label) label.textContent = names;
        Toast.show({ variant: "success", title: "파일 선택됨", msg: names });
      }
    });
  }

  /* -------------------------------------------------------------- RATING */
  function initRating() {
    $$(".rating").forEach((r) => {
      on(r, "change", () => {
        const checked = $("input:checked", r);
        r.dispatchEvent(new CustomEvent("ratingchange", { detail: { value: checked && checked.value } }));
      });
    });
  }

  /* --------------------------------------------------------- CONTEXT MENU */
  function initContextMenu() {
    $$("[data-context-menu]").forEach((zone) => {
      const menu = document.getElementById(zone.dataset.contextMenu); if (!menu) return;
      on(zone, "contextmenu", (e) => {
        e.preventDefault();
        menu.classList.add("context-menu"); menu.style.display = "block";
        const x = Math.min(e.clientX, window.innerWidth - menu.offsetWidth - 8);
        const y = Math.min(e.clientY, window.innerHeight - menu.offsetHeight - 8);
        menu.style.left = x + "px"; menu.style.top = y + "px";
      });
      on(document, "click", () => { menu.style.display = "none"; });
      on(document, "keydown", (e) => { if (e.key === "Escape") menu.style.display = "none"; });
    });
  }

  /* -------------------------------------------------------------- WIZARD */
  function initWizard() {
    $$("[data-wizard]").forEach((wz) => {
      const steps = $$(".steps__step", wz), panels = $$("[data-wizard-panel]", wz);
      let cur = 0;
      const next = $("[data-wizard-next]", wz), prev = $("[data-wizard-prev]", wz);
      function render() {
        steps.forEach((s, i) => { s.classList.toggle("is-active", i === cur); s.classList.toggle("is-done", i < cur); });
        panels.forEach((p, i) => p.hidden = i !== cur);
        if (prev) prev.disabled = cur === 0;
        if (next) next.textContent = cur === panels.length - 1 ? "완료" : "다음";
      }
      on(next, "click", () => { if (cur < panels.length - 1) { cur++; render(); } else Toast.show({ variant: "success", title: "완료!", msg: "온보딩을 마쳤습니다." }); });
      on(prev, "click", () => { if (cur > 0) { cur--; render(); } });
      render();
    });
  }

  /* ------------------------------------------------ BILLING TOGGLE (pricing) */
  function initBillingToggle() {
    $$("[data-billing-toggle]").forEach((seg) => {
      on(seg, "segmentchange", (e) => {
        const annual = e.detail.value === "annual";
        $$("[data-price-monthly]").forEach((el) => el.hidden = annual);
        $$("[data-price-annual]").forEach((el) => el.hidden = !annual);
      });
    });
  }

  /* --------------------------------------------------------- SCROLL REVEAL */
  function initScrollReveal() {
    const els = $$("[data-reveal]");
    if (!("IntersectionObserver" in window) || !els.length) { els.forEach((e) => e.classList.add("reveal")); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("reveal"); io.unobserve(en.target); } });
    }, { threshold: 0.12 });
    els.forEach((e) => io.observe(e));
  }

  /* ------------------------------------------------------------- BAR ANIM */
  function initBarAnim() {
    $$(".bar-chart__bar[data-h]").forEach((b) => { requestAnimationFrame(() => { b.style.height = b.dataset.h; }); });
  }

  /* -------------------------------------------------------------- BANNER */
  function initBanner() {
    on(document, "click", (e) => {
      const b = e.target.closest("[data-banner-close]"); if (!b) return;
      const el = document.getElementById(b.dataset.bannerClose) || b.closest(".banner");
      if (el) el.remove();
    });
  }

  /* ----------------------------------------------------------------- BOOT */
  function boot() {
    Theme.init(); Modal.init(); Drawer.init(); Toast.init(); Cmdk.init();
    initTabs(); initAccordion(); initDropdown(); initSegmented(); initSlider();
    initStepper(); initCarousel(); initSidebar(); initCopy(); initTableSort();
    initSelectAll(); initCombobox(); initMultiselect(); initFileUpload(); initRating();
    initContextMenu(); initWizard(); initBillingToggle(); initScrollReveal(); initBarAnim();
    initBanner();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();

  /* Public API for inline page scripts */
  window.MCM = { Toast, Modal, Drawer, Cmdk, Theme };
})();
