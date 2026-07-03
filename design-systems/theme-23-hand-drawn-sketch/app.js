/* ============================================================================
   THEME 23 — HAND-DRAWN SKETCH · app.js
   ----------------------------------------------------------------------------
   All interactions, vanilla JS, event-delegation on data-attributes.
   Self-initialising, works on dynamically-added DOM, safe over file://.
   ========================================================================== */
(function () {
  "use strict";
  var doc = document, root = doc.documentElement;
  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $  = function (s, c) { return (c || doc).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || doc).querySelectorAll(s)); };

  /* ---------------------------------------------------------------- *
   * THEME TOGGLE (persist localStorage "sketch-theme")
   * ---------------------------------------------------------------- */
  function applyTheme(t) {
    root.setAttribute("data-theme", t);
    $$("[data-theme-toggle]").forEach(function (b) {
      b.setAttribute("aria-pressed", String(t === "dark"));
    });
  }
  try {
    var saved = localStorage.getItem("sketch-theme");
    if (saved) applyTheme(saved);
    else if (!root.getAttribute("data-theme")) {
      applyTheme(window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    }
  } catch (e) {}
  function toggleTheme() {
    var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    applyTheme(next);
    try { localStorage.setItem("sketch-theme", next); } catch (e) {}
  }
  doc.addEventListener("click", function (e) {
    var t = e.target.closest("[data-theme-toggle]");
    if (t) { toggleTheme(); }
  });

  /* ---------------------------------------------------------------- *
   * DOODLE BURST — spawn a hand-drawn scribble at the cursor on click
   * ---------------------------------------------------------------- */
  var DOODLES = [
    '<path d="M12 2 L15 9 L22 9 L16 14 L18 22 L12 17 L6 22 L8 14 L2 9 L9 9 Z" fill="none" stroke="CLR" stroke-width="2" stroke-linejoin="round"/>',           // star
    '<path d="M3 12 C 8 4, 16 4, 21 12" fill="none" stroke="CLR" stroke-width="2.4" stroke-linecap="round"/><path d="M16 8 L22 12 L16 16" fill="none" stroke="CLR" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>', // arrow
    '<path d="M4 14 q4 -10 8 0 q4 10 8 0" fill="none" stroke="CLR" stroke-width="2.4" stroke-linecap="round"/>',     // squiggle
    '<path d="M12 3 v18 M3 12 h18 M6 6 l12 12 M18 6 l-12 12" fill="none" stroke="CLR" stroke-width="1.8" stroke-linecap="round"/>', // sparkle
    '<circle cx="12" cy="12" r="8" fill="none" stroke="CLR" stroke-width="2.2" stroke-dasharray="3 4"/>'              // dotted ring
  ];
  var DOODLE_COLORS = ["#e2503b", "#3e7cb1", "#f5c800", "#5a9367", "#8b6bb1"];
  function doodleAt(x, y, color) {
    if (prefersReduced) return;
    var d = DOODLES[(Math.floor(x + y)) % DOODLES.length];
    var clr = color || DOODLE_COLORS[(Math.floor(x)) % DOODLE_COLORS.length];
    var span = doc.createElement("span");
    span.setAttribute("aria-hidden", "true");
    span.style.cssText = "position:fixed;left:" + (x - 16) + "px;top:" + (y - 16) +
      "px;width:32px;height:32px;pointer-events:none;z-index:1900;will-change:transform,opacity;";
    span.innerHTML = '<svg viewBox="0 0 24 24" width="32" height="32">' + d.replace(/CLR/g, clr) + "</svg>";
    doc.body.appendChild(span);
    span.animate(
      [
        { transform: "scale(.4) rotate(-20deg)", opacity: 0 },
        { transform: "scale(1.15) rotate(8deg)", opacity: 1, offset: 0.4 },
        { transform: "scale(1) translateY(-18px) rotate(-6deg)", opacity: 0 }
      ],
      { duration: 700, easing: "cubic-bezier(.34,1.56,.5,1)" }
    ).onfinish = function () { span.remove(); };
  }
  doc.addEventListener("click", function (e) {
    var t = e.target.closest("[data-doodle]");
    if (t) {
      var n = parseInt(t.getAttribute("data-doodle"), 10) || 1;
      for (var i = 0; i < n; i++) {
        (function (k) {
          setTimeout(function () {
            doodleAt(e.clientX + (k ? (Math.random() * 60 - 30) : 0),
                     e.clientY + (k ? (Math.random() * 50 - 25) : 0));
          }, k * 70);
        })(i);
      }
    }
  });

  /* ---------------------------------------------------------------- *
   * TOAST
   * ---------------------------------------------------------------- */
  function toastRegion() {
    var r = $(".toast-region");
    if (!r) {
      r = doc.createElement("div");
      r.className = "toast-region";
      r.setAttribute("aria-live", "polite");
      r.setAttribute("aria-atomic", "false");
      doc.body.appendChild(r);
    }
    return r;
  }
  var TOAST_ICON = {
    success: "✓", info: "✎", warning: "!", danger: "✗"
  };
  function sketchToast(opt) {
    opt = opt || {};
    var type = opt.type || "info";
    var el = doc.createElement("div");
    el.className = "toast " + type;
    el.setAttribute("role", "status");
    el.innerHTML =
      '<span class="toast-icon" aria-hidden="true">' + (TOAST_ICON[type] || "✎") + "</span>" +
      '<div class="toast-content"><div class="toast-title"></div><div class="toast-body"></div></div>' +
      '<button class="toast-close" aria-label="Dismiss">✕</button>';
    el.querySelector(".toast-title").textContent = opt.title || "";
    el.querySelector(".toast-body").textContent = opt.body || "";
    if (!opt.title) el.querySelector(".toast-title").remove();
    if (!opt.body) el.querySelector(".toast-body").remove();
    toastRegion().appendChild(el);
    var close = function () {
      el.style.animation = "fade-up var(--duration-fast) reverse forwards";
      setTimeout(function () { el.remove(); }, 200);
    };
    el.querySelector(".toast-close").addEventListener("click", close);
    var dur = opt.duration == null ? 4200 : opt.duration;
    if (dur > 0) setTimeout(close, dur);
    return el;
  }
  window.sketchToast = sketchToast;
  doc.addEventListener("click", function (e) {
    var t = e.target.closest("[data-toast]");
    if (t) {
      sketchToast({
        type: t.getAttribute("data-toast") || "info",
        title: t.getAttribute("data-toast-title") || "",
        body: t.getAttribute("data-toast-body") || ""
      });
    }
  });

  /* ---------------------------------------------------------------- *
   * FOCUS TRAP helper (modal / drawer)
   * ---------------------------------------------------------------- */
  var FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';
  function trap(container, e) {
    var f = $$(FOCUSABLE, container).filter(function (n) { return n.offsetParent !== null; });
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && doc.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && doc.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  /* ---------------------------------------------------------------- *
   * MODAL
   * ---------------------------------------------------------------- */
  var lastFocus = null;
  function openModal(id) {
    var ov = doc.getElementById(id); if (!ov) return;
    lastFocus = doc.activeElement;
    ov.hidden = false;
    requestAnimationFrame(function () { ov.classList.add("is-open"); });
    var f = $(FOCUSABLE, ov); if (f) setTimeout(function(){ f.focus(); }, 30);
    ov._key = function (e) {
      if (e.key === "Escape") closeModal(ov);
      else if (e.key === "Tab") trap(ov.querySelector(".modal") || ov, e);
    };
    doc.addEventListener("keydown", ov._key);
  }
  function closeModal(ov) {
    if (typeof ov === "string") ov = doc.getElementById(ov);
    if (!ov) return;
    ov.classList.remove("is-open");
    doc.removeEventListener("keydown", ov._key);
    setTimeout(function () { ov.hidden = true; }, 200);
    if (lastFocus) try { lastFocus.focus(); } catch (e) {}
  }
  doc.addEventListener("click", function (e) {
    var o = e.target.closest("[data-modal-open]");
    if (o) { openModal(o.getAttribute("data-modal-open")); return; }
    var c = e.target.closest("[data-modal-close]");
    if (c) { closeModal(c.closest(".overlay")); return; }
    if (e.target.classList && e.target.classList.contains("overlay") &&
        e.target.classList.contains("is-open")) {
      closeModal(e.target);
    }
  });

  /* ---------------------------------------------------------------- *
   * DRAWER
   * ---------------------------------------------------------------- */
  function openDrawer(id) {
    var d = doc.getElementById(id); if (!d) return;
    lastFocus = doc.activeElement;
    var scrim = d.getAttribute("data-scrim") ? doc.getElementById(d.getAttribute("data-scrim")) : null;
    if (scrim) { scrim.hidden = false; requestAnimationFrame(function(){ scrim.classList.add("is-open"); }); }
    d.classList.add("is-open");
    var f = $(FOCUSABLE, d); if (f) setTimeout(function(){ f.focus(); }, 30);
    d._key = function (e) {
      if (e.key === "Escape") closeDrawer(id);
      else if (e.key === "Tab") trap(d, e);
    };
    doc.addEventListener("keydown", d._key);
    if (scrim) scrim.addEventListener("click", function onc() { closeDrawer(id); scrim.removeEventListener("click", onc); });
  }
  function closeDrawer(id) {
    var d = doc.getElementById(id); if (!d) return;
    d.classList.remove("is-open");
    var scrim = d.getAttribute("data-scrim") ? doc.getElementById(d.getAttribute("data-scrim")) : null;
    if (scrim) { scrim.classList.remove("is-open"); setTimeout(function(){ scrim.hidden = true; }, 200); }
    doc.removeEventListener("keydown", d._key);
    if (lastFocus) try { lastFocus.focus(); } catch (e) {}
  }
  doc.addEventListener("click", function (e) {
    var o = e.target.closest("[data-drawer-open]");
    if (o) { openDrawer(o.getAttribute("data-drawer-open")); return; }
    var c = e.target.closest("[data-drawer-close]");
    if (c) { closeDrawer(c.getAttribute("data-drawer-close")); }
  });

  /* ---------------------------------------------------------------- *
   * COMMAND PALETTE (⌘K / Ctrl-K)
   * ---------------------------------------------------------------- */
  function cmdk() { return $(".cmdk-overlay"); }
  function openCmdk() {
    var o = cmdk(); if (!o) return;
    lastFocus = doc.activeElement;
    o.classList.add("is-open");
    var inp = $(".cmdk-input", o);
    if (inp) { inp.value = ""; filterCmdk(o, ""); setTimeout(function(){ inp.focus(); }, 30); }
    setActiveCmdk(o, 0);
  }
  function closeCmdk() {
    var o = cmdk(); if (!o) return;
    o.classList.remove("is-open");
    if (lastFocus) try { lastFocus.focus(); } catch (e) {}
  }
  function visibleItems(o) { return $$(".cmdk-item", o).filter(function (n){ return n.style.display !== "none"; }); }
  function setActiveCmdk(o, idx) {
    var items = visibleItems(o);
    items.forEach(function (n, i) { n.classList.toggle("is-active", i === idx); });
    if (items[idx]) items[idx].scrollIntoView({ block: "nearest" });
  }
  function filterCmdk(o, q) {
    q = (q || "").toLowerCase();
    $$(".cmdk-item", o).forEach(function (n) {
      n.style.display = n.textContent.toLowerCase().indexOf(q) > -1 ? "" : "none";
    });
    var empty = $(".cmdk-empty", o);
    if (empty) empty.style.display = visibleItems(o).length ? "none" : "";
    setActiveCmdk(o, 0);
  }
  function runCmdkItem(it) {
    if (!it) return;
    var href = it.getAttribute("data-href");
    var action = it.getAttribute("data-action");
    closeCmdk();
    if (action === "toggle-theme") toggleTheme();
    else if (href) window.location.href = href;
  }
  doc.addEventListener("keydown", function (e) {
    if ((e.metaKey || e.ctrlKey) && (e.key === "k" || e.key === "K")) { e.preventDefault(); var o=cmdk(); if(o){ o.classList.contains("is-open")?closeCmdk():openCmdk(); } return; }
    var o = cmdk(); if (!o || !o.classList.contains("is-open")) return;
    if (e.key === "Escape") { e.preventDefault(); closeCmdk(); }
    else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      var items = visibleItems(o);
      var cur = items.findIndex(function (n){ return n.classList.contains("is-active"); });
      var nx = e.key === "ArrowDown" ? Math.min(items.length - 1, cur + 1) : Math.max(0, cur - 1);
      setActiveCmdk(o, nx);
    } else if (e.key === "Enter") {
      e.preventDefault();
      runCmdkItem(visibleItems(o).find(function (n){ return n.classList.contains("is-active"); }));
    }
  });
  doc.addEventListener("input", function (e) {
    if (e.target.classList && e.target.classList.contains("cmdk-input")) {
      filterCmdk(e.target.closest(".cmdk-overlay"), e.target.value);
    }
  });
  doc.addEventListener("click", function (e) {
    if (e.target.closest("[data-cmdk-open]")) { openCmdk(); return; }
    var it = e.target.closest(".cmdk-item");
    if (it) { runCmdkItem(it); return; }
    var ov = cmdk();
    if (ov && ov.classList.contains("is-open") && e.target === ov) closeCmdk();
  });

  /* ---------------------------------------------------------------- *
   * TABS (roving arrows)
   * ---------------------------------------------------------------- */
  function selectTab(tab) {
    var list = tab.closest(".tablist"); if (!list) return;
    var tabs = $$('[role="tab"]', list);
    tabs.forEach(function (t) {
      var sel = t === tab;
      t.setAttribute("aria-selected", String(sel));
      t.tabIndex = sel ? 0 : -1;
      var panel = doc.getElementById(t.getAttribute("aria-controls"));
      if (panel) panel.hidden = !sel;
    });
  }
  doc.addEventListener("click", function (e) {
    var t = e.target.closest('[role="tab"]');
    if (t) { selectTab(t); t.focus(); }
  });
  doc.addEventListener("keydown", function (e) {
    var t = e.target.closest('[role="tab"]'); if (!t) return;
    var tabs = $$('[role="tab"]', t.closest(".tablist"));
    var i = tabs.indexOf(t), n = i;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") n = (i + 1) % tabs.length;
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") n = (i - 1 + tabs.length) % tabs.length;
    else if (e.key === "Home") n = 0;
    else if (e.key === "End") n = tabs.length - 1;
    else return;
    e.preventDefault(); selectTab(tabs[n]); tabs[n].focus();
  });

  /* ---------------------------------------------------------------- *
   * ACCORDION
   * ---------------------------------------------------------------- */
  doc.addEventListener("click", function (e) {
    var trg = e.target.closest(".accordion-trigger"); if (!trg) return;
    var item = trg.closest(".accordion-item");
    var panel = $(".accordion-panel", item);
    var open = trg.getAttribute("aria-expanded") === "true";
    var acc = trg.closest(".accordion");
    if (acc && acc.hasAttribute("data-single") && !open) {
      $$(".accordion-trigger", acc).forEach(function (o) {
        if (o !== trg) {
          o.setAttribute("aria-expanded", "false");
          var p = $(".accordion-panel", o.closest(".accordion-item"));
          if (p) p.classList.remove("is-open");
        }
      });
    }
    trg.setAttribute("aria-expanded", String(!open));
    if (panel) panel.classList.toggle("is-open", !open);
  });

  /* ---------------------------------------------------------------- *
   * MENU / DROPDOWN  +  POPOVER
   * ---------------------------------------------------------------- */
  function closeAllMenus(except) {
    $$(".menu.is-open, .popover.is-open").forEach(function (m) {
      if (m !== except) { m.classList.remove("is-open");
        var ctl = doc.querySelector('[data-menu="'+m.id+'"],[data-popover="'+m.id+'"]');
        if (ctl) ctl.setAttribute("aria-expanded", "false");
      }
    });
  }
  doc.addEventListener("click", function (e) {
    var mt = e.target.closest("[data-menu]");
    if (mt) {
      var m = doc.getElementById(mt.getAttribute("data-menu"));
      if (m) { var willOpen = !m.classList.contains("is-open"); closeAllMenus(m);
        m.classList.toggle("is-open", willOpen);
        mt.setAttribute("aria-expanded", String(willOpen));
        if (willOpen) { var fi = $(".menu-item", m); if (fi) setTimeout(function(){ fi.focus(); }, 20); }
      }
      return;
    }
    var pt = e.target.closest("[data-popover]");
    if (pt) {
      var p = doc.getElementById(pt.getAttribute("data-popover"));
      if (p) { var wo = !p.classList.contains("is-open"); closeAllMenus(p);
        p.classList.toggle("is-open", wo); pt.setAttribute("aria-expanded", String(wo)); }
      return;
    }
    if (!e.target.closest(".menu") && !e.target.closest(".popover")) closeAllMenus();
  });
  doc.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeAllMenus();
  });

  /* ---------------------------------------------------------------- *
   * CONTEXT MENU (right-click)
   * ---------------------------------------------------------------- */
  doc.addEventListener("contextmenu", function (e) {
    var zone = e.target.closest("[data-context-menu]");
    closeAllMenus();
    $$(".context-menu.is-open").forEach(function(m){ m.classList.remove("is-open"); });
    if (!zone) return;
    e.preventDefault();
    var menu = doc.getElementById(zone.getAttribute("data-context-menu"));
    if (!menu) return;
    menu.classList.add("is-open");
    var mw = menu.offsetWidth, mh = menu.offsetHeight;
    var x = Math.min(e.clientX, window.innerWidth - mw - 8);
    var y = Math.min(e.clientY, window.innerHeight - mh - 8);
    menu.style.left = x + "px"; menu.style.top = y + "px";
  });
  doc.addEventListener("click", function () {
    $$(".context-menu.is-open").forEach(function (m) { m.classList.remove("is-open"); });
  });

  /* ---------------------------------------------------------------- *
   * SEGMENTED CONTROL  +  BUTTON-GROUP TOGGLE
   * ---------------------------------------------------------------- */
  doc.addEventListener("click", function (e) {
    var seg = e.target.closest(".segmented > button");
    if (seg) {
      var box = seg.parentElement;
      $$("button", box).forEach(function (b) { b.classList.toggle("is-active", b === seg); b.setAttribute("aria-pressed", String(b === seg)); });
      box.dispatchEvent(new CustomEvent("segment-change", { detail: { value: seg.getAttribute("data-value") }, bubbles: true }));
      return;
    }
    var grp = e.target.closest(".btn-group[data-toggle] .btn");
    if (grp) {
      $$(".btn", grp.parentElement).forEach(function (b) { b.classList.toggle("is-active", b === grp); b.setAttribute("aria-pressed", String(b === grp)); });
    }
  });

  /* ---------------------------------------------------------------- *
   * SLIDER (live value + fill)
   * ---------------------------------------------------------------- */
  function paintSlider(inp) {
    var min = +inp.min || 0, max = +inp.max || 100, v = +inp.value;
    var pct = ((v - min) / (max - min)) * 100;
    inp.style.setProperty("--fill", pct + "%");
    var wrap = inp.closest(".slider");
    if (wrap) { var out = $(".slider-value", wrap); if (out) out.textContent = v + (inp.getAttribute("data-suffix") || ""); }
  }
  $$(".slider input[type=range]").forEach(paintSlider);
  doc.addEventListener("input", function (e) {
    if (e.target.matches(".slider input[type=range]")) paintSlider(e.target);
  });

  /* ---------------------------------------------------------------- *
   * STEPPER
   * ---------------------------------------------------------------- */
  doc.addEventListener("click", function (e) {
    var b = e.target.closest(".stepper [data-step]"); if (!b) return;
    var inp = $("input", b.parentElement); if (!inp) return;
    var v = parseInt(inp.value, 10) || 0;
    var min = inp.min !== "" ? +inp.min : -Infinity, max = inp.max !== "" ? +inp.max : Infinity;
    v += b.getAttribute("data-step") === "+" ? 1 : -1;
    inp.value = Math.max(min, Math.min(max, v));
    inp.dispatchEvent(new Event("change", { bubbles: true }));
  });

  /* ---------------------------------------------------------------- *
   * RATING (stars)
   * ---------------------------------------------------------------- */
  function paintRating(r, val) {
    $$('[role="radio"]', r).forEach(function (b, i) {
      var on = i < val;
      b.classList.toggle("is-on", on);
      b.setAttribute("aria-checked", String(i + 1 === val));
    });
  }
  $$(".rating").forEach(function (r) { paintRating(r, +r.getAttribute("data-value") || 0); });
  doc.addEventListener("mouseover", function (e) {
    var st = e.target.closest('.rating [role="radio"]'); if (!st) return;
    var r = st.closest(".rating"); var i = $$('[role="radio"]', r).indexOf(st);
    $$('[role="radio"]', r).forEach(function (b, k) { b.classList.toggle("is-hover", k <= i); });
  });
  doc.addEventListener("mouseout", function (e) {
    var r = e.target.closest && e.target.closest(".rating"); if (!r) return;
    $$('[role="radio"]', r).forEach(function (b) { b.classList.remove("is-hover"); });
  });
  doc.addEventListener("click", function (e) {
    var st = e.target.closest('.rating [role="radio"]'); if (!st) return;
    var r = st.closest(".rating"); var i = $$('[role="radio"]', r).indexOf(st) + 1;
    r.setAttribute("data-value", i); paintRating(r, i);
    r.dispatchEvent(new CustomEvent("rating-change", { detail: { value: i }, bubbles: true }));
  });

  /* ---------------------------------------------------------------- *
   * SEARCHBAR clear
   * ---------------------------------------------------------------- */
  doc.addEventListener("input", function (e) {
    var inp = e.target.closest(".searchbar input"); if (!inp) return;
    inp.closest(".searchbar").classList.toggle("has-value", inp.value.length > 0);
  });
  doc.addEventListener("click", function (e) {
    var c = e.target.closest(".searchbar .clear-btn"); if (!c) return;
    var sb = c.closest(".searchbar"), inp = $("input", sb);
    inp.value = ""; sb.classList.remove("has-value"); inp.focus();
    inp.dispatchEvent(new Event("input", { bubbles: true }));
  });

  /* ---------------------------------------------------------------- *
   * COMBO — multiselect / chip input
   * ---------------------------------------------------------------- */
  doc.addEventListener("click", function (e) {
    var ctl = e.target.closest(".combo .combo-control");
    if (ctl && !e.target.closest(".chip")) {
      var combo = ctl.closest(".combo");
      if (combo.hasAttribute("data-multi")) combo.classList.toggle("is-open");
      var inp = $("input", ctl); if (inp) inp.focus();
    }
    var rm = e.target.closest(".chip button");
    if (rm) { rm.closest(".chip").remove(); }
    var opt = e.target.closest(".combo-option");
    if (opt) {
      var sel = opt.getAttribute("aria-selected") === "true";
      opt.setAttribute("aria-selected", String(!sel));
      opt.classList.toggle("is-selected", !sel);
    }
  });
  doc.addEventListener("keydown", function (e) {
    var inp = e.target.closest(".combo[data-chip] .combo-control input");
    if (!inp) return;
    if ((e.key === "Enter" || e.key === ",") && inp.value.trim()) {
      e.preventDefault();
      var chip = doc.createElement("span");
      chip.className = "chip";
      chip.innerHTML = "<span></span> <button type='button' aria-label='Remove'>✕</button>";
      chip.firstChild.textContent = inp.value.trim();
      inp.parentElement.insertBefore(chip, inp);
      inp.value = "";
    } else if (e.key === "Backspace" && !inp.value) {
      var chips = $$(".chip", inp.parentElement);
      if (chips.length) chips[chips.length - 1].remove();
    }
  });
  // multiselect filter
  doc.addEventListener("input", function (e) {
    var inp = e.target.closest(".combo[data-multi] .combo-control input"); if (!inp) return;
    var combo = inp.closest(".combo"); combo.classList.add("is-open");
    var q = inp.value.toLowerCase();
    $$(".combo-option", combo).forEach(function (o) { o.style.display = o.textContent.toLowerCase().indexOf(q) > -1 ? "" : "none"; });
    var em = $(".combo-empty", combo);
    if (em) em.style.display = $$(".combo-option", combo).some(function(o){return o.style.display!=="none";}) ? "none" : "";
  });
  doc.addEventListener("click", function (e) {
    if (!e.target.closest(".combo")) $$(".combo.is-open").forEach(function (c){ c.classList.remove("is-open"); });
  });

  /* ---------------------------------------------------------------- *
   * CALENDAR / DATEPICKER
   * ---------------------------------------------------------------- */
  var MONTHS = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
  var DOW = ["S","M","T","W","T","F","S"];
  function renderCal(cal, year, month, selKey) {
    var grid = $(".calendar-grid", cal); if (!grid) return;
    cal._y = year; cal._m = month;
    var title = $(".calendar-head .title", cal);
    if (title) title.textContent = MONTHS[month] + " " + year;
    grid.innerHTML = "";
    DOW.forEach(function (d) { var h = doc.createElement("span"); h.className = "cal-dow"; h.textContent = d; grid.appendChild(h); });
    var first = new Date(year, month, 1).getDay();
    var days = new Date(year, month + 1, 0).getDate();
    var today = cal.getAttribute("data-today") || "";
    for (var i = 0; i < first; i++) { var e = doc.createElement("span"); e.className = "calendar-day is-muted"; grid.appendChild(e); }
    for (var d = 1; d <= days; d++) {
      var cell = doc.createElement("button");
      cell.type = "button"; cell.className = "calendar-day"; cell.textContent = d;
      var key = year + "-" + (month + 1) + "-" + d;
      cell.setAttribute("data-key", key);
      if (key === today) cell.classList.add("is-today");
      if (key === selKey) cell.classList.add("is-selected");
      grid.appendChild(cell);
    }
  }
  $$("[data-calendar]").forEach(function (cal) {
    var base = new Date();
    renderCal(cal, base.getFullYear(), base.getMonth(), cal.getAttribute("data-selected") || "");
  });
  doc.addEventListener("click", function (e) {
    var prev = e.target.closest("[data-calendar] .cal-prev");
    var next = e.target.closest("[data-calendar] .cal-next");
    var day  = e.target.closest("[data-calendar] .calendar-day[data-key]");
    if (prev || next) {
      var cal = (prev || next).closest("[data-calendar]");
      var m = cal._m + (next ? 1 : -1), y = cal._y;
      if (m < 0) { m = 11; y--; } if (m > 11) { m = 0; y++; }
      renderCal(cal, y, m, cal._sel);
    } else if (day) {
      var cal2 = day.closest("[data-calendar]");
      cal2._sel = day.getAttribute("data-key");
      $$(".calendar-day", cal2).forEach(function (c){ c.classList.remove("is-selected"); });
      day.classList.add("is-selected");
      var out = cal2.getAttribute("data-output");
      if (out) { var f = doc.getElementById(out); if (f) f.value = day.getAttribute("data-key"); }
    }
  });

  /* ---------------------------------------------------------------- *
   * FILE UPLOAD (dropzone)
   * ---------------------------------------------------------------- */
  function addFiles(dz, files) {
    var list = doc.getElementById(dz.getAttribute("data-file-list"));
    Array.prototype.forEach.call(files, function (f) {
      if (list) {
        var row = doc.createElement("div");
        row.className = "file-row";
        row.innerHTML = '<span class="file-ic" aria-hidden="true">📎</span><span class="file-name"></span><span class="file-size"></span><button class="file-del" aria-label="Remove">✕</button>';
        row.querySelector(".file-name").textContent = f.name;
        row.querySelector(".file-size").textContent = (f.size/1024).toFixed(0) + " KB";
        list.appendChild(row);
      }
    });
    sketchToast({ type: "success", title: "Added", body: files.length + " file(s) attached." });
  }
  $$(".dropzone").forEach(function (dz) {
    var input = doc.createElement("input"); input.type = "file"; input.multiple = true; input.style.display = "none";
    dz.appendChild(input);
    dz.addEventListener("click", function (e) { if (!e.target.closest(".file-row")) input.click(); });
    input.addEventListener("change", function () { if (input.files.length) addFiles(dz, input.files); input.value=""; });
    ["dragover","dragenter"].forEach(function (ev){ dz.addEventListener(ev, function (e){ e.preventDefault(); dz.classList.add("is-drag"); }); });
    ["dragleave","drop"].forEach(function (ev){ dz.addEventListener(ev, function (e){ e.preventDefault(); dz.classList.remove("is-drag"); }); });
    dz.addEventListener("drop", function (e){ if (e.dataTransfer && e.dataTransfer.files.length) addFiles(dz, e.dataTransfer.files); });
  });
  doc.addEventListener("click", function (e) {
    var del = e.target.closest(".file-row .file-del"); if (del) del.closest(".file-row").remove();
  });

  /* ---------------------------------------------------------------- *
   * CAROUSEL
   * ---------------------------------------------------------------- */
  $$(".carousel").forEach(function (c) {
    var track = $(".carousel-track", c), slides = $$(".carousel-slide", c);
    if (!track || !slides.length) return;
    var idx = 0, dotsWrap = $(".carousel-dots", c), timer = null;
    slides.forEach(function (_, i) {
      if (dotsWrap) { var b = doc.createElement("button"); b.type="button"; b.setAttribute("aria-label","Slide "+(i+1));
        b.addEventListener("click", function(){ go(i); });
        dotsWrap.appendChild(b); }
    });
    function go(i) {
      idx = (i + slides.length) % slides.length;
      track.style.transform = "translateX(" + (-idx * 100) + "%)";
      if (dotsWrap) $$("button", dotsWrap).forEach(function (d, k){ d.classList.toggle("is-active", k === idx); });
    }
    var prev = $(".carousel-btn.prev", c), next = $(".carousel-btn.next", c);
    if (prev) prev.addEventListener("click", function(){ go(idx-1); reset(); });
    if (next) next.addEventListener("click", function(){ go(idx+1); reset(); });
    c.addEventListener("keydown", function (e){ if(e.key==="ArrowLeft"){go(idx-1);} if(e.key==="ArrowRight"){go(idx+1);} });
    function reset(){ if (timer){ clearInterval(timer); auto(); } }
    function auto(){ var ms = +c.getAttribute("data-autoplay"); if (ms>0 && !prefersReduced) timer = setInterval(function(){ go(idx+1); }, ms); }
    go(0); auto();
  });

  /* ---------------------------------------------------------------- *
   * TABLE (sort + select)
   * ---------------------------------------------------------------- */
  doc.addEventListener("click", function (e) {
    var th = e.target.closest(".table[data-sortable] th.sortable"); if (!th) return;
    var table = th.closest("table"), ths = $$("th", th.parentElement), ci = ths.indexOf(th);
    var tbody = $("tbody", table), rows = $$("tr", tbody);
    var asc = th.getAttribute("aria-sort") !== "ascending";
    ths.forEach(function (h){ h.removeAttribute("aria-sort"); });
    th.setAttribute("aria-sort", asc ? "ascending" : "descending");
    var num = th.getAttribute("data-type") === "number";
    rows.sort(function (a, b) {
      var av = cellVal(a, ci), bv = cellVal(b, ci);
      if (num) { av = parseFloat(av) || 0; bv = parseFloat(bv) || 0; return asc ? av - bv : bv - av; }
      return asc ? av.localeCompare(bv) : bv.localeCompare(av);
    });
    rows.forEach(function (r){ tbody.appendChild(r); });
  });
  function cellVal(row, i) {
    var cell = row.children[i]; if (!cell) return "";
    return cell.getAttribute("data-sort") != null ? cell.getAttribute("data-sort") : cell.textContent.trim();
  }
  doc.addEventListener("change", function (e) {
    var all = e.target.closest("[data-select-all]");
    if (all) {
      var table = all.closest("table");
      $$("[data-row-select]", table).forEach(function (cb){ cb.checked = all.checked; cb.closest("tr").classList.toggle("is-selected", all.checked); });
    }
    var row = e.target.closest("[data-row-select]");
    if (row) row.closest("tr").classList.toggle("is-selected", row.checked);
  });

  /* ---------------------------------------------------------------- *
   * KANBAN (drag & drop)
   * ---------------------------------------------------------------- */
  var dragCard = null;
  doc.addEventListener("dragstart", function (e) {
    var card = e.target.closest("[data-kanban] .kanban-card"); if (!card) return;
    dragCard = card; card.classList.add("is-dragging");
    if (e.dataTransfer) e.dataTransfer.effectAllowed = "move";
  });
  doc.addEventListener("dragend", function () {
    if (dragCard) dragCard.classList.remove("is-dragging");
    $$("[data-kanban-col].is-drop").forEach(function (c){ c.classList.remove("is-drop"); });
    updateCounts(); dragCard = null;
  });
  doc.addEventListener("dragover", function (e) {
    var col = e.target.closest("[data-kanban-col]"); if (!col || !dragCard) return;
    e.preventDefault(); col.classList.add("is-drop");
    var list = $(".kanban-list", col) || col;
    var after = getDragAfter(list, e.clientY);
    if (after == null) list.appendChild(dragCard); else list.insertBefore(dragCard, after);
  });
  doc.addEventListener("dragleave", function (e) {
    var col = e.target.closest("[data-kanban-col]"); if (col && !col.contains(e.relatedTarget)) col.classList.remove("is-drop");
  });
  function getDragAfter(list, y) {
    var els = $$(".kanban-card:not(.is-dragging)", list);
    var closest = { offset: -Infinity, el: null };
    els.forEach(function (c) {
      var box = c.getBoundingClientRect(); var off = y - box.top - box.height / 2;
      if (off < 0 && off > closest.offset) closest = { offset: off, el: c };
    });
    return closest.el;
  }
  function updateCounts() {
    $$("[data-kanban-col]").forEach(function (col) {
      var c = $$(".kanban-card", col).length;
      var badge = $("[data-col-count]", col); if (badge) badge.textContent = c;
    });
  }
  updateCounts();

  /* ---------------------------------------------------------------- *
   * WIZARD
   * ---------------------------------------------------------------- */
  $$("[data-wizard]").forEach(function (wz) {
    var panels = $$("[data-wizard-panel]", wz);
    var steps = $$(".steps .step, .steps-vert .vstep", wz);
    var i = 0;
    function show() {
      panels.forEach(function (p, k){ p.hidden = k !== i; });
      steps.forEach(function (s, k){ s.classList.toggle("is-active", k === i); s.classList.toggle("is-complete", k < i); });
      var back = $("[data-wizard-back]", wz), next = $("[data-wizard-next]", wz), done = $("[data-wizard-done]", wz);
      if (back) back.disabled = i === 0;
      if (next) next.style.display = i === panels.length - 1 ? "none" : "";
      if (done) done.style.display = i === panels.length - 1 ? "" : "none";
    }
    wz.addEventListener("click", function (e) {
      if (e.target.closest("[data-wizard-next]")) { if (i < panels.length - 1) { i++; show(); } }
      else if (e.target.closest("[data-wizard-back]")) { if (i > 0) { i--; show(); } }
    });
    show();
  });

  /* ---------------------------------------------------------------- *
   * PROGRESS (linear fill + circular ring)
   * ---------------------------------------------------------------- */
  $$(".progress[data-value]").forEach(function (p) {
    var fill = $(".progress-fill", p); var v = Math.max(0, Math.min(100, +p.getAttribute("data-value")));
    if (fill) requestAnimationFrame(function(){ fill.style.width = v + "%"; });
    p.setAttribute("role", "progressbar"); p.setAttribute("aria-valuenow", v); p.setAttribute("aria-valuemin", "0"); p.setAttribute("aria-valuemax", "100");
  });
  $$(".progress-ring[data-value]").forEach(function (r) {
    var circ = $(".pr-fill", r); if (!circ) return;
    var radius = +circ.getAttribute("r"); var c = 2 * Math.PI * radius;
    var v = Math.max(0, Math.min(100, +r.getAttribute("data-value")));
    circ.style.strokeDasharray = c;
    circ.style.strokeDashoffset = c;
    requestAnimationFrame(function(){ circ.style.transition = "stroke-dashoffset .8s var(--ease-out)"; circ.style.strokeDashoffset = c * (1 - v / 100); });
  });

  /* ---------------------------------------------------------------- *
   * CODE COPY
   * ---------------------------------------------------------------- */
  doc.addEventListener("click", function (e) {
    var b = e.target.closest(".code-copy"); if (!b) return;
    var block = b.closest(".code-block"); var code = $("code", block);
    if (code && navigator.clipboard) {
      navigator.clipboard.writeText(code.textContent).then(function () {
        var t = b.textContent; b.textContent = "Copied!"; setTimeout(function(){ b.textContent = t; }, 1400);
      }).catch(function(){});
    }
  });

  /* ---------------------------------------------------------------- *
   * SIDEBAR collapse / mobile toggle
   * ---------------------------------------------------------------- */
  doc.addEventListener("click", function (e) {
    if (e.target.closest("[data-sidebar-collapse]")) {
      var shell = e.target.closest(".app-shell") || $(".app-shell");
      if (shell) shell.classList.toggle("collapsed");
    }
    if (e.target.closest("[data-sidebar-toggle]")) {
      var sb = $(".sidebar"); if (sb) sb.classList.toggle("is-open");
    }
  });

  /* ---------------------------------------------------------------- *
   * SCROLL REVEAL
   * ---------------------------------------------------------------- */
  if ("IntersectionObserver" in window && !prefersReduced) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.style.animation = "fade-up var(--duration-base) var(--ease-out) both"; io.unobserve(en.target); }
      });
    }, { threshold: 0.08 });
    $$("[data-reveal]").forEach(function (el) { el.style.opacity = "0"; io.observe(el); el.addEventListener("animationstart", function(){ el.style.opacity=""; }); });
  }

})();
