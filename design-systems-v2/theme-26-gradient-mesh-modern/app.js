/* gyeol · app.js — 결 3.0 키노트 디자인 시스템 인터랙션 (바닐라, 외부 라이브러리 없음)
   API: window.gy = { init, open, close, toast, setTheme, toggleTheme, setMood, setStep, icon, hydrateIcons, moods }
   이벤트(버블링 CustomEvent): gy:theme gy:mood gy:open gy:close gy:tab gy:toast gy:page gy:date gy:step gy:kanban-move
                              gy:sort gy:select gy:submit gy:restore gy:player gy:scene gy:carousel */
(function () {
  'use strict';

  var doc = document;
  var root = doc.documentElement;
  var KEY = 'gy-theme';
  var reduceMQ = window.matchMedia('(prefers-reduced-motion: reduce)');
  var darkMQ = window.matchMedia('(prefers-color-scheme: dark)');
  root.classList.add('js');

  function $(s, c) { return (c || doc).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || doc).querySelectorAll(s)); }
  function emit(el, name, detail) { (el || doc).dispatchEvent(new CustomEvent('gy:' + name, { bubbles: true, detail: detail || {} })); }
  function reduced() { return reduceMQ.matches; }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function pad2(n) { return (n < 10 ? '0' : '') + n; }
  function fmtTime(sec) { sec = Math.max(0, Math.round(sec)); return Math.floor(sec / 60) + ':' + pad2(sec % 60); }
  function fmtNum(n) { return Math.round(n).toLocaleString('ko-KR'); }
  var uid = 0;
  function ensureId(el, prefix) { if (!el.id) el.id = (prefix || 'gy') + '-' + (++uid); return el.id; }

  /* ───────────── 무드 ───────────── */
  var MOODS = {
    '001': { name: '첫 소절', note: '브랜드 기본' },
    '014': { name: '새벽 수영장', note: '청량' },
    '037': { name: '첫눈 오는 밤', note: '고요' },
    '062': { name: '편의점 형광등', note: '야간' },
    '090': { name: '귤 까는 겨울', note: '온기' }
  };

  /* ───────────── 아이콘 (24 그리드, 1.75 선, currentColor) ───────────── */
  var F = ' fill="currentColor" stroke="none"';
  var ICONS = {
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M2.5 12h2M19.5 12h2M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"/>',
    moon: '<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>',
    close: '<path d="M6 6l12 12M18 6 6 18"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    'chevron-left': '<path d="m15 6-6 6 6 6"/>',
    'chevron-right': '<path d="m9 6 6 6-6 6"/>',
    'chevron-down': '<path d="m6 9 6 6 6-6"/>',
    'chevron-up': '<path d="m6 15 6-6 6 6"/>',
    'arrow-left': '<path d="M19 12H5M11 6l-6 6 6 6"/>',
    'arrow-right': '<path d="M5 12h14M13 6l6 6-6 6"/>',
    'arrow-up-right': '<path d="M7 17 17 7M8 7h9v9"/>',
    check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    minus: '<path d="M5 12h14"/>',
    more: '<circle cx="5.5" cy="12" r="1.4"' + F + '/><circle cx="12" cy="12" r="1.4"' + F + '/><circle cx="18.5" cy="12" r="1.4"' + F + '/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5.5M12 7.6v.4"/>',
    alert: '<path d="M12 3.8 2.8 19.6h18.4z"/><path d="M12 10v4.2M12 17v.4"/>',
    'x-circle': '<circle cx="12" cy="12" r="9"/><path d="m9 9 6 6M15 9l-6 6"/>',
    'check-circle': '<circle cx="12" cy="12" r="9"/><path d="m8 12.5 3 3 5-6"/>',
    copy: '<rect x="8.5" y="8.5" width="11.5" height="11.5" rx="2.5"/><path d="M15.5 8.5V6.5a2 2 0 0 0-2-2h-7a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h2"/>',
    play: '<path d="M7.5 4.8v14.4a.8.8 0 0 0 1.2.7l11.6-7.2a.8.8 0 0 0 0-1.4L8.7 4.1a.8.8 0 0 0-1.2.7z"' + F + '/>',
    pause: '<rect x="6" y="4.5" width="4.2" height="15" rx="1.2"' + F + '/><rect x="13.8" y="4.5" width="4.2" height="15" rx="1.2"' + F + '/>',
    prev: '<path d="M18.5 5.6v12.8a.8.8 0 0 1-1.2.7L8 12.7a.8.8 0 0 1 0-1.4l9.3-6.4a.8.8 0 0 1 1.2.7z"' + F + '/><path d="M5.5 5v14"/>',
    next: '<path d="M5.5 5.6v12.8a.8.8 0 0 0 1.2.7l9.3-6.4a.8.8 0 0 0 0-1.4L6.7 4.9a.8.8 0 0 0-1.2.7z"' + F + '/><path d="M18.5 5v14"/>',
    shuffle: '<path d="M16 4h4v4M4 20 20 4M20 16v4h-4M15 15l5 5M4 4l5 5"/>',
    repeat: '<path d="m17 2.5 3 3-3 3"/><path d="M4 11V9.5a4 4 0 0 1 4-4h12"/><path d="m7 21.5-3-3 3-3"/><path d="M20 13v1.5a4 4 0 0 1-4 4H4"/>',
    volume: '<path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="M15.5 9a4 4 0 0 1 0 6M18.2 6.5a7.5 7.5 0 0 1 0 11"/>',
    'volume-x': '<path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="m16 10 4 4M20 10l-4 4"/>',
    heart: '<path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.2a4.3 4.3 0 0 1 7.5 2.6C19.5 15.4 12 20 12 20z"/>',
    'heart-fill': '<path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.2a4.3 4.3 0 0 1 7.5 2.6C19.5 15.4 12 20 12 20z"' + F + '/>',
    queue: '<path d="M4 6h12M4 12h12M4 18h7"/><path d="M15.5 14.5v6.5l5-3.25z"' + F + '/>',
    bell: '<path d="M6 16v-5a6 6 0 0 1 12 0v5l1.5 2h-15z"/><path d="M10 20.5a2 2 0 0 0 4 0"/>',
    inbox: '<path d="M3.5 13 6 5.5h12l2.5 7.5v5.5h-17z"/><path d="M3.5 13H9l1 2.5h4l1-2.5h5.5"/>',
    columns: '<rect x="3.5" y="4" width="17" height="16" rx="2.5"/><path d="M9.2 4v16M14.8 4v16"/>',
    sliders: '<path d="M4 7h9M18 7h2M4 17h3M11 17h9"/><circle cx="15.5" cy="7" r="2.3"/><circle cx="9" cy="17" r="2.3"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4.5 20.5a7.5 7.5 0 0 1 15 0"/>',
    users: '<circle cx="9" cy="8.5" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 5.2a3.5 3.5 0 0 1 0 6.6M18 14a6.5 6.5 0 0 1 3.5 6"/>',
    calendar: '<rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.2 2"/>',
    send: '<path d="M20.5 3.5 10 14M20.5 3.5 14 20.5l-4-6.5-6.5-4z"/>',
    pulse: '<path d="M3 12h4l2.5-6.5 5 13 2.5-6.5h4"/>',
    orb: '<circle cx="12" cy="10.5" r="7"/><path d="M8.5 21h7M12 17.5V21"/><path d="M8.6 8.6A4 4 0 0 1 11.5 6.6"/>',
    music: '<path d="M9 18V5.5l11-2V16"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="17.5" cy="16" r="2.5"/>',
    broadcast: '<circle cx="12" cy="12" r="2"/><path d="M7.8 16.2a6 6 0 0 1 0-8.4M16.2 7.8a6 6 0 0 1 0 8.4M5 19a10 10 0 0 1 0-14M19 5a10 10 0 0 1 0 14"/>',
    grid: '<rect x="4" y="4" width="7" height="7" rx="1.6"/><rect x="13" y="4" width="7" height="7" rx="1.6"/><rect x="4" y="13" width="7" height="7" rx="1.6"/><rect x="13" y="13" width="7" height="7" rx="1.6"/>',
    mesh: '<rect x="3.5" y="3.5" width="17" height="17" rx="4"/><circle cx="8.5" cy="8.5" r="1.6"/><circle cx="15.5" cy="9" r="1.6"/><circle cx="9" cy="15.5" r="1.6"/><circle cx="15.5" cy="15.5" r="1.6"/>',
    external: '<path d="M14 4h6v6M20 4l-9 9M18 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4"/>',
    filter: '<path d="M4 5h16l-6 7.5V19l-4 1.5v-8z"/>',
    sort: '<path d="M8 5v14M5 16l3 3 3-3M16 19V5M13 8l3-3 3 3"/>',
    grip: '<circle cx="9" cy="6" r="1.3"' + F + '/><circle cx="15" cy="6" r="1.3"' + F + '/><circle cx="9" cy="12" r="1.3"' + F + '/><circle cx="15" cy="12" r="1.3"' + F + '/><circle cx="9" cy="18" r="1.3"' + F + '/><circle cx="15" cy="18" r="1.3"' + F + '/>',
    home: '<path d="M4 11 12 4.5l8 6.5v9h-5.5v-6h-5v6H4z"/>',
    ticket: '<path d="M4 7a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v3a2 2 0 0 0 0 4v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-3a2 2 0 0 0 0-4z"/><path d="M14.5 6.5v11" stroke-dasharray="2 2.5"/>',
    download: '<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>',
    upload: '<path d="M12 20V9M7 14l5-5 5 5M5 4h14"/>',
    refresh: '<path d="M20 11a8 8 0 0 0-14.3-4.9L4 8M4 4v4h4M4 13a8 8 0 0 0 14.3 4.9L20 16M20 20v-4h-4"/>',
    trash: '<path d="M4 7h16M9 7V4.5h6V7M6.5 7l1 13h9l1-13"/>',
    edit: '<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="m13.5 6.5 4 4"/>',
    link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
    logout: '<path d="M10 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4M15 8l4 4-4 4M19 12H9"/>',
    headphones: '<path d="M4 16v-3a8 8 0 0 1 16 0v3"/><rect x="3.5" y="14" width="4" height="6.5" rx="1.6"/><rect x="16.5" y="14" width="4" height="6.5" rx="1.6"/>',
    mail: '<rect x="3.5" y="5.5" width="17" height="13" rx="2.5"/><path d="m4 7.5 8 5.5 8-5.5"/>',
    phone: '<path d="M6.5 3.5h3l1.5 4.5-2 1.5a11 11 0 0 0 5.5 5.5l1.5-2 4.5 1.5v3a2 2 0 0 1-2 2A16.5 16.5 0 0 1 4.5 5.5a2 2 0 0 1 2-2z"/>',
    'map-pin': '<path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.3"/>',
    lock: '<rect x="5" y="10.5" width="14" height="10" rx="2.5"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/>',
    keyboard: '<rect x="3" y="6" width="18" height="12" rx="2.5"/><path d="M7 10h.01M11 10h.01M15 10h.01M7 14h10"/>',
    eye: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>',
    mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21"/>',
    card: '<rect x="3" y="5.5" width="18" height="13" rx="2.5"/><path d="M3 10h18M7 15h4"/>',
    box: '<path d="M4 7.5 12 4l8 3.5v9L12 20l-8-3.5z"/><path d="M4 7.5 12 11l8-3.5M12 11v9"/>',
    share: '<circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="m8.2 10.8 7.6-3.6M8.2 13.2l7.6 3.6"/>',
    device: '<rect x="7" y="3" width="10" height="18" rx="2.5"/><path d="M11 18h2"/>',
    bluetooth: '<path d="m7 7 10 10-5 4V3l5 4L7 17"/>',
    wave: '<path d="M3 12c2-3 4-3 6 0s4 3 6 0 4-3 6 0"/>',
    flag: '<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>',
    star: '<path d="m12 4 2.4 5 5.4.7-4 3.7 1 5.4L12 16.2 7.2 18.8l1-5.4-4-3.7 5.4-.7z"/>'
  };
  function icon(name) {
    var p = ICONS[name];
    if (!p) return '';
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + p + '</svg>';
  }
  function hydrateIcons(scope) {
    $$('[data-icon]', scope).forEach(function (el) {
      var n = el.getAttribute('data-icon');
      if (el.getAttribute('data-icon-done') === n) return;
      if (!ICONS[n]) return;
      el.innerHTML = icon(n);
      el.setAttribute('aria-hidden', 'true');
      el.setAttribute('data-icon-done', n);
    });
  }
  function setIcon(el, name) { if (!el) return; el.setAttribute('data-icon', name); hydrateIcons(el.parentNode || el); }

  /* ───────────── 테마 (URL ?theme > localStorage > 시스템) ───────────── */
  function queryTheme() { try { var q = new URLSearchParams(location.search).get('theme'); return q === 'dark' || q === 'light' ? q : null; } catch (e) { return null; } }
  function storedTheme() { try { var t = localStorage.getItem(KEY); return t === 'dark' || t === 'light' ? t : null; } catch (e) { return null; } }
  function currentTheme() { return root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'; }
  function syncThemeToggles() {
    var dark = currentTheme() === 'dark';
    $$('[data-theme-toggle]').forEach(function (b) {
      b.setAttribute('aria-pressed', String(dark));
      b.setAttribute('aria-label', dark ? '낮 리허설 장면으로 전환' : '밤 본 행사 장면으로 전환');
      if (b.hasAttribute('data-tooltip')) b.setAttribute('data-tooltip', dark ? '낮 리허설' : '밤 본 행사');
    });
    var meta = $('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', dark ? '#0A0910' : '#F4F2F7');
  }
  function setTheme(t, persist) {
    t = t === 'dark' ? 'dark' : 'light';
    root.setAttribute('data-theme', t);
    if (persist) { try { localStorage.setItem(KEY, t); } catch (e) { /* 저장 불가 환경 */ } }
    syncThemeToggles();
    refreshMeshLabels(doc);
    emit(root, 'theme', { theme: t });
  }
  function toggleTheme(ev) {
    var next = currentTheme() === 'dark' ? 'light' : 'dark';
    if (doc.startViewTransition && !reduced()) {
      var x = ev && ev.clientX ? ev.clientX : innerWidth - 60;
      var y = ev && ev.clientY ? ev.clientY : 32;
      var r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
      var vt = doc.startViewTransition(function () { setTheme(next, true); });
      vt.ready.then(function () {
        root.animate({ clipPath: ['circle(0px at ' + x + 'px ' + y + 'px)', 'circle(' + r + 'px at ' + x + 'px ' + y + 'px)'] },
          { duration: 600, easing: 'cubic-bezier(.16, 1, .3, 1)', pseudoElement: '::view-transition-new(root)' });
      }).catch(function () {});
    } else {
      setTheme(next, true);
    }
  }
  (function initTheme() {
    var t = queryTheme() || root.getAttribute('data-theme') || storedTheme() || (darkMQ.matches ? 'dark' : 'light');
    if (queryTheme()) t = queryTheme();
    root.setAttribute('data-theme', t === 'dark' ? 'dark' : 'light');
    var onSys = function (e) { if (!queryTheme() && !storedTheme()) setTheme(e.matches ? 'dark' : 'light', false); };
    if (darkMQ.addEventListener) darkMQ.addEventListener('change', onSys);
  })();

  /* ───────────── 무드 · 메쉬 ───────────── */
  function moodOf(el) { var m = el && el.closest ? el.closest('[data-mood]') : null; return m ? m.getAttribute('data-mood') : (root.getAttribute('data-mood') || '001'); }
  function refreshMeshLabels(scope) {
    $$('[data-mesh-hex]', scope).forEach(function (el) {
      var n = el.getAttribute('data-mesh-hex');
      var v = getComputedStyle(el).getPropertyValue('--mood-' + n).trim();
      if (v) el.textContent = v.toUpperCase();
    });
    $$('[data-mood-name]', scope).forEach(function (el) { var m = moodOf(el); el.textContent = MOODS[m] ? MOODS[m].name : ''; });
    $$('[data-mood-id]', scope).forEach(function (el) { el.textContent = 'MOOD-' + moodOf(el); });
  }
  function setMood(id, target) {
    if (!MOODS[id]) return;
    var t = target || root;
    t.setAttribute('data-mood', id);
    $$('[data-mood-set]').forEach(function (c) {
      var tgtSel = c.getAttribute('data-mood-target');
      var tgt = tgtSel ? $(tgtSel) : root;
      if (tgt !== t) return;
      var on = c.getAttribute('data-mood-set') === id;
      if (c.tagName === 'INPUT') c.checked = on;
      else if (c.hasAttribute('aria-pressed')) c.setAttribute('aria-pressed', String(on));
      else if (c.getAttribute('role') === 'menuitemradio') c.setAttribute('aria-checked', String(on));
    });
    refreshMeshLabels(t === root ? doc : t);
    if (t !== root) refreshMeshLabels(doc);
    emit(t, 'mood', { mood: id, name: MOODS[id].name });
  }

  // 포인터를 대면 가장 가까운 제어점이 최대 ±6% 따라온다
  function initMeshFollow(scope) {
    $$('[data-mesh-follow]', scope).forEach(function (mesh) {
      if (mesh._gyFollow) return; mesh._gyFollow = true;
      var raf = 0, last = null;
      function reset() { for (var i = 1; i <= 4; i++) { mesh.style.removeProperty('--o' + i + 'x'); mesh.style.removeProperty('--o' + i + 'y'); } }
      mesh.addEventListener('pointermove', function (e) {
        if (reduced() || e.pointerType === 'touch') return;
        last = e;
        if (raf) return;
        raf = requestAnimationFrame(function () {
          raf = 0;
          var r = mesh.getBoundingClientRect();
          var px = (last.clientX - r.left) / r.width * 100, py = (last.clientY - r.top) / r.height * 100;
          var cs = getComputedStyle(mesh), best = 1, bd = Infinity, pts = {};
          for (var i = 1; i <= 4; i++) {
            var x = parseFloat(cs.getPropertyValue('--p' + i + 'x')), y = parseFloat(cs.getPropertyValue('--p' + i + 'y'));
            pts[i] = [x, y];
            var d = Math.hypot(px - x, py - y);
            if (d < bd) { bd = d; best = i; }
          }
          for (var j = 1; j <= 4; j++) {
            if (j === best) {
              mesh.style.setProperty('--o' + j + 'x', clamp((px - pts[j][0]) * 0.35, -6, 6).toFixed(2) + '%');
              mesh.style.setProperty('--o' + j + 'y', clamp((py - pts[j][1]) * 0.35, -6, 6).toFixed(2) + '%');
            } else { mesh.style.removeProperty('--o' + j + 'x'); mesh.style.removeProperty('--o' + j + 'y'); }
          }
        });
      });
      mesh.addEventListener('pointerleave', reset);
    });
  }

  // 화면 밖 무대는 드리프트 일시정지
  var driftIO = 'IntersectionObserver' in window ? new IntersectionObserver(function (entries) {
    entries.forEach(function (en) { en.target.classList.toggle('is-paused', !en.isIntersecting); });
  }, { rootMargin: '80px' }) : null;
  function initDrift(scope) {
    if (!driftIO) return;
    $$('.mesh--drift', scope).forEach(function (m) { if (m._gyDrift) return; m._gyDrift = true; driftIO.observe(m); });
  }

  // 404 · empty: 회색 메쉬의 핸들을 눌러 색 복귀
  function onRestoreHandle(btn) {
    var mesh = btn.closest('[data-restore]');
    if (!mesh) return;
    var n = btn.getAttribute('data-p');
    mesh.classList.add('lit-' + n);
    btn.setAttribute('aria-pressed', 'true');
    var lit = [1, 2, 3, 4].filter(function (i) { return mesh.classList.contains('lit-' + i); }).length;
    var counter = $('[data-restore-count]', mesh.parentNode) || $('[data-restore-count]');
    if (counter) counter.textContent = lit + ' / 4';
    if (lit === 4) {
      var sel = mesh.getAttribute('data-restore');
      $$(sel || '[data-restore-target]').forEach(function (t) { t.removeAttribute('disabled'); t.removeAttribute('aria-disabled'); t.classList.add('is-ready'); });
      emit(mesh, 'restore', { complete: true });
    }
  }

  /* ───────────── 오버레이: modal · drawer · command · sidebar ───────────── */
  var FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
  function visible(el) { return !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length); }
  function focusables(el) { return $$(FOCUSABLE, el).filter(function (n) { return visible(n) && !n.closest('[hidden]') && !n.closest('[inert]'); }); }
  var stack = [];
  var OVERLAY_SEL = '.modal, .drawer, .command, .sidebar';
  function lockScroll(on) { doc.body.style.overflow = on ? 'hidden' : ''; }
  function isSidebarDocked(el) { return el.classList.contains('sidebar') && window.matchMedia('(min-width: 1025px)').matches; }

  function open(target, opener) {
    var el = typeof target === 'string' ? doc.getElementById(target) : target;
    if (!el || stack.indexOf(el) > -1) return;
    if (el.id === 'command' || el.classList.contains('command')) closeFloating();
    if (isSidebarDocked(el)) return;
    el._gyOpener = opener || doc.activeElement;
    if (el.classList.contains('sidebar')) {
      var scrim = doc.createElement('div');
      scrim.className = 'sidebar-scrim';
      scrim.setAttribute('data-close', el.id);
      el.parentNode.insertBefore(scrim, el.nextSibling);
      el._gyScrim = scrim;
      void scrim.offsetWidth; scrim.classList.add('is-open');
      el.setAttribute('role', el.getAttribute('role') || 'dialog');
      el.setAttribute('aria-modal', 'true');
    }
    el.hidden = false;
    void el.offsetWidth;
    el.classList.add('is-open');
    stack.push(el);
    lockScroll(true);
    $$('[aria-controls="' + el.id + '"]').forEach(function (b) { b.setAttribute('aria-expanded', 'true'); });
    var first = $('[autofocus]', el) || $('.command__input', el) || focusables(el)[0];
    setTimeout(function () { (first || el).focus({ preventScroll: true }); }, 30);
    if (el.classList.contains('command')) resetCommand(el);
    emit(el, 'open', { id: el.id });
  }
  function close(target) {
    var el = typeof target === 'string' ? doc.getElementById(target) : target;
    if (!el) return;
    var i = stack.indexOf(el);
    if (i === -1) return;
    stack.splice(i, 1);
    el.classList.remove('is-open');
    if (el._gyScrim) { var s = el._gyScrim; s.classList.remove('is-open'); setTimeout(function () { s.remove(); }, reduced() ? 0 : 320); el._gyScrim = null; el.removeAttribute('aria-modal'); }
    var isSidebar = el.classList.contains('sidebar');
    setTimeout(function () { if (!el.classList.contains('is-open') && !isSidebar) el.hidden = true; }, reduced() ? 0 : 320);
    if (!stack.length) lockScroll(false);
    $$('[aria-controls="' + el.id + '"]').forEach(function (b) { b.setAttribute('aria-expanded', 'false'); });
    var op = el._gyOpener;
    if (op && op.focus && doc.contains(op)) op.focus({ preventScroll: true });
    emit(el, 'close', { id: el.id });
  }
  function topOverlay() { return stack[stack.length - 1]; }
  window.addEventListener('resize', function () {
    var t = topOverlay();
    if (t && isSidebarDocked(t)) close(t);
  });

  /* ───────────── 커맨드 팔레트 ⌘K ───────────── */
  function base() { return /\/pages\//.test(location.pathname) ? { index: '../index.html', pages: '' } : { index: 'index.html', pages: 'pages/' }; }
  function buildCommand() {
    if (doc.getElementById('command')) return;
    var b = base();
    var nav = [
      ['키노트 덱 〈소리의 색〉', b.index, 'home', '키노트 index 처음'],
      ['요금제', b.pages + 'pricing.html', 'ticket', '플러스 가격'],
      ['결 오브 사전예약', b.pages + 'product.html', 'orb', '제품 오브 구매'],
      ['김나래의 2026 결산', b.pages + 'profile.html', 'star', '프로필 결산 스토리'],
      ['결 3.0 첫 실행', b.pages + 'onboarding.html', 'flag', '온보딩 시작'],
      ['런칭 관제 콘솔', b.pages + 'dashboard.html', 'pulse', '대시보드 시청자'],
      ['문의함', b.pages + 'inbox.html', 'inbox', '인박스 메일'],
      ['런칭 큐시트 보드', b.pages + 'kanban.html', 'columns', '칸반 작업'],
      ['앱 설정', b.pages + 'settings.html', 'sliders', '설정 음질 알림'],
      ['큐시트에 없는 장면', b.pages + '404.html', 'mesh', '404 오류']
    ];
    var h = '<div class="command__scrim" data-close></div><div class="command__panel">' +
      '<div class="command__search"><span data-icon="search"></span>' +
      '<input class="command__input" type="text" role="combobox" aria-expanded="true" aria-controls="command-list" aria-autocomplete="list" placeholder="장면, 무드, 동작 찾기" aria-label="명령 검색">' +
      '<kbd class="command__esc">esc</kbd></div><div class="command__list" id="command-list" role="listbox" aria-label="명령">';
    h += '<div class="command__group" role="group" aria-labelledby="cmd-g1"><p class="command__heading" id="cmd-g1">이동</p>';
    nav.forEach(function (n) { h += '<div class="command__item" role="option" data-href="' + n[1] + '" data-keywords="' + n[3] + '"><span data-icon="' + n[2] + '"></span><span class="command__label">' + n[0] + '</span><span class="command__hint">이동 ↵</span></div>'; });
    h += '</div><div class="command__group" role="group" aria-labelledby="cmd-g2"><p class="command__heading" id="cmd-g2">무드 전환</p>';
    Object.keys(MOODS).forEach(function (k) { h += '<div class="command__item" role="option" data-mood-set="' + k + '" data-keywords="mood ' + k + ' ' + MOODS[k].note + '"><span class="art" data-mood="' + k + '"></span><span class="command__label">' + MOODS[k].name + '<span class="mono">MOOD-' + k + '</span></span><span class="command__hint">적용 ↵</span></div>'; });
    h += '</div><div class="command__group" role="group" aria-labelledby="cmd-g3"><p class="command__heading" id="cmd-g3">재생 · 무대</p>' +
      '<div class="command__item" role="option" data-action="theme" data-keywords="다크 라이트 테마 밤 낮"><span data-icon="moon"></span><span class="command__label">낮 리허설 ↔ 밤 본 행사 전환</span><span class="command__kbd">⇧D</span></div>' +
      (doc.getElementById('queue') ? '<div class="command__item" role="option" data-open="queue" data-keywords="대기열 재생목록"><span data-icon="queue"></span><span class="command__label">지금 재생 대기열 열기</span><span class="command__kbd">Q</span></div>' : '') +
      '<div class="command__item" role="option" data-action="drift" data-keywords="모션 드리프트 정지 메쉬"><span data-icon="wave"></span><span class="command__label">메쉬 드리프트 멈춤 · 재개</span></div>' +
      '</div><p class="command__empty" hidden>찾는 장면이 큐시트에 없어요.</p></div>' +
      '<div class="command__foot"><span><kbd>↑</kbd><kbd>↓</kbd>이동</span><span><kbd>↵</kbd>실행</span><span><kbd>esc</kbd>닫기</span></div></div>';
    var el = doc.createElement('div');
    el.className = 'command'; el.id = 'command'; el.hidden = true;
    el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true'); el.setAttribute('aria-label', '명령 팔레트');
    el.innerHTML = h;
    doc.body.appendChild(el);
    hydrateIcons(el);
  }
  function cmdItems(cmd) { return $$('.command__item', cmd).filter(function (i) { return !i.hidden && i.getAttribute('aria-disabled') !== 'true'; }); }
  function cmdSelect(cmd, item) {
    $$('.command__item', cmd).forEach(function (i) { i.setAttribute('aria-selected', String(i === item)); });
    var input = $('.command__input', cmd);
    if (item) { ensureId(item, 'cmd-opt'); if (input) input.setAttribute('aria-activedescendant', item.id); item.scrollIntoView({ block: 'nearest' }); }
    else if (input) input.removeAttribute('aria-activedescendant');
  }
  function cmdFilter(cmd) {
    var q = ($('.command__input', cmd).value || '').trim().toLowerCase();
    var any = false;
    $$('.command__group', cmd).forEach(function (g) {
      var vis = 0;
      $$('.command__item', g).forEach(function (i) {
        var hay = (i.textContent + ' ' + (i.getAttribute('data-keywords') || '')).toLowerCase();
        var ok = !q || hay.indexOf(q) > -1;
        i.hidden = !ok; if (ok) vis++;
      });
      g.hidden = !vis; if (vis) any = true;
    });
    var empty = $('.command__empty', cmd); if (empty) empty.hidden = any;
    cmdSelect(cmd, cmdItems(cmd)[0]);
  }
  function resetCommand(cmd) { var i = $('.command__input', cmd); if (i) { i.value = ''; } cmdFilter(cmd); }
  function cmdRun(cmd, item) {
    if (!item) return;
    var href = item.getAttribute('data-href');
    close(cmd);
    if (href) { location.href = href; return; }
    if (item.hasAttribute('data-mood-set')) { setMood(item.getAttribute('data-mood-set')); toast({ title: MOODS[item.getAttribute('data-mood-set')].name + ' 무드로 바꿨어요', text: 'MOOD-' + item.getAttribute('data-mood-set'), tone: 'success' }); return; }
    var act = item.getAttribute('data-action');
    if (act === 'theme') { toggleTheme(); return; }
    if (act === 'drift') { toggleDrift(null); return; }
    if (item.hasAttribute('data-open')) { open(item.getAttribute('data-open')); return; }
    if (item.hasAttribute('data-toast')) toastFrom(item);
  }
  function initCommand(cmd) {
    if (!cmd || cmd._gy) return; cmd._gy = true;
    var input = $('.command__input', cmd);
    if (input) {
      input.addEventListener('input', function () { cmdFilter(cmd); });
      input.addEventListener('keydown', function (e) {
        var items = cmdItems(cmd), cur = $('.command__item[aria-selected="true"]', cmd), idx = items.indexOf(cur);
        if (e.key === 'ArrowDown') { e.preventDefault(); cmdSelect(cmd, items[(idx + 1) % items.length]); }
        else if (e.key === 'ArrowUp') { e.preventDefault(); cmdSelect(cmd, items[(idx - 1 + items.length) % items.length]); }
        else if (e.key === 'Home') { e.preventDefault(); cmdSelect(cmd, items[0]); }
        else if (e.key === 'End') { e.preventDefault(); cmdSelect(cmd, items[items.length - 1]); }
        else if (e.key === 'Enter') { e.preventDefault(); cmdRun(cmd, cur); }
      });
    }
    cmd.addEventListener('mousemove', function (e) { var it = e.target.closest('.command__item'); if (it && it.getAttribute('aria-selected') !== 'true') cmdSelect(cmd, it); });
    cmd.addEventListener('click', function (e) { var it = e.target.closest('.command__item'); if (it && it.getAttribute('aria-disabled') !== 'true') { e.stopPropagation(); cmdRun(cmd, it); } });
  }

  /* ───────────── 팝오버 · 메뉴 (고정 위치 플로팅) ───────────── */
  var floating = null;
  function placeFloating(panel, trigger) {
    var r = trigger.getBoundingClientRect();
    panel.style.left = '0px'; panel.style.top = '0px';
    var pw = panel.offsetWidth, ph = panel.offsetHeight, gap = 10;
    var align = panel.getAttribute('data-align') || 'start';
    var left = align === 'end' ? r.right - pw : align === 'center' ? r.left + r.width / 2 - pw / 2 : r.left;
    left = clamp(left, 16, innerWidth - pw - 16);
    var top = r.bottom + gap, side = 'bottom';
    if (top + ph > innerHeight - 12 && r.top - gap - ph > 12) { top = r.top - gap - ph; side = 'top'; }
    panel.style.left = Math.round(left) + 'px';
    panel.style.top = Math.round(top) + 'px';
    panel.setAttribute('data-side', side);
    panel.style.setProperty('--arrow-x', clamp(r.left + r.width / 2 - left, 16, pw - 16) + 'px');
  }
  function openFloating(panel, trigger, viaKey) {
    closeFloating();
    if (panel.classList.contains('popover') && !$('.popover__arrow', panel)) { var a = doc.createElement('span'); a.className = 'popover__arrow'; a.setAttribute('aria-hidden', 'true'); panel.insertBefore(a, panel.firstChild); }
    panel.hidden = false;
    placeFloating(panel, trigger);
    void panel.offsetWidth;
    panel.classList.add('is-open');
    trigger.setAttribute('aria-expanded', 'true');
    floating = { panel: panel, trigger: trigger };
    if (panel.classList.contains('menu')) {
      var items = menuItems(panel);
      var target = $('[aria-checked="true"], [aria-current="page"]', panel);
      if (viaKey) (target && items.indexOf(target) > -1 ? target : items[0]).focus();
    } else {
      var f = focusables(panel)[0];
      if (viaKey && f) f.focus();
    }
    emit(panel, 'open', { id: panel.id });
  }
  function closeFloating(returnFocus) {
    if (!floating) return;
    var f = floating; floating = null;
    f.panel.classList.remove('is-open');
    f.trigger.setAttribute('aria-expanded', 'false');
    setTimeout(function () { if (!f.panel.classList.contains('is-open')) f.panel.hidden = true; }, 160);
    if (returnFocus) f.trigger.focus();
    emit(f.panel, 'close', { id: f.panel.id });
  }
  function menuItems(menu) { return $$('.menu__item', menu).filter(function (i) { return i.getAttribute('aria-disabled') !== 'true' && !i.disabled; }); }
  window.addEventListener('resize', function () { if (floating) placeFloating(floating.panel, floating.trigger); });
  window.addEventListener('scroll', function () { if (floating) placeFloating(floating.panel, floating.trigger); }, { passive: true, capture: true });

  /* ───────────── 툴팁 ───────────── */
  var tip = null, tipTimer = 0, tipFor = null;
  function showTip(el) {
    var text = el.getAttribute('data-tooltip'); if (!text) return;
    if (!tip) { tip = doc.createElement('div'); tip.className = 'tooltip'; tip.id = 'gy-tooltip'; tip.setAttribute('role', 'tooltip'); doc.body.appendChild(tip); }
    var kbd = el.getAttribute('data-tooltip-kbd');
    tip.textContent = text;
    if (kbd) { var k = doc.createElement('span'); k.className = 'tooltip__kbd'; k.textContent = kbd; tip.appendChild(k); }
    tip.style.left = '0px'; tip.style.top = '0px';
    var r = el.getBoundingClientRect(), tw = tip.offsetWidth, th = tip.offsetHeight;
    var left = clamp(r.left + r.width / 2 - tw / 2, 8, innerWidth - tw - 8), top = r.top - th - 10, side = 'top';
    if (top < 8) { top = r.bottom + 10; side = 'bottom'; }
    tip.style.left = Math.round(left) + 'px'; tip.style.top = Math.round(top) + 'px';
    tip.setAttribute('data-side', side);
    tip.style.setProperty('--arrow-x', clamp(r.left + r.width / 2 - left, 10, tw - 10) + 'px');
    tip.classList.add('is-open');
    tipFor = el;
    el.setAttribute('aria-describedby', 'gy-tooltip');
  }
  function hideTip() {
    clearTimeout(tipTimer);
    if (tip) tip.classList.remove('is-open');
    if (tipFor) { tipFor.removeAttribute('aria-describedby'); tipFor = null; }
  }
  doc.addEventListener('mouseover', function (e) {
    var el = e.target.closest && e.target.closest('[data-tooltip]');
    if (!el || el === tipFor) return;
    clearTimeout(tipTimer); tipTimer = setTimeout(function () { showTip(el); }, 300);
  });
  doc.addEventListener('mouseout', function (e) {
    var el = e.target.closest && e.target.closest('[data-tooltip]');
    if (el && !el.contains(e.relatedTarget)) hideTip();
  });
  doc.addEventListener('focusin', function (e) {
    var el = e.target.closest && e.target.closest('[data-tooltip]');
    if (el && el.matches(':focus-visible')) { clearTimeout(tipTimer); showTip(el); }
  });
  doc.addEventListener('focusout', function (e) { if (tipFor && e.target === tipFor) hideTip(); });

  /* ───────────── 토스트 ───────────── */
  function toastRegion() {
    var r = $('.toast-region');
    if (!r) { r = doc.createElement('div'); r.className = 'toast-region'; r.setAttribute('aria-live', 'polite'); r.setAttribute('aria-atomic', 'false'); doc.body.appendChild(r); }
    return r;
  }
  function toast(opts) {
    if (typeof opts === 'string') opts = { title: opts };
    var dur = opts.duration || 5000;
    var t = doc.createElement('div');
    t.className = 'toast' + (opts.tone ? ' toast--' + opts.tone : '');
    t.setAttribute('role', opts.tone === 'danger' ? 'alert' : 'status');
    t.style.setProperty('--toast-dur', dur + 'ms');
    var ic = opts.icon || (opts.tone === 'success' ? 'check-circle' : opts.tone === 'danger' ? 'x-circle' : opts.tone === 'warning' ? 'alert' : 'info');
    t.innerHTML = '<span class="toast__icon" data-icon="' + ic + '"></span><div class="toast__body"><p class="toast__title"></p>' + (opts.text ? '<p class="toast__text"></p>' : '') + '</div>' +
      (opts.action ? '<button type="button" class="toast__action"></button>' : '') +
      '<button type="button" class="toast__close" aria-label="알림 닫기"><span data-icon="close"></span></button><span class="toast__timer" aria-hidden="true"></span>';
    $('.toast__title', t).textContent = opts.title || '';
    if (opts.text) $('.toast__text', t).textContent = opts.text;
    if (opts.action) {
      var ab = $('.toast__action', t); ab.textContent = opts.action;
      ab.addEventListener('click', function () { if (typeof opts.onAction === 'function') opts.onAction(); emit(t, 'toast-action', { title: opts.title }); dismiss(); });
    }
    hydrateIcons(t);
    var region = toastRegion();
    region.appendChild(t);
    while (region.children.length > 3) region.firstElementChild.remove();
    var done = false;
    function dismiss() { if (done) return; done = true; t.classList.add('is-leaving'); setTimeout(function () { t.remove(); }, reduced() ? 0 : 220); }
    $('.toast__close', t).addEventListener('click', dismiss);
    var timer = $('.toast__timer', t);
    if (reduced()) setTimeout(dismiss, dur);
    else timer.addEventListener('animationend', dismiss);
    emit(t, 'toast', { title: opts.title });
    return { el: t, dismiss: dismiss };
  }
  function toastFrom(el) {
    toast({ title: el.getAttribute('data-toast'), text: el.getAttribute('data-toast-text') || '', tone: el.getAttribute('data-toast-tone') || '', action: el.getAttribute('data-toast-action') || '' });
  }

  /* ───────────── 탭 ───────────── */
  function tabsOf(list) { return $$('[role="tab"]', list); }
  function selectTab(tab, focus) {
    var list = tab.closest('[role="tablist"]');
    tabsOf(list).forEach(function (t) {
      var on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      var p = doc.getElementById(t.getAttribute('aria-controls'));
      if (p) {
        if (on) { p.hidden = false; p.setAttribute('data-entering', ''); setTimeout(function () { p.removeAttribute('data-entering'); }, 340); }
        else p.hidden = true;
      }
    });
    if (focus) tab.focus();
    tab.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    emit(tab, 'tab', { id: tab.id, label: tab.textContent.trim() });
  }
  function updateOverflow(list) {
    var o = [];
    if (list.scrollLeft > 4) o.push('start');
    if (list.scrollLeft + list.clientWidth < list.scrollWidth - 4) o.push('end');
    if (o.length) list.setAttribute('data-overflow', o.join(' ')); else list.removeAttribute('data-overflow');
  }
  var ro = 'ResizeObserver' in window ? new ResizeObserver(function (en) { en.forEach(function (e) { updateOverflow(e.target); }); }) : null;
  function initTabs(scope) {
    $$('[role="tablist"]', scope).forEach(function (list) {
      if (list._gy) return; list._gy = true;
      var tabs = tabsOf(list);
      var sel = tabs.filter(function (t) { return t.getAttribute('aria-selected') === 'true'; })[0] || tabs[0];
      tabs.forEach(function (t) {
        t.tabIndex = t === sel ? 0 : -1;
        var p = doc.getElementById(t.getAttribute('aria-controls'));
        if (p) { p.hidden = t !== sel; if (!p.hasAttribute('tabindex')) p.tabIndex = 0; }
      });
      if (sel) sel.setAttribute('aria-selected', 'true');
      list.addEventListener('click', function (e) { var t = e.target.closest('[role="tab"]'); if (t && !t.disabled && t.getAttribute('aria-disabled') !== 'true') selectTab(t); });
      list.addEventListener('keydown', function (e) {
        var ts = tabsOf(list).filter(function (t) { return !t.disabled && t.getAttribute('aria-disabled') !== 'true'; });
        var i = ts.indexOf(doc.activeElement); if (i < 0) return;
        var vert = list.getAttribute('aria-orientation') === 'vertical';
        var nk = vert ? 'ArrowDown' : 'ArrowRight', pk = vert ? 'ArrowUp' : 'ArrowLeft', n = null;
        if (e.key === nk) n = ts[(i + 1) % ts.length];
        else if (e.key === pk) n = ts[(i - 1 + ts.length) % ts.length];
        else if (e.key === 'Home') n = ts[0];
        else if (e.key === 'End') n = ts[ts.length - 1];
        if (n) { e.preventDefault(); selectTab(n, true); }
      });
      if (list.classList.contains('tabs__list')) {
        updateOverflow(list);
        list.addEventListener('scroll', function () { updateOverflow(list); }, { passive: true });
        if (ro) ro.observe(list);
      }
    });
  }

  /* ───────────── 아코디언 (320ms 높이 전환) ───────────── */
  function toggleAccordion(btn, force) {
    var panel = doc.getElementById(btn.getAttribute('aria-controls'));
    if (!panel) return;
    var willOpen = typeof force === 'boolean' ? force : btn.getAttribute('aria-expanded') !== 'true';
    var acc = btn.closest('.accordion');
    if (willOpen && acc && acc.getAttribute('data-accordion') === 'single') {
      $$('.accordion__trigger[aria-expanded="true"]', acc).forEach(function (o) { if (o !== btn) toggleAccordion(o, false); });
    }
    btn.setAttribute('aria-expanded', String(willOpen));
    var item = btn.closest('.accordion__item'); if (item) item.classList.toggle('is-open', willOpen);
    if (reduced() || !panel.animate) { panel.hidden = !willOpen; return; }
    if (panel._gyAnim) panel._gyAnim.cancel();
    if (willOpen) {
      panel.hidden = false;
      var h = panel.scrollHeight;
      panel._gyAnim = panel.animate([{ height: '0px', opacity: 0 }, { height: h + 'px', opacity: 1 }], { duration: 320, easing: 'cubic-bezier(.16,1,.3,1)' });
    } else {
      var h2 = panel.scrollHeight;
      panel._gyAnim = panel.animate([{ height: h2 + 'px', opacity: 1 }, { height: '0px', opacity: 0 }], { duration: 260, easing: 'cubic-bezier(.2,0,0,1)' });
      panel._gyAnim.onfinish = function () { panel.hidden = true; };
    }
  }
  function initAccordion(scope) {
    $$('.accordion__trigger', scope).forEach(function (b) {
      var p = doc.getElementById(b.getAttribute('aria-controls'));
      if (p) p.hidden = b.getAttribute('aria-expanded') !== 'true';
    });
  }

  /* ───────────── 캐러셀 ───────────── */
  function initCarousel(scope) {
    $$('[data-carousel]', scope).forEach(function (c) {
      if (c._gy) return; c._gy = true;
      var vp = $('.carousel__viewport', c), slides = $$('.carousel__slide', c), n = slides.length;
      if (!vp || !n) return;
      var cur = $('[data-carousel-current]', c), tot = $('[data-carousel-total]', c), line = $('.carousel__line span', c);
      var prev = $('[data-carousel-prev]', c), next = $('[data-carousel-next]', c);
      if (tot) tot.textContent = n;
      if (!vp.hasAttribute('tabindex')) vp.tabIndex = 0;
      slides.forEach(function (s, i) { s.setAttribute('role', 'group'); s.setAttribute('aria-roledescription', '슬라이드'); s.setAttribute('aria-label', (i + 1) + ' / ' + n); });
      var index = -1;
      function step() { return slides.length > 1 ? slides[1].offsetLeft - slides[0].offsetLeft : vp.clientWidth; }
      function update() {
        var max = vp.scrollWidth - vp.clientWidth;
        var i = vp.scrollLeft >= max - 4 ? n - 1 : clamp(Math.round(vp.scrollLeft / step()), 0, n - 1);
        if (i === index) return; index = i;
        if (cur) cur.textContent = i + 1;
        if (line) line.style.setProperty('--value', ((i + 1) / n).toFixed(4));
        if (prev) prev.disabled = i === 0;
        if (next) next.disabled = i === n - 1;
        slides.forEach(function (s, k) { s.toggleAttribute('data-current', k === i); });
        if (c.hasAttribute('data-mood-sync') && slides[i].getAttribute('data-mood')) setMood(slides[i].getAttribute('data-mood'), c.getAttribute('data-mood-sync') ? $(c.getAttribute('data-mood-sync')) : undefined);
        emit(c, 'carousel', { index: i });
      }
      function go(i) { i = clamp(i, 0, n - 1); vp.scrollTo({ left: slides[i].offsetLeft - slides[0].offsetLeft, behavior: reduced() ? 'auto' : 'smooth' }); }
      var raf = 0;
      vp.addEventListener('scroll', function () { if (!raf) raf = requestAnimationFrame(function () { raf = 0; update(); }); }, { passive: true });
      if (prev) prev.addEventListener('click', function () { go(index - 1); });
      if (next) next.addEventListener('click', function () { go(index + 1); });
      vp.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight') { e.preventDefault(); go(index + 1); }
        else if (e.key === 'ArrowLeft') { e.preventDefault(); go(index - 1); }
      });
      c._gyGo = go;
      update();
    });
  }

  /* ───────────── 마퀴 (자막 띠 복제) ───────────── */
  function initMarquee(scope) {
    $$('.marquee__track', scope).forEach(function (tr) {
      if (tr._gy) return; tr._gy = true;
      var g = $('.marquee__group', tr); if (!g) return;
      var clone = g.cloneNode(true); clone.setAttribute('aria-hidden', 'true');
      $$('a, button', clone).forEach(function (n) { n.tabIndex = -1; });
      tr.appendChild(clone);
    });
  }

  /* ───────────── 장면 진입 reveal · 키노트 덱 클리커 ───────────── */
  function initReveal(scope) {
    var els = $$('[data-reveal], [data-reveal-stagger]', scope);
    $$('[data-reveal-stagger]', scope).forEach(function (g) { Array.prototype.forEach.call(g.children, function (ch, i) { ch.style.setProperty('--i', i); }); });
    if (!('IntersectionObserver' in window) || reduced()) { els.forEach(function (e) { e.classList.add('is-in'); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
    }, { threshold: 0.18, rootMargin: '0px 0px -6% 0px' });
    els.forEach(function (e) { if (!e.classList.contains('is-in')) io.observe(e); });
  }
  var deck = null;
  function initDeck() {
    var d = $('[data-deck]'); if (!d) return;
    var scenes = $$('[data-chapter]', d); if (!scenes.length) return;
    var clicker = $('.clicker');
    var chap = clicker && $('[data-clicker-chapter]', clicker), cnt = clicker && $('[data-clicker-count]', clicker);
    var navbar = $('.navbar');
    var total = scenes.length;
    deck = { scenes: scenes, index: 0 };
    function setScene(i) {
      deck.index = i;
      var s = scenes[i];
      if (chap) chap.textContent = s.getAttribute('data-chapter');
      if (cnt) cnt.innerHTML = '<b>' + pad2(i + 1) + '</b><span> / ' + pad2(total) + '</span>';
      var m = s.getAttribute('data-mood') || root.getAttribute('data-mood') || '001';
      if (clicker) clicker.setAttribute('data-mood', m);
      if (navbar) navbar.setAttribute('data-mood', m);
      $$('[data-scene-link]').forEach(function (a) { a.setAttribute('aria-current', a.getAttribute('href') === '#' + s.id ? 'true' : 'false'); });
      emit(s, 'scene', { index: i, chapter: s.getAttribute('data-chapter') });
    }
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { if (en.isIntersecting) setScene(scenes.indexOf(en.target)); });
      }, { rootMargin: '-45% 0px -45% 0px' });
      scenes.forEach(function (s) { io.observe(s); });
    }
    setScene(0);
    deck.go = function (i) {
      i = clamp(i, 0, total - 1);
      scenes[i].scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth', block: 'start' });
    };
    $$('[data-deck-prev]').forEach(function (b) { b.addEventListener('click', function () { deck.go(deck.index - 1); }); });
    $$('[data-deck-next]').forEach(function (b) { b.addEventListener('click', function () { deck.go(deck.index + 1); }); });
  }
  function scrollProgress() {
    var max = doc.documentElement.scrollHeight - innerHeight;
    var p = max > 0 ? clamp(scrollY / max, 0, 1) : 0;
    $$('.navbar, .clicker').forEach(function (el) { el.style.setProperty('--progress', p.toFixed(4)); });
  }

  /* ───────────── 칸반 (드래그 + 키보드 들기/옮기기) ───────────── */
  var live = null;
  function announce(msg) {
    if (!live) { live = doc.createElement('div'); live.className = 'sr-only'; live.setAttribute('aria-live', 'assertive'); doc.body.appendChild(live); }
    live.textContent = ''; setTimeout(function () { live.textContent = msg; }, 30);
  }
  function kanbanCounts(board) {
    $$('.kanban__col', board).forEach(function (col) {
      var cards = $$('.kanban__card', col), done = cards.filter(function (c) { return c.getAttribute('data-done') === 'true'; }).length;
      var cnt = $('[data-kanban-count]', col); if (cnt) cnt.innerHTML = '<b>' + done + '</b> / ' + cards.length;
      var line = $('.kanban__line span', col); if (line) line.style.setProperty('--value', cards.length ? (done / cards.length).toFixed(4) : 0);
    });
  }
  function colName(col) { var t = $('.kanban__title', col); return t ? t.childNodes[0].textContent.trim() : ''; }
  function moved(board, card, col) {
    if (col.hasAttribute('data-col-done')) card.setAttribute('data-done', 'true');
    else if (card.getAttribute('data-done') === 'true' && card._gyFromDone) card.setAttribute('data-done', 'false');
    kanbanCounts(board);
    var id = ($('.kanban__id', card) || {}).textContent || '';
    announce(id + ' 카드를 ' + colName(col) + ' 열로 옮겼습니다.');
    emit(card, 'kanban-move', { id: id.trim(), to: col.getAttribute('data-col') });
  }
  function initKanban(scope) {
    $$('[data-kanban]', scope).forEach(function (board) {
      if (board._gy) return; board._gy = true;
      var dragging = null;
      $$('.kanban__card', board).forEach(function (c) {
        c.setAttribute('draggable', 'true'); if (!c.hasAttribute('tabindex')) c.tabIndex = 0;
        c.setAttribute('aria-roledescription', '옮길 수 있는 카드');
      });
      board.addEventListener('dragstart', function (e) {
        var c = e.target.closest('.kanban__card'); if (!c) return;
        dragging = c; c._gyFromDone = !!c.closest('[data-col-done]');
        c.classList.add('is-dragging');
        try { e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', c.id || 'card'); } catch (er) { /* 일부 브라우저 */ }
      });
      board.addEventListener('dragend', function () {
        if (dragging) dragging.classList.remove('is-dragging');
        $$('.kanban__col.is-over', board).forEach(function (c) { c.classList.remove('is-over'); });
        dragging = null;
      });
      board.addEventListener('dragover', function (e) {
        var col = e.target.closest('.kanban__col'); if (!col || !dragging) return;
        e.preventDefault();
        $$('.kanban__col.is-over', board).forEach(function (c) { if (c !== col) c.classList.remove('is-over'); });
        col.classList.add('is-over');
        var list = $('.kanban__cards', col);
        var after = $$('.kanban__card:not(.is-dragging)', list).filter(function (k) { var r = k.getBoundingClientRect(); return e.clientY < r.top + r.height / 2; })[0];
        if (after) list.insertBefore(dragging, after); else list.appendChild(dragging);
      });
      board.addEventListener('drop', function (e) {
        var col = e.target.closest('.kanban__col'); if (!col || !dragging) return;
        e.preventDefault(); col.classList.remove('is-over');
        moved(board, dragging, col);
      });
      board.addEventListener('keydown', function (e) {
        var c = e.target.closest('.kanban__card'); if (!c || e.target !== c) return;
        var lifted = c.getAttribute('aria-grabbed') === 'true';
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          c.setAttribute('aria-grabbed', String(!lifted));
          if (!lifted) { c._gyFromDone = !!c.closest('[data-col-done]'); announce(($('.kanban__id', c) || {}).textContent + ' 카드를 들었습니다. 좌우 화살표로 열을, 위아래로 순서를 바꾸고 스페이스로 내려놓으세요.'); }
          else moved(board, c, c.closest('.kanban__col'));
          return;
        }
        if (e.key === 'Escape' && lifted) { c.setAttribute('aria-grabbed', 'false'); return; }
        if (!lifted && !e.altKey) return;
        var cols = $$('.kanban__col', board), col = c.closest('.kanban__col'), ci = cols.indexOf(col), list = c.parentNode;
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
          e.preventDefault();
          var to = cols[ci + (e.key === 'ArrowRight' ? 1 : -1)]; if (!to) return;
          $('.kanban__cards', to).insertBefore(c, $('.kanban__cards', to).firstChild);
          c.focus(); if (!lifted) moved(board, c, to); else { kanbanCounts(board); announce(colName(to) + ' 열'); }
        } else if (e.key === 'ArrowUp' && c.previousElementSibling) { e.preventDefault(); list.insertBefore(c, c.previousElementSibling); c.focus(); }
        else if (e.key === 'ArrowDown' && c.nextElementSibling) { e.preventDefault(); list.insertBefore(c.nextElementSibling, c); c.focus(); }
      });
      kanbanCounts(board);
    });
  }

  /* ───────────── 표 정렬 ───────────── */
  function sortTable(btn) {
    var th = btn.closest('th'), table = th.closest('table'), tbody = table.tBodies[0];
    var idx = Array.prototype.indexOf.call(th.parentNode.children, th);
    var dir = th.getAttribute('aria-sort') === 'ascending' ? 'descending' : 'ascending';
    $$('th[aria-sort]', table).forEach(function (h) { h.setAttribute('aria-sort', 'none'); });
    th.setAttribute('aria-sort', dir);
    var rows = $$('tr', tbody).filter(function (r) { return !r.classList.contains('table__empty'); });
    function val(r) { var td = r.children[idx]; if (!td) return ''; var v = td.getAttribute('data-sort') || td.textContent.trim(); var n = parseFloat(v.replace(/[^0-9.\-]/g, '')); return /\d/.test(v) && !isNaN(n) && (td.classList.contains('num') || td.hasAttribute('data-sort')) ? n : v; }
    rows.sort(function (a, b) { var x = val(a), y = val(b); var c = typeof x === 'number' && typeof y === 'number' ? x - y : String(x).localeCompare(String(y), 'ko'); return dir === 'ascending' ? c : -c; });
    rows.forEach(function (r) { tbody.appendChild(r); });
    emit(table, 'sort', { column: idx, dir: dir });
  }

  /* ───────────── 페이지네이션 ───────────── */
  function pagerSet(p, page) {
    var total = parseInt(p.getAttribute('data-total'), 10) || 1;
    page = clamp(page, 1, total);
    p.setAttribute('data-page', page);
    var cur = $('[data-pager-current]', p), tot = $('[data-pager-total]', p), line = $('.pager__line span', p);
    if (cur) cur.textContent = page; if (tot) tot.textContent = total;
    if (line) line.style.setProperty('--value', (page / total).toFixed(4));
    var pr = $('[data-pager-prev]', p), nx = $('[data-pager-next]', p);
    if (pr) pr.disabled = page <= 1; if (nx) nx.disabled = page >= total;
    var size = parseInt(p.getAttribute('data-size'), 10), count = parseInt(p.getAttribute('data-count'), 10), range = $('[data-pager-range]', p);
    if (range && size && count) range.textContent = fmtNum((page - 1) * size + 1) + '–' + fmtNum(Math.min(page * size, count)) + ' / ' + fmtNum(count) + '건';
    return page;
  }
  function initPager(scope) { $$('[data-pager]', scope).forEach(function (p) { pagerSet(p, parseInt(p.getAttribute('data-page'), 10) || 1); }); }

  /* ───────────── 스텝 · 위저드(온보딩) ───────────── */
  function setStep(steps, n) {
    $$('.steps__item', steps).forEach(function (it, i) {
      var st = i + 1 < n ? 'done' : i + 1 === n ? 'current' : 'todo';
      it.setAttribute('data-state', st);
      if (st === 'current') it.setAttribute('aria-current', 'step'); else it.removeAttribute('aria-current');
      var dot = $('.steps__dot', it);
      if (dot) { if (st === 'done') { if (!dot.getAttribute('data-n')) dot.setAttribute('data-n', dot.textContent.trim()); dot.innerHTML = '<span data-icon="check"></span><span class="sr-only">완료</span>'; hydrateIcons(dot); } else if (dot.getAttribute('data-n')) { dot.textContent = dot.getAttribute('data-n'); } }
    });
    emit(steps, 'step', { step: n });
  }
  function wizardGo(w, n) {
    var panels = $$('[data-wizard-step]', w), total = panels.length;
    n = clamp(n, 1, total);
    w.setAttribute('data-current', n);
    panels.forEach(function (p, i) { p.hidden = i + 1 !== n; if (i + 1 === n) p.setAttribute('data-entering', ''); setTimeout(function () { p.removeAttribute('data-entering'); }, 400); });
    $$('[data-wizard-count]', w).forEach(function (c) { c.innerHTML = '<b>' + n + '</b> / ' + total; });
    $$('[data-wizard-line]', w).forEach(function (l) { l.style.setProperty('--value', (n / total).toFixed(4)); l.style.setProperty('--progress', (n / total).toFixed(4)); });
    $$('.steps', w).forEach(function (s) { setStep(s, n); });
    $$('[data-wizard-prev]', w).forEach(function (b) { b.disabled = n === 1; });
    $$('[data-wizard-next]', w).forEach(function (b) { b.hidden = n === total; });
    $$('[data-wizard-done]', w).forEach(function (b) { b.hidden = n !== total; });
    var h = $('[data-wizard-step="' + n + '"] h1, [data-wizard-step="' + n + '"] h2', w);
    if (h && w._gyStarted) { h.tabIndex = -1; h.focus({ preventScroll: true }); }
    w._gyStarted = true;
    emit(w, 'step', { step: n, total: total });
  }
  function initWizard(scope) { $$('[data-wizard]', scope).forEach(function (w) { if (w._gy) return; w._gy = true; wizardGo(w, parseInt(w.getAttribute('data-current'), 10) || 1); }); }

  /* ───────────── 달력 ───────────── */
  var HOLI = { '2026-01-01': '신정', '2026-02-16': '설날 연휴', '2026-02-17': '설날', '2026-02-18': '설날 연휴', '2026-03-01': '삼일절', '2026-03-02': '대체공휴일', '2026-05-05': '어린이날', '2026-05-24': '부처님오신날', '2026-05-25': '대체공휴일', '2026-06-03': '지방선거', '2026-06-06': '현충일', '2026-08-15': '광복절', '2026-08-17': '대체공휴일', '2026-09-24': '추석 연휴', '2026-09-25': '추석', '2026-09-26': '추석 연휴', '2026-09-28': '대체공휴일', '2026-10-03': '개천절', '2026-10-05': '대체공휴일', '2026-10-09': '한글날', '2026-12-25': '성탄절' };
  var DOW = ['일', '월', '화', '수', '목', '금', '토'];
  function ymd(y, m, d) { return y + '-' + pad2(m) + '-' + pad2(d); }
  function renderCal(cal) {
    var ym = (cal.getAttribute('data-month') || '2026-10').split('-'), y = +ym[0], m = +ym[1];
    var today = cal.getAttribute('data-today') || '2026-10-27', selected = cal.getAttribute('data-selected') || '';
    var events = {};
    (cal.getAttribute('data-events') || '').split(',').forEach(function (s) { var p = s.split(':'); if (p[0]) events[p[0].trim()] = { label: (p[1] || '').trim(), signal: (p[2] || '').trim() === 'signal' }; });
    var first = new Date(y, m - 1, 1).getDay(), days = new Date(y, m, 0).getDate();
    var title = $('.cal__title', cal), grid = $('.cal__grid', cal);
    if (!grid) {
      cal.innerHTML = '<div class="cal__head"><h3 class="cal__title"></h3><div class="cal__nav"><button type="button" class="btn btn--quiet btn--icon btn--sm" data-cal-prev aria-label="이전 달"><span data-icon="chevron-left"></span></button><button type="button" class="btn btn--quiet btn--icon btn--sm" data-cal-next aria-label="다음 달"><span data-icon="chevron-right"></span></button></div></div><div class="cal__grid" role="grid"></div>';
      title = $('.cal__title', cal); grid = $('.cal__grid', cal);
    }
    title.textContent = y + '년 ' + m + '월';
    var h = '<div role="row" class="cal__row">';
    DOW.forEach(function (d) { h += '<span class="cal__dow" role="columnheader">' + d + '</span>'; });
    h += '</div><div role="row" class="cal__row">';
    for (var i = 0; i < first; i++) h += '<span class="cal__day is-out" role="gridcell" aria-hidden="true"></span>';
    for (var d = 1; d <= days; d++) {
      var key = ymd(y, m, d), dow = (first + d - 1) % 7, ev = events[key], hol = HOLI[key];
      var cls = 'cal__day' + (dow === 0 ? ' is-sun' : '') + (hol ? ' is-holiday' : '') + (ev && ev.signal ? ' is-signal' : '');
      var label = m + '월 ' + d + '일 ' + DOW[dow] + '요일' + (hol ? ', ' + hol : '') + (ev ? ', ' + ev.label : '');
      h += '<button type="button" role="gridcell" class="' + cls + '" data-date="' + key + '" aria-label="' + label + '" aria-pressed="' + (key === selected) + '"' + (key === today ? ' aria-current="date"' : '') + ' tabindex="' + ((selected ? key === selected : key === today) ? 0 : -1) + '"' + (hol ? ' title="' + hol + '"' : '') + '>' + d + (ev ? '<span class="cal__mark">' + ev.label + '</span>' : '') + '</button>';
      if (dow === 6 && d < days) h += '</div><div role="row" class="cal__row">';
    }
    h += '</div>';
    grid.innerHTML = h;
    if (!$('.cal__day[tabindex="0"]', grid)) { var f = $('.cal__day[data-date]', grid); if (f) f.tabIndex = 0; }
    hydrateIcons(cal);
  }
  function initCalendar(scope) {
    $$('[data-calendar]', scope).forEach(function (cal) {
      if (cal._gy) return; cal._gy = true;
      renderCal(cal);
      cal.addEventListener('click', function (e) {
        var day = e.target.closest('.cal__day[data-date]');
        if (day && !day.disabled) {
          $$('.cal__day[aria-pressed="true"]', cal).forEach(function (d) { d.setAttribute('aria-pressed', 'false'); });
          $$('.cal__day[data-date]', cal).forEach(function (d) { d.tabIndex = -1; });
          day.setAttribute('aria-pressed', 'true'); day.tabIndex = 0;
          cal.setAttribute('data-selected', day.getAttribute('data-date'));
          emit(cal, 'date', { date: day.getAttribute('data-date') });
          return;
        }
        var nav = e.target.closest('[data-cal-prev], [data-cal-next]');
        if (nav) {
          var ym = (cal.getAttribute('data-month') || '2026-10').split('-'), dt = new Date(+ym[0], +ym[1] - 1 + (nav.hasAttribute('data-cal-next') ? 1 : -1), 1);
          cal.setAttribute('data-month', dt.getFullYear() + '-' + pad2(dt.getMonth() + 1));
          renderCal(cal);
        }
      });
      cal.addEventListener('keydown', function (e) {
        var day = e.target.closest('.cal__day[data-date]'); if (!day) return;
        var all = $$('.cal__day[data-date]', cal), i = all.indexOf(day), mv = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: 7, ArrowUp: -7 }[e.key];
        if (e.key === 'Home') mv = -i; if (e.key === 'End') mv = all.length - 1 - i;
        if (mv === undefined) return;
        var t = all[clamp(i + mv, 0, all.length - 1)];
        if (t) { e.preventDefault(); day.tabIndex = -1; t.tabIndex = 0; t.focus(); }
      });
    });
  }

  /* ───────────── 폼 ───────────── */
  function fieldError(input, msg) {
    var field = input.closest('.field') || input.closest('.fieldset');
    var err = field && $('.field__error', field);
    if (err && msg) { var t = $('.field__error-text', err); if (t) t.textContent = msg; }
    if (err) { ensureId(err, 'err'); var ids = (input.getAttribute('aria-describedby') || '').split(' ').filter(Boolean); if (ids.indexOf(err.id) < 0) { ids.push(err.id); input.setAttribute('aria-describedby', ids.join(' ')); } }
  }
  function validate(form) {
    var bad = [];
    $$('input, select, textarea', form).forEach(function (el) {
      if (el.disabled || el.type === 'hidden') return;
      var ok = el.checkValidity();
      if (el.type === 'radio' || el.type === 'checkbox') {
        if (el.type === 'radio' && el.required) { ok = !!form.querySelector('input[name="' + el.name + '"]:checked'); }
      }
      if (!ok) { el.setAttribute('aria-invalid', 'true'); fieldError(el, el.getAttribute('data-error')); bad.push(el); }
      else el.removeAttribute('aria-invalid');
    });
    return bad;
  }
  function initForms(scope) {
    $$('form[data-validate]', scope).forEach(function (f) {
      if (f._gy) return; f._gy = true;
      f.setAttribute('novalidate', '');
      f.addEventListener('submit', function (e) {
        e.preventDefault();
        var bad = validate(f);
        if (bad.length) { bad[0].focus(); var st = $('.form-status', f); if (st) st.textContent = '확인이 필요한 칸이 ' + bad.length + '개 있어요.'; return; }
        var btn = $('[type="submit"]', f);
        if (btn) btn.setAttribute('aria-busy', 'true');
        setTimeout(function () {
          if (btn) btn.removeAttribute('aria-busy');
          var st = $('.form-status', f); if (st) st.textContent = '';
          toast({ title: f.getAttribute('data-success') || '저장했어요', text: f.getAttribute('data-success-text') || '', tone: 'success' });
          emit(f, 'submit', {});
          if (f.hasAttribute('data-reset')) f.reset();
        }, reduced() ? 300 : 1100);
      });
      f.addEventListener('input', function (e) { var el = e.target; if (el.getAttribute('aria-invalid') === 'true' && el.checkValidity()) el.removeAttribute('aria-invalid'); });
      f.addEventListener('change', function (e) { var el = e.target; if (el.type === 'radio') $$('input[name="' + el.name + '"]', f).forEach(function (r) { r.removeAttribute('aria-invalid'); }); });
    });
    $$('input.slider', scope).forEach(syncSlider);
    $$('[data-stepper]', scope).forEach(syncStepper);
  }
  function syncSlider(s) {
    var min = +s.min || 0, max = s.max === '' ? 100 : +s.max, v = +s.value;
    s.style.setProperty('--val', ((v - min) / (max - min) * 100).toFixed(2) + '%');
    var out = s.id && $('output[for="' + s.id + '"]');
    var txt = (s.getAttribute('data-prefix') || '') + v + (s.getAttribute('data-suffix') || '');
    if (out) out.textContent = txt;
    s.setAttribute('aria-valuetext', txt);
    var vname = s.getAttribute('data-var');
    if (vname) { var tgt = s.getAttribute('data-var-target') ? $(s.getAttribute('data-var-target')) : root; if (tgt) tgt.style.setProperty(vname, v + (s.getAttribute('data-var-unit') || '')); }
  }
  function syncStepper(st) {
    var input = $('input', st); if (!input) return;
    var v = +input.value || 0, min = input.min === '' ? -Infinity : +input.min, max = input.max === '' ? Infinity : +input.max;
    var dn = $('[data-step="-1"]', st), up = $('[data-step="1"]', st);
    if (dn) dn.disabled = v <= min; if (up) up.disabled = v >= max;
  }

  /* ───────────── 플레이어 ───────────── */
  function initPlayer(scope) {
    $$('[data-player]', scope).forEach(function (pl) {
      if (pl._gy) return; pl._gy = true;
      var dur = parseInt(pl.getAttribute('data-duration'), 10) || 222, pos = parseInt(pl.getAttribute('data-position'), 10) || 0, timer = 0;
      var btn = $('[data-player-toggle]', pl), track = $('[data-player-progress]', pl);
      var timeEl = $('[data-player-time]', pl), durEl = $('[data-player-duration]', pl);
      var bar = track ? (track.classList.contains('progress__track') ? track : $('.progress__track', track)) : null;
      if (durEl) durEl.textContent = fmtTime(dur);
      function render() {
        var pct = (pos / dur * 100).toFixed(2) + '%';
        if (bar) { bar.style.setProperty('--value', pct); $$('.progress__fill, .progress__knob', bar).forEach(function (n) { n.style.setProperty('--value', pct); }); bar.setAttribute('aria-valuenow', pos); bar.setAttribute('aria-valuetext', fmtTime(pos) + ' / ' + fmtTime(dur)); }
        if (timeEl) timeEl.textContent = fmtTime(pos);
      }
      function play(on) {
        pl.toggleAttribute('data-playing', on);
        if (btn) { btn.setAttribute('aria-pressed', String(on)); btn.setAttribute('aria-label', on ? '일시정지' : '재생'); var ic = $('[data-icon]', btn); if (ic) setIcon(ic, on ? 'pause' : 'play'); }
        $$('.list__row[aria-current="true"]').forEach(function (r) { r.toggleAttribute('data-paused', !on); });
        clearInterval(timer);
        if (on) timer = setInterval(function () { pos += 1; if (pos >= dur) { pos = 0; } render(); }, 1000);
        emit(pl, 'player', { playing: on, position: pos });
      }
      if (btn) btn.addEventListener('click', function () { play(!pl.hasAttribute('data-playing')); });
      if (bar) {
        bar.setAttribute('role', 'slider'); bar.tabIndex = 0;
        bar.setAttribute('aria-valuemin', 0); bar.setAttribute('aria-valuemax', dur);
        if (!bar.hasAttribute('aria-label')) bar.setAttribute('aria-label', '재생 위치');
        bar.addEventListener('click', function (e) { var r = bar.getBoundingClientRect(); pos = Math.round(clamp((e.clientX - r.left) / r.width, 0, 1) * dur); render(); });
        bar.addEventListener('keydown', function (e) {
          var d = { ArrowRight: 5, ArrowUp: 5, ArrowLeft: -5, ArrowDown: -5, PageUp: 30, PageDown: -30 }[e.key];
          if (e.key === 'Home') d = -pos; if (e.key === 'End') d = dur - pos;
          if (d !== undefined) { e.preventDefault(); e.stopPropagation(); pos = clamp(pos + d, 0, dur); render(); }
        });
      }
      $$('[data-player-prev]', pl).forEach(function (b) { b.addEventListener('click', function () { pos = 0; render(); }); });
      render();
      if (pl.hasAttribute('data-autoplay') && !reduced()) play(true);
    });
  }

  /* ───────────── 실시간 차트 (동시 시청자) ───────────── */
  function initLiveChart(scope) {
    $$('[data-livechart]', scope).forEach(function (lc) {
      if (lc._gy) return; lc._gy = true;
      var plot = $('.livechart__plot', lc); if (!plot) return;
      var basev = parseFloat(lc.getAttribute('data-base')) || 41092, n = 60, W = 600, H = 200;
      var seed = 7, data = [];
      function rnd() { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; }
      var v = basev * 1.32;
      for (var i = 0; i < n; i++) { v = v + (basev - v) * 0.06 + (rnd() - 0.5) * basev * 0.03; data.push(v); }
      data[n - 1] = basev;
      var max = parseFloat(lc.getAttribute('data-max')) || 70000;
      plot.innerHTML = '<svg viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="none" aria-hidden="true"><line class="livechart__grid" x1="0" x2="' + W + '" y1="' + H * 0.25 + '" y2="' + H * 0.25 + '"/><line class="livechart__grid" x1="0" x2="' + W + '" y1="' + H * 0.5 + '" y2="' + H * 0.5 + '"/><line class="livechart__grid" x1="0" x2="' + W + '" y1="' + H * 0.75 + '" y2="' + H * 0.75 + '"/><path class="livechart__area"/><path class="livechart__line"/></svg>';
      var area = $('.livechart__area', plot), line = $('.livechart__line', plot), out = $('[data-livechart-value]', lc), btn = $('[data-livechart-toggle]', lc);
      function y(val) { return (H - val / max * H).toFixed(1); }
      function draw() {
        var d = '';
        data.forEach(function (val, i) { d += (i ? 'L' : 'M') + (i / (n - 1) * W).toFixed(1) + ' ' + y(val); });
        line.setAttribute('d', d);
        area.setAttribute('d', d + 'L' + W + ' ' + H + 'L0 ' + H + 'Z');
        if (out) out.textContent = fmtNum(data[n - 1]);
      }
      draw();
      var t = 0;
      function run(on) {
        clearInterval(t);
        lc.toggleAttribute('data-paused', !on);
        if (btn) { btn.setAttribute('aria-pressed', String(!on)); var lb = $('.livechart__toggle-label', btn); if (lb) lb.textContent = on ? '일시정지' : '이어 보기'; var ic = $('[data-icon]', btn); if (ic) setIcon(ic, on ? 'pause' : 'play'); }
        if (on) t = setInterval(function () { var last = data[n - 1]; data.shift(); data.push(Math.max(0, last + (basev - last) * 0.1 + (rnd() - 0.5) * basev * 0.025)); draw(); }, 1500);
      }
      if (btn) btn.addEventListener('click', function () { run(lc.hasAttribute('data-paused')); });
      run(!reduced() && !lc.hasAttribute('data-start-paused'));
    });
  }

  /* ───────────── 드리프트 토글 ───────────── */
  function toggleDrift(btn) {
    var sel = btn && btn.getAttribute('data-drift-toggle');
    var meshes = sel ? $$(sel) : $$('.mesh--drift');
    var off = !(meshes[0] && meshes[0].getAttribute('data-drift') === 'off');
    meshes.forEach(function (m) { if (off) m.setAttribute('data-drift', 'off'); else m.removeAttribute('data-drift'); });
    $$('[data-drift-toggle]').forEach(function (b) { if (!sel || b.getAttribute('data-drift-toggle') === sel) b.setAttribute('aria-pressed', String(!off)); });
    if (!btn) toast({ title: off ? '메쉬 드리프트를 멈췄어요' : '메쉬 드리프트를 다시 켰어요', tone: 'success' });
  }

  /* ───────────── 전역 클릭 위임 ───────────── */
  doc.addEventListener('click', function (e) {
    var t = e.target;
    if (!t.closest) return;
    var el;

    if ((el = t.closest('[data-theme-toggle]'))) { toggleTheme(e); return; }
    if ((el = t.closest('[data-command-open]'))) { e.preventDefault(); buildCommand(); initCommand($('#command')); open('command', el); return; }
    if ((el = t.closest('[data-open]')) && !el.classList.contains('command__item')) { e.preventDefault(); open(el.getAttribute('data-open'), el); }
    if ((el = t.closest('[data-close]'))) {
      var id = el.getAttribute('data-close');
      var ov = id ? doc.getElementById(id) : el.closest(OVERLAY_SEL + ', .popover, .menu');
      if (ov && (ov.classList.contains('popover') || ov.classList.contains('menu'))) closeFloating(true); else if (ov) close(ov);
      return;
    }
    if ((el = t.closest('[data-popover], [data-menu]'))) {
      var pid = el.getAttribute('data-popover') || el.getAttribute('data-menu'), panel = doc.getElementById(pid);
      if (panel) { e.preventDefault(); if (floating && floating.panel === panel) closeFloating(); else openFloating(panel, el, e.detail === 0); }
      return;
    }
    if (floating && !floating.panel.contains(t)) closeFloating();

    if ((el = t.closest('[data-mood-set]')) && el.tagName !== 'INPUT' && !el.classList.contains('command__item')) {
      var ms = el.getAttribute('data-mood-set'), mt = el.getAttribute('data-mood-target');
      setMood(ms, mt ? $(mt) : undefined);
    }
    if ((el = t.closest('.menu__item'))) {
      if (el.getAttribute('role') === 'menuitemradio') { var g = el.getAttribute('data-group'); $$('.menu__item[role="menuitemradio"]' + (g ? '[data-group="' + g + '"]' : ''), el.closest('.menu')).forEach(function (r) { r.setAttribute('aria-checked', String(r === el)); }); }
      if (el.getAttribute('role') === 'menuitemcheckbox') el.setAttribute('aria-checked', String(el.getAttribute('aria-checked') !== 'true'));
      if (!el.hasAttribute('data-keep-open') && floating && floating.panel.contains(el)) closeFloating(true);
    }
    if ((el = t.closest('.accordion__trigger'))) { toggleAccordion(el); return; }
    if ((el = t.closest('.table__sort'))) { sortTable(el); return; }
    if ((el = t.closest('[data-pager-prev], [data-pager-next]'))) {
      var p = el.closest('[data-pager]');
      var pg = pagerSet(p, (parseInt(p.getAttribute('data-page'), 10) || 1) + (el.hasAttribute('data-pager-next') ? 1 : -1));
      emit(p, 'page', { page: pg });
      return;
    }
    if ((el = t.closest('[data-wizard-next], [data-wizard-prev]'))) {
      var w = el.closest('[data-wizard]'), cur = parseInt(w.getAttribute('data-current'), 10) || 1;
      if (el.hasAttribute('data-wizard-next')) {
        var panelEl = $('[data-wizard-step="' + cur + '"]', w), bad = panelEl ? validate(panelEl) : [];
        if (bad.length) { bad[0].focus(); return; }
      }
      wizardGo(w, cur + (el.hasAttribute('data-wizard-next') ? 1 : -1));
      return;
    }
    if ((el = t.closest('.steps__dot[data-goto]'))) { var wz = el.closest('[data-wizard]'); if (wz) wizardGo(wz, parseInt(el.getAttribute('data-goto'), 10)); return; }
    if ((el = t.closest('[data-step]')) && el.closest('[data-stepper]')) {
      var st = el.closest('[data-stepper]'), inp = $('input', st);
      var nv = (+inp.value || 0) + parseInt(el.getAttribute('data-step'), 10);
      if ((inp.min === '' || nv >= +inp.min) && (inp.max === '' || nv <= +inp.max)) { inp.value = nv; inp.dispatchEvent(new Event('change', { bubbles: true })); }
      syncStepper(st);
      return;
    }
    if ((el = t.closest('button.mesh__handle[data-p]')) && el.closest('[data-restore]')) { onRestoreHandle(el); return; }
    if ((el = t.closest('[data-drift-toggle]'))) { toggleDrift(el); return; }
    if ((el = t.closest('[data-copy]'))) {
      var txt = el.getAttribute('data-copy') || ((el.getAttribute('data-copy-target') && $(el.getAttribute('data-copy-target'))) || {}).textContent || '';
      var fin = function () {
        el.setAttribute('data-copied', '');
        var lb = $('.code__copy-label', el) || el; var old = lb.textContent;
        if (lb !== el) lb.textContent = '복사됨';
        setTimeout(function () { el.removeAttribute('data-copied'); if (lb !== el) lb.textContent = old; }, 1500);
        toast({ title: '클립보드에 복사했어요', tone: 'success', duration: 2600 });
      };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt.trim()).then(fin, fin); else fin();
      return;
    }
    if ((el = t.closest('[data-dismiss]'))) { var a = el.closest('.alert, [data-dismissible]'); if (a) { a.classList.add('is-leaving'); setTimeout(function () { a.remove(); }, reduced() ? 0 : 320); } return; }
    if ((el = t.closest('[data-toggle-pressed]'))) {
      var on = el.getAttribute('aria-pressed') !== 'true';
      el.setAttribute('aria-pressed', String(on));
      var on1 = el.getAttribute('data-label-on'), off1 = el.getAttribute('data-label-off');
      if (on1 && off1) el.setAttribute('aria-label', on ? on1 : off1);
      var swap = el.getAttribute('data-icon-on');
      if (swap) { var ic = $('[data-icon]', el); if (ic) { if (!el._gyIconOff) el._gyIconOff = ic.getAttribute('data-icon'); setIcon(ic, on ? swap : el._gyIconOff); } }
    }
    if ((el = t.closest('[data-busy]'))) {
      if (el.getAttribute('aria-busy') === 'true') return;
      el.setAttribute('aria-busy', 'true');
      setTimeout(function () { el.removeAttribute('aria-busy'); if (el.hasAttribute('data-toast')) toastFrom(el); }, parseInt(el.getAttribute('data-busy'), 10) || 1400);
      return;
    }
    if ((el = t.closest('[data-toast]')) && !el.classList.contains('command__item')) { toastFrom(el); }
    if ((el = t.closest('[data-scene-link], a[href^="#"]')) && deck) {
      var tgt = doc.getElementById((el.getAttribute('href') || '').slice(1));
      if (tgt && deck.scenes.indexOf(tgt) > -1) { e.preventDefault(); deck.go(deck.scenes.indexOf(tgt)); }
    }
    if ((el = t.closest('.list__row[role="option"]'))) {
      var lb2 = el.closest('[role="listbox"]');
      if (lb2) { $$('.list__row[role="option"]', lb2).forEach(function (r) { r.setAttribute('aria-selected', String(r === el)); }); el.classList.remove('is-unread'); emit(el, 'select', { id: el.id }); }
    }
  });

  doc.addEventListener('change', function (e) {
    var t = e.target;
    if (t.matches('input[data-mood-set]') && t.checked) { var mt = t.getAttribute('data-mood-target'); setMood(t.getAttribute('data-mood-set'), mt ? $(mt) : undefined); }
    if (t.matches('[data-bind-attr]')) {
      var tgt = $(t.getAttribute('data-bind-target'));
      if (tgt && (t.type !== 'radio' || t.checked)) tgt.setAttribute(t.getAttribute('data-bind-attr'), t.value);
    }
    if (t.closest('[data-stepper]')) syncStepper(t.closest('[data-stepper]'));
  });
  doc.addEventListener('input', function (e) { if (e.target.matches('input.slider')) syncSlider(e.target); });

  /* ───────────── 키보드 ───────────── */
  function typing(t) { return t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)); }
  doc.addEventListener('keydown', function (e) {
    // ⌘K / Ctrl+K
    if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
      e.preventDefault();
      buildCommand(); var cmd = $('#command'); initCommand(cmd);
      if (stack.indexOf(cmd) > -1) close(cmd); else open(cmd);
      return;
    }
    if (e.key === 'Escape') {
      if (tip && tip.classList.contains('is-open')) { hideTip(); return; }
      if (floating) { closeFloating(true); return; }
      var top = topOverlay(); if (top) { e.preventDefault(); close(top); }
      return;
    }
    // 포커스 트랩
    if (e.key === 'Tab') {
      var ov = topOverlay(); if (!ov) return;
      var f = focusables(ov); if (!f.length) { e.preventDefault(); return; }
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && (doc.activeElement === first || !ov.contains(doc.activeElement))) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && (doc.activeElement === last || !ov.contains(doc.activeElement))) { e.preventDefault(); first.focus(); }
      return;
    }
    // 메뉴 화살표 이동
    if (floating && floating.panel.classList.contains('menu') && /^(ArrowDown|ArrowUp|Home|End)$/.test(e.key)) {
      var items = menuItems(floating.panel), i = items.indexOf(doc.activeElement);
      e.preventDefault();
      var n = e.key === 'Home' ? 0 : e.key === 'End' ? items.length - 1 : e.key === 'ArrowDown' ? (i + 1) % items.length : (i - 1 + items.length) % items.length;
      if (items[n]) items[n].focus();
      return;
    }
    if (typing(e.target) || e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.key === 'D' && e.shiftKey) { toggleTheme(); return; }
    // 키노트 덱: ←/→/PageUp/PageDown 으로 장면 이동
    if (deck && !stack.length && !floating) {
      var ignore = e.target.closest && e.target.closest('[role="tablist"], .carousel__viewport, [role="slider"], [role="grid"], .kanban, [role="listbox"], [role="menu"], .tabs__list');
      if (ignore) return;
      if (e.key === 'ArrowRight' || e.key === 'PageDown') { e.preventDefault(); deck.go(deck.index + 1); }
      else if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); deck.go(deck.index - 1); }
    }
    if ((e.key === 'q' || e.key === 'Q') && doc.getElementById('queue') && !stack.length) { open('queue'); }
  });

  /* ───────────── 초기화 ───────────── */
  function init(scope) {
    scope = scope || doc;
    hydrateIcons(scope);
    initTabs(scope);
    initAccordion(scope);
    initCarousel(scope);
    initMarquee(scope);
    initReveal(scope);
    initKanban(scope);
    initPager(scope);
    initWizard(scope);
    initCalendar(scope);
    initForms(scope);
    initPlayer(scope);
    initLiveChart(scope);
    initMeshFollow(scope);
    initDrift(scope);
    $$('.steps[data-step]', scope).forEach(function (s) { setStep(s, parseInt(s.getAttribute('data-step'), 10) || 1); });
    var cmd = $('#command', scope); if (cmd) initCommand(cmd);
    refreshMeshLabels(scope);
  }
  function boot() {
    syncThemeToggles();
    init(doc);
    initDeck();
    scrollProgress();
    var raf = 0;
    window.addEventListener('scroll', function () { if (!raf) raf = requestAnimationFrame(function () { raf = 0; scrollProgress(); }); }, { passive: true });
    window.addEventListener('resize', scrollProgress);
    // 문서 폰트 로드 후 메쉬 라벨 다시 계산(레이아웃 변화 대비)
    if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(function () { scrollProgress(); $$('.tabs__list').forEach(updateOverflow); });
  }
  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', boot); else boot();

  window.gy = {
    init: init, open: open, close: close, toast: toast,
    setTheme: function (t) { setTheme(t, true); }, toggleTheme: toggleTheme,
    setMood: setMood, setStep: setStep, wizardGo: wizardGo,
    icon: icon, icons: ICONS, hydrateIcons: hydrateIcons, moods: MOODS
  };
})();
