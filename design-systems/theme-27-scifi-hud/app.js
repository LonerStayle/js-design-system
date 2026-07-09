/* ============================================================================
   THEME 27 — SCI-FI HUD  ·  app.js
   Vanilla JS interaction engine. No frameworks, no build step.
   Self-initialising: every widget is wired by data-attributes on DOMContentLoaded.
   Works from file:// (double-click). Respects prefers-reduced-motion.
   ----------------------------------------------------------------------------
   Modules:
     theme · clock/telemetry · boot · tabs · accordion · toggle/segmented ·
     slider/stepper/rating · chip-input · file-upload · combobox ·
     dropdown menu · context menu · modal · drawer · toast · command palette ·
     table (sort/select/paginate) · carousel · sidebar · copy · gauges/charts
   ========================================================================== */
(function () {
  'use strict';

  const RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $  = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const on = (el, ev, fn, opt) => el && el.addEventListener(ev, fn, opt);

  /* ----------------------------------------------------------------------
   * THEME — persist dark/light, default dark (canonical).
   * -------------------------------------------------------------------- */
  const THEME_KEY = 'scifi-hud-theme';
  function applyTheme(t) {
    document.documentElement.setAttribute('data-theme', t);
    try { localStorage.setItem(THEME_KEY, t); } catch (e) {}
    $$('[data-theme-toggle]').forEach((b) => {
      b.setAttribute('aria-pressed', String(t === 'light'));
      const lbl = b.querySelector('[data-theme-label]');
      if (lbl) lbl.textContent = t === 'light' ? '라이트' : '다크';
    });
  }
  function initTheme() {
    // Respect the pre-paint decision made by the <head> FOUC snippet; only fall
    // back to a fresh default if neither storage nor attribute is set.
    let t = document.documentElement.getAttribute('data-theme') || 'dark';
    try { t = localStorage.getItem(THEME_KEY) || t; } catch (e) {}
    applyTheme(t);
    $$('[data-theme-toggle]').forEach((b) =>
      on(b, 'click', () => {
        const cur = document.documentElement.getAttribute('data-theme');
        applyTheme(cur === 'light' ? 'dark' : 'light');
      })
    );
  }

  /* ----------------------------------------------------------------------
   * LIVE CLOCK + TELEMETRY — HUD readouts ([data-clock], [data-telemetry]).
   * -------------------------------------------------------------------- */
  function pad(n) { return String(n).padStart(2, '0'); }
  function tickClock() {
    const now = new Date();
    const stamp = pad(now.getHours()) + ':' + pad(now.getMinutes()) + ':' + pad(now.getSeconds());
    $$('[data-clock]').forEach((el) => { el.textContent = stamp; });
    const utc = pad(now.getUTCHours()) + ':' + pad(now.getUTCMinutes()) + 'Z';
    $$('[data-clock-utc]').forEach((el) => { el.textContent = utc; });
  }
  function tickTelemetry() {
    if (RM) return; // no jitter when reduced motion
    $$('[data-telemetry]').forEach((el) => {
      const base = parseFloat(el.dataset.base || '50');
      const range = parseFloat(el.dataset.range || '8');
      const dp = parseInt(el.dataset.dp || '0', 10);
      const v = base + (Math.random() - 0.5) * range;
      el.textContent = v.toFixed(dp);
    });
  }
  function initTelemetry() {
    tickClock();
    setInterval(tickClock, 1000);
    if (!RM) { tickTelemetry(); setInterval(tickTelemetry, 2000); }
  }

  /* ----------------------------------------------------------------------
   * BOOT SEQUENCE — [data-boot] lines reveal in stagger, then hero unlocks.
   * -------------------------------------------------------------------- */
  function initBoot() {
    const boot = $('[data-boot]');
    if (!boot) return;
    const lines = $$('[data-boot-line]', boot);
    if (RM) { lines.forEach((l) => (l.style.opacity = '1')); boot.classList.add('is-done'); return; }
    lines.forEach((l, i) => {
      l.style.opacity = '0';
      setTimeout(() => {
        l.style.transition = 'opacity .25s ease';
        l.style.opacity = '1';
      }, 220 * i + 120);
    });
    setTimeout(() => boot.classList.add('is-done'), 220 * lines.length + 400);
  }

  /* ----------------------------------------------------------------------
   * TABS — [data-tabs] with [role=tab] + [role=tabpanel], roving focus.
   * -------------------------------------------------------------------- */
  function initTabs() {
    $$('[data-tabs]').forEach((wrap) => {
      const tabs = $$('[role="tab"]', wrap);
      const panels = $$('[role="tabpanel"]', wrap);
      function select(idx) {
        tabs.forEach((t, i) => {
          const active = i === idx;
          t.setAttribute('aria-selected', String(active));
          t.tabIndex = active ? 0 : -1;
          if (panels[i]) panels[i].hidden = !active;
        });
      }
      tabs.forEach((t, i) => {
        on(t, 'click', () => select(i));
        on(t, 'keydown', (e) => {
          let n = null;
          if (e.key === 'ArrowRight' || e.key === 'ArrowDown') n = (i + 1) % tabs.length;
          else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') n = (i - 1 + tabs.length) % tabs.length;
          else if (e.key === 'Home') n = 0;
          else if (e.key === 'End') n = tabs.length - 1;
          if (n !== null) { e.preventDefault(); select(n); tabs[n].focus(); }
        });
      });
      const init = tabs.findIndex((t) => t.getAttribute('aria-selected') === 'true');
      select(init >= 0 ? init : 0);
    });
  }

  /* ----------------------------------------------------------------------
   * ACCORDION — [data-accordion], button[aria-expanded] toggles panel.
   * -------------------------------------------------------------------- */
  function initAccordion() {
    $$('[data-accordion]').forEach((acc) => {
      const single = acc.dataset.accordion === 'single';
      $$('.accordion-trigger', acc).forEach((trig) => {
        on(trig, 'click', () => {
          const panel = trig.nextElementSibling;
          const open = trig.getAttribute('aria-expanded') === 'true';
          if (single && !open) {
            $$('.accordion-trigger', acc).forEach((t) => {
              t.setAttribute('aria-expanded', 'false');
              const p = t.nextElementSibling;
              if (p) p.classList.remove('is-open');
            });
          }
          trig.setAttribute('aria-expanded', String(!open));
          if (panel) panel.classList.toggle('is-open', !open);
        });
      });
    });
  }

  /* ----------------------------------------------------------------------
   * SEGMENTED CONTROL — [data-segmented] single-select buttons.
   * -------------------------------------------------------------------- */
  function initSegmented() {
    $$('[data-segmented]').forEach((seg) => {
      const btns = $$('button', seg);
      // radiogroup → aria-checked + arrow-key roving; plain group → aria-selected.
      const isRadio = seg.getAttribute('role') === 'radiogroup';
      const attr = isRadio ? 'aria-checked' : 'aria-selected';
      const select = (b) => {
        btns.forEach((x) => { x.setAttribute(attr, 'false'); if (isRadio) x.tabIndex = -1; });
        b.setAttribute(attr, 'true'); if (isRadio) b.tabIndex = 0;
        seg.dispatchEvent(new CustomEvent('segment:change', { detail: { value: b.dataset.value } }));
        // Pricing toggle hook
        if (seg.dataset.segmented === 'billing') {
          const annual = b.dataset.value === 'annual';
          $$('[data-price]').forEach((p) => {
            p.textContent = annual ? p.dataset.priceAnnual : p.dataset.priceMonthly;
          });
          $$('[data-price-note]').forEach((n) => {
            n.textContent = annual ? (n.dataset.noteAnnual || '/년 · 연간 결제') : (n.dataset.noteMonthly || '/월');
          });
        }
      };
      btns.forEach((b, i) => {
        on(b, 'click', () => select(b));
        if (isRadio) on(b, 'keydown', (e) => {
          let n = null;
          if (e.key === 'ArrowRight' || e.key === 'ArrowDown') n = (i + 1) % btns.length;
          else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') n = (i - 1 + btns.length) % btns.length;
          else if (e.key === 'Home') n = 0;
          else if (e.key === 'End') n = btns.length - 1;
          if (n !== null) { e.preventDefault(); select(btns[n]); btns[n].focus(); }
        });
      });
      if (isRadio) {
        const cur = btns.findIndex((b) => b.getAttribute('aria-checked') === 'true');
        btns.forEach((b, i) => { b.tabIndex = (i === (cur >= 0 ? cur : 0)) ? 0 : -1; });
      }
    });
  }

  /* ----------------------------------------------------------------------
   * SLIDER — fill + live value output [data-slider].
   * -------------------------------------------------------------------- */
  function initSliders() {
    $$('input[type="range"][data-slider]').forEach((s) => {
      const out = s.dataset.output ? $(s.dataset.output) : null;
      const upd = () => {
        const min = +s.min || 0, max = +s.max || 100;
        const pct = ((s.value - min) / (max - min)) * 100;
        s.style.setProperty('--val', pct + '%');
        s.classList.add('is-filled');
        if (out) out.textContent = (s.dataset.prefix || '') + s.value + (s.dataset.suffix || '');
      };
      on(s, 'input', upd); upd();
    });
  }

  /* ----------------------------------------------------------------------
   * STEPPER — number +/- [data-stepper].
   * -------------------------------------------------------------------- */
  function initSteppers() {
    $$('[data-stepper]').forEach((st) => {
      const input = $('input', st);
      const min = input.min !== '' ? +input.min : -Infinity;
      const max = input.max !== '' ? +input.max : Infinity;
      const step = +input.step || 1;
      const set = (v) => { input.value = Math.max(min, Math.min(max, v)); };
      const dec = $('[data-dec]', st), inc = $('[data-inc]', st);
      on(dec, 'click', () => set((+input.value || 0) - step));
      on(inc, 'click', () => set((+input.value || 0) + step));
    });
  }

  /* ----------------------------------------------------------------------
   * RATING — star buttons [data-rating].
   * -------------------------------------------------------------------- */
  function initRatings() {
    $$('[data-rating]').forEach((r) => {
      const btns = $$('button', r);
      const paint = (n) => btns.forEach((b, i) => b.classList.toggle('is-on', i < n));
      btns.forEach((b, i) => {
        on(b, 'click', () => { r.dataset.value = i + 1; paint(i + 1); });
        on(b, 'mouseenter', () => paint(i + 1));
      });
      on(r, 'mouseleave', () => paint(+r.dataset.value || 0));
      paint(+r.dataset.value || 0);
    });
  }

  /* ----------------------------------------------------------------------
   * CHIP INPUT — add on Enter, remove on click/Backspace [data-chip-input].
   * -------------------------------------------------------------------- */
  function initChipInputs() {
    $$('[data-chip-input]').forEach((wrap) => {
      const input = $('input', wrap);
      const addChip = (text) => {
        text = text.trim();
        if (!text) return;
        const chip = document.createElement('span');
        chip.className = 'chip';
        chip.innerHTML = '<span></span><button type="button"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg></button>';
        chip.querySelector('span').textContent = text;
        const rm = chip.querySelector('button');
        rm.setAttribute('aria-label', text + ' 태그 제거');   // set as attr, not interpolated into HTML
        on(rm, 'click', () => chip.remove());
        wrap.insertBefore(chip, input);
      };
      on(input, 'keydown', (e) => {
        if (e.key === 'Enter') { e.preventDefault(); addChip(input.value); input.value = ''; }
        else if (e.key === 'Backspace' && !input.value) {
          const chips = $$('.chip', wrap); if (chips.length) chips[chips.length - 1].remove();
        }
      });
    });
  }

  /* ----------------------------------------------------------------------
   * FILE UPLOAD — drag/drop + file list [data-file-upload].
   * -------------------------------------------------------------------- */
  function fmtSize(b) {
    if (b < 1024) return b + ' B';
    if (b < 1048576) return (b / 1024).toFixed(1) + ' KB';
    return (b / 1048576).toFixed(1) + ' MB';
  }
  function initFileUploads() {
    $$('[data-file-upload]').forEach((fu) => {
      const input = $('input[type="file"]', fu);
      const list = $(fu.dataset.fileList || '.file-list', fu.parentElement) || null;
      const render = (files) => {
        if (!list) return;
        list.innerHTML = '';
        Array.from(files).forEach((f) => {
          const row = document.createElement('div');
          row.className = 'file-row';
          row.innerHTML =
            '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg>' +
            '<span class="fr-name"></span><span class="fr-size">' + fmtSize(f.size) + '</span>' +
            '<button class="btn btn-icon btn-sm btn-ghost" aria-label="파일 제거"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg></button>';
          row.querySelector('.fr-name').textContent = f.name;
          on(row.querySelector('button'), 'click', () => row.remove());
          list.appendChild(row);
        });
      };
      on(input, 'change', () => render(input.files));
      ['dragover', 'dragenter'].forEach((ev) => on(fu, ev, (e) => { e.preventDefault(); fu.classList.add('is-dragover'); }));
      ['dragleave', 'drop'].forEach((ev) => on(fu, ev, (e) => { e.preventDefault(); fu.classList.remove('is-dragover'); }));
      on(fu, 'drop', (e) => { if (e.dataTransfer && e.dataTransfer.files) render(e.dataTransfer.files); });
    });
  }

  /* ----------------------------------------------------------------------
   * COMBOBOX — filter listbox [data-combobox], keyboard nav.
   * -------------------------------------------------------------------- */
  function initComboboxes() {
    $$('[data-combobox]').forEach((cb) => {
      const input = $('input', cb);
      const list = $('.listbox', cb);
      const items = $$('li', list);
      let active = -1;
      const open = (b) => { list.style.display = b ? 'block' : 'none'; input.setAttribute('aria-expanded', String(b)); };
      const filter = () => {
        const q = input.value.toLowerCase();
        items.forEach((li) => { li.hidden = !li.textContent.toLowerCase().includes(q); });
        active = -1; paint();
      };
      const visible = () => items.filter((li) => !li.hidden);
      const paint = () => items.forEach((li) => li.classList.remove('is-active'));
      open(false);
      on(input, 'focus', () => { open(true); filter(); });
      on(input, 'input', () => { open(true); filter(); });
      on(input, 'keydown', (e) => {
        const vis = visible();
        if (e.key === 'ArrowDown') { e.preventDefault(); active = Math.min(active + 1, vis.length - 1); paint(); if (vis[active]) vis[active].classList.add('is-active'); }
        else if (e.key === 'ArrowUp') { e.preventDefault(); active = Math.max(active - 1, 0); paint(); if (vis[active]) vis[active].classList.add('is-active'); }
        else if (e.key === 'Enter' && vis[active]) { e.preventDefault(); choose(vis[active]); }
        else if (e.key === 'Escape') open(false);
      });
      const choose = (li) => { input.value = li.textContent.trim(); items.forEach((x) => x.setAttribute('aria-selected', 'false')); li.setAttribute('aria-selected', 'true'); open(false); };
      items.forEach((li) => on(li, 'click', () => choose(li)));
      on(document, 'click', (e) => { if (!cb.contains(e.target)) open(false); });
    });
  }

  /* ----------------------------------------------------------------------
   * DROPDOWN MENU — [data-menu] trigger toggles .menu, ESC/outside close.
   * -------------------------------------------------------------------- */
  function initMenus() {
    $$('[data-menu]').forEach((anchor) => {
      const trigger = $('[data-menu-trigger]', anchor);
      const menu = $('.menu', anchor);
      if (!trigger || !menu) return;
      const close = () => { menu.classList.remove('is-open'); trigger.setAttribute('aria-expanded', 'false'); };
      const open = () => { menu.classList.add('is-open'); trigger.setAttribute('aria-expanded', 'true'); const f = $('.menu-item', menu); if (f) f.focus(); };
      on(trigger, 'click', (e) => { e.stopPropagation(); menu.classList.contains('is-open') ? close() : open(); });
      $$('.menu-item', menu).forEach((item, i, arr) => {
        on(item, 'keydown', (e) => {
          if (e.key === 'ArrowDown') { e.preventDefault(); (arr[i + 1] || arr[0]).focus(); }
          else if (e.key === 'ArrowUp') { e.preventDefault(); (arr[i - 1] || arr[arr.length - 1]).focus(); }
          else if (e.key === 'Escape') { close(); trigger.focus(); }
        });
        on(item, 'click', () => { if (!item.dataset.keepOpen) close(); });
      });
      on(document, 'click', (e) => { if (!anchor.contains(e.target)) close(); });
    });
  }

  /* ----------------------------------------------------------------------
   * POPOVER — [data-popover-trigger] toggles a .popover (target or sibling).
   * -------------------------------------------------------------------- */
  function initPopovers() {
    $$('[data-popover-trigger]').forEach((trigger) => {
      const sel = trigger.dataset.popoverTrigger;
      const pop = sel ? $(sel) : (trigger.parentElement && $('.popover', trigger.parentElement));
      if (!pop) return;
      const close = () => { pop.hidden = true; trigger.setAttribute('aria-expanded', 'false'); };
      const open = () => { pop.hidden = false; trigger.setAttribute('aria-expanded', 'true'); };
      close();
      on(trigger, 'click', (e) => { e.stopPropagation(); pop.hidden ? open() : close(); });
      on(document, 'click', (e) => { if (!pop.contains(e.target) && e.target !== trigger && !trigger.contains(e.target)) close(); });
      on(document, 'keydown', (e) => { if (e.key === 'Escape') close(); });
    });
  }

  /* ----------------------------------------------------------------------
   * CONTEXT MENU — right-click on [data-context-menu-host].
   * -------------------------------------------------------------------- */
  function initContextMenu() {
    const host = $('[data-context-menu-host]');
    const menu = $('[data-context-menu]');
    if (!host || !menu) return;
    menu.style.right = 'auto';
    const hide = () => { menu.classList.remove('is-open'); menu.style.display = 'none'; };
    hide();
    on(host, 'contextmenu', (e) => {
      e.preventDefault();
      menu.style.display = 'block';
      menu.classList.add('is-open');
      const mw = menu.offsetWidth, mh = menu.offsetHeight;
      menu.style.left = Math.min(e.clientX, window.innerWidth - mw - 8) + 'px';
      menu.style.top = Math.min(e.clientY, window.innerHeight - mh - 8) + 'px';
    });
    on(document, 'click', hide);
    on(document, 'scroll', hide, true);
  }

  /* ----------------------------------------------------------------------
   * MODAL — [data-open-modal="#id"] / [data-close-modal]. Focus trap + ESC.
   * -------------------------------------------------------------------- */
  let lastFocused = null;
  function trapFocus(container, e) {
    const focusables = $$('a[href],button:not(:disabled),input:not(:disabled),select,textarea,[tabindex]:not([tabindex="-1"])', container)
      .filter((el) => el.offsetParent !== null);
    if (!focusables.length) return;
    const first = focusables[0], last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
  function openOverlay(overlay) {
    lastFocused = document.activeElement;
    overlay.classList.add('is-open');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    const focusEl = overlay.querySelector('[autofocus],.modal,[data-close-modal],.drawer');
    setTimeout(() => focusEl && focusEl.focus && focusEl.focus(), 60);
  }
  function closeOverlay(overlay) {
    overlay.classList.remove('is-open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastFocused && lastFocused.focus) lastFocused.focus();
  }
  function initModals() {
    $$('[data-open-modal]').forEach((btn) =>
      on(btn, 'click', () => { const m = $(btn.dataset.openModal); if (m) openOverlay(m); })
    );
    $$('.overlay').forEach((ov) => {
      on(ov, 'click', (e) => { if (e.target === ov) closeOverlay(ov); });
      $$('[data-close-modal]', ov).forEach((c) => on(c, 'click', () => closeOverlay(ov)));
      on(ov, 'keydown', (e) => {
        if (e.key === 'Escape') closeOverlay(ov);
        else if (e.key === 'Tab' && ov.classList.contains('is-open')) trapFocus(ov, e);
      });
    });
  }

  /* ----------------------------------------------------------------------
   * DRAWER — [data-open-drawer="#id"] / [data-close-drawer].
   * -------------------------------------------------------------------- */
  function initDrawers() {
    $$('[data-open-drawer]').forEach((btn) =>
      on(btn, 'click', () => {
        const id = btn.dataset.openDrawer;
        const drawer = $(id);
        const overlay = $(id + '-overlay') || drawer && drawer.previousElementSibling;
        if (drawer) drawer.classList.add('is-open');
        if (overlay && overlay.classList.contains('drawer-overlay')) overlay.classList.add('is-open');
        document.body.style.overflow = 'hidden';
      })
    );
    const closeAll = () => {
      $$('.drawer.is-open').forEach((d) => d.classList.remove('is-open'));
      $$('.drawer-overlay.is-open').forEach((o) => o.classList.remove('is-open'));
      document.body.style.overflow = '';
    };
    $$('[data-close-drawer]').forEach((c) => on(c, 'click', closeAll));
    $$('.drawer-overlay').forEach((o) => on(o, 'click', closeAll));
    on(document, 'keydown', (e) => { if (e.key === 'Escape') closeAll(); });
  }

  /* ----------------------------------------------------------------------
   * TOAST — global API window.HUD.toast({...}); also [data-toast] triggers.
   * -------------------------------------------------------------------- */
  function ensureToastRegion() {
    let region = $('.toast-region');
    if (!region) {
      region = document.createElement('div');
      region.className = 'toast-region';
      region.setAttribute('role', 'region');
      region.setAttribute('aria-label', '알림');
      region.setAttribute('aria-live', 'polite');
      document.body.appendChild(region);
    }
    return region;
  }
  const ICONS = {
    info: '<path d="M12 16v-4M12 8h.01"/><circle cx="12" cy="12" r="10"/>',
    success: '<path d="M20 6L9 17l-5-5"/>',
    warning: '<path d="M12 9v4M12 17h.01"/><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>',
    danger: '<circle cx="12" cy="12" r="10"/><path d="M15 9l-6 6M9 9l6 6"/>',
  };
  function toast(opts) {
    opts = opts || {};
    const region = ensureToastRegion();
    const type = opts.type || 'info';
    const el = document.createElement('div');
    el.className = 'toast is-' + type;
    el.setAttribute('role', type === 'danger' ? 'alert' : 'status');
    el.innerHTML =
      '<span class="toast-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + (ICONS[type] || ICONS.info) + '</svg></span>' +
      '<div><div class="toast-title"></div><div class="toast-msg"></div></div>' +
      '<button class="toast-close" aria-label="닫기"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg></button>' +
      (RM ? '' : '<span class="toast-bar"></span>');
    el.querySelector('.toast-title').textContent = opts.title || '알림';
    el.querySelector('.toast-msg').textContent = opts.message || '';
    region.appendChild(el);
    const remove = () => { el.classList.add('is-leaving'); setTimeout(() => el.remove(), 240); };
    on(el.querySelector('.toast-close'), 'click', remove);
    const dur = opts.duration || 4000;
    if (dur > 0) setTimeout(remove, dur);
    return el;
  }
  function initToastTriggers() {
    $$('[data-toast]').forEach((btn) =>
      on(btn, 'click', () =>
        toast({ type: btn.dataset.toast || 'info', title: btn.dataset.toastTitle || '시스템 알림', message: btn.dataset.toastMsg || '신호를 수신했습니다.' })
      )
    );
  }

  /* ----------------------------------------------------------------------
   * COMMAND PALETTE — ⌘K / Ctrl+K, fuzzy filter, keyboard nav.
   * -------------------------------------------------------------------- */
  function initCommandPalette() {
    const overlay = $('[data-cmdk]');
    if (!overlay) return;
    const input = $('.cmdk-search input', overlay);
    const items = $$('.cmdk-item', overlay);
    const empty = $('.cmdk-empty', overlay);
    let active = 0;
    const open = () => { openOverlay(overlay); input.value = ''; filter(); setTimeout(() => input.focus(), 60); };
    const close = () => closeOverlay(overlay);
    const visible = () => items.filter((i) => !i.hidden);
    const paint = () => { const vis = visible(); items.forEach((i) => i.classList.remove('is-active')); if (vis[active]) vis[active].classList.add('is-active'); };
    const filter = () => {
      const q = input.value.toLowerCase();
      items.forEach((i) => { i.hidden = q ? !i.textContent.toLowerCase().includes(q) : false; });
      active = 0;
      if (empty) empty.hidden = visible().length > 0;
      $$('.cmdk-group-label', overlay).forEach((g) => {
        let n = g.nextElementSibling, any = false;
        while (n && n.classList.contains('cmdk-item')) { if (!n.hidden) any = true; n = n.nextElementSibling; }
        g.hidden = !any;
      });
      paint();
    };
    on(input, 'input', filter);
    on(document, 'keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); overlay.classList.contains('is-open') ? close() : open(); }
    });
    on(overlay, 'keydown', (e) => {
      const vis = visible();
      if (e.key === 'ArrowDown') { e.preventDefault(); active = Math.min(active + 1, vis.length - 1); paint(); vis[active] && vis[active].scrollIntoView({ block: 'nearest' }); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); active = Math.max(active - 1, 0); paint(); vis[active] && vis[active].scrollIntoView({ block: 'nearest' }); }
      else if (e.key === 'Enter') { e.preventDefault(); if (vis[active]) vis[active].click(); }
      else if (e.key === 'Escape') close();
    });
    on(overlay, 'click', (e) => { if (e.target === overlay) close(); });
    items.forEach((i) =>
      on(i, 'click', () => {
        const t = i.dataset.action;
        const name = i.textContent.trim();
        close();
        if (t === 'theme') { const cur = document.documentElement.getAttribute('data-theme'); applyTheme(cur === 'light' ? 'dark' : 'light'); }
        else if (t === 'alert') { const cur = document.documentElement.getAttribute('data-alert'); setAlert(cur === 'red' ? 'nominal' : cur === 'amber' ? 'red' : 'amber'); }
        else if ((t && t.indexOf('http') === 0) || (t && t.endsWith('.html'))) { window.location.href = t; }
        else toast({ type: 'info', title: '명령 실행', message: '‹' + name + '› 명령을 실행했습니다.' });
      })
    );
    $$('[data-cmdk-open]').forEach((b) => on(b, 'click', open));
    filter();
  }

  /* ----------------------------------------------------------------------
   * TABLE — sort, select-all/row, client paginate [data-table].
   * -------------------------------------------------------------------- */
  function initTables() {
    $$('[data-table]').forEach((wrap) => {
      const table = $('table', wrap) || wrap;
      const tbody = $('tbody', table);
      if (!tbody) return;
      let rows = $$('tr', tbody);

      // Sorting
      $$('th.sortable', table).forEach((th, colIdx) => {
        // recompute real column index
        const idx = Array.from(th.parentElement.children).indexOf(th);
        on(th, 'click', () => {
          const cur = th.getAttribute('aria-sort');
          const dir = cur === 'ascending' ? 'descending' : 'ascending';
          $$('th', table).forEach((h) => h.removeAttribute('aria-sort'));
          th.setAttribute('aria-sort', dir);
          const type = th.dataset.sort || 'text';
          const sorted = $$('tr', tbody).sort((a, b) => {
            let av = a.children[idx].dataset.value || a.children[idx].textContent.trim();
            let bv = b.children[idx].dataset.value || b.children[idx].textContent.trim();
            if (type === 'num') { av = parseFloat(av.replace(/[^0-9.\-]/g, '')) || 0; bv = parseFloat(bv.replace(/[^0-9.\-]/g, '')) || 0; return dir === 'ascending' ? av - bv : bv - av; }
            return dir === 'ascending' ? String(av).localeCompare(bv) : String(bv).localeCompare(av);
          });
          sorted.forEach((r) => tbody.appendChild(r));
          paginate();
        });
      });

      // Selection
      const selAll = $('[data-select-all]', table);
      const rowChecks = () => $$('input[type="checkbox"][data-row-select]', tbody);
      const syncCount = () => {
        const n = rowChecks().filter((c) => c.checked).length;
        const out = $(wrap.dataset.selectionOut || '[data-selection-count]', wrap.parentElement || document);
        if (out) out.textContent = n;
        if (selAll) { selAll.indeterminate = n > 0 && n < rowChecks().length; selAll.checked = n === rowChecks().length && n > 0; }
      };
      if (selAll) on(selAll, 'change', () => { rowChecks().forEach((c) => { c.checked = selAll.checked; c.closest('tr').setAttribute('aria-selected', String(selAll.checked)); }); syncCount(); });
      rowChecks().forEach((c) => on(c, 'change', () => { c.closest('tr').setAttribute('aria-selected', String(c.checked)); syncCount(); }));

      // Pagination
      const pageSize = parseInt(wrap.dataset.pageSize || '0', 10);
      const pager = $(wrap.dataset.pager || '[data-pager]', wrap.parentElement || document);
      let page = 1;
      function paginate() {
        rows = $$('tr', tbody);
        if (!pageSize) return;
        const pages = Math.max(1, Math.ceil(rows.length / pageSize));
        page = Math.min(page, pages);
        rows.forEach((r, i) => { r.style.display = (i >= (page - 1) * pageSize && i < page * pageSize) ? '' : 'none'; });
        if (pager) {
          pager.innerHTML = '';
          const mk = (label, p, opts = {}) => {
            const b = document.createElement('button');
            b.textContent = label;
            if (opts.active) b.classList.add('is-active');
            if (opts.disabled) b.disabled = true;
            on(b, 'click', () => { page = p; paginate(); });
            pager.appendChild(b);
          };
          mk('‹', page - 1, { disabled: page === 1 });
          for (let p = 1; p <= pages; p++) mk(String(p), p, { active: p === page });
          mk('›', page + 1, { disabled: page === pages });
        }
      }
      paginate(); syncCount();
    });
  }

  /* ----------------------------------------------------------------------
   * CAROUSEL — scroll-snap + dots [data-carousel].
   * -------------------------------------------------------------------- */
  function initCarousels() {
    $$('[data-carousel]').forEach((car) => {
      const track = $('.carousel-track', car);
      const slides = $$('.carousel-slide', track);
      const dots = $('.carousel-dots', car);
      const prev = $('.carousel-nav.prev', car), next = $('.carousel-nav.next', car);
      if (dots) {
        slides.forEach((_, i) => {
          const b = document.createElement('button');
          b.setAttribute('aria-label', (i + 1) + '번 슬라이드로 이동');
          on(b, 'click', () => slides[i].scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' }));
          dots.appendChild(b);
        });
      }
      const setActive = () => {
        const i = Math.round(track.scrollLeft / (slides[0] ? slides[0].offsetWidth + 16 : 1));
        if (dots) $$('button', dots).forEach((d, di) => d.classList.toggle('is-active', di === i));
      };
      on(track, 'scroll', setActive); setActive();
      const step = () => (slides[0] ? slides[0].offsetWidth + 16 : 300);
      on(prev, 'click', () => track.scrollBy({ left: -step(), behavior: 'smooth' }));
      on(next, 'click', () => track.scrollBy({ left: step(), behavior: 'smooth' }));
    });
  }

  /* ----------------------------------------------------------------------
   * SIDEBAR — collapse [data-sidebar-toggle], mobile open [data-sidebar-open].
   * -------------------------------------------------------------------- */
  function initSidebar() {
    $$('[data-sidebar-toggle]').forEach((b) =>
      on(b, 'click', () => { const shell = $('.app-shell'); if (shell) shell.classList.toggle('is-collapsed'); })
    );
    $$('[data-sidebar-open]').forEach((b) =>
      on(b, 'click', () => { const sb = $('.sidebar'); if (sb) sb.classList.toggle('is-open'); })
    );
  }

  /* ----------------------------------------------------------------------
   * COPY — [data-copy="text"] → clipboard + toast.
   * -------------------------------------------------------------------- */
  function initCopy() {
    $$('[data-copy]').forEach((b) =>
      on(b, 'click', () => {
        const text = b.dataset.copy || (b.previousElementSibling && b.previousElementSibling.textContent) || '';
        const done = () => toast({ type: 'success', title: '복사됨', message: '클립보드에 복사했습니다.' });
        if (navigator.clipboard) navigator.clipboard.writeText(text).then(done).catch(done);
        else done();
      })
    );
  }

  /* ----------------------------------------------------------------------
   * GAUGES / RADIALS / METERS / BARS — animate to data-value on reveal.
   * -------------------------------------------------------------------- */
  function animateRadial(el) {
    const pct = Math.max(0, Math.min(100, +el.dataset.value || 0));
    const circle = $('.fill', el);
    if (!circle) return;
    const r = circle.r.baseVal.value;
    const c = 2 * Math.PI * r;
    circle.style.strokeDasharray = c;
    circle.style.strokeDashoffset = RM ? c * (1 - pct / 100) : c;
    if (!RM) requestAnimationFrame(() => { circle.style.strokeDashoffset = c * (1 - pct / 100); });
    const num = $('.radial-num', el);
    if (num) num.textContent = pct + '%';
  }
  function initWidgets() {
    $$('[data-radial]').forEach(animateRadial);
    $$('.gauge[data-value]').forEach((g) => {
      const pct = Math.max(0, Math.min(100, +g.dataset.value || 0));
      g.style.setProperty('--gauge-deg', (pct / 100 * 270) + 'deg');
      const num = $('.gauge-num', g); if (num) num.textContent = pct;
    });
    // Meters & bars animate width from 0
    const reveal = (el) => {
      const fill = $('.meter-fill', el) || el;
      const w = el.dataset.value || (fill.dataset && fill.dataset.value) || '0';
      requestAnimationFrame(() => { fill.style.width = w + '%'; });
    };
    $$('.meter[data-value]').forEach(reveal);
    $$('.bars .bar[data-pct]').forEach((bar) => { requestAnimationFrame(() => { bar.style.height = bar.dataset.pct + '%'; }); });
    // Progress bars
    $$('.progress[data-value]').forEach((p) => { const bar = $('.progress-bar', p); if (bar) requestAnimationFrame(() => bar.style.width = (p.dataset.value) + '%'); });
    // Chart draw-in
    $$('.chart').forEach((c) => {
      $$('.line.draw', c).forEach((path) => { try { const len = path.getTotalLength(); path.style.setProperty('--len', len); } catch (e) {} });
      requestAnimationFrame(() => c.classList.add('is-drawn'));
    });
  }

  /* ----------------------------------------------------------------------
   * KANBAN — minimal drag & drop [data-kanban].
   * -------------------------------------------------------------------- */
  function initKanban() {
    const board = $('[data-kanban]');
    if (!board) return;
    let dragged = null;
    $$('.kanban-card', board).forEach((card) => {
      card.setAttribute('draggable', 'true');
      on(card, 'dragstart', () => { dragged = card; card.classList.add('dragging'); });
      on(card, 'dragend', () => { card.classList.remove('dragging'); dragged = null; updateCounts(); });
    });
    $$('[data-kanban-col]', board).forEach((col) => {
      const dropzone = $('.kanban-list', col) || col;
      on(dropzone, 'dragover', (e) => { e.preventDefault(); dropzone.classList.add('is-over'); });
      on(dropzone, 'dragleave', () => dropzone.classList.remove('is-over'));
      on(dropzone, 'drop', (e) => { e.preventDefault(); dropzone.classList.remove('is-over'); if (dragged) dropzone.appendChild(dragged); updateCounts(); });
    });
    function updateCounts() {
      $$('[data-kanban-col]', board).forEach((col) => {
        const count = $$('.kanban-card', col).length;
        const out = $('[data-col-count]', col); if (out) out.textContent = count;
      });
    }
    updateCounts();
  }

  /* ----------------------------------------------------------------------
   * COCKPIT FRAME — inject the fixed viewport HUD chrome into <body>.
   * Decorative (aria-hidden, pointer-events:none). Every page gets it free.
   * -------------------------------------------------------------------- */
  function initCockpit() {
    if ($('.hud-cockpit')) return;
    const c = document.createElement('div');
    c.className = 'hud-cockpit';
    c.setAttribute('aria-hidden', 'true');
    c.innerHTML =
      '<i class="hc-corner tl"></i><i class="hc-corner tr"></i><i class="hc-corner bl"></i><i class="hc-corner br"></i>' +
      '<div class="hc-ruler left"></div><div class="hc-ruler right"></div>' +
      '<div class="hc-status"><span class="hc-dot"></span><span>SYS//AETHER-HUD</span><span class="hc-state">ONLINE</span></div>';
    document.body.appendChild(c);
  }

  /* ----------------------------------------------------------------------
   * NAV TOGGLE — inject a mobile menu button into every .navbar so the links
   * never become unreachable below the 860px breakpoint.
   * -------------------------------------------------------------------- */
  function initNavToggle() {
    $$('.navbar').forEach((nav) => {
      const links = $('.navbar-links', nav);
      if (!links || $('.navbar-toggle', nav)) return;
      if (!links.id) links.id = 'navbar-links-' + Math.random().toString(36).slice(2, 7);
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn btn-icon btn-secondary btn-sm navbar-toggle';
      btn.setAttribute('aria-label', '메뉴 열기');
      btn.setAttribute('aria-expanded', 'false');
      btn.setAttribute('aria-controls', links.id);
      btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M3 12h18M3 18h18"/></svg>';
      (($('.navbar-actions', nav)) || nav).appendChild(btn);
      const setOpen = (open) => {
        links.classList.toggle('is-open', open);
        btn.setAttribute('aria-expanded', String(open));
        btn.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
      };
      on(btn, 'click', (e) => { e.stopPropagation(); setOpen(!links.classList.contains('is-open')); });
      $$('.nav-link', links).forEach((l) => on(l, 'click', () => setOpen(false)));
      on(document, 'click', (e) => { if (!nav.contains(e.target)) setOpen(false); });
      on(document, 'keydown', (e) => { if (e.key === 'Escape') setOpen(false); });
    });
  }

  /* ----------------------------------------------------------------------
   * SCROLL REVEAL — signature "rise" via one shared IntersectionObserver.
   * CSS only hides under html.js, so a dead script never traps content.
   * -------------------------------------------------------------------- */
  function initReveal() {
    const els = $$('[data-reveal]');
    if (!els.length) return;
    if (RM || !('IntersectionObserver' in window)) { els.forEach((el) => el.classList.add('is-in')); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    els.forEach((el) => {
      // stagger within each element's own group of reveal siblings
      const sibs = Array.from(el.parentElement ? el.parentElement.children : [el]).filter((n) => n.hasAttribute && n.hasAttribute('data-reveal'));
      el.style.transitionDelay = Math.min(sibs.indexOf(el), 6) * 70 + 'ms';
      io.observe(el);
    });
  }

  /* ----------------------------------------------------------------------
   * RETICLE TRACKING — [data-reticle-track] follows the pointer across its
   * host (e.g. the 404 search scene). Skipped entirely under reduced-motion.
   * -------------------------------------------------------------------- */
  function initReticleTrack() {
    const els = $$('[data-reticle-track]');
    if (!els.length || RM) return;
    on(document, 'pointermove', (e) => {
      els.forEach((el) => {
        const host = el.offsetParent || document.body;
        const r = host.getBoundingClientRect();
        el.style.transform = 'translate(' + (e.clientX - r.left - el.offsetWidth / 2) + 'px,' + (e.clientY - r.top - el.offsetHeight / 2) + 'px)';
      });
    });
  }

  /* ----------------------------------------------------------------------
   * RADIO GROUP — keyboard-complete custom radios [data-radio-group] with
   * [role=radio][aria-checked]. Space/Enter select; arrows roam.
   * -------------------------------------------------------------------- */
  function initRadioGroup() {
    $$('[data-radio-group]').forEach((group) => {
      const radios = $$('[role="radio"]', group);
      if (!radios.length) return;
      const select = (r) => {
        radios.forEach((x) => { x.setAttribute('aria-checked', 'false'); x.tabIndex = -1; });
        r.setAttribute('aria-checked', 'true'); r.tabIndex = 0;
        group.dispatchEvent(new CustomEvent('radio:change', { detail: { value: r.dataset.value } }));
      };
      radios.forEach((r, i) => {
        on(r, 'click', () => select(r));
        on(r, 'keydown', (e) => {
          if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); select(r); return; }
          let n = null;
          if (e.key === 'ArrowRight' || e.key === 'ArrowDown') n = (i + 1) % radios.length;
          else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') n = (i - 1 + radios.length) % radios.length;
          if (n !== null) { e.preventDefault(); select(radios[n]); radios[n].focus(); }
        });
      });
      const cur = radios.findIndex((r) => r.getAttribute('aria-checked') === 'true');
      radios.forEach((r, i) => { r.tabIndex = (i === (cur >= 0 ? cur : 0)) ? 0 : -1; });
    });
  }

  /* ----------------------------------------------------------------------
   * THREAT MODE — one <html data-alert> attribute repaints the whole signal
   * palette (see semantic.css). Syncs cockpit status + any live region.
   * -------------------------------------------------------------------- */
  function setAlert(level) {
    if (!level || level === 'nominal') document.documentElement.removeAttribute('data-alert');
    else document.documentElement.setAttribute('data-alert', level);
    const map = { amber: ['CAUTION', 'is-warn'], red: ['ALERT', 'is-alert'] };
    const w = map[level];
    $$('.hud-cockpit .hc-state').forEach((s) => {
      s.className = 'hc-state' + (w ? ' ' + w[1] : '');
      s.textContent = w ? w[0] : 'ONLINE';
    });
    $$('[data-alert-control] [role="radio"]').forEach((r) => {
      const sel = r.dataset.value === (level || 'nominal');
      r.setAttribute('aria-checked', String(sel));
      r.tabIndex = sel ? 0 : -1;
    });
    $$('[data-alert-live]').forEach((el) => {
      el.textContent = level === 'red'
        ? '경계 태세로 전환했습니다. 전 구역 신호 팔레트가 레드로 바뀝니다.'
        : level === 'amber'
        ? '주의 태세로 전환했습니다. 시스템이 앰버 경계 상태입니다.'
        : '정상 운용 중입니다. 모든 시스템이 시안 상태로 안정적입니다.';
    });
  }
  function initAlertToggle() {
    const ctrl = $('[data-alert-control]');
    if (ctrl) on(ctrl, 'radio:change', (e) => setAlert(e.detail.value));
    setAlert(document.documentElement.getAttribute('data-alert') || 'nominal');
  }

  /* ----------------------------------------------------------------------
   * INIT ALL
   * -------------------------------------------------------------------- */
  function init() {
    initReveal();      // first — never leave [data-reveal] trapped if a later widget throws
    initCockpit();
    initNavToggle();
    initTheme();
    initTelemetry();
    initBoot();
    initTabs();
    initAccordion();
    initSegmented();
    initSliders();
    initSteppers();
    initRatings();
    initChipInputs();
    initFileUploads();
    initComboboxes();
    initMenus();
    initPopovers();
    initContextMenu();
    initModals();
    initDrawers();
    initToastTriggers();
    initCommandPalette();
    initTables();
    initCarousels();
    initSidebar();
    initCopy();
    initWidgets();
    initKanban();
    initRadioGroup();
    initAlertToggle();
    initReticleTrack();
  }

  // Public API
  window.HUD = { toast: toast, theme: applyTheme, alert: setAlert };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
