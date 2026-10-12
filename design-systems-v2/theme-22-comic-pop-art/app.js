/* ==========================================================================
   월간 쾅! 「쾅! 편집실」 v2 — app.js (바닐라 JS, 외부 라이브러리 없음)
   테마 · 효과음 · 레이어(모달/드로어/편집장 호출 ⌘K) · 팝오버 · 메뉴 · 툴팁 ·
   탭 · 아코디언 · 토스트 · 캐러셀 · 표(정렬/선택) · 달력 · 칸반 · 폼 검증 ·
   마퀴 · 복사 · 로딩 · 스위치 · 알림 닫기 · 컷 등장 · 모션 시연
   마크업 계약은 COMPONENTS.md. 전역 API: window.KW.{toast, sfx, open, close, setTheme}
   ========================================================================== */
(() => {
  'use strict';

  const doc = document;
  const root = doc.documentElement;
  const STORE_KEY = 'kwang-theme';
  const $ = (sel, ctx = doc) => ctx.querySelector(sel);
  const $$ = (sel, ctx = doc) => Array.from(ctx.querySelectorAll(sel));
  const byId = (id) => (id ? doc.getElementById(id.replace(/^#/, '')) : null);
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const reduced = () => motionQuery.matches;
  let uid = 0;
  const ensureId = (el, prefix) => { if (!el.id) el.id = `${prefix}-${++uid}`; return el.id; };
  const store = {
    get() { try { return localStorage.getItem(STORE_KEY); } catch (e) { return null; } },
    set(v) { try { localStorage.setItem(STORE_KEY, v); } catch (e) { /* 저장 불가 환경 */ } },
  };

  /* ------------------------------------------------------------------------
     1. 테마 — ?theme= → localStorage → prefers-color-scheme
     ------------------------------------------------------------------------ */
  const schemeQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const pick = (t) => (t === 'dark' || t === 'light' ? t : null);
  const queryTheme = () => pick(new URLSearchParams(window.location.search).get('theme'));
  const resolveTheme = () => queryTheme() || pick(store.get()) || (schemeQuery.matches ? 'dark' : 'light');

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    $$('[data-theme-toggle]').forEach((btn) => {
      const dark = theme === 'dark';
      btn.setAttribute('aria-pressed', String(dark));
      if (!btn.hasAttribute('data-theme-static-label')) {
        btn.setAttribute('aria-label', dark ? '낮 장면으로 바꾸기' : '밤 장면으로 바꾸기');
      }
      $$('[data-theme-label]', btn).forEach((l) => { l.textContent = dark ? '불 켜기' : '불 끄기'; });
    });
  }
  function setTheme(theme, persist = true) {
    if (!pick(theme)) return;
    if (persist) store.set(theme);
    applyTheme(theme);
  }
  applyTheme(resolveTheme());
  const onScheme = () => { if (!queryTheme() && !pick(store.get())) applyTheme(resolveTheme()); };
  if (schemeQuery.addEventListener) schemeQuery.addEventListener('change', onScheme);

  doc.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-theme-toggle]');
    if (!btn) return;
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    setTheme(next);
    sfx(btn, next === 'dark' ? '딸깍' : '번쩍!');
  });

  /* ------------------------------------------------------------------------
     2. 효과음 — 트리거 위쪽에 떴다 사라짐 (aria-hidden, reduced-motion이면 생략)
     ------------------------------------------------------------------------ */
  function sfx(target, word, opts = {}) {
    if (!word || reduced()) return null;
    let x; let y;
    if (target && target.getBoundingClientRect) {
      const r = target.getBoundingClientRect();
      x = r.left + r.width / 2;
      y = r.top;
    } else if (target && typeof target.x === 'number') {
      ({ x, y } = target);
    } else {
      x = window.innerWidth / 2;
      y = window.innerHeight / 2;
    }
    const el = doc.createElement('span');
    el.className = 'sfx sfx-pop' + (opts.red || /쾅|휙/.test(word) ? ' sfx--red' : '');
    el.setAttribute('aria-hidden', 'true');
    el.textContent = word;
    el.style.setProperty('--tilt', `${Math.round(Math.random() * 14 - 8)}deg`);
    el.style.left = `${Math.min(Math.max(x, 48), window.innerWidth - 48)}px`;
    el.style.top = `${Math.max(y - 44, 8)}px`;
    doc.body.appendChild(el);
    const kill = () => el.remove();
    el.addEventListener('animationend', kill, { once: true });
    setTimeout(kill, 1200);
    return el;
  }
  doc.addEventListener('click', (e) => {
    const t = e.target.closest('[data-sfx]');
    if (!t || t.disabled || t.getAttribute('aria-disabled') === 'true' || t.getAttribute('aria-busy') === 'true') return;
    sfx(t, t.getAttribute('data-sfx'));
  });

  /* ------------------------------------------------------------------------
     3. 레이어 스택 — Esc · 포커스 트랩 · 스크롤 잠금 · 바깥 클릭
     ------------------------------------------------------------------------ */
  const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]):not([type="hidden"]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';
  const focusables = (el) => $$(FOCUSABLE, el).filter((n) => !n.closest('[hidden],[inert]') && n.getClientRects().length > 0);
  const layers = [];
  const syncLock = () => root.classList.toggle('is-locked', layers.some((l) => l.lock));
  function pushLayer(l) { const i = layers.indexOf(l); if (i > -1) layers.splice(i, 1); layers.push(l); syncLock(); }
  function dropLayer(l) { const i = layers.indexOf(l); if (i > -1) layers.splice(i, 1); syncLock(); }
  function trapTab(e, box) {
    const list = focusables(box);
    if (!list.length) { e.preventDefault(); box.focus(); return; }
    const first = list[0]; const last = list[list.length - 1]; const a = doc.activeElement;
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
    if (el.kwLayer) return el.kwLayer;
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
        el.hidden = false;
        el.classList.remove('is-closing');
        void el.offsetWidth;
        el.classList.add('is-open');
        api.isOpen = true;
        if (api.trigger && api.trigger.hasAttribute && api.trigger.hasAttribute('aria-expanded')) api.trigger.setAttribute('aria-expanded', 'true');
        pushLayer(api);
        const f = $('[data-autofocus]', el) || focusables(box)[0] || box;
        f.focus({ preventScroll: true });
      },
      close(restore = true) {
        if (!api.isOpen) return;
        api.isOpen = false;
        el.classList.remove('is-open');
        dropLayer(api);
        const finish = () => { if (!api.isOpen) { el.hidden = true; el.classList.remove('is-closing'); } };
        if (reduced()) finish();
        else if (isDrawer) timer = setTimeout(finish, 240);
        else { el.classList.add('is-closing'); timer = setTimeout(finish, 120); }
        if (api.trigger && api.trigger.hasAttribute && api.trigger.hasAttribute('aria-expanded')) api.trigger.setAttribute('aria-expanded', 'false');
        if (restore && api.trigger && doc.contains(api.trigger)) api.trigger.focus({ preventScroll: true });
      },
    };
    el.kwLayer = api;
    return api;
  }

  /* ---- 편집장 호출 (⌘K) ------------------------------------------------- */
  function commandApi(el) {
    if (el.kwLayer) return el.kwLayer;
    const box = $('.cmdk__panel', el);
    const input = $('.cmdk__input', el);
    const list = $('.cmdk__list', el);
    const empty = $('.cmdk__empty', el);
    box.setAttribute('tabindex', '-1');
    ensureId(list, 'cmdk-list');
    input.setAttribute('role', 'combobox');
    input.setAttribute('aria-controls', list.id);
    input.setAttribute('aria-expanded', 'true');
    input.setAttribute('aria-autocomplete', 'list');
    const items = () => $$('.cmdk__item', list);
    items().forEach((it) => { it.setAttribute('role', 'option'); ensureId(it, 'cmdk-opt'); });
    const visible = () => items().filter((it) => !it.hidden && it.getAttribute('aria-disabled') !== 'true');
    let active = null;
    function setActive(it) {
      items().forEach((x) => x.setAttribute('aria-selected', 'false'));
      active = it || null;
      if (active) {
        active.setAttribute('aria-selected', 'true');
        input.setAttribute('aria-activedescendant', active.id);
        active.scrollIntoView({ block: 'nearest' });
      } else input.removeAttribute('aria-activedescendant');
    }
    function filter(q) {
      const term = q.trim().toLowerCase();
      items().forEach((it) => {
        const hay = `${it.getAttribute('data-keywords') || ''} ${it.textContent}`.toLowerCase();
        it.hidden = term !== '' && !hay.includes(term);
      });
      $$('.cmdk__group', list).forEach((g) => {
        let n = g.nextElementSibling; let any = false;
        while (n && !n.classList.contains('cmdk__group')) { if (!n.hidden) any = true; n = n.nextElementSibling; }
        g.hidden = !any;
      });
      const v = visible();
      if (empty) empty.hidden = v.length > 0;
      setActive(v[0]);
    }
    function run(it) {
      if (!it || it.getAttribute('aria-disabled') === 'true') return;
      const href = it.getAttribute('data-href');
      const action = it.getAttribute('data-action');
      api.close(!href);
      if (action === 'theme') setTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
      else if (action === 'toast') toast({ who: it.getAttribute('data-toast-who') || '편집장 홍마루', text: it.getAttribute('data-toast') || it.textContent.trim(), sfx: it.getAttribute('data-sfx') || '띵!' });
      else if (action && byId(action)) openById(action);
      if (href) window.location.href = href;
    }
    input.addEventListener('input', () => filter(input.value));
    input.addEventListener('keydown', (e) => {
      const v = visible(); const i = v.indexOf(active);
      if (!v.length) return;
      if (e.key === 'ArrowDown') { e.preventDefault(); setActive(v[(i + 1) % v.length]); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(v[(i - 1 + v.length) % v.length]); }
      else if (e.key === 'Enter') { e.preventDefault(); run(active); }
    });
    list.addEventListener('mousemove', (e) => { const it = e.target.closest('.cmdk__item'); if (it && it !== active && !it.hidden) setActive(it); });
    list.addEventListener('click', (e) => run(e.target.closest('.cmdk__item')));
    const api = {
      el, box, lock: true, trap: true, trigger: null, isOpen: false,
      open(trigger) {
        if (api.isOpen) return;
        api.trigger = trigger || doc.activeElement;
        el.hidden = false;
        void el.offsetWidth;
        el.classList.add('is-open');
        api.isOpen = true;
        pushLayer(api);
        input.value = '';
        filter('');
        input.focus({ preventScroll: true });
        if (trigger && trigger.hasAttribute && trigger.hasAttribute('aria-expanded')) trigger.setAttribute('aria-expanded', 'true');
      },
      close(restore = true) {
        if (!api.isOpen) return;
        api.isOpen = false;
        el.classList.remove('is-open');
        el.hidden = true;
        dropLayer(api);
        if (api.trigger && api.trigger.hasAttribute && api.trigger.hasAttribute('aria-expanded')) api.trigger.setAttribute('aria-expanded', 'false');
        if (restore && api.trigger && doc.contains(api.trigger)) api.trigger.focus({ preventScroll: true });
      },
    };
    el.kwLayer = api;
    return api;
  }
  // 정적 견본(.cmdk--static)도 화살표 · 필터가 동작하도록 묶는다 (레이어 스택에는 넣지 않음)
  $$('.cmdk--static').forEach((el) => {
    const input = $('.cmdk__input', el);
    const list = $('.cmdk__list', el);
    if (!input || !list) return;
    const items = () => $$('.cmdk__item', list);
    items().forEach((it) => { it.setAttribute('role', 'option'); ensureId(it, 'cmdk-opt'); });
    ensureId(list, 'cmdk-list');
    input.setAttribute('role', 'combobox');
    input.setAttribute('aria-controls', list.id);
    input.setAttribute('aria-expanded', 'true');
    input.addEventListener('input', () => {
      const term = input.value.trim().toLowerCase();
      items().forEach((it) => { it.hidden = term !== '' && !`${it.getAttribute('data-keywords') || ''} ${it.textContent}`.toLowerCase().includes(term); });
      const first = items().find((it) => !it.hidden);
      items().forEach((it) => it.setAttribute('aria-selected', String(it === first)));
    });
    input.addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
      e.preventDefault();
      const v = items().filter((it) => !it.hidden);
      const i = v.findIndex((it) => it.getAttribute('aria-selected') === 'true');
      const n = v[(i + (e.key === 'ArrowDown' ? 1 : -1) + v.length) % v.length];
      v.forEach((it) => it.setAttribute('aria-selected', String(it === n)));
      if (n) input.setAttribute('aria-activedescendant', n.id);
    });
  });

  function openById(id, trigger) {
    const el = byId(id);
    if (!el) return null;
    const api = el.classList.contains('cmdk') ? commandApi(el) : dialogApi(el);
    api.open(trigger);
    return api;
  }
  function closeById(id) { const el = byId(id); if (el && el.kwLayer) el.kwLayer.close(true); }

  doc.addEventListener('click', (e) => {
    const opener = e.target.closest('[data-open]');
    if (opener) { e.preventDefault(); openById(opener.getAttribute('data-open'), opener); return; }
    const cmd = e.target.closest('[data-command-open]');
    if (cmd) {
      e.preventDefault();
      const el = byId(cmd.getAttribute('data-command-open')) || $('.cmdk:not(.cmdk--static)');
      if (el) commandApi(el).open(cmd);
      return;
    }
    const closer = e.target.closest('[data-close]');
    if (closer) {
      const host = closer.closest('.modal, .drawer, .cmdk, .popover');
      if (host && host.kwLayer) { e.preventDefault(); host.kwLayer.close(true); }
    }
  });
  doc.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
      const el = $('.cmdk:not(.cmdk--static)');
      if (!el) return;
      e.preventDefault();
      const api = commandApi(el);
      if (api.isOpen) api.close(true); else api.open();
    }
  });

  /* ---- 팝오버 · 메뉴 (트랩 없음, 바깥 클릭 · Esc 닫기) -------------------- */
  const menuItems = (menu) => $$('.menu__item', menu).filter((n) => n.getAttribute('aria-disabled') !== 'true' && !n.disabled);
  function floatApi(panel, trigger, type) {
    if (panel.kwLayer) { panel.kwLayer.trigger = trigger; return panel.kwLayer; }
    const api = {
      el: panel, box: panel, lock: false, trap: false, trigger, isOpen: false,
      open(focusFirst) {
        if (api.isOpen) return;
        layers.filter((l) => !l.trap && l !== api).forEach((l) => l.close(false));
        panel.hidden = false;
        panel.classList.add('is-open');
        api.isOpen = true;
        api.trigger.setAttribute('aria-expanded', 'true');
        if (type === 'popover') {
          panel.classList.remove('popover--end', 'balloon--tail-tr');
          panel.classList.add('balloon--tail-t');
          const r = panel.getBoundingClientRect();
          if (r.right > window.innerWidth - 8) { panel.classList.add('popover--end', 'balloon--tail-tr'); panel.classList.remove('balloon--tail-t'); }
        } else {
          const host = panel.closest('.menu');
          if (host) {
            host.classList.remove('menu--end');
            const r = panel.getBoundingClientRect();
            if (r.right > window.innerWidth - 8) host.classList.add('menu--end');
          }
        }
        pushLayer(api);
        if (type === 'menu') { const it = menuItems(panel); if (focusFirst && it[0]) it[0].focus(); }
        else if (focusFirst) { const f = focusables(panel)[0]; if (f) f.focus(); else { panel.setAttribute('tabindex', '-1'); panel.focus(); } }
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
    panel.kwLayer = api;
    return api;
  }
  doc.addEventListener('click', (e) => {
    const pt = e.target.closest('[data-popover]');
    if (pt) {
      const panel = byId(pt.getAttribute('data-popover'));
      if (!panel) return;
      e.preventDefault();
      const api = floatApi(panel, pt, 'popover');
      if (api.isOpen) api.close(true); else api.open(e.detail === 0);
      return;
    }
    const mt = e.target.closest('[data-menu]');
    if (mt) {
      const panel = byId(mt.getAttribute('data-menu'));
      if (!panel) return;
      e.preventDefault();
      const api = floatApi(panel, mt, 'menu');
      if (api.isOpen) api.close(true); else api.open(e.detail === 0);
      return;
    }
    const mi = e.target.closest('.menu__list .menu__item');
    if (mi && mi.getAttribute('aria-disabled') !== 'true') {
      const role = mi.getAttribute('role');
      if (role === 'menuitemcheckbox') mi.setAttribute('aria-checked', String(mi.getAttribute('aria-checked') !== 'true'));
      if (role === 'menuitemradio') $$('[role="menuitemradio"]', mi.closest('.menu__list')).forEach((r) => r.setAttribute('aria-checked', String(r === mi)));
      const list = mi.closest('.menu__list');
      if (list.kwLayer && !mi.hasAttribute('data-keep-open')) list.kwLayer.close(true);
    }
  });
  doc.addEventListener('keydown', (e) => {
    const mt = e.target.closest && e.target.closest('[data-menu]');
    if (mt && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      const panel = byId(mt.getAttribute('data-menu'));
      if (!panel) return;
      e.preventDefault();
      const api = floatApi(panel, mt, 'menu');
      api.open(true);
      const it = menuItems(panel);
      if (e.key === 'ArrowUp' && it.length) it[it.length - 1].focus();
      return;
    }
    const list = e.target.closest && e.target.closest('.menu__list');
    if (!list) return;
    const it = menuItems(list);
    if (!it.length) return;
    const i = it.indexOf(doc.activeElement);
    if (e.key === 'ArrowDown') { e.preventDefault(); it[(i + 1) % it.length].focus(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); it[(i - 1 + it.length) % it.length].focus(); }
    else if (e.key === 'Home') { e.preventDefault(); it[0].focus(); }
    else if (e.key === 'End') { e.preventDefault(); it[it.length - 1].focus(); }
    else if (e.key === 'Tab' && list.kwLayer) list.kwLayer.close(false);
  });

  /* ---- 툴팁: Esc로 숨김 ------------------------------------------------- */
  doc.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    const tip = doc.activeElement && doc.activeElement.closest && doc.activeElement.closest('.tip');
    $$('.tip:hover').concat(tip ? [tip] : []).forEach((t) => t.classList.add('is-dismissed'));
  });
  ['mouseleave', 'focusout'].forEach((ev) => doc.addEventListener(ev, (e) => {
    const t = e.target.closest && e.target.closest('.tip');
    if (t) t.classList.remove('is-dismissed');
  }, true));

  /* ------------------------------------------------------------------------
     4. 탭 — 자동 활성 · ←→ Home End · 컷 전환 + 집중선 플래시
     ------------------------------------------------------------------------ */
  function initTabs(box) {
    const list = $('[role="tablist"]', box);
    if (!list) return;
    const tabs = $$('[role="tab"]', list);
    const vertical = list.getAttribute('aria-orientation') === 'vertical';
    function select(tab, focus) {
      tabs.forEach((t) => {
        const on = t === tab;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        const p = byId(t.getAttribute('aria-controls'));
        if (!p) return;
        p.hidden = !on;
        if (on && !reduced()) { p.classList.remove('is-entering'); void p.offsetWidth; p.classList.add('is-entering'); }
      });
      if (focus) tab.focus();
      tab.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    }
    tabs.forEach((t) => {
      const p = byId(t.getAttribute('aria-controls'));
      if (p) { p.setAttribute('role', 'tabpanel'); p.setAttribute('aria-labelledby', ensureId(t, 'tab')); if (!p.hasAttribute('tabindex')) p.tabIndex = 0; p.addEventListener('animationend', () => p.classList.remove('is-entering')); }
      t.tabIndex = t.getAttribute('aria-selected') === 'true' ? 0 : -1;
    });
    list.addEventListener('click', (e) => { const t = e.target.closest('[role="tab"]'); if (t && !t.disabled && t.getAttribute('aria-disabled') !== 'true') select(t, false); });
    list.addEventListener('keydown', (e) => {
      const enabled = tabs.filter((t) => !t.disabled && t.getAttribute('aria-disabled') !== 'true');
      const i = enabled.indexOf(doc.activeElement);
      if (i < 0) return;
      const next = vertical ? 'ArrowDown' : 'ArrowRight';
      const prev = vertical ? 'ArrowUp' : 'ArrowLeft';
      let n = null;
      if (e.key === next || e.key === 'ArrowRight' || e.key === 'ArrowDown') n = enabled[(i + 1) % enabled.length];
      else if (e.key === prev || e.key === 'ArrowLeft' || e.key === 'ArrowUp') n = enabled[(i - 1 + enabled.length) % enabled.length];
      else if (e.key === 'Home') n = enabled[0];
      else if (e.key === 'End') n = enabled[enabled.length - 1];
      if (n) { e.preventDefault(); select(n, true); }
    });
  }
  $$('[data-tabs]').forEach(initTabs);

  /* 가로 스크롤 힌트: 넘치면 .is-overflow, 끝에 닿으면 .is-end */
  function initScrollHint(bar) {
    const sc = $('.tabs__list', bar) || $('[data-scroll]', bar) || bar.firstElementChild;
    if (!sc) return;
    const update = () => {
      bar.classList.toggle('is-overflow', sc.scrollWidth > sc.clientWidth + 2);
      bar.classList.toggle('is-end', sc.scrollLeft + sc.clientWidth >= sc.scrollWidth - 2);
    };
    sc.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  }
  $$('.tabs__bar, [data-scroll-hint]').forEach(initScrollHint);

  /* ------------------------------------------------------------------------
     5. 아코디언 — data-accordion="single"이면 하나만 열림
     ------------------------------------------------------------------------ */
  $$('[data-accordion]').forEach((acc) => {
    const single = acc.getAttribute('data-accordion') === 'single';
    const heads = $$('.acc__head', acc);
    heads.forEach((h) => {
      const p = byId(h.getAttribute('aria-controls'));
      if (p) { p.setAttribute('role', 'region'); p.setAttribute('aria-labelledby', ensureId(h, 'acc')); p.hidden = h.getAttribute('aria-expanded') !== 'true'; }
    });
    const setOpen = (h, open) => {
      const p = byId(h.getAttribute('aria-controls'));
      h.setAttribute('aria-expanded', String(open));
      if (!p) return;
      p.hidden = !open;
      if (open && !reduced()) { p.classList.remove('is-opening'); void p.offsetWidth; p.classList.add('is-opening'); }
    };
    acc.addEventListener('click', (e) => {
      const h = e.target.closest('.acc__head');
      if (!h || h.disabled) return;
      const open = h.getAttribute('aria-expanded') !== 'true';
      if (single && open) heads.forEach((o) => { if (o !== h) setOpen(o, false); });
      setOpen(h, open);
    });
    acc.addEventListener('animationend', (e) => e.target.classList.remove('is-opening'));
  });

  /* ------------------------------------------------------------------------
     6. 토스트 — 오른쪽 아래 대사 풍선 + 효과음, 3.6초 후 쏙
     ------------------------------------------------------------------------ */
  function region() {
    let r = $('.toasts:not(.toasts--static)');
    if (!r) {
      r = doc.createElement('div');
      r.className = 'toasts';
      r.setAttribute('aria-live', 'polite');
      r.setAttribute('aria-atomic', 'false');
      doc.body.appendChild(r);
    }
    return r;
  }
  function toast(opts = {}) {
    const o = typeof opts === 'string' ? { text: opts } : opts;
    const r = region();
    const t = doc.createElement('div');
    t.className = `toast balloon balloon--tail-br${o.tone ? ` toast--${o.tone}` : ''}`;
    t.setAttribute('role', o.tone === 'error' ? 'alert' : 'status');
    if (o.who) { const w = doc.createElement('span'); w.className = 'toast__who'; w.textContent = o.who; t.appendChild(w); }
    const p = doc.createElement('p'); p.className = 'toast__text'; p.textContent = o.text || ''; t.appendChild(p);
    const c = doc.createElement('button');
    c.type = 'button'; c.className = 'toast__close'; c.setAttribute('aria-label', '닫기');
    c.innerHTML = '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';
    t.appendChild(c);
    if (o.sfx && !reduced()) {
      const s = doc.createElement('span');
      s.className = `toast__sfx sfx sfx--sm${o.tone === 'error' ? ' sfx--red' : ''}`;
      s.setAttribute('aria-hidden', 'true');
      s.textContent = o.sfx;
      t.appendChild(s);
    }
    r.appendChild(t);
    const all = $$('.toast', r);
    if (all.length > 3) all[0].remove();
    let gone = false;
    const leave = () => {
      if (gone) return; gone = true;
      if (reduced()) { t.remove(); return; }
      t.classList.add('is-leaving');
      setTimeout(() => t.remove(), 130);
    };
    c.addEventListener('click', leave);
    let timer = setTimeout(leave, o.timeout || 3600);
    t.addEventListener('mouseenter', () => clearTimeout(timer));
    t.addEventListener('mouseleave', () => { timer = setTimeout(leave, 1800); });
    t.addEventListener('focusin', () => clearTimeout(timer));
    return t;
  }
  doc.addEventListener('click', (e) => {
    const b = e.target.closest('[data-toast]');
    if (!b || b.disabled) return;
    toast({
      text: b.getAttribute('data-toast'),
      who: b.getAttribute('data-toast-who') || '',
      sfx: b.getAttribute('data-toast-sfx') || '',
      tone: b.getAttribute('data-toast-tone') || '',
    });
  });

  /* ------------------------------------------------------------------------
     7. 캐러셀 — 컷 넘김 steps(3) + 집중선 플래시, 쪽 번호
     ------------------------------------------------------------------------ */
  $$('[data-carousel]').forEach((car) => {
    const track = $('.carousel__track', car);
    const slides = $$('.carousel__slide', car);
    const prev = $('[data-carousel-prev]', car);
    const next = $('[data-carousel-next]', car);
    const cur = $('[data-carousel-current]', car);
    const total = $('[data-carousel-total]', car);
    const dots = $$('.carousel__dot', car);
    const viewport = $('.carousel__viewport', car);
    const live = $('[data-carousel-live]', car);
    let i = Math.max(0, slides.findIndex((s) => s.classList.contains('is-current')));
    if (total) total.textContent = String(slides.length);
    slides.forEach((s, n) => { s.setAttribute('role', 'group'); s.setAttribute('aria-roledescription', '컷'); s.setAttribute('aria-label', `${n + 1} / ${slides.length}`); });
    function go(n, flash = true) {
      i = (n + slides.length) % slides.length;
      track.style.transform = `translateX(${-100 * i}%)`;
      slides.forEach((s, k) => { s.setAttribute('aria-hidden', String(k !== i)); s.inert = k !== i; s.classList.toggle('is-current', k === i); });
      dots.forEach((d, k) => d.setAttribute('aria-current', String(k === i)));
      if (cur) cur.textContent = String(i + 1);
      if (live) live.textContent = `${i + 1}쪽 / ${slides.length}쪽`;
      if (car.hasAttribute('data-carousel-loop') === false) {
        if (prev) prev.disabled = i === 0;
        if (next) next.disabled = i === slides.length - 1;
      }
      if (flash && !reduced()) { car.classList.remove('is-flipping'); void car.offsetWidth; car.classList.add('is-flipping'); }
    }
    if (prev) prev.addEventListener('click', () => go(i - 1));
    if (next) next.addEventListener('click', () => go(i + 1));
    dots.forEach((d, k) => d.addEventListener('click', () => go(k)));
    if (viewport) {
      viewport.tabIndex = 0;
      viewport.setAttribute('aria-label', car.getAttribute('aria-label') || '컷 넘기기');
      viewport.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') { e.preventDefault(); if (i < slides.length - 1 || car.hasAttribute('data-carousel-loop')) go(i + 1); }
        if (e.key === 'ArrowLeft') { e.preventDefault(); if (i > 0 || car.hasAttribute('data-carousel-loop')) go(i - 1); }
      });
      let sx = null;
      viewport.addEventListener('pointerdown', (e) => { sx = e.clientX; });
      viewport.addEventListener('pointerup', (e) => {
        if (sx === null) return;
        const dx = e.clientX - sx; sx = null;
        if (Math.abs(dx) > 40) go(i + (dx < 0 ? 1 : -1));
      });
    }
    car.addEventListener('animationend', () => car.classList.remove('is-flipping'));
    go(i, false);
  });

  /* ------------------------------------------------------------------------
     8. 표 — 정렬(aria-sort) · 행 선택(aria-selected + 6px 빨강 띠)
     ------------------------------------------------------------------------ */
  $$('table[data-sortable]').forEach((table) => {
    const tbody = table.tBodies[0];
    $$('thead th', table).forEach((th, col) => {
      const btn = $('.tbl__sort', th);
      if (!btn) return;
      if (!th.hasAttribute('aria-sort')) th.setAttribute('aria-sort', 'none');
      btn.addEventListener('click', () => {
        const dir = th.getAttribute('aria-sort') === 'ascending' ? 'descending' : 'ascending';
        $$('thead th', table).forEach((o) => { if (o !== th && o.hasAttribute('aria-sort')) o.setAttribute('aria-sort', 'none'); });
        th.setAttribute('aria-sort', dir);
        const val = (tr) => {
          const cell = tr.children[col];
          if (!cell) return '';
          const raw = cell.getAttribute('data-sort') ?? cell.textContent.trim();
          const num = parseFloat(String(raw).replace(/[₩,쪽통권부%\s]/g, ''));
          return Number.isFinite(num) && /^[₩\d.,\s쪽통권부%-]+$/.test(String(raw)) ? num : String(raw);
        };
        const rows = Array.from(tbody.rows);
        rows.sort((a, b) => {
          const x = val(a); const y = val(b);
          const c = typeof x === 'number' && typeof y === 'number' ? x - y : String(x).localeCompare(String(y), 'ko');
          return dir === 'ascending' ? c : -c;
        });
        rows.forEach((r) => tbody.appendChild(r));
        const live = $('[data-sort-live]', table.closest('.tbl-cut') || doc);
        if (live) live.textContent = `${btn.textContent.trim()} ${dir === 'ascending' ? '오름차순' : '내림차순'} 정렬`;
      });
    });
  });
  $$('table').forEach((table) => {
    const all = $('[data-select-all]', table);
    const rows = $$('[data-select-row]', table);
    if (!rows.length) return;
    const out = $('[data-select-count]', table.closest('.tbl-cut') || doc);
    const sync = () => {
      const n = rows.filter((r) => r.checked).length;
      rows.forEach((r) => r.closest('tr').setAttribute('aria-selected', String(r.checked)));
      if (all) { all.checked = n === rows.length; all.indeterminate = n > 0 && n < rows.length; }
      if (out) out.textContent = n ? `${n}편 선택` : '선택 없음';
    };
    rows.forEach((r) => r.addEventListener('change', sync));
    if (all) all.addEventListener('change', () => { rows.forEach((r) => { r.checked = all.checked; }); sync(); });
    sync();
  });

  /* ------------------------------------------------------------------------
     9. 달력 — 날짜 컷 선택(aria-pressed) · 화살표 이동 · 일정 출력
     ------------------------------------------------------------------------ */
  $$('[data-calendar]').forEach((cal) => {
    const days = $$('.cal__day:not(.is-out):not(:disabled)', cal);
    const out = $('[data-cal-output]', cal) || byId(cal.getAttribute('data-cal-output-id'));
    let current = days.find((d) => d.getAttribute('aria-pressed') === 'true') || days.find((d) => d.getAttribute('aria-current') === 'date') || days[0];
    days.forEach((d) => { d.tabIndex = d === current ? 0 : -1; if (!d.hasAttribute('aria-pressed')) d.setAttribute('aria-pressed', 'false'); });
    const pickDay = (d, focus) => {
      days.forEach((x) => { x.setAttribute('aria-pressed', String(x === d)); x.tabIndex = x === d ? 0 : -1; });
      current = d;
      if (focus) d.focus();
      if (out) {
        const evs = $$('.cal__ev', d).map((e) => e.getAttribute('data-full') || e.textContent.trim()).filter(Boolean);
        out.textContent = `${d.getAttribute('data-date') || d.querySelector('.cal__num').textContent} — ${evs.length ? evs.join(' · ') : '잡힌 일정 없음'}`;
      }
    };
    cal.addEventListener('click', (e) => { const d = e.target.closest('.cal__day'); if (d && days.includes(d)) pickDay(d, false); });
    cal.addEventListener('keydown', (e) => {
      const i = days.indexOf(doc.activeElement);
      if (i < 0) return;
      const step = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: 7, ArrowUp: -7 }[e.key];
      if (step) { e.preventDefault(); const n = days[Math.min(Math.max(i + step, 0), days.length - 1)]; n.tabIndex = 0; doc.activeElement.tabIndex = -1; n.focus(); }
      else if (e.key === 'Home') { e.preventDefault(); days[0].focus(); }
      else if (e.key === 'End') { e.preventDefault(); days[days.length - 1].focus(); }
      else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pickDay(days[i], true); }
    });
  });

  /* ------------------------------------------------------------------------
     10. 칸반 — 드래그 놓기 「툭!」 · 카드 메뉴 앞/다음 공정 · 매수 갱신
     ------------------------------------------------------------------------ */
  $$('[data-kanban]').forEach((board) => {
    const cols = $$('.kanban__col', board);
    let live = $('[data-kanban-live]', board);
    if (!live) { live = doc.createElement('p'); live.className = 'vh'; live.setAttribute('aria-live', 'polite'); live.setAttribute('data-kanban-live', ''); board.appendChild(live); }
    const listOf = (col) => $('.kanban__list', col);
    const stageName = (col) => col.getAttribute('data-stage') || ($('.kanban__head .caption', col) || col).textContent.trim();
    function refresh() {
      cols.forEach((col) => {
        const n = $$('.kanban__card', col).length;
        const c = $('.kanban__count', col);
        if (c) c.textContent = String(n);
        const empty = $('.kanban__empty', col);
        if (empty) empty.hidden = n > 0;
      });
    }
    function move(card, col, announce = true) {
      const list = listOf(col);
      if (!list || card.closest('.kanban__col') === col) return;
      const empty = $('.kanban__empty', list);
      if (empty) list.insertBefore(card, empty); else list.appendChild(card);
      refresh();
      if (!reduced()) { card.classList.remove('is-dropped'); void card.offsetWidth; card.classList.add('is-dropped'); }
      sfx(card, '툭!');
      if (announce) {
        const id = ($('.kanban__id', card) || card).textContent.trim();
        live.textContent = `${id} 원고를 ${stageName(col)} 공정으로 옮겼습니다.`;
      }
      board.dispatchEvent(new CustomEvent('kw:kanban-move', { bubbles: true, detail: { card, col } }));
    }
    let dragging = null;
    $$('.kanban__card', board).forEach((card) => { card.setAttribute('draggable', 'true'); if (!card.hasAttribute('tabindex')) card.tabIndex = 0; });
    board.addEventListener('dragstart', (e) => {
      const card = e.target.closest('.kanban__card');
      if (!card) return;
      dragging = card;
      card.classList.add('is-dragging');
      e.dataTransfer.effectAllowed = 'move';
      try { e.dataTransfer.setData('text/plain', card.id || 'card'); } catch (err) { /* 일부 브라우저 */ }
    });
    board.addEventListener('dragend', () => { if (dragging) dragging.classList.remove('is-dragging'); dragging = null; cols.forEach((c) => c.classList.remove('is-over')); });
    cols.forEach((col) => {
      col.addEventListener('dragover', (e) => { if (!dragging) return; e.preventDefault(); col.classList.add('is-over'); });
      col.addEventListener('dragleave', (e) => { if (!col.contains(e.relatedTarget)) col.classList.remove('is-over'); });
      col.addEventListener('drop', (e) => { e.preventDefault(); col.classList.remove('is-over'); if (dragging) move(dragging, col); });
    });
    board.addEventListener('click', (e) => {
      const b = e.target.closest('[data-move]');
      if (!b) return;
      const card = b.closest('.kanban__card') || byId(b.getAttribute('data-card'));
      if (!card) return;
      const i = cols.indexOf(card.closest('.kanban__col'));
      const to = cols[i + (b.getAttribute('data-move') === 'next' ? 1 : -1)];
      if (to) { move(card, to); setTimeout(() => card.focus({ preventScroll: false }), 0); }
    });
    refresh();
  });

  /* ------------------------------------------------------------------------
     11. 폼 검증 — 필드 아래 외침 풍선 · 오류 요약 · 성공 「착!」 토스트
     ------------------------------------------------------------------------ */
  const MSG = {
    valueMissing: (f) => `${f}을(를) 적어 주세요.`,
    typeMismatch: () => '형식이 맞지 않아요. 예: dokja@kwang.kr',
    patternMismatch: (f, el) => el.getAttribute('data-pattern-msg') || `${f} 형식을 확인해 주세요.`,
    tooShort: (f, el) => `${el.minLength}자 이상 적어 주세요.`,
    rangeUnderflow: (f, el) => `${el.min} 이상이어야 해요.`,
    rangeOverflow: (f, el) => `${el.max} 이하여야 해요.`,
  };
  const fieldName = (el) => {
    const l = el.id && $(`label[for="${el.id}"]`);
    return el.getAttribute('data-name') || (l ? l.textContent.replace('*', '').trim() : '이 칸');
  };
  function checkField(el) {
    const field = el.closest('.field') || el.parentElement;
    let err = $('.field__error', field);
    if (!err) { err = doc.createElement('p'); err.className = 'field__error'; err.hidden = true; field.appendChild(err); }
    ensureId(err, 'err');
    const v = el.validity;
    let msg = '';
    if (!v.valid) {
      const key = Object.keys(MSG).find((k) => v[k]);
      msg = el.getAttribute('data-msg') || (key ? MSG[key](fieldName(el), el) : '다시 확인해 주세요.');
    }
    if (msg) {
      el.setAttribute('aria-invalid', 'true');
      err.textContent = msg;
      err.hidden = false;
      const d = (el.getAttribute('aria-describedby') || '').split(' ').filter(Boolean);
      if (!d.includes(err.id)) el.setAttribute('aria-describedby', d.concat(err.id).join(' '));
    } else {
      el.removeAttribute('aria-invalid');
      err.hidden = true;
      err.textContent = '';
    }
    return !msg;
  }
  $$('form[data-validate]').forEach((form) => {
    form.noValidate = true;
    const controls = () => $$('input, select, textarea', form).filter((el) => el.willValidate && el.type !== 'hidden' && !el.closest('[hidden]'));
    form.addEventListener('blur', (e) => { if (form.classList.contains('was-checked') && e.target.matches('input, select, textarea')) checkField(e.target); }, true);
    form.addEventListener('input', (e) => { if (e.target.getAttribute('aria-invalid') === 'true') checkField(e.target); });
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      form.classList.add('was-checked');
      const bad = controls().filter((el) => !checkField(el));
      const sum = $('.form-errors', form);
      if (sum) {
        const ul = $('ul', sum) || sum.appendChild(doc.createElement('ul'));
        ul.innerHTML = '';
        bad.forEach((el) => {
          const li = doc.createElement('li');
          const a = doc.createElement('a');
          a.href = `#${ensureId(el, 'fld')}`;
          a.textContent = `${fieldName(el)}: ${$('.field__error', el.closest('.field') || el.parentElement).textContent}`;
          a.addEventListener('click', (ev) => { ev.preventDefault(); el.focus(); });
          li.appendChild(a);
          ul.appendChild(li);
        });
        sum.hidden = bad.length === 0;
      }
      const submit = $('[type="submit"]', form);
      if (bad.length) {
        sfx(submit || bad[0], '쾅!', { red: true });
        if (sum && !sum.hidden) { sum.tabIndex = -1; sum.focus(); } else bad[0].focus();
        return;
      }
      const done = () => {
        if (submit) submit.removeAttribute('aria-busy');
        toast({ who: form.getAttribute('data-success-who') || '쾅! 편집실', text: form.getAttribute('data-success') || '저장했어요.', sfx: form.getAttribute('data-success-sfx') || '착!', tone: 'success' });
        form.dispatchEvent(new CustomEvent('kw:submitted', { bubbles: true }));
      };
      if (submit && !reduced()) { submit.setAttribute('aria-busy', 'true'); setTimeout(done, 900); } else done();
    });
  });

  /* ------------------------------------------------------------------------
     12. 그 밖의 작은 동작
     ------------------------------------------------------------------------ */
  // 마퀴 정지/재생
  doc.addEventListener('click', (e) => {
    const b = e.target.closest('[data-marquee-toggle]');
    if (!b) return;
    const m = b.closest('.marquee');
    const paused = m.classList.toggle('is-paused');
    b.setAttribute('aria-pressed', String(paused));
    b.setAttribute('aria-label', paused ? '예고 띠 다시 흐르게' : '예고 띠 멈추기');
  });
  if (reduced()) $$('.marquee').forEach((m) => { m.classList.add('is-paused'); const b = $('[data-marquee-toggle]', m); if (b) { b.setAttribute('aria-pressed', 'true'); b.setAttribute('aria-label', '예고 띠 다시 흐르게'); } });

  // 복사
  doc.addEventListener('click', async (e) => {
    const b = e.target.closest('[data-copy]');
    if (!b) return;
    const ref = b.getAttribute('data-copy');
    const src = ref && byId(ref);
    const text = src ? src.textContent : ref;
    try { await navigator.clipboard.writeText(text); } catch (err) {
      const ta = doc.createElement('textarea'); ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
      doc.body.appendChild(ta); ta.select(); try { doc.execCommand('copy'); } catch (x) { /* 무시 */ } ta.remove();
    }
    const label = $('[data-copy-label]', b);
    const prev = label ? label.textContent : '';
    b.setAttribute('data-copied', 'true');
    if (label) label.textContent = '복사됨';
    sfx(b, '착!');
    setTimeout(() => { b.removeAttribute('data-copied'); if (label) label.textContent = prev; }, 1600);
  });

  // 로딩 시연: aria-busy 1.6초 → 토스트
  doc.addEventListener('click', (e) => {
    const b = e.target.closest('[data-loading-demo]');
    if (!b || b.getAttribute('aria-busy') === 'true' || b.disabled) return;
    b.setAttribute('aria-busy', 'true');
    setTimeout(() => {
      b.removeAttribute('aria-busy');
      const msg = b.getAttribute('data-loading-demo');
      if (msg) toast({ who: '쾅! 편집실', text: msg, sfx: '빠밤!', tone: 'success' });
    }, 1600);
  });

  // 스위치 (button[role=switch])
  doc.addEventListener('click', (e) => {
    const s = e.target.closest('button[role="switch"]');
    if (!s || s.disabled || s.getAttribute('aria-disabled') === 'true') return;
    s.setAttribute('aria-checked', String(s.getAttribute('aria-checked') !== 'true'));
  });

  // 알림 닫기 「휙!」
  doc.addEventListener('click', (e) => {
    const b = e.target.closest('[data-dismiss]');
    if (!b) return;
    const host = b.closest(b.getAttribute('data-dismiss') || '.alert');
    if (!host) return;
    sfx(b, '휙!');
    if (reduced()) { host.remove(); return; }
    host.classList.add('is-leaving');
    setTimeout(() => host.remove(), 130);
  });

  // 쪽 번호 (버튼형 시연)
  $$('[data-pager]').forEach((nav) => {
    const items = $$('.pager__item[data-page]', nav);
    const prev = $('[data-page-prev]', nav);
    const next = $('[data-page-next]', nav);
    const info = $('.pager__info', nav);
    const setPage = (n) => {
      items.forEach((it) => { if (Number(it.getAttribute('data-page')) === n) it.setAttribute('aria-current', 'page'); else it.removeAttribute('aria-current'); });
      const max = Math.max(...items.map((it) => Number(it.getAttribute('data-page'))));
      if (prev) prev.setAttribute('aria-disabled', String(n <= 1));
      if (next) next.setAttribute('aria-disabled', String(n >= max));
      nav.setAttribute('data-current', String(n));
      if (info && info.hasAttribute('data-template')) info.textContent = info.getAttribute('data-template').replace('{n}', n);
    };
    nav.addEventListener('click', (e) => {
      const it = e.target.closest('.pager__item');
      if (!it || it.getAttribute('aria-disabled') === 'true') return;
      if (it.tagName === 'A' && it.getAttribute('href') && !it.getAttribute('href').startsWith('#')) return;
      e.preventDefault();
      const cur = Number(nav.getAttribute('data-current') || 1);
      if (it.hasAttribute('data-page')) setPage(Number(it.getAttribute('data-page')));
      else if (it === prev) setPage(cur - 1);
      else if (it === next) setPage(cur + 1);
    });
    const start = items.find((it) => it.getAttribute('aria-current') === 'page');
    setPage(start ? Number(start.getAttribute('data-page')) : 1);
  });

  // 범위 입력 값 출력
  $$('input[type="range"][data-output]').forEach((r) => {
    const out = byId(r.getAttribute('data-output'));
    const unit = r.getAttribute('data-unit') || '';
    const upd = () => { if (out) out.textContent = `${r.value}${unit}`; r.style.setProperty('--val', `${((r.value - r.min) / (r.max - r.min)) * 100}%`); };
    r.addEventListener('input', upd);
    upd();
  });

  // 모션 시연
  doc.addEventListener('click', (e) => {
    const b = e.target.closest('[data-motion-run]');
    if (!b) return;
    const demo = byId(b.getAttribute('data-motion-run'));
    if (!demo) return;
    const lane = $('.motion-demo__lane', demo);
    if (lane) demo.style.setProperty('--lane-w', `${lane.clientWidth}px`);
    demo.classList.toggle('is-run');
  });

  /* ------------------------------------------------------------------------
     13. 컷 등장 — 읽는 순서대로 60ms 간격, steps(3), 한 번만
     ------------------------------------------------------------------------ */
  const revealables = $$('[data-reveal]');
  // 자동화 브라우저(스크린샷) · ?static 쿼리에서는 처음부터 최종 상태
  const staticView = navigator.webdriver || /[?&]static\b/.test(window.location.search);
  if (revealables.length && 'IntersectionObserver' in window && !reduced() && !staticView) {
    root.classList.add('js-reveal');
    const io = new IntersectionObserver((entries) => {
      const shown = entries.filter((en) => en.isIntersecting).map((en) => en.target);
      shown.forEach((el, n) => {
        el.style.setProperty('--reveal-delay', `${n * 60}ms`);
        el.classList.add('is-in');
        io.unobserve(el);
        // 전환이 끝나면 clip-path를 걷는다(.is-revealed) — 튀어나온 메뉴 · 팝오버가 잘리지 않게
        const done = () => el.classList.add('is-revealed');
        el.addEventListener('transitionend', (ev) => { if (ev.propertyName === 'clip-path') done(); }, { once: true });
        setTimeout(done, 240 + n * 60 + 200);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    revealables.forEach((el) => io.observe(el));
  }

  window.KW = { toast, sfx, setTheme, open: openById, close: closeById };
})();
