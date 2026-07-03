/* ============================================================================
   THEME-21 · RISOGRAPH PRINT — app.js
   ----------------------------------------------------------------------------
   One vanilla-JS file powering every interaction across the showcase. No deps,
   no build step — works from a plain file:// double-click. Behaviors are wired
   through data-* attributes so any page that includes this file gets them.

   Exposed API:  window.Riso.toast(opts) · .openModal(id) · .closeTopLayer()
   ============================================================================ */
(function () {
  "use strict";

  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $  = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };
  var FOCUSABLE = 'a[href],button:not([disabled]),textarea:not([disabled]),input:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])';

  /* ---------------------------------------------------------------------- */
  /* THEME (light/dark)                                                     */
  /* ---------------------------------------------------------------------- */
  var Theme = {
    KEY: "riso-theme",
    init: function () {
      var saved;
      try { saved = localStorage.getItem(this.KEY); } catch (e) {}
      if (saved) document.documentElement.setAttribute("data-theme", saved);
      document.addEventListener("click", function (e) {
        var t = e.target.closest("[data-theme-toggle]");
        if (!t) return;
        Theme.toggle();
      });
    },
    toggle: function () {
      var cur = document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
      var next = cur === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      try { localStorage.setItem(this.KEY, next); } catch (e) {}
    }
  };

  /* ---------------------------------------------------------------------- */
  /* OVERLAY STACK (modals, drawers, command) — ESC + focus management      */
  /* ---------------------------------------------------------------------- */
  var layerStack = [];
  var scrim = null;

  function ensureScrim() {
    if (scrim) return scrim;
    scrim = document.createElement("div");
    scrim.className = "scrim";
    scrim.addEventListener("click", function () { closeTopLayer(); });
    document.body.appendChild(scrim);
    return scrim;
  }
  function showScrim() { ensureScrim().classList.add("is-open"); }
  function hideScrim() { if (scrim && !layerStack.length) scrim.classList.remove("is-open"); }

  function trapFocus(container, e) {
    var nodes = $$(FOCUSABLE, container).filter(function (n) { return n.offsetParent !== null; });
    if (!nodes.length) return;
    var first = nodes[0], last = nodes[nodes.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  function openLayer(el, opts) {
    opts = opts || {};
    if (!el || layerStack.indexOf(el) !== -1) return;
    el.__restoreFocus = document.activeElement;
    el.__trapPanel = opts.panel || el;
    el.removeAttribute("hidden");
    document.body.classList.add("no-scroll");
    if (opts.scrim !== false) showScrim();
    // force reflow so transition runs
    void el.offsetWidth;
    el.classList.add("is-open");
    layerStack.push(el);
    var focusTarget = el.querySelector("[data-autofocus]") || el.querySelector(FOCUSABLE);
    if (focusTarget) setTimeout(function () { focusTarget.focus(); }, 30);
  }

  function closeLayer(el) {
    var idx = layerStack.indexOf(el);
    if (idx === -1) return;
    layerStack.splice(idx, 1);
    el.classList.remove("is-open");
    var done = function () {
      if (!el.classList.contains("is-open")) el.setAttribute("hidden", "");
      el.removeEventListener("transitionend", done);
    };
    el.addEventListener("transitionend", done);
    setTimeout(done, 360);
    if (!layerStack.length) { document.body.classList.remove("no-scroll"); hideScrim(); }
    if (el.__restoreFocus && el.__restoreFocus.focus) el.__restoreFocus.focus();
  }

  function closeTopLayer() {
    if (layerStack.length) closeLayer(layerStack[layerStack.length - 1]);
    else closeAllMenus();
  }

  /* ---------------------------------------------------------------------- */
  /* MODAL + DRAWER + COMMAND open/close wiring                             */
  /* ---------------------------------------------------------------------- */
  function initOverlayTriggers() {
    document.addEventListener("click", function (e) {
      var opener = e.target.closest("[data-modal-open],[data-drawer-open],[data-command-open]");
      if (opener) {
        var id = opener.getAttribute("data-modal-open") || opener.getAttribute("data-drawer-open") || opener.getAttribute("data-command-open");
        var el = document.getElementById(id);
        if (el) {
          var panel = el.querySelector(".modal__panel, .drawer, .command__panel") || el;
          openLayer(el, { panel: panel });
          if (el.classList.contains("command")) focusCommand(el);
        }
        return;
      }
      var closer = e.target.closest("[data-modal-close],[data-drawer-close],[data-command-close]");
      if (closer) {
        var host = closer.closest(".modal, .drawer, .command");
        if (host) closeLayer(host);
      }
    });
  }

  /* ---------------------------------------------------------------------- */
  /* COMMAND PALETTE (⌘K / Ctrl+K)                                          */
  /* ---------------------------------------------------------------------- */
  function focusCommand(cmd) {
    var input = cmd.querySelector("input");
    if (input) { input.value = ""; filterCommand(cmd); setTimeout(function(){ input.focus(); }, 40); }
  }
  function filterCommand(cmd) {
    var q = (cmd.querySelector("input").value || "").toLowerCase().trim();
    var items = $$(".command__item", cmd);
    var visible = 0;
    items.forEach(function (it) {
      var txt = it.textContent.toLowerCase();
      var show = !q || txt.indexOf(q) !== -1;
      it.style.display = show ? "" : "none";
      it.classList.remove("is-active");
      if (show) visible++;
    });
    $$(".command__group-label", cmd).forEach(function (g) {
      var group = g.nextElementSibling, any = false;
      while (group && group.classList.contains("command__item")) {
        if (group.style.display !== "none") any = true;
        group = group.nextElementSibling;
      }
      g.style.display = any ? "" : "none";
    });
    var empty = cmd.querySelector(".command__empty");
    if (empty) empty.style.display = visible ? "none" : "";
    var firstVis = items.filter(function (i) { return i.style.display !== "none"; })[0];
    if (firstVis) firstVis.classList.add("is-active");
  }
  function commandNav(cmd, dir) {
    var items = $$(".command__item", cmd).filter(function (i) { return i.style.display !== "none"; });
    if (!items.length) return;
    var idx = items.findIndex(function (i) { return i.classList.contains("is-active"); });
    items.forEach(function (i) { i.classList.remove("is-active"); });
    idx = (idx + dir + items.length) % items.length;
    items[idx].classList.add("is-active");
    items[idx].scrollIntoView({ block: "nearest" });
  }
  function initCommand() {
    document.addEventListener("keydown", function (e) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        var cmd = $(".command");
        if (cmd) {
          e.preventDefault();
          if (layerStack.indexOf(cmd) !== -1) closeLayer(cmd);
          else { openLayer(cmd, { panel: cmd.querySelector(".command__panel") }); focusCommand(cmd); }
        }
      }
    });
    document.addEventListener("input", function (e) {
      var cmd = e.target.closest(".command");
      if (cmd && e.target.matches("input")) filterCommand(cmd);
    });
    document.addEventListener("keydown", function (e) {
      var cmd = e.target.closest(".command");
      if (!cmd) return;
      if (e.key === "ArrowDown") { e.preventDefault(); commandNav(cmd, 1); }
      else if (e.key === "ArrowUp") { e.preventDefault(); commandNav(cmd, -1); }
      else if (e.key === "Enter") {
        var active = cmd.querySelector(".command__item.is-active");
        if (active) { active.click(); }
      }
    });
    document.addEventListener("click", function (e) {
      var item = e.target.closest(".command__item");
      if (item) {
        var cmd = item.closest(".command");
        var label = item.querySelector(".command__item-label");
        Riso.toast({ title: "실행됨", msg: (label ? label.textContent : item.textContent.trim()), variant: "info" });
        if (cmd) closeLayer(cmd);
      }
    });
    document.addEventListener("mousemove", function (e) {
      var item = e.target.closest(".command__item");
      if (!item) return;
      var cmd = item.closest(".command"); if (!cmd) return;
      $$(".command__item", cmd).forEach(function (i) { i.classList.remove("is-active"); });
      item.classList.add("is-active");
    });
  }

  /* ---------------------------------------------------------------------- */
  /* TOASTS                                                                 */
  /* ---------------------------------------------------------------------- */
  var ICONS = {
    success: '<path d="M20 6 9 17l-5-5"/>',
    danger:  '<path d="M12 9v4m0 4h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/>',
    info:    '<circle cx="12" cy="12" r="9"/><path d="M12 8h.01M11 12h1v4h1"/>',
    warning: '<path d="M12 9v4m0 4h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/>'
  };
  function toastRegion() {
    var r = $(".toast-region");
    if (!r) { r = document.createElement("div"); r.className = "toast-region"; r.setAttribute("aria-live", "polite"); r.setAttribute("aria-atomic", "false"); document.body.appendChild(r); }
    return r;
  }
  function toast(opts) {
    opts = opts || {};
    var variant = opts.variant || "info";
    var el = document.createElement("div");
    el.className = "toast toast--" + variant;
    el.setAttribute("role", "status");
    el.innerHTML =
      '<svg class="toast__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (ICONS[variant] || ICONS.info) + '</svg>' +
      '<div class="grow"><div class="toast__title">' + (opts.title || "알림") + '</div>' +
      (opts.msg ? '<div class="toast__msg">' + opts.msg + '</div>' : '') + '</div>' +
      '<button class="toast__close" aria-label="닫기"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg></button>';
    var region = toastRegion();
    region.appendChild(el);
    var remove = function () {
      el.classList.add("is-leaving");
      setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 320);
    };
    el.querySelector(".toast__close").addEventListener("click", remove);
    if (opts.duration !== 0) setTimeout(remove, opts.duration || 4000);
    return el;
  }
  function initToastTriggers() {
    document.addEventListener("click", function (e) {
      var t = e.target.closest("[data-toast]");
      if (!t) return;
      toast({
        title: t.getAttribute("data-toast-title") || "저장됨",
        msg: t.getAttribute("data-toast") || "",
        variant: t.getAttribute("data-toast-variant") || "success"
      });
    });
  }

  /* ---------------------------------------------------------------------- */
  /* TABS                                                                   */
  /* ---------------------------------------------------------------------- */
  function initTabs() {
    $$("[data-tabs]").forEach(function (group) {
      var tabs = $$('[role="tab"]', group);
      function select(tab) {
        tabs.forEach(function (t) {
          var sel = t === tab;
          t.setAttribute("aria-selected", sel ? "true" : "false");
          t.tabIndex = sel ? 0 : -1;
          var panel = document.getElementById(t.getAttribute("aria-controls"));
          if (panel) panel.hidden = !sel;
        });
      }
      tabs.forEach(function (tab, i) {
        tab.addEventListener("click", function () { select(tab); });
        tab.addEventListener("keydown", function (e) {
          var dir = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
          if (!dir) return;
          e.preventDefault();
          var ni = (i + dir + tabs.length) % tabs.length;
          tabs[ni].focus(); select(tabs[ni]);
        });
      });
    });
  }

  /* ---------------------------------------------------------------------- */
  /* ACCORDION                                                              */
  /* ---------------------------------------------------------------------- */
  function initAccordion() {
    document.addEventListener("click", function (e) {
      var trig = e.target.closest(".accordion__trigger");
      if (!trig) return;
      var open = trig.getAttribute("aria-expanded") === "true";
      var panel = document.getElementById(trig.getAttribute("aria-controls"));
      var single = trig.closest("[data-accordion-single]");
      if (single && !open) {
        $$(".accordion__trigger", single).forEach(function (t) {
          t.setAttribute("aria-expanded", "false");
          var p = document.getElementById(t.getAttribute("aria-controls"));
          if (p) p.setAttribute("data-open", "false");
        });
      }
      trig.setAttribute("aria-expanded", open ? "false" : "true");
      if (panel) panel.setAttribute("data-open", open ? "false" : "true");
    });
  }

  /* ---------------------------------------------------------------------- */
  /* MENUS / DROPDOWNS                                                      */
  /* ---------------------------------------------------------------------- */
  function closeAllMenus() { $$(".menu.is-open").forEach(function (m) { m.classList.remove("is-open"); var b = m.querySelector("[aria-expanded]"); if (b) b.setAttribute("aria-expanded", "false"); }); }
  function initMenus() {
    document.addEventListener("click", function (e) {
      var trigger = e.target.closest("[data-menu-trigger]");
      if (trigger) {
        var menu = trigger.closest(".menu");
        var isOpen = menu.classList.contains("is-open");
        closeAllMenus();
        if (!isOpen) { menu.classList.add("is-open"); trigger.setAttribute("aria-expanded", "true"); }
        return;
      }
      if (!e.target.closest(".menu__panel")) closeAllMenus();
      var item = e.target.closest(".menu__item");
      if (item && !item.hasAttribute("data-keep-open")) closeAllMenus();
    });
  }

  /* ---------------------------------------------------------------------- */
  /* CONTEXT MENU                                                           */
  /* ---------------------------------------------------------------------- */
  function initContextMenu() {
    var menu = $("[data-contextmenu]");
    if (!menu) return;
    $$("[data-context-target]").forEach(function (area) {
      area.addEventListener("contextmenu", function (e) {
        e.preventDefault();
        menu.hidden = false;
        var mw = menu.offsetWidth, mh = menu.offsetHeight;
        menu.style.left = Math.min(e.clientX, window.innerWidth - mw - 8) + "px";
        menu.style.top = Math.min(e.clientY, window.innerHeight - mh - 8) + "px";
      });
    });
    document.addEventListener("click", function () { menu.hidden = true; });
    document.addEventListener("scroll", function () { menu.hidden = true; }, true);
  }

  /* ---------------------------------------------------------------------- */
  /* TABLE — sort, select-all, row select                                  */
  /* ---------------------------------------------------------------------- */
  function initTables() {
    $$("[data-table]").forEach(function (table) {
      // sorting
      $$("th.is-sortable", table).forEach(function (th) {
        th.addEventListener("click", function () { sortTable(table, th); });
        th.tabIndex = 0;
        th.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); sortTable(table, th); } });
      });
      // select all
      var selAll = table.querySelector("[data-select-all]");
      if (selAll) {
        selAll.addEventListener("change", function () {
          $$("tbody [data-row-select]", table).forEach(function (cb) {
            cb.checked = selAll.checked;
            cb.closest("tr").setAttribute("aria-selected", selAll.checked ? "true" : "false");
          });
        });
      }
      table.addEventListener("change", function (e) {
        if (e.target.matches("[data-row-select]")) {
          e.target.closest("tr").setAttribute("aria-selected", e.target.checked ? "true" : "false");
          if (selAll) {
            var all = $$("tbody [data-row-select]", table);
            selAll.checked = all.every(function (c) { return c.checked; });
            selAll.indeterminate = !selAll.checked && all.some(function (c) { return c.checked; });
          }
        }
      });
    });
  }
  function sortTable(table, th) {
    var tbody = table.querySelector("tbody");
    var idx = Array.prototype.indexOf.call(th.parentNode.children, th);
    var cur = th.getAttribute("aria-sort");
    var dir = cur === "ascending" ? "descending" : "ascending";
    $$("th", table).forEach(function (h) { h.removeAttribute("aria-sort"); });
    th.setAttribute("aria-sort", dir);
    var rows = $$("tbody tr", table);
    var numeric = th.hasAttribute("data-sort-number");
    rows.sort(function (a, b) {
      var av = a.children[idx].getAttribute("data-sort") || a.children[idx].textContent.trim();
      var bv = b.children[idx].getAttribute("data-sort") || b.children[idx].textContent.trim();
      if (numeric) { av = parseFloat(av.replace(/[^0-9.\-]/g, "")) || 0; bv = parseFloat(bv.replace(/[^0-9.\-]/g, "")) || 0; }
      var r = numeric ? av - bv : av.localeCompare(bv);
      return dir === "ascending" ? r : -r;
    });
    rows.forEach(function (r) { tbody.appendChild(r); });
  }

  /* ---------------------------------------------------------------------- */
  /* SIDEBAR collapse + mobile                                              */
  /* ---------------------------------------------------------------------- */
  function initSidebar() {
    document.addEventListener("click", function (e) {
      var t = e.target.closest("[data-sidebar-toggle]");
      if (t) {
        var sb = $(".sidebar");
        if (!sb) return;
        if (window.matchMedia("(max-width: 820px)").matches) sb.classList.toggle("is-mobile-open");
        else sb.classList.toggle("is-collapsed");
      }
    });
  }

  /* ---------------------------------------------------------------------- */
  /* CAROUSEL                                                               */
  /* ---------------------------------------------------------------------- */
  function initCarousels() {
    $$("[data-carousel]").forEach(function (car) {
      var track = car.querySelector(".carousel__track");
      var slides = $$(".carousel__slide", track);
      var dots = car.querySelector(".carousel__dots");
      if (dots) {
        slides.forEach(function (s, i) {
          var d = document.createElement("button");
          d.className = "carousel__dot"; d.setAttribute("aria-label", "슬라이드 " + (i + 1));
          if (i === 0) d.setAttribute("aria-current", "true");
          d.addEventListener("click", function () { slides[i].scrollIntoView({ block: "nearest", inline: "start", behavior: prefersReduced ? "auto" : "smooth" }); });
          dots.appendChild(d);
        });
      }
      function update() {
        var i = Math.round(track.scrollLeft / (slides[0].offsetWidth + 16));
        if (dots) $$(".carousel__dot", dots).forEach(function (d, di) { d.toggleAttribute("aria-current", di === i); });
      }
      track.addEventListener("scroll", function () { window.requestAnimationFrame(update); });
      var prev = car.querySelector(".carousel__btn--prev"), next = car.querySelector(".carousel__btn--next");
      var step = function (dir) { track.scrollBy({ left: dir * (slides[0].offsetWidth + 16), behavior: prefersReduced ? "auto" : "smooth" }); };
      if (prev) prev.addEventListener("click", function () { step(-1); });
      if (next) next.addEventListener("click", function () { step(1); });
    });
  }

  /* ---------------------------------------------------------------------- */
  /* RATING                                                                 */
  /* ---------------------------------------------------------------------- */
  function initRatings() {
    $$("[data-rating]").forEach(function (r) {
      var stars = $$(".rating__star", r);
      var input = r.querySelector("input[type=hidden]");
      function paint(n) { stars.forEach(function (s, i) { s.classList.toggle("is-on", i < n); }); }
      stars.forEach(function (s, i) {
        s.parentNode.addEventListener("mouseenter", function () { paint(i + 1); });
        s.parentNode.addEventListener("click", function () { r.setAttribute("data-value", i + 1); if (input) input.value = i + 1; });
        s.parentNode.addEventListener("focus", function () { paint(i + 1); });
      });
      r.addEventListener("mouseleave", function () { paint(parseInt(r.getAttribute("data-value") || "0", 10)); });
      paint(parseInt(r.getAttribute("data-value") || "0", 10));
    });
  }

  /* ---------------------------------------------------------------------- */
  /* STEPPER                                                                */
  /* ---------------------------------------------------------------------- */
  function initSteppers() {
    $$("[data-stepper]").forEach(function (s) {
      var input = s.querySelector(".stepper__input");
      var min = input.min !== "" ? parseFloat(input.min) : -Infinity;
      var max = input.max !== "" ? parseFloat(input.max) : Infinity;
      s.querySelectorAll(".stepper__btn").forEach(function (b) {
        b.addEventListener("click", function () {
          var step = parseFloat(b.getAttribute("data-step")) || 1;
          var v = (parseFloat(input.value) || 0) + step;
          input.value = Math.max(min, Math.min(max, v));
          input.dispatchEvent(new Event("change", { bubbles: true }));
        });
      });
    });
  }

  /* ---------------------------------------------------------------------- */
  /* SLIDER value output                                                    */
  /* ---------------------------------------------------------------------- */
  function initSliders() {
    $$("[data-slider-output]").forEach(function (slider) {
      var out = document.getElementById(slider.getAttribute("data-slider-output"));
      var sync = function () { if (out) out.textContent = slider.value + (slider.getAttribute("data-suffix") || ""); };
      slider.addEventListener("input", sync); sync();
    });
  }

  /* ---------------------------------------------------------------------- */
  /* CHIP INPUT                                                             */
  /* ---------------------------------------------------------------------- */
  function chipEl(text) {
    var c = document.createElement("span");
    c.className = "chip";
    c.innerHTML = '<span>' + text + '</span><button type="button" aria-label="' + text + ' 제거"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg></button>';
    c.querySelector("button").addEventListener("click", function () { c.remove(); });
    return c;
  }
  function initChipInputs() {
    $$("[data-chip-input]").forEach(function (wrap) {
      var input = wrap.querySelector("input");
      input.addEventListener("keydown", function (e) {
        if ((e.key === "Enter" || e.key === ",") && input.value.trim()) {
          e.preventDefault();
          wrap.insertBefore(chipEl(input.value.trim()), input);
          input.value = "";
        } else if (e.key === "Backspace" && !input.value) {
          var chips = $$(".chip", wrap);
          if (chips.length) chips[chips.length - 1].remove();
        }
      });
    });
  }

  /* ---------------------------------------------------------------------- */
  /* COMBOBOX / AUTOCOMPLETE                                                */
  /* ---------------------------------------------------------------------- */
  function initComboboxes() {
    $$("[data-combobox]").forEach(function (combo) {
      var input = combo.querySelector("input");
      var panel = combo.querySelector(".combo__panel");
      var options = $$(".combo__option", panel);
      function open() { panel.hidden = false; }
      function close() { panel.hidden = true; options.forEach(function (o) { o.classList.remove("is-active"); }); }
      function filter() {
        var q = input.value.toLowerCase();
        var any = false;
        options.forEach(function (o) {
          var txt = o.getAttribute("data-value") || o.textContent;
          var show = txt.toLowerCase().indexOf(q) !== -1;
          o.style.display = show ? "" : "none"; if (show) any = true;
        });
        open();
      }
      input.addEventListener("input", filter);
      input.addEventListener("focus", open);
      options.forEach(function (o) {
        o.addEventListener("click", function () {
          input.value = o.getAttribute("data-value") || o.textContent.trim();
          options.forEach(function (x) { x.setAttribute("aria-selected", "false"); });
          o.setAttribute("aria-selected", "true");
          close();
        });
      });
      document.addEventListener("click", function (e) { if (!combo.contains(e.target)) close(); });
      input.addEventListener("keydown", function (e) {
        var vis = options.filter(function (o) { return o.style.display !== "none"; });
        var idx = vis.findIndex(function (o) { return o.classList.contains("is-active"); });
        if (e.key === "ArrowDown") { e.preventDefault(); open(); vis.forEach(function (o){o.classList.remove("is-active");}); idx = Math.min(idx + 1, vis.length - 1); if (vis[idx]) vis[idx].classList.add("is-active"); }
        else if (e.key === "ArrowUp") { e.preventDefault(); vis.forEach(function (o){o.classList.remove("is-active");}); idx = Math.max(idx - 1, 0); if (vis[idx]) vis[idx].classList.add("is-active"); }
        else if (e.key === "Enter") { var a = vis[idx] || vis[0]; if (a) { e.preventDefault(); a.click(); } }
        else if (e.key === "Escape") { close(); }
      });
    });
  }

  /* ---------------------------------------------------------------------- */
  /* MULTISELECT                                                            */
  /* ---------------------------------------------------------------------- */
  function initMultiSelects() {
    $$("[data-multiselect]").forEach(function (ms) {
      var field = ms.querySelector(".multiselect");
      var input = field.querySelector("input");
      var panel = ms.querySelector(".multiselect__panel");
      var options = $$(".combo__option", panel);
      function place(label, val) {
        if (field.querySelector('[data-val="' + val + '"]')) return;
        var chip = chipEl(label); chip.setAttribute("data-val", val);
        chip.querySelector("button").addEventListener("click", function () {
          var opt = panel.querySelector('[data-value="' + val + '"]'); if (opt) opt.setAttribute("aria-selected", "false");
        });
        field.insertBefore(chip, input);
      }
      options.forEach(function (o) {
        o.addEventListener("click", function () {
          var sel = o.getAttribute("aria-selected") === "true";
          o.setAttribute("aria-selected", sel ? "false" : "true");
          var val = o.getAttribute("data-value") || o.textContent.trim();
          if (sel) { var c = field.querySelector('[data-val="' + val + '"]'); if (c) c.remove(); }
          else place(o.textContent.trim(), val);
        });
      });
      input.addEventListener("focus", function () { panel.hidden = false; });
      input.addEventListener("input", function () {
        var q = input.value.toLowerCase();
        options.forEach(function (o) { o.style.display = o.textContent.toLowerCase().indexOf(q) !== -1 ? "" : "none"; });
      });
      document.addEventListener("click", function (e) { if (!ms.contains(e.target)) panel.hidden = true; });
    });
  }

  /* ---------------------------------------------------------------------- */
  /* DATEPICKER                                                             */
  /* ---------------------------------------------------------------------- */
  function initDatePickers() {
    $$("[data-datepicker]").forEach(function (dp) {
      var input = dp.querySelector("input");
      var panel = dp.querySelector(".datepicker__panel");
      var view = new Date();
      var selected = null;
      var MONTHS = ["1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월"];
      function render() {
        var y = view.getFullYear(), m = view.getMonth();
        var first = new Date(y, m, 1).getDay();
        var days = new Date(y, m + 1, 0).getDate();
        var html = '<div class="datepicker__head"><button type="button" class="icon-btn" data-prev aria-label="이전 달"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M15 18 9 12l6-6"/></svg></button>';
        html += '<span class="datepicker__title">' + y + ' ' + MONTHS[m] + '</span>';
        html += '<button type="button" class="icon-btn" data-next aria-label="다음 달"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="m9 18 6-6-6-6"/></svg></button></div>';
        html += '<div class="datepicker__grid">';
        ["일","월","화","수","목","금","토"].forEach(function (d) { html += '<div class="datepicker__dow">' + d + '</div>'; });
        for (var i = 0; i < first; i++) html += '<div></div>';
        var today = new Date();
        for (var d = 1; d <= days; d++) {
          var cls = "datepicker__day";
          if (d === today.getDate() && m === today.getMonth() && y === today.getFullYear()) cls += " is-today";
          if (selected && d === selected.getDate() && m === selected.getMonth() && y === selected.getFullYear()) cls += " is-selected";
          html += '<button type="button" class="' + cls + '" data-day="' + d + '">' + d + '</button>';
        }
        html += '</div>';
        panel.innerHTML = html;
      }
      input.addEventListener("focus", function () { panel.hidden = false; render(); });
      panel.addEventListener("click", function (e) {
        if (e.target.closest("[data-prev]")) { view.setMonth(view.getMonth() - 1); render(); }
        else if (e.target.closest("[data-next]")) { view.setMonth(view.getMonth() + 1); render(); }
        else {
          var day = e.target.closest("[data-day]");
          if (day) {
            selected = new Date(view.getFullYear(), view.getMonth(), parseInt(day.getAttribute("data-day"), 10));
            input.value = selected.getFullYear() + "-" + String(selected.getMonth() + 1).padStart(2, "0") + "-" + String(selected.getDate()).padStart(2, "0");
            panel.hidden = true;
          }
        }
      });
      document.addEventListener("click", function (e) { if (!dp.contains(e.target)) panel.hidden = true; });
    });
  }

  /* ---------------------------------------------------------------------- */
  /* FILE UPLOAD (dropzone)                                                 */
  /* ---------------------------------------------------------------------- */
  function initDropzones() {
    $$("[data-dropzone]").forEach(function (dz) {
      var input = dz.querySelector('input[type="file"]');
      var list = document.getElementById(dz.getAttribute("data-file-list"));
      dz.addEventListener("click", function () { input.click(); });
      dz.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); input.click(); } });
      ["dragover", "dragenter"].forEach(function (ev) { dz.addEventListener(ev, function (e) { e.preventDefault(); dz.classList.add("is-drag"); }); });
      ["dragleave", "drop"].forEach(function (ev) { dz.addEventListener(ev, function (e) { e.preventDefault(); dz.classList.remove("is-drag"); }); });
      dz.addEventListener("drop", function (e) { addFiles(e.dataTransfer.files); });
      input.addEventListener("change", function () { addFiles(input.files); });
      function addFiles(files) {
        if (!list) return;
        Array.prototype.forEach.call(files, function (f) {
          var row = document.createElement("div");
          row.className = "file-row";
          row.innerHTML = '<div class="file-row__thumb"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg></div>' +
            '<div class="grow"><div style="font-weight:600">' + f.name + '</div><div class="list__meta">' + (f.size / 1024).toFixed(1) + ' KB</div></div>' +
            '<button class="icon-btn" aria-label="제거"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg></button>';
          row.querySelector("button").addEventListener("click", function () { row.remove(); });
          list.appendChild(row);
        });
      }
    });
  }

  /* ---------------------------------------------------------------------- */
  /* SEGMENTED CONTROL + generic aria-pressed toggles + pricing toggle      */
  /* ---------------------------------------------------------------------- */
  function initSegmented() {
    document.addEventListener("click", function (e) {
      var btn = e.target.closest(".segmented__btn, [data-toggle-group] [data-toggle-btn]");
      if (!btn) return;
      var group = btn.closest(".segmented, [data-toggle-group]");
      $$('[aria-pressed]', group).forEach(function (b) { b.setAttribute("aria-pressed", "false"); });
      btn.setAttribute("aria-pressed", "true");
      // pricing month/annual hook
      var mode = btn.getAttribute("data-price-mode");
      if (mode) {
        $$("[data-price-monthly]").forEach(function (p) { p.hidden = mode !== "monthly"; });
        $$("[data-price-annual]").forEach(function (p) { p.hidden = mode !== "annual"; });
      }
    });
  }

  /* ---------------------------------------------------------------------- */
  /* SEARCHBAR clear                                                        */
  /* ---------------------------------------------------------------------- */
  function initSearchClear() {
    $$(".searchbar").forEach(function (sb) {
      var input = sb.querySelector("input"), clear = sb.querySelector(".searchbar__clear");
      if (!clear) return;
      var sync = function () { clear.style.display = input.value ? "grid" : "none"; };
      input.addEventListener("input", sync);
      clear.addEventListener("click", function () { input.value = ""; sync(); input.focus(); });
      sync();
    });
  }

  /* ---------------------------------------------------------------------- */
  /* COPY TO CLIPBOARD                                                      */
  /* ---------------------------------------------------------------------- */
  function initCopy() {
    document.addEventListener("click", function (e) {
      var t = e.target.closest("[data-copy]");
      if (!t) return;
      var text = t.getAttribute("data-copy");
      if (text === "" ) { var tgt = document.getElementById(t.getAttribute("data-copy-target")); text = tgt ? tgt.textContent : ""; }
      var done = function () { toast({ title: "복사됨", msg: text.length > 40 ? text.slice(0, 40) + "…" : text, variant: "success" }); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, done);
      else done();
    });
  }

  /* ---------------------------------------------------------------------- */
  /* WIZARD (Steps next/prev)                                               */
  /* ---------------------------------------------------------------------- */
  function initWizard() {
    $$("[data-wizard]").forEach(function (wz) {
      var steps = $$(".steps__step", wz);
      var panels = $$("[data-wizard-panel]", wz);
      var cur = 0;
      function show() {
        steps.forEach(function (s, i) {
          s.classList.toggle("is-active", i === cur);
          s.classList.toggle("is-done", i < cur);
        });
        panels.forEach(function (p, i) { p.hidden = i !== cur; });
        var prevBtn = wz.querySelector("[data-wizard-prev]");
        var nextBtn = wz.querySelector("[data-wizard-next]");
        if (prevBtn) prevBtn.disabled = cur === 0;
        if (nextBtn) nextBtn.textContent = cur === panels.length - 1 ? "완료" : "다음 →";
      }
      wz.addEventListener("click", function (e) {
        if (e.target.closest("[data-wizard-next]")) {
          if (cur < panels.length - 1) { cur++; show(); }
          else { toast({ title: "온보딩 완료!", msg: "환영합니다 — 모든 단계를 마쳤습니다.", variant: "success" }); }
        } else if (e.target.closest("[data-wizard-prev]")) { if (cur > 0) { cur--; show(); } }
      });
      show();
    });
  }

  /* ---------------------------------------------------------------------- */
  /* MISREGISTER signature effect — random ink slip on tagged elements      */
  /* ---------------------------------------------------------------------- */
  function initMisregister() {
    if (prefersReduced) return;
    // intermittent ink-slip on hero titles
    $$("[data-misregister-auto]").forEach(function (el) {
      var jitter = function () {
        el.classList.add("is-slipped");
        setTimeout(function () { el.classList.remove("is-slipped"); }, 220);
      };
      el.addEventListener("mouseenter", jitter);
    });
    // a "bad press run" button: re-slips the whole hero
    document.addEventListener("click", function (e) {
      var t = e.target.closest("[data-reprint]");
      if (!t) return;
      var target = document.querySelector(t.getAttribute("data-reprint")) || document.body;
      target.classList.add("reprint-flash");
      setTimeout(function () { target.classList.remove("reprint-flash"); }, 600);
      toast({ title: "다시 인쇄", msg: "정합을 어긋나게 다시 찍었습니다.", variant: "info" });
    });
  }

  /* ---------------------------------------------------------------------- */
  /* GLOBAL KEYS                                                            */
  /* ---------------------------------------------------------------------- */
  function initGlobalKeys() {
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") { if (layerStack.length) { e.preventDefault(); closeTopLayer(); } else closeAllMenus(); }
      if (e.key === "Tab" && layerStack.length) {
        var top = layerStack[layerStack.length - 1];
        trapFocus(top.__trapPanel || top, e);
      }
    });
  }

  /* ---------------------------------------------------------------------- */
  /* STAGGERED PAGE-LOAD REVEAL                                             */
  /* ---------------------------------------------------------------------- */
  function initReveal() {
    if (prefersReduced || !("IntersectionObserver" in window)) {
      $$("[data-reveal]").forEach(function (el) { el.classList.add("is-in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); } });
    }, { threshold: 0.12 });
    $$("[data-reveal]").forEach(function (el) { io.observe(el); });
  }

  /* ---------------------------------------------------------------------- */
  /* INIT                                                                   */
  /* ---------------------------------------------------------------------- */
  function init() {
    Theme.init();
    initOverlayTriggers();
    initCommand();
    initToastTriggers();
    initTabs();
    initAccordion();
    initMenus();
    initContextMenu();
    initTables();
    initSidebar();
    initCarousels();
    initRatings();
    initSteppers();
    initSliders();
    initChipInputs();
    initComboboxes();
    initMultiSelects();
    initDatePickers();
    initDropzones();
    initSegmented();
    initSearchClear();
    initCopy();
    initWizard();
    initMisregister();
    initGlobalKeys();
    initReveal();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();

  window.Riso = {
    toast: toast,
    openModal: function (id) { var el = document.getElementById(id); if (el) openLayer(el, { panel: el.querySelector(".modal__panel, .drawer, .command__panel") || el }); },
    closeTopLayer: closeTopLayer,
    toggleTheme: function () { Theme.toggle(); }
  };
})();
