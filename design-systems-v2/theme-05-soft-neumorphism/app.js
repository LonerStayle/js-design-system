/* ==========================================================================
   몽돌 오디오 · app.js — 바닐라 JS (외부 라이브러리 없음)
    1 아이콘          2 조명(테마)        3 LCD 잔상 · 범프   4 오버레이(모달·서랍·팔레트) + 포커스 트랩
    5 커맨드 팔레트    6 탭               7 아코디언          8 토스트
    9 메뉴 · 팝오버    10 툴팁            11 캐러셀           12 노브
   13 페이더          14 레벨 미터        15 칸반             16 표(정렬·선택)
   17 달력 · 키 열 · 칩 · 페이지 키        18 로딩 · 오류 · 복사  19 마키
   20 전원 켜짐 시퀀스 21 각 부 점등(data-light)  22 폼 검증    23 마법사(steps)
   24 랙 스크롤스파이 · 스크롤 힌트       25 모션 시연         26 Esc
   ========================================================================== */
(() => {
  'use strict';
  const doc = document;
  const root = doc.documentElement;
  const $ = (s, c = doc) => c.querySelector(s);
  const $$ = (s, c = doc) => Array.from(c.querySelectorAll(s));
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  let uid = 0;
  const ensureId = (el, p = 'md') => el.id || (el.id = `${p}-${++uid}`);
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* 저장 불가 환경 */ } },
  };
  const session = {
    get(k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { sessionStorage.setItem(k, v); } catch (e) { /* 무시 */ } },
  };
  const live = (() => {
    let el;
    return (msg) => {
      if (!el) {
        el = doc.createElement('div');
        el.className = 'sr-only';
        el.setAttribute('aria-live', 'polite');
        doc.body.appendChild(el);
      }
      el.textContent = '';
      setTimeout(() => { el.textContent = msg; }, 30);
    };
  })();

  /* ── 1. 아이콘 (24 그리드, stroke 1.75, currentColor) ─────────────── */
  const ICONS = {
    power: '<path d="M12 3v8"/><path d="M6.3 7.2a8 8 0 1 0 11.4 0"/>',
    volume: '<path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11"/>',
    mute: '<path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="m16 9.5 5 5M21 9.5l-5 5"/>',
    search: '<circle cx="11" cy="11" r="6.5"/><path d="m20 20-4.2-4.2"/>',
    'chevron-left': '<path d="m15 18-6-6 6-6"/>',
    'chevron-right': '<path d="m9 18 6-6-6-6"/>',
    'chevron-down': '<path d="m6 9 6 6 6-6"/>',
    'chevron-up': '<path d="m18 15-6-6-6 6"/>',
    close: '<path d="M18 6 6 18M6 6l12 12"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    minus: '<path d="M5 12h14"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    moon: '<path d="M20.5 14.5A8.5 8.5 0 1 1 9.5 3.5a7 7 0 0 0 11 11z"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M4.6 4.6l1.4 1.4M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    grid: '<rect x="4" y="4" width="6.5" height="6.5" rx="2"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="2"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="2"/><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="2"/>',
    settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
    bell: '<path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
    inbox: '<path d="M3 13h5l1.5 3h5L16 13h5"/><path d="M5.5 5h13L21 13v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-6z"/>',
    home: '<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
    chart: '<path d="M4 20V10M10 20V4M16 20v-7M21 20H3"/>',
    board: '<rect x="3" y="4" width="5" height="16" rx="1.5"/><rect x="10" y="4" width="5" height="11" rx="1.5"/><rect x="17" y="4" width="4" height="7" rx="1.5"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    tag: '<path d="M3 12V4a1 1 0 0 1 1-1h8l9 9-9 9z"/><circle cx="7.5" cy="7.5" r="1.5"/>',
    box: '<path d="M21 8 12 3 3 8v8l9 5 9-5z"/><path d="m3 8 9 5 9-5M12 13v8"/>',
    alert: '<path d="M10.3 3.9 2.4 18a2 2 0 0 0 1.7 3h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
    error: '<circle cx="12" cy="12" r="9"/><path d="m15 9-6 6M9 9l6 6"/>',
    copy: '<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1"/>',
    play: '<path d="M7 4.5v15l12-7.5z"/>',
    pause: '<path d="M8 5v14M16 5v14"/>',
    next: '<path d="M5 5v14l10-7zM19 5v14"/>',
    prev: '<path d="M19 5v14L9 12zM5 5v14"/>',
    wrench: '<path d="M14.7 6.3a4 4 0 0 0 5 5L21 13l-8 8-3-3 8-8-1.3-1.3a4 4 0 0 0-5-5L14 6z"/><path d="M3 21l6-6"/>',
    sliders: '<path d="M6 4v6M6 14v6M12 4v2M12 10v10M18 4v10M18 18v2"/><path d="M4 12h4M10 8h4M16 16h4"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
    'arrow-right': '<path d="M5 12h14M13 6l6 6-6 6"/>',
    'arrow-left': '<path d="M19 12H5M11 18l-6-6 6-6"/>',
    trash: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
    edit: '<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="m13.5 6.5 4 4"/>',
    refresh: '<path d="M20 11a8 8 0 0 0-14.8-4M4 4v4h4"/><path d="M4 13a8 8 0 0 0 14.8 4M20 20v-4h-4"/>',
    thermo: '<path d="M14 14.8V4.5a2 2 0 0 0-4 0v10.3a4 4 0 1 0 4 0z"/>',
    wifi: '<path d="M2.5 9a14 14 0 0 1 19 0M5.5 12.5a9.5 9.5 0 0 1 13 0M8.5 16a5 5 0 0 1 7 0"/><path d="M12 19.5h.01"/>',
    bluetooth: '<path d="m7 7 10 10-5 4V3l5 4L7 17"/>',
    usb: '<path d="M12 3v15"/><circle cx="12" cy="19.5" r="1.5"/><path d="m9 6 3-3 3 3M12 13 7 10V8M12 15l5-3V9"/><rect x="5.5" y="6.5" width="3" height="2" rx=".5"/><circle cx="17" cy="8" r="1"/>',
    optical: '<circle cx="12" cy="12" r="8.5"/><path d="M8.5 9h7v6h-7z"/>',
    disc: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="2.5"/><path d="M12 6.5a5.5 5.5 0 0 1 5.5 5.5"/>',
    headphones: '<path d="M4 15v-3a8 8 0 0 1 16 0v3"/><rect x="3" y="14" width="4.5" height="6.5" rx="1.5"/><rect x="16.5" y="14" width="4.5" height="6.5" rx="1.5"/>',
    speaker: '<rect x="5" y="2.5" width="14" height="19" rx="3"/><circle cx="12" cy="14.5" r="3.5"/><circle cx="12" cy="7" r="1.3"/>',
    knob: '<circle cx="12" cy="12" r="8"/><path d="M12 4.5v5"/>',
    download: '<path d="M12 4v11M7 10l5 5 5-5M4 20h16"/>',
    more: '<circle cx="5" cy="12" r="1.3"/><circle cx="12" cy="12" r="1.3"/><circle cx="19" cy="12" r="1.3"/>',
    grip: '<circle cx="9" cy="6" r="1"/><circle cx="15" cy="6" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="9" cy="18" r="1"/><circle cx="15" cy="18" r="1"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3.5 6.5 8.5 6.5 8.5-6.5"/>',
    send: '<path d="M21 3 10 14M21 3l-7 18-4-7-7-4z"/>',
    phone: '<path d="M5 3.5h3.5l2 5-2.5 1.5a11 11 0 0 0 6 6l1.5-2.5 5 2V19a2 2 0 0 1-2 2A17 17 0 0 1 3 5.5a2 2 0 0 1 2-2z"/>',
    pin: '<path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
    cart: '<circle cx="9" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/><path d="M2.5 3.5h3l2.4 11.6a1 1 0 0 0 1 .9h9.3a1 1 0 0 0 1-.8L21 8H6.3"/>',
    shield: '<path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z"/><path d="m9 12 2 2 4-4"/>',
    signal: '<path d="M4 20v-3M9 20v-7M14 20V9M19 20V4"/>',
    sort: '<path d="m7 15 5 5 5-5M7 9l5-5 5 5"/>',
    filter: '<path d="M3 5h18l-7 8.5V20l-4-2v-4.5z"/>',
    external: '<path d="M14 4h6v6M20 4l-9 9"/><path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>',
    lock: '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
    star: '<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1 6.2L12 17.3 6.5 20.2l1-6.2L3 9.6l6.2-.9z"/>',
    list: '<path d="M9 6h11M9 12h11M9 18h11"/><circle cx="4.5" cy="6" r="1"/><circle cx="4.5" cy="12" r="1"/><circle cx="4.5" cy="18" r="1"/>',
    book: '<path d="M4 19.5V5a2 2 0 0 1 2-2h14v15H6a2 2 0 0 0-2 2 2 2 0 0 0 2 2h14"/>',
    night: '<path d="M20.5 14.5A8.5 8.5 0 1 1 9.5 3.5a7 7 0 0 0 11 11z"/><path d="M17 3.5v3M15.5 5h3"/>',
    firmware: '<rect x="6" y="6" width="12" height="12" rx="2"/><path d="M9 2.5V6M15 2.5V6M9 18v3.5M15 18v3.5M2.5 9H6M2.5 15H6M18 9h3.5M18 15h3.5"/><path d="M10 10h4v4h-4z"/>',
    output: '<rect x="3" y="7" width="18" height="10" rx="2"/><circle cx="8" cy="12" r="2"/><circle cx="16" cy="12" r="2"/>',
    receipt: '<path d="M6 3h12v18l-3-2-3 2-3-2-3 2z"/><path d="M9 8h6M9 12h6M9 16h3"/>',
  };
  function paintIcons(scope = doc) {
    $$('[data-icon]', scope).forEach((el) => {
      const name = el.getAttribute('data-icon');
      if (el.dataset.painted === name || !ICONS[name]) return;
      el.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">${ICONS[name]}</svg>`;
      el.dataset.painted = name;
      if (!el.hasAttribute('aria-label')) el.setAttribute('aria-hidden', 'true');
    });
  }

  /* ── 2. 조명(테마): URL ?theme= 최우선 → localStorage → 시스템 ───── */
  const THEME_KEY = 'md-theme';
  const queryTheme = (() => {
    const q = new URLSearchParams(location.search).get('theme');
    return q === 'dark' || q === 'light' ? q : null;
  })();
  function currentTheme() { return root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'; }
  function applyTheme(t) {
    root.setAttribute('data-theme', t);
    $$('[data-theme-toggle]').forEach((b) => {
      const night = t === 'dark';
      if (b.getAttribute('role') === 'switch') b.setAttribute('aria-checked', String(night));
      else b.setAttribute('aria-pressed', String(night));
      b.setAttribute('aria-label', night ? '주간 조명으로 전환 (지금 야간)' : '야간 조명으로 전환 (지금 주간)');
    });
  }
  function initTheme() {
    let t = queryTheme || store.get(THEME_KEY);
    if (t !== 'dark' && t !== 'light') t = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    applyTheme(t);
    doc.addEventListener('click', (e) => {
      const b = e.target.closest('[data-theme-toggle]');
      if (!b) return;
      const next = currentTheme() === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      store.set(THEME_KEY, next);
    });
    matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (queryTheme || store.get(THEME_KEY)) return;
      applyTheme(e.matches ? 'dark' : 'light');
    });
  }

  /* ── 3. LCD 잔상(88) · 밝기 범프 ─────────────────────────────────── */
  /* 잔상은 '숫자만 이어진 구간'에만 깐다. 글자(VOL, NET…)·기호(₩, -, /)가 섞인 값은 잔상 없음 —
     세그먼트 폰트가 아니라서 글자 틈으로 8 이 비쳐 깨진 글자처럼 읽히기 때문이다.
     ':' '.' ',' 는 그대로 두고 숫자만 8 로 바꾼다. data-ghost="off" 는 잔상을 끈다. */
  const GHOSTABLE = /^[0-9:.,]+$/;
  function ghostOf(text) {
    const t = String(text).trim();
    return GHOSTABLE.test(t) ? t.replace(/[0-9]/g, '8') : '';
  }
  function applyGhost(el, text) {
    const g = ghostOf(text);
    if (g) el.setAttribute('data-ghost', g); else el.removeAttribute('data-ghost');
  }
  function paintGhosts(scope = doc) {
    $$('.lcd-seg', scope).forEach((el) => {
      if (el.dataset.ghostOff !== undefined || el.getAttribute('data-ghost') === 'off') { el.removeAttribute('data-ghost'); el.dataset.ghostOff = ''; return; }
      el.dataset.autoGhost = '1';
      applyGhost(el, el.textContent);
    });
  }
  function setLcdText(el, text) {
    if (!el) return;
    if (el.textContent === text) return;
    el.textContent = text;
    if (el.classList.contains('lcd-seg') && el.dataset.autoGhost) applyGhost(el, text);
    const lcd = el.closest('.lcd');
    if (lcd && !reduce.matches) {
      lcd.classList.remove('is-bump');
      void lcd.offsetWidth;
      lcd.classList.add('is-bump');
    }
  }

  /* 7-세그먼트 숫자 (면판 메인 판독값) — 꺼진 막대가 진짜 잔상이 된다 */
  const SEG_ON = { 0: 'abcdef', 1: 'bc', 2: 'abdeg', 3: 'abcdg', 4: 'bcfg', 5: 'acdfg', 6: 'acdefg', 7: 'abc', 8: 'abcdefg', 9: 'abcdfg', '-': 'g' };
  function renderSeg7(el, str, bump) {
    const n = Number(el.dataset.digits || 2);
    let ds = $$('.seg7__d', el);
    if (ds.length !== n) {
      el.innerHTML = Array.from({ length: n }, () => '<span class="seg7__d">' + 'abcdefg'.split('').map((c) => `<i class="seg7__s" data-s="${c}"></i>`).join('') + '</span>').join('');
      ds = $$('.seg7__d', el);
    }
    const t = String(str).slice(-n).padStart(n, ' ');
    if (el.dataset.value === t && ds[0].dataset.ready) return;
    el.dataset.value = t;
    ds[0].dataset.ready = '1';
    ds.forEach((d, i) => {
      const on = SEG_ON[t[i]] || '';
      $$('.seg7__s', d).forEach((sg) => sg.classList.toggle('is-on', on.includes(sg.dataset.s)));
    });
    const lcd = el.closest('.lcd');
    if (bump && lcd && !reduce.matches) { lcd.classList.remove('is-bump'); void lcd.offsetWidth; lcd.classList.add('is-bump'); }
  }
  function initSeg7() { $$('.seg7').forEach((el) => renderSeg7(el, el.dataset.value || el.getAttribute('data-init') || '')); }

  /* ── 4. 오버레이 (모달 · 서랍 · 커맨드) ─────────────────────────── */
  const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
  const overlayStack = [];
  function trapTab(e, box) {
    /* tabindex=-1 인 요소(팔레트 결과 항목 등)는 탭 순서에 없으므로 처음/끝 계산에서 뺀다 */
    const f = $$(FOCUSABLE, box).filter((el) => el.tabIndex >= 0 && (el.offsetParent !== null || el === doc.activeElement));
    if (!f.length) { e.preventDefault(); return; }
    if (f.length === 1) { e.preventDefault(); f[0].focus(); return; }
    if (!box.contains(doc.activeElement)) { e.preventDefault(); (e.shiftKey ? f[f.length - 1] : f[0]).focus(); return; }
    const first = f[0];
    const last = f[f.length - 1];
    if (e.shiftKey && doc.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && doc.activeElement === last) { e.preventDefault(); first.focus(); }
  }
  function openOverlay(el, opener) {
    if (!el || el.classList.contains('is-open')) return;
    closeFloating();
    el.classList.remove('is-closing');
    el.classList.add('is-open');
    el.setAttribute('aria-hidden', 'false');
    overlayStack.push({ el, opener: opener || doc.activeElement });
    doc.body.classList.add('has-overlay');
    $$('[data-modal-open], [data-drawer-open], [data-command-open]').forEach((t) => {
      const id = t.getAttribute('data-modal-open') || t.getAttribute('data-drawer-open');
      if (id === el.id) t.setAttribute('aria-expanded', 'true');
    });
    /* 모달은 하단 첫 키(대개 '취소')에, 서랍·팔레트는 첫 조작부에 포커스 */
    const target = $('[data-autofocus]', el) || $('.modal__foot button', el) || $(FOCUSABLE, el.querySelector('.modal__slab, .drawer__panel, .command__slab') || el);
    requestAnimationFrame(() => target && target.focus());
  }
  function closeOverlay(el) {
    if (!el || !el.classList.contains('is-open')) return;
    const i = overlayStack.findIndex((o) => o.el === el);
    const entry = i > -1 ? overlayStack.splice(i, 1)[0] : null;
    const done = () => {
      el.classList.remove('is-open', 'is-closing');
      el.setAttribute('aria-hidden', 'true');
      if (!overlayStack.length) doc.body.classList.remove('has-overlay');
    };
    $$('[data-modal-open], [data-drawer-open]').forEach((t) => {
      const id = t.getAttribute('data-modal-open') || t.getAttribute('data-drawer-open');
      if (id === el.id) t.setAttribute('aria-expanded', 'false');
    });
    if (reduce.matches) done();
    else { el.classList.add('is-closing'); setTimeout(done, 140); }
    if (entry && entry.opener && entry.opener.focus) entry.opener.focus();
  }
  function initOverlays() {
    $$('.modal:not(.modal--static), .drawer:not(.drawer--static), .command:not(.command--static)').forEach((el) => {
      el.setAttribute('aria-hidden', 'true');
      el.addEventListener('mousedown', (e) => { if (e.target === el) closeOverlay(el); });
      el.addEventListener('keydown', (e) => { if (e.key === 'Tab') trapTab(e, el); });
    });
    doc.addEventListener('click', (e) => {
      const o = e.target.closest('[data-modal-open], [data-drawer-open]');
      if (o) {
        e.preventDefault();
        openOverlay(doc.getElementById(o.getAttribute('data-modal-open') || o.getAttribute('data-drawer-open')), o);
        return;
      }
      const c = e.target.closest('[data-modal-close], [data-drawer-close]');
      if (c) {
        const box = c.closest('.modal, .drawer');
        if (box && !box.matches('.modal--static, .drawer--static')) closeOverlay(box);
        if (c.hasAttribute('data-toast')) toastFrom(c);
      }
    });
  }

  /* ── 5. 커맨드 팔레트 (⌘K / Ctrl+K) ──────────────────────────────── */
  function initCommand() {
    $$('.command').forEach((cmd) => {
      const input = $('.command__input', cmd);
      const list = $('.command__list', cmd);
      if (!input || !list) return;
      const items = $$('.command__item', cmd);
      const empty = $('.command__empty', cmd);
      ensureId(list, 'cmd-list');
      input.setAttribute('role', 'combobox');
      input.setAttribute('aria-controls', list.id);
      input.setAttribute('aria-expanded', 'true');
      input.setAttribute('aria-autocomplete', 'list');
      list.setAttribute('role', 'listbox');
      items.forEach((it) => { it.setAttribute('role', 'option'); ensureId(it, 'cmd-opt'); it.tabIndex = -1; });
      let active = 0;
      const visible = () => items.filter((it) => !it.hidden);
      const mark = (i, quiet) => {
        const v = visible();
        items.forEach((it) => it.setAttribute('aria-selected', 'false'));
        if (!v.length) { input.removeAttribute('aria-activedescendant'); return; }
        active = (i + v.length) % v.length;
        v[active].setAttribute('aria-selected', 'true');
        input.setAttribute('aria-activedescendant', v[active].id);
        /* 첫 렌더·정적 견본에서는 스크롤하지 않는다 (페이지가 견본 위치로 튀는 문제) */
        if (!quiet && cmd.classList.contains('is-open')) v[active].scrollIntoView({ block: 'nearest' });
      };
      const filter = (quiet) => {
        const q = input.value.trim().toLowerCase();
        items.forEach((it) => {
          const hay = (it.textContent + ' ' + (it.dataset.keywords || '')).toLowerCase();
          it.hidden = q !== '' && !hay.includes(q);
        });
        $$('.command__group', cmd).forEach((g) => {
          let n = g.nextElementSibling;
          let any = false;
          while (n && !n.classList.contains('command__group')) { if (n.classList.contains('command__item') && !n.hidden) any = true; n = n.nextElementSibling; }
          g.hidden = !any;
        });
        if (empty) empty.hidden = visible().length > 0;
        mark(0, quiet);
      };
      input.addEventListener('input', () => filter(false));
      input.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown') { e.preventDefault(); mark(active + 1); }
        else if (e.key === 'ArrowUp') { e.preventDefault(); mark(active - 1); }
        else if (e.key === 'Enter') {
          const v = visible()[active];
          if (v) { e.preventDefault(); v.click(); }
        }
      });
      items.forEach((it) => {
        it.addEventListener('mousemove', () => { const i = visible().indexOf(it); if (i !== active) mark(i); });
        it.addEventListener('click', () => {
          if (cmd.classList.contains('command--static')) return;
          if (it.hasAttribute('data-toast')) toastFrom(it);
          if (it.tagName !== 'A') closeOverlay(cmd);
        });
      });
      cmd._reset = () => { input.value = ''; filter(true); };
      filter(true);
    });
    const openCmd = (opener) => {
      const cmd = $('#command');
      if (!cmd) return;
      if (cmd._reset) cmd._reset();
      openOverlay(cmd, opener);
    };
    doc.addEventListener('click', (e) => {
      const b = e.target.closest('[data-command-open]');
      if (b) { e.preventDefault(); openCmd(b); }
    });
    doc.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        const cmd = $('#command');
        if (cmd && cmd.classList.contains('is-open')) closeOverlay(cmd); else openCmd(doc.activeElement);
      }
    });
  }

  /* ── 6. 탭 (입력 선택 키 열) ─────────────────────────────────────── */
  function selectTab(tab, focus) {
    const list = tab.closest('[role="tablist"]');
    $$('[role="tab"]', list).forEach((t) => {
      const on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      const p = doc.getElementById(t.getAttribute('aria-controls'));
      if (p) p.hidden = !on;
    });
    if (focus) tab.focus();
    tab.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    list.dispatchEvent(new CustomEvent('md:tab', { bubbles: true, detail: { tab } }));
  }
  function initTabs() {
    $$('[role="tablist"]').forEach((list) => {
      const tabs = $$('[role="tab"]', list);
      const cur = tabs.find((t) => t.getAttribute('aria-selected') === 'true') || tabs[0];
      if (cur) tabs.forEach((t) => { t.tabIndex = t === cur ? 0 : -1; const p = doc.getElementById(t.getAttribute('aria-controls')); if (p) p.hidden = t !== cur; });
      list.addEventListener('click', (e) => {
        const t = e.target.closest('[role="tab"]');
        if (!t || t.disabled) return;
        selectTab(t);
        // 세로 탭(문의 목록 등)이 한 열로 쌓인 화면: 고른 패널이 화면 밖이면 그 패널로 내려간다
        if (list.getAttribute('aria-orientation') === 'vertical') {
          const p = doc.getElementById(t.getAttribute('aria-controls'));
          if (p) {
            const r = p.getBoundingClientRect();
            if (r.top > innerHeight * 0.85 || r.bottom < 0) p.scrollIntoView({ block: 'start', behavior: reduce.matches ? 'auto' : 'smooth' });
          }
        }
      });
      list.addEventListener('keydown', (e) => {
        const en = tabs.filter((t) => !t.disabled);
        const i = en.indexOf(doc.activeElement);
        if (i < 0) return;
        let n = null;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') n = en[(i + 1) % en.length];
        else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') n = en[(i - 1 + en.length) % en.length];
        else if (e.key === 'Home') n = en[0];
        else if (e.key === 'End') n = en[en.length - 1];
        if (n) { e.preventDefault(); selectTab(n, true); }
      });
    });
  }

  /* ── 7. 아코디언 (경첩 덮개) ─────────────────────────────────────── */
  function setAcc(btn, open) {
    btn.setAttribute('aria-expanded', String(open));
    const p = doc.getElementById(btn.getAttribute('aria-controls')) || btn.closest('.acc__item')?.querySelector('.acc__panel');
    if (p) { p.inert = !open; p.classList.toggle('is-open', open); }
  }
  function initAccordions() {
    $$('.acc__trigger').forEach((b) => setAcc(b, b.getAttribute('aria-expanded') === 'true'));
    doc.addEventListener('click', (e) => {
      const b = e.target.closest('.acc__trigger');
      if (!b || b.disabled) return;
      const open = b.getAttribute('aria-expanded') !== 'true';
      const acc = b.closest('.acc');
      if (open && acc && acc.hasAttribute('data-single')) $$('.acc__trigger', acc).forEach((o) => o !== b && setAcc(o, false));
      setAcc(b, open);
    });
  }

  /* ── 8. 토스트 (LCD 띠) ──────────────────────────────────────────── */
  function stack() {
    let s = $('.toast-stack');
    if (!s) {
      s = doc.createElement('div');
      s.className = 'toast-stack';
      s.setAttribute('role', 'status');
      s.setAttribute('aria-live', 'polite');
      doc.body.appendChild(s);
    }
    return s;
  }
  function removeToast(t) {
    if (!t || t.classList.contains('is-leaving')) return;
    if (reduce.matches) { t.remove(); return; }
    t.classList.add('is-leaving');
    setTimeout(() => t.remove(), 150);
  }
  function toast(msg, opts = {}) {
    const tone = opts.tone || 'ok';
    const t = doc.createElement('div');
    t.className = `toast toast--${tone}`;
    t.innerHTML = '<span class="toast__led" aria-hidden="true"></span><span class="toast__text"></span><button class="toast__close" type="button" aria-label="알림 닫기"><span data-icon="close"></span></button>';
    const text = $('.toast__text', t);
    if (opts.code) { const c = doc.createElement('span'); c.className = 'toast__code'; c.textContent = opts.code; text.appendChild(c); }
    const m = doc.createElement('span'); m.className = 'toast__msg'; m.textContent = msg; text.appendChild(m);
    paintIcons(t);
    $('.toast__close', t).addEventListener('click', () => removeToast(t));
    const s = stack();
    s.appendChild(t);
    while (s.children.length > 3) s.firstElementChild.remove();
    const ms = opts.duration || 4000;
    let timer = setTimeout(() => removeToast(t), ms);
    t.addEventListener('mouseenter', () => clearTimeout(timer));
    t.addEventListener('mouseleave', () => { timer = setTimeout(() => removeToast(t), 1600); });
    return t;
  }
  function toastFrom(el) {
    return toast(el.getAttribute('data-toast'), { tone: el.getAttribute('data-toast-tone') || 'ok', code: el.getAttribute('data-toast-code') || '' });
  }
  function initToasts() {
    doc.addEventListener('click', (e) => {
      const b = e.target.closest('[data-toast]');
      if (!b || b.closest('[data-modal-close], [data-drawer-close], .command__item, .menu__item, [data-busy-demo], [data-error-demo]')) return;
      toastFrom(b);
    });
  }

  /* ── 9. 메뉴 · 팝오버 (떠 있는 슬랩) ─────────────────────────────── */
  let floating = null;
  function place(el, trigger) {
    const host = el.offsetParent || doc.body;
    const hr = host.getBoundingClientRect();
    const tr = trigger.getBoundingClientRect();
    el.style.left = '0px';
    el.style.top = '0px';
    const w = el.offsetWidth;
    const h = el.offsetHeight;
    let left = tr.left - hr.left;
    const align = el.getAttribute('data-align');
    if (align === 'end' || tr.left + w > innerWidth - 16) left = tr.right - hr.left - w;
    left = clamp(left, 16 - hr.left, innerWidth - 16 - hr.left - w);
    let top = tr.bottom - hr.top + 10;
    let side = 'bottom';
    if (el.getAttribute('data-prefer') === 'top' || (tr.bottom + h + 16 > innerHeight && tr.top - h - 16 > 0)) {
      top = tr.top - hr.top - h - 10;
      side = 'top';
    }
    el.style.left = `${Math.round(left)}px`;
    el.style.top = `${Math.round(top)}px`;
    if (el.classList.contains('popover')) {
      el.setAttribute('data-side', side);
      el.style.setProperty('--notch-x', `${clamp(tr.left + tr.width / 2 - hr.left - left - 7, 14, w - 28)}px`);
    }
  }
  function closeFloating(restore) {
    if (!floating) return;
    const { el, trigger } = floating;
    el.classList.remove('is-open');
    trigger.setAttribute('aria-expanded', 'false');
    floating = null;
    if (restore) trigger.focus();
  }
  function openFloating(el, trigger) {
    closeFloating();
    el.classList.add('is-open');
    trigger.setAttribute('aria-expanded', 'true');
    place(el, trigger);
    floating = { el, trigger };
    if (el.classList.contains('menu')) {
      const first = $$('.menu__item', el).find((i) => !i.disabled && i.getAttribute('aria-disabled') !== 'true');
      if (first) first.focus();
    }
  }
  function initFloating() {
    $$('.menu:not(.menu--static)').forEach((m) => {
      m.setAttribute('role', m.getAttribute('role') || 'menu');
      $$('.menu__item', m).forEach((i) => { if (!i.getAttribute('role')) i.setAttribute('role', 'menuitem'); i.tabIndex = -1; });
      m.addEventListener('keydown', (e) => {
        const items = $$('.menu__item', m).filter((i) => !i.disabled && i.getAttribute('aria-disabled') !== 'true');
        const i = items.indexOf(doc.activeElement);
        let n = null;
        if (e.key === 'ArrowDown') n = items[(i + 1) % items.length];
        else if (e.key === 'ArrowUp') n = items[(i - 1 + items.length) % items.length];
        else if (e.key === 'Home') n = items[0];
        else if (e.key === 'End') n = items[items.length - 1];
        else if (e.key === 'Tab') closeFloating();
        if (n) { e.preventDefault(); n.focus(); }
      });
      m.addEventListener('click', (e) => {
        const it = e.target.closest('.menu__item');
        if (!it || it.disabled || it.getAttribute('aria-disabled') === 'true') return;
        if (it.getAttribute('role') === 'menuitemradio') {
          $$('[role="menuitemradio"]', m).forEach((r) => r.setAttribute('aria-checked', String(r === it)));
          const label = floating && $('[data-menu-label]', floating.trigger);
          if (label) label.textContent = it.dataset.label || it.textContent.trim();
        }
        if (it.getAttribute('role') === 'menuitemcheckbox') it.setAttribute('aria-checked', String(it.getAttribute('aria-checked') !== 'true'));
        if (it.hasAttribute('data-toast')) toastFrom(it);
        if (it.tagName !== 'A' && it.getAttribute('role') !== 'menuitemcheckbox') closeFloating(true);
      });
    });
    $$('.popover:not(.popover--static)').forEach((p) => { if (!p.getAttribute('role')) p.setAttribute('role', 'dialog'); });
    $$('[data-menu], [data-popover]').forEach((t) => {
      t.setAttribute('aria-expanded', 'false');
      const id = t.getAttribute('data-menu') || t.getAttribute('data-popover');
      t.setAttribute('aria-controls', id);
      if (t.hasAttribute('data-menu')) t.setAttribute('aria-haspopup', 'menu');
    });
    doc.addEventListener('click', (e) => {
      const t = e.target.closest('[data-menu], [data-popover]');
      if (t) {
        e.preventDefault();
        const el = doc.getElementById(t.getAttribute('data-menu') || t.getAttribute('data-popover'));
        if (!el) return;
        if (floating && floating.el === el) closeFloating(); else openFloating(el, t);
        return;
      }
      if (floating && !floating.el.contains(e.target)) closeFloating();
      const c = e.target.closest('[data-popover-close]');
      if (c && floating) closeFloating(true);
    });
    addEventListener('resize', () => { if (floating) place(floating.el, floating.trigger); });
    $$('[data-menu]').forEach((t) => t.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown' && t.getAttribute('aria-expanded') !== 'true') { e.preventDefault(); t.click(); }
    }));
  }

  /* ── 10. 툴팁 (LCD 꼬리표) ───────────────────────────────────────── */
  function initTooltips() {
    let tip = null;
    let owner = null;
    const show = (el) => {
      if (!tip) {
        tip = doc.createElement('div');
        tip.className = 'tooltip';
        tip.id = 'md-tooltip';
        tip.setAttribute('role', 'tooltip');
        doc.body.appendChild(tip);
      }
      owner = el;
      tip.textContent = el.getAttribute('data-tooltip');
      el.setAttribute('aria-describedby', tip.id);
      const r = el.getBoundingClientRect();
      tip.classList.add('is-open');
      const w = tip.offsetWidth;
      const h = tip.offsetHeight;
      let left = clamp(r.left + r.width / 2 - w / 2, 8, innerWidth - w - 8);
      let top = r.top - h - 10;
      let side = 'top';
      if (top < 8) { top = r.bottom + 10; side = 'bottom'; }
      tip.setAttribute('data-side', side);
      tip.style.setProperty('--tip-x', `${clamp(r.left + r.width / 2 - left, 10, w - 10)}px`);
      tip.style.left = `${left + scrollX}px`;
      tip.style.top = `${top + scrollY}px`;
    };
    const hide = () => {
      if (!tip || !owner) return;
      tip.classList.remove('is-open');
      owner.removeAttribute('aria-describedby');
      owner = null;
    };
    doc.addEventListener('mouseover', (e) => { const el = e.target.closest('[data-tooltip]'); if (el && el !== owner) show(el); });
    doc.addEventListener('mouseout', (e) => { const el = e.target.closest('[data-tooltip]'); if (el && !el.contains(e.relatedTarget)) hide(); });
    doc.addEventListener('focusin', (e) => { const el = e.target.closest('[data-tooltip]'); if (el) show(el); });
    doc.addEventListener('focusout', (e) => { if (e.target.closest('[data-tooltip]')) hide(); });
    doc.addEventListener('keydown', (e) => { if (e.key === 'Escape') hide(); });
    addEventListener('scroll', hide, { passive: true });
  }

  /* ── 11. 캐러셀 (로터리 셀렉터) ──────────────────────────────────── */
  function initCarousels() {
    $$('[data-carousel]').forEach((c) => {
      const track = $('.carousel__track', c);
      const slides = $$('.carousel__slide', c);
      const vp = $('.carousel__viewport', c);
      const prev = $('[data-carousel-prev]', c);
      const next = $('[data-carousel-next]', c);
      const pos = $('.carousel__pos', c);
      let dots = $('.carousel__dots', c);
      if (!track || !slides.length) return;
      if (dots && !dots.children.length) {
        slides.forEach((s, i) => {
          const b = doc.createElement('button');
          b.type = 'button';
          b.className = 'carousel__dot';
          b.setAttribute('aria-label', `${i + 1}번째 장면${s.dataset.name ? ` — ${s.dataset.name}` : ''}`);
          dots.appendChild(b);
        });
      }
      const dotEls = dots ? $$('.carousel__dot', dots) : [];
      slides.forEach((s, i) => { s.setAttribute('role', 'group'); s.setAttribute('aria-roledescription', '장면'); s.setAttribute('aria-label', `${i + 1} / ${slides.length}`); });
      c.setAttribute('aria-roledescription', '캐러셀');
      let i = 0;
      const go = (n) => {
        i = clamp(n, 0, slides.length - 1);
        track.style.transform = `translateX(${-100 * i}%)`;
        slides.forEach((s, k) => { s.inert = k !== i; s.setAttribute('aria-hidden', String(k !== i)); });
        dotEls.forEach((d, k) => d.setAttribute('aria-current', String(k === i)));
        if (prev) prev.disabled = i === 0;
        if (next) next.disabled = i === slides.length - 1;
        if (pos) pos.textContent = `${i + 1} / ${slides.length}`;
      };
      prev && prev.addEventListener('click', () => go(i - 1));
      next && next.addEventListener('click', () => go(i + 1));
      dotEls.forEach((d, k) => d.addEventListener('click', () => go(k)));
      const kbd = vp || c;
      if (!kbd.hasAttribute('tabindex')) kbd.tabIndex = 0;
      kbd.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') { e.preventDefault(); go(i + 1); }
        if (e.key === 'ArrowLeft') { e.preventDefault(); go(i - 1); }
      });
      let sx = null;
      kbd.addEventListener('pointerdown', (e) => { sx = e.clientX; });
      kbd.addEventListener('pointerup', (e) => {
        if (sx === null) return;
        const dx = e.clientX - sx;
        if (Math.abs(dx) > 40) go(i + (dx < 0 ? 1 : -1));
        sx = null;
      });
      go(0);
    });
  }

  /* ── 12. 노브 (role="slider") ───────────────────────────────────── */
  const knobFormat = {
    vol: (v) => (v === 0 ? 'MUTE' : `VOL ${String(v).padStart(2, ' ')}`),
    db: (v) => (v === 0 ? '−∞ dB' : `${v - 80 === 0 ? '0' : `−${80 - v}`} dB`),
    plain: (v, k) => `${v}${k.dataset.unit || ''}`,
  };
  function setKnob(k, v, silent) {
    const min = Number(k.getAttribute('aria-valuemin') || 0);
    const max = Number(k.getAttribute('aria-valuemax') || 100);
    const step = Number(k.dataset.step || 1);
    const want = Math.round(v / step) * step;
    v = clamp(want, min, max);
    /* 끝 너머로 돌리려 하면 링이 잠깐 빨갛게 — 디텐트 끝에 걸린 손맛 */
    if (!silent && want !== v) {
      k.classList.add('is-error');
      clearTimeout(k._errT);
      k._errT = setTimeout(() => k.classList.remove('is-error'), 600);
    }
    const prevV = Number(k.getAttribute('aria-valuenow'));
    k.setAttribute('aria-valuenow', String(v));
    k.style.setProperty('--v', String((v - min) / (max - min || 1)));
    const fmt = k.dataset.format || 'plain';
    let text;
    if (fmt === 'vol') {
      text = knobFormat.vol(v);
      k.setAttribute('aria-valuetext', v === 0 ? '음소거' : `${v}단계, ${knobFormat.db(v)}`);
    } else {
      text = knobFormat.plain(v, k);
      k.setAttribute('aria-valuetext', text);
    }
    const id = k.id;
    if (id) {
      $$(`[data-knob-out="${id}"]`).forEach((o) => setLcdText(o, o.hasAttribute('data-out-num') ? String(v) : text));
      $$(`[data-seg7-out="${id}"]`).forEach((o) => renderSeg7(o, fmt === 'vol' && v === 0 ? '--' : String(v), !silent));
      $$(`[data-knob-tag="${id}"]`).forEach((o) => setLcdText(o, fmt === 'vol' && v === 0 ? 'MUTE' : (o.dataset.tag || 'VOL')));
      $$(`[data-knob-db="${id}"]`).forEach((o) => setLcdText(o, knobFormat.db(v)));
      $$(`[data-knob-num="${id}"]`).forEach((o) => setLcdText(o, String(v)));
    }
    if (!silent && v !== prevV) {
      if (navigator.vibrate && matchMedia('(pointer: coarse)').matches) { try { navigator.vibrate(3); } catch (e) { /* 무시 */ } }
      k.dispatchEvent(new CustomEvent('md:knob', { bubbles: true, detail: { value: v } }));
    }
  }
  function initKnobs() {
    $$('[data-knob]').forEach((k) => {
      ensureId(k, 'knob');
      if (!k.getAttribute('role')) k.setAttribute('role', 'slider');
      if (!k.hasAttribute('tabindex')) k.tabIndex = 0;
      if (!k.querySelector('.knob__cap')) k.innerHTML = '<span class="knob__ring"></span><span class="knob__ticks"></span><span class="knob__cap"></span>';
      setKnob(k, Number(k.getAttribute('aria-valuenow') || 0), true);
      const disabled = () => k.getAttribute('aria-disabled') === 'true';
      const val = () => Number(k.getAttribute('aria-valuenow'));
      k.addEventListener('keydown', (e) => {
        if (disabled()) return;
        const max = Number(k.getAttribute('aria-valuemax') || 100);
        const min = Number(k.getAttribute('aria-valuemin') || 0);
        const map = { ArrowUp: 1, ArrowRight: 1, ArrowDown: -1, ArrowLeft: -1, PageUp: 5, PageDown: -5, '+': 1, '=': 1, '-': -1 };
        const st = Number(k.dataset.step || 1);   /* data-step(예: 5분 단위) 노브는 한 칸 = step */
        if (e.key in map) { e.preventDefault(); setKnob(k, val() + map[e.key] * st); }
        else if (e.key === 'Home') { e.preventDefault(); setKnob(k, min); }
        else if (e.key === 'End') { e.preventDefault(); setKnob(k, max); }
      });
      /* 드래그: 중심 기준 회전각 누적 → 1칸 = 270° / 범위 */
      let drag = null;
      const angleAt = (e) => {
        const r = k.getBoundingClientRect();
        return Math.atan2(e.clientY - (r.top + r.height / 2), e.clientX - (r.left + r.width / 2)) * 180 / Math.PI;
      };
      k.addEventListener('pointerdown', (e) => {
        if (disabled() || e.button > 0) return;
        k.setPointerCapture(e.pointerId);
        k.focus({ preventScroll: true });
        drag = { a: angleAt(e), y: e.clientY, acc: 0, start: val() };
      });
      k.addEventListener('pointermove', (e) => {
        if (!drag) return;
        const max = Number(k.getAttribute('aria-valuemax') || 100);
        const min = Number(k.getAttribute('aria-valuemin') || 0);
        const per = 270 / ((max - min) || 1);
        let a = angleAt(e);
        let d = a - drag.a;
        if (d > 180) d -= 360;
        if (d < -180) d += 360;
        drag.a = a;
        drag.acc += d;
        setKnob(k, drag.start + Math.round(drag.acc / per));
      });
      const end = () => { drag = null; };
      k.addEventListener('pointerup', end);
      k.addEventListener('pointercancel', end);
      /* 휠: 노브에 포커스가 있을 때만 (페이지 스크롤을 빼앗지 않음) */
      k.addEventListener('wheel', (e) => {
        if (disabled() || doc.activeElement !== k) return;
        e.preventDefault();
        setKnob(k, val() + (e.deltaY < 0 ? 1 : -1) * Number(k.dataset.step || 1));
      }, { passive: false });
    });
    doc.addEventListener('click', (e) => {
      const b = e.target.closest('[data-knob-step]');
      if (!b) return;
      const k = doc.getElementById(b.getAttribute('data-knob-target'));
      if (k && k.getAttribute('aria-disabled') !== 'true') setKnob(k, Number(k.getAttribute('aria-valuenow')) + Number(b.getAttribute('data-knob-step')) * Number(k.dataset.step || 1));
    });
  }

  /* ── 13. 페이더 (input[type=range]) ─────────────────────────────── */
  function syncFader(r) {
    const min = Number(r.min || 0);
    const max = Number(r.max || 100);
    const v = Number(r.value);
    const f = r.closest('.fader');
    if (f) f.style.setProperty('--v', `${((v - min) / (max - min || 1)) * 100}%`);
    const sign = r.dataset.signed !== undefined && v > 0 ? '+' : '';
    const minus = v < 0 ? '−' : '';
    const num = Math.abs(v).toFixed(Number(r.dataset.decimals || 0));
    const text = `${sign}${minus}${num}${r.dataset.unit || ''}`;
    if (r.id) $$(`[data-fader-out="${r.id}"]`).forEach((o) => setLcdText(o, text));
    const own = f && $('.fader__out', f);
    if (own && !own.hasAttribute('data-fader-out')) own.textContent = text;
    r.setAttribute('aria-valuetext', text);
  }
  function initFaders() {
    $$('.fader__input').forEach((r) => { ensureId(r, 'fader'); syncFader(r); r.addEventListener('input', () => syncFader(r)); });
  }

  /* ── 14. 레벨 미터 ──────────────────────────────────────────────── */
  function setMeter(m, v) {
    const max = Number(m.getAttribute('aria-valuemax') || 100);
    const min = Number(m.getAttribute('aria-valuemin') || 0);
    if (v !== undefined) m.setAttribute('aria-valuenow', String(v));
    const now = Number(m.getAttribute('aria-valuenow') || 0);
    const pct = (now - min) / ((max - min) || 1);
    const segs = $$('.meter__seg', m);
    const warn = Number(m.dataset.warn || 70) / 100;
    const peak = Number(m.dataset.peak || 90) / 100;
    const lit = Math.round(pct * segs.length);
    const mono = m.classList.contains('meter--mono');
    segs.forEach((s, i) => {
      const at = (i + 1) / segs.length;
      s.classList.toggle('is-on', i < lit);
      s.classList.toggle('is-warn', !mono && at > warn && at <= peak);
      s.classList.toggle('is-peak', !mono && at > peak);
    });
    m.classList.toggle('is-clip', pct >= 1 && m.dataset.clip !== undefined);
    const out = $('.meter__readout', m);
    if (out && out.dataset.auto !== undefined) out.textContent = `${now}${m.dataset.unit || ''}`;
  }
  function initMeters() {
    $$('.meter').forEach((m) => {
      const track = $('.meter__track', m);
      if (track && !track.children.length) {
        const n = Number(m.dataset.segments || 20);
        track.setAttribute('aria-hidden', 'true');
        for (let i = 0; i < n; i += 1) { const s = doc.createElement('i'); s.className = 'meter__seg'; track.appendChild(s); }
      }
      if (!m.getAttribute('role')) m.setAttribute('role', 'meter');
      setMeter(m);
    });
  }

  /* ── 15. 칸반 (끌어 놓기 + 키보드) ──────────────────────────────── */
  function initKanban() {
    $$('[data-kanban]').forEach((board) => {
      const cols = $$('.kanban__col', board);
      const updateCounts = () => cols.forEach((c) => {
        const n = $$('.kanban__card', c).length;
        const out = $('[data-kanban-count]', c);
        if (out) out.textContent = String(n);
        const empty = $('.kanban__empty', c);
        if (empty) empty.hidden = n > 0;
      });
      const colName = (c) => ($('.kanban__title', c) || c).textContent.trim();
      const announce = (card, col) => {
        const id = ($('.kanban__id', card) || card).textContent.trim();
        live(`${id} → ${colName(col)}`);
        toast(`${colName(col)} 열로 옮겼습니다.`, { code: id, tone: 'info', duration: 2600 });
      };
      let dragging = null;
      $$('.kanban__card', board).forEach((card) => {
        if (card.classList.contains('is-locked')) return;
        card.draggable = true;
        if (!card.hasAttribute('tabindex')) card.tabIndex = 0;
        card.setAttribute('aria-roledescription', '옮길 수 있는 카드');
        card.addEventListener('dragstart', (e) => {
          dragging = card;
          card.classList.add('is-dragging');
          e.dataTransfer.effectAllowed = 'move';
          try { e.dataTransfer.setData('text/plain', card.id || 'card'); } catch (er) { /* 무시 */ }
          requestAnimationFrame(() => { card.classList.remove('is-dragging'); card.classList.add('is-ghost'); });
        });
        card.addEventListener('dragend', () => {
          card.classList.remove('is-dragging', 'is-ghost');
          cols.forEach((c) => c.classList.remove('is-over'));
          const col = card.closest('.kanban__col');
          if (dragging && col && dragging._from !== col) announce(card, col);
          dragging = null;
          updateCounts();
        });
        card.addEventListener('mousedown', () => { card._from = card.closest('.kanban__col'); });
        card.addEventListener('keydown', (e) => {
          const grabbed = card.getAttribute('aria-grabbed') === 'true';
          if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            card.setAttribute('aria-grabbed', String(!grabbed));
            card.classList.toggle('is-grabbed', !grabbed);
            if (!grabbed) { card._from = card.closest('.kanban__col'); live('카드를 잡았습니다. 좌우 화살표로 열을 옮기고 스페이스로 놓으세요.'); }
            else if (card._from !== card.closest('.kanban__col')) announce(card, card.closest('.kanban__col'));
            return;
          }
          if (!grabbed) return;
          const col = card.closest('.kanban__col');
          const ci = cols.indexOf(col);
          if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
            e.preventDefault();
            const to = cols[clamp(ci + (e.key === 'ArrowRight' ? 1 : -1), 0, cols.length - 1)];
            if (to !== col) { $('.kanban__list', to).appendChild(card); card.focus(); updateCounts(); live(colName(to)); }
          } else if (e.key === 'ArrowUp' && card.previousElementSibling) { e.preventDefault(); card.parentNode.insertBefore(card, card.previousElementSibling); card.focus(); }
          else if (e.key === 'ArrowDown' && card.nextElementSibling) { e.preventDefault(); card.parentNode.insertBefore(card.nextElementSibling, card); card.focus(); }
          else if (e.key === 'Escape') { card.setAttribute('aria-grabbed', 'false'); card.classList.remove('is-grabbed'); }
        });
      });
      cols.forEach((col) => {
        const list = $('.kanban__list', col);
        col.addEventListener('dragover', (e) => {
          if (!dragging) return;
          e.preventDefault();
          col.classList.add('is-over');
          const after = $$('.kanban__card:not(.is-ghost)', list).find((c) => { const r = c.getBoundingClientRect(); return e.clientY < r.top + r.height / 2; });
          if (after) list.insertBefore(dragging, after); else list.appendChild(dragging);
        });
        col.addEventListener('dragleave', (e) => { if (!col.contains(e.relatedTarget)) col.classList.remove('is-over'); });
        col.addEventListener('drop', (e) => { e.preventDefault(); col.classList.remove('is-over'); });
      });
      updateCounts();
    });
  }

  /* ── 15-1. 칸반 공정 미터 — [data-kanban-nav=보드 id] 키로 열 이동, 스크롤 위치에 따라 현재 열 · 점 표시 ── */
  function initKanbanNav() {
    $$('[data-kanban-nav]').forEach((nav) => {
      const board = doc.getElementById(nav.getAttribute('data-kanban-nav'));
      if (!board) return;
      const cols = $$('.kanban__col', board);
      const keys = $$('[data-kanban-jump]', nav);
      const dots = $(`[data-kanban-dots="${board.id}"]`);
      const leds = dots ? $$('.led', dots) : [];
      const pos = dots ? $('[data-kanban-pos]', dots) : null;
      const scrollable = () => board.scrollWidth - board.clientWidth > 2;
      let cur = -1;
      const mark = (i) => {
        if (i === cur) return;
        cur = i;
        keys.forEach((k, j) => (j === i ? k.setAttribute('aria-current', 'true') : k.removeAttribute('aria-current')));
        leds.forEach((l, j) => l.classList.toggle('is-on', j === i));
        if (pos) pos.textContent = `IN ${i + 1}/${cols.length}`;
      };
      const nearest = () => {
        const x = board.scrollLeft + 8;
        let best = 0;
        cols.forEach((c, j) => { if (c.offsetLeft - cols[0].offsetLeft <= x) best = j; });
        if (board.scrollLeft + board.clientWidth >= board.scrollWidth - 2) best = cols.length - 1;   // 끝까지 밀면 마지막 열
        return Math.min(best, cols.length - 1);
      };
      keys.forEach((k) => k.addEventListener('click', () => {
        const i = Number(k.getAttribute('data-kanban-jump'));
        const col = cols[i];
        if (!col) return;
        const behavior = reduce.matches ? 'auto' : 'smooth';
        if (scrollable()) board.scrollTo({ left: col.offsetLeft - cols[0].offsetLeft, behavior });
        const r = col.getBoundingClientRect();
        if (r.top < 0 || r.top > innerHeight * 0.7) col.scrollIntoView({ block: 'start', inline: 'nearest', behavior });
        mark(i);
      }));
      board.addEventListener('scroll', () => { if (scrollable()) mark(nearest()); }, { passive: true });
      // 끌어 옮기면 미터 건수 · LED 를 다시 센다
      const recount = () => cols.forEach((c, j) => {
        const n = $$('.kanban__card', c).length;
        const k = keys[j];
        if (!k) return;
        const out = $('[data-stage-n]', k);
        if (out) out.textContent = String(n);
        $$('.stage__leds i', k).forEach((d, m) => d.classList.toggle('is-on', m < n));
      });
      if ('MutationObserver' in window) new MutationObserver(recount).observe(board, { childList: true, subtree: true });
      mark(0);
    });
  }

  /* ── 16. 표 (정렬 · 행 선택) ────────────────────────────────────── */
  function cellValue(td) {
    if (!td) return '';
    if (td.dataset.sort !== undefined) return td.dataset.sort;
    return td.textContent.trim();
  }
  function initTables() {
    $$('.table th .table__sort').forEach((btn) => {
      btn.addEventListener('click', () => {
        const th = btn.closest('th');
        const table = th.closest('table');
        const idx = Array.from(th.parentNode.children).indexOf(th);
        const dir = th.getAttribute('aria-sort') === 'ascending' ? 'descending' : 'ascending';
        $$('th[aria-sort]', table).forEach((o) => o.setAttribute('aria-sort', 'none'));
        th.setAttribute('aria-sort', dir);
        const body = table.tBodies[0];
        const rows = Array.from(body.rows);
        rows.sort((a, b) => {
          const x = cellValue(a.cells[idx]);
          const y = cellValue(b.cells[idx]);
          const nx = parseFloat(String(x).replace(/[^\d.\-]/g, ''));
          const ny = parseFloat(String(y).replace(/[^\d.\-]/g, ''));
          const r = !Number.isNaN(nx) && !Number.isNaN(ny) ? nx - ny : String(x).localeCompare(String(y), 'ko');
          return dir === 'ascending' ? r : -r;
        });
        rows.forEach((r) => body.appendChild(r));
        live(`${btn.textContent.trim()} ${dir === 'ascending' ? '오름차순' : '내림차순'} 정렬`);
      });
    });
    $$('table.table').forEach((table) => {
      const all = $('thead [data-select-all]', table);
      const boxes = $$('tbody .check__box', table);
      if (!boxes.length) return;
      const wrap = table.closest('.table-wrap') || table.parentNode;
      const out = wrap.parentNode.querySelector('[data-selected-count]');
      const sync = () => {
        let n = 0;
        boxes.forEach((b) => { const tr = b.closest('tr'); tr.setAttribute('aria-selected', String(b.checked)); if (b.checked) n += 1; });
        if (all) { all.checked = n === boxes.length; all.indeterminate = n > 0 && n < boxes.length; }
        if (out) out.textContent = String(n);
      };
      boxes.forEach((b) => b.addEventListener('change', sync));
      if (all) all.addEventListener('change', () => { boxes.forEach((b) => { b.checked = all.checked; }); sync(); });
      sync();
    });
  }

  /* ── 17. 달력 · 배타 키 열 · 칩 · 페이지 키 ─────────────────────── */
  function initSelectables() {
    doc.addEventListener('click', (e) => {
      const day = e.target.closest('[data-calendar] .cal__day');
      if (day && day.getAttribute('aria-disabled') !== 'true' && !day.disabled) {
        const cal = day.closest('[data-calendar]');
        $$('.cal__day[aria-pressed]', cal).forEach((d) => d.setAttribute('aria-pressed', String(d === day)));
        const out = $('[data-cal-out]', cal) || (cal.id && $(`[data-cal-out="${cal.id}"]`));
        if (out) out.textContent = day.dataset.label || day.getAttribute('aria-label') || day.textContent.trim();
        return;
      }
      const ex = e.target.closest('[data-exclusive] [aria-pressed]');
      if (ex && !ex.disabled) {
        const group = ex.closest('[data-exclusive]');
        $$('[aria-pressed]', group).forEach((k) => k.setAttribute('aria-pressed', String(k === ex)));
        const out = group.id && $(`[data-exclusive-out="${group.id}"]`);
        if (out) setLcdText(out, ex.dataset.value || ex.textContent.trim());
        group.dispatchEvent(new CustomEvent('md:select', { bubbles: true, detail: { key: ex } }));
        return;
      }
      const tg = e.target.closest('[data-toggle], .chip[aria-pressed]');
      if (tg && !tg.disabled) {
        tg.setAttribute('aria-pressed', String(tg.getAttribute('aria-pressed') !== 'true'));
        return;
      }
      const pk = e.target.closest('[data-pager] .pager__key');
      if (pk && pk.getAttribute('aria-disabled') !== 'true' && !pk.disabled) {
        e.preventDefault();
        const pager = pk.closest('[data-pager]');
        const nums = $$('.pager__key:not(.pager__step)', pager);
        const cur = nums.findIndex((n) => n.getAttribute('aria-current') === 'page');
        const total = Number(pager.dataset.total || nums.length);
        let target = cur;
        if (pk.hasAttribute('data-step-prev')) target = cur - 1;
        else if (pk.hasAttribute('data-step-next')) target = cur + 1;
        else target = nums.indexOf(pk);
        target = clamp(target, 0, nums.length - 1);
        nums.forEach((n, i) => { if (i === target) n.setAttribute('aria-current', 'page'); else n.removeAttribute('aria-current'); });
        const prev = $('[data-step-prev]', pager);
        const next = $('[data-step-next]', pager);
        if (prev) prev.setAttribute('aria-disabled', String(target === 0));
        if (next) next.setAttribute('aria-disabled', String(target === nums.length - 1));
        const out = $('.pager__readout', pager);
        const page = Number(nums[target].textContent.trim()) || target + 1;
        if (out) out.textContent = `${page} / ${total}`;
        pager.dispatchEvent(new CustomEvent('md:page', { bubbles: true, detail: { page } }));
      }
    });
  }

  /* ── 18. 로딩 · 오류 · 닫기 · 복사 ──────────────────────────────── */
  function initActions() {
    doc.addEventListener('click', async (e) => {
      const busy = e.target.closest('[data-busy-demo]');
      if (busy && busy.getAttribute('aria-busy') !== 'true') {
        const ms = Number(busy.getAttribute('data-busy-demo')) || 1600;
        const label = $('.key__label', busy);
        const old = label ? label.textContent : null;
        busy.setAttribute('aria-busy', 'true');
        if (label && busy.dataset.busyLabel) label.textContent = busy.dataset.busyLabel;
        setTimeout(() => {
          busy.removeAttribute('aria-busy');
          if (label && old !== null) label.textContent = old;
          if (busy.hasAttribute('data-toast')) toastFrom(busy);
        }, ms);
        return;
      }
      const err = e.target.closest('[data-error-demo]');
      if (err) {
        err.classList.add('is-error');
        setTimeout(() => err.classList.remove('is-error'), 1600);
        toast(err.getAttribute('data-toast') || '동작을 마치지 못했습니다.', { tone: 'error', code: err.getAttribute('data-toast-code') || 'ERR' });
        return;
      }
      const dis = e.target.closest('[data-dismiss]');
      if (dis) {
        const box = dis.closest(dis.getAttribute('data-dismiss') || '.alert');
        if (box) box.remove();
        return;
      }
      const cp = e.target.closest('[data-copy]');
      if (cp) {
        const sel = cp.getAttribute('data-copy');
        const src = sel ? $(sel) : cp.closest('.code')?.querySelector('pre');
        if (!src) return;
        const text = src.innerText;
        try { await navigator.clipboard.writeText(text); } catch (er) {
          const ta = doc.createElement('textarea'); ta.value = text; doc.body.appendChild(ta); ta.select();
          try { doc.execCommand('copy'); } catch (er2) { /* 무시 */ }
          ta.remove();
        }
        const label = $('.code__copy-label', cp) || cp;
        const old = label.textContent;
        cp.classList.add('is-done');
        label.textContent = '복사됨';
        setTimeout(() => { cp.classList.remove('is-done'); label.textContent = old; }, 1600);
      }
    });
  }

  /* ── 19. 마키 (LCD 티커) ────────────────────────────────────────── */
  function initMarquees() {
    $$('.marquee').forEach((m) => {
      const track = $('.marquee__track', m);
      if (!track) return;
      const groups = $$('.marquee__group', track);
      if (groups.length === 1) { const c = groups[0].cloneNode(true); c.setAttribute('aria-hidden', 'true'); track.appendChild(c); }
      const btn = $('[data-marquee-toggle]', m);
      const setPaused = (p) => {
        m.classList.toggle('is-paused', p);
        if (!btn) return;
        btn.setAttribute('aria-pressed', String(p));
        btn.setAttribute('aria-label', p ? '흐름 다시 재생' : '흐름 멈춤');
        const ic = $('[data-icon]', btn);
        if (ic) { ic.setAttribute('data-icon', p ? 'play' : 'pause'); ic.dataset.painted = ''; paintIcons(btn); }
      };
      setPaused(reduce.matches);
      if (btn) btn.addEventListener('click', () => setPaused(!m.classList.contains('is-paused')));
    });
  }

  /* ── 20. 전원 켜짐 시퀀스 (세션당 1회) ─────────────────────────── */
  function initPowerSeq() {
    const el = $('[data-power-seq]');
    if (!el) return;
    if (reduce.matches || session.get('md-booted') || queryTheme) { session.set('md-booted', '1'); return; }
    session.set('md-booted', '1');
    const leds = $$('.led[data-seq]', el).sort((a, b) => Number(a.dataset.seq) - Number(b.dataset.seq));
    const lcd = $('[data-seq-lcd]', el);
    const seg = lcd && lcd.classList.contains('seg7');
    const was = leds.map((l) => l.classList.contains('is-on'));
    const lcdText = lcd ? (seg ? lcd.dataset.value : lcd.textContent) : '';
    const put = (t) => { if (!lcd) return; if (seg) renderSeg7(lcd, t, true); else setLcdText(lcd, t); };
    el.classList.add('is-booting');
    leds.forEach((l) => l.classList.remove('is-on'));
    put(seg ? '  ' : '');
    leds.forEach((l, i) => setTimeout(() => l.classList.add('is-on'), 60 + i * 40));
    const t1 = 60 + leds.length * 40 + 40;
    /* 세그먼트 판독창은 실제 기기처럼 전 세그먼트 점검(88), 글자 판독창은 MONGDOL */
    setTimeout(() => put(seg ? '88' : 'MONGDOL'), t1);
    setTimeout(() => {
      put(lcdText);
      leds.forEach((l, i) => l.classList.toggle('is-on', was[i]));
      el.classList.remove('is-booting');
    }, Math.min(t1 + 400, 900));
  }

  /* ── 21-b. 각 부 지시선 (data-leaders) — 면판 둘레 번호 원 ↔ 부위 점을 1px 선으로 잇는다 ── */
  function initLeaders() {
    $$('[data-leaders]').forEach((stage) => {
      const plate = $('.m1', stage);
      const svg = $('.leaders__svg', stage);
      if (!plate || !svg) return;
      const NS = 'http://www.w3.org/2000/svg';
      const draw = () => {
        const sr = stage.getBoundingClientRect();
        const pr = plate.getBoundingClientRect();
        const W = Math.round(sr.width); const H = Math.round(sr.height);
        svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
        svg.setAttribute('width', W); svg.setAttribute('height', H);
        while (svg.firstChild) svg.removeChild(svg.firstChild);
        const gap = 30;   /* 면판 가장자리에서 번호 원 중심까지 */
        $$('.callout[data-for]', stage).forEach((c) => {
          const n = c.dataset.for;
          const t = $(`[data-anchor="${n}"]`, plate);
          const dot = $(`.leaders__dot[data-for="${n}"]`, stage);
          if (!t) return;
          const r = t.getBoundingClientRect();
          let ax; let ay; let cx; let cy; let x1; let y1;
          const side = c.dataset.side;
          if (side === 't') {
            ax = r.left - sr.left + r.width / 2; ay = r.top - sr.top;
            cx = ax; cy = pr.top - sr.top - gap; x1 = cx; y1 = cy + 13;
          } else if (side === 'r') {
            ax = r.right - sr.left; ay = r.top - sr.top + r.height / 2;
            cx = pr.right - sr.left + gap; cy = ay; x1 = cx - 13; y1 = cy;
          } else {
            ax = r.left - sr.left; ay = r.top - sr.top + r.height / 2;
            cx = pr.left - sr.left - gap; cy = ay; x1 = cx + 13; y1 = cy;
          }
          c.style.left = `${cx}px`; c.style.top = `${cy}px`;
          if (dot) { dot.style.left = `${ax}px`; dot.style.top = `${ay}px`; }
          const ln = doc.createElementNS(NS, 'line');
          ln.setAttribute('x1', x1.toFixed(1)); ln.setAttribute('y1', y1.toFixed(1));
          ln.setAttribute('x2', ax.toFixed(1)); ln.setAttribute('y2', ay.toFixed(1));
          ln.setAttribute('data-leader', `pl-${n}`);
          c.setAttribute('data-leader', `pl-${n}`);
          svg.appendChild(ln);
        });
        stage.classList.add('has-leaders');
      };
      draw();
      if ('ResizeObserver' in window) new ResizeObserver(() => requestAnimationFrame(draw)).observe(stage);
      if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(draw);
      window.addEventListener('load', draw);
    });
  }

  /* ── 21. 각 부 점등 (data-light="부위 id") ─────────────────────── */
  function initLightTargets() {
    const on = (src) => {
      const ids = (src.getAttribute('data-light') || '').split(/\s+/).filter(Boolean);
      ids.forEach((id) => {
        const t = doc.getElementById(id);
        if (!t) return;
        if (t._lit === undefined) t._lit = t.classList.contains('is-on');
        t.classList.add('is-on', 'is-lit');
        $$(`[data-leader="${id}"]`).forEach((l) => l.classList.add('is-lit'));
      });
    };
    const off = (src) => {
      (src.getAttribute('data-light') || '').split(/\s+/).filter(Boolean).forEach((id) => {
        const t = doc.getElementById(id);
        if (!t) return;
        t.classList.remove('is-lit');
        if (!t._lit) t.classList.remove('is-on');
        $$(`[data-leader="${id}"]`).forEach((l) => l.classList.remove('is-lit'));
      });
    };
    doc.addEventListener('mouseover', (e) => { const s = e.target.closest('[data-light]'); if (s && !s.contains(e.relatedTarget)) on(s); });
    doc.addEventListener('mouseout', (e) => { const s = e.target.closest('[data-light]'); if (s && !s.contains(e.relatedTarget)) off(s); });
    doc.addEventListener('focusin', (e) => { const s = e.target.closest('[data-light]'); if (s) on(s); });
    doc.addEventListener('focusout', (e) => { const s = e.target.closest('[data-light]'); if (s) off(s); });
  }

  /* ── 22. 폼 검증 ────────────────────────────────────────────────── */
  function fieldOf(c) { return c.closest('.field'); }
  function checkControl(c) {
    let ok = true;
    if (c.type === 'radio') ok = !!doc.querySelector(`input[name="${c.name}"]:checked`);
    else if (c.type === 'checkbox') ok = c.checked;
    else ok = c.value.trim() !== '' && (!c.pattern || new RegExp(`^(?:${c.pattern})$`).test(c.value.trim())) && (c.type !== 'email' || /.+@.+\..+/.test(c.value));
    const target = c.type === 'radio' ? c.closest('.selector') || c : c;
    if (ok) { target.removeAttribute('aria-invalid'); fieldOf(c)?.classList.remove('is-invalid'); }
    else { target.setAttribute('aria-invalid', 'true'); fieldOf(c)?.classList.add('is-invalid'); }
    const err = fieldOf(c)?.querySelector('.field__error');
    if (err) { ensureId(err, 'err'); c.setAttribute('aria-describedby', err.id); }
    return ok;
  }
  function initForms() {
    $$('form[data-validate]').forEach((f) => {
      f.noValidate = true;
      f.addEventListener('submit', (e) => {
        e.preventDefault();
        const ctrls = $$('[required]', f);
        const bad = ctrls.filter((c) => !checkControl(c));
        if (bad.length) {
          bad[0].focus();
          toast(`${bad.length}개 항목을 확인해 주세요.`, { tone: 'error', code: 'CHECK' });
          return;
        }
        const submit = $('[type="submit"]', f);
        if (submit) {
          submit.setAttribute('aria-busy', 'true');
          setTimeout(() => {
            submit.removeAttribute('aria-busy');
            toast(f.getAttribute('data-success') || '저장했습니다.', { tone: 'ok', code: f.getAttribute('data-success-code') || 'SAVED' });
          }, 900);
        }
      });
      f.addEventListener('input', (e) => { if (e.target.getAttribute('aria-invalid') === 'true' || e.target.closest('[aria-invalid="true"]')) checkControl(e.target); });
      f.addEventListener('change', (e) => { if (e.target.matches('[required]') && (e.target.getAttribute('aria-invalid') === 'true' || e.target.closest('[aria-invalid="true"]'))) checkControl(e.target); });
    });
  }

  /* ── 23. 마법사 (steps + 패널) ──────────────────────────────────── */
  function initWizards() {
    $$('[data-wizard]').forEach((w) => {
      const items = $$('.steps__item', w);
      const panels = $$('[data-step-panel]', w);
      const dial = $('.steps__dial', w);
      let i = Math.max(0, items.findIndex((it) => it.getAttribute('aria-current') === 'step'));
      const go = (n) => {
        i = clamp(n, 0, items.length - 1);
        items.forEach((it, k) => {
          it.classList.toggle('is-done', k < i);
          if (k === i) it.setAttribute('aria-current', 'step'); else it.removeAttribute('aria-current');
        });
        panels.forEach((p, k) => { p.hidden = k !== i; });
        if (dial) { dial.style.setProperty('--i', String(i)); dial.style.setProperty('--n', String(items.length)); }
        $$('[data-step-go="-1"]', w).forEach((b) => { b.disabled = i === 0; });
        $$('[data-step-go="+1"]', w).forEach((b) => { b.hidden = i === items.length - 1; });
        $$('[data-step-finish]', w).forEach((b) => { b.hidden = i !== items.length - 1; });
        const out = $('[data-step-out]', w);
        if (out) setLcdText(out, `STEP ${i + 1}/${items.length}`);
      };
      w.addEventListener('click', (e) => {
        const b = e.target.closest('[data-step-go]');
        if (b) { go(i + Number(b.getAttribute('data-step-go'))); const p = panels[i]; if (p) { const h = $('h2, h3, [tabindex="-1"]', p); if (h) { if (!h.hasAttribute('tabindex')) h.tabIndex = -1; h.focus(); } } }
      });
      go(i);
    });
  }

  /* ── 24. 랙 스크롤스파이 · 가로 스크롤 힌트 ─────────────────────── */
  function initRack() {
    const keys = $$('.rack__key[href*="#"]').filter((a) => {
      const u = new URL(a.href, location.href);
      return u.pathname === location.pathname && u.hash.length > 1;
    });
    const scrollRackTo = (a) => {
      const sc = a.closest('.rack__keys');
      if (sc && sc.scrollWidth > sc.clientWidth) sc.scrollTo({ left: a.offsetLeft - sc.clientWidth / 2 + a.offsetWidth / 2, behavior: reduce.matches ? 'auto' : 'smooth' });
    };
    const cur = $('.rack__key[aria-current]');
    if (cur) requestAnimationFrame(() => scrollRackTo(cur));
    if (!keys.length || !('IntersectionObserver' in window)) return;
    const map = new Map();
    keys.forEach((a) => { const t = doc.getElementById(decodeURIComponent(new URL(a.href).hash.slice(1))); if (t) map.set(t, a); });
    /* 현재 키에 해당하는 본문 모듈의 머리띠 LED([data-spy-led])를 함께 켠다 */
    const light = (a) => map.forEach((k, t) => { const l = $('[data-spy-led]', t); if (l) l.classList.toggle('is-on', k === a); });
    keys.forEach((k) => k.addEventListener('click', () => light(k)));
    const io = new IntersectionObserver((ents) => {
      ents.forEach((en) => {
        if (!en.isIntersecting) return;
        const a = map.get(en.target);
        keys.forEach((k) => (k === a ? k.setAttribute('aria-current', 'location') : k.removeAttribute('aria-current')));
        light(a);
        scrollRackTo(a);
      });
    }, { rootMargin: '-30% 0px -60% 0px' });
    map.forEach((a, t) => io.observe(t));
  }
  /* 랙 모듈 경첩 덮개 — 좁은 화면(≤960px, 모듈이 한 줄로 쌓일 때)에서 모듈마다 U 레전드 키를 달고 접는다.
     접힘 여부는 CSS 미디어쿼리가 정하므로 넓은 화면에서는 아무것도 바뀌지 않는다. 첫 모듈만 열린 채 시작. */
  function initUnitHinges() {
    $$('.deck .unit').forEach((u, i) => {
      const ear = $('.unit__ear', u);
      const body = $('.unit__body', u);
      if (!ear || !body || $('.unit__hinge', u)) return;
      const titles = $$('.mhead__title', body).map((h) => h.textContent.split(' — ')[0].trim()).join(' · ');
      const b = doc.createElement('button');
      b.type = 'button';
      b.className = 'unit__hinge';
      b.setAttribute('aria-controls', ensureId(body, 'unit-body'));
      b.innerHTML = `<span class="unit__u mono">${$('.unit__u', ear).textContent}</span><span class="unit__legend">${$('.unit__legend', ear).textContent}</span><span class="unit__titles">${titles}</span><span class="led unit__led" aria-hidden="true"></span><span class="unit__latch" data-icon="chevron-down"></span>`;
      u.insertBefore(b, body);
      paintIcons(b);
      const set = (open) => { u.classList.toggle('is-folded', !open); b.setAttribute('aria-expanded', String(open)); };
      set(i === 0);
      b.addEventListener('click', () => set(u.classList.contains('is-folded')));
    });
    /* 주소의 #id 나 팔레트 이동이 접힌 모듈 안을 가리키면 덮개를 연다 */
    const reveal = () => {
      const t = location.hash.length > 1 && doc.getElementById(decodeURIComponent(location.hash.slice(1)));
      const u = t && t.closest('.unit.is-folded');
      if (u) $('.unit__hinge', u).click();
    };
    reveal();
    window.addEventListener('hashchange', reveal);
  }
  /* 구성 비교표(pricing): 좁은 화면에서 선택한 구성 열이 첫 화면에 보이도록 가로 위치를 맞춘다 */
  function initCmpFollow() {
    const table = $('.cmp');
    const keys = $('#cfg-keys');
    if (!table || !keys) return;
    const sc = table.closest('.scroll-x');
    if (!sc) return;
    const follow = (smooth) => {
      if (sc.scrollWidth - sc.clientWidth <= 2) return;
      const on = $('[aria-pressed="true"]', keys);
      if (!on) return;
      const th = $(`thead [data-col="${on.id.replace('cfg-', '')}"]`, table);
      const lead = $('thead th', table);
      if (!th || !lead) return;
      const left = Math.max(0, th.offsetLeft - lead.offsetWidth);
      sc.scrollTo({ left, behavior: smooth && !matchMedia('(prefers-reduced-motion: reduce)').matches ? 'smooth' : 'auto' });
    };
    keys.addEventListener('click', () => requestAnimationFrame(() => follow(true)));
    follow(false);
  }
  function initScrollHints() {
    $$('.tabs__bedwrap, .rack__bed, .table-wrap, .kanban-wrap').forEach((w) => w.classList.add('has-scroll-hint'));
    $$('.has-scroll-hint').forEach((w) => {
      const sc = w.matches('.scroll-x, .tabs__bed, .rack__keys, .kanban') ? w : $('.scroll-x, .tabs__bed, .rack__keys, .kanban', w);
      if (!sc) return;
      const upd = () => w.classList.toggle('is-clipped', sc.scrollWidth - sc.clientWidth - sc.scrollLeft > 2);
      sc.addEventListener('scroll', upd, { passive: true });
      addEventListener('resize', upd);
      if ('ResizeObserver' in window) new ResizeObserver(upd).observe(sc);
      upd();
    });
    /* 열린 창 견본 트레이: 끝까지 넘기면 오른쪽 페이드를 거둔다 */
    $$('.tray-scroll').forEach((sc) => {
      const upd = () => sc.classList.toggle('is-end', sc.scrollWidth - sc.clientWidth - sc.scrollLeft <= 2);
      sc.addEventListener('scroll', upd, { passive: true });
      addEventListener('resize', upd);
      upd();
    });
  }

  /* ── 25. 모션 시연 ──────────────────────────────────────────────── */
  function initMotionDemos() {
    doc.addEventListener('click', (e) => {
      const b = e.target.closest('[data-play]');
      if (!b) return;
      const t = $(b.getAttribute('data-play'));
      if (!t) return;
      const on = !t.classList.contains('is-playing');
      t.classList.toggle('is-playing', on);
      b.setAttribute('aria-pressed', String(on));
    });
  }

  /* ── 26. Esc — 가장 위의 것부터 닫기 ───────────────────────────── */
  function initEsc() {
    doc.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape') return;
      if (floating) { e.preventDefault(); closeFloating(true); return; }
      const top = overlayStack[overlayStack.length - 1];
      if (top) { e.preventDefault(); closeOverlay(top.el); }
    });
  }

  function init() {
    initTheme();
    paintIcons();
    paintGhosts();
    initSeg7();
    initOverlays();
    initCommand();
    initTabs();
    initAccordions();
    initToasts();
    initFloating();
    initTooltips();
    initCarousels();
    initKnobs();
    initFaders();
    initMeters();
    initKanban();
    initKanbanNav();
    initTables();
    initSelectables();
    initActions();
    initMarquees();
    initPowerSeq();
    initLeaders();
    initLightTargets();
    initForms();
    initWizards();
    initRack();
    initUnitHinges();
    initCmpFollow();
    initScrollHints();
    initMotionDemos();
    initEsc();
  }

  window.mongdol = { toast, setKnob, setMeter, setLcdText, paintIcons, openOverlay, closeOverlay, applyTheme };
  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', init); else init();
})();
