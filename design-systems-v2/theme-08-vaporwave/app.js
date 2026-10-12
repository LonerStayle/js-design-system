/* ==========================================================================
   되감기홈쇼핑 REWIND 99 — app.js (바닐라, 외부 라이브러리 없음)
   1 테마 · 2 레이어(모달/드로어/실행창/풍선/메뉴) · 3 창 관리(앞으로/말기/최대화/닫기)
   4 탭 · 5 아코디언 · 6 토스트 · 7 채널 넘기기 · 8 스프레드시트 · 9 달력
   10 칸반 · 11 폼 검증 · 12 자막 띠 · 13 복사 · 14 진행 막대 · 15 숫자 롤링
   16 실시간 수치 · 17 모션 시연 · 18 트리/파일 목록/스핀 · 19 툴팁 · 20 가로 스크롤 힌트
   마크업 계약은 COMPONENTS.md 참고.
   ========================================================================== */
(() => {
  'use strict';

  const doc = document;
  const root = doc.documentElement;
  const STORE_KEY = 'rewind99-theme';
  const $ = (sel, ctx = doc) => ctx.querySelector(sel);
  const $$ = (sel, ctx = doc) => Array.from(ctx.querySelectorAll(sel));
  const byId = (id) => (id ? doc.getElementById(id) : null);
  const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let uid = 0;
  const ensureId = (el, prefix) => { if (!el.id) el.id = `${prefix}-${++uid}`; return el.id; };
  const won = (n) => '₩' + Math.round(n).toLocaleString('ko-KR');

  const store = {
    get() { try { return localStorage.getItem(STORE_KEY); } catch (e) { return null; } },
    set(v) { try { localStorage.setItem(STORE_KEY, v); } catch (e) { /* 저장 불가 환경 */ } },
  };

  /* ------------------------------------------------------------------------
     1. 테마 — 우선순위: ?theme= → localStorage → prefers-color-scheme
        라이트 = "오후 재방송", 다크 = "새벽 생방송"
     ------------------------------------------------------------------------ */
  const scheme = window.matchMedia('(prefers-color-scheme: dark)');
  const queryTheme = () => {
    const t = new URLSearchParams(window.location.search).get('theme');
    return t === 'dark' || t === 'light' ? t : null;
  };
  const storedTheme = () => { const t = store.get(); return t === 'dark' || t === 'light' ? t : null; };
  const resolveTheme = () => queryTheme() || storedTheme() || (scheme.matches ? 'dark' : 'light');

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    $$('[data-theme-toggle]').forEach((btn) => {
      btn.setAttribute('aria-pressed', String(theme === 'dark'));
      if (!btn.hasAttribute('aria-label') && !btn.textContent.trim()) btn.setAttribute('aria-label', '새벽 생방송 화면');
      const label = $('[data-theme-label]', btn);
      if (label) label.textContent = theme === 'dark' ? '새벽 생방송' : '오후 재방송';
    });
    $$('[data-theme-choice]').forEach((r) => { r.checked = r.value === theme; });
  }
  applyTheme(resolveTheme());
  const onScheme = () => { if (!queryTheme() && !storedTheme()) applyTheme(resolveTheme()); };
  if (scheme.addEventListener) scheme.addEventListener('change', onScheme);

  doc.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-theme-toggle]');
    if (!btn) return;
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    store.set(next);
    applyTheme(next);
  });
  doc.addEventListener('change', (e) => {
    const r = e.target.closest('[data-theme-choice]');
    if (!r || !r.checked) return;
    store.set(r.value);
    applyTheme(r.value);
  });

  /* ------------------------------------------------------------------------
     2. 레이어 스택 — Esc 닫기 · 포커스 트랩 · 스크롤 잠금 · 바깥 클릭
     ------------------------------------------------------------------------ */
  const FOCUSABLE = [
    'a[href]', 'button:not([disabled])', 'input:not([disabled]):not([type="hidden"])',
    'select:not([disabled])', 'textarea:not([disabled])', '[tabindex]:not([tabindex="-1"])',
  ].join(',');
  const focusables = (el) => $$(FOCUSABLE, el).filter((n) => !n.closest('[hidden],[inert]') && n.getClientRects().length > 0);
  const layers = [];
  const syncLock = () => {
    root.classList.toggle('is-locked', layers.some((l) => l.lock) || !!doc.querySelector('.win--zoomed'));
    root.classList.toggle('has-dialog', layers.some((l) => l.trap));
  };
  function pushLayer(l) { const i = layers.indexOf(l); if (i > -1) layers.splice(i, 1); layers.push(l); syncLock(); }
  function dropLayer(l) { const i = layers.indexOf(l); if (i > -1) layers.splice(i, 1); syncLock(); }
  function trapTab(e, box) {
    const list = focusables(box);
    if (!list.length) { e.preventDefault(); box.focus(); return; }
    const first = list[0];
    const last = list[list.length - 1];
    const a = doc.activeElement;
    if (e.shiftKey && (a === first || !box.contains(a))) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && (a === last || !box.contains(a))) { e.preventDefault(); first.focus(); }
  }
  doc.addEventListener('keydown', (e) => {
    const top = layers[layers.length - 1];
    if (!top) return;
    if (e.key === 'Escape') { e.preventDefault(); top.close(true); }
    else if (e.key === 'Tab' && top.trap) trapTab(e, top.box);
  });
  doc.addEventListener('pointerdown', (e) => {
    for (let i = layers.length - 1; i >= 0; i -= 1) {
      const l = layers[i];
      if (l.trap) break;
      if (l.box.contains(e.target) || (l.trigger && l.trigger.contains(e.target))) break;
      l.close(false);
    }
  });

  /* ---- 모달 · 드로어 ---------------------------------------------------- */
  function dialogApi(el) {
    if (el.rwDialog) return el.rwDialog;
    const isDrawer = el.classList.contains('drawer');
    const box = $(isDrawer ? '.drawer__panel' : '.modal__box', el) || el;
    if (!box.hasAttribute('tabindex')) box.setAttribute('tabindex', '-1');
    let timer = null;
    const api = {
      el, box, lock: true, trap: true, trigger: null, isOpen: false,
      open(trigger) {
        if (api.isOpen) return;
        clearTimeout(timer);
        api.trigger = trigger || doc.activeElement;
        el.classList.remove('is-closing');
        el.hidden = false;
        void el.offsetWidth;
        el.classList.add('is-open');
        api.isOpen = true;
        if (api.trigger && api.trigger.hasAttribute && api.trigger.hasAttribute('aria-expanded')) api.trigger.setAttribute('aria-expanded', 'true');
        pushLayer(api);
        const t = $('[data-autofocus]', el) || focusables(box)[0] || box;
        t.focus({ preventScroll: true });
      },
      close(restore = true) {
        if (!api.isOpen) return;
        api.isOpen = false;
        el.classList.remove('is-open');
        dropLayer(api);
        const finish = () => { if (!api.isOpen) { el.hidden = true; el.classList.remove('is-closing'); } };
        if (reducedMotion()) finish();
        else { el.classList.add('is-closing'); timer = setTimeout(finish, isDrawer ? 170 : 130); }
        if (api.trigger && api.trigger.hasAttribute && api.trigger.hasAttribute('aria-expanded')) api.trigger.setAttribute('aria-expanded', 'false');
        if (restore && api.trigger && doc.contains(api.trigger)) api.trigger.focus({ preventScroll: true });
      },
    };
    el.rwDialog = api;
    return api;
  }

  /* ---- 실행 대화상자 (⌘K / Ctrl+K) ------------------------------------- */
  function commandApi(el) {
    if (el.rwDialog) return el.rwDialog;
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
    items().forEach((it) => { it.setAttribute('role', 'option'); it.setAttribute('tabindex', '-1'); ensureId(it, 'cmd-opt'); });
    const visible = () => items().filter((it) => !it.hidden);
    let active = null;
    function setActive(it) {
      items().forEach((x) => x.setAttribute('aria-selected', 'false'));
      active = it || null;
      if (active) {
        active.setAttribute('aria-selected', 'true');
        input.setAttribute('aria-activedescendant', active.id);
        const lt = list.getBoundingClientRect(), at = active.getBoundingClientRect();
        if (at.top < lt.top) list.scrollTop -= lt.top - at.top;
        else if (at.bottom > lt.bottom) list.scrollTop += at.bottom - lt.bottom;
      } else input.removeAttribute('aria-activedescendant');
    }
    function filter(q) {
      const term = q.trim().toLowerCase();
      items().forEach((it) => {
        const hay = `${it.getAttribute('data-keywords') || ''} ${it.textContent}`.toLowerCase();
        it.hidden = term !== '' && !hay.includes(term);
      });
      $$('.cmd__group', list).forEach((g) => {
        let n = g.nextElementSibling;
        let any = false;
        while (n && !n.classList.contains('cmd__group')) { if (!n.hidden) any = true; n = n.nextElementSibling; }
        g.hidden = !any;
      });
      const v = visible();
      if (empty) {
        empty.hidden = v.length > 0;
        const q2 = $('[data-cmd-query]', empty);
        if (q2) q2.textContent = q.trim();
      }
      setActive(v[0]);
    }
    function run(it) {
      if (!it || it.getAttribute('aria-disabled') === 'true') return;
      const href = it.getAttribute('data-href');
      const action = it.getAttribute('data-action');
      api.close(!href);
      if (href) window.location.href = href;
      else if (action === 'theme') { const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'; store.set(next); applyTheme(next); }
      else if (action === 'toast') Rewind.toast({ title: it.getAttribute('data-toast-title') || '실행했습니다', text: it.getAttribute('data-toast-text') || '' });
    }
    input.addEventListener('input', () => filter(input.value));
    input.addEventListener('keydown', (e) => {
      const v = visible();
      const i = v.indexOf(active);
      if (e.key === 'ArrowDown') { e.preventDefault(); if (v.length) setActive(v[(i + 1) % v.length]); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); if (v.length) setActive(v[(i - 1 + v.length) % v.length]); }
      else if (e.key === 'Enter') { e.preventDefault(); run(active); }
    });
    list.addEventListener('mousemove', (e) => { const it = e.target.closest('.cmd__item'); if (it && it !== active && !it.hidden) setActive(it); });
    list.addEventListener('click', (e) => run(e.target.closest('.cmd__item')));
    const ok = $('[data-cmd-ok]', el);
    if (ok) ok.addEventListener('click', () => run(active));
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
    el.rwDialog = api;
    return api;
  }
  doc.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
      const el = $('[data-command]:not(.cmd--static)');
      if (!el) return;
      e.preventDefault();
      const api = commandApi(el);
      if (api.isOpen) api.close(true); else api.open();
    }
  });

  doc.addEventListener('click', (e) => {
    const opener = e.target.closest('[data-modal-open],[data-drawer-open]');
    if (opener) {
      const t = byId(opener.getAttribute('data-modal-open') || opener.getAttribute('data-drawer-open'));
      if (t) { e.preventDefault(); dialogApi(t).open(opener); }
      return;
    }
    const cmdBtn = e.target.closest('[data-command-open]');
    if (cmdBtn) {
      const el = byId(cmdBtn.getAttribute('data-command-open')) || $('[data-command]:not(.cmd--static)');
      if (el) { e.preventDefault(); commandApi(el).open(cmdBtn); }
      return;
    }
    const closer = e.target.closest('[data-close]');
    if (closer) {
      const host = closer.closest('.modal, .drawer, .cmd, .balloon, .menu');
      if (!host || host.matches('.modal--static, .drawer--static, .cmd--static, .balloon--static, .menu--static')) return;
      e.preventDefault();
      if (host.rwDialog) host.rwDialog.close(true);
      else if (host.rwLayer) host.rwLayer.close(true);
    }
  });

  /* ---- 풍선(popover) · 메뉴 — 트랩 없음 -------------------------------- */
  const menuItems = (menu) => $$('.menu__item', menu).filter((n) => n.getAttribute('aria-disabled') !== 'true' && !n.disabled && n.getClientRects().length);
  function floatingApi(panel, trigger, type) {
    if (panel.rwLayer) { panel.rwLayer.trigger = trigger; return panel.rwLayer; }
    const api = {
      el: panel, box: panel, lock: false, trap: false, trigger, isOpen: false,
      open(focusFirst = true) {
        if (api.isOpen) return;
        layers.filter((l) => !l.trap && l !== api).forEach((l) => l.close(false));
        panel.hidden = false;
        panel.classList.remove('balloon--flip', 'menu--end');
        // 메뉴 막대처럼 overflow가 있는 줄 안의 메뉴는 잘리지 않게 화면 고정 좌표로 띄운다
        if (type === 'menu' && api.trigger.closest('.menubar, .scroll-x, .tabs__list, .toolbar')) {
          const tr = api.trigger.getBoundingClientRect();
          panel.style.position = 'fixed';
          panel.style.top = `${Math.round(tr.bottom)}px`;
          panel.style.left = `${Math.round(Math.max(8, Math.min(tr.left, window.innerWidth - panel.offsetWidth - 8)))}px`;
          panel.classList.add('is-fixed');
        }
        api.isOpen = true;
        api.trigger.setAttribute('aria-expanded', 'true');
        const r = panel.getBoundingClientRect();
        if (r.right > window.innerWidth - 8 && !panel.classList.contains('startmenu')) panel.classList.add(type === 'menu' ? 'menu--end' : 'balloon--flip');
        pushLayer(api);
        if (type === 'menu') { const its = menuItems(panel); if (focusFirst && its[0]) its[0].focus(); }
        else if (focusFirst) {
          const f = $('[data-autofocus]', panel) || focusables(panel)[0];
          if (f) f.focus(); else { panel.setAttribute('tabindex', '-1'); panel.focus(); }
        }
      },
      close(restore = true) {
        if (!api.isOpen) return;
        api.isOpen = false;
        panel.hidden = true;
        if (panel.classList.contains('is-fixed')) { panel.classList.remove('is-fixed'); panel.style.position = ''; panel.style.top = ''; panel.style.left = ''; }
        api.trigger.setAttribute('aria-expanded', 'false');
        dropLayer(api);
        if (restore) api.trigger.focus({ preventScroll: true });
      },
    };
    panel.rwLayer = api;
    return api;
  }
  doc.addEventListener('click', (e) => {
    const pt = e.target.closest('[data-popover-trigger]');
    if (pt) {
      const panel = byId(pt.getAttribute('aria-controls'));
      if (!panel) return;
      e.preventDefault();
      const api = floatingApi(panel, pt, 'popover');
      if (api.isOpen) api.close(true); else api.open(true);
      return;
    }
    const mt = e.target.closest('[data-menu-trigger]');
    if (mt) {
      const panel = byId(mt.getAttribute('aria-controls'));
      if (!panel) return;
      e.preventDefault();
      const api = floatingApi(panel, mt, 'menu');
      if (api.isOpen) api.close(true); else api.open(e.detail === 0);
      return;
    }
    const mi = e.target.closest('.menu .menu__item');
    if (mi && mi.getAttribute('aria-disabled') !== 'true') {
      const role = mi.getAttribute('role');
      if (role === 'menuitemcheckbox') mi.setAttribute('aria-checked', String(mi.getAttribute('aria-checked') !== 'true'));
      if (role === 'menuitemradio') $$('[role="menuitemradio"]', mi.closest('.menu')).forEach((r) => r.setAttribute('aria-checked', String(r === mi)));
      if (mi.hasAttribute('data-toast-title')) Rewind.toast({ title: mi.getAttribute('data-toast-title'), text: mi.getAttribute('data-toast-text') || '' });
      const menu = mi.closest('.menu');
      if (!mi.hasAttribute('data-keep-open') && menu.rwLayer) menu.rwLayer.close(!mi.matches('a[href]'));
    }
  });
  const closeFixed = () => layers.filter((l) => !l.trap && l.el.classList.contains('is-fixed')).forEach((l) => l.close(false));
  window.addEventListener('resize', closeFixed);
  window.addEventListener('scroll', closeFixed, { passive: true });
  // 메뉴 막대 안에서 ←/→ 로 옆 메뉴로 이동
  function siblingTrigger(trigger, dir) {
    const bar = trigger.closest('.menubar');
    if (!bar) return null;
    const ts = $$('[data-menu-trigger]', bar);
    return ts[(ts.indexOf(trigger) + dir + ts.length) % ts.length];
  }
  doc.addEventListener('keydown', (e) => {
    const mt = e.target.closest && e.target.closest('[data-menu-trigger]');
    if (mt && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      const panel = byId(mt.getAttribute('aria-controls'));
      if (!panel) return;
      e.preventDefault();
      floatingApi(panel, mt, 'menu').open(true);
      const its = menuItems(panel);
      if (e.key === 'ArrowUp' && its.length) its[its.length - 1].focus();
      return;
    }
    if (mt && (e.key === 'ArrowRight' || e.key === 'ArrowLeft') && mt.closest('.menubar')) {
      e.preventDefault();
      const n = siblingTrigger(mt, e.key === 'ArrowRight' ? 1 : -1);
      if (n) n.focus();
      return;
    }
    const menu = e.target.closest && e.target.closest('.menu');
    if (!menu || menu.classList.contains('menu--static')) return;
    const its = menuItems(menu);
    const i = its.indexOf(doc.activeElement);
    if (e.key === 'ArrowDown') { e.preventDefault(); its[(i + 1) % its.length].focus(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); its[(i - 1 + its.length) % its.length].focus(); }
    else if (e.key === 'Home') { e.preventDefault(); its[0].focus(); }
    else if (e.key === 'End') { e.preventDefault(); its[its.length - 1].focus(); }
    else if ((e.key === 'ArrowRight' || e.key === 'ArrowLeft') && menu.rwLayer && menu.rwLayer.trigger.closest('.menubar')) {
      e.preventDefault();
      const n = siblingTrigger(menu.rwLayer.trigger, e.key === 'ArrowRight' ? 1 : -1);
      menu.rwLayer.close(false);
      if (n) { const p = byId(n.getAttribute('aria-controls')); if (p) floatingApi(p, n, 'menu').open(true); }
    } else if (e.key === 'Tab' && menu.rwLayer) menu.rwLayer.close(false);
  });

  /* ------------------------------------------------------------------------
     3. 창 관리 — [data-windows] 안에서 누른 창이 맨 앞(활성 타이틀),
        .win__ctrl--min = 말아 올리기, --max = 최대화 토글, --close = 닫기(되돌리기 토스트)
     ------------------------------------------------------------------------ */
  function focusWindow(win) {
    const host = win.closest('[data-windows]');
    if (!host) return;
    // 호스트 안의 최상위 창만(창 속 창 = 카드 등은 제외)
    const wins = $$('.win', host).filter((w) => { const p = w.parentElement.closest('.win'); return !p || !host.contains(p); });
    let target = win;
    while (!wins.includes(target)) { target = target.parentElement.closest('.win'); if (!target) return; }
    wins.forEach((w) => {
      const top = w === target;
      w.classList.toggle('is-front', top);
      if (!w.hasAttribute('data-always-active')) w.classList.toggle('win--inactive', !top);
    });
  }
  doc.addEventListener('pointerdown', (e) => {
    const win = e.target.closest('[data-windows] .win');
    if (win) focusWindow(win);
  });
  doc.addEventListener('focusin', (e) => {
    const win = e.target.closest && e.target.closest('[data-windows] .win');
    if (win && !win.classList.contains('is-front')) focusWindow(win);
  });
  doc.addEventListener('click', (e) => {
    const c = e.target.closest('.win__ctrl');
    if (!c || c.hasAttribute('data-close') || c.closest('.modal, .drawer, .cmd')) return;
    const win = c.closest('.win');
    if (!win) return;
    if (c.classList.contains('win__ctrl--min')) {
      const on = win.classList.toggle('win--shade');
      c.setAttribute('aria-pressed', String(on));
    } else if (c.classList.contains('win__ctrl--max')) {
      const on = win.classList.toggle('win--zoomed');
      c.setAttribute('aria-pressed', String(on));
      c.setAttribute('aria-label', on ? '이전 크기로' : '최대화');
      syncLock();
    } else if (c.classList.contains('win__ctrl--close')) {
      const title = ($('.win__title', win) || {}).textContent || '창';
      win.hidden = true;
      Rewind.toast({
        title: '창을 닫았습니다', text: title.trim(), tone: 'info',
        action: { label: '되돌리기', run: () => { win.hidden = false; const f = $('.win__ctrl--close', win); if (f) f.focus(); } },
      });
    }
  });
  doc.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    const z = $('.win--zoomed');
    if (z && !layers.length) { const b = $('.win__ctrl--max', z); if (b) b.click(); }
  });

  /* ------------------------------------------------------------------------
     4. 탭 — 자동 활성, ←/→/Home/End
     ------------------------------------------------------------------------ */
  function initTabs(box) {
    const tabs = $$('[role="tab"]', box).filter((t) => t.closest('[data-tabs]') === box);
    if (!tabs.length) return;
    const strip = tabs[0].closest('[role="tablist"]');
    /* 사용자 조작일 때만, 그리고 탭 목록 안에서만 가로로 맞춘다.
       scrollIntoView는 문서 전체를 세로로 끌어내리므로 쓰지 않는다. */
    function reveal(tab) {
      if (!strip || strip.scrollWidth <= strip.clientWidth) return;
      const s = strip.getBoundingClientRect();
      const r = tab.getBoundingClientRect();
      const pad = 24;
      if (r.left < s.left + pad) strip.scrollLeft -= s.left + pad - r.left;
      else if (r.right > s.right - pad) strip.scrollLeft += r.right - (s.right - pad);
    }
    function select(tab, focus, scroll) {
      tabs.forEach((t) => {
        const on = t === tab;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        const p = byId(t.getAttribute('aria-controls'));
        if (p) p.hidden = !on;
      });
      if (focus) tab.focus({ preventScroll: true });
      if (scroll) reveal(tab);
    }
    tabs.forEach((t) => {
      t.addEventListener('click', () => select(t, false, true));
      t.addEventListener('keydown', (e) => {
        const enabled = tabs.filter((x) => !x.disabled && x.getAttribute('aria-disabled') !== 'true');
        const i = enabled.indexOf(t);
        let n = null;
        if (e.key === 'ArrowRight') n = enabled[(i + 1) % enabled.length];
        else if (e.key === 'ArrowLeft') n = enabled[(i - 1 + enabled.length) % enabled.length];
        else if (e.key === 'Home') n = enabled[0];
        else if (e.key === 'End') n = enabled[enabled.length - 1];
        if (n) { e.preventDefault(); select(n, true, true); }
      });
    });
    select(tabs.find((t) => t.getAttribute('aria-selected') === 'true') || tabs[0], false, false);
  }
  $$('[data-tabs]').forEach(initTabs);

  /* ------------------------------------------------------------------------
     5. 아코디언 — [data-accordion="single"]이면 하나만 펼침
     ------------------------------------------------------------------------ */
  $$('[data-accordion]').forEach((acc) => {
    const single = acc.getAttribute('data-accordion') === 'single';
    const btns = $$('.acc__btn', acc);
    btns.forEach((b) => {
      const p = byId(b.getAttribute('aria-controls'));
      if (p) p.hidden = b.getAttribute('aria-expanded') !== 'true';
      b.addEventListener('click', () => {
        const open = b.getAttribute('aria-expanded') !== 'true';
        if (single && open) btns.forEach((o) => { if (o !== b) { o.setAttribute('aria-expanded', 'false'); const op = byId(o.getAttribute('aria-controls')); if (op) op.hidden = true; } });
        b.setAttribute('aria-expanded', String(open));
        if (p) p.hidden = !open;
      });
    });
  });

  /* ------------------------------------------------------------------------
     6. 토스트 — 시스템 트레이 풍선. Rewind.toast({ title, text, tone, duration, action })
        tone: info | success | warn | error | broadcast(주문 폭주 등 방송 알림)
     ------------------------------------------------------------------------ */
  const TONE_ICON = { info: 'info', success: 'check', warn: 'warn', error: 'error', broadcast: 'tv' };
  function toastHost() {
    let host = $('.toasts:not(.toasts--static)');
    if (!host) {
      host = doc.createElement('div');
      host.className = 'toasts';
      host.setAttribute('aria-live', 'polite');
      host.setAttribute('aria-atomic', 'false');
      doc.body.appendChild(host);
    }
    return host;
  }
  function toast(opts = {}) {
    const { title = '', text = '', tone = 'info', duration = 4000, action = null } = opts;
    const host = toastHost();
    const el = doc.createElement('div');
    el.className = `toast toast--${tone}`;
    el.setAttribute('role', tone === 'error' ? 'alert' : 'status');
    const icon = doc.createElement('span');
    if (tone === 'broadcast') {
      icon.className = 'toast__icon toast__icon--broadcast';
      icon.innerHTML = '<span class="ico ico--tv" aria-hidden="true"></span>';
    } else icon.className = `toast__icon ico ico--32 ico--${TONE_ICON[tone] || 'info'}`;
    icon.setAttribute('aria-hidden', 'true');
    const body = doc.createElement('div');
    const t = doc.createElement('p'); t.className = 'toast__title'; t.textContent = title;
    body.appendChild(t);
    if (text) { const p = doc.createElement('p'); p.className = 'toast__text'; p.textContent = text; body.appendChild(p); }
    if (action) {
      const a = doc.createElement('button');
      a.type = 'button'; a.className = 'btn btn--sm'; a.textContent = action.label;
      a.style.marginTop = '6px';
      a.addEventListener('click', () => { action.run(); dismiss(); });
      body.appendChild(a);
    }
    const close = doc.createElement('button');
    close.type = 'button'; close.className = 'toast__close'; close.setAttribute('aria-label', '알림 닫기');
    el.append(icon, body, close);
    host.prepend(el);
    let timer = null;
    function dismiss() {
      clearTimeout(timer);
      if (reducedMotion()) { el.remove(); return; }
      el.classList.add('is-leaving');
      setTimeout(() => el.remove(), 130);
    }
    const arm = () => { if (duration > 0) timer = setTimeout(dismiss, duration + (action ? 3000 : 0)); };
    close.addEventListener('click', dismiss);
    el.addEventListener('mouseenter', () => clearTimeout(timer));
    el.addEventListener('mouseleave', arm);
    el.addEventListener('focusin', () => clearTimeout(timer));
    arm();
    return { el, dismiss };
  }
  doc.addEventListener('click', (e) => {
    const b = e.target.closest('[data-toast-demo]');
    if (!b) return;
    toast({ title: b.getAttribute('data-toast-title') || '알림', text: b.getAttribute('data-toast-text') || '', tone: b.getAttribute('data-toast-tone') || 'info' });
  });
  $$('.toasts--static .toast__close').forEach((c) => c.addEventListener('click', () => { const t = c.closest('.toast'); if (t) t.hidden = true; }));

  /* ------------------------------------------------------------------------
     7. 채널 넘기기(캐러셀) — CH ▲▼, ←/→, 스와이프, 채널 노이즈 220ms
     ------------------------------------------------------------------------ */
  $$('[data-carousel]').forEach((car) => {
    const slides = $$('.channel__slide', car);
    if (!slides.length) return;
    const pad = (n) => String(n).padStart(2, '0');
    const live = doc.createElement('p');
    live.className = 'sr-only'; live.setAttribute('aria-live', 'polite');
    car.appendChild(live);
    let idx = Math.max(0, slides.findIndex((s) => !s.hidden));
    /* 리모컨 점 + (있으면) 화면 밖 필름 띠 [data-carousel-dots="<id>"] 의 컷 버튼 */
    const dots = $$('.channel__dot', car).concat(car.id ? $$(`[data-carousel-dots="${car.id}"] .channel__dot`) : []);
    function show(n, announce) {
      idx = (n + slides.length) % slides.length;
      slides.forEach((s, i) => {
        s.hidden = i !== idx;
        s.setAttribute('aria-label', `${i + 1} / ${slides.length}`);
      });
      $$('[data-carousel-current]', car).forEach((c) => { c.textContent = pad(idx + 1); });
      $$('[data-carousel-osd]', car).forEach((c) => { c.textContent = slides[idx].getAttribute('data-channel') || pad(idx + 1); });
      dots.forEach((d, i) => d.setAttribute('aria-current', String(i === idx)));
      if (announce) {
        live.textContent = `${idx + 1}번째 채널: ${slides[idx].getAttribute('data-title') || ''}`;
        if (!reducedMotion()) {
          car.classList.remove('is-tuning'); slides[idx].classList.remove('is-tuning');
          void car.offsetWidth;
          car.classList.add('is-tuning'); slides[idx].classList.add('is-tuning');
          setTimeout(() => { car.classList.remove('is-tuning'); slides[idx].classList.remove('is-tuning'); }, 240);
        }
      }
    }
    show(idx, false);
    $$('[data-carousel-prev]', car).forEach((b) => b.addEventListener('click', () => show(idx - 1, true)));
    $$('[data-carousel-next]', car).forEach((b) => b.addEventListener('click', () => show(idx + 1, true)));
    dots.forEach((d, i) => d.addEventListener('click', () => show(i, true)));
    car.addEventListener('keydown', (e) => {
      if (e.target.closest('input, textarea, select')) return;
      if (e.key === 'ArrowRight' || e.key === 'PageUp') { e.preventDefault(); show(idx + 1, true); }
      else if (e.key === 'ArrowLeft' || e.key === 'PageDown') { e.preventDefault(); show(idx - 1, true); }
    });
    const screen = $('.channel__screen', car) || car;
    let sx = null;
    screen.addEventListener('pointerdown', (e) => { sx = e.clientX; });
    screen.addEventListener('pointerup', (e) => {
      if (sx === null) return;
      const dx = e.clientX - sx; sx = null;
      if (Math.abs(dx) > 40) show(idx + (dx < 0 ? 1 : -1), true);
    });
    screen.addEventListener('pointercancel', () => { sx = null; });
  });

  /* ------------------------------------------------------------------------
     8. 스프레드시트 — 열 머리 정렬, 셀 선택 → 수식 입력줄(B4 · 값)
     ------------------------------------------------------------------------ */
  const colLetter = (n) => String.fromCharCode(65 + n);
  const cellValue = (td) => td.getAttribute('data-sort') ?? td.textContent.trim();
  const asNumber = (v) => { const n = parseFloat(String(v).replace(/[₩,%건개명\s]/g, '')); return Number.isNaN(n) ? null : n; };
  $$('[data-sortable]').forEach((table) => {
    const tbody = table.tBodies[0];
    if (!tbody) return;
    const heads = $$('thead th', table);
    const renumber = () => $$('tr', tbody).forEach((tr, i) => { const h = $('.sheet__rowhead', tr); if (h) h.textContent = String(i + 1); });
    heads.forEach((th, ci) => {
      const btn = $('.sheet__sort', th);
      if (!btn) return;
      btn.addEventListener('click', () => {
        const dir = th.getAttribute('aria-sort') === 'ascending' ? 'descending' : 'ascending';
        heads.forEach((h) => { if (h.hasAttribute('aria-sort')) h.setAttribute('aria-sort', 'none'); });
        th.setAttribute('aria-sort', dir);
        const rows = $$('tr', tbody);
        rows.sort((a, b) => {
          const va = cellValue(a.children[ci]); const vb = cellValue(b.children[ci]);
          const na = asNumber(va); const nb = asNumber(vb);
          const r = na !== null && nb !== null ? na - nb : String(va).localeCompare(String(vb), 'ko');
          return dir === 'ascending' ? r : -r;
        });
        rows.forEach((r) => tbody.appendChild(r));
        renumber();
      });
    });
  });
  $$('.sheet').forEach((sheet) => {
    const table = $('table', sheet);
    const ref = $('.sheet__ref', sheet);
    const val = $('.sheet__value', sheet);
    if (!table || !ref) return;
    $$('tbody td', table).forEach((td) => { if (!td.hasAttribute('tabindex')) td.tabIndex = -1; });
    const first = $('tbody td', table);
    if (first) first.tabIndex = 0;
    function pick(td, focus) {
      $$('td.is-cell', table).forEach((c) => { c.classList.remove('is-cell'); c.tabIndex = -1; });
      td.classList.add('is-cell');
      td.tabIndex = 0;
      const tr = td.parentElement;
      const cells = $$('td', tr);
      const rowNo = Array.from(tr.parentElement.children).indexOf(tr) + 1;
      ref.textContent = `${colLetter(cells.indexOf(td))}${rowNo}`;
      if (val) val.textContent = td.textContent.trim();
      if (focus) td.focus();
    }
    table.addEventListener('click', (e) => { const td = e.target.closest('tbody td'); if (td && !e.target.closest('input, button, a')) pick(td, false); });
    table.addEventListener('keydown', (e) => {
      const td = e.target.closest('tbody td');
      if (!td) return;
      const tr = td.parentElement;
      const cells = $$('td', tr);
      const ci = cells.indexOf(td);
      let n = null;
      if (e.key === 'ArrowRight') n = cells[ci + 1];
      else if (e.key === 'ArrowLeft') n = cells[ci - 1];
      else if (e.key === 'ArrowDown' && tr.nextElementSibling) n = $$('td', tr.nextElementSibling)[ci];
      else if (e.key === 'ArrowUp' && tr.previousElementSibling) n = $$('td', tr.previousElementSibling)[ci];
      if (n) { e.preventDefault(); pick(n, true); }
    });
  });

  /* ------------------------------------------------------------------------
     9. 달력 — 날짜 선택(aria-pressed), ←/→ ±1일, ↑/↓ ±7일
     ------------------------------------------------------------------------ */
  $$('[data-calendar]').forEach((cal) => {
    const days = $$('.cal__day:not(:disabled)', cal);
    const out = $('[data-calendar-output]', cal) || byId(cal.getAttribute('data-calendar-output'));
    let cur = days.find((d) => d.getAttribute('aria-pressed') === 'true') || days[0];
    days.forEach((d) => { d.tabIndex = d === cur ? 0 : -1; if (!d.hasAttribute('aria-pressed')) d.setAttribute('aria-pressed', 'false'); });
    function pick(d, focus) {
      days.forEach((x) => { x.setAttribute('aria-pressed', String(x === d)); x.tabIndex = x === d ? 0 : -1; });
      cur = d;
      if (out) out.textContent = d.getAttribute('data-label') || d.getAttribute('aria-label') || d.textContent.trim();
      if (focus) d.focus();
    }
    days.forEach((d) => d.addEventListener('click', () => pick(d, false)));
    cal.addEventListener('keydown', (e) => {
      const d = e.target.closest('.cal__day');
      if (!d) return;
      const i = days.indexOf(d);
      const step = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: 7, ArrowUp: -7 }[e.key];
      if (step === undefined) return;
      const n = days[i + step];
      e.preventDefault();
      if (n) { n.tabIndex = 0; d.tabIndex = -1; n.focus(); }
    });
  });

  /* ------------------------------------------------------------------------
     10. 칸반 — 마우스 끌기 + 키보드(Space 집기 → ←/→ 열 이동, ↑/↓ 순서 → Space 놓기)
     ------------------------------------------------------------------------ */
  $$('[data-kanban]').forEach((board) => {
    const lists = () => $$('.kanban__list', board);
    const live = doc.createElement('p');
    live.className = 'sr-only'; live.setAttribute('aria-live', 'assertive');
    board.appendChild(live);
    const colName = (list) => { const w = list.closest('.kanban__col'); const t = w && $('.win__title', w); return t ? t.textContent.trim() : ''; };
    const recount = () => lists().forEach((l) => { const c = $('.kanban__count', l.closest('.kanban__col')); if (c) c.textContent = String($$('.kanban__card', l).length); });
    let dragging = null;
    board.addEventListener('dragstart', (e) => {
      const card = e.target.closest('.kanban__card');
      if (!card || card.classList.contains('kanban__card--locked')) { e.preventDefault(); return; }
      dragging = card;
      card.classList.add('is-dragging');
      e.dataTransfer.effectAllowed = 'move';
      try { e.dataTransfer.setData('text/plain', card.id || 'card'); } catch (err) { /* noop */ }
    });
    board.addEventListener('dragend', () => {
      if (dragging) dragging.classList.remove('is-dragging');
      lists().forEach((l) => l.classList.remove('is-over'));
      dragging = null;
      recount();
    });
    board.addEventListener('dragover', (e) => {
      const list = e.target.closest('.kanban__list');
      if (!list || !dragging) return;
      e.preventDefault();
      lists().forEach((l) => l.classList.toggle('is-over', l === list));
      const after = $$('.kanban__card:not(.is-dragging)', list).find((c) => { const r = c.getBoundingClientRect(); return e.clientY < r.top + r.height / 2; });
      if (after) list.insertBefore(dragging, after); else list.appendChild(dragging);
    });
    board.addEventListener('drop', (e) => {
      e.preventDefault();
      if (dragging) live.textContent = `${$('.kanban__name', dragging).textContent} → ${colName(dragging.parentElement)}`;
    });
    board.addEventListener('keydown', (e) => {
      const card = e.target.closest('.kanban__card');
      if (!card) return;
      const grabbed = card.getAttribute('aria-grabbed') === 'true';
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        if (card.classList.contains('kanban__card--locked')) return;
        card.setAttribute('aria-grabbed', String(!grabbed));
        live.textContent = grabbed ? `${colName(card.parentElement)}에 놓았습니다` : '집었습니다. 화살표로 옮기고 스페이스로 놓으세요';
        recount();
        return;
      }
      if (e.key === 'Escape' && grabbed) { card.setAttribute('aria-grabbed', 'false'); return; }
      const ls = lists();
      const list = card.parentElement;
      if (grabbed) {
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
          e.preventDefault();
          const n = ls[ls.indexOf(list) + (e.key === 'ArrowRight' ? 1 : -1)];
          if (n) { n.appendChild(card); card.focus(); live.textContent = colName(n); }
        } else if (e.key === 'ArrowUp' && card.previousElementSibling) { e.preventDefault(); list.insertBefore(card, card.previousElementSibling); card.focus(); }
        else if (e.key === 'ArrowDown' && card.nextElementSibling) { e.preventDefault(); list.insertBefore(card.nextElementSibling, card); card.focus(); }
      } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        const sib = e.key === 'ArrowDown' ? card.nextElementSibling : card.previousElementSibling;
        if (sib && sib.classList.contains('kanban__card')) sib.focus();
      }
    });
    $$('.kanban__card', board).forEach((c) => { if (!c.hasAttribute('tabindex')) c.tabIndex = 0; if (!c.hasAttribute('aria-grabbed')) c.setAttribute('aria-grabbed', 'false'); });
    recount();
  });

  /* ------------------------------------------------------------------------
     11. 폼 검증 — form[data-validate]: required · pattern · minlength · 체크 필수
     ------------------------------------------------------------------------ */
  function validateControl(c) {
    let msg = '';
    const v = (c.value || '').trim();
    if (c.type === 'checkbox') { if (c.required && !c.checked) msg = c.getAttribute('data-msg-required') || '동의가 필요합니다.'; }
    else if (c.required && !v) msg = c.getAttribute('data-msg-required') || '필수 입력 항목입니다.';
    else if (v && c.getAttribute('pattern') && !new RegExp(`^(?:${c.getAttribute('pattern')})$`).test(v)) msg = c.getAttribute('data-msg-pattern') || '형식이 맞지 않습니다.';
    else if (v && c.minLength > 0 && v.length < c.minLength) msg = `${c.minLength}자 이상 입력해 주세요.`;
    const field = c.closest('.field');
    const err = field && $('.field__error', field);
    c.setAttribute('aria-invalid', String(!!msg));
    if (!msg) c.removeAttribute('aria-invalid');
    if (field) field.classList.toggle('is-invalid', !!msg);
    if (err) { err.textContent = msg; if (err.id) { const ids = (c.getAttribute('aria-describedby') || '').split(' ').filter(Boolean); if (!ids.includes(err.id)) c.setAttribute('aria-describedby', [...ids, err.id].join(' ')); } }
    return !msg;
  }
  $$('form[data-validate]').forEach((form) => {
    form.setAttribute('novalidate', '');
    const controls = () => $$('input, select, textarea', form).filter((c) => !c.disabled && (c.required || c.getAttribute('pattern') || c.minLength > 0));
    controls().forEach((c) => {
      c.addEventListener('blur', () => { if (c.value || c.getAttribute('aria-invalid')) validateControl(c); });
      c.addEventListener('change', () => { if (c.getAttribute('aria-invalid')) validateControl(c); });
    });
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const bad = controls().filter((c) => !validateControl(c));
      const summary = $('[data-form-summary]', form);
      if (bad.length) {
        if (summary) { summary.hidden = false; const n = $('[data-form-count]', summary); if (n) n.textContent = String(bad.length); }
        bad[0].focus();
        return;
      }
      if (summary) summary.hidden = true;
      const submit = $('[type="submit"]', form);
      if (submit) { submit.setAttribute('aria-busy', 'true'); setTimeout(() => submit.removeAttribute('aria-busy'), 900); }
      setTimeout(() => toast({ title: form.getAttribute('data-success-title') || '저장했습니다', text: form.getAttribute('data-success-text') || '', tone: 'success' }), reducedMotion() ? 0 : 900);
    });
  });

  /* ------------------------------------------------------------------------
     12. 자막 띠 — 묶음 복제(무한 흐름) + 일시정지, 탭 숨김 시 정지
     ------------------------------------------------------------------------ */
  $$('[data-marquee]').forEach((m) => {
    const track = $('.ticker__track', m);
    const group = $('.ticker__group', m);
    if (track && group && !$('.ticker__group[aria-hidden]', track)) {
      const clone = group.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      $$('a, button', clone).forEach((n) => n.setAttribute('tabindex', '-1'));
      track.appendChild(clone);
    }
    const btn = $('[data-marquee-toggle]', m);
    if (btn) {
      btn.addEventListener('click', () => {
        const paused = m.classList.toggle('is-paused');
        btn.setAttribute('aria-pressed', String(paused));
        btn.setAttribute('aria-label', paused ? '자막 다시 흐르게' : '자막 멈춤');
      });
    }
  });

  /* ------------------------------------------------------------------------
     13. 복사 — [data-copy] (가장 가까운 .code 안 pre)
     ------------------------------------------------------------------------ */
  doc.addEventListener('click', async (e) => {
    const b = e.target.closest('[data-copy]');
    if (!b) return;
    const src = byId(b.getAttribute('data-copy')) || $('pre', b.closest('.code') || doc);
    if (!src) return;
    const text = src.innerText;
    try { await navigator.clipboard.writeText(text); }
    catch (err) {
      const ta = doc.createElement('textarea'); ta.value = text; ta.setAttribute('readonly', '');
      ta.style.position = 'fixed'; ta.style.opacity = '0'; doc.body.appendChild(ta); ta.select();
      try { doc.execCommand('copy'); } catch (err2) { /* noop */ }
      ta.remove();
    }
    const old = b.getAttribute('data-label') || b.textContent;
    b.setAttribute('data-label', old);
    b.textContent = '복사됨';
    b.classList.add('is-done');
    setTimeout(() => { b.textContent = old; b.classList.remove('is-done'); }, 1600);
  });

  /* ------------------------------------------------------------------------
     14. 진행 막대 · 게이지 — aria-valuenow / aria-valuemax → --val
     ------------------------------------------------------------------------ */
  function syncProgress(el) {
    const now = parseFloat(el.getAttribute('aria-valuenow'));
    const max = parseFloat(el.getAttribute('aria-valuemax') || '100');
    const min = parseFloat(el.getAttribute('aria-valuemin') || '0');
    if (Number.isNaN(now)) return;
    const pct = Math.max(0, Math.min(100, ((now - min) / (max - min)) * 100));
    (el.closest('.gauge, .progress') || el).style.setProperty('--val', `${pct}%`);
  }
  $$('[role="progressbar"]').forEach(syncProgress);
  if ('MutationObserver' in window) {
    const mo = new MutationObserver((list) => list.forEach((m) => syncProgress(m.target)));
    $$('[role="progressbar"]').forEach((el) => mo.observe(el, { attributes: true, attributeFilter: ['aria-valuenow'] }));
  }

  /* ------------------------------------------------------------------------
     15. 숫자 롤링 — [data-count-to] (가격 깎기 ₩89,000 → ₩59,900 등)
         data-count-from · data-count-format="won|int" · 화면에 들어올 때 1회
     ------------------------------------------------------------------------ */
  const fmt = (el, n) => (el.getAttribute('data-count-format') === 'int' ? Math.round(n).toLocaleString('ko-KR') : won(n));
  function rollNumber(el) {
    const to = parseFloat(el.getAttribute('data-count-to'));
    const from = parseFloat(el.getAttribute('data-count-from') || '0');
    if (Number.isNaN(to)) return;
    if (reducedMotion()) { el.textContent = fmt(el, to); return; }
    const dur = 900;
    const t0 = performance.now();
    const ease = (t) => 1 - Math.pow(1 - t, 3);
    const tick = (now) => {
      const p = Math.min(1, (now - t0) / dur);
      el.textContent = fmt(el, from + (to - from) * ease(p));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    // rAF가 멈추는 환경(백그라운드 탭·헤드리스 캡처)에서도 최종값이 남도록
    setTimeout(() => { el.textContent = fmt(el, to); }, dur + 80);
  }
  const counters = $$('[data-count-to]').filter((el) => !el.hasAttribute('data-count-manual'));
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => entries.forEach((en) => { if (en.isIntersecting) { rollNumber(en.target); io.unobserve(en.target); } }), { threshold: .6 });
    counters.forEach((c) => io.observe(c));
  } else counters.forEach(rollNumber);

  /* ------------------------------------------------------------------------
     16. 실시간 수치 — [data-live] 4초마다 1틱(±data-live-step), 탭 숨김 시 정지,
         reduced-motion이면 고정. [data-timecode] 01:12:07부터 1초씩
     ------------------------------------------------------------------------ */
  const liveEls = $$('[data-live]');
  const tcEls = $$('[data-timecode]');
  let liveTimer = null;
  let tcTimer = null;
  function startLive() {
    if (reducedMotion()) return;
    if (liveEls.length && !liveTimer) {
      liveTimer = setInterval(() => {
        liveEls.forEach((el) => {
          const base = parseFloat(el.getAttribute('data-live'));
          const step = parseFloat(el.getAttribute('data-live-step') || '12');
          const cur = parseFloat(el.textContent.replace(/[^\d.-]/g, '')) || base;
          let next = cur + Math.round((Math.random() * 2 - 1) * step);
          next = Math.max(base - step * 4, Math.min(base + step * 4, next));
          el.textContent = next.toLocaleString('ko-KR');
        });
      }, 4000);
    }
    if (tcEls.length && !tcTimer) {
      tcTimer = setInterval(() => {
        tcEls.forEach((el) => {
          const [h, m, s] = (el.getAttribute('data-timecode-now') || el.getAttribute('data-timecode')).split(':').map(Number);
          const t = h * 3600 + m * 60 + s + 1;
          const v = [Math.floor(t / 3600) % 24, Math.floor(t / 60) % 60, t % 60].map((x) => String(x).padStart(2, '0')).join(':');
          el.setAttribute('data-timecode-now', v);
          el.textContent = (el.getAttribute('data-timecode-prefix') || '') + v;
        });
      }, 1000);
    }
  }
  function stopLive() { clearInterval(liveTimer); clearInterval(tcTimer); liveTimer = null; tcTimer = null; }
  startLive();
  doc.addEventListener('visibilitychange', () => {
    if (doc.hidden) stopLive(); else startLive();
  });

  /* 페이지 첫 로드 1회 채널 전환 노이즈 — .crt[data-tune-on-load] */
  if (!reducedMotion()) {
    $$('.crt[data-tune-on-load]').forEach((crt) => {
      crt.classList.add('is-tuning');
      setTimeout(() => crt.classList.remove('is-tuning'), 260);
    });
  }

  /* ------------------------------------------------------------------------
     17. 모션 시연 — [data-motion-play="대상 id"] (.is-playing 재시작, 숫자면 롤링)
     ------------------------------------------------------------------------ */
  doc.addEventListener('click', (e) => {
    const b = e.target.closest('[data-motion-play]');
    if (!b) return;
    const t = byId(b.getAttribute('data-motion-play'));
    if (!t) return;
    if (t.hasAttribute('data-count-to')) { rollNumber(t); return; }
    t.classList.remove('is-playing');
    void t.offsetWidth;
    t.classList.add('is-playing');
    const clear = () => t.classList.remove('is-playing');
    t.addEventListener('animationend', clear, { once: true });
  });
  doc.addEventListener('click', (e) => {
    const b = e.target.closest('[data-busy-demo]');
    if (!b) return;
    b.setAttribute('aria-busy', 'true');
    setTimeout(() => b.removeAttribute('aria-busy'), parseInt(b.getAttribute('data-busy-demo'), 10) || 1600);
  });
  doc.addEventListener('click', (e) => {
    const b = e.target.closest('[data-dismiss]');
    if (!b) return;
    const box = b.closest('.alert, .balloon--static, .toast');
    if (box) box.hidden = true;
  });

  /* ------------------------------------------------------------------------
     18. 폴더 트리 · 파일 목록(listbox) · 스핀 상자
     ------------------------------------------------------------------------ */
  doc.addEventListener('click', (e) => {
    const t = e.target.closest('.tree__toggle');
    if (!t) return;
    const open = t.getAttribute('aria-expanded') !== 'true';
    t.setAttribute('aria-expanded', String(open));
    const sub = byId(t.getAttribute('aria-controls'));
    if (sub) sub.hidden = !open;
  });
  $$('.filelist__body[role="listbox"]').forEach((lb) => {
    const rows = $$('[role="option"]', lb);
    let cur = rows.find((r) => r.getAttribute('aria-selected') === 'true') || rows[0];
    rows.forEach((r) => { r.tabIndex = r === cur ? 0 : -1; if (!r.hasAttribute('aria-selected')) r.setAttribute('aria-selected', 'false'); });
    function pick(r, focus) {
      rows.forEach((x) => { x.setAttribute('aria-selected', String(x === r)); x.tabIndex = x === r ? 0 : -1; });
      cur = r;
      if (focus) r.focus();
      lb.dispatchEvent(new CustomEvent('rw:select', { bubbles: true, detail: { row: r } }));
    }
    rows.forEach((r) => r.addEventListener('click', () => pick(r, false)));
    lb.addEventListener('keydown', (e) => {
      const i = rows.indexOf(doc.activeElement);
      if (i < 0) return;
      let n = null;
      if (e.key === 'ArrowDown') n = rows[Math.min(rows.length - 1, i + 1)];
      else if (e.key === 'ArrowUp') n = rows[Math.max(0, i - 1)];
      else if (e.key === 'Home') n = rows[0];
      else if (e.key === 'End') n = rows[rows.length - 1];
      else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(rows[i], true); const a = rows[i].getAttribute('data-href'); if (a) window.location.href = a; return; }
      if (n) { e.preventDefault(); pick(n, true); }
    });
  });
  doc.addEventListener('click', (e) => {
    const b = e.target.closest('.spin__btn');
    if (!b) return;
    const input = $('input', b.closest('.spin'));
    if (!input) return;
    const step = parseFloat(input.step) || 1;
    const min = input.min !== '' ? parseFloat(input.min) : -Infinity;
    const max = input.max !== '' ? parseFloat(input.max) : Infinity;
    const v = (parseFloat(input.value) || 0) + (b.classList.contains('spin__btn--down') ? -step : step);
    input.value = String(Math.max(min, Math.min(max, v)));
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
  });
  // 스핀 입력과 연동되는 금액 출력: [data-total-for="input id"][data-unit="59900"]
  $$('[data-total-for]').forEach((out) => {
    const input = byId(out.getAttribute('data-total-for'));
    const unit = parseFloat(out.getAttribute('data-unit'));
    if (!input || Number.isNaN(unit)) return;
    const sync = () => { out.textContent = won((parseFloat(input.value) || 0) * unit); };
    input.addEventListener('input', sync);
    sync();
  });

  /* ------------------------------------------------------------------------
     19. 툴팁 — Esc로 숨김 (WCAG 1.4.13), 트리거에 aria-describedby
     ------------------------------------------------------------------------ */
  $$('.tip').forEach((tip) => {
    const bubble = $('.tip__bubble', tip);
    const trig = tip.firstElementChild;
    if (bubble && trig && trig !== bubble) {
      ensureId(bubble, 'tip');
      bubble.setAttribute('role', 'tooltip');
      const ids = (trig.getAttribute('aria-describedby') || '').split(' ').filter(Boolean);
      if (!ids.includes(bubble.id)) trig.setAttribute('aria-describedby', [...ids, bubble.id].join(' '));
    }
    // 화면 가장자리에서 잘리지 않게 좌/우 정렬 자동 전환
    const place = () => {
      if (!bubble) return;
      tip.classList.remove('tip--start', 'tip--end');
      const r = bubble.getBoundingClientRect();
      if (r.left < 8) tip.classList.add('tip--start');
      else if (r.right > window.innerWidth - 8) tip.classList.add('tip--end');
    };
    tip.addEventListener('mouseenter', place);
    tip.addEventListener('focusin', place);
    if (tip.classList.contains('tip--show')) place();
    tip.addEventListener('mouseleave', () => tip.classList.remove('is-dismissed'));
    tip.addEventListener('focusout', () => tip.classList.remove('is-dismissed'));
  });
  doc.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    $$('.tip').forEach((t) => { if (t.matches(':hover, :focus-within')) t.classList.add('is-dismissed'); });
  });

  /* ------------------------------------------------------------------------
     19-1. 채팅 창 — 맨 위에서 반쯤 잘린 줄은 숨긴다(글자 조각이 남지 않게)
     ------------------------------------------------------------------------ */
  $$('.chat__scroll').forEach((box) => {
    const clip = () => {
      const top = box.getBoundingClientRect().top + 2;
      $$('.chat__msg', box).forEach((m) => {
        const r = m.getBoundingClientRect();
        m.classList.toggle('is-clipped', r.top < top - 1 && r.bottom > top);
      });
    };
    clip();
    box.addEventListener('scroll', clip, { passive: true });
    if ('ResizeObserver' in window) new ResizeObserver(clip).observe(box);
    if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(clip);
  });

  /* ------------------------------------------------------------------------
     20. 가로 스크롤 힌트 — 넘칠 때 .has-overflow, 끝에 닿으면 .is-end
     ------------------------------------------------------------------------ */
  const scrollers = $$('.scroll-x, .menubar, .tabs__list, .kanban, .steps');
  function syncScroll(el) {
    const over = el.scrollWidth > el.clientWidth + 2;
    el.classList.toggle('has-overflow', over);
    el.classList.toggle('is-end', !over || el.scrollLeft + el.clientWidth >= el.scrollWidth - 2);
  }
  scrollers.forEach((el) => { syncScroll(el); el.addEventListener('scroll', () => syncScroll(el), { passive: true }); });
  if ('ResizeObserver' in window) { const ro = new ResizeObserver((es) => es.forEach((en) => syncScroll(en.target))); scrollers.forEach((el) => ro.observe(el)); }

  /* ---- 공개 API -------------------------------------------------------- */
  const Rewind = {
    toast,
    theme: applyTheme,
    open(id) { const el = byId(id); if (!el) return; if (el.matches('[data-command]')) commandApi(el).open(); else dialogApi(el).open(); },
    close(id) { const el = byId(id); if (el && el.rwDialog) el.rwDialog.close(true); },
    roll: rollNumber,
  };
  window.Rewind = Rewind;
})();
