/* ==========================================================================
   여명일보 · app.js — 바닐라 인터랙션 (외부 라이브러리 없음)
   theme · icons · 망점 defs · overlay(modal/drawer/cmd) · tabs · accordion · menu · popover
   tooltip · toast(전보) · carousel · ticker · kanban · table sort · calendar · busy · copy
   rule-in · motion demo · sidebar toggle · dismiss · form validate · wizard · bind · countdown
   ========================================================================== */
(function () {
  'use strict';

  var doc = document;
  var root = doc.documentElement;
  var THEME_KEY = 'ym-theme';
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  root.classList.remove('no-js');
  root.classList.add('js');

  function $(sel, ctx) { return (ctx || doc).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || doc).querySelectorAll(sel)); }
  function on(el, ev, fn, opt) { if (el) el.addEventListener(ev, fn, opt); }
  function store(get, val) {
    try {
      if (get) return localStorage.getItem(THEME_KEY);
      localStorage.setItem(THEME_KEY, val);
    } catch (e) { return null; }
    return null;
  }

  /* ------------------------------------------------------------------
     1. 테마 — URL ?theme= 최우선 → localStorage → prefers-color-scheme
     ------------------------------------------------------------------ */
  var queryTheme = (function () {
    try {
      var q = new URLSearchParams(location.search).get('theme');
      return q === 'dark' || q === 'light' ? q : null;
    } catch (e) { return null; }
  })();
  var mq = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;

  function resolveTheme() {
    if (queryTheme) return queryTheme;
    var s = store(true);
    if (s === 'dark' || s === 'light') return s;
    return mq && mq.matches ? 'dark' : 'light';
  }
  function syncToggles(t) {
    $$('[data-theme-toggle]').forEach(function (b) {
      b.setAttribute('aria-pressed', t === 'dark' ? 'true' : 'false');
      b.setAttribute('aria-label', t === 'dark' ? '주간판(라이트 모드)으로 전환' : '야간판(다크 모드)으로 전환');
      b.setAttribute('title', t === 'dark' ? '지금 야간판 — 누르면 주간판' : '지금 주간판 — 누르면 야간판');
    });
  }
  function setTheme(t, persist) {
    root.setAttribute('data-theme', t);
    if (persist) store(false, t);
    syncToggles(t);
  }
  setTheme(resolveTheme(), false);
  doc.addEventListener('click', function (e) {
    var b = e.target.closest('[data-theme-toggle]');
    if (!b) return;
    var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    setTheme(next, true);
  });
  if (mq) {
    var mqHandler = function (e) {
      if (queryTheme || store(true)) return;
      setTheme(e.matches ? 'dark' : 'light', false);
    };
    if (mq.addEventListener) mq.addEventListener('change', mqHandler);
    else if (mq.addListener) mq.addListener(mqHandler);
  }

  /* ------------------------------------------------------------------
     2. 아이콘 — [data-icon="name"] → 1.5px 선 SVG (currentColor)
     ------------------------------------------------------------------ */
  var ICONS = {
    search: '<circle cx="10.5" cy="10.5" r="6"/><path d="M15 15l5 5"/>',
    close: '<path d="M6 6l12 12M18 6L6 18"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1"/>',
    moon: '<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/>',
    'chevron-left': '<path d="M15 5l-7 7 7 7"/>',
    'chevron-right': '<path d="M9 5l7 7-7 7"/>',
    'chevron-down': '<path d="M5 9l7 7 7-7"/>',
    'chevron-up': '<path d="M5 15l7-7 7 7"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    minus: '<path d="M5 12h14"/>',
    check: '<path d="M4 12.5l5 5L20 6.5"/>',
    pause: '<path d="M8 5v14M16 5v14"/>',
    play: '<path d="M7 5l12 7-12 7z"/>',
    menu: '<path d="M3 6h18M3 12h18M3 18h18"/>',
    more: '<path d="M5 12h.01M12 12h.01M19 12h.01" stroke-width="3"/>',
    'arrow-right': '<path d="M4 12h15M13 6l6 6-6 6"/>',
    'arrow-left': '<path d="M20 12H5M11 6l-6 6 6 6"/>',
    copy: '<rect x="8" y="8" width="12" height="12"/><path d="M16 8V4H4v12h4"/>',
    edit: '<path d="M4 20h4L19 9l-4-4L4 16z"/>',
    trash: '<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>',
    print: '<path d="M7 9V3h10v6M7 17H4V9h16v8h-3M7 14h10v7H7z"/>',
    bell: '<path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4zM10 20h4"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1-4 4-6 8-6s7 2 8 6"/>',
    lock: '<rect x="5" y="11" width="14" height="10"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
    download: '<path d="M12 4v11M7 10l5 5 5-5M4 20h16"/>',
    refresh: '<path d="M20 11a8 8 0 1 0-2.3 5.7M20 4v7h-7"/>',
    calendar: '<rect x="3" y="5" width="18" height="16"/><path d="M3 10h18M8 3v4M16 3v4"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    pin: '<path d="M12 21s-7-6.5-7-12a7 7 0 0 1 14 0c0 5.5-7 12-7 12z"/><circle cx="12" cy="9" r="2.5"/>',
    send: '<path d="M4 12l16-8-6 16-2.5-6.5z"/>',
    filter: '<path d="M4 5h16l-6 7v6l-4 2v-8z"/>',
    external: '<path d="M14 4h6v6M20 4l-9 9M18 14v6H4V6h6"/>',
    grid: '<rect x="4" y="4" width="7" height="7"/><rect x="13" y="4" width="7" height="7"/><rect x="4" y="13" width="7" height="7"/><rect x="13" y="13" width="7" height="7"/>',
    paper: '<path d="M5 3h11l3 3v15H5z"/><path d="M8 8h8M8 12h8M8 16h5"/>'
  };
  function paintIcons(ctx) {
    $$('[data-icon]', ctx).forEach(function (el) {
      if (el.firstElementChild && el.firstElementChild.tagName.toLowerCase() === 'svg') return;
      var body = ICONS[el.getAttribute('data-icon')];
      if (!body) return;
      el.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="square" stroke-linejoin="miter" aria-hidden="true" focusable="false">' + body + '</svg>';
      el.setAttribute('aria-hidden', 'true');
      el.style.display = 'inline-flex';
    });
  }
  paintIcons();

  /* ------------------------------------------------------------------
     3. 망점 SVG 패턴 defs — #ht10~#ht80 #ht-hi #ht-fine #ht-hatch (없으면 주입)
     ------------------------------------------------------------------ */
  (function injectDots() {
    if (doc.getElementById('ht40')) return;
    /* 반지름은 CSS r 속성(--ph-r-*)으로 모드별 명암 매핑 — 야간판은 반전하지 않고 어두운 곳을 성기게 */
    var radii = { ht10: 0.9, ht20: 1.26, ht30: 1.55, ht40: 1.78, ht60: 2.18, ht80: 2.52, 'ht-hi': 0 };
    var under = '<rect width="5" height="5" style="fill:var(--ph-under)"/>';
    var pats = Object.keys(radii).map(function (id) {
      var key = id.replace('ht-', '').replace('ht', '');
      return '<pattern id="' + id + '" width="5" height="5" patternUnits="userSpaceOnUse">' + under + '<circle cx="2.5" cy="2.5" r="' + radii[id] + '" style="fill:var(--ph-ink);r:var(--ph-r-' + key + ')"/></pattern>';
    }).join('');
    pats += '<pattern id="ht-fine" width="3" height="3" patternUnits="userSpaceOnUse"><rect width="3" height="3" style="fill:var(--ph-under)"/><circle cx="1.5" cy="1.5" r="1.05" style="fill:var(--ph-ink);r:var(--ph-r-fine)"/></pattern>';
    pats += '<pattern id="ht-hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="6" height="6" style="fill:var(--ph-under)"/><rect width="1" height="6" style="fill:var(--ph-ink)"/></pattern>';
    var wrap = doc.createElement('div');
    wrap.innerHTML = '<svg class="ht-defs" aria-hidden="true" focusable="false" width="0" height="0"><defs>' + pats + '</defs></svg>';
    doc.body.insertBefore(wrap.firstChild, doc.body.firstChild);
  })();

  /* ------------------------------------------------------------------
     4. 알림 영역 (스크린리더)
     ------------------------------------------------------------------ */
  var live = doc.createElement('div');
  live.className = 'sr-only';
  live.setAttribute('aria-live', 'polite');
  live.id = 'ym-live';
  doc.body.appendChild(live);
  function announce(msg) { live.textContent = ''; setTimeout(function () { live.textContent = msg; }, 30); }

  /* ------------------------------------------------------------------
     5. 전보 토스트
     ------------------------------------------------------------------ */
  var wire = null;
  function wireRegion() {
    if (wire && doc.body.contains(wire)) return wire;
    wire = $('.wire:not(.wire--static)');
    if (!wire) {
      wire = doc.createElement('div');
      wire.className = 'wire';
      wire.setAttribute('role', 'region');
      wire.setAttribute('aria-label', '전보 알림');
      wire.setAttribute('aria-live', 'polite');
      doc.body.appendChild(wire);
    }
    return wire;
  }
  function closeToast(item) {
    if (!item || item.classList.contains('is-out')) return;
    clearTimeout(item._t);
    if (reduceMotion) { item.remove(); return; }
    item.classList.remove('is-in');
    item.classList.add('is-out');
    var done = function () { item.remove(); };
    item.addEventListener('animationend', done, { once: true });
    setTimeout(done, 400);
  }
  function toast(opts) {
    if (typeof opts === 'string') opts = { text: opts };
    var region = wireRegion();
    var item = doc.createElement('div');
    item.className = 'wire__item is-in' + (opts.tone ? ' wire__item--' + opts.tone : '');
    var tag = doc.createElement('span');
    tag.className = 'wire__tag';
    tag.textContent = opts.tag || '알림';
    var text = doc.createElement('p');
    text.className = 'wire__text';
    text.textContent = opts.text || '';
    if (opts.meta) {
      var m = doc.createElement('span');
      m.className = 'mono';
      m.textContent = opts.meta;
      text.appendChild(m);
    }
    var end = doc.createElement('div');
    end.className = 'wire__end';
    if (opts.action && opts.action.href) {
      var a = doc.createElement('a');
      a.className = 'wire__action';
      a.href = opts.action.href;
      a.textContent = opts.action.label || '보기';
      end.appendChild(a);
    }
    var x = doc.createElement('button');
    x.type = 'button';
    x.className = 'wire__close';
    x.setAttribute('aria-label', '전보 닫기');
    x.innerHTML = '<span data-icon="close"></span>';
    end.appendChild(x);
    item.appendChild(tag);
    item.appendChild(text);
    item.appendChild(end);
    region.appendChild(item);
    paintIcons(item);
    on(x, 'click', function () { closeToast(item); });
    var ms = opts.timeout == null ? 5000 : opts.timeout;
    var arm = function () { if (ms > 0) item._t = setTimeout(function () { closeToast(item); }, ms); };
    on(item, 'mouseenter', function () { clearTimeout(item._t); });
    on(item, 'mouseleave', arm);
    on(item, 'focusin', function () { clearTimeout(item._t); });
    arm();
    while (region.children.length > 3) closeToast(region.firstElementChild);
    return item;
  }
  function toastFrom(el) {
    var text = el.getAttribute('data-toast');
    if (text == null) return;
    toast({
      text: text,
      tag: el.getAttribute('data-toast-tag') || '알림',
      tone: el.getAttribute('data-toast-tone') || '',
      meta: el.getAttribute('data-toast-meta') || ''
    });
  }
  doc.addEventListener('click', function (e) {
    var t = e.target.closest('[data-toast]');
    if (!t || t.hasAttribute('data-busy') || t.closest('form[data-validate]') && t.type === 'submit') return;
    if (t.closest('.menu__list')) return; // 메뉴 항목은 메뉴 핸들러가 처리
    toastFrom(t);
  });
  // 정적 견본 닫기
  doc.addEventListener('click', function (e) {
    var x = e.target.closest('.wire--static .wire__close');
    if (x) { var it = x.closest('.wire__item'); if (it) it.remove(); }
  });

  /* ------------------------------------------------------------------
     6. 오버레이 (호외 판 modal · 지면 보기 drawer · 기사 검색 cmd)
     ------------------------------------------------------------------ */
  var stack = [];
  var FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

  function visibleFocusables(ctx) {
    return $$(FOCUSABLE, ctx).filter(function (el) {
      return el.offsetParent !== null || el === doc.activeElement;
    });
  }
  function openOverlay(el, opener) {
    if (!el || !el.hidden) return;
    el.hidden = false;
    el._opener = opener || doc.activeElement;
    stack.push(el);
    root.classList.add('is-locked');
    var target = $('[data-autofocus]', el) || $('.cmd__input', el) || visibleFocusables($('.modal__sheet, .drawer__panel, .cmd__panel', el) || el)[0];
    if (target) setTimeout(function () { target.focus(); }, 10);
    el.dispatchEvent(new CustomEvent('overlay:open', { bubbles: true }));
  }
  function closeOverlay(el) {
    el = el || stack[stack.length - 1];
    if (!el || el.hidden) return;
    el.hidden = true;
    stack = stack.filter(function (s) { return s !== el; });
    if (!stack.length) root.classList.remove('is-locked');
    var o = el._opener;
    if (o && typeof o.focus === 'function' && doc.contains(o)) o.focus();
    el.dispatchEvent(new CustomEvent('overlay:close', { bubbles: true }));
  }
  doc.addEventListener('click', function (e) {
    var opener = e.target.closest('[data-open]');
    if (opener) {
      e.preventDefault();
      openOverlay(doc.getElementById(opener.getAttribute('data-open')), opener);
      return;
    }
    var closer = e.target.closest('[data-close]');
    if (closer) {
      var ov = closer.closest('.modal, .drawer, .cmd');
      if (ov && !ov.classList.contains('modal--static') && !ov.classList.contains('drawer--static') && !ov.classList.contains('cmd--static')) {
        e.preventDefault();
        closeOverlay(ov);
      }
    }
  });
  function trapTab(e) {
    var top = stack[stack.length - 1];
    if (!top) return false;
    var panel = $('.modal__sheet, .drawer__panel, .cmd__panel', top) || top;
    var f = visibleFocusables(panel);
    if (!f.length) { e.preventDefault(); return true; }
    var first = f[0], last = f[f.length - 1];
    if (!panel.contains(doc.activeElement)) { e.preventDefault(); first.focus(); return true; }
    if (e.shiftKey && doc.activeElement === first) { e.preventDefault(); last.focus(); return true; }
    if (!e.shiftKey && doc.activeElement === last) { e.preventDefault(); first.focus(); return true; }
    return false;
  }

  /* ------------------------------------------------------------------
     7. 기사 검색 팔레트 (⌘K / Ctrl+K)
     ------------------------------------------------------------------ */
  function initCmd(cmd) {
    var input = $('.cmd__input', cmd);
    var list = $('.cmd__list', cmd);
    var empty = $('.cmd__empty', cmd);
    if (!input || !list) return;
    var opts = $$('.cmd__opt', list);
    opts.forEach(function (o, i) {
      if (!o.id) o.id = (cmd.id || 'cmd') + '-opt-' + i;
      o.setAttribute('role', 'option');
      o.setAttribute('aria-selected', 'false');
      var t = $('.cmd__title', o);
      if (t && !t._orig) t._orig = t.innerHTML;
    });
    list.setAttribute('role', 'listbox');
    input.setAttribute('role', 'combobox');
    input.setAttribute('aria-expanded', 'true');
    input.setAttribute('aria-autocomplete', 'list');
    if (list.id) input.setAttribute('aria-controls', list.id);

    function visible() { return opts.filter(function (o) { return !o.hidden; }); }
    function select(o) {
      opts.forEach(function (x) { x.setAttribute('aria-selected', x === o ? 'true' : 'false'); });
      if (o) {
        input.setAttribute('aria-activedescendant', o.id);
        var lr = list.getBoundingClientRect(), or = o.getBoundingClientRect();
        if (or.bottom > lr.bottom) list.scrollTop += or.bottom - lr.bottom;
        if (or.top < lr.top) list.scrollTop -= lr.top - or.top;
      } else input.removeAttribute('aria-activedescendant');
    }
    function esc(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
    function filter() {
      var q = input.value.trim().toLowerCase();
      opts.forEach(function (o) {
        var hay = (o.textContent + ' ' + (o.getAttribute('data-keywords') || '')).toLowerCase();
        o.hidden = q && hay.indexOf(q) === -1;
        var t = $('.cmd__title', o);
        if (t && t._orig != null) {
          t.innerHTML = t._orig;
          if (q && !o.hidden) {
            var walker = doc.createTreeWalker(t, NodeFilter.SHOW_TEXT);
            var n, re = new RegExp(esc(q), 'i');
            while ((n = walker.nextNode())) {
              var m = n.nodeValue.match(re);
              if (m) {
                var mark = doc.createElement('mark');
                var after = n.splitText(m.index);
                after.nodeValue = after.nodeValue.slice(m[0].length);
                mark.textContent = m[0];
                n.parentNode.insertBefore(mark, after);
                break;
              }
            }
          }
        }
      });
      $$('.cmd__group', list).forEach(function (g) {
        var n = g.nextElementSibling, any = false;
        while (n && !n.classList.contains('cmd__group')) { if (!n.hidden) any = true; n = n.nextElementSibling; }
        g.hidden = !any;
      });
      var v = visible();
      if (empty) {
        empty.hidden = v.length > 0;
        var qEl = $('[data-cmd-query]', empty);
        if (qEl) qEl.textContent = input.value.trim();
      }
      select(v[0] || null);
    }
    function activate(o) {
      if (!o) return;
      var href = o.getAttribute('data-href');
      if (href) { location.href = href; return; }
      var title = $('.cmd__title', o);
      toast({ tag: '열람', text: (title ? title.textContent : o.textContent).trim() });
      if (!cmd.classList.contains('cmd--static')) closeOverlay(cmd);
    }
    on(input, 'input', filter);
    on(input, 'keydown', function (e) {
      var v = visible();
      var cur = v.indexOf($('.cmd__opt[aria-selected="true"]', list));
      if (e.key === 'ArrowDown') { e.preventDefault(); select(v[Math.min(cur + 1, v.length - 1)] || v[0]); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); select(v[Math.max(cur - 1, 0)]); }
      else if (e.key === 'Home' && e.ctrlKey) { e.preventDefault(); select(v[0]); }
      else if (e.key === 'End' && e.ctrlKey) { e.preventDefault(); select(v[v.length - 1]); }
      else if (e.key === 'Enter') { e.preventDefault(); activate(v[cur] || v[0]); }
    });
    on(list, 'click', function (e) { var o = e.target.closest('.cmd__opt'); if (o) activate(o); });
    on(list, 'mousemove', function (e) { var o = e.target.closest('.cmd__opt'); if (o && o.getAttribute('aria-selected') !== 'true') select(o); });
    on(cmd, 'overlay:open', function () { input.value = ''; filter(); });
    filter();
  }
  $$('.cmd').forEach(initCmd);
  function mainCmd() { return $('.cmd[data-cmd]:not(.cmd--static)') || $('.cmd:not(.cmd--static)'); }
  doc.addEventListener('click', function (e) {
    var b = e.target.closest('[data-cmd-open]');
    if (!b) return;
    e.preventDefault();
    openOverlay(mainCmd(), b);
  });

  /* ------------------------------------------------------------------
     8. 탭 (면 색인 탭)
     ------------------------------------------------------------------ */
  function initTabs(tabs) {
    var list = $('[role="tablist"]', tabs);
    if (!list) return;
    var items = $$('[role="tab"]', list);
    function activate(tab, focus) {
      items.forEach(function (t) {
        var sel = t === tab;
        t.setAttribute('aria-selected', sel ? 'true' : 'false');
        t.tabIndex = sel ? 0 : -1;
        var p = doc.getElementById(t.getAttribute('aria-controls'));
        if (p) p.hidden = !sel;
      });
      if (focus) tab.focus();
      tab.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    }
    var current = items.filter(function (t) { return t.getAttribute('aria-selected') === 'true'; })[0] || items[0];
    if (current) {
      items.forEach(function (t) { t.tabIndex = t === current ? 0 : -1; });
      items.forEach(function (t) {
        var p = doc.getElementById(t.getAttribute('aria-controls'));
        if (p) p.hidden = t !== current;
      });
    }
    on(list, 'click', function (e) {
      var t = e.target.closest('[role="tab"]');
      if (t && !t.disabled) activate(t, false);
    });
    on(list, 'keydown', function (e) {
      var enabled = items.filter(function (t) { return !t.disabled; });
      var i = enabled.indexOf(doc.activeElement);
      if (i < 0) return;
      var n = null;
      if (e.key === 'ArrowRight') n = enabled[(i + 1) % enabled.length];
      else if (e.key === 'ArrowLeft') n = enabled[(i - 1 + enabled.length) % enabled.length];
      else if (e.key === 'Home') n = enabled[0];
      else if (e.key === 'End') n = enabled[enabled.length - 1];
      if (n) { e.preventDefault(); activate(n, true); }
    });
  }
  $$('.tabs, [data-tabs]').forEach(initTabs);

  /* 가로 스크롤 끝 표시 (탭 줄 · 면 색인 줄) */
  function watchScroll(bar, scroller) {
    if (!bar || !scroller) return;
    function upd() {
      var can = scroller.scrollWidth > scroller.clientWidth + 2;
      bar.classList.toggle('is-scrollable', can);
      bar.classList.toggle('is-end', !can || scroller.scrollLeft + scroller.clientWidth >= scroller.scrollWidth - 2);
    }
    on(scroller, 'scroll', upd, { passive: true });
    on(window, 'resize', upd);
    upd();
  }
  $$('.tabs__bar').forEach(function (b) { watchScroll(b, $('.tabs__list', b)); });
  $$('.nav__scroller').forEach(function (b) { watchScroll(b, $('.nav__list', b)); });

  /* ------------------------------------------------------------------
     9. 아코디언 (단신 묶음)
     ------------------------------------------------------------------ */
  $$('.acc').forEach(function (acc) {
    var btns = $$('.acc__btn', acc);
    btns.forEach(function (b) {
      var p = doc.getElementById(b.getAttribute('aria-controls'));
      if (p) p.hidden = b.getAttribute('aria-expanded') !== 'true';
    });
    on(acc, 'click', function (e) {
      var b = e.target.closest('.acc__btn');
      if (!b || b.disabled) return;
      var open = b.getAttribute('aria-expanded') !== 'true';
      if (open && acc.hasAttribute('data-single')) {
        btns.forEach(function (o) {
          if (o !== b && o.getAttribute('aria-expanded') === 'true') {
            o.setAttribute('aria-expanded', 'false');
            var op = doc.getElementById(o.getAttribute('aria-controls'));
            if (op) op.hidden = true;
          }
        });
      }
      b.setAttribute('aria-expanded', open ? 'true' : 'false');
      var p = doc.getElementById(b.getAttribute('aria-controls'));
      if (p) p.hidden = !open;
    });
    on(acc, 'keydown', function (e) {
      var en = btns.filter(function (b) { return !b.disabled; });
      var i = en.indexOf(doc.activeElement);
      if (i < 0) return;
      var n = null;
      if (e.key === 'ArrowDown') n = en[(i + 1) % en.length];
      else if (e.key === 'ArrowUp') n = en[(i - 1 + en.length) % en.length];
      else if (e.key === 'Home') n = en[0];
      else if (e.key === 'End') n = en[en.length - 1];
      if (n) { e.preventDefault(); n.focus(); }
    });
  });

  /* ------------------------------------------------------------------
     10. 메뉴 (편집 메뉴) · 11. 팝오버 (교정 쪽지)
     ------------------------------------------------------------------ */
  var openFloat = null; // { trigger, panel, kind }
  function closeFloat(returnFocus) {
    if (!openFloat) return;
    var f = openFloat;
    openFloat = null;
    f.panel.hidden = true;
    f.trigger.setAttribute('aria-expanded', 'false');
    if (returnFocus) f.trigger.focus();
  }
  function menuItems(panel) {
    return $$('.menu__item', panel).filter(function (i) { return !i.disabled && i.getAttribute('aria-disabled') !== 'true'; });
  }
  function openFloatFor(trigger, kind, focusLast) {
    var panel = doc.getElementById(trigger.getAttribute('aria-controls'));
    if (!panel) return;
    closeFloat(false);
    panel.hidden = false;
    trigger.setAttribute('aria-expanded', 'true');
    openFloat = { trigger: trigger, panel: panel, kind: kind };
    if (kind === 'menu') {
      var it = menuItems(panel);
      var t = focusLast ? it[it.length - 1] : it[0];
      if (t) t.focus();
    } else {
      var f = $('[data-autofocus]', panel);
      if (f) f.focus();
    }
  }
  $$('.menu__list:not(.menu__list--static)').forEach(function (l) { l.hidden = true; });
  $$('.pop__panel:not(.pop__panel--static)').forEach(function (p) { if (!p.hasAttribute('data-open-default')) p.hidden = true; });

  doc.addEventListener('click', function (e) {
    var mt = e.target.closest('[aria-haspopup="menu"]');
    if (mt) {
      e.preventDefault();
      if (openFloat && openFloat.trigger === mt) closeFloat(false);
      else openFloatFor(mt, 'menu');
      return;
    }
    var pt = e.target.closest('.pop__trigger');
    if (pt) {
      e.preventDefault();
      if (openFloat && openFloat.trigger === pt) closeFloat(false);
      else openFloatFor(pt, 'pop');
      return;
    }
    var mi = e.target.closest('.menu__item');
    if (mi && !mi.disabled && mi.getAttribute('aria-disabled') !== 'true') {
      var role = mi.getAttribute('role');
      if (role === 'menuitemcheckbox') {
        mi.setAttribute('aria-checked', mi.getAttribute('aria-checked') === 'true' ? 'false' : 'true');
      } else if (role === 'menuitemradio') {
        var grp = mi.getAttribute('data-group');
        $$('.menu__item[role="menuitemradio"]', mi.closest('.menu__list')).forEach(function (r) {
          if (!grp || r.getAttribute('data-group') === grp) r.setAttribute('aria-checked', r === mi ? 'true' : 'false');
        });
      }
      if (mi.hasAttribute('data-toast')) toastFrom(mi);
      if (mi.closest('.menu__list--static')) return;
      if (mi.tagName.toLowerCase() !== 'a') closeFloat(true);
      return;
    }
    if (e.target.closest('.pop__close')) {
      var pp = e.target.closest('.pop__panel');
      if (openFloat && openFloat.panel === pp) closeFloat(true);
      return;
    }
    if (openFloat && !openFloat.panel.contains(e.target)) closeFloat(false);
  });
  doc.addEventListener('keydown', function (e) {
    var mt = e.target.closest && e.target.closest('[aria-haspopup="menu"]');
    if (mt && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      e.preventDefault();
      openFloatFor(mt, 'menu', e.key === 'ArrowUp');
      return;
    }
    if (!openFloat || openFloat.kind !== 'menu') return;
    var panel = openFloat.panel;
    if (!panel.contains(doc.activeElement)) return;
    var it = menuItems(panel);
    var i = it.indexOf(doc.activeElement);
    var n = null;
    if (e.key === 'ArrowDown') n = it[(i + 1) % it.length];
    else if (e.key === 'ArrowUp') n = it[(i - 1 + it.length) % it.length];
    else if (e.key === 'Home') n = it[0];
    else if (e.key === 'End') n = it[it.length - 1];
    else if (e.key === 'Tab') closeFloat(false);
    if (n) { e.preventDefault(); n.focus(); }
  });
  doc.addEventListener('focusin', function (e) {
    if (openFloat && openFloat.kind === 'pop' && !openFloat.panel.contains(e.target) && e.target !== openFloat.trigger) closeFloat(false);
  });

  /* ------------------------------------------------------------------
     12. 툴팁 (교열 메모) — Esc 로 닫기
     ------------------------------------------------------------------ */
  function dismissTips() {
    $$('.tip').forEach(function (t) {
      if (t.matches(':hover') || t.contains(doc.activeElement)) t.classList.add('is-dismissed');
    });
  }
  doc.addEventListener('mouseout', function (e) {
    var t = e.target.closest && e.target.closest('.tip.is-dismissed');
    if (t && !t.contains(e.relatedTarget)) t.classList.remove('is-dismissed');
  });
  doc.addEventListener('focusout', function (e) {
    var t = e.target.closest && e.target.closest('.tip.is-dismissed');
    if (t) t.classList.remove('is-dismissed');
  });

  /* ------------------------------------------------------------------
     전역 키보드 — ⌘K, Esc, Tab 트랩
     ------------------------------------------------------------------ */
  doc.addEventListener('keydown', function (e) {
    if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
      var c = mainCmd();
      if (c) {
        e.preventDefault();
        if (c.hidden) openOverlay(c, doc.activeElement); else closeOverlay(c);
      }
      return;
    }
    if (e.key === 'Escape') {
      if (openFloat) { e.preventDefault(); closeFloat(true); return; }
      var tipOpen = $$('.tip').some(function (t) { return !t.classList.contains('is-dismissed') && (t.matches(':hover') || t.contains(doc.activeElement)); });
      if (tipOpen) { dismissTips(); return; }
      if (stack.length) { e.preventDefault(); closeOverlay(); return; }
      return;
    }
    if (e.key === 'Tab' && stack.length) trapTab(e);
  });

  /* ------------------------------------------------------------------
     13. 지면 넘김 (carousel)
     ------------------------------------------------------------------ */
  $$('[data-carousel]').forEach(function (car) {
    var slides = $$('.carousel__slide', car);
    if (!slides.length) return;
    var prev = $('[data-carousel-prev]', car);
    var next = $('[data-carousel-next]', car);
    var cur = $('[data-carousel-current]', car);
    var tot = $('[data-carousel-total]', car);
    var pgs = $$('.carousel__pg', car);
    var idx = Math.max(0, slides.findIndex(function (s) { return !s.hidden; }));
    if (tot && !tot.textContent.trim()) tot.textContent = String(slides.length);
    function show(i, announceIt) {
      idx = Math.max(0, Math.min(slides.length - 1, i));
      slides.forEach(function (s, k) { s.hidden = k !== idx; });
      var label = slides[idx].getAttribute('data-label') || String(idx + 1);
      if (cur) cur.textContent = label;
      if (prev) prev.disabled = idx === 0;
      if (next) next.disabled = idx === slides.length - 1;
      pgs.forEach(function (p, k) { p.setAttribute('aria-current', k === idx ? 'true' : 'false'); });
      if (announceIt) announce(label + '면 — ' + (slides[idx].getAttribute('aria-label') || ''));
    }
    on(prev, 'click', function () { show(idx - 1, true); });
    on(next, 'click', function () { show(idx + 1, true); });
    pgs.forEach(function (p, k) { on(p, 'click', function () { show(k, true); }); });
    on(car, 'keydown', function (e) {
      if (e.target.closest('input, textarea, select')) return;
      if (e.key === 'ArrowRight') { e.preventDefault(); show(idx + 1, true); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); show(idx - 1, true); }
    });
    show(idx, false);
  });

  /* ------------------------------------------------------------------
     14. 속보 띠 (ticker)
     ------------------------------------------------------------------ */
  $$('.ticker').forEach(function (tk) {
    var track = $('.ticker__track', tk);
    var runs = track ? $$('.ticker__run', track) : [];
    if (track && runs.length === 1) {
      var clone = runs[0].cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      $$('a, button', clone).forEach(function (a) { a.tabIndex = -1; });
      track.appendChild(clone);
    }
    var btn = $('[data-ticker-toggle]', tk);
    if (!btn) return;
    function upd(paused) {
      tk.setAttribute('data-paused', paused ? 'true' : 'false');
      btn.setAttribute('aria-pressed', paused ? 'true' : 'false');
      btn.setAttribute('aria-label', paused ? '속보 띠 다시 흐르게' : '속보 띠 멈추기');
      var txt = $('.ticker__toggle-text', btn);
      if (txt) txt.textContent = paused ? '재생' : '정지';
      var ic = $('[data-icon]', btn);
      if (ic) { ic.setAttribute('data-icon', paused ? 'play' : 'pause'); ic.innerHTML = ''; paintIcons(btn); }
    }
    upd(reduceMotion);
    on(btn, 'click', function () { upd(tk.getAttribute('data-paused') !== 'true'); });
  });

  /* ------------------------------------------------------------------
     15. 면 배열 보드 (kanban) — 끌어 옮기기 + 단추 이동
     ------------------------------------------------------------------ */
  $$('[data-kanban]').forEach(function (board) {
    var cols = $$('.board__col', board);
    function listOf(col) { return $('.board__list', col); }
    function colName(col) { var n = $('.board__name', col); return n ? n.textContent.trim() : ''; }
    function refresh() {
      cols.forEach(function (col, ci) {
        var list = listOf(col);
        var slips = $$('.slip', list);
        var cnt = $('.board__head .count', col);
        if (cnt) cnt.textContent = String(slips.length);
        var em = $('.board__empty', list);
        if (em) em.hidden = slips.length > 0;
        var tally = $('.board__tally', col);
        if (tally) {
          var sum = 0;
          slips.forEach(function (s) { $$('.slip__meta .num', s).forEach(function (n) { sum += parseInt(n.textContent.replace(/[^0-9]/g, ''), 10) || 0; }); });
          tally.innerHTML = '쪽지 <b>' + slips.length + '</b>장' + (sum ? ' · 원고 <b>' + sum.toLocaleString('ko-KR') + '</b>자' : '');
        }
        slips.forEach(function (s) {
          var p = $('[data-move="prev"]', s), n = $('[data-move="next"]', s);
          if (p) p.disabled = ci === 0;
          if (n) n.disabled = ci === cols.length - 1;
        });
      });
    }
    function moved(slip, col) {
      slip.classList.remove('is-moved');
      void slip.offsetWidth;
      slip.classList.add('is-moved');
      var t = $('.slip__title', slip);
      announce('「' + (t ? t.textContent.trim() : '쪽지') + '」 쪽지를 ' + colName(col) + ' 열로 옮겼습니다');
      board.dispatchEvent(new CustomEvent('kanban:move', { bubbles: true, detail: { slip: slip, column: col } }));
      refresh();
    }
    on(board, 'click', function (e) {
      var b = e.target.closest('[data-move]');
      if (!b || b.disabled) return;
      var slip = b.closest('.slip');
      var col = slip.closest('.board__col');
      var ci = cols.indexOf(col) + (b.getAttribute('data-move') === 'next' ? 1 : -1);
      if (ci < 0 || ci >= cols.length) return;
      var target = listOf(cols[ci]);
      var em = $('.board__empty', target);
      target.insertBefore(slip, em || null);
      moved(slip, cols[ci]);
      var again = $('[data-move="' + b.getAttribute('data-move') + '"]', slip);
      if (again && !again.disabled) again.focus(); else slip.focus();
    });
    var dragging = null;
    $$('.slip', board).forEach(function (s) {
      if (s.getAttribute('aria-disabled') === 'true') return;
      s.setAttribute('draggable', 'true');
      if (!s.hasAttribute('tabindex')) s.tabIndex = 0;
    });
    on(board, 'dragstart', function (e) {
      var s = e.target.closest && e.target.closest('.slip');
      if (!s) return;
      dragging = s;
      e.dataTransfer.effectAllowed = 'move';
      try { e.dataTransfer.setData('text/plain', s.id || 'slip'); } catch (er) { /* noop */ }
      setTimeout(function () { s.classList.add('is-dragging'); }, 0);
    });
    on(board, 'dragend', function () {
      if (dragging) dragging.classList.remove('is-dragging');
      $$('.board__list.is-over', board).forEach(function (l) { l.classList.remove('is-over'); });
      dragging = null;
    });
    on(board, 'dragover', function (e) {
      if (!dragging) return;
      var list = e.target.closest && e.target.closest('.board__list');
      if (!list) return;
      e.preventDefault();
      $$('.board__list.is-over', board).forEach(function (l) { if (l !== list) l.classList.remove('is-over'); });
      list.classList.add('is-over');
      var after = $$('.slip:not(.is-dragging)', list).filter(function (s) {
        var r = s.getBoundingClientRect();
        return e.clientY < r.top + r.height / 2;
      })[0];
      if (after) list.insertBefore(dragging, after);
      else list.insertBefore(dragging, $('.board__empty', list) || null);
    });
    on(board, 'drop', function (e) {
      if (!dragging) return;
      e.preventDefault();
      var col = dragging.closest('.board__col');
      dragging.classList.remove('is-dragging');
      moved(dragging, col);
    });
    refresh();
  });

  /* ------------------------------------------------------------------
     16. 시세표 정렬 · 행 선택
     ------------------------------------------------------------------ */
  $$('.tbl').forEach(function (tbl) {
    var body = tbl.tBodies[0];
    if (!body) return;
    $$('.tbl__sort', tbl).forEach(function (btn) {
      on(btn, 'click', function () {
        var th = btn.closest('th');
        var ths = $$('thead th', tbl);
        var col = ths.indexOf(th);
        var dir = th.getAttribute('aria-sort') === 'ascending' ? 'descending' : 'ascending';
        ths.forEach(function (h) { if (h.hasAttribute('aria-sort')) h.setAttribute('aria-sort', 'none'); });
        th.setAttribute('aria-sort', dir);
        var numeric = th.classList.contains('num') || th.getAttribute('data-sort') === 'num';
        var rows = Array.prototype.slice.call(body.rows);
        rows.sort(function (a, b) {
          var ca = a.cells[col], cb = b.cells[col];
          var va = ca ? (ca.getAttribute('data-value') || ca.textContent.trim()) : '';
          var vb = cb ? (cb.getAttribute('data-value') || cb.textContent.trim()) : '';
          var r;
          if (numeric) {
            var na = parseFloat(va.replace(/[^0-9.\-]/g, '')) || 0;
            var nb = parseFloat(vb.replace(/[^0-9.\-]/g, '')) || 0;
            r = na - nb;
          } else r = va.localeCompare(vb, 'ko');
          return dir === 'ascending' ? r : -r;
        });
        rows.forEach(function (r) { body.appendChild(r); });
        announce((btn.textContent || '').trim() + ' 기준 ' + (dir === 'ascending' ? '오름차순' : '내림차순') + ' 정렬');
      });
    });
    if (tbl.hasAttribute('data-selectable')) {
      on(body, 'click', function (e) {
        if (e.target.closest('a, button:not(.tbl__pick)')) return;
        var tr = e.target.closest('tr');
        if (!tr) return;
        var sel = tr.getAttribute('aria-selected') === 'true';
        tr.setAttribute('aria-selected', sel ? 'false' : 'true');
        var cb = $('input[type="checkbox"]', tr);
        if (cb && e.target !== cb) cb.checked = !sel;
      });
    }
  });

  /* ------------------------------------------------------------------
     17. 발행 달력 — 일요일 휴간
     ------------------------------------------------------------------ */
  var DOW = ['일', '월', '화', '수', '목', '금', '토'];
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function ymd(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function parseD(s) { var p = (s || '').split('-'); return p.length === 3 ? new Date(+p[0], +p[1] - 1, +p[2]) : null; }
  function krDate(d) { return d.getFullYear() + '년 ' + (d.getMonth() + 1) + '월 ' + d.getDate() + '일 ' + DOW[d.getDay()] + '요일'; }

  $$('[data-calendar]').forEach(function (cal) {
    var m = (cal.getAttribute('data-month') || '2026-10').split('-');
    var view = new Date(+m[0], +m[1] - 1, 1);
    var today = parseD(cal.getAttribute('data-today'));
    var minD = parseD(cal.getAttribute('data-min')); /* 이 날보다 앞은 고를 수 없다 (예: 배달 시작일) */
    var selected = parseD(cal.getAttribute('data-selected'));
    var marks = {}, kinds = {};
    /* data-marks="날짜:표식[:종류];…" — 종류 stop = 배달 정지(고를 수 있는지와 무관하게 같은 망점 표시) */
    (cal.getAttribute('data-marks') || '').split(';').forEach(function (pair) {
      var parts = pair.split(':');
      if (parts.length < 2) return;
      var k = parts[0].trim();
      marks[k] = parts[1].trim();
      if (parts[2]) kinds[k] = parts[2].trim();
    });
    var focusKey = null;
    var legend = $('.cal__legend', cal);

    function render() {
      var y = view.getFullYear(), mo = view.getMonth();
      var start = new Date(y, mo, 1 - new Date(y, mo, 1).getDay());
      var h = '<div class="cal__head">' +
        '<button type="button" class="cal__nav" data-cal-prev aria-label="이전 달">‹</button>' +
        '<p class="cal__title" aria-live="polite"><span class="latin">' + y + '</span>년 <span class="latin">' + (mo + 1) + '</span>월</p>' +
        '<button type="button" class="cal__nav" data-cal-next aria-label="다음 달">›</button></div>';
      h += '<table class="cal__grid" role="grid" aria-label="' + y + '년 ' + (mo + 1) + '월 발행 달력"><thead><tr>';
      DOW.forEach(function (d) { h += '<th scope="col" abbr="' + d + '요일">' + d + '</th>'; });
      h += '</tr></thead><tbody>';
      var anchor = selected && selected.getMonth() === mo && selected.getFullYear() === y ? ymd(selected)
        : (today && today.getMonth() === mo && today.getFullYear() === y ? ymd(today) : null);
      for (var w = 0; w < 6; w++) {
        h += '<tr>';
        for (var d = 0; d < 7; d++) {
          var day = new Date(start.getFullYear(), start.getMonth(), start.getDate() + w * 7 + d);
          var key = ymd(day);
          var out = day.getMonth() !== mo;
          var past = !!(minD && day < minD);
          var off = day.getDay() === 0;
          var note = off ? '휴간' : (marks[key] || '');
          if (!anchor && !out && !off && !past) anchor = key;
          /* 고를 수 없음(--locked: 숫자만 흐리게)과 표식(--mark / --stop)은 서로 다른 클래스 */
          var cls = 'cal__day' + (out ? ' cal__day--out' : '') + (past && !off ? ' cal__day--locked' : '') +
            (marks[key] && !off ? ' cal__day--mark' : '') + (kinds[key] === 'stop' && !off ? ' cal__day--stop' : '');
          var attrs = ' data-date="' + key + '" aria-label="' + krDate(day) + (off ? ' 휴간' : '') + (marks[key] ? ', ' + marks[key] : '') + '"';
          if (today && key === ymd(today)) attrs += ' aria-current="date"';
          if (selected && key === ymd(selected)) attrs += ' aria-pressed="true"';
          else if (!off) attrs += ' aria-pressed="false"';
          if (off || past) attrs += ' aria-disabled="true"';
          h += '<td' + (off ? ' class="cal__cell--off"' : '') + '><button type="button" class="' + cls + '"' + attrs + ' tabindex="-1">' +
            '<span class="cal__n">' + day.getDate() + '</span>' + (note ? '<span class="cal__note">' + note + '</span>' : '') + '</button></td>';
        }
        h += '</tr>';
      }
      h += '</tbody></table>';
      $$('.cal__head, .cal__grid', cal).forEach(function (n) { n.remove(); });
      var frag = doc.createElement('div');
      frag.innerHTML = h;
      while (frag.firstChild) cal.insertBefore(frag.firstChild, legend || null);
      var tabKey = focusKey || anchor;
      var tb = $('.cal__day[data-date="' + tabKey + '"]', cal) || $('.cal__day:not(.cal__day--out):not([aria-disabled])', cal);
      if (tb) tb.tabIndex = 0;
      if (focusKey && tb) tb.focus();
      focusKey = null;
    }
    function go(delta) { view = new Date(view.getFullYear(), view.getMonth() + delta, 1); render(); }
    function pick(key) {
      var d = parseD(key);
      if (!d || d.getDay() === 0 || (minD && d < minD)) return;
      selected = d;
      if (d.getMonth() !== view.getMonth()) view = new Date(d.getFullYear(), d.getMonth(), 1);
      focusKey = key;
      render();
      var outSel = cal.getAttribute('data-cal-output');
      if (outSel) $$(outSel).forEach(function (el) { el.textContent = krDate(d); }); /* 여러 곳에 찍을 수 있다 */
      cal.dispatchEvent(new CustomEvent('calendar:select', { bubbles: true, detail: { date: key, label: krDate(d) } }));
    }
    on(cal, 'click', function (e) {
      if (e.target.closest('[data-cal-prev]')) { go(-1); return; }
      if (e.target.closest('[data-cal-next]')) { go(1); return; }
      var b = e.target.closest('.cal__day');
      if (b && b.getAttribute('aria-disabled') !== 'true') pick(b.getAttribute('data-date'));
    });
    on(cal, 'keydown', function (e) {
      var b = e.target.closest('.cal__day');
      if (!b) return;
      var d = parseD(b.getAttribute('data-date'));
      var step = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }[e.key];
      if (step) {
        e.preventDefault();
        var nd = new Date(d.getFullYear(), d.getMonth(), d.getDate() + step);
        focusKey = ymd(nd);
        if (nd.getMonth() !== view.getMonth()) view = new Date(nd.getFullYear(), nd.getMonth(), 1);
        render();
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (b.getAttribute('aria-disabled') !== 'true') pick(b.getAttribute('data-date'));
      } else if (e.key === 'PageUp' || e.key === 'PageDown') {
        e.preventDefault();
        go(e.key === 'PageUp' ? -1 : 1);
      }
    });
    render();
  });

  /* ------------------------------------------------------------------
     18. 진행 중 단추 [data-busy="ms"] · 실패 [data-busy-fail]
     ------------------------------------------------------------------ */
  doc.addEventListener('click', function (e) {
    var b = e.target.closest('[data-busy]');
    if (!b || b.getAttribute('aria-busy') === 'true') return;
    if (b.closest('form[data-validate]') && b.type === 'submit') return;
    e.preventDefault();
    var ms = parseInt(b.getAttribute('data-busy'), 10) || 1200;
    var label = $('[data-label]', b) || null;
    var orig = label ? label.textContent : null;
    b.setAttribute('aria-busy', 'true');
    b.removeAttribute('data-state');
    if (label && b.getAttribute('data-busy-text')) label.textContent = b.getAttribute('data-busy-text');
    setTimeout(function () {
      b.removeAttribute('aria-busy');
      if (label) label.textContent = orig;
      if (b.hasAttribute('data-busy-fail')) {
        b.setAttribute('data-state', 'error');
        toast({ tag: '실패', tone: 'danger', text: b.getAttribute('data-busy-fail') || '전송하지 못했습니다. 다시 시도해 주세요.' });
        setTimeout(function () { b.removeAttribute('data-state'); }, 2400);
      } else {
        if (b.hasAttribute('data-done')) {
          b.setAttribute('data-state', 'done');
          setTimeout(function () { b.removeAttribute('data-state'); }, 2400);
        }
        toastFrom(b);
      }
    }, ms);
  });

  /* ------------------------------------------------------------------
     19. 괘선 긋기 — [data-rule-in] 뷰포트 진입 시 1회
     ------------------------------------------------------------------ */
  var ruleEls = $$('[data-rule-in]');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    ruleEls.forEach(function (el) { el.classList.add('is-drawn'); });
  } else if (ruleEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-drawn'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    ruleEls.forEach(function (el) { io.observe(el); });
    // 안전망: 3초 뒤에도 안 그어진 괘선은 그어 둔다 (인쇄·캡처)
    setTimeout(function () { ruleEls.forEach(function (el) { if (el.getBoundingClientRect().top < innerHeight) el.classList.add('is-drawn'); }); }, 3000);
  }

  /* ------------------------------------------------------------------
     20. 윤전 견본 재생
     ------------------------------------------------------------------ */
  doc.addEventListener('click', function (e) {
    var b = e.target.closest('[data-motion-play]');
    if (!b) return;
    var item = b.closest('.motion__item');
    if (!item) return;
    item.classList.remove('is-playing');
    void item.offsetWidth;
    item.classList.add('is-playing');
  });
  $$('.motion__item').forEach(function (it) { it.classList.add('is-playing'); });

  /* ------------------------------------------------------------------
     21. 면 색인 사이드바 접기 (<1024)
     ------------------------------------------------------------------ */
  var narrow = window.matchMedia ? window.matchMedia('(max-width: 1023px)') : null;
  $$('[data-side-toggle]').forEach(function (btn) {
    var body = doc.getElementById(btn.getAttribute('aria-controls'));
    if (!body) return;
    function set(open) {
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      body.setAttribute('data-collapsed', open ? 'false' : 'true');
    }
    set(!(narrow && narrow.matches));
    on(btn, 'click', function () { set(btn.getAttribute('aria-expanded') !== 'true'); });
    if (narrow) {
      var h = function (e) { set(!e.matches); };
      if (narrow.addEventListener) narrow.addEventListener('change', h); else if (narrow.addListener) narrow.addListener(h);
    }
  });

  /* ------------------------------------------------------------------
     22. 알림 닫기 [data-dismiss] · 23. 복사 [data-copy]
     ------------------------------------------------------------------ */
  doc.addEventListener('click', function (e) {
    var d = e.target.closest('[data-dismiss]');
    if (d) {
      var id = d.getAttribute('data-dismiss');
      var t = id ? doc.getElementById(id) : d.closest('.alert');
      if (t) {
        var nextFocus = t.nextElementSibling && visibleFocusables(t.nextElementSibling)[0];
        t.remove();
        announce('알림을 닫았습니다');
        if (nextFocus) nextFocus.focus();
      }
      return;
    }
    var c = e.target.closest('[data-copy]');
    if (c) {
      var sel = c.getAttribute('data-copy');
      var src = sel ? $(sel) : ($('pre', c.closest('.code')) || null);
      var text = src ? src.textContent : '';
      var done = function () {
        var orig = c.getAttribute('data-orig') || c.textContent;
        c.setAttribute('data-orig', orig);
        c.textContent = '복사됨';
        c.setAttribute('data-state', 'done');
        announce('조판 명령을 복사했습니다');
        setTimeout(function () { c.textContent = orig; c.removeAttribute('data-state'); }, 1600);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, done);
      else {
        var ta = doc.createElement('textarea');
        ta.value = text; ta.setAttribute('readonly', ''); ta.style.position = 'absolute'; ta.style.left = '-9999px';
        doc.body.appendChild(ta); ta.select();
        try { doc.execCommand('copy'); } catch (er) { /* noop */ }
        ta.remove(); done();
      }
    }
  });

  /* ------------------------------------------------------------------
     24. 서식 검증 form[data-validate] · 글자 수 · 마법사 [data-wizard]
     ------------------------------------------------------------------ */
  function fieldError(field, msg) {
    var wrap = field.closest('.field') || field.closest('.check') || field.parentElement;
    var err = wrap ? $('.field__error', wrap) : null;
    if (msg) {
      field.setAttribute('aria-invalid', 'true');
      if (!err && wrap) {
        err = doc.createElement('p');
        err.className = 'field__error';
        err.id = (field.id || 'f' + Math.random().toString(36).slice(2, 7)) + '-err';
        (wrap.classList.contains('check') ? wrap.parentElement : wrap).appendChild(err);
      }
      if (err) {
        err.hidden = false;
        err.textContent = msg;
        var db = (field.getAttribute('aria-describedby') || '').split(' ').filter(Boolean);
        if (db.indexOf(err.id) < 0) { db.push(err.id); field.setAttribute('aria-describedby', db.join(' ')); }
      }
    } else {
      field.removeAttribute('aria-invalid');
      if (err) err.hidden = true;
    }
  }
  function validate(scope) {
    var bad = [];
    $$('input, select, textarea', scope).forEach(function (f) {
      if (f.disabled || f.closest('[hidden]')) return;
      var msg = '';
      if (f.required) {
        if (f.type === 'checkbox' && !f.checked) msg = f.getAttribute('data-error') || '동의가 필요합니다';
        else if (f.type === 'radio') {
          var g = $$('input[type="radio"][name="' + f.name + '"]', scope);
          if (!g.some(function (r) { return r.checked; })) msg = f.getAttribute('data-error') || '하나를 골라 주세요';
        } else if (!f.value.trim()) msg = f.getAttribute('data-error') || '필수 항목입니다';
      }
      if (!msg && f.value && f.pattern && !new RegExp('^(?:' + f.pattern + ')$').test(f.value)) msg = f.getAttribute('data-error-pattern') || '형식을 확인해 주세요';
      if (!msg && f.type === 'email' && f.value && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.value)) msg = '이메일 형식을 확인해 주세요';
      if (f.type !== 'radio' || msg) fieldError(f, msg);
      if (msg) bad.push(f);
    });
    if (bad[0]) bad[0].focus();
    return bad.length === 0;
  }
  /* 브라우저 기본 검증 말풍선이 먼저 떠서 submit 이 막히지 않게 — [확인] 문구는 app.js 가 낸다 */
  $$('form[data-validate]').forEach(function (f) { f.noValidate = true; });
  doc.addEventListener('submit', function (e) {
    var f = e.target.closest('form[data-validate]');
    if (!f) return;
    e.preventDefault();
    if (!validate(f)) { announce('입력하지 않은 항목이 있습니다'); return; }
    var sub = $('[type="submit"]', f);
    var after = function () {
      toast({ tag: f.getAttribute('data-success-tag') || '접수', tone: 'ok', text: f.getAttribute('data-success') || '접수했습니다.' });
      if (f.getAttribute('data-validate') === 'go' && f.action) location.href = f.getAttribute('action');
    };
    if (sub && sub.hasAttribute('data-busy')) {
      sub.setAttribute('aria-busy', 'true');
      setTimeout(function () { sub.removeAttribute('aria-busy'); after(); }, parseInt(sub.getAttribute('data-busy'), 10) || 1000);
    } else after();
  });
  doc.addEventListener('input', function (e) {
    var f = e.target;
    if (f.getAttribute && f.getAttribute('aria-invalid') === 'true') fieldError(f, '');
    if (f.matches && f.matches('textarea[maxlength], input[maxlength][data-count]')) {
      var c = $('.field__count', f.closest('.field'));
      if (c) c.textContent = f.value.length.toLocaleString('ko-KR') + ' / ' + parseInt(f.getAttribute('maxlength'), 10).toLocaleString('ko-KR') + '자';
    }
  });
  doc.addEventListener('change', function (e) {
    var f = e.target;
    if (f.type === 'radio' && f.name) {
      $$('input[type="radio"][name="' + f.name + '"]').forEach(function (r) { fieldError(r, ''); });
    } else if (f.getAttribute && f.getAttribute('aria-invalid') === 'true') fieldError(f, '');
  });

  $$('[data-wizard]').forEach(function (wz) {
    var panels = $$('[data-wizard-panel]', wz);
    var steps = $$('.process__step', wz);
    var idx = Math.max(0, panels.findIndex(function (p) { return !p.hidden; }));
    function show(i, focus) {
      idx = Math.max(0, Math.min(panels.length - 1, i));
      panels.forEach(function (p, k) { p.hidden = k !== idx; });
      steps.forEach(function (s, k) {
        s.setAttribute('data-state', k < idx ? 'done' : (k === idx ? 'current' : 'todo'));
        if (k === idx) s.setAttribute('aria-current', 'step'); else s.removeAttribute('aria-current');
      });
      if (focus) {
        var h = $('h2, h3, [data-wizard-focus]', panels[idx]) || panels[idx];
        if (!h.hasAttribute('tabindex')) h.setAttribute('tabindex', '-1');
        h.focus();
      }
      wz.dispatchEvent(new CustomEvent('wizard:step', { bubbles: true, detail: { index: idx } }));
    }
    on(wz, 'click', function (e) {
      if (e.target.closest('[data-wizard-next]')) {
        e.preventDefault();
        if (validate(panels[idx])) show(idx + 1, true);
      } else if (e.target.closest('[data-wizard-prev]')) {
        e.preventDefault();
        show(idx - 1, true);
      } else {
        var s = e.target.closest('.process__step');
        var k = steps.indexOf(s);
        if (s && k > -1 && k < idx) { e.preventDefault(); show(k, true); }
      }
    });
    show(idx, false);
  });

  /* ------------------------------------------------------------------
     25. 값 묶기 [data-bind="#target"] — 고른 값이 다른 곳의 글자를 바꾼다
     ------------------------------------------------------------------ */
  function bindOut(f) {
    var sel = f.getAttribute('data-bind');
    if (!sel) return;
    if ((f.type === 'radio' || f.type === 'checkbox') && !f.checked) return;
    var text = f.getAttribute('data-bind-text');
    if (text == null) {
      if (f.tagName.toLowerCase() === 'select') text = f.options[f.selectedIndex] ? f.options[f.selectedIndex].text : f.value;
      else text = f.value;
    }
    $$(sel).forEach(function (t) { t.textContent = text; });
  }
  doc.addEventListener('change', function (e) { if (e.target.hasAttribute && e.target.hasAttribute('data-bind')) bindOut(e.target); });
  doc.addEventListener('input', function (e) { if (e.target.hasAttribute && e.target.hasAttribute('data-bind') && e.target.type !== 'radio' && e.target.type !== 'checkbox') bindOut(e.target); });

  /* ------------------------------------------------------------------
     26. 선택 목록 [data-select-list="그룹"] > [data-select="패널id"]
     ------------------------------------------------------------------ */
  doc.addEventListener('click', function (e) {
    var it = e.target.closest('[data-select]');
    if (!it) return;
    var list = it.closest('[data-select-list]');
    if (!list) return;
    e.preventDefault();
    var grp = list.getAttribute('data-select-list');
    $$('[data-select]', list).forEach(function (x) {
      var hostItem = x.closest('.list__item') || x;
      if (x === it) hostItem.setAttribute('aria-current', 'true'); else hostItem.removeAttribute('aria-current');
      if (x === it) hostItem.classList.remove('is-new');
    });
    $$('[data-select-panel="' + grp + '"]').forEach(function (p) { p.hidden = p.id !== it.getAttribute('data-select'); });
    var target = doc.getElementById(it.getAttribute('data-select'));
    if (target) {
      var h = $('h2, h3', target) || target;
      if (!h.hasAttribute('tabindex')) h.setAttribute('tabindex', '-1');
      if (window.matchMedia && window.matchMedia('(max-width: 1023px)').matches) h.scrollIntoView({ block: 'start' });
      h.focus({ preventScroll: true });
    }
  });

  /* ------------------------------------------------------------------
     27. 면 번호 견본 [data-folios] — 누르면 현재 면 이동
     ------------------------------------------------------------------ */
  $$('[data-folios]').forEach(function (f) {
    on(f, 'click', function (e) {
      var a = e.target.closest('.folios__link');
      if (!a) return;
      e.preventDefault();
      $$('.folios__link', f).forEach(function (x) { if (x === a) x.setAttribute('aria-current', 'page'); else x.removeAttribute('aria-current'); });
      announce(a.textContent.trim() + '면');
    });
  });

  /* ------------------------------------------------------------------
     28. 마감 카운트다운 [data-countdown="ISO 마감"] [data-now="ISO 장면 시각"]
         장면 시각(팩트 시트)에서 출발해 실제 경과 시간만큼 흐른다.
     ------------------------------------------------------------------ */
  $$('[data-countdown]').forEach(function (el) {
    var end = Date.parse(el.getAttribute('data-countdown'));
    var base = Date.parse(el.getAttribute('data-now') || '') || Date.now();
    if (isNaN(end)) return;
    var t0 = Date.now();
    function tick() {
      var left = Math.max(0, end - (base + (Date.now() - t0)));
      var s = Math.floor(left / 1000);
      var txt = pad(Math.floor(s / 3600)) + ':' + pad(Math.floor(s / 60) % 60) + ':' + pad(s % 60);
      el.textContent = txt;
      el.setAttribute('datetime', 'PT' + Math.floor(s / 3600) + 'H' + (Math.floor(s / 60) % 60) + 'M' + (s % 60) + 'S');
      if (left <= 0) el.classList.add('is-late');
    }
    tick();
    if (!reduceMotion) setInterval(tick, 1000);
  });

  /* ------------------------------------------------------------------
     공개 API
     ------------------------------------------------------------------ */
  window.YM = {
    toast: toast,
    setTheme: function (t) { if (t === 'dark' || t === 'light') setTheme(t, true); },
    open: function (id) { openOverlay(doc.getElementById(id)); },
    close: function (id) { closeOverlay(id ? doc.getElementById(id) : null); },
    announce: announce,
    paintIcons: paintIcons
  };
  /* 가로로 넘치는 줄(마감 줄) — 끝까지 밀면 오른쪽 흐림을 걷는다 */
  $$('.clockline').forEach(function (el) {
    function sync() { el.classList.toggle('is-end', el.scrollLeft + el.clientWidth >= el.scrollWidth - 2); }
    on(el, 'scroll', sync, { passive: true });
    on(window, 'resize', sync);
    sync();
  });

  /* ------------------------------------------------------------------
     교정 주석 토글 (index 390) — 쪽지는 기본 접힘, 상태는 localStorage
     ------------------------------------------------------------------ */
  (function proofToggle() {
    var btns = $$('[data-proof-toggle]');
    if (!btns.length) return;
    var KEY = 'ym-proofs';
    function read() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
    function write(v) { try { localStorage.setItem(KEY, v); } catch (e) { /* 저장 불가 — 화면만 바뀐다 */ } }
    function apply(onState) {
      if (onState) root.setAttribute('data-proofs', 'on'); else root.removeAttribute('data-proofs');
      btns.forEach(function (b) {
        b.setAttribute('aria-pressed', onState ? 'true' : 'false');
        b.textContent = onState ? '교정 주석 접기' : '교정 주석 보기';
      });
    }
    apply(read() === 'on');
    btns.forEach(function (b) {
      on(b, 'click', function () {
        var next = root.getAttribute('data-proofs') !== 'on';
        apply(next);
        write(next ? 'on' : 'off');
      });
    });
  })();

})();
