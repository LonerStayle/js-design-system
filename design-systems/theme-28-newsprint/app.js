/* ============================================================================
   THE LEDGER — Theme 28 · "Newsprint"
   app.js — all interactions, vanilla JS, zero dependencies.
   ----------------------------------------------------------------------------
   Self-initialising. Include once per page:
       <script src="app.js" defer></script>  (adjust ../ depth for /pages/*)
   Everything wires itself from data-attributes / semantic classes on DOMReady.
   Public helpers exposed on  window.Ledger  (toast, openModal, …).
   ============================================================================ */
(function () {
  "use strict";

  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const on = (el, ev, fn, opts) => el && el.addEventListener(ev, fn, opts);
  const prefersReduced = () =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ======================================================================
     THEME — Day / Night edition toggle  (persisted)
     ====================================================================== */
  const THEME_KEY = "ledger-theme";
  const Theme = {
    get() {
      try { return localStorage.getItem(THEME_KEY); } catch (e) { return null; }
    },
    set(v) {
      try { localStorage.setItem(THEME_KEY, v); } catch (e) {}
    },
    apply(v) {
      document.documentElement.setAttribute("data-theme", v);
      $$("[data-theme-toggle]").forEach((btn) => {
        btn.setAttribute("aria-pressed", String(v === "dark"));
        const lbl = btn.querySelector("[data-theme-label]");
        if (lbl) lbl.textContent = v === "dark" ? "야간판" : "주간판";
      });
    },
    init() {
      const saved = this.get();
      const sys = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark" : "light";
      this.apply(saved || sys);
      $$("[data-theme-toggle]").forEach((btn) =>
        on(btn, "click", () => {
          const next =
            document.documentElement.getAttribute("data-theme") === "dark"
              ? "light" : "dark";
          this.apply(next);
          this.set(next);
        })
      );
    },
  };

  /* ======================================================================
     LIVE DATELINE — keep the masthead date honest
     ====================================================================== */
  function initDatelines() {
    const els = $$("[data-dateline]");
    if (!els.length) return;
    const now = new Date();
    // 한국 일간지 데이트라인: "2026년 7월 9일 목요일 · 단기 4359년"
    const full = now.toLocaleDateString("ko-KR", {
      year: "numeric", month: "long", day: "numeric", weekday: "long",
    });
    const dangi = now.getFullYear() + 2333;      // 단기(檀紀) = 서기 + 2333
    const pad = (n) => String(n).padStart(2, "0");
    const short = `${now.getFullYear()}.${pad(now.getMonth() + 1)}.${pad(now.getDate())}`;
    els.forEach((el) => {
      const mode = el.getAttribute("data-dateline");
      if (mode === "short") {
        el.textContent = short;
      } else if (mode === "dangi") {
        el.textContent = `${full} · 단기 ${dangi}년`;
      } else {
        el.textContent = full;
      }
    });
  }

  /* ======================================================================
     TABS  — [data-tabs] container, [role=tab][aria-controls], roving focus
     ====================================================================== */
  function initTabs() {
    $$("[data-tabs]").forEach((group) => {
      const tabs = $$('[role="tab"]', group);
      const select = (tab) => {
        tabs.forEach((t) => {
          const on_ = t === tab;
          t.setAttribute("aria-selected", String(on_));
          t.tabIndex = on_ ? 0 : -1;
          const panel = document.getElementById(t.getAttribute("aria-controls"));
          if (panel) panel.hidden = !on_;
        });
      };
      tabs.forEach((tab, i) => {
        on(tab, "click", () => select(tab));
        on(tab, "keydown", (e) => {
          let idx = null;
          if (e.key === "ArrowRight" || e.key === "ArrowDown") idx = (i + 1) % tabs.length;
          else if (e.key === "ArrowLeft" || e.key === "ArrowUp") idx = (i - 1 + tabs.length) % tabs.length;
          else if (e.key === "Home") idx = 0;
          else if (e.key === "End") idx = tabs.length - 1;
          if (idx !== null) { e.preventDefault(); tabs[idx].focus(); select(tabs[idx]); }
        });
      });
    });
  }

  /* ======================================================================
     ACCORDION — [data-accordion] with .accordion__trigger
     ====================================================================== */
  function initAccordion() {
    $$("[data-accordion]").forEach((acc) => {
      const single = acc.hasAttribute("data-accordion-single");
      const triggers = $$(".accordion__trigger", acc);
      triggers.forEach((trig) => {
        const panel = trig.nextElementSibling;
        on(trig, "click", () => {
          const open = trig.getAttribute("aria-expanded") === "true";
          if (single && !open) {
            triggers.forEach((t) => {
              t.setAttribute("aria-expanded", "false");
              if (t.nextElementSibling) t.nextElementSibling.dataset.open = "false";
            });
          }
          trig.setAttribute("aria-expanded", String(!open));
          if (panel) panel.dataset.open = String(!open);
        });
      });
    });
  }

  /* ======================================================================
     SEGMENTED CONTROL  /  simple toggle-group  [data-segmented]
     ====================================================================== */
  function initSegmented() {
    $$("[data-segmented]").forEach((seg) => {
      const btns = $$("button", seg);
      if (!btns.length) return;
      // Radiogroup pattern uses aria-checked; legacy tab markup uses aria-selected.
      const isRadio = seg.getAttribute("role") === "radiogroup" ||
                      btns[0].getAttribute("role") === "radio";
      const attr = isRadio ? "aria-checked" : "aria-selected";
      const select = (b, focus) => {
        btns.forEach((x) => {
          const on_ = x === b;
          x.setAttribute(attr, String(on_));
          if (isRadio) x.tabIndex = on_ ? 0 : -1;   // roving tabindex
        });
        if (focus) b.focus();
        seg.dispatchEvent(new CustomEvent("segment:change",
          { detail: { value: b.dataset.value ?? b.textContent.trim() } }));
      };
      // establish an initial tab stop for keyboard entry
      if (isRadio && !btns.some((b) => b.tabIndex === 0)) {
        const cur = btns.find((b) => b.getAttribute("aria-checked") === "true") || btns[0];
        btns.forEach((b) => (b.tabIndex = b === cur ? 0 : -1));
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
    });
  }

  /* ======================================================================
     MODAL / DIALOG  — [data-modal-open="id"], focus trap, ESC, scrim
     ====================================================================== */
  let lastFocused = null;
  function getScrim() {
    let s = $("#ledger-scrim");
    if (!s) {
      s = document.createElement("div");
      s.id = "ledger-scrim";
      s.className = "scrim";
      s.hidden = true;
      document.body.appendChild(s);
    }
    return s;
  }
  function trapFocus(container, e) {
    const f = $$('a[href],button:not([disabled]),input:not([disabled]),select,textarea,[tabindex]:not([tabindex="-1"])', container)
      .filter((el) => el.offsetParent !== null);
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
  function openModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    const scrim = getScrim();
    lastFocused = document.activeElement;
    scrim.hidden = false;
    modal.hidden = false;
    requestAnimationFrame(() => { scrim.classList.add("is-open"); modal.classList.add("is-open"); });
    document.body.style.overflow = "hidden";
    const focusable = $('[autofocus], button, [href], input, select, textarea', modal);
    if (focusable) setTimeout(() => focusable.focus(), 50);
    modal._key = (e) => {
      if (e.key === "Escape") closeModal(id);
      if (e.key === "Tab") trapFocus(modal, e);
    };
    on(document, "keydown", modal._key);
    scrim._close = () => closeModal(id);
    on(scrim, "click", scrim._close);
  }
  function closeModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    const scrim = getScrim();
    modal.classList.remove("is-open");
    scrim.classList.remove("is-open");
    document.removeEventListener("keydown", modal._key);
    if (scrim._close) scrim.removeEventListener("click", scrim._close);
    document.body.style.overflow = "";
    const done = () => { modal.hidden = true; scrim.hidden = true; modal.removeEventListener("transitionend", done); };
    if (prefersReduced()) done(); else setTimeout(done, 220);
    if (lastFocused) lastFocused.focus();
  }
  function initModals() {
    $$("[data-modal-open]").forEach((t) =>
      on(t, "click", (e) => { e.preventDefault(); openModal(t.getAttribute("data-modal-open")); }));
    $$("[data-modal-close]").forEach((t) =>
      on(t, "click", (e) => {
        e.preventDefault();
        const m = t.closest(".modal");
        if (m) closeModal(m.id);
      }));
  }

  /* ======================================================================
     DRAWER  — [data-drawer-open="id"]
     ====================================================================== */
  function openDrawer(id) {
    const d = document.getElementById(id);
    if (!d) return;
    const scrim = getScrim();
    lastFocused = document.activeElement;
    scrim.hidden = false; d.hidden = false;
    requestAnimationFrame(() => { scrim.classList.add("is-open"); d.classList.add("is-open"); });
    document.body.style.overflow = "hidden";
    d._key = (e) => { if (e.key === "Escape") closeDrawer(id); if (e.key === "Tab") trapFocus(d, e); };
    on(document, "keydown", d._key);
    scrim._closeD = () => closeDrawer(id);
    on(scrim, "click", scrim._closeD);
    const f = $("button,[href],input,select,textarea", d);
    if (f) setTimeout(() => f.focus(), 60);
  }
  function closeDrawer(id) {
    const d = document.getElementById(id);
    if (!d) return;
    const scrim = getScrim();
    d.classList.remove("is-open"); scrim.classList.remove("is-open");
    document.removeEventListener("keydown", d._key);
    if (scrim._closeD) scrim.removeEventListener("click", scrim._closeD);
    document.body.style.overflow = "";
    const done = () => { d.hidden = true; scrim.hidden = true; };
    if (prefersReduced()) done(); else setTimeout(done, 320);
    if (lastFocused) lastFocused.focus();
  }
  function initDrawers() {
    $$("[data-drawer-open]").forEach((t) =>
      on(t, "click", (e) => { e.preventDefault(); openDrawer(t.getAttribute("data-drawer-open")); }));
    $$("[data-drawer-close]").forEach((t) =>
      on(t, "click", (e) => { e.preventDefault(); const d = t.closest(".drawer"); if (d) closeDrawer(d.id); }));
  }

  /* ======================================================================
     TOAST  — Ledger.toast({title,text,variant,timeout})
     ====================================================================== */
  function toastStack() {
    let s = $(".toast-stack");
    if (!s) { s = document.createElement("div"); s.className = "toast-stack"; s.setAttribute("role", "status"); s.setAttribute("aria-live", "polite"); document.body.appendChild(s); }
    return s;
  }
  const ICONS = {
    success: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6 9 17l-5-5"/></svg>',
    danger:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 8v5M12 16.5v.5"/><circle cx="12" cy="12" r="9"/></svg>',
    warning: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 3 2 20h20L12 3zM12 10v4M12 17v.5"/></svg>',
    info:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8v.5"/></svg>',
  };
  function toast({ title = "알림", text = "", variant = "info", timeout = 4200 } = {}) {
    const stack = toastStack();
    const el = document.createElement("div");
    el.className = "toast toast--" + variant;
    el.setAttribute("role", "alert");
    el.innerHTML =
      `<span class="toast__icon">${ICONS[variant] || ICONS.info}</span>
       <div class="toast__body"><div class="toast__title">${title}</div>${text ? `<div class="toast__text">${text}</div>` : ""}</div>
       <button class="toast__close" aria-label="닫기"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6l12 12M18 6 6 18"/></svg></button>`;
    stack.appendChild(el);
    const close = () => {
      el.classList.add("is-leaving");
      const rm = () => el.remove();
      if (prefersReduced()) rm(); else setTimeout(rm, 220);
    };
    on(el.querySelector(".toast__close"), "click", close);
    if (timeout) setTimeout(close, timeout);
    return el;
  }
  function initToastTriggers() {
    $$("[data-toast]").forEach((t) =>
      on(t, "click", () => toast({
        title: t.dataset.toastTitle || "속보",
        text: t.dataset.toast || "",
        variant: t.dataset.toastVariant || "info",
      })));
  }

  /* ======================================================================
     DROPDOWN / MENU  — [data-dropdown] toggles next .dropdown__panel
     ====================================================================== */
  function initDropdowns() {
    $$("[data-dropdown]").forEach((wrap) => {
      const btn = $("[data-dropdown-toggle]", wrap) || wrap.querySelector("button");
      const panel = $(".dropdown__panel", wrap);
      if (!btn || !panel) return;
      const close = () => { panel.hidden = true; btn.setAttribute("aria-expanded", "false"); };
      const open = () => { panel.hidden = false; btn.setAttribute("aria-expanded", "true"); };
      on(btn, "click", (e) => { e.stopPropagation(); panel.hidden ? open() : close(); });
      on(document, "click", (e) => { if (!wrap.contains(e.target)) close(); });
      on(wrap, "keydown", (e) => { if (e.key === "Escape") { close(); btn.focus(); } });
      panel.hidden = true;
    });
  }

  /* ======================================================================
     CONTEXT MENU  — [data-context-menu="id"] right-click target
     ====================================================================== */
  function initContextMenus() {
    $$("[data-context-menu]").forEach((zone) => {
      const menu = document.getElementById(zone.getAttribute("data-context-menu"));
      if (!menu) return;
      on(zone, "contextmenu", (e) => {
        e.preventDefault();
        menu.hidden = false;
        const mw = menu.offsetWidth, mh = menu.offsetHeight;
        menu.style.left = Math.min(e.clientX, innerWidth - mw - 8) + "px";
        menu.style.top = Math.min(e.clientY, innerHeight - mh - 8) + "px";
      });
      const hide = () => (menu.hidden = true);
      on(document, "click", hide);
      on(document, "keydown", (e) => e.key === "Escape" && hide());
      on(window, "scroll", hide, true);
    });
  }

  /* ======================================================================
     TOOLTIP via title-less [data-tooltip]  (CSS handles hover; this adds a11y)
     ====================================================================== */
  function initTooltips() {
    $$("[data-tooltip]").forEach((el) => {
      if (el.querySelector(".tooltip")) return;
      el.classList.add("tooltip-wrap");
      const tip = document.createElement("span");
      tip.className = "tooltip";
      tip.setAttribute("role", "tooltip");
      tip.textContent = el.getAttribute("data-tooltip");
      el.appendChild(tip);
      if (!el.getAttribute("aria-label")) el.setAttribute("aria-label", el.getAttribute("data-tooltip"));
      el.tabIndex = el.tabIndex >= 0 ? el.tabIndex : 0;
    });
  }

  /* ======================================================================
     COMMAND PALETTE (⌘K / Ctrl-K)
     ====================================================================== */
  function initCommand() {
    const cmd = $("[data-command]");
    if (!cmd) return;
    const input = $(".command__search input", cmd);
    const items = $$(".command__item", cmd);
    const list = $(".command__list", cmd);
    const empty = $(".command__empty", cmd);
    let active = 0;
    const scrim = getScrim();

    const visible = () => items.filter((i) => !i.hidden);
    const paint = () => {
      const vis = visible();
      items.forEach((i) => i.classList.remove("is-active"));
      if (vis[active]) { vis[active].classList.add("is-active"); vis[active].scrollIntoView({ block: "nearest" }); }
    };
    const open = () => {
      lastFocused = document.activeElement;
      scrim.hidden = false; cmd.hidden = false;
      requestAnimationFrame(() => { scrim.classList.add("is-open"); cmd.classList.add("is-open"); });
      document.body.style.overflow = "hidden";
      input.value = ""; filter(""); active = 0; paint();
      setTimeout(() => input.focus(), 50);
      scrim._closeC = close; on(scrim, "click", scrim._closeC);
    };
    const close = () => {
      cmd.classList.remove("is-open"); scrim.classList.remove("is-open");
      if (scrim._closeC) scrim.removeEventListener("click", scrim._closeC);
      document.body.style.overflow = "";
      const done = () => { cmd.hidden = true; scrim.hidden = true; };
      if (prefersReduced()) done(); else setTimeout(done, 200);
      if (lastFocused) lastFocused.focus();
    };
    const filter = (q) => {
      q = q.toLowerCase().trim();
      let any = false;
      items.forEach((i) => {
        const hit = i.textContent.toLowerCase().includes(q);
        i.hidden = !hit; if (hit) any = true;
      });
      $$(".command__group-label", cmd).forEach((g) => {
        let sib = g.nextElementSibling, has = false;
        while (sib && sib.classList.contains("command__item")) { if (!sib.hidden) has = true; sib = sib.nextElementSibling; }
        g.hidden = !has;
      });
      if (empty) empty.hidden = any;
      active = 0;
    };

    on(document, "keydown", (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); cmd.hidden ? open() : close(); }
    });
    $$("[data-command-open]").forEach((b) => on(b, "click", open));
    on(input, "input", () => { filter(input.value); paint(); });
    on(cmd, "keydown", (e) => {
      const vis = visible();
      if (e.key === "Escape") { close(); }
      else if (e.key === "ArrowDown") { e.preventDefault(); active = (active + 1) % vis.length; paint(); }
      else if (e.key === "ArrowUp") { e.preventDefault(); active = (active - 1 + vis.length) % vis.length; paint(); }
      else if (e.key === "Enter") { e.preventDefault(); if (vis[active]) vis[active].click(); }
    });
    items.forEach((i) => on(i, "click", () => {
      const act = i.getAttribute("data-action");
      close();
      if (act === "toggle-theme") Theme.apply(document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark"), Theme.set(document.documentElement.getAttribute("data-theme"));
      else if (i.dataset.href) window.location.href = i.dataset.href;
      else toast({ title: "명령 실행", text: i.textContent.trim(), variant: "info" });
    }));
  }

  /* ======================================================================
     SLIDER value readout
     ====================================================================== */
  function initSliders() {
    $$(".slider input[type=range]").forEach((r) => {
      const out = r.parentElement.querySelector(".slider__value");
      const upd = () => { if (out) out.textContent = (r.dataset.prefix || "") + r.value + (r.dataset.suffix || ""); };
      on(r, "input", upd); upd();
    });
  }

  /* ======================================================================
     STEPPER  +/-
     ====================================================================== */
  function initSteppers() {
    $$(".stepper").forEach((s) => {
      const input = $("input", s);
      const [minus, plus] = [$("[data-step-down]", s), $("[data-step-up]", s)];
      const step = Number(input?.step || 1), min = input?.min !== "" ? Number(input.min) : -Infinity, max = input?.max !== "" ? Number(input.max) : Infinity;
      const set = (v) => { input.value = Math.max(min, Math.min(max, v)); };
      on(minus, "click", () => set(Number(input.value) - step));
      on(plus, "click", () => set(Number(input.value) + step));
    });
  }

  /* ======================================================================
     RATING
     ====================================================================== */
  function initRatings() {
    $$(".rating").forEach((r) => {
      const stars = $$("button", r);
      const paint = (n) => stars.forEach((s, i) => s.classList.toggle("is-active", i < n));
      stars.forEach((s, i) => {
        on(s, "click", () => { r.dataset.value = i + 1; paint(i + 1); s.setAttribute("aria-checked", "true"); });
        on(s, "mouseenter", () => paint(i + 1));
      });
      on(r, "mouseleave", () => paint(Number(r.dataset.value || 0)));
      paint(Number(r.dataset.value || 0));
    });
  }

  /* ======================================================================
     CHIP INPUT
     ====================================================================== */
  function initChipInputs() {
    $$(".chipinput").forEach((ci) => {
      const input = $("input", ci);
      const add = (txt) => {
        txt = txt.trim(); if (!txt) return;
        const chip = document.createElement("span");
        chip.className = "chip";
        chip.innerHTML = `${txt}<button aria-label="${txt} 제거"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 6l12 12M18 6 6 18"/></svg></button>`;
        ci.insertBefore(chip, input);
        on(chip.querySelector("button"), "click", () => chip.remove());
      };
      on(input, "keydown", (e) => {
        if (e.key === "Enter" || e.key === ",") { e.preventDefault(); add(input.value); input.value = ""; }
        else if (e.key === "Backspace" && !input.value) { const last = input.previousElementSibling; if (last && last.classList.contains("chip")) last.remove(); }
      });
      $$(".chip button", ci).forEach((b) => on(b, "click", () => b.closest(".chip").remove()));
    });
  }

  /* ======================================================================
     COMBOBOX / AUTOCOMPLETE
     ====================================================================== */
  function initComboboxes() {
    $$("[data-combobox]").forEach((cb) => {
      const input = $("input", cb);
      const menu = $(".combobox__menu", cb);
      if (!input || !menu) return;
      const options = $$(".combobox__option", menu);
      const empty = $(".combobox__empty", menu);
      let active = -1;
      const open = () => { menu.hidden = false; input.setAttribute("aria-expanded", "true"); };
      const close = () => { menu.hidden = true; input.setAttribute("aria-expanded", "false"); active = -1; };
      const vis = () => options.filter((o) => !o.hidden);
      const paint = () => { options.forEach((o) => o.classList.remove("is-active")); const v = vis(); if (v[active]) v[active].classList.add("is-active"); };
      const filt = () => {
        const q = input.value.toLowerCase().trim(); let any = false;
        options.forEach((o) => { const hit = o.textContent.toLowerCase().includes(q); o.hidden = !hit; if (hit) any = true; });
        if (empty) empty.hidden = any; active = -1;
      };
      on(input, "focus", open);
      on(input, "input", () => { filt(); open(); });
      on(input, "keydown", (e) => {
        const v = vis();
        if (e.key === "ArrowDown") { e.preventDefault(); open(); active = (active + 1) % v.length; paint(); }
        else if (e.key === "ArrowUp") { e.preventDefault(); active = (active - 1 + v.length) % v.length; paint(); }
        else if (e.key === "Enter" && v[active]) { e.preventDefault(); v[active].click(); }
        else if (e.key === "Escape") close();
      });
      options.forEach((o) => on(o, "click", () => { input.value = o.dataset.value || o.textContent.trim(); close(); cb.dispatchEvent(new CustomEvent("combobox:select", { detail: { value: input.value } })); }));
      on(document, "click", (e) => { if (!cb.contains(e.target)) close(); });
      close();
    });
  }

  /* ======================================================================
     TABLE  — sortable headers + select-all
     ====================================================================== */
  function initTables() {
    $$("table[data-sortable]").forEach((table) => {
      const tbody = $("tbody", table);
      $$("th.sortable", table).forEach((th, colIndex) => {
        const idx = Array.from(th.parentElement.children).indexOf(th);
        on(th, "click", () => {
          const cur = th.getAttribute("aria-sort");
          const dir = cur === "ascending" ? "descending" : "ascending";
          $$("th", table).forEach((h) => h.removeAttribute("aria-sort"));
          th.setAttribute("aria-sort", dir);
          const rows = $$("tbody tr", table);
          const type = th.dataset.type || "text";
          rows.sort((a, b) => {
            let av = a.children[idx]?.dataset.sort ?? a.children[idx]?.textContent.trim() ?? "";
            let bv = b.children[idx]?.dataset.sort ?? b.children[idx]?.textContent.trim() ?? "";
            if (type === "number") { av = parseFloat(av.replace(/[^0-9.\-]/g, "")) || 0; bv = parseFloat(bv.replace(/[^0-9.\-]/g, "")) || 0; }
            const r = av > bv ? 1 : av < bv ? -1 : 0;
            return dir === "ascending" ? r : -r;
          });
          rows.forEach((r) => tbody.appendChild(r));
        });
        on(th, "keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); th.click(); } });
      });
      // select all
      const all = $("[data-select-all]", table);
      if (all) {
        const boxes = $$("tbody [data-row-check]", table);
        on(all, "change", () => {
          boxes.forEach((b) => { b.checked = all.checked; b.closest("tr")?.classList.toggle("is-selected", all.checked); });
        });
        boxes.forEach((b) => on(b, "change", () => {
          b.closest("tr")?.classList.toggle("is-selected", b.checked);
          all.checked = boxes.every((x) => x.checked);
          all.indeterminate = !all.checked && boxes.some((x) => x.checked);
        }));
      }
    });
  }

  /* ======================================================================
     CAROUSEL
     ====================================================================== */
  function initCarousels() {
    $$("[data-carousel]").forEach((car) => {
      const track = $(".carousel__track", car);
      const slides = $$(".carousel__slide", car);
      const dots = $$(".carousel__dot", car);
      const prev = $("[data-carousel-prev]", car);
      const next = $("[data-carousel-next]", car);
      let i = 0;
      const go = (n) => {
        i = (n + slides.length) % slides.length;
        track.style.transform = `translateX(-${i * 100}%)`;
        dots.forEach((d, k) => d.classList.toggle("is-active", k === i));
      };
      on(prev, "click", () => go(i - 1));
      on(next, "click", () => go(i + 1));
      dots.forEach((d, k) => on(d, "click", () => go(k)));
      on(car, "keydown", (e) => { if (e.key === "ArrowLeft") go(i - 1); if (e.key === "ArrowRight") go(i + 1); });
      go(0);
    });
  }

  /* ======================================================================
     SIDEBAR collapse + mobile nav
     ====================================================================== */
  function initNav() {
    $$("[data-sidebar-toggle]").forEach((btn) => on(btn, "click", () => {
      const sb = document.getElementById(btn.getAttribute("data-sidebar-toggle")) || $(".sidebar");
      if (sb) sb.classList.toggle("is-collapsed");
    }));
    $$("[data-nav-toggle]").forEach((btn) => on(btn, "click", () => {
      const nav = document.getElementById(btn.getAttribute("data-nav-toggle")) || $(".navbar__sections");
      if (nav) { const open = nav.classList.toggle("is-open"); btn.setAttribute("aria-expanded", String(open)); }
    }));
  }

  /* ======================================================================
     COPY-TO-CLIPBOARD  [data-copy]
     ====================================================================== */
  function initCopy() {
    $$("[data-copy]").forEach((btn) => on(btn, "click", () => {
      const sel = btn.getAttribute("data-copy");
      const src = sel ? document.querySelector(sel) : btn.closest(".codeblock")?.querySelector("pre");
      const text = src ? src.innerText : btn.getAttribute("data-copy-text") || "";
      navigator.clipboard?.writeText(text).then(
        () => toast({ title: "복사했습니다", text: "교정쇄를 클립보드에 담았어요.", variant: "success", timeout: 2000 }),
        () => toast({ title: "복사하지 못했어요", text: "브라우저 권한을 확인해 주세요.", variant: "danger", timeout: 2000 })
      );
    }));
  }

  /* ======================================================================
     SCROLL REVEAL  — staggered front-page set  [data-reveal]
     ====================================================================== */
  function initReveal() {
    const els = $$("[data-reveal]");
    if (!els.length) return;
    if (prefersReduced() || !("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("is-revealed")); return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-revealed"); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    els.forEach((el) => io.observe(el));
  }

  /* ======================================================================
     PROGRESS RING — set dashoffset from data-value
     ====================================================================== */
  function initRings() {
    $$(".progress-ring").forEach((ring) => {
      const bar = $("circle.bar", ring);
      if (!bar) return;
      const r = bar.r.baseVal.value;
      const circ = 2 * Math.PI * r;
      const val = Number(ring.dataset.value || 0);
      bar.style.strokeDasharray = circ;
      bar.style.strokeDashoffset = circ;
      requestAnimationFrame(() => { bar.style.strokeDashoffset = circ * (1 - val / 100); });
    });
  }

  /* ======================================================================
     BOOT
     ====================================================================== */
  function boot() {
    document.documentElement.classList.add("js"); // enables [data-reveal] hide-then-reveal
    Theme.init();
    initDatelines();
    initTabs();
    initAccordion();
    initSegmented();
    initModals();
    initDrawers();
    initToastTriggers();
    initDropdowns();
    initContextMenus();
    initTooltips();
    initCommand();
    initSliders();
    initSteppers();
    initRatings();
    initChipInputs();
    initComboboxes();
    initTables();
    initCarousels();
    initNav();
    initCopy();
    initReveal();
    initRings();
  }

  if (document.readyState === "loading") on(document, "DOMContentLoaded", boot);
  else boot();

  /* Public API */
  window.Ledger = { toast, openModal, closeModal, openDrawer, closeDrawer, setTheme: (v) => { Theme.apply(v); Theme.set(v); } };
})();
