/* 월간 「행간」 v2 — app.js (바닐라, 외부 라이브러리 없음)
   테마(?theme= 최우선 → localStorage → 시스템) · 읽기 진행 룰 · 현재 쪽번호 · 잉크 마름
   모달 · 드로어 · ⌘K 색인 · 탭 · 아코디언 · 토스트 · 각주 팝오버 · 메뉴 · 툴팁 · 캐러셀 · 낱장 넘김
   책등 마퀴 · 표 정렬 · 마감 보드 · 달력 · 112쪽 진행 막대 · 쪽 이동 · 독자 엽서 검증 · 복사 · 모션 토글 */
(function () {
  'use strict';

  var doc = document;
  var root = doc.documentElement;
  var THEME_KEY = 'haenggan-theme';
  var MOTION_KEY = 'haenggan-motion';

  root.classList.add('js');

  /* ── 유틸 ─────────────────────────────────────────── */
  function $(sel, ctx) { return (ctx || doc).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || doc).querySelectorAll(sel)); }
  function store(key, val) {
    try {
      if (val === undefined) return localStorage.getItem(key);
      if (val === null) localStorage.removeItem(key); else localStorage.setItem(key, val);
    } catch (e) { return null; }
    return null;
  }
  var uid = 0;
  function ensureId(el, prefix) {
    if (!el.id) { uid += 1; el.id = (prefix || 'hg') + '-' + uid; }
    return el.id;
  }
  function reducedMotion() {
    return root.getAttribute('data-motion') === 'reduce' ||
      (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
  }
  var FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
  function focusables(ctx) {
    return $$(FOCUSABLE, ctx).filter(function (el) {
      return el.offsetParent !== null || el.getClientRects().length > 0;
    });
  }
  function pad3(n) { n = String(n); while (n.length < 3) n = '0' + n; return n; }
  function onAnimEnd(el, cb, ms) {
    var done = false;
    function fin() { if (done) return; done = true; el.removeEventListener('animationend', fin); cb(); }
    el.addEventListener('animationend', fin);
    setTimeout(fin, ms || 520);
  }

  /* ── 1. 테마: URL ?theme= → localStorage → 시스템 ─────── */
  function queryTheme() {
    try {
      var q = new URLSearchParams(location.search).get('theme');
      return q === 'dark' || q === 'light' ? q : null;
    } catch (e) { return null; }
  }
  function resolveTheme() {
    var q = queryTheme();
    if (q) return q;
    var s = store(THEME_KEY);
    if (s === 'dark' || s === 'light') return s;
    return window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  function applyTheme(t) {
    root.setAttribute('data-theme', t);
    $$('[data-theme-toggle]').forEach(function (btn) {
      var dark = t === 'dark';
      btn.setAttribute('aria-pressed', dark ? 'true' : 'false');
      btn.setAttribute('aria-label', dark ? '낮의 지면(밝은 화면)으로 바꾸기' : '흑지(어두운 화면)로 바꾸기');
      btn.setAttribute('title', dark ? '낮의 지면으로' : '흑지로');
      var lab = $('[data-theme-label]', btn);
      if (lab) lab.textContent = dark ? '흑지' : '낮의 지면';
    });
  }
  applyTheme(resolveTheme());
  doc.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-theme-toggle]');
    if (!btn) return;
    var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    store(THEME_KEY, next);
    if (queryTheme()) {
      try {
        var url = new URL(location.href);
        url.searchParams.set('theme', next);
        history.replaceState(null, '', url.toString());
      } catch (err) { /* file:// 등 */ }
    }
    applyTheme(next);
  });
  if (window.matchMedia) {
    var mq = matchMedia('(prefers-color-scheme: dark)');
    var onSys = function () { if (!queryTheme() && !store(THEME_KEY)) applyTheme(mq.matches ? 'dark' : 'light'); };
    if (mq.addEventListener) mq.addEventListener('change', onSys); else if (mq.addListener) mq.addListener(onSys);
  }

  /* ── 2. 모션 줄이기 토글 ─────────────────────────────── */
  function applyMotion(reduce) {
    if (reduce) root.setAttribute('data-motion', 'reduce'); else root.removeAttribute('data-motion');
    $$('[data-motion-toggle]').forEach(function (el) {
      if (el.type === 'checkbox') el.checked = reduce;
      else el.setAttribute('aria-pressed', reduce ? 'true' : 'false');
      var st = el.closest('.switch') && $('.switch__state', el.closest('.switch'));
      if (st) st.textContent = reduce ? '켜짐' : '꺼짐';
    });
    if (reduce) $$('.ink-dry').forEach(function (el) { el.classList.add('is-dry'); });
  }
  applyMotion(store(MOTION_KEY) === 'reduce');
  /* 일반 스위치의 켜짐/꺼짐 글자 동기화 (data-on / data-off 로 문구를 바꿀 수 있다) */
  function syncSwitch(input) {
    var sw = input.closest('.switch'); var st = sw && $('.switch__state', sw);
    if (st) st.textContent = input.checked ? (st.getAttribute('data-on') || '켜짐') : (st.getAttribute('data-off') || '꺼짐');
  }
  $$('.switch input[type="checkbox"]:not([data-motion-toggle])').forEach(syncSwitch);
  doc.addEventListener('change', function (e) {
    if (e.target.matches('.switch input[type="checkbox"]:not([data-motion-toggle])')) syncSwitch(e.target);
  });
  doc.addEventListener('change', function (e) {
    if (e.target.matches('[data-motion-toggle][type="checkbox"]')) {
      store(MOTION_KEY, e.target.checked ? 'reduce' : null);
      applyMotion(e.target.checked);
    }
  });
  doc.addEventListener('click', function (e) {
    var b = e.target.closest('button[data-motion-toggle]');
    if (!b) return;
    var on = b.getAttribute('aria-pressed') !== 'true';
    store(MOTION_KEY, on ? 'reduce' : null);
    applyMotion(on);
  });

  /* ── 3. 읽기 진행 룰 · 표지 위 마스트헤드 · 현재 쪽번호 ── */
  var readRule = $('.read-rule');
  var masthead = $('.masthead');
  var cover = $('[data-cover]');
  var ticking = false;
  function onScroll() {
    ticking = false;
    var max = root.scrollHeight - window.innerHeight;
    if (readRule) readRule.style.setProperty('--read', max > 0 ? Math.min(1, window.scrollY / max).toFixed(4) : '0');
    if (masthead && cover) {
      var over = cover.getBoundingClientRect().bottom > (masthead.offsetHeight + 6);
      masthead.classList.toggle('is-over', over);
      masthead.classList.toggle('scope-cover', over);
    }
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  /* 현재 쪽번호 — 스크롤마다(rAF) "top이 뷰포트 50%보다 위에 있는 마지막 [data-folio]"를 고른다.
     IntersectionObserver는 들어오는 순간만 받아 위로 되돌아갈 때 앞 지면 번호가 남는다.
     폼의 data-folio(토스트용)는 지면이 아니므로 뺀다. 좁은 화면(≤767)에서는 떠 있는 상자 대신
     마스트헤드 「제87호」 옆에 글자로 찍는다(셸 마크업은 그대로 두고 여기서 덧붙인다). */
  var folioBox = $('.folio-now');
  var issueEl = folioBox && $('.masthead__issue');
  if (issueEl && !$('[data-current-folio]', issueEl)) {
    var now = doc.createElement('span');
    now.className = 'masthead__now';
    now.setAttribute('data-current-folio', '');
    now.setAttribute('aria-hidden', 'true');
    issueEl.appendChild(now);
  }
  var folioOut = $$('[data-current-folio]');
  var folioSections = $$('[data-folio]:not(form)');
  if (folioOut.length && folioSections.length) {
    var lastFolio = null, fTick = false;
    var folioUpd = function () {
      fTick = false;
      var mid = window.innerHeight / 2, cur = folioSections[0];
      for (var i = 0; i < folioSections.length; i++) {
        if (folioSections[i].getBoundingClientRect().top <= mid) cur = folioSections[i];
      }
      var f = cur.getAttribute('data-folio');
      if (f !== lastFolio) {
        lastFolio = f;
        /* 표지(표1)·뒤표지(표4)는 지면 자체에 폴리오가 찍혀 있다 → 떠 있는 표시는 끈다(이중 표기 방지).
           한글 쪽 표기(표N)는 모노·넓은 자간을 쓰지 않는다(.is-ko). */
        var off = cur.hasAttribute('data-cover') || cur.classList.contains('scope-back');
        var ko = /^[^p]/.test(f);
        folioOut.forEach(function (o) { o.textContent = f; o.classList.toggle('is-ko', ko); o.classList.toggle('is-off', off); });
        if (folioBox) folioBox.classList.toggle('is-off', off);
      }
    };
    window.addEventListener('scroll', function () {
      if (!fTick) { fTick = true; requestAnimationFrame(folioUpd); }
    }, { passive: true });
    window.addEventListener('resize', folioUpd);
    folioUpd();
  }

  /* 지면 배열표(dashboard) — 쪽 칸을 누르면 그 쪽의 기사 이름 쪽지를 칸 아래에 띄운다(터치 기기엔 hover가 없다) */
  var fpEl = $('.fp'), fpPop = fpEl && $('.fp__pop', fpEl);
  if (fpEl && fpPop) {
    var fpPicked = null;
    var fpClose = function () { fpPop.hidden = true; if (fpPicked) fpPicked.classList.remove('is-picked'); fpPicked = null; };
    fpEl.addEventListener('click', function (e) {
      var pg = e.target.closest('.fp__pg[title]');
      if (!pg || pg === fpPicked) { fpClose(); return; }
      if (fpPicked) fpPicked.classList.remove('is-picked');
      fpPicked = pg; pg.classList.add('is-picked');
      fpPop.textContent = pg.getAttribute('title');
      fpPop.hidden = false;
      var box = fpEl.getBoundingClientRect(), r = pg.getBoundingClientRect();
      var w = fpPop.offsetWidth;
      var left = Math.max(0, Math.min(r.left - box.left, box.width - w));
      fpPop.style.left = left + 'px';
      fpPop.style.top = (r.bottom - box.top + 6) + 'px';
    });
    doc.addEventListener('click', function (e) { if (fpPicked && !fpEl.contains(e.target)) fpClose(); });
    doc.addEventListener('keydown', function (e) { if (e.key === 'Escape' && fpPicked) fpClose(); });
  }

  /* ── 4. 잉크 마름 ─────────────────────────────────── */
  var inks = $$('.ink-dry');
  if (inks.length) {
    if (!('IntersectionObserver' in window) || reducedMotion()) {
      inks.forEach(function (el) { el.classList.add('is-dry'); });
    } else {
      var iio = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add('is-dry'); iio.unobserve(en.target); }
        });
      }, { threshold: 0.12 });
      inks.forEach(function (el) { iio.observe(el); });
    }
  }

  /* ── 5. 오버레이 층: 모달 · 드로어 · ⌘K ───────────────── */
  var LAYER_SEL = '.modal:not(.modal--static), .drawer:not(.drawer--static), .command:not(.command--static)';
  var stack = [];
  $$(LAYER_SEL).forEach(function (el) {
    if (!el.classList.contains('is-open')) { el.setAttribute('aria-hidden', 'true'); el.inert = true; }
  });
  function layerPanel(el) { return $('[role="dialog"]', el) || el; }
  function openLayer(el, trigger) {
    if (!el || el.classList.contains('is-open')) return;
    closeAllPops();
    el.inert = false;
    el.removeAttribute('aria-hidden');
    el.classList.add('is-open');
    root.classList.add('is-locked');
    stack.push({ el: el, trigger: trigger || doc.activeElement });
    if (el.classList.contains('command')) commandReset(el);
    var panel = layerPanel(el);
    var target = $('[data-autofocus]', el) || focusables(panel)[0] || panel;
    setTimeout(function () { target.focus({ preventScroll: true }); }, 20);
  }
  function closeLayer(el) {
    if (!el || !el.classList.contains('is-open')) return;
    el.classList.remove('is-open');
    el.setAttribute('aria-hidden', 'true');
    el.inert = true;
    var idx = -1;
    stack.forEach(function (s, i) { if (s.el === el) idx = i; });
    var entry = idx > -1 ? stack.splice(idx, 1)[0] : null;
    if (!stack.length) root.classList.remove('is-locked');
    if (entry && entry.trigger && entry.trigger.focus && doc.contains(entry.trigger)) entry.trigger.focus({ preventScroll: true });
  }
  window.addEventListener('pageshow', function () {
    stack.slice().forEach(function (s) { closeLayer(s.el); });
  });
  doc.addEventListener('click', function (e) {
    var t = e.target.closest('[data-modal-open], [data-drawer-open], [data-open]');
    if (t) {
      var id = t.getAttribute('data-modal-open') || t.getAttribute('data-drawer-open') || t.getAttribute('data-open');
      var el = doc.getElementById(id);
      if (el) { e.preventDefault(); openLayer(el, t); }
      return;
    }
    var c = e.target.closest('[data-command-open]');
    if (c) {
      e.preventDefault();
      var cid = c.getAttribute('data-command-open');
      openLayer(cid ? doc.getElementById(cid) : $('.command:not(.command--static)'), c);
      return;
    }
    var x = e.target.closest('[data-close]');
    if (x) {
      var layer = x.closest(LAYER_SEL);
      if (layer) { e.preventDefault(); closeLayer(layer); }
    }
  });
  /* 포커스 트랩 */
  doc.addEventListener('keydown', function (e) {
    if (e.key !== 'Tab' || !stack.length) return;
    var top = stack[stack.length - 1].el;
    var f = focusables(layerPanel(top));
    if (!f.length) { e.preventDefault(); return; }
    var first = f[0], last = f[f.length - 1];
    if (!top.contains(doc.activeElement)) { e.preventDefault(); first.focus(); return; }
    if (e.shiftKey && doc.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && doc.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  /* ── 6. ⌘K 찾아보기(색인) ─────────────────────────── */
  function commandItems(cmd) { return $$('.command__item', cmd).filter(function (i) { return !i.hidden && i.getAttribute('aria-disabled') !== 'true'; }); }
  function commandSelect(cmd, item) {
    var input = $('.command__input', cmd);
    $$('.command__item', cmd).forEach(function (i) { i.setAttribute('aria-selected', i === item ? 'true' : 'false'); });
    if (item) {
      ensureId(item, 'cmd-opt');
      if (input) input.setAttribute('aria-activedescendant', item.id);
      var list = item.closest('.command__list');
      if (list && list.scrollHeight > list.clientHeight) {
        var lr = list.getBoundingClientRect(), ir = item.getBoundingClientRect();
        if (ir.bottom > lr.bottom) list.scrollTop += ir.bottom - lr.bottom;
        else if (ir.top < lr.top + 40) list.scrollTop -= (lr.top + 40) - ir.top;
      }
    } else if (input) input.removeAttribute('aria-activedescendant');
  }
  function commandFilter(cmd) {
    var input = $('.command__input', cmd);
    var q = (input ? input.value : '').trim().toLowerCase().replace(/\s+/g, '');
    var any = false;
    $$('.command__item', cmd).forEach(function (i) {
      var hay = (i.textContent + ' ' + (i.getAttribute('data-keywords') || '')).toLowerCase().replace(/\s+/g, '');
      var hit = !q || hay.indexOf(q) > -1;
      i.hidden = !hit;
      var li = i.closest('li'); if (li && li !== i) li.hidden = !hit;
      if (hit) any = true;
    });
    $$('.command__group', cmd).forEach(function (g) { g.hidden = !$$('.command__item', g).some(function (i) { return !i.hidden; }); });
    var empty = $('.command__empty', cmd);
    if (empty) {
      empty.hidden = any;
      var qo = $('[data-command-query]', empty); if (qo && input) qo.textContent = input.value.trim();
    }
    commandSelect(cmd, commandItems(cmd)[0] || null);
  }
  function commandReset(cmd) {
    var input = $('.command__input', cmd);
    if (input) input.value = '';
    commandFilter(cmd);
  }
  $$('.command').forEach(function (cmd) {
    var input = $('.command__input', cmd);
    if (!input) return;
    input.addEventListener('input', function () { commandFilter(cmd); });
    input.addEventListener('keydown', function (e) {
      var items = commandItems(cmd);
      var cur = items.indexOf($('.command__item[aria-selected="true"]', cmd));
      if (e.key === 'ArrowDown') { e.preventDefault(); commandSelect(cmd, items[(cur + 1) % items.length]); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); commandSelect(cmd, items[(cur - 1 + items.length) % items.length]); }
      else if (e.key === 'Home') { e.preventDefault(); commandSelect(cmd, items[0]); }
      else if (e.key === 'End') { e.preventDefault(); commandSelect(cmd, items[items.length - 1]); }
      else if (e.key === 'Enter' && cur > -1) { e.preventDefault(); items[cur].click(); }
    });
    cmd.addEventListener('mousemove', function (e) {
      var it = e.target.closest('.command__item');
      if (it && it.getAttribute('aria-selected') !== 'true' && !it.hidden) commandSelect(cmd, it);
    });
    cmd.addEventListener('click', function (e) {
      var it = e.target.closest('.command__item');
      if (!it || cmd.classList.contains('command--static')) return;
      var href = it.getAttribute('href') || '';
      closeLayer(cmd);
      if (href.charAt(0) === '#') {
        var dest = doc.getElementById(href.slice(1));
        if (dest) { e.preventDefault(); dest.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth' }); if (!dest.hasAttribute('tabindex')) dest.setAttribute('tabindex', '-1'); dest.focus({ preventScroll: true }); }
      }
    });
    if (cmd.classList.contains('command--static')) {      /* 견본은 마크업에 적힌 선택을 지킨다 */
      var preset = $('.command__item[aria-selected="true"]', cmd);
      commandFilter(cmd);
      if (preset && !preset.hidden) commandSelect(cmd, preset);
    }
  });
  doc.addEventListener('keydown', function (e) {
    if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
      var cmd = $('.command:not(.command--static)');
      if (!cmd) return;
      e.preventDefault();
      if (cmd.classList.contains('is-open')) closeLayer(cmd); else openLayer(cmd, doc.activeElement);
    }
  });

  /* ── 7. 팝 계열(메뉴 · 각주 팝오버) 공통 ───────────────── */
  var openPops = [];
  function closePop(p, refocus) {
    var i = openPops.indexOf(p);
    if (i > -1) openPops.splice(i, 1);
    p.panel.hidden = true;
    p.trigger.setAttribute('aria-expanded', 'false');
    if (refocus) p.trigger.focus();
  }
  function closeAllPops(except) {
    openPops.slice().forEach(function (p) { if (p.panel !== except) closePop(p); });
  }
  function openPop(trigger, panel, kind) {
    closeAllPops(panel);
    panel.hidden = false;
    trigger.setAttribute('aria-expanded', 'true');
    var p = { trigger: trigger, panel: panel, kind: kind };
    openPops.push(p);
    /* 화면 밖으로 넘치면 방향 전환 */
    var cls = kind === 'menu' ? ['menu--left', 'menu--up'] : ['popover--right', 'popover--up'];
    var host = kind === 'menu' ? trigger.closest('.menu') || panel.parentNode : panel;
    panel.classList.remove('popover--right', 'popover--up');
    var r = panel.getBoundingClientRect();
    if (kind !== 'menu') {
      if (r.right > window.innerWidth - 8) panel.classList.add(cls[0]);
      if (r.bottom > window.innerHeight - 8 && r.top - r.height > 80) panel.classList.add(cls[1]);
    } else if (host && host.classList) {
      if (!host.hasAttribute('data-menu-fixed')) {
        host.classList.remove('menu--left', 'menu--up');
        r = panel.getBoundingClientRect();
        if (r.left < 8) host.classList.add('menu--left');
        r = panel.getBoundingClientRect();
        if (r.bottom > window.innerHeight - 8 && r.top - r.height > 80) host.classList.add('menu--up');
      }
    }
    return p;
  }
  function popFor(trigger) {
    var id = trigger.getAttribute('aria-controls');
    return id ? doc.getElementById(id) : null;
  }

  /* 메뉴 */
  function menuItems(panel) { return $$('.menu__item', panel).filter(function (i) { return !i.disabled && i.getAttribute('aria-disabled') !== 'true'; }); }
  doc.addEventListener('click', function (e) {
    var trig = e.target.closest('[data-menu]');
    if (trig) {
      var panel = popFor(trig);
      if (!panel) return;
      e.preventDefault();
      if (!panel.hidden) { closeAllPops(); return; }
      openPop(trig, panel, 'menu');
      var first = menuItems(panel)[0]; if (first) first.focus();
      return;
    }
    var item = e.target.closest('.menu__item');
    if (item) {
      var owner = openPops.filter(function (p) { return p.panel.contains(item); })[0];
      if (owner) setTimeout(function () { closePop(owner, true); }, 0);
      return;
    }
    var fn = e.target.closest('[data-popover]');
    if (fn) {
      var pp = popFor(fn);
      if (!pp) return;
      e.preventDefault();
      if (!pp.hidden) { closeAllPops(); return; }
      openPop(fn, pp, 'popover');
      return;
    }
    if (openPops.some(function (p) { return p.trigger.contains(e.target); })) return;
    if (!e.target.closest('.menu__list, .popover')) closeAllPops();
  });
  doc.addEventListener('keydown', function (e) {
    var panel = e.target.closest && e.target.closest('.menu__list');
    if (!panel || panel.classList.contains('menu__list--static')) return;
    var items = menuItems(panel);
    var i = items.indexOf(doc.activeElement);
    if (e.key === 'ArrowDown') { e.preventDefault(); items[(i + 1) % items.length].focus(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); items[(i - 1 + items.length) % items.length].focus(); }
    else if (e.key === 'Home') { e.preventDefault(); items[0].focus(); }
    else if (e.key === 'End') { e.preventDefault(); items[items.length - 1].focus(); }
    else if (e.key === 'Tab') { closeAllPops(); }
  });
  $$('[data-menu], [data-popover]').forEach(function (t) {
    t.setAttribute('aria-expanded', 'false');
    var p = popFor(t); if (p) p.hidden = true;
  });

  /* ── 8. Esc — 가장 위의 것부터 닫기 ──────────────────── */
  doc.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    var tips = $$('.tip:hover, .tip:focus-within, .tip.is-shown');
    if (tips.length) { tips.forEach(function (t) { t.classList.add('is-dismissed'); t.classList.remove('is-shown'); }); }
    if (openPops.length) { e.preventDefault(); closePop(openPops[openPops.length - 1], true); return; }
    if (stack.length) { e.preventDefault(); closeLayer(stack[stack.length - 1].el); return; }
    var mh = $('.masthead.is-open');
    if (mh) { var b = $('[data-nav-toggle]', mh); setNav(mh, false); if (b) b.focus(); }
  });

  /* ── 9. 툴팁 ─────────────────────────────────────── */
  $$('.tip').forEach(function (tip) {
    var trig = $('.tip__trigger', tip), bub = $('.tip__bubble', tip);
    if (trig && bub && !tip.classList.contains('tip--static')) {
      trig.setAttribute('aria-describedby', ensureId(bub, 'tip'));
      bub.setAttribute('role', 'tooltip');
    }
    function place() {
      if (!bub || tip.classList.contains('tip--static')) return;
      tip.classList.remove('tip--flip');
      var r = bub.getBoundingClientRect();
      if (r.width && r.right > window.innerWidth - 8) tip.classList.add('tip--flip');
    }
    tip.addEventListener('mouseenter', place);
    tip.addEventListener('focusin', place);
    tip.addEventListener('mouseleave', function () { tip.classList.remove('is-dismissed'); });
    tip.addEventListener('focusout', function () { tip.classList.remove('is-dismissed'); });
  });

  /* ── 10. 탭 — 자동 활성 + 낱장 넘김 ─────────────────── */
  function selectTab(tabs, tab, focus) {
    var list = $$('[role="tab"]', tabs);
    var prevIdx = -1, nextIdx = list.indexOf(tab);
    list.forEach(function (t, i) { if (t.getAttribute('aria-selected') === 'true') prevIdx = i; });
    if (prevIdx === nextIdx) { if (focus) tab.focus(); return; }
    list.forEach(function (t) {
      var on = t === tab;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
      var p = doc.getElementById(t.getAttribute('aria-controls'));
      if (p) {
        p.hidden = !on;
        if (on) {
          p.classList.remove('is-entering');
          void p.offsetWidth;
          p.classList.add('is-entering');
          onAnimEnd(p, function () { p.classList.remove('is-entering'); });
        }
      }
    });
    if (focus) tab.focus();
    var sc = tab.closest('.tabs__scroller');
    if (sc) {
      var sr = sc.getBoundingClientRect(), tr2 = tab.getBoundingClientRect();
      if (tr2.right > sr.right) sc.scrollLeft += tr2.right - sr.right + 24;
      else if (tr2.left < sr.left) sc.scrollLeft -= sr.left - tr2.left + 24;
    }
  }
  $$('[data-tabs]').forEach(function (tabs) {
    var list = $$('[role="tab"]', tabs);
    list.forEach(function (t) {
      t.tabIndex = t.getAttribute('aria-selected') === 'true' ? 0 : -1;
      t.addEventListener('click', function () { selectTab(tabs, t, false); });
      t.addEventListener('keydown', function (e) {
        var en = list.filter(function (x) { return !x.disabled; });
        var i = en.indexOf(t);
        var n = null;
        if (e.key === 'ArrowRight') n = en[(i + 1) % en.length];
        else if (e.key === 'ArrowLeft') n = en[(i - 1 + en.length) % en.length];
        else if (e.key === 'Home') n = en[0];
        else if (e.key === 'End') n = en[en.length - 1];
        if (n) { e.preventDefault(); selectTab(tabs, n, true); }
      });
    });
  });
  /* 가로 스크롤 힌트 — 탭 줄 · 사이드바 띠 */
  function scrollHint(el) {
    function upd() {
      var can = el.scrollWidth > el.clientWidth + 2;
      el.classList.toggle('is-scrollable', can);
      el.classList.toggle('at-end', !can || el.scrollLeft + el.clientWidth >= el.scrollWidth - 4);
    }
    el.addEventListener('scroll', upd, { passive: true });
    window.addEventListener('resize', upd);
    upd();
  }
  $$('.tabs__scroller, .sidebar__nav, .tbl-wrap, .board').forEach(scrollHint);
  /* 모바일 사이드바 띠: 현재 항목(aria-current=page)이 첫 화면에 보이게 가로 위치를 맞춘다 */
  $$('.sidebar__nav').forEach(function (nav) {
    var cur = $('[aria-current="page"]', nav);
    if (!cur || nav.scrollWidth <= nav.clientWidth + 2) return;
    var nr = nav.getBoundingClientRect(), cr = cur.getBoundingClientRect();
    if (cr.right > nr.right - 24 || cr.left < nr.left) nav.scrollLeft += cr.left - nr.left - 24;
    nav.dispatchEvent(new Event('scroll'));
  });

  /* ── 11. 아코디언 ─────────────────────────────────── */
  $$('[data-accordion]').forEach(function (acc) {
    var single = acc.getAttribute('data-accordion') === 'single';
    $$('.accordion__trigger', acc).forEach(function (btn) {
      var panel = doc.getElementById(btn.getAttribute('aria-controls'));
      if (panel) panel.hidden = btn.getAttribute('aria-expanded') !== 'true';
      btn.addEventListener('click', function () {
        var open = btn.getAttribute('aria-expanded') !== 'true';
        if (single && open) {
          $$('.accordion__trigger[aria-expanded="true"]', acc).forEach(function (o) {
            o.setAttribute('aria-expanded', 'false');
            var op = doc.getElementById(o.getAttribute('aria-controls')); if (op) op.hidden = true;
          });
        }
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
        if (panel) panel.hidden = !open;
      });
    });
  });

  /* ── 12. 토스트 ───────────────────────────────────── */
  var ICONS = {
    success: '<path d="M4 4h16v16H4z"/><path d="M8 12.5l2.8 2.8L16.5 9"/>',
    info: '<path d="M4 4h16v16H4z"/><path d="M12 10.5V17M12 7v1.2"/>',
    warning: '<path d="M12 3.5L21 20H3z"/><path d="M12 10v4.5M12 16.6v1.2"/>',
    danger: '<path d="M4 4h16v16H4z"/><path d="M8.5 8.5l7 7M15.5 8.5l-7 7"/>',
    spot: '<path d="M4 4h16v16H4z"/><path d="M8 12h8"/>'
  };
  function icon(kind) {
    return '<svg class="icon toast__icon" viewBox="0 0 24 24" aria-hidden="true">' + (ICONS[kind] || ICONS.info) + '</svg>';
  }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function region() {
    var r = $('.toast-region');
    if (!r) {
      r = doc.createElement('div');
      r.className = 'toast-region';
      r.setAttribute('aria-live', 'polite');
      r.setAttribute('aria-relevant', 'additions');
      doc.body.appendChild(r);
    }
    return r;
  }
  function dismissToast(t) {
    if (!t || t.classList.contains('is-leaving')) return;
    t.classList.add('is-leaving');
    onAnimEnd(t, function () { if (t.parentNode) t.parentNode.removeChild(t); }, 260);
  }
  function toast(opts) {
    opts = opts || {};
    var kind = opts.kind || 'success';
    var t = doc.createElement('div');
    t.className = 'toast toast--' + kind;
    t.setAttribute('role', kind === 'danger' ? 'alert' : 'status');
    t.innerHTML = icon(kind) +
      '<div class="toast__body"><p class="toast__title">' + esc(opts.title || '저장했습니다') + '</p>' +
      (opts.text ? '<p class="toast__text">' + esc(opts.text) + '</p>' : '') + '</div>' +
      '<span class="folio toast__folio">' + esc(opts.folio || 'p.—') + '</span>' +
      '<button class="toast__close" type="button" aria-label="알림 닫기"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button>';
    region().appendChild(t);
    var timer, remain = opts.duration || 5000, started = Date.now();
    function arm() { started = Date.now(); timer = setTimeout(function () { dismissToast(t); }, remain); }
    function hold() { clearTimeout(timer); remain -= Date.now() - started; }
    t.addEventListener('mouseenter', hold);
    t.addEventListener('mouseleave', arm);
    t.addEventListener('focusin', hold);
    t.addEventListener('focusout', arm);
    $('.toast__close', t).addEventListener('click', function () { clearTimeout(timer); dismissToast(t); });
    arm();
    return t;
  }
  function toastFrom(el) {
    toast({
      title: el.getAttribute('data-toast-title') || el.getAttribute('data-toast') || '저장했습니다',
      text: el.getAttribute('data-toast-text'),
      kind: el.getAttribute('data-toast-kind') || 'success',
      folio: el.getAttribute('data-toast-folio')
    });
  }
  doc.addEventListener('click', function (e) {
    var el = e.target.closest('[data-toast]');
    if (!el || el.hasAttribute('data-loading-demo')) return;
    toastFrom(el);
  });
  doc.addEventListener('click', function (e) {
    var c = e.target.closest('.toast--static .toast__close, .alert__close');
    if (!c) return;
    var box = c.closest('.toast, .alert');
    if (box) box.hidden = true;
  });

  /* ── 13. 버튼 로딩 시연 ───────────────────────────── */
  doc.addEventListener('click', function (e) {
    var b = e.target.closest('[data-loading-demo]');
    if (!b || b.getAttribute('aria-busy') === 'true') return;
    e.preventDefault();
    var label = b.querySelector('[data-loading-label]');
    var orig = label ? label.textContent : null;
    b.setAttribute('aria-busy', 'true');
    b.setAttribute('aria-disabled', 'true');
    if (label) label.textContent = b.getAttribute('data-loading-demo') || '처리 중';
    setTimeout(function () {
      b.removeAttribute('aria-busy');
      b.removeAttribute('aria-disabled');
      if (label) label.textContent = orig;
      if (b.hasAttribute('data-toast')) toastFrom(b);
    }, 1600);
  });

  /* ── 14. 캐러셀 · 낱장 넘김(turner) ───────────────────── */
  function turnTo(items, from, to, activeCls) {
    if (from === to || to < 0 || to >= items.length) return;
    var a = items[from], b = items[to];
    var back = to < from;
    items.forEach(function (it) { it.classList.remove('is-leaving', 'is-entering', 'is-back'); });
    a.classList.remove('is-active'); a.classList.add('is-leaving'); a.setAttribute('aria-hidden', 'true'); a.inert = true;
    b.classList.add('is-active', 'is-entering'); if (back) b.classList.add('is-back');
    b.removeAttribute('aria-hidden'); b.inert = false;
    onAnimEnd(b, function () {
      b.classList.remove('is-entering', 'is-back');
      a.classList.remove('is-leaving');
    }, 480);
  }
  $$('[data-carousel]').forEach(function (car) {
    var slides = $$('.carousel__slide', car);
    var dots = $$('[data-carousel-dot]', car);
    var prev = $('[data-carousel-prev]', car), next = $('[data-carousel-next]', car);
    var cur = Math.max(0, slides.findIndex(function (s) { return s.classList.contains('is-active'); }));
    function sync() {
      slides.forEach(function (s, i) {
        if (i !== cur) { s.setAttribute('aria-hidden', 'true'); s.inert = true; }
        s.setAttribute('aria-label', (i + 1) + ' / ' + slides.length);
      });
      slides[cur].classList.add('is-active');
      dots.forEach(function (d, i) { d.setAttribute('aria-current', i === cur ? 'true' : 'false'); });
      $$('[data-carousel-current]', car).forEach(function (o) { o.textContent = slides[cur].getAttribute('data-label') || String(cur + 1); });
      $$('[data-carousel-index]', car).forEach(function (o) { o.textContent = String(cur + 1); });
      $$('[data-carousel-total]', car).forEach(function (o) { o.textContent = String(slides.length); });
      if (prev) prev.disabled = cur === 0;
      if (next) next.disabled = cur === slides.length - 1;
    }
    function go(i) { if (i < 0 || i >= slides.length || i === cur) return; turnTo(slides, cur, i); cur = i; sync(); }
    if (prev) prev.addEventListener('click', function () { go(cur - 1); });
    if (next) next.addEventListener('click', function () { go(cur + 1); });
    dots.forEach(function (d, i) { d.addEventListener('click', function () { go(i); }); });
    var vp = $('.carousel__viewport', car);
    if (vp) vp.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); go(cur + 1); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); go(cur - 1); }
    });
    sync();
  });

  function setupTurner(tr) {
    var sheets = $$('.turner__sheet', tr).filter(function (s) { return s.closest('[data-turner]') === tr; });
    if (!sheets.length) return null;
    var cur = Math.max(0, sheets.findIndex(function (s) { return s.classList.contains('is-active'); }));
    var wrap = tr.hasAttribute('data-turner-wrap');
    function sync() {
      sheets.forEach(function (s, i) { if (i !== cur) { s.setAttribute('aria-hidden', 'true'); s.inert = true; } });
      sheets[cur].classList.add('is-active');
      var total = sheets.length;
      $$('[data-turn-count]', tr).forEach(function (o) { o.innerHTML = '<b>p.' + (cur + 1 < 10 ? '0' : '') + (cur + 1) + '</b> / ' + (total < 10 ? '0' : '') + total; });
      $$('.steps__item', tr).forEach(function (st, i) {
        st.classList.toggle('steps__item--done', i < cur);
        st.classList.toggle('steps__item--todo', i > cur);
        if (i === cur) st.setAttribute('aria-current', 'step'); else st.removeAttribute('aria-current');
      });
      $$('[data-turn="prev"]', tr).forEach(function (b) { b.disabled = !wrap && cur === 0; });
      $$('[data-turn="next"]', tr).forEach(function (b) { b.hidden = !wrap && cur === total - 1 && !!$('[data-turn-last]', tr); b.disabled = !wrap && cur === total - 1; });
      $$('[data-turn-last]', tr).forEach(function (b) { b.hidden = cur !== total - 1; });
    }
    function go(i) {
      if (wrap) i = (i + sheets.length) % sheets.length;
      if (i < 0 || i >= sheets.length || i === cur) return;
      turnTo(sheets, cur, i);
      cur = i;
      sync();
      var h = $('[data-turn-focus]', sheets[cur]) || sheets[cur];
      if (!tr.hasAttribute('data-turner-quiet')) {
        if (!h.hasAttribute('tabindex')) h.setAttribute('tabindex', '-1');
        h.focus({ preventScroll: true });
      }
    }
    tr.addEventListener('click', function (e) {
      var b = e.target.closest('[data-turn]');
      if (!b || b.closest('[data-turner]') !== tr) return;
      var v = b.getAttribute('data-turn');
      if (v === 'next') go(cur + 1); else if (v === 'prev') go(cur - 1); else go(parseInt(v, 10));
    });
    sync();
    return { next: function () { go(cur + 1); } };
  }
  var turners = new Map();
  $$('[data-turner]').forEach(function (tr) { turners.set(tr, setupTurner(tr)); });

  /* 모션 시연 다시 보기 */
  doc.addEventListener('click', function (e) {
    var b = e.target.closest('[data-motion-replay]');
    if (!b) return;
    var cell = b.closest('.motion-demo__cell') || doc;
    var kind = b.getAttribute('data-motion-replay');
    if (kind === 'ink') {
      $$('.ink-dry', cell).forEach(function (el) {
        el.classList.remove('is-dry');
        void el.offsetWidth;
        setTimeout(function () { el.classList.add('is-dry'); }, 60);
      });
    } else if (kind === 'turn') {
      var tr = $('[data-turner]', cell);
      var api = tr && turners.get(tr);
      if (api) api.next();
    }
  });

  /* ── 15. 책등 마퀴 일시정지 ───────────────────────── */
  doc.addEventListener('click', function (e) {
    var b = e.target.closest('[data-marquee-toggle]');
    if (!b) return;
    var box = b.closest('.spines');
    if (!box) return;
    var paused = !box.classList.contains('is-paused');
    box.classList.toggle('is-paused', paused);
    b.setAttribute('aria-pressed', paused ? 'true' : 'false');
    var lab = $('[data-marquee-label]', b) || b;
    lab.textContent = paused ? '다시 흐르게' : '일시정지';
  });

  /* ── 16. 표 정렬 ──────────────────────────────────── */
  $$('table[data-sortable]').forEach(function (table) {
    var heads = $$('thead th', table);
    heads.forEach(function (th, col) {
      var btn = $('.tbl__sort', th);
      if (!btn) return;
      btn.addEventListener('click', function () {
        var dir = th.getAttribute('aria-sort') === 'ascending' ? 'descending' : 'ascending';
        heads.forEach(function (h) { h.removeAttribute('aria-sort'); });
        th.setAttribute('aria-sort', dir);
        var type = btn.getAttribute('data-sort') || 'text';
        var body = table.tBodies[0];
        var rows = Array.prototype.slice.call(body.rows);
        function val(r) {
          var c = r.cells[col]; if (!c) return '';
          var v = c.getAttribute('data-sort-value') || c.textContent.trim();
          if (type === 'num') { var n = parseFloat(v.replace(/[^\d.\-]/g, '')); return isNaN(n) ? -Infinity : n; }
          return v;
        }
        rows.sort(function (a, b) {
          var x = val(a), y = val(b);
          var r = type === 'num' ? x - y : String(x).localeCompare(String(y), 'ko');
          return dir === 'ascending' ? r : -r;
        });
        rows.forEach(function (r) { body.appendChild(r); });
      });
    });
  });

  /* ── 17. 마감 보드 — 끌어 옮기기 + 키보드 "단계 이동" ──── */
  function colName(col) {
    var t = $('.board__title', col);
    if (!t) return '';
    var no = $('.board__no', t);
    return t.textContent.replace(no ? no.textContent : '', '').trim();
  }
  function boardSync(board) {
    $$('.board__col', board).forEach(function (col) {
      var list = $('.board__list', col);
      var n = $$('.board__card', list).length;
      var cnt = $('.board__count', col); if (cnt) cnt.textContent = n + '건';
      var empty = $('.board__empty', col); if (empty) empty.hidden = n > 0;
    });
  }
  function boardMove(board, card, col, before) {
    var list = $('.board__list', col);
    if (before) list.insertBefore(card, before); else {
      var empty = $('.board__empty', list);
      if (empty) list.insertBefore(card, empty); else list.appendChild(card);
    }
    boardSync(board);
    var live = $('.board__live', board);
    var title = $('.board__card-title', card);
    if (live) live.textContent = (title ? title.textContent : '카드') + ' → ' + colName(col) + ' 단계로 옮겼습니다';
  }
  $$('[data-board]').forEach(function (board) {
    var dragging = null;
    $$('.board__card', board).forEach(function (card) {
      card.setAttribute('draggable', 'true');
      if (!card.hasAttribute('tabindex')) card.tabIndex = 0;
    });
    board.addEventListener('dragstart', function (e) {
      var card = e.target.closest && e.target.closest('.board__card');
      if (!card) return;
      dragging = card;
      card.classList.add('is-dragging');
      card.setAttribute('aria-grabbed', 'true');
      try { e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', card.id || 'card'); } catch (err) { /* noop */ }
    });
    board.addEventListener('dragend', function () {
      if (dragging) { dragging.classList.remove('is-dragging'); dragging.removeAttribute('aria-grabbed'); }
      dragging = null;
      $$('.board__col.is-over', board).forEach(function (c) { c.classList.remove('is-over'); });
    });
    board.addEventListener('dragover', function (e) {
      var col = e.target.closest && e.target.closest('.board__col');
      if (!col || !dragging) return;
      e.preventDefault();
      $$('.board__col.is-over', board).forEach(function (c) { if (c !== col) c.classList.remove('is-over'); });
      col.classList.add('is-over');
    });
    board.addEventListener('drop', function (e) {
      var col = e.target.closest && e.target.closest('.board__col');
      if (!col || !dragging) return;
      e.preventDefault();
      var cards = $$('.board__card', col).filter(function (c) { return c !== dragging; });
      var before = null;
      cards.some(function (c) { var r = c.getBoundingClientRect(); if (e.clientY < r.top + r.height / 2) { before = c; return true; } return false; });
      boardMove(board, dragging, col, before);
      col.classList.remove('is-over');
    });
    /* 키보드 대안 */
    board.addEventListener('click', function (e) {
      var mv = e.target.closest('.board__move');
      if (!mv) return;
      var card = mv.closest('.board__card');
      var wrap = mv.closest('.menu');
      if (!wrap) {
        wrap = doc.createElement('div');
        wrap.className = 'menu';
        mv.parentNode.insertBefore(wrap, mv);
        wrap.appendChild(mv);
      }
      var list = $('.menu__list', wrap);
      if (!list) {
        list = doc.createElement('div');
        list.className = 'menu__list';
        list.setAttribute('role', 'menu');
        list.hidden = true;
        wrap.classList.add('menu--left');
        wrap.appendChild(list);
        mv.setAttribute('aria-haspopup', 'menu');
        mv.setAttribute('aria-controls', ensureId(list, 'move'));
      }
      var here = card.closest('.board__col');
      list.innerHTML = '<p class="menu__label">이 기사를 옮길 단계</p>';
      $$('.board__col', board).forEach(function (col) {
        var b = doc.createElement('button');
        b.type = 'button';
        b.className = 'menu__item';
        b.setAttribute('role', 'menuitem');
        b.textContent = colName(col);
        if (col === here) { b.disabled = true; b.textContent += ' (현재)'; }
        b.addEventListener('click', function () {
          boardMove(board, card, col, null);
          setTimeout(function () { card.focus(); }, 10);
        });
        list.appendChild(b);
      });
      if (!list.hidden) { closeAllPops(); return; }
      openPop(mv, list, 'menu');
      var f = menuItems(list)[0]; if (f) f.focus();
    });
    boardSync(board);
  });

  /* ── 18. 달력 — 날짜 고르기 + 화살표 이동 ──────────────── */
  $$('[data-calendar]').forEach(function (cal) {
    var days = $$('.cal__day', cal);
    var out = $('[data-cal-output]', cal);
    function pick(d) {
      days.forEach(function (x) { x.setAttribute('aria-selected', x === d ? 'true' : 'false'); });
      if (out) out.textContent = d.getAttribute('data-label') || d.getAttribute('aria-label') || d.textContent.trim();
    }
    days.forEach(function (d, i) {
      if (!d.hasAttribute('aria-selected')) d.setAttribute('aria-selected', 'false');
      d.addEventListener('click', function () { if (!d.disabled) pick(d); });
      d.addEventListener('keydown', function (e) {
        var step = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: 7, ArrowUp: -7 }[e.key];
        if (!step) return;
        e.preventDefault();
        var j = i + step;
        while (days[j] && days[j].disabled) j += step > 0 ? 1 : -1;
        if (days[j]) days[j].focus();
      });
    });
  });

  /* ── 19. 112쪽 진행 막대 ──────────────────────────── */
  var PB = { D: ['done', '조판 완료'], P: ['proof', '교정 중'], W: ['wait', '원고 대기'], A: ['ad', '광고'] };
  $$('[data-pagebar]').forEach(function (pb) {
    var cells = $('.pagebar__cells', pb);
    if (!cells) return;
    var map = pb.getAttribute('data-map');
    if (!map) {
      var n = function (k) { return parseInt(pb.getAttribute('data-' + k) || '0', 10); };
      map = new Array(n('done') + 1).join('D') + new Array(n('proof') + 1).join('P') + new Array(n('wait') + 1).join('W') + new Array(n('ad') + 1).join('A');
    }
    var html = '';
    for (var i = 0; i < map.length; i++) {
      var k = PB[map.charAt(i)] || PB.W;
      html += '<span class="pagebar__cell pagebar__cell--' + k[0] + '" title="p.' + pad3(i + 1) + ' · ' + k[1] + '"></span>';
    }
    cells.innerHTML = html;
    cells.setAttribute('aria-hidden', 'true');
  });

  /* ── 20. 쪽 번호로 가기 ───────────────────────────── */
  doc.addEventListener('submit', function (e) {
    var f = e.target.closest('[data-pager-jump]');
    if (!f) return;
    e.preventDefault();
    var input = $('input', f);
    var max = parseInt(f.getAttribute('data-max') || '112', 10);
    var n = parseInt(input && input.value, 10);
    if (!n || n < 1 || n > max) {
      if (input) input.setAttribute('aria-invalid', 'true');
      toast({ kind: 'warning', title: '없는 쪽입니다', text: '이번 호는 p.001부터 p.' + pad3(max) + '까지입니다.', folio: 'p.—' });
      return;
    }
    if (input) input.removeAttribute('aria-invalid');
    var dest = doc.getElementById('p-' + pad3(n));
    if (dest) {
      dest.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth' });
    } else {
      toast({ kind: 'info', title: 'p.' + pad3(n) + '은 인쇄본에만 실렸습니다', text: '디지털 아카이브에서 전체 지면을 볼 수 있습니다.', folio: 'p.' + pad3(n) });
    }
  });

  /* ── 21. 독자 엽서 — 검증 · 글자 수 ───────────────── */
  function fieldOf(ctrl) { return ctrl.closest('.field') || ctrl.closest('.check') || ctrl.parentNode; }
  function validate(ctrl) {
    var ok = ctrl.type === 'checkbox' ? ctrl.checked : ctrl.value.trim() !== '';
    if (ok && ctrl.type === 'email') ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(ctrl.value.trim());
    if (ok && ctrl.pattern) ok = new RegExp('^(?:' + ctrl.pattern + ')$').test(ctrl.value.trim());
    var field = fieldOf(ctrl);
    var err = field && $('.field__error', field);
    if (err) {
      var eid = ensureId(err, 'err');
      var desc = (ctrl.getAttribute('aria-describedby') || '').split(' ').filter(Boolean);
      if (desc.indexOf(eid) < 0) { desc.push(eid); ctrl.setAttribute('aria-describedby', desc.join(' ')); }
    }
    if (ok) { ctrl.removeAttribute('aria-invalid'); if (field) field.classList.remove('is-invalid'); }
    else { ctrl.setAttribute('aria-invalid', 'true'); if (field) field.classList.add('is-invalid'); }
    return ok;
  }
  $$('form[data-validate]').forEach(function (form) {
    form.setAttribute('novalidate', '');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ctrls = $$('[required]', form);
      var bad = ctrls.filter(function (c) { return !validate(c); });
      if (bad.length) {
        bad[0].focus();
        toast({ kind: 'danger', title: '빈 칸이 ' + bad.length + '곳 있습니다', text: '주홍으로 표시한 칸을 채워 주세요.', folio: form.getAttribute('data-folio') || 'p.—' });
        return;
      }
      var sub = $('[type="submit"]', form);
      if (sub) { sub.setAttribute('aria-busy', 'true'); sub.setAttribute('aria-disabled', 'true'); }
      setTimeout(function () {
        if (sub) { sub.removeAttribute('aria-busy'); sub.removeAttribute('aria-disabled'); }
        toast({
          kind: 'success',
          title: form.getAttribute('data-success-title') || '보냈습니다',
          text: form.getAttribute('data-success-text') || '',
          folio: form.getAttribute('data-folio') || 'p.—'
        });
      }, 900);
    });
    form.addEventListener('input', function (e) {
      if (e.target.getAttribute('aria-invalid') === 'true') validate(e.target);
    });
    form.addEventListener('change', function (e) {
      if (e.target.getAttribute('aria-invalid') === 'true') validate(e.target);
    });
  });
  $$('[data-count]').forEach(function (ta) {
    var out = doc.getElementById(ta.getAttribute('data-count'));
    var max = ta.getAttribute('maxlength');
    function upd() { if (out) out.textContent = ta.value.length + (max ? ' / ' + max : '') + '자'; }
    ta.addEventListener('input', upd);
    upd();
  });

  /* ── 22. 토글 단추(세그먼트 · 필터 배지) ──────────────── */
  doc.addEventListener('click', function (e) {
    var b = e.target.closest('[aria-pressed]');
    if (!b || b.disabled || b.hasAttribute('data-theme-toggle') || b.hasAttribute('data-motion-toggle') || b.hasAttribute('data-marquee-toggle')) return;
    var group = b.closest('[data-toggle-group]');
    if (group) {
      $$('[aria-pressed]', group).forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
    } else if (b.hasAttribute('data-toggle')) {
      b.setAttribute('aria-pressed', b.getAttribute('aria-pressed') === 'true' ? 'false' : 'true');
    }
  });

  /* ── 23. 복사 ─────────────────────────────────────── */
  doc.addEventListener('click', function (e) {
    var b = e.target.closest('[data-copy]');
    if (!b) return;
    var src = $(b.getAttribute('data-copy'));
    if (!src) return;
    var text = src.innerText;
    var done = function () { toast({ kind: 'success', title: '조판 지시서를 복사했습니다', text: text.split('\n').length + '줄', folio: b.getAttribute('data-toast-folio') || 'p.—' }); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, function () { toast({ kind: 'warning', title: '복사하지 못했습니다', text: '직접 선택해 복사해 주세요.' }); });
    else done();
  });

  /* ── 24. 마스트헤드 접힌 메뉴(모바일) ─────────────────── */
  function setNav(mh, open) {
    mh.classList.toggle('is-open', open);
    var b = $('[data-nav-toggle]', mh);
    if (b) {
      b.setAttribute('aria-expanded', open ? 'true' : 'false');
      b.setAttribute('aria-label', open ? '섹션 메뉴 닫기' : '섹션 메뉴 열기');
    }
  }
  doc.addEventListener('click', function (e) {
    var b = e.target.closest('[data-nav-toggle]');
    var mh = $('.masthead');
    if (!mh) return;
    if (b) { setNav(mh, !mh.classList.contains('is-open')); return; }
    if (mh.classList.contains('is-open') && (!mh.contains(e.target) || e.target.closest('.masthead__link:not([data-menu]), .masthead__pages .menu__item'))) setNav(mh, false);
  });
  window.addEventListener('resize', function () {
    var mh = $('.masthead.is-open');
    if (mh && window.innerWidth > 899) setNav(mh, false);
  });
  /* 열린 섹션 패널(≤899)은 모달처럼 다룬다: Tab은 [메뉴 단추 → 패널 안 항목들]을 돌고,
     그래도 포커스가 마스트헤드 밖으로 나가면(클릭·스크립트) 패널을 접는다 — 패널 뒤 본문에 포커스가 숨지 않게 */
  var mhNav = $('.masthead');
  if (mhNav) {
    mhNav.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab' || !mhNav.classList.contains('is-open')) return;
      var tog = $('[data-nav-toggle]', mhNav), panel = $('.masthead__nav', mhNav);
      if (!tog || !panel) return;
      var ring = [tog].concat($$('a[href], button:not([disabled])', panel).filter(function (el) { return el.offsetParent !== null; }));
      var i = ring.indexOf(doc.activeElement);
      if (i < 0) return;
      e.preventDefault();
      ring[(i + (e.shiftKey ? -1 : 1) + ring.length) % ring.length].focus();
    });
    mhNav.addEventListener('focusout', function (e) {
      if (mhNav.classList.contains('is-open') && e.relatedTarget && !mhNav.contains(e.relatedTarget)) setNav(mhNav, false);
    });
  }

  /* 공개 API */
  window.Haenggan = {
    toast: toast,
    open: function (id) { openLayer(doc.getElementById(id)); },
    close: function (id) { closeLayer(doc.getElementById(id)); },
    theme: function (t) { if (t === 'dark' || t === 'light') { store(THEME_KEY, t); applyTheme(t); } return root.getAttribute('data-theme'); }
  };
})();
