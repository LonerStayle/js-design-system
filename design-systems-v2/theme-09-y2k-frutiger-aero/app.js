/* ==========================================================================
   소다넷 sodanet · app.js — 바닐라 JS (외부 라이브러리 없음)
   테마(낮 14:20 / 밤 23:40) · 바탕화면 물방울 · 박스 등장 · 모달/드로어/내 박스 드로어
   · ⌘K 통합검색 · 탭 · 아코디언 · 토스트 · 팝오버 · 메뉴(우클릭) · 캐러셀 · 티커 · 마키
   · 소다플레이어 · 칸반 DnD/키보드 · 툴팁 Esc · 폼 검사 · 표 정렬 · 모션 다시 보기
   ========================================================================== */
(function () {
  'use strict';

  var STORE_KEY = 'sodanet-theme';
  var root = document.documentElement;
  var reduceMQ = window.matchMedia('(prefers-reduced-motion: reduce)');
  var inPages = /\/pages\//.test(location.pathname);
  var BASE = inPages ? '../' : '';

  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }
  function reduced() { return reduceMQ.matches; }
  var store = {
    get: function () { try { return localStorage.getItem(STORE_KEY); } catch (e) { return null; } },
    set: function (v) { try { localStorage.setItem(STORE_KEY, v); } catch (e) { /* 사파리 사생활 보호 등 */ } }
  };
  var FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
  function visible(el) { return !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length); }

  var ICON = {
    sun: '<svg class="icon themebtn__sun" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.2M12 19.3v2.2M4.6 4.6l1.6 1.6M17.8 17.8l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.6 19.4l1.6-1.6M17.8 6.2l1.6-1.6"/></svg>',
    close: '<svg viewBox="0 0 10 10" aria-hidden="true"><path d="M2.5 2.5l5 5M7.5 2.5l-5 5"/></svg>',
    search: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/></svg>',
    home: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 11l8-6.5 8 6.5"/><path d="M6.5 9.5V19h11V9.5"/></svg>',
    note: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 18V6l10-2v12"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="16.5" cy="16" r="2.5"/></svg>',
    skin: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="5" width="17" height="14" rx="2.5"/><path d="M3.5 15l5-4 4 3 3-2 5 4"/></svg>',
    mail: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="5.5" width="17" height="13" rx="2.5"/><path d="M4 7l8 6 8-6"/></svg>',
    page: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3.5h7l4 4V20.5H7z"/><path d="M14 3.5v4h4"/></svg>'
  };

  /* ------------------------------------------------------------------
     1. 테마 — 우선순위: ?theme= → localStorage → prefers-color-scheme
     ------------------------------------------------------------------ */
  function queryTheme() {
    try {
      var t = new URLSearchParams(location.search).get('theme');
      return t === 'dark' || t === 'light' ? t : null;
    } catch (e) { return null; }
  }
  function resolveTheme() {
    var q = queryTheme(); if (q) return q;
    var s = store.get(); if (s === 'dark' || s === 'light') return s;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    $$('[data-theme-toggle]').forEach(function (btn) {
      var night = theme === 'dark';
      btn.setAttribute('aria-pressed', String(night));
      var label = night ? '낮 스킨으로 바꾸기' : '밤 스킨으로 바꾸기';
      btn.setAttribute('aria-label', label);
      btn.setAttribute('title', label);
      var txt = $('[data-theme-label]', btn);
      if (txt) txt.textContent = night ? '낮 스킨' : '밤 스킨';
    });
  }
  applyTheme(resolveTheme());
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-theme-toggle]');
    if (!btn) return;
    var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    store.set(next); applyTheme(next);
  });
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function () {
    if (!queryTheme() && !store.get()) applyTheme(resolveTheme());
  });

  /* ------------------------------------------------------------------
     2. 바탕화면 물방울 (12개 / 390px 6개) — 결정적 배치
     ------------------------------------------------------------------ */
  function initBubbles() {
    $$('.bubbles').forEach(function (box) {
      if (box.children.length) return;
      var count = window.innerWidth < 760 ? 6 : 12;
      var xs = [6, 14, 23, 31, 42, 51, 60, 68, 76, 84, 91, 97];
      var sizes = [38, 22, 56, 18, 30, 64, 24, 44, 16, 34, 52, 20];
      for (var i = 0; i < count; i++) {
        var b = document.createElement('span');
        var k = window.innerWidth < 760 ? i * 2 : i;
        b.className = 'bubble';
        b.style.setProperty('--x', xs[k % 12] + '%');
        b.style.setProperty('--s', sizes[k % 12] + 'px');
        b.style.setProperty('--d', (14 + (k * 7) % 9) + 's');
        b.style.setProperty('--delay', (-(k * 3.1) % 18).toFixed(1) + 's');
        b.style.setProperty('--rest', (12 + (k * 13) % 60) + '%');
        box.appendChild(b);
      }
    });
  }

  /* ------------------------------------------------------------------
     3. 포털 박스 등장 — load 1회, 화면 안 최대 8개, 60ms 스태거 (스크롤 리빌 없음)
     ------------------------------------------------------------------ */
  function popBoxes() {
    if (reduced()) return;
    var vh = window.innerHeight;
    var n = 0;
    $$('[data-pop] > *, .portal__left > .box, .portal__main > .box, .portal__right > .box, .portal__right > .player').forEach(function (el) {
      if (n >= 8) return;
      var r = el.getBoundingClientRect();
      if (r.top > vh || r.bottom < 0) return;
      el.style.setProperty('--i', n++);
      el.classList.add('is-pop');
      el.addEventListener('animationend', function done() { el.classList.remove('is-pop'); el.removeEventListener('animationend', done); });
    });
  }

  /* ------------------------------------------------------------------
     4. 레이어(모달·드로어·커맨드·내 박스) — 열기/닫기 · 포커스 트랩 · Esc
     ------------------------------------------------------------------ */
  var stack = [];
  function trap(e, layer) {
    if (e.key !== 'Tab') return;
    var scope = layer.querySelector('[role="dialog"]') || layer;
    var items = $$(FOCUSABLE, scope).filter(visible);
    if (!items.length) { e.preventDefault(); return; }
    var first = items[0], last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
  function openLayer(layer, trigger) {
    if (!layer || stack.some(function (s) { return s.el === layer; })) return;
    layer.hidden = false;
    var scrim = layer.classList.contains('sidebar') ? ensureSidebarScrim() : null;
    if (scrim) { scrim.hidden = false; }
    void layer.offsetWidth; // 트랜지션 시작점 확보
    layer.classList.add('is-open');
    if (scrim) scrim.classList.add('is-open');
    if (trigger) trigger.setAttribute('aria-expanded', 'true');
    stack.push({ el: layer, trigger: trigger || document.activeElement });
    document.body.style.overflow = 'hidden';
    var target = layer.querySelector('[autofocus], .cmd__input') || $$(FOCUSABLE, layer).filter(visible)[0];
    setTimeout(function () { if (target) target.focus(); }, 30);
  }
  function closeLayer(layer) {
    var idx = -1;
    stack.forEach(function (s, i) { if (s.el === layer) idx = i; });
    if (idx < 0) return;
    var entry = stack.splice(idx, 1)[0];
    layer.classList.remove('is-open');
    var isSidebar = layer.classList.contains('sidebar');
    var scrim = isSidebar ? $('.sidebar-scrim') : null;
    if (scrim) scrim.classList.remove('is-open');
    if (entry.trigger && entry.trigger.setAttribute) entry.trigger.setAttribute('aria-expanded', 'false');
    var delay = reduced() ? 0 : 320;
    setTimeout(function () {
      if (!layer.classList.contains('is-open') && !isSidebar) layer.hidden = true;
    }, delay);
    if (!stack.length) document.body.style.overflow = '';
    if (entry.trigger && entry.trigger.focus && document.contains(entry.trigger)) entry.trigger.focus();
  }
  function topLayer() { return stack.length ? stack[stack.length - 1].el : null; }

  document.addEventListener('click', function (e) {
    var opener = e.target.closest('[data-open]');
    if (opener) {
      e.preventDefault();
      openLayer(document.getElementById(opener.getAttribute('data-open')), opener);
      return;
    }
    var closer = e.target.closest('[data-close]');
    if (closer) {
      var layer = closer.closest('.modal, .drawer, .cmd, .sidebar');
      if (layer && !layer.classList.contains('modal--static') && !layer.classList.contains('drawer--static')) { e.preventDefault(); closeLayer(layer); }
    }
  });
  document.addEventListener('keydown', function (e) {
    var layer = topLayer();
    if (!layer) return;
    if (e.key === 'Escape') { e.preventDefault(); closeLayer(layer); return; }
    trap(e, layer);
  });

  /* 내 박스(사이드바) — 760px 미만에서만 드로어 */
  function ensureSidebarScrim() {
    var s = $('.sidebar-scrim');
    if (!s) {
      s = document.createElement('div');
      s.className = 'sidebar-scrim';
      s.setAttribute('data-close', '');
      s.addEventListener('click', function () { var sb = $('.sidebar.is-open'); if (sb) closeLayer(sb); });
      document.body.appendChild(s);
    }
    return s;
  }
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-sidebar-open]');
    if (!btn) return;
    var sb = document.getElementById(btn.getAttribute('aria-controls') || 'mybox') || $('.sidebar');
    if (sb) openLayer(sb, btn);
  });
  window.addEventListener('resize', function () {
    if (window.innerWidth > 760) { var sb = $('.sidebar.is-open'); if (sb) closeLayer(sb); }
  });

  /* ------------------------------------------------------------------
     5. ⌘K 소다넷 통합검색 — #cmd 가 없으면 만든다
     ------------------------------------------------------------------ */
  var CMD_DATA = [
    { group: '홈피', items: [
      { t: '여름이 사는 물가', s: 'home.sodanet.kr/yeoreum · 한여름', href: 'pages/profile.html', orb: 'sky', icon: 'home' },
      { t: '해랑해랑의 홈피', s: 'home.sodanet.kr/haerang · 서해랑', href: 'pages/profile.html', orb: 'lime', icon: 'home' },
      { t: '내 홈피 관리', s: 'TODAY 128 · TOTAL 48,215', href: 'pages/dashboard.html', orb: 'aqua', icon: 'page' },
      { t: '홈피 설정', s: '제목 · 공개 범위 · BGM · 알림', href: 'pages/settings.html', orb: 'white', icon: 'page' },
      { t: '홈피 개설 마법사', s: '옛 홈피 불러오기 72%', href: 'pages/onboarding.html', orb: 'white', icon: 'page' }
    ] },
    { group: 'BGM', items: [
      { t: '투명한 오후 — 물빛밴드', s: 'BGM-30871 · 3:42 · 5방울', href: 'pages/dashboard.html#bgm', orb: 'amber', icon: 'note' },
      { t: '버블 레터 — 하이틴소다', s: 'BGM-30902 · 3:18 · 5방울', href: 'pages/dashboard.html#bgm', orb: 'sky', icon: 'note' },
      { t: '초록 언덕 — 윈디힐즈', s: 'BGM-29544 · 4:05 · 5방울', href: 'pages/dashboard.html#bgm', orb: 'lime', icon: 'note' }
    ] },
    { group: '스킨', items: [
      { t: '아침이슬 2026', s: 'SK-2026-0412 · 60 → 48방울', href: 'pages/product.html', orb: 'sky', icon: 'skin' },
      { t: '물방울공방 스킨 보드', s: '도윤서 · 카드 10장', href: 'pages/kanban.html', orb: 'lime', icon: 'skin' },
      { t: '방울 충전 · 이용권', s: '방울 340 · 소다 플러스', href: 'pages/pricing.html', orb: 'amber', icon: 'skin' }
    ] },
    { group: '쪽지', items: [
      { t: '토요일 홈피 파도타기 왔다감', s: '서해랑 · 10.10(토) 14:05', href: 'pages/inbox.html', orb: 'red', icon: 'mail' },
      { t: '아침이슬 스킨 리뷰 고마워요', s: '도윤서 · 10.10(토) 11:32', href: 'pages/inbox.html', orb: 'red', icon: 'mail' },
      { t: '10월 13일(화) 서버 점검 안내', s: '운영자 마루 · 10.10(토) 09:00', href: 'pages/inbox.html', orb: 'red', icon: 'mail' }
    ] }
  ];
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function buildCmd() {
    var el = document.getElementById('cmd');
    if (el) return el;
    el = document.createElement('div');
    el.className = 'cmd'; el.id = 'cmd'; el.hidden = true;
    var html = '<div class="cmd__scrim" data-close></div>' +
      '<div class="cmd__panel" role="dialog" aria-modal="true" aria-label="소다넷 통합검색">' +
      '<form class="cmd__search" role="search" data-cmd-form>' +
      '<span class="cmd__brand" aria-hidden="true">sodanet</span>' +
      '<input class="cmd__input" type="search" role="combobox" aria-expanded="true" aria-controls="cmd-list" aria-autocomplete="list" aria-label="검색어" placeholder="홈피 주소, BGM, 스킨, 쪽지 검색" autocomplete="off">' +
      '<button class="btn gel cmd__go" type="submit">검색</button></form>' +
      '<div class="cmd__box"><div class="cmd__list" id="cmd-list" role="listbox" aria-label="검색 결과">';
    CMD_DATA.forEach(function (g, gi) {
      html += '<div class="cmd__group" role="group" aria-labelledby="cmd-g' + gi + '"><div class="cmd__label" id="cmd-g' + gi + '">' + g.group + '</div>';
      g.items.forEach(function (it, ii) {
        html += '<a class="cmd__item" role="option" id="cmd-o' + gi + '-' + ii + '" href="' + BASE + it.href + '" aria-selected="false">' +
          '<span class="orb orb--' + it.orb + '">' + ICON[it.icon] + '</span>' +
          '<span class="cmd__text">' + esc(it.t) + '<small>' + esc(it.s) + '</small></span><kbd>↵</kbd></a>';
      });
      html += '</div>';
    });
    html += '</div><p class="cmd__empty" hidden></p>' +
      '<div class="cmd__foot" aria-hidden="true"><span>↑↓ 이동</span><span>↵ 열기</span><span>Esc 닫기</span></div></div></div>';
    el.innerHTML = html;
    document.body.appendChild(el);
    return el;
  }
  function initCmd(cmd) {
    var input = $('.cmd__input', cmd);
    if (!input || input.dataset.bound) return;
    input.dataset.bound = '1';
    var empty = $('.cmd__empty', cmd);
    function items() { return $$('.cmd__item', cmd).filter(function (i) { return !i.hidden; }); }
    function select(i) {
      var list = items();
      $$('.cmd__item', cmd).forEach(function (o) { o.setAttribute('aria-selected', 'false'); });
      if (!list.length) { input.removeAttribute('aria-activedescendant'); return; }
      var idx = (i + list.length) % list.length;
      list[idx].setAttribute('aria-selected', 'true');
      input.setAttribute('aria-activedescendant', list[idx].id);
      var box = list[idx].closest('.cmd__box');
      if (box) {
        var o = list[idx].offsetTop, h = list[idx].offsetHeight;
        if (o < box.scrollTop + 32) box.scrollTop = Math.max(0, o - 32);
        else if (o + h > box.scrollTop + box.clientHeight) box.scrollTop = o + h - box.clientHeight;
      }
    }
    function filter() {
      var q = input.value.trim().toLowerCase();
      $$('.cmd__group', cmd).forEach(function (g) {
        var any = false;
        $$('.cmd__item', g).forEach(function (o) {
          var hit = !q || o.textContent.toLowerCase().indexOf(q) > -1;
          o.hidden = !hit; if (hit) any = true;
        });
        g.hidden = !any;
      });
      var none = !items().length;
      if (empty) {
        empty.hidden = !none;
        if (none) empty.innerHTML = '<b>‘' + esc(input.value.trim()) + '’</b>과 일치하는 결과가 없어요. 홈피 주소는 아이디로 찾아보세요.';
      }
      select(0);
    }
    input.addEventListener('input', filter);
    input.addEventListener('keydown', function (e) {
      var list = items();
      var cur = list.findIndex(function (o) { return o.getAttribute('aria-selected') === 'true'; });
      if (e.key === 'ArrowDown') { e.preventDefault(); select(cur + 1); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); select(cur - 1); }
      else if (e.key === 'Enter') {
        e.preventDefault();
        if (cur > -1 && list[cur]) list[cur].click();
      }
    });
    cmd.addEventListener('mousemove', function (e) {
      var o = e.target.closest('.cmd__item');
      if (!o || o.getAttribute('aria-selected') === 'true') return;
      select(items().indexOf(o));
    });
    var form = $('[data-cmd-form]', cmd);
    if (form) form.addEventListener('submit', function (e) {
      e.preventDefault();
      var sel = $('.cmd__item[aria-selected="true"]', cmd);
      if (sel) sel.click();
    });
    filter();
  }
  function openCmd(trigger) {
    var cmd = buildCmd();
    initCmd(cmd);
    var input = $('.cmd__input', cmd);
    if (input) { input.value = ''; input.dispatchEvent(new Event('input')); }
    openLayer(cmd, trigger);
  }
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-command-open]');
    if (t) { e.preventDefault(); openCmd(t); }
  });
  document.addEventListener('keydown', function (e) {
    if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
      e.preventDefault();
      var cmd = document.getElementById('cmd');
      if (cmd && cmd.classList.contains('is-open')) closeLayer(cmd); else openCmd(null);
    }
  });
  /* 정적 견본(.cmd--static)도 실제로 거른다 */
  function initStaticCmd() { $$('.cmd--static').forEach(initCmd); }

  /* ------------------------------------------------------------------
     6. 탭 — [role=tablist] 안 [role=tab] · 화살표/Home/End
     ------------------------------------------------------------------ */
  function selectTab(tab, focus) {
    var list = tab.closest('[role="tablist"]');
    $$('[role="tab"]', list).forEach(function (t) {
      var on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      var p = document.getElementById(t.getAttribute('aria-controls'));
      if (p) p.hidden = !on;
    });
    if (focus) tab.focus();
    list.dispatchEvent(new CustomEvent('sodanet:tab', { bubbles: true, detail: { tab: tab } }));
  }
  function initTabs() {
    $$('[role="tablist"]').forEach(function (list) {
      var tabs = $$('[role="tab"]', list);
      tabs.forEach(function (t) { t.tabIndex = t.getAttribute('aria-selected') === 'true' ? 0 : -1; });
      list.addEventListener('click', function (e) {
        var t = e.target.closest('[role="tab"]');
        if (t && !t.disabled) selectTab(t, false);
      });
      list.addEventListener('keydown', function (e) {
        var cur = tabs.indexOf(document.activeElement);
        if (cur < 0) return;
        var next = null;
        if (e.key === 'ArrowRight') next = tabs[(cur + 1) % tabs.length];
        else if (e.key === 'ArrowLeft') next = tabs[(cur - 1 + tabs.length) % tabs.length];
        else if (e.key === 'Home') next = tabs[0];
        else if (e.key === 'End') next = tabs[tabs.length - 1];
        if (next) { e.preventDefault(); selectTab(next, true); }
      });
    });
  }
  /* 가로 스크롤 페이드 힌트: 끝에 닿으면 숨김 */
  function initFadeX() {
    $$('.fade-x').forEach(function (wrap) {
      var sc = $('.fade-x__scroll', wrap);
      if (!sc) return;
      function check() {
        wrap.classList.toggle('is-end', sc.scrollLeft + sc.clientWidth >= sc.scrollWidth - 2);
        wrap.classList.toggle('is-scrolled', sc.scrollLeft > 2); /* 왼쪽에도 잘린 탭이 있으면 왼쪽 페이드 */
      }
      sc.addEventListener('scroll', check, { passive: true });
      window.addEventListener('resize', check);
      check();
      var cur = $('[aria-current="page"], [aria-selected="true"]', sc);
      if (cur && sc.scrollWidth > sc.clientWidth) { sc.scrollLeft = Math.max(0, cur.offsetLeft - 24); check(); }
    });
  }

  /* ------------------------------------------------------------------
     7. 아코디언 — button.acc__head[aria-expanded][aria-controls]
     ------------------------------------------------------------------ */
  document.addEventListener('click', function (e) {
    var head = e.target.closest('.acc__head');
    if (!head) return;
    var item = head.closest('.acc__item');
    var open = head.getAttribute('aria-expanded') !== 'true';
    var acc = head.closest('.acc');
    if (open && acc && acc.hasAttribute('data-single')) {
      $$('.acc__head[aria-expanded="true"]', acc).forEach(function (h) {
        h.setAttribute('aria-expanded', 'false'); h.closest('.acc__item').classList.remove('is-open');
      });
    }
    head.setAttribute('aria-expanded', String(open));
    if (item) item.classList.toggle('is-open', open);
  });

  /* ------------------------------------------------------------------
     8. 토스트 "띠링" — [data-toast] 또는 window.sodanet.toast({...})
     ------------------------------------------------------------------ */
  function toastStack() {
    var s = $('.toast-stack');
    if (!s) {
      s = document.createElement('div');
      s.className = 'toast-stack';
      s.setAttribute('role', 'status');
      s.setAttribute('aria-live', 'polite');
      document.body.appendChild(s);
    }
    return s;
  }
  function dismissToast(t) {
    if (!t || t.classList.contains('is-leaving')) return;
    t.classList.add('is-leaving');
    setTimeout(function () { t.remove(); }, reduced() ? 0 : 360);
  }
  function toast(opt) {
    opt = opt || {};
    var t = document.createElement('div');
    t.className = 'toast window';
    t.innerHTML =
      '<div class="window__bar gel gel--bar"><span class="window__title">' + esc(opt.title || '소다넷 알림') + '</span>' +
      '<div class="window__ctrls"><button class="winbtn winbtn--close" type="button" aria-label="알림 닫기"><span class="winbtn__dot">' + ICON.close + '</span></button></div></div>' +
      '<div class="toast__body"><span class="orb orb--' + (opt.tone || 'sky') + '" aria-hidden="true">' + esc(opt.from || '소') + '</span>' +
      '<p class="toast__msg">' + esc(opt.text || '') + (opt.time ? '<span class="toast__time">' + esc(opt.time) + '</span>' : '') + '</p></div>';
    toastStack().appendChild(t);
    $('.winbtn', t).addEventListener('click', function () { dismissToast(t); });
    var timer = setTimeout(function () { dismissToast(t); }, 4500);
    t.addEventListener('mouseenter', function () { clearTimeout(timer); });
    t.addEventListener('mouseleave', function () { timer = setTimeout(function () { dismissToast(t); }, 2000); });
    return t;
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-toast]');
    if (!b) return;
    toast({ title: b.dataset.toastTitle, text: b.dataset.toast, from: b.dataset.toastFrom, tone: b.dataset.toastTone, time: b.dataset.toastTime });
  });

  /* ------------------------------------------------------------------
     9. 팝오버 · 메뉴(더보기/우클릭) — 바깥 클릭 · Esc 로 닫힘
     ------------------------------------------------------------------ */
  var openFloat = null; // { el, trigger }
  function closeFloat(restore) {
    if (!openFloat) return;
    openFloat.el.hidden = true;
    if (openFloat.trigger) openFloat.trigger.setAttribute('aria-expanded', 'false');
    if (restore && openFloat.trigger) openFloat.trigger.focus();
    openFloat = null;
  }
  function openFloating(el, trigger, focusFirst) {
    closeFloat(false);
    el.hidden = false;
    if (trigger) trigger.setAttribute('aria-expanded', 'true');
    openFloat = { el: el, trigger: trigger };
    if (focusFirst) {
      var f = el.getAttribute('role') === 'menu' ? $('[role="menuitem"]', el) : $$(FOCUSABLE, el)[0];
      if (f) f.focus();
    }
  }
  document.addEventListener('click', function (e) {
    var pt = e.target.closest('[data-popover]');
    var mt = e.target.closest('[data-menu]');
    var t = pt || mt;
    if (t) {
      e.preventDefault();
      var el = document.getElementById(t.getAttribute(pt ? 'data-popover' : 'data-menu'));
      if (!el) return;
      if (openFloat && openFloat.el === el) { closeFloat(false); return; }
      el.classList.remove('menu--fixed'); el.style.left = ''; el.style.top = '';
      openFloating(el, t, !!mt && e.detail === 0);
      return;
    }
    if (openFloat && !openFloat.el.contains(e.target)) closeFloat(false);
    else if (openFloat && e.target.closest('[role="menuitem"]')) closeFloat(true);
  });
  document.addEventListener('contextmenu', function (e) {
    var row = e.target.closest('[data-contextmenu]');
    if (!row) return;
    var menu = document.getElementById(row.getAttribute('data-contextmenu'));
    if (!menu) return;
    e.preventDefault();
    menu.classList.add('menu--fixed');
    openFloating(menu, null, false);
    var w = menu.offsetWidth, h = menu.offsetHeight;
    menu.style.left = Math.min(e.clientX, window.innerWidth - w - 8) + 'px';
    menu.style.top = Math.min(e.clientY, window.innerHeight - h - 8) + 'px';
    var first = $('[role="menuitem"]', menu); if (first) first.focus();
  });
  document.addEventListener('keydown', function (e) {
    if (!openFloat) return;
    if (e.key === 'Escape') { e.preventDefault(); closeFloat(true); return; }
    if (openFloat.el.getAttribute('role') !== 'menu') return;
    var items = $$('[role="menuitem"]:not([aria-disabled="true"])', openFloat.el);
    var cur = items.indexOf(document.activeElement);
    if (e.key === 'ArrowDown') { e.preventDefault(); items[(cur + 1) % items.length].focus(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); items[(cur - 1 + items.length) % items.length].focus(); }
    else if (e.key === 'Home') { e.preventDefault(); items[0].focus(); }
    else if (e.key === 'End') { e.preventDefault(); items[items.length - 1].focus(); }
    else if (e.key === 'Tab') { closeFloat(false); }
  });

  /* 툴팁: Esc 로 숨김(WCAG 1.4.13) */
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    $$('.tip').forEach(function (t) { if (t.matches(':hover, :focus-within')) t.classList.add('is-dismissed'); });
  });
  document.addEventListener('mouseout', function (e) { var t = e.target.closest && e.target.closest('.tip'); if (t && !t.contains(e.relatedTarget)) t.classList.remove('is-dismissed'); });
  document.addEventListener('focusout', function (e) { var t = e.target.closest && e.target.closest('.tip'); if (t) t.classList.remove('is-dismissed'); });

  /* ------------------------------------------------------------------
     10. 캐러셀 — 자동 6s, 호버/포커스/감속 모션 시 정지, 정지 버튼
     ------------------------------------------------------------------ */
  function initCarousels() {
    $$('[data-carousel]').forEach(function (car) {
      var track = $('.carousel__track', car);
      var slides = $$('.carousel__slide', car);
      var dots = $$('.carousel__dot', car);
      var pauseBtn = $('[data-carousel-pause]', car);
      var i = 0, timer = null, userPaused = reduced(), hovering = false;
      function go(n) {
        i = (n + slides.length) % slides.length;
        track.style.transform = 'translateX(' + (-100 * i) + '%)';
        slides.forEach(function (s, k) {
          s.setAttribute('aria-hidden', String(k !== i));
          $$(FOCUSABLE, s).forEach(function (f) { f.tabIndex = k === i ? 0 : -1; });
        });
        dots.forEach(function (d, k) { d.setAttribute('aria-current', String(k === i)); });
      }
      function tick() { stop(); if (!userPaused && !hovering) timer = setTimeout(function () { go(i + 1); tick(); }, 6000); }
      function stop() { clearTimeout(timer); }
      function syncPause() {
        if (!pauseBtn) return;
        pauseBtn.setAttribute('aria-pressed', String(userPaused));
        pauseBtn.setAttribute('aria-label', userPaused ? '자동 넘김 다시 시작' : '자동 넘김 멈추기');
      }
      var prev = $('[data-carousel-prev]', car), next = $('[data-carousel-next]', car);
      if (prev) prev.addEventListener('click', function () { go(i - 1); tick(); });
      if (next) next.addEventListener('click', function () { go(i + 1); tick(); });
      dots.forEach(function (d, k) { d.addEventListener('click', function () { go(k); tick(); }); });
      if (pauseBtn) pauseBtn.addEventListener('click', function () { userPaused = !userPaused; syncPause(); tick(); });
      car.addEventListener('mouseenter', function () { hovering = true; stop(); });
      car.addEventListener('mouseleave', function () { hovering = false; tick(); });
      car.addEventListener('focusin', function () { hovering = true; stop(); });
      car.addEventListener('focusout', function (e) { if (!car.contains(e.relatedTarget)) { hovering = false; tick(); } });
      car.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight') { go(i + 1); } else if (e.key === 'ArrowLeft') { go(i - 1); }
      });
      go(0); syncPause(); tick();
    });
  }

  /* ------------------------------------------------------------------
     11. 실시간 검색어 티커 — 3s 마다 한 줄, 호버·포커스 정지, 펼치기
     ------------------------------------------------------------------ */
  function initTickers() {
    $$('[data-ticker]').forEach(function (tk) {
      var list = $('.ticker__window .plist', tk);
      var rows = list ? list.children.length : 0;
      var i = 0, timer = null, hold = false;
      var toggle = $('[data-ticker-toggle]', tk);
      function step() {
        clearTimeout(timer);
        if (reduced() || tk.classList.contains('is-open')) return;
        timer = setTimeout(function () {
          if (!hold) {
            var h = list.firstElementChild ? list.firstElementChild.offsetHeight : 44;
            /* 창이 여러 줄을 보여 주면(넓은 화면 index 5줄) 마지막 줄이 창 바닥에 닿을 때까지만 굴린다 */
            var vis = Math.max(1, Math.round(list.parentElement.clientHeight / h));
            i = (i + 1) % Math.max(1, rows - vis + 1);
            list.style.transform = 'translateY(' + (-h * i) + 'px)';
          }
          step();
        }, 3000);
      }
      tk.addEventListener('mouseenter', function () { hold = true; });
      tk.addEventListener('mouseleave', function () { hold = false; });
      tk.addEventListener('focusin', function () { hold = true; });
      tk.addEventListener('focusout', function () { hold = false; });
      if (toggle) toggle.addEventListener('click', function () {
        var open = !tk.classList.contains('is-open');
        tk.classList.toggle('is-open', open);
        toggle.setAttribute('aria-expanded', String(open));
        var lbl = $('[data-ticker-label]', toggle);
        if (lbl) lbl.textContent = open ? '접기' : '1~10위 펼치기';
        if (!open) { list.style.transform = 'translateY(' + (-(list.firstElementChild ? list.firstElementChild.offsetHeight : 44) * i) + 'px)'; }
        step();
      });
      if (rows > 1) step();
    });
  }

  /* 12. 공지 마키 — 트랙 복제로 이음매 없이 */
  function initMarquees() {
    $$('[data-marquee]').forEach(function (m) {
      var track = $('.marquee__track', m);
      if (!track || track.dataset.cloned) return;
      track.dataset.cloned = '1';
      $$('.marquee__item', track).forEach(function (it) {
        var c = it.cloneNode(true);
        c.setAttribute('aria-hidden', 'true');
        $$('a, button', c).forEach(function (a) { a.tabIndex = -1; });
        track.appendChild(c);
      });
      var w = track.scrollWidth / 2;
      track.style.setProperty('--marquee-dur', Math.max(20, Math.round(w / 60)) + 's');
      var pb = $('[data-marquee-pause]', m);
      if (pb) pb.addEventListener('click', function () {
        var p = !m.classList.contains('is-paused');
        m.classList.toggle('is-paused', p);
        pb.setAttribute('aria-pressed', String(p));
        pb.setAttribute('aria-label', p ? '공지 흐름 다시 시작' : '공지 흐름 멈추기');
      });
    });
  }

  /* ------------------------------------------------------------------
     13. 소다플레이어 — 재생/일시정지 · 이전/다음 · 볼륨 · 재생목록
     ------------------------------------------------------------------ */
  function toSec(t) { var p = String(t).split(':'); return (+p[0]) * 60 + (+p[1]); }
  function toTime(s) { var m = Math.floor(s / 60), r = Math.floor(s % 60); return (m < 10 ? '0' : '') + m + ':' + (r < 10 ? '0' : '') + r; }
  function initPlayers() {
    $$('[data-player]').forEach(function (pl) {
      var tracks = $$('.player__track', pl);
      var titleEl = $('[data-player-title]', pl);
      var nowEl = $('[data-player-now]', pl);
      var lenEl = $('[data-player-len]', pl);
      var seek = $('.player__seek > span', pl);
      var toggle = $('[data-player-toggle]', pl);
      var state = $('.player__state', pl);
      var vol = $('[data-player-volume]', pl);
      var cur = Math.max(0, tracks.findIndex(function (t) { return t.getAttribute('aria-current') === 'true'; }));
      var pos = nowEl ? toSec(nowEl.textContent) : 0;
      var len = lenEl ? toSec(lenEl.textContent) : 222;
      var timer = null;
      var titleBox = titleEl && titleEl.parentElement;
      /* 곡명이 LCD 칸보다 길 때만 왕복 마키. 거리 = 넘친 폭, 속도 ≈ 28px/s */
      function fitTitle() {
        if (!titleBox) return;
        titleBox.classList.remove('is-overflow');
        var over = titleEl.scrollWidth - titleBox.clientWidth;
        if (over > 4) {
          titleBox.classList.add('is-overflow');
          titleBox.style.setProperty('--mq-dist', -(over + 6) + 'px');
          titleBox.style.setProperty('--mq-dur', Math.max(4, Math.round((over + 6) / 28 / .64 * 10) / 10) + 's');
        }
      }
      function render() {
        if (nowEl) nowEl.textContent = toTime(pos);
        if (lenEl) lenEl.textContent = toTime(len);
        if (seek) seek.style.setProperty('--val', (pos / len * 100).toFixed(1) + '%');
      }
      /* 자동 재생(data-autoplay)은 '재생 중' 모습으로 열리지만, 시계는 사용자가 처음 화면을 누르거나
         키를 칠 때까지 01:27 에 멈춰 있다(브라우저 자동 재생 정책 고증 + 팩트 시트 시각 고정). */
      var held = pl.hasAttribute('data-autoplay');
      function tick() { timer = setInterval(function () { pos += 1; if (pos >= len) { load(cur + 1, true); } render(); }, 1000); }
      function setPlaying(on) {
        pl.classList.toggle('is-playing', on);
        if (toggle) { toggle.setAttribute('aria-pressed', String(on)); toggle.setAttribute('aria-label', on ? '일시정지' : '재생'); }
        if (state) state.textContent = on ? '재생 중 · 반복' : '일시정지';
        clearInterval(timer);
        if (on && !held) tick();
      }
      if (held) {
        var wake = function () {
          if (!held) return; held = false;
          document.removeEventListener('pointerdown', wake, true); document.removeEventListener('keydown', wake, true);
          if (pl.classList.contains('is-playing')) { clearInterval(timer); tick(); }
        };
        document.addEventListener('pointerdown', wake, true); document.addEventListener('keydown', wake, true);
      }
      function load(n, keepPlaying) {
        if (!tracks.length) return;
        cur = (n + tracks.length) % tracks.length;
        var t = tracks[cur];
        tracks.forEach(function (x) { x.setAttribute('aria-current', String(x === t)); });
        if (titleEl) titleEl.textContent = t.dataset.title + ' — ' + t.dataset.artist;
        fitTitle();
        len = toSec(t.dataset.len || '3:30'); pos = 0; render();
        setPlaying(keepPlaying !== false);
      }
      if (toggle) toggle.addEventListener('click', function () { setPlaying(!pl.classList.contains('is-playing')); });
      var prev = $('[data-player-prev]', pl), next = $('[data-player-next]', pl);
      if (prev) prev.addEventListener('click', function () { load(cur - 1); });
      if (next) next.addEventListener('click', function () { load(cur + 1); });
      tracks.forEach(function (t, k) { t.addEventListener('click', function () { load(k); }); });
      if (vol) {
        var sync = function () { vol.style.setProperty('--val', vol.value + '%'); vol.setAttribute('aria-valuetext', '볼륨 ' + vol.value); };
        vol.addEventListener('input', sync); sync();
      }
      render();
      fitTitle();
      window.addEventListener('resize', fitTitle);
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitTitle);
      setPlaying(pl.hasAttribute('data-autoplay') ? !reduced() : pl.classList.contains('is-playing'));
    });
  }
  /* 슬라이더 공통 --val 동기화 */
  function initRanges() {
    $$('input.range').forEach(function (r) {
      if (r.hasAttribute('data-player-volume')) return;
      var sync = function () { var p = (r.value - (r.min || 0)) / ((r.max || 100) - (r.min || 0)) * 100; r.style.setProperty('--val', p + '%'); };
      r.addEventListener('input', sync); sync();
    });
  }

  /* ------------------------------------------------------------------
     14. 칸반 — HTML5 DnD + 키보드(Space/Enter 잡기 · ←→ 열 · ↑↓ 순서 · Esc 취소)
     ------------------------------------------------------------------ */
  function initKanban() {
    $$('[data-kanban]').forEach(function (board) {
      var live = $('.kanban__live', board);
      if (!live) {
        live = document.createElement('p');
        live.className = 'kanban__live sr-only'; live.setAttribute('aria-live', 'assertive');
        board.appendChild(live);
      }
      var lists = function () { return $$('.kanban__list', board); };
      function colName(list) { var c = list.closest('.kanban__col'); var h = c && $('.kanban__name', c); return h ? h.textContent.trim() : ''; }
      function updateCounts() {
        $$('.kanban__col', board).forEach(function (c) {
          /* 미니 보드는 대표 카드만 보여 주고 나머지는 '외 n장'(data-more)으로 센다 */
          var n = $$('.kcard', c).length + (parseInt(c.getAttribute('data-more'), 10) || 0);
          var b = $('.kanban__count', c); if (b) b.textContent = n;
        });
      }
      function bounce(card) { card.classList.remove('is-dropped'); void card.offsetWidth; card.classList.add('is-dropped'); }
      var dragging = null;
      board.addEventListener('dragstart', function (e) {
        var card = e.target.closest('.kcard'); if (!card) return;
        dragging = card; card.classList.add('is-dragging');
        e.dataTransfer.effectAllowed = 'move';
        try { e.dataTransfer.setData('text/plain', card.id || 'card'); } catch (err) { /* noop */ }
      });
      board.addEventListener('dragend', function () {
        if (!dragging) return;
        dragging.classList.remove('is-dragging');
        lists().forEach(function (l) { l.classList.remove('is-over'); });
        bounce(dragging); updateCounts();
        live.textContent = (($('.kcard__title', dragging) || dragging).textContent.trim()) + ' 카드를 ' + colName(dragging.parentElement) + ' 열에 놓았어요.';
        dragging = null;
      });
      board.addEventListener('dragover', function (e) {
        var list = e.target.closest('.kanban__list'); if (!list || !dragging) return;
        e.preventDefault();
        lists().forEach(function (l) { l.classList.toggle('is-over', l === list); });
        var after = $$('.kcard:not(.is-dragging)', list).find(function (c) {
          var r = c.getBoundingClientRect(); return e.clientY < r.top + r.height / 2;
        });
        if (after) list.insertBefore(dragging, after); else list.appendChild(dragging);
      });
      board.addEventListener('drop', function (e) { if (e.target.closest('.kanban__list')) e.preventDefault(); });

      var grabbed = null, origin = null;
      board.addEventListener('keydown', function (e) {
        var card = e.target.closest('.kcard'); if (!card) return;
        var title = (($('.kcard__title', card) || card).textContent || '').trim();
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          if (grabbed === card) {
            card.classList.remove('is-grabbed'); card.setAttribute('aria-pressed', 'false'); bounce(card); grabbed = null; updateCounts();
            live.textContent = title + ' 카드를 ' + colName(card.parentElement) + ' 열에 놓았어요.';
          } else {
            if (grabbed) grabbed.classList.remove('is-grabbed');
            grabbed = card; origin = { list: card.parentElement, next: card.nextElementSibling };
            card.classList.add('is-grabbed'); card.setAttribute('aria-pressed', 'true');
            live.textContent = title + ' 카드를 잡았어요. 좌우 화살표로 열을, 위아래로 순서를 옮기고 스페이스로 놓아요. Esc 는 취소.';
          }
          return;
        }
        if (grabbed !== card) return;
        var ls = lists(), li = ls.indexOf(card.parentElement);
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
          e.preventDefault();
          var target = ls[li + (e.key === 'ArrowRight' ? 1 : -1)];
          if (target) { target.appendChild(card); card.focus(); live.textContent = colName(target) + ' 열'; }
        } else if (e.key === 'ArrowUp' && card.previousElementSibling) {
          e.preventDefault(); card.parentElement.insertBefore(card, card.previousElementSibling); card.focus();
        } else if (e.key === 'ArrowDown' && card.nextElementSibling) {
          e.preventDefault(); card.parentElement.insertBefore(card.nextElementSibling, card); card.focus();
        } else if (e.key === 'Escape') {
          e.preventDefault();
          origin.list.insertBefore(card, origin.next);
          card.classList.remove('is-grabbed'); card.setAttribute('aria-pressed', 'false'); card.focus(); grabbed = null;
          live.textContent = '옮기기를 취소했어요.';
        }
      });
      updateCounts();
    });
  }

  /* ------------------------------------------------------------------
     15. 폼 검사 — form[data-validate] : required · pattern · minlength
     ------------------------------------------------------------------ */
  function fieldError(input) {
    var f = input.closest('.field'); if (!f) return null;
    var err = $('.field__error', f);
    if (!err) {
      err = document.createElement('p'); err.className = 'field__error'; err.id = (input.id || 'f' + Math.random().toString(36).slice(2, 7)) + '-err';
      err.hidden = true; f.appendChild(err);
    }
    return err;
  }
  function validate(input) {
    var err = fieldError(input); if (!err) return true;
    var ok = input.checkValidity();
    input.setAttribute('aria-invalid', String(!ok));
    var ids = (input.getAttribute('aria-describedby') || '').split(' ').filter(function (x) { return x && x !== err.id; });
    if (!ok) { err.textContent = input.dataset.error || input.validationMessage; err.hidden = false; ids.push(err.id); }
    else { err.hidden = true; input.removeAttribute('aria-invalid'); }
    if (ids.length) input.setAttribute('aria-describedby', ids.join(' ')); else input.removeAttribute('aria-describedby');
    return ok;
  }
  function initForms() {
    $$('form[data-validate]').forEach(function (form) {
      form.noValidate = true;
      $$('input, select, textarea', form).forEach(function (i) {
        i.addEventListener('blur', function () { if (i.value || i.hasAttribute('aria-invalid')) validate(i); });
        i.addEventListener('input', function () { if (i.getAttribute('aria-invalid') === 'true') validate(i); });
      });
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var bad = $$('input, select, textarea', form).filter(function (i) { return !validate(i); });
        if (bad.length) { bad[0].focus(); return; }
        var btn = $('[type="submit"]', form);
        if (btn) {
          btn.setAttribute('aria-busy', 'true');
          setTimeout(function () {
            btn.removeAttribute('aria-busy');
            toast({ title: '소다넷 알림', text: form.dataset.success || '저장했어요.', from: '소', tone: 'lime' });
          }, reduced() ? 0 : 1200);
        }
      });
    });
  }

  /* 16. 로딩 버튼 시연 · 복사 · 페이지 번호 · 달력 선택 */
  document.addEventListener('click', function (e) {
    var lb = e.target.closest('[data-loading-demo]');
    if (lb && lb.getAttribute('aria-busy') !== 'true') {
      lb.setAttribute('aria-busy', 'true');
      setTimeout(function () { lb.removeAttribute('aria-busy'); }, 1600);
    }
    var cp = e.target.closest('[data-copy]');
    if (cp) {
      var src = document.getElementById(cp.getAttribute('data-copy'));
      var text = src ? src.innerText : '';
      var done = function () { toast({ text: '코드를 복사했어요. 내 홈피 꾸미기 창에 붙여 넣어 보세요.', from: '소', tone: 'aqua' }); };
      if (navigator.clipboard) navigator.clipboard.writeText(text).then(done, done); else done();
    }
    var pg = e.target.closest('.pager__btn[data-page]');
    if (pg) {
      e.preventDefault();
      $$('.pager__btn[data-page]', pg.closest('.pager')).forEach(function (b) { b.removeAttribute('aria-current'); });
      pg.setAttribute('aria-current', 'page');
    }
    var day = e.target.closest('.cal__day:not(:disabled)');
    if (day) {
      $$('.cal__day[aria-pressed="true"]', day.closest('.cal')).forEach(function (d) { d.setAttribute('aria-pressed', 'false'); });
      day.setAttribute('aria-pressed', 'true');
    }
    var rp = e.target.closest('[data-replay]');
    if (rp) {
      var tgt = document.getElementById(rp.getAttribute('data-replay'));
      if (tgt && !reduced()) { tgt.classList.remove('is-playing'); void tgt.offsetWidth; tgt.classList.add('is-playing'); }
    }
  });

  /* 17. 표 정렬 — table[data-sortable] th[aria-sort] > button.tbl__sort (data-type="num") */
  function initSort() {
    $$('table[data-sortable]').forEach(function (tbl) {
      $$('th .tbl__sort', tbl).forEach(function (btn) {
        btn.addEventListener('click', function () {
          var th = btn.closest('th');
          var idx = Array.prototype.indexOf.call(th.parentElement.children, th);
          var dir = th.getAttribute('aria-sort') === 'ascending' ? 'descending' : 'ascending';
          $$('th[aria-sort]', tbl).forEach(function (h) { h.setAttribute('aria-sort', 'none'); });
          th.setAttribute('aria-sort', dir);
          var num = th.dataset.type === 'num';
          var body = tbl.tBodies[0];
          var rows = Array.prototype.slice.call(body.rows);
          rows.sort(function (a, b) {
            var x = a.cells[idx].dataset.value || a.cells[idx].textContent.trim();
            var y = b.cells[idx].dataset.value || b.cells[idx].textContent.trim();
            if (num) { x = parseFloat(String(x).replace(/[^\d.-]/g, '')) || 0; y = parseFloat(String(y).replace(/[^\d.-]/g, '')) || 0; }
            var r = num ? x - y : String(x).localeCompare(String(y), 'ko');
            return dir === 'ascending' ? r : -r;
          });
          rows.forEach(function (r) { body.appendChild(r); });
        });
      });
    });
  }

  /* ------------------------------------------------------------------
     부팅
     ------------------------------------------------------------------ */
  function boot() {
    applyTheme(root.getAttribute('data-theme') || resolveTheme());
    initBubbles();
    initTabs();
    initFadeX();
    initCarousels();
    initTickers();
    initMarquees();
    initPlayers();
    initRanges();
    initKanban();
    initForms();
    initSort();
    initStaticCmd();
    if ($('.player:not(.player--mini)') || $('.player--mini')) document.body.classList.add('has-dock');
    /* 데스크톱에서도 화면 아래 띠로 붙는 미니 플레이어(프로필 책 안의 것은 제외) */
    if ($('.player--mini:not(.mh-bgm .player--mini)')) document.body.classList.add('has-mini-dock');
    requestAnimationFrame(popBoxes);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();

  window.sodanet = {
    toast: toast,
    setTheme: function (t) { store.set(t); applyTheme(t); },
    openCommand: function () { openCmd(null); },
    open: function (id) { openLayer(document.getElementById(id)); },
    close: function (id) { closeLayer(document.getElementById(id)); }
  };
})();
