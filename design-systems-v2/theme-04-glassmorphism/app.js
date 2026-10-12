/* ==========================================================================
   윤슬홈 · app.js — 바닐라 JS (외부 라이브러리 없음)
   1 아이콘  2 테마  3 장면(창밖 강변) + 패럴랙스  4 시계  5 오버레이(모달·드로어·커맨드) + 후퇴
   6 커맨드 팔레트  7 탭  8 아코디언  9 토스트  10 팝오버  11 메뉴(길게 누름)  12 캐러셀
   13 툴팁  14 타일  15 세로 슬라이더  16 스테퍼 · 레인지  17 폼 검증  18 로딩 버튼 · 닫기 · 복사
   19 칸반  20 표 정렬·페이지  21 마키  22 등장 모션 · 시연  23 가로 스크롤 힌트  24 방 레일
   25 바인딩 · 마법사 · 달력 · 선택 목록 · 닦기
   ========================================================================== */
(() => {
  'use strict';
  const doc = document;
  const root = doc.documentElement;
  const $ = (s, c = doc) => c.querySelector(s);
  const $$ = (s, c = doc) => Array.from(c.querySelectorAll(s));
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const fmt = (n) => Number(n).toLocaleString('ko-KR');
  const emit = (el, name, detail) => el.dispatchEvent(new CustomEvent(name, { bubbles: true, detail }));
  let uid = 0;
  const ensureId = (el, p = 'ys') => el.id || (el.id = `${p}-${++uid}`);

  /* 받침 유무에 따라 조사 선택: josa('세탁', '과', '와') → '과' */
  const josa = (word, withBatchim, without) => {
    const ch = String(word).trim().slice(-1);
    const code = ch.charCodeAt(0);
    if (code >= 0xac00 && code <= 0xd7a3) return (code - 0xac00) % 28 ? withBatchim : without;
    return /[0-9lmnr]$/i.test(ch) ? withBatchim : without;
  };

  /* ── 1. 아이콘 (24 그리드, stroke 1.75, currentColor) ──────────── */
  const ICONS = {
    home: '<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    bell: '<path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>',
    moon: '<path d="M20.5 14.5A8.5 8.5 0 1 1 9.5 3.5a7 7 0 0 0 11 11z"/>',
    cloud: '<path d="M17.5 19a4.5 4.5 0 1 0-1.4-8.8A6 6 0 0 0 4.5 13 3 3 0 0 0 6 19z"/>',
    close: '<path d="M18 6 6 18M6 6l12 12"/>',
    'chevron-left': '<path d="m15 18-6-6 6-6"/>',
    'chevron-right': '<path d="m9 18 6-6-6-6"/>',
    'chevron-down': '<path d="m6 9 6 6 6-6"/>',
    'chevron-up': '<path d="m18 15-6-6-6 6"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    minus: '<path d="M5 12h14"/>',
    more: '<circle cx="5" cy="12" r="1.3"/><circle cx="12" cy="12" r="1.3"/><circle cx="19" cy="12" r="1.3"/>',
    bulb: '<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2V16h5v-.1c0-.8.4-1.5 1-2A6 6 0 0 0 12 3z"/>',
    lamp: '<path d="M5 15a7 7 0 0 1 14 0z"/><path d="M8 15v3.5a1.5 1.5 0 0 0 1.5 1.5h5a1.5 1.5 0 0 0 1.5-1.5V15"/><path d="M12 5V3"/>',
    pendant: '<path d="M12 3v5"/><path d="M5 15a7 7 0 0 1 14 0z"/><path d="M10 18a2 2 0 0 0 4 0"/>',
    thermo: '<path d="M14 14.76V4.5a2 2 0 0 0-4 0v10.26a4 4 0 1 0 4 0z"/>',
    snow: '<path d="M12 2v20M4.9 6.5l14.2 11M4.9 17.5l14.2-11"/><path d="m9 4 3 2 3-2M9 20l3-2 3 2"/>',
    wind: '<path d="M3 8h10a3 3 0 1 0-3-3"/><path d="M3 12h15a3 3 0 1 1-3 3"/><path d="M3 16h7"/>',
    drop: '<path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"/>',
    air: '<rect x="6" y="3" width="12" height="18" rx="3"/><circle cx="12" cy="9" r="2.5"/><path d="M9 15h6M9 18h6"/>',
    lock: '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
    unlock: '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 7.5-2"/>',
    door: '<path d="M5 21V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v17"/><path d="M3 21h18"/><circle cx="15" cy="12" r="1"/>',
    camera: '<rect x="2" y="6" width="14" height="12" rx="2"/><path d="m22 8-6 4 6 4z"/>',
    shield: '<path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z"/>',
    bolt: '<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
    washer: '<rect x="4" y="2" width="16" height="20" rx="2"/><circle cx="12" cy="13" r="5"/><path d="M8 6h.01M11 6h.01"/>',
    dryer: '<rect x="4" y="2" width="16" height="20" rx="2"/><circle cx="12" cy="13" r="5"/><path d="M10 12.5c.7-.8 1.3.8 2 0s1.3.8 2 0"/>',
    dish: '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M4 8h16M8 5.5h.01"/><path d="M9 13.5h6M9 16.5h6"/>',
    sensor: '<circle cx="12" cy="12" r="2"/><path d="M16.24 7.76a6 6 0 0 1 0 8.49M7.76 16.24a6 6 0 0 1 0-8.49M19.07 4.93a10 10 0 0 1 0 14.14M4.93 19.07a10 10 0 0 1 0-14.14"/>',
    hub: '<rect x="3" y="12" width="18" height="8" rx="2"/><path d="M7 16h.01M11 16h.01"/><path d="M8.5 8.5a5 5 0 0 1 7 0M6 6a8.5 8.5 0 0 1 12 0"/>',
    wifi: '<path d="M5 12.5a10 10 0 0 1 14 0M8.5 16a5 5 0 0 1 7 0M2 9a15 15 0 0 1 20 0"/><path d="M12 20h.01"/>',
    'wifi-off': '<path d="m2 2 20 20"/><path d="M8.5 16a5 5 0 0 1 7 0M5 12.5a10 10 0 0 1 4.5-2.6M16.7 10.6a10 10 0 0 1 2.3 1.9M2 9a15 15 0 0 1 4.2-2.8M10.7 5.1A15 15 0 0 1 22 9"/><path d="M12 20h.01"/>',
    car: '<path d="M4 16.5v-4l2-5h12l2 5v4z"/><path d="M4 12.5h16"/><circle cx="7.5" cy="17.5" r="1.5"/><circle cx="16.5" cy="17.5" r="1.5"/>',
    package: '<path d="M21 8 12 3 3 8v8l9 5 9-5z"/><path d="m3 8 9 5 9-5M12 13v8"/>',
    building: '<rect x="4" y="3" width="16" height="18" rx="1"/><path d="M9 21v-4h6v4M8 7h.01M12 7h.01M16 7h.01M8 11h.01M12 11h.01M16 11h.01"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14.5a6.5 6.5 0 0 1 3.5 5.5"/>',
    gear: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
    sliders: '<path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12"/><circle cx="16" cy="6" r="2"/><circle cx="10" cy="12" r="2"/><circle cx="18" cy="18" r="2"/>',
    grid: '<rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/>',
    inbox: '<path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>',
    columns: '<rect x="3" y="4" width="5" height="16" rx="1.5"/><rect x="10" y="4" width="5" height="10" rx="1.5"/><rect x="17" y="4" width="4" height="13" rx="1.5"/>',
    tag: '<path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8z"/><circle cx="7.5" cy="7.5" r="1.5"/>',
    bag: '<path d="M6 7h12l1 14H5z"/><path d="M9 7a3 3 0 0 1 6 0"/>',
    paw: '<circle cx="11" cy="4.5" r="2"/><circle cx="18" cy="8.5" r="2"/><circle cx="4.5" cy="10" r="2"/><path d="M8.5 14.5c1.3-2.6 5.7-2.6 7 0l1.2 2.4a2.5 2.5 0 0 1-3.2 3.4 4 4 0 0 0-3 0 2.5 2.5 0 0 1-3.2-3.4z"/>',
    play: '<path d="M7 4v16l13-8z"/>',
    pause: '<path d="M8 5v14M16 5v14"/>',
    refresh: '<path d="M21 12a9 9 0 1 1-2.64-6.36L21 8"/><path d="M21 3v5h-5"/>',
    alert: '<path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
    'check-circle': '<circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/>',
    'x-circle': '<circle cx="12" cy="12" r="9"/><path d="m15 9-6 6M9 9l6 6"/>',
    trash: '<path d="M3 6h18M8 6V4h8v2M6 6l1 15h10l1-15"/>',
    edit: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
    copy: '<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1"/>',
    link: '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
    logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5M21 12H9"/>',
    key: '<circle cx="7.5" cy="15.5" r="4.5"/><path d="m10.7 12.3 9.8-9.8M17 6l3 3M14.5 8.5l2 2"/>',
    film: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M7 3v18M17 3v18M3 8h4M3 16h4M17 8h4M17 16h4M3 12h18"/>',
    sunrise: '<path d="M12 2v6M5.2 10.2l1.4 1.4M2 18h2M20 18h2M17.4 11.6l1.4-1.4M22 22H2M8 6l4-4 4 4M16 18a4 4 0 0 0-8 0"/>',
    sofa: '<path d="M4 11V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3"/><path d="M2 13a2 2 0 0 1 4 0v2h12v-2a2 2 0 0 1 4 0v5H2z"/><path d="M5 18v2M19 18v2"/>',
    bed: '<path d="M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8"/><path d="M2 16h20M6 10V7a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3"/>',
    speaker: '<rect x="5" y="2" width="14" height="20" rx="2"/><circle cx="12" cy="14" r="4"/><path d="M12 6h.01"/>',
    curtain: '<path d="M3 3h18"/><path d="M5 3c0 6 3 12 6 18M19 3c0 6-3 12-6 18"/>',
    battery: '<rect x="2" y="7" width="17" height="10" rx="2"/><path d="M22 11v2M5.5 10v4"/>',
    filter: '<path d="M3 4h18l-7 8.5V19l-4 2v-8.5z"/>',
    pin: '<path d="M12 21s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12z"/><circle cx="12" cy="9" r="2.5"/>',
    'arrow-right': '<path d="M5 12h14M13 6l6 6-6 6"/>',
    'arrow-left': '<path d="M19 12H5M11 6l-6 6 6 6"/>',
    grip: '<circle cx="9" cy="6" r="1"/><circle cx="15" cy="6" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="9" cy="18" r="1"/><circle cx="15" cy="18" r="1"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    command: '<path d="M9 6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3z"/>',
    leaf: '<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.5 19 2c1 2 2 4.2 2 8 0 5.5-4.8 10-10 10z"/><path d="M2 21c0-3 1.9-5.4 5.1-6"/>',
    star: '<path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z"/>',
    chart: '<path d="M3 3v18h18"/><path d="m7 15 4-4 3 3 5-6"/>',
    card: '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/>',
    plug: '<path d="M9 2v6M15 2v6M6 8h12v4a6 6 0 0 1-12 0z"/><path d="M12 18v4"/>',
    phone: '<rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/>',
    eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    download: '<path d="M12 3v12M7 10l5 5 5-5M5 21h14"/>',
    external: '<path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
    glint: '<path d="M4 9h7M9 13h11M6 17h8"/>'
  };
  function paintIcons(scope = doc) {
    $$('[data-icon]', scope).forEach((el) => {
      const name = el.getAttribute('data-icon');
      if (el.dataset.painted === name) return;
      const p = ICONS[name];
      if (!p) return;
      el.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">${p}</svg>`;
      el.dataset.painted = name;
      if (!el.hasAttribute('aria-label')) el.setAttribute('aria-hidden', 'true');
    });
  }

  /* ── 2. 테마: URL ?theme= 최우선 → localStorage → 시스템 ─────────── */
  const THEME_KEY = 'ys-theme';
  const urlTheme = () => { const t = new URLSearchParams(location.search).get('theme'); return t === 'dark' || t === 'light' ? t : null; };
  const storedTheme = () => { try { const t = localStorage.getItem(THEME_KEY); return t === 'dark' || t === 'light' ? t : null; } catch (e) { return null; } };
  const systemTheme = () => (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  function applyTheme(t) {
    root.setAttribute('data-theme', t);
    $$('[data-theme-toggle]').forEach((b) => {
      const dark = t === 'dark';
      b.setAttribute('aria-pressed', String(dark));
      b.setAttribute('aria-label', dark ? '노을 장면(라이트)으로 전환' : '밤 장면(다크)으로 전환');
      if (b.dataset.tip !== undefined) b.dataset.tip = dark ? '노을 장면으로' : '밤 장면으로';
      const ic = $('[data-icon]', b);
      if (ic) { ic.setAttribute('data-icon', dark ? 'sun' : 'moon'); paintIcons(b); }
      const lb = $('[data-theme-label]', b);
      if (lb) lb.textContent = dark ? '노을' : '밤';
    });
    emit(doc, 'ys:theme', { theme: t });
  }
  applyTheme(urlTheme() || storedTheme() || systemTheme());
  function toggleTheme() {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem(THEME_KEY, next); } catch (e) { /* 저장 불가 환경 */ }
    applyTheme(next);
  }
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (!urlTheme() && !storedTheme()) applyTheme(systemTheme());
  });

  /* ── 3. 장면: 하늘 · 해/달 · 검단산 · 스카이라인 · 다리 · 강(윤슬) ─── */
  function rng(seed) {
    return () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  }
  function buildScene() {
    const scene = $('.scene');
    if (!scene || scene.childElementCount) return;
    const r = rng(1802);
    const W = 1600, H = 240;
    let far = '', near = '', wins = '';
    for (let x = -20; x < W;) {
      const w = 34 + r() * 52, h = 34 + r() * 70;
      far += `<rect class="far" x="${x.toFixed(1)}" y="${(H - h).toFixed(1)}" width="${w.toFixed(1)}" height="${h.toFixed(1)}"/>`;
      x += w + r() * 6;
    }
    for (let x = -10; x < W;) {
      const tower = r() > .4;
      const w = tower ? 18 + r() * 18 : 34 + r() * 46;
      const h = tower ? 80 + r() * 96 : 26 + r() * 40;
      const y = H - h;
      near += `<rect class="near" x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${w.toFixed(1)}" height="${h.toFixed(1)}"/>`;
      if (tower && r() > .55) { const sw = w * (.5 + r() * .25), sh = 8 + r() * 16; near += `<rect class="near" x="${(x + (w - sw) / 2).toFixed(1)}" y="${(y - sh).toFixed(1)}" width="${sw.toFixed(1)}" height="${sh.toFixed(1)}"/>`; }
      else if (tower && r() > .5) near += `<rect class="near" x="${(x + w / 2 - .8).toFixed(1)}" y="${(y - 7).toFixed(1)}" width="1.6" height="7"/>`;
      for (let wy = y + 6; wy < H - 6; wy += 7) {
        for (let wx = x + 4; wx < x + w - 5; wx += 6) {
          if (r() < .26) wins += `<rect class="win" x="${wx.toFixed(1)}" y="${wy.toFixed(1)}" width="2.6" height="3.2"/>`;
        }
      }
      x += w + 2 + r() * 14;
    }
    const hill = '<path d="M0 200 C120 180 200 120 330 96 C420 80 470 40 560 30 C640 22 700 70 780 92 C860 112 940 104 1040 128 C1160 156 1300 150 1420 168 C1500 178 1560 186 1600 190 V240 H0Z"/>';
    let bridge = '<rect class="deck" x="0" y="20" width="1600" height="4"/>';
    for (let x = 60; x < 1600; x += 180) bridge += `<rect class="deck" x="${x}" y="12" width="6" height="28"/>`;
    for (let x = 20; x < 1600; x += 40) bridge += `<circle class="lamp" cx="${x}" cy="18" r="1.8"/>`;
    /* 윤슬: 해 아래 세로 기둥(x ≈ 17vw)에 몰린 빛 조각. depth 0 = 수평선 쪽(가늘고 진함) → 1 = 앞쪽(넓고 옅음) */
    let glints = '';
    const piece = (cls, cx, depth, wMin, wMax, oMax) => {
      const spread = 1.2 + depth * 6.5;                       // 아래로 갈수록 기둥이 넓어진다(vw)
      const left = cx + (r() - .5) * 2 * spread;
      const w = wMin + depth * (wMax - wMin) * (.7 + r() * .3);
      const h = 3 + depth * 2 + r() * .6;
      const o = Math.max(.22, oMax - depth * .55) * (.75 + r() * .25);
      const d = (r() * 4.6 + (r() > .7 ? 1.3 : 0)).toFixed(2);  // 불규칙한 지연
      const t = (2.6 + r() * 2.2).toFixed(2);
      return `<i class="scene__glint ${cls}" style="left:${left.toFixed(2)}vw;top:${(3 + depth * 86).toFixed(1)}%;--w:${w.toFixed(0)}px;--h:${h.toFixed(1)}px;--o:${o.toFixed(2)};--d:-${d}s;--t:${t}s"></i>`;
    };
    for (let i = 0; i < 30; i++) { const depth = Math.pow(i / 29, 1.15) * .96 + r() * .04; glints += piece('scene__glint--sun', 17, depth, 18, 64, .95); }
    for (let i = 0; i < 12; i++) { const depth = Math.pow(i / 11, 1.2) * .9 + r() * .05; glints += piece('scene__glint--moon', 78, depth * .8, 14, 40, .7); }
    const reflect = `<svg class="scene__reflect" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMax slice" aria-hidden="true">${far}${near}${wins}</svg>`;
    scene.setAttribute('aria-hidden', 'true');
    scene.innerHTML =
      '<div class="scene__sky"><div class="scene__stars"></div></div>' +
      '<div class="scene__sun"></div>' +
      `<svg class="scene__hill" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMax slice" aria-hidden="true">${hill}</svg>` +
      `<div class="scene__river">${reflect}${glints}</div>` +
      `<svg class="scene__city" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMax slice" aria-hidden="true">${far}${near}${wins}</svg>` +
      `<svg class="scene__bridge" viewBox="0 0 ${W} 40" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${bridge}</svg>` +
      '<div class="scene__streaks"></div>';
    placeStreaks();
    let rs = 0;
    window.addEventListener('resize', () => { clearTimeout(rs); rs = setTimeout(placeStreaks, 160); }, { passive: true });
  }
  /* 밤: 다리 조명마다 아래로 늘어진 반사 줄기 — 조명의 실제 화면 위치에 맞춘다(같은 패럴랙스 판 안이라 이동이 상쇄됨) */
  function placeStreaks() {
    const box = $('.scene__streaks'), bridge = $('.scene__bridge');
    if (!box || !bridge) return;
    const br = bridge.getBoundingClientRect();
    if (!br.width) return;
    const r = rng(2240);
    let html = '';
    $$('.lamp', bridge).forEach((l) => {
      const lr = l.getBoundingClientRect();
      const x = lr.left + lr.width / 2 - br.left;
      if (x < -4 || x > br.width + 4) return;
      const w = (2 + r()).toFixed(1), h = (2 + r() * 4).toFixed(2), o = (.42 + r() * .4).toFixed(2);
      html += `<i class="scene__streak" style="left:${x.toFixed(1)}px;--w:${w}px;--h:${h}vh;--o:${o};--d:-${(r() * 4).toFixed(2)}s;--t:${(3.2 + r() * 2.4).toFixed(2)}s"></i>`;
    });
    box.innerHTML = html;
  }
  function initParallax() {
    const scene = $('.scene');
    if (!scene) return;
    let raf = 0, tx = 0, ty = 0;
    window.addEventListener('pointermove', (e) => {
      if (reduceMotion.matches || !finePointer.matches || e.pointerType !== 'mouse') return;
      tx = (e.clientX / innerWidth) * 2 - 1;
      ty = (e.clientY / innerHeight) * 2 - 1;
      if (!raf) raf = requestAnimationFrame(() => { raf = 0; scene.style.setProperty('--px', tx.toFixed(3)); scene.style.setProperty('--py', ty.toFixed(3)); });
    }, { passive: true });
  }

  /* ── 4. 시계: 장면 시각(17:42 / 22:40)에서 실제 흐른 분만큼 진행 ─── */
  function initClock() {
    const spans = $$('[data-clock] > span, [data-clock-text]');
    if (!spans.length) return;
    spans.forEach((s) => { if (!s.dataset.base) s.dataset.base = s.textContent.trim(); });
    const start = Date.now();
    let shown = 0;
    setInterval(() => {
      const mins = Math.floor((Date.now() - start) / 60000);
      if (mins === shown) return;
      shown = mins;
      spans.forEach((s) => {
        const m = /^(\d{1,2}):(\d{2})$/.exec(s.dataset.base);
        if (!m) return;
        const total = (+m[1] * 60 + +m[2] + mins) % 1440;
        const txt = `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
        if (reduceMotion.matches) { s.textContent = txt; return; }
        s.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 100, fill: 'forwards' }).onfinish = () => {
          s.textContent = txt;
          s.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 100, fill: 'forwards' });
        };
      });
    }, 5000);
  }

  /* ── 공통: 포커스 가능 요소 · 트랩 ─────────────────────────────── */
  const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]), [contenteditable="true"]';
  const focusables = (el) => $$(FOCUSABLE, el).filter((n) => n.getClientRects().length && !n.closest('[inert]') && getComputedStyle(n).visibility !== 'hidden');
  function trapTab(e, container) {
    const f = focusables(container);
    if (!f.length) { e.preventDefault(); return; }
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && doc.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && doc.activeElement === last) { e.preventDefault(); first.focus(); }
    else if (!container.contains(doc.activeElement)) { e.preventDefault(); first.focus(); }
  }
  const chromeEls = () => $$('.app, .statusbar, .dock, .marquee:not(.app .marquee), .footline:not(.app .footline)');

  /* ── 5. 오버레이(모달·드로어·커맨드) + 시그니처 B 후퇴 ───────────── */
  const stack = [];
  function setRecede(on) {
    const app = $('.app');
    if (on) {
      if (app) app.style.setProperty('--recede-y', `${Math.round(innerHeight / 2 - app.getBoundingClientRect().top)}px`);
      doc.body.setAttribute('data-receded', '');
      chromeEls().forEach((el) => el.setAttribute('inert', ''));
    } else {
      doc.body.removeAttribute('data-receded');
      chromeEls().forEach((el) => el.removeAttribute('inert'));
    }
  }
  function openOverlay(el, opener) {
    if (!el || el.classList.contains('is-open')) return;
    closeFloating();
    el.hidden = false;
    el._opener = opener || doc.activeElement;
    stack.push(el);
    setRecede(true);
    requestAnimationFrame(() => {
      el.classList.add('is-open');
      const target = $('[autofocus]', el) || $('.cmd__input', el) || focusables(el).find((n) => !n.matches('.overlay__scrim')) || el;
      if (target === el) el.setAttribute('tabindex', '-1');
      setTimeout(() => target.focus({ preventScroll: true }), 30);
    });
    emit(el, 'ys:open');
  }
  function closeOverlay(el) {
    if (!el || !el.classList.contains('is-open')) return;
    el.classList.remove('is-open');
    const i = stack.indexOf(el);
    if (i > -1) stack.splice(i, 1);
    if (!stack.length) setRecede(false);
    const opener = el._opener;
    if (opener && opener.focus && doc.contains(opener)) setTimeout(() => opener.focus({ preventScroll: true }), 10);
    emit(el, 'ys:close');
  }
  const topOverlay = () => stack[stack.length - 1];

  /* ── 6. 커맨드 팔레트 ⌘K ──────────────────────────────────────── */
  function initCommand(cmd) {
    const input = $('.cmd__input', cmd);
    const list = $('.cmd__list', cmd);
    const empty = $('.cmd__empty', cmd);
    if (!input || !list) return;
    const items = () => $$('.cmd__item', list).filter((i) => !i.hidden);
    $$('.cmd__item', list).forEach((it) => {
      ensureId(it, 'cmd-opt');
      const t = $('.cmd__title', it);
      if (t && !t.dataset.raw) t.dataset.raw = t.textContent;
    });
    input.setAttribute('aria-controls', ensureId(list, 'cmd-list'));
    const select = (it) => {
      $$('.cmd__item', list).forEach((x) => x.setAttribute('aria-selected', String(x === it)));
      if (it) {
        input.setAttribute('aria-activedescendant', it.id);
        /* 목록 안에서만 스크롤 — 페이지 전체를 끌고 가지 않는다(정적 견본이 로드 때 페이지를 내리던 문제) */
        const lr = list.getBoundingClientRect(), ir = it.getBoundingClientRect();
        const top = ir.top - lr.top + list.scrollTop, bot = top + ir.height;
        if (top < list.scrollTop) list.scrollTop = top;
        else if (bot > list.scrollTop + list.clientHeight) list.scrollTop = bot - list.clientHeight;
      }
      else input.removeAttribute('aria-activedescendant');
    };
    const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
    const filter = () => {
      const q = input.value.trim().toLowerCase();
      let count = 0;
      $$('.cmd__item', list).forEach((it) => {
        const t = $('.cmd__title', it);
        const raw = t ? t.dataset.raw : '';
        const hay = `${raw} ${it.dataset.keywords || ''} ${($('.cmd__meta', it) || {}).textContent || ''}`.toLowerCase();
        const hit = !q || hay.includes(q);
        it.hidden = !hit;
        if (hit) count++;
        if (t) {
          const idx = q ? raw.toLowerCase().indexOf(q) : -1;
          t.innerHTML = idx > -1 ? `${esc(raw.slice(0, idx))}<mark>${esc(raw.slice(idx, idx + q.length))}</mark>${esc(raw.slice(idx + q.length))}` : esc(raw);
        }
      });
      $$('.cmd__group', list).forEach((g) => { g.hidden = !$$('.cmd__item', g).some((i) => !i.hidden); });
      if (empty) {
        empty.hidden = count > 0;
        const qEl = $('[data-cmd-query]', empty);
        if (qEl) qEl.textContent = `‘${input.value.trim()}’${josa(input.value.trim(), '과', '와')}`;
      }
      list.hidden = count === 0;
      select(items()[0] || null);
    };
    input.addEventListener('input', filter);
    input.addEventListener('keydown', (e) => {
      const its = items();
      const cur = its.findIndex((i) => i.getAttribute('aria-selected') === 'true');
      if (e.key === 'ArrowDown') { e.preventDefault(); select(its[(cur + 1) % its.length]); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); select(its[(cur - 1 + its.length) % its.length]); }
      else if (e.key === 'Enter' && its[cur]) { e.preventDefault(); activate(its[cur]); }
    });
    list.addEventListener('mousemove', (e) => { const it = e.target.closest('.cmd__item'); if (it && it.getAttribute('aria-selected') !== 'true') select(it); });
    list.addEventListener('click', (e) => { const it = e.target.closest('.cmd__item'); if (it) activate(it); });
    const activate = (it) => {
      if (it.dataset.href) { location.href = it.dataset.href; return; }
      if (!cmd.classList.contains('is-static')) closeOverlay(cmd);
      toastFrom(it, { title: ($('.cmd__title', it) || it).textContent.trim(), text: it.dataset.toastText || '실행했어요.' });
    };
    cmd.addEventListener('ys:open', () => { input.value = ''; filter(); });
    if (cmd.classList.contains('is-static')) filter();
  }

  /* ── 7. 탭 ───────────────────────────────────────────────────── */
  function placeInk(list) {
    const ink = $('.tabs__ink', list.parentElement) || $('.tabs__ink', list);
    const sel = $('[role="tab"][aria-selected="true"]', list);
    if (!ink || !sel) return;
    list.classList.add('has-ink');
    ink.style.setProperty('--ink-x', `${sel.offsetLeft - (list.contains(ink) ? 0 : list.scrollLeft)}px`);
    ink.style.setProperty('--ink-w', `${sel.offsetWidth}px`);
  }
  function selectTab(tab, focus) {
    const list = tab.closest('[role="tablist"]');
    if (!list || tab.disabled) return;
    $$('[role="tab"]', list).forEach((t) => {
      const on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      const p = t.getAttribute('aria-controls') && doc.getElementById(t.getAttribute('aria-controls'));
      if (p) p.hidden = !on;
    });
    if (focus) tab.focus();
    tab.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: reduceMotion.matches ? 'auto' : 'smooth' });
    placeInk(list);
    emit(tab, 'ys:tab', { id: tab.id });
  }
  function initTabs() {
    $$('[role="tablist"]').forEach((list) => {
      const tabs = $$('[role="tab"]', list);
      const sel = tabs.find((t) => t.getAttribute('aria-selected') === 'true') || tabs[0];
      tabs.forEach((t) => {
        t.tabIndex = t === sel ? 0 : -1;
        if (!t.getAttribute('aria-selected')) t.setAttribute('aria-selected', String(t === sel));
      });
      placeInk(list);
      list.addEventListener('scroll', () => placeInk(list), { passive: true });
      list.addEventListener('keydown', (e) => {
        const all = $$('[role="tab"]:not(:disabled)', list);
        const i = all.indexOf(doc.activeElement);
        if (i < 0) return;
        const vertical = list.getAttribute('aria-orientation') === 'vertical';
        let n = null;
        if (e.key === (vertical ? 'ArrowDown' : 'ArrowRight')) n = all[(i + 1) % all.length];
        else if (e.key === (vertical ? 'ArrowUp' : 'ArrowLeft')) n = all[(i - 1 + all.length) % all.length];
        else if (e.key === 'Home') n = all[0];
        else if (e.key === 'End') n = all[all.length - 1];
        if (n) { e.preventDefault(); selectTab(n, true); }
      });
    });
    window.addEventListener('resize', () => $$('[role="tablist"]').forEach(placeInk));
    if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(() => $$('[role="tablist"]').forEach(placeInk));
  }

  /* ── 8. 아코디언 ─────────────────────────────────────────────── */
  function setAcc(trigger, open) {
    const item = trigger.closest('.acc__item');
    trigger.setAttribute('aria-expanded', String(open));
    if (item) item.classList.toggle('is-open', open);
  }
  function initAccordions() {
    $$('.acc__trigger').forEach((t) => setAcc(t, t.getAttribute('aria-expanded') === 'true'));
  }

  /* ── 9. 토스트 — OS 알림 배너 깊이 스택 ───────────────────────── */
  function toaster() {
    let t = $('.toaster');
    if (!t) {
      t = doc.createElement('div');
      t.className = 'toaster';
      t.setAttribute('role', 'region');
      t.setAttribute('aria-label', '알림 배너');
      t.setAttribute('aria-live', 'polite');
      doc.body.appendChild(t);
    }
    return t;
  }
  function restack(t) {
    const live = $$('.toast:not(.is-leaving)', t).reverse();
    live.forEach((el, i) => el.setAttribute('data-depth', String(Math.min(i, 3))));
  }
  function removeToast(el) {
    if (!el || el.classList.contains('is-leaving')) return;
    clearTimeout(el._timer);
    el.classList.add('is-leaving');
    el.removeAttribute('data-depth');
    const t = el.parentElement;
    setTimeout(() => { el.remove(); if (t) restack(t); }, reduceMotion.matches ? 60 : 300);
    if (t) restack(t);
  }
  function toast(opts = {}) {
    const t = toaster();
    const el = doc.createElement('div');
    el.className = 'toast glass glass--z3 is-entering';
    el.setAttribute('role', opts.tone === 'danger' ? 'alert' : 'status');
    const tone = opts.tone ? ` data-tone="${opts.tone}"` : '';
    el.innerHTML =
      `<span class="toast__app"${tone}><span data-icon="${opts.icon || 'glint'}"></span></span>` +
      `<div class="toast__top"><span class="toast__src"></span><span class="toast__time"></span></div>` +
      `<div class="toast__body"><strong class="toast__title"></strong>${opts.text ? '<span class="toast__text"></span>' : ''}</div>` +
      '<button class="btn btn--icon btn--sm toast__close" type="button" aria-label="알림 닫기"><span data-icon="close"></span></button>';
    $('.toast__src', el).textContent = opts.src || '윤슬홈';
    $('.toast__time', el).textContent = opts.time || '지금';
    $('.toast__title', el).textContent = opts.title || '';
    if (opts.text) $('.toast__text', el).textContent = opts.text;
    paintIcons(el);
    t.appendChild(el);
    restack(t);
    requestAnimationFrame(() => requestAnimationFrame(() => el.classList.remove('is-entering')));
    const arm = () => { clearTimeout(el._timer); el._timer = setTimeout(() => removeToast(el), opts.duration || 5200); };
    el.addEventListener('mouseenter', () => clearTimeout(el._timer));
    el.addEventListener('mouseleave', arm);
    el.addEventListener('focusin', () => clearTimeout(el._timer));
    $('.toast__close', el).addEventListener('click', () => removeToast(el));
    arm();
    const live = $$('.toast:not(.is-leaving)', t);
    if (live.length > 4) removeToast(live[0]);
    return el;
  }
  function toastFrom(el, fallback = {}) {
    const d = el.dataset;
    if (!('toast' in d) && !fallback.title) return;
    toast({
      title: d.toastTitle || fallback.title || '',
      text: d.toastText || fallback.text || '',
      src: d.toastSrc || fallback.src,
      icon: d.toastIcon || fallback.icon,
      tone: d.toastTone || fallback.tone,
      time: d.toastTime || fallback.time
    });
  }
  window.ysToast = toast;

  /* ── 10. 팝오버 · 11. 메뉴 (떠 있는 z3 판 공통 배치) ──────────── */
  let floating = null; // { el, trigger, scope }
  function place(el, anchor, opts = {}) {
    const gap = 8;
    const a = anchor.getBoundingClientRect ? anchor.getBoundingClientRect() : anchor;
    const w = el.offsetWidth, h = el.offsetHeight;
    let left = opts.align === 'start' ? a.left : a.left + a.width / 2 - w / 2;
    let top = a.bottom + gap;
    let origin = 'top center';
    if (top + h > innerHeight - 12 && a.top - gap - h > 12) { top = a.top - gap - h; origin = 'bottom center'; }
    left = clamp(left, 12, innerWidth - w - 12);
    top = clamp(top, 12, Math.max(12, innerHeight - h - 12));
    el.style.left = `${Math.round(left)}px`;
    el.style.top = `${Math.round(top)}px`;
    el.style.setProperty('--origin', origin);
  }
  function closeFloating(restore) {
    if (!floating) return;
    const { el, trigger, scope } = floating;
    el.classList.remove('is-open');
    if (trigger) trigger.setAttribute('aria-expanded', 'false');
    if (scope) { scope.classList.remove('has-menu'); $$('.is-menu-source', scope).forEach((n) => n.classList.remove('is-menu-source')); }
    floating = null;
    if (restore && trigger) trigger.focus({ preventScroll: true });
  }
  function openFloating(el, trigger, anchor, kind) {
    closeFloating();
    el.hidden = false;
    if (trigger) trigger.setAttribute('aria-expanded', 'true');
    let scope = null;
    if (kind === 'menu' && trigger) {
      scope = trigger.closest('[data-menu-scope]') || trigger.parentElement;
      const src = Array.from(scope.children).find((c) => c.contains(trigger));
      if (src) { scope.classList.add('has-menu'); src.classList.add('is-menu-source'); }
    }
    place(el, anchor || trigger, { align: kind === 'menu' && !anchor ? 'start' : 'center' });
    requestAnimationFrame(() => el.classList.add('is-open'));
    floating = { el, trigger, scope, kind };
    if (kind === 'menu') {
      const first = $$('[role^="menuitem"]:not(:disabled)', el)[0];
      if (first) setTimeout(() => first.focus({ preventScroll: true }), 20);
    } else {
      const f = focusables(el)[0];
      if (f) setTimeout(() => f.focus({ preventScroll: true }), 20);
    }
  }
  function initMenus() {
    $$('.menu').forEach((m) => {
      if (!m.getAttribute('role')) m.setAttribute('role', 'menu');
      m.addEventListener('keydown', (e) => {
        const items = $$('[role^="menuitem"]:not(:disabled)', m);
        const i = items.indexOf(doc.activeElement);
        let n = null;
        if (e.key === 'ArrowDown') n = items[(i + 1) % items.length];
        else if (e.key === 'ArrowUp') n = items[(i - 1 + items.length) % items.length];
        else if (e.key === 'Home') n = items[0];
        else if (e.key === 'End') n = items[items.length - 1];
        else if (e.key === 'Tab') closeFloating();
        if (n) { e.preventDefault(); n.focus(); }
      });
    });
    // 길게 누름(500ms) · 우클릭 · Shift+F10 → 컨텍스트 메뉴
    $$('[data-longpress-menu]').forEach((el) => {
      const menu = doc.getElementById(el.dataset.longpressMenu);
      if (!menu) return;
      el.setAttribute('aria-haspopup', 'menu');
      let timer = 0, sx = 0, sy = 0;
      const open = (pt) => { el._suppressClick = true; openFloating(menu, el, pt ? { left: pt.x, top: pt.y, right: pt.x, bottom: pt.y, width: 0, height: 0 } : null, 'menu'); };
      el.addEventListener('pointerdown', (e) => {
        if (e.button !== 0) return;
        sx = e.clientX; sy = e.clientY;
        clearTimeout(timer);
        timer = setTimeout(() => { if (navigator.vibrate) navigator.vibrate(8); open(); }, 500);
      });
      el.addEventListener('pointermove', (e) => { if (Math.hypot(e.clientX - sx, e.clientY - sy) > 8) clearTimeout(timer); });
      ['pointerup', 'pointercancel', 'pointerleave'].forEach((t) => el.addEventListener(t, () => clearTimeout(timer)));
      el.addEventListener('contextmenu', (e) => { e.preventDefault(); clearTimeout(timer); open({ x: e.clientX, y: e.clientY }); });
      el.addEventListener('keydown', (e) => { if ((e.shiftKey && e.key === 'F10') || e.key === 'ContextMenu') { e.preventDefault(); open(); } });
    });
  }

  /* ── 12. 캐러셀 ─────────────────────────────────────────────── */
  function initCarousels() {
    $$('[data-carousel]').forEach((c) => {
      const vp = $('.carousel__viewport', c);
      const slides = $$('.carousel__slide', c);
      if (!vp || !slides.length) return;
      const prev = $('[data-carousel-prev]', c), next = $('[data-carousel-next]', c);
      const dotsBox = $('[data-carousel-dots]', c);
      let dots = [];
      if (dotsBox) {
        dotsBox.innerHTML = '';
        dots = slides.map((s, i) => {
          const b = doc.createElement('button');
          b.type = 'button';
          b.className = 'pager-dots__dot';
          b.setAttribute('aria-label', `${i + 1}번째 장면 보기`);
          b.addEventListener('click', () => go(i));
          dotsBox.appendChild(b);
          return b;
        });
      }
      slides.forEach((s, i) => { s.setAttribute('aria-roledescription', '슬라이드'); s.setAttribute('aria-label', `${i + 1} / ${slides.length}`); });
      let cur = -1;
      const go = (i) => {
        i = clamp(i, 0, slides.length - 1);
        vp.scrollTo({ left: slides[i].offsetLeft - slides[0].offsetLeft, behavior: reduceMotion.matches ? 'auto' : 'smooth' });
      };
      const update = () => {
        const x = vp.scrollLeft;
        let best = 0, bd = Infinity;
        slides.forEach((s, i) => { const d = Math.abs(s.offsetLeft - slides[0].offsetLeft - x); if (d < bd) { bd = d; best = i; } });
        if (vp.scrollLeft + vp.clientWidth >= vp.scrollWidth - 4) best = slides.length - 1 > best && bd > 4 ? slides.length - 1 : best;
        if (best === cur) return;
        cur = best;
        slides.forEach((s, i) => s.classList.toggle('is-active', i === cur));
        dots.forEach((d, i) => d.setAttribute('aria-current', String(i === cur)));
        if (prev) prev.disabled = cur === 0;
        if (next) next.disabled = cur === slides.length - 1;
      };
      if (prev) prev.addEventListener('click', () => go(cur - 1));
      if (next) next.addEventListener('click', () => go(cur + 1));
      vp.addEventListener('scroll', () => requestAnimationFrame(update), { passive: true });
      vp.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') { e.preventDefault(); go(cur + 1); }
        if (e.key === 'ArrowLeft') { e.preventDefault(); go(cur - 1); }
      });
      if (!vp.hasAttribute('tabindex')) vp.tabIndex = 0;
      update();
    });
  }

  /* ── 13. 툴팁 [data-tip] — 300ms 지연 ─────────────────────────── */
  function initTooltips() {
    const tip = doc.createElement('div');
    tip.className = 'tooltip';
    tip.id = 'ys-tooltip';
    tip.setAttribute('role', 'tooltip');
    doc.body.appendChild(tip);
    let timer = 0, owner = null;
    const show = (el) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        owner = el;
        tip.textContent = el.dataset.tip;
        const r = el.getBoundingClientRect();
        tip.classList.remove('is-shown');
        tip.style.left = '0px'; tip.style.top = '0px';
        const w = tip.offsetWidth, h = tip.offsetHeight;
        let top = r.top - h - 8;
        if (top < 8) top = r.bottom + 8;
        tip.style.left = `${Math.round(clamp(r.left + r.width / 2 - w / 2, 8, innerWidth - w - 8))}px`;
        tip.style.top = `${Math.round(top)}px`;
        el.setAttribute('aria-describedby', tip.id);
        tip.classList.add('is-shown');
      }, 300);
    };
    const hide = () => {
      clearTimeout(timer);
      tip.classList.remove('is-shown');
      if (owner) owner.removeAttribute('aria-describedby');
      owner = null;
    };
    doc.addEventListener('pointerover', (e) => { const el = e.target.closest('[data-tip]'); if (el && e.pointerType === 'mouse') show(el); });
    doc.addEventListener('pointerout', (e) => { const el = e.target.closest('[data-tip]'); if (el && !el.contains(e.relatedTarget)) hide(); });
    doc.addEventListener('focusin', (e) => { const el = e.target.closest('[data-tip]'); if (el && el.matches(':focus-visible')) show(el); });
    doc.addEventListener('focusout', hide);
    doc.addEventListener('pointerdown', hide);
    window.addEventListener('scroll', hide, { passive: true });
    doc.addEventListener('keydown', (e) => { if (e.key === 'Escape' && owner) hide(); });
  }

  /* ── 14. 타일 토글 ──────────────────────────────────────────── */
  function toggleTile(tile) {
    if (tile.getAttribute('aria-disabled') === 'true') {
      toastFrom(tile, { title: tile.dataset.offlineTitle || '기기가 응답하지 않아요', text: tile.dataset.offlineText || '전원과 Wi-Fi 연결을 확인해 주세요.', icon: 'wifi-off', tone: 'danger' });
      return;
    }
    const on = tile.getAttribute('aria-pressed') !== 'true';
    tile.setAttribute('aria-pressed', String(on));
    const st = $('.tile__state', tile);
    if (st && (tile.dataset.on || tile.dataset.off)) st.textContent = on ? tile.dataset.on : tile.dataset.off;
    emit(tile, 'ys:toggle', { on });
  }

  /* ── 15. 세로 슬라이더 (조명 밝기) ───────────────────────────── */
  function setV(sl, v, commit) {
    const min = +(sl.getAttribute('aria-valuemin') || 0), max = +(sl.getAttribute('aria-valuemax') || 100);
    v = Math.round(clamp(v, min, max));
    const pct = ((v - min) / (max - min)) * 100;
    sl.style.setProperty('--v', pct.toFixed(1));
    sl.setAttribute('aria-valuenow', String(v));
    const unit = sl.dataset.unit ?? '%';
    sl.setAttribute('aria-valuetext', v === 0 && sl.dataset.zero ? sl.dataset.zero : `${v}${unit}`);
    const out = $('.vslider__value', sl);
    if (out) out.textContent = v === 0 && sl.dataset.zero ? sl.dataset.zero : `${v}${unit}`;
    if (sl.dataset.out) $$(sl.dataset.out).forEach((o) => { o.textContent = `${v}${unit}`; });
    if (commit) {
      sl.classList.remove('is-release'); void sl.offsetWidth; sl.classList.add('is-release');
      emit(sl, 'ys:change', { value: v });
    }
  }
  function initVSliders() {
    $$('.vslider[role="slider"]').forEach((sl) => {
      if (sl.getAttribute('aria-disabled') === 'true') return;
      if (!sl.hasAttribute('tabindex')) sl.tabIndex = 0;
      setV(sl, +(sl.getAttribute('aria-valuenow') || 0));
      const fromY = (y) => {
        const r = sl.getBoundingClientRect();
        const min = +(sl.getAttribute('aria-valuemin') || 0), max = +(sl.getAttribute('aria-valuemax') || 100);
        return min + (1 - clamp((y - r.top) / r.height, 0, 1)) * (max - min);
      };
      let drag = false;
      sl.addEventListener('pointerdown', (e) => { drag = true; sl.setPointerCapture(e.pointerId); setV(sl, fromY(e.clientY)); });
      sl.addEventListener('pointermove', (e) => { if (drag) setV(sl, fromY(e.clientY)); });
      const end = () => { if (!drag) return; drag = false; setV(sl, +sl.getAttribute('aria-valuenow'), true); };
      sl.addEventListener('pointerup', end);
      sl.addEventListener('pointercancel', end);
      sl.addEventListener('keydown', (e) => {
        const v = +sl.getAttribute('aria-valuenow');
        const step = +(sl.dataset.step || 5);
        const map = { ArrowUp: v + step, ArrowRight: v + step, ArrowDown: v - step, ArrowLeft: v - step, PageUp: v + step * 4, PageDown: v - step * 4, Home: +(sl.getAttribute('aria-valuemin') || 0), End: +(sl.getAttribute('aria-valuemax') || 100) };
        if (e.key in map) { e.preventDefault(); setV(sl, map[e.key], true); }
      });
    });
  }

  /* ── 16. 스테퍼 · 레인지 ─────────────────────────────────────── */
  function initSteppers() {
    $$('[data-stepper]').forEach((st) => {
      const out = $('.stepper__value', st);
      const min = +(st.dataset.min ?? -Infinity), max = +(st.dataset.max ?? Infinity), step = +(st.dataset.step || 1);
      const unit = st.dataset.unit || '';
      let v = +(st.dataset.value ?? parseFloat(out ? out.textContent : 0));
      const dec = String(step).includes('.') ? String(step).split('.')[1].length : 0;
      const render = () => {
        if (out) { out.textContent = `${v.toFixed(dec)}${unit}`; out.setAttribute('aria-live', 'polite'); }
        const dn = $('[data-step="-1"]', st), up = $('[data-step="1"]', st);
        if (dn) dn.disabled = v <= min;
        if (up) up.disabled = v >= max;
        st.dataset.value = v;
      };
      st.addEventListener('click', (e) => {
        const b = e.target.closest('[data-step]');
        if (!b) return;
        v = clamp(+(v + step * +b.dataset.step).toFixed(dec), min, max);
        render();
        emit(st, 'ys:change', { value: v });
      });
      render();
    });
  }
  const formatValue = (v, f) => {
    if (f === 'kelvin') return `${fmt(Math.round(v / 50) * 50)}K`;
    if (f === 'percent') return `${v}%`;
    if (f === 'celsius') return `${v}°C`;
    return String(v);
  };
  function syncRange(r) {
    const min = +(r.min || 0), max = +(r.max || 100);
    r.style.setProperty('--v', (((+r.value - min) / (max - min)) * 100).toFixed(1));
    const txt = formatValue(+r.value, r.dataset.format);
    r.setAttribute('aria-valuetext', txt);
    if (r.dataset.out) $$(r.dataset.out).forEach((o) => { o.textContent = txt; });
  }

  /* ── 17. 폼 검증 ─────────────────────────────────────────────── */
  function validateField(f) {
    let ok = true;
    const val = (f.value || '').trim();
    if (f.type === 'checkbox') ok = !f.required || f.checked;
    else if (f.required && !val) ok = false;
    else if (val && f.dataset.pattern && !new RegExp(f.dataset.pattern).test(val)) ok = false;
    else if (val && f.type === 'email' && !/^\S+@\S+\.\S+$/.test(val)) ok = false;
    f.setAttribute('aria-invalid', String(!ok));
    const field = f.closest('.field');
    const err = field && $('.field__error', field);
    if (err) {
      ensureId(err, 'err');
      const ids = new Set((f.getAttribute('aria-describedby') || '').split(' ').filter(Boolean));
      if (!ok) ids.add(err.id); else ids.delete(err.id);
      if (ids.size) f.setAttribute('aria-describedby', Array.from(ids).join(' ')); else f.removeAttribute('aria-describedby');
      if (!ok && !val && f.dataset.requiredMsg) { const m = $('[data-msg]', err) || err; m.textContent = f.dataset.requiredMsg; }
      else if (!ok && f.dataset.patternMsg) { const m = $('[data-msg]', err) || err; m.textContent = f.dataset.patternMsg; }
    }
    if (ok && f.getAttribute('aria-invalid') === 'false' && !field) f.removeAttribute('aria-invalid');
    return ok;
  }
  function initForms() {
    $$('form[data-validate]').forEach((form) => {
      form.noValidate = true;
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const fields = $$('input, select, textarea', form).filter((f) => f.required || f.dataset.pattern);
        const bad = fields.filter((f) => !validateField(f));
        if (bad.length) { bad[0].focus(); return; }
        const btn = $('[type="submit"]', form);
        const done = () => {
          toast({ title: form.dataset.successTitle || '저장했어요', text: form.dataset.successText || '', icon: form.dataset.successIcon || 'check-circle', tone: 'success' });
          emit(form, 'ys:submit');
        };
        if (btn) runBusy(btn, +(form.dataset.busy || 900), done); else done();
      });
      form.addEventListener('input', (e) => { if (e.target.getAttribute('aria-invalid') === 'true') validateField(e.target); });
      form.addEventListener('focusout', (e) => { const f = e.target; if ((f.required || f.dataset.pattern) && f.value) validateField(f); });
    });
  }

  /* ── 18. 로딩 버튼 · 닫기 · 복사 ─────────────────────────────── */
  function runBusy(btn, ms, after) {
    if (btn.getAttribute('aria-busy') === 'true') return;
    const label = $('[data-label]', btn);
    const orig = label ? label.textContent : null;
    btn.setAttribute('aria-busy', 'true');
    btn.disabled = true;
    const sp = doc.createElement('span');
    sp.className = 'spinner spinner--sm';
    sp.setAttribute('aria-hidden', 'true');
    btn.prepend(sp);
    if (label && btn.dataset.busyLabel) label.textContent = btn.dataset.busyLabel;
    setTimeout(() => {
      sp.remove();
      btn.removeAttribute('aria-busy');
      btn.disabled = false;
      const fail = btn.dataset.busyResult === 'error';
      btn.setAttribute('data-state', fail ? 'error' : 'done');
      if (label) label.textContent = fail ? (btn.dataset.errorLabel || '실패 — 다시 시도') : (btn.dataset.doneLabel || orig);
      if (after) after(!fail);
      setTimeout(() => { btn.removeAttribute('data-state'); if (label && orig !== null && !btn.dataset.keepDone) label.textContent = orig; }, 2200);
    }, ms);
  }
  function dismiss(btn) {
    const sel = btn.getAttribute('data-dismiss');
    const target = sel ? doc.querySelector(sel.startsWith('#') ? sel : `#${sel}`) : btn.closest('.alert, .toast, [data-dismissable]');
    if (!target) return;
    if (target.classList.contains('toast')) { removeToast(target); return; }
    target.style.transition = 'opacity 200ms, transform 200ms';
    target.style.opacity = '0';
    target.style.transform = 'scale(.98)';
    setTimeout(() => target.remove(), reduceMotion.matches ? 0 : 200);
  }
  async function copy(btn) {
    const src = doc.querySelector(btn.dataset.copy);
    if (!src) return;
    const text = src.innerText.trim();
    try { await navigator.clipboard.writeText(text); }
    catch (e) {
      const ta = doc.createElement('textarea');
      ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
      doc.body.appendChild(ta); ta.select();
      try { doc.execCommand('copy'); } catch (err) { /* 복사 미지원 */ }
      ta.remove();
    }
    btn.setAttribute('data-state', 'done');
    const label = $('[data-label]', btn);
    const orig = label ? label.textContent : '';
    if (label) label.textContent = '복사됨';
    setTimeout(() => { btn.removeAttribute('data-state'); if (label) label.textContent = orig; }, 1800);
  }

  /* ── 19. 칸반 — 포인터 드래그(카드가 z3로 떠오름) + 키보드 이동 ─── */
  function initKanban() {
    $$('[data-kanban]').forEach((board) => {
      const live = doc.createElement('div');
      live.className = 'sr-only';
      live.setAttribute('aria-live', 'assertive');
      board.appendChild(live);
      const lists = () => $$('.kanban__list', board);
      const colName = (list) => { const c = list.closest('.kanban__col'); const t = c && $('.kanban__title', c); return t ? t.textContent.trim() : ''; };
      const refresh = () => {
        lists().forEach((l) => {
          const col = l.closest('.kanban__col');
          const n = $('.kanban__count', col);
          if (n) n.textContent = String($$('.kcard', l).length + (+(col && col.dataset.more) || 0)); /* data-more: 축약 보드에서 접힌 카드 수 */
          const done = col && col.hasAttribute('data-done');
          $$('.kcard', l).forEach((k) => k.classList.toggle('kcard--done', !!done));
        });
      };
      const afterEl = (list, y, self) => {
        const cards = $$('.kcard', list).filter((c) => c !== self);
        return cards.find((c) => { const r = c.getBoundingClientRect(); return y < r.top + r.height / 2; }) || null;
      };
      $$('.kcard', board).forEach((card) => {
        card.setAttribute('draggable', 'false');
        if (!card.hasAttribute('tabindex')) card.tabIndex = 0;
        if (!card.getAttribute('aria-roledescription')) card.setAttribute('aria-roledescription', '옮길 수 있는 할 일 카드');
        let sx = 0, sy = 0, pid = null, dragging = false, holdTimer = 0, ghost = null, ox = 0, oy = 0, over = null;
        const startDrag = (x, y) => {
          dragging = true;
          const r = card.getBoundingClientRect();
          ox = x - r.left; oy = y - r.top;
          ghost = card.cloneNode(true);
          ghost.classList.add('is-dragging');
          ghost.removeAttribute('id');
          Object.assign(ghost.style, { position: 'fixed', left: `${r.left}px`, top: `${r.top}px`, width: `${r.width}px`, margin: '0', pointerEvents: 'none', zIndex: '70' });
          doc.body.appendChild(ghost);
          card.classList.add('is-ghost');
        };
        const move = (x, y) => {
          ghost.style.left = `${x - ox}px`;
          ghost.style.top = `${y - oy}px`;
          const under = doc.elementFromPoint(x, y);
          const list = under && (under.closest('.kanban__list') || (under.closest('.kanban__col') && $('.kanban__list', under.closest('.kanban__col'))));
          if (over && over !== list) over.classList.remove('is-over');
          over = list && board.contains(list) ? list : null;
          if (over) {
            over.classList.add('is-over');
            const ref = afterEl(over, y, card);
            if (ref !== card && card.nextElementSibling !== ref) over.insertBefore(card, ref);
          }
        };
        const end = () => {
          clearTimeout(holdTimer);
          if (!dragging) return;
          dragging = false;
          if (ghost) ghost.remove();
          ghost = null;
          card.classList.remove('is-ghost');
          if (over) over.classList.remove('is-over');
          refresh();
          live.textContent = `${($('.kcard__title', card) || card).textContent.trim()} — ${colName(card.parentElement)} 열로 옮겼어요.`;
          card._justDragged = true;
          setTimeout(() => { card._justDragged = false; }, 50);
        };
        card.addEventListener('pointerdown', (e) => {
          if (e.button !== 0 || e.target.closest('button, a, input')) return;
          sx = e.clientX; sy = e.clientY; pid = e.pointerId;
          if (e.pointerType !== 'mouse') holdTimer = setTimeout(() => { startDrag(sx, sy); card.setPointerCapture(pid); if (navigator.vibrate) navigator.vibrate(8); }, 280);
        });
        card.addEventListener('pointermove', (e) => {
          if (e.pointerId !== pid) return;
          if (!dragging) {
            if (e.pointerType === 'mouse' && e.buttons === 1 && Math.hypot(e.clientX - sx, e.clientY - sy) > 5) { startDrag(sx, sy); card.setPointerCapture(pid); }
            else if (e.pointerType !== 'mouse' && Math.hypot(e.clientX - sx, e.clientY - sy) > 8) clearTimeout(holdTimer);
            if (!dragging) return;
          }
          move(e.clientX, e.clientY);
        });
        card.addEventListener('touchmove', (e) => { if (dragging) e.preventDefault(); }, { passive: false });
        ['pointerup', 'pointercancel'].forEach((t) => card.addEventListener(t, () => { pid = null; end(); }));
        // 키보드: Space/Enter 집기 → ←→ 열 이동, ↑↓ 순서 → Space/Enter 놓기, Esc 취소
        let home = null;
        card.addEventListener('keydown', (e) => {
          const picked = card.classList.contains('is-picked');
          if ((e.key === ' ' || e.key === 'Enter') && e.target === card) {
            e.preventDefault();
            if (!picked) { home = { list: card.parentElement, next: card.nextElementSibling }; card.classList.add('is-picked'); live.textContent = '카드를 집었어요. 화살표로 옮기고 스페이스로 놓으세요.'; }
            else { card.classList.remove('is-picked'); refresh(); live.textContent = `${colName(card.parentElement)} 열에 놓았어요.`; }
            return;
          }
          if (!picked) return;
          const ls = lists();
          const li = ls.indexOf(card.parentElement);
          if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
            e.preventDefault();
            const t = ls[clamp(li + (e.key === 'ArrowRight' ? 1 : -1), 0, ls.length - 1)];
            t.appendChild(card); card.focus(); live.textContent = `${colName(t)} 열`;
          } else if (e.key === 'ArrowUp' && card.previousElementSibling) { e.preventDefault(); card.parentElement.insertBefore(card, card.previousElementSibling); card.focus(); }
          else if (e.key === 'ArrowDown' && card.nextElementSibling) { e.preventDefault(); card.parentElement.insertBefore(card.nextElementSibling, card); card.focus(); }
          else if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); card.classList.remove('is-picked'); if (home) home.list.insertBefore(card, home.next); card.focus(); refresh(); live.textContent = '옮기기를 취소했어요.'; }
        });
      });
      refresh();
    });
  }

  /* ── 20. 표 정렬 · 페이지 ────────────────────────────────────── */
  const cellVal = (td) => {
    if (!td) return '';
    const v = td.dataset.sort ?? td.textContent.trim();
    const n = parseFloat(String(v).replace(/[^\d.-]/g, ''));
    return /^[\s₩+-]*[\d,.]+\s*[%A-Za-z°㎡㎥]*$/.test(v) && !isNaN(n) ? n : String(v);
  };
  function sortTable(th) {
    const table = th.closest('table');
    const idx = Array.from(th.parentElement.children).indexOf(th);
    const dir = th.getAttribute('aria-sort') === 'ascending' ? 'descending' : 'ascending';
    $$('th[aria-sort]', table).forEach((h) => h.setAttribute('aria-sort', 'none'));
    th.setAttribute('aria-sort', dir);
    const tb = table.tBodies[0];
    const rows = Array.from(tb.rows);
    rows.sort((a, b) => {
      const x = cellVal(a.cells[idx]), y = cellVal(b.cells[idx]);
      const r = typeof x === 'number' && typeof y === 'number' ? x - y : String(x).localeCompare(String(y), 'ko');
      return dir === 'ascending' ? r : -r;
    });
    rows.forEach((r) => tb.appendChild(r));
    if (table._page) table._page(0);
  }
  function initTables() {
    $$('table[data-page-size]').forEach((table) => {
      const size = +((table.dataset.pageSizeMobile && matchMedia('(max-width: 767px)').matches) ? table.dataset.pageSizeMobile : table.dataset.pageSize);
      const pager = doc.querySelector(`[data-pager-for="${table.id}"]`);
      let page = 0;
      const render = (p) => {
        const rows = Array.from(table.tBodies[0].rows);
        const pages = Math.max(1, Math.ceil(rows.length / size));
        page = clamp(p, 0, pages - 1);
        rows.forEach((r, i) => { r.hidden = Math.floor(i / size) !== page; });
        if (pager) {
          const lab = $('.pager__label', pager);
          if (lab) lab.innerHTML = `${page + 1} <span>/ ${pages}</span>`;
          const pv = $('[data-page="prev"]', pager), nx = $('[data-page="next"]', pager);
          if (pv) pv.disabled = page === 0;
          if (nx) nx.disabled = page === pages - 1;
        }
      };
      table._page = render;
      if (pager) pager.addEventListener('click', (e) => { const b = e.target.closest('[data-page]'); if (b) render(page + (b.dataset.page === 'next' ? 1 : -1)); });
      render(0);
    });
  }

  /* ── 21. 마키 ───────────────────────────────────────────────── */
  function initMarquees() {
    $$('.marquee').forEach((m) => {
      const track = $('.marquee__track', m);
      const group = track && $('.marquee__group', track);
      if (!group || track.children.length > 1) return;
      const clone = group.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      $$('a, button', clone).forEach((n) => n.setAttribute('tabindex', '-1'));
      track.appendChild(clone);
      const set = () => m.style.setProperty('--marquee-dur', `${Math.max(20, group.scrollWidth / 40).toFixed(1)}s`);
      set();
      if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(set);
    });
  }

  /* ── 22. 등장 모션 · 시연 ───────────────────────────────────── */
  function initRise() {
    $$('[data-rise-group]').forEach((g) => { $$('[data-rise]', g).forEach((el, i) => { if (!el.style.getPropertyValue('--i')) el.style.setProperty('--i', String(i)); }); });
    const els = $$('[data-rise]');
    if (!els.length) return;
    const show = (el) => { el.classList.remove('is-pending'); el.classList.add('is-in'); };
    const showAll = () => els.forEach(show);
    window.addEventListener('beforeprint', showAll);
    if (!('IntersectionObserver' in window) || reduceMotion.matches) { showAll(); return; }
    /* 숨김은 기본값이 아니다: 초기화 시점에 화면 밖에 있는 요소에만 .is-pending(투명)을 붙인다.
       화면 안의 것은 그대로 보이고, 앵커로 들어온 경우(#hash)도 그 자리에서 바로 보인다 */
    const vh = innerHeight;
    els.forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.top >= vh || r.bottom <= 0) el.classList.add('is-pending'); else el.classList.add('is-in');
    });
    /* 시차는 '한 번에 화면에 들어온 묶음' 안에서만 매긴다 — 큰 그룹의 뒤쪽 항목이 1초 가까이 기다리지 않게 */
    const io = new IntersectionObserver((ents) => {
      ents.filter((en) => en.isIntersecting).map((en) => en.target)
        .sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1))
        .forEach((el, k) => { el.style.setProperty('--rise-i', String(Math.min(k, 8))); show(el); io.unobserve(el); });
    }, { rootMargin: '0px 0px -6% 0px', threshold: .08 });
    els.forEach((el) => { if (el.classList.contains('is-pending')) io.observe(el); });
    /* 폴백: 문서 로드 3초 뒤 남은 pending 은 화면 밖이어도 전부 푼다(전체 캡처·썸네일·느린 관찰자 대비) */
    const release = () => setTimeout(() => { els.forEach((el) => { if (el.classList.contains('is-pending')) { show(el); io.unobserve(el); } }); }, 3000);
    if (doc.readyState === 'complete') release(); else window.addEventListener('load', release, { once: true });
  }
  function replay(sel) {
    const g = doc.querySelector(sel);
    if (!g) return;
    const els = g.matches('[data-rise]') ? [g] : $$('[data-rise]', g);
    els.forEach((el) => { el.classList.remove('is-in'); el.classList.add('is-pending'); });
    void g.offsetWidth;
    requestAnimationFrame(() => requestAnimationFrame(() => els.forEach((el) => { el.classList.remove('is-pending'); el.classList.add('is-in'); })));
  }

  /* ── 22b. 층 도해 리더선: 기운 판의 오른쪽 꼭짓점 → 같은 층 콜아웃 (index [data-leaders]) ── */
  function offsetIn(el, root) {
    let x = 0, y = 0, n = el;
    while (n && n !== root) { x += n.offsetLeft; y += n.offsetTop; n = n.offsetParent; }
    return { x, y };
  }
  function drawLeaders(fig) {
    let svg = $('.ix-leaders', fig);
    if (!svg) { svg = doc.createElementNS('http://www.w3.org/2000/svg', 'svg'); svg.setAttribute('class', 'ix-leaders'); svg.setAttribute('aria-hidden', 'true'); fig.appendChild(svg); }
    if (getComputedStyle(svg).display === 'none') return;
    let out = '';
    $$('[data-leader-from]', fig).forEach((pane) => {
      const note = $(`[data-leader-to="${pane.dataset.leaderFrom}"]`, fig);
      if (!note) return;
      const o = offsetIn(pane, fig), w = pane.offsetWidth, h = pane.offsetHeight;
      const m = new DOMMatrix(getComputedStyle(pane).transform === 'none' ? undefined : getComputedStyle(pane).transform);
      let v = null;
      [[0, 0], [w, 0], [w, h], [0, h]].forEach(([px, py]) => {
        const p = m.transformPoint(new DOMPoint(px - w / 2, py - h / 2));
        const pt = { x: o.x + w / 2 + p.x, y: o.y + h / 2 + p.y };
        if (!v || pt.x > v.x) v = pt;
      });
      const n = offsetIn(note, fig);
      const nx = n.x - 3, ny = n.y + Math.min(note.offsetHeight / 2, 30);
      const ex = Math.max(v.x + 12, nx - 22);
      out += `<path d="M${v.x.toFixed(1)} ${v.y.toFixed(1)} L${ex.toFixed(1)} ${ny.toFixed(1)} L${nx.toFixed(1)} ${ny.toFixed(1)}"/>` +
        `<circle cx="${v.x.toFixed(1)}" cy="${v.y.toFixed(1)}" r="2.5"/><circle class="is-end" cx="${nx.toFixed(1)}" cy="${ny.toFixed(1)}" r="2"/>`;
    });
    svg.innerHTML = out;
  }
  function initLeaders() {
    const figs = $$('[data-leaders]');
    if (!figs.length) return;
    const all = () => figs.forEach(drawLeaders);
    all();
    if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(all);
    let t = 0;
    window.addEventListener('resize', () => { clearTimeout(t); t = setTimeout(all, 120); }, { passive: true });
    if ('ResizeObserver' in window) { const ro = new ResizeObserver(() => { clearTimeout(t); t = setTimeout(all, 60); }); figs.forEach((f) => ro.observe(f)); }
  }

  /* ── 23. 가로 스크롤 힌트 ───────────────────────────────────── */
  function hint(el) {
    const max = el.scrollWidth - el.clientWidth;
    if (max <= 2) { el.removeAttribute('data-overflow'); return; }
    const x = el.scrollLeft;
    el.setAttribute('data-overflow', x <= 2 ? 'end' : x >= max - 2 ? 'start' : 'both');
  }
  function initScrollHints() {
    const els = $$('.scroll-x, [data-scroll-hint]');
    els.forEach((el) => { hint(el); el.addEventListener('scroll', () => hint(el), { passive: true }); });
    window.addEventListener('resize', () => els.forEach(hint));
    if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(() => els.forEach(hint));
  }

  /* ── 24. 방 레일 (1023px 이하 시트) ──────────────────────────── */
  /* 레일은 .app(z-index: --z-app) 스태킹 컨텍스트 안에 있다. 그래서 스크림도 .app 안(레일 바로 앞)에 두고,
     열린 동안 html[data-rail-open-state] 로 .app 을 크롬(상태 바·독) 위로 올린다. 크롬은 inert. */
  let railOpen = null;
  let railTimer = 0;
  const railChrome = () => $$('.statusbar, .dock, .marquee:not(.app .marquee), .footline:not(.app .footline), .app__main');
  function scrim(rail) {
    let s = $('.rail-scrim');
    if (!s) { s = doc.createElement('div'); s.className = 'rail-scrim'; s.setAttribute('aria-hidden', 'true'); s.addEventListener('click', () => closeRail()); }
    if (rail && s.nextElementSibling !== rail) rail.parentElement.insertBefore(s, rail);
    return s;
  }
  function openRail(btn) {
    const rail = $('.rail');
    if (!rail) return;
    clearTimeout(railTimer);
    railOpen = { rail, btn };
    root.setAttribute('data-rail-open-state', '');
    rail.classList.add('is-open');
    rail.setAttribute('role', 'dialog');
    rail.setAttribute('aria-modal', 'true');
    scrim(rail).classList.add('is-open');
    railChrome().forEach((el) => el.setAttribute('inert', ''));
    $$('[data-rail-open]').forEach((b) => b.setAttribute('aria-expanded', 'true'));
    railToCurrent(rail);
    setTimeout(() => { const f = $('[aria-current="page"]', rail) || focusables(rail)[0]; if (f) f.focus({ preventScroll: true }); }, 40);
  }
  function closeRail() {
    if (!railOpen) return;
    const { rail, btn } = railOpen;
    rail.classList.remove('is-open');
    rail.removeAttribute('role');
    rail.removeAttribute('aria-modal');
    scrim().classList.remove('is-open');
    railChrome().forEach((el) => el.removeAttribute('inert'));
    $$('[data-rail-open]').forEach((b) => b.setAttribute('aria-expanded', 'false'));
    railOpen = null;
    /* 닫히는 시트가 상태 바 아래로 꺼지지 않게, 미끄러져 나간 뒤에 .app 을 원래 층으로 */
    clearTimeout(railTimer);
    railTimer = setTimeout(() => root.removeAttribute('data-rail-open-state'), reduceMotion.matches ? 0 : 320);
    if (btn) btn.focus();
  }
  /* 레일 목록: 활성 항목을 목록 안에서만 보이게(페이지는 움직이지 않음) + 세로 스크롤 힌트 */
  function railToCurrent(rail) {
    const nav = $('.rail__nav', rail);
    const cur = nav && $('[aria-current="page"]', nav);
    if (!nav || !cur) return;
    const nr = nav.getBoundingClientRect(), cr = cur.getBoundingClientRect();
    if (!nr.height) return;
    const top = cr.top - nr.top + nav.scrollTop, bot = top + cr.height;
    if (bot > nav.scrollTop + nav.clientHeight) nav.scrollTop = bot - nav.clientHeight + 24;
    else if (top < nav.scrollTop) nav.scrollTop = Math.max(0, top - 24);
  }
  function railHint(nav) {
    const max = nav.scrollHeight - nav.clientHeight;
    if (max <= 2) { nav.removeAttribute('data-overflow-y'); return; }
    const y = nav.scrollTop;
    nav.setAttribute('data-overflow-y', y <= 2 ? 'end' : y >= max - 2 ? 'start' : 'both');
  }
  function initRail() {
    const rail = $('.rail');
    const nav = rail && $('.rail__nav', rail);
    if (!nav) return;
    const upd = () => railHint(nav);
    nav.addEventListener('scroll', upd, { passive: true });
    window.addEventListener('resize', upd);
    railToCurrent(rail); upd();
    if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(() => { railToCurrent(rail); upd(); });
  }

  /* ── 25. 바인딩 · 마법사 · 달력 · 선택 목록 · 닦기 ──────────────── */
  function initBinds() {
    // <div class="seg" data-bind="#plans" data-bind-attr="data-billing"> 라디오 값 → 대상 속성
    $$('[data-bind]').forEach((g) => {
      const apply = () => {
        const c = $('input:checked', g);
        if (!c) return;
        $$(g.dataset.bind).forEach((t) => {
          t.setAttribute(g.dataset.bindAttr || 'data-value', c.value);
          $$('[data-show-when]', t).forEach((el) => { el.hidden = el.dataset.showWhen !== c.value; });
        });
      };
      g.addEventListener('change', apply);
      apply();
    });
  }
  function initWizards() {
    $$('[data-wizard]').forEach((wz) => {
      const steps = $$('.steps__item', wz);
      const panels = $$('[data-wizard-panel]', wz);
      const list = $('.steps', wz);
      let cur = Math.max(0, steps.findIndex((s) => s.dataset.state === 'current'));
      const render = (focus) => {
        steps.forEach((s, i) => {
          s.dataset.state = i < cur ? 'done' : i === cur ? 'current' : 'todo';
          const n = $('.steps__node', s);
          if (n) { if (i < cur) { n.innerHTML = '<span data-icon="check"></span>'; paintIcons(n); } else n.textContent = String(i + 1); }
          if (i === cur) s.setAttribute('aria-current', 'step'); else s.removeAttribute('aria-current');
        });
        if (list) { list.style.setProperty('--n', String(steps.length)); list.style.setProperty('--p', String(steps.length > 1 ? cur / (steps.length - 1) : 0)); }
        panels.forEach((p, i) => { p.hidden = i !== cur; });
        $$('[data-wizard-prev]', wz).forEach((b) => { b.disabled = cur === 0; });
        $$('[data-wizard-next]', wz).forEach((b) => {
          const l = $('[data-label]', b) || b;
          if (!b.dataset.nextLabel) b.dataset.nextLabel = l.textContent;
          l.textContent = cur === steps.length - 1 ? (b.dataset.finishLabel || '완료') : b.dataset.nextLabel;
        });
        if (focus && panels[cur]) { const h = $('h2, h3, [data-wizard-focus]', panels[cur]) || panels[cur]; h.setAttribute('tabindex', '-1'); h.focus(); }
      };
      wz.addEventListener('click', (e) => {
        if (e.target.closest('[data-wizard-next]')) {
          if (cur === steps.length - 1) { toastFrom(e.target.closest('[data-wizard-next]'), { title: wz.dataset.finishTitle || '연결을 마쳤어요', text: wz.dataset.finishText || '', icon: 'check-circle', tone: 'success' }); return; }
          cur++; render(true);
        } else if (e.target.closest('[data-wizard-prev]')) { cur = Math.max(0, cur - 1); render(true); }
      });
      render(false);
    });
  }
  function initCalendars() {
    $$('.cal--full').forEach((cal) => {
      cal.addEventListener('click', (e) => {
        const d = e.target.closest('button.cal__d');
        if (!d) return;
        $$('button.cal__d', cal).forEach((b) => b.setAttribute('aria-pressed', String(b === d)));
        const out = $('[data-cal-out]', cal) || (cal.dataset.calOut && doc.querySelector(cal.dataset.calOut));
        if (out) out.textContent = d.dataset.summary || `${d.textContent.trim()}일 · 일정 없음`;
      });
    });
  }
  function initSelectLists() {
    // <ul class="list" data-select-list> 행 클릭 → aria-selected 단일 선택, data-show="#pane" 이면 해당 판만 표시
    $$('[data-select-list]').forEach((lst) => {
      lst.addEventListener('click', (e) => {
        const row = e.target.closest('.list__row');
        if (!row || !lst.contains(row)) return;
        $$('.list__row', lst).forEach((r) => r.setAttribute('aria-selected', String(r === row)));
        row.classList.remove('is-unread');
        const un = $('.list__unread', row); if (un) un.remove();
        if (row.dataset.show) {
          const pane = doc.querySelector(row.dataset.show);
          if (pane && pane.parentElement) { $$('[data-pane]', pane.parentElement).forEach((p) => { p.hidden = p !== pane; }); }
          if (pane && matchMedia('(max-width: 1023px)').matches) pane.scrollIntoView({ behavior: reduceMotion.matches ? 'auto' : 'smooth', block: 'start' });
        }
      });
    });
  }
  function initWipe() {
    $$('[data-wipe]').forEach((el) => {
      // 정적 상태: 닦인 자국의 중심을 기준 글리프([data-wipe-anchor], 404 의 '0') 정중앙에 둔다
      const anchor = $('[data-wipe-anchor]', el);
      const place = () => {
        if (!anchor || el.classList.contains('is-wiping')) return;
        const r = el.getBoundingClientRect(), a = anchor.getBoundingClientRect();
        el.style.setProperty('--mx', `${Math.round(a.left + a.width / 2 - r.left)}px`);
        el.style.setProperty('--my', `${Math.round(a.top + a.height / 2 - r.top)}px`);
        // 닦인 자국(18° 기운 1.6:1.1 타원)이 '0' 전체 + 양쪽 '4'의 안쪽 1/3 을 덮도록 크기를 글자 크기에서 잰다.
        // 숫자 높이 ≈ 0.72em, 기운 타원의 세로 반폭 = 1.157k, 페더 22px 바깥까지 여유 → k
        const fs = parseFloat(getComputedStyle(anchor).fontSize) || 300;
        const k = Math.round((fs * .72 / 2 + 22 + 8) / 1.157);
        el.style.setProperty('--wk-static', `${k}px`);
      };
      place();
      if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(place);
      window.addEventListener('resize', place, { passive: true });
      if (reduceMotion.matches) return;
      el.addEventListener('pointermove', (e) => {
        if (e.pointerType !== 'mouse') return;
        const r = el.getBoundingClientRect();
        el.style.setProperty('--mx', `${e.clientX - r.left}px`);
        el.style.setProperty('--my', `${e.clientY - r.top}px`);
        el.classList.add('is-wiping');
      });
    });
  }

  /* ── 위임: 클릭 ─────────────────────────────────────────────── */
  doc.addEventListener('click', (e) => {
    const t = e.target;
    // 바깥 클릭 → 떠 있는 판 닫기
    if (floating && !floating.el.contains(t) && !(floating.trigger && floating.trigger.contains(t))) closeFloating();

    const el = t.closest('[data-theme-toggle],[data-open],[data-close],[data-command-open],[data-popover],[data-menu],.menu [role^="menuitem"],.acc__trigger,[role="tab"],[data-toast],[data-dismiss],[data-busy],[data-copy],.table__sort,.tile,[data-pressable],[data-rail-open],[data-rail-close],[data-motion-replay],[data-sweep-play],[data-recede-demo],[data-ease-play],[data-expand],[data-marquee-toggle],.popover__swatch');
    if (!el) return;
    if (el.matches('[data-theme-toggle]')) { toggleTheme(); return; }
    if (el.matches('[data-command-open]')) { e.preventDefault(); openOverlay($('.cmd:not(.is-static)'), el); return; }
    if (el.matches('[data-open]')) { e.preventDefault(); openOverlay(doc.getElementById(el.dataset.open), el); return; }
    if (el.matches('[data-close]')) { const o = el.closest('.overlay'); if (o && !o.classList.contains('is-static')) { closeOverlay(o); } if (!el.matches('[data-toast]')) return; }
    if (el.matches('[data-rail-open]')) { openRail(el); return; }
    if (el.matches('[data-rail-close]')) { closeRail(); return; }
    if (el.matches('[data-popover]')) {
      const p = doc.getElementById(el.dataset.popover);
      if (!p) return;
      if (floating && floating.el === p) closeFloating(); else { el.setAttribute('aria-haspopup', 'dialog'); openFloating(p, el, null, 'popover'); }
      return;
    }
    if (el.matches('[data-menu]')) {
      const m = doc.getElementById(el.dataset.menu);
      if (!m) return;
      if (floating && floating.el === m) closeFloating(); else { el.setAttribute('aria-haspopup', 'menu'); openFloating(m, el, null, 'menu'); }
      return;
    }
    if (el.matches('.menu [role^="menuitem"]')) {
      if (el.disabled || el.getAttribute('aria-disabled') === 'true') return;
      if (el.getAttribute('role') === 'menuitemradio') {
        $$('[role="menuitemradio"]', el.closest('.menu')).forEach((r) => r.setAttribute('aria-checked', String(r === el)));
        const lbl = floating && floating.trigger && $('[data-menu-label]', floating.trigger);
        if (lbl) lbl.textContent = el.textContent.trim();
      }
      if (el.getAttribute('role') === 'menuitemcheckbox') el.setAttribute('aria-checked', String(el.getAttribute('aria-checked') !== 'true'));
      if (!el.closest('.menu.is-static')) closeFloating(true);
      if (el.dataset.open) { openOverlay(doc.getElementById(el.dataset.open)); return; }
      toastFrom(el);
      return;
    }
    if (el.matches('.acc__trigger')) {
      if (el.disabled) return;
      const open = el.getAttribute('aria-expanded') !== 'true';
      const group = el.closest('[data-acc-single]');
      if (group && open) $$('.acc__trigger', group).forEach((o) => { if (o !== el) setAcc(o, false); });
      setAcc(el, open);
      return;
    }
    if (el.matches('[role="tab"]')) { selectTab(el, false); return; }
    if (el.matches('.popover__swatch')) {
      const box = el.parentElement;
      $$('.popover__swatch', box).forEach((s) => s.setAttribute('aria-pressed', String(s === el)));
      const r = el.dataset.range && doc.querySelector(el.dataset.range);
      if (r && el.dataset.value) { r.value = el.dataset.value; syncRange(r); }
      return;
    }
    if (el.matches('.tile, [data-pressable]')) {
      if (el._suppressClick) { el._suppressClick = false; return; }
      if (el.matches('.tile')) toggleTile(el); else el.setAttribute('aria-pressed', String(el.getAttribute('aria-pressed') !== 'true'));
      if (el.matches('[data-toast]')) toastFrom(el);
      return;
    }
    if (el.matches('[data-dismiss]')) { dismiss(el); return; }
    if (el.matches('[data-copy]')) { copy(el); return; }
    if (el.matches('[data-busy]')) { runBusy(el, +el.dataset.busy || 1000, (ok) => { if (ok || el.dataset.busyResult === 'error') toastFrom(el); }); return; }
    if (el.matches('.table__sort')) { sortTable(el.closest('th')); return; }
    if (el.matches('[data-motion-replay]')) { replay(el.dataset.motionReplay); return; }
    if (el.matches('[data-sweep-play]')) {
      $$(el.dataset.sweepPlay).forEach((n, i) => { n.classList.remove('play-sweep'); void n.offsetWidth; setTimeout(() => n.classList.add('play-sweep'), i * 90); setTimeout(() => n.classList.remove('play-sweep'), 1000 + i * 90); });
      return;
    }
    if (el.matches('[data-recede-demo]')) {
      const box = el.dataset.recedeDemo ? doc.querySelector(el.dataset.recedeDemo) : el.closest('.recede-demo');
      if (!box) return;
      const on = !box.classList.contains('is-on');
      box.classList.toggle('is-on', on);
      el.setAttribute('aria-pressed', String(on));
      return;
    }
    if (el.matches('[data-expand]')) {
      const box = doc.querySelector(el.dataset.expand);
      if (box) { const on = box.classList.toggle('is-open'); el.setAttribute('aria-expanded', String(on)); }
      return;
    }
    if (el.matches('[data-ease-play]')) {
      const box = doc.querySelector(el.dataset.easePlay);
      if (!box) return;
      box.classList.remove('is-playing'); void box.offsetWidth; box.classList.add('is-playing');
      return;
    }
    if (el.matches('[data-marquee-toggle]')) {
      const m = el.closest('.marquee');
      const paused = !m.classList.contains('is-paused');
      m.classList.toggle('is-paused', paused);
      el.setAttribute('aria-pressed', String(paused));
      el.setAttribute('aria-label', paused ? '공지 흐름 재생' : '공지 흐름 일시정지');
      const ic = $('[data-icon]', el); if (ic) { ic.setAttribute('data-icon', paused ? 'play' : 'pause'); paintIcons(el); }
      return;
    }
    if (el.matches('[data-toast]')) toastFrom(el);
  });

  /* ── 위임: 입력 ─────────────────────────────────────────────── */
  doc.addEventListener('input', (e) => { if (e.target.matches('input[type="range"]')) syncRange(e.target); });

  /* ── 위임: 키보드 ───────────────────────────────────────────── */
  doc.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
      const c = $('.cmd:not(.is-static)');
      if (c) { e.preventDefault(); if (c.classList.contains('is-open')) closeOverlay(c); else openOverlay(c, doc.activeElement); }
      return;
    }
    if (e.key === 'Escape') {
      if (floating) { e.preventDefault(); closeFloating(true); return; }
      const top = topOverlay();
      if (top) { e.preventDefault(); closeOverlay(top); return; }
      if (railOpen) { e.preventDefault(); closeRail(); return; }
    }
    if (e.key === 'Tab') {
      const top = topOverlay();
      if (top) { trapTab(e, top); return; }
      if (railOpen) trapTab(e, railOpen.rail);
    }
  });
  window.addEventListener('resize', () => { if (floating) closeFloating(); if (railOpen && innerWidth > 1023) closeRail(); });

  /* ── 시작 ───────────────────────────────────────────────────── */
  function init() {
    root.classList.add('js-ready');
    buildScene();
    paintIcons();
    applyTheme(root.getAttribute('data-theme'));
    initParallax();
    initClock();
    $$('.cmd').forEach(initCommand);
    initTabs();
    initAccordions();
    initMenus();
    initCarousels();
    initTooltips();
    initVSliders();
    initSteppers();
    $$('input[type="range"]').forEach(syncRange);
    initForms();
    initKanban();
    initTables();
    initMarquees();
    initRise();
    initScrollHints();
    initBinds();
    initWizards();
    initCalendars();
    initSelectLists();
    initWipe();
    initLeaders();
    initRail();
    // 모바일(<768)에서는 [data-fold-mobile] 접이 패널을 기본 접힘으로 시작
    if (matchMedia('(max-width: 767px)').matches) $$('details[data-fold-mobile]').forEach((d) => d.removeAttribute('open'));
    $$('.overlay:not(.is-static)').forEach((o) => {
      if (!o.getAttribute('role')) o.setAttribute('role', 'dialog');
      o.setAttribute('aria-modal', 'true');
    });
  }
  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', init); else init();
  window.ys = { toast, openOverlay: (id) => openOverlay(doc.getElementById(id)), closeOverlay: (id) => closeOverlay(doc.getElementById(id)), paintIcons, toggleTheme };
})();
