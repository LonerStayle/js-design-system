/* ============================================================================
   THEME 05 — SOFT NEUMORPHISM · app.js
   ----------------------------------------------------------------------------
   One vanilla-JS file driving every interaction across the hub + all pages.
   Everything is wired via data-attributes + event delegation, so markup stays
   declarative and the same script works on any page that links it.

   Public API (window.NM):
     NM.toast({title, text, variant, timeout})
     NM.openModal(id) / NM.closeModal(id)
     NM.openDrawer(id) / NM.closeDrawer(id)
     NM.theme.toggle() / NM.theme.set('light'|'dark')
   ========================================================================== */
(function () {
  "use strict";

  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ====================================================================== *
   * THEME — light / dark, persisted, respects system on first visit
   * ====================================================================== */
  const Theme = (() => {
    const KEY = "nm-theme";
    const root = document.documentElement;
    function apply(mode) {
      root.setAttribute("data-theme", mode);
      try { localStorage.setItem(KEY, mode); } catch (e) {}
      $$("[data-theme-toggle]").forEach((b) =>
        b.setAttribute("aria-label", mode === "dark" ? "라이트 모드로 전환" : "다크 모드로 전환")
      );
    }
    function get() {
      let saved;
      try { saved = localStorage.getItem(KEY); } catch (e) {}
      if (saved) return saved;
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    function toggle() { apply(root.getAttribute("data-theme") === "dark" ? "light" : "dark"); }
    return { set: apply, toggle, init: () => apply(get()) };
  })();
  Theme.init();

  /* ====================================================================== *
   * TOAST — stacked, auto-dismiss, accessible (role=status)
   * ====================================================================== */
  const ICONS = {
    info:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>',
    success: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
    warning: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m10.3 3.9-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.7-3l-8-14a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/></svg>',
    danger:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6M9 9l6 6"/></svg>',
  };
  const CLOSE_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>';

  function ensureToastRegion() {
    let r = $(".toast-region");
    if (!r) {
      r = document.createElement("div");
      r.className = "toast-region";
      r.setAttribute("aria-live", "polite");
      r.setAttribute("aria-atomic", "false");
      document.body.appendChild(r);
    }
    return r;
  }
  function toast(opts) {
    if (typeof opts === "string") opts = { title: opts };
    const { title = "알림", text = "", variant = "info", timeout = 4200 } = opts;
    const region = ensureToastRegion();
    const el = document.createElement("div");
    el.className = "toast " + (variant === "info" ? "" : variant);
    el.setAttribute("role", "status");
    el.innerHTML =
      `<span class="toast-icon">${ICONS[variant] || ICONS.info}</span>` +
      `<div class="toast-body"><div class="toast-title">${title}</div>${text ? `<div class="toast-text">${text}</div>` : ""}</div>` +
      `<button class="toast-close btn-icon btn-sm btn-ghost" aria-label="닫기">${CLOSE_ICON}</button>`;
    region.appendChild(el);
    const remove = () => {
      el.classList.add("is-leaving");
      setTimeout(() => el.remove(), prefersReduced ? 0 : 240);
    };
    el.querySelector(".toast-close").addEventListener("click", remove);
    if (timeout) setTimeout(remove, timeout);
    return el;
  }

  /* ====================================================================== *
   * OVERLAY HELPERS — focus trap + scroll lock + Esc, shared by modal/drawer
   * ====================================================================== */
  let lastFocused = null;
  const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

  function lockScroll(on) { document.body.style.overflow = on ? "hidden" : ""; }

  function trapFocus(container, e) {
    const f = $$(FOCUSABLE, container).filter((el) => el.offsetParent !== null);
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  function openOverlayPair(id, panelSel) {
    const wrap = document.getElementById(id);
    if (!wrap) return;
    const scrim = wrap.matches(".overlay") ? wrap : $(".overlay", wrap) || wrap.previousElementSibling;
    lastFocused = document.activeElement;
    wrap.classList.add("is-open");
    if (scrim && scrim.classList.contains("overlay")) scrim.classList.add("is-open");
    lockScroll(true);
    const panel = $(panelSel, wrap) || wrap;
    setTimeout(() => { const t = $(FOCUSABLE, panel); if (t) t.focus(); }, 60);
    wrap.setAttribute("aria-hidden", "false");
  }
  function closeOverlayPair(id) {
    const wrap = document.getElementById(id);
    if (!wrap) return;
    wrap.classList.remove("is-open");
    const scrim = $(".overlay", wrap) || (wrap.previousElementSibling && wrap.previousElementSibling.classList.contains("overlay") ? wrap.previousElementSibling : null);
    if (scrim) scrim.classList.remove("is-open");
    // only release scroll if nothing else open
    if (!$(".modal.is-open, .drawer.is-open, .cmdk.is-open")) lockScroll(false);
    wrap.setAttribute("aria-hidden", "true");
    if (lastFocused) lastFocused.focus();
  }

  function openModal(id)  { openOverlayPair(id, ".modal-dialog"); }
  function closeModal(id) { closeOverlayPair(id); }
  function openDrawer(id) { openOverlayPair(id, ".drawer"); }
  function closeDrawer(id){ closeOverlayPair(id); }

  /* ====================================================================== *
   * GLOBAL CLICK DELEGATION
   * ====================================================================== */
  document.addEventListener("click", (e) => {
    const t = e.target.closest("[data-theme-toggle],[data-modal-open],[data-modal-close],[data-drawer-open],[data-drawer-close],[data-toast],[data-menu-toggle],[data-popover-toggle],[data-tab],[data-accordion],[data-sidebar-toggle],[data-collapse-sidebar],[data-cmdk-open],[data-copy],[data-segment],[data-stepper],[data-rating],[data-pricing-toggle],[data-page]");

    /* theme */
    if (t && t.hasAttribute("data-theme-toggle")) { Theme.toggle(); return; }

    /* modal */
    if (t && t.hasAttribute("data-modal-open"))  { openModal(t.getAttribute("data-modal-open")); return; }
    if (t && t.hasAttribute("data-modal-close")) { const m = t.closest(".modal"); if (m) closeModal(m.id); return; }

    /* drawer */
    if (t && t.hasAttribute("data-drawer-open"))  { openDrawer(t.getAttribute("data-drawer-open")); return; }
    if (t && t.hasAttribute("data-drawer-close")) { const d = t.closest(".drawer"); if (d) closeDrawer(d.id); return; }

    /* toast demo trigger */
    if (t && t.hasAttribute("data-toast")) {
      const v = t.getAttribute("data-toast") || "info";
      const msg = {
        info:    { title: "정보", text: "동기화가 백그라운드에서 진행 중입니다.", variant: "info" },
        success: { title: "저장됨", text: "변경 사항이 안전하게 저장되었습니다.", variant: "success" },
        warning: { title: "주의", text: "저장 공간이 곧 가득 찹니다.", variant: "warning" },
        danger:  { title: "오류", text: "업로드에 실패했습니다. 다시 시도하세요.", variant: "danger" },
      }[v] || { title: "알림" };
      toast(msg); return;
    }

    /* command palette */
    if (t && t.hasAttribute("data-cmdk-open")) { CmdK.open(); return; }

    /* sidebar (mobile drawer) */
    if (t && t.hasAttribute("data-sidebar-toggle")) {
      const sb = $(".sidebar"); if (sb) sb.classList.toggle("is-open"); return;
    }
    /* sidebar collapse (desktop) */
    if (t && t.hasAttribute("data-collapse-sidebar")) {
      const shell = $(".app-shell"); if (shell) shell.classList.toggle("collapsed"); return;
    }

    /* menu / dropdown toggle */
    if (t && t.hasAttribute("data-menu-toggle")) {
      const menu = t.closest(".menu");
      const wasOpen = menu.classList.contains("is-open");
      closeAllFloaters();
      if (!wasOpen) { menu.classList.add("is-open"); t.setAttribute("aria-expanded", "true"); }
      return;
    }
    /* popover toggle */
    if (t && t.hasAttribute("data-popover-toggle")) {
      const pop = t.closest(".popover");
      const wasOpen = pop.classList.contains("is-open");
      closeAllFloaters();
      if (!wasOpen) { pop.classList.add("is-open"); t.setAttribute("aria-expanded", "true"); }
      return;
    }

    /* tabs */
    if (t && t.hasAttribute("data-tab")) { activateTab(t); return; }

    /* accordion */
    if (t && t.hasAttribute("data-accordion")) {
      const item = t.closest(".accordion-item");
      const group = t.closest(".accordion");
      const open = item.classList.contains("is-open");
      if (group && group.hasAttribute("data-accordion-single")) {
        $$(".accordion-item", group).forEach((i) => { i.classList.remove("is-open"); const tr = $(".accordion-trigger", i); if (tr) tr.setAttribute("aria-expanded", "false"); });
      }
      item.classList.toggle("is-open", !open);
      t.setAttribute("aria-expanded", String(!open));
      return;
    }

    /* segmented / button-group active swap */
    if (t && t.hasAttribute("data-segment")) {
      const wrap = t.parentElement;
      $$("[data-segment]", wrap).forEach((b) => { b.classList.remove("is-active"); b.setAttribute("aria-selected", "false"); b.setAttribute("aria-pressed", "false"); });
      t.classList.add("is-active"); t.setAttribute("aria-selected", "true"); t.setAttribute("aria-pressed", "true");
      const tgt = t.getAttribute("data-segment");
      if (tgt && tgt !== "true") document.dispatchEvent(new CustomEvent("nm:segment", { detail: { value: tgt, el: t } }));
      // a segmented control may ALSO double as the pricing period toggle
      if (t.hasAttribute("data-pricing-toggle")) applyPricing(t.getAttribute("data-pricing-toggle") === "yearly");
      return;
    }

    /* pricing month/year toggle (standalone, not on a segmented control) */
    if (t && t.hasAttribute("data-pricing-toggle")) { applyPricing(t.getAttribute("data-pricing-toggle") === "yearly"); return; }

    /* stepper -/+ */
    if (t && t.hasAttribute("data-stepper")) {
      const wrap = t.closest(".stepper");
      const input = $(".stepper-input", wrap);
      const step = Number(input.step || 1), min = input.min !== "" ? Number(input.min) : -Infinity, max = input.max !== "" ? Number(input.max) : Infinity;
      let v = Number(input.value || 0) + (t.getAttribute("data-stepper") === "up" ? step : -step);
      input.value = Math.max(min, Math.min(max, v));
      input.dispatchEvent(new Event("change", { bubbles: true }));
      return;
    }

    /* rating */
    if (t && t.hasAttribute("data-rating")) {
      const wrap = t.closest(".rating");
      const val = Number(t.getAttribute("data-rating"));
      $$("[data-rating]", wrap).forEach((b) => b.classList.toggle("is-on", Number(b.getAttribute("data-rating")) <= val));
      wrap.setAttribute("data-value", val);
      return;
    }

    /* copy to clipboard */
    if (t && t.hasAttribute("data-copy")) {
      const text = t.getAttribute("data-copy") || (t.closest(".codeblock") && $(".codeblock pre", t.closest(".codeblock")).innerText) || "";
      navigator.clipboard && navigator.clipboard.writeText(text).then(() => toast({ title: "복사됨", text: "클립보드에 복사했습니다.", variant: "success", timeout: 1800 }));
      return;
    }

    /* pagination (visual only) */
    if (t && t.hasAttribute("data-page")) {
      const wrap = t.closest(".pagination");
      if (wrap) $$(".page-btn[data-page]", wrap).forEach((b) => b.classList.toggle("is-active", b === t));
      return;
    }

    /* clicking a scrim closes its overlay */
    if (e.target.classList && e.target.classList.contains("overlay")) {
      const open = $(".modal.is-open, .drawer.is-open");
      if (open) closeOverlayPair(open.id);
      return;
    }

    /* outside click closes floaters */
    if (!e.target.closest(".menu, .popover")) closeAllFloaters();
  });

  function applyPricing(yearly) {
    $$("[data-price]").forEach((p) => {
      const v = p.getAttribute(yearly ? "data-price-year" : "data-price-month");
      if (v != null) p.textContent = v;
    });
    $$("[data-price-note]").forEach((n) => { n.textContent = yearly ? "연간 결제 · 2개월 무료" : "월간 결제"; });
  }

  function closeAllFloaters() {
    $$(".menu.is-open, .popover.is-open").forEach((m) => m.classList.remove("is-open"));
    $$("[data-menu-toggle],[data-popover-toggle]").forEach((b) => b.setAttribute("aria-expanded", "false"));
    const cm = $(".context-menu"); if (cm) cm.remove();
  }

  /* ====================================================================== *
   * TABS
   * ====================================================================== */
  function activateTab(tab) {
    const list = tab.closest(".tablist");
    const tabsRoot = tab.closest(".tabs") || document;
    const targetId = tab.getAttribute("data-tab");
    $$(".tab", list).forEach((b) => b.setAttribute("aria-selected", String(b === tab)));
    $$(".tabpanel", tabsRoot).forEach((p) => { p.hidden = p.id !== targetId; });
    tab.focus();
  }
  // arrow-key nav for tablists
  $$(".tablist").forEach((list) => {
    list.addEventListener("keydown", (e) => {
      if (!["ArrowRight", "ArrowLeft", "Home", "End"].includes(e.key)) return;
      const tabs = $$(".tab", list);
      let i = tabs.indexOf(document.activeElement);
      if (e.key === "ArrowRight") i = (i + 1) % tabs.length;
      else if (e.key === "ArrowLeft") i = (i - 1 + tabs.length) % tabs.length;
      else if (e.key === "Home") i = 0;
      else if (e.key === "End") i = tabs.length - 1;
      e.preventDefault(); activateTab(tabs[i]);
    });
  });

  /* ====================================================================== *
   * SLIDER live value
   * ====================================================================== */
  $$(".slider input[type=range]").forEach((r) => {
    const out = r.closest(".slider").querySelector(".slider-value");
    const sync = () => { if (out) out.textContent = (r.dataset.suffix ? r.value + r.dataset.suffix : r.value); };
    r.addEventListener("input", sync); sync();
  });

  /* ====================================================================== *
   * CHIP INPUT
   * ====================================================================== */
  $$(".chip-input").forEach((box) => {
    const input = $(".input", box);
    if (!input) return;
    const addChip = (label) => {
      label = label.trim(); if (!label) return;
      const chip = document.createElement("span");
      chip.className = "chip";
      chip.innerHTML = `${label}<button class="chip-x" aria-label="${label} 제거">${CLOSE_ICON}</button>`;
      chip.querySelector(".chip-x").addEventListener("click", () => chip.remove());
      box.insertBefore(chip, input);
    };
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addChip(input.value); input.value = ""; }
      else if (e.key === "Backspace" && !input.value) { const last = box.querySelector(".chip:last-of-type"); if (last) last.remove(); }
    });
  });

  /* ====================================================================== *
   * TABLE — sort + select-all + row select
   * ====================================================================== */
  $$(".table").forEach((table) => {
    // sortable
    $$(".th-sort", table).forEach((th, colIndex) => {
      th.setAttribute("tabindex", "0");
      th.setAttribute("role", "button");
      const handler = () => {
        const tbody = $("tbody", table);
        const idx = Array.from(th.closest("tr").children).indexOf(th.closest("th"));
        const asc = !th.classList.contains("asc");
        $$(".th-sort", table).forEach((o) => o.classList.remove("asc", "desc"));
        th.classList.add(asc ? "asc" : "desc");
        const rows = $$("tr", tbody);
        rows.sort((a, b) => {
          const av = (a.children[idx]?.dataset.sort ?? a.children[idx]?.innerText ?? "").trim();
          const bv = (b.children[idx]?.dataset.sort ?? b.children[idx]?.innerText ?? "").trim();
          const an = parseFloat(av.replace(/[^0-9.-]/g, "")), bn = parseFloat(bv.replace(/[^0-9.-]/g, ""));
          const cmp = (!isNaN(an) && !isNaN(bn)) ? an - bn : av.localeCompare(bv, "ko");
          return asc ? cmp : -cmp;
        });
        rows.forEach((r) => tbody.appendChild(r));
      };
      th.addEventListener("click", handler);
      th.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handler(); } });
    });
    // select-all
    const selectAll = $('thead input[type="checkbox"]', table);
    if (selectAll) {
      selectAll.addEventListener("change", () => {
        $$('tbody input[type="checkbox"]', table).forEach((cb) => {
          cb.checked = selectAll.checked;
          cb.closest("tr").classList.toggle("is-selected", cb.checked);
        });
      });
    }
    $$('tbody input[type="checkbox"]', table).forEach((cb) => {
      cb.addEventListener("change", () => cb.closest("tr").classList.toggle("is-selected", cb.checked));
    });
  });

  /* ====================================================================== *
   * CONTEXT MENU (right-click on [data-context-menu])
   * ====================================================================== */
  $$("[data-context-menu]").forEach((zone) => {
    zone.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      closeAllFloaters();
      const tmpl = document.getElementById(zone.getAttribute("data-context-menu"));
      if (!tmpl) return;
      const menu = document.createElement("div");
      menu.className = "context-menu";
      menu.innerHTML = tmpl.innerHTML;
      document.body.appendChild(menu);
      const x = Math.min(e.clientX, window.innerWidth - menu.offsetWidth - 12);
      const y = Math.min(e.clientY, window.innerHeight - menu.offsetHeight - 12);
      menu.style.left = x + "px"; menu.style.top = y + "px";
      $$(".menu-item", menu).forEach((mi) => mi.addEventListener("click", () => { menu.remove(); }));
    });
  });

  /* ====================================================================== *
   * CAROUSEL dots
   * ====================================================================== */
  $$(".carousel").forEach((car) => {
    const track = $(".carousel-track", car);
    const dots = $$(".carousel-dot", car);
    const slides = $$(".carousel-slide", track);
    if (!track) return;
    const go = (i) => slides[i] && slides[i].scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth", inline: "center", block: "nearest" });
    dots.forEach((d, i) => d.addEventListener("click", () => go(i)));
    $$(".carousel-arrow.prev", car).forEach((b) => b.addEventListener("click", () => track.scrollBy({ left: -track.clientWidth * 0.8, behavior: "smooth" })));
    $$(".carousel-arrow.next", car).forEach((b) => b.addEventListener("click", () => track.scrollBy({ left: track.clientWidth * 0.8, behavior: "smooth" })));
    track.addEventListener("scroll", () => {
      let idx = 0, min = Infinity;
      slides.forEach((s, i) => { const d = Math.abs(s.offsetLeft - track.scrollLeft); if (d < min) { min = d; idx = i; } });
      dots.forEach((d, i) => d.classList.toggle("is-active", i === idx));
    }, { passive: true });
  });

  /* ====================================================================== *
   * COMMAND PALETTE (⌘K / Ctrl-K)
   * ====================================================================== */
  const CmdK = (() => {
    let root, input, list, items = [], active = 0;
    function build() {
      root = $(".cmdk"); if (!root) return false;
      input = $(".cmdk-search input", root);
      list = $(".cmdk-list", root);
      items = $$(".cmdk-item", root);
      return true;
    }
    function open() {
      if (!root && !build()) return;
      lastFocused = document.activeElement;
      root.classList.add("is-open"); lockScroll(true);
      input.value = ""; filter("");
      setTimeout(() => input.focus(), 60);
    }
    function close() {
      if (!root) return;
      root.classList.remove("is-open");
      if (!$(".modal.is-open, .drawer.is-open")) lockScroll(false);
      if (lastFocused) lastFocused.focus();
    }
    function filter(q) {
      q = q.toLowerCase();
      let visible = [];
      items.forEach((it) => {
        const match = it.innerText.toLowerCase().includes(q);
        it.style.display = match ? "" : "none";
        if (match) visible.push(it);
      });
      $$(".cmdk-group-label", root).forEach((g) => {
        let n = g.nextElementSibling, any = false;
        while (n && !n.classList.contains("cmdk-group-label")) { if (n.classList.contains("cmdk-item") && n.style.display !== "none") any = true; n = n.nextElementSibling; }
        g.style.display = any ? "" : "none";
      });
      let empty = $(".cmdk-empty", root);
      if (empty) empty.style.display = visible.length ? "none" : "";
      active = 0; highlight(visible);
    }
    function highlight(visible) {
      visible = visible || items.filter((i) => i.style.display !== "none");
      items.forEach((i) => i.classList.remove("is-active"));
      if (visible[active]) { visible[active].classList.add("is-active"); visible[active].scrollIntoView({ block: "nearest" }); }
      return visible;
    }
    function init() {
      if (!build()) return;
      input.addEventListener("input", () => filter(input.value));
      root.addEventListener("keydown", (e) => {
        const visible = items.filter((i) => i.style.display !== "none");
        if (e.key === "ArrowDown") { e.preventDefault(); active = Math.min(active + 1, visible.length - 1); highlight(visible); }
        else if (e.key === "ArrowUp") { e.preventDefault(); active = Math.max(active - 1, 0); highlight(visible); }
        else if (e.key === "Enter") { e.preventDefault(); const cur = visible[active]; if (cur) { cur.click(); } }
      });
      items.forEach((it) => it.addEventListener("click", () => {
        const label = $(".ci-label", it)?.textContent || it.textContent.trim();
        close();
        const href = it.getAttribute("data-href");
        if (href) { window.location.href = href; return; }
        toast({ title: "실행", text: label, variant: "info", timeout: 1600 });
      }));
      $$("[data-cmdk-close]", root).forEach((b) => b.addEventListener("click", close));
      root.addEventListener("click", (e) => { if (e.target === root) close(); });
    }
    return { open, close, init };
  })();
  CmdK.init();

  /* ====================================================================== *
   * GLOBAL KEYBOARD
   * ====================================================================== */
  document.addEventListener("keydown", (e) => {
    // ⌘K / Ctrl-K
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); CmdK.open(); return; }
    if (e.key === "Escape") {
      const m = $(".modal.is-open"); if (m) { closeModal(m.id); return; }
      const d = $(".drawer.is-open"); if (d) { closeDrawer(d.id); return; }
      if ($(".cmdk.is-open")) { CmdK.close(); return; }
      closeAllFloaters();
      const sb = $(".sidebar.is-open"); if (sb) sb.classList.remove("is-open");
    }
  });
  // focus trap for open modal/drawer
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Tab") return;
    const open = $(".modal.is-open .modal-dialog, .drawer.is-open");
    if (open) trapFocus(open, e);
  });

  /* ====================================================================== *
   * SIMPLE SCROLL-REVEAL (adds .is-in when element enters viewport)
   * ====================================================================== */
  if (!prefersReduced && "IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); } });
    }, { threshold: 0.12 });
    $$("[data-reveal]").forEach((el) => io.observe(el));
  } else {
    $$("[data-reveal]").forEach((el) => el.classList.add("is-in"));
  }

  /* ====================================================================== *
   * EXPOSE PUBLIC API
   * ====================================================================== */
  window.NM = {
    toast,
    openModal, closeModal, openDrawer, closeDrawer,
    theme: Theme,
    cmdk: CmdK,
  };
})();
