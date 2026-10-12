/* ==========================================================================
   반죽섬 파티 디자인 시스템 v2 — app.js (바닐라, 외부 라이브러리 없음)
   1 테마  2 레이어(모달·드로어·커맨드)  3 커맨드 팔레트  4 팝오버·메뉴  5 탭
   6 아코디언  7 토스트  8 캐러셀  9 툴팁  10 스위치·슬라이더·스테퍼·고르기
   11 폼 검증·글자 수  12 칸반  13 달력  14 마퀴  15 복사  16 카운트업·착지
   17 반죽이(깜빡임·시선)  18 모션 견본  19 표 정렬·선택  20 보상 받기·알림 닫기
   마크업 계약은 COMPONENTS.md 참고.
   ========================================================================== */
(() => {
  'use strict';

  const doc = document;
  const root = doc.documentElement;
  const STORE_KEY = 'banjuk-theme';
  const $ = (sel, ctx = doc) => ctx.querySelector(sel);
  const $$ = (sel, ctx = doc) => Array.from(ctx.querySelectorAll(sel));
  const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const byId = (id) => (id ? doc.getElementById(id) : null);
  const fmt = (n) => Number(n).toLocaleString('ko-KR');
  let uid = 0;
  const ensureId = (el, prefix) => {
    if (!el.id) { uid += 1; el.id = `${prefix}-${uid}`; }
    return el.id;
  };
  const later = (fn, ms) => window.setTimeout(fn, reduced() ? 0 : ms);

  root.classList.add('js');

  const store = {
    get() { try { return localStorage.getItem(STORE_KEY); } catch (e) { return null; } },
    set(v) { try { localStorage.setItem(STORE_KEY, v); } catch (e) { /* 저장 불가 환경 */ } },
  };

  /* ------------------------------------------------------------------------
     1. 테마 — ?theme= → localStorage → prefers-color-scheme
     ------------------------------------------------------------------------ */
  const scheme = window.matchMedia('(prefers-color-scheme: dark)');
  const valid = (t) => (t === 'dark' || t === 'light' ? t : null);
  const queryTheme = () => valid(new URLSearchParams(window.location.search).get('theme'));
  const storedTheme = () => valid(store.get());
  const resolveTheme = () => queryTheme() || storedTheme() || (scheme.matches ? 'dark' : 'light');

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    $$('[data-theme-toggle]').forEach((btn) => {
      btn.setAttribute('aria-pressed', String(theme === 'dark'));
      if (!btn.hasAttribute('aria-label') && !btn.textContent.trim()) btn.setAttribute('aria-label', '밤 장면');
      const label = $('[data-theme-label]', btn);
      if (label) label.textContent = theme === 'dark' ? '밤' : '낮';
    });
    $$('[data-theme-scope]').forEach(syncScopeButton);
  }
  applyTheme(resolveTheme());
  const onScheme = () => { if (!queryTheme() && !storedTheme()) applyTheme(resolveTheme()); };
  if (scheme.addEventListener) scheme.addEventListener('change', onScheme);

  // 방 하나만 밤 장면으로: <button data-theme-scope="#room-id" aria-pressed="false">
  function scopeTarget(btn) { try { return $(btn.getAttribute('data-theme-scope')); } catch (e) { return null; } }
  function scopeTheme(target) { return target.getAttribute('data-theme') || root.getAttribute('data-theme') || 'light'; }
  function syncScopeButton(btn) {
    const target = scopeTarget(btn);
    if (!target) return;
    const t = scopeTheme(target);
    // 버튼은 현재 상태가 아니라 '누르면 일어날 일'을 말한다: 밤인 방에서는 낮으로, 낮인 방에서는 밤으로
    const next = t === 'dark' ? '낮' : '밤';
    btn.removeAttribute('aria-pressed');
    btn.setAttribute('aria-label', '이 방만 ' + next + '으로 바꾸기');
    const label = $('[data-scope-label]', btn);
    if (label) label.textContent = next + '으로';
    $$('[data-scope-ico]', btn).forEach((ico) => { ico.hidden = ico.getAttribute('data-scope-ico') !== (t === 'dark' ? 'sun' : 'moon'); });
  }

  doc.addEventListener('click', (e) => {
    const toggle = e.target.closest('[data-theme-toggle]');
    if (toggle) {
      const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      store.set(next);
      applyTheme(next);
      return;
    }
    const scoped = e.target.closest('[data-theme-scope]');
    if (scoped) {
      const target = scopeTarget(scoped);
      if (!target) return;
      target.setAttribute('data-theme', scopeTheme(target) === 'dark' ? 'light' : 'dark');
      syncScopeButton(scoped);
    }
  });

  /* ------------------------------------------------------------------------
     2. 레이어 스택 — Esc 닫기 · 포커스 트랩 · 스크롤 잠금 · 바깥 누르면 닫기
     ------------------------------------------------------------------------ */
  const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]):not([type="hidden"]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';
  const focusables = (el) => $$(FOCUSABLE, el).filter((n) => !n.closest('[hidden]') && n.getClientRects().length > 0);
  const layers = [];
  const syncLock = () => root.classList.toggle('is-locked', layers.some((l) => l.lock));
  const pushLayer = (l) => { const i = layers.indexOf(l); if (i > -1) layers.splice(i, 1); layers.push(l); syncLock(); };
  const dropLayer = (l) => { const i = layers.indexOf(l); if (i > -1) layers.splice(i, 1); syncLock(); };

  function trapTab(e, box) {
    const list = focusables(box);
    if (!list.length) { e.preventDefault(); box.focus(); return; }
    const first = list[0];
    const last = list[list.length - 1];
    if (e.shiftKey && (doc.activeElement === first || !box.contains(doc.activeElement))) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && (doc.activeElement === last || !box.contains(doc.activeElement))) { e.preventDefault(); first.focus(); }
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

  function dialogApi(el) {
    if (el.bjDialog) return el.bjDialog;
    const kind = el.classList.contains('drawer') ? 'drawer' : el.classList.contains('cmdk') ? 'cmdk' : 'modal';
    const box = $(kind === 'drawer' ? '.drawer__panel' : kind === 'cmdk' ? '.cmdk__box' : '.modal__box', el) || el;
    if (!box.hasAttribute('tabindex')) box.setAttribute('tabindex', '-1');
    let timer = null;
    const api = {
      el, box, kind, lock: true, trap: true, trigger: null, isOpen: false,
      open(trigger) {
        if (api.isOpen) return;
        clearTimeout(timer);
        api.trigger = trigger || doc.activeElement;
        el.classList.remove('is-closing');
        el.hidden = false;
        if (kind === 'modal' && api.trigger && api.trigger.getBoundingClientRect) {
          // 트리거 위치에서 부풀어 오르도록 transform-origin 지정
          const t = api.trigger.getBoundingClientRect();
          const b = box.getBoundingClientRect();
          if (t.width && b.width) {
            box.style.setProperty('--ox', `${Math.round(t.left + t.width / 2 - b.left)}px`);
            box.style.setProperty('--oy', `${Math.round(t.top + t.height / 2 - b.top)}px`);
          }
        }
        void el.offsetWidth;
        el.classList.add('is-open');
        api.isOpen = true;
        if (api.trigger && api.trigger.setAttribute && api.trigger.hasAttribute('aria-expanded')) api.trigger.setAttribute('aria-expanded', 'true');
        pushLayer(api);
        const target = $('[data-autofocus]', el) || focusables(box)[0] || box;
        target.focus({ preventScroll: true });
        el.dispatchEvent(new CustomEvent('banjuk:open', { bubbles: true }));
      },
      close(restore = true) {
        if (!api.isOpen) return;
        api.isOpen = false;
        el.classList.remove('is-open');
        el.classList.add('is-closing');
        dropLayer(api);
        if (api.trigger && api.trigger.setAttribute && api.trigger.hasAttribute('aria-expanded')) api.trigger.setAttribute('aria-expanded', 'false');
        timer = later(() => { el.hidden = true; el.classList.remove('is-closing'); }, kind === 'drawer' ? 260 : 170);
        if (restore && api.trigger && api.trigger.focus) api.trigger.focus({ preventScroll: true });
        el.dispatchEvent(new CustomEvent('banjuk:close', { bubbles: true }));
      },
    };
    el.addEventListener('click', (e) => { if (e.target === el) api.close(true); });
    el.bjDialog = api;
    return api;
  }
  const isStatic = (el) => /--static\b/.test(el.className);
  const overlayOf = (el) => el.closest('.modal, .drawer, .cmdk');

  doc.addEventListener('click', (e) => {
    const opener = e.target.closest('[data-open]');
    if (opener) {
      const el = byId(opener.getAttribute('data-open'));
      if (el && !isStatic(el)) { e.preventDefault(); dialogApi(el).open(opener); }
      return;
    }
    const closer = e.target.closest('[data-close]');
    if (closer) {
      const el = overlayOf(closer);
      if (el && !isStatic(el)) { e.preventDefault(); dialogApi(el).close(true); }
    }
  });

  /* ------------------------------------------------------------------------
     3. 커맨드 팔레트 — ⌘K / Ctrl+K · 필터 · 화살표 · Enter
     ------------------------------------------------------------------------ */
  const norm = (s) => (s || '').toLowerCase().replace(/\s+/g, '');

  function initCommand(el) {
    const input = $('.cmdk__input', el);
    const list = $('.cmdk__list', el);
    const empty = $('.cmdk__empty', el);
    if (!input || !list) return;
    const opts = $$('.cmdk__opt', list);
    opts.forEach((o) => { ensureId(o, 'cmdk-opt'); o.setAttribute('tabindex', '-1'); });
    const visible = () => opts.filter((o) => !o.hidden);
    function select(o) {
      opts.forEach((x) => x.setAttribute('aria-selected', String(x === o)));
      if (o) {
        input.setAttribute('aria-activedescendant', o.id);
        /* 목록 안에서만 스크롤(scrollIntoView는 페이지 전체를 끌고 가서 로드 직후 화면이 견본 쪽으로 튄다) */
        const top = o.getBoundingClientRect().top - list.getBoundingClientRect().top + list.scrollTop;
        const bottom = top + o.offsetHeight;
        if (top < list.scrollTop) list.scrollTop = top;
        else if (bottom > list.scrollTop + list.clientHeight) list.scrollTop = bottom - list.clientHeight;
      }
      else input.removeAttribute('aria-activedescendant');
    }
    function filter() {
      const q = norm(input.value);
      opts.forEach((o) => { o.hidden = q ? !norm(`${o.textContent} ${o.getAttribute('data-keywords') || ''}`).includes(q) : false; });
      $$('.cmdk__section', list).forEach((s) => { s.hidden = !$$('.cmdk__opt', s).some((o) => !o.hidden); });
      const v = visible();
      if (empty) {
        empty.hidden = v.length > 0;
        const echo = $('[data-cmdk-query]', empty);
        if (echo) echo.textContent = input.value.trim();
      }
      select(v[0] || null);
    }
    input.addEventListener('input', filter);
    input.addEventListener('keydown', (e) => {
      const v = visible();
      const cur = v.findIndex((o) => o.getAttribute('aria-selected') === 'true');
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        if (!v.length) return;
        const next = e.key === 'ArrowDown' ? (cur + 1) % v.length : (cur - 1 + v.length) % v.length;
        select(v[next]);
      } else if (e.key === 'Enter') {
        const o = v[cur];
        if (!o || o.getAttribute('aria-disabled') === 'true') return;
        e.preventDefault();
        o.click();
      }
    });
    list.addEventListener('pointermove', (e) => {
      const o = e.target.closest('.cmdk__opt');
      if (o && o.getAttribute('aria-selected') !== 'true') select(o);
    });
    list.addEventListener('click', (e) => {
      const o = e.target.closest('.cmdk__opt');
      if (!o) return;
      if (o.getAttribute('aria-disabled') === 'true') { e.preventDefault(); return; }
      if (!o.hasAttribute('href') && !isStatic(el)) dialogApi(el).close(true);
    });
    el.addEventListener('banjuk:open', () => { input.value = ''; filter(); });
    filter();
  }

  const palette = () => $$('.cmdk').find((c) => !isStatic(c));
  doc.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
      const el = palette();
      if (!el) return;
      e.preventDefault();
      const api = dialogApi(el);
      if (api.isOpen) api.close(true); else api.open(doc.activeElement);
    }
  });
  doc.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-command-open]');
    if (!btn) return;
    const el = palette();
    if (el) { e.preventDefault(); dialogApi(el).open(btn); }
  });

  /* ------------------------------------------------------------------------
     4. 팝오버 · 메뉴 — 트리거 아래(공간 없으면 위)에 띄움
     ------------------------------------------------------------------------ */
  const floats = [];
  function floatApi(panel, trigger, type) {
    if (panel.bjFloat) { panel.bjFloat.trigger = trigger; return panel.bjFloat; }
    if (panel.parentElement !== doc.body) doc.body.appendChild(panel);   // 기울어진 방 안에서도 fixed가 깨지지 않게
    const api = {
      box: panel, trigger, lock: false, trap: false, isOpen: false,
      place() {
        const t = api.trigger.getBoundingClientRect();
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const pw = panel.offsetWidth;
        const ph = panel.offsetHeight;
        const gap = type === 'menu' ? 12 : 28;
        let left = Math.min(Math.max(t.left, 8), vw - pw - 8);
        let top = t.bottom + gap;
        let side = 'bottom';
        if (top + ph > vh - 8 && t.top - ph - gap > 8) { top = t.top - ph - gap; side = 'top'; }
        left = Math.max(8, left);
        panel.style.left = `${Math.round(left)}px`;
        panel.style.top = `${Math.round(top)}px`;
        panel.setAttribute('data-side', side);
        const tail = Math.min(Math.max(t.left + t.width / 2 - left - 8, 16), pw - 32);
        panel.style.setProperty('--tail-x', `${Math.round(tail)}px`);
        panel.style.setProperty('--pop-ox', `${Math.round(tail + 8)}px`);
      },
      open() {
        if (api.isOpen) return;
        floats.filter((f) => f !== api && f.isOpen).forEach((f) => f.close(false));
        panel.hidden = false;
        api.place();
        panel.classList.add('is-open');
        api.isOpen = true;
        api.trigger.setAttribute('aria-expanded', 'true');
        pushLayer(api);
        if (type === 'menu') {
          const first = items(panel)[0];
          if (first) first.focus();
        }
      },
      close(restore = true) {
        if (!api.isOpen) return;
        api.isOpen = false;
        panel.classList.remove('is-open');
        panel.hidden = true;
        api.trigger.setAttribute('aria-expanded', 'false');
        dropLayer(api);
        if (restore) api.trigger.focus();
      },
      toggle() { if (api.isOpen) api.close(true); else api.open(); },
    };
    panel.bjFloat = api;
    floats.push(api);
    if (type === 'menu') initMenuKeys(panel, api);
    return api;
  }
  const items = (menu) => $$('[role^="menuitem"]', menu).filter((i) => !i.disabled && i.getAttribute('aria-disabled') !== 'true');

  function initMenuKeys(menu, api) {
    $$('[role^="menuitem"]', menu).forEach((i) => i.setAttribute('tabindex', '-1'));
    menu.addEventListener('keydown', (e) => {
      const list = items(menu);
      const i = list.indexOf(doc.activeElement);
      let next = null;
      if (e.key === 'ArrowDown') next = list[(i + 1) % list.length];
      else if (e.key === 'ArrowUp') next = list[(i - 1 + list.length) % list.length];
      else if (e.key === 'Home') next = list[0];
      else if (e.key === 'End') next = list[list.length - 1];
      else if (e.key === 'Tab') { api.close(false); return; }
      if (next) { e.preventDefault(); next.focus(); }
    });
    menu.addEventListener('click', (e) => {
      const item = e.target.closest('[role^="menuitem"]');
      if (!item || item.disabled || item.getAttribute('aria-disabled') === 'true') return;
      const role = item.getAttribute('role');
      if (role === 'menuitemradio') {
        $$('[role="menuitemradio"]', menu).forEach((r) => r.setAttribute('aria-checked', String(r === item)));
      } else if (role === 'menuitemcheckbox') {
        item.setAttribute('aria-checked', String(item.getAttribute('aria-checked') !== 'true'));
      }
      if (!item.hasAttribute('data-keep-open')) api.close(true);
    });
  }

  doc.addEventListener('click', (e) => {
    const trig = e.target.closest('[data-popover], [data-menu]');
    if (!trig) return;
    const type = trig.hasAttribute('data-menu') ? 'menu' : 'popover';
    const panel = byId(trig.getAttribute(type === 'menu' ? 'data-menu' : 'data-popover'));
    if (!panel) return;
    e.preventDefault();
    floatApi(panel, trig, type).toggle();
  });
  doc.addEventListener('keydown', (e) => {
    const trig = e.target.closest && e.target.closest('[data-menu]');
    if (!trig || (e.key !== 'ArrowDown' && e.key !== 'ArrowUp')) return;
    const panel = byId(trig.getAttribute('data-menu'));
    if (!panel) return;
    e.preventDefault();
    const api = floatApi(panel, trig, 'menu');
    api.open();
    const list = items(panel);
    if (e.key === 'ArrowUp' && list.length) list[list.length - 1].focus();
  });
  const replace = () => floats.forEach((f) => { if (f.isOpen) f.place(); });
  window.addEventListener('resize', replace);
  window.addEventListener('scroll', replace, { passive: true });

  /* ------------------------------------------------------------------------
     5. 탭 — 버터 인디케이터 · 화살표 · Home/End
     ------------------------------------------------------------------------ */
  function initTabs(box) {
    const list = $('[role="tablist"]', box);
    if (!list) return;
    const tabs = $$('[role="tab"]', list);
    const ink = $('.tabs__ink', list);
    if (ink) box.classList.add('has-ink');
    const moveInk = (tab) => {
      if (!ink || !tab) return;
      /* 숨은 상자 안이면 폭이 0 — 인디케이터 대신 선택 탭 자체에 버터 바닥(CSS 폴백) */
      if (!tab.offsetWidth) { box.classList.remove('has-ink'); return; }
      box.classList.add('has-ink');
      ink.style.setProperty('--ink-x', `${tab.offsetLeft}px`);
      ink.style.setProperty('--ink-w', `${tab.offsetWidth}px`);
      ink.style.top = `${tab.offsetTop}px`;
    };
    function select(tab, focus) {
      tabs.forEach((t) => {
        const on = t === tab;
        t.setAttribute('aria-selected', String(on));
        t.setAttribute('tabindex', on ? '0' : '-1');
        const panel = byId(t.getAttribute('aria-controls'));
        if (panel) panel.hidden = !on;
      });
      moveInk(tab);
      if (focus) tab.focus();
      const l = list.scrollLeft;
      const right = tab.offsetLeft + tab.offsetWidth;
      if (tab.offsetLeft < l) list.scrollTo({ left: tab.offsetLeft - 12, behavior: reduced() ? 'auto' : 'smooth' });
      else if (right > l + list.clientWidth) list.scrollTo({ left: right - list.clientWidth + 12, behavior: reduced() ? 'auto' : 'smooth' });
      box.dispatchEvent(new CustomEvent('banjuk:tab', { bubbles: true, detail: { tab } }));
    }
    tabs.forEach((t) => {
      t.addEventListener('click', () => { if (!t.disabled) select(t, false); });
      t.addEventListener('keydown', (e) => {
        const usable = tabs.filter((x) => !x.disabled);
        const i = usable.indexOf(t);
        let next = null;
        if (e.key === 'ArrowRight') next = usable[(i + 1) % usable.length];
        else if (e.key === 'ArrowLeft') next = usable[(i - 1 + usable.length) % usable.length];
        else if (e.key === 'Home') next = usable[0];
        else if (e.key === 'End') next = usable[usable.length - 1];
        if (next) { e.preventDefault(); select(next, true); }
      });
    });
    const current = tabs.find((t) => t.getAttribute('aria-selected') === 'true') || tabs[0];
    select(current, false);
    const re = () => moveInk(tabs.find((t) => t.getAttribute('aria-selected') === 'true'));
    window.addEventListener('resize', re);
    if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(re);
    /* 접힌 상자가 열리는 등 탭 줄 크기가 바뀌면 다시 맞춘다 */
    if ('ResizeObserver' in window) new ResizeObserver(re).observe(list);
    box.addEventListener('banjuk:reink', re);
    const rail = list.closest('.tabs__rail');
    if (rail) watchOverflow(list, rail);
  }

  /* 가로 넘침 표시: .is-overflow / .is-end (끝 페이드 힌트) */
  function watchOverflow(scroller, flagEl = scroller) {
    const sync = () => {
      const over = scroller.scrollWidth > scroller.clientWidth + 2;
      flagEl.classList.toggle('is-overflow', over);
      flagEl.classList.toggle('is-end', !over || scroller.scrollLeft + scroller.clientWidth >= scroller.scrollWidth - 2);
    };
    scroller.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', sync);
    if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(sync);
    sync();
  }

  /* ------------------------------------------------------------------------
     6. 아코디언
     ------------------------------------------------------------------------ */
  doc.addEventListener('click', (e) => {
    const trig = e.target.closest('.acc__trigger');
    if (!trig || trig.disabled) return;
    const open = trig.getAttribute('aria-expanded') !== 'true';
    const acc = trig.closest('.acc');
    if (open && acc && acc.hasAttribute('data-single')) {
      $$('.acc__trigger[aria-expanded="true"]', acc).forEach((t) => {
        if (t === trig) return;
        t.setAttribute('aria-expanded', 'false');
        const p = byId(t.getAttribute('aria-controls'));
        if (p) p.hidden = true;
      });
    }
    trig.setAttribute('aria-expanded', String(open));
    const panel = byId(trig.getAttribute('aria-controls'));
    if (panel) panel.hidden = !open;
  });

  /* ------------------------------------------------------------------------
     7. 토스트 — 4.5초 자동 닫힘, 호버·포커스 시 멈춤
     ------------------------------------------------------------------------ */
  const TONES = {
    success: { dough: 'mint', face: 'happy' },
    error: { dough: 'toma', face: 'dizzy' },
    info: { dough: 'blue', face: '' },
    reward: { dough: 'butter', face: 'happy' },
  };
  const CLOSE_SVG = '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';
  const doughHTML = (kind, face, extra = '') => `<span class="dough dough--${kind}${face ? ` dough--${face}` : ''} ${extra}" aria-hidden="true"><span class="dough__face"><i class="dough__eye"></i><i class="dough__eye"></i><i class="dough__mouth"></i></span></span>`;
  let zone = null;
  function toastZone() {
    if (zone && doc.body.contains(zone)) return zone;
    zone = doc.createElement('div');
    zone.className = 'toast-zone';
    doc.body.appendChild(zone);
    return zone;
  }
  function toast({ tone = 'success', title = '', text = '', duration = 4500 } = {}) {
    const t = TONES[tone] ? tone : 'info';
    const el = doc.createElement('div');
    el.className = `toast toast--${t}`;
    el.setAttribute('role', t === 'error' ? 'alert' : 'status');
    el.innerHTML = `<span class="toast__face">${doughHTML(TONES[t].dough, TONES[t].face)}</span><div class="toast__body"><p class="toast__title"></p>${text ? '<p class="toast__text"></p>' : ''}</div><button class="toast__close" type="button" aria-label="알림 닫기">${CLOSE_SVG}</button>`;
    $('.toast__title', el).textContent = title;
    if (text) $('.toast__text', el).textContent = text;
    toastZone().appendChild(el);
    let left = duration;
    let started = Date.now();
    let timer = null;
    const dismiss = () => {
      clearTimeout(timer);
      el.classList.add('is-leaving');
      later(() => el.remove(), 170);
    };
    const run = () => { if (duration <= 0) return; started = Date.now(); timer = setTimeout(dismiss, Math.max(600, left)); };
    const pause = () => { if (duration <= 0) return; clearTimeout(timer); left -= Date.now() - started; };
    el.addEventListener('mouseenter', pause);
    el.addEventListener('mouseleave', run);
    el.addEventListener('focusin', pause);
    el.addEventListener('focusout', run);
    $('.toast__close', el).addEventListener('click', dismiss);
    run();
    initDough(el);
    return el;
  }
  doc.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-toast]');
    if (!btn) return;
    toast({ tone: btn.getAttribute('data-toast'), title: btn.getAttribute('data-toast-title') || '', text: btn.getAttribute('data-toast-text') || '' });
  });

  /* ------------------------------------------------------------------------
     8. 캐러셀 — 스냅 스크롤 + 이전/다음 + 콩 점
     ------------------------------------------------------------------------ */
  function initCarousel(box) {
    const vp = $('.carousel__viewport', box);
    const slides = $$('.carousel__slide', box);
    if (!vp || !slides.length) return;
    if (slides.length >= 8) box.classList.add('carousel--many');
    else if (slides.length >= 5) box.classList.add('carousel--some');   // 모바일: 44px 점 대신 숫자
    const prev = $('.carousel__prev', box);
    const next = $('.carousel__next', box);
    const dotsBox = $('.carousel__dots', box);
    const status = $('[data-carousel-status]', box);
    let dots = [];
    slides.forEach((s, i) => {
      s.setAttribute('aria-roledescription', '칸');
      if (!s.hasAttribute('aria-label')) s.setAttribute('aria-label', `${i + 1} / ${slides.length}`);
    });
    if (dotsBox) {
      dotsBox.innerHTML = '';
      dots = slides.map((s, i) => {
        const d = doc.createElement('button');
        d.type = 'button';
        d.className = 'carousel__dot';
        d.setAttribute('aria-label', `${i + 1}번째 칸 보기`);
        d.addEventListener('click', () => go(i));
        dotsBox.appendChild(d);
        return d;
      });
    }
    const current = () => {
      const x = vp.scrollLeft;
      let best = 0;
      let dist = Infinity;
      slides.forEach((s, i) => { const d = Math.abs(s.offsetLeft - slides[0].offsetLeft - x); if (d < dist) { dist = d; best = i; } });
      return best;
    };
    const atEnd = () => vp.scrollLeft + vp.clientWidth >= vp.scrollWidth - 4;
    function go(i) {
      const n = Math.max(0, Math.min(slides.length - 1, i));
      vp.scrollTo({ left: slides[n].offsetLeft - slides[0].offsetLeft, behavior: reduced() ? 'auto' : 'smooth' });
    }
    function sync() {
      const i = atEnd() ? slides.length - 1 : current();
      dots.forEach((d, k) => d.setAttribute('aria-current', String(k === i)));
      if (prev) { prev.disabled = vp.scrollLeft <= 4; }
      if (next) { next.disabled = atEnd(); }
      if (status) status.textContent = rangeText(i) || `${i + 1} / ${slides.length}`;
      if (strip) syncStrip(i);
    }
    /* 범위 카운터: data-range-start="33" data-range-total="80" (data-range-label="티어")
       → "티어 33–39 / 80" (보이는 첫 칸–끝 칸 / 전체), [data-carousel-strip]에 창 위치를 CSS 변수로 */
    const rStart = Number(box.getAttribute('data-range-start'));
    const rTotal = Number(box.getAttribute('data-range-total'));
    const rLabel = box.getAttribute('data-range-label') || '';
    const strip = rTotal ? $('[data-carousel-strip]', box) : null;
    function visibleRange(i) {
      const w = slides[0].getBoundingClientRect().width || 1;
      const gap = slides[1] ? slides[1].offsetLeft - slides[0].offsetLeft - w : 0;
      const fit = Math.max(1, Math.floor((vp.clientWidth + gap + 2) / (w + gap)));
      const first = atEnd() ? Math.max(0, slides.length - fit) : i;
      const last = Math.min(slides.length - 1, first + fit - 1);
      return [rStart + first, rStart + last];
    }
    function rangeText(i) {
      if (!rStart || !rTotal) return '';
      const [a, b] = visibleRange(i);
      return `${rLabel ? `${rLabel} ` : ''}${a}–${b} / ${rTotal}`;
    }
    function syncStrip(i) {
      const [a, b] = visibleRange(i);
      strip.style.setProperty('--win-l', `${((a - 1) / rTotal) * 100}%`);
      strip.style.setProperty('--win-w', `${((b - a + 1) / rTotal) * 100}%`);
    }
    let raf = 0;
    vp.addEventListener('scroll', () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(sync); }, { passive: true });
    if (prev) prev.addEventListener('click', () => go(current() - 1));
    if (next) next.addEventListener('click', () => go(current() + 1));
    vp.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); go(current() + 1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(current() - 1); }
    });
    window.addEventListener('resize', sync);
    /* data-start="n"(0부터) 또는 슬라이드의 [data-carousel-start]로 첫 칸 지정 */
    const startAttr = box.getAttribute('data-start');
    const startSlide = slides.findIndex((s) => s.hasAttribute('data-carousel-start'));
    const start = startAttr !== null ? Number(startAttr) : startSlide;
    if (start > 0) vp.scrollLeft = slides[Math.min(start, slides.length - 1)].offsetLeft - slides[0].offsetLeft;
    sync();
  }

  /* ------------------------------------------------------------------------
     9. 툴팁 — Esc로 숨김
     ------------------------------------------------------------------------ */
  doc.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    $$('.tip').forEach((t) => { if (t.matches(':hover') || t.contains(doc.activeElement)) t.classList.add('is-dismissed'); });
  });
  const undismiss = (e) => { const t = e.target.closest && e.target.closest('.tip'); if (t) t.classList.remove('is-dismissed'); };
  doc.addEventListener('mouseout', undismiss);
  doc.addEventListener('focusout', undismiss);

  /* ------------------------------------------------------------------------
     10. 스위치 · 슬라이더 · 스테퍼 · 고르기 그룹
     ------------------------------------------------------------------------ */
  doc.addEventListener('click', (e) => {
    const sw = e.target.closest('.switch[role="switch"]');
    if (!sw || sw.disabled) return;
    const on = sw.getAttribute('aria-checked') !== 'true';
    sw.setAttribute('aria-checked', String(on));
    sw.classList.remove('is-squish');
    void sw.offsetWidth;
    sw.classList.add('is-squish');
    later(() => sw.classList.remove('is-squish'), 400);
    const state = $('[data-switch-state]', sw);
    if (state) state.textContent = on ? (state.getAttribute('data-on') || '켬') : (state.getAttribute('data-off') || '끔');
    sw.dispatchEvent(new CustomEvent('banjuk:switch', { bubbles: true, detail: { on } }));
  });

  function syncRange(r) {
    const min = Number(r.min || 0);
    const max = Number(r.max || 100);
    const pct = ((Number(r.value) - min) / (max - min)) * 100;
    r.style.setProperty('--val', `${pct}%`);
    const field = r.closest('.range-field');
    /* 장면 CSS가 값을 읽을 수 있게: 입력·필드에 --range-val(0–1)과 data-value를 같이 둔다 */
    const ratio = (pct / 100).toFixed(3);
    r.style.setProperty('--range-val', ratio);
    if (field) { field.style.setProperty('--range-val', ratio); field.setAttribute('data-value', r.value); }
    const out = field && $('.range-field__out', field);
    if (out) out.textContent = `${r.value}${r.getAttribute('data-unit') || ''}`;
  }
  doc.addEventListener('input', (e) => { if (e.target.matches && e.target.matches('.range')) syncRange(e.target); });

  function fmtStep(v, format, unit) {
    if (format === 'hm') {
      const h = Math.floor(v);
      const m = Math.round((v - h) * 60);
      return `${h}<small>시간</small>${m ? ` ${m}<small>분</small>` : ''}`;
    }
    return `${fmt(v)}${unit ? `<small>${unit}</small>` : ''}`;
  }
  function initStepper(box) {
    const out = $('.stepper__value', box);
    const min = Number(box.getAttribute('data-min') || 0);
    const max = Number(box.getAttribute('data-max') || 99);
    const step = Number(box.getAttribute('data-step') || 1);
    const format = box.getAttribute('data-format');
    const unit = box.getAttribute('data-unit') || '';
    let v = Number(box.getAttribute('data-value') || min);
    const render = () => {
      out.innerHTML = fmtStep(v, format, unit);
      box.setAttribute('data-value', String(v));
      $$('[data-step]', box).forEach((b) => {
        const dir = Number(b.getAttribute('data-step'));
        b.disabled = dir < 0 ? v <= min : v >= max;
      });
    };
    $$('[data-step]', box).forEach((b) => b.addEventListener('click', () => {
      v = Math.min(max, Math.max(min, Math.round((v + Number(b.getAttribute('data-step')) * step) * 100) / 100));
      render();
      box.classList.remove('is-bump');
      void box.offsetWidth;
      box.classList.add('is-bump');
    }));
    render();
  }

  // 고르기 그룹: <div data-pick-group data-pick-target="#toma" data-pick-attr="data-skin"> <button aria-pressed data-value="pumpkin">
  doc.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-pick-group] [aria-pressed]');
    if (!btn || btn.disabled) return;
    const group = btn.closest('[data-pick-group]');
    $$('[aria-pressed]', group).forEach((b) => { if (b.closest('[data-pick-group]') === group) b.setAttribute('aria-pressed', String(b === btn)); });
    const target = group.getAttribute('data-pick-target') && $(group.getAttribute('data-pick-target'));
    const attr = group.getAttribute('data-pick-attr');
    if (target && attr) target.setAttribute(attr, btn.getAttribute('data-value') || '');
    const labelEl = group.getAttribute('data-pick-label') && $(group.getAttribute('data-pick-label'));
    if (labelEl) labelEl.textContent = btn.getAttribute('data-label') || btn.textContent.trim();
    if (target && !reduced()) {
      target.classList.remove('is-jelly');
      void target.offsetWidth;
      target.classList.add('is-jelly');
    }
    group.dispatchEvent(new CustomEvent('banjuk:pick', { bubbles: true, detail: { value: btn.getAttribute('data-value') } }));
  });

  /* ------------------------------------------------------------------------
     11. 폼 검증 · 글자 수
     ------------------------------------------------------------------------ */
  function errorEl(input) {
    const ids = (input.getAttribute('aria-describedby') || '').split(/\s+/);
    return ids.map(byId).find((n) => n && n.classList.contains('field__error')) || null;
  }
  function check(input) {
    const v = (input.value || '').trim();
    let msg = '';
    if (input.type === 'checkbox' && input.required && !input.checked) msg = input.getAttribute('data-error-required') || '확인이 필요해요.';
    else if (input.required && !v) msg = input.getAttribute('data-error-required') || '꼭 채워 주세요.';
    else if (v && input.minLength > 0 && v.length < input.minLength) msg = input.getAttribute('data-error-short') || `${input.minLength}자 이상 적어 주세요.`;
    else if (v && input.getAttribute('data-max') && v.length > Number(input.getAttribute('data-max'))) msg = input.getAttribute('data-error-long') || `${input.getAttribute('data-max')}자까지 쓸 수 있어요.`;
    else if (v && input.pattern && !new RegExp(`^(?:${input.pattern})$`).test(v)) msg = input.getAttribute('data-error-pattern') || '형식을 확인해 주세요.';
    else if (v && input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) msg = '이메일 형식을 확인해 주세요.';
    setInvalid(input, msg);
    return !msg;
  }
  function setInvalid(input, msg) {
    const err = errorEl(input);
    if (msg) {
      input.setAttribute('aria-invalid', 'true');
      if (err) { err.textContent = msg; err.hidden = false; }
    } else {
      input.removeAttribute('aria-invalid');
      if (err) { err.hidden = true; }
    }
  }
  doc.addEventListener('submit', (e) => {
    const form = e.target;
    if (!form.matches('[data-validate]')) return;
    e.preventDefault();
    const fields = $$('input, textarea, select', form).filter((f) => !f.disabled && f.type !== 'hidden');
    const results = fields.map(check);
    const firstBad = fields[results.indexOf(false)];
    const submit = $('[type="submit"]', form);
    if (firstBad) {
      firstBad.focus();
      if (submit) { submit.setAttribute('data-state', 'error'); later(() => submit.removeAttribute('data-state'), 450); }
      return;
    }
    if (submit) submit.setAttribute('aria-busy', 'true');
    later(() => {
      if (submit) submit.removeAttribute('aria-busy');
      toast({ tone: 'success', title: form.getAttribute('data-success-title') || '저장했어요', text: form.getAttribute('data-success-text') || '' });
      form.dispatchEvent(new CustomEvent('banjuk:submitted', { bubbles: true }));
    }, 900);
  });
  doc.addEventListener('input', (e) => {
    const f = e.target;
    if (!f.matches) return;
    if (f.getAttribute('aria-invalid') === 'true') check(f);
    const counter = f.getAttribute('data-count') && byId(f.getAttribute('data-count'));
    if (counter) {
      const max = Number(f.getAttribute('data-max') || f.maxLength || 0);
      counter.textContent = max ? `${f.value.length} / ${max}` : String(f.value.length);
      counter.classList.toggle('is-over', max > 0 && f.value.length > max);
    }
  });
  doc.addEventListener('change', (e) => {
    const f = e.target;
    if (f.matches && f.getAttribute('aria-invalid') === 'true') check(f);
  });

  /* ------------------------------------------------------------------------
     12. 칸반 — 포인터 드래그(마우스·터치) + 키보드 옮기기
     ------------------------------------------------------------------------ */
  function initKanban(board) {
    const cols = () => $$('.kanban__col', board);
    const live = doc.createElement('p');
    live.className = 'sr-only';
    live.setAttribute('aria-live', 'polite');
    board.appendChild(live);
    const help = doc.createElement('p');
    help.className = 'sr-only';
    help.id = ensureId(help, 'kanban-help');
    help.textContent = '스페이스로 카드를 집고, 좌우 화살표로 열을, 위아래 화살표로 순서를 옮긴 뒤 스페이스로 내려놓아요. Esc는 취소예요.';
    board.appendChild(help);
    const colName = (col) => col.getAttribute('data-col') || ($('.kanban__title', col) || {}).textContent || '';
    const cardName = (card) => ($('.kcard__id', card) || {}).textContent || ($('.kcard__title', card) || {}).textContent || '카드';
    const say = (t) => { live.textContent = t; };
    function counts() {
      cols().forEach((c) => {
        const n = $$('.kcard', c).length;
        const badge = $('.kanban__count', c);
        if (badge) badge.textContent = String(n);
      });
    }
    function land(card) {
      card.classList.remove('is-landed');
      void card.offsetWidth;
      card.classList.add('is-landed');
      card.addEventListener('animationend', () => card.classList.remove('is-landed'), { once: true });
      const col = card.closest('.kanban__col');
      if (col) {
        col.classList.remove('is-wiggle');
        void col.offsetWidth;
        col.classList.add('is-wiggle');
        col.addEventListener('animationend', () => col.classList.remove('is-wiggle'), { once: true });
      }
      counts();
    }

    $$('.kcard', board).forEach((card) => {
      if (!card.hasAttribute('tabindex')) card.setAttribute('tabindex', '0');
      card.setAttribute('aria-roledescription', '옮길 수 있는 카드');
      card.setAttribute('aria-describedby', help.id);
    });

    // 포인터 드래그 — 마우스·펜은 6px 끌면 집고, 터치는 꾹 누르고(280ms) 있어야 집는다(그 전에 움직이면 화면 스크롤)
    let drag = null;
    const lift = () => {
      const { card } = drag;
      const r = card.getBoundingClientRect();
      drag.on = true;
      drag.offX = drag.x - r.left;
      drag.offY = drag.y - r.top;
      drag.ph = doc.createElement('li');
      drag.ph.className = 'kanban__placeholder';
      drag.ph.style.height = `${r.height}px`;
      drag.ph.setAttribute('aria-hidden', 'true');
      card.before(drag.ph);
      card.style.width = `${r.width}px`;
      card.style.left = `${r.left}px`;
      card.style.top = `${r.top}px`;
      card.classList.add('is-floating', 'is-dragging');
      doc.body.appendChild(card);
    };
    board.addEventListener('pointerdown', (e) => {
      const card = e.target.closest('.kcard');
      if (!card || e.button !== 0 || e.target.closest('a, button, input, select, textarea')) return;
      if (card.getAttribute('aria-disabled') === 'true') return;
      drag = { card, x: e.clientX, y: e.clientY, on: false, id: e.pointerId, touch: e.pointerType === 'touch', hold: 0 };
      if (drag.touch) {
        const d = drag;
        d.hold = setTimeout(() => { if (drag === d && !d.on) lift(); }, 280);
      }
    });
    // 집은 뒤에는 터치 스크롤을 막는다(첫 touchmove를 취소하면 브라우저가 화면을 끌지 않는다)
    doc.addEventListener('touchmove', (e) => { if (drag && drag.on) e.preventDefault(); }, { passive: false });
    window.addEventListener('pointermove', (e) => {
      if (!drag || e.pointerId !== drag.id) return;
      const { card } = drag;
      if (!drag.on) {
        const moved = Math.hypot(e.clientX - drag.x, e.clientY - drag.y);
        if (drag.touch) {
          if (moved > 8) { clearTimeout(drag.hold); drag = null; }   // 꾹 누르기 전에 움직였으면 스크롤로 넘긴다
          return;
        }
        if (moved < 6) return;
        lift();
      }
      e.preventDefault();
      card.style.left = `${e.clientX - drag.offX}px`;
      card.style.top = `${e.clientY - drag.offY}px`;
      const under = doc.elementFromPoint(e.clientX, e.clientY);
      const col = under && under.closest('.kanban__col');
      cols().forEach((c) => c.classList.toggle('is-over', c === col));
      if (col && board.contains(col)) {
        const list = $('.kanban__list', col);
        const before = $$('.kcard', list).find((c) => { const b = c.getBoundingClientRect(); return e.clientY < b.top + b.height / 2; });
        if (before) before.before(drag.ph); else list.appendChild(drag.ph);
      }
      const br = board.getBoundingClientRect();
      if (e.clientX > br.right - 40) board.scrollLeft += 12;
      else if (e.clientX < br.left + 40) board.scrollLeft -= 12;
    }, { passive: false });
    const end = (e) => {
      if (!drag || (e && e.pointerId !== drag.id)) return;
      const { card, ph, on } = drag;
      clearTimeout(drag.hold);
      drag = null;
      if (!on) return;
      ph.replaceWith(card);
      card.classList.remove('is-floating', 'is-dragging');
      card.style.left = '';
      card.style.top = '';
      card.style.width = '';
      cols().forEach((c) => c.classList.remove('is-over'));
      land(card);
      const col = card.closest('.kanban__col');
      say(`${cardName(card)}를 ${colName(col)} 열에 놓았어요.`);
      board.dispatchEvent(new CustomEvent('banjuk:kanban', { bubbles: true, detail: { card, col: colName(col) } }));
    };
    window.addEventListener('pointerup', end);
    window.addEventListener('pointercancel', end);

    // 키보드
    let held = null;
    board.addEventListener('keydown', (e) => {
      const card = e.target.closest && e.target.closest('.kcard');
      if (!card || e.target !== card) return;
      const all = cols();
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        if (held !== card) {
          if (held) held.setAttribute('aria-pressed', 'false');
          held = card;
          card.setAttribute('aria-pressed', 'true');
          card.dataset.originList = all.indexOf(card.closest('.kanban__col'));
          card.dataset.originIndex = $$('.kcard', card.parentElement).indexOf(card);
          say(`${cardName(card)}를 집었어요. 지금 ${colName(card.closest('.kanban__col'))} 열이에요.`);
        } else {
          held = null;
          card.setAttribute('aria-pressed', 'false');
          land(card);
          say(`${cardName(card)}를 ${colName(card.closest('.kanban__col'))} 열에 놓았어요.`);
          board.dispatchEvent(new CustomEvent('banjuk:kanban', { bubbles: true, detail: { card, col: colName(card.closest('.kanban__col')) } }));
        }
        return;
      }
      if (held !== card) return;
      const col = card.closest('.kanban__col');
      const ci = all.indexOf(col);
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        e.preventDefault();
        const target = all[ci + (e.key === 'ArrowRight' ? 1 : -1)];
        if (!target) return;
        $('.kanban__list', target).appendChild(card);
        card.focus();
        counts();
        say(`${colName(target)} 열로 옮겼어요.`);
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault();
        const sib = e.key === 'ArrowUp' ? card.previousElementSibling : card.nextElementSibling;
        if (!sib || !sib.classList.contains('kcard')) return;
        if (e.key === 'ArrowUp') sib.before(card); else sib.after(card);
        card.focus();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        const home = all[Number(card.dataset.originList)];
        if (home) {
          const list = $('.kanban__list', home);
          const ref = $$('.kcard', list).filter((c) => c !== card)[Number(card.dataset.originIndex)];
          if (ref) ref.before(card); else list.appendChild(card);
        }
        held = null;
        card.setAttribute('aria-pressed', 'false');
        card.focus();
        counts();
        say('옮기기를 취소했어요.');
      }
    });
    counts();
  }

  /* ------------------------------------------------------------------------
     13. 달력 — 날짜 고르기 · 화살표 이동
     ------------------------------------------------------------------------ */
  function initCalendar(cal) {
    const days = () => $$('.cal__day:not(:disabled)', cal);
    const out = $('[data-cal-out]', cal);
    cal.addEventListener('click', (e) => {
      const d = e.target.closest('.cal__day');
      if (!d || d.disabled) return;
      $$('.cal__day', cal).forEach((x) => x.setAttribute('aria-pressed', String(x === d)));
      if (out) out.textContent = d.getAttribute('data-note') || d.getAttribute('aria-label') || '';
    });
    cal.addEventListener('keydown', (e) => {
      const d = e.target.closest && e.target.closest('.cal__day');
      if (!d) return;
      const list = days();
      const i = list.indexOf(d);
      const map = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: 7, ArrowUp: -7 };
      if (map[e.key] === undefined) return;
      e.preventDefault();
      const next = list[i + map[e.key]];
      if (next) next.focus();
    });
  }

  /* ------------------------------------------------------------------------
     14. 마퀴 — 트랙 복제 · 정지 버튼
     ------------------------------------------------------------------------ */
  function initMarquee(m) {
    const track = $('.marquee__track', m);
    const viewport = $('.marquee__viewport', m) || m;
    if (!track || track.dataset.cloned) return;
    const originals = Array.from(track.children);
    track.dataset.cloned = '1';
    let lastVw = -1;
    let lastW = -1;
    /* 한 벌(w)이 뷰포트(vw)보다 좁으면 빈 구간이 생긴다 → ceil(vw / w) + 1벌을 이어 붙인다.
       이동 거리는 언제나 한 벌(-w)이라 이음매가 보이지 않는다. */
    const measure = () => {
      const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      const w = originals.reduce((s, li) => s + li.getBoundingClientRect().width + gap, 0);
      const vw = viewport.getBoundingClientRect().width;
      if (!w) return;
      if (Math.round(vw) !== lastVw || Math.round(w) !== lastW) {
        lastVw = Math.round(vw);
        lastW = Math.round(w);
        $$('[data-marquee-clone]', track).forEach((c) => c.remove());
        // 줄인 모션: 띠가 멈추므로 복제하지 않는다(같은 칸이 여러 줄로 겹쳐 나오는 문제)
        const sets = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 1 : Math.ceil(vw / w) + 1;
        for (let i = 1; i < sets; i += 1) {
          originals.forEach((li) => {
            const c = li.cloneNode(true);
            c.setAttribute('aria-hidden', 'true');
            c.setAttribute('data-marquee-clone', '');
            track.appendChild(c);
          });
        }
      }
      track.style.setProperty('--marquee-shift', `${-Math.round(w)}px`);
      m.style.setProperty('--marquee-dur', `${Math.max(20, Math.round(w / 40))}s`);
    };
    measure();
    if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(measure);
    window.addEventListener('resize', measure);
    const btn = $('.marquee__toggle', m);
    if (btn) btn.addEventListener('click', () => {
      const paused = btn.getAttribute('aria-pressed') !== 'true';
      btn.setAttribute('aria-pressed', String(paused));
      btn.setAttribute('aria-label', paused ? '흐르는 띠 다시 움직이기' : '흐르는 띠 멈추기');
      m.classList.toggle('is-paused', paused);
    });
  }

  /* ------------------------------------------------------------------------
     15. 복사 — 코드 블록 · UID
     ------------------------------------------------------------------------ */
  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text);
    return new Promise((res, rej) => {
      const ta = doc.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      doc.body.appendChild(ta);
      ta.select();
      try { doc.execCommand('copy'); res(); } catch (err) { rej(err); }
      ta.remove();
    });
  }
  doc.addEventListener('click', (e) => {
    const btn = e.target.closest('.code__copy, [data-copy-text]');
    if (!btn) return;
    const text = btn.getAttribute('data-copy-text') || (($('pre', btn.closest('.code')) || {}).innerText || '');
    const label = $('[data-copy-label]', btn) || btn;
    const before = label.textContent;
    copyText(text).then(() => {
      btn.classList.add('is-done');
      label.textContent = '복사됨';
      toast({ tone: 'success', title: '복사했어요', text: btn.getAttribute('data-copy-text') ? text : '' });
      setTimeout(() => { btn.classList.remove('is-done'); label.textContent = before; }, 1600);
    }).catch(() => toast({ tone: 'error', title: '복사하지 못했어요', text: '직접 선택해서 복사해 주세요.' }));
  });

  /* ------------------------------------------------------------------------
     16. 카운트업 · 방 착지 (화면에 들어올 때 한 번)
     ------------------------------------------------------------------------ */
  function countUp(el) {
    const to = Number(el.getAttribute('data-countup'));
    if (Number.isNaN(to)) return;
    if (reduced()) { el.textContent = fmt(to); return; }
    const t0 = performance.now();
    const dur = 700;
    const step = (now) => {
      const p = Math.min(1, (now - t0) / dur);
      const eased = 1 - (1 - p) ** 3;
      el.textContent = fmt(Math.round(to * eased));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
  const seen = (els, fn) => {
    if (!els.length) return;
    if (!('IntersectionObserver' in window)) { els.forEach(fn); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { io.unobserve(en.target); fn(en.target); } });
    }, { threshold: 0, rootMargin: '0px 0px 20% 0px' });
    els.forEach((el) => io.observe(el));
  };
  /* 착지 폴백: 스크롤 없이 보는 경우(전체 캡처·인쇄·빠른 앵커 이동)에도 빈 방이 남지 않게 */
  const landAll = () => $$('[data-land]:not(.is-landed)').forEach((el) => el.classList.add('is-landed'));
  window.addEventListener('beforeprint', landAll);

  /* ------------------------------------------------------------------------
     17. 반죽이 — 4~7초 간격 깜빡임 · 데스크톱에서 포인터 쪽으로 최대 3px 시선
     ------------------------------------------------------------------------ */
  function initDough(scope) {
    if (reduced()) return;
    $$('.dough', scope).forEach((d) => {
      if (d.bjBlink || !$('.dough__eye', d)) return;
      d.bjBlink = true;
      const loop = () => {
        d.bjTimer = setTimeout(() => {
          if (!doc.body.contains(d)) return;
          d.classList.add('is-blink');
          setTimeout(() => d.classList.remove('is-blink'), 160);
          loop();
        }, 4000 + Math.random() * 3000);
      };
      loop();
    });
  }
  function initGaze() {
    if (reduced() || !window.matchMedia('(pointer: fine)').matches) return;
    let raf = 0;
    let px = 0;
    let py = 0;
    window.addEventListener('pointermove', (e) => {
      px = e.clientX; py = e.clientY;
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        $$('.dough[data-gaze]').forEach((d) => {
          const r = d.getBoundingClientRect();
          if (r.bottom < 0 || r.top > window.innerHeight) return;
          const dx = px - (r.left + r.width / 2);
          const dy = py - (r.top + r.height / 2);
          const len = Math.hypot(dx, dy) || 1;
          d.style.setProperty('--gx', `${((dx / len) * 3).toFixed(1)}px`);
          d.style.setProperty('--gy', `${((dy / len) * 3).toFixed(1)}px`);
        });
      });
    }, { passive: true });
  }

  /* ------------------------------------------------------------------------
     18. 모션 견본
     ------------------------------------------------------------------------ */
  doc.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-motion-play]');
    if (!btn) return;
    const target = byId(btn.getAttribute('data-target'));
    if (!target || reduced()) return;
    const kind = btn.getAttribute('data-motion-play');
    target.classList.remove('is-squish', 'is-boing', 'is-jelly', 'is-bob');
    void target.offsetWidth;
    target.classList.add(`is-${kind}`);
    target.addEventListener('animationend', () => target.classList.remove(`is-${kind}`), { once: true });
  });

  /* ------------------------------------------------------------------------
     19. 표 — 정렬 · 행 선택
     ------------------------------------------------------------------------ */
  function initTable(table) {
    const tbody = $('tbody', table);
    if (!tbody) return;
    $$('th .tbl__sort', table).forEach((btn) => {
      btn.addEventListener('click', () => {
        const th = btn.closest('th');
        const idx = Array.from(th.parentElement.children).indexOf(th);
        const dir = th.getAttribute('aria-sort') === 'ascending' ? 'descending' : 'ascending';
        $$('th[aria-sort]', table).forEach((h) => h.setAttribute('aria-sort', 'none'));
        th.setAttribute('aria-sort', dir);
        const num = th.classList.contains('tbl__num') || th.getAttribute('data-type') === 'num';
        const val = (tr) => {
          const td = tr.children[idx];
          const raw = td ? (td.getAttribute('data-sort') || td.textContent.trim()) : '';
          return num ? Number(raw.replace(/[^\d.-]/g, '')) || 0 : raw;
        };
        const rows = $$('tr', tbody);
        rows.sort((a, b) => {
          const x = val(a);
          const y = val(b);
          const c = num ? x - y : String(x).localeCompare(String(y), 'ko');
          return dir === 'ascending' ? c : -c;
        });
        rows.forEach((r) => tbody.appendChild(r));
      });
    });
    const all = $('[data-select-all]', table);
    const rowsBoxes = () => $$('[data-row-select]', tbody);
    const countEl = table.getAttribute('data-select-count') && byId(table.getAttribute('data-select-count'));
    const sync = () => {
      const boxes = rowsBoxes();
      const n = boxes.filter((b) => b.checked).length;
      boxes.forEach((b) => { const tr = b.closest('tr'); if (tr) tr.setAttribute('aria-selected', String(b.checked)); });
      if (all) { all.checked = n > 0 && n === boxes.length; all.indeterminate = n > 0 && n < boxes.length; }
      if (countEl) countEl.textContent = n ? `${n}개 고름` : '';
    };
    if (all) all.addEventListener('change', () => { rowsBoxes().forEach((b) => { b.checked = all.checked; }); sync(); });
    tbody.addEventListener('change', (e) => { if (e.target.matches('[data-row-select]')) sync(); });
    if (all || rowsBoxes().length) sync();
  }

  /* ------------------------------------------------------------------------
     20. 보상 받기 · 로딩 시연 · 알림 닫기 · 페이지 번호(버튼형)
     ------------------------------------------------------------------------ */
  function bumpWallet(kind, add) {
    const coin = $(`[data-wallet="${kind}"]`);
    if (!coin) return;
    const b = $('b', coin);
    const from = Number((b.textContent || '0').replace(/[^\d]/g, ''));
    const to = from + add;
    coin.classList.remove('is-bump');
    void coin.offsetWidth;
    coin.classList.add('is-bump');
    if (reduced()) { b.textContent = fmt(to); return; }
    const t0 = performance.now();
    const step = (now) => {
      const p = Math.min(1, (now - t0) / 600);
      b.textContent = fmt(Math.round(from + add * p));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
  doc.addEventListener('click', (e) => {
    const claim = e.target.closest('[data-claim]');
    if (claim && !claim.disabled && claim.getAttribute('aria-busy') !== 'true') {
      claim.setAttribute('aria-busy', 'true');
      later(() => {
        claim.removeAttribute('aria-busy');
        claim.disabled = true;
        const label = $('[data-claim-label]', claim) || claim;
        label.textContent = claim.getAttribute('data-claim-done') || '받았어요';
        const amount = Number(claim.getAttribute('data-claim')) || 0;
        const kind = claim.getAttribute('data-claim-kind') || 'jelly';
        if (amount) bumpWallet(kind, amount);
        /* data-claim-badge="#a, #b": 같은 우편을 가리키는 상태 배지를 '수령 완료'로 */
        const badgeSel = claim.getAttribute('data-claim-badge');
        if (badgeSel) {
          $$(badgeSel).forEach((b) => {
            b.textContent = b.getAttribute('data-claim-badge-done') || '수령 완료';
            b.className = `${b.className.replace(/badge--(butter|tomato|blue|pink|clay)/g, '').replace(/\s+/g, ' ').trim()} badge--mint`;
          });
        }
        toast({ tone: 'reward', title: claim.getAttribute('data-claim-title') || `${kind === 'coin' ? '코인' : '젤리'} ${fmt(amount)} 받았어요`, text: claim.getAttribute('data-claim-text') || '' });
      }, 700);
      return;
    }
    const busy = e.target.closest('[data-demo-busy]');
    if (busy && busy.getAttribute('aria-busy') !== 'true') {
      busy.setAttribute('aria-busy', 'true');
      later(() => busy.removeAttribute('aria-busy'), 1600);
      return;
    }
    const close = e.target.closest('.alert__close');
    if (close) {
      const alert = close.closest('.alert');
      alert.classList.add('is-leaving');
      later(() => { alert.hidden = true; }, 200);
      return;
    }
    const page = e.target.closest('.pager button.pager__btn:not(.pager__btn--nav)');
    if (page) {
      const pager = page.closest('.pager');
      $$('button.pager__btn:not(.pager__btn--nav)', pager).forEach((b) => {
        if (b === page) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current');
      });
    }
  });

  /* ------------------------------------------------------------------------
     잠긴 다음 단계 열기 — <a data-unlock="폼 id" data-unlock-steps="단계 ol id" data-unlock-step="3">
     폼의 .is-locked를 풀고 fieldset[data-lock]을 켠 뒤, 단계 표시를 한 칸 넘긴다
     ------------------------------------------------------------------------ */
  const CHECK_SVG = '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
  doc.addEventListener('click', (e) => {
    const t = e.target.closest('[data-unlock]');
    if (!t) return;
    const box = byId(t.getAttribute('data-unlock'));
    if (!box || !box.classList.contains('is-locked')) return;
    box.classList.remove('is-locked');
    box.classList.add('is-unlocking');
    box.addEventListener('animationend', () => box.classList.remove('is-unlocking'), { once: true });
    $$('fieldset[data-lock]', box).forEach((f) => { f.disabled = false; });
    const n = Number(t.getAttribute('data-unlock-step'));
    const list = byId(t.getAttribute('data-unlock-steps') || '');
    if (list && n) {
      $$('.steps__item', list).forEach((li, i) => {
        if (i < n - 1) {
          if (!li.classList.contains('steps__item--done')) {
            li.classList.add('steps__item--done');
            const isle = $('.steps__isle', li);
            if (isle) isle.innerHTML = CHECK_SVG;
          }
          li.removeAttribute('aria-current');
        } else if (i === n - 1) li.setAttribute('aria-current', 'step');
      });
      $$('[data-step-count]').forEach((c) => { c.textContent = String(n); });
    }
    const first = $('input, textarea, select', box);
    if (first) later(() => first.focus({ preventScroll: true }), 450);
  });

  /* ------------------------------------------------------------------------
     장난감 상자(index) — 뚜껑이 곧 여닫는 버튼. 처음엔 앞의 두 상자만 열려 있고
     (≤600px은 첫 상자만) 나머지는 뚜껑을 닫은 채 놓인다. JS가 없으면 모두 열린다
     ------------------------------------------------------------------------ */
  function initToyboxes() {
    const boxes = $$('.toybox');
    if (!boxes.length) return;
    const narrow = window.matchMedia && window.matchMedia('(max-width: 600px)').matches;
    const setOpen = (box, open) => {
      const btn = $('.toybox__toggle', box);
      const body = $('.toybox__body', box);
      if (btn) btn.setAttribute('aria-expanded', String(open));
      if (body) body.hidden = !open;
      box.classList.toggle('is-collapsed', !open);
      if (open) $$('.tabs', box).forEach((t) => t.dispatchEvent(new CustomEvent('banjuk:reink')));
    };
    boxes.forEach((box, i) => {
      const h = $('.toybox__name', box);
      const body = $('.toybox__body', box);
      if (!h || !body) return;
      if (!body.id) body.id = `${h.id || `toybox-${i}`}-body`;
      const btn = doc.createElement('button');
      btn.type = 'button';
      btn.className = 'toybox__toggle';
      btn.setAttribute('aria-controls', body.id);
      while (h.firstChild) btn.appendChild(h.firstChild);
      btn.insertAdjacentHTML('beforeend', '<span class="toybox__knob" aria-hidden="true"></span>');
      h.appendChild(btn);
      btn.addEventListener('click', () => {
        const open = btn.getAttribute('aria-expanded') !== 'true';
        setOpen(box, open);
        if (open && !reduced()) {
          box.classList.remove('is-jelly'); void box.offsetWidth; box.classList.add('is-jelly');
          box.addEventListener('animationend', () => box.classList.remove('is-jelly'), { once: true });
        }
      });
      setOpen(box, narrow ? i === 0 : i < 2);
    });
    /* 주소의 #조각이 닫힌 상자 안을 가리키면 그 상자를 연다 */
    const openForHash = () => {
      const id = decodeURIComponent(location.hash.slice(1));
      const el = id && byId(id);
      const box = el && el.closest('.toybox.is-collapsed');
      if (box) { setOpen(box, true); el.scrollIntoView({ block: 'start' }); }
    };
    window.addEventListener('hashchange', openForHash);
    openForHash();
  }

  /* ------------------------------------------------------------------------
     초기화
     ------------------------------------------------------------------------ */
  function init() {
    $$('.modal, .drawer, .cmdk').forEach((el) => {
      if (isStatic(el)) return;
      if (!el.classList.contains('is-open')) el.hidden = true;
    });
    $$('.pop:not(.pop--static), .menu:not(.menu--static)').forEach((p) => { p.hidden = true; });
    $$('.cmdk').forEach(initCommand);
    $$('.tabs').forEach(initTabs);
    $$('[data-carousel]').forEach(initCarousel);
    $$('.range').forEach(syncRange);
    $$('[data-stepper]').forEach(initStepper);
    $$('[data-kanban]').forEach(initKanban);
    $$('[data-calendar]').forEach(initCalendar);
    $$('[data-marquee]').forEach(initMarquee);
    $$('.tbl').forEach(initTable);
    $$('.scroll-x').forEach((s) => watchOverflow(s));
    seen($$('[data-countup]'), countUp);
    seen($$('[data-land]'), (el) => el.classList.add('is-landed'));
    setTimeout(landAll, 2500);
    initToyboxes();
    initDough(doc);
    initGaze();
  }
  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', init); else init();

  window.Banjuk = {
    toast,
    open: (id) => { const el = byId(id); if (el) dialogApi(el).open(); },
    close: (id) => { const el = byId(id); if (el) dialogApi(el).close(); },
    setTheme: (t) => { if (valid(t)) { store.set(t); applyTheme(t); } },
  };
})();
