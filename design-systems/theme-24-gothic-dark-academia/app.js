/* ============================================================================
   THEME 24 — GOTHIC / DARK ACADEMIA
   app.js — All interactions, vanilla JS, zero dependencies.
   Works from file:// by double-click. Progressive-enhancement; everything
   degrades gracefully if JS is off.
   ----------------------------------------------------------------------------
   Modules: theme toggle · tabs · accordion · modal · drawer · toast ·
   command palette (⌘K) · dropdown/menu · popover · stepper · slider out ·
   chip input · file dropzone · table sort/select · carousel · context menu ·
   pagination demo · sidebar collapse · reveal-on-scroll · copy-to-clipboard ·
   pricing toggle · wizard · password reveal · live search filter.
   ========================================================================= */
(function () {
  'use strict';
  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const on = (el, ev, fn, opts) => el && el.addEventListener(ev, fn, opts);

  /* ---------------------------------------------------------------- */
  /* THEME TOGGLE — dark (canonical) ↔ light (aged parchment)         */
  /* ---------------------------------------------------------------- */
  const THEME_KEY = 'theme-24-mode';
  const REDUCED = () => window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  function applyTheme(mode) {
    document.documentElement.setAttribute('data-theme', mode);
    $$('[data-theme-toggle]').forEach(btn => {
      btn.setAttribute('aria-pressed', String(mode === 'light'));
      const lab = btn.querySelector('[data-theme-label]');
      if (lab) lab.textContent = mode === 'light' ? '촛불' : '양피지';   /* 라벨 = 전환될 판본 */
    });
  }
  /* 테마 전환 연출 — 라이트로: 채광 플래시 / 다크로: 성냥 점화 (1회성, reduced-motion 스킵) */
  function themeVeil(next) {
    if (REDUCED()) return;
    const v = document.createElement('div');
    v.className = 'theme-veil ' + (next === 'dark' ? 'theme-veil--kindle' : 'theme-veil--daylight');
    v.setAttribute('aria-hidden', 'true');
    document.body.appendChild(v);
    setTimeout(() => v.remove(), 720);
  }
  function switchTheme(next) {
    applyTheme(next);
    themeVeil(next);
    try { localStorage.setItem(THEME_KEY, next); } catch (e) {}
    toast({
      title: next === 'light' ? '양피지를 폈습니다' : '촛불을 밝혔습니다',
      body: next === 'light' ? '낮의 판본으로 전환되었습니다.' : '밤의 판본으로 전환되었습니다.',
      variant: 'success'
    });
  }
  function initTheme() {
    let saved;
    try { saved = localStorage.getItem(THEME_KEY); } catch (e) {}
    applyTheme(saved || document.documentElement.getAttribute('data-theme') || 'dark');
    $$('[data-theme-toggle]').forEach(btn => on(btn, 'click', () => {
      switchTheme(document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light');
    }));
  }

  /* ---------------------------------------------------------------- */
  /* CANDLE CURSOR — 커서를 따라오는 촛불 광원 (다크 전용 시그니처)     */
  /* 터치 기기·reduced-motion에서는 생성 자체를 스킵 (고정 비네트 유지) */
  /* ---------------------------------------------------------------- */
  function initCandleCursor() {
    if (REDUCED()) return;
    if (window.matchMedia && matchMedia('(hover: none)').matches) return;
    const el = document.createElement('div');
    el.className = 'candle-pool';
    el.setAttribute('aria-hidden', 'true');
    document.body.appendChild(el);
    let tx = innerWidth / 2, ty = innerHeight * 0.3, x = tx, y = ty, raf = null;
    function step() {
      x += (tx - x) * 0.09; y += (ty - y) * 0.09;   /* 촛불이 한 박자 늦게 따라온다 */
      el.style.setProperty('--mx', x.toFixed(1) + 'px');
      el.style.setProperty('--my', y.toFixed(1) + 'px');
      raf = (Math.abs(tx - x) + Math.abs(ty - y) > 0.6) ? requestAnimationFrame(step) : null;
    }
    on(document, 'pointermove', e => {
      tx = e.clientX; ty = e.clientY;
      if (!raf) raf = requestAnimationFrame(step);
    }, { passive: true });
  }

  /* ---------------------------------------------------------------- */
  /* TABS — roving, ARIA, arrow keys                                  */
  /* ---------------------------------------------------------------- */
  function initTabs() {
    $$('[data-tabs]').forEach(group => {
      const tabs = $$('[role="tab"]', group);
      const panels = tabs.map(t => document.getElementById(t.getAttribute('aria-controls'))).filter(Boolean);
      function select(i) {
        tabs.forEach((t, k) => {
          const sel = k === i;
          t.setAttribute('aria-selected', String(sel));
          t.tabIndex = sel ? 0 : -1;
          if (panels[k]) panels[k].hidden = !sel;
        });
      }
      tabs.forEach((t, i) => {
        on(t, 'click', () => select(i));
        on(t, 'keydown', e => {
          let n = null;
          if (e.key === 'ArrowRight' || e.key === 'ArrowDown') n = (i + 1) % tabs.length;
          if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   n = (i - 1 + tabs.length) % tabs.length;
          if (e.key === 'Home') n = 0;
          if (e.key === 'End')  n = tabs.length - 1;
          if (n !== null) { e.preventDefault(); select(n); tabs[n].focus(); }
        });
      });
      const init = tabs.findIndex(t => t.getAttribute('aria-selected') === 'true');
      select(init < 0 ? 0 : init);
    });
  }

  /* ---------------------------------------------------------------- */
  /* ACCORDION — height animation + ARIA                             */
  /* ---------------------------------------------------------------- */
  function initAccordion() {
    $$('[data-accordion]').forEach(acc => {
      const single = acc.hasAttribute('data-accordion-single');
      $$('.accordion__trigger', acc).forEach(trig => {
        on(trig, 'click', () => {
          const panel = document.getElementById(trig.getAttribute('aria-controls'));
          const open = trig.getAttribute('aria-expanded') === 'true';
          if (single && !open) {
            $$('.accordion__trigger', acc).forEach(t => {
              t.setAttribute('aria-expanded', 'false');
              const p = document.getElementById(t.getAttribute('aria-controls'));
              if (p) p.style.maxHeight = null;
            });
          }
          trig.setAttribute('aria-expanded', String(!open));
          if (panel) panel.style.maxHeight = open ? null : panel.scrollHeight + 'px';
        });
      });
    });
  }

  /* ---------------------------------------------------------------- */
  /* MODAL / DIALOG — focus trap, ESC, backdrop                       */
  /* ---------------------------------------------------------------- */
  let lastFocused = null;
  function openOverlay(ov) {
    lastFocused = document.activeElement;
    ov.classList.add('is-open');
    ov.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    const f = ov.querySelector('input, button, [href], select, textarea, [tabindex]:not([tabindex="-1"])');
    if (f) setTimeout(() => f.focus(), 60);
  }
  function closeOverlay(ov) {
    ov.classList.remove('is-open');
    ov.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastFocused) lastFocused.focus();
  }
  function trapFocus(e, container) {
    if (e.key !== 'Tab') return;
    const f = $$('a[href], button:not(:disabled), input:not(:disabled), select, textarea, [tabindex]:not([tabindex="-1"])', container)
      .filter(el => el.offsetParent !== null);
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
  function initModals() {
    $$('[data-modal-open]').forEach(btn => on(btn, 'click', () => {
      const ov = document.getElementById(btn.getAttribute('data-modal-open'));
      if (ov) openOverlay(ov);
    }));
    $$('.overlay').forEach(ov => {
      on(ov, 'click', e => { if (e.target === ov) closeOverlay(ov); });
      $$('[data-modal-close]', ov).forEach(b => on(b, 'click', () => closeOverlay(ov)));
      on(ov, 'keydown', e => { if (e.key === 'Escape') closeOverlay(ov); else trapFocus(e, ov); });
    });
  }

  /* ---------------------------------------------------------------- */
  /* DRAWER                                                          */
  /* ---------------------------------------------------------------- */
  function initDrawers() {
    $$('[data-drawer-open]').forEach(btn => on(btn, 'click', () => {
      const id = btn.getAttribute('data-drawer-open');
      const dr = document.getElementById(id);
      const ov = document.querySelector('[data-drawer-overlay="' + id + '"]');
      if (dr) dr.classList.add('is-open');
      if (ov) ov.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      const f = dr && dr.querySelector('button, a, input');
      if (f) setTimeout(() => f.focus(), 80);
    }));
    function close(dr, ov) { if (dr) dr.classList.remove('is-open'); if (ov) ov.classList.remove('is-open'); document.body.style.overflow = ''; }
    $$('.drawer').forEach(dr => {
      const ov = document.querySelector('[data-drawer-overlay="' + dr.id + '"]');
      $$('[data-drawer-close]', dr).forEach(b => on(b, 'click', () => close(dr, ov)));
      on(dr, 'keydown', e => { if (e.key === 'Escape') close(dr, ov); else trapFocus(e, dr); });
      if (ov) on(ov, 'click', () => close(dr, ov));
    });
  }

  /* ---------------------------------------------------------------- */
  /* TOAST — stacking, auto-dismiss                                  */
  /* ---------------------------------------------------------------- */
  const ICONS = {
    success: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
    danger:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6M9 9l6 6"/></svg>',
    warning: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.3 3.3 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.3a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4M12 17h.01"/></svg>',
    info:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>'
  };
  function ensureToastRegion() {
    let r = $('.toast-region');
    if (!r) { r = document.createElement('div'); r.className = 'toast-region'; r.setAttribute('aria-live', 'polite'); r.setAttribute('aria-atomic', 'false'); document.body.appendChild(r); }
    return r;
  }
  function toast(opts) {
    const o = Object.assign({ title: '알림', body: '', variant: 'success', timeout: 4200 }, opts || {});
    const r = ensureToastRegion();
    const el = document.createElement('div');
    el.className = 'toast toast--' + o.variant;
    el.setAttribute('role', o.variant === 'danger' ? 'alert' : 'status');
    el.innerHTML =
      '<span class="toast__icon" aria-hidden="true">' + (ICONS[o.variant] || ICONS.info) + '</span>' +
      '<div><div class="toast__title">' + esc(o.title) + '</div>' +
      (o.body ? '<div class="toast__body">' + esc(o.body) + '</div>' : '') + '</div>' +
      '<button class="toast__close" aria-label="알림 닫기">&times;</button>';
    r.appendChild(el);
    const remove = () => { el.classList.add('leaving'); setTimeout(() => el.remove(), 280); };
    on(el.querySelector('.toast__close'), 'click', remove);
    if (o.timeout) setTimeout(remove, o.timeout);
  }
  window.gothicToast = toast;
  function initToastButtons() {
    $$('[data-toast]').forEach(btn => on(btn, 'click', () => {
      toast({ title: btn.dataset.toastTitle || '기록 완료', body: btn.dataset.toast || btn.dataset.toastBody || '', variant: btn.dataset.toastVariant || 'success' });
    }));
  }

  /* ---------------------------------------------------------------- */
  /* COMMAND PALETTE (⌘K / Ctrl-K)                                   */
  /* ---------------------------------------------------------------- */
  function initCommandPalette() {
    const ov = $('#cmdk'); if (!ov) return;
    const input = $('.cmdk__input', ov);
    const list = $('.cmdk__list', ov);
    /* combobox + listbox ARIA 배선 (마크업 부담 없이 JS가 표준화) */
    if (!list.id) list.id = 'cmdk-list';
    list.setAttribute('role', 'listbox');
    input.setAttribute('role', 'combobox');
    input.setAttribute('aria-expanded', 'true');
    input.setAttribute('aria-controls', list.id);
    input.setAttribute('aria-autocomplete', 'list');
    $$('.cmdk__group-label', list).forEach(g => g.setAttribute('role', 'presentation'));
    $$('.cmdk__item', list).forEach((it, k) => { if (!it.id) it.id = 'cmdk-opt-' + k; it.setAttribute('aria-selected', 'false'); });
    const emptyEl = $('.cmdk__empty', list);
    if (emptyEl) { emptyEl.setAttribute('role', 'status'); emptyEl.setAttribute('aria-live', 'polite'); }
    const items = () => $$('.cmdk__item', list).filter(i => i.style.display !== 'none');
    let active = 0;
    function open() { ov.classList.add('is-open'); ov.setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden'; input.value = ''; filter(''); setTimeout(() => input.focus(), 50); }
    function close() { ov.classList.remove('is-open'); ov.setAttribute('aria-hidden', 'true'); document.body.style.overflow = ''; }
    function setActive(i) {
      const it = items(); if (!it.length) { input.removeAttribute('aria-activedescendant'); return; }
      active = (i + it.length) % it.length;
      it.forEach((el, k) => {
        el.classList.toggle('is-active', k === active);
        el.setAttribute('aria-selected', String(k === active));
      });
      input.setAttribute('aria-activedescendant', it[active].id);
      it[active].scrollIntoView({ block: 'nearest' });
    }
    function filter(q) {
      q = q.toLowerCase();
      let empty = $('.cmdk__empty', list);
      let any = false;
      $$('.cmdk__item', list).forEach(it => {
        const match = it.textContent.toLowerCase().includes(q);
        it.style.display = match ? '' : 'none';
        it.classList.remove('is-active');
        if (match) any = true;
      });
      $$('.cmdk__group-label', list).forEach(g => {
        let sib = g.nextElementSibling, vis = false;
        while (sib && sib.classList.contains('cmdk__item')) { if (sib.style.display !== 'none') vis = true; sib = sib.nextElementSibling; }
        g.style.display = vis ? '' : 'none';
      });
      if (empty) empty.hidden = any;
      active = 0; setActive(0);
    }
    on(document, 'keydown', e => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); ov.classList.contains('is-open') ? close() : open(); }
    });
    $$('[data-cmdk-open]').forEach(b => on(b, 'click', open));
    on(ov, 'click', e => { if (e.target === ov) close(); });
    on(input, 'input', () => filter(input.value));
    on(ov, 'keydown', e => {
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowDown') { e.preventDefault(); setActive(active + 1); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(active - 1); }
      else if (e.key === 'Enter') { e.preventDefault(); const it = items()[active]; if (it) { it.click(); } }
    });
    $$('.cmdk__item', list).forEach(it => on(it, 'click', () => {
      close();
      const act = it.dataset.action;
      if (act === 'toggle-theme') { switchTheme(document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light'); }
      else if (it.dataset.href) { window.location.href = it.dataset.href; }
      else {
        const c = it.cloneNode(true);
        $$('.cmdk__hint', c).forEach(h => h.remove());
        toast({ title: it.dataset.toastTitle || '명령 실행', body: it.dataset.toast || ('「' + c.textContent.trim() + '」 명령을 실행했습니다.'), variant: 'info' });
      }
    }));
  }

  /* ---------------------------------------------------------------- */
  /* DROPDOWN / MENU + POPOVER + CONTEXT MENU                         */
  /* ---------------------------------------------------------------- */
  function initMenus() {
    $$('[data-menu]').forEach(menu => {
      const trig = $('[data-menu-trigger]', menu);
      const close = () => { menu.classList.remove('is-open'); trig && trig.setAttribute('aria-expanded', 'false'); };
      on(trig, 'click', e => {
        e.stopPropagation();
        const open = menu.classList.toggle('is-open');
        trig.setAttribute('aria-expanded', String(open));
      });
      $$('.menu__item', menu).forEach(it => on(it, 'click', () => { close(); if (!it.dataset.keepOpen) toast({ title: '선택 완료', body: '「' + it.textContent.trim() + '」 항목을 선택했습니다.', variant: 'info' }); }));
      on(menu, 'keydown', e => { if (e.key === 'Escape') { close(); trig && trig.focus(); } });
    });
    $$('[data-popover]').forEach(pop => {
      const trig = $('[data-popover-trigger]', pop);
      on(trig, 'click', e => { e.stopPropagation(); pop.classList.toggle('is-open'); });
    });
    on(document, 'click', () => {
      $$('[data-menu].is-open').forEach(m => { m.classList.remove('is-open'); const t = $('[data-menu-trigger]', m); t && t.setAttribute('aria-expanded', 'false'); });
      $$('[data-popover].is-open').forEach(p => p.classList.remove('is-open'));
    });

    // Context menu
    const cm = $('#context-menu');
    if (cm) {
      $$('[data-context-target]').forEach(t => on(t, 'contextmenu', e => {
        e.preventDefault();
        cm.hidden = false;
        const x = Math.min(e.clientX, window.innerWidth - cm.offsetWidth - 8);
        const y = Math.min(e.clientY, window.innerHeight - cm.offsetHeight - 8);
        cm.style.left = x + 'px'; cm.style.top = y + 'px';
      }));
      on(document, 'click', () => { cm.hidden = true; });
      $$('.menu__item', cm).forEach(it => on(it, 'click', () => toast({ title: '동작 실행', body: '「' + it.textContent.trim() + '」을(를) 실행했습니다.', variant: 'info' })));
    }
  }

  /* ---------------------------------------------------------------- */
  /* STEPPER (number input +/-)                                       */
  /* ---------------------------------------------------------------- */
  function initSteppers() {
    $$('[data-stepper]').forEach(s => {
      const input = $('input', s);
      const dec = $('[data-step-dec]', s), inc = $('[data-step-inc]', s);
      const min = input.min !== '' ? +input.min : -Infinity;
      const max = input.max !== '' ? +input.max : Infinity;
      const step = +input.step || 1;
      const set = v => { input.value = Math.max(min, Math.min(max, v)); };
      on(dec, 'click', () => set((+input.value || 0) - step));
      on(inc, 'click', () => set((+input.value || 0) + step));
    });
  }

  /* ---------------------------------------------------------------- */
  /* SLIDER live output                                               */
  /* ---------------------------------------------------------------- */
  function initSliders() {
    $$('input[type="range"][data-output]').forEach(sl => {
      const out = document.getElementById(sl.dataset.output);
      /* data-thousands가 있으면 ₩1,850,000식 천단위 구분 표기 */
      const fmt = v => sl.dataset.thousands != null ? Number(v).toLocaleString('ko-KR') : v;
      const upd = () => {
        if (out) out.textContent = (sl.dataset.prefix || '') + fmt(sl.value) + (sl.dataset.suffix || '');
        const pct = ((sl.value - sl.min) / (sl.max - sl.min)) * 100;
        sl.style.background = 'linear-gradient(90deg, var(--color-primary) ' + pct + '%, var(--color-surface-inset) ' + pct + '%)';
      };
      on(sl, 'input', upd); upd();
    });
  }

  /* ---------------------------------------------------------------- */
  /* CHIP INPUT                                                       */
  /* ---------------------------------------------------------------- */
  function initChipInputs() {
    $$('[data-chip-input]').forEach(box => {
      const input = $('input', box);
      function addChip(text) {
        text = text.trim(); if (!text) return;
        const chip = document.createElement('span');
        chip.className = 'chip';
        chip.innerHTML = esc(text) + ' <button type="button" aria-label="' + esc(text) + ' 삭제">&times;</button>';
        on(chip.querySelector('button'), 'click', () => chip.remove());
        box.insertBefore(chip, input);
      }
      on(input, 'keydown', e => {
        if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addChip(input.value); input.value = ''; }
        else if (e.key === 'Backspace' && !input.value) { const chips = $$('.chip', box); if (chips.length) chips[chips.length - 1].remove(); }
      });
    });
  }

  /* ---------------------------------------------------------------- */
  /* FILE DROPZONE                                                    */
  /* ---------------------------------------------------------------- */
  function initDropzones() {
    $$('[data-dropzone]').forEach(dz => {
      const input = $('input[type="file"]', dz);
      const listEl = document.getElementById(dz.dataset.dropzone);
      function render(files) {
        if (!listEl) return; listEl.innerHTML = '';
        Array.from(files).forEach(f => {
          const row = document.createElement('div'); row.className = 'file-row';
          row.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg>' +
            '<span class="file-name">' + esc(f.name) + '</span><span class="file-size">' + fmtBytes(f.size) + '</span>';
          listEl.appendChild(row);
        });
      }
      on(dz, 'click', () => input && input.click());
      on(input, 'change', () => render(input.files));
      ['dragover', 'dragenter'].forEach(ev => on(dz, ev, e => { e.preventDefault(); dz.classList.add('is-dragover'); }));
      ['dragleave', 'drop'].forEach(ev => on(dz, ev, e => { e.preventDefault(); dz.classList.remove('is-dragover'); }));
      on(dz, 'drop', e => { if (e.dataTransfer && e.dataTransfer.files.length) render(e.dataTransfer.files); });
    });
  }

  /* ---------------------------------------------------------------- */
  /* TABLE — sort + select-all                                        */
  /* ---------------------------------------------------------------- */
  function initTables() {
    $$('table[data-sortable]').forEach(table => {
      $$('th.sortable', table).forEach(th => {
        /* 키보드 접근 — th 내용을 .th-sort 버튼으로 자동 승격 (마우스 전용 금지) */
        let btn = th.querySelector('.th-sort');
        if (!btn) {
          btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'th-sort';
          while (th.firstChild) btn.appendChild(th.firstChild);
          th.appendChild(btn);
        }
        on(btn, 'click', () => {
          const tbody = $('tbody', table);
          const rows = $$('tr', tbody);
          const dir = th.getAttribute('aria-sort') === 'ascending' ? 'descending' : 'ascending';
          $$('th', table).forEach(h => h.removeAttribute('aria-sort'));
          th.setAttribute('aria-sort', dir);
          const idx = Array.from(th.parentNode.children).indexOf(th);
          rows.sort((a, b) => {
            let x = a.children[idx].dataset.sort || a.children[idx].textContent.trim();
            let y = b.children[idx].dataset.sort || b.children[idx].textContent.trim();
            const nx = parseFloat(x.replace(/[^0-9.-]/g, '')), ny = parseFloat(y.replace(/[^0-9.-]/g, ''));
            let cmp = (!isNaN(nx) && !isNaN(ny)) ? nx - ny : x.localeCompare(y);
            return dir === 'ascending' ? cmp : -cmp;
          });
          rows.forEach(r => tbody.appendChild(r));
          $$('.sort-ind', table).forEach(s => s.textContent = '');
          const ind = th.querySelector('.sort-ind'); if (ind) ind.textContent = dir === 'ascending' ? '▲' : '▼';
        });
      });
      const selectAll = $('[data-select-all]', table);
      if (selectAll) on(selectAll, 'change', () => {
        $$('tbody [data-row-select]', table).forEach(cb => { cb.checked = selectAll.checked; cb.closest('tr').setAttribute('aria-selected', String(cb.checked)); });
      });
      $$('tbody [data-row-select]', table).forEach(cb => on(cb, 'change', () => {
        cb.closest('tr').setAttribute('aria-selected', String(cb.checked));
        const all = $$('tbody [data-row-select]', table);
        if (selectAll) selectAll.checked = all.every(c => c.checked);
      }));
    });
  }

  /* ---------------------------------------------------------------- */
  /* CAROUSEL                                                         */
  /* ---------------------------------------------------------------- */
  function initCarousels() {
    $$('[data-carousel]').forEach(car => {
      const track = $('.carousel__track', car);
      const slides = $$('.carousel__slide', track);
      const dotsWrap = $('.carousel__dots', car);
      let i = 0;
      function go(n) {
        i = Math.max(0, Math.min(slides.length - 1, n));
        slides[i].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        if (dotsWrap) $$('button', dotsWrap).forEach((d, k) => {
          d.classList.toggle('is-active', k === i);
          if (k === i) d.setAttribute('aria-current', 'true'); else d.removeAttribute('aria-current');
        });
      }
      if (dotsWrap) { dotsWrap.innerHTML = ''; slides.forEach((_, k) => { const b = document.createElement('button'); b.setAttribute('aria-label', (k + 1) + '번째 도판으로 이동'); on(b, 'click', () => go(k)); dotsWrap.appendChild(b); }); }
      on($('.carousel__nav--prev', car), 'click', () => go(i - 1));
      on($('.carousel__nav--next', car), 'click', () => go(i + 1));
      go(0);
    });
  }

  /* ---------------------------------------------------------------- */
  /* SIDEBAR collapse                                                 */
  /* ---------------------------------------------------------------- */
  function initSidebar() {
    $$('[data-sidebar-toggle]').forEach(btn => on(btn, 'click', () => {
      const sb = document.getElementById(btn.dataset.sidebarToggle) || $('.sidebar');
      if (sb) sb.classList.toggle('is-collapsed');
    }));
  }

  /* ---------------------------------------------------------------- */
  /* MOBILE NAV toggle — 클래스 기반 (.navbar__nav.is-open, CSS 소관)  */
  /* ---------------------------------------------------------------- */
  function initMobileNav() {
    $$('[data-nav-toggle]').forEach(btn => on(btn, 'click', () => {
      const nav = $('.navbar__nav'); if (!nav) return;
      const open = nav.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', String(open));
    }));
  }

  /* ---------------------------------------------------------------- */
  /* SEGMENTED — role="radiogroup"/"radio" + 방향키 (data-segmented)   */
  /* ---------------------------------------------------------------- */
  function initSegmented() {
    $$('[data-segmented]').forEach(seg => {
      const btns = $$('[role="radio"]', seg);
      if (!btns.length) return;
      function set(i) {
        btns.forEach((b, k) => { b.setAttribute('aria-checked', String(k === i)); b.tabIndex = k === i ? 0 : -1; });
      }
      btns.forEach((b, i) => {
        on(b, 'click', () => set(i));
        on(b, 'keydown', e => {
          let n = null;
          if (e.key === 'ArrowRight' || e.key === 'ArrowDown') n = (i + 1) % btns.length;
          if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   n = (i - 1 + btns.length) % btns.length;
          if (n !== null) { e.preventDefault(); set(n); btns[n].focus(); }
        });
      });
      const init = btns.findIndex(b => b.getAttribute('aria-checked') === 'true');
      set(init < 0 ? 0 : init);
    });
  }

  /* ---------------------------------------------------------------- */
  /* TOGGLE BUTTON GROUP — aria-pressed 단일 선택 (data-toggle-group)  */
  /* ---------------------------------------------------------------- */
  function initToggleGroups() {
    $$('[data-toggle-group]').forEach(g => {
      $$('.btn', g).forEach(b => on(b, 'click', () => {
        $$('.btn', g).forEach(x => x.setAttribute('aria-pressed', String(x === b)));
      }));
    });
  }

  /* ---------------------------------------------------------------- */
  /* COPY TO CLIPBOARD                                                */
  /* ---------------------------------------------------------------- */
  function initCopy() {
    $$('[data-copy]').forEach(btn => on(btn, 'click', () => {
      const sel = btn.dataset.copy;
      const src = sel ? document.querySelector(sel) : btn.closest('.code-block') && btn.closest('.code-block').querySelector('code');
      const text = src ? src.textContent : '';
      const done = () => toast({ title: '복사 완료', body: '클립보드에 옮겨 적었습니다.', variant: 'success', timeout: 2000 });
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done).catch(done);
      else done();
    }));
  }

  /* ---------------------------------------------------------------- */
  /* PRICING toggle (monthly/annual)                                 */
  /* ---------------------------------------------------------------- */
  function initPricing() {
    $$('[data-pricing-toggle]').forEach(t => on(t, 'change', () => {
      const annual = t.checked;
      $$('[data-price]').forEach(p => { p.textContent = annual ? p.dataset.priceAnnual : p.dataset.price; });
      $$('[data-price-period]').forEach(p => p.textContent = annual ? '/ 년' : '/ 월');
      $$('[data-annual-note]').forEach(n => n.hidden = !annual);
    }));
  }

  /* ---------------------------------------------------------------- */
  /* WIZARD (Steps)                                                  */
  /* ---------------------------------------------------------------- */
  function initWizard() {
    $$('[data-wizard]').forEach(wiz => {
      const steps = $$('.step', wiz.querySelector('.steps'));
      const panels = $$('[data-wizard-panel]', wiz);
      const next = $('[data-wizard-next]', wiz), prev = $('[data-wizard-prev]', wiz);
      const bar = $('[data-wizard-progress]', wiz);
      /* 라벨은 페이지가 data 속성으로 재정의 가능 — 기본값은 한국어 */
      const labelNext = wiz.dataset.labelNext || '계속';
      const labelDone = wiz.dataset.labelComplete || '완료';
      let i = 0;
      function render() {
        steps.forEach((s, k) => { s.classList.toggle('is-active', k === i); s.classList.toggle('is-complete', k < i); });
        panels.forEach((p, k) => p.hidden = k !== i);
        if (prev) prev.disabled = i === 0;
        if (next) next.textContent = i === panels.length - 1 ? labelDone : labelNext;
        if (bar) bar.style.width = ((i) / (panels.length - 1) * 100) + '%';
      }
      on(next, 'click', () => { if (i < panels.length - 1) { i++; render(); } else toast({ title: wiz.dataset.completeTitle || '입학 허가', body: wiz.dataset.completeBody || '모든 절차가 끝났습니다. 밀랍 인장으로 봉인되었습니다.', variant: 'success' }); });
      on(prev, 'click', () => { if (i > 0) { i--; render(); } });
      render();
    });
  }

  /* ---------------------------------------------------------------- */
  /* PASSWORD reveal                                                 */
  /* ---------------------------------------------------------------- */
  function initPasswordReveal() {
    $$('[data-pw-toggle]').forEach(btn => on(btn, 'click', () => {
      const inp = document.getElementById(btn.dataset.pwToggle || btn.dataset.pwTarget);
      if (!inp) return;
      inp.type = inp.type === 'password' ? 'text' : 'password';
      btn.setAttribute('aria-pressed', String(inp.type === 'text'));
    }));
  }

  /* ---------------------------------------------------------------- */
  /* LIVE list/table filter                                          */
  /* ---------------------------------------------------------------- */
  function initFilters() {
    $$('[data-filter]').forEach(inp => {
      const target = document.querySelector(inp.dataset.filter);
      if (!target) return;
      on(inp, 'input', () => {
        const q = inp.value.toLowerCase();
        $$('[data-filter-item]', target).forEach(row => {
          row.style.display = row.textContent.toLowerCase().includes(q) ? '' : 'none';
        });
      });
    });
  }

  /* ---------------------------------------------------------------- */
  /* REVEAL on scroll (IntersectionObserver)                         */
  /* ---------------------------------------------------------------- */
  function initReveal() {
    const els = $$('[data-reveal]');
    if (!('IntersectionObserver' in window) || !els.length) { els.forEach(e => e.classList.add('reveal')); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('reveal'); io.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    els.forEach(e => io.observe(e));
  }

  /* ---------------------------------------------------------------- */
  /* RADIO CARD groups (visual selection)                            */
  /* ---------------------------------------------------------------- */
  function initRadioCards() {
    $$('[data-radio-cards]').forEach(group => {
      $$('input[type="radio"]', group).forEach(r => on(r, 'change', () => {
        $$('.radio-card', group).forEach(c => c.classList.remove('is-selected'));
        const card = r.closest('.radio-card'); if (card) card.classList.add('is-selected');
      }));
    });
  }

  /* ---------------------------------------------------------------- */
  /* helpers                                                         */
  /* ---------------------------------------------------------------- */
  function esc(s) { const d = document.createElement('div'); d.textContent = String(s == null ? '' : s); return d.innerHTML; }
  function fmtBytes(b) { if (b < 1024) return b + ' B'; if (b < 1048576) return (b / 1024).toFixed(1) + ' KB'; return (b / 1048576).toFixed(1) + ' MB'; }

  /* ---------------------------------------------------------------- */
  /* boot                                                            */
  /* ---------------------------------------------------------------- */
  function boot() {
    initTheme(); initTabs(); initAccordion(); initModals(); initDrawers();
    initToastButtons(); initCommandPalette(); initMenus(); initSteppers();
    initSliders(); initChipInputs(); initDropzones(); initTables();
    initCarousels(); initSidebar(); initMobileNav(); initCopy();
    initPricing(); initWizard(); initPasswordReveal(); initFilters();
    initReveal(); initRadioCards(); initSegmented(); initToggleGroups();
    initCandleCursor();
    document.documentElement.classList.add('js-ready');
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
