/* ==========================================================================
   금란좌 GEUMNAN-JWA · app.js — 바닐라 인터랙션 (외부 라이브러리 없음)
   마크업 계약은 COMPONENTS.md. 전역 API: window.gn
   ========================================================================== */
(() => {
  'use strict';

  const doc = document;
  const root = doc.documentElement;
  const $ = (s, c = doc) => c.querySelector(s);
  const $$ = (s, c = doc) => Array.from(c.querySelectorAll(s));
  const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const reflow = (el) => void el.offsetWidth;
  let uidN = 0;
  const uid = (p = 'gn') => `${p}-${++uidN}`;
  const ensureId = (el, p) => el.id || (el.id = uid(p));
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const emit = (el, name, detail) => el.dispatchEvent(new CustomEvent(name, { bubbles: true, detail }));
  const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]), summary';
  const focusables = (el) => $$(FOCUSABLE, el).filter((n) => !n.hidden && n.offsetParent !== null && !n.closest('[hidden]') && !n.closest('[inert]'));
  // 컨테이너 안에서만 스크롤한다(scrollIntoView는 문서 전체를 끌고 가므로 쓰지 않는다).
  const scrollInlineCenter = (el, list, smooth) => {
    if (!el || !list || list.scrollWidth <= list.clientWidth + 1) return;
    const left = list.scrollLeft + (el.getBoundingClientRect().left - list.getBoundingClientRect().left) - (list.clientWidth - el.offsetWidth) / 2;
    list.scrollTo({ left: Math.max(0, left), behavior: smooth && !reduced() ? 'smooth' : 'auto' });
  };
  const scrollBlockNearest = (el, box) => {
    if (!el || !box || box.scrollHeight <= box.clientHeight + 1) return;
    const top = box.scrollTop + (el.getBoundingClientRect().top - box.getBoundingClientRect().top), bot = top + el.offsetHeight;
    if (top < box.scrollTop) box.scrollTop = top;
    else if (bot > box.scrollTop + box.clientHeight) box.scrollTop = bot - box.clientHeight;
  };
  const IN_PAGES = /\/pages\//.test(location.pathname);
  const PAGE = IN_PAGES ? '' : 'pages/';
  const HOME = IN_PAGES ? '../' : '';
  root.classList.add('js');

  /* ── 1. 아이콘 — <span data-icon="search"></span> → 24 격자 1.5px 선(직선·45°·원호만) ── */
  const ICONS = {
    search: '<circle cx="10.5" cy="10.5" r="6"/><path d="m15 15 5.5 5.5"/>',
    close: '<path d="m5.5 5.5 13 13M18.5 5.5l-13 13"/>',
    'chevron-left': '<path d="M14.5 5.5 8 12l6.5 6.5"/>',
    'chevron-right': '<path d="M9.5 5.5 16 12l-6.5 6.5"/>',
    'chevron-down': '<path d="M5.5 9.5 12 16l6.5-6.5"/>',
    'chevron-up': '<path d="M5.5 14.5 12 8l6.5 6.5"/>',
    'arrow-right': '<path d="M4 12h15M13.5 6.5 19 12l-5.5 5.5"/>',
    'arrow-left': '<path d="M20 12H5M10.5 6.5 5 12l5.5 5.5"/>',
    'arrow-down': '<path d="M12 4v15M6.5 13.5 12 19l5.5-5.5"/>',
    check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    minus: '<path d="M5 12h14"/>',
    sun: '<circle cx="12" cy="12" r="3.5"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1"/>',
    moon: '<path d="M19.5 14.5A8 8 0 0 1 9.5 4.5a8 8 0 1 0 10 10Z"/><path d="M17 4.5v3M15.5 6h3"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    shield: '<path d="M12 3.5 14 5.5h3v2h2.5v6.5L12 20.5 4.5 14V7.5H7v-2h3Z"/><path d="M12 9v4M12 15.5v.5"/>',
    info: '<path d="M12 3 21 12l-9 9-9-9Z"/><path d="M12 11v5M12 8v.5"/>',
    warn: '<path d="M12 3.5 21 19.5H3Z"/><path d="M12 10v4.5M12 16.8v.5"/>',
    ticket: '<path d="M3.5 6.5h17v3.5a2 2 0 0 0 0 4v3.5h-17V14a2 2 0 0 0 0-4Z"/><path d="M9 7v1.5M9 11v2M9 15.5V17"/>',
    seat: '<path d="M6.5 11V5.5h11V11M5 11h14v4H5ZM6.5 15v4M17.5 15v4"/>',
    calendar: '<path d="M4 6h16v14H4ZM4 10h16M8 3.5v4M16 3.5v4"/><path d="M12 13.5 13.5 15 12 16.5 10.5 15Z"/>',
    clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7v5l3.5 2"/>',
    bell: '<path d="M6 16.5v-5a6 6 0 0 1 12 0v5l1.5 2h-15Z"/><path d="M10 20.5h4"/>',
    user: '<circle cx="12" cy="8.5" r="3.5"/><path d="M5 20a7 7 0 0 1 14 0"/>',
    telegram: '<path d="M3.5 6h17v12h-17Z"/><path d="m3.5 6.5 8.5 7 8.5-7"/>',
    grip: '<path d="M9 6h.01M15 6h.01M9 12h.01M15 12h.01M9 18h.01M15 18h.01" stroke-width="2.6"/>',
    more: '<path d="M6 12h.01M12 12h.01M18 12h.01" stroke-width="2.6"/>',
    copy: '<path d="M8.5 8.5h11v11h-11Z"/><path d="M15.5 8.5v-4h-11v11h4"/>',
    play: '<path d="M8 5.5v13l10-6.5Z"/>',
    pause: '<path d="M9 5.5v13M15 5.5v13"/>',
    replay: '<path d="M5 12a7 7 0 1 0 2-5"/><path d="M4.5 3.5v4h4"/>',
    external: '<path d="M13.5 4.5h6v6M19.5 4.5 11 13"/><path d="M17 14v5.5H4.5V7H10"/>',
    sliders: '<path d="M4 7h9M17 7h3M4 17h3M11 17h9"/><path d="M13 5h4v4h-4ZM7 15h4v4H7Z"/>',
    logout: '<path d="M10 4.5H4.5v15H10M15 8l4 4-4 4M9 12h10"/>',
    glass: '<path d="M4.5 4.5h15L12 12ZM12 12v7.5M8 19.5h8"/>',
    bed: '<path d="M3.5 18.5v-12M3.5 13h17v5.5M20.5 13v-2.5a2 2 0 0 0-2-2H10V13"/><path d="M6 11h2"/>',
    music: '<path d="M9 17.5V5.5l10-2v12"/><circle cx="7" cy="17.5" r="2"/><circle cx="17" cy="15.5" r="2"/>',
    stage: '<path d="M3.5 20.5V5h17v15.5M3.5 5l2.5 3.5h12L20.5 5"/><path d="M7 20.5v-8h10v8"/>',
    phone: '<path d="M7.5 3.5h9v17h-9ZM10.5 17.5h3"/>',
    pin: '<path d="M12 21s6.5-6.2 6.5-11a6.5 6.5 0 0 0-13 0c0 4.8 6.5 11 6.5 11Z"/><path d="M12 7.5 14 9.5l-2 2-2-2Z"/>',
    card: '<path d="M3.5 6h17v12h-17ZM3.5 10h17M7 14.5h4"/>',
    lock: '<path d="M5.5 10.5h13v10h-13ZM8.5 10.5V7a3.5 3.5 0 0 1 7 0v3.5"/>',
    edit: '<path d="M4.5 19.5 5 15.5 15.5 5l3.5 3.5L8.5 19Z"/><path d="M13 7.5 16.5 11"/>',
    trash: '<path d="M4.5 6.5h15M9.5 6.5v-2h5v2M6.5 6.5l1 13h9l1-13M10 10v6.5M14 10v6.5"/>',
    filter: '<path d="M4 5.5h16l-6 7.5v6l-4 1.5v-7.5Z"/>',
    download: '<path d="M12 4v11M7 10.5l5 5 5-5M4.5 19.5h15"/>',
    diamond: '<path d="M12 3 21 12l-9 9-9-9Z"/>',
    keyboard: '<path d="M3 6.5h18v11H3ZM6.5 10h1M10 10h1M13.5 10h1M17 10h1M7.5 14h9"/>'
  };
  function hydrateIcons(scope = doc) {
    $$('[data-icon]', scope).forEach((el) => {
      if (el.dataset.iconDone === el.dataset.icon) return;
      const d = ICONS[el.dataset.icon];
      if (!d) return;
      el.classList.add('icon');
      el.setAttribute('aria-hidden', 'true');
      el.innerHTML = `<svg viewBox="0 0 24 24" focusable="false">${d}</svg>`;
      el.dataset.iconDone = el.dataset.icon;
    });
  }
  function setIcon(el, name) { if (!el) return; el.dataset.icon = name; hydrateIcons(el.parentNode || doc); }

  /* ── 2. 조명(테마) — URL ?theme 최우선 → localStorage → 시스템 ───────── */
  const KEY = 'gn-theme';
  const qTheme = new URLSearchParams(location.search).get('theme');
  const store = { get() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }, set(v) { try { localStorage.setItem(KEY, v); } catch (e) { /* 무시 */ } } };
  function applyTheme(t, persist) {
    root.setAttribute('data-theme', t);
    if (persist) store.set(t);
    $$('[data-theme-toggle]').forEach((b) => {
      const dark = t === 'dark';
      b.setAttribute('aria-pressed', String(dark));
      b.setAttribute('aria-label', dark ? '마티네 조명(밝은 화면)으로 바꾸기' : '수와레 조명(어두운 화면)으로 바꾸기');
      const ic = $('[data-icon]', b);
      if (ic) setIcon(ic, dark ? 'sun' : 'moon');
      const lb = $('[data-theme-label]', b);
      if (lb) lb.textContent = dark ? '마티네' : '수와레';
    });
    emit(root, 'gn:theme', { theme: t });
  }
  function initTheme() {
    let t = qTheme === 'dark' || qTheme === 'light' ? qTheme : store.get();
    if (t !== 'dark' && t !== 'light') t = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    applyTheme(t, false);
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onSys = (e) => { if (!qTheme && !store.get()) applyTheme(e.matches ? 'dark' : 'light', false); };
    if (mq.addEventListener) mq.addEventListener('change', onSys);
  }
  function toggleTheme() { applyTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark', true); }

  /* ── 3. 오버레이 스택 (modal · drawer · command · sidebar · nav sheet) ─── */
  const stack = [];
  const top = () => stack[stack.length - 1];
  function lockScroll() { root.classList.toggle('is-locked', stack.some((s) => s.lock)); }
  function panelOf(el) { return $('.modal__panel, .drawer__panel, .cmd__panel', el) || el; }
  function raiseCurtain(panel) {
    if (reduced() || !panel) return;
    let c = $(':scope > .curtain', panel);
    if (!c) { c = doc.createElement('span'); c.className = 'curtain stair-clip'; c.setAttribute('aria-hidden', 'true'); panel.prepend(c); }
    c.classList.remove('is-raised');
    reflow(c);
    requestAnimationFrame(() => c.classList.add('is-raised'));
    const rays = $('.ray-head', panel);
    if (rays) { rays.classList.remove('is-turning'); reflow(rays); rays.classList.add('is-turning'); }
  }
  function openOverlay(el, trigger) {
    if (!el || stack.some((s) => s.el === el)) return;
    closeFloats();
    el.hidden = false;
    reflow(el);
    el.classList.add('is-open');
    const panel = panelOf(el);
    if (!el.classList.contains('cmd')) raiseCurtain(panel);
    stack.push({ el, trigger: trigger || doc.activeElement, lock: true, kind: 'overlay' });
    lockScroll();
    const auto = $('[autofocus]', panel) || $('.cmd__input', panel) || focusables(panel).find((n) => !n.matches('[data-close].modal__x, .modal__x')) || panel;
    if (auto === panel) panel.setAttribute('tabindex', '-1');
    setTimeout(() => auto.focus({ preventScroll: true }), 30);
    emit(el, 'gn:open', {});
  }
  function closeOverlay(el, restore = true) {
    const i = stack.findIndex((s) => s.el === el);
    if (i < 0) return;
    const [entry] = stack.splice(i, 1);
    el.classList.remove('is-open');
    const done = () => { if (!el.classList.contains('is-open')) el.hidden = true; };
    if (reduced()) done(); else setTimeout(done, 360);
    lockScroll();
    if (restore && entry.trigger && entry.trigger.focus) entry.trigger.focus({ preventScroll: true });
    emit(el, 'gn:close', {});
  }
  function trapTab(e, container) {
    const f = focusables(container);
    if (!f.length) { e.preventDefault(); return; }
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && (doc.activeElement === first || !container.contains(doc.activeElement))) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && (doc.activeElement === last || !container.contains(doc.activeElement))) { e.preventDefault(); first.focus(); }
  }

  /* 사이드바 오프캔버스 (≤1024px) */
  const sidebarMQ = window.matchMedia('(max-width: 1024px)');
  function openSidebar(sb, trigger) {
    if (!sb || sb.classList.contains('is-open')) return;
    sb.classList.add('is-open');
    stack.push({ el: sb, trigger, lock: true, kind: 'sidebar' });
    lockScroll();
    $$('[data-sidebar-toggle]').forEach((b) => b.setAttribute('aria-expanded', 'true'));
    const f = focusables(sb);
    setTimeout(() => (f[0] || sb).focus({ preventScroll: true }), 40);
  }
  function closeSidebar(sb, restore = true) {
    if (!sb) return;
    sb.classList.remove('is-open');
    const i = stack.findIndex((s) => s.el === sb);
    const entry = i >= 0 ? stack.splice(i, 1)[0] : null;
    lockScroll();
    $$('[data-sidebar-toggle]').forEach((b) => b.setAttribute('aria-expanded', 'false'));
    if (restore && entry && entry.trigger) entry.trigger.focus({ preventScroll: true });
  }
  function initSidebar() {
    $$('.sidebar').forEach((sb) => {
      if (sb.classList.contains('sidebar--static')) return;
      if (!sb.nextElementSibling || !sb.nextElementSibling.classList.contains('sidebar-scrim')) {
        const s = doc.createElement('div'); s.className = 'sidebar-scrim'; s.setAttribute('aria-hidden', 'true'); sb.after(s);
        s.addEventListener('click', () => closeSidebar(sb));
      }
    });
    const onMQ = () => { if (!sidebarMQ.matches) $$('.sidebar.is-open').forEach((sb) => closeSidebar(sb, false)); };
    if (sidebarMQ.addEventListener) sidebarMQ.addEventListener('change', onMQ);
  }

  /* 내비 시트 (≤860px) */
  function toggleNavSheet(btn, force) {
    const sheet = doc.getElementById(btn.getAttribute('aria-controls'));
    if (!sheet) return;
    const open = force !== undefined ? force : sheet.hidden;
    sheet.hidden = !open;
    btn.setAttribute('aria-expanded', String(open));
    btn.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
    const ic = $('[data-icon]', btn); if (ic) setIcon(ic, open ? 'close' : 'menu');
    if (open) { const f = focusables(sheet); if (f[0]) f[0].focus({ preventScroll: true }); }
  }

  /* ── 4. 메뉴 ──────────────────────────────────────────────────────────── */
  let openMenuEl = null;
  function menuItems(menu) { return $$('[role^="menuitem"]', menu).filter((i) => !i.disabled && i.getAttribute('aria-disabled') !== 'true'); }
  function openMenu(trigger, focusLast) {
    const menu = doc.getElementById(trigger.getAttribute('aria-controls'));
    if (!menu) return;
    closeFloats();
    menu.hidden = false;
    trigger.setAttribute('aria-expanded', 'true');
    openMenuEl = { menu, trigger };
    const items = menuItems(menu);
    const sel = items.find((i) => i.getAttribute('aria-checked') === 'true');
    (focusLast ? items[items.length - 1] : sel || items[0])?.focus();
  }
  function closeMenu(restore = true) {
    if (!openMenuEl) return;
    const { menu, trigger } = openMenuEl;
    menu.hidden = true;
    trigger.setAttribute('aria-expanded', 'false');
    openMenuEl = null;
    if (restore) trigger.focus({ preventScroll: true });
  }
  function initMenus(scope = doc) {
    $$('[aria-haspopup="menu"][aria-controls]', scope).forEach((t) => {
      if (t.dataset.gnMenu) return; t.dataset.gnMenu = '1';
      t.setAttribute('aria-expanded', 'false');
      const menu = doc.getElementById(t.getAttribute('aria-controls'));
      if (menu && !menu.classList.contains('is-static')) menu.hidden = true;
      t.addEventListener('click', (e) => { e.preventDefault(); openMenuEl && openMenuEl.trigger === t ? closeMenu() : openMenu(t); });
      t.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown') { e.preventDefault(); openMenu(t); }
        if (e.key === 'ArrowUp') { e.preventDefault(); openMenu(t, true); }
      });
    });
    $$('.menu', scope).forEach((menu) => {
      if (menu.dataset.gnMenuBody) return; menu.dataset.gnMenuBody = '1';
      menu.addEventListener('keydown', (e) => {
        const items = menuItems(menu);
        const i = items.indexOf(doc.activeElement);
        const go = (n) => { e.preventDefault(); items[(n + items.length) % items.length]?.focus(); };
        if (e.key === 'ArrowDown') go(i + 1);
        else if (e.key === 'ArrowUp') go(i - 1);
        else if (e.key === 'Home') go(0);
        else if (e.key === 'End') go(items.length - 1);
        else if (e.key === 'Tab') closeMenu(false);
        else if (e.key.length === 1 && /\S/.test(e.key)) {
          const n = items.findIndex((it, k) => k > i && it.textContent.trim().startsWith(e.key));
          if (n >= 0) go(n);
        }
      });
      menu.addEventListener('click', (e) => {
        const item = e.target.closest('[role^="menuitem"]');
        if (!item || item.disabled || item.getAttribute('aria-disabled') === 'true') return;
        if (item.getAttribute('role') === 'menuitemradio') {
          const group = item.closest('[role="group"]') || menu;
          $$('[role="menuitemradio"]', group).forEach((r) => r.setAttribute('aria-checked', String(r === item)));
        } else if (item.getAttribute('role') === 'menuitemcheckbox') {
          item.setAttribute('aria-checked', String(item.getAttribute('aria-checked') !== 'true'));
          return;
        }
        emit(menu, 'gn:menu', { item, value: item.dataset.value || item.textContent.trim() });
        if (!menu.classList.contains('is-static')) closeMenu();
      });
    });
  }

  /* ── 5. 팝오버 ─────────────────────────────────────────────────────────── */
  let openPop = null;
  function placePopover(pop) {
    pop.style.setProperty('--shift', '0px');
    const r = pop.getBoundingClientRect();
    const m = 12;
    let shift = 0;
    if (r.left < m) shift = m - r.left;
    else if (r.right > window.innerWidth - m) shift = window.innerWidth - m - r.right;
    pop.style.setProperty('--shift', `${Math.round(shift)}px`);
  }
  function togglePopover(trigger, force) {
    const pop = doc.getElementById(trigger.getAttribute('aria-controls'));
    if (!pop) return;
    const open = force !== undefined ? force : pop.hidden;
    if (open) {
      closeFloats();
      pop.hidden = false;
      trigger.setAttribute('aria-expanded', 'true');
      openPop = { pop, trigger };
      placePopover(pop);
      const f = focusables(pop); if (f[0] && trigger.dataset.popoverFocus !== 'none') setTimeout(() => f[0].focus({ preventScroll: true }), 20);
    } else {
      pop.hidden = true;
      trigger.setAttribute('aria-expanded', 'false');
      if (openPop && openPop.pop === pop) openPop = null;
    }
  }
  function closeFloats() {
    if (openMenuEl) closeMenu(false);
    if (openPop) togglePopover(openPop.trigger, false);
  }

  /* ── 6. 툴팁 ──────────────────────────────────────────────────────────── */
  let tipEl = null, tipFor = null, tipTimer = 0;
  function showTip(t) {
    clearTimeout(tipTimer);
    if (!tipEl) {
      tipEl = doc.createElement('div');
      tipEl.className = 'tooltip';
      tipEl.setAttribute('role', 'tooltip');
      tipEl.id = 'gn-tooltip';
      doc.body.appendChild(tipEl);
    }
    tipFor = t;
    tipEl.textContent = t.dataset.tip;
    const prev = t.getAttribute('aria-describedby') || '';
    if (!prev.split(' ').includes('gn-tooltip')) t.setAttribute('aria-describedby', (prev + ' gn-tooltip').trim());
    tipEl.classList.remove('is-shown');
    tipEl.style.left = '0px'; tipEl.style.top = '0px';
    const r = t.getBoundingClientRect();
    const tr = tipEl.getBoundingClientRect();
    let left = r.left + r.width / 2 - tr.width / 2;
    const min = 12, max = window.innerWidth - tr.width - 12;
    const clamped = Math.max(min, Math.min(max, left));
    tipEl.style.setProperty('--tip-shift', `${Math.round(left - clamped)}px`);
    let topY = r.top - tr.height - 12;
    let place = 'top';
    if (topY < 8) { topY = r.bottom + 12; place = 'bottom'; }
    tipEl.dataset.place = place;
    tipEl.style.left = `${Math.round(clamped)}px`;
    tipEl.style.top = `${Math.round(topY)}px`;
    requestAnimationFrame(() => tipEl.classList.add('is-shown'));
  }
  function hideTip() {
    clearTimeout(tipTimer);
    if (!tipEl || !tipFor) return;
    tipEl.classList.remove('is-shown');
    const d = (tipFor.getAttribute('aria-describedby') || '').split(' ').filter((x) => x && x !== 'gn-tooltip').join(' ');
    d ? tipFor.setAttribute('aria-describedby', d) : tipFor.removeAttribute('aria-describedby');
    tipFor = null;
  }

  /* ── 7. 탭 · 세그먼트 ─────────────────────────────────────────────────── */
  function selectTab(tab, focus, noScroll) {
    const list = tab.closest('[role="tablist"]');
    $$('[role="tab"]', list).forEach((t) => {
      const on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      const p = doc.getElementById(t.getAttribute('aria-controls'));
      if (p) p.hidden = !on;
    });
    if (focus) tab.focus({ preventScroll: true });
    if (!noScroll) scrollInlineCenter(tab, list, true);
    emit(tab, 'gn:tab', { tab });
  }
  function syncOverflow(list) {
    const max = list.scrollWidth - list.clientWidth;
    const st = [];
    if (max > 2) { if (list.scrollLeft > 2) st.push('start'); if (list.scrollLeft < max - 2) st.push('end'); }
    if (max > 2) list.setAttribute('data-overflow', st.join(' ') || 'none'); else list.removeAttribute('data-overflow');
  }
  function initTabs(scope = doc) {
    $$('[role="tablist"]', scope).forEach((list) => {
      if (list.dataset.gnTabs) return; list.dataset.gnTabs = '1';
      const tabs = $$('[role="tab"]', list);
      const cur = tabs.find((t) => t.getAttribute('aria-selected') === 'true') || tabs[0];
      if (cur) selectTab(cur, false, true);
      list.addEventListener('click', (e) => { const t = e.target.closest('[role="tab"]'); if (t && !t.disabled) selectTab(t, false); });
      list.addEventListener('keydown', (e) => {
        const en = tabs.filter((t) => !t.disabled);
        const i = en.indexOf(doc.activeElement);
        if (i < 0) return;
        let n = null;
        if (e.key === 'ArrowRight') n = (i + 1) % en.length;
        else if (e.key === 'ArrowLeft') n = (i - 1 + en.length) % en.length;
        else if (e.key === 'Home') n = 0;
        else if (e.key === 'End') n = en.length - 1;
        if (n !== null) { e.preventDefault(); selectTab(en[n], true); }
      });
      if (list.classList.contains('tabs__list')) {
        syncOverflow(list);
        list.addEventListener('scroll', () => syncOverflow(list), { passive: true });
        window.addEventListener('resize', () => syncOverflow(list));
      }
    });
  }
  function pressSeg(btn) {
    const seg = btn.closest('.seg');
    if (!seg) return;
    if (seg.hasAttribute('data-multi')) btn.setAttribute('aria-pressed', String(btn.getAttribute('aria-pressed') !== 'true'));
    else $$('.seg__btn', seg).forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
    emit(seg, 'gn:seg', { value: btn.dataset.value || btn.textContent.trim(), button: btn });
  }

  /* ── 8. 아코디언 ──────────────────────────────────────────────────────── */
  function toggleAcc(trigger, force) {
    const open = force !== undefined ? force : trigger.getAttribute('aria-expanded') !== 'true';
    const acc = trigger.closest('.acc');
    if (open && acc && acc.hasAttribute('data-single')) $$('.acc__trigger[aria-expanded="true"]', acc).forEach((t) => { if (t !== trigger) toggleAcc(t, false); });
    trigger.setAttribute('aria-expanded', String(open));
    const p = doc.getElementById(trigger.getAttribute('aria-controls'));
    if (p) p.hidden = !open;
  }
  function initAcc(scope = doc) {
    $$('.acc__trigger', scope).forEach((t) => {
      const p = doc.getElementById(t.getAttribute('aria-controls'));
      if (p) { p.hidden = t.getAttribute('aria-expanded') !== 'true'; if (!p.getAttribute('role')) p.setAttribute('role', 'region'); if (!p.getAttribute('aria-labelledby')) p.setAttribute('aria-labelledby', ensureId(t, 'acc-t')); }
    });
  }

  /* ── 9. 토스트 ────────────────────────────────────────────────────────── */
  function toastRegion() {
    let r = $('.toast-region');
    if (!r) { r = doc.createElement('div'); r.className = 'toast-region'; r.setAttribute('role', 'status'); r.setAttribute('aria-live', 'polite'); doc.body.appendChild(r); }
    return r;
  }
  function toast(opts = {}) {
    const o = typeof opts === 'string' ? { title: opts } : opts;
    const r = toastRegion();
    const t = doc.createElement('div');
    t.className = `toast gilt${o.tone ? ` toast--${o.tone}` : ''} is-entering`;
    t.innerHTML = `<span class="toast__mark" aria-hidden="true"></span><div><p class="toast__title">${esc(o.title || '')}</p>${o.text ? `<p class="toast__text">${esc(o.text)}</p>` : ''}</div><button class="toast__close" type="button" aria-label="알림 닫기"><span data-icon="close"></span></button>`;
    hydrateIcons(t);
    r.appendChild(t);
    while (r.children.length > 3) r.firstElementChild.remove();
    const kill = () => { if (t.classList.contains('is-leaving')) return; t.classList.add('is-leaving'); setTimeout(() => t.remove(), reduced() ? 0 : 480); };
    $('.toast__close', t).addEventListener('click', kill);
    let timer = setTimeout(kill, o.duration || 4000);
    t.addEventListener('mouseenter', () => clearTimeout(timer));
    t.addEventListener('mouseleave', () => { timer = setTimeout(kill, 2000); });
    t.addEventListener('focusin', () => clearTimeout(timer));
    return t;
  }

  /* ── 10. 캐러셀 ───────────────────────────────────────────────────────── */
  function initCarousel(c) {
    if (c.dataset.gnCar) return; c.dataset.gnCar = '1';
    const vp = $('.carousel__viewport', c);
    const slides = $$('.carousel__slide', c);
    const prev = $('.carousel__arrow--prev', c), next = $('.carousel__arrow--next', c);
    let dots = $('.carousel__dots', c);
    const count = $('.carousel__count', c);
    if (!vp || !slides.length) return;
    vp.tabIndex = 0;
    slides.forEach((s, i) => { s.setAttribute('role', 'group'); s.setAttribute('aria-roledescription', '슬라이드'); s.setAttribute('aria-label', `${i + 1} / ${slides.length}`); });
    if (dots && !dots.children.length) {
      slides.forEach((s, i) => { const b = doc.createElement('button'); b.type = 'button'; b.className = 'carousel__dot'; b.setAttribute('aria-label', `${i + 1}번째 도판`); dots.appendChild(b); });
    }
    const dotBtns = dots ? $$('.carousel__dot', dots) : [];
    let idx = 0;
    const go = (i) => { idx = Math.max(0, Math.min(slides.length - 1, i)); vp.scrollTo({ left: slides[idx].offsetLeft - vp.offsetLeft - vp.clientLeft, behavior: reduced() ? 'auto' : 'smooth' }); };
    const sync = () => {
      const i = Math.round(vp.scrollLeft / Math.max(1, vp.clientWidth));
      idx = Math.max(0, Math.min(slides.length - 1, i));
      dotBtns.forEach((d, k) => d.setAttribute('aria-current', String(k === idx)));
      slides.forEach((s, k) => { s.setAttribute('aria-hidden', String(k !== idx)); $$(FOCUSABLE, s).forEach((f) => { f.tabIndex = k === idx ? 0 : -1; }); });
      if (prev) prev.disabled = idx === 0;
      if (next) next.disabled = idx === slides.length - 1;
      if (count) count.textContent = `${idx + 1} / ${slides.length}`;
    };
    let raf = 0;
    vp.addEventListener('scroll', () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(sync); }, { passive: true });
    prev && prev.addEventListener('click', () => go(idx - 1));
    next && next.addEventListener('click', () => go(idx + 1));
    dotBtns.forEach((d, i) => d.addEventListener('click', () => go(i)));
    vp.addEventListener('keydown', (e) => { if (e.key === 'ArrowRight') { e.preventDefault(); go(idx + 1); } if (e.key === 'ArrowLeft') { e.preventDefault(); go(idx - 1); } });
    sync();
  }

  /* ── 11. 칸반 ─────────────────────────────────────────────────────────── */
  /* 모바일 가로 스크롤 보드: 보드 높이를 지금 보이는 열 높이에 맞춘다(가장 긴 열 높이로 남는 빈칸 제거). */
  function fitKanban(k) {
    const fit = () => {
      const scrolls = window.innerWidth <= 560 && k.scrollWidth > k.clientWidth + 4;
      if (!scrolls) { k.style.height = ''; k.classList.remove('is-fitted'); return; }
      const cs = $$('.kanban__col', k); if (!cs.length) return;
      const kr = k.getBoundingClientRect();
      let best = cs[0], bestD = Infinity;
      cs.forEach((c) => { const d = Math.abs(c.getBoundingClientRect().left - kr.left - parseFloat(getComputedStyle(k).paddingLeft || 0)); if (d < bestD) { bestD = d; best = c; } });
      const pad = parseFloat(getComputedStyle(k).paddingTop || 0) + parseFloat(getComputedStyle(k).paddingBottom || 0);
      k.style.height = `${Math.ceil(best.offsetHeight + pad)}px`;
      k.classList.add('is-fitted');
    };
    let raf = 0; const queue = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(fit); };
    k.addEventListener('scroll', queue, { passive: true });
    window.addEventListener('resize', queue);
    if ('ResizeObserver' in window) { const ro = new ResizeObserver(queue); $$('.kanban__col', k).forEach((c) => ro.observe(c)); }
    queue();
  }

  function initKanban(k) {
    if (k.dataset.gnKan) return; k.dataset.gnKan = '1';
    fitKanban(k);
    let live = $('.kanban__live-region', k);
    if (!live) { live = doc.createElement('p'); live.className = 'sr-only kanban__live-region'; live.setAttribute('aria-live', 'assertive'); k.appendChild(live); }
    const cols = () => $$('.kanban__col', k);
    const colName = (col) => ($('.kanban__title', col) || {}).textContent || '';
    const sync = () => cols().forEach((col) => { const b = $('.kanban__count b', col); if (b) b.textContent = $$('.kanban__card', col).length; });
    let dragging = null;
    $$('.kanban__card', k).forEach((card) => { card.setAttribute('draggable', 'true'); if (!card.hasAttribute('tabindex')) card.tabIndex = 0; card.setAttribute('aria-roledescription', '이동 가능한 제작 카드'); });
    k.addEventListener('dragstart', (e) => {
      const card = e.target.closest('.kanban__card'); if (!card) return;
      dragging = card; card.classList.add('is-dragging');
      e.dataTransfer.effectAllowed = 'move';
      try { e.dataTransfer.setData('text/plain', card.id || 'card'); } catch (err) { /* 무시 */ }
    });
    k.addEventListener('dragend', () => { if (dragging) { dragging.classList.remove('is-dragging'); dragging = null; } $$('.kanban__col.is-over', k).forEach((c) => c.classList.remove('is-over')); sync(); });
    k.addEventListener('dragover', (e) => {
      if (!dragging) return;
      const col = e.target.closest('.kanban__col'); if (!col) return;
      e.preventDefault();
      $$('.kanban__col.is-over', k).forEach((c) => c !== col && c.classList.remove('is-over'));
      col.classList.add('is-over');
      const list = $('.kanban__list', col);
      const after = $$('.kanban__card:not(.is-dragging)', list).find((c) => { const r = c.getBoundingClientRect(); return e.clientY < r.top + r.height / 2; });
      after ? list.insertBefore(dragging, after) : list.appendChild(dragging);
    });
    k.addEventListener('drop', (e) => {
      if (!dragging) return; e.preventDefault();
      const col = dragging.closest('.kanban__col');
      dragging.classList.add('is-dropped'); setTimeout(() => dragging && dragging.classList.remove('is-dropped'), 500);
      announce(`${cardName(dragging)} 카드를 「${colName(col).trim()}」 열로 옮겼습니다`);
      emit(k, 'gn:kanban', { card: dragging, column: col });
    });
    const cardName = (c) => (($('.kanban__id', c) || {}).textContent || '').trim();
    const announce = (msg) => { live.textContent = msg; };
    // 키보드: Space/Enter 들기 → ←→ 열 · ↑↓ 순서 → Space/Enter 놓기 · Esc 취소
    let held = null;
    k.addEventListener('keydown', (e) => {
      const card = e.target.closest('.kanban__card'); if (!card) return;
      const list = card.parentElement;
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        if (held === card) { card.setAttribute('aria-grabbed', 'false'); held = null; sync(); announce(`${cardName(card)} 카드를 「${colName(card.closest('.kanban__col')).trim()}」 열에 놓았습니다`); card.classList.add('is-dropped'); setTimeout(() => card.classList.remove('is-dropped'), 500); emit(k, 'gn:kanban', { card, column: card.closest('.kanban__col') }); }
        else { if (held) held.setAttribute('aria-grabbed', 'false'); held = card; card.setAttribute('aria-grabbed', 'true'); held.dataset.origin = Array.from(cols()).indexOf(card.closest('.kanban__col')); announce(`${cardName(card)} 카드를 들었습니다. 좌우 화살표로 열을, 위아래로 순서를 바꾸고 Space 로 놓습니다`); }
        return;
      }
      if (held !== card) {
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); const cs = $$('.kanban__card', list); const i = cs.indexOf(card); cs[i + (e.key === 'ArrowDown' ? 1 : -1)]?.focus(); }
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); const all = cols(); const ci = all.indexOf(card.closest('.kanban__col')); const nc = all[ci + (e.key === 'ArrowRight' ? 1 : -1)]; if (nc) ($('.kanban__card', nc) || nc).focus(); }
        return;
      }
      if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); card.setAttribute('aria-grabbed', 'false'); held = null; announce('이동을 취소했습니다'); return; }
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault();
        const sib = e.key === 'ArrowUp' ? card.previousElementSibling : card.nextElementSibling;
        if (sib && sib.classList.contains('kanban__card')) { e.key === 'ArrowUp' ? list.insertBefore(card, sib) : list.insertBefore(sib, card); card.focus(); }
      }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault();
        const all = cols(); const ci = all.indexOf(card.closest('.kanban__col'));
        const nc = all[ci + (e.key === 'ArrowRight' ? 1 : -1)];
        if (nc) { $('.kanban__list', nc).appendChild(card); card.focus(); sync(); announce(`「${colName(nc).trim()}」 열`); }
      }
    });
    sync();
  }

  /* ── 12. 표: 정렬 · 행 선택 · 쪽 나누기 ─────────────────────────────── */
  const parseNum = (s) => { const t = String(s).replace(/[−–]/g, '-').replace(/[^0-9.\-]/g, ''); return t === '' || t === '-' ? NaN : parseFloat(t); };
  function sortTable(btn) {
    const th = btn.closest('th');
    const table = th.closest('table');
    const tbody = table.tBodies[0];
    const idx = Array.from(th.parentElement.children).indexOf(th);
    const dir = th.getAttribute('aria-sort') === 'ascending' ? 'descending' : 'ascending';
    $$('th[aria-sort]', table).forEach((h) => h !== th && h.setAttribute('aria-sort', 'none'));
    th.setAttribute('aria-sort', dir);
    const numeric = th.classList.contains('num') || th.dataset.type === 'num';
    const rows = Array.from(tbody.rows);
    const key = (r) => { const c = r.cells[idx]; const v = c ? (c.dataset.sort || c.textContent.trim()) : ''; return numeric ? parseNum(v) : v; };
    rows.sort((a, b) => {
      const x = key(a), y = key(b);
      const r = numeric ? (isNaN(x) ? -Infinity : x) - (isNaN(y) ? -Infinity : y) : String(x).localeCompare(String(y), 'ko');
      return dir === 'ascending' ? r : -r;
    });
    rows.forEach((r) => tbody.appendChild(r));
    const pager = doc.querySelector(`[data-pager-for="${table.id}"]`);
    if (pager) renderPager(pager, 1);
    emit(table, 'gn:sort', { column: idx, dir });
  }
  function renderPager(pager, page) {
    const table = doc.getElementById(pager.dataset.pagerFor);
    if (!table) return;
    const per = parseInt(pager.dataset.perPage || '10', 10);
    const rows = Array.from(table.tBodies[0].rows);
    const pages = Math.max(1, Math.ceil(rows.length / per));
    const p = Math.max(1, Math.min(pages, page));
    rows.forEach((r, i) => { r.hidden = Math.floor(i / per) + 1 !== p; });
    const btn = (n, label, cls, attrs = '') => `<li><button type="button" class="${cls}" data-page="${n}" ${attrs}>${label}</button></li>`;
    let html = btn(p - 1, '<span data-icon="chevron-left"></span><span>이전</span>', 'pager__step', p === 1 ? 'aria-disabled="true" tabindex="-1"' : 'aria-label="이전 쪽"');
    for (let n = 1; n <= pages; n++) {
      if (pages > 7 && n !== 1 && n !== pages && Math.abs(n - p) > 1) { if (n === 2 || n === pages - 1) html += '<li class="pager__gap" aria-hidden="true">⋯</li>'; continue; }
      html += btn(n, n, 'pager__link', `aria-label="${n}쪽"${n === p ? ' aria-current="page"' : ''}`);
    }
    html += btn(p + 1, '<span>다음</span><span data-icon="chevron-right"></span>', 'pager__step', p === pages ? 'aria-disabled="true" tabindex="-1"' : 'aria-label="다음 쪽"');
    const list = $('.pager__list', pager) || pager.appendChild(Object.assign(doc.createElement('ul'), { className: 'pager__list' }));
    list.innerHTML = html;
    hydrateIcons(list);
    pager.dataset.page = p;
    const info = $('.pager__info', pager);
    if (info) info.textContent = `${rows.length}건 중 ${(p - 1) * per + 1}–${Math.min(rows.length, p * per)}`;
  }

  /* ── 13. 마퀴 ─────────────────────────────────────────────────────────── */
  function initMarquee(m) {
    if (m.dataset.gnMq) return; m.dataset.gnMq = '1';
    const track = $('.marquee__track', m);
    const group = track && $('.marquee__group', track);
    if (!group) return;
    if ($$('.marquee__group', track).length < 2) { const c = group.cloneNode(true); c.setAttribute('aria-hidden', 'true'); $$('a, button', c).forEach((x) => { x.tabIndex = -1; }); track.appendChild(c); }
    const w = group.scrollWidth;
    m.style.setProperty('--marquee-dur', `${Math.max(24, Math.round(w / 40))}s`);
    let btn = $('.marquee__toggle', m);
    if (!btn) {
      btn = doc.createElement('button'); btn.type = 'button'; btn.className = 'marquee__toggle';
      btn.innerHTML = '<span data-icon="pause"></span>'; m.appendChild(btn); hydrateIcons(btn);
    }
    const set = (paused) => { m.classList.toggle('is-paused', paused); btn.setAttribute('aria-pressed', String(paused)); btn.setAttribute('aria-label', paused ? '전광판 흐름 다시 재생' : '전광판 흐름 멈춤'); setIcon($('[data-icon]', btn), paused ? 'play' : 'pause'); };
    btn.addEventListener('click', () => set(!m.classList.contains('is-paused')));
    set(false);
  }

  /* ── 14. 폼: 검증 · 전화 형식 · 글자 수 · 스테퍼 · 스위치 ────────────── */
  const fieldOf = (input) => input.closest('.field') || input.closest('.check') || input.parentElement;
  function setFieldError(input, msg) {
    const f = fieldOf(input);
    let err = f && $('.field__error', f);
    if (msg) {
      input.setAttribute('aria-invalid', 'true');
      if (f) f.classList.add('field--error');
      if (!err && f) { err = doc.createElement('p'); err.className = 'field__error'; f.appendChild(err); }
      if (err) { err.id = err.id || uid('err'); err.textContent = msg; err.hidden = false; const d = (input.getAttribute('aria-describedby') || '').split(' ').filter(Boolean); if (!d.includes(err.id)) input.setAttribute('aria-describedby', [...d, err.id].join(' ')); }
    } else {
      input.removeAttribute('aria-invalid');
      if (f) f.classList.remove('field--error');
      if (err) err.hidden = true;
    }
  }
  function validateInput(input) {
    const v = (input.type === 'checkbox' ? (input.checked ? 'on' : '') : input.value).trim();
    const label = input.dataset.label || ($('.field__label', fieldOf(input) || doc) || {}).textContent?.replace('*', '').trim() || '이 항목';
    let msg = '';
    if (input.required && !v) msg = input.type === 'checkbox' ? (input.dataset.msgRequired || '동의가 필요합니다.') : (input.dataset.msgRequired || `${label}을(를) 적어 주십시오.`);
    else if (v && input.dataset.mask === 'phone' && !/^01[016789]-\d{3,4}-\d{4}$/.test(v)) msg = input.dataset.msgPattern || '연락처는 010-0000-0000 형식으로 적어 주십시오.';
    else if (v && input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) msg = input.dataset.msgPattern || '전보를 받을 주소 형식이 맞지 않습니다.';
    else if (v && input.pattern && !new RegExp(`^(?:${input.pattern})$`).test(v)) msg = input.dataset.msgPattern || `${label} 형식을 확인해 주십시오.`;
    else if (v && input.maxLength > 0 && v.length > input.maxLength) msg = `${input.maxLength}자 이내로 줄여 주십시오.`;
    setFieldError(input, msg);
    return !msg;
  }
  function maskPhone(input) {
    const d = input.value.replace(/\D/g, '').slice(0, 11);
    let out = d;
    if (d.length > 7) out = `${d.slice(0, 3)}-${d.slice(3, d.length - 4)}-${d.slice(-4)}`;
    else if (d.length > 3) out = `${d.slice(0, 3)}-${d.slice(3)}`;
    input.value = out;
  }
  function syncCount(input) {
    const f = fieldOf(input); const c = f && $('.field__count', f); if (!c) return;
    const max = parseInt(input.getAttribute('maxlength') || input.dataset.max || '0', 10);
    c.textContent = max ? `${input.value.length} / ${max}` : `${input.value.length}자`;
    c.classList.toggle('is-over', max && input.value.length > max);
  }
  function stepperSync(st) {
    const input = $('.stepper__value', st);
    const min = parseInt(input.min || '0', 10), max = parseInt(input.max || '99', 10);
    let v = parseInt(input.value || '0', 10); if (isNaN(v)) v = min;
    v = Math.max(min, Math.min(max, v)); input.value = v;
    const [dec, inc] = $$('.stepper__btn', st);
    if (dec) dec.disabled = v <= min;
    if (inc) inc.disabled = v >= max;
    emit(st, 'gn:stepper', { value: v });
  }
  function syncSwitch(input) {
    input.setAttribute('aria-checked', String(input.checked));
    const s = input.closest('.switch'); const st = s && $('.switch__state', s);
    if (st) st.textContent = input.checked ? (st.dataset.on || '켜짐') : (st.dataset.off || '꺼짐');
  }
  function initForms(scope = doc) {
    $$('[data-mask="phone"]', scope).forEach((i) => { if (!i.inputMode) i.inputMode = 'numeric'; });
    $$('[data-count]', scope).forEach(syncCount);
    $$('.stepper', scope).forEach(stepperSync);
    $$('.switch input', scope).forEach((i) => { i.setAttribute('role', 'switch'); syncSwitch(i); });
  }

  /* ── 15. 공연 달력 ────────────────────────────────────────────────────── */
  const RUNS = [
    { code: 'P05', title: '은막의 변사 「파도 위의 연인」', from: '2026-10-09', to: '2026-10-25' },
    { code: 'P06', title: '샹들리에 아래 현악 사중주', from: '2026-10-28', to: '2026-11-08' },
    { code: 'P07', title: '달빛 레뷔 — 경성 1936', from: '2026-11-11', to: '2026-12-06' },
    { code: 'P08', title: '금란 송년 갈라', from: '2026-12-18', to: '2026-12-27' }
  ];
  const WD = ['일', '월', '화', '수', '목', '금', '토'];
  const parseISO = (k) => { const [y, m, d] = String(k).split('-').map(Number); return new Date(y, m - 1, d || 1); };
  const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  function showsOn(d) {
    const day = d.getDay();
    if (day === 1) return { closed: true, times: [] };
    const k = iso(d);
    const run = RUNS.find((r) => k >= r.from && k <= r.to);
    if (!run) return { closed: false, times: [] };
    const times = day === 6 ? ['15:00', '19:30'] : day === 0 ? ['15:00'] : ['19:30'];
    return { closed: false, times, run };
  }
  // cal: data-lock-past 달력이면 기준일(data-today)의 기준 시각(data-now) 이전 회차를 「종료」로 적는다
  function describeDay(d, cal) {
    const s = showsOn(d);
    const base = `${d.getMonth() + 1}월 ${d.getDate()}일 ${WD[d.getDay()]}요일`;
    if (s.closed) return `${base} · 휴관`;
    if (!s.times.length) return `${base} · 공연 없음`;
    const lock = cal && cal.hasAttribute('data-lock-past') && iso(d) === (cal.dataset.today || '2026-11-14');
    const nowT = (cal && cal.dataset.now) || '18:40';
    const names = s.times.map((t) => {
      const n = t === '15:00' && d.getDay() === 6 ? `마티네 ${t}` : t === '19:30' && d.getDay() === 6 ? `수와레 ${t}` : t;
      return lock && t < nowT ? `${n.replace(` ${t}`, '')} 종료` : n;
    }).join(' · ');
    return `${base} · ${s.run.code} ${s.run.title} · ${names}`;
  }
  function renderCal(cal) {
    const [y, m] = cal.dataset.cal.split('-').map(Number);
    const today = cal.dataset.today || '2026-11-14';
    const selected = cal.dataset.selected || '';
    const first = new Date(y, m - 1, 1);
    const start = new Date(y, m - 1, 1 - first.getDay());
    const min = cal.dataset.min || '2026-10', max = cal.dataset.max || '2026-12';
    const ym = `${y}-${String(m).padStart(2, '0')}`;
    const onlyRun = cal.dataset.run || '';
    const lockPast = cal.hasAttribute('data-lock-past');
    const nowTime = cal.dataset.now || '18:40';
    const titleId = ensureId(cal, 'cal') + '-t';
    let html = `<div class="cal__head">
      <button type="button" class="cal__nav" data-cal-step="-1" aria-label="이전 달" ${ym <= min ? 'disabled' : ''}><span data-icon="chevron-left"></span></button>
      <h3 class="cal__title" id="${titleId}" aria-live="polite">${y}년 ${m}월<small>2026 가을 레퍼토리 「금빛 막간」</small></h3>
      <button type="button" class="cal__nav" data-cal-step="1" aria-label="다음 달" ${ym >= max ? 'disabled' : ''}><span data-icon="chevron-right"></span></button>
    </div>
    <table class="cal__grid" role="grid" aria-labelledby="${titleId}"><thead><tr>${WD.map((w) => `<th scope="col" abbr="${w}요일">${w}</th>`).join('')}</tr></thead><tbody>`;
    const cur = new Date(start);
    let focusSet = false;
    const focusKey = selected && selected.startsWith(ym) ? selected : today.startsWith(ym) ? today : `${ym}-01`;
    for (let w = 0; w < 6; w++) {
      if (w > 0 && cur.getMonth() !== m - 1) break;
      html += '<tr>';
      for (let i = 0; i < 7; i++) {
        const k = iso(cur);
        const out = cur.getMonth() !== m - 1;
        let s = showsOn(cur);
        // data-run="P07": 이 공연의 회차만 찍는다(다른 공연 날짜는 「공연 없음」)
        if (onlyRun && s.run && s.run.code !== onlyRun) s = { closed: s.closed, times: [] };
        const isPast = lockPast && k < today && s.times.length > 0;
        const isToday = k === today;
        // 오늘: 기준 시각(data-now)보다 이른 회차는 끝난 회차
        const doneTimes = lockPast && isToday ? s.times.filter((t) => t < nowTime) : [];
        const openTimes = s.times.filter((t) => !doneTimes.includes(t));
        const cls = ['cal__day'];
        if (out) cls.push('cal__day--out');
        if (s.closed) cls.push('cal__day--closed');
        if (s.times.length && !isPast) cls.push('cal__day--show');
        if (isPast) cls.push('cal__day--past');
        if (!s.closed && !s.times.length && !out) cls.push('cal__day--none');
        const note = s.closed ? '휴관' : isPast ? '지난 회차' : doneTimes.length ? (openTimes.length ? `${openTimes.join(' · ')}만` : '종료') : s.times.length ? s.times.join(' · ') : (onlyRun && !out ? '공연 없음' : '');
        const bookable = s.times.length && !isPast && openTimes.length;
        const isFocus = !focusSet && k === focusKey;
        if (isFocus) focusSet = true;
        const label = describeDay(cur) + (isPast ? ' · 지난 회차' : '') + (doneTimes.length ? ` · ${doneTimes.join(' · ')} 회차 종료` : '') + (isToday ? ', 오늘' : '');
        html += `<td role="gridcell"><button type="button" class="${cls.join(' ')}" data-date="${k}" tabindex="${isFocus ? 0 : -1}" aria-label="${esc(label)}"${isToday ? ' aria-current="date"' : ''}${k === selected ? ' aria-selected="true"' : ''}${!bookable ? ' aria-disabled="true"' : ''}>
          <span class="cal__num">${cur.getDate()}</span><span class="cal__shows" aria-hidden="true">${s.times.map((t) => `<i${isPast || doneTimes.includes(t) ? ' class="is-done"' : ''}></i>`).join('')}</span><span class="cal__note" aria-hidden="true">${note}</span></button></td>`;
        cur.setDate(cur.getDate() + 1);
      }
      html += '</tr>';
    }
    html += '</tbody></table>';
    if (!cal.hasAttribute('data-no-legend')) html += '<p class="cal__legend"><span><i></i>공연일(회차 수만큼)</span><span><i class="is-today"></i>오늘</span><span><i class="is-closed"></i>월요일 휴관</span></p>';
    html += `<p class="cal__output" data-cal-output aria-live="polite">${selected ? esc(describeDay(parseISO(selected), cal)) : ''}</p>`;
    cal.innerHTML = html;
    hydrateIcons(cal);
  }
  function initCal(cal) {
    if (cal.dataset.gnCal) return; cal.dataset.gnCal = '1';
    renderCal(cal);
    cal.addEventListener('click', (e) => {
      const step = e.target.closest('[data-cal-step]');
      if (step) { const [y, m] = cal.dataset.cal.split('-').map(Number); const d = new Date(y, m - 1 + Number(step.dataset.calStep), 1); cal.dataset.cal = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`; renderCal(cal); $(`[data-cal-step="${step.dataset.calStep}"]`, cal)?.focus(); return; }
      const day = e.target.closest('.cal__day');
      if (!day || day.getAttribute('aria-disabled') === 'true') return;
      cal.dataset.selected = day.dataset.date;
      $$('.cal__day[aria-selected]', cal).forEach((d) => d.removeAttribute('aria-selected'));
      day.setAttribute('aria-selected', 'true');
      const d = parseISO(day.dataset.date);
      const out = $('[data-cal-output]', cal); if (out) out.textContent = describeDay(d, cal);
      emit(cal, 'gn:date', { date: day.dataset.date, ...showsOn(d) });
    });
    cal.addEventListener('keydown', (e) => {
      const day = e.target.closest('.cal__day'); if (!day) return;
      const map = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 };
      let n = map[e.key];
      if (e.key === 'Home') n = -parseISO(day.dataset.date).getDay();
      if (e.key === 'End') n = 6 - parseISO(day.dataset.date).getDay();
      if (n === undefined) return;
      e.preventDefault();
      const d = parseISO(day.dataset.date); d.setDate(d.getDate() + n);
      let target = $(`.cal__day[data-date="${iso(d)}"]`, cal);
      if (!target) {
        const ym = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        if (ym < (cal.dataset.min || '2026-10') || ym > (cal.dataset.max || '2026-12')) return;
        cal.dataset.cal = ym; renderCal(cal); target = $(`.cal__day[data-date="${iso(d)}"]`, cal);
      }
      if (target) { $$('.cal__day', cal).forEach((b) => { b.tabIndex = -1; }); target.tabIndex = 0; target.focus(); }
    });
  }

  /* ── 16. 커맨드 팔레트 (⌘K) ──────────────────────────────────────────── */
  const CMD_DEFAULT = [
    ['공연', 'stage', '달빛 레뷔 — 경성 1936', 'P07 · 11.11(수) – 12.6(일) · 오늘 수와레 P07-S05', 'P07', 'product.html', '달빛 레뷔 재즈 윤달래 남궁효'],
    ['공연', 'stage', '금란 송년 갈라', 'P08 · 12.18(금) – 12.27(일)', 'P08', '', '송년 갈라 콘서트'],
    ['공연', 'stage', '샹들리에 아래 현악 사중주', 'P06 · 10.28(수) – 11.8(일) · 종료', 'P06', '', '실내악 현악'],
    ['공연', 'stage', '은막의 변사 「파도 위의 연인」', 'P05 · 10.9(금) – 10.25(일) · 종료', 'P05', '', '무성영화 변사 고만수'],
    ['예약 장부', 'ticket', 'GN-261114-0731 · 이정원', 'F-12 · R석 · 2인 · 발권 완료', '₩196,000', 'dashboard.html', 'F-12 이정원'],
    ['예약 장부', 'ticket', 'GN-261114-0732 · 박서하', 'RB-2 · 로열박스 · 4인 · 발권 완료', '₩720,000', 'dashboard.html', 'RB-2 박서하 로열'],
    ['예약 장부', 'ticket', 'GN-261114-0733 · 최무경', 'BC-07 · 발코니 · 2인 · 현장 수령', '₩110,000', 'dashboard.html', 'BC-07 최무경 발코니'],
    ['예약 장부', 'ticket', 'GN-261114-0734 · 김나래', 'H-03 · S석 · 1인 · 발권 완료', '₩77,000', 'dashboard.html', 'H-03 김나래'],
    ['예약 장부', 'ticket', 'GN-261114-0735 · 오세헌', 'A-11 · R석 · 2인 · 발권 완료', '₩196,000', 'dashboard.html', 'A-11 오세헌'],
    ['예약 장부', 'ticket', 'GN-261114-0736 · 정하람', 'BC-21 · 발코니 · 3인 · 환불 완료', '₩0', 'dashboard.html', 'BC-21 정하람 환불'],
    ['예약 장부', 'ticket', 'GN-261114-0737 · 문지후', 'RB-5 · 로열박스 · 4인 · 발권 완료', '₩720,000', 'dashboard.html', 'RB-5 문지후 로열'],
    ['예약 장부', 'ticket', 'GN-261114-0738 · 한소율', 'K-18 · S석 · 2인 · 현장 수령', '₩154,000', 'dashboard.html', 'K-18 한소율'],
    ['예약 장부', 'ticket', 'GN-261114-0739 · 윤재건', 'C-07 · R석 · 1인 · 발권 완료', '₩98,000', 'dashboard.html', 'C-07 윤재건'],
    ['예약 장부', 'ticket', 'GN-261114-0740 · 서다온', 'BC-15 · 발코니 · 2인 · 발권 완료', '₩110,000', 'dashboard.html', 'BC-15 서다온'],
    ['회원', 'user', '이정원 · 금란회 골드', 'GNC-0193 · 누적 관람 47회 · 선호석 F-12', 'GNC-0193', 'profile.html', '이정원 골드 회원'],
    ['회원', 'user', '김나래 · 금란회 입회 중', '실버 선택 · 오늘 가입', '신규', 'onboarding.html', '김나래 실버 입회'],
    ['화면', 'diamond', '프로그램 북 표지', '개관 90주년 기념호 · 제7호', '', '@home', '표지 index 프로그램북'],
    ['화면', 'diamond', '오늘 밤의 장부', '백스테이지 · 무대감독 한도겸', '', 'dashboard.html', '대시보드 장부'],
    ['화면', 'diamond', '컨시어지 전보함', '전보 10통 · 마영란', '', 'inbox.html', '전보 문의 인박스'],
    ['화면', 'diamond', '시즌 제작 보드', '제작 카드 12장', '', 'kanban.html', '칸반 제작'],
    ['화면', 'diamond', '금란회 입회', '3막 구성', '', 'onboarding.html', '온보딩 가입'],
    ['화면', 'diamond', '좌석 등급과 금란회 회원권', '로열 · R · S · 발코니', '', 'pricing.html', '가격 요금 회원권'],
    ['화면', 'diamond', '회원 설정', '알림 · 지정석 · 결제 수단', '', 'settings.html', '설정'],
    ['화면', 'diamond', '휴관 무대', '404', '', '404.html', '404 휴관']
  ];
  function buildDefaultCmd(list) {
    let html = ''; let g = '';
    CMD_DEFAULT.forEach(([group, icon, label, sub, meta, href, kw]) => {
      if (group !== g) { g = group; html += `<li class="cmd__group" role="presentation">${group}</li>`; }
      const h = href === '@home' ? `${HOME}index.html` : href ? `${PAGE}${href}` : '';
      html += `<li class="cmd__item" role="option" id="${uid('cmd-o')}" aria-selected="false" data-keywords="${esc(kw)}"${h ? ` data-href="${h}"` : ` data-toast="${esc(label)}" data-toast-text="${esc(sub)}"`}><span data-icon="${icon}"></span><span class="cmd__label">${esc(label)}<span class="cmd__sub">${esc(sub)}</span></span><span class="cmd__meta">${esc(meta)}</span></li>`;
    });
    list.innerHTML = html;
    hydrateIcons(list);
  }
  function initCommand(panelRoot) {
    if (panelRoot.dataset.gnCmd) return; panelRoot.dataset.gnCmd = '1';
    const input = $('.cmd__input', panelRoot);
    const list = $('.cmd__list', panelRoot);
    if (!input || !list) return;
    if (list.dataset.cmdSource === 'default' || !$('.cmd__item', list)) buildDefaultCmd(list);
    list.setAttribute('role', 'listbox');
    ensureId(list, 'cmd-l');
    input.setAttribute('role', 'combobox');
    input.setAttribute('aria-controls', list.id);
    input.setAttribute('aria-expanded', 'true');
    input.setAttribute('aria-autocomplete', 'list');
    const items = $$('.cmd__item', list);
    items.forEach((it) => {
      ensureId(it, 'cmd-o');
      const l = $('.cmd__label', it); if (!l || l.dataset.raw !== undefined) return;
      const sub = $('.cmd__sub', l);
      l.dataset.sub = sub ? sub.textContent : '';
      if (sub) sub.remove();
      l.dataset.raw = l.textContent.trim();
    });
    let empty = $('.cmd__empty', panelRoot);
    if (!empty) { empty = doc.createElement('p'); empty.className = 'cmd__empty'; empty.hidden = true; list.after(empty); }
    let active = null;
    const visible = () => items.filter((i) => !i.hidden);
    const setActive = (it) => {
      items.forEach((i) => i.setAttribute('aria-selected', String(i === it)));
      active = it;
      if (it) { input.setAttribute('aria-activedescendant', it.id); scrollBlockNearest(it, list); } else input.removeAttribute('aria-activedescendant');
    };
    const filter = () => {
      const q = input.value.trim().toLowerCase();
      items.forEach((it) => {
        const l = $('.cmd__label', it);
        const raw = l.dataset.raw;
        const hay = (raw + ' ' + l.dataset.sub + ' ' + it.textContent + ' ' + (it.dataset.keywords || '')).toLowerCase();
        it.hidden = Boolean(q) && !hay.includes(q);
        const i = q ? raw.toLowerCase().indexOf(q) : -1;
        const lab = i >= 0 ? `${esc(raw.slice(0, i))}<mark>${esc(raw.slice(i, i + q.length))}</mark>${esc(raw.slice(i + q.length))}` : esc(raw);
        l.innerHTML = lab + (l.dataset.sub ? `<span class="cmd__sub">${esc(l.dataset.sub)}</span>` : '');
      });
      $$('.cmd__group', list).forEach((g) => { let n = g.nextElementSibling; let any = false; while (n && !n.classList.contains('cmd__group')) { if (!n.hidden) any = true; n = n.nextElementSibling; } g.hidden = !any; });
      const v = visible();
      empty.hidden = v.length > 0;
      if (!v.length) empty.textContent = `「${input.value.trim()}」에 맞는 공연·예약·좌석·회원이 없습니다. 예약번호(GN-261114-0731)나 좌석(F-12)으로 찾아 보십시오.`;
      setActive(v[0] || null);
    };
    const activate = (it) => {
      if (!it || it.getAttribute('aria-disabled') === 'true') return;
      const ov = panelRoot.closest('.overlay');
      if (it.dataset.href) { location.href = it.dataset.href; return; }
      if (it.dataset.open) { if (ov) closeOverlay(ov, false); openOverlay(doc.getElementById(it.dataset.open)); return; }
      if (ov) closeOverlay(ov);
      toast({ title: it.dataset.toast || $('.cmd__label', it).dataset.raw, text: it.dataset.toastText || $('.cmd__label', it).dataset.sub || '' });
    };
    input.addEventListener('input', filter);
    input.addEventListener('keydown', (e) => {
      const v = visible(); const i = v.indexOf(active);
      if (e.key === 'ArrowDown') { e.preventDefault(); setActive(v[(i + 1) % v.length]); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(v[(i - 1 + v.length) % v.length]); }
      else if (e.key === 'Home' && e.ctrlKey) { e.preventDefault(); setActive(v[0]); }
      else if (e.key === 'Enter') { e.preventDefault(); activate(active); }
    });
    list.addEventListener('click', (e) => activate(e.target.closest('.cmd__item')));
    list.addEventListener('mousemove', (e) => { const it = e.target.closest('.cmd__item'); if (it && it !== active) setActive(it); });
    (panelRoot.closest('.overlay') || panelRoot).addEventListener('gn:open', () => { filter(); setTimeout(() => input.select(), 40); });
    filter();
  }

  /* ── 17. 예매 단계 ───────────────────────────────────────────────────── */
  function setStep(steps, index) {
    const items = $$('.steps__item', steps);
    const i = Math.max(0, Math.min(items.length - 1, index));
    items.forEach((it, k) => {
      it.classList.toggle('is-done', k < i);
      it.classList.remove('is-error');
      k === i ? it.setAttribute('aria-current', 'step') : it.removeAttribute('aria-current');
      const sr = $('.steps__state', it);
      if (sr) sr.textContent = k < i ? '완료' : k === i ? '현재 단계' : '';
    });
    steps.dataset.step = i;
    emit(steps, 'gn:step', { index: i });
    return i;
  }

  /* ── 18. 막 진행 표시(스크롤스파이) ──────────────────────────────────── */
  function initScrollspy(nav) {
    const links = $$('a[href^="#"]', nav);
    const targets = links.map((a) => doc.getElementById(decodeURIComponent(a.getAttribute('href').slice(1)))).filter(Boolean);
    if (!targets.length || !('IntersectionObserver' in window)) return;
    const set = (id) => {
      let past = true;
      links.forEach((a) => {
        const on = a.getAttribute('href') === `#${id}`;
        if (on) { a.setAttribute('aria-current', 'true'); past = false; scrollInlineCenter(a, a.closest('.actbar__list') || nav, false); } else a.removeAttribute('aria-current');
        a.classList.toggle('is-past', past && !on);
      });
    };
    const vis = new Map();
    const io = new IntersectionObserver((ents) => {
      ents.forEach((en) => vis.set(en.target.id, en.isIntersecting ? en.boundingClientRect.top : null));
      let best = null, bestTop = -Infinity;
      targets.forEach((t) => { const r = t.getBoundingClientRect(); if (r.top <= window.innerHeight * 0.4 && r.top > bestTop) { bestTop = r.top; best = t.id; } });
      if (best) set(best);
    }, { rootMargin: '-30% 0px -50% 0px', threshold: [0, 1] });
    targets.forEach((t) => io.observe(t));
    // data-show-after="cover": 그 구획을 지나야 막 진행 바를 띄운다(좁은 화면에서 표지를 누르지 않게 — CSS 가 .is-shown 으로 노출)
    const after = nav.dataset.showAfter && doc.getElementById(nav.dataset.showAfter);
    if (after) {
      new IntersectionObserver(([en]) => {
        nav.classList.toggle('is-shown', !en.isIntersecting && en.boundingClientRect.top < 0);
      }, { rootMargin: '-80px 0px 0px 0px' }).observe(after);
    }
  }

  /* ── 19. 진입 연출 · 스태거 · 다시 재생 ─────────────────────────────── */
  function staggerIndex(el) {
    const kids = Array.from(el.children);
    const c = (kids.length - 1) / 2;
    kids.forEach((k, i) => k.style.setProperty('--i', String(Math.min(8, Math.round(Math.abs(i - c))))));
  }
  function play(el, type) {
    const t = type || el.dataset.motion || el.dataset.reveal;
    if (t === 'gilt') { const f = el.classList.contains('foil-text') ? [el] : $$('.foil-text', el); f.forEach((x) => { x.classList.remove('is-gilding'); reflow(x); x.classList.add('is-gilding'); }); }
    else if (t === 'curtain') { const cs = el.classList.contains('curtain') ? [el] : $$('.curtain', el); cs.forEach((c) => { c.style.transition = 'none'; c.classList.remove('is-raised'); reflow(c); c.style.transition = ''; requestAnimationFrame(() => requestAnimationFrame(() => c.classList.add('is-raised'))); }); }
    else if (t === 'spread') { const s = el.classList.contains('spread-line') ? [el] : $$('.spread-line', el); s.forEach((x) => { x.classList.remove('is-spreading'); reflow(x); x.classList.add('is-spreading'); }); }
    else if (t === 'stagger') { const s = el.hasAttribute('data-stagger') ? [el] : $$('[data-stagger]', el); s.forEach((x) => { staggerIndex(x); x.classList.remove('is-playing'); reflow(x); x.classList.add('is-playing'); }); }
    else if (t === 'rays') { const r = el.classList.contains('ray-head') ? [el] : $$('.ray-head', el); r.forEach((x) => { x.classList.remove('is-turning'); reflow(x); x.classList.add('is-turning'); }); }
    else if (t === 'meter') { $$('.meter', el).concat(el.classList.contains('meter') ? [el] : []).forEach((m) => { m.classList.remove('is-revealing'); reflow(m); m.classList.add('is-revealing'); }); }
    else if (t === 'gauge') { $$('.gauge', el).concat(el.classList.contains('gauge') ? [el] : []).forEach((g) => { const v = g.dataset.value || getComputedStyle(g).getPropertyValue('--v'); g.style.setProperty('--v', '0'); reflow(g); requestAnimationFrame(() => g.style.setProperty('--v', String(v).trim())); }); }
    el.classList.add('is-revealed');
  }
  function initReveal() {
    const els = $$('[data-reveal]');
    if (!els.length) return;
    if (!('IntersectionObserver' in window) || reduced()) { els.forEach((e) => { e.classList.add('is-revealed'); $$('.curtain', e).forEach((c) => c.classList.add('is-raised')); }); return; }
    const io = new IntersectionObserver((ents) => ents.forEach((en) => { if (en.isIntersecting) { play(en.target); io.unobserve(en.target); } }), { threshold: 0.2 });
    els.forEach((e) => io.observe(e));
  }

  /* ── 20. 객석 도식 ────────────────────────────────────────────────────── */
  const ROWS_R = ['A', 'B', 'C', 'D', 'E', 'F'], ROWS_S = ['G', 'H', 'I', 'J', 'K', 'L'];
  const BC_ROWS = [28, 30, 32, 34];
  const PRESETS = {
    soiree: { label: '수와레 P07-S05', open: ['L-01', 'L-02', 'L-03', 'L-20', 'L-21', 'L-22', 'K-01', 'K-22', 'J-22', 'BC-58', 'BC-59', 'BC-91', 'BC-92', 'BC-123', 'BC-124'] },
    matinee: { label: '마티네 P07-S04 (종료)', open: ['RB-6-1', 'RB-6-2', 'RB-6-3', 'RB-6-4', 'L-01', 'L-02', 'L-22', 'BC-91', 'BC-92', 'BC-123', 'BC-124'] },
    blank: { label: '객석 배치', open: 'all' }
  };
  const pad = (n) => String(n).padStart(2, '0');
  function renderSeatmap(sm) {
    const preset = PRESETS[sm.dataset.seatmap] || PRESETS.soiree;
    const marks = (sm.dataset.mark || '').split(',').map((s) => s.trim()).filter(Boolean);
    const pick = sm.hasAttribute('data-pick');
    const zoneSel = sm.dataset.zone || '';
    const isOpen = (code) => preset.open === 'all' || preset.open.includes(code);
    let sold = 0;
    const seat = (code, zone) => {
      const st = marks.includes(code) ? 'mark' : isOpen(code) ? 'open' : 'sold';
      if (!isOpen(code)) sold++;
      return `<i class="seat" data-s="${st}" data-zone="${zone}" data-code="${code}"></i>`;
    };
    const zoneWrap = (zone, label, inner, extra = '') => pick
      ? `<button type="button" class="seatmap__zone ${extra}" data-zone="${zone}" aria-pressed="${zoneSel === zone}" aria-label="${label}">${inner}</button>`
      : `<div class="seatmap__zone ${extra}">${inner}</div>`;
    const boxes = (from) => {
      let h = '';
      for (let b = from; b < from + 3; b++) { h += `<span class="seatmap__box" title="RB-${b}">${[1, 2, 3, 4].map((n) => seat(`RB-${b}-${n}`, 'RB')).join('')}</span>`; }
      return `<div class="seatmap__boxes">${h}</div>`;
    };
    const row = (r, zone) => {
      let left = '', right = '';
      for (let n = 1; n <= 22; n++) { const s = seat(`${r}-${pad(n)}`, zone); n <= 11 ? (left += s) : (right += s); }
      return `<div class="seatmap__row"><span class="seatmap__row-label" aria-hidden="true">${r}</span><span class="seatmap__half">${left}</span><span class="seatmap__aisle"></span><span class="seatmap__half">${right}</span><span class="seatmap__row-label" aria-hidden="true">${r}</span></div>`;
    };
    const orchR = ROWS_R.map((r) => row(r, 'R')).join('');
    const orchS = ROWS_S.map((r) => row(r, 'S')).join('');
    let bc = '', no = 1;
    BC_ROWS.forEach((cnt) => {
      let l = '', r = '';
      for (let i = 0; i < cnt; i++, no++) { const s = seat(`BC-${pad(no)}`, 'BC'); i < cnt / 2 ? (l += s) : (r += s); }
      bc += `<div class="seatmap__row"><span class="seatmap__half">${l}</span><span class="seatmap__aisle"></span><span class="seatmap__half">${r}</span></div>`;
    });
    const total = 412;
    const html = `<div class="seatmap__stage" aria-hidden="true">무대</div>
      <div class="seatmap__house">
        ${zoneWrap('RB', '로열박스 RB-1 ~ RB-6, ₩180,000', boxes(1))}
        <div class="seatmap__orch">
          ${zoneWrap('R', '오케스트라 R석 A–F열, ₩98,000', `<span class="seatmap__zone-name">R석 · A–F열</span>${orchR}`)}
          ${zoneWrap('S', '오케스트라 S석 G–L열, ₩77,000', `<span class="seatmap__zone-name">S석 · G–L열</span>${orchS}`)}
        </div>
        ${zoneWrap('RB', '로열박스 RB-1 ~ RB-6, ₩180,000', boxes(4))}
      </div>
      ${zoneWrap('BC', '2층 발코니 BC-01 ~ BC-124, ₩55,000', `<span class="seatmap__zone-name">2층 발코니 · BC-01 – BC-124</span><div class="seatmap__balcony">${bc}</div>`)}
      <p class="seatmap__legend"><span><i class="seat"></i>판매</span><span><i class="seat" data-s="open"></i>잔여</span>${marks.length ? `<span><i class="seat" data-s="mark"></i>${esc(marks.join(' · '))}</span>` : ''}</p>`;
    sm.innerHTML = html;
    const open = total - sold;
    const sum = sm.dataset.summary !== 'off' ? `<p class="seatmap__summary">${preset.label} · ${total}석 중 <b>${sold}</b>석 판매 · 잔여 <b>${open}</b>석</p>` : '';
    sm.insertAdjacentHTML('beforeend', sum);
    if (!pick) { sm.setAttribute('role', 'img'); sm.setAttribute('aria-label', `${preset.label} 객석 도식: ${total}석 중 ${sold}석 판매, 잔여 ${open}석${marks.length ? `, 표시 좌석 ${marks.join(', ')}` : ''}`); }
    else sm.setAttribute('role', 'group');
  }
  function initSeatmap(sm) {
    if (sm.dataset.gnSm) return; sm.dataset.gnSm = '1';
    renderSeatmap(sm);
    if (sm.hasAttribute('data-pick')) sm.addEventListener('click', (e) => {
      const z = e.target.closest('button.seatmap__zone'); if (!z) return;
      sm.dataset.zone = z.dataset.zone;
      $$('button.seatmap__zone', sm).forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.zone === z.dataset.zone)));
      emit(sm, 'gn:zone', { zone: z.dataset.zone, label: z.getAttribute('aria-label') });
    });
  }

  /* ── 21. 코드 블록 ────────────────────────────────────────────────────── */
  function initCode(c) {
    if (c.dataset.gnCode) return; c.dataset.gnCode = '1';
    const code = $('.code__pre code', c); if (!code) return;
    const pre = code.parentElement; pre.tabIndex = 0;
    if (!pre.hasAttribute('aria-label')) pre.setAttribute('aria-label', ($('.code__name', c) || {}).textContent || '코드');
    const lines = code.innerHTML.replace(/\n$/, '').split('\n');
    code.innerHTML = lines.map((l) => `<span class="code__line">${l || ' '}</span>`).join('');
    const btn = $('.code__copy', c);
    if (btn) btn.addEventListener('click', async () => {
      const txt = $$('.code__line', code).map((l) => l.textContent).join('\n');
      try { await navigator.clipboard.writeText(txt); btn.dataset.copied = ''; btn.textContent = '복사했습니다'; }
      catch (e) { btn.textContent = '선택해 복사하세요'; }
      setTimeout(() => { delete btn.dataset.copied; btn.textContent = '복사'; }, 1800);
    });
  }

  /* ── 22. 바쁨(로딩) 버튼 ──────────────────────────────────────────────── */
  function busy(btn, ms = 1200, fail = false) {
    if (btn.getAttribute('aria-busy') === 'true') return Promise.resolve();
    const label = $('.btn__label', btn) || btn;
    const orig = label.innerHTML;
    btn.setAttribute('aria-busy', 'true');
    btn.removeAttribute('data-state');
    const sp = doc.createElement('span'); sp.className = 'spinner spinner--btn'; sp.setAttribute('aria-hidden', 'true');
    btn.prepend(sp);
    if (btn.dataset.busyText && label !== btn) label.textContent = btn.dataset.busyText;
    return new Promise((res) => setTimeout(() => {
      sp.remove(); btn.removeAttribute('aria-busy');
      if (label !== btn) label.innerHTML = orig;
      if (fail) { btn.dataset.state = 'error'; if (label !== btn) label.textContent = btn.dataset.failText || '다시 시도'; }
      res();
    }, reduced() ? Math.min(ms, 600) : ms));
  }

  /* ── 23. 전역 위임 ───────────────────────────────────────────────────── */
  doc.addEventListener('click', (e) => {
    const t = e.target;
    const tt = t.closest('[data-theme-toggle]'); if (tt) { e.preventDefault(); toggleTheme(); return; }
    const op = t.closest('[data-open]'); if (op) { e.preventDefault(); openOverlay(doc.getElementById(op.dataset.open), op); }
    const cl = t.closest('[data-close]'); if (cl) { const ov = cl.closest('.overlay'); if (ov) closeOverlay(ov); }
    const co = t.closest('[data-cmd-open]'); if (co) { e.preventDefault(); openOverlay($('.overlay.cmd'), co); }
    const sb = t.closest('[data-sidebar-toggle]'); if (sb) { e.preventDefault(); const el = doc.getElementById(sb.getAttribute('aria-controls')) || $('.sidebar'); el && el.classList.contains('is-open') ? closeSidebar(el) : openSidebar(el, sb); }
    const sbc = t.closest('[data-sidebar-close]'); if (sbc) { closeSidebar(sbc.closest('.sidebar')); }
    const nv = t.closest('[data-nav-toggle]'); if (nv) toggleNavSheet(nv);
    const pt = t.closest('[data-popover]'); if (pt) { e.preventDefault(); togglePopover(pt); }
    const pc = t.closest('[data-popover-close]'); if (pc) { const p = pc.closest('.popover'); const tr = p && doc.querySelector(`[aria-controls="${p.id}"]`); if (tr) { togglePopover(tr, false); tr.focus(); } }
    const acc = t.closest('.acc__trigger'); if (acc && !acc.disabled) toggleAcc(acc);
    const seg = t.closest('.seg__btn'); if (seg && !seg.disabled) pressSeg(seg);
    const srt = t.closest('.table__sort'); if (srt) sortTable(srt);
    const pg = t.closest('[data-page]'); if (pg && pg.closest('[data-pager-for]') && pg.getAttribute('aria-disabled') !== 'true') { const pager = pg.closest('[data-pager-for]'); renderPager(pager, parseInt(pg.dataset.page, 10)); $('[aria-current="page"]', pager)?.focus(); }
    else if (pg && pg.closest('.pager') && !pg.closest('[data-pager-for]') && pg.tagName === 'BUTTON') { const pager = pg.closest('.pager'); $$('.pager__link', pager).forEach((l) => l.removeAttribute('aria-current')); const tgt = $(`.pager__link[data-page="${pg.dataset.page}"]`, pager); if (tgt) tgt.setAttribute('aria-current', 'page'); emit(pager, 'gn:page', { page: pg.dataset.page }); }
    const row = t.closest('table[data-selectable] tbody tr'); if (row && !t.closest('a, button, input')) { $$('tr[aria-selected="true"]', row.parentElement).forEach((r) => r !== row && r.setAttribute('aria-selected', 'false')); row.setAttribute('aria-selected', String(row.getAttribute('aria-selected') !== 'true')); emit(row, 'gn:row', { row }); }
    const lr = t.closest('.list[data-selectable] .list__row'); if (lr) { $$('.list__row', lr.closest('.list')).forEach((r) => r.setAttribute('aria-selected', String(r === lr))); lr.classList.remove('is-unread'); emit(lr, 'gn:select', { row: lr }); }
    const stp = t.closest('[data-stepper]'); if (stp) { const st = stp.closest('.stepper'); const inp = $('.stepper__value', st); inp.value = (parseInt(inp.value || '0', 10) || 0) + Number(stp.dataset.stepper); stepperSync(st); }
    const sc = t.closest('[data-steps-go]'); if (sc) { const steps = doc.getElementById(sc.dataset.stepsTarget); if (steps) { const cur = parseInt(steps.dataset.step || $$('.steps__item', steps).findIndex((i) => i.getAttribute('aria-current') === 'step'), 10) || 0; setStep(steps, sc.dataset.stepsGo === 'next' ? cur + 1 : sc.dataset.stepsGo === 'prev' ? cur - 1 : parseInt(sc.dataset.stepsGo, 10)); } }
    const rp = t.closest('[data-replay]'); if (rp) { const el = doc.getElementById(rp.dataset.replay); if (el) play(el, rp.dataset.motion || el.dataset.motion); }
    const dm = t.closest('[data-dismiss]'); if (dm) { const el = dm.dataset.dismiss ? doc.getElementById(dm.dataset.dismiss) : dm.closest('.alert'); if (el) { el.classList.add('is-leaving'); setTimeout(() => el.remove(), reduced() ? 0 : 260); } }
    const bz = t.closest('[data-busy]'); if (bz && !bz.closest('form[data-validate]')) { e.preventDefault(); busy(bz, parseInt(bz.dataset.busy || '1200', 10), bz.hasAttribute('data-busy-fail')).then(() => { if (bz.dataset.toast && !bz.hasAttribute('data-busy-fail')) toast({ title: bz.dataset.toast, text: bz.dataset.toastText, tone: bz.dataset.toastTone }); }); return; }
    const ts = t.closest('[data-toast]'); if (ts && !ts.closest('.cmd__list') && !ts.closest('form[data-validate] [type="submit"]')) toast({ title: ts.dataset.toast, text: ts.dataset.toastText, tone: ts.dataset.toastTone });
    // 바깥 클릭: 메뉴 · 팝오버 닫기
    if (openMenuEl && !openMenuEl.menu.contains(t) && !openMenuEl.trigger.contains(t)) closeMenu(false);
    if (openPop && !openPop.pop.contains(t) && !openPop.trigger.contains(t)) togglePopover(openPop.trigger, false);
  });

  doc.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
      const cmd = $('.overlay.cmd');
      if (cmd) { e.preventDefault(); cmd.classList.contains('is-open') ? closeOverlay(cmd) : openOverlay(cmd); }
      return;
    }
    if (e.key === 'Escape') {
      if (tipFor) { hideTip(); }
      if (openMenuEl) { e.preventDefault(); closeMenu(); return; }
      if (openPop) { e.preventDefault(); const tr = openPop.trigger; togglePopover(tr, false); tr.focus(); return; }
      const s = top();
      if (s) { e.preventDefault(); s.kind === 'sidebar' ? closeSidebar(s.el) : closeOverlay(s.el); return; }
      const nv = $('[data-nav-toggle][aria-expanded="true"]'); if (nv) { toggleNavSheet(nv, false); nv.focus(); }
      return;
    }
    if (e.key === 'Tab') {
      const s = top();
      if (s) trapTab(e, s.kind === 'sidebar' ? s.el : panelOf(s.el));
    }
    const card = e.target.closest && e.target.closest('.list__row');
    if (card && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) { const rows = $$('.list__row', card.closest('.list')); const i = rows.indexOf(card); const n = rows[i + (e.key === 'ArrowDown' ? 1 : -1)]; if (n) { e.preventDefault(); n.focus(); } }
    const at = e.target.closest && e.target.closest('.acc__trigger');
    if (at && ['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(e.key)) {
      const ts = $$('.acc__trigger:not(:disabled)', at.closest('.acc')); const i = ts.indexOf(at);
      const n = e.key === 'Home' ? 0 : e.key === 'End' ? ts.length - 1 : (i + (e.key === 'ArrowDown' ? 1 : -1) + ts.length) % ts.length;
      e.preventDefault(); ts[n].focus();
    }
  });

  doc.addEventListener('input', (e) => {
    const t = e.target;
    if (t.matches('[data-mask="phone"]')) maskPhone(t);
    if (t.matches('[data-count]')) syncCount(t);
    if (t.getAttribute('aria-invalid') === 'true') validateInput(t);
    if (t.matches('.stepper__value')) stepperSync(t.closest('.stepper'));
  });
  doc.addEventListener('change', (e) => {
    const t = e.target;
    if (t.matches('.switch input')) { syncSwitch(t); emit(t, 'gn:switch', { checked: t.checked }); }
    if (t.matches('form[data-validate] input[type="checkbox"]') && t.getAttribute('aria-invalid') === 'true') validateInput(t);
  });
  doc.addEventListener('focusout', (e) => {
    const t = e.target;
    if (t.matches && t.matches('form[data-validate] .input, form[data-validate] .select, form[data-validate] .textarea') && t.value) validateInput(t);
  });
  doc.addEventListener('submit', (e) => {
    const f = e.target;
    if (!f.matches('form[data-validate]')) return;
    e.preventDefault();
    const inputs = $$('input, select, textarea', f).filter((i) => !i.disabled && i.type !== 'hidden' && (i.required || i.dataset.mask || i.pattern || i.type === 'email'));
    const bad = inputs.filter((i) => !validateInput(i));
    const sum = $('.form__summary', f);
    if (bad.length) {
      if (sum) { sum.hidden = false; const tx = $('.alert__text', sum); if (tx) tx.textContent = `${bad.length}개 항목을 확인해 주십시오. 첫 항목으로 이동했습니다.`; }
      bad[0].focus();
      return;
    }
    if (sum) sum.hidden = true;
    const btn = e.submitter || $('[type="submit"]', f);
    const fin = () => { emit(f, 'gn:submit', { data: new FormData(f) }); if (f.dataset.successToast) toast({ title: f.dataset.successToast, text: f.dataset.successText, tone: 'ok' }); };
    btn && btn.hasAttribute('data-busy') ? busy(btn, parseInt(btn.dataset.busy || '1200', 10)).then(fin) : fin();
  });

  // 툴팁
  doc.addEventListener('mouseover', (e) => { const t = e.target.closest && e.target.closest('[data-tip]'); if (t && t !== tipFor) { clearTimeout(tipTimer); tipTimer = setTimeout(() => showTip(t), 120); } });
  doc.addEventListener('mouseout', (e) => { const t = e.target.closest && e.target.closest('[data-tip]'); if (t && !t.contains(e.relatedTarget)) hideTip(); });
  doc.addEventListener('focusin', (e) => { const t = e.target.closest && e.target.closest('[data-tip]'); if (t) showTip(t); });
  doc.addEventListener('focusout', (e) => { const t = e.target.closest && e.target.closest('[data-tip]'); if (t) hideTip(); });
  window.addEventListener('scroll', () => { if (tipFor) hideTip(); }, { passive: true });
  window.addEventListener('resize', () => {
    if (openPop) placePopover(openPop.pop);
    const nv = $('[data-nav-toggle][aria-expanded="true"]'); if (nv && window.innerWidth > 860) toggleNavSheet(nv, false);
  });

  /* ── 24. 시작 ─────────────────────────────────────────────────────────── */
  function init(scope = doc) {
    hydrateIcons(scope);
    initMenus(scope);
    initTabs(scope);
    initAcc(scope);
    initForms(scope);
    $$('.carousel', scope).forEach(initCarousel);
    $$('.kanban', scope).forEach(initKanban);
    $$('[data-pager-for]', scope).forEach((p) => renderPager(p, parseInt(p.dataset.page || '1', 10)));
    $$('.marquee', scope).forEach(initMarquee);
    $$('[data-cal]', scope).forEach(initCal);
    $$('.cmd__panel', scope).forEach(initCommand);
    $$('[data-seatmap]', scope).forEach(initSeatmap);
    $$('.code', scope).forEach(initCode);
    $$('[data-stagger]', scope).forEach(staggerIndex);
    $$('[data-popover]', scope).forEach((t) => { t.setAttribute('aria-expanded', 'false'); const p = doc.getElementById(t.getAttribute('aria-controls')); if (p && !p.classList.contains('is-static')) p.hidden = true; if (p && !p.querySelector('.popover__tail')) p.insertAdjacentHTML('afterbegin', '<span class="popover__tail" aria-hidden="true"></span>'); });
    $$('.popover.is-static', scope).forEach((p) => { if (!p.querySelector('.popover__tail')) p.insertAdjacentHTML('afterbegin', '<span class="popover__tail" aria-hidden="true"></span>'); });
    $$('.overlay', scope).forEach((o) => { if (!o.classList.contains('is-open')) o.hidden = true; });
    $$('[data-nav-toggle]', scope).forEach((b) => { b.setAttribute('aria-expanded', 'false'); const s = doc.getElementById(b.getAttribute('aria-controls')); if (s) s.hidden = true; });
    $$('[data-sidebar-toggle]', scope).forEach((b) => b.setAttribute('aria-expanded', 'false'));
    $$('.steps[data-step]', scope).forEach((s) => setStep(s, parseInt(s.dataset.step, 10)));
    $$('[data-scrollspy]', scope).forEach(initScrollspy);
  }

  initTheme();
  const boot = () => { init(); initSidebar(); initReveal(); applyTheme(root.getAttribute('data-theme'), false); };
  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', boot); else boot();

  window.gn = { toast, open: (id, trig) => openOverlay(typeof id === 'string' ? doc.getElementById(id) : id, trig), close: (id) => closeOverlay(typeof id === 'string' ? doc.getElementById(id) : id), setTheme: (t) => applyTheme(t, true), toggleTheme, setStep, busy, play, init, hydrateIcons, describeDay: (s) => describeDay(parseISO(s)), showsOn: (s) => showsOn(parseISO(s)) };
})();
