/* ============================================================================
   THEME 20 — BLUEPRINT / WIREFRAME · app.js
   All interactions, vanilla JS, no dependencies. Works on file:// double-click.
   Data-attribute driven + idempotent (safe to run on every page).
   Public API exposed at window.BP { toast, openModal, closeModal, ... }
   ============================================================================ */
(function () {
  "use strict";

  var d = document;
  var root = d.documentElement;
  var STORE = {
    get: function (k, f) { try { var v = localStorage.getItem(k); return v === null ? f : v; } catch (e) { return f; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };

  function $(sel, ctx) { return (ctx || d).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || d).querySelectorAll(sel)); }
  function on(el, ev, fn, opt) { if (el) el.addEventListener(ev, fn, opt); }

  /* ------------------------------------------------------------------ */
  /* SVG icon helper (line icons)                                       */
  /* ------------------------------------------------------------------ */
  var ICONS = {
    check: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 8.5l3.5 3.5L13 4"/></svg>',
    info:  '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="10" cy="10" r="8"/><path d="M10 9v5M10 6.2v.2"/></svg>',
    warn:  '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M10 2l8 15H2z"/><path d="M10 8v4M10 14.5v.2"/></svg>',
    error: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="10" cy="10" r="8"/><path d="M7 7l6 6M13 7l-6 6"/></svg>',
    x:     '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3.5 3.5l9 9M12.5 3.5l-9 9"/></svg>'
  };

  /* ================================================================== */
  /* 1. THEME TOGGLE (dark / light)                                     */
  /* ================================================================== */
  function applyTheme(t) {
    root.setAttribute("data-theme", t);
    STORE.set("bp-theme", t);
    $$("[data-toggle-theme]").forEach(function (b) {
      b.setAttribute("aria-pressed", String(t === "light"));
      var lbl = b.querySelector("[data-theme-label]");
      if (lbl) lbl.textContent = t === "light" ? "LIGHT" : "DARK";
    });
  }
  function initTheme() {
    var saved = STORE.get("bp-theme", "dark");
    applyTheme(saved);
    $$("[data-toggle-theme]").forEach(function (btn) {
      on(btn, "click", function () {
        applyTheme(root.getAttribute("data-theme") === "light" ? "dark" : "light");
      });
    });
  }

  /* ================================================================== */
  /* 2. GRID + DIMENSION TOGGLES                                        */
  /* ================================================================== */
  function initGrid() {
    var g = STORE.get("bp-grid", "on");
    root.setAttribute("data-grid", g);
    $$("[data-toggle-grid]").forEach(function (b) { b.setAttribute("aria-pressed", String(g === "on")); });
    $$("[data-toggle-grid]").forEach(function (btn) {
      on(btn, "click", function () {
        var next = root.getAttribute("data-grid") === "on" ? "off" : "on";
        root.setAttribute("data-grid", next);
        STORE.set("bp-grid", next);
        $$("[data-toggle-grid]").forEach(function (b) { b.setAttribute("aria-pressed", String(next === "on")); });
      });
    });

    var dm = STORE.get("bp-dims", "on");
    root.setAttribute("data-dims", dm);
    $$("[data-toggle-dims]").forEach(function (b) { b.setAttribute("aria-pressed", String(dm === "on")); });
    $$("[data-toggle-dims]").forEach(function (btn) {
      on(btn, "click", function () {
        var next = root.getAttribute("data-dims") === "on" ? "off" : "on";
        root.setAttribute("data-dims", next);
        STORE.set("bp-dims", next);
        $$("[data-toggle-dims]").forEach(function (b) { b.setAttribute("aria-pressed", String(next === "on")); });
      });
    });
  }

  /* ================================================================== */
  /* 3. TABS                                                            */
  /* ================================================================== */
  function initTabs() {
    $$('[data-tabs]').forEach(function (group) {
      var tabs = $$('[role="tab"]', group);
      var panels = $$('[role="tabpanel"]', group);
      function select(idx) {
        tabs.forEach(function (t, i) {
          var sel = i === idx;
          t.setAttribute("aria-selected", String(sel));
          t.tabIndex = sel ? 0 : -1;
        });
        panels.forEach(function (p, i) { p.hidden = i !== idx; });
      }
      tabs.forEach(function (t, i) {
        on(t, "click", function () { select(i); });
        on(t, "keydown", function (e) {
          var dir = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
          if (!dir) return;
          e.preventDefault();
          var ni = (i + dir + tabs.length) % tabs.length;
          tabs[ni].focus(); select(ni);
        });
      });
      var init = tabs.findIndex(function (t) { return t.getAttribute("aria-selected") === "true"; });
      select(init < 0 ? 0 : init);
    });
  }

  /* ================================================================== */
  /* 4. ACCORDION                                                       */
  /* ================================================================== */
  function initAccordion() {
    $$('[data-accordion]').forEach(function (acc) {
      var single = acc.getAttribute("data-accordion") === "single";
      $$('.accordion-trigger', acc).forEach(function (trig) {
        var item = trig.closest(".accordion-item");
        var panel = $(".accordion-panel", item);
        trig.setAttribute("aria-expanded", item.getAttribute("data-open") === "true" ? "true" : "false");
        if (panel) { panel.setAttribute("role", "region"); }
        on(trig, "click", function () {
          var open = item.getAttribute("data-open") === "true";
          if (single) {
            $$('.accordion-item', acc).forEach(function (it) {
              it.setAttribute("data-open", "false");
              var t = $(".accordion-trigger", it); if (t) t.setAttribute("aria-expanded", "false");
            });
          }
          item.setAttribute("data-open", String(!open));
          trig.setAttribute("aria-expanded", String(!open));
        });
      });
    });
  }

  /* ================================================================== */
  /* 5. MODAL / DIALOG                                                  */
  /* ================================================================== */
  var lastFocus = null;
  function getScrim() {
    var s = $("#bp-scrim");
    if (!s) {
      s = d.createElement("div");
      s.id = "bp-scrim"; s.className = "scrim"; s.setAttribute("data-open", "false");
      d.body.appendChild(s);
      on(s, "click", function () { closeAllOverlays(); });
    }
    return s;
  }
  function openModal(id) {
    var m = typeof id === "string" ? d.getElementById(id) : id;
    if (!m) return;
    lastFocus = d.activeElement;
    getScrim().setAttribute("data-open", "true");
    m.setAttribute("data-open", "true");
    m.setAttribute("aria-hidden", "false");
    trapFocus(m);
    var f = m.querySelector("[autofocus], input, button, [tabindex]");
    if (f) setTimeout(function () { f.focus(); }, 60);
  }
  function closeModal(id) {
    var m = typeof id === "string" ? d.getElementById(id) : id;
    if (m) { m.setAttribute("data-open", "false"); m.setAttribute("aria-hidden", "true"); }
    if (!anyOverlayOpen()) getScrim().setAttribute("data-open", "false");
    if (lastFocus) lastFocus.focus();
  }
  function anyOverlayOpen() {
    return $$('.modal[data-open="true"], .drawer[data-open="true"], .cmdk[data-open="true"]').length > 0;
  }
  function closeAllOverlays() {
    $$('.modal[data-open="true"]').forEach(function (m) { m.setAttribute("data-open", "false"); });
    $$('.drawer[data-open="true"]').forEach(function (m) { m.setAttribute("data-open", "false"); });
    closeCmdk();
    getScrim().setAttribute("data-open", "false");
    if (lastFocus) lastFocus.focus();
  }
  function initModals() {
    $$("[data-open-modal]").forEach(function (b) {
      on(b, "click", function () { openModal(b.getAttribute("data-open-modal")); });
    });
    $$("[data-close-modal]").forEach(function (b) {
      on(b, "click", function () {
        var m = b.closest(".modal"); if (m) closeModal(m); else closeAllOverlays();
      });
    });
  }

  /* ================================================================== */
  /* 6. DRAWER                                                          */
  /* ================================================================== */
  function openDrawer(id) {
    var dr = typeof id === "string" ? d.getElementById(id) : id;
    if (!dr) return;
    lastFocus = d.activeElement;
    getScrim().setAttribute("data-open", "true");
    dr.setAttribute("data-open", "true");
    dr.setAttribute("aria-hidden", "false");
    trapFocus(dr);
  }
  function closeDrawer(id) {
    var dr = typeof id === "string" ? d.getElementById(id) : id;
    if (dr) { dr.setAttribute("data-open", "false"); dr.setAttribute("aria-hidden", "true"); }
    if (!anyOverlayOpen()) getScrim().setAttribute("data-open", "false");
  }
  function initDrawers() {
    $$("[data-open-drawer]").forEach(function (b) {
      on(b, "click", function () { openDrawer(b.getAttribute("data-open-drawer")); });
    });
    $$("[data-close-drawer]").forEach(function (b) {
      on(b, "click", function () { var dr = b.closest(".drawer"); if (dr) closeDrawer(dr); });
    });
  }

  /* Basic focus trap */
  function trapFocus(container) {
    function handler(e) {
      if (e.key !== "Tab") return;
      if (container.getAttribute("data-open") !== "true") { d.removeEventListener("keydown", handler); return; }
      var f = $$('a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])', container)
        .filter(function (el) { return el.offsetParent !== null; });
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && d.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && d.activeElement === last) { e.preventDefault(); first.focus(); }
    }
    d.addEventListener("keydown", handler);
  }

  /* ================================================================== */
  /* 7. TOAST                                                           */
  /* ================================================================== */
  function getToastRegion() {
    var r = $(".toast-region");
    if (!r) {
      r = d.createElement("div");
      r.className = "toast-region";
      r.setAttribute("role", "region");
      r.setAttribute("aria-live", "polite");
      r.setAttribute("aria-label", "알림");
      d.body.appendChild(r);
    }
    return r;
  }
  function toast(opts) {
    opts = opts || {};
    if (typeof opts === "string") opts = { title: opts };
    var type = opts.type || "default";
    var el = d.createElement("div");
    el.className = "toast" + (type !== "default" ? " toast--" + type : "");
    el.setAttribute("role", "status");
    var icon = type === "success" ? ICONS.check : type === "warning" ? ICONS.warn : type === "danger" ? ICONS.error : ICONS.info;
    el.innerHTML =
      '<span class="lead" aria-hidden="true">' + icon + '</span>' +
      '<div class="flex-1">' +
        '<div class="toast-title">' + (opts.title || "알림") + '</div>' +
        (opts.body ? '<div class="toast-body">' + opts.body + '</div>' : '') +
      '</div>' +
      '<button class="toast-close" aria-label="닫기">' + ICONS.x + '</button>' +
      '<span class="toast-progress" aria-hidden="true"></span>';
    getToastRegion().appendChild(el);
    var dur = opts.duration || 4000;
    var timer = setTimeout(dismiss, dur);
    function dismiss() {
      clearTimeout(timer);
      el.classList.add("is-leaving");
      setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 200);
    }
    on($(".toast-close", el), "click", dismiss);
    on(el, "mouseenter", function () { clearTimeout(timer); var b = $(".toast-progress", el); if (b) b.style.animationPlayState = "paused"; });
    on(el, "mouseleave", function () { timer = setTimeout(dismiss, 1500); var b = $(".toast-progress", el); if (b) b.style.animationPlayState = "running"; });
    return el;
  }
  function initToasts() {
    $$("[data-toast]").forEach(function (b) {
      on(b, "click", function () {
        toast({
          type: b.getAttribute("data-toast") || "default",
          title: b.getAttribute("data-toast-title") || "작업 완료",
          body: b.getAttribute("data-toast-body") || ""
        });
      });
    });
  }

  /* ================================================================== */
  /* 8. COMMAND PALETTE (⌘K)                                            */
  /* ================================================================== */
  function getCmdk() { return $("#bp-cmdk"); }
  function openCmdk() {
    var c = getCmdk(); if (!c) return;
    lastFocus = d.activeElement;
    getScrim().setAttribute("data-open", "true");
    c.setAttribute("data-open", "true");
    var inp = $(".cmdk-input", c);
    filterCmdk("");
    if (inp) { inp.value = ""; setTimeout(function () { inp.focus(); }, 50); }
  }
  function closeCmdk() {
    var c = getCmdk(); if (c) c.setAttribute("data-open", "false");
    if (!anyOverlayOpen()) getScrim().setAttribute("data-open", "false");
  }
  function filterCmdk(q) {
    var c = getCmdk(); if (!c) return;
    q = (q || "").toLowerCase();
    var items = $$(".cmdk-item", c);
    var firstShown = null;
    items.forEach(function (it) {
      var text = (it.getAttribute("data-keywords") || it.textContent).toLowerCase();
      var show = !q || text.indexOf(q) >= 0;
      it.style.display = show ? "" : "none";
      it.classList.remove("is-active");
      if (show && !firstShown) firstShown = it;
    });
    $$(".cmdk-group-label", c).forEach(function (lbl) {
      var grp = lbl.nextElementSibling, has = false;
      while (grp && grp.classList.contains("cmdk-item")) { if (grp.style.display !== "none") has = true; grp = grp.nextElementSibling; }
      lbl.style.display = has ? "" : "none";
    });
    if (firstShown) firstShown.classList.add("is-active");
  }
  function cmdkActiveMove(dir) {
    var c = getCmdk(); if (!c) return;
    var vis = $$(".cmdk-item", c).filter(function (i) { return i.style.display !== "none"; });
    if (!vis.length) return;
    var idx = vis.findIndex(function (i) { return i.classList.contains("is-active"); });
    if (idx < 0) idx = 0; else { vis[idx].classList.remove("is-active"); idx = (idx + dir + vis.length) % vis.length; }
    vis[idx].classList.add("is-active");
    vis[idx].scrollIntoView({ block: "nearest" });
  }
  function initCmdk() {
    var c = getCmdk();
    $$("[data-cmdk]").forEach(function (b) { on(b, "click", openCmdk); });
    if (!c) return;
    var inp = $(".cmdk-input", c);
    on(inp, "input", function () { filterCmdk(inp.value); });
    on(c, "keydown", function (e) {
      if (e.key === "ArrowDown") { e.preventDefault(); cmdkActiveMove(1); }
      else if (e.key === "ArrowUp") { e.preventDefault(); cmdkActiveMove(-1); }
      else if (e.key === "Enter") {
        var a = $(".cmdk-item.is-active", c); if (a) { a.click(); }
      }
    });
    $$(".cmdk-item", c).forEach(function (it) {
      on(it, "mouseenter", function () { $$(".cmdk-item", c).forEach(function (x) { x.classList.remove("is-active"); }); it.classList.add("is-active"); });
      on(it, "click", function () {
        var href = it.getAttribute("data-href");
        var act = it.getAttribute("data-action");
        closeCmdk();
        if (act === "theme") applyTheme(root.getAttribute("data-theme") === "light" ? "dark" : "light");
        else if (act === "grid") { var nb = $("[data-toggle-grid]"); if (nb) nb.click(); }
        else if (act === "toast") toast({ type: "success", title: "명령 실행됨", body: it.textContent.trim() });
        else if (href) { if (href.charAt(0) === "#") return; window.location.href = href; }
        else toast({ title: it.textContent.trim() });
      });
    });
  }

  /* ================================================================== */
  /* 9. MENU / DROPDOWN + POPOVER + CONTEXT MENU                        */
  /* ================================================================== */
  function closeAllMenus(except) {
    $$('[data-menu][data-open="true"], .popover[data-open="true"], .combo[data-open="true"], .datepicker[data-open="true"]').forEach(function (m) {
      if (m !== except) m.setAttribute("data-open", "false");
    });
  }
  function initMenus() {
    $$("[data-menu]").forEach(function (menu) {
      var trig = $("[data-menu-trigger]", menu) || menu.firstElementChild;
      menu.setAttribute("data-open", "false");
      on(trig, "click", function (e) {
        e.stopPropagation();
        var open = menu.getAttribute("data-open") === "true";
        closeAllMenus(menu);
        menu.setAttribute("data-open", String(!open));
        if (trig.setAttribute) trig.setAttribute("aria-expanded", String(!open));
      });
      $$(".menu-item", menu).forEach(function (mi) {
        on(mi, "click", function () { menu.setAttribute("data-open", "false"); });
      });
    });
    $$(".popover").forEach(function (pop) {
      var trig = $("[data-popover-trigger]", pop) || pop.firstElementChild;
      pop.setAttribute("data-open", pop.getAttribute("data-open") || "false");
      on(trig, "click", function (e) {
        e.stopPropagation();
        var open = pop.getAttribute("data-open") === "true";
        closeAllMenus(pop);
        pop.setAttribute("data-open", String(!open));
      });
    });
    // Context menu
    var cm = $("#bp-context");
    if (cm) {
      $$("[data-context]").forEach(function (zone) {
        on(zone, "contextmenu", function (e) {
          e.preventDefault();
          cm.hidden = false;
          var x = Math.min(e.clientX, window.innerWidth - cm.offsetWidth - 8);
          var y = Math.min(e.clientY, window.innerHeight - cm.offsetHeight - 8);
          cm.style.left = x + "px"; cm.style.top = y + "px";
        });
      });
      $$(".menu-item", cm).forEach(function (mi) { on(mi, "click", function () { cm.hidden = true; toast({ title: mi.textContent.trim() }); }); });
    }
    on(d, "click", function () { closeAllMenus(null); var cm = $("#bp-context"); if (cm) cm.hidden = true; });
  }

  /* ================================================================== */
  /* 10. COMBOBOX / SELECT / MULTISELECT                                */
  /* ================================================================== */
  function initCombos() {
    $$(".combo").forEach(function (combo) {
      var control = $(".combo-control", combo);
      var input = $(".combo-input", combo);
      var multi = combo.getAttribute("data-multi") === "true";
      var placeholder = $(".placeholder", combo);
      combo.setAttribute("data-open", "false");
      function openIt() { closeAllMenus(combo); combo.setAttribute("data-open", "true"); if (input) input.focus(); }
      on(control, "click", function (e) {
        e.stopPropagation();
        combo.setAttribute("data-open", combo.getAttribute("data-open") === "true" ? "false" : "true");
        if (combo.getAttribute("data-open") === "true" && input) input.focus();
      });
      if (input) on(input, "input", function () {
        openIt();
        var q = input.value.toLowerCase();
        $$(".combo-option", combo).forEach(function (o) {
          o.style.display = (!q || o.textContent.toLowerCase().indexOf(q) >= 0) ? "" : "none";
        });
      });
      $$(".combo-option", combo).forEach(function (opt) {
        on(opt, "click", function (e) {
          e.stopPropagation();
          if (multi) {
            var sel = opt.getAttribute("aria-selected") === "true";
            opt.setAttribute("aria-selected", String(!sel));
            renderMultiChips(combo);
          } else {
            $$(".combo-option", combo).forEach(function (o) { o.setAttribute("aria-selected", "false"); });
            opt.setAttribute("aria-selected", "true");
            if (placeholder) { placeholder.textContent = opt.textContent.trim(); placeholder.classList.remove("placeholder"); placeholder.style.color = "var(--color-text)"; }
            combo.setAttribute("data-open", "false");
          }
        });
      });
      if (multi) renderMultiChips(combo);
    });
  }
  function renderMultiChips(combo) {
    var control = $(".combo-control", combo);
    var input = $(".combo-input", combo);
    var placeholder = $(".placeholder", combo);
    $$(".combo-chip", control).forEach(function (c) { c.remove(); });
    var chosen = $$('.combo-option[aria-selected="true"]', combo);
    if (placeholder) placeholder.style.display = chosen.length ? "none" : "";
    chosen.forEach(function (opt) {
      var chip = d.createElement("span");
      chip.className = "combo-chip";
      chip.innerHTML = opt.textContent.trim() + ' <button aria-label="제거" type="button">' + ICONS.x + '</button>';
      on($("button", chip), "click", function (e) { e.stopPropagation(); opt.setAttribute("aria-selected", "false"); renderMultiChips(combo); });
      control.insertBefore(chip, input || null);
    });
  }

  /* ================================================================== */
  /* 11. SWITCH / SLIDER / STEPPER / RATING / CHIP INPUT                */
  /* ================================================================== */
  function initInputs() {
    // switch live label
    $$(".switch input").forEach(function (cb) {
      var lbl = cb.closest(".switch") && cb.closest(".switch").querySelector(".switch-state");
      function upd() { if (lbl) lbl.textContent = cb.checked ? (lbl.getAttribute("data-on") || "ON") : (lbl.getAttribute("data-off") || "OFF"); }
      on(cb, "change", upd); upd();
    });
    // slider value + fill
    $$('.slider input[type="range"]').forEach(function (r) {
      var box = r.closest(".slider-row") || r.closest(".slider") || r.parentNode;
      var out = box && box.querySelector(".slider-value");
      function upd() {
        var min = +r.min || 0, max = +r.max || 100, pct = ((r.value - min) / (max - min)) * 100;
        r.style.setProperty("--_pct", pct + "%");
        if (out) out.textContent = (out.getAttribute("data-prefix") || "") + r.value + (out.getAttribute("data-suffix") || "");
      }
      on(r, "input", upd); upd();
    });
    // stepper
    $$(".stepper").forEach(function (st) {
      var input = $("input", st);
      var dec = $('[data-step="-1"]', st), inc = $('[data-step="1"]', st);
      function clamp(v) { var min = input.min !== "" ? +input.min : -Infinity, max = input.max !== "" ? +input.max : Infinity; return Math.max(min, Math.min(max, v)); }
      on(dec, "click", function () { input.value = clamp((+input.value || 0) - (+input.step || 1)); input.dispatchEvent(new Event("change")); });
      on(inc, "click", function () { input.value = clamp((+input.value || 0) + (+input.step || 1)); input.dispatchEvent(new Event("change")); });
    });
    // rating
    $$(".rating").forEach(function (rt) {
      var btns = $$("button", rt);
      var val = +(rt.getAttribute("data-value") || 0);
      function paint(n) { btns.forEach(function (b, i) { b.classList.toggle("is-on", i < n); }); }
      paint(val);
      btns.forEach(function (b, i) {
        on(b, "mouseenter", function () { paint(i + 1); });
        on(b, "focus", function () { paint(i + 1); });
        on(b, "click", function () { val = i + 1; rt.setAttribute("data-value", val); paint(val); });
      });
      on(rt, "mouseleave", function () { paint(val); });
    });
    // chip input
    $$(".chipinput").forEach(function (ci) {
      var input = $("input", ci);
      on(input, "keydown", function (e) {
        if ((e.key === "Enter" || e.key === ",") && input.value.trim()) {
          e.preventDefault();
          addChip(ci, input.value.trim()); input.value = "";
        } else if (e.key === "Backspace" && !input.value) {
          var chips = $$(".chip", ci); if (chips.length) chips[chips.length - 1].remove();
        }
      });
    });
    $$(".chipinput .chip button").forEach(function (b) { on(b, "click", function () { b.closest(".chip").remove(); }); });
  }
  function addChip(ci, text) {
    var input = $("input", ci);
    var chip = d.createElement("span");
    chip.className = "chip";
    chip.innerHTML = text + ' <button type="button" aria-label="제거">' + ICONS.x + '</button>';
    on($("button", chip), "click", function () { chip.remove(); });
    ci.insertBefore(chip, input);
  }

  /* ================================================================== */
  /* 12. FILE DROPZONE                                                  */
  /* ================================================================== */
  function initDropzones() {
    $$(".dropzone").forEach(function (dz) {
      var input = $('input[type="file"]', dz) || (function () { var i = d.createElement("input"); i.type = "file"; i.multiple = true; i.hidden = true; dz.appendChild(i); return i; })();
      var listSel = dz.getAttribute("data-list");
      var list = listSel ? $(listSel) : null;
      on(dz, "click", function () { input.click(); });
      ["dragenter", "dragover"].forEach(function (ev) { on(dz, ev, function (e) { e.preventDefault(); dz.classList.add("is-drag"); }); });
      ["dragleave", "drop"].forEach(function (ev) { on(dz, ev, function (e) { e.preventDefault(); dz.classList.remove("is-drag"); }); });
      on(dz, "drop", function (e) { addFiles(e.dataTransfer.files); });
      on(input, "change", function () { addFiles(input.files); });
      function addFiles(files) {
        if (!list) { toast({ type: "success", title: files.length + "개 파일 추가됨" }); return; }
        Array.prototype.forEach.call(files, function (f) {
          var row = d.createElement("div");
          row.className = "file-item";
          row.innerHTML = '<span class="badge badge--primary">FILE</span><span class="name truncate">' + f.name + '</span><span class="text-subtle text-xs">' + Math.max(1, Math.round((f.size || 0) / 1024)) + ' KB</span><button class="btn btn--icon btn--sm btn--ghost" aria-label="제거">' + ICONS.x + '</button>';
          on($("button", row), "click", function () { row.remove(); });
          list.appendChild(row);
        });
      }
    });
  }

  /* ================================================================== */
  /* 13. TABLE — sort, select-all, row select                          */
  /* ================================================================== */
  function initTables() {
    $$("table.table").forEach(function (table) {
      // sorting
      $$("th.sortable", table).forEach(function (th) {
        on(th, "click", function () {
          var idx = Array.prototype.indexOf.call(th.parentNode.children, th);
          var cur = th.getAttribute("aria-sort");
          var asc = cur !== "ascending";
          $$("th", table).forEach(function (h) { h.removeAttribute("aria-sort"); });
          th.setAttribute("aria-sort", asc ? "ascending" : "descending");
          var tbody = $("tbody", table);
          var rows = $$("tr", tbody);
          var type = th.getAttribute("data-type") || "string";
          rows.sort(function (a, b) {
            var av = (a.children[idx] ? a.children[idx].textContent : "").trim();
            var bv = (b.children[idx] ? b.children[idx].textContent : "").trim();
            if (type === "number") { av = parseFloat(av.replace(/[^0-9.\-]/g, "")) || 0; bv = parseFloat(bv.replace(/[^0-9.\-]/g, "")) || 0; return asc ? av - bv : bv - av; }
            return asc ? av.localeCompare(bv) : bv.localeCompare(av);
          });
          rows.forEach(function (r) { tbody.appendChild(r); });
        });
      });
      // select all
      var selAll = $("[data-select-all]", table);
      if (selAll) {
        on(selAll, "change", function () {
          $$("tbody [data-row-select]", table).forEach(function (cb) { cb.checked = selAll.checked; setRowSel(cb); });
        });
      }
      $$("tbody [data-row-select]", table).forEach(function (cb) {
        on(cb, "change", function () { setRowSel(cb); syncSelectAll(table, selAll); });
      });
    });
  }
  function setRowSel(cb) { var tr = cb.closest("tr"); if (tr) tr.setAttribute("aria-selected", String(cb.checked)); }
  function syncSelectAll(table, selAll) {
    if (!selAll) return;
    var all = $$("tbody [data-row-select]", table), on_ = all.filter(function (c) { return c.checked; });
    selAll.indeterminate = on_.length > 0 && on_.length < all.length;
    selAll.checked = on_.length === all.length && all.length > 0;
  }

  /* ================================================================== */
  /* 14. KANBAN drag & drop                                             */
  /* ================================================================== */
  function initKanban() {
    var dragged = null;
    $$(".kanban-card").forEach(makeDraggable);
    function makeDraggable(card) {
      card.setAttribute("draggable", "true");
      on(card, "dragstart", function () { dragged = card; setTimeout(function () { card.classList.add("is-drag"); }, 0); });
      on(card, "dragend", function () { card.classList.remove("is-drag"); dragged = null; $$(".kanban-col-body").forEach(function (b) { b.classList.remove("is-drop-target"); }); updateCounts(); });
    }
    $$(".kanban-col-body").forEach(function (body) {
      on(body, "dragover", function (e) { e.preventDefault(); body.classList.add("is-drop-target"); var after = afterElement(body, e.clientY); if (dragged) { if (after == null) body.appendChild(dragged); else body.insertBefore(dragged, after); } });
      on(body, "dragleave", function () { body.classList.remove("is-drop-target"); });
      on(body, "drop", function (e) { e.preventDefault(); body.classList.remove("is-drop-target"); });
    });
    function afterElement(container, y) {
      var els = $$(".kanban-card:not(.is-drag)", container);
      var closest = { offset: -Infinity, el: null };
      els.forEach(function (child) {
        var box = child.getBoundingClientRect();
        var offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) closest = { offset: offset, el: child };
      });
      return closest.el;
    }
    function updateCounts() {
      $$(".kanban-col").forEach(function (col) {
        var n = $$(".kanban-card", col).length;
        var badge = $(".kanban-col-head .count", col);
        if (badge) badge.textContent = n;
      });
    }
  }

  /* ================================================================== */
  /* 15. CAROUSEL                                                       */
  /* ================================================================== */
  function initCarousels() {
    $$(".carousel").forEach(function (car) {
      var track = $(".carousel-track", car);
      var slides = $$(".carousel-slide", car);
      var dots = $$(".carousel-dots button", car);
      var idx = 0;
      function go(i) {
        idx = (i + slides.length) % slides.length;
        track.style.transform = "translateX(-" + (idx * 100) + "%)";
        dots.forEach(function (dt, di) { dt.setAttribute("aria-current", String(di === idx)); });
      }
      $$("[data-car-prev]", car).forEach(function (b) { on(b, "click", function () { go(idx - 1); }); });
      $$("[data-car-next]", car).forEach(function (b) { on(b, "click", function () { go(idx + 1); }); });
      dots.forEach(function (dt, di) { on(dt, "click", function () { go(di); }); });
      go(0);
    });
  }

  /* ================================================================== */
  /* 16. CALENDAR (lightweight render)                                  */
  /* ================================================================== */
  function initCalendars() {
    $$("[data-calendar]").forEach(function (cal) {
      var view = new Date(2026, 5, 1); // June 2026 reference
      function render() {
        var y = view.getFullYear(), m = view.getMonth();
        var months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
        var head = $(".calendar-head .month", cal); if (head) head.textContent = months[m] + " " + y;
        var grid = $(".calendar-grid", cal); if (!grid) return;
        grid.innerHTML = "";
        ["MO", "TU", "WE", "TH", "FR", "SA", "SU"].forEach(function (dw) { var c = d.createElement("div"); c.className = "calendar-dow"; c.textContent = dw; grid.appendChild(c); });
        var first = new Date(y, m, 1); var startDow = (first.getDay() + 6) % 7;
        var daysIn = new Date(y, m + 1, 0).getDate();
        var prevDays = new Date(y, m, 0).getDate();
        var today = new Date(2026, 5, 21);
        for (var i = 0; i < startDow; i++) { var c = d.createElement("button"); c.className = "calendar-day is-muted"; c.textContent = prevDays - startDow + i + 1; grid.appendChild(c); }
        for (var day = 1; day <= daysIn; day++) {
          var b = d.createElement("button"); b.className = "calendar-day"; b.textContent = day;
          if (y === today.getFullYear() && m === today.getMonth() && day === today.getDate()) b.classList.add("is-today");
          (function (bb) { on(bb, "click", function () { $$(".calendar-day.is-selected", cal).forEach(function (x) { x.classList.remove("is-selected"); }); bb.classList.add("is-selected"); }); })(b);
          grid.appendChild(b);
        }
      }
      var prev = $("[data-cal-prev]", cal), next = $("[data-cal-next]", cal);
      on(prev, "click", function () { view.setMonth(view.getMonth() - 1); render(); });
      on(next, "click", function () { view.setMonth(view.getMonth() + 1); render(); });
      render();
    });
    // datepicker open/close
    $$(".datepicker").forEach(function (dp) {
      dp.setAttribute("data-open", "false");
      var trig = $("[data-dp-trigger]", dp);
      on(trig, "click", function (e) { e.stopPropagation(); closeAllMenus(dp); dp.setAttribute("data-open", dp.getAttribute("data-open") === "true" ? "false" : "true"); });
      $$(".calendar-day", dp).forEach(function (day) {
        on(day, "click", function () { if (trig && day.textContent && !day.classList.contains("is-muted")) { var inp = $("input", trig) || trig; if (inp.value !== undefined) inp.value = "2026-06-" + ("0" + day.textContent).slice(-2); else trig.querySelector("[data-dp-value]") && (trig.querySelector("[data-dp-value]").textContent = "2026-06-" + ("0" + day.textContent).slice(-2)); dp.setAttribute("data-open", "false"); } });
      });
    });
  }

  /* ================================================================== */
  /* 17. PROGRESS RING set from data-pct                                */
  /* ================================================================== */
  function initRings() {
    $$(".progress-ring .ind").forEach(function (ind) {
      var r = +ind.getAttribute("r"); var circ = 2 * Math.PI * r;
      var pct = +(ind.getAttribute("data-pct") || 0);
      ind.style.strokeDasharray = circ;
      ind.style.strokeDashoffset = circ;
      requestAnimationFrame(function () { ind.style.strokeDashoffset = circ * (1 - pct / 100); });
    });
    $$(".progress-bar[data-pct]").forEach(function (bar) {
      var pct = +(bar.getAttribute("data-pct") || 0);
      requestAnimationFrame(function () { bar.style.width = pct + "%"; });
    });
  }

  /* ================================================================== */
  /* 18. SIDEBAR collapse + mobile nav                                  */
  /* ================================================================== */
  function initSidebar() {
    $$("[data-sidebar-toggle]").forEach(function (b) {
      on(b, "click", function () {
        var sb = $(b.getAttribute("data-sidebar-toggle") || ".sidebar");
        if (!sb) return;
        if (window.matchMedia("(max-width: 820px)").matches) { sb.classList.toggle("is-mobile-hidden"); }
        else { sb.setAttribute("data-collapsed", sb.getAttribute("data-collapsed") === "true" ? "false" : "true"); }
      });
    });
    // start collapsed on small screens
    if (window.matchMedia("(max-width: 820px)").matches) {
      $$(".sidebar").forEach(function (sb) { sb.classList.add("is-mobile-hidden"); });
    }
  }

  /* ================================================================== */
  /* 19. COPY-TO-CLIPBOARD                                              */
  /* ================================================================== */
  function initCopy() {
    $$("[data-copy]").forEach(function (b) {
      on(b, "click", function () {
        var text = b.getAttribute("data-copy");
        if (text === "" || text === "self") { var pre = b.closest(".codeblock"); text = pre ? pre.querySelector("code").innerText : ""; }
        function done() { var old = b.getAttribute("data-label"); toast({ type: "success", title: "복사됨", body: text.length > 40 ? text.slice(0, 40) + "…" : text }); }
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, done);
        else done();
      });
    });
  }

  /* ================================================================== */
  /* 20. WIZARD / STEPS nav                                             */
  /* ================================================================== */
  function initWizard() {
    $$("[data-wizard]").forEach(function (wz) {
      var steps = $$(".step", wz.querySelector(".steps") || wz);
      var panels = $$("[data-wizard-panel]", wz);
      var cur = 0;
      function show(i) {
        cur = Math.max(0, Math.min(panels.length - 1, i));
        panels.forEach(function (p, pi) { p.hidden = pi !== cur; });
        steps.forEach(function (s, si) { s.classList.toggle("is-active", si === cur); s.classList.toggle("is-done", si < cur); });
        var pv = $("[data-wizard-prev]", wz), nx = $("[data-wizard-next]", wz);
        if (pv) pv.disabled = cur === 0;
        if (nx) nx.textContent = cur === panels.length - 1 ? "완료 / FINISH" : "다음 / NEXT";
      }
      on($("[data-wizard-prev]", wz), "click", function () { show(cur - 1); });
      on($("[data-wizard-next]", wz), "click", function () { if (cur === panels.length - 1) { toast({ type: "success", title: "설정 완료", body: "온보딩이 완료되었습니다." }); } else show(cur + 1); });
      show(0);
    });
  }

  /* ================================================================== */
  /* 21. GLOBAL KEYBOARD                                                */
  /* ================================================================== */
  function initKeyboard() {
    on(d, "keydown", function (e) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        if (getCmdk()) { e.preventDefault(); var open = getCmdk().getAttribute("data-open") === "true"; if (open) closeCmdk(); else openCmdk(); }
      } else if (e.key === "Escape") {
        if (getCmdk() && getCmdk().getAttribute("data-open") === "true") closeCmdk();
        else if (anyOverlayOpen()) closeAllOverlays();
        else closeAllMenus(null);
      }
    });
  }

  /* ================================================================== */
  /* 22. SCROLL REVEAL                                                  */
  /* ================================================================== */
  function initReveal() {
    if (!("IntersectionObserver" in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in-view"); io.unobserve(en.target); } });
    }, { threshold: 0.12 });
    $$("[data-reveal]").forEach(function (el) { io.observe(el); });
  }

  /* ================================================================== */
  /* BOOT                                                               */
  /* ================================================================== */
  function boot() {
    initTheme(); initGrid(); initTabs(); initAccordion(); initModals(); initDrawers();
    initToasts(); initCmdk(); initMenus(); initCombos(); initInputs(); initDropzones();
    initTables(); initKanban(); initCarousels(); initCalendars(); initRings();
    initSidebar(); initCopy(); initWizard(); initKeyboard(); initReveal();
    root.setAttribute("data-js", "ready");
  }
  if (d.readyState === "loading") on(d, "DOMContentLoaded", boot); else boot();

  /* Public API */
  window.BP = {
    toast: toast,
    openModal: openModal, closeModal: closeModal,
    openDrawer: openDrawer, closeDrawer: closeDrawer,
    openCmdk: openCmdk, closeCmdk: closeCmdk,
    setTheme: applyTheme,
    icons: ICONS
  };
})();
