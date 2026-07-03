/* ============================================================================
   THEME 29 — ORGANIC WARM EARTH
   app.js — All vanilla-JS interactivity. Zero dependencies. Works on file://.
   ----------------------------------------------------------------------------
   Behaviours (auto-wired via data-attributes + delegation):
     • Theme toggle (light/dark) with localStorage + system fallback
     • Tabs, Accordion, Dropdown/Menu, Popover, Context menu
     • Modal, Drawer, Command palette (⌘K / Ctrl-K)
     • Toasts (stacked, auto-dismiss)
     • Toggle/switch demos, Segmented control, Slider fill, Stepper
     • Rating, ChipInput, Combobox/MultiSelect, SearchBar clear
     • Table sort + row select, Pagination (demo), Carousel, Sidebar collapse
     • Steps/Wizard, Copy-to-clipboard, FileUpload dropzone, scroll reveal
   Everything is defensive: a page only needs the elements it uses.
   ============================================================================ */
(function () {
  "use strict";
  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const on = (el, ev, fn, o) => el && el.addEventListener(ev, fn, o);

  /* Safety net: if any later init throws, never leave reveal content hidden.
     (data-reveal elements start at opacity:0 and rely on JS to un-hide them.) */
  window.addEventListener("error", function () {
    try {
      document.documentElement.classList.add("owe-ready");
      $$("[data-reveal]").forEach((el) => el.classList.add("revealed"));
    } catch (e) {}
  });

  /* =========================================================================
     THEME TOGGLE
     ========================================================================= */
  const THEME_KEY = "owe-theme";
  function applyTheme(t) {
    document.documentElement.setAttribute("data-theme", t);
    $$("[data-theme-toggle]").forEach((b) => {
      b.setAttribute("aria-pressed", String(t === "dark"));
      const lab = b.querySelector("[data-theme-label]");
      if (lab) lab.textContent = t === "dark" ? "Light" : "Dark";
    });
  }
  function initTheme() {
    let saved = null;
    try { saved = localStorage.getItem(THEME_KEY); } catch (e) {}
    const sys = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    applyTheme(saved || sys);
  }
  on(document, "click", (e) => {
    const btn = e.target.closest("[data-theme-toggle]");
    if (!btn) return;
    const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
    applyTheme(next);
    try { localStorage.setItem(THEME_KEY, next); } catch (e) {}
  });
  initTheme();

  /* =========================================================================
     TABS  —  [data-tabs] > [role=tablist] > [role=tab][aria-controls]
     ========================================================================= */
  $$("[data-tabs]").forEach((root) => {
    const tabs = $$('[role="tab"]', root);
    const select = (tab) => {
      tabs.forEach((t) => {
        const sel = t === tab;
        t.setAttribute("aria-selected", String(sel));
        t.tabIndex = sel ? 0 : -1;
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
  });

  /* =========================================================================
     ACCORDION  —  [data-accordion] > .accordion-item > .accordion-trigger
     ========================================================================= */
  on(document, "click", (e) => {
    const trig = e.target.closest(".accordion-trigger");
    if (!trig) return;
    const item = trig.closest(".accordion-item");
    const root = trig.closest("[data-accordion]");
    const single = root && root.hasAttribute("data-single");
    const open = item.classList.contains("is-open");
    if (single) $$(".accordion-item", root).forEach((it) => { it.classList.remove("is-open"); const t = $(".accordion-trigger", it); if (t) t.setAttribute("aria-expanded", "false"); });
    item.classList.toggle("is-open", !open);
    trig.setAttribute("aria-expanded", String(!open));
  });

  /* =========================================================================
     DROPDOWN / MENU  &  POPOVER  &  CONTEXT MENU
     ========================================================================= */
  function closeAllPopups(except) {
    $$(".dropdown.is-open").forEach((d) => { if (d !== except) d.classList.remove("is-open"); });
    $$(".popover.is-open").forEach((d) => { if (d !== except) d.classList.remove("is-open"); });
    $$(".combo.is-open").forEach((d) => { if (d !== except) d.classList.remove("is-open"); });
    $(".context-menu.is-open") && $(".context-menu.is-open").classList.remove("is-open");
  }
  on(document, "click", (e) => {
    const trigger = e.target.closest("[data-dropdown], [data-popover]");
    if (trigger) {
      e.stopPropagation();
      const host = trigger.closest(".dropdown, .popover");
      const wasOpen = host.classList.contains("is-open");
      closeAllPopups(host);
      host.classList.toggle("is-open", !wasOpen);
      const exp = host.querySelector("[aria-expanded]"); if (exp) exp.setAttribute("aria-expanded", String(!wasOpen));
      return;
    }
    if (!e.target.closest(".menu, .popover-panel, .combo-panel")) closeAllPopups();
  });

  // Context menu (right click on [data-context-menu="#id"])
  on(document, "contextmenu", (e) => {
    const host = e.target.closest("[data-context-menu]");
    if (!host) return;
    e.preventDefault();
    const menu = document.querySelector(host.getAttribute("data-context-menu"));
    if (!menu) return;
    closeAllPopups();
    menu.classList.add("is-open");
    const mw = menu.offsetWidth, mh = menu.offsetHeight;
    menu.style.left = Math.min(e.clientX, window.innerWidth - mw - 8) + "px";
    menu.style.top = Math.min(e.clientY, window.innerHeight - mh - 8) + "px";
  });
  on(document, "click", () => { const m = $(".context-menu.is-open"); if (m) m.classList.remove("is-open"); });

  /* =========================================================================
     MODAL  &  DRAWER
     ========================================================================= */
  let lastFocused = null;
  function openOverlay(el) {
    if (!el) return;
    lastFocused = document.activeElement;
    el.classList.add("is-open");
    el.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    const f = el.querySelector("input, textarea, button, [tabindex]");
    if (f) setTimeout(() => f.focus(), 60);
  }
  function closeOverlay(el) {
    if (!el) return;
    el.classList.remove("is-open");
    el.setAttribute("aria-hidden", "true");
    if (!$(".overlay.is-open, .drawer-overlay.is-open, .cmdk-overlay.is-open")) document.body.style.overflow = "";
    if (lastFocused) lastFocused.focus();
  }
  on(document, "click", (e) => {
    const opener = e.target.closest("[data-open]");
    if (opener) { openOverlay(document.querySelector(opener.getAttribute("data-open"))); return; }
    const closer = e.target.closest("[data-close]");
    if (closer) { closeOverlay(closer.closest(".overlay, .drawer-overlay, .cmdk-overlay")); return; }
    // backdrop click
    if (e.target.classList.contains("overlay") || e.target.classList.contains("drawer-overlay")) closeOverlay(e.target);
  });
  // Drawer: opener toggles both overlay + the drawer inside
  on(document, "click", (e) => {
    const d = e.target.closest("[data-drawer]");
    if (!d) return;
    const ov = document.querySelector(d.getAttribute("data-drawer"));
    if (!ov) return;
    ov.classList.add("is-open");
    const drw = ov.querySelector(".drawer") || ov.nextElementSibling;
    if (drw) drw.classList.add("is-open");
    document.body.style.overflow = "hidden";
  });
  on(document, "click", (e) => {
    if (e.target.classList.contains("drawer-overlay")) {
      e.target.classList.remove("is-open");
      const drw = e.target.querySelector(".drawer"); if (drw) drw.classList.remove("is-open");
      $$(".drawer.is-open").forEach((x) => x.classList.remove("is-open"));
      document.body.style.overflow = "";
    }
    const dc = e.target.closest("[data-drawer-close]");
    if (dc) {
      $$(".drawer.is-open").forEach((x) => x.classList.remove("is-open"));
      $$(".drawer-overlay.is-open").forEach((x) => x.classList.remove("is-open"));
      document.body.style.overflow = "";
    }
  });

  /* =========================================================================
     COMMAND PALETTE (⌘K / Ctrl-K)
     ========================================================================= */
  const cmdk = $(".cmdk-overlay");
  function openCmdk() {
    if (!cmdk) return;
    openOverlay(cmdk);
    const inp = $(".cmdk-input", cmdk);
    if (inp) { inp.value = ""; filterCmdk(""); setTimeout(() => inp.focus(), 50); }
  }
  function filterCmdk(q) {
    if (!cmdk) return;
    q = q.toLowerCase();
    let firstVisible = null;
    $$(".cmdk-item", cmdk).forEach((it) => {
      const match = it.textContent.toLowerCase().includes(q);
      it.style.display = match ? "" : "none";
      it.classList.remove("is-active");
      if (match && !firstVisible) firstVisible = it;
    });
    $$(".cmdk-group-label", cmdk).forEach((g) => {
      let n = g.nextElementSibling, any = false;
      while (n && n.classList.contains("cmdk-item")) { if (n.style.display !== "none") any = true; n = n.nextElementSibling; }
      g.style.display = any ? "" : "none";
    });
    const empty = $(".cmdk-empty", cmdk);
    if (empty) empty.style.display = firstVisible ? "none" : "";
    if (firstVisible) firstVisible.classList.add("is-active");
  }
  on(document, "keydown", (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); cmdk && cmdk.classList.contains("is-open") ? closeOverlay(cmdk) : openCmdk(); }
  });
  if (cmdk) {
    const inp = $(".cmdk-input", cmdk);
    on(inp, "input", () => filterCmdk(inp.value));
    on(cmdk, "keydown", (e) => {
      const items = $$(".cmdk-item", cmdk).filter((i) => i.style.display !== "none");
      let idx = items.findIndex((i) => i.classList.contains("is-active"));
      if (e.key === "ArrowDown") { e.preventDefault(); idx = (idx + 1) % items.length; }
      else if (e.key === "ArrowUp") { e.preventDefault(); idx = (idx - 1 + items.length) % items.length; }
      else if (e.key === "Enter") { e.preventDefault(); if (items[idx]) items[idx].click(); return; }
      else return;
      items.forEach((i) => i.classList.remove("is-active"));
      if (items[idx]) { items[idx].classList.add("is-active"); items[idx].scrollIntoView({ block: "nearest" }); }
    });
    $$(".cmdk-item", cmdk).forEach((it) => on(it, "click", () => {
      closeOverlay(cmdk);
      const act = it.getAttribute("data-action");
      if (act === "toggle-theme") $("[data-theme-toggle]") && $("[data-theme-toggle]").click();
      else if (it.dataset.href) window.location.href = it.dataset.href;
      else toast({ title: it.textContent.trim(), msg: "Command executed", type: "success" });
    }));
  }
  $$("[data-cmdk-open]").forEach((b) => on(b, "click", openCmdk));

  /* =========================================================================
     ESC closes the topmost overlay / popup
     ========================================================================= */
  on(document, "keydown", (e) => {
    if (e.key !== "Escape") return;
    const order = [".cmdk-overlay.is-open", ".overlay.is-open", ".drawer-overlay.is-open"];
    for (const sel of order) { const el = $(sel); if (el) { closeOverlay(el); const d = el.querySelector(".drawer"); if (d) d.classList.remove("is-open"); return; } }
    closeAllPopups();
  });

  /* =========================================================================
     TOASTS
     ========================================================================= */
  function toastRegion() {
    let r = $(".toast-region");
    if (!r) { r = document.createElement("div"); r.className = "toast-region"; r.setAttribute("aria-live", "polite"); document.body.appendChild(r); }
    return r;
  }
  const ICONS = {
    success: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>',
    danger:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16h.01"/></svg>',
    warning: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l9 16H3z"/><path d="M12 10v4M12 17h.01"/></svg>',
    info:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></svg>'
  };
  function toast(opts) {
    opts = opts || {};
    const type = opts.type || "info";
    const el = document.createElement("div");
    el.className = "toast " + type; el.setAttribute("role", "status");
    el.innerHTML =
      '<span class="t-icon">' + (ICONS[type] || ICONS.info) + "</span>" +
      '<div class="t-body"><div class="t-title"></div>' + (opts.msg ? '<div class="t-msg"></div>' : "") + "</div>" +
      '<button class="t-close" aria-label="Dismiss"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg></button>' +
      '<span class="t-progress"></span>';
    el.querySelector(".t-title").textContent = opts.title || "Notification";
    if (opts.msg) el.querySelector(".t-msg").textContent = opts.msg;
    const region = toastRegion();
    region.appendChild(el);
    let timer = setTimeout(() => dismiss(), opts.duration || 4000);
    function dismiss() { clearTimeout(timer); el.classList.add("is-leaving"); setTimeout(() => el.remove(), 280); }
    on(el.querySelector(".t-close"), "click", dismiss);
    on(el, "mouseenter", () => { clearTimeout(timer); const p = el.querySelector(".t-progress"); if (p) p.style.animationPlayState = "paused"; });
    on(el, "mouseleave", () => { timer = setTimeout(dismiss, 1500); const p = el.querySelector(".t-progress"); if (p) p.style.animationPlayState = "running"; });
    return el;
  }
  window.oweToast = toast; // expose for inline demos
  on(document, "click", (e) => {
    const b = e.target.closest("[data-toast]");
    if (!b) return;
    toast({ title: b.getAttribute("data-toast") || "Saved", msg: b.getAttribute("data-toast-msg") || "", type: b.getAttribute("data-toast-type") || "success" });
  });

  /* =========================================================================
     SEGMENTED CONTROL  &  generic [data-toggle-group] (button group)
     ========================================================================= */
  $$(".segmented").forEach((seg) => {
    $$("button", seg).forEach((b) => on(b, "click", () => {
      $$("button", seg).forEach((x) => x.setAttribute("aria-selected", "false"));
      b.setAttribute("aria-selected", "true");
      seg.dispatchEvent(new CustomEvent("segchange", { detail: { value: b.dataset.value || b.textContent } }));
    }));
  });
  $$(".btn-group[data-toggle-group]").forEach((grp) => {
    $$(".btn", grp).forEach((b) => on(b, "click", () => {
      $$(".btn", grp).forEach((x) => x.setAttribute("aria-pressed", "false"));
      b.setAttribute("aria-pressed", "true");
    }));
  });

  /* =========================================================================
     SLIDER fill + value bubble
     ========================================================================= */
  function paintSlider(s) {
    const min = +s.min || 0, max = +s.max || 100, val = +s.value;
    const p = ((val - min) / (max - min)) * 100;
    s.style.setProperty("--_p", p + "%");
    const out = s.parentElement && s.parentElement.querySelector("[data-slider-out]");
    if (out) out.textContent = (s.dataset.prefix || "") + val + (s.dataset.suffix || "");
  }
  $$(".slider").forEach((s) => { paintSlider(s); on(s, "input", () => paintSlider(s)); });

  /* =========================================================================
     STEPPER
     ========================================================================= */
  $$(".stepper").forEach((st) => {
    const inp = $("input", st), dec = $("[data-step='-']", st), inc = $("[data-step='+']", st);
    const min = inp.min !== "" ? +inp.min : -Infinity, max = inp.max !== "" ? +inp.max : Infinity;
    const set = (v) => { inp.value = Math.max(min, Math.min(max, v)); };
    on(dec, "click", () => set((+inp.value || 0) - 1));
    on(inc, "click", () => set((+inp.value || 0) + 1));
  });

  /* =========================================================================
     RATING
     ========================================================================= */
  $$(".rating[data-interactive]").forEach((r) => {
    const stars = $$(".star", r);
    const paint = (n) => stars.forEach((s, i) => s.classList.toggle("is-on", i < n));
    stars.forEach((s, i) => {
      on(s, "mouseenter", () => paint(i + 1));
      on(s, "click", () => { r.dataset.value = i + 1; paint(i + 1); });
    });
    on(r, "mouseleave", () => paint(+r.dataset.value || 0));
  });

  /* =========================================================================
     CHIP INPUT
     ========================================================================= */
  $$(".chip-input").forEach((ci) => {
    const inp = $("input", ci);
    const addChip = (text) => {
      text = text.trim(); if (!text) return;
      const chip = document.createElement("span");
      chip.className = "chip";
      chip.innerHTML = '<span></span><button aria-label="Remove"><svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg></button>';
      chip.querySelector("span").textContent = text;
      ci.insertBefore(chip, inp);
    };
    on(inp, "keydown", (e) => {
      if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addChip(inp.value); inp.value = ""; }
      else if (e.key === "Backspace" && inp.value === "") { const last = inp.previousElementSibling; if (last && last.classList.contains("chip")) last.remove(); }
    });
    on(ci, "click", (e) => { const x = e.target.closest(".chip button"); if (x) x.closest(".chip").remove(); else inp.focus(); });
  });

  /* =========================================================================
     COMBOBOX / MULTISELECT / AUTOCOMPLETE
     ========================================================================= */
  $$(".combo").forEach((combo) => {
    const input = $("input", combo), panel = $(".combo-panel", combo), multi = combo.hasAttribute("data-multi");
    const control = $(".combo-control", combo);
    const options = $$(".combo-option", panel);
    const open = () => { closeAllPopups(combo); combo.classList.add("is-open"); };
    on(control, "click", open);
    on(input, "focus", open);
    on(input, "input", () => {
      open();
      const q = input.value.toLowerCase();
      let any = false;
      options.forEach((o) => { const m = o.textContent.toLowerCase().includes(q); o.style.display = m ? "" : "none"; if (m) any = true; });
      let empty = $(".combo-empty", panel);
      if (empty) empty.style.display = any ? "none" : "";
    });
    options.forEach((o) => on(o, "click", () => {
      const label = o.textContent.trim();
      if (multi) {
        const sel = o.getAttribute("aria-selected") === "true";
        o.setAttribute("aria-selected", String(!sel));
        renderChips();
      } else {
        options.forEach((x) => x.setAttribute("aria-selected", "false"));
        o.setAttribute("aria-selected", "true");
        input.value = label;
        combo.classList.remove("is-open");
      }
    }));
    function renderChips() {
      $$(".chip", control).forEach((c) => c.remove());
      options.filter((o) => o.getAttribute("aria-selected") === "true").forEach((o) => {
        const chip = document.createElement("span");
        chip.className = "chip";
        chip.innerHTML = '<span></span><button aria-label="Remove"><svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg></button>';
        chip.querySelector("span").textContent = o.textContent.trim();
        on(chip.querySelector("button"), "click", (ev) => { ev.stopPropagation(); o.setAttribute("aria-selected", "false"); renderChips(); });
        control.insertBefore(chip, input);
      });
      input.placeholder = $(".chip", control) ? "" : (input.dataset.ph || "Select…");
    }
  });

  /* =========================================================================
     SEARCH BAR clear
     ========================================================================= */
  $$(".searchbar").forEach((sb) => {
    const inp = $(".input", sb), clr = $(".s-clear", sb);
    const sync = () => sb.classList.toggle("has-value", !!inp.value);
    on(inp, "input", sync);
    on(clr, "click", () => { inp.value = ""; sync(); inp.focus(); });
    sync();
  });

  /* =========================================================================
     TABLE — sort + select-all + row select
     ========================================================================= */
  $$("table[data-sortable]").forEach((table) => {
    $$("th.sortable", table).forEach((th, col) => {
      on(th, "click", () => {
        const tbody = $("tbody", table);
        const rows = $$("tr", tbody);
        const dir = th.getAttribute("aria-sort") === "ascending" ? "descending" : "ascending";
        $$("th", table).forEach((h) => h.removeAttribute("aria-sort"));
        th.setAttribute("aria-sort", dir);
        const idx = Array.from(th.parentElement.children).indexOf(th);
        rows.sort((a, b) => {
          let x = a.children[idx].dataset.sort || a.children[idx].textContent.trim();
          let y = b.children[idx].dataset.sort || b.children[idx].textContent.trim();
          const nx = parseFloat(x.replace(/[^0-9.\-]/g, "")), ny = parseFloat(y.replace(/[^0-9.\-]/g, ""));
          let cmp = (!isNaN(nx) && !isNaN(ny)) ? nx - ny : x.localeCompare(y);
          return dir === "ascending" ? cmp : -cmp;
        });
        rows.forEach((r) => tbody.appendChild(r));
      });
    });
    const all = $("[data-select-all]", table);
    if (all) on(all, "change", () => {
      $$("tbody [data-row-select]", table).forEach((cb) => { cb.checked = all.checked; cb.closest("tr").classList.toggle("is-selected", all.checked); });
    });
    $$("tbody [data-row-select]", table).forEach((cb) => on(cb, "change", () => cb.closest("tr").classList.toggle("is-selected", cb.checked)));
  });

  /* =========================================================================
     PAGINATION (demo — highlight active)
     ========================================================================= */
  $$(".pagination[data-demo]").forEach((p) => {
    $$("button[data-page]", p).forEach((b) => on(b, "click", () => {
      $$("button[data-page]", p).forEach((x) => x.classList.remove("is-active"));
      b.classList.add("is-active");
    }));
  });

  /* =========================================================================
     CAROUSEL
     ========================================================================= */
  $$(".carousel").forEach((car) => {
    const track = $(".carousel-track", car);
    if (!track) return;
    const prev = $(".carousel-btn.prev", car), next = $(".carousel-btn.next", car);
    const step = () => Math.min(track.clientWidth * 0.8, 360);
    on(prev, "click", () => track.scrollBy({ left: -step(), behavior: "smooth" }));
    on(next, "click", () => track.scrollBy({ left: step(), behavior: "smooth" }));
    const dots = $$(".carousel-dots button", car), slides = Array.from(track.children);
    if (dots.length) {
      dots.forEach((d, i) => on(d, "click", () => slides[i] && slides[i].scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" })));
      on(track, "scroll", () => {
        const i = Math.round(track.scrollLeft / (track.scrollWidth / slides.length));
        dots.forEach((d, j) => d.classList.toggle("is-active", j === i));
      }, { passive: true });
    }
  });

  /* =========================================================================
     SIDEBAR collapse / mobile
     ========================================================================= */
  $$("[data-sidebar-toggle]").forEach((b) => on(b, "click", () => {
    const sb = document.querySelector(b.getAttribute("data-sidebar-toggle") || ".sidebar");
    if (!sb) return;
    if (window.innerWidth <= 880 && sb.classList.contains("app-side")) sb.classList.toggle("is-mobile-open");
    else sb.classList.toggle("is-collapsed");
  }));

  /* =========================================================================
     STEPS / WIZARD
     ========================================================================= */
  $$("[data-wizard]").forEach((wiz) => {
    const steps = $$(".step", wiz);
    const panels = $$("[data-wizard-panel]", wiz);
    let cur = 0;
    const render = () => {
      steps.forEach((s, i) => { s.classList.toggle("is-active", i === cur); s.classList.toggle("is-complete", i < cur); });
      panels.forEach((p, i) => (p.hidden = i !== cur));
      const back = $("[data-wizard-back]", wiz), nextB = $("[data-wizard-next]", wiz), done = $("[data-wizard-done]", wiz);
      if (back) back.disabled = cur === 0;
      if (nextB) nextB.style.display = cur === steps.length - 1 ? "none" : "";
      if (done) done.style.display = cur === steps.length - 1 ? "" : "none";
    };
    on($("[data-wizard-next]", wiz), "click", () => { if (cur < steps.length - 1) { cur++; render(); } });
    on($("[data-wizard-back]", wiz), "click", () => { if (cur > 0) { cur--; render(); } });
    const done = $("[data-wizard-done]", wiz); if (done) on(done, "click", () => toast({ title: "All set!", msg: "Your workspace is ready.", type: "success" }));
    render();
  });

  /* =========================================================================
     COPY TO CLIPBOARD
     ========================================================================= */
  on(document, "click", (e) => {
    const b = e.target.closest("[data-copy]");
    if (!b) return;
    let text = b.getAttribute("data-copy");
    if (text === "" || text === "self") { const pre = b.closest(".codeblock"); text = pre ? pre.querySelector("code, pre, .code-body") ? (pre.querySelector(".code-body") || pre).innerText : pre.innerText : ""; }
    const copy = (t) => { try { navigator.clipboard.writeText(t); } catch (e) {} };
    copy(text);
    const orig = b.innerHTML; b.innerHTML = "Copied ✓";
    setTimeout(() => (b.innerHTML = orig), 1400);
  });

  /* =========================================================================
     FILE UPLOAD dropzone
     ========================================================================= */
  $$(".dropzone").forEach((dz) => {
    const input = dz.querySelector('input[type="file"]') || (function () { const i = document.createElement("input"); i.type = "file"; i.multiple = true; i.hidden = true; dz.appendChild(i); return i; })();
    const list = dz.parentElement.querySelector("[data-file-list]");
    on(dz, "click", () => input.click());
    on(dz, "dragover", (e) => { e.preventDefault(); dz.classList.add("is-dragover"); });
    on(dz, "dragleave", () => dz.classList.remove("is-dragover"));
    on(dz, "drop", (e) => { e.preventDefault(); dz.classList.remove("is-dragover"); render(e.dataTransfer.files); });
    on(input, "change", () => render(input.files));
    function render(files) {
      if (!list) { toast({ title: files.length + " file(s) added", type: "success" }); return; }
      Array.from(files).forEach((f) => {
        const item = document.createElement("div");
        item.className = "file-item";
        item.innerHTML = '<span class="f-icon"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/></svg></span><div class="grow"><div style="font-weight:600">' + f.name + '</div><div style="font-size:var(--text-xs);color:var(--color-text-muted)">' + (f.size/1024).toFixed(1) + ' KB</div></div><button class="btn-icon btn-sm" aria-label="Remove"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg></button>';
        on(item.querySelector("button"), "click", () => item.remove());
        list.appendChild(item);
      });
    }
  });

  /* =========================================================================
     SCROLL REVEAL (IntersectionObserver, respects reduced-motion)
     ========================================================================= */
  const rm = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const toReveal = $$("[data-reveal]");
  if (toReveal.length) {
    if (rm || !("IntersectionObserver" in window)) toReveal.forEach((el) => el.classList.add("revealed"));
    else {
      const io = new IntersectionObserver((ents) => ents.forEach((en) => {
        if (en.isIntersecting) { en.target.style.transitionDelay = (en.target.dataset.reveal || 0) + "ms"; en.target.classList.add("revealed"); io.unobserve(en.target); }
      }), { threshold: 0.12 });
      toReveal.forEach((el) => io.observe(el));
    }
  }

  /* =========================================================================
     PRICING toggle (monthly/yearly) — [data-price-toggle]
     ========================================================================= */
  $$("[data-price-toggle]").forEach((sw) => {
    const input = sw.matches("input") ? sw : sw.querySelector("input");
    const update = () => {
      const yearly = input.checked;
      $$("[data-price-month]").forEach((e) => (e.style.display = yearly ? "none" : ""));
      $$("[data-price-year]").forEach((e) => (e.style.display = yearly ? "" : "none"));
    };
    on(input, "change", update); update();
  });

  /* =========================================================================
     Simple Kanban drag & drop (HTML5 DnD)
     ========================================================================= */
  let dragged = null;
  $$(".kanban-card[draggable], .kanban-card").forEach((c) => { c.setAttribute("draggable", "true"); });
  on(document, "dragstart", (e) => { const c = e.target.closest(".kanban-card"); if (c) { dragged = c; c.style.opacity = "0.4"; } });
  on(document, "dragend", (e) => { const c = e.target.closest(".kanban-card"); if (c) c.style.opacity = ""; $$(".kanban-col").forEach((k) => k.classList.remove("drop-target")); });
  on(document, "dragover", (e) => { const col = e.target.closest(".col-body, .kanban-col"); if (col && dragged) { e.preventDefault(); const k = col.closest(".kanban-col"); $$(".kanban-col").forEach((x) => x.classList.toggle("drop-target", x === k)); } });
  on(document, "drop", (e) => {
    const body = e.target.closest(".col-body");
    if (body && dragged) { e.preventDefault(); body.appendChild(dragged); updateCounts(); }
    $$(".kanban-col").forEach((k) => k.classList.remove("drop-target"));
  });
  function updateCounts() { $$(".kanban-col").forEach((col) => { const n = $$(".kanban-card", col).length; const c = col.querySelector("[data-col-count]"); if (c) c.textContent = n; }); }
  updateCounts();

  /* =========================================================================
     Tilt micro-interaction for [data-tilt] (subtle, organic)
     ========================================================================= */
  if (!rm) $$("[data-tilt]").forEach((el) => {
    on(el, "mousemove", (e) => {
      const r = el.getBoundingClientRect();
      const rx = ((e.clientY - r.top) / r.height - 0.5) * -6;
      const ry = ((e.clientX - r.left) / r.width - 0.5) * 6;
      el.style.transform = `perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    });
    on(el, "mouseleave", () => (el.style.transform = ""));
  });

  /* =========================================================================
     Year stamp + ready flag
     ========================================================================= */
  $$("[data-year]").forEach((e) => (e.textContent = new Date().getFullYear()));
  document.documentElement.classList.add("owe-ready");
})();
