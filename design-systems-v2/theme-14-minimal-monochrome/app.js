/* ==========================================================================
   여백미술관 YEOBAEK — app.js (바닐라, 외부 라이브러리 없음)
   1 테마(소등) · 2 점등 · 3 레이어(모달/드로어/커맨드) · 4 커맨드 팔레트 ·
   5 탭(+필터) · 6 아코디언 · 7 토스트 · 8 팝오버 · 9 메뉴 · 10 툴팁 ·
   11 캐러셀 · 12 마퀴 · 13 진행·게이지 · 14 달력 · 15 표 · 16 칸반 ·
   17 폼(검증·스위치·세그먼트·수량) · 18 모바일 내비 · 19 스크롤 힌트 ·
   20 단계 · 21 코드 복사 · 22 페이지네이션 · 23 보기 전환·목록 선택 ·
   24 기타(알림 닫기·로딩 시연·모션 견본)
   마크업 계약은 COMPONENTS.md. 인라인 onclick·페이지별 스크립트 금지.
   ========================================================================== */
(() => {
  'use strict';

  const doc = document;
  const root = doc.documentElement;
  const STORE_KEY = 'yeobaek-theme';
  const $ = (sel, ctx = doc) => ctx.querySelector(sel);
  const $$ = (sel, ctx = doc) => Array.from(ctx.querySelectorAll(sel));
  const byId = (id) => (id ? doc.getElementById(id) : null);
  const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTyping = (el) => !!el && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName));
  let uid = 0;
  const ensureId = (el, prefix) => { if (!el.id) el.id = `${prefix}-${++uid}`; return el.id; };
  const FOCUSABLE = 'a[href], area[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
  const focusables = (ctx) => $$(FOCUSABLE, ctx).filter((el) => el.getClientRects().length > 0);
  const restartAnim = (el, cls) => { el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); };

  root.classList.add('js');

  const store = {
    get() { try { return localStorage.getItem(STORE_KEY); } catch (e) { return null; } },
    set(v) { try { if (v) localStorage.setItem(STORE_KEY, v); else localStorage.removeItem(STORE_KEY); } catch (e) { /* 저장 불가 환경 */ } },
  };

  /* ------------------------------------------------------------------------
     1. 테마 — 우선순위: ?theme= → localStorage → prefers-color-scheme
        전환은 "소등": 먹 덮개 0→1(200ms) → 교체 → 1→0(200ms)
     ------------------------------------------------------------------------ */
  const scheme = window.matchMedia('(prefers-color-scheme: dark)');
  const valid = (t) => (t === 'dark' || t === 'light' ? t : null);
  const queryTheme = () => valid(new URLSearchParams(window.location.search).get('theme'));
  const resolveTheme = () => queryTheme() || valid(store.get()) || (scheme.matches ? 'dark' : 'light');

  let lights = $('.lights');
  if (!lights) {
    lights = doc.createElement('div');
    lights.className = 'lights';
    lights.setAttribute('aria-hidden', 'true');
    doc.body.appendChild(lights);
  }

  function syncThemeControls(theme) {
    $$('[data-theme-toggle]').forEach((btn) => {
      btn.setAttribute('aria-pressed', String(theme === 'dark'));
      if (!btn.hasAttribute('aria-label')) btn.setAttribute('aria-label', '밤 화면');
    });
    const choice = valid(store.get()) || 'system';
    $$('[data-theme-choice]').forEach((opt) => {
      const on = opt.getAttribute('data-theme-choice') === choice;
      opt.setAttribute('aria-checked', String(on));
      opt.tabIndex = on ? 0 : -1;
    });
  }
  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    syncThemeControls(theme);
  }
  function switchTheme(theme) {
    if (theme === root.getAttribute('data-theme')) { syncThemeControls(theme); return; }
    if (reduced()) { applyTheme(theme); return; }
    lights.classList.add('is-down');
    window.setTimeout(() => {
      applyTheme(theme);
      window.setTimeout(() => lights.classList.remove('is-down'), 20);
    }, 200);
  }
  applyTheme(resolveTheme());
  const onScheme = () => { if (!queryTheme() && !valid(store.get())) switchTheme(resolveTheme()); };
  if (scheme.addEventListener) scheme.addEventListener('change', onScheme);

  doc.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-theme-toggle]');
    if (btn) {
      const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      store.set(next);
      switchTheme(next);
      return;
    }
    const opt = e.target.closest('[data-theme-choice]');
    if (opt) {
      const v = opt.getAttribute('data-theme-choice');
      store.set(valid(v));
      switchTheme(valid(v) || (scheme.matches ? 'dark' : 'light'));
    }
  });

  /* ------------------------------------------------------------------------
     2. 점등 — [data-light] 가 화면에 들어오면 .is-lit (opacity 만, 이동 0)
        한 번에 켜지는 것은 최대 3개, 나머지는 다음 박자(240ms)에
     ------------------------------------------------------------------------ */
  const lightTargets = $$('[data-light]');
  if (lightTargets.length) {
    if (!('IntersectionObserver' in window) || reduced()) {
      lightTargets.forEach((el) => el.classList.add('is-lit'));
    } else {
      const queue = [];
      let timer = null;
      const flush = () => {
        queue.splice(0, 3).forEach((el) => el.classList.add('is-lit'));
        timer = queue.length ? window.setTimeout(flush, 240) : null;
      };
      const io = new IntersectionObserver((entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) { queue.push(en.target); io.unobserve(en.target); }
        });
        if (!timer) flush();
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
      lightTargets.forEach((el) => io.observe(el));
    }
  }

  /* ------------------------------------------------------------------------
     3. 레이어 — [data-open="id"] → #id[data-layer] (모달·드로어·커맨드)
        포커스 트랩, Esc, [data-close], 포커스 복귀, 스크롤 잠금
     ------------------------------------------------------------------------ */
  const layerStack = [];
  function openLayer(id, opener) {
    const layer = typeof id === 'string' ? byId(id) : id;
    if (!layer || !layer.hidden) return;
    closeFloating();
    layer.hidden = false;
    layer._opener = opener || doc.activeElement;
    layerStack.push(layer);
    doc.body.classList.add('is-locked');
    $$(`[data-open="${layer.id}"]`).forEach((b) => b.setAttribute('aria-expanded', 'true'));
    const target = $('[autofocus]', layer) || $('.cmd__input', layer) || focusables($('[role="dialog"]', layer) || layer)[0];
    if (target) window.requestAnimationFrame(() => target.focus());
    layer.dispatchEvent(new CustomEvent('layer:open', { bubbles: true }));
  }
  function closeLayer(layer) {
    layer = layer || layerStack[layerStack.length - 1];
    if (!layer || layer.hidden) return;
    layer.hidden = true;
    const i = layerStack.indexOf(layer);
    if (i > -1) layerStack.splice(i, 1);
    if (!layerStack.length && !navOpen()) doc.body.classList.remove('is-locked');
    $$(`[data-open="${layer.id}"]`).forEach((b) => b.setAttribute('aria-expanded', 'false'));
    const back = layer._opener;
    if (back && doc.contains(back) && typeof back.focus === 'function') back.focus();
    layer.dispatchEvent(new CustomEvent('layer:close', { bubbles: true }));
  }
  doc.addEventListener('click', (e) => {
    const opener = e.target.closest('[data-open]');
    if (opener) { e.preventDefault(); openLayer(opener.getAttribute('data-open'), opener); return; }
    const closer = e.target.closest('[data-close]');
    if (closer) {
      const layer = closer.closest('[data-layer]');
      if (layer) { e.preventDefault(); closeLayer(layer); }
    }
  });
  doc.addEventListener('keydown', (e) => {
    const top = layerStack[layerStack.length - 1];
    if (!top) return;
    if (e.key === 'Escape') { e.preventDefault(); closeLayer(top); return; }
    if (e.key === 'Tab') {
      const box = $('[role="dialog"]', top) || top;
      const f = focusables(box);
      if (!f.length) { e.preventDefault(); return; }
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && (doc.activeElement === first || !box.contains(doc.activeElement))) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && (doc.activeElement === last || !box.contains(doc.activeElement))) { e.preventDefault(); first.focus(); }
    }
  });

  /* ------------------------------------------------------------------------
     4. 커맨드 팔레트 — ⌘K / Ctrl+K. 입력 필터, ↑↓, Enter → data-href
     ------------------------------------------------------------------------ */
  function initCommand(cmd) {
    const input = $('.cmd__input', cmd);
    const list = $('.cmd__list', cmd);
    if (!input || !list) return;
    const items = $$('.cmd__item', list);
    const empty = $('.cmd__empty', cmd);
    const listId = ensureId(list, 'cmd-list');
    input.setAttribute('role', 'combobox');
    input.setAttribute('aria-controls', listId);
    input.setAttribute('aria-expanded', 'true');
    input.setAttribute('aria-autocomplete', 'list');
    items.forEach((it) => { ensureId(it, 'cmd-opt'); it.setAttribute('role', 'option'); });
    const visible = () => items.filter((it) => !it.hidden && it.getAttribute('aria-disabled') !== 'true');
    function select(it) {
      items.forEach((x) => x.setAttribute('aria-selected', String(x === it)));
      if (it) {
        input.setAttribute('aria-activedescendant', it.id);
        // 페이지가 아니라 목록 안에서만 스크롤
        const top = it.offsetTop - list.offsetTop;
        if (top < list.scrollTop) list.scrollTop = top;
        else if (top + it.offsetHeight > list.scrollTop + list.clientHeight) list.scrollTop = top + it.offsetHeight - list.clientHeight;
      }
      else input.removeAttribute('aria-activedescendant');
    }
    function filter() {
      const q = input.value.trim().toLowerCase();
      items.forEach((it) => {
        const hay = (it.textContent + ' ' + (it.getAttribute('data-keywords') || '')).toLowerCase();
        it.hidden = !!q && !hay.includes(q);
      });
      $$('.cmd__group', list).forEach((g) => {
        let n = g.nextElementSibling;
        let any = false;
        while (n && !n.classList.contains('cmd__group')) { if (n.classList.contains('cmd__item') && !n.hidden) any = true; n = n.nextElementSibling; }
        g.hidden = !any;
      });
      const v = visible();
      if (empty) {
        empty.hidden = v.length > 0;
        const q2 = $('[data-cmd-query]', empty);
        if (q2) q2.textContent = input.value.trim();
      }
      select(v[0] || null);
    }
    function go(it) {
      if (!it) return;
      const href = it.getAttribute('data-href');
      if (href) { window.location.href = href; return; }
      const open = it.getAttribute('data-open-after');
      const layer = cmd.closest('[data-layer]');
      if (layer) closeLayer(layer);
      if (open) openLayer(open);
      it.dispatchEvent(new CustomEvent('command:choose', { bubbles: true }));
    }
    input.addEventListener('input', filter);
    input.addEventListener('keydown', (e) => {
      const v = visible();
      const cur = v.findIndex((x) => x.getAttribute('aria-selected') === 'true');
      if (e.key === 'ArrowDown') { e.preventDefault(); select(v[(cur + 1) % v.length] || null); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); select(v[(cur - 1 + v.length) % v.length] || null); }
      else if (e.key === 'Home' && e.altKey) { e.preventDefault(); select(v[0]); }
      else if (e.key === 'Enter') { e.preventDefault(); go(v[cur]); }
    });
    list.addEventListener('mousemove', (e) => {
      const it = e.target.closest('.cmd__item');
      if (it && !it.hidden && it.getAttribute('aria-selected') !== 'true' && it.getAttribute('aria-disabled') !== 'true') select(it);
    });
    list.addEventListener('click', (e) => {
      const it = e.target.closest('.cmd__item');
      if (it && it.getAttribute('aria-disabled') !== 'true') go(it);
    });
    const layer = cmd.closest('[data-layer]') || cmd;
    layer.addEventListener('layer:open', () => { input.value = ''; filter(); });
    filter();
    if (cmd.classList.contains('cmd--static') && input.value) filter();
  }
  $$('.cmd').forEach(initCommand);
  doc.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
      const cmd = byId('command') || $('.cmd[data-layer]');
      if (!cmd) return;
      e.preventDefault();
      if (cmd.hidden) openLayer(cmd); else closeLayer(cmd);
    }
  });

  /* ------------------------------------------------------------------------
     5. 탭 — role=tablist. ←→ Home End. 필터 탭: .tabs__list[data-filter-for]
     ------------------------------------------------------------------------ */
  function initTabs(list) {
    const tabs = $$('[role="tab"]', list);
    const filterFor = list.getAttribute('data-filter-for');
    function activate(tab, focus) {
      tabs.forEach((t) => {
        const on = t === tab;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        const panel = byId(t.getAttribute('aria-controls'));
        if (panel) {
          panel.hidden = !on;
          if (on && !reduced()) restartAnim(panel, 'is-entering');
        }
      });
      if (focus) tab.focus();
      tab.scrollIntoView({ block: 'nearest', inline: 'nearest' });
      if (filterFor) applyFilter(byId(filterFor), tab.getAttribute('data-filter') || '*');
      list.dispatchEvent(new CustomEvent('tabs:change', { bubbles: true, detail: { tab } }));
    }
    tabs.forEach((t) => {
      t.addEventListener('click', () => { if (!t.disabled) activate(t, false); });
      t.addEventListener('keydown', (e) => {
        const usable = tabs.filter((x) => !x.disabled && x.getAttribute('aria-disabled') !== 'true');
        const i = usable.indexOf(t);
        let n = null;
        if (e.key === 'ArrowRight') n = usable[(i + 1) % usable.length];
        else if (e.key === 'ArrowLeft') n = usable[(i - 1 + usable.length) % usable.length];
        else if (e.key === 'Home') n = usable[0];
        else if (e.key === 'End') n = usable[usable.length - 1];
        if (n) { e.preventDefault(); activate(n, true); }
      });
    });
    const cur = tabs.find((t) => t.getAttribute('aria-selected') === 'true') || tabs[0];
    if (cur) {
      tabs.forEach((t) => { t.tabIndex = t === cur ? 0 : -1; const p = byId(t.getAttribute('aria-controls')); if (p) p.hidden = t !== cur; });
    }
  }
  function applyFilter(scope, value) {
    if (!scope) return;
    let shown = 0;
    $$('[data-filter-item]', scope).forEach((it) => {
      const tags = (it.getAttribute('data-tags') || '').split(/\s+/);
      const on = value === '*' || tags.includes(value);
      it.hidden = !on;
      if (on) shown += 1;
    });
    $$('[data-filter-group]', scope).forEach((g) => {
      const key = g.getAttribute('data-filter-group');
      g.hidden = !(value === '*' || key === value);
    });
    const out = $('[data-filter-count]', scope) || byId(scope.getAttribute('data-filter-count-id'));
    if (out) out.textContent = String(shown);
  }
  $$('[role="tablist"]').forEach(initTabs);

  /* ------------------------------------------------------------------------
     6. 아코디언 — .acc__head[aria-expanded] ↔ #aria-controls. .acc[data-single]
     ------------------------------------------------------------------------ */
  $$('.acc__head').forEach((head) => {
    const panel = byId(head.getAttribute('aria-controls'));
    if (panel) panel.hidden = head.getAttribute('aria-expanded') !== 'true';
  });
  doc.addEventListener('click', (e) => {
    const head = e.target.closest('.acc__head');
    if (!head || head.disabled) return;
    const acc = head.closest('.acc');
    const open = head.getAttribute('aria-expanded') !== 'true';
    if (open && acc && acc.hasAttribute('data-single')) {
      $$('.acc__head[aria-expanded="true"]', acc).forEach((h) => {
        h.setAttribute('aria-expanded', 'false');
        const p = byId(h.getAttribute('aria-controls'));
        if (p) p.hidden = true;
      });
    }
    head.setAttribute('aria-expanded', String(open));
    const panel = byId(head.getAttribute('aria-controls'));
    if (panel) { panel.hidden = !open; if (open && !reduced()) restartAnim(panel, 'is-opening'); }
  });

  /* ------------------------------------------------------------------------
     7. 토스트 — Yeobaek.toast({ cat, title, msg, undo, tone, duration })
        [data-toast] 트리거: data-toast-cat / -title / -msg / -undo / -tone
     ------------------------------------------------------------------------ */
  function toastRegion() {
    let r = $('.toasts:not(.toasts--static)');
    if (!r) {
      r = doc.createElement('div');
      r.className = 'toasts';
      r.setAttribute('role', 'region');
      r.setAttribute('aria-label', '알림');
      doc.body.appendChild(r);
    }
    if (!r.hasAttribute('aria-live')) r.setAttribute('aria-live', 'polite');
    return r;
  }
  function dismissToast(t) {
    if (!t || t._gone) return;
    t._gone = true;
    window.clearTimeout(t._timer);
    if (reduced()) { t.remove(); return; }
    t.classList.add('is-leaving');
    window.setTimeout(() => t.remove(), 200);
  }
  function toast(opts = {}) {
    const region = toastRegion();
    const dur = opts.duration || 4000;
    const t = doc.createElement('div');
    t.className = `toast${opts.tone ? ` toast--${opts.tone}` : ''}`;
    t.setAttribute('role', opts.tone === 'error' ? 'alert' : 'status');
    t.style.setProperty('--toast-dur', `${dur}ms`);
    const l1 = doc.createElement('p');
    l1.className = 'toast__l1';
    if (opts.cat) { const c = doc.createElement('span'); c.className = 'cat'; c.textContent = opts.cat; l1.appendChild(c); }
    const ti = doc.createElement('span'); ti.textContent = opts.title || '알림'; l1.appendChild(ti);
    const msg = doc.createElement('p'); msg.className = 'toast__msg'; msg.textContent = opts.msg || '';
    const actions = doc.createElement('div'); actions.className = 'toast__actions';
    if (opts.undo) {
      const u = doc.createElement('button'); u.type = 'button'; u.className = 'toast__btn'; u.textContent = '되돌리기';
      u.addEventListener('click', () => {
        dismissToast(t);
        if (typeof opts.onUndo === 'function') opts.onUndo();
        toast({ cat: opts.cat, title: '되돌렸습니다', msg: '이전 상태로 돌아갔습니다.', duration: 2400 });
      });
      actions.appendChild(u);
    }
    const x = doc.createElement('button'); x.type = 'button'; x.className = 'toast__btn toast__btn--quiet'; x.textContent = '닫기';
    x.addEventListener('click', () => dismissToast(t));
    actions.appendChild(x);
    const timer = doc.createElement('span'); timer.className = 'toast__timer'; timer.setAttribute('aria-hidden', 'true');
    t.append(l1, msg, actions, timer);
    region.appendChild(t);
    while (region.children.length > 3) dismissToast(region.firstElementChild);
    let left = dur; let started = Date.now();
    const arm = () => { started = Date.now(); t._timer = window.setTimeout(() => dismissToast(t), left); };
    const hold = () => { window.clearTimeout(t._timer); left -= Date.now() - started; };
    t.addEventListener('mouseenter', hold); t.addEventListener('mouseleave', arm);
    t.addEventListener('focusin', hold); t.addEventListener('focusout', arm);
    arm();
    return t;
  }
  doc.addEventListener('click', (e) => {
    const b = e.target.closest('[data-toast]');
    if (!b) return;
    toast({
      cat: b.getAttribute('data-toast-cat') || '',
      title: b.getAttribute('data-toast-title') || b.getAttribute('data-toast') || '알림',
      msg: b.getAttribute('data-toast-msg') || '',
      undo: b.hasAttribute('data-toast-undo'),
      tone: b.getAttribute('data-toast-tone') || '',
    });
  });

  /* ------------------------------------------------------------------------
     8·9. 팝오버 · 메뉴 — 바깥 클릭, Esc, 하나만 열림
     ------------------------------------------------------------------------ */
  let floating = null; // { trigger, panel, kind }
  function closeFloating(returnFocus) {
    if (!floating) return;
    const { trigger, panel } = floating;
    panel.hidden = true;
    trigger.setAttribute('aria-expanded', 'false');
    floating = null;
    if (returnFocus) trigger.focus();
  }
  function openFloating(trigger, panel, kind, focusFirst) {
    closeFloating();
    panel.hidden = false;
    trigger.setAttribute('aria-expanded', 'true');
    floating = { trigger, panel, kind };
    // 화면 밖으로 넘치면 반대쪽으로
    panel.style.left = '';
    panel.style.right = '';
    const r = panel.getBoundingClientRect();
    if (r.right > window.innerWidth - 8) { panel.style.left = 'auto'; panel.style.right = '0'; }
    if (focusFirst) {
      const items = kind === 'menu' ? menuItems(panel) : focusables(panel);
      if (items[0]) items[0].focus();
    }
  }
  const menuItems = (panel) => $$('.menu__item', panel).filter((i) => i.getAttribute('aria-disabled') !== 'true' && !i.disabled);

  $$('[data-popover]').forEach((t) => {
    const p = byId(t.getAttribute('data-popover'));
    if (!p) return;
    t.setAttribute('aria-expanded', 'false');
    t.setAttribute('aria-controls', p.id);
    if (!p.hasAttribute('role')) p.setAttribute('role', 'dialog');
    p.hidden = true;
  });
  $$('.menu__trigger').forEach((t) => {
    const p = byId(t.getAttribute('aria-controls')) || (t.nextElementSibling && t.nextElementSibling.classList.contains('menu__list') ? t.nextElementSibling : null);
    if (!p) return;
    ensureId(p, 'menu');
    t.setAttribute('aria-controls', p.id);
    t.setAttribute('aria-haspopup', 'menu');
    t.setAttribute('aria-expanded', 'false');
    p.hidden = true;
    $$('.menu__item', p).forEach((i) => { i.tabIndex = -1; });
  });

  doc.addEventListener('click', (e) => {
    const pt = e.target.closest('[data-popover]');
    if (pt) {
      const p = byId(pt.getAttribute('data-popover'));
      if (floating && floating.panel === p) closeFloating(); else if (p) openFloating(pt, p, 'pop', false);
      return;
    }
    const mt = e.target.closest('.menu__trigger');
    if (mt) {
      const p = byId(mt.getAttribute('aria-controls'));
      if (floating && floating.panel === p) closeFloating(); else if (p) openFloating(mt, p, 'menu', e.detail === 0);
      return;
    }
    const item = e.target.closest('.menu__item');
    if (item && floating && floating.panel.contains(item)) {
      if (item.getAttribute('aria-disabled') === 'true') { e.preventDefault(); return; }
      if (item.getAttribute('role') === 'menuitemradio') {
        $$('[role="menuitemradio"]', floating.panel).forEach((r) => r.setAttribute('aria-checked', String(r === item)));
      }
      const trigger = floating.trigger;
      if (item.tagName !== 'A') closeFloating(true);
      trigger.dispatchEvent(new CustomEvent('menu:select', { bubbles: true, detail: { item, value: item.getAttribute('data-value') } }));
      return;
    }
    const closeP = e.target.closest('[data-pop-close]');
    if (closeP && floating) { closeFloating(true); return; }
    if (floating && !floating.panel.contains(e.target)) closeFloating();
  });
  doc.addEventListener('keydown', (e) => {
    if (!floating) {
      const mt = e.target.closest && e.target.closest('.menu__trigger');
      if (mt && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
        e.preventDefault();
        const p = byId(mt.getAttribute('aria-controls'));
        if (p) { openFloating(mt, p, 'menu', true); if (e.key === 'ArrowUp') { const it = menuItems(p); if (it.length) it[it.length - 1].focus(); } }
      }
      return;
    }
    if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); closeFloating(true); return; }
    if (floating.kind === 'menu') {
      const items = menuItems(floating.panel);
      const i = items.indexOf(doc.activeElement);
      if (e.key === 'ArrowDown') { e.preventDefault(); (items[i + 1] || items[0]).focus(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); (items[i - 1] || items[items.length - 1]).focus(); }
      else if (e.key === 'Home') { e.preventDefault(); items[0].focus(); }
      else if (e.key === 'End') { e.preventDefault(); items[items.length - 1].focus(); }
      else if (e.key === 'Tab') closeFloating();
    }
  }, true);

  /* ------------------------------------------------------------------------
     10. 툴팁 — 호버·포커스(CSS). Esc 로 숨김, 터치는 탭으로 토글
     ------------------------------------------------------------------------ */
  $$('.tip').forEach((tip) => {
    const bubble = $('.tip__bubble', tip);
    const trigger = tip.firstElementChild;
    if (!bubble || !trigger || bubble === trigger) return;
    bubble.setAttribute('role', 'tooltip');
    const id = ensureId(bubble, 'tip');
    trigger.setAttribute('aria-describedby', id);
    tip.addEventListener('mouseleave', () => tip.classList.remove('is-dismissed', 'is-open'));
    trigger.addEventListener('blur', () => tip.classList.remove('is-dismissed', 'is-open'));
    trigger.addEventListener('keydown', (e) => { if (e.key === 'Escape') tip.classList.add('is-dismissed'); });
    trigger.addEventListener('touchstart', () => tip.classList.toggle('is-open'), { passive: true });
  });

  /* ------------------------------------------------------------------------
     11. 캐러셀 — [data-carousel] 한 번에 1장. 넘김 = 점등(이동 0)
         [data-carousel-prev|next], [data-carousel-index], .slides__dot, ←→
     ------------------------------------------------------------------------ */
  $$('[data-carousel]').forEach((car) => {
    const items = $$('.slides__item', car);
    if (!items.length) return;
    const total = parseInt(car.getAttribute('data-total') || items.length, 10);
    const offset = parseInt(car.getAttribute('data-first') || '1', 10);
    let idx = Math.max(0, items.findIndex((i) => !i.hidden));
    const prev = $('[data-carousel-prev]', car);
    const next = $('[data-carousel-next]', car);
    const out = $('[data-carousel-index]', car);
    const dots = $$('.slides__dot', car);
    const bar = $('.progress', car);
    const live = $('[aria-live]', car);
    function show(n, animate) {
      idx = (n + items.length) % items.length;
      items.forEach((it, i) => {
        it.hidden = i !== idx;
        if (i === idx && animate && !reduced()) restartAnim(it, 'is-entering');
      });
      if (out) out.textContent = String(offset + idx);
      dots.forEach((d, i) => d.setAttribute('aria-current', String(i === idx)));
      if (bar) setProgress(bar, Math.round(((offset + idx) / total) * 100));
      if (prev && car.hasAttribute('data-no-loop')) prev.disabled = idx === 0;
      if (next && car.hasAttribute('data-no-loop')) next.disabled = idx === items.length - 1;
      if (live && animate) live.textContent = `도 ${offset + idx} / ${total}`;
    }
    if (prev) prev.addEventListener('click', () => show(idx - 1, true));
    if (next) next.addEventListener('click', () => show(idx + 1, true));
    dots.forEach((d, i) => d.addEventListener('click', () => show(i, true)));
    car.addEventListener('keydown', (e) => {
      if (isTyping(e.target)) return;
      if (e.key === 'ArrowRight') { e.preventDefault(); show(idx + 1, true); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); show(idx - 1, true); }
    });
    show(idx, false);
  });

  /* ------------------------------------------------------------------------
     12. 마퀴 — 그룹 복제(aria-hidden) + 60px/s 로 지속시간 계산 + 정지 버튼
     ------------------------------------------------------------------------ */
  $$('.marquee').forEach((mq) => {
    const track = $('.marquee__track', mq);
    const group = $('.marquee__group', mq);
    if (!track || !group) return;
    if (!$('.marquee__group[aria-hidden="true"]', track)) {
      const clone = group.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      $$('a, button', clone).forEach((el) => { el.tabIndex = -1; });
      track.appendChild(clone);
    }
    const setDur = () => { const w = group.getBoundingClientRect().width; if (w) mq.style.setProperty('--marquee-dur', `${Math.max(20, w / 60)}s`); };
    setDur();
    if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(setDur);
    const btn = $('.marquee__toggle', mq);
    if (btn) {
      btn.addEventListener('click', () => {
        const paused = mq.classList.toggle('is-paused');
        btn.setAttribute('aria-pressed', String(paused));
        btn.textContent = paused ? '흐르기' : '멈춤';
      });
    }
  });

  /* ------------------------------------------------------------------------
     13. 진행 · 게이지 — aria-valuenow → --v, data-at/from/to → --at/--from/--to
     ------------------------------------------------------------------------ */
  function setProgress(el, v) {
    const n = Math.max(0, Math.min(100, Number(v) || 0));
    el.setAttribute('aria-valuenow', String(n));
    el.style.setProperty('--v', String(n));
    const val = $('.progress__val', el);
    if (val && !val.hasAttribute('data-fixed')) val.textContent = `${n}%`;
    el.classList.toggle('is-done', n >= 100 && !el.classList.contains('is-error'));
  }
  $$('[role="progressbar"]').forEach((el) => {
    if (el.hasAttribute('aria-valuenow')) setProgress(el, el.getAttribute('aria-valuenow'));
  });
  $$('.gauge').forEach((g) => {
    ['at', 'from', 'to'].forEach((k) => { const v = g.getAttribute(`data-${k}`); if (v !== null) g.style.setProperty(`--${k}`, v); });
  });

  /* ------------------------------------------------------------------------
     14. 달력 — [data-calendar]: 날짜 선택(aria-selected), 화살표 이동(±1, ±7),
         [data-cal-output] 에 문구, calendar:select 이벤트(detail.date)
     ------------------------------------------------------------------------ */
  $$('[data-calendar]').forEach((cal) => {
    const days = $$('.cal__day', cal);
    const usable = () => days.filter((d) => !d.disabled && !d.classList.contains('cal__day--closed') && !d.classList.contains('cal__day--out'));
    const out = $('[data-cal-output]', cal) || byId(cal.getAttribute('data-output'));
    let cur = days.find((d) => d.getAttribute('aria-selected') === 'true') || days.find((d) => d.getAttribute('aria-current') === 'date') || usable()[0];
    days.forEach((d) => { d.tabIndex = d === cur ? 0 : -1; if (!d.disabled && !d.hasAttribute('aria-selected')) d.setAttribute('aria-selected', 'false'); });
    function choose(d) {
      days.forEach((x) => { if (x.hasAttribute('aria-selected')) x.setAttribute('aria-selected', String(x === d)); });
      if (out) out.textContent = d.getAttribute('data-label') || d.getAttribute('aria-label') || d.textContent.trim();
      cal.dispatchEvent(new CustomEvent('calendar:select', { bubbles: true, detail: { date: d.getAttribute('data-date'), el: d } }));
    }
    function move(d) { if (!d) return; days.forEach((x) => { x.tabIndex = x === d ? 0 : -1; }); d.focus(); cur = d; }
    cal.addEventListener('click', (e) => {
      const d = e.target.closest('.cal__day');
      if (!d || d.disabled || d.classList.contains('cal__day--closed') || d.classList.contains('cal__day--out')) return;
      move(d); choose(d);
    });
    cal.addEventListener('keydown', (e) => {
      const d = e.target.closest('.cal__day');
      if (!d) return;
      const i = days.indexOf(d);
      const step = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: 7, ArrowUp: -7 }[e.key];
      if (step) {
        e.preventDefault();
        let j = i + step;
        while (days[j] && (days[j].classList.contains('cal__day--out'))) j += Math.sign(step);
        if (days[j]) move(days[j]);
      } else if (e.key === 'Home') { e.preventDefault(); move(days.find((x) => !x.classList.contains('cal__day--out'))); }
      else if (e.key === 'End') { e.preventDefault(); move([...days].reverse().find((x) => !x.classList.contains('cal__day--out'))); }
    });
  });

  /* ------------------------------------------------------------------------
     15. 표 — .cat-table__sort 정렬(aria-sort), [data-select-row] · [data-select-all]
     ------------------------------------------------------------------------ */
  const cellValue = (row, i) => {
    const c = row.children[i];
    if (!c) return '';
    return c.getAttribute('data-sort') || c.textContent.trim();
  };
  $$('.cat-table__sort').forEach((btn) => {
    btn.type = 'button';
    btn.addEventListener('click', () => {
      const th = btn.closest('th');
      const table = btn.closest('table');
      const idx = Array.from(th.parentElement.children).indexOf(th);
      const dir = th.getAttribute('aria-sort') === 'ascending' ? 'descending' : 'ascending';
      $$('thead th', table).forEach((h) => h.removeAttribute('aria-sort'));
      th.setAttribute('aria-sort', dir);
      $$('tbody', table).forEach((tb) => {
        const rows = $$(':scope > tr:not(.cat-table__group)', tb);
        const num = rows.every((r) => /^[-+]?[\d.,]+$/.test(cellValue(r, idx).replace(/[₩%\s명분초cm×]/g, '')));
        rows.sort((a, b) => {
          let x = cellValue(a, idx); let y = cellValue(b, idx);
          if (num) { x = parseFloat(x.replace(/[^\d.-]/g, '')) || 0; y = parseFloat(y.replace(/[^\d.-]/g, '')) || 0; return dir === 'ascending' ? x - y : y - x; }
          return dir === 'ascending' ? x.localeCompare(y, 'ko') : y.localeCompare(x, 'ko');
        });
        rows.forEach((r) => tb.appendChild(r));
      });
      const live = $('[data-sort-live]', table.closest('.table-wrap') || doc);
      if (live) live.textContent = `${btn.textContent.trim()} ${dir === 'ascending' ? '오름차순' : '내림차순'}으로 정렬했습니다.`;
    });
  });
  doc.addEventListener('change', (e) => {
    const rowBox = e.target.closest('[data-select-row]');
    if (rowBox) {
      const tr = rowBox.closest('tr');
      if (tr) tr.setAttribute('aria-selected', String(rowBox.checked));
      const table = rowBox.closest('table');
      const all = table && $('[data-select-all]', table);
      if (all) {
        const boxes = $$('[data-select-row]', table);
        const n = boxes.filter((b) => b.checked).length;
        all.checked = n === boxes.length;
        all.indeterminate = n > 0 && n < boxes.length;
        const out = $('[data-select-count]', table.closest('.table-wrap') || doc);
        if (out) out.textContent = String(n);
      }
      return;
    }
    const allBox = e.target.closest('[data-select-all]');
    if (allBox) {
      const table = allBox.closest('table');
      $$('[data-select-row]', table).forEach((b) => { b.checked = allBox.checked; const tr = b.closest('tr'); if (tr) tr.setAttribute('aria-selected', String(b.checked)); });
      const out = $('[data-select-count]', table.closest('.table-wrap') || doc);
      if (out) out.textContent = String(allBox.checked ? $$('[data-select-row]', table).length : 0);
    }
  });

  /* ------------------------------------------------------------------------
     16. 칸반 — [data-kanban]: 끌어 놓기 + 키보드 대안 [data-kanban-move="열 id"]
     ------------------------------------------------------------------------ */
  $$('[data-kanban]').forEach((board) => {
    const count = () => $$('.board__col', board).forEach((col) => {
      /* 발췌 보드(index)는 보이지 않는 카드 수를 data-more 로 더한다 */
      const n = $$('.kcard', col).length + (parseInt(col.getAttribute('data-more') || '0', 10) || 0);
      const out = $('.board__n', col);
      if (out) out.textContent = String(n);
      const empty = $('.board__empty', col);
      if (empty) empty.hidden = n > 0;
    });
    let dragging = null;
    function moveCard(card, colId, announce) {
      const col = byId(colId) || $(`[data-col="${colId}"]`, board);
      const list = col && $('.board__list', col);
      if (!card || !list) return;
      const from = card.closest('.board__col');
      const anchor = $('.board__more', list) || $('.board__empty', list);
      if (anchor) list.insertBefore(card, anchor); else list.appendChild(card);
      count();
      if (!reduced()) restartAnim(card, 'is-moved');
      if (announce) {
        const name = $('.board__name', col);
        const cat = $('.cat', card);
        toast({ cat: cat ? cat.textContent : '', title: `「${name ? name.textContent : ''}」 단계로 옮겼습니다`, msg: '반입 일정표에도 반영됩니다.', undo: true, onUndo: () => from && moveCard(card, from.id || from.getAttribute('data-col'), false) });
      }
    }
    $$('.kcard', board).forEach((c) => { c.setAttribute('draggable', 'true'); });
    board.addEventListener('dragstart', (e) => {
      const c = e.target.closest('.kcard');
      if (!c) return;
      dragging = c;
      c.classList.add('is-dragging');
      e.dataTransfer.effectAllowed = 'move';
      try { e.dataTransfer.setData('text/plain', c.id || 'card'); } catch (err) { /* 무시 */ }
    });
    board.addEventListener('dragend', () => {
      if (dragging) dragging.classList.remove('is-dragging');
      dragging = null;
      $$('.board__list.is-over', board).forEach((l) => l.classList.remove('is-over'));
    });
    board.addEventListener('dragover', (e) => {
      const list = e.target.closest('.board__list');
      if (!list || !dragging) return;
      e.preventDefault();
      $$('.board__list.is-over', board).forEach((l) => { if (l !== list) l.classList.remove('is-over'); });
      list.classList.add('is-over');
    });
    board.addEventListener('drop', (e) => {
      const list = e.target.closest('.board__list');
      if (!list || !dragging) return;
      e.preventDefault();
      const col = list.closest('.board__col');
      if (col && !col.contains(dragging)) moveCard(dragging, col.id || col.getAttribute('data-col'), true);
      list.classList.remove('is-over');
    });
    board.addEventListener('click', (e) => {
      const mv = e.target.closest('[data-kanban-move]');
      if (!mv) return;
      const card = mv.closest('.kcard') || byId(mv.closest('[data-card]') && mv.closest('[data-card]').getAttribute('data-card'));
      moveCard(card, mv.getAttribute('data-kanban-move'), true);
      const trig = card && $('.menu__trigger', card);
      if (trig) trig.focus();
    });
    count();
  });

  /* ------------------------------------------------------------------------
     17. 폼 — form[data-validate] 검증, 스위치, 세그먼트(radiogroup), 수량
     ------------------------------------------------------------------------ */
  function fieldError(input, msg) {
    const field = input.closest('.field') || input.closest('.check');
    if (!field) return;
    field.classList.toggle('is-invalid', !!msg);
    input.setAttribute('aria-invalid', String(!!msg));
    let err = $('.field__error', field);
    if (msg) {
      if (!err) { err = doc.createElement('p'); err.className = 'field__error'; field.appendChild(err); }
      if (!err.hasAttribute('data-fixed')) err.textContent = msg;
      const id = ensureId(err, 'err');
      const desc = (input.getAttribute('aria-describedby') || '').split(' ').filter(Boolean);
      if (!desc.includes(id)) input.setAttribute('aria-describedby', desc.concat(id).join(' '));
    }
  }
  function checkInput(input) {
    const v = input.type === 'checkbox' ? input.checked : input.value.trim();
    if (input.required && !v) return input.getAttribute('data-msg-required') || (input.type === 'checkbox' ? '동의가 필요합니다.' : '입력해 주세요.');
    if (input.type === 'email' && v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return input.getAttribute('data-msg-type') || '메일 주소 형식이 아닙니다.';
    if (input.pattern && v && !new RegExp(`^(?:${input.pattern})$`).test(v)) return input.getAttribute('data-msg-pattern') || '형식을 확인해 주세요.';
    if (input.minLength > 0 && v && v.length < input.minLength) return `${input.minLength}자 이상 입력해 주세요.`;
    return '';
  }
  $$('form[data-validate]').forEach((form) => {
    form.noValidate = true;
    form.addEventListener('submit', (e) => {
      const inputs = $$('input, select, textarea', form).filter((i) => !i.disabled && (i.required || i.pattern || i.type === 'email'));
      let first = null;
      inputs.forEach((i) => { const m = checkInput(i); fieldError(i, m); if (m && !first) first = i; });
      if (first) { e.preventDefault(); first.focus(); return; }
      if (form.hasAttribute('data-demo')) {
        e.preventDefault();
        const btn = $('[type="submit"]', form);
        if (btn) { btn.classList.add('is-loading'); btn.setAttribute('aria-busy', 'true'); }
        window.setTimeout(() => {
          if (btn) { btn.classList.remove('is-loading'); btn.removeAttribute('aria-busy'); }
          const ok = form.getAttribute('data-success');
          if (ok) toast({ title: ok, msg: form.getAttribute('data-success-msg') || '', tone: 'ok' });
          form.dispatchEvent(new CustomEvent('form:success', { bubbles: true }));
        }, 900);
      }
    });
    form.addEventListener('input', (e) => {
      const i = e.target;
      if (i.getAttribute('aria-invalid') === 'true' && !checkInput(i)) fieldError(i, '');
    });
    form.addEventListener('change', (e) => {
      const i = e.target;
      if (i.getAttribute('aria-invalid') === 'true' && !checkInput(i)) fieldError(i, '');
    });
  });
  // 스위치
  doc.addEventListener('click', (e) => {
    let sw = e.target.closest('.switch__btn[role="switch"]');
    /* 행(.switch) 어디를 눌러도 토글 — 행 안의 다른 링크·입력은 제외 */
    if (!sw) {
      const row = e.target.closest('.switch');
      if (!row || e.target.closest('a, input, select, textarea, label, button')) return;
      sw = $('.switch__btn[role="switch"]', row);
      if (sw && !sw.disabled) sw.focus();
    }
    if (!sw || sw.disabled) return;
    const on = sw.getAttribute('aria-checked') !== 'true';
    sw.setAttribute('aria-checked', String(on));
    sw.dispatchEvent(new CustomEvent('switch:change', { bubbles: true, detail: { on } }));
  });
  // 세그먼트(radiogroup)
  $$('.seg[role="radiogroup"]').forEach((seg) => {
    const opts = $$('[role="radio"]', seg);
    if (!opts.some((o) => o.hasAttribute('data-theme-choice'))) {
      const cur = opts.find((o) => o.getAttribute('aria-checked') === 'true') || opts[0];
      opts.forEach((o) => { o.tabIndex = o === cur ? 0 : -1; if (!o.hasAttribute('aria-checked')) o.setAttribute('aria-checked', 'false'); });
    }
    const pick = (o, focus) => {
      opts.forEach((x) => { x.setAttribute('aria-checked', String(x === o)); x.tabIndex = x === o ? 0 : -1; });
      if (focus) o.focus();
      if (o.hasAttribute('data-theme-choice')) o.click();
      seg.dispatchEvent(new CustomEvent('seg:change', { bubbles: true, detail: { value: o.getAttribute('data-value') || o.textContent.trim() } }));
    };
    seg.addEventListener('click', (e) => {
      const o = e.target.closest('[role="radio"]');
      if (!o || o.disabled || !e.isTrusted && o.hasAttribute('data-theme-choice')) return;
      opts.forEach((x) => { x.setAttribute('aria-checked', String(x === o)); x.tabIndex = x === o ? 0 : -1; });
      seg.dispatchEvent(new CustomEvent('seg:change', { bubbles: true, detail: { value: o.getAttribute('data-value') || o.textContent.trim() } }));
    });
    seg.addEventListener('keydown', (e) => {
      const usable = opts.filter((o) => !o.disabled);
      const i = usable.indexOf(doc.activeElement);
      if (i < 0) return;
      let n = null;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') n = usable[(i + 1) % usable.length];
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') n = usable[(i - 1 + usable.length) % usable.length];
      if (n) { e.preventDefault(); pick(n, true); }
    });
  });
  // 수량
  $$('.qty').forEach((q) => {
    const input = $('input', q);
    const [minus, plus] = $$('button', q);
    if (!input) return;
    const min = parseInt(input.min || '1', 10);
    const max = parseInt(input.max || '99', 10);
    const sync = () => {
      let v = parseInt(input.value, 10); if (Number.isNaN(v)) v = min;
      v = Math.max(min, Math.min(max, v)); input.value = String(v);
      if (minus) minus.disabled = v <= min;
      if (plus) plus.disabled = v >= max;
      q.dispatchEvent(new CustomEvent('qty:change', { bubbles: true, detail: { value: v } }));
    };
    if (minus) minus.addEventListener('click', () => { input.value = String(parseInt(input.value, 10) - 1); sync(); });
    if (plus) plus.addEventListener('click', () => { input.value = String(parseInt(input.value, 10) + 1); sync(); });
    input.addEventListener('change', sync);
    sync();
  });

  /* ------------------------------------------------------------------------
     18. 모바일 내비 — [data-nav-toggle] ↔ #aria-controls 시트("메뉴"/"닫기")
     ------------------------------------------------------------------------ */
  const navBtn = $('[data-nav-toggle]');
  const navSheet = navBtn && byId(navBtn.getAttribute('aria-controls'));
  function navOpen() { return !!(navSheet && !navSheet.hidden); }
  function setNav(open) {
    if (!navBtn || !navSheet) return;
    navSheet.hidden = !open;
    navBtn.setAttribute('aria-expanded', String(open));
    navBtn.textContent = open ? '닫기' : '메뉴';
    /* 시트 밖 본문은 열려 있는 동안 비활성(inert) — 가려진 요소로 포커스·읽기가 새지 않게 */
    $$('main, footer, .side').forEach((el) => { if (!navSheet.contains(el)) el.inert = open; });
    doc.body.classList.toggle('is-locked', open || layerStack.length > 0);
    if (open) { const f = focusables(navSheet)[0]; if (f) f.focus(); }
  }
  if (navBtn && navSheet) {
    navSheet.hidden = true;
    navBtn.addEventListener('click', () => setNav(!navOpen()));
    doc.addEventListener('keydown', (e) => { if (e.key === 'Escape' && navOpen()) { setNav(false); navBtn.focus(); } });
    /* 포커스 가둠 — 시트가 화면 전체를 덮는 동안 Tab 은 [메뉴/닫기 버튼, …시트 안 링크] 사이만 돈다 */
    doc.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab' || !navOpen() || layerStack.length) return;
      const ring = [navBtn, ...focusables(navSheet)];
      const i = ring.indexOf(doc.activeElement);
      if (i === -1) { e.preventDefault(); ring[0].focus(); return; }
      if (e.shiftKey && i === 0) { e.preventDefault(); ring[ring.length - 1].focus(); }
      else if (!e.shiftKey && i === ring.length - 1) { e.preventDefault(); ring[0].focus(); }
    });
    window.addEventListener('resize', () => { if (navOpen() && window.innerWidth > 960) setNav(false); });
    navSheet.addEventListener('click', (e) => { if (e.target.closest('a')) setNav(false); });
  }

  /* ------------------------------------------------------------------------
     19. 스크롤 힌트 — .scroll-hint 안 스크롤러가 넘치면 .is-overflow, 끝이면 .is-end
     ------------------------------------------------------------------------ */
  const SCROLLERS = '.scroll-x, .tabs__list, .side__scroll, .board-wrap, .ruler-scroll, .table-wrap--scroll';
  $$('.scroll-hint').forEach((hint) => {
    const sc = hint.matches(SCROLLERS) ? hint : $(SCROLLERS, hint);
    if (!sc) return;
    const upd = () => {
      hint.classList.toggle('is-overflow', sc.scrollWidth > sc.clientWidth + 2);
      hint.classList.toggle('is-end', sc.scrollLeft + sc.clientWidth >= sc.scrollWidth - 2);
    };
    sc.addEventListener('scroll', upd, { passive: true });
    window.addEventListener('resize', upd);
    if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(upd);
    upd();
  });
  /* 스크롤러 자신에 거는 페이드(mask) — [data-scroll-fade]: data-overflow · data-end 토글,
     바로 앞 형제의 [data-scroll-pos]에 지금 왼쪽에 닿은 열 번호(1부터)를 쓴다. */
  $$('[data-scroll-fade]').forEach((sc) => {
    const prev = sc.previousElementSibling;
    const pos = prev ? $('[data-scroll-pos]', prev) : null;
    const items = () => $$('.board__col, [data-scroll-item]', sc);
    const upd = () => {
      const over = sc.scrollWidth > sc.clientWidth + 2;
      sc.setAttribute('data-overflow', String(over));
      sc.setAttribute('data-end', String(!over || sc.scrollLeft + sc.clientWidth >= sc.scrollWidth - 2));
      if (pos) {
        const left = sc.getBoundingClientRect().left + (parseFloat(getComputedStyle(sc).paddingLeft) || 0);
        let best = 0; let dist = Infinity;
        items().forEach((it, i) => { const d = Math.abs(it.getBoundingClientRect().left - left); if (d < dist) { dist = d; best = i; } });
        pos.textContent = String(best + 1);
      }
    };
    sc.addEventListener('scroll', upd, { passive: true });
    window.addEventListener('resize', upd);
    if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(upd);
    upd();
  });

  /* ------------------------------------------------------------------------
     20. 단계 — [data-stepper] + [data-step-panel] + [data-step-next|prev|go]
     ------------------------------------------------------------------------ */
  $$('[data-stepper]').forEach((wiz) => {
    const panels = $$('[data-step-panel]', wiz);
    const items = $$('.steps__item', wiz);
    let cur = Math.max(0, panels.findIndex((p) => !p.hidden));
    function go(n, focus) {
      cur = Math.max(0, Math.min(panels.length - 1, n));
      panels.forEach((p, i) => { p.hidden = i !== cur; if (i === cur && !reduced()) restartAnim(p, 'light-on'); });
      items.forEach((it, i) => {
        it.classList.toggle('is-done', i < cur);
        if (i === cur) it.setAttribute('aria-current', 'step'); else it.removeAttribute('aria-current');
        const st = $('.steps__state', it);
        if (st) st.textContent = i < cur ? '완료' : i === cur ? '진행 중' : '대기';
      });
      if (focus) { const h = $('h2, h3, [tabindex="-1"]', panels[cur]); if (h) { if (!h.hasAttribute('tabindex')) h.tabIndex = -1; h.focus(); } }
      wiz.dispatchEvent(new CustomEvent('steps:change', { bubbles: true, detail: { index: cur } }));
    }
    wiz.addEventListener('click', (e) => {
      const nx = e.target.closest('[data-step-next]');
      const pv = e.target.closest('[data-step-prev]');
      const gt = e.target.closest('[data-step-go]');
      if (nx) {
        const panel = panels[cur];
        const bad = $$('input, select, textarea', panel).filter((i) => !i.disabled && (i.required || i.pattern || i.type === 'email')).map((i) => { const m = checkInput(i); fieldError(i, m); return m ? i : null; }).filter(Boolean);
        if (bad.length) { bad[0].focus(); return; }
        go(cur + 1, true);
      } else if (pv) go(cur - 1, true);
      else if (gt) go(parseInt(gt.getAttribute('data-step-go'), 10), true);
    });
    if (panels.length) go(cur, false);
  });

  /* ------------------------------------------------------------------------
     21. 코드 복사 — [data-copy] (값 = 대상 id, 없으면 가까운 .code pre)
     ------------------------------------------------------------------------ */
  doc.addEventListener('click', (e) => {
    const b = e.target.closest('[data-copy]');
    if (!b) return;
    const target = byId(b.getAttribute('data-copy')) || $('pre', b.closest('.code') || doc);
    if (!target) return;
    const text = target.innerText;
    const done = () => {
      const old = b.textContent;
      b.textContent = '복사됨';
      b.classList.add('is-done');
      window.setTimeout(() => { b.textContent = old; b.classList.remove('is-done'); }, 1600);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, done);
    else done();
  });

  /* ------------------------------------------------------------------------
     22. 페이지네이션 — [data-pager] 안의 button.pager__num / [data-pager-prev|next]
     ------------------------------------------------------------------------ */
  $$('[data-pager]').forEach((pg) => {
    const nums = $$('.pager__num', pg);
    const total = parseInt(pg.getAttribute('data-total') || nums.length, 10);
    const out = $('[data-pager-index]', pg);
    const prev = $('[data-pager-prev]', pg);
    const next = $('[data-pager-next]', pg);
    let cur = parseInt((nums.find((n) => n.getAttribute('aria-current') === 'page') || nums[0] || { textContent: '1' }).textContent, 10);
    function set(n) {
      cur = Math.max(1, Math.min(total, n));
      nums.forEach((b) => { if (parseInt(b.textContent, 10) === cur) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current'); });
      if (out) out.textContent = String(cur);
      if (prev) prev.disabled = cur <= 1;
      if (next) next.disabled = cur >= total;
      pg.dispatchEvent(new CustomEvent('pager:change', { bubbles: true, detail: { page: cur } }));
    }
    pg.addEventListener('click', (e) => {
      const b = e.target.closest('button.pager__num');
      if (b) { set(parseInt(b.textContent, 10)); return; }
      if (e.target.closest('[data-pager-prev]')) set(cur - 1);
      if (e.target.closest('[data-pager-next]')) set(cur + 1);
    });
    set(cur);
  });

  /* ------------------------------------------------------------------------
     23. 보기 전환 · 목록 선택
         [data-views] 컨테이너의 data-view 를 [data-view-set="read"] 로 바꾼다.
         [data-select-list] 안의 .cat-list__row 클릭 → aria-selected 단일 선택
     ------------------------------------------------------------------------ */
  doc.addEventListener('click', (e) => {
    const row = e.target.closest('[data-select-list] .cat-list__row');
    if (row) {
      const list = row.closest('[data-select-list]');
      $$('.cat-list__row', list).forEach((r) => r.setAttribute('aria-selected', String(r === row)));
      row.classList.remove('is-unread');
      list.dispatchEvent(new CustomEvent('list:select', { bubbles: true, detail: { row, key: row.getAttribute('data-key') } }));
    }
    const vs = e.target.closest('[data-view-set]');
    if (vs) {
      const box = vs.closest('[data-views]') || $('[data-views]');
      if (box) {
        box.setAttribute('data-view', vs.getAttribute('data-view-set'));
        const f = byId(vs.getAttribute('data-view-focus'));
        if (f) { if (!f.hasAttribute('tabindex')) f.tabIndex = -1; f.focus(); }
      }
    }
  });

  /* ------------------------------------------------------------------------
     24. 기타 — 알림 닫기 [data-dismiss], 로딩 시연 [data-busy-demo], 모션 견본
     ------------------------------------------------------------------------ */
  doc.addEventListener('click', (e) => {
    const d = e.target.closest('[data-dismiss]');
    if (d) {
      const box = d.closest('.alert') || d.closest('[data-dismissible]');
      if (box) {
        if (reduced()) box.remove();
        else { box.classList.add('is-leaving'); window.setTimeout(() => box.remove(), 200); }
      }
      return;
    }
    const busy = e.target.closest('[data-busy-demo]');
    if (busy && !busy.classList.contains('is-loading')) {
      busy.classList.add('is-loading');
      busy.setAttribute('aria-busy', 'true');
      window.setTimeout(() => { busy.classList.remove('is-loading'); busy.removeAttribute('aria-busy'); }, 1600);
      return;
    }
    const play = e.target.closest('[data-motion-play]');
    if (play) {
      const demo = play.closest('.motion-demo') || byId(play.getAttribute('data-motion-play'));
      if (demo) restartAnim(demo, 'is-playing');
    }
  });

  // 외부 사용
  window.Yeobaek = { toast, openLayer, closeLayer, setProgress, setTheme: (t) => { store.set(valid(t)); switchTheme(valid(t) || (scheme.matches ? 'dark' : 'light')); } };
})();
