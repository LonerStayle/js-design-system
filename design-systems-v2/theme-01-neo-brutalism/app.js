/* ==========================================================================
   판판레코드 디자인 시스템 v2 — app.js (바닐라, 외부 라이브러리 없음)
   테마 · 레이어(모달/드로어/커맨드/팝오버/메뉴) · 탭 · 아코디언 · 토스트 ·
   캐러셀 · 표 · 달력 · 칸반 · 폼 검증 · 마퀴 · 복사 · 진행 막대 · 모션 시연
   마크업 계약은 COMPONENTS.md 참고.
   ========================================================================== */
(() => {
  'use strict';

  const doc = document;
  const root = doc.documentElement;
  const STORE_KEY = 'panpan-theme';
  const $ = (sel, ctx = doc) => ctx.querySelector(sel);
  const $$ = (sel, ctx = doc) => Array.from(ctx.querySelectorAll(sel));
  const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const byId = (id) => (id ? doc.getElementById(id) : null);
  let uid = 0;
  const ensureId = (el, prefix) => {
    if (!el.id) el.id = `${prefix}-${++uid}`;
    return el.id;
  };

  const store = {
    get() { try { return localStorage.getItem(STORE_KEY); } catch (e) { return null; } },
    set(v) { try { localStorage.setItem(STORE_KEY, v); } catch (e) { /* 저장 불가 환경 */ } },
  };

  /* ------------------------------------------------------------------------
     1. 테마 — 우선순위: ?theme= → localStorage → prefers-color-scheme
     ------------------------------------------------------------------------ */
  const schemeQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const queryTheme = () => {
    const t = new URLSearchParams(window.location.search).get('theme');
    return t === 'dark' || t === 'light' ? t : null;
  };
  const storedTheme = () => {
    const t = store.get();
    return t === 'dark' || t === 'light' ? t : null;
  };
  const resolveTheme = () => queryTheme() || storedTheme() || (schemeQuery.matches ? 'dark' : 'light');

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    $$('[data-theme-toggle]').forEach((btn) => {
      btn.setAttribute('aria-pressed', String(theme === 'dark'));
      if (!btn.hasAttribute('aria-label') && !btn.textContent.trim()) btn.setAttribute('aria-label', '다크 모드');
      const label = $('[data-theme-label]', btn);
      if (label) label.textContent = theme === 'dark' ? '다크' : '라이트';
    });
  }
  applyTheme(resolveTheme());

  const onSchemeChange = () => { if (!queryTheme() && !storedTheme()) applyTheme(resolveTheme()); };
  if (schemeQuery.addEventListener) schemeQuery.addEventListener('change', onSchemeChange);

  doc.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-theme-toggle]');
    if (!btn) return;
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    store.set(next);
    applyTheme(next);
  });

  /* ------------------------------------------------------------------------
     2. 레이어 스택 — Esc 닫기 · 포커스 트랩 · 스크롤 잠금 · 바깥 클릭
     ------------------------------------------------------------------------ */
  const FOCUSABLE = [
    'a[href]', 'area[href]', 'button:not([disabled])', 'input:not([disabled]):not([type="hidden"])',
    'select:not([disabled])', 'textarea:not([disabled])', 'iframe', '[contenteditable="true"]',
    '[tabindex]:not([tabindex="-1"])',
  ].join(',');
  const focusables = (el) => $$(FOCUSABLE, el).filter((n) => !n.closest('[hidden],[inert]') && n.getClientRects().length > 0);
  const layers = [];

  function pushLayer(layer) {
    const i = layers.indexOf(layer);
    if (i > -1) layers.splice(i, 1);
    layers.push(layer);
    syncLock();
  }
  function dropLayer(layer) {
    const i = layers.indexOf(layer);
    if (i > -1) layers.splice(i, 1);
    syncLock();
  }
  function syncLock() {
    root.classList.toggle('is-locked', layers.some((l) => l.lock));
  }
  function trapTab(e, box) {
    const list = focusables(box);
    if (!list.length) { e.preventDefault(); box.focus(); return; }
    const first = list[0];
    const last = list[list.length - 1];
    const active = doc.activeElement;
    if (e.shiftKey && (active === first || !box.contains(active))) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && (active === last || !box.contains(active))) { e.preventDefault(); first.focus(); }
  }

  doc.addEventListener('keydown', (e) => {
    const top = layers[layers.length - 1];
    if (!top) return;
    if (e.key === 'Escape') {
      e.preventDefault();
      top.close(true);
    } else if (e.key === 'Tab' && top.trap) {
      trapTab(e, top.box);
    }
  });

  doc.addEventListener('pointerdown', (e) => {
    // 트랩 없는 레이어(팝오버 · 메뉴)는 바깥을 누르면 닫힌다
    for (let i = layers.length - 1; i >= 0; i -= 1) {
      const l = layers[i];
      if (l.trap) break;
      if (l.box.contains(e.target) || (l.trigger && l.trigger.contains(e.target))) break;
      l.close(false);
    }
  });

  /* ---- 모달 · 드로어 ---------------------------------------------------- */
  function dialogApi(el) {
    if (el.ppDialog) return el.ppDialog;
    const kind = el.classList.contains('drawer') ? 'drawer' : 'modal';
    const box = $(kind === 'drawer' ? '.drawer__panel' : '.modal__box', el) || el;
    if (!box.hasAttribute('tabindex')) box.setAttribute('tabindex', '-1');
    let hideTimer = null;
    const api = {
      el, box, lock: true, trap: true, trigger: null, isOpen: false,
      open(trigger) {
        if (api.isOpen) return;
        clearTimeout(hideTimer);
        api.trigger = trigger || doc.activeElement;
        el.hidden = false;
        void el.offsetWidth; // 드로어 이동을 위해 한 프레임 확정
        el.classList.add('is-open');
        api.isOpen = true;
        if (api.trigger && api.trigger.setAttribute && api.trigger.hasAttribute('aria-expanded')) api.trigger.setAttribute('aria-expanded', 'true');
        pushLayer(api);
        const target = $('[data-autofocus]', el) || focusables(box)[0] || box;
        target.focus({ preventScroll: true });
        el.dispatchEvent(new CustomEvent('pp:open', { bubbles: true }));
      },
      close(restore = true) {
        if (!api.isOpen) return;
        api.isOpen = false;
        el.classList.remove('is-open');
        dropLayer(api);
        const finish = () => { if (!api.isOpen) el.hidden = true; };
        if (kind === 'drawer' && !reducedMotion()) hideTimer = setTimeout(finish, 160);
        else finish();
        if (api.trigger && api.trigger.hasAttribute && api.trigger.hasAttribute('aria-expanded')) api.trigger.setAttribute('aria-expanded', 'false');
        if (restore && api.trigger && doc.contains(api.trigger)) api.trigger.focus({ preventScroll: true });
        el.dispatchEvent(new CustomEvent('pp:close', { bubbles: true }));
      },
    };
    el.ppDialog = api;
    return api;
  }

  doc.addEventListener('click', (e) => {
    const opener = e.target.closest('[data-modal-open],[data-drawer-open]');
    if (opener) {
      const target = byId(opener.getAttribute('data-modal-open') || opener.getAttribute('data-drawer-open'));
      if (target) { e.preventDefault(); dialogApi(target).open(opener); }
      return;
    }
    const closer = e.target.closest('[data-close]');
    if (closer) {
      const host = closer.closest('.modal, .drawer, .cmd, .popover, .menu');
      if (!host) return;
      e.preventDefault();
      if (host.ppDialog) host.ppDialog.close(true);
      else if (host.ppLayer) host.ppLayer.close(true);
    }
  });

  /* ---- 커맨드 팔레트 (⌘K / Ctrl+K) ------------------------------------ */
  function commandApi(el) {
    if (el.ppDialog) return el.ppDialog;
    const box = $('.cmd__box', el);
    const input = $('.cmd__input', el);
    const list = $('.cmd__list', el);
    const empty = $('.cmd__empty', el);
    if (!box.hasAttribute('tabindex')) box.setAttribute('tabindex', '-1');
    ensureId(list, 'cmd-list');
    input.setAttribute('role', 'combobox');
    input.setAttribute('aria-controls', list.id);
    input.setAttribute('aria-expanded', 'true');
    input.setAttribute('aria-autocomplete', 'list');
    list.setAttribute('role', 'listbox');
    const items = () => $$('.cmd__item', list);
    items().forEach((it) => { it.setAttribute('role', 'option'); ensureId(it, 'cmd-opt'); });

    const visible = () => items().filter((it) => !it.hidden);
    let active = null;
    function setActive(it) {
      items().forEach((x) => x.setAttribute('aria-selected', 'false'));
      active = it || null;
      if (active) {
        active.setAttribute('aria-selected', 'true');
        input.setAttribute('aria-activedescendant', active.id);
        active.scrollIntoView({ block: 'nearest' });
      } else {
        input.removeAttribute('aria-activedescendant');
      }
    }
    function filter(q) {
      const term = q.trim().toLowerCase();
      items().forEach((it) => {
        const hay = (it.getAttribute('data-keywords') || '') + ' ' + it.textContent;
        it.hidden = term !== '' && !hay.toLowerCase().includes(term);
      });
      $$('.cmd__group', list).forEach((g) => {
        // 그룹 라벨 다음 형제부터 다음 그룹 전까지 보이는 항목이 없으면 숨김
        let n = g.nextElementSibling;
        let any = false;
        while (n && !n.classList.contains('cmd__group')) { if (!n.hidden) any = true; n = n.nextElementSibling; }
        g.hidden = !any;
      });
      const v = visible();
      if (empty) empty.hidden = v.length > 0;
      setActive(v[0]);
    }
    input.addEventListener('input', () => filter(input.value));
    input.addEventListener('keydown', (e) => {
      const v = visible();
      const i = v.indexOf(active);
      if (e.key === 'ArrowDown') { e.preventDefault(); setActive(v[(i + 1) % v.length]); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(v[(i - 1 + v.length) % v.length]); }
      else if (e.key === 'Home' && e.altKey) { e.preventDefault(); setActive(v[0]); }
      else if (e.key === 'Enter') { e.preventDefault(); if (active) active.click(); }
    });
    list.addEventListener('mousemove', (e) => {
      const it = e.target.closest('.cmd__item');
      if (it && it !== active && !it.hidden) setActive(it);
    });
    list.addEventListener('click', (e) => {
      const it = e.target.closest('.cmd__item');
      if (!it || it.getAttribute('aria-disabled') === 'true') return;
      const href = it.getAttribute('data-href');
      api.close(!href);
      if (href) window.location.href = href;
    });

    const api = {
      el, box, lock: true, trap: true, trigger: null, isOpen: false,
      open(trigger) {
        if (api.isOpen) return;
        api.trigger = trigger || doc.activeElement;
        el.hidden = false;
        el.classList.add('is-open');
        api.isOpen = true;
        pushLayer(api);
        input.value = '';
        filter('');
        input.focus({ preventScroll: true });
      },
      close(restore = true) {
        if (!api.isOpen) return;
        api.isOpen = false;
        el.classList.remove('is-open');
        el.hidden = true;
        dropLayer(api);
        if (restore && api.trigger && doc.contains(api.trigger)) api.trigger.focus({ preventScroll: true });
      },
    };
    el.ppDialog = api;
    return api;
  }

  doc.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
      const el = $('[data-command]');
      if (!el) return;
      e.preventDefault();
      const api = commandApi(el);
      if (api.isOpen) api.close(true); else api.open();
    }
  });
  doc.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-command-open]');
    if (!btn) return;
    const el = byId(btn.getAttribute('data-command-open')) || $('[data-command]');
    if (!el) return;
    e.preventDefault();
    commandApi(el).open(btn);
  });

  /* ---- 팝오버 · 메뉴 (트랩 없음) --------------------------------------- */
  function floatingApi(panel, trigger, type) {
    if (panel.ppLayer) { panel.ppLayer.trigger = trigger; return panel.ppLayer; }
    const api = {
      el: panel, box: panel, lock: false, trap: false, trigger, isOpen: false,
      open(focusFirst = true) {
        if (api.isOpen) return;
        // 다른 떠 있는 레이어는 닫는다
        layers.filter((l) => !l.trap && l !== api).forEach((l) => l.close(false));
        panel.hidden = false;
        panel.classList.remove('popover--flip', 'menu--end');
        panel.classList.add('is-open');
        api.isOpen = true;
        api.trigger.setAttribute('aria-expanded', 'true');
        const r = panel.getBoundingClientRect();
        if (r.right > window.innerWidth - 8) panel.classList.add(type === 'menu' ? 'menu--end' : 'popover--flip');
        pushLayer(api);
        if (type === 'menu') {
          const items = menuItems(panel);
          if (focusFirst && items[0]) items[0].focus();
        } else if (focusFirst) {
          const f = $('[data-autofocus]', panel) || focusables(panel)[0];
          if (f) f.focus(); else { panel.setAttribute('tabindex', '-1'); panel.focus(); }
        }
      },
      close(restore = true) {
        if (!api.isOpen) return;
        api.isOpen = false;
        panel.hidden = true;
        panel.classList.remove('is-open');
        api.trigger.setAttribute('aria-expanded', 'false');
        dropLayer(api);
        if (restore) api.trigger.focus({ preventScroll: true });
      },
    };
    panel.ppLayer = api;
    return api;
  }
  const menuItems = (menu) => $$('.menu__item', menu).filter((n) => n.getAttribute('aria-disabled') !== 'true' && !n.disabled);

  doc.addEventListener('click', (e) => {
    const pt = e.target.closest('[data-popover-trigger]');
    if (pt) {
      const panel = byId(pt.getAttribute('aria-controls') || pt.getAttribute('data-popover-trigger'));
      if (!panel) return;
      e.preventDefault();
      const api = floatingApi(panel, pt, 'popover');
      if (api.isOpen) api.close(true); else api.open(true);
      return;
    }
    const mt = e.target.closest('[data-menu-trigger]');
    if (mt) {
      const panel = byId(mt.getAttribute('aria-controls') || mt.getAttribute('data-menu-trigger'));
      if (!panel) return;
      e.preventDefault();
      const api = floatingApi(panel, mt, 'menu');
      if (api.isOpen) api.close(true); else api.open(e.detail === 0);
      return;
    }
    const mi = e.target.closest('.menu .menu__item');
    if (mi && mi.getAttribute('aria-disabled') !== 'true') {
      // 체크형 항목: aria-checked 토글 (라디오형은 같은 메뉴 안에서 하나만)
      const role = mi.getAttribute('role');
      if (role === 'menuitemcheckbox') mi.setAttribute('aria-checked', String(mi.getAttribute('aria-checked') !== 'true'));
      if (role === 'menuitemradio') {
        $$('[role="menuitemradio"]', mi.closest('.menu')).forEach((r) => r.setAttribute('aria-checked', String(r === mi)));
      }
    }
    if (mi && !mi.hasAttribute('data-keep-open') && mi.getAttribute('aria-disabled') !== 'true') {
      const menu = mi.closest('.menu');
      if (menu.ppLayer) menu.ppLayer.close(true);
    }
  });

  doc.addEventListener('keydown', (e) => {
    const mt = e.target.closest && e.target.closest('[data-menu-trigger]');
    if (mt && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      const panel = byId(mt.getAttribute('aria-controls') || mt.getAttribute('data-menu-trigger'));
      if (!panel) return;
      e.preventDefault();
      const api = floatingApi(panel, mt, 'menu');
      api.open(true);
      const items = menuItems(panel);
      if (e.key === 'ArrowUp' && items.length) items[items.length - 1].focus();
      return;
    }
    const menu = e.target.closest && e.target.closest('.menu');
    if (!menu) return;
    const items = menuItems(menu);
    const i = items.indexOf(doc.activeElement);
    if (e.key === 'ArrowDown') { e.preventDefault(); items[(i + 1) % items.length].focus(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); items[(i - 1 + items.length) % items.length].focus(); }
    else if (e.key === 'Home') { e.preventDefault(); items[0].focus(); }
    else if (e.key === 'End') { e.preventDefault(); items[items.length - 1].focus(); }
    else if (e.key === 'Tab' && menu.ppLayer) { menu.ppLayer.close(false); }
  });

  /* ------------------------------------------------------------------------
     3. 탭 (자동 활성 · 화살표/Home/End · 세로는 aria-orientation)
     ------------------------------------------------------------------------ */
  function initTabs(box) {
    const tabs = $$('[role="tab"]', box).filter((t) => t.closest('[data-tabs]') === box);
    if (!tabs.length) return;
    const vertical = ($('[role="tablist"]', box) || box).getAttribute('aria-orientation') === 'vertical';
    function select(tab, focus) {
      tabs.forEach((t) => {
        const on = t === tab;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        const panel = byId(t.getAttribute('aria-controls'));
        if (panel) panel.hidden = !on;
      });
      if (focus) tab.focus();
      box.dispatchEvent(new CustomEvent('pp:tab', { bubbles: true, detail: { tab } }));
    }
    const current = tabs.find((t) => t.getAttribute('aria-selected') === 'true') || tabs[0];
    select(current, false);
    tabs.forEach((t) => {
      t.addEventListener('click', () => { if (!t.disabled && t.getAttribute('aria-disabled') !== 'true') select(t, false); });
      t.addEventListener('keydown', (e) => {
        const usable = tabs.filter((x) => !x.disabled && x.getAttribute('aria-disabled') !== 'true');
        const i = usable.indexOf(t);
        const next = vertical ? 'ArrowDown' : 'ArrowRight';
        const prev = vertical ? 'ArrowUp' : 'ArrowLeft';
        let to = null;
        if (e.key === next) to = usable[(i + 1) % usable.length];
        else if (e.key === prev) to = usable[(i - 1 + usable.length) % usable.length];
        else if (e.key === 'Home') to = usable[0];
        else if (e.key === 'End') to = usable[usable.length - 1];
        if (to) { e.preventDefault(); select(to, true); }
      });
    });
  }

  /* ------------------------------------------------------------------------
     4. 아코디언 ([data-accordion="single"]이면 하나만 펼침)
     ------------------------------------------------------------------------ */
  function initAccordion(box) {
    const single = box.getAttribute('data-accordion') === 'single';
    const heads = $$('.acc__head', box);
    heads.forEach((h) => {
      const panel = byId(h.getAttribute('aria-controls'));
      if (panel) panel.hidden = h.getAttribute('aria-expanded') !== 'true';
      h.addEventListener('click', () => {
        if (h.getAttribute('aria-disabled') === 'true') return;
        const open = h.getAttribute('aria-expanded') !== 'true';
        if (single && open) {
          heads.forEach((o) => {
            if (o === h) return;
            o.setAttribute('aria-expanded', 'false');
            const p = byId(o.getAttribute('aria-controls'));
            if (p) p.hidden = true;
          });
        }
        h.setAttribute('aria-expanded', String(open));
        if (panel) panel.hidden = !open;
      });
    });
  }

  /* ------------------------------------------------------------------------
     5. 토스트 — Panpan.toast({ title, text, tone, no, duration })
     ------------------------------------------------------------------------ */
  const CLOSE_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5l14 14M19 5L5 19"/></svg>';
  function toastZone() {
    let z = $('.toast-zone');
    if (!z) {
      z = doc.createElement('div');
      z.className = 'toast-zone';
      z.setAttribute('role', 'status');
      z.setAttribute('aria-live', 'polite');
      doc.body.appendChild(z);
    }
    return z;
  }
  function toast({ title = '', text = '', tone = '', no = '', duration = 4500 } = {}) {
    const zone = toastZone();
    const t = doc.createElement('div');
    t.className = `toast${tone ? ` toast--${tone}` : ''}`;
    if (tone === 'danger') t.setAttribute('role', 'alert');
    const body = doc.createElement('div');
    body.className = 'toast__body';
    if (no) { const n = doc.createElement('p'); n.className = 'toast__no'; n.textContent = no; body.appendChild(n); }
    if (title) { const h = doc.createElement('p'); h.className = 'toast__title'; h.textContent = title; body.appendChild(h); }
    if (text) { const p = doc.createElement('p'); p.className = 'toast__text'; p.textContent = text; body.appendChild(p); }
    const close = doc.createElement('button');
    close.type = 'button';
    close.className = 'toast__close';
    close.setAttribute('aria-label', '알림 닫기');
    close.innerHTML = CLOSE_SVG;
    t.append(body, close);
    zone.prepend(t);
    while (zone.children.length > 3) zone.lastElementChild.remove();

    let timer = null;
    let left = duration;
    let started = 0;
    const remove = () => { clearTimeout(timer); t.remove(); }; // 페이드 없이 즉시
    const start = () => { if (!left) return; started = Date.now(); timer = setTimeout(remove, left); };
    const pause = () => { clearTimeout(timer); left = Math.max(800, left - (Date.now() - started)); };
    close.addEventListener('click', remove);
    t.addEventListener('mouseenter', pause);
    t.addEventListener('mouseleave', start);
    t.addEventListener('focusin', pause);
    t.addEventListener('focusout', start);
    start();
    return t;
  }

  doc.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-toast]');
    if (!btn || btn.hasAttribute('data-busy-demo')) return;
    toast(toastFromAttrs(btn));
  });
  const toastFromAttrs = (el) => ({
    tone: el.getAttribute('data-toast') || '',
    title: el.getAttribute('data-toast-title') || '',
    text: el.getAttribute('data-toast-text') || '',
    no: el.getAttribute('data-toast-no') || '',
  });

  /* ------------------------------------------------------------------------
     6. 버튼 로딩 시연 — [data-busy-demo="1600"]
     ------------------------------------------------------------------------ */
  doc.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-busy-demo]');
    if (!btn || btn.getAttribute('aria-busy') === 'true') return;
    const ms = parseInt(btn.getAttribute('data-busy-demo'), 10) || 1600;
    btn.setAttribute('aria-busy', 'true');
    setTimeout(() => {
      btn.removeAttribute('aria-busy');
      if (btn.hasAttribute('data-toast')) toast(toastFromAttrs(btn));
    }, ms);
  });

  /* ------------------------------------------------------------------------
     7. 경고 닫기 — [data-dismiss]
     ------------------------------------------------------------------------ */
  doc.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-dismiss]');
    if (!btn) return;
    const host = btn.closest('.alert, [data-dismissible]');
    if (host) host.hidden = true;
  });

  /* ------------------------------------------------------------------------
     8. 툴팁 — Esc로 숨김 (WCAG 1.4.13)
     ------------------------------------------------------------------------ */
  doc.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape' || layers.length) return;
    $$('.tip:hover, .tip:focus-within').forEach((t) => {
      t.classList.add('is-hushed');
      const clear = () => { t.classList.remove('is-hushed'); t.removeEventListener('mouseleave', clear); t.removeEventListener('focusout', clear); };
      t.addEventListener('mouseleave', clear);
      t.addEventListener('focusout', clear);
    });
  });

  /* ------------------------------------------------------------------------
     9. 캐러셀 "크레이트 넘기기" — [data-carousel]
     ------------------------------------------------------------------------ */
  function initCarousel(box) {
    const items = $$('.flip__item', box);
    if (!items.length) return;
    const prev = $('[data-carousel-prev]', box);
    const next = $('[data-carousel-next]', box);
    const count = $('[data-carousel-count]', box);
    const name = $('[data-carousel-name]', box);
    const pad = (n) => String(n).padStart(2, '0');
    let idx = Math.max(0, items.findIndex((it) => it.hasAttribute('data-current')));
    box.setAttribute('aria-roledescription', '캐러셀');
    items.forEach((it, i) => {
      it.setAttribute('role', 'group');
      it.setAttribute('aria-roledescription', '판');
      if (!it.hasAttribute('aria-label')) it.setAttribute('aria-label', `${pad(i + 1)} / ${pad(items.length)}`);
    });
    function render() {
      items.forEach((it, i) => {
        const p = i - idx;
        it.setAttribute('data-pos', p < 0 ? 'past' : p > 3 ? 'far' : String(p));
        const on = p === 0;
        it.setAttribute('aria-hidden', String(!on));
        it.inert = !on;
      });
      if (count) count.innerHTML = `<b>${pad(idx + 1)}</b> / ${pad(items.length)}`;
      if (name) name.textContent = items[idx].getAttribute('data-title') || '';
      if (prev) prev.disabled = idx === 0;
      if (next) next.disabled = idx === items.length - 1;
    }
    const go = (d) => { const n = Math.min(items.length - 1, Math.max(0, idx + d)); if (n !== idx) { idx = n; render(); } };
    if (prev) prev.addEventListener('click', () => go(-1));
    if (next) next.addEventListener('click', () => go(1));
    box.addEventListener('keydown', (e) => {
      if (e.target.closest('input, textarea, select')) return;
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
    });
    let sx = null;
    const stage = $('.flip__stage', box) || box;
    stage.addEventListener('pointerdown', (e) => { sx = e.clientX; });
    stage.addEventListener('pointerup', (e) => {
      if (sx === null) return;
      const dx = e.clientX - sx;
      sx = null;
      if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
    });
    render();
  }

  /* ------------------------------------------------------------------------
     10. 표 — 정렬 (.tbl__sort) · 전체 선택 ([data-table-select])
     ------------------------------------------------------------------------ */
  const cellValue = (cell) => {
    if (!cell) return '';
    const raw = cell.getAttribute('data-sort') ?? cell.textContent.trim();
    const num = raw.replace(/[₩,\s원장석%]/g, '');
    return num !== '' && !Number.isNaN(Number(num)) ? Number(num) : raw;
  };
  doc.addEventListener('click', (e) => {
    const btn = e.target.closest('.tbl__sort');
    if (!btn) return;
    const th = btn.closest('th');
    const table = btn.closest('table');
    const tbody = table.tBodies[0];
    if (!tbody) return;
    const col = th.cellIndex;
    const dir = th.getAttribute('aria-sort') === 'ascending' ? 'descending' : 'ascending';
    $$('thead th', table).forEach((h) => { if (h !== th && h.hasAttribute('aria-sort')) h.setAttribute('aria-sort', 'none'); });
    th.setAttribute('aria-sort', dir);
    const rows = Array.from(tbody.rows);
    const collator = new Intl.Collator('ko');
    rows.sort((a, b) => {
      const x = cellValue(a.cells[col]);
      const y = cellValue(b.cells[col]);
      const r = typeof x === 'number' && typeof y === 'number' ? x - y : collator.compare(String(x), String(y));
      return dir === 'ascending' ? r : -r;
    });
    rows.forEach((r) => tbody.appendChild(r));
  });

  function initTableSelect(table) {
    const all = $('thead .tbl-check', table);
    const rowsChecks = () => $$('tbody .tbl-check', table);
    const out = byId(table.getAttribute('data-count-target'));
    function sync() {
      const list = rowsChecks();
      const n = list.filter((c) => c.checked).length;
      list.forEach((c) => {
        const tr = c.closest('tr');
        if (tr) tr.setAttribute('aria-selected', String(c.checked));
      });
      if (all) {
        all.checked = n > 0 && n === list.length;
        all.indeterminate = n > 0 && n < list.length;
      }
      if (out) out.textContent = n ? `${n}건 선택` : '선택 없음';
    }
    table.addEventListener('change', (e) => {
      if (e.target === all) rowsChecks().forEach((c) => { c.checked = all.checked; });
      if (e.target.classList.contains('tbl-check')) sync();
    });
    sync();
  }

  /* ------------------------------------------------------------------------
     11. 달력 — 날짜 선택 ([data-calendar], button.cal__day)
     ------------------------------------------------------------------------ */
  function initCalendar(cal) {
    const out = $('[data-cal-output]', cal);
    cal.addEventListener('click', (e) => {
      const day = e.target.closest('button.cal__day');
      if (!day || day.disabled || day.getAttribute('aria-disabled') === 'true') return;
      $$('button.cal__day', cal).forEach((d) => d.setAttribute('aria-pressed', String(d === day)));
      if (out) out.textContent = day.getAttribute('data-label') || day.getAttribute('aria-label') || day.textContent.trim();
      cal.dispatchEvent(new CustomEvent('pp:date', { bubbles: true, detail: { day } }));
    });
  }

  /* ------------------------------------------------------------------------
     12. 칸반 — 드래그 + 키보드(Space로 집기, ←/→ 열 이동, ↑/↓ 순서, Space 내려놓기)
     ------------------------------------------------------------------------ */
  /* 받침 유무로 조사 고르기: 한글로 끝나면 받침 있음 a / 없음 b, 숫자·영문으로 끝나면 '을(를)' */
  function josa(word, a, b) {
    const c = String(word).trim().slice(-1).charCodeAt(0);
    if (!(c >= 0xAC00 && c <= 0xD7A3)) return `${a}(${b})`;
    return (c - 0xAC00) % 28 ? a : b;
  }

  function initKanban(board) {
    const lists = () => $$('.board__list', board);
    let live = $('.board__live', board);
    if (!live) {
      live = doc.createElement('p');
      live.className = 'board__live vh';
      live.setAttribute('aria-live', 'assertive');
      board.appendChild(live);
    }
    const colName = (list) => {
      const col = list.closest('.board__col');
      const tab = col && $('.board__name', col);
      return tab ? tab.textContent.trim() : '';
    };
    function updateCounts() {
      $$('.board__col', board).forEach((col) => {
        const n = $$('.kcard', col).length;
        $$('[data-count]', col).forEach((c) => { c.textContent = String(n); });
        const empty = $('.board__empty', col);
        if (empty) empty.hidden = n > 0;
      });
      board.dispatchEvent(new CustomEvent('pp:counts', { bubbles: true }));
    }
    $$('.kcard', board).forEach((c) => {
      if (!c.hasAttribute('tabindex')) c.tabIndex = 0;
      c.setAttribute('draggable', 'true');
      if (!c.hasAttribute('aria-roledescription')) c.setAttribute('aria-roledescription', '옮길 수 있는 카드');
    });

    let dragging = null;
    board.addEventListener('dragstart', (e) => {
      const card = e.target.closest('.kcard');
      if (!card) return;
      dragging = card;
      card.classList.add('is-dragging');
      e.dataTransfer.effectAllowed = 'move';
      try { e.dataTransfer.setData('text/plain', card.id || 'card'); } catch (err) { /* 일부 브라우저 */ }
    });
    board.addEventListener('dragend', () => {
      if (dragging) dragging.classList.remove('is-dragging');
      dragging = null;
      lists().forEach((l) => l.classList.remove('is-over'));
      updateCounts();
    });
    board.addEventListener('dragover', (e) => {
      const list = e.target.closest('.board__list');
      if (!list || !dragging) return;
      e.preventDefault();
      lists().forEach((l) => l.classList.toggle('is-over', l === list));
      const after = $$('.kcard:not(.is-dragging)', list).find((c) => {
        const r = c.getBoundingClientRect();
        return e.clientY < r.top + r.height / 2;
      });
      if (after) list.insertBefore(dragging, after);
      else list.appendChild(dragging);
    });
    board.addEventListener('drop', (e) => {
      e.preventDefault();
      if (dragging) { const t = dragging.getAttribute('data-title') || '카드'; live.textContent = `${t}${josa(t, '을', '를')} ${colName(dragging.closest('.board__list'))}에 놓았습니다.`; }
    });

    let grabbed = null;
    board.addEventListener('keydown', (e) => {
      const card = e.target.closest('.kcard');
      if (!card || e.target !== card) return;
      const title = card.getAttribute('data-title') || '카드';
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        if (grabbed === card) {
          card.classList.remove('is-grabbed');
          grabbed = null;
          live.textContent = `${title}${josa(title, '을', '를')} ${colName(card.closest('.board__list'))}에 놓았습니다.`;
          updateCounts();
        } else {
          if (grabbed) grabbed.classList.remove('is-grabbed');
          grabbed = card;
          card.classList.add('is-grabbed');
          live.textContent = `${title}${josa(title, '을', '를')} 집었습니다. 좌우 화살표로 열, 위아래 화살표로 순서를 바꾸고 스페이스로 내려놓으세요.`;
        }
        return;
      }
      if (e.key === 'Escape' && grabbed === card) {
        card.classList.remove('is-grabbed');
        grabbed = null;
        live.textContent = '옮기기를 취소했습니다.';
        return;
      }
      if (grabbed !== card) return;
      const all = lists();
      const list = card.closest('.board__list');
      const li = all.indexOf(list);
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        e.preventDefault();
        const to = all[li + (e.key === 'ArrowRight' ? 1 : -1)];
        if (!to) return;
        to.prepend(card);
        board.dispatchEvent(new CustomEvent('pp:colmove', { detail: { col: to.closest('.board__col') } }));
        card.focus();
        live.textContent = `${colName(to)} 열`;
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault();
        const sib = e.key === 'ArrowUp' ? card.previousElementSibling : card.nextElementSibling;
        if (!sib || !sib.classList.contains('kcard')) return;
        if (e.key === 'ArrowUp') list.insertBefore(card, sib); else list.insertBefore(sib, card);
        card.focus();
      }
      updateCounts();
    });
    updateCounts();
  }

  /* ------------------------------------------------------------------------
     13. 폼 검증 — form[data-validate]
     ------------------------------------------------------------------------ */
  function fieldInvalid(input) {
    if (input.disabled) return false;
    if (input.type === 'checkbox' || input.type === 'radio') {
      if (!input.required) return false;
      if (input.type === 'radio') return !$$(`input[name="${CSS.escape(input.name)}"]`, input.form || doc).some((r) => r.checked);
      return !input.checked;
    }
    if (input.required && !input.value.trim()) return true;
    return !input.checkValidity();
  }
  function setFieldError(input, bad) {
    const field = input.closest('.field, .choice-group, .fieldset');
    const err = field && $('.field__error', field);
    input.setAttribute('aria-invalid', String(bad));
    if (field) field.classList.toggle('field--error', bad);
    if (err) {
      err.hidden = !bad;
      const id = ensureId(err, 'err');
      const ids = new Set((input.getAttribute('aria-describedby') || '').split(/\s+/).filter(Boolean));
      if (bad) ids.add(id); else ids.delete(id);
      if (ids.size) input.setAttribute('aria-describedby', Array.from(ids).join(' '));
      else input.removeAttribute('aria-describedby');
    }
  }
  doc.addEventListener('submit', (e) => {
    const form = e.target.closest('form[data-validate]');
    if (!form) return;
    e.preventDefault();
    const inputs = $$('input, select, textarea', form).filter((i) => i.required || i.type === 'email' || i.pattern);
    let firstBad = null;
    inputs.forEach((i) => {
      const bad = fieldInvalid(i);
      setFieldError(i, bad);
      if (bad && !firstBad) firstBad = i;
    });
    if (firstBad) {
      firstBad.focus();
      return;
    }
    // form="id"로 폼 밖에서 연결된 제출 버튼(드로어 아래 버튼 등)도 로딩 표시
    const btn = e.submitter || $('[type="submit"]', form) || $(`[type="submit"][form="${CSS.escape(form.id || '')}"]`);
    const done = () => {
      if (btn) btn.removeAttribute('aria-busy');
      if (form.hasAttribute('data-toast-title')) toast(toastFromAttrs(form));
      form.dispatchEvent(new CustomEvent('pp:valid', { bubbles: true }));
    };
    if (btn) { btn.setAttribute('aria-busy', 'true'); setTimeout(done, 900); } else done();
  }, true);
  doc.addEventListener('input', (e) => {
    const i = e.target;
    if (i.getAttribute && i.getAttribute('aria-invalid') === 'true' && !fieldInvalid(i)) setFieldError(i, false);
  });
  doc.addEventListener('change', (e) => {
    const i = e.target;
    if (i.getAttribute && i.getAttribute('aria-invalid') === 'true' && !fieldInvalid(i)) setFieldError(i, false);
    const sw = i.closest && i.closest('.switch');
    const state = sw && $('.switch__state', sw);
    if (state) state.textContent = i.checked ? (state.getAttribute('data-on') || '켜짐') : (state.getAttribute('data-off') || '꺼짐');
  });

  /* ------------------------------------------------------------------------
     14. 마퀴 — 두 번째 묶음 복제 + 정지 버튼
     ------------------------------------------------------------------------ */
  function initMarquee(m) {
    const track = $('.marquee__track', m);
    if (!track) return;
    const groups = $$('.marquee__group', track);
    if (groups.length === 1) {
      const clone = groups[0].cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      $$('[id]', clone).forEach((n) => n.removeAttribute('id'));
      $$('a, button', clone).forEach((n) => { n.tabIndex = -1; });
      track.appendChild(clone);
    }
    const tg = $('[data-marquee-toggle]', m);
    if (tg) {
      tg.addEventListener('click', () => {
        const paused = m.classList.toggle('is-paused');
        tg.setAttribute('aria-pressed', String(paused));
        const label = $('span', tg);
        if (label) label.textContent = paused ? '재생' : '정지';
      });
    }
  }

  /* ------------------------------------------------------------------------
     15. 코드 복사 — [data-copy] (가장 가까운 .code 안의 code)
     ------------------------------------------------------------------------ */
  doc.addEventListener('click', async (e) => {
    const btn = e.target.closest('[data-copy]');
    if (!btn) return;
    const host = btn.closest('.code');
    const code = host && $('code', host);
    if (!code) return;
    const text = code.innerText;
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      const ta = doc.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      doc.body.appendChild(ta);
      ta.select();
      try { doc.execCommand('copy'); } catch (e2) { /* 복사 불가 */ }
      ta.remove();
    }
    const label = $('[data-copy-label]', btn) || btn;
    const before = label.textContent;
    btn.classList.add('is-done');
    label.textContent = '복사됨';
    setTimeout(() => { btn.classList.remove('is-done'); label.textContent = before; }, 1600);
  });

  /* ------------------------------------------------------------------------
     16. 진행 막대 · 좌석 — aria-valuenow → --val, [data-seats] 칸 생성
     ------------------------------------------------------------------------ */
  function syncMeter(bar) {
    const min = Number(bar.getAttribute('aria-valuemin') || 0);
    const max = Number(bar.getAttribute('aria-valuemax') || 100);
    const now = Number(bar.getAttribute('aria-valuenow') || 0);
    const pct = Math.max(0, Math.min(100, ((now - min) / (max - min || 1)) * 100));
    const host = bar.closest('.meter') || bar;
    host.style.setProperty('--val', `${pct}%`);
    const tag = $('.meter__tag', host);
    if (tag && tag.hasAttribute('data-auto')) tag.textContent = `${Math.round(pct)}%`;
  }
  function setProgress(bar, value) {
    bar.setAttribute('aria-valuenow', String(value));
    syncMeter(bar);
  }
  function initSeats(grid) {
    if (grid.children.length) return;
    const total = parseInt(grid.getAttribute('data-seats'), 10) || 40;
    const taken = new Set((grid.getAttribute('data-taken') || '').split(',').map((s) => parseInt(s, 10)).filter(Boolean));
    const mine = new Set((grid.getAttribute('data-mine') || '').split(',').map((s) => parseInt(s, 10)).filter(Boolean));
    const frag = doc.createDocumentFragment();
    for (let i = 1; i <= total; i += 1) {
      const c = doc.createElement('span');
      c.className = 'seats__cell' + (taken.has(i) ? ' seats__cell--taken' : '') + (mine.has(i) ? ' seats__cell--mine' : '');
      frag.appendChild(c);
    }
    grid.setAttribute('aria-hidden', 'true'); // 숫자 요약(.seats__sum)이 정보를 전달
    grid.appendChild(frag);
  }

  /* ------------------------------------------------------------------------
     17. 모션 시연 — [data-motion-play="대상 id"]
     ------------------------------------------------------------------------ */
  doc.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-motion-play]');
    if (!btn) return;
    const target = byId(btn.getAttribute('data-motion-play'));
    if (!target) return;
    if (target.classList.contains('mo__obj--spin')) {
      const paused = target.classList.toggle('is-paused');
      btn.setAttribute('aria-pressed', String(paused));
      return;
    }
    target.classList.remove('is-playing');
    void target.offsetWidth;
    target.classList.add('is-playing');
    target.addEventListener('animationend', () => target.classList.remove('is-playing'), { once: true });
  });

  /* ------------------------------------------------------------------------
     칸반 열 전환 (≤480에서 한 열씩) — [data-col-switch="보드 id"]
     넓은 화면에서는 CSS가 바를 숨기고 열을 모두 보여 준다.
     ------------------------------------------------------------------------ */
  function initColSwitch(bar) {
    const board = byId(bar.getAttribute('data-col-switch'));
    if (!board) return;
    const tabs = $$('button', bar);
    const cols = $$('.board__col', board);
    function select(i) {
      tabs.forEach((t, k) => t.setAttribute('aria-pressed', String(k === i)));
      cols.forEach((c, k) => c.classList.toggle('is-shown', k === i));
    }
    function syncCounts() {
      tabs.forEach((t, k) => {
        const n = $('[data-switch-count]', t);
        if (n && cols[k]) n.textContent = String($$('.kcard', cols[k]).length);
      });
    }
    tabs.forEach((t, i) => t.addEventListener('click', () => select(i)));
    board.addEventListener('pp:counts', syncCounts);
    board.addEventListener('pp:colmove', (e) => { const i = cols.indexOf(e.detail.col); if (i > -1) select(i); });
    select(Math.max(0, tabs.findIndex((t) => t.getAttribute('aria-pressed') === 'true')));
    syncCounts();
  }

  /* ------------------------------------------------------------------------
     초기화
     ------------------------------------------------------------------------ */
  function init(scope = doc) {
    $$('[data-tabs]', scope).forEach(initTabs);
    $$('[data-accordion]', scope).forEach(initAccordion);
    $$('[data-carousel]', scope).forEach(initCarousel);
    $$('table[data-table-select]', scope).forEach(initTableSelect);
    $$('[data-calendar]', scope).forEach(initCalendar);
    $$('[data-kanban]', scope).forEach(initKanban);
    $$('[data-col-switch]', scope).forEach(initColSwitch);
    $$('.marquee', scope).forEach(initMarquee);
    $$('.meter [role="progressbar"]', scope).forEach(syncMeter);
    $$('[data-seats]', scope).forEach(initSeats);
    $$('.modal, .drawer, .cmd', scope).forEach((el) => { if (!el.classList.contains('is-open')) el.hidden = true; });
    $$('[data-popover-trigger], [data-menu-trigger]', scope).forEach((t) => {
      if (!t.hasAttribute('aria-expanded')) t.setAttribute('aria-expanded', 'false');
    });
    applyTheme(root.getAttribute('data-theme') || resolveTheme());
  }

  window.Panpan = {
    toast,
    setProgress,
    setTheme(theme) { store.set(theme); applyTheme(theme); },
    open(id) { const el = byId(id); if (!el) return; (el.classList.contains('cmd') ? commandApi(el) : dialogApi(el)).open(); },
    close(id) { const el = byId(id); if (el && el.ppDialog) el.ppDialog.close(true); },
    init,
  };

  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', () => init());
  else init();
})();
