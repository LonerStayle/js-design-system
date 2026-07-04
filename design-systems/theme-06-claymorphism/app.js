/* ==========================================================================
   THEME-06 · CLAYMORPHISM — app.js
   모든 인터랙션 + 테마 전환 (순수 바닐라 JS, 의존성 0)
   data-* 속성으로 자동 와이어링되므로 어느 페이지에서든 동작한다.
   전역 API: window.Clay.toast(...) , window.Clay.openModal(id) ...
   ========================================================================== */
(function () {
  "use strict";

  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const on = (el, ev, fn, opt) => el && el.addEventListener(ev, fn, opt);

  /* =======================================================================
     아이콘 (인라인 SVG, 둥근 스트로크) — JS 가 동적으로 만들 때 사용
     ======================================================================= */
  const ICON = {
    check: '<svg class="icon" viewBox="0 0 24 24"><polyline points="4 12 10 18 20 6"/></svg>',
    x: '<svg class="icon" viewBox="0 0 24 24"><line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/></svg>',
    info: '<svg class="icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><line x1="12" y1="11" x2="12" y2="16"/><circle cx="12" cy="7.5" r="0.6" fill="currentColor"/></svg>',
    success: '<svg class="icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><polyline points="8 12 11 15 16 9"/></svg>',
    warning: '<svg class="icon" viewBox="0 0 24 24"><path d="M12 4 22 19H2Z"/><line x1="12" y1="10" x2="12" y2="14"/><circle cx="12" cy="17" r="0.6" fill="currentColor"/></svg>',
    danger: '<svg class="icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><line x1="12" y1="7" x2="12" y2="13"/><circle cx="12" cy="16.5" r="0.6" fill="currentColor"/></svg>',
    star: '<svg class="icon" viewBox="0 0 24 24"><polygon points="12 3 14.9 9 21.5 9.7 16.5 14.2 18 20.8 12 17.4 6 20.8 7.5 14.2 2.5 9.7 9.1 9"/></svg>'
  };
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* =======================================================================
     1. 테마 전환 (light / dark) — localStorage 영속 + 시스템 선호
     ======================================================================= */
  const THEME_KEY = "clay-theme";
  function applyTheme(t) {
    document.documentElement.setAttribute("data-theme", t);
    $$("[data-theme-toggle]").forEach((b) => {
      b.setAttribute("aria-pressed", String(t === "dark"));
      const lbl = b.querySelector("[data-theme-label]");
      if (lbl) lbl.textContent = t === "dark" ? "라이트" : "다크";
    });
  }
  function initTheme() {
    let saved = null;
    try { saved = localStorage.getItem(THEME_KEY); } catch (e) {}
    const sys = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    applyTheme(saved || sys);
    document.addEventListener("click", (e) => {
      const t = e.target.closest("[data-theme-toggle]");
      if (!t) return;
      const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
      applyTheme(next);
      try { localStorage.setItem(THEME_KEY, next); } catch (e) {}
    });
  }

  /* =======================================================================
     2. 오버레이 (Modal / Drawer / CommandPalette 공용) — open/close + 포커스 트랩
     ======================================================================= */
  let lastFocused = null;
  function openOverlay(el) {
    if (!el) return;
    lastFocused = document.activeElement;
    el.classList.add("is-open");
    el.setAttribute("aria-hidden", "false");
    document.body.classList.add("is-locked");
    const focusTarget = el.querySelector("[data-autofocus], input, button, [tabindex]") || el;
    setTimeout(() => focusTarget.focus(), 60);
    el.dispatchEvent(new CustomEvent("clay:open"));
  }
  function closeOverlay(el) {
    if (!el) return;
    el.classList.remove("is-open");
    el.setAttribute("aria-hidden", "true");
    if (!$(".overlay.is-open")) document.body.classList.remove("is-locked");
    if (lastFocused) { try { lastFocused.focus(); } catch (e) {} }
    el.dispatchEvent(new CustomEvent("clay:close"));
  }
  function initOverlays() {
    document.addEventListener("click", (e) => {
      const opener = e.target.closest("[data-open]");
      if (opener) {
        const sel = opener.getAttribute("data-open");
        const target = $(sel);
        if (target) { e.preventDefault(); openOverlay(target); }
      }
      const closer = e.target.closest("[data-close]");
      if (closer) { const ov = closer.closest(".overlay"); if (ov) closeOverlay(ov); }
      // 백드롭 클릭(패널 바깥)
      if (e.target.classList && e.target.classList.contains("overlay")) closeOverlay(e.target);
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") { const open = $(".overlay.is-open"); if (open) closeOverlay(open); }
      // 포커스 트랩
      if (e.key === "Tab") {
        const open = $(".overlay.is-open");
        if (!open) return;
        const f = $$('a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])', open)
          .filter((el) => el.offsetParent !== null);
        if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
  }

  /* =======================================================================
     3. Toast — 전역 API + 선언적 트리거
     ======================================================================= */
  function ensureToastStack() {
    let stack = $(".toast-stack");
    if (!stack) {
      stack = document.createElement("div");
      stack.className = "toast-stack";
      stack.setAttribute("aria-live", "polite");
      stack.setAttribute("aria-atomic", "false");
      document.body.appendChild(stack);
    }
    return stack;
  }
  function toast(opts) {
    opts = opts || {};
    const variant = opts.variant || "info";
    const stack = ensureToastStack();
    const el = document.createElement("div");
    el.className = "toast toast--" + variant;
    el.setAttribute("role", "status");
    const icon = ICON[variant] || ICON.info;
    el.innerHTML =
      '<span class="toast__icon">' + icon + "</span>" +
      '<div class="toast__body">' +
        (opts.title ? '<div class="toast__title">' + esc(opts.title) + "</div>" : "") +
        (opts.text ? '<div class="toast__text">' + esc(opts.text) + "</div>" : "") +
      "</div>" +
      '<button class="toast__close" aria-label="닫기">' + ICON.x + "</button>" +
      (opts.duration !== 0 && !prefersReduced ? '<span class="toast__timer"></span>' : "");
    stack.appendChild(el);
    const dur = opts.duration === 0 ? 0 : (opts.duration || 4000);
    let timer = dur ? setTimeout(() => remove(), dur) : null;
    function remove() {
      el.classList.add("is-leaving");
      setTimeout(() => el.remove(), 300);
    }
    on(el.querySelector(".toast__close"), "click", () => { if (timer) clearTimeout(timer); remove(); });
    return el;
  }
  function initToasts() {
    document.addEventListener("click", (e) => {
      const t = e.target.closest("[data-toast]");
      if (!t) return;
      toast({
        title: t.getAttribute("data-toast-title") || "알림",
        text: t.getAttribute("data-toast-text") || "",
        variant: t.getAttribute("data-toast-variant") || "info"
      });
    });
  }

  /* =======================================================================
     4. Tabs (ARIA + 방향키)
     ======================================================================= */
  function initTabs() {
    $$("[data-tabs]").forEach((wrap) => {
      const tabs = $$('[role="tab"]', wrap);
      function activate(tab) {
        tabs.forEach((t) => {
          const sel = t === tab;
          t.setAttribute("aria-selected", String(sel));
          t.tabIndex = sel ? 0 : -1;
          const panel = $("#" + t.getAttribute("aria-controls"));
          if (panel) panel.hidden = !sel;
        });
      }
      tabs.forEach((tab, i) => {
        on(tab, "click", () => activate(tab));
        on(tab, "keydown", (e) => {
          let idx = null;
          if (e.key === "ArrowRight" || e.key === "ArrowDown") idx = (i + 1) % tabs.length;
          if (e.key === "ArrowLeft" || e.key === "ArrowUp") idx = (i - 1 + tabs.length) % tabs.length;
          if (e.key === "Home") idx = 0;
          if (e.key === "End") idx = tabs.length - 1;
          if (idx !== null) { e.preventDefault(); tabs[idx].focus(); activate(tabs[idx]); }
        });
      });
    });
  }

  /* =======================================================================
     5. Accordion
     ======================================================================= */
  function initAccordion() {
    $$("[data-accordion]").forEach((acc) => {
      const single = acc.getAttribute("data-accordion") === "single";
      $$(".accordion__trigger", acc).forEach((trg) => {
        const item = trg.closest(".accordion__item");
        const panel = item.querySelector(".accordion__panel");
        trg.setAttribute("aria-expanded", item.classList.contains("is-open") ? "true" : "false");
        if (panel && panel.id) trg.setAttribute("aria-controls", panel.id);
        on(trg, "click", () => {
          const willOpen = !item.classList.contains("is-open");
          if (single) $$(".accordion__item", acc).forEach((it) => {
            it.classList.remove("is-open");
            const t = it.querySelector(".accordion__trigger"); if (t) t.setAttribute("aria-expanded", "false");
          });
          item.classList.toggle("is-open", willOpen);
          trg.setAttribute("aria-expanded", String(willOpen));
        });
      });
    });
  }

  /* =======================================================================
     6. Dropdown / Menu / Popover (외부 클릭 닫기)
     ======================================================================= */
  function initDropdowns() {
    document.addEventListener("click", (e) => {
      const toggle = e.target.closest("[data-dropdown-toggle]");
      if (toggle) {
        const dd = toggle.closest(".dropdown");
        const open = dd.classList.contains("is-open");
        $$(".dropdown.is-open").forEach((d) => { if (d !== dd) d.classList.remove("is-open"); });
        dd.classList.toggle("is-open", !open);
        toggle.setAttribute("aria-expanded", String(!open));
        return;
      }
      const popToggle = e.target.closest("[data-popover-toggle]");
      if (popToggle) {
        const pop = popToggle.closest(".popover");
        const open = pop.classList.contains("is-open");
        $$(".popover.is-open").forEach((p) => { if (p !== pop) p.classList.remove("is-open"); });
        pop.classList.toggle("is-open", !open);
        popToggle.setAttribute("aria-expanded", String(!open));
        return;
      }
      // 바깥 클릭 → 모두 닫기
      if (!e.target.closest(".dropdown")) $$(".dropdown.is-open").forEach((d) => d.classList.remove("is-open"));
      if (!e.target.closest(".popover")) $$(".popover.is-open").forEach((p) => p.classList.remove("is-open"));
      // 메뉴 아이템 클릭 시 닫기
      const item = e.target.closest(".menu__item");
      if (item) { const dd = item.closest(".dropdown"); if (dd) dd.classList.remove("is-open"); }
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        $$(".dropdown.is-open").forEach((d) => d.classList.remove("is-open"));
        $$(".popover.is-open").forEach((p) => p.classList.remove("is-open"));
        $$(".context-menu.is-open").forEach((m) => m.classList.remove("is-open"));
      }
    });
  }

  /* =======================================================================
     7. ContextMenu (우클릭)
     ======================================================================= */
  function initContextMenus() {
    $$("[data-context-menu]").forEach((zone) => {
      const menu = $(zone.getAttribute("data-context-menu"));
      if (!menu) return;
      on(zone, "contextmenu", (e) => {
        e.preventDefault();
        $$(".context-menu.is-open").forEach((m) => m.classList.remove("is-open"));
        menu.style.position = "fixed";
        menu.classList.add("is-open");
        const w = menu.offsetWidth, h = menu.offsetHeight;
        menu.style.left = Math.min(e.clientX, window.innerWidth - w - 8) + "px";
        menu.style.top = Math.min(e.clientY, window.innerHeight - h - 8) + "px";
      });
    });
    document.addEventListener("click", () => $$(".context-menu.is-open").forEach((m) => m.classList.remove("is-open")));
    document.addEventListener("scroll", () => $$(".context-menu.is-open").forEach((m) => m.classList.remove("is-open")), true);
  }

  /* =======================================================================
     8. CommandPalette (⌘K / Ctrl+K)
     ======================================================================= */
  function initCmdK() {
    const overlay = $("#cmdk");
    if (!overlay) {
      // 단축키만이라도 토스트로 안내 (팔레트 없는 페이지)
      return;
    }
    const input = $(".cmdk__search input", overlay);
    const items = $$(".cmdk__item", overlay);
    const list = $(".cmdk__list", overlay);
    let active = -1;
    // 접근성: 각 옵션에 id 부여(aria-activedescendant 대상)
    items.forEach((it, i) => { if (!it.id) it.id = "cmdk-opt-" + i; });

    function visible() { return items.filter((i) => !i.hidden); }
    function setActive(idx) {
      const vis = visible();
      vis.forEach((i) => i.setAttribute("aria-selected", "false"));
      active = idx;
      if (vis[idx]) {
        vis[idx].setAttribute("aria-selected", "true");
        vis[idx].scrollIntoView({ block: "nearest" });
        input.setAttribute("aria-activedescendant", vis[idx].id);
      } else {
        input.removeAttribute("aria-activedescendant");
      }
    }
    function filter(q) {
      q = q.trim().toLowerCase();
      let emptyEl = $(".cmdk__empty", overlay);
      let any = false;
      items.forEach((i) => {
        const txt = (i.getAttribute("data-keywords") || i.textContent).toLowerCase();
        const show = !q || txt.indexOf(q) !== -1;
        i.hidden = !show; if (show) any = true;
      });
      $$(".cmdk__group-label", overlay).forEach((g) => {
        let n = g.nextElementSibling, has = false;
        // 그룹 라벨 다음의 아이템들 검사
        const grp = [];
        while (n && !n.classList.contains("cmdk__group-label")) { if (n.classList.contains("cmdk__item")) grp.push(n); n = n.nextElementSibling; }
        has = grp.some((i) => !i.hidden);
        g.hidden = !has;
      });
      if (emptyEl) emptyEl.hidden = any;
      setActive(any ? 0 : -1);
    }
    on(overlay, "clay:open", () => { input.value = ""; filter(""); setTimeout(() => input.focus(), 80); });
    on(input, "input", () => filter(input.value));
    on(input, "keydown", (e) => {
      const vis = visible();
      if (e.key === "ArrowDown") { e.preventDefault(); setActive(Math.min(active + 1, vis.length - 1)); }
      else if (e.key === "ArrowUp") { e.preventDefault(); setActive(Math.max(active - 1, 0)); }
      else if (e.key === "Enter") { e.preventDefault(); if (vis[active]) vis[active].click(); }
    });
    items.forEach((i, idx) => {
      on(i, "click", () => {
        const action = i.getAttribute("data-action");
        closeOverlay(overlay);
        if (action === "theme") $("[data-theme-toggle]") && $("[data-theme-toggle]").click();
        else if (i.getAttribute("data-href")) location.href = i.getAttribute("data-href");
        else toast({ title: "실행", text: (i.querySelector("span:not(.icon)") || i).textContent.trim(), variant: "success" });
      });
      on(i, "mousemove", () => { const vi = visible().indexOf(i); if (vi >= 0) setActive(vi); });
    });
    document.addEventListener("keydown", (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        overlay.classList.contains("is-open") ? closeOverlay(overlay) : openOverlay(overlay);
      }
    });
  }

  /* =======================================================================
     9. Sidebar 접기
     ======================================================================= */
  function initSidebar() {
    document.addEventListener("click", (e) => {
      const t = e.target.closest("[data-sidebar-toggle]");
      if (!t) return;
      const sel = t.getAttribute("data-sidebar-toggle");
      const sb = sel ? $(sel) : $(".sidebar");
      if (sb) sb.classList.toggle("is-collapsed");
    });
  }

  /* =======================================================================
     10. Slider 채움(--val)
     ======================================================================= */
  function initSliders() {
    function paint(s) {
      const min = +s.min || 0, max = +s.max || 100;
      const pct = ((s.value - min) / (max - min)) * 100;
      s.style.setProperty("--val", pct + "%");
      const out = s.parentElement && s.parentElement.querySelector("[data-slider-output]");
      if (out) out.textContent = s.value;
    }
    $$("input.slider").forEach((s) => { paint(s); on(s, "input", () => paint(s)); });
  }

  /* =======================================================================
     11. Rating
     ======================================================================= */
  function initRatings() {
    $$("[data-rating]").forEach((r) => {
      const value = parseFloat(r.getAttribute("data-rating")) || 0;
      const max = +r.getAttribute("data-max") || 5;
      if (r.hasAttribute("data-readonly")) renderDisplayRating(r, value, max);
      else renderInteractiveRating(r, value, max);
    });
  }
  /* 표시용: 클릭 불가, 소수점 부분 채움. aria-label=시각=data 3자 일치 */
  function renderDisplayRating(r, value, max) {
    r.classList.add("rating", "rating--display");
    r.setAttribute("role", "img");
    r.setAttribute("aria-label", max + "점 만점에 " + value + "점");
    const pct = Math.max(0, Math.min(100, (value / max) * 100));
    let base = "", over = "";
    for (let i = 0; i < max; i++) {
      base += '<span class="rating__star">' + ICON.star + "</span>";
      over += '<span class="rating__star">' + ICON.star + "</span>";
    }
    r.innerHTML =
      '<span class="rating__base" aria-hidden="true">' + base + "</span>" +
      '<span class="rating__overlay" aria-hidden="true" style="--fill:' + pct + '%">' + over + "</span>";
  }
  /* 입력용: role=radiogroup + radio, 방향키/Home/End, aria-checked 동기화 */
  function renderInteractiveRating(r, value, max) {
    r.classList.add("rating", "rating--interactive");
    r.setAttribute("role", "radiogroup");
    if (!r.getAttribute("aria-label")) r.setAttribute("aria-label", "별점 (" + max + "점 만점)");
    let current = Math.round(value);
    r.innerHTML = "";
    const stars = [];
    for (let i = 1; i <= max; i++) {
      const b = document.createElement("button");
      b.className = "rating__star"; b.type = "button";
      b.setAttribute("role", "radio");
      b.setAttribute("aria-label", i + "점");
      b.setAttribute("aria-checked", String(i === current));
      b.tabIndex = (i === current || (current === 0 && i === 1)) ? 0 : -1;
      b.innerHTML = ICON.star;
      stars.push(b); r.appendChild(b);
      on(b, "click", () => setValue(i));
      on(b, "mouseenter", () => paint(i));
      on(b, "keydown", (e) => {
        let ni = null;
        if (e.key === "ArrowRight" || e.key === "ArrowUp") ni = Math.min((current || 0) + 1, max);
        else if (e.key === "ArrowLeft" || e.key === "ArrowDown") ni = Math.max((current || 1) - 1, 1);
        else if (e.key === "Home") ni = 1;
        else if (e.key === "End") ni = max;
        else if (e.key === " " || e.key === "Enter") { e.preventDefault(); setValue(i); return; }
        if (ni !== null) { e.preventDefault(); setValue(ni); stars[ni - 1].focus(); }
      });
    }
    on(r, "mouseleave", () => paint(current));
    function setValue(n) {
      current = n;
      stars.forEach((s, idx) => {
        s.setAttribute("aria-checked", String(idx + 1 === n));
        s.tabIndex = (idx + 1 === n) ? 0 : -1;
      });
      paint(n);
      r.dispatchEvent(new CustomEvent("clay:rate", { detail: n }));
    }
    function paint(n) { stars.forEach((s, idx) => s.classList.toggle("is-filled", idx < n)); }
    paint(current);
  }

  /* =======================================================================
     12. ChipInput
     ======================================================================= */
  function initChipInputs() {
    $$(".chip-input").forEach((box) => {
      const input = box.querySelector("input");
      if (!input) return;
      function addChip(label) {
        label = label.trim(); if (!label) return;
        const chip = document.createElement("span");
        chip.className = "chip";
        chip.innerHTML = esc(label) + '<button class="chip__remove" aria-label="삭제">' + ICON.x + "</button>";
        box.insertBefore(chip, input);
        on(chip.querySelector(".chip__remove"), "click", () => {
          chip.classList.add("is-removing"); setTimeout(() => chip.remove(), 200);
        });
      }
      on(input, "keydown", (e) => {
        if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addChip(input.value); input.value = ""; }
        else if (e.key === "Backspace" && !input.value) {
          const chips = box.querySelectorAll(".chip"); if (chips.length) chips[chips.length - 1].remove();
        }
      });
      // 기존 칩 제거 버튼 와이어
      $$(".chip__remove", box).forEach((b) => on(b, "click", () => {
        const c = b.closest(".chip"); c.classList.add("is-removing"); setTimeout(() => c.remove(), 200);
      }));
    });
  }

  /* =======================================================================
     13. MultiSelect
     ======================================================================= */
  function initMultiSelect() {
    $$(".multiselect").forEach((ms) => {
      const control = $(".multiselect__control", ms);
      const menu = $(".multiselect__menu", ms);
      const placeholder = control.querySelector(".multiselect__placeholder");
      on(control, "click", (e) => { if (e.target.closest(".chip__remove")) return; ms.classList.toggle("is-open"); });
      $$(".multiselect__opt", menu).forEach((opt) => {
        on(opt, "click", () => {
          const selected = opt.getAttribute("aria-selected") === "true";
          opt.setAttribute("aria-selected", String(!selected));
          sync();
        });
      });
      function sync() {
        const chosen = $$('.multiselect__opt[aria-selected="true"]', menu);
        $$(".multiselect__control .chip", control).forEach((c) => c.remove());
        if (placeholder) placeholder.style.display = chosen.length ? "none" : "";
        chosen.forEach((opt) => {
          const chip = document.createElement("span");
          chip.className = "chip chip--soft";
          chip.innerHTML = esc(opt.textContent.trim()) + '<button class="chip__remove" aria-label="해제">' + ICON.x + "</button>";
          control.insertBefore(chip, placeholder);
          on(chip.querySelector(".chip__remove"), "click", (ev) => {
            ev.stopPropagation(); opt.setAttribute("aria-selected", "false"); sync();
          });
        });
      }
      document.addEventListener("click", (e) => { if (!ms.contains(e.target)) ms.classList.remove("is-open"); });
      sync();
    });
  }

  /* =======================================================================
     14. Combobox / Autocomplete
     ======================================================================= */
  function initCombobox() {
    $$(".combobox").forEach((cb) => {
      const input = $("input", cb);
      const opts = $$(".combobox__option", cb);
      const empty = $(".combobox__empty", cb);
      function open() { cb.classList.add("is-open"); }
      function close() { cb.classList.remove("is-open"); }
      on(input, "focus", open);
      on(input, "input", () => {
        const q = input.value.trim().toLowerCase(); let any = false;
        opts.forEach((o) => { const show = o.textContent.toLowerCase().indexOf(q) !== -1; o.style.display = show ? "" : "none"; if (show) any = true; });
        if (empty) empty.style.display = any ? "none" : "";
        open();
      });
      opts.forEach((o) => on(o, "click", () => { input.value = o.textContent.trim(); close(); }));
      document.addEventListener("click", (e) => { if (!cb.contains(e.target)) close(); });
    });
  }

  /* =======================================================================
     15. Stepper
     ======================================================================= */
  function initSteppers() {
    $$(".stepper").forEach((st) => {
      const val = $(".stepper__value", st);
      const min = st.hasAttribute("data-min") ? +st.getAttribute("data-min") : -Infinity;
      const max = st.hasAttribute("data-max") ? +st.getAttribute("data-max") : Infinity;
      function get() { return parseInt(val.textContent, 10) || 0; }
      function set(n) { val.textContent = Math.max(min, Math.min(max, n)); }
      on($("[data-step-down]", st), "click", () => set(get() - 1));
      on($("[data-step-up]", st), "click", () => set(get() + 1));
    });
  }

  /* =======================================================================
     16. Carousel
     ======================================================================= */
  function initCarousels() {
    $$("[data-carousel]").forEach((car) => {
      const track = $(".carousel__track", car);
      const slides = $$(".carousel__slide", car);
      const dotsWrap = $(".carousel__dots", car);
      let idx = 0;
      if (dotsWrap && !dotsWrap.children.length) slides.forEach((_, i) => {
        const d = document.createElement("button"); d.className = "carousel__dot"; d.setAttribute("aria-label", (i + 1) + "번 슬라이드");
        on(d, "click", () => go(i)); dotsWrap.appendChild(d);
      });
      const dots = dotsWrap ? $$(".carousel__dot", dotsWrap) : [];
      function go(n) {
        idx = (n + slides.length) % slides.length;
        track.style.transform = "translateX(" + (-idx * 100) + "%)";
        dots.forEach((d, i) => d.classList.toggle("is-active", i === idx));
      }
      on($(".carousel__btn--prev", car), "click", () => go(idx - 1));
      on($(".carousel__btn--next", car), "click", () => go(idx + 1));
      go(0);
      if (car.hasAttribute("data-autoplay") && !prefersReduced) {
        let timer = setInterval(() => go(idx + 1), 4500);
        on(car, "mouseenter", () => clearInterval(timer));
        on(car, "mouseleave", () => { timer = setInterval(() => go(idx + 1), 4500); });
      }
    });
  }

  /* =======================================================================
     17. Copy 버튼 (CodeBlock 등)
     ======================================================================= */
  function initCopy() {
    document.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-copy]");
      if (!btn) return;
      const sel = btn.getAttribute("data-copy");
      const src = sel ? $(sel) : btn.closest(".code-block") && btn.closest(".code-block").querySelector("code");
      const text = src ? src.textContent : "";
      const done = () => { const lbl = btn.querySelector("[data-copy-label]") || btn; const old = lbl.textContent; lbl.textContent = "복사됨!"; setTimeout(() => (lbl.textContent = old), 1400); };
      if (navigator.clipboard) navigator.clipboard.writeText(text).then(done).catch(done);
      else done();
    });
  }

  /* =======================================================================
     18. FileUpload
     ======================================================================= */
  function initFileUpload() {
    $$(".file-upload").forEach((fu) => {
      const input = fu.querySelector('input[type="file"]');
      const listSel = fu.getAttribute("data-file-list");
      const list = listSel ? $(listSel) : null;
      if (input) {
        on(fu, "click", (e) => { if (e.target.tagName !== "INPUT") input.click(); });
        on(input, "change", () => render(input.files));
      }
      ["dragover", "dragenter"].forEach((ev) => on(fu, ev, (e) => { e.preventDefault(); fu.classList.add("is-dragover"); }));
      ["dragleave", "drop"].forEach((ev) => on(fu, ev, (e) => { e.preventDefault(); fu.classList.remove("is-dragover"); }));
      on(fu, "drop", (e) => { if (input && e.dataTransfer) { input.files = e.dataTransfer.files; render(e.dataTransfer.files); } });
      function render(files) {
        if (!list) return; list.innerHTML = "";
        Array.from(files).forEach((f) => {
          const row = document.createElement("div"); row.className = "file-row";
          row.innerHTML =
            '<span class="stat__icon stat__icon--violet" style="width:2.2rem;height:2.2rem;border-radius:12px">' +
            '<svg class="icon" viewBox="0 0 24 24"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><polyline points="14 3 14 8 19 8"/></svg></span>' +
            '<div class="file-row__bar"><div class="fw-bold">' + esc(f.name) + '</div><div class="text-sm text-muted">' + (f.size / 1024).toFixed(1) + " KB</div></div>" +
            '<span class="inline-note inline-note--success">' + ICON.success + " 완료</span>";
          list.appendChild(row);
        });
      }
    });
  }

  /* =======================================================================
     19. Table — 정렬 + 전체선택
     ======================================================================= */
  function initTables() {
    $$("table[data-sortable]").forEach((table) => {
      const tbody = table.tBodies[0];
      $$("th.th-sort", table).forEach((th, colIndex) => {
        const realIndex = Array.from(th.parentNode.children).indexOf(th);
        on(th, "click", () => {
          const cur = th.getAttribute("aria-sort");
          const dir = cur === "ascending" ? "descending" : "ascending";
          $$("th.th-sort", table).forEach((o) => o.removeAttribute("aria-sort"));
          th.setAttribute("aria-sort", dir);
          const rows = Array.from(tbody.rows);
          rows.sort((a, b) => {
            const av = cellVal(a.cells[realIndex]), bv = cellVal(b.cells[realIndex]);
            if (av < bv) return dir === "ascending" ? -1 : 1;
            if (av > bv) return dir === "ascending" ? 1 : -1;
            return 0;
          });
          rows.forEach((r) => tbody.appendChild(r));
        });
      });
      function cellVal(cell) {
        if (!cell) return "";
        const d = cell.getAttribute("data-sort");
        const raw = d !== null ? d : cell.textContent.trim();
        const num = parseFloat(raw.replace(/[^0-9.\-]/g, ""));
        return (d !== null && !isNaN(+d)) || (/^[₩$]?[\d,.\-]+%?$/.test(raw) && !isNaN(num)) ? num : raw.toLowerCase();
      }
    });
    // 전체 선택
    $$("[data-select-all]").forEach((master) => {
      const table = master.closest("table");
      const boxes = $$('tbody input[type="checkbox"]', table);
      on(master, "change", () => {
        boxes.forEach((b) => { b.checked = master.checked; b.closest("tr").classList.toggle("is-selected", master.checked); });
      });
      boxes.forEach((b) => on(b, "change", () => {
        b.closest("tr").classList.toggle("is-selected", b.checked);
        master.checked = boxes.every((x) => x.checked);
        master.indeterminate = !master.checked && boxes.some((x) => x.checked);
      }));
    });
  }

  /* =======================================================================
     20. Calendar / DatePicker
     ======================================================================= */
  const WD = ["일", "월", "화", "수", "목", "금", "토"];
  const MO = ["1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월"];
  function buildCalendar(el, state) {
    const today = new Date();
    const y = state.y, m = state.m;
    const first = new Date(y, m, 1);
    const startDay = first.getDay();
    const daysInMonth = new Date(y, m + 1, 0).getDate();
    const prevDays = new Date(y, m, 0).getDate();
    let html =
      '<div class="calendar__header">' +
        '<button class="calendar__nav" data-cal-prev aria-label="이전 달"><svg class="icon" viewBox="0 0 24 24"><polyline points="15 6 9 12 15 18"/></svg></button>' +
        '<div class="calendar__month">' + y + "년 " + MO[m] + "</div>" +
        '<button class="calendar__nav" data-cal-next aria-label="다음 달"><svg class="icon" viewBox="0 0 24 24"><polyline points="9 6 15 12 9 18"/></svg></button>' +
      "</div><div class=\"calendar__grid\">";
    WD.forEach((d) => (html += '<div class="calendar__wd">' + d + "</div>"));
    for (let i = startDay - 1; i >= 0; i--) html += '<div class="calendar__day calendar__day--muted">' + (prevDays - i) + "</div>";
    for (let d = 1; d <= daysInMonth; d++) {
      const isToday = y === today.getFullYear() && m === today.getMonth() && d === today.getDate();
      const isSel = state.sel && state.sel.y === y && state.sel.m === m && state.sel.d === d;
      html += '<div class="calendar__day' + (isToday ? " calendar__day--today" : "") + (isSel ? " is-selected" : "") + '" data-cal-day="' + d + '" tabindex="0" role="button">' + d + "</div>";
    }
    const total = startDay + daysInMonth;
    for (let i = 1; i <= (7 - (total % 7)) % 7; i++) html += '<div class="calendar__day calendar__day--muted">' + i + "</div>";
    html += "</div>";
    el.innerHTML = html;
    on($("[data-cal-prev]", el), "click", () => { state.m--; if (state.m < 0) { state.m = 11; state.y--; } buildCalendar(el, state); });
    on($("[data-cal-next]", el), "click", () => { state.m++; if (state.m > 11) { state.m = 0; state.y++; } buildCalendar(el, state); });
    $$("[data-cal-day]", el).forEach((day) => on(day, "click", () => {
      state.sel = { y: state.y, m: state.m, d: +day.getAttribute("data-cal-day") };
      buildCalendar(el, state);
      el.dispatchEvent(new CustomEvent("clay:date", { detail: state.sel }));
    }));
  }
  function initCalendars() {
    const now = new Date();
    $$("[data-calendar]").forEach((el) => buildCalendar(el, { y: now.getFullYear(), m: now.getMonth(), sel: null }));
    // DatePicker: 인풋 + 팝오버 캘린더
    $$("[data-datepicker]").forEach((wrap) => {
      const input = $("input", wrap);
      const cal = $("[data-calendar-pop]", wrap);
      if (!cal) return;
      const state = { y: now.getFullYear(), m: now.getMonth(), sel: null };
      buildCalendar(cal, state);
      on(cal, "clay:date", (e) => {
        const s = e.detail; input.value = s.y + "-" + String(s.m + 1).padStart(2, "0") + "-" + String(s.d).padStart(2, "0");
        wrap.classList.remove("is-open");
      });
    });
  }

  /* =======================================================================
     21b. Mascot — 클릭하면 점토처럼 스쿼시(1회 재생 후 원상 복귀)
     ======================================================================= */
  function initMascots() {
    $$(".mascot").forEach((m) => {
      on(m, "click", () => {
        if (prefersReduced) return;
        m.classList.remove("is-squished");
        void m.offsetWidth;              // 리플로우로 애니메이션 재시작
        m.classList.add("is-squished");
      });
      on(m, "animationend", (e) => { if (e.animationName === "clay-squish") m.classList.remove("is-squished"); });
    });
  }

  /* =======================================================================
     21. 스크롤 등장 애니메이션 (IntersectionObserver)
     ======================================================================= */
  function initReveal() {
    if (prefersReduced || !("IntersectionObserver" in window)) {
      $$("[data-reveal]").forEach((el) => el.classList.add("is-revealed"));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("pop-in"); io.unobserve(en.target); } });
    }, { threshold: 0.12 });
    $$("[data-reveal]").forEach((el) => io.observe(el));
  }

  /* =======================================================================
     유틸
     ======================================================================= */
  function esc(s) { return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); }

  /* =======================================================================
     부팅
     ======================================================================= */
  function boot() {
    initTheme();
    initOverlays();
    initToasts();
    initTabs();
    initAccordion();
    initDropdowns();
    initContextMenus();
    initCmdK();
    initSidebar();
    initSliders();
    initRatings();
    initChipInputs();
    initMultiSelect();
    initCombobox();
    initSteppers();
    initCarousels();
    initCopy();
    initFileUpload();
    initTables();
    initCalendars();
    initMascots();
    initReveal();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();

  // 전역 API
  window.Clay = {
    toast,
    openModal: (id) => openOverlay($(id[0] === "#" ? id : "#" + id)),
    closeModal: (id) => closeOverlay($(id[0] === "#" ? id : "#" + id)),
    setTheme: applyTheme
  };
})();
