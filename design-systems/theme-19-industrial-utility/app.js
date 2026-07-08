/* ============================================================================
   THEME 19 — INDUSTRIAL UTILITY  ·  app.js
   순수 바닐라 JS. 모든 인터랙션 + 테마 전환. file:// 더블클릭으로 동작.
   이벤트 위임 기반 — 페이지마다 필요한 컴포넌트만 마크업하면 자동 연결.
   ============================================================================ */
(function () {
  "use strict";

  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var on = function (el, ev, fn, opt) { el && el.addEventListener(ev, fn, opt); };
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* =========================================================================
     FOCUS TRAP — 오버레이/드로어/모바일 사이드바 공용. 요소별 WeakMap 핸들러.
     ========================================================================= */
  var FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';
  var trapHandlers = new WeakMap();
  function focusables(container) {
    return $$(FOCUSABLE, container).filter(function (n) {
      return n.offsetWidth > 0 || n.offsetHeight > 0 || n === document.activeElement;
    });
  }
  function trapFocus(container) {
    if (!container || trapHandlers.has(container)) return;
    function handler(e) {
      if (e.key !== "Tab") return;
      var nodes = focusables(container);
      if (!nodes.length) return;
      var first = nodes[0], last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
    container.addEventListener("keydown", handler);
    trapHandlers.set(container, handler);
  }
  function releaseFocus(container) {
    if (!container) return;
    var h = trapHandlers.get(container);
    if (h) { container.removeEventListener("keydown", h); trapHandlers.delete(container); }
  }

  /* =========================================================================
     MOBILE SIDEBAR (app-shell 오프캔버스) — 스크림 + 포커스 트랩 + ESC + 복원
     ========================================================================= */
  var mobileNavShell = null, mobileNavTrigger = null;
  function ensureAppScrim() {
    var s = $(".app-scrim");
    if (!s) { s = document.createElement("div"); s.className = "app-scrim"; document.body.appendChild(s); on(s, "click", closeMobileNav); }
    return s;
  }
  function openMobileNav(shell, trigger) {
    mobileNavShell = shell; mobileNavTrigger = trigger || null;
    shell.setAttribute("data-mobile-open", "true");
    ensureAppScrim().classList.add("is-on");
    document.body.style.overflow = "hidden";
    var sb = $(".sidebar", shell);
    if (sb) { trapFocus(sb); var f = sb.querySelector("a,button,[tabindex]"); if (f) setTimeout(function () { f.focus(); }, 60); }
  }
  function closeMobileNav() {
    var shell = mobileNavShell || $(".app-shell[data-mobile-open='true']");
    if (!shell) return;
    shell.setAttribute("data-mobile-open", "false");
    var scrim = $(".app-scrim"); if (scrim) scrim.classList.remove("is-on");
    document.body.style.overflow = "";
    var sb = $(".sidebar", shell); if (sb) releaseFocus(sb);
    if (mobileNavTrigger) mobileNavTrigger.focus();
    mobileNavShell = null; mobileNavTrigger = null;
  }
  // 사이드바 링크 클릭 시(같은 페이지 이동 포함) 오프캔버스 닫기
  on(document, "click", function (e) {
    if (mobileNavShell && e.target.closest(".sidebar a")) closeMobileNav();
  });

  /* =========================================================================
     THEME TOGGLE (dark 정본 / light) — localStorage 영속
     ========================================================================= */
  var STORE_KEY = "theme19-mode";
  function applyTheme(mode) {
    document.documentElement.setAttribute("data-theme", mode);
    $$("[data-action='toggle-theme']").forEach(function (b) {
      b.setAttribute("aria-pressed", String(mode === "light"));
      var lab = $(".theme-label", b) || $(".breaker__label", b);
      if (lab) lab.textContent = mode === "light" ? "LIGHT" : "DARK";
    });
  }
  (function initTheme() {
    var saved;
    try { saved = localStorage.getItem(STORE_KEY); } catch (e) {}
    // FOUC 방지 head 스니펫이 이미 data-theme 를 세팅함 — 여기선 상태 UI(라벨/aria)만 동기화
    applyTheme(document.documentElement.getAttribute("data-theme") || saved || "dark");
  })();

  // 계전기 절환 플래시 오버레이 1회 주입(테마 토글 시 명멸)
  var relayFlash = document.createElement("div");
  relayFlash.className = "relay-flash";
  relayFlash.setAttribute("aria-hidden", "true");
  document.addEventListener("DOMContentLoaded", function () { document.body.appendChild(relayFlash); });
  function relayFlick() {
    if (reduceMotion) return;
    var h = document.documentElement;
    h.classList.remove("is-switching");
    void h.offsetWidth;            // reflow 로 애니메이션 재기동
    h.classList.add("is-switching");
    setTimeout(function () { h.classList.remove("is-switching"); }, 160);
  }

  /* =========================================================================
     DELEGATED CLICK ROUTER — data-action 모음
     ========================================================================= */
  on(document, "click", function (e) {
    var t = e.target.closest("[data-action]");
    if (!t) return;
    var action = t.getAttribute("data-action");

    if (action === "toggle-theme") {
      var next = document.documentElement.getAttribute("data-theme") === "light" ? "dark" : "light";
      applyTheme(next);
      relayFlick();
      try { localStorage.setItem(STORE_KEY, next); } catch (er) {}
    }
    if (action === "toggle-sidebar") {
      var shell = $(".app-shell");
      if (shell) shell.setAttribute("data-collapsed", shell.getAttribute("data-collapsed") === "true" ? "false" : "true");
    }
    if (action === "toggle-mobile-nav") {
      var sh = $(".app-shell");
      if (sh) { sh.getAttribute("data-mobile-open") === "true" ? closeMobileNav() : openMobileNav(sh, t); }
    }
    if (action === "open-cmdk") openCmdk();
    if (action === "demo-toast") {
      Toast.show({
        type: t.getAttribute("data-type") || "info",
        title: t.getAttribute("data-title") || "시스템 알림",
        msg: t.getAttribute("data-msg") || "요청을 처리했습니다."
      });
    }
  });

  /* =========================================================================
     TABS — role=tab / aria-controls, 화살표 키 지원
     ========================================================================= */
  $$("[data-tabs]").forEach(function (group) {
    var tabs = $$("[role='tab']", group);
    function select(tab) {
      tabs.forEach(function (tb) {
        var sel = tb === tab;
        tb.setAttribute("aria-selected", String(sel));
        tb.tabIndex = sel ? 0 : -1;
        var panel = document.getElementById(tb.getAttribute("aria-controls"));
        if (panel) panel.hidden = !sel;
      });
    }
    tabs.forEach(function (tab, i) {
      on(tab, "click", function () { select(tab); });
      on(tab, "keydown", function (e) {
        var idx = null;
        if (e.key === "ArrowRight") idx = (i + 1) % tabs.length;
        if (e.key === "ArrowLeft")  idx = (i - 1 + tabs.length) % tabs.length;
        if (e.key === "Home") idx = 0;
        if (e.key === "End") idx = tabs.length - 1;
        if (idx !== null) { e.preventDefault(); tabs[idx].focus(); select(tabs[idx]); }
      });
    });
  });

  /* =========================================================================
     ACCORDION
     ========================================================================= */
  on(document, "click", function (e) {
    var trg = e.target.closest(".accordion__trigger");
    if (!trg) return;
    var panel = trg.nextElementSibling;
    var open = trg.getAttribute("aria-expanded") === "true";
    var single = trg.closest("[data-accordion='single']");
    if (single && !open) {
      $$(".accordion__trigger", single).forEach(function (o) {
        o.setAttribute("aria-expanded", "false");
        if (o.nextElementSibling) o.nextElementSibling.setAttribute("data-open", "false");
      });
    }
    trg.setAttribute("aria-expanded", String(!open));
    if (panel) panel.setAttribute("data-open", String(!open));
  });

  /* =========================================================================
     TOGGLE / SWITCH — 상태 텍스트 (ON/OFF) 갱신
     ========================================================================= */
  $$(".toggle input[type='checkbox']").forEach(function (input) {
    var state = input.closest(".toggle") && $(".toggle__state", input.closest(".toggle"));
    function upd() { if (state) state.textContent = input.checked ? "ON" : "OFF"; }
    upd(); on(input, "change", upd);
  });

  /* =========================================================================
     MENU / DROPDOWN — 클릭 토글 + 외부 클릭/ESC 닫기
     ========================================================================= */
  function closeAllMenus(except) {
    $$("[data-menu-toggle]").forEach(function (btn) {
      var panel = panelFor(btn);
      if (panel && panel !== except) { panel.hidden = true; btn.setAttribute("aria-expanded", "false"); }
    });
  }
  function panelFor(btn) {
    var id = btn.getAttribute("aria-controls");
    if (id) return document.getElementById(id);
    var p = btn.parentElement && $(".menu__panel", btn.parentElement);
    return p;
  }
  on(document, "click", function (e) {
    var btn = e.target.closest("[data-menu-toggle]");
    if (btn) {
      e.stopPropagation();
      var panel = panelFor(btn);
      var willOpen = panel && panel.hidden;
      closeAllMenus(panel);
      if (panel) { panel.hidden = !willOpen; btn.setAttribute("aria-expanded", String(willOpen)); }
      return;
    }
    if (!e.target.closest(".menu__panel")) closeAllMenus();
  });

  /* =========================================================================
     MODAL / DIALOG — open/close, backdrop, ESC, 포커스 복귀
     ========================================================================= */
  var lastFocus = null;
  function openModal(id) {
    var ov = document.getElementById(id); if (!ov) return;
    lastFocus = document.activeElement;
    ov.setAttribute("data-open", "true");
    trapFocus(ov);
    var f = ov.querySelector("input:not([type='hidden']),button,[tabindex]");
    if (f) setTimeout(function () { f.focus(); }, 60);
    document.body.style.overflow = "hidden";
  }
  function closeModal(ov) {
    if (!ov) return;
    ov.setAttribute("data-open", "false");
    releaseFocus(ov);
    document.body.style.overflow = "";
    if (lastFocus) lastFocus.focus();
  }
  on(document, "click", function (e) {
    var opener = e.target.closest("[data-modal-open]");
    if (opener) { e.preventDefault(); openModal(opener.getAttribute("data-modal-open")); return; }
    var closer = e.target.closest("[data-modal-close]");
    if (closer) { closeModal(closer.closest(".overlay")); return; }
    if (e.target.classList && e.target.classList.contains("overlay")) closeModal(e.target);
  });

  /* =========================================================================
     DRAWER
     ========================================================================= */
  var drawerLastFocus = null;
  function openDrawer(id) {
    var d = document.getElementById(id); if (!d) return;
    drawerLastFocus = document.activeElement;
    d.setAttribute("data-open", "true");
    var bd = $("[data-drawer-backdrop]");
    if (bd) bd.setAttribute("data-open", "true");
    document.body.style.overflow = "hidden";
    trapFocus(d);
    var f = d.querySelector("input:not([type='hidden']),button,a,[tabindex]");
    if (f) setTimeout(function () { f.focus(); }, 60);
  }
  function closeDrawers() {
    $$(".drawer[data-open='true']").forEach(function (d) { d.setAttribute("data-open", "false"); releaseFocus(d); });
    var bd = $("[data-drawer-backdrop]");
    if (bd) bd.setAttribute("data-open", "false");
    document.body.style.overflow = "";
    if (drawerLastFocus) { drawerLastFocus.focus(); drawerLastFocus = null; }
  }
  on(document, "click", function (e) {
    var o = e.target.closest("[data-drawer-open]");
    if (o) { e.preventDefault(); openDrawer(o.getAttribute("data-drawer-open")); return; }
    if (e.target.closest("[data-drawer-close]") || e.target.matches("[data-drawer-backdrop]")) closeDrawers();
  });

  /* =========================================================================
     ESC 글로벌 — 모달/드로어/cmdk/메뉴 닫기
     ========================================================================= */
  on(document, "keydown", function (e) {
    if (e.key === "Escape") {
      var open = $(".overlay[data-open='true']"); if (open) closeModal(open);
      closeDrawers(); closeAllMenus();
      var ck = $(".cmdk-overlay[data-open='true']"); if (ck) closeCmdk();
      if ($(".app-shell[data-mobile-open='true']")) closeMobileNav();
    }
  });

  /* =========================================================================
     TOAST 시스템
     ========================================================================= */
  var Toast = (function () {
    function stack() {
      var s = $(".toast-stack");
      if (!s) { s = document.createElement("div"); s.className = "toast-stack"; s.setAttribute("role", "status"); s.setAttribute("aria-live", "polite"); document.body.appendChild(s); }
      return s;
    }
    var icons = {
      success: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 13l4 4L19 7"/></svg>',
      danger:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 8v5M12 17h.01"/><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/></svg>',
      warning: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 9v4M12 17h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/></svg>',
      info:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 16v-4M12 8h.01"/><circle cx="12" cy="12" r="9"/></svg>'
    };
    function show(opt) {
      opt = opt || {}; var type = opt.type || "info";
      var el = document.createElement("div");
      el.className = "toast toast--" + type; el.style.position = "relative";
      el.innerHTML =
        '<span class="toast__icon">' + (icons[type] || icons.info) + '</span>' +
        '<div class="toast__body"><div class="toast__title">' + (opt.title || "알림") + '</div>' +
        '<div class="toast__msg">' + (opt.msg || "") + '</div></div>' +
        '<button class="toast__close" aria-label="닫기"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 6l12 12M18 6 6 18"/></svg></button>' +
        '<span class="toast__progress"></span>';
      stack().appendChild(el);
      var prog = $(".toast__progress", el);
      var dur = opt.duration || 4200;
      if (prog && !reduceMotion) { prog.style.width = "100%"; prog.style.transition = "width " + dur + "ms linear"; requestAnimationFrame(function () { prog.style.width = "0%"; }); }
      var to = setTimeout(remove, dur);
      function remove() { clearTimeout(to); el.classList.add("leaving"); setTimeout(function () { el.remove(); }, 200); }
      on($(".toast__close", el), "click", remove);
    }
    return { show: show };
  })();
  window.Toast = Toast;

  /* =========================================================================
     COMMAND PALETTE · ⌘K / Ctrl+K
     ========================================================================= */
  function openCmdk() {
    var ov = $("#cmdk"); if (!ov) return;
    ov.setAttribute("data-open", "true");
    trapFocus(ov);
    var inp = $(".cmdk__search input", ov);
    if (inp) { inp.value = ""; filterCmdk(""); setTimeout(function () { inp.focus(); }, 50); }
    document.body.style.overflow = "hidden";
  }
  function closeCmdk() { var ov = $("#cmdk"); if (ov) { ov.setAttribute("data-open", "false"); releaseFocus(ov); document.body.style.overflow = ""; } }
  function cmdkItems() { return $$("#cmdk .cmdk__item").filter(function (i) { return !i.hidden && !i.closest("[hidden]"); }); }
  function cmdkSetActive(item) {
    var inp = $("#cmdk .cmdk__search input");
    $$("#cmdk .cmdk__item").forEach(function (i) { i.setAttribute("aria-selected", String(i === item)); });
    if (inp) inp.setAttribute("aria-activedescendant", item ? item.id : "");
    if (item) item.scrollIntoView({ block: "nearest" });
  }
  function filterCmdk(q) {
    q = (q || "").toLowerCase();
    var visible = 0;
    $$("#cmdk .cmdk__item").forEach(function (it) {
      var txt = (it.textContent || "").toLowerCase();
      it.hidden = q && txt.indexOf(q) === -1;
      if (!it.hidden) visible++;
    });
    $$("#cmdk .cmdk__group").forEach(function (g) {
      var any = $$(".cmdk__item", g).some(function (i) { return !i.hidden; });
      g.hidden = !any;
    });
    var empty = $("#cmdk .cmdk__empty");
    if (empty) empty.hidden = visible !== 0;
    var items = cmdkItems();
    cmdkSetActive(items[0] || null);
  }
  on(document, "keydown", function (e) {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      var ov = $("#cmdk");
      if (ov && ov.getAttribute("data-open") === "true") closeCmdk(); else openCmdk();
    }
  });
  (function bindCmdk() {
    var ov = $("#cmdk"); if (!ov) return;
    var inp = $(".cmdk__search input", ov);
    // 각 옵션에 안정적 id 부여(aria-activedescendant 대상)
    $$(".cmdk__item", ov).forEach(function (it, n) { if (!it.id) it.id = "cmdk-opt-" + n; });
    on(inp, "input", function () { filterCmdk(inp.value); });
    on(ov, "click", function (e) { if (e.target === ov) closeCmdk(); });
    on(ov, "keydown", function (e) {
      var items = cmdkItems(); if (!items.length) return;
      var cur = items.findIndex(function (i) { return i.getAttribute("aria-selected") === "true"; });
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        var ni = e.key === "ArrowDown" ? ((cur < 0 ? -1 : cur) + 1) % items.length : (cur - 1 + items.length) % items.length;
        cmdkSetActive(items[ni]);
      }
      if (e.key === "Enter" && items[cur]) { e.preventDefault(); items[cur].click(); }
    });
    $$(".cmdk__item", ov).forEach(function (it) {
      on(it, "click", function () {
        var isNav = it.tagName === "A" && it.getAttribute("href");
        closeCmdk();
        if (isNav) return;   // 실제 링크는 브라우저 이동에 맡김
        Toast.show({ type: "info", title: "실행", msg: (it.getAttribute("data-label") || it.textContent.trim()) + " · 명령을 실행했습니다" });
      });
    });
  })();

  /* =========================================================================
     SEGMENTED CONTROL — 슬라이딩 썸 위치
     ========================================================================= */
  $$("[data-segmented]").forEach(function (seg) {
    var opts = $$(".segmented__option", seg);
    var thumb = $(".segmented__thumb", seg);
    var isRadio = seg.getAttribute("role") === "radiogroup";
    function move(opt, focusIt) {
      opts.forEach(function (o) {
        var sel = o === opt;
        o.setAttribute("aria-checked", String(sel));   // radiogroup 표준
        o.removeAttribute("aria-selected");             // 무효 ARIA 잔재 제거
        if (isRadio) o.tabIndex = sel ? 0 : -1;
      });
      if (thumb) { thumb.style.width = opt.offsetWidth + "px"; thumb.style.transform = "translateX(" + (opt.offsetLeft - 3) + "px)"; }
      if (focusIt) opt.focus();
    }
    opts.forEach(function (o, i) {
      on(o, "click", function () { move(o); });
      if (isRadio) on(o, "keydown", function (e) {
        var idx = null;
        if (e.key === "ArrowRight" || e.key === "ArrowDown") idx = (i + 1) % opts.length;
        if (e.key === "ArrowLeft" || e.key === "ArrowUp") idx = (i - 1 + opts.length) % opts.length;
        if (e.key === "Home") idx = 0;
        if (e.key === "End") idx = opts.length - 1;
        if (idx !== null) { e.preventDefault(); move(opts[idx], true); }
      });
    });
    var init = seg.querySelector(".segmented__option[aria-checked='true'],.segmented__option[aria-selected='true']") || opts[0];
    if (init) requestAnimationFrame(function () { move(init); });
  });

  /* =========================================================================
     SLIDER — 값 표시
     ========================================================================= */
  $$("input[type='range'][data-slider]").forEach(function (r) {
    var out = document.getElementById(r.getAttribute("data-slider"));
    function upd() {
      if (out) out.textContent = r.value + (r.getAttribute("data-unit") || "");
      var pct = (r.value - r.min) / ((r.max || 100) - r.min) * 100;
      r.style.background = "linear-gradient(90deg, var(--color-primary) " + pct + "%, var(--color-surface-inset) " + pct + "%)";
    }
    upd(); on(r, "input", upd);
  });

  /* =========================================================================
     STEPPER
     ========================================================================= */
  $$("[data-stepper]").forEach(function (st) {
    var input = $("input", st);
    $$("[data-step]", st).forEach(function (btn) {
      on(btn, "click", function () {
        var v = parseInt(input.value || "0", 10) || 0;
        v += parseInt(btn.getAttribute("data-step"), 10);
        var min = input.min !== "" ? parseInt(input.min, 10) : -Infinity;
        var max = input.max !== "" ? parseInt(input.max, 10) : Infinity;
        input.value = Math.max(min, Math.min(max, v));
      });
    });
  });

  /* =========================================================================
     RATING
     ========================================================================= */
  $$("[data-rating]").forEach(function (rt) {
    if (rt.getAttribute("data-readonly") === "true") return;
    var stars = $$(".rating__star", rt);
    var current = parseInt(rt.getAttribute("data-value") || "0", 10);
    function paint(n) { stars.forEach(function (s, i) { s.classList.toggle("is-on", i < n); }); }
    paint(current);
    stars.forEach(function (s, i) {
      on(s, "mouseenter", function () { paint(i + 1); });
      on(s, "click", function () { current = i + 1; rt.setAttribute("data-value", current); paint(current); });
    });
    on(rt, "mouseleave", function () { paint(current); });
  });

  /* =========================================================================
     CHIP INPUT
     ========================================================================= */
  $$("[data-chipinput]").forEach(function (ci) {
    var input = $("input", ci);
    function addChip(text) {
      if (!text.trim()) return;
      var chip = document.createElement("span");
      chip.className = "chip";
      chip.innerHTML = text.trim() + '<button class="chip__x" aria-label="제거"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="14" height="14"><path d="M6 6l12 12M18 6 6 18"/></svg></button>';
      ci.insertBefore(chip, input);
    }
    on(input, "keydown", function (e) {
      if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addChip(input.value); input.value = ""; }
      if (e.key === "Backspace" && !input.value) {
        var chips = $$(".chip", ci); if (chips.length) chips[chips.length - 1].remove();
      }
    });
    on(ci, "click", function (e) {
      var x = e.target.closest(".chip__x"); if (x) x.closest(".chip").remove(); else input.focus();
    });
  });

  /* =========================================================================
     COMBOBOX / AUTOCOMPLETE
     ========================================================================= */
  $$("[data-combo]").forEach(function (combo) {
    var input = $("input", combo);
    var panel = $(".combo__panel", combo);
    if (!input || !panel) return;
    var opts = $$(".combo__opt", panel);
    function open() { panel.hidden = false; } function close() { panel.hidden = true; }
    function filter() {
      var q = input.value.toLowerCase(); var shown = 0;
      opts.forEach(function (o) {
        var txt = o.getAttribute("data-value") || o.textContent;
        var match = txt.toLowerCase().indexOf(q) !== -1;
        o.hidden = !match; if (match) shown++;
      });
      if (shown) open(); else close();
    }
    on(input, "input", filter);
    on(input, "focus", function () { if (input.value) filter(); else open(); });
    opts.forEach(function (o) { on(o, "click", function () { input.value = o.getAttribute("data-value") || o.textContent.trim(); close(); }); });
    on(document, "click", function (e) { if (!combo.contains(e.target)) close(); });
    panel.hidden = true;
  });

  /* =========================================================================
     MULTISELECT
     ========================================================================= */
  $$("[data-multiselect]").forEach(function (ms) {
    var trigger = $(".multiselect__trigger", ms);
    var panel = $(".multiselect__panel", ms);
    if (!trigger || !panel) return;
    panel.hidden = true;
    on(trigger, "click", function (e) { e.stopPropagation(); panel.hidden = !panel.hidden; });
    $$(".multiselect__opt", panel).forEach(function (opt) {
      on(opt, "click", function () {
        var cb = $("input", opt); if (cb) cb.checked = !cb.checked;
        opt.setAttribute("aria-selected", String(cb && cb.checked));
        renderTags();
      });
    });
    function renderTags() {
      $$(".chip", trigger).forEach(function (c) { c.remove(); });
      var ph = $(".multiselect__placeholder", trigger);
      var chosen = $$(".multiselect__opt[aria-selected='true']", panel);
      if (ph) ph.style.display = chosen.length ? "none" : "";
      chosen.forEach(function (o) {
        var chip = document.createElement("span"); chip.className = "chip";
        chip.textContent = o.getAttribute("data-value") || o.textContent.trim();
        trigger.insertBefore(chip, $(".multiselect__caret", trigger) || null);
      });
    }
    on(document, "click", function (e) { if (!ms.contains(e.target)) panel.hidden = true; });
  });

  /* =========================================================================
     TABLE — 정렬 + 전체선택
     ========================================================================= */
  $$("[data-sortable-table]").forEach(function (table) {
    var tbody = $("tbody", table);
    $$("th.sortable", table).forEach(function (th) {
      // 키보드 조작 — th 를 포커스 가능하게 하고 Enter/Space 로 정렬(마우스 전용 금지)
      if (!th.hasAttribute("tabindex")) th.tabIndex = 0;
      function sort() {
        var idx = Array.prototype.indexOf.call(th.parentElement.children, th);
        var asc = th.getAttribute("aria-sort") !== "ascending";
        $$("th", table).forEach(function (h) { h.removeAttribute("aria-sort"); });
        th.setAttribute("aria-sort", asc ? "ascending" : "descending");
        var rows = $$("tr", tbody);
        var type = th.getAttribute("data-type") || "text";
        rows.sort(function (a, b) {
          var av = a.children[idx].getAttribute("data-sort") || a.children[idx].textContent.trim();
          var bv = b.children[idx].getAttribute("data-sort") || b.children[idx].textContent.trim();
          if (type === "num") { av = parseFloat(av.replace(/[^0-9.\-]/g, "")) || 0; bv = parseFloat(bv.replace(/[^0-9.\-]/g, "")) || 0; return asc ? av - bv : bv - av; }
          return asc ? av.localeCompare(bv) : bv.localeCompare(av);
        });
        rows.forEach(function (r) { tbody.appendChild(r); });
      }
      on(th, "click", sort);
      on(th, "keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); sort(); } });
    });
  });
  $$("[data-select-all]").forEach(function (master) {
    var scope = master.closest("table") || document;
    function markRow(cb) { var tr = cb.closest("tr"); if (tr) tr.classList.toggle("is-selected", cb.checked); }
    on(master, "change", function () {
      $$("[data-row-select]", scope).forEach(function (cb) { cb.checked = master.checked; markRow(cb); });
    });
    $$("[data-row-select]", scope).forEach(function (cb) {
      on(cb, "change", function () {
        markRow(cb);
        var all = $$("[data-row-select]", scope);
        master.checked = all.every(function (c) { return c.checked; });
        master.indeterminate = !master.checked && all.some(function (c) { return c.checked; });
      });
    });
  });

  /* =========================================================================
     CAROUSEL
     ========================================================================= */
  $$("[data-carousel]").forEach(function (car) {
    var track = $(".carousel__track", car);
    var slides = $$(".carousel__slide", car);
    var dots = $$(".carousel__dot", car);
    var i = 0;
    function go(n) {
      i = (n + slides.length) % slides.length;
      slides.forEach(function (s) { s.style.transform = "translateX(" + (-100 * i) + "%)"; });
      dots.forEach(function (d, di) { d.classList.toggle("is-active", di === i); });
    }
    on($(".carousel__nav.prev", car), "click", function () { go(i - 1); });
    on($(".carousel__nav.next", car), "click", function () { go(i + 1); });
    dots.forEach(function (d, di) { on(d, "click", function () { go(di); }); });
    go(0);
  });

  /* =========================================================================
     COPY 버튼 (CodeBlock 등)
     ========================================================================= */
  on(document, "click", function (e) {
    var btn = e.target.closest("[data-copy]"); if (!btn) return;
    var sel = btn.getAttribute("data-copy");
    var src = sel ? document.querySelector(sel) : btn.closest(".codeblock");
    var text = src ? (src.innerText || src.textContent) : "";
    var done = function () { Toast.show({ type: "success", title: "복사됨", msg: "클립보드에 복사했습니다" }); };
    if (navigator.clipboard) navigator.clipboard.writeText(text).then(done, done); else done();
  });

  /* =========================================================================
     BILLING TOGGLE (가격표 월/연)
     ========================================================================= */
  $$("[data-billing-toggle]").forEach(function (tg) {
    var inputs = $$("input", tg);
    function apply(yearly) {
      $$("[data-price]").forEach(function (p) {
        var v = yearly ? p.getAttribute("data-yearly") : p.getAttribute("data-monthly");
        var amt = $(".price__amt", p); if (amt) amt.textContent = v;
        var per = $(".price__per", p); if (per) per.textContent = yearly ? "/연" : "/월";
      });
      $$("[data-save-badge]").forEach(function (b) { b.style.display = yearly ? "" : "none"; });
    }
    inputs.forEach(function (inp) { on(inp, "change", function () { apply(inp.value === "yearly"); }); });
    // segmented variant
    $$(".segmented__option", tg).forEach(function (o) { on(o, "click", function () { apply(o.getAttribute("data-bill") === "yearly"); }); });
  });

  /* =========================================================================
     KANBAN — 드래그 앤 드롭
     ========================================================================= */
  (function kanban() {
    var dragging = null;
    $$("[draggable='true']").forEach(function (card) {
      on(card, "dragstart", function () { dragging = card; card.classList.add("dragging"); });
      on(card, "dragend", function () { card.classList.remove("dragging"); dragging = null; updateCounts(); });
    });
    $$("[data-kanban-col]").forEach(function (col) {
      var zone = $("[data-kanban-drop]", col) || col;
      on(zone, "dragover", function (e) { e.preventDefault(); zone.classList.add("is-over"); });
      on(zone, "dragleave", function () { zone.classList.remove("is-over"); });
      on(zone, "drop", function (e) { e.preventDefault(); zone.classList.remove("is-over"); if (dragging) zone.appendChild(dragging); updateCounts(); });
    });
    function updateCounts() {
      $$("[data-kanban-col]").forEach(function (col) {
        var c = $("[data-kanban-count]", col);
        var zone = $("[data-kanban-drop]", col) || col;
        if (c) c.textContent = $$("[draggable='true']", zone).length;
      });
    }
    updateCounts();
  })();

  /* =========================================================================
     WIZARD / STEPS — 다음/이전
     ========================================================================= */
  $$("[data-wizard]").forEach(function (wiz) {
    var steps = $$("[data-wizard-step]", wiz);
    var markers = $$(".steps__step", wiz);
    var cur = 0;
    function show(n) {
      cur = Math.max(0, Math.min(steps.length - 1, n));
      steps.forEach(function (s, i) { s.hidden = i !== cur; });
      markers.forEach(function (m, i) {
        m.classList.toggle("is-active", i === cur);
        m.classList.toggle("is-done", i < cur);
      });
      var prev = $("[data-wizard-prev]", wiz); if (prev) prev.disabled = cur === 0;
      var next = $("[data-wizard-next]", wiz);
      var fin = $("[data-wizard-finish]", wiz);
      if (next) next.hidden = cur === steps.length - 1;
      if (fin) fin.hidden = cur !== steps.length - 1;
    }
    on($("[data-wizard-next]", wiz), "click", function () { show(cur + 1); });
    on($("[data-wizard-prev]", wiz), "click", function () { show(cur - 1); });
    on($("[data-wizard-finish]", wiz), "click", function () { Toast.show({ type: "success", title: "설정 완료", msg: "온보딩을 마쳤습니다. 작업대에 오신 걸 환영합니다." }); });
    show(0);
  });

  /* =========================================================================
     CONTEXT MENU
     ========================================================================= */
  $$("[data-context-menu]").forEach(function (zone) {
    var menu = document.getElementById(zone.getAttribute("data-context-menu"));
    if (!menu) return;
    on(zone, "contextmenu", function (e) {
      e.preventDefault();
      menu.hidden = false;
      var x = Math.min(e.clientX, window.innerWidth - menu.offsetWidth - 8);
      var y = Math.min(e.clientY, window.innerHeight - menu.offsetHeight - 8);
      menu.style.left = x + "px"; menu.style.top = y + "px";
    });
    on(document, "click", function () { menu.hidden = true; });
    on(document, "scroll", function () { menu.hidden = true; }, true);
  });

  /* =========================================================================
     SCROLL-REVEAL 애니메이션 게이지/프로그래스/바차트 (IntersectionObserver)
     ========================================================================= */
  function animateMeters(root) {
    root = root || document;
    $$(".gauge[data-value]", root).forEach(function (g) {
      var val = parseFloat(g.getAttribute("data-value")) || 0;
      var fill = $(".gauge__fill", g); if (!fill) return;
      var r = fill.r ? fill.r.baseVal.value : 44;
      var c = 2 * Math.PI * r;
      fill.style.strokeDasharray = c;
      fill.style.strokeDashoffset = reduceMotion ? c * (1 - val / 100) : c;
      var num = $(".gauge__num", g);
      requestAnimationFrame(function () { fill.style.strokeDashoffset = c * (1 - val / 100); });
      if (num && !reduceMotion) {
        var start = null;
        function step(ts) { if (!start) start = ts; var p = Math.min((ts - start) / 700, 1); num.textContent = Math.round(p * val) + "%"; if (p < 1) requestAnimationFrame(step); }
        requestAnimationFrame(step);
      } else if (num) num.textContent = val + "%";
    });
    $$(".progress__bar[data-value]", root).forEach(function (b) { b.style.width = b.getAttribute("data-value") + "%"; });
    $$(".barchart__bar[data-value]", root).forEach(function (b) { b.style.height = b.getAttribute("data-value") + "%"; });
    $$(".lgauge__fill[data-value]", root).forEach(function (b) { b.style.width = b.getAttribute("data-value") + "%"; });
    $$(".lgauge__needle[data-value]", root).forEach(function (b) { b.style.left = b.getAttribute("data-value") + "%"; });
    $$(".metric-row__bar > i[data-value], .fileitem__bar > i[data-value], .metric-row i[data-value]", root).forEach(function (b) { b.style.width = b.getAttribute("data-value") + "%"; });
  }
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { animateMeters(en.target); io.unobserve(en.target); } });
    }, { threshold: 0.25 });
    $$("[data-animate-meters]").forEach(function (s) { io.observe(s); });
    if (!$$("[data-animate-meters]").length) animateMeters();
  } else { animateMeters(); }

  /* =========================================================================
     LIVE CLOCK (대시보드 계기 — 산업 모니터 느낌)
     ========================================================================= */
  $$("[data-clock]").forEach(function (el) {
    function tick() {
      var d = new Date();
      var p = function (n) { return String(n).padStart(2, "0"); };
      el.textContent = p(d.getHours()) + ":" + p(d.getMinutes()) + ":" + p(d.getSeconds());
    }
    tick(); setInterval(tick, 1000);
  });

  /* =========================================================================
     STAGGERED REVEAL on load (reduced-motion 시 자동 무력화 by CSS)
     ========================================================================= */
  window.addEventListener("DOMContentLoaded", function () {
    $$("[data-stagger]").forEach(function (group) {
      $$(":scope > *", group).forEach(function (child, i) {
        child.classList.add("reveal");
        child.style.setProperty("--d", (i * 60) + "ms");
      });
    });
  });

  // 전역 노출 (페이지에서 호출 가능)
  window.Industrial = { toast: Toast.show, openModal: openModal, openDrawer: openDrawer, openCmdk: openCmdk, animateMeters: animateMeters };
})();
