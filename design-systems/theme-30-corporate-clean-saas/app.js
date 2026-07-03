/* ============================================================================
   theme-30 · Corporate Clean SaaS — APP.JS
   바닐라 JS. 외부 의존성 0. 모든 인터랙션 + 테마 전환.
   각 모듈은 페이지에 해당 마크업이 없으면 조용히 no-op.
   접근성: focus trap, ESC 닫기, ARIA 상태 토글, 키보드 내비게이션.
   ============================================================================ */
(function () {
  "use strict";

  /* ───────────── 유틸 ───────────── */
  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const on = (el, ev, fn, opt) => el && el.addEventListener(ev, fn, opt);

  /* ───────────── 1. THEME (라이트/다크 전환 + 영속) ───────────── */
  const ThemeManager = {
    KEY: "theme30-color-mode",
    init() {
      const saved = (() => { try { return localStorage.getItem(this.KEY); } catch (e) { return null; } })();
      if (saved) document.documentElement.setAttribute("data-theme", saved);
      this.sync();
      $$("[data-theme-toggle]").forEach((btn) => on(btn, "click", () => this.toggle()));
    },
    current() {
      const attr = document.documentElement.getAttribute("data-theme");
      if (attr) return attr;
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    },
    toggle() {
      const next = this.current() === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      try { localStorage.setItem(this.KEY, next); } catch (e) {}
      this.sync();
    },
    sync() {
      const isDark = this.current() === "dark";
      $$("[data-theme-toggle]").forEach((btn) => {
        btn.setAttribute("aria-pressed", String(isDark));
        const sun = $(".icon-sun", btn), moon = $(".icon-moon", btn);
        if (sun)  sun.style.display  = isDark ? "none" : "";
        if (moon) moon.style.display = isDark ? "" : "none";
      });
    },
  };

  /* ───────────── 2. focus trap 헬퍼 ───────────── */
  const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';
  function trapFocus(container, e) {
    const nodes = $$(FOCUSABLE, container).filter((n) => n.offsetParent !== null);
    if (!nodes.length) return;
    const first = nodes[0], last = nodes[nodes.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  /* ───────────── 3. MODAL / DIALOG ───────────── */
  const Modal = {
    last: null,
    init() {
      $$("[data-modal-open]").forEach((t) => on(t, "click", () => this.open(t.getAttribute("data-modal-open"))));
      $$(".overlay").forEach((ov) => {
        on(ov, "click", (e) => { if (e.target === ov) this.close(ov); });
        $$("[data-modal-close]", ov).forEach((c) => on(c, "click", () => this.close(ov)));
        on(ov, "keydown", (e) => {
          if (e.key === "Escape") this.close(ov);
          if (e.key === "Tab") trapFocus(ov, e);
        });
      });
    },
    open(id) {
      const ov = document.getElementById(id);
      if (!ov) return;
      this.last = document.activeElement;
      ov.classList.add("is-open");
      ov.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      const f = $(FOCUSABLE, ov); if (f) setTimeout(() => f.focus(), 50);
    },
    close(ov) {
      if (typeof ov === "string") ov = document.getElementById(ov);
      if (!ov) return;
      ov.classList.remove("is-open");
      ov.setAttribute("aria-hidden", "true");
      if (!$$(".overlay.is-open, .drawer-overlay.is-open").length) document.body.style.overflow = "";
      if (this.last) { this.last.focus(); this.last = null; }
    },
  };

  /* ───────────── 4. DRAWER ───────────── */
  const Drawer = {
    init() {
      $$("[data-drawer-open]").forEach((t) => on(t, "click", () => this.open(t.getAttribute("data-drawer-open"))));
      $$(".drawer-overlay").forEach((ov) => {
        on(ov, "click", (e) => { if (e.target === ov) this.close(ov); });
        on(ov, "keydown", (e) => { if (e.key === "Escape") this.close(ov); if (e.key === "Tab") trapFocus(ov, e); });
        $$("[data-drawer-close]", ov).forEach((c) => on(c, "click", () => this.close(ov)));
      });
    },
    open(id) {
      const ov = document.getElementById(id); if (!ov) return;
      ov.classList.add("is-open");
      const dr = $(".drawer", ov); if (dr) dr.classList.add("is-open");
      ov.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      const f = $(FOCUSABLE, ov); if (f) setTimeout(() => f.focus(), 60);
    },
    close(ov) {
      if (typeof ov === "string") ov = document.getElementById(ov);
      if (!ov) return;
      ov.classList.remove("is-open");
      const dr = $(".drawer", ov); if (dr) dr.classList.remove("is-open");
      ov.setAttribute("aria-hidden", "true");
      if (!$$(".overlay.is-open, .drawer-overlay.is-open").length) document.body.style.overflow = "";
    },
  };

  /* ───────────── 5. TOAST ───────────── */
  const Toast = {
    region: null,
    ensure() {
      if (this.region && document.body.contains(this.region)) return this.region;
      let r = $(".toast-region");
      if (!r) { r = document.createElement("div"); r.className = "toast-region"; r.setAttribute("role", "region"); r.setAttribute("aria-label", "알림"); document.body.appendChild(r); }
      this.region = r; return r;
    },
    icons: {
      success: '<path d="M20 6 9 17l-5-5"/>',
      danger:  '<circle cx="12" cy="12" r="10"/><path d="m15 9-6 6M9 9l6 6"/>',
      warning: '<path d="m10.29 3.86-8.47 14.14A2 2 0 0 0 3.53 21h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><path d="M12 9v4M12 17h.01"/>',
      info:    '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>',
    },
    show(opts) {
      const o = Object.assign({ type: "info", title: "", text: "", duration: 4000 }, typeof opts === "string" ? { title: opts } : opts);
      const r = this.ensure();
      const el = document.createElement("div");
      el.className = "toast " + o.type;
      el.setAttribute("role", o.type === "danger" ? "alert" : "status");
      el.innerHTML =
        '<svg class="toast-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + (this.icons[o.type] || this.icons.info) + '</svg>' +
        '<div class="toast-body"><div class="toast-title">' + esc(o.title) + '</div>' + (o.text ? '<div class="toast-text">' + esc(o.text) + '</div>' : '') + '</div>' +
        '<button class="toast-close" aria-label="닫기"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg></button>' +
        (o.duration ? '<div class="toast-progress" style="animation-duration:' + o.duration + 'ms"></div>' : '');
      r.appendChild(el);
      const close = () => { el.classList.add("is-leaving"); setTimeout(() => el.remove(), 220); };
      on($(".toast-close", el), "click", close);
      if (o.duration) setTimeout(close, o.duration);
      return el;
    },
  };

  /* ───────────── 6. TABS ───────────── */
  function initTabs() {
    $$("[data-tabs]").forEach((group) => {
      const tabs = $$('[role="tab"]', group);
      const select = (tab) => {
        tabs.forEach((t) => {
          const sel = t === tab;
          t.setAttribute("aria-selected", String(sel));
          t.tabIndex = sel ? 0 : -1;
          const panel = document.getElementById(t.getAttribute("aria-controls"));
          if (panel) panel.hidden = !sel;
        });
      };
      tabs.forEach((tab, i) => {
        on(tab, "click", () => select(tab));
        on(tab, "keydown", (e) => {
          let idx = null;
          if (e.key === "ArrowRight") idx = (i + 1) % tabs.length;
          else if (e.key === "ArrowLeft") idx = (i - 1 + tabs.length) % tabs.length;
          else if (e.key === "Home") idx = 0;
          else if (e.key === "End") idx = tabs.length - 1;
          if (idx !== null) { e.preventDefault(); tabs[idx].focus(); select(tabs[idx]); }
        });
      });
    });
  }

  /* ───────────── 7. ACCORDION ───────────── */
  function initAccordion() {
    $$(".accordion-trigger").forEach((trg) => {
      on(trg, "click", () => {
        const expanded = trg.getAttribute("aria-expanded") === "true";
        const panel = document.getElementById(trg.getAttribute("aria-controls"));
        const single = trg.closest("[data-accordion-single]");
        if (single && !expanded) {
          $$(".accordion-trigger", single).forEach((o) => {
            if (o !== trg) { o.setAttribute("aria-expanded", "false"); const p = document.getElementById(o.getAttribute("aria-controls")); if (p) p.setAttribute("data-open", "false"); }
          });
        }
        trg.setAttribute("aria-expanded", String(!expanded));
        if (panel) panel.setAttribute("data-open", String(!expanded));
      });
    });
  }

  /* ───────────── 8. DROPDOWN / MENU / POPOVER ───────────── */
  function initDropdowns() {
    const closeAll = (except) => $$(".dropdown.is-open, .popover.is-open").forEach((d) => { if (d !== except) { d.classList.remove("is-open"); const t = $('[aria-haspopup]', d); if (t) t.setAttribute("aria-expanded", "false"); } });
    $$("[data-dropdown]").forEach((dd) => {
      const trg = $('[aria-haspopup], .dropdown-trigger', dd) || dd.firstElementChild;
      on(trg, "click", (e) => {
        e.stopPropagation();
        const open = dd.classList.contains("is-open");
        closeAll(dd);
        dd.classList.toggle("is-open", !open);
        if (trg.hasAttribute("aria-haspopup")) trg.setAttribute("aria-expanded", String(!open));
        if (!open) { const f = $(".menu-item", dd); if (f) setTimeout(() => f.focus && f.focus(), 30); }
      });
      on(dd, "keydown", (e) => { if (e.key === "Escape") { dd.classList.remove("is-open"); trg.focus(); } });
    });
    on(document, "click", () => closeAll());
  }

  /* ───────────── 9. SIDEBAR collapse + nested + mobile ───────────── */
  function initSidebar() {
    $$("[data-sidebar-toggle]").forEach((btn) => on(btn, "click", () => {
      const sb = $(".sidebar"); if (!sb) return;
      if (window.innerWidth <= 768) sb.classList.toggle("is-mobile-open");
      else sb.classList.toggle("is-collapsed");
    }));
    $$(".nav-group-toggle").forEach((tg) => on(tg, "click", () => {
      const grp = tg.closest(".nav-group");
      const open = grp.classList.toggle("is-open");
      tg.setAttribute("aria-expanded", String(open));
    }));
  }

  /* ───────────── 10. TABLE — 정렬 / 선택 / 필터 ───────────── */
  function initTables() {
    $$("table[data-sortable]").forEach((table) => {
      const tbody = $("tbody", table);
      $$("th.sortable", table).forEach((th, colIndex) => {
        const realIndex = Array.from(th.parentNode.children).indexOf(th);
        on(th, "click", () => {
          const cur = th.getAttribute("aria-sort");
          const dir = cur === "ascending" ? "descending" : "ascending";
          $$("th.sortable", table).forEach((o) => { o.removeAttribute("aria-sort"); const i = $(".sort-ico", o); if (i) i.innerHTML = sortIcon("none"); });
          th.setAttribute("aria-sort", dir);
          const i = $(".sort-ico", th); if (i) i.innerHTML = sortIcon(dir);
          const rows = $$("tr", tbody);
          const type = th.getAttribute("data-type") || "string";
          rows.sort((a, b) => {
            let av = cellVal(a.children[realIndex]), bv = cellVal(b.children[realIndex]);
            if (type === "number") { av = parseFloat(av.replace(/[^0-9.-]/g, "")) || 0; bv = parseFloat(bv.replace(/[^0-9.-]/g, "")) || 0; }
            if (av < bv) return dir === "ascending" ? -1 : 1;
            if (av > bv) return dir === "ascending" ? 1 : -1;
            return 0;
          });
          rows.forEach((r) => tbody.appendChild(r));
        });
      });
    });

    // 행 선택 (전체/개별)
    $$("table[data-selectable]").forEach((table) => {
      const all = $('thead input[type="checkbox"]', table);
      const boxes = $$('tbody input[type="checkbox"]', table);
      const sync = () => {
        const checked = boxes.filter((b) => b.checked).length;
        if (all) { all.checked = checked === boxes.length && boxes.length > 0; all.indeterminate = checked > 0 && checked < boxes.length; }
        boxes.forEach((b) => b.closest("tr").classList.toggle("is-selected", b.checked));
        const bar = $("[data-selection-bar]"); const cnt = $("[data-selection-count]");
        if (bar) bar.style.display = checked ? "" : "none";
        if (cnt) cnt.textContent = checked;
      };
      if (all) on(all, "change", () => { boxes.forEach((b) => (b.checked = all.checked)); sync(); });
      boxes.forEach((b) => on(b, "change", sync));
    });

    // 필터 (텍스트 검색)
    $$("[data-table-filter]").forEach((input) => {
      const table = document.getElementById(input.getAttribute("data-table-filter"));
      if (!table) return;
      on(input, "input", () => {
        const q = input.value.trim().toLowerCase();
        const empty = table.parentNode.querySelector("[data-empty-row]");
        let visible = 0;
        $$("tbody tr", table).forEach((r) => {
          if (r.hasAttribute("data-empty-row")) return;
          const match = r.textContent.toLowerCase().includes(q);
          r.style.display = match ? "" : "none";
          if (match) visible++;
        });
        if (empty) empty.style.display = visible === 0 ? "" : "none";
      });
    });
  }
  function cellVal(td) { return (td.getAttribute("data-sort") || td.textContent).trim(); }
  function sortIcon(dir) {
    if (dir === "ascending") return '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m18 15-6-6-6 6"/></svg>';
    if (dir === "descending") return '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m6 9 6 6 6-6"/></svg>';
    return '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><path d="m8 9 4-4 4 4M8 15l4 4 4-4"/></svg>';
  }

  /* ───────────── 11. COMMAND PALETTE (⌘K) ───────────── */
  const CommandPalette = {
    el: null, input: null, list: null, items: [], active: 0,
    init() {
      this.el = $("#cmdk"); if (!this.el) return;
      this.input = $(".cmdk-search input", this.el);
      this.list = $(".cmdk-list", this.el);
      this.allItems = $$(".cmdk-item", this.el).map((n) => ({ node: n, text: (n.getAttribute("data-keywords") || n.textContent).toLowerCase() }));
      on(document, "keydown", (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); this.toggle(); }
        if (e.key === "Escape" && this.el.classList.contains("is-open")) this.close();
      });
      $$("[data-cmdk-open]").forEach((b) => on(b, "click", () => this.open()));
      on(this.el, "click", (e) => { if (e.target === this.el) this.close(); });
      on(this.input, "input", () => this.filter());
      on(this.input, "keydown", (e) => this.nav(e));
      $$(".cmdk-item", this.el).forEach((it, i) => {
        on(it, "click", () => this.run(it));
        on(it, "mousemove", () => this.setActive(i));
      });
    },
    toggle() { this.el.classList.contains("is-open") ? this.close() : this.open(); },
    open() { this.el.classList.add("is-open"); this.el.setAttribute("aria-hidden", "false"); document.body.style.overflow = "hidden"; this.input.value = ""; this.filter(); setTimeout(() => this.input.focus(), 50); },
    close() { this.el.classList.remove("is-open"); this.el.setAttribute("aria-hidden", "true"); if (!$$(".overlay.is-open").length) document.body.style.overflow = ""; },
    filter() {
      const q = this.input.value.trim().toLowerCase();
      this.visible = [];
      this.allItems.forEach((it) => {
        const show = !q || it.text.includes(q);
        it.node.style.display = show ? "" : "none";
        if (show) this.visible.push(it.node);
      });
      $$(".cmdk-group-label", this.el).forEach((g) => {
        let sib = g.nextElementSibling, any = false;
        while (sib && sib.classList.contains("cmdk-item")) { if (sib.style.display !== "none") any = true; sib = sib.nextElementSibling; }
        g.style.display = any ? "" : "none";
      });
      const empty = $(".cmdk-empty", this.el); if (empty) empty.style.display = this.visible.length ? "none" : "";
      this.active = 0; this.paint();
    },
    setActive(i) { const vi = this.visible.indexOf($$(".cmdk-item", this.el)[i]); if (vi >= 0) { this.active = vi; this.paint(); } },
    nav(e) {
      if (e.key === "ArrowDown") { e.preventDefault(); this.active = Math.min(this.active + 1, this.visible.length - 1); this.paint(true); }
      else if (e.key === "ArrowUp") { e.preventDefault(); this.active = Math.max(this.active - 1, 0); this.paint(true); }
      else if (e.key === "Enter") { e.preventDefault(); if (this.visible[this.active]) this.run(this.visible[this.active]); }
    },
    paint(scroll) {
      this.visible.forEach((n, i) => n.classList.toggle("is-active", i === this.active));
      if (scroll && this.visible[this.active]) this.visible[this.active].scrollIntoView({ block: "nearest" });
    },
    run(node) {
      const action = node.getAttribute("data-action");
      const href = node.getAttribute("data-href");
      this.close();
      if (action === "toggle-theme") ThemeManager.toggle();
      else if (action === "toast") Toast.show({ type: "success", title: "명령 실행됨", text: node.textContent.trim() });
      else if (href) window.location.href = href;
      else Toast.show({ type: "info", title: node.textContent.trim().split("\n")[0] });
    },
  };

  /* ───────────── 12. TOGGLE / SWITCH aria + 가격표 toggle ───────────── */
  function initToggles() {
    $$('[data-billing-toggle]').forEach((t) => {
      on(t, "change", () => {
        const annual = t.checked;
        $$("[data-price]").forEach((p) => {
          p.textContent = annual ? p.getAttribute("data-price-annual") : p.getAttribute("data-price-monthly");
        });
        $$("[data-price-note]").forEach((n) => n.textContent = annual ? "연간 결제 / 월 환산" : "월간 결제");
      });
    });
  }

  /* ───────────── 13. STEPPER (수량) ───────────── */
  function initSteppers() {
    $$(".stepper").forEach((s) => {
      const input = $("input", s); const [dec, inc] = $$("button", s);
      const clamp = (v) => { const min = +(input.min || -Infinity), max = +(input.max || Infinity); return Math.max(min, Math.min(max, v)); };
      on(dec, "click", () => { input.value = clamp((+input.value || 0) - 1); });
      on(inc, "click", () => { input.value = clamp((+input.value || 0) + 1); });
    });
  }

  /* ───────────── 14. RATING ───────────── */
  function initRatings() {
    $$(".rating:not(.is-readonly)").forEach((r) => {
      const stars = $$("button", r);
      const setVal = (v) => { stars.forEach((s, i) => { s.classList.toggle("is-on", i < v); s.setAttribute("aria-checked", String(i + 1 === v)); }); r.setAttribute("data-value", v); };
      stars.forEach((s, i) => {
        on(s, "click", () => setVal(i + 1));
        on(s, "mouseenter", () => stars.forEach((x, j) => x.classList.toggle("is-on", j <= i)));
      });
      on(r, "mouseleave", () => setVal(+(r.getAttribute("data-value") || 0)));
    });
  }

  /* ───────────── 15. CHIP INPUT ───────────── */
  function initChipInputs() {
    $$(".chip-input").forEach((ci) => {
      const input = $("input", ci);
      const add = (label) => {
        if (!label.trim()) return;
        const chip = document.createElement("span"); chip.className = "chip";
        chip.innerHTML = esc(label.trim()) + '<button type="button" aria-label="제거"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg></button>';
        on($("button", chip), "click", () => chip.remove());
        ci.insertBefore(chip, input);
      };
      on(input, "keydown", (e) => {
        if ((e.key === "Enter" || e.key === ",") && input.value.trim()) { e.preventDefault(); add(input.value); input.value = ""; }
        else if (e.key === "Backspace" && !input.value) { const chips = $$(".chip", ci); if (chips.length) chips[chips.length - 1].remove(); }
      });
      $$(".chip button", ci).forEach((b) => on(b, "click", () => b.closest(".chip").remove()));
    });
  }

  /* ───────────── 16. COMBOBOX / MULTISELECT ───────────── */
  function initComboboxes() {
    $$("[data-combobox]").forEach((cb) => {
      const trg = $(".combo-trigger", cb) || cb.firstElementChild;
      const menu = $(".combo-menu", cb);
      if (!menu) return;
      menu.style.display = "none";
      const openClose = (open) => { menu.style.display = open ? "" : "none"; if (trg.setAttribute) trg.setAttribute("aria-expanded", String(open)); };
      on(trg, "click", (e) => { e.stopPropagation(); openClose(menu.style.display === "none"); });
      $$(".combo-option", menu).forEach((opt) => on(opt, "click", (e) => {
        e.stopPropagation();
        const multi = cb.hasAttribute("data-multi");
        if (multi) { opt.setAttribute("aria-selected", opt.getAttribute("aria-selected") === "true" ? "false" : "true"); }
        else { $$(".combo-option", menu).forEach((o) => o.setAttribute("aria-selected", "false")); opt.setAttribute("aria-selected", "true"); const lbl = $(".combo-value", cb); if (lbl) lbl.textContent = opt.textContent.trim(); openClose(false); }
      }));
      on(document, "click", () => openClose(false));
    });
  }

  /* ───────────── 17. PASSWORD reveal ───────────── */
  function initPasswordReveal() {
    $$("[data-toggle-password]").forEach((btn) => on(btn, "click", () => {
      const input = document.getElementById(btn.getAttribute("data-toggle-password"));
      if (!input) return;
      input.type = input.type === "password" ? "text" : "password";
      btn.setAttribute("aria-pressed", String(input.type === "text"));
    }));
  }

  /* ───────────── 18. COPY to clipboard ───────────── */
  function initCopy() {
    $$("[data-copy]").forEach((btn) => on(btn, "click", () => {
      const text = btn.getAttribute("data-copy");
      const done = () => Toast.show({ type: "success", title: "복사됨", text: text.length > 40 ? text.slice(0, 40) + "…" : text, duration: 2000 });
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done).catch(done);
      else done();
    }));
  }

  /* ───────────── 19. CAROUSEL ───────────── */
  function initCarousels() {
    $$("[data-carousel]").forEach((c) => {
      const track = $(".carousel-track", c);
      const slides = $$(".carousel-slide", track);
      const dotsWrap = $(".carousel-dots", c);
      let idx = 0;
      const go = (i) => {
        idx = (i + slides.length) % slides.length;
        track.style.transform = "translateX(-" + idx * 100 + "%)";
        if (dotsWrap) $$("button", dotsWrap).forEach((d, j) => d.classList.toggle("is-active", j === idx));
      };
      if (dotsWrap) { dotsWrap.innerHTML = slides.map((_, i) => '<button aria-label="슬라이드 ' + (i + 1) + '"></button>').join(""); $$("button", dotsWrap).forEach((d, i) => on(d, "click", () => go(i))); }
      on($(".carousel-arrow.prev", c), "click", () => go(idx - 1));
      on($(".carousel-arrow.next", c), "click", () => go(idx + 1));
      go(0);
    });
  }

  /* ───────────── 20. SCROLLSPY (페이지 내 섹션 강조) ───────────── */
  function initScrollSpy() {
    const links = $$("[data-spy]");
    if (!links.length || !("IntersectionObserver" in window)) return;
    const map = new Map();
    links.forEach((l) => { const t = document.getElementById(l.getAttribute("data-spy")); if (t) map.set(t, l); });
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { links.forEach((l) => l.classList.remove("is-active")); const l = map.get(en.target); if (l) l.classList.add("is-active"); } });
    }, { rootMargin: "-40% 0px -55% 0px" });
    map.forEach((_, t) => obs.observe(t));
  }

  /* ───────────── 21. REVEAL on scroll ───────────── */
  function initReveal() {
    const els = $$("[data-reveal]");
    if (!els.length) return;
    if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) { els.forEach((e) => e.classList.add("is-visible")); return; }
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("animate-in"); obs.unobserve(en.target); } });
    }, { threshold: 0.12 });
    els.forEach((e) => obs.observe(e));
  }

  /* ───────────── 22. KANBAN drag & drop ───────────── */
  function initKanban() {
    let dragged = null;
    $$(".kanban-card").forEach((card) => {
      card.setAttribute("draggable", "true");
      on(card, "dragstart", () => { dragged = card; setTimeout(() => card.classList.add("dragging"), 0); });
      on(card, "dragend", () => { card.classList.remove("dragging"); dragged = null; updateCounts(); });
    });
    $$("[data-kanban-list]").forEach((list) => {
      on(list, "dragover", (e) => {
        e.preventDefault();
        const after = getAfter(list, e.clientY);
        if (!dragged) return;
        if (after == null) list.appendChild(dragged); else list.insertBefore(dragged, after);
      });
    });
    function getAfter(list, y) {
      const els = $$(".kanban-card:not(.dragging)", list);
      return els.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) return { offset, element: child };
        return closest;
      }, { offset: -Infinity, element: null }).element;
    }
    function updateCounts() {
      $$("[data-kanban-list]").forEach((list) => {
        const col = list.closest(".kanban-col"); if (!col) return;
        const cnt = $(".kc-count", col); if (cnt) cnt.textContent = $$(".kanban-card", list).length;
      });
    }
  }

  /* ───────────── helpers ───────────── */
  function esc(s) { return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); }

  /* ───────────── BOOT ───────────── */
  function boot() {
    ThemeManager.init();
    Modal.init();
    Drawer.init();
    initTabs();
    initAccordion();
    initDropdowns();
    initSidebar();
    initTables();
    CommandPalette.init();
    initToggles();
    initSteppers();
    initRatings();
    initChipInputs();
    initComboboxes();
    initPasswordReveal();
    initCopy();
    initCarousels();
    initScrollSpy();
    initReveal();
    initKanban();
    // 데모용 toast 트리거
    $$("[data-toast]").forEach((b) => on(b, "click", () => {
      Toast.show({ type: b.getAttribute("data-toast-type") || "info", title: b.getAttribute("data-toast") || "알림", text: b.getAttribute("data-toast-text") || "" });
    }));
    // 데모용 sort 아이콘 초기화
    $$("th.sortable .sort-ico").forEach((i) => { if (!i.innerHTML.trim()) i.innerHTML = sortIcon("none"); });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();

  // 전역 노출 (페이지 인라인 스크립트에서 사용 가능)
  window.Theme30 = { Toast, Modal, Drawer, ThemeManager, CommandPalette };
})();
