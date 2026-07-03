/* ============================================================================
   THEME-01 · NEO-BRUTALISM — app.js
   Zero-dependency vanilla JS. Auto-inits on DOMContentLoaded.
   Works from file:// (no modules, no fetch). Uses event delegation so
   dynamically-rendered nodes keep working.
   ----------------------------------------------------------------------------
   DATA-ATTRIBUTE API (the interaction contract shared by every page):
     Theme    [data-theme-toggle]
     Tabs     [data-tabs] > [role=tablist] [role=tab][data-tab=ID] ; [data-tab-panel=ID]
     Accordion[data-accordion] [data-accordion-trigger] [data-accordion-panel]
     Modal    [data-modal-open=ID]  <dialogish [data-modal=ID]> [data-modal-close]
     Drawer   [data-drawer-open=ID]  [data-drawer=ID data-side=left|right] [data-drawer-close]
     Toast    [data-toast] (reads data-title/data-message/data-variant) | window.NB.toast(opts)
     Dropdown [data-dropdown] [data-dropdown-trigger] [data-dropdown-menu]
     Menu item[data-menu-item]  ContextMenu [data-context-menu=ID] target [data-context-target=ID]
     Command  ⌘K / Ctrl-K  [data-command-palette] [data-command-item]
     Popover  [data-popover-trigger=ID] [data-popover=ID]
     Stepper  [data-stepper] [data-step=-1|1] input
     Slider   input[type=range][data-slider] -> [data-slider-output]
     Rating   [data-rating data-value=N]
     Chips    [data-chip-input] input
     File     [data-file-drop] input[type=file]
     Table    th[data-sort]  [data-select-all]  rows with .row-check
     Kanban   [data-kanban] [data-kanban-col] [draggable=true].kanban-card
     Carousel [data-carousel] [data-carousel-track] [data-carousel-prev/next] [data-carousel-dots]
     Sidebar  [data-sidebar-toggle] -> [data-sidebar]
     Combobox [data-combobox] input [data-combobox-option] (data-multi for chips)
     Wizard   [data-wizard] [data-wizard-step] [data-wizard-next/prev/goto]
     Copy     [data-copy] (copies textContent of [data-copy-target] or previous <pre>)
     Password [data-toggle-password] -> sibling input
     Counter  [data-countup data-to=N]
   ============================================================================ */
