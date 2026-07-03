/* ============================================================================
   THEME 07 — CYBERPUNK TERMINAL · app.js
   ----------------------------------------------------------------------------
   Vanilla JS interaction engine. Zero dependencies. Pure data-attribute driven
   so every page only needs markup. Auto-inits on DOMContentLoaded and also
   exposes an imperative API on `window.CT` (CT.toast, CT.openModal, ...).

   Accessibility / safety:
   · Honors prefers-reduced-motion — typing, scramble, boot, glitch all resolve
     instantly to their final state (no strobing, no flashing > 3Hz anywhere).
   · Modals/drawers/command-palette trap focus, restore it on close, close on ESC.
   · Every widget guards for missing elements so partial pages never throw.
   ============================================================================ */
(function () {
  'use strict';

  /* ---------------------------------------------------------------- utils */
  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const on = (el, ev, fn, opts) => el && el.addEventListener(ev, fn, opts);
  const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';
  const uid = (() => { let i = 0; return (p = 'ct') => `${p}-${++i}`; })();

  function trapFocus(container, e) {
    const items = $$(FOCUSABLE, container).filter(el => el.offsetParent !== null);
    if (!items.length) return;
    const first = items[0], last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  /* ============================================================== THEME */
  const Theme = {
    KEY: 'ct-theme',
    init() {
      const saved = localStorage.getItem(this.KEY);
      if (saved) document.documentElement.setAttribute('data-theme', saved);
      $$('[data-theme-toggle]').forEach(btn => on(btn, 'click', () => this.toggle()));
      this.sync();
    },
    current() { return document.documentElement.getAttribute('data-theme') || 'dark'; },
    toggle() {
      const next = this.current() === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem(this.KEY, next);
      this.sync();
    },
    sync() {
      const t = this.current();
      $$('[data-theme-toggle]').forEach(btn => {
        btn.setAttribute('aria-pressed', String(t === 'light'));
        const lbl = btn.querySelector('[data-theme-label]');
        if (lbl) lbl.textContent = t === 'dark' ? 'DARK' : 'LIGHT';
      });
    }
  };

  /* ============================================================== TYPING */
  // [data-typing] types out data-text (or its existing text) once.
  const Typing = {
    init() {
      $$('[data-typing]').forEach(el => {
        const text = el.getAttribute('data-text') || el.textContent.trim();
        const speed = parseInt(el.getAttribute('data-speed') || '38', 10);
        const delay = parseInt(el.getAttribute('data-delay') || '0', 10);
        el.textContent = '';
        el.classList.add('cursor');
        if (REDUCED) { el.textContent = text; el.classList.remove('cursor'); return; }
        let i = 0;
        const tick = () => {
          if (i <= text.length) { el.textContent = text.slice(0, i); i++; setTimeout(tick, speed); }
          else { el.classList.remove('cursor'); el.dispatchEvent(new CustomEvent('ct:typed')); }
        };
        setTimeout(tick, delay);
      });
    }
  };

  /* ============================================================== SCRAMBLE */
  // [data-scramble] resolves text from random glyphs on load / hover.
  const Scramble = {
    GLY: '!<>-_\\/[]{}—=+*^?#01ABCDEF',
    init() {
      $$('[data-scramble]').forEach(el => {
        const final = el.getAttribute('data-scramble') || el.textContent;
        el.textContent = final;
        if (REDUCED) return;
        const run = () => this.run(el, final);
        if (el.hasAttribute('data-scramble-hover')) on(el, 'mouseenter', run);
        else run();
      });
    },
    run(el, final) {
      let frame = 0; const total = 16;
      const id = setInterval(() => {
        el.textContent = final.split('').map((ch, idx) => {
          if (ch === ' ') return ' ';
          if (idx < (frame / total) * final.length) return final[idx];
          return this.GLY[Math.floor(Math.random() * this.GLY.length)];
        }).join('');
        if (++frame > total) { clearInterval(id); el.textContent = final; }
      }, 32);
    }
  };

  /* ============================================================== BOOT SEQUENCE */
  // [data-boot] prints lines then reveals [data-boot-reveal] siblings.
  const Boot = {
    init() {
      $$('[data-boot]').forEach(box => {
        const lines = (box.getAttribute('data-boot') || '').split('|').filter(Boolean);
        const out = box.querySelector('[data-boot-out]') || box;
        const reveal = () => $$('[data-boot-reveal]').forEach(el => el.classList.add('is-revealed'));
        if (REDUCED || !lines.length) {
          out.innerHTML = lines.map(l => `<div class="ct-bootline">${l}</div>`).join('');
          reveal(); return;
        }
        out.innerHTML = '';
        let i = 0;
        const tick = () => {
          if (i < lines.length) {
            const d = document.createElement('div');
            d.className = 'ct-bootline';
            d.innerHTML = `<span class="t-success">OK</span> ${lines[i]}`;
            out.appendChild(d);
            out.scrollTop = out.scrollHeight;
            i++; setTimeout(tick, 140 + Math.random() * 120);
          } else { setTimeout(reveal, 220); }
        };
        setTimeout(tick, 160);
      });
    }
  };

  /* ============================================================== TABS */
  const Tabs = {
    init() {
      $$('[data-tabs]').forEach(group => {
        const tabs = $$('[role="tab"]', group);
        const select = (tab) => {
          tabs.forEach(t => {
            const sel = t === tab;
            t.setAttribute('aria-selected', String(sel));
            t.classList.toggle('is-active', sel);
            t.tabIndex = sel ? 0 : -1;
            const panel = document.getElementById(t.getAttribute('aria-controls'));
            if (panel) panel.hidden = !sel;
          });
        };
        tabs.forEach((tab, idx) => {
          on(tab, 'click', () => select(tab));
          on(tab, 'keydown', (e) => {
            let n = null;
            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') n = tabs[(idx + 1) % tabs.length];
            if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   n = tabs[(idx - 1 + tabs.length) % tabs.length];
            if (e.key === 'Home') n = tabs[0];
            if (e.key === 'End')  n = tabs[tabs.length - 1];
            if (n) { e.preventDefault(); n.focus(); select(n); }
          });
        });
        const active = tabs.find(t => t.getAttribute('aria-selected') === 'true') || tabs[0];
        if (active) select(active);
      });
    }
  };

  /* ============================================================== ACCORDION */
  const Accordion = {
    init() {
      $$('[data-accordion]').forEach(acc => {
        const single = acc.hasAttribute('data-accordion-single');
        const triggers = $$('.ct-accordion__trigger', acc);
        triggers.forEach(trigger => {
          on(trigger, 'click', () => {
            const open = trigger.getAttribute('aria-expanded') === 'true';
            if (single) triggers.forEach(t => { t.setAttribute('aria-expanded', 'false'); t.closest('.ct-accordion__item')?.classList.remove('is-open'); });
            trigger.setAttribute('aria-expanded', String(!open));
            trigger.closest('.ct-accordion__item')?.classList.toggle('is-open', !open);
          });
        });
      });
    }
  };

  /* ============================================================== MODAL */
  const Modal = {
    last: null,
    init() {
      $$('[data-modal-open]').forEach(btn =>
        on(btn, 'click', () => this.open(btn.getAttribute('data-modal-open'))));
      $$('[data-modal]').forEach(modal => {
        $$('[data-modal-close]', modal).forEach(c => on(c, 'click', () => this.close(modal)));
        on(modal, 'mousedown', (e) => { if (e.target === modal || e.target.classList.contains('ct-modal__overlay')) this.close(modal); });
        on(modal, 'keydown', (e) => {
          if (e.key === 'Escape') this.close(modal);
          if (e.key === 'Tab') trapFocus(modal, e);
        });
      });
    },
    open(sel) {
      const modal = typeof sel === 'string' ? $(sel) : sel;
      if (!modal) return;
      this.last = document.activeElement;
      modal.classList.add('is-open');
      modal.removeAttribute('hidden');
      document.body.style.overflow = 'hidden';
      const focusEl = modal.querySelector('[autofocus]') || modal.querySelector(FOCUSABLE);
      setTimeout(() => focusEl && focusEl.focus(), 30);
    },
    close(sel) {
      const modal = typeof sel === 'string' ? $(sel) : sel;
      if (!modal) return;
      modal.classList.remove('is-open');
      document.body.style.overflow = '';
      if (this.last) this.last.focus();
    }
  };

  /* ============================================================== DRAWER */
  const Drawer = {
    last: null,
    init() {
      $$('[data-drawer-open]').forEach(btn =>
        on(btn, 'click', () => this.open(btn.getAttribute('data-drawer-open'))));
      $$('[data-drawer]').forEach(drawer => {
        $$('[data-drawer-close]', drawer).forEach(c => on(c, 'click', () => this.close(drawer)));
        on(drawer, 'mousedown', (e) => { if (e.target === drawer || e.target.classList.contains('ct-drawer__overlay')) this.close(drawer); });
        on(drawer, 'keydown', (e) => {
          if (e.key === 'Escape') this.close(drawer);
          if (e.key === 'Tab') trapFocus(drawer, e);
        });
      });
    },
    open(sel) {
      const d = typeof sel === 'string' ? $(sel) : sel;
      if (!d) return;
      this.last = document.activeElement;
      d.classList.add('is-open'); d.removeAttribute('hidden');
      document.body.style.overflow = 'hidden';
      setTimeout(() => { const f = d.querySelector(FOCUSABLE); f && f.focus(); }, 30);
    },
    close(sel) {
      const d = typeof sel === 'string' ? $(sel) : sel;
      if (!d) return;
      d.classList.remove('is-open');
      document.body.style.overflow = '';
      if (this.last) this.last.focus();
    }
  };

  /* ============================================================== TOAST */
  const Toast = {
    stack: null,
    ICONS: {
      success: '✔', warning: '▲', danger: '✕', info: 'ℹ'
    },
    ensure() {
      if (this.stack) return this.stack;
      this.stack = $('.ct-toast-stack') || (() => {
        const s = document.createElement('div');
        s.className = 'ct-toast-stack';
        s.setAttribute('aria-live', 'polite');
        s.setAttribute('aria-atomic', 'false');
        document.body.appendChild(s);
        return s;
      })();
      return this.stack;
    },
    show(opts) {
      const o = typeof opts === 'string' ? { msg: opts } : (opts || {});
      const variant = o.variant || 'info';
      const timeout = o.timeout == null ? 4200 : o.timeout;
      const stack = this.ensure();
      const el = document.createElement('div');
      el.className = `ct-toast ct-toast--${variant}`;
      el.setAttribute('role', variant === 'danger' ? 'alert' : 'status');
      el.innerHTML = `
        <span class="ct-toast__icon" aria-hidden="true">${this.ICONS[variant] || '›'}</span>
        <div class="ct-toast__body">
          ${o.title ? `<div class="ct-toast__title">${o.title}</div>` : ''}
          <div class="ct-toast__msg">${o.msg || ''}</div>
        </div>
        <button class="ct-toast__close" aria-label="Dismiss notification">✕</button>
        ${timeout ? '<span class="ct-toast__progress"></span>' : ''}`;
      stack.appendChild(el);
      const remove = () => {
        el.classList.add('is-leaving');
        setTimeout(() => el.remove(), REDUCED ? 0 : 240);
      };
      on(el.querySelector('.ct-toast__close'), 'click', remove);
      if (timeout) {
        const bar = el.querySelector('.ct-toast__progress');
        if (bar && !REDUCED) {
          bar.style.transition = `width ${timeout}ms linear`;
          bar.style.width = '100%';
          requestAnimationFrame(() => { bar.style.width = '0%'; });
        }
        setTimeout(remove, timeout);
      }
      return el;
    },
    init() {
      $$('[data-toast]').forEach(btn => on(btn, 'click', () => this.show({
        title: btn.getAttribute('data-toast-title') || '',
        msg: btn.getAttribute('data-toast') || 'Event logged.',
        variant: btn.getAttribute('data-toast-variant') || 'info'
      })));
    }
  };

  /* ============================================================== DROPDOWN / MENU */
  const Dropdown = {
    open: null,
    init() {
      $$('[data-dropdown]').forEach(dd => {
        const trigger = dd.querySelector('[data-dropdown-trigger]');
        const menu = dd.querySelector('.ct-dropdown__menu, [role="menu"]');
        if (!trigger || !menu) return;
        on(trigger, 'click', (e) => { e.stopPropagation(); this.toggle(dd, trigger, menu); });
        on(trigger, 'keydown', (e) => {
          if (e.key === 'ArrowDown') { e.preventDefault(); this.show(dd, trigger, menu); this.focusItem(menu, 0); }
        });
        const items = $$('[role="menuitem"], .ct-menu__item', menu);
        items.forEach((it, idx) => on(it, 'keydown', (e) => {
          if (e.key === 'ArrowDown') { e.preventDefault(); this.focusItem(menu, idx + 1); }
          if (e.key === 'ArrowUp')   { e.preventDefault(); this.focusItem(menu, idx - 1); }
          if (e.key === 'Escape')    { this.hide(dd, trigger, menu); trigger.focus(); }
        }));
      });
      on(document, 'click', () => this.closeAll());
      on(document, 'keydown', (e) => { if (e.key === 'Escape') this.closeAll(); });
    },
    focusItem(menu, idx) {
      const items = $$('[role="menuitem"], .ct-menu__item', menu).filter(i => !i.hasAttribute('disabled'));
      if (!items.length) return;
      const n = (idx + items.length) % items.length;
      items[n].focus();
    },
    toggle(dd, t, m) { dd.classList.contains('is-open') ? this.hide(dd, t, m) : this.show(dd, t, m); },
    show(dd, t, m) { this.closeAll(); dd.classList.add('is-open'); m.classList.add('is-open'); t.setAttribute('aria-expanded', 'true'); this.open = { dd, t, m }; },
    hide(dd, t, m) { dd.classList.remove('is-open'); m.classList.remove('is-open'); t.setAttribute('aria-expanded', 'false'); if (this.open && this.open.dd === dd) this.open = null; },
    closeAll() { if (this.open) this.hide(this.open.dd, this.open.t, this.open.m); }
  };

  /* ============================================================== CONTEXT MENU */
  const ContextMenu = {
    init() {
      $$('[data-context-menu]').forEach(area => {
        const menu = $(area.getAttribute('data-context-menu'));
        if (!menu) return;
        on(area, 'contextmenu', (e) => {
          e.preventDefault();
          menu.classList.add('is-open');
          const w = menu.offsetWidth || 200, h = menu.offsetHeight || 200;
          let x = e.clientX, y = e.clientY;
          if (x + w > window.innerWidth)  x = window.innerWidth - w - 8;
          if (y + h > window.innerHeight) y = window.innerHeight - h - 8;
          menu.style.left = x + 'px'; menu.style.top = y + 'px';
        });
      });
      on(document, 'click', () => $$('.ct-context-menu.is-open').forEach(m => m.classList.remove('is-open')));
      on(document, 'keydown', (e) => { if (e.key === 'Escape') $$('.ct-context-menu.is-open').forEach(m => m.classList.remove('is-open')); });
    }
  };

  /* ============================================================== COMMAND PALETTE */
  const Cmdk = {
    el: null, input: null, list: null, items: [], active: 0,
    init() {
      this.el = $('[data-cmdk]');
      $$('[data-cmdk-open]').forEach(b => on(b, 'click', () => this.show()));
      on(document, 'keydown', (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); this.toggle(); }
      });
      if (!this.el) return;
      this.input = $('.ct-cmdk__input', this.el);
      this.list  = $('.ct-cmdk__list', this.el);
      on(this.el, 'mousedown', (e) => { if (e.target.classList.contains('ct-cmdk__overlay') || e.target === this.el) this.hide(); });
      on(this.input, 'input', () => this.filter());
      on(this.el, 'keydown', (e) => {
        if (e.key === 'Escape') this.hide();
        else if (e.key === 'ArrowDown') { e.preventDefault(); this.move(1); }
        else if (e.key === 'ArrowUp')   { e.preventDefault(); this.move(-1); }
        else if (e.key === 'Enter')     { e.preventDefault(); this.run(); }
      });
      $$('[data-cmdk-item]', this.el).forEach((it, i) => {
        on(it, 'click', () => { this.active = this.visible().indexOf(it); this.run(); });
        on(it, 'mousemove', () => { this.active = this.visible().indexOf(it); this.paint(); });
      });
    },
    toggle() { this.el && (this.el.classList.contains('is-open') ? this.hide() : this.show()); },
    show() {
      if (!this.el) return;
      this.el.classList.add('is-open'); this.el.removeAttribute('hidden');
      document.body.style.overflow = 'hidden';
      this.input.value = ''; this.filter();
      setTimeout(() => this.input.focus(), 30);
    },
    hide() { if (!this.el) return; this.el.classList.remove('is-open'); document.body.style.overflow = ''; },
    visible() { return $$('[data-cmdk-item]', this.el).filter(i => !i.hidden); },
    filter() {
      const q = (this.input.value || '').toLowerCase().trim();
      let any = false;
      $$('[data-cmdk-item]', this.el).forEach(it => {
        const hay = (it.getAttribute('data-keywords') || it.textContent).toLowerCase();
        const show = !q || hay.includes(q);
        it.hidden = !show; if (show) any = true;
      });
      $$('.ct-cmdk__group', this.el).forEach(g => {
        g.hidden = !$$('[data-cmdk-item]', g).some(i => !i.hidden);
      });
      const empty = $('.ct-cmdk__empty', this.el);
      if (empty) empty.hidden = any;
      this.active = 0; this.paint();
    },
    move(d) { const v = this.visible(); if (!v.length) return; this.active = (this.active + d + v.length) % v.length; this.paint(); },
    paint() {
      const v = this.visible();
      v.forEach((it, i) => {
        it.classList.toggle('is-active', i === this.active);
        it.setAttribute('aria-selected', String(i === this.active));
      });
      v[this.active] && v[this.active].scrollIntoView({ block: 'nearest' });
    },
    run() {
      const it = this.visible()[this.active]; if (!it) return;
      const href = it.getAttribute('data-href');
      const action = it.getAttribute('data-action');
      this.hide();
      if (href) window.location.href = href;
      else if (action === 'theme') Theme.toggle();
      else if (action) { Toast.show({ title: 'COMMAND', msg: action, variant: 'info' }); }
    }
  };

  /* ============================================================== CAROUSEL */
  const Carousel = {
    init() {
      $$('[data-carousel]').forEach(car => {
        const track = $('.ct-carousel__track', car);
        const slides = $$('.ct-carousel__slide', car);
        const dots = $$('.ct-carousel__dots [data-dot]', car);
        let idx = 0;
        if (!track || !slides.length) return;
        const go = (n) => {
          idx = (n + slides.length) % slides.length;
          track.style.transform = `translateX(-${idx * 100}%)`;
          dots.forEach((d, i) => { d.classList.toggle('is-active', i === idx); d.setAttribute('aria-current', String(i === idx)); });
        };
        on($('[data-carousel-prev]', car), 'click', () => go(idx - 1));
        on($('[data-carousel-next]', car), 'click', () => go(idx + 1));
        dots.forEach((d, i) => on(d, 'click', () => go(i)));
        on(car, 'keydown', (e) => { if (e.key === 'ArrowLeft') go(idx - 1); if (e.key === 'ArrowRight') go(idx + 1); });
        go(0);
      });
    }
  };

  /* ============================================================== STEPPER */
  const Stepper = {
    init() {
      $$('[data-stepper]').forEach(st => {
        const input = $('input', st);
        const min = input.min !== '' ? +input.min : -Infinity;
        const max = input.max !== '' ? +input.max : Infinity;
        const step = +input.step || 1;
        const set = (v) => { input.value = Math.max(min, Math.min(max, v)); };
        on($('[data-stepper-dec]', st), 'click', () => set((+input.value || 0) - step));
        on($('[data-stepper-inc]', st), 'click', () => set((+input.value || 0) + step));
      });
    }
  };

  /* ============================================================== SLIDER */
  const Slider = {
    init() {
      $$('[data-slider]').forEach(wrap => {
        const input = $('input[type="range"]', wrap);
        const bubble = $('[data-slider-value]', wrap);
        if (!input) return;
        const paint = () => {
          const min = +input.min || 0, max = +input.max || 100;
          const pct = ((+input.value - min) / (max - min)) * 100;
          // forms.css colours the played track from --_fill (a 0-100% length)
          input.style.setProperty('--_fill', pct + '%');
          wrap.style.setProperty('--_fill', pct + '%');
          if (bubble) bubble.textContent = input.value;
        };
        on(input, 'input', paint); paint();
      });
    }
  };

  /* ============================================================== COPY */
  const Copy = {
    init() {
      $$('[data-copy]').forEach(btn => on(btn, 'click', async () => {
        const sel = btn.getAttribute('data-copy');
        const target = sel ? $(sel) : btn.closest('.ct-code')?.querySelector('.ct-code__body, pre');
        const text = target ? target.innerText : '';
        try { await navigator.clipboard.writeText(text); } catch (_) {}
        const old = btn.textContent;
        btn.textContent = 'COPIED';
        Toast.show({ msg: 'Copied to clipboard', variant: 'success', timeout: 1800 });
        setTimeout(() => { btn.textContent = old; }, 1400);
      }));
    }
  };

  /* ============================================================== TABLE */
  const Table = {
    init() {
      $$('[data-table]').forEach(table => {
        // sorting
        $$('[data-sort]', table).forEach(th => {
          on(th, 'click', () => this.sort(table, th));
          on(th, 'keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); this.sort(table, th); } });
        });
        // select-all + row checks
        const all = $('[data-select-all]', table);
        const rowChecks = () => $$('tbody [data-row-check]', table);
        if (all) on(all, 'change', () => {
          rowChecks().forEach(c => { c.checked = all.checked; c.closest('tr')?.classList.toggle('is-selected', all.checked); });
          this.count(table);
        });
        rowChecks().forEach(c => on(c, 'change', () => {
          c.closest('tr')?.classList.toggle('is-selected', c.checked);
          if (all) { const arr = rowChecks(); all.checked = arr.every(x => x.checked); all.indeterminate = !all.checked && arr.some(x => x.checked); }
          this.count(table);
        }));
      });
    },
    count(table) {
      const n = $$('tbody [data-row-check]:checked', table).length;
      const out = table.parentElement.querySelector('[data-select-count]') || document.querySelector(`[data-select-count="${table.id}"]`);
      if (out) out.textContent = n ? `${n} SELECTED` : 'NONE SELECTED';
    },
    sort(table, th) {
      const tbody = $('tbody', table);
      const idx = $$('th', table.tHead.rows[0]).indexOf(th);
      const type = th.getAttribute('data-sort') || 'text';
      const cur = th.getAttribute('aria-sort');
      const dir = cur === 'ascending' ? 'descending' : 'ascending';
      $$('th[data-sort]', table).forEach(h => h.removeAttribute('aria-sort'));
      th.setAttribute('aria-sort', dir);
      const rows = $$('tbody > tr', table);
      const val = (r) => {
        const c = r.children[idx]; const t = (c?.getAttribute('data-value') ?? c?.textContent ?? '').trim();
        return type === 'num' ? parseFloat(t.replace(/[^0-9.\-]/g, '')) || 0 : t.toLowerCase();
      };
      rows.sort((a, b) => { const x = val(a), y = val(b); return (x < y ? -1 : x > y ? 1 : 0) * (dir === 'ascending' ? 1 : -1); });
      rows.forEach(r => tbody.appendChild(r));
    }
  };

  /* ============================================================== SPINNER (braille) */
  const Spinner = {
    FRAMES: ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'],
    init() {
      $$('[data-spinner]').forEach(el => {
        if (REDUCED) { el.textContent = '⠿'; return; }
        let i = 0;
        setInterval(() => { el.textContent = this.FRAMES[i = (i + 1) % this.FRAMES.length]; }, 90);
      });
    }
  };

  /* ============================================================== ASCII PROGRESS */
  const AsciiProgress = {
    init() {
      $$('[data-ascii-progress]').forEach(el => this.render(el, +el.getAttribute('data-ascii-progress') || 0));
    },
    render(el, pct) {
      const width = +el.getAttribute('data-width') || 20;
      const filled = Math.round((pct / 100) * width);
      const bar = '█'.repeat(filled) + '░'.repeat(width - filled);
      el.innerHTML = `[<span class="t-primary">${bar.slice(0, filled)}</span><span class="t-subtle">${bar.slice(filled)}</span>] ${String(pct).padStart(3, ' ')}%`;
    }
  };

  /* ============================================================== SIDEBAR / NAV */
  const Nav = {
    init() {
      $$('[data-sidebar-toggle]').forEach(btn => on(btn, 'click', () => {
        const sb = $(btn.getAttribute('data-sidebar-toggle') || '.ct-sidebar');
        if (sb) { const c = sb.classList.toggle('is-collapsed'); btn.setAttribute('aria-pressed', String(c)); }
      }));
      $$('[data-nav-toggle]').forEach(btn => on(btn, 'click', () => {
        const nav = $(btn.getAttribute('data-nav-toggle') || '.ct-navbar__nav') || btn.closest('.ct-navbar')?.querySelector('.ct-navbar__nav');
        if (nav) { const o = nav.classList.toggle('is-open'); btn.setAttribute('aria-expanded', String(o)); }
      }));
    }
  };

  /* ============================================================== COMBOBOX */
  const Combobox = {
    init() {
      $$('[data-combobox]').forEach(cb => {
        const input = $('input', cb);
        const list = $('.ct-combobox__list', cb);
        if (!input || !list) return;
        const options = $$('.ct-combobox__option', list);
        const show = (b) => { list.classList.toggle('is-open', b); input.setAttribute('aria-expanded', String(b)); };
        on(input, 'focus', () => show(true));
        on(input, 'input', () => {
          const q = input.value.toLowerCase();
          options.forEach(o => o.hidden = !o.textContent.toLowerCase().includes(q));
          show(true);
        });
        options.forEach(o => on(o, 'click', () => { input.value = o.getAttribute('data-value') || o.textContent.trim(); show(false); }));
        on(document, 'click', (e) => { if (!cb.contains(e.target)) show(false); });
        on(input, 'keydown', (e) => { if (e.key === 'Escape') show(false); });
      });
    }
  };

  /* ============================================================== CHIP INPUT / MULTISELECT */
  const ChipInput = {
    init() {
      $$('[data-chipinput]').forEach(box => {
        const input = $('input', box);
        if (!input) return;
        const add = (val) => {
          val = val.trim(); if (!val) return;
          const chip = document.createElement('span');
          chip.className = 'ct-chipinput__chip';
          chip.innerHTML = `${val} <button type="button" class="ct-chipinput__remove" aria-label="Remove ${val}">✕</button>`;
          box.insertBefore(chip, input);
          on(chip.querySelector('button'), 'click', () => chip.remove());
        };
        on(input, 'keydown', (e) => {
          if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); add(input.value); input.value = ''; }
          else if (e.key === 'Backspace' && !input.value) { const chips = $$('.ct-chipinput__chip', box); chips.length && chips[chips.length - 1].remove(); }
        });
        box.querySelectorAll('.ct-chipinput__remove').forEach(b => on(b, 'click', (e) => e.target.closest('.ct-chipinput__chip').remove()));
      });
    }
  };

  /* ============================================================== RATING */
  const Rating = {
    init() {
      $$('[data-rating]').forEach(r => {
        if (r.hasAttribute('data-readonly')) return;
        const items = $$('.ct-rating__item', r);
        const paint = (n) => items.forEach((it, i) => it.classList.toggle('is-filled', i < n));
        items.forEach((it, i) => {
          on(it, 'mouseenter', () => paint(i + 1));
          on(it, 'click', () => { r.setAttribute('data-value', i + 1); paint(i + 1); });
          on(it, 'keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); r.setAttribute('data-value', i + 1); paint(i + 1); } });
        });
        on(r, 'mouseleave', () => paint(+r.getAttribute('data-value') || 0));
        paint(+r.getAttribute('data-value') || 0);
      });
    }
  };

  /* ============================================================== FILE UPLOAD */
  const FileUpload = {
    init() {
      $$('[data-fileupload]').forEach(fu => {
        const zone = $('.ct-fileupload__zone', fu);
        const input = $('input[type="file"]', fu);
        const listEl = $('.ct-fileupload__list', fu);
        if (!zone || !input) return;
        const render = (files) => {
          if (!listEl) return;
          listEl.innerHTML = Array.from(files).map(f =>
            `<div class="ct-fileupload__file"><span class="ct-fileupload__name">${f.name}</span><span class="ct-fileupload__size">${(f.size / 1024).toFixed(1)} KB</span></div>`).join('');
        };
        on(zone, 'click', () => input.click());
        on(input, 'change', () => render(input.files));
        ['dragover', 'dragenter'].forEach(ev => on(zone, ev, (e) => { e.preventDefault(); zone.classList.add('is-dragover'); }));
        ['dragleave', 'drop'].forEach(ev => on(zone, ev, (e) => { e.preventDefault(); zone.classList.remove('is-dragover'); }));
        on(zone, 'drop', (e) => { if (e.dataTransfer?.files) { input.files = e.dataTransfer.files; render(e.dataTransfer.files); } });
      });
    }
  };

  /* ============================================================== DATE PICKER */
  const DatePicker = {
    MONTHS: ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'],
    init() {
      $$('[data-datepicker]').forEach(dp => {
        const input = $('input', dp);
        const pop = $('.ct-datepicker__pop', dp);
        if (!input || !pop) return;
        // start from a fixed reference (no Date.now dependence for determinism if unavailable)
        let view = new Date(2026, 5, 1); // June 2026 reference
        let selected = null;
        const render = () => {
          const y = view.getFullYear(), m = view.getMonth();
          const first = new Date(y, m, 1).getDay();
          const days = new Date(y, m + 1, 0).getDate();
          let cells = '';
          for (let i = 0; i < first; i++) cells += `<button class="ct-calendar__day is-muted" tabindex="-1" disabled></button>`;
          for (let d = 1; d <= days; d++) {
            const isSel = selected && selected.getFullYear() === y && selected.getMonth() === m && selected.getDate() === d;
            cells += `<button class="ct-calendar__day${isSel ? ' is-selected' : ''}" data-day="${d}">${d}</button>`;
          }
          pop.innerHTML = `
            <div class="ct-calendar__head">
              <button class="ct-btn ct-btn--icon ct-btn--sm" data-cal-prev aria-label="Previous month">‹</button>
              <span class="ct-calendar__title">${this.MONTHS[m]} ${y}</span>
              <button class="ct-btn ct-btn--icon ct-btn--sm" data-cal-next aria-label="Next month">›</button>
            </div>
            <div class="ct-calendar__grid">
              ${['S','M','T','W','T','F','S'].map(w => `<span class="ct-calendar__weekday">${w}</span>`).join('')}
              ${cells}
            </div>`;
          on($('[data-cal-prev]', pop), 'click', (e) => { e.stopPropagation(); view = new Date(y, m - 1, 1); render(); });
          on($('[data-cal-next]', pop), 'click', (e) => { e.stopPropagation(); view = new Date(y, m + 1, 1); render(); });
          $$('[data-day]', pop).forEach(b => on(b, 'click', () => {
            selected = new Date(y, m, +b.getAttribute('data-day'));
            input.value = `${y}-${String(m + 1).padStart(2, '0')}-${String(selected.getDate()).padStart(2, '0')}`;
            pop.classList.remove('is-open');
          }));
        };
        on(input, 'focus', () => { pop.classList.add('is-open'); render(); });
        on(input, 'click', (e) => { e.stopPropagation(); pop.classList.add('is-open'); render(); });
        on(document, 'click', (e) => { if (!dp.contains(e.target)) pop.classList.remove('is-open'); });
      });
    }
  };

  /* ============================================================== GALLERY SEARCH (index) */
  const Gallery = {
    init() {
      const search = $('[data-gallery-search]');
      if (!search) return;
      on(search, 'input', () => {
        const q = search.value.toLowerCase().trim();
        $$('[data-comp]').forEach(sec => {
          const hay = (sec.getAttribute('data-comp') + ' ' + sec.textContent).toLowerCase();
          sec.style.display = (!q || hay.includes(q)) ? '' : 'none';
        });
      });
    }
  };

  /* ============================================================== INIT */
  function init() {
    [Theme, Typing, Scramble, Boot, Tabs, Accordion, Modal, Drawer, Toast,
     Dropdown, ContextMenu, Cmdk, Carousel, Stepper, Slider, Copy, Table,
     Spinner, AsciiProgress, Nav, Combobox, ChipInput, Rating, FileUpload,
     DatePicker, Gallery].forEach(m => { try { m.init(); } catch (e) { /* isolate */ console.warn('[CT] init', m, e); } });
  }
  if (document.readyState === 'loading') on(document, 'DOMContentLoaded', init);
  else init();

  /* imperative API */
  window.CT = {
    toast: (o) => Toast.show(o),
    openModal: (s) => Modal.open(s),
    closeModal: (s) => Modal.close(s),
    openDrawer: (s) => Drawer.open(s),
    closeDrawer: (s) => Drawer.close(s),
    openCmdk: () => Cmdk.show(),
    toggleTheme: () => Theme.toggle(),
    asciiProgress: (el, pct) => AsciiProgress.render(el, pct)
  };
})();
