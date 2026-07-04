/* ============================================================================
   EDITORIAL MAGAZINE — app.js
   순수 바닐라 JS. 모든 인터랙션 + 테마 전환.
   data-* 속성 기반 자동 바인딩 — 마크업에 클래스/속성만 달면 동작.
   파일을 더블클릭(file://)으로 열어도 전부 동작.
   ============================================================================ */
(function () {
  "use strict";

  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const ready = (fn) => (document.readyState !== "loading" ? fn() : document.addEventListener("DOMContentLoaded", fn));

  /* ───────────────────────────── 테마 전환 ───────────────────────────── */
  const THEME_KEY = "em-theme";
  const Theme = {
    get() {
      try { return localStorage.getItem(THEME_KEY); } catch (e) { return null; }
    },
    set(v) {
      document.documentElement.setAttribute("data-theme", v);
      try { localStorage.setItem(THEME_KEY, v); } catch (e) {}
      $$("[data-theme-toggle]").forEach((b) => b.setAttribute("aria-pressed", String(v === "dark")));
    },
    init() {
      let t = this.get();
      if (!t) t = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      this.set(t);
    },
    toggle() {
      this.set(document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark");
    },
  };
  // 깜빡임 방지를 위해 즉시 적용 (DOMContentLoaded 전)
  Theme.init();

  ready(function () {
    bindThemeToggle();
    bindTabs();
    bindAccordion();
    bindModals();
    bindDrawers();
    bindToasts();
    bindMenus();
    bindPopovers();
    bindCommandPalette();
    bindSidebar();
    bindSegmented();
    bindSwitchLabels();
    bindStepper();
    bindSliders();
    bindRating();
    bindChipInput();
    bindCombobox();
    bindFileUpload();
    bindSearchClear();
    bindCarousel();
    bindKanban();
    bindTableSort();
    bindTableSelect();
    bindPricingToggle();
    bindCheckAll();
    bindContextMenu();
    bindCopyButtons();
    bindRevealOnScroll();
    bindBackToTop();
    bindReadingProgress();
    setYear();
  });

  /* ───────────────────────────── 토글 버튼 ───────────────────────────── */
  function bindThemeToggle() {
    $$("[data-theme-toggle]").forEach((btn) => {
      btn.setAttribute("aria-pressed", String(document.documentElement.getAttribute("data-theme") === "dark"));
      btn.addEventListener("click", () => Theme.toggle());
    });
  }

  /* ───────────────────────────── Tabs ───────────────────────────── */
  function bindTabs() {
    $$("[data-tabs]").forEach((root) => {
      const tabs = $$('[role="tab"]', root);
      const panels = $$('[role="tabpanel"]', root);
      function activate(idx, focus) {
        tabs.forEach((t, i) => {
          const sel = i === idx;
          t.setAttribute("aria-selected", String(sel));
          t.tabIndex = sel ? 0 : -1;
          if (sel && focus) t.focus();
        });
        panels.forEach((p, i) => p.toggleAttribute("hidden", i !== idx));
      }
      tabs.forEach((tab, i) => {
        tab.addEventListener("click", () => activate(i));
        tab.addEventListener("keydown", (e) => {
          let n = null;
          if (e.key === "ArrowRight" || e.key === "ArrowDown") n = (i + 1) % tabs.length;
          else if (e.key === "ArrowLeft" || e.key === "ArrowUp") n = (i - 1 + tabs.length) % tabs.length;
          else if (e.key === "Home") n = 0;
          else if (e.key === "End") n = tabs.length - 1;
          if (n !== null) { e.preventDefault(); activate(n, true); }
        });
      });
      const init = tabs.findIndex((t) => t.getAttribute("aria-selected") === "true");
      activate(init < 0 ? 0 : init);
    });
  }

  /* ───────────────────────────── Accordion ───────────────────────────── */
  function bindAccordion() {
    $$("[data-accordion]").forEach((root) => {
      const single = root.getAttribute("data-accordion") === "single";
      $$(".accordion__trigger", root).forEach((trig) => {
        trig.addEventListener("click", () => {
          const item = trig.closest(".accordion__item");
          const open = item.classList.contains("is-open");
          if (single) {
            $$(".accordion__item", root).forEach((it) => {
              it.classList.remove("is-open");
              $(".accordion__trigger", it).setAttribute("aria-expanded", "false");
            });
          }
          item.classList.toggle("is-open", !open);
          trig.setAttribute("aria-expanded", String(!open));
        });
      });
    });
  }

  /* ───────────────────────────── Modal ───────────────────────────── */
  let lastFocused = null;
  function openOverlay(el) {
    lastFocused = document.activeElement;
    el.classList.add("is-open");
    el.removeAttribute("hidden");
    document.body.style.overflow = "hidden";
    const focusable = el.querySelector("input, button, [href], textarea, select, [tabindex]");
    if (focusable) setTimeout(() => focusable.focus(), 50);
    trapFocus(el);
  }
  function closeOverlay(el) {
    el.classList.remove("is-open");
    document.body.style.overflow = "";
    if (lastFocused) lastFocused.focus();
    releaseTrap(el);
  }
  // 요소별 트랩 핸들러 (전역 단일 변수 금지 — 오버레이 중첩 시 핸들러 유실 방지)
  const trapHandlers = new WeakMap();
  function trapFocus(el) {
    releaseTrap(el);
    const handler = function (e) {
      if (e.key !== "Tab") return;
      const f = $$('a[href], button:not(:disabled), textarea, input:not(:disabled), select, [tabindex]:not([tabindex="-1"])', el)
        .filter((n) => n.offsetParent !== null);
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    trapHandlers.set(el, handler);
    el.addEventListener("keydown", handler);
  }
  function releaseTrap(el) {
    const h = trapHandlers.get(el);
    if (h) { el.removeEventListener("keydown", h); trapHandlers.delete(el); }
  }

  function bindModals() {
    $$("[data-modal-open]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const target = document.getElementById(btn.getAttribute("data-modal-open"));
        if (target) openOverlay(target);
      });
    });
    $$(".overlay").forEach((ov) => {
      ov.addEventListener("click", (e) => { if (e.target === ov) closeOverlay(ov); });
      $$("[data-modal-close]", ov).forEach((c) => c.addEventListener("click", () => closeOverlay(ov)));
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        const open = $(".overlay.is-open");
        if (open) closeOverlay(open);
      }
    });
  }

  /* ───────────────────────────── Drawer (모달과 동급 접근성) ───────────────────────────── */
  function bindDrawers() {
    let drawerReturn = null;
    function openDrawer(drawer, overlay) {
      drawerReturn = document.activeElement;
      if (drawer) drawer.classList.add("is-open");
      if (overlay) overlay.classList.add("is-open");
      document.body.style.overflow = "hidden";
      if (drawer) {
        const f = drawer.querySelector('a[href], button:not(:disabled), textarea, input:not(:disabled), select, [tabindex]:not([tabindex="-1"])');
        if (f) setTimeout(() => f.focus(), 50);
        trapFocus(drawer);
      }
    }
    function closeAll() {
      $$(".drawer.is-open").forEach((d) => { releaseTrap(d); d.classList.remove("is-open"); });
      $$(".drawer-overlay.is-open").forEach((o) => o.classList.remove("is-open"));
      document.body.style.overflow = "";
      if (drawerReturn) { drawerReturn.focus(); drawerReturn = null; }
    }
    $$("[data-drawer-open]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-drawer-open");
        const drawer = document.getElementById(id);
        const overlay = document.getElementById(id + "-overlay") || $(".drawer-overlay");
        openDrawer(drawer, overlay);
      });
    });
    $$("[data-drawer-close]").forEach((c) => c.addEventListener("click", closeAll));
    $$(".drawer-overlay").forEach((o) => o.addEventListener("click", closeAll));
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && $(".drawer.is-open")) closeAll(); });
  }

  /* ───────────────────────────── Toast ───────────────────────────── */
  function getToastRegion() {
    let r = $(".toast-region");
    if (!r) {
      r = document.createElement("div");
      r.className = "toast-region";
      r.setAttribute("role", "status");
      r.setAttribute("aria-live", "polite");
      document.body.appendChild(r);
    }
    return r;
  }
  const ICONS = {
    success: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>',
    danger:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16h.01"/></svg>',
    info:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></svg>',
  };
  function toast(opts) {
    opts = opts || {};
    const type = opts.type || "info";
    const region = getToastRegion();
    const el = document.createElement("div");
    el.className = "toast toast--" + type;
    el.setAttribute("role", "alert");
    el.innerHTML =
      '<span class="toast__icon">' + (ICONS[type] || ICONS.info) + "</span>" +
      '<div><div class="toast__title">' + (opts.title || "알림") + "</div>" +
      (opts.text ? '<div class="toast__text">' + opts.text + "</div>" : "") + "</div>" +
      '<button class="toast__close" aria-label="닫기"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:1rem;height:1rem"><path d="M18 6L6 18M6 6l12 12"/></svg></button>';
    region.appendChild(el);
    const remove = () => { el.classList.add("is-leaving"); setTimeout(() => el.remove(), 240); };
    $(".toast__close", el).addEventListener("click", remove);
    if (opts.duration !== 0) setTimeout(remove, opts.duration || 4000);
  }
  window.emToast = toast; // 외부 호출 가능

  function bindToasts() {
    $$("[data-toast]").forEach((btn) => {
      btn.addEventListener("click", () =>
        toast({
          type: btn.getAttribute("data-toast") || "info",
          title: btn.getAttribute("data-toast-title") || "저장되었습니다",
          text: btn.getAttribute("data-toast-text") || "변경 사항이 반영되었습니다.",
        })
      );
    });
    // 알림/배너 닫기
    $$("[data-dismiss]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const t = btn.closest(btn.getAttribute("data-dismiss") || ".alert, .banner");
        if (t) { t.style.transition = "opacity .2s"; t.style.opacity = "0"; setTimeout(() => t.remove(), 200); }
      });
    });
  }

  /* ───────────────────────── Menu / Dropdown ───────────────────────── */
  function closeAllMenus(except) {
    $$(".menu.is-open").forEach((m) => { if (m !== except) { m.classList.remove("is-open"); const t = m.closest(".menu-wrap")?.querySelector("[data-menu-trigger]"); if (t) t.setAttribute("aria-expanded", "false"); } });
  }
  function bindMenus() {
    $$("[data-menu-trigger]").forEach((trig) => {
      const wrap = trig.closest(".menu-wrap");
      const menu = $(".menu", wrap);
      if (!menu) return;
      trig.setAttribute("aria-haspopup", "true");
      trig.setAttribute("aria-expanded", "false");
      trig.addEventListener("click", (e) => {
        e.stopPropagation();
        const open = menu.classList.contains("is-open");
        closeAllMenus();
        menu.classList.toggle("is-open", !open);
        trig.setAttribute("aria-expanded", String(!open));
        if (!open) { const f = menu.querySelector(".menu__item"); if (f) f.focus(); }
      });
      menu.addEventListener("keydown", (e) => {
        const items = $$(".menu__item", menu);
        const i = items.indexOf(document.activeElement);
        if (e.key === "ArrowDown") { e.preventDefault(); items[(i + 1) % items.length].focus(); }
        else if (e.key === "ArrowUp") { e.preventDefault(); items[(i - 1 + items.length) % items.length].focus(); }
        else if (e.key === "Escape") { menu.classList.remove("is-open"); trig.setAttribute("aria-expanded", "false"); trig.focus(); }
      });
    });
    document.addEventListener("click", () => closeAllMenus());
  }

  /* ───────────────────────── Popover ───────────────────────── */
  function bindPopovers() {
    $$("[data-popover-trigger]").forEach((trig) => {
      const wrap = trig.closest(".popover-wrap");
      const pop = $(".popover", wrap);
      if (!pop) return;
      trig.setAttribute("aria-haspopup", "true");
      trig.setAttribute("aria-expanded", "false");
      trig.addEventListener("click", (e) => {
        e.stopPropagation();
        const open = pop.classList.contains("is-open");
        $$(".popover.is-open").forEach((p) => {
          p.classList.remove("is-open");
          const t = p.closest(".popover-wrap")?.querySelector("[data-popover-trigger]");
          if (t) t.setAttribute("aria-expanded", "false");
        });
        pop.classList.toggle("is-open", !open);
        trig.setAttribute("aria-expanded", String(!open));
      });
      pop.addEventListener("click", (e) => e.stopPropagation());
    });
    document.addEventListener("click", () => $$(".popover.is-open").forEach((p) => {
      p.classList.remove("is-open");
      const t = p.closest(".popover-wrap")?.querySelector("[data-popover-trigger]");
      if (t) t.setAttribute("aria-expanded", "false");
    }));
  }

  /* ───────────────────────── Command Palette (⌘K) ───────────────────────── */
  function bindCommandPalette() {
    const overlay = $("[data-cmdk]");
    if (!overlay) return;
    const input = $(".cmdk__input", overlay);
    const list = $(".cmdk__list", overlay);
    const items = $$(".cmdk__item", overlay);
    const empty = $(".cmdk__empty", overlay);
    let active = 0;

    function open() {
      overlay.classList.add("is-open");
      document.body.style.overflow = "hidden";
      input.value = ""; filter(""); setTimeout(() => input.focus(), 40);
    }
    function close() { overlay.classList.remove("is-open"); document.body.style.overflow = ""; }
    function visibleItems() { return items.filter((i) => !i.hidden); }
    function setActive(idx) {
      const vis = visibleItems();
      active = (idx + vis.length) % (vis.length || 1);
      items.forEach((i) => i.classList.remove("is-active"));
      if (vis[active]) { vis[active].classList.add("is-active"); vis[active].scrollIntoView({ block: "nearest" }); }
    }
    function filter(q) {
      q = q.toLowerCase().trim();
      let any = false;
      items.forEach((i) => {
        const match = i.textContent.toLowerCase().includes(q);
        i.hidden = !match;
        if (match) any = true;
      });
      $$(".cmdk__group-label", overlay).forEach((g) => {
        let n = g.nextElementSibling, has = false;
        while (n && !n.classList.contains("cmdk__group-label")) { if (n.classList.contains("cmdk__item") && !n.hidden) has = true; n = n.nextElementSibling; }
        g.hidden = !has;
      });
      if (empty) empty.hidden = any;
      setActive(0);
    }

    document.addEventListener("keydown", (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); overlay.classList.contains("is-open") ? close() : open(); }
      else if (e.key === "Escape" && overlay.classList.contains("is-open")) close();
    });
    $$("[data-cmdk-open]").forEach((b) => b.addEventListener("click", open));
    overlay.addEventListener("click", (e) => { if (e.target === overlay) close(); });
    if (input) {
      input.addEventListener("input", () => filter(input.value));
      input.addEventListener("keydown", (e) => {
        if (e.key === "ArrowDown") { e.preventDefault(); setActive(active + 1); }
        else if (e.key === "ArrowUp") { e.preventDefault(); setActive(active - 1); }
        else if (e.key === "Enter") { e.preventDefault(); const vis = visibleItems(); if (vis[active]) vis[active].click(); }
      });
    }
    items.forEach((it) => it.addEventListener("click", () => {
      close();
      const href = it.getAttribute("data-href");
      if (href) { window.location.href = href; return; }
      const action = it.getAttribute("data-cmdk-action");
      if (action === "theme") { Theme.toggle(); return; }
      toast({ type: "info", title: it.getAttribute("data-label") || it.textContent.trim(), text: "명령을 실행했습니다." });
    }));
  }

  /* ───────────────────────── Sidebar collapse / mobile ───────────────────────── */
  function bindSidebar() {
    $$("[data-sidebar-toggle]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const sb = document.getElementById(btn.getAttribute("data-sidebar-toggle")) || $(".sidebar");
        if (!sb) return;
        if (window.innerWidth <= 880) sb.classList.toggle("is-open");
        else sb.classList.toggle("is-collapsed");
      });
    });
  }

  /* ───────────────────────── SegmentedControl ─────────────────────────
     role="radio" 자식이면 radiogroup(aria-checked+방향키), 아니면 tab(aria-selected). */
  function bindSegmented() {
    $$(".segmented").forEach((seg) => {
      const btns = $$("button", seg);
      if (!btns.length) return;
      const isRadio = btns.some((b) => b.getAttribute("role") === "radio");
      const attr = isRadio ? "aria-checked" : "aria-selected";
      function select(b) {
        btns.forEach((x) => { x.setAttribute(attr, "false"); if (isRadio) x.tabIndex = -1; });
        b.setAttribute(attr, "true"); if (isRadio) b.tabIndex = 0;
        const t = b.getAttribute("data-target");
        if (t) {
          const group = seg.getAttribute("data-segmented-group");
          $$('[data-segmented-panel' + (group ? '="' + group + '"' : "") + "]").forEach((p) => p.toggleAttribute("hidden", p.id !== t));
        }
      }
      btns.forEach((b, i) => {
        b.addEventListener("click", () => select(b));
        if (isRadio) b.addEventListener("keydown", (e) => {
          let n = null;
          if (e.key === "ArrowRight" || e.key === "ArrowDown") n = (i + 1) % btns.length;
          else if (e.key === "ArrowLeft" || e.key === "ArrowUp") n = (i - 1 + btns.length) % btns.length;
          if (n !== null) { e.preventDefault(); btns[n].focus(); select(btns[n]); }
        });
      });
      if (isRadio) {
        const cur = btns.find((b) => b.getAttribute("aria-checked") === "true") || btns[0];
        btns.forEach((b) => (b.tabIndex = b === cur ? 0 : -1));
      }
    });
  }

  /* ───────────────────────── Switch (라벨 텍스트 동기화) ───────────────────────── */
  function bindSwitchLabels() {
    $$("[data-switch-label]").forEach((sw) => {
      const input = $("input", sw) || sw;
      const out = document.getElementById(sw.getAttribute("data-switch-label"));
      const upd = () => { if (out) out.textContent = input.checked ? (sw.getAttribute("data-on") || "켜짐") : (sw.getAttribute("data-off") || "꺼짐"); };
      input.addEventListener("change", upd); upd();
    });
  }

  /* ───────────────────────── Stepper ───────────────────────── */
  function bindStepper() {
    $$(".stepper").forEach((st) => {
      const input = $("input", st);
      const dec = $("[data-step-dec]", st), inc = $("[data-step-inc]", st);
      const min = parseFloat(input.getAttribute("min")) || 0;
      const max = input.hasAttribute("max") ? parseFloat(input.getAttribute("max")) : Infinity;
      const step = parseFloat(input.getAttribute("step")) || 1;
      const set = (v) => { input.value = Math.max(min, Math.min(max, v)); };
      dec && dec.addEventListener("click", () => set((parseFloat(input.value) || 0) - step));
      inc && inc.addEventListener("click", () => set((parseFloat(input.value) || 0) + step));
    });
  }

  /* ───────────────────────── Slider (값 출력 + 트랙 채움) ───────────────────────── */
  function bindSliders() {
    $$(".slider").forEach((sl) => {
      const input = $('input[type="range"]', sl);
      const out = $("[data-slider-value]", sl) || (sl.getAttribute("data-output") && document.getElementById(sl.getAttribute("data-output")));
      const fmt = sl.getAttribute("data-format") || "{v}";
      const upd = () => {
        if (out) out.textContent = fmt.replace("{v}", input.value);
        const pct = ((input.value - input.min) / (input.max - input.min)) * 100;
        input.style.background = "linear-gradient(90deg, var(--color-primary) " + pct + "%, var(--color-border-strong) " + pct + "%)";
      };
      input.addEventListener("input", upd); upd();
    });
  }

  /* ───────────────────────── Rating (radiogroup + 방향키 + aria-checked) ───────────────────────── */
  function bindRating() {
    $$(".rating").forEach((r) => {
      if (r.classList.contains("rating--readonly")) return;
      const stars = $$("button", r);
      const hidden = $("input", r);
      let value = parseInt(r.getAttribute("data-value") || "0", 10);
      const isRadio = stars.some((s) => s.getAttribute("role") === "radio");
      function paint(n) { stars.forEach((s, i) => s.classList.toggle("is-on", i < n)); }
      function syncAria() {
        stars.forEach((s, i) => {
          if (isRadio) s.setAttribute("aria-checked", String(i + 1 === value));
          s.tabIndex = (i + 1 === (value || 1)) ? 0 : -1;
        });
      }
      function commit(n) { value = n; if (hidden) hidden.value = value; r.setAttribute("data-value", value); paint(value); syncAria(); }
      stars.forEach((s, i) => {
        s.addEventListener("mouseenter", () => paint(i + 1));
        s.addEventListener("focus", () => paint(i + 1));
        s.addEventListener("click", () => commit(i + 1));
        s.addEventListener("keydown", (e) => {
          let n = null;
          if (e.key === "ArrowRight" || e.key === "ArrowUp") n = Math.min(stars.length, (value || 0) + 1);
          else if (e.key === "ArrowLeft" || e.key === "ArrowDown") n = Math.max(1, (value || 1) - 1);
          if (n !== null) { e.preventDefault(); commit(n); stars[n - 1].focus(); }
        });
      });
      r.addEventListener("mouseleave", () => paint(value));
      paint(value); syncAria();
    });
  }

  /* ───────────────────────── ChipInput ───────────────────────── */
  function bindChipInput() {
    $$(".chipinput").forEach((ci) => {
      const input = $("input", ci);
      function addChip(text) {
        text = text.trim(); if (!text) return;
        const chip = document.createElement("span");
        chip.className = "chip";
        chip.innerHTML = text.replace(/</g, "&lt;") + ' <button type="button" aria-label="제거"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:.8rem;height:.8rem"><path d="M18 6L6 18M6 6l12 12"/></svg></button>';
        $("button", chip).addEventListener("click", () => chip.remove());
        ci.insertBefore(chip, input);
      }
      input.addEventListener("keydown", (e) => {
        if ((e.key === "Enter" || e.key === ",") && input.value.trim()) { e.preventDefault(); addChip(input.value); input.value = ""; }
        else if (e.key === "Backspace" && !input.value) { const chips = $$(".chip", ci); if (chips.length) chips[chips.length - 1].remove(); }
      });
    });
  }

  /* ───────────────────────── Combobox / Autocomplete ───────────────────────── */
  function bindCombobox() {
    $$("[data-combobox]").forEach((cb) => {
      const input = $("input", cb);
      const list = $(".combobox__list", cb);
      if (!input || !list) return;
      const options = $$(".combobox__option", list);
      const open = () => { list.hidden = false; };
      const close = () => { list.hidden = true; };
      input.addEventListener("focus", open);
      input.addEventListener("input", () => {
        const q = input.value.toLowerCase();
        let any = false;
        options.forEach((o) => { const m = o.textContent.toLowerCase().includes(q); o.hidden = !m; if (m) any = true; });
        list.hidden = !any; if (any) open();
      });
      options.forEach((o) => o.addEventListener("click", () => { input.value = o.getAttribute("data-value") || o.textContent.trim(); close(); }));
      input.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
      document.addEventListener("click", (e) => { if (!cb.contains(e.target)) close(); });
      close();
    });
  }

  /* ───────────────────────── FileUpload ───────────────────────── */
  function bindFileUpload() {
    $$(".fileupload").forEach((fu) => {
      const input = $('input[type="file"]', fu);
      const list = fu.parentElement.querySelector(".filelist") || (function () { const l = document.createElement("div"); l.className = "filelist"; fu.after(l); return l; })();
      fu.addEventListener("click", () => input.click());
      fu.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); input.click(); } });
      ["dragover", "dragenter"].forEach((ev) => fu.addEventListener(ev, (e) => { e.preventDefault(); fu.classList.add("is-dragover"); }));
      ["dragleave", "drop"].forEach((ev) => fu.addEventListener(ev, () => fu.classList.remove("is-dragover")));
      fu.addEventListener("drop", (e) => { e.preventDefault(); render(e.dataTransfer.files); });
      input.addEventListener("change", () => render(input.files));
      function render(files) {
        Array.from(files).forEach((f) => {
          const item = document.createElement("div");
          item.className = "filelist__item";
          item.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:1rem;height:1rem;color:var(--color-primary)"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/></svg><span style="flex:1">' + f.name + '</span><span class="cell-sub">' + (f.size / 1024).toFixed(0) + " KB</span>";
          list.appendChild(item);
        });
      }
    });
  }

  /* ───────────────────────── SearchBar clear ───────────────────────── */
  function bindSearchClear() {
    $$(".searchbar").forEach((sb) => {
      const input = $(".input", sb), clear = $(".searchbar__clear", sb);
      if (!clear) return;
      const upd = () => clear.style.display = input.value ? "inline-flex" : "none";
      clear.addEventListener("click", () => { input.value = ""; upd(); input.focus(); });
      input.addEventListener("input", upd); upd();
    });
  }

  /* ───────────────────────── Carousel ───────────────────────── */
  function bindCarousel() {
    $$("[data-carousel]").forEach((c) => {
      const track = $(".carousel__track", c);
      const slides = $$(".carousel__slide", c);
      const dotsWrap = $(".carousel__dots", c);
      let idx = 0;
      if (dotsWrap) slides.forEach((_, i) => { const d = document.createElement("button"); d.className = "carousel__dot" + (i === 0 ? " is-active" : ""); d.setAttribute("aria-label", "슬라이드 " + (i + 1)); d.addEventListener("click", () => go(i)); dotsWrap.appendChild(d); });
      const dots = dotsWrap ? $$(".carousel__dot", dotsWrap) : [];
      function go(i) { idx = (i + slides.length) % slides.length; track.style.transform = "translateX(-" + idx * 100 + "%)"; dots.forEach((d, j) => d.classList.toggle("is-active", j === idx)); }
      $("[data-carousel-prev]", c) && $("[data-carousel-prev]", c).addEventListener("click", () => go(idx - 1));
      $("[data-carousel-next]", c) && $("[data-carousel-next]", c).addEventListener("click", () => go(idx + 1));
      go(0);
    });
  }

  /* ───────────────────────── Kanban (drag & drop) ───────────────────────── */
  function bindKanban() {
    const board = $("[data-kanban]");
    if (!board) return;
    let dragged = null;
    $$(".kanban-card", board).forEach(makeDraggable);
    function makeDraggable(card) {
      card.setAttribute("draggable", "true");
      card.addEventListener("dragstart", () => { dragged = card; setTimeout(() => card.classList.add("dragging"), 0); });
      card.addEventListener("dragend", () => { card.classList.remove("dragging"); dragged = null; updateCounts(); });
    }
    $$(".kanban__list", board).forEach((list) => {
      list.addEventListener("dragover", (e) => {
        e.preventDefault();
        list.classList.add("drag-target");
        const after = getAfter(list, e.clientY);
        if (!dragged) return;
        if (after == null) list.appendChild(dragged);
        else list.insertBefore(dragged, after);
      });
      list.addEventListener("dragleave", () => list.classList.remove("drag-target"));
      list.addEventListener("drop", (e) => { e.preventDefault(); list.classList.remove("drag-target"); updateCounts(); });
    });
    function getAfter(list, y) {
      const els = $$(".kanban-card:not(.dragging)", list);
      return els.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) return { offset, element: child };
        return closest;
      }, { offset: -Infinity }).element || null;
    }
    function updateCounts() {
      $$(".kanban__col", board).forEach((col) => {
        const count = $$(".kanban-card", col).length;
        const el = $(".kanban__col-count", col);
        if (el) el.textContent = count;
      });
    }
    updateCounts();
  }

  /* ───────────────────────── Table sort ───────────────────────── */
  function bindTableSort() {
    $$("table[data-sortable]").forEach((table) => {
      const tbody = $("tbody", table);
      $$("th.sortable", table).forEach((th, colIndex) => {
        const realIndex = Array.from(th.parentElement.children).indexOf(th);
        // 키보드 조작 가능하게 (마우스 전용 정렬 금지 §4-4)
        if (!th.hasAttribute("tabindex")) th.setAttribute("tabindex", "0");
        th.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") { e.preventDefault(); th.click(); }
        });
        th.addEventListener("click", () => {
          const cur = th.getAttribute("aria-sort");
          const dir = cur === "ascending" ? "descending" : "ascending";
          $$("th.sortable", table).forEach((o) => o.removeAttribute("aria-sort"));
          th.setAttribute("aria-sort", dir);
          const rows = $$("tr", tbody);
          const type = th.getAttribute("data-type") || "text";
          rows.sort((a, b) => {
            let av = a.children[realIndex].getAttribute("data-sort") || a.children[realIndex].textContent.trim();
            let bv = b.children[realIndex].getAttribute("data-sort") || b.children[realIndex].textContent.trim();
            if (type === "number") { av = parseFloat(av.replace(/[^0-9.-]/g, "")) || 0; bv = parseFloat(bv.replace(/[^0-9.-]/g, "")) || 0; }
            if (av < bv) return dir === "ascending" ? -1 : 1;
            if (av > bv) return dir === "ascending" ? 1 : -1;
            return 0;
          });
          rows.forEach((r) => tbody.appendChild(r));
        });
      });
    });
  }

  /* ───────────────────────── Table select + check-all ───────────────────────── */
  function bindTableSelect() {
    $$("table[data-selectable]").forEach((table) => {
      const all = $('thead input[type="checkbox"]', table);
      const boxes = $$('tbody input[type="checkbox"]', table);
      function sync() {
        boxes.forEach((b) => b.closest("tr").setAttribute("aria-selected", String(b.checked)));
        if (all) {
          const checked = boxes.filter((b) => b.checked).length;
          all.checked = checked === boxes.length && boxes.length > 0;
          all.indeterminate = checked > 0 && checked < boxes.length;
        }
        const bar = table.closest("[data-table-root]")?.querySelector("[data-selected-count]");
        if (bar) bar.textContent = boxes.filter((b) => b.checked).length;
      }
      if (all) all.addEventListener("change", () => { boxes.forEach((b) => (b.checked = all.checked)); sync(); });
      boxes.forEach((b) => b.addEventListener("change", sync));
      sync();
    });
  }

  /* 일반 "전체 선택" 체크박스 (data-check-all="container") */
  function bindCheckAll() {
    $$("[data-check-all]").forEach((master) => {
      const scope = document.getElementById(master.getAttribute("data-check-all"));
      if (!scope) return;
      const boxes = $$('input[type="checkbox"]', scope);
      master.addEventListener("change", () => boxes.forEach((b) => (b.checked = master.checked)));
    });
  }

  /* ───────────────────────── Pricing 월/연 토글 ───────────────────────── */
  function bindPricingToggle() {
    $$("[data-pricing-toggle]").forEach((toggle) => {
      const input = toggle.matches("input") ? toggle : $("input", toggle);
      const upd = () => {
        const annual = input.checked;
        $$("[data-price-monthly]").forEach((e) => e.toggleAttribute("hidden", annual));
        $$("[data-price-annual]").forEach((e) => e.toggleAttribute("hidden", !annual));
      };
      input.addEventListener("change", upd); upd();
    });
  }

  /* ───────────────────────── Context menu ───────────────────────── */
  function bindContextMenu() {
    $$("[data-context-menu]").forEach((zone) => {
      const menu = document.getElementById(zone.getAttribute("data-context-menu"));
      if (!menu) return;
      zone.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        menu.classList.add("is-open");
        const w = menu.offsetWidth, h = menu.offsetHeight;
        menu.style.left = Math.min(e.clientX, window.innerWidth - w - 8) + "px";
        menu.style.top = Math.min(e.clientY, window.innerHeight - h - 8) + "px";
      });
      document.addEventListener("click", () => menu.classList.remove("is-open"));
      document.addEventListener("scroll", () => menu.classList.remove("is-open"), true);
    });
  }

  /* ───────────────────────── Copy buttons ───────────────────────── */
  function bindCopyButtons() {
    $$("[data-copy]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const text = btn.getAttribute("data-copy");
        const done = () => toast({ type: "success", title: "복사됨", text: text });
        if (navigator.clipboard) navigator.clipboard.writeText(text).then(done).catch(done);
        else done();
      });
    });
  }

  /* ───────────────────────── Reveal on scroll ───────────────────────── */
  function bindRevealOnScroll() {
    const els = $$("[data-reveal]");
    if (!els.length || !("IntersectionObserver" in window)) { els.forEach((e) => e.classList.add("reveal")); return; }
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("reveal"); obs.unobserve(en.target); } });
    }, { threshold: 0.12 });
    els.forEach((e) => obs.observe(e));
  }

  /* ───────────────────────── Back to top ───────────────────────── */
  function bindBackToTop() {
    const btn = $("[data-back-to-top]");
    if (!btn) return;
    const upd = () => {
      const vis = window.scrollY > 600;
      btn.style.opacity = vis ? "1" : "0";
      btn.style.visibility = vis ? "visible" : "hidden";
    };
    window.addEventListener("scroll", upd, { passive: true });
    btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
    upd();
  }

  /* ───────────────────────── Reading progress ───────────────────────── */
  function bindReadingProgress() {
    const bar = $("[data-reading-progress]");
    if (!bar) return;
    const upd = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + "%";
    };
    window.addEventListener("scroll", upd, { passive: true });
    window.addEventListener("resize", upd);
    upd();
  }

  /* ───────────────────────── 연도 자동 ───────────────────────── */
  function setYear() { $$("[data-year]").forEach((e) => (e.textContent = new Date().getFullYear())); }
})();
