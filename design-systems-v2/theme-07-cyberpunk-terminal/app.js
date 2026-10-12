/* SEWOON.SH · app.js — 바닐라 JS. 외부 라이브러리 없음.
   전환은 보간하지 않는다: 0ms 반전, steps() 다시 그리기, 글자 단위 타이핑, 줄 단위 출력.
   공개 API: window.sewoon = { toast, open, close, setTheme, setMeter, setStep, replay } */
(function () {
  'use strict';

  var doc = document;
  var root = doc.documentElement;
  var THEME_KEY = 'sewoon-theme';
  var mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var mqDark = window.matchMedia('(prefers-color-scheme: dark)');
  function reduced() { return mqReduce.matches; }

  function $(sel, scope) { return (scope || doc).querySelector(sel); }
  function $$(sel, scope) { return Array.prototype.slice.call((scope || doc).querySelectorAll(sel)); }
  function on(el, type, fn, opts) { if (el) el.addEventListener(type, fn, opts); }
  function store(get, key, val) {
    try { if (get) return localStorage.getItem(key); localStorage.setItem(key, val); } catch (e) { return null; }
    return null;
  }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function isTyping(el) {
    if (!el) return false;
    var tag = el.tagName;
    return el.isContentEditable || tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT';
  }
  function visible(el) {
    if (!el || el.closest('[hidden]')) return false;
    var r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0 && r.bottom > 0 && r.top < window.innerHeight;
  }
  var FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
  function focusables(scope) {
    return $$(FOCUSABLE, scope).filter(function (el) { return !el.closest('[hidden]') && el.getClientRects().length; });
  }
  function replayAnim(el, cls) {
    if (!el || reduced()) return;
    el.classList.remove(cls);
    void el.offsetWidth;
    el.classList.add(cls);
    on(el, 'animationend', function done(e) {
      if (e.target !== el) return;
      el.classList.remove(cls);
      el.removeEventListener('animationend', done);
    });
  }

  /* ───────────────────────── 테마 ───────────────────────── */
  function queryTheme() {
    var q = new URLSearchParams(location.search).get('theme');
    return q === 'dark' || q === 'light' ? q : null;
  }
  function currentTheme() { return root.getAttribute('data-theme') === 'light' ? 'light' : 'dark'; }
  function syncThemeUI() {
    var t = currentTheme();
    $$('[data-theme-toggle]').forEach(function (b) {
      b.setAttribute('aria-label', t === 'dark' ? '라이트 모드로 전환 (지금 밤 화면)' : '다크 모드로 전환 (지금 낮 화면)');
      var label = $('[data-theme-label]', b);
      if (label) label.textContent = t === 'dark' ? '밤' : '낮';
    });
  }
  function setTheme(t, persist) {
    root.setAttribute('data-theme', t);
    if (persist) store(false, THEME_KEY, t);
    syncThemeUI();
  }
  (function initTheme() {
    var t = queryTheme() || store(true, THEME_KEY);
    if (t !== 'dark' && t !== 'light') t = mqDark.matches ? 'dark' : 'light';
    setTheme(t, false);
    on(mqDark, 'change', function (e) {
      if (queryTheme() || store(true, THEME_KEY)) return;
      setTheme(e.matches ? 'dark' : 'light', false);
    });
  })();

  /* ───────────────────────── 오버레이 (modal · drawer · command) ───────────────────────── */
  var stack = [];
  function topLayer() { return stack[stack.length - 1]; }
  function lockScroll() {
    root.classList.toggle('is-locked', stack.some(function (s) { return s.lock; }));
  }
  function openOverlay(el, trigger) {
    if (typeof el === 'string') el = doc.getElementById(el);
    if (!el || stack.some(function (s) { return s.el === el; })) return;
    el.hidden = false;
    el.classList.remove('is-open');
    void el.offsetWidth;
    el.classList.add('is-open');
    stack.push({ el: el, trigger: trigger || doc.activeElement, lock: true, kind: 'overlay' });
    lockScroll();
    if (trigger && trigger.setAttribute) trigger.setAttribute('aria-expanded', 'true');
    var target = $('[data-autofocus]', el) || $('[autofocus]', el) || focusables(el)[0];
    if (target) target.focus({ preventScroll: true });
    el.dispatchEvent(new CustomEvent('overlay:open', { bubbles: true }));
  }
  function closeOverlay(el, restore) {
    if (typeof el === 'string') el = doc.getElementById(el);
    var idx = -1;
    stack.forEach(function (s, i) { if (s.el === el) idx = i; });
    if (idx < 0) return;
    var item = stack.splice(idx, 1)[0];
    if (item.kind === 'overlay') {
      el.hidden = true;
      el.classList.remove('is-open');
    } else {
      el.hidden = true;
    }
    if (item.trigger && item.trigger.setAttribute && item.trigger.hasAttribute('aria-expanded')) item.trigger.setAttribute('aria-expanded', 'false');
    lockScroll();
    if (restore !== false && item.trigger && item.trigger.focus && doc.contains(item.trigger)) item.trigger.focus({ preventScroll: true });
    el.dispatchEvent(new CustomEvent('overlay:close', { bubbles: true }));
  }
  function trapTab(e) {
    var top = topLayer();
    if (!top || top.kind !== 'overlay' || e.key !== 'Tab') return;
    var list = focusables(top.el);
    if (!list.length) { e.preventDefault(); return; }
    var first = list[0], last = list[list.length - 1];
    if (e.shiftKey && doc.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && doc.activeElement === last) { e.preventDefault(); first.focus(); }
    else if (!top.el.contains(doc.activeElement)) { e.preventDefault(); first.focus(); }
  }

  /* 떠 있는 것(popover · menu): 트리거 아래에 붙인다 */
  function place(el, trigger, gap) {
    var r = trigger.getBoundingClientRect();
    el.setAttribute('data-floating', '');
    el.style.left = '0px';
    el.style.top = '0px';
    var w = el.offsetWidth, h = el.offsetHeight;
    var vw = doc.documentElement.clientWidth, vh = window.innerHeight;
    var left = Math.min(Math.max(8, r.left), vw - w - 8);
    var top = r.bottom + gap;
    var above = false;
    if (top + h > vh - 8 && r.top - gap - h > 8) { top = r.top - gap - h; above = true; }
    el.classList.toggle('is-above', above);
    el.style.left = Math.round(left) + 'px';
    el.style.top = Math.round(top) + 'px';
    el.style.setProperty('--notch-x', Math.round(Math.min(Math.max(r.left + r.width / 2 - left, 12), w - 12)) + 'px');
  }
  function openFloat(el, trigger, kind) {
    stack.filter(function (s) { return s.kind !== 'overlay'; }).forEach(function (s) { closeFloat(s.el, false); });
    el.hidden = false;
    place(el, trigger, kind === 'menu' ? 2 : 18);
    replayAnim(el, 'redraw');
    stack.push({ el: el, trigger: trigger, lock: false, kind: kind });
    trigger.setAttribute('aria-expanded', 'true');
  }
  function closeFloat(el, restore) {
    var idx = -1;
    stack.forEach(function (s, i) { if (s.el === el) idx = i; });
    if (idx < 0) return;
    var item = stack.splice(idx, 1)[0];
    el.hidden = true;
    item.trigger.setAttribute('aria-expanded', 'false');
    if (restore !== false) item.trigger.focus({ preventScroll: true });
  }
  function closeTop() {
    var top = topLayer();
    if (!top) return false;
    if (top.kind === 'overlay') closeOverlay(top.el);
    else closeFloat(top.el);
    return true;
  }
  on(window, 'resize', function () {
    stack.forEach(function (s) { if (s.kind !== 'overlay') place(s.el, s.trigger, s.kind === 'menu' ? 2 : 18); });
  });
  on(window, 'scroll', function () {
    stack.forEach(function (s) { if (s.kind !== 'overlay') place(s.el, s.trigger, s.kind === 'menu' ? 2 : 18); });
  }, { passive: true });

  /* ───────────────────────── 메뉴 (ncurses) ───────────────────────── */
  function menuItems(menu) {
    return $$('.menu__item', menu).filter(function (i) { return i.getAttribute('aria-disabled') !== 'true' && !i.disabled; });
  }
  function openMenu(menu, trigger, last) {
    openFloat(menu, trigger, 'menu');
    var items = menuItems(menu);
    if (items.length) (last ? items[items.length - 1] : items[0]).focus();
  }
  function activateMenuItem(item) {
    var role = item.getAttribute('role');
    if (role === 'menuitemcheckbox') item.setAttribute('aria-checked', item.getAttribute('aria-checked') === 'true' ? 'false' : 'true');
    if (role === 'menuitemradio') {
      $$('[role="menuitemradio"]', item.closest('.menu')).forEach(function (r) { r.setAttribute('aria-checked', r === item ? 'true' : 'false'); });
    }
    var menu = item.closest('.menu');
    if (item.tagName !== 'A') closeFloat(menu);
  }
  function menuKey(e, menu) {
    var items = menuItems(menu);
    var i = items.indexOf(doc.activeElement);
    var k = e.key;
    if (k === 'ArrowDown') { e.preventDefault(); items[(i + 1) % items.length].focus(); }
    else if (k === 'ArrowUp') { e.preventDefault(); items[(i - 1 + items.length) % items.length].focus(); }
    else if (k === 'Home') { e.preventDefault(); items[0].focus(); }
    else if (k === 'End') { e.preventDefault(); items[items.length - 1].focus(); }
    else if (k === 'Tab') { closeFloat(menu, false); }
    else if (k.length === 1 && !e.metaKey && !e.ctrlKey && !e.altKey) {
      var hit = items.filter(function (it) { return (it.getAttribute('data-key') || '').toLowerCase() === k.toLowerCase(); })[0];
      if (hit) { e.preventDefault(); hit.focus(); hit.click(); }
    }
  }

  /* ───────────────────────── 툴팁 (--help 한 줄) ───────────────────────── */
  var tipEl = null, tipTimer = 0, tipFor = null;
  function showTip(t) {
    clearTimeout(tipTimer);
    tipTimer = setTimeout(function () {
      if (!tipEl) {
        tipEl = doc.createElement('div');
        tipEl.className = 'tip';
        tipEl.id = 'sewoon-tip';
        tipEl.setAttribute('role', 'tooltip');
        doc.body.appendChild(tipEl);
      }
      tipEl.textContent = t.getAttribute('data-tip');
      tipEl.hidden = false;
      var r = t.getBoundingClientRect();
      var vw = doc.documentElement.clientWidth;
      tipEl.style.left = '0px';
      var w = tipEl.offsetWidth, h = tipEl.offsetHeight;
      var left = Math.min(Math.max(8, r.left), vw - w - 8);
      var top = r.bottom + 6, above = false;
      if (top + h > window.innerHeight - 8) { top = r.top - 6 - h; above = true; }
      tipEl.classList.toggle('is-above', above);
      tipEl.style.left = Math.round(left) + 'px';
      tipEl.style.top = Math.round(top) + 'px';
      tipEl.style.setProperty('--tip-x', Math.round(Math.min(Math.max(r.left + Math.min(r.width / 2, 16) - left, 6), w - 6)) + 'px');
      t.setAttribute('aria-describedby', 'sewoon-tip');
      tipFor = t;
    }, 400);
  }
  function hideTip() {
    clearTimeout(tipTimer);
    if (tipEl) tipEl.hidden = true;
    if (tipFor) { tipFor.removeAttribute('aria-describedby'); tipFor = null; }
  }

  /* ───────────────────────── 탭 (tmux 창 목록) ───────────────────────── */
  function selectTab(tab, focus) {
    var list = tab.closest('[role="tablist"]');
    $$('[role="tab"]', list).forEach(function (t) {
      var sel = t === tab;
      t.setAttribute('aria-selected', sel ? 'true' : 'false');
      t.tabIndex = sel ? 0 : -1;
      var p = doc.getElementById(t.getAttribute('aria-controls'));
      if (p) p.hidden = !sel;
    });
    if (focus) tab.focus();
    var panel = doc.getElementById(tab.getAttribute('aria-controls'));
    if (panel) replayAnim(panel, 'redraw');
    list.dispatchEvent(new CustomEvent('tabs:change', { bubbles: true, detail: { tab: tab } }));
  }
  function initTabs(scope) {
    $$('[role="tablist"]', scope).forEach(function (list) {
      var tabs = $$('[role="tab"]', list);
      var cur = tabs.filter(function (t) { return t.getAttribute('aria-selected') === 'true'; })[0] || tabs[0];
      tabs.forEach(function (t) {
        t.tabIndex = t === cur ? 0 : -1;
        var p = doc.getElementById(t.getAttribute('aria-controls'));
        if (p) p.hidden = t !== cur;
      });
    });
  }
  function rovingKey(e, items, current, vertical) {
    var i = items.indexOf(current);
    if (i < 0) return null;
    var next = null;
    var fwd = vertical ? 'ArrowDown' : 'ArrowRight';
    var back = vertical ? 'ArrowUp' : 'ArrowLeft';
    if (e.key === fwd) next = items[(i + 1) % items.length];
    else if (e.key === back) next = items[(i - 1 + items.length) % items.length];
    else if (e.key === 'Home') next = items[0];
    else if (e.key === 'End') next = items[items.length - 1];
    if (next) e.preventDefault();
    return next;
  }

  /* ───────────────────────── 트리 (accordion) ───────────────────────── */
  function toggleTree(btn, force) {
    var open = typeof force === 'boolean' ? force : btn.getAttribute('aria-expanded') !== 'true';
    var tree = btn.closest('.tree');
    if (open && tree && tree.hasAttribute('data-single')) {
      $$('.tree__toggle[aria-expanded="true"]', tree).forEach(function (b) { if (b !== btn) toggleTree(b, false); });
    }
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    var panel = doc.getElementById(btn.getAttribute('aria-controls'));
    if (panel) {
      panel.hidden = !open;
      if (open) replayAnim(panel, 'redraw');
    }
  }
  function initTree(scope) {
    $$('.tree__toggle[aria-controls]', scope).forEach(function (b) {
      var p = doc.getElementById(b.getAttribute('aria-controls'));
      if (p) p.hidden = b.getAttribute('aria-expanded') !== 'true';
    });
  }

  /* ───────────────────────── wall 방송 (toast) ───────────────────────── */
  function toastRegion() {
    var r = $('.toasts');
    if (!r) {
      r = doc.createElement('div');
      r.className = 'toasts';
      r.setAttribute('role', 'region');
      r.setAttribute('aria-label', '방송 알림');
      doc.body.appendChild(r);
    }
    return r;
  }
  var toastSeq = 0;
  function toast(opts) {
    opts = opts || {};
    var kind = opts.kind || 'info';
    var from = opts.from || 'moon@sewoon 님의 방송 (pts/0, 03:12)';
    var msg = opts.msg || '방송이 도착했습니다.';
    var title = opts.title || (kind === 'err' ? 'stderr' : 'wall');
    var el = doc.createElement('div');
    var id = 'wall-' + (++toastSeq);
    el.className = 'pane wall wall--' + kind;
    el.id = id;
    el.setAttribute('role', kind === 'err' ? 'alert' : 'status');
    el.innerHTML =
      '<div class="pane__head"><span class="pane__title"></span>' +
      '<span class="pane__meta"><button type="button" class="pane__key wall__close" aria-label="알림 닫기"><kbd>x</kbd></button></span></div>' +
      '<p class="wall__from"></p><p class="wall__msg"></p>';
    $('.pane__title', el).textContent = title;
    $('.wall__from', el).textContent = from;
    $('.wall__msg', el).textContent = msg;
    toastRegion().appendChild(el);
    var timer = setTimeout(function () { dismissToast(el); }, opts.duration || 5000);
    on(el, 'mouseenter', function () { clearTimeout(timer); });
    on(el, 'mouseleave', function () { timer = setTimeout(function () { dismissToast(el); }, 2500); });
    on($('.wall__close', el), 'click', function () { clearTimeout(timer); dismissToast(el); });
    var region = toastRegion();
    while (region.children.length > 3) region.removeChild(region.firstElementChild);
    return el;
  }
  function dismissToast(el) {
    if (!el || !el.parentNode) return;
    el.parentNode.removeChild(el);
  }

  /* ───────────────────────── feh 캐러셀 ───────────────────────── */
  function initFeh(c) {
    var slides = $$('.feh__slide', c);
    if (!slides.length) return;
    var dots = $('.feh__dots', c);
    if (dots && !dots.children.length) {
      slides.forEach(function (s, i) {
        var b = doc.createElement('button');
        b.type = 'button';
        b.className = 'feh__dot';
        b.setAttribute('aria-label', (i + 1) + '번째 · ' + (s.getAttribute('data-name') || ''));
        dots.appendChild(b);
      });
    }
    var dotBtns = dots ? $$('.feh__dot', dots) : [];
    var idx = Math.max(0, slides.findIndex(function (s) { return !s.hidden; }));
    function go(n, focusDot) {
      idx = (n + slides.length) % slides.length;
      slides.forEach(function (s, i) {
        s.hidden = i !== idx;
        s.setAttribute('aria-label', (i + 1) + ' / ' + slides.length);
      });
      dotBtns.forEach(function (d, i) { d.setAttribute('aria-current', i === idx ? 'true' : 'false'); });
      var s = slides[idx];
      var count = $('.feh__count', c), name = $('.feh__name', c), dim = $('.feh__dim', c);
      if (count) count.textContent = '[' + (idx + 1) + '/' + slides.length + ']';
      if (name && s.getAttribute('data-name')) name.textContent = s.getAttribute('data-name');
      if (dim && s.getAttribute('data-dim')) dim.textContent = s.getAttribute('data-dim');
      replayAnim(s, 'redraw');
      if (focusDot && dotBtns[idx]) dotBtns[idx].focus();
    }
    go(idx);
    on($('[data-feh-prev]', c), 'click', function () { go(idx - 1); });
    on($('[data-feh-next]', c), 'click', function () { go(idx + 1); });
    dotBtns.forEach(function (d, i) { on(d, 'click', function () { go(i); }); });
    on(c, 'keydown', function (e) {
      if (isTyping(e.target)) return;
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(idx - 1, e.target.classList.contains('feh__dot')); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); go(idx + 1, e.target.classList.contains('feh__dot')); }
      else if (e.key === 'Home') { e.preventDefault(); go(0, true); }
      else if (e.key === 'End') { e.preventDefault(); go(slides.length - 1, true); }
    });
  }

  /* ───────────────────────── cal 달력 ───────────────────────── */
  function initCal(cal) {
    var days = $$('button.cal__day', cal).filter(function (d) { return !d.disabled; });
    if (!days.length) return;
    var cur = days.filter(function (d) { return d.getAttribute('aria-pressed') === 'true'; })[0] ||
      days.filter(function (d) { return d.getAttribute('aria-current') === 'date'; })[0] || days[0];
    days.forEach(function (d) { d.tabIndex = d === cur ? 0 : -1; if (!d.hasAttribute('aria-pressed')) d.setAttribute('aria-pressed', 'false'); });
    var out = $('.cal__out', cal);
    function select(d, focus) {
      days.forEach(function (x) { x.setAttribute('aria-pressed', x === d ? 'true' : 'false'); x.tabIndex = x === d ? 0 : -1; });
      if (focus) d.focus();
      if (out) out.textContent = d.getAttribute('data-note') || d.getAttribute('aria-label') || d.textContent.trim();
      cal.dispatchEvent(new CustomEvent('cal:select', { bubbles: true, detail: { date: d.getAttribute('data-date') } }));
    }
    days.forEach(function (d) { on(d, 'click', function () { select(d); }); });
    on(cal, 'keydown', function (e) {
      var i = days.indexOf(doc.activeElement);
      if (i < 0) return;
      var map = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 };
      var delta = map[e.key];
      if (e.key === 'Home') delta = -i;
      if (e.key === 'End') delta = days.length - 1 - i;
      if (delta === undefined) return;
      e.preventDefault();
      var n = Math.min(Math.max(i + delta, 0), days.length - 1);
      days.forEach(function (x) { x.tabIndex = -1; });
      days[n].tabIndex = 0;
      days[n].focus();
    });
  }

  /* ───────────────────────── 표 정렬 ───────────────────────── */
  function sortTable(btn) {
    var th = btn.closest('th');
    var table = th.closest('table');
    var tbody = table.tBodies[0];
    var col = Array.prototype.indexOf.call(th.parentNode.children, th);
    var dir = th.getAttribute('aria-sort') === 'ascending' ? 'descending' : 'ascending';
    $$('th[aria-sort]', table).forEach(function (h) { h.setAttribute('aria-sort', 'none'); });
    th.setAttribute('aria-sort', dir);
    var numeric = th.classList.contains('num') || th.getAttribute('data-sort-type') === 'num';
    var rows = Array.prototype.slice.call(tbody.rows);
    function val(r) {
      var cell = r.cells[col];
      var v = cell ? (cell.getAttribute('data-sort') || cell.textContent.trim()) : '';
      if (numeric) { var n = parseFloat(String(v).replace(/[^\d.\-]/g, '')); return isNaN(n) ? -Infinity : n; }
      return v;
    }
    rows.sort(function (a, b) {
      var x = val(a), y = val(b);
      var c = numeric ? x - y : String(x).localeCompare(String(y), 'ko');
      return dir === 'ascending' ? c : -c;
    });
    rows.forEach(function (r) { tbody.appendChild(r); });
    var live = table.parentNode.querySelector('[data-sort-live]');
    if (live) live.textContent = th.textContent.replace(/[▲▼]/g, '').trim() + ' 기준 ' + (dir === 'ascending' ? '오름차순' : '내림차순') + ' 정렬';
  }

  /* ───────────────────────── less 페이지 ───────────────────────── */
  function initLess(less) {
    var total = parseInt(less.getAttribute('data-total'), 10) || $$('.less__page', less).length;
    var cur = parseInt(less.getAttribute('data-current'), 10) || 1;
    var target = less.getAttribute('data-less-target') ? doc.getElementById(less.getAttribute('data-less-target')) : null;
    function go(n) {
      cur = Math.min(Math.max(n, 1), total);
      less.setAttribute('data-current', cur);
      $$('.less__page', less).forEach(function (p) {
        var pn = parseInt(p.getAttribute('data-page'), 10);
        if (pn === cur) p.setAttribute('aria-current', 'page'); else p.removeAttribute('aria-current');
      });
      var st = $('.less__status', less);
      if (st) st.textContent = cur === total ? '(끝) (' + cur + '/' + total + ')' : '-- 더 보기 -- (' + cur + '/' + total + ')';
      $$('.less__step', less).forEach(function (b) {
        var d = parseInt(b.getAttribute('data-dir'), 10);
        b.disabled = (d < 0 && cur === 1) || (d > 0 && cur === total);
      });
      if (target) {
        $$('[data-page]', target).forEach(function (p) { p.hidden = parseInt(p.getAttribute('data-page'), 10) !== cur; });
        replayAnim(target, 'redraw');
      }
      less.dispatchEvent(new CustomEvent('less:change', { bubbles: true, detail: { page: cur } }));
    }
    $$('.less__page', less).forEach(function (p) { on(p, 'click', function () { go(parseInt(p.getAttribute('data-page'), 10)); }); });
    $$('.less__step', less).forEach(function (b) { on(b, 'click', function () { go(cur + parseInt(b.getAttribute('data-dir'), 10)); }); });
    go(cur);
  }

  /* ───────────────────────── 칸반 (드래그 + 키보드) ───────────────────────── */
  function initBoard(board) {
    var live = $('.board__live', board) || (function () {
      var l = doc.createElement('p');
      l.className = 'board__live sr-only';
      l.setAttribute('aria-live', 'polite');
      board.appendChild(l);
      return l;
    })();
    function cols() { return $$('.board__col', board); }
    function colName(col) { return col.getAttribute('data-name') || ''; }
    function updateCounts() {
      cols().forEach(function (c) {
        var n = $$('.board__card', c).length;
        $$('[data-count]', c).forEach(function (el) { el.textContent = n; });
      });
    }
    function announce(card) {
      var col = card.closest('.board__col');
      var list = card.parentNode;
      var pos = $$('.board__card', list).indexOf(card) + 1;
      var id = ($('.board__id', card) || card).textContent.trim();
      live.textContent = id + ' → ' + colName(col) + ' ' + pos + '번째';
    }
    /* 키보드: Space/Enter 집기 → ←→ 열 이동, ↑↓ 순서 → Space/Enter 놓기, Esc 취소 */
    var held = null, origin = null;
    on(board, 'keydown', function (e) {
      var card = e.target.closest && e.target.closest('.board__card');
      if (!card) return;
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        if (held === card) {
          card.setAttribute('aria-grabbed', 'false');
          held = null;
          announce(card);
          updateCounts();
        } else {
          if (held) held.setAttribute('aria-grabbed', 'false');
          held = card;
          origin = { list: card.parentNode, next: card.nextElementSibling };
          card.setAttribute('aria-grabbed', 'true');
          live.textContent = ($('.board__id', card) || card).textContent.trim() + ' 집음. 화살표로 옮기고 스페이스로 놓기, Esc 취소';
        }
        return;
      }
      if (held !== card) {
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
          var all = $$('.board__card', card.parentNode);
          var nx = rovingKey(e, all, card, true);
          if (nx) nx.focus();
        }
        return;
      }
      var list = card.parentNode;
      var cs = cols();
      var ci = cs.indexOf(card.closest('.board__col'));
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        origin.list.insertBefore(card, origin.next && origin.next.parentNode === origin.list ? origin.next : null);
        card.setAttribute('aria-grabbed', 'false');
        held = null;
        card.focus();
        live.textContent = '이동 취소';
        updateCounts();
        return;
      }
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        e.preventDefault();
        var tc = cs[ci + (e.key === 'ArrowRight' ? 1 : -1)];
        if (!tc) return;
        $('.board__list', tc).appendChild(card);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        var prev = card.previousElementSibling;
        if (prev) list.insertBefore(card, prev);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        var next = card.nextElementSibling;
        if (next) list.insertBefore(next, card);
      } else return;
      card.focus();
      announce(card);
      updateCounts();
    });
    /* 포인터 드래그 (마우스 즉시, 터치는 0.3초 누르고 있으면) */
    var drag = null;
    function ghostAt(x, y) {
      var el = doc.elementFromPoint(x, y);
      var list = el && el.closest && el.closest('.board__list');
      if (!list || !board.contains(list)) return;
      $$('.board__list', board).forEach(function (l) { l.classList.toggle('is-over', l === list); });
      var cards = $$('.board__card', list).filter(function (c) { return c !== drag.card; });
      var before = null;
      for (var i = 0; i < cards.length; i++) {
        var r = cards[i].getBoundingClientRect();
        if (y < r.top + r.height / 2) { before = cards[i]; break; }
      }
      list.insertBefore(drag.ghost, before);
    }
    function startDrag() {
      var c = drag.card, r = c.getBoundingClientRect();
      drag.ghost = doc.createElement('div');
      drag.ghost.className = 'board__ghost';
      drag.ghost.style.height = r.height + 'px';
      c.parentNode.insertBefore(drag.ghost, c);
      drag.dx = drag.x0 - r.left;
      drag.dy = drag.y0 - r.top;
      c.classList.add('is-dragging');
      c.style.position = 'fixed';
      c.style.width = r.width + 'px';
      c.style.left = r.left + 'px';
      c.style.top = r.top + 'px';
      c.style.pointerEvents = 'none';
      drag.active = true;
    }
    function endDrag(commit) {
      if (!drag) return;
      clearTimeout(drag.timer);
      var c = drag.card;
      if (drag.active) {
        c.classList.remove('is-dragging');
        c.style.position = c.style.width = c.style.left = c.style.top = c.style.pointerEvents = '';
        if (commit && drag.ghost.parentNode) drag.ghost.parentNode.insertBefore(c, drag.ghost);
        if (drag.ghost.parentNode) drag.ghost.parentNode.removeChild(drag.ghost);
        $$('.board__list', board).forEach(function (l) { l.classList.remove('is-over'); });
        if (commit) { announce(c); updateCounts(); }
      }
      drag = null;
    }
    on(board, 'pointerdown', function (e) {
      var card = e.target.closest('.board__card');
      if (!card || e.button !== 0 || e.target.closest('a, button:not(.board__card), input')) return;
      drag = { card: card, x0: e.clientX, y0: e.clientY, active: false, touch: e.pointerType === 'touch' };
      if (drag.touch) drag.timer = setTimeout(function () { if (drag && !drag.active) startDrag(); }, 300);
    });
    on(doc, 'pointermove', function (e) {
      if (!drag) return;
      if (!drag.active) {
        if (drag.touch) { if (Math.abs(e.clientX - drag.x0) + Math.abs(e.clientY - drag.y0) > 8) { clearTimeout(drag.timer); drag = null; } return; }
        if (Math.abs(e.clientX - drag.x0) + Math.abs(e.clientY - drag.y0) < 6) return;
        startDrag();
      }
      drag.card.style.left = (e.clientX - drag.dx) + 'px';
      drag.card.style.top = (e.clientY - drag.dy) + 'px';
      ghostAt(e.clientX, e.clientY);
    });
    on(doc, 'touchmove', function (e) { if (drag && drag.active) e.preventDefault(); }, { passive: false });
    on(doc, 'pointerup', function () { endDrag(true); });
    on(doc, 'pointercancel', function () { endDrag(false); });
    on(board, 'click', function (e) { if (e.target.closest('.board__card.is-dragging')) e.preventDefault(); });
    updateCounts();
  }

  /* ───────────────────────── ls 선택 ───────────────────────── */
  /* 메일 인덱스 ↔ pager: 행 [data-mail="m1"] 을 고르면 같은 [data-mail-root] 안의 [data-mail-body="m1"] 만 보인다.
     [data-unread] 숫자, [data-pager-pos] "3/12" 를 갱신하고, 좁은 화면에서는 [data-pager] 로 스크롤한다. */
  function showMail(ls, row, rows) {
    var id = row.getAttribute('data-mail');
    if (!id) return;
    var root = ls.closest('[data-mail-root]') || doc;
    $$('[data-mail-body]', root).forEach(function (b) { b.hidden = b.getAttribute('data-mail-body') !== id; });
    row.classList.remove('is-new');
    var n = $$('.ls__row.is-new', root).length;
    $$('[data-unread]').forEach(function (el) { el.textContent = n; });
    var pos = $('[data-pager-pos]', root);
    if (pos) pos.textContent = (rows.indexOf(row) + 1) + '/' + rows.length;
    var pager = $('[data-pager]', root);
    if (pager && window.matchMedia('(max-width: 767px)').matches) pager.scrollIntoView({ block: 'start' });
  }
  function initLs(ls) {
    var rows = $$('button.ls__row', ls);
    if (!rows.length) return;
    on(ls, 'click', function (e) {
      var row = e.target.closest('button.ls__row');
      if (!row) return;
      rows.forEach(function (r) { r.setAttribute('aria-selected', r === row ? 'true' : 'false'); });
      showMail(ls, row, rows);
      ls.dispatchEvent(new CustomEvent('ls:select', { bubbles: true, detail: { row: row } }));
    });
    on(ls, 'keydown', function (e) {
      var n = rovingKey(e, rows, doc.activeElement, true);
      if (n) n.focus();
    });
  }

  /* ───────────────────────── 티커 (marquee) ───────────────────────── */
  function initTicker(t) {
    var track = $('.ticker__track', t);
    if (!track) return;
    // 항목을 한 벌 복제해 두면 -50% 지점이 처음과 같은 모습이라 이음매 없이 돈다(첫 줄이 바로 보인다)
    if (!track.__cloned) {
      track.__cloned = true;
      $$('.ticker__item', track).forEach(function (it) {
        var c = it.cloneNode(true);
        c.setAttribute('aria-hidden', 'true');
        c.classList.add('ticker__item--clone');
        track.appendChild(c);
      });
    }
    function measure() {
      var cell = parseFloat(getComputedStyle(t).fontSize) * 0.5 || 6.5;
      var dist = track.scrollWidth / 2;
      var steps = Math.max(40, Math.round(dist / cell));
      t.style.setProperty('--ticker-steps', steps);
      t.style.setProperty('--ticker-dur', Math.round(steps * 110) + 'ms');
    }
    measure();
    on(window, 'resize', measure);
    if (reduced()) t.classList.add('is-static');
    $$('[data-ticker-toggle]', t.closest('.statusbar') || t).concat($$('[data-ticker-toggle="' + t.id + '"]')).forEach(function (b) {
      if (b.__tk) return;
      b.__tk = true;
      on(b, 'click', function () {
        var p = !t.classList.contains('is-paused');
        t.classList.toggle('is-paused', p);
        b.setAttribute('aria-pressed', p ? 'true' : 'false');
      });
    });
  }

  /* ───────────────────────── 미터 (wget · htop) ───────────────────────── */
  function setMeter(m, v) {
    v = Math.min(Math.max(Number(v) || 0, 0), 100);
    m.setAttribute('data-value', v);
    var cells = parseInt(m.getAttribute('data-cells'), 10) || 20;
    var htop = m.classList.contains('meter--htop');
    var bar = $('.meter__bar', m);
    if (!bar) {
      bar = doc.createElement('span');
      bar.className = 'meter__bar';
      var after = $('.meter__pct', m) || $('.meter__label', m);
      if (after) after.insertAdjacentElement('afterend', bar); else m.insertBefore(bar, m.firstChild);
    }
    bar.setAttribute('aria-hidden', 'true');
    var filled = Math.round(cells * v / 100);
    var pct = Math.round(v) + '%';
    if (htop) {
      var label = m.getAttribute('data-label-in') || pct;
      // 채움 글자가 값 글자까지 닿지 않게: 값 길이 + 1셀 여백 + 오른쪽 1ch 만큼은 비워 둔다
      filled = Math.min(filled, Math.max(0, cells - label.length - 2));
      bar.innerHTML = '<span class="meter__fill"></span><span class="meter__rest"></span><span class="meter__val"></span>';
      $('.meter__fill', bar).textContent = new Array(filled + 1).join('|');
      $('.meter__rest', bar).textContent = new Array(cells - filled + 1).join(' ');
      $('.meter__val', bar).textContent = label;
    } else {
      var head = v >= 100 || filled === 0 ? '' : '>';
      var eq = Math.max(0, filled - head.length);
      bar.innerHTML = '<span class="meter__fill"></span><span class="meter__head"></span><span class="meter__rest"></span>';
      $('.meter__fill', bar).textContent = new Array(eq + 1).join('=');
      $('.meter__head', bar).textContent = head;
      $('.meter__rest', bar).textContent = new Array(cells - eq - head.length + 1).join(' ');
    }
    var p = $('.meter__pct', m);
    if (p) p.textContent = pct;
    m.setAttribute('role', 'progressbar');
    m.setAttribute('aria-valuemin', '0');
    m.setAttribute('aria-valuemax', '100');
    m.setAttribute('aria-valuenow', String(Math.round(v)));
    m.classList.toggle('meter--done', v >= 100 && !htop);
  }
  function runMeter(m) {
    if (m.__run) return;
    var from = 0, to = parseFloat(m.getAttribute('data-to') || 100);
    if (reduced()) { setMeter(m, to); return; }
    m.__run = true;
    m.setAttribute('aria-busy', 'true');
    var v = from;
    var t = setInterval(function () {
      v += 4 + Math.round(Math.random() * 7);
      if (v >= to) { v = to; clearInterval(t); m.__run = false; m.removeAttribute('aria-busy'); }
      setMeter(m, v);
      var ex = $('.meter__extra', m);
      if (ex && m.hasAttribute('data-eta')) {
        var left = Math.max(0, Math.round((to - v) / 6));
        ex.textContent = v >= to ? '완료 — 저장함' : '1.2MB/s  남은 00:' + pad(left);
      }
    }, 140);
  }

  /* ───────────────────────── 단계 (make) ───────────────────────── */
  function setStep(steps, index) {
    if (typeof steps === 'string') steps = doc.getElementById(steps);
    var items = $$('.steps__item', steps);
    index = Math.min(Math.max(index, 0), items.length - 1);
    items.forEach(function (it, i) {
      it.setAttribute('data-state', i < index ? 'done' : i === index ? 'current' : 'todo');
      if (i === index) it.setAttribute('aria-current', 'step'); else it.removeAttribute('aria-current');
    });
    steps.setAttribute('data-index', index);
    var pid = steps.getAttribute('data-steps-panels');
    var panels = pid ? $$('[data-step-panel]', doc.getElementById(pid)) : [];
    panels.forEach(function (p, i) { p.hidden = i !== index; if (i === index) replayAnim(p, 'redraw'); });
    $$('[data-step-nav][aria-controls="' + steps.id + '"]').forEach(function (b) {
      var d = b.getAttribute('data-step-nav');
      if (d === 'prev') b.disabled = index === 0;
      if (d === 'next') {
        var last = index === items.length - 1;
        var lab = $('.btn__label', b) || b;
        if (!b.hasAttribute('data-label-next')) b.setAttribute('data-label-next', lab.textContent);
        lab.textContent = last ? (b.getAttribute('data-label-done') || '완료') : b.getAttribute('data-label-next');
      }
    });
    steps.dispatchEvent(new CustomEvent('steps:change', { bubbles: true, detail: { index: index } }));
  }

  /* 지금 단계 패널의 [data-validate]·[required] 를 검사한다. 하나라도 틀리면 첫 칸으로 포커스하고 false */
  function stepValid(steps, index) {
    var pid = steps.getAttribute('data-steps-panels');
    var panel = pid ? $$('[data-step-panel]', doc.getElementById(pid))[index] : null;
    if (!panel) return true;
    var inputs = $$('[data-validate], [required]', panel).filter(function (x) { return !x.disabled; });
    var bad = inputs.filter(function (x) { return !validate(x); });
    if (bad.length) { bad[0].focus(); return false; }
    return true;
  }

  /* ───────────────────────── 폼 검증 ───────────────────────── */
  var RULES = {
    required: { test: function (v) { return v.trim().length > 0; }, msg: '비어 있습니다. 값을 입력하세요' },
    ssh: { test: function (v) { return /^(ssh-ed25519|ssh-rsa|ecdsa-sha2-nistp256) [A-Za-z0-9+/=]{16,}/.test(v.trim()); }, msg: '키 형식이 올바르지 않습니다 (ssh-ed25519로 시작)' },
    handle: { test: function (v) { return /^[a-z][a-z0-9_]{2,15}$/.test(v.trim()); }, msg: '핸들은 영문 소문자로 시작하는 3–16자입니다 (소문자·숫자·_)' },
    port: { test: function (v) { var n = +v; return /^\d+$/.test(v.trim()) && n >= 1024 && n <= 65535; }, msg: '포트는 1024–65535 사이 숫자입니다' },
    email: { test: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()); }, msg: '메일 주소 형식이 아닙니다' }
  };
  function validate(input) {
    var names = (input.getAttribute('data-validate') || '').split(/\s+/).filter(Boolean);
    if (input.required && names.indexOf('required') < 0) names.unshift('required');
    var field = input.closest('.field');
    var err = field ? $('.field__err', field) : null;
    var fail = null;
    if (input.type === 'checkbox' || input.type === 'radio') {
      if (input.required && !input.checked) fail = input.getAttribute('data-msg-required') || '체크해야 다음으로 갈 수 있습니다';
      names = [];
    }
    for (var i = 0; i < names.length; i++) {
      var r = RULES[names[i]];
      if (!r) continue;
      if (names[i] !== 'required' && !input.value.trim()) continue;
      if (!r.test(input.value)) { fail = input.getAttribute('data-msg-' + names[i]) || r.msg; break; }
    }
    if (fail) {
      input.setAttribute('aria-invalid', 'true');
      if (err) { err.textContent = fail; if (err.id) input.setAttribute('aria-describedby', err.id); }
      if (field) field.classList.add('field--error');
    } else {
      input.removeAttribute('aria-invalid');
      if (err) err.textContent = '';
      if (field) field.classList.remove('field--error');
    }
    return !fail;
  }

  /* ───────────────────────── 타이핑 · 줄 출력 · 글리치 ───────────────────────── */
  function typeText(el) {
    if (!el.hasAttribute('data-type-full')) el.setAttribute('data-type-full', el.textContent);
    var full = el.getAttribute('data-type-full');
    clearTimeout(el.__tt);
    if (reduced() || full.length > 40) { el.textContent = full; el.classList.remove('is-typing'); return; }
    var per = Math.min(22, 900 / Math.max(1, full.length));
    var i = 0;
    el.textContent = '';
    el.classList.add('is-typing');
    el.setAttribute('aria-label', full);
    (function tick() {
      i++;
      el.textContent = full.slice(0, i);
      if (i < full.length) el.__tt = setTimeout(tick, per + (Math.random() * per * 0.6));
      else { el.classList.remove('is-typing'); el.removeAttribute('aria-label'); el.dispatchEvent(new CustomEvent('typed', { bubbles: true })); }
    })();
  }
  function printLines(el) {
    var lines = Array.prototype.slice.call(el.children);
    clearTimeout(el.__pl);
    if (reduced()) { el.classList.remove('is-printing'); return; }
    lines.forEach(function (l) { l.classList.remove('is-out'); });
    el.classList.add('is-printing');
    var i = 0;
    (function tick() {
      if (i >= 40) { lines.slice(i).forEach(function (l) { l.classList.add('is-out'); }); i = lines.length; }
      if (i < lines.length) { lines[i].classList.add('is-out'); i++; el.__pl = setTimeout(tick, 14); }
      else el.classList.remove('is-printing');
    })();
  }
  function replay(target) {
    if (typeof target === 'string') target = doc.getElementById(target);
    if (!target) return;
    var all = [target].concat($$('*', target));
    all.forEach(function (el) {
      if (el.hasAttribute('data-type') && el.tagName !== 'TH') typeText(el);
      if (el.hasAttribute('data-lines')) printLines(el);
      if (el.hasAttribute('data-glitch')) replayAnim(el, 'glitch-once');
      if (el.hasAttribute('data-redraw')) replayAnim(el, 'redraw');
      if (el.classList.contains('meter') && el.hasAttribute('data-to')) { el.__run = false; runMeter(el); }
    });
  }
  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      var el = en.target;
      io.unobserve(el);
      var delay = parseInt(el.getAttribute('data-delay'), 10) || 0;
      setTimeout(function () {
        if (el.hasAttribute('data-type')) typeText(el);
        if (el.hasAttribute('data-lines')) printLines(el);
        if (el.hasAttribute('data-glitch')) replayAnim(el, 'glitch-once');
        if (el.classList.contains('meter') && el.hasAttribute('data-to')) runMeter(el);
      }, reduced() ? 0 : delay);
    });
  }, { threshold: 0.2 }) : null;

  /* ───────────────────────── tail -f 스트림 ───────────────────────── */
  function initStream(list) {
    var src = list.id ? $('template[data-stream-src="' + list.id + '"]') : null;
    if (!src) src = list.nextElementSibling && list.nextElementSibling.tagName === 'TEMPLATE' ? list.nextElementSibling : null;
    if (!src) return;
    var pool = Array.prototype.slice.call(src.content.children);
    if (!pool.length) return;
    var max = parseInt(list.getAttribute('data-stream-max'), 10) || 12;
    var clock = (list.getAttribute('data-stream-start') || '03:12:07').split(':').map(Number);
    var secs = clock[0] * 3600 + clock[1] * 60 + clock[2];
    var k = 0, timer = 0, userPaused = false, inView = true;
    var toggles = $$('[data-stream-toggle="' + list.id + '"]');
    var stamps = $$('[data-stream-stamp="' + list.id + '"]');
    var notes = $$('[data-stream-note="' + list.id + '"]');
    function fmt(s) { s = s % 86400; return pad(Math.floor(s / 3600)) + ':' + pad(Math.floor(s / 60) % 60) + ':' + pad(s % 60); }
    function stamp() { stamps.forEach(function (s) { s.textContent = '갱신 ' + fmt(secs); }); }
    function push() {
      secs += 1 + Math.floor(Math.random() * 3);
      var li = pool[k % pool.length].cloneNode(true);
      k++;
      var t = $('time', li);
      if (t) t.textContent = fmt(secs);
      list.appendChild(li);
      while (list.children.length > max) list.removeChild(list.firstElementChild);
      stamp();
    }
    function running() { return !userPaused && inView && !doc.hidden; }
    function sync() {
      clearInterval(timer);
      if (running()) timer = setInterval(push, 1400);
      toggles.forEach(function (b) {
        b.setAttribute('aria-pressed', userPaused ? 'true' : 'false');
        var lab = $('.btn__label', b) || $('[data-label]', b);
        if (lab) lab.textContent = userPaused ? '재개' : '일시정지';
      });
      list.setAttribute('aria-busy', running() ? 'false' : 'true');
      list.setAttribute('data-paused', userPaused ? 'true' : 'false');
    }
    if (reduced()) {
      userPaused = true;
      notes.forEach(function (n) { n.hidden = false; n.textContent = '동작 줄이기 설정으로 정지됨'; });
    }
    toggles.forEach(function (b) {
      on(b, 'click', function () {
        userPaused = !userPaused;
        notes.forEach(function (n) { n.hidden = true; });
        sync();
      });
    });
    on(doc, 'visibilitychange', sync);
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (en) { inView = en[0].isIntersecting; sync(); }).observe(list);
    }
    stamp();
    sync();
  }

  /* ───────────────────────── 가로 스크롤 페이드 힌트 ───────────────────────── */
  function syncScroll(el) {
    var over = el.scrollWidth > el.clientWidth + 1;
    el.classList.toggle('is-overflow', over);
    el.classList.toggle('is-end', !over || el.scrollLeft + el.clientWidth >= el.scrollWidth - 2);
    el.classList.toggle('is-scrolled', el.scrollLeft > 2);
  }
  function initScrollHints(scope) {
    $$('.scroll-x, .statusbar__wins, .wins__list, .board', scope).forEach(function (el) {
      syncScroll(el);
      on(el, 'scroll', function () { syncScroll(el); }, { passive: true });
      if (el.classList.contains('statusbar__wins')) revealCurrent(el);
    });
    // 한글 대체 글꼴이 늦게 오면 창 이름 폭이 바뀐다 → 글꼴이 다 온 뒤 한 번 더
    if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(function () { $$('.statusbar__wins', scope).forEach(revealCurrent); });
  }
  /* 상태 바 창 목록: 현재 창이 오른쪽 페이드(4셀) 밖, 완전히 보이는 자리로 오게 스크롤 */
  function revealCurrent(el) {
    syncScroll(el);
    var cur = $('[aria-current="page"]', el);
    if (!cur) return;
    var fade = 32;
    var left = cur.offsetLeft, right = left + cur.offsetWidth;
    if (right > el.scrollLeft + el.clientWidth - fade) el.scrollLeft = right - el.clientWidth + fade;
    else if (left < el.scrollLeft + fade) el.scrollLeft = Math.max(0, left - fade);
    syncScroll(el);
  }
  on(window, 'resize', function () { $$('.scroll-x, .statusbar__wins, .wins__list, .board').forEach(syncScroll); });

  /* ───────────────────────── 복사 ───────────────────────── */
  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text);
    return new Promise(function (res, rej) {
      var ta = doc.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      doc.body.appendChild(ta);
      ta.select();
      try { doc.execCommand('copy') ? res() : rej(); } catch (e) { rej(e); }
      doc.body.removeChild(ta);
    });
  }
  function doCopy(btn) {
    var ref = btn.getAttribute('data-copy');
    var text = btn.getAttribute('data-copy-text');
    if (!text) {
      var src = ref ? doc.getElementById(ref) : null;
      if (!src) { var box = btn.closest('.code, .pane'); src = box ? $('pre code, pre', box) : null; }
      if (src) {
        var lines = $$('.code__l', src);
        text = lines.length ? lines.map(function (l) { return l.textContent; }).join('\n') : src.textContent;
      }
    }
    var label = $('[data-copy-label]', btn) || $('.btn__label', btn);
    var orig = label ? label.textContent : '';
    copyText(text || '').then(function () {
      btn.classList.add('is-done');
      if (label) label.textContent = '복사됨';
    }, function () {
      if (label) label.textContent = '복사 실패';
    }).then(function () {
      setTimeout(function () { btn.classList.remove('is-done'); if (label) label.textContent = orig; }, 1500);
    });
  }

  /* ───────────────────────── 로딩 버튼 ───────────────────────── */
  function busy(btn) {
    if (btn.getAttribute('aria-busy') === 'true') return;
    var ms = parseInt(btn.getAttribute('data-busy'), 10) || 1200;
    btn.setAttribute('aria-busy', 'true');
    btn.removeAttribute('data-state');
    setTimeout(function () {
      btn.removeAttribute('aria-busy');
      if (btn.hasAttribute('data-busy-fail')) {
        btn.setAttribute('data-state', 'error');
        replayAnim(btn, 'glitch-once');
        toast({ kind: 'err', title: 'stderr', from: 'sewoon: ' + (btn.getAttribute('data-busy-fail') || '실행 실패'), msg: '잠시 후 다시 시도하세요. 계속되면 ops@sewoon.sh 로 알려 주세요.' });
      } else if (btn.hasAttribute('data-busy-toast')) {
        toast({ kind: 'ok', from: 'sewoon@bench03', msg: btn.getAttribute('data-busy-toast') });
      }
    }, ms);
  }

  /* ───────────────────────── 사이드바 ───────────────────────── */
  function toggleSide(btn) {
    var id = btn.getAttribute('aria-controls');
    var side = id ? doc.getElementById(id) : btn.closest('.side');
    if (!side) return;
    var col = !side.classList.contains('is-collapsed');
    side.classList.toggle('is-collapsed', col);
    btn.setAttribute('aria-expanded', col ? 'false' : 'true');
    var lab = $('[data-label]', btn);
    if (lab) lab.textContent = col ? '»' : '«';
  }

  /* ───────────────────────── fzf 커맨드 팔레트 ───────────────────────── */
  function fuzzy(text, q) {
    if (!q) return { score: 0, idx: [] };
    var t = text.toLowerCase(), qq = q.toLowerCase(), idx = [], j = 0, score = 0, last = -2;
    for (var i = 0; i < t.length && j < qq.length; i++) {
      if (t[i] === qq[j]) { idx.push(i); score += (i === last + 1) ? 3 : 1; last = i; j++; }
    }
    return j === qq.length ? { score: score, idx: idx } : null;
  }
  function initFzf(fzf) {
    var input = $('.fzf__input', fzf);
    var list = $('.fzf__list', fzf);
    if (!input || !list) return;
    var items = $$('.fzf__item', list);
    items.forEach(function (it, i) {
      var lab = $('.fzf__label', it) || it;
      if (!lab.hasAttribute('data-raw')) lab.setAttribute('data-raw', lab.textContent);
      if (!it.id) it.id = (fzf.id || 'fzf') + '-opt-' + i;
      it.setAttribute('role', 'option');
    });
    list.setAttribute('role', 'listbox');
    input.setAttribute('role', 'combobox');
    input.setAttribute('aria-expanded', 'true');
    input.setAttribute('aria-controls', list.id || (list.id = (fzf.id || 'fzf') + '-list'));
    input.setAttribute('aria-autocomplete', 'list');
    var count = $('.fzf__count', fzf);
    var empty = $('.fzf__empty', fzf);
    var shown = items.slice();
    function render() {
      var q = input.value.trim();
      shown = [];
      items.forEach(function (it) {
        var lab = $('.fzf__label', it) || it;
        var raw = lab.getAttribute('data-raw');
        var hay = raw + ' ' + (it.getAttribute('data-keywords') || '');
        var m = fuzzy(raw, q) || fuzzy(hay, q);
        it.hidden = !m;
        lab.textContent = '';
        if (!m) return;
        shown.push(it);
        var marks = m.idx.filter(function (x) { return x < raw.length; });
        var pos = 0;
        marks.forEach(function (x) {
          if (x > pos) lab.appendChild(doc.createTextNode(raw.slice(pos, x)));
          var mk = doc.createElement('mark');
          mk.textContent = raw[x];
          lab.appendChild(mk);
          pos = x + 1;
        });
        lab.appendChild(doc.createTextNode(raw.slice(pos)));
      });
      $$('.fzf__group', list).forEach(function (g) {
        var n = g.nextElementSibling, any = false;
        while (n && !n.classList.contains('fzf__group')) { if (!n.hidden) any = true; n = n.nextElementSibling; }
        g.hidden = !any;
      });
      if (count) count.textContent = shown.length + '/' + items.length;
      if (empty) empty.hidden = shown.length > 0;
      select(shown[0]);
    }
    function select(it) {
      items.forEach(function (x) { x.setAttribute('aria-selected', x === it ? 'true' : 'false'); });
      if (it) {
        input.setAttribute('aria-activedescendant', it.id);
        var top = it.offsetTop - list.offsetTop, bottom = top + it.offsetHeight;
        if (top < list.scrollTop) list.scrollTop = top;
        else if (bottom > list.scrollTop + list.clientHeight) list.scrollTop = bottom - list.clientHeight;
      }
      else input.removeAttribute('aria-activedescendant');
    }
    on(input, 'input', render);
    on(input, 'keydown', function (e) {
      var cur = shown.filter(function (x) { return x.getAttribute('aria-selected') === 'true'; })[0];
      var i = shown.indexOf(cur);
      if (e.key === 'ArrowDown' || (e.ctrlKey && e.key === 'n')) { e.preventDefault(); select(shown[Math.min(i + 1, shown.length - 1)]); }
      else if (e.key === 'ArrowUp' || (e.ctrlKey && e.key === 'p')) { e.preventDefault(); select(shown[Math.max(i - 1, 0)]); }
      else if (e.key === 'Enter' && cur) { e.preventDefault(); cur.click(); }
    });
    on(list, 'mousemove', function (e) { var it = e.target.closest('.fzf__item'); if (it && it.getAttribute('aria-selected') !== 'true') select(it); });
    on(list, 'click', function (e) {
      var it = e.target.closest('.fzf__item');
      if (!it) return;
      if (it.tagName !== 'A') {
        var ov = fzf.closest('.overlay');
        if (ov) closeOverlay(ov, false);
        if (it.hasAttribute('data-run')) runCommand(it.getAttribute('data-run'));
      }
    });
    var ov = fzf.closest('.overlay');
    if (ov) on(ov, 'overlay:open', function () { input.value = ''; render(); input.focus(); });
    render();
  }
  function runCommand(cmd) {
    if (cmd === 'theme') { setTheme(currentTheme() === 'dark' ? 'light' : 'dark', true); return; }
    if (cmd.indexOf('open:') === 0) { openOverlay(cmd.slice(5)); return; }
    if (cmd.indexOf('toast:') === 0) { toast({ msg: cmd.slice(6) }); }
  }
  function openCommand(trigger) {
    var ov = $('.overlay[data-command]');
    if (ov) openOverlay(ov, trigger);
  }

  /* ───────────────────────── 전원 켜짐 (index 첫 진입 1회) ───────────────────────── */
  function powerOn() {
    if (!root.hasAttribute('data-power-on') || reduced()) return;
    var seen = null;
    try { seen = sessionStorage.getItem('sewoon-power'); sessionStorage.setItem('sewoon-power', '1'); } catch (e) { seen = '1'; }
    if (seen) return;
    var target = $('[data-power-target]') || doc.body;
    replayAnim(target, 'is-power-on');
  }

  /* ───────────────────────── 이벤트 위임 ───────────────────────── */
  on(doc, 'click', function (e) {
    var t = e.target;
    if (!t.closest) return;
    var el;

    if ((el = t.closest('[data-theme-toggle]'))) { setTheme(currentTheme() === 'dark' ? 'light' : 'dark', true); return; }
    if ((el = t.closest('[data-command-open]'))) { e.preventDefault(); openCommand(el); return; }
    if ((el = t.closest('[data-open]'))) { e.preventDefault(); openOverlay(el.getAttribute('data-open'), el); return; }
    if ((el = t.closest('[data-close]'))) {
      var ov = el.getAttribute('data-close') ? doc.getElementById(el.getAttribute('data-close')) : el.closest('.overlay');
      if (ov) { closeOverlay(ov); if (el.hasAttribute('data-toast')) fireToast(el); return; }
    }
    if ((el = t.closest('[data-popover]'))) {
      var pop = doc.getElementById(el.getAttribute('data-popover'));
      if (pop) { if (pop.hidden) openFloat(pop, el, 'popover'); else closeFloat(pop); }
      return;
    }
    if ((el = t.closest('[data-menu]'))) {
      var menu = doc.getElementById(el.getAttribute('data-menu'));
      if (menu) { if (menu.hidden) openMenu(menu, el); else closeFloat(menu); }
      return;
    }
    if ((el = t.closest('.menu__item'))) {
      if (el.getAttribute('aria-disabled') === 'true') { e.preventDefault(); return; }
      activateMenuItem(el);
      if (el.hasAttribute('data-toast')) fireToast(el);
      return;
    }
    if ((el = t.closest('[role="tab"]'))) { selectTab(el); return; }
    if ((el = t.closest('.tree__toggle[aria-controls]'))) { toggleTree(el); return; }
    if ((el = t.closest('.tbl__sort'))) { sortTable(el); return; }
    if ((el = t.closest('[data-copy]'))) { doCopy(el); return; }
    if ((el = t.closest('[data-busy]'))) { busy(el); return; }
    if ((el = t.closest('[data-replay]'))) { replay(el.getAttribute('data-replay')); return; }
    if ((el = t.closest('[data-meter-run]'))) {
      var m = doc.getElementById(el.getAttribute('data-meter-run'));
      if (m) { m.__run = false; runMeter(m); }
      return;
    }
    if ((el = t.closest('[data-step-nav]'))) {
      var steps = doc.getElementById(el.getAttribute('aria-controls'));
      if (steps) {
        var i = parseInt(steps.getAttribute('data-index') || '0', 10);
        var dir = el.getAttribute('data-step-nav');
        var total = $$('.steps__item', steps).length;
        if (dir === 'next' && !stepValid(steps, i)) return;
        if (dir === 'next' && i === total - 1) { if (el.hasAttribute('data-toast')) fireToast(el); return; }
        setStep(steps, dir === 'next' ? i + 1 : i - 1);
      }
      return;
    }
    if ((el = t.closest('[data-step-go]'))) {
      var sg = el.closest('.steps');
      if (sg) {
        var to = $$('.steps__item', sg).indexOf(el.closest('.steps__item'));
        var from = parseInt(sg.getAttribute('data-index') || '0', 10);
        if (to > from && !stepValid(sg, from)) return;
        setStep(sg, to);
      }
      return;
    }
    if ((el = t.closest('[data-side-toggle]'))) { toggleSide(el); return; }
    if ((el = t.closest('[data-dismiss]'))) {
      var d = el.getAttribute('data-dismiss') ? doc.getElementById(el.getAttribute('data-dismiss')) : el.closest('.alert, .wall');
      if (d) d.parentNode.removeChild(d);
      return;
    }
    if ((el = t.closest('[data-glitch-now]'))) {
      replayAnim(doc.getElementById(el.getAttribute('data-glitch-now')), 'glitch-once');
      return;
    }
    if ((el = t.closest('[data-toast]:not(form)'))) { fireToast(el); return; }
  });
  function fireToast(el) {
    toast({
      kind: el.getAttribute('data-toast-kind') || 'info',
      title: el.getAttribute('data-toast-title') || undefined,
      from: el.getAttribute('data-toast-from') || undefined,
      msg: el.getAttribute('data-toast') || undefined
    });
  }

  /* 바깥 클릭 → 떠 있는 것 닫기 */
  on(doc, 'pointerdown', function (e) {
    stack.filter(function (s) { return s.kind !== 'overlay'; }).forEach(function (s) {
      if (!s.el.contains(e.target) && !s.trigger.contains(e.target)) closeFloat(s.el, false);
    });
  });

  /* 폼: 흐림/제출 검증 */
  on(doc, 'focusout', function (e) {
    var t = e.target;
    if (t.matches && t.matches('[data-validate], [required]') && t.closest('form, .form')) {
      if (t.value || t.getAttribute('aria-invalid') === 'true') validate(t);
    }
    if (t.matches && t.matches('[data-tip]')) hideTip();
  });
  on(doc, 'input', function (e) {
    var t = e.target;
    if (t.getAttribute && t.getAttribute('aria-invalid') === 'true') validate(t);
    if (t.hasAttribute && t.hasAttribute('maxlength')) {
      var f = t.closest('.field'), c = f && $('.field__count', f);
      if (c) c.textContent = t.value.length + '/' + t.getAttribute('maxlength');
    }
  });
  on(doc, 'submit', function (e) {
    var form = e.target;
    var inputs = $$('[data-validate], [required]', form);
    if (!inputs.length && !form.hasAttribute('data-toast')) return;
    e.preventDefault();
    var ok = inputs.map(validate).every(Boolean);
    if (!ok) {
      var bad = $('[aria-invalid="true"]', form);
      if (bad) bad.focus();
      var sb = $('[type="submit"]', form);
      if (sb) { sb.setAttribute('data-state', 'error'); replayAnim(sb, 'glitch-once'); setTimeout(function () { sb.removeAttribute('data-state'); }, 2400); }
      return;
    }
    var btn = $('[type="submit"]', form);
    if (btn) {
      btn.setAttribute('aria-busy', 'true');
      setTimeout(function () {
        btn.removeAttribute('aria-busy');
        toast({ kind: 'ok', from: form.getAttribute('data-toast-from') || 'sewoon@bench03', msg: form.getAttribute('data-toast') || '저장했습니다.' });
      }, reduced() ? 0 : 900);
    }
  });

  /* 툴팁 */
  on(doc, 'pointerover', function (e) { var t = e.target.closest && e.target.closest('[data-tip]'); if (t) showTip(t); });
  on(doc, 'pointerout', function (e) { var t = e.target.closest && e.target.closest('[data-tip]'); if (t && !t.contains(e.relatedTarget)) hideTip(); });
  on(doc, 'focusin', function (e) { var t = e.target.closest && e.target.closest('[data-tip]'); if (t && t.matches(':focus-visible')) showTip(t); });

  /* 키보드 */
  on(doc, 'keydown', function (e) {
    var k = e.key;
    if ((e.metaKey || e.ctrlKey) && (k === 'k' || k === 'K')) { e.preventDefault(); openCommand(doc.activeElement); return; }
    if (k === 'Escape') {
      if (tipEl && !tipEl.hidden) { hideTip(); return; }
      if (closeTop()) { e.preventDefault(); return; }
    }
    if (k === 'Tab') { trapTab(e); return; }

    var menu = e.target.closest && e.target.closest('.menu');
    if (menu && !menu.hidden) { menuKey(e, menu); return; }

    var mt = e.target.closest && e.target.closest('[data-menu]');
    if (mt && (k === 'ArrowDown' || k === 'ArrowUp')) {
      var mm = doc.getElementById(mt.getAttribute('data-menu'));
      if (mm) { e.preventDefault(); openMenu(mm, mt, k === 'ArrowUp'); }
      return;
    }

    var tab = e.target.closest && e.target.closest('[role="tab"]');
    if (tab) {
      var tabs = $$('[role="tab"]', tab.closest('[role="tablist"]')).filter(function (x) { return !x.disabled; });
      var nt = rovingKey(e, tabs, tab, false);
      if (nt) selectTab(nt, true);
      return;
    }

    var tg = e.target.closest && e.target.closest('.tree__toggle');
    if (tg && (k === 'ArrowDown' || k === 'ArrowUp' || k === 'Home' || k === 'End')) {
      var toggles = $$('.tree__toggle', tg.closest('.tree')).filter(function (x) { return !x.disabled; });
      var ng = rovingKey(e, toggles, tg, true);
      if (ng) ng.focus();
      return;
    }

    if (isTyping(e.target) || e.metaKey || e.ctrlKey || e.altKey) return;
    if (k === '/' && !topLayer()) {
      if ($('.overlay[data-command]')) { e.preventDefault(); openCommand(doc.activeElement); }
      return;
    }
    /* 테두리 키 힌트: [data-hotkey="p"] — 화면에 보이는 첫 번째만 */
    if (k.length === 1) {
      var top = topLayer();
      var scope = top && top.kind === 'overlay' ? top.el : doc;
      var hit = $$('[data-hotkey]', scope).filter(function (h) {
        return h.getAttribute('data-hotkey') === k && !h.disabled && visible(h) && (scope !== doc || !h.closest('.overlay'));
      })[0];
      if (hit) { e.preventDefault(); hit.click(); }
    }
  });

  /* ───────────────────────── 초기화 ───────────────────────── */
  function init(scope) {
    scope = scope || doc;
    syncThemeUI();
    initTabs(scope);
    initTree(scope);
    $$('.feh', scope).forEach(initFeh);
    $$('.cal', scope).forEach(initCal);
    $$('.less[data-less]', scope).forEach(initLess);
    $$('.board', scope).forEach(initBoard);
    $$('.ls[data-select]', scope).forEach(initLs);
    $$('.ticker', scope).forEach(initTicker);
    $$('.meter', scope).forEach(function (m) { setMeter(m, m.getAttribute('data-value') || 0); });
    $$('.steps[data-steps]', scope).forEach(function (s) { setStep(s, parseInt(s.getAttribute('data-index') || '0', 10)); });
    $$('.fzf', scope).forEach(initFzf);
    $$('[data-stream]', scope).forEach(initStream);
    $$('[data-menu], [data-popover]', scope).forEach(function (t) {
      t.setAttribute('aria-expanded', 'false');
      t.setAttribute('aria-haspopup', t.hasAttribute('data-menu') ? 'menu' : 'dialog');
      var target = doc.getElementById(t.getAttribute('data-menu') || t.getAttribute('data-popover'));
      if (target) { target.hidden = true; t.setAttribute('aria-controls', target.id); }
    });
    $$('.menu__item', scope).forEach(function (i) { if (!i.hasAttribute('tabindex')) i.tabIndex = -1; });
    $$('.overlay', scope).forEach(function (o) { if (!o.classList.contains('is-open')) o.hidden = true; });
    // data-type 은 타이핑 효과 전용. 표 머리(th)에는 붙지 않는다(정렬 형식은 data-sort-type)
    $$('[data-type]:not(th), [data-lines], [data-glitch], .meter[data-to]', scope).forEach(function (el) {
      if (el.hasAttribute('data-lines') && !reduced()) {
        el.classList.add('is-printing');
      }
      if (el.hasAttribute('data-type') && !reduced()) {
        el.setAttribute('data-type-full', el.textContent);
        el.setAttribute('aria-label', el.textContent);
        el.textContent = '';
      }
      if (io) io.observe(el); else replay(el);
    });
    $$('[maxlength]', scope).forEach(function (t) {
      var f = t.closest('.field'), c = f && $('.field__count', f);
      if (c) c.textContent = t.value.length + '/' + t.getAttribute('maxlength');
    });
    initScrollHints(scope);
    powerOn();
  }
  if (doc.readyState === 'loading') on(doc, 'DOMContentLoaded', function () { init(); });
  else init();

  window.sewoon = {
    toast: toast,
    open: openOverlay,
    close: closeOverlay,
    setTheme: function (t) { setTheme(t, true); },
    setMeter: setMeter,
    setStep: setStep,
    replay: replay,
    init: init
  };
})();
