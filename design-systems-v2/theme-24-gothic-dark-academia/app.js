/* 석루서고 디자인 시스템 v2 — 인터랙션 (바닐라, 외부 라이브러리 없음)
   마크업 계약은 COMPONENTS.md. 모든 사용자 노출 문구는 한국어. */
(function () {
  'use strict';

  const doc = document;
  const root = doc.documentElement;
  const $ = (sel, ctx = doc) => ctx.querySelector(sel);
  const $$ = (sel, ctx = doc) => Array.from(ctx.querySelectorAll(sel));
  const byId = (id) => (id ? doc.getElementById(id) : null);
  const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
  const focusables = (box) => $$(FOCUSABLE, box).filter((el) => el.offsetParent !== null || el === doc.activeElement);
  const NOW_STAMP = '26.10.22';          // 세계관 기준 일시: 2026년 10월 22일 목요일 23:10
  const NOW_TIME = '23:10';

  /* ─────────────────────────────────────────────
     1. 테마 — ?theme= > localStorage > 시스템
  ───────────────────────────────────────────── */
  const THEME_KEY = 'seokru-theme';
  function storedTheme() {
    try { const s = localStorage.getItem(THEME_KEY); return s === 'dark' || s === 'light' ? s : null; } catch (e) { return null; }
  }
  function resolveTheme() {
    const q = new URLSearchParams(location.search).get('theme');
    if (q === 'dark' || q === 'light') return q;
    return storedTheme() || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  }
  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    $$('[data-theme-toggle]').forEach((btn) => {
      const dark = theme === 'dark';
      btn.setAttribute('aria-pressed', String(dark));
      const label = $('[data-theme-label]', btn);
      const text = dark ? '낮 열람실로' : '밤 열람실로';
      if (label) label.textContent = text;
      if (!btn.hasAttribute('data-keep-aria')) btn.setAttribute('aria-label', dark ? '낮 열람실로 옮기기 (밝은 화면)' : '밤 열람실로 옮기기 (어두운 화면)');
    });
  }
  doc.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-theme-toggle]');
    if (!btn) return;
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem(THEME_KEY, next); } catch (err) { /* 저장 불가 환경 */ }
    applyTheme(next);
    toast(next === 'dark'
      ? { title: '밤 열람실로 옮겼습니다', text: '램프를 켰습니다.', tone: 'info', stamp: NOW_TIME }
      : { title: '낮 열람실로 옮겼습니다', text: '램프를 껐습니다.', tone: 'info', stamp: NOW_TIME });
  });
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    const q = new URLSearchParams(location.search).get('theme');
    if (!q && !storedTheme()) applyTheme(resolveTheme());
  });

  /* ─────────────────────────────────────────────
     2. 오버레이 층 — 모달 · 드로어 · 커맨드 · 모바일 사이드바
        Esc 닫기 · 포커스 트랩 · 여는 버튼으로 포커스 복귀 · 스크롤 잠금
  ───────────────────────────────────────────── */
  const layers = [];
  function syncLock() { root.style.overflow = layers.length ? 'hidden' : ''; }
  function trapTab(e, box) {
    const items = focusables(box);
    if (!items.length) { e.preventDefault(); box.focus(); return; }
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && (doc.activeElement === first || !box.contains(doc.activeElement))) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && doc.activeElement === last) { e.preventDefault(); first.focus(); }
  }
  function openLayer(el, opener, opts = {}) {
    if (!el || layers.some((l) => l.el === el)) return;
    const box = opts.box || $('[role="dialog"]', el) || el;
    const layer = { el, box, opener: opener || doc.activeElement, close: opts.close || (() => closeLayer(el)) };
    layers.push(layer);
    if (opts.show) opts.show(); else el.hidden = false;
    syncLock();
    requestAnimationFrame(() => {
      const target = $('[data-autofocus]', el) || focusables(box)[0] || box;
      if (target === box && !box.hasAttribute('tabindex')) box.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    });
  }
  function closeLayer(el, opts = {}) {
    const i = layers.findIndex((l) => l.el === el);
    if (i < 0) return;
    const layer = layers.splice(i, 1)[0];
    const finish = () => {
      el.classList.remove('is-closing');
      if (opts.hide) opts.hide(); else el.hidden = true;
      syncLock();
      if (layer.opener && doc.contains(layer.opener)) layer.opener.focus({ preventScroll: true });
    };
    if (reduceMotion() || opts.instant) finish();
    else { el.classList.add('is-closing'); setTimeout(finish, 180); }
  }
  doc.addEventListener('keydown', (e) => {
    const top = layers[layers.length - 1];
    if (!top) return;
    if (e.key === 'Escape') { e.preventDefault(); top.close(); }
    else if (e.key === 'Tab') trapTab(e, top.box);
  });

  // 모달 · 드로어
  doc.addEventListener('click', (e) => {
    const opener = e.target.closest('[data-modal-open],[data-drawer-open]');
    if (opener) {
      e.preventDefault();
      const el = byId(opener.getAttribute('data-modal-open') || opener.getAttribute('data-drawer-open'));
      if (el) openLayer(el, opener);
      return;
    }
    const closer = e.target.closest('[data-close]');
    if (closer) {
      const host = closer.closest('.modal, .drawer, .command');
      if (host && !host.classList.contains('modal--static') && !host.classList.contains('drawer--static') && !host.classList.contains('command--static')) {
        const top = layers.find((l) => l.el === host);
        if (top) top.close(); else closeLayer(host);
      }
    }
  });

  // 모바일 사이드바(카드 서랍) — ≤900
  function sidebarParts() {
    const side = $('.desk__side');
    let scrim = $('.desk__scrim');
    if (side && !scrim) {
      scrim = doc.createElement('div');
      scrim.className = 'desk__scrim';
      scrim.setAttribute('aria-hidden', 'true');
      side.after(scrim);
    }
    return { side, scrim };
  }
  function closeSidebar() {
    const { side, scrim } = sidebarParts();
    if (!side) return;
    closeLayer(side, {
      instant: true,
      hide: () => { side.classList.remove('is-open'); scrim.classList.remove('is-open'); $$('[data-sidebar-toggle]').forEach((b) => b.setAttribute('aria-expanded', 'false')); },
    });
  }
  doc.addEventListener('click', (e) => {
    const t = e.target.closest('[data-sidebar-toggle]');
    if (t) {
      const { side, scrim } = sidebarParts();
      if (!side) return;
      if (side.classList.contains('is-open')) { closeSidebar(); return; }
      openLayer(side, t, {
        box: side,
        close: closeSidebar,
        show: () => { side.classList.add('is-open'); scrim.classList.add('is-open'); t.setAttribute('aria-expanded', 'true'); },
      });
      return;
    }
    if (e.target.closest('[data-sidebar-close]') || e.target.classList.contains('desk__scrim')) closeSidebar();
  });
  window.matchMedia('(min-width: 901px)').addEventListener('change', (m) => { if (m.matches) closeSidebar(); });

  /* ─────────────────────────────────────────────
     3. 서가 검색 카드 (⌘K) — combobox + listbox
  ───────────────────────────────────────────── */
  function initCommand(el) {
    if (el.__cmd) return el.__cmd;
    const input = $('.command__input', el);
    const list = $('.command__list', el);
    const empty = $('.command__empty', el);
    const items = $$('.command__item', el);
    const groups = $$('.command__group', el);
    let active = null;

    items.forEach((it, i) => { if (!it.id) it.id = `${el.id || 'cmd'}-opt-${i}`; it.setAttribute('aria-selected', 'false'); });

    function visible() { return items.filter((it) => !it.hidden && it.getAttribute('aria-disabled') !== 'true'); }
    function setActive(it, scroll = true) {
      if (active) active.setAttribute('aria-selected', 'false');
      active = it || null;
      if (active) {
        active.setAttribute('aria-selected', 'true');
        input && input.setAttribute('aria-activedescendant', active.id);
        if (scroll) active.scrollIntoView({ block: 'nearest' });
      } else if (input) input.removeAttribute('aria-activedescendant');
    }
    function filter(q) {
      const term = q.trim().toLowerCase();
      items.forEach((it) => {
        const hay = `${it.getAttribute('data-keywords') || ''} ${it.textContent}`.toLowerCase();
        it.hidden = term !== '' && !hay.includes(term);
      });
      groups.forEach((g) => {
        let n = g.nextElementSibling; let any = false;
        while (n && !n.classList.contains('command__group')) { if (!n.hidden) any = true; n = n.nextElementSibling; }
        g.hidden = !any;
      });
      const vis = visible();
      if (empty) empty.hidden = vis.length > 0;
      if (list) list.hidden = vis.length === 0;
      setActive(vis[0], false);
    }
    function choose(it) {
      if (!it) return;
      const href = it.getAttribute('data-href');
      if (href) { location.href = href; return; }
      const name = ($('.command__name', it) || it).textContent.trim();
      if (!el.classList.contains('command--static')) closeLayer(el);
      toast({ title: '서가 위치를 찾았습니다', text: name, tone: 'info', stamp: NOW_STAMP });
    }
    if (input) {
      input.setAttribute('role', 'combobox');
      input.setAttribute('aria-expanded', 'true');
      input.setAttribute('aria-autocomplete', 'list');
      if (list && list.id) input.setAttribute('aria-controls', list.id);
      input.addEventListener('input', () => filter(input.value));
      input.addEventListener('keydown', (e) => {
        const vis = visible();
        const i = vis.indexOf(active);
        if (e.key === 'ArrowDown') { e.preventDefault(); setActive(vis[(i + 1) % vis.length]); }
        else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(vis[(i - 1 + vis.length) % vis.length]); }
        else if (e.key === 'Home' && e.ctrlKey) { e.preventDefault(); setActive(vis[0]); }
        else if (e.key === 'End' && e.ctrlKey) { e.preventDefault(); setActive(vis[vis.length - 1]); }
        else if (e.key === 'Enter') { e.preventDefault(); choose(active); }
      });
    }
    items.forEach((it) => {
      it.addEventListener('mousemove', () => { if (active !== it) setActive(it, false); });
      it.addEventListener('click', () => choose(it));
    });
    filter(input ? input.value : '');
    const api = { reset() { if (input) input.value = ''; filter(''); } };
    el.__cmd = api;
    return api;
  }
  function openCommand(el, opener) {
    if (!el) return;
    initCommand(el).reset();
    openLayer(el, opener, { box: $('.command__card', el) || el });
  }
  doc.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
      const el = $('.command[data-command]:not(.command--static)');
      if (!el) return;
      e.preventDefault();
      if (layers.some((l) => l.el === el)) closeLayer(el); else openCommand(el, doc.activeElement);
    }
  });
  doc.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-command-open]');
    if (!btn) return;
    e.preventDefault();
    openCommand(byId(btn.getAttribute('data-command-open')) || $('.command[data-command]:not(.command--static)'), btn);
  });

  /* ─────────────────────────────────────────────
     4. 팝오버 · 메뉴 (쪽지 카드)
  ───────────────────────────────────────────── */
  let openFloat = null;
  function closeFloat(returnFocus) {
    if (!openFloat) return;
    const { panel, trigger } = openFloat;
    panel.hidden = true;
    trigger.setAttribute('aria-expanded', 'false');
    openFloat = null;
    if (returnFocus) trigger.focus();
  }
  function openFloating(panel, trigger, type) {
    if (openFloat && openFloat.panel === panel) { closeFloat(false); return; }
    closeFloat(false);
    panel.hidden = false;
    trigger.setAttribute('aria-expanded', 'true');
    openFloat = { panel, trigger, type };
    // 화면 오른쪽 끝을 넘으면 오른쪽 정렬로 뒤집는다
    panel.classList.remove('is-flipped');
    const r = panel.getBoundingClientRect();
    if (r.right > window.innerWidth - 8) { panel.style.left = 'auto'; panel.style.right = '0'; }
    if (r.left < 8) { panel.style.left = '0'; panel.style.right = 'auto'; }
    if (type === 'menu') {
      const first = $$('.menu__item', panel).find((i) => i.getAttribute('aria-disabled') !== 'true');
      if (first) first.focus();
    } else {
      const f = $('[data-autofocus]', panel);
      if (f) f.focus();
    }
  }
  doc.addEventListener('click', (e) => {
    const pt = e.target.closest('[data-popover-trigger]');
    if (pt) { e.preventDefault(); const p = byId(pt.getAttribute('aria-controls') || pt.getAttribute('data-popover-trigger')); if (p) openFloating(p, pt, 'popover'); return; }
    const mt = e.target.closest('[data-menu-trigger]');
    if (mt) { e.preventDefault(); const p = byId(mt.getAttribute('aria-controls') || mt.getAttribute('data-menu-trigger')); if (p) openFloating(p, mt, 'menu'); return; }
    if (openFloat && e.target.closest('[data-float-close]')) { closeFloat(true); return; }
    const mi = e.target.closest('.menu__item');
    if (mi && openFloat && openFloat.panel.contains(mi)) {
      if (mi.getAttribute('aria-disabled') === 'true') { e.preventDefault(); return; }
      if (mi.getAttribute('role') === 'menuitemradio') {
        $$('[role="menuitemradio"]', openFloat.panel).forEach((r) => r.setAttribute('aria-checked', String(r === mi)));
      }
      if (!mi.hasAttribute('data-keep-open')) closeFloat(true);
      return;
    }
    if (openFloat && !openFloat.panel.contains(e.target)) closeFloat(false);
  });
  doc.addEventListener('keydown', (e) => {
    if (openFloat && e.key === 'Escape') { e.stopPropagation(); closeFloat(true); return; }
    // 메뉴 트리거에서 ↓ → 메뉴 열기
    const mt = e.target.closest && e.target.closest('[data-menu-trigger]');
    if (mt && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      e.preventDefault();
      const p = byId(mt.getAttribute('aria-controls') || mt.getAttribute('data-menu-trigger'));
      if (p && p.hidden) openFloating(p, mt, 'menu');
      return;
    }
    if (!openFloat || openFloat.type !== 'menu' || !openFloat.panel.contains(doc.activeElement)) return;
    const items = $$('.menu__item', openFloat.panel).filter((i) => i.getAttribute('aria-disabled') !== 'true');
    const i = items.indexOf(doc.activeElement);
    let next = null;
    if (e.key === 'ArrowDown') next = items[(i + 1) % items.length];
    else if (e.key === 'ArrowUp') next = items[(i - 1 + items.length) % items.length];
    else if (e.key === 'Home') next = items[0];
    else if (e.key === 'End') next = items[items.length - 1];
    else if (e.key === 'Tab') { closeFloat(false); return; }
    if (next) { e.preventDefault(); next.focus(); }
  }, true);

  // 툴팁 — Esc로 숨김
  doc.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    $$('.tip').forEach((t) => { if (t.matches(':hover') || t.contains(doc.activeElement)) t.classList.add('is-dismissed'); });
  });
  doc.addEventListener('mouseout', (e) => { const t = e.target.closest && e.target.closest('.tip'); if (t && !t.contains(e.relatedTarget)) t.classList.remove('is-dismissed'); });
  doc.addEventListener('focusout', (e) => { const t = e.target.closest && e.target.closest('.tip'); if (t) t.classList.remove('is-dismissed'); });

  /* ─────────────────────────────────────────────
     5. 탭 (서랍 색인)
  ───────────────────────────────────────────── */
  function initTabs(box) {
    const tabs = $$('[role="tab"]', box).filter((t) => t.closest('[data-tabs]') === box);
    if (!tabs.length) return;
    function select(tab, focus) {
      tabs.forEach((t) => {
        const on = t === tab;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        const panel = byId(t.getAttribute('aria-controls'));
        if (panel) panel.hidden = !on;
      });
      if (focus) { tab.focus(); tab.scrollIntoView({ block: 'nearest', inline: 'nearest' }); }
    }
    const current = tabs.find((t) => t.getAttribute('aria-selected') === 'true') || tabs[0];
    select(current, false);
    tabs.forEach((t, i) => {
      t.addEventListener('click', () => { if (!t.disabled && t.getAttribute('aria-disabled') !== 'true') select(t, false); });
      t.addEventListener('keydown', (e) => {
        const usable = tabs.filter((x) => !x.disabled && x.getAttribute('aria-disabled') !== 'true');
        const j = usable.indexOf(t);
        let n = null;
        if (e.key === 'ArrowRight') n = usable[(j + 1) % usable.length];
        else if (e.key === 'ArrowLeft') n = usable[(j - 1 + usable.length) % usable.length];
        else if (e.key === 'Home') n = usable[0];
        else if (e.key === 'End') n = usable[usable.length - 1];
        if (n) { e.preventDefault(); select(n, true); }
      });
    });
    const rail = $('.tabs__rail', box);
    if (rail) {
      const sync = () => {
        rail.classList.toggle('is-scrollable', rail.scrollWidth > rail.clientWidth + 2);
        rail.classList.toggle('is-end', rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 2);
      };
      rail.addEventListener('scroll', sync, { passive: true });
      window.addEventListener('resize', sync);
      sync();
    }
  }

  /* ─────────────────────────────────────────────
     6. 아코디언 (열람 규칙 조문)
  ───────────────────────────────────────────── */
  function initAccordion(box) {
    const single = box.getAttribute('data-accordion') === 'single';
    const items = $$('.accordion__item', box);
    items.forEach((item) => {
      const btn = $('.accordion__btn', item);
      if (!btn) return;
      const open = btn.getAttribute('aria-expanded') === 'true';
      item.classList.toggle('is-open', open);
      btn.addEventListener('click', () => {
        const willOpen = btn.getAttribute('aria-expanded') !== 'true';
        if (single && willOpen) {
          items.forEach((other) => {
            if (other === item) return;
            other.classList.remove('is-open');
            const ob = $('.accordion__btn', other);
            if (ob) ob.setAttribute('aria-expanded', 'false');
          });
        }
        btn.setAttribute('aria-expanded', String(willOpen));
        item.classList.toggle('is-open', willOpen);
      });
    });
  }

  /* ─────────────────────────────────────────────
     7. 토스트 — 반납 쪽지 + 날짜도장
  ───────────────────────────────────────────── */
  function toastZone() {
    let z = $('.toast-zone[data-live]');
    if (!z) {
      z = doc.createElement('div');
      z.className = 'toast-zone';
      z.setAttribute('data-live', '');
      z.setAttribute('role', 'region');
      z.setAttribute('aria-label', '알림');
      z.setAttribute('aria-live', 'polite');
      doc.body.appendChild(z);
    }
    return z;
  }
  const STAMP_TONE = { ok: 'stamp--ok', warn: 'stamp--repair', info: 'stamp--lent', danger: 'stamp--rare' };
  function toast({ title = '기록했습니다', text = '', tone = '', stamp = `${NOW_STAMP} ${NOW_TIME}`, duration = 5000 } = {}) {
    const zone = toastZone();
    const el = doc.createElement('div');
    el.className = `toast${tone && tone !== 'danger' ? ` toast--${tone}` : ''}`;
    el.setAttribute('role', 'status');
    const body = doc.createElement('div');
    const t = doc.createElement('b'); t.className = 'toast__title'; t.textContent = title; body.appendChild(t);
    if (text) { const p = doc.createElement('p'); p.className = 'toast__text'; p.textContent = text; body.appendChild(p); }
    let st = null;
    if (stamp) {
      st = doc.createElement('span');
      st.className = `stamp stamp--sm stamp--date toast__stamp ${STAMP_TONE[tone] || ''}`.trim();
      st.textContent = stamp;
      st.style.opacity = '0';
      body.appendChild(st);
    }
    const close = doc.createElement('button');
    close.type = 'button';
    close.className = 'toast__close';
    close.setAttribute('aria-label', '알림 닫기');
    close.innerHTML = '<svg class="icon icon--sm" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';
    el.append(body, close);
    zone.appendChild(el);
    if (st) {
      setTimeout(() => {
        st.style.opacity = '';
        st.classList.add('is-stamping');
        setTimeout(() => { el.classList.add('is-pressed'); }, 160);
      }, reduceMotion() ? 0 : 260);
    }
    let timer = setTimeout(remove, duration);
    function remove() {
      clearTimeout(timer);
      if (reduceMotion()) { el.remove(); return; }
      el.classList.add('is-leaving');
      setTimeout(() => el.remove(), 180);
    }
    close.addEventListener('click', remove);
    el.addEventListener('mouseenter', () => clearTimeout(timer));
    el.addEventListener('mouseleave', () => { timer = setTimeout(remove, 2400); });
    return el;
  }
  function toastFromAttrs(el) {
    return {
      tone: el.getAttribute('data-toast') || '',
      title: el.getAttribute('data-toast-title') || '기록했습니다',
      text: el.getAttribute('data-toast-text') || '',
      stamp: el.hasAttribute('data-toast-stamp') ? el.getAttribute('data-toast-stamp') : `${NOW_STAMP} ${NOW_TIME}`,
    };
  }
  doc.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-toast]');
    if (!btn || btn.hasAttribute('data-busy-demo') || btn.matches('form')) return;
    toast(toastFromAttrs(btn));
  });

  /* ─────────────────────────────────────────────
     8. 버튼 로딩 시연 · 경고 닫기
  ───────────────────────────────────────────── */
  doc.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-busy-demo]');
    if (!btn || btn.getAttribute('aria-busy') === 'true') return;
    const ms = parseInt(btn.getAttribute('data-busy-demo'), 10) || 1600;
    const label = $('[data-busy-label]', btn);
    const before = label ? label.textContent : null;
    btn.setAttribute('aria-busy', 'true');
    if (label) label.textContent = btn.getAttribute('data-busy-text') || '불러오는 중';
    setTimeout(() => {
      btn.removeAttribute('aria-busy');
      if (label) label.textContent = before;
      if (btn.hasAttribute('data-toast')) toast(toastFromAttrs(btn));
    }, ms);
  });
  doc.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-dismiss]');
    if (!btn) return;
    const host = btn.closest('.alert, [data-dismissible]');
    if (!host) return;
    if (reduceMotion()) { host.remove(); return; }
    host.classList.add('is-leaving');
    setTimeout(() => host.remove(), 180);
  });

  /* ─────────────────────────────────────────────
     9. 캐러셀 — 신착 고서 넘기기
  ───────────────────────────────────────────── */
  function initCarousel(box) {
    const spines = $$('.carousel__spine', box);
    const slides = $$('.carousel__slide', box);
    if (!slides.length) return;
    const count = $('[data-carousel-count]', box);
    const name = $('[data-carousel-name]', box);
    const live = $('[data-carousel-live]', box);
    let idx = Math.max(0, slides.findIndex((s) => !s.hidden));
    function render(animate) {
      slides.forEach((s, i) => {
        s.hidden = i !== idx;
        s.setAttribute('aria-label', `${slides.length}권 중 ${i + 1}번째`);
        if (i === idx && animate && !reduceMotion()) { s.classList.remove('is-entering'); void s.offsetWidth; s.classList.add('is-entering'); }
      });
      spines.forEach((sp, i) => sp.setAttribute('aria-current', String(i === idx)));
      if (count) count.textContent = `${idx + 1} / ${slides.length}`;
      const title = slides[idx].getAttribute('data-title') || '';
      if (name) name.textContent = title;
      if (live && animate) live.textContent = `${title} — ${slides.length}권 중 ${idx + 1}번째`;
    }
    function go(n) { idx = (n + slides.length) % slides.length; render(true); }
    spines.forEach((sp, i) => sp.addEventListener('click', () => go(i)));
    const prev = $('[data-carousel-prev]', box);
    const next = $('[data-carousel-next]', box);
    if (prev) prev.addEventListener('click', () => go(idx - 1));
    if (next) next.addEventListener('click', () => go(idx + 1));
    box.addEventListener('keydown', (e) => {
      if (e.target.closest('input, textarea, select')) return;
      if (e.key === 'ArrowRight') { e.preventDefault(); go(idx + 1); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); go(idx - 1); }
    });
    render(false);
  }

  /* ─────────────────────────────────────────────
     10. 장부 — 정렬 · 선택 · 일괄 바
  ───────────────────────────────────────────── */
  function cellValue(cell) {
    const raw = cell.getAttribute('data-sort') ?? cell.textContent.trim();
    const num = parseFloat(String(raw).replace(/[₩,%\s책건회]/g, ''));
    return Number.isFinite(num) && /^[\d.,₩%\s책건회-]+$/.test(String(raw)) ? num : String(raw);
  }
  doc.addEventListener('click', (e) => {
    const btn = e.target.closest('.ledger__sort');
    if (!btn) return;
    const th = btn.closest('th');
    const table = btn.closest('table');
    const tbody = table && table.tBodies[0];
    if (!th || !tbody) return;
    const col = Array.from(th.parentElement.children).indexOf(th);
    const dir = th.getAttribute('aria-sort') === 'ascending' ? 'descending' : 'ascending';
    $$('th[aria-sort]', table).forEach((h) => h.setAttribute('aria-sort', 'none'));
    th.setAttribute('aria-sort', dir);
    const rows = Array.from(tbody.rows);
    rows.sort((a, b) => {
      const x = cellValue(a.cells[col]); const y = cellValue(b.cells[col]);
      const r = typeof x === 'number' && typeof y === 'number' ? x - y : String(x).localeCompare(String(y), 'ko');
      return dir === 'ascending' ? r : -r;
    });
    rows.forEach((r) => tbody.appendChild(r));
    const live = $('[data-sort-live]', table.parentElement) || $('[data-sort-live]');
    if (live) live.textContent = `${btn.textContent.trim()} ${dir === 'ascending' ? '오름차순' : '내림차순'}으로 정렬했습니다.`;
  });
  function initTableSelect(table) {
    const all = $('[data-select-all]', table);
    const boxes = () => $$('[data-row-select]', table);
    const bar = byId(table.getAttribute('data-bulk'));
    function sync() {
      const list = boxes();
      const n = list.filter((b) => b.checked).length;
      list.forEach((b) => { const tr = b.closest('tr'); if (tr) tr.setAttribute('aria-selected', String(b.checked)); });
      if (all) { all.checked = n > 0 && n === list.length; all.indeterminate = n > 0 && n < list.length; }
      if (bar) {
        bar.hidden = n === 0;
        $$('[data-bulk-count]', bar).forEach((c) => { c.textContent = String(n); });
      }
    }
    if (all) all.addEventListener('change', () => { boxes().forEach((b) => { b.checked = all.checked; }); sync(); });
    table.addEventListener('change', (e) => { if (e.target.matches('[data-row-select]')) sync(); });
    if (bar) {
      bar.addEventListener('click', (e) => {
        const act = e.target.closest('[data-bulk-action]');
        if (!act) return;
        const chosen = boxes().filter((b) => b.checked);
        const verb = act.getAttribute('data-bulk-action');
        if (verb === 'clear') { chosen.forEach((b) => { b.checked = false; }); sync(); return; }
        chosen.forEach((b) => {
          const tr = b.closest('tr');
          const cell = tr && $('[data-status]', tr);
          if (cell) {
            cell.innerHTML = '';
            const s = doc.createElement('span');
            s.className = `stamp stamp--sm ${verb === 'reject' ? 'stamp--rare' : 'stamp--ok'}`;
            s.textContent = verb === 'reject' ? '반려' : '승인';
            cell.appendChild(s);
            if (!reduceMotion()) s.classList.add('is-stamping');
          }
          b.checked = false;
        });
        sync();
        toast({ title: `${chosen.length}건을 ${verb === 'reject' ? '반려' : '승인'}했습니다`, text: '열람 신청 장부에 도장을 찍었습니다.', tone: verb === 'reject' ? 'danger' : 'ok' });
      });
    }
    sync();
  }

  /* ─────────────────────────────────────────────
     11. 달력 — 날짜 고르기
  ───────────────────────────────────────────── */
  function initCalendar(cal) {
    const out = $('[data-cal-output]', cal);
    cal.addEventListener('click', (e) => {
      const day = e.target.closest('.cal__day');
      if (!day || day.disabled || day.getAttribute('aria-disabled') === 'true') return;
      $$('.cal__day[aria-selected="true"]', cal).forEach((d) => d.setAttribute('aria-selected', 'false'));
      day.setAttribute('aria-selected', 'true');
      if (out) out.textContent = day.getAttribute('data-label') || day.getAttribute('aria-label') || day.textContent.trim();
    });
    // 방향키로 날짜 이동
    cal.addEventListener('keydown', (e) => {
      const day = e.target.closest('.cal__day');
      if (!day) return;
      const days = $$('.cal__day', cal).filter((d) => !d.closest('.cal__cell--out'));
      const i = days.indexOf(day);
      const step = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: 7, ArrowUp: -7 }[e.key];
      if (step === undefined) return;
      const n = days[i + step];
      if (n) { e.preventDefault(); n.focus(); }
    });
  }

  /* ─────────────────────────────────────────────
     12. 칸반 — 수선 공방 작업대
  ───────────────────────────────────────────── */
  function josa(word, a, b) {
    const ch = word.replace(/[』」\s]+$/, '').slice(-1).charCodeAt(0);
    if (ch < 0xac00 || ch > 0xd7a3) return b;
    return (ch - 0xac00) % 28 ? a : b;
  }
  function initKanban(board) {
    const cols = $$('.kanban__col', board);
    let live = $('[data-kanban-live]', board.parentElement) || $('[data-kanban-live]', board);
    if (!live) {
      live = doc.createElement('p');
      live.className = 'sr-only';
      live.setAttribute('aria-live', 'polite');
      live.setAttribute('data-kanban-live', '');
      board.after(live);
    }
    const listOf = (col) => $('.kanban__list', col);
    const colName = (col) => (col && ($('.kanban__name', col) || col).textContent.trim()) || '';
    function refresh() {
      cols.forEach((col, ci) => {
        const list = listOf(col);
        const cards = $$('.kanban__card', list);
        $$('[data-count]', col).forEach((c) => { c.textContent = String(cards.length); });
        let empty = $('.kanban__empty', list);
        if (!cards.length && !empty) { empty = doc.createElement('li'); empty.className = 'kanban__empty'; empty.textContent = '비어 있는 공정'; list.appendChild(empty); }
        if (cards.length && empty) empty.remove();
        cards.forEach((card) => {
          const p = $('[data-move="prev"]', card); const n = $('[data-move="next"]', card);
          if (p) p.disabled = ci === 0;
          if (n) n.disabled = ci === cols.length - 1;
        });
      });
    }
    function move(card, dir, keepFocus) {
      const col = card.closest('.kanban__col');
      const ci = cols.indexOf(col);
      const target = cols[ci + dir];
      if (!target) return;
      const list = listOf(target);
      list.insertBefore(card, $('.kanban__card', list) || null);
      announce(card, target);
      if (!reduceMotion()) { card.classList.remove('is-moved'); void card.offsetWidth; card.classList.add('is-moved'); }
      refresh();
      if (keepFocus) card.focus();
    }
    function announce(card, col) {
      const t = card.getAttribute('data-title') || '수선 의뢰';
      live.textContent = `${t}${josa(t, '을', '를')} ${colName(col)} 공정으로 옮겼습니다.`;
    }
    board.addEventListener('click', (e) => {
      const b = e.target.closest('[data-move]');
      if (!b) return;
      const card = b.closest('.kanban__card');
      move(card, b.getAttribute('data-move') === 'next' ? 1 : -1, false);
      const again = $(`[data-move="${b.getAttribute('data-move')}"]`, card);
      if (again && !again.disabled) again.focus(); else card.focus();
    });
    board.addEventListener('keydown', (e) => {
      const card = e.target.closest('.kanban__card');
      if (!card || e.target !== card) return;
      if (e.key === ']') { e.preventDefault(); move(card, 1, true); }
      else if (e.key === '[') { e.preventDefault(); move(card, -1, true); }
    });
    // 끌어 놓기
    let dragging = null;
    board.addEventListener('dragstart', (e) => {
      const card = e.target.closest('.kanban__card');
      if (!card) return;
      dragging = card;
      card.classList.add('is-dragging');
      e.dataTransfer.effectAllowed = 'move';
      try { e.dataTransfer.setData('text/plain', card.getAttribute('data-title') || ''); } catch (err) { /* 무시 */ }
    });
    board.addEventListener('dragend', () => {
      if (dragging) dragging.classList.remove('is-dragging');
      cols.forEach((c) => c.classList.remove('is-over'));
      dragging = null;
    });
    cols.forEach((col) => {
      col.addEventListener('dragover', (e) => { if (!dragging) return; e.preventDefault(); col.classList.add('is-over'); });
      col.addEventListener('dragleave', (e) => { if (!col.contains(e.relatedTarget)) col.classList.remove('is-over'); });
      col.addEventListener('drop', (e) => {
        if (!dragging) return;
        e.preventDefault();
        col.classList.remove('is-over');
        const list = listOf(col);
        const after = $$('.kanban__card:not(.is-dragging)', list).find((c) => e.clientY < c.getBoundingClientRect().top + c.offsetHeight / 2);
        list.insertBefore(dragging, after || null);
        announce(dragging, col);
        refresh();
      });
    });
    refresh();
  }

  /* ─────────────────────────────────────────────
     13. 열람 신청서 검증 — form[data-validate]
  ───────────────────────────────────────────── */
  function fieldOf(input) { return input.closest('.field') || input.closest('.fieldset'); }
  function setFieldError(input, bad) {
    const field = fieldOf(input);
    if (bad) input.setAttribute('aria-invalid', 'true'); else input.removeAttribute('aria-invalid');
    if (!field) return;
    field.classList.toggle('is-invalid', bad);
    const err = $('.field__error', field);
    if (err) {
      if (!err.id) err.id = `${input.id || input.name || 'f'}-err`;
      const ids = (input.getAttribute('aria-describedby') || '').split(/\s+/).filter(Boolean);
      const has = ids.includes(err.id);
      if (bad && !has) ids.push(err.id);
      input.setAttribute('aria-describedby', (bad ? ids : ids.filter((i) => i !== err.id)).join(' '));
      if (bad && !err.textContent.trim()) err.textContent = input.getAttribute('data-error') || '이 칸을 채워 주십시오.';
    }
  }
  doc.addEventListener('submit', (e) => {
    const form = e.target.closest('form[data-validate]');
    if (!form) return;
    e.preventDefault();
    const inputs = $$('input, select, textarea', form).filter((i) => i.willValidate);
    let firstBad = null;
    inputs.forEach((i) => {
      const bad = !i.checkValidity();
      setFieldError(i, bad);
      if (bad && !firstBad) firstBad = i;
    });
    if (firstBad) {
      firstBad.focus();
      const sum = $('[data-form-summary]', form);
      if (sum) { sum.hidden = false; sum.textContent = `${inputs.filter((i) => !i.checkValidity()).length}개 칸을 다시 확인해 주십시오.`; }
      return;
    }
    const sum = $('[data-form-summary]', form);
    if (sum) sum.hidden = true;
    const submit = $('[type="submit"]', form);
    if (submit) {
      submit.setAttribute('aria-busy', 'true');
      setTimeout(() => {
        submit.removeAttribute('aria-busy');
        toast(toastFromAttrs(form));
        const stampSlot = $('[data-form-stamp]', form);
        if (stampSlot) {
          stampSlot.innerHTML = '';
          const s = doc.createElement('span');
          s.className = 'stamp stamp--ok stamp--lg';
          s.textContent = stampSlot.getAttribute('data-form-stamp') || '접수';
          stampSlot.appendChild(s);
          if (!reduceMotion()) s.classList.add('is-stamping');
        }
      }, 900);
    } else toast(toastFromAttrs(form));
  });
  doc.addEventListener('input', (e) => {
    const i = e.target;
    if (i.getAttribute && i.getAttribute('aria-invalid') === 'true' && i.checkValidity()) setFieldError(i, false);
  });
  doc.addEventListener('change', (e) => {
    const i = e.target;
    if (i.getAttribute && i.getAttribute('aria-invalid') === 'true' && i.checkValidity()) setFieldError(i, false);
    if (i.matches && i.matches('.switch__input')) syncSwitch(i);
  });
  function syncSwitch(i) {
    const host = i.closest('.switch');
    const state = host && $('[data-switch-state]', host);
    if (state) state.textContent = i.checked ? (state.getAttribute('data-on') || '켜짐') : (state.getAttribute('data-off') || '꺼짐');
  }

  /* ─────────────────────────────────────────────
     14. 마퀴 — 날짜도장 띠 (40px/s)
  ───────────────────────────────────────────── */
  function initMarquee(m) {
    const track = $('.marquee__track', m);
    if (!track) return;
    const setDur = () => { const w = track.scrollWidth / 2; if (w > 0) track.style.setProperty('--marquee-dur', `${Math.round(w / 40)}s`); };
    setDur();
    window.addEventListener('resize', setDur);
    if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(setDur);
    const tg = $('[data-marquee-toggle]', m);
    if (tg) {
      tg.addEventListener('click', () => {
        const paused = m.classList.toggle('is-paused');
        tg.setAttribute('aria-pressed', String(paused));
        const label = $('[data-marquee-label]', tg) || tg;
        label.textContent = paused ? '재생' : '정지';
      });
    }
  }

  /* ─────────────────────────────────────────────
     15. 원문 복사 — [data-copy]
  ───────────────────────────────────────────── */
  doc.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-copy]');
    if (!btn) return;
    const box = btn.closest('.code');
    const code = box && $('code', box);
    if (!code) return;
    const text = code.innerText;
    const done = () => {
      const label = $('[data-copy-label]', btn) || btn;
      const before = label.textContent;
      label.textContent = '베꼈습니다';
      btn.classList.add('is-done');
      setTimeout(() => { label.textContent = before; btn.classList.remove('is-done'); }, 1600);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, done);
    else done();
  });

  /* ─────────────────────────────────────────────
     16. 진행 — aria-valuenow → --val
  ───────────────────────────────────────────── */
  function syncProgress(bar) {
    const now = parseFloat(bar.getAttribute('aria-valuenow'));
    const min = parseFloat(bar.getAttribute('aria-valuemin') || '0');
    const max = parseFloat(bar.getAttribute('aria-valuemax') || '100');
    if (!Number.isFinite(now)) return;
    const pct = Math.max(0, Math.min(100, ((now - min) / (max - min)) * 100));
    const host = bar.classList.contains('progress__bar') ? bar : $('.progress__bar', bar) || bar;
    host.style.setProperty('--val', `${pct.toFixed(1)}%`);
  }

  /* ─────────────────────────────────────────────
     17. 모션 견본 — [data-motion-play="대상 id"]
  ───────────────────────────────────────────── */
  doc.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-motion-play]');
    if (!btn) return;
    const target = byId(btn.getAttribute('data-motion-play'));
    if (!target) return;
    if (target.hasAttribute('data-motion-toggle')) {
      const lit = target.classList.toggle('is-lit');
      btn.setAttribute('aria-pressed', String(lit));
      return;
    }
    target.classList.remove('is-playing');
    void target.offsetWidth;
    target.classList.add('is-playing');
  });

  /* ─────────────────────────────────────────────
     18. 서랍 속 카드 당기기 — .cardstack__tab
  ───────────────────────────────────────────── */
  function pullCard(item, focusTab) {
    const stack = item.closest('.cardstack');
    if (!stack) return;
    const already = item.classList.contains('is-pulled');
    $$('.cardstack__item.is-pulled', stack).forEach((it) => {
      it.classList.remove('is-pulled');
      const tb = $('.cardstack__tab', it); if (tb) tb.setAttribute('aria-expanded', 'false');
    });
    if (!already) {
      item.classList.add('is-pulled');
      const tb = $('.cardstack__tab', item); if (tb) tb.setAttribute('aria-expanded', 'true');
    }
    stack.classList.toggle('has-pulled', !already);
    if (focusTab) { const tb = $('.cardstack__tab', item); if (tb) tb.focus(); }
  }
  doc.addEventListener('click', (e) => {
    const tab = e.target.closest('.cardstack__tab');
    if (tab) pullCard(tab.closest('.cardstack__item'), false);
  });
  function initCardstack(stack) {
    const pulled = $('.cardstack__item.is-pulled', stack);
    stack.classList.toggle('has-pulled', !!pulled);
    $$('.cardstack__item', stack).forEach((it) => {
      const tb = $('.cardstack__tab', it);
      if (tb) tb.setAttribute('aria-expanded', String(it.classList.contains('is-pulled')));
    });
  }

  /* ─────────────────────────────────────────────
     19. 장 표제 등장 · 러닝헤드 현재 장
  ───────────────────────────────────────────── */
  function initReveal() {
    const els = $$('.reveal');
    if (!els.length || !('IntersectionObserver' in window) || reduceMotion()) { els.forEach((el) => el.classList.add('is-revealed')); return; }
    root.classList.add('has-reveal');
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('is-revealed'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    els.forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) el.classList.add('is-revealed');
      else io.observe(el);
    });
  }
  function initRunhead() {
    const title = $('[data-runhead-title]');
    const no = $('[data-runhead-no]');
    const chapters = $$('[data-chapter-title]');
    if (!title || !chapters.length || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        title.textContent = en.target.getAttribute('data-chapter-title');
        if (no) {
          const n = en.target.getAttribute('data-chapter-no') || '';
          no.textContent = n;
          no.classList.toggle('runhead__no--mark', n === '');
        }
      });
    }, { rootMargin: '-64px 0px -70% 0px' });
    chapters.forEach((c) => io.observe(c));
  }

  /* ─────────────────────────────────────────────
     20. 초기화
  ───────────────────────────────────────────── */
  function init(scope = doc) {
    $$('[data-tabs]', scope).forEach(initTabs);
    $$('[data-accordion]', scope).forEach(initAccordion);
    $$('[data-carousel]', scope).forEach(initCarousel);
    $$('table[data-table-select]', scope).forEach(initTableSelect);
    $$('[data-calendar]', scope).forEach(initCalendar);
    $$('[data-kanban]', scope).forEach(initKanban);
    $$('[data-marquee]', scope).forEach(initMarquee);
    $$('.command[data-command]', scope).forEach(initCommand);
    $$('[role="progressbar"]', scope).forEach(syncProgress);
    $$('.switch__input', scope).forEach(syncSwitch);
    $$('.cardstack', scope).forEach(initCardstack);
    $$('[data-popover-trigger], [data-menu-trigger]', scope).forEach((t) => { if (!t.hasAttribute('aria-expanded')) t.setAttribute('aria-expanded', 'false'); });
    $$('[data-sidebar-toggle]', scope).forEach((t) => { if (!t.hasAttribute('aria-expanded')) t.setAttribute('aria-expanded', 'false'); });
  }
  applyTheme(root.getAttribute('data-theme') || resolveTheme());
  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', () => { init(); initReveal(); initRunhead(); });
  else { init(); initReveal(); initRunhead(); }

  // 장면 스크립트에서 쓰도록 공개
  window.Seokru = { toast, openLayer, closeLayer, init, applyTheme, setProgress(bar, v) { bar.setAttribute('aria-valuenow', String(v)); syncProgress(bar); } };
})();
