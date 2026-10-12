/* ==========================================================================
   모닥 MODAK v2 — app.js (바닐라, 외부 라이브러리 없음)
   0 아이콘 · 사물 일러스트 라이브러리   1 테마(줄 스위치)   2 레이어(모달 · 드로어 · ⌘K · 팝오버 · 메뉴)
   3 탭   4 아코디언   5 토스트   6 버튼 로딩 · 쪽지 닫기 · 툴팁 Esc   7 캐러셀   8 달력
   9 표   10 칸반   11 폼 검증   12 리본 띠   13 코드 복사   14 진행   15 모션 시연 · 리빌 · 살아 있는 사물
   16 방 지도(스크롤 위치)   17 수량 · 색 고르기
   마크업 계약은 COMPONENTS.md. 전역 API는 window.Modak.
   ========================================================================== */
(() => {
  'use strict';

  const doc = document;
  const root = doc.documentElement;
  const STORE_KEY = 'modak-theme';
  const $ = (sel, ctx = doc) => ctx.querySelector(sel);
  const $$ = (sel, ctx = doc) => Array.from(ctx.querySelectorAll(sel));
  const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const byId = (id) => (id ? doc.getElementById(id.replace(/^#/, '')) : null);
  const later = (ms) => new Promise((r) => setTimeout(r, reduced() ? 0 : ms));
  let uid = 0;
  const ensureId = (el, prefix) => { if (!el.id) el.id = `${prefix}-${++uid}`; return el.id; };
  root.classList.add('js');

  const store = {
    get() { try { return localStorage.getItem(STORE_KEY); } catch (e) { return null; } },
    set(v) { try { localStorage.setItem(STORE_KEY, v); } catch (e) { /* 저장 불가 환경 */ } },
    clear() { try { localStorage.removeItem(STORE_KEY); } catch (e) { /* 저장 불가 환경 */ } },
  };

  /* ------------------------------------------------------------------------
     0. 아이콘 · 사물 일러스트 라이브러리
        <svg class="icon" data-icon="search"></svg>  → 24 그리드 선 아이콘
        <span class="obj" data-obj="pendant" aria-hidden="true"></span> → 평면 채색 사물
        색은 CSS(o-* 클래스)가 semantic 토큰으로 칠한다 — presentation attribute에 var() 없음.
     ------------------------------------------------------------------------ */
  const ICONS = {
    search: '<circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.2-4.2"/>',
    close: '<path d="M6 6l12 12M18 6L6 18"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h10"/>',
    'chevron-down': '<path d="M6 9.5l6 6 6-6"/>',
    'chevron-up': '<path d="M6 14.5l6-6 6 6"/>',
    'chevron-left': '<path d="M14.5 6l-6 6 6 6"/>',
    'chevron-right': '<path d="M9.5 6l6 6-6 6"/>',
    'arrow-right': '<path d="M5 12h14M13 6l6 6-6 6"/>',
    'arrow-left': '<path d="M19 12H5M11 6l-6 6 6 6"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    minus: '<path d="M5 12h14"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5.5M12 7.6v.2"/>',
    ok: '<circle cx="12" cy="12" r="9"/><path d="M8 12.3l2.8 2.7 5.4-5.5"/>',
    warn: '<path d="M12 3.8L21 19.5H3z"/><path d="M12 10v4.2M12 17.1v.2"/>',
    danger: '<path d="M8.3 3h7.4L21 8.3v7.4L15.7 21H8.3L3 15.7V8.3z"/><path d="M12 7.5v5.5M12 16.3v.2"/>',
    more: '<circle cx="5.5" cy="12" r="1.3"/><circle cx="12" cy="12" r="1.3"/><circle cx="18.5" cy="12" r="1.3"/>',
    cart: '<path d="M5 8h14l-1.2 11.2a1.5 1.5 0 0 1-1.5 1.3H7.7a1.5 1.5 0 0 1-1.5-1.3z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/>',
    calendar: '<rect x="3.5" y="5" width="17" height="15.5" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
    home: '<path d="M4 11l8-6.5 8 6.5"/><path d="M6 9.5V20h12V9.5"/><path d="M10 20v-5h4v5"/>',
    chat: '<path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v8a2.5 2.5 0 0 1-2.5 2.5H10l-4.5 3.5V17A1.5 1.5 0 0 1 4 15.5z"/>',
    board: '<rect x="3.5" y="4" width="5" height="16" rx="1.2"/><rect x="9.5" y="4" width="5" height="11" rx="1.2"/><rect x="15.5" y="4" width="5" height="13" rx="1.2"/>',
    sliders: '<path d="M4 7h9M17 7h3M4 17h3M11 17h9"/><circle cx="15" cy="7" r="2"/><circle cx="9" cy="17" r="2"/>',
    user: '<circle cx="12" cy="8.5" r="3.5"/><path d="M5 20c.8-3.6 3.6-5.5 7-5.5s6.2 1.9 7 5.5"/>',
    trash: '<path d="M4.5 7h15M10 7V4.5h4V7M6.5 7l.9 12.2a1.5 1.5 0 0 0 1.5 1.3h6.2a1.5 1.5 0 0 0 1.5-1.3L17.5 7"/>',
    copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5.5A1.5 1.5 0 0 0 14.5 4h-9A1.5 1.5 0 0 0 4 5.5v9A1.5 1.5 0 0 0 5.5 16H8"/>',
    undo: '<path d="M9 7l-4.5 4.5L9 16"/><path d="M5 11.5h9.5a4.5 4.5 0 0 1 0 9H12"/>',
    edit: '<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M13.5 6.5l4 4"/>',
    play: '<path d="M8 5.5v13l10.5-6.5z"/>',
    pause: '<path d="M8.5 5.5v13M15.5 5.5v13"/>',
    replay: '<path d="M4.5 12a7.5 7.5 0 1 0 2.2-5.3"/><path d="M4.5 4.5v4.2h4.2"/>',
    lamp: '<path d="M12 3v4"/><path d="M6 13a6 6 0 0 1 12 0z"/><path d="M10 16.5h4"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6L7 7M17 17l1.4 1.4M5.6 18.4L7 17M17 7l1.4-1.4"/>',
    moon: '<path d="M19.5 14.5A7.5 7.5 0 0 1 9.5 4.5a7.5 7.5 0 1 0 10 10z"/>',
    truck: '<path d="M3 6.5h11v10H3z"/><path d="M14 10h4l3 3.5v3h-7"/><circle cx="7" cy="18" r="1.8"/><circle cx="17.5" cy="18" r="1.8"/>',
    pin: '<path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.3"/>',
    clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
    phone: '<path d="M6.5 3.5h3l1.5 4-2 1.5a10 10 0 0 0 6 6l1.5-2 4 1.5v3a2 2 0 0 1-2 2A16 16 0 0 1 4.5 5.5a2 2 0 0 1 2-2z"/>',
    heart: '<path d="M12 19.5s-7.5-4.4-7.5-10A4 4 0 0 1 12 7a4 4 0 0 1 7.5 2.5c0 5.6-7.5 10-7.5 10z"/>',
    star: '<path d="M12 4l2.4 5 5.4.7-4 3.7 1 5.4L12 16.2l-4.8 2.6 1-5.4-4-3.7 5.4-.7z"/>',
    filter: '<path d="M4 6h16M7 12h10M10 18h4"/>',
    send: '<path d="M4 12l16-7.5-6 16-2.5-6.5z"/><path d="M11.5 14L20 4.5"/>',
    door: '<path d="M6 20.5V4.5a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v16"/><path d="M4 20.5h16"/><path d="M14.5 12.5v.2"/>',
    bell: '<path d="M6 16.5V11a6 6 0 0 1 12 0v5.5l1.5 2h-15z"/><path d="M10 20.5h4"/>',
    card: '<rect x="3" y="5.5" width="18" height="13" rx="2"/><path d="M3 10h18M7 15h4"/>',
    screen: '<rect x="3" y="4.5" width="18" height="12" rx="2"/><path d="M9 20h6M12 16.5V20"/>',
    chart: '<path d="M4 20h16"/><path d="M7 16v-5M12 16V7M17 16v-8"/>',
    box: '<path d="M4 8l8-4 8 4v8l-8 4-8-4z"/><path d="M4 8l8 4 8-4M12 12v8"/>',
    grip: '<circle cx="9" cy="6.5" r=".9"/><circle cx="15" cy="6.5" r=".9"/><circle cx="9" cy="12" r=".9"/><circle cx="15" cy="12" r=".9"/><circle cx="9" cy="17.5" r=".9"/><circle cx="15" cy="17.5" r=".9"/>',
    attach: '<path d="M19 11.5l-7.2 7.2a4.5 4.5 0 0 1-6.4-6.4l7.6-7.6a3 3 0 0 1 4.2 4.2l-7.4 7.4a1.5 1.5 0 0 1-2.1-2.1l6.8-6.8"/>',
  };

  // 사물: viewBox + 본문. 평면 채색 · 외곽선 없음 · 사물당 2~3색 · 바닥 타원 그림자(o-shadow)
  const STEAM = '<g class="g-steam"><path class="o-steam" d="M44 46c-8-9 6-16-2-27"/><path class="o-steam" d="M58 46c-8-11 8-18 0-33"/><path class="o-steam" d="M72 46c-8-9 6-16-2-27"/></g>';
  const BLANKET_FOLD = (x, y, w, h) => `<rect class="o-fab" x="${x}" y="${y}" width="${w}" height="${h}" rx="${Math.round(h / 3.4)}"/>`
    + `<rect class="o-fab-l" x="${x}" y="${y}" width="${w}" height="${Math.round(h * .3)}" rx="${Math.round(h * .15)}"/>`
    + `<rect class="o-fab-d" x="${x + 6}" y="${y + Math.round(h * .5)}" width="${w - 12}" height="2.6"/>`
    + `<rect class="o-fab-d" x="${x + 6}" y="${y + Math.round(h * .72)}" width="${w - 12}" height="2.6"/>`;
  const OBJECTS = {
    pendant: ['0 0 200 240',
      '<polygon class="o-glow" points="52,84 148,84 200,240 0,240"/>'
      + '<rect class="o-ink" x="99" y="0" width="2" height="32"/>'
      + '<rect class="o-ink" x="92" y="27" width="16" height="11" rx="3"/>'
      + '<path class="o-shade" d="M38 82C38 50 64 36 100 36s62 14 62 46z"/>'
      + '<rect class="o-shade-d" x="35" y="79" width="130" height="6" rx="3"/>'
      + '<ellipse class="o-lamp" cx="100" cy="88" rx="17" ry="8"/>'],
    tablelamp: ['0 0 140 232',
      '<polygon class="o-glow" points="26,98 114,98 140,214 0,214"/><ellipse class="o-pool" cx="70" cy="216" rx="70" ry="9"/>'
      + '<path class="o-shade" d="M40 24h60l18 72H22z"/>'
      + '<rect class="o-shade-d" x="20" y="93" width="100" height="6" rx="2"/>'
      + '<ellipse class="o-lamp" cx="70" cy="100" rx="30" ry="4.5"/>'
      + '<ellipse class="o-shadow" cx="70" cy="220" rx="48" ry="6"/>'
      + '<rect class="o-ink" x="67" y="100" width="6" height="96"/>'
      + '<path class="o-wood-d" d="M42 218c0-16 12-24 28-24s28 8 28 24z"/>'],
    candle: ['0 0 60 150',
      '<polygon class="o-glow-n" points="21,16 39,16 60,112 0,112"/><ellipse class="o-pool-n" cx="30" cy="140" rx="30" ry="6"/>'
      + '<ellipse class="o-shadow" cx="30" cy="143" rx="25" ry="4"/>'
      + '<g class="g-flame"><path class="o-flame" d="M30 12c7 12 9 21 0 34-9-13-7-22 0-34z"/><path class="o-flame-in" d="M30 29c3.5 5.5 3.8 9.5 0 14-3.8-4.5-3.5-8.5 0-14z"/></g>'
      + '<rect class="o-ink" x="29" y="44" width="2" height="9"/>'
      + '<rect class="o-wax" x="16" y="51" width="28" height="82" rx="3"/>'
      + '<rect class="o-wax-d" x="16" y="51" width="28" height="7" rx="3"/>'
      + '<rect class="o-wood-d" x="7" y="131" width="46" height="9" rx="4.5"/>'],
    mug: ['0 0 116 140',
      STEAM
      + '<ellipse class="o-shadow" cx="56" cy="133" rx="42" ry="5"/>'
      + '<path class="o-mug-s" d="M84 72h6a13 13 0 0 1 0 26h-6"/>'
      + '<rect class="o-mug" x="24" y="54" width="64" height="76" rx="11"/>'
      + '<rect class="o-mug-d" x="24" y="54" width="64" height="9" rx="4.5"/>'],
    blanket: ['0 0 200 104',
      '<ellipse class="o-shadow" cx="100" cy="96" rx="88" ry="6"/>'
      + BLANKET_FOLD(12, 50, 176, 42)
      + BLANKET_FOLD(20, 14, 160, 40)
      + '<rect class="o-fab-d" x="188" y="58" width="7" height="3" rx="1.5"/><rect class="o-fab-d" x="188" y="66" width="7" height="3" rx="1.5"/><rect class="o-fab-d" x="188" y="74" width="7" height="3" rx="1.5"/><rect class="o-fab-d" x="188" y="82" width="7" height="3" rx="1.5"/>'],
    chair: ['0 0 240 210', ''],
    'chair-blanket': ['0 0 240 210', ''],
    stool: ['0 0 130 140',
      '<ellipse class="o-shadow" cx="65" cy="131" rx="56" ry="5"/>'
      + '<path class="o-wood" d="M58 52h14l-2 74H60z"/>'
      + '<path class="o-wood-d" d="M22 52h13l-8 76H16z"/><path class="o-wood-d" d="M95 52h13l6 76h-11z"/>'
      + '<rect class="o-wood-d" x="26" y="96" width="78" height="5" rx="2.5"/>'
      + '<rect class="o-wood" x="8" y="36" width="114" height="17" rx="8.5"/>'],
    sidetable: ['0 0 150 160',
      '<ellipse class="o-shadow" cx="75" cy="153" rx="60" ry="5"/>'
      + '<rect class="o-wood-d" x="68" y="50" width="14" height="92"/>'
      + '<path class="o-wood-d" d="M34 152c0-12 18-16 41-16s41 4 41 16z"/>'
      + '<rect class="o-wood" x="6" y="38" width="138" height="13" rx="6.5"/>'],
    'sidetable-set': ['0 0 190 260',
      '<polygon class="o-glow-n" points="128,46 142,46 176,140 94,140"/>'
      + '<ellipse class="o-shadow" cx="95" cy="253" rx="66" ry="5"/>'
      + '<rect class="o-wood-d" x="88" y="150" width="14" height="92"/>'
      + '<path class="o-wood-d" d="M54 252c0-12 18-16 41-16s41 4 41 16z"/>'
      + '<rect class="o-wood" x="20" y="138" width="150" height="13" rx="6.5"/>'
      + '<g transform="translate(14 0)"><g class="g-steam"><path class="o-steam" d="M40 82c-6-7 5-12-1-20"/><path class="o-steam" d="M51 82c-6-8 6-14 0-25"/><path class="o-steam" d="M62 82c-6-7 5-12-1-20"/></g>'
      + '<path class="o-mug-s" d="M72 102h4a10 10 0 0 1 0 20h-4" style="stroke-width:6"/>'
      + '<rect class="o-mug" x="28" y="88" width="48" height="50" rx="8"/><rect class="o-mug-d" x="28" y="88" width="48" height="7" rx="3.5"/></g>'
      + '<g transform="translate(110 22)"><g class="g-flame"><path class="o-flame" d="M25 6c5 9 7 15 0 25-7-10-5-16 0-25z"/><path class="o-flame-in" d="M25 18c2.6 4 2.8 7 0 10.5-2.8-3.5-2.6-6.5 0-10.5z"/></g>'
      + '<rect class="o-ink" x="24" y="30" width="2" height="7"/><rect class="o-wax" x="14" y="36" width="22" height="74" rx="3"/><rect class="o-wax-d" x="14" y="36" width="22" height="6" rx="3"/><rect class="o-wood-d" x="6" y="108" width="38" height="8" rx="4"/></g>'],
    shelf: ['0 0 240 220',
      '<ellipse class="o-shadow" cx="120" cy="214" rx="112" ry="5"/>'
      + '<rect class="o-wood-d" x="10" y="8" width="8" height="204" rx="2"/><rect class="o-wood-d" x="222" y="8" width="8" height="204" rx="2"/>'
      + '<rect class="o-bk1" x="30" y="20" width="13" height="40"/><rect class="o-bk2" x="45" y="27" width="10" height="33"/><rect class="o-bk3" x="57" y="16" width="14" height="44"/>'
      + '<path class="o-bk4" d="M76 60l8-36 10 2-8 34z"/>'
      + '<path class="o-cer" d="M162 60c-12-10-6-24 4-28v-8h12v8c10 4 16 18 4 28z"/>'
      + '<rect class="o-wood" x="4" y="58" width="232" height="8" rx="2"/>'
      + '<rect class="o-mug" x="36" y="100" width="24" height="26" rx="4"/><rect class="o-cer" x="66" y="96" width="24" height="30" rx="4"/><rect class="o-mug" x="96" y="104" width="22" height="22" rx="4"/>'
      + '<rect class="o-wax" x="168" y="86" width="12" height="40" rx="2"/><rect class="o-wax" x="184" y="92" width="12" height="34" rx="2"/><rect class="o-wax" x="200" y="98" width="12" height="28" rx="2"/>'
      + '<rect class="o-wood" x="4" y="124" width="232" height="8" rx="2"/>'
      + '<rect class="o-fab-d" x="30" y="174" width="96" height="16" rx="6"/><rect class="o-fab" x="34" y="158" width="88" height="17" rx="6"/><rect class="o-fab-l" x="38" y="144" width="80" height="15" rx="6"/>'
      + '<rect class="o-wood-d" x="148" y="152" width="64" height="38" rx="5"/><rect class="o-wood" x="148" y="152" width="64" height="7" rx="3"/>'
      + '<rect class="o-wood" x="4" y="190" width="232" height="8" rx="2"/>'],
    window: ['0 0 196 236', ''],   // 아래에서 SKY로 채운다
    door: ['0 0 110 230',
      '<rect class="o-frame" x="0" y="0" width="110" height="230" rx="3"/>'
      + '<rect class="o-door" x="8" y="8" width="94" height="222"/>'
      + '<rect class="o-door-d" x="20" y="22" width="70" height="80" rx="3"/>'
      + '<rect class="o-door-d" x="20" y="118" width="70" height="96" rx="3"/>'
      + '<circle class="o-brass" cx="88" cy="118" r="5"/>'],
    'door-lit': ['0 0 190 270',
      '<polygon class="o-glow" points="46,226 144,226 190,270 0,270"/>'
      + '<rect class="o-frame" x="40" y="0" width="110" height="230" rx="3"/>'
      + '<rect class="o-lamp" x="48" y="8" width="94" height="222"/>'
      + '<rect class="o-door" x="48" y="8" width="90" height="217"/>'
      + '<rect class="o-door-d" x="60" y="22" width="66" height="80" rx="3"/>'
      + '<rect class="o-door-d" x="60" y="118" width="66" height="92" rx="3"/>'
      + '<circle class="o-brass" cx="126" cy="118" r="5"/>'],
    plant: ['0 0 120 210',
      '<ellipse class="o-shadow" cx="60" cy="203" rx="40" ry="5"/>'
      + '<path class="o-stem" d="M60 150V40M60 118L36 84M60 98l26-32M60 70L44 42M60 60l18-22"/>'
      + '<ellipse class="o-leaf" cx="32" cy="80" rx="13" ry="5" transform="rotate(-35 32 80)"/>'
      + '<ellipse class="o-leaf-d" cx="46" cy="96" rx="12" ry="4.5" transform="rotate(25 46 96)"/>'
      + '<ellipse class="o-leaf" cx="88" cy="62" rx="13" ry="5" transform="rotate(-50 88 62)"/>'
      + '<ellipse class="o-leaf-d" cx="74" cy="82" rx="12" ry="4.5" transform="rotate(-20 74 82)"/>'
      + '<ellipse class="o-leaf" cx="42" cy="38" rx="12" ry="4.5" transform="rotate(55 42 38)"/>'
      + '<ellipse class="o-leaf-d" cx="80" cy="34" rx="11" ry="4.5" transform="rotate(-40 80 34)"/>'
      + '<ellipse class="o-leaf" cx="60" cy="30" rx="4.5" ry="11"/>'
      + '<ellipse class="o-leaf" cx="74" cy="112" rx="11" ry="4.5" transform="rotate(30 74 112)"/>'
      + '<ellipse class="o-leaf-d" cx="46" cy="124" rx="11" ry="4.5" transform="rotate(-30 46 124)"/>'
      + '<path class="o-pot" d="M28 150h64l-8 50H36z"/>'
      + '<rect class="o-pot-d" x="24" y="146" width="72" height="11" rx="3"/>'],
    cat: ['0 0 160 92',
      '<ellipse class="o-shadow" cx="82" cy="85" rx="70" ry="6"/>'
      + '<path class="o-cat" d="M128 78c26 2 30-22 14-28 8 8 4 18-14 18z"/>'
      + '<path class="o-cat" d="M22 82c-6-30 22-50 62-50 36 0 56 18 54 50z"/>'
      + '<path class="o-cat-d" d="M88 33c5 8 5 15 1 21h-6c4-7 4-14-1-21zM104 37c5 8 5 15 1 21h-6c4-7 4-14-1-21zM119 45c4 7 4 13 0 18h-5c3-6 3-11 0-18z"/>'
      + '<path class="o-cat" d="M20 44l3-24 17 13zM46 33l15-14 3 24z"/>'
      + '<circle class="o-cat" cx="40" cy="55" r="24"/>'
      + '<path class="o-line" d="M29 57q4 4 8 0M45 57q4 4 8 0"/>'
      + '<path class="o-cat-d" d="M38 63l3 3 3-3z"/>'],
    yarn: ['0 0 96 92',
      '<ellipse class="o-shadow" cx="44" cy="86" rx="34" ry="4"/>'
      + '<circle class="o-yarn" cx="44" cy="46" r="34"/>'
      + '<path class="o-yarn-l" d="M16 38c16-16 44-18 58-6M12 52c20-20 52-20 66-4M18 66c18-16 46-14 56-2M32 16c-10 22-4 48 14 64"/>'
      + '<path class="o-yarn-s" d="M74 66c14 8 10 18 20 20"/>'],
    frame: ['0 0 130 170',
      '<path class="o-line" d="M65 5L30 40M65 5l35 35"/><circle class="o-ink" cx="65" cy="5" r="3.5"/>'
      + '<rect class="o-wood" x="14" y="38" width="102" height="128" rx="2"/>'
      + '<rect class="o-cer" x="24" y="48" width="82" height="108"/>'
      + '<rect class="o-art-a" x="34" y="58" width="62" height="88"/>'
      + '<circle class="o-art-b" cx="64" cy="94" r="15"/>'
      + '<path class="o-art-c" d="M34 120q30-16 62 4v22H34z"/>'],
    bed: ['0 0 380 200',
      '<ellipse class="o-shadow" cx="190" cy="191" rx="182" ry="7"/>'
      + '<rect class="o-wood" x="12" y="24" width="356" height="118" rx="16"/>'
      + '<rect class="o-wood-d" x="30" y="162" width="14" height="24" rx="3"/><rect class="o-wood-d" x="336" y="162" width="14" height="24" rx="3"/>'
      + '<rect class="o-linen-d" x="20" y="104" width="340" height="40" rx="8"/>'
      + '<rect class="o-linen o-pillow" x="42" y="70" width="112" height="42" rx="18"/><rect class="o-linen o-pillow" x="226" y="70" width="112" height="42" rx="18"/>'
      + '<path class="o-fab" d="M20 114h340v44a10 10 0 0 1-10 10H30a10 10 0 0 1-10-10z"/>'
      + '<rect class="o-fab-l" x="20" y="110" width="340" height="16" rx="8"/>'
      + '<rect class="o-fab-d" x="20" y="138" width="340" height="3"/><rect class="o-fab-d" x="20" y="150" width="340" height="3"/>'],
    desk: ['0 0 260 170',
      '<ellipse class="o-shadow" cx="130" cy="163" rx="124" ry="5"/>'
      + '<path class="o-wood-d" d="M16 50h12l-6 108H12zM232 50h12l4 108h-10z"/>'
      + '<rect class="o-wood-d" x="150" y="50" width="94" height="36" rx="3"/>'
      + '<rect class="o-brass" x="186" y="64" width="22" height="5" rx="2.5"/>'
      + '<rect class="o-wood" x="0" y="38" width="260" height="13" rx="3"/>'],
    'arrow-curve': ['0 0 120 64', '<path class="o-pen" d="M6 10c34-6 78 4 98 34"/><path class="o-pen" d="M91 43l13 3 2-14"/>'],
    'arrow-straight': ['0 0 100 24', '<path class="o-pen" d="M4 14c26-3 56-1 88-2"/><path class="o-pen" d="M82 4l12 8-12 8"/>'],
  };
  // 의자 — 등받이 · 팔걸이 · 좌방석 · 벌어진 다리
  const CHAIR = '<ellipse class="o-shadow" cx="120" cy="200" rx="106" ry="7"/>'
    + '<path class="o-wood-d" d="M44 154h14l-10 42h-9zM182 154h14l7 42h-9z"/>'
    + '<rect class="o-wood" x="30" y="146" width="180" height="10" rx="3"/>'
    + '<path class="o-chair" d="M40 32c0-12 8-18 18-18h124c10 0 18 6 18 18v90H40z"/>'
    + '<rect class="o-chair-d" x="28" y="104" width="184" height="44" rx="18"/>'
    + '<rect class="o-chair" x="14" y="80" width="42" height="72" rx="19"/><rect class="o-chair" x="184" y="80" width="42" height="72" rx="19"/>';
  OBJECTS.chair[1] = CHAIR;
  OBJECTS['chair-blanket'][1] = CHAIR
    + BLANKET_FOLD(64, 82, 116, 28)
    + '<rect class="o-fab-d" x="180" y="88" width="6" height="2.6" rx="1.3"/><rect class="o-fab-d" x="180" y="95" width="6" height="2.6" rx="1.3"/><rect class="o-fab-d" x="180" y="102" width="6" height="2.6" rx="1.3"/>';
  // 창 하늘 — 하늘 · 별 · 해(밤엔 달) · 언덕 · 눈 덮인 땅 · 눈송이. 색과 보임은 장면 시각 토큰(data-sky=dusk|day|snow|night)이 쥔다
  const r1 = (n) => Math.round(n * 10) / 10;
  const SKY = (x, y, w, h, o = {}) => {
    const P = (fx, fy) => `${r1(x + w * fx)} ${r1(y + h * fy)}`;
    const stars = [[.12, .08], [.34, .2], [.7, .07], [.88, .26], [.55, .3], [.2, .38]]
      .map(([a, b]) => `<circle cx="${r1(x + w * a)}" cy="${r1(y + h * b)}" r="1.4"/>`).join('');
    const flakes = [[.1, .12], [.3, .34], [.22, .62], [.42, .08], [.6, .22], [.82, .12], [.9, .44], [.52, .5], [.72, .58], [.14, .8], [.66, .76], [.38, .7]]
      .map(([a, b], i) => `<circle cx="${r1(x + w * a)}" cy="${r1(y + h * b)}" r="${i % 3 ? 1.7 : 2.3}"/>`).join('');
    const sun = o.sun || [.68, .64, .15];
    return `<rect class="o-sky" x="${x}" y="${y}" width="${w}" height="${h}"/>`
      + `<g class="o-star">${stars}</g>`
      + `<circle class="o-sun" cx="${r1(x + w * sun[0])}" cy="${r1(y + h * sun[1])}" r="${r1(w * sun[2])}"/>`
      + (o.ground === false ? '' :
        `<path class="o-hill" d="M${P(0, .78)}Q${P(.3, .6)} ${P(.58, .74)}Q${P(.8, .64)} ${P(1, .72)}V${r1(y + h)}H${x}z"/>`
        + `<path class="o-snow" d="M${P(0, .9)}Q${P(.36, .8)} ${P(.66, .9)}Q${P(.84, .86)} ${P(1, .88)}V${r1(y + h)}H${x}z"/>`)
      + `<g class="o-flake">${flakes}</g>`;
  };
  const ROD = (w) => `<rect class="o-wood-d" x="0" y="6" width="${w}" height="6" rx="3"/><circle class="o-wood-d" cx="5" cy="9" r="6"/><circle class="o-wood-d" cx="${w - 5}" cy="9" r="6"/>`;
  // ① 거실 4분할 창 — 16:10 노을 (index 거실 한 곳에만)
  OBJECTS.window[1] = '<rect class="o-frame-d" x="0" y="222" width="196" height="12" rx="3"/>'
    + '<rect class="o-frame" x="10" y="0" width="176" height="226" rx="4"/>'
    + SKY(22, 12, 152, 200, { sun: [.7, .69, .145] })
    + '<rect class="o-frame" x="94" y="12" width="8" height="200"/>'
    + '<rect class="o-frame" x="22" y="106" width="152" height="8"/>';
  // ② 서재 프렌치 창 — 바닥까지 닿는 두 짝 문 + 묶어 둔 리넨 커튼 (눈 내림)
  const CURTAIN_L = '<path class="o-curtain" d="M6 12H56C52 92 46 170 40 226C48 280 54 330 52 372H4C6 322 12 272 10 226C8 160 6 92 6 12Z"/>'
    + '<path class="o-curtain-d" d="M20 18C20 100 20 170 18 222M36 18C35 100 31 170 28 222M18 234C16 290 14 330 14 366M32 234C34 290 37 330 39 366"/>'
    + '<rect class="o-curtain-t" x="7" y="220" width="36" height="9" rx="4.5"/>';
  OBJECTS['window-french'] = ['0 0 220 384',
    '<rect class="o-frame-d" x="26" y="364" width="168" height="12" rx="3"/>'
    + '<rect class="o-frame" x="40" y="20" width="140" height="346" rx="3"/>'
    + SKY(50, 30, 120, 326, { sun: [.7, .6, .12] })
    + '<rect class="o-frame" x="106" y="30" width="8" height="326"/>'
    + '<rect class="o-frame" x="50" y="134" width="120" height="6"/><rect class="o-frame" x="50" y="244" width="120" height="6"/>'
    + '<rect class="o-brass" x="116" y="190" width="4" height="22" rx="2"/>'
    + ROD(220) + CURTAIN_L + `<g transform="translate(220 0) scale(-1 1)">${CURTAIN_L}</g>`];
  // ③ 침실 창 — 커튼을 친 창. 가운데 틈으로 하늘 한 줄만 보인다
  OBJECTS['window-curtain'] = ['0 0 200 252',
    '<rect class="o-frame-d" x="14" y="214" width="172" height="10" rx="3"/>'
    + '<rect class="o-frame" x="26" y="22" width="148" height="194" rx="3"/>'
    + SKY(36, 32, 128, 176, { sun: [.5, .3, .1] })
    + ROD(200)
    + '<path class="o-curtain" d="M8 12H98C96 96 92 176 94 246H10C12 172 6 92 8 12Z"/>'
    + '<path class="o-curtain" d="M102 12H192C194 92 188 172 190 246H106C108 176 104 96 102 12Z"/>'
    + '<path class="o-curtain-d" d="M30 18C31 100 28 180 30 240M54 18C54 100 52 180 54 240M76 18C76 100 72 180 74 240M124 18C124 100 128 180 126 240M146 18C146 100 148 180 146 240M170 18C169 100 172 180 170 240"/>'
    + '<rect class="o-curtain-t" x="10" y="238" width="84" height="8" rx="2"/><rect class="o-curtain-t" x="106" y="238" width="84" height="8" rx="2"/>'];
  // ④ 현관 옆 세로 유리 — 문 옆에 붙은 좁고 긴 창
  OBJECTS['window-sidelite'] = ['0 0 64 282',
    '<rect class="o-frame" x="0" y="0" width="64" height="282" rx="3"/>'
    + SKY(9, 9, 46, 264, { sun: [.5, .34, .22] })
    + '<rect class="o-frame" x="9" y="94" width="46" height="6"/><rect class="o-frame" x="9" y="184" width="46" height="6"/>'];
  // ⑤ 작은 정사각 창 — 한 장 유리 + 반만 가린 카페 커튼
  OBJECTS['window-square'] = ['0 0 150 142',
    '<rect class="o-frame-d" x="0" y="124" width="150" height="12" rx="3"/>'
    + '<rect class="o-frame" x="10" y="0" width="130" height="128" rx="4"/>'
    + SKY(22, 12, 106, 104, { sun: [.66, .42, .15] })
    + '<rect class="o-wood-d" x="16" y="62" width="118" height="4" rx="2"/>'
    + '<path class="o-curtain" d="M22 64H128V108q-6.6 7-13.25 0q-6.6 7-13.25 0q-6.6 7-13.25 0q-6.6 7-13.25 0q-6.6 7-13.25 0q-6.6 7-13.25 0q-6.6 7-13.25 0q-6.6 7-13.25 0Z"/>'
    + '<path class="o-curtain-d" d="M40 68V104M62 68V104M88 68V104M110 68V104"/>'];
  // ⑥ 다락 천창 — 경사 지붕에 난 창. 올려다본 밤하늘 · 초승달 · 유리에 쌓인 눈
  OBJECTS.skylight = ['0 0 260 150',
    '<polygon class="o-frame-d" points="54,0 206,0 252,146 8,146"/>'
    + '<polygon class="o-frame" points="62,6 198,6 240,138 20,138"/>'
    + '<polygon class="o-sky" points="74,16 186,16 224,128 36,128"/>'
    + '<g class="o-star"><circle cx="92" cy="30" r="1.5"/><circle cx="118" cy="52" r="1.2"/><circle cx="160" cy="28" r="1.5"/><circle cx="70" cy="84" r="1.2"/><circle cx="196" cy="94" r="1.4"/><circle cx="142" cy="96" r="1"/></g>'
    + '<circle class="o-sun" cx="178" cy="54" r="15"/><circle class="o-sky" cx="185" cy="49" r="13"/>'
    + '<g class="o-flake"><circle cx="88" cy="40" r="2"/><circle cx="104" cy="96" r="1.7"/><circle cx="150" cy="70" r="2.2"/><circle cx="176" cy="108" r="1.7"/><circle cx="66" cy="110" r="2"/><circle cx="208" cy="112" r="1.6"/></g>'
    + '<path class="o-snow" d="M36 128Q60 114 88 120T150 118T224 128Z"/>'
    + '<polygon class="o-frame" points="126,16 134,16 134,128 126,128"/>'
    + '<rect class="o-brass" x="118" y="140" width="24" height="5" rx="2.5"/>'];
  // ⑦ 다락 둥근 창 — 나무 테두리 원창, 밤하늘과 달
  OBJECTS.porthole = ['0 0 200 200',
    '<circle class="o-sky" cx="100" cy="100" r="84"/>'
    + '<g class="o-star"><circle cx="62" cy="52" r="1.6"/><circle cx="84" cy="76" r="1.2"/><circle cx="132" cy="40" r="1.5"/><circle cx="150" cy="86" r="1.2"/><circle cx="48" cy="96" r="1.3"/></g>'
    + '<circle class="o-sun" cx="134" cy="112" r="24"/><circle class="o-sky" cx="144" cy="104" r="21"/>'
    + '<path class="o-hill" d="M24 132Q70 108 110 124Q150 110 176 128A82 82 0 0 1 24 132Z"/>'
    + '<path class="o-snow" d="M34 150Q90 136 166 150A82 82 0 0 1 34 150Z"/>'
    + '<g class="o-flake"><circle cx="58" cy="70" r="2"/><circle cx="76" cy="118" r="1.7"/><circle cx="112" cy="60" r="2.2"/><circle cx="160" cy="70" r="1.7"/><circle cx="124" cy="92" r="1.6"/><circle cx="40" cy="120" r="1.8"/></g>'
    + '<rect class="o-wood-d" x="96" y="16" width="8" height="168"/>'
    + '<path class="o-wood" fill-rule="evenodd" d="M2 100A98 98 0 1 0 198 100A98 98 0 1 0 2 100ZM16 100A84 84 0 1 0 184 100A84 84 0 1 0 16 100Z"/>'
    + '<circle class="o-brass" cx="178" cy="100" r="5"/>'];
  // 담요 클로즈업 — 3/4 시점의 둥근 팔걸이(+ 좌판 일부)를 감싸 늘어진 담요.
  // 팔걸이 위에 얹힌 윗면 + 앞으로 늘어진 면 두 장, 접힌 자리 그늘, 굵은 V코(두 줄 띠), 술, 꿰맨 라벨
  const DRAPE = (() => {
    const vrow = (y, x0, x1, w, h) => { let d = ''; for (let x = x0; x + w <= x1; x += w + 3) d += `M${x} ${y}l${w / 2} ${h}l${w / 2}-${h}`; return d; };
    let knit = '';
    for (let y = 214; y <= 414; y += 15) knit += vrow(y, 184, 304, 15, 10);
    let top = vrow(166, 190, 292, 13, 5) + vrow(178, 186, 296, 13, 5);
    let tassel = '';
    for (let x = 166; x <= 314; x += 12) tassel += `<rect class="o-fab-d" x="${x}" y="${434 + ((x * 3) % 7)}" width="5" height="${34 + ((x * 7) % 11)}" rx="2.5"/>`;
    return '<ellipse class="o-shadow" cx="210" cy="510" rx="190" ry="8"/>'
      // 의자 — 등받이(뒤 그늘) · 좌판 일부 · 팔걸이 옆판 · 둥근 팔걸이(굴린 원통, 앞 끝 마구리) · 나무 받침 · 다리
      + '<path class="o-chair-d" d="M0 84Q0 56 30 52L190 46Q220 44 222 74L224 200H0Z"/>'
      + '<rect class="o-chair" x="0" y="66" width="200" height="126" rx="26"/>'
      + '<path class="o-chair-d" d="M0 132H200V138H0Z"/>'
      + '<path class="o-chair" d="M0 248Q0 232 18 230L178 226Q196 226 196 244V352H0Z"/>'
      + '<path class="o-chair-d" d="M0 330H196V352H0Z"/>'
      + '<path class="o-chair-d" d="M150 214L352 226V468H150Z"/>'
      + '<path class="o-chair" d="M124 156Q130 118 176 118L326 134Q370 140 370 186Q370 232 326 238L172 236Q126 232 124 196Z"/>'
      + '<ellipse class="o-chair-d" cx="334" cy="188" rx="34" ry="50"/>'
      + '<ellipse class="o-chair" cx="338" cy="188" rx="24" ry="38"/>'
      + '<path class="o-wood-d" d="M168 470h20l-6 38h-12zM330 470h20l8 38h-13z"/>'
      + '<rect class="o-wood" x="146" y="458" width="214" height="14" rx="4"/>'
      // 담요 — 팔걸이 안쪽으로 접혀 들어간 면(그늘)
      + '<path class="o-fab-d" d="M182 132Q160 150 156 196L154 300H176L178 200Z"/>'
      // 윗면 — 팔걸이 둥근 등을 따라 얹힌 면
      + '<path class="o-fab-l" d="M180 128Q244 120 302 138Q314 160 310 204Q244 192 176 198Q170 160 180 128Z"/>'
      + `<path class="o-knit" d="${top}"/>`
      // 앞으로 늘어진 면 — 아래로 갈수록 살짝 벌어지고 끝은 물결
      + '<path class="o-fab" d="M176 198Q244 192 310 204L322 428Q294 444 266 434Q238 446 210 436Q184 446 162 430Z"/>'
      // 굵은 띠 두 줄
      + '<path class="o-fab-l" d="M172 262Q244 256 314 266L315 286Q244 276 171 282Z"/><path class="o-fab-l" d="M167 346Q244 340 318 350L319 370Q244 360 166 366Z"/>'
      + `<path class="o-knit o-knit--bold" d="${knit}"/>`
      // 접힌 자리 그늘 + 오른쪽 접힌 두께
      + '<path class="o-fab-d" d="M176 198Q244 192 310 204L310 212Q244 200 176 206Z"/>'
      + '<path class="o-fab-d" d="M310 204L322 428L332 422L318 196Z"/>'
      // 라벨 — 앞면 오른쪽 위에 꿰맨 천
      + '<rect class="o-label" x="266" y="214" width="38" height="24" rx="2"/><path class="o-label-l" d="M273 222h24M273 230h16"/>'
      // 술
      + tassel;
  })();
  OBJECTS['blanket-drape'] = ['0 0 400 520', DRAPE];
  // 소파 정면 — 3인용, 등쿠션 셋 · 좌방석 셋 · 굵은 팔걸이. 색은 --obj-chair 를 따른다
  OBJECTS.sofa = ['0 0 380 190',
    '<ellipse class="o-shadow" cx="190" cy="182" rx="180" ry="7"/>'
    + '<path class="o-wood-d" d="M40 160h12l-4 20h-8zM328 160h12l0 20h-8z"/>'
    + '<rect class="o-chair-d" x="34" y="20" width="312" height="110" rx="20"/>'
    + '<rect class="o-chair" x="52" y="34" width="88" height="70" rx="16"/><rect class="o-chair" x="146" y="34" width="88" height="70" rx="16"/><rect class="o-chair" x="240" y="34" width="88" height="70" rx="16"/>'
    + '<rect class="o-cush" x="250" y="56" width="62" height="46" rx="14" transform="rotate(-8 281 79)"/>'
    + '<rect class="o-chair-d" x="34" y="104" width="312" height="58" rx="14"/>'
    + '<rect class="o-chair" x="50" y="100" width="92" height="30" rx="10"/><rect class="o-chair" x="144" y="100" width="92" height="30" rx="10"/><rect class="o-chair" x="238" y="100" width="92" height="30" rx="10"/>'
    + '<rect class="o-chair" x="8" y="70" width="48" height="92" rx="22"/><rect class="o-chair" x="324" y="70" width="48" height="92" rx="22"/>'];
  // 2인용 소파 — 둥근 등받이 · 나무 팔걸이 · 높은 다리 (data-cover 로 천 색을 고른다)
  OBJECTS.loveseat = ['0 0 260 172',
    '<ellipse class="o-shadow" cx="130" cy="165" rx="116" ry="6"/>'
    + '<path class="o-wood-d" d="M46 126h11l-9 36h-8zM203 126h11l6 36h-8z"/>'
    + '<rect class="o-chair-d" x="34" y="26" width="192" height="76" rx="32"/>'
    + '<rect class="o-chair" x="46" y="36" width="82" height="60" rx="24"/><rect class="o-chair" x="132" y="36" width="82" height="60" rx="24"/>'
    + '<rect class="o-cush" x="150" y="52" width="50" height="38" rx="12" transform="rotate(8 175 71)"/>'
    + '<rect class="o-chair-d" x="32" y="92" width="196" height="34" rx="12"/>'
    + '<rect class="o-chair" x="42" y="88" width="86" height="24" rx="10"/><rect class="o-chair" x="132" y="88" width="86" height="24" rx="10"/>'
    + '<rect class="o-wood" x="26" y="120" width="208" height="9" rx="3"/>'
    + '<rect class="o-wood" x="16" y="66" width="22" height="60" rx="9"/><rect class="o-wood" x="222" y="66" width="22" height="60" rx="9"/>'
    + '<rect class="o-wood-d" x="16" y="66" width="22" height="9" rx="4.5"/><rect class="o-wood-d" x="222" y="66" width="22" height="9" rx="4.5"/>'];
  // 데이베드 — 등받이 없는 낮은 침상, 원통 베개와 끝에 접어 둔 담요
  OBJECTS.daybed = ['0 0 340 150',
    '<ellipse class="o-shadow" cx="170" cy="144" rx="160" ry="6"/>'
    + '<rect class="o-wood-d" x="26" y="112" width="10" height="28" rx="2"/><rect class="o-wood-d" x="304" y="112" width="10" height="28" rx="2"/>'
    + '<rect class="o-wood" x="10" y="28" width="16" height="92" rx="5"/><rect class="o-wood" x="314" y="58" width="16" height="62" rx="5"/>'
    + '<rect class="o-wood" x="14" y="100" width="312" height="18" rx="4"/>'
    + '<rect class="o-chair" x="22" y="70" width="296" height="34" rx="12"/>'
    + '<rect class="o-chair-d" x="22" y="94" width="296" height="5"/>'
    + '<rect class="o-cush" x="30" y="44" width="78" height="30" rx="15"/><ellipse class="o-cush-d" cx="104" cy="59" rx="6" ry="14"/>'
    + BLANKET_FOLD(212, 52, 92, 22)];
  // 패브릭 스와치 4종 — 나무 봉에 집게로 건 천 조각(세이지 부클레 · 장작 가죽 · 눈밭 리넨 · 버터 양모). 아래 단은 핑킹 가위 자국
  OBJECTS.swatches = ['0 0 220 150',
    '<ellipse class="o-shadow" cx="110" cy="146" rx="96" ry="3"/>'
    + '<rect class="o-wood-d" x="4" y="8" width="212" height="8" rx="4"/>'
    + '<rect class="o-brass" x="32" y="12" width="8" height="16" rx="3"/><path class="o-sw1" d="M14 26h44v108l-5.5 6l-5.5 -6l-5.5 6l-5.5 -6l-5.5 6l-5.5 -6l-5.5 6l-5.5 -6z"/><circle class="o-tex" cx="22" cy="52" r="3"/><circle class="o-tex" cx="32" cy="52" r="3"/><circle class="o-tex" cx="42" cy="52" r="3"/><circle class="o-tex" cx="52" cy="52" r="3"/><circle class="o-tex" cx="22" cy="64" r="3"/><circle class="o-tex" cx="32" cy="64" r="3"/><circle class="o-tex" cx="42" cy="64" r="3"/><circle class="o-tex" cx="52" cy="64" r="3"/><circle class="o-tex" cx="22" cy="76" r="3"/><circle class="o-tex" cx="32" cy="76" r="3"/><circle class="o-tex" cx="42" cy="76" r="3"/><circle class="o-tex" cx="52" cy="76" r="3"/><circle class="o-tex" cx="22" cy="88" r="3"/><circle class="o-tex" cx="32" cy="88" r="3"/><circle class="o-tex" cx="42" cy="88" r="3"/><circle class="o-tex" cx="52" cy="88" r="3"/><circle class="o-tex" cx="22" cy="100" r="3"/><circle class="o-tex" cx="32" cy="100" r="3"/><circle class="o-tex" cx="42" cy="100" r="3"/><circle class="o-tex" cx="52" cy="100" r="3"/><circle class="o-tex" cx="22" cy="112" r="3"/><circle class="o-tex" cx="32" cy="112" r="3"/><circle class="o-tex" cx="42" cy="112" r="3"/><circle class="o-tex" cx="52" cy="112" r="3"/><circle class="o-tex" cx="22" cy="124" r="3"/><circle class="o-tex" cx="32" cy="124" r="3"/><circle class="o-tex" cx="42" cy="124" r="3"/><circle class="o-tex" cx="52" cy="124" r="3"/><rect class="o-label" x="20" y="32" width="26" height="12" rx="1.5"/><rect class="o-brass" x="82" y="12" width="8" height="16" rx="3"/><path class="o-sw4" d="M64 26h44v108l-5.5 6l-5.5 -6l-5.5 6l-5.5 -6l-5.5 6l-5.5 -6l-5.5 6l-5.5 -6z"/><path class="o-tex" stroke-dasharray="4 4" d="M69 50v80M103 50v80"/><rect class="o-label" x="70" y="32" width="26" height="12" rx="1.5"/><rect class="o-brass" x="132" y="12" width="8" height="16" rx="3"/><path class="o-sw2" d="M114 26h44v108l-5.5 6l-5.5 -6l-5.5 6l-5.5 -6l-5.5 6l-5.5 -6l-5.5 6l-5.5 -6z"/><path class="o-tex" d="M118 52h36M118 59h36M118 66h36M118 73h36M118 80h36M118 87h36M118 94h36M118 101h36M118 108h36M118 115h36M118 122h36M118 129h36"/><rect class="o-label" x="120" y="32" width="26" height="12" rx="1.5"/><rect class="o-brass" x="182" y="12" width="8" height="16" rx="3"/><path class="o-sw3" d="M164 26h44v108l-5.5 6l-5.5 -6l-5.5 6l-5.5 -6l-5.5 6l-5.5 -6l-5.5 6l-5.5 -6z"/><path class="o-tex" d="M170 50l6 7l6-7M182 50l6 7l6-7M194 50l6 7l6-7M170 61l6 7l6-7M182 61l6 7l6-7M194 61l6 7l6-7M170 72l6 7l6-7M182 72l6 7l6-7M194 72l6 7l6-7M170 83l6 7l6-7M182 83l6 7l6-7M194 83l6 7l6-7M170 94l6 7l6-7M182 94l6 7l6-7M194 94l6 7l6-7M170 105l6 7l6-7M182 105l6 7l6-7M194 105l6 7l6-7M170 116l6 7l6-7M182 116l6 7l6-7M194 116l6 7l6-7"/><rect class="o-label" x="170" y="32" width="26" height="12" rx="1.5"/>'];
  // 러그 — 앞에서 비스듬히 본 양모 러그. 띠 두 줄 + 앞쪽 술
  OBJECTS.rug = ['0 0 320 78',
    '<ellipse class="o-shadow" cx="160" cy="70" rx="154" ry="6"/>'
    + '<path class="o-wool" d="M30 10h260l26 52H4z"/>'
    + '<path class="o-wool-d" d="M25 20h270l3 6H22z"/><path class="o-fab" d="M16 36h288l3 7H13z"/><path class="o-wool-d" d="M10 50h300l3 6H7z"/>'
    + '<path class="o-wool-l" d="M8 62h304v3H8z"/>'
    + '<path class="o-tex" d="' + Array.from({ length: 30 }, (_, k) => `M${12 + k * 10} 64v9`).join('') + '"/>'];
  // 현관 신발장 — 나무 벤치 두 칸, 운동화 · 털신 · 장화
  OBJECTS.shoerack = ['0 0 260 176',
    '<ellipse class="o-shadow" cx="130" cy="170" rx="126" ry="5"/>'
    + '<rect class="o-wood-d" x="14" y="40" width="10" height="126" rx="2"/><rect class="o-wood-d" x="236" y="40" width="10" height="126" rx="2"/>'
    + '<path class="o-linen" d="M34 96v-16q0-8 8-8h12q6 0 10 8l16 6q7 3 7 10z"/><path class="o-linen-d" d="M34 92h53v4H34z"/>'
    + '<path class="o-linen" d="M90 96v-16q0-8 8-8h12q6 0 10 8l16 6q7 3 7 10z"/><path class="o-linen-d" d="M90 92h53v4H90z"/>'
    + '<path class="o-fab" d="M156 96v-20q0-10 10-10h10q8 0 11 10l12 5q8 3 8 15z"/><path class="o-fab-d" d="M156 90h51v6h-51z"/>'
    + '<rect class="o-wood" x="14" y="96" width="232" height="8" rx="2"/>'
    + '<path class="o-mug" d="M40 160v-46h18v30q16 2 20 10v6z"/><path class="o-mug" d="M84 160v-46h18v30q16 2 20 10v6z"/>'
    + '<path class="o-cer-d" d="M160 160v-24q0-8 8-8h14q8 0 10 8l10 4q8 3 8 12v8z"/>'
    + '<rect class="o-wood" x="14" y="158" width="232" height="8" rx="2"/>'
    + '<rect class="o-wood" x="4" y="30" width="252" height="12" rx="3"/>'
    + '<rect class="o-brass" x="196" y="22" width="26" height="8" rx="3"/><circle class="o-brass" cx="190" cy="26" r="4"/>'];
  // 택배 상자 — 모닥 크라프트 상자, 테이프 한 줄과 송장
  OBJECTS.parcel = ['0 0 150 124',
    '<ellipse class="o-shadow" cx="72" cy="117" rx="68" ry="5"/>'
    + '<rect class="o-box" x="8" y="42" width="98" height="72" rx="2"/>'
    + '<path class="o-box-d" d="M106 42l34-16v72l-34 16z"/>'
    + '<path class="o-box-l" d="M8 42l34-16h98l-34 16z"/>'
    + '<path class="o-tape" d="M50 42l34-16h13l-34 16z"/><rect class="o-tape" x="50" y="42" width="13" height="26"/>'
    + '<rect class="o-label" x="18" y="78" width="42" height="26" rx="2"/><path class="o-label-l" d="M24 86h30M24 94h18"/>'];

  function paintIcons(scope = doc) {
    $$('svg[data-icon]', scope).forEach((svg) => {
      if (svg.childElementCount) return;
      const body = ICONS[svg.getAttribute('data-icon')];
      if (!body) return;
      svg.setAttribute('viewBox', '0 0 24 24');
      svg.setAttribute('aria-hidden', 'true');
      svg.setAttribute('focusable', 'false');
      svg.classList.add('icon');
      svg.innerHTML = body;
    });
  }
  // 빛 원뿔 그라디언트 — 문서에 한 번만. 위에서 진하고 아래로 사라진다(낮 · 밤 두 벌).
  function ensureGlowDefs() {
    if (doc.getElementById('mdk-glow-day')) return;
    const stop = (o, a) => `<stop offset="${o}" style="stop-color:var(--lamp);stop-opacity:${a}"/>`;
    const wrap = doc.createElement('div');
    wrap.innerHTML = '<svg class="glow-defs" width="0" height="0" aria-hidden="true" focusable="false"><defs>'
      + `<linearGradient id="mdk-glow-day" x1="0" y1="0" x2="0" y2="1">${stop(0, .42)}${stop(.55, .18)}${stop(.94, 0)}</linearGradient>`
      + `<linearGradient id="mdk-glow-night" x1="0" y1="0" x2="0" y2="1">${stop(0, .62)}${stop(.5, .26)}${stop(.94, 0)}</linearGradient>`
      + '<radialGradient id="mdk-pool" cx=".5" cy=".5" r=".5">' + stop(0, .34) + stop(1, 0) + '</radialGradient>'
      + '</defs></svg>';
    doc.body.appendChild(wrap.firstChild);
  }
  function paintObjects(scope = doc) {
    ensureGlowDefs();
    $$('[data-obj]', scope).forEach((el) => {
      if (el.firstElementChild) return;
      const o = OBJECTS[el.getAttribute('data-obj')];
      if (!o) return;
      el.classList.add('obj');
      if (!el.hasAttribute('role')) el.setAttribute('aria-hidden', 'true');
      el.innerHTML = `<svg viewBox="${o[0]}" focusable="false" aria-hidden="true">${o[1]}</svg>`;
    });
  }
  const icon = (name, cls = '') => `<svg class="icon ${cls}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${ICONS[name] || ''}</svg>`;
  paintIcons();
  paintObjects();

  /* ------------------------------------------------------------------------
     1. 테마 — 우선순위: ?theme= → localStorage → prefers-color-scheme
        [data-theme-toggle] = 줄 스위치. 당기면 6px 내려갔다 올라오고, 불빛이 원형으로 번진다.
     ------------------------------------------------------------------------ */
  const schemeQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const queryTheme = () => {
    const t = new URLSearchParams(window.location.search).get('theme');
    return t === 'dark' || t === 'light' ? t : null;
  };
  const storedTheme = () => { const t = store.get(); return t === 'dark' || t === 'light' ? t : null; };
  const resolveTheme = () => queryTheme() || storedTheme() || (schemeQuery.matches ? 'dark' : 'light');

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    $$('[data-theme-toggle]').forEach((btn) => {
      btn.setAttribute('aria-pressed', String(theme === 'dark'));
      if (!btn.hasAttribute('data-keep-label')) btn.setAttribute('aria-label', theme === 'dark' ? '낮 장면으로 바꾸기' : '밤 장면으로 바꾸기');
    });
    $$('[data-theme-label]').forEach((l) => { l.textContent = theme === 'dark' ? (l.getAttribute('data-night') || '밤') : (l.getAttribute('data-day') || '낮'); });
    doc.dispatchEvent(new CustomEvent('modak:theme', { detail: { theme } }));
  }
  applyTheme(resolveTheme());
  const onScheme = () => { if (!queryTheme() && !storedTheme()) applyTheme(resolveTheme()); };
  if (schemeQuery.addEventListener) schemeQuery.addEventListener('change', onScheme);

  function setTheme(next, origin) {
    store.set(next);
    if (!doc.startViewTransition || reduced()) { applyTheme(next); return; }
    const x = origin ? origin.x : window.innerWidth - 40;
    const y = origin ? origin.y : 32;
    const r = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
    const vt = doc.startViewTransition(() => applyTheme(next));
    vt.ready.then(() => {
      root.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
        { duration: 1200, easing: 'cubic-bezier(.22,.61,.36,1)', pseudoElement: '::view-transition-new(root)' },
      );
    }).catch(() => {});
  }
  doc.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-theme-toggle]');
    if (!btn) return;
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    const bead = $('.cord__bead', btn) || btn;
    const rect = bead.getBoundingClientRect();
    btn.classList.remove('is-pulled');
    void btn.offsetWidth;
    btn.classList.add('is-pulled');
    setTimeout(() => btn.classList.remove('is-pulled'), 560);
    setTimeout(() => setTheme(next, { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }), reduced() ? 0 : 170);
  });

  /* [data-scene-pick] — 화면 장면 고르기 라디오(value = light | dark | system).
     낮 · 밤은 setTheme, '기기 설정 따라가기'는 저장값을 지우고 시스템 설정으로 돌아간다. 줄 스위치를 당겨도 라디오가 따라온다. */
  function initScenePick(scope = doc) {
    $$('[data-scene-pick]', scope).forEach((group) => {
      if (group.dataset.ready) return;
      group.dataset.ready = '1';
      const sync = () => {
        const v = storedTheme() || (queryTheme() ? root.getAttribute('data-theme') : 'system');
        const input = $(`input[value="${v}"]`, group);
        if (input) input.checked = true;
      };
      group.addEventListener('change', (e) => {
        const v = e.target.value;
        if (v === 'light' || v === 'dark') { setTheme(v); return; }
        store.clear();
        applyTheme(schemeQuery.matches ? 'dark' : 'light');
        toast({ title: '기기 설정을 따라갈게요', text: schemeQuery.matches ? '지금은 밤 장면이에요.' : '지금은 낮 장면이에요.', tone: 'info' });
      });
      doc.addEventListener('modak:theme', () => setTimeout(sync, 0));
      sync();
    });
  }

  /* ------------------------------------------------------------------------
     2. 레이어 스택 — Esc 닫기 · 포커스 트랩 · 스크롤 잠금 · 바깥 클릭 · 포커스 되돌리기
     ------------------------------------------------------------------------ */
  const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
  const focusables = (el) => $$(FOCUSABLE, el).filter((n) => !n.closest('[hidden],[inert]') && n.getClientRects().length > 0);
  const layers = [];
  const syncLock = () => root.classList.toggle('is-locked', layers.some((l) => l.lock));
  const pushLayer = (l) => { const i = layers.indexOf(l); if (i > -1) layers.splice(i, 1); layers.push(l); syncLock(); };
  const dropLayer = (l) => { const i = layers.indexOf(l); if (i > -1) layers.splice(i, 1); syncLock(); };
  const layerOf = (el) => layers.find((l) => l.el === el);

  function trapTab(e, box) {
    const list = focusables(box);
    if (!list.length) { e.preventDefault(); box.focus(); return; }
    const first = list[0];
    const last = list[list.length - 1];
    const active = doc.activeElement;
    if (e.shiftKey && (active === first || !box.contains(active))) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && (active === last || !box.contains(active))) { e.preventDefault(); first.focus(); }
  }
  doc.addEventListener('keydown', (e) => {
    const top = layers[layers.length - 1];
    if (!top) return;
    if (e.key === 'Escape') { e.preventDefault(); top.close(true); }
    else if (e.key === 'Tab' && top.trap) trapTab(e, top.box);
  });
  doc.addEventListener('pointerdown', (e) => {
    for (let i = layers.length - 1; i >= 0; i -= 1) {
      const l = layers[i];
      if (l.trap) break;
      if (l.el.contains(e.target) || (l.trigger && l.trigger.contains(e.target))) break;
      l.close(false);
    }
  });

  /* ---- 모달 · 드로어 · 커맨드 (트랩 있음) ---------------------------------- */
  function openDialog(el, trigger) {
    if (!el) return;
    if (el.matches('[data-command]')) { openCommand(trigger); return; }
    const existing = layerOf(el);
    if (existing) return;
    const box = $('[role="dialog"], [role="alertdialog"]', el) || el;
    if (!box.hasAttribute('tabindex')) box.setAttribute('tabindex', '-1');
    el.hidden = false;
    void el.offsetWidth;
    el.classList.add('is-open');
    const layer = {
      el, box, trigger: trigger || doc.activeElement, trap: true, lock: true,
      close: (restore = true) => closeDialog(el, restore),
    };
    pushLayer(layer);
    $$(`[aria-controls="${el.id}"]`).forEach((t) => t.setAttribute('aria-expanded', 'true'));
    const target = $('[data-autofocus]', box) || focusables(box).find((n) => !n.matches('.modal__close, .drawer__close')) || focusables(box)[0] || box;
    requestAnimationFrame(() => target.focus({ preventScroll: true }));
    el.dispatchEvent(new CustomEvent('modak:open', { bubbles: true }));
  }
  function closeDialog(el, restore = true) {
    const layer = layerOf(el);
    if (!layer) return;
    dropLayer(layer);
    el.classList.remove('is-open');
    $$(`[aria-controls="${el.id}"]`).forEach((t) => t.setAttribute('aria-expanded', 'false'));
    later(180).then(() => { if (!el.classList.contains('is-open')) el.hidden = true; });
    if (restore && layer.trigger && doc.contains(layer.trigger)) layer.trigger.focus({ preventScroll: true });
    el.dispatchEvent(new CustomEvent('modak:close', { bubbles: true }));
  }

  doc.addEventListener('click', (e) => {
    const opener = e.target.closest('[data-modal-open], [data-drawer-open], [data-open]');
    if (opener) {
      e.preventDefault();
      const id = opener.getAttribute('data-modal-open') || opener.getAttribute('data-drawer-open') || opener.getAttribute('data-open');
      openDialog(byId(id), opener);
      return;
    }
    const closer = e.target.closest('[data-close]');
    if (closer) {
      const host = closer.closest('.modal, .drawer, .cmd, .pop, .menu');
      const l = host && layerOf(host);
      if (l) { e.preventDefault(); l.close(true); }
      return;
    }
    const scrim = e.target.closest('.modal__scrim, .drawer__scrim, .cmd__scrim');
    if (scrim) { const l = layerOf(scrim.parentElement); if (l) l.close(true); }
  });

  /* ---- 커맨드 팔레트 "집 안에서 찾기" (⌘K / Ctrl+K) ------------------------ */
  const cmd = $('[data-command]');
  let cmdInput; let cmdOpts = []; let cmdIndex = -1;
  function cmdVisible() { return cmdOpts.filter((o) => !o.hidden); }
  function cmdSelect(i) {
    const vis = cmdVisible();
    cmdOpts.forEach((o) => o.setAttribute('aria-selected', 'false'));
    if (!vis.length) { cmdIndex = -1; cmdInput.removeAttribute('aria-activedescendant'); return; }
    cmdIndex = (i + vis.length) % vis.length;
    const cur = vis[cmdIndex];
    cur.setAttribute('aria-selected', 'true');
    cmdInput.setAttribute('aria-activedescendant', cur.id);
    cur.scrollIntoView({ block: 'nearest' });
  }
  function cmdFilter() {
    const q = cmdInput.value.trim().toLowerCase();
    cmdOpts.forEach((o) => { o.hidden = q && !(o.getAttribute('data-keywords') || o.textContent).toLowerCase().includes(q); });
    $$('.cmd__group', cmd).forEach((g) => { g.hidden = !$$('.cmd__opt', g).some((o) => !o.hidden); });
    const empty = $('.cmd__empty', cmd);
    if (empty) {
      empty.hidden = cmdVisible().length > 0;
      const qEl = $('[data-cmd-query]', empty);
      if (qEl) qEl.textContent = cmdInput.value.trim();
    }
    cmdSelect(0);
  }
  function openCommand(trigger) {
    if (!cmd || layerOf(cmd)) return;
    openDialogCore(cmd, trigger);
    cmdInput.value = '';
    cmdFilter();
    requestAnimationFrame(() => cmdInput.focus());
  }
  function openDialogCore(el, trigger) {
    const box = $('[role="dialog"]', el) || el;
    el.hidden = false;
    void el.offsetWidth;
    el.classList.add('is-open');
    pushLayer({ el, box, trigger: trigger || doc.activeElement, trap: true, lock: true, close: (r = true) => closeDialog(el, r) });
  }
  if (cmd) {
    cmdInput = $('.cmd__input', cmd);
    cmdOpts = $$('.cmd__opt', cmd);
    cmdOpts.forEach((o) => { ensureId(o, 'cmd-opt'); o.setAttribute('role', 'option'); o.setAttribute('aria-selected', 'false'); });
    cmdInput.addEventListener('input', cmdFilter);
    cmdInput.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') { e.preventDefault(); cmdSelect(cmdIndex + 1); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); cmdSelect(cmdIndex - 1); }
      else if (e.key === 'Enter') {
        const cur = cmdVisible()[cmdIndex];
        if (cur) { e.preventDefault(); closeDialog(cmd, false); cur.click(); }
      }
    });
    cmdOpts.forEach((o) => o.addEventListener('pointermove', () => { const i = cmdVisible().indexOf(o); if (i !== cmdIndex) cmdSelect(i); }));
  }
  doc.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
      if (!cmd) return;
      e.preventDefault();
      if (layerOf(cmd)) closeDialog(cmd); else openCommand(doc.activeElement);
    }
  });
  doc.addEventListener('click', (e) => {
    const t = e.target.closest('[data-command-open]');
    if (t) { e.preventDefault(); openCommand(t); }
  });

  /* ---- 팝오버 · 메뉴 (트랩 없음, 바깥 클릭 · Esc로 닫힘) -------------------- */
  function placeFloat(el) {
    el.classList.remove('is-flip');
    const r = el.getBoundingClientRect();
    if (r.right > window.innerWidth - 8 || r.left < 8) el.classList.add('is-flip');
  }
  function openFloat(el, trigger, kind, viaKey) {
    if (layerOf(el)) return;
    el.hidden = false;
    trigger.setAttribute('aria-expanded', 'true');
    placeFloat(el);
    const layer = {
      el, box: el, trigger, trap: false, lock: false,
      close: (restore = true) => {
        dropLayer(layer);
        el.hidden = true;
        trigger.setAttribute('aria-expanded', 'false');
        if (restore) trigger.focus({ preventScroll: true });
      },
    };
    pushLayer(layer);
    if (kind === 'menu') {
      const items = menuItems(el);
      if (viaKey && items[0]) items[0].focus();
    } else {
      const f = $('[data-autofocus]', el) || focusables(el)[0];
      if (f && viaKey) f.focus();
    }
  }
  const menuItems = (menu) => $$('[role="menuitem"], [role="menuitemradio"], [role="menuitemcheckbox"]', menu).filter((n) => n.getAttribute('aria-disabled') !== 'true' && !n.disabled);
  let lastPointer = false;
  doc.addEventListener('pointerdown', () => { lastPointer = true; }, true);
  doc.addEventListener('keydown', () => { lastPointer = false; }, true);
  doc.addEventListener('click', (e) => {
    const t = e.target.closest('[data-menu-trigger], [data-popover-trigger]');
    if (!t) return;
    e.preventDefault();
    const el = byId(t.getAttribute('aria-controls'));
    if (!el) return;
    const l = layerOf(el);
    if (l) { l.close(false); return; }
    openFloat(el, t, t.hasAttribute('data-menu-trigger') ? 'menu' : 'pop', !lastPointer || e.detail === 0);
  });
  doc.addEventListener('keydown', (e) => {
    const menu = e.target.closest('[role="menu"]');
    if (menu) {
      const items = menuItems(menu);
      const i = items.indexOf(e.target);
      let n = null;
      if (e.key === 'ArrowDown') n = items[(i + 1) % items.length];
      else if (e.key === 'ArrowUp') n = items[(i - 1 + items.length) % items.length];
      else if (e.key === 'Home') n = items[0];
      else if (e.key === 'End') n = items[items.length - 1];
      else if (e.key === 'Tab') { const l = layerOf(menu); if (l) l.close(false); }
      if (n) { e.preventDefault(); n.focus(); }
      return;
    }
    const trig = e.target.closest('[data-menu-trigger]');
    if (trig && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      e.preventDefault();
      const el = byId(trig.getAttribute('aria-controls'));
      if (el && !layerOf(el)) openFloat(el, trig, 'menu', true);
    }
  });
  doc.addEventListener('click', (e) => {
    const item = e.target.closest('.menu [role^="menuitem"]');
    if (!item || item.hasAttribute('data-keep')) return;
    if (item.getAttribute('aria-disabled') === 'true') { e.preventDefault(); return; }
    const menu = item.closest('.menu');
    if (item.getAttribute('role') === 'menuitemradio') {
      $$('[role="menuitemradio"]', menu).forEach((r) => r.setAttribute('aria-checked', String(r === item)));
    }
    const l = layerOf(menu);
    if (l) l.close(true);
  });

  /* ------------------------------------------------------------------------
     3. 탭 — 자동 활성 · ←/→ · Home/End · 모바일 페이드 힌트
     ------------------------------------------------------------------------ */
  function initTabs(scope = doc) {
    $$('[data-tabs]', scope).forEach((wrap) => {
      if (wrap.dataset.ready) return;
      wrap.dataset.ready = '1';
      const list = $('[role="tablist"]', wrap);
      const tabs = $$('[role="tab"]', list);
      const select = (tab, focus) => {
        tabs.forEach((t) => {
          const on = t === tab;
          t.setAttribute('aria-selected', String(on));
          t.tabIndex = on ? 0 : -1;
          const p = byId(t.getAttribute('aria-controls'));
          if (p) p.hidden = !on;
        });
        if (focus) tab.focus();
        tab.scrollIntoView({ block: 'nearest', inline: 'nearest' });
        wrap.dispatchEvent(new CustomEvent('modak:tab', { bubbles: true, detail: { tab } }));
      };
      const current = tabs.find((t) => t.getAttribute('aria-selected') === 'true') || tabs[0];
      tabs.forEach((t) => {
        const p = byId(t.getAttribute('aria-controls'));
        if (p) { p.setAttribute('role', 'tabpanel'); p.setAttribute('aria-labelledby', ensureId(t, 'tab')); if (!p.hasAttribute('tabindex')) p.tabIndex = 0; }
        t.addEventListener('click', () => select(t, false));
      });
      if (current) {
        tabs.forEach((t) => {
          const on = t === current;
          t.setAttribute('aria-selected', String(on));
          t.tabIndex = on ? 0 : -1;
          const p = byId(t.getAttribute('aria-controls'));
          if (p) p.hidden = !on;
        });
      }
      list.addEventListener('keydown', (e) => {
        const live = tabs.filter((t) => !t.disabled);
        const i = live.indexOf(doc.activeElement);
        if (i < 0) return;
        let n = null;
        if (e.key === 'ArrowRight') n = live[(i + 1) % live.length];
        else if (e.key === 'ArrowLeft') n = live[(i - 1 + live.length) % live.length];
        else if (e.key === 'Home') n = live[0];
        else if (e.key === 'End') n = live[live.length - 1];
        if (n) { e.preventDefault(); select(n, true); }
      });
      const scroller = list.closest('.tabs__scroller');
      if (scroller) {
        const edge = () => scroller.classList.toggle('is-end', list.scrollLeft + list.clientWidth >= list.scrollWidth - 4);
        list.addEventListener('scroll', edge, { passive: true });
        window.addEventListener('resize', edge);
        edge();
      }
    });
  }

  // 앵커 탭 — 패널을 모두 펼쳐 둔 화면에서 문패 줄이 "바로 가기" 역할을 한다. 지금 보이는 구획의 문패에 aria-current
  function initAnchorTabs(scope = doc) {
    $$('[data-anchor-tabs]', scope).forEach((nav) => {
      if (nav.dataset.ready) return;
      nav.dataset.ready = '1';
      const links = $$('a.tabs__tab', nav);
      const set = (a) => links.forEach((l) => (l === a ? l.setAttribute('aria-current', 'true') : l.removeAttribute('aria-current')));
      links.forEach((l) => l.addEventListener('click', () => set(l)));
      if (!('IntersectionObserver' in window)) return;
      const io = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const l = links.find((x) => x.getAttribute('href') === '#' + e.target.id);
          if (!l) return;
          set(l);
          // 문패 줄 안에서만 가로로 맞춘다(창 전체를 끌어올리지 않게 scrollIntoView 금지)
          const list = l.parentElement;
          if (l.offsetLeft + l.offsetWidth > list.scrollLeft + list.clientWidth || l.offsetLeft < list.scrollLeft) list.scrollLeft = l.offsetLeft - 16;
        });
      }, { rootMargin: '-35% 0px -55% 0px' });
      links.forEach((l) => { const t = byId(l.getAttribute('href').slice(1)); if (t) io.observe(t); });
      // 맨 위로 돌아오면 첫 문패
      window.addEventListener('scroll', () => { if (window.scrollY < 120) { set(links[0]); links[0].parentElement.scrollLeft = 0; } }, { passive: true });
    });
  }

  /* ------------------------------------------------------------------------
     4. 아코디언 — [data-accordion="single"]이면 하나만 연다
     ------------------------------------------------------------------------ */
  function initAccordions(scope = doc) {
    $$('[data-accordion]', scope).forEach((acc) => {
      if (acc.dataset.ready) return;
      acc.dataset.ready = '1';
      const single = acc.getAttribute('data-accordion') === 'single';
      $$('.acc__head', acc).forEach((head) => {
        const item = head.closest('.acc__item');
        const panel = byId(head.getAttribute('aria-controls')) || $('.acc__panel', item);
        if (panel) { panel.setAttribute('role', 'region'); panel.setAttribute('aria-labelledby', ensureId(head, 'acc')); }
        const open = head.getAttribute('aria-expanded') === 'true';
        item.classList.toggle('is-open', open);
        if (panel) panel.inert = !open;
        head.addEventListener('click', () => {
          const next = head.getAttribute('aria-expanded') !== 'true';
          if (single && next) {
            $$('.acc__head[aria-expanded="true"]', acc).forEach((h) => {
              if (h === head) return;
              h.setAttribute('aria-expanded', 'false');
              const it = h.closest('.acc__item');
              it.classList.remove('is-open');
              const p = byId(h.getAttribute('aria-controls')) || $('.acc__panel', it);
              if (p) p.inert = true;
            });
          }
          head.setAttribute('aria-expanded', String(next));
          item.classList.toggle('is-open', next);
          if (panel) panel.inert = !next;
        });
      });
    });
  }

  /* ------------------------------------------------------------------------
     5. 토스트 — Modak.toast({ title, text, tone, undo, onUndo, duration })
        [data-toast] 버튼: data-toast-title · data-toast-text · data-toast-tone · data-toast-undo
     ------------------------------------------------------------------------ */
  const TONE_ICON = { ok: 'ok', warn: 'warn', danger: 'danger', info: 'info' };
  function toastRegion() {
    let r = $('.toasts');
    if (!r) {
      r = doc.createElement('div');
      r.className = 'toasts';
      r.setAttribute('aria-live', 'polite');
      r.setAttribute('aria-relevant', 'additions');
      doc.body.appendChild(r);
    }
    return r;
  }
  function toast(opts = {}) {
    const { title = '', text = '', tone = 'ok', undo = '', onUndo = null, duration = 5200 } = opts;
    const region = toastRegion();
    const el = doc.createElement('div');
    el.className = `toast toast--${tone}`;
    el.setAttribute('role', tone === 'danger' ? 'alert' : 'status');
    const safe = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
    el.innerHTML = `<span class="toast__icon">${icon(TONE_ICON[tone] || 'ok')}</span>`
      + `<p class="toast__text">${title ? `<b>${safe(title)}</b>` : ''}${text ? `<span class="toast__sub">${safe(text)}</span>` : ''}</p>`
      + '<div class="toast__actions">'
      + (undo ? `<button type="button" class="toast__undo">${safe(undo)}</button>` : '')
      + `<button type="button" class="btn btn--icon btn--sm toast__close" aria-label="쪽지 닫기">${icon('close')}</button></div>`;
    region.appendChild(el);
    while (region.children.length > 3) region.firstElementChild.remove();
    let timer;
    const dismiss = () => {
      clearTimeout(timer);
      el.classList.add('is-leaving');
      later(180).then(() => el.remove());
    };
    const arm = () => { clearTimeout(timer); if (duration > 0) timer = setTimeout(dismiss, duration); };
    el.addEventListener('mouseenter', () => clearTimeout(timer));
    el.addEventListener('mouseleave', arm);
    el.addEventListener('focusin', () => clearTimeout(timer));
    el.addEventListener('focusout', arm);
    $('.toast__close', el).addEventListener('click', dismiss);
    const u = $('.toast__undo', el);
    if (u) u.addEventListener('click', () => { if (onUndo) onUndo(); dismiss(); toast({ title: '되돌렸어요', tone: 'info', duration: 2600 }); });
    arm();
    return { el, dismiss };
  }
  doc.addEventListener('click', (e) => {
    const t = e.target.closest('[data-toast]');
    if (!t) return;
    toast({
      title: t.getAttribute('data-toast-title') || t.getAttribute('data-toast') || '',
      text: t.getAttribute('data-toast-text') || '',
      tone: t.getAttribute('data-toast-tone') || 'ok',
      undo: t.getAttribute('data-toast-undo') || '',
    });
  });

  /* ------------------------------------------------------------------------
     6. 버튼 로딩 시연 [data-busy-demo="1600"] · 쪽지 닫기 [data-dismiss] · 툴팁 Esc
     ------------------------------------------------------------------------ */
  doc.addEventListener('click', (e) => {
    const b = e.target.closest('[data-busy-demo]');
    if (b && b.getAttribute('aria-busy') !== 'true') {
      const ms = parseInt(b.getAttribute('data-busy-demo'), 10) || 1400;
      b.setAttribute('aria-busy', 'true');
      setTimeout(() => {
        b.removeAttribute('aria-busy');
        const msg = b.getAttribute('data-busy-done');
        if (msg) toast({ title: msg, tone: 'ok' });
      }, ms);
    }
    const d = e.target.closest('[data-dismiss]');
    if (d) {
      const host = d.closest('.note') || d.closest('[data-dismissable]');
      if (host) {
        host.classList.add('is-leaving');
        later(180).then(() => { host.hidden = true; });
      }
    }
  });
  doc.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape' || layers.length) return;
    $$('.tip-wrap').forEach((w) => { if (w.matches(':hover, :focus-within')) w.classList.add('is-muted'); });
  });
  doc.addEventListener('mouseout', (e) => { const w = e.target.closest && e.target.closest('.tip-wrap'); if (w && !w.contains(e.relatedTarget)) w.classList.remove('is-muted'); });
  doc.addEventListener('focusout', (e) => { const w = e.target.closest && e.target.closest('.tip-wrap'); if (w) w.classList.remove('is-muted'); });
  // 꼬리표가 화면 오른쪽 끝을 넘으면 오른쪽 기준으로 뒤집는다(숨은 상태에서도 가로 스크롤을 만들지 않게)
  function flipTips() {
    const vw = doc.documentElement.clientWidth;
    $$('.tip:not(.tip--static)').forEach((t) => {
      t.classList.remove('tip--end');
      if (t.getBoundingClientRect().right > vw - 8) t.classList.add('tip--end');
    });
  }
  flipTips();
  let tipRaf = 0;
  window.addEventListener('resize', () => { cancelAnimationFrame(tipRaf); tipRaf = requestAnimationFrame(flipTips); });

  /* ------------------------------------------------------------------------
     7. 캐러셀 — 이전/다음 · "3 / 8" 카운터 · 가장자리 비활성 · ←/→
     ------------------------------------------------------------------------ */
  function initCarousels(scope = doc) {
    $$('[data-carousel]', scope).forEach((car) => {
      if (car.dataset.ready) return;
      car.dataset.ready = '1';
      const track = $('.carousel__track', car);
      const slides = $$('.carousel__slide', track);
      const prev = $('[data-carousel-prev]', car);
      const next = $('[data-carousel-next]', car);
      const count = $('[data-carousel-count]', car);
      slides.forEach((s, i) => { s.setAttribute('role', 'group'); s.setAttribute('aria-roledescription', '슬라이드'); if (!s.hasAttribute('aria-label')) s.setAttribute('aria-label', `${slides.length}개 중 ${i + 1}번째`); });
      if (!track.hasAttribute('tabindex')) track.tabIndex = 0;
      const currentIndex = () => {
        const left = track.scrollLeft;
        let idx = 0;
        slides.forEach((s, i) => { if (s.offsetLeft - track.offsetLeft <= left + 8) idx = i; });
        return idx;
      };
      const update = () => {
        const max = track.scrollWidth - track.clientWidth - 4;
        const atStart = track.scrollLeft <= 4;
        const atEnd = track.scrollLeft >= max;
        if (prev) prev.disabled = atStart;
        if (next) next.disabled = atEnd;
        car.classList.toggle('is-end', atEnd);
        const idx = atEnd ? slides.length - 1 : currentIndex();
        if (count) count.innerHTML = `<b>${idx + 1}</b> / ${slides.length}`;
      };
      const go = (dir) => {
        const idx = Math.min(slides.length - 1, Math.max(0, currentIndex() + dir));
        track.scrollTo({ left: slides[idx].offsetLeft - track.offsetLeft, behavior: reduced() ? 'auto' : 'smooth' });
      };
      if (prev) prev.addEventListener('click', () => go(-1));
      if (next) next.addEventListener('click', () => go(1));
      track.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
        if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
      });
      let raf;
      track.addEventListener('scroll', () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(update); }, { passive: true });
      window.addEventListener('resize', update);
      update();
    });
  }

  /* ------------------------------------------------------------------------
     8. 달력 — 날짜 고르기, ←/→/↑/↓ 이동. [data-calendar-out]에 선택 결과
     ------------------------------------------------------------------------ */
  function initCalendars(scope = doc) {
    $$('[data-calendar]', scope).forEach((cal) => {
      if (cal.dataset.ready) return;
      cal.dataset.ready = '1';
      const days = $$('.cal__day', cal);
      const out = $('[data-calendar-out]', cal) || byId(cal.getAttribute('data-calendar-out'));
      const pickable = (d) => !d.disabled && !d.classList.contains('is-closed') && !d.classList.contains('is-out');
      const sel = days.find((d) => d.getAttribute('aria-selected') === 'true') || days.find((d) => d.classList.contains('is-today')) || days.find(pickable);
      days.forEach((d) => { d.tabIndex = d === sel ? 0 : -1; if (!d.hasAttribute('aria-selected') && pickable(d)) d.setAttribute('aria-selected', 'false'); });
      cal.addEventListener('click', (e) => {
        const d = e.target.closest('.cal__day');
        if (!d || !pickable(d)) return;
        days.forEach((x) => { if (x.hasAttribute('aria-selected')) x.setAttribute('aria-selected', String(x === d)); x.tabIndex = x === d ? 0 : -1; });
        if (out) out.textContent = d.getAttribute('data-label') || d.getAttribute('aria-label') || d.textContent.trim();
        cal.dispatchEvent(new CustomEvent('modak:date', { bubbles: true, detail: { day: d, value: d.getAttribute('data-date') } }));
      });
      cal.addEventListener('keydown', (e) => {
        const d = e.target.closest('.cal__day');
        if (!d) return;
        const i = days.indexOf(d);
        const step = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: 7, ArrowUp: -7 }[e.key];
        if (step === undefined) return;
        e.preventDefault();
        const n = days[i + step];
        if (n) { d.tabIndex = -1; n.tabIndex = 0; n.focus(); }
      });
    });
  }

  /* ------------------------------------------------------------------------
     9. 표 — 정렬(.table__sort) · 전체 선택(table[data-table-select])
     ------------------------------------------------------------------------ */
  const cellValue = (td) => {
    if (!td) return '';
    const sort = td.getAttribute('data-sort');
    if (sort !== null) { const n = Number(sort); return Number.isNaN(n) ? sort : n; }
    const raw = td.textContent.trim();
    const stripped = raw.replace(/[₩,\s%]|건|팀|명|개|장/g, '');
    return /^-?\d+(\.\d+)?$/.test(stripped) ? Number(stripped) : raw;
  };
  function initTables(scope = doc) {
    $$('.table', scope).forEach((table) => {
      if (table.dataset.ready) return;
      table.dataset.ready = '1';
      const tbody = table.tBodies[0];
      $$('.table__sort', table).forEach((btn) => {
        btn.addEventListener('click', () => {
          const th = btn.closest('th');
          const col = Array.from(th.parentElement.children).indexOf(th);
          const dir = th.getAttribute('aria-sort') === 'ascending' ? 'descending' : 'ascending';
          $$('th[aria-sort]', table).forEach((h) => h.removeAttribute('aria-sort'));
          th.setAttribute('aria-sort', dir);
          const rows = Array.from(tbody.rows);
          rows.sort((a, b) => {
            const x = cellValue(a.cells[col]);
            const y = cellValue(b.cells[col]);
            const c = typeof x === 'number' && typeof y === 'number' ? x - y : String(x).localeCompare(String(y), 'ko');
            return dir === 'ascending' ? c : -c;
          });
          rows.forEach((r) => tbody.appendChild(r));
        });
      });
      if (table.hasAttribute('data-table-select')) {
        const all = $('[data-select-all]', table);
        const boxes = $$('[data-select-row]', table);
        const counter = byId(table.getAttribute('data-selected-count'));
        const sync = () => {
          const n = boxes.filter((b) => b.checked).length;
          boxes.forEach((b) => b.closest('tr').setAttribute('aria-selected', String(b.checked)));
          if (all) { all.checked = n === boxes.length && n > 0; all.indeterminate = n > 0 && n < boxes.length; }
          if (counter) counter.textContent = n ? `${n}건 선택됨` : '';
        };
        if (all) all.addEventListener('change', () => { boxes.forEach((b) => { b.checked = all.checked; }); sync(); });
        boxes.forEach((b) => b.addEventListener('change', sync));
        sync();
      }
    });
  }

  /* ------------------------------------------------------------------------
     10. 칸반 — 끌어 놓기 + 키보드(Space/Enter로 집기 · ←/→ 열 이동 · ↑/↓ 순서 · Space 내려놓기 · Esc 취소)
     ------------------------------------------------------------------------ */
  function initKanban(scope = doc) {
    $$('[data-kanban]', scope).forEach((board) => {
      if (board.dataset.ready) return;
      board.dataset.ready = '1';
      const cols = $$('.board__col', board);
      let live = $('.board__live', board);
      if (!live) { live = doc.createElement('p'); live.className = 'board__live'; live.setAttribute('aria-live', 'assertive'); board.appendChild(live); }
      const colName = (col) => ($('.board__name', col) || {}).textContent || '';
      const cardName = (c) => ($('.board__code', c) || c).textContent.trim();
      // data-more: 견본처럼 일부 카드만 보여 줄 때, 화면 밖 카드 수를 더해 실제 개수를 유지한다
      const recount = () => cols.forEach((c) => { const n = $('.board__n', c); if (n) n.textContent = $$('.board__card', c).length + (+(n.dataset.more || 0)); });
      const say = (m) => { live.textContent = m; };
      $$('.board__card', board).forEach((c) => {
        c.draggable = true;
        if (!c.hasAttribute('tabindex')) c.tabIndex = 0;
        c.setAttribute('aria-roledescription', '옮길 수 있는 카드');
      });
      let dragging = null;
      board.addEventListener('dragstart', (e) => {
        const c = e.target.closest('.board__card');
        if (!c) return;
        dragging = c;
        c.classList.add('is-dragging');
        e.dataTransfer.effectAllowed = 'move';
        try { e.dataTransfer.setData('text/plain', cardName(c)); } catch (err) { /* noop */ }
      });
      board.addEventListener('dragend', () => {
        if (dragging) dragging.classList.remove('is-dragging');
        cols.forEach((c) => c.classList.remove('is-over'));
        dragging = null;
        recount();
      });
      board.addEventListener('dragover', (e) => {
        const list = e.target.closest('.board__list');
        if (!list || !dragging) return;
        e.preventDefault();
        cols.forEach((c) => c.classList.toggle('is-over', c.contains(list)));
        const after = $$('.board__card:not(.is-dragging)', list).find((c) => { const r = c.getBoundingClientRect(); return e.clientY < r.top + r.height / 2; });
        if (after) list.insertBefore(dragging, after); else list.appendChild(dragging);
      });
      board.addEventListener('drop', (e) => {
        e.preventDefault();
        if (dragging) say(`${cardName(dragging)} 카드를 ${colName(dragging.closest('.board__col'))} 칸에 놓았어요.`);
      });
      let grabbed = null; let origin = null;
      board.addEventListener('keydown', (e) => {
        const c = e.target.closest('.board__card');
        if (!c) return;
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          if (grabbed === c) {
            c.classList.remove('is-grabbed'); c.setAttribute('aria-pressed', 'false'); grabbed = null;
            say(`${cardName(c)} 카드를 ${colName(c.closest('.board__col'))} 칸에 내려놓았어요.`);
            recount();
          } else {
            if (grabbed) grabbed.classList.remove('is-grabbed');
            grabbed = c; origin = { list: c.parentElement, next: c.nextElementSibling };
            c.classList.add('is-grabbed'); c.setAttribute('aria-pressed', 'true');
            say(`${cardName(c)} 카드를 집었어요. 화살표로 옮기고 스페이스로 내려놓으세요.`);
          }
          return;
        }
        if (grabbed !== c) return;
        const list = c.parentElement;
        const colIdx = cols.indexOf(c.closest('.board__col'));
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
          e.preventDefault();
          const to = cols[colIdx + (e.key === 'ArrowRight' ? 1 : -1)];
          if (!to) return;
          $('.board__list', to).appendChild(c);
          c.focus();
          say(`${colName(to)} 칸`);
          recount();
        } else if (e.key === 'ArrowUp' && c.previousElementSibling) {
          e.preventDefault(); list.insertBefore(c, c.previousElementSibling); c.focus();
        } else if (e.key === 'ArrowDown' && c.nextElementSibling) {
          e.preventDefault(); list.insertBefore(c.nextElementSibling, c); c.focus();
        } else if (e.key === 'Escape') {
          e.preventDefault(); e.stopPropagation();
          origin.list.insertBefore(c, origin.next);
          c.classList.remove('is-grabbed'); c.setAttribute('aria-pressed', 'false'); grabbed = null; c.focus();
          say('옮기기를 취소했어요.');
          recount();
        }
      });
      recount();
    });
  }

  /* ------------------------------------------------------------------------
     11. 폼 검증 — form[data-validate]. 필수 · 이메일 · 전화 · pattern · minlength · 묶음 필수
         성공 시 data-success / data-success-text 로 토스트
     ------------------------------------------------------------------------ */
  function fieldError(control) {
    if (control.disabled) return '';
    const v = (control.value || '').trim();
    const msg = control.getAttribute('data-error');
    if (control.type === 'checkbox' && control.required && !control.checked) return msg || '확인해 주셔야 다음으로 갈 수 있어요.';
    if (control.required && !v) return msg || '이 칸을 채워 주세요.';
    if (!v) return '';
    if (control.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return control.getAttribute('data-error-format') || '메일 주소 모양을 확인해 주세요. 예: jimin@modak-home.kr';
    if (control.type === 'tel' && !/^0\d{1,2}-?\d{3,4}-?\d{4}$/.test(v)) return control.getAttribute('data-error-format') || '숫자만, 010-0000-0000 모양으로 적어 주세요.';
    if (control.pattern && !new RegExp(`^(?:${control.pattern})$`).test(v)) return control.getAttribute('data-error-format') || msg || '형식을 다시 확인해 주세요.';
    if (control.minLength > 0 && v.length < control.minLength) return control.getAttribute('data-error-format') || `${control.minLength}자 이상 적어 주세요.`;
    return '';
  }
  function showError(field, control, message) {
    let err = $('.field__error', field);
    if (!err) {
      err = doc.createElement('p');
      err.className = 'field__error';
      field.appendChild(err);
    }
    const id = ensureId(err, 'err');
    if (message) {
      err.innerHTML = `${icon('danger')}<span></span>`;
      err.lastElementChild.textContent = message;
    }
    field.classList.toggle('is-invalid', !!message);
    const targets = control ? [control] : $$('input', field);
    targets.forEach((c) => {
      const ids = (c.getAttribute('aria-describedby') || '').split(/\s+/).filter((x) => x && x !== id);
      if (message) { c.setAttribute('aria-invalid', 'true'); ids.push(id); } else c.removeAttribute('aria-invalid');
      if (ids.length) c.setAttribute('aria-describedby', ids.join(' ')); else c.removeAttribute('aria-describedby');
    });
  }
  function validateField(field) {
    if (field.matches('[data-required-group]')) {
      const ok = $$('input', field).some((i) => i.checked);
      showError(field, null, ok ? '' : (field.getAttribute('data-error') || '하나를 골라 주세요.'));
      return ok;
    }
    const control = $('.input, .select, .textarea, input[type="checkbox"][required]', field);
    if (!control) return true;
    const m = fieldError(control);
    showError(field, control, m);
    return !m;
  }
  function initForms(scope = doc) {
    $$('form[data-validate]', scope).forEach((form) => {
      if (form.dataset.ready) return;
      form.dataset.ready = '1';
      form.noValidate = true;
      const fields = () => $$('.field, [data-required-group]', form);
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const bad = fields().filter((f) => !validateField(f));
        if (bad.length) {
          const first = $('[aria-invalid="true"]', bad[0]) || $('input, select, textarea', bad[0]);
          if (first) first.focus();
          toast({ title: `${bad.length}곳을 다시 봐 주세요`, text: '빨간 안내가 붙은 칸이에요.', tone: 'danger', duration: 4000 });
          return;
        }
        const submit = $('[type="submit"]', form);
        if (submit) submit.setAttribute('aria-busy', 'true');
        later(900).then(() => {
          if (submit) submit.removeAttribute('aria-busy');
          toast({ title: form.getAttribute('data-success') || '저장했어요', text: form.getAttribute('data-success-text') || '', tone: 'ok' });
          form.dispatchEvent(new CustomEvent('modak:submitted', { bubbles: true }));
        });
      });
      form.addEventListener('input', (e) => { const f = e.target.closest('.field, [data-required-group]'); if (f && f.classList.contains('is-invalid')) validateField(f); });
      form.addEventListener('change', (e) => { const f = e.target.closest('.field, [data-required-group]'); if (f && f.classList.contains('is-invalid')) validateField(f); });
      form.addEventListener('focusout', (e) => {
        const f = e.target.closest('.field');
        if (f && e.target.value && !f.contains(e.relatedTarget)) validateField(f);
      });
    });
  }

  /* ------------------------------------------------------------------------
     12. 리본 띠 — 그룹 복제 + 정지 버튼
     ------------------------------------------------------------------------ */
  function initRibbons(scope = doc) {
    $$('[data-marquee]', scope).forEach((rb) => {
      if (rb.dataset.ready) return;
      rb.dataset.ready = '1';
      const track = $('.ribbon__track', rb);
      const group = $('.ribbon__group', track);
      if (group && track.children.length === 1) {
        const clone = group.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        track.appendChild(clone);
      }
      const btn = $('[data-marquee-toggle]', rb);
      if (btn) {
        btn.setAttribute('aria-pressed', 'false');
        btn.addEventListener('click', () => {
          const paused = rb.classList.toggle('is-paused');
          btn.setAttribute('aria-pressed', String(paused));
          btn.setAttribute('aria-label', paused ? '리본 띠 다시 흐르게' : '리본 띠 멈추기');
        });
      }
    });
  }

  /* ------------------------------------------------------------------------
     13. 코드 복사 — [data-copy] (가장 가까운 .code 안의 pre)
     ------------------------------------------------------------------------ */
  doc.addEventListener('click', (e) => {
    const b = e.target.closest('[data-copy]');
    if (!b) return;
    const pre = $('pre', b.closest('.code') || doc);
    if (!pre) return;
    const text = pre.innerText;
    const done = () => {
      const label = $('[data-copy-label]', b);
      b.classList.add('is-done');
      if (label) label.textContent = '복사했어요';
      setTimeout(() => { b.classList.remove('is-done'); if (label) label.textContent = '복사'; }, 1600);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, done);
    else {
      const ta = doc.createElement('textarea');
      ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
      doc.body.appendChild(ta); ta.select();
      try { doc.execCommand('copy'); } catch (err) { /* noop */ }
      ta.remove(); done();
    }
  });

  /* ------------------------------------------------------------------------
     14. 진행 — aria-valuenow → --val, .knit__pct / .skein__pct 글자
     ------------------------------------------------------------------------ */
  function setProgress(el, value) {
    const bar = el.matches('[role="progressbar"]') ? el : $('[role="progressbar"]', el);
    if (!bar) return;
    const v = Math.max(0, Math.min(100, Number(value)));
    bar.setAttribute('aria-valuenow', String(v));
    bar.style.setProperty('--val', v);
    const host = bar.closest('.knit, .skein') || bar;
    host.style.setProperty('--val', v);
    const pct = bar.matches('.skein__pct') ? bar : $('.knit__pct, .skein__pct', host);
    if (pct && !pct.hasAttribute('data-static')) pct.innerHTML = `${Math.round(v)}<small>%</small>`;
  }
  function initProgress(scope = doc) {
    $$('[role="progressbar"][aria-valuenow]', scope).forEach((bar) => setProgress(bar, bar.getAttribute('aria-valuenow')));
  }

  /* ------------------------------------------------------------------------
     15. 모션 — 시연 다시 재생 · 방 리빌 · 뷰포트 안에서만 사는 촛불/김
     ------------------------------------------------------------------------ */
  doc.addEventListener('click', (e) => {
    const b = e.target.closest('[data-motion-play]');
    if (!b) return;
    const target = byId(b.getAttribute('data-motion-play'));
    if (!target) return;
    const els = target.matches('.obj, .motion__box') ? [target] : $$('.obj, .motion__box', target);
    els.forEach((el) => { el.classList.remove('is-play', 'is-off'); void el.getBoundingClientRect(); el.classList.add('is-play'); });
  });
  const io = 'IntersectionObserver' in window;
  function initReveal(scope = doc) {
    const items = $$('.reveal:not(.is-in)', scope);
    if (!io || reduced()) { items.forEach((el) => el.classList.add('is-in')); return; }
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('is-in'); obs.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    items.forEach((el) => obs.observe(el));
  }
  function initLiveObjects(scope = doc) {
    if (!io || reduced()) return;
    const objs = $$('.obj', scope).filter((o) => $('.g-flame, .o-steam', o));
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((en) => en.target.classList.toggle('is-live', en.isIntersecting));
    }, { threshold: 0.2 });
    objs.forEach((o) => obs.observe(o));
  }

  /* ------------------------------------------------------------------------
     16. 방 지도 — index에서 지금 보이는 방의 점에 불을 켠다 (aria-current="location")
     ------------------------------------------------------------------------ */
  function initRoomMap() {
    const links = $$('.nav__room[href*="#"]').filter((a) => {
      const u = new URL(a.href, window.location.href);
      return u.pathname === window.location.pathname && byId(u.hash.slice(1));
    });
    if (!links.length || !io) return;
    const map = new Map(links.map((a) => [new URL(a.href).hash.slice(1), a]));
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        links.forEach((a) => a.removeAttribute('aria-current'));
        const a = map.get(en.target.id);
        if (a) a.setAttribute('aria-current', 'location');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    map.forEach((a, id) => obs.observe(byId(id)));
  }

  /* ------------------------------------------------------------------------
     17. 수량 [data-stepper] · 색 고르기 [data-swatch-pick] (data-swatch-target 에 색 열쇠를 건다)
     ------------------------------------------------------------------------ */
  function initSteppers(scope = doc) {
    $$('[data-stepper]', scope).forEach((st) => {
      if (st.dataset.ready) return;
      st.dataset.ready = '1';
      const input = $('input', st);
      const min = Number(input.min || 1);
      const max = Number(input.max || 99);
      const sync = () => {
        const v = Math.max(min, Math.min(max, parseInt(input.value, 10) || min));
        input.value = v;
        $$('[data-step]', st).forEach((b) => { const s = Number(b.getAttribute('data-step')); b.disabled = (s < 0 && v <= min) || (s > 0 && v >= max); });
      };
      st.addEventListener('click', (e) => {
        const b = e.target.closest('[data-step]');
        if (!b) return;
        input.value = (parseInt(input.value, 10) || min) + Number(b.getAttribute('data-step'));
        sync();
        input.dispatchEvent(new Event('change', { bubbles: true }));
      });
      input.addEventListener('change', sync);
      sync();
    });
  }
  function initSwatches(scope = doc) {
    $$('[data-swatch-pick]', scope).forEach((group) => {
      if (group.dataset.ready) return;
      group.dataset.ready = '1';
      const targets = () => $$(group.getAttribute('data-swatch-target') || '[data-swatch-host]');
      const apply = (input) => {
        targets().forEach((t) => {
          t.setAttribute('data-swatch', input.value);
          const room = input.getAttribute('data-room');
          if (room && t.hasAttribute('data-room')) t.setAttribute('data-room', room);
        });
        $$('[data-swatch-name]').forEach((n) => { n.textContent = input.getAttribute('data-name') || input.value; });
      };
      group.addEventListener('change', (e) => { if (e.target.matches('input')) apply(e.target); });
      const checked = $('input:checked', group);
      if (checked) apply(checked);
    });
  }

  /* ---- 시작 ------------------------------------------------------------- */
  function init(scope = doc) {
    paintIcons(scope);
    paintObjects(scope);
    initTabs(scope);
    initAnchorTabs(scope);
    initAccordions(scope);
    initCarousels(scope);
    initCalendars(scope);
    initTables(scope);
    initKanban(scope);
    initForms(scope);
    initRibbons(scope);
    initProgress(scope);
    initSteppers(scope);
    initSwatches(scope);
    initReveal(scope);
    initLiveObjects(scope);
    initScrollHints(scope);
    initScenePick(scope);
  }
  /* 가로로 밀리는 영역의 오른쪽 페이드 — [data-scroll-hint] 래퍼 > 첫 자식이 스크롤 영역.
     넘칠 때만 .is-scrollable, 끝까지 밀면 .is-end (페이드 CSS는 장면/컴포넌트 쪽) */
  function initScrollHints(scope = doc) {
    $$('[data-scroll-hint]', scope).forEach((wrap) => {
      if (wrap.dataset.ready) return;
      wrap.dataset.ready = '1';
      const sc = wrap.firstElementChild;
      if (!sc) return;
      const edge = () => {
        wrap.classList.toggle('is-scrollable', sc.scrollWidth > sc.clientWidth + 4);
        wrap.classList.toggle('is-end', sc.scrollLeft + sc.clientWidth >= sc.scrollWidth - 4);
      };
      sc.addEventListener('scroll', edge, { passive: true });
      window.addEventListener('resize', edge);
      edge();
    });
  }
  init();
  initRoomMap();

  window.Modak = {
    toast,
    setTheme: (t) => setTheme(t === 'dark' ? 'dark' : 'light'),
    setProgress,
    open: (id) => openDialog(byId(id)),
    close: (id) => { const el = byId(id); const l = el && layerOf(el); if (l) l.close(true); },
    init,
    icon,
    objects: Object.keys(OBJECTS),
  };
})();
