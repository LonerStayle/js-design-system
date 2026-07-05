/* ============================================================================
   THEME 09 — Y2K / FRUTIGER AERO
   app.js — vanilla JS interaction layer (no dependencies)
   ----------------------------------------------------------------------------
   Implements every JS hook defined in the build contract:
   bubbles · theme toggle · modal · drawer · toast · tabs · accordion · menu ·
   context-menu · popover · command palette (⌘K) · carousel · table sort/select ·
   slider · stepper · rating · chip-input · combobox/multiselect · pricing
   toggle · wizard · copy · sidebar collapse · mobile nav · tooltips.

   All features are progressive: a page only needs the relevant data-attributes.
   Everything degrades gracefully and honours prefers-reduced-motion.
   ========================================================================== */
(function () {
  'use strict';

  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const reduceMotion = () =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const onReady = (fn) =>
    document.readyState === 'loading'
      ? document.addEventListener('DOMContentLoaded', fn)
      : fn();

  const FOCUSABLE =
    'a[href],button:not([disabled]),textarea:not([disabled]),input:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])';

  /* ====================================================================== *
   * 1. FLOATING BUBBLES                                                     *
   * ====================================================================== */
  function initBubbles() {
    const field = $('[data-bubbles]') || $('.aero-bubbles');
    if (!field || reduceMotion()) return;
    const count = parseInt(field.dataset.bubbles, 10) || 16;
    const frag = document.createDocumentFragment();
    for (let i = 0; i < count; i++) {
      const b = document.createElement('span');
      b.className = 'aero-bubble';
      const size = 14 + Math.round(Math.pow(Math.random(), 1.6) * 120); // px, smaller more common
      const dur = 16 + Math.random() * 20;
      b.style.cssText =
        `width:${size}px;height:${size}px;` +
        `left:${Math.random() * 100}%;` +
        `--bubble-dur:${dur.toFixed(1)}s;` +
        `--bubble-delay:${(-Math.random() * dur).toFixed(1)}s;` +
        `--bubble-drift:${(Math.random() * 80 - 40).toFixed(0)}px;` +
        `--bubble-opacity:${(0.35 + Math.random() * 0.45).toFixed(2)};`;
      frag.appendChild(b);
    }
    field.appendChild(frag);
  }

  /* ====================================================================== *
   * 2. THEME TOGGLE (light / dark, persisted)                              *
   * ====================================================================== */
  const THEME_KEY = 'aero-theme';
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    $$('[data-theme-toggle]').forEach((btn) => {
      btn.setAttribute('aria-pressed', String(theme === 'dark'));
      const lbl = btn.querySelector('[data-theme-label]');
      if (lbl) lbl.textContent = theme === 'dark' ? '라이트' : '다크';
    });
  }
  function initTheme() {
    let saved;
    try { saved = localStorage.getItem(THEME_KEY); } catch (e) {}
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(saved || (prefersDark ? 'dark' : 'light'));
    document.addEventListener('click', (e) => {
      const t = e.target.closest('[data-theme-toggle]');
      if (!t) return;
      const next =
        document.documentElement.getAttribute('data-theme') === 'dark'
          ? 'light' : 'dark';
      applyTheme(next);
      try { localStorage.setItem(THEME_KEY, next); } catch (err) {}
    });
  }

  /* ====================================================================== *
   * 3. FOCUS TRAP HELPER (for modal / drawer / command palette)            *
   * ====================================================================== */
  function trapFocus(container, e) {
    const nodes = $$(FOCUSABLE, container).filter((n) => n.offsetParent !== null);
    if (!nodes.length) return;
    const first = nodes[0];
    const last = nodes[nodes.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault(); last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault(); first.focus();
    }
  }

  /* ====================================================================== *
   * 4. MODAL / DIALOG                                                       *
   * ====================================================================== */
  let lastFocused = null;
  function openOverlay(el) {
    if (!el) return;
    lastFocused = document.activeElement;
    el.classList.add('is-open');
    el.removeAttribute('hidden');
    el.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    const focusTarget = el.querySelector('[autofocus]') || $$(FOCUSABLE, el)[0];
    if (focusTarget) setTimeout(() => focusTarget.focus(), 40);
  }
  function closeOverlay(el) {
    if (!el) return;
    el.classList.remove('is-open');
    el.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastFocused && lastFocused.focus) lastFocused.focus();
  }

  function initModals() {
    document.addEventListener('click', (e) => {
      const opener = e.target.closest('[data-modal-open]');
      if (opener) {
        const m = document.getElementById(opener.getAttribute('data-modal-open'));
        openOverlay(m);
        return;
      }
      const closer = e.target.closest('[data-modal-close]');
      if (closer) { closeOverlay(closer.closest('[data-modal]')); return; }
      // backdrop click
      const modal = e.target.closest('[data-modal]');
      if (modal && (e.target === modal || e.target.classList.contains('modal__backdrop'))) {
        closeOverlay(modal);
      }
    });
    document.addEventListener('keydown', (e) => {
      const open = $('.modal.is-open[data-modal]');
      if (!open) return;
      if (e.key === 'Escape') closeOverlay(open);
      if (e.key === 'Tab') trapFocus(open, e);
    });
  }

  /* ====================================================================== *
   * 5. DRAWER                                                               *
   * ====================================================================== */
  function initDrawers() {
    document.addEventListener('click', (e) => {
      const opener = e.target.closest('[data-drawer-open]');
      if (opener) {
        openOverlay(document.getElementById(opener.getAttribute('data-drawer-open')));
        return;
      }
      const closer = e.target.closest('[data-drawer-close]');
      if (closer) { closeOverlay(closer.closest('[data-drawer]')); return; }
      const drawer = e.target.closest('[data-drawer]');
      if (drawer && (e.target === drawer || e.target.classList.contains('drawer__backdrop'))) {
        closeOverlay(drawer);
      }
    });
    document.addEventListener('keydown', (e) => {
      const open = $('.drawer.is-open[data-drawer]');
      if (!open) return;
      if (e.key === 'Escape') closeOverlay(open);
      if (e.key === 'Tab') trapFocus(open, e);
    });
  }

  /* ====================================================================== *
   * 6. TOASTS                                                               *
   * ====================================================================== */
  const TOAST_ICONS = {
    success: '<path d="M20 6 9 17l-5-5"/>',
    info:    '<circle cx="12" cy="12" r="9"/><path d="M12 8h.01M11 12h1v4h1"/>',
    warning: '<path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/>',
    danger:  '<circle cx="12" cy="12" r="9"/><path d="m15 9-6 6M9 9l6 6"/>',
  };
  function ensureToastStack() {
    let stack = $('.toast-stack');
    if (!stack) {
      stack = document.createElement('div');
      stack.className = 'toast-stack';
      stack.setAttribute('aria-live', 'polite');
      stack.setAttribute('aria-atomic', 'false');
      document.body.appendChild(stack);
    }
    return stack;
  }
  function showToast(message, variant = 'info', timeout = 4200) {
    const stack = ensureToastStack();
    const toast = document.createElement('div');
    toast.className = `toast toast--${variant}`;
    toast.setAttribute('role', 'status');
    toast.innerHTML =
      `<svg class="toast__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${TOAST_ICONS[variant] || TOAST_ICONS.info}</svg>` +
      `<span class="toast__msg">${message}</span>` +
      `<button class="toast__close" aria-label="알림 닫기">&times;</button>`;
    stack.appendChild(toast);
    const remove = () => {
      toast.classList.add('is-leaving');
      setTimeout(() => toast.remove(), reduceMotion() ? 0 : 320);
    };
    toast.querySelector('.toast__close').addEventListener('click', remove);
    if (timeout) setTimeout(remove, timeout);
    return toast;
  }
  function initToasts() {
    document.addEventListener('click', (e) => {
      const t = e.target.closest('[data-toast]');
      if (!t) return;
      showToast(
        t.getAttribute('data-toast-msg') || '저장되었습니다.',
        t.getAttribute('data-toast-variant') || 'success'
      );
    });
  }

  /* ====================================================================== *
   * 7. TABS (roving tabindex + arrow keys)                                 *
   * ====================================================================== */
  function initTabs() {
    $$('[data-tabs]').forEach((group) => {
      const tabs = $$('[role="tab"]', group);
      const select = (tab) => {
        tabs.forEach((t) => {
          const sel = t === tab;
          t.setAttribute('aria-selected', String(sel));
          t.tabIndex = sel ? 0 : -1;
          const panel = document.getElementById(t.getAttribute('aria-controls'));
          if (panel) panel.hidden = !sel;
        });
      };
      tabs.forEach((tab, i) => {
        tab.addEventListener('click', () => { select(tab); tab.focus(); });
        tab.addEventListener('keydown', (e) => {
          let idx = null;
          if (e.key === 'ArrowRight' || e.key === 'ArrowDown') idx = (i + 1) % tabs.length;
          else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') idx = (i - 1 + tabs.length) % tabs.length;
          else if (e.key === 'Home') idx = 0;
          else if (e.key === 'End') idx = tabs.length - 1;
          if (idx !== null) { e.preventDefault(); select(tabs[idx]); tabs[idx].focus(); }
        });
      });
      const current = tabs.find((t) => t.getAttribute('aria-selected') === 'true');
      select(current || tabs[0]);
    });
  }

  /* ====================================================================== *
   * 8. ACCORDION                                                            *
   * ====================================================================== */
  function initAccordions() {
    $$('[data-accordion]').forEach((acc) => {
      const single = acc.hasAttribute('data-accordion-single');
      $$('.accordion__trigger', acc).forEach((trigger) => {
        trigger.addEventListener('click', () => {
          const expanded = trigger.getAttribute('aria-expanded') === 'true';
          if (single && !expanded) {
            $$('.accordion__trigger', acc).forEach((t) => {
              t.setAttribute('aria-expanded', 'false');
              const p = document.getElementById(t.getAttribute('aria-controls'));
              if (p) p.hidden = true;
            });
          }
          trigger.setAttribute('aria-expanded', String(!expanded));
          const panel = document.getElementById(trigger.getAttribute('aria-controls'));
          if (panel) panel.hidden = expanded;
        });
      });
    });
  }

  /* ====================================================================== *
   * 9. MENU / DROPDOWN                                                      *
   * ====================================================================== */
  function closeAllMenus(except) {
    $$('.menu.is-open[data-menu]').forEach((m) => {
      if (m === except) return;
      m.classList.remove('is-open');
      const trig = $(`[data-menu-trigger="${m.id}"]`);
      if (trig) trig.setAttribute('aria-expanded', 'false');
    });
  }
  function initMenus() {
    document.addEventListener('click', (e) => {
      const trigger = e.target.closest('[data-menu-trigger]');
      if (trigger) {
        e.preventDefault();
        const menu = document.getElementById(trigger.getAttribute('data-menu-trigger'));
        if (!menu) return;
        const willOpen = !menu.classList.contains('is-open');
        closeAllMenus(menu);
        menu.classList.toggle('is-open', willOpen);
        trigger.setAttribute('aria-expanded', String(willOpen));
        if (willOpen) { const first = $('.menu__item', menu); if (first) first.focus(); }
        return;
      }
      if (!e.target.closest('.menu[data-menu]')) closeAllMenus();
    });
    document.addEventListener('keydown', (e) => {
      const open = $('.menu.is-open[data-menu]');
      if (!open) return;
      if (e.key === 'Escape') { closeAllMenus(); return; }
      const items = $$('.menu__item', open).filter((i) => !i.disabled);
      const idx = items.indexOf(document.activeElement);
      if (e.key === 'ArrowDown') { e.preventDefault(); (items[idx + 1] || items[0]).focus(); }
      if (e.key === 'ArrowUp') { e.preventDefault(); (items[idx - 1] || items[items.length - 1]).focus(); }
    });
  }

  /* ====================================================================== *
   * 10. CONTEXT MENU                                                        *
   * ====================================================================== */
  function initContextMenus() {
    $$('[data-context-menu]').forEach((zone) => {
      const menu = document.getElementById(zone.getAttribute('data-context-menu'));
      if (!menu) return;
      zone.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        closeAllMenus();
        menu.classList.add('is-open');
        menu.style.position = 'fixed';
        const mw = menu.offsetWidth || 200, mh = menu.offsetHeight || 240;
        menu.style.left = Math.min(e.clientX, window.innerWidth - mw - 8) + 'px';
        menu.style.top = Math.min(e.clientY, window.innerHeight - mh - 8) + 'px';
      });
    });
    document.addEventListener('click', () =>
      $$('.context-menu.is-open, .menu.is-open').forEach((m) => {
        if (m.hasAttribute('data-context-menu') || m.classList.contains('context-menu'))
          m.classList.remove('is-open');
      })
    );
  }

  /* ====================================================================== *
   * 11. POPOVER                                                             *
   * ====================================================================== */
  function initPopovers() {
    document.addEventListener('click', (e) => {
      const trigger = e.target.closest('[data-popover-trigger]');
      if (trigger) {
        e.preventDefault();
        const pop = document.getElementById(trigger.getAttribute('data-popover-trigger'));
        if (!pop) return;
        const open = pop.classList.toggle('is-open');
        pop.hidden = !open;
        trigger.setAttribute('aria-expanded', String(open));
        return;
      }
      if (!e.target.closest('.popover')) {
        $$('.popover.is-open').forEach((p) => {
          p.classList.remove('is-open'); p.hidden = true;
          const tr = $(`[data-popover-trigger="${p.id}"]`);
          if (tr) tr.setAttribute('aria-expanded', 'false');
        });
      }
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape')
        $$('.popover.is-open').forEach((p) => { p.classList.remove('is-open'); p.hidden = true; });
    });
  }

  /* ====================================================================== *
   * 12. COMMAND PALETTE (⌘K / Ctrl-K)                                       *
   * ====================================================================== */
  function initCommandPalette() {
    const palette = $('[data-command-palette]');
    if (!palette) return;
    const input = $('.command-palette__search input', palette) || $('input', palette);
    const items = $$('.command-palette__item', palette);
    const empty = $('.command-palette__empty', palette);

    const open = () => {
      openOverlay(palette);
      if (input) { input.value = ''; filter(''); setTimeout(() => input.focus(), 50); }
    };
    const close = () => closeOverlay(palette);

    const filter = (q) => {
      q = q.trim().toLowerCase();
      let visible = 0;
      items.forEach((it) => {
        const hit = it.textContent.toLowerCase().includes(q);
        it.hidden = !hit;
        it.classList.remove('is-active');
        if (hit) visible++;
      });
      if (empty) empty.hidden = visible > 0;
      const firstVisible = items.find((i) => !i.hidden);
      if (firstVisible) firstVisible.classList.add('is-active');
    };

    document.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        palette.classList.contains('is-open') ? close() : open();
      }
      if (e.key === 'Escape' && palette.classList.contains('is-open')) close();
    });
    document.addEventListener('click', (e) => {
      if (e.target.closest('[data-command-open]')) { e.preventDefault(); open(); }
      if (e.target === palette || e.target.classList.contains('command-palette__backdrop')) close();
    });
    if (input) input.addEventListener('input', () => filter(input.value));

    palette.addEventListener('keydown', (e) => {
      const vis = items.filter((i) => !i.hidden);
      let idx = vis.findIndex((i) => i.classList.contains('is-active'));
      if (e.key === 'ArrowDown') { e.preventDefault(); idx = (idx + 1) % vis.length; }
      else if (e.key === 'ArrowUp') { e.preventDefault(); idx = (idx - 1 + vis.length) % vis.length; }
      else if (e.key === 'Enter') { if (vis[idx]) { vis[idx].click(); close(); } return; }
      else return;
      vis.forEach((i) => i.classList.remove('is-active'));
      if (vis[idx]) { vis[idx].classList.add('is-active'); vis[idx].scrollIntoView({ block: 'nearest' }); }
    });
    items.forEach((it) =>
      it.addEventListener('click', () => {
        const href = it.getAttribute('data-command-href');
        if (it.dataset.commandMsg) showToast(it.dataset.commandMsg, 'info');
        close();
        if (href) window.location.href = href;   // replaces inline onclick navigation
      })
    );
  }

  /* ====================================================================== *
   * 12b. WATER RIPPLE — a droplet bloom from the press point on any .btn    *
   * ====================================================================== */
  function initRipple() {
    if (reduceMotion()) return;
    document.addEventListener('pointerdown', (e) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      const btn = e.target.closest('.btn');
      if (!btn || btn.disabled || btn.classList.contains('is-disabled') ||
          btn.classList.contains('btn--loading') || btn.getAttribute('aria-disabled') === 'true') return;
      const rect = btn.getBoundingClientRect();
      const span = document.createElement('span');
      span.className = 'btn__ripple';
      span.style.setProperty('--ripple-x', (e.clientX - rect.left) + 'px');
      span.style.setProperty('--ripple-y', (e.clientY - rect.top) + 'px');
      span.style.setProperty('--ripple-d', (Math.max(rect.width, rect.height) * 2) + 'px');
      btn.appendChild(span);
      span.addEventListener('animationend', () => span.remove());
      setTimeout(() => span.remove(), 800);
    });
  }

  /* ====================================================================== *
   * 12c. POINTER-FOLLOW GLOSS — a wet highlight chases the cursor           *
   * ====================================================================== */
  function initGlossTrack() {
    if (reduceMotion()) return;
    $$('[data-gloss]').forEach((el) => {
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        el.style.setProperty('--mx', (((e.clientX - r.left) / r.width) * 100).toFixed(1) + '%');
        el.style.setProperty('--my', (((e.clientY - r.top) / r.height) * 100).toFixed(1) + '%');
      });
    });
  }

  /* ====================================================================== *
   * 13. CAROUSEL                                                            *
   * ====================================================================== */
  function initCarousels() {
    $$('[data-carousel]').forEach((root) => {
      const track = $('.carousel__track', root);
      const slides = $$('.carousel__slide', root);
      if (!track || !slides.length) return;
      let index = 0;
      const dotsWrap = $('.carousel__dots', root);
      if (dotsWrap && !dotsWrap.children.length) {
        slides.forEach((_, i) => {
          const dot = document.createElement('button');
          dot.className = 'carousel__dot' + (i === 0 ? ' is-active' : '');
          dot.setAttribute('aria-label', `${i + 1}번 슬라이드`);
          dot.addEventListener('click', () => go(i));
          dotsWrap.appendChild(dot);
        });
      }
      const dots = dotsWrap ? $$('.carousel__dot', dotsWrap) : [];
      const go = (i) => {
        index = (i + slides.length) % slides.length;
        track.style.transform = `translateX(-${index * 100}%)`;
        dots.forEach((d, di) => d.classList.toggle('is-active', di === index));
      };
      $('[data-carousel-prev]', root)?.addEventListener('click', () => go(index - 1));
      $('[data-carousel-next]', root)?.addEventListener('click', () => go(index + 1));
      root.setAttribute('tabindex', '0');
      root.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') go(index - 1);
        if (e.key === 'ArrowRight') go(index + 1);
      });
      if (root.hasAttribute('data-autoplay') && !reduceMotion()) {
        let timer = setInterval(() => go(index + 1), parseInt(root.dataset.autoplay, 10) || 5000);
        root.addEventListener('mouseenter', () => clearInterval(timer));
        root.addEventListener('mouseleave', () => {
          timer = setInterval(() => go(index + 1), parseInt(root.dataset.autoplay, 10) || 5000);
        });
      }
      go(0);
    });
  }

  /* ====================================================================== *
   * 14. TABLE — sort + row selection                                       *
   * ====================================================================== */
  function initTables() {
    $$('table').forEach((table) => {
      // sorting
      $$('th[data-sort]', table).forEach((th, colIndex) => {
        th.style.cursor = 'pointer';
        th.setAttribute('tabindex', '0');
        if (!th.hasAttribute('aria-sort')) th.setAttribute('aria-sort', 'none');
        const realIndex = Array.from(th.parentNode.children).indexOf(th);
        const doSort = () => {
          const tbody = table.tBodies[0];
          if (!tbody) return;
          const dir = th.getAttribute('aria-sort') === 'ascending' ? 'descending' : 'ascending';
          $$('th[data-sort]', table).forEach((o) => o.setAttribute('aria-sort', 'none'));
          th.setAttribute('aria-sort', dir);
          const rows = Array.from(tbody.rows);
          const type = th.getAttribute('data-sort');
          rows.sort((a, b) => {
            let av = (a.cells[realIndex]?.dataset.value ?? a.cells[realIndex]?.textContent ?? '').trim();
            let bv = (b.cells[realIndex]?.dataset.value ?? b.cells[realIndex]?.textContent ?? '').trim();
            if (type === 'number') { av = parseFloat(av.replace(/[^0-9.-]/g, '')) || 0; bv = parseFloat(bv.replace(/[^0-9.-]/g, '')) || 0; }
            let cmp = type === 'number' ? av - bv : av.localeCompare(bv, 'ko');
            return dir === 'ascending' ? cmp : -cmp;
          });
          rows.forEach((r) => tbody.appendChild(r));
        };
        th.addEventListener('click', doSort);
        th.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); doSort(); } });
      });
      // selection
      const selectAll = $('[data-select-all]', table);
      const rowBoxes = $$('[data-row-select]', table);
      const syncRow = (box) => {
        const tr = box.closest('tr');
        if (tr) tr.classList.toggle('is-selected', box.checked);
      };
      if (selectAll) {
        selectAll.addEventListener('change', () => {
          rowBoxes.forEach((b) => { b.checked = selectAll.checked; syncRow(b); });
        });
      }
      rowBoxes.forEach((b) =>
        b.addEventListener('change', () => {
          syncRow(b);
          if (selectAll) {
            const checked = rowBoxes.filter((x) => x.checked).length;
            selectAll.checked = checked === rowBoxes.length;
            selectAll.indeterminate = checked > 0 && checked < rowBoxes.length;
          }
        })
      );
    });
  }

  /* ====================================================================== *
   * 15. SLIDER value bubble                                                 *
   * ====================================================================== */
  function initSliders() {
    $$('input[type="range"][data-slider]').forEach((slider) => {
      const out = slider.parentElement.querySelector('[data-slider-value]') ||
                  document.querySelector(`[data-slider-value="${slider.id}"]`);
      const paint = () => {
        const min = +slider.min || 0, max = +slider.max || 100;
        const pct = ((slider.value - min) / (max - min)) * 100;
        // set both names: --slider-pct (generic) and --slider-fill (track gradient size)
        slider.style.setProperty('--slider-pct', pct + '%');
        slider.style.setProperty('--slider-fill', pct + '%');
        if (out) out.textContent = (slider.dataset.prefix || '') + slider.value + (slider.dataset.suffix || '');
      };
      slider.addEventListener('input', paint);
      paint();
    });
  }

  /* ====================================================================== *
   * 16. STEPPER                                                             *
   * ====================================================================== */
  function initSteppers() {
    $$('[data-stepper]').forEach((stepper) => {
      const input = $('[data-step-input]', stepper) || $('input', stepper);
      if (!input) return;
      const step = +input.step || 1, min = input.min !== '' ? +input.min : -Infinity, max = input.max !== '' ? +input.max : Infinity;
      const clamp = (v) => Math.max(min, Math.min(max, v));
      $('[data-step-dec]', stepper)?.addEventListener('click', () => { input.value = clamp((+input.value || 0) - step); input.dispatchEvent(new Event('change')); });
      $('[data-step-inc]', stepper)?.addEventListener('click', () => { input.value = clamp((+input.value || 0) + step); input.dispatchEvent(new Event('change')); });
    });
  }

  /* ====================================================================== *
   * 17. RATING                                                              *
   * ====================================================================== */
  function initRatings() {
    $$('[data-rating]').forEach((rating) => {
      const stars = $$('.rating__star', rating);
      const setValue = (v) => {
        rating.dataset.value = v;
        stars.forEach((s, i) => s.classList.toggle('is-on', i < v));
      };
      stars.forEach((star, i) => {
        star.setAttribute('tabindex', '0');
        star.setAttribute('role', 'radio');
        star.addEventListener('click', () => setValue(i + 1));
        star.addEventListener('mouseenter', () =>
          stars.forEach((s, j) => s.classList.toggle('is-hover', j <= i)));
        star.addEventListener('mouseleave', () =>
          stars.forEach((s) => s.classList.remove('is-hover')));
        star.addEventListener('keydown', (e) => {
          if (e.key === 'ArrowRight' || e.key === 'ArrowUp') { e.preventDefault(); setValue(Math.min(stars.length, i + 2)); stars[Math.min(stars.length - 1, i + 1)].focus(); }
          if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') { e.preventDefault(); setValue(Math.max(0, i)); if (i > 0) stars[i - 1].focus(); }
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setValue(i + 1); }
        });
      });
      setValue(+rating.dataset.value || 0);
    });
  }

  /* ====================================================================== *
   * 18. CHIP INPUT                                                          *
   * ====================================================================== */
  function initChipInputs() {
    $$('[data-chip-input]').forEach((wrap) => {
      const input = $('input', wrap);
      if (!input) return;
      const addChip = (text) => {
        text = text.trim();
        if (!text) return;
        const chip = document.createElement('span');
        chip.className = 'chip';
        chip.innerHTML = `${text}<button type="button" class="chip__remove" aria-label="${text} 제거">&times;</button>`;
        wrap.insertBefore(chip, input);
      };
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addChip(input.value); input.value = ''; }
        else if (e.key === 'Backspace' && !input.value) {
          const chips = $$('.chip', wrap); chips[chips.length - 1]?.remove();
        }
      });
      wrap.addEventListener('click', (e) => {
        if (e.target.closest('.chip__remove')) e.target.closest('.chip').remove();
        else input.focus();
      });
    });
  }

  /* ====================================================================== *
   * 19. COMBOBOX + MULTISELECT                                              *
   * ====================================================================== */
  function initComboboxes() {
    $$('[data-combobox]').forEach((cb) => {
      const input = $('input', cb);
      const menu = $('.combobox__menu', cb);
      if (!input || !menu) return;
      const options = $$('.combobox__option', menu);
      const openMenu = (o) => { menu.classList.toggle('is-open', o); menu.hidden = !o; input.setAttribute('aria-expanded', String(o)); };
      input.addEventListener('focus', () => openMenu(true));
      input.addEventListener('input', () => {
        const q = input.value.toLowerCase();
        options.forEach((o) => (o.hidden = !o.textContent.toLowerCase().includes(q)));
        openMenu(true);
      });
      options.forEach((o) =>
        o.addEventListener('click', () => {
          input.value = o.textContent.trim();
          options.forEach((x) => x.setAttribute('aria-selected', 'false'));
          o.setAttribute('aria-selected', 'true');
          openMenu(false);
        })
      );
      document.addEventListener('click', (e) => { if (!cb.contains(e.target)) openMenu(false); });
    });

    $$('[data-multiselect]').forEach((ms) => {
      const control = $('.multiselect', ms) || ms.querySelector('.multiselect__control') || ms.firstElementChild;
      const menu = $('.multiselect__menu', ms);
      if (!menu) return;
      const toggleMenu = (o) => { menu.classList.toggle('is-open', o); menu.hidden = !o; };
      (control || ms).addEventListener('click', (e) => {
        if (e.target.closest('.chip__remove')) return;
        toggleMenu(menu.hidden);
      });
      $$('.multiselect__option', menu).forEach((opt) =>
        opt.addEventListener('click', (e) => {
          e.stopPropagation();
          opt.classList.toggle('is-selected');
          const box = opt.querySelector('input[type="checkbox"]');
          if (box) box.checked = opt.classList.contains('is-selected');
        })
      );
      document.addEventListener('click', (e) => { if (!ms.contains(e.target)) toggleMenu(false); });
    });
  }

  /* ====================================================================== *
   * 20. PRICING TOGGLE (monthly / annual)                                   *
   * ====================================================================== */
  function initPricingToggle() {
    $$('[data-pricing-toggle]').forEach((toggle) => {
      const apply = (annual) => {
        $$('.price[data-monthly]').forEach((p) => {
          p.textContent = annual ? p.getAttribute('data-annual') : p.getAttribute('data-monthly');
        });
        $$('[data-pricing-period]').forEach((el) => (el.textContent = annual ? '/년' : '/월'));
        toggle.setAttribute('aria-pressed', String(annual));
      };
      const handler = (e) => {
        const annual = e.target.type === 'checkbox' ? e.target.checked
          : toggle.getAttribute('aria-pressed') !== 'true';
        apply(annual);
      };
      toggle.addEventListener(toggle.querySelector('input') ? 'change' : 'click', handler);
    });
  }

  /* ====================================================================== *
   * 21. WIZARD (multi-step)                                                 *
   * ====================================================================== */
  function initWizards() {
    $$('[data-wizard]').forEach((wizard) => {
      const panels = $$('.wizard__step', wizard);
      const stepEls = $$('.steps__step', wizard);
      let current = 0;
      const render = () => {
        panels.forEach((p, i) => (p.hidden = i !== current));
        stepEls.forEach((s, i) => {
          s.classList.toggle('is-active', i === current);
          s.classList.toggle('is-complete', i < current);
        });
        const prev = $('[data-wizard-prev]', wizard);
        const next = $('[data-wizard-next]', wizard);
        if (prev) prev.disabled = current === 0;
        if (next) next.textContent = current === panels.length - 1 ? '완료' : '다음';
      };
      $('[data-wizard-next]', wizard)?.addEventListener('click', () => {
        if (current < panels.length - 1) { current++; render(); }
        else showToast('가입이 끝났어요. 아쿠아에 오신 걸 환영합니다.', 'success');
      });
      $('[data-wizard-prev]', wizard)?.addEventListener('click', () => { if (current > 0) { current--; render(); } });
      render();
    });
  }

  /* ====================================================================== *
   * 22. COPY TO CLIPBOARD                                                   *
   * ====================================================================== */
  function initCopy() {
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-copy]');
      if (!btn) return;
      let text = btn.getAttribute('data-copy');
      if (btn.hasAttribute('data-copy-target')) {
        const tgt = $(btn.getAttribute('data-copy-target'));
        if (tgt) text = tgt.textContent;
      }
      if (!text) { const block = btn.closest('.code-block'); if (block) text = $('code', block)?.textContent || ''; }
      const done = () => {
        const old = btn.getAttribute('data-copy-label') || btn.textContent;
        btn.classList.add('is-copied');
        const label = btn.querySelector('[data-copy-text]') || btn;
        const prev = label.textContent;
        label.textContent = '복사됨!';
        setTimeout(() => { label.textContent = prev; btn.classList.remove('is-copied'); }, 1600);
      };
      if (navigator.clipboard) navigator.clipboard.writeText(text).then(done).catch(done);
      else done();
    });
  }

  /* ====================================================================== *
   * 23. SIDEBAR collapse + MOBILE nav                                       *
   * ====================================================================== */
  function initNavToggles() {
    document.addEventListener('click', (e) => {
      const sb = e.target.closest('[data-sidebar-toggle]');
      if (sb) {
        const sidebar = $('.sidebar') || document.getElementById(sb.getAttribute('data-sidebar-toggle'));
        if (sidebar) sidebar.classList.toggle('sidebar--collapsed');
      }
      const nav = e.target.closest('[data-nav-toggle]');
      if (nav) {
        const menu = $('.navbar__nav');
        if (menu) {
          const open = menu.classList.toggle('is-open');
          nav.setAttribute('aria-expanded', String(open));
        }
      }
    });
  }

  /* ====================================================================== *
   * 24. SCROLL REVEAL (subtle staggered entrance; respects reduced-motion) *
   * ====================================================================== */
  function initReveal() {
    const targets = $$('[data-reveal]');
    if (!targets.length || reduceMotion() || !('IntersectionObserver' in window)) {
      targets.forEach((t) => t.classList.add('is-revealed'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { entry.target.classList.add('is-revealed'); io.unobserve(entry.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    targets.forEach((t) => io.observe(t));
  }

  /* ====================================================================== *
   * INIT ALL                                                                *
   * ====================================================================== */
  onReady(function () {
    initTheme();
    initBubbles();
    initModals();
    initDrawers();
    initToasts();
    initTabs();
    initAccordions();
    initMenus();
    initContextMenus();
    initPopovers();
    initCommandPalette();
    initCarousels();
    initTables();
    initSliders();
    initSteppers();
    initRatings();
    initChipInputs();
    initComboboxes();
    initPricingToggle();
    initWizards();
    initCopy();
    initNavToggles();
    initReveal();
    initRipple();
    initGlossTrack();
  });

  // expose a tiny API for pages that want to trigger toasts programmatically
  window.Aero = { toast: showToast, applyTheme };
})();
