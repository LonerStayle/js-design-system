/* =============================================================================
   theme-16 · Pastel Kawaii — app.js
   모든 인터랙션 (바닐라 JS, 의존성 0):
   theme toggle · modal · drawer · toast · tabs · accordion · dropdown
   context menu · command palette(⌘K) · rating · slider · stepper · chip input
   segmented · carousel · table sort/select · dropzone · combobox · copy
   + sparkle burst & bounce (prefers-reduced-motion 존중)
   ============================================================================= */
(function () {
  "use strict";

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const on = (el, ev, fn, opts) => el && el.addEventListener(ev, fn, opts);

  /* ---------------------------------------------------------------------------
     THEME (light / dark) — localStorage 지속
     --------------------------------------------------------------------------- */
  const THEME_KEY = "kawaii-theme";
  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    try { localStorage.setItem(THEME_KEY, theme); } catch (e) {}
    $$("[data-theme-toggle]").forEach((b) => {
      b.setAttribute("aria-pressed", theme === "dark");
      const lbl = b.querySelector("[data-theme-label]");
      if (lbl) lbl.textContent = theme === "dark" ? "라이트" : "다크";
    });
  }
  function initTheme() {
    let saved;
    try { saved = localStorage.getItem(THEME_KEY); } catch (e) {}
    const sys = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    applyTheme(saved || sys);
    on(document, "click", (e) => {
      const t = e.target.closest("[data-theme-toggle]");
      if (!t) return;
      const cur = document.documentElement.getAttribute("data-theme");
      applyTheme(cur === "dark" ? "light" : "dark");
      burst(t);
    });
  }

  /* ---------------------------------------------------------------------------
     SPARKLE BURST — 클릭 시 반짝이 튀는 시그니처 (reduced-motion 정지)
     --------------------------------------------------------------------------- */
  // 시그니처: 클릭 시 하트·별·반짝이 모티프가 터진다 (단색 사각형 → 카와이 모티프)
  const BURST_MOTIFS = ["var(--motif-heart)", "var(--motif-star)", "var(--motif-sparkle)"];
  function burst(el, count) {
    if (prefersReduced || !el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const n = count || 8;
    for (let i = 0; i < n; i++) {
      const s = document.createElement("span");
      const ang = (Math.PI * 2 * i) / n + Math.random() * 0.6;
      const dist = 30 + Math.random() * 42;
      const size = 12 + Math.random() * 12;
      const motif = BURST_MOTIFS[i % BURST_MOTIFS.length];
      s.style.cssText = `position:fixed;left:${cx}px;top:${cy}px;width:${size}px;height:${size}px;
        background:${motif} center/contain no-repeat;
        pointer-events:none;z-index:9999;opacity:1;transform:translate(-50%,-50%) rotate(0deg) scale(0.6);
        transition:transform .68s cubic-bezier(.16,1,.3,1),opacity .68s ease-out;`;
      document.body.appendChild(s);
      requestAnimationFrame(() => {
        s.style.transform = `translate(${Math.cos(ang) * dist - size / 2}px,${Math.sin(ang) * dist - size / 2}px) rotate(${(Math.random() - 0.5) * 300}deg) scale(0.3)`;
        s.style.opacity = "0";
      });
      setTimeout(() => s.remove(), 720);
    }
  }

  /* ---------------------------------------------------------------------------
     CURSOR TRAIL — 커서 뒤로 별가루 (--z-cursor 회수, reduced-motion 정지)
     --------------------------------------------------------------------------- */
  function initCursorTrail() {
    if (prefersReduced) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    let last = 0;
    on(document, "pointermove", (e) => {
      if (e.pointerType && e.pointerType !== "mouse") return;
      const now = e.timeStamp || performance.now();
      if (now - last < 85) return;
      last = now;
      const s = document.createElement("span");
      s.className = "cursor-spark";
      s.style.left = e.clientX + "px";
      s.style.top = e.clientY + "px";
      s.style.transform = `scale(${0.7 + Math.random() * 0.5}) rotate(${Math.random() * 60 - 30}deg)`;
      document.body.appendChild(s);
      setTimeout(() => s.remove(), 700);
    });
  }
  // 글로벌 반짝이 트리거
  on(document, "click", (e) => {
    const t = e.target.closest("[data-sparkle]");
    if (t) burst(t, parseInt(t.getAttribute("data-sparkle")) || 10);
  });

  /* ---------------------------------------------------------------------------
     TOAST (stack)
     --------------------------------------------------------------------------- */
  function ensureToastRegion() {
    let r = $(".toast-region");
    if (!r) { r = document.createElement("div"); r.className = "toast-region"; r.setAttribute("aria-live", "polite"); document.body.appendChild(r); }
    return r;
  }
  const TOAST_ICONS = {
    success: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>',
    error:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>',
    warning: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M12 9v4M12 17h.01"/></svg>',
    info:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M12 16v-4M12 8h.01"/></svg>',
  };
  function toast(opts) {
    opts = opts || {};
    const type = opts.type || "success";
    const region = ensureToastRegion();
    const el = document.createElement("div");
    el.className = "toast " + type;
    el.setAttribute("role", "status");
    el.innerHTML =
      `<span class="toast-ic">${TOAST_ICONS[type] || TOAST_ICONS.info}</span>
       <div class="grow"><div class="toast-title">${opts.title || "알림"}</div>` +
      (opts.msg ? `<div class="toast-msg">${opts.msg}</div>` : "") +
      `</div><button class="toast-close" aria-label="닫기">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
      </button><span class="toast-bar"></span>`;
    region.appendChild(el);
    const close = () => {
      el.classList.add("is-leaving");
      setTimeout(() => el.remove(), 260);
    };
    on(el.querySelector(".toast-close"), "click", close);
    const dur = opts.duration || 4000;
    if (dur > 0) setTimeout(close, dur);
    return el;
  }
  // 선언적 트리거
  on(document, "click", (e) => {
    const t = e.target.closest("[data-toast]");
    if (!t) return;
    toast({
      type: t.getAttribute("data-toast") || "success",
      title: t.getAttribute("data-toast-title") || "완료했어요!",
      msg: t.getAttribute("data-toast-msg") || "",
    });
  });

  /* ---------------------------------------------------------------------------
     MODAL / DRAWER (공용 overlay 로직)
     --------------------------------------------------------------------------- */
  let lastFocused = null;
  const FOCUSABLE = 'a[href],button:not([disabled]),textarea:not([disabled]),input:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])';
  const trapHandlers = new WeakMap();   // 요소별 핸들러 (전역 단일 핸들러 누적 방지)
  function trapFocus(el) {
    const handler = (e) => {
      if (e.key !== "Tab") return;
      const f = $$(FOCUSABLE, el).filter((n) => n.offsetParent !== null || n === document.activeElement);
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    el.addEventListener("keydown", handler);
    trapHandlers.set(el, handler);
  }
  function releaseFocus(el) {
    const h = trapHandlers.get(el);
    if (h) { el.removeEventListener("keydown", h); trapHandlers.delete(el); }
  }
  function openOverlay(el) {
    if (!el) return;
    lastFocused = document.activeElement;
    el.classList.add("is-open");
    toggleBackdrop(true, el);
    const focusable = el.querySelector(FOCUSABLE);
    if (focusable) setTimeout(() => focusable.focus(), 60);
    trapFocus(el);
    document.body.style.overflow = "hidden";
  }
  function closeOverlay(el) {
    if (!el) return;
    el.classList.remove("is-open");
    releaseFocus(el);
    if (!$(".modal.is-open, .drawer.is-open, .cmdk.is-open")) {
      toggleBackdrop(false);
      document.body.style.overflow = "";
    }
    if (lastFocused) lastFocused.focus();
  }
  function toggleBackdrop(show, owner) {
    let bd = $(".backdrop");
    if (!bd) { bd = document.createElement("div"); bd.className = "backdrop"; document.body.appendChild(bd); on(bd, "click", () => { $$(".modal.is-open,.drawer.is-open,.cmdk.is-open").forEach(closeOverlay); }); }
    bd.classList.toggle("is-open", show);
  }
  on(document, "click", (e) => {
    const mo = e.target.closest("[data-modal-open]");
    if (mo) { openOverlay($("#" + mo.getAttribute("data-modal-open"))); burst(mo); }
    const dro = e.target.closest("[data-drawer-open]");
    if (dro) { openOverlay($("#" + dro.getAttribute("data-drawer-open"))); }
    if (e.target.closest("[data-modal-close],[data-drawer-close]")) {
      const ov = e.target.closest(".modal,.drawer"); closeOverlay(ov);
    }
    // 모달 박스 바깥 클릭 닫기
    if (e.target.classList.contains("modal")) closeOverlay(e.target);
  });
  on(document, "keydown", (e) => {
    if (e.key === "Escape") $$(".modal.is-open,.drawer.is-open,.cmdk.is-open,.popover.is-open,.dropdown.is-open").forEach((el) => {
      el.classList.contains("dropdown") || el.classList.contains("popover") ? el.classList.remove("is-open") : closeOverlay(el);
    });
  });

  /* ---------------------------------------------------------------------------
     DISMISS — 알림 배너/알럿 닫기 (④-8: alert-close 핸들러 부재 해소)
     --------------------------------------------------------------------------- */
  on(document, "click", (e) => {
    const t = e.target.closest("[data-dismiss], .alert-close, .banner-close");
    if (!t) return;
    const box = t.closest("[data-dismissable], .alert, .banner");
    if (!box) return;
    box.style.transition = "opacity var(--duration-fast) var(--ease-soft), transform var(--duration-fast) var(--ease-soft)";
    box.style.opacity = "0";
    box.style.transform = "translateY(-6px)";
    setTimeout(() => box.remove(), 180);
  });

  /* ---------------------------------------------------------------------------
     COMMAND PALETTE (⌘K / Ctrl+K)
     --------------------------------------------------------------------------- */
  function initCmdK() {
    const cmdk = $(".cmdk");
    if (!cmdk) return;
    const input = $(".cmdk-input-row input", cmdk);
    const items = () => $$(".cmdk-item", cmdk);
    function open() { openOverlay(cmdk); if (input) { input.value = ""; filter(""); setTimeout(() => input.focus(), 60); } setActive(0); }
    function filter(q) {
      q = q.toLowerCase();
      let visible = 0;
      items().forEach((it) => {
        const match = it.textContent.toLowerCase().includes(q);
        it.style.display = match ? "" : "none";
        if (match) visible++;
      });
      $$(".cmdk-group-label", cmdk).forEach((g) => {
        let n = g.nextElementSibling, any = false;
        while (n && n.classList.contains("cmdk-item")) { if (n.style.display !== "none") any = true; n = n.nextElementSibling; }
        g.style.display = any ? "" : "none";
      });
      const empty = $(".cmdk-empty", cmdk);
      if (empty) empty.style.display = visible ? "none" : "";
      setActive(0);
    }
    function visibleItems() { return items().filter((i) => i.style.display !== "none"); }
    function setActive(idx) {
      const vis = visibleItems();
      vis.forEach((i) => i.classList.remove("is-active"));
      if (vis[idx]) { vis[idx].classList.add("is-active"); vis[idx].scrollIntoView({ block: "nearest" }); }
    }
    on(document, "keydown", (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); cmdk.classList.contains("is-open") ? closeOverlay(cmdk) : open(); }
    });
    $$("[data-cmdk-open]").forEach((b) => on(b, "click", open));
    if (input) on(input, "input", () => filter(input.value));
    on(cmdk, "keydown", (e) => {
      const vis = visibleItems();
      let cur = vis.findIndex((i) => i.classList.contains("is-active"));
      if (e.key === "ArrowDown") { e.preventDefault(); setActive(Math.min(cur + 1, vis.length - 1)); }
      else if (e.key === "ArrowUp") { e.preventDefault(); setActive(Math.max(cur - 1, 0)); }
      else if (e.key === "Enter" && vis[cur]) { e.preventDefault(); vis[cur].click(); }
    });
    items().forEach((it) => on(it, "click", () => {
      const label = it.querySelector(".cmdk-label")?.textContent || it.textContent.trim();
      closeOverlay(cmdk);
      toast({ type: "info", title: "실행", msg: label });
    }));
    on(cmdk, "click", (e) => { if (e.target === cmdk) closeOverlay(cmdk); });
  }

  /* ---------------------------------------------------------------------------
     TABS
     --------------------------------------------------------------------------- */
  function initTabs() {
    $$("[data-tabs]").forEach((root) => {
      const tabs = $$('[role="tab"]', root);
      const panels = $$('[role="tabpanel"]', root);
      function select(i) {
        tabs.forEach((t, j) => { t.setAttribute("aria-selected", j === i); t.tabIndex = j === i ? 0 : -1; });
        panels.forEach((p, j) => { p.hidden = j !== i; });
      }
      tabs.forEach((t, i) => {
        on(t, "click", () => select(i));
        on(t, "keydown", (e) => {
          let ni = null;
          if (e.key === "ArrowRight") ni = (i + 1) % tabs.length;
          if (e.key === "ArrowLeft") ni = (i - 1 + tabs.length) % tabs.length;
          if (e.key === "Home") ni = 0;
          if (e.key === "End") ni = tabs.length - 1;
          if (ni !== null) { e.preventDefault(); select(ni); tabs[ni].focus(); }
        });
      });
      const init = tabs.findIndex((t) => t.getAttribute("aria-selected") === "true");
      select(init >= 0 ? init : 0);
    });
  }

  /* ---------------------------------------------------------------------------
     ACCORDION
     --------------------------------------------------------------------------- */
  function initAccordion() {
    $$(".accordion").forEach((acc) => {
      const single = acc.hasAttribute("data-single");
      $$(".acc-item", acc).forEach((item) => {
        const trig = $(".acc-trigger", item);
        const panel = $(".acc-panel", item);
        const setOpen = (open) => {
          item.classList.toggle("is-open", open);
          trig.setAttribute("aria-expanded", open);
          panel.style.maxHeight = open ? panel.scrollHeight + "px" : "0px";
        };
        if (item.classList.contains("is-open")) setOpen(true);
        on(trig, "click", () => {
          const willOpen = !item.classList.contains("is-open");
          if (single) $$(".acc-item", acc).forEach((o) => { if (o !== item) { o.classList.remove("is-open"); $(".acc-trigger", o).setAttribute("aria-expanded", false); $(".acc-panel", o).style.maxHeight = "0px"; } });
          setOpen(willOpen);
        });
      });
    });
    window.addEventListener("resize", () => $$(".acc-item.is-open .acc-panel").forEach((p) => { p.style.maxHeight = p.scrollHeight + "px"; }));
  }

  /* ---------------------------------------------------------------------------
     DROPDOWN / MENU
     --------------------------------------------------------------------------- */
  function initDropdown() {
    on(document, "click", (e) => {
      const trig = e.target.closest("[data-dropdown-trigger]");
      const inMenu = e.target.closest(".menu");
      $$(".dropdown.is-open").forEach((d) => { if (!d.contains(e.target) || (!inMenu && !trig)) d.classList.remove("is-open"); });
      if (trig) {
        const dd = trig.closest(".dropdown");
        if (dd) { const willOpen = !dd.classList.contains("is-open"); $$(".dropdown.is-open").forEach((o) => o.classList.remove("is-open")); dd.classList.toggle("is-open", willOpen); }
      }
      const mi = e.target.closest(".menu-item");
      if (mi && !mi.hasAttribute("data-keep")) { const dd = mi.closest(".dropdown"); if (dd) dd.classList.remove("is-open"); }
    });
  }

  /* ---------------------------------------------------------------------------
     CONTEXT MENU
     --------------------------------------------------------------------------- */
  function initContextMenu() {
    const cm = $(".context-menu");
    if (!cm) return;
    $$("[data-context]").forEach((zone) => {
      on(zone, "contextmenu", (e) => {
        e.preventDefault();
        cm.classList.add("is-open");
        const w = cm.offsetWidth, h = cm.offsetHeight;
        cm.style.left = Math.min(e.clientX, window.innerWidth - w - 8) + "px";
        cm.style.top = Math.min(e.clientY, window.innerHeight - h - 8) + "px";
      });
    });
    on(document, "click", () => cm.classList.remove("is-open"));
    on(document, "scroll", () => cm.classList.remove("is-open"), true);
  }

  /* ---------------------------------------------------------------------------
     POPOVER
     --------------------------------------------------------------------------- */
  function initPopover() {
    on(document, "click", (e) => {
      const trig = e.target.closest("[data-popover-trigger]");
      if (trig) {
        const pop = $("#" + trig.getAttribute("data-popover-trigger"));
        if (pop) { const open = !pop.classList.contains("is-open"); $$(".popover.is-open").forEach((p) => p.classList.remove("is-open")); pop.classList.toggle("is-open", open); }
        return;
      }
      if (!e.target.closest(".popover")) $$(".popover.is-open").forEach((p) => p.classList.remove("is-open"));
    });
  }

  /* ---------------------------------------------------------------------------
     TOGGLE / SWITCH (선언적 토스트 옵션)
     --------------------------------------------------------------------------- */
  function initToggles() {
    $$('.toggle input[type="checkbox"]').forEach((t) => {
      on(t, "change", () => { if (t.checked && !prefersReduced) burst(t.closest(".toggle")); });
    });
  }

  /* ---------------------------------------------------------------------------
     SEGMENTED CONTROL
     --------------------------------------------------------------------------- */
  function initSegmented() {
    $$(".segmented").forEach((seg) => {
      const btns = $$("button", seg);
      if (!btns.length) return;
      // 역할 기반 상태 속성 선택: radio→aria-checked, tab→aria-selected, 그 외→aria-pressed
      const attr = btns.some((b) => b.getAttribute("role") === "radio") ? "aria-checked"
                 : btns.some((b) => b.getAttribute("role") === "tab") ? "aria-selected"
                 : "aria-pressed";
      const select = (b) => {
        btns.forEach((x) => { x.setAttribute(attr, x === b ? "true" : "false"); x.tabIndex = x === b ? 0 : -1; });
        seg.dispatchEvent(new CustomEvent("segmented:change", { detail: { value: b.dataset.value, index: btns.indexOf(b) } }));
      };
      btns.forEach((b, i) => {
        on(b, "click", () => select(b));
        on(b, "keydown", (e) => {
          let ni = null;
          if (e.key === "ArrowRight" || e.key === "ArrowDown") ni = (i + 1) % btns.length;
          else if (e.key === "ArrowLeft" || e.key === "ArrowUp") ni = (i - 1 + btns.length) % btns.length;
          else if (e.key === "Home") ni = 0;
          else if (e.key === "End") ni = btns.length - 1;
          if (ni !== null) { e.preventDefault(); select(btns[ni]); btns[ni].focus(); }
        });
      });
      // roving tabindex 초기화
      const cur = btns.find((b) => b.getAttribute(attr) === "true") || btns[0];
      btns.forEach((b) => (b.tabIndex = b === cur ? 0 : -1));
    });
  }

  /* ---------------------------------------------------------------------------
     SLIDER (fill + output)
     --------------------------------------------------------------------------- */
  function initSliders() {
    $$('.slider input[type="range"]').forEach((r) => {
      const out = r.closest(".slider")?.querySelector("output");
      const upd = () => {
        const pct = ((r.value - r.min) / (r.max - r.min)) * 100;
        r.style.setProperty("--_val", pct + "%");
        if (out) out.textContent = r.value;
      };
      upd(); on(r, "input", upd);
    });
  }

  /* ---------------------------------------------------------------------------
     STEPPER
     --------------------------------------------------------------------------- */
  function initSteppers() {
    $$(".stepper").forEach((st) => {
      const input = $("input", st);
      const dec = $("[data-dec]", st), inc = $("[data-inc]", st);
      const clamp = (v) => Math.max(parseInt(input.min || -Infinity), Math.min(parseInt(input.max || Infinity), v));
      on(dec, "click", () => { input.value = clamp((parseInt(input.value) || 0) - 1); });
      on(inc, "click", () => { input.value = clamp((parseInt(input.value) || 0) + 1); burst(inc, 5); });
    });
  }

  /* ---------------------------------------------------------------------------
     RATING (star)
     --------------------------------------------------------------------------- */
  function initRatings() {
    $$(".rating").forEach((rt) => {
      if (rt.hasAttribute("data-readonly")) return;
      const btns = $$("button", rt);
      if (!btns.length) return;
      const isRadio = btns[0].getAttribute("role") === "radio";
      const paint = (n) => btns.forEach((b, i) => b.classList.toggle("is-on", i < n));
      let val = parseInt(rt.getAttribute("data-value")) || btns.filter((b) => b.classList.contains("is-on")).length || 1;
      const commit = (n, focus) => {
        val = Math.max(1, Math.min(btns.length, n));
        paint(val);
        rt.setAttribute("data-value", val);
        btns.forEach((b, i) => {
          if (isRadio) b.setAttribute("aria-checked", i === val - 1 ? "true" : "false");
          b.tabIndex = i === val - 1 ? 0 : -1;
        });
        if (focus && btns[val - 1]) btns[val - 1].focus();
      };
      btns.forEach((b, i) => {
        on(b, "mouseenter", () => paint(i + 1));
        on(b, "click", () => { commit(i + 1); burst(b, 6); });
        on(b, "keydown", (e) => {
          if (e.key === "ArrowRight" || e.key === "ArrowUp") { e.preventDefault(); commit(val + 1, true); burst(btns[Math.min(val, btns.length) - 1], 5); }
          else if (e.key === "ArrowLeft" || e.key === "ArrowDown") { e.preventDefault(); commit(val - 1, true); }
          else if (e.key === "Home") { e.preventDefault(); commit(1, true); }
          else if (e.key === "End") { e.preventDefault(); commit(btns.length, true); }
        });
      });
      on(rt, "mouseleave", () => paint(val));
      commit(val, false);
    });
  }

  /* ---------------------------------------------------------------------------
     CHIP INPUT
     --------------------------------------------------------------------------- */
  function initChipInputs() {
    $$(".chip-input").forEach((ci) => {
      const input = $("input", ci);
      const addChip = (text) => {
        text = text.trim(); if (!text) return;
        const chip = document.createElement("span");
        chip.className = "chip";
        chip.innerHTML = `${text}<button aria-label="삭제"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg></button>`;
        ci.insertBefore(chip, input);
        on(chip.querySelector("button"), "click", () => chip.remove());
      };
      on(input, "keydown", (e) => {
        if ((e.key === "Enter" || e.key === ",") && input.value.trim()) { e.preventDefault(); addChip(input.value); input.value = ""; }
        else if (e.key === "Backspace" && !input.value) { const chips = $$(".chip", ci); if (chips.length) chips[chips.length - 1].remove(); }
      });
      $$(".chip button", ci).forEach((b) => on(b, "click", () => b.closest(".chip").remove()));
    });
  }

  /* ---------------------------------------------------------------------------
     COMBOBOX (autocomplete)
     --------------------------------------------------------------------------- */
  function initCombobox() {
    $$(".combobox").forEach((cb) => {
      const input = $("input", cb);
      const list = $(".combobox-list", cb);
      if (!input || !list) return;
      const opts = $$(".combobox-opt", list);
      const showList = (s) => { list.style.display = s ? "block" : "none"; };
      showList(false);
      on(input, "focus", () => showList(true));
      on(input, "input", () => {
        const q = input.value.toLowerCase();
        let any = false;
        opts.forEach((o) => { const m = o.textContent.toLowerCase().includes(q); o.style.display = m ? "" : "none"; if (m) any = true; });
        showList(true);
      });
      opts.forEach((o) => on(o, "click", () => { input.value = o.textContent.trim(); opts.forEach((x) => x.setAttribute("aria-selected", "false")); o.setAttribute("aria-selected", "true"); showList(false); }));
      on(document, "click", (e) => { if (!cb.contains(e.target)) showList(false); });
    });
  }

  /* ---------------------------------------------------------------------------
     CAROUSEL
     --------------------------------------------------------------------------- */
  function initCarousels() {
    $$(".carousel").forEach((c) => {
      const track = $(".carousel-track", c);
      const prev = $(".carousel-nav.prev", c), next = $(".carousel-nav.next", c);
      const step = () => (track.querySelector(".carousel-slide")?.offsetWidth || 280) + 16;
      on(prev, "click", () => track.scrollBy({ left: -step(), behavior: "smooth" }));
      on(next, "click", () => track.scrollBy({ left: step(), behavior: "smooth" }));
      const dots = $$(".carousel-dots button", c);
      dots.forEach((d, i) => on(d, "click", () => { track.scrollTo({ left: step() * i, behavior: "smooth" }); }));
      if (dots.length) on(track, "scroll", () => { const idx = Math.round(track.scrollLeft / step()); dots.forEach((d, i) => d.classList.toggle("is-active", i === idx)); });
    });
  }

  /* ---------------------------------------------------------------------------
     TABLE (sort + select-all + row select)
     --------------------------------------------------------------------------- */
  function initTables() {
    $$("table.table").forEach((tbl) => {
      // sortable — 트리거는 th 내부 <button class="th-sort"> (키보드 Enter/Space 네이티브)
      $$("th.sortable", tbl).forEach((th) => {
        const trigger = th.querySelector(".th-sort") || th;
        const sortNow = () => {
          const tbody = $("tbody", tbl);
          const rows = $$("tr", tbody);
          const idx = Array.from(th.parentNode.children).indexOf(th);
          const asc = th.getAttribute("aria-sort") !== "ascending";
          $$("th.sortable", tbl).forEach((o) => o.setAttribute("aria-sort", "none"));
          th.setAttribute("aria-sort", asc ? "ascending" : "descending");
          const num = (s) => parseFloat(String(s).replace(/[^0-9.\-]/g, ""));
          rows.sort((a, b) => {
            let av = a.children[idx]?.textContent.trim() || "", bv = b.children[idx]?.textContent.trim() || "";
            const an = num(av), bn = num(bv);
            if (!isNaN(an) && !isNaN(bn)) return asc ? an - bn : bn - an;
            return asc ? av.localeCompare(bv, "ko") : bv.localeCompare(av, "ko");
          });
          rows.forEach((r) => tbody.appendChild(r));
        };
        if (!th.hasAttribute("aria-sort")) th.setAttribute("aria-sort", "none");
        on(trigger, "click", sortNow);
      });
      // select-all
      const selAll = $('thead input[type="checkbox"]', tbl);
      const rowChecks = () => $$('tbody input[type="checkbox"]', tbl);
      if (selAll) on(selAll, "change", () => rowChecks().forEach((c) => { c.checked = selAll.checked; c.closest("tr").classList.toggle("is-selected", selAll.checked); }));
      rowChecks().forEach((c) => on(c, "change", () => {
        c.closest("tr").classList.toggle("is-selected", c.checked);
        if (selAll) selAll.checked = rowChecks().every((x) => x.checked);
      }));
    });
  }

  /* ---------------------------------------------------------------------------
     DROPZONE (file upload)
     --------------------------------------------------------------------------- */
  function initDropzones() {
    $$(".dropzone").forEach((dz) => {
      const input = dz.querySelector('input[type="file"]') || (() => { const i = document.createElement("input"); i.type = "file"; i.multiple = true; i.hidden = true; dz.appendChild(i); return i; })();
      const listEl = dz.parentElement.querySelector("[data-file-list]");
      const render = (files) => {
        if (!listEl) return;
        listEl.innerHTML = "";
        Array.from(files).forEach((f) => {
          const chip = document.createElement("span");
          chip.className = "file-chip";
          chip.innerHTML = `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z"/><path d="M13 2v7h7"/></svg> ${f.name}`;
          listEl.appendChild(chip);
        });
      };
      on(dz, "click", () => input.click());
      on(input, "change", () => { render(input.files); if (input.files.length) toast({ type: "success", title: "업로드 준비 완료", msg: input.files.length + "개 파일" }); });
      ["dragover", "dragenter"].forEach((ev) => on(dz, ev, (e) => { e.preventDefault(); dz.classList.add("is-drag"); }));
      ["dragleave", "drop"].forEach((ev) => on(dz, ev, (e) => { e.preventDefault(); dz.classList.remove("is-drag"); }));
      on(dz, "drop", (e) => { if (e.dataTransfer.files.length) { render(e.dataTransfer.files); toast({ type: "success", title: "업로드 준비 완료", msg: e.dataTransfer.files.length + "개 파일" }); } });
    });
  }

  /* ---------------------------------------------------------------------------
     COPY (code block / anything with data-copy)
     --------------------------------------------------------------------------- */
  function initCopy() {
    on(document, "click", (e) => {
      const t = e.target.closest("[data-copy]");
      if (!t) return;
      const txt = t.getAttribute("data-copy") || t.closest(".codeblock")?.querySelector("code")?.innerText || "";
      navigator.clipboard?.writeText(txt).then(() => toast({ type: "success", title: "복사했어요!", msg: "클립보드에 담겼어요 ♡" }));
      burst(t);
    });
  }

  /* ---------------------------------------------------------------------------
     SIDEBAR collapse
     --------------------------------------------------------------------------- */
  function initSidebar() {
    on(document, "click", (e) => {
      const t = e.target.closest("[data-sidebar-toggle]");
      if (!t) return;
      const sb = $(".sidebar");
      if (sb) sb.classList.toggle("is-collapsed");
    });
  }

  /* ---------------------------------------------------------------------------
     PROGRESS RING (set dashoffset from data-value)
     --------------------------------------------------------------------------- */
  function initRings() {
    $$(".progress-ring").forEach((ring) => {
      const bar = $(".pr-bar", ring);
      if (!bar) return;
      const r = bar.r.baseVal.value;
      const c = 2 * Math.PI * r;
      const val = parseFloat(ring.getAttribute("data-value") || "0");
      bar.style.strokeDasharray = c;
      bar.style.strokeDashoffset = c;
      requestAnimationFrame(() => { bar.style.strokeDashoffset = c * (1 - val / 100); });
    });
  }

  /* ---------------------------------------------------------------------------
     BUTTON ripple/bounce on click for primary (sparkle)
     --------------------------------------------------------------------------- */
  function initButtonFX() {
    on(document, "click", (e) => {
      const b = e.target.closest(".btn--primary, .fab");
      if (b && !b.disabled) burst(b, 6);
    });
  }

  /* ---------------------------------------------------------------------------
     INIT ALL
     --------------------------------------------------------------------------- */
  function init() {
    initTheme();
    initCmdK();
    initTabs();
    initAccordion();
    initDropdown();
    initContextMenu();
    initPopover();
    initToggles();
    initSegmented();
    initSliders();
    initSteppers();
    initRatings();
    initChipInputs();
    initCombobox();
    initCarousels();
    initTables();
    initDropzones();
    initCopy();
    initSidebar();
    initRings();
    initButtonFX();
    initCursorTrail();
  }

  if (document.readyState === "loading") on(document, "DOMContentLoaded", init);
  else init();

  // expose
  window.Kawaii = { toast, burst, openOverlay, closeOverlay, applyTheme };
})();
