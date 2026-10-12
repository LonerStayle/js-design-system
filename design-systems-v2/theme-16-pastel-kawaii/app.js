/* ==========================================================================
   폭닥문방구 디자인 시스템 v2 — app.js (바닐라, 외부 라이브러리 없음)
   테마 · 레이어(모달/드로어/⌘K/팝오버/메뉴) · 탭 · 아코디언 · 토스트+버스트 ·
   캐러셀 · 표 정렬/선택 · 달력 · 칸반 · 폼 검증 · 칩/세그먼트/수량/슬라이더 ·
   마키 · 복사 · 페이지네이션 · 모션 시연 · 알림 닫기 · 툴팁 Esc
   마크업 계약은 COMPONENTS.md 참고.
   ========================================================================== */
(() => {
  'use strict';

  const doc = document;
  const root = doc.documentElement;
  const STORE_KEY = 'pokdak-theme';
  const $ = (sel, ctx = doc) => ctx.querySelector(sel);
  const $$ = (sel, ctx = doc) => Array.from(ctx.querySelectorAll(sel));
  const byId = (id) => (id ? doc.getElementById(id.replace(/^#/, '')) : null);
  const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let uid = 0;
  const ensureId = (el, prefix) => { if (!el.id) el.id = `${prefix}-${++uid}`; return el.id; };
  const later = (ms) => new Promise((r) => setTimeout(r, reduced() ? 0 : ms));

  const store = {
    get() { try { return localStorage.getItem(STORE_KEY); } catch (e) { return null; } },
    set(v) { try { localStorage.setItem(STORE_KEY, v); } catch (e) { /* 저장 불가 환경 */ } },
  };

  /* ------------------------------------------------------------------------
     1. 테마 — 우선순위: ?theme= → localStorage → prefers-color-scheme
     ------------------------------------------------------------------------ */
  const scheme = window.matchMedia('(prefers-color-scheme: dark)');
  const queryTheme = () => {
    const t = new URLSearchParams(window.location.search).get('theme');
    return t === 'dark' || t === 'light' ? t : null;
  };
  const storedTheme = () => { const t = store.get(); return t === 'dark' || t === 'light' ? t : null; };
  const resolveTheme = () => queryTheme() || storedTheme() || (scheme.matches ? 'dark' : 'light');

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    $$('[data-theme-toggle]').forEach((btn) => {
      btn.setAttribute('aria-pressed', String(theme === 'dark'));
      if (!btn.hasAttribute('aria-label')) btn.setAttribute('aria-label', '밤 다꾸 모드');
      const label = $('[data-theme-label]', btn);
      if (label) label.textContent = theme === 'dark' ? '밤 다꾸' : '낮 다꾸';
    });
  }
  applyTheme(resolveTheme());
  const onScheme = () => { if (!queryTheme() && !storedTheme()) applyTheme(resolveTheme()); };
  if (scheme.addEventListener) scheme.addEventListener('change', onScheme);

  doc.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-theme-toggle]');
    if (!btn) return;
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    store.set(next);
    applyTheme(next);
    burst(btn);
  });

  /* ------------------------------------------------------------------------
     2. 버스트 — 붙는 순간 레몬 별 3개 (반짝이는 이것 하나뿐)
     ------------------------------------------------------------------------ */
  function burst(el) {
    if (!el || reduced()) return;
    const r = el.getBoundingClientRect();
    const b = doc.createElement('span');
    b.className = 'burst';
    b.setAttribute('aria-hidden', 'true');
    b.style.left = `${r.left + r.width / 2}px`;
    b.style.top = `${r.top + Math.min(12, r.height / 3)}px`;
    b.innerHTML = '<i></i><i></i><i></i>';
    doc.body.appendChild(b);
    setTimeout(() => b.remove(), 420);
  }
  function stick(el) {
    if (!el) return;
    el.classList.remove('is-sticking');
    void el.offsetWidth; // 애니메이션 재시작
    el.classList.add('is-sticking');
    el.addEventListener('animationend', () => el.classList.remove('is-sticking'), { once: true });
    burst(el);
  }

  /* ------------------------------------------------------------------------
     3. 레이어 스택 — Esc · 포커스 트랩 · 스크롤 잠금 · 바깥 클릭
     ------------------------------------------------------------------------ */
  const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
  const focusables = (el) => $$(FOCUSABLE, el).filter((n) => !n.closest('[hidden],[inert]') && n.getClientRects().length > 0);
  const layers = [];
  const pushLayer = (l) => { const i = layers.indexOf(l); if (i > -1) layers.splice(i, 1); layers.push(l); syncLock(); };
  const dropLayer = (l) => { const i = layers.indexOf(l); if (i > -1) layers.splice(i, 1); syncLock(); };
  const syncLock = () => root.classList.toggle('is-locked', layers.some((l) => l.lock));

  function trapTab(e, box) {
    const list = focusables(box);
    if (!list.length) { e.preventDefault(); box.focus(); return; }
    const first = list[0];
    const last = list[list.length - 1];
    const a = doc.activeElement;
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

  /* ---- 모달 · 드로어 · 커맨드 (공통 다이얼로그) ------------------------- */
  function dialogApi(el) {
    if (el.pkDialog) return el.pkDialog;
    const box = $('.modal__note, .drawer__panel, .cmd__sheet', el) || el;
    if (!box.hasAttribute('tabindex')) box.setAttribute('tabindex', '-1');
    let returnTo = null;
    const layer = {
      box, lock: true, trap: true, trigger: null,
      open(trigger) {
        if (!el.hidden) return;
        returnTo = trigger || doc.activeElement;
        el.hidden = false;
        el.classList.remove('is-closing');
        pushLayer(layer);
        const auto = $('[autofocus], [data-autofocus]', el) || focusables(box)[0] || box;
        requestAnimationFrame(() => auto.focus({ preventScroll: true }));
        el.dispatchEvent(new CustomEvent('pk:open'));
      },
      async close(restore = true) {
        if (el.hidden) return;
        dropLayer(layer);
        el.classList.add('is-closing');
        await later(220);
        el.hidden = true;
        el.classList.remove('is-closing');
        if (restore && returnTo && returnTo.focus) returnTo.focus({ preventScroll: true });
        el.dispatchEvent(new CustomEvent('pk:close'));
      },
    };
    $$('.modal__scrim, .drawer__scrim, .cmd__scrim', el).forEach((s) => s.addEventListener('click', () => layer.close(true)));
    el.pkDialog = layer;
    if (el.classList.contains('cmd')) initCommand(el);
    return layer;
  }

  doc.addEventListener('click', (e) => {
    const opener = e.target.closest('[data-open]');
    if (opener) {
      const target = byId(opener.getAttribute('data-open'));
      if (target) { e.preventDefault(); dialogApi(target).open(opener); }
      return;
    }
    const closer = e.target.closest('[data-close]');
    if (closer) {
      const host = closer.getAttribute('data-close') ? byId(closer.getAttribute('data-close')) : closer.closest('.modal, .drawer, .cmd');
      if (host && host.pkDialog) host.pkDialog.close(true);
      else if (host) dialogApi(host).close(true);
    }
  });

  /* ---- ⌘K 스티커 검색 시트 -------------------------------------------- */
  function initCommand(el) {
    const input = $('.cmd__input', el);
    const list = $('.cmd__list', el);
    const empty = $('.cmd__empty', el);
    if (!input || !list) return;
    ensureId(list, 'cmd-list');
    input.setAttribute('role', 'combobox');
    input.setAttribute('aria-controls', list.id);
    input.setAttribute('aria-expanded', 'true');
    input.setAttribute('aria-autocomplete', 'list');
    list.setAttribute('role', 'listbox');
    const opts = () => $$('.cmd__opt', list).filter((o) => !o.hidden && o.getAttribute('aria-disabled') !== 'true');
    $$('.cmd__opt', list).forEach((o) => { ensureId(o, 'cmd-opt'); o.setAttribute('role', 'option'); o.dataset.text = (o.dataset.text || o.textContent).replace(/\s+/g, ' ').trim(); });
    let active = -1;
    const setActive = (i) => {
      const all = opts();
      $$('.cmd__opt', list).forEach((o) => o.setAttribute('aria-selected', 'false'));
      if (!all.length) { input.removeAttribute('aria-activedescendant'); active = -1; return; }
      active = (i + all.length) % all.length;
      all[active].setAttribute('aria-selected', 'true');
      input.setAttribute('aria-activedescendant', all[active].id);
      all[active].scrollIntoView({ block: 'nearest' });
    };
    const filter = () => {
      const q = input.value.trim().toLowerCase();
      $$('.cmd__opt', list).forEach((o) => { o.hidden = q && !o.dataset.text.toLowerCase().includes(q); });
      $$('.cmd__group', list).forEach((g) => { g.hidden = !$$('.cmd__opt', g).some((o) => !o.hidden); });
      const has = opts().length > 0;
      if (empty) empty.hidden = has;
      setActive(0);
    };
    input.addEventListener('input', filter);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') { e.preventDefault(); setActive(active + 1); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(active - 1); }
      else if (e.key === 'Enter') { const o = opts()[active]; if (o) { e.preventDefault(); o.click(); } }
    });
    list.addEventListener('pointermove', (e) => { const o = e.target.closest('.cmd__opt'); if (o) setActive(opts().indexOf(o)); });
    list.addEventListener('click', (e) => {
      const o = e.target.closest('.cmd__opt');
      if (!o || o.getAttribute('aria-disabled') === 'true') return;
      const href = o.getAttribute('data-href');
      el.pkDialog.close(false);
      if (href) window.location.href = href;
      else toast({ title: o.dataset.toast || '붙였어요', text: o.dataset.text, tone: 'ok' });
    });
    el.addEventListener('pk:open', () => { input.value = ''; filter(); });
    filter();
  }
  doc.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
      const cmd = $('.cmd[data-cmd-default]') || $$('.cmd').find((c) => !c.classList.contains('cmd--static'));
      if (!cmd) return;
      e.preventDefault();
      const api = dialogApi(cmd);
      if (cmd.hidden) api.open(doc.activeElement); else api.close(true);
    }
  });

  /* ---- 팝오버 · 메뉴 (트랩 없는 레이어) -------------------------------- */
  function floatingApi(panel, trigger, kind) {
    if (panel.pkFloat) { panel.pkFloat.trigger = trigger; return panel.pkFloat; }
    const layer = {
      box: panel, lock: false, trap: false, trigger,
      open() {
        panel.hidden = false;
        panel.classList.remove('is-closing');
        layer.trigger.setAttribute('aria-expanded', 'true');
        pushLayer(layer);
        if (kind === 'menu') { const first = items()[0]; if (first) first.focus(); }
      },
      async close(restore = true) {
        if (panel.hidden) return;
        dropLayer(layer);
        layer.trigger.setAttribute('aria-expanded', 'false');
        panel.classList.add('is-closing');
        await later(140);
        panel.hidden = true;
        panel.classList.remove('is-closing');
        if (restore) layer.trigger.focus({ preventScroll: true });
      },
      toggle() { if (panel.hidden) layer.open(); else layer.close(true); },
    };
    const items = () => $$('.menu__item', panel).filter((i) => i.getAttribute('aria-disabled') !== 'true');
    if (kind === 'menu') {
      panel.setAttribute('role', 'menu');
      $$('.menu__item', panel).forEach((i) => {
        if (!i.getAttribute('role')) i.setAttribute('role', 'menuitem');
        i.setAttribute('tabindex', '-1');
      });
      panel.addEventListener('keydown', (e) => {
        const list = items();
        const i = list.indexOf(doc.activeElement);
        if (e.key === 'ArrowDown') { e.preventDefault(); list[(i + 1) % list.length].focus(); }
        else if (e.key === 'ArrowUp') { e.preventDefault(); list[(i - 1 + list.length) % list.length].focus(); }
        else if (e.key === 'Home') { e.preventDefault(); list[0].focus(); }
        else if (e.key === 'End') { e.preventDefault(); list[list.length - 1].focus(); }
        else if (e.key === 'Tab') { layer.close(false); }
      });
      panel.addEventListener('click', (e) => {
        const it = e.target.closest('.menu__item');
        if (!it) return;
        if (it.getAttribute('aria-disabled') === 'true') { e.preventDefault(); return; }
        if (it.getAttribute('role') === 'menuitemcheckbox' || it.getAttribute('role') === 'menuitemradio') {
          if (it.getAttribute('role') === 'menuitemradio') $$('[role="menuitemradio"]', panel).forEach((r) => r.setAttribute('aria-checked', 'false'));
          it.setAttribute('aria-checked', String(it.getAttribute('aria-checked') !== 'true'));
          return;
        }
        if (it.dataset.toast) toast({ title: it.dataset.toast, tone: it.classList.contains('menu__item--danger') ? 'err' : 'ok' });
        layer.close(true);
      });
    }
    panel.pkFloat = layer;
    return layer;
  }
  doc.addEventListener('click', (e) => {
    const t = e.target.closest('[data-popover], [data-menu]');
    if (!t) return;
    const kind = t.hasAttribute('data-menu') ? 'menu' : 'popover';
    const panel = byId(t.getAttribute(kind === 'menu' ? 'data-menu' : 'data-popover'));
    if (!panel) return;
    e.preventDefault();
    floatingApi(panel, t, kind).toggle();
  });
  doc.addEventListener('keydown', (e) => {
    const t = e.target.closest && e.target.closest('[data-menu]');
    if (t && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      const panel = byId(t.getAttribute('data-menu'));
      if (!panel) return;
      e.preventDefault();
      const api = floatingApi(panel, t, 'menu');
      if (panel.hidden) api.open();
    }
  });

  /* ------------------------------------------------------------------------
     4. 탭 — 인덱스 탭 (←→ Home End)
     ------------------------------------------------------------------------ */
  function initTabs(box) {
    const list = $('[role="tablist"]', box);
    if (!list || list.pkTabs) return;
    list.pkTabs = true;
    const tabs = () => $$('[role="tab"]', list).filter((t) => !t.disabled && t.getAttribute('aria-disabled') !== 'true');
    const select = (tab, focus) => {
      $$('[role="tab"]', list).forEach((t) => {
        const on = t === tab;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        const p = byId(t.getAttribute('aria-controls'));
        if (p) {
          p.hidden = !on;
          if (on) { p.classList.remove('is-entering'); void p.offsetWidth; p.classList.add('is-entering'); }
        }
      });
      if (focus) tab.focus();
      tab.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    };
    list.addEventListener('click', (e) => { const t = e.target.closest('[role="tab"]'); if (t && tabs().includes(t)) select(t, false); });
    list.addEventListener('keydown', (e) => {
      const all = tabs();
      const i = all.indexOf(doc.activeElement);
      if (i < 0) return;
      let n = null;
      if (e.key === 'ArrowRight') n = all[(i + 1) % all.length];
      else if (e.key === 'ArrowLeft') n = all[(i - 1 + all.length) % all.length];
      else if (e.key === 'Home') n = all[0];
      else if (e.key === 'End') n = all[all.length - 1];
      if (n) { e.preventDefault(); select(n, true); }
    });
    const cur = $('[role="tab"][aria-selected="true"]', list) || tabs()[0];
    $$('[role="tab"]', list).forEach((t) => { t.tabIndex = t === cur ? 0 : -1; const p = byId(t.getAttribute('aria-controls')); if (p) p.hidden = t !== cur; });
    watchOverflow(list);
  }

  /* 가로 스크롤 영역 — 더 있으면 .has-more(오른쪽 페이드) */
  function watchOverflow(el, endClass) {
    const sync = () => {
      const more = el.scrollWidth - el.clientWidth - el.scrollLeft > 4;
      el.classList.toggle('has-more', more);
      if (endClass) el.classList.toggle(endClass, !more);
    };
    el.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', sync);
    sync();
  }

  /* ------------------------------------------------------------------------
     5. 아코디언 — 접힌 메모지 (data-accordion="single"이면 하나만)
     ------------------------------------------------------------------------ */
  function initAccordion(box) {
    if (box.pkAcc) return;
    box.pkAcc = true;
    const single = box.getAttribute('data-accordion') === 'single';
    const btns = $$('.acc__btn', box);
    btns.forEach((b) => {
      const p = byId(b.getAttribute('aria-controls'));
      if (p) p.hidden = b.getAttribute('aria-expanded') !== 'true';
    });
    box.addEventListener('click', (e) => {
      const b = e.target.closest('.acc__btn');
      if (!b || b.getAttribute('aria-disabled') === 'true') return;
      const open = b.getAttribute('aria-expanded') !== 'true';
      if (single && open) btns.forEach((o) => { if (o !== b) { o.setAttribute('aria-expanded', 'false'); const p = byId(o.getAttribute('aria-controls')); if (p) p.hidden = true; } });
      b.setAttribute('aria-expanded', String(open));
      const p = byId(b.getAttribute('aria-controls'));
      if (p) p.hidden = !open;
    });
  }

  /* ------------------------------------------------------------------------
     6. 토스트 — 스티커가 툭 붙고 4초 뒤 떼어짐
     ------------------------------------------------------------------------ */
  const ICONS = {
    ok: '<path d="M5 12.5l4.2 4.2L19 7"/>',
    err: '<path d="M12 7v6M12 16.5v.5"/><circle cx="12" cy="12" r="9"/>',
    warn: '<path d="M12 4l9 16H3z"/><path d="M12 10v4M12 17v.5"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8v.5"/>',
    '': '<path d="M12 3l2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.6 6.6 19.5l1.2-6L3.3 9.3l6.1-.7z"/>',
  };
  function toaster() {
    let z = $('.toaster');
    if (!z) {
      z = doc.createElement('div');
      z.className = 'toaster';
      z.setAttribute('role', 'region');
      z.setAttribute('aria-label', '알림 스티커');
      doc.body.appendChild(z);
    }
    return z;
  }
  function toast({ title = '', text = '', tone = '', duration = 4000, action = '' } = {}) {
    const zone = toaster();
    const t = doc.createElement('div');
    t.className = `toast${tone ? ` toast--${tone}` : ''}`;
    t.setAttribute('role', tone === 'err' ? 'alert' : 'status');
    t.innerHTML = `<span class="toast__icon" aria-hidden="true"><svg class="ico" viewBox="0 0 24 24">${ICONS[tone] || ICONS['']}</svg></span>
      <div><p class="toast__title"></p></div>
      <button class="toast__close" type="button" aria-label="알림 떼기"><svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button>`;
    $('.toast__title', t).textContent = title;
    if (text) { const p = doc.createElement('p'); p.className = 'toast__text'; p.textContent = text; t.appendChild(p); }
    if (action) { const a = doc.createElement('button'); a.type = 'button'; a.className = 'toast__action'; a.textContent = action; t.appendChild(a); a.addEventListener('click', () => dismiss()); }
    zone.appendChild(t);
    burst(t);
    let timer = null;
    let gone = false;
    const dismiss = async () => {
      if (gone) return;
      gone = true;
      clearTimeout(timer);
      t.classList.add('is-peeling');
      await later(320);
      t.remove();
    };
    const arm = () => { clearTimeout(timer); if (duration > 0) timer = setTimeout(dismiss, duration); };
    t.addEventListener('mouseenter', () => clearTimeout(timer));
    t.addEventListener('mouseleave', arm);
    t.addEventListener('focusin', () => clearTimeout(timer));
    t.addEventListener('focusout', arm);
    $('.toast__close', t).addEventListener('click', dismiss);
    arm();
    return { el: t, dismiss };
  }
  doc.addEventListener('click', (e) => {
    const b = e.target.closest('[data-toast]');
    if (!b || b.closest('.menu, .cmd')) return;
    toast({ title: b.getAttribute('data-toast'), text: b.getAttribute('data-toast-text') || '', tone: b.getAttribute('data-toast-tone') || '' });
  });

  /* ------------------------------------------------------------------------
     7. 캐러셀 — 스티커 팩 넘기기 (←→ · 호버/포커스 시 정지)
     ------------------------------------------------------------------------ */
  function initCarousel(box) {
    if (box.pkCar) return;
    box.pkCar = true;
    const track = $('.carousel__track', box);
    const slides = $$('.carousel__slide', box);
    if (!track || !slides.length) return;
    const prev = $('.carousel__btn--prev', box);
    const next = $('.carousel__btn--next', box);
    const dots = $$('.carousel__dot', box);
    const thumbs = $$('.carousel__thumb', box);
    const status = $('.carousel__status', box);
    const loop = box.hasAttribute('data-loop');
    let i = Math.max(0, slides.findIndex((s) => s.classList.contains('is-current')));
    box.setAttribute('role', box.getAttribute('role') || 'region');
    box.setAttribute('aria-roledescription', '스티커 팩');
    slides.forEach((s, n) => { s.setAttribute('role', 'group'); s.setAttribute('aria-roledescription', '시트'); if (!s.hasAttribute('aria-label')) s.setAttribute('aria-label', `${slides.length}장 중 ${n + 1}번째`); });
    const go = (n, user) => {
      i = loop ? (n + slides.length) % slides.length : Math.max(0, Math.min(slides.length - 1, n));
      track.style.translate = `${-100 * i}% 0`;
      slides.forEach((s, k) => { const on = k === i; s.setAttribute('aria-hidden', String(!on)); s.inert = !on; });
      dots.forEach((d, k) => d.setAttribute('aria-current', String(k === i)));
      thumbs.forEach((d, k) => d.setAttribute('aria-current', String(k === i)));
      if (prev) prev.disabled = !loop && i === 0;
      if (next) next.disabled = !loop && i === slides.length - 1;
      if (status) status.innerHTML = `<span class="num">${i + 1}</span> / <span class="num">${slides.length}</span>장`;
      if (user) stop();
    };
    if (prev) prev.addEventListener('click', () => go(i - 1, true));
    if (next) next.addEventListener('click', () => go(i + 1, true));
    dots.forEach((d, k) => d.addEventListener('click', () => go(k, true)));
    thumbs.forEach((d, k) => d.addEventListener('click', () => go(k, true)));
    box.addEventListener('keydown', (e) => {
      if (e.target.closest('input, textarea')) return;
      if (e.key === 'ArrowRight') { e.preventDefault(); go(i + 1, true); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(i - 1, true); }
    });
    // 스와이프
    let sx = null;
    track.addEventListener('pointerdown', (e) => { sx = e.clientX; });
    track.addEventListener('pointerup', (e) => { if (sx === null) return; const dx = e.clientX - sx; if (Math.abs(dx) > 40) go(i + (dx < 0 ? 1 : -1), true); sx = null; });
    // 자동 넘김
    const ms = parseInt(box.getAttribute('data-autoplay'), 10);
    let timer = null;
    const play = () => { if (!ms || reduced()) return; clearInterval(timer); timer = setInterval(() => go(i + 1 >= slides.length ? 0 : i + 1), ms); };
    const stop = () => { clearInterval(timer); timer = null; };
    box.addEventListener('mouseenter', stop);
    box.addEventListener('focusin', stop);
    box.addEventListener('mouseleave', () => { if (!box.contains(doc.activeElement)) play(); });
    go(i);
    play();
  }

  /* ------------------------------------------------------------------------
     8. 표 — 정렬 · 행 선택 · 가로 페이드
     ------------------------------------------------------------------------ */
  function initTable(table) {
    if (table.pkTable) return;
    table.pkTable = true;
    const tbody = table.tBodies[0];
    $$('.table__sort', table).forEach((btn) => {
      btn.addEventListener('click', () => {
        const th = btn.closest('th');
        const col = Array.from(th.parentElement.children).indexOf(th);
        const dir = th.getAttribute('aria-sort') === 'ascending' ? 'descending' : 'ascending';
        $$('th[aria-sort]', table).forEach((h) => h.setAttribute('aria-sort', 'none'));
        th.setAttribute('aria-sort', dir);
        const val = (tr) => {
          const c = tr.children[col];
          if (!c) return '';
          const raw = c.getAttribute('data-sort') || c.textContent.trim();
          const n = parseFloat(raw.replace(/[₩,%\s개건명]/g, ''));
          return Number.isNaN(n) ? raw : n;
        };
        const rows = Array.from(tbody.rows);
        rows.sort((a, b) => {
          const x = val(a); const y = val(b);
          const r = typeof x === 'number' && typeof y === 'number' ? x - y : String(x).localeCompare(String(y), 'ko');
          return dir === 'ascending' ? r : -r;
        });
        rows.forEach((r) => tbody.appendChild(r));
      });
    });
    table.addEventListener('change', (e) => {
      const cb = e.target.closest('input[type="checkbox"]');
      if (!cb) return;
      if (cb.hasAttribute('data-select-all')) {
        $$('tbody input[type="checkbox"]', table).forEach((c) => { c.checked = cb.checked; c.closest('tr').setAttribute('aria-selected', String(cb.checked)); });
        return;
      }
      const tr = cb.closest('tbody tr');
      if (tr) tr.setAttribute('aria-selected', String(cb.checked));
      const all = $('[data-select-all]', table);
      if (all) {
        const boxes = $$('tbody input[type="checkbox"]', table);
        const on = boxes.filter((c) => c.checked).length;
        all.checked = on === boxes.length;
        all.indeterminate = on > 0 && on < boxes.length;
      }
    });
    const scroller = table.closest('.ledger__scroll');
    if (scroller) watchOverflow(scroller);
  }

  /* ------------------------------------------------------------------------
     9. 달력 — 날짜 고르기 (방향키로 칸 이동)
     ------------------------------------------------------------------------ */
  function initCalendar(cal) {
    if (cal.pkCal) return;
    cal.pkCal = true;
    const days = () => $$('.cal__day:not([disabled]):not([aria-disabled="true"])', cal);
    cal.addEventListener('click', (e) => {
      const d = e.target.closest('.cal__day');
      if (!d || d.disabled || d.getAttribute('aria-disabled') === 'true') return;
      $$('.cal__day[aria-pressed]', cal).forEach((x) => x.setAttribute('aria-pressed', 'false'));
      d.setAttribute('aria-pressed', 'true');
      cal.dispatchEvent(new CustomEvent('pk:date', { detail: { date: d.getAttribute('data-date') } }));
    });
    cal.addEventListener('keydown', (e) => {
      const all = $$('.cal__day', cal);
      const i = all.indexOf(doc.activeElement);
      if (i < 0) return;
      const step = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: 7, ArrowUp: -7 }[e.key];
      if (!step) return;
      e.preventDefault();
      let n = i + step;
      while (all[n] && (all[n].disabled || all[n].getAttribute('aria-disabled') === 'true')) n += step > 0 ? 1 : -1;
      if (all[n]) all[n].focus();
    });
    if (!days().length) return;
  }

  /* ------------------------------------------------------------------------
     10. 칸반 — 포스트잇 드래그 · 키보드(Space 집기 → 방향키 → Space 놓기)
     ------------------------------------------------------------------------ */
  function initKanban(board) {
    if (board.pkKan) return;
    board.pkKan = true;
    const cols = () => $$('.kanban__col', board);
    const listOf = (col) => $('.kanban__list', col);
    let live = $('.kanban__live', board);
    if (!live) { live = doc.createElement('p'); live.className = 'kanban__live'; live.setAttribute('aria-live', 'assertive'); board.appendChild(live); }
    const say = (m) => { live.textContent = m; };
    const colName = (col) => ($('.kanban__title', col) || {}).textContent || '';
    const sync = () => cols().forEach((c) => { const n = $('.kanban__count', c); if (n) n.textContent = String($$('.postit', listOf(c)).length + (Number(c.dataset.more) || 0)); }); // data-more = 미리보기에서 접어 둔 장 수
    const dropped = (card) => {
      card.classList.remove('is-dropped'); void card.offsetWidth; card.classList.add('is-dropped');
      card.addEventListener('animationend', () => card.classList.remove('is-dropped'), { once: true });
      burst(card);
      sync();
    };
    $$('.postit', board).forEach((c) => { if (!c.hasAttribute('tabindex')) c.tabIndex = 0; c.setAttribute('aria-roledescription', '포스트잇'); });
    watchOverflow(board, 'is-end');

    // 포인터 드래그
    let drag = null;
    board.addEventListener('pointerdown', (e) => {
      const card = e.target.closest('.postit');
      if (!card || e.button !== 0 || card.getAttribute('aria-disabled') === 'true' || e.target.closest('button, a, input')) return;
      const r = card.getBoundingClientRect();
      drag = { card, sx: e.clientX, sy: e.clientY, dx: e.clientX - r.left, dy: e.clientY - r.top, moved: false, ghost: null, w: r.width };
      card.setPointerCapture(e.pointerId);
    });
    board.addEventListener('pointermove', (e) => {
      if (!drag) return;
      if (!drag.moved && Math.hypot(e.clientX - drag.sx, e.clientY - drag.sy) < 6) return;
      if (!drag.moved) {
        drag.moved = true;
        const g = drag.card.cloneNode(true);
        g.classList.add('is-dragging');
        g.removeAttribute('id');
        g.setAttribute('aria-hidden', 'true');
        Object.assign(g.style, { position: 'fixed', left: '0', top: '0', width: `${drag.w}px`, pointerEvents: 'none', margin: '0', zIndex: '200' });
        doc.body.appendChild(g);
        drag.ghost = g;
        drag.card.classList.add('is-ghost');
      }
      drag.ghost.style.transform = `translate(${e.clientX - drag.dx}px, ${e.clientY - drag.dy}px)`;
      const over = doc.elementFromPoint(e.clientX, e.clientY);
      const list = over && over.closest('.kanban__list');
      $$('.kanban__list', board).forEach((l) => l.classList.toggle('is-over', l === list));
      if (list && board.contains(list)) {
        const after = $$('.postit:not(.is-ghost)', list).find((c) => { const r = c.getBoundingClientRect(); return e.clientY < r.top + r.height / 2; });
        if (after) list.insertBefore(drag.card, after); else list.appendChild(drag.card);
      }
    });
    const end = () => {
      if (!drag) return;
      const { card, moved, ghost } = drag;
      drag = null;
      $$('.kanban__list', board).forEach((l) => l.classList.remove('is-over'));
      if (!moved) return;
      if (ghost) ghost.remove();
      card.classList.remove('is-ghost');
      dropped(card);
      say(`${colName(card.closest('.kanban__col'))} 열에 붙였어요`);
    };
    board.addEventListener('pointerup', end);
    board.addEventListener('pointercancel', end);

    // 키보드
    board.addEventListener('keydown', (e) => {
      const card = e.target.closest('.postit');
      if (!card || e.target !== card) return;
      const lifted = card.getAttribute('aria-pressed') === 'true';
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        if (!lifted) { card.setAttribute('aria-pressed', 'true'); say('포스트잇을 들었어요. 방향키로 옮기고 스페이스로 붙여요.'); }
        else { card.setAttribute('aria-pressed', 'false'); dropped(card); say(`${colName(card.closest('.kanban__col'))} 열에 붙였어요`); }
        return;
      }
      if (e.key === 'Escape' && lifted) { card.setAttribute('aria-pressed', 'false'); say('내려놓았어요'); return; }
      if (!lifted) return;
      const col = card.closest('.kanban__col');
      const all = cols();
      const ci = all.indexOf(col);
      const list = listOf(col);
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        e.preventDefault();
        const to = all[ci + (e.key === 'ArrowRight' ? 1 : -1)];
        if (!to) return;
        listOf(to).appendChild(card);
        card.focus();
        say(`${colName(to)} 열로 옮겼어요`);
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault();
        const sib = e.key === 'ArrowUp' ? card.previousElementSibling : card.nextElementSibling;
        if (!sib || !sib.classList.contains('postit')) return;
        if (e.key === 'ArrowUp') list.insertBefore(card, sib); else list.insertBefore(sib, card);
        card.focus();
      }
    });
    sync();
  }

  /* ------------------------------------------------------------------------
     11. 폼 — 검증 · 슬라이더 · 칩 · 세그먼트 · 수량
     ------------------------------------------------------------------------ */
  const MSG = {
    valueMissing: '앗, 이 칸이 비었어요',
    typeMismatch: '모양이 조금 달라요. 다시 확인해 주세요',
    patternMismatch: '형식이 맞지 않아요',
    tooShort: '조금 더 적어 주세요',
    rangeUnderflow: '너무 작아요',
    rangeOverflow: '너무 커요',
  };
  function fieldError(input) {
    const v = input.validity;
    if (v.valid) return '';
    if (input.dataset.error) return input.dataset.error;
    const k = Object.keys(MSG).find((key) => v[key]);
    return MSG[k] || '다시 확인해 주세요';
  }
  function setError(input, msg) {
    const field = input.closest('.field');
    input.setAttribute('aria-invalid', String(Boolean(msg)));
    if (!field) return;
    let err = $('.field__error', field);
    if (!err && msg) {
      err = doc.createElement('p');
      err.className = 'field__error';
      field.appendChild(err);
    }
    if (err) {
      ensureId(err, 'err');
      err.textContent = msg;
      err.hidden = !msg;
      const ids = (input.getAttribute('aria-describedby') || '').split(' ').filter((x) => x && x !== err.id);
      if (msg) ids.push(err.id);
      if (ids.length) input.setAttribute('aria-describedby', ids.join(' ')); else input.removeAttribute('aria-describedby');
    }
  }
  function initForm(form) {
    if (form.pkForm) return;
    form.pkForm = true;
    form.setAttribute('novalidate', '');
    const fields = () => $$('input, textarea, select', form).filter((f) => f.willValidate && f.type !== 'hidden');
    form.addEventListener('submit', (e) => {
      let first = null;
      fields().forEach((f) => { const m = fieldError(f); setError(f, m); if (m && !first) first = f; });
      if (first) { e.preventDefault(); first.focus(); return; }
      if (form.hasAttribute('data-demo')) {
        e.preventDefault();
        const btn = $('[type="submit"]', form);
        if (btn) btn.setAttribute('aria-busy', 'true');
        setTimeout(() => {
          if (btn) btn.removeAttribute('aria-busy');
          toast({ title: form.getAttribute('data-success') || '저장했어요', text: form.getAttribute('data-success-text') || '', tone: 'ok' });
          form.removeAttribute('data-dirty');
        }, reduced() ? 0 : 900);
      }
    });
    form.addEventListener('input', (e) => { const f = e.target; if (f.getAttribute('aria-invalid') === 'true') setError(f, fieldError(f)); });
    // 바꾼 게 생기면 [data-dirty] — 저장 띠가 그때만 쪽 아래에 따라붙는다(settings)
    const markDirty = (e) => { if (e.target.closest && e.target.closest('[role="search"]')) return; form.setAttribute('data-dirty', ''); };
    form.addEventListener('input', markDirty);
    form.addEventListener('change', markDirty);
    form.addEventListener('reset', () => form.removeAttribute('data-dirty'));
    form.addEventListener('focusout', (e) => { const f = e.target; if (f.willValidate && f.value) setError(f, fieldError(f)); });
  }

  function syncRange(r) {
    const min = parseFloat(r.min || 0); const max = parseFloat(r.max || 100);
    const pct = ((parseFloat(r.value) - min) / (max - min)) * 100;
    r.style.setProperty('--val', `${pct}%`);
    const out = r.id ? $(`[data-range-out="${r.id}"]`) : null;
    if (out) out.textContent = (out.getAttribute('data-format') || '{v}').replace('{v}', Number(r.value).toLocaleString('ko-KR'));
  }
  doc.addEventListener('input', (e) => { if (e.target.matches('.range')) syncRange(e.target); });

  doc.addEventListener('click', (e) => {
    // 칩 — 고르면 붙는다
    const chip = e.target.closest('.chip');
    if (chip && !chip.disabled && chip.getAttribute('aria-disabled') !== 'true' && chip.hasAttribute('aria-pressed')) {
      const group = chip.closest('.chip-group');
      const on = chip.getAttribute('aria-pressed') !== 'true';
      const max = group ? parseInt(group.getAttribute('data-max'), 10) : 0;
      if (group && group.hasAttribute('data-single')) $$('.chip', group).forEach((c) => c.setAttribute('aria-pressed', 'false'));
      if (on && max && $$('.chip[aria-pressed="true"]', group).length >= max) {
        toast({ title: `${max}개까지 고를 수 있어요`, tone: 'warn' });
        return;
      }
      chip.setAttribute('aria-pressed', String(on));
      if (on) burst(chip);
      if (group) group.dispatchEvent(new CustomEvent('pk:chips', { bubbles: true, detail: { values: $$('.chip[aria-pressed="true"]', group).map((c) => c.value || c.textContent.trim()) } }));
      return;
    }
    // 세그먼트
    const seg = e.target.closest('.seg__btn');
    if (seg) {
      const box = seg.closest('.seg');
      $$('.seg__btn', box).forEach((b) => b.setAttribute('aria-pressed', String(b === seg)));
      box.dispatchEvent(new CustomEvent('pk:seg', { bubbles: true, detail: { value: seg.value || seg.dataset.value } }));
      $$(`[data-seg-show]`).forEach((el) => { if (el.closest('[data-seg-scope]') === box.closest('[data-seg-scope]')) el.hidden = el.getAttribute('data-seg-show') !== (seg.value || seg.dataset.value); });
      return;
    }
    // 수량
    const q = e.target.closest('.qty__btn');
    if (q) {
      const box = q.closest('.qty');
      const input = $('.qty__val', box);
      const step = parseInt(q.getAttribute('data-step'), 10) || 1;
      const min = parseInt(input.min || '1', 10); const max = parseInt(input.max || '99', 10);
      input.value = String(Math.max(min, Math.min(max, (parseInt(input.value, 10) || min) + step)));
      $$('.qty__btn', box).forEach((b) => { const s = parseInt(b.getAttribute('data-step'), 10); b.disabled = (s < 0 && +input.value <= min) || (s > 0 && +input.value >= max); });
      input.dispatchEvent(new Event('change', { bubbles: true }));
    }
  });

  /* ------------------------------------------------------------------------
     12. 마키 — 복제 그룹으로 무한 흐름 + 정지 버튼
     ------------------------------------------------------------------------ */
  function initMarquee(m) {
    if (m.pkMarq) return;
    m.pkMarq = true;
    const track = $('.marquee__track', m);
    const group = track && $('.marquee__group', track);
    if (!group) return;
    if ($$('.marquee__group', track).length < 2) {
      const copy = group.cloneNode(true);
      copy.setAttribute('aria-hidden', 'true');
      track.appendChild(copy);
    }
    const tg = $('.marquee__toggle', m);
    if (tg) {
      tg.setAttribute('aria-pressed', 'false');
      tg.addEventListener('click', () => {
        const paused = m.classList.toggle('is-paused');
        tg.setAttribute('aria-pressed', String(paused));
        tg.setAttribute('aria-label', paused ? '공지 테이프 다시 흐르기' : '공지 테이프 멈추기');
        tg.innerHTML = paused
          ? '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5l11 7-11 7z"/></svg>'
          : '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14M16 5v14"/></svg>';
      });
    }
  }

  /* ------------------------------------------------------------------------
     13. 기타 — 복사 · 페이지네이션 · 리스트 선택 · 알림 닫기 · 로딩 · 모션 · 툴팁
     ------------------------------------------------------------------------ */
  doc.addEventListener('click', async (e) => {
    const cp = e.target.closest('[data-copy]');
    if (cp) {
      const sel = cp.getAttribute('data-copy');
      const src = sel ? $(sel) : $('code', cp.closest('.codeblock'));
      const text = src ? src.innerText : '';
      try { await navigator.clipboard.writeText(text); } catch (err) { /* 클립보드 불가 */ }
      const label = $('[data-copy-label]', cp);
      const old = label ? label.textContent : '';
      cp.classList.add('is-done');
      if (label) label.textContent = '복사했어요';
      setTimeout(() => { cp.classList.remove('is-done'); if (label) label.textContent = old; }, 1600);
      return;
    }
    const pg = e.target.closest('[data-pager] .pager__page');
    if (pg && pg.tagName === 'BUTTON') {
      const box = pg.closest('[data-pager]');
      $$('.pager__page', box).forEach((p) => p.removeAttribute('aria-current'));
      pg.setAttribute('aria-current', 'page');
      stick(pg);
      return;
    }
    const row = e.target.closest('[data-select-list] .list__row');
    if (row) {
      const box = row.closest('[data-select-list]');
      $$('.list__row', box).forEach((r) => r.setAttribute('aria-current', String(r === row)));
      const item = row.closest('.list__item');
      if (item) item.classList.remove('is-unread');
      return;
    }
    const ac = e.target.closest('.alert__close');
    if (ac) {
      const al = ac.closest('.alert');
      al.classList.add('is-peeling');
      await later(300);
      al.hidden = true;
      return;
    }
    const ld = e.target.closest('[data-loading]');
    if (ld && ld.getAttribute('aria-busy') !== 'true') {
      ld.setAttribute('aria-busy', 'true');
      setTimeout(() => {
        ld.removeAttribute('aria-busy');
        const msg = ld.getAttribute('data-loading');
        if (msg) toast({ title: msg, tone: 'ok' });
      }, reduced() ? 0 : 1600);
      return;
    }
    const mo = e.target.closest('[data-motion]');
    if (mo) {
      const kind = mo.getAttribute('data-motion');
      const target = mo.getAttribute('data-motion-target') ? $(mo.getAttribute('data-motion-target')) : mo;
      if (kind === 'stick') stick(target);
      else if (kind === 'burst') burst(target);
      else if (kind === 'press') { target.classList.remove('is-pressing'); void target.offsetWidth; target.classList.add('is-pressing'); }
      else if (kind === 'stamp') { target.classList.remove('is-stamped'); void target.offsetWidth; target.classList.add('is-stamped'); }
      else if (kind === 'peel') {
        target.classList.add('is-peeling');
        await later(520);
        target.classList.remove('is-peeling');
        stick(target);
      }
    }
  });

  // 툴팁 — Esc로 숨김(WCAG 1.4.13)
  doc.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    $$('.tip').forEach((t) => { if (t.matches(':hover, :focus-within')) t.classList.add('is-hushed'); });
  });
  doc.addEventListener('mouseout', (e) => { const t = e.target.closest && e.target.closest('.tip'); if (t && !t.contains(e.relatedTarget)) t.classList.remove('is-hushed'); });
  doc.addEventListener('focusout', (e) => { const t = e.target.closest && e.target.closest('.tip'); if (t) t.classList.remove('is-hushed'); });

  /* ------------------------------------------------------------------------
     초기화
     ------------------------------------------------------------------------ */
  function init(scope = doc) {
    $$('.tabs', scope).forEach(initTabs);
    $$('[data-accordion]', scope).forEach(initAccordion);
    $$('[data-carousel]', scope).forEach(initCarousel);
    $$('table.table', scope).forEach(initTable);
    $$('[data-calendar]', scope).forEach(initCalendar);
    $$('[data-kanban]', scope).forEach(initKanban);
    $$('form[data-validate]', scope).forEach(initForm);
    $$('.marquee', scope).forEach(initMarquee);
    $$('.range', scope).forEach(syncRange);
    $$('.modal:not(.modal--static), .drawer:not(.drawer--static), .cmd:not(.cmd--static)', scope).forEach((el) => {
      if (!el.classList.contains('is-open')) el.hidden = true;
      dialogApi(el);
    });
    $$('[data-popover], [data-menu]', scope).forEach((t) => {
      if (!t.hasAttribute('aria-expanded')) t.setAttribute('aria-expanded', 'false');
      const panel = byId(t.getAttribute('data-popover') || t.getAttribute('data-menu'));
      if (panel && !panel.classList.contains('menu--static') && !panel.classList.contains('popover--static')) {
        panel.hidden = true;
        t.setAttribute('aria-controls', panel.id);
        if (t.hasAttribute('data-menu')) t.setAttribute('aria-haspopup', 'menu');
      }
    });
    applyTheme(root.getAttribute('data-theme') || resolveTheme());
  }

  window.Pokdak = {
    toast,
    burst,
    stick,
    setTheme(theme) { store.set(theme); applyTheme(theme); },
    open(id) { const el = byId(id); if (el) dialogApi(el).open(); },
    close(id) { const el = byId(id); if (el && el.pkDialog) el.pkDialog.close(true); },
    setProgress(el, pct) { const bar = typeof el === 'string' ? $(el) : el; if (!bar) return; const b = bar.matches('.progress__bar') ? bar : $('.progress__bar', bar); b.style.setProperty('--val', `${pct}%`); const pb = bar.closest('[role="progressbar"]') || bar; pb.setAttribute('aria-valuenow', String(Math.round(pct))); },
    init,
  };

  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', () => init());
  else init();
})();
