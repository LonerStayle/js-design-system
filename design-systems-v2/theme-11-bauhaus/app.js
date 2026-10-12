/* ==========================================================================
   모양학교 v2 — app.js (바닐라, 외부 라이브러리 없음)
   1 테마  2 레이어(모달·드로어·커맨드)  3 커맨드 팔레트(⌘K)  4 탭  5 아코디언
   6 토스트  7 팝오버  8 메뉴  9 툴팁  10 캐러셀  11 표 정렬  12 달력
   13 칸반  14 폼 검증  15 수량 스테퍼  16 단계 마법사  17 칸딘스키 칠하기
   18 마퀴  19 조립·막대 채움  20 코드 복사  21 선택 묶음  22 펼침 토글
   23 가로 넘침 힌트  24 불러오는 중 시연  25 쪽 넘김  26 알림 닫기  27 모션 상태
   마크업 계약은 COMPONENTS.md 참고.
   ========================================================================== */
(() => {
  'use strict';

  const doc = document;
  const root = doc.documentElement;
  const STORE_KEY = 'moyang-theme';
  const $ = (sel, ctx = doc) => ctx.querySelector(sel);
  const $$ = (sel, ctx = doc) => Array.from(ctx.querySelectorAll(sel));
  const byId = (id) => (id ? doc.getElementById(id) : null);
  const reducedQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const reduced = () => reducedQuery.matches;
  let uid = 0;
  const ensureId = (el, prefix) => { if (!el.id) el.id = `${prefix}-${++uid}`; return el.id; };
  const pad2 = (n) => String(n).padStart(2, '0');
  const store = {
    get() { try { return localStorage.getItem(STORE_KEY); } catch (e) { return null; } },
    set(v) { try { localStorage.setItem(STORE_KEY, v); } catch (e) { /* 저장 불가 환경 */ } },
  };
  const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
  const focusables = (ctx) => $$(FOCUSABLE, ctx).filter((el) => el.tabIndex >= 0 && !el.closest('[hidden]') && el.getClientRects().length > 0);

  /* ------------------------------------------------------------------------
     1. 테마 — 우선순위: ?theme= → localStorage → prefers-color-scheme
     ------------------------------------------------------------------------ */
  const schemeQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const queryTheme = () => {
    const t = new URLSearchParams(window.location.search).get('theme');
    return t === 'dark' || t === 'light' ? t : null;
  };
  const storedTheme = () => { const t = store.get(); return t === 'dark' || t === 'light' ? t : null; };
  const resolveTheme = () => queryTheme() || storedTheme() || (schemeQuery.matches ? 'dark' : 'light');

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    $$('[data-theme-toggle]').forEach((btn) => {
      const dark = theme === 'dark';
      btn.setAttribute('aria-pressed', String(dark));
      if (!btn.textContent.trim()) btn.setAttribute('aria-label', dark ? '낮의 교실로 바꾸기 (현재 밤)' : '밤의 구성실로 바꾸기 (현재 낮)');
      const label = $('[data-theme-label]', btn);
      if (label) label.textContent = dark ? '밤' : '낮';
    });
  }
  applyTheme(resolveTheme());
  const onScheme = () => { if (!queryTheme() && !storedTheme()) applyTheme(resolveTheme()); };
  if (schemeQuery.addEventListener) schemeQuery.addEventListener('change', onScheme);
  doc.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-theme-toggle]');
    if (!btn) return;
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    store.set(next);
    applyTheme(next);
  });

  /* ------------------------------------------------------------------------
     2. 레이어 — [data-layer] 루트(hidden). [data-open="id"]로 열고 [data-close]로 닫는다.
        Esc 닫기 · 포커스 가두기 · 배경 스크롤 잠금 · 트리거로 포커스 복귀
     ------------------------------------------------------------------------ */
  const layerStack = [];
  let savedOverflow = '';
  const LAYER_MS = 220;

  function lockScroll(on) {
    if (on) {
      if (layerStack.length !== 1) return;
      savedOverflow = doc.body.style.overflow;
      const sbw = window.innerWidth - root.clientWidth;
      doc.body.style.overflow = 'hidden';
      if (sbw > 0) doc.body.style.paddingRight = `${sbw}px`;
    } else if (layerStack.length === 0) {
      doc.body.style.overflow = savedOverflow;
      doc.body.style.paddingRight = '';
    }
  }

  function openLayer(el, trigger) {
    if (!el || layerStack.includes(el)) return;
    closeFloating();
    el._returnTo = trigger || doc.activeElement;
    el.hidden = false;
    layerStack.push(el);
    lockScroll(true);
    if (trigger) trigger.setAttribute('aria-expanded', 'true');
    el.getBoundingClientRect(); // 리플로 — 트랜지션 시작점 확정
    requestAnimationFrame(() => el.classList.add('is-open'));
    const panel = $('[class$="__panel"]', el) || el;
    const target = $('[autofocus]', el) || focusables(panel)[0] || panel;
    if (target === panel && !panel.hasAttribute('tabindex')) panel.setAttribute('tabindex', '-1');
    setTimeout(() => target.focus({ preventScroll: true }), reduced() ? 0 : 30);
    el.dispatchEvent(new CustomEvent('layer:open', { bubbles: true }));
  }

  function closeLayer(el) {
    if (!el || !layerStack.includes(el)) return;
    layerStack.splice(layerStack.indexOf(el), 1);
    el.classList.remove('is-open');
    const done = () => { if (!el.classList.contains('is-open')) el.hidden = true; };
    if (reduced()) done(); else setTimeout(done, LAYER_MS);
    lockScroll(false);
    const back = el._returnTo;
    if (back && back.setAttribute) back.setAttribute('aria-expanded', 'false');
    if (back && typeof back.focus === 'function' && doc.contains(back)) back.focus({ preventScroll: true });
    el.dispatchEvent(new CustomEvent('layer:close', { bubbles: true }));
  }

  doc.addEventListener('click', (e) => {
    const opener = e.target.closest('[data-open]');
    if (opener) {
      e.preventDefault();
      const el = byId(opener.getAttribute('data-open'));
      if (el && el.matches('[data-layer]')) openLayer(el, opener);
      return;
    }
    const closer = e.target.closest('[data-close]');
    if (closer) {
      const id = closer.getAttribute('data-close');
      const el = id ? byId(id) : closer.closest('[data-layer]');
      if (el) { e.preventDefault(); closeLayer(el); }
    }
  });

  // 포커스 가두기
  doc.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab' || !layerStack.length) return;
    const top = layerStack[layerStack.length - 1];
    const items = focusables(top);
    if (!items.length) { e.preventDefault(); return; }
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && (doc.activeElement === first || !top.contains(doc.activeElement))) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && (doc.activeElement === last || !top.contains(doc.activeElement))) { e.preventDefault(); first.focus(); }
  });

  /* ------------------------------------------------------------------------
     3. 커맨드 팔레트 — ⌘K / Ctrl+K. 입력으로 거르고 ↑↓ Enter.
     ------------------------------------------------------------------------ */
  const command = $('.command[data-layer]:not(.command--static)');
  function setupCommand(el) {
    const input = $('.command__input', el);
    const list = $('.command__list', el);
    const empty = $('.command__empty', el);
    if (!input || !list) return;
    ensureId(list, 'cmd-list');
    list.setAttribute('tabindex', '-1'); // aria-activedescendant 패턴 — 포커스는 입력칸에만 머문다
    input.setAttribute('role', 'combobox');
    input.setAttribute('aria-expanded', 'true');
    input.setAttribute('aria-controls', list.id);
    input.setAttribute('aria-autocomplete', 'list');
    list.setAttribute('role', 'listbox');
    const items = $$('.command__item', list);
    items.forEach((it) => { it.setAttribute('role', 'option'); ensureId(it, 'cmd-opt'); it.setAttribute('tabindex', '-1'); });
    const visible = () => items.filter((it) => !it.hidden && it.getAttribute('aria-disabled') !== 'true');
    const select = (it) => {
      items.forEach((x) => x.setAttribute('aria-selected', String(x === it)));
      if (it) { input.setAttribute('aria-activedescendant', it.id); it.scrollIntoView({ block: 'nearest' }); }
      else input.removeAttribute('aria-activedescendant');
    };
    const filter = () => {
      const q = input.value.trim().toLowerCase();
      items.forEach((it) => {
        const hay = `${it.textContent} ${it.getAttribute('data-keywords') || ''}`.toLowerCase();
        it.hidden = q !== '' && !hay.includes(q);
      });
      $$('.command__group', list).forEach((g) => { g.hidden = !$$('.command__item', g).some((it) => !it.hidden); });
      const vis = visible();
      if (empty) empty.hidden = vis.length > 0;
      select(vis[0] || null);
    };
    input.addEventListener('input', filter);
    input.addEventListener('keydown', (e) => {
      const vis = visible();
      const cur = vis.findIndex((x) => x.getAttribute('aria-selected') === 'true');
      if (e.key === 'ArrowDown') { e.preventDefault(); select(vis[(cur + 1) % vis.length]); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); select(vis[(cur - 1 + vis.length) % vis.length]); }
      else if (e.key === 'Home') { e.preventDefault(); select(vis[0]); }
      else if (e.key === 'End') { e.preventDefault(); select(vis[vis.length - 1]); }
      else if (e.key === 'Enter') {
        const it = vis[cur];
        if (it) { e.preventDefault(); it.click(); }
      }
    });
    list.addEventListener('mousemove', (e) => {
      const it = e.target.closest('.command__item');
      if (it && !it.hidden && it.getAttribute('aria-selected') !== 'true') select(it);
    });
    // 링크 항목은 그대로 이동. 버튼 항목은 팔레트를 닫고, 같은 클릭이 문서로 올라가
    // [data-toast] · [data-open] · [data-theme-toggle] 등 공용 동작을 그대로 실행한다.
    list.addEventListener('click', (e) => {
      const it = e.target.closest('.command__item');
      if (!it) return;
      if (it.getAttribute('aria-disabled') === 'true') { e.preventDefault(); e.stopPropagation(); return; }
      if (it.tagName !== 'A') closeLayer(el);
    });
    el.addEventListener('layer:open', () => { input.value = ''; filter(); });
    filter();
  }
  $$('.command').forEach((el) => { if (!el.classList.contains('command--static')) setupCommand(el); });
  doc.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
      if (!command) return;
      e.preventDefault();
      if (layerStack.includes(command)) closeLayer(command);
      else openLayer(command, $('[data-open="' + command.id + '"]'));
    }
  });

  /* ------------------------------------------------------------------------
     4. 탭 — [role=tablist] 안 [role=tab] (aria-controls → [role=tabpanel])
     ------------------------------------------------------------------------ */
  $$('[role="tablist"]').forEach((list) => {
    const tabs = $$('[role="tab"]', list);
    const pick = (tab, focus) => {
      tabs.forEach((t) => {
        const on = t === tab;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        const panel = byId(t.getAttribute('aria-controls'));
        if (panel) panel.hidden = !on;
      });
      if (focus) tab.focus();
      tab.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    };
    tabs.forEach((t) => {
      const panel = byId(t.getAttribute('aria-controls'));
      if (panel) { panel.setAttribute('role', 'tabpanel'); panel.setAttribute('aria-labelledby', ensureId(t, 'tab')); if (!panel.hasAttribute('tabindex')) panel.tabIndex = 0; }
      t.tabIndex = t.getAttribute('aria-selected') === 'true' ? 0 : -1;
      t.addEventListener('click', () => { if (!t.disabled && t.getAttribute('aria-disabled') !== 'true') pick(t, false); });
    });
    list.addEventListener('keydown', (e) => {
      const enabled = tabs.filter((t) => !t.disabled && t.getAttribute('aria-disabled') !== 'true');
      const i = enabled.indexOf(doc.activeElement);
      if (i < 0) return;
      let n = null;
      if (e.key === 'ArrowRight') n = enabled[(i + 1) % enabled.length];
      else if (e.key === 'ArrowLeft') n = enabled[(i - 1 + enabled.length) % enabled.length];
      else if (e.key === 'Home') n = enabled[0];
      else if (e.key === 'End') n = enabled[enabled.length - 1];
      if (n) { e.preventDefault(); pick(n, true); }
    });
  });

  /* ------------------------------------------------------------------------
     5. 아코디언 — .acc__head[aria-expanded][aria-controls]. .acc[data-single]이면 하나만.
     ------------------------------------------------------------------------ */
  doc.addEventListener('click', (e) => {
    const head = e.target.closest('.acc__head');
    if (!head || head.disabled || head.getAttribute('aria-disabled') === 'true') return;
    const open = head.getAttribute('aria-expanded') !== 'true';
    const acc = head.closest('.acc');
    if (open && acc && acc.hasAttribute('data-single')) {
      $$('.acc__head[aria-expanded="true"]', acc).forEach((h) => {
        if (h === head) return;
        h.setAttribute('aria-expanded', 'false');
        const p = byId(h.getAttribute('aria-controls')); if (p) p.hidden = true;
      });
    }
    head.setAttribute('aria-expanded', String(open));
    const panel = byId(head.getAttribute('aria-controls'));
    if (panel) panel.hidden = !open;
  });

  /* ------------------------------------------------------------------------
     6. 토스트 — Moyang.toast({kind:'info|done|warn|danger', title, msg})
        [data-toast] 트리거: data-toast-kind / data-toast-title / data-toast-msg
     ------------------------------------------------------------------------ */
  function toaster() {
    let t = $('.toaster');
    if (!t) {
      t = doc.createElement('div');
      t.className = 'toaster';
      t.setAttribute('role', 'region');
      t.setAttribute('aria-label', '알림');
      doc.body.appendChild(t);
    }
    return t;
  }
  function toast({ kind = 'info', title = '', msg = '', duration = 5000 } = {}) {
    const box = toaster();
    const el = doc.createElement('div');
    el.className = `toast toast--${kind}`;
    el.setAttribute('role', kind === 'danger' ? 'alert' : 'status');
    el.innerHTML = '<span class="toast__sign" aria-hidden="true"></span><div class="toast__body"><p class="toast__title"></p><p class="toast__msg"></p></div><button type="button" class="icon-btn icon-btn--bare toast__close" aria-label="알림 닫기"><svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button><span class="toast__timer" aria-hidden="true"></span>';
    $('.toast__title', el).textContent = title;
    const m = $('.toast__msg', el);
    if (msg) m.textContent = msg; else m.remove();
    $('.toast__timer', el).style.animationDuration = `${duration}ms`;
    box.appendChild(el);
    while (box.children.length > 4) box.firstElementChild.remove();
    let left = duration;
    let started = Date.now();
    let timer = setTimeout(dismiss, left);
    const pause = () => { clearTimeout(timer); left -= Date.now() - started; };
    const resume = () => { started = Date.now(); clearTimeout(timer); timer = setTimeout(dismiss, Math.max(left, 600)); };
    el.addEventListener('mouseenter', pause);
    el.addEventListener('mouseleave', resume);
    el.addEventListener('focusin', pause);
    el.addEventListener('focusout', resume);
    $('.toast__close', el).addEventListener('click', dismiss);
    function dismiss() {
      clearTimeout(timer);
      if (reduced()) { el.remove(); return; }
      el.classList.add('is-leaving');
      setTimeout(() => el.remove(), 170);
    }
    return el;
  }
  doc.addEventListener('click', (e) => {
    const t = e.target.closest('[data-toast]');
    if (!t || t.closest('form[data-validate]') && t.type === 'submit') return;
    toast({ kind: t.getAttribute('data-toast-kind') || 'info', title: t.getAttribute('data-toast-title') || t.getAttribute('data-toast') || '', msg: t.getAttribute('data-toast-msg') || '' });
  });

  /* ------------------------------------------------------------------------
     7·8. 팝오버 · 메뉴 (떠 있는 것) — 바깥 클릭 · Esc로 닫힘
     ------------------------------------------------------------------------ */
  let openFloat = null; // { el, trigger, type }
  function placeFloat(el, type) {
    el.classList.remove(`${type}--end`, `${type}--up`);
    const r = el.getBoundingClientRect();
    if (r.right > window.innerWidth - 8) el.classList.add(`${type}--end`);
    if (r.bottom > window.innerHeight - 8 && r.height < r.top) el.classList.add(`${type}--up`);
  }
  function closeFloating(returnFocus) {
    if (!openFloat) return;
    const { el, trigger } = openFloat;
    el.hidden = true;
    trigger.setAttribute('aria-expanded', 'false');
    if (returnFocus) trigger.focus();
    openFloat = null;
  }
  function openFloating(el, trigger, type) {
    closeFloating(false);
    el.hidden = false;
    trigger.setAttribute('aria-expanded', 'true');
    openFloat = { el, trigger, type };
    if (!el.dataset.keepPlace) placeFloat(el, type);
    if (type === 'menu') { const first = menuItems(el)[0]; if (first) first.focus(); }
    else { const f = focusables(el)[0]; if (f && el.hasAttribute('data-focus')) f.focus(); }
  }
  const menuItems = (menu) => $$('[role^="menuitem"]', menu).filter((x) => x.getAttribute('aria-disabled') !== 'true');

  $$('[data-popover], [data-menu]').forEach((trigger) => {
    const isMenu = trigger.hasAttribute('data-menu');
    const el = byId(trigger.getAttribute(isMenu ? 'data-menu' : 'data-popover'));
    if (!el) return;
    trigger.setAttribute('aria-expanded', 'false');
    trigger.setAttribute('aria-controls', el.id);
    if (isMenu) { trigger.setAttribute('aria-haspopup', 'menu'); el.setAttribute('role', 'menu'); }
    else if (!el.hasAttribute('role')) el.setAttribute('role', 'dialog');
    if (!el.classList.contains('menu--static') && !el.classList.contains('popover--static')) el.hidden = true;
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      if (openFloat && openFloat.el === el) closeFloating(false);
      else openFloating(el, trigger, isMenu ? 'menu' : 'popover');
    });
    if (isMenu) {
      trigger.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); openFloating(el, trigger, 'menu'); const items = menuItems(el); if (e.key === 'ArrowUp' && items.length) items[items.length - 1].focus(); }
      });
    }
  });
  // 메뉴 안 키보드 · 선택
  doc.addEventListener('keydown', (e) => {
    const menu = e.target.closest && e.target.closest('.menu');
    if (!menu) return;
    const items = menuItems(menu);
    const i = items.indexOf(doc.activeElement);
    let n = null;
    if (e.key === 'ArrowDown') n = items[(i + 1) % items.length];
    else if (e.key === 'ArrowUp') n = items[(i - 1 + items.length) % items.length];
    else if (e.key === 'Home') n = items[0];
    else if (e.key === 'End') n = items[items.length - 1];
    else if (e.key === 'Tab' && openFloat && openFloat.el === menu) closeFloating(false);
    if (n) { e.preventDefault(); n.focus(); }
  });
  doc.addEventListener('click', (e) => {
    const item = e.target.closest('.menu [role^="menuitem"]');
    if (item) {
      if (item.getAttribute('aria-disabled') === 'true') { e.preventDefault(); return; }
      if (item.getAttribute('role') === 'menuitemradio') {
        const group = item.closest('[role="group"]') || item.closest('.menu');
        $$('[role="menuitemradio"]', group).forEach((x) => x.setAttribute('aria-checked', String(x === item)));
      }
      if (item.getAttribute('role') === 'menuitemcheckbox') item.setAttribute('aria-checked', String(item.getAttribute('aria-checked') !== 'true'));
      if (openFloat && openFloat.el.contains(item) && item.getAttribute('role') === 'menuitem') closeFloating(true);
      return;
    }
    if (openFloat && !openFloat.el.contains(e.target) && !openFloat.trigger.contains(e.target)) closeFloating(false);
  });
  window.addEventListener('resize', () => { if (openFloat) placeFloat(openFloat.el, openFloat.type); });

  /* ------------------------------------------------------------------------
     9. 툴팁 — .tip > [aria-describedby] + .tip__bubble[role=tooltip]. Esc로 숨김.
     ------------------------------------------------------------------------ */
  $$('.tip').forEach((tip) => {
    const bubble = $('.tip__bubble', tip);
    const target = tip.firstElementChild;
    if (!bubble || !target || target === bubble) return;
    bubble.setAttribute('role', 'tooltip');
    const id = ensureId(bubble, 'tip');
    const was = target.getAttribute('aria-describedby') || '';
    if (!was.split(' ').includes(id)) target.setAttribute('aria-describedby', `${was} ${id}`.trim());
    const reset = () => tip.classList.remove('is-dismissed');
    tip.addEventListener('mouseleave', reset);
    tip.addEventListener('focusout', reset);
  });

  // Esc — 위에서부터 하나씩 닫는다
  doc.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    const tips = $$('.tip').filter((t) => t.matches(':hover') || t.contains(doc.activeElement));
    if (tips.length) tips.forEach((t) => t.classList.add('is-dismissed'));
    if (openFloat) { e.preventDefault(); closeFloating(true); return; }
    if (layerStack.length) { e.preventDefault(); closeLayer(layerStack[layerStack.length - 1]); }
  });

  /* ------------------------------------------------------------------------
     10. 캐러셀 — .carousel > .carousel__viewport > .carousel__track > .carousel__slide
     ------------------------------------------------------------------------ */
  $$('.carousel').forEach((car) => {
    const track = $('.carousel__track', car);
    const slides = $$('.carousel__slide', car);
    if (!track || slides.length < 2) return;
    const dots = $('.carousel__dots', car);
    const count = $('.carousel__count', car);
    let idx = Math.max(0, slides.findIndex((s) => s.classList.contains('is-current')));
    car.setAttribute('aria-roledescription', 'carousel');
    slides.forEach((s, i) => {
      s.setAttribute('role', 'group');
      s.setAttribute('aria-roledescription', 'slide');
      if (!s.hasAttribute('aria-label')) s.setAttribute('aria-label', `${slides.length}장 중 ${i + 1}번째`);
    });
    if (dots && !dots.children.length) {
      slides.forEach((s, i) => {
        const b = doc.createElement('button');
        b.type = 'button';
        b.className = 'carousel__dot';
        b.setAttribute('aria-label', `${i + 1}번째 도판 보기`);
        b.addEventListener('click', () => go(i));
        dots.appendChild(b);
      });
    }
    const live = doc.createElement('p');
    live.className = 'sr-only';
    live.setAttribute('aria-live', 'polite');
    car.appendChild(live);
    function go(n, announce = true) {
      idx = (n + slides.length) % slides.length;
      track.style.transform = `translateX(${-100 * idx}%)`;
      car.classList.add('is-moving');
      setTimeout(() => car.classList.remove('is-moving'), reduced() ? 0 : 260);
      slides.forEach((s, i) => s.setAttribute('aria-hidden', String(i !== idx)));
      if (dots) $$('.carousel__dot', dots).forEach((d, i) => d.setAttribute('aria-current', String(i === idx)));
      if (count) count.textContent = `${pad2(idx + 1)} / ${pad2(slides.length)}`;
      if (announce) live.textContent = slides[idx].getAttribute('aria-label') || '';
    }
    $$('[data-carousel-prev]', car).forEach((b) => b.addEventListener('click', () => go(idx - 1)));
    $$('[data-carousel-next]', car).forEach((b) => b.addEventListener('click', () => go(idx + 1)));
    car.addEventListener('keydown', (e) => {
      if (e.target.matches('input, textarea, select')) return;
      if (e.key === 'ArrowRight') { e.preventDefault(); go(idx + 1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(idx - 1); }
    });
    let sx = null;
    const vp = $('.carousel__viewport', car) || car;
    vp.addEventListener('pointerdown', (e) => { sx = e.clientX; });
    vp.addEventListener('pointerup', (e) => {
      if (sx === null) return;
      const dx = e.clientX - sx; sx = null;
      if (Math.abs(dx) > 40) go(idx + (dx < 0 ? 1 : -1));
    });
    go(idx, false);
  });

  /* ------------------------------------------------------------------------
     11. 표 정렬 — th[data-sort="num|text"] > .table__sort. 값은 td[data-value] 우선
     ------------------------------------------------------------------------ */
  $$('th[data-sort]').forEach((th) => {
    const btn = $('.table__sort', th) || th;
    const table = th.closest('table');
    const tbody = table && table.tBodies[0];
    if (!tbody) return;
    if (!th.hasAttribute('aria-sort')) th.setAttribute('aria-sort', 'none');
    btn.addEventListener('click', () => {
      const col = Array.from(th.parentNode.children).indexOf(th);
      const dir = th.getAttribute('aria-sort') === 'ascending' ? 'descending' : 'ascending';
      $$('th[data-sort]', table).forEach((h) => h.setAttribute('aria-sort', 'none'));
      th.setAttribute('aria-sort', dir);
      const num = th.getAttribute('data-sort') === 'num';
      const val = (row) => {
        const c = row.children[col];
        const raw = c ? (c.getAttribute('data-value') ?? c.textContent.trim()) : '';
        return num ? parseFloat(String(raw).replace(/[^0-9.\-]/g, '')) || 0 : raw;
      };
      const rows = Array.from(tbody.rows);
      rows.sort((a, b) => {
        const x = val(a); const y = val(b);
        const r = num ? x - y : String(x).localeCompare(String(y), 'ko');
        return dir === 'ascending' ? r : -r;
      });
      rows.forEach((r) => tbody.appendChild(r));
    });
  });
  // 행 선택: table[data-row-select] — 클릭/Enter로 aria-selected 토글
  $$('table[data-row-select]').forEach((table) => {
    $$('tbody tr', table).forEach((tr) => {
      tr.tabIndex = 0;
      const toggle = () => tr.setAttribute('aria-selected', String(tr.getAttribute('aria-selected') !== 'true'));
      tr.addEventListener('click', (e) => { if (!e.target.closest('a, button, input, label')) toggle(); });
      tr.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } });
    });
  });

  /* ------------------------------------------------------------------------
     12. 달력 — [data-calendar data-month="2026-10" data-today="2026-10-14"
          data-closed="1" data-marks='{"2026-10-16":{"kind":"due","label":"T06 마감"}}']
          kind: due(노랑 △) · event(파랑 ○) · stop(빨강 글자) — 월요일 시작
     ------------------------------------------------------------------------ */
  const DOW = ['일', '월', '화', '수', '목', '금', '토'];
  $$('[data-calendar]').forEach((cal) => {
    const grid = $('.cal__grid', cal);
    if (!grid) return;
    const [y0, m0] = (cal.getAttribute('data-month') || '2026-10').split('-').map(Number);
    let year = y0; let month = m0 - 1;
    const today = cal.getAttribute('data-today') || '';
    const closed = (cal.getAttribute('data-closed') || '1').split(',').filter(Boolean).map(Number);
    let marks = {};
    try { marks = JSON.parse(cal.getAttribute('data-marks') || '{}'); } catch (e) { marks = {}; }
    const title = $('[data-cal-title]', cal);
    const out = $('[data-cal-output]', cal);
    const dowRow = $('.cal__dow', cal);
    const order = [1, 2, 3, 4, 5, 6, 0];
    if (dowRow && !dowRow.children.length) {
      order.forEach((d) => { const s = doc.createElement('span'); s.textContent = DOW[d]; dowRow.appendChild(s); });
    }
    grid.setAttribute('role', 'grid');
    function render() {
      grid.innerHTML = '';
      if (title) title.innerHTML = `${month + 1}월 <span class="mono">${year}</span>`;
      const first = new Date(year, month, 1);
      const lead = (first.getDay() + 6) % 7;
      const days = new Date(year, month + 1, 0).getDate();
      const total = Math.ceil((lead + days) / 7) * 7;
      for (let i = 0; i < total; i += 1) {
        const d = new Date(year, month, i - lead + 1);
        const inMonth = d.getMonth() === month;
        const key = `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
        const cell = doc.createElement(inMonth ? 'button' : 'span');
        cell.className = 'cal__day';
        if (inMonth) { cell.type = 'button'; cell.setAttribute('aria-pressed', 'false'); cell.dataset.date = key; }
        else cell.classList.add('is-out');
        const mk = marks[key];
        const isClosed = closed.includes(d.getDay());
        if (isClosed) cell.classList.add('is-closed');
        if (key === today) { cell.classList.add('is-today'); if (inMonth) cell.setAttribute('aria-current', 'date'); }
        if (mk && inMonth) cell.classList.add(`is-${mk.kind || 'event'}`);
        const label = mk && inMonth ? mk.label || '' : (isClosed && inMonth ? '휴관' : '');
        cell.innerHTML = `<span class="cal__num">${d.getDate()}</span>${label ? `<span class="cal__label">${label}</span>` : ''}`;
        if (inMonth) cell.setAttribute('aria-label', `${month + 1}월 ${d.getDate()}일 ${DOW[d.getDay()]}요일${key === today ? ', 오늘' : ''}${label ? `, ${label}` : ''}`);
        grid.appendChild(cell);
      }
    }
    grid.addEventListener('click', (e) => {
      const day = e.target.closest('button.cal__day');
      if (!day) return;
      $$('button.cal__day', grid).forEach((b) => b.setAttribute('aria-pressed', String(b === day)));
      if (out) out.textContent = day.getAttribute('aria-label') || '';
      cal.dispatchEvent(new CustomEvent('cal:select', { bubbles: true, detail: { date: day.dataset.date } }));
    });
    grid.addEventListener('keydown', (e) => {
      const btns = $$('button.cal__day', grid);
      const i = btns.indexOf(doc.activeElement);
      if (i < 0) return;
      const step = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: 7, ArrowUp: -7 }[e.key];
      if (step && btns[i + step]) { e.preventDefault(); btns[i + step].focus(); }
    });
    $$('[data-cal-prev]', cal).forEach((b) => b.addEventListener('click', () => { month -= 1; if (month < 0) { month = 11; year -= 1; } render(); }));
    $$('[data-cal-next]', cal).forEach((b) => b.addEventListener('click', () => { month += 1; if (month > 11) { month = 0; year += 1; } render(); }));
    render();
  });

  /* ------------------------------------------------------------------------
     13. 칸반 — .kanban__list 사이로 .kb-card[draggable] 끌어 옮기기
         키보드: 카드에 포커스 후 Alt+→/← 열 이동, Alt+↑/↓ 순서 이동
     ------------------------------------------------------------------------ */
  $$('.kanban').forEach((board) => {
    const lists = $$('.kanban__list', board);
    const live = doc.createElement('p');
    live.className = 'sr-only'; live.setAttribute('aria-live', 'polite');
    board.after(live);
    const colName = (list) => { const col = list.closest('.kanban__col'); const t = col && $('.kanban__title', col); return t ? t.textContent.trim() : ''; };
    const recount = () => lists.forEach((l) => {
      const col = l.closest('.kanban__col');
      const c = col && $('.kanban__count', col);
      const n = $$('.kb-card', l).length;
      if (c) c.textContent = pad2(n);
      const empty = $('.kanban__empty', l);
      if (empty) empty.hidden = n > 0;
    });
    const moved = (card, list) => {
      card.classList.add('is-moved');
      setTimeout(() => card.classList.remove('is-moved'), 900);
      const t = $('.kb-card__title', card);
      live.textContent = `${t ? t.textContent.trim() : '카드'} → ${colName(list)}`;
      recount();
    };
    let dragging = null;
    $$('.kb-card', board).forEach((card) => {
      card.setAttribute('draggable', 'true');
      if (!card.hasAttribute('tabindex')) card.tabIndex = 0;
      card.setAttribute('aria-roledescription', '옮길 수 있는 카드');
      card.addEventListener('dragstart', (e) => { dragging = card; card.classList.add('is-dragging'); e.dataTransfer.effectAllowed = 'move'; try { e.dataTransfer.setData('text/plain', card.id || 'card'); } catch (err) { /* noop */ } });
      card.addEventListener('dragend', () => { card.classList.remove('is-dragging'); lists.forEach((l) => l.classList.remove('is-over')); dragging = null; });
      card.addEventListener('keydown', (e) => {
        if (!e.altKey) return;
        const list = card.closest('.kanban__list');
        const li = lists.indexOf(list);
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
          const to = lists[li + (e.key === 'ArrowRight' ? 1 : -1)];
          if (!to) return;
          e.preventDefault();
          const empty = $('.kanban__empty', to);
          to.insertBefore(card, empty || null);
          card.focus(); moved(card, to);
        } else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
          e.preventDefault();
          const sib = e.key === 'ArrowUp' ? card.previousElementSibling : card.nextElementSibling;
          if (sib && sib.classList.contains('kb-card')) {
            if (e.key === 'ArrowUp') list.insertBefore(card, sib); else list.insertBefore(sib, card);
            card.focus(); moved(card, list);
          }
        }
      });
    });
    lists.forEach((list) => {
      list.addEventListener('dragover', (e) => {
        if (!dragging) return;
        e.preventDefault();
        list.classList.add('is-over');
        const after = $$('.kb-card:not(.is-dragging)', list).find((c) => { const r = c.getBoundingClientRect(); return e.clientY < r.top + r.height / 2; });
        const empty = $('.kanban__empty', list);
        list.insertBefore(dragging, after || empty || null);
      });
      list.addEventListener('dragleave', (e) => { if (!list.contains(e.relatedTarget)) list.classList.remove('is-over'); });
      list.addEventListener('drop', (e) => { e.preventDefault(); list.classList.remove('is-over'); if (dragging) moved(dragging, list); });
    });
    recount();
  });

  /* ------------------------------------------------------------------------
     14. 폼 검증 — form[data-validate]. 오류 문구는 .field__error 안(data-error 우선)
     ------------------------------------------------------------------------ */
  const controlsOf = (scope) => $$('input, select, textarea', scope).filter((c) => !c.disabled && c.type !== 'hidden' && c.willValidate);
  function messageFor(c) {
    if (c.getAttribute('data-error')) return c.getAttribute('data-error');
    const v = c.validity;
    if (v.valueMissing) return c.type === 'checkbox' ? '동의가 필요합니다.' : '필수 항목입니다.';
    if (v.typeMismatch && c.type === 'email') return '이메일 형식을 확인해 주세요. 예: office@moyang.school';
    if (v.patternMismatch) return c.getAttribute('title') || '형식을 확인해 주세요.';
    if (v.tooShort) return `${c.minLength}자 이상 입력해 주세요.`;
    if (v.rangeUnderflow || v.rangeOverflow) return `${c.min || ''}~${c.max || ''} 사이로 입력해 주세요.`;
    return '입력값을 확인해 주세요.';
  }
  function checkControl(c) {
    const ok = c.checkValidity();
    const field = c.closest('.field') || c.closest('.fieldset');
    c.setAttribute('aria-invalid', String(!ok));
    if (field) {
      field.classList.toggle('is-invalid', !ok);
      const err = $('.field__error', field);
      if (err) {
        ensureId(err, 'err');
        const d = c.getAttribute('aria-describedby') || '';
        if (!d.split(' ').includes(err.id)) c.setAttribute('aria-describedby', `${d} ${err.id}`.trim());
        if (!ok) err.textContent = messageFor(c);
      }
    }
    return ok;
  }
  function validateScope(scope) {
    const bad = controlsOf(scope).filter((c) => !checkControl(c));
    if (bad.length) bad[0].focus();
    return bad.length === 0;
  }
  $$('form[data-validate]').forEach((form) => {
    form.noValidate = true;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!validateScope(form)) {
        toast({ kind: 'danger', title: '입력을 확인해 주세요', msg: '빨간 □ 표시가 있는 칸을 고쳐야 보낼 수 있습니다.' });
        return;
      }
      const btn = e.submitter || $('[type="submit"]', form);
      const title = form.getAttribute('data-success') || '저장했습니다';
      const msg = form.getAttribute('data-success-msg') || '';
      if (btn) {
        btn.setAttribute('aria-busy', 'true');
        setTimeout(() => { btn.removeAttribute('aria-busy'); toast({ kind: 'done', title, msg }); }, reduced() ? 0 : 900);
      } else toast({ kind: 'done', title, msg });
    });
    form.addEventListener('input', (e) => { if (e.target.getAttribute('aria-invalid') === 'true') checkControl(e.target); });
    form.addEventListener('change', (e) => { if (e.target.getAttribute('aria-invalid') === 'true') checkControl(e.target); });
  });
  // 파일 올리기: 고른 파일 이름 표시
  $$('.drop').forEach((drop) => {
    const input = $('input[type="file"]', drop);
    const name = $('[data-file-name]', drop);
    if (!input) return;
    input.addEventListener('change', () => { if (name) name.textContent = input.files.length ? Array.from(input.files).map((f) => f.name).join(', ') : name.getAttribute('data-empty') || ''; });
    ['dragenter', 'dragover'].forEach((t) => drop.addEventListener(t, () => drop.classList.add('is-over')));
    ['dragleave', 'drop'].forEach((t) => drop.addEventListener(t, () => drop.classList.remove('is-over')));
  });

  /* ------------------------------------------------------------------------
     15. 수량 스테퍼 — .stepper > button[data-step="-1|1"] + input[type=number]
     ------------------------------------------------------------------------ */
  $$('.stepper').forEach((st) => {
    const input = $('input', st);
    if (!input) return;
    const min = Number(input.min || 1); const max = Number(input.max || 99);
    const sync = () => {
      const v = Number(input.value) || min;
      $$('[data-step]', st).forEach((b) => { b.disabled = Number(b.getAttribute('data-step')) < 0 ? v <= min : v >= max; });
    };
    st.addEventListener('click', (e) => {
      const b = e.target.closest('[data-step]');
      if (!b) return;
      const v = Math.min(max, Math.max(min, (Number(input.value) || min) + Number(b.getAttribute('data-step'))));
      input.value = v;
      input.dispatchEvent(new Event('input', { bubbles: true }));
      sync();
    });
    input.addEventListener('change', () => { input.value = Math.min(max, Math.max(min, Number(input.value) || min)); sync(); });
    sync();
  });

  /* ------------------------------------------------------------------------
     16. 단계 마법사 — [data-wizard] 안 [data-wizard-step] 패널, .steps 동기화
         [data-wizard-next] · [data-wizard-prev] · 마지막 단계 next = 완료
     ------------------------------------------------------------------------ */
  $$('[data-wizard]').forEach((wz) => {
    const panels = $$('[data-wizard-step]', wz);
    const items = $$('.steps__item', wz);
    let cur = Math.max(0, panels.findIndex((p) => !p.hidden));
    function show(n, focus = true) {
      cur = Math.max(0, Math.min(panels.length - 1, n));
      panels.forEach((p, i) => { p.hidden = i !== cur; });
      items.forEach((it, i) => {
        it.classList.toggle('is-done', i < cur);
        it.classList.toggle('is-current', i === cur);
        if (i === cur) it.setAttribute('aria-current', 'step'); else it.removeAttribute('aria-current');
      });
      $$('[data-wizard-prev]', wz).forEach((b) => { b.disabled = cur === 0; });
      $$('[data-wizard-now]', wz).forEach((o) => { o.textContent = `${cur + 1} / ${panels.length}`; });
      if (focus) { const h = $('h2, h3, legend', panels[cur]); if (h) { h.tabIndex = -1; h.focus(); } }
      wz.dispatchEvent(new CustomEvent('wizard:step', { bubbles: true, detail: { step: cur } }));
    }
    wz.addEventListener('click', (e) => {
      if (e.target.closest('[data-wizard-prev]')) { e.preventDefault(); show(cur - 1); }
      const next = e.target.closest('[data-wizard-next]');
      if (next) {
        e.preventDefault();
        if (!validateScope(panels[cur])) return;
        if (cur === panels.length - 1) {
          items.forEach((it) => { it.classList.add('is-done'); it.classList.remove('is-current'); });
          toast({ kind: 'done', title: wz.getAttribute('data-success') || '신청을 마쳤습니다', msg: wz.getAttribute('data-success-msg') || '' });
          wz.dispatchEvent(new CustomEvent('wizard:done', { bubbles: true }));
        } else show(cur + 1);
      }
    });
    show(cur, false);
  });

  /* ------------------------------------------------------------------------
     17. 칸딘스키 칠하기 — [data-paint] 안 [data-swatch="yellow|red|blue"] 고르고
         [data-paint-target data-answer="yellow"] 를 눌러 칠한다. 모두 맞으면 .is-solved
     ------------------------------------------------------------------------ */
  const COLOR_KO = { yellow: '노랑', red: '빨강', blue: '파랑' };
  $$('[data-paint]').forEach((box) => {
    const swatches = $$('[data-swatch]', box);
    const targets = $$('[data-paint-target]', box);
    const result = $('[data-paint-result]', box);
    let pick = (swatches.find((s) => s.getAttribute('aria-pressed') === 'true') || swatches[0] || {}).dataset;
    pick = pick ? pick.swatch : null;
    swatches.forEach((s) => {
      s.setAttribute('aria-pressed', String(s.dataset.swatch === pick));
      s.addEventListener('click', () => { pick = s.dataset.swatch; swatches.forEach((x) => x.setAttribute('aria-pressed', String(x === s))); });
    });
    targets.forEach((t) => t.addEventListener('click', () => {
      if (!pick) return;
      t.setAttribute('data-color', pick);
      const name = t.getAttribute('data-name') || '도형';
      t.setAttribute('aria-label', `${name} — ${COLOR_KO[pick] || pick}`);
      const all = targets.every((x) => x.hasAttribute('data-color'));
      const match = all && targets.every((x) => x.getAttribute('data-color') === x.getAttribute('data-answer'));
      box.classList.toggle('is-solved', match);
      if (result && all) {
        result.textContent = match
          ? (box.getAttribute('data-solved') || '1923년 칸딘스키 수업의 답과 같습니다.')
          : (box.getAttribute('data-unsolved') || '정답은 없습니다. 이 짝이 당신의 첫 구성입니다.');
      }
      if (match) $$('[data-assemble]', box).forEach(replay);
    }));
  });

  /* ------------------------------------------------------------------------
     18. 마퀴 — .marquee__track 안 .marquee__run 을 한 번 복제(aria-hidden), 일시정지 버튼
     ------------------------------------------------------------------------ */
  $$('.marquee').forEach((mq) => {
    const track = $('.marquee__track', mq);
    const run = track && $('.marquee__run', track);
    if (run && track.children.length === 1) {
      const clone = run.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      $$('a, button', clone).forEach((x) => x.setAttribute('tabindex', '-1'));
      track.appendChild(clone);
    }
    const btn = $('[data-marquee-toggle]', mq);
    if (btn) {
      btn.setAttribute('aria-pressed', 'false');
      btn.addEventListener('click', () => {
        const paused = mq.classList.toggle('is-paused');
        btn.setAttribute('aria-pressed', String(paused));
        btn.setAttribute('aria-label', paused ? '안내 띠 다시 흐르게' : '안내 띠 멈추기');
      });
    }
  });

  /* ------------------------------------------------------------------------
     19. 조립(assemble) · 막대 채움(bar-fill) — 뷰포트 진입 시 1회
     ------------------------------------------------------------------------ */
  function replay(el) {
    if (reduced()) return;
    el.classList.add('is-armed');
    el.classList.remove('is-in');
    el.getBoundingClientRect();
    requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('is-in')));
  }
  const revealTargets = $$('[data-assemble], [data-fill]');
  revealTargets.forEach((el) => {
    $$('[data-piece]', el).forEach((p, i) => { if (!p.style.getPropertyValue('--i')) p.style.setProperty('--i', String(i)); });
  });
  if (!reduced() && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        en.target.classList.add('is-in');
        io.unobserve(en.target);
      });
    }, { threshold: 0.25 });
    revealTargets.forEach((el) => {
      const r = el.getBoundingClientRect();
      el.classList.add('is-armed');
      if (r.top < window.innerHeight && r.bottom > 0) requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('is-in')));
      else io.observe(el);
    });
  }
  doc.addEventListener('click', (e) => {
    const b = e.target.closest('[data-replay]');
    if (!b) return;
    const t = byId(b.getAttribute('data-replay'));
    if (t) replay(t);
  });

  /* ------------------------------------------------------------------------
     20. 코드 복사 — [data-copy] (값이 있으면 그 id의 텍스트, 없으면 가까운 .code 의 code)
     ------------------------------------------------------------------------ */
  doc.addEventListener('click', (e) => {
    const b = e.target.closest('[data-copy]');
    if (!b) return;
    const id = b.getAttribute('data-copy');
    const src = id ? byId(id) : $('code', b.closest('.code') || doc);
    if (!src) return;
    const text = src.innerText;
    const done = () => {
      const was = b.textContent;
      b.textContent = '복사됨';
      b.classList.add('is-done');
      setTimeout(() => { b.textContent = was; b.classList.remove('is-done'); }, 1600);
    };
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).then(done, done);
    else {
      const ta = doc.createElement('textarea');
      ta.value = text; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
      doc.body.appendChild(ta); ta.select();
      try { doc.execCommand('copy'); } catch (err) { /* noop */ }
      ta.remove(); done();
    }
  });

  /* ------------------------------------------------------------------------
     21. 선택 묶음 — [data-choose="pressed|current|selected"] 안 [data-choice] 하나만 켠다
     ------------------------------------------------------------------------ */
  doc.addEventListener('click', (e) => {
    const c = e.target.closest('[data-choice]');
    if (!c) return;
    const group = c.closest('[data-choose]');
    if (!group) return;
    const mode = group.getAttribute('data-choose') || 'pressed';
    const attr = `aria-${mode}`;
    $$('[data-choice]', group).forEach((x) => {
      if (x.closest('[data-choose]') !== group) return;
      if (mode === 'current') { if (x === c) x.setAttribute(attr, 'true'); else x.removeAttribute(attr); }
      else x.setAttribute(attr, String(x === c));
    });
    group.dispatchEvent(new CustomEvent('choose', { bubbles: true, detail: { value: c.getAttribute('data-choice') } }));
  });

  /* ------------------------------------------------------------------------
     22. 펼침 토글 — [data-toggle="id"] : 대상 hidden 토글(aria-expanded)
         data-toggle-class="is-on" 이면 대상에 클래스만 토글(aria-pressed)
     ------------------------------------------------------------------------ */
  $$('[data-toggle]').forEach((b) => {
    const t = byId(b.getAttribute('data-toggle'));
    if (!t) return;
    const cls = b.getAttribute('data-toggle-class');
    if (cls) b.setAttribute('aria-pressed', String(t.classList.contains(cls)));
    else { b.setAttribute('aria-expanded', String(!t.hidden)); b.setAttribute('aria-controls', t.id); }
    b.addEventListener('click', () => {
      if (cls) b.setAttribute('aria-pressed', String(t.classList.toggle(cls)));
      else { t.hidden = !t.hidden; b.setAttribute('aria-expanded', String(!t.hidden)); }
    });
  });

  /* ------------------------------------------------------------------------
     22b. 모바일 연습 문제 — 장마다 '연습 번호 칩 + 한 번에 한 블록'
          (<768에서만 CSS가 나머지 블록을 접는다. 데스크톱은 칩을 숨기고 전부 보인다)
     ------------------------------------------------------------------------ */
  $$('.ch').forEach((ch) => {
    const grid = $('.plate__grid', ch);
    if (!grid) return;
    const cells = $$(':scope > .cell', grid).filter((c) => $('.ex-label', c) && !c.matches('.ch-disc, .ch-tri'));
    if (cells.length < 2) return;
    const title = $('h2', ch);
    const host = doc.createElement('div');
    host.className = 'ch-chips scroll-host';
    const row = doc.createElement('div');
    row.className = 'ch-chips__row';
    row.setAttribute('data-scroller', '');
    row.setAttribute('role', 'group');
    row.setAttribute('aria-label', `${title ? title.textContent.replace(/\s+/g, ' ').trim() : '연습'} — 볼 연습 고르기`);
    const btns = cells.map((c, i) => {
      const lab = $('.ex-label', c);
      const b = doc.createElement('button');
      b.type = 'button';
      b.className = 'ch-chip';
      b.innerHTML = lab.innerHTML;
      b.addEventListener('click', () => pick(i, true));
      row.appendChild(b);
      return b;
    });
    const pick = (i, scroll) => {
      cells.forEach((c, j) => c.classList.toggle('is-m-hidden', j !== i));
      btns.forEach((b, j) => b.setAttribute('aria-pressed', String(j === i)));
      if (scroll) btns[i].scrollIntoView({ block: 'nearest', inline: 'nearest' });
    };
    host.appendChild(row);
    const head = $(':scope > .ch-disc, :scope > .ch-tri', grid);
    if (head) head.after(host); else grid.prepend(host);
    pick(0, false);
  });

  /* ------------------------------------------------------------------------
     23. 가로 넘침 힌트 — .scroll-host 안 스크롤 요소([data-scroller] 또는 첫 자식)
     ------------------------------------------------------------------------ */
  $$('.scroll-host').forEach((host) => {
    const sc = $('[data-scroller]', host) || host.firstElementChild;
    if (!sc) return;
    const hint = doc.createElement('span');
    hint.className = 'scroll-hint';
    hint.setAttribute('aria-hidden', 'true');
    hint.innerHTML = '<span class="shape shape--tri"></span>';
    host.appendChild(hint);
    const update = () => host.classList.toggle('has-more', sc.scrollLeft + sc.clientWidth < sc.scrollWidth - 4);
    sc.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  });

  /* ------------------------------------------------------------------------
     24. 불러오는 중 시연 — [data-busy-demo] 누르면 1.4초 aria-busy
     ------------------------------------------------------------------------ */
  doc.addEventListener('click', (e) => {
    const b = e.target.closest('[data-busy-demo]');
    if (!b || b.getAttribute('aria-busy') === 'true') return;
    b.setAttribute('aria-busy', 'true');
    setTimeout(() => {
      b.removeAttribute('aria-busy');
      const msg = b.getAttribute('data-busy-demo');
      if (msg) toast({ kind: 'done', title: msg });
    }, 1400);
  });

  /* ------------------------------------------------------------------------
     25. 쪽 넘김 — [data-pager data-total="24"] 안 .pager__btn[data-page], [data-page-prev|next]
     ------------------------------------------------------------------------ */
  $$('[data-pager]').forEach((pg) => {
    const btns = $$('.pager__btn[data-page]', pg);
    const prev = $('[data-page-prev]', pg); const next = $('[data-page-next]', pg);
    const info = $('[data-pager-info]', pg);
    const total = Number(pg.getAttribute('data-total')) || btns.length;
    let cur = Number((btns.find((b) => b.getAttribute('aria-current') === 'page') || btns[0] || { dataset: { page: 1 } }).dataset.page);
    const set = (n) => {
      cur = Math.max(1, Math.min(total, n));
      btns.forEach((b) => { if (Number(b.dataset.page) === cur) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current'); });
      if (prev) prev.disabled = cur <= 1;
      if (next) next.disabled = cur >= total;
      if (info) info.textContent = `${cur} / ${total}`;
      pg.dispatchEvent(new CustomEvent('page', { bubbles: true, detail: { page: cur } }));
    };
    pg.addEventListener('click', (e) => {
      const b = e.target.closest('.pager__btn');
      if (!b || b.disabled) return;
      if (b.hasAttribute('data-page')) { e.preventDefault(); set(Number(b.dataset.page)); }
      else if (b.hasAttribute('data-page-prev')) { e.preventDefault(); set(cur - 1); }
      else if (b.hasAttribute('data-page-next')) { e.preventDefault(); set(cur + 1); }
    });
    set(cur);
  });

  /* ------------------------------------------------------------------------
     26. 알림 닫기 — [data-dismiss] 가까운 .alert / [data-dismiss-target] 숨김
     ------------------------------------------------------------------------ */
  doc.addEventListener('click', (e) => {
    const b = e.target.closest('[data-dismiss]');
    if (!b) return;
    const t = byId(b.getAttribute('data-dismiss')) || b.closest('.alert');
    if (t) t.hidden = true;
  });

  /* ------------------------------------------------------------------------
     27. 모션 상태 표기 — [data-motion-state] 에 현재 '움직임 줄이기' 설정을 쓴다
     ------------------------------------------------------------------------ */
  const motionState = () => $$('[data-motion-state]').forEach((el) => {
    el.textContent = reduced() ? '움직임 줄이기 켜짐 — 도형은 제자리에 그려진 채로 보입니다' : '움직임 줄이기 꺼짐 — 진입 시 1회 조립';
  });
  motionState();
  if (reducedQuery.addEventListener) reducedQuery.addEventListener('change', motionState);

  window.Moyang = { toast, openLayer, closeLayer, replay, applyTheme };
})();
