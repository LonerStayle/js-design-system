/* ============================================================================
   THEME 17 — BOTANICAL JOURNAL · app.js
   All interactions, vanilla JS, no dependencies. Self-initializing, idempotent,
   delegation-based so it works on every page that links it.
   ============================================================================ */
(function () {
  'use strict';

  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const on = (el, ev, fn, opts) => el && el.addEventListener(ev, fn, opts);
  const prefersReduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------------ */
  /* THEME — light / dark, persisted                                     */
  /* ------------------------------------------------------------------ */
  const THEME_KEY = 'bj-theme';
  const Theme = {
    get() {
      return localStorage.getItem(THEME_KEY) ||
        (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    },
    apply(t) {
      document.documentElement.setAttribute('data-theme', t);
      $$('[data-theme-toggle]').forEach(btn => {
        btn.setAttribute('aria-pressed', String(t === 'dark'));
        const lbl = btn.querySelector('[data-theme-label]');
        if (lbl) lbl.textContent = t === 'dark' ? '황혼' : '주간';
      });
    },
    set(t) { localStorage.setItem(THEME_KEY, t); this.apply(t); },
    toggle() { this.set(this.get() === 'dark' ? 'light' : 'dark'); }
  };
  Theme.apply(Theme.get());
  document.addEventListener('click', e => {
    const t = e.target.closest('[data-theme-toggle]');
    if (t) { Theme.toggle(); }
  });

  /* ------------------------------------------------------------------ */
  /* TABS — [data-tabs] containing [role=tab] + [role=tabpanel]          */
  /* ------------------------------------------------------------------ */
  function initTabs(root) {
    const tabs = $$('[role="tab"]', root);
    const select = (tab) => {
      tabs.forEach(t => {
        const sel = t === tab;
        t.setAttribute('aria-selected', String(sel));
        t.tabIndex = sel ? 0 : -1;
        const panel = document.getElementById(t.getAttribute('aria-controls'));
        if (panel) panel.hidden = !sel;
      });
    };
    tabs.forEach((tab, i) => {
      on(tab, 'click', () => select(tab));
      on(tab, 'keydown', e => {
        let idx = null;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') idx = (i + 1) % tabs.length;
        if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   idx = (i - 1 + tabs.length) % tabs.length;
        if (e.key === 'Home') idx = 0;
        if (e.key === 'End')  idx = tabs.length - 1;
        if (idx !== null) { e.preventDefault(); tabs[idx].focus(); select(tabs[idx]); }
      });
    });
  }

  /* ------------------------------------------------------------------ */
  /* ACCORDION — [data-accordion] > .accordion__item > trigger/panel     */
  /* ------------------------------------------------------------------ */
  function initAccordion(root) {
    const single = root.hasAttribute('data-accordion-single');
    $$('.accordion__trigger', root).forEach(trigger => {
      on(trigger, 'click', () => {
        const item = trigger.closest('.accordion__item');
        const panel = item.querySelector('.accordion__panel');
        const open = trigger.getAttribute('aria-expanded') === 'true';
        if (single && !open) {
          $$('.accordion__trigger', root).forEach(t => {
            t.setAttribute('aria-expanded', 'false');
            const p = t.closest('.accordion__item').querySelector('.accordion__panel');
            p.style.maxHeight = null;
          });
        }
        trigger.setAttribute('aria-expanded', String(!open));
        panel.style.maxHeight = open ? null : panel.scrollHeight + 'px';
      });
    });
  }

  /* ------------------------------------------------------------------ */
  /* FOCUS TRAP helper                                                    */
  /* ------------------------------------------------------------------ */
  function trapFocus(container, e) {
    const focusables = $$('a[href],button:not([disabled]),textarea,input,select,[tabindex]:not([tabindex="-1"])', container)
      .filter(el => el.offsetParent !== null);
    if (!focusables.length) return;
    const first = focusables[0], last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  /* ------------------------------------------------------------------ */
  /* MODAL — [data-modal-open="id"] / [data-modal-close]                 */
  /* ------------------------------------------------------------------ */
  let lastFocused = null;
  function openModal(id) {
    const backdrop = document.getElementById(id);
    if (!backdrop) return;
    lastFocused = document.activeElement;
    backdrop.classList.add('is-open');
    backdrop.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    const focusTarget = backdrop.querySelector('[autofocus],input,button,textarea,select') || backdrop.querySelector('.modal,.drawer');
    setTimeout(() => focusTarget && focusTarget.focus(), 60);
  }
  function closeModal(backdrop) {
    backdrop.classList.remove('is-open');
    backdrop.setAttribute('aria-hidden', 'true');
    if (backdrop.id === 'mobile-nav-backdrop') $$('[data-mobile-nav-toggle]').forEach(b => b.setAttribute('aria-expanded', 'false'));
    if (!$('.modal-backdrop.is-open, .drawer-backdrop.is-open, .cmdk-backdrop.is-open')) document.body.style.overflow = '';
    if (lastFocused) lastFocused.focus();
  }
  document.addEventListener('click', e => {
    const opener = e.target.closest('[data-modal-open]');
    if (opener) { e.preventDefault(); openModal(opener.getAttribute('data-modal-open')); return; }
    const closer = e.target.closest('[data-modal-close]');
    if (closer) { const bd = closer.closest('.modal-backdrop,.drawer-backdrop'); if (bd) closeModal(bd); return; }
    // click on backdrop itself (not the panel)
    if (e.target.classList.contains('modal-backdrop') || e.target.classList.contains('drawer-backdrop')) closeModal(e.target);
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      const open = $('.modal-backdrop.is-open, .drawer-backdrop.is-open');
      if (open) closeModal(open);
    }
    const openModalEl = $('.modal-backdrop.is-open, .drawer-backdrop.is-open');
    if (openModalEl && e.key === 'Tab') trapFocus(openModalEl, e);
  });

  /* ------------------------------------------------------------------ */
  /* TOAST — window.bjToast({title,text,variant,timeout})                */
  /* ------------------------------------------------------------------ */
  function ensureToastStack() {
    let stack = $('.toast-stack');
    if (!stack) { stack = document.createElement('div'); stack.className = 'toast-stack'; stack.setAttribute('aria-live', 'polite'); document.body.appendChild(stack); }
    return stack;
  }
  const ICONS = {
    success: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>',
    danger:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16h.01"/></svg>',
    warning: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M10.3 3.7L1.8 18a2 2 0 001.7 3h17a2 2 0 001.7-3L13.7 3.7a2 2 0 00-3.4 0z"/><path d="M12 9v4M12 17h.01"/></svg>',
    info:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></svg>'
  };
  window.bjToast = function ({ title = '기록했습니다', text = '', variant = 'success', timeout = 4200 } = {}) {
    const stack = ensureToastStack();
    const el = document.createElement('div');
    el.className = 'toast toast--' + variant;
    el.setAttribute('role', 'status');
    el.innerHTML =
      '<span class="toast__icon" aria-hidden="true">' + (ICONS[variant] || ICONS.success) + '</span>' +
      '<div class="toast__body"><div class="toast__title">' + title + '</div>' +
      (text ? '<div class="toast__text">' + text + '</div>' : '') + '</div>' +
      '<button class="btn btn--icon btn--sm" aria-label="알림 닫기"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg></button>';
    const remove = () => { el.classList.add('is-leaving'); setTimeout(() => el.remove(), 260); };
    on(el.querySelector('button'), 'click', remove);
    stack.appendChild(el);
    if (timeout) setTimeout(remove, timeout);
    return el;
  };
  document.addEventListener('click', e => {
    const t = e.target.closest('[data-toast]');
    if (t) window.bjToast({ title: t.getAttribute('data-toast-title') || '압화 및 분류 완료', text: t.getAttribute('data-toast') || '', variant: t.getAttribute('data-toast-variant') || 'success' });
  });

  /* ------------------------------------------------------------------ */
  /* DROPDOWN / MENU — [data-dropdown]                                    */
  /* ------------------------------------------------------------------ */
  document.addEventListener('click', e => {
    const trigger = e.target.closest('[data-dropdown-trigger]');
    const openDropdowns = $$('.dropdown.is-open');
    if (trigger) {
      const dd = trigger.closest('.dropdown');
      const wasOpen = dd.classList.contains('is-open');
      openDropdowns.forEach(d => d.classList.remove('is-open'));
      if (!wasOpen) dd.classList.add('is-open');
      e.stopPropagation();
      return;
    }
    if (!e.target.closest('.dropdown__panel')) openDropdowns.forEach(d => d.classList.remove('is-open'));
  });

  /* ------------------------------------------------------------------ */
  /* CONTEXT MENU — [data-context-menu="menuId"]                         */
  /* ------------------------------------------------------------------ */
  document.addEventListener('contextmenu', e => {
    const host = e.target.closest('[data-context-menu]');
    if (!host) return;
    e.preventDefault();
    const menu = document.getElementById(host.getAttribute('data-context-menu'));
    if (!menu) return;
    menu.style.display = 'block';
    menu.style.left = Math.min(e.clientX, window.innerWidth - menu.offsetWidth - 8) + 'px';
    menu.style.top  = Math.min(e.clientY, window.innerHeight - menu.offsetHeight - 8) + 'px';
    const hide = () => { menu.style.display = 'none'; document.removeEventListener('click', hide); };
    setTimeout(() => document.addEventListener('click', hide), 0);
  });

  /* ------------------------------------------------------------------ */
  /* COMMAND PALETTE — ⌘K / Ctrl+K, [data-cmdk]                          */
  /* ------------------------------------------------------------------ */
  function initCmdk() {
    const backdrop = $('[data-cmdk]');
    if (!backdrop) return;
    const input = $('.cmdk__input', backdrop);
    const list = $('.cmdk__list', backdrop);
    const items = $$('.cmdk__item', backdrop);
    let active = 0;
    // Progressive listbox/combobox ARIA — attaches on any page's cmdk markup
    if (list && !list.id) list.id = 'cmdk-list';
    if (list) list.setAttribute('role', 'listbox');
    input.setAttribute('role', 'combobox');
    input.setAttribute('aria-autocomplete', 'list');
    input.setAttribute('aria-expanded', 'false');
    if (list) input.setAttribute('aria-controls', list.id);
    items.forEach((it, i) => { if (!it.id) it.id = 'cmdk-opt-' + i; it.setAttribute('role', 'option'); it.setAttribute('aria-selected', 'false'); });
    const emptyEl = $('.cmdk__empty', backdrop);
    if (emptyEl) { emptyEl.setAttribute('role', 'status'); emptyEl.setAttribute('aria-live', 'polite'); }
    const open = () => {
      backdrop.classList.add('is-open'); backdrop.setAttribute('aria-hidden', 'false');
      input.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden'; lastFocused = document.activeElement;
      input.value = ''; filter(''); setTimeout(() => input.focus(), 50);
    };
    const close = () => { backdrop.classList.remove('is-open'); backdrop.setAttribute('aria-hidden', 'true'); input.setAttribute('aria-expanded', 'false'); input.removeAttribute('aria-activedescendant'); if (!$('.modal-backdrop.is-open,.drawer-backdrop.is-open')) document.body.style.overflow = ''; if (lastFocused) lastFocused.focus(); };
    const visible = () => items.filter(it => it.style.display !== 'none');
    const setActive = (i) => {
      const vis = visible();
      active = Math.max(0, Math.min(i, vis.length - 1));
      items.forEach(it => { it.classList.remove('is-active'); it.setAttribute('aria-selected', 'false'); });
      if (vis[active]) {
        vis[active].classList.add('is-active');
        vis[active].setAttribute('aria-selected', 'true');
        input.setAttribute('aria-activedescendant', vis[active].id);
        vis[active].scrollIntoView({ block: 'nearest' });
      } else { input.removeAttribute('aria-activedescendant'); }
    };
    const filter = (q) => {
      q = q.toLowerCase().trim();
      let groups = {};
      items.forEach(it => {
        const match = it.textContent.toLowerCase().includes(q);
        it.style.display = match ? '' : 'none';
        const g = it.closest('.cmdk__group'); if (g) groups[g.dataset.group] = groups[g.dataset.group] || match || false, groups[g.dataset.group] = groups[g.dataset.group] || match;
      });
      $$('.cmdk__group', backdrop).forEach(g => { const any = $$('.cmdk__item', g).some(it => it.style.display !== 'none'); g.style.display = any ? '' : 'none'; });
      const empty = $('.cmdk__empty', backdrop); if (empty) empty.style.display = visible().length ? 'none' : '';
      setActive(0);
    };
    document.addEventListener('keydown', e => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); backdrop.classList.contains('is-open') ? close() : open(); }
      if (!backdrop.classList.contains('is-open')) return;
      if (e.key === 'Escape') { e.preventDefault(); close(); }
      if (e.key === 'ArrowDown') { e.preventDefault(); setActive(active + 1); }
      if (e.key === 'ArrowUp') { e.preventDefault(); setActive(active - 1); }
      if (e.key === 'Enter') { e.preventDefault(); const vis = visible(); if (vis[active]) vis[active].click(); }
    });
    on(input, 'input', () => filter(input.value));
    on(backdrop, 'click', e => { if (e.target === backdrop) close(); });
    items.forEach(it => on(it, 'click', () => {
      const action = it.getAttribute('data-action');
      const link = it.getAttribute('data-href') || it.getAttribute('href');
      if (action === 'toggle-theme') Theme.toggle();
      else if (link) { window.location.href = link; return; }
      else window.bjToast({ title: '명령을 실행했습니다', text: it.textContent.trim(), variant: 'info' });
      close();
    }));
    $$('[data-cmdk-open]').forEach(b => on(b, 'click', open));
  }

  /* ------------------------------------------------------------------ */
  /* SEGMENTED CONTROL — [data-segmented]                                */
  /* ------------------------------------------------------------------ */
  function initSegmented(root) {
    const opts = $$('.segmented__option', root);
    opts.forEach(opt => on(opt, 'click', () => {
      opts.forEach(o => o.setAttribute('aria-pressed', 'false'));
      opt.setAttribute('aria-pressed', 'true');
      const target = opt.getAttribute('data-target');
      if (target) {
        $$('[data-seg-panel]', root.parentElement || document).forEach(p => p.hidden = p.getAttribute('data-seg-panel') !== target);
      }
      root.dispatchEvent(new CustomEvent('segmented:change', { detail: { value: opt.dataset.value } }));
    }));
  }

  /* ------------------------------------------------------------------ */
  /* SIDEBAR collapse — [data-sidebar-toggle]                            */
  /* ------------------------------------------------------------------ */
  document.addEventListener('click', e => {
    if (e.target.closest('[data-sidebar-toggle]')) { const sb = $('.sidebar'); if (sb) sb.classList.toggle('is-collapsed'); }
  });

  /* ------------------------------------------------------------------ */
  /* COPY CODE — .codeblock__copy                                         */
  /* ------------------------------------------------------------------ */
  document.addEventListener('click', e => {
    const btn = e.target.closest('[data-copy]');
    if (!btn) return;
    const text = btn.getAttribute('data-copy') === 'parent'
      ? btn.closest('.codeblock').querySelector('code, pre').innerText
      : (document.getElementById(btn.getAttribute('data-copy'))?.innerText || btn.getAttribute('data-copy'));
    navigator.clipboard?.writeText(text).then(() => {
      const old = btn.textContent; btn.textContent = '복사됨 ✓';
      setTimeout(() => btn.textContent = old, 1400);
    });
  });

  /* ------------------------------------------------------------------ */
  /* CAROUSEL — [data-carousel]                                          */
  /* ------------------------------------------------------------------ */
  function initCarousel(root) {
    const track = $('.carousel__track', root);
    const slides = $$('.carousel__slide', track);
    const dotsWrap = $('.carousel__dots', root);
    if (dotsWrap) {
      dotsWrap.innerHTML = slides.map((_, i) => `<button class="carousel__dot${i === 0 ? ' is-active' : ''}" aria-label="${i + 1}번 슬라이드"></button>`).join('');
    }
    const dots = dotsWrap ? $$('.carousel__dot', dotsWrap) : [];
    const scrollTo = i => slides[i] && track.scrollTo({ left: slides[i].offsetLeft - track.offsetLeft, behavior: prefersReduced() ? 'auto' : 'smooth' });
    dots.forEach((d, i) => on(d, 'click', () => scrollTo(i)));
    on($('.carousel__btn--prev', root), 'click', () => track.scrollBy({ left: -track.clientWidth * 0.8, behavior: 'smooth' }));
    on($('.carousel__btn--next', root), 'click', () => track.scrollBy({ left: track.clientWidth * 0.8, behavior: 'smooth' }));
    on(track, 'scroll', () => {
      const i = slides.reduce((best, s, idx) => Math.abs(s.offsetLeft - track.offsetLeft - track.scrollLeft) < Math.abs(slides[best].offsetLeft - track.offsetLeft - track.scrollLeft) ? idx : best, 0);
      dots.forEach((d, idx) => d.classList.toggle('is-active', idx === i));
    }, { passive: true });
  }

  /* ------------------------------------------------------------------ */
  /* SORTABLE TABLE — [data-sortable]                                    */
  /* ------------------------------------------------------------------ */
  function initSortable(table) {
    const tbody = $('tbody', table);
    $$('th.sortable', table).forEach((th, colIndex) => {
      // compute actual column index (account for non-sortable cells before)
      const idx = Array.from(th.parentElement.children).indexOf(th);
      on(th, 'click', () => {
        const current = th.getAttribute('aria-sort');
        const dir = current === 'ascending' ? 'descending' : 'ascending';
        $$('th', table).forEach(h => h.removeAttribute('aria-sort'));
        th.setAttribute('aria-sort', dir);
        const rows = $$('tr', tbody);
        const num = th.classList.contains('num');
        rows.sort((a, b) => {
          let av = a.children[idx]?.dataset.sort ?? a.children[idx]?.textContent.trim() ?? '';
          let bv = b.children[idx]?.dataset.sort ?? b.children[idx]?.textContent.trim() ?? '';
          if (num) { av = parseFloat(String(av).replace(/[^0-9.\-]/g, '')) || 0; bv = parseFloat(String(bv).replace(/[^0-9.\-]/g, '')) || 0; }
          const cmp = num ? av - bv : String(av).localeCompare(String(bv));
          return dir === 'ascending' ? cmp : -cmp;
        });
        rows.forEach(r => tbody.appendChild(r));
      });
    });
  }

  /* ------------------------------------------------------------------ */
  /* TABLE SELECT — [data-select-all] + .row-check                       */
  /* ------------------------------------------------------------------ */
  function initTableSelect(table) {
    const all = $('[data-select-all]', table);
    const boxes = $$('.row-check', table);
    const sync = () => { const n = boxes.filter(b => b.checked).length; if (all) { all.checked = n === boxes.length && n > 0; all.indeterminate = n > 0 && n < boxes.length; } boxes.forEach(b => b.closest('tr').classList.toggle('is-selected', b.checked)); const lbl = table.closest('.table-wrap')?.querySelector('[data-select-count]'); if (lbl) lbl.textContent = n; };
    if (all) on(all, 'change', () => { boxes.forEach(b => b.checked = all.checked); sync(); });
    boxes.forEach(b => on(b, 'change', sync));
  }

  /* ------------------------------------------------------------------ */
  /* STEPPER — .stepper                                                   */
  /* ------------------------------------------------------------------ */
  function initStepper(root) {
    const input = $('input', root);
    const [dec, inc] = $$('button', root);
    const step = parseFloat(input.step) || 1, min = input.min !== '' ? parseFloat(input.min) : -Infinity, max = input.max !== '' ? parseFloat(input.max) : Infinity;
    on(dec, 'click', () => input.value = Math.max(min, (parseFloat(input.value) || 0) - step));
    on(inc, 'click', () => input.value = Math.min(max, (parseFloat(input.value) || 0) + step));
  }

  /* ------------------------------------------------------------------ */
  /* RATING — .rating[data-rating]                                       */
  /* ------------------------------------------------------------------ */
  function initRating(root) {
    if (root.classList.contains('rating--readonly')) return;
    const btns = $$('button', root);
    const set = v => { root.dataset.value = v; btns.forEach((b, i) => b.classList.toggle('is-filled', i < v)); };
    btns.forEach((b, i) => { on(b, 'click', () => set(i + 1)); });
    set(parseInt(root.dataset.value || '0', 10));
  }

  /* ------------------------------------------------------------------ */
  /* CHIP INPUT — .chips[data-chip-input]                                */
  /* ------------------------------------------------------------------ */
  function initChips(root) {
    const input = $('input', root);
    const add = (val) => {
      val = val.trim(); if (!val) return;
      const chip = document.createElement('span');
      chip.className = 'chip';
      chip.innerHTML = val + ' <button type="button" aria-label="' + val + ' 삭제"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg></button>';
      root.insertBefore(chip, input);
    };
    on(input, 'keydown', e => {
      if ((e.key === 'Enter' || e.key === ',') && input.value.trim()) { e.preventDefault(); add(input.value); input.value = ''; }
      if (e.key === 'Backspace' && !input.value) { const chips = $$('.chip', root); if (chips.length) chips[chips.length - 1].remove(); }
    });
    on(root, 'click', e => { const rm = e.target.closest('.chip button'); if (rm) rm.closest('.chip').remove(); else input.focus(); });
  }

  /* ------------------------------------------------------------------ */
  /* COMBOBOX / AUTOCOMPLETE — [data-combobox]                          */
  /* ------------------------------------------------------------------ */
  function initCombobox(root) {
    const input = $('input', root);
    const list = $('.combobox__list', root);
    const options = $$('.combobox__option', list);
    let active = -1;
    const open = () => { list.style.display = 'block'; };
    const close = () => { list.style.display = 'none'; active = -1; options.forEach(o => o.classList.remove('is-active')); };
    close();
    const filter = () => {
      const q = input.value.toLowerCase().trim();
      let shown = 0;
      options.forEach(o => { const m = o.textContent.toLowerCase().includes(q); o.style.display = m ? '' : 'none'; if (m) shown++; });
      shown ? open() : close();
    };
    on(input, 'input', filter);
    on(input, 'focus', () => { if (input.value) filter(); });
    on(input, 'keydown', e => {
      const vis = options.filter(o => o.style.display !== 'none');
      if (e.key === 'ArrowDown') { e.preventDefault(); active = Math.min(active + 1, vis.length - 1); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); active = Math.max(active - 1, 0); }
      else if (e.key === 'Enter' && vis[active]) { e.preventDefault(); input.value = vis[active].dataset.value || vis[active].textContent.trim(); close(); return; }
      else if (e.key === 'Escape') { close(); return; }
      vis.forEach((o, i) => o.classList.toggle('is-active', i === active));
    });
    options.forEach(o => on(o, 'click', () => { input.value = o.dataset.value || o.textContent.trim(); close(); }));
    document.addEventListener('click', e => { if (!root.contains(e.target)) close(); });
  }

  /* ------------------------------------------------------------------ */
  /* SLIDER value readout — [data-slider-output]                        */
  /* ------------------------------------------------------------------ */
  function initSlider(root) {
    const input = $('input[type=range]', root);
    const out = $('[data-slider-output]', root) || (root.parentElement && $('[data-slider-output]', root.parentElement));
    if (input && out) { const upd = () => out.textContent = (root.dataset.prefix || '') + input.value + (root.dataset.suffix || ''); on(input, 'input', upd); upd(); }
  }

  /* ------------------------------------------------------------------ */
  /* PRICING TOGGLE — [data-pricing-toggle]                             */
  /* ------------------------------------------------------------------ */
  document.addEventListener('change', e => {
    const t = e.target.closest('[data-pricing-toggle]');
    if (!t) return;
    const annual = t.checked;
    $$('[data-price]').forEach(p => p.textContent = annual ? p.dataset.priceAnnual : p.dataset.price);
    $$('[data-price-period]').forEach(p => p.textContent = annual ? '/년' : '/월');
    $$('[data-annual-note]').forEach(n => n.style.visibility = annual ? 'visible' : 'hidden');
  });

  /* ------------------------------------------------------------------ */
  /* WIZARD — [data-wizard] with [data-step] panels + next/prev/steps    */
  /* ------------------------------------------------------------------ */
  function initWizard(root) {
    const panels = $$('[data-step]', root);
    const steps = $$('.step', root);
    let cur = 0;
    const render = () => {
      panels.forEach((p, i) => p.hidden = i !== cur);
      steps.forEach((s, i) => { s.classList.toggle('is-active', i === cur); s.classList.toggle('is-done', i < cur); });
      const prev = $('[data-wizard-prev]', root), next = $('[data-wizard-next]', root), done = $('[data-wizard-done]', root);
      if (prev) prev.disabled = cur === 0;
      if (next) next.hidden = cur === panels.length - 1;
      if (done) done.hidden = cur !== panels.length - 1;
    };
    on($('[data-wizard-next]', root), 'click', () => { if (cur < panels.length - 1) { cur++; render(); } });
    on($('[data-wizard-prev]', root), 'click', () => { if (cur > 0) { cur--; render(); } });
    on($('[data-wizard-done]', root), 'click', () => window.bjToast({ title: '표본집이 완성됐어요', text: '첫 압화를 시작할 준비가 끝났습니다.', variant: 'success' }));
    render();
  }

  /* ------------------------------------------------------------------ */
  /* FILE DROPZONE — .dropzone                                          */
  /* ------------------------------------------------------------------ */
  function initDropzone(zone) {
    const input = $('input[type=file]', zone);
    ['dragenter', 'dragover'].forEach(ev => on(zone, ev, e => { e.preventDefault(); zone.classList.add('is-dragover'); }));
    ['dragleave', 'drop'].forEach(ev => on(zone, ev, e => { e.preventDefault(); zone.classList.remove('is-dragover'); }));
    on(zone, 'click', () => input && input.click());
    on(zone, 'keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); input && input.click(); } });
    on(zone, 'drop', e => showFiles(e.dataTransfer.files));
    if (input) on(input, 'change', () => showFiles(input.files));
    function showFiles(files) {
      const list = zone.parentElement.querySelector('[data-file-list]');
      if (!list || !files.length) return;
      Array.from(files).forEach(f => {
        const row = document.createElement('div'); row.className = 'file-row';
        row.innerHTML = '<span class="file-row__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/></svg></span>' +
          '<div class="file-row__meta"><div class="file-row__name">' + f.name + '</div><div class="file-row__size">' + (f.size / 1024).toFixed(1) + ' KB</div></div>' +
          '<button class="btn btn--icon btn--sm" aria-label="' + f.name + ' 제거"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg></button>';
        on(row.querySelector('button'), 'click', () => row.remove());
        list.appendChild(row);
      });
    }
  }

  /* ------------------------------------------------------------------ */
  /* KANBAN drag & drop — [data-kanban]                                 */
  /* ------------------------------------------------------------------ */
  function initKanban(board) {
    let dragged = null;
    $$('.kanban-card', board).forEach(card => {
      card.setAttribute('draggable', 'true');
      on(card, 'dragstart', () => { dragged = card; setTimeout(() => card.classList.add('is-dragging'), 0); });
      on(card, 'dragend', () => { card.classList.remove('is-dragging'); dragged = null; });
    });
    $$('[data-kanban-col]', board).forEach(col => {
      const dropArea = col.querySelector('[data-kanban-drop]') || col;
      on(dropArea, 'dragover', e => { e.preventDefault(); col.classList.add('is-droptarget'); });
      on(dropArea, 'dragleave', () => col.classList.remove('is-droptarget'));
      on(dropArea, 'drop', e => {
        e.preventDefault(); col.classList.remove('is-droptarget');
        if (dragged) { dropArea.appendChild(dragged); updateCounts(); }
      });
    });
    function updateCounts() {
      $$('[data-kanban-col]', board).forEach(col => {
        const c = col.querySelector('[data-kanban-count]');
        if (c) c.textContent = (col.querySelector('[data-kanban-drop]') || col).querySelectorAll('.kanban-card').length;
      });
    }
    updateCounts();
  }

  /* ------------------------------------------------------------------ */
  /* COUNT-UP — [data-countup]                                          */
  /* ------------------------------------------------------------------ */
  function countUp(el) {
    const target = parseFloat(el.dataset.countup);
    const dur = 1100, suffix = el.dataset.suffix || '', prefix = el.dataset.prefix || '', dec = (el.dataset.decimals | 0);
    if (prefersReduced()) { el.textContent = prefix + target.toLocaleString() + suffix; return; }
    const start = performance.now();
    const tick = now => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = prefix + (target * eased).toLocaleString(undefined, { minimumFractionDigits: dec, maximumFractionDigits: dec }) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  /* ------------------------------------------------------------------ */
  /* SCROLL REVEAL — [data-reveal]                                      */
  /* ------------------------------------------------------------------ */
  function initReveal() {
    const els = $$('[data-reveal]');
    if (!els.length) return;
    if (prefersReduced() || !('IntersectionObserver' in window)) { els.forEach(e => e.classList.add('is-revealed')); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-revealed'); io.unobserve(e.target); if (e.target.dataset.countup) countUp(e.target); } });
    }, { threshold: 0.15 });
    els.forEach(e => io.observe(e));
  }

  /* ------------------------------------------------------------------ */
  /* MOBILE NAV — [data-mobile-nav-toggle] opens the shared off-canvas   */
  /* menu (reuses the drawer overlay contract: focus trap, ESC, scrim).  */
  /* ------------------------------------------------------------------ */
  document.addEventListener('click', e => {
    const t = e.target.closest('[data-mobile-nav-toggle]');
    if (t && document.getElementById('mobile-nav-backdrop')) { t.setAttribute('aria-expanded', 'true'); openModal('mobile-nav-backdrop'); }
  });

  /* ------------------------------------------------------------------ */
  /* INIT ALL                                                           */
  /* ------------------------------------------------------------------ */
  function init() {
    $$('[data-tabs]').forEach(initTabs);
    $$('[data-accordion]').forEach(initAccordion);
    $$('[data-segmented]').forEach(initSegmented);
    $$('[data-carousel]').forEach(initCarousel);
    $$('[data-sortable]').forEach(initSortable);
    $$('table').forEach(t => { if ($('[data-select-all]', t)) initTableSelect(t); });
    $$('.stepper').forEach(initStepper);
    $$('.rating[data-rating]').forEach(initRating);
    $$('.chips[data-chip-input]').forEach(initChips);
    $$('[data-combobox]').forEach(initCombobox);
    $$('.slider').forEach(initSlider);
    $$('[data-wizard]').forEach(initWizard);
    $$('.dropzone').forEach(initDropzone);
    $$('[data-kanban]').forEach(initKanban);
    $$('[data-countup]:not([data-reveal])').forEach(countUp);
    initCmdk();
    initReveal();
    // live "current year"
    $$('[data-year]').forEach(el => el.textContent = new Date().getFullYear());
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
