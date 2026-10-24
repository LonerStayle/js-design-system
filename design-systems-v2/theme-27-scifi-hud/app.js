/* ==========================================================================
   솔개에어 SOLGAE — app.js (바닐라, 외부 라이브러리 없음)
   테마 · 레이어(모달/드로어/커맨드) · 떠 있는 레이어(팝오버/메뉴) · 탭 · 아코디언 ·
   캐러셀 · CAS 토스트 · 마스터 경고 · 해치 가드 · 표 · 달력 · 칸반 · 폼 검증 ·
   스위치 · 슬라이더 · 체크리스트 · 테이프/게이지 · 숫자 롤 · 시계 · 셀프테스트
   ========================================================================== */
(function () {
  'use strict';

  var doc = document;
  var root = doc.documentElement;
  var THEME_KEY = 'solgae-theme';
  var RM = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };

  root.classList.add('js');
  root.classList.remove('no-js');

  function $(sel, scope) { return (scope || doc).querySelector(sel); }
  function $$(sel, scope) { return Array.prototype.slice.call((scope || doc).querySelectorAll(sel)); }
  function on(el, type, fn, opt) { if (el) el.addEventListener(type, fn, opt || false); }
  function byId(id) { return id ? doc.getElementById(id) : null; }
  function uid(prefix) { return (prefix || 'sg') + '-' + Math.random().toString(36).slice(2, 8); }

  /* ------------------------------------------------------------------------
     세계 시계 — 기준 시각 2026.11.06(금) 19:42 KST = 061042Z 에서 흐른다
     ------------------------------------------------------------------------ */
  var BASE_UTC = Date.UTC(2026, 10, 6, 10, 42, 0);
  var START = Date.now();
  function nowUtc() { return new Date(BASE_UTC + (Date.now() - START)); }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function zulu(d) { d = d || nowUtc(); return pad(d.getUTCDate()) + pad(d.getUTCHours()) + pad(d.getUTCMinutes()) + 'Z'; }
  function kst(d, withSec) {
    d = new Date((d || nowUtc()).getTime() + 9 * 3600 * 1000);
    var s = pad(d.getUTCHours()) + ':' + pad(d.getUTCMinutes());
    return withSec ? s + ':' + pad(d.getUTCSeconds()) : s;
  }
  function tickClocks() {
    var d = nowUtc();
    $$('[data-clock]').forEach(function (el) {
      var kind = el.getAttribute('data-clock') || 'utc';
      var txt = kind === 'kst' ? kst(d, true) : kind === 'kst-hm' ? kst(d, false) : zulu(d);
      if (el.textContent !== txt) el.textContent = txt;
    });
  }

  /* ------------------------------------------------------------------------
     테마 — URL ?theme= 최우선 → localStorage → prefers-color-scheme
     ------------------------------------------------------------------------ */
  function storedTheme() {
    try { var s = localStorage.getItem(THEME_KEY); return s === 'dark' || s === 'light' ? s : null; } catch (e) { return null; }
  }
  function queryTheme() {
    var m = /[?&]theme=(dark|light)\b/.exec(location.search);
    return m ? m[1] : null;
  }
  function systemTheme() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }
  function syncToggles(theme) {
    $$('[data-theme-toggle]').forEach(function (b) {
      b.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
      b.setAttribute('aria-label', theme === 'dark' ? '주간 화면으로 전환 (현재 야간)' : '야간 화면으로 전환 (현재 주간)');
      var label = $('[data-theme-label]', b);
      if (label) label.textContent = theme === 'dark' ? '야간' : '주간';
    });
    /* 세그먼트 소프트키 [DAY 주간][NIGHT 야간] — 현재 화면 모드를 눌린 상태로 */
    $$('[data-theme-set]').forEach(function (b) {
      b.setAttribute('aria-pressed', b.getAttribute('data-theme-set') === theme ? 'true' : 'false');
    });
  }
  function setTheme(theme, persist) {
    if (theme !== 'dark' && theme !== 'light') return;
    root.setAttribute('data-theme', theme);
    if (persist) { try { localStorage.setItem(THEME_KEY, theme); } catch (e) {} }
    syncToggles(theme);
  }
  setTheme(queryTheme() || storedTheme() || systemTheme(), false);
  if (window.matchMedia) {
    var mq = window.matchMedia('(prefers-color-scheme: light)');
    var onSys = function () { if (!queryTheme() && !storedTheme()) setTheme(systemTheme(), false); };
    if (mq.addEventListener) mq.addEventListener('change', onSys); else if (mq.addListener) mq.addListener(onSys);
  }

  /* ------------------------------------------------------------------------
     레이어 스택 — 모달 · 드로어 · 커맨드 (포커스 트랩 + 스크롤 잠금)
     ------------------------------------------------------------------------ */
  var layers = [];
  var FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

  function focusables(box) {
    return $$(FOCUSABLE, box).filter(function (el) { return el.offsetParent !== null || el === doc.activeElement; });
  }
  function syncLock() { root.classList.toggle('is-locked', layers.length > 0); }

  function openLayer(el, trigger) {
    if (!el || layers.indexOf(el) > -1) return;
    closeFloating();
    el.hidden = false;
    el.classList.add('is-open');
    el._trigger = trigger || doc.activeElement;
    layers.push(el);
    syncLock();
    if (el._trigger && el._trigger.setAttribute && el._trigger.hasAttribute('aria-expanded')) el._trigger.setAttribute('aria-expanded', 'true');
    var box = $('.modal__box, .drawer__panel, .cmd__box', el) || el;
    var target = $('[autofocus]', box) || $('.cmd__input', box) || focusables(box)[0] || box;
    if (target === box) box.setAttribute('tabindex', '-1');
    setTimeout(function () { target.focus({ preventScroll: true }); }, 0);
    if (el.classList.contains('cmd')) filterCommand(el, '');
  }
  function closeLayer(el) {
    if (!el) el = layers[layers.length - 1];
    var i = layers.indexOf(el);
    if (i < 0) return;
    layers.splice(i, 1);
    el.classList.remove('is-open');
    el.hidden = true;
    syncLock();
    var t = el._trigger;
    if (t && t.setAttribute && t.hasAttribute('aria-expanded')) t.setAttribute('aria-expanded', 'false');
    if (t && t.focus && doc.contains(t)) t.focus({ preventScroll: true });
  }
  function trapTab(e) {
    var top = layers[layers.length - 1];
    if (!top) return;
    var box = $('.modal__box, .drawer__panel, .cmd__box', top) || top;
    var list = focusables(box);
    if (!list.length) { e.preventDefault(); return; }
    var first = list[0], last = list[list.length - 1];
    if (e.shiftKey && (doc.activeElement === first || !box.contains(doc.activeElement))) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && (doc.activeElement === last || !box.contains(doc.activeElement))) { e.preventDefault(); first.focus(); }
  }

  /* ------------------------------------------------------------------------
     커맨드 팔레트 — FMS 스크래치패드 (⌘K / Ctrl+K)
     ------------------------------------------------------------------------ */
  function commandEl() { return $('.cmd[data-command]') || $('.cmd'); }
  function cmdItems(cmd) { return $$('.cmd__item', cmd).filter(function (i) { return !i.hidden && i.getAttribute('aria-disabled') !== 'true'; }); }
  function setActive(cmd, item) {
    $$('.cmd__item', cmd).forEach(function (i) { i.setAttribute('aria-selected', i === item ? 'true' : 'false'); });
    var input = $('.cmd__input', cmd);
    if (item) {
      if (!item.id) item.id = uid('cmd');
      if (input) input.setAttribute('aria-activedescendant', item.id);
      item.scrollIntoView({ block: 'nearest' });
    } else if (input) input.removeAttribute('aria-activedescendant');
  }
  function filterCommand(cmd, q) {
    q = (q || '').trim().toLowerCase();
    var shown = 0;
    $$('.cmd__item', cmd).forEach(function (i) {
      var hay = (i.textContent + ' ' + (i.getAttribute('data-keywords') || '')).toLowerCase();
      var hit = !q || hay.indexOf(q) > -1;
      i.hidden = !hit;
      if (hit) shown++;
    });
    $$('.cmd__group', cmd).forEach(function (g) {
      var n = g.nextElementSibling, any = false;
      while (n && !n.classList.contains('cmd__group')) { if (n.classList.contains('cmd__item') && !n.hidden) any = true; n = n.nextElementSibling; }
      g.hidden = !any;
    });
    var empty = $('.cmd__empty', cmd);
    if (empty) empty.hidden = shown > 0;
    setActive(cmd, cmdItems(cmd)[0] || null);
  }
  function runCommand(cmd, item) {
    if (!item) return;
    closeLayer(cmd);
    if (item.tagName === 'A' && item.getAttribute('href')) { location.href = item.getAttribute('href'); return; }
    item.click();
  }
  function initCommand(cmd) {
    if (cmd._init) return; cmd._init = true;
    var input = $('.cmd__input', cmd);
    on(input, 'input', function () { filterCommand(cmd, input.value); });
    on(input, 'keydown', function (e) {
      var list = cmdItems(cmd);
      var cur = $('.cmd__item[aria-selected="true"]', cmd);
      var i = list.indexOf(cur);
      if (e.key === 'ArrowDown') { e.preventDefault(); setActive(cmd, list[(i + 1) % list.length] || null); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(cmd, list[(i - 1 + list.length) % list.length] || null); }
      else if (e.key === 'Enter') { e.preventDefault(); runCommand(cmd, cur); }
    });
    on(cmd, 'mousemove', function (e) {
      var it = e.target.closest('.cmd__item');
      if (it && it.getAttribute('aria-selected') !== 'true' && it.getAttribute('aria-disabled') !== 'true') setActive(cmd, it);
    });
    on(cmd, 'mousedown', function (e) { if (e.target === cmd) closeLayer(cmd); });
  }

  /* ------------------------------------------------------------------------
     떠 있는 레이어 — 팝오버 · 메뉴 (트랩 없음, 바깥 클릭 · Esc 닫기)
     ------------------------------------------------------------------------ */
  var floating = null;
  function openFloating(panel, trigger) {
    closeFloating();
    panel.hidden = false;
    panel.classList.add('is-open');
    trigger.setAttribute('aria-expanded', 'true');
    floating = { panel: panel, trigger: trigger };
    if (panel.classList.contains('menu')) {
      var items = menuItems(panel);
      var cur = items.filter(function (i) { return i.getAttribute('aria-checked') === 'true' || i.getAttribute('aria-current') === 'true'; })[0];
      if (cur || items[0]) (cur || items[0]).focus();
    }
  }
  function closeFloating(returnFocus) {
    if (!floating) return;
    var f = floating; floating = null;
    f.panel.hidden = true;
    f.panel.classList.remove('is-open');
    f.trigger.setAttribute('aria-expanded', 'false');
    if (returnFocus) f.trigger.focus();
  }
  function menuItems(menu) {
    return $$('.menu__item', menu).filter(function (i) { return !i.disabled && i.getAttribute('aria-disabled') !== 'true'; });
  }
  function initMenu(menu) {
    if (menu._init) return; menu._init = true;
    $$('.menu__item', menu).forEach(function (i) { i.setAttribute('tabindex', '-1'); });
    on(menu, 'keydown', function (e) {
      var list = menuItems(menu), i = list.indexOf(doc.activeElement);
      if (e.key === 'ArrowDown') { e.preventDefault(); (list[(i + 1) % list.length] || list[0]).focus(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); (list[(i - 1 + list.length) % list.length] || list[0]).focus(); }
      else if (e.key === 'Home') { e.preventDefault(); list[0].focus(); }
      else if (e.key === 'End') { e.preventDefault(); list[list.length - 1].focus(); }
      else if (e.key === 'Tab') { closeFloating(false); }
    });
    on(menu, 'click', function (e) {
      var it = e.target.closest('.menu__item');
      if (!it || it.disabled || it.getAttribute('aria-disabled') === 'true') return;
      if (it.getAttribute('role') === 'menuitemradio') {
        $$('.menu__item[role="menuitemradio"]', menu).forEach(function (r) { r.setAttribute('aria-checked', r === it ? 'true' : 'false'); });
        var out = byId(menu.getAttribute('data-menu-output'));
        if (out) out.textContent = (it.querySelector('.menu__text') || it).textContent.trim();
      }
      if (it.tagName !== 'A') closeFloating(true);
    });
  }

  /* ------------------------------------------------------------------------
     탭 — MFD 상단 소프트키 (화살표 roving)
     ------------------------------------------------------------------------ */
  function selectTab(tabs, tab, focus) {
    var list = $$('[role="tab"]', tabs).filter(function (t) { return t.closest('[data-tabs]') === tabs; });
    list.forEach(function (t) {
      var sel = t === tab;
      t.setAttribute('aria-selected', sel ? 'true' : 'false');
      t.setAttribute('tabindex', sel ? '0' : '-1');
      var p = byId(t.getAttribute('aria-controls'));
      if (p) {
        p.hidden = !sel;
        if (sel) { p.classList.remove('is-in'); void p.offsetWidth; p.classList.add('is-in'); }
      }
    });
    /* 열어 본 메시지는 읽음 처리 */
    if (tab.classList.contains('rows__item--unread')) tab.classList.remove('rows__item--unread');
    /* 사용자가 조작할 때만 화면 안으로 — 로드 직후 페이지가 아래 탭으로 끌려가지 않게 */
    if (focus) { tab.focus(); tab.scrollIntoView({ block: 'nearest', inline: 'nearest' }); }
  }
  function initTabs(tabs) {
    if (tabs._init) return; tabs._init = true;
    var list = $$('[role="tab"]', tabs).filter(function (t) { return t.closest('[data-tabs]') === tabs; });
    var current = list.filter(function (t) { return t.getAttribute('aria-selected') === 'true'; })[0] || list[0];
    if (current) selectTab(tabs, current, false);
    var vertical = tabs.classList.contains('tabs--rail');
    list.forEach(function (t) {
      on(t, 'click', function () {
        if (t.disabled) return;
        selectTab(tabs, t, false);
        var row = t.closest('.hscroll, .tabs__list');
        if (row && row.scrollWidth > row.clientWidth) t.scrollIntoView({ block: 'nearest', inline: 'nearest' });
      });
      on(t, 'keydown', function (e) {
        var enabled = list.filter(function (x) { return !x.disabled && x.getAttribute('aria-disabled') !== 'true'; });
        var i = enabled.indexOf(t), n = null;
        var next = vertical ? ['ArrowDown', 'ArrowRight'] : ['ArrowRight'];
        var prev = vertical ? ['ArrowUp', 'ArrowLeft'] : ['ArrowLeft'];
        if (next.indexOf(e.key) > -1) n = enabled[(i + 1) % enabled.length];
        else if (prev.indexOf(e.key) > -1) n = enabled[(i - 1 + enabled.length) % enabled.length];
        else if (e.key === 'Home') n = enabled[0];
        else if (e.key === 'End') n = enabled[enabled.length - 1];
        if (n) { e.preventDefault(); selectTab(tabs, n, true); }
      });
    });
  }

  /* ------------------------------------------------------------------------
     아코디언 — 체크리스트 절
     ------------------------------------------------------------------------ */
  function initAccordion(acc) {
    if (acc._init) return; acc._init = true;
    var single = acc.getAttribute('data-accordion') === 'single';
    var heads = $$('.acc__head', acc);
    heads.forEach(function (h) {
      var p = byId(h.getAttribute('aria-controls'));
      if (p) p.hidden = h.getAttribute('aria-expanded') !== 'true';
      on(h, 'click', function () {
        var open = h.getAttribute('aria-expanded') !== 'true';
        if (single && open) heads.forEach(function (o) {
          if (o !== h) { o.setAttribute('aria-expanded', 'false'); var op = byId(o.getAttribute('aria-controls')); if (op) op.hidden = true; }
        });
        h.setAttribute('aria-expanded', open ? 'true' : 'false');
        if (p) p.hidden = !open;
      });
    });
  }

  /* ------------------------------------------------------------------------
     캐러셀 — MFD 페이지 순환
     ------------------------------------------------------------------------ */
  function initCarousel(box) {
    if (box._init) return; box._init = true;
    var track = $('.mfd__track', box);
    var pages = $$('.mfd__page', box);
    var dots = $$('.mfd__dot', box);
    var live = $('.mfd__live', box);
    var i = Math.max(0, pages.findIndex(function (p) { return p.getAttribute('aria-hidden') === 'false'; }));
    function go(n) {
      i = (n + pages.length) % pages.length;
      if (track) track.style.transform = 'translateX(' + (-100 * i) + '%)';
      pages.forEach(function (p, k) {
        p.setAttribute('aria-hidden', k === i ? 'false' : 'true');
        $$(FOCUSABLE, p).forEach(function (f) { if (k === i) f.removeAttribute('tabindex'); else f.setAttribute('tabindex', '-1'); });
      });
      dots.forEach(function (d, k) { d.setAttribute('aria-current', k === i ? 'true' : 'false'); });
      if (live) live.textContent = (i + 1) + ' / ' + pages.length + ' ' + (pages[i].getAttribute('aria-label') || '');
    }
    on($('.mfd__prev', box), 'click', function () { go(i - 1); });
    on($('.mfd__next', box), 'click', function () { go(i + 1); });
    dots.forEach(function (d, k) { on(d, 'click', function () { go(k); }); });
    on(box, 'keydown', function (e) {
      if (e.target.closest('input, textarea, select')) return;
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(i - 1); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); go(i + 1); }
    });
    go(i);
  }

  /* ------------------------------------------------------------------------
     CAS 토스트 — 권고·상태 6초 자동 닫힘, 주의·경고는 확인 전까지 유지
     ------------------------------------------------------------------------ */
  var LEVEL = {
    warning: { lvl: 'WARN', role: 'alert', sticky: true },
    caution: { lvl: 'CAUT', role: 'alert', sticky: true },
    advisory: { lvl: 'ADVY', role: 'status', sticky: false },
    status: { lvl: 'STAT', role: 'status', sticky: false }
  };
  function toastZone() {
    var z = $('.toasts');
    if (!z) {
      z = doc.createElement('div');
      z.className = 'toasts';
      z.setAttribute('role', 'region');
      z.setAttribute('aria-label', 'CAS 메시지');
      doc.body.appendChild(z);
    }
    return z;
  }
  function removeToast(t) {
    if (!t || t._leaving) return;
    t._leaving = true;
    if (RM.matches) { t.remove(); return; }
    t.classList.add('is-leaving');
    setTimeout(function () { t.remove(); }, 200);
  }
  function el(tag, cls, text) {
    var n = doc.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function toast(opt) {
    opt = opt || {};
    var level = LEVEL[opt.level] ? opt.level : 'status';
    var L = LEVEL[level];
    var t = el('div', 'toast cas cas--' + level);
    t.setAttribute('role', L.role);
    t.appendChild(el('span', 'cas__lvl', L.lvl));
    t.appendChild(el('span', 'cas__code', opt.code || ''));
    var side = el('span', 'cas__side');
    var time = el('time', 'cas__time', zulu());
    side.appendChild(time);
    var close = el('button', 'skey skey--compact', L.sticky ? '확인' : '닫기');
    close.type = 'button';
    close.setAttribute('aria-label', (L.sticky ? '확인: ' : '닫기: ') + (opt.code || '') + ' ' + (opt.text || ''));
    on(close, 'click', function () { removeToast(t); });
    side.appendChild(close);
    t.appendChild(side);
    var text = el('span', 'cas__text', opt.text || '');
    if (opt.sub) text.appendChild(el('small', null, opt.sub));
    t.appendChild(text);
    if (!L.sticky) {
      var dur = opt.duration || 6000;
      if (RM.matches) {
        setTimeout(function () { removeToast(t); }, dur);
      } else {
        var bar = el('span', 'toast__timer');
        bar.style.setProperty('--toast-dur', dur + 'ms');
        on(bar, 'animationend', function () { removeToast(t); });
        t.appendChild(bar);
      }
    }
    var zone = toastZone();
    zone.insertBefore(t, zone.firstChild);
    var all = $$('.toast', zone);
    if (all.length > 5) removeToast(all[all.length - 1]);
    if (level === 'warning') root.setAttribute('data-master', 'warning');
    if (level === 'caution') $$('.mlamp--caut').forEach(function (m) { litMaster(m, true); });
    return t;
  }

  /* ---- 마스터 경고 / 주의 램프 ------------------------------------------ */
  function litMaster(m, lit) {
    m.setAttribute('data-lit', lit ? 'true' : 'false');
    var warn = m.classList.contains('mlamp--warn');
    var name = warn ? '마스터 경고' : '마스터 주의';
    m.setAttribute('aria-label', name + (lit ? ' — 미확인 메시지 있음, 눌러서 확인' : ' — 미확인 없음'));
  }
  function lampTest(btn) {
    root.classList.add('is-lamptest');
    if (btn) btn.setAttribute('aria-pressed', 'true');
    setTimeout(function () {
      root.classList.remove('is-lamptest');
      if (btn) btn.setAttribute('aria-pressed', 'false');
    }, 1500);
  }

  /* ---- 해치 가드 — 1회차 덮개 열림, 2회차 실행 --------------------------- */
  function disarm(b) {
    if (!b || b.getAttribute('data-armed') !== 'true') return;
    b.setAttribute('data-armed', 'false');
    var lab = $('.skey__label', b) || b;
    if (b._label != null) lab.textContent = b._label;
    clearTimeout(b._guardT);
  }
  function guardClick(b, e) {
    if (b.getAttribute('data-armed') === 'true') { disarm(b); b.dispatchEvent(new CustomEvent('guard:fire', { bubbles: true })); return false; }
    e.preventDefault();
    e.stopImmediatePropagation();
    var lab = $('.skey__label', b) || b;
    b._label = lab.textContent;
    lab.textContent = b.getAttribute('data-guard') || '덮개 열림 — 한 번 더 눌러 실행';
    b.setAttribute('data-armed', 'true');
    clearTimeout(b._guardT);
    b._guardT = setTimeout(function () { disarm(b); }, 4000);
    return true;
  }

  /* ---- 처리 중 시연 -------------------------------------------------------- */
  function busy(b, ms, after) {
    b.setAttribute('aria-busy', 'true');
    var prev = b.disabled;
    setTimeout(function () {
      b.removeAttribute('aria-busy');
      b.disabled = prev;
      if (after) after();
    }, ms || 1600);
  }

  /* ---- 복사 ----------------------------------------------------------------- */
  function copyText(text, btn) {
    function done() {
      var lab = $('.skey__label', btn) || btn;
      var old = btn._copyLabel || lab.textContent;
      btn._copyLabel = old;
      btn.setAttribute('data-copied', 'true');
      lab.textContent = '복사됨';
      clearTimeout(btn._copyT);
      btn._copyT = setTimeout(function () { btn.removeAttribute('data-copied'); lab.textContent = old; }, 1600);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, function () { fallbackCopy(text); done(); });
    } else { fallbackCopy(text); done(); }
  }
  function fallbackCopy(text) {
    var ta = doc.createElement('textarea');
    ta.value = text; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
    doc.body.appendChild(ta); ta.select();
    try { doc.execCommand('copy'); } catch (e) {}
    ta.remove();
  }
  function initCode(box) {
    if (box._init) return; box._init = true;
    var pre = $('.code__pre', box), gut = $('.code__gutter', box);
    if (pre && gut && !gut.children.length) {
      var n = pre.textContent.replace(/\n$/, '').split('\n').length;
      for (var i = 1; i <= n; i++) gut.appendChild(el('span', null, String(i)));
      gut.setAttribute('aria-hidden', 'true');
    }
  }

  /* ---- ATIS 띠 -------------------------------------------------------------- */
  function initMarquee(m) {
    if (m._init) return; m._init = true;
    var track = $('.atis__track', m);
    var groups = track ? $$('.atis__group', track) : [];
    if (track && groups.length === 1) {
      var c = groups[0].cloneNode(true);
      c.setAttribute('aria-hidden', 'true');
      $$(FOCUSABLE, c).forEach(function (f) { f.setAttribute('tabindex', '-1'); });
      track.appendChild(c);
    }
  }

  /* ------------------------------------------------------------------------
     표 — 선택 · 정렬 · 모바일 펼침
     ------------------------------------------------------------------------ */
  function initTable(table) {
    if (table._init) return; table._init = true;
    if (table.hasAttribute('data-table-select')) {
      var all = $('thead .check__input', table);
      var rows = function () { return $$('tbody tr', table).filter(function (r) { return $('.check__input', r); }); };
      var sync = function () {
        var rs = rows(), n = 0;
        rs.forEach(function (r) { var c = $('.check__input', r); r.setAttribute('aria-selected', c.checked ? 'true' : 'false'); if (c.checked) n++; });
        if (all) { all.checked = n === rs.length && n > 0; all.indeterminate = n > 0 && n < rs.length; }
        var out = byId(table.getAttribute('data-table-select'));
        if (out) out.textContent = n ? n + '편 선택' : '';
      };
      on(all, 'change', function () { rows().forEach(function (r) { $('.check__input', r).checked = all.checked; }); sync(); });
      $$('tbody .check__input', table).forEach(function (c) { on(c, 'change', sync); });
      sync();
    }
    $$('.tbl__sort', table).forEach(function (btn) {
      on(btn, 'click', function () {
        var th = btn.closest('th');
        var idx = Array.prototype.indexOf.call(th.parentNode.children, th);
        var dir = th.getAttribute('aria-sort') === 'ascending' ? 'descending' : 'ascending';
        $$('th[aria-sort]', table).forEach(function (o) { if (o !== th) o.removeAttribute('aria-sort'); });
        th.setAttribute('aria-sort', dir);
        var body = table.tBodies[0];
        var list = Array.prototype.slice.call(body.rows);
        var val = function (r) {
          var c = r.cells[idx]; if (!c) return '';
          var v = c.getAttribute('data-sort');
          if (v == null) v = c.textContent.trim();
          var num = parseFloat(String(v).replace(/[^0-9.\-]/g, ''));
          return /^[\s₩0-9.,:%\-]+$/.test(v) && !isNaN(num) ? num : String(v);
        };
        list.sort(function (a, b) {
          var x = val(a), y = val(b);
          var r = typeof x === 'number' && typeof y === 'number' ? x - y : String(x).localeCompare(String(y), 'ko');
          return dir === 'ascending' ? r : -r;
        });
        list.forEach(function (r) { body.appendChild(r); });
      });
    });
    $$('.tbl__exp button', table).forEach(function (b) {
      on(b, 'click', function () {
        var tr = b.closest('tr');
        var open = !tr.classList.contains('is-open');
        tr.classList.toggle('is-open', open);
        b.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
    });
  }

  /* ------------------------------------------------------------------------
     달력 — 날짜 선택 · 방향키 이동
     ------------------------------------------------------------------------ */
  function initCalendar(cal) {
    if (cal._init) return; cal._init = true;
    var days = $$('.cal__day', cal);
    var out = byId(cal.getAttribute('data-calendar')) || $('[data-cal-output]', cal);
    function pick(d, focus) {
      if (!d || d.disabled) return;
      days.forEach(function (x) { x.setAttribute('aria-selected', x === d ? 'true' : 'false'); x.setAttribute('tabindex', x === d ? '0' : '-1'); });
      if (focus) d.focus();
      if (out) out.textContent = d.getAttribute('data-label') || d.getAttribute('aria-label') || d.textContent.trim();
    }
    var sel = days.filter(function (d) { return d.getAttribute('aria-selected') === 'true'; })[0] ||
      days.filter(function (d) { return d.getAttribute('aria-current') === 'date'; })[0] || days[0];
    days.forEach(function (d) { d.setAttribute('tabindex', d === sel ? '0' : '-1'); });
    days.forEach(function (d, i) {
      on(d, 'click', function () { pick(d, false); });
      on(d, 'keydown', function (e) {
        var step = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }[e.key];
        if (!step) return;
        e.preventDefault();
        var j = i + step;
        while (days[j] && days[j].disabled) j += step > 0 ? 1 : -1;
        if (days[j]) { days.forEach(function (x) { x.setAttribute('tabindex', '-1'); }); days[j].setAttribute('tabindex', '0'); days[j].focus(); }
      });
    });
  }

  /* ------------------------------------------------------------------------
     칸반 — 끌어 옮기기 + 키보드(← →) + 이동 소프트키
     ------------------------------------------------------------------------ */
  function initKanban(board) {
    if (board._init) return; board._init = true;
    var cols = $$('.board__col', board);
    var live = $('[data-kanban-live]', board) || (function () {
      var l = el('p', 'sr-only'); l.setAttribute('aria-live', 'polite'); board.appendChild(l); return l;
    })();
    function count() {
      cols.forEach(function (c) {
        var n = $$('.wo', c).length, cnt = $('.board__head .cnt', c);
        if (cnt) cnt.textContent = n;
      });
    }
    /* 첫 열의 ← · 마지막 열의 → 는 비활성 — 눌러도 반응 없는 키를 남기지 않는다 */
    function syncMoves() {
      $$('.wo', board).forEach(function (card) {
        var ci = cols.indexOf(card.closest('.board__col'));
        $$('[data-move]', card).forEach(function (b) {
          var to = b.getAttribute('data-move') === 'next' ? cols[ci + 1] : cols[ci - 1];
          b.disabled = !to;
        });
      });
    }
    function move(card, col) {
      if (!col) return;
      var list = $('.board__list', col);
      list.appendChild(card);
      count();
      syncMoves();
      var name = $('.board__name', col);
      live.textContent = (($('.wo__id', card) || {}).textContent || '작업') + ' → ' + (name ? name.textContent : '') + ' 열로 옮김';
      board.dispatchEvent(new CustomEvent('kanban:move', { bubbles: true, detail: { card: card, column: col } }));
    }
    var dragging = null;
    $$('.wo', board).forEach(function (card) {
      card.setAttribute('draggable', 'true');
      if (!card.hasAttribute('tabindex')) card.setAttribute('tabindex', '0');
      on(card, 'dragstart', function (e) {
        dragging = card; card.classList.add('is-dragging');
        try { e.dataTransfer.setData('text/plain', ''); e.dataTransfer.effectAllowed = 'move'; } catch (x) {}
      });
      on(card, 'dragend', function () {
        card.classList.remove('is-dragging'); dragging = null;
        $$('.board__list', board).forEach(function (l) { l.classList.remove('is-over'); });
      });
      on(card, 'keydown', function (e) {
        if (e.target !== card) return;
        var ci = cols.indexOf(card.closest('.board__col'));
        if (e.key === 'ArrowRight' && cols[ci + 1]) { e.preventDefault(); move(card, cols[ci + 1]); card.focus(); }
        if (e.key === 'ArrowLeft' && cols[ci - 1]) { e.preventDefault(); move(card, cols[ci - 1]); card.focus(); }
      });
    });
    $$('.board__list', board).forEach(function (list) {
      on(list, 'dragover', function (e) { if (!dragging) return; e.preventDefault(); list.classList.add('is-over'); });
      on(list, 'dragleave', function (e) { if (!list.contains(e.relatedTarget)) list.classList.remove('is-over'); });
      on(list, 'drop', function (e) {
        if (!dragging) return;
        e.preventDefault(); list.classList.remove('is-over');
        var after = $$('.wo', list).filter(function (c) { return c !== dragging; }).find(function (c) {
          var r = c.getBoundingClientRect(); return e.clientY < r.top + r.height / 2;
        });
        if (after) list.insertBefore(dragging, after); else list.appendChild(dragging);
        move(dragging, list.closest('.board__col'));
        if (after) list.insertBefore(dragging, after);
      });
    });
    on(board, 'click', function (e) {
      var b = e.target.closest('[data-move]');
      if (!b) return;
      var card = b.closest('.wo'), ci = cols.indexOf(card.closest('.board__col'));
      var to = b.getAttribute('data-move') === 'next' ? cols[ci + 1] : cols[ci - 1];
      if (to) {
        move(card, to);
        if (b.disabled) { var other = $('[data-move]:not([disabled])', card); (other || card).focus(); } else b.focus();
      }
    });
    count();
    syncMoves();
  }

  /* ------------------------------------------------------------------------
     폼 검증 — 앰버(확인 필요) 오류, 성공 시 상태 CAS
     ------------------------------------------------------------------------ */
  function fieldMsg(input) {
    var f = input.closest('.field') || input.parentNode;
    var m = $('.field__msg--error', f);
    if (!m) {
      m = el('p', 'field__msg field__msg--error');
      m.id = uid('err');
      m.hidden = true;
      f.appendChild(m);
    }
    var ids = (input.getAttribute('aria-describedby') || '').split(' ').filter(Boolean);
    if (ids.indexOf(m.id) < 0) { ids.push(m.id); input.setAttribute('aria-describedby', ids.join(' ')); }
    return m;
  }
  function validity(input) {
    var v = input.validity;
    if (!v || v.valid) return '';
    if (v.valueMissing) return input.getAttribute('data-msg-required') || '필수 입력 칸이 비어 있습니다.';
    if (v.rangeUnderflow || v.rangeOverflow) return input.getAttribute('data-msg-range') || ('허용 범위 ' + input.min + '–' + input.max + ' 밖의 값입니다.');
    if (v.patternMismatch || v.typeMismatch) return input.getAttribute('data-msg-pattern') || '형식이 맞지 않습니다.';
    return input.validationMessage || '값을 확인하세요.';
  }
  function setFieldError(input, msg) {
    var box = input.classList.contains('check__input') ? input : input;
    if (msg) {
      box.setAttribute('aria-invalid', 'true');
      var m = fieldMsg(input); m.textContent = msg; m.hidden = false;
    } else {
      box.removeAttribute('aria-invalid');
      var f = input.closest('.field');
      var m2 = f && $('.field__msg--error', f);
      if (m2) m2.hidden = true;
    }
  }
  function initForm(form) {
    if (form._init) return; form._init = true;
    form.setAttribute('novalidate', '');
    var fields = function () { return $$('input, select, textarea', form).filter(function (i) { return i.willValidate; }); };
    fields().forEach(function (i) {
      on(i, 'input', function () { if (i.getAttribute('aria-invalid') === 'true') setFieldError(i, validity(i)); });
      on(i, 'change', function () { if (i.getAttribute('aria-invalid') === 'true') setFieldError(i, validity(i)); });
    });
    on(form, 'submit', function (e) {
      e.preventDefault();
      var bad = null;
      fields().forEach(function (i) { var m = validity(i); setFieldError(i, m); if (m && !bad) bad = i; });
      if (bad) {
        bad.focus();
        toast({ level: 'caution', code: form.getAttribute('data-error-code') || 'ENTRY CHK', text: form.getAttribute('data-error-text') || '입력값을 확인하세요.' });
        return;
      }
      var btn = $('[type="submit"]', form);
      var finish = function () {
        toast({ level: 'status', code: form.getAttribute('data-success-code') || 'DATA SENT', text: form.getAttribute('data-success-text') || '입력값을 전송했습니다.' });
        form.dispatchEvent(new CustomEvent('form:ok', { bubbles: true }));
      };
      if (btn) busy(btn, 900, finish); else finish();
    });
  }

  /* ---- 스위치 · 슬라이더 · 토글 묶음 -------------------------------------- */
  function initSlider(s) {
    if (s._init) return; s._init = true;
    var input = $('.slider__input', s), out = $('.slider__rdo', s);
    if (!input) return;
    s.style.setProperty('--min', input.min || 0);
    s.style.setProperty('--max', input.max || 100);
    var sync = function () {
      s.style.setProperty('--val', input.value);
      if (out) {
        var unit = $('.rdo__unit', out);
        out.firstChild && out.firstChild.nodeType === 3 ? (out.firstChild.nodeValue = input.value) : out.insertBefore(doc.createTextNode(input.value), out.firstChild);
        if (unit && unit.parentNode !== out) out.appendChild(unit);
      }
      var txt = input.getAttribute('data-valuetext');
      if (txt) input.setAttribute('aria-valuetext', txt.replace('{v}', input.value));
    };
    on(input, 'input', sync);
    sync();
  }
  function toggleGroupClick(btn) {
    var g = btn.closest('[data-toggle-group]');
    if (!g || btn.disabled || btn.getAttribute('aria-disabled') === 'true') return false;
    var mode = g.getAttribute('data-toggle-group');
    var max = parseInt(g.getAttribute('data-max') || '0', 10);
    var pressed = btn.getAttribute('aria-pressed') === 'true';
    var keys = $$('[aria-pressed]', g);
    if (mode === 'single') {
      keys.forEach(function (k) { k.setAttribute('aria-pressed', k === btn ? 'true' : 'false'); });
    } else {
      if (!pressed && max && keys.filter(function (k) { return k.getAttribute('aria-pressed') === 'true'; }).length >= max) {
        toast({ level: 'advisory', code: 'SEL MAX', text: '최대 ' + max + '개까지 선택할 수 있습니다.' });
        return true;
      }
      btn.setAttribute('aria-pressed', pressed ? 'false' : 'true');
    }
    var out = byId(g.getAttribute('data-output'));
    if (out) {
      var vals = keys.filter(function (k) { return k.getAttribute('aria-pressed') === 'true'; })
        .map(function (k) { return k.getAttribute('data-value') || k.textContent.trim(); });
      out.textContent = vals.length ? vals.join(', ') : (g.getAttribute('data-empty') || '선택 없음');
    }
    g.dispatchEvent(new CustomEvent('toggle:change', { bubbles: true }));
    return true;
  }

  /* ---- 체크리스트 진행 -------------------------------------------------- */
  function syncChecklist(list) {
    var items = $$('.chk__item', list);
    var done = 0, nextSet = false;
    items.forEach(function (it) {
      var c = $('.chk__input', it);
      var ok = c ? c.checked : it.getAttribute('data-done') === 'true';
      if (ok) done++;
      it.removeAttribute('data-next');
      if (!ok && !nextSet) { it.setAttribute('data-next', 'true'); nextSet = true; }
    });
    var pct = items.length ? Math.round(done / items.length * 100) : 0;
    var id = list.getAttribute('data-checklist');
    $$('[data-chk-count="' + id + '"]').forEach(function (o) { o.textContent = done + '/' + items.length; });
    $$('[data-chk-progress="' + id + '"]').forEach(function (p) { setProgress(p, pct); });
    var finish = byId(list.getAttribute('data-finish'));
    if (finish) finish.disabled = done < items.length;
  }
  function initChecklist(list) {
    if (list._init) return; list._init = true;
    on(list, 'change', function () { syncChecklist(list); });
    syncChecklist(list);
  }

  /* ---- 테이프 · 게이지 값 --------------------------------------------------- */
  function zoneOf(v, zones) {
    if (zones === 'soc') return v < 25 ? 'warn' : v < 35 ? 'caut' : 'ok';
    return null;
  }
  function setProgress(elm, value) {
    if (!elm) return;
    var v = Math.max(0, Math.min(100, Number(value)));
    elm.style.setProperty('--val', v);
    if (elm.hasAttribute('aria-valuenow') || elm.getAttribute('role') === 'meter' || elm.getAttribute('role') === 'progressbar') elm.setAttribute('aria-valuenow', v);
    var rdo = $('.tape__rdo, .gauge__rdo, .vtape__rdo', elm);
    if (rdo) {
      var tn = null;
      for (var i = 0; i < rdo.childNodes.length; i++) if (rdo.childNodes[i].nodeType === 3 && rdo.childNodes[i].nodeValue.trim()) { tn = rdo.childNodes[i]; break; }
      var txt = String(Math.round(v));
      if (tn) tn.nodeValue = txt; else rdo.insertBefore(doc.createTextNode(txt), rdo.firstChild);
    }
    var z = zoneOf(v, elm.getAttribute('data-zones'));
    if (z) {
      var base = elm.classList.contains('gauge') ? 'gauge' : 'tape';
      ['ok', 'caut', 'warn'].forEach(function (k) { elm.classList.toggle(base + '--' + k, k === z); });
    }
  }

  /* ---- 숫자 롤(오도미터) ---------------------------------------------------- */
  function buildRoll(r, text) {
    r.textContent = '';
    r.setAttribute('aria-label', text);
    String(text).split('').forEach(function (ch) {
      if (/[0-9]/.test(ch)) {
        var col = el('span', 'roll__col');
        col.setAttribute('aria-hidden', 'true');
        for (var d = 0; d <= 9; d++) col.appendChild(el('span', null, String(d)));
        col.style.setProperty('--d', ch);
        r.appendChild(col);
      } else {
        var s = el('span', 'roll__sym', ch); s.setAttribute('aria-hidden', 'true'); r.appendChild(s);
      }
    });
  }
  function roll(r, text) {
    text = String(text);
    var cols = $$('.roll__col, .roll__sym', r);
    var same = cols.length === text.length && text.split('').every(function (ch, i) {
      return /[0-9]/.test(ch) ? cols[i].classList.contains('roll__col') : cols[i].textContent === ch;
    });
    if (!same) { buildRoll(r, text); return; }
    text.split('').forEach(function (ch, i) { if (/[0-9]/.test(ch)) cols[i].style.setProperty('--d', ch); });
    r.setAttribute('aria-label', text);
  }

  /* ---- 셀프테스트 점등 · 선 그리기 (처음 보일 때 1회) ---------------------- */
  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (entries) {
    var k = 0;
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      var t = en.target;
      io.unobserve(t);
      if (t.hasAttribute('data-boot')) t.style.setProperty('--boot-delay', (k++ % 5) * 60 + 'ms');
      t.classList.add('is-on');
    });
  }, { rootMargin: '0px 0px -5% 0px' }) : null;
  var watched = [], bootK = 0;
  function lightAll() {
    watched.forEach(function (t) { if (io) io.unobserve(t); t.classList.add('is-on'); });
  }
  function watch(t) {
    if (t._watched) return; t._watched = true;
    if (!io || RM.matches) { t.classList.add('is-on'); return; }
    /* 이미 지나간 위치(뷰포트 위)나 뷰포트 안이면 즉시 점등 — 앵커 점프·전체 캡처 대비 */
    var r = t.getBoundingClientRect();
    if (r.top < window.innerHeight) {
      if (t.hasAttribute('data-boot')) t.style.setProperty('--boot-delay', (bootK++ % 5) * 60 + 'ms');
      t.classList.add('is-on'); return;
    }
    watched.push(t);
    io.observe(t);
  }
  /* 폴백: load 뒤 1.2초면 남은 DU 모두 점등 · 인쇄 시 전부 점등 */
  on(window, 'load', function () { setTimeout(lightAll, 1200); });
  on(window, 'beforeprint', lightAll);
  if (window.matchMedia) {
    var PM = window.matchMedia('print');
    if (PM.addEventListener) PM.addEventListener('change', function (e) { if (e.matches) lightAll(); });
    else if (PM.addListener) PM.addListener(function (e) { if (e.matches) lightAll(); });
  }
  function replay(t) {
    if (!t) return;
    var targets = [t].concat($$('[data-boot], .draw', t));
    targets.forEach(function (x) { if (x.hasAttribute('data-boot') || x.classList.contains('draw')) x.classList.remove('is-on'); });
    void t.offsetWidth;
    targets.forEach(function (x) { if (x.hasAttribute('data-boot') || x.classList.contains('draw')) x.classList.add('is-on'); });
    $$('[data-roll-seq]', t).forEach(function (r) { stepRoll(r); });
  }
  function stepRoll(r) {
    var seq = (r.getAttribute('data-roll-seq') || '').split('|');
    if (!seq.length) return;
    r._ri = ((r._ri == null ? 0 : r._ri) + 1) % seq.length;
    roll(r, seq[r._ri]);
  }

  /* ---- 가로 스크롤 페이드 힌트 ------------------------------------------- */
  function syncEnd(s) {
    var end = s.scrollWidth - s.clientWidth - s.scrollLeft <= 2;
    s.classList.toggle('is-end', end);
  }
  function initScroller(s) {
    if (s._init) return; s._init = true;
    on(s, 'scroll', function () { syncEnd(s); }, { passive: true });
    syncEnd(s);
  }

  /* ---- 스크롤 위치 테이프 ---------------------------------------------- */
  function initScrollTape(st) {
    var win = $('.scrolltape__win', st);
    var secs = $$('[data-tape-label]');
    function sync() {
      var max = doc.documentElement.scrollHeight - window.innerHeight;
      var p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      st.style.setProperty('--pos', p.toFixed(4));
      if (win && secs.length) {
        var cur = secs[0];
        secs.forEach(function (s) { if (s.getBoundingClientRect().top < window.innerHeight * 0.4) cur = s; });
        var label = cur.getAttribute('data-tape-label');
        if (win.textContent !== label) win.textContent = label;
      }
    }
    on(window, 'scroll', sync, { passive: true });
    on(window, 'resize', sync);
    sync();
  }

  /* ------------------------------------------------------------------------
     위임 클릭
     ------------------------------------------------------------------------ */
  on(doc, 'click', function (e) {
    var t = e.target;
    if (!(t instanceof Element)) return;

    var guard = t.closest('[data-guard]');
    if (guard && guardClick(guard, e)) return;

    var tog = t.closest('[data-theme-toggle]');
    if (tog) { setTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark', true); return; }
    var tset = t.closest('[data-theme-set]');
    if (tset) { setTheme(tset.getAttribute('data-theme-set'), true); return; }

    var mo = t.closest('[data-modal-open]');
    if (mo) { e.preventDefault(); openLayer(byId(mo.getAttribute('data-modal-open')), mo); return; }
    var dro = t.closest('[data-drawer-open]');
    if (dro) { e.preventDefault(); openLayer(byId(dro.getAttribute('data-drawer-open')), dro); return; }
    var co = t.closest('[data-command-open]');
    if (co) { e.preventDefault(); var c = commandEl(); if (c) { initCommand(c); openLayer(c, co); } return; }

    var cl = t.closest('[data-close]');
    if (cl) {
      var layer = cl.closest('.modal, .drawer, .cmd');
      if (layer) { closeLayer(layer); }
      else { closeFloating(true); }
      if (cl.hasAttribute('data-toast')) fireToast(cl);
      return;
    }

    var ft = t.closest('[data-popover-trigger], [data-menu-trigger]');
    if (ft) {
      var panel = byId(ft.getAttribute('aria-controls'));
      if (!panel) return;
      if (panel.classList.contains('menu')) initMenu(panel);
      if (floating && floating.panel === panel) closeFloating(false); else openFloating(panel, ft);
      return;
    }
    if (floating && !floating.panel.contains(t)) closeFloating(false);

    var mw = t.closest('.mlamp');
    if (mw) {
      if (mw.classList.contains('mlamp--warn')) {
        var was = root.getAttribute('data-master') === 'warning' || mw.getAttribute('data-lit') === 'true';
        root.removeAttribute('data-master');
        $$('.mlamp--warn').forEach(function (m) { litMaster(m, false); });
        if (was) toast({ level: 'status', code: 'MSTR WARN ACK', text: '마스터 경고를 확인했습니다. 경고 메시지는 CAS 목록에 남습니다.' });
      } else {
        var lit = mw.getAttribute('data-lit') === 'true';
        $$('.mlamp--caut').forEach(function (m) { litMaster(m, false); });
        if (lit) toast({ level: 'status', code: 'MSTR CAUT ACK', text: '마스터 주의를 확인했습니다.' });
      }
      return;
    }
    var md = t.closest('[data-master-demo]');
    if (md) {
      root.setAttribute('data-master', 'warning');
      $$('.mlamp--warn').forEach(function (m) { litMaster(m, true); });
      if (md.hasAttribute('data-toast')) fireToast(md);
      return;
    }
    var lt = t.closest('[data-lamp-test]');
    if (lt) { lampTest(lt); return; }

    var bd = t.closest('[data-busy-demo]');
    if (bd) { busy(bd, 1600, bd.hasAttribute('data-toast') ? function () { fireToast(bd); } : null); return; }

    var tg = t.closest('[data-toggle-group] [aria-pressed]');
    if (tg && toggleGroupClick(tg)) { if (tg.hasAttribute('data-toast')) fireToast(tg); return; }

    var sw = t.closest('.switch[role="switch"]');
    if (sw && !sw.disabled) {
      sw.setAttribute('aria-checked', sw.getAttribute('aria-checked') === 'true' ? 'false' : 'true');
      sw.dispatchEvent(new CustomEvent('switch:change', { bubbles: true }));
      return;
    }

    var mq2 = t.closest('[data-marquee-toggle]');
    if (mq2) {
      var at = mq2.closest('.atis');
      var paused = mq2.getAttribute('aria-pressed') !== 'true';
      mq2.setAttribute('aria-pressed', paused ? 'true' : 'false');
      mq2.setAttribute('aria-label', paused ? 'ATIS 띠 다시 흐르기' : 'ATIS 띠 멈춤');
      if (at) at.classList.toggle('is-paused', paused);
      return;
    }

    var cp = t.closest('[data-copy]');
    if (cp) {
      var src = cp.getAttribute('data-copy');
      var node = src ? $(src) : (cp.closest('.code') && $('.code__pre', cp.closest('.code')));
      if (node) copyText(node.textContent, cp);
      return;
    }
    var dis = t.closest('[data-dismiss]');
    if (dis) { var box = dis.closest('.cas, .toast, [data-dismissible]'); if (box) removeToast(box); return; }
    var ack = t.closest('[data-cas-ack]');
    if (ack) {
      var cas = ack.closest('.cas');
      if (cas) { cas.setAttribute('data-acked', 'true'); ack.disabled = true; ack.textContent = '확인됨'; }
      return;
    }
    var mp = t.closest('[data-motion-play]');
    if (mp) { replay(byId(mp.getAttribute('data-motion-play'))); return; }
    var rd = t.closest('[data-roll-demo]');
    if (rd) { var r = byId(rd.getAttribute('data-roll-demo')); if (r) stepRoll(r); return; }
    var pd = t.closest('[data-progress-demo]');
    if (pd) {
      var target = byId(pd.getAttribute('data-progress-demo'));
      if (target) setProgress(target, pd.getAttribute('data-value'));
      return;
    }

    var tst = t.closest('[data-toast]');
    if (tst) { fireToast(tst); }
  });

  function fireToast(src) {
    toast({
      level: src.getAttribute('data-toast') || 'status',
      code: src.getAttribute('data-toast-code') || '',
      text: src.getAttribute('data-toast-text') || '',
      sub: src.getAttribute('data-toast-sub') || ''
    });
  }

  /* ------------------------------------------------------------------------
     키보드 — ⌘K, Esc(맨 위 레이어부터), Tab 트랩
     ------------------------------------------------------------------------ */
  on(doc, 'keydown', function (e) {
    if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
      var c = commandEl();
      if (c) {
        e.preventDefault();
        initCommand(c);
        if (layers.indexOf(c) > -1) closeLayer(c); else openLayer(c, doc.activeElement);
      }
      return;
    }
    if (e.key === 'Escape') {
      if (floating) { e.preventDefault(); closeFloating(true); return; }
      if (layers.length) { e.preventDefault(); closeLayer(); return; }
      $$('[data-guard][data-armed="true"]').forEach(disarm);
      var tipA = doc.activeElement && doc.activeElement.closest && doc.activeElement.closest('.tip-anchor');
      $$('.tip-anchor').forEach(function (a) { if (a.matches(':hover') || a === tipA) a.classList.add('is-dismissed'); });
      return;
    }
    if (e.key === 'Tab' && layers.length) trapTab(e);
  });
  on(doc, 'mouseout', function (e) {
    var a = e.target.closest && e.target.closest('.tip-anchor.is-dismissed');
    if (a && !a.contains(e.relatedTarget)) a.classList.remove('is-dismissed');
  });
  on(doc, 'focusout', function (e) {
    var a = e.target.closest && e.target.closest('.tip-anchor.is-dismissed');
    if (a) a.classList.remove('is-dismissed');
    var g = e.target.closest && e.target.closest('[data-guard][data-armed="true"]');
    if (g) disarm(g);
  });
  // 오버레이 바깥(스크림) 클릭 닫기
  on(doc, 'mousedown', function (e) {
    var top = layers[layers.length - 1];
    if (top && e.target === top && !top.classList.contains('cmd') && !top.hasAttribute('data-static')) closeLayer(top);
  });

  /* ------------------------------------------------------------------------
     초기화
     ------------------------------------------------------------------------ */
  function init(scope) {
    scope = scope || doc;
    $$('[data-tabs]', scope).forEach(initTabs);
    $$('[data-accordion]', scope).forEach(initAccordion);
    $$('[data-carousel]', scope).forEach(initCarousel);
    $$('table.tbl', scope).forEach(initTable);
    $$('[data-calendar]', scope).forEach(initCalendar);
    $$('[data-kanban]', scope).forEach(initKanban);
    $$('form[data-validate]', scope).forEach(initForm);
    $$('.slider', scope).forEach(initSlider);
    $$('[data-checklist]', scope).forEach(initChecklist);
    $$('.code', scope).forEach(initCode);
    $$('.atis', scope).forEach(initMarquee);
    $$('.menu', scope).forEach(initMenu);
    $$('.cmd', scope).forEach(initCommand);
    $$('.hscroll, .tabs__list, .rail, .railed__keys, .phase', scope).forEach(initScroller);
    $$('[data-roll]', scope).forEach(function (r) { if (!r._roll) { r._roll = true; buildRoll(r, r.getAttribute('data-roll') || r.textContent.trim()); } });
    $$('[data-roll-seq]', scope).forEach(function (r) { if (!r._roll) { r._roll = true; r._ri = 0; buildRoll(r, r.getAttribute('data-roll-seq').split('|')[0]); } });
    $$('.tape[data-zones], .gauge[data-zones]', scope).forEach(function (g) {
      var v = g.getAttribute('aria-valuenow') || getComputedStyle(g).getPropertyValue('--val');
      setProgress(g, parseFloat(v) || 0);
    });
    $$('[data-boot], .draw', scope).forEach(watch);
    $$('.mlamp', scope).forEach(function (m) { litMaster(m, m.getAttribute('data-lit') === 'true'); });
    $$('.modal, .drawer, .cmd', scope).forEach(function (o) { if (!o.classList.contains('is-open')) o.hidden = true; });
    syncToggles(root.getAttribute('data-theme'));
    tickClocks();
  }

  /* 404 — 실제로 요청된 주소를 보여 준다. 404 파일을 직접 연 경우(미리보기)에는
     정적 기본값(그럴듯한 없는 경로)을 그대로 둔다 — 파일명이 새지 않게. */
  function showLostPath() {
    var code = $('[data-lost-path]');
    if (!code) return;
    var p = location.pathname || '/';
    var from = /[?&]from=([^&#]+)/.exec(location.search);
    if (from) { try { code.textContent = decodeURIComponent(from[1]); } catch (e) {} return; }
    if (/\/404(\.html)?$/.test(p) || location.protocol === 'file:') return;
    try { p = decodeURIComponent(p); } catch (e) {}
    code.textContent = p + location.search;
  }

  /* 좁은 화면(≤480) — 접을 수 있는 해설·견본 묶음은 접힌 채로 시작, 넓은 화면은 펼침 */
  function initFolds() {
    var folds = $$('[data-fold-sm]');
    if (!folds.length || !window.matchMedia) return;
    var sm = window.matchMedia('(max-width: 480px)');
    function apply() {
      folds.forEach(function (d) {
        if (sm.matches) d.removeAttribute('open'); else d.setAttribute('open', '');
      });
    }
    apply();
    if (sm.addEventListener) sm.addEventListener('change', apply); else if (sm.addListener) sm.addListener(apply);
  }

  function start() {
    init(doc);
    showLostPath();
    initFolds();
    var st = $('.scrolltape');
    if (st) initScrollTape(st);
    setInterval(tickClocks, 1000);
    on(window, 'resize', function () { $$('.hscroll, .tabs__list, .rail, .railed__keys, .phase').forEach(syncEnd); });
  }
  if (doc.readyState === 'loading') on(doc, 'DOMContentLoaded', start); else start();

  window.Solgae = {
    toast: toast,
    setProgress: setProgress,
    setTheme: function (t) { setTheme(t, true); },
    open: function (id) { var x = byId(id); if (x) { if (x.classList.contains('cmd')) initCommand(x); openLayer(x); } },
    close: function (id) { closeLayer(id ? byId(id) : undefined); },
    roll: roll,
    zulu: zulu,
    init: init
  };
})();
