/* ==========================================================================
   오선음악당 OSEON HALL — app.js (바닐라, 외부 라이브러리 없음)
   1 테마 · 2 그리드 오버레이 · 3 레이어(모달/드로어/커맨드/사이드 드로어) ·
   4 커맨드 팔레트 · 5 탭 · 6 아코디언 · 7 토스트 · 8 팝오버 · 9 메뉴 · 10 툴팁 ·
   11 캐러셀 · 12 마퀴 · 13 rule-draw / grid-set · 14 폼 · 15 달력 · 16 칸반 ·
   17 표 · 18 스크롤 힌트 · 19 내비 · 20 단계 마법사 · 21 보기 전환 · 22 코드 ·
   23 페이지네이션 · 24 기타(알림 닫기, 로딩 시연)
   마크업 계약은 COMPONENTS.md.
   ========================================================================== */
(() => {
  'use strict';

  const doc = document;
  const root = doc.documentElement;
  const STORE_KEY = 'oseon-theme';
  const $ = (sel, ctx = doc) => ctx.querySelector(sel);
  const $$ = (sel, ctx = doc) => Array.from(ctx.querySelectorAll(sel));
  const byId = (id) => (id ? doc.getElementById(id) : null);
  const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTyping = (el) => !!el && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName));
  let uid = 0;
  const ensureId = (el, prefix) => { if (!el.id) el.id = `${prefix}-${++uid}`; return el.id; };
  const FOCUSABLE = 'a[href], area[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
  const focusables = (ctx) => $$(FOCUSABLE, ctx).filter((el) => el.offsetParent !== null || el === doc.activeElement);

  root.classList.add('js');

  const store = {
    get() { try { return localStorage.getItem(STORE_KEY); } catch (e) { return null; } },
    set(v) { try { localStorage.setItem(STORE_KEY, v); } catch (e) { /* 저장 불가 환경 */ } },
  };

  /* ------------------------------------------------------------------------
     1. 테마 — 우선순위: ?theme= → localStorage → prefers-color-scheme
     ------------------------------------------------------------------------ */
  const scheme = window.matchMedia('(prefers-color-scheme: dark)');
  const valid = (t) => (t === 'dark' || t === 'light' ? t : null);
  const queryTheme = () => valid(new URLSearchParams(window.location.search).get('theme'));
  const resolveTheme = () => queryTheme() || valid(store.get()) || (scheme.matches ? 'dark' : 'light');

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    $$('[data-theme-toggle]').forEach((btn) => {
      const dark = theme === 'dark';
      btn.setAttribute('aria-pressed', String(dark));
      if (!btn.hasAttribute('aria-label') && !btn.textContent.trim()) btn.setAttribute('aria-label', '밤 화면');
      const label = $('[data-theme-label]', btn);
      if (label) label.textContent = dark ? '밤' : '낮';
    });
  }
  applyTheme(resolveTheme());
  const onScheme = () => { if (!queryTheme() && !valid(store.get())) applyTheme(resolveTheme()); };
  if (scheme.addEventListener) scheme.addEventListener('change', onScheme);

  doc.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-theme-toggle]');
    if (!btn) return;
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    store.set(next);
    applyTheme(next);
  });

  /* ------------------------------------------------------------------------
     2. 그리드 오버레이 — g 키 · [data-grid-toggle]
     ------------------------------------------------------------------------ */
  let overlay = $('.grid-overlay');
  if (!overlay) {
    overlay = doc.createElement('div');
    overlay.className = 'grid-overlay';
    overlay.setAttribute('aria-hidden', 'true');
    doc.body.appendChild(overlay);
  }
  function setGrid(on) {
    root.classList.toggle('grid-on', on);
    $$('[data-grid-toggle]').forEach((b) => b.setAttribute('aria-pressed', String(on)));
  }
  doc.addEventListener('click', (e) => {
    if (e.target.closest('[data-grid-toggle]')) setGrid(!root.classList.contains('grid-on'));
  });

  /* ------------------------------------------------------------------------
     13. rule-draw · grid-set (레이어가 쓰므로 먼저 정의)
     ------------------------------------------------------------------------ */
  function drawRules(els) {
    const groups = new Map();
    els.forEach((el) => {
      const key = el.closest('.plate, [data-layer], .card, section') || doc.body;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(el);
    });
    groups.forEach((list) => {
      list.forEach((el, i) => {
        if (!el.style.getPropertyValue('--rule-delay')) el.style.setProperty('--rule-delay', `${Math.min(i, 5) * 60}ms`);
        el.classList.add('is-drawn');
      });
    });
  }
  function redraw(ctx) {
    const rules = $$('[data-rule]', ctx);
    rules.forEach((el) => { el.classList.remove('is-drawn'); el.style.removeProperty('--rule-delay'); });
    void (ctx.offsetWidth);
    requestAnimationFrame(() => requestAnimationFrame(() => drawRules(rules)));
  }
  /* 점진적 향상: 기본(CSS)은 "그려진 상태". JS 가 로드 시점에 뷰포트 안이거나 위에 있는 선은 즉시 그려진
     것으로 두고, 아직 아래에 있는 장식 선만 대기(.js-motion 아래 scaleX(0))로 돌린다.
     데이터 막대(불릿·일별 막대)는 길이가 곧 데이터라 한 번도 숨기지 않는다 — 들어올 때 WAAPI 로 한 번 그어질 뿐.
     인쇄·IO 미지원·감속 모션에서는 전부 그려진 상태. */
  const DATA_BAR = '.bullet__bar, .bars__bar, [data-rule-data]';
  const ruleTargets = $$('[data-rule]').filter((el) => !el.closest('[data-layer]'));
  const gridTargets = $$('.plate--grid, .gridlines[data-grid-set]');
  const belowFold = (el) => el.getBoundingClientRect().top >= window.innerHeight;
  const drawAll = () => {
    $$('[data-rule]').forEach((el) => el.classList.add('is-drawn'));
    gridTargets.forEach((el) => el.classList.add('is-set'));
  };
  const cssMs = (name, fb) => { const v = parseFloat(getComputedStyle(root).getPropertyValue(name)); return Number.isFinite(v) ? v : fb; };
  function sweep(el, i) {
    if (!el.animate) return;
    const v = el.getAttribute('data-rule') === 'v';
    el.animate([{ transform: v ? 'scaleY(0)' : 'scaleX(0)' }, { transform: 'none' }], {
      duration: cssMs('--dur-3', 480),
      delay: Math.min(i, 9) * 40,
      easing: getComputedStyle(root).getPropertyValue('--ease-rule').trim() || 'ease-out',
    });
  }
  const motionOK = 'IntersectionObserver' in window && !reduced() && !window.matchMedia('print').matches;
  if (motionOK) {
    const pendingRules = [];
    const enterBars = [];
    ruleTargets.forEach((el) => {
      if (el.matches(DATA_BAR)) { el.classList.add('is-drawn'); if (belowFold(el)) enterBars.push(el); }
      else if (belowFold(el)) pendingRules.push(el);
      else el.classList.add('is-drawn');
    });
    const pendingGrids = gridTargets.filter((el) => { if (belowFold(el)) return true; el.classList.add('is-set'); return false; });
    root.classList.add('js-motion');
    const io = new IntersectionObserver((entries) => {
      const rules = [];
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        io.unobserve(en.target);
        if (en.target.hasAttribute('data-rule')) rules.push(en.target);
        else en.target.classList.add('is-set');
      });
      if (rules.length) drawRules(rules);
    }, { threshold: 0.3 });
    pendingRules.forEach((el) => io.observe(el));
    pendingGrids.forEach((el) => io.observe(el));
    const barIo = new IntersectionObserver((entries) => {
      let i = 0;
      entries.forEach((en) => { if (!en.isIntersecting) return; barIo.unobserve(en.target); sweep(en.target, i++); });
    }, { threshold: 0 });
    enterBars.forEach((el) => barIo.observe(el));
    window.addEventListener('beforeprint', () => { drawAll(); root.classList.remove('js-motion'); });
  } else {
    drawAll();
  }

  doc.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-motion-replay]');
    if (!btn) return;
    const target = byId(btn.getAttribute('aria-controls')) || btn.closest('.motion, .plate') || doc.body;
    redraw(target);
  });

  /* ------------------------------------------------------------------------
     3. 레이어 — [data-layer] (모달·드로어·커맨드·사이드 드로어)
        열기 [data-open="id"] · 닫기 [data-close] · Esc · 포커스 트랩 · 포커스 복귀
     ------------------------------------------------------------------------ */
  const stack = [];
  function openLayer(layer, opener) {
    if (!layer || stack.some((s) => s.layer === layer)) return;
    closeFloating();
    layer.hidden = false;
    layer.classList.add('is-open');
    stack.push({ layer, opener: opener || doc.activeElement });
    root.classList.add('is-locked');
    $$('[data-open]').forEach((b) => { if (b.getAttribute('data-open') === layer.id) b.setAttribute('aria-expanded', 'true'); });
    redraw(layer);
    const first = $('[data-autofocus]', layer) || focusables(layer).find((el) => !el.hasAttribute('data-close') || el.tagName === 'INPUT') || focusables(layer)[0];
    requestAnimationFrame(() => { (first || layer).focus({ preventScroll: true }); });
    layer.dispatchEvent(new CustomEvent('layer:open', { bubbles: true }));
  }
  function closeLayer(layer) {
    const idx = stack.findIndex((s) => s.layer === layer);
    if (idx < 0) return;
    const [{ opener }] = stack.splice(idx, 1);
    layer.classList.remove('is-open');
    if (layer.getAttribute('data-layer') !== 'side') layer.hidden = true;
    $$('[data-open]').forEach((b) => { if (b.getAttribute('data-open') === layer.id) b.setAttribute('aria-expanded', 'false'); });
    if (!stack.length) root.classList.remove('is-locked');
    if (opener && opener.focus && doc.contains(opener)) opener.focus({ preventScroll: true });
    layer.dispatchEvent(new CustomEvent('layer:close', { bubbles: true }));
  }
  const topLayer = () => (stack.length ? stack[stack.length - 1].layer : null);

  doc.addEventListener('click', (e) => {
    const opener = e.target.closest('[data-open]');
    if (opener) {
      const layer = byId(opener.getAttribute('data-open'));
      if (layer) { e.preventDefault(); openLayer(layer, opener); }
      return;
    }
    const closer = e.target.closest('[data-close]');
    if (closer) {
      const layer = closer.closest('[data-layer]');
      if (layer) { e.preventDefault(); closeLayer(layer); }
      return;
    }
    // 모바일 사이드 드로어 안 같은 화면 앵커(#notify 등): 레이어를 닫고 기본 이동은 그대로 둔다
    const anchor = e.target.closest('a[href^="#"]');
    if (anchor && anchor.getAttribute('href').length > 1) {
      const side = anchor.closest('[data-layer="side"]');
      if (side && stack.some((s) => s.layer === side)) {
        const idx = stack.findIndex((s) => s.layer === side);
        stack[idx].opener = null;   // 닫힌 뒤 트리거로 포커스를 되돌리지 않는다 — 앵커 대상으로 간다
        closeLayer(side);
      }
    }
  });

  /* 같은 화면 앵커 사이드 링크(.side__link[href^="#"]): 스크롤 위치에 따라 aria-current 와 .side-open__now 갱신 */
  (() => {
    const links = $$('.side__link[href^="#"]');
    if (!links.length || !('IntersectionObserver' in window)) return;
    const pairs = links.map((a) => ({ a, t: byId(a.getAttribute('href').slice(1)) })).filter((p) => p.t);
    if (!pairs.length) return;
    const now = $('.side-open__now');
    const setCur = (a) => {
      links.forEach((l) => { if (l === a) l.setAttribute('aria-current', 'true'); else l.removeAttribute('aria-current'); });
      if (now) { const lab = $('.side__label', a); now.textContent = (lab || a).textContent.trim(); }
    };
    const io = new IntersectionObserver((entries) => {
      const vis = entries.filter((en) => en.isIntersecting).sort((x, y) => x.boundingClientRect.top - y.boundingClientRect.top)[0];
      if (vis) { const p = pairs.find((q) => q.t === vis.target); if (p) setCur(p.a); }
    }, { rootMargin: '-20% 0px -60% 0px' });
    pairs.forEach((p) => io.observe(p.t));
    links.forEach((a) => a.addEventListener('click', () => setCur(a)));
  })();

  doc.addEventListener('keydown', (e) => {
    const layer = topLayer();
    if (!layer || e.key !== 'Tab') return;
    const items = focusables(layer);
    if (!items.length) { e.preventDefault(); return; }
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && (doc.activeElement === first || !layer.contains(doc.activeElement))) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && (doc.activeElement === last || !layer.contains(doc.activeElement))) { e.preventDefault(); first.focus(); }
  });

  // 데스크톱으로 넓어지면 사이드 드로어 닫기
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 768) stack.filter((s) => s.layer.getAttribute('data-layer') === 'side').forEach((s) => closeLayer(s.layer));
  });

  /* ------------------------------------------------------------------------
     4. 커맨드 팔레트 — .cmd (⌘K / Ctrl+K 로 [data-layer] 인 것을 연다)
     ------------------------------------------------------------------------ */
  function initCommand(cmd) {
    const input = $('.cmd__input', cmd);
    const list = $('.cmd__list', cmd);
    if (!input || !list) return;
    const items = $$('[role="option"]', list);
    const empty = $('.cmd__empty', cmd);
    items.forEach((it) => {
      ensureId(it, 'cmd-opt');
      const label = $('.cmd__label', it);
      if (label && !label.dataset.raw) label.dataset.raw = label.textContent;
    });
    input.setAttribute('aria-controls', ensureId(list, 'cmd-list'));
    let active = Math.max(0, items.findIndex((it) => it.getAttribute('aria-selected') === 'true'));
    const visible = () => items.filter((it) => !it.hidden);
    function setActive(i) {
      const vis = visible();
      if (!vis.length) { input.removeAttribute('aria-activedescendant'); return; }
      active = (i + vis.length) % vis.length;
      items.forEach((it) => it.setAttribute('aria-selected', 'false'));
      const cur = vis[active];
      cur.setAttribute('aria-selected', 'true');
      input.setAttribute('aria-activedescendant', cur.id);
      // 목록 상자 안에서만 스크롤한다 — scrollIntoView는 창 전체를 끌고 가므로 쓰지 않는다
      if (list.scrollHeight > list.clientHeight) {
        const top = cur.getBoundingClientRect().top - list.getBoundingClientRect().top + list.scrollTop;
        const bottom = top + cur.offsetHeight;
        if (top < list.scrollTop) list.scrollTop = top;
        else if (bottom > list.scrollTop + list.clientHeight) list.scrollTop = bottom - list.clientHeight;
      }
    }
    function escapeHtml(s) { return s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }
    function filter() {
      const q = input.value.trim().toLowerCase();
      items.forEach((it) => {
        const label = $('.cmd__label', it);
        const hay = `${it.textContent} ${it.dataset.keywords || ''}`.toLowerCase();
        it.hidden = q !== '' && !hay.includes(q);
        if (label) {
          const raw = label.dataset.raw;
          const at = q ? raw.toLowerCase().indexOf(q) : -1;
          label.innerHTML = at < 0 ? escapeHtml(raw)
            : `${escapeHtml(raw.slice(0, at))}<mark>${escapeHtml(raw.slice(at, at + q.length))}</mark>${escapeHtml(raw.slice(at + q.length))}`;
        }
      });
      $$('.cmd__group', list).forEach((g) => {
        let n = g.nextElementSibling;
        let any = false;
        while (n && !n.classList.contains('cmd__group')) { if (n.matches('[role="option"]') && !n.hidden) any = true; n = n.nextElementSibling; }
        g.hidden = !any;
      });
      const none = visible().length === 0;
      if (empty) {
        empty.hidden = !none;
        const qEl = $('[data-cmd-query]', empty);
        if (qEl) qEl.textContent = input.value.trim();
      }
      setActive(0);
    }
    function run(it) {
      if (!it || it.getAttribute('aria-disabled') === 'true') return;
      const href = it.dataset.href;
      const link = $('a[href]', it);
      if (href) window.location.href = href;
      else if (link) link.click();
      else {
        toast({ title: (it.querySelector('.cmd__label') || it).textContent.trim(), text: '명령을 실행했습니다.' });
        const layer = cmd.closest('[data-layer]') || (cmd.hasAttribute('data-layer') ? cmd : null);
        if (layer) closeLayer(layer);
      }
    }
    input.addEventListener('input', filter);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') { e.preventDefault(); setActive(active + 1); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(active - 1); }
      else if (e.key === 'Home' && e.ctrlKey) { e.preventDefault(); setActive(0); }
      else if (e.key === 'End' && e.ctrlKey) { e.preventDefault(); setActive(visible().length - 1); }
      else if (e.key === 'Enter') { e.preventDefault(); run(visible()[active]); }
    });
    list.addEventListener('mousemove', (e) => {
      const it = e.target.closest('[role="option"]');
      if (!it || it.getAttribute('aria-selected') === 'true') return;
      setActive(visible().indexOf(it));
    });
    list.addEventListener('click', (e) => {
      const it = e.target.closest('[role="option"]');
      if (it && !e.target.closest('a[href]')) run(it);
    });
    cmd.addEventListener('layer:open', () => { input.value = input.defaultValue || ''; filter(); });
    if (input.value) filter(); else setActive(active);
  }
  $$('.cmd').forEach(initCommand);

  doc.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
      const cmd = $('.cmd[data-layer]');
      if (!cmd) return;
      e.preventDefault();
      if (stack.some((s) => s.layer === cmd)) closeLayer(cmd);
      else openLayer(cmd, doc.activeElement);
    }
  });

  /* ------------------------------------------------------------------------
     5. 탭 — .tabs > .tabs__bar > .tabs__list[role=tablist] > [role=tab]
     ------------------------------------------------------------------------ */
  function initTabs(tabs) {
    const list = $('[role="tablist"]', tabs);
    if (!list) return;
    const tabEls = $$('[role="tab"]', list);
    tabs.classList.add('tabs--js');
    let ink = $('.tabs__ink', list);
    if (!ink) { ink = doc.createElement('span'); ink.className = 'tabs__ink'; ink.setAttribute('aria-hidden', 'true'); list.appendChild(ink); }
    const panelOf = (t) => byId(t.getAttribute('aria-controls'));
    function placeInk(t) {
      if (!t) return;
      list.style.setProperty('--ink-x', `${t.offsetLeft}px`);
      list.style.setProperty('--ink-w', String(t.offsetWidth));
    }
    function select(t, focus) {
      if (!t || t.getAttribute('aria-disabled') === 'true' || t.disabled) return;
      tabEls.forEach((x) => {
        const on = x === t;
        x.setAttribute('aria-selected', String(on));
        x.tabIndex = on ? 0 : -1;
        const p = panelOf(x);
        if (p) p.hidden = !on;
      });
      placeInk(t);
      if (focus) t.focus();
      // 탭 줄 안에서만 가로 스크롤 — 창은 움직이지 않는다
      if (list.scrollWidth > list.clientWidth) {
        const l = t.getBoundingClientRect().left - list.getBoundingClientRect().left + list.scrollLeft;
        if (l < list.scrollLeft) list.scrollLeft = l;
        else if (l + t.offsetWidth > list.scrollLeft + list.clientWidth) list.scrollLeft = l + t.offsetWidth - list.clientWidth;
      }
    }
    tabEls.forEach((t) => {
      const p = panelOf(t);
      if (p) { p.setAttribute('role', 'tabpanel'); p.setAttribute('aria-labelledby', ensureId(t, 'tab')); if (!p.hasAttribute('tabindex')) p.tabIndex = 0; }
    });
    const initial = tabEls.find((t) => t.getAttribute('aria-selected') === 'true') || tabEls[0];
    tabEls.forEach((t) => { t.tabIndex = t === initial ? 0 : -1; });
    list.addEventListener('click', (e) => { const t = e.target.closest('[role="tab"]'); if (t) select(t, false); });
    list.addEventListener('keydown', (e) => {
      const enabled = tabEls.filter((t) => t.getAttribute('aria-disabled') !== 'true' && !t.disabled);
      const i = enabled.indexOf(doc.activeElement);
      if (i < 0) return;
      let n = null;
      const vertical = list.getAttribute('aria-orientation') === 'vertical';
      const nextKey = vertical ? 'ArrowDown' : 'ArrowRight';
      const prevKey = vertical ? 'ArrowUp' : 'ArrowLeft';
      if (e.key === nextKey) n = enabled[(i + 1) % enabled.length];
      else if (e.key === prevKey) n = enabled[(i - 1 + enabled.length) % enabled.length];
      else if (e.key === 'Home') n = enabled[0];
      else if (e.key === 'End') n = enabled[enabled.length - 1];
      if (n) { e.preventDefault(); select(n, true); }
    });
    const sync = () => placeInk(tabEls.find((t) => t.getAttribute('aria-selected') === 'true'));
    sync();
    window.addEventListener('resize', sync);
    if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(sync);
  }
  $$('.tabs').forEach(initTabs);

  /* ------------------------------------------------------------------------
     6. 아코디언 — .acc__trigger[aria-expanded][aria-controls], .acc[data-single]
     ------------------------------------------------------------------------ */
  $$('.acc__trigger').forEach((t) => {
    const p = byId(t.getAttribute('aria-controls'));
    const open = t.getAttribute('aria-expanded') === 'true';
    if (p) p.hidden = !open;
    const item = t.closest('.acc__item');
    if (item) item.classList.toggle('is-open', open);
  });
  doc.addEventListener('click', (e) => {
    const t = e.target.closest('.acc__trigger');
    if (!t || t.disabled || t.getAttribute('aria-disabled') === 'true') return;
    const open = t.getAttribute('aria-expanded') !== 'true';
    const acc = t.closest('.acc');
    if (open && acc && acc.hasAttribute('data-single')) {
      $$('.acc__trigger[aria-expanded="true"]', acc).forEach((o) => { if (o !== t) setAcc(o, false); });
    }
    setAcc(t, open);
  });
  function setAcc(t, open) {
    t.setAttribute('aria-expanded', String(open));
    const p = byId(t.getAttribute('aria-controls'));
    if (p) p.hidden = !open;
    const item = t.closest('.acc__item');
    if (item) item.classList.toggle('is-open', open);
  }

  /* ------------------------------------------------------------------------
     7. 토스트 — Oseon.toast({ title, text, tone, action, duration }) · [data-toast]
     ------------------------------------------------------------------------ */
  function toaster() {
    let t = $('.toaster:not(.toaster--static)');
    if (!t) {
      t = doc.createElement('div');
      t.className = 'toaster';
      t.setAttribute('role', 'status');
      t.setAttribute('aria-live', 'polite');
      doc.body.appendChild(t);
    }
    return t;
  }
  const ICON_X = '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5l14 14M19 5L5 19"/></svg>';
  function toast(opts) {
    const o = typeof opts === 'string' ? { title: opts } : (opts || {});
    const box = toaster();
    const el = doc.createElement('div');
    el.className = `toast${o.tone ? ` toast--${o.tone}` : ''}`;
    const mark = doc.createElement('span'); mark.className = 'toast__mark'; mark.setAttribute('aria-hidden', 'true');
    const body = doc.createElement('div'); body.className = 'toast__body';
    const title = doc.createElement('p'); title.className = 'toast__title'; title.textContent = o.title || '';
    body.appendChild(title);
    if (o.text) { const tx = doc.createElement('p'); tx.className = 'toast__text'; tx.textContent = o.text; body.appendChild(tx); }
    const actions = doc.createElement('div'); actions.className = 'toast__actions';
    if (o.action) {
      const a = doc.createElement('button'); a.type = 'button'; a.className = 'toast__action'; a.textContent = o.action;
      a.addEventListener('click', () => { dismiss(); if (typeof o.onAction === 'function') o.onAction(); else toast({ title: '되돌렸습니다.', tone: 'info' }); });
      actions.appendChild(a);
    }
    const x = doc.createElement('button'); x.type = 'button'; x.className = 'iconbtn toast__close'; x.setAttribute('aria-label', '알림 닫기'); x.innerHTML = ICON_X;
    x.addEventListener('click', () => dismiss());
    actions.appendChild(x);
    el.append(mark, body, actions);
    box.appendChild(el);
    while (box.children.length > 3) box.firstElementChild.remove();
    let timer = null;
    const ms = o.duration || 5000;
    const arm = () => { clearTimeout(timer); timer = setTimeout(dismiss, ms); };
    function dismiss() { clearTimeout(timer); el.classList.add('is-leaving'); setTimeout(() => el.remove(), 0); }
    el.addEventListener('mouseenter', () => clearTimeout(timer));
    el.addEventListener('mouseleave', arm);
    el.addEventListener('focusin', () => clearTimeout(timer));
    el.addEventListener('focusout', arm);
    arm();
    return { dismiss };
  }
  doc.addEventListener('click', (e) => {
    const t = e.target.closest('[data-toast]');
    if (!t || t.hasAttribute('data-busy-demo')) return;
    if (t.tagName === 'A' && t.getAttribute('href') && !t.hasAttribute('data-toast-follow')) e.preventDefault();
    toast({ title: t.dataset.toast, text: t.dataset.toastText, tone: t.dataset.toastTone, action: t.dataset.toastAction });
  });

  /* ------------------------------------------------------------------------
     8. 팝오버 — [data-popover][aria-controls] → .pop__panel
     9. 메뉴   — .menu__trigger[aria-controls] → .menu__list[role=menu]
     ------------------------------------------------------------------------ */
  let openPop = null;
  let openMenu = null;
  function closePop(focusBack) {
    if (!openPop) return;
    const { trigger, panel } = openPop;
    panel.hidden = true;
    trigger.setAttribute('aria-expanded', 'false');
    openPop = null;
    if (focusBack) trigger.focus();
  }
  function closeMenu(focusBack) {
    if (!openMenu) return;
    const { trigger, list } = openMenu;
    list.hidden = true;
    trigger.setAttribute('aria-expanded', 'false');
    openMenu = null;
    if (focusBack) trigger.focus();
  }
  function closeFloating() { closePop(false); closeMenu(false); }

  doc.addEventListener('click', (e) => {
    const pt = e.target.closest('[data-popover]');
    if (pt) {
      const panel = byId(pt.getAttribute('aria-controls'));
      if (!panel) return;
      const wasOpen = openPop && openPop.panel === panel;
      closeFloating();
      if (!wasOpen) {
        panel.hidden = false;
        pt.setAttribute('aria-expanded', 'true');
        openPop = { trigger: pt, panel };
      }
      return;
    }
    if (openPop && !openPop.panel.contains(e.target)) closePop(false);
    else if (openPop && e.target.closest('[data-pop-close]')) closePop(true);
  });

  const menuItems = (list) => $$('[role^="menuitem"]', list).filter((i) => i.getAttribute('aria-disabled') !== 'true' && !i.closest('[hidden]'));
  function openMenuFor(trigger, focusLast) {
    const list = byId(trigger.getAttribute('aria-controls'));
    if (!list) return;
    closeFloating();
    list.hidden = false;
    trigger.setAttribute('aria-expanded', 'true');
    openMenu = { trigger, list };
    const items = menuItems(list);
    const target = focusLast ? items[items.length - 1] : items[0];
    if (target) target.focus();
  }
  $$('.menu__list[role="menu"]').forEach((list) => {
    $$('[role^="menuitem"]', list).forEach((i) => { i.tabIndex = -1; });
  });
  doc.addEventListener('click', (e) => {
    const trigger = e.target.closest('.menu__trigger');
    if (trigger) {
      const wasOpen = openMenu && openMenu.trigger === trigger;
      if (wasOpen) closeMenu(false); else openMenuFor(trigger, false);
      return;
    }
    const item = e.target.closest('[role^="menuitem"]');
    if (item && openMenu && openMenu.list.contains(item)) {
      if (item.getAttribute('aria-disabled') === 'true') { e.preventDefault(); return; }
      if (item.getAttribute('role') === 'menuitemradio') {
        const group = item.closest('[role="group"]') || openMenu.list;
        $$('[role="menuitemradio"]', group).forEach((r) => r.setAttribute('aria-checked', String(r === item)));
      } else if (item.getAttribute('role') === 'menuitemcheckbox') {
        item.setAttribute('aria-checked', String(item.getAttribute('aria-checked') !== 'true'));
      }
      closeMenu(true);
      return;
    }
    if (openMenu && !openMenu.list.contains(e.target)) closeMenu(false);
  });
  doc.addEventListener('keydown', (e) => {
    const trigger = e.target.closest && e.target.closest('.menu__trigger');
    if (trigger && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      e.preventDefault();
      openMenuFor(trigger, e.key === 'ArrowUp');
      return;
    }
    if (!openMenu || !openMenu.list.contains(e.target)) return;
    const items = menuItems(openMenu.list);
    const i = items.indexOf(doc.activeElement);
    let n = null;
    if (e.key === 'ArrowDown') n = items[(i + 1) % items.length];
    else if (e.key === 'ArrowUp') n = items[(i - 1 + items.length) % items.length];
    else if (e.key === 'Home') n = items[0];
    else if (e.key === 'End') n = items[items.length - 1];
    else if (e.key === 'Tab') { closeMenu(false); return; }
    else if (e.key.length === 1 && /\S/.test(e.key)) {
      n = items.slice(i + 1).concat(items.slice(0, i + 1)).find((it) => it.textContent.trim().startsWith(e.key));
    }
    if (n) { e.preventDefault(); n.focus(); }
  });

  /* ------------------------------------------------------------------------
     10. 툴팁 — Esc 로 숨김
     ------------------------------------------------------------------------ */
  $$('.tip').forEach((tip) => {
    const bubble = $('.tip__bubble', tip);
    const fit = () => requestAnimationFrame(() => {
      if (!bubble || bubble.classList.contains('tip__bubble--static')) return;
      bubble.classList.remove('tip__bubble--end');
      if (bubble.getBoundingClientRect().right > doc.documentElement.clientWidth - 8) bubble.classList.add('tip__bubble--end');
    });
    tip.addEventListener('mouseenter', fit);
    tip.addEventListener('focusin', fit);
    const reset = () => tip.classList.remove('is-dismissed');
    tip.addEventListener('mouseleave', reset);
    tip.addEventListener('focusout', reset);
  });

  /* Esc 우선순위: 레이어 → 메뉴 → 팝오버 → 내비 판 → 툴팁 */
  doc.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (openMenu) { e.preventDefault(); closeMenu(true); return; }
      if (openPop) { e.preventDefault(); closePop(true); return; }
      const layer = topLayer();
      if (layer) { e.preventDefault(); closeLayer(layer); return; }
      if (closeNav(true)) return;
      $$('.tip').forEach((t) => { if (t.matches(':hover, :focus-within')) t.classList.add('is-dismissed'); });
      return;
    }
    if ((e.key === 'g' || e.key === 'G') && !e.metaKey && !e.ctrlKey && !e.altKey && !isTyping(e.target) && !topLayer()) {
      setGrid(!root.classList.contains('grid-on'));
    }
  });

  /* ------------------------------------------------------------------------
     11. 캐러셀 — [data-carousel]
     ------------------------------------------------------------------------ */
  function initCarousel(c) {
    const track = $('.carousel__track', c);
    if (!track) return;
    const slides = $$('.carousel__slide', track);
    const prev = $('[data-carousel-prev]', c);
    const next = $('[data-carousel-next]', c);
    const now = $('.carousel__now', c);
    const thumb = $('.carousel__thumb', c);
    const start = parseInt(c.dataset.start || '1', 10);
    let index = 0;
    const step = () => (slides[1] ? slides[1].offsetLeft - slides[0].offsetLeft : track.clientWidth);
    slides.forEach((s, i) => {
      s.setAttribute('role', 'group');
      s.setAttribute('aria-roledescription', '포스터');
      if (!s.hasAttribute('aria-label')) s.setAttribute('aria-label', `${start + i} / ${start + slides.length - 1}`);
    });
    function update() {
      const max = track.scrollWidth - track.clientWidth;
      index = Math.min(slides.length - 1, Math.round(track.scrollLeft / Math.max(1, step())));
      if (track.scrollLeft >= max - 2) index = Math.max(index, slides.length - Math.max(1, Math.round(track.clientWidth / Math.max(1, step()))));
      slides.forEach((s, i) => { if (i === index) s.setAttribute('aria-current', 'true'); else s.removeAttribute('aria-current'); });
      if (now) now.textContent = String(start + index).padStart(2, '0');
      if (prev) prev.disabled = track.scrollLeft <= 2;
      if (next) next.disabled = track.scrollLeft >= max - 2;
      if (thumb) {
        c.style.setProperty('--thumb-w', `${Math.min(100, (track.clientWidth / track.scrollWidth) * 100)}%`);
        c.style.setProperty('--thumb-x', `${(track.scrollLeft / Math.max(1, track.clientWidth)) * 100}%`);
      }
    }
    function go(i) {
      const t = Math.max(0, Math.min(slides.length - 1, i));
      track.scrollTo({ left: slides[t].offsetLeft - slides[0].offsetLeft, behavior: reduced() ? 'auto' : 'smooth' });
    }
    if (prev) prev.addEventListener('click', () => go(index - 1));
    if (next) next.addEventListener('click', () => go(index + 1));
    track.addEventListener('keydown', (e) => {
      if (e.target !== track) return;
      if (e.key === 'ArrowRight') { e.preventDefault(); go(index + 1); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); go(index - 1); }
    });
    let raf = 0;
    track.addEventListener('scroll', () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(update); }, { passive: true });
    window.addEventListener('resize', update);
    update();
  }
  $$('[data-carousel]').forEach(initCarousel);

  /* ------------------------------------------------------------------------
     12. 마퀴 — 내용 복제(aria-hidden) + 일시정지 버튼
     ------------------------------------------------------------------------ */
  $$('.marquee').forEach((m) => {
    const track = $('.marquee__track', m);
    if (!track) return;
    const groups = $$('.marquee__group', track);
    if (groups.length === 1) {
      const clone = groups[0].cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      $$('a, button', clone).forEach((x) => { x.tabIndex = -1; });
      track.appendChild(clone);
    }
    const btn = $('.marquee__toggle', m);
    if (btn) {
      btn.addEventListener('click', () => {
        const paused = m.classList.toggle('is-paused');
        btn.setAttribute('aria-pressed', String(paused));
        btn.setAttribute('aria-label', paused ? '전광판 다시 흐르기' : '전광판 멈추기');
      });
    }
  });

  /* ------------------------------------------------------------------------
     14. 폼 — form[data-validate] · .qty · [data-busy-demo]
     ------------------------------------------------------------------------ */
  function fieldOf(input) { return input.closest('.field, .fieldset, .check, .choices') || input.parentElement; }
  function errorEl(input) {
    const f = input.closest('.field, .fieldset') || fieldOf(input);
    return f ? $('.field__error', f) : null;
  }
  function setInvalid(input, on, msg) {
    const group = input.type === 'radio' || input.type === 'checkbox' ? $$(`input[name="${CSS.escape(input.name)}"]`, input.form || doc) : [input];
    group.forEach((g) => { if (on) g.setAttribute('aria-invalid', 'true'); else g.removeAttribute('aria-invalid'); });
    const err = errorEl(input);
    if (!err) return;
    ensureId(err, 'err');
    err.hidden = !on;
    if (on) err.textContent = msg || input.dataset.error || '필수 항목입니다.';
    group.forEach((g) => {
      const ids = (g.getAttribute('aria-describedby') || '').split(/\s+/).filter(Boolean);
      if (!ids.includes(err.id)) ids.push(err.id);
      g.setAttribute('aria-describedby', ids.join(' '));
    });
  }
  function messageFor(input) {
    if (input.dataset.error) return input.dataset.error;
    const v = input.validity;
    if (v.valueMissing) return input.type === 'checkbox' ? '동의가 필요합니다.' : input.type === 'radio' ? '하나를 선택해 주세요.' : '필수 항목입니다.';
    if (v.typeMismatch && input.type === 'email') return '이메일 형식이 아닙니다. 예: doyeon.kim@oseonhall.kr';
    if (v.patternMismatch) return input.title || '형식이 맞지 않습니다.';
    if (v.rangeUnderflow || v.rangeOverflow) return `${input.min || 0}에서 ${input.max}까지 입력할 수 있습니다.`;
    if (v.tooShort) return `${input.minLength}자 이상 입력해 주세요.`;
    return '입력값을 확인해 주세요.';
  }
  function validate(scope) {
    const inputs = $$('input, select, textarea', scope).filter((i) => !i.disabled && i.willValidate);
    let firstBad = null;
    const seen = new Set();
    inputs.forEach((i) => {
      if ((i.type === 'radio' || i.type === 'checkbox') && i.name) {
        if (seen.has(i.name)) return;
        seen.add(i.name);
      }
      const ok = i.checkValidity();
      setInvalid(i, !ok, ok ? '' : messageFor(i));
      if (!ok && !firstBad) firstBad = i;
    });
    if (firstBad) firstBad.focus();
    return !firstBad;
  }
  $$('form[data-validate]').forEach((form) => {
    form.noValidate = true;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!validate(form)) return;
      const submit = $('[type="submit"]', form) || e.submitter;
      const done = () => toast({ title: form.dataset.success || '저장했습니다.', text: form.dataset.successText, tone: 'success' });
      if (submit) {
        submit.setAttribute('aria-busy', 'true');
        submit.disabled = true;
        setTimeout(() => { submit.removeAttribute('aria-busy'); submit.disabled = false; done(); }, reduced() ? 0 : 900);
      } else done();
    });
    form.addEventListener('input', (e) => {
      const i = e.target;
      if (i.getAttribute('aria-invalid') === 'true' && i.checkValidity()) setInvalid(i, false);
    });
    form.addEventListener('change', (e) => {
      const i = e.target;
      if (i.getAttribute('aria-invalid') === 'true' && i.checkValidity()) setInvalid(i, false);
    });
  });

  $$('.qty').forEach((q) => {
    const input = $('.qty__val', q);
    const dec = $('[data-qty-dec]', q);
    const inc = $('[data-qty-inc]', q);
    if (!input) return;
    const min = () => (input.min === '' ? 0 : Number(input.min));
    const max = () => (input.max === '' ? Infinity : Number(input.max));
    const sync = () => {
      const v = Number(input.value) || 0;
      if (dec) dec.disabled = v <= min();
      if (inc) inc.disabled = v >= max();
    };
    const set = (v) => {
      input.value = String(Math.max(min(), Math.min(max(), v)));
      sync();
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    };
    if (dec) dec.addEventListener('click', () => set((Number(input.value) || 0) - 1));
    if (inc) inc.addEventListener('click', () => set((Number(input.value) || 0) + 1));
    input.addEventListener('change', () => set(Number(input.value) || 0));
    sync();
  });

  doc.addEventListener('click', (e) => {
    const b = e.target.closest('[data-busy-demo]');
    if (!b || b.getAttribute('aria-busy') === 'true') return;
    const label = $('.btn__label', b);
    const original = label ? label.textContent : '';
    b.setAttribute('aria-busy', 'true');
    if (label && b.dataset.busyLabel) label.textContent = b.dataset.busyLabel;
    setTimeout(() => {
      b.removeAttribute('aria-busy');
      if (label) label.textContent = original;
      if (b.dataset.toast) toast({ title: b.dataset.toast, text: b.dataset.toastText, tone: b.dataset.toastTone || 'success' });
    }, reduced() ? 300 : 1600);
  });

  /* ------------------------------------------------------------------------
     15. 달력 — [data-calendar] 날짜 선택 + 화살표 이동
     ------------------------------------------------------------------------ */
  $$('[data-calendar]').forEach((cal) => {
    const cells = $$('tbody td', cal);
    const days = () => $$('.cal__day', cal);
    const out = byId(cal.dataset.output) || $('[data-cal-output]', cal);
    const enabled = (btn) => btn && !btn.disabled && btn.getAttribute('aria-disabled') !== 'true';
    const initial = days().find((d) => d.getAttribute('aria-pressed') === 'true') || days().find((d) => d.getAttribute('aria-current') === 'date') || days().find(enabled);
    days().forEach((d) => { d.tabIndex = d === initial ? 0 : -1; if (!d.hasAttribute('aria-pressed')) d.setAttribute('aria-pressed', 'false'); });
    cal.addEventListener('click', (e) => {
      const d = e.target.closest('.cal__day');
      if (!enabled(d)) return;
      days().forEach((x) => { x.setAttribute('aria-pressed', String(x === d)); x.tabIndex = x === d ? 0 : -1; });
      if (out) out.textContent = d.dataset.label || d.getAttribute('aria-label') || d.textContent.trim();
      cal.dispatchEvent(new CustomEvent('calendar:select', { bubbles: true, detail: { date: d.dataset.date, button: d } }));
    });
    cal.addEventListener('keydown', (e) => {
      const d = e.target.closest('.cal__day');
      if (!d) return;
      const map = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: 7, ArrowUp: -7 };
      if (!(e.key in map)) return;
      e.preventDefault();
      let i = cells.indexOf(d.closest('td'));
      const dir = map[e.key];
      for (let guard = 0; guard < 42; guard += 1) {
        i += dir;
        if (i < 0 || i >= cells.length) return;
        const b = $('.cal__day', cells[i]);
        if (enabled(b)) { days().forEach((x) => { x.tabIndex = -1; }); b.tabIndex = 0; b.focus(); return; }
        if (Math.abs(dir) === 7) continue;
      }
    });
  });

  /* ------------------------------------------------------------------------
     16. 칸반 — [data-kanban] · [data-kanban-next] · [data-kanban-move="단계"] · 드래그
     ------------------------------------------------------------------------ */
  $$('[data-kanban]').forEach((board) => {
    const cols = () => $$('.kanban__col', board);
    const live = $('[data-kanban-live]', board.parentElement) || (() => {
      const l = doc.createElement('p'); l.className = 'vh'; l.setAttribute('aria-live', 'polite'); board.after(l); return l;
    })();
    function refresh() {
      const all = cols();
      all.forEach((col, ci) => {
        const list = $('.kanban__list', col);
        const n = $$('.kanban__card', list).length;
        const count = $('.kanban__count', col);
        if (count) count.textContent = String(n);
        const limit = parseInt(col.dataset.limit || '0', 10);
        col.classList.toggle('kanban__col--over', !!limit && n > limit);
        $$('.kanban__card', list).forEach((card) => {
          const nb = $('[data-kanban-next]', card);
          if (nb) nb.disabled = ci === all.length - 1;
          $$('[data-kanban-move]', card).forEach((m) => {
            const here = m.dataset.kanbanMove === col.dataset.stage;
            m.setAttribute('aria-checked', String(here));
            m.setAttribute('aria-disabled', String(here));
          });
        });
        let empty = $('.kanban__empty', list);
        if (!n && !empty) { empty = doc.createElement('li'); empty.className = 'kanban__empty'; empty.textContent = '이 단계에 작업이 없습니다.'; list.appendChild(empty); }
        if (n && empty) empty.remove();
      });
    }
    function move(card, col, focusSel) {
      if (!card || !col) return;
      const list = $('.kanban__list', col);
      const empty = $('.kanban__empty', list);
      list.insertBefore(card, empty || null);
      card.classList.remove('is-moved'); void card.offsetWidth; card.classList.add('is-moved');
      setTimeout(() => card.classList.remove('is-moved'), 1600);
      refresh();
      const code = ($('.kanban__code', card) || card).textContent.trim();
      const name = ($('.kanban__name', col) || col).firstChild.textContent.trim();
      live.textContent = `${code} → ${name}`;
      const f = $(focusSel || '[data-kanban-next]', card);
      if (f && !f.disabled) f.focus(); else { const t = $('.menu__trigger', card); if (t) t.focus(); }
    }
    board.addEventListener('click', (e) => {
      const nb = e.target.closest('[data-kanban-next]');
      if (nb) {
        const card = nb.closest('.kanban__card');
        const all = cols();
        const i = all.indexOf(card.closest('.kanban__col'));
        if (i < all.length - 1) move(card, all[i + 1]);
        return;
      }
      const mv = e.target.closest('[data-kanban-move]');
      if (mv && mv.getAttribute('aria-disabled') !== 'true') {
        const card = mv.closest('.kanban__card');
        const col = cols().find((c) => c.dataset.stage === mv.dataset.kanbanMove);
        setTimeout(() => move(card, col), 0);
      }
    });
    let dragging = null;
    board.addEventListener('dragstart', (e) => {
      const card = e.target.closest('.kanban__card');
      if (!card) return;
      dragging = card;
      card.classList.add('is-dragging');
      e.dataTransfer.effectAllowed = 'move';
      try { e.dataTransfer.setData('text/plain', ensureId(card, 'kb')); } catch (err) { /* noop */ }
    });
    board.addEventListener('dragend', () => {
      if (dragging) dragging.classList.remove('is-dragging');
      dragging = null;
      $$('.kanban__list.is-over', board).forEach((l) => l.classList.remove('is-over'));
    });
    board.addEventListener('dragover', (e) => {
      const list = e.target.closest('.kanban__list');
      if (!list || !dragging) return;
      e.preventDefault();
      $$('.kanban__list.is-over', board).forEach((l) => { if (l !== list) l.classList.remove('is-over'); });
      list.classList.add('is-over');
    });
    board.addEventListener('drop', (e) => {
      const list = e.target.closest('.kanban__list');
      if (!list || !dragging) return;
      e.preventDefault();
      list.classList.remove('is-over');
      move(dragging, list.closest('.kanban__col'));
    });
    refresh();
  });

  /* ------------------------------------------------------------------------
     17. 표 — 정렬(.table__sort) · 행 선택([data-select-all] / [data-select-row])
     ------------------------------------------------------------------------ */
  const numOf = (s) => {
    const m = String(s).replace(/[,₩%석매명\s]/g, '').match(/-?\d+(\.\d+)?/);
    return m ? parseFloat(m[0]) : NaN;
  };
  doc.addEventListener('click', (e) => {
    const btn = e.target.closest('.table__sort');
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
      const ta = (a.cells[col] && (a.cells[col].dataset.sort || a.cells[col].textContent)) || '';
      const tb = (b.cells[col] && (b.cells[col].dataset.sort || b.cells[col].textContent)) || '';
      const na = numOf(ta); const nb = numOf(tb);
      const numeric = th.classList.contains('num');
      if (numeric && Number.isNaN(na) !== Number.isNaN(nb)) return Number.isNaN(na) ? 1 : -1; // 값 없는 행은 항상 아래
      const r = numeric && !Number.isNaN(na) ? na - nb : ta.trim().localeCompare(tb.trim(), 'ko', { numeric: true });
      return dir === 'ascending' ? r : -r;
    });
    rows.forEach((r) => tbody.appendChild(r));
  });
  doc.addEventListener('change', (e) => {
    const all = e.target.closest('[data-select-all]');
    const table = e.target.closest('table');
    if (!table) return;
    const rows = $$('[data-select-row]', table);
    if (all) {
      rows.forEach((r) => { r.checked = all.checked; r.closest('tr').setAttribute('aria-selected', String(all.checked)); });
      return;
    }
    if (e.target.matches('[data-select-row]')) {
      e.target.closest('tr').setAttribute('aria-selected', String(e.target.checked));
      const head = $('[data-select-all]', table);
      if (head) {
        const n = rows.filter((r) => r.checked).length;
        head.checked = n === rows.length;
        head.indeterminate = n > 0 && n < rows.length;
      }
    }
  });

  /* ------------------------------------------------------------------------
     18. 스크롤 힌트 — 탭 줄·넓은 표·칸반이 잘릴 때 오른쪽(왼쪽) 페이드
     ------------------------------------------------------------------------ */
  function hint(scroller, host) {
    const upd = () => {
      const max = scroller.scrollWidth - scroller.clientWidth;
      host.classList.toggle('has-more-end', max > 2 && scroller.scrollLeft < max - 2);
      host.classList.toggle('has-more-start', max > 2 && scroller.scrollLeft > 2);
    };
    scroller.addEventListener('scroll', upd, { passive: true });
    window.addEventListener('resize', upd);
    if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(upd);
    upd();
  }
  $$('.tabs__list').forEach((l) => { const host = l.closest('.tabs__bar'); if (host) hint(l, host); });
  $$('.table-wrap').forEach((w) => {
    const host = w.closest('.table-shell');
    if (host) hint(w, host);
    if (!w.hasAttribute('tabindex') && w.scrollWidth > w.clientWidth) w.tabIndex = 0;
  });
  $$('.kanban').forEach((k) => { const host = k.closest('.kanban-wrap'); if (host) hint(k, host); });

  /* 칸반 모바일(<768) 가로 띠: 띠 높이를 지금 보이는 열의 높이에 맞춘다.
     가장 긴 열(교정 3장)에 맞춰 늘어나면 짧은 열 아래에 빈 꼬리가 남기 때문(브리프 7-8). */
  const kbMq = window.matchMedia('(max-width: 767.98px)');
  $$('.kanban').forEach((k) => {
    const cols = () => $$('.kanban__col', k);
    const fit = () => {
      if (!kbMq.matches) { k.style.height = ''; return; }
      const left = k.getBoundingClientRect().left;
      let col = null, best = Infinity;
      cols().forEach((c) => { const d = Math.abs(c.getBoundingClientRect().left - left); if (d < best) { best = d; col = c; } });
      if (!col) return;
      k.style.height = `${col.offsetHeight + (k.offsetHeight - k.clientHeight)}px`;
    };
    let raf = 0;
    const queue = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(fit); };
    k.addEventListener('scroll', queue, { passive: true });
    window.addEventListener('resize', queue);
    if (kbMq.addEventListener) kbMq.addEventListener('change', queue);
    if ('ResizeObserver' in window) { const ro = new ResizeObserver(queue); cols().forEach((c) => ro.observe(c)); }
    if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(queue);
    queue();
  });

  /* ------------------------------------------------------------------------
     19. 내비 — 모바일 판 메뉴 [data-nav-toggle][aria-controls]
     ------------------------------------------------------------------------ */
  function closeNav(focusBack) {
    const t = $('[data-nav-toggle][aria-expanded="true"]');
    if (!t) return false;
    const panel = byId(t.getAttribute('aria-controls'));
    if (panel) panel.hidden = true;
    t.setAttribute('aria-expanded', 'false');
    t.setAttribute('aria-label', '메뉴 열기');
    if (focusBack) t.focus();
    return true;
  }
  doc.addEventListener('click', (e) => {
    const t = e.target.closest('[data-nav-toggle]');
    if (!t) return;
    const panel = byId(t.getAttribute('aria-controls'));
    if (!panel) return;
    const open = t.getAttribute('aria-expanded') !== 'true';
    panel.hidden = !open;
    t.setAttribute('aria-expanded', String(open));
    t.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
    if (open) { const f = focusables(panel)[0]; if (f) f.focus(); }
  });
  window.addEventListener('resize', () => { if (window.innerWidth >= 768) closeNav(false); });

  /* ------------------------------------------------------------------------
     20. 단계 마법사 — [data-stepper] · [data-step-panel] · [data-step-next|prev|go]
     ------------------------------------------------------------------------ */
  $$('[data-stepper]').forEach((w) => {
    const panels = $$('[data-step-panel]', w);
    const items = $$('.steps__item', w);
    let cur = Math.max(0, panels.findIndex((p) => !p.hidden));
    function show(i, focus) {
      cur = Math.max(0, Math.min(panels.length - 1, i));
      panels.forEach((p, k) => { p.hidden = k !== cur; });
      items.forEach((it, k) => {
        if (k === cur) it.setAttribute('aria-current', 'step'); else it.removeAttribute('aria-current');
        it.classList.toggle('steps__item--done', k < cur);
      });
      if (focus) {
        const h = $('h2, h3, [data-step-title]', panels[cur]) || panels[cur];
        if (!h.hasAttribute('tabindex')) h.tabIndex = -1;
        h.focus({ preventScroll: false });
      }
      w.dispatchEvent(new CustomEvent('stepper:change', { bubbles: true, detail: { index: cur } }));
    }
    w.addEventListener('click', (e) => {
      if (e.target.closest('[data-step-next]')) { e.preventDefault(); if (validate(panels[cur])) show(cur + 1, true); }
      else if (e.target.closest('[data-step-prev]')) { e.preventDefault(); show(cur - 1, true); }
      else {
        const g = e.target.closest('[data-step-go]');
        if (g) { e.preventDefault(); const n = parseInt(g.dataset.stepGo, 10); if (n <= cur) show(n, true); }
      }
    });
    show(cur, false);
  });

  /* ------------------------------------------------------------------------
     21. 보기 전환 — [data-views] 컨테이너의 data-view 값을 바꾼다 (모바일 목록 → 읽기)
     ------------------------------------------------------------------------ */
  doc.addEventListener('click', (e) => {
    const b = e.target.closest('[data-view-set]');
    if (!b) return;
    // 컨테이너([data-views])를 먼저 찾는다 — role=tab 의 aria-controls(패널)에 data-view 가 붙지 않게
    const host = b.closest('[data-views]') || byId(b.getAttribute('aria-controls'));
    if (!host) return;
    host.setAttribute('data-view', b.dataset.viewSet);
    const focusTarget = $(`[data-view-focus="${b.dataset.viewSet}"]`, host);
    if (focusTarget) {
      if (!focusTarget.hasAttribute('tabindex')) focusTarget.tabIndex = -1;
      /* focus() 가 일으키는 스크롤에는 scroll-padding-top 이 적용되지 않아 판 머리가 고정 내비 밑에 숨는다 —
         스크롤은 막고 scrollIntoView 로 다시 맞춘다(scroll-margin/scroll-padding 존중) */
      focusTarget.focus({ preventScroll: true });
      focusTarget.scrollIntoView({ block: 'start', behavior: reduced() ? 'auto' : 'smooth' });
    }
  });

  /* ------------------------------------------------------------------------
     22. 코드 — 행 번호 자동 감싸기 · 복사
     ------------------------------------------------------------------------ */
  $$('.code__body code').forEach((code) => {
    if ($('.code__line', code)) return;
    const lines = code.innerHTML.replace(/\n$/, '').split('\n');
    code.innerHTML = lines.map((l) => `<span class="code__line">${l || ' '}</span>`).join('');
  });
  doc.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-copy]');
    if (!btn) return;
    const box = byId(btn.getAttribute('aria-controls')) || btn.closest('.code');
    const code = box && $('code', box);
    if (!code) return;
    const text = $$('.code__line', code).map((l) => l.textContent).join('\n') || code.textContent;
    const ok = () => {
      btn.dataset.copied = 'true';
      setTimeout(() => { btn.dataset.copied = 'false'; }, 1600);
      toast({ title: '코드를 복사했습니다.', tone: 'success' });
    };
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).then(ok, ok);
    else {
      const ta = doc.createElement('textarea');
      ta.value = text; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
      doc.body.appendChild(ta); ta.select();
      try { doc.execCommand('copy'); } catch (err) { /* noop */ }
      ta.remove(); ok();
    }
  });

  /* ------------------------------------------------------------------------
     23. 페이지네이션 — [data-pager] 안 button.pager__link
     ------------------------------------------------------------------------ */
  $$('[data-pager]').forEach((pager) => {
    const links = $$('button.pager__link', pager);
    if (!links.length) return;
    const prev = $('[data-pager-prev]', pager);
    const next = $('[data-pager-next]', pager);
    const now = $('[data-pager-now]', pager);
    let cur = Math.max(0, links.findIndex((l) => l.getAttribute('aria-current') === 'page'));
    function set(i) {
      cur = Math.max(0, Math.min(links.length - 1, i));
      const last = links.length - 1;
      links.forEach((l, k) => {
        if (k === cur) l.setAttribute('aria-current', 'page'); else l.removeAttribute('aria-current');
        /* 모바일에서 숨기는 '먼 쪽'은 현재 쪽 기준으로 다시 계산한다 — 첫·끝 쪽과 현재 ±1 쪽은 늘 보인다(6쪽 이상일 때만) */
        const item = l.closest('li');
        if (item) item.classList.toggle('pager__item--far', links.length > 5 && k !== 0 && k !== last && Math.abs(k - cur) > 1);
      });
      if (prev) prev.disabled = cur === 0;
      if (next) next.disabled = cur === links.length - 1;
      if (now) now.textContent = links[cur].textContent.trim();
      pager.dispatchEvent(new CustomEvent('pager:change', { bubbles: true, detail: { page: links[cur].textContent.trim() } }));
    }
    links.forEach((l, k) => l.addEventListener('click', () => set(k)));
    if (prev) prev.addEventListener('click', () => set(cur - 1));
    if (next) next.addEventListener('click', () => set(cur + 1));
    set(cur);
  });

  /* ------------------------------------------------------------------------
     24. 기타 — 알림 닫기
     ------------------------------------------------------------------------ */
  doc.addEventListener('click', (e) => {
    const b = e.target.closest('[data-dismiss]');
    if (!b) return;
    const box = b.closest('.alert, [data-dismissible]');
    if (box) box.hidden = true;
  });

  window.Oseon = { toast, openLayer, closeLayer, setTheme: (t) => { if (valid(t)) { store.set(t); applyTheme(t); } }, setGrid, redraw };
})();
