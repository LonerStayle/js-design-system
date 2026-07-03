/* ============================================================================
   AURORA GLASS — theme-04-glassmorphism
   app.js · ALL INTERACTIONS (vanilla, zero dependencies)
   ----------------------------------------------------------------------------
   Everything is wired through data-attributes + event delegation so a single
   script powers index.html and every page in /pages without per-page setup.
   Works from file:// on double-click. Safe when elements are absent.
   ========================================================================== */
(function () {
  "use strict";
  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const on = (el, ev, fn, opts) => el && el.addEventListener(ev, fn, opts);
  const STORE = "aurora-glass";

  // Mark JS as live up-front so .js-ready-gated reveal styles take effect.
  document.documentElement.classList.add("js-ready");

  /* ----------------------------------------------------------- THEME ---- */
  const Theme = {
    get() {
      try { return localStorage.getItem(STORE + ":theme"); } catch (e) { return null; }
    },
    set(v) {
      document.documentElement.setAttribute("data-theme", v);
      try { localStorage.setItem(STORE + ":theme", v); } catch (e) {}
      $$("[data-theme-toggle]").forEach((b) => b.setAttribute("aria-pressed", String(v === "dark")));
      document.dispatchEvent(new CustomEvent("themechange", { detail: { theme: v } }));
    },
    init() {
      const saved = this.get();
      const prefersDark = window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches;
      this.set(saved || (prefersDark ? "dark" : "light"));
    },
    toggle() {
      this.set(document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark");
    },
  };
  Theme.init();
  on(document, "click", (e) => {
    if (e.target.closest("[data-theme-toggle]")) Theme.toggle();
  });

  /* --------------------------------------------------- AURORA BACKGROUND -- */
  // Inject the background layers once if a page didn't include them.
  function ensureAurora() {
    if (!$(".aurora-bg")) {
      const bg = document.createElement("div");
      bg.className = "aurora-bg"; bg.setAttribute("aria-hidden", "true");
      document.body.prepend(bg);
    }
    if (!$(".aurora-blobs")) {
      const blobs = document.createElement("div");
      blobs.className = "aurora-blobs"; blobs.setAttribute("aria-hidden", "true");
      blobs.innerHTML = '<span class="aurora-blob b1"></span><span class="aurora-blob b2"></span><span class="aurora-blob b3"></span><span class="aurora-blob b4"></span>';
      document.body.prepend(blobs);
    }
  }
  ensureAurora();

  // Parallax toggle — moves blobs with the pointer when enabled.
  const Parallax = {
    on: false,
    el: null,
    init() {
      this.el = $(".aurora-blobs");
      const saved = (function () { try { return localStorage.getItem(STORE + ":parallax"); } catch (e) { return null; } })();
      if (saved === "on") this.enable();
    },
    enable() {
      if (!this.el) return;
      this.on = true; this.el.setAttribute("data-parallax", "on");
      try { localStorage.setItem(STORE + ":parallax", "on"); } catch (e) {}
      $$("[data-parallax-toggle]").forEach((b) => b.setAttribute("aria-pressed", "true"));
    },
    disable() {
      if (!this.el) return;
      this.on = false; this.el.removeAttribute("data-parallax");
      this.el.style.removeProperty("--parx"); this.el.style.removeProperty("--pary");
      try { localStorage.setItem(STORE + ":parallax", "off"); } catch (e) {}
      $$("[data-parallax-toggle]").forEach((b) => b.setAttribute("aria-pressed", "false"));
    },
    toggle() { this.on ? this.disable() : this.enable(); },
  };
  Parallax.init();
  on(document, "click", (e) => { if (e.target.closest("[data-parallax-toggle]")) Parallax.toggle(); });
  const reduceMotion = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  on(window, "pointermove", (e) => {
    if (!Parallax.on || !Parallax.el || reduceMotion) return;
    const x = (e.clientX / window.innerWidth - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;
    Parallax.el.style.setProperty("--parx", x.toFixed(3));
    Parallax.el.style.setProperty("--pary", y.toFixed(3));
  }, { passive: true });

  /* ------------------------------------------------- OVERLAY MANAGEMENT -- */
  let lastFocus = null;
  function trapFocus(container, e) {
    const f = $$('a[href],button:not([disabled]),textarea,input,select,[tabindex]:not([tabindex="-1"])', container)
      .filter((el) => el.offsetParent !== null);
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
  function openOverlay(el) {
    if (!el) return;
    lastFocus = document.activeElement;
    el.setAttribute("data-open", "true");
    el.removeAttribute("hidden");
    document.body.style.overflow = "hidden";
    const focusable = $("[autofocus]", el) || $('input,button,[tabindex]', el);
    setTimeout(() => focusable && focusable.focus(), 60);
  }
  function closeOverlay(el) {
    if (!el) return;
    el.setAttribute("data-open", "false");
    document.body.style.overflow = "";
    if (lastFocus) lastFocus.focus();
  }
  // open triggers
  on(document, "click", (e) => {
    const t = e.target.closest("[data-open-target]");
    if (t) { e.preventDefault(); openOverlay($("#" + t.getAttribute("data-open-target"))); }
    const c = e.target.closest("[data-close]");
    if (c) { const ov = c.closest('[data-open], .scrim, .drawer, .drawer-scrim'); closeOverlay(ov); }
    // scrim background click closes
    if ((e.target.classList.contains("scrim") || e.target.classList.contains("drawer-scrim")) && e.target.getAttribute("data-dismiss") !== "false") {
      closeOverlay(e.target);
    }
  });
  on(document, "keydown", (e) => {
    if (e.key === "Escape") {
      const open = $$('[data-open="true"]');
      if (open.length) { closeOverlay(open[open.length - 1]); CmdK.close(); }
    }
    const openDialog = $$('.scrim[data-open="true"], .drawer[data-open="true"], .cmdk-scrim[data-open="true"]').pop();
    if (e.key === "Tab" && openDialog) trapFocus(openDialog, e);
  });

  /* -------------------------------------------------------- COMMAND ⌘K -- */
  const CmdK = {
    scrim: null, input: null, list: null, items: [], active: 0,
    init() {
      this.scrim = $("#cmdk");
      if (!this.scrim) return;
      this.input = $(".cmdk-input", this.scrim);
      this.list = $(".cmdk-list", this.scrim);
      this.all = $$(".cmdk-item", this.scrim);
      on(this.input, "input", () => this.filter());
      on(this.scrim, "click", (e) => {
        if (e.target === this.scrim) this.close();
        const it = e.target.closest(".cmdk-item");
        if (it) this.run(it);
      });
    },
    open() {
      if (!this.scrim) return;
      openOverlay(this.scrim);
      this.input.value = ""; this.filter(); this.active = 0; this.highlight();
      setTimeout(() => this.input.focus(), 60);
    },
    close() { if (this.scrim) closeOverlay(this.scrim); },
    filter() {
      const q = (this.input.value || "").toLowerCase().trim();
      let visible = 0;
      this.all.forEach((it) => {
        const txt = it.textContent.toLowerCase();
        const show = !q || txt.includes(q);
        it.style.display = show ? "" : "none";
        if (show) visible++;
      });
      $$(".cmdk-group-label", this.scrim).forEach((g) => {
        let n = g.nextElementSibling, any = false;
        while (n && n.classList.contains("cmdk-item")) { if (n.style.display !== "none") any = true; n = n.nextElementSibling; }
        g.style.display = any ? "" : "none";
      });
      let empty = $(".cmdk-empty", this.scrim);
      if (empty) empty.hidden = visible !== 0;
      this.items = this.all.filter((it) => it.style.display !== "none");
      this.active = 0; this.highlight();
    },
    highlight() {
      this.all.forEach((it) => it.classList.remove("is-active"));
      if (this.items[this.active]) {
        this.items[this.active].classList.add("is-active");
        this.items[this.active].scrollIntoView({ block: "nearest" });
      }
    },
    move(d) { if (!this.items.length) return; this.active = (this.active + d + this.items.length) % this.items.length; this.highlight(); },
    run(it) {
      const href = it.getAttribute("data-href");
      const action = it.getAttribute("data-action");
      this.close();
      if (action === "toggle-theme") Theme.toggle();
      else if (action === "toggle-parallax") Parallax.toggle();
      else if (href) window.location.href = href;
      else Toast.show({ title: it.querySelector(".ci-title") ? it.querySelector(".ci-title").textContent : "실행됨", type: "success" });
    },
  };
  CmdK.init();
  on(document, "keydown", (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); CmdK.scrim && (CmdK.scrim.getAttribute("data-open") === "true" ? CmdK.close() : CmdK.open()); }
    if (CmdK.scrim && CmdK.scrim.getAttribute("data-open") === "true") {
      if (e.key === "ArrowDown") { e.preventDefault(); CmdK.move(1); }
      if (e.key === "ArrowUp") { e.preventDefault(); CmdK.move(-1); }
      if (e.key === "Enter") { e.preventDefault(); CmdK.items[CmdK.active] && CmdK.run(CmdK.items[CmdK.active]); }
    }
  });
  on(document, "click", (e) => { if (e.target.closest("[data-cmdk-open]")) CmdK.open(); });

  /* ----------------------------------------------------------- TOASTS --- */
  const Toast = {
    region: null,
    ensure() {
      if (!this.region) {
        this.region = $(".toast-region") || (function () {
          const r = document.createElement("div");
          r.className = "toast-region"; r.setAttribute("role", "status"); r.setAttribute("aria-live", "polite");
          document.body.appendChild(r); return r;
        })();
      }
      return this.region;
    },
    icons: {
      success: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>',
      info:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 16v-5M12 8h.01"/></svg>',
      warning: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4M12 17h.01"/></svg>',
      danger:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M15 9l-6 6M9 9l6 6"/></svg>',
    },
    show(opts) {
      opts = opts || {};
      const type = opts.type || "info";
      const region = this.ensure();
      const el = document.createElement("div");
      el.className = "toast " + type; el.setAttribute("role", "alert");
      el.innerHTML =
        '<span class="toast-ico">' + (this.icons[type] || this.icons.info) + '</span>' +
        '<div class="toast-body"><div class="toast-title">' + (opts.title || "알림") + '</div>' +
        (opts.text ? '<div class="toast-text">' + opts.text + '</div>' : '') + '</div>' +
        '<button class="toast-close" aria-label="닫기"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg></button>' +
        '<span class="toast-progress"></span>';
      region.appendChild(el);
      const dur = opts.duration || 4000;
      const timer = setTimeout(() => this.dismiss(el), dur);
      on($(".toast-close", el), "click", () => { clearTimeout(timer); this.dismiss(el); });
      return el;
    },
    dismiss(el) { el.classList.add("leaving"); setTimeout(() => el.remove(), 240); },
  };
  window.AuroraToast = Toast; // expose for demos
  on(document, "click", (e) => {
    const t = e.target.closest("[data-toast]");
    if (t) Toast.show({ title: t.getAttribute("data-toast-title") || t.getAttribute("data-toast") || "저장되었습니다", text: t.getAttribute("data-toast-text") || "", type: t.getAttribute("data-toast") || "success" });
  });

  /* ------------------------------------------------------------- TABS --- */
  $$("[data-tabs]").forEach((group) => {
    const tabs = $$('[role="tab"]', group);
    const panels = $$('[role="tabpanel"]', group);
    function select(tab) {
      tabs.forEach((t) => { const sel = t === tab; t.setAttribute("aria-selected", String(sel)); t.tabIndex = sel ? 0 : -1; });
      panels.forEach((p) => { p.hidden = p.id !== tab.getAttribute("aria-controls"); });
    }
    tabs.forEach((tab, i) => {
      on(tab, "click", () => select(tab));
      on(tab, "keydown", (e) => {
        let idx = null;
        if (e.key === "ArrowRight") idx = (i + 1) % tabs.length;
        if (e.key === "ArrowLeft") idx = (i - 1 + tabs.length) % tabs.length;
        if (e.key === "Home") idx = 0;
        if (e.key === "End") idx = tabs.length - 1;
        if (idx !== null) { e.preventDefault(); tabs[idx].focus(); select(tabs[idx]); }
      });
    });
  });

  /* --------------------------------------------------------- ACCORDION -- */
  on(document, "click", (e) => {
    const trig = e.target.closest(".accordion-trigger");
    if (!trig) return;
    const item = trig.closest(".accordion-item");
    const acc = trig.closest(".accordion");
    const isOpen = item.classList.contains("is-open");
    if (acc && acc.getAttribute("data-single") === "true") {
      $$(".accordion-item", acc).forEach((it) => { it.classList.remove("is-open"); const tr = $(".accordion-trigger", it); tr && tr.setAttribute("aria-expanded", "false"); });
    }
    item.classList.toggle("is-open", !isOpen);
    trig.setAttribute("aria-expanded", String(!isOpen));
  });

  /* ----------------------------------------------- DROPDOWN / MENU ------ */
  function closeAllDropdowns(except) {
    $$(".dropdown-menu").forEach((m) => { if (m !== except) { m.hidden = true; const t = m.closest(".dropdown"); const btn = t && $("[data-dropdown-toggle]", t); btn && btn.setAttribute("aria-expanded", "false"); } });
  }
  on(document, "click", (e) => {
    const toggle = e.target.closest("[data-dropdown-toggle]");
    if (toggle) {
      const dd = toggle.closest(".dropdown");
      const menu = $(".dropdown-menu", dd);
      const willOpen = menu.hidden;
      closeAllDropdowns(willOpen ? menu : null);
      menu.hidden = !willOpen;
      toggle.setAttribute("aria-expanded", String(willOpen));
      return;
    }
    if (!e.target.closest(".dropdown-menu")) closeAllDropdowns();
  });

  /* ------------------------------------------------------ CONTEXT MENU -- */
  const ctxMenu = $("#context-menu");
  if (ctxMenu) {
    const zone = $("[data-contextmenu]") || document.body;
    on(zone, "contextmenu", (e) => {
      if (!e.target.closest("[data-contextmenu]")) return;
      e.preventDefault();
      ctxMenu.hidden = false;
      const w = ctxMenu.offsetWidth, h = ctxMenu.offsetHeight;
      ctxMenu.style.left = Math.min(e.clientX, window.innerWidth - w - 8) + "px";
      ctxMenu.style.top = Math.min(e.clientY, window.innerHeight - h - 8) + "px";
    });
    on(document, "click", () => { ctxMenu.hidden = true; });
    on(document, "scroll", () => { ctxMenu.hidden = true; }, true);
  }

  /* --------------------------------------------------- SEGMENTED CTRL --- */
  $$(".segmented").forEach((seg) => {
    const btns = $$("button", seg);
    let thumb = $(".seg-thumb", seg);
    if (!thumb) { thumb = document.createElement("span"); thumb.className = "seg-thumb"; seg.prepend(thumb); }
    function move(btn) {
      thumb.style.left = btn.offsetLeft + "px";
      thumb.style.width = btn.offsetWidth + "px";
    }
    function select(btn) {
      btns.forEach((b) => { b.setAttribute("aria-selected", String(b === btn)); b.classList.toggle("is-active", b === btn); });
      move(btn);
      seg.dispatchEvent(new CustomEvent("segchange", { detail: { value: btn.getAttribute("data-value") || btn.textContent } }));
    }
    btns.forEach((b) => on(b, "click", () => select(b)));
    const init = seg.querySelector('[aria-selected="true"], .is-active') || btns[0];
    if (init) requestAnimationFrame(() => move(init));
    on(window, "resize", () => { const cur = seg.querySelector('[aria-selected="true"], .is-active') || btns[0]; cur && move(cur); });
  });

  /* ---------------------------------------------------------- SLIDER ---- */
  $$(".range.is-filled").forEach((r) => {
    const upd = () => {
      const min = +r.min || 0, max = +r.max || 100;
      const pct = ((r.value - min) / (max - min)) * 100;
      r.style.setProperty("--val", pct + "%");
      const out = r.closest(".slider") && $(".slider-value", r.closest(".slider"));
      if (out) out.textContent = (r.getAttribute("data-prefix") || "") + r.value + (r.getAttribute("data-suffix") || "");
    };
    on(r, "input", upd); upd();
  });

  /* --------------------------------------------------------- STEPPER ---- */
  $$(".stepper").forEach((st) => {
    const input = $("input", st);
    const dec = $('[data-step="-1"]', st) || $$("button", st)[0];
    const inc = $('[data-step="1"]', st) || $$("button", st)[1];
    const min = input.min !== "" ? +input.min : -Infinity;
    const max = input.max !== "" ? +input.max : Infinity;
    const step = +input.step || 1;
    const clamp = (v) => Math.max(min, Math.min(max, v));
    on(dec, "click", () => { input.value = clamp((+input.value || 0) - step); input.dispatchEvent(new Event("change")); });
    on(inc, "click", () => { input.value = clamp((+input.value || 0) + step); input.dispatchEvent(new Event("change")); });
  });

  /* ---------------------------------------------------------- RATING ---- */
  $$(".rating").forEach((rt) => {
    if (rt.classList.contains("is-readonly")) return;
    const btns = $$("button", rt);
    let value = +rt.getAttribute("data-value") || 0;
    const paint = (n) => btns.forEach((b, i) => b.classList.toggle("is-on", i < n));
    paint(value);
    btns.forEach((b, i) => {
      on(b, "mouseenter", () => paint(i + 1));
      on(b, "click", () => { value = i + 1; rt.setAttribute("data-value", value); paint(value); });
    });
    on(rt, "mouseleave", () => paint(value));
  });

  /* -------------------------------------------------------- CHIP INPUT -- */
  $$(".chipinput").forEach((ci) => {
    const input = $("input", ci);
    function addChip(text) {
      if (!text.trim()) return;
      const chip = document.createElement("span");
      chip.className = "chip";
      chip.innerHTML = text.replace(/</g, "&lt;") + '<button class="chip-remove" aria-label="제거"><svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg></button>';
      ci.insertBefore(chip, input);
    }
    on(input, "keydown", (e) => {
      if ((e.key === "Enter" || e.key === ",") && input.value.trim()) { e.preventDefault(); addChip(input.value.trim()); input.value = ""; }
      if (e.key === "Backspace" && !input.value) { const chips = $$(".chip", ci); chips.length && chips[chips.length - 1].remove(); }
    });
    on(ci, "click", (e) => { if (e.target.closest(".chip-remove")) e.target.closest(".chip").remove(); else input.focus(); });
  });
  // generic removable chips elsewhere
  on(document, "click", (e) => { const rm = e.target.closest(".chip-remove"); if (rm && !rm.closest(".chipinput")) rm.closest(".chip").remove(); });

  /* ----------------------------------------------- COMBOBOX / SELECT ---- */
  $$(".combobox").forEach((cb) => {
    const control = $(".combobox-control", cb);
    const listbox = $(".listbox", cb);
    if (!control || !listbox) return;
    const multi = cb.getAttribute("data-multi") === "true";
    const placeholderText = control.getAttribute("data-placeholder") || $(".placeholder", control)?.textContent || "선택";
    const valEl = $(".combobox-value", control);
    function open() { cb.classList.add("is-open"); listbox.hidden = false; control.setAttribute("aria-expanded", "true"); }
    function close() { cb.classList.remove("is-open"); listbox.hidden = true; control.setAttribute("aria-expanded", "false"); }
    on(control, "click", () => { cb.classList.contains("is-open") ? close() : open(); });
    $$(".option", listbox).forEach((opt) => {
      on(opt, "click", (e) => {
        e.stopPropagation();
        if (multi) {
          const sel = opt.getAttribute("aria-selected") === "true";
          opt.setAttribute("aria-selected", String(!sel));
          renderTags();
        } else {
          $$(".option", listbox).forEach((o) => o.setAttribute("aria-selected", "false"));
          opt.setAttribute("aria-selected", "true");
          if (valEl) valEl.textContent = opt.getAttribute("data-label") || opt.textContent.trim();
          if (valEl) valEl.classList.remove("placeholder");
          close();
        }
      });
    });
    function renderTags() {
      const tagsBox = $(".combobox-tags", control);
      if (!tagsBox) return;
      const selected = $$('.option[aria-selected="true"]', listbox);
      tagsBox.innerHTML = selected.length
        ? selected.map((o) => '<span class="chip">' + (o.getAttribute("data-label") || o.textContent.trim()) + '</span>').join("")
        : '<span class="placeholder">' + placeholderText + '</span>';
    }
    if (multi) renderTags();
    on(document, "click", (e) => { if (!cb.contains(e.target)) close(); });
  });

  /* ----------------------------------------------------------- TABLE ---- */
  $$("table[data-sortable]").forEach((table) => {
    const tbody = $("tbody", table);
    $$("th.sortable", table).forEach((th, colIndex) => {
      on(th, "click", () => {
        const idx = Array.from(th.parentNode.children).indexOf(th);
        const cur = th.getAttribute("aria-sort");
        const dir = cur === "ascending" ? "descending" : "ascending";
        $$("th", table).forEach((h) => h.removeAttribute("aria-sort"));
        th.setAttribute("aria-sort", dir);
        const rows = $$("tr", tbody);
        const type = th.getAttribute("data-type") || "text";
        rows.sort((a, b) => {
          let av = a.children[idx].getAttribute("data-sort") || a.children[idx].textContent.trim();
          let bv = b.children[idx].getAttribute("data-sort") || b.children[idx].textContent.trim();
          if (type === "number") { av = parseFloat(av.replace(/[^0-9.\-]/g, "")) || 0; bv = parseFloat(bv.replace(/[^0-9.\-]/g, "")) || 0; }
          let cmp = av > bv ? 1 : av < bv ? -1 : 0;
          return dir === "ascending" ? cmp : -cmp;
        });
        rows.forEach((r) => tbody.appendChild(r));
      });
    });
    // row selection
    const selectAll = $('thead [data-select-all]', table);
    function updateAll() {
      const boxes = $$('tbody [data-row-select]', table);
      const checked = boxes.filter((b) => b.checked);
      if (selectAll) selectAll.indeterminate = checked.length > 0 && checked.length < boxes.length, selectAll.checked = boxes.length && checked.length === boxes.length;
      boxes.forEach((b) => { const tr = b.closest("tr"); tr && tr.setAttribute("aria-selected", String(b.checked)); });
      const bar = table.closest(".table-wrap")?.querySelector("[data-selection-count]");
      if (bar) bar.textContent = checked.length;
    }
    on(selectAll, "change", () => { $$('tbody [data-row-select]', table).forEach((b) => (b.checked = selectAll.checked)); updateAll(); });
    $$('tbody [data-row-select]', table).forEach((b) => on(b, "change", updateAll));
  });

  /* ------------------------------------------------------ FILE UPLOAD --- */
  $$(".fileupload").forEach((fu) => {
    const input = $('input[type="file"]', fu) || (function () { const i = document.createElement("input"); i.type = "file"; i.multiple = true; i.hidden = true; fu.appendChild(i); return i; })();
    const list = fu.parentElement && $(".file-list", fu.parentElement);
    on(fu, "click", (e) => { if (e.target !== input) input.click(); });
    on(fu, "dragover", (e) => { e.preventDefault(); fu.classList.add("is-dragover"); });
    on(fu, "dragleave", () => fu.classList.remove("is-dragover"));
    on(fu, "drop", (e) => { e.preventDefault(); fu.classList.remove("is-dragover"); render(e.dataTransfer.files); });
    on(input, "change", () => render(input.files));
    function render(files) {
      if (!list) { Toast.show({ title: files.length + "개 파일 추가됨", type: "success" }); return; }
      Array.from(files).forEach((f) => {
        const item = document.createElement("div");
        item.className = "file-item";
        item.innerHTML = '<span class="fi-icon"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg></span>' +
          '<div class="fi-meta"><div class="fi-name">' + f.name + '</div><div class="fi-size">' + (f.size / 1024).toFixed(1) + ' KB</div></div>' +
          '<button class="btn btn-icon btn-sm btn-ghost" aria-label="삭제"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/></svg></button>';
        on($("button", item), "click", () => item.remove());
        list.appendChild(item);
      });
    }
  });

  /* -------------------------------------------------------- CAROUSEL ---- */
  $$(".carousel").forEach((car) => {
    const track = $(".carousel-track", car);
    const slides = $$(".carousel-slide", track);
    const dots = $(".carousel-dots", car);
    const prev = $(".carousel-nav.prev", car), next = $(".carousel-nav.next", car);
    if (dots && !dots.children.length) slides.forEach((_, i) => { const b = document.createElement("button"); b.setAttribute("aria-label", "슬라이드 " + (i + 1)); if (i === 0) b.classList.add("is-active"); dots.appendChild(b); });
    function scrollToIndex(i) { slides[i] && slides[i].scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" }); }
    if (dots) $$("button", dots).forEach((d, i) => on(d, "click", () => scrollToIndex(i)));
    on(prev, "click", () => track.scrollBy({ left: -track.clientWidth * 0.8, behavior: "smooth" }));
    on(next, "click", () => track.scrollBy({ left: track.clientWidth * 0.8, behavior: "smooth" }));
    on(track, "scroll", () => {
      if (!dots) return;
      const center = track.scrollLeft + track.clientWidth / 2;
      let best = 0, bestDist = Infinity;
      slides.forEach((s, i) => { const d = Math.abs(s.offsetLeft + s.offsetWidth / 2 - center); if (d < bestDist) { bestDist = d; best = i; } });
      $$("button", dots).forEach((b, i) => b.classList.toggle("is-active", i === best));
    }, { passive: true });
  });

  /* --------------------------------------------------------- COPY CODE -- */
  on(document, "click", (e) => {
    const btn = e.target.closest(".cb-copy, [data-copy]");
    if (!btn) return;
    const target = btn.getAttribute("data-copy") ? $(btn.getAttribute("data-copy")) : btn.closest(".codeblock")?.querySelector("code");
    const text = target ? target.textContent : btn.getAttribute("data-copy-text") || "";
    const done = () => Toast.show({ title: "클립보드에 복사됨", type: "success", duration: 1800 });
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done).catch(done);
    else done();
  });

  /* ----------------------------------------------- SIDEBAR / MOBILE NAV - */
  on(document, "click", (e) => {
    if (e.target.closest("[data-sidebar-toggle]")) { const sb = $(".sidebar"); sb && sb.classList.toggle("collapsed"); }
    if (e.target.closest("[data-mobile-nav]")) { const d = $("#mobile-nav"); openOverlay(d); }
  });

  /* ----------------------------------------------- PRICING MONTH/YEAR --- */
  $$("[data-pricing-toggle]").forEach((seg) => {
    on(seg, "segchange", (e) => {
      const yearly = (e.detail.value || "").toLowerCase().includes("연") || (e.detail.value || "").toLowerCase().includes("year");
      $$("[data-price]").forEach((p) => { p.textContent = yearly ? p.getAttribute("data-price-year") : p.getAttribute("data-price-month"); });
      $$("[data-price-note]").forEach((n) => (n.textContent = yearly ? n.getAttribute("data-note-year") || "연 청구" : n.getAttribute("data-note-month") || "월 청구"));
    });
  });

  /* ---------------------------------------------- WIZARD (Steps) -------- */
  $$("[data-wizard]").forEach((wz) => {
    const steps = $$(".step", wz);
    const panels = $$("[data-wizard-panel]", wz);
    let current = 0;
    function render() {
      steps.forEach((s, i) => { s.classList.toggle("active", i === current); s.classList.toggle("done", i < current); });
      panels.forEach((p, i) => (p.hidden = i !== current));
      const back = $("[data-wizard-back]", wz), nextb = $("[data-wizard-next]", wz);
      if (back) back.disabled = current === 0;
      if (nextb) nextb.textContent = current === panels.length - 1 ? "완료" : "다음";
    }
    on($("[data-wizard-next]", wz), "click", () => { if (current < panels.length - 1) { current++; render(); } else Toast.show({ title: "온보딩 완료! 🎉", type: "success" }); });
    on($("[data-wizard-back]", wz), "click", () => { if (current > 0) { current--; render(); } });
    render();
  });

  /* ---------------------------------------------- SCROLL REVEAL --------- */
  if ("IntersectionObserver" in window && !reduceMotion) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in-view"); io.unobserve(en.target); } });
    }, { threshold: 0.08, rootMargin: "0px 0px -5% 0px" });
    $$("[data-reveal]").forEach((el) => io.observe(el));
  } else {
    $$("[data-reveal]").forEach((el) => el.classList.add("in-view"));
  }

  /* ---------------------------------------------- ANIMATED COUNTERS ----- */
  function animateCount(el) {
    const target = parseFloat(el.getAttribute("data-count"));
    const dur = 1200, prefix = el.getAttribute("data-prefix") || "", suffix = el.getAttribute("data-suffix") || "";
    const dec = parseInt(el.getAttribute("data-decimals") || "0", 10);
    let start = null;
    if (reduceMotion) { el.textContent = prefix + target.toLocaleString(undefined, { minimumFractionDigits: dec, maximumFractionDigits: dec }) + suffix; return; }
    function tick(ts) {
      if (!start) start = ts;
      const p = Math.min((ts - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = prefix + (target * eased).toLocaleString(undefined, { minimumFractionDigits: dec, maximumFractionDigits: dec }) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  if ("IntersectionObserver" in window) {
    const co = new IntersectionObserver((entries) => entries.forEach((en) => { if (en.isIntersecting) { animateCount(en.target); co.unobserve(en.target); } }), { threshold: 0.5 });
    $$("[data-count]").forEach((el) => co.observe(el));
  } else { $$("[data-count]").forEach(animateCount); }

  /* ---------------------------------------------- KANBAN DRAG/DROP ------ */
  $$("[data-kanban]").forEach((board) => {
    let dragEl = null;
    $$(".kanban-card", board).forEach(makeDraggable);
    function makeDraggable(card) {
      card.setAttribute("draggable", "true");
      on(card, "dragstart", () => { dragEl = card; setTimeout(() => card.classList.add("is-dragging"), 0); });
      on(card, "dragend", () => { card.classList.remove("is-dragging"); dragEl = null; updateCounts(); });
    }
    $$("[data-kanban-list]", board).forEach((col) => {
      on(col, "dragover", (e) => {
        e.preventDefault();
        const after = getAfter(col, e.clientY);
        if (!dragEl) return;
        if (after == null) col.appendChild(dragEl); else col.insertBefore(dragEl, after);
      });
    });
    function getAfter(col, y) {
      const cards = $$(".kanban-card:not(.is-dragging)", col);
      return cards.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) return { offset, element: child };
        return closest;
      }, { offset: -Infinity }).element;
    }
    function updateCounts() {
      $$("[data-kanban-list]", board).forEach((col) => {
        const count = $$(".kanban-card", col).length;
        const badge = col.closest("[data-kanban-col]")?.querySelector("[data-kanban-count]");
        if (badge) badge.textContent = count;
      });
    }
  });

  /* ---------------------------------------------- GENERIC TOGGLE CLASS -- */
  on(document, "click", (e) => {
    const t = e.target.closest("[data-toggle-class]");
    if (!t) return;
    const target = $(t.getAttribute("data-target"));
    if (target) target.classList.toggle(t.getAttribute("data-toggle-class"));
  });

  /* ---------------------------------------------- PAGE LOAD FLAG -------- */
  document.documentElement.classList.add("js-ready");
  console.log("%c✦ Aurora Glass ready", "color:#7c5cff;font-weight:bold");
})();
