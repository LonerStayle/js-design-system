/* =====================================================================
   겹판인쇄소 · app.js — 바닐라 인터랙션(외부 라이브러리 없음)
   마크업 계약은 COMPONENTS.md 참조. 전역 API: window.gyeop
   ===================================================================== */
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
  const ensureId = (el, p = 'gp') => el.id || (el.id = `${p}-${++uidN}`);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* 저장 불가 환경 */ } },
  };
  const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
  const focusables = (el) => $$(FOCUSABLE, el).filter((n) => n.offsetParent !== null || n === doc.activeElement);

  root.classList.add('js');

  /* ── 1. 아이콘 — <span data-icon="search"></span> → 24px 격자 1.75px 라인 ── */
  const ICONS = {
    search: '<circle cx="10.5" cy="10.5" r="6"/><path d="m15 15 5 5"/>',
    close: '<path d="m6 6 12 12M18 6 6 18"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    moon: '<path d="M19.5 14.5A7.5 7.5 0 0 1 9.5 4.5a7.5 7.5 0 1 0 10 10Z"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5V5M12 19v2.5M2.5 12H5M19 12h2.5M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M5.3 18.7l1.8-1.8M16.9 7.1l1.8-1.8"/>',
    more: '<path d="M5 12h.01M12 12h.01M19 12h.01" stroke-width="3"/>',
    'chevron-left': '<path d="m14.5 5.5-6.5 6.5 6.5 6.5"/>',
    'chevron-right': '<path d="m9.5 5.5 6.5 6.5-6.5 6.5"/>',
    'chevron-down': '<path d="m5.5 9.5 6.5 6.5 6.5-6.5"/>',
    'arrow-right': '<path d="M4 12h15M13 6l6 6-6 6"/>',
    'arrow-left': '<path d="M20 12H5M11 6l-6 6 6 6"/>',
    'arrow-down': '<path d="M12 4v15M6 13l6 6 6-6"/>',
    check: '<path d="m4.5 12.5 5 5 10-11"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    minus: '<path d="M5 12h14"/>',
    info: '<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5.5M12 7.5v.01"/>',
    alert: '<path d="M12 3.5 21 19.5H3Z"/><path d="M12 10v4.5M12 17v.01"/>',
    danger: '<circle cx="12" cy="12" r="8.5"/><path d="m8.5 8.5 7 7M15.5 8.5l-7 7"/>',
    success: '<circle cx="12" cy="12" r="8.5"/><path d="m8 12.3 2.8 2.8L16.2 9.5"/>',
    copy: '<rect x="8" y="8" width="12" height="12"/><path d="M16 8V4H4v12h4"/>',
    upload: '<path d="M12 15V4M7.5 8.5 12 4l4.5 4.5M4 15v5h16v-5"/>',
    download: '<path d="M12 4v11M7.5 10.5 12 15l4.5-4.5M4 15v5h16v-5"/>',
    pause: '<path d="M8.5 5v14M15.5 5v14"/>',
    play: '<path d="M7 4.5v15L19 12Z"/>',
    printer: '<path d="M6.5 9V3.5h11V9"/><path d="M6.5 17H3.5V9h17v8h-3"/><path d="M6.5 14h11v6.5h-11Z"/>',
    drum: '<ellipse cx="12" cy="6" rx="7" ry="2.5"/><path d="M5 6v12c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5V6"/><path d="M5 12c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5"/>',
    layers: '<path d="m12 4 8.5 4.5L12 13 3.5 8.5Z"/><path d="m3.5 12.5 8.5 4.5 8.5-4.5"/><path d="m3.5 16.5 8.5 4.5 8.5-4.5"/>',
    file: '<path d="M6 3h8l4 4v14H6Z"/><path d="M14 3v4h4M9 12h6M9 16h6"/>',
    inbox: '<path d="M3.5 13h5l1.5 2.5h4L15.5 13h5"/><path d="M5.5 5h13l2 8v6h-17v-6Z"/>',
    board: '<path d="M4 4h16v16H4Z"/><path d="M9.5 4v16M14.5 4v16"/>',
    chart: '<path d="M4 20h16"/><path d="M6.5 20v-6M11 20V8M15.5 20v-9M20 20V5"/>',
    tag: '<path d="M3.5 12.5V4h8.5l8.5 8.5-8.5 8.5Z"/><circle cx="8" cy="8.5" r="1.2"/>',
    user: '<circle cx="12" cy="8.5" r="4"/><path d="M4.5 20.5c1-4 4-6 7.5-6s6.5 2 7.5 6"/>',
    settings: '<circle cx="12" cy="12" r="3"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1"/>',
    calendar: '<path d="M4 6h16v14H4Z"/><path d="M4 10.5h16M8.5 3.5v5M15.5 3.5v5"/>',
    scissors: '<circle cx="6.5" cy="17.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/><path d="M8.3 15.7 17 4M15.7 15.7 7 4"/>',
    refresh: '<path d="M19.5 12a7.5 7.5 0 1 1-2.2-5.3"/><path d="M19.5 4v4h-4"/>',
    trash: '<path d="M4.5 6.5h15M9.5 6.5V4h5v2.5M6.5 6.5l1 13.5h9l1-13.5"/>',
    pin: '<path d="M12 21s6.5-6 6.5-11a6.5 6.5 0 0 0-13 0c0 5 6.5 11 6.5 11Z"/><circle cx="12" cy="10" r="2.3"/>',
    phone: '<path d="M5 4h4l1.5 4.5-2.5 1.5a11 11 0 0 0 6 6l1.5-2.5L20 15v4a1.5 1.5 0 0 1-1.5 1.5A16 16 0 0 1 3.5 5.5 1.5 1.5 0 0 1 5 4Z"/>',
    send: '<path d="m3.5 11 17-7.5-6 17-3-7Z"/><path d="m11.5 13.5 9-10"/>',
    cart: '<path d="M3 4h2.5l2.2 11h10.8L20.5 7H6.5"/><circle cx="9" cy="19" r="1.4"/><circle cx="17" cy="19" r="1.4"/>',
    eye: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z"/><circle cx="12" cy="12" r="3"/>',
    grip: '<path d="M9 6h.01M15 6h.01M9 12h.01M15 12h.01M9 18h.01M15 18h.01" stroke-width="3"/>',
    clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7v5.5l3.5 2"/>',
    command: '<path d="M9 9h6v6H9Z"/><path d="M9 9H6.5A2.5 2.5 0 1 1 9 6.5ZM15 9V6.5A2.5 2.5 0 1 1 17.5 9ZM15 15h2.5a2.5 2.5 0 1 1-2.5 2.5ZM9 15v2.5A2.5 2.5 0 1 1 6.5 15Z"/>',
  };
  function paintIcons(scope = doc) {
    $$('[data-icon]', scope).forEach((el) => {
      if (el.dataset.iconDone === el.dataset.icon) return;
      const d = ICONS[el.dataset.icon];
      if (!d) return;
      el.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">${d}</svg>`;
      el.setAttribute('aria-hidden', 'true');
      el.dataset.iconDone = el.dataset.icon;
    });
  }

  /* ── 2. 테마 — ?theme= → localStorage → prefers-color-scheme ─────────── */
  const THEME_KEY = 'gyeoppan-theme';
  const queryTheme = (() => { try { const q = new URLSearchParams(location.search).get('theme'); return q === 'dark' || q === 'light' ? q : null; } catch (e) { return null; } })();
  function resolveTheme() {
    if (queryTheme) return queryTheme;
    const s = store.get(THEME_KEY);
    if (s === 'dark' || s === 'light') return s;
    return mq('(prefers-color-scheme: dark)') ? 'dark' : 'light';
  }
  function syncToggles(t) {
    $$('[data-theme-toggle]').forEach((b) => {
      b.setAttribute('aria-pressed', t === 'dark' ? 'true' : 'false');
      if (!b.hasAttribute('data-keep-label')) b.setAttribute('aria-label', t === 'dark' ? '밤 교정 끄기(낮 화면으로)' : '밤 교정 켜기(밤 화면으로)');
    });
  }
  function setTheme(t, persist = false) {
    root.setAttribute('data-theme', t);
    if (persist) store.set(THEME_KEY, t);
    syncToggles(t);
    doc.dispatchEvent(new CustomEvent('gyeop:theme', { detail: { theme: t } }));
  }
  function initTheme() {
    setTheme(resolveTheme());
    doc.addEventListener('click', (e) => {
      const b = e.target.closest('[data-theme-toggle]');
      if (!b) return;
      setTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark', true);
    });
    const m = window.matchMedia('(prefers-color-scheme: dark)');
    const onSys = (ev) => { if (!queryTheme && !store.get(THEME_KEY)) setTheme(ev.matches ? 'dark' : 'light'); };
    if (m.addEventListener) m.addEventListener('change', onSys); else if (m.addListener) m.addListener(onSys);
  }

  /* ── 3. 포커스 트랩 · 오버레이 스택 ─────────────────────────────────── */
  const stack = [];
  const lock = () => root.classList.toggle('is-locked', stack.some((s) => s.lock));
  function trapKey(e) {
    const top = stack[stack.length - 1];
    if (!top) return;
    if (e.key === 'Escape') { e.preventDefault(); top.close(); return; }
    if (e.key !== 'Tab') return;
    const f = focusables(top.el);
    if (!f.length) { e.preventDefault(); return; }
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && (doc.activeElement === first || !top.el.contains(doc.activeElement))) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && (doc.activeElement === last || !top.el.contains(doc.activeElement))) { e.preventDefault(); first.focus(); }
  }
  doc.addEventListener('keydown', (e) => { if (stack.length && (e.key === 'Escape' || e.key === 'Tab')) trapKey(e); });
  function pushLayer(layer) { stack.push(layer); lock(); }
  function popLayer(layer) { const i = stack.indexOf(layer); if (i > -1) stack.splice(i, 1); lock(); }

  /* ── 4. 모달 · 드로어 · 커맨드 — [data-open="id"] / [data-close] ─────── */
  const layers = new Map();
  function openOverlay(el, trigger) {
    if (!el || layers.has(el)) return;
    el.hidden = false;
    reflow(el);
    el.classList.add('is-open');
    const layer = { el, lock: true, trigger: trigger || doc.activeElement, close: () => closeOverlay(el) };
    layers.set(el, layer);
    pushLayer(layer);
    if (trigger) trigger.setAttribute('aria-expanded', 'true');
    const auto = $('[autofocus], [data-autofocus]', el) || focusables(el).find((n) => !n.matches('[data-close]')) || focusables(el)[0];
    (auto || el).focus({ preventScroll: true });
    el.dispatchEvent(new CustomEvent('gyeop:open', { bubbles: true }));
  }
  function closeOverlay(el) {
    const layer = layers.get(el);
    if (!layer) return;
    layers.delete(el);
    popLayer(layer);
    el.classList.remove('is-open');
    el.hidden = true;
    if (layer.trigger && layer.trigger.setAttribute) {
      layer.trigger.setAttribute('aria-expanded', 'false');
      if (doc.contains(layer.trigger)) layer.trigger.focus({ preventScroll: true });
    }
    el.dispatchEvent(new CustomEvent('gyeop:close', { bubbles: true }));
  }
  function initOverlays() {
    $$('[data-open]').forEach((t) => { t.setAttribute('aria-haspopup', 'dialog'); t.setAttribute('aria-expanded', 'false'); });
    doc.addEventListener('click', (e) => {
      const o = e.target.closest('[data-open]');
      if (o) { e.preventDefault(); openOverlay(doc.getElementById(o.dataset.open), o); return; }
      const c = e.target.closest('[data-close]');
      if (c) {
        const ov = c.closest('.modal, .drawer, .command');
        if (ov && !ov.matches('.modal--static, .drawer--static, .command--static')) { e.preventDefault(); closeOverlay(ov); }
      }
    });
  }

  /* ── 5. 오프캔버스(메뉴 판 · 작업 서랍) — [data-offcanvas="id"] ─────── */
  let scrim = null;
  const offOpen = new Map();
  function getScrim() {
    if (!scrim) {
      scrim = doc.createElement('div');
      scrim.className = 'offcanvas-scrim';
      scrim.hidden = true;
      scrim.addEventListener('click', () => { Array.from(offOpen.keys()).forEach(closeOff); });
      doc.body.appendChild(scrim);
    }
    return scrim;
  }
  function openOff(panel, trigger) {
    if (offOpen.has(panel)) return;
    const s = getScrim();
    s.hidden = false; reflow(s); s.classList.add('is-open');
    panel.classList.add('is-open');
    const layer = { el: panel, lock: true, trigger, close: () => closeOff(panel) };
    offOpen.set(panel, layer);
    pushLayer(layer);
    $$(`[data-offcanvas="${panel.id}"]`).forEach((b) => b.setAttribute('aria-expanded', 'true'));
    const f = focusables(panel);
    (f.find((n) => n.matches('[aria-current="page"]')) || f[0] || panel).focus({ preventScroll: true });
  }
  function closeOff(panel) {
    const layer = offOpen.get(panel);
    if (!layer) return;
    offOpen.delete(panel);
    popLayer(layer);
    panel.classList.remove('is-open');
    $$(`[data-offcanvas="${panel.id}"]`).forEach((b) => b.setAttribute('aria-expanded', 'false'));
    if (!offOpen.size && scrim) { scrim.classList.remove('is-open'); setTimeout(() => { if (!offOpen.size) scrim.hidden = true; }, 160); }
    if (layer.trigger && doc.contains(layer.trigger) && layer.trigger.offsetParent !== null) layer.trigger.focus({ preventScroll: true });
  }
  function initOffcanvas() {
    $$('[data-offcanvas]').forEach((b) => { b.setAttribute('aria-expanded', 'false'); b.setAttribute('aria-controls', b.dataset.offcanvas); });
    doc.addEventListener('click', (e) => {
      const b = e.target.closest('[data-offcanvas]');
      if (b) {
        const p = doc.getElementById(b.dataset.offcanvas);
        if (!p) return;
        if (offOpen.has(p)) closeOff(p); else openOff(p, b);
        return;
      }
      const link = e.target.closest('.topbar__nav a, .sidebar a');
      if (link) { const p = link.closest('.topbar__nav, .sidebar'); if (p && offOpen.has(p)) closeOff(p); }
    });
    window.addEventListener('resize', () => { if (window.innerWidth >= 1100) Array.from(offOpen.keys()).forEach(closeOff); });
  }

  /* ── 6. 커맨드 팔레트(⌘K) ─────────────────────────────────────────── */
  function commandItems(cmd) { return $$('.command__item', cmd).filter((i) => !i.hidden && i.getAttribute('aria-disabled') !== 'true'); }
  function commandSelect(cmd, item) {
    const input = $('.command__input', cmd);
    $$('.command__item', cmd).forEach((i) => i.setAttribute('aria-selected', i === item ? 'true' : 'false'));
    if (item) {
      ensureId(item, 'cmd-opt');
      input && input.setAttribute('aria-activedescendant', item.id);
      const list = item.closest('.command__list');
      if (list) { const t = item.offsetTop - list.offsetTop, b = t + item.offsetHeight; if (t < list.scrollTop) list.scrollTop = t; else if (b > list.scrollTop + list.clientHeight) list.scrollTop = b - list.clientHeight; }
    }
    else if (input) input.removeAttribute('aria-activedescendant');
  }
  function commandFilter(cmd, q) {
    const query = q.trim().toLowerCase();
    let shown = 0;
    $$('.command__item', cmd).forEach((item) => {
      const strong = $('.command__item-main strong', item) || item;
      if (!strong.dataset.raw) strong.dataset.raw = strong.textContent;
      const raw = strong.dataset.raw;
      const hay = (item.textContent + ' ' + (item.dataset.keywords || '')).toLowerCase();
      const hit = !query || hay.includes(query);
      item.hidden = !hit;
      if (hit) shown++;
      const idx = query ? raw.toLowerCase().indexOf(query) : -1;
      strong.innerHTML = idx > -1 ? esc(raw.slice(0, idx)) + '<mark>' + esc(raw.slice(idx, idx + query.length)) + '</mark>' + esc(raw.slice(idx + query.length)) : esc(raw);
    });
    $$('.command__group', cmd).forEach((g) => {
      let n = g.nextElementSibling, any = false;
      while (n && !n.classList.contains('command__group')) { if (n.classList.contains('command__item') && !n.hidden) any = true; n = n.nextElementSibling; }
      g.hidden = !any;
    });
    const empty = $('.command__empty', cmd);
    if (empty) { empty.hidden = shown > 0; const qn = $('[data-command-query]', empty); if (qn) qn.textContent = q.trim(); }
    commandSelect(cmd, commandItems(cmd)[0] || null);
  }
  function initCommand() {
    $$('.command').forEach((cmd) => {
      const input = $('.command__input', cmd);
      const list = $('.command__list', cmd);
      if (!input || !list) return;
      ensureId(list, 'cmd-list');
      input.setAttribute('role', 'combobox');
      input.setAttribute('aria-expanded', 'true');
      input.setAttribute('aria-controls', list.id);
      input.setAttribute('aria-autocomplete', 'list');
      list.setAttribute('role', 'listbox');
      $$('.command__item', cmd).forEach((i) => { i.setAttribute('role', 'option'); i.setAttribute('tabindex', '-1'); });
      if (input.value) commandFilter(cmd, input.value); else commandSelect(cmd, $('.command__item[aria-selected="true"]', cmd) || commandItems(cmd)[0] || null);
      input.addEventListener('input', () => commandFilter(cmd, input.value));
      input.addEventListener('keydown', (e) => {
        const items = commandItems(cmd);
        const cur = items.findIndex((i) => i.getAttribute('aria-selected') === 'true');
        if (e.key === 'ArrowDown') { e.preventDefault(); commandSelect(cmd, items[(cur + 1) % items.length]); }
        else if (e.key === 'ArrowUp') { e.preventDefault(); commandSelect(cmd, items[(cur - 1 + items.length) % items.length]); }
        else if (e.key === 'Home') { e.preventDefault(); commandSelect(cmd, items[0]); }
        else if (e.key === 'End') { e.preventDefault(); commandSelect(cmd, items[items.length - 1]); }
        else if (e.key === 'Enter' && cur > -1) { e.preventDefault(); items[cur].click(); }
      });
      list.addEventListener('mousemove', (e) => { const it = e.target.closest('.command__item'); if (it && it.getAttribute('aria-selected') !== 'true' && !it.hidden) commandSelect(cmd, it); });
      list.addEventListener('click', (e) => {
        const it = e.target.closest('.command__item');
        if (!it || cmd.classList.contains('command--static')) return;
        if (!it.hasAttribute('data-keep-open') && !it.matches('a[href]')) closeOverlay(cmd);
      });
      cmd.addEventListener('gyeop:open', () => { input.value = ''; commandFilter(cmd, ''); input.focus(); });
    });
    const main = $('.command:not(.command--static)');
    $$('[data-command-open]').forEach((b) => { b.setAttribute('aria-haspopup', 'dialog'); b.setAttribute('aria-expanded', 'false'); });
    doc.addEventListener('click', (e) => { const b = e.target.closest('[data-command-open]'); if (b && main) { e.preventDefault(); openOverlay(main, b); } });
    doc.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
        if (!main) return;
        e.preventDefault();
        if (layers.has(main)) closeOverlay(main); else openOverlay(main, $('[data-command-open]'));
      }
    });
  }

  /* ── 7. 메뉴 · 팝오버 ─────────────────────────────────────────────── */
  let openFloat = null;
  function closeFloat(restore = false) {
    if (!openFloat) return;
    const { panel, trigger } = openFloat;
    panel.hidden = true;
    panel.classList.remove('is-open');
    trigger.setAttribute('aria-expanded', 'false');
    openFloat = null;
    if (restore) trigger.focus();
  }
  function openMenu(trigger, last = false) {
    const panel = doc.getElementById(trigger.getAttribute('aria-controls'));
    if (!panel) return;
    closeFloat();
    panel.hidden = false; reflow(panel); panel.classList.add('is-open');
    trigger.setAttribute('aria-expanded', 'true');
    openFloat = { panel, trigger, kind: 'menu' };
    const items = $$('[role^="menuitem"]', panel).filter((i) => i.getAttribute('aria-disabled') !== 'true');
    (last ? items[items.length - 1] : items[0])?.focus();
  }
  function placePop(panel, trigger) {
    panel.removeAttribute('data-side');
    panel.removeAttribute('data-align');
    const r = trigger.getBoundingClientRect();
    const h = panel.offsetHeight, w = panel.offsetWidth;
    if (r.bottom + h + 16 > window.innerHeight && r.top - h - 16 > 0) panel.setAttribute('data-side', 'top');
    if (r.left + w + 16 > window.innerWidth) panel.setAttribute('data-align', 'end');
  }
  function openPop(trigger) {
    const panel = doc.getElementById(trigger.getAttribute('aria-controls'));
    if (!panel) return;
    closeFloat();
    panel.hidden = false;
    placePop(panel, trigger);
    reflow(panel); panel.classList.add('is-open');
    trigger.setAttribute('aria-expanded', 'true');
    openFloat = { panel, trigger, kind: 'pop' };
  }
  function initFloats() {
    $$('.menu__trigger, [aria-haspopup="menu"]').forEach((t) => {
      const panel = doc.getElementById(t.getAttribute('aria-controls'));
      if (!panel || panel.classList.contains('menu__list--static')) return;
      t.setAttribute('aria-expanded', 'false');
      panel.hidden = true;
      $$('.menu__item', panel).forEach((i) => { if (!i.getAttribute('role')) i.setAttribute('role', 'menuitem'); i.setAttribute('tabindex', '-1'); });
      t.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openMenu(t); }
        else if (e.key === 'ArrowUp') { e.preventDefault(); openMenu(t, true); }
      });
      panel.addEventListener('keydown', (e) => {
        const items = $$('[role^="menuitem"]', panel).filter((i) => i.getAttribute('aria-disabled') !== 'true');
        const i = items.indexOf(doc.activeElement);
        if (e.key === 'ArrowDown') { e.preventDefault(); items[(i + 1) % items.length].focus(); }
        else if (e.key === 'ArrowUp') { e.preventDefault(); items[(i - 1 + items.length) % items.length].focus(); }
        else if (e.key === 'Home') { e.preventDefault(); items[0].focus(); }
        else if (e.key === 'End') { e.preventDefault(); items[items.length - 1].focus(); }
        else if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); closeFloat(true); }
        else if (e.key === 'Tab') closeFloat();
      });
    });
    $$('[data-popover-trigger]').forEach((t) => {
      const panel = doc.getElementById(t.getAttribute('aria-controls'));
      if (!panel || panel.classList.contains('popover__panel--static')) return;
      t.setAttribute('aria-expanded', 'false');
      panel.hidden = true;
      panel.addEventListener('keydown', (e) => { if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); closeFloat(true); } });
    });
    doc.addEventListener('click', (e) => {
      const mt = e.target.closest('.menu__trigger, [aria-haspopup="menu"]');
      const mtPanel = mt && doc.getElementById(mt.getAttribute('aria-controls'));
      if (mtPanel && !mtPanel.classList.contains('menu__list--static')) {
        e.preventDefault();
        if (openFloat && openFloat.trigger === mt) closeFloat(); else openMenu(mt);
        return;
      }
      const pt = e.target.closest('[data-popover-trigger]');
      if (pt && !doc.getElementById(pt.getAttribute('aria-controls'))?.classList.contains('popover__panel--static')) {
        e.preventDefault();
        if (openFloat && openFloat.trigger === pt) closeFloat(); else openPop(pt);
        return;
      }
      const item = e.target.closest('.menu__item');
      if (item && openFloat && openFloat.panel.contains(item)) {
        if (item.getAttribute('aria-disabled') === 'true') { e.preventDefault(); return; }
        if (item.getAttribute('role') === 'menuitemcheckbox') { item.setAttribute('aria-checked', item.getAttribute('aria-checked') === 'true' ? 'false' : 'true'); return; }
        if (item.getAttribute('role') === 'menuitemradio') {
          $$('[role="menuitemradio"]', openFloat.panel).forEach((r) => r.setAttribute('aria-checked', r === item ? 'true' : 'false'));
        }
        closeFloat(!item.matches('a[href]'));
        return;
      }
      if (openFloat && !openFloat.panel.contains(e.target)) closeFloat();
    });
    doc.addEventListener('keydown', (e) => { if (e.key === 'Escape' && openFloat && !stack.length) closeFloat(true); });
    window.addEventListener('resize', () => closeFloat());
  }

  /* ── 8. 툴팁 — [data-tip="문구"] ───────────────────────────────────── */
  function initTips() {
    let tip = null, owner = null;
    const show = (el) => {
      const text = el.getAttribute('data-tip');
      if (!text) return;
      if (!tip) { tip = doc.createElement('div'); tip.className = 'tooltip'; tip.setAttribute('role', 'tooltip'); tip.id = 'gp-tooltip'; doc.body.appendChild(tip); }
      tip.innerHTML = esc(text).replace(/(#[0-9A-Fa-f]{6}|GP-\d{4}-\d{3}|\d[\d,.%]*)/g, '<span class="mono">$1</span>');
      owner = el;
      el.setAttribute('aria-describedby', 'gp-tooltip');
      tip.style.left = '0px'; tip.style.top = '0px';
      tip.classList.remove('is-open');
      const r = el.getBoundingClientRect();
      const tw = tip.offsetWidth, th = tip.offsetHeight;
      let x = r.left + r.width / 2 - tw / 2;
      x = Math.max(12, Math.min(x, window.innerWidth - tw - 12));
      let y = r.top - th - 10;
      if (y < 8) y = r.bottom + 10;
      tip.style.left = `${Math.round(x)}px`;
      tip.style.top = `${Math.round(y)}px`;
      reflow(tip);
      tip.classList.add('is-open');
    };
    const hide = () => { if (tip) tip.classList.remove('is-open'); if (owner) owner.removeAttribute('aria-describedby'); owner = null; };
    doc.addEventListener('pointerover', (e) => { const el = e.target.closest('[data-tip]'); if (el && el !== owner) show(el); else if (!el && owner) hide(); });
    doc.addEventListener('focusin', (e) => { const el = e.target.closest('[data-tip]'); if (el) show(el); });
    doc.addEventListener('focusout', (e) => { if (e.target.closest('[data-tip]')) hide(); });
    doc.addEventListener('keydown', (e) => { if (e.key === 'Escape' && owner) hide(); });
    window.addEventListener('scroll', hide, { passive: true });
  }

  /* ── 9. 토스트 ────────────────────────────────────────────────────── */
  const TONE_ICON = { info: 'info', success: 'success', warn: 'alert', danger: 'danger' };
  function toastRegion() {
    let r = $('.toast-region');
    if (!r) { r = doc.createElement('div'); r.className = 'toast-region'; r.setAttribute('role', 'region'); r.setAttribute('aria-label', '알림 쪽지'); doc.body.appendChild(r); }
    return r;
  }
  function dismissToast(t) {
    if (!t || t.classList.contains('is-leave')) return;
    t.classList.add('is-leave');
    setTimeout(() => t.remove(), reduced() ? 0 : 200);
  }
  function toast(opt = {}) {
    const tone = opt.tone || 'info';
    const ms = opt.ms == null ? 5000 : opt.ms;
    const t = doc.createElement('div');
    t.className = `toast toast--${tone} is-enter${ms ? ' is-live' : ''}`;
    t.setAttribute('role', tone === 'danger' ? 'alert' : 'status');
    t.style.setProperty('--toast-ms', `${ms}ms`);
    t.innerHTML = `<div class="toast__body"><p class="toast__title"><span data-icon="${TONE_ICON[tone] || 'info'}"></span>${esc(opt.title || '')}</p>${opt.text ? `<p class="toast__text">${opt.html ? opt.text : esc(opt.text)}</p>` : ''}</div><button class="btn btn--ghost btn--icon toast__close" type="button" aria-label="쪽지 닫기"><span data-icon="close"></span></button>${ms ? '<span class="toast__timer" aria-hidden="true"></span>' : ''}`;
    toastRegion().appendChild(t);
    paintIcons(t);
    $('.toast__close', t).addEventListener('click', () => dismissToast(t));
    if (ms) {
      let left = ms, start = Date.now(), timer = null;
      const run = () => { start = Date.now(); timer = setTimeout(() => dismissToast(t), left); };
      const pause = () => { clearTimeout(timer); left -= Date.now() - start; };
      t.addEventListener('mouseenter', pause); t.addEventListener('mouseleave', run);
      t.addEventListener('focusin', pause); t.addEventListener('focusout', run);
      run();
    }
    return t;
  }
  function initToasts() {
    doc.addEventListener('click', (e) => {
      const b = e.target.closest('[data-toast]');
      if (!b || b.hasAttribute('data-busy')) return;
      toast({ title: b.dataset.toast, text: b.dataset.toastText, tone: b.dataset.toastTone });
    });
    $$('.toast--static .toast__close').forEach((b) => b.addEventListener('click', () => dismissToast(b.closest('.toast'))));
  }

  /* ── 10. 탭 ───────────────────────────────────────────────────────── */
  function selectTab(tab, focus = true) {
    const list = tab.closest('[role="tablist"]');
    $$('[role="tab"]', list).forEach((t) => {
      const on = t === tab;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
      const p = doc.getElementById(t.getAttribute('aria-controls'));
      if (p) p.hidden = !on;
    });
    if (focus) tab.focus();
    if (list.scrollWidth > list.clientWidth) {
      const l = tab.offsetLeft - list.offsetLeft, r = l + tab.offsetWidth;
      if (l < list.scrollLeft) list.scrollLeft = l - 24; else if (r > list.scrollLeft + list.clientWidth) list.scrollLeft = r - list.clientWidth + 48;
    }
    list.dispatchEvent(new CustomEvent('gyeop:tab', { bubbles: true, detail: { tab } }));
  }
  function initTabs() {
    $$('[role="tablist"]').forEach((list) => {
      const tabs = $$('[role="tab"]', list);
      const cur = tabs.find((t) => t.getAttribute('aria-selected') === 'true') || tabs[0];
      tabs.forEach((t) => {
        const p = doc.getElementById(t.getAttribute('aria-controls'));
        if (p) { p.setAttribute('role', 'tabpanel'); p.setAttribute('aria-labelledby', ensureId(t, 'tab')); if (!p.hasAttribute('tabindex')) p.tabIndex = 0; }
      });
      if (cur) selectTab(cur, false);
      list.addEventListener('click', (e) => { const t = e.target.closest('[role="tab"]'); if (t && t.getAttribute('aria-disabled') !== 'true' && !t.disabled) selectTab(t, false); });
      list.addEventListener('keydown', (e) => {
        const en = tabs.filter((t) => t.getAttribute('aria-disabled') !== 'true' && !t.disabled);
        const i = en.indexOf(doc.activeElement);
        if (i < 0) return;
        let n = null;
        if (e.key === 'ArrowRight') n = en[(i + 1) % en.length];
        else if (e.key === 'ArrowLeft') n = en[(i - 1 + en.length) % en.length];
        else if (e.key === 'Home') n = en[0];
        else if (e.key === 'End') n = en[en.length - 1];
        if (n) { e.preventDefault(); selectTab(n); }
      });
    });
  }

  /* ── 11. 아코디언 ─────────────────────────────────────────────────── */
  function setAcc(trigger, open) {
    const item = trigger.closest('.accordion__item');
    const panel = doc.getElementById(trigger.getAttribute('aria-controls'));
    trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
    item.classList.toggle('is-open', open);
    if (panel) { const inner = $('.accordion__inner', panel) || panel; inner.inert = !open; }
  }
  function initAcc() {
    $$('.accordion__trigger').forEach((t) => {
      const panel = doc.getElementById(t.getAttribute('aria-controls'));
      if (panel) { panel.setAttribute('role', 'region'); panel.setAttribute('aria-labelledby', ensureId(t, 'acc')); }
      setAcc(t, t.getAttribute('aria-expanded') === 'true');
      t.addEventListener('click', () => {
        if (t.getAttribute('aria-disabled') === 'true') return;
        const open = t.getAttribute('aria-expanded') !== 'true';
        const acc = t.closest('.accordion');
        if (open && acc && acc.hasAttribute('data-single')) $$('.accordion__trigger[aria-expanded="true"]', acc).forEach((o) => o !== t && setAcc(o, false));
        setAcc(t, open);
      });
    });
  }

  /* ── 12. 가로 넘침 힌트 ───────────────────────────────────────────── */
  function updateScroll(el) {
    const max = el.scrollWidth - el.clientWidth;
    el.classList.toggle('has-more-start', el.scrollLeft > 4);
    el.classList.toggle('has-more-end', max > 4 && el.scrollLeft < max - 4);
  }
  function initScrollHints() {
    const els = $$('.scroll-x, .tabs__list, .kanban');
    els.forEach((el) => { updateScroll(el); el.addEventListener('scroll', () => updateScroll(el), { passive: true }); });
    window.addEventListener('resize', () => els.forEach(updateScroll));
  }

  /* ── 13. 캐러셀 — [data-carousel] ─────────────────────────────────── */
  function initCarousel(c) {
    const track = $('.carousel__track', c);
    const slides = $$('.carousel__slide', c);
    if (!track || !slides.length) return;
    let i = Math.max(0, slides.findIndex((s) => s.classList.contains('is-current')));
    const dotsWrap = $('.carousel__dots', c);
    const count = $('.carousel__count', c);
    c.setAttribute('role', 'region');
    c.setAttribute('aria-roledescription', '포스터 넘기기');
    slides.forEach((s, n) => { s.setAttribute('role', 'group'); s.setAttribute('aria-roledescription', '포스터'); s.setAttribute('aria-label', `${n + 1} / ${slides.length}`); });
    if (dotsWrap && !dotsWrap.children.length) {
      slides.forEach((s, n) => {
        const b = doc.createElement('button');
        b.type = 'button'; b.className = 'carousel__dot';
        b.setAttribute('aria-label', `${n + 1}번째 포스터${s.dataset.caption ? ' · ' + s.dataset.caption : ''}`);
        b.addEventListener('click', () => go(n));
        dotsWrap.appendChild(b);
      });
    }
    const prev = $('[data-carousel-prev]', c), next = $('[data-carousel-next]', c);
    function go(n) {
      i = Math.max(0, Math.min(slides.length - 1, n));
      track.style.translate = `${-i * 100}% 0`;
      slides.forEach((s, k) => { s.setAttribute('aria-hidden', k === i ? 'false' : 'true'); s.inert = k !== i; s.classList.toggle('is-current', k === i); });
      if (dotsWrap) $$('.carousel__dot', dotsWrap).forEach((d, k) => d.setAttribute('aria-current', k === i ? 'true' : 'false'));
      if (count) count.textContent = `${String(i + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
      if (prev) prev.disabled = i === 0;
      if (next) next.disabled = i === slides.length - 1;
    }
    prev && prev.addEventListener('click', () => go(i - 1));
    next && next.addEventListener('click', () => go(i + 1));
    c.addEventListener('keydown', (e) => {
      if (e.target.closest('input, textarea, select')) return;
      if (e.key === 'ArrowRight') { e.preventDefault(); go(i + 1); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); go(i - 1); }
    });
    const vp = $('.carousel__viewport', c) || track;
    let sx = null;
    vp.addEventListener('pointerdown', (e) => { sx = e.clientX; });
    vp.addEventListener('pointerup', (e) => { if (sx == null) return; const dx = e.clientX - sx; if (Math.abs(dx) > 40) go(i + (dx < 0 ? 1 : -1)); sx = null; });
    vp.addEventListener('pointercancel', () => { sx = null; });
    go(i);
    c.gyeopGo = go;
  }

  /* ── 14. 마퀴 띠지 — [data-marquee] ───────────────────────────────── */
  function initMarquee(m) {
    const track = $('.marquee__track', m);
    const group = $('.marquee__group', m);
    if (!track || !group || track.dataset.cloned) return;
    const clone = group.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    $$('a, button', clone).forEach((n) => n.tabIndex = -1);
    track.appendChild(clone);
    track.dataset.cloned = '1';
    const btn = $('.marquee__toggle', m);
    if (btn) {
      const sync = () => { const p = m.classList.contains('is-paused'); btn.setAttribute('aria-pressed', p ? 'true' : 'false'); btn.setAttribute('aria-label', p ? '띠지 다시 돌리기' : '띠지 멈추기'); };
      if (reduced()) m.classList.add('is-paused');
      sync();
      btn.addEventListener('click', () => { m.classList.toggle('is-paused'); sync(); });
    }
  }

  /* ── 15. 값 → CSS 변수 (막대·드럼·누적·겹침 막대·슬라이더) ─────────── */
  function initValues(scope = doc) {
    $$('.meter[aria-valuenow], .drum[aria-valuenow]', scope).forEach((el) => {
      const max = parseFloat(el.getAttribute('aria-valuemax') || '100');
      const v = parseFloat(el.getAttribute('aria-valuenow'));
      if (!isNaN(v)) el.style.setProperty('--v', `${Math.max(0, Math.min(100, (v / max) * 100))}%`);
    });
    $$('[data-v]', scope).forEach((el) => el.style.setProperty('--v', `${parseFloat(el.dataset.v)}%`));
    $$('[data-n]', scope).forEach((el) => el.style.setProperty('--n', el.dataset.n));
    $$('[data-plan]', scope).forEach((el) => el.style.setProperty('--plan', `${parseFloat(el.dataset.plan)}%`));
    $$('[data-real]', scope).forEach((el) => el.style.setProperty('--real', `${parseFloat(el.dataset.real)}%`));
    $$('.range__input', scope).forEach((r) => {
      const out = r.id ? $(`output[for="${r.id}"]`) || $('.range__out', r.closest('.range')) : $('.range__out', r.closest('.range'));
      const fmt = r.dataset.format || '';
      const sync = () => {
        const min = parseFloat(r.min || 0), max = parseFloat(r.max || 100), v = parseFloat(r.value);
        r.style.setProperty('--p', `${((v - min) / (max - min)) * 100}%`);
        if (out) out.textContent = fmt ? fmt.replace('{v}', Number(v).toLocaleString('ko-KR')) : Number(v).toLocaleString('ko-KR');
      };
      if (!r.dataset.bound) { r.addEventListener('input', sync); r.dataset.bound = '1'; }
      sync();
    });
  }

  /* ── 16. 달력 — [data-calendar] ───────────────────────────────────── */
  function initCalendar(cal) {
    const days = $$('.cal__day:not(:disabled):not([aria-disabled="true"])', cal);
    const out = $('.cal__output', cal);
    const pick = (d) => {
      days.forEach((x) => x.setAttribute('aria-pressed', x === d ? 'true' : 'false'));
      if (out) out.textContent = d.dataset.summary || d.getAttribute('aria-label') || '';
    };
    days.forEach((d) => { if (!d.hasAttribute('aria-pressed')) d.setAttribute('aria-pressed', 'false'); d.tabIndex = -1; d.addEventListener('click', () => pick(d)); });
    const start = days.find((d) => d.getAttribute('aria-pressed') === 'true') || days.find((d) => d.classList.contains('is-today')) || days[0];
    if (start) start.tabIndex = 0;
    cal.addEventListener('keydown', (e) => {
      const i = days.indexOf(doc.activeElement);
      if (i < 0) return;
      const step = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: 7, ArrowUp: -7 }[e.key];
      if (!step) return;
      e.preventDefault();
      const n = days[Math.max(0, Math.min(days.length - 1, i + step))];
      days.forEach((d) => d.tabIndex = -1);
      n.tabIndex = 0; n.focus();
    });
  }

  /* ── 17. 칸반 — [data-kanban] 드래그 + 키보드 ─────────────────────── */
  function initKanban(kb) {
    const live = doc.createElement('p');
    live.className = 'sr-only'; live.setAttribute('aria-live', 'assertive');
    kb.appendChild(live);
    const say = (t) => { live.textContent = ''; setTimeout(() => { live.textContent = t; }, 30); };
    const cols = () => $$('.kanban__col', kb);
    const nameOf = (col) => ($('.kanban__name', col)?.firstChild?.textContent || '').trim();
    const titleOf = (card) => ($('.kcard__title', card)?.textContent || '').trim();
    const recount = () => cols().forEach((col) => {
      const c = $('.kanban__count', col);
      const extra = parseInt(col.dataset.extra || '0', 10);
      if (c) c.textContent = $$('.kcard', col).length + extra;
    });
    const cards = () => $$('.kcard', kb);
    cards().forEach((c) => { c.tabIndex = 0; c.setAttribute('draggable', 'true'); c.setAttribute('aria-roledescription', '작업 쪽지'); });
    let dragged = null, grabbed = null, origin = null;
    kb.addEventListener('dragstart', (e) => {
      const c = e.target.closest('.kcard'); if (!c) return;
      dragged = c; c.classList.add('is-dragging');
      e.dataTransfer.effectAllowed = 'move';
      try { e.dataTransfer.setData('text/plain', c.dataset.id || ''); } catch (err) { /* 무시 */ }
    });
    kb.addEventListener('dragend', () => { if (dragged) dragged.classList.remove('is-dragging'); dragged = null; $$('.kanban__list.is-over', kb).forEach((l) => l.classList.remove('is-over')); recount(); });
    kb.addEventListener('dragover', (e) => {
      const list = e.target.closest('.kanban__list'); if (!list || !dragged) return;
      e.preventDefault();
      $$('.kanban__list.is-over', kb).forEach((l) => l !== list && l.classList.remove('is-over'));
      list.classList.add('is-over');
      const after = $$('.kcard:not(.is-dragging)', list).find((c) => { const r = c.getBoundingClientRect(); return e.clientY < r.top + r.height / 2; });
      if (after) list.insertBefore(dragged, after); else list.appendChild(dragged);
    });
    kb.addEventListener('drop', (e) => {
      e.preventDefault();
      if (!dragged) return;
      const col = dragged.closest('.kanban__col');
      say(`${titleOf(dragged)} → ${nameOf(col)}`);
      kb.dispatchEvent(new CustomEvent('gyeop:move', { bubbles: true, detail: { id: dragged.dataset.id, to: col.dataset.status } }));
    });
    kb.addEventListener('keydown', (e) => {
      const card = e.target.closest('.kcard'); if (!card) return;
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        if (grabbed === card) {
          card.classList.remove('is-grabbed'); card.setAttribute('aria-pressed', 'false'); grabbed = null; recount();
          const col = card.closest('.kanban__col');
          say(`놓았어요. ${titleOf(card)} — ${nameOf(col)}`);
          kb.dispatchEvent(new CustomEvent('gyeop:move', { bubbles: true, detail: { id: card.dataset.id, to: col.dataset.status } }));
        } else {
          if (grabbed) grabbed.classList.remove('is-grabbed');
          grabbed = card; origin = { list: card.parentElement, next: card.nextElementSibling };
          card.classList.add('is-grabbed'); card.setAttribute('aria-pressed', 'true');
          say(`${titleOf(card)} 쪽지를 집었어요. ←→ 열 이동, ↑↓ 순서, Space 놓기, Esc 취소`);
        }
        return;
      }
      if (e.key === 'Escape' && grabbed === card) {
        e.preventDefault();
        origin.list.insertBefore(card, origin.next); card.classList.remove('is-grabbed'); card.setAttribute('aria-pressed', 'false'); grabbed = null; card.focus(); recount(); say('옮기기를 취소했어요');
        return;
      }
      const list = card.parentElement;
      const sib = $$('.kcard', list);
      const idx = sib.indexOf(card);
      if (grabbed === card) {
        const cl = cols(); const ci = cl.indexOf(card.closest('.kanban__col'));
        if (e.key === 'ArrowUp' && idx > 0) { e.preventDefault(); list.insertBefore(card, sib[idx - 1]); }
        else if (e.key === 'ArrowDown' && idx < sib.length - 1) { e.preventDefault(); list.insertBefore(sib[idx + 1], card); }
        else if ((e.key === 'ArrowRight' && ci < cl.length - 1) || (e.key === 'ArrowLeft' && ci > 0)) {
          e.preventDefault();
          const to = cl[ci + (e.key === 'ArrowRight' ? 1 : -1)];
          const tl = $('.kanban__list', to);
          tl.insertBefore(card, tl.firstElementChild);
          recount();
          say(`${nameOf(to)} 열로`);
        } else return;
        card.focus();
        card.scrollIntoView({ block: 'nearest', inline: 'nearest' });
        return;
      }
      // 집지 않은 상태: 화살표로 쪽지 사이 이동
      const cl = cols(); const ci = cl.indexOf(card.closest('.kanban__col'));
      let target = null;
      if (e.key === 'ArrowDown') target = sib[idx + 1];
      else if (e.key === 'ArrowUp') target = sib[idx - 1];
      else if (e.key === 'ArrowRight') target = cl[ci + 1] && $('.kcard', cl[ci + 1]);
      else if (e.key === 'ArrowLeft') target = cl[ci - 1] && $('.kcard', cl[ci - 1]);
      if (target) { e.preventDefault(); target.focus(); target.scrollIntoView({ block: 'nearest', inline: 'nearest' }); }
    });
    recount();
  }

  /* ── 18. 표 정렬 — th > button.table__sort ────────────────────────── */
  const cellVal = (row, i) => {
    const c = row.cells[i]; if (!c) return '';
    const raw = (c.dataset.sort != null ? c.dataset.sort : c.textContent).trim();
    const n = parseFloat(raw.replace(/[₩,%\s]|면|장|부/g, ''));
    return /^[₩\d,.\-%\s]+(면|장|부)?$/.test(raw) && !isNaN(n) ? n : raw;
  };
  function initTables() {
    $$('.table__sort').forEach((btn) => {
      btn.addEventListener('click', () => {
        const th = btn.closest('th'); const table = th.closest('table'); const tbody = table.tBodies[0];
        const idx = Array.from(th.parentElement.children).indexOf(th);
        const dir = th.getAttribute('aria-sort') === 'ascending' ? 'descending' : 'ascending';
        $$('th[aria-sort]', table).forEach((h) => h !== th && h.removeAttribute('aria-sort'));
        th.setAttribute('aria-sort', dir);
        const rows = Array.from(tbody.rows);
        rows.sort((a, b) => {
          const x = cellVal(a, idx), y = cellVal(b, idx);
          const r = typeof x === 'number' && typeof y === 'number' ? x - y : String(x).localeCompare(String(y), 'ko');
          return dir === 'ascending' ? r : -r;
        });
        rows.forEach((r) => tbody.appendChild(r));
      });
    });
    $$('table[data-selectable] tbody tr').forEach((tr) => {
      tr.addEventListener('click', (e) => {
        if (e.target.closest('a, button, input, label')) return;
        const t = tr.closest('table');
        $$('tbody tr', t).forEach((r) => r.classList.toggle('is-selected', r === tr));
      });
    });
  }

  /* ── 19. 쪽 번호 — [data-pager] ───────────────────────────────────── */
  function initPager(p) {
    const pages = $$('.pager__page', p);
    const prev = $('[data-pager-prev]', p), next = $('[data-pager-next]', p);
    const info = $('[data-pager-info]', p);
    const per = parseInt(p.dataset.per || '12', 10), total = parseInt(p.dataset.total || '0', 10);
    const cur = () => pages.findIndex((x) => x.getAttribute('aria-current') === 'page');
    const set = (i) => {
      if (i < 0 || i >= pages.length) return;
      pages.forEach((x, k) => { if (k === i) x.setAttribute('aria-current', 'page'); else x.removeAttribute('aria-current'); });
      if (prev) prev.disabled = i === 0;
      if (next) next.disabled = i === pages.length - 1;
      const n = parseInt(pages[i].textContent, 10) || i + 1;
      if (info && total) info.innerHTML = `<span class="mono">${(n - 1) * per + 1}–${Math.min(n * per, total)}</span> / <span class="nu"><span class="mono">${total}</span>건</span>`;
      p.dispatchEvent(new CustomEvent('gyeop:page', { bubbles: true, detail: { page: n } }));
    };
    pages.forEach((x, k) => x.addEventListener('click', (e) => { if (x.matches('button') || x.getAttribute('href') === '#') e.preventDefault(); set(k); }));
    prev && prev.addEventListener('click', () => set(cur() - 1));
    next && next.addEventListener('click', () => set(cur() + 1));
    set(Math.max(0, cur()));
  }

  /* ── 20. 리빌(2도 인쇄 순서) — [data-print] [data-print-list] ─────── */
  function printNow(el) { el.classList.add('is-printing', 'is-printed'); }
  function initPrint() {
    const els = $$('[data-print], [data-print-list]');
    $$('[data-print-list]').forEach((l) => Array.from(l.children).forEach((c, i) => c.style.setProperty('--i', i)));
    if (reduced() || !('IntersectionObserver' in window)) { els.forEach((e) => e.classList.add('is-printed')); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { printNow(en.target); io.unobserve(en.target); } });
    }, { threshold: 0.18, rootMargin: '0px 0px -6% 0px' });
    els.forEach((e) => io.observe(e));
  }

  /* ── 21. 모션 견본 다시 찍기 — [data-replay="id"] ───────────────── */
  function initReplay() {
    doc.addEventListener('click', (e) => {
      const b = e.target.closest('[data-replay]'); if (!b) return;
      const t = doc.getElementById(b.dataset.replay) || b.closest('.motion-demo');
      if (!t) return;
      if (t.matches('[data-print], [data-print-list]')) { t.classList.remove('is-printing', 'is-printed'); reflow(t); printNow(t); return; }
      t.classList.remove('is-playing'); reflow(t); t.classList.add('is-playing');
    });
    $$('.motion-demo').forEach((m) => m.classList.add('is-playing'));
  }

  /* ── 22. 분판 보기 — [data-plate-toggle="p|b|y|t"][data-target="#poster"] ── */
  function initPlates() {
    $$('[data-plate-toggle]').forEach((b) => { if (!b.hasAttribute('aria-pressed')) b.setAttribute('aria-pressed', 'true'); });
    doc.addEventListener('click', (e) => {
      const b = e.target.closest('[data-plate-toggle]'); if (!b) return;
      const poster = $(b.dataset.target); if (!poster) return;
      const on = b.getAttribute('aria-pressed') !== 'true';
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
      $$(`.poster__plate--${b.dataset.plateToggle}`, poster).forEach((p) => p.classList.toggle('is-off', !on));
    });
    doc.addEventListener('click', (e) => {
      const b = e.target.closest('[data-register]'); if (!b) return;
      const poster = $(b.dataset.register); if (!poster) return;
      const on = !poster.classList.contains('is-registered');
      poster.classList.toggle('is-registered', on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
  }

  /* ── 23. 로딩 시연 — [data-busy="ms"] ─────────────────────────────── */
  function initBusy() {
    doc.addEventListener('click', (e) => {
      const b = e.target.closest('[data-busy]'); if (!b || b.getAttribute('aria-busy') === 'true') return;
      e.preventDefault();
      const ms = parseInt(b.dataset.busy, 10) || 1200;
      const spin = doc.createElement('span'); spin.className = 'btn__spin'; spin.setAttribute('aria-hidden', 'true');
      b.prepend(spin); b.setAttribute('aria-busy', 'true');
      setTimeout(() => {
        spin.remove(); b.removeAttribute('aria-busy');
        if (b.dataset.toast) toast({ title: b.dataset.toast, text: b.dataset.toastText, tone: b.dataset.toastTone || 'success' });
      }, ms);
    });
  }

  /* ── 24. 복사 — [data-copy] (가장 가까운 .code 의 본문) ─────────────── */
  function initCopy() {
    doc.addEventListener('click', async (e) => {
      const b = e.target.closest('[data-copy]'); if (!b) return;
      const src = b.dataset.copy ? doc.getElementById(b.dataset.copy) : $('.code__body', b.closest('.code'));
      const text = b.dataset.copyText || (src ? src.innerText : '');
      try { await navigator.clipboard.writeText(text); } catch (err) { /* 파일 열람 등에서 실패해도 표시는 한다 */ }
      const label = $('[data-copy-label]', b) || b;
      const old = label.textContent;
      label.textContent = '복사됨';
      b.setAttribute('data-state', 'done');
      setTimeout(() => { label.textContent = old; b.removeAttribute('data-state'); }, 1500);
    });
  }

  /* ── 25. 전표 검사 — form[data-validate] ──────────────────────────── */
  function fieldError(input, msg) {
    const field = input.closest('.field');
    let err = field && $('.field__error', field);
    if (msg) {
      input.setAttribute('aria-invalid', 'true');
      if (field && !err) {
        err = doc.createElement('p'); err.className = 'field__error';
        err.id = ensureId(input, 'f') + '-err';
        field.appendChild(err);
      }
      if (err) {
        err.hidden = false;
        err.innerHTML = `<span data-icon="alert"></span><span>${esc(msg)}</span>`; paintIcons(err);
        const ids = (input.getAttribute('aria-describedby') || '').split(' ').filter(Boolean);
        if (!ids.includes(err.id)) input.setAttribute('aria-describedby', ids.concat(err.id).join(' '));
      }
    } else {
      input.removeAttribute('aria-invalid');
      if (err && !err.hasAttribute('data-static')) err.hidden = true;
    }
  }
  function initForms() {
    $$('form[data-validate]').forEach((f) => {
      f.noValidate = true;
      f.addEventListener('submit', (e) => {
        e.preventDefault();
        let first = null;
        $$('input, select, textarea', f).forEach((i) => {
          if (i.type === 'hidden' || i.disabled) return;
          let msg = '';
          if (i.required && !String(i.value).trim()) msg = i.dataset.required || '빈칸이에요. 채워 주세요.';
          else if (i.type === 'email' && i.value && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(i.value)) msg = '메일 주소 모양이 아니에요. 예: hello@gyeoppan.kr';
          else if (i.pattern && i.value && !new RegExp(`^(?:${i.pattern})$`).test(i.value)) msg = i.dataset.pattern || '형식이 맞지 않아요.';
          else if (i.type === 'number' && i.value && i.min && Number(i.value) < Number(i.min)) msg = i.dataset.min || `최소 ${Number(i.min).toLocaleString('ko-KR')}부터 받아요.`;
          if (i.type !== 'checkbox' && i.type !== 'radio') fieldError(i, msg);
          if (msg && !first) first = i;
        });
        if (first) { first.focus(); toast({ title: '전표에 빈칸이 있어요', text: '빨간 띠가 붙은 칸을 확인해 주세요.', tone: 'danger' }); }
        else toast({ title: f.dataset.success || '전표를 받았어요', text: f.dataset.successText || '', tone: 'success' });
      });
      f.addEventListener('input', (e) => { const i = e.target; if (i.getAttribute('aria-invalid') === 'true' && String(i.value).trim()) fieldError(i, ''); });
    });
    // 드럼 고르기 최대 개수: <fieldset data-max="2">
    $$('fieldset[data-max]').forEach((fs) => {
      const max = parseInt(fs.dataset.max, 10);
      const boxes = $$('input[type="checkbox"]', fs);
      const sync = () => {
        const n = boxes.filter((b) => b.checked).length;
        boxes.forEach((b) => { if (!b.hasAttribute('data-locked')) b.disabled = !b.checked && n >= max; });
        fs.dispatchEvent(new CustomEvent('gyeop:drums', { bubbles: true, detail: { picked: boxes.filter((b) => b.checked).map((b) => b.value) } }));
      };
      boxes.forEach((b) => b.addEventListener('change', sync));
      sync();
    });
    // 분판 파일 놓는 곳
    $$('.dropzone').forEach((z) => {
      const input = $('input[type="file"]', z);
      const out = $('[data-file-name]', z);
      ['dragenter', 'dragover'].forEach((t) => z.addEventListener(t, (e) => { e.preventDefault(); z.classList.add('is-over'); }));
      ['dragleave', 'drop'].forEach((t) => z.addEventListener(t, () => z.classList.remove('is-over')));
      input && input.addEventListener('change', () => { if (out && input.files.length) out.textContent = Array.from(input.files).map((f) => f.name).join(', '); });
    });
  }

  /* ── 26. 닫을 수 있는 쪽지 — [data-dismiss] ───────────────────────── */
  function initDismiss() {
    doc.addEventListener('click', (e) => {
      const b = e.target.closest('[data-dismiss]'); if (!b) return;
      const t = b.dataset.dismiss ? doc.getElementById(b.dataset.dismiss) : b.closest('.alert');
      if (t) t.remove();
    });
  }

  /* ── 시작 ─────────────────────────────────────────────────────────── */
  function init() {
    paintIcons();
    initTheme();
    initOverlays();
    initOffcanvas();
    initCommand();
    initFloats();
    initTips();
    initToasts();
    initTabs();
    initAcc();
    $$('[data-carousel]').forEach(initCarousel);
    $$('[data-marquee]').forEach(initMarquee);
    initValues();
    $$('[data-calendar]').forEach(initCalendar);
    $$('[data-kanban]').forEach(initKanban);
    initTables();
    $$('[data-pager]').forEach(initPager);
    initPrint();
    initReplay();
    initPlates();
    initBusy();
    initCopy();
    initForms();
    initDismiss();
    initScrollHints();
  }
  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', init); else init();

  window.gyeop = { toast, setTheme: (t) => setTheme(t, true), open: (id) => openOverlay(doc.getElementById(id)), close: (id) => closeOverlay(doc.getElementById(id)), icons: paintIcons, values: initValues };
})();
