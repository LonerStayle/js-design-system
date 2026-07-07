/* ============================================================================
   theme-14 · Minimal Monochrome — app.js
   ----------------------------------------------------------------------------
   순수 바닐라 JS. 외부 의존 0. file:// 더블클릭만으로 동작.
   data-* 속성 기반 이벤트 위임 → 모든 페이지에서 자동 활성화.
   공개 API: window.MM.toast(opts), window.MM.openModal(id) 등.
   ========================================================================== */
(function () {
  "use strict";

  var MM = (window.MM = window.MM || {});
  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };
  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // JS 도착 표시 — [data-reveal] 숨김은 html.js 스코프에서만(JS 실패 시 콘텐츠 잔존 방지)
  document.documentElement.classList.add("js");

  /* ----------------------------------------------------------------------
     THEME — 라이트/다크 토글 (무채색 둘 다). localStorage 영속.
     ---------------------------------------------------------------------- */
  var THEME_KEY = "mm-theme";
  function getStoredTheme() { try { return localStorage.getItem(THEME_KEY); } catch (e) { return null; } }
  function systemTheme() { return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"; }
  function applyTheme(t) {
    document.documentElement.setAttribute("data-theme", t);
    $$("[data-theme-toggle]").forEach(function (btn) {
      btn.setAttribute("aria-pressed", String(t === "dark"));
      var lbl = btn.getAttribute("aria-label") || "";
      btn.setAttribute("aria-label", lbl.replace(/(라이트|다크).*$/, "") || (t === "dark" ? "라이트 모드로 전환" : "다크 모드로 전환"));
    });
  }
  MM.setTheme = function (t) { try { localStorage.setItem(THEME_KEY, t); } catch (e) {} applyTheme(t); };
  // 흑↔백 원형 잠식 전환(§3-E 시그니처). View Transitions 지원 + 모션 허용 시에만.
  // 미지원/reduced-motion 은 즉시 스왑. 클릭 좌표를 원점으로.
  MM.toggleTheme = function (originEl) {
    var cur = document.documentElement.getAttribute("data-theme") || systemTheme();
    var next = cur === "dark" ? "light" : "dark";
    if (prefersReduced || !document.startViewTransition) { MM.setTheme(next); return; }
    var x = "50%", y = "50%";
    if (originEl && originEl.getBoundingClientRect) {
      var r = originEl.getBoundingClientRect();
      x = (r.left + r.width / 2) + "px"; y = (r.top + r.height / 2) + "px";
    }
    document.documentElement.style.setProperty("--wipe-x", x);
    document.documentElement.style.setProperty("--wipe-y", y);
    document.startViewTransition(function () { MM.setTheme(next); });
  };
  // 초기 적용(깜빡임 최소화를 위해 head 인라인에서도 호출됨)
  applyTheme(getStoredTheme() || systemTheme());

  /* ----------------------------------------------------------------------
     FOCUS TRAP — 모달/드로어/커맨드 공용
     ---------------------------------------------------------------------- */
  var FOCUSABLE = 'a[href],button:not([disabled]),textarea:not([disabled]),input:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])';
  function trapFocus(container, e) {
    var nodes = $$(FOCUSABLE, container).filter(function (n) { return n.offsetParent !== null; });
    if (!nodes.length) return;
    var first = nodes[0], last = nodes[nodes.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
  var lastFocused = null;

  /* ----------------------------------------------------------------------
     MODAL / DIALOG
     ---------------------------------------------------------------------- */
  function getOverlayFor(el) {
    var ov = el.previousElementSibling;
    if (ov && ov.classList.contains("overlay")) return ov;
    return $(".overlay[data-overlay-shared]");
  }
  MM.openModal = function (id) {
    var modal = document.getElementById(id);
    if (!modal) return;
    lastFocused = document.activeElement;
    var ov = getOverlayFor(modal);
    if (ov) ov.classList.add("is-open");
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    var f = $("[autofocus]", modal) || $(FOCUSABLE, modal);
    if (f) setTimeout(function () { f.focus(); }, 30);
  };
  MM.closeModal = function (modal) {
    if (typeof modal === "string") modal = document.getElementById(modal);
    if (!modal) return;
    var ov = getOverlayFor(modal);
    if (ov) ov.classList.remove("is-open");
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (lastFocused) lastFocused.focus();
  };

  /* ----------------------------------------------------------------------
     DRAWER
     ---------------------------------------------------------------------- */
  MM.openDrawer = function (id) {
    var d = document.getElementById(id);
    if (!d) return;
    lastFocused = document.activeElement;
    var ov = getOverlayFor(d);
    if (ov) ov.classList.add("is-open");
    d.classList.add("is-open");
    d.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    var f = $(FOCUSABLE, d); if (f) setTimeout(function () { f.focus(); }, 30);
  };
  MM.closeDrawer = function (d) {
    if (typeof d === "string") d = document.getElementById(d);
    if (!d) return;
    var ov = getOverlayFor(d);
    if (ov) ov.classList.remove("is-open");
    d.classList.remove("is-open");
    d.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (lastFocused) lastFocused.focus();
  };

  /* ----------------------------------------------------------------------
     TOAST — 스택. MM.toast({title, body, icon, duration})
     ---------------------------------------------------------------------- */
  function ensureToastRegion() {
    var r = $(".toast-region");
    if (!r) { r = document.createElement("div"); r.className = "toast-region"; r.setAttribute("role", "region"); r.setAttribute("aria-label", "알림"); document.body.appendChild(r); }
    return r;
  }
  var ICONS = {
    info:    '<circle cx="12" cy="12" r="9"/><path d="M12 8h.01M11 12h1v4h1"/>',
    success: '<path d="M20 6L9 17l-5-5"/>',
    warning: '<path d="M12 9v4m0 4h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/>',
    danger:  '<circle cx="12" cy="12" r="9"/><path d="M15 9l-6 6M9 9l6 6"/>',
    bell:    '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/>'
  };
  MM.toast = function (opts) {
    opts = opts || {};
    var region = ensureToastRegion();
    var t = document.createElement("div");
    t.className = "toast";
    t.setAttribute("role", "status");
    var ico = ICONS[opts.icon] || ICONS.bell;
    t.innerHTML =
      '<span class="toast-icon"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true">' + ico + '</svg></span>' +
      '<div class="grow"><div class="toast-title">' + (opts.title || "알림") + "</div>" +
      (opts.body ? '<div class="toast-body">' + opts.body + "</div>" : "") + "</div>" +
      '<button class="toast-close" aria-label="닫기"><svg class="icon icon-sm" viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6L6 18M6 6l12 12"/></svg></button>';
    region.appendChild(t);
    var close = function () {
      t.classList.add("is-leaving");
      setTimeout(function () { t.remove(); }, prefersReduced ? 0 : 200);
    };
    $(".toast-close", t).addEventListener("click", close);
    var dur = opts.duration == null ? 4000 : opts.duration;
    if (dur > 0) setTimeout(close, dur);
    return close;
  };

  /* ----------------------------------------------------------------------
     COMMAND PALETTE (⌘K / Ctrl+K)
     ---------------------------------------------------------------------- */
  MM.openCommand = function () {
    var c = $(".command"); if (!c) return;
    lastFocused = document.activeElement;
    c.classList.add("is-open"); c.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    var input = $(".command-search input", c);
    if (input) { input.value = ""; filterCommand(c, ""); setTimeout(function () { input.focus(); }, 30); }
    setActiveCommandItem(c, 0);
  };
  MM.closeCommand = function () {
    var c = $(".command"); if (!c) return;
    c.classList.remove("is-open"); c.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (lastFocused) lastFocused.focus();
  };
  function visibleCommandItems(c) { return $$(".command-item", c).filter(function (i) { return i.style.display !== "none"; }); }
  function setActiveCommandItem(c, idx) {
    var items = visibleCommandItems(c);
    items.forEach(function (i) { i.classList.remove("is-active"); });
    if (!items.length) return;
    idx = (idx + items.length) % items.length;
    items[idx].classList.add("is-active");
    items[idx].scrollIntoView({ block: "nearest" });
  }
  function filterCommand(c, q) {
    q = (q || "").toLowerCase().trim();
    var any = false;
    $$(".command-item", c).forEach(function (item) {
      var txt = (item.textContent || "").toLowerCase();
      var show = !q || txt.indexOf(q) > -1;
      item.style.display = show ? "" : "none";
      if (show) any = true;
    });
    $$(".command-group-label", c).forEach(function (lbl) {
      // 그룹 내 보이는 항목 있는지
      var sib = lbl.nextElementSibling, vis = false;
      while (sib && !sib.classList.contains("command-group-label")) {
        if (sib.classList.contains("command-item") && sib.style.display !== "none") vis = true;
        sib = sib.nextElementSibling;
      }
      lbl.style.display = vis ? "" : "none";
    });
    var empty = $(".command-empty", c);
    if (empty) empty.style.display = any ? "none" : "";
    setActiveCommandItem(c, 0);
  }

  /* ----------------------------------------------------------------------
     글로벌 클릭 위임
     ---------------------------------------------------------------------- */
  document.addEventListener("click", function (e) {
    var t = e.target;

    // theme toggle (클릭 좌표를 원형 전환 원점으로)
    var tt = t.closest("[data-theme-toggle]");
    if (tt) { MM.toggleTheme(tt); return; }

    // modal
    var mo = t.closest("[data-modal-open]");
    if (mo) { e.preventDefault(); MM.openModal(mo.getAttribute("data-modal-open")); return; }
    if (t.closest("[data-modal-close]")) { var md = t.closest(".modal"); if (md) MM.closeModal(md); return; }

    // drawer
    var dro = t.closest("[data-drawer-open]");
    if (dro) { e.preventDefault(); MM.openDrawer(dro.getAttribute("data-drawer-open")); return; }
    if (t.closest("[data-drawer-close]")) { var dr = t.closest(".drawer"); if (dr) MM.closeDrawer(dr); return; }

    // overlay 클릭 = 열려있는 모달/드로어/커맨드 닫기
    if (t.classList && t.classList.contains("overlay")) {
      $$(".modal.is-open").forEach(MM.closeModal);
      $$(".drawer.is-open").forEach(MM.closeDrawer);
      t.classList.remove("is-open");
      document.body.style.overflow = "";
      return;
    }

    // command open
    if (t.closest("[data-command-open]")) { MM.openCommand(); return; }
    if (t.closest(".command") && (t.classList.contains("command") )) { MM.closeCommand(); return; }
    var ci = t.closest(".command-item");
    if (ci) {
      var href = ci.getAttribute("data-href");
      var action = ci.getAttribute("data-command-action");
      var toggleBtn = $("[data-theme-toggle]");
      MM.closeCommand();
      if (href) { location.href = href; }
      else if (action === "toggle-theme") { MM.toggleTheme(toggleBtn); }
      else if (action === "demo-toast") { MM.toast({ title: "알림 테스트", body: "커맨드 팔레트에서 호출한 토스트입니다.", icon: "bell" }); }
      return;
    }

    // toast 데모 트리거
    var tb = t.closest("[data-toast]");
    if (tb) {
      MM.toast({
        title: tb.getAttribute("data-toast") || "알림",
        body: tb.getAttribute("data-toast-body") || "",
        icon: tb.getAttribute("data-toast-icon") || "bell"
      });
      return;
    }

    // dropdown toggle
    var dt = t.closest("[data-dropdown-toggle]");
    if (dt) {
      e.preventDefault();
      var dd = dt.closest(".dropdown");
      var wasOpen = dd.classList.contains("is-open");
      $$(".dropdown.is-open").forEach(function (d) { d.classList.remove("is-open"); var b = $("[data-dropdown-toggle]", d); if (b) b.setAttribute("aria-expanded", "false"); });
      if (!wasOpen) { dd.classList.add("is-open"); dt.setAttribute("aria-expanded", "true"); }
      return;
    }
    // 메뉴 항목 클릭 → 드롭다운 닫기 (실제 동작은 별도)
    var mi = t.closest(".menu-item");
    if (mi && mi.closest(".dropdown")) {
      mi.closest(".dropdown").classList.remove("is-open");
    }
    // 바깥 클릭 → 열린 드롭다운/팝오버 닫기
    if (!t.closest(".dropdown")) {
      $$(".dropdown.is-open").forEach(function (d) { d.classList.remove("is-open"); var b = $("[data-dropdown-toggle]", d); if (b) b.setAttribute("aria-expanded", "false"); });
    }
    if (!t.closest("[data-popover]") && !t.closest(".popover")) {
      $$(".popover.is-open").forEach(function (p) { p.classList.remove("is-open"); });
    }

    // popover toggle
    var pt = t.closest("[data-popover-toggle]");
    if (pt) {
      e.preventDefault();
      var pop = document.getElementById(pt.getAttribute("data-popover-toggle"));
      if (pop) { pop.classList.toggle("is-open"); }
      return;
    }

    // tabs
    var tab = t.closest('[role="tab"]');
    if (tab) { activateTab(tab); return; }

    // accordion
    var atr = t.closest(".accordion-trigger");
    if (atr) { toggleAccordion(atr); return; }

    // segmented control (role=radiogroup → aria-checked / role=tablist·무role → aria-selected)
    var seg = t.closest(".segmented button, .segmented .seg");
    if (seg && seg.closest(".segmented")) { selectSegment(seg.closest(".segmented"), seg, true); return; }

    // button-group toggle (aria-pressed)
    var bg = t.closest(".btn-group [aria-pressed]");
    if (bg && bg.closest(".btn-group[data-single]")) {
      $$("[aria-pressed]", bg.closest(".btn-group")).forEach(function (b) { b.setAttribute("aria-pressed", "false"); });
      bg.setAttribute("aria-pressed", "true");
      return;
    }

    // stepper
    var stepBtn = t.closest(".stepper button");
    if (stepBtn) {
      var wrap = stepBtn.closest(".stepper"); var inp = $("input", wrap);
      if (inp) {
        var v = parseInt(inp.value || "0", 10) || 0;
        var min = inp.min !== "" ? parseInt(inp.min, 10) : -Infinity;
        var max = inp.max !== "" ? parseInt(inp.max, 10) : Infinity;
        v += stepBtn.hasAttribute("data-dec") ? -1 : 1;
        v = Math.max(min, Math.min(max, v));
        inp.value = v;
        inp.dispatchEvent(new Event("change", { bubbles: true }));
      }
      return;
    }

    // rating
    var star = t.closest(".rating .star");
    if (star && !star.closest('[data-readonly="true"]')) { setRating(star.closest(".rating"), parseInt(star.getAttribute("data-value"), 10), true); return; }

    // chip 제거
    var chipDel = t.closest(".chip button, .tag-removable button");
    if (chipDel) { var chip = chipDel.closest(".chip, .tag"); if (chip) chip.remove(); return; }

    // searchbar clear
    var sbc = t.closest(".searchbar-clear");
    if (sbc) { var sin = $("input", sbc.closest(".searchbar")); if (sin) { sin.value = ""; sin.focus(); sin.dispatchEvent(new Event("input", { bubbles: true })); } return; }

    // copy
    var cp = t.closest("[data-copy]");
    if (cp) { doCopy(cp); return; }

    // table sort (헤더 라벨은 실제 <button class="th-sort">, 정렬 대상은 부모 <th>)
    var thBtn = t.closest(".th-sort");
    if (thBtn) { var thEl = thBtn.closest("th"); if (thEl) sortTable(thEl); return; }

    // carousel controls
    var cprev = t.closest("[data-carousel-prev]"), cnext = t.closest("[data-carousel-next]");
    if (cprev) { moveCarousel(cprev.closest("[data-carousel]"), -1); return; }
    if (cnext) { moveCarousel(cnext.closest("[data-carousel]"), 1); return; }
    var cdot = t.closest(".carousel-dot");
    if (cdot) { var car = cdot.closest("[data-carousel]"); goCarousel(car, parseInt(cdot.getAttribute("data-index"), 10)); return; }

    // sidebar collapse / mobile open
    if (t.closest("[data-sidebar-toggle]")) { var shell = $(".app-shell"); if (shell) shell.classList.toggle("is-collapsed"); return; }
    if (t.closest("[data-sidebar-open]")) { var sb = $(".sidebar"); if (sb) sb.classList.toggle("is-open"); return; }

    // wizard steps next/prev
    var wn = t.closest("[data-wizard-next]"), wp = t.closest("[data-wizard-prev]");
    if (wn) { moveWizard(1); return; }
    if (wp) { moveWizard(-1); return; }

    // generic dismiss (alert/banner/toast close)
    var dis = t.closest("[data-dismiss]");
    if (dis) { var box = dis.closest(dis.getAttribute("data-dismiss") || ".alert, .banner"); if (box) box.remove(); return; }
  });

  /* ----------------------------------------------------------------------
     키보드: ESC 닫기 / 화살표 / ⌘K / 탭 트랩
     ---------------------------------------------------------------------- */
  document.addEventListener("keydown", function (e) {
    // ⌘K / Ctrl+K
    if ((e.metaKey || e.ctrlKey) && (e.key === "k" || e.key === "K")) {
      e.preventDefault();
      var c = $(".command");
      if (c) { c.classList.contains("is-open") ? MM.closeCommand() : MM.openCommand(); }
      return;
    }
    // ESC
    if (e.key === "Escape") {
      var oc = $(".command.is-open"); if (oc) { MM.closeCommand(); return; }
      var om = $(".modal.is-open"); if (om) { MM.closeModal(om); return; }
      var od = $(".drawer.is-open"); if (od) { MM.closeDrawer(od); return; }
      var op = $(".popover.is-open"); if (op) { op.classList.remove("is-open"); return; }
      var odd = $(".dropdown.is-open"); if (odd) { odd.classList.remove("is-open"); var b = $("[data-dropdown-toggle]", odd); if (b) { b.setAttribute("aria-expanded", "false"); b.focus(); } return; }
    }
    // Focus trap for open overlays
    if (e.key === "Tab") {
      var openLayer = $(".command.is-open") || $(".modal.is-open") || $(".drawer.is-open");
      if (openLayer) {
        var inner = $(".command-panel", openLayer) || $(".modal-dialog", openLayer) || openLayer;
        trapFocus(inner, e);
      }
    }
    // Command palette 화살표 탐색
    var c2 = $(".command.is-open");
    if (c2 && (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter")) {
      var items = visibleCommandItems(c2);
      var idx = items.findIndex(function (i) { return i.classList.contains("is-active"); });
      if (e.key === "ArrowDown") { e.preventDefault(); setActiveCommandItem(c2, idx + 1); }
      else if (e.key === "ArrowUp") { e.preventDefault(); setActiveCommandItem(c2, idx - 1); }
      else if (e.key === "Enter") { e.preventDefault(); if (items[idx]) items[idx].click(); }
    }
    // Tabs 화살표
    var activeTab = document.activeElement;
    if (activeTab && activeTab.getAttribute && activeTab.getAttribute("role") === "tab" && (e.key === "ArrowRight" || e.key === "ArrowLeft")) {
      var list = activeTab.closest('[role="tablist"]');
      var tabs = $$('[role="tab"]', list);
      var i = tabs.indexOf(activeTab);
      i = e.key === "ArrowRight" ? (i + 1) % tabs.length : (i - 1 + tabs.length) % tabs.length;
      tabs[i].focus(); activateTab(tabs[i]);
      e.preventDefault();
    }

    // Segmented radiogroup 화살표
    var ae = document.activeElement;
    var segFocus = ae && ae.closest && ae.closest('.segmented[role="radiogroup"] button, .segmented[role="radiogroup"] .seg');
    if (segFocus && (e.key === "ArrowRight" || e.key === "ArrowLeft" || e.key === "ArrowUp" || e.key === "ArrowDown")) {
      var grp = segFocus.closest(".segmented");
      var opts = $$("button, .seg", grp);
      var cIdx = opts.indexOf(segFocus);
      var dir = (e.key === "ArrowRight" || e.key === "ArrowDown") ? 1 : -1;
      e.preventDefault();
      selectSegment(grp, opts[(cIdx + dir + opts.length) % opts.length], true);
    }

    // Rating 화살표 (입력용 별점, radiogroup 패턴)
    var starFocus = ae && ae.closest && ae.closest(".rating .star");
    if (starFocus) {
      var rw = starFocus.closest(".rating");
      if (rw && !rw.matches('[data-readonly="true"]')) {
        var curR = parseInt(rw.getAttribute("data-rating") || "0", 10) || 0;
        var maxR = $$(".star", rw).length;
        if (e.key === "ArrowRight" || e.key === "ArrowUp") { e.preventDefault(); setRating(rw, Math.min(maxR, curR + 1), true); }
        else if (e.key === "ArrowLeft" || e.key === "ArrowDown") { e.preventDefault(); setRating(rw, Math.max(1, curR - 1), true); }
        else if (e.key === "Home") { e.preventDefault(); setRating(rw, 1, true); }
        else if (e.key === "End") { e.preventDefault(); setRating(rw, maxR, true); }
      }
    }
  });

  // command 검색 입력
  document.addEventListener("input", function (e) {
    if (e.target.closest(".command-search")) {
      var c = e.target.closest(".command"); filterCommand(c, e.target.value);
    }
    // slider output
    if (e.target.matches('input[type="range"][data-output]')) {
      var out = document.getElementById(e.target.getAttribute("data-output"));
      if (out) out.textContent = (e.target.getAttribute("data-prefix") || "") + e.target.value + (e.target.getAttribute("data-suffix") || "");
    }
    // searchbar clear toggle
    if (e.target.closest(".searchbar")) {
      var clr = $(".searchbar-clear", e.target.closest(".searchbar"));
      if (clr) clr.style.visibility = e.target.value ? "visible" : "hidden";
    }
  });

  /* ----------------------------------------------------------------------
     TABS
     ---------------------------------------------------------------------- */
  function activateTab(tab) {
    var list = tab.closest('[role="tablist"]');
    if (!list) return;
    $$('[role="tab"]', list).forEach(function (t) { t.setAttribute("aria-selected", "false"); t.setAttribute("tabindex", "-1"); });
    tab.setAttribute("aria-selected", "true"); tab.setAttribute("tabindex", "0");
    var scope = list.closest(".tabs") || document;
    var controls = tab.getAttribute("aria-controls");
    $$('[role="tabpanel"]', scope).forEach(function (p) {
      if (list.contains(p) || !p.id) return;
    });
    // 패널 토글: 같은 tabs 컨테이너 내
    var panels = $$('[role="tabpanel"]', scope);
    panels.forEach(function (p) { p.hidden = (p.id !== controls); });
  }

  /* ----------------------------------------------------------------------
     SEGMENTED CONTROL — role 인지(aria-checked/aria-selected) + roving tabindex
     ---------------------------------------------------------------------- */
  function selectSegment(group, seg, focus) {
    var isRadio = group.getAttribute("role") === "radiogroup";
    $$("button, .seg", group).forEach(function (s) {
      s.classList.remove("is-active");
      if (isRadio) { s.setAttribute("aria-checked", "false"); s.setAttribute("tabindex", "-1"); }
      else if (s.hasAttribute("aria-selected")) { s.setAttribute("aria-selected", "false"); }
    });
    seg.classList.add("is-active");
    if (isRadio) { seg.setAttribute("aria-checked", "true"); seg.setAttribute("tabindex", "0"); if (focus) seg.focus(); }
    else { seg.setAttribute("aria-selected", "true"); }
    seg.dispatchEvent(new CustomEvent("mm:segment", {
      detail: { value: seg.getAttribute("data-value") || seg.textContent.trim() }, bubbles: true
    }));
  }

  /* ----------------------------------------------------------------------
     ACCORDION
     ---------------------------------------------------------------------- */
  function toggleAccordion(trigger) {
    var item = trigger.closest(".accordion-item");
    var panel = $(".accordion-panel", item);
    var open = trigger.getAttribute("aria-expanded") === "true";
    var acc = trigger.closest(".accordion");
    if (acc && acc.hasAttribute("data-single") && !open) {
      $$(".accordion-trigger[aria-expanded='true']", acc).forEach(function (tr) {
        tr.setAttribute("aria-expanded", "false");
        var p = $(".accordion-panel", tr.closest(".accordion-item")); if (p) p.setAttribute("data-open", "false");
      });
    }
    trigger.setAttribute("aria-expanded", String(!open));
    if (panel) panel.setAttribute("data-open", String(!open));
  }

  /* ----------------------------------------------------------------------
     RATING
     ---------------------------------------------------------------------- */
  function setRating(wrap, val, focus) {
    $$(".star", wrap).forEach(function (s) {
      var v = parseInt(s.getAttribute("data-value"), 10);
      s.classList.toggle("is-filled", v <= val);
      s.setAttribute("aria-checked", String(v === val));
      // roving tabindex — 선택된 별만 탭 가능
      s.setAttribute("tabindex", v === val ? "0" : "-1");
      if (v === val && focus) s.focus();
    });
    wrap.setAttribute("data-rating", val);
    var out = $(".rating-value", wrap);
    if (out) out.textContent = val.toFixed(1);
  }

  /* ----------------------------------------------------------------------
     COPY
     ---------------------------------------------------------------------- */
  function doCopy(btn) {
    var sel = btn.getAttribute("data-copy");
    var text = "";
    if (sel && sel !== "true") { var src = document.querySelector(sel); text = src ? (src.textContent || "") : sel; }
    else { var pre = btn.closest(".codeblock"); var code = pre ? $("pre", pre) : null; text = code ? code.textContent : ""; }
    var done = function () { MM.toast({ title: "복사됨", body: "클립보드에 복사했습니다.", icon: "success", duration: 1800 }); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text.trim()).then(done, fallback);
    else fallback();
    function fallback() {
      var ta = document.createElement("textarea"); ta.value = text.trim(); document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); done(); } catch (e) {} ta.remove();
    }
  }

  /* ----------------------------------------------------------------------
     TABLE — 정렬 + 전체선택
     ---------------------------------------------------------------------- */
  function sortTable(th) {
    var table = th.closest("table");
    var key = th.getAttribute("data-key");
    var idx = $$("thead th", table).indexOf(th);
    var cur = th.getAttribute("aria-sort");
    var dir = cur === "ascending" ? "descending" : "ascending";
    $$("thead th", table).forEach(function (h) { h.removeAttribute("aria-sort"); });
    th.setAttribute("aria-sort", dir);
    var tbody = $("tbody", table);
    var rows = $$("tr", tbody);
    var type = th.getAttribute("data-type") || "text";
    rows.sort(function (a, b) {
      var av = cellVal(a, idx, type), bv = cellVal(b, idx, type);
      if (av < bv) return dir === "ascending" ? -1 : 1;
      if (av > bv) return dir === "ascending" ? 1 : -1;
      return 0;
    });
    rows.forEach(function (r) { tbody.appendChild(r); });
  }
  function cellVal(row, idx, type) {
    var cell = row.children[idx]; if (!cell) return "";
    var raw = (cell.getAttribute("data-sort") || cell.textContent || "").trim();
    if (type === "number") return parseFloat(raw.replace(/[^0-9.\-]/g, "")) || 0;
    return raw.toLowerCase();
  }
  document.addEventListener("change", function (e) {
    // 전체선택 체크박스
    if (e.target.matches("[data-select-all]")) {
      var table = e.target.closest("table");
      $$("tbody [data-row-select]", table).forEach(function (cb) {
        cb.checked = e.target.checked;
        var tr = cb.closest("tr"); if (tr) tr.classList.toggle("is-selected", cb.checked);
      });
    }
    if (e.target.matches("[data-row-select]")) {
      var tr = e.target.closest("tr"); if (tr) tr.classList.toggle("is-selected", e.target.checked);
      var table2 = e.target.closest("table");
      var all = $$("tbody [data-row-select]", table2), checked = all.filter(function (c) { return c.checked; });
      var head = $("[data-select-all]", table2);
      if (head) { head.checked = checked.length === all.length; head.indeterminate = checked.length > 0 && checked.length < all.length; }
    }
  });

  /* ----------------------------------------------------------------------
     CAROUSEL
     ---------------------------------------------------------------------- */
  function carouselState(car) {
    return { track: $(".carousel-track", car), slides: $$(".carousel-slide", car), idx: parseInt(car.getAttribute("data-index") || "0", 10) };
  }
  function goCarousel(car, i) {
    var st = carouselState(car);
    var n = st.slides.length; if (!n) return;
    i = (i + n) % n;
    car.setAttribute("data-index", i);
    st.track.style.transform = "translateX(" + (-i * 100) + "%)";
    $$(".carousel-dot", car).forEach(function (d, di) { d.classList.toggle("is-active", di === i); });
  }
  function moveCarousel(car, dir) { var st = carouselState(car); goCarousel(car, st.idx + dir); }

  /* ----------------------------------------------------------------------
     WIZARD (Steps) — [data-wizard] 컨테이너, .wizard-step 패널
     ---------------------------------------------------------------------- */
  function moveWizard(dir) {
    var wiz = $("[data-wizard]"); if (!wiz) return;
    var cur = parseInt(wiz.getAttribute("data-step") || "0", 10);
    var panels = $$(".wizard-step", wiz);
    var next = Math.max(0, Math.min(panels.length - 1, cur + dir));
    wiz.setAttribute("data-step", next);
    panels.forEach(function (p, i) { p.hidden = i !== next; });
    var steps = $$(".step", wiz.closest("section, body, main") || document);
    steps.forEach(function (s, i) {
      s.classList.toggle("is-complete", i < next);
      s.classList.toggle("is-active", i === next);
    });
    if (wiz.parentNode) wiz.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth", block: "nearest" });
  }
  MM.moveWizard = moveWizard;

  /* ----------------------------------------------------------------------
     COMBOBOX / AUTOCOMPLETE — [data-combobox]
     ---------------------------------------------------------------------- */
  document.addEventListener("focusin", function (e) {
    var cbInput = e.target.closest("[data-combobox] .combobox-input");
    if (cbInput) { var list = $(".combobox-list", cbInput.closest("[data-combobox]")); if (list) list.style.display = "block"; }
  });
  document.addEventListener("input", function (e) {
    var cbInput = e.target.closest("[data-combobox] .combobox-input");
    if (!cbInput) return;
    var box = cbInput.closest("[data-combobox]");
    var q = cbInput.value.toLowerCase().trim();
    var any = false;
    $$(".combobox-option", box).forEach(function (opt) {
      var show = !q || (opt.textContent || "").toLowerCase().indexOf(q) > -1;
      opt.style.display = show ? "" : "none"; if (show) any = true;
    });
    var empty = $(".combobox-empty", box); if (empty) empty.style.display = any ? "none" : "";
  });
  document.addEventListener("click", function (e) {
    var opt = e.target.closest("[data-combobox] .combobox-option");
    if (opt) {
      var box = opt.closest("[data-combobox]");
      var input = $(".combobox-input", box);
      if (input) input.value = opt.getAttribute("data-value") || opt.textContent.trim();
      $$(".combobox-option", box).forEach(function (o) { o.classList.remove("is-checked"); o.setAttribute("aria-selected", "false"); });
      opt.classList.add("is-checked"); opt.setAttribute("aria-selected", "true");
      var list = $(".combobox-list", box); if (list) list.style.display = "none";
      return;
    }
    if (!e.target.closest("[data-combobox]")) {
      $$("[data-combobox] .combobox-list").forEach(function (l) { l.style.display = "none"; });
    }
  });

  /* ----------------------------------------------------------------------
     CHIP INPUT — [data-chipinput] : Enter 로 칩 추가
     ---------------------------------------------------------------------- */
  document.addEventListener("keydown", function (e) {
    var inp = e.target.closest("[data-chipinput] input");
    if (!inp) return;
    if (e.key === "Enter" && inp.value.trim()) {
      e.preventDefault();
      var wrap = inp.closest(".chipinput");
      var chip = document.createElement("span");
      chip.className = "chip";
      chip.innerHTML = '<span>' + inp.value.trim().replace(/</g, "&lt;") + '</span><button type="button" aria-label="제거"><svg class="icon icon-sm" viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6L6 18M6 6l12 12"/></svg></button>';
      wrap.insertBefore(chip, inp);
      inp.value = "";
    } else if (e.key === "Backspace" && !inp.value) {
      var prev = inp.previousElementSibling;
      if (prev && prev.classList.contains("chip")) prev.remove();
    }
  });

  /* ----------------------------------------------------------------------
     FILE UPLOAD — [data-fileupload] dropzone
     ---------------------------------------------------------------------- */
  $$("[data-fileupload]").forEach(function (zone) {
    var input = $('input[type="file"]', zone);
    var list = $(".fileupload-list", zone) || (function () { var l = document.createElement("div"); l.className = "fileupload-list"; zone.appendChild(l); return l; })();
    function render(files) {
      list.innerHTML = "";
      Array.prototype.forEach.call(files, function (f) {
        var row = document.createElement("div");
        row.className = "fileupload-item";
        row.innerHTML = '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg>' +
          '<span class="grow truncate">' + f.name + "</span>" +
          '<span class="text-subtle text-xs">' + (f.size > 1024 ? Math.round(f.size / 1024) + " KB" : f.size + " B") + "</span>";
        list.appendChild(row);
      });
    }
    if (input) input.addEventListener("change", function () { render(input.files); });
    ["dragover", "dragenter"].forEach(function (ev) { zone.addEventListener(ev, function (e) { e.preventDefault(); zone.classList.add("is-dragover"); }); });
    ["dragleave", "drop"].forEach(function (ev) { zone.addEventListener(ev, function (e) { e.preventDefault(); zone.classList.remove("is-dragover"); }); });
    zone.addEventListener("drop", function (e) { if (e.dataTransfer && e.dataTransfer.files.length) { if (input) input.files = e.dataTransfer.files; render(e.dataTransfer.files); } });
    zone.addEventListener("click", function (e) { if (!e.target.closest(".fileupload-item") && input) input.click(); });
  });

  /* ----------------------------------------------------------------------
     인박스/리스트 선택 데모 등 일반 토글 [data-toggle-active]
     ---------------------------------------------------------------------- */
  document.addEventListener("click", function (e) {
    var ta = e.target.closest("[data-toggle-active]");
    if (ta) {
      var group = ta.getAttribute("data-toggle-active");
      $$('[data-toggle-active="' + group + '"]').forEach(function (n) { n.classList.remove("is-active"); n.setAttribute("aria-current", "false"); });
      ta.classList.add("is-active"); ta.setAttribute("aria-current", "true");
    }
  });

  /* ----------------------------------------------------------------------
     SCROLL REVEAL — 공용 IntersectionObserver 1개. 효과는 CSS(.is-in)가 담당.
     reduced-motion 은 즉시 완성. JS 실패 시 html.js 미부여로 콘텐츠 항상 노출.
     ---------------------------------------------------------------------- */
  function setupReveal() {
    var targets = $$("[data-reveal], [data-reveal-group]");
    if (!targets.length) return;
    if (prefersReduced || !("IntersectionObserver" in window)) {
      targets.forEach(function (el) { el.classList.add("is-in"); });
      return;
    }
    // threshold 0 — 요소 상단이 뷰포트(하단 -12% 지점)에 들어오면 발화.
    // (threshold 비율을 쓰면 뷰포트보다 큰 긴 요소가 영원히 임계 미달 → 콘텐츠 잔존 버그)
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
      });
    }, { threshold: 0, rootMargin: "0px 0px -12% 0px" });
    targets.forEach(function (el) { io.observe(el); });
  }

  /* ----------------------------------------------------------------------
     초기화 — 슬라이더 초기값, 리빌, roving tabindex 등 가벼운 셋업
     ---------------------------------------------------------------------- */
  function init() {
    // 슬라이더 출력 초기값
    $$('input[type="range"][data-output]').forEach(function (s) {
      var out = document.getElementById(s.getAttribute("data-output"));
      if (out) out.textContent = (s.getAttribute("data-prefix") || "") + s.value + (s.getAttribute("data-suffix") || "");
    });
    // 캐러셀 초기 위치
    $$("[data-carousel]").forEach(function (c) { goCarousel(c, parseInt(c.getAttribute("data-index") || "0", 10)); });
    // searchbar clear 초기 가시성
    $$(".searchbar").forEach(function (sb) { var clr = $(".searchbar-clear", sb), inp = $("input", sb); if (clr && inp) clr.style.visibility = inp.value ? "visible" : "hidden"; });
    // 연도 자동
    $$("[data-year]").forEach(function (n) { n.textContent = new Date().getFullYear(); });
    // 스크롤 리빌
    setupReveal();
    // roving tabindex — segmented radiogroup: 활성 하나만 tabindex 0
    $$('.segmented[role="radiogroup"]').forEach(function (g) {
      var opts = $$("button, .seg", g);
      var active = opts.filter(function (o) { return o.getAttribute("aria-checked") === "true" || o.classList.contains("is-active"); })[0] || opts[0];
      opts.forEach(function (o) { o.setAttribute("tabindex", o === active ? "0" : "-1"); });
    });
    // roving tabindex — rating(입력용): 선택 별만 tabindex 0
    $$('.rating:not([data-readonly="true"])').forEach(function (r) {
      var val = parseInt(r.getAttribute("data-rating") || "0", 10) || 0;
      var stars = $$(".star", r);
      var matched = false;
      stars.forEach(function (s) {
        var v = parseInt(s.getAttribute("data-value"), 10);
        var on = v === val; if (on) matched = true;
        s.setAttribute("tabindex", on ? "0" : "-1");
      });
      if (!matched && stars[0]) stars[0].setAttribute("tabindex", "0");
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