(function () {
  "use strict";

  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ===================== THEME TOGGLE ===================== */
  function initTheme() {
    var root = document.documentElement;
    var stored = null;
    try { stored = localStorage.getItem("nb-theme"); } catch (e) {}
    var initial = stored || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    root.setAttribute("data-theme", initial);
    syncThemeButtons(initial);

    document.addEventListener("click", function (e) {
      var t = e.target.closest("[data-theme-toggle]");
      if (!t) return;
      var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("nb-theme", next); } catch (e2) {}
      syncThemeButtons(next);
    });
  }
  function syncThemeButtons(theme) {
    $$("[data-theme-toggle]").forEach(function (b) {
      b.setAttribute("aria-pressed", String(theme === "dark"));
      var label = b.querySelector("[data-theme-label]");
      if (label) label.textContent = theme === "dark" ? "Dark" : "Light";
    });
  }

  /* ===================== TABS ===================== */
  function initTabs() {
    $$("[data-tabs]").forEach(function (group) {
      var tabs = $$('[role="tab"]', group);
      function activate(tab) {
        var id = tab.getAttribute("data-tab");
        tabs.forEach(function (t) {
          var on = t === tab;
          t.setAttribute("aria-selected", String(on));
          t.tabIndex = on ? 0 : -1;
          t.classList.toggle("is-active", on);
        });
        $$("[data-tab-panel]", group).forEach(function (p) {
          p.hidden = p.getAttribute("data-tab-panel") !== id;
        });
      }
      tabs.forEach(function (tab, i) {
        tab.addEventListener("click", function () { activate(tab); });
        tab.addEventListener("keydown", function (e) {
          var idx = i;
          if (e.key === "ArrowRight" || e.key === "ArrowDown") idx = (i + 1) % tabs.length;
          else if (e.key === "ArrowLeft" || e.key === "ArrowUp") idx = (i - 1 + tabs.length) % tabs.length;
          else if (e.key === "Home") idx = 0;
          else if (e.key === "End") idx = tabs.length - 1;
          else return;
          e.preventDefault();
          tabs[idx].focus();
          activate(tabs[idx]);
        });
      });
    });
  }

  /* ===================== ACCORDION ===================== */
  function initAccordion() {
    document.addEventListener("click", function (e) {
      var trg = e.target.closest("[data-accordion-trigger]");
      if (!trg) return;
      var item = trg.closest("[data-accordion-item]") || trg.parentElement;
      var panel = item.querySelector("[data-accordion-panel]");
      var open = trg.getAttribute("aria-expanded") === "true";
      var root = trg.closest("[data-accordion]");
      if (root && root.hasAttribute("data-accordion-single") && !open) {
        $$("[data-accordion-trigger]", root).forEach(function (o) {
          o.setAttribute("aria-expanded", "false");
          var p = (o.closest("[data-accordion-item]") || o.parentElement).querySelector("[data-accordion-panel]");
          if (p) p.hidden = true;
        });
      }
      trg.setAttribute("aria-expanded", String(!open));
      if (panel) panel.hidden = open;
    });
  }

  /* ===================== OVERLAYS (Modal + Drawer) ===================== */
  var lastFocused = null;
  function getFocusable(node) {
    return $$('a[href],button:not(:disabled),textarea,input,select,[tabindex]:not([tabindex="-1"])', node)
      .filter(function (el) { return el.offsetParent !== null || el === document.activeElement; });
  }
  function openOverlay(el) {
    if (!el || el.classList.contains("is-open")) return;
    lastFocused = document.activeElement;
    el.classList.add("is-open");
    el.removeAttribute("hidden");
    el.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    var f = getFocusable(el)[0];
    if (f) f.focus();
  }
  function closeOverlay(el) {
    if (!el || !el.classList.contains("is-open")) return;
    el.classList.remove("is-open");
    el.setAttribute("aria-hidden", "true");
    setTimeout(function () { if (!el.classList.contains("is-open")) el.setAttribute("hidden", ""); }, prefersReduced ? 0 : 200);
    if (!$(".is-open[data-modal], .is-open[data-drawer]")) document.body.style.overflow = "";
    if (lastFocused && lastFocused.focus) lastFocused.focus();
  }
  function initOverlays() {
    document.addEventListener("click", function (e) {
      var mo = e.target.closest("[data-modal-open]");
      if (mo) { openOverlay($('[data-modal="' + mo.getAttribute("data-modal-open") + '"]')); return; }
      var do_ = e.target.closest("[data-drawer-open]");
      if (do_) { openOverlay($('[data-drawer="' + do_.getAttribute("data-drawer-open") + '"]')); return; }
      var mc = e.target.closest("[data-modal-close],[data-drawer-close]");
      if (mc) { closeOverlay(mc.closest("[data-modal],[data-drawer]")); return; }
      // click on backdrop
      if (e.target.matches("[data-modal].is-open, [data-drawer].is-open")) closeOverlay(e.target);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key !== "Escape") return;
      var open = $(".is-open[data-modal], .is-open[data-drawer]");
      if (open) closeOverlay(open);
    });
    // focus trap
    document.addEventListener("keydown", function (e) {
      if (e.key !== "Tab") return;
      var open = $(".is-open[data-modal], .is-open[data-drawer]");
      if (!open) return;
      var f = getFocusable(open);
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  }

  /* ===================== TOAST ===================== */
  function ensureToastHost() {
    var host = $("[data-toast-host]");
    if (!host) {
      host = document.createElement("div");
      host.setAttribute("data-toast-host", "");
      host.className = "toast-host";
      host.setAttribute("aria-live", "polite");
      host.setAttribute("role", "status");
      document.body.appendChild(host);
    }
    return host;
  }
  function showToast(opts) {
    opts = opts || {};
    var host = ensureToastHost();
    var el = document.createElement("div");
    el.className = "toast toast--" + (opts.variant || "default");
    el.setAttribute("role", "alert");
    el.innerHTML =
      '<span class="toast__icon" aria-hidden="true">' + (icons[opts.variant] || icons.info) + '</span>' +
      '<div class="toast__body">' +
        (opts.title ? '<div class="toast__title">' + esc(opts.title) + "</div>" : "") +
        (opts.message ? '<div class="toast__msg">' + esc(opts.message) + "</div>" : "") +
      "</div>" +
      '<button class="toast__close" aria-label="Dismiss">&times;</button>';
    host.appendChild(el);
    requestAnimationFrame(function () { el.classList.add("is-in"); });
    var timer = setTimeout(remove, opts.duration || 4200);
    function remove() {
      clearTimeout(timer);
      el.classList.remove("is-in");
      el.classList.add("is-out");
      setTimeout(function () { el.remove(); }, prefersReduced ? 0 : 220);
    }
    el.querySelector(".toast__close").addEventListener("click", remove);
    return remove;
  }
  function initToast() {
    document.addEventListener("click", function (e) {
      var t = e.target.closest("[data-toast]");
      if (!t) return;
      showToast({
        title: t.getAttribute("data-title") || "Notification",
        message: t.getAttribute("data-message") || "",
        variant: t.getAttribute("data-variant") || "default"
      });
    });
  }

  /* ===================== DROPDOWN / MENU / POPOVER ===================== */
  function closeAllPopups(except) {
    $$("[data-dropdown].is-open, [data-popover].is-open").forEach(function (d) {
      if (d !== except) d.classList.remove("is-open");
    });
    $$("[data-dropdown-trigger][aria-expanded='true']").forEach(function (t) {
      if (!except || !except.contains(t)) t.setAttribute("aria-expanded", "false");
    });
  }
  function initDropdown() {
    document.addEventListener("click", function (e) {
      var trg = e.target.closest("[data-dropdown-trigger]");
      if (trg) {
        var dd = trg.closest("[data-dropdown]");
        var open = dd.classList.contains("is-open");
        closeAllPopups(dd);
        dd.classList.toggle("is-open", !open);
        trg.setAttribute("aria-expanded", String(!open));
        e.stopPropagation();
        return;
      }
      var ptrg = e.target.closest("[data-popover-trigger]");
      if (ptrg) {
        var pop = $('[data-popover="' + ptrg.getAttribute("data-popover-trigger") + '"]');
        if (pop) { var po = pop.classList.contains("is-open"); closeAllPopups(); pop.classList.toggle("is-open", !po); ptrg.setAttribute("aria-expanded", String(!po)); }
        e.stopPropagation();
        return;
      }
      // selecting a menu item closes the menu
      var item = e.target.closest("[data-menu-item]");
      if (item) {
        var label = item.textContent.trim();
        if (item.hasAttribute("data-menu-toast")) showToast({ title: "Selected", message: label, variant: "info" });
      }
      if (!e.target.closest("[data-popover]")) closeAllPopups();
    });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeAllPopups(); });
  }

  /* ===================== CONTEXT MENU ===================== */
  function initContextMenu() {
    $$("[data-context-target]").forEach(function (target) {
      var menu = $('[data-context-menu="' + target.getAttribute("data-context-target") + '"]');
      if (!menu) return;
      target.addEventListener("contextmenu", function (e) {
        e.preventDefault();
        closeAllPopups();
        menu.classList.add("is-open");
        var mw = menu.offsetWidth, mh = menu.offsetHeight;
        var x = Math.min(e.clientX, window.innerWidth - mw - 8);
        var y = Math.min(e.clientY, window.innerHeight - mh - 8);
        menu.style.left = x + "px";
        menu.style.top = y + "px";
      });
    });
    document.addEventListener("click", function () {
      $$("[data-context-menu].is-open").forEach(function (m) { m.classList.remove("is-open"); });
    });
  }

  /* ===================== COMMAND PALETTE (⌘K) ===================== */
  function initCommandPalette() {
    var palette = $("[data-command-palette]");
    if (!palette) return;
    var input = $("[data-command-input]", palette);
    var items = $$("[data-command-item]", palette);
    var empty = $("[data-command-empty]", palette);

    function open() {
      openOverlay(palette);
      if (input) { input.value = ""; filter(""); setTimeout(function () { input.focus(); }, 30); }
    }
    function filter(q) {
      q = q.toLowerCase().trim();
      var shown = 0;
      items.forEach(function (it) {
        var hit = it.textContent.toLowerCase().indexOf(q) > -1;
        it.hidden = !hit;
        it.classList.remove("is-active");
        if (hit) shown++;
      });
      if (empty) empty.hidden = shown !== 0;
      var firstVisible = items.filter(function (i) { return !i.hidden; })[0];
      if (firstVisible) firstVisible.classList.add("is-active");
    }
    function move(dir) {
      var vis = items.filter(function (i) { return !i.hidden; });
      if (!vis.length) return;
      var cur = vis.findIndex(function (i) { return i.classList.contains("is-active"); });
      if (cur < 0) cur = 0;
      vis[cur].classList.remove("is-active");
      var next = (cur + dir + vis.length) % vis.length;
      vis[next].classList.add("is-active");
      vis[next].scrollIntoView({ block: "nearest" });
    }
    document.addEventListener("keydown", function (e) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); open(); }
    });
    $$("[data-command-open]").forEach(function (b) { b.addEventListener("click", open); });
    if (input) {
      input.addEventListener("input", function () { filter(input.value); });
      input.addEventListener("keydown", function (e) {
        if (e.key === "ArrowDown") { e.preventDefault(); move(1); }
        else if (e.key === "ArrowUp") { e.preventDefault(); move(-1); }
        else if (e.key === "Enter") {
          e.preventDefault();
          var active = items.filter(function (i) { return i.classList.contains("is-active") && !i.hidden; })[0];
          if (active) { active.click(); }
        }
      });
    }
    items.forEach(function (it) {
      it.addEventListener("click", function () {
        closeOverlay(palette);
        showToast({ title: "Command", message: it.getAttribute("data-command-item") || it.textContent.trim(), variant: "info" });
      });
      it.addEventListener("mousemove", function () {
        items.forEach(function (i) { i.classList.remove("is-active"); });
        it.classList.add("is-active");
      });
    });
  }

  /* ===================== STEPPER ===================== */
  function initStepper() {
    document.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-step]");
      if (!btn) return;
      var wrap = btn.closest("[data-stepper]");
      var input = $("input", wrap);
      var min = parseFloat(input.getAttribute("data-min"));
      var max = parseFloat(input.getAttribute("data-max"));
      var step = parseFloat(input.getAttribute("data-step-size")) || 1;
      var val = parseFloat(input.value) || 0;
      val += parseFloat(btn.getAttribute("data-step")) * step;
      if (!isNaN(min)) val = Math.max(min, val);
      if (!isNaN(max)) val = Math.min(max, val);
      input.value = val;
      input.dispatchEvent(new Event("change", { bubbles: true }));
    });
  }

  /* ===================== SLIDER OUTPUT ===================== */
  function initSliders() {
    $$("input[type=range][data-slider]").forEach(function (s) {
      var out = $('[data-slider-output="' + s.getAttribute("data-slider") + '"]') ||
                (s.closest(".slider-row") && $(".slider-output", s.closest(".slider-row")));
      function sync() { if (out) out.textContent = (s.getAttribute("data-prefix") || "") + s.value + (s.getAttribute("data-suffix") || ""); }
      s.addEventListener("input", sync); sync();
    });
  }

  /* ===================== RATING ===================== */
  function initRatings() {
    $$("[data-rating]").forEach(function (r) {
      var max = parseInt(r.getAttribute("data-max") || "5", 10);
      var value = parseInt(r.getAttribute("data-value") || "0", 10);
      r.setAttribute("role", "radiogroup");
      r.innerHTML = "";
      var stars = [];
      for (var i = 1; i <= max; i++) {
        (function (n) {
          var b = document.createElement("button");
          b.type = "button";
          b.className = "rating__star";
          b.setAttribute("aria-label", n + " star" + (n > 1 ? "s" : ""));
          b.innerHTML = icons.star;
          b.addEventListener("click", function () { value = n; paint(value); r.setAttribute("data-value", n); });
          b.addEventListener("mouseenter", function () { paint(n); });
          stars.push(b); r.appendChild(b);
        })(i);
      }
      r.addEventListener("mouseleave", function () { paint(value); });
      function paint(n) { stars.forEach(function (s, idx) { s.classList.toggle("is-on", idx < n); }); }
      paint(value);
    });
  }

  /* ===================== CHIP / TAG INPUT ===================== */
  function initChipInput() {
    $$("[data-chip-input]").forEach(function (box) {
      var field = $(".chip-input__field", box) || $("input", box);
      if (!field) return;
      function addChip(text) {
        text = text.trim(); if (!text) return;
        var chip = document.createElement("span");
        chip.className = "chip";
        chip.innerHTML = esc(text) + ' <button type="button" class="chip__x" aria-label="Remove ' + esc(text) + '">&times;</button>';
        box.insertBefore(chip, field);
      }
      field.addEventListener("keydown", function (e) {
        if ((e.key === "Enter" || e.key === ",") && field.value.trim()) { e.preventDefault(); addChip(field.value); field.value = ""; }
        else if (e.key === "Backspace" && !field.value) {
          var chips = $$(".chip", box); if (chips.length) chips[chips.length - 1].remove();
        }
      });
      box.addEventListener("click", function (e) {
        if (e.target.closest(".chip__x")) e.target.closest(".chip").remove();
        else field.focus();
      });
    });
  }

  /* ===================== FILE UPLOAD ===================== */
  function initFileDrop() {
    $$("[data-file-drop]").forEach(function (zone) {
      var input = $('input[type=file]', zone);
      var out = $(".dropzone__file", zone);
      ["dragenter", "dragover"].forEach(function (ev) {
        zone.addEventListener(ev, function (e) { e.preventDefault(); zone.classList.add("is-dragover"); });
      });
      ["dragleave", "drop"].forEach(function (ev) {
        zone.addEventListener(ev, function (e) { e.preventDefault(); zone.classList.remove("is-dragover"); });
      });
      zone.addEventListener("drop", function (e) {
        if (input && e.dataTransfer.files.length) { input.files = e.dataTransfer.files; render(); }
      });
      if (input) input.addEventListener("change", render);
      function render() {
        if (!out || !input.files.length) return;
        var names = Array.prototype.map.call(input.files, function (f) { return f.name; });
        out.textContent = names.join(", ");
      }
    });
  }

  /* ===================== TABLE (sort + select-all) ===================== */
  function initTables() {
    $$("th[data-sort]").forEach(function (th) {
      th.style.cursor = "pointer";
      th.addEventListener("click", function () {
        var table = th.closest("table");
        var tbody = $("tbody", table);
        var idx = Array.prototype.indexOf.call(th.parentNode.children, th);
        var asc = th.getAttribute("aria-sort") !== "ascending";
        $$("th[data-sort]", table).forEach(function (o) { o.removeAttribute("aria-sort"); o.classList.remove("is-sorted-asc", "is-sorted-desc"); });
        th.setAttribute("aria-sort", asc ? "ascending" : "descending");
        th.classList.add(asc ? "is-sorted-asc" : "is-sorted-desc");
        var rows = $$("tr", tbody);
        var type = th.getAttribute("data-sort");
        rows.sort(function (a, b) {
          var av = cellVal(a.children[idx]), bv = cellVal(b.children[idx]);
          if (type === "number") { av = parseFloat(av.replace(/[^0-9.\-]/g, "")) || 0; bv = parseFloat(bv.replace(/[^0-9.\-]/g, "")) || 0; return asc ? av - bv : bv - av; }
          return asc ? av.localeCompare(bv) : bv.localeCompare(av);
        });
        rows.forEach(function (r) { tbody.appendChild(r); });
      });
    });
    function cellVal(td) { return td ? (td.getAttribute("data-value") || td.textContent).trim() : ""; }

    document.addEventListener("change", function (e) {
      var all = e.target.closest("[data-select-all]");
      if (!all) return;
      var table = all.closest("table");
      $$(".row-check", table).forEach(function (c) { c.checked = all.checked; c.closest("tr").classList.toggle("is-selected", all.checked); });
    });
    document.addEventListener("change", function (e) {
      var c = e.target.closest(".row-check");
      if (!c) return;
      c.closest("tr").classList.toggle("is-selected", c.checked);
    });
  }

  /* ===================== KANBAN DRAG ===================== */
  function initKanban() {
    var dragged = null;
    document.addEventListener("dragstart", function (e) {
      var card = e.target.closest(".kanban-card");
      if (!card) return;
      dragged = card; card.classList.add("is-dragging");
      e.dataTransfer.effectAllowed = "move";
      try { e.dataTransfer.setData("text/plain", "card"); } catch (x) {}
    });
    document.addEventListener("dragend", function () {
      if (dragged) dragged.classList.remove("is-dragging");
      $$("[data-kanban-col]").forEach(function (c) { c.classList.remove("is-drop"); });
      dragged = null;
    });
    document.addEventListener("dragover", function (e) {
      var col = e.target.closest("[data-kanban-col]");
      if (!col || !dragged) return;
      e.preventDefault();
      col.classList.add("is-drop");
      var after = getAfter(col, e.clientY);
      var list = $(".kanban-list", col) || col;
      if (after == null) list.appendChild(dragged); else list.insertBefore(dragged, after);
    });
    document.addEventListener("dragleave", function (e) {
      var col = e.target.closest("[data-kanban-col]");
      if (col && !col.contains(e.relatedTarget)) col.classList.remove("is-drop");
    });
    function getAfter(col, y) {
      var cards = $$(".kanban-card:not(.is-dragging)", col);
      var closest = { off: -Infinity, el: null };
      cards.forEach(function (c) {
        var box = c.getBoundingClientRect();
        var off = y - box.top - box.height / 2;
        if (off < 0 && off > closest.off) closest = { off: off, el: c };
      });
      return closest.el;
    }
  }

  /* ===================== CAROUSEL ===================== */
  function initCarousel() {
    $$("[data-carousel]").forEach(function (car) {
      var track = $("[data-carousel-track]", car);
      var slides = $$(":scope > *", track);
      var prev = $("[data-carousel-prev]", car), next = $("[data-carousel-next]", car);
      var dotsWrap = $("[data-carousel-dots]", car);
      var i = 0;
      if (dotsWrap) {
        slides.forEach(function (_, n) {
          var d = document.createElement("button");
          d.className = "carousel__dot"; d.type = "button"; d.setAttribute("aria-label", "Slide " + (n + 1));
          d.addEventListener("click", function () { go(n); });
          dotsWrap.appendChild(d);
        });
      }
      function go(n) {
        i = (n + slides.length) % slides.length;
        track.style.transform = "translateX(" + (-i * 100) + "%)";
        if (dotsWrap) $$(".carousel__dot", dotsWrap).forEach(function (d, k) { d.classList.toggle("is-on", k === i); });
      }
      if (prev) prev.addEventListener("click", function () { go(i - 1); });
      if (next) next.addEventListener("click", function () { go(i + 1); });
      go(0);
    });
  }

  /* ===================== SIDEBAR COLLAPSE ===================== */
  function initSidebar() {
    document.addEventListener("click", function (e) {
      var t = e.target.closest("[data-sidebar-toggle]");
      if (!t) return;
      var sel = t.getAttribute("data-sidebar-toggle");
      var sb = sel ? $('[data-sidebar="' + sel + '"]') : $("[data-sidebar]");
      if (sb) sb.classList.toggle("is-collapsed");
    });
  }

  /* ===================== COMBOBOX / MULTISELECT ===================== */
  function initCombobox() {
    $$("[data-combobox]").forEach(function (cb) {
      var input = $("[data-combobox-input]", cb) || $("input", cb);
      var menu = $("[data-combobox-menu]", cb);
      var options = $$("[data-combobox-option]", cb);
      var multi = cb.hasAttribute("data-multi");
      var chipHost = $("[data-combobox-chips]", cb);
      function openMenu() { cb.classList.add("is-open"); }
      function closeMenu() { cb.classList.remove("is-open"); }
      input.addEventListener("focus", openMenu);
      input.addEventListener("input", function () {
        openMenu();
        var q = input.value.toLowerCase();
        options.forEach(function (o) { o.hidden = o.textContent.toLowerCase().indexOf(q) < 0; });
      });
      options.forEach(function (o) {
        o.addEventListener("click", function () {
          var val = o.getAttribute("data-combobox-option");
          if (multi) {
            o.classList.toggle("is-selected");
            renderChips();
          } else {
            input.value = val;
            options.forEach(function (x) { x.classList.remove("is-selected"); });
            o.classList.add("is-selected");
            closeMenu();
          }
        });
      });
      function renderChips() {
        if (!chipHost) return;
        chipHost.innerHTML = "";
        options.filter(function (o) { return o.classList.contains("is-selected"); }).forEach(function (o) {
          var chip = document.createElement("span");
          chip.className = "chip";
          chip.innerHTML = esc(o.getAttribute("data-combobox-option")) + ' <button class="chip__x" aria-label="Remove">&times;</button>';
          chip.querySelector(".chip__x").addEventListener("click", function (ev) { ev.stopPropagation(); o.classList.remove("is-selected"); renderChips(); });
          chipHost.appendChild(chip);
        });
      }
      document.addEventListener("click", function (e) { if (!cb.contains(e.target)) closeMenu(); });
    });
  }

  /* ===================== WIZARD / STEPS ===================== */
  function initWizard() {
    $$("[data-wizard]").forEach(function (wz) {
      var steps = $$("[data-wizard-step]", wz);
      var dots = $$("[data-wizard-dot]", wz);
      var cur = 0;
      function render() {
        steps.forEach(function (s, i) { s.hidden = i !== cur; });
        dots.forEach(function (d, i) {
          d.classList.toggle("is-active", i === cur);
          d.classList.toggle("is-done", i < cur);
        });
        var bar = $("[data-wizard-progress]", wz);
        if (bar) bar.style.width = (steps.length > 1 ? (cur / (steps.length - 1)) * 100 : 0) + "%";
      }
      wz.addEventListener("click", function (e) {
        if (e.target.closest("[data-wizard-next]")) { cur = Math.min(steps.length - 1, cur + 1); render(); }
        else if (e.target.closest("[data-wizard-prev]")) { cur = Math.max(0, cur - 1); render(); }
        var goto = e.target.closest("[data-wizard-goto]");
        if (goto) { cur = parseInt(goto.getAttribute("data-wizard-goto"), 10); render(); }
      });
      render();
    });
  }

  /* ===================== COPY / PASSWORD / COUNTUP ===================== */
  function initMisc() {
    document.addEventListener("click", function (e) {
      var c = e.target.closest("[data-copy]");
      if (c) {
        var sel = c.getAttribute("data-copy");
        var src = sel ? $(sel) : (c.closest(".codeblock") && $("code", c.closest(".codeblock")));
        var text = src ? src.textContent : c.getAttribute("data-copy-text") || "";
        try {
          navigator.clipboard.writeText(text);
        } catch (x) {
          var ta = document.createElement("textarea"); ta.value = text; document.body.appendChild(ta); ta.select();
          try { document.execCommand("copy"); } catch (y) {} ta.remove();
        }
        var old = c.getAttribute("data-label-default") || c.textContent;
        c.textContent = "Copied!";
        setTimeout(function () { c.textContent = old; }, 1400);
      }
      var p = e.target.closest("[data-toggle-password]");
      if (p) {
        var field = $(p.getAttribute("data-toggle-password")) || p.parentElement.querySelector("input");
        if (field) field.type = field.type === "password" ? "text" : "password";
        p.setAttribute("aria-pressed", String(field && field.type === "text"));
      }
    });

    // count-up numbers (respects reduced motion)
    $$("[data-countup]").forEach(function (el) {
      var to = parseFloat(el.getAttribute("data-to") || el.textContent) || 0;
      var prefix = el.getAttribute("data-prefix") || "";
      var suffix = el.getAttribute("data-suffix") || "";
      if (prefersReduced) { el.textContent = prefix + format(to) + suffix; return; }
      var start = null, dur = 1100;
      function frame(ts) {
        if (!start) start = ts;
        var p = Math.min(1, (ts - start) / dur);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = prefix + format(Math.round(to * eased)) + suffix;
        if (p < 1) requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);
    });
    function format(n) { return n.toLocaleString("en-US"); }
  }

  /* ===================== helpers ===================== */
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]; }); }
  var icons = {
    info:    '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="3"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 7.5v.01"/></svg>',
    success: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="3"><path d="M5 13l4 4L19 7"/></svg>',
    warning: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="3"><path d="M12 3l9 16H3z"/><path d="M12 10v4M12 17v.01"/></svg>',
    danger:  '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="3"><circle cx="12" cy="12" r="9"/><path d="M15 9l-6 6M9 9l6 6"/></svg>',
    "default":'<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="3"><circle cx="12" cy="12" r="9"/><path d="M12 8v.01M12 11v5"/></svg>',
    star:    '<svg viewBox="0 0 24 24" fill="currentColor" stroke="var(--color-border)" stroke-width="2"><path d="M12 2l3 6.5 7 .6-5.2 4.6L18.5 21 12 17.3 5.5 21l1.7-7.3L2 9.1l7-.6z"/></svg>'
  };

  /* ===================== boot ===================== */
  function init() {
    initTheme(); initTabs(); initAccordion(); initOverlays(); initToast();
    initDropdown(); initContextMenu(); initCommandPalette(); initStepper();
    initSliders(); initRatings(); initChipInput(); initFileDrop(); initTables();
    initKanban(); initCarousel(); initSidebar(); initCombobox(); initWizard(); initMisc();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();

  // public API
  window.NB = { toast: showToast, openOverlay: openOverlay, closeOverlay: closeOverlay };
})();
