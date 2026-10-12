/* ==========================================================================
   ledgerline · app.js — 바닐라 인터랙션 (외부 라이브러리 없음)
   마크업 계약은 COMPONENTS.md 참조. 전역 API: window.ll
   ========================================================================== */
(() => {
  'use strict';

  const doc = document;
  const root = doc.documentElement;
  const $ = (s, c = doc) => c.querySelector(s);
  const $$ = (s, c = doc) => Array.from(c.querySelectorAll(s));
  const mq = (q) => window.matchMedia(q).matches;
  const reduced = () => mq('(prefers-reduced-motion: reduce)');
  const reflow = (el) => void el.offsetWidth;
  let uidN = 0;
  const uid = (p = 'll') => `${p}-${++uidN}`;
  const ensureId = (el, p) => el.id || (el.id = uid(p));
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const fmtKRW = (n) => (n < 0 ? '−' : '') + '₩' + Math.abs(Math.round(n)).toLocaleString('ko-KR');
  const parseNum = (s) => {
    if (s == null) return NaN;
    const t = String(s).replace(/[−–]/g, '-').replace(/[^0-9.\-]/g, '');
    return t === '' || t === '-' ? NaN : parseFloat(t);
  };
  const emit = (el, name, detail) => el.dispatchEvent(new CustomEvent(name, { bubbles: true, detail }));

  /* ── 1. 아이콘 ─────────────────────────────────────────────────────────
     <span data-icon="search"></span> → 16px 라인 아이콘 (currentColor) */
  const ICONS = {
    search: '<circle cx="7" cy="7" r="4.5"/><path d="m10.5 10.5 3.5 3.5"/>',
    bell: '<path d="M4 11V7a4 4 0 0 1 8 0v4l1.2 1.5H2.8Z"/><path d="M6.5 14.5h3"/>',
    sun: '<circle cx="8" cy="8" r="2.75"/><path d="M8 1.5V3M8 13v1.5M1.5 8H3M13 8h1.5M3.4 3.4l1.06 1.06M11.54 11.54l1.06 1.06M3.4 12.6l1.06-1.06M11.54 4.46l1.06-1.06"/>',
    moon: '<path d="M13.5 9.6A5.75 5.75 0 0 1 6.4 2.5a5.75 5.75 0 1 0 7.1 7.1Z"/>',
    close: '<path d="m4 4 8 8M12 4l-8 8"/>',
    'chevron-left': '<path d="M10 3.5 5.5 8l4.5 4.5"/>',
    'chevron-right': '<path d="M6 3.5 10.5 8 6 12.5"/>',
    'chevron-down': '<path d="M3.5 6 8 10.5 12.5 6"/>',
    'chevron-up': '<path d="M3.5 10 8 5.5l4.5 4.5"/>',
    check: '<path d="M3 8.5 6.5 12 13 4.5"/>',
    plus: '<path d="M8 3v10M3 8h10"/>',
    minus: '<path d="M3 8h10"/>',
    more: '<path d="M3.5 8h.01M8 8h.01M12.5 8h.01" stroke-width="2.4"/>',
    grip: '<path d="M6 4h.01M10 4h.01M6 8h.01M10 8h.01M6 12h.01M10 12h.01" stroke-width="2.2"/>',
    menu: '<path d="M2.5 4.5h11M2.5 8h11M2.5 11.5h11"/>',
    info: '<circle cx="8" cy="8" r="6.25"/><path d="M8 7.25V11M8 5v.01"/>',
    alert: '<path d="M8 2.25 14.25 13.5H1.75Z"/><path d="M8 6.5v3M8 11.5v.01"/>',
    'x-circle': '<circle cx="8" cy="8" r="6.25"/><path d="m6 6 4 4M10 6l-4 4"/>',
    'check-circle': '<circle cx="8" cy="8" r="6.25"/><path d="m5.4 8.2 1.8 1.8 3.4-3.8"/>',
    copy: '<rect x="5.5" y="5.5" width="8" height="8" rx="1"/><path d="M10.5 5.5v-2a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2"/>',
    upload: '<path d="M8 10.5V2.5M5 5.5l3-3 3 3M2.5 10.5v2a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1v-2"/>',
    download: '<path d="M8 2.5v8M5 7.5l3 3 3-3M2.5 10.5v2a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1v-2"/>',
    pause: '<path d="M6 3.5v9M10 3.5v9"/>',
    play: '<path d="M5 3.25v9.5L12.5 8Z"/>',
    'arrow-right': '<path d="M2.5 8h11M9.5 4l4 4-4 4"/>',
    'arrow-left': '<path d="M13.5 8h-11M6.5 4l-4 4 4 4"/>',
    'arrow-up-right': '<path d="M5 11 11 5M6 5h5v5"/>',
    doc: '<path d="M3.5 1.5h6l3 3v10h-9Z"/><path d="M9.5 1.5v3h3M5.75 8h4.5M5.75 10.5h4.5"/>',
    receipt: '<path d="M3.5 1.5h9v13l-1.5-1-1.5 1-1.5-1-1.5 1-1.5-1-1.5 1Z"/><path d="M6 5h4M6 7.5h4M6 10h2.5"/>',
    card: '<rect x="1.5" y="3.5" width="13" height="9" rx="1.5"/><path d="M1.5 6.5h13M4 10h3"/>',
    inbox: '<path d="M1.5 9h3.5l1 2h4l1-2h3.5"/><path d="M3 3.5h10l1.5 5.5v4.5h-13V9Z"/>',
    grid: '<path d="M2 2h5v5H2ZM9 2h5v3H9ZM9 7h5v7H9ZM2 9h5v5H2Z"/>',
    columns: '<path d="M2 2.5h3.5v11H2ZM6.25 2.5h3.5v7h-3.5ZM10.5 2.5H14v9h-3.5Z"/>',
    sliders: '<path d="M2 4.5h7M12 4.5h2M2 11.5h2M7 11.5h7"/><circle cx="10.5" cy="4.5" r="1.5"/><circle cx="5.5" cy="11.5" r="1.5"/>',
    user: '<circle cx="8" cy="5.5" r="2.75"/><path d="M2.5 14c.7-2.6 2.9-4 5.5-4s4.8 1.4 5.5 4"/>',
    users: '<circle cx="6" cy="5.5" r="2.5"/><path d="M1.5 13.5c.5-2.3 2.2-3.5 4.5-3.5s4 1.2 4.5 3.5M10.5 3.2a2.5 2.5 0 0 1 0 4.6M12 10.2c1.3.5 2.2 1.6 2.5 3.3"/>',
    calendar: '<rect x="2" y="3" width="12" height="11" rx="1"/><path d="M2 6.5h12M5 1.5v3M11 1.5v3"/>',
    stamp: '<path d="M6 9.5V7.7a2.5 2.5 0 1 1 4 0v1.8"/><path d="M2.5 9.5h11v2.25h-11ZM3.5 14h9"/>',
    filter: '<path d="M2 3h12L9.5 8.5V13l-3-1.5v-3Z"/>',
    lock: '<rect x="3" y="7" width="10" height="7.5" rx="1"/><path d="M5 7V5a3 3 0 0 1 6 0v2"/>',
    help: '<circle cx="8" cy="8" r="6.25"/><path d="M6.3 6.2a1.8 1.8 0 1 1 2.4 1.7c-.5.2-.7.6-.7 1.1v.3M8 11.3v.01"/>',
    building: '<path d="M2.5 14.5v-12h7v12M9.5 6.5h4v8M1.5 14.5h13M5 5h2M5 8h2M5 11h2"/>',
    code: '<path d="M5.5 4.5 2 8l3.5 3.5M10.5 4.5 14 8l-3.5 3.5"/>',
    trash: '<path d="M2.5 4h11M6 4V2.5h4V4M4 4l.7 10h6.6L12 4"/>',
    edit: '<path d="M10.5 2.5l3 3L6 13H3v-3Z"/>',
    refresh: '<path d="M13.5 8a5.5 5.5 0 1 1-1.6-3.9M13.5 2.5v3h-3"/>',
    chart: '<path d="M2 13.5h12M4 11V7.5M7 11V4M10 11V8.5M13 11V5.5"/>',
    link: '<path d="M6.5 9.5l3-3M7 4.5l1-1a2.83 2.83 0 0 1 4 4l-1 1M9 11.5l-1 1a2.83 2.83 0 0 1-4-4l1-1"/>',
    logout: '<path d="M6 2.5H3v11h3M10 5l3 3-3 3M13 8H6"/>',
    clock: '<circle cx="8" cy="8" r="6.25"/><path d="M8 4.5V8l2.5 1.5"/>',
    send: '<path d="M14 2 7 9M14 2l-4.5 12-2.5-5-5-2.5Z"/>',
    paperclip: '<path d="m13 7.5-5.3 5.3a3.2 3.2 0 0 1-4.5-4.5l5.6-5.6a2.1 2.1 0 0 1 3 3L6.2 11.3a1 1 0 0 1-1.5-1.5L10 4.5"/>',
    'external': '<path d="M9 2.5h4.5V7M13.5 2.5 7.5 8.5M11.5 9.5v3a1 1 0 0 1-1 1h-7a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1h3"/>',
    keyboard: '<rect x="1.5" y="3.5" width="13" height="9" rx="1"/><path d="M4 6.5h.01M6.5 6.5h.01M9 6.5h.01M11.5 6.5h.01M4.5 9.5h7"/>',
    sort: '<path d="M5 3v10M2.5 10.5 5 13l2.5-2.5M11 13V3M8.5 5.5 11 3l2.5 2.5"/>',
    wallet: '<path d="M2 4.5h11a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1Z"/><path d="M2 4.5 10.5 2v2.5M11 9h.01"/>',
  };
  function hydrateIcons(scope = doc) {
    $$('[data-icon]', scope).forEach((el) => {
      if (el.firstElementChild && el.dataset.iconDone === el.dataset.icon) return;
      const p = ICONS[el.dataset.icon];
      if (!p) return;
      el.classList.add('icon');
      el.setAttribute('aria-hidden', 'true');
      el.innerHTML = `<svg viewBox="0 0 16 16" focusable="false">${p}</svg>`;
      el.dataset.iconDone = el.dataset.icon;
    });
  }
  function setIcon(el, name) { if (!el) return; el.dataset.icon = name; delete el.dataset.iconDone; el.innerHTML = ''; hydrateIcons(el.parentNode || doc); }

  /* ── 2. 테마: URL ?theme= 최우선 → localStorage → 시스템 ──────────── */
  const THEME_KEY = 'll-theme';
  const urlTheme = () => { const t = new URLSearchParams(location.search).get('theme'); return t === 'dark' || t === 'light' ? t : null; };
  const storedTheme = () => { try { const t = localStorage.getItem(THEME_KEY); return t === 'dark' || t === 'light' ? t : null; } catch (e) { return null; } };
  const systemTheme = () => (mq('(prefers-color-scheme: dark)') ? 'dark' : 'light');
  function applyTheme(t) {
    root.setAttribute('data-theme', t);
    $$('[data-theme-toggle]').forEach((b) => {
      b.setAttribute('aria-pressed', String(t === 'dark'));
      b.setAttribute('aria-label', t === 'dark' ? '라이트 모드로 전환' : '다크 모드로 전환');
      if (b.hasAttribute('data-tooltip')) b.dataset.tooltip = t === 'dark' ? '라이트 모드' : '다크 모드';
    });
    emit(doc, 'll:theme', { theme: t });
  }
  applyTheme(urlTheme() || storedTheme() || systemTheme());
  try {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      if (!urlTheme() && !storedTheme()) applyTheme(systemTheme());
    });
  } catch (e) { /* 구형 브라우저 */ }
  function toggleTheme() {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem(THEME_KEY, next); } catch (e) { /* 저장 불가 환경 */ }
    applyTheme(next);
  }

  /* ── 3. 오버레이 스택 (modal · drawer · command · sidebar · popover · menu) ── */
  const FOCUSABLE = 'a[href],area[href],button:not([disabled]),input:not([disabled]):not([type="hidden"]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"]),[contenteditable="true"]';
  const visible = (n) => !!(n.offsetWidth || n.offsetHeight || n.getClientRects().length);
  const focusables = (el) => $$(FOCUSABLE, el).filter((n) => visible(n) && !n.closest('[hidden],[inert]'));
  const stack = [];
  const top = () => stack[stack.length - 1];
  const kindOf = (el) => (el.classList.contains('popover') || el.classList.contains('menu') ? 'float' : 'dialog');
  const panelOf = (el) => $('.modal__panel, .drawer__panel, .command__panel', el) || el;
  let scrimEl = null;

  function lockScroll() { root.classList.toggle('is-locked', stack.some((s) => s.lock)); }

  function openOverlay(el, trigger) {
    if (typeof el === 'string') el = doc.getElementById(el);
    if (!el || stack.some((s) => s.el === el)) return;
    const kind = kindOf(el);
    const isSidebar = el.classList.contains('sidebar');
    if (isSidebar && !mq('(max-width: 1024px)')) return;
    const entry = { el, trigger: trigger || null, kind, lock: kind === 'dialog', panel: panelOf(el), wasHidden: el.hidden };
    if (kind === 'float') stack.filter((s) => s.kind === 'float' && !s.el.contains(el)).forEach((s) => closeOverlay(s.el, { restore: false }));
    el.hidden = false;
    if (isSidebar) {
      if (!scrimEl) { scrimEl = doc.createElement('div'); scrimEl.className = 'll-scrim'; scrimEl.setAttribute('aria-hidden', 'true'); }
      el.parentNode.insertBefore(scrimEl, el);
      scrimEl.hidden = false; reflow(scrimEl); scrimEl.dataset.state = 'open';
      el.setAttribute('role', el.getAttribute('role') || 'dialog');
      el.setAttribute('aria-modal', 'true');
    }
    if (kind === 'float' && trigger) place(el, trigger);
    reflow(el);
    el.dataset.state = 'open';
    if (trigger) trigger.setAttribute('aria-expanded', 'true');
    stack.push(entry);
    lockScroll();
    const auto = $('[autofocus]', el);
    const first = auto || (kind === 'dialog' ? focusables(entry.panel)[0] : null);
    const target = first || entry.panel;
    if (target === entry.panel && !entry.panel.hasAttribute('tabindex')) entry.panel.setAttribute('tabindex', '-1');
    if (!(kind === 'float' && el.classList.contains('menu'))) requestAnimationFrame(() => target.focus({ preventScroll: true }));
    emit(el, 'll:open', { trigger });
  }

  function closeOverlay(el, { restore = true } = {}) {
    if (typeof el === 'string') el = doc.getElementById(el);
    const i = stack.findIndex((s) => s.el === el);
    if (i < 0) return;
    const entry = stack[i];
    stack.splice(i, 1);
    el.dataset.state = 'closed';
    if (entry.trigger) entry.trigger.setAttribute('aria-expanded', 'false');
    if (el.classList.contains('sidebar')) {
      el.removeAttribute('aria-modal');
      if (scrimEl) { scrimEl.dataset.state = 'closed'; const s = scrimEl; setTimeout(() => { if (s.dataset.state === 'closed') s.remove(); }, reduced() ? 0 : 240); }
    }
    if (entry.wasHidden) setTimeout(() => { if (el.dataset.state === 'closed') el.hidden = true; }, reduced() ? 0 : entry.kind === 'float' ? 160 : 240);
    lockScroll();
    if (restore && entry.trigger && doc.contains(entry.trigger)) entry.trigger.focus({ preventScroll: true });
    emit(el, 'll:close', {});
  }
  function toggleOverlay(el, trigger) {
    if (typeof el === 'string') el = doc.getElementById(el);
    if (!el) return;
    if (stack.some((s) => s.el === el)) closeOverlay(el); else openOverlay(el, trigger);
  }

  function place(el, trigger) {
    el.style.left = '0px'; el.style.top = '0px';
    const r = trigger.getBoundingClientRect();
    const w = el.offsetWidth, h = el.offsetHeight, vw = window.innerWidth, vh = window.innerHeight, gap = 6;
    const align = el.dataset.align || (r.left + w > vw - 8 ? 'end' : 'start');
    let left = align === 'end' ? r.right - w : r.left;
    left = Math.max(8, Math.min(left, vw - w - 8));
    let topPx = r.bottom + gap;
    if (topPx + h > vh - 8 && r.top - gap - h > 8) topPx = r.top - gap - h;
    el.style.left = `${Math.round(left)}px`;
    el.style.top = `${Math.round(topPx)}px`;
  }
  function replaceFloats() { stack.filter((s) => s.kind === 'float' && s.trigger).forEach((s) => place(s.el, s.trigger)); }
  window.addEventListener('resize', () => { replaceFloats(); if (!mq('(max-width: 1024px)')) stack.filter((s) => s.el.classList.contains('sidebar')).forEach((s) => closeOverlay(s.el, { restore: false })); $$('.tabs').forEach(syncInk); });
  window.addEventListener('scroll', replaceFloats, { passive: true, capture: true });

  /* 포커스 트랩 */
  function trapTab(e) {
    const t = top();
    if (!t || t.kind !== 'dialog') return;
    const f = focusables(t.panel);
    if (!f.length) { e.preventDefault(); t.panel.focus(); return; }
    const first = f[0], last = f[f.length - 1];
    if (!t.panel.contains(doc.activeElement)) { e.preventDefault(); first.focus(); return; }
    if (e.shiftKey && doc.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && doc.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  /* ── 4. 메뉴 (role="menu") ───────────────────────────────────────────── */
  const menuItems = (menu) => $$('[role^="menuitem"]', menu).filter((i) => i.getAttribute('aria-disabled') !== 'true' && visible(i));
  function openMenu(menu, trigger, focusLast = false) {
    openOverlay(menu, trigger);
    const items = menuItems(menu);
    requestAnimationFrame(() => (focusLast ? items[items.length - 1] : items[0])?.focus());
  }
  function menuKey(e, menu) {
    const items = menuItems(menu);
    const i = items.indexOf(doc.activeElement);
    let n = null;
    if (e.key === 'ArrowDown') n = items[(i + 1) % items.length];
    else if (e.key === 'ArrowUp') n = items[(i - 1 + items.length) % items.length];
    else if (e.key === 'Home') n = items[0];
    else if (e.key === 'End') n = items[items.length - 1];
    else if (e.key === 'Tab') { closeOverlay(menu, { restore: false }); return; }
    else if (e.key.length === 1 && /\S/.test(e.key)) {
      const k = e.key.toLowerCase();
      n = items.slice(i + 1).concat(items.slice(0, i + 1)).find((it) => it.textContent.trim().toLowerCase().startsWith(k));
    }
    if (n) { e.preventDefault(); n.focus(); }
  }
  function activateMenuItem(item) {
    const menu = item.closest('.menu');
    if (item.getAttribute('aria-disabled') === 'true') return;
    if (item.getAttribute('role') === 'menuitemradio') {
      const group = item.closest('[role="group"]') || menu;
      $$('[role="menuitemradio"]', group).forEach((r) => r.setAttribute('aria-checked', String(r === item)));
    } else if (item.getAttribute('role') === 'menuitemcheckbox') {
      item.setAttribute('aria-checked', String(item.getAttribute('aria-checked') !== 'true'));
      return;
    }
    const entry = stack.find((s) => s.el === menu);
    const trigger = entry && entry.trigger;
    if (trigger && item.dataset.value != null) {
      const label = $('[data-menu-label]', trigger);
      if (label) label.textContent = item.dataset.value;
    }
    if (menu) closeOverlay(menu);
    emit(item, 'll:menu', { value: item.dataset.value, trigger });
  }

  /* ── 5. 툴팁 ([data-tooltip], 300ms 지연, Esc 해제) ───────────────────── */
  let tipEl = null, tipTimer = 0, tipFor = null;
  function showTip(t) {
    if (tipFor === t) return;
    hideTip();
    if (!tipEl) {
      tipEl = doc.createElement('div');
      tipEl.className = 'tooltip'; tipEl.id = 'll-tooltip'; tipEl.setAttribute('role', 'tooltip'); tipEl.hidden = true;
      doc.body.appendChild(tipEl);
    }
    tipFor = t;
    tipEl.textContent = t.dataset.tooltip;
    if (t.dataset.tooltipKbd) { const k = doc.createElement('kbd'); k.textContent = t.dataset.tooltipKbd; tipEl.appendChild(k); }
    const prev = t.getAttribute('aria-describedby');
    if (!prev || !prev.includes('ll-tooltip')) t.setAttribute('aria-describedby', ((prev || '') + ' ll-tooltip').trim());
    tipTimer = setTimeout(() => {
      if (tipFor !== t) return;
      tipEl.hidden = false;
      const r = t.getBoundingClientRect(), w = tipEl.offsetWidth, h = tipEl.offsetHeight;
      let topPx = r.top - h - 8; if (topPx < 8) topPx = r.bottom + 8;
      const left = Math.max(8, Math.min(r.left + r.width / 2 - w / 2, window.innerWidth - w - 8));
      tipEl.style.left = `${Math.round(left)}px`; tipEl.style.top = `${Math.round(topPx)}px`;
      reflow(tipEl); tipEl.dataset.state = 'open';
    }, 300);
  }
  function hideTip() {
    clearTimeout(tipTimer);
    if (tipEl) { tipEl.dataset.state = 'closed'; tipEl.hidden = true; }
    if (tipFor) {
      const d = (tipFor.getAttribute('aria-describedby') || '').replace('ll-tooltip', '').trim();
      if (d) tipFor.setAttribute('aria-describedby', d); else tipFor.removeAttribute('aria-describedby');
      tipFor = null;
    }
  }

  /* ── 6. 탭 · 세그먼트 ─────────────────────────────────────────────────── */
  const tabsOf = (list) => $$('[role="tab"]', list).filter((t) => t.closest('[role="tablist"]') === list);
  function syncInk(tabs) {
    const list = $('.tabs__list', tabs), ink = $('.tabs__ink', tabs);
    if (!list || !ink) return;
    const sel = tabsOf(list).find((t) => t.getAttribute('aria-selected') === 'true');
    if (!sel) return;
    ink.style.setProperty('--ink-x', `${sel.offsetLeft}px`);
    ink.style.setProperty('--ink-w', `${sel.offsetWidth}px`);
  }
  function initTabs(scope) {
    $$('[role="tablist"]', scope).forEach((list) => {
      const tabs = tabsOf(list);
      if (!tabs.length) return;
      if (!tabs.some((t) => t.getAttribute('aria-selected') === 'true')) tabs[0].setAttribute('aria-selected', 'true');
      tabs.forEach((t) => {
        const sel = t.getAttribute('aria-selected') === 'true';
        t.tabIndex = sel ? 0 : -1;
        const pid = t.getAttribute('aria-controls');
        const p = pid && doc.getElementById(pid);
        if (p) { p.hidden = !sel; p.setAttribute('role', 'tabpanel'); if (!p.hasAttribute('tabindex')) p.tabIndex = 0; p.setAttribute('aria-labelledby', ensureId(t, 'tab')); }
      });
      const wrap = list.closest('.tabs');
      if (wrap && list.classList.contains('tabs__list')) {
        wrap.classList.add('tabs--js');
        if (!$('.tabs__ink', list)) { const ink = doc.createElement('span'); ink.className = 'tabs__ink'; ink.setAttribute('aria-hidden', 'true'); list.appendChild(ink); }
        syncInk(wrap);
      }
    });
  }
  function selectTab(tab, focus) {
    const list = tab.closest('[role="tablist"]');
    tabsOf(list).forEach((t) => {
      const sel = t === tab;
      t.setAttribute('aria-selected', String(sel));
      t.tabIndex = sel ? 0 : -1;
      const pid = t.getAttribute('aria-controls');
      const p = pid && doc.getElementById(pid);
      if (p) p.hidden = !sel;
    });
    if (focus) tab.focus();
    const wrap = list.closest('.tabs');
    if (wrap) syncInk(wrap);
    if (tab.dataset.density) setDensity(list, tab.dataset.density);
    emit(tab, 'll:tab', { value: tab.dataset.value });
  }
  function rovingKey(e, items, current, onMove, vertical = false) {
    const i = items.indexOf(current);
    const prevK = vertical ? 'ArrowUp' : 'ArrowLeft', nextK = vertical ? 'ArrowDown' : 'ArrowRight';
    let n = null;
    if (e.key === nextK) n = items[(i + 1) % items.length];
    else if (e.key === prevK) n = items[(i - 1 + items.length) % items.length];
    else if (e.key === 'Home') n = items[0];
    else if (e.key === 'End') n = items[items.length - 1];
    if (n) { e.preventDefault(); onMove(n); }
  }
  function setDensity(from, value) {
    const host = from.closest('[data-density-target]');
    const sel = host && host.dataset.densityTarget;
    const target = !sel || sel === 'html' ? root : $(sel);
    if (target) target.setAttribute('data-density', value);
    emit(from, 'll:density', { value });
  }
  function pressSeg(btn) {
    const group = btn.closest('.seg');
    $$('.seg__btn', group).forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
    if (btn.dataset.density) setDensity(group, btn.dataset.density);
    emit(btn, 'll:seg', { value: btn.dataset.value || btn.textContent.trim() });
  }

  /* ── 7. 아코디언 ──────────────────────────────────────────────────────── */
  function toggleAcc(trigger, force) {
    if (trigger.disabled || trigger.getAttribute('aria-disabled') === 'true') return;
    const open = force != null ? force : trigger.getAttribute('aria-expanded') !== 'true';
    const acc = trigger.closest('.acc');
    if (open && acc && acc.hasAttribute('data-single')) {
      $$('.acc__trigger[aria-expanded="true"]', acc).forEach((t) => t !== trigger && toggleAcc(t, false));
    }
    trigger.setAttribute('aria-expanded', String(open));
    const p = doc.getElementById(trigger.getAttribute('aria-controls'));
    if (p) p.hidden = !open;
  }
  function initAcc(scope) {
    $$('.acc__trigger', scope).forEach((t) => {
      const p = doc.getElementById(t.getAttribute('aria-controls'));
      if (p) { p.hidden = t.getAttribute('aria-expanded') !== 'true'; p.setAttribute('role', 'region'); p.setAttribute('aria-labelledby', ensureId(t, 'acc')); }
    });
  }

  /* ── 8. 토스트 ────────────────────────────────────────────────────────── */
  function toastRegion() {
    let r = $('.toast-region');
    if (!r) {
      r = doc.createElement('div');
      r.className = 'toast-region';
      r.setAttribute('aria-live', 'polite');
      r.setAttribute('aria-relevant', 'additions');
      doc.body.appendChild(r);
    }
    return r;
  }
  const TOAST_ICON = { success: 'check-circle', danger: 'x-circle', warning: 'alert', info: 'info' };
  function toast(opts = {}) {
    const { title = '', text = '', kind = 'info', stamp = null, action = null, duration = 5000, onAction = null } = opts;
    const region = toastRegion();
    const t = doc.createElement('div');
    t.className = `toast toast--${kind}`;
    t.setAttribute('role', kind === 'danger' ? 'alert' : 'status');
    t.style.setProperty('--toast-dur', `${duration}ms`);
    const icon = stamp ? `<span class="stamp stamp--sm">${esc(stamp)}</span>` : `<span data-icon="${TOAST_ICON[kind] || 'info'}"></span>`;
    t.innerHTML = `<div class="toast__icon">${icon}</div>
      <div class="toast__body"><p class="toast__title">${esc(title)}</p>${text ? `<p class="toast__text">${esc(text)}</p>` : ''}</div>
      <div class="toast__actions">${action ? `<button type="button" class="toast__action">${esc(action)}</button>` : ''}<button type="button" class="toast__close" aria-label="알림 닫기"><span data-icon="close"></span></button></div>
      <span class="toast__progress" aria-hidden="true"></span>`;
    region.appendChild(t);
    hydrateIcons(t);
    const s = $('.stamp', t); if (s) stampIn(s);
    const all = $$('.toast:not(.is-leaving)', region);
    if (all.length > 3) all.slice(0, all.length - 3).forEach((o) => o._dismiss && o._dismiss());
    let remaining = duration, start = Date.now(), handle = 0, gone = false;
    const dismiss = () => {
      if (gone) return; gone = true; clearTimeout(handle);
      t.classList.add('is-leaving');
      setTimeout(() => t.remove(), reduced() ? 0 : 160);
    };
    const pause = () => { if (gone || t.classList.contains('is-paused')) return; clearTimeout(handle); remaining -= Date.now() - start; t.classList.add('is-paused'); };
    const resume = () => { if (gone || t.contains(doc.activeElement) || t.matches(':hover')) return; start = Date.now(); t.classList.remove('is-paused'); handle = setTimeout(dismiss, Math.max(remaining, 800)); };
    t._dismiss = dismiss;
    if (duration > 0) handle = setTimeout(dismiss, duration); else t.classList.add('is-paused');
    t.addEventListener('mouseenter', pause);
    t.addEventListener('mouseleave', resume);
    t.addEventListener('focusin', pause);
    t.addEventListener('focusout', () => setTimeout(resume, 0));
    $('.toast__close', t).addEventListener('click', dismiss);
    const a = $('.toast__action', t);
    if (a) a.addEventListener('click', () => { if (onAction) onAction(); emit(t, 'll:toast-action', { title }); dismiss(); });
    return { el: t, dismiss };
  }

  /* ── 9. 도장 · 결재 ───────────────────────────────────────────────────── */
  function stampIn(stampEl) {
    stampEl.classList.remove('is-stamping');
    reflow(stampEl);
    stampEl.classList.add('is-stamping');
    const cell = stampEl.closest('.apv__cell');
    if (cell) {
      cell.classList.remove('is-just-stamped'); reflow(cell); cell.classList.add('is-just-stamped');
      setTimeout(() => cell.classList.remove('is-just-stamped'), reduced() ? 0 : 260);
    }
  }
  function replayStamps(scope, stagger = 180) {
    const stamps = $$('.stamp', scope);
    stamps.forEach((s) => { s.style.opacity = '0'; });
    stamps.forEach((s, i) => setTimeout(() => { s.style.opacity = ''; stampIn(s); }, reduced() ? 0 : 120 + i * stagger));
  }
  const pad = (n) => String(n).padStart(2, '0');
  const nowStamp = () => { const d = new Date(); return `${pad(d.getMonth() + 1)}.${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`; };
  const shortName = (name) => { const n = (name || '').replace(/\s/g, ''); return n.length > 2 ? n.slice(-2) : n; };

  function approve(apv, opts = {}) {
    if (typeof apv === 'string') apv = doc.getElementById(apv);
    if (!apv) return null;
    const cell = $('.apv__cell[data-status="current"]', apv);
    if (!cell) return null;
    const name = cell.dataset.name || ($('.apv__name', cell) || {}).textContent || '';
    const box = $('.apv__box', cell);
    cell.dataset.status = 'approved';
    box.innerHTML = `<span class="stamp" aria-label="${esc(name)} 승인">${esc(shortName(name))}</span>`;
    let time = $('.apv__time', cell);
    if (!time) { time = doc.createElement('time'); time.className = 'apv__time'; (cell.querySelector('.apv__meta') || cell).appendChild(time); }
    time.textContent = opts.time || nowStamp();
    const note = $('.apv__note', cell); if (note) note.textContent = '승인';
    stampIn($('.stamp', box));
    const next = $$('.apv__cell', apv).find((c) => c.dataset.status === 'pending');
    if (next) { next.dataset.status = 'current'; const nn = $('.apv__note', next); if (nn) nn.textContent = '결재 차례'; }
    emit(apv, 'll:approve', { name, next: next ? next.dataset.name : null });
    return { name, next: next ? (next.dataset.name || ($('.apv__name', next) || {}).textContent) : null };
  }
  function reject(apv, opts = {}) {
    if (typeof apv === 'string') apv = doc.getElementById(apv);
    if (!apv) return null;
    const cell = $('.apv__cell[data-status="current"]', apv);
    if (!cell) return null;
    const name = cell.dataset.name || ($('.apv__name', cell) || {}).textContent || '';
    cell.dataset.status = 'rejected';
    const box = $('.apv__box', cell);
    box.innerHTML = '<span class="stamp stamp--reject">반려</span>';
    if (opts.reason) box.setAttribute('data-tooltip', opts.reason);
    const note = $('.apv__note', cell); if (note) note.textContent = '반려';
    stampIn($('.stamp', box));
    emit(apv, 'll:reject', { name });
    return { name };
  }

  /* ── 10. 캐러셀 ───────────────────────────────────────────────────────── */
  function initCarousel(c) {
    if (c.dataset.llReady) return; c.dataset.llReady = '1';
    const vp = $('.carousel__viewport', c);
    if (!vp) return;
    const slides = $$('.carousel__slide', vp);
    const n = slides.length;
    const count = $('.carousel__count', c), cap = $('.carousel__caption', c), dots = $('.carousel__dots', c);
    const prev = $('[data-carousel-prev]', c), next = $('[data-carousel-next]', c);
    vp.tabIndex = 0;
    vp.setAttribute('role', 'region');
    vp.setAttribute('aria-roledescription', '캐러셀');
    if (!vp.hasAttribute('aria-label')) vp.setAttribute('aria-label', '영수증 이미지');
    if (count) count.setAttribute('aria-live', 'polite');
    slides.forEach((s, i) => { s.setAttribute('role', 'group'); s.setAttribute('aria-roledescription', '슬라이드'); s.setAttribute('aria-label', `${i + 1} / ${n}`); });
    if (dots && !dots.children.length) dots.innerHTML = slides.map(() => '<i></i>').join('');
    let cur = -1;
    const update = () => {
      const center = vp.scrollLeft + vp.clientWidth / 2;
      let best = 0, bd = Infinity;
      slides.forEach((s, i) => { const d = Math.abs(s.offsetLeft + s.offsetWidth / 2 - center); if (d < bd) { bd = d; best = i; } });
      if (best === cur) return;
      cur = best;
      if (count) count.innerHTML = `<strong>${cur + 1}</strong> / ${n}`;
      if (cap) cap.textContent = slides[cur].dataset.caption || '';
      if (prev) prev.disabled = cur === 0;
      if (next) next.disabled = cur === n - 1;
      if (dots) Array.from(dots.children).forEach((d, i) => d.setAttribute('aria-current', String(i === cur)));
    };
    const go = (i) => {
      i = Math.max(0, Math.min(n - 1, i));
      const s = slides[i];
      vp.scrollTo({ left: s.offsetLeft - (vp.clientWidth - s.offsetWidth) / 2, behavior: reduced() ? 'auto' : 'smooth' });
    };
    let raf = 0;
    vp.addEventListener('scroll', () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(update); }, { passive: true });
    vp.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); go(cur + 1); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); go(cur - 1); }
      else if (e.key === 'Home') { e.preventDefault(); go(0); }
      else if (e.key === 'End') { e.preventDefault(); go(n - 1); }
    });
    if (prev) prev.addEventListener('click', () => go(cur - 1));
    if (next) next.addEventListener('click', () => go(cur + 1));
    update();
  }

  /* ── 11. 칸반 (마우스 드래그 + 키보드) ────────────────────────────────── */
  function initKanban(k) {
    if (k.dataset.llReady) return; k.dataset.llReady = '1';
    let live = $('.kanban__live', k);
    if (!live) { live = doc.createElement('p'); live.className = 'kanban__live sr-only'; live.setAttribute('aria-live', 'assertive'); k.appendChild(live); }
    let help = $('.kanban__help', k);
    if (!help) { help = doc.createElement('p'); help.className = 'kanban__help sr-only'; help.id = uid('kb-help'); help.textContent = 'Space 키로 카드를 집고, 좌우 화살표로 단계를 옮기고, 위아래 화살표로 순서를 바꾼 뒤 Space 키로 놓습니다. Esc 키는 취소입니다.'; k.appendChild(help); }
    const say = (m) => { live.textContent = ''; setTimeout(() => { live.textContent = m; }, 30); };
    const cols = () => $$('.kanban__col', k);
    const listOf = (col) => $('.kanban__list', col);
    const colName = (col) => col.dataset.name || ($('.kanban__title', col) || {}).textContent.trim();
    const cardName = (card) => card.dataset.name || ($('.kcard__title', card) || {}).textContent.trim();
    const cards = (list) => $$('.kcard', list);
    const update = () => cols().forEach((col) => {
      const cs = cards(listOf(col));
      const sum = cs.reduce((a, c) => a + (parseNum(c.dataset.amount) || 0), 0);
      const cnt = $('.kanban__count', col), sm = $('.kanban__sum', col);
      if (cnt) cnt.textContent = `${cs.length}건`;
      if (sm) sm.textContent = fmtKRW(sum);
    });
    $$('.kcard', k).forEach((c) => {
      c.draggable = true; c.tabIndex = 0;
      c.setAttribute('aria-roledescription', '정산 카드');
      c.setAttribute('aria-describedby', help.id);
    });
    $$('.kanban__list', k).forEach((l) => l.setAttribute('role', 'list'));
    $$('.kcard', k).forEach((c) => c.setAttribute('role', 'listitem'));
    update();

    // 마우스
    let dragged = null;
    const ph = doc.createElement('div'); ph.className = 'kanban__placeholder'; ph.setAttribute('aria-hidden', 'true');
    const afterEl = (list, y) => cards(list).filter((c) => c !== dragged).find((c) => { const r = c.getBoundingClientRect(); return y < r.top + r.height / 2; }) || null;
    k.addEventListener('dragstart', (e) => {
      const c = e.target.closest('.kcard'); if (!c) return;
      dragged = c; ph.style.setProperty('--ph-h', `${c.offsetHeight}px`);
      e.dataTransfer.effectAllowed = 'move';
      try { e.dataTransfer.setData('text/plain', cardName(c)); } catch (er) { /* noop */ }
      requestAnimationFrame(() => c.classList.add('is-dragging'));
    });
    k.addEventListener('dragover', (e) => {
      const list = e.target.closest('.kanban__list'); if (!list || !dragged) return;
      e.preventDefault();
      $$('.kanban__list.is-over', k).forEach((l) => l !== list && l.classList.remove('is-over'));
      list.classList.add('is-over');
      const a = afterEl(list, e.clientY);
      if (a) list.insertBefore(ph, a); else list.appendChild(ph);
    });
    k.addEventListener('drop', (e) => {
      const list = e.target.closest('.kanban__list'); if (!list || !dragged) return;
      e.preventDefault();
      list.insertBefore(dragged, ph);
      const col = list.closest('.kanban__col');
      say(`${cardName(dragged)} 카드를 ${colName(col)} 단계로 옮겼습니다.`);
      emit(dragged, 'll:kanban-move', { to: colName(col) });
    });
    k.addEventListener('dragend', () => {
      if (dragged) dragged.classList.remove('is-dragging');
      ph.remove(); $$('.kanban__list.is-over', k).forEach((l) => l.classList.remove('is-over'));
      dragged = null; update();
    });

    // 키보드
    let grabbed = null, origin = null;
    const drop = (cancel) => {
      if (!grabbed) return;
      const c = grabbed;
      if (cancel && origin) { origin.list.insertBefore(c, origin.next); }
      c.classList.remove('is-grabbed');
      grabbed = null; origin = null; update();
      if (!cancel || k.contains(doc.activeElement)) c.focus();
      const col = c.closest('.kanban__col'); const pos = cards(listOf(col)).indexOf(c) + 1;
      say(cancel ? `이동을 취소했습니다. ${colName(col)} 단계 ${pos}번째.` : `${cardName(c)} 카드를 ${colName(col)} 단계 ${pos}번째에 놓았습니다.`);
      if (!cancel) emit(c, 'll:kanban-move', { to: colName(col) });
    };
    k.addEventListener('keydown', (e) => {
      const c = e.target.closest('.kcard'); if (!c || e.target !== c) return;
      const col = c.closest('.kanban__col'), list = listOf(col);
      const allCols = cols(), ci = allCols.indexOf(col), idx = cards(list).indexOf(c);
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        if (grabbed === c) { drop(false); return; }
        if (grabbed) drop(true);
        grabbed = c; origin = { list, next: c.nextSibling };
        c.classList.add('is-grabbed');
        say(`${cardName(c)} 카드를 집었습니다. 현재 ${colName(col)} 단계. 화살표로 옮기고 Space 키로 놓습니다.`);
        return;
      }
      if (e.key === 'Escape' && grabbed) { e.preventDefault(); e.stopPropagation(); drop(true); return; }
      const dir = { ArrowLeft: -1, ArrowRight: 1 }[e.key];
      const vdir = { ArrowUp: -1, ArrowDown: 1 }[e.key];
      if (!dir && !vdir) return;
      e.preventDefault();
      if (grabbed === c) {
        if (dir) {
          const tcol = allCols[ci + dir]; if (!tcol) return;
          const tl = listOf(tcol), tcs = cards(tl);
          tl.insertBefore(c, tcs[Math.min(idx, tcs.length)] || null);
          c.focus();
          say(`${colName(tcol)} 단계, ${cards(tl).indexOf(c) + 1}번째`);
        } else {
          const sib = cards(list)[idx + vdir]; if (!sib) return;
          if (vdir < 0) list.insertBefore(c, sib); else list.insertBefore(sib, c);
          c.focus();
          say(`${idx + vdir + 1}번째`);
        }
        update();
      } else {
        let target = null;
        if (vdir) target = cards(list)[idx + vdir];
        else { const tcol = allCols[ci + dir]; if (tcol) { const tcs = cards(listOf(tcol)); target = tcs[Math.min(idx, tcs.length - 1)]; } }
        if (target) target.focus();
      }
    });
    // 카드 이동(insertBefore) 중에도 focusout 이 발생하므로, 한 틱 뒤 실제로 칸반 밖으로 나갔을 때만 취소
    k.addEventListener('focusout', () => {
      setTimeout(() => { if (grabbed && !k.contains(doc.activeElement)) drop(true); }, 0);
    });
  }

  /* ── 12. 원장 표: 선택 · 일괄 액션 · 정렬 · 필터 ─────────────────────── */
  function tableUpdate(table) {
    const rows = $$('tbody tr', table).filter((r) => !r.classList.contains('table__empty'));
    const boxes = rows.map((r) => $('[data-row-select]', r)).filter(Boolean);
    let n = 0, sum = 0;
    rows.forEach((r) => {
      const b = $('[data-row-select]', r); if (!b) return;
      r.setAttribute('aria-selected', String(b.checked));
      if (b.checked) { n++; sum += parseNum(r.dataset.amount) || 0; }
    });
    const all = $('[data-select-all]', table);
    if (all) { all.checked = n > 0 && n === boxes.length; all.indeterminate = n > 0 && n < boxes.length; }
    const bulk = table.dataset.bulk && doc.getElementById(table.dataset.bulk);
    if (bulk) {
      bulk.hidden = n === 0;
      const c = $('[data-bulk-count]', bulk); if (c) c.textContent = `${n}건 선택`;
      const s = $('[data-bulk-sum]', bulk); if (s) s.textContent = `합계 ${fmtKRW(sum)}`;
    }
    emit(table, 'll:select', { count: n, sum });
  }
  function sortTable(th) {
    const table = th.closest('table');
    const idx = th.cellIndex;
    const dir = th.getAttribute('aria-sort') === 'ascending' ? 'descending' : 'ascending';
    $$('thead th[aria-sort]', table).forEach((h) => h !== th && h.setAttribute('aria-sort', 'none'));
    th.setAttribute('aria-sort', dir);
    const tb = table.tBodies[0];
    const rows = Array.from(tb.rows).filter((r) => !r.classList.contains('table__empty'));
    const numeric = th.classList.contains('num') || th.dataset.sort === 'number';
    const val = (r) => {
      const c = r.cells[idx]; if (!c) return '';
      const v = c.dataset.sortValue != null ? c.dataset.sortValue : c.textContent.trim();
      const n = parseNum(v);
      return numeric && !Number.isNaN(n) ? n : v;
    };
    rows.sort((a, b) => {
      const x = val(a), y = val(b);
      const r = typeof x === 'number' && typeof y === 'number' ? x - y : String(x).localeCompare(String(y), 'ko');
      return dir === 'ascending' ? r : -r;
    });
    rows.forEach((r) => tb.appendChild(r));
    const empty = $('.table__empty', tb); if (empty) tb.appendChild(empty);
    emit(table, 'll:sort', { column: idx, dir });
  }
  function filterTable(input) {
    const table = doc.getElementById(input.dataset.tableFilter);
    if (!table) return;
    const q = input.value.trim().toLowerCase().replace(/\s+/g, '');
    let shown = 0;
    $$('tbody tr', table).forEach((r) => {
      if (r.classList.contains('table__empty')) return;
      const hit = !q || r.textContent.toLowerCase().replace(/\s+/g, '').includes(q);
      r.hidden = !hit; if (hit) shown++;
    });
    const empty = $('.table__empty', table);
    if (empty) { empty.hidden = shown > 0; const qn = $('[data-empty-query]', empty); if (qn) qn.textContent = input.value.trim(); }
    const out = input.dataset.filterCount && doc.getElementById(input.dataset.filterCount);
    if (out) out.textContent = `${shown}건`;
  }
  function addRow(tbody, html) {
    if (typeof tbody === 'string') tbody = doc.getElementById(tbody);
    if (!tbody) return null;
    const tmp = doc.createElement('tbody'); tmp.innerHTML = html.trim();
    const row = tmp.firstElementChild; if (!row) return null;
    tbody.insertBefore(row, tbody.firstElementChild);
    hydrateIcons(row);
    row.classList.add('is-new');
    setTimeout(() => row.classList.remove('is-new'), reduced() ? 0 : 1250);
    return row;
  }

  /* ── 13. 페이지네이션 ─────────────────────────────────────────────────── */
  function initPager(p) {
    if (p.dataset.llReady) return; p.dataset.llReady = '1';
    let size = +p.dataset.size || 40, page = +p.dataset.page || 1;
    const total = +p.dataset.total || 0;
    const render = () => {
      const pages = Math.max(1, Math.ceil(total / size));
      page = Math.max(1, Math.min(page, pages));
      const start = total ? (page - 1) * size + 1 : 0, end = Math.min(page * size, total);
      const range = $('.pager__range', p);
      if (range) range.innerHTML = `<strong>${start.toLocaleString('ko-KR')}–${end.toLocaleString('ko-KR')}</strong> / ${total.toLocaleString('ko-KR')}건`;
      const list = $('.pager__pages', p);
      if (list) {
        const nums = new Set([1, pages, page - 1, page, page + 1]);
        if (page <= 3) [2, 3, 4].forEach((x) => nums.add(x));
        if (page >= pages - 2) [pages - 3, pages - 2, pages - 1].forEach((x) => nums.add(x));
        const arr = [...nums].filter((x) => x >= 1 && x <= pages).sort((a, b) => a - b);
        let html = '', last = 0;
        arr.forEach((x) => {
          if (x - last > 1) html += '<li class="pager__gap" aria-hidden="true">…</li>';
          html += `<li><button type="button" class="pager__btn" data-page="${x}" aria-label="${x}페이지"${x === page ? ' aria-current="page"' : ''}>${x}</button></li>`;
          last = x;
        });
        list.innerHTML = html;
      }
      const cmp = $('.pager__compact', p); if (cmp) cmp.innerHTML = `<strong>${page}</strong> / ${pages}`;
      const pv = $('[data-pager-prev]', p), nx = $('[data-pager-next]', p);
      if (pv) pv.disabled = page <= 1;
      if (nx) nx.disabled = page >= pages;
      p.dataset.page = page;
    };
    p.addEventListener('click', (e) => {
      const b = e.target.closest('[data-page],[data-pager-prev],[data-pager-next]'); if (!b || b.disabled) return;
      if (b.hasAttribute('data-pager-prev')) page--; else if (b.hasAttribute('data-pager-next')) page++; else page = +b.dataset.page;
      render(); emit(p, 'll:page', { page, size });
      const cur = $('[aria-current="page"]', p); if (b.dataset.page && cur) cur.focus();
    });
    const sizeSel = $('[data-pager-size]', p);
    if (sizeSel) sizeSel.addEventListener('change', () => { size = +sizeSel.value; page = 1; render(); emit(p, 'll:page', { page, size }); });
    render();
  }

  /* ── 14. 마키 (승인 티커) ─────────────────────────────────────────────── */
  function setMarquee(m, paused) {
    m.dataset.paused = String(paused);
    const b = $('.marquee__toggle', m);
    if (b) {
      b.setAttribute('aria-pressed', String(paused));
      b.setAttribute('aria-label', paused ? '승인 티커 재생' : '승인 티커 일시정지');
      setIcon($('[data-icon]', b), paused ? 'play' : 'pause');
    }
  }
  function initMarquee(m) {
    if (m.dataset.llReady) return; m.dataset.llReady = '1';
    const track = $('.marquee__track', m), list = track && $('.marquee__list', track);
    if (!list) return;
    if (track.children.length < 2) {
      const clone = list.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      $$('a,button,[tabindex]', clone).forEach((n) => n.setAttribute('tabindex', '-1'));
      track.appendChild(clone);
    }
    const w = list.scrollWidth;
    if (w) m.style.setProperty('--marquee-dur', `${Math.max(30, Math.round(w / 45))}s`);
    setMarquee(m, reduced() || m.dataset.paused === 'true');
  }

  /* ── 15. 복사 ─────────────────────────────────────────────────────────── */
  async function copyText(text) {
    try { await navigator.clipboard.writeText(text); return true; }
    catch (e) {
      const ta = doc.createElement('textarea'); ta.value = text; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
      doc.body.appendChild(ta); ta.select();
      let ok = false; try { ok = doc.execCommand('copy'); } catch (er) { ok = false; }
      ta.remove(); return ok;
    }
  }
  async function doCopy(btn) {
    const tid = btn.dataset.copy;
    const src = tid ? doc.getElementById(tid) : (btn.closest('.code') && $('.code__body', btn.closest('.code')));
    const text = btn.dataset.copyText || (src ? src.innerText : '');
    await copyText(text);
    const label = $('[data-copy-label]', btn) || btn;
    if (!btn._orig) btn._orig = label.textContent;
    label.textContent = '복사됨';
    btn.dataset.state = 'copied';
    clearTimeout(btn._t);
    btn._t = setTimeout(() => { label.textContent = btn._orig; delete btn.dataset.state; }, 1500);
  }

  /* ── 16. 폼 ───────────────────────────────────────────────────────────── */
  const MASKS = {
    biz: [3, 2, 5],          // 사업자등록번호 000-00-00000
    card: [4, 4, 4, 4],      // 카드번호
    phone: [3, 4, 4],        // 010-0000-0000
    corp: [6, 7],            // 법인등록번호
  };
  function applyMask(input) {
    const parts = MASKS[input.dataset.mask]; if (!parts) return;
    const max = parts.reduce((a, b) => a + b, 0);
    const d = input.value.replace(/\D/g, '').slice(0, max);
    let out = '', i = 0;
    parts.forEach((len, k) => { const seg = d.slice(i, i + len); if (seg) out += (k && out ? '-' : '') + seg; i += len; });
    input.value = out;
  }
  function formatKRWInput(input) {
    const neg = /^[-−]/.test(input.value.trim());
    const d = input.value.replace(/\D/g, '').replace(/^0+(?=\d)/, '').slice(0, 13);
    const caretFromEnd = input.value.length - (input.selectionEnd || input.value.length);
    input.value = d ? (neg ? '−' : '') + Number(d).toLocaleString('ko-KR') : '';
    const pos = Math.max(0, input.value.length - caretFromEnd);
    try { input.setSelectionRange(pos, pos); } catch (e) { /* type=number 등 */ }
  }
  function fieldOf(input) { return input.closest('.field'); }
  function setFieldError(input, msg) {
    const f = fieldOf(input);
    const errId = input.getAttribute('aria-errormessage') || (f && $('.field__error', f) && ensureId($('.field__error', f), 'err'));
    if (msg) {
      input.setAttribute('aria-invalid', 'true');
      if (f) f.classList.add('field--error');
      if (errId) { const el = doc.getElementById(errId); if (el) el.textContent = msg; input.setAttribute('aria-errormessage', errId); const d = input.getAttribute('aria-describedby') || ''; if (!d.includes(errId)) input.setAttribute('aria-describedby', `${d} ${errId}`.trim()); }
    } else {
      input.removeAttribute('aria-invalid');
      if (f) f.classList.remove('field--error');
      if (errId) { const el = doc.getElementById(errId); if (el) el.textContent = ''; }
    }
  }
  function validateInput(input) {
    if (input.disabled || input.type === 'hidden') return true;
    let msg = '';
    const v = (input.type === 'checkbox' || input.type === 'radio') ? (input.checked ? 'on' : '') : input.value.trim();
    if (input.required && !v) msg = input.dataset.errorRequired || '필수 항목입니다.';
    else if (v && input.dataset.mask && MASKS[input.dataset.mask]) {
      const need = MASKS[input.dataset.mask].reduce((a, b) => a + b, 0);
      if (input.value.replace(/\D/g, '').length !== need) msg = input.dataset.error || '형식이 올바르지 않습니다.';
    } else if (v && input.pattern && !new RegExp(`^(?:${input.pattern})$`).test(input.value)) msg = input.dataset.error || '형식이 올바르지 않습니다.';
    else if (v && input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) msg = input.dataset.error || '이메일 형식이 올바르지 않습니다.';
    else if (v && input.dataset.format === 'krw' && input.dataset.max && parseNum(v) > +input.dataset.max) msg = input.dataset.error || `한도 ${fmtKRW(+input.dataset.max)}를 넘었습니다.`;
    setFieldError(input, msg);
    return !msg;
  }
  function renderFiles(input) {
    const dz = input.closest('.dropzone');
    const host = (dz && dz.parentNode && $('.dropzone__files', dz.parentNode)) || (dz && $('.dropzone__files', dz));
    const maxMb = +input.dataset.maxMb || 10;
    const files = Array.from(input.files || []);
    const bad = files.find((f) => f.size > maxMb * 1024 * 1024);
    if (dz) dz.setAttribute('aria-invalid', String(!!bad));
    setFieldError(input, bad ? `${bad.name} 파일이 ${maxMb}MB를 넘습니다.` : '');
    if (!host) return;
    host.innerHTML = files.map((f) => `<li class="dropzone__file"><span data-icon="receipt"></span><span class="truncate">${esc(f.name)}</span><span class="mono">${(f.size / 1024).toFixed(0)}KB</span></li>`).join('');
    hydrateIcons(host);
  }
  function initForms(scope) {
    $$('[data-format="krw"]', scope).forEach((i) => { i.setAttribute('inputmode', 'numeric'); if (i.value) formatKRWInput(i); });
    $$('[data-mask]', scope).forEach((i) => { i.setAttribute('inputmode', 'numeric'); if (i.value) applyMask(i); });
    $$('.range', scope).forEach(syncRange);
    $$('.switch__input', scope).forEach(syncSwitch);
    $$('[data-count-for]', scope).forEach((c) => { const i = doc.getElementById(c.dataset.countFor); if (i) syncCount(i); });
    $$('[data-confirm-match]', scope).forEach(syncConfirm);
  }
  function syncRange(r) {
    const min = +r.min || 0, max = +r.max || 100, v = +r.value;
    r.style.setProperty('--fill', `${((v - min) / (max - min)) * 100}%`);
    const out = r.dataset.rangeOutput && doc.getElementById(r.dataset.rangeOutput);
    if (out) out.textContent = Number(v).toLocaleString('ko-KR') + (r.dataset.rangeUnit || '');
  }
  function syncSwitch(s) {
    const st = $('.switch__state', s.closest('.switch') || s.parentNode);
    if (st) st.textContent = s.checked ? (s.dataset.on || '켜짐') : (s.dataset.off || '꺼짐');
  }
  function syncCount(i) {
    const c = $(`[data-count-for="${i.id}"]`); if (!c) return;
    const max = +i.getAttribute('maxlength') || 0;
    c.textContent = max ? `${i.value.length} / ${max}` : `${i.value.length}`;
  }
  function syncConfirm(i) {
    const scope = i.closest('.modal, form, [data-confirm-scope]') || doc;
    const btn = $('[data-confirm-target]', scope);
    if (btn) btn.disabled = i.value.trim() !== i.dataset.confirmMatch;
  }
  function busy(btn, ms = 1200) {
    return new Promise((res) => {
      btn.setAttribute('aria-busy', 'true');
      const d = btn.disabled; btn.disabled = false;
      setTimeout(() => { btn.removeAttribute('aria-busy'); btn.disabled = d; res(); }, reduced() ? Math.min(ms, 400) : ms);
    });
  }

  /* ── 17. 단계 (온보딩) ────────────────────────────────────────────────── */
  function setStep(steps, index) {
    if (typeof steps === 'string') steps = doc.getElementById(steps);
    if (!steps) return;
    const items = $$('.steps__item', steps);
    index = Math.max(0, Math.min(items.length - 1, index));
    items.forEach((it, i) => {
      if (it.dataset.status !== 'error' || i === index) it.dataset.status = i < index ? 'done' : i === index ? 'current' : 'todo';
      if (i === index) it.setAttribute('aria-current', 'step'); else it.removeAttribute('aria-current');
    });
    steps.dataset.index = index;
    $$(`[data-step-panels="${steps.id}"] > [data-step-panel]`).forEach((p, i) => { p.hidden = i !== index; });
    emit(steps, 'll:step', { index });
  }

  /* ── 18. 목차 스크롤스파이 ───────────────────────────────────────────
     관찰 대상 = 장(.chap) + 엔트리(.entry / .strip__item). 활성 띠는 상단바 아래 ~ 뷰포트 20% 지점.
     현재 엔트리 링크 = aria-current="location"(좌측 잉크 막대), 그 상위 장 링크 = .is-parent(600).
     엔트리 밖(장 머리·도입부)에 있으면 장 링크가 aria-current="location". */
  function initScrollspy(nav) {
    if (nav.dataset.llReady || !('IntersectionObserver' in window)) return; nav.dataset.llReady = '1';
    const links = $$('a[href^="#"]', nav);
    const map = new Map();
    links.forEach((a) => { const s = doc.getElementById(decodeURIComponent(a.getAttribute('href').slice(1))); if (s) map.set(s, a); });
    const targets = [...map.keys()];
    const isChap = (el) => !el.matches('.entry, .strip__item');
    const seen = new Set();
    let curKey = '';
    const keepVisible = (a) => {
      if (nav.scrollHeight <= nav.clientHeight) return;
      const top = a.offsetTop, bottom = top + a.offsetHeight;
      if (top < nav.scrollTop + 48) nav.scrollTop = Math.max(0, top - 48);
      else if (bottom > nav.scrollTop + nav.clientHeight - 48) nav.scrollTop = bottom - nav.clientHeight + 48;
    };
    const atBottom = () => window.innerHeight + window.scrollY >= doc.documentElement.scrollHeight - 4;
    const update = () => {
      let inBand = targets.filter((s) => seen.has(s));
      // 문서 끝: 마지막 장이 활성 띠까지 올라오지 못해도 마지막 장을 현재로
      if (atBottom()) { const lastChap = [...targets].reverse().find(isChap); if (lastChap) inBand = [lastChap]; }
      if (!inBand.length) return;
      const chap = [...inBand].reverse().find(isChap) || null;
      const entry = [...inBand].reverse().find((s) => !isChap(s) && (!chap || chap.contains(s))) || null;
      const key = (atBottom() ? '@' : '') + (chap ? chap.id : '') + '/' + (entry ? entry.id : '');
      if (key === curKey) return; curKey = key;
      links.forEach((a) => { a.removeAttribute('aria-current'); a.classList.remove('is-parent'); });
      const chapLink = chap && map.get(chap), entryLink = entry && map.get(entry);
      if (entryLink) { entryLink.setAttribute('aria-current', 'location'); if (chapLink) chapLink.classList.add('is-parent'); }
      else if (chapLink) chapLink.setAttribute('aria-current', 'location');
      const active = entryLink || chapLink;
      if (active) keepVisible(active);
      const sel = nav.dataset.scrollspySelect && doc.getElementById(nav.dataset.scrollspySelect);
      if (sel && active) {
        const href = active.getAttribute('href');
        sel.value = [...sel.options].some((o) => o.value === href) ? href : (chapLink ? chapLink.getAttribute('href') : sel.value);
      }
    };
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) seen.add(en.target); else seen.delete(en.target); });
      update();
    }, { rootMargin: '-72px 0px -80% 0px' });
    targets.forEach((s) => io.observe(s));
    let raf = 0;
    window.addEventListener('scroll', () => { if (raf) return; raf = requestAnimationFrame(() => { raf = 0; if (atBottom()) update(); else if (curKey.startsWith('@')) { curKey = ''; update(); } }); }, { passive: true });
  }

  /* ── 19. 도장 진입 모션 1회 ───────────────────────────────────────────── */
  function initStampOnView(el) {
    if (el.dataset.llReady) return; el.dataset.llReady = '1';
    if (reduced() || !('IntersectionObserver' in window)) return;
    $$('.stamp', el).forEach((s) => { s.style.opacity = '0'; });
    const io = new IntersectionObserver((ents) => {
      if (!ents.some((e) => e.isIntersecting)) return;
      io.disconnect(); replayStamps(el, 220);
    }, { threshold: 0.4 });
    io.observe(el);
  }

  /* ── 20. 숫자 변경 표식 ───────────────────────────────────────────────── */
  function flash(el, text) {
    if (typeof el === 'string') el = doc.getElementById(el);
    if (!el) return;
    if (text != null) el.textContent = text;
    el.classList.remove('num-flash'); reflow(el); el.classList.add('num-flash');
    setTimeout(() => el.classList.remove('num-flash'), reduced() ? 0 : 650);
  }

  /* ── 21. 커맨드 팔레트 ────────────────────────────────────────────────── */
  function initCommand(cmd) {
    if (cmd.dataset.llReady) return; cmd.dataset.llReady = '1';
    const input = $('.command__input', cmd), list = $('.command__list', cmd), empty = $('.command__empty', cmd);
    if (!input || !list) return;
    list.setAttribute('role', 'listbox'); ensureId(list, 'cmd-list');
    input.setAttribute('role', 'combobox'); input.setAttribute('aria-expanded', 'true');
    input.setAttribute('aria-controls', list.id); input.setAttribute('aria-autocomplete', 'list');
    const items = () => $$('.command__item', list);
    items().forEach((it) => {
      it.setAttribute('role', 'option'); ensureId(it, 'cmd-opt'); it.tabIndex = -1;
      const lab = $('.command__item-label', it); if (lab && !lab.dataset.raw) lab.dataset.raw = lab.textContent;
    });
    $$('.command__group', list).forEach((g) => { g.setAttribute('role', 'group'); const l = $('.command__group-label', g); if (l) g.setAttribute('aria-labelledby', ensureId(l, 'cmd-g')); });
    let active = -1;
    const shown = () => items().filter((i) => !i.hidden);
    const setActive = (i) => {
      const s = shown();
      items().forEach((it) => it.setAttribute('aria-selected', 'false'));
      if (!s.length) { active = -1; input.removeAttribute('aria-activedescendant'); return; }
      active = (i + s.length) % s.length;
      s[active].setAttribute('aria-selected', 'true');
      input.setAttribute('aria-activedescendant', s[active].id);
      s[active].scrollIntoView({ block: 'nearest' });
    };
    const filter = () => {
      const raw = input.value.trim();
      const q = raw.toLowerCase().replace(/\s+/g, '');
      items().forEach((it) => {
        const hay = `${it.dataset.keywords || ''} ${it.textContent}`.toLowerCase().replace(/\s+/g, '');
        it.hidden = !!q && !hay.includes(q);
        const lab = $('.command__item-label', it);
        if (lab) {
          const t = lab.dataset.raw || ''; const at = raw ? t.toLowerCase().indexOf(raw.toLowerCase()) : -1;
          lab.innerHTML = at >= 0 ? `${esc(t.slice(0, at))}<mark>${esc(t.slice(at, at + raw.length))}</mark>${esc(t.slice(at + raw.length))}` : esc(t);
        }
      });
      $$('.command__group', list).forEach((g) => { g.hidden = !$$('.command__item', g).some((i) => !i.hidden); });
      const n = shown().length;
      if (empty) { empty.hidden = n > 0; const qn = $('[data-command-query]', empty); if (qn) qn.textContent = raw; }
      setActive(0);
    };
    input.addEventListener('input', filter);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') { e.preventDefault(); setActive(active + 1); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(active - 1); }
      else if (e.key === 'Enter') { e.preventDefault(); const s = shown()[active]; if (s) s.click(); }
    });
    list.addEventListener('mousemove', (e) => { const it = e.target.closest('.command__item'); if (it) { const i = shown().indexOf(it); if (i !== active) setActive(i); } });
    cmd.addEventListener('ll:open', (e) => { if (e.target !== cmd) return; input.value = ''; filter(); });
  }
  function openCommand(trigger) {
    const cmd = doc.getElementById('command') || $('.command');
    if (!cmd) return;
    if (stack.some((s) => s.el === cmd)) closeOverlay(cmd); else openOverlay(cmd, trigger || null);
  }

  /* ── 22. 목록 선택 (listbox) ──────────────────────────────────────────── */
  function selectRow(row, focus) {
    const list = row.closest('[role="listbox"], .list');
    $$('.list__row[role="option"]', list).forEach((r) => { r.setAttribute('aria-selected', String(r === row)); r.tabIndex = r === row ? 0 : -1; });
    row.classList.remove('is-unread');
    if (focus) row.focus();
    emit(row, 'll:list-select', { value: row.dataset.value });
  }

  /* ── 23. 달력 ─────────────────────────────────────────────────────────── */
  function selectDay(day, focus) {
    const grid = day.closest('.cal__grid');
    $$('button.cal__day', grid).forEach((d) => { d.setAttribute('aria-pressed', String(d === day)); d.tabIndex = d === day ? 0 : -1; });
    if (focus) day.focus();
    const cal = day.closest('.cal');
    const out = cal && $('[data-cal-output]', cal);
    if (out) out.textContent = day.dataset.summary || day.getAttribute('aria-label') || '';
    emit(day, 'll:date', { date: day.dataset.date });
  }
  function initCal(scope) {
    $$('.cal__grid', scope).forEach((g) => {
      const days = $$('button.cal__day:not(:disabled)', g);
      const sel = days.find((d) => d.getAttribute('aria-pressed') === 'true') || days.find((d) => d.getAttribute('aria-current') === 'date') || days[0];
      days.forEach((d) => { d.tabIndex = d === sel ? 0 : -1; if (!d.hasAttribute('aria-pressed')) d.setAttribute('aria-pressed', 'false'); });
    });
  }

  /* ── 위임 이벤트 ──────────────────────────────────────────────────────── */
  doc.addEventListener('click', (e) => {
    const t = e.target;
    if (!(t instanceof Element)) return;

    // 바깥 클릭: 최상단 오버레이만 닫는다
    const tp = top();
    if (tp) {
      const inPanel = tp.panel.contains(t) || (tp.trigger && tp.trigger.contains(t));
      if (tp.kind === 'float' && !inPanel && !t.closest('.toast-region')) closeOverlay(tp.el, { restore: false });
      else if (tp.kind === 'dialog' && (t === tp.el || t === scrimEl) && !tp.el.hasAttribute('data-static')) { closeOverlay(tp.el); return; }
    }

    // 커맨드 항목: 먼저 팔레트를 닫고 항목 동작 진행
    const ci = t.closest('.command__item');
    if (ci && !ci.hasAttribute('data-keep-open')) {
      const cmd = ci.closest('.command');
      if (cmd) closeOverlay(cmd, { restore: !ci.matches('[data-open],a[href]') });
    }

    const el = t.closest('[data-theme-toggle],[data-open],[data-close],[data-command-open],[data-popover],[data-menu],[role^="menuitem"],[role="tab"],.seg__btn,.acc__trigger,[data-toast],[data-approve],[data-reject],[data-stamp-play],[data-copy],[data-dismiss],[data-busy],.table__sort,[data-bulk-clear],.list__row[role="option"],button.cal__day,[data-step-next],[data-step-prev],[data-step-go],[data-flash],[data-add-row]');
    if (!el) return;

    if (el.matches('[data-theme-toggle]')) { toggleTheme(); return; }
    if (el.matches('[data-command-open]')) { e.preventDefault(); openCommand(el); return; }
    if (el.matches('[data-open]')) { e.preventDefault(); openOverlay(el.dataset.open, el); return; }
    if (el.matches('[data-close]')) {
      const target = el.dataset.close ? doc.getElementById(el.dataset.close) : el.closest('.modal,.drawer,.command,.popover,.menu,.sidebar');
      if (target) closeOverlay(target);
      if (!el.matches('[data-approve],[data-reject],[data-toast]')) return;
    }
    if (el.matches('[data-popover]')) { e.preventDefault(); toggleOverlay(el.dataset.popover, el); return; }
    if (el.matches('[data-menu]')) { e.preventDefault(); const m = doc.getElementById(el.dataset.menu); if (m && stack.some((s) => s.el === m)) closeOverlay(m); else if (m) openMenu(m, el); return; }
    if (el.matches('[role^="menuitem"]')) { activateMenuItem(el); if (!el.matches('[data-open],[data-toast],[data-approve],a[href]')) return; }
    if (el.matches('[role="tab"]')) { if (!el.disabled && el.getAttribute('aria-disabled') !== 'true') selectTab(el); return; }
    if (el.matches('.seg__btn') && !el.matches('[role="tab"]')) { pressSeg(el); return; }
    if (el.matches('.acc__trigger')) { toggleAcc(el); return; }
    if (el.matches('.table__sort')) { sortTable(el.closest('th')); return; }
    if (el.matches('[data-bulk-clear]')) {
      const table = doc.querySelector(`[data-bulk="${el.closest('.table-bulk').id}"]`);
      if (table) { $$('[data-row-select]', table).forEach((b) => { b.checked = false; }); tableUpdate(table); }
      return;
    }
    if (el.matches('.list__row[role="option"]')) { selectRow(el); return; }
    if (el.matches('button.cal__day')) { selectDay(el); return; }
    if (el.matches('[data-step-next],[data-step-prev],[data-step-go]')) {
      const id = el.dataset.stepNext || el.dataset.stepPrev || el.dataset.stepGo.split(':')[0];
      const steps = doc.getElementById(id); if (!steps) return;
      const cur = +steps.dataset.index || $$('.steps__item', steps).findIndex((i) => i.dataset.status === 'current');
      const idx = el.hasAttribute('data-step-next') ? cur + 1 : el.hasAttribute('data-step-prev') ? cur - 1 : +el.dataset.stepGo.split(':')[1];
      setStep(steps, idx);
      return;
    }
    if (el.matches('[data-copy]')) { doCopy(el); return; }
    if (el.matches('[data-dismiss]')) {
      const target = el.dataset.dismiss ? doc.getElementById(el.dataset.dismiss) : el.closest('.alert,[data-dismissible]');
      if (target) { target.classList.add('is-leaving'); setTimeout(() => target.remove(), reduced() ? 0 : 160); }
      return;
    }
    if (el.matches('[data-stamp-play]')) { const s = doc.getElementById(el.dataset.stampPlay); if (s) replayStamps(s); return; }
    if (el.matches('[data-flash]')) {
      const tg = doc.getElementById(el.dataset.flash);
      if (tg) { const vals = (tg.dataset.values || '').split('|').filter(Boolean); const i = (vals.indexOf(tg.textContent.trim()) + 1) % (vals.length || 1); flash(tg, vals.length ? vals[i] : null); }
      return;
    }
    if (el.matches('[data-add-row]')) {
      const tpl = doc.getElementById(el.dataset.addRowTemplate || '');
      const html = tpl ? (tpl.content ? Array.from(tpl.content.children).map((c) => c.outerHTML).join('') : tpl.innerHTML) : '';
      if (html) addRow(el.dataset.addRow, html);
      return;
    }

    // 결재 · 토스트 · 로딩 은 서로 조합 가능
    (async () => {
      if (el.matches('[data-busy]')) await busy(el, +el.dataset.busy || 1200);
      if (el.matches('[data-approve]')) {
        const r = approve(el.dataset.approve);
        if (r) {
          toast({ kind: 'success', stamp: shortName(r.name), title: el.dataset.toast || '승인 완료', text: el.dataset.toastText || (r.next ? `다음 결재: ${r.next}` : '모든 결재가 끝났습니다. 지급 대기열로 이동합니다.'), action: '실행 취소' });
          if (!r.next && el.tagName === 'BUTTON') { el.disabled = true; const l = $('[data-label]', el); if (l) l.textContent = '결재 완료'; }
        }
        return;
      }
      if (el.matches('[data-reject]')) {
        const r = reject(el.dataset.reject, { reason: el.dataset.reason });
        if (r) toast({ kind: 'danger', title: el.dataset.toast || '반려 처리됨', text: el.dataset.toastText || '기안자에게 반려 사유가 전달되었습니다.' });
        return;
      }
      if (el.matches('[data-toast]')) {
        toast({ title: el.dataset.toast, text: el.dataset.toastText || '', kind: el.dataset.toastKind || 'info', stamp: el.dataset.toastStamp || null, action: el.dataset.toastAction || null });
      }
    })();
  });

  doc.addEventListener('keydown', (e) => {
    // ⌘K / Ctrl+K
    if ((e.metaKey || e.ctrlKey) && !e.altKey && e.key.toLowerCase() === 'k') { e.preventDefault(); openCommand(); return; }
    if (e.key === 'Escape') {
      if (tipFor && tipEl && !tipEl.hidden) { hideTip(); return; }
      const tp = top();
      if (tp && !tp.el.hasAttribute('data-static')) { e.preventDefault(); closeOverlay(tp.el); return; }
      hideTip();
    }
    if (e.key === 'Tab') trapTab(e);

    const t = e.target;
    if (!(t instanceof Element)) return;
    const menu = t.closest('.menu[data-state="open"]');
    if (menu) { menuKey(e, menu); return; }

    // 메뉴 트리거: ↓/↑ 로 열기
    if (t.matches('[data-menu]') && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      e.preventDefault(); const m = doc.getElementById(t.dataset.menu); if (m) openMenu(m, t, e.key === 'ArrowUp'); return;
    }
    if (t.matches('[role="tab"]')) {
      const list = t.closest('[role="tablist"]');
      const vertical = list.getAttribute('aria-orientation') === 'vertical';
      rovingKey(e, tabsOf(list).filter((x) => !x.disabled), t, (n) => selectTab(n, true), vertical);
      return;
    }
    if (t.matches('.seg__btn')) { rovingKey(e, $$('.seg__btn:not(:disabled)', t.closest('.seg')), t, (n) => n.focus()); return; }
    if (t.matches('.acc__trigger') && ['ArrowUp', 'ArrowDown', 'Home', 'End'].includes(e.key)) {
      rovingKey(e, $$('.acc__trigger', t.closest('.acc')), t, (n) => n.focus(), true); return;
    }
    if (t.matches('.list__row[role="option"]')) {
      rovingKey(e, $$('.list__row[role="option"]', t.closest('[role="listbox"], .list')), t, (n) => selectRow(n, true), true); return;
    }
    if (t.matches('button.cal__day')) {
      const days = $$('button.cal__day:not(:disabled)', t.closest('.cal__grid'));
      const all = $$('.cal__day', t.closest('.cal__grid'));
      const i = all.indexOf(t);
      const step = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }[e.key];
      if (step) { e.preventDefault(); const n = all[i + step]; if (n && days.includes(n)) { n.tabIndex = 0; t.tabIndex = -1; n.focus(); } }
      else if (e.key === 'Home') { e.preventDefault(); days[0].focus(); }
      else if (e.key === 'End') { e.preventDefault(); days[days.length - 1].focus(); }
    }
  });

  doc.addEventListener('input', (e) => {
    const t = e.target;
    if (!(t instanceof Element)) return;
    if (t.matches('[data-format="krw"]')) formatKRWInput(t);
    if (t.matches('[data-mask]')) applyMask(t);
    if (t.matches('.range')) syncRange(t);
    if (t.matches('[data-table-filter]')) filterTable(t);
    if (t.matches('[data-confirm-match]')) syncConfirm(t);
    if (t.id && $(`[data-count-for="${t.id}"]`)) syncCount(t);
    if (t.getAttribute('aria-invalid') === 'true') validateInput(t);
  });
  doc.addEventListener('change', (e) => {
    const t = e.target;
    if (!(t instanceof Element)) return;
    if (t.matches('[data-row-select],[data-select-all]')) {
      const table = t.closest('table');
      if (t.matches('[data-select-all]')) $$('tbody tr:not([hidden]) [data-row-select]', table).forEach((b) => { b.checked = t.checked; });
      tableUpdate(table);
    }
    if (t.matches('.switch__input')) syncSwitch(t);
    if (t.matches('.dropzone__input')) renderFiles(t);
    if (t.matches('[data-toc-select]')) { const v = t.value; if (v) location.hash = v; }
    if (t.closest('form[data-validate]') && (t.required || t.dataset.mask || t.pattern)) validateInput(t);
  });
  doc.addEventListener('focusout', (e) => {
    const t = e.target;
    if (t instanceof Element && t.closest('form[data-validate]') && t.matches('input,select,textarea') && t.value) validateInput(t);
    const tp = top();
    if (tp && tp.kind === 'float' && e.relatedTarget && !tp.panel.contains(e.relatedTarget) && !(tp.trigger && tp.trigger.contains(e.relatedTarget)) && !tp.el.classList.contains('menu')) closeOverlay(tp.el, { restore: false });
  });
  doc.addEventListener('submit', async (e) => {
    const form = e.target;
    if (!form.matches('form[data-validate]')) return;
    e.preventDefault();
    const inputs = $$('input,select,textarea', form).filter((i) => i.required || i.dataset.mask || i.pattern || i.type === 'email' || i.dataset.max);
    const bad = inputs.filter((i) => !validateInput(i));
    if (bad.length) {
      bad[0].focus();
      const sum = $('[data-form-summary]', form);
      if (sum) { sum.hidden = false; const c = $('[data-form-summary-count]', sum); if (c) c.textContent = `${bad.length}개`; }
      return;
    }
    const sum = $('[data-form-summary]', form); if (sum) sum.hidden = true;
    const btn = e.submitter || $('[type="submit"]', form);
    if (btn) await busy(btn, 1200);
    if (form.dataset.success) toast({ kind: 'success', title: form.dataset.success, text: form.dataset.successText || '' });
    emit(form, 'll:submit', {});
  });

  // 툴팁
  doc.addEventListener('mouseover', (e) => { const t = e.target instanceof Element && e.target.closest('[data-tooltip]'); if (t) showTip(t); });
  doc.addEventListener('mouseout', (e) => { const t = e.target instanceof Element && e.target.closest('[data-tooltip]'); if (t && !(e.relatedTarget instanceof Element && t.contains(e.relatedTarget)) && doc.activeElement !== t) hideTip(); });
  doc.addEventListener('focusin', (e) => { const t = e.target instanceof Element && e.target.closest('[data-tooltip]'); if (t && t.matches(':focus-visible')) showTip(t); else if (tipFor && !t) hideTip(); });
  doc.addEventListener('focusout', (e) => { if (tipFor && e.target === tipFor) hideTip(); });

  // 드롭존 드래그 표시
  doc.addEventListener('dragenter', (e) => { const dz = e.target instanceof Element && e.target.closest('.dropzone'); if (dz) dz.classList.add('is-dragover'); });
  doc.addEventListener('dragleave', (e) => { const dz = e.target instanceof Element && e.target.closest('.dropzone'); if (dz && !(e.relatedTarget instanceof Element && dz.contains(e.relatedTarget))) dz.classList.remove('is-dragover'); });
  doc.addEventListener('drop', (e) => { const dz = e.target instanceof Element && e.target.closest('.dropzone'); if (dz) dz.classList.remove('is-dragover'); });

  /* ── 22. 모바일에서 접어 두는 <details data-fold-mobile> ────────────────
     데스크톱은 펼친 채(마크업 기본 open), ≤640 에서는 처음에 닫는다. 사용자가 직접 연 뒤에는 건드리지 않는다. */
  const foldMQ = window.matchMedia('(max-width: 640px)');
  function initFold(d) {
    if (d.dataset.llReady) return; d.dataset.llReady = '1';
    let expect = null;
    const apply = () => { if (d.dataset.userToggled) return; expect = !foldMQ.matches; d.open = expect; };
    apply();
    // 스크립트가 바꾼 open 과 같은 상태의 toggle 이벤트는 무시, 다르면 사용자 조작
    d.addEventListener('toggle', () => { if (d.open !== expect) d.dataset.userToggled = '1'; expect = d.open; });
    if (foldMQ.addEventListener) foldMQ.addEventListener('change', apply); else if (foldMQ.addListener) foldMQ.addListener(apply);
  }

  /* ── 초기화 ───────────────────────────────────────────────────────────── */
  function init(scope = doc) {
    hydrateIcons(scope);
    initTabs(scope);
    initAcc(scope);
    initForms(scope);
    initCal(scope);
    $$('.carousel', scope).forEach(initCarousel);
    $$('.kanban', scope).forEach(initKanban);
    $$('.pager[data-total]', scope).forEach(initPager);
    $$('.marquee', scope).forEach(initMarquee);
    $$('.command', scope).forEach(initCommand);
    $$('details[data-fold-mobile]', scope).forEach(initFold);
    $$('[data-scrollspy]', scope).forEach(initScrollspy);
    $$('[data-stamp-on-view]', scope).forEach(initStampOnView);
    $$('table', scope).filter((t) => t.dataset.bulk || $('[data-select-all]', t)).forEach(tableUpdate);
    $$('.steps[id]', scope).forEach((s) => { const i = $$('.steps__item', s).findIndex((it) => it.dataset.status === 'current'); if (i >= 0) s.dataset.index = i; });
    $$('.list[role="listbox"]', scope).forEach((l) => {
      const rows = $$('.list__row[role="option"]', l);
      const sel = rows.find((r) => r.getAttribute('aria-selected') === 'true') || rows[0];
      rows.forEach((r) => { r.tabIndex = r === sel ? 0 : -1; if (!r.hasAttribute('aria-selected')) r.setAttribute('aria-selected', 'false'); });
    });
    if ($('[data-theme-toggle]', scope)) applyTheme(root.getAttribute('data-theme') || 'light');
    $$('.modal,.drawer,.command', scope).forEach((m) => { if (!m.dataset.state) m.dataset.state = m.hidden ? 'closed' : 'open'; });
  }

  window.ll = {
    init, toast, open: openOverlay, close: closeOverlay, toggle: toggleOverlay,
    approve, reject, stamp: stampIn, replayStamps, flash, addRow, setStep,
    fmtKRW, icons: ICONS, hydrateIcons, setTheme: (t) => { try { localStorage.setItem(THEME_KEY, t); } catch (e) { /* noop */ } applyTheme(t); },
  };

  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', () => init()); else init();
  if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(() => $$('.tabs').forEach(syncInk));
})();
