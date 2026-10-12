/* ==========================================================================
   들메식물표본관 (DMH) 디자인 시스템 v2 — app.js
   바닐라 JS, 외부 라이브러리 없음. 마크업 계약은 COMPONENTS.md.
   1 테마(낮 채집/밤 순찰)   2 레이어 스택(Esc·포커스 트랩·바깥 클릭)
   3 모달·드로어   4 표본 찾기(⌘K)   5 팝오버   6 메뉴   7 툴팁
   8 탭   9 검색표(아코디언)   10 토스트   11 도판 넘김(캐러셀)
   12 수장 대장(선택·정렬)   13 채집 달력   14 공정 보드(칸반)
   15 폼 검증·로딩   16 파일 올리기   17 range   18 진행 바   19 입고 띠
   20 세밀화 드로잉   21 도장   22 축척자   23 바코드   24 복사
   25 스크롤 힌트   26 쪽지 닫기   27 모션 시연
   ========================================================================== */
(() => {
  'use strict';

  const doc = document;
  const root = doc.documentElement;
  const STORE_KEY = 'dmh-theme';
  const $ = (sel, ctx = doc) => ctx.querySelector(sel);
  const $$ = (sel, ctx = doc) => Array.from(ctx.querySelectorAll(sel));
  const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const byId = (id) => (id ? doc.getElementById(id) : null);
  const SVGNS = 'http://www.w3.org/2000/svg';
  let uid = 0;
  const ensureId = (el, prefix) => {
    if (!el.id) { uid += 1; el.id = `${prefix}-${uid}`; }
    return el.id;
  };
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const reflow = (el) => void el.getBoundingClientRect();

  const store = {
    get() { try { return localStorage.getItem(STORE_KEY); } catch (e) { return null; } },
    set(v) { try { localStorage.setItem(STORE_KEY, v); } catch (e) { /* 저장 불가 */ } },
    clear() { try { localStorage.removeItem(STORE_KEY); } catch (e) { /* 저장 불가 */ } },
  };

  /* ------------------------------------------------------------------------
     1. 테마 — 우선순위: ?theme= → localStorage → prefers-color-scheme
     ------------------------------------------------------------------------ */
  const scheme = window.matchMedia('(prefers-color-scheme: dark)');
  const queryTheme = () => {
    const t = new URLSearchParams(window.location.search).get('theme');
    return t === 'dark' || t === 'light' ? t : null;
  };
  const storedTheme = () => {
    const t = store.get();
    return t === 'dark' || t === 'light' ? t : null;
  };
  const resolveTheme = () => queryTheme() || storedTheme() || (scheme.matches ? 'dark' : 'light');

  function syncThemeControls(theme) {
    $$('[data-theme-toggle]').forEach((btn) => {
      btn.setAttribute('aria-pressed', String(theme === 'dark'));
      btn.setAttribute('aria-label', theme === 'dark' ? '낮 채집 화면으로 바꾸기' : '밤 순찰 화면으로 바꾸기');
      const label = $('[data-theme-label]', btn);
      if (label) label.textContent = theme === 'dark' ? '밤 순찰' : '낮 채집';
    });
    const pref = storedTheme() || 'system';
    $$('[data-theme-set]').forEach((el) => {
      const v = el.getAttribute('data-theme-set') || el.value;
      if (el.matches('input')) el.checked = v === pref;
      else el.setAttribute('aria-pressed', String(v === pref));
    });
  }
  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    syncThemeControls(theme);
  }
  applyTheme(resolveTheme());
  const onScheme = () => { if (!queryTheme() && !storedTheme()) applyTheme(resolveTheme()); };
  if (scheme.addEventListener) scheme.addEventListener('change', onScheme);

  function setThemePref(v) {
    if (v === 'system') store.clear(); else store.set(v);
    // 사용자가 직접 고르면 쿼리 값보다 우선해야 하므로 쿼리를 무시하고 계산한다
    applyTheme(v === 'system' ? (scheme.matches ? 'dark' : 'light') : v);
  }
  doc.addEventListener('click', (e) => {
    const t = e.target.closest('[data-theme-toggle]');
    if (t) { setThemePref(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'); return; }
    const s = e.target.closest('button[data-theme-set]');
    if (s) setThemePref(s.getAttribute('data-theme-set'));
  });
  doc.addEventListener('change', (e) => {
    const s = e.target.closest('input[data-theme-set]');
    if (s && s.checked) setThemePref(s.getAttribute('data-theme-set') || s.value);
  });

  /* ------------------------------------------------------------------------
     2. 레이어 스택
     ------------------------------------------------------------------------ */
  const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
  const focusables = (el) => $$(FOCUSABLE, el).filter((n) => !n.closest('[hidden],[inert]') && n.getClientRects().length > 0);
  const layers = [];
  const syncLock = () => root.classList.toggle('is-locked', layers.some((l) => l.lock));
  const pushLayer = (l) => { const i = layers.indexOf(l); if (i > -1) layers.splice(i, 1); layers.push(l); syncLock(); };
  const dropLayer = (l) => { const i = layers.indexOf(l); if (i > -1) layers.splice(i, 1); syncLock(); };
  function trapTab(e, box) {
    const list = focusables(box);
    if (!list.length) { e.preventDefault(); box.focus(); return; }
    const first = list[0];
    const last = list[list.length - 1];
    if (e.shiftKey && (doc.activeElement === first || !box.contains(doc.activeElement))) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && (doc.activeElement === last || !box.contains(doc.activeElement))) { e.preventDefault(); first.focus(); }
  }
  doc.addEventListener('keydown', (e) => {
    const top = layers[layers.length - 1];
    if (!top) return;
    if (e.key === 'Escape') { e.preventDefault(); top.close(true); }
    else if (e.key === 'Tab') {
      if (top.trap) trapTab(e, top.box);
      else if (top.closeOnTab) top.close(false);
    }
  });
  doc.addEventListener('pointerdown', (e) => {
    for (let i = layers.length - 1; i >= 0; i -= 1) {
      const l = layers[i];
      if (l.trap) break;
      if (l.box.contains(e.target) || (l.trigger && l.trigger.contains(e.target))) break;
      l.close(false);
    }
  });

  /* ------------------------------------------------------------------------
     3. 모달 · 드로어
     ------------------------------------------------------------------------ */
  function dialogApi(el) {
    if (el.dmh) return el.dmh;
    const kind = el.classList.contains('drawer') ? 'drawer' : el.classList.contains('cmd') ? 'cmd' : 'modal';
    const box = $(kind === 'drawer' ? '.drawer__panel' : kind === 'cmd' ? '.cmd__box' : '.modal__sheet', el) || el;
    if (!box.hasAttribute('tabindex')) box.setAttribute('tabindex', '-1');
    let timer = null;
    const api = {
      el, box, lock: true, trap: true, trigger: null, isOpen: false,
      open(trigger) {
        if (api.isOpen) return;
        clearTimeout(timer);
        api.trigger = trigger || doc.activeElement;
        el.hidden = false;
        reflow(el);
        el.classList.add('is-open');
        api.isOpen = true;
        if (api.trigger && api.trigger.hasAttribute && api.trigger.hasAttribute('aria-expanded')) api.trigger.setAttribute('aria-expanded', 'true');
        pushLayer(api);
        const target = $('[data-autofocus]', el) || focusables(box)[0] || box;
        target.focus({ preventScroll: true });
        el.dispatchEvent(new CustomEvent('dmh:open', { bubbles: true }));
      },
      close(restore = true) {
        if (!api.isOpen) return;
        api.isOpen = false;
        el.classList.remove('is-open');
        dropLayer(api);
        timer = setTimeout(() => { if (!api.isOpen) el.hidden = true; }, reduced() ? 120 : 170);
        if (api.trigger && api.trigger.hasAttribute && api.trigger.hasAttribute('aria-expanded')) api.trigger.setAttribute('aria-expanded', 'false');
        if (restore && api.trigger && doc.contains(api.trigger) && api.trigger.focus) api.trigger.focus({ preventScroll: true });
        el.dispatchEvent(new CustomEvent('dmh:close', { bubbles: true }));
      },
    };
    el.dmh = api;
    return api;
  }
  doc.addEventListener('click', (e) => {
    const opener = e.target.closest('[data-modal-open],[data-drawer-open]');
    if (opener) {
      const target = byId(opener.getAttribute('data-modal-open') || opener.getAttribute('data-drawer-open'));
      if (target) { e.preventDefault(); dialogApi(target).open(opener); }
      return;
    }
    const closer = e.target.closest('[data-close]');
    if (closer) {
      const host = closer.closest('.modal, .drawer, .cmd, .pop, .menu');
      if (host && host.dmh) { e.preventDefault(); host.dmh.close(true); }
    }
  });

  /* ------------------------------------------------------------------------
     4. 표본 찾기 (⌘K / Ctrl+K)
     ------------------------------------------------------------------------ */
  const norm = (s) => String(s || '').toLowerCase().replace(/[\s\-·.,()]/g, '');
  function commandApi(el) {
    if (el.dmhCmd) return el.dmhCmd;
    const api = dialogApi(el);
    const input = $('.cmd__input', el);
    const list = $('.cmd__list', el);
    const empty = $('.cmd__empty', el);
    ensureId(list, 'cmd-list');
    input.setAttribute('role', 'combobox');
    input.setAttribute('aria-controls', list.id);
    input.setAttribute('aria-expanded', 'true');
    input.setAttribute('aria-autocomplete', 'list');
    list.setAttribute('role', 'listbox');
    const items = () => $$('.cmd__item', list);
    items().forEach((it) => { it.setAttribute('role', 'option'); ensureId(it, 'cmd-opt'); it.setAttribute('tabindex', '-1'); });
    $$('.cmd__section', list).forEach((sec) => {
      sec.setAttribute('role', 'group');
      const label = $('.cmd__group', sec);
      if (label) sec.setAttribute('aria-labelledby', ensureId(label, 'cmd-grp'));
    });
    let active = null;
    const visible = () => items().filter((it) => !it.hidden);
    function setActive(it, scroll = true) {
      items().forEach((x) => x.setAttribute('aria-selected', 'false'));
      active = it || null;
      if (active) {
        active.setAttribute('aria-selected', 'true');
        input.setAttribute('aria-activedescendant', active.id);
        if (scroll) active.scrollIntoView({ block: 'nearest' });
      } else input.removeAttribute('aria-activedescendant');
    }
    function filter() {
      const q = norm(input.value);
      items().forEach((it) => {
        const hay = norm(it.getAttribute('data-search') || it.textContent);
        it.hidden = q !== '' && !hay.includes(q);
      });
      $$('.cmd__section', list).forEach((sec) => { sec.hidden = !$$('.cmd__item', sec).some((it) => !it.hidden); });
      const vis = visible();
      if (empty) {
        empty.hidden = vis.length > 0;
        const qEl = $('[data-cmd-query]', empty);
        if (qEl) qEl.textContent = input.value;
      }
      setActive(vis[0], false);
    }
    input.addEventListener('input', filter);
    input.addEventListener('keydown', (e) => {
      const vis = visible();
      const i = vis.indexOf(active);
      if (e.key === 'ArrowDown') { e.preventDefault(); setActive(vis[(i + 1) % vis.length]); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(vis[(i - 1 + vis.length) % vis.length]); }
      else if (e.key === 'Home' && e.altKey) { e.preventDefault(); setActive(vis[0]); }
      else if (e.key === 'End' && e.altKey) { e.preventDefault(); setActive(vis[vis.length - 1]); }
      else if (e.key === 'Enter' && active) { e.preventDefault(); choose(active); }
    });
    list.addEventListener('mousemove', (e) => {
      const it = e.target.closest('.cmd__item');
      if (it && it !== active && !it.hidden) setActive(it, false);
    });
    list.addEventListener('click', (e) => {
      const it = e.target.closest('.cmd__item');
      if (!it) return;
      if (it.tagName !== 'A') { e.preventDefault(); choose(it); }
      else api.close(false);
    });
    function choose(it) {
      if (it.getAttribute('aria-disabled') === 'true') return;
      api.close(false);
      if (it.tagName === 'A' && it.href) { window.location.href = it.href; return; }
      const title = it.getAttribute('data-toast-title');
      if (title) toast({ title, text: it.getAttribute('data-toast-text') || '', tone: it.getAttribute('data-toast-tone') || 'note' });
      it.dispatchEvent(new CustomEvent('dmh:command', { bubbles: true }));
    }
    el.addEventListener('dmh:open', () => { input.value = ''; filter(); input.focus(); });
    filter();
    el.dmhCmd = { open: (t) => api.open(t), close: () => api.close() };
    return el.dmhCmd;
  }
  const commandEl = () => $('.cmd:not(.cmd--static)');
  doc.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
      const el = commandEl();
      if (!el) return;
      e.preventDefault();
      const api = commandApi(el);
      if (el.dmh && el.dmh.isOpen) api.close(); else api.open(doc.activeElement);
    }
  });
  doc.addEventListener('click', (e) => {
    const t = e.target.closest('[data-command-open]');
    if (!t) return;
    const el = byId(t.getAttribute('data-command-open')) || commandEl();
    if (el) { e.preventDefault(); commandApi(el).open(t); }
  });

  /* ------------------------------------------------------------------------
     5. 팝오버 · 6. 메뉴 — 트랩 없는 레이어
     ------------------------------------------------------------------------ */
  function floatApi(panel, trigger, kind) {
    if (panel.dmh) { panel.dmh.trigger = trigger; return panel.dmh; }
    const api = {
      el: panel, box: panel, trigger, lock: false, trap: false, closeOnTab: kind === 'menu', isOpen: false,
      open() {
        if (api.isOpen) return;
        panel.hidden = false;
        api.isOpen = true;
        api.trigger.setAttribute('aria-expanded', 'true');
        pushLayer(api);
        if (kind === 'pop') {
          panel.classList.remove('pop--end');
          const r = panel.getBoundingClientRect();
          if (r.right > window.innerWidth - 8) panel.classList.add('pop--end');
          const f = $('[data-autofocus]', panel);
          if (f) f.focus({ preventScroll: true });
        } else {
          panel.classList.remove('menu--end');
          const r = panel.getBoundingClientRect();
          if (r.right > window.innerWidth - 8) panel.classList.add('menu--end');
          const first = menuItems(panel)[0];
          if (first) first.focus({ preventScroll: true });
        }
      },
      close(restore = true) {
        if (!api.isOpen) return;
        api.isOpen = false;
        panel.hidden = true;
        api.trigger.setAttribute('aria-expanded', 'false');
        dropLayer(api);
        if (restore) api.trigger.focus({ preventScroll: true });
      },
    };
    panel.dmh = api;
    return api;
  }
  const menuItems = (menu) => $$('.menu__item', menu).filter((i) => !i.disabled && i.getAttribute('aria-disabled') !== 'true');
  doc.addEventListener('click', (e) => {
    const pt = e.target.closest('[data-popover]');
    if (pt) {
      const panel = byId(pt.getAttribute('data-popover'));
      if (!panel) return;
      e.preventDefault();
      const api = floatApi(panel, pt, 'pop');
      if (api.isOpen) api.close(true); else api.open();
      return;
    }
    const mt = e.target.closest('[data-menu]');
    if (mt) {
      const panel = byId(mt.getAttribute('data-menu'));
      if (!panel) return;
      e.preventDefault();
      const api = floatApi(panel, mt, 'menu');
      if (api.isOpen) api.close(true); else api.open();
      return;
    }
    const item = e.target.closest('.menu__item');
    if (item) {
      const menu = item.closest('.menu');
      if (menu && menu.dmh && menu.dmh.isOpen) {
        if (item.getAttribute('role') === 'menuitemradio' || item.getAttribute('role') === 'menuitemcheckbox') {
          if (item.getAttribute('role') === 'menuitemradio') $$('[role="menuitemradio"]', menu).forEach((x) => x.setAttribute('aria-checked', 'false'));
          item.setAttribute('aria-checked', item.getAttribute('aria-checked') === 'true' && item.getAttribute('role') === 'menuitemcheckbox' ? 'false' : 'true');
        }
        menu.dmh.close(true);
      }
    }
  });
  doc.addEventListener('keydown', (e) => {
    const mt = e.target.closest && e.target.closest('[data-menu]');
    if (mt && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      const panel = byId(mt.getAttribute('data-menu'));
      if (!panel) return;
      e.preventDefault();
      const api = floatApi(panel, mt, 'menu');
      api.open();
      const list = menuItems(panel);
      if (e.key === 'ArrowUp' && list.length) list[list.length - 1].focus();
      return;
    }
    const menu = e.target.closest && e.target.closest('.menu');
    if (!menu || !menu.dmh || !menu.dmh.isOpen) return;
    const list = menuItems(menu);
    const i = list.indexOf(doc.activeElement);
    if (e.key === 'ArrowDown') { e.preventDefault(); list[(i + 1) % list.length].focus(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); list[(i - 1 + list.length) % list.length].focus(); }
    else if (e.key === 'Home') { e.preventDefault(); list[0].focus(); }
    else if (e.key === 'End') { e.preventDefault(); list[list.length - 1].focus(); }
    else if (e.key.length === 1 && /\S/.test(e.key)) {
      const next = list.slice(i + 1).concat(list.slice(0, i + 1)).find((x) => x.textContent.trim().startsWith(e.key));
      if (next) next.focus();
    }
  });
  function initMenus(scope) {
    $$('[data-menu]', scope).forEach((t) => {
      t.setAttribute('aria-haspopup', 'menu');
      if (!t.hasAttribute('aria-expanded')) t.setAttribute('aria-expanded', 'false');
      const m = byId(t.getAttribute('data-menu'));
      if (m) {
        t.setAttribute('aria-controls', m.id);
        m.setAttribute('role', 'menu');
        $$('.menu__item', m).forEach((it) => { if (!it.hasAttribute('role')) it.setAttribute('role', 'menuitem'); it.setAttribute('tabindex', '-1'); });
      }
    });
    $$('[data-popover]', scope).forEach((t) => {
      if (!t.hasAttribute('aria-expanded')) t.setAttribute('aria-expanded', 'false');
      t.setAttribute('aria-controls', t.getAttribute('data-popover'));
    });
  }

  /* ------------------------------------------------------------------------
     7. 툴팁 — Esc로 숨김
     ------------------------------------------------------------------------ */
  doc.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    const w = doc.activeElement && doc.activeElement.closest && doc.activeElement.closest('.tip-wrap');
    if (w) w.classList.add('is-dismissed');
    $$('.tip-wrap:hover').forEach((x) => x.classList.add('is-dismissed'));
  });
  const undismiss = (e) => { const w = e.target.closest && e.target.closest('.tip-wrap'); if (w) w.classList.remove('is-dismissed'); };
  doc.addEventListener('mouseout', undismiss);
  doc.addEventListener('focusout', undismiss);

  /* ------------------------------------------------------------------------
     8. 탭
     ------------------------------------------------------------------------ */
  function initTabs(box) {
    if (box.dmhTabs) return;
    box.dmhTabs = true;
    const tabs = $$('[role="tab"]', box).filter((t) => t.closest('[data-tabs]') === box);
    function select(tab, focus) {
      tabs.forEach((t) => {
        const on = t === tab;
        t.setAttribute('aria-selected', String(on));
        t.setAttribute('tabindex', on ? '0' : '-1');
        const p = byId(t.getAttribute('aria-controls'));
        if (p) p.hidden = !on;
      });
      if (focus) tab.focus();
      if (tab.scrollIntoView) tab.scrollIntoView({ block: 'nearest', inline: 'nearest' });
      box.dispatchEvent(new CustomEvent('dmh:tab', { bubbles: true, detail: { tab } }));
    }
    tabs.forEach((t) => {
      t.addEventListener('click', () => { if (!t.disabled) select(t, false); });
      t.addEventListener('keydown', (e) => {
        const enabled = tabs.filter((x) => !x.disabled && x.getAttribute('aria-disabled') !== 'true');
        const i = enabled.indexOf(t);
        let n = null;
        if (e.key === 'ArrowRight') n = enabled[(i + 1) % enabled.length];
        else if (e.key === 'ArrowLeft') n = enabled[(i - 1 + enabled.length) % enabled.length];
        else if (e.key === 'Home') n = enabled[0];
        else if (e.key === 'End') n = enabled[enabled.length - 1];
        if (n) { e.preventDefault(); select(n, true); }
      });
    });
    const current = tabs.find((t) => t.getAttribute('aria-selected') === 'true') || tabs[0];
    if (current) {
      tabs.forEach((t) => {
        const on = t === current;
        t.setAttribute('aria-selected', String(on));
        t.setAttribute('tabindex', on ? '0' : '-1');
        const p = byId(t.getAttribute('aria-controls'));
        if (p) p.hidden = !on;
      });
    }
  }

  /* ------------------------------------------------------------------------
     9. 검색표 (아코디언)
     ------------------------------------------------------------------------ */
  function initAccordion(box) {
    if (box.dmhAcc) return;
    box.dmhAcc = true;
    const single = box.getAttribute('data-accordion') === 'single';
    $$('.key__btn', box).forEach((btn) => {
      const panel = byId(btn.getAttribute('aria-controls'));
      if (panel) {
        panel.hidden = btn.getAttribute('aria-expanded') !== 'true';
        panel.setAttribute('role', 'region');
        panel.setAttribute('aria-labelledby', ensureId(btn, 'key-btn'));
      }
      btn.addEventListener('click', () => {
        if (btn.getAttribute('aria-disabled') === 'true') return;
        const open = btn.getAttribute('aria-expanded') !== 'true';
        if (single && open) {
          const parent = btn.closest('.key__item').parentElement;
          $$(':scope > .key__item > .key__head > .key__btn', parent).forEach((b) => {
            if (b !== btn) { b.setAttribute('aria-expanded', 'false'); const p = byId(b.getAttribute('aria-controls')); if (p) p.hidden = true; }
          });
        }
        btn.setAttribute('aria-expanded', String(open));
        if (panel) panel.hidden = !open;
      });
    });
  }

  /* ------------------------------------------------------------------------
     10. 토스트 — 테이프로 붙는 쪽지, 4.8초
     ------------------------------------------------------------------------ */
  // 쪽지 머리: 한글 먼저, 라틴 양식명은 Fell SC 보조 표기
  const HEADS = { ok: '수장<span class="sc">ACC.</span>', note: '안내<span class="sc">NOTE</span>', cave: '주의<span class="sc">CAVE</span>', tox: '유독<span class="sc">TOX.</span>', det: '동정<span class="sc">DET.</span>' };
  function toastZone() {
    let z = $('.toast-zone');
    if (!z) {
      z = doc.createElement('div');
      z.className = 'toast-zone';
      z.setAttribute('aria-live', 'polite');
      z.setAttribute('aria-relevant', 'additions');
      doc.body.appendChild(z);
    }
    return z;
  }
  function toast({ title = '', text = '', tone = 'ok', sign = '', stamp, duration = 4800, date = '2026.08.27' } = {}) {
    const t = doc.createElement('div');
    const tn = HEADS[tone] ? tone : 'ok';
    t.className = `toast toast--${tn}`;
    t.setAttribute('role', tn === 'tox' || tn === 'cave' ? 'alert' : 'status');
    t.style.setProperty('--dur-toast', `${duration}ms`);
    const withStamp = stamp === undefined ? tn === 'ok' : stamp;
    t.innerHTML = `
      <span class="tape tape--sm" style="--x:20%;--r:-3deg"></span>
      <span class="tape tape--sm" style="--x:80%;--r:2.5deg"></span>
      <p class="toast__head">${HEADS[tn]}</p>
      <div class="toast__body">
        <p class="toast__title">${esc(title)}</p>
        ${text ? `<p class="toast__text">${esc(text)}</p>` : ''}
        ${sign ? `<p class="toast__sign">${esc(sign)}</p>` : ''}
      </div>
      <button class="toast__close" type="button" aria-label="알림 닫기"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button>
      ${withStamp ? `<span class="stamp stamp--sm" data-date="${esc(date)}"></span>` : ''}
      <span class="toast__timer" aria-hidden="true"></span>`;
    toastZone().appendChild(t);
    const st = $('.stamp', t);
    if (st) { buildStamp(st); stampIt(st, 240); }
    let remaining = duration;
    let started = Date.now();
    let timer = setTimeout(remove, remaining);
    function remove() {
      clearTimeout(timer);
      if (t.classList.contains('is-leaving')) return;
      t.classList.add('is-leaving');
      setTimeout(() => t.remove(), reduced() ? 10 : 170);
    }
    t.addEventListener('mouseenter', () => { clearTimeout(timer); remaining -= Date.now() - started; });
    t.addEventListener('mouseleave', () => { started = Date.now(); timer = setTimeout(remove, Math.max(remaining, 1200)); });
    t.addEventListener('focusin', () => { clearTimeout(timer); });
    $('.toast__close', t).addEventListener('click', remove);
    return { el: t, close: remove };
  }
  /* 종류 select + "쪽지 붙이기" 버튼 하나 — 고른 option의 data-toast-* 로 쪽지를 붙인다 */
  doc.addEventListener('click', (e) => {
    const b = e.target.closest('[data-toast-from]');
    if (!b) return;
    const sel = doc.getElementById(b.getAttribute('data-toast-from'));
    const o = sel && sel.selectedOptions[0];
    if (!o) return;
    toast({
      title: o.getAttribute('data-toast-title') || o.textContent.trim(),
      text: o.getAttribute('data-toast-text') || '',
      tone: o.getAttribute('data-toast-tone') || 'note',
      sign: o.getAttribute('data-toast-sign') || '',
    });
  });
  doc.addEventListener('click', (e) => {
    const b = e.target.closest('[data-toast-title]');
    if (!b || b.closest('.cmd') || b.tagName === 'OPTION') return;
    toast({
      title: b.getAttribute('data-toast-title'),
      text: b.getAttribute('data-toast-text') || '',
      tone: b.getAttribute('data-toast-tone') || 'ok',
      sign: b.getAttribute('data-toast-sign') || '',
    });
  });

  /* ------------------------------------------------------------------------
     11. 도판 넘김 (캐러셀)
     ------------------------------------------------------------------------ */
  function initCarousel(box) {
    if (box.dmhCar) return;
    box.dmhCar = true;
    const track = $('.plates__track', box);
    const slides = $$('.plates__slide', box);
    const prev = $('[data-prev]', box);
    const next = $('[data-next]', box);
    const play = $('[data-play]', box);
    const cur = $('[data-current]', box);
    const total = $('[data-total]', box);
    const index = $('.plates__index', box);
    const loop = box.hasAttribute('data-loop');
    let i = Math.max(0, slides.findIndex((s) => s.classList.contains('is-current')));
    let timer = null;
    if (total) total.textContent = String(slides.length);
    if (index && !index.children.length) {
      slides.forEach((s, n) => {
        const b = doc.createElement('button');
        b.type = 'button';
        b.className = 'plates__dot';
        b.textContent = s.getAttribute('data-short') || String(n + 1);
        b.setAttribute('aria-label', `도판 ${n + 1}: ${s.getAttribute('data-name') || ''}`.trim());
        b.addEventListener('click', () => go(n, true));
        index.appendChild(b);
      });
    }
    slides.forEach((s, n) => {
      s.setAttribute('role', 'group');
      s.setAttribute('aria-roledescription', '도판');
      if (!s.hasAttribute('aria-label')) s.setAttribute('aria-label', `${n + 1} / ${slides.length}`);
    });
    function render(drawNow) {
      track.style.transform = `translateX(${-i * 100}%)`;
      slides.forEach((s, n) => {
        const on = n === i;
        s.setAttribute('aria-hidden', String(!on));
        s.inert = !on;
        s.classList.toggle('is-current', on);
      });
      if (cur) cur.textContent = String(i + 1);
      if (prev) prev.disabled = !loop && i === 0;
      if (next) next.disabled = !loop && i === slides.length - 1;
      if (index) $$('.plates__dot', index).forEach((d, n) => d.setAttribute('aria-current', String(n === i)));
      if (drawNow) $$('.flora[data-draw]', slides[i]).forEach((svg) => replayDraw(svg));
    }
    function go(n, user) {
      const len = slides.length;
      let to = n;
      if (to < 0) to = loop ? len - 1 : 0;
      if (to >= len) to = loop || timer ? 0 : len - 1;
      if (to === i) return;
      i = to;
      render(true);
      if (user) stop();
    }
    function start() {
      if (timer) return;
      timer = setInterval(() => go(i + 1, false), 5200);
      if (play) { play.setAttribute('aria-pressed', 'true'); play.setAttribute('aria-label', '넘겨보기 멈추기'); }
    }
    function stop() {
      clearInterval(timer);
      timer = null;
      if (play) { play.setAttribute('aria-pressed', 'false'); play.setAttribute('aria-label', '넘겨보기 시작'); }
    }
    if (prev) prev.addEventListener('click', () => go(i - 1, true));
    if (next) next.addEventListener('click', () => go(i + 1, true));
    if (play) play.addEventListener('click', () => (timer ? stop() : start()));
    box.addEventListener('keydown', (e) => {
      if (e.target.matches('input, textarea, select')) return;
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(i - 1, true); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); go(i + 1, true); }
    });
    box.addEventListener('mouseenter', () => { if (timer) { clearInterval(timer); timer = 'held'; } });
    box.addEventListener('mouseleave', () => { if (timer === 'held') { timer = null; start(); } });
    // 손가락으로 밀기
    let x0 = null;
    track.addEventListener('pointerdown', (e) => { x0 = e.clientX; });
    track.addEventListener('pointerup', (e) => {
      if (x0 === null) return;
      const dx = e.clientX - x0;
      x0 = null;
      if (Math.abs(dx) > 48) go(i + (dx < 0 ? 1 : -1), true);
    });
    render(false);
  }

  /* ------------------------------------------------------------------------
     12. 수장 대장 — 행 선택 · 일괄 동작 · 정렬
     ------------------------------------------------------------------------ */
  function initTable(table) {
    if (table.dmhTbl) return;
    table.dmhTbl = true;
    const wrap = table.closest('.ledger-wrap') || table.parentElement;
    const all = $('[data-select-all]', table);
    const bar = $('[data-bulkbar]', wrap);
    const rows = () => $$('[data-select-row]', table);
    function sync() {
      const list = rows();
      const n = list.filter((c) => c.checked).length;
      list.forEach((c) => { const tr = c.closest('tr'); if (tr) tr.setAttribute('aria-selected', String(c.checked)); });
      if (all) { all.checked = n > 0 && n === list.length; all.indeterminate = n > 0 && n < list.length; }
      if (bar) {
        bar.hidden = n === 0;
        $$('[data-bulk-count]', bar).forEach((x) => { x.textContent = String(n); });
      }
    }
    table.addEventListener('change', (e) => {
      if (e.target.matches('[data-select-all]')) rows().forEach((c) => { c.checked = e.target.checked; });
      if (e.target.matches('[data-select-all], [data-select-row]')) sync();
    });
    if (bar) {
      bar.addEventListener('click', (e) => {
        const act = e.target.closest('[data-bulk-action]');
        if (!act) return;
        const picked = rows().filter((c) => c.checked);
        const label = act.getAttribute('data-bulk-action');
        if (act.hasAttribute('data-bulk-clear') || label === 'clear') { picked.forEach((c) => { c.checked = false; }); sync(); return; }
        toast({ title: `${picked.length}점 → ${label}`, text: picked.map((c) => c.getAttribute('data-no') || '').filter(Boolean).slice(0, 4).join(' · '), tone: 'note', stamp: false });
        picked.forEach((c) => { c.checked = false; });
        sync();
      });
    }
    // 정렬
    $$('th .ledger__sort', table).forEach((btn) => {
      btn.addEventListener('click', () => {
        const th = btn.closest('th');
        const idx = Array.from(th.parentElement.children).indexOf(th);
        const dir = th.getAttribute('aria-sort') === 'ascending' ? 'descending' : 'ascending';
        $$('th[aria-sort]', table).forEach((x) => x.setAttribute('aria-sort', 'none'));
        th.setAttribute('aria-sort', dir);
        const tbody = table.tBodies[0];
        const list = Array.from(tbody.rows).filter((r) => !r.classList.contains('ledger__empty'));
        const key = (r) => { const c = r.cells[idx]; return c ? (c.getAttribute('data-sort') || c.textContent.trim()) : ''; };
        list.sort((a, b) => {
          const cmp = key(a).localeCompare(key(b), 'ko', { numeric: true });
          return dir === 'ascending' ? cmp : -cmp;
        });
        list.forEach((r) => tbody.appendChild(r));
      });
    });
    sync();
  }

  /* ------------------------------------------------------------------------
     13. 채집 달력
     ------------------------------------------------------------------------ */
  function initCalendar(cal) {
    if (cal.dmhCal) return;
    cal.dmhCal = true;
    const days = () => $$('.cal__day:not(.is-out)', cal).filter((d) => d.tagName === 'BUTTON');
    const out = $('[data-cal-output]', cal) || byId(cal.getAttribute('data-cal-output'));
    const list = days();
    const start = list.find((d) => d.getAttribute('aria-pressed') === 'true') || list.find((d) => d.getAttribute('aria-current') === 'date') || list[0];
    list.forEach((d) => {
      if (!d.hasAttribute('aria-pressed')) d.setAttribute('aria-pressed', 'false');
      d.setAttribute('tabindex', d === start ? '0' : '-1');
    });
    cal.addEventListener('click', (e) => {
      const d = e.target.closest('.cal__day');
      if (!d || d.tagName !== 'BUTTON' || d.disabled || d.classList.contains('is-out')) return;
      days().forEach((x) => { x.setAttribute('aria-pressed', String(x === d)); x.setAttribute('tabindex', x === d ? '0' : '-1'); });
      if (out) out.textContent = d.getAttribute('data-label') || d.getAttribute('aria-label') || d.textContent.trim();
      cal.dispatchEvent(new CustomEvent('dmh:date', { bubbles: true, detail: { day: d } }));
    });
    cal.addEventListener('keydown', (e) => {
      const d = e.target.closest('.cal__day');
      if (!d) return;
      const all = days();
      const i = all.indexOf(d);
      const step = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: 7, ArrowUp: -7 }[e.key];
      let n = null;
      if (step) n = all[Math.min(all.length - 1, Math.max(0, i + step))];
      else if (e.key === 'Home') n = all[Math.max(0, i - (i % 7))];
      else if (e.key === 'End') n = all[Math.min(all.length - 1, i + (6 - (i % 7)))];
      if (n) { e.preventDefault(); all.forEach((x) => x.setAttribute('tabindex', x === n ? '0' : '-1')); n.focus(); }
    });
  }

  /* ------------------------------------------------------------------------
     14. 공정 보드 (칸반)
     ------------------------------------------------------------------------ */
  function initKanban(board) {
    if (board.dmhKan) return;
    board.dmhKan = true;
    const cols = () => $$('.board__col', board);
    let live = $('.board__live', board);
    if (!live) {
      live = doc.createElement('p');
      live.className = 'board__live';
      live.setAttribute('aria-live', 'polite');
      board.appendChild(live);
    }
    const colName = (col) => col.getAttribute('data-name') || ($('.board__head', col) || col).textContent.replace(/[\d,]+/g, '').trim();
    const cardName = (card) => card.getAttribute('data-name') || ($('.kcard__name', card) || card).textContent.trim();
    function bump(col, d) {
      const c = $('[data-count]', col);
      if (!c) return;
      const n = parseInt(c.textContent.replace(/[^\d]/g, ''), 10) || 0;
      c.textContent = String(Math.max(0, n + d));
    }
    function syncNext() {
      const list = cols();
      list.forEach((col, ci) => {
        $$('.kcard__next', col).forEach((b) => {
          const last = ci === list.length - 1;
          b.disabled = last;
          const nm = cardName(b.closest('.kcard'));
          b.setAttribute('aria-label', last ? `${nm} — 마지막 공정` : `${nm}을(를) 다음 공정(${colName(list[ci + 1])})으로`);
        });
      });
    }
    function move(card, toCol, before, focus) {
      const fromCol = card.closest('.board__col');
      const list = $('.board__list', toCol);
      if (!list || fromCol === toCol && !before) return;
      if (before) list.insertBefore(card, before); else list.insertBefore(card, list.firstChild);
      if (fromCol !== toCol) {
        bump(fromCol, -1);
        bump(toCol, 1);
        const msg = `${cardName(card)} → ${colName(toCol)}`;
        live.textContent = `${msg}(으)로 옮겼습니다.`;
        card.classList.remove('is-moved');
        reflow(card);
        card.classList.add('is-moved');
        if (board.hasAttribute('data-toast')) toast({ title: msg, text: `${card.getAttribute('data-no') || ''} 공정 기록을 남겼습니다.`.trim(), tone: 'note', stamp: false });
      }
      syncNext();
      if (focus) card.focus();
    }
    let dragging = null;
    board.addEventListener('dragstart', (e) => {
      const card = e.target.closest('.kcard');
      if (!card) return;
      dragging = card;
      card.classList.add('is-dragging');
      e.dataTransfer.effectAllowed = 'move';
      try { e.dataTransfer.setData('text/plain', card.id || 'card'); } catch (err) { /* 무시 */ }
    });
    board.addEventListener('dragend', () => {
      if (dragging) dragging.classList.remove('is-dragging');
      dragging = null;
      cols().forEach((c) => c.classList.remove('is-over'));
    });
    board.addEventListener('dragover', (e) => {
      const col = e.target.closest('.board__col');
      if (!col || !dragging) return;
      e.preventDefault();
      cols().forEach((c) => c.classList.toggle('is-over', c === col));
    });
    board.addEventListener('drop', (e) => {
      const col = e.target.closest('.board__col');
      if (!col || !dragging) return;
      e.preventDefault();
      const list = $('.board__list', col);
      const after = $$('.kcard:not(.is-dragging)', list).find((c) => {
        const r = c.getBoundingClientRect();
        return e.clientY < r.top + r.height / 2;
      });
      const fromCol = dragging.closest('.board__col');
      if (fromCol === col) { if (after) list.insertBefore(dragging, after); else list.appendChild(dragging); }
      else move(dragging, col, after || null, false);
      if (!after && fromCol !== col) list.appendChild(dragging);
      cols().forEach((c) => c.classList.remove('is-over'));
    });
    board.addEventListener('click', (e) => {
      const b = e.target.closest('.kcard__next');
      if (!b) return;
      const card = b.closest('.kcard');
      const list = cols();
      const ci = list.indexOf(card.closest('.board__col'));
      if (ci < list.length - 1) move(card, list[ci + 1], null, true);
    });
    board.addEventListener('keydown', (e) => {
      const card = e.target.closest('.kcard');
      if (!card || e.target !== card) return;
      const list = cols();
      const ci = list.indexOf(card.closest('.board__col'));
      if (e.altKey && e.key === 'ArrowRight' && ci < list.length - 1) { e.preventDefault(); move(card, list[ci + 1], null, true); }
      else if (e.altKey && e.key === 'ArrowLeft' && ci > 0) { e.preventDefault(); move(card, list[ci - 1], null, true); }
      else if (!e.altKey && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
        const sib = e.key === 'ArrowDown' ? card.nextElementSibling : card.previousElementSibling;
        if (sib && sib.classList.contains('kcard')) { e.preventDefault(); sib.focus(); }
      } else if (!e.altKey && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')) {
        const to = list[ci + (e.key === 'ArrowRight' ? 1 : -1)];
        const first = to && $('.kcard', to);
        if (first) { e.preventDefault(); first.focus(); }
      }
    });
    $$('.kcard', board).forEach((c) => {
      if (!c.hasAttribute('tabindex')) c.setAttribute('tabindex', '0');
      c.setAttribute('draggable', 'true');
      c.setAttribute('aria-roledescription', '공정 카드');
      if (!c.hasAttribute('aria-describedby') && $('.board__hint', board)) c.setAttribute('aria-describedby', ensureId($('.board__hint', board), 'board-hint'));
    });
    syncNext();
  }

  /* ------------------------------------------------------------------------
     15. 폼 검증 · 로딩 버튼
     ------------------------------------------------------------------------ */
  function messageFor(el) {
    const v = el.validity;
    if (el.getAttribute('data-error')) return el.getAttribute('data-error');
    if (v.valueMissing) return el.type === 'checkbox' ? '확인해 주셔야 다음으로 넘어갈 수 있습니다.' : '비워 둘 수 없는 칸입니다.';
    if (v.patternMismatch || v.typeMismatch) return '형식이 맞지 않습니다.';
    if (v.rangeUnderflow) return `${el.min} 이상이어야 합니다.`;
    if (v.rangeOverflow) return `${el.max} 이하여야 합니다.`;
    if (v.tooShort) return `${el.minLength}자 이상 적어 주세요.`;
    return '값을 다시 확인해 주세요.';
  }
  function setInvalid(el, bad) {
    const field = el.closest('.field') || el.closest('.choice') || el.parentElement;
    const id = ensureId(el, 'fld');
    let msg = byId(`${id}-err`);
    if (bad) {
      el.setAttribute('aria-invalid', 'true');
      if (!msg) {
        msg = doc.createElement('p');
        msg.id = `${id}-err`;
        msg.className = 'field__msg field__msg--error';
        (field.classList.contains('field') ? field : field.parentElement).appendChild(msg);
      }
      msg.hidden = false;
      msg.textContent = messageFor(el);
      const ids = (el.getAttribute('aria-describedby') || '').split(/\s+/).filter(Boolean);
      if (!ids.includes(msg.id)) { ids.push(msg.id); el.setAttribute('aria-describedby', ids.join(' ')); }
      if (field.classList.contains('field')) field.classList.add('field--error');
    } else {
      el.removeAttribute('aria-invalid');
      if (msg) msg.hidden = true;
      if (field.classList.contains('field')) field.classList.remove('field--error');
    }
  }
  function busy(btn, ms, done) {
    if (!btn || btn.getAttribute('aria-busy') === 'true') return;
    const label = btn.querySelector('.btn__label') || null;
    const before = label ? label.textContent : null;
    if (!$('.bolt', btn)) btn.insertAdjacentHTML('afterbegin', '<span class="bolt" aria-hidden="true"></span>');
    btn.setAttribute('aria-busy', 'true');
    if (label) label.textContent = btn.getAttribute('data-busy-text') || '저장 중';
    setTimeout(() => {
      btn.removeAttribute('aria-busy');
      if (label) label.textContent = before;
      if (done) done();
    }, ms);
  }
  doc.addEventListener('submit', (e) => {
    const form = e.target.closest('form[data-validate]');
    if (!form) return;
    e.preventDefault();
    const els = $$('input, select, textarea', form).filter((el) => !el.disabled && el.willValidate);
    let first = null;
    els.forEach((el) => {
      const ok = el.checkValidity();
      setInvalid(el, !ok);
      if (!ok && !first) first = el;
    });
    if (first) {
      first.focus();
      const sum = $('[data-form-summary]', form);
      if (sum) { sum.hidden = false; const n = $('[data-error-count]', sum); if (n) n.textContent = String(els.filter((x) => x.getAttribute('aria-invalid') === 'true').length); }
      return;
    }
    const sum = $('[data-form-summary]', form);
    if (sum) sum.hidden = true;
    const btn = e.submitter || $('[type="submit"]', form);
    busy(btn, 1300, () => {
      toast({
        title: form.getAttribute('data-success-title') || '저장했습니다',
        text: form.getAttribute('data-success-text') || '',
        tone: 'ok',
      });
      form.dispatchEvent(new CustomEvent('dmh:saved', { bubbles: true }));
    });
  });
  doc.addEventListener('input', (e) => {
    const el = e.target;
    if (el.getAttribute && el.getAttribute('aria-invalid') === 'true' && el.checkValidity()) setInvalid(el, false);
  });
  doc.addEventListener('change', (e) => {
    const el = e.target;
    if (el.getAttribute && el.getAttribute('aria-invalid') === 'true' && el.checkValidity()) setInvalid(el, false);
  });
  doc.addEventListener('click', (e) => {
    const b = e.target.closest('[data-busy-demo]');
    if (!b) return;
    busy(b, parseInt(b.getAttribute('data-busy-demo'), 10) || 1600, () => {
      const t = b.getAttribute('data-done-title');
      if (t) toast({ title: t, text: b.getAttribute('data-done-text') || '', tone: b.getAttribute('data-done-tone') || 'ok' });
    });
  });
  doc.addEventListener('click', (e) => {
    const r = e.target.closest('[data-form-reset]');
    if (!r) return;
    const form = r.closest('form');
    if (!form) return;
    form.reset();
    $$('[aria-invalid="true"]', form).forEach((el) => setInvalid(el, false));
    $$('.range__input', form).forEach(syncRange);
  });

  /* ------------------------------------------------------------------------
     16. 파일 올리기
     ------------------------------------------------------------------------ */
  function initDrop(drop) {
    if (drop.dmhDrop) return;
    drop.dmhDrop = true;
    const input = $('input[type="file"]', drop);
    if (!input) return;
    const maxMb = parseFloat(drop.getAttribute('data-max-mb') || '20');
    const show = (files) => {
      let box = $('.drop__files', drop);
      if (!box) { box = doc.createElement('div'); box.className = 'drop__files'; drop.appendChild(box); }
      box.innerHTML = '';
      let bad = false;
      Array.from(files).forEach((f) => {
        const mb = f.size / 1048576;
        if (mb > maxMb) bad = true;
        const row = doc.createElement('p');
        row.className = 'drop__file';
        row.innerHTML = `<span>${esc(f.name)}</span><span class="fig">${mb >= 1 ? `${mb.toFixed(1)} MB` : `${Math.max(1, Math.round(f.size / 1024))} KB`}</span>`;
        box.appendChild(row);
      });
      drop.classList.toggle('is-error', bad);
      if (bad) toast({ title: '사진이 너무 큽니다', text: `한 장에 ${maxMb} MB까지 올릴 수 있습니다.`, tone: 'cave' });
    };
    ['dragenter', 'dragover'].forEach((t) => drop.addEventListener(t, (e) => { e.preventDefault(); drop.classList.add('is-over'); }));
    ['dragleave', 'dragend'].forEach((t) => drop.addEventListener(t, () => drop.classList.remove('is-over')));
    drop.addEventListener('drop', (e) => {
      e.preventDefault();
      drop.classList.remove('is-over');
      if (e.dataTransfer && e.dataTransfer.files.length) {
        try { input.files = e.dataTransfer.files; } catch (err) { /* 일부 브라우저 */ }
        show(e.dataTransfer.files);
      }
    });
    input.addEventListener('change', () => show(input.files));
  }

  /* ------------------------------------------------------------------------
     17. range — 축척자 트랙 채움 + 값 표시
     ------------------------------------------------------------------------ */
  function syncRange(input) {
    const min = parseFloat(input.min || '0');
    const max = parseFloat(input.max || '100');
    const v = parseFloat(input.value);
    input.style.setProperty('--fill', `${((v - min) / (max - min)) * 100}%`);
    const box = input.closest('.range');
    const out = box && $('.range__out', box);
    if (out) out.textContent = `${v.toLocaleString('ko-KR')}${input.getAttribute('data-unit') || ''}`;
  }
  doc.addEventListener('input', (e) => { if (e.target.matches && e.target.matches('.range__input')) syncRange(e.target); });

  /* ------------------------------------------------------------------------
     18. 진행 바
     ------------------------------------------------------------------------ */
  function setProgress(el, value) {
    const max = parseFloat(el.getAttribute('aria-valuemax') || '100');
    const v = Math.max(0, Math.min(max, value));
    el.setAttribute('aria-valuenow', String(v));
    el.removeAttribute('aria-busy');
    el.style.setProperty('--val', `${(v / max) * 100}%`);
    const val = $('.gauge__value', el);
    const unit = el.getAttribute('data-unit');
    if (val && unit !== null) {
      val.textContent = `${v.toLocaleString('ko-KR')} / ${max.toLocaleString('ko-KR')}`;
      if (unit) { const u = doc.createElement('span'); u.className = 'gauge__unit'; u.textContent = unit; val.appendChild(u); }
    }
  }

  /* ------------------------------------------------------------------------
     19. 입고 띠 (마퀴)
     ------------------------------------------------------------------------ */
  function initMarquee(m) {
    if (m.dmhMq) return;
    m.dmhMq = true;
    const track = $('.marquee__track', m);
    const list = $('.marquee__list', m);
    if (track && list && $$('.marquee__list', track).length === 1) {
      const copy = list.cloneNode(true);
      copy.setAttribute('aria-hidden', 'true');
      $$('a, button', copy).forEach((x) => x.setAttribute('tabindex', '-1'));
      track.appendChild(copy);
    }
    const btn = $('[data-marquee-toggle]', m);
    if (btn) {
      btn.addEventListener('click', () => {
        const paused = m.classList.toggle('is-paused');
        btn.setAttribute('aria-pressed', String(paused));
        btn.setAttribute('aria-label', paused ? '입고 띠 다시 흐르게' : '입고 띠 멈추기');
      });
    }
  }

  /* ------------------------------------------------------------------------
     20. 세밀화 드로잉
     ------------------------------------------------------------------------ */
  const DRAWN = 'path, line, polyline, circle:not(.dot), ellipse';
  function armDraw(svg) {
    const parts = $$(DRAWN, svg);
    const step = Math.min(70, 1800 / Math.max(1, parts.length));
    parts.forEach((p, n) => {
      p.setAttribute('pathLength', '1');
      p.style.setProperty('--d', `${Math.round(n * step)}ms`);
    });
    $$('.petal, .dot', svg).forEach((p) => {
      const n = parts.indexOf(p);
      p.style.setProperty('--d', `${Math.round((n > -1 ? n : parts.length) * step)}ms`);
    });
    svg.classList.add('is-armed');
  }
  function replayDraw(svg) {
    if (reduced()) return;
    if (!svg.classList.contains('is-armed')) armDraw(svg);
    svg.classList.remove('is-drawn');
    reflow(svg);
    requestAnimationFrame(() => requestAnimationFrame(() => svg.classList.add('is-drawn')));
  }
  let drawObserver = null;
  function initDraw(svg) {
    if (svg.dmhDraw || reduced()) return;
    svg.dmhDraw = true;
    armDraw(svg);
    if (!('IntersectionObserver' in window)) { svg.classList.add('is-drawn'); return; }
    if (!drawObserver) {
      drawObserver = new IntersectionObserver((entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            const s = en.target;
            requestAnimationFrame(() => s.classList.add('is-drawn'));
            drawObserver.unobserve(s);
          }
        });
      }, { threshold: 0.25 });
    }
    drawObserver.observe(svg);
  }

  /* ------------------------------------------------------------------------
     21. 수장 도장 (SVG를 그려 넣는다)
     ------------------------------------------------------------------------ */
  function buildStamp(el) {
    if ($('svg', el)) return;
    uid += 1;
    const small = el.classList.contains('stamp--sm');
    const date = el.getAttribute('data-date') || '2026.08.26';
    const ring = el.getAttribute('data-text') || '들메식물표본관 · 수장 · 강원 인제 ·';
    const center = el.getAttribute('data-center') || '수장';
    const id = `stamp-arc-${uid}`;
    const svg = small
      ? `<svg viewBox="0 0 100 100" aria-hidden="true" focusable="false">
          <circle cx="50" cy="50" r="46" style="stroke-width:4"/>
          <circle cx="50" cy="50" r="38" style="stroke-width:2"/>
          <text x="50" y="47" text-anchor="middle" font-family="Song Myung, serif" font-size="25">${esc(center)}</text>
          <text x="50" y="66" text-anchor="middle" font-family="Cutive Mono, monospace" font-size="12">${esc(date.slice(5))}</text>
        </svg>`
      : `<svg viewBox="0 0 100 100" aria-hidden="true" focusable="false">
          <defs><path id="${id}" d="M50,50 m-36,0 a36,36 0 1,1 72,0 a36,36 0 1,1 -72,0"/></defs>
          <circle cx="50" cy="50" r="47" style="stroke-width:2.8"/>
          <circle cx="50" cy="50" r="30.5" style="stroke-width:1.3"/>
          <text font-family="Noto Sans KR, sans-serif" font-weight="700" font-size="9.2"><textPath href="#${id}" textLength="222" lengthAdjust="spacing">${esc(ring)}</textPath></text>
          <text x="50" y="41" text-anchor="middle" font-family="IM Fell English SC, serif" font-size="8.5" letter-spacing="1">DMH</text>
          <text x="50" y="55" text-anchor="middle" font-family="Cutive Mono, monospace" font-size="9.6" textLength="50" lengthAdjust="spacingAndGlyphs">${esc(date)}</text>
          <text x="50" y="69" text-anchor="middle" font-family="Song Myung, serif" font-size="12.5">${esc(center)}</text>
        </svg>`;
    el.insertAdjacentHTML('afterbegin', svg);
    if (!el.hasAttribute('role') && el.getAttribute('aria-hidden') !== 'true') {
      el.setAttribute('role', 'img');
      if (!el.hasAttribute('aria-label')) el.setAttribute('aria-label', `수장 도장 ${date}`);
    }
  }
  function stampIt(el, delay = 0) {
    if (reduced()) return;
    el.classList.remove('is-stamping');
    reflow(el);
    el.style.animationDelay = `${delay}ms`;
    el.classList.add('is-stamping');
  }

  /* ------------------------------------------------------------------------
     22. 축척자 숫자
     ------------------------------------------------------------------------ */
  const CM = 28;
  function fillRuler(r) {
    const spec = r.getAttribute('data-cm');
    const vertical = r.classList.contains('ruler--v');
    const len = vertical ? r.clientHeight : r.clientWidth;
    // 마지막 숫자가 가장자리에서 잘리지 않도록 12px 여유를 두고 센다 (예: 1344px → 48이 아니라 47까지)
    const fit = Math.floor(Math.max(0, len - 12) / CM);
    const n = spec === 'auto' || !spec ? fit : Math.min(parseInt(spec, 10), fit || parseInt(spec, 10));
    if (r.dmhN === n) return;
    r.dmhN = n;
    $$('.ruler__n', r).forEach((x) => x.remove());
    const every = parseInt(r.getAttribute('data-every') || '1', 10);
    const frag = doc.createDocumentFragment();
    for (let i = 0; i <= n; i += every) {
      const s = doc.createElement('span');
      s.className = 'ruler__n';
      s.style.setProperty('--n', String(i));
      s.textContent = String(i);
      frag.appendChild(s);
    }
    r.appendChild(frag);
    r.setAttribute('aria-hidden', 'true');
  }
  let rulerRaf = 0;
  window.addEventListener('resize', () => {
    cancelAnimationFrame(rulerRaf);
    rulerRaf = requestAnimationFrame(() => { $$('.ruler[data-cm]').forEach(fillRuler); $$('[data-scroll-hint]').forEach(syncHint); });
  });

  /* ------------------------------------------------------------------------
     23. 바코드 (Code 128 모양)
     ------------------------------------------------------------------------ */
  function buildBarcode(el) {
    if ($('svg', el)) return;
    const code = el.getAttribute('data-code') || 'DMH000000';
    const widths = [2, 1, 1, 2, 1, 4];
    for (let c = 0; c < code.length; c += 1) {
      const k = code.charCodeAt(c);
      for (let j = 0; j < 6; j += 1) widths.push(((k * (j + 3) + c * 7 + j * 5) % 3) + 1);
    }
    widths.push(2, 3, 3, 1, 1, 1, 2);
    let x = 0;
    let rects = '';
    widths.forEach((w, i) => {
      if (i % 2 === 0) rects += `<rect x="${x}" y="0" width="${w}" height="28"/>`;
      x += w;
    });
    el.insertAdjacentHTML('afterbegin', `<svg viewBox="0 0 ${x} 28" width="${x}" height="28" aria-hidden="true" focusable="false" preserveAspectRatio="none">${rects}</svg>`);
    if (!$('.barcode__txt', el)) el.insertAdjacentHTML('beforeend', `<span class="barcode__txt">${esc(code)}</span>`);
    if (!el.hasAttribute('aria-label')) { el.setAttribute('role', 'img'); el.setAttribute('aria-label', `바코드 ${code}`); }
  }

  /* ------------------------------------------------------------------------
     24. 복사
     ------------------------------------------------------------------------ */
  doc.addEventListener('click', (e) => {
    const b = e.target.closest('[data-copy]');
    if (!b) return;
    const target = byId(b.getAttribute('data-copy'));
    if (!target) return;
    const done = () => {
      const label = b.textContent;
      b.classList.add('is-done');
      b.textContent = '복사됨';
      setTimeout(() => { b.classList.remove('is-done'); b.textContent = label; }, 1600);
      toast({ title: '레코드를 복사했습니다', text: b.getAttribute('data-copy-note') || '', tone: 'note', stamp: false, duration: 3200 });
    };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(target.textContent).then(done, done);
    else {
      const ta = doc.createElement('textarea');
      ta.value = target.textContent;
      doc.body.appendChild(ta);
      ta.select();
      try { doc.execCommand('copy'); } catch (err) { /* 무시 */ }
      ta.remove();
      done();
    }
  });

  /* ------------------------------------------------------------------------
     25. 가로 스크롤 힌트
     ------------------------------------------------------------------------ */
  function syncHint(el) {
    const max = el.scrollWidth - el.clientWidth;
    if (max <= 2) { el.removeAttribute('data-more'); return; }
    const atStart = el.scrollLeft <= 2;
    const atEnd = el.scrollLeft >= max - 2;
    el.setAttribute('data-more', atStart ? 'end' : atEnd ? 'start' : 'both');
  }
  function initHint(el) {
    if (el.dmhHint) return;
    el.dmhHint = true;
    el.addEventListener('scroll', () => syncHint(el), { passive: true });
    syncHint(el);
  }

  /* ------------------------------------------------------------------------
     26. 쪽지 닫기
     ------------------------------------------------------------------------ */
  doc.addEventListener('click', (e) => {
    const b = e.target.closest('[data-dismiss]');
    if (!b) return;
    const box = b.closest('.slip, [data-dismissable]');
    if (!box) return;
    box.classList.add('is-leaving');
    box.style.transition = 'opacity 160ms ease';
    box.style.opacity = '0';
    setTimeout(() => { box.hidden = true; }, reduced() ? 10 : 170);
  });

  /* ------------------------------------------------------------------------
     27. 모션 시연 — [data-replay="draw|stamp|tape|settle|lift|sway"][data-target="id"]
     ------------------------------------------------------------------------ */
  doc.addEventListener('click', (e) => {
    const b = e.target.closest('[data-replay]');
    if (!b) return;
    const kind = b.getAttribute('data-replay');
    const target = byId(b.getAttribute('data-target')) || b.closest('.motion-tile') || doc.body;
    if (kind === 'draw') {
      const svgs = target.matches('.flora') ? [target] : $$('.flora', target);
      svgs.forEach((s) => replayDraw(s));
    } else if (kind === 'stamp') {
      const st = target.matches('.stamp') ? [target] : $$('.stamp', target);
      st.forEach((s) => { buildStamp(s); s.hidden = false; stampIt(s); });
    } else if (kind === 'tape') {
      const tp = target.matches('.tape') ? [target] : $$('.tape', target);
      tp.forEach((t, n) => {
        if (reduced()) return;
        t.classList.remove('is-taping');
        reflow(t);
        t.style.animationDelay = `${n * 80}ms`;
        t.classList.add('is-taping');
      });
    } else if (kind === 'settle') {
      target.classList.remove('is-settling');
      reflow(target);
      target.classList.add('is-settling');
    } else if (kind === 'lift') {
      target.classList.add('is-lifted');
      setTimeout(() => target.classList.remove('is-lifted'), 900);
    } else if (kind === 'sway') {
      const on = target.classList.toggle('sway');
      b.setAttribute('aria-pressed', String(on));
    }
  });

  /* ------------------------------------------------------------------------
     초기화 (동적으로 넣은 마크업에도 DMH.init(scope) 로 다시 부를 수 있다)
     ------------------------------------------------------------------------ */
  function init(scope = doc) {
    $$('.stamp', scope).forEach(buildStamp);
    $$('.barcode[data-code]', scope).forEach(buildBarcode);
    $$('.ruler[data-cm]', scope).forEach(fillRuler);
    $$('[data-tabs]', scope).forEach(initTabs);
    $$('[data-accordion]', scope).forEach(initAccordion);
    $$('[data-carousel]', scope).forEach(initCarousel);
    $$('[data-select-table]', scope).forEach(initTable);
    $$('[data-calendar]', scope).forEach(initCalendar);
    $$('[data-kanban]', scope).forEach(initKanban);
    $$('.drop', scope).forEach(initDrop);
    $$('.range__input', scope).forEach(syncRange);
    $$('[data-marquee]', scope).forEach(initMarquee);
    $$('.flora[data-draw]', scope).forEach(initDraw);
    $$('[data-scroll-hint]', scope).forEach(initHint);
    $$('form[data-validate]', scope).forEach((f) => f.setAttribute('novalidate', ''));
    $$('.cmd:not(.cmd--static)', scope).forEach(commandApi);
    initMenus(scope);
    syncThemeControls(root.getAttribute('data-theme'));
  }
  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', () => init());
  else init();
  // 웹폰트가 늦게 오면 축척자·스크롤 힌트 폭이 바뀐다
  if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(() => { $$('.ruler[data-cm]').forEach(fillRuler); $$('[data-scroll-hint]').forEach(syncHint); });

  window.DMH = {
    init,
    toast,
    setProgress,
    stamp: (el) => { buildStamp(el); stampIt(el); },
    draw: replayDraw,
    open: (id) => { const el = byId(id); if (!el) return; if (el.classList.contains('cmd')) commandApi(el).open(); else dialogApi(el).open(); },
    close: (id) => { const el = byId(id); if (el && el.dmh) el.dmh.close(); },
    setTheme: setThemePref,
  };
})();
