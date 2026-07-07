/* ============================================================================
   THEME 12 · ART DECO — app.js
   ----------------------------------------------------------------------------
   순수 바닐라 JS. 외부 의존 0. 전부 data-attribute 선언형으로 동작하므로
   index.html 및 pages/* 어디에 링크해도 자동 활성화된다.

   공개 API (window.Deco):
     Deco.toast({title, message, variant, timeout})
     Deco.openModal(id) / Deco.closeModal(id)
     Deco.openDrawer(id) / Deco.closeDrawer(id)
   ========================================================================== */
(function () {
  "use strict";

  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const on = (el, ev, fn, opt) => el && el.addEventListener(ev, fn, opt);
  const FOCUSABLE = 'a[href],button:not([disabled]),textarea,input,select,[tabindex]:not([tabindex="-1"])';

  /* ===================== 1. THEME (다크/라이트 + 저장) ==================== */
  const THEME_KEY = "deco-theme";
  function applyTheme(t) {
    document.documentElement.setAttribute("data-theme", t);
    try { localStorage.setItem(THEME_KEY, t); } catch (e) {}
    $$("[data-theme-toggle]").forEach((b) => {
      b.setAttribute("aria-pressed", String(t === "light"));
      const lbl = b.querySelector("[data-theme-label]");
      if (lbl) lbl.textContent = t === "light" ? "Light" : "Dark";
    });
  }
  function initTheme() {
    let saved = "dark";
    try { saved = localStorage.getItem(THEME_KEY) || "dark"; } catch (e) {}
    applyTheme(saved);
    document.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-theme-toggle]");
      if (!btn) return;
      const cur = document.documentElement.getAttribute("data-theme");
      applyTheme(cur === "light" ? "dark" : "light");
    });
  }

  /* ===================== 2. TABS ========================================== */
  function initTabs() {
    $$("[data-tabs]").forEach((root) => {
      const tabs = $$('[role="tab"]', root);
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

  /* ===================== 3. ACCORDION ==================================== */
  function initAccordion() {
    document.addEventListener("click", (e) => {
      const trg = e.target.closest(".accordion-trigger");
      if (!trg) return;
      const item = trg.closest(".accordion-item");
      const panel = trg.nextElementSibling;
      const root = trg.closest("[data-accordion]");
      const open = trg.getAttribute("aria-expanded") === "true";
      if (root && root.hasAttribute("data-accordion-single") && !open) {
        $$(".accordion-trigger", root).forEach((t) => {
          t.setAttribute("aria-expanded", "false");
          const p = t.nextElementSibling;
          if (p) p.classList.remove("is-open");
        });
      }
      trg.setAttribute("aria-expanded", String(!open));
      if (panel) panel.classList.toggle("is-open", !open);
    });
  }

  /* ===================== 4. MODAL ======================================== */
  let lastFocused = null;
  function trapFocus(container, e) {
    const f = $$(FOCUSABLE, container).filter((el) => el.offsetParent !== null);
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
  function openOverlay(el) {
    if (!el) return;
    lastFocused = document.activeElement;
    el.hidden = false;
    document.body.style.overflow = "hidden";
    const focusEl = $(FOCUSABLE, el);
    if (focusEl) setTimeout(() => focusEl.focus(), 30);
  }
  function closeOverlay(el) {
    if (!el) return;
    el.hidden = true;
    if (!$$(".overlay:not([hidden]), .cmdk-overlay:not([hidden]), .drawer-overlay:not([hidden])").length)
      document.body.style.overflow = "";
    if (lastFocused) lastFocused.focus();
  }
  function initModal() {
    document.addEventListener("click", (e) => {
      const opener = e.target.closest("[data-modal-open]");
      if (opener) { openOverlay(document.getElementById(opener.getAttribute("data-modal-open"))); return; }
      const closer = e.target.closest("[data-modal-close]");
      if (closer) { closeOverlay(closer.closest(".overlay")); return; }
      if (e.target.classList && e.target.classList.contains("overlay")) closeOverlay(e.target);
    });
    document.addEventListener("keydown", (e) => {
      const open = $(".overlay:not([hidden])");
      if (!open) return;
      if (e.key === "Escape") closeOverlay(open);
      if (e.key === "Tab") trapFocus(open, e);
    });
  }

  /* ===================== 5. DRAWER ======================================= */
  function initDrawer() {
    document.addEventListener("click", (e) => {
      const opener = e.target.closest("[data-drawer-open]");
      if (opener) { openOverlay(document.getElementById(opener.getAttribute("data-drawer-open"))); return; }
      const closer = e.target.closest("[data-drawer-close]");
      if (closer) { closeOverlay(closer.closest(".drawer-overlay")); return; }
      if (e.target.classList && e.target.classList.contains("drawer-overlay")) closeOverlay(e.target);
    });
    document.addEventListener("keydown", (e) => {
      const open = $(".drawer-overlay:not([hidden])");
      if (!open) return;
      if (e.key === "Escape") closeOverlay(open);
      if (e.key === "Tab") trapFocus(open, e);
    });
  }

  /* ===================== 6. TOAST ======================================== */
  function ensureToastRegion() {
    let r = $(".toast-region");
    if (!r) { r = document.createElement("div"); r.className = "toast-region"; r.setAttribute("aria-live", "polite"); r.setAttribute("aria-atomic", "false"); document.body.appendChild(r); }
    return r;
  }
  const TOAST_ICONS = {
    default: '<path d="M12 2 2 19h20L12 2Z" fill="none" stroke="currentColor" stroke-width="1.5"/>',
    success: '<path d="m5 13 4 4 10-10" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
    danger:  '<path d="M12 8v5M12 16.5v.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.5"/>',
    info:    '<path d="M12 11v5M12 8v.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.5"/>'
  };
  function toast(opts) {
    opts = opts || {};
    const region = ensureToastRegion();
    const el = document.createElement("div");
    el.className = "toast toast--" + (opts.variant || "default");
    el.setAttribute("role", "status");
    el.innerHTML =
      '<svg class="toast-icon" viewBox="0 0 24 24" aria-hidden="true">' + (TOAST_ICONS[opts.variant] || TOAST_ICONS.default) + "</svg>" +
      '<div class="grow"><div class="toast-title">' + (opts.title || "알림") + "</div>" +
      (opts.message ? '<div class="toast-msg">' + opts.message + "</div>" : "") + "</div>" +
      '<button class="toast-close" aria-label="닫기"><svg viewBox="0 0 24 24" width="100%" height="100%" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" stroke-width="1.6"/></svg></button>';
    region.appendChild(el);
    const remove = () => { el.classList.add("is-leaving"); setTimeout(() => el.remove(), 280); };
    on($(".toast-close", el), "click", remove);
    const t = opts.timeout == null ? 4200 : opts.timeout;
    if (t > 0) setTimeout(remove, t);
    return el;
  }
  function initToastTriggers() {
    document.addEventListener("click", (e) => {
      const b = e.target.closest("[data-toast]");
      if (!b) return;
      toast({ title: b.getAttribute("data-toast-title") || "알림", message: b.getAttribute("data-toast-msg") || "", variant: b.getAttribute("data-toast") || "default" });
    });
  }

  /* ===================== 7. COMMAND PALETTE (⌘K) ========================= */
  function initCmdk() {
    const overlay = $("#cmdk");
    if (!overlay) {
      // 전역 단축키만 등록 (페이지에 팔레트 없을 때는 무시)
      document.addEventListener("keydown", cmdkHotkey);
      return;
    }
    const input = $(".cmdk-input-row input", overlay);
    const list = $(".cmdk-list", overlay);
    const items = () => $$(".cmdk-item", list).filter((i) => i.style.display !== "none");
    let active = 0;
    function setActive(i) {
      const arr = items();
      if (!arr.length) return;
      active = (i + arr.length) % arr.length;
      arr.forEach((el, idx) => el.classList.toggle("is-active", idx === active));
      arr[active].scrollIntoView({ block: "nearest" });
    }
    function filter(q) {
      q = q.trim().toLowerCase();
      $$(".cmdk-item", list).forEach((it) => {
        const hit = it.textContent.toLowerCase().includes(q);
        it.style.display = hit ? "" : "none";
      });
      $$(".cmdk-group-label", list).forEach((g) => {
        let n = g.nextElementSibling, any = false;
        while (n && n.classList.contains("cmdk-item")) { if (n.style.display !== "none") any = true; n = n.nextElementSibling; }
        g.style.display = any ? "" : "none";
      });
      let empty = $(".cmdk-empty", list);
      if (!items().length) { if (!empty) { empty = document.createElement("div"); empty.className = "cmdk-empty"; empty.textContent = "결과 없음"; list.appendChild(empty); } }
      else if (empty) empty.remove();
      setActive(0);
    }
    function open() { openOverlay(overlay); input.value = ""; filter(""); setTimeout(() => input.focus(), 40); }
    function close() { closeOverlay(overlay); }
    window.__cmdkOpen = open;
    document.addEventListener("keydown", cmdkHotkey);
    on(input, "input", () => filter(input.value));
    on(overlay, "keydown", (e) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowDown") { e.preventDefault(); setActive(active + 1); }
      else if (e.key === "ArrowUp") { e.preventDefault(); setActive(active - 1); }
      else if (e.key === "Enter") { e.preventDefault(); const a = items()[active]; if (a) { a.click(); }
      } else if (e.key === "Tab") trapFocus(overlay, e);
    });
    on(overlay, "click", (e) => { if (e.target === overlay) close(); });
    $$(".cmdk-item", list).forEach((it) => on(it, "click", () => {
      const lbl = (it.querySelector(".cmdk-label") || it).textContent.trim();
      close();
      toast({ title: "명령 실행", message: lbl, variant: "default" });
      const href = it.getAttribute("data-href");
      if (href) window.location.href = href;
    }));
    on(list, "mousemove", (e) => { const it = e.target.closest(".cmdk-item"); if (it) setActive(items().indexOf(it)); });
  }
  function cmdkHotkey(e) {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      if (window.__cmdkOpen) window.__cmdkOpen();
    }
  }
  // 검색바 등 [data-cmdk-trigger] 위임 바인딩 (인라인 onclick 제거용)
  function initCmdkTriggers() {
    document.addEventListener("click", (e) => {
      const t = e.target.closest("[data-cmdk-trigger]");
      if (!t) return;
      e.preventDefault();
      if (window.__cmdkOpen) window.__cmdkOpen();
    });
  }

  /* ===================== 8. DROPDOWN / MENU ============================== */
  function initDropdown() {
    document.addEventListener("click", (e) => {
      const toggle = e.target.closest("[data-dropdown-toggle]");
      $$(".dropdown > .menu, [data-dropdown-panel]").forEach((m) => {
        if (toggle && m === toggle.parentElement.querySelector(".menu, [data-dropdown-panel]")) return;
        m.hidden = true;
      });
      if (toggle) {
        const panel = toggle.parentElement.querySelector(".menu, [data-dropdown-panel]");
        if (panel) { panel.hidden = !panel.hidden; toggle.setAttribute("aria-expanded", String(!panel.hidden)); }
        return;
      }
      // 메뉴 아이템 클릭 시 닫기
      if (e.target.closest(".menu-item")) $$(".dropdown > .menu").forEach((m) => (m.hidden = true));
    });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") $$(".dropdown > .menu, [data-dropdown-panel]").forEach((m) => (m.hidden = true)); });
  }

  /* ===================== 9. CONTEXT MENU ================================= */
  function initContextMenu() {
    $$("[data-contextmenu]").forEach((zone) => {
      const menu = document.getElementById(zone.getAttribute("data-contextmenu"));
      if (!menu) return;
      on(zone, "contextmenu", (e) => {
        e.preventDefault();
        menu.hidden = false;
        const mw = menu.offsetWidth, mh = menu.offsetHeight;
        menu.style.left = Math.min(e.clientX, innerWidth - mw - 8) + "px";
        menu.style.top = Math.min(e.clientY, innerHeight - mh - 8) + "px";
      });
      on(document, "click", () => (menu.hidden = true));
    });
  }

  /* ===================== 10. SLIDER ====================================== */
  function initSliders() {
    $$(".slider input[type=range]").forEach((r) => {
      const out = r.closest(".slider").querySelector(".slider-val");
      const upd = () => {
        const min = +r.min || 0, max = +r.max || 100;
        const p = ((r.value - min) / (max - min)) * 100;
        r.style.setProperty("--_p", p + "%");
        if (out) out.textContent = (r.dataset.suffix ? r.value + r.dataset.suffix : r.value);
      };
      on(r, "input", upd); upd();
    });
  }

  /* ===================== 11. STEPPER ===================================== */
  function initSteppers() {
    document.addEventListener("click", (e) => {
      const btn = e.target.closest(".stepper button");
      if (!btn) return;
      const input = btn.parentElement.querySelector("input");
      if (!input) return;
      const step = +(input.step || 1);
      let v = +input.value || 0;
      v += btn.dataset.dir === "down" ? -step : step;
      if (input.min !== "") v = Math.max(+input.min, v);
      if (input.max !== "") v = Math.min(+input.max, v);
      input.value = v;
    });
  }

  /* ===================== 12. SEGMENTED / BUTTON-GROUP ==================== */
  function initSegmented() {
    /* .segmented = 단일 선택 뷰/옵션 선택기 → role="radiogroup" + role="radio"
       aria-checked 가 표준. 마크업이 레거시(aria-selected/tablist)면 런타임 이관.
       클릭 + 방향키(←→↑↓/Home/End) + roving tabindex 완비. */
    $$(".segmented").forEach((group) => {
      if (group.getAttribute("role") !== "radiogroup") group.setAttribute("role", "radiogroup");
      const btns = $$("button", group);
      btns.forEach((b) => {
        if (b.getAttribute("role") !== "radio") b.setAttribute("role", "radio");
        if (b.hasAttribute("aria-selected")) {
          if (!b.hasAttribute("aria-checked")) b.setAttribute("aria-checked", b.getAttribute("aria-selected"));
          b.removeAttribute("aria-selected");
        }
        if (b.hasAttribute("aria-pressed")) b.removeAttribute("aria-pressed"); // radio 엔 무효
        if (!b.hasAttribute("aria-checked")) b.setAttribute("aria-checked", b.classList.contains("is-active") ? "true" : "false");
      });
      const roving = () => btns.forEach((x) => { x.tabIndex = x.getAttribute("aria-checked") === "true" ? 0 : -1; });
      const select = (b) => {
        btns.forEach((x) => { x.setAttribute("aria-checked", "false"); x.classList.remove("is-active"); });
        b.setAttribute("aria-checked", "true"); b.classList.add("is-active");
        roving();
        if (group.dataset.onchange === "billing") syncBilling(b.dataset.value);
      };
      if (!btns.some((b) => b.getAttribute("aria-checked") === "true") && btns[0]) select(btns[0]);
      else roving();
      btns.forEach((b, i) => {
        on(b, "click", () => select(b));
        on(b, "keydown", (e) => {
          let idx = null;
          if (e.key === "ArrowRight" || e.key === "ArrowDown") idx = (i + 1) % btns.length;
          else if (e.key === "ArrowLeft" || e.key === "ArrowUp") idx = (i - 1 + btns.length) % btns.length;
          else if (e.key === "Home") idx = 0;
          else if (e.key === "End") idx = btns.length - 1;
          if (idx !== null) { e.preventDefault(); select(btns[idx]); btns[idx].focus(); }
        });
      });
    });
    /* .btn-group[data-toggle] = 눌림 토글(aria-pressed) — 별개 패턴 유지 */
    $$(".btn-group[data-toggle]").forEach((group) => {
      $$("button", group).forEach((b) => on(b, "click", () => {
        $$("button", group).forEach((x) => { x.classList.remove("is-active"); x.setAttribute("aria-pressed", "false"); });
        b.classList.add("is-active"); b.setAttribute("aria-pressed", "true");
      }));
    });
  }
  // 가격표 월/연 토글 연동
  function syncBilling(mode) {
    $$("[data-price]").forEach((el) => {
      const v = el.getAttribute(mode === "yearly" ? "data-price-year" : "data-price-month");
      if (v != null) el.textContent = v;
    });
    $$("[data-billing-note]").forEach((el) => { el.textContent = mode === "yearly" ? el.dataset.noteYear || "연간 청구" : el.dataset.noteMonth || "월간 청구"; });
  }

  /* ===================== 13. RATING ====================================== */
  function initRating() {
    $$(".rating:not(.rating--readonly)").forEach((r) => {
      const stars = $$(".star", r);
      const set = (n) => { stars.forEach((s, i) => s.classList.toggle("is-on", i < n)); r.dataset.value = n; };
      stars.forEach((s, i) => {
        on(s, "click", () => set(i + 1));
        on(s, "mouseenter", () => stars.forEach((x, j) => x.classList.toggle("is-on", j <= i)));
      });
      on(r, "mouseleave", () => set(+r.dataset.value || 0));
      set(+r.dataset.value || 0);
    });
  }

  /* ===================== 14. CHIP INPUT ================================== */
  function initChipInput() {
    $$(".chip-input").forEach((box) => {
      const input = box.querySelector("input");
      const addChip = (text) => {
        const chip = document.createElement("span");
        chip.className = "chip";
        chip.innerHTML = text + ' <button type="button" aria-label="제거"><svg viewBox="0 0 24 24" width="12" height="12" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" stroke-width="2"/></svg></button>';
        box.insertBefore(chip, input);
      };
      on(input, "keydown", (e) => {
        if (e.key === "Enter" && input.value.trim()) { e.preventDefault(); addChip(input.value.trim()); input.value = ""; }
        else if (e.key === "Backspace" && !input.value) { const chips = $$(".chip", box); if (chips.length) chips[chips.length - 1].remove(); }
      });
      on(box, "click", (e) => { const x = e.target.closest(".chip button"); if (x) x.closest(".chip").remove(); else input.focus(); });
    });
  }

  /* ===================== 15. CAROUSEL ==================================== */
  function initCarousel() {
    $$("[data-carousel]").forEach((c) => {
      const track = $(".carousel-track", c);
      const slides = $$(".carousel-slide", track);
      const dotsWrap = $(".carousel-dots", c);
      let idx = 0;
      if (dotsWrap) {
        dotsWrap.innerHTML = slides.map((_, i) => '<button aria-label="슬라이드 ' + (i + 1) + '로 이동"></button>').join("");
      }
      const dots = dotsWrap ? $$("button", dotsWrap) : [];
      const go = (i) => {
        idx = (i + slides.length) % slides.length;
        track.style.transform = "translateX(" + (-idx * 100) + "%)";
        dots.forEach((d, j) => d.setAttribute("aria-current", String(j === idx)));
      };
      on($(".carousel-btn.prev", c), "click", () => go(idx - 1));
      on($(".carousel-btn.next", c), "click", () => go(idx + 1));
      dots.forEach((d, i) => on(d, "click", () => go(i)));
      go(0);
    });
  }

  /* ===================== 16. SIDEBAR ==================================== */
  function initSidebar() {
    document.addEventListener("click", (e) => {
      const t = e.target.closest("[data-sidebar-toggle]");
      if (t) { const sb = $(".sidebar"); if (sb) sb.classList.toggle("is-collapsed"); }
      const m = e.target.closest("[data-sidebar-mobile]");
      if (m) { const sb = $(".sidebar"); if (sb) sb.classList.toggle("is-open"); }
    });
  }

  /* ===================== 17. TABLE (정렬 / 선택) ========================= */
  function initTables() {
    $$("table.table[data-sortable]").forEach((table) => {
      $$("thead th.is-sortable", table).forEach((th) => {
        // 트리거 = 내부 button.th-sort(키보드 무료) 또는 th 자체(tabindex+keydown 폴백)
        const trigger = th.querySelector(".th-sort") || th;
        const doSort = () => {
          const tbody = table.tBodies[0];
          const rows = Array.from(tbody.rows);
          const cur = th.getAttribute("aria-sort");
          const dir = cur === "ascending" ? "descending" : "ascending";
          $$("thead th", table).forEach((h) => h.setAttribute("aria-sort", "none"));
          th.setAttribute("aria-sort", dir);
          const idx = Array.from(th.parentElement.children).indexOf(th);
          rows.sort((a, b) => {
            const av = a.cells[idx].dataset.sort || a.cells[idx].textContent.trim();
            const bv = b.cells[idx].dataset.sort || b.cells[idx].textContent.trim();
            const na = parseFloat(av.replace(/[^0-9.\-]/g, "")), nb = parseFloat(bv.replace(/[^0-9.\-]/g, ""));
            let r = (!isNaN(na) && !isNaN(nb)) ? na - nb : av.localeCompare(bv, "ko");
            return dir === "ascending" ? r : -r;
          });
          rows.forEach((r) => tbody.appendChild(r));
        };
        on(trigger, "click", doSort);
        if (trigger === th) {
          th.tabIndex = 0;
          on(th, "keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); doSort(); } });
        }
      });
    });
    // 행 선택 (헤더 전체선택 + 개별)
    $$("table.table[data-selectable]").forEach((table) => {
      const head = $('thead input[type="checkbox"]', table);
      const rowBoxes = $$('tbody input[type="checkbox"]', table);
      const sync = () => rowBoxes.forEach((b) => b.closest("tr").setAttribute("aria-selected", String(b.checked)));
      if (head) on(head, "change", () => { rowBoxes.forEach((b) => (b.checked = head.checked)); sync(); });
      rowBoxes.forEach((b) => on(b, "change", () => {
        sync();
        if (head) { head.checked = rowBoxes.every((x) => x.checked); head.indeterminate = !head.checked && rowBoxes.some((x) => x.checked); }
      }));
    });
  }

  /* ===================== 18. COPY ======================================= */
  function initCopy() {
    document.addEventListener("click", (e) => {
      const b = e.target.closest("[data-copy]");
      if (!b) return;
      const sel = b.getAttribute("data-copy");
      const src = sel ? document.querySelector(sel) : b.closest(".codeblock") && b.closest(".codeblock").querySelector("pre");
      const text = src ? src.textContent : b.getAttribute("data-copy-text") || "";
      if (navigator.clipboard) navigator.clipboard.writeText(text).catch(() => {});
      toast({ title: "복사됨", message: "클립보드에 복사했습니다.", variant: "success", timeout: 2000 });
    });
  }

  /* ===================== 19. CALENDAR / DATEPICKER ====================== */
  const MONTHS = ["1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월"];
  const DOW = ["일","월","화","수","목","금","토"];
  function renderCalendar(cal, year, month, selected) {
    const grid = $(".cal-grid", cal);
    const title = $(".cal-title", cal);
    title.textContent = year + " " + MONTHS[month];
    const first = new Date(year, month, 1).getDay();
    const days = new Date(year, month + 1, 0).getDate();
    const prevDays = new Date(year, month, 0).getDate();
    const today = new Date();
    let html = DOW.map((d) => '<div class="cal-dow">' + d + "</div>").join("");
    for (let i = first - 1; i >= 0; i--) html += '<button class="cal-day is-muted" tabindex="-1">' + (prevDays - i) + "</button>";
    for (let d = 1; d <= days; d++) {
      const isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === d;
      const isSel = selected && selected.y === year && selected.m === month && selected.d === d;
      html += '<button class="cal-day' + (isToday ? " is-today" : "") + (isSel ? " is-selected" : "") + '" data-day="' + d + '">' + d + "</button>";
    }
    grid.innerHTML = html;
  }
  function initCalendars() {
    $$(".calendar[data-calendar]").forEach((cal) => {
      let cur = new Date();
      let y = cur.getFullYear(), m = cur.getMonth();
      let selected = { y, m, d: cur.getDate() };
      const draw = () => renderCalendar(cal, y, m, selected);
      draw();
      on(cal, "click", (e) => {
        if (e.target.closest(".cal-prev")) { m--; if (m < 0) { m = 11; y--; } draw(); }
        else if (e.target.closest(".cal-next")) { m++; if (m > 11) { m = 0; y++; } draw(); }
        else { const day = e.target.closest(".cal-day:not(.is-muted)"); if (day) { selected = { y, m, d: +day.dataset.day }; draw();
          const dp = cal.closest(".datepicker"); if (dp) { const inp = dp.querySelector("input"); if (inp) inp.value = y + "-" + String(m + 1).padStart(2, "0") + "-" + String(selected.d).padStart(2, "0"); cal.hidden = true; } } }
      });
    });
    // datepicker 토글
    document.addEventListener("click", (e) => {
      const trg = e.target.closest("[data-datepicker-toggle]");
      $$(".datepicker .calendar").forEach((c) => { if (!trg || !trg.parentElement.contains(c)) c.hidden = true; });
      if (trg) { const c = trg.parentElement.querySelector(".calendar"); if (c) c.hidden = !c.hidden; }
    });
  }

  /* ===================== 20. COMBOBOX / MULTISELECT ===================== */
  function initCombobox() {
    $$("[data-combo]").forEach((combo) => {
      const input = $(".combo-control input", combo);
      const panel = $(".combo-panel", combo);
      const multi = combo.hasAttribute("data-multi");
      const control = $(".combo-control", combo);
      const opts = () => $$(".combo-opt", panel);
      const openP = () => (panel.hidden = false);
      const closeP = () => (panel.hidden = true);
      on(input, "focus", openP);
      on(input, "input", () => { openP(); const q = input.value.toLowerCase(); opts().forEach((o) => (o.style.display = o.textContent.toLowerCase().includes(q) ? "" : "none")); });
      opts().forEach((o) => on(o, "click", () => {
        if (multi) {
          const on_ = o.getAttribute("aria-selected") === "true";
          o.setAttribute("aria-selected", String(!on_));
          if (!on_) { const tag = document.createElement("span"); tag.className = "chip"; tag.dataset.val = o.dataset.value || o.textContent.trim();
            tag.innerHTML = o.textContent.trim() + ' <button type="button" aria-label="제거"><svg viewBox="0 0 24 24" width="12" height="12" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" stroke-width="2"/></svg></button>';
            control.insertBefore(tag, input); }
          else { const t = control.querySelector('.chip[data-val="' + (o.dataset.value || o.textContent.trim()) + '"]'); if (t) t.remove(); }
          input.value = ""; input.focus();
        } else {
          opts().forEach((x) => x.setAttribute("aria-selected", "false"));
          o.setAttribute("aria-selected", "true");
          input.value = o.textContent.trim();
          closeP();
        }
      }));
      on(control, "click", (e) => { const x = e.target.closest(".chip button"); if (x) { const chip = x.closest(".chip"); const opt = panel.querySelector('.combo-opt[data-value="' + chip.dataset.val + '"]'); if (opt) opt.setAttribute("aria-selected", "false"); chip.remove(); e.stopPropagation(); } });
      document.addEventListener("click", (e) => { if (!combo.contains(e.target)) closeP(); });
    });
  }

  /* ===================== 21. FILE UPLOAD ================================ */
  function initFileUpload() {
    $$(".fileupload").forEach((fu) => {
      const input = fu.querySelector('input[type="file"]') || (function () { const i = document.createElement("input"); i.type = "file"; i.hidden = true; i.multiple = true; fu.appendChild(i); return i; })();
      const listWrap = fu.parentElement.querySelector("[data-file-list]");
      on(fu, "click", () => input.click());
      on(fu, "dragover", (e) => { e.preventDefault(); fu.classList.add("is-drag"); });
      on(fu, "dragleave", () => fu.classList.remove("is-drag"));
      on(fu, "drop", (e) => { e.preventDefault(); fu.classList.remove("is-drag"); show(e.dataTransfer.files); });
      on(input, "change", () => show(input.files));
      function show(files) {
        if (!listWrap) { toast({ title: "파일 선택됨", message: files.length + "개 파일", variant: "info" }); return; }
        Array.from(files).forEach((f) => {
          const row = document.createElement("div");
          row.className = "file-row";
          row.innerHTML = '<span class="fi"><svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M6 2h8l4 4v16H6z" fill="none" stroke="currentColor" stroke-width="1.4"/></svg></span><div class="grow"><div>' + f.name + '</div><div class="fs-xs text-subtle">' + Math.max(1, Math.round(f.size / 1024)) + ' KB</div></div><button class="btn btn--icon btn--bare btn--sm" aria-label="제거"><svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" stroke-width="1.6"/></svg></button>';
          on(row.querySelector("button"), "click", () => row.remove());
          listWrap.appendChild(row);
        });
      }
    });
  }

  /* ===================== 22. PROGRESS RING (dasharray) =================== */
  function initRings() {
    $$(".progress-ring").forEach((ring) => {
      const val = +ring.dataset.value || 0;
      const circle = $(".val", ring);
      if (!circle) return;
      const r = circle.r.baseVal.value;
      const c = 2 * Math.PI * r;
      circle.style.strokeDasharray = c;
      circle.style.strokeDashoffset = c;
      requestAnimationFrame(() => { circle.style.strokeDashoffset = c * (1 - val / 100); });
      const lbl = $(".label", ring); if (lbl && !lbl.textContent.trim()) lbl.textContent = val + "%";
    });
  }

  /* ===================== 23. SCROLL REVEAL ============================== */
  function initReveal() {
    const els = $$("[data-reveal]");
    if (!("IntersectionObserver" in window) || !els.length) { els.forEach((e) => e.classList.add("animate-in")); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("animate-in"); io.unobserve(en.target); } });
    }, { threshold: 0.12 });
    els.forEach((e) => io.observe(e));
  }

  /* ===================== INIT ALL ======================================= */
  function init() {
    initTheme(); initTabs(); initAccordion(); initModal(); initDrawer();
    initToastTriggers(); initCmdk(); initCmdkTriggers(); initDropdown(); initContextMenu();
    initSliders(); initSteppers(); initSegmented(); initRating(); initChipInput();
    initCarousel(); initSidebar(); initTables(); initCopy(); initCalendars();
    initCombobox(); initFileUpload(); initRings(); initReveal();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();

  window.Deco = {
    toast,
    openModal: (id) => openOverlay(document.getElementById(id)),
    closeModal: (id) => closeOverlay(document.getElementById(id)),
    openDrawer: (id) => openOverlay(document.getElementById(id)),
    closeDrawer: (id) => closeOverlay(document.getElementById(id))
  };
})();
