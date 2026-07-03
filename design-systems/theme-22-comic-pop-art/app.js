/* ============================================================================
   THEME 22 — COMIC POP ART  ·  app.js
   ----------------------------------------------------------------------------
   All interactions, vanilla JS, zero dependencies. Self-initializing via
   data-attributes + event delegation so a single include drives every page.
   Works over file:// (no fetch / no modules).
   ========================================================================== */
(function () {
  "use strict";

  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $  = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* =====================================================================
     1. THEME (light / dark) — persisted, respects OS default
     ===================================================================== */
  var THEME_KEY = "comic-theme";
  function getStoredTheme() { try { return localStorage.getItem(THEME_KEY); } catch (e) { return null; } }
  function storeTheme(t) { try { localStorage.setItem(THEME_KEY, t); } catch (e) {} }
  function applyTheme(t) {
    document.documentElement.setAttribute("data-theme", t);
    $$("[data-theme-toggle]").forEach(function (b) {
      b.setAttribute("aria-pressed", String(t === "dark"));
      var lbl = b.querySelector("[data-theme-label]");
      if (lbl) lbl.textContent = t === "dark" ? "LIGHTS ON" : "LIGHTS OUT";
    });
  }
  (function initTheme() {
    var stored = getStoredTheme();
    if (stored) applyTheme(stored);
    else {
      var dark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      applyTheme(dark ? "dark" : "light");
    }
  })();
  document.addEventListener("click", function (e) {
    var t = e.target.closest("[data-theme-toggle]");
    if (!t) return;
    var next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
    applyTheme(next); storeTheme(next);
    burstAt(t, next === "dark" ? "ZAP!" : "POW!");
  });

  /* =====================================================================
     2. ACTION BURST — a star "POW!" that pops at a point then fades
     ===================================================================== */
  var BURST_WORDS = ["POW!", "BAM!", "ZAP!", "WHAM!", "BOOM!", "KAPOW!", "ZONK!", "OOF!"];
  function burstAt(target, word) {
    if (prefersReduced) return;
    var rect = (target.getBoundingClientRect ? target.getBoundingClientRect() : { left: target.x, top: target.y, width: 0, height: 0 });
    var x = rect.left + rect.width / 2;
    var y = rect.top + rect.height / 2;
    var el = document.createElement("div");
    el.className = "fx-burst";
    el.setAttribute("aria-hidden", "true");
    el.textContent = word || BURST_WORDS[Math.floor(Math.random() * BURST_WORDS.length)];
    el.style.cssText =
      "position:fixed;left:" + x + "px;top:" + y + "px;transform:translate(-50%,-50%) rotate(-12deg);" +
      "z-index:1800;pointer-events:none;font-family:var(--font-action,sans-serif);font-size:2.2rem;" +
      "color:var(--yellow-400,#ffd400);-webkit-text-stroke:2.5px #0a0a09;paint-order:stroke fill;" +
      "text-shadow:4px 4px 0 #0a0a09;animation:fx-burst-pop .6s cubic-bezier(.2,1.6,.4,1) forwards;";
    document.body.appendChild(el);
    setTimeout(function () { el.remove(); }, 650);
  }
  // inject keyframes once
  (function () {
    var s = document.createElement("style");
    s.textContent =
      "@keyframes fx-burst-pop{0%{opacity:0;transform:translate(-50%,-50%) scale(.2) rotate(-30deg)}" +
      "55%{opacity:1;transform:translate(-50%,-50%) scale(1.25) rotate(8deg)}" +
      "100%{opacity:0;transform:translate(-50%,-90%) scale(1) rotate(-6deg)}}";
    document.head.appendChild(s);
  })();
  document.addEventListener("click", function (e) {
    var t = e.target.closest("[data-burst]");
    if (!t) return;
    burstAt(t, t.getAttribute("data-burst") || undefined);
  });

  /* =====================================================================
     3. TOASTS — programmatic + declarative triggers
     ===================================================================== */
  function ensureToastRegion() {
    var r = $(".toast-region");
    if (!r) {
      r = document.createElement("div");
      r.className = "toast-region";
      r.setAttribute("role", "region");
      r.setAttribute("aria-live", "polite");
      r.setAttribute("aria-label", "Notifications");
      document.body.appendChild(r);
    }
    return r;
  }
  var ICONS = {
    success: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
    info:    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><line x1="12" y1="11" x2="12" y2="16"/><circle cx="12" cy="7.5" r="1.4" fill="currentColor" stroke="none"/></svg>',
    warning: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><line x1="12" y1="8" x2="12" y2="13"/><circle cx="12" cy="17" r="1.4" fill="currentColor" stroke="none"/></svg>',
    danger:  '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>'
  };
  function toast(opts) {
    opts = opts || {};
    var type = opts.type || "success";
    var region = ensureToastRegion();
    var el = document.createElement("div");
    el.className = "toast " + type;
    el.setAttribute("role", "status");
    el.innerHTML =
      '<span class="toast-icon" aria-hidden="true">' + (ICONS[type] || ICONS.info) + "</span>" +
      '<div><div class="toast-title">' + (opts.title || "Done!") + "</div>" +
      (opts.body ? '<div class="toast-body">' + opts.body + "</div>" : "") + "</div>" +
      '<button class="toast-close btn-icon btn-sm btn-ghost" aria-label="Dismiss">✕</button>';
    region.appendChild(el);
    var ttl = opts.duration || 4200;
    var timer = setTimeout(close, ttl);
    function close() {
      clearTimeout(timer);
      el.classList.add("is-leaving");
      setTimeout(function () { el.remove(); }, 260);
    }
    el.querySelector(".toast-close").addEventListener("click", close);
    return close;
  }
  window.comicToast = toast;
  document.addEventListener("click", function (e) {
    var t = e.target.closest("[data-toast]");
    if (!t) return;
    toast({
      type: t.getAttribute("data-toast") || "success",
      title: t.getAttribute("data-toast-title") || "Nice!",
      body: t.getAttribute("data-toast-body") || ""
    });
  });

  /* =====================================================================
     4. MODAL / DIALOG — focus trap, ESC, scrim click
     ===================================================================== */
  var lastFocused = null;
  function openOverlay(overlay) {
    if (!overlay) return;
    lastFocused = document.activeElement;
    overlay.classList.add("is-open");
    overlay.removeAttribute("hidden");
    document.body.style.overflow = "hidden";
    var focusable = overlay.querySelector("[autofocus],button,[href],input,select,textarea,[tabindex]:not([tabindex='-1'])");
    if (focusable) setTimeout(function () { focusable.focus(); }, 30);
  }
  function closeOverlay(overlay) {
    if (!overlay) return;
    overlay.classList.remove("is-open");
    document.body.style.overflow = "";
    setTimeout(function () { overlay.setAttribute("hidden", ""); }, 220);
    if (lastFocused) lastFocused.focus();
  }
  document.addEventListener("click", function (e) {
    var opener = e.target.closest("[data-modal-open]");
    if (opener) { openOverlay(document.getElementById(opener.getAttribute("data-modal-open"))); return; }
    var closer = e.target.closest("[data-modal-close]");
    if (closer) { closeOverlay(closer.closest(".overlay")); return; }
    // scrim click (only when clicking the overlay itself, not the modal)
    if (e.target.classList && e.target.classList.contains("overlay")) closeOverlay(e.target);
  });

  /* =====================================================================
     5. DRAWER
     ===================================================================== */
  function closeDrawer(d) {
    d.classList.remove("is-open");
    var scrim = document.getElementById(d.getAttribute("data-scrim"));
    if (scrim) closeOverlay(scrim);
    document.body.style.overflow = "";
  }
  document.addEventListener("click", function (e) {
    var opener = e.target.closest("[data-drawer-open]");
    if (opener) {
      var d = document.getElementById(opener.getAttribute("data-drawer-open"));
      if (d) {
        d.classList.add("is-open");
        var scrim = document.getElementById(d.getAttribute("data-scrim"));
        if (scrim) openOverlay(scrim);
        document.body.style.overflow = "hidden";
      }
      return;
    }
    var closer = e.target.closest("[data-drawer-close]");
    if (closer) {
      var dr = document.getElementById(closer.getAttribute("data-drawer-close")) || closer.closest(".drawer");
      if (dr) closeDrawer(dr);
    }
  });

  /* =====================================================================
     6. GLOBAL ESC + simple focus trap for open overlays
     ===================================================================== */
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      var cmdk = $(".cmdk-overlay.is-open"); if (cmdk) { closeCmdk(); return; }
      var openOv = $(".overlay.is-open"); if (openOv) { closeOverlay(openOv); return; }
      var openDr = $(".drawer.is-open"); if (openDr) { closeDrawer(openDr); return; }
      $$(".menu.is-open,.context-menu.is-open,.combo.is-open,.popover.is-open").forEach(function (m) {
        m.classList.remove("is-open");
      });
    }
    if (e.key === "Tab") {
      var ov = $(".overlay.is-open, .drawer.is-open, .cmdk-overlay.is-open");
      if (!ov) return;
      var f = $$("button,[href],input,select,textarea,[tabindex]:not([tabindex='-1'])", ov)
        .filter(function (el) { return !el.disabled && el.offsetParent !== null; });
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  /* =====================================================================
     7. TABS  (roving + click)
     ===================================================================== */
  $$(".tabs").forEach(function (tabs) {
    var tablist = $(".tablist", tabs);
    if (!tablist) return;
    var tabBtns = $$(".tab", tablist);
    function select(tab) {
      tabBtns.forEach(function (b) {
        var on = b === tab;
        b.setAttribute("aria-selected", String(on));
        b.tabIndex = on ? 0 : -1;
        var panel = document.getElementById(b.getAttribute("aria-controls"));
        if (panel) panel.hidden = !on;
      });
    }
    tablist.addEventListener("click", function (e) {
      var t = e.target.closest(".tab"); if (t) select(t);
    });
    tablist.addEventListener("keydown", function (e) {
      var i = tabBtns.indexOf(document.activeElement);
      if (i < 0) return;
      var ni = i;
      if (e.key === "ArrowRight") ni = (i + 1) % tabBtns.length;
      else if (e.key === "ArrowLeft") ni = (i - 1 + tabBtns.length) % tabBtns.length;
      else if (e.key === "Home") ni = 0;
      else if (e.key === "End") ni = tabBtns.length - 1;
      else return;
      e.preventDefault(); tabBtns[ni].focus(); select(tabBtns[ni]);
    });
  });

  /* =====================================================================
     8. ACCORDION
     ===================================================================== */
  document.addEventListener("click", function (e) {
    var trg = e.target.closest(".accordion-trigger");
    if (!trg) return;
    var item = trg.closest(".accordion-item");
    var panel = $(".accordion-panel", item);
    var open = trg.getAttribute("aria-expanded") === "true";
    var single = trg.closest(".accordion") && trg.closest(".accordion").hasAttribute("data-single");
    if (single && !open) {
      $$(".accordion-trigger[aria-expanded='true']", trg.closest(".accordion")).forEach(function (o) {
        o.setAttribute("aria-expanded", "false");
        $(".accordion-panel", o.closest(".accordion-item")).classList.remove("is-open");
      });
    }
    trg.setAttribute("aria-expanded", String(!open));
    panel.classList.toggle("is-open", !open);
  });

  /* =====================================================================
     9. DROPDOWN / MENU  (click toggle, outside close, arrow nav)
     ===================================================================== */
  document.addEventListener("click", function (e) {
    var trigger = e.target.closest("[data-menu]");
    if (trigger) {
      var menu = document.getElementById(trigger.getAttribute("data-menu"));
      if (menu) {
        var willOpen = !menu.classList.contains("is-open");
        $$(".menu.is-open").forEach(function (m) { if (m !== menu) m.classList.remove("is-open"); });
        menu.classList.toggle("is-open", willOpen);
        trigger.setAttribute("aria-expanded", String(willOpen));
        if (willOpen) { var fi = $(".menu-item", menu); if (fi) fi.focus(); }
      }
      return;
    }
    if (!e.target.closest(".menu") && !e.target.closest(".combo")) {
      $$(".menu.is-open").forEach(function (m) { m.classList.remove("is-open"); });
    }
    if (!e.target.closest(".context-menu")) {
      $$(".context-menu.is-open").forEach(function (m) { m.classList.remove("is-open"); });
    }
  });

  /* =====================================================================
     10. CONTEXT MENU
     ===================================================================== */
  $$("[data-context-menu]").forEach(function (zone) {
    var menu = document.getElementById(zone.getAttribute("data-context-menu"));
    if (!menu) return;
    zone.addEventListener("contextmenu", function (e) {
      e.preventDefault();
      $$(".context-menu.is-open").forEach(function (m) { m.classList.remove("is-open"); });
      menu.classList.add("is-open");
      var mw = menu.offsetWidth, mh = menu.offsetHeight;
      var x = Math.min(e.clientX, window.innerWidth - mw - 8);
      var y = Math.min(e.clientY, window.innerHeight - mh - 8);
      menu.style.left = x + "px"; menu.style.top = y + "px";
    });
  });

  /* =====================================================================
     11. COMMAND PALETTE (⌘K / Ctrl-K)
     ===================================================================== */
  var cmdk = $(".cmdk-overlay");
  function openCmdk() {
    if (!cmdk) return;
    cmdk.classList.add("is-open");
    document.body.style.overflow = "hidden";
    var input = $(".cmdk-input", cmdk);
    if (input) { input.value = ""; filterCmdk(""); setTimeout(function () { input.focus(); }, 30); }
  }
  function closeCmdk() {
    if (!cmdk) return;
    cmdk.classList.remove("is-open");
    document.body.style.overflow = "";
  }
  function filterCmdk(q) {
    if (!cmdk) return;
    q = q.toLowerCase().trim();
    var items = $$(".cmdk-item", cmdk);
    var any = false;
    items.forEach(function (it) {
      var match = it.textContent.toLowerCase().indexOf(q) !== -1;
      it.style.display = match ? "" : "none";
      it.classList.remove("is-active");
      if (match) any = true;
    });
    $$(".cmdk-group", cmdk).forEach(function (g) {
      var visible = $$(".cmdk-item", g).some(function (i) { return i.style.display !== "none"; });
      g.style.display = visible ? "" : "none";
    });
    var empty = $(".cmdk-empty", cmdk);
    if (empty) empty.style.display = any ? "none" : "block";
    var firstVisible = items.filter(function (i) { return i.style.display !== "none"; })[0];
    if (firstVisible) firstVisible.classList.add("is-active");
  }
  if (cmdk) {
    var cInput = $(".cmdk-input", cmdk);
    if (cInput) cInput.addEventListener("input", function () { filterCmdk(this.value); });
    cmdk.addEventListener("click", function (e) { if (e.target === cmdk) closeCmdk(); });
    cmdk.addEventListener("keydown", function (e) {
      var visible = $$(".cmdk-item", cmdk).filter(function (i) { return i.style.display !== "none"; });
      var idx = visible.findIndex(function (i) { return i.classList.contains("is-active"); });
      if (e.key === "ArrowDown") { e.preventDefault(); move(1); }
      else if (e.key === "ArrowUp") { e.preventDefault(); move(-1); }
      else if (e.key === "Enter") { e.preventDefault(); if (visible[idx]) activate(visible[idx]); }
      function move(d) {
        if (!visible.length) return;
        if (idx >= 0) visible[idx].classList.remove("is-active");
        var ni = (idx + d + visible.length) % visible.length;
        visible[ni].classList.add("is-active");
        visible[ni].scrollIntoView({ block: "nearest" });
      }
    });
    $$(".cmdk-item", cmdk).forEach(function (it) {
      it.addEventListener("click", function () { activate(it); });
    });
    function activate(item) {
      var href = item.getAttribute("data-href");
      var act = item.getAttribute("data-action");
      closeCmdk();
      if (href) { window.location.href = href; }
      else if (act === "toggle-theme") { var n = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark"; applyTheme(n); storeTheme(n); }
      else { toast({ title: item.textContent.trim(), body: "Command executed", type: "info" }); }
    }
  }
  document.addEventListener("keydown", function (e) {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      if (cmdk && cmdk.classList.contains("is-open")) closeCmdk(); else openCmdk();
    }
  });
  document.addEventListener("click", function (e) {
    if (e.target.closest("[data-cmdk-open]")) { e.preventDefault(); openCmdk(); }
  });

  /* =====================================================================
     12. SIDEBAR collapse + mobile toggle
     ===================================================================== */
  document.addEventListener("click", function (e) {
    if (e.target.closest("[data-sidebar-collapse]")) {
      var shell = $(".app-shell"); if (shell) shell.classList.toggle("collapsed");
    }
    if (e.target.closest("[data-sidebar-toggle]")) {
      var sb = $(".sidebar"); if (sb) sb.classList.toggle("is-open");
    }
  });

  /* =====================================================================
     13. SLIDER value display
     ===================================================================== */
  $$(".slider input[type='range']").forEach(function (input) {
    var out = input.closest(".slider").querySelector(".slider-value");
    function upd() {
      if (out) out.textContent = (input.dataset.prefix || "") + input.value + (input.dataset.suffix || "");
      var pct = (input.value - input.min) / (input.max - input.min) * 100;
      input.style.background = "linear-gradient(90deg, var(--blue-300) " + pct + "%, var(--neutral-200) " + pct + "%)";
    }
    input.addEventListener("input", upd); upd();
  });

  /* =====================================================================
     14. STEPPER (number +/-)
     ===================================================================== */
  $$(".stepper").forEach(function (st) {
    var input = $("input", st);
    var dec = $("[data-step='-']", st), inc = $("[data-step='+']", st);
    function clamp(v) {
      var min = input.min !== "" ? +input.min : -Infinity;
      var max = input.max !== "" ? +input.max : Infinity;
      return Math.max(min, Math.min(max, v));
    }
    if (dec) dec.addEventListener("click", function () { input.value = clamp((+input.value || 0) - (+input.step || 1)); input.dispatchEvent(new Event("change")); });
    if (inc) inc.addEventListener("click", function () { input.value = clamp((+input.value || 0) + (+input.step || 1)); input.dispatchEvent(new Event("change")); });
  });

  /* =====================================================================
     15. RATING (stars)
     ===================================================================== */
  $$(".rating").forEach(function (rt) {
    var btns = $$("button", rt);
    function paint(n) { btns.forEach(function (b, i) { b.classList.toggle("is-on", i < n); }); }
    var current = +rt.getAttribute("data-value") || 0;
    paint(current);
    btns.forEach(function (b, i) {
      b.addEventListener("mouseenter", function () { paint(i + 1); });
      b.addEventListener("focus", function () { paint(i + 1); });
      b.addEventListener("click", function () {
        current = i + 1; rt.setAttribute("data-value", current); paint(current);
        btns.forEach(function (x, j) { x.setAttribute("aria-checked", String(j === i)); });
      });
    });
    rt.addEventListener("mouseleave", function () { paint(current); });
    rt.addEventListener("blur", function () { paint(current); }, true);
  });

  /* =====================================================================
     16. SEARCHBAR clear
     ===================================================================== */
  $$(".searchbar").forEach(function (sb) {
    var input = $(".input", sb), clear = $(".clear-btn", sb);
    if (!input) return;
    function upd() { sb.classList.toggle("has-value", input.value.length > 0); }
    input.addEventListener("input", upd); upd();
    if (clear) clear.addEventListener("click", function () { input.value = ""; upd(); input.focus(); });
  });

  /* =====================================================================
     17. COMBOBOX / MULTISELECT / CHIPINPUT
     ===================================================================== */
  $$(".combo").forEach(function (combo) {
    var control = $(".combo-control", combo);
    var input = $("input", control);
    var menu = $(".combo-menu", combo);
    var multi = combo.hasAttribute("data-multi");
    var chipInput = combo.hasAttribute("data-chip");
    if (!control) return;

    function open() { combo.classList.add("is-open"); filter(input ? input.value : ""); }
    function close() { combo.classList.remove("is-open"); }
    control.addEventListener("click", function () { if (input) input.focus(); open(); });

    function filter(q) {
      if (!menu) return;
      q = (q || "").toLowerCase();
      var any = false;
      $$(".combo-option", menu).forEach(function (o) {
        var m = o.textContent.toLowerCase().indexOf(q) !== -1;
        o.style.display = m ? "" : "none";
        if (m) any = true;
      });
      var empty = $(".combo-empty", menu);
      if (empty) empty.style.display = any ? "none" : "block";
    }
    if (input) {
      input.addEventListener("input", function () { open(); filter(this.value); });
      input.addEventListener("keydown", function (e) {
        if (chipInput && (e.key === "Enter" || e.key === ",") && this.value.trim()) {
          e.preventDefault(); addChip(this.value.trim()); this.value = "";
        }
        if (e.key === "Backspace" && !this.value) {
          var chips = $$(".chip", control); if (chips.length) chips[chips.length - 1].remove();
        }
      });
    }
    if (menu) {
      $$(".combo-option", menu).forEach(function (opt) {
        opt.addEventListener("click", function () {
          if (multi) {
            var sel = opt.getAttribute("aria-selected") === "true";
            opt.setAttribute("aria-selected", String(!sel));
            if (!sel) addChip(opt.textContent.trim(), opt); else removeChipByLabel(opt.textContent.trim());
            if (input) input.focus();
          } else {
            if (input) input.value = opt.textContent.trim();
            $$(".combo-option", menu).forEach(function (o) { o.setAttribute("aria-selected", "false"); });
            opt.setAttribute("aria-selected", "true");
            close();
          }
        });
      });
    }
    function addChip(label, opt) {
      if (removeChipByLabel(label, true)) return; // already there
      var chip = document.createElement("span");
      chip.className = "chip";
      chip.innerHTML = label + ' <button type="button" aria-label="Remove ' + label + '">✕</button>';
      chip.querySelector("button").addEventListener("click", function (ev) {
        ev.stopPropagation(); chip.remove();
        if (opt) opt.setAttribute("aria-selected", "false");
      });
      control.insertBefore(chip, input);
    }
    function removeChipByLabel(label, peek) {
      var found = false;
      $$(".chip", control).forEach(function (c) {
        if (c.textContent.replace("✕", "").trim() === label) {
          if (peek) { found = true; return; }
          c.remove(); found = true;
        }
      });
      return found;
    }
  });

  /* =====================================================================
     18. FILE UPLOAD dropzone
     ===================================================================== */
  $$(".dropzone").forEach(function (dz) {
    var input = $("input[type='file']", dz) || (function () {
      var i = document.createElement("input"); i.type = "file"; i.multiple = true; i.hidden = true; dz.appendChild(i); return i;
    })();
    var list = document.getElementById(dz.getAttribute("data-file-list"));
    dz.addEventListener("click", function (e) { if (e.target.tagName !== "INPUT") input.click(); });
    dz.addEventListener("dragover", function (e) { e.preventDefault(); dz.classList.add("is-drag"); });
    dz.addEventListener("dragleave", function () { dz.classList.remove("is-drag"); });
    dz.addEventListener("drop", function (e) { e.preventDefault(); dz.classList.remove("is-drag"); render(e.dataTransfer.files); });
    input.addEventListener("change", function () { render(input.files); });
    function render(files) {
      if (!list) return;
      Array.prototype.forEach.call(files, function (f) {
        var row = document.createElement("div");
        row.className = "file-row";
        row.innerHTML =
          '<span aria-hidden="true">📄</span><span>' + f.name + "</span>" +
          '<span class="file-meta">' + (f.size ? (f.size / 1024).toFixed(1) + " KB" : "") + "</span>" +
          '<button class="btn-icon btn-sm btn-ghost" aria-label="Remove">✕</button>';
        row.querySelector("button").addEventListener("click", function () { row.remove(); });
        list.appendChild(row);
      });
      toast({ title: "File added!", body: files.length + " file(s) ready", type: "info" });
    }
  });

  /* =====================================================================
     19. CAROUSEL
     ===================================================================== */
  $$(".carousel").forEach(function (car) {
    var track = $(".carousel-track", car);
    var slides = $$(".carousel-slide", car);
    var prev = $(".carousel-btn.prev", car), next = $(".carousel-btn.next", car);
    var dotsWrap = $(".carousel-dots", car);
    var i = 0;
    if (dotsWrap) {
      slides.forEach(function (_, idx) {
        var d = document.createElement("button");
        d.setAttribute("aria-label", "Go to slide " + (idx + 1));
        d.addEventListener("click", function () { go(idx); });
        dotsWrap.appendChild(d);
      });
    }
    function go(n) {
      i = (n + slides.length) % slides.length;
      track.style.transform = "translateX(-" + (i * 100) + "%)";
      if (dotsWrap) $$("button", dotsWrap).forEach(function (d, idx) { d.classList.toggle("is-active", idx === i); });
    }
    if (prev) prev.addEventListener("click", function () { go(i - 1); });
    if (next) next.addEventListener("click", function () { go(i + 1); });
    car.setAttribute("tabindex", "0");
    car.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") go(i - 1);
      if (e.key === "ArrowRight") go(i + 1);
    });
    go(0);
    if (car.hasAttribute("data-autoplay") && !prefersReduced) {
      setInterval(function () { go(i + 1); }, +car.getAttribute("data-autoplay") || 4000);
    }
  });

  /* =====================================================================
     20. TABLE — sort, select-all, row select
     ===================================================================== */
  $$("table.table[data-sortable]").forEach(function (table) {
    var tbody = $("tbody", table);
    $$("th.sortable", table).forEach(function (th, colIndex) {
      th.addEventListener("click", function () {
        var idx = Array.prototype.indexOf.call(th.parentNode.children, th);
        var dir = th.getAttribute("aria-sort") === "ascending" ? "descending" : "ascending";
        $$("th", table).forEach(function (h) { h.removeAttribute("aria-sort"); });
        th.setAttribute("aria-sort", dir);
        var rows = $$("tr", tbody);
        var type = th.getAttribute("data-type") || "text";
        rows.sort(function (a, b) {
          var av = a.children[idx].getAttribute("data-sort") || a.children[idx].textContent.trim();
          var bv = b.children[idx].getAttribute("data-sort") || b.children[idx].textContent.trim();
          if (type === "number") { av = parseFloat(av.replace(/[^0-9.\-]/g, "")) || 0; bv = parseFloat(bv.replace(/[^0-9.\-]/g, "")) || 0; }
          if (av < bv) return dir === "ascending" ? -1 : 1;
          if (av > bv) return dir === "ascending" ? 1 : -1;
          return 0;
        });
        rows.forEach(function (r) { tbody.appendChild(r); });
      });
    });
    var selectAll = $("[data-select-all]", table);
    if (selectAll) {
      selectAll.addEventListener("change", function () {
        $$("tbody [data-row-select]", table).forEach(function (cb) {
          cb.checked = selectAll.checked;
          cb.closest("tr").classList.toggle("is-selected", selectAll.checked);
        });
      });
    }
    if (tbody) tbody.addEventListener("change", function (e) {
      var cb = e.target.closest("[data-row-select]");
      if (cb) cb.closest("tr").classList.toggle("is-selected", cb.checked);
    });
  });

  /* =====================================================================
     21. CIRCULAR PROGRESS — set offset from data-value
     ===================================================================== */
  $$(".progress-ring").forEach(function (ring) {
    var fill = $(".pr-fill", ring);
    if (!fill) return;
    var r = fill.r.baseVal.value;
    var c = 2 * Math.PI * r;
    var val = +ring.getAttribute("data-value") || 0;
    fill.style.strokeDasharray = c;
    fill.style.strokeDashoffset = c;
    // animate in
    requestAnimationFrame(function () {
      fill.style.strokeDashoffset = c * (1 - val / 100);
    });
    var label = $(".pr-label", ring);
    if (label) label.textContent = val + "%";
  });

  /* =====================================================================
     22. LINEAR PROGRESS — animate width from data-value
     ===================================================================== */
  $$(".progress[data-value] .progress-fill, .progress .progress-fill[data-value]").forEach(function () {});
  $$(".progress[data-value]").forEach(function (p) {
    var fill = $(".progress-fill", p);
    if (fill) requestAnimationFrame(function () { fill.style.width = (+p.getAttribute("data-value")) + "%"; });
  });

  /* =====================================================================
     23. SIMPLE DATEPICKER / CALENDAR rendering
     ===================================================================== */
  $$(".calendar[data-calendar]").forEach(function (cal) {
    var grid = $(".calendar-grid", cal);
    var title = $(".calendar-head .title", cal);
    var view = new Date();
    var selected = null;
    var DOW = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
    var MON = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
    function render() {
      if (!grid) return;
      grid.innerHTML = "";
      DOW.forEach(function (d) { var el = document.createElement("div"); el.className = "dow"; el.textContent = d; grid.appendChild(el); });
      var y = view.getFullYear(), m = view.getMonth();
      if (title) title.textContent = MON[m] + " " + y;
      var first = new Date(y, m, 1).getDay();
      var days = new Date(y, m + 1, 0).getDate();
      var today = new Date();
      for (var b = 0; b < first; b++) { var sp = document.createElement("div"); grid.appendChild(sp); }
      for (var d = 1; d <= days; d++) {
        var cell = document.createElement("button");
        cell.type = "button"; cell.className = "calendar-day"; cell.textContent = d;
        if (d === today.getDate() && m === today.getMonth() && y === today.getFullYear()) cell.classList.add("is-today");
        if (selected && d === selected.d && m === selected.m && y === selected.y) cell.classList.add("is-selected");
        (function (dd) {
          cell.addEventListener("click", function () {
            selected = { d: dd, m: m, y: y };
            render();
            var out = document.getElementById(cal.getAttribute("data-output"));
            if (out) out.value = (m + 1) + "/" + dd + "/" + y;
          });
        })(d);
        grid.appendChild(cell);
      }
    }
    var prev = $(".cal-prev", cal), next = $(".cal-next", cal);
    if (prev) prev.addEventListener("click", function () { view.setMonth(view.getMonth() - 1); render(); });
    if (next) next.addEventListener("click", function () { view.setMonth(view.getMonth() + 1); render(); });
    render();
  });

  /* =====================================================================
     24. PRICING toggle (month / year) — generic data-price switch
     ===================================================================== */
  $$("[data-billing-toggle]").forEach(function (tog) {
    tog.addEventListener("change", function () {
      var yearly = tog.checked;
      $$("[data-price-month]").forEach(function (el) {
        el.textContent = yearly ? el.getAttribute("data-price-year") : el.getAttribute("data-price-month");
      });
      $$("[data-price-note]").forEach(function (el) {
        el.textContent = yearly ? "/year · save 20%" : "/month";
      });
    });
  });

  /* =====================================================================
     25. COPY-TO-CLIPBOARD (code blocks)
     ===================================================================== */
  document.addEventListener("click", function (e) {
    var btn = e.target.closest(".code-copy, [data-copy]");
    if (!btn) return;
    var sel = btn.getAttribute("data-copy");
    var text = sel ? (document.querySelector(sel) || {}).textContent : (btn.closest(".code-block") || {}).querySelector ? btn.closest(".code-block").querySelector("code").textContent : "";
    if (navigator.clipboard && text) {
      navigator.clipboard.writeText(text).then(function () { toast({ title: "Copied!", type: "success", duration: 1800 }); });
    } else {
      toast({ title: "Copied!", type: "success", duration: 1800 });
    }
  });

  /* =====================================================================
     26. SEGMENTED CONTROL (aria-pressed switch)
     ===================================================================== */
  $$(".segmented").forEach(function (seg) {
    seg.addEventListener("click", function (e) {
      var b = e.target.closest("button"); if (!b) return;
      $$("button", seg).forEach(function (x) { x.setAttribute("aria-pressed", "false"); x.classList.remove("is-active"); });
      b.setAttribute("aria-pressed", "true"); b.classList.add("is-active");
      seg.dispatchEvent(new CustomEvent("segment-change", { detail: { value: b.getAttribute("data-value") || b.textContent } }));
    });
  });

  /* =====================================================================
     27. BUTTON GROUP toggle (single-select)
     ===================================================================== */
  $$(".btn-group[data-toggle]").forEach(function (g) {
    g.addEventListener("click", function (e) {
      var b = e.target.closest(".btn"); if (!b) return;
      $$(".btn", g).forEach(function (x) { x.setAttribute("aria-pressed", "false"); x.classList.remove("is-active"); });
      b.setAttribute("aria-pressed", "true"); b.classList.add("is-active");
    });
  });

  /* =====================================================================
     28. KANBAN drag & drop (HTML5 DnD, lightweight)
     ===================================================================== */
  $$("[data-kanban]").forEach(function (board) {
    var dragged = null;
    $$(".kanban-card", board).forEach(makeDraggable);
    function makeDraggable(card) {
      card.setAttribute("draggable", "true");
      card.addEventListener("dragstart", function () { dragged = card; setTimeout(function () { card.style.opacity = "0.4"; }, 0); });
      card.addEventListener("dragend", function () { card.style.opacity = ""; dragged = null; });
    }
    $$("[data-kanban-col]", board).forEach(function (col) {
      var dropList = $(".kanban-list", col) || col;
      col.addEventListener("dragover", function (e) { e.preventDefault(); col.classList.add("is-drop"); });
      col.addEventListener("dragleave", function () { col.classList.remove("is-drop"); });
      col.addEventListener("drop", function (e) {
        e.preventDefault(); col.classList.remove("is-drop");
        if (dragged) { dropList.appendChild(dragged); updateCounts(); }
      });
    });
    function updateCounts() {
      $$("[data-kanban-col]", board).forEach(function (col) {
        var count = $$(".kanban-card", col).length;
        var badge = $("[data-col-count]", col);
        if (badge) badge.textContent = count;
      });
    }
  });

  /* =====================================================================
     29. POPOVER toggle
     ===================================================================== */
  document.addEventListener("click", function (e) {
    var trg = e.target.closest("[data-popover]");
    if (trg) {
      var pop = document.getElementById(trg.getAttribute("data-popover"));
      if (pop) {
        var willOpen = !pop.classList.contains("is-open");
        $$(".popover.is-open").forEach(function (p) { p.classList.remove("is-open"); });
        pop.classList.toggle("is-open", willOpen);
        trg.setAttribute("aria-expanded", String(willOpen));
      }
      return;
    }
    if (!e.target.closest(".popover")) $$(".popover.is-open").forEach(function (p) { p.classList.remove("is-open"); });
  });

  /* =====================================================================
     30. SCROLL REVEAL (intersection) — staggered comic pop
     ===================================================================== */
  if (!prefersReduced && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in-view"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    $$("[data-reveal]").forEach(function (el) { io.observe(el); });
  } else {
    $$("[data-reveal]").forEach(function (el) { el.classList.add("in-view"); });
  }

  /* =====================================================================
     31. ONBOARDING WIZARD step nav (generic)
     ===================================================================== */
  $$("[data-wizard]").forEach(function (wiz) {
    var steps = $$("[data-wizard-panel]", wiz);
    var dots = $$(".step", wiz);
    var cur = 0;
    function show(n) {
      cur = Math.max(0, Math.min(steps.length - 1, n));
      steps.forEach(function (s, i) { s.hidden = i !== cur; });
      dots.forEach(function (d, i) {
        d.classList.toggle("is-active", i === cur);
        d.classList.toggle("is-complete", i < cur);
      });
      var back = $("[data-wizard-back]", wiz), nextB = $("[data-wizard-next]", wiz), done = $("[data-wizard-done]", wiz);
      if (back) back.disabled = cur === 0;
      if (nextB) nextB.style.display = cur === steps.length - 1 ? "none" : "";
      if (done) done.style.display = cur === steps.length - 1 ? "" : "none";
    }
    wiz.addEventListener("click", function (e) {
      if (e.target.closest("[data-wizard-next]")) { show(cur + 1); burstAt(e.target.closest("[data-wizard-next]"), "NEXT!"); }
      if (e.target.closest("[data-wizard-back]")) show(cur - 1);
      if (e.target.closest("[data-wizard-done]")) { toast({ title: "All set!", body: "Welcome aboard, hero!", type: "success" }); burstAt(wiz, "HOORAY!"); }
    });
    show(0);
  });

  /* =====================================================================
     32. Reveal helper styles (inject)
     ===================================================================== */
  (function () {
    var s = document.createElement("style");
    s.textContent =
      "[data-reveal]{opacity:0;transform:translateY(22px) scale(.98);transition:opacity .5s var(--ease-out,ease),transform .5s var(--ease-emphasized,ease)}" +
      "[data-reveal].in-view{opacity:1;transform:none}" +
      "@media (prefers-reduced-motion: reduce){[data-reveal]{opacity:1!important;transform:none!important}}" +
      "[data-kanban-col].is-drop .kanban-list{outline:3px dashed var(--blue-500);outline-offset:4px;border-radius:8px}";
    document.head.appendChild(s);
  })();

  /* =====================================================================
     33. Year stamps + ready ping
     ===================================================================== */
  $$("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });

  console.log("%c COMIC POP ART — design system ready! ", "background:#ffd400;color:#0a0a09;font-weight:900;padding:4px 10px;border-radius:4px");
})();
