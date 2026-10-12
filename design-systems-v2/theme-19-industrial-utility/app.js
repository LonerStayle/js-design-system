/* ==========================================================================
   반월장비창고 BW-STD 19 — 화면 동작 (바닐라 JS, 외부 라이브러리 없음)
   모든 동작은 data-* / ARIA 속성으로 연결한다. 마크업 계약은 COMPONENTS.md.
   ========================================================================== */
(function () {
  "use strict";

  var THEME_KEY = "bwd-theme";
  var root = document.documentElement;
  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ------------------------------------------------------------------------
     0. 공통 유틸 — 포커스 트랩 · 스크롤 잠금 · 바깥 클릭 · 알림 낭독
     ------------------------------------------------------------------------ */
  var FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

  function focusables(el) {
    return $$(FOCUSABLE, el).filter(function (n) {
      return n.offsetWidth > 0 || n.offsetHeight > 0 || n === document.activeElement;
    });
  }

  var layers = []; // 열린 오버레이 스택: {el, close}

  function lockScroll() { document.body.classList.add("is-locked"); }
  function unlockScroll() { if (!layers.length) document.body.classList.remove("is-locked"); }

  function pushLayer(el, close, opts) {
    opts = opts || {};
    var layer = { el: el, close: close, returnTo: document.activeElement, trap: opts.trap !== false };
    layers.push(layer);
    if (opts.lock !== false) lockScroll();
    return layer;
  }
  function popLayer(el) {
    for (var i = layers.length - 1; i >= 0; i--) {
      if (layers[i].el === el) {
        var l = layers.splice(i, 1)[0];
        unlockScroll();
        if (l.returnTo && typeof l.returnTo.focus === "function" && document.contains(l.returnTo)) {
          l.returnTo.focus({ preventScroll: true });
        }
        return l;
      }
    }
    return null;
  }
  function topLayer() { return layers[layers.length - 1]; }

  document.addEventListener("keydown", function (e) {
    var top = topLayer();
    if (!top) return;
    if (e.key === "Escape") {
      e.preventDefault();
      top.close();
      return;
    }
    if (e.key === "Tab" && top.trap) {
      var list = focusables(top.el);
      if (!list.length) { e.preventDefault(); return; }
      var first = list[0], last = list[list.length - 1];
      if (e.shiftKey && (document.activeElement === first || !top.el.contains(document.activeElement))) {
        e.preventDefault(); last.focus();
      } else if (!e.shiftKey && (document.activeElement === last || !top.el.contains(document.activeElement))) {
        e.preventDefault(); first.focus();
      }
    }
  });

  var liveRegion;
  function announce(msg) {
    if (!liveRegion) {
      liveRegion = document.createElement("div");
      liveRegion.className = "sr-only";
      liveRegion.setAttribute("aria-live", "polite");
      liveRegion.setAttribute("role", "status");
      document.body.appendChild(liveRegion);
    }
    liveRegion.textContent = "";
    window.setTimeout(function () { liveRegion.textContent = msg; }, 40);
  }

  function restartAnimation(el, cls) {
    el.classList.remove(cls);
    void el.offsetWidth; // 리플로로 애니메이션 재시작
    el.classList.add(cls);
  }

  /* ------------------------------------------------------------------------
     1. 조명 스위치(테마) — ?theme= 최우선 → localStorage → 시스템
     ------------------------------------------------------------------------ */
  function readTheme() {
    try {
      var q = new URLSearchParams(location.search).get("theme");
      if (q === "dark" || q === "light") return q;
    } catch (e) { /* 무시 */ }
    try {
      var s = localStorage.getItem(THEME_KEY);
      if (s === "dark" || s === "light") return s;
    } catch (e) { /* 무시 */ }
    try { return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"; } catch (e) { return "light"; }
  }
  function applyTheme(t) {
    root.setAttribute("data-theme", t);
    $$("[data-theme-toggle]").forEach(function (btn) {
      var dark = t === "dark";
      btn.setAttribute("aria-pressed", dark ? "true" : "false");
      btn.setAttribute("aria-label", dark ? "조명 스위치: 야간 조명 켜짐. 누르면 주간 조명으로 바꿉니다" : "조명 스위치: 주간 조명 켜짐. 누르면 야간 조명으로 바꿉니다");
      var label = btn.querySelector("[data-theme-label]");
      if (label) label.textContent = dark ? "야간 조명" : "주간 조명";
    });
  }
  /* 쿼리·저장값·시스템을 다시 읽는다 — 저장소가 막힌 환경에서도 ?theme= 가 이긴다 */
  applyTheme(readTheme());

  document.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-theme-toggle]");
    if (!btn) return;
    var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    applyTheme(next);
    try { localStorage.setItem(THEME_KEY, next); } catch (err) { /* 무시 */ }
    announce(next === "dark" ? "야간 조명으로 바꿨습니다" : "주간 조명으로 바꿨습니다");
  });

  if (window.matchMedia) {
    var mq = window.matchMedia("(prefers-color-scheme: dark)");
    var onSys = function (ev) {
      var hasQuery = /[?&]theme=(dark|light)/.test(location.search);
      var stored = null;
      try { stored = localStorage.getItem(THEME_KEY); } catch (err) { /* 무시 */ }
      if (!hasQuery && !stored) applyTheme(ev.matches ? "dark" : "light");
    };
    if (mq.addEventListener) mq.addEventListener("change", onSys);
  }

  /* ------------------------------------------------------------------------
     2. 모달 — [data-modal-open="id"] / [data-modal-close] / 스크림 / Esc
     ------------------------------------------------------------------------ */
  function openModal(id, trigger) {
    var m = document.getElementById(id);
    if (!m || !m.hidden) return;
    m.hidden = false;
    var close = function () { closeModal(m); };
    pushLayer(m, close);
    if (trigger) m._trigger = trigger;
    var target = $("[data-autofocus]", m) || focusables($(".modal__box", m) || m)[0];
    if (target) target.focus({ preventScroll: true });
  }
  function closeModal(m) {
    if (m.hidden) return;
    m.hidden = true;
    popLayer(m);
  }
  document.addEventListener("click", function (e) {
    var o = e.target.closest("[data-modal-open]");
    if (o) { e.preventDefault(); openModal(o.getAttribute("data-modal-open"), o); return; }
    var c = e.target.closest("[data-modal-close], .modal__scrim");
    if (c) {
      var m = c.closest(".modal");
      if (m && !m.classList.contains("modal--static")) closeModal(m);
    }
  });

  /* ------------------------------------------------------------------------
     3. 드로어(셔틀 패널) — [data-drawer-open="id"] / [data-drawer-close]
     ------------------------------------------------------------------------ */
  function openDrawer(id) {
    var d = document.getElementById(id);
    if (!d || !d.hidden) return;
    d.hidden = false;
    pushLayer(d, function () { closeDrawer(d); });
    var target = $("[data-autofocus]", d) || focusables($(".drawer__panel", d) || d)[0];
    if (target) target.focus({ preventScroll: true });
  }
  function closeDrawer(d) {
    if (d.hidden) return;
    d.hidden = true;
    popLayer(d);
  }
  document.addEventListener("click", function (e) {
    var o = e.target.closest("[data-drawer-open]");
    if (o) { e.preventDefault(); openDrawer(o.getAttribute("data-drawer-open")); return; }
    var c = e.target.closest("[data-drawer-close], .drawer__scrim");
    if (c) {
      var d = c.closest(".drawer");
      if (d && !d.classList.contains("drawer--static")) closeDrawer(d);
    }
  });

  /* ------------------------------------------------------------------------
     4. 위치·자산 조회기(⌘K / Ctrl+K) — role=combobox + listbox
     ------------------------------------------------------------------------ */
  function initCommand(cmd) {
    var input = $(".command__input", cmd);
    var list = $(".command__list", cmd);
    var empty = $(".command__empty", cmd);
    if (!input || !list) return;
    var isStatic = cmd.classList.contains("command--static");
    var opts = $$(".command__opt", cmd);
    opts.forEach(function (o, i) { if (!o.id) o.id = (cmd.id || "cmd") + "-opt-" + i; });
    var active = -1;

    function visible() { return opts.filter(function (o) { return !o.hidden && o.getAttribute("aria-disabled") !== "true"; }); }
    var ready = false; // 첫 초기화 · 정적 견본에서는 스크롤하지 않는다(페이지가 견본 위치로 튀는 문제)
    function setActive(idx) {
      var v = visible();
      opts.forEach(function (o) { o.setAttribute("aria-selected", "false"); o.classList.remove("is-active"); });
      if (!v.length) { active = -1; input.removeAttribute("aria-activedescendant"); return; }
      active = (idx + v.length) % v.length;
      var cur = v[active];
      cur.setAttribute("aria-selected", "true");
      cur.classList.add("is-active");
      input.setAttribute("aria-activedescendant", cur.id);
      if (ready && !isStatic) cur.scrollIntoView({ block: "nearest" });
    }
    function filter() {
      var q = input.value.trim().toLowerCase().replace(/\s+/g, "");
      var shown = 0;
      opts.forEach(function (o) {
        var hay = (o.getAttribute("data-keywords") || "") + o.textContent;
        hay = hay.toLowerCase().replace(/\s+/g, "");
        var hit = !q || hay.indexOf(q) !== -1;
        o.hidden = !hit;
        if (hit) shown++;
      });
      $$(".command__group", cmd).forEach(function (g) {
        // 그룹 제목 다음 형제부터 다음 그룹 전까지에 보이는 옵션이 있는지
        var n = g.nextElementSibling, any = false;
        while (n && !n.classList.contains("command__group")) {
          if (n.classList.contains("command__opt") && !n.hidden) any = true;
          if (n.querySelector && n.querySelector(".command__opt:not([hidden])")) any = true;
          n = n.nextElementSibling;
        }
        g.hidden = !any;
      });
      if (empty) {
        empty.hidden = shown !== 0;
        var qEl = $("[data-command-query]", empty);
        if (qEl) qEl.textContent = input.value.trim();
      }
      setActive(0);
    }
    function choose(o) {
      if (!o || o.getAttribute("aria-disabled") === "true") return;
      var href = o.getAttribute("data-href");
      if (href) { location.href = href; return; }
      var name = $(".command__name", o);
      toast({ type: "info", title: "위치 조회", text: (name ? name.firstChild.textContent.trim() : o.textContent.trim()) + " 위치를 상황판에 표시합니다." });
      if (!isStatic) closeCmd();
    }
    input.addEventListener("input", filter);
    input.addEventListener("keydown", function (e) {
      if (e.key === "ArrowDown") { e.preventDefault(); setActive(active + 1); }
      else if (e.key === "ArrowUp") { e.preventDefault(); setActive(active - 1); }
      else if (e.key === "Home") { e.preventDefault(); setActive(0); }
      else if (e.key === "End") { e.preventDefault(); setActive(visible().length - 1); }
      else if (e.key === "Enter") { e.preventDefault(); choose(visible()[active]); }
    });
    opts.forEach(function (o) {
      o.addEventListener("click", function () { choose(o); });
      o.addEventListener("mousemove", function () {
        var v = visible(); var i = v.indexOf(o);
        if (i !== -1 && i !== active) setActive(i);
      });
    });

    function openCmd() {
      if (!cmd.hidden) return;
      cmd.hidden = false;
      input.value = "";
      filter();
      pushLayer(cmd, closeCmd);
      input.setAttribute("aria-expanded", "true");
      input.focus({ preventScroll: true });
    }
    function closeCmd() {
      if (cmd.hidden) return;
      cmd.hidden = true;
      input.setAttribute("aria-expanded", "false");
      popLayer(cmd);
    }
    if (!isStatic) {
      cmd._open = openCmd;
      cmd.addEventListener("click", function (e) {
        if (e.target.closest(".command__scrim, [data-command-close]")) closeCmd();
      });
    } else {
      filter();
    }
    ready = true;
  }
  $$(".command").forEach(initCommand);
  function mainCommand() { return $(".command:not(.command--static)"); }
  document.addEventListener("keydown", function (e) {
    if ((e.metaKey || e.ctrlKey) && (e.key === "k" || e.key === "K")) {
      var c = mainCommand();
      if (c && c._open) { e.preventDefault(); if (c.hidden) c._open(); }
    } else if (e.key === "/" && !e.target.closest("input, textarea, select, [contenteditable]")) {
      var c2 = mainCommand();
      if (c2 && c2._open && c2.hidden) { e.preventDefault(); c2._open(); }
    }
  });
  document.addEventListener("click", function (e) {
    var t = e.target.closest("[data-command-open]");
    if (!t) return;
    var c = mainCommand();
    if (c && c._open) { e.preventDefault(); c._open(); }
  });

  /* ------------------------------------------------------------------------
     5. 탭(서랍 손잡이) — role=tablist, 화살표 · Home · End
     ------------------------------------------------------------------------ */
  $$('[role="tablist"]').forEach(function (tl) {
    var tabs = $$('[role="tab"]', tl);
    function select(tab, focus) {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute("aria-selected", on ? "true" : "false");
        t.tabIndex = on ? 0 : -1;
        var p = document.getElementById(t.getAttribute("aria-controls"));
        if (p) p.hidden = !on;
      });
      if (focus) tab.focus();
      tab.scrollIntoView({ block: "nearest", inline: "nearest" });
    }
    tabs.forEach(function (t) {
      t.tabIndex = t.getAttribute("aria-selected") === "true" ? 0 : -1;
      t.addEventListener("click", function () { if (!t.disabled && t.getAttribute("aria-disabled") !== "true") select(t, false); });
      t.addEventListener("keydown", function (e) {
        var enabled = tabs.filter(function (x) { return !x.disabled && x.getAttribute("aria-disabled") !== "true"; });
        var i = enabled.indexOf(t);
        var n = null;
        if (e.key === "ArrowRight") n = enabled[(i + 1) % enabled.length];
        else if (e.key === "ArrowLeft") n = enabled[(i - 1 + enabled.length) % enabled.length];
        else if (e.key === "Home") n = enabled[0];
        else if (e.key === "End") n = enabled[enabled.length - 1];
        if (n) { e.preventDefault(); select(n, true); }
      });
    });
  });

  /* ------------------------------------------------------------------------
     6. 아코디언(사양서 접이 행) — data-accordion="single" 이면 하나만 열림
     ------------------------------------------------------------------------ */
  document.addEventListener("click", function (e) {
    var head = e.target.closest(".accordion__head");
    if (!head || head.disabled) return;
    var acc = head.closest(".accordion");
    var open = head.getAttribute("aria-expanded") !== "true";
    if (open && acc && acc.getAttribute("data-accordion") === "single") {
      $$(".accordion__head", acc).forEach(function (h) {
        if (h !== head && h.getAttribute("aria-expanded") === "true") {
          h.setAttribute("aria-expanded", "false");
          var pp = document.getElementById(h.getAttribute("aria-controls"));
          if (pp) pp.hidden = true;
        }
      });
    }
    head.setAttribute("aria-expanded", open ? "true" : "false");
    var p = document.getElementById(head.getAttribute("aria-controls"));
    if (p) p.hidden = !open;
  });

  /* ------------------------------------------------------------------------
     7. 토스트(라벨 출력) — BWD.toast({type, title, text, code}) / [data-toast]
     ------------------------------------------------------------------------ */
  var ICONS = {
    ok: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18"/><path d="M7 12.5l3.2 3.2L17 8.8"/></svg>',
    warn: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3L22 20H2z"/><path d="M12 10v4.5M12 17v.5"/></svg>',
    ban: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M5.6 5.6l12.8 12.8"/></svg>',
    info: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18"/><path d="M12 10.5V17M12 7v.5"/></svg>',
    close: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>'
  };
  function toastZone() {
    var z = $(".toast-zone");
    if (!z) {
      z = document.createElement("div");
      z.className = "toast-zone";
      z.setAttribute("aria-live", "polite");
      z.setAttribute("aria-relevant", "additions");
      document.body.appendChild(z);
    }
    return z;
  }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function toast(o) {
    o = o || {};
    var type = o.type || "info";
    var el = document.createElement("div");
    el.className = "toast toast--" + type;
    if (type === "ban") el.setAttribute("role", "alert"); // 나머지는 .toast-zone 의 aria-live 가 읽는다
    var dur = o.duration || 4000;
    el.style.setProperty("--toast-dur", dur + "ms");
    el.innerHTML =
      '<span class="toast__icon">' + (ICONS[type] || ICONS.info) + "</span>" +
      '<div class="toast__body"><strong class="toast__title">' + esc(o.title) + "</strong>" +
      (o.text ? '<p class="toast__text">' + esc(o.text) + "</p>" : "") +
      (o.code ? '<span class="toast__code">' + esc(o.code) + "</span>" : "") + "</div>" +
      '<button type="button" class="toast__close" aria-label="알림 닫기">' + ICONS.close + "</button>" +
      '<span class="toast__timer" aria-hidden="true"></span>';
    toastZone().appendChild(el);

    var remaining = dur, started = Date.now(), timer = null;
    function leave() {
      if (el._gone) return;
      el._gone = true;
      window.clearTimeout(timer);
      if (reduceMotion) { el.remove(); return; }
      el.classList.add("is-leaving");
      el.addEventListener("animationend", function () { el.remove(); }, { once: true });
      window.setTimeout(function () { if (el.parentNode) el.remove(); }, 400);
    }
    function run() { started = Date.now(); timer = window.setTimeout(leave, remaining); }
    function pause() { window.clearTimeout(timer); remaining -= Date.now() - started; }
    el.addEventListener("mouseenter", pause);
    el.addEventListener("mouseleave", run);
    el.addEventListener("focusin", pause);
    el.addEventListener("focusout", function (e) { if (!el.contains(e.relatedTarget)) run(); });
    $(".toast__close", el).addEventListener("click", leave);
    run();
    return el;
  }
  document.addEventListener("click", function (e) {
    var t = e.target.closest("[data-toast]");
    if (!t) return;
    toast({
      type: t.getAttribute("data-toast") || "info",
      title: t.getAttribute("data-toast-title") || "처리했습니다",
      text: t.getAttribute("data-toast-text") || "",
      code: t.getAttribute("data-toast-code") || ""
    });
  });
  /* 정적 견본 토스트의 닫기 버튼 */
  document.addEventListener("click", function (e) {
    var c = e.target.closest(".toast--static .toast__close");
    if (c) c.closest(".toast").hidden = true;
  });

  /* ------------------------------------------------------------------------
     8. 팝오버 · 메뉴 — 바깥 클릭 / Esc 닫기, 메뉴 화살표 이동
     ------------------------------------------------------------------------ */
  var openFloats = []; // {btn, panel}
  function closeFloat(f, refocus) {
    f.panel.hidden = true;
    f.btn.setAttribute("aria-expanded", "false");
    openFloats = openFloats.filter(function (x) { return x !== f; });
    if (refocus) f.btn.focus();
  }
  function closeAllFloats(except) {
    openFloats.slice().forEach(function (f) { if (f.panel !== except) closeFloat(f, false); });
  }
  function toggleFloat(btn, kind) {
    var panel = document.getElementById(btn.getAttribute("aria-controls"));
    if (!panel) return;
    var willOpen = panel.hidden;
    closeAllFloats(willOpen ? panel : null);
    if (!willOpen) {
      var f0 = openFloats.filter(function (x) { return x.panel === panel; })[0];
      if (f0) closeFloat(f0, false); else { panel.hidden = true; btn.setAttribute("aria-expanded", "false"); }
      return;
    }
    panel.hidden = false;
    btn.setAttribute("aria-expanded", "true");
    var f = { btn: btn, panel: panel, kind: kind };
    openFloats.push(f);
    if (kind === "menu") {
      var items = menuItems(panel);
      if (items[0]) items[0].focus();
    }
  }
  function menuItems(panel) {
    return $$('[role^="menuitem"]', panel).filter(function (i) { return i.getAttribute("aria-disabled") !== "true" && !i.disabled; });
  }
  document.addEventListener("click", function (e) {
    var p = e.target.closest("[data-popover-toggle]");
    if (p) { e.preventDefault(); toggleFloat(p, "popover"); return; }
    var m = e.target.closest("[data-menu-toggle]");
    if (m) { e.preventDefault(); toggleFloat(m, "menu"); return; }
    var item = e.target.closest('[role^="menuitem"]');
    if (item && item.getAttribute("aria-disabled") !== "true") {
      if (item.getAttribute("role") === "menuitemcheckbox") {
        item.setAttribute("aria-checked", item.getAttribute("aria-checked") === "true" ? "false" : "true");
        return;
      }
      if (item.getAttribute("role") === "menuitemradio") {
        var grp = item.closest('[role="group"]') || item.closest('[role="menu"]');
        $$('[role="menuitemradio"]', grp).forEach(function (r) { r.setAttribute("aria-checked", r === item ? "true" : "false"); });
        return;
      }
      var f = openFloats.filter(function (x) { return x.panel.contains(item); })[0];
      if (f) closeFloat(f, true);
      return;
    }
    openFloats.slice().forEach(function (fl) {
      if (!fl.panel.contains(e.target) && !fl.btn.contains(e.target)) closeFloat(fl, false);
    });
  });
  document.addEventListener("keydown", function (e) {
    if (!openFloats.length) return;
    var f = openFloats[openFloats.length - 1];
    if (e.key === "Escape" && !topLayerContains(f.panel)) {
      e.preventDefault(); e.stopPropagation();
      closeFloat(f, true);
      return;
    }
    if (f.kind === "menu" && f.panel.contains(document.activeElement)) {
      var items = menuItems(f.panel);
      var i = items.indexOf(document.activeElement);
      var n = null;
      if (e.key === "ArrowDown") n = items[(i + 1) % items.length];
      else if (e.key === "ArrowUp") n = items[(i - 1 + items.length) % items.length];
      else if (e.key === "Home") n = items[0];
      else if (e.key === "End") n = items[items.length - 1];
      else if (e.key === "Tab") closeFloat(f, false);
      if (n) { e.preventDefault(); n.focus(); }
    }
  }, true);
  function topLayerContains(el) { var t = topLayer(); return t && !t.el.contains(el); }

  /* ------------------------------------------------------------------------
     9. 캐러셀(도면 판) — 이전/다음 · 번호 칸 · 화살표 키
     ------------------------------------------------------------------------ */
  $$(".carousel").forEach(function (c) {
    var track = $(".carousel__track", c);
    var slides = $$(".carousel__slide", c);
    var nums = $$(".carousel__num", c);
    var prev = $("[data-carousel-prev]", c);
    var next = $("[data-carousel-next]", c);
    var count = $("[data-carousel-count]", c);
    if (!track || !slides.length) return;
    var i = Math.max(0, nums.findIndex ? nums.findIndex(function (n) { return n.getAttribute("aria-selected") === "true"; }) : 0);
    function go(n) {
      i = Math.max(0, Math.min(slides.length - 1, n));
      track.style.transform = "translateX(" + (-100 * i) + "%)";
      slides.forEach(function (s, k) {
        s.setAttribute("aria-hidden", k === i ? "false" : "true");
        $$(FOCUSABLE, s).forEach(function (f) { f.tabIndex = k === i ? 0 : -1; });
      });
      nums.forEach(function (b, k) { b.setAttribute("aria-selected", k === i ? "true" : "false"); b.tabIndex = k === i ? 0 : -1; });
      if (prev) prev.disabled = i === 0;
      if (next) next.disabled = i === slides.length - 1;
      if (count) count.innerHTML = (i + 1) + "<span>/" + slides.length + "</span>";
    }
    if (prev) prev.addEventListener("click", function () { go(i - 1); });
    if (next) next.addEventListener("click", function () { go(i + 1); });
    nums.forEach(function (b, k) {
      b.addEventListener("click", function () { go(k); });
      b.addEventListener("keydown", function (e) {
        if (e.key === "ArrowRight") { e.preventDefault(); go(i + 1); nums[i].focus(); }
        if (e.key === "ArrowLeft") { e.preventDefault(); go(i - 1); nums[i].focus(); }
      });
    });
    c.addEventListener("keydown", function (e) {
      if (e.target.closest(".carousel__num")) return;
      if (e.key === "ArrowRight") go(i + 1);
      if (e.key === "ArrowLeft") go(i - 1);
    });
    go(i);
  });

  /* ------------------------------------------------------------------------
     10. 모바일 셸 — 내비 메뉴 · 사이드바 셔틀
     ------------------------------------------------------------------------ */
  document.addEventListener("click", function (e) {
    var t = e.target.closest("[data-nav-toggle]");
    if (!t) return;
    var nav = t.closest(".navbar");
    var open = nav.getAttribute("data-open") !== "true";
    nav.setAttribute("data-open", open ? "true" : "false");
    t.setAttribute("aria-expanded", open ? "true" : "false");
    t.setAttribute("aria-label", open ? "메뉴 닫기" : "메뉴 열기");
  });
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape" || layers.length) return;
    var nav = $('.navbar[data-open="true"]');
    if (nav) {
      nav.setAttribute("data-open", "false");
      var b = $("[data-nav-toggle]", nav);
      if (b) { b.setAttribute("aria-expanded", "false"); b.setAttribute("aria-label", "메뉴 열기"); b.focus(); }
    }
  });

  var sidebar = $(".sidebar:not(.sidebar--static)");
  var sideScrim = $(".sidebar-scrim");
  function openSidebar() {
    if (!sidebar || sidebar.getAttribute("data-open") === "true") return;
    sidebar.setAttribute("data-open", "true");
    if (sideScrim) sideScrim.setAttribute("data-open", "true");
    $$("[data-sidebar-open]").forEach(function (b) { b.setAttribute("aria-expanded", "true"); });
    pushLayer(sidebar, closeSidebar);
    var f = $(".sidebar__close", sidebar) || focusables(sidebar)[0];
    if (f) f.focus({ preventScroll: true });
  }
  function closeSidebar() {
    if (!sidebar || sidebar.getAttribute("data-open") !== "true") return;
    sidebar.setAttribute("data-open", "false");
    if (sideScrim) sideScrim.setAttribute("data-open", "false");
    $$("[data-sidebar-open]").forEach(function (b) { b.setAttribute("aria-expanded", "false"); });
    popLayer(sidebar);
  }
  document.addEventListener("click", function (e) {
    if (e.target.closest("[data-sidebar-open]")) { e.preventDefault(); openSidebar(); return; }
    if (e.target.closest("[data-sidebar-close], .sidebar-scrim")) closeSidebar();
  });
  window.addEventListener("resize", function () {
    if (window.innerWidth > 1024) closeSidebar();
  });

  /* ------------------------------------------------------------------------
     11. 표 — 정렬 머리 · 전체 선택 · 일괄 출고 확정
     ------------------------------------------------------------------------ */
  function cellValue(row, idx) {
    var cell = row.children[idx];
    if (!cell) return "";
    var v = cell.getAttribute("data-sort");
    if (v != null) return v;
    return cell.textContent.trim();
  }
  $$(".table__sort").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var th = btn.closest("th");
      var table = btn.closest("table");
      var tbody = table.tBodies[0];
      var idx = Array.prototype.indexOf.call(th.parentNode.children, th);
      var dir = th.getAttribute("aria-sort") === "ascending" ? "descending" : "ascending";
      $$("th[aria-sort]", table).forEach(function (h) { if (h !== th) h.setAttribute("aria-sort", "none"); });
      th.setAttribute("aria-sort", dir);
      var rows = $$("tr", tbody);
      var numeric = rows.every(function (r) { var v = cellValue(r, idx).replace(/[₩,%\s대칸건]/g, ""); return v === "" || !isNaN(parseFloat(v)); });
      rows.sort(function (a, b) {
        var x = cellValue(a, idx), y = cellValue(b, idx);
        var r;
        if (numeric) r = (parseFloat(x.replace(/[^\d.-]/g, "")) || 0) - (parseFloat(y.replace(/[^\d.-]/g, "")) || 0);
        else r = x.localeCompare(y, "ko");
        return dir === "ascending" ? r : -r;
      });
      rows.forEach(function (r) { tbody.appendChild(r); });
      var label = th.textContent.trim();
      announce(label + " 기준 " + (dir === "ascending" ? "오름차순" : "내림차순") + "으로 정렬했습니다");
    });
  });

  $$("[data-select-table]").forEach(function (wrap) {
    var all = $("[data-check-all]", wrap);
    var bulk = $(".table-bulk", wrap);
    var countEl = $("[data-bulk-count]", wrap);
    function rowChecks() { return $$("tbody .check input[type=checkbox]", wrap).filter(function (c) { return !c.disabled; }); }
    function sync() {
      var checks = rowChecks();
      var n = 0;
      checks.forEach(function (c) {
        var tr = c.closest("tr");
        if (c.checked) n++;
        if (tr) tr.setAttribute("aria-selected", c.checked ? "true" : "false");
      });
      if (all) {
        all.checked = n > 0 && n === checks.length;
        all.indeterminate = n > 0 && n < checks.length;
      }
      if (bulk) bulk.setAttribute("data-active", n > 0 ? "true" : "false");
      if (countEl) countEl.textContent = n;
      $$("[data-bulk-action]", wrap).forEach(function (b) { b.disabled = n === 0; });
    }
    wrap.addEventListener("change", function (e) {
      if (e.target === all) {
        rowChecks().forEach(function (c) { c.checked = all.checked; });
      }
      sync();
    });
    $$("[data-bulk-action]", wrap).forEach(function (b) {
      b.addEventListener("click", function () {
        var picked = rowChecks().filter(function (c) { return c.checked; });
        if (!picked.length) return;
        busy(b, function () {
          picked.forEach(function (c) {
            var tr = c.closest("tr");
            c.checked = false;
            c.disabled = true;
            if (tr) {
              tr.setAttribute("aria-selected", "false"); // sync() 는 disabled 행을 건너뛰므로 여기서 선택 표시를 지운다
              tr.classList.add("table__row--muted");
              var st = $("[data-status]", tr);
              if (st) st.innerHTML = '<span class="badge badge--ok">' + ICONS.ok + "출고 확정</span>";
            }
          });
          sync();
          toast({ type: "ok", title: "출고 " + picked.length + "건 확정", text: "출고 전표를 라벨 프린터로 보냈습니다.", code: b.getAttribute("data-toast-code") || "" });
        });
      });
    });
    sync();
  });

  /* ------------------------------------------------------------------------
     12. 버튼 진행 상태 — aria-busy → 완료/오류
     ------------------------------------------------------------------------ */
  function busy(btn, done, opts) {
    opts = opts || {};
    if (btn.getAttribute("aria-busy") === "true") return;
    var label = btn.querySelector("[data-label]") || btn;
    var orig = label.textContent;
    btn.setAttribute("aria-busy", "true");
    btn.setAttribute("aria-disabled", "true");
    label.textContent = opts.busyText || btn.getAttribute("data-busy-text") || "처리 중";
    window.setTimeout(function () {
      btn.removeAttribute("aria-busy");
      btn.removeAttribute("aria-disabled");
      var state = opts.fail ? "error" : "done";
      btn.setAttribute("data-state", state);
      label.textContent = opts.fail ? (btn.getAttribute("data-fail-text") || "다시 시도") : (btn.getAttribute("data-done-text") || "완료");
      if (done) done();
      window.setTimeout(function () { btn.removeAttribute("data-state"); label.textContent = orig; }, 2200);
    }, opts.wait || 1200);
  }
  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-busy-demo]");
    if (!b) return;
    e.preventDefault();
    var fail = b.getAttribute("data-busy-demo") === "fail";
    busy(b, function () {
      if (b.getAttribute("data-toast-title")) {
        toast({ type: fail ? "ban" : (b.getAttribute("data-toast") || "ok"), title: b.getAttribute("data-toast-title"), text: b.getAttribute("data-toast-text") || "", code: b.getAttribute("data-toast-code") || "" });
      }
    }, { fail: fail });
  });
  /* aria-disabled 링크·버튼은 누르지 않는다 */
  document.addEventListener("click", function (e) {
    var d = e.target.closest('a[aria-disabled="true"], button[aria-disabled="true"]');
    if (d && !d.hasAttribute("aria-busy")) { e.preventDefault(); e.stopImmediatePropagation(); }
  }, true);

  /* ------------------------------------------------------------------------
     13. 폼 — 필수 검사 · 오류 표시 · 라벨 출력 피드백 · 로커 스위치 · 스텝퍼
     ------------------------------------------------------------------------ */
  function setInvalid(ctrl, bad) {
    var field = ctrl.closest(".field");
    ctrl.setAttribute("aria-invalid", bad ? "true" : "false");
    if (field) {
      field.classList.toggle("field--invalid", bad);
      var err = $(".field__error", field);
      if (err && err.id) {
        var ids = (ctrl.getAttribute("aria-describedby") || "").split(/\s+/).filter(Boolean);
        if (ids.indexOf(err.id) === -1) ids.push(err.id);
        ctrl.setAttribute("aria-describedby", ids.join(" "));
      }
    }
    var chk = ctrl.closest(".check");
    if (chk) chk.classList.toggle("check--invalid", bad);
  }
  function checkControl(ctrl) {
    var bad = false;
    if (ctrl.type === "checkbox") bad = ctrl.required && !ctrl.checked;
    else if (ctrl.required && !ctrl.value.trim()) bad = true;
    else if (ctrl.pattern && ctrl.value && !new RegExp("^(?:" + ctrl.pattern + ")$").test(ctrl.value)) bad = true;
    else if (ctrl.type === "number" && ctrl.value !== "" && ((ctrl.min !== "" && +ctrl.value < +ctrl.min) || (ctrl.max !== "" && +ctrl.value > +ctrl.max))) bad = true;
    setInvalid(ctrl, bad);
    return !bad;
  }
  $$("form[data-validate]").forEach(function (form) {
    form.setAttribute("novalidate", "");
    var ctrls = function () { return $$("input, select, textarea", form).filter(function (c) { return !c.disabled && c.type !== "hidden"; }); };
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var firstBad = null;
      ctrls().forEach(function (c) { if (!checkControl(c) && !firstBad) firstBad = c; });
      var summary = $("[data-form-summary]", form);
      if (firstBad) {
        if (summary) summary.hidden = false;
        firstBad.focus();
        announce("입력하지 않았거나 잘못된 항목이 있습니다");
        return;
      }
      if (summary) summary.hidden = true;
      var submit = $('[type="submit"]', form);
      if (submit) {
        busy(submit, function () {
          toast({ type: "ok", title: form.getAttribute("data-ok-title") || "등록했습니다", text: form.getAttribute("data-ok-text") || "", code: form.getAttribute("data-ok-code") || "" });
        }, { busyText: submit.getAttribute("data-busy-text") || "라벨 출력 중", wait: 1400 });
      }
    });
    form.addEventListener("input", function (e) {
      if (e.target.getAttribute("aria-invalid") === "true") checkControl(e.target);
    });
    form.addEventListener("change", function (e) {
      if (e.target.getAttribute("aria-invalid") === "true") checkControl(e.target);
    });
  });

  document.addEventListener("click", function (e) {
    var r = e.target.closest('button.rocker[role="switch"]');
    if (!r || r.disabled) return;
    var on = r.getAttribute("aria-checked") !== "true";
    r.setAttribute("aria-checked", on ? "true" : "false");
    var st = $("[data-rocker-state]", r);
    if (st) st.textContent = on ? (st.getAttribute("data-on") || "켜짐") : (st.getAttribute("data-off") || "꺼짐");
  });

  $$(".stepper").forEach(function (s) {
    var input = $("input", s);
    var dec = $('[data-step="-1"]', s);
    var inc = $('[data-step="1"]', s);
    if (!input) return;
    function clamp() {
      var min = input.min !== "" ? +input.min : -Infinity;
      var max = input.max !== "" ? +input.max : Infinity;
      var v = Math.max(min, Math.min(max, parseInt(input.value, 10) || 0));
      input.value = v;
      if (dec) dec.disabled = v <= min;
      if (inc) inc.disabled = v >= max;
      input.dispatchEvent(new Event("stepper-change", { bubbles: true }));
    }
    s.addEventListener("click", function (e) {
      var b = e.target.closest("[data-step]");
      if (!b) return;
      input.value = (parseInt(input.value, 10) || 0) + parseInt(b.getAttribute("data-step"), 10);
      clamp();
    });
    input.addEventListener("change", clamp);
    clamp();
  });

  /* ------------------------------------------------------------------------
     14. 진행률 — data-value(0~100) → 10칸 단위(--cells), ≥95 위험 적재
     ------------------------------------------------------------------------ */
  function setMeter(m, v) {
    v = Math.max(0, Math.min(100, +v));
    var cells = Math.round(v / 10);
    var fill = $(".meter__fill", m);
    m.setAttribute("data-value", v);
    m.setAttribute("data-empty", cells === 0 ? "true" : "false");
    if (m.hasAttribute("data-hot-at")) m.setAttribute("data-hot", v >= +m.getAttribute("data-hot-at") ? "true" : "false");
    if (fill) fill.style.setProperty("--cells", cells);
    var bar = $('[role="progressbar"]', m) || m;
    bar.setAttribute("aria-valuenow", v);
    var out = $("[data-meter-out]", m);
    if (out) out.firstChild.nodeValue = (Math.round(v * 10) / 10).toString();
  }
  $$(".meter[data-value]").forEach(function (m) { setMeter(m, m.getAttribute("data-value")); });
  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-meter-step]");
    if (!b) return;
    var m = document.getElementById(b.getAttribute("aria-controls"));
    if (!m) return;
    var v = (+m.getAttribute("data-value") || 0) + (+b.getAttribute("data-meter-step"));
    if (v > 100) v = 0;
    setMeter(m, v);
  });

  /* ------------------------------------------------------------------------
     15. 정비 작업 지시판 — 드래그 · 키보드(스페이스 집기 → ←/→ 이동 → 스페이스 놓기)
         data-deny="ban" 열은 사용 금지 꼬리표를 받지 않는다(경고 띠)
     ------------------------------------------------------------------------ */
  $$(".kanban").forEach(function (board) {
    var cols = $$(".kanban__col", board);
    var dragging = null;
    function listOf(col) { return $(".kanban__list", col); }
    function denies(list, card) {
      return list.getAttribute("data-deny") === "ban" && card.classList.contains("kcard--ban");
    }
    // 열 머리 건수는 팩트 값(화면에 일부만 그려도 됨) — 이동할 때 ±1 만 반영한다
    function shiftCount(col, d) {
      var c = $("[data-count]", col);
      if (c) c.textContent = Math.max(0, (parseInt(c.textContent, 10) || 0) + d);
    }
    function colName(col) { var n = $(".rack-label__name", col); return n ? n.textContent.trim() : ""; }
    function moveTo(card, col) {
      var list = listOf(col);
      if (denies(list, card)) {
        list.classList.add("is-denied");
        window.setTimeout(function () { list.classList.remove("is-denied"); }, 900);
        announce("사용 금지 장비는 " + colName(col) + " 칸에 놓을 수 없습니다");
        return false;
      }
      var from = card.closest(".kanban__col");
      if (from === col) return true;
      var add = $(".kanban__add", list);
      list.insertBefore(card, add || null);
      shiftCount(from, -1);
      shiftCount(col, 1);
      return true;
    }
    $$(".kcard", board).forEach(function (card) {
      card.setAttribute("draggable", "true");
      if (!card.hasAttribute("tabindex")) card.tabIndex = 0;
      card.addEventListener("dragstart", function (e) {
        dragging = card;
        card.classList.add("is-dragging");
        try { e.dataTransfer.setData("text/plain", card.id || "kcard"); e.dataTransfer.effectAllowed = "move"; } catch (err) { /* 무시 */ }
      });
      card.addEventListener("dragend", function () {
        card.classList.remove("is-dragging");
        dragging = null;
        $$(".kanban__list", board).forEach(function (l) { l.classList.remove("is-over"); });
      });
      card.addEventListener("keydown", function (e) {
        var grabbed = card.classList.contains("is-grabbed");
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          card.classList.toggle("is-grabbed", !grabbed);
          card.setAttribute("aria-pressed", !grabbed ? "true" : "false");
          announce(!grabbed ? "작업지시를 집었습니다. 좌우 화살표로 열을 옮기고 스페이스로 놓으세요" : "작업지시를 " + colName(card.closest(".kanban__col")) + " 칸에 놓았습니다");
          return;
        }
        if (grabbed && (e.key === "ArrowRight" || e.key === "ArrowLeft")) {
          e.preventDefault();
          var ci = cols.indexOf(card.closest(".kanban__col"));
          var ni = ci + (e.key === "ArrowRight" ? 1 : -1);
          if (ni < 0 || ni >= cols.length) return;
          if (moveTo(card, cols[ni])) { card.focus(); announce(colName(cols[ni]) + " 칸"); }
        }
        if (grabbed && e.key === "Escape") {
          e.stopPropagation();
          card.classList.remove("is-grabbed");
          card.setAttribute("aria-pressed", "false");
        }
      });
    });
    $$(".kanban__list", board).forEach(function (list) {
      list.addEventListener("dragover", function (e) {
        if (!dragging) return;
        if (denies(list, dragging)) { list.classList.add("is-denied"); return; }
        e.preventDefault();
        list.classList.add("is-over");
      });
      list.addEventListener("dragleave", function (e) {
        if (!list.contains(e.relatedTarget)) { list.classList.remove("is-over"); list.classList.remove("is-denied"); }
      });
      list.addEventListener("drop", function (e) {
        e.preventDefault();
        list.classList.remove("is-over");
        if (!dragging) return;
        var target = list.closest(".kanban__col");
        if (dragging.closest(".kanban__col") === target) return;
        if (moveTo(dragging, target)) {
          toast({ type: "info", title: "작업지시 이동", text: (($(".kcard__wo", dragging) || {}).textContent || "") + " → " + colName(list.closest(".kanban__col")) });
        }
      });
    });
  });

  /* ------------------------------------------------------------------------
     16. 교대 근무표 — 칸 선택(한 칸만), 주 이동 버튼은 범위 밖이면 비활성
     ------------------------------------------------------------------------ */
  $$(".shiftcal").forEach(function (cal) {
    cal.addEventListener("click", function (e) {
      var s = e.target.closest("button.shiftcal__slot");
      if (!s || s.disabled) return;
      var on = s.getAttribute("aria-pressed") !== "true";
      $$("button.shiftcal__slot", cal).forEach(function (x) { x.setAttribute("aria-pressed", "false"); });
      s.setAttribute("aria-pressed", on ? "true" : "false");
      var out = $("[data-shift-out]", cal);
      if (out) out.textContent = on ? s.getAttribute("aria-label") || s.textContent.trim() : "선택한 근무 없음";
    });
  });

  /* ------------------------------------------------------------------------
     17. 전광 안전 게시판 — 이음매 없는 반복 · 정지 버튼
     ------------------------------------------------------------------------ */
  $$(".signboard").forEach(function (sb) {
    var track = $(".signboard__track", sb);
    if (track && !track.hasAttribute("data-cloned")) {
      var items = $$(".signboard__item", track);
      items.forEach(function (it) {
        var c = it.cloneNode(true);
        c.setAttribute("aria-hidden", "true");
        track.appendChild(c);
      });
      track.setAttribute("data-cloned", "true");
      var w = track.scrollWidth / 2;
      track.style.setProperty("--sign-dur", Math.max(20, Math.round(w / 60)) + "s");
    }
    var btn = $(".signboard__toggle", sb);
    if (btn) {
      if (reduceMotion) sb.setAttribute("data-paused", "true");
      var sync = function () {
        var p = sb.getAttribute("data-paused") === "true";
        btn.setAttribute("aria-pressed", p ? "true" : "false");
        btn.setAttribute("aria-label", p ? "게시판 흐름 다시 재생" : "게시판 흐름 멈춤");
        btn.innerHTML = p
          ? '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path class="fill" d="M7 5l12 7-12 7z"/></svg>'
          : '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14M16 5v14"/></svg>';
      };
      btn.addEventListener("click", function () {
        sb.setAttribute("data-paused", sb.getAttribute("data-paused") === "true" ? "false" : "true");
        sync();
      });
      sync();
    }
  });

  /* ------------------------------------------------------------------------
     18. 동작 시험대 — [data-motion-play="m-press|m-swing|m-print|m-shuttle|m-steps"]
     ------------------------------------------------------------------------ */
  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-motion-play]");
    if (!b) return;
    var cls = b.getAttribute("data-motion-play");
    var cell = b.closest(".bench__cell") || document;
    var subj = b.getAttribute("aria-controls") ? document.getElementById(b.getAttribute("aria-controls")) : $("[data-motion-subject]", cell);
    if (subj) restartAnimation(subj, cls);
  });

  /* ------------------------------------------------------------------------
     19. 기타 — 툴팁 Esc · 알림 닫기 · 코드 복사 · 페이지 번호 · 스크롤 힌트
     ------------------------------------------------------------------------ */
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    var tip = document.activeElement && document.activeElement.closest && document.activeElement.closest(".tip");
    if (tip) tip.setAttribute("data-dismissed", "true");
  });
  document.addEventListener("focusout", function (e) {
    var tip = e.target.closest && e.target.closest(".tip");
    if (tip) tip.removeAttribute("data-dismissed");
  });
  document.addEventListener("mouseover", function (e) {
    var tip = e.target.closest && e.target.closest('.tip[data-dismissed="true"]');
    if (tip && !tip.contains(document.activeElement)) tip.removeAttribute("data-dismissed");
  });

  document.addEventListener("click", function (e) {
    var c = e.target.closest(".alert__close");
    if (!c) return;
    var a = c.closest(".alert");
    if (a) { a.hidden = true; announce("알림을 닫았습니다"); }
  });

  document.addEventListener("click", function (e) {
    var b = e.target.closest(".code__copy");
    if (!b) return;
    var pre = $(".code__pre", b.closest(".code"));
    if (!pre) return;
    var text = $$(".code__l", pre).map(function (l) { return l.textContent; }).join("\n") || pre.textContent;
    var label = $("[data-label]", b) || b;
    var orig = label.textContent;
    function done(ok) {
      b.setAttribute("data-state", ok ? "done" : "error");
      label.textContent = ok ? "복사됨" : "복사 실패";
      window.setTimeout(function () { b.removeAttribute("data-state"); label.textContent = orig; }, 1800);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(function () { done(true); }, function () { done(false); });
    else done(false);
  });

  document.addEventListener("click", function (e) {
    var n = e.target.closest("button.pager__num");
    if (!n) return;
    var pager = n.closest(".pager");
    $$(".pager__num", pager).forEach(function (x) { x.removeAttribute("aria-current"); });
    n.setAttribute("aria-current", "page");
    var nums = $$(".pager__num", pager);
    var i = nums.indexOf(n);
    var prev = $("[data-pager-prev]", pager), next = $("[data-pager-next]", pager);
    if (prev) prev.setAttribute("aria-disabled", i === 0 ? "true" : "false");
    if (next) next.setAttribute("aria-disabled", i === nums.length - 1 ? "true" : "false");
    var out = $("[data-pager-out]", pager);
    if (out) out.textContent = n.textContent.trim();
  });
  document.addEventListener("click", function (e) {
    var s = e.target.closest("[data-pager-prev], [data-pager-next]");
    if (!s || s.getAttribute("aria-disabled") === "true") return;
    var pager = s.closest(".pager");
    var nums = $$("button.pager__num", pager);
    if (!nums.length) return;
    var cur = nums.findIndex(function (x) { return x.getAttribute("aria-current") === "page"; });
    var t = nums[cur + (s.hasAttribute("data-pager-next") ? 1 : -1)];
    if (t) t.click();
  });

  /* 가로 스크롤 힌트: .table-wrap / .tabs__bar / .scroll-hint */
  function watchScroll(host, scroller) {
    if (!scroller) return;
    function upd() {
      var over = scroller.scrollWidth > scroller.clientWidth + 1;
      host.setAttribute("data-overflow", over ? "true" : "false");
      host.setAttribute("data-at-end", scroller.scrollLeft + scroller.clientWidth >= scroller.scrollWidth - 2 ? "true" : "false");
    }
    scroller.addEventListener("scroll", upd, { passive: true });
    if (window.ResizeObserver) new ResizeObserver(upd).observe(scroller);
    else window.addEventListener("resize", upd);
    upd();
  }
  $$(".table-wrap").forEach(function (w) { watchScroll(w, $(".table-wrap__scroll", w)); });
  $$(".tabs__bar").forEach(function (b) { watchScroll(b, $(".tabs__list", b)); });
  $$(".scroll-hint").forEach(function (h) { watchScroll(h, $(".scroll-x", h) || h.firstElementChild); });

  /* 매달린 꼬리표: 키보드 포커스에도 흔들림(CSS :focus-within) — 모션 줄이기면 생략 */

  /* 외부 노출 */
  window.BWD = {
    toast: toast,
    openModal: openModal,
    openDrawer: openDrawer,
    setMeter: setMeter,
    announce: announce,
    setTheme: function (t) { applyTheme(t); try { localStorage.setItem(THEME_KEY, t); } catch (e) { /* 무시 */ } }
  };
})();
