/* ==========================================================================
   도형상회 v2 — app.js (바닐라, 외부 라이브러리 없음)
   1 테마 · 2 오버레이 레이어(모달·드로어·커맨드·작업실 서랍) · 3 팝오버·메뉴·툴팁
   4 탭 · 5 아코디언 · 6 토스트 · 7 버튼 로딩·경고 닫기·토글 칩 · 8 캐러셀 · 9 표
   10 달력 · 11 칸반 · 12 폼 · 13 마퀴 · 14 코드 복사 · 15 진행 · 16 모션·튀김
   17 등장 · 18 내비 · 19 마감 스와치 · 20 수량 · 21 단계 · 22 페이지 번호
   ========================================================================== */
(function () {
  'use strict';

  const root = document.documentElement;
  root.classList.add('js');
  const THEME_KEY = 'dohyeong-theme';
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const byId = (id) => (id ? document.getElementById(id) : null);
  const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
  const focusables = (box) => $$(FOCUSABLE, box).filter((el) => el.offsetParent !== null || el === document.activeElement);

  /* ------------------------------------------------------------------------
     1. 테마 — URL ?theme= 최우선 → localStorage → prefers-color-scheme
     ------------------------------------------------------------------------ */
  function readStored() { try { return localStorage.getItem(THEME_KEY); } catch (e) { return null; } }
  function store(v) { try { localStorage.setItem(THEME_KEY, v); } catch (e) { /* 저장 불가 환경 */ } }
  function initialTheme() {
    const q = new URLSearchParams(location.search).get('theme');
    if (q === 'dark' || q === 'light') return q;
    const s = readStored();
    if (s === 'dark' || s === 'light') return s;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    const dark = theme === 'dark';
    $$('[data-theme-toggle]').forEach((btn) => {
      btn.setAttribute('aria-pressed', String(dark));
      btn.setAttribute('aria-label', dark ? '낮 쇼룸으로 바꾸기 (라이트 모드)' : '밤 쇼룸으로 바꾸기 (다크 모드)');
      const label = $('[data-theme-label]', btn);
      if (label) label.textContent = dark ? '밤 쇼룸' : '낮 쇼룸';
    });
    $$('[data-theme-state]').forEach((el) => { el.textContent = dark ? '밤 쇼룸 (다크)' : '낮 쇼룸 (라이트)'; });
  }
  applyTheme(initialTheme());
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-theme-toggle]');
    if (!btn) return;
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    store(next);
  });
  const mq = window.matchMedia('(prefers-color-scheme: dark)');
  const onSystem = (ev) => {
    const q = new URLSearchParams(location.search).get('theme');
    if (q || readStored()) return;
    applyTheme(ev.matches ? 'dark' : 'light');
  };
  if (mq.addEventListener) mq.addEventListener('change', onSystem);

  /* ------------------------------------------------------------------------
     2. 오버레이 레이어 — 포커스 트랩 · Esc · 스크롤 잠금 · 포커스 복원
     ------------------------------------------------------------------------ */
  const layers = [];
  function syncLock() { document.body.classList.toggle('is-locked', layers.length > 0); }
  function pushLayer(layer) { layers.push(layer); syncLock(); }
  function dropLayer(layer) { const i = layers.indexOf(layer); if (i > -1) layers.splice(i, 1); syncLock(); }
  function topLayer() { return layers[layers.length - 1]; }
  function trapTab(e, box) {
    const list = focusables(box);
    if (!list.length) { e.preventDefault(); box.focus(); return; }
    const first = list[0];
    const last = list[list.length - 1];
    if (e.shiftKey && (document.activeElement === first || !box.contains(document.activeElement))) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && (document.activeElement === last || !box.contains(document.activeElement))) { e.preventDefault(); first.focus(); }
  }
  function afterTransition(el, fn, ms = 460) {
    if (reduced()) { fn(); return; }
    let done = false;
    const run = () => { if (!done) { done = true; fn(); } };
    el.addEventListener('transitionend', function h(ev) { if (ev.target === el) { el.removeEventListener('transitionend', h); run(); } });
    setTimeout(run, ms);
  }

  /* 모달 · 드로어 · 커맨드 공통 */
  function overlayApi(el, boxSel) {
    if (el._api) return el._api;
    const box = $(boxSel, el) || el;
    if (!box.hasAttribute('tabindex')) box.setAttribute('tabindex', '-1');
    let opener = null;
    const layer = {
      el,
      box,
      close: () => api.close(),
      trap: (e) => trapTab(e, box),
    };
    const api = {
      open(from) {
        if (!el.hidden && el.classList.contains('is-open')) return;
        opener = from || document.activeElement;
        el.hidden = false;
        // 강제 리플로 후 is-open — 트랜지션 시작
        void el.offsetWidth;
        el.classList.add('is-open');
        pushLayer(layer);
        const target = $('[data-autofocus]', el) || focusables(box)[0] || box;
        setTimeout(() => target.focus({ preventScroll: true }), 30);
        el.dispatchEvent(new CustomEvent('overlay:open'));
      },
      close() {
        if (el.hidden) return;
        el.classList.remove('is-open');
        dropLayer(layer);
        afterTransition(el, () => { el.hidden = true; });
        if (opener && document.contains(opener)) opener.focus({ preventScroll: true });
        el.dispatchEvent(new CustomEvent('overlay:close'));
      },
      toggle(from) { if (el.hidden) api.open(from); else api.close(); },
    };
    el.addEventListener('mousedown', (e) => { if (e.target === el) api.close(); });
    el._api = api;
    return api;
  }
  const modalApi = (el) => overlayApi(el, '.modal__box');
  const drawerApi = (el) => overlayApi(el, '.drawer__panel');

  document.addEventListener('click', (e) => {
    const opener = e.target.closest('[data-modal-open],[data-drawer-open]');
    if (opener) {
      e.preventDefault();
      const id = opener.getAttribute('data-modal-open') || opener.getAttribute('data-drawer-open');
      const el = byId(id);
      if (!el) return;
      (el.classList.contains('drawer') ? drawerApi(el) : modalApi(el)).open(opener);
      return;
    }
    const closer = e.target.closest('[data-close]');
    if (closer) {
      const host = closer.closest('.modal, .drawer, .cmd');
      if (host && host._api) { e.preventDefault(); host._api.close(); }
      else if (host) { e.preventDefault(); (host.classList.contains('drawer') ? drawerApi(host) : overlayApi(host, '.modal__box, .cmd__box')).close(); }
    }
  });

  /* 커맨드 팔레트 (⌘K / Ctrl+K) — 품번 검색기 */
  function commandApi(el) {
    if (el._cmd) return el._cmd;
    const api = overlayApi(el, '.cmd__box');
    const input = $('.cmd__input', el);
    const list = $('.cmd__list', el);
    const empty = $('.cmd__empty', el);
    const opts = () => $$('.cmd__opt', el);
    let active = null;
    if (list && !list.id) list.id = 'cmd-list-' + Math.random().toString(36).slice(2, 7);
    if (input) {
      input.setAttribute('role', 'combobox');
      input.setAttribute('aria-expanded', 'true');
      input.setAttribute('aria-controls', list ? list.id : '');
      input.setAttribute('aria-autocomplete', 'list');
    }
    opts().forEach((o, i) => { if (!o.id) o.id = (list ? list.id : 'cmd') + '-o' + i; o.setAttribute('role', 'option'); });
    function setActive(o) {
      opts().forEach((x) => x.setAttribute('aria-selected', String(x === o)));
      active = o;
      if (input) { if (o) input.setAttribute('aria-activedescendant', o.id); else input.removeAttribute('aria-activedescendant'); }
      if (o) o.scrollIntoView({ block: 'nearest' });
    }
    function visible() { return opts().filter((o) => !o.hidden && o.getAttribute('aria-disabled') !== 'true'); }
    function filter(q) {
      const term = q.trim().toLowerCase().replace(/^dh-?/, '');
      let n = 0;
      opts().forEach((o) => {
        const hay = ((o.getAttribute('data-keywords') || '') + ' ' + o.textContent).toLowerCase();
        const hit = !term || hay.includes(term) || hay.replace(/[\s-]/g, '').includes(term.replace(/[\s-]/g, ''));
        o.hidden = !hit;
        if (hit) n += 1;
      });
      $$('.cmd__group', el).forEach((g) => {
        let sib = g.nextElementSibling;
        let any = false;
        while (sib && !sib.classList.contains('cmd__group')) { if (sib.classList.contains('cmd__opt') && !sib.hidden) any = true; sib = sib.nextElementSibling; }
        g.hidden = !any;
      });
      if (empty) {
        empty.hidden = n > 0;
        const echo = $('[data-cmd-echo]', empty);
        if (echo) echo.textContent = q.trim();
      }
      setActive(visible()[0] || null);
    }
    function choose(o) {
      if (!o) return;
      const href = o.getAttribute('data-href');
      const title = (($('.cmd__name', o) || o).textContent || '').trim();
      api.close();
      if (href) { location.href = href; return; }
      toast({ tone: 'info', title: `${title} 열기`, text: o.getAttribute('data-toast-text') || '품번 검색기에서 고른 항목입니다.', no: (($('.cmd__no', o) || {}).textContent || '').trim() });
    }
    if (input) {
      input.addEventListener('input', () => filter(input.value));
      input.addEventListener('keydown', (e) => {
        const vis = visible();
        const i = vis.indexOf(active);
        if (e.key === 'ArrowDown') { e.preventDefault(); setActive(vis[(i + 1) % vis.length] || null); }
        else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(vis[(i - 1 + vis.length) % vis.length] || null); }
        else if (e.key === 'Home' && e.ctrlKey) { e.preventDefault(); setActive(vis[0]); }
        else if (e.key === 'End' && e.ctrlKey) { e.preventDefault(); setActive(vis[vis.length - 1]); }
        else if (e.key === 'Enter') { e.preventDefault(); choose(active); }
      });
    }
    el.addEventListener('click', (e) => { const o = e.target.closest('.cmd__opt'); if (o && o.getAttribute('aria-disabled') !== 'true') choose(o); });
    el.addEventListener('mousemove', (e) => { const o = e.target.closest('.cmd__opt'); if (o && o !== active && !o.hidden) setActive(o); });
    el.addEventListener('overlay:open', () => { if (input) { input.value = ''; filter(''); } });
    el._cmd = api;
    return api;
  }
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-command-open]');
    if (!btn) return;
    e.preventDefault();
    const el = byId(btn.getAttribute('data-command-open')) || $('.cmd[data-command]');
    if (el) commandApi(el).open(btn);
  });

  /* ------------------------------------------------------------------------
     3. 팝오버 · 메뉴 · 툴팁 (트랩 없음, 바깥 클릭·Esc 로 닫힘)
     ------------------------------------------------------------------------ */
  const floating = new Set();
  function openFloating(panel, trigger, kind) {
    floating.forEach((f) => { if (f.panel !== panel) closeFloating(f, false); });
    panel.hidden = false;
    trigger.setAttribute('aria-expanded', 'true');
    const f = { panel, trigger, kind };
    floating.add(f);
    if (kind === 'popover' && !$('.pop__tail', panel)) {
      const tail = document.createElement('span');
      tail.className = 'pop__tail';
      tail.setAttribute('aria-hidden', 'true');
      panel.prepend(tail);
    }
    if (kind === 'menu') {
      const items = menuItems(panel);
      items.forEach((it) => it.setAttribute('tabindex', '-1'));
      if (items[0]) items[0].focus();
    } else {
      const fx = $('[data-autofocus]', panel);
      if (fx) fx.focus();
    }
    return f;
  }
  function closeFloating(f, refocus) {
    f.panel.hidden = true;
    f.trigger.setAttribute('aria-expanded', 'false');
    floating.delete(f);
    if (refocus) f.trigger.focus();
  }
  function findFloating(panel) { let hit = null; floating.forEach((f) => { if (f.panel === panel) hit = f; }); return hit; }
  function menuItems(panel) { return $$('.menu__item', panel).filter((it) => it.getAttribute('aria-disabled') !== 'true' && !it.hidden); }

  document.addEventListener('click', (e) => {
    const pt = e.target.closest('[data-popover-trigger]');
    if (pt) {
      const panel = byId(pt.getAttribute('aria-controls') || pt.getAttribute('data-popover-trigger'));
      if (!panel) return;
      const f = findFloating(panel);
      if (f) closeFloating(f, false); else openFloating(panel, pt, 'popover');
      return;
    }
    const mt = e.target.closest('[data-menu-trigger]');
    if (mt) {
      const panel = byId(mt.getAttribute('aria-controls') || mt.getAttribute('data-menu-trigger'));
      if (!panel) return;
      const f = findFloating(panel);
      if (f) closeFloating(f, false); else openFloating(panel, mt, 'menu');
      return;
    }
    const mi = e.target.closest('.menu__item');
    if (mi && mi.getAttribute('aria-disabled') !== 'true') {
      const panel = mi.closest('.menu');
      if (mi.getAttribute('role') === 'menuitemradio') {
        const group = mi.getAttribute('data-group');
        $$('.menu__item[role="menuitemradio"]', panel).filter((x) => x.getAttribute('data-group') === group).forEach((x) => x.setAttribute('aria-checked', String(x === mi)));
      } else if (mi.getAttribute('role') === 'menuitemcheckbox') {
        mi.setAttribute('aria-checked', String(mi.getAttribute('aria-checked') !== 'true'));
      }
      if (mi.hasAttribute('data-toast')) toast(toastFromAttrs(mi));
      const f = findFloating(panel);
      if (f && !mi.hasAttribute('data-keep-open')) closeFloating(f, true);
      return;
    }
    // 바깥 클릭
    floating.forEach((f) => { if (!f.panel.contains(e.target) && !f.trigger.contains(e.target)) closeFloating(f, false); });
  });
  document.addEventListener('keydown', (e) => {
    const mt = e.target.closest && e.target.closest('[data-menu-trigger]');
    if (mt && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      e.preventDefault();
      const panel = byId(mt.getAttribute('aria-controls') || mt.getAttribute('data-menu-trigger'));
      if (panel && !findFloating(panel)) {
        openFloating(panel, mt, 'menu');
        if (e.key === 'ArrowUp') { const its = menuItems(panel); its[its.length - 1].focus(); }
      }
      return;
    }
    const panel = e.target.closest && e.target.closest('.menu');
    if (!panel) return;
    const f = findFloating(panel);
    const items = menuItems(panel);
    const i = items.indexOf(document.activeElement);
    if (e.key === 'ArrowDown') { e.preventDefault(); (items[i + 1] || items[0]).focus(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); (items[i - 1] || items[items.length - 1]).focus(); }
    else if (e.key === 'Home') { e.preventDefault(); items[0].focus(); }
    else if (e.key === 'End') { e.preventDefault(); items[items.length - 1].focus(); }
    else if (e.key === 'Tab' && f) { closeFloating(f, false); }
  });
  // 툴팁: Esc 로 숨기고, 떠나면 복구
  document.addEventListener('mouseleave', (e) => { if (e.target.classList && e.target.classList.contains('tip-anchor')) e.target.classList.remove('is-dismissed'); }, true);
  document.addEventListener('focusout', (e) => { const a = e.target.closest && e.target.closest('.tip-anchor'); if (a) a.classList.remove('is-dismissed'); });

  /* 전역 Esc — 가장 위 레이어부터 */
  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
      const el = $('.cmd[data-command]');
      if (el) { e.preventDefault(); const api = commandApi(el); if (el.hidden) api.open(document.activeElement); else api.close(); }
      return;
    }
    if (e.key === 'Tab') { const top = topLayer(); if (top) top.trap(e); return; }
    if (e.key !== 'Escape') return;
    const tips = $$('.tip-anchor').filter((a) => a.matches(':hover') || a.contains(document.activeElement));
    if (tips.length) { tips.forEach((a) => a.classList.add('is-dismissed')); }
    if (floating.size) {
      const last = Array.from(floating).pop();
      closeFloating(last, true);
      return;
    }
    const top = topLayer();
    if (top) { e.preventDefault(); top.close(); return; }
    const nav = $('.nav.is-open');
    if (nav) { setNav(nav, false); const b = $('[data-nav-toggle]', nav); if (b) b.focus(); }
  });

  /* ------------------------------------------------------------------------
     4. 탭 — 방향키 · Home/End · 모바일 스크롤 힌트
     ------------------------------------------------------------------------ */
  function initTabs(box) {
    const tabs = $$('[role="tab"]', box).filter((t) => t.closest('[data-tabs]') === box);
    if (!tabs.length) return;
    function select(tab, focus) {
      tabs.forEach((t) => {
        const on = t === tab;
        t.setAttribute('aria-selected', String(on));
        t.setAttribute('tabindex', on ? '0' : '-1');
        const p = byId(t.getAttribute('aria-controls'));
        if (p) p.hidden = !on;
      });
      if (focus) { tab.focus(); tab.scrollIntoView({ block: 'nearest', inline: 'nearest' }); }
    }
    const current = tabs.find((t) => t.getAttribute('aria-selected') === 'true') || tabs[0];
    select(current, false);
    tabs.forEach((t) => {
      t.addEventListener('click', () => { if (!t.disabled) select(t, false); });
      t.addEventListener('keydown', (e) => {
        const usable = tabs.filter((x) => !x.disabled && x.getAttribute('aria-disabled') !== 'true');
        const i = usable.indexOf(t);
        let next = null;
        if (e.key === 'ArrowRight') next = usable[(i + 1) % usable.length];
        else if (e.key === 'ArrowLeft') next = usable[(i - 1 + usable.length) % usable.length];
        else if (e.key === 'Home') next = usable[0];
        else if (e.key === 'End') next = usable[usable.length - 1];
        if (next) { e.preventDefault(); select(next, true); }
      });
    });
    const list = $('.tabs__list', box);
    const scroller = list && list.parentElement.classList.contains('tabs__scroller') ? list.parentElement : null;
    if (scroller) {
      const hint = () => scroller.classList.toggle('has-more', list.scrollWidth - list.clientWidth - list.scrollLeft > 4);
      list.addEventListener('scroll', hint, { passive: true });
      window.addEventListener('resize', hint);
      hint();
    }
  }

  /* ------------------------------------------------------------------------
     5. 아코디언 ([data-accordion="single"] 이면 하나만)
     ------------------------------------------------------------------------ */
  function initAccordion(box) {
    const single = box.getAttribute('data-accordion') === 'single';
    const btns = $$('.acc__btn', box);
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
  }

  /* ------------------------------------------------------------------------
     6. 토스트 — dohyeong.toast({ tone, title, text, no, duration })
     ------------------------------------------------------------------------ */
  let zone = null;
  function toastZone() {
    if (zone && document.body.contains(zone)) return zone;
    zone = document.createElement('div');
    zone.className = 'toast-zone';
    zone.setAttribute('aria-live', 'polite');
    zone.setAttribute('aria-label', '알림');
    document.body.appendChild(zone);
    return zone;
  }
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const CLOSE_SVG = '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';
  function toast({ tone = 'success', title = '', text = '', no = '', duration = 4500 } = {}) {
    const z = toastZone();
    const t = document.createElement('div');
    t.className = `toast toast--${tone}`;
    t.setAttribute('role', tone === 'error' ? 'alert' : 'status');
    t.style.setProperty('--toast-ms', duration + 'ms');
    t.innerHTML = `<span class="toast__mark" aria-hidden="true"></span><div class="toast__body">${no ? `<span class="toast__no">${esc(no)}</span>` : ''}<p class="toast__title">${esc(title)}</p>${text ? `<p class="toast__text">${esc(text)}</p>` : ''}</div><button type="button" class="toast__close" aria-label="알림 닫기">${CLOSE_SVG}</button>${duration ? '<span class="toast__timer" aria-hidden="true"></span>' : ''}`;
    z.appendChild(t);
    requestAnimationFrame(() => requestAnimationFrame(() => { t.classList.add('is-in'); setTimeout(() => t.classList.add('is-settled'), 450); }));
    let timer = null;
    let left = duration;
    let started = Date.now();
    const remove = () => {
      clearTimeout(timer);
      t.classList.add('is-leaving');
      setTimeout(() => t.remove(), reduced() ? 0 : 240);
    };
    const arm = () => { if (!duration) return; started = Date.now(); timer = setTimeout(remove, left); };
    const pause = () => { clearTimeout(timer); left -= Date.now() - started; };
    t.addEventListener('mouseenter', pause);
    t.addEventListener('mouseleave', arm);
    t.addEventListener('focusin', pause);
    t.addEventListener('focusout', arm);
    $('.toast__close', t).addEventListener('click', remove);
    arm();
    return t;
  }
  function toastFromAttrs(el) {
    return {
      tone: el.getAttribute('data-toast') || 'success',
      title: el.getAttribute('data-toast-title') || '',
      text: el.getAttribute('data-toast-text') || '',
      no: el.getAttribute('data-toast-no') || '',
    };
  }
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-toast]');
    if (!btn || btn.matches('.menu__item, [data-busy-demo], [data-burst], form')) return;
    toast(toastFromAttrs(btn));
  });

  /* ------------------------------------------------------------------------
     7. 버튼 로딩 시연 · 경고 닫기 · 토글 칩
     ------------------------------------------------------------------------ */
  function setBusy(btn, on) {
    if (on) {
      if (!$('.btn__busy', btn)) { const s = document.createElement('span'); s.className = 'btn__busy'; s.setAttribute('aria-hidden', 'true'); btn.appendChild(s); }
      btn.setAttribute('aria-busy', 'true');
    } else {
      btn.removeAttribute('aria-busy');
    }
  }
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-busy-demo]');
    if (!btn || btn.getAttribute('aria-busy') === 'true') return;
    e.preventDefault();
    const ms = parseInt(btn.getAttribute('data-busy-demo'), 10) || 1600;
    setBusy(btn, true);
    setTimeout(() => {
      setBusy(btn, false);
      if (btn.hasAttribute('data-toast')) toast(toastFromAttrs(btn));
      if (btn.hasAttribute('data-burst')) burst(btn);
    }, ms);
  });
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-dismiss]');
    if (!btn) return;
    const host = btn.closest('.alert, [data-dismissible]');
    if (!host) return;
    host.classList.add('is-leaving');
    setTimeout(() => host.remove(), reduced() ? 0 : 200);
  });
  document.addEventListener('click', (e) => {
    const chip = e.target.closest('[data-toggle-pressed]');
    if (!chip || chip.disabled) return;
    const group = chip.getAttribute('data-toggle-pressed');
    if (group) {
      $$(`[data-toggle-pressed="${group}"]`).forEach((c) => c.setAttribute('aria-pressed', String(c === chip)));
    } else {
      chip.setAttribute('aria-pressed', String(chip.getAttribute('aria-pressed') !== 'true'));
    }
  });

  /* ------------------------------------------------------------------------
     8. 캐러셀 — 카탈로그 쪽 넘김
     ------------------------------------------------------------------------ */
  function initCarousel(box) {
    const stage = $('.carousel__stage', box);
    const sheets = $$('.carousel__sheet', box);
    if (!sheets.length) return;
    const prev = $('[data-carousel-prev]', box);
    const next = $('[data-carousel-next]', box);
    const count = $('[data-carousel-count]', box);
    const name = $('[data-carousel-name]', box);
    const dotsBox = $('.carousel__dots', box);
    let idx = Math.max(0, sheets.findIndex((s) => s.hasAttribute('data-current')));
    const pad = (n) => String(n).padStart(2, '0');
    let dots = [];
    if (dotsBox) {
      dotsBox.innerHTML = '';
      sheets.forEach((s, i) => {
        const d = document.createElement('button');
        d.type = 'button';
        d.className = 'carousel__dot';
        d.setAttribute('aria-label', `${i + 1}쪽 보기${s.getAttribute('data-title') ? ' — ' + s.getAttribute('data-title') : ''}`);
        d.addEventListener('click', () => go(i));
        dotsBox.appendChild(d);
      });
      dots = $$('.carousel__dot', dotsBox);
    }
    function render() {
      sheets.forEach((s, i) => {
        const p = i - idx;
        s.setAttribute('data-pos', p < 0 ? 'past' : p > 2 ? 'far' : String(p));
        s.setAttribute('aria-hidden', String(p !== 0));
        if (p !== 0) s.setAttribute('inert', ''); else s.removeAttribute('inert');
        s.setAttribute('aria-label', `${i + 1} / ${sheets.length}`);
      });
      if (count) count.textContent = `${pad(idx + 1)} / ${pad(sheets.length)}`;
      if (name) name.textContent = sheets[idx].getAttribute('data-title') || '';
      if (prev) prev.disabled = idx === 0;
      if (next) next.disabled = idx === sheets.length - 1;
      dots.forEach((d, i) => d.setAttribute('aria-current', String(i === idx)));
    }
    function go(i) { idx = Math.max(0, Math.min(sheets.length - 1, i)); render(); }
    if (prev) prev.addEventListener('click', () => go(idx - 1));
    if (next) next.addEventListener('click', () => go(idx + 1));
    if (stage) {
      if (!stage.hasAttribute('tabindex')) stage.setAttribute('tabindex', '0');
      stage.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') { e.preventDefault(); go(idx + 1); }
        else if (e.key === 'ArrowLeft') { e.preventDefault(); go(idx - 1); }
      });
      let sx = null;
      stage.addEventListener('pointerdown', (e) => { sx = e.clientX; });
      stage.addEventListener('pointerup', (e) => { if (sx === null) return; const dx = e.clientX - sx; if (Math.abs(dx) > 40) go(idx + (dx < 0 ? 1 : -1)); sx = null; });
    }
    render();
  }

  /* ------------------------------------------------------------------------
     9. 표 — 정렬 · 전체 선택 · 가로 스크롤 힌트
     ------------------------------------------------------------------------ */
  function cellValue(cell, type) {
    const raw = (cell.getAttribute('data-sort') ?? cell.textContent).trim();
    if (type === 'num') return parseFloat(raw.replace(/[^\d.-]/g, '')) || 0;
    return raw;
  }
  function initSort(table) {
    $$('.tbl__sort', table).forEach((btn) => {
      btn.addEventListener('click', () => {
        const th = btn.closest('th');
        const col = Array.from(th.parentElement.children).indexOf(th);
        const type = btn.getAttribute('data-sort-type') || 'text';
        const dir = th.getAttribute('aria-sort') === 'ascending' ? 'descending' : 'ascending';
        $$('th[aria-sort]', table).forEach((h) => { if (h !== th) h.removeAttribute('aria-sort'); });
        th.setAttribute('aria-sort', dir);
        const body = table.tBodies[0];
        const rows = Array.from(body.rows);
        rows.sort((a, b) => {
          const va = cellValue(a.cells[col], type);
          const vb = cellValue(b.cells[col], type);
          const r = type === 'num' ? va - vb : String(va).localeCompare(String(vb), 'ko');
          return dir === 'ascending' ? r : -r;
        });
        rows.forEach((r) => body.appendChild(r));
      });
    });
  }
  function initTableSelect(table) {
    const all = $('[data-table-select]', table);
    if (!all) return;
    const out = byId(table.getAttribute('data-count-target'));
    const boxes = () => $$('tbody .tbl__check', table);
    function sync() {
      const bs = boxes();
      const n = bs.filter((b) => b.checked).length;
      all.checked = n === bs.length && n > 0;
      all.indeterminate = n > 0 && n < bs.length;
      bs.forEach((b) => b.closest('tr').setAttribute('aria-selected', String(b.checked)));
      if (out) out.textContent = n ? `${n}건 선택` : '선택 없음';
    }
    all.addEventListener('change', () => { boxes().forEach((b) => { b.checked = all.checked; }); sync(); });
    table.addEventListener('change', (e) => { if (e.target.classList.contains('tbl__check')) sync(); });
    sync();
  }
  function initScrollHint(el) {
    const hint = () => el.classList.toggle('has-more', el.scrollWidth - el.clientWidth - el.scrollLeft > 4);
    el.addEventListener('scroll', hint, { passive: true });
    window.addEventListener('resize', hint);
    hint();
  }

  /* ------------------------------------------------------------------------
     10. 달력 — 날짜 선택
     ------------------------------------------------------------------------ */
  function initCalendar(cal) {
    const out = $('[data-cal-output]', cal);
    cal.addEventListener('click', (e) => {
      const day = e.target.closest('.cal__day');
      if (!day || day.disabled || day.hasAttribute('data-closed')) return;
      $$('.cal__day[aria-pressed="true"]', cal).forEach((d) => d.setAttribute('aria-pressed', 'false'));
      day.setAttribute('aria-pressed', 'true');
      if (out) out.textContent = day.getAttribute('data-label') || day.getAttribute('aria-label') || day.textContent.trim();
    });
    // 방향키 이동 (7칸 그리드)
    cal.addEventListener('keydown', (e) => {
      const day = e.target.closest('.cal__day');
      if (!day) return;
      const days = $$('.cal__day', cal);
      const i = days.indexOf(day);
      const step = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: 7, ArrowUp: -7 }[e.key];
      if (step === undefined) return;
      e.preventDefault();
      const n = days[i + step];
      if (n) n.focus();
    });
  }

  /* ------------------------------------------------------------------------
     11. 칸반 — 끌어 놓기 + Alt(⌥)+←/→ 키보드 이동
     ------------------------------------------------------------------------ */
  function josa(word, a, b) {
    const ch = word.trim().slice(-1);
    const code = ch.charCodeAt(0) - 0xac00;
    if (code < 0 || code > 11171) return `${a}(${b})`;
    return code % 28 ? a : b;
  }
  function initKanban(board) {
    const cols = $$('.board__col', board);
    let live = $('.board__live', board);
    if (!live) { live = document.createElement('p'); live.className = 'sr-only board__live'; live.setAttribute('aria-live', 'polite'); board.appendChild(live); }
    const colName = (list) => { const c = list.closest('.board__col'); const t = c && $('.board__title', c); return t ? t.textContent.trim() : '다음 열'; };
    function updateCounts() {
      cols.forEach((col) => {
        const n = $$('.kcard', col).length;
        $$('[data-count]', col).forEach((c) => { c.textContent = String(n); });
        const empty = $('.board__empty', col);
        if (empty) empty.hidden = n > 0;
      });
    }
    let dragging = null;
    board.addEventListener('dragstart', (e) => {
      const card = e.target.closest('.kcard');
      if (!card) return;
      dragging = card;
      card.classList.add('is-dragging');
      e.dataTransfer.effectAllowed = 'move';
      try { e.dataTransfer.setData('text/plain', card.getAttribute('data-title') || ''); } catch (err) { /* 무시 */ }
    });
    board.addEventListener('dragend', () => {
      if (dragging) {
        dragging.classList.remove('is-dragging');
        const t = dragging.getAttribute('data-title') || '카드';
        live.textContent = `${t}${josa(t, '을', '를')} ${colName(dragging.closest('.board__list'))} 열에 놓았습니다.`;
      }
      dragging = null;
      $$('.board__list.is-over', board).forEach((l) => l.classList.remove('is-over'));
      updateCounts();
    });
    board.addEventListener('dragover', (e) => {
      const list = e.target.closest('.board__list');
      if (!list || !dragging) return;
      e.preventDefault();
      $$('.board__list.is-over', board).forEach((l) => { if (l !== list) l.classList.remove('is-over'); });
      list.classList.add('is-over');
      const after = $$('.kcard:not(.is-dragging)', list).find((c) => { const r = c.getBoundingClientRect(); return e.clientY < r.top + r.height / 2; });
      const empty = $('.board__empty', list);
      if (after) list.insertBefore(dragging, after); else if (empty) list.insertBefore(dragging, empty); else list.appendChild(dragging);
    });
    board.addEventListener('drop', (e) => { if (e.target.closest('.board__list')) e.preventDefault(); });
    board.addEventListener('keydown', (e) => {
      const card = e.target.closest('.kcard');
      if (!card || !e.altKey || (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft')) return;
      e.preventDefault();
      const col = card.closest('.board__col');
      const i = cols.indexOf(col);
      const target = cols[i + (e.key === 'ArrowRight' ? 1 : -1)];
      if (!target) return;
      const list = $('.board__list', target);
      const empty = $('.board__empty', list);
      if (empty) list.insertBefore(card, empty); else list.appendChild(card);
      card.focus();
      updateCounts();
      const t = card.getAttribute('data-title') || '카드';
      live.textContent = `${t}${josa(t, '을', '를')} ${colName(list)} 열로 옮겼습니다.`;
    });
    updateCounts();
  }

  /* ------------------------------------------------------------------------
     12. 폼 검증 — form[data-validate] · 스위치 상태 문구
     ------------------------------------------------------------------------ */
  function fieldInvalid(input) {
    if (input.disabled) return false;
    if (input.type === 'checkbox' && input.required) return !input.checked;
    if (input.type === 'radio' && input.required) return !$$(`input[name="${input.name}"]`, input.form).some((r) => r.checked);
    const v = (input.value || '').trim();
    if (input.required && !v) return true;
    if (v && input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return true;
    if (v && input.pattern && !new RegExp(`^(?:${input.pattern})$`).test(v)) return true;
    if (v && input.minLength > 0 && v.length < input.minLength) return true;
    return false;
  }
  function errorEl(input) {
    const ids = (input.getAttribute('aria-describedby') || '').split(/\s+/).filter(Boolean);
    for (const id of ids) { const el = byId(id); if (el && el.classList.contains('field__error')) return el; }
    const field = input.closest('.field, .fieldset');
    return field ? $('.field__error', field) : null;
  }
  function setFieldError(input, bad) {
    input.setAttribute('aria-invalid', String(bad));
    const field = input.closest('.field');
    if (field) field.classList.toggle('field--error', bad);
    const err = errorEl(input);
    if (err) err.hidden = !bad;
  }
  document.addEventListener('submit', (e) => {
    const form = e.target.closest('form[data-validate]');
    if (!form) return;
    e.preventDefault();
    const inputs = $$('input, select, textarea', form).filter((i) => i.required || i.pattern || i.type === 'email' || i.minLength > 0);
    let first = null;
    inputs.forEach((i) => { const bad = fieldInvalid(i); setFieldError(i, bad); if (bad && !first) first = i; });
    const submit = $('[type="submit"]', form);
    if (first) {
      first.focus();
      if (form.hasAttribute('data-error-title')) toast({ tone: 'error', title: form.getAttribute('data-error-title'), text: form.getAttribute('data-error-text') || '' });
      return;
    }
    const finish = () => {
      if (submit) setBusy(submit, false);
      if (form.hasAttribute('data-toast-title')) toast(toastFromAttrs(form));
      form.dispatchEvent(new CustomEvent('form:valid', { bubbles: true }));
    };
    if (submit && submit.classList.contains('btn')) { setBusy(submit, true); setTimeout(finish, reduced() ? 0 : 900); } else finish();
  });
  document.addEventListener('input', (e) => {
    const i = e.target;
    if (i.getAttribute && i.getAttribute('aria-invalid') === 'true' && !fieldInvalid(i)) setFieldError(i, false);
    const count = i.closest && i.closest('.field') && $('[data-char-count]', i.closest('.field'));
    if (count && i.maxLength > 0) count.textContent = `${i.value.length} / ${i.maxLength}`;
  });
  document.addEventListener('change', (e) => {
    const i = e.target;
    if (i.getAttribute && i.getAttribute('aria-invalid') === 'true' && !fieldInvalid(i)) setFieldError(i, false);
    if (i.matches && i.matches('.switch input')) syncSwitch(i);
  });
  function syncSwitch(i) {
    const state = $('.switch__state', i.closest('.switch'));
    if (state) state.textContent = i.checked ? (state.getAttribute('data-on') || '켜짐') : (state.getAttribute('data-off') || '꺼짐');
  }

  /* ------------------------------------------------------------------------
     13. 마퀴 — 복제 · 멈춤
     ------------------------------------------------------------------------ */
  function initMarquee(m) {
    const track = $('.marquee__track', m);
    if (!track) return;
    const groups = $$('.marquee__group', track);
    if (groups.length === 1) { const c = groups[0].cloneNode(true); c.setAttribute('aria-hidden', 'true'); track.appendChild(c); }
    const tg = $('[data-marquee-toggle]', m);
    if (tg) {
      tg.addEventListener('click', () => {
        const paused = m.classList.toggle('is-paused');
        tg.setAttribute('aria-pressed', String(paused));
        tg.setAttribute('aria-label', paused ? '공지 흐름 다시 재생' : '공지 흐름 멈춤');
      });
    }
  }

  /* ------------------------------------------------------------------------
     14. 코드 복사
     ------------------------------------------------------------------------ */
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-copy]');
    if (!btn) return;
    const host = btn.closest('.code');
    const code = host && $('code', host);
    if (!code) return;
    const text = code.textContent;
    const label = $('[data-copy-label]', btn) || btn;
    const done = () => {
      const prevText = label.textContent;
      label.textContent = '복사됨';
      btn.classList.add('is-done');
      setTimeout(() => { label.textContent = prevText; btn.classList.remove('is-done'); }, 1600);
    };
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).then(done, done);
    else {
      const ta = document.createElement('textarea');
      ta.value = text; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); } catch (err) { /* 무시 */ }
      ta.remove(); done();
    }
  });

  /* ------------------------------------------------------------------------
     15. 진행 — aria-valuenow → --val
     ------------------------------------------------------------------------ */
  function syncMeter(bar) {
    const min = parseFloat(bar.getAttribute('aria-valuemin') || '0');
    const max = parseFloat(bar.getAttribute('aria-valuemax') || '100');
    const now = parseFloat(bar.getAttribute('aria-valuenow') || '0');
    const pct = Math.max(0, Math.min(100, ((now - min) / (max - min)) * 100));
    if (bar.classList.contains('meter')) bar.style.setProperty('--val', pct + '%');
    const ring = bar.matches('.ring-wrap') ? $('.ring__val', bar) : null;
    if (ring) ring.style.setProperty('--val', String(pct));
  }
  function setProgress(bar, value) { bar.setAttribute('aria-valuenow', String(value)); syncMeter(bar); }

  /* ------------------------------------------------------------------------
     16. 모션 시연 · 튀김
     ------------------------------------------------------------------------ */
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-motion-play]');
    if (!btn) return;
    const obj = byId(btn.getAttribute('data-motion-play'));
    if (!obj) return;
    if (reduced()) { toast({ tone: 'info', title: '움직임 줄이기 설정이 켜져 있어요', text: '최종 상태만 보여 줍니다.' }); return; }
    obj.classList.remove('is-playing');
    void obj.offsetWidth;
    obj.classList.add('is-playing');
    if (obj.getAttribute('data-motion') === 'burst') burst(obj);
    obj.addEventListener('animationend', () => obj.classList.remove('is-playing'), { once: true });
  });
  const BITS = ['circle', 'tri', 'worm', 'zig', 'circle', 'sq'];
  function burst(from) {
    if (reduced()) return;
    const r = from.getBoundingClientRect();
    const b = document.createElement('div');
    b.className = 'burst';
    b.setAttribute('aria-hidden', 'true');
    b.style.left = r.left + r.width / 2 + 'px';
    b.style.top = r.top + r.height / 2 + 'px';
    BITS.forEach((kind, i) => {
      const s = document.createElement('i');
      s.className = 'burst__bit burst__bit--' + kind;
      const ang = (-150 + i * 60 + (Math.random() * 24 - 12)) * (Math.PI / 180);
      const dist = 70 + Math.random() * 50;
      s.style.setProperty('--dx', Math.cos(ang) * dist + 'px');
      s.style.setProperty('--dy', Math.sin(ang) * dist - 20 + 'px');
      s.style.setProperty('--rot', (Math.random() * 360 - 180).toFixed(0) + 'deg');
      b.appendChild(s);
    });
    document.body.appendChild(b);
    setTimeout(() => b.remove(), 700);
  }
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-burst]');
    if (!btn || btn.hasAttribute('data-busy-demo')) return;
    burst(btn);
    if (btn.hasAttribute('data-toast')) toast(toastFromAttrs(btn));
  });

  /* ------------------------------------------------------------------------
     17. 등장 — 받침대 위로 "툭" ([data-drop], 형제 순서로 --i 스태거)
     ------------------------------------------------------------------------ */
  function initDrops() {
    const els = $$('[data-drop]');
    if (!els.length) return;
    els.forEach((el) => {
      if (el.style.getPropertyValue('--i')) return;
      const sibs = Array.from(el.parentElement.children).filter((c) => c.hasAttribute('data-drop'));
      el.style.setProperty('--i', String(Math.min(sibs.indexOf(el), 10)));
    });
    if (reduced() || !('IntersectionObserver' in window)) { els.forEach((el) => el.classList.add('is-in')); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    els.forEach((el) => io.observe(el));
  }

  /* ------------------------------------------------------------------------
     18. 내비 — 매장 셸 버거 · 작업실 서랍
     ------------------------------------------------------------------------ */
  function setNav(nav, open) {
    nav.classList.toggle('is-open', open);
    const b = $('[data-nav-toggle]', nav);
    if (b) { b.setAttribute('aria-expanded', String(open)); b.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기'); }
  }
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-nav-toggle]');
    if (b) { const nav = b.closest('.nav'); setNav(nav, !nav.classList.contains('is-open')); return; }
    const open = $('.nav.is-open');
    if (open && (!open.contains(e.target) || e.target.closest('.nav__link'))) setNav(open, false);
  });

  const sideLayer = { el: null, box: null, close: () => setSide(false), trap: (e) => trapTab(e, sideLayer.box) };
  let sideOpener = null;
  function setSide(open, from) {
    const app = $('.app');
    const side = app && $('.side', app);
    if (!side) return;
    sideLayer.el = side; sideLayer.box = side;
    const was = app.classList.contains('is-side-open');
    if (open === was) return;
    app.classList.toggle('is-side-open', open);
    $$('[data-side-toggle]').forEach((t) => t.setAttribute('aria-expanded', String(open)));
    if (open) {
      sideOpener = from || document.activeElement;
      pushLayer(sideLayer);
      const f = focusables(side)[0];
      setTimeout(() => (f || side).focus(), 40);
    } else {
      dropLayer(sideLayer);
      if (sideOpener && document.contains(sideOpener)) sideOpener.focus();
    }
  }
  document.addEventListener('click', (e) => {
    const t = e.target.closest('[data-side-toggle]');
    if (t) { e.preventDefault(); setSide(!$('.app.is-side-open'), t); return; }
    if (e.target.closest('.app__scrim')) setSide(false);
  });
  window.addEventListener('resize', () => { if (window.innerWidth > 900 && $('.app.is-side-open')) setSide(false); });

  /* ------------------------------------------------------------------------
     19. 마감 스와치 → 일러스트 판재 패턴 교체 ([data-finish-target])
     ------------------------------------------------------------------------ */
  document.addEventListener('change', (e) => {
    const input = e.target;
    const set = input.closest && input.closest('[data-finish-target]');
    if (!set || input.type !== 'radio') return;
    const target = byId(set.getAttribute('data-finish-target'));
    const code = (input.value || '').toLowerCase().replace(/[^a-z0-9]/g, ''); // lm01
    if (target && code) target.style.setProperty('--finish', `var(--lam-${code})`);
    const label = $('[data-finish-label]', set.closest('[data-finish-scope]') || document);
    if (label) label.textContent = input.getAttribute('data-name') || input.value;
  });

  /* ------------------------------------------------------------------------
     20. 수량 스테퍼
     ------------------------------------------------------------------------ */
  document.addEventListener('click', (e) => {
    const b = e.target.closest('.qty button');
    if (!b) return;
    const q = b.closest('.qty');
    const input = $('input', q);
    const min = parseInt(input.min || '1', 10);
    const max = parseInt(input.max || '99', 10);
    const v = (parseInt(input.value, 10) || min) + (b.hasAttribute('data-qty-up') ? 1 : -1);
    input.value = String(Math.max(min, Math.min(max, v)));
    $$('button', q).forEach((x) => { x.disabled = x.hasAttribute('data-qty-up') ? +input.value >= max : +input.value <= min; });
    input.dispatchEvent(new Event('change', { bubbles: true }));
  });

  /* ------------------------------------------------------------------------
     21. 단계 진행 ([data-stepper] > .steps + [data-step-panel] + [data-step-next|prev])
     ------------------------------------------------------------------------ */
  function initStepper(box) {
    const items = $$('.steps__item', box);
    const panels = $$('[data-step-panel]', box);
    let at = Math.max(0, items.findIndex((i) => i.getAttribute('data-state') === 'current'));
    function render() {
      items.forEach((it, i) => {
        it.setAttribute('data-state', i < at ? 'done' : i === at ? 'current' : 'todo');
        if (i === at) it.setAttribute('aria-current', 'step'); else it.removeAttribute('aria-current');
      });
      panels.forEach((p, i) => { p.hidden = i !== at; });
      $$('[data-step-prev]', box).forEach((b) => { b.disabled = at === 0; });
      $$('[data-step-now]', box).forEach((el) => { el.textContent = String(at + 1); });
    }
    box.addEventListener('click', (e) => {
      if (e.target.closest('[data-step-next]')) { at = Math.min(panels.length ? panels.length - 1 : items.length - 1, at + 1); render(); const p = panels[at]; if (p) { const f = focusables(p)[0]; if (f) f.focus(); } }
      else if (e.target.closest('[data-step-prev]')) { at = Math.max(0, at - 1); render(); }
    });
    box.addEventListener('form:valid', (e) => { if (e.target.closest('[data-step-panel]')) { at = Math.min(panels.length - 1, at + 1); render(); } });
    render();
  }

  /* ------------------------------------------------------------------------
     22. 페이지 번호 시연 ([data-pager] 안의 숫자 버튼)
     ------------------------------------------------------------------------ */
  function initPager(p) {
    const nums = $$('.pager__btn:not(.pager__btn--step)', p);
    const prev = $('[data-pager-prev]', p);
    const next = $('[data-pager-next]', p);
    const info = $('.pager__info', p);
    const total = parseInt(p.getAttribute('data-total') || String(nums.length), 10);
    const per = parseInt(p.getAttribute('data-per') || '10', 10);
    const count = parseInt(p.getAttribute('data-count') || '0', 10);
    let cur = Math.max(0, nums.findIndex((n) => n.getAttribute('aria-current') === 'page'));
    function render() {
      nums.forEach((n, i) => { if (i === cur) n.setAttribute('aria-current', 'page'); else n.removeAttribute('aria-current'); });
      const page = parseInt(nums[cur].textContent, 10) || cur + 1;
      if (prev) prev.setAttribute('aria-disabled', String(page <= 1));
      if (next) next.setAttribute('aria-disabled', String(page >= total));
      if (info && count) { const a = (page - 1) * per + 1; const b = Math.min(count, page * per); info.textContent = `${count}건 중 ${a}–${b}`; }
    }
    p.addEventListener('click', (e) => {
      const b = e.target.closest('.pager__btn');
      if (!b || b.getAttribute('aria-disabled') === 'true') return;
      e.preventDefault();
      if (b === prev) cur = Math.max(0, cur - 1);
      else if (b === next) cur = Math.min(nums.length - 1, cur + 1);
      else cur = nums.indexOf(b);
      render();
    });
    render();
  }

  /* ------------------------------------------------------------------------
     초기화
     ------------------------------------------------------------------------ */
  function init() {
    $$('[data-tabs]').forEach(initTabs);
    $$('[data-accordion]').forEach(initAccordion);
    $$('[data-carousel]').forEach(initCarousel);
    $$('table.tbl').forEach((t) => { initSort(t); initTableSelect(t); });
    $$('.tbl-scroll').forEach(initScrollHint);
    $$('[data-calendar]').forEach(initCalendar);
    $$('[data-kanban]').forEach(initKanban);
    $$('[data-marquee]').forEach(initMarquee);
    $$('.meter[aria-valuenow], .ring-wrap[aria-valuenow]').forEach(syncMeter);
    $$('.switch input').forEach(syncSwitch);
    $$('[data-char-count]').forEach((c) => { const f = c.closest('.field'); const i = f && $('[maxlength]', f); if (i) c.textContent = `${i.value.length} / ${i.maxLength}`; });
    $$('[data-stepper]').forEach(initStepper);
    $$('[data-pager]').forEach(initPager);
    $$('.cmd[data-command]').forEach(commandApi);
    $$('.modal').forEach((m) => { if (!m.classList.contains('modal--static')) modalApi(m); });
    $$('.drawer').forEach((d) => { if (!d.classList.contains('drawer--static')) drawerApi(d); });
    initDrops();
    applyTheme(root.getAttribute('data-theme') || initialTheme());
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();

  // 장면 스크립트용 공개 API
  window.dohyeong = {
    toast,
    setProgress,
    burst,
    openModal: (id) => { const el = byId(id); if (el) modalApi(el).open(); },
    openDrawer: (id) => { const el = byId(id); if (el) drawerApi(el).open(); },
    openCommand: () => { const el = $('.cmd[data-command]'); if (el) commandApi(el).open(); },
    applyTheme: (t) => { applyTheme(t); store(t); },
  };
})();
