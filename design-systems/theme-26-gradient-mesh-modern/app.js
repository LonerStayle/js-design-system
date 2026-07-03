/* ============================================================================
   THEME 26 — GRADIENT MESH MODERN
   app.js · All interactions (vanilla JS, zero deps), self-initialising.
   ----------------------------------------------------------------------------
   Works on file:// double-click. Everything is delegated or wired on
   DOMContentLoaded, and re-scannable via GMM.init(root). Components are opt-in
   through data-* attributes so any page only pays for what it uses.
   ============================================================================ */
(function () {
  "use strict";

  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const on = (el, ev, fn, opt) => el && el.addEventListener(ev, fn, opt);
  const uid = (() => { let n = 0; return (p = "id") => `${p}-${++n}`; })();
  const prefersReduced = () =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ======================================================================
     THEME — light / dark with persistence + system fallback
     ====================================================================== */
  const Theme = {
    KEY: "gmm-theme",
    get() {
      return localStorage.getItem(this.KEY) ||
        (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    },
    set(mode) {
      document.documentElement.dataset.theme = mode;
      try { localStorage.setItem(this.KEY, mode); } catch (e) {}
      $$("[data-theme-toggle]").forEach((b) => {
        b.setAttribute("aria-pressed", String(mode === "dark"));
        const lbl = b.querySelector("[data-theme-label]");
        if (lbl) lbl.textContent = mode === "dark" ? "Light" : "Dark";
      });
      document.dispatchEvent(new CustomEvent("gmm:theme", { detail: { mode } }));
    },
    toggle() { this.set(document.documentElement.dataset.theme === "dark" ? "light" : "dark"); },
    init() {
      this.set(this.get());
      on(document, "click", (e) => {
        const t = e.target.closest("[data-theme-toggle]");
        if (t) { e.preventDefault(); this.toggle(); }
      });
    },
  };

  /* ======================================================================
     MOTION TOGGLE — pause/play ambient mesh
     ====================================================================== */
  const Motion = {
    KEY: "gmm-motion",
    set(state) {
      document.documentElement.dataset.motion = state; // "on" | "off"
      try { localStorage.setItem(this.KEY, state); } catch (e) {}
      $$("[data-motion-toggle]").forEach((b) => b.setAttribute("aria-pressed", String(state === "off")));
    },
    init() {
      const saved = localStorage.getItem(this.KEY) || (prefersReduced() ? "off" : "on");
      this.set(saved);
      on(document, "click", (e) => {
        const t = e.target.closest("[data-motion-toggle]");
        if (t) { e.preventDefault(); this.set(document.documentElement.dataset.motion === "off" ? "on" : "off"); }
      });
    },
  };

  /* ======================================================================
     MESH — pointer-reactive blob drift (subtle parallax). Frozen if reduced.
     ====================================================================== */
  const Mesh = {
    init() {
      if (prefersReduced()) return;
      let raf = null, tx = 0, ty = 0;
      on(window, "pointermove", (e) => {
        if (document.documentElement.dataset.motion === "off") return;
        tx = (e.clientX / window.innerWidth - 0.5) * 2;
        ty = (e.clientY / window.innerHeight - 0.5) * 2;
        if (!raf) raf = requestAnimationFrame(apply);
      });
      function apply() {
        raf = null;
        const r = document.documentElement;
        r.style.setProperty("--mesh-pos-1", `${12 + tx * 3}% ${18 + ty * 3}%`);
        r.style.setProperty("--mesh-pos-2", `${85 - tx * 3}% ${12 + ty * 2}%`);
        r.style.setProperty("--mesh-pos-3", `${18 + tx * 2}% ${88 - ty * 3}%`);
        r.style.setProperty("--mesh-pos-4", `${88 - tx * 2}% ${82 - ty * 2}%`);
      }
    },
  };

  /* ======================================================================
     TABS — [data-tabs] container, [role=tab] + [role=tabpanel]
     ====================================================================== */
  function initTabs(root) {
    $$("[data-tabs]", root).forEach((wrap) => {
      if (wrap.__init) return; wrap.__init = true;
      const tabs = $$('[role="tab"]', wrap);
      const select = (tab) => {
        tabs.forEach((t) => {
          const sel = t === tab;
          t.setAttribute("aria-selected", String(sel));
          t.tabIndex = sel ? 0 : -1;
          t.classList.toggle("is-active", sel);
          const panel = document.getElementById(t.getAttribute("aria-controls"));
          if (panel) panel.hidden = !sel;
        });
      };
      tabs.forEach((tab, i) => {
        on(tab, "click", () => select(tab));
        on(tab, "keydown", (e) => {
          let idx = null;
          if (e.key === "ArrowRight" || e.key === "ArrowDown") idx = (i + 1) % tabs.length;
          if (e.key === "ArrowLeft" || e.key === "ArrowUp") idx = (i - 1 + tabs.length) % tabs.length;
          if (e.key === "Home") idx = 0;
          if (e.key === "End") idx = tabs.length - 1;
          if (idx !== null) { e.preventDefault(); tabs[idx].focus(); select(tabs[idx]); }
        });
      });
      const current = tabs.find((t) => t.getAttribute("aria-selected") === "true") || tabs[0];
      if (current) select(current);
    });
  }

  /* ======================================================================
     ACCORDION — [data-accordion], header buttons toggle .is-open
     ====================================================================== */
  function initAccordion(root) {
    $$("[data-accordion]", root).forEach((acc) => {
      if (acc.__init) return; acc.__init = true;
      const single = acc.hasAttribute("data-accordion-single");
      $$(".accordion__header", acc).forEach((header) => {
        on(header, "click", () => {
          const item = header.closest(".accordion__item");
          const open = item.classList.contains("is-open");
          if (single) $$(".accordion__item", acc).forEach((i) => { i.classList.remove("is-open"); i.querySelector(".accordion__header")?.setAttribute("aria-expanded", "false"); });
          item.classList.toggle("is-open", !open);
          header.setAttribute("aria-expanded", String(!open));
        });
      });
    });
  }

  /* ======================================================================
     DROPDOWN / MENU — [data-dropdown] with trigger [data-dropdown-trigger]
     ====================================================================== */
  function initDropdowns(root) {
    $$("[data-dropdown]", root).forEach((dd) => {
      if (dd.__init) return; dd.__init = true;
      const trigger = $("[data-dropdown-trigger]", dd);
      const close = () => { dd.classList.remove("is-open"); trigger?.setAttribute("aria-expanded", "false"); };
      const open = () => { dd.classList.add("is-open"); trigger?.setAttribute("aria-expanded", "true"); };
      on(trigger, "click", (e) => { e.stopPropagation(); dd.classList.contains("is-open") ? close() : open(); });
      $$(".dropdown__item, .menu__item", dd).forEach((it) =>
        on(it, "click", () => { if (!it.dataset.keepOpen) close(); }));
      on(dd, "keydown", (e) => { if (e.key === "Escape") { close(); trigger?.focus(); } });
      dd.__close = close;
    });
  }

  /* ======================================================================
     MODAL / DRAWER — open via [data-open="#id"], close via [data-close]
     ====================================================================== */
  let lastFocus = null;
  function openOverlay(panel) {
    const overlay = panel.matches(".overlay") ? panel : panel.previousElementSibling;
    lastFocus = document.activeElement;
    panel.classList.add("is-open");
    const ov = panel.parentElement.querySelector(".overlay");
    if (ov) ov.classList.add("is-open");
    document.body.style.overflow = "hidden";
    const focusable = panel.querySelector("input,button,textarea,select,a[href],[tabindex]");
    setTimeout(() => focusable && focusable.focus(), 60);
    trapFocus(panel);
  }
  function closeOverlay(panel) {
    panel.classList.remove("is-open");
    const ov = panel.parentElement.querySelector(".overlay");
    if (ov) ov.classList.remove("is-open");
    document.body.style.overflow = "";
    if (lastFocus) lastFocus.focus();
    releaseTrap(panel);
  }
  function trapFocus(panel) {
    panel.__trap = (e) => {
      if (e.key === "Escape") { closeOverlay(panel); return; }
      if (e.key !== "Tab") return;
      const f = $$('a[href],button:not(:disabled),textarea,input:not(:disabled),select,[tabindex]:not([tabindex="-1"])', panel).filter((el) => el.offsetParent !== null);
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", panel.__trap);
  }
  function releaseTrap(panel) { if (panel.__trap) document.removeEventListener("keydown", panel.__trap); }

  function initOverlays(root) {
    on(document, "click", (e) => {
      const opener = e.target.closest("[data-open]");
      if (opener) { e.preventDefault(); const t = $(opener.getAttribute("data-open")); if (t) openOverlay(t); return; }
      const closer = e.target.closest("[data-close]");
      if (closer) { const p = closer.closest(".modal, .drawer"); if (p) closeOverlay(p); return; }
      // click on scrim
      if (e.target.matches(".overlay.is-open")) {
        const sib = e.target.parentElement.querySelector(".modal.is-open, .drawer.is-open");
        if (sib) closeOverlay(sib);
      }
    });
  }

  /* ======================================================================
     TOASTS — GMM.toast({title, text, type, duration})
     ====================================================================== */
  const ICONS = {
    success: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>',
    danger:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>',
    warning: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 9v4M12 17h.01M10.3 3.9L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/></svg>',
    info:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 16v-4M12 8h.01"/><circle cx="12" cy="12" r="10"/></svg>',
  };
  function ensureToastRegion() {
    let r = $(".toast-region");
    if (!r) { r = document.createElement("div"); r.className = "toast-region"; r.setAttribute("aria-live", "polite"); r.setAttribute("aria-atomic", "false"); document.body.appendChild(r); }
    return r;
  }
  function toast(opts = {}) {
    const { title = "Notification", text = "", type = "info", duration = 4200 } = opts;
    const region = ensureToastRegion();
    const el = document.createElement("div");
    el.className = `toast toast--${type}`;
    el.setAttribute("role", "status");
    el.innerHTML =
      `<div class="toast__icon">${ICONS[type] || ICONS.info}</div>
       <div class="toast__body"><div class="toast__title">${title}</div>${text ? `<div class="toast__text">${text}</div>` : ""}</div>
       <button class="toast__close" aria-label="Dismiss">${ICONS.danger}</button>
       <div class="toast__progress" style="animation-duration:${duration}ms"></div>`;
    region.appendChild(el);
    const remove = () => { el.classList.add("is-leaving"); setTimeout(() => el.remove(), 320); };
    on(el.querySelector(".toast__close"), "click", remove);
    if (duration > 0) setTimeout(remove, duration);
    return el;
  }
  function initToastTriggers(root) {
    $$("[data-toast]", root).forEach((b) => {
      if (b.__init) return; b.__init = true;
      on(b, "click", () => toast({
        title: b.dataset.toastTitle || "Saved",
        text: b.dataset.toast || "",
        type: b.dataset.toastType || "success",
      }));
    });
  }

  /* ======================================================================
     COMMAND PALETTE (⌘K / Ctrl-K)
     ====================================================================== */
  const CommandPalette = {
    el: null, input: null, list: null, items: [], active: 0,
    build() {
      if (this.el) return;
      const data = (window.GMM_COMMANDS) || [
        { group: "Navigate", label: "Go to Dashboard", icon: "grid", href: "pages/dashboard.html" },
        { group: "Navigate", label: "Go to Kanban", icon: "columns", href: "pages/kanban.html" },
        { group: "Navigate", label: "Go to Inbox", icon: "mail", href: "pages/inbox.html" },
        { group: "Navigate", label: "Go to Pricing", icon: "tag", href: "pages/pricing.html" },
        { group: "Navigate", label: "Go to Settings", icon: "settings", href: "pages/settings.html" },
        { group: "Actions", label: "Toggle dark mode", icon: "moon", action: () => Theme.toggle() },
        { group: "Actions", label: "Toggle motion", icon: "wind", action: () => Motion.set(document.documentElement.dataset.motion === "off" ? "on" : "off") },
        { group: "Actions", label: "Show success toast", icon: "bell", action: () => toast({ title: "It works!", text: "Command executed.", type: "success" }) },
      ];
      this.data = data;
      const el = document.createElement("div");
      el.className = "cmdk"; el.setAttribute("role", "dialog"); el.setAttribute("aria-modal", "true"); el.setAttribute("aria-label", "Command palette");
      el.innerHTML =
        `<div class="overlay"></div>
         <div class="cmdk__panel">
           <div class="cmdk__search">
             <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
             <input type="text" placeholder="Type a command or search…" aria-label="Command input" aria-controls="cmdk-list" aria-expanded="true" role="combobox" aria-autocomplete="list"/>
             <kbd>esc</kbd>
           </div>
           <div class="cmdk__list" id="cmdk-list" role="listbox"></div>
           <div class="cmdk__footer"><span><kbd>↑</kbd><kbd>↓</kbd> navigate</span><span><kbd>↵</kbd> select</span><span><kbd>esc</kbd> close</span></div>
         </div>`;
      document.body.appendChild(el);
      this.el = el; this.input = $(".cmdk__search input", el); this.list = $(".cmdk__list", el);
      on(this.input, "input", () => this.render());
      on(this.input, "keydown", (e) => this.onKey(e));
      on($(".overlay", el), "click", () => this.close());
      this.render();
    },
    render() {
      const q = (this.input.value || "").toLowerCase();
      const filtered = this.data.filter((d) => d.label.toLowerCase().includes(q));
      this.items = filtered; this.active = 0;
      if (!filtered.length) { this.list.innerHTML = `<div class="cmdk__empty">No results for “${this.input.value}”</div>`; return; }
      const groups = {};
      filtered.forEach((d) => { (groups[d.group] = groups[d.group] || []).push(d); });
      let html = "", idx = 0;
      for (const g in groups) {
        html += `<div class="cmdk__group-label">${g}</div>`;
        groups[g].forEach((d) => {
          html += `<div class="cmdk__item${idx === 0 ? " is-active" : ""}" role="option" data-idx="${idx}">${this.icon(d.icon)}<span>${d.label}</span>${d.href ? "<kbd>↵</kbd>" : ""}</div>`;
          idx++;
        });
      }
      this.list.innerHTML = html;
      $$(".cmdk__item", this.list).forEach((it) => {
        on(it, "click", () => this.exec(this.items[+it.dataset.idx]));
        on(it, "mousemove", () => this.setActive(+it.dataset.idx));
      });
    },
    icon(name) {
      const map = {
        grid: '<path d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z"/>',
        columns: '<path d="M4 4h6v16H4zM14 4h6v16h-6z"/>',
        mail: '<path d="M4 5h16v14H4z"/><path d="M4 7l8 6 8-6"/>',
        tag: '<path d="M12 2l9 9-7 7-9-9V2z"/><circle cx="7" cy="7" r="1.5"/>',
        settings: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>',
        moon: '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>',
        wind: '<path d="M3 8h12a3 3 0 1 0-3-3M3 16h16a3 3 0 1 1-3 3"/>',
        bell: '<path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M10 21a2 2 0 0 0 4 0"/>',
      };
      return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${map[name] || map.grid}</svg>`;
    },
    setActive(i) {
      this.active = i;
      $$(".cmdk__item", this.list).forEach((it) => it.classList.toggle("is-active", +it.dataset.idx === i));
    },
    onKey(e) {
      if (e.key === "Escape") { this.close(); return; }
      if (e.key === "ArrowDown") { e.preventDefault(); this.setActive(Math.min(this.active + 1, this.items.length - 1)); this.scrollActive(); }
      if (e.key === "ArrowUp") { e.preventDefault(); this.setActive(Math.max(this.active - 1, 0)); this.scrollActive(); }
      if (e.key === "Enter") { e.preventDefault(); this.exec(this.items[this.active]); }
    },
    scrollActive() { $(".cmdk__item.is-active", this.list)?.scrollIntoView({ block: "nearest" }); },
    exec(item) {
      if (!item) return;
      if (item.action) { this.close(); item.action(); }
      else if (item.href) { window.location.href = item.href; }
    },
    open() { this.build(); this.el.classList.add("is-open"); $(".overlay", this.el).classList.add("is-open"); document.body.style.overflow = "hidden"; setTimeout(() => { this.input.value = ""; this.render(); this.input.focus(); }, 50); },
    close() { if (!this.el) return; this.el.classList.remove("is-open"); $(".overlay", this.el).classList.remove("is-open"); document.body.style.overflow = ""; },
    init() {
      on(document, "keydown", (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); this.el && this.el.classList.contains("is-open") ? this.close() : this.open(); }
      });
      on(document, "click", (e) => { if (e.target.closest("[data-cmdk]")) { e.preventDefault(); this.open(); } });
    },
  };

  /* ======================================================================
     TABLE — sort + select-all + row select
     ====================================================================== */
  function initTables(root) {
    $$("table[data-sortable]", root).forEach((table) => {
      if (table.__init) return; table.__init = true;
      const tbody = $("tbody", table);
      $$("th.is-sortable", table).forEach((th, colIndex) => {
        const realIndex = Array.from(th.parentElement.children).indexOf(th);
        on(th, "click", () => {
          const asc = th.getAttribute("aria-sort") !== "ascending";
          $$("th", table).forEach((h) => h.removeAttribute("aria-sort"));
          th.setAttribute("aria-sort", asc ? "ascending" : "descending");
          const rows = $$("tr", tbody);
          const num = th.dataset.type === "number";
          rows.sort((a, b) => {
            let x = a.children[realIndex].dataset.sort ?? a.children[realIndex].textContent.trim();
            let y = b.children[realIndex].dataset.sort ?? b.children[realIndex].textContent.trim();
            if (num) { x = parseFloat(x.replace(/[^0-9.\-]/g, "")) || 0; y = parseFloat(y.replace(/[^0-9.\-]/g, "")) || 0; return asc ? x - y : y - x; }
            return asc ? String(x).localeCompare(y) : String(y).localeCompare(x);
          });
          rows.forEach((r) => tbody.appendChild(r));
        });
      });
    });
    // select-all
    $$("[data-select-all]", root).forEach((master) => {
      if (master.__init) return; master.__init = true;
      const table = master.closest("table");
      const boxes = () => $$('tbody input[type="checkbox"]', table);
      on(master, "change", () => {
        boxes().forEach((b) => { b.checked = master.checked; b.closest("tr")?.classList.toggle("is-selected", master.checked); });
      });
      table.addEventListener("change", (e) => {
        if (e.target.matches('tbody input[type="checkbox"]')) {
          e.target.closest("tr")?.classList.toggle("is-selected", e.target.checked);
          const all = boxes(); master.checked = all.every((b) => b.checked); master.indeterminate = !master.checked && all.some((b) => b.checked);
        }
      });
    });
  }

  /* ======================================================================
     SWITCH/CHECKBOX visual sync for aria + danger-zone confirm inputs
     STEPPER, SLIDER value, RATING, CHIP INPUT, SEGMENTED, TOGGLE GROUPS
     ====================================================================== */
  function initForms(root) {
    // Slider live value
    $$(".slider input[type=range]", root).forEach((sl) => {
      if (sl.__init) return; sl.__init = true;
      const out = sl.closest(".slider")?.querySelector(".slider__value");
      const fill = () => {
        const pct = ((sl.value - sl.min) / (sl.max - sl.min)) * 100;
        sl.style.background = `linear-gradient(90deg, var(--track-fill) ${pct}%, var(--track-bg) ${pct}%)`;
        if (out) out.textContent = (sl.dataset.prefix || "") + sl.value + (sl.dataset.suffix || "");
      };
      on(sl, "input", fill); fill();
    });
    // Stepper
    $$(".stepper", root).forEach((st) => {
      if (st.__init) return; st.__init = true;
      const input = $("input", st); const [dec, inc] = $$("button", st);
      const clamp = (v) => Math.max(+input.min || -Infinity, Math.min(+input.max || Infinity, v));
      on(dec, "click", () => { input.value = clamp((+input.value || 0) - (+input.step || 1)); });
      on(inc, "click", () => { input.value = clamp((+input.value || 0) + (+input.step || 1)); });
    });
    // Rating
    $$(".rating", root).forEach((r) => {
      if (r.__init || r.classList.contains("rating--read")) { r.__init = true; return; } r.__init = true;
      const stars = $$("button", r);
      const paint = (n) => stars.forEach((s, i) => s.classList.toggle("is-on", i < n));
      stars.forEach((s, i) => {
        on(s, "click", () => { r.dataset.value = i + 1; paint(i + 1); s.setAttribute("aria-checked", "true"); });
        on(s, "mouseenter", () => paint(i + 1));
      });
      on(r, "mouseleave", () => paint(+r.dataset.value || 0));
      paint(+r.dataset.value || 0);
    });
    // Segmented control
    $$(".segmented", root).forEach((seg) => {
      if (seg.__init) return; seg.__init = true;
      $$("button", seg).forEach((b) => on(b, "click", () => {
        $$("button", seg).forEach((x) => { x.classList.remove("is-active"); x.setAttribute("aria-selected", "false"); });
        b.classList.add("is-active"); b.setAttribute("aria-selected", "true");
        seg.dispatchEvent(new CustomEvent("gmm:segment", { detail: { value: b.dataset.value } }));
      }));
    });
    // Chip input
    $$(".chip-input", root).forEach((ci) => {
      if (ci.__init) return; ci.__init = true;
      const input = $("input", ci);
      const addChip = (text) => {
        if (!text.trim()) return;
        const chip = document.createElement("span"); chip.className = "chip";
        chip.innerHTML = `${text}<button aria-label="Remove ${text}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg></button>`;
        on(chip.querySelector("button"), "click", () => chip.remove());
        ci.insertBefore(chip, input);
      };
      on(input, "keydown", (e) => {
        if ((e.key === "Enter" || e.key === ",") && input.value.trim()) { e.preventDefault(); addChip(input.value); input.value = ""; }
        if (e.key === "Backspace" && !input.value) { ci.querySelector(".chip:last-of-type")?.remove(); }
      });
    });
    // Combobox / MultiSelect open-close
    $$(".combobox, .multiselect", root).forEach((cb) => {
      if (cb.__init) return; cb.__init = true;
      const trigger = $("[data-combobox-trigger], .multiselect__control, input", cb);
      on(trigger, "focus", () => cb.classList.add("is-open"));
      on(trigger, "click", (e) => { e.stopPropagation(); cb.classList.toggle("is-open"); });
      $$(".combobox__option, .multiselect__option", cb).forEach((opt) => on(opt, "click", () => {
        if (cb.classList.contains("multiselect")) {
          const sel = opt.getAttribute("aria-selected") === "true";
          opt.setAttribute("aria-selected", String(!sel));
        } else {
          const inp = $("input", cb); if (inp) inp.value = opt.textContent.trim();
          cb.classList.remove("is-open");
        }
      }));
    });
    // FileUpload
    $$(".fileupload", root).forEach((fu) => {
      if (fu.__init) return; fu.__init = true;
      const input = $("input[type=file]", fu); const list = $(".fileupload__list", fu);
      const show = (files) => {
        if (!list) return; list.innerHTML = "";
        Array.from(files).forEach((f) => {
          const row = document.createElement("div"); row.className = "fileupload__file";
          row.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M13 2v7h7"/></svg><span style="flex:1">${f.name}</span><span class="text-subtle">${(f.size/1024).toFixed(0)} KB</span>`;
          list.appendChild(row);
        });
      };
      on(input, "change", () => show(input.files));
      on(fu, "click", (e) => { if (!e.target.closest(".fileupload__file")) input.click(); });
      ["dragover", "dragenter"].forEach((ev) => on(fu, ev, (e) => { e.preventDefault(); fu.classList.add("is-drag"); }));
      ["dragleave", "drop"].forEach((ev) => on(fu, ev, (e) => { e.preventDefault(); fu.classList.remove("is-drag"); }));
      on(fu, "drop", (e) => { if (e.dataTransfer?.files?.length) { input.files = e.dataTransfer.files; show(e.dataTransfer.files); } });
    });
  }

  /* ======================================================================
     POPOVER — [data-popover] toggle
     ====================================================================== */
  function initPopovers(root) {
    $$("[data-popover]", root).forEach((pop) => {
      if (pop.__init) return; pop.__init = true;
      const trig = $("[data-popover-trigger]", pop);
      on(trig, "click", (e) => { e.stopPropagation(); pop.classList.toggle("is-open"); });
    });
  }

  /* ======================================================================
     SIDEBAR collapse
     ====================================================================== */
  function initSidebar(root) {
    on(document, "click", (e) => {
      const btn = e.target.closest("[data-sidebar-toggle]");
      if (!btn) return;
      const sb = $(btn.getAttribute("data-sidebar-toggle") || ".sidebar");
      if (sb) { sb.classList.toggle("is-collapsed"); btn.setAttribute("aria-expanded", String(!sb.classList.contains("is-collapsed"))); }
    });
  }

  /* ======================================================================
     CAROUSEL
     ====================================================================== */
  function initCarousels(root) {
    $$("[data-carousel]", root).forEach((car) => {
      if (car.__init) return; car.__init = true;
      const track = $(".carousel__track", car);
      const slides = $$(".carousel__slide", track);
      const step = () => (slides[0]?.offsetWidth || 280) + 16;
      $(".carousel__nav--prev", car) && on($(".carousel__nav--prev", car), "click", () => track.scrollBy({ left: -step(), behavior: "smooth" }));
      $(".carousel__nav--next", car) && on($(".carousel__nav--next", car), "click", () => track.scrollBy({ left: step(), behavior: "smooth" }));
      const dots = $$(".carousel__dot", car);
      if (dots.length) {
        on(track, "scroll", () => {
          const i = Math.round(track.scrollLeft / step());
          dots.forEach((d, di) => d.classList.toggle("is-active", di === i));
        });
        dots.forEach((d, i) => on(d, "click", () => track.scrollTo({ left: step() * i, behavior: "smooth" })));
      }
    });
  }

  /* ======================================================================
     CONTEXT MENU — [data-context-menu="#menu"]
     ====================================================================== */
  function initContextMenus(root) {
    $$("[data-context-menu]", root).forEach((zone) => {
      if (zone.__init) return; zone.__init = true;
      const menu = $(zone.getAttribute("data-context-menu"));
      if (!menu) return;
      on(zone, "contextmenu", (e) => {
        e.preventDefault();
        menu.classList.add("is-open");
        const mw = menu.offsetWidth, mh = menu.offsetHeight;
        menu.style.left = Math.min(e.clientX, window.innerWidth - mw - 8) + "px";
        menu.style.top = Math.min(e.clientY, window.innerHeight - mh - 8) + "px";
      });
      $$(".menu__item", menu).forEach((it) => on(it, "click", () => menu.classList.remove("is-open")));
    });
  }

  /* ======================================================================
     COUNT-UP for stat numbers [data-countup]
     ====================================================================== */
  function initCountUp(root) {
    const els = $$("[data-countup]", root);
    if (!els.length) return;
    const run = (el) => {
      if (el.__done) return; el.__done = true;
      const target = parseFloat(el.dataset.countup);
      const dur = prefersReduced() ? 0 : 1100;
      const prefix = el.dataset.prefix || "", suffix = el.dataset.suffix || "";
      const dec = (el.dataset.countup.split(".")[1] || "").length;
      let start = null;
      const tick = (t) => {
        if (!start) start = t;
        const p = Math.min((t - start) / (dur || 1), 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = prefix + (target * eased).toFixed(dec).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver((entries) => entries.forEach((en) => { if (en.isIntersecting) { run(en.target); io.unobserve(en.target); } }), { threshold: 0.4 });
      els.forEach((el) => io.observe(el));
    } else els.forEach(run);
  }

  /* ======================================================================
     REVEAL on scroll [data-reveal]
     ====================================================================== */
  function initReveal(root) {
    const els = $$("[data-reveal]", root);
    if (!els.length || prefersReduced()) { els.forEach((e) => e.classList.add("is-in")); return; }
    const io = new IntersectionObserver((entries) => entries.forEach((en) => {
      if (en.isIntersecting) { en.target.style.transitionDelay = (en.target.dataset.reveal || 0) + "ms"; en.target.classList.add("is-in"); io.unobserve(en.target); }
    }), { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    els.forEach((el) => io.observe(el));
  }

  /* ======================================================================
     COPY-TO-CLIPBOARD [data-copy]
     ====================================================================== */
  function initCopy(root) {
    $$("[data-copy]", root).forEach((b) => {
      if (b.__init) return; b.__init = true;
      on(b, "click", () => {
        const text = b.dataset.copy || b.closest(".codeblock")?.querySelector("pre")?.innerText || "";
        navigator.clipboard?.writeText(text).then(() => { const o = b.textContent; b.textContent = "Copied!"; setTimeout(() => (b.textContent = o), 1400); }).catch(() => toast({ title: "Copy failed", type: "danger" }));
      });
    });
  }

  /* ======================================================================
     GLOBAL — close open menus/dropdowns/popovers on outside click & Esc
     ====================================================================== */
  function initGlobalDismiss() {
    on(document, "click", (e) => {
      $$(".dropdown.is-open").forEach((dd) => { if (!dd.contains(e.target)) dd.__close ? dd.__close() : dd.classList.remove("is-open"); });
      $$(".popover.is-open").forEach((p) => { if (!p.contains(e.target)) p.classList.remove("is-open"); });
      $$(".combobox.is-open, .multiselect.is-open").forEach((c) => { if (!c.contains(e.target)) c.classList.remove("is-open"); });
      $$(".context-menu.is-open").forEach((m) => { if (!m.contains(e.target)) m.classList.remove("is-open"); });
    });
    on(document, "keydown", (e) => {
      if (e.key === "Escape") {
        $$(".dropdown.is-open, .popover.is-open, .combobox.is-open, .multiselect.is-open, .context-menu.is-open").forEach((x) => x.classList.remove("is-open"));
      }
    });
  }

  /* ======================================================================
     INIT
     ====================================================================== */
  function init(root = document) {
    initTabs(root); initAccordion(root); initDropdowns(root); initOverlays(root);
    initToastTriggers(root); initTables(root); initForms(root); initPopovers(root);
    initSidebar(root); initCarousels(root); initContextMenus(root);
    initCountUp(root); initReveal(root); initCopy(root);
  }

  const GMM = { init, toast, Theme, Motion, CommandPalette, openOverlay, closeOverlay };
  window.GMM = GMM;

  function boot() {
    Theme.init(); Motion.init(); Mesh.init();
    CommandPalette.init(); initGlobalDismiss();
    init(document);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
