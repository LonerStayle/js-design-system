/* ============================================================================
   THEME 11 — BAUHAUS · app.js
   Vanilla-JS interaction layer. Auto-initialises from data-attributes so every
   page just needs to include this file and use the documented markup.
   Exposes window.Bauhaus = { toast, openModal, closeModal, setTheme }.
   ============================================================================ */
(function () {
  'use strict';

  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const on = (el, ev, fn, opt) => el && el.addEventListener(ev, fn, opt);

  /* ----------------------------------------------------------------------- *
   * THEME — light / dark with persistence                                    *
   * ----------------------------------------------------------------------- */
  const THEME_KEY = 'bauhaus-theme';
  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem(THEME_KEY, theme); } catch (e) {}
    $$('[data-theme-toggle]').forEach((b) => b.setAttribute('aria-pressed', String(theme === 'dark')));
  }
  function initTheme() {
    let saved = null;
    try { saved = localStorage.getItem(THEME_KEY); } catch (e) {}
    if (saved) setTheme(saved);
    else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) setTheme('dark');
    else setTheme('light');
    document.addEventListener('click', (e) => {
      const t = e.target.closest('[data-theme-toggle]');
      if (!t) return;
      const cur = document.documentElement.getAttribute('data-theme');
      setTheme(cur === 'dark' ? 'light' : 'dark');
    });
  }

  /* ----------------------------------------------------------------------- *
   * FOCUS TRAP helper (modal / drawer / cmdk)                                *
   * ----------------------------------------------------------------------- */
  const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';
  function trapFocus(container, e) {
    const nodes = $$(FOCUSABLE, container).filter((n) => n.offsetParent !== null);
    if (!nodes.length) return;
    const first = nodes[0], last = nodes[nodes.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  let lastFocused = null;
  function getScrim() {
    let s = $('.scrim[data-shared-scrim]');
    if (!s) {
      s = document.createElement('div');
      s.className = 'scrim';
      s.setAttribute('data-shared-scrim', '');
      document.body.appendChild(s);
    }
    return s;
  }

  /* ----------------------------------------------------------------------- *
   * MODAL                                                                    *
   * ----------------------------------------------------------------------- */
  let openOverlays = [];
  function openModal(id) {
    const modal = typeof id === 'string' ? document.getElementById(id) : id;
    if (!modal) return;
    lastFocused = document.activeElement;
    const scrim = getScrim();
    scrim.classList.add('is-open');
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    openOverlays.push({ el: modal, type: 'modal' });
    const focusTarget = $('[autofocus]', modal) || $(FOCUSABLE, modal);
    if (focusTarget) setTimeout(() => focusTarget.focus(), 50);
  }
  function closeModal(modal) {
    modal = modal || (openOverlays.length && openOverlays[openOverlays.length - 1].el);
    if (!modal) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    openOverlays = openOverlays.filter((o) => o.el !== modal);
    if (!openOverlays.length) {
      getScrim().classList.remove('is-open');
      document.body.style.overflow = '';
    }
    if (lastFocused) lastFocused.focus();
  }

  /* ----------------------------------------------------------------------- *
   * DRAWER                                                                   *
   * ----------------------------------------------------------------------- */
  function openDrawer(id) {
    const d = typeof id === 'string' ? document.getElementById(id) : id;
    if (!d) return;
    lastFocused = document.activeElement;
    getScrim().classList.add('is-open');
    d.classList.add('is-open');
    d.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    openOverlays.push({ el: d, type: 'drawer' });
    const f = $(FOCUSABLE, d); if (f) setTimeout(() => f.focus(), 50);
  }
  function closeDrawer(d) {
    d = d || (openOverlays.length && openOverlays[openOverlays.length - 1].el);
    if (!d) return;
    d.classList.remove('is-open');
    d.setAttribute('aria-hidden', 'true');
    openOverlays = openOverlays.filter((o) => o.el !== d);
    if (!openOverlays.length) { getScrim().classList.remove('is-open'); document.body.style.overflow = ''; }
    if (lastFocused) lastFocused.focus();
  }

  function initOverlays() {
    document.addEventListener('click', (e) => {
      const om = e.target.closest('[data-open-modal]');
      if (om) { e.preventDefault(); openModal(om.getAttribute('data-open-modal')); return; }
      const od = e.target.closest('[data-open-drawer]');
      if (od) { e.preventDefault(); openDrawer(od.getAttribute('data-open-drawer')); return; }
      if (e.target.closest('[data-close-modal]')) { closeModal(e.target.closest('.modal')); return; }
      if (e.target.closest('[data-close-drawer]')) { closeDrawer(e.target.closest('.drawer')); return; }
    });
    // scrim click closes topmost
    document.addEventListener('click', (e) => {
      if (e.target.matches('.scrim[data-shared-scrim]') && openOverlays.length) {
        const top = openOverlays[openOverlays.length - 1];
        top.type === 'drawer' ? closeDrawer(top.el) : closeModal(top.el);
      }
      // clicking modal backdrop (the .modal grid area, not the dialog)
      if (e.target.classList.contains('modal') && e.target.classList.contains('is-open')) closeModal(e.target);
    });
    // ESC + focus trap
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (cmdkOpen) { closeCmdk(); return; }
        if (openOverlays.length) {
          const top = openOverlays[openOverlays.length - 1];
          top.type === 'drawer' ? closeDrawer(top.el) : closeModal(top.el);
        }
        closeAllMenus();
      }
      if (e.key === 'Tab' && openOverlays.length) {
        const top = openOverlays[openOverlays.length - 1];
        const inner = $('.modal__dialog', top.el) || top.el;
        trapFocus(inner, e);
      }
    });
  }

  /* ----------------------------------------------------------------------- *
   * TOAST                                                                    *
   * ----------------------------------------------------------------------- */
  function toastRegion() {
    let r = $('.toast-region');
    if (!r) { r = document.createElement('div'); r.className = 'toast-region'; r.setAttribute('role', 'region'); r.setAttribute('aria-label', 'Notifications'); document.body.appendChild(r); }
    return r;
  }
  function toast(opts) {
    opts = opts || {};
    const { title = 'Notification', text = '', variant = 'info', duration = 4000 } = typeof opts === 'string' ? { title: opts } : opts;
    const region = toastRegion();
    const el = document.createElement('div');
    el.className = 'toast toast--' + variant;
    el.setAttribute('role', 'status');
    el.innerHTML =
      '<span class="toast__bar"></span>' +
      '<div class="toast__body"><div class="toast__title"></div>' +
      (text ? '<div class="toast__text"></div>' : '') + '</div>' +
      '<button class="toast__close btn-icon btn-sm" aria-label="Dismiss"><span class="ico ico-x ico-sm"></span></button>';
    el.querySelector('.toast__title').textContent = title;
    if (text) el.querySelector('.toast__text').textContent = text;
    region.appendChild(el);
    const dismiss = () => { el.classList.add('is-leaving'); setTimeout(() => el.remove(), 220); };
    on(el.querySelector('.toast__close'), 'click', dismiss);
    if (duration > 0) setTimeout(dismiss, duration);
    return el;
  }
  function initToasts() {
    document.addEventListener('click', (e) => {
      const t = e.target.closest('[data-toast]');
      if (!t) return;
      toast({ title: t.getAttribute('data-toast-title') || 'Saved', text: t.getAttribute('data-toast-text') || '', variant: t.getAttribute('data-toast-variant') || 'info' });
    });
  }

  /* ----------------------------------------------------------------------- *
   * TABS                                                                     *
   * ----------------------------------------------------------------------- */
  function initTabs() {
    $$('[data-tabs]').forEach((group) => {
      const tabs = $$('[role="tab"]', group);
      const activate = (tab) => {
        tabs.forEach((t) => {
          const sel = t === tab;
          t.setAttribute('aria-selected', String(sel));
          t.tabIndex = sel ? 0 : -1;
          const panel = document.getElementById(t.getAttribute('aria-controls'));
          if (panel) panel.hidden = !sel;
        });
      };
      tabs.forEach((tab, i) => {
        on(tab, 'click', () => activate(tab));
        on(tab, 'keydown', (e) => {
          let idx = null;
          if (e.key === 'ArrowRight') idx = (i + 1) % tabs.length;
          else if (e.key === 'ArrowLeft') idx = (i - 1 + tabs.length) % tabs.length;
          else if (e.key === 'Home') idx = 0;
          else if (e.key === 'End') idx = tabs.length - 1;
          if (idx !== null) { e.preventDefault(); tabs[idx].focus(); activate(tabs[idx]); }
        });
      });
    });
  }

  /* ----------------------------------------------------------------------- *
   * ACCORDION                                                                *
   * ----------------------------------------------------------------------- */
  function initAccordions() {
    document.addEventListener('click', (e) => {
      const trig = e.target.closest('.accordion__trigger');
      if (!trig) return;
      const panel = trig.nextElementSibling;
      const expanded = trig.getAttribute('aria-expanded') === 'true';
      const single = trig.closest('[data-accordion="single"]');
      if (single && !expanded) {
        $$('.accordion__trigger', single).forEach((t) => {
          t.setAttribute('aria-expanded', 'false');
          if (t.nextElementSibling) t.nextElementSibling.classList.remove('is-open');
        });
      }
      trig.setAttribute('aria-expanded', String(!expanded));
      if (panel) panel.classList.toggle('is-open', !expanded);
    });
  }

  /* ----------------------------------------------------------------------- *
   * MENU / DROPDOWN / POPOVER                                                *
   * ----------------------------------------------------------------------- */
  function closeAllMenus() {
    $$('.menu__panel:not([hidden]), .popover__panel:not([hidden])').forEach((p) => {
      p.hidden = true;
      const trig = p.parentElement.querySelector('[aria-expanded]');
      if (trig) trig.setAttribute('aria-expanded', 'false');
    });
  }
  function initMenus() {
    document.addEventListener('click', (e) => {
      const trig = e.target.closest('[data-menu-toggle], [data-popover-toggle]');
      if (trig) {
        e.preventDefault();
        const panel = trig.parentElement.querySelector('.menu__panel, .popover__panel');
        const willOpen = panel.hidden;
        closeAllMenus();
        if (willOpen) { panel.hidden = false; trig.setAttribute('aria-expanded', 'true'); }
        return;
      }
      if (!e.target.closest('.menu__panel, .popover__panel')) closeAllMenus();
    });
  }

  /* ----------------------------------------------------------------------- *
   * COMMAND PALETTE (⌘K)                                                     *
   * ----------------------------------------------------------------------- */
  let cmdkOpen = false;
  function openCmdk() {
    const c = $('[data-cmdk]'); if (!c) return;
    lastFocused = document.activeElement;
    getScrim().classList.add('is-open');
    c.classList.add('is-open'); c.setAttribute('aria-hidden', 'false');
    cmdkOpen = true; document.body.style.overflow = 'hidden';
    const input = $('.cmdk__input', c);
    if (input) { input.value = ''; filterCmdk(c, ''); setTimeout(() => input.focus(), 50); }
    setActiveCmdkItem(c, firstVisibleItem(c));
  }
  function closeCmdk() {
    const c = $('[data-cmdk]'); if (!c) return;
    c.classList.remove('is-open'); c.setAttribute('aria-hidden', 'true');
    cmdkOpen = false;
    if (!openOverlays.length) { getScrim().classList.remove('is-open'); document.body.style.overflow = ''; }
    if (lastFocused) lastFocused.focus();
  }
  function visibleItems(c) { return $$('.cmdk__item', c).filter((i) => !i.hidden); }
  function firstVisibleItem(c) { return visibleItems(c)[0] || null; }
  function setActiveCmdkItem(c, item) {
    $$('.cmdk__item', c).forEach((i) => i.classList.remove('is-active'));
    if (item) { item.classList.add('is-active'); item.scrollIntoView({ block: 'nearest' }); }
  }
  function filterCmdk(c, q) {
    q = q.toLowerCase().trim();
    let any = false;
    $$('.cmdk__item', c).forEach((item) => {
      const text = (item.getAttribute('data-keywords') || item.textContent).toLowerCase();
      const match = !q || text.includes(q);
      item.hidden = !match;
      if (match) any = true;
    });
    $$('.cmdk__group-label', c).forEach((label) => {
      let sib = label.nextElementSibling, hasVisible = false;
      while (sib && sib.classList.contains('cmdk__item')) { if (!sib.hidden) hasVisible = true; sib = sib.nextElementSibling; }
      label.hidden = !hasVisible;
    });
    let empty = $('.cmdk__empty', c);
    if (empty) empty.hidden = any;
  }
  function initCmdk() {
    const c = $('[data-cmdk]'); if (!c) return;
    const input = $('.cmdk__input', c);
    document.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); cmdkOpen ? closeCmdk() : openCmdk(); }
    });
    document.addEventListener('click', (e) => { if (e.target.closest('[data-open-cmdk]')) { e.preventDefault(); openCmdk(); } });
    on(input, 'input', () => { filterCmdk(c, input.value); setActiveCmdkItem(c, firstVisibleItem(c)); });
    on(c, 'keydown', (e) => {
      const items = visibleItems(c);
      let idx = items.findIndex((i) => i.classList.contains('is-active'));
      if (e.key === 'ArrowDown') { e.preventDefault(); setActiveCmdkItem(c, items[Math.min(idx + 1, items.length - 1)]); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); setActiveCmdkItem(c, items[Math.max(idx - 1, 0)]); }
      else if (e.key === 'Enter') { e.preventDefault(); const active = items[idx] || items[0]; if (active) runCmdkItem(active); }
    });
    $$('.cmdk__item', c).forEach((item) => {
      on(item, 'click', () => runCmdkItem(item));
      on(item, 'mousemove', () => setActiveCmdkItem(c, item));
    });
  }
  function runCmdkItem(item) {
    const href = item.getAttribute('data-href');
    const action = item.getAttribute('data-action');
    closeCmdk();
    if (action === 'toggle-theme') { const cur = document.documentElement.getAttribute('data-theme'); setTheme(cur === 'dark' ? 'light' : 'dark'); }
    else if (action === 'toast') toast({ title: item.textContent.trim(), variant: 'info' });
    else if (href) window.location.href = href;
    else toast({ title: 'Action: ' + item.textContent.trim(), variant: 'info' });
  }

  /* ----------------------------------------------------------------------- *
   * SLIDER value                                                             *
   * ----------------------------------------------------------------------- */
  function initSliders() {
    $$('[data-slider]').forEach((s) => {
      const out = document.getElementById(s.getAttribute('data-slider')) || s.parentElement.querySelector('.slider__value');
      const update = () => { if (out) out.textContent = (s.getAttribute('data-prefix') || '') + s.value + (s.getAttribute('data-suffix') || ''); };
      on(s, 'input', update); update();
    });
  }

  /* ----------------------------------------------------------------------- *
   * STEPPER                                                                  *
   * ----------------------------------------------------------------------- */
  function initSteppers() {
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-step]');
      if (!btn) return;
      const stepper = btn.closest('.stepper');
      const input = $('.stepper__input', stepper);
      const min = input.min !== '' ? Number(input.min) : -Infinity;
      const max = input.max !== '' ? Number(input.max) : Infinity;
      let v = Number(input.value || 0) + Number(btn.getAttribute('data-step'));
      v = Math.max(min, Math.min(max, v));
      input.value = v; input.dispatchEvent(new Event('change', { bubbles: true }));
    });
  }

  /* ----------------------------------------------------------------------- *
   * SEARCHBAR clear                                                          *
   * ----------------------------------------------------------------------- */
  function initSearchbars() {
    $$('.searchbar').forEach((sb) => {
      const input = $('.input', sb), clear = $('.searchbar__clear', sb);
      const sync = () => sb.classList.toggle('has-value', !!input.value);
      on(input, 'input', sync);
      on(clear, 'click', () => { input.value = ''; sync(); input.focus(); input.dispatchEvent(new Event('input', { bubbles: true })); });
      sync();
    });
  }

  /* ----------------------------------------------------------------------- *
   * FILE UPLOAD                                                              *
   * ----------------------------------------------------------------------- */
  function initFileUpload() {
    $$('.fileupload').forEach((zone) => {
      const input = $('input[type="file"]', zone) || $('#' + zone.getAttribute('data-input'));
      const list = zone.parentElement.querySelector('[data-file-list]');
      const render = (files) => {
        if (!list) return; list.innerHTML = '';
        Array.from(files).forEach((f) => {
          const chip = document.createElement('span');
          chip.className = 'filechip';
          chip.innerHTML = '<span class="shape shape-square shape-sm fill-blue"></span><span></span>';
          chip.querySelector('span:last-child').textContent = f.name;
          list.appendChild(chip);
        });
      };
      on(zone, 'click', () => input && input.click());
      on(input, 'change', () => render(input.files));
      ['dragover', 'dragenter'].forEach((ev) => on(zone, ev, (e) => { e.preventDefault(); zone.classList.add('is-dragover'); }));
      ['dragleave', 'drop'].forEach((ev) => on(zone, ev, (e) => { e.preventDefault(); zone.classList.remove('is-dragover'); }));
      on(zone, 'drop', (e) => { if (input && e.dataTransfer) { input.files = e.dataTransfer.files; render(e.dataTransfer.files); } });
    });
  }

  /* ----------------------------------------------------------------------- *
   * CHIP INPUT                                                               *
   * ----------------------------------------------------------------------- */
  function initChipInputs() {
    $$('[data-chipinput]').forEach((ci) => {
      const field = $('.chipinput__field', ci);
      const addChip = (text) => {
        if (!text.trim()) return;
        const chip = document.createElement('span');
        chip.className = 'chip';
        chip.innerHTML = '<span></span><button class="chip__remove" aria-label="Remove"><span class="ico ico-x ico-sm"></span></button>';
        chip.querySelector('span').textContent = text.trim();
        ci.insertBefore(chip, field);
      };
      on(field, 'keydown', (e) => {
        if ((e.key === 'Enter' || e.key === ',') && field.value.trim()) { e.preventDefault(); addChip(field.value); field.value = ''; }
        else if (e.key === 'Backspace' && !field.value) { const chips = $$('.chip', ci); if (chips.length) chips[chips.length - 1].remove(); }
      });
      on(ci, 'click', (e) => { if (e.target.closest('.chip__remove')) e.target.closest('.chip').remove(); else field.focus(); });
    });
  }

  /* ----------------------------------------------------------------------- *
   * COMBOBOX / AUTOCOMPLETE                                                  *
   * ----------------------------------------------------------------------- */
  function initComboboxes() {
    $$('[data-combobox]').forEach((cb) => {
      const input = $('.input', cb), list = $('.listbox, .combobox__list', cb);
      if (!input || !list) return;
      const options = $$('.listbox__option', list);
      const open = () => { list.hidden = false; };
      const close = () => { list.hidden = true; };
      const filter = () => {
        const q = input.value.toLowerCase();
        let any = false;
        options.forEach((o) => { const m = o.textContent.toLowerCase().includes(q); o.hidden = !m; if (m) any = true; });
        any ? open() : close();
      };
      on(input, 'focus', open);
      on(input, 'input', filter);
      options.forEach((o) => on(o, 'click', () => {
        if (cb.hasAttribute('data-multi')) {
          o.setAttribute('aria-selected', o.getAttribute('aria-selected') === 'true' ? 'false' : 'true');
        } else { input.value = o.textContent.trim(); close(); }
      }));
      document.addEventListener('click', (e) => { if (!cb.contains(e.target)) close(); });
    });
  }

  /* ----------------------------------------------------------------------- *
   * TABLE — sort, select-all, row select, pagination                         *
   * ----------------------------------------------------------------------- */
  function initTables() {
    $$('[data-table]').forEach((table) => {
      const tbody = $('tbody', table);
      // sorting
      $$('th[data-sort]', table).forEach((th, colIndex) => {
        th.classList.add('is-sortable');
        on(th, 'click', () => {
          const idx = Array.from(th.parentElement.children).indexOf(th);
          const type = th.getAttribute('data-sort');
          const cur = th.getAttribute('aria-sort');
          const dir = cur === 'ascending' ? 'descending' : 'ascending';
          $$('th[data-sort]', table).forEach((o) => o.removeAttribute('aria-sort'));
          th.setAttribute('aria-sort', dir);
          const rows = $$('tr', tbody);
          rows.sort((a, b) => {
            let av = a.children[idx].getAttribute('data-value') || a.children[idx].textContent.trim();
            let bv = b.children[idx].getAttribute('data-value') || b.children[idx].textContent.trim();
            if (type === 'number') { av = parseFloat(av.replace(/[^0-9.-]/g, '')) || 0; bv = parseFloat(bv.replace(/[^0-9.-]/g, '')) || 0; }
            const cmp = av > bv ? 1 : av < bv ? -1 : 0;
            return dir === 'ascending' ? cmp : -cmp;
          });
          rows.forEach((r) => tbody.appendChild(r));
        });
      });
      // select all
      const selectAll = $('[data-select-all]', table);
      const rowChecks = () => $$('tbody [data-row-check]', table);
      const syncSelectAll = () => {
        const checks = rowChecks(), checked = checks.filter((c) => c.checked);
        if (selectAll) {
          const cb = selectAll.matches('input') ? selectAll : $('input', selectAll);
          if (cb) { cb.indeterminate = checked.length > 0 && checked.length < checks.length; cb.checked = checks.length > 0 && checked.length === checks.length; }
        }
      };
      if (selectAll) {
        const cb = selectAll.matches('input') ? selectAll : $('input', selectAll);
        on(cb, 'change', () => { rowChecks().forEach((c) => { c.checked = cb.checked; c.closest('tr').classList.toggle('is-selected', cb.checked); }); });
      }
      on(tbody, 'change', (e) => {
        const c = e.target.closest('[data-row-check]');
        if (c) { c.closest('tr').classList.toggle('is-selected', c.checked); syncSelectAll(); }
      });
    });
  }

  /* ----------------------------------------------------------------------- *
   * CAROUSEL                                                                 *
   * ----------------------------------------------------------------------- */
  function initCarousels() {
    $$('[data-carousel]').forEach((car) => {
      const track = $('.carousel__track', car);
      const slides = $$('.carousel__slide', car);
      const dotsWrap = $('.carousel__dots', car);
      let idx = 0;
      if (dotsWrap && !dotsWrap.children.length) slides.forEach((_, i) => { const d = document.createElement('button'); d.className = 'carousel__dot'; d.setAttribute('aria-label', 'Slide ' + (i + 1)); dotsWrap.appendChild(d); });
      const dots = $$('.carousel__dot', car);
      const go = (n) => { idx = (n + slides.length) % slides.length; track.style.transform = 'translateX(' + (-idx * 100) + '%)'; dots.forEach((d, i) => d.classList.toggle('is-active', i === idx)); };
      on($('.carousel__btn--next', car), 'click', () => go(idx + 1));
      on($('.carousel__btn--prev', car), 'click', () => go(idx - 1));
      dots.forEach((d, i) => on(d, 'click', () => go(i)));
      go(0);
      if (car.hasAttribute('data-autoplay')) {
        let timer = setInterval(() => go(idx + 1), Number(car.getAttribute('data-autoplay')) || 5000);
        on(car, 'mouseenter', () => clearInterval(timer));
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) clearInterval(timer);
      }
    });
  }

  /* ----------------------------------------------------------------------- *
   * CALENDAR                                                                 *
   * ----------------------------------------------------------------------- */
  const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const DOW = ['Mo','Tu','We','Th','Fr','Sa','Su'];
  function initCalendars() {
    $$('[data-calendar]').forEach((cal) => {
      let view = new Date();
      view.setDate(1);
      const selected = new Set();
      const render = () => {
        const y = view.getFullYear(), m = view.getMonth();
        const first = (new Date(y, m, 1).getDay() + 6) % 7; // Monday-first
        const days = new Date(y, m + 1, 0).getDate();
        const prevDays = new Date(y, m, 0).getDate();
        const today = new Date();
        let html = '<div class="calendar__head"><button class="btn-icon btn-sm" data-cal-prev aria-label="Prev month"><span class="ico ico-arrow-l ico-sm"></span></button>';
        html += '<div class="calendar__month">' + MONTHS[m] + ' ' + y + '</div>';
        html += '<button class="btn-icon btn-sm" data-cal-next aria-label="Next month"><span class="ico ico-arrow-r ico-sm"></span></button></div>';
        html += '<div class="calendar__grid">';
        DOW.forEach((d) => html += '<div class="calendar__dow">' + d + '</div>');
        for (let i = 0; i < first; i++) html += '<div class="calendar__day is-muted">' + (prevDays - first + i + 1) + '</div>';
        for (let d = 1; d <= days; d++) {
          const isToday = today.getFullYear() === y && today.getMonth() === m && today.getDate() === d;
          const key = y + '-' + m + '-' + d;
          const cls = 'calendar__day' + (isToday ? ' is-today' : '') + (selected.has(key) ? ' is-selected' : '') + ([3,12,21].includes(d) ? ' has-event' : '');
          html += '<button class="' + cls + '" data-cal-day="' + key + '">' + d + '</button>';
        }
        html += '</div>';
        cal.innerHTML = html;
      };
      on(cal, 'click', (e) => {
        if (e.target.closest('[data-cal-prev]')) { view.setMonth(view.getMonth() - 1); render(); }
        else if (e.target.closest('[data-cal-next]')) { view.setMonth(view.getMonth() + 1); render(); }
        else { const day = e.target.closest('[data-cal-day]'); if (day) { const k = day.getAttribute('data-cal-day'); selected.clear(); selected.add(k); render(); } }
      });
      render();
    });
  }

  /* ----------------------------------------------------------------------- *
   * WIZARD / STEPS                                                           *
   * ----------------------------------------------------------------------- */
  function initWizards() {
    $$('[data-wizard]').forEach((wiz) => {
      const steps = $$('.steps__step', wiz);
      const panels = $$('[data-wizard-panel]', wiz);
      let cur = 0;
      const render = () => {
        steps.forEach((s, i) => { s.classList.toggle('is-active', i === cur); s.classList.toggle('is-complete', i < cur); });
        panels.forEach((p, i) => p.hidden = i !== cur);
        const prev = $('[data-wizard-prev]', wiz), next = $('[data-wizard-next]', wiz), done = $('[data-wizard-done]', wiz);
        if (prev) prev.disabled = cur === 0;
        if (next) next.hidden = cur === panels.length - 1;
        if (done) done.hidden = cur !== panels.length - 1;
      };
      on(wiz, 'click', (e) => {
        if (e.target.closest('[data-wizard-next]')) { cur = Math.min(cur + 1, panels.length - 1); render(); }
        else if (e.target.closest('[data-wizard-prev]')) { cur = Math.max(cur - 1, 0); render(); }
        else if (e.target.closest('[data-wizard-done]')) { toast({ title: 'Setup complete!', text: 'Welcome aboard.', variant: 'success' }); }
      });
      render();
    });
  }

  /* ----------------------------------------------------------------------- *
   * PROGRESS RING set value                                                  *
   * ----------------------------------------------------------------------- */
  function initRings() {
    $$('[data-ring]').forEach((ring) => {
      const bar = $('.progress-ring__bar', ring);
      if (!bar) return;
      const r = bar.r.baseVal.value;
      const c = 2 * Math.PI * r;
      const val = Number(ring.getAttribute('data-ring')) || 0;
      bar.style.strokeDasharray = c;
      bar.style.strokeDashoffset = c * (1 - val / 100);
    });
  }

  /* ----------------------------------------------------------------------- *
   * SEGMENTED CONTROL + billing toggle                                       *
   * ----------------------------------------------------------------------- */
  function initSegmented() {
    $$('.segmented').forEach((seg) => {
      $$('.segmented__option', seg).forEach((opt) => {
        on(opt, 'click', () => {
          $$('.segmented__option', seg).forEach((o) => o.setAttribute('aria-pressed', 'false'));
          opt.setAttribute('aria-pressed', 'true');
          const val = opt.getAttribute('data-value');
          if (seg.hasAttribute('data-billing')) {
            const yearly = val === 'yearly';
            $$('[data-price-month]').forEach((el) => el.hidden = yearly);
            $$('[data-price-year]').forEach((el) => el.hidden = !yearly);
          }
          seg.dispatchEvent(new CustomEvent('segment:change', { detail: { value: val } }));
        });
      });
    });
  }

  /* ----------------------------------------------------------------------- *
   * SIDEBAR collapse + mobile                                                *
   * ----------------------------------------------------------------------- */
  function initSidebar() {
    document.addEventListener('click', (e) => {
      if (e.target.closest('[data-sidebar-toggle]')) { const sb = $('.sidebar'); if (sb) sb.classList.toggle('is-collapsed'); }
      if (e.target.closest('[data-sidebar-mobile]')) { const sb = $('.sidebar'); if (sb) sb.classList.toggle('is-mobile-open'); }
    });
  }

  /* ----------------------------------------------------------------------- *
   * COPY to clipboard                                                        *
   * ----------------------------------------------------------------------- */
  function initCopy() {
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-copy], .codeblock__copy');
      if (!btn) return;
      let text = btn.getAttribute('data-copy');
      if (!text) { const block = btn.closest('.codeblock'); const code = block && $('code', block); text = code ? code.textContent : ''; }
      if (navigator.clipboard) navigator.clipboard.writeText(text).then(() => toast({ title: 'Copied to clipboard', variant: 'success', duration: 1800 }));
      else toast({ title: 'Copied', variant: 'success', duration: 1800 });
    });
  }

  /* ----------------------------------------------------------------------- *
   * CONTEXT MENU                                                             *
   * ----------------------------------------------------------------------- */
  function initContextMenu() {
    $$('[data-context-menu]').forEach((zone) => {
      const menu = document.getElementById(zone.getAttribute('data-context-menu'));
      if (!menu) return;
      on(zone, 'contextmenu', (e) => {
        e.preventDefault();
        menu.hidden = false;
        const x = Math.min(e.clientX, window.innerWidth - menu.offsetWidth - 8);
        const y = Math.min(e.clientY, window.innerHeight - menu.offsetHeight - 8);
        menu.style.left = x + 'px'; menu.style.top = y + 'px';
      });
      document.addEventListener('click', () => { menu.hidden = true; });
      document.addEventListener('scroll', () => { menu.hidden = true; }, true);
    });
  }

  /* ----------------------------------------------------------------------- *
   * RATING (interactive, reflects value)                                     *
   * ----------------------------------------------------------------------- */
  function initRatings() {
    $$('[data-rating]').forEach((r) => {
      const out = r.parentElement.querySelector('[data-rating-value]');
      on(r, 'change', (e) => { if (out && e.target.value) out.textContent = e.target.value; });
    });
  }

  /* ----------------------------------------------------------------------- *
   * INIT                                                                     *
   * ----------------------------------------------------------------------- */
  function init() {
    initTheme();
    initOverlays();
    initToasts();
    initTabs();
    initAccordions();
    initMenus();
    initCmdk();
    initSliders();
    initSteppers();
    initSearchbars();
    initFileUpload();
    initChipInputs();
    initComboboxes();
    initTables();
    initCarousels();
    initCalendars();
    initWizards();
    initRings();
    initSegmented();
    initSidebar();
    initCopy();
    initContextMenu();
    initRatings();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  window.Bauhaus = { toast, openModal, closeModal, openDrawer, closeDrawer, setTheme, openCmdk, closeCmdk };
})();
