/* 제비항공 JEBI AIR — 디자인 시스템 인터랙션 (바닐라 JS, 외부 라이브러리 없음)
   계약: COMPONENTS.md. 공개 API는 window.JB.
   1 테마  2 레이어(모달·드로어·커맨드·사이드바)  3 커맨드 팔레트  4 탭  5 아코디언  6 토스트
   7 팝오버·메뉴  8 툴팁  9 캐러셀  10 마키  11 표  12 가로 스크롤 힌트  13 달력  14 칸반
   15 폼 검증·스위치  16 단계 진행(stepper)  17 코드 복사  18 진행 막대  19 모션·이륙 진입
   20 버튼 로딩 · 경고 닫기 · 화면 전환 · 값 연결 */
(function () {
  'use strict';

  var doc = document;
  var root = doc.documentElement;
  var THEME_KEY = 'jebi-theme';
  root.classList.add('jb-js');

  function $(sel, ctx) { return (ctx || doc).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || doc).querySelectorAll(sel)); }
  function byId(id) { return id ? doc.getElementById(id) : null; }
  function pad2(n) { return (n < 10 ? '0' : '') + n; }
  var reduceMQ = window.matchMedia('(prefers-reduced-motion: reduce)');
  function reduced() { return reduceMQ.matches || root.classList.contains('jb-reduce-motion'); }
  function overlayMs() { return reduced() ? 0 : 320; }
  function reflow(el) { return el.offsetWidth; }

  var ICONS = {
    info: '<path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15z"/><path d="M10 20.5a2 2 0 0 0 4 0"/>',
    ok: '<circle cx="12" cy="12" r="9"/><path d="M8 12.5l2.8 2.8L16.5 9.5"/>',
    warn: '<path d="M12 3.5L21.5 20h-19z"/><path d="M12 10v4.5"/><path d="M12 17.4v.1"/>',
    danger: '<circle cx="12" cy="12" r="9"/><path d="M12 7.5v5.5"/><path d="M12 16.4v.1"/>',
    close: '<path d="M6 6l12 12M18 6L6 18"/>'
  };
  function svgIcon(name, cls) {
    return '<svg class="' + (cls || 'jb-icon') + '" viewBox="0 0 24 24" aria-hidden="true">' + (ICONS[name] || ICONS.info) + '</svg>';
  }

  /* ───────── 1. 테마: ?theme= → localStorage → 시스템 ───────── */
  function queryTheme() {
    try { var q = new URLSearchParams(location.search).get('theme'); return q === 'dark' || q === 'light' ? q : null; } catch (e) { return null; }
  }
  function storedTheme() {
    try { var s = localStorage.getItem(THEME_KEY); return s === 'dark' || s === 'light' ? s : null; } catch (e) { return null; }
  }
  function systemTheme() { return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'; }
  function resolveTheme() { return queryTheme() || storedTheme() || systemTheme(); }
  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    $$('[data-theme-toggle]').forEach(function (btn) {
      btn.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
      if (!btn.hasAttribute('aria-label')) btn.setAttribute('aria-label', '밤 화면');
      var label = $('[data-theme-label]', btn);
      if (label) label.textContent = theme === 'dark' ? '밤' : '낮';
    });
  }
  doc.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-theme-toggle]');
    if (!btn) return;
    var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    try { localStorage.setItem(THEME_KEY, next); } catch (err) { /* 저장 불가 환경 */ }
    if (queryTheme()) {
      try {
        var url = new URL(location.href);
        url.searchParams.set('theme', next);
        history.replaceState(null, '', url);
      } catch (err2) { /* file:// 등 */ }
    }
  });
  try {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function () {
      if (!queryTheme() && !storedTheme()) applyTheme(systemTheme());
    });
  } catch (e) { /* 구형 브라우저 */ }

  /* ───────── 2. 레이어: 모달 · 드로어 · 커맨드 · 사이드바(모바일) ───────── */
  var layers = [];
  var FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
  function focusables(box) {
    return $$(FOCUSABLE, box).filter(function (el) { return el.offsetWidth > 0 || el.offsetHeight > 0 || el === doc.activeElement; });
  }
  function layerBox(el) {
    return $('.jb-modal__box, .jb-drawer__panel, .jb-command__box', el) || el;
  }
  function syncScrollLock() {
    root.style.overflow = layers.some(function (l) { return l.lock; }) ? 'hidden' : '';
  }
  function openLayer(el, opener) {
    if (!el || layers.some(function (l) { return l.el === el; })) return;
    closeFloat(false);
    var isSide = el.classList.contains('jb-side');
    var layer = { el: el, opener: opener || doc.activeElement, side: isSide, lock: true, scrim: null };
    if (isSide) {
      layer.scrim = byId(el.getAttribute('data-scrim')) || $('.jb-staff__scrim');
      if (layer.scrim) layer.scrim.classList.add('is-open');
      el.classList.add('is-open');
      el.setAttribute('role', 'dialog');
      el.setAttribute('aria-modal', 'true');
    } else {
      el.hidden = false;
      reflow(el);
      el.classList.add('is-open');
    }
    if (layer.opener && layer.opener.setAttribute) layer.opener.setAttribute('aria-expanded', 'true');
    layers.push(layer);
    syncScrollLock();
    if (el.classList.contains('jb-command') && el._reset) el._reset();
    var box = layerBox(el);
    var target = $('[data-autofocus]', box) || focusables(box)[0] || box;
    if (target === box && !box.hasAttribute('tabindex')) box.setAttribute('tabindex', '-1');
    window.setTimeout(function () { target.focus({ preventScroll: true }); }, isSide ? 30 : 10);
    el.dispatchEvent(new CustomEvent('jb:open', { bubbles: true }));
  }
  function closeLayer(el, restore) {
    var i = -1;
    for (var k = layers.length - 1; k >= 0; k--) { if (!el || layers[k].el === el) { i = k; break; } }
    if (i < 0) return;
    var layer = layers.splice(i, 1)[0];
    var node = layer.el;
    node.classList.remove('is-open');
    if (layer.side) {
      if (layer.scrim) layer.scrim.classList.remove('is-open');
      node.removeAttribute('role');
      node.removeAttribute('aria-modal');
    } else {
      window.setTimeout(function () { if (!node.classList.contains('is-open')) node.hidden = true; }, overlayMs());
    }
    if (layer.opener && layer.opener.setAttribute) layer.opener.setAttribute('aria-expanded', 'false');
    syncScrollLock();
    if (restore !== false && layer.opener && layer.opener.focus) layer.opener.focus({ preventScroll: true });
    node.dispatchEvent(new CustomEvent('jb:close', { bubbles: true }));
  }
  function topLayer() { return layers[layers.length - 1]; }

  doc.addEventListener('click', function (e) {
    var opener = e.target.closest('[data-modal-open], [data-drawer-open]');
    if (opener) {
      e.preventDefault();
      openLayer(byId(opener.getAttribute('data-modal-open') || opener.getAttribute('data-drawer-open')), opener);
      return;
    }
    var cmd = e.target.closest('[data-command-open]');
    if (cmd) {
      e.preventDefault();
      openLayer(byId(cmd.getAttribute('data-command-open')) || $('.jb-command:not(.jb-command--static)'), cmd);
      return;
    }
    var sideBtn = e.target.closest('[data-side-toggle]');
    if (sideBtn) {
      var side = byId(sideBtn.getAttribute('aria-controls')) || $('.jb-side:not(.jb-side--static)');
      if (side && side.classList.contains('is-open')) closeLayer(side); else openLayer(side, sideBtn);
      return;
    }
    var closer = e.target.closest('[data-close]');
    if (closer) {
      var host = closer.closest('.jb-modal, .jb-drawer, .jb-command, .jb-side');
      if (host) { closeLayer(host); return; }
    }
    if (e.target.matches('.jb-modal__scrim, .jb-drawer__scrim, .jb-command__scrim')) {
      closeLayer(e.target.closest('.jb-modal, .jb-drawer, .jb-command'));
      return;
    }
    if (e.target.matches('.jb-staff__scrim')) {
      var open = $('.jb-side.is-open');
      if (open) closeLayer(open);
    }
  });
  // 레이어 안 링크로 같은 페이지 이동하면 닫기
  doc.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#"]');
    if (!a) return;
    var host = a.closest('.jb-drawer, .jb-side.is-open');
    if (host) closeLayer(host, false);
  });
  window.addEventListener('resize', function () {
    if (window.innerWidth > 1024) {
      var side = $('.jb-side.is-open');
      if (side) closeLayer(side, false);
    }
  });

  /* ───────── 3. 커맨드 팔레트 ───────── */
  function initCommand(el) {
    if (el._jbInit) return; el._jbInit = true;
    var input = $('.jb-command__input', el);
    var list = $('.jb-command__list', el);
    var empty = $('.jb-command__empty', el);
    var items = $$('.jb-command__item', el);
    if (!input || !list) return;
    var base = el.id || ('jb-cmd-' + Math.random().toString(36).slice(2, 7));
    input.setAttribute('role', 'combobox');
    input.setAttribute('aria-expanded', 'true');
    input.setAttribute('aria-autocomplete', 'list');
    if (!list.id) list.id = base + '-list';
    list.setAttribute('role', 'listbox');
    input.setAttribute('aria-controls', list.id);
    items.forEach(function (it, i) {
      if (!it.id) it.id = base + '-opt-' + i;
      it.setAttribute('role', 'option');
      it.setAttribute('aria-selected', 'false');
    });
    $$('.jb-command__group', el).forEach(function (g) { g.setAttribute('role', 'group'); });
    var active = null;
    function visible() { return items.filter(function (it) { return !it.hidden && !(it.closest('.jb-command__group') || {}).hidden; }); }
    function setActive(it) {
      items.forEach(function (x) { x.setAttribute('aria-selected', x === it ? 'true' : 'false'); });
      active = it || null;
      if (active) {
        input.setAttribute('aria-activedescendant', active.id);
        if (el.classList.contains('is-open') || el.classList.contains('jb-command--static')) {
          var lr = list.getBoundingClientRect(); var ir = active.getBoundingClientRect();
          if (ir.top < lr.top) list.scrollTop -= lr.top - ir.top;
          else if (ir.bottom > lr.bottom) list.scrollTop += ir.bottom - lr.bottom;
        }
      } else input.removeAttribute('aria-activedescendant');
    }
    function norm(s) { return (s || '').toLowerCase().replace(/\s+/g, ''); }
    function filter() {
      var q = norm(input.value);
      items.forEach(function (it) {
        var hay = norm((it.getAttribute('data-keywords') || '') + ' ' + it.textContent);
        it.hidden = !!q && hay.indexOf(q) < 0;
      });
      $$('.jb-command__group', el).forEach(function (g) {
        g.hidden = !$$('.jb-command__item', g).some(function (it) { return !it.hidden; });
      });
      var v = visible();
      if (empty) empty.hidden = v.length > 0;
      setActive(v[0] || null);
    }
    function choose(it) {
      if (!it) return;
      var href = it.getAttribute('data-href');
      if (href) { location.href = href; return; }
      if (!el.classList.contains('jb-command--static')) closeLayer(el);
      var title = it.getAttribute('data-toast-title');
      if (title) toast({ title: title, text: it.getAttribute('data-toast-text') || '', tone: it.getAttribute('data-toast') || 'info' });
    }
    input.addEventListener('input', filter);
    input.addEventListener('keydown', function (e) {
      var v = visible(); if (!v.length) return;
      var i = v.indexOf(active);
      if (e.key === 'ArrowDown') { e.preventDefault(); setActive(v[(i + 1) % v.length]); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(v[(i - 1 + v.length) % v.length]); }
      else if (e.key === 'Home' && e.ctrlKey) { e.preventDefault(); setActive(v[0]); }
      else if (e.key === 'End' && e.ctrlKey) { e.preventDefault(); setActive(v[v.length - 1]); }
      else if (e.key === 'Enter') { e.preventDefault(); choose(active); }
    });
    list.addEventListener('click', function (e) { choose(e.target.closest('.jb-command__item')); });
    list.addEventListener('mousemove', function (e) {
      var it = e.target.closest('.jb-command__item');
      if (it && it !== active) setActive(it);
    });
    var initial = input.value;
    el._reset = function () { input.value = initial; filter(); };
    filter();
  }
  doc.addEventListener('keydown', function (e) {
    if ((e.metaKey || e.ctrlKey) && !e.altKey && (e.key === 'k' || e.key === 'K')) {
      var el = $('.jb-command:not(.jb-command--static)');
      if (!el) return;
      e.preventDefault();
      if (el.classList.contains('is-open')) closeLayer(el); else openLayer(el, doc.activeElement);
    }
  });

  /* ───────── 4. 탭 ───────── */
  function initTabs(box) {
    if (box._jbInit) return; box._jbInit = true;
    var list = $('[role="tablist"]', box);
    if (!list) return;
    var tabs = $$('[role="tab"]', list);
    function select(tab, focus) {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        t.tabIndex = on ? 0 : -1;
        var panel = byId(t.getAttribute('aria-controls'));
        if (panel) panel.hidden = !on;
      });
      if (focus) tab.focus();
      if (list.scrollWidth > list.clientWidth) {
        var lr = list.getBoundingClientRect(), tr = tab.getBoundingClientRect();
        if (tr.left < lr.left) list.scrollLeft -= lr.left - tr.left + 24;
        else if (tr.right > lr.right) list.scrollLeft += tr.right - lr.right + 24;
      }
      box.dispatchEvent(new CustomEvent('jb:tab', { bubbles: true, detail: { tab: tab } }));
    }
    tabs.forEach(function (t) {
      t.addEventListener('click', function () { if (!t.disabled) select(t); });
    });
    list.addEventListener('keydown', function (e) {
      var enabled = tabs.filter(function (t) { return !t.disabled && t.getAttribute('aria-disabled') !== 'true'; });
      var i = enabled.indexOf(doc.activeElement);
      if (i < 0) return;
      var n = null;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') n = enabled[(i + 1) % enabled.length];
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') n = enabled[(i - 1 + enabled.length) % enabled.length];
      else if (e.key === 'Home') n = enabled[0];
      else if (e.key === 'End') n = enabled[enabled.length - 1];
      if (n) { e.preventDefault(); select(n, true); }
    });
    select(tabs.filter(function (t) { return t.getAttribute('aria-selected') === 'true'; })[0] || tabs[0]);
  }

  /* ───────── 5. 아코디언 ───────── */
  function initAccordion(box) {
    if (box._jbInit) return; box._jbInit = true;
    var single = box.getAttribute('data-accordion') === 'single';
    var triggers = $$('.jb-accordion__trigger', box);
    function set(t, open) {
      t.setAttribute('aria-expanded', open ? 'true' : 'false');
      var panel = byId(t.getAttribute('aria-controls'));
      if (panel) panel.hidden = !open;
      var item = t.closest('.jb-accordion__item');
      if (item) item.classList.toggle('is-open', open);
    }
    triggers.forEach(function (t) {
      set(t, t.getAttribute('aria-expanded') === 'true');
      t.addEventListener('click', function () {
        if (t.disabled || t.getAttribute('aria-disabled') === 'true') return;
        var open = t.getAttribute('aria-expanded') !== 'true';
        if (single && open) triggers.forEach(function (o) { if (o !== t) set(o, false); });
        set(t, open);
      });
    });
  }

  /* ───────── 6. 토스트 ───────── */
  function toastZone() {
    var z = $('.jb-toasts:not(.jb-toasts--static)');
    if (!z) {
      z = doc.createElement('div');
      z.className = 'jb-toasts';
      z.setAttribute('role', 'status');
      z.setAttribute('aria-live', 'polite');
      doc.body.appendChild(z);
    }
    return z;
  }
  function dismissToast(t) {
    if (!t || t.classList.contains('is-leaving')) return;
    t.classList.add('is-leaving');
    window.setTimeout(function () { t.remove(); }, overlayMs());
  }
  function toast(opts) {
    opts = opts || {};
    var tone = ['info', 'ok', 'warn', 'danger'].indexOf(opts.tone) >= 0 ? opts.tone : 'info';
    var t = doc.createElement('div');
    t.className = 'jb-toast jb-toast--' + tone;
    t.innerHTML = svgIcon(tone, 'jb-toast__icon') +
      '<div class="jb-toast__body"><p class="jb-toast__title"></p>' + (opts.text ? '<p class="jb-toast__text"></p>' : '') + '</div>' +
      '<button type="button" class="jb-toast__close" aria-label="알림 닫기">' + svgIcon('close') + '</button>';
    $('.jb-toast__title', t).textContent = opts.title || '';
    if (opts.text) $('.jb-toast__text', t).textContent = opts.text;
    $('.jb-toast__close', t).addEventListener('click', function () { dismissToast(t); });
    var zone = toastZone();
    zone.appendChild(t);
    var items = $$('.jb-toast', zone).filter(function (x) { return !x.classList.contains('is-leaving'); });
    if (items.length > 4) dismissToast(items[0]);
    var ms = typeof opts.duration === 'number' ? opts.duration : 5200;
    if (ms > 0) {
      var timer = window.setTimeout(function () { dismissToast(t); }, ms);
      t.addEventListener('mouseenter', function () { window.clearTimeout(timer); });
      t.addEventListener('focusin', function () { window.clearTimeout(timer); });
    }
    return t;
  }
  function toastFromEl(el) {
    return {
      tone: el.getAttribute('data-toast') || 'info',
      title: el.getAttribute('data-toast-title') || '',
      text: el.getAttribute('data-toast-text') || ''
    };
  }
  doc.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-toast]');
    if (btn && !btn.hasAttribute('data-busy-demo') && !btn.closest('form[data-validate]') && !btn.classList.contains('jb-command__item')) {
      toast(toastFromEl(btn));
    }
    var close = e.target.closest('.jb-toast__close');
    if (close && close.closest('.jb-toasts--static')) dismissToast(close.closest('.jb-toast'));
  });

  /* ───────── 7. 팝오버 · 메뉴 (떠 있는 패널) ───────── */
  var floatState = null;
  function placeFloat() {
    if (!floatState) return;
    var panel = floatState.panel, trigger = floatState.trigger;
    var r = trigger.getBoundingClientRect();
    var w = panel.offsetWidth, h = panel.offsetHeight;
    var vw = doc.documentElement.clientWidth, vh = window.innerHeight;
    var gap = floatState.type === 'menu' ? 6 : 12;
    var left = panel.getAttribute('data-align') === 'end' ? r.right - w : r.left;
    if (floatState.type === 'popover') left = r.left + r.width / 2 - 28;
    left = Math.max(12, Math.min(left, vw - w - 12));
    var top = r.bottom + gap, placement = 'bottom';
    if (top + h > vh - 12 && r.top - h - gap > 12) { top = r.top - h - gap; placement = 'top'; }
    panel.style.left = Math.round(left) + 'px';
    panel.style.top = Math.round(top) + 'px';
    panel.setAttribute('data-placement', placement);
    var ax = Math.max(18, Math.min(r.left + r.width / 2 - left, w - 18));
    panel.style.setProperty('--arrow-x', Math.round(ax) + 'px');
  }
  function menuItems(panel) {
    return $$('[role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"]', panel).filter(function (i) { return i.getAttribute('aria-disabled') !== 'true'; });
  }
  function openFloat(panel, trigger, type, focusLast) {
    closeFloat(false);
    panel.hidden = false;
    floatState = { panel: panel, trigger: trigger, type: type };
    trigger.setAttribute('aria-expanded', 'true');
    placeFloat();
    if (type === 'menu') {
      var items = menuItems(panel);
      var f = focusLast ? items[items.length - 1] : items[0];
      if (f) f.focus();
    } else {
      var target = $('[data-autofocus]', panel) || focusables(panel)[0];
      if (target) target.focus({ preventScroll: true });
    }
  }
  function closeFloat(restore) {
    if (!floatState) return;
    var s = floatState;
    floatState = null;
    s.panel.hidden = true;
    s.trigger.setAttribute('aria-expanded', 'false');
    if (restore) s.trigger.focus({ preventScroll: true });
  }
  doc.addEventListener('click', function (e) {
    var pt = e.target.closest('[data-popover-trigger], [data-menu-trigger]');
    if (pt) {
      var isMenu = pt.hasAttribute('data-menu-trigger');
      var panel = byId(pt.getAttribute('aria-controls') || pt.getAttribute(isMenu ? 'data-menu-trigger' : 'data-popover-trigger'));
      if (!panel) return;
      e.preventDefault();
      if (floatState && floatState.panel === panel) closeFloat(true);
      else openFloat(panel, pt, isMenu ? 'menu' : 'popover');
      return;
    }
    if (!floatState) return;
    if (e.target.closest('[data-close]') && floatState.panel.contains(e.target)) { closeFloat(true); return; }
    var mi = e.target.closest('[role^="menuitem"]');
    if (mi && floatState.panel.contains(mi)) {
      if (mi.getAttribute('aria-disabled') === 'true') return;
      if (!mi.hasAttribute('data-keep-open')) closeFloat(true);
      return;
    }
    if (!floatState.panel.contains(e.target)) closeFloat(false);
  });
  doc.addEventListener('keydown', function (e) {
    var mt = e.target.closest && e.target.closest('[data-menu-trigger]');
    if (mt && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      var panel = byId(mt.getAttribute('aria-controls') || mt.getAttribute('data-menu-trigger'));
      if (panel) { e.preventDefault(); openFloat(panel, mt, 'menu', e.key === 'ArrowUp'); }
      return;
    }
    var menu = e.target.closest && e.target.closest('.jb-menu');
    if (menu && ['ArrowDown', 'ArrowUp', 'Home', 'End'].indexOf(e.key) >= 0) {
      var items = menuItems(menu);
      var i = items.indexOf(doc.activeElement);
      var n = e.key === 'ArrowDown' ? items[(i + 1) % items.length]
        : e.key === 'ArrowUp' ? items[(i - 1 + items.length) % items.length]
        : e.key === 'Home' ? items[0] : items[items.length - 1];
      if (n) { e.preventDefault(); n.focus(); }
      return;
    }
    if (menu && e.key === 'Tab' && floatState && floatState.panel === menu) closeFloat(false);
  });
  window.addEventListener('resize', function () { if (floatState) placeFloat(); });
  window.addEventListener('scroll', function () { if (floatState) placeFloat(); }, true);

  /* ───────── Esc · 포커스 트랩 ───────── */
  doc.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      // 정적 견본(.jb-tip--static)은 페이지 어디서 Esc를 눌러도 꺼지지 않는다. 그 위에 마우스·포커스가 있을 때만 잠깐 숨긴다.
      var tips = $$('.jb-tip:hover, .jb-tip:focus-within, .jb-tip.is-open:not(.jb-tip--static)');
      if (tips.length) tips.forEach(function (t) {
        t.classList.add('is-dismissed');
        if (!t.classList.contains('jb-tip--static')) t.classList.remove('is-open');
      });
      if (floatState) { e.preventDefault(); closeFloat(true); return; }
      var grabbed = $('.jb-kanban__card.is-grabbed');
      if (grabbed) return; // 칸반이 처리
      var top = topLayer();
      if (top) { e.preventDefault(); closeLayer(top.el); }
      return;
    }
    if (e.key === 'Tab') {
      var layer = topLayer();
      if (!layer) return;
      var box = layer.side ? layer.el : layerBox(layer.el);
      var f = focusables(box);
      if (!f.length) { e.preventDefault(); return; }
      var first = f[0], last = f[f.length - 1];
      if (!box.contains(doc.activeElement)) { e.preventDefault(); first.focus(); }
      else if (e.shiftKey && doc.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && doc.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  /* ───────── 8. 툴팁 (가장자리 보정 · Esc 숨김 해제) ───────── */
  function fitTip(t) {
    if (t.classList.contains('jb-tip--start') || t.classList.contains('jb-tip--end')) return;
    var b = $('.jb-tip__bubble', t);
    if (!b) return;
    // 변형(transform) 중간값이 아니라 배치 기준으로 계산: 트리거 가운데에 말풍선 폭을 놓아 본다
    var tr = t.getBoundingClientRect(), w = b.offsetWidth, vw = doc.documentElement.clientWidth, m = 8, dx = 0;
    var left = tr.left + tr.width / 2 - w / 2, right = left + w;
    if (left < m) dx = m - left;
    else if (right > vw - m) dx = (vw - m) - right;
    if (dx) t.style.setProperty('--tip-dx', Math.round(dx) + 'px'); else t.style.removeProperty('--tip-dx');
  }
  doc.addEventListener('mouseover', function (e) {
    var t = e.target.closest && e.target.closest('.jb-tip');
    if (t && !t.contains(e.relatedTarget)) fitTip(t);
  });
  doc.addEventListener('focusin', function (e) {
    var t = e.target.closest && e.target.closest('.jb-tip');
    if (t) fitTip(t);
  });
  doc.addEventListener('mouseout', function (e) {
    var t = e.target.closest && e.target.closest('.jb-tip');
    if (t && !t.contains(e.relatedTarget)) t.classList.remove('is-dismissed');
  });
  doc.addEventListener('focusout', function (e) {
    var t = e.target.closest && e.target.closest('.jb-tip');
    if (t && !t.contains(e.relatedTarget)) {
      t.classList.remove('is-dismissed');
      if (!t.classList.contains('jb-tip--static')) t.classList.remove('is-open');
    }
  });

  /* ───────── 9. 캐러셀 ───────── */
  function initCarousel(box) {
    if (box._jbInit) return; box._jbInit = true;
    var slides = $$('.jb-carousel__slide', box);
    var prev = $('[data-carousel-prev]', box), next = $('[data-carousel-next]', box);
    var count = $('[data-carousel-count]', box), name = $('[data-carousel-name]', box);
    var live = $('.jb-carousel__live', box);
    var idx = 0;
    function per() { return Math.max(1, Math.round(parseFloat(getComputedStyle(box).getPropertyValue('--per')) || 1)); }
    function render(announce) {
      var p = per(), max = Math.max(0, slides.length - p);
      idx = Math.min(Math.max(idx, 0), max);
      box.style.setProperty('--idx', idx);
      slides.forEach(function (s, i) {
        var vis = i >= idx && i < idx + p;
        s.setAttribute('aria-hidden', vis ? 'false' : 'true');
        s.inert = !vis;
      });
      if (prev) prev.disabled = idx === 0;
      if (next) next.disabled = idx >= max;
      if (count) count.textContent = pad2(idx + 1) + ' / ' + pad2(slides.length);
      if (name) name.textContent = slides[idx] ? (slides[idx].getAttribute('data-title') || '') : '';
      if (announce && live) live.textContent = (idx + 1) + '번째 엽서, 모두 ' + slides.length + '장';
    }
    if (prev) prev.addEventListener('click', function () { idx -= 1; render(true); });
    if (next) next.addEventListener('click', function () { idx += 1; render(true); });
    box.addEventListener('keydown', function (e) {
      if (e.target.closest('input, textarea, select')) return;
      if (e.key === 'ArrowLeft') { idx -= 1; render(true); }
      else if (e.key === 'ArrowRight') { idx += 1; render(true); }
    });
    var sx = null;
    var vp = $('.jb-carousel__viewport', box) || box;
    vp.addEventListener('pointerdown', function (e) { sx = e.clientX; });
    vp.addEventListener('pointerup', function (e) {
      if (sx === null) return;
      var dx = e.clientX - sx; sx = null;
      if (Math.abs(dx) > 40) { idx += dx < 0 ? 1 : -1; render(true); }
    });
    window.addEventListener('resize', function () { render(false); });
    render(false);
  }

  /* ───────── 10. 마키 ───────── */
  function initMarquee(m) {
    if (m._jbInit) return; m._jbInit = true;
    var track = $('.jb-marquee__track', m);
    if (track && !$('[aria-hidden="true"]', track)) {
      $$(':scope > *', track).forEach(function (item) {
        var c = item.cloneNode(true);
        c.setAttribute('aria-hidden', 'true');
        $$('a, button, [tabindex]', c).forEach(function (f) { f.setAttribute('tabindex', '-1'); });
        track.appendChild(c);
      });
    }
    var tg = $('[data-marquee-toggle]', m);
    if (tg) {
      tg.setAttribute('aria-pressed', 'false');
      tg.addEventListener('click', function () {
        var paused = !m.hasAttribute('data-paused');
        m.toggleAttribute('data-paused', paused);
        tg.setAttribute('aria-pressed', paused ? 'true' : 'false');
        tg.setAttribute('aria-label', paused ? '출발 안내 다시 흐르게' : '출발 안내 멈추기');
      });
    }
  }

  /* ───────── 11. 표: 정렬 · 행 선택 ───────── */
  function cellValue(cell) {
    var raw = cell.getAttribute('data-sort');
    if (raw === null) raw = cell.textContent.trim();
    var num = parseFloat(String(raw).replace(/[₩,%\s]/g, ''));
    return { raw: String(raw), num: num, isNum: /^[₩\d.,%\s:-]+$/.test(String(raw)) && !isNaN(num) };
  }
  doc.addEventListener('click', function (e) {
    var btn = e.target.closest('.jb-table__sort');
    if (!btn) return;
    var th = btn.closest('th'), table = btn.closest('table');
    var tbody = table && table.tBodies[0];
    if (!th || !tbody) return;
    var col = Array.prototype.indexOf.call(th.parentNode.children, th);
    var dir = th.getAttribute('aria-sort') === 'ascending' ? 'descending' : 'ascending';
    $$('thead th[aria-sort]', table).forEach(function (o) { if (o !== th) o.setAttribute('aria-sort', 'none'); });
    th.setAttribute('aria-sort', dir);
    var rows = $$(':scope > tr', tbody);
    rows.sort(function (a, b) {
      var x = cellValue(a.children[col]), y = cellValue(b.children[col]);
      var r = (x.isNum && y.isNum) ? x.num - y.num : x.raw.localeCompare(y.raw, 'ko');
      return dir === 'ascending' ? r : -r;
    });
    rows.forEach(function (r) { tbody.appendChild(r); });
  });
  function initTableSelect(table) {
    if (table._jbInit) return; table._jbInit = true;
    var all = $('thead input[type="checkbox"]', table);
    var out = byId(table.getAttribute('data-count-target'));
    function boxes() { return $$('tbody input[type="checkbox"]', table); }
    function sync() {
      var b = boxes(), n = b.filter(function (x) { return x.checked; }).length;
      b.forEach(function (x) { var tr = x.closest('tr'); if (tr) tr.setAttribute('aria-selected', x.checked ? 'true' : 'false'); });
      if (all) { all.checked = n === b.length && n > 0; all.indeterminate = n > 0 && n < b.length; }
      if (out) out.textContent = n + '편 선택';
    }
    table.addEventListener('change', function (e) {
      if (e.target === all) boxes().forEach(function (x) { x.checked = all.checked; });
      sync();
    });
    sync();
  }

  /* ───────── 12. 가로 스크롤 힌트 ───────── */
  function syncScrollHint(el) {
    var max = el.scrollWidth - el.clientWidth;
    var state = max <= 2 ? '' : el.scrollLeft <= 2 ? 'start' : el.scrollLeft >= max - 2 ? 'end' : 'middle';
    if (state) el.setAttribute('data-scroll', state); else el.removeAttribute('data-scroll');
  }
  function initScrollHint(el) {
    if (el._jbHint) return; el._jbHint = true;
    el.addEventListener('scroll', function () { syncScrollHint(el); }, { passive: true });
    if (window.ResizeObserver) new ResizeObserver(function () { syncScrollHint(el); }).observe(el);
    syncScrollHint(el);
  }

  /* ───────── 13. 달력 ───────── */
  var WD = ['일', '월', '화', '수', '목', '금', '토'];
  function ymd(d) { return d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate()); }
  function parseYM(s) { var p = (s || '').split('-'); return new Date(+p[0], (+p[1] || 1) - 1, 1); }
  function dayLabel(d) { return (d.getMonth() + 1) + '월 ' + d.getDate() + '일 (' + WD[d.getDay()] + ')'; }
  function initCalendar(cal) {
    if (cal._jbInit) return; cal._jbInit = true;
    var out = $('[data-cal-output]', cal);
    var list = function (attr) { return (cal.getAttribute(attr) || '').split(',').map(function (s) { return s.trim(); }).filter(Boolean); };
    var month = cal.getAttribute('data-month') ? parseYM(cal.getAttribute('data-month')) : null;
    var min = cal.getAttribute('data-min') ? parseYM(cal.getAttribute('data-min')) : null;
    var max = cal.getAttribute('data-max') ? parseYM(cal.getAttribute('data-max')) : null;
    var selected = cal.getAttribute('data-selected') || '';
    function render() {
      var tbody = $('tbody', cal), title = $('.jb-cal__title', cal);
      if (!tbody) return;
      var y = month.getFullYear(), m = month.getMonth();
      if (title) title.textContent = y + '년 ' + (m + 1) + '월';
      var sale = list('data-sale'), off = list('data-off'), today = cal.getAttribute('data-today') || '';
      var first = new Date(y, m, 1).getDay(), days = new Date(y, m + 1, 0).getDate();
      var html = '', cell = 0;
      html += '<tr>';
      for (var i = 0; i < first; i++) { html += '<td></td>'; cell++; }
      for (var d = 1; d <= days; d++) {
        var date = new Date(y, m, d), key = ymd(date);
        var cls = 'jb-cal__day', dis = off.indexOf(key) >= 0;
        if (sale.indexOf(key) >= 0) cls += ' jb-cal__day--sale';
        if (key === today) cls += ' jb-cal__day--today';
        if (dis) cls += ' jb-cal__day--off';
        var label = dayLabel(date) + (sale.indexOf(key) >= 0 ? ', 특가' : '') + (dis ? ', 운항 없음' : '') + (key === today ? ', 오늘' : '');
        html += '<td><button type="button" class="' + cls + '" data-date="' + key + '" data-label="' + dayLabel(date) + '" aria-label="' + label + '" aria-pressed="' + (key === selected ? 'true' : 'false') + '"' + (dis ? ' disabled' : '') + ' tabindex="-1">' + d + '</button></td>';
        cell++;
        if (cell % 7 === 0 && d < days) html += '</tr><tr>';
      }
      while (cell % 7 !== 0) { html += '<td></td>'; cell++; }
      html += '</tr>';
      tbody.innerHTML = html;
      var prev = $('[data-cal-prev]', cal), next = $('[data-cal-next]', cal);
      if (prev) prev.disabled = !!min && month <= min;
      if (next) next.disabled = !!max && month >= max;
      rovingInit();
    }
    function days() { return $$('.jb-cal__day', cal); }
    function rovingInit() {
      var all = days().filter(function (b) { return !b.disabled; });
      var cur = all.filter(function (b) { return b.getAttribute('aria-pressed') === 'true'; })[0] || all[0];
      days().forEach(function (b) { b.tabIndex = b === cur ? 0 : -1; });
    }
    function pick(btn) {
      days().forEach(function (b) { b.setAttribute('aria-pressed', b === btn ? 'true' : 'false'); b.tabIndex = b === btn ? 0 : -1; });
      selected = btn.getAttribute('data-date') || '';
      if (out) out.textContent = btn.getAttribute('data-label') || btn.getAttribute('aria-label') || btn.textContent.trim();
      cal.dispatchEvent(new CustomEvent('jb:date', { bubbles: true, detail: { date: selected } }));
    }
    cal.addEventListener('click', function (e) {
      var b = e.target.closest('.jb-cal__day');
      if (b && !b.disabled) { pick(b); return; }
      if (month && e.target.closest('[data-cal-prev]')) { month = new Date(month.getFullYear(), month.getMonth() - 1, 1); render(); }
      if (month && e.target.closest('[data-cal-next]')) { month = new Date(month.getFullYear(), month.getMonth() + 1, 1); render(); }
    });
    cal.addEventListener('keydown', function (e) {
      var b = e.target.closest('.jb-cal__day');
      if (!b) return;
      var all = days(), i = all.indexOf(b), step = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }[e.key];
      if (!step) return;
      e.preventDefault();
      var j = i + step;
      while (all[j] && all[j].disabled) j += step > 0 ? 1 : -1;
      if (all[j]) { all.forEach(function (x) { x.tabIndex = -1; }); all[j].tabIndex = 0; all[j].focus(); }
    });
    if (month) render(); else rovingInit();
  }

  /* ───────── 14. 칸반 ───────── */
  function josa(word, a, b) {
    var c = (word || '').trim().slice(-1).charCodeAt(0);
    if (c < 0xac00 || c > 0xd7a3) return a;
    return (c - 0xac00) % 28 ? a : b;
  }
  function initKanban(board) {
    if (board._jbInit) return; board._jbInit = true;
    var live = $('.jb-kanban__live', board);
    if (!live) {
      live = doc.createElement('p');
      live.className = 'jb-kanban__live';
      live.setAttribute('aria-live', 'assertive');
      board.appendChild(live);
    }
    var lists = $$('.jb-kanban__list', board);
    function colName(list) { var col = list.closest('.jb-kanban__col'); var t = col && $('.jb-kanban__title', col); return t ? t.textContent.trim() : ''; }
    function cardTitle(card) { var t = $('.jb-kanban__card-title', card); return t ? t.textContent.trim() : '카드'; }
    /* 열 숫자는 마크업에 적힌 '전체 장수'(화면에 다 안 보이는 카드 포함)가 기준이다.
       초기 렌더에서는 건드리지 않고, 옮긴 뒤에만 전체 + (지금 카드 수 − 처음 카드 수)로 고친다. */
    lists.forEach(function (l) {
      var col = l.closest('.jb-kanban__col');
      var c = col && $('.jb-kanban__count, [data-count]', col);
      var total = c ? parseInt(c.getAttribute('data-total') || c.textContent, 10) : NaN;
      l._jbBase = $$('.jb-kanban__card', l).length;
      l._jbTotal = isNaN(total) ? l._jbBase : total;
    });
    function updateCounts() {
      lists.forEach(function (l) {
        var col = l.closest('.jb-kanban__col');
        var n = l._jbTotal + ($$('.jb-kanban__card', l).length - l._jbBase);
        $$('.jb-kanban__count, [data-count]', col).forEach(function (c) {
          c.textContent = String(n);
          if (c.hasAttribute('aria-label')) c.setAttribute('aria-label', '전체 ' + n + '장');
        });
      });
    }
    function say(card, list) {
      var t = cardTitle(card);
      live.textContent = t + josa(t, '을', '를') + ' ' + colName(list) + ' 열 ' + ($$('.jb-kanban__card', list).indexOf(card) + 1) + '번째에 놓았어요.';
    }
    $$('.jb-kanban__card', board).forEach(function (card) {
      if (card.getAttribute('aria-disabled') === 'true') return;
      card.setAttribute('draggable', 'true');
      if (!card.hasAttribute('tabindex')) card.tabIndex = 0;
      card.setAttribute('aria-roledescription', '옮길 수 있는 카드');
    });
    var dragging = null;
    board.addEventListener('dragstart', function (e) {
      var card = e.target.closest('.jb-kanban__card');
      if (!card) return;
      dragging = card;
      card.classList.add('is-dragging');
      try { e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', cardTitle(card)); } catch (err) { /* noop */ }
    });
    board.addEventListener('dragend', function () {
      if (dragging) dragging.classList.remove('is-dragging');
      lists.forEach(function (l) { l.removeAttribute('data-drop-active'); });
      dragging = null;
    });
    lists.forEach(function (list) {
      list.addEventListener('dragover', function (e) {
        if (!dragging) return;
        e.preventDefault();
        lists.forEach(function (l) { if (l !== list) l.removeAttribute('data-drop-active'); });
        list.setAttribute('data-drop-active', '');
        var after = $$('.jb-kanban__card:not(.is-dragging)', list).filter(function (c) {
          var r = c.getBoundingClientRect(); return e.clientY < r.top + r.height / 2;
        })[0];
        var add = $('.jb-kanban__add', list);
        list.insertBefore(dragging, after || add || null);
      });
      list.addEventListener('drop', function (e) {
        if (!dragging) return;
        e.preventDefault();
        list.removeAttribute('data-drop-active');
        updateCounts();
        say(dragging, list);
      });
    });
    var origin = null;
    board.addEventListener('keydown', function (e) {
      var card = e.target.closest('.jb-kanban__card');
      if (!card || card.getAttribute('aria-disabled') === 'true') return;
      var list = card.parentNode;
      var grabbed = card.classList.contains('is-grabbed');
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        if (!grabbed) {
          card.classList.add('is-grabbed');
          card.setAttribute('aria-grabbed', 'true');
          origin = { list: list, next: card.nextElementSibling };
          var t = cardTitle(card);
          live.textContent = t + josa(t, '을', '를') + ' 집었어요. 화살표로 옮기고 스페이스로 놓으세요. Esc는 취소.';
        } else {
          card.classList.remove('is-grabbed');
          card.removeAttribute('aria-grabbed');
          origin = null;
          updateCounts();
          say(card, list);
        }
        return;
      }
      if (!grabbed) return;
      if (e.key === 'Escape') {
        e.preventDefault();
        if (origin) origin.list.insertBefore(card, origin.next);
        card.classList.remove('is-grabbed');
        card.removeAttribute('aria-grabbed');
        origin = null;
        updateCounts();
        live.textContent = '옮기기를 취소했어요.';
        card.focus();
        return;
      }
      var li = lists.indexOf(list);
      var add = $('.jb-kanban__add', list);
      if (e.key === 'ArrowUp' && card.previousElementSibling) { e.preventDefault(); list.insertBefore(card, card.previousElementSibling); }
      else if (e.key === 'ArrowDown' && card.nextElementSibling && card.nextElementSibling !== add) { e.preventDefault(); list.insertBefore(card.nextElementSibling, card); }
      else if ((e.key === 'ArrowLeft' && li > 0) || (e.key === 'ArrowRight' && li < lists.length - 1)) {
        e.preventDefault();
        var to = lists[li + (e.key === 'ArrowLeft' ? -1 : 1)];
        to.insertBefore(card, $('.jb-kanban__add', to) || null);
        card.closest('.jb-kanban__col').scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: reduced() ? 'auto' : 'smooth' });
        live.textContent = colName(to) + ' 열로 옮기는 중';
      } else return;
      updateCounts();
      card.focus();
    });
  }

  /* ───────── 15. 폼 검증 · 스위치 ───────── */
  function errorBox(input) {
    var ids = (input.getAttribute('aria-describedby') || '').split(/\s+/);
    for (var i = 0; i < ids.length; i++) { var el = byId(ids[i]); if (el && el.classList.contains('jb-error')) return el; }
    var field = input.closest('.jb-field, .jb-fieldset');
    return field ? $('.jb-error', field) : null;
  }
  function fieldMessage(input) {
    var v = input.validity;
    if (v.valueMissing) return input.getAttribute('data-error-required') || (input.type === 'checkbox' || input.type === 'radio' ? '하나를 골라 주세요.' : '빈칸을 채워 주세요.');
    if (v.typeMismatch && input.type === 'email') return '메일 주소 모양이 아니에요. 예: seorin@jebiair.kr';
    if (v.patternMismatch) return input.getAttribute('data-error-pattern') || '형식이 맞지 않아요.';
    if (v.tooShort) return input.minLength + '자 이상 적어 주세요.';
    return input.validationMessage;
  }
  function setFieldError(input, bad) {
    var group = input.type === 'radio' ? $$('input[type="radio"][name="' + input.name + '"]', input.form || doc) : [input];
    group.forEach(function (x) { if (bad) x.setAttribute('aria-invalid', 'true'); else x.removeAttribute('aria-invalid'); });
    var box = errorBox(input);
    if (box) {
      var ic = '<svg class="jb-icon" viewBox="0 0 24 24" aria-hidden="true">' + ICONS.danger + '</svg>';
      box.innerHTML = bad ? ic + '<span></span>' : '';
      if (bad) box.lastChild.textContent = fieldMessage(input);
    }
  }
  doc.addEventListener('submit', function (e) {
    var form = e.target.closest('form[data-validate]');
    if (!form) return;
    e.preventDefault();
    var fields = $$('input, select, textarea', form).filter(function (x) { return x.willValidate; });
    var firstBad = null, seen = {};
    fields.forEach(function (x) {
      if (x.type === 'radio') { if (seen[x.name]) return; seen[x.name] = 1; }
      var bad = !x.checkValidity();
      setFieldError(x, bad);
      if (bad && !firstBad) firstBad = x;
    });
    if (firstBad) { firstBad.focus(); return; }
    form.dispatchEvent(new CustomEvent('jb:submit', { bubbles: true }));
    if (form.hasAttribute('data-toast-title')) toast(toastFromEl(form));
  });
  doc.addEventListener('input', function (e) {
    var x = e.target;
    if (x.getAttribute && x.getAttribute('aria-invalid') === 'true' && x.checkValidity && x.checkValidity()) setFieldError(x, false);
  });
  doc.addEventListener('change', function (e) {
    var x = e.target;
    if (x.getAttribute && x.getAttribute('aria-invalid') === 'true' && x.checkValidity && x.checkValidity()) setFieldError(x, false);
    if (x.classList && x.classList.contains('jb-switch__input')) syncSwitch(x);
    if (x.hasAttribute && x.hasAttribute('data-reduce-motion-toggle')) root.classList.toggle('jb-reduce-motion', x.checked);
    if (x.hasAttribute && x.hasAttribute('data-bind-target')) {
      var t = byId(x.getAttribute('data-bind-target'));
      if (t && (x.type !== 'radio' || x.checked)) t.setAttribute(x.getAttribute('data-bind-attr') || 'data-value', x.value);
    }
  });
  function syncSwitch(i) {
    var label = i.closest('.jb-switch');
    var state = label && $('.jb-switch__state', label);
    if (state) state.textContent = i.checked ? (state.getAttribute('data-on') || '켜짐') : (state.getAttribute('data-off') || '꺼짐');
  }

  /* ───────── 16. 단계 진행 (가입·예약 흐름) ─────────
     [data-stepper] 안 [data-step] 패널들, [data-step-next] / [data-step-prev], 연결된 .jb-steps는 data-steps-for="stepper id" */
  function initStepper(box) {
    if (box._jbInit) return; box._jbInit = true;
    var panels = $$('[data-step]', box);
    var steps = box.id ? $('.jb-steps[data-steps-for="' + box.id + '"]') : null;
    var cur = Math.max(0, panels.findIndex(function (p) { return !p.hidden; }));
    function show(i, focus) {
      cur = Math.max(0, Math.min(i, panels.length - 1));
      panels.forEach(function (p, k) { p.hidden = k !== cur; });
      if (steps) $$('.jb-steps__item', steps).forEach(function (it, k) {
        it.classList.toggle('jb-steps__item--done', k < cur);
        if (k === cur) it.setAttribute('aria-current', 'step'); else it.removeAttribute('aria-current');
      });
      box.setAttribute('data-current-step', String(cur + 1));
      if (focus) {
        var h = $('h1, h2, h3, [data-step-focus]', panels[cur]);
        if (h) { if (!h.hasAttribute('tabindex')) h.setAttribute('tabindex', '-1'); h.focus(); }
      }
      box.dispatchEvent(new CustomEvent('jb:step', { bubbles: true, detail: { step: cur + 1 } }));
    }
    box.addEventListener('click', function (e) {
      if (e.target.closest('[data-step-next]')) {
        var bad = $$('input, select, textarea', panels[cur]).filter(function (x) { return x.willValidate && !x.checkValidity(); });
        bad.forEach(function (x) { setFieldError(x, true); });
        if (bad.length) { bad[0].focus(); return; }
        e.preventDefault();
        show(cur + 1, true);
      } else if (e.target.closest('[data-step-prev]')) {
        e.preventDefault();
        show(cur - 1, true);
      }
    });
    show(cur, false);
  }

  /* ───────── 17. 코드 복사 ───────── */
  doc.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-copy]');
    if (!btn) return;
    var src = byId(btn.getAttribute('data-copy')) || (btn.closest('.jb-code') && $('code', btn.closest('.jb-code')));
    if (!src) return;
    var text = src.innerText.replace(/ /g, ' ');
    function done() {
      var label = $('[data-copy-label]', btn) || btn;
      var prevText = label.textContent;
      btn.setAttribute('data-copied', '');
      label.textContent = '복사했어요';
      window.setTimeout(function () { btn.removeAttribute('data-copied'); label.textContent = prevText; }, 1600);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, done);
    else {
      var ta = doc.createElement('textarea'); ta.value = text; ta.setAttribute('readonly', ''); ta.className = 'jb-sr-only';
      doc.body.appendChild(ta); ta.select();
      try { doc.execCommand('copy'); } catch (err) { /* noop */ }
      ta.remove(); done();
    }
  });

  /* ───────── 18. 진행 막대 ───────── */
  function syncProgress(bar) {
    var now = parseFloat(bar.getAttribute('aria-valuenow'));
    var min = parseFloat(bar.getAttribute('aria-valuemin') || '0');
    var max = parseFloat(bar.getAttribute('aria-valuemax') || '100');
    if (isNaN(now)) return;
    var pct = Math.max(0, Math.min(100, (now - min) / (max - min) * 100));
    if (bar.classList.contains('jb-progress__bar')) bar.style.setProperty('--val', pct + '%');
    else bar.style.setProperty('--done', String(Math.round(pct * 10) / 10));
  }
  function setProgress(bar, value) {
    bar.setAttribute('aria-valuenow', String(value));
    syncProgress(bar);
  }

  /* ───────── 19. 모션 · 이륙 진입 ───────── */
  function play(target) {
    if (!target) return;
    var cls = target.classList.contains('jb-cheatline') ? 'is-drawn' : 'is-playing';
    target.classList.remove(cls);
    reflow(target);
    target.classList.add(cls);
  }
  doc.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-motion-play]');
    if (!btn) return;
    btn.getAttribute('data-motion-play').split(/\s+/).forEach(function (id) { play(byId(id)); });
  });
  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      var el = en.target;
      if (el.hasAttribute('data-reveal')) el.classList.add('is-in');
      if (el.classList.contains('jb-cheatline')) el.classList.add('is-drawn');
      if (el.classList.contains('jb-flyin')) el.classList.add('is-playing');
      io.unobserve(el);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 }) : null;
  function initReveal(scope) {
    $$('[data-reveal-group]', scope).forEach(function (g) {
      var kids = $$(':scope > *', g);
      var step = kids.length >= 10 ? 0.75 : 1;
      kids.forEach(function (k, i) {
        if (!k.hasAttribute('data-reveal')) k.setAttribute('data-reveal', '');
        k.style.setProperty('--i', String(Math.round(i * step * 100) / 100));
      });
    });
    $$('[data-reveal], .jb-cheatline[data-draw], .jb-flyin', scope).forEach(function (el) {
      if (io && !reduced()) io.observe(el);
      else {
        if (el.hasAttribute('data-reveal')) el.classList.add('is-in');
        if (el.classList.contains('jb-cheatline')) el.classList.add('is-drawn');
      }
    });
  }

  /* ───────── 20. 버튼 로딩 · 경고 닫기 · 화면 전환 ───────── */
  doc.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-busy-demo]');
    if (btn && btn.getAttribute('aria-busy') !== 'true') {
      var ms = parseInt(btn.getAttribute('data-busy-demo'), 10) || 1600;
      btn.setAttribute('aria-busy', 'true');
      window.setTimeout(function () {
        btn.removeAttribute('aria-busy');
        if (btn.hasAttribute('data-toast')) toast(toastFromEl(btn));
      }, ms);
    }
    var dis = e.target.closest('[data-dismiss]');
    if (dis) {
      var host = dis.closest('.jb-alert, [data-dismissible]');
      if (host) {
        host.classList.add('is-leaving');
        window.setTimeout(function () { host.hidden = true; }, reduced() ? 0 : 200);
      }
    }
    // 화면 전환: [data-view-set="detail"][data-view-for="container id"] → container[data-view]
    var vs = e.target.closest('[data-view-set]');
    if (vs) {
      var box = byId(vs.getAttribute('data-view-for'));
      if (box) {
        box.setAttribute('data-view', vs.getAttribute('data-view-set'));
        var f = byId(vs.getAttribute('data-view-focus'));
        if (f) { if (!f.hasAttribute('tabindex')) f.setAttribute('tabindex', '-1'); f.focus({ preventScroll: false }); }
      }
    }
  });

  /* ───────── 초기화 ───────── */
  function init(scope) {
    scope = scope || doc;
    $$('[data-tabs]', scope).forEach(initTabs);
    $$('[data-accordion]', scope).forEach(initAccordion);
    $$('.jb-command', scope).forEach(initCommand);
    $$('[data-carousel]', scope).forEach(initCarousel);
    $$('.jb-marquee', scope).forEach(initMarquee);
    $$('table[data-table-select]', scope).forEach(initTableSelect);
    $$('.jb-scroll-x, .jb-table-wrap, .jb-tabs__list, .jb-kanban', scope).forEach(initScrollHint);
    $$('[data-calendar]', scope).forEach(initCalendar);
    $$('[data-kanban]', scope).forEach(initKanban);
    $$('[data-stepper]', scope).forEach(initStepper);
    $$('[role="progressbar"]', scope).forEach(syncProgress);
    $$('.jb-switch__input', scope).forEach(syncSwitch);
    $$('[data-popover-trigger], [data-menu-trigger]', scope).forEach(function (t) {
      t.setAttribute('aria-expanded', 'false');
      if (t.hasAttribute('data-menu-trigger')) t.setAttribute('aria-haspopup', 'menu');
    });
    $$('.jb-modal:not(.jb-modal--static), .jb-drawer:not(.jb-drawer--static), .jb-command:not(.jb-command--static)', scope).forEach(function (el) {
      if (!el.classList.contains('is-open')) el.hidden = true;
    });
    $$('.jb-tip.is-open', scope).forEach(fitTip);
    initReveal(scope);
  }

  applyTheme(resolveTheme());
  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', function () { init(); });
  else init();

  window.JB = {
    toast: toast,
    open: openLayer,
    close: closeLayer,
    applyTheme: applyTheme,
    setProgress: setProgress,
    play: play,
    init: init
  };
})();
