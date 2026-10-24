/* ==========================================================================
   볕바른장 v2 — app.js (바닐라, 외부 라이브러리 없음)
   0 공통 도구          1 낮/밤 테마         2 아이콘 · 농산물 일러스트 · 인주 번짐 필터
   3 레이어(모달 · 드로어 · ⌘K 장터 안내소) + 포커스 트랩 + Esc
   4 장터 안내소 검색   5 탭               6 아코디언          7 토스트
   8 팝오버(생산자 명함) 9 메뉴(쪽지 드롭다운) 10 캐러셀(꾸러미 10가지)
   11 툴팁 Esc          12 버튼 로딩 · 도장 찍힘 · 공고 닫기 · 다시 찍기
   13 24절기 장날 달력  14 출하 장부(정렬 · 선택 · 일괄 처리) 15 작업판(키보드 · 끌어 놓기)
   16 폼(검증 · 스위치 · 수량 · 장바구니 합계 · 매주/격주 가격)
   17 장날 안내 띠      18 상자 칸 진행     19 툭 놓기 진입 · 모션 다시 보기
   20 머리띠 메뉴 펼치기 21 가로 스크롤 힌트  22 복사  23 목록→읽기 화면 전환
   24 장부 쪽수 · 단계 시연
   마크업 계약은 COMPONENTS.md. 전역 API는 window.Byeot.
   ========================================================================== */
