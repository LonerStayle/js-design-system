/* 쨍 페스티벌 2026 디자인 시스템 v2 — app.js (바닐라, 외부 라이브러리 없음)
   테마 · 빌링 줄 양끝 맞춤 · 등장 와이프 · 모달/드로어/커맨드(⌘K) 층 · 팝오버/메뉴/툴팁 · 탭 · 아코디언
   토스트 · 캐러셀 · 마퀴 · 표 정렬 · 칸반 키보드/끌기 · 달력 · 폼 검증 · 단계 넘김 · 찜 토글 · 복사 · 모션 실연
   마크업 계약은 COMPONENTS.md. 전역 API: window.JJ */
(function () {
  'use strict';

  const doc = document;
  const root = doc.documentElement;
  const KEY = 'jjaeng-theme';
  const $ = (s, c = doc) => c.querySelector(s);
  const $$ = (s, c = doc) => Array.from(c.querySelectorAll(s));
  const reduceMQ = matchMedia('(prefers-reduced-motion: reduce)');
  const darkMQ = matchMedia('(prefers-color-scheme: dark)');
  const reduced = () => reduceMQ.matches;
  let uidN = 0;
  const uid = (p) => `${p}-${++uidN}`;
  const ICON_X = '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5l14 14M19 5L5 19"/></svg>';

  root.classList.add('js');

  /* ======================================================================
     1. 테마 — URL ?theme= 최우선 → localStorage → 시스템
     ====================================================================== */
  function readTheme() {
    const q = new URLSearchParams(location.search).get('theme');
    if (q === 'dark' || q === 'light') return { theme: q, from: 'query' };
    let s = null;
    try { s = localStorage.getItem(KEY); } catch (e) { /* 저장소 막힘 */ }
    if (s === 'dark' || s === 'light') return { theme: s, from: 'store' };
    return { theme: darkMQ.matches ? 'dark' : 'light', from: 'system' };
  }
  let themeState = readTheme();
  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    $$('[data-theme-toggle]').forEach((b) => {
      const dark = theme === 'dark';
      b.setAttribute('aria-pressed', dark ? 'true' : 'false');
      b.setAttribute('aria-label', dark ? '낮 화면으로 바꾸기' : '밤 화면으로 바꾸기');
      const label = b.querySelector('[data-theme-label]');
      if (label) label.textContent = dark ? '낮' : '밤';
    });
  }
  function setTheme(theme, persist = true) {
    if (persist) { try { localStorage.setItem(KEY, theme); } catch (e) { /* noop */ } }
    themeState = { theme, from: persist ? 'store' : themeState.from };
    applyTheme(theme);
  }
  applyTheme(themeState.theme);
  darkMQ.addEventListener('change', (e) => { if (themeState.from === 'system') applyTheme(e.matches ? 'dark' : 'light'); });
  doc.addEventListener('click', (e) => {
    const b = e.target.closest('[data-theme-toggle]');
    if (!b) return;
    setTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
  });

  /* ======================================================================
     2. 층(layer): 모달 · 드로어 · 커맨드 — 포커스 트랩, Esc, 스크롤 잠금
     ====================================================================== */
  const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]):not([type="hidden"]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';
  const layers = [];
  const isVisible = (el) => !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length);
  const focusables = (box) => $$(FOCUSABLE, box).filter(isVisible);

  function openLayer(el, opener) {
    if (typeof el === 'string') el = doc.getElementById(el);
    if (!el || layers.includes(el)) return;
    closeFloating();
    el.hidden = false;
    el.classList.add('is-open');
    el._opener = opener || doc.activeElement;
    layers.push(el);
    syncLock();
    if (el._cmdReset) el._cmdReset();
    const target = el.querySelector('[data-autofocus]') || focusables(el).find((f) => !f.matches('[data-close].modal__scrim, [data-close].drawer__scrim, [data-close].cmd__scrim')) || el;
    if (target === el && !el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
    requestAnimationFrame(() => target.focus({ preventScroll: true }));
    if (el._opener && el._opener.setAttribute && el._opener.hasAttribute('aria-expanded')) el._opener.setAttribute('aria-expanded', 'true');
    el.dispatchEvent(new CustomEvent('jj:open', { bubbles: true }));
  }
  function closeLayer(el) {
    if (typeof el === 'string') el = doc.getElementById(el);
    const i = layers.indexOf(el);
    if (i < 0) return;
    layers.splice(i, 1);
    el.classList.remove('is-open');
    el.hidden = true;
    syncLock();
    const o = el._opener;
    if (o && o.setAttribute && o.hasAttribute('aria-expanded')) o.setAttribute('aria-expanded', 'false');
    if (o && doc.contains(o) && o.focus) o.focus({ preventScroll: true });
    el.dispatchEvent(new CustomEvent('jj:close', { bubbles: true }));
  }
  function syncLock() { root.style.overflow = layers.length ? 'hidden' : ''; }
  function trapTab(e, box) {
    const f = focusables(box);
    if (!f.length) { e.preventDefault(); return; }
    const first = f[0];
    const last = f[f.length - 1];
    if (e.shiftKey && (doc.activeElement === first || !box.contains(doc.activeElement))) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && (doc.activeElement === last || !box.contains(doc.activeElement))) { e.preventDefault(); first.focus(); }
  }
  doc.addEventListener('click', (e) => {
    const op = e.target.closest('[data-open]');
    if (op) { e.preventDefault(); openLayer(op.getAttribute('data-open'), op); return; }
    const cl = e.target.closest('[data-close]');
    if (cl) {
      const layer = cl.closest('.modal, .drawer, .cmd');
      if (layer && layers.includes(layer)) { e.preventDefault(); closeLayer(layer); }
    }
  });

  /* ======================================================================
     3. 커맨드 팔레트 (⌘K / Ctrl+K)
     ====================================================================== */
  function initCommand(el) {
    const input = $('.cmd__input', el);
    const items = $$('.cmd__item', el);
    const groups = $$('.cmd__group', el);
    const empty = $('.cmd__empty', el);
    const list = $('.cmd__list', el);
    if (!input || !list) return;
    if (!list.id) list.id = uid('cmd-list');
    input.setAttribute('role', 'combobox');
    input.setAttribute('aria-controls', list.id);
    input.setAttribute('aria-expanded', 'true');
    input.setAttribute('aria-autocomplete', 'list');
    list.setAttribute('role', 'listbox');
    groups.forEach((g) => g.setAttribute('role', 'presentation'));
    let active = -1;
    const shown = () => items.filter((i) => !i.hidden);
    function setActive(idx) {
      const v = shown();
      items.forEach((i) => i.setAttribute('aria-selected', 'false'));
      if (!v.length) { active = -1; input.removeAttribute('aria-activedescendant'); return; }
      active = (idx + v.length) % v.length;
      const it = v[active];
      it.setAttribute('aria-selected', 'true');
      input.setAttribute('aria-activedescendant', it.id);
      if (el.classList.contains('is-open')) it.scrollIntoView({ block: 'nearest' });
    }
    function filter() {
      const q = input.value.trim().toLowerCase();
      items.forEach((i) => {
        const hay = `${i.textContent} ${i.dataset.keywords || ''}`.toLowerCase();
        i.hidden = !!q && !hay.includes(q);
      });
      groups.forEach((g) => {
        let n = g.nextElementSibling;
        let any = false;
        while (n && !n.classList.contains('cmd__group')) { if (n.classList.contains('cmd__item') && !n.hidden) any = true; n = n.nextElementSibling; }
        g.hidden = !any;
      });
      if (empty) empty.hidden = shown().length > 0;
      setActive(0);
    }
    function choose(it) {
      if (!it || it.getAttribute('aria-disabled') === 'true') return;
      const href = it.dataset.href;
      if (href) { location.href = href; return; }
      const name = $('.cmd__name', it);
      toast({ text: it.dataset.toast || `${name ? name.textContent : '항목'}(으)로 이동해요`, stage: it.dataset.stage });
      if (layers.includes(el)) closeLayer(el);
    }
    items.forEach((it) => {
      if (!it.id) it.id = uid('cmd-opt');
      it.setAttribute('role', 'option');
      it.addEventListener('click', () => choose(it));
      it.addEventListener('mousemove', () => { const i = shown().indexOf(it); if (i !== active) setActive(i); });
    });
    input.addEventListener('input', filter);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') { e.preventDefault(); setActive(active + 1); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(active - 1); }
      else if (e.key === 'Home' && e.altKey) { e.preventDefault(); setActive(0); }
      else if (e.key === 'Enter') { e.preventDefault(); choose(shown()[active]); }
    });
    el._cmdReset = () => { input.value = ''; filter(); };
    const pre = items.findIndex((i) => i.getAttribute('aria-selected') === 'true');
    filter();
    if (pre > 0) setActive(pre);
  }
  function mainCommand() { return $$('[data-command]').find((c) => !c.classList.contains('cmd--static')); }

  /* ======================================================================
     4. 팝오버 · 메뉴 (트랩 없음, 바깥 클릭·Esc 닫기)
     ====================================================================== */
  let floating = null; // { panel, trigger }
  function openFloating(trigger, panel) {
    closeFloating();
    panel.hidden = false;
    panel.classList.add('is-open');
    trigger.setAttribute('aria-expanded', 'true');
    floating = { panel, trigger };
    // 화면 밖으로 나가면 오른쪽 기준으로
    panel.classList.remove('menu--end', 'popover--end');
    const r = panel.getBoundingClientRect();
    if (r.right > innerWidth - 8) panel.classList.add(panel.classList.contains('menu') ? 'menu--end' : 'popover--end');
  }
  function closeFloating(returnFocus) {
    if (!floating) return;
    const { panel, trigger } = floating;
    panel.hidden = true;
    panel.classList.remove('is-open');
    trigger.setAttribute('aria-expanded', 'false');
    floating = null;
    if (returnFocus) trigger.focus();
  }
  function menuItems(panel) { return $$('[role^="menuitem"]', panel).filter((i) => !i.disabled && i.getAttribute('aria-disabled') !== 'true'); }
  doc.addEventListener('click', (e) => {
    const trig = e.target.closest('[data-popover], [aria-haspopup="menu"]');
    if (trig && trig.getAttribute('aria-controls')) {
      const panel = doc.getElementById(trig.getAttribute('aria-controls'));
      if (!panel) return;
      e.preventDefault();
      if (floating && floating.panel === panel) { closeFloating(); return; }
      openFloating(trig, panel);
      if (panel.getAttribute('role') === 'menu') { const f = menuItems(panel)[0]; if (f) f.focus(); }
      return;
    }
    if (floating && !floating.panel.contains(e.target)) closeFloating();
    // 메뉴 항목 선택
    const mi = e.target.closest('[role="menuitemradio"], [role="menuitemcheckbox"], [role="menuitem"]');
    if (mi && !mi.disabled && mi.getAttribute('aria-disabled') !== 'true') {
      const menu = mi.closest('[role="menu"]');
      if (mi.getAttribute('role') === 'menuitemradio') {
        $$('[role="menuitemradio"]', menu).forEach((x) => x.setAttribute('aria-checked', x === mi ? 'true' : 'false'));
        const trigger = menu && menu.id ? doc.querySelector(`[aria-controls="${menu.id}"]`) : null;
        const out = trigger && trigger.querySelector('[data-menu-value]');
        if (out) out.textContent = mi.dataset.value || mi.textContent.trim();
      } else if (mi.getAttribute('role') === 'menuitemcheckbox') {
        mi.setAttribute('aria-checked', mi.getAttribute('aria-checked') === 'true' ? 'false' : 'true');
      }
      if (mi.dataset.toast) toast({ text: mi.dataset.toast, tone: mi.dataset.toastTone, stage: mi.dataset.toastStage });
      if (floating && menu === floating.panel && mi.getAttribute('role') !== 'menuitemcheckbox') closeFloating(true);
    }
  });
  doc.addEventListener('keydown', (e) => {
    // 메뉴 안 화살표
    const menu = e.target.closest && e.target.closest('[role="menu"]');
    if (menu) {
      const its = menuItems(menu);
      const i = its.indexOf(doc.activeElement);
      let n = null;
      if (e.key === 'ArrowDown') n = i + 1;
      else if (e.key === 'ArrowUp') n = i - 1;
      else if (e.key === 'Home') n = 0;
      else if (e.key === 'End') n = its.length - 1;
      else if (e.key === 'Tab' && floating && floating.panel === menu) closeFloating();
      if (n !== null && its.length) { e.preventDefault(); its[(n + its.length) % its.length].focus(); }
    }
    // 메뉴 버튼에서 ↓ 로 열기
    const mt = e.target.closest && e.target.closest('[aria-haspopup="menu"]');
    if (mt && (e.key === 'ArrowDown') && mt.getAttribute('aria-controls')) {
      e.preventDefault();
      const panel = doc.getElementById(mt.getAttribute('aria-controls'));
      if (panel) { openFloating(mt, panel); const f = menuItems(panel)[0]; if (f) f.focus(); }
    }
  });

  /* ======================================================================
     5. 전역 키: Esc · ⌘K · Tab 트랩
     ====================================================================== */
  doc.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && !e.altKey && (e.key === 'k' || e.key === 'K')) {
      const c = mainCommand();
      if (c) { e.preventDefault(); if (layers.includes(c)) closeLayer(c); else openLayer(c); }
      return;
    }
    if (e.key === 'Escape') {
      if (floating) { e.preventDefault(); closeFloating(true); return; }
      if (layers.length) { e.preventDefault(); closeLayer(layers[layers.length - 1]); return; }
      $$('.tip').forEach((t) => { if (t.matches(':hover, :focus-within')) t.classList.add('is-suppressed'); });
      return;
    }
    if (e.key === 'Tab' && layers.length) trapTab(e, layers[layers.length - 1]);
  });
  // 툴팁: Esc로 숨긴 뒤 떠나면 원상복구
  ['mouseout', 'focusout'].forEach((ev) => doc.addEventListener(ev, (e) => {
    const t = e.target.closest && e.target.closest('.tip');
    if (t && !t.contains(e.relatedTarget)) t.classList.remove('is-suppressed');
  }));

  /* ======================================================================
     6. 탭
     ====================================================================== */
  function initTabs(list) {
    const tabs = $$('[role="tab"]', list).filter((t) => t.closest('[role="tablist"]') === list);
    if (!tabs.length) return;
    const usable = () => tabs.filter((t) => !t.disabled && t.getAttribute('aria-disabled') !== 'true');
    function select(tab, focus) {
      tabs.forEach((t) => {
        const on = t === tab;
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        t.tabIndex = on ? 0 : -1;
        const p = doc.getElementById(t.getAttribute('aria-controls'));
        if (p) p.hidden = !on;
      });
      if (focus) { tab.focus(); tab.scrollIntoView({ block: 'nearest', inline: 'nearest' }); }
      list.dispatchEvent(new CustomEvent('jj:tab', { bubbles: true, detail: { tab } }));
      refitWithin(doc.getElementById(tab.getAttribute('aria-controls')));
    }
    tabs.forEach((t) => t.addEventListener('click', () => { if (usable().includes(t)) select(t); }));
    list.addEventListener('keydown', (e) => {
      const u = usable();
      const i = u.indexOf(doc.activeElement);
      if (i < 0) return;
      const vertical = list.getAttribute('aria-orientation') === 'vertical';
      let n = null;
      if (e.key === (vertical ? 'ArrowDown' : 'ArrowRight')) n = i + 1;
      else if (e.key === (vertical ? 'ArrowUp' : 'ArrowLeft')) n = i - 1;
      else if (e.key === 'Home') n = 0;
      else if (e.key === 'End') n = u.length - 1;
      if (n === null) return;
      e.preventDefault();
      select(u[(n + u.length) % u.length], true);
    });
    select(tabs.find((t) => t.getAttribute('aria-selected') === 'true') || usable()[0], false);
  }

  /* ======================================================================
     7. 아코디언
     ====================================================================== */
  function initAccordion(box) {
    const single = box.getAttribute('data-accordion') === 'single';
    const heads = $$('.acc__head', box);
    const panelOf = (h) => doc.getElementById(h.getAttribute('aria-controls'));
    heads.forEach((h) => {
      const p = panelOf(h);
      if (p) p.hidden = h.getAttribute('aria-expanded') !== 'true';
      h.addEventListener('click', () => {
        if (h.getAttribute('aria-disabled') === 'true') return;
        const open = h.getAttribute('aria-expanded') !== 'true';
        if (single && open) heads.forEach((o) => { if (o !== h) { o.setAttribute('aria-expanded', 'false'); const op = panelOf(o); if (op) op.hidden = true; } });
        h.setAttribute('aria-expanded', open ? 'true' : 'false');
        if (p) p.hidden = !open;
      });
    });
  }

  /* ======================================================================
     8. 토스트 — 아래에서 올라오는 풀폭 띠, 4.5초, hover·focus 시 멈춤
     ====================================================================== */
  function toastZone() {
    let z = $('.toasts[data-toast-zone]') || $$('.toasts').find((t) => !t.classList.contains('toasts--static'));
    if (!z) {
      z = doc.createElement('div');
      z.className = 'toasts';
      z.setAttribute('role', 'region');
      z.setAttribute('aria-label', '알림');
      doc.body.appendChild(z);
    }
    return z;
  }
  function toast(opts) {
    const o = typeof opts === 'string' ? { text: opts } : (opts || {});
    const z = toastZone();
    while (z.children.length >= 3) z.firstElementChild.remove();
    const t = doc.createElement('div');
    t.className = `toast${o.tone ? ` toast--${o.tone}` : ''}${reduced() ? '' : ' is-entering'}`;
    if (o.stage) t.dataset.stage = o.stage;
    t.setAttribute('role', o.tone === 'danger' ? 'alert' : 'status');
    t.innerHTML = `<span class="toast__sym" aria-hidden="true"><span class="sym"></span></span>`
      + `<div class="toast__body">${o.title ? '<strong class="toast__title"></strong>' : ''}<span class="toast__text"></span>${o.id ? '<span class="toast__id"></span>' : ''}</div>`
      + `<div class="toast__end"><button class="toast__close" type="button" aria-label="알림 닫기">${ICON_X}</button></div>`
      + '<span class="toast__timer" aria-hidden="true"></span>';
    if (o.title) $('.toast__title', t).textContent = o.title;
    $('.toast__text', t).textContent = o.text || '';
    if (o.id) $('.toast__id', t).textContent = o.id;
    z.appendChild(t);
    const dur = o.duration || 4500;
    let left = dur;
    let started = Date.now();
    let timer = null;
    const remove = () => {
      clearTimeout(timer);
      if (reduced()) { t.remove(); return; }
      t.classList.remove('is-entering');
      t.classList.add('is-leaving');
      setTimeout(() => t.remove(), 330);
    };
    const run = () => { started = Date.now(); timer = setTimeout(remove, left); };
    const pause = () => { clearTimeout(timer); left -= Date.now() - started; };
    t.style.setProperty('--dur-toast', `${dur}ms`);
    t.addEventListener('mouseenter', pause);
    t.addEventListener('mouseleave', run);
    t.addEventListener('focusin', pause);
    t.addEventListener('focusout', (e) => { if (!t.contains(e.relatedTarget)) run(); });
    $('.toast__close', t).addEventListener('click', remove);
    run();
    return t;
  }
  function toastFrom(el) {
    return toast({ text: el.dataset.toast, title: el.dataset.toastTitle, stage: el.dataset.toastStage, tone: el.dataset.toastTone, id: el.dataset.toastId });
  }
  doc.addEventListener('click', (e) => {
    const dismiss = e.target.closest('[data-dismiss]');
    if (dismiss) {
      const box = dismiss.closest('.alert, .toast, [data-dismissible]');
      if (box) { if (box.classList.contains('toast') && !box.classList.contains('toast--static')) box.remove(); else box.hidden = true; }
      return;
    }
    const busy = e.target.closest('[data-busy-demo]');
    if (busy) {
      if (busy.getAttribute('aria-busy') === 'true') return;
      e.preventDefault();
      busy.setAttribute('aria-busy', 'true');
      const live = busy.getAttribute('aria-label');
      busy.setAttribute('aria-label', '처리하는 중');
      setTimeout(() => {
        busy.removeAttribute('aria-busy');
        if (live) busy.setAttribute('aria-label', live); else busy.removeAttribute('aria-label');
        if (busy.dataset.toast) toastFrom(busy);
      }, parseInt(busy.dataset.busyDemo, 10) || 1400);
      return;
    }
    const tt = e.target.closest('[data-toast]');
    if (tt && !tt.closest('[role="menu"]') && !tt.matches('.cmd__item')) toastFrom(tt);
  });

  /* ======================================================================
     9. 캐러셀 — 한 장씩, 띠 와이프
     ====================================================================== */
  function initCarousel(box) {
    const slides = $$('.carousel__slide', box);
    if (!slides.length) return;
    const count = $('[data-carousel-count]', box);
    const dots = $$('.carousel__dot', box);
    const viewport = $('.carousel__viewport', box) || box;
    viewport.setAttribute('aria-live', 'polite');
    let i = Math.max(0, slides.findIndex((s) => !s.hidden));
    slides.forEach((s, n) => {
      s.setAttribute('role', 'group');
      s.setAttribute('aria-roledescription', '장');
      if (!s.getAttribute('aria-label')) s.setAttribute('aria-label', `${n + 1} / ${slides.length}`);
    });
    function show(n, animate) {
      i = (n + slides.length) % slides.length;
      slides.forEach((s, k) => { s.hidden = k !== i; s.classList.remove('is-entering'); });
      if (animate && !reduced()) { void slides[i].offsetWidth; slides[i].classList.add('is-entering'); }
      if (count) count.innerHTML = `<b>${i + 1}</b> / ${slides.length}`;
      dots.forEach((d, k) => d.setAttribute('aria-current', k === i ? 'true' : 'false'));
      refitWithin(slides[i]);
    }
    box.addEventListener('click', (e) => {
      if (e.target.closest('[data-carousel-prev]')) show(i - 1, true);
      else if (e.target.closest('[data-carousel-next]')) show(i + 1, true);
      else { const d = e.target.closest('.carousel__dot'); if (d) show(dots.indexOf(d), true); }
    });
    box.addEventListener('keydown', (e) => {
      if (e.target.matches('input, textarea')) return;
      if (e.key === 'ArrowRight') { e.preventDefault(); show(i + 1, true); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); show(i - 1, true); }
    });
    show(i, false);
  }

  /* ======================================================================
     10. 마퀴 — 내용 복제(이음매 없는 흐름) + 일시정지 버튼
     ====================================================================== */
  function initMarquee(m) {
    const track = $('.marquee__track', m);
    const group = track && $('.marquee__group', track);
    if (group && $$('.marquee__group', track).length === 1) {
      const clone = group.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      $$('a, button', clone).forEach((x) => x.setAttribute('tabindex', '-1'));
      track.appendChild(clone);
    }
    const btn = $('[data-marquee-toggle]', m);
    if (btn) {
      btn.addEventListener('click', () => {
        const paused = !m.classList.contains('is-paused');
        m.classList.toggle('is-paused', paused);
        btn.setAttribute('aria-pressed', paused ? 'true' : 'false');
        btn.setAttribute('aria-label', paused ? '전광판 다시 흐르게' : '전광판 멈추기');
      });
    }
  }

  /* ======================================================================
     11. 빌링 줄 양끝 맞춤 [data-fit]
         font-stretch(75~125%)를 먼저, 그다음 font-size로 띠 폭을 꽉 채운다.
         모바일(≤ 640px)에서는 T1·T2 줄만 맞춘다.
     ====================================================================== */
  const fitEls = new Set();
  const tierOf = (el) => (el.classList.contains('bill--t1') ? 1 : el.classList.contains('bill--t2') ? 2 : el.classList.contains('bill--t3') ? 3 : 4);
  function measure(el) {
    const r = doc.createRange();
    r.selectNodeContents(el);
    return r.getBoundingClientRect().width;
  }
  function fitOne(el) {
    el.style.fontSize = '';
    el.style.fontStretch = '';
    el.classList.remove('is-fit');
    if (!isVisible(el)) return;
    if (innerWidth <= 640 && tierOf(el) > 2) return;
    const cs = getComputedStyle(el);
    const avail = el.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    if (avail <= 0) return;
    el.style.textAlign = 'left';
    el.style.textAlignLast = 'auto';
    const base = parseFloat(cs.fontSize);
    const w0 = measure(el);
    if (!w0) { el.style.textAlign = ''; el.style.textAlignLast = ''; return; }
    const stretch = Math.max(75, Math.min(125, (100 * avail) / w0));
    el.style.fontStretch = `${stretch.toFixed(1)}%`;
    const w1 = measure(el) || w0;
    const maxK = parseFloat(el.dataset.fitMax) || 1.6;
    const minK = parseFloat(el.dataset.fitMin) || 0.4;
    let size = Math.max(base * minK, Math.min(base * maxK, (base * avail) / w1));
    el.style.fontSize = `${size.toFixed(2)}px`;
    const w2 = measure(el);
    if (w2 > avail) { size = (size * avail) / w2 * 0.995; el.style.fontSize = `${size.toFixed(2)}px`; }
    el.style.textAlign = '';
    el.style.textAlignLast = '';
    el.classList.add('is-fit');
  }
  const lastW = new WeakMap();
  let fitQueued = false;
  function refit() {
    if (fitQueued) return;
    fitQueued = true;
    requestAnimationFrame(() => { fitQueued = false; fitEls.forEach(fitOne); });
  }
  function refitWithin(scope) { if (scope) $$('[data-fit]', scope).forEach(fitOne); }
  const ro = 'ResizeObserver' in window ? new ResizeObserver((entries) => {
    let changed = false;
    entries.forEach((en) => {
      const w = Math.round(en.contentRect.width);
      if (lastW.get(en.target) !== w) { lastW.set(en.target, w); changed = true; }
    });
    if (changed) refit();
  }) : null;
  function initFit(el) {
    fitEls.add(el);
    if (ro && el.parentElement) ro.observe(el.parentElement);
  }
  if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(refit);
  addEventListener('resize', refit);

  /* ======================================================================
     12. 등장 와이프 [data-reveal] · 묶음 [data-reveal-group] (자식 줄마다 70ms)
     ====================================================================== */
  function initReveal(scope) {
    $$('[data-reveal-group]', scope).forEach((g) => {
      Array.from(g.children).forEach((c, n) => { if (!c.hasAttribute('data-reveal')) c.setAttribute('data-reveal', ''); c.style.setProperty('--i', n); });
    });
    const els = $$('[data-reveal]', scope);
    if (reduced() || !('IntersectionObserver' in window)) { els.forEach((e) => e.classList.add('is-in')); return; }
    const io = new IntersectionObserver((ents) => {
      ents.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.01 });
    els.forEach((e) => io.observe(e));
  }

  /* ======================================================================
     13. 카운트업 [data-count="1284"] — 한 번만, 600ms
     ====================================================================== */
  const fmt = (n, d) => n.toLocaleString('ko-KR', { minimumFractionDigits: d, maximumFractionDigits: d });
  function initCount(el) {
    const target = parseFloat(el.dataset.count);
    if (Number.isNaN(target)) return;
    const dec = (el.dataset.count.split('.')[1] || '').length;
    const final = el.textContent;
    if (reduced() || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver((ents) => {
      if (!ents.some((x) => x.isIntersecting)) return;
      io.disconnect();
      const t0 = performance.now();
      const step = (now) => {
        const p = Math.min(1, (now - t0) / 600);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = p < 1 ? fmt(target * eased, dec) : final;
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
    io.observe(el);
  }

  /* ======================================================================
     14. 표 정렬 — th 안 .table__sort 버튼, aria-sort
     ====================================================================== */
  function initSort(btn) {
    btn.addEventListener('click', () => {
      const th = btn.closest('th');
      const table = btn.closest('table');
      const tbody = table && table.tBodies[0];
      if (!th || !tbody) return;
      const col = th.cellIndex;
      const asc = th.getAttribute('aria-sort') !== 'ascending';
      $$('th[aria-sort]', table).forEach((h) => h.setAttribute('aria-sort', 'none'));
      th.setAttribute('aria-sort', asc ? 'ascending' : 'descending');
      const type = btn.dataset.sort || 'text';
      const val = (row) => {
        const cell = row.cells[col];
        if (!cell) return '';
        const raw = cell.dataset.value != null ? cell.dataset.value : cell.textContent.trim();
        return type === 'num' ? parseFloat(String(raw).replace(/[^0-9.-]/g, '')) || 0 : raw;
      };
      const rows = Array.from(tbody.rows);
      rows.sort((a, b) => {
        const x = val(a); const y = val(b);
        const r = type === 'num' ? x - y : String(x).localeCompare(String(y), 'ko');
        return asc ? r : -r;
      });
      rows.forEach((r) => tbody.appendChild(r));
      const live = table.closest('.table-wrap') && $('[data-sort-live]', table.closest('.table-wrap').parentElement);
      if (live) live.textContent = `${btn.textContent.trim()} ${asc ? '오름차순' : '내림차순'}으로 정렬했어요`;
    });
  }

  /* ======================================================================
     15. 칸반 — ←/→ 열 이동 · ↑/↓ 카드 사이 이동 · 마우스 끌기 · aria-live 안내
     ====================================================================== */
  function initKanban(board) {
    const cols = $$('.kanban__col', board);
    let live = $('.kanban__live', board.parentElement) || $('.kanban__live', board);
    if (!live) {
      live = doc.createElement('p');
      live.className = 'kanban__live';
      live.setAttribute('aria-live', 'polite');
      board.after(live);
    }
    const listOf = (col) => $('.kanban__list', col);
    const nameOf = (col) => { const t = $('.kanban__title', col); return t ? t.textContent.trim() : ''; };
    function sync() {
      cols.forEach((c) => {
        const n = $$('.kcard', listOf(c)).length;
        const cnt = $('.kanban__count', c);
        if (cnt) cnt.textContent = n;
        const done = c.dataset.col === 'done';
        $$('.kcard', c).forEach((k) => k.classList.toggle('kcard--done', done));
      });
    }
    function move(card, toCol, focus) {
      const from = card.closest('.kanban__col');
      if (!toCol || toCol === from) return;
      listOf(toCol).appendChild(card);
      sync();
      if (!reduced()) { card.classList.remove('is-moved'); void card.offsetWidth; card.classList.add('is-moved'); }
      if (focus) card.focus();
      const id = $('.kcard__id', card);
      live.textContent = `${id ? id.textContent.trim() : '작업'} · ${nameOf(from)}에서 ${nameOf(toCol)}(으)로 옮겼어요. ${nameOf(toCol)} ${$$('.kcard', toCol).length}장`;
    }
    $$('.kcard', board).forEach((card) => {
      card.tabIndex = 0;
      card.setAttribute('draggable', 'true');
      if (!card.getAttribute('aria-describedby') && $('.kanban__hint', board.parentElement)) {
        const h = $('.kanban__hint', board.parentElement);
        if (!h.id) h.id = uid('kanban-hint');
        card.setAttribute('aria-describedby', h.id);
      }
      card.addEventListener('keydown', (e) => {
        const col = card.closest('.kanban__col');
        const ci = cols.indexOf(col);
        if (e.key === 'ArrowRight') { e.preventDefault(); move(card, cols[ci + 1], true); }
        else if (e.key === 'ArrowLeft') { e.preventDefault(); move(card, cols[ci - 1], true); }
        else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
          e.preventDefault();
          const sib = e.key === 'ArrowDown' ? card.nextElementSibling : card.previousElementSibling;
          if (sib) sib.focus();
        }
      });
      card.addEventListener('dragstart', (e) => {
        card.classList.add('is-dragging');
        e.dataTransfer.effectAllowed = 'move';
        try { e.dataTransfer.setData('text/plain', card.id || ''); } catch (err) { /* noop */ }
        board._drag = card;
      });
      card.addEventListener('dragend', () => { card.classList.remove('is-dragging'); board._drag = null; $$('.kanban__list', board).forEach((l) => l.classList.remove('is-over')); });
    });
    cols.forEach((col) => {
      const list = listOf(col);
      if (!list) return;
      list.addEventListener('dragover', (e) => { if (board._drag) { e.preventDefault(); list.classList.add('is-over'); } });
      list.addEventListener('dragleave', (e) => { if (!list.contains(e.relatedTarget)) list.classList.remove('is-over'); });
      list.addEventListener('drop', (e) => { e.preventDefault(); list.classList.remove('is-over'); if (board._drag) move(board._drag, col, false); });
    });
    sync();
  }

  /* ======================================================================
     16. 달력 — 날짜 단일 선택
     ====================================================================== */
  function initCalendar(cal) {
    const out = $('[data-cal-output]', cal);
    cal.addEventListener('click', (e) => {
      const d = e.target.closest('button.cal__day');
      if (!d || d.disabled) return;
      $$('button.cal__day', cal).forEach((b) => b.setAttribute('aria-pressed', b === d ? 'true' : 'false'));
      if (out) out.textContent = d.dataset.label || d.textContent.trim();
      cal.dispatchEvent(new CustomEvent('jj:date', { bubbles: true, detail: { label: d.dataset.label } }));
    });
  }

  /* ======================================================================
     17. 폼 검증 form[data-validate] — aria-invalid + .field.is-invalid + 첫 오류로 포커스
     ====================================================================== */
  function fieldOf(input) { return input.closest('.field, .check, .fieldset'); }
  function setInvalid(input, bad) {
    input.setAttribute('aria-invalid', bad ? 'true' : 'false');
    const f = fieldOf(input);
    if (f) f.classList.toggle('is-invalid', bad);
    const err = f && $('.field__error', f.closest('.field') || f);
    if (err) {
      if (!err.id) err.id = uid('err');
      const ids = (input.getAttribute('aria-describedby') || '').split(/\s+/).filter(Boolean);
      if (bad && !ids.includes(err.id)) ids.push(err.id);
      input.setAttribute('aria-describedby', ids.filter((x) => bad || x !== err.id).join(' '));
      err.classList.toggle('is-shown', bad);
    }
  }
  function initForm(form) {
    const controls = () => $$('input, select, textarea', form).filter((c) => !c.disabled && c.type !== 'hidden' && (c.required || c.pattern || c.minLength > 0 || c.type === 'email'));
    form.setAttribute('novalidate', '');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let first = null;
      controls().forEach((c) => { const bad = !c.checkValidity(); setInvalid(c, bad); if (bad && !first) first = c; });
      if (first) {
        first.focus();
        if (form.dataset.errorToast) toast({ text: form.dataset.errorToast, tone: 'danger' });
        return;
      }
      const submit = form.querySelector('[type="submit"]');
      const done = () => { if (form.dataset.successToast) toast({ text: form.dataset.successToast, tone: 'success', id: form.dataset.successId }); form.dispatchEvent(new CustomEvent('jj:submit', { bubbles: true })); };
      if (submit) {
        submit.setAttribute('aria-busy', 'true');
        setTimeout(() => { submit.removeAttribute('aria-busy'); done(); }, 900);
      } else done();
    });
    form.addEventListener('input', (e) => { const c = e.target; if (c.getAttribute('aria-invalid') === 'true') setInvalid(c, !c.checkValidity()); });
    form.addEventListener('focusout', (e) => { const c = e.target; if (c.matches && c.matches('input, select, textarea') && c.value && (c.pattern || c.type === 'email' || c.type === 'tel')) setInvalid(c, !c.checkValidity()); });
  }

  /* ======================================================================
     18. 단계 넘김 [data-stepper] — 패널 [data-step], 버튼 [data-step-next|prev|go]
     ====================================================================== */
  function initStepper(box) {
    const panels = $$('[data-step]', box);
    const items = $$('.steps__item', box);
    const count = $('[data-step-count]', box);
    let cur = Math.max(0, panels.findIndex((p) => !p.hidden));
    function go(n, focus) {
      cur = Math.max(0, Math.min(panels.length - 1, n));
      panels.forEach((p, k) => { p.hidden = k !== cur; });
      items.forEach((it, k) => {
        it.removeAttribute('aria-current');
        it.dataset.state = k < cur ? 'done' : k === cur ? 'current' : 'next';
        if (k === cur) it.setAttribute('aria-current', 'step');
      });
      if (count) count.textContent = `${cur + 1} / ${panels.length}`;
      if (focus) { const h = $('h1, h2, h3, [tabindex="-1"]', panels[cur]); if (h) { if (!h.hasAttribute('tabindex')) h.setAttribute('tabindex', '-1'); h.focus(); } }
      refitWithin(panels[cur]);
      box.dispatchEvent(new CustomEvent('jj:step', { bubbles: true, detail: { index: cur } }));
    }
    box.addEventListener('click', (e) => {
      if (e.target.closest('[data-step-next]')) { e.preventDefault(); go(cur + 1, true); }
      else if (e.target.closest('[data-step-prev]')) { e.preventDefault(); go(cur - 1, true); }
      else { const g = e.target.closest('[data-step-go]'); if (g) { e.preventDefault(); go(parseInt(g.dataset.stepGo, 10) - 1, true); } }
    });
    if (panels.length) go(cur, false);
  }

  /* ======================================================================
     19. 찜·고르기 토글 [data-pick] (aria-pressed) + [data-pick-group]의 [data-pick-count]
         스위치 [role="switch"] · 복사 [data-copy] · 진행 막대 · 모션 실연 · 가로 스크롤 힌트
     ====================================================================== */
  function syncPick(group) {
    const n = $$('[data-pick][aria-pressed="true"]', group).length;
    $$('[data-pick-count]', group).forEach((c) => { c.textContent = n; });
  }
  doc.addEventListener('click', (e) => {
    const pick = e.target.closest('[data-pick]');
    if (pick && !pick.disabled) {
      const on = pick.getAttribute('aria-pressed') !== 'true';
      pick.setAttribute('aria-pressed', on ? 'true' : 'false');
      const g = pick.closest('[data-pick-group]');
      if (g) syncPick(g);
      const label = on ? pick.dataset.pickOn : pick.dataset.pickOff;
      if (label) toast({ text: label, stage: pick.dataset.stage || pick.dataset.toastStage });
      return;
    }
    const sw = e.target.closest('[role="switch"]');
    if (sw && !sw.disabled) {
      const on = sw.getAttribute('aria-checked') !== 'true';
      sw.setAttribute('aria-checked', on ? 'true' : 'false');
      const st = $('.switch__state', sw);
      if (st) st.textContent = on ? '켜짐' : '꺼짐';
      return;
    }
    const cp = e.target.closest('[data-copy]');
    if (cp) {
      const sel = cp.getAttribute('data-copy');
      const src = sel ? doc.querySelector(sel) : cp.closest('.code') && $('pre', cp.closest('.code'));
      const text = src ? src.textContent : '';
      const done = () => {
        const old = cp.textContent;
        cp.textContent = '복사됨';
        cp.classList.add('is-done');
        setTimeout(() => { cp.textContent = old; cp.classList.remove('is-done'); }, 1600);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, done);
      else done();
      return;
    }
    const play = e.target.closest('[data-motion-play]');
    if (play) {
      const cell = play.closest('.motion__cell');
      if (!cell) return;
      cell.classList.remove('is-playing');
      void cell.offsetWidth;
      cell.classList.add('is-playing');
      clearTimeout(cell._t);
      cell._t = setTimeout(() => cell.classList.remove('is-playing'), 1400);
    }
  });
  function setProgress(bar, value) {
    const max = parseFloat(bar.getAttribute('aria-valuemax')) || 100;
    bar.setAttribute('aria-valuenow', value);
    const box = bar.closest('.progress') || bar;
    box.style.setProperty('--val', `${(value / max) * 100}%`);
  }
  function initScrollHint(el) {
    const upd = () => el.classList.toggle('has-more', el.scrollWidth - el.clientWidth - el.scrollLeft > 4);
    el.addEventListener('scroll', upd, { passive: true });
    addEventListener('resize', upd);
    upd();
    el._hint = upd;
  }

  /* ======================================================================
     20. 초기화
     ====================================================================== */
  function init(scope = doc) {
    $$('[data-command]', scope).forEach(initCommand);
    $$('[role="tablist"]', scope).forEach(initTabs);
    $$('[data-accordion]', scope).forEach(initAccordion);
    $$('[data-carousel]', scope).forEach(initCarousel);
    $$('[data-marquee]', scope).forEach(initMarquee);
    $$('[data-fit]', scope).forEach(initFit);
    $$('[data-count]', scope).forEach(initCount);
    $$('.table__sort', scope).forEach(initSort);
    $$('[data-kanban]', scope).forEach(initKanban);
    $$('[data-calendar]', scope).forEach(initCalendar);
    $$('form[data-validate]', scope).forEach(initForm);
    $$('[data-stepper]', scope).forEach(initStepper);
    $$('[data-pick-group]', scope).forEach(syncPick);
    $$('.scroll-x, .tabs__list, .kanban-wrap', scope).forEach(initScrollHint);
    $$('[role="progressbar"][aria-valuenow]', scope).forEach((b) => { const box = b.closest('.progress') || b; if (!box.style.getPropertyValue('--val')) setProgress(b, parseFloat(b.getAttribute('aria-valuenow'))); });
    // 닫힌 상태로 시작하는 층·떠 있는 판은 hidden 보장 (정적 견본 제외)
    $$('.modal:not(.modal--static), .drawer:not(.drawer--static), .cmd:not(.cmd--static)', scope).forEach((l) => { if (!l.classList.contains('is-open')) l.hidden = true; });
    initReveal(scope);
    refit();
  }
  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', () => init());
  else init();
  window.JJ = { toast, open: openLayer, close: closeLayer, setTheme, refit, setProgress, init };
}());
