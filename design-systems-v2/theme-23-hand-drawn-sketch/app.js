/* ==========================================================================
   끄적 디자인 시스템 v2 — app.js (바닐라, 외부 라이브러리 없음)
   테마(낮/밤 보드) · 레이어(모달/드로어/커맨드 ⌘K) · 탭 · 아코디언 · 토스트 · 팝오버 · 메뉴 ·
   툴팁 · 캐러셀 · 칸반(드래그 + 키보드) · 폼 검증 · 표 정렬 · 달력 · 페이지 · 선 그리기(draw-in) ·
   모션 재생 · 복사 · 사이드바 · 마퀴 · 가로 스크롤 페이드 · 도구막대 현재 위치
   마크업 계약은 COMPONENTS.md 참고.
   ========================================================================== */
(() => {
  'use strict';

  const doc = document;
  const root = doc.documentElement;
  const THEME_KEY = 'kkeujeok-theme';
  const SIDEBAR_KEY = 'kkeujeok-sidebar';
  const $ = (sel, ctx = doc) => ctx.querySelector(sel);
  const $$ = (sel, ctx = doc) => Array.from(ctx.querySelectorAll(sel));
  const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let uid = 0;
  const ensureId = (el, prefix) => { if (!el.id) el.id = `${prefix}-${++uid}`; return el.id; };
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* 저장 불가 환경 */ } },
  };
  const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
  const visible = (el) => !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length);
  const focusables = (ctx) => $$(FOCUSABLE, ctx).filter((el) => el.tabIndex >= 0 && visible(el) && !el.closest('[hidden], [inert]'));   // tabindex=-1 (팔레트 옵션 등)은 Tab 순서가 아니다

  root.classList.add('js');

  /* 화면 낭독기 알림 */
  let liveEl = null;
  function announce(msg) {
    if (!liveEl) {
      liveEl = doc.createElement('div');
      liveEl.className = 'sr-only';
      liveEl.setAttribute('aria-live', 'polite');
      doc.body.appendChild(liveEl);
    }
    liveEl.textContent = '';
    window.setTimeout(() => { liveEl.textContent = msg; }, 30);
  }

  /* ------------------------------------------------------------------------
     1. 테마 — 우선순위: ?theme= → localStorage → prefers-color-scheme
     ------------------------------------------------------------------------ */
  const scheme = window.matchMedia('(prefers-color-scheme: dark)');
  const pick = (t) => (t === 'dark' || t === 'light' ? t : null);
  const queryTheme = () => pick(new URLSearchParams(window.location.search).get('theme'));
  const resolveTheme = () => queryTheme() || pick(store.get(THEME_KEY)) || (scheme.matches ? 'dark' : 'light');

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    $$('[data-theme-toggle]').forEach((btn) => {
      const dark = theme === 'dark';
      btn.setAttribute('aria-pressed', String(dark));
      btn.setAttribute('aria-label', dark ? '낮 보드로 바꾸기 (지금 밤 보드)' : '밤 보드로 바꾸기 (지금 낮 보드)');
      $$('[data-theme-label]', btn).forEach((l) => { l.textContent = dark ? '밤 보드' : '낮 보드'; });
    });
  }
  applyTheme(resolveTheme());
  const onScheme = () => { if (!queryTheme() && !pick(store.get(THEME_KEY))) applyTheme(resolveTheme()); };
  if (scheme.addEventListener) scheme.addEventListener('change', onScheme);
  doc.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-theme-toggle]');
    if (!btn) return;
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    store.set(THEME_KEY, next);
    applyTheme(next);
  });

  /* ------------------------------------------------------------------------
     2. 레이어 — 모달 · 드로어 · 커맨드. 포커스 트랩, Esc, 바깥 클릭, 포커스 복귀
     ------------------------------------------------------------------------ */
  const layers = [];   // { el, trigger }
  const LAYER_SEL = '.modal, .drawer, .command';

  function openLayer(el, trigger) {
    if (!el || layers.some((l) => l.el === el)) return;
    closeFloating();
    el.hidden = false;
    el.setAttribute('aria-hidden', 'false');
    void el.offsetWidth;   // 트랜지션 시작점 확보
    el.classList.add('is-open');
    layers.push({ el, trigger: trigger || doc.activeElement });
    doc.body.classList.add('is-locked');
    if (el.classList.contains('command')) resetCommand(el);
    const target = $('[autofocus]', el) || $('[data-initial-focus]', el) || focusables(el)[0];
    window.setTimeout(() => { if (target) target.focus({ preventScroll: true }); }, 20);
  }

  function closeLayer(el) {
    const idx = layers.findIndex((l) => l.el === el);
    if (idx === -1) return;
    const { trigger } = layers[idx];
    layers.splice(idx, 1);
    el.classList.remove('is-open');
    const done = () => { if (!el.classList.contains('is-open')) { el.hidden = true; el.setAttribute('aria-hidden', 'true'); } };
    if (el.classList.contains('drawer') && !reduced()) window.setTimeout(done, 260); else done();
    if (!layers.length && !sidebarOpen()) doc.body.classList.remove('is-locked');
    if (trigger && doc.contains(trigger)) trigger.focus({ preventScroll: true });
  }
  const topLayer = () => (layers.length ? layers[layers.length - 1].el : null);

  doc.addEventListener('click', (e) => {
    const opener = e.target.closest('[data-open]');
    if (opener) {
      const el = doc.getElementById(opener.getAttribute('data-open'));
      if (el) { e.preventDefault(); openLayer(el, opener); }
      return;
    }
    const closer = e.target.closest('[data-close]');
    if (closer) {
      const el = closer.closest(LAYER_SEL);
      if (el) { e.preventDefault(); closeLayer(el); }
      return;
    }
    const top = topLayer();
    if (top && e.target === top) closeLayer(top);   // 백드롭 클릭
  });

  function trapTab(e, container) {
    const items = focusables(container);
    if (!items.length) { e.preventDefault(); return; }
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && (doc.activeElement === first || !container.contains(doc.activeElement))) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && (doc.activeElement === last || !container.contains(doc.activeElement))) { e.preventDefault(); first.focus(); }
  }

  /* ------------------------------------------------------------------------
     3. 커맨드 팔레트 (⌘K / Ctrl+K)
     ------------------------------------------------------------------------ */
  const commandEl = () => doc.getElementById('command') || $('.command');

  function commandOptions(cmd) { return $$('.command__option', cmd).filter((o) => !o.hidden); }
  function setActiveOption(cmd, opt) {
    const input = $('.command__input', cmd);
    $$('.command__option', cmd).forEach((o) => o.setAttribute('aria-selected', String(o === opt)));
    if (opt && input) {
      input.setAttribute('aria-activedescendant', ensureId(opt, 'cmd-opt'));
      opt.scrollIntoView({ block: 'nearest' });
    } else if (input) input.removeAttribute('aria-activedescendant');
  }
  function filterCommand(cmd) {
    const input = $('.command__input', cmd);
    const q = (input ? input.value : '').trim().toLowerCase();
    $$('.command__option', cmd).forEach((o) => {
      const hay = `${o.textContent} ${o.getAttribute('data-keywords') || ''}`.toLowerCase();
      o.hidden = !!q && !hay.includes(q);
    });
    $$('.command__group', cmd).forEach((g) => { g.hidden = !$$('.command__option', g).some((o) => !o.hidden); });
    const opts = commandOptions(cmd);
    const empty = $('.command__empty', cmd);
    if (empty) {
      empty.hidden = opts.length > 0;
      const q2 = $('[data-command-query]', empty);
      if (q2) q2.textContent = input ? input.value.trim() : '';
    }
    setActiveOption(cmd, opts[0] || null);
  }
  function resetCommand(cmd) {
    const input = $('.command__input', cmd);
    if (input) input.value = '';
    filterCommand(cmd);
  }
  function runOption(cmd, opt) {
    if (!opt || opt.getAttribute('aria-disabled') === 'true') return;
    if (opt.tagName === 'A' && opt.getAttribute('href')) { window.location.href = opt.getAttribute('href'); return; }
    const msg = opt.getAttribute('data-toast');
    closeLayer(cmd);
    if (opt.hasAttribute('data-theme-toggle')) return;   // 클릭 위임이 처리
    if (msg) toast({ text: msg, tone: opt.getAttribute('data-toast-tone') || 'info' });
  }
  $$('.command').forEach((cmd) => {
    const input = $('.command__input', cmd);
    const list = $('.command__list', cmd);
    if (input && list) {
      input.setAttribute('role', 'combobox');
      input.setAttribute('aria-expanded', 'true');
      input.setAttribute('aria-controls', ensureId(list, 'cmd-list'));
      input.setAttribute('aria-autocomplete', 'list');
      list.setAttribute('role', 'listbox');
      list.tabIndex = -1;   // 스크롤 영역이 Tab 으로 잡히지 않게 — 옵션 이동은 화살표, 포커스는 입력칸에 머문다
      $$('.command__option', cmd).forEach((o) => { o.setAttribute('role', 'option'); o.setAttribute('tabindex', '-1'); ensureId(o, 'cmd-opt'); });
      input.addEventListener('input', () => filterCommand(cmd));
      input.addEventListener('keydown', (e) => {
        const opts = commandOptions(cmd);
        const cur = opts.findIndex((o) => o.getAttribute('aria-selected') === 'true');
        if (e.key === 'ArrowDown') { e.preventDefault(); setActiveOption(cmd, opts[(cur + 1) % opts.length] || null); }
        else if (e.key === 'ArrowUp') { e.preventDefault(); setActiveOption(cmd, opts[(cur - 1 + opts.length) % opts.length] || null); }
        else if (e.key === 'Home') { e.preventDefault(); setActiveOption(cmd, opts[0] || null); }
        else if (e.key === 'End') { e.preventDefault(); setActiveOption(cmd, opts[opts.length - 1] || null); }
        else if (e.key === 'Enter') { e.preventDefault(); if (opts[cur]) opts[cur].click(); }
      });
      list.addEventListener('mousemove', (e) => {
        const o = e.target.closest('.command__option');
        if (o && o.getAttribute('aria-selected') !== 'true') setActiveOption(cmd, o);
      });
      list.addEventListener('click', (e) => {
        const o = e.target.closest('.command__option');
        if (!o) return;
        if (o.tagName === 'A') return;   // 링크는 그대로 이동
        e.preventDefault();
        runOption(cmd, o);
      });
    }
    // 정적 견본(.command__paper--static)이 아닌 실제 팔레트는 처음에 닫아 둔다
    if (!cmd.classList.contains('is-open')) { cmd.hidden = true; cmd.setAttribute('aria-hidden', 'true'); }
  });
  doc.addEventListener('click', (e) => {
    const t = e.target.closest('[data-command-open]');
    if (!t) return;
    const cmd = commandEl();
    if (cmd) { e.preventDefault(); openLayer(cmd, t); }
  });
  // 정적 견본 안의 입력도 필터는 동작
  $$('.command__paper--static').forEach((paper) => {
    const input = $('.command__input', paper);
    if (!input) return;
    input.addEventListener('input', () => {
      const q = input.value.trim().toLowerCase();
      $$('.command__option', paper).forEach((o) => { o.hidden = !!q && !o.textContent.toLowerCase().includes(q); });
    });
  });

  /* ------------------------------------------------------------------------
     4. 메뉴 · 팝오버 (떠 있는 것들)
     ------------------------------------------------------------------------ */
  let openMenu = null;      // { menu, trigger }
  let openPop = null;       // { pop, trigger }

  function closeMenu(refocus) {
    if (!openMenu) return;
    const { menu, trigger } = openMenu;
    menu.hidden = true;
    menu.classList.remove('is-open');
    trigger.setAttribute('aria-expanded', 'false');
    openMenu = null;
    if (refocus) trigger.focus();
  }
  function menuItems(menu) { return $$('[role^="menuitem"]', menu).filter((i) => !i.disabled && i.getAttribute('aria-disabled') !== 'true' && visible(i)); }
  function openMenuFor(trigger, focusLast) {
    const menu = doc.getElementById(trigger.getAttribute('data-menu'));
    if (!menu) return;
    closeFloating();
    menu.hidden = false;
    menu.classList.add('is-open');
    trigger.setAttribute('aria-expanded', 'true');
    menu.classList.remove('menu--end');
    const r = menu.getBoundingClientRect();
    if (r.right > window.innerWidth - 8) menu.classList.add('menu--end');
    openMenu = { menu, trigger };
    const items = menuItems(menu);
    const target = focusLast ? items[items.length - 1] : items[0];
    if (target) target.focus();
  }
  $$('[data-menu]').forEach((trigger) => {
    const menu = doc.getElementById(trigger.getAttribute('data-menu'));
    if (!menu) return;
    trigger.setAttribute('aria-haspopup', 'menu');
    trigger.setAttribute('aria-expanded', 'false');
    trigger.setAttribute('aria-controls', ensureId(menu, 'menu'));
    menu.setAttribute('role', 'menu');
    if (!menu.classList.contains('menu--static')) menu.hidden = true;
    $$('.menu__item', menu).forEach((i) => { if (!i.getAttribute('role')) i.setAttribute('role', 'menuitem'); i.setAttribute('tabindex', '-1'); });
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (openMenu && openMenu.menu === menu) closeMenu(false); else openMenuFor(trigger);
    });
    trigger.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') { e.preventDefault(); openMenuFor(trigger); }
      if (e.key === 'ArrowUp') { e.preventDefault(); openMenuFor(trigger, true); }
    });
    menu.addEventListener('keydown', (e) => {
      const items = menuItems(menu);
      const i = items.indexOf(doc.activeElement);
      if (e.key === 'ArrowDown') { e.preventDefault(); items[(i + 1) % items.length].focus(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); items[(i - 1 + items.length) % items.length].focus(); }
      else if (e.key === 'Home') { e.preventDefault(); items[0].focus(); }
      else if (e.key === 'End') { e.preventDefault(); items[items.length - 1].focus(); }
      else if (e.key === 'Tab') closeMenu(false);
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
      if (!item.hasAttribute('data-keep-open')) closeMenu(true);
    });
  });
  // 정적 견본 메뉴도 키보드로 움직인다
  $$('.menu--static').forEach((menu) => {
    $$('.menu__item', menu).forEach((i) => { if (!i.getAttribute('role')) i.setAttribute('role', 'menuitem'); });
    if (!menu.getAttribute('role')) menu.setAttribute('role', 'menu');
  });

  function placeFloating(el, trigger, gap = 12) {
    const t = trigger.getBoundingClientRect();
    el.style.position = 'fixed';
    el.style.left = '0px';
    el.style.top = '0px';
    const r = el.getBoundingClientRect();
    let placement = 'top';
    let top = t.top - r.height - gap;
    if (top < 8) { placement = 'bottom'; top = t.bottom + gap; }
    let left = t.left + t.width / 2 - r.width / 2;
    left = Math.max(8, Math.min(left, window.innerWidth - r.width - 8));
    el.style.left = `${Math.round(left)}px`;
    el.style.top = `${Math.round(top)}px`;
    el.setAttribute('data-placement', placement);
    const tail = Math.max(14, Math.min(r.width - 14, t.left + t.width / 2 - left));
    el.style.setProperty('--tail-x', `${Math.round(tail - 8)}px`);
  }

  function closePopover(refocus) {
    if (!openPop) return;
    const { pop, trigger } = openPop;
    pop.hidden = true;
    pop.classList.remove('is-open');
    trigger.setAttribute('aria-expanded', 'false');
    openPop = null;
    if (refocus) trigger.focus();
  }
  $$('[data-popover]').forEach((trigger) => {
    const pop = doc.getElementById(trigger.getAttribute('data-popover'));
    if (!pop) return;
    trigger.setAttribute('aria-expanded', 'false');
    trigger.setAttribute('aria-controls', ensureId(pop, 'pop'));
    if (!pop.getAttribute('role')) pop.setAttribute('role', 'dialog');
    if (!pop.classList.contains('popover--static')) pop.hidden = true;
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (openPop && openPop.pop === pop) { closePopover(false); return; }
      closeFloating();
      pop.hidden = false;
      pop.classList.add('is-open');
      placeFloating(pop, trigger);
      trigger.setAttribute('aria-expanded', 'true');
      openPop = { pop, trigger };
      const f = focusables(pop)[0];
      if (f) f.focus({ preventScroll: true });
    });
    pop.addEventListener('click', (e) => {
      if (e.target.closest('[data-popover-close]')) { e.preventDefault(); closePopover(true); }
    });
  });
  const reposition = () => { if (openPop) placeFloating(openPop.pop, openPop.trigger); };
  window.addEventListener('resize', reposition);
  window.addEventListener('scroll', reposition, { passive: true });

  function closeFloating() { closeMenu(false); closePopover(false); hideTip(); }
  doc.addEventListener('click', (e) => {
    if (openMenu && !openMenu.menu.contains(e.target) && !openMenu.trigger.contains(e.target)) closeMenu(false);
    if (openPop && !openPop.pop.contains(e.target) && !openPop.trigger.contains(e.target)) closePopover(false);
  });

  /* ------------------------------------------------------------------------
     5. 툴팁 — [data-tip], 지연 400ms
     ------------------------------------------------------------------------ */
  let tipEl = null;
  let tipTimer = 0;
  let tipOwner = null;
  function showTip(owner) {
    if (!tipEl) {
      tipEl = doc.createElement('div');
      tipEl.className = 'tooltip';
      tipEl.setAttribute('role', 'tooltip');
      tipEl.id = 'kk-tooltip';
      doc.body.appendChild(tipEl);
    }
    tipEl.textContent = owner.getAttribute('data-tip');
    const kbd = owner.getAttribute('data-tip-kbd');
    if (kbd) { const k = doc.createElement('span'); k.className = 'kbd'; k.textContent = kbd; tipEl.appendChild(k); }
    tipEl.classList.remove('is-visible');
    placeFloating(tipEl, owner, 10);
    owner.setAttribute('aria-describedby', 'kk-tooltip');
    tipOwner = owner;
    requestAnimationFrame(() => tipEl.classList.add('is-visible'));
  }
  function hideTip() {
    window.clearTimeout(tipTimer);
    if (tipEl) tipEl.classList.remove('is-visible');
    if (tipOwner) { tipOwner.removeAttribute('aria-describedby'); tipOwner = null; }
  }
  const tipDelay = () => (reduced() ? 0 : 400);
  doc.addEventListener('pointerover', (e) => {
    const o = e.target.closest('[data-tip]');
    if (!o || o === tipOwner) return;
    window.clearTimeout(tipTimer);
    tipTimer = window.setTimeout(() => showTip(o), tipDelay());
  });
  doc.addEventListener('pointerout', (e) => {
    const o = e.target.closest('[data-tip]');
    if (o && !o.contains(e.relatedTarget)) hideTip();
  });
  doc.addEventListener('focusin', (e) => {
    const o = e.target.closest && e.target.closest('[data-tip]');
    if (o) { window.clearTimeout(tipTimer); tipTimer = window.setTimeout(() => showTip(o), tipDelay()); }
  });
  doc.addEventListener('focusout', (e) => { if (e.target.closest && e.target.closest('[data-tip]')) hideTip(); });

  /* ------------------------------------------------------------------------
     6. 사이드바 — 접기(데스크톱) · 오프캔버스(≤1024)
     ------------------------------------------------------------------------ */
  const sidebarOpen = () => !!$('.sidebar.is-open');
  let sidebarTrigger = null;
  function setSidebar(open, trigger) {
    const sb = $('.sidebar');
    if (!sb) return;
    sb.classList.toggle('is-open', open);
    $$('[data-sidebar-toggle]').forEach((b) => b.setAttribute('aria-expanded', String(open)));
    if (open) {
      sidebarTrigger = trigger || doc.activeElement;
      doc.body.classList.add('is-locked');
      const f = focusables(sb)[0];
      window.setTimeout(() => { if (f) f.focus(); }, 30);
    } else {
      if (!layers.length) doc.body.classList.remove('is-locked');
      if (sidebarTrigger && doc.contains(sidebarTrigger)) sidebarTrigger.focus();
      sidebarTrigger = null;
    }
  }
  (() => {
    const sb = $('.sidebar');
    if (!sb) return;
    if (!sb.nextElementSibling || !sb.nextElementSibling.classList.contains('sidebar-scrim')) {
      const scrim = doc.createElement('div');
      scrim.className = 'sidebar-scrim';
      scrim.setAttribute('aria-hidden', 'true');
      sb.after(scrim);
    }
    const app = sb.closest('.app');
    if (app && store.get(SIDEBAR_KEY) === 'collapsed') app.setAttribute('data-sidebar', 'collapsed');
    $$('[data-sidebar-collapse]').forEach((b) => b.setAttribute('aria-expanded', String(!app || app.getAttribute('data-sidebar') !== 'collapsed')));
  })();
  doc.addEventListener('click', (e) => {
    const t = e.target.closest('[data-sidebar-toggle]');
    if (t) { e.preventDefault(); setSidebar(!sidebarOpen(), t); return; }
    if (e.target.classList && e.target.classList.contains('sidebar-scrim')) { setSidebar(false); return; }
    const c = e.target.closest('[data-sidebar-collapse]');
    if (c) {
      const app = c.closest('.app') || $('.app');
      if (!app) return;
      const collapsed = app.getAttribute('data-sidebar') !== 'collapsed';
      app.setAttribute('data-sidebar', collapsed ? 'collapsed' : 'expanded');
      c.setAttribute('aria-expanded', String(!collapsed));
      c.setAttribute('aria-label', collapsed ? '사이드바 펼치기' : '사이드바 접기');
      store.set(SIDEBAR_KEY, collapsed ? 'collapsed' : 'expanded');
    }
  });
  window.matchMedia('(min-width: 1025px)').addEventListener('change', (m) => { if (m.matches && sidebarOpen()) setSidebar(false); });

  /* ------------------------------------------------------------------------
     7. 전역 키보드 — Esc, Tab 트랩, ⌘K
     ------------------------------------------------------------------------ */
  doc.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
      const cmd = commandEl();
      if (cmd) {
        e.preventDefault();
        if (cmd.classList.contains('is-open')) closeLayer(cmd); else openLayer(cmd, doc.activeElement);
      }
      return;
    }
    if (e.key === 'Escape') {
      if (tipOwner) { hideTip(); return; }
      if (openMenu) { e.preventDefault(); closeMenu(true); return; }
      if (openPop) { e.preventDefault(); closePopover(true); return; }
      const top = topLayer();
      if (top) { e.preventDefault(); closeLayer(top); return; }
      if (sidebarOpen()) { e.preventDefault(); setSidebar(false); }
      return;
    }
    if (e.key === 'Tab') {
      const top = topLayer();
      if (top) { trapTab(e, top); return; }
      if (sidebarOpen()) trapTab(e, $('.sidebar.is-open'));
    }
  });

  /* ------------------------------------------------------------------------
     8. 탭 — 동그라미로 고르기
     ------------------------------------------------------------------------ */
  function selectTab(tab, focus) {
    const list = tab.closest('[role="tablist"]');
    const tabs = $$('[role="tab"]', list);
    tabs.forEach((t) => {
      const on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      const panel = doc.getElementById(t.getAttribute('aria-controls'));
      if (panel) {
        panel.hidden = !on;
        if (on) { panel.classList.remove('is-entering'); void panel.offsetWidth; panel.classList.add('is-entering'); }
      }
    });
    if (focus) tab.focus();
    tab.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  }
  $$('[role="tablist"]').forEach((list) => {
    const tabs = $$('[role="tab"]', list);
    if (!tabs.length) return;
    const current = tabs.find((t) => t.getAttribute('aria-selected') === 'true') || tabs[0];
    tabs.forEach((t) => {
      t.tabIndex = t === current ? 0 : -1;
      const panel = doc.getElementById(t.getAttribute('aria-controls'));
      if (panel) {
        panel.setAttribute('role', 'tabpanel');
        panel.setAttribute('aria-labelledby', ensureId(t, 'tab'));
        if (!panel.hasAttribute('tabindex')) panel.tabIndex = 0;
        panel.hidden = t !== current;
      }
      t.addEventListener('click', () => { if (!t.disabled && t.getAttribute('aria-disabled') !== 'true') selectTab(t, false); });
    });
    list.addEventListener('keydown', (e) => {
      const live = tabs.filter((t) => !t.disabled && t.getAttribute('aria-disabled') !== 'true');
      const i = live.indexOf(doc.activeElement);
      if (i === -1) return;
      let next = null;
      if (e.key === 'ArrowRight') next = live[(i + 1) % live.length];
      else if (e.key === 'ArrowLeft') next = live[(i - 1 + live.length) % live.length];
      else if (e.key === 'Home') next = live[0];
      else if (e.key === 'End') next = live[live.length - 1];
      if (next) { e.preventDefault(); selectTab(next, true); }
    });
  });

  /* ------------------------------------------------------------------------
     9. 아코디언
     ------------------------------------------------------------------------ */
  $$('.accordion__trigger').forEach((btn) => {
    const panel = doc.getElementById(btn.getAttribute('aria-controls'));
    if (!panel) return;
    panel.setAttribute('role', 'region');
    panel.setAttribute('aria-labelledby', ensureId(btn, 'acc'));
    panel.hidden = btn.getAttribute('aria-expanded') !== 'true';
    btn.addEventListener('click', () => {
      const open = btn.getAttribute('aria-expanded') !== 'true';
      const acc = btn.closest('.accordion');
      if (open && acc && acc.getAttribute('data-accordion') === 'single') {
        $$('.accordion__trigger[aria-expanded="true"]', acc).forEach((o) => {
          if (o === btn) return;
          o.setAttribute('aria-expanded', 'false');
          const p = doc.getElementById(o.getAttribute('aria-controls'));
          if (p) p.hidden = true;
        });
      }
      btn.setAttribute('aria-expanded', String(open));
      panel.hidden = !open;
      if (open) { panel.classList.remove('is-opening'); void panel.offsetWidth; panel.classList.add('is-opening'); }
    });
  });

  /* ------------------------------------------------------------------------
     10. 토스트 — 포스트잇이 붙고 4초 뒤 떨어진다
     ------------------------------------------------------------------------ */
  let stack = null;
  function toast({ title = '', text = '', tone = 'default', duration } = {}) {
    if (!stack) {
      stack = $('.toast-stack');
      if (!stack) {
        stack = doc.createElement('div');
        stack.className = 'toast-stack';
        doc.body.appendChild(stack);
      }
      stack.setAttribute('aria-live', 'polite');
      stack.setAttribute('aria-relevant', 'additions');
    }
    const t = doc.createElement('div');
    t.className = `toast${tone && tone !== 'default' ? ` toast--${tone}` : ''}`;
    t.setAttribute('role', tone === 'error' ? 'alert' : 'status');
    if (title) { const h = doc.createElement('p'); h.className = 'toast__title'; h.textContent = title; t.appendChild(h); }
    if (text) { const p = doc.createElement('p'); p.className = 'toast__text'; p.textContent = text; t.appendChild(p); }
    const x = doc.createElement('button');
    x.type = 'button';
    x.className = 'toast__close';
    x.setAttribute('aria-label', '알림 떼기');
    t.appendChild(x);
    stack.appendChild(t);
    while (stack.children.length > 3) stack.firstElementChild.remove();
    const ms = duration || (tone === 'error' ? 6000 : 4000);
    let timer = window.setTimeout(() => peel(t), ms);
    t.addEventListener('mouseenter', () => window.clearTimeout(timer));
    t.addEventListener('mouseleave', () => { timer = window.setTimeout(() => peel(t), 1600); });
    x.addEventListener('click', () => peel(t));
    return t;
  }
  function peel(t) {
    if (!t.isConnected || t.classList.contains('is-leaving')) return;
    if (reduced()) { t.remove(); return; }
    t.classList.add('is-leaving');
    t.addEventListener('animationend', () => t.remove(), { once: true });
    window.setTimeout(() => t.remove(), 400);
  }
  window.kkToast = toast;
  doc.addEventListener('click', (e) => {
    const t = e.target.closest('[data-toast]');
    if (!t || t.closest('.command') || t.closest('form[data-validate]') && t.type === 'submit') return;
    toast({ title: t.getAttribute('data-toast-title') || '', text: t.getAttribute('data-toast'), tone: t.getAttribute('data-toast-tone') || 'default' });
  });

  /* 알림 떼기 */
  doc.addEventListener('click', (e) => {
    const d = e.target.closest('[data-dismiss]');
    if (!d) return;
    const target = d.getAttribute('data-dismiss') ? doc.getElementById(d.getAttribute('data-dismiss')) : d.closest('.alert');
    if (!target) return;
    if (reduced()) { target.hidden = true; return; }
    target.classList.add('is-leaving');
    window.setTimeout(() => { target.hidden = true; target.classList.remove('is-leaving'); }, 200);
  });

  /* ------------------------------------------------------------------------
     11. 캐러셀 — 스케치북 장 넘기기
     ------------------------------------------------------------------------ */
  $$('.carousel').forEach((car) => {
    const track = $('.carousel__track', car);
    const slides = $$('.carousel__slide', car);
    if (!track || !slides.length) return;
    let index = Math.max(0, slides.findIndex((s) => s.classList.contains('is-current')));
    const prev = $('[data-carousel-prev]', car);
    const next = $('[data-carousel-next]', car);
    const dotsWrap = $('.carousel__dots', car);
    const counter = $('[data-carousel-current]', car);
    car.setAttribute('role', car.getAttribute('role') || 'region');
    car.setAttribute('aria-roledescription', '캐러셀');
    slides.forEach((s, i) => {
      s.setAttribute('role', 'group');
      s.setAttribute('aria-roledescription', '장');
      if (!s.getAttribute('aria-label')) s.setAttribute('aria-label', `${slides.length}장 중 ${i + 1}장`);
    });
    if (dotsWrap && !dotsWrap.children.length) {
      slides.forEach((s, i) => {
        const b = doc.createElement('button');
        b.type = 'button';
        b.className = 'carousel__dot';
        b.setAttribute('aria-label', `${i + 1}장으로`);
        dotsWrap.appendChild(b);
      });
    }
    const dots = dotsWrap ? $$('.carousel__dot', dotsWrap) : [];
    function go(i, announceIt) {
      index = Math.max(0, Math.min(slides.length - 1, i));
      track.style.transform = `translateX(${-100 * index}%)`;
      slides.forEach((s, k) => {
        const on = k === index;
        s.setAttribute('aria-hidden', String(!on));
        if (on) s.removeAttribute('inert'); else s.setAttribute('inert', '');
      });
      dots.forEach((d, k) => { if (k === index) d.setAttribute('aria-current', 'true'); else d.removeAttribute('aria-current'); });
      if (prev) prev.disabled = index === 0;
      if (next) next.disabled = index === slides.length - 1;
      if (counter) counter.textContent = String(index + 1);
      if (announceIt) announce(`${slides.length}장 중 ${index + 1}장`);
    }
    if (prev) prev.addEventListener('click', () => go(index - 1, true));
    if (next) next.addEventListener('click', () => go(index + 1, true));
    dots.forEach((d, k) => d.addEventListener('click', () => go(k, true)));
    car.addEventListener('keydown', (e) => {
      if (e.target.closest('input, textarea, select')) return;
      if (e.key === 'ArrowRight') { e.preventDefault(); go(index + 1, true); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(index - 1, true); }
    });
    let sx = null;
    track.addEventListener('pointerdown', (e) => { sx = e.clientX; });
    track.addEventListener('pointerup', (e) => {
      if (sx === null) return;
      const dx = e.clientX - sx;
      if (Math.abs(dx) > 40) go(index + (dx < 0 ? 1 : -1), true);
      sx = null;
    });
    go(index, false);
  });

  /* ------------------------------------------------------------------------
     12. 칸반 — 떼고 붙이기 (드래그) + 키보드 대안
     ------------------------------------------------------------------------ */
  function refreshKanban(board) {
    $$('.kanban__col', board).forEach((col) => {
      /* 칸반 미니(index 회고 벽)는 칸마다 일부만 보여 준다 — data-rest = 스프린트 보드에 남은 장 수 */
      const rest = parseInt(col.getAttribute('data-rest'), 10) || 0;
      const n = $$('.kanban__card', col).length + rest;
      const wip = parseInt(col.getAttribute('data-wip'), 10);
      const count = $('.kanban__count', col);
      if (count) count.textContent = Number.isFinite(wip) ? `${n}/${wip}` : String(n);
      if (Number.isFinite(wip)) col.setAttribute('data-over', String(n > wip));
    });
  }
  function stick(card) {
    card.classList.remove('is-dropped');
    void card.offsetWidth;
    card.classList.add('is-dropped');
    window.setTimeout(() => card.classList.remove('is-dropped'), 400);
  }
  function moveCard(card, dir) {
    const board = card.closest('.kanban');
    const cols = $$('.kanban__col', board);
    const col = card.closest('.kanban__col');
    const target = cols[cols.indexOf(col) + dir];
    if (!target) { announce(dir > 0 ? '마지막 칸이에요' : '첫 칸이에요'); return; }
    const list = $('.kanban__list', target);
    list.insertBefore(card, list.firstElementChild);
    stick(card);
    refreshKanban(board);
    const name = $('.kanban__name, .tape--label', target);
    const id = $('.kanban__id', card);
    announce(`${id ? id.textContent : '카드'}를 ${name ? name.textContent.trim() : '다음 칸'}(으)로 옮겼어요`);
    card.focus();
  }
  $$('.kanban').forEach((board) => {
    let dragging = null;
    $$('.kanban__card', board).forEach((card) => {
      card.setAttribute('draggable', 'true');
      if (!card.hasAttribute('tabindex')) card.tabIndex = 0;
    });
    board.addEventListener('dragstart', (e) => {
      const card = e.target.closest('.kanban__card');
      if (!card) return;
      dragging = card;
      card.classList.add('is-dragging');
      e.dataTransfer.effectAllowed = 'move';
      try { e.dataTransfer.setData('text/plain', card.id || 'card'); } catch (err) { /* 무시 */ }
    });
    board.addEventListener('dragend', () => {
      if (!dragging) return;
      dragging.classList.remove('is-dragging');
      $$('.kanban__list.is-over', board).forEach((l) => l.classList.remove('is-over'));
      stick(dragging);
      refreshKanban(board);
      dragging = null;
    });
    board.addEventListener('dragover', (e) => {
      const list = e.target.closest('.kanban__list');
      if (!list || !dragging) return;
      e.preventDefault();
      $$('.kanban__list.is-over', board).forEach((l) => { if (l !== list) l.classList.remove('is-over'); });
      list.classList.add('is-over');
      const after = $$('.kanban__card:not(.is-dragging)', list).find((c) => {
        const r = c.getBoundingClientRect();
        return e.clientY < r.top + r.height / 2;
      });
      if (after) list.insertBefore(dragging, after); else list.insertBefore(dragging, $('.kanban__add, .kanban__more', list) || null);
    });
    board.addEventListener('drop', (e) => { if (e.target.closest('.kanban__list')) e.preventDefault(); });
    board.addEventListener('keydown', (e) => {
      const card = e.target.closest('.kanban__card');
      if (!card || e.target !== card || !e.altKey) return;
      if (e.key === 'ArrowRight') { e.preventDefault(); moveCard(card, 1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); moveCard(card, -1); }
    });
    refreshKanban(board);
  });
  doc.addEventListener('click', (e) => {
    const b = e.target.closest('[data-kanban-move]');
    if (!b) return;
    const card = b.closest('.kanban__card') || doc.getElementById(b.getAttribute('data-kanban-card'));
    if (card) moveCard(card, b.getAttribute('data-kanban-move') === 'prev' ? -1 : 1);
  });

  /* ------------------------------------------------------------------------
     13. 폼 — 동그라미 + 화살표 + 메모, 흔들기
     ------------------------------------------------------------------------ */
  const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  function checkField(input) {
    const v = input.value.trim();
    let msg = '';
    if (input.required && !v && input.type !== 'checkbox') msg = input.getAttribute('data-msg-required') || '비어 있어요';
    else if (input.type === 'checkbox' && input.required && !input.checked) msg = input.getAttribute('data-msg-required') || '확인이 필요해요';
    else if (v && input.type === 'email' && !EMAIL.test(v)) msg = input.getAttribute('data-msg-type') || '이메일 형식이 아니에요';
    else if (v && input.minLength > 0 && v.length < input.minLength) msg = input.getAttribute('data-msg-short') || `${input.minLength}자 이상 써 주세요`;
    else if (v && input.pattern && !new RegExp(`^(?:${input.pattern})$`).test(v)) msg = input.getAttribute('data-msg-type') || '형식을 확인해 주세요';
    const field = input.closest('.field');
    const err = field ? $('.field__error', field) : null;
    if (msg) {
      input.setAttribute('aria-invalid', 'true');
      if (err) { err.textContent = msg; input.setAttribute('aria-describedby', ensureId(err, 'err')); }
    } else {
      input.removeAttribute('aria-invalid');
      if (err && input.getAttribute('aria-describedby') === err.id) {
        const hint = field ? $('.field__hint', field) : null;
        if (hint) input.setAttribute('aria-describedby', ensureId(hint, 'hint')); else input.removeAttribute('aria-describedby');
      }
    }
    return !msg;
  }
  function jiggle(el) {
    if (!el || reduced()) return;
    el.classList.remove('is-jiggling');
    void el.offsetWidth;
    el.classList.add('is-jiggling');
    window.setTimeout(() => el.classList.remove('is-jiggling'), 360);
  }
  $$('form[data-validate]').forEach((form) => {
    form.setAttribute('novalidate', '');
    const inputs = () => $$('input, textarea, select', form).filter((i) => !i.disabled && (i.required || i.type === 'email' || i.pattern || i.minLength > 0));
    inputs().forEach((i) => {
      i.addEventListener('blur', () => { if (i.value.trim()) checkField(i); });
      i.addEventListener('input', () => { if (i.getAttribute('aria-invalid') === 'true') checkField(i); });
      i.addEventListener('change', () => { if (i.getAttribute('aria-invalid') === 'true') checkField(i); });
    });
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const bad = inputs().filter((i) => !checkField(i));
      if (bad.length) {
        bad.forEach((i) => jiggle(i.closest('.field__box') || i.closest('.check') || i));
        bad[0].focus();
        const msg = form.getAttribute('data-error-toast');
        if (msg) toast({ title: '저장하지 못했어요', text: msg, tone: 'error' });
        announce(`${bad.length}곳을 고쳐 주세요`);
        return;
      }
      const submit = $('[type="submit"]', form);
      const finish = () => {
        if (submit) setBusy(submit, false);
        toast({ title: form.getAttribute('data-success-title') || '저장했어요', text: form.getAttribute('data-success') || '', tone: 'success' });
      };
      if (submit) { setBusy(submit, true); window.setTimeout(finish, reduced() ? 0 : 900); } else finish();
    });
  });

  /* 불러오는 중 상태 */
  function setBusy(btn, busy) {
    if (busy) {
      if (!$('.btn__busy', btn)) {
        const s = doc.createElement('span');
        s.className = 'btn__busy spinner';
        s.setAttribute('aria-hidden', 'true');
        btn.prepend(s);
      }
      btn.setAttribute('aria-busy', 'true');
    } else btn.removeAttribute('aria-busy');
  }
  doc.addEventListener('click', (e) => {
    const b = e.target.closest('[data-busy-demo]');
    if (!b || b.getAttribute('aria-busy') === 'true') return;
    setBusy(b, true);
    window.setTimeout(() => {
      setBusy(b, false);
      const msg = b.getAttribute('data-busy-demo');
      if (msg) toast({ text: msg, tone: 'success' });
    }, 1600);
  });

  /* 토글 스위치 */
  doc.addEventListener('click', (e) => {
    const s = e.target.closest('[role="switch"]');
    if (!s || s.disabled) return;
    const on = s.getAttribute('aria-checked') !== 'true';
    s.setAttribute('aria-checked', String(on));
    const st = $('.switch__state', s);
    if (st) st.textContent = on ? (s.getAttribute('data-on') || '켜짐') : (s.getAttribute('data-off') || '꺼짐');
  });

  /* 구간 선택 → 대상에 data-mode 를 건다 (요금제 월/연간 등) */
  $$('[data-mode-target]').forEach((group) => {
    const target = doc.querySelector(group.getAttribute('data-mode-target'));
    if (!target) return;
    const sync = () => { const c = $('input:checked', group); if (c) target.setAttribute('data-mode', c.value); };
    group.addEventListener('change', sync);
    sync();
  });

  /* 도구 묶음: 하나만 눌림 */
  doc.addEventListener('click', (e) => {
    const b = e.target.closest('[data-tool-group] [aria-pressed]');
    if (!b) return;
    $$('[aria-pressed]', b.closest('[data-tool-group]')).forEach((o) => o.setAttribute('aria-pressed', String(o === b)));
  });

  /* ------------------------------------------------------------------------
     14. 표 정렬
     ------------------------------------------------------------------------ */
  const cellValue = (td) => {
    const raw = (td.getAttribute('data-value') || td.textContent).trim();
    const n = parseFloat(raw.replace(/[₩,%장건명개\s]/g, ''));
    return Number.isFinite(n) && /^[₩\d.,\-%\s장건명개]+$/.test(raw) ? n : raw;
  };
  doc.addEventListener('click', (e) => {
    const btn = e.target.closest('.table__sort');
    if (!btn) return;
    const th = btn.closest('th');
    const table = th.closest('table');
    const tbody = table.tBodies[0];
    if (!tbody) return;
    const col = Array.from(th.parentElement.children).indexOf(th);
    const dir = th.getAttribute('aria-sort') === 'ascending' ? 'descending' : 'ascending';
    $$('th[aria-sort]', table).forEach((h) => h.setAttribute('aria-sort', 'none'));
    th.setAttribute('aria-sort', dir);
    const rows = Array.from(tbody.rows).filter((r) => !r.classList.contains('table__empty'));
    rows.sort((a, b) => {
      const x = cellValue(a.cells[col]);
      const y = cellValue(b.cells[col]);
      const c = typeof x === 'number' && typeof y === 'number' ? x - y : String(x).localeCompare(String(y), 'ko');
      return dir === 'ascending' ? c : -c;
    });
    rows.forEach((r) => tbody.appendChild(r));
    announce(`${btn.textContent.trim()} ${dir === 'ascending' ? '오름차순' : '내림차순'} 정렬`);
  });

  /* 표 행 선택 체크 */
  doc.addEventListener('change', (e) => {
    const c = e.target.closest('.table tbody .check__box');
    if (!c) return;
    const tr = c.closest('tr');
    if (tr) tr.setAttribute('aria-selected', String(c.checked));
  });

  /* ------------------------------------------------------------------------
     15. 달력 · 페이지 · 리스트 선택
     ------------------------------------------------------------------------ */
  doc.addEventListener('click', (e) => {
    const day = e.target.closest('button.cal__day');
    if (day && !day.disabled) {
      $$('button.cal__day[aria-pressed="true"]', day.closest('.cal')).forEach((d) => d.setAttribute('aria-pressed', 'false'));
      day.setAttribute('aria-pressed', 'true');
      const out = $('[data-cal-output]', day.closest('.cal'));
      if (out) out.textContent = day.getAttribute('data-label') || day.textContent.trim();
    }
    const p = e.target.closest('button.pager__link');
    if (p) {
      $$('.pager__link[aria-current]', p.closest('.pager')).forEach((l) => l.removeAttribute('aria-current'));
      p.setAttribute('aria-current', 'page');
      announce(`${p.textContent.trim()}쪽`);
    }
    const li = e.target.closest('[data-selectable] .list__link');
    if (li && li.tagName === 'BUTTON') {
      $$('.list__link[aria-current="true"]', li.closest('[data-selectable]')).forEach((l) => l.removeAttribute('aria-current'));
      li.setAttribute('aria-current', 'true');
      const item = li.closest('.list__item');
      if (item) item.classList.remove('list__item--unread');
    }
  });

  /* ------------------------------------------------------------------------
     16. 선 그리기 (draw-in) — 화면에 들어올 때 1회, stagger 80ms, 최대 8개
     ------------------------------------------------------------------------ */
  const drawEls = $$('[data-draw]');
  if (drawEls.length) {
    if (!('IntersectionObserver' in window) || reduced()) {
      drawEls.forEach((el) => el.classList.add('is-drawn'));
    } else {
      const io = new IntersectionObserver((entries) => {
        let n = 0;
        entries.forEach((en) => {
          if (!en.isIntersecting) return;
          const el = en.target;
          el.style.setProperty('--draw-delay', `${Math.min(n, 7) * 80}ms`);
          n += 1;
          requestAnimationFrame(() => el.classList.add('is-drawn'));
          io.unobserve(el);
        });
      }, { threshold: 0.25, rootMargin: '0px 0px -8% 0px' });
      drawEls.forEach((el) => io.observe(el));
    }
  }

  /* ------------------------------------------------------------------------
     17. 모션 견본 재생
     ------------------------------------------------------------------------ */
  function play(tile) {
    if (!tile) return;
    tile.classList.remove('is-playing');
    void tile.offsetWidth;
    tile.classList.add('is-playing');
  }
  doc.addEventListener('click', (e) => {
    const b = e.target.closest('[data-replay]');
    if (!b) return;
    const id = b.getAttribute('data-replay');
    const scope = id ? doc.getElementById(id) : b.closest('.motion-tile, .motion-board');
    if (!scope) return;
    if (scope.classList.contains('motion-board')) $$('.motion-tile', scope).forEach(play); else play(scope);
  });
  if ('IntersectionObserver' in window) {
    const mio = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { $$('.motion-tile', en.target).forEach(play); mio.unobserve(en.target); } });
    }, { threshold: 0.3 });
    $$('.motion-board').forEach((b) => mio.observe(b));
  }

  /* ------------------------------------------------------------------------
     18. 복사
     ------------------------------------------------------------------------ */
  doc.addEventListener('click', async (e) => {
    const b = e.target.closest('[data-copy]');
    if (!b) return;
    const src = doc.getElementById(b.getAttribute('data-copy'));
    if (!src) return;
    const text = src.innerText;
    let ok = true;
    try { await navigator.clipboard.writeText(text); } catch (err) {
      ok = false;
      const ta = doc.createElement('textarea');
      ta.value = text; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
      doc.body.appendChild(ta); ta.select();
      try { ok = doc.execCommand('copy'); } catch (err2) { ok = false; }
      ta.remove();
    }
    const label = $('[data-copy-label]', b);
    const prev = label ? label.textContent : '';
    b.setAttribute('data-copied', String(ok));
    if (label) label.textContent = ok ? '복사됨' : '복사 실패';
    window.setTimeout(() => { b.removeAttribute('data-copied'); if (label) label.textContent = prev; }, 1600);
    announce(ok ? '코드를 복사했어요' : '복사하지 못했어요');
  });

  /* ------------------------------------------------------------------------
     19. 마퀴 — 이음매 없는 반복 + 정지 버튼
     ------------------------------------------------------------------------ */
  $$('.marquee').forEach((mq) => {
    const track = $('.marquee__track', mq);
    const groups = track ? $$('.marquee__group', track) : [];
    if (track && groups.length === 1) {
      const clone = groups[0].cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      track.appendChild(clone);
    }
    const btn = $('[data-marquee-toggle]', mq);
    if (btn) {
      btn.setAttribute('aria-pressed', 'false');
      btn.setAttribute('aria-label', '공지 띠 멈추기');
      btn.addEventListener('click', () => {
        const paused = mq.getAttribute('data-paused') !== 'true';
        mq.setAttribute('data-paused', String(paused));
        btn.setAttribute('aria-pressed', String(paused));
        btn.setAttribute('aria-label', paused ? '공지 띠 다시 흐르기' : '공지 띠 멈추기');
      });
    }
  });

  /* ------------------------------------------------------------------------
     20. 가로 스크롤 페이드 힌트
     ------------------------------------------------------------------------ */
  const scrollers = $$('.h-scroll, .tabs__list, .table-scroll, .toolbar__links');
  const updateScroller = (el) => {
    const scrollable = el.scrollWidth > el.clientWidth + 2;
    el.classList.toggle('is-scrollable', scrollable);
    el.classList.toggle('is-end', !scrollable || el.scrollLeft + el.clientWidth >= el.scrollWidth - 4);
  };
  scrollers.forEach((el) => {
    updateScroller(el);
    el.addEventListener('scroll', () => updateScroller(el), { passive: true });
  });
  window.addEventListener('resize', () => scrollers.forEach(updateScroller));
  window.addEventListener('load', () => scrollers.forEach(updateScroller));

  /* ------------------------------------------------------------------------
     21. 도구막대 현재 위치 (index 의 #보드 링크)
     ------------------------------------------------------------------------ */
  const tbLinks = $$('.toolbar__link[href^="#"]');
  if (tbLinks.length && 'IntersectionObserver' in window) {
    const map = new Map();
    tbLinks.forEach((a) => { const s = doc.getElementById(a.getAttribute('href').slice(1)); if (s) map.set(s, a); });
    const tio = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        tbLinks.forEach((a) => a.removeAttribute('aria-current'));
        const a = map.get(en.target);
        if (a) {
          a.setAttribute('aria-current', 'true');
          const bar = a.closest('.toolbar__links');
          if (bar && bar.scrollWidth > bar.clientWidth) a.scrollIntoView({ block: 'nearest', inline: 'center', behavior: reduced() ? 'auto' : 'smooth' });
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    map.forEach((a, s) => tio.observe(s));
  }
})();