(() => {
  'use strict';

  /* ---------------- 0. 공통 도구 ---------------- */
  const doc = document;
  const root = doc.documentElement;
  const STORE_KEY = 'byeot-theme';
  const $ = (sel, ctx = doc) => ctx.querySelector(sel);
  const $$ = (sel, ctx = doc) => Array.from(ctx.querySelectorAll(sel));
  const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const wait = (ms) => (reduced() ? 0 : ms);
  const byId = (ref) => {
    if (!ref) return null;
    if (ref.startsWith('#')) return doc.getElementById(ref.slice(1));
    return doc.getElementById(ref) || $(ref);
  };
  let uid = 0;
  const ensureId = (el, prefix) => { if (!el.id) el.id = `${prefix}-${++uid}`; return el.id; };
  const won = (n) => `${Number(n).toLocaleString('ko-KR')}원`;
  /* 창(페이지)은 움직이지 않고 안쪽 스크롤 상자만 맞춘다 */
  const nudge = (el, box) => {
    if (!el || !box) return;
    const e = el.getBoundingClientRect();
    const b = box.getBoundingClientRect();
    if (e.left < b.left) box.scrollLeft -= b.left - e.left + 8;
    else if (e.right > b.right) box.scrollLeft += e.right - b.right + 8;
    if (e.top < b.top) box.scrollTop -= b.top - e.top;
    else if (e.bottom > b.bottom) box.scrollTop += e.bottom - b.bottom;
  };
  const restart = (el, cls) => { el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); };
  const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
  const focusables = (ctx) => $$(FOCUSABLE, ctx).filter((el) => el.offsetParent !== null || el === doc.activeElement);

  root.classList.add('js');

  const store = {
    get() { try { return localStorage.getItem(STORE_KEY); } catch (e) { return null; } },
    set(v) { try { localStorage.setItem(STORE_KEY, v); } catch (e) { /* 저장 불가 환경 */ } },
  };

  /* 화면 읽기 프로그램용 안내 */
  let live = null;
  const announce = (msg) => {
    if (!live) {
      live = doc.createElement('div');
      live.className = 'sr-only';
      live.setAttribute('aria-live', 'polite');
      live.id = 'byeot-live';
      doc.body.appendChild(live);
    }
    live.textContent = '';
    setTimeout(() => { live.textContent = msg; }, 30);
  };

  /* ---------------- 1. 낮/밤 테마 ----------------
     우선순위: URL ?theme=dark|light → localStorage → 시스템. <head> 인라인 스크립트와 같은 순서 */
  const query = new URLSearchParams(location.search).get('theme');
  const queryTheme = query === 'dark' || query === 'light' ? query : null;
  const mql = window.matchMedia('(prefers-color-scheme: dark)');
  const valid = (t) => (t === 'dark' || t === 'light' ? t : null);

  const applyTheme = (t) => {
    root.setAttribute('data-theme', t);
    $$('[data-theme-toggle]').forEach((b) => {
      b.setAttribute('aria-label', t === 'dark' ? '낮 장면으로 바꾸기' : '밤 장면으로 바꾸기');
      b.setAttribute('title', t === 'dark' ? '낮 장면으로' : '밤 장면으로');
    });
  };
  applyTheme(queryTheme || valid(store.get()) || (mql.matches ? 'dark' : 'light'));

  const setTheme = (t) => { store.set(t); applyTheme(t); };
  doc.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-theme-toggle]');
    if (!btn) return;
    setTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
  });
  const onSystem = (e) => { if (!queryTheme && !valid(store.get())) applyTheme(e.matches ? 'dark' : 'light'); };
  if (mql.addEventListener) mql.addEventListener('change', onSystem);

  /* ---------------- 2. 아이콘 · 일러스트 · 인주 번짐 ----------------
     <svg class="icon" data-icon="search" aria-hidden="true"></svg>
     <span class="ill" data-ill="goguma" aria-hidden="true"></span>  (색은 CSS .f-* 클래스) */
  const ICONS = {
    search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5L21 21"/>',
    close: '<path d="M6 6l12 12M18 6L6 18"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h11"/>',
    'chev-left': '<path d="M14.5 5.5L8 12l6.5 6.5"/>',
    'chev-right': '<path d="M9.5 5.5L16 12l-6.5 6.5"/>',
    'chev-down': '<path d="M5.5 9.5L12 16l6.5-6.5"/>',
    'arrow-right': '<path d="M4 12.5h15M13.5 6.5l6 6-6 6"/>',
    'arrow-left': '<path d="M20 12.5H5M10.5 6.5l-6 6 6 6"/>',
    check: '<path d="M4.5 12.5l5 5L19.5 6.5"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    minus: '<path d="M5 12h14"/>',
    sun: '<circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M5.3 18.7l1.8-1.8M16.9 7.1l1.8-1.8"/>',
    moon: '<path d="M19.5 14.8A8 8 0 0 1 9.2 4.5a8 8 0 1 0 10.3 10.3z"/><path d="M15.5 4.5v3M14 6h3"/>',
    cart: '<path d="M3 5h3l2.2 10.5h10.3L21 8H7"/><circle cx="9.5" cy="19.5" r="1.5"/><circle cx="17" cy="19.5" r="1.5"/>',
    basket: '<path d="M3 10h18l-2.2 9.5H5.2z"/><path d="M7.5 10L11 4M16.5 10L13 4"/><path d="M8.5 13.5v3M12 13.5v3M15.5 13.5v3"/>',
    calendar: '<rect x="3.5" y="5" width="17" height="15.5" rx="1"/><path d="M3.5 10h17M8 3v4M16 3v4"/><circle cx="15.5" cy="15" r="1.6"/>',
    box: '<path d="M3.5 8L12 4l8.5 4v9L12 21l-8.5-4z"/><path d="M3.5 8L12 12l8.5-4M12 12v9"/>',
    truck: '<path d="M2.5 6.5h11v10h-11z"/><path d="M13.5 10h4.5l3.5 3.5v3h-8"/><circle cx="7" cy="18" r="1.8"/><circle cx="17.5" cy="18" r="1.8"/>',
    leaf: '<path d="M5 19C5 10 10 5 20 4c0 10-5 15-14 15z"/><path d="M5 19l8-8"/>',
    sprout: '<path d="M12 21v-9"/><path d="M12 12C12 7.5 9 5 4.5 5 4.5 9.5 7.5 12 12 12z"/><path d="M12 14.5c0-3.5 2.5-6 7-6 0 3.8-2.6 6-7 6z"/>',
    note: '<path d="M4 4.5h16v11.5l-4 4H4z"/><path d="M16 20v-4h4"/><path d="M7.5 9h9M7.5 12.5h6"/>',
    mail: '<rect x="3" y="5.5" width="18" height="13" rx="1"/><path d="M3.5 6.5l8.5 7 8.5-7"/>',
    board: '<rect x="3" y="4" width="5" height="16" rx=".5"/><rect x="9.5" y="4" width="5" height="11" rx=".5"/><rect x="16" y="4" width="5" height="13" rx=".5"/>',
    chart: '<path d="M4 4v16h16"/><path d="M8 16v-4M12 16V8M16 16v-6"/>',
    user: '<circle cx="12" cy="8.5" r="3.8"/><path d="M4.5 20.5c1-4 4-6 7.5-6s6.5 2 7.5 6"/>',
    users: '<circle cx="9" cy="9" r="3.3"/><path d="M3 19.5c.8-3.4 3.2-5 6-5s5.2 1.6 6 5"/><path d="M15.5 5.8a3.2 3.2 0 0 1 0 6.3M17.5 14.6c1.8.6 3 2.2 3.5 4.9"/>',
    gear: '<circle cx="12" cy="12" r="3"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1"/>',
    flyer: '<path d="M5 3.5h14v17H5z"/><path d="M8 7.5h8M8 11h8M8 14.5h5"/><circle cx="15.5" cy="16.5" r="1.8"/>',
    tag: '<path d="M3.5 12.5V4h8.5l8.5 8.5-8.5 8.5z"/><circle cx="8" cy="8.5" r="1.6"/>',
    phone: '<path d="M6.5 3.5h3l1.5 4-2 1.3a10.5 10.5 0 0 0 6.2 6.2l1.3-2 4 1.5v3a2 2 0 0 1-2 2A16 16 0 0 1 4.5 5.5a2 2 0 0 1 2-2z"/>',
    pin: '<path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.3"/>',
    clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
    warn: '<path d="M12 3.5L21.5 20h-19z"/><path d="M12 10v4.5M12 17.3v.2"/>',
    info: '<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5.5M12 7.6v.2"/>',
    frost: '<path d="M12 2.5v19M3.8 7.2l16.4 9.6M3.8 16.8l16.4-9.6"/><path d="M9.5 4.5L12 7l2.5-2.5M9.5 19.5L12 17l2.5 2.5"/>',
    trash: '<path d="M4.5 7h15M10 7V4.5h4V7M6.5 7l1 13h9l1-13"/>',
    copy: '<rect x="8" y="8" width="12" height="12" rx="1"/><path d="M16 8V4H4v12h4"/>',
    edit: '<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M13.5 6.5l4 4"/>',
    send: '<path d="M3.5 11.5L20.5 4l-6 16.5-3-6.5z"/><path d="M11.5 14L20.5 4"/>',
    more: '<circle cx="5.5" cy="12" r="1.4"/><circle cx="12" cy="12" r="1.4"/><circle cx="18.5" cy="12" r="1.4"/>',
    scissors: '<circle cx="6" cy="7" r="2.6"/><circle cx="6" cy="17" r="2.6"/><path d="M8.2 8.4L20 17M8.2 15.6L20 7"/>',
    logout: '<path d="M10 4.5H4.5v15H10"/><path d="M14.5 8l4.5 4-4.5 4M19 12H9"/>',
    pause: '<path d="M8.5 5.5v13M15.5 5.5v13"/>',
    play: '<path d="M8 5v14l11-7z"/>',
    replay: '<path d="M4.5 12a7.5 7.5 0 1 0 2.2-5.3"/><path d="M4.5 4.5v4.2h4.2"/>',
    filter: '<path d="M4 6h16M7 12h10M10 18h4"/>',
    stamp: '<path d="M9 3.5h6l-1 7h-4z"/><path d="M5 13.5h14v3H5z"/><path d="M6 20.5h12"/>',
    sort: '<path d="M8 4v16M4.5 16.5L8 20l3.5-3.5M16 20V4M12.5 7.5L16 4l3.5 3.5"/>',
    print: '<path d="M7 9V3.5h10V9"/><rect x="3.5" y="9" width="17" height="8" rx="1"/><path d="M7 14h10v6.5H7z"/>',
    card: '<rect x="3" y="5.5" width="18" height="13" rx="1"/><path d="M3 9.5h18M7 14.5h4"/>',
    bell: '<path d="M6 16.5V11a6 6 0 0 1 12 0v5.5l1.5 2h-15z"/><path d="M10 20.5h4"/>',
    door: '<path d="M6 20.5v-16h12v16"/><path d="M3.5 20.5h17M14.5 12.5v.5"/>',
    grip: '<circle cx="9" cy="6" r="1.2"/><circle cx="15" cy="6" r="1.2"/><circle cx="9" cy="12" r="1.2"/><circle cx="15" cy="12" r="1.2"/><circle cx="9" cy="18" r="1.2"/><circle cx="15" cy="18" r="1.2"/>',
  };

  /* 판화 같은 2색 면 일러스트 (viewBox 120×120, 빈 좌판은 160×120) */
  const ILLS = {
    goguma: '<path class="f-goguma" d="M17 72C19 50 50 34 79 37c22 2 31 18 21 33-12 17-53 23-71 17-9-3-13-8-12-15z"/><path class="f-ochre" d="M38 52c4-3 10-3 12 1-3 3-9 3-12-1zM70 72c5-2 10 0 10 3-4 2-9 1-10-3zM88 50c3-1 6 1 5 3-3 1-5 0-5-3z"/><path class="f-none" d="M100 62c7-1 11-6 15-12M18 74c-5 2-9 1-13-3M48 46c5-3 10-4 16-3M44 80c8 2 18 2 28-1"/>',
    baechu: '<path class="f-cabbage" d="M60 10c26 2 37 30 33 62-2 20-16 38-33 38S29 92 27 72c-4-32 7-60 33-62z"/><path class="f-leaf" d="M60 22c17 3 24 24 22 48-1 17-10 32-22 32S39 87 38 70c-2-24 5-45 22-48z"/><path class="f-gangji" d="M46 110c-4-17-3-35 5-50h18c8 15 9 33 5 50z"/><path class="f-none" d="M60 108V30M60 72L47 57M60 82l13-15M60 56L49 44M60 46l11-11"/>',
    mu: '<path class="f-cabbage" d="M56 48C44 32 40 15 50 8c8 8 10 22 8 40zM65 48c5-18 14-30 25-30-1 14-13 24-23 32zM52 50C38 42 26 32 26 21c12 2 22 14 28 27z"/><path class="f-gangji" d="M45 53c-6 21-2 44 15 60 16-16 21-39 15-60z"/><path class="f-leaf" d="M45 53c2-8 28-8 30 0-2 9-28 9-30 0z"/><path class="f-none" d="M60 113v6M52 70c3 1 5 0 7-1M62 86c3 1 5 0 7-2"/>',
    /* 대봉감: 세로로 긴 도토리 · 하트꼴(높이:너비 ≈ 1.25:1), 아래가 뾰족. 납작한 4엽 꽃받침(올리브) + 짧은 갈색 꼭지대 */
    gam: '<path class="f-persimmon" d="M60 30C82 27 95 43 93 62C91 82 74 102 60 113C46 102 29 82 27 62C25 43 38 27 60 30z"/><path class="f-hi" d="M42 47c-5 13-4 29 3 41 1 2 4 1 3-1-5-12-6-26-2-39 1-2-3-3-4-1z"/><path class="f-none" d="M60 113c-1-6-2-10-1-14"/><path class="f-calyx" d="M60 33C53 27 42 26 32 31c8 5 19 6 28 2zM60 33c7-6 18-7 28-2-8 5-19 6-28 2zM60 33c-4 2-9 4-12 8 6 1 10-2 12-8zM60 33c4 2 9 4 12 8-6 1-10-2-12-8z"/><path class="f-stem" d="M57.5 32l.5-12h4.5l.5 12z"/>',
    pyogo: '<path class="f-gangji" d="M50 64l-4 40c9 6 19 6 28 0l-4-40z"/><path class="f-shiitake" d="M13 64c0-30 24-46 47-46s47 16 47 46c-14 8-80 8-94 0z"/><path class="f-gangji" d="M40 34l7 5-8 3zM70 30l8 4-7 4zM55 46l6 3-6 3zM84 48l6 2-5 4zM28 50l6 2-5 3z"/><path class="f-kraft" d="M18 67c22 9 62 9 84 0-14 12-70 12-84 0z"/><path class="f-none" d="M56 80v18M64 80v18"/>',
    jjokpa: '<path class="f-cabbage" d="M38 70L26 8h7l13 62zM52 70L48 4h7l5 66zM66 70l8-62h7l-7 62z"/><path class="f-leaf" d="M45 70L37 18h6l9 52zM59 70l5-58h6l-4 58z"/><path class="f-gangji" d="M37 70h38l-2 36H40z"/><path class="f-stamp" d="M37 78h38v7H37z"/><path class="f-none" d="M44 106l-3 8M52 106v9M60 106l2 8M68 106l4 7"/>',
    kong: '<path class="f-card" d="M12 68h96l-10 38H22z"/><path class="f-dark" d="M28 66a8 6 0 1 1 16 0zM42 64a8 6 0 1 1 16 0zM56 63a8 6 0 1 1 16 0zM70 64a8 6 0 1 1 16 0zM84 66a8 6 0 1 1 14 0zM35 57a8 6 0 1 1 16 0zM50 55a8 6 0 1 1 16 0zM65 56a8 6 0 1 1 16 0zM44 48a8 6 0 1 1 16 0zM60 48a8 6 0 1 1 14 0z"/><path class="f-none" d="M22 80h76M26 92h68"/><path class="f-dark" d="M14 104a6 4.5 0 1 1 12 0 6 4.5 0 1 1-12 0zM98 108a6 4.5 0 1 1 12 0 6 4.5 0 1 1-12 0z"/>',
    oil: '<path class="f-sun" d="M42 44h36l4 68H38z"/><path class="f-sun" d="M52 24h16v20H52z"/><path class="f-stamp" d="M50 10h20v14H50z"/><path class="f-gangji" d="M44 64h32l1 28H43z"/><path class="f-none" d="M50 72h20M50 80h14"/>',
    hobak: '<path class="f-ochre" d="M14 102A90 90 0 0 1 104 12v90z"/><path class="f-sun" d="M26 102a78 78 0 0 1 78-78v78z"/><path class="f-persimmon" d="M58 102a46 46 0 0 1 46-46v46z"/><path class="f-gangji" d="M70 84a4 6 30 1 1 1 0zM80 72a4 6 60 1 1 1 0zM88 90a4 6 10 1 1 1 0zM66 96a4 6 70 1 1 1 0z"/>',
    egg: '<path class="f-gangji" d="M24 52a10 13 0 1 1 20 0 10 13 0 1 1-20 0zM50 50a10 13 0 1 1 20 0 10 13 0 1 1-20 0zM76 52a10 13 0 1 1 20 0 10 13 0 1 1-20 0z"/><path class="f-card" d="M8 66h104l-8 36H16z"/><path class="f-gangji" d="M14 64a10 13 0 1 1 20 0zM38 63a10 13 0 1 1 20 0zM62 63a10 13 0 1 1 20 0zM86 64a10 13 0 1 1 20 0z"/><path class="f-none" d="M14 80l8 4 8-4 8 4 8-4 8 4 8-4 8 4 8-4 8 4 8-4 8 4"/>',
    ssal: '<path class="f-gangji" d="M28 32c-4 30-6 60 2 80h60c8-20 6-50 2-80z"/><path class="f-gangji" d="M28 32l8-14 12 10 12-14 12 14 12-10 8 14z"/><path class="f-none" d="M29 36h62"/><path class="f-stamp" d="M44 72a16 16 0 1 1 32 0 16 16 0 1 1-32 0z"/><path class="f-white" d="M53 66h14v4H53zM53 74h14v4H53z"/>',
    sagwa: '<path class="f-stamp" d="M60 40c-10-8-38-8-40 20-2 26 18 50 32 50 4 0 6-2 8-2s4 2 8 2c14 0 34-24 32-50-2-28-30-28-40-20z"/><path class="f-leaf" d="M62 36c4-14 16-20 28-18-4 12-14 18-28 18z"/><path class="f-none" d="M60 40c0-8-2-14-6-20M38 58c-2 8-1 16 2 22"/>',
    ssam: '<path class="f-goguma" d="M22 92C10 70 18 40 40 30c6 16 10 40 6 64z"/><path class="f-leaf" d="M50 96c-12-26-4-62 18-74 16 16 18 52 4 74z"/><path class="f-cabbage" d="M74 96c-2-24 8-50 30-56 4 22-6 46-24 58z"/><path class="f-none" d="M32 92l6-50M60 96l6-62M80 96l16-46M40 64l-8-6M64 62l8-8M86 72l8-2"/>',
    basket: '<path class="f-card" d="M10 62h100c-4 26-24 44-50 44S14 88 10 62z"/><path class="f-none" d="M10 62c20 6 80 6 100 0M22 82c24 6 52 6 76 0M30 64l8 38M50 66l2 40M70 66l-2 40M90 64l-8 38"/><path class="f-card" d="M6 58h108v8H6z"/>',
    box: '<path class="f-card" d="M10 44l50-18 50 18v52l-50 18-50-18z"/><path class="f-kraft" d="M60 62l50-18v52l-50 18z"/><path class="f-none" d="M10 44l50 18 50-18M60 62v52"/><path class="f-sun" d="M30 36l50 18v9L30 45z"/><path class="f-none" d="M24 78a12 12 0 1 0 24 6 12 12 0 1 0-24-6z"/>',
    'empty-stall': '<path class="f-card" d="M8 70h144v10H8z"/><path class="f-dark" d="M18 80h7v36h-7zM135 80h7v36h-7z"/><path class="f-none" d="M22 96h116"/><path class="f-kraft" d="M44 48h56c-2 14-12 22-28 22S46 62 44 48z"/><path class="f-card" d="M40 44h64v6H40z"/><path class="f-none" d="M52 52l4 16M72 52v18M92 52l-4 16"/><path class="f-leaf" d="M112 64c4-10 14-14 24-12-2 10-12 16-24 12z"/><path class="f-none" d="M112 64l14-8"/>',
  };

  const paint = (scope = doc) => {
    $$('svg[data-icon]', scope).forEach((svg) => {
      const name = svg.getAttribute('data-icon');
      if (!ICONS[name] || svg.dataset.painted) return;
      svg.setAttribute('viewBox', '0 0 24 24');
      if (!svg.classList.contains('icon')) svg.classList.add('icon');
      if (!svg.hasAttribute('aria-label')) svg.setAttribute('aria-hidden', 'true');
      svg.setAttribute('focusable', 'false');
      svg.innerHTML = ICONS[name];
      svg.dataset.painted = '1';
    });
    $$('[data-ill]', scope).forEach((el) => {
      const name = el.getAttribute('data-ill');
      if (!ILLS[name] || el.dataset.painted) return;
      const vb = name === 'empty-stall' ? '0 0 160 120' : '0 0 120 120';
      if (name === 'empty-stall') el.classList.add('ill--wide');
      if (!el.classList.contains('ill')) el.classList.add('ill');
      if (!el.hasAttribute('role')) el.setAttribute('aria-hidden', 'true');
      el.innerHTML = `<svg viewBox="${vb}" focusable="false" aria-hidden="true">${ILLS[name]}</svg>`;
      el.dataset.painted = '1';
    });
  };

  /* 인주 번짐 필터 1개 (도장 가장자리가 종이에 스민다) */
  if (!doc.getElementById('ink-rough')) {
    const holder = doc.createElement('div');
    holder.setAttribute('aria-hidden', 'true');
    holder.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden';
    holder.innerHTML = '<svg width="0" height="0" focusable="false"><filter id="ink-rough" x="-10%" y="-10%" width="120%" height="120%"><feTurbulence type="fractalNoise" baseFrequency=".8" numOctaves="2" seed="3" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="2.5" xChannelSelector="R" yChannelSelector="G"/></filter></svg>';
    doc.body.prepend(holder);
  }
  root.classList.add('ink-ready');
  paint();

  /* ---------------- 3. 레이어: 모달 · 드로어 · 장터 안내소 ----------------
     <div class="layer modal" id="order" hidden> <div class="layer__scrim" data-close></div> <div class="modal__sheet" role="dialog" aria-modal="true" …>
     열기 [data-open="#order"] · 닫기 [data-close] · Esc · 포커스 트랩 · 닫히면 트리거로 포커스 복귀 */
  const layers = [];
  const topLayer = () => layers[layers.length - 1];

  const openLayer = (el, trigger) => {
    if (!el || !el.hasAttribute('hidden')) return;
    /* 장바구니 쪽지(드로어)에서 '주문서 쓰기'로 모달을 열면 드로어는 접는다 — Esc 한 번에 다 닫히게 */
    const from = trigger && trigger.closest('.layer');
    if (from && from !== el && el.classList.contains('modal') && from.classList.contains('drawer')) {
      const i = layers.findIndex((l) => l.el === from);
      if (i > -1) {
        const prevTrigger = layers[i].trigger;
        layers[i].trigger = null;
        closeLayer(from);
        trigger = prevTrigger && doc.contains(prevTrigger) ? prevTrigger : trigger;
      }
    }
    el.removeAttribute('hidden');
    el.classList.remove('is-closing');
    el.classList.add('is-open');
    root.classList.add('has-layer');
    layers.push({ el, trigger: trigger || doc.activeElement });
    if (trigger) trigger.setAttribute('aria-expanded', 'true');
    paint(el);
    const first = $('[autofocus]', el) || $('input:not([type="hidden"])', el) || focusables(el).find((f) => !f.matches('[data-close].layer__scrim'));
    requestAnimationFrame(() => { if (first) first.focus({ preventScroll: true }); });
    el.dispatchEvent(new CustomEvent('layer:open', { bubbles: true }));
  };

  const closeLayer = (el) => {
    const i = layers.findIndex((l) => l.el === el);
    if (i < 0) return;
    const { trigger } = layers[i];
    layers.splice(i, 1);
    el.classList.add('is-closing');
    setTimeout(() => {
      el.setAttribute('hidden', '');
      el.classList.remove('is-open', 'is-closing');
      if (!layers.length) root.classList.remove('has-layer');
    }, wait(190));
    if (trigger) {
      trigger.setAttribute('aria-expanded', 'false');
      if (doc.contains(trigger)) trigger.focus({ preventScroll: true });
    }
    el.dispatchEvent(new CustomEvent('layer:close', { bubbles: true }));
  };

  doc.addEventListener('click', (e) => {
    const opener = e.target.closest('[data-open]');
    if (opener) {
      const target = byId(opener.getAttribute('data-open'));
      if (target && target.classList.contains('layer')) {
        e.preventDefault();
        openLayer(target, opener);
        return;
      }
    }
    const closer = e.target.closest('[data-close]');
    if (closer) {
      const layer = closer.closest('.layer');
      if (layer) { e.preventDefault(); closeLayer(layer); }
    }
  });

  /* 포커스 트랩 */
  doc.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab' || !layers.length) return;
    const { el } = topLayer();
    const list = focusables(el).filter((f) => !f.classList.contains('layer__scrim'));
    if (!list.length) return;
    const first = list[0];
    const last = list[list.length - 1];
    if (!el.contains(doc.activeElement)) { e.preventDefault(); first.focus(); return; }
    if (e.shiftKey && doc.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && doc.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  /* ⌘K / Ctrl+K: 장터 안내소 */
  doc.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
      const cmd = $('.layer.command');
      if (!cmd) return;
      e.preventDefault();
      if (cmd.hasAttribute('hidden')) openLayer(cmd, $('[data-open="#' + cmd.id + '"]') || doc.activeElement);
      else closeLayer(cmd);
    }
  });

  /* ---------------- 4. 장터 안내소 검색 ----------------
     .command__input[role=combobox] · .command__item[role=option] (data-keywords 로 검색어 보탬) */
  const setupCommand = (cmd) => {
    const input = $('.command__input', cmd);
    const list = $('.command__list', cmd);
    if (!input || !list) return;
    const items = $$('.command__item', cmd);
    const empty = $('.command__empty', cmd);
    items.forEach((it) => ensureId(it, 'cmd-opt'));
    let active = -1;
    const visible = () => items.filter((it) => !it.closest('li').hidden);
    const select = (idx) => {
      const vis = visible();
      items.forEach((it) => it.setAttribute('aria-selected', 'false'));
      if (!vis.length) { active = -1; input.removeAttribute('aria-activedescendant'); return; }
      active = (idx + vis.length) % vis.length;
      const it = vis[active];
      it.setAttribute('aria-selected', 'true');
      input.setAttribute('aria-activedescendant', it.id);
      nudge(it, list);
    };
    const filter = () => {
      const q = input.value.trim().toLowerCase().replace(/\s+/g, '');
      items.forEach((it) => {
        const hay = `${it.textContent} ${it.dataset.keywords || ''}`.toLowerCase().replace(/\s+/g, '');
        it.closest('li').hidden = q !== '' && !hay.includes(q);
      });
      $$('.command__group', cmd).forEach((g) => { g.hidden = !$$('.command__item', g).some((it) => !it.closest('li').hidden); });
      const n = visible().length;
      if (empty) empty.hidden = n > 0;
      input.setAttribute('aria-expanded', n > 0 ? 'true' : 'false');
      select(0);
    };
    input.addEventListener('input', filter);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') { e.preventDefault(); select(active + 1); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); select(active - 1); }
      else if (e.key === 'Enter') {
        const it = visible()[active];
        if (it) { e.preventDefault(); it.click(); }
      }
    });
    items.forEach((it) => {
      it.addEventListener('mousemove', () => { const i = visible().indexOf(it); if (i !== active) select(i); });
    });
    cmd.addEventListener('layer:open', () => { input.value = ''; filter(); });
    if (cmd.classList.contains('command--static')) select(Math.max(0, items.findIndex((it) => it.getAttribute('aria-selected') === 'true')));
    else filter();
  };
  $$('.command').forEach(setupCommand);

  /* ---------------- 5. 탭 (서류철 인덱스) ---------------- */
  const selectTab = (tab, focus) => {
    const list = tab.closest('[role="tablist"]');
    $$('[role="tab"]', list).forEach((t) => {
      const on = t === tab;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
      const panel = byId(t.getAttribute('aria-controls'));
      if (panel) {
        panel.hidden = !on;
        if (on) restart(panel, 'is-in');
      }
    });
    if (focus) { tab.focus({ preventScroll: true }); nudge(tab, list); }
  };
  $$('[role="tablist"]').forEach((list) => {
    const tabs = $$('[role="tab"]', list);
    tabs.forEach((t) => {
      t.tabIndex = t.getAttribute('aria-selected') === 'true' ? 0 : -1;
      t.addEventListener('click', () => selectTab(t, false));
      t.addEventListener('keydown', (e) => {
        const enabled = tabs.filter((x) => !x.disabled);
        const i = enabled.indexOf(t);
        let next = null;
        const vertical = list.getAttribute('aria-orientation') === 'vertical';
        const fwd = vertical ? 'ArrowDown' : 'ArrowRight';
        const back = vertical ? 'ArrowUp' : 'ArrowLeft';
        if (e.key === fwd) next = enabled[(i + 1) % enabled.length];
        else if (e.key === back) next = enabled[(i - 1 + enabled.length) % enabled.length];
        else if (e.key === 'Home') next = enabled[0];
        else if (e.key === 'End') next = enabled[enabled.length - 1];
        if (next) { e.preventDefault(); selectTab(next, true); }
      });
    });
  });

  /* ---------------- 6. 아코디언 (쪽지 접기) ---------------- */
  doc.addEventListener('click', (e) => {
    const btn = e.target.closest('.acc__btn');
    if (!btn || btn.disabled) return;
    const open = btn.getAttribute('aria-expanded') !== 'true';
    const acc = btn.closest('.acc');
    if (open && acc && acc.hasAttribute('data-single')) {
      $$('.acc__btn[aria-expanded="true"]', acc).forEach((b) => {
        b.setAttribute('aria-expanded', 'false');
        const p = byId(b.getAttribute('aria-controls'));
        if (p) p.hidden = true;
      });
    }
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    const panel = byId(btn.getAttribute('aria-controls'));
    if (panel) { panel.hidden = !open; if (open) restart(panel, 'is-in'); }
  });

  /* ---------------- 7. 토스트 ----------------
     Byeot.toast({ title, body, seal: '발송', tone: 'ok'|'warn'|'' })  ·  [data-toast="제목"][data-toast-body][data-toast-seal][data-toast-tone] */
  const toastRegion = () => {
    let r = $('.toasts');
    if (!r) {
      r = doc.createElement('div');
      r.className = 'toasts';
      r.setAttribute('aria-live', 'polite');
      r.setAttribute('aria-relevant', 'additions');
      doc.body.appendChild(r);
    }
    return r;
  };
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const toast = ({ title = '', body = '', seal = '완료', tone = '' } = {}) => {
    const region = toastRegion();
    const t = doc.createElement('div');
    t.className = `toast${tone ? ` toast--${tone}` : ''}`;
    t.setAttribute('role', 'status');
    t.innerHTML = `<span class="dojang dojang--s" aria-hidden="true">${esc(seal)}</span><div><strong class="toast__title">${esc(title)}</strong>${body ? `<span class="toast__body">${esc(body)}</span>` : ''}</div><button class="toast__x" type="button" aria-label="알림 닫기"><svg class="icon" data-icon="close"></svg></button>`;
    paint(t);
    region.appendChild(t);
    let timer = null;
    const remove = () => {
      clearTimeout(timer);
      t.classList.add('is-leaving');
      setTimeout(() => t.remove(), wait(220));
    };
    const arm = () => { timer = setTimeout(remove, 4000); };
    t.addEventListener('mouseenter', () => clearTimeout(timer));
    t.addEventListener('mouseleave', arm);
    t.addEventListener('focusin', () => clearTimeout(timer));
    $('.toast__x', t).addEventListener('click', remove);
    arm();
    while (region.children.length > 3) region.firstElementChild.remove();
    return t;
  };
  doc.addEventListener('click', (e) => {
    const b = e.target.closest('[data-toast]');
    if (!b || b.hasAttribute('data-loading')) return;
    toast({ title: b.dataset.toast, body: b.dataset.toastBody || '', seal: b.dataset.toastSeal || '완료', tone: b.dataset.toastTone || '' });
  });
  /* 정적 견본 토스트의 닫기 */
  doc.addEventListener('click', (e) => {
    const x = e.target.closest('.toast--static .toast__x');
    if (x) x.closest('.toast').remove();
  });

  /* ---------------- 8. 팝오버 (생산자 명함) ---------------- */
  const closePopovers = (except) => {
    $$('[data-popover][aria-expanded="true"]').forEach((t) => {
      const p = byId(t.getAttribute('data-popover'));
      if (p === except) return;
      t.setAttribute('aria-expanded', 'false');
      if (p) p.hidden = true;
    });
  };
  doc.addEventListener('click', (e) => {
    const trig = e.target.closest('[data-popover]');
    if (trig) {
      const pop = byId(trig.getAttribute('data-popover'));
      if (!pop) return;
      e.preventDefault();
      const open = pop.hidden;
      closePopovers(pop);
      pop.hidden = !open;
      trig.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (open) paint(pop);
      return;
    }
    if (!e.target.closest('.popover')) closePopovers();
  });
  $$('[data-popover]').forEach((t) => {
    const p = byId(t.getAttribute('data-popover'));
    if (p) { t.setAttribute('aria-controls', ensureId(p, 'pop')); t.setAttribute('aria-expanded', p.hidden ? 'false' : 'true'); }
  });

  /* ---------------- 9. 메뉴 (쪽지 드롭다운) ---------------- */
  const menuItems = (menu) => $$('[role^="menuitem"]', menu).filter((i) => i.getAttribute('aria-disabled') !== 'true');
  const closeMenu = (trig, focus) => {
    const menu = byId(trig.getAttribute('data-menu'));
    trig.setAttribute('aria-expanded', 'false');
    if (menu) menu.hidden = true;
    if (focus) trig.focus();
  };
  const openMenu = (trig) => {
    const menu = byId(trig.getAttribute('data-menu'));
    if (!menu) return;
    $$('[data-menu][aria-expanded="true"]').forEach((t) => t !== trig && closeMenu(t));
    menu.hidden = false;
    trig.setAttribute('aria-expanded', 'true');
    paint(menu);
    const first = menuItems(menu)[0];
    if (first) first.focus();
  };
  $$('[data-menu]').forEach((t) => {
    const m = byId(t.getAttribute('data-menu'));
    t.setAttribute('aria-haspopup', 'menu');
    t.setAttribute('aria-expanded', 'false');
    if (m) { t.setAttribute('aria-controls', ensureId(m, 'menu')); m.hidden = true; }
  });
  doc.addEventListener('click', (e) => {
    const trig = e.target.closest('[data-menu]');
    if (trig) {
      if (trig.getAttribute('aria-expanded') === 'true') closeMenu(trig);
      else openMenu(trig);
      return;
    }
    const item = e.target.closest('.menu [role^="menuitem"]');
    if (item) {
      if (item.getAttribute('role') === 'menuitemcheckbox') item.setAttribute('aria-checked', item.getAttribute('aria-checked') === 'true' ? 'false' : 'true');
      if (item.getAttribute('role') === 'menuitemradio') {
        $$('[role="menuitemradio"]', item.closest('[role="group"]') || item.closest('.menu')).forEach((r) => r.setAttribute('aria-checked', r === item ? 'true' : 'false'));
      }
      const menu = item.closest('.menu');
      const trigger = menu && $(`[data-menu="#${menu.id}"]`);
      if (trigger && !item.hasAttribute('data-keep')) closeMenu(trigger, true);
      return;
    }
    $$('[data-menu][aria-expanded="true"]').forEach((t) => closeMenu(t));
  });
  doc.addEventListener('keydown', (e) => {
    const menu = e.target.closest && e.target.closest('.menu');
    if (!menu) {
      const trig = e.target.closest && e.target.closest('[data-menu]');
      if (trig && (e.key === 'ArrowDown')) { e.preventDefault(); openMenu(trig); }
      return;
    }
    const items = menuItems(menu);
    const i = items.indexOf(doc.activeElement);
    const trigger = $(`[data-menu="#${menu.id}"]`);
    if (e.key === 'ArrowDown') { e.preventDefault(); items[(i + 1) % items.length].focus(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); items[(i - 1 + items.length) % items.length].focus(); }
    else if (e.key === 'Home') { e.preventDefault(); items[0].focus(); }
    else if (e.key === 'End') { e.preventDefault(); items[items.length - 1].focus(); }
    else if (e.key === 'Tab' && trigger) closeMenu(trigger);
  });

  /* ---------------- 10. 캐러셀 (꾸러미 10가지) ---------------- */
  const setupCarousel = (car) => {
    const vp = $('.carousel__viewport', car);
    const slides = $$('.carousel__slide', car);
    if (!vp || !slides.length) return;
    const prev = $('[data-carousel="prev"]', car);
    const next = $('[data-carousel="next"]', car);
    const names = $$('.carousel__name', car);
    const status = $('.carousel__status', car);
    let current = -1;
    slides.forEach((s, i) => {
      s.setAttribute('aria-roledescription', '슬라이드');
      if (!s.hasAttribute('aria-label')) s.setAttribute('aria-label', `${i + 1} / ${slides.length}`);
    });
    const left0 = () => slides[0].offsetLeft;
    const go = (i) => {
      const idx = Math.max(0, Math.min(slides.length - 1, i));
      vp.scrollTo({ left: slides[idx].offsetLeft - left0(), behavior: reduced() ? 'auto' : 'smooth' });
      mark(idx);
    };
    const mark = (idx) => {
      if (idx === current) return;
      current = idx;
      slides.forEach((s, k) => s.classList.toggle('is-current', k === idx));
      names.forEach((n, k) => n.setAttribute('aria-current', k === idx ? 'true' : 'false'));
      if (names[idx]) nudge(names[idx], names[idx].parentElement);
      if (status) status.textContent = `${idx + 1} / ${slides.length}`;
      const maxLeft = vp.scrollWidth - vp.clientWidth - 2;
      if (prev) prev.disabled = idx === 0;
      if (next) next.disabled = idx === slides.length - 1 || (vp.scrollLeft >= maxLeft && idx > 0 && maxLeft > 0);
    };
    let raf = 0;
    vp.addEventListener('scroll', () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const x = vp.scrollLeft + 4;
        let idx = 0;
        slides.forEach((s, k) => { if (s.offsetLeft - left0() <= x) idx = k; });
        if (vp.scrollLeft >= vp.scrollWidth - vp.clientWidth - 2 && current > idx) idx = current;
        mark(idx);
      });
    }, { passive: true });
    if (prev) prev.addEventListener('click', () => go(current - 1));
    if (next) next.addEventListener('click', () => go(current + 1));
    names.forEach((n, k) => n.addEventListener('click', () => go(k)));
    vp.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); go(current + 1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(current - 1); }
    });
    mark(0);
  };
  $$('.carousel').forEach(setupCarousel);

  /* ---------------- 11. 툴팁 Esc ---------------- */
  doc.addEventListener('mouseout', (e) => { const t = e.target.closest && e.target.closest('.tip'); if (t && !t.contains(e.relatedTarget)) t.classList.remove('is-hushed'); });
  doc.addEventListener('focusout', (e) => { const t = e.target.closest && e.target.closest('.tip'); if (t) t.classList.remove('is-hushed'); });

  /* ---------------- Esc: 가장 위의 것부터 하나씩 닫는다 ---------------- */
  doc.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    const openTrig = $('[data-menu][aria-expanded="true"]');
    if (openTrig) { closeMenu(openTrig, true); return; }
    const popTrig = $('[data-popover][aria-expanded="true"]');
    if (popTrig) { closePopovers(); popTrig.focus(); return; }
    const tips = $$('.tip:hover, .tip:focus-within');
    if (tips.length && !tips.every((t) => t.classList.contains('is-hushed'))) { tips.forEach((t) => t.classList.add('is-hushed')); return; }
    if (layers.length) { closeLayer(topLayer().el); return; }
    const nav = $('.nav.is-open');
    if (nav) { toggleNav(nav, false); $('[data-nav-toggle]', nav).focus(); }
  });

  /* ---------------- 12. 버튼 로딩 · 도장 찍힘 · 공고 닫기 · 다시 찍기 ---------------- */
  doc.addEventListener('click', (e) => {
    const loader = e.target.closest('[data-loading]');
    if (loader && loader.getAttribute('aria-busy') !== 'true') {
      const ms = Number(loader.dataset.loading) || 1600;
      loader.setAttribute('aria-busy', 'true');
      setTimeout(() => {
        loader.removeAttribute('aria-busy');
        if (loader.dataset.toast) toast({ title: loader.dataset.toast, body: loader.dataset.toastBody || '', seal: loader.dataset.toastSeal || '완료', tone: loader.dataset.toastTone || '' });
      }, ms);
    }
    const primary = e.target.closest('.btn--primary');
    if (primary && !primary.disabled) {
      restart(primary, 'is-stamped');
      setTimeout(() => primary.classList.remove('is-stamped'), 1400);
    }
    const dis = e.target.closest('[data-dismiss]');
    if (dis) {
      const box = dis.closest('.alert, [data-dismissible]');
      if (box) {
        box.classList.add('is-leaving');
        setTimeout(() => box.remove(), wait(220));
        announce('공고를 닫았습니다');
      }
    }
    const re = e.target.closest('[data-restamp]');
    if (re) {
      const sel = re.getAttribute('data-restamp');
      const targets = sel ? $$(sel) : [re.classList.contains('dojang') ? re : $('.dojang', re)];
      targets.filter(Boolean).forEach((d) => restart(d, 'is-stamping'));
    }
  });

  /* ---------------- 13. 24절기 장날 달력 ----------------
     <div class="cal" data-cal-month="2026-10" [data-cal-today="2026-10-24"] [data-cal-nav="off"]></div> */
  const TERMS = { '2026-09-23': '추분', '2026-10-08': '한로', '2026-10-23': '상강', '2026-11-07': '입동', '2026-11-22': '소설', '2026-12-07': '대설' };
  const MARKETS = { '2026-10-10': '한로 장날', '2026-10-24': '상강 장날', '2026-11-14': '입동 장날', '2026-11-28': '김장 장날', '2026-12-12': '대설 장날' };
  const WD = ['일', '월', '화', '수', '목', '금', '토'];
  const pad = (n) => String(n).padStart(2, '0');
  const iso = (y, m, d) => `${y}-${pad(m)}-${pad(d)}`;
  const isMarket = (y, m, d) => {
    const date = new Date(y, m - 1, d);
    if (date.getDay() !== 6) return false;
    const nth = Math.ceil(d / 7);
    return nth === 2 || nth === 4;
  };
  const renderCal = (cal) => {
    const [y, m] = cal.dataset.calMonth.split('-').map(Number);
    const today = cal.dataset.calToday || '2026-10-24';
    const nav = cal.dataset.calNav !== 'off';
    const first = new Date(y, m - 1, 1).getDay();
    const days = new Date(y, m, 0).getDate();
    const sel = cal.dataset.calSelected || '';
    const titleId = ensureId(cal, 'cal') + '-title';
    let html = `<div class="cal__head"><h3 class="cal__title" id="${titleId}"><span class="cal__month">${m}월</span><span class="cal__year">${y}</span></h3>`;
    if (nav) html += `<div class="cal__nav"><button class="btn btn--icon" type="button" data-cal-step="-1" aria-label="이전 달"><svg class="icon" data-icon="chev-left"></svg></button><button class="btn btn--icon" type="button" data-cal-step="1" aria-label="다음 달"><svg class="icon" data-icon="chev-right"></svg></button></div>`;
    html += `</div><table class="cal__grid" aria-labelledby="${titleId}"><thead><tr>${WD.map((w) => `<th scope="col" abbr="${w}요일">${w}</th>`).join('')}</tr></thead><tbody><tr>`;
    for (let i = 0; i < first; i++) html += '<td></td>';
    for (let d = 1; d <= days; d++) {
      const key = iso(y, m, d);
      const wd = (first + d - 1) % 7;
      const market = isMarket(y, m, d);
      const term = TERMS[key];
      const cls = ['cal__day'];
      if (market) cls.push('is-market');
      if (term) cls.push('is-term');
      if (key === today) cls.push('is-today');
      if (wd === 0) cls.push('is-sun-day');
      const marketName = MARKETS[key] || (market ? '장날' : '');
      const note = term || (market ? '장날' : '');
      const label = `${m}월 ${d}일 ${WD[wd]}요일${term ? ` · 절기 ${term}` : ''}${market ? ` · ${marketName}` : ''}${key === today ? ' · 오늘' : ''}`;
      const tabi = (sel ? key === sel : key === today || (!today.startsWith(`${y}-${pad(m)}`) && d === 1)) ? 0 : -1;
      html += `<td><button class="${cls.join(' ')}" type="button" data-date="${key}" aria-label="${label}" aria-pressed="${key === sel}" tabindex="${tabi}"><span class="cal__num">${d}</span>${note ? `<span class="cal__note" aria-hidden="true">${note}</span>` : ''}</button></td>`;
      if (wd === 6 && d !== days) html += '</tr><tr>';
    }
    const tail = (7 - ((first + days) % 7)) % 7;
    for (let i = 0; i < tail; i++) html += '<td></td>';
    html += '</tr></tbody></table>';
    html += '<p class="cal__legend"><span><i class="cal__key cal__key--market"></i>장날 (둘째·넷째 토)</span><span><i class="cal__key cal__key--term">상강</i>절기</span><span><i class="cal__key cal__key--today"></i>오늘</span></p>';
    html += '<p class="cal__out" aria-live="polite" data-cal-output></p>';
    cal.innerHTML = html;
    paint(cal);
  };
  const describeDay = (key) => {
    const [y, m, d] = key.split('-').map(Number);
    const wd = WD[new Date(y, m - 1, d).getDay()];
    const parts = [`${m}월 ${d}일(${wd})`];
    if (TERMS[key]) parts.push(`절기 ${TERMS[key]}`);
    if (isMarket(y, m, d)) parts.push(`${MARKETS[key] || '장날'} 10:00–15:00 망원 마당`);
    else if (!TERMS[key]) parts.push('장 없는 날');
    return parts.join(' · ');
  };
  $$('.cal[data-cal-month]').forEach((cal) => {
    renderCal(cal);
    cal.addEventListener('click', (e) => {
      const step = e.target.closest('[data-cal-step]');
      if (step) {
        const [y, m] = cal.dataset.calMonth.split('-').map(Number);
        const dt = new Date(y, m - 1 + Number(step.dataset.calStep), 1);
        cal.dataset.calMonth = `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}`;
        renderCal(cal);
        const again = $(`[data-cal-step="${step.dataset.calStep}"]`, cal);
        if (again) again.focus();
        return;
      }
      const day = e.target.closest('.cal__day');
      if (!day) return;
      cal.dataset.calSelected = day.dataset.date;
      $$('.cal__day', cal).forEach((b) => { b.setAttribute('aria-pressed', b === day ? 'true' : 'false'); b.tabIndex = b === day ? 0 : -1; });
      const out = $('[data-cal-output]', cal);
      if (out) out.textContent = describeDay(day.dataset.date);
    });
    cal.addEventListener('keydown', (e) => {
      const day = e.target.closest('.cal__day');
      if (!day) return;
      const all = $$('.cal__day', cal);
      const i = all.indexOf(day);
      const moves = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: 7, ArrowUp: -7 };
      let j = null;
      if (e.key in moves) j = i + moves[e.key];
      else if (e.key === 'Home') j = 0;
      else if (e.key === 'End') j = all.length - 1;
      if (j === null || j < 0 || j >= all.length) return;
      e.preventDefault();
      all.forEach((b, k) => { b.tabIndex = k === j ? 0 : -1; });
      all[j].focus();
    });
  });

  /* ---------------- 14. 출하 장부: 정렬 · 선택 · 일괄 처리 ---------------- */
  const cellValue = (td, type) => {
    const raw = td.dataset.value != null ? td.dataset.value : td.textContent.trim();
    if (type === 'num') { const n = parseFloat(String(raw).replace(/[^\d.-]/g, '')); return Number.isNaN(n) ? -Infinity : n; }
    return raw;
  };
  doc.addEventListener('click', (e) => {
    const btn = e.target.closest('.tbl__sort');
    if (!btn) return;
    const th = btn.closest('th');
    const table = btn.closest('table');
    const tbody = table.tBodies[0];
    const col = Array.from(th.parentElement.children).indexOf(th);
    const type = th.dataset.sort || 'text';
    const dir = th.getAttribute('aria-sort') === 'ascending' ? 'descending' : 'ascending';
    $$('th[aria-sort]', table).forEach((h) => h.setAttribute('aria-sort', 'none'));
    th.setAttribute('aria-sort', dir);
    const rows = Array.from(tbody.rows);
    rows.sort((a, b) => {
      const va = cellValue(a.cells[col], type);
      const vb = cellValue(b.cells[col], type);
      const r = type === 'num' ? va - vb : String(va).localeCompare(String(vb), 'ko');
      return dir === 'ascending' ? r : -r;
    });
    rows.forEach((r) => tbody.appendChild(r));
    announce(`${btn.textContent.trim()} ${dir === 'ascending' ? '오름차순' : '내림차순'}으로 정렬했습니다`);
  });
  const syncSelection = (scope) => {
    const rows = $$('[data-select-row]', scope);
    const on = rows.filter((c) => c.checked);
    rows.forEach((c) => {
      const tr = c.closest('tr');
      if (tr) tr.setAttribute('aria-selected', c.checked ? 'true' : 'false');
      const card = c.closest('.kcard');                 /* 작업판 카드도 같은 선택 표시 */
      if (card) card.classList.toggle('is-selected', c.checked);
    });
    const all = $('[data-select-all]', scope);
    if (all) { all.checked = on.length === rows.length && rows.length > 0; all.indeterminate = on.length > 0 && on.length < rows.length; }
    const bar = $('.bulkbar', scope);
    if (bar) bar.hidden = on.length === 0;
    $$('[data-bulk-count]', scope).forEach((n) => { n.textContent = on.length; });
  };
  doc.addEventListener('change', (e) => {
    const scope = e.target.closest('[data-select-scope]');
    if (!scope) return;
    if (e.target.matches('[data-select-all]')) $$('[data-select-row]', scope).forEach((c) => { c.checked = e.target.checked; });
    if (e.target.matches('[data-select-all], [data-select-row]')) syncSelection(scope);
  });
  doc.addEventListener('click', (e) => {
    const clear = e.target.closest('[data-bulk-clear]');
    if (!clear) return;
    const scope = clear.closest('[data-select-scope]');
    $$('[data-select-row], [data-select-all]', scope).forEach((c) => { c.checked = false; });
    syncSelection(scope);
  });
  $$('[data-select-scope]').forEach(syncSelection);

  /* ---------------- 15. 작업판: ←/→ 로 옆 열, ↑/↓ 로 같은 열 이동 · 끌어 놓기 ---------------- */
  const updateBoard = (board) => {
    $$('.board__col', board).forEach((col) => {
      const n = $$('.kcard', col).length;
      $$('[data-count]', col).forEach((c) => { c.textContent = n; });
      const done = col.hasAttribute('data-done');
      $$('.kcard', col).forEach((k) => k.classList.toggle('is-done', done));
      /* 열 머리 상자 칸도 카드 수에 맞춰 다시 그린다 */
      $$('.board__head .boxes[data-value]', col).forEach((b) => {
        b.dataset.value = String(n);
        const label = $('.boxes__label', b);
        if (label && label.dataset.auto) label.textContent = '';
        const title = $('.board__title', col);
        b.setAttribute('aria-label', `${title ? title.textContent.trim() + ' ' : ''}${n} / ${b.dataset.max || 10}${b.dataset.unit || ''}`);
        renderBoxes(b);
      });
    });
  };
  const moveCard = (card, toList, focus = true) => {
    toList.appendChild(card);
    restart(card, 'is-moved');
    const board = card.closest('.board');
    updateBoard(board);
    if (focus) card.focus();
    const col = toList.closest('.board__col');
    const title = col && $('.board__title', col);
    announce(`${($('.kcard__title', card) || card).textContent.trim()} → ${title ? title.textContent.trim() : ''}`);
  };
  $$('.board').forEach((board) => {
    $$('.kcard', board).forEach((c) => { if (!c.hasAttribute('tabindex')) c.tabIndex = 0; c.setAttribute('draggable', 'true'); });
    board.addEventListener('keydown', (e) => {
      const card = e.target.closest('.kcard');
      if (!card || e.target !== card) return;
      const cols = $$('.board__list', board);
      const list = card.closest('.board__list');
      const ci = cols.indexOf(list);
      if (e.key === 'ArrowRight' && ci < cols.length - 1) { e.preventDefault(); moveCard(card, cols[ci + 1]); }
      else if (e.key === 'ArrowLeft' && ci > 0) { e.preventDefault(); moveCard(card, cols[ci - 1]); }
      else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        const cards = $$('.kcard', list);
        const k = cards.indexOf(card) + (e.key === 'ArrowDown' ? 1 : -1);
        if (cards[k]) { e.preventDefault(); cards[k].focus(); }
      }
    });
    let dragging = null;
    board.addEventListener('dragstart', (e) => {
      const card = e.target.closest('.kcard');
      if (!card) return;
      dragging = card;
      card.classList.add('is-dragging');
      e.dataTransfer.effectAllowed = 'move';
      try { e.dataTransfer.setData('text/plain', card.id || 'kcard'); } catch (err) { /* 일부 브라우저 */ }
    });
    board.addEventListener('dragend', () => {
      if (dragging) dragging.classList.remove('is-dragging');
      dragging = null;
      $$('.board__list.is-over', board).forEach((l) => l.classList.remove('is-over'));
    });
    board.addEventListener('dragover', (e) => {
      const list = e.target.closest('.board__list');
      if (!list || !dragging) return;
      e.preventDefault();
      $$('.board__list.is-over', board).forEach((l) => l !== list && l.classList.remove('is-over'));
      list.classList.add('is-over');
    });
    board.addEventListener('dragleave', (e) => {
      const list = e.target.closest('.board__list');
      if (list && !list.contains(e.relatedTarget)) list.classList.remove('is-over');
    });
    board.addEventListener('drop', (e) => {
      const list = e.target.closest('.board__list');
      if (!list || !dragging) return;
      e.preventDefault();
      list.classList.remove('is-over');
      moveCard(dragging, list, false);
    });
    updateBoard(board);
  });

  /* ---------------- 16. 폼 ---------------- */
  const fieldError = (input) => {
    const field = input.closest('.field');
    return field ? $('.field__error', field) : null;
  };
  const markField = (input, bad) => {
    input.setAttribute('aria-invalid', bad ? 'true' : 'false');
    const err = fieldError(input);
    if (err) {
      err.hidden = !bad;
      const id = ensureId(err, 'err');
      const ids = (input.getAttribute('aria-describedby') || '').split(' ').filter(Boolean);
      if (bad && !ids.includes(id)) ids.push(id);
      input.setAttribute('aria-describedby', ids.join(' '));
    }
  };
  doc.addEventListener('submit', (e) => {
    const form = e.target.closest('form[data-validate]');
    if (!form) return;
    e.preventDefault();
    const inputs = $$('input, select, textarea', form).filter((i) => i.willValidate);
    let firstBad = null;
    inputs.forEach((i) => {
      const bad = !i.checkValidity();
      markField(i, bad);
      if (bad && !firstBad) firstBad = i;
    });
    if (firstBad) { firstBad.focus(); announce('확인할 칸이 있습니다'); return; }
    const submit = $('[type="submit"]', form);
    if (submit) submit.setAttribute('aria-busy', 'true');
    setTimeout(() => {
      if (submit) submit.removeAttribute('aria-busy');
      toast({ title: form.dataset.success || '신청 엽서를 보냈습니다', body: form.dataset.successBody || '', seal: form.dataset.successSeal || '접수', tone: 'ok' });
    }, wait(900));
  });
  doc.addEventListener('input', (e) => {
    const i = e.target;
    if (i.getAttribute && i.getAttribute('aria-invalid') === 'true' && i.checkValidity()) markField(i, false);
  });

  /* 스위치 */
  doc.addEventListener('click', (e) => {
    const sw = e.target.closest('.switch[role="switch"]');
    if (!sw || sw.disabled) return;
    const on = sw.getAttribute('aria-checked') !== 'true';
    sw.setAttribute('aria-checked', on ? 'true' : 'false');
    const st = $('.switch__state', sw);
    if (st) st.textContent = on ? (sw.dataset.on || '켜짐') : (sw.dataset.off || '꺼짐');
  });

  /* 수량 · 장바구니 합계 */
  const recalcCart = (cart) => {
    let sum = 0;
    let count = 0;
    $$('[data-price]', cart).forEach((line) => {
      const q = Number(($('.qty input', line) || { value: 1 }).value) || 0;
      const p = Number(line.dataset.price) || 0;
      sum += p * q;
      count += q;
      const out = $('.cart-line__price', line);
      if (out) out.textContent = won(p * q);
    });
    $$('[data-cart-total]', cart).forEach((n) => { n.textContent = Number(sum).toLocaleString('ko-KR'); });
    $$('[data-cart-count]', cart).forEach((n) => { n.textContent = count; });
  };
  doc.addEventListener('click', (e) => {
    const b = e.target.closest('.qty [data-qty-step]');
    if (!b) return;
    const input = $('input', b.closest('.qty'));
    const min = input.min !== '' ? Number(input.min) : 0;
    const max = input.max !== '' ? Number(input.max) : 99;
    input.value = Math.max(min, Math.min(max, (Number(input.value) || 0) + Number(b.dataset.qtyStep)));
    input.dispatchEvent(new Event('input', { bubbles: true }));
  });
  doc.addEventListener('input', (e) => {
    const input = e.target.closest && e.target.closest('.qty input');
    if (!input) return;
    const qty = input.closest('.qty');
    const v = Number(input.value) || 0;
    const min = input.min !== '' ? Number(input.min) : 0;
    const max = input.max !== '' ? Number(input.max) : 99;
    $$('[data-qty-step]', qty).forEach((b) => { b.disabled = Number(b.dataset.qtyStep) < 0 ? v <= min : v >= max; });
    const cart = input.closest('[data-cart]');
    if (cart) recalcCart(cart);
  });
  $$('.qty input').forEach((i) => i.dispatchEvent(new Event('input', { bubbles: true })));

  /* 매주/격주 가격 바꾸기: input[name][data-cycle="weekly|biweekly"] → [data-price-weekly][data-price-biweekly] */
  doc.addEventListener('change', (e) => {
    const r = e.target.closest && e.target.closest('[data-cycle]');
    if (!r || !r.checked) return;
    const key = r.dataset.cycle === 'biweekly' ? 'priceBiweekly' : 'priceWeekly';
    $$('[data-price-weekly]').forEach((el) => {
      el.textContent = Number(el.dataset[key]).toLocaleString('ko-KR');
      if (el.closest('.tag')) restart(el.closest('.tag'), 'is-dropping');
    });
    $$('[data-cycle-label]').forEach((el) => { el.textContent = r.dataset.cycle === 'biweekly' ? '격주' : '매주'; });
  });

  /* ---------------- 17. 장날 안내 띠 ---------------- */
  $$('.marquee').forEach((mq) => {
    const track = $('.marquee__track', mq);
    const group = track && $('.marquee__group', track);
    if (group && !track.dataset.cloned) {
      const clone = group.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      $$('a, button', clone).forEach((n) => n.setAttribute('tabindex', '-1'));
      track.appendChild(clone);
      track.dataset.cloned = '1';
    }
    const tog = $('[data-marquee-toggle]', mq);
    if (tog) {
      tog.addEventListener('click', () => {
        const paused = mq.classList.toggle('is-paused');
        tog.setAttribute('aria-pressed', paused ? 'true' : 'false');
        tog.setAttribute('aria-label', paused ? '안내 띠 다시 흐르게' : '안내 띠 멈추기');
        const ic = $('svg', tog);
        if (ic) { ic.dataset.painted = ''; ic.setAttribute('data-icon', paused ? 'play' : 'pause'); paint(tog); }
      });
    }
  });

  /* ---------------- 18. 상자 칸 진행 ----------------
     <div class="boxes" data-value="7" data-max="10" data-unit="상자"><span class="boxes__cells"></span><span class="boxes__label"></span></div> */
  function renderBoxes(el) {   /* 함수 선언 — 작업판 updateBoard 가 먼저 불러도 된다 */
    const v = Number(el.dataset.value) || 0;
    const max = Number(el.dataset.max) || 10;
    const cells = Math.min(Number(el.dataset.cells) || Math.min(max, 10), 20);
    const filled = Math.round((v / max) * cells);
    let wrap = $('.boxes__cells', el);
    if (!wrap) { wrap = doc.createElement('span'); wrap.className = 'boxes__cells'; el.prepend(wrap); }
    wrap.setAttribute('aria-hidden', 'true');
    wrap.innerHTML = Array.from({ length: cells }, (_, i) => `<i class="${i < filled ? 'is-full' : ''}" style="--i:${i}"></i>`).join('');
    el.setAttribute('role', 'progressbar');
    el.setAttribute('aria-valuemin', '0');
    el.setAttribute('aria-valuemax', String(max));
    el.setAttribute('aria-valuenow', String(v));
    const label = $('.boxes__label', el);
    if (label && !label.textContent.trim()) { label.innerHTML = `<span class="num">${v}</span> / ${max}${el.dataset.unit || ''}`; label.dataset.auto = '1'; }
    if (!el.hasAttribute('aria-label') && !el.hasAttribute('aria-labelledby')) el.setAttribute('aria-label', `${v} / ${max}${el.dataset.unit || ''}`);
  }
  $$('.boxes[data-value]').forEach(renderBoxes);

  /* ---------------- 19. 툭 놓기 진입 · 모션 다시 보기 ---------------- */
  const groups = new Map();
  $$('.drop-in').forEach((el) => {
    const p = el.parentElement;
    if (!groups.has(p)) groups.set(p, []);
    groups.get(p).push(el);
  });
  groups.forEach((list) => {
    const step = list.length > 10 ? 0.5 : 1;
    list.forEach((el, i) => el.style.setProperty('--i', String(i * step)));
  });
  $$('.stagger').forEach((g) => Array.from(g.children).forEach((c, i) => c.style.setProperty('--i', String(i))));
  /* 물건은 처음부터 보인다(스크린샷 · JS 없음 대비). 첫 화면이 그려진 다음에만
     화면에 들어오는 물건에 is-in 을 붙여 '툭 놓기'를 한 번 재생한다. */
  if ('IntersectionObserver' in window && !reduced()) {
    requestAnimationFrame(() => requestAnimationFrame(() => {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
      });
      $$('.drop-in').forEach((el) => io.observe(el));
    }));
  }
  doc.addEventListener('click', (e) => {
    const b = e.target.closest('[data-replay]');
    if (!b) return;
    const target = byId(b.getAttribute('data-replay'));
    if (!target) return;
    const cls = { stamp: 'is-stamping', drop: 'is-dropping', sun: 'sunrise' }[b.dataset.motion] || 'is-stamping';
    restart(target, cls);
  });

  /* ---------------- 20. 머리띠 메뉴 펼치기 ---------------- */
  const toggleNav = (nav, open) => {
    const btn = $('[data-nav-toggle]', nav);
    nav.classList.toggle('is-open', open);
    if (btn) {
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      btn.setAttribute('aria-label', open ? '메뉴 접기' : '메뉴 펼치기');
    }
  };
  doc.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-nav-toggle]');
    const openNav = $('.nav.is-open');
    if (btn) { const nav = btn.closest('.nav'); toggleNav(nav, !nav.classList.contains('is-open')); return; }
    if (openNav && (!e.target.closest('.nav__menu') || e.target.closest('.nav__link'))) toggleNav(openNav, false);
  });

  /* ---------------- 21. 가로 스크롤 힌트 (오른쪽 페이드) ---------------- */
  const hint = (el) => {
    const update = () => el.classList.toggle('is-end', el.scrollLeft + el.clientWidth >= el.scrollWidth - 4);
    el.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  };
  $$('.scroller, .tabs__list, .carousel__names, .chalk__nav').forEach(hint);
  /* 등사지: 넘칠 때만 오른쪽 24px 페이드 (끝까지 밀면 걷힌다) */
  $$('.code__pre').forEach((el) => {
    const update = () => el.classList.toggle('is-clipped', el.scrollWidth > el.clientWidth + 2 && el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
    el.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  });

  /* ---------------- 22. 복사 ---------------- */
  doc.addEventListener('click', async (e) => {
    const b = e.target.closest('[data-copy]');
    if (!b) return;
    const src = byId(b.getAttribute('data-copy'));
    if (!src) return;
    const text = src.innerText;
    try { await navigator.clipboard.writeText(text); } catch (err) {
      const ta = doc.createElement('textarea');
      ta.value = text; ta.setAttribute('readonly', ''); ta.style.cssText = 'position:fixed;opacity:0';
      doc.body.appendChild(ta); ta.select();
      try { doc.execCommand('copy'); } catch (err2) { /* 복사 불가 */ }
      ta.remove();
    }
    const label = $('.code__copy-label', b) || b;
    const before = label.textContent;
    b.classList.add('is-done');
    label.textContent = '복사됨';
    announce('복사했습니다');
    setTimeout(() => { b.classList.remove('is-done'); label.textContent = before; }, 1600);
  });

  /* ---------------- 23. 목록 → 읽기 화면 전환 (모바일 쪽지함) ----------------
     [data-panes] 안의 [data-pane-open] 을 누르면 data-pane="detail", [data-pane-back] 은 "list" */
  doc.addEventListener('click', (e) => {
    const o = e.target.closest('[data-pane-open]');
    if (o) {
      const panes = o.closest('[data-panes]');
      if (panes) {
        panes.setAttribute('data-pane', 'detail');
        const list = o.closest('ul, ol');
        if (list) $$('[data-pane-open]', list).forEach((x) => x.setAttribute('aria-current', x === o ? 'true' : 'false'));
        const target = byId(o.getAttribute('data-pane-open'));
        if (target) { target.tabIndex = -1; if (window.matchMedia('(max-width: 900px)').matches) target.focus(); }
      }
    }
    const back = e.target.closest('[data-pane-back]');
    if (back) {
      const panes = back.closest('[data-panes]');
      if (panes) {
        panes.setAttribute('data-pane', 'list');
        const cur = $('[data-pane-open][aria-current="true"]', panes);
        if (cur) cur.focus();
      }
    }
  });

  /* ---------------- 24. 장부 쪽수 · 단계 시연 ---------------- */
  doc.addEventListener('click', (e) => {
    const b = e.target.closest('.pager[data-demo] .pager__btn');
    if (!b) return;
    e.preventDefault();
    const pager = b.closest('.pager');
    const nums = $$('.pager__btn:not(.pager__btn--step)', pager);
    let cur = nums.findIndex((n) => n.getAttribute('aria-current') === 'page');
    if (b.dataset.step === 'prev') cur = Math.max(0, cur - 1);
    else if (b.dataset.step === 'next') cur = Math.min(nums.length - 1, cur + 1);
    else cur = nums.indexOf(b);
    nums.forEach((n, i) => { if (i === cur) n.setAttribute('aria-current', 'page'); else n.removeAttribute('aria-current'); });
    const prev = $('[data-step="prev"]', pager);
    const next = $('[data-step="next"]', pager);
    if (prev) prev.setAttribute('aria-disabled', cur === 0 ? 'true' : 'false');
    if (next) next.setAttribute('aria-disabled', cur === nums.length - 1 ? 'true' : 'false');
    const info = $('.pager__info', pager);
    if (info && info.dataset.total) info.textContent = `${cur + 1}쪽 / ${info.dataset.total}쪽`;
  });
  doc.addEventListener('click', (e) => {
    const b = e.target.closest('[data-steps-next], [data-steps-prev]');
    if (!b) return;
    const steps = byId(b.getAttribute('data-steps-next') || b.getAttribute('data-steps-prev'));
    if (!steps) return;
    const items = $$('.steps__item', steps);
    let cur = items.findIndex((i) => i.getAttribute('aria-current') === 'step');
    if (cur < 0) cur = items.length;
    const nextIdx = b.hasAttribute('data-steps-next') ? Math.min(items.length, cur + 1) : Math.max(0, cur - 1);
    items.forEach((it, i) => {
      const wasDone = it.classList.contains('is-done');
      it.classList.toggle('is-done', i < nextIdx);
      it.classList.toggle('is-fresh', i < nextIdx && !wasDone);
      if (i === nextIdx) it.setAttribute('aria-current', 'step'); else it.removeAttribute('aria-current');
    });
    const now = items[nextIdx];
    announce(now ? `지금 단계: ${$('.steps__name', now).textContent}` : '모든 단계를 마쳤습니다');
  });

  /* ---------------- 전역 API ---------------- */
  window.Byeot = {
    toast,
    open: (ref) => openLayer(byId(ref)),
    close: (ref) => closeLayer(byId(ref)),
    setTheme,
    paint,
    announce,
    renderCalendar: renderCal,
    renderBoxes,
  };
})();
