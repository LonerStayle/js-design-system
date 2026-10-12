/* ==========================================================================
   윤슬 YUNSEUL · app.js — 바닐라 JS (외부 라이브러리 없음)
   - 테마: URL ?theme= > localStorage > prefers-color-scheme · [data-theme-toggle]
   - 오브젝트(보석·시계 SVG) · 다이얼 게이지 · 아이콘 렌더
   - 모달 / 드로어 / 커맨드 팔레트(⌘K) · 포커스 트랩 · Esc
   - 탭 · 아코디언 · 토스트 · 팝오버 · 메뉴 · 툴팁 · 캐러셀 · 마키 · 페이지네이션
   - 표 정렬·선택 · 달력 · 칸반 드래그/키보드 · 폼 검증 · 버튼 로딩 · 진입 모션 · 플레이트 카운터
   ========================================================================== */
(function () {
  "use strict";

  var doc = document;
  var root = doc.documentElement;
  var STORE_KEY = "yunseul-theme";
  var reduceMQ = window.matchMedia("(prefers-reduced-motion: reduce)");
  var darkMQ = window.matchMedia("(prefers-color-scheme: dark)");

  function $(sel, ctx) { return (ctx || doc).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || doc).querySelectorAll(sel)); }
  function reduced() { return reduceMQ.matches; }
  function on(el, ev, fn, opt) { if (el) el.addEventListener(ev, fn, opt); }
  var uidN = 0;
  function uid(p) { uidN += 1; return (p || "ys") + "-" + uidN; }
  function storeGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function storeSet(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* 저장 불가 환경 */ } }

  root.classList.add("js");

  /* ── 1. 테마 ─────────────────────────────────────────────────────────── */
  function queryTheme() {
    var m = /[?&]theme=(dark|light)\b/.exec(location.search);
    return m ? m[1] : null;
  }
  function resolveTheme() {
    return queryTheme() || storeGet(STORE_KEY) || (darkMQ.matches ? "dark" : "light");
  }
  function applyTheme(t) {
    root.setAttribute("data-theme", t);
    $$("[data-theme-toggle]").forEach(function (b) {
      b.setAttribute("aria-pressed", t === "dark" ? "true" : "false");
      b.setAttribute("aria-label", t === "dark" ? "낮 갤러리 조명으로 바꾸기" : "밤 살롱 조명으로 바꾸기");
    });
  }
  applyTheme(resolveTheme());
  on(darkMQ, "change", function () { if (!queryTheme() && !storeGet(STORE_KEY)) applyTheme(resolveTheme()); });
  doc.addEventListener("click", function (e) {
    var b = e.target.closest("[data-theme-toggle]");
    if (!b) return;
    var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    storeSet(STORE_KEY, next);
    applyTheme(next);
  });

  /* ── 2. 아이콘 (24 그리드, 1px 선) ──────────────────────────────────── */
  var ICONS = {
    search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5 21 21"/>',
    close: '<path d="M5 5l14 14M19 5 5 19"/>',
    plus: '<path d="M12 4v16M4 12h16"/>',
    minus: '<path d="M4 12h16"/>',
    check: '<path d="M4.5 12.5 9.5 17.5 19.5 6.5"/>',
    "chevron-left": '<path d="M15 4 7 12l8 8"/>',
    "chevron-right": '<path d="M9 4l8 8-8 8"/>',
    "chevron-down": '<path d="M4 9l8 8 8-8"/>',
    "chevron-up": '<path d="M4 15l8-8 8 8"/>',
    "arrow-right": '<path d="M3 12h17M14 6l6 6-6 6"/>',
    "arrow-left": '<path d="M21 12H4M10 6l-6 6 6 6"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1 7 17M17 7l2.1-2.1"/>',
    moon: '<path d="M19.5 14.5A8 8 0 0 1 9.5 4.5a8 8 0 1 0 10 10z"/>',
    menu: '<path d="M3 7h18M3 12h18M3 17h12"/>',
    calendar: '<rect x="3.5" y="5" width="17" height="15.5"/><path d="M3.5 9.5h17M8 3v4M16 3v4"/>',
    letter: '<rect x="3" y="5.5" width="18" height="13"/><path d="M3 6l9 7 9-7"/>',
    ledger: '<path d="M5 3.5h14v17H5zM8.5 8h7M8.5 12h7M8.5 16h4"/>',
    board: '<path d="M3.5 4h17v16h-17zM9.5 4v16M15 4v16"/>',
    gem: '<path d="M7 4h10l4 5-9 11L3 9z"/><path d="M3 9h18M9 4l3 16 3-16M7 4l2 5 3-5 3 5 2-5"/>',
    watch: '<circle cx="12" cy="12" r="6.5"/><path d="M9 5.5 9.5 2h5l.5 3.5M9 18.5l.5 3.5h5l.5-3.5M12 8.5V12l2.5 1.5"/>',
    user: '<circle cx="12" cy="8.5" r="4"/><path d="M4 21c1-4.5 4.2-6.5 8-6.5s7 2 8 6.5"/>',
    users: '<circle cx="9" cy="9" r="3.5"/><path d="M2.5 20c.8-3.8 3.4-5.5 6.5-5.5s5.7 1.7 6.5 5.5M15.5 5.6a3.5 3.5 0 0 1 0 6.8M18 14.8c1.8.7 3 2.4 3.5 5.2"/>',
    settings: '<path d="M4 7h10M18 7h2M4 17h2M10 17h10"/><circle cx="16" cy="7" r="2"/><circle cx="8" cy="17" r="2"/>',
    logout: '<path d="M14 4H5v16h9M10 12h11M17 8l4 4-4 4"/>',
    copy: '<rect x="8.5" y="8.5" width="12" height="12"/><path d="M15.5 8.5V3.5h-12v12h5"/>',
    alert: '<path d="M12 3 22 20H2z"/><path d="M12 10v4.5M12 17v.5"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>',
    phone: '<path d="M5 3.5h4l1.5 4.5-2.5 1.5a11 11 0 0 0 6.5 6.5l1.5-2.5 4.5 1.5v4a1.5 1.5 0 0 1-1.6 1.5C10.5 19.6 4.4 13.5 3.5 5.1A1.5 1.5 0 0 1 5 3.5z"/>',
    pause: '<path d="M8.5 5v14M15.5 5v14"/>',
    play: '<path d="M7 4.5v15l12-7.5z"/>',
    more: '<path d="M5 12h.5M12 12h.5M19 12h.5" stroke-width="2"/>',
    filter: '<path d="M3 5h18M6.5 12h11M10 19h4"/>',
    salon: '<path d="M3 20.5h18M5 20.5V9l7-5 7 5v11.5M10 20.5v-6h4v6"/>',
    certificate: '<path d="M4 3.5h16v12H4z"/><path d="M8 8h8M8 11.5h5"/><circle cx="16" cy="18" r="2.5"/><path d="M14.5 20 14 22.5l2-1 2 1-.5-2.5"/>',
    care: '<path d="M12 20.5s-8-4.6-8-10.5A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 8 3c0 5.9-8 10.5-8 10.5z"/>',
    lock: '<rect x="5" y="10.5" width="14" height="10"/><path d="M8 10.5V7a4 4 0 0 1 8 0v3.5"/>',
    external: '<path d="M14 4h6v6M20 4l-9 9M18 14v6H4V6h6"/>',
    drag: '<path d="M9 6h.5M15 6h.5M9 12h.5M15 12h.5M9 18h.5M15 18h.5" stroke-width="2"/>',
    sparkle: '<path d="M12 3v18M3 12h18" stroke-width=".9"/><circle cx="12" cy="12" r="1.5"/>'
  };
  function renderIcons(ctx) {
    $$("[data-icon]", ctx).forEach(function (el) {
      if (el.firstElementChild) return;
      var n = el.getAttribute("data-icon");
      if (!ICONS[n]) return;
      el.classList.add("icon");
      if (!el.hasAttribute("aria-label")) el.setAttribute("aria-hidden", "true");
      el.innerHTML = '<svg viewBox="0 0 24 24" focusable="false">' + ICONS[n] + "</svg>";
    });
  }

  /* ── 3. 오브젝트 — 직접 그린 보석·시계 (viewBox 400) ────────────────── */
  var GEMS = {
    sapphire: ["--obj-sapphire-0", "--obj-sapphire-1", "--obj-sapphire-2", "--obj-sapphire-3"],
    aqua: ["--obj-aqua-0", "--obj-aqua-0", "--obj-aqua-1", "--obj-aqua-2"],
    padparadscha: ["--obj-padpa-0", "--obj-padpa-0", "--obj-padpa-1", "--obj-padpa-2"],
    spinel: ["--obj-spinel-0", "--obj-spinel-0", "--obj-spinel-1", "--obj-spinel-2"],
    diamond: ["--obj-diamond-0", "--obj-diamond-0", "--obj-diamond-1", "--obj-diamond-2"],
    emerald: ["--obj-emerald-0", "--obj-emerald-0", "--obj-emerald-1", "--obj-emerald-2"]
  };
  function v(name) { return "var(" + name + ")"; }
  function stop(off, color, op) {
    return '<stop offset="' + off + '" style="stop-color:' + color + (op != null ? ";stop-opacity:" + op : "") + '"/>';
  }
  function ell(cx, cy, rx, ry) {
    return "M" + (cx - rx) + " " + cy + "a" + rx + " " + ry + " 0 1 0 " + 2 * rx + " 0a" + rx + " " + ry + " 0 1 0 " + -2 * rx + " 0Z";
  }
  function defsCommon(id, gem) {
    var g = GEMS[gem] || GEMS.sapphire;
    return "<defs>" +
      '<linearGradient id="' + id + '-m" x1="0" y1="0" x2="1" y2="0">' +
        stop(0, v("--obj-metal-0")) + stop(0.2, v("--obj-metal-2")) + stop(0.42, v("--obj-metal-1")) +
        stop(0.6, v("--obj-metal-3")) + stop(0.8, v("--obj-metal-1")) + stop(1, v("--obj-metal-0")) +
      "</linearGradient>" +
      '<linearGradient id="' + id + '-md" x1="0" y1="0" x2="1" y2="0">' +
        stop(0, v("--obj-metal-0")) + stop(0.5, v("--obj-metal-1")) + stop(1, v("--obj-metal-0")) +
      "</linearGradient>" +
      '<linearGradient id="' + id + '-mv" x1="0" y1="0" x2="0" y2="1">' +
        stop(0, v("--obj-metal-3")) + stop(0.5, v("--obj-metal-1")) + stop(1, v("--obj-metal-0")) +
      "</linearGradient>" +
      '<radialGradient id="' + id + '-g" cx=".38" cy=".32" r=".78">' +
        stop(0, v(g[3])) + stop(0.34, v(g[2])) + stop(0.72, v(g[1])) + stop(1, v(g[0])) +
      "</radialGradient>" +
      '<radialGradient id="' + id + '-d" cx=".34" cy=".3" r=".8">' +
        stop(0, v("--obj-diamond-2")) + stop(0.5, v("--obj-diamond-1")) + stop(1, v("--obj-diamond-0")) +
      "</radialGradient>" +
      '<linearGradient id="' + id + '-ray" x1="0" y1="0" x2="1" y2="0">' +
        stop(0, v("--obj-glint"), 0) + stop(0.5, v("--obj-glint"), 1) + stop(1, v("--obj-glint"), 0) +
      "</linearGradient>" +
      '<linearGradient id="' + id + '-rayv" x1="0" y1="0" x2="0" y2="1">' +
        stop(0, v("--obj-glint"), 0) + stop(0.5, v("--obj-glint"), 1) + stop(1, v("--obj-glint"), 0) +
      "</linearGradient>" +
      "</defs>";
  }
  function F(id, k) { return "fill:url(#" + id + "-" + k + ")"; }
  function glint(id, x, y, s) {
    s = s || 1;
    return '<g class="o-glint">' +
      '<rect x="' + (x - 22 * s) + '" y="' + (y - 0.6) + '" width="' + 44 * s + '" height="1.2" style="' + F(id, "ray") + '"/>' +
      '<rect x="' + (x - 0.6) + '" y="' + (y - 9 * s) + '" width="1.2" height="' + 18 * s + '" style="' + F(id, "rayv") + '"/>' +
      '<circle cx="' + x + '" cy="' + y + '" r="' + 2.6 * s + '" style="fill:var(--obj-glint)"/></g>';
  }
  var LINE = 'class="o-line" style="stroke:var(--obj-metal-0);stroke-width:.75;fill:none"';
  function band(id, cx, cy, rx, ry) {
    return '<path class="o-fill o-line" fill-rule="evenodd" d="' + ell(cx, cy + 9, rx, ry + 2) + ell(cx, cy - 2, rx - 18, ry - 12) + '" style="' + F(id, "md") + ';stroke:var(--obj-metal-0);stroke-width:.75"/>' +
      '<path class="o-fill o-line" fill-rule="evenodd" d="' + ell(cx, cy, rx, ry) + ell(cx, cy - 4, rx - 18, ry - 12) + '" style="' + F(id, "m") + ';stroke:var(--obj-metal-0);stroke-width:.75"/>';
  }

  function drawRing(id, gem) {
    var s = "";
    s += band(id, 200, 268, 120, 46);
    // 갤러리(스톤 받침)
    s += '<path class="o-fill o-line" d="M152 200 L248 200 L232 232 L168 232Z" style="' + F(id, "m") + ';stroke:var(--obj-metal-0);stroke-width:.75"/>';
    // 헤일로 다이아몬드
    var n = 34, i, a, x, y;
    for (i = 0; i < n; i++) {
      a = (i / n) * Math.PI * 2;
      x = 200 + Math.cos(a) * 72;
      y = 166 + Math.sin(a) * 53;
      s += '<circle class="o-fill o-line" cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="4" style="' + F(id, "d") + ';stroke:var(--obj-metal-0);stroke-width:.6"/>';
    }
    // 쿠션컷 스톤
    s += '<rect class="o-fill o-line" x="142" y="122" width="116" height="88" rx="28" style="' + F(id, "g") + ';stroke:var(--obj-metal-1);stroke-width:1"/>';
    // 패싯
    s += '<g class="o-detail" style="stroke:var(--obj-diamond-1);stroke-opacity:.38;stroke-width:.75;fill:none">' +
      '<rect x="172" y="145" width="56" height="42" rx="10"/>' +
      '<path d="M150 130 172 147M250 130 228 147M150 202 172 185M250 202 228 185M200 122V145M200 210V187M142 166H172M258 166H228M172 145 200 122 228 145M172 187 200 210 228 187"/></g>';
    s += '<path class="o-detail" d="M176 149 Q186 146 196 148 L188 160 Z" style="fill:var(--obj-diamond-2);fill-opacity:.16"/>';
    // 프롱
    [[148, 128], [252, 128], [148, 204], [252, 204]].forEach(function (p) {
      s += '<ellipse class="o-fill o-line" cx="' + p[0] + '" cy="' + p[1] + '" rx="7" ry="6" style="' + F(id, "mv") + ';stroke:var(--obj-metal-0);stroke-width:.5"/>';
    });
    s += glint(id, 182, 150);
    return s;
  }

  /* 라운드 브릴리언트 — 위에서 본 모습(테이블 8각 · 스타 8 · 베젤 8). lite = 작은 알(테이블 + 십자만) */
  function pt(cx, cy, r, deg) { var a = (deg - 90) * Math.PI / 180; return [cx + Math.cos(a) * r, cy + Math.sin(a) * r]; }
  function P(p) { return p[0].toFixed(1) + " " + p[1].toFixed(1); }
  function brilliant(id, cx, cy, R, lite, rimStyle) {
    var s = "", i, tbl = [], star = [], gir = [], d = "", lines = "";
    s += '<circle class="o-fill o-line" cx="' + cx + '" cy="' + cy + '" r="' + R + '" style="' + F(id, "d") + ";" + (rimStyle || "stroke:var(--obj-metal-1);stroke-width:.8") + '"/>';
    for (i = 0; i < 8; i++) {
      tbl.push(pt(cx, cy, R * 0.5, i * 45 + 22.5));
      star.push(pt(cx, cy, R * 0.8, i * 45));
      gir.push(pt(cx, cy, R, i * 45 + 22.5));
    }
    d = "M" + tbl.map(P).join("L") + "Z";
    if (lite) {
      return s + '<path class="o-detail" d="' + d + '" style="fill:var(--obj-diamond-2);fill-opacity:.28;stroke:var(--obj-diamond-0);stroke-opacity:.7;stroke-width:.5"/>';
    }
    for (i = 0; i < 8; i++) {
      var nx = (i + 1) % 8;
      lines += "M" + P(tbl[i]) + "L" + P(star[nx]) + "M" + P(tbl[i]) + "L" + P(star[i]) +
        "M" + P(star[i]) + "L" + P(gir[i]) + "M" + P(star[i]) + "L" + P(gir[(i + 7) % 8]) + "M" + P(tbl[i]) + "L" + P(gir[i]);
    }
    // 스타 패싯 몇 장은 빛을 받아 밝게
    var lit = "";
    [0, 3, 5].forEach(function (k) {
      lit += "M" + P(tbl[(k + 7) % 8]) + "L" + P(star[k]) + "L" + P(tbl[k]) + "Z";
    });
    s += '<path class="o-detail" d="' + lit + '" style="fill:var(--obj-diamond-2);fill-opacity:.55"/>';
    s += '<path class="o-detail" d="' + d + '" style="fill:var(--obj-diamond-1);fill-opacity:.35;stroke:var(--obj-diamond-0);stroke-opacity:.75;stroke-width:.6"/>';
    s += '<path class="o-detail" d="' + lines + '" style="stroke:var(--obj-diamond-0);stroke-opacity:.6;stroke-width:.5;fill:none"/>';
    // 프롱 4개
    [45, 135, 225, 315].forEach(function (deg) {
      var p = pt(cx, cy, R + 0.5, deg);
      s += '<circle class="o-fill o-line" cx="' + p[0].toFixed(1) + '" cy="' + p[1].toFixed(1) + '" r="' + (R * 0.14).toFixed(1) + '" style="' + F(id, "mv") + ';stroke:var(--obj-metal-0);stroke-width:.4"/>';
    });
    return s;
  }

  /* 드롭 이어링 — 스터드(라운드 브릴리언트) → 가는 바일 + 그라데이션 다이아 3알 → 캡 → 드롭(진주 13.2mm 또는 페어컷)
     비례: 스터드 위 y22 ~ 드롭 아래 y378 = 착용 길이 4.2cm. 드롭은 전체의 1/3 이하(116 / 356). */
  function drawDrop(id, gem) {
    var s = "", pearl = !gem || gem === "pearl";
    s += "<defs>" +
      '<radialGradient id="' + id + '-gs" cx=".5" cy=".5" r=".5">' + stop(0, v("--obj-shadow"), 0.75) + stop(1, v("--obj-shadow"), 0) + "</radialGradient>" +
      "</defs>";
    // 접지 그림자 — 드롭 바로 아래 좁은 타원
    s += '<ellipse class="o-detail" cx="200" cy="391" rx="40" ry="4.5" style="fill:url(#' + id + '-gs)"/>';
    // 와이어 — 점프 링부터 캡까지 한 가닥
    s += '<rect class="o-fill o-line" x="199.1" y="84" width="1.8" height="176" style="' + F(id, "mv") + ';stroke:var(--obj-metal-0);stroke-width:.3"/>';
    // 점프 링
    s += '<ellipse class="o-line" cx="200" cy="80" rx="3.6" ry="6" style="stroke:var(--obj-metal-2);stroke-width:1.6;fill:none"/>';
    // 스터드
    s += brilliant(id, 200, 48, 26);
    // 그라데이션 다이아 3알 — 콜렛(금속 테) + 작은 브릴리언트
    [[112, 6.5], [150, 8], [196, 10]].forEach(function (c) {
      s += '<circle class="o-fill o-line" cx="200" cy="' + c[0] + '" r="' + (c[1] + 1.8) + '" style="' + F(id, "m") + ';stroke:var(--obj-metal-0);stroke-width:.4"/>';
      s += brilliant(id, 200, c[0], c[1], true, "stroke:var(--obj-metal-1);stroke-width:.4");
    });
    if (pearl) {
      var pd = "M200 262 C225 262 249 292 249 327 C249 357 227 378 200 378 C173 378 151 357 151 327 C151 292 175 262 200 262Z";
      s += "<defs>" +
        '<radialGradient id="' + id + '-p" cx=".38" cy=".3" r=".82">' + stop(0, v("--obj-pearl-2")) + stop(0.22, v("--obj-pearl-1")) + stop(0.95, v("--obj-pearl-0")) + "</radialGradient>" +
        '<linearGradient id="' + id + '-po" x1="0" y1="0" x2="1" y2="1">' + stop(0, v("--obj-orient-pink"), 0) + stop(0.34, v("--obj-orient-pink"), 0.3) + stop(0.62, v("--obj-orient-green"), 0.22) + stop(1, v("--obj-orient-green"), 0) + "</linearGradient>" +
        '<radialGradient id="' + id + '-pr" cx=".52" cy=".97" r=".46">' + stop(0, v("--obj-pearl-2"), 0.85) + stop(1, v("--obj-pearl-2"), 0) + "</radialGradient>" +
        '<radialGradient id="' + id + '-ph" cx=".5" cy=".5" r=".5">' + stop(0, v("--obj-glint"), 0.95) + stop(0.55, v("--obj-pearl-2"), 0.45) + stop(1, v("--obj-pearl-2"), 0) + "</radialGradient>" +
        "</defs>";
      s += '<path class="o-fill o-line" d="' + pd + '" style="' + F(id, "p") + ';stroke:var(--obj-pearl-0);stroke-width:.6"/>';
      s += '<path class="o-detail" d="' + pd + '" style="fill:url(#' + id + '-po)"/>';
      s += '<path class="o-detail" d="' + pd + '" style="fill:url(#' + id + '-pr)"/>';
      // 좌상단 오프셋 하이라이트 — 창 하나가 비친 모양
      s += '<ellipse class="o-detail" cx="184" cy="304" rx="30" ry="20" transform="rotate(-38 184 304)" style="fill:url(#' + id + '-ph);opacity:.38"/>';
      s += '<ellipse class="o-detail" cx="178" cy="297" rx="13" ry="7.5" transform="rotate(-38 178 297)" style="fill:url(#' + id + '-ph)"/>';
      // 아래 반사광 — 바닥에서 되튄 빛이 얇은 초승달로
      s += '<path class="o-detail" d="M160 350 Q200 386 240 350 Q200 376 160 350Z" style="fill:var(--obj-pearl-1);fill-opacity:.55"/>';
      // 진주 캡 — 작은 꽃받침
      s += '<path class="o-fill o-line" d="M185 268 Q186 256 200 254 Q214 256 215 268 Q200 272 185 268Z" style="' + F(id, "m") + ';stroke:var(--obj-metal-0);stroke-width:.5"/>';
      s += '<path class="o-detail" d="M193 256 L191 269M200 254 V271M207 256 L209 269" style="stroke:var(--obj-metal-0);stroke-opacity:.7;stroke-width:.5;fill:none"/>';
      s += glint(id, 176, 294, 0.55);
    } else {
      var pear = "M200 256 C214 270 246 298 246 332 A46 46 0 0 1 154 332 C154 298 186 270 200 256Z";
      s += '<path class="o-fill o-line" d="' + pear + '" style="' + F(id, "g") + ';stroke:var(--obj-metal-1);stroke-width:.9"/>';
      s += '<g class="o-detail" style="stroke:var(--obj-diamond-1);stroke-opacity:.36;stroke-width:.6;fill:none">' +
        '<path d="M200 284 C210 294 228 312 228 334 A28 28 0 0 1 172 334 C172 312 190 294 200 284Z"/>' +
        '<path d="M200 256V284M154 332H172M246 332H228M200 378V362M166 296 182 312M234 296 218 312M168 366 182 352M232 366 218 352"/></g>';
      s += '<path class="o-detail" d="M178 304 Q186 292 196 290 L190 318Z" style="fill:var(--obj-diamond-2);fill-opacity:.18"/>';
      // 프롱 캡 — 끝을 잡는 V 발톱
      s += '<path class="o-fill o-line" d="M192 252 L200 266 L208 252Z" style="' + F(id, "m") + ';stroke:var(--obj-metal-0);stroke-width:.5"/>';
      s += glint(id, 180, 310, 0.75);
    }
    return s;
  }

  /* 솔리테어 — 가는 밴드 + 캐시드럴 어깨 + 높은 바스켓 위 스톤 하나(에메랄드컷 / 오벌) */
  function drawSolitaire(id, gem, cut) {
    var s = "", cx = 200, cy = 156;
    s += band(id, 200, 270, 112, 42);
    // 캐시드럴 어깨
    s += '<path class="o-fill o-line" d="M132 240 C152 232 168 216 178 196 L186 198 C178 220 162 240 140 252Z" style="' + F(id, "md") + ';stroke:var(--obj-metal-0);stroke-width:.6"/>';
    s += '<path class="o-fill o-line" d="M268 240 C248 232 232 216 222 196 L214 198 C222 220 238 240 260 252Z" style="' + F(id, "md") + ';stroke:var(--obj-metal-0);stroke-width:.6"/>';
    // 바스켓
    s += '<path class="o-fill o-line" d="M180 232 L220 232 L212 198 L188 198Z" style="' + F(id, "m") + ';stroke:var(--obj-metal-0);stroke-width:.6"/>';
    s += '<path class="o-line" d="M184 214 H216" style="stroke:var(--obj-metal-0);stroke-width:.6;fill:none"/>';
    if (cut === "oval") {
      var rx = 54, ry = 40;
      s += '<ellipse class="o-fill o-line" cx="' + cx + '" cy="' + cy + '" rx="' + rx + '" ry="' + ry + '" style="' + F(id, "g") + ';stroke:var(--obj-metal-1);stroke-width:1"/>';
      var ln = "", i, a;
      for (i = 0; i < 12; i++) {
        a = i / 12 * Math.PI * 2;
        ln += "M" + (cx + Math.cos(a) * rx * 0.52).toFixed(1) + " " + (cy + Math.sin(a) * ry * 0.52).toFixed(1) + "L" + (cx + Math.cos(a) * rx).toFixed(1) + " " + (cy + Math.sin(a) * ry).toFixed(1);
      }
      s += '<g class="o-detail" style="stroke:var(--obj-diamond-1);stroke-opacity:.38;stroke-width:.6;fill:none"><ellipse cx="' + cx + '" cy="' + cy + '" rx="' + (rx * 0.52) + '" ry="' + (ry * 0.52) + '"/><path d="' + ln + '"/></g>';
      [[-38, -26], [38, -26], [-38, 26], [38, 26]].forEach(function (p) {
        s += '<ellipse class="o-fill o-line" cx="' + (cx + p[0]) + '" cy="' + (cy + p[1]) + '" rx="5.5" ry="4.6" style="' + F(id, "mv") + ';stroke:var(--obj-metal-0);stroke-width:.5"/>';
      });
      s += glint(id, cx - 18, cy - 14, 0.8);
    } else {
      // 에메랄드컷 — 모서리를 자른 직사각, 계단식 패싯
      var oct = function (k) {
        var w = 52 * k, h = 38 * k, c = 13 * k;
        return "M" + (cx - w + c) + " " + (cy - h) + "H" + (cx + w - c) + "L" + (cx + w) + " " + (cy - h + c) + "V" + (cy + h - c) + "L" + (cx + w - c) + " " + (cy + h) + "H" + (cx - w + c) + "L" + (cx - w) + " " + (cy + h - c) + "V" + (cy - h + c) + "Z";
      };
      s += '<path class="o-fill o-line" d="' + oct(1) + '" style="' + F(id, "g") + ';stroke:var(--obj-metal-1);stroke-width:1"/>';
      s += '<g class="o-detail" style="stroke:var(--obj-diamond-1);stroke-opacity:.42;stroke-width:.6;fill:none"><path d="' + oct(0.78) + '"/><path d="' + oct(0.56) + '"/>' +
        '<path d="M' + (cx - 39) + " " + (cy - 38) + "L" + (cx - 22) + " " + (cy - 21) + "M" + (cx + 39) + " " + (cy - 38) + "L" + (cx + 22) + " " + (cy - 21) + "M" + (cx - 39) + " " + (cy + 38) + "L" + (cx - 22) + " " + (cy + 21) + "M" + (cx + 39) + " " + (cy + 38) + "L" + (cx + 22) + " " + (cy + 21) + '"/></g>';
      s += '<path class="o-detail" d="M' + (cx - 28) + " " + (cy - 20) + "H" + (cx + 6) + "L" + (cx - 6) + " " + (cy - 4) + "H" + (cx - 28) + 'Z" style="fill:var(--obj-diamond-2);fill-opacity:.16"/>';
      [[-47, -33], [47, -33], [-47, 33], [47, 33]].forEach(function (p) {
        s += '<ellipse class="o-fill o-line" cx="' + (cx + p[0]) + '" cy="' + (cy + p[1]) + '" rx="6" ry="5" style="' + F(id, "mv") + ';stroke:var(--obj-metal-0);stroke-width:.5"/>';
      });
      s += glint(id, cx - 22, cy - 18, 0.8);
    }
    return s;
  }

  /* 커프 — 썰물. 위에서 비스듬히 본 열린 커프. 앞면 파베 = 블랙 스피넬 바탕에 다이아몬드 물결 한 줄.
     pave(0–1): 세팅이 끝난 비율 — 나머지는 빈 자리(구멍)만 */
  function drawCuff(id, gem, pave) {
    var s = "", cx = 200, rx = 150, ry = 66, top = 186, bot = 240, i, j, t, x, yT, yB, gap = 0.13;
    pave = pave == null ? 1 : pave;
    var arc = function (cy, t0, t1, n) {
      var d = "", k, tt;
      for (k = 0; k <= n; k++) {
        tt = t0 + (t1 - t0) * k / n;
        d += (k ? "L" : "M") + (cx + Math.cos(tt) * rx).toFixed(1) + " " + (cy + Math.sin(tt) * ry).toFixed(1);
      }
      return d;
    };
    var PI = Math.PI;
    // 뒷벽 안쪽 — 열린 틈(뒤쪽 가운데)을 두고 양쪽
    [[PI, 1.5 * PI - gap * PI], [1.5 * PI + gap * PI, 2 * PI]].forEach(function (r) {
      var a1 = arc(top, r[0], r[1], 24), back = arc(bot, r[1], r[0], 24).replace(/^M/, "L");
      s += '<path class="o-fill o-line" d="' + a1 + back + 'Z" style="fill:var(--obj-spinel-1);stroke:var(--obj-metal-0);stroke-width:.6"/>';
      s += '<path class="o-detail" d="' + a1 + back + 'Z" style="' + F(id, "md") + ';fill-opacity:.42"/>';
      s += '<path class="o-line" d="' + a1 + '" style="stroke:var(--obj-metal-2);stroke-width:1.4;fill:none"/>';
    });
    // 앞면 바깥
    var front = arc(top, 0, PI, 48) + arc(bot, PI, 0, 48).replace(/^M/, "L") + "Z";
    s += '<path class="o-fill o-line" d="' + front + '" style="' + F(id, "m") + ';stroke:var(--obj-metal-0);stroke-width:.8"/>';
    s += '<path class="o-line" d="' + arc(top, 0, PI, 48) + '" style="stroke:var(--obj-metal-3);stroke-width:1.6;fill:none"/>';
    // 파베 — 열 24 × 줄 4
    var cols = 30, rows = 4, stones = "", empty = "";
    var g2 = GEMS[gem] ? gem : "spinel";
    for (i = 0; i < cols; i++) {
      t = 0.1 * PI + (0.8 * PI) * (i + 0.5) / cols;
      x = cx + Math.cos(t) * rx;
      yT = top + Math.sin(t) * ry;
      yB = bot + Math.sin(t) * ry;
      var fs = Math.sin(t), wave = 0.5 + 0.32 * Math.sin(t * 3 + 0.6);
      for (j = 0; j < rows; j++) {
        var vv = (j + 0.5) / rows, y = yT + (yB - yT) * vv, r = 5.6 * (0.4 + 0.6 * fs);
        var isDia = Math.abs(vv - wave) < 0.16;
        var done = (i + 0.5) / cols <= pave;
        if (done) {
          stones += '<ellipse cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" rx="' + (r * (0.55 + 0.45 * fs)).toFixed(2) + '" ry="' + r.toFixed(2) + '" style="' + (isDia ? F(id, "d") : F(id, "g")) + ';stroke:var(--obj-metal-0);stroke-width:.35"/>';
        } else {
          empty += '<ellipse cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" rx="' + (r * 0.5 * (0.55 + 0.45 * fs)).toFixed(2) + '" ry="' + (r * 0.5).toFixed(2) + '" style="fill:var(--obj-metal-0);fill-opacity:.85"/>';
        }
      }
    }
    s += '<g class="o-detail">' + stones + empty + "</g>";
    // 실루엣에서도 읽히는 물결 한 줄
    var wv = "", k2;
    for (k2 = 0; k2 <= 40; k2++) {
      t = 0.1 * PI + 0.8 * PI * k2 / 40;
      var w2 = 0.5 + 0.32 * Math.sin(t * 3 + 0.6);
      wv += (k2 ? "L" : "M") + (cx + Math.cos(t) * rx).toFixed(1) + " " + (top + Math.sin(t) * ry + (bot - top) * w2).toFixed(1);
    }
    s += '<path class="o-line o-sil" d="' + wv + '" style="stroke:currentColor;fill:none"/>';
    // 열린 끝 단면
    [1.5 * PI - gap * PI, 1.5 * PI + gap * PI].forEach(function (tt) {
      var xx = (cx + Math.cos(tt) * rx).toFixed(1);
      s += '<path class="o-line" d="M' + xx + " " + (top + Math.sin(tt) * ry).toFixed(1) + "L" + xx + " " + (bot + Math.sin(tt) * ry).toFixed(1) + '" style="stroke:var(--obj-metal-2);stroke-width:1.2;fill:none"/>';
    });
    s += glint(id, 150, top + Math.sin(0.62 * PI) * ry + 18, 0.75);
    return s;
  }

  /* 브로치 — 물안개. 문스톤 카보숑 하나를 다이아몬드 파베 물안개 세 줄기가 감싼다 */
  function drawBrooch(id) {
    var s = "", wisps = [
      [[62, 300], [120, 338], [214, 312], [258, 252], [300, 196], [326, 132], [352, 86]],
      [[86, 236], [130, 240], [168, 214], [182, 164], [196, 116], [244, 86], [306, 70]],
      [[148, 354], [218, 372], [300, 336], [334, 262]]
    ];
    s += "<defs>" +
      '<radialGradient id="' + id + '-ms" cx=".42" cy=".36" r=".8">' + stop(0, v("--obj-moon-2")) + stop(0.55, v("--obj-moon-1")) + stop(1, v("--obj-moon-0")) + "</radialGradient>" +
      '<radialGradient id="' + id + '-msh" cx=".62" cy=".62" r=".5">' + stop(0, v("--obj-moon-sheen"), 0.75) + stop(1, v("--obj-moon-sheen"), 0) + "</radialGradient>" +
      "</defs>";
    var bez = function (p, t) {
      // 3점·4점 묶음의 연속 큐빅 — p[0] + (c1 c2 p)…
      var segs = (p.length - 1) / 3, k = Math.min(segs - 1, Math.floor(t * segs)), u = t * segs - k;
      var a = p[k * 3], b = p[k * 3 + 1], c = p[k * 3 + 2], d = p[k * 3 + 3], m = 1 - u;
      return [m * m * m * a[0] + 3 * m * m * u * b[0] + 3 * m * u * u * c[0] + u * u * u * d[0], m * m * m * a[1] + 3 * m * m * u * b[1] + 3 * m * u * u * c[1] + u * u * u * d[1]];
    };
    wisps.forEach(function (p, wi) {
      var d = "M" + P(p[0]), k;
      for (k = 1; k < p.length; k += 3) d += "C" + P(p[k]) + " " + P(p[k + 1]) + " " + P(p[k + 2]);
      s += '<path class="o-line" d="' + d + '" style="stroke:url(#' + id + '-md);stroke-width:' + (wi === 2 ? 11 : 15) + ';stroke-linecap:round;fill:none"/>';
      var n = wi === 2 ? 14 : 20, stones = "";
      for (k = 0; k <= n; k++) {
        var tt = k / n, q = bez(p, tt), r = 1.8 + 4.4 * Math.sin(Math.PI * tt);
        stones += '<circle cx="' + q[0].toFixed(1) + '" cy="' + q[1].toFixed(1) + '" r="' + r.toFixed(2) + '" style="' + F(id, "d") + ';stroke:var(--obj-metal-0);stroke-width:.35"/>';
      }
      s += '<g class="o-detail">' + stones + "</g>";
    });
    // 물방울 — 흩어진 단독 다이아
    [[108, 196, 3.2], [292, 300, 2.6], [350, 176, 2.2], [76, 344, 2]].forEach(function (c) {
      s += '<circle class="o-fill o-line" cx="' + c[0] + '" cy="' + c[1] + '" r="' + c[2] + '" style="' + F(id, "d") + ';stroke:var(--obj-metal-1);stroke-width:.4"/>';
    });
    // 문스톤 카보숑 + 베젤
    s += '<ellipse class="o-fill o-line" cx="214" cy="214" rx="54" ry="64" style="' + F(id, "m") + ';stroke:var(--obj-metal-0);stroke-width:.7"/>';
    s += '<ellipse class="o-fill o-line" cx="214" cy="214" rx="47" ry="57" style="fill:url(#' + id + '-ms);stroke:var(--obj-metal-1);stroke-width:.6"/>';
    s += '<ellipse class="o-detail" cx="222" cy="226" rx="36" ry="42" style="fill:url(#' + id + '-msh)"/>';
    s += '<ellipse class="o-detail" cx="196" cy="186" rx="14" ry="8" transform="rotate(-30 196 186)" style="fill:var(--obj-moon-2);fill-opacity:.7"/>';
    s += glint(id, 192, 182, 0.7);
    return s;
  }

  /* 티아라 — 밤바다. 앞에서 본 원호 밴드 위로 일곱 개의 물마루, 가운데 페어셰이프 사파이어 */
  function drawTiara(id) {
    var s = "", cx = 200, rx = 176, ry = 46, by = 268, i, k;
    var bandY = function (x) { var u = (x - cx) / rx; return by + ry * Math.sqrt(Math.max(0, 1 - u * u)); };
    var crestH = function (x) { return 26 + 128 * Math.exp(-Math.pow((x - cx) / 104, 2)); };
    var xs = [34, 58, 84, 110, 136, 168, 200, 232, 264, 290, 316, 342, 366];
    // 짝수 칸 = 물마루(가운데 200 이 가장 높다), 홀수 칸 = 골, 양 끝은 밴드에 붙는다
    var keys = xs.map(function (x, n) {
      var h = n === 0 || n === xs.length - 1 ? 6 : crestH(x) * (n % 2 === 0 ? 1 : 0.42);
      return [x, bandY(x) - 16 - h];
    });
    var topD = "M" + P(keys[0]);
    for (i = 1; i < keys.length; i++) {
      var a = keys[i - 1], b = keys[i], dx = (b[0] - a[0]) / 2;
      topD += "C" + (a[0] + dx).toFixed(1) + " " + a[1].toFixed(1) + " " + (b[0] - dx).toFixed(1) + " " + b[1].toFixed(1) + " " + P(b);
    }
    var bandTop = "", bandBot = "";
    for (k = 0; k <= 40; k++) {
      var x = xs[xs.length - 1] - (xs[xs.length - 1] - xs[0]) * k / 40;
      bandTop += "L" + x.toFixed(1) + " " + (bandY(x) - 16).toFixed(1);
    }
    for (k = 0; k <= 40; k++) {
      var x2 = xs[0] + (xs[xs.length - 1] - xs[0]) * k / 40;
      bandBot += (k ? "L" : "M") + x2.toFixed(1) + " " + bandY(x2).toFixed(1);
    }
    // 투조 몸체 — 마루 선과 밴드 사이
    s += '<path class="o-fill o-line" d="' + topD + bandTop + 'Z" style="' + F(id, "d") + ';fill-opacity:.07;stroke:var(--obj-metal-2);stroke-width:1.1"/>';
    // 안쪽 물결 곡선(금속 선)
    var inner = "M" + P([keys[0][0] + 10, keys[0][1] + 8]);
    for (i = 1; i < keys.length; i++) {
      var a2 = [keys[i - 1][0], (keys[i - 1][1] + bandY(keys[i - 1][0]) - 16) / 2 + 4], b2 = [keys[i][0], (keys[i][1] + bandY(keys[i][0]) - 16) / 2 + 4], dx2 = (b2[0] - a2[0]) / 2;
      inner += "C" + (a2[0] + dx2).toFixed(1) + " " + a2[1].toFixed(1) + " " + (b2[0] - dx2).toFixed(1) + " " + b2[1].toFixed(1) + " " + P(b2);
    }
    s += '<path class="o-line" d="' + inner + '" style="stroke:var(--obj-metal-1);stroke-width:.9;fill:none"/>';
    // 밴드
    s += '<path class="o-fill o-line" d="' + bandBot + bandTop + 'Z" style="' + F(id, "m") + ';stroke:var(--obj-metal-0);stroke-width:.6"/>';
    // 다이아 — 마루 선 따라, 밴드 위 한 줄
    var dia = "";
    var sampleTop = function (x) {
      for (var n = 1; n < keys.length; n++) if (x <= keys[n][0]) {
        var a3 = keys[n - 1], b3 = keys[n], u = (x - a3[0]) / (b3[0] - a3[0]), e = u * u * (3 - 2 * u);
        return a3[1] + (b3[1] - a3[1]) * e;
      }
      return keys[keys.length - 1][1];
    };
    for (k = 0; k <= 46; k++) {
      var xx = 40 + 320 * k / 46, yy = sampleTop(xx) + 5, rr = 2.2 + 2.2 * Math.exp(-Math.pow((xx - cx) / 120, 2));
      dia += '<circle cx="' + xx.toFixed(1) + '" cy="' + yy.toFixed(1) + '" r="' + rr.toFixed(2) + '" style="' + F(id, "d") + ';stroke:var(--obj-metal-0);stroke-width:.3"/>';
    }
    for (k = 0; k <= 34; k++) {
      var bx = 44 + 312 * k / 34;
      dia += '<circle cx="' + bx.toFixed(1) + '" cy="' + (bandY(bx) - 8).toFixed(1) + '" r="2.9" style="' + F(id, "d") + ';stroke:var(--obj-metal-0);stroke-width:.3"/>';
    }
    s += '<g class="o-detail">' + dia + "</g>";
    // 사파이어 — 가운데 페어, 양옆 오벌
    var cy0 = keys[6][1] + 44;
    s += '<path class="o-fill o-line" d="M200 ' + (cy0 - 30) + " C210 " + (cy0 - 18) + " 218 " + (cy0 - 6) + " 218 " + (cy0 + 6) + " A18 18 0 0 1 182 " + (cy0 + 6) + " C182 " + (cy0 - 6) + " 190 " + (cy0 - 18) + " 200 " + (cy0 - 30) + 'Z" style="' + F(id, "g") + ';stroke:var(--obj-metal-2);stroke-width:1"/>';
    [[146, 0.62], [254, 0.62]].forEach(function (p) {
      var yy2 = sampleTop(p[0]) + 30;
      s += '<ellipse class="o-fill o-line" cx="' + p[0] + '" cy="' + yy2.toFixed(1) + '" rx="8" ry="10.5" style="' + F(id, "g") + ';stroke:var(--obj-metal-2);stroke-width:.8"/>';
    });
    s += glint(id, 192, cy0 - 8, 0.8);
    s += glint(id, 120, sampleTop(120) + 5, 0.55);
    return s;
  }

  function drawNecklace(id) {
    var s = "", n = 18, i, t, x, y, r, ang, dy;
    s += '<path class="o-line" d="M64 70 C52 46 46 24 42 4M336 70 C348 46 354 24 358 4" style="stroke:var(--obj-metal-1);stroke-width:1.2;fill:none"/>';
    for (i = 0; i < n; i++) {
      t = i / (n - 1);
      x = 64 + 272 * t;
      y = 70 + 186 * (1 - Math.pow(2 * t - 1, 2));
      r = 8 + 12 * Math.pow(1 - Math.abs(2 * t - 1), 1.1);
      dy = -186 * 2 * (2 * t - 1) * 2 / 272;
      ang = Math.atan(dy) * 180 / Math.PI;
      s += '<g transform="rotate(' + ang.toFixed(1) + " " + x.toFixed(1) + " " + y.toFixed(1) + ')">' +
        '<path class="o-fill o-line" d="M' + (x - r).toFixed(1) + " " + y.toFixed(1) + "A" + r.toFixed(1) + " " + r.toFixed(1) + " 0 0 0 " + (x + r).toFixed(1) + " " + y.toFixed(1) + 'Z" style="' + F(id, "d") + ';stroke:var(--obj-metal-1);stroke-width:.75"/>' +
        '<path class="o-detail" d="M' + (x - r * 0.55).toFixed(1) + " " + y.toFixed(1) + "A" + (r * 0.55).toFixed(1) + " " + (r * 0.55).toFixed(1) + " 0 0 0 " + (x + r * 0.55).toFixed(1) + " " + y.toFixed(1) + '" style="stroke:var(--obj-diamond-0);stroke-opacity:.6;stroke-width:.6;fill:none"/></g>';
    }
    // 페어셰이프 펜던트
    s += '<path class="o-fill o-line" d="M200 276 L200 290" style="stroke:var(--obj-metal-1);stroke-width:1.4"/>';
    s += '<path class="o-fill o-line" d="M200 290 C214 302 226 316 226 334 A26 26 0 0 1 174 334 C174 316 186 302 200 290Z" style="' + F(id, "d") + ';stroke:var(--obj-metal-1);stroke-width:.9"/>';
    s += '<path class="o-detail" d="M200 290V312M174 334H188M226 334H212M200 360V346M188 334 200 312 212 334 200 346Z" style="stroke:var(--obj-diamond-0);stroke-opacity:.55;stroke-width:.6;fill:none"/>';
    s += glint(id, 200, 254, 0.9);
    s += glint(id, 192, 326, 0.7);
    return s;
  }

  function drawBracelet(id) {
    var s = "", n = 34, i, a, x, y, r, back = "", front = "";
    s += '<path class="o-line" d="' + ell(200, 236, 142, 62) + '" style="stroke:var(--obj-metal-1);stroke-width:1.2;fill:none"/>';
    for (i = 0; i < n; i++) {
      a = (i / n) * Math.PI * 2;
      x = 200 + Math.cos(a) * 142;
      y = 236 + Math.sin(a) * 62;
      r = 7.5 + 3.5 * Math.sin(a);
      var c = '<circle class="o-fill o-line" cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="' + r.toFixed(1) + '" style="' + F(id, "d") + ";stroke:var(--obj-metal-1);stroke-width:.6" + (Math.sin(a) < 0 ? ";opacity:.62" : "") + '"/>';
      if (Math.sin(a) < 0) back += c; else front += c;
    }
    s += back + front;
    s += '<rect class="o-fill o-line" x="52" y="226" width="14" height="22" style="' + F(id, "mv") + ';stroke:var(--obj-metal-0);stroke-width:.5"/>';
    s += glint(id, 214, 296, 0.9);
    return s;
  }

  function handLine(cx, cy, deg, len, tail, cls, style) {
    var rad = (deg - 90) * Math.PI / 180;
    var x2 = cx + Math.cos(rad) * len, y2 = cy + Math.sin(rad) * len;
    var x1 = cx - Math.cos(rad) * (tail || 0), y1 = cy - Math.sin(rad) * (tail || 0);
    return '<line class="' + cls + '" x1="' + x1.toFixed(1) + '" y1="' + y1.toFixed(1) + '" x2="' + x2.toFixed(1) + '" y2="' + y2.toFixed(1) + '"' + (style ? ' style="' + style + '"' : "") + "/>";
  }
  function timeAngles(t) {
    var m = /^(\d{1,2}):(\d{2})(?::(\d{2}))?$/.exec(t || "19:40");
    var h = m ? +m[1] : 19, mi = m ? +m[2] : 40, se = m && m[3] ? +m[3] : 0;
    return { h: ((h % 12) + mi / 60) * 30, m: (mi + se / 60) * 6, s: se * 6, sec: se };
  }

  /* 다이얼 — variant: moon(자정 문페이즈 · 기본) / tourbillon(자정 투르비용 · 6시 방향 오픈 케이지, 문페이즈 없음) / nacre(여명 · 자개 다이얼) */
  function drawDial(id, gem, time, variant) {
    var s = "", i, a, r1, r2, x1, y1, x2, y2, ang = timeAngles(time);
    var tb = variant === "tourbillon", nacre = variant === "nacre";
    s += '<defs><radialGradient id="' + id + '-f" cx=".42" cy=".38" r=".75">' +
      (nacre ? stop(0, v("--obj-pearl-2")) + stop(0.55, v("--obj-pearl-1")) + stop(1, v("--obj-pearl-0")) : stop(0, v("--obj-dial-1")) + stop(1, v("--obj-dial-0"))) +
      "</radialGradient>" +
      (nacre ? '<linearGradient id="' + id + '-fo" x1="0" y1="0" x2="1" y2="1">' + stop(0, v("--obj-orient-pink"), 0) + stop(0.4, v("--obj-orient-pink"), 0.32) + stop(0.66, v("--obj-orient-green"), 0.26) + stop(1, v("--obj-orient-green"), 0) + "</linearGradient>" : "") +
      "</defs>";
    // 러그 · 크라운
    s += '<path class="o-fill o-line" d="M150 60 L164 30 H236 L250 60ZM150 340 L164 370 H236 L250 340Z" style="' + F(id, "md") + ';stroke:var(--obj-metal-0);stroke-width:.75"/>';
    s += '<rect class="o-fill o-line" x="352" y="188" width="14" height="24" style="' + F(id, "mv") + ';stroke:var(--obj-metal-0);stroke-width:.5"/>';
    // 케이스
    s += '<circle class="o-fill o-line" cx="200" cy="200" r="156" style="' + F(id, "m") + ';stroke:var(--obj-metal-0);stroke-width:.75"/>';
    s += '<circle class="o-fill o-line" cx="200" cy="200" r="142" style="' + F(id, "f") + ';stroke:var(--obj-metal-1);stroke-width:1"/>';
    if (nacre) s += '<circle class="o-detail" cx="200" cy="200" r="141" style="fill:url(#' + id + '-fo)"/>';
    // 분 눈금 60 · 인덱스 12 (투르비용은 6시 인덱스를 비워 케이지 창을 낸다 · 자개는 다이아몬드 점 인덱스)
    var ticks = "", idx = "", dots = "";
    for (i = 0; i < 60; i++) {
      a = (i * 6 - 90) * Math.PI / 180;
      r1 = 134; r2 = 128;
      if (i % 5 === 0 && !(tb && i === 30)) {
        if (nacre) {
          dots += brilliant(id, +(200 + Math.cos(a) * 118).toFixed(1), +(200 + Math.sin(a) * 118).toFixed(1), i === 0 ? 6 : 4.2, true, "stroke:var(--obj-metal-1);stroke-width:.4");
        } else {
          x1 = 200 + Math.cos(a) * 126; y1 = 200 + Math.sin(a) * 126;
          x2 = 200 + Math.cos(a) * (i === 0 ? 100 : 106); y2 = 200 + Math.sin(a) * (i === 0 ? 100 : 106);
          idx += '<line x1="' + x1.toFixed(1) + '" y1="' + y1.toFixed(1) + '" x2="' + x2.toFixed(1) + '" y2="' + y2.toFixed(1) + '"/>';
        }
      }
      x1 = 200 + Math.cos(a) * r1; y1 = 200 + Math.sin(a) * r1;
      x2 = 200 + Math.cos(a) * r2; y2 = 200 + Math.sin(a) * r2;
      ticks += '<line x1="' + x1.toFixed(1) + '" y1="' + y1.toFixed(1) + '" x2="' + x2.toFixed(1) + '" y2="' + y2.toFixed(1) + '"/>';
    }
    s += '<g class="o-line" style="stroke:' + (nacre ? "var(--obj-metal-0)" : "var(--obj-metal-1)") + ';stroke-width:.75">' + ticks + "</g>";
    if (idx) s += '<g class="o-line" style="stroke:var(--obj-metal-3);stroke-width:3.5">' + idx + "</g>";
    s += dots;
    if (tb) {
      // 6시 방향 오픈 케이지 — 다이얼을 뚫은 창, 그 안에서 1분에 한 바퀴 도는 플라잉 투르비용
      s += '<circle class="o-fill o-line" cx="200" cy="268" r="44" style="fill:var(--obj-shadow);stroke:var(--obj-metal-2);stroke-width:2.2"/>';
      s += '<circle class="o-line" cx="200" cy="268" r="40" style="stroke:var(--obj-metal-0);stroke-width:.6;fill:none"/>';
      s += '<g class="o-second" style="--sec-delay:-' + ang.sec + 's;transform-origin:200px 268px">' +
        '<path class="o-line" d="M200 268 L200 234M200 268 L229.4 285M200 268 L170.6 285" style="stroke:var(--obj-metal-3);stroke-width:3;stroke-linecap:round;fill:none"/>' +
        '<circle class="o-line" cx="200" cy="268" r="22" style="stroke:var(--obj-metal-2);stroke-width:1.6;fill:none"/>' +
        '<path class="o-line" d="M200 246 V290 M178 268 H222" style="stroke:var(--obj-metal-1);stroke-width:.8;fill:none"/>' +
        '<circle class="o-detail" cx="200" cy="246" r="3" style="fill:var(--obj-padpa-1)"/>' +
        '<circle class="o-fill" cx="200" cy="268" r="4" style="fill:var(--obj-metal-3)"/></g>';
    } else if (!nacre) {
      // 문페이즈 창
      s += '<path class="o-fill o-line" d="M168 270 A34 34 0 0 1 232 270 Z" style="fill:var(--obj-sapphire-1);stroke:var(--obj-metal-1);stroke-width:.75"/>';
      s += '<circle class="o-detail" cx="210" cy="258" r="12" style="fill:var(--obj-pearl-1)"/>';
      s += '<circle class="o-detail" cx="216" cy="254" r="11" style="fill:var(--obj-sapphire-1)"/>';
    }
    // 워드마크
    var ink = nacre ? "var(--obj-dial-0)" : "var(--obj-metal-2)";
    s += '<text class="o-detail" x="200" y="' + (tb ? 140 : 150) + '" text-anchor="middle" style="fill:' + ink + ';font-family:Jost,sans-serif;font-size:10px;letter-spacing:4px">YUNSEUL</text>';
    s += '<text class="o-detail" x="200" y="' + (tb ? 154 : 164) + '" text-anchor="middle" style="fill:' + (nacre ? "var(--obj-dial-1)" : "var(--obj-metal-1)") + ';font-family:Cormorant,serif;font-style:italic;font-size:10px;letter-spacing:1px">' + (nacre ? "黎明" : tb ? "子正 · TOURBILLON" : "子正") + "</text>";
    // 바늘 (자개 다이얼 위에서는 짙은 바늘 · 청색 초침)
    var hand = nacre ? "var(--obj-dial-0)" : "var(--obj-metal-3)";
    s += handLine(200, 200, ang.h, 74, 14, "o-line", "stroke:" + hand + ";stroke-width:5");
    s += handLine(200, 200, ang.m, 112, 16, "o-line", "stroke:" + hand + ";stroke-width:3");
    if (!tb) s += '<g class="o-second" style="--sec-delay:-' + ang.sec + 's">' + handLine(200, 200, 0, 126, 26, "o-line", "stroke:" + (nacre ? "var(--obj-sapphire-1)" : "var(--obj-glint)") + ";stroke-width:1") + "</g>";
    s += '<circle class="o-fill" cx="200" cy="200" r="5" style="fill:' + hand + '"/>';
    s += glint(id, 152, 118, 0.8);
    return s;
  }

  /* 펜던트 — 깊은 물: V자로 내려오는 가는 체인 → 베일 → 페어컷 로열블루 사파이어(위가 뾰족) + 다이아 헤일로. 스터드·와이어가 없는 목걸이 */
  function drawPendant(id, gem) {
    var s = "", i, t, x, y;
    // 체인 — 좌우 위 모서리에서 베일로 모이는 V
    var chain = function (x0, y0, x1, y1, n) {
      var out = "", ang = Math.atan2(y1 - y0, x1 - x0) * 180 / Math.PI;
      for (i = 0; i <= n; i++) {
        t = i / n; x = x0 + (x1 - x0) * t; y = y0 + (y1 - y0) * t;
        out += '<ellipse class="o-line" cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" rx="3.4" ry="1.6" transform="rotate(' + (ang + (i % 2 ? 0 : 90) * 0) + " " + x.toFixed(1) + " " + y.toFixed(1) + ')" style="stroke:var(--obj-metal-2);stroke-width:' + (i % 2 ? 1.1 : .8) + ';fill:none"/>';
      }
      return out;
    };
    s += chain(58, 8, 194, 146, 30) + chain(342, 8, 206, 146, 30);
    // 베일 — 세로로 긴 고리
    s += '<path class="o-fill o-line" fill-rule="evenodd" d="M188 150 Q188 138 200 138 Q212 138 212 150 V190 Q212 204 200 204 Q188 204 188 190Z M194 152 Q194 145 200 145 Q206 145 206 152 V186 Q206 196 200 196 Q194 196 194 186Z" style="' + F(id, "mv") + ';stroke:var(--obj-metal-0);stroke-width:.6"/>';
    // 헤일로 — 페어의 둥근 아랫단을 감싸는 작은 다이아 점(옆구리 위로는 가늘어지며 끝난다)
    var halo = "", pts = 32;
    for (i = 0; i < pts; i++) {
      var a = (-14 + 208 * i / (pts - 1)) * Math.PI / 180;
      var hx = 200 + Math.cos(a) * 68, hy = 302 + Math.sin(a) * 68;
      var hr = 4.2 - Math.max(0, -Math.sin(a)) * 6;
      halo += '<circle class="o-fill o-line" cx="' + hx.toFixed(1) + '" cy="' + hy.toFixed(1) + '" r="' + hr.toFixed(1) + '" style="' + F(id, "d") + ';stroke:var(--obj-metal-0);stroke-width:.5"/>';
    }
    s += halo;
    // 페어컷 사파이어 — 위가 뾰족
    var pear = "M200 214 C216 232 258 264 258 302 A58 58 0 0 1 142 302 C142 264 184 232 200 214Z";
    s += '<path class="o-fill o-line" d="' + pear + '" style="' + F(id, "g") + ';stroke:var(--obj-metal-1);stroke-width:1"/>';
    s += '<g class="o-detail" style="stroke:var(--obj-diamond-1);stroke-opacity:.34;stroke-width:.6;fill:none">' +
      '<path d="M200 248 C210 258 230 278 230 302 A30 30 0 0 1 170 302 C170 278 190 258 200 248Z"/>' +
      '<path d="M200 214V248M142 302H170M258 302H230M200 360V332M160 262 178 280M240 262 222 280M162 344 180 326M238 344 220 326"/></g>';
    s += '<path class="o-detail" d="M176 270 Q186 256 196 254 L188 288Z" style="fill:var(--obj-diamond-2);fill-opacity:.18"/>';
    // 꼭지 발톱 + 베일 연결
    s += '<path class="o-fill o-line" d="M192 206 L200 222 L208 206Z" style="' + F(id, "m") + ';stroke:var(--obj-metal-0);stroke-width:.5"/>';
    s += glint(id, 180, 276, 0.8);
    return s;
  }

  function drawSetting(id) {
    var s = "";
    s += band(id, 200, 276, 116, 44);
    // 갤러리 — 받침 고리 둘
    s += '<path class="o-fill o-line" d="M168 238 L232 238 L224 252 L176 252Z" style="' + F(id, "m") + ';stroke:var(--obj-metal-0);stroke-width:.5"/>';
    s += '<path class="o-line" d="' + ell(200, 230, 30, 7) + '" style="stroke:var(--obj-metal-1);stroke-width:1.5;fill:none"/>';
    s += '<path class="o-line" d="' + ell(200, 196, 46, 11) + '" style="stroke:var(--obj-metal-2);stroke-width:1.2;fill:none"/>';
    // 프롱 4개 — 빈 자리를 향해 안으로 굽은 발톱
    s += '<g class="o-line" style="stroke:var(--obj-metal-3);stroke-width:3.2;fill:none;stroke-linecap:round">' +
      '<path d="M174 234 C160 214 152 192 158 168 Q160 160 168 162"/>' +
      '<path d="M226 234 C240 214 248 192 242 168 Q240 160 232 162"/>' +
      '<path d="M190 234 C188 214 186 196 188 176 Q189 170 194 172" style="opacity:.7"/>' +
      '<path d="M210 234 C212 214 214 196 212 176 Q211 170 206 172" style="opacity:.7"/></g>';
    s += glint(id, 162, 166, 0.7);
    return s;
  }

  var DRAW = {
    ring: drawRing, drop: drawDrop, pendant: drawPendant, necklace: drawNecklace, bracelet: drawBracelet, dial: drawDial, watch: drawDial, setting: drawSetting,
    solitaire: function (id, gem, el) { return drawSolitaire(id, gem, el.getAttribute("data-cut")); },
    cuff: function (id, gem, el) { return drawCuff(id, gem, el.hasAttribute("data-pave") ? parseFloat(el.getAttribute("data-pave")) : 1); },
    brooch: drawBrooch, tiara: drawTiara
  };
  // 스스로 접지 그림자를 그리는 오브젝트(공통 바닥 그림자 생략)
  var OWN_GROUND = { drop: 1 };
  function renderObjects(ctx) {
    $$("[data-object]", ctx).forEach(function (el) {
      if (el.querySelector("svg")) return;
      var kind = el.getAttribute("data-object");
      var fn = DRAW[kind];
      if (!fn) return;
      var id = uid("obj");
      var gem = el.getAttribute("data-gem") || (kind === "drop" ? "pearl" : kind === "cuff" ? "spinel" : "sapphire");
      el.classList.add("object", "object--" + kind);
      if (!el.hasAttribute("role")) {
        if (el.hasAttribute("aria-label")) el.setAttribute("role", "img");
        else el.setAttribute("aria-hidden", "true");
      }
      var body = kind === "dial" || kind === "watch" ? fn(id, gem, el.getAttribute("data-time"), el.getAttribute("data-dial")) : fn(id, gem, el);
      el.innerHTML = '<svg viewBox="0 0 400 400" focusable="false" aria-hidden="true">' + defsCommon(id, gem) + body + "</svg>" +
        (el.classList.contains("object--silhouette") || el.getAttribute("data-ground") === "none" || OWN_GROUND[kind] ? "" : '<span class="object__ground" aria-hidden="true"></span>');
    });
  }

  /* ── 4. 다이얼 게이지 ([data-gauge]) ───────────────────────────────── */
  function renderGauges(ctx) {
    $$("[data-gauge]", ctx).forEach(function (el) {
      if (el.querySelector("svg")) return;
      var val = parseFloat(el.getAttribute("data-gauge")) || 0;
      var target = el.hasAttribute("data-target") ? parseFloat(el.getAttribute("data-target")) : null;
      var ang = timeAngles(el.getAttribute("data-time") || "19:40");
      var onN = Math.round(val / 100 * 60);
      var tgtN = target != null ? Math.min(59, Math.round(target / 100 * 60)) : -1;
      var s = '<svg viewBox="0 0 200 200" focusable="false" aria-hidden="true">';
      s += '<circle class="gauge__face" cx="100" cy="100" r="96"/><circle class="gauge__case" cx="100" cy="100" r="96"/>';
      for (var i = 0; i < 60; i++) {
        var a = (i * 6 - 90) * Math.PI / 180, major = i % 5 === 0;
        var r1 = 90, r2 = major ? 76 : 82;
        var cls = "gauge__tick" + (major ? " is-major" : "") + (i < onN ? " is-on" : "") + (i === tgtN ? " is-target" : "");
        s += '<line class="' + cls + '" x1="' + (100 + Math.cos(a) * r1).toFixed(2) + '" y1="' + (100 + Math.sin(a) * r1).toFixed(2) + '" x2="' + (100 + Math.cos(a) * r2).toFixed(2) + '" y2="' + (100 + Math.sin(a) * r2).toFixed(2) + '"/>';
      }
      var label = el.getAttribute("data-gauge-label");
      s += '<text class="gauge__value" x="100" y="138" text-anchor="middle" style="font-size:20px">' + val.toFixed(1) + "%</text>";
      if (label) s += '<text class="gauge__caption" x="100" y="152" text-anchor="middle" style="font-size:7px">' + label + "</text>";
      s += handLine(100, 100, ang.h, 40, 8, "gauge__hand-h");
      s += handLine(100, 100, ang.m, 62, 10, "gauge__hand-m");
      s += '<g class="gauge__second" style="--sec-delay:-' + ang.sec + 's">' + handLine(100, 100, 0, 72, 14, "gauge__hand-s") + "</g>";
      s += '<circle class="gauge__pin" cx="100" cy="100" r="2.5"/></svg>';
      el.classList.add("gauge");
      el.insertAdjacentHTML("afterbegin", s);
    });
  }

  /* ── 5. 진입 모션 · 플레이트 카운터 ─────────────────────────────────── */
  function initReveal() {
    var els = $$("[data-reveal], .glint--sweep");
    if (!els.length) return;
    if (!("IntersectionObserver" in window) || reduced()) {
      els.forEach(function (e) { e.classList.add("is-in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.18, rootMargin: "0px 0px -6% 0px" });
    els.forEach(function (e) { io.observe(e); });
  }

  var ROMAN = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII", "XIV", "XV", "XVI", "XVII", "XVIII", "XIX", "XX"];
  function roman(n) { return ROMAN[n] || String(n); }

  function initCounter() {
    var counter = $("[data-counter]");
    var plates = $$("[data-plate]");
    if (!counter || !plates.length || !("IntersectionObserver" in window)) return;
    var now = $(".counter__now", counter) || counter;
    // 실무형 판(data-dense — 장부·장막·서신·아틀리에·밀착 인화지·삽지)에서는 카운터를 거둔다
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var dense = en.target.hasAttribute("data-dense");
        counter.classList.toggle("is-away", dense);
        if (!dense) now.textContent = en.target.getAttribute("data-plate");
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    plates.forEach(function (p) { io.observe(p); });
  }

  /* 포커스 트랩 — 목록의 처음과 끝에서 감아 돈다. 목록 밖에 있던 포커스는 처음으로 */
  function trapTab(e, list) {
    list = list.filter(Boolean);
    if (!list.length) return;
    var first = list[0], last = list[list.length - 1], cur = doc.activeElement, i = list.indexOf(cur);
    if (i === -1) { e.preventDefault(); (e.shiftKey ? last : first).focus(); return; }
    if (e.shiftKey && cur === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && cur === last) { e.preventDefault(); first.focus(); }
  }

  /* ── 6. 내비 · 사이드바 ─────────────────────────────────────────────── */
  function initNav() {
    var nav = $(".nav");
    if (nav) {
      var navH = function () { return nav.getBoundingClientRect().height || 72; };
      var tick = false;
      var update = function () {
        tick = false;
        nav.classList.toggle("is-solid", window.scrollY > 24);
        // 바로 아래 판이 밤 장면이면 내비도 밤 토큰으로
        var y = navH() / 2, x = Math.min(window.innerWidth - 2, 40);
        var stack = doc.elementsFromPoint ? doc.elementsFromPoint(x, y) : [];
        var under = null;
        for (var i = 0; i < stack.length; i++) {
          if (!nav.contains(stack[i]) && !stack[i].closest(".nav__sheet")) { under = stack[i]; break; }
        }
        var night = under && under.closest("[data-scene='night']");
        var counter = $("[data-counter]");
        if (night) { nav.setAttribute("data-scene", "night"); if (counter) counter.setAttribute("data-scene", "night"); }
        else { nav.removeAttribute("data-scene"); if (counter) counter.removeAttribute("data-scene"); }
      };
      on(window, "scroll", function () { if (!tick) { tick = true; requestAnimationFrame(update); } }, { passive: true });
      on(window, "resize", update);
      update();

      var burger = $(".nav__burger", nav);
      var sheet = burger && doc.getElementById(burger.getAttribute("aria-controls"));
      if (burger && sheet) {
        var closeSheet = function (focus) {
          sheet.hidden = true;
          nav.classList.remove("is-menu-open");
          burger.setAttribute("aria-expanded", "false");
          burger.setAttribute("aria-label", "메뉴 열기");
          root.classList.remove("is-locked");
          if (focus) burger.focus();
        };
        on(burger, "click", function () {
          var open = burger.getAttribute("aria-expanded") === "true";
          if (open) { closeSheet(false); return; }
          sheet.hidden = false;
          nav.classList.add("is-menu-open");
          burger.setAttribute("aria-expanded", "true");
          burger.setAttribute("aria-label", "메뉴 닫기");
          root.classList.add("is-locked");
          var first = $("a, button", sheet);
          if (first) first.focus();
        });
        on(doc, "keydown", function (e) {
          if (sheet.hidden) return;
          if (e.key === "Escape") { closeSheet(true); return; }
          // 포커스 트랩 — 시트 안 + 닫기(햄버거)만 돈다
          if (e.key === "Tab") {
            // 햄버거는 DOM 상 시트 앞이 아니라 워드마크 앞에 있다 — 햄버거 ↔ 시트 첫 항목을 직접 잇는다
            var items = focusables(sheet);
            if (!e.shiftKey && doc.activeElement === burger && items.length) { e.preventDefault(); items[0].focus(); return; }
            if (e.shiftKey && doc.activeElement === items[0]) { e.preventDefault(); burger.focus(); return; }
            trapTab(e, [burger].concat(items));
          }
        });
        on(window, "resize", function () { if (window.innerWidth >= 900 && !sheet.hidden) closeSheet(false); });
      }
    }

    // 내부 도구 사이드바(1024 미만 시트) — 사이드바 하나에 리스너 하나. 연 단추(opener)를 기억했다가 닫힐 때 그쪽으로 포커스를 돌려준다
    var sides = [];
    $$("[data-side-toggle]").forEach(function (btn) {
      var side = doc.getElementById(btn.getAttribute("aria-controls")) || $(".shell > .side");
      if (side && sides.indexOf(side) < 0) sides.push(side);
    });
    sides.forEach(function (side) {
      var toggles = $$("[data-side-toggle]").filter(function (b) {
        return (doc.getElementById(b.getAttribute("aria-controls")) || $(".shell > .side")) === side;
      });
      var scrim = side.parentNode.querySelector(".side-scrim");
      var opener = null;
      var visible = function (el) { return el && el.offsetParent !== null && !side.contains(el); };
      var setOpen = function (open, focusBack) {
        side.classList.toggle("is-open", open);
        if (scrim) scrim.classList.toggle("is-open", open);
        toggles.forEach(function (b) { b.setAttribute("aria-expanded", open ? "true" : "false"); });
        root.classList.toggle("is-locked", open);
        if (open) { var f = $("a, button", side); if (f) f.focus(); return; }
        if (!focusBack) return;
        var back = visible(opener) ? opener : toggles.filter(visible)[0] || $(".shell__menu");
        if (back) back.focus();
        opener = null;
      };
      toggles.forEach(function (btn) {
        on(btn, "click", function () {
          var open = !side.classList.contains("is-open");
          if (open) opener = side.contains(doc.activeElement) ? null : (doc.activeElement === doc.body ? btn : doc.activeElement);
          setOpen(open, true);
        });
      });
      on(scrim, "click", function () { setOpen(false, true); });
      on(doc, "keydown", function (e) {
        if (!side.classList.contains("is-open")) return;
        if (e.key === "Escape") { setOpen(false, true); return; }
        if (e.key === "Tab") trapTab(e, focusables(side));
      });
    });
  }

  /* ── 7. 오버레이 (모달 · 드로어 · 커맨드) — 포커스 트랩 · Esc ────────── */
  var FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
  var stack = [];
  function focusables(el) {
    return $$(FOCUSABLE, el).filter(function (n) { return n.offsetParent !== null || n === doc.activeElement; });
  }
  function openOverlay(el, opener) {
    if (!el || stack.indexOf(el) > -1) return;
    el.hidden = false;
    el._opener = opener || doc.activeElement;
    stack.push(el);
    root.classList.add("is-locked");
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { el.setAttribute("data-state", "open"); });
    });
    var target = $("[data-autofocus]", el) || focusables($("[role='dialog']", el) || el)[0];
    setTimeout(function () { if (target) target.focus(); }, 30);
    el.dispatchEvent(new CustomEvent("overlay:open", { bubbles: true }));
  }
  function closeOverlay(el) {
    if (!el) return;
    var i = stack.indexOf(el);
    if (i < 0) return;
    stack.splice(i, 1);
    el.setAttribute("data-state", "closing");
    var done = function () {
      if (el.getAttribute("data-state") !== "closing") return;
      el.hidden = true;
      el.removeAttribute("data-state");
    };
    setTimeout(done, reduced() ? 0 : 260);
    if (!stack.length) root.classList.remove("is-locked");
    if (el._opener && el._opener.focus) el._opener.focus();
    el.dispatchEvent(new CustomEvent("overlay:close", { bubbles: true }));
  }
  function initOverlays() {
    doc.addEventListener("click", function (e) {
      var opener = e.target.closest("[data-open]");
      if (opener) {
        var t = doc.getElementById(opener.getAttribute("data-open").replace(/^#/, ""));
        if (t) { e.preventDefault(); openOverlay(t, opener); }
        return;
      }
      var closer = e.target.closest("[data-close]");
      if (closer) {
        var ov = closer.closest(".modal, .drawer, .cmd");
        if (ov && !ov.classList.contains("modal--static") && !ov.classList.contains("drawer--static")) { closeOverlay(ov); }
        // 확인 동작 후 토스트
        if (closer.hasAttribute("data-toast")) fireToastFrom(closer);
      }
    });
    doc.addEventListener("keydown", function (e) {
      var top = stack[stack.length - 1];
      if (!top) return;
      if (e.key === "Escape") { e.preventDefault(); closeOverlay(top); return; }
      if (e.key === "Tab") {
        var list = focusables($("[role='dialog']", top) || top);
        if (!list.length) return;
        var first = list[0], last = list[list.length - 1];
        if (e.shiftKey && doc.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && doc.activeElement === last) { e.preventDefault(); first.focus(); }
        else if (!top.contains(doc.activeElement)) { e.preventDefault(); first.focus(); }
      }
    });
  }

  /* ── 8. 커맨드 팔레트 (⌘K / Ctrl+K) ────────────────────────────────── */
  function initCommand() {
    var cmd = $(".cmd:not(.cmd--static)");
    $$(".cmd").forEach(function (c) { setupCmd(c); });
    doc.addEventListener("keydown", function (e) {
      if ((e.metaKey || e.ctrlKey) && (e.key === "k" || e.key === "K")) {
        if (!cmd) return;
        e.preventDefault();
        if (stack.indexOf(cmd) > -1) closeOverlay(cmd); else openOverlay(cmd, doc.activeElement);
      }
    });
    if (cmd) {
      on(cmd, "overlay:open", function () {
        var input = $(".cmd__input", cmd);
        if (input) { input.value = ""; input.dispatchEvent(new Event("input")); }
      });
    }
  }
  /* "~/pages/x.html" 형식은 styles.css 위치(테마 루트) 기준으로 푼다 — index·pages 어디서든 같은 스니펫 */
  function resolveHref(h) {
    if (!h || h.indexOf("~/") !== 0) return h;
    var link = $("link[rel='stylesheet'][href$='styles.css']");
    var base = link ? link.href.replace(/styles\.css(\?.*)?$/, "") : "";
    return base + h.slice(2);
  }
  function escapeHTML(s) { return s.replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function setupCmd(c) {
    var input = $(".cmd__input", c);
    var items = $$(".cmd__item", c);
    var empty = $(".cmd__empty", c);
    if (!input || !items.length) return;
    items.forEach(function (it) {
      var t = $(".cmd__item-title", it);
      if (t && !t.hasAttribute("data-text")) t.setAttribute("data-text", t.textContent);
      if (!it.id) it.id = uid("cmd-opt");
    });
    var active = -1;
    var visible = function () { return items.filter(function (i) { return !i.hidden; }); };
    var setActive = function (idx) {
      var vis = visible();
      items.forEach(function (i) { i.setAttribute("aria-selected", "false"); });
      if (!vis.length) { active = -1; input.removeAttribute("aria-activedescendant"); return; }
      active = (idx + vis.length) % vis.length;
      vis[active].setAttribute("aria-selected", "true");
      input.setAttribute("aria-activedescendant", vis[active].id);
      vis[active].scrollIntoView({ block: "nearest" });
    };
    var filter = function () {
      var q = input.value.trim().toLowerCase();
      items.forEach(function (it) {
        var t = $(".cmd__item-title", it);
        var hay = (it.textContent + " " + (it.getAttribute("data-keywords") || "")).toLowerCase();
        var hit = !q || hay.indexOf(q) > -1;
        it.hidden = !hit;
        if (t) {
          var raw = t.getAttribute("data-text");
          var k = q ? raw.toLowerCase().indexOf(q) : -1;
          t.innerHTML = k > -1 ? escapeHTML(raw.slice(0, k)) + "<mark>" + escapeHTML(raw.slice(k, k + q.length)) + "</mark>" + escapeHTML(raw.slice(k + q.length)) : escapeHTML(raw);
        }
      });
      $$(".cmd__group", c).forEach(function (g) { g.hidden = !$$(".cmd__item", g).some(function (i) { return !i.hidden; }); });
      if (empty) empty.hidden = visible().length > 0;
      setActive(0);
    };
    on(input, "input", filter);
    on(input, "keydown", function (e) {
      if (e.key === "ArrowDown") { e.preventDefault(); setActive(active + 1); }
      else if (e.key === "ArrowUp") { e.preventDefault(); setActive(active - 1); }
      else if (e.key === "Enter") {
        var vis = visible();
        if (vis[active]) { e.preventDefault(); activate(vis[active]); }
      }
    });
    items.forEach(function (it) {
      on(it, "click", function () { activate(it); });
      on(it, "mousemove", function () { var vis = visible(); var i = vis.indexOf(it); if (i !== active) setActive(i); });
    });
    function activate(it) {
      if (it.getAttribute("aria-disabled") === "true") return;
      var href = resolveHref(it.getAttribute("data-href"));
      if (href) { location.href = href; return; }
      if (!c.classList.contains("cmd--static")) closeOverlay(c);
      if (it.hasAttribute("data-toast")) fireToastFrom(it);
    }
    if (input.value) filter(); else setActive(0);
  }

  /* ── 9. 탭 ───────────────────────────────────────────────────────────── */
  function updateOverflow(bar, list) {
    var max = list.scrollWidth - list.clientWidth;
    if (max <= 2) { bar.removeAttribute("data-overflow"); return; }
    var x = list.scrollLeft;
    bar.setAttribute("data-overflow", x <= 2 ? "end" : x >= max - 2 ? "start" : "both");
  }
  function initTabs() {
    $$("[role='tablist']").forEach(function (list) {
      var tabs = $$("[role='tab']", list);
      var bar = list.closest(".tabs__bar");
      var select = function (tab, focus) {
        tabs.forEach(function (t) {
          var sel = t === tab;
          t.setAttribute("aria-selected", sel ? "true" : "false");
          t.tabIndex = sel ? 0 : -1;
          var p = doc.getElementById(t.getAttribute("aria-controls"));
          if (p) p.hidden = !sel;
        });
        if (focus) tab.focus();
        tab.scrollIntoView({ block: "nearest", inline: "nearest" });
        list.dispatchEvent(new CustomEvent("tabs:change", { bubbles: true, detail: { tab: tab } }));
      };
      tabs.forEach(function (t, i) {
        if (t.getAttribute("aria-selected") !== "true") t.tabIndex = -1;
        on(t, "click", function () { if (!t.disabled) select(t, false); });
        on(t, "keydown", function (e) {
          var enabled = tabs.filter(function (x) { return !x.disabled; });
          var k = enabled.indexOf(t), n = null;
          if (e.key === "ArrowRight") n = enabled[(k + 1) % enabled.length];
          else if (e.key === "ArrowLeft") n = enabled[(k - 1 + enabled.length) % enabled.length];
          else if (e.key === "Home") n = enabled[0];
          else if (e.key === "End") n = enabled[enabled.length - 1];
          if (n) { e.preventDefault(); select(n, true); }
        });
      });
      if (bar) {
        updateOverflow(bar, list);
        on(list, "scroll", function () { updateOverflow(bar, list); }, { passive: true });
        on(window, "resize", function () { updateOverflow(bar, list); });
      }
    });
  }

  /* ── 10. 아코디언 ───────────────────────────────────────────────────── */
  function initAccordion() {
    $$(".acc__trigger").forEach(function (btn) {
      var item = btn.closest(".acc__item");
      var panel = doc.getElementById(btn.getAttribute("aria-controls"));
      var set = function (open) {
        btn.setAttribute("aria-expanded", open ? "true" : "false");
        item.classList.toggle("is-open", open);
        if (panel) { panel.inert = !open; panel.setAttribute("aria-hidden", open ? "false" : "true"); }
      };
      set(btn.getAttribute("aria-expanded") === "true");
      on(btn, "click", function () {
        if (btn.disabled || btn.getAttribute("aria-disabled") === "true") return;
        var open = btn.getAttribute("aria-expanded") !== "true";
        var acc = btn.closest(".acc");
        if (open && acc && acc.hasAttribute("data-single")) {
          $$(".acc__trigger[aria-expanded='true']", acc).forEach(function (o) { if (o !== btn) o.click(); });
        }
        set(open);
      });
    });
  }

  /* ── 11. 토스트 ─────────────────────────────────────────────────────── */
  function toaster() {
    var t = $(".toaster");
    if (!t) {
      t = doc.createElement("div");
      t.className = "toaster";
      t.setAttribute("role", "region");
      t.setAttribute("aria-label", "알림");
      doc.body.appendChild(t);
    }
    if (!$("[data-toast-live]", t)) {
      var live = doc.createElement("div");
      live.className = "vh";
      live.setAttribute("aria-live", "polite");
      live.setAttribute("data-toast-live", "");
      t.appendChild(live);
    }
    return t;
  }
  function toast(opts) {
    opts = opts || {};
    var host = toaster();
    var el = doc.createElement("div");
    var tone = opts.tone || "success";
    el.className = "toast toast--" + tone;
    var label = opts.label || { success: "기록됨", warning: "확인 필요", danger: "실패", info: "안내" }[tone] || "알림";
    el.innerHTML = '<span class="toast__label">' + escapeHTML(label) + '</span><p class="toast__text">' + escapeHTML(opts.text || "") + "</p>" +
      '<button type="button" class="btn btn--ghost btn--icon toast__close" aria-label="알림 닫기"><span data-icon="close"></span></button>';
    host.appendChild(el);
    renderIcons(el);
    var live = $("[data-toast-live]", host);
    if (live) live.textContent = label + " — " + (opts.text || "");
    var timer, remaining = opts.duration || 6000, started = Date.now();
    var leave = function () {
      clearTimeout(timer);
      el.classList.add("is-leaving");
      setTimeout(function () { el.remove(); }, reduced() ? 0 : 240);
    };
    var start = function () { started = Date.now(); timer = setTimeout(leave, remaining); };
    on(el, "mouseenter", function () { clearTimeout(timer); remaining -= Date.now() - started; });
    on(el, "mouseleave", start);
    on($(".toast__close", el), "click", leave);
    start();
    return el;
  }
  function fireToastFrom(el) {
    toast({ text: el.getAttribute("data-toast"), tone: el.getAttribute("data-toast-tone") || "success", label: el.getAttribute("data-toast-label") || undefined });
  }
  function initToasts() {
    doc.addEventListener("click", function (e) {
      var b = e.target.closest("[data-toast]");
      if (!b || b.closest("[data-close]") === b || b.classList.contains("cmd__item")) return;
      if (b.hasAttribute("data-busy")) return; // 로딩 버튼은 완료 후 띄운다
      fireToastFrom(b);
    });
    $$(".toast--static .toast__close").forEach(function (b) {
      on(b, "click", function () { b.closest(".toast").hidden = true; });
    });
  }

  /* ── 12. 팝오버 · 메뉴 · 툴팁 ──────────────────────────────────────── */
  var openPop = null;
  function closePop(focus) {
    if (!openPop) return;
    var p = openPop;
    openPop = null;
    p.panel.hidden = true;
    p.trigger.setAttribute("aria-expanded", "false");
    if (focus) p.trigger.focus();
  }
  function initPopovers() {
    $$("[data-popover], [data-menu]").forEach(function (tr) {
      var panel = doc.getElementById(tr.getAttribute("aria-controls"));
      if (!panel) return;
      var isMenu = tr.hasAttribute("data-menu");
      tr.setAttribute("aria-expanded", "false");
      panel.hidden = true;
      var items = function () { return $$("[role^='menuitem']:not([aria-disabled='true'])", panel); };
      var open = function (focusIdx) {
        if (openPop && openPop.panel !== panel) closePop(false);
        panel.hidden = false;
        tr.setAttribute("aria-expanded", "true");
        openPop = { panel: panel, trigger: tr };
        if (isMenu) {
          var list = items();
          if (list.length) list[focusIdx === -1 ? list.length - 1 : 0].focus();
        }
      };
      on(tr, "click", function (e) {
        e.stopPropagation();
        if (tr.getAttribute("aria-expanded") === "true") closePop(false); else open(0);
      });
      on(tr, "keydown", function (e) {
        if (!isMenu) return;
        if (e.key === "ArrowDown") { e.preventDefault(); open(0); }
        if (e.key === "ArrowUp") { e.preventDefault(); open(-1); }
      });
      if (isMenu) {
        on(panel, "keydown", function (e) {
          var list = items(), i = list.indexOf(doc.activeElement);
          if (e.key === "ArrowDown") { e.preventDefault(); list[(i + 1) % list.length].focus(); }
          else if (e.key === "ArrowUp") { e.preventDefault(); list[(i - 1 + list.length) % list.length].focus(); }
          else if (e.key === "Home") { e.preventDefault(); list[0].focus(); }
          else if (e.key === "End") { e.preventDefault(); list[list.length - 1].focus(); }
          else if (e.key === "Tab") { closePop(false); }
        });
        on(panel, "click", function (e) {
          var it = e.target.closest("[role^='menuitem']");
          if (!it || it.getAttribute("aria-disabled") === "true") return;
          if (it.getAttribute("role") === "menuitemradio") {
            $$("[role='menuitemradio']", panel).forEach(function (r) { r.setAttribute("aria-checked", r === it ? "true" : "false"); });
            var out = tr.querySelector("[data-menu-value]");
            if (out) out.textContent = (it.querySelector(".menu__text") || it).textContent.trim();
          }
          if (it.hasAttribute("data-toast")) fireToastFrom(it);
          if (it.tagName !== "A") closePop(true);
        });
      }
    });
    doc.addEventListener("click", function (e) {
      if (openPop && !openPop.panel.contains(e.target) && !openPop.trigger.contains(e.target)) closePop(false);
    });
    doc.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && openPop && !stack.length) { closePop(true); }
    });
    // 툴팁 Esc
    doc.addEventListener("keydown", function (e) {
      if (e.key !== "Escape") return;
      $$(".tip").forEach(function (t) {
        if (t.matches(":hover") || t.contains(doc.activeElement)) t.classList.add("is-dismissed");
      });
    });
    $$(".tip").forEach(function (t) {
      var reset = function () { t.classList.remove("is-dismissed"); };
      on(t, "mouseleave", reset);
      on(t, "focusout", reset);
    });
  }

  /* ── 13. 캐러셀 ─────────────────────────────────────────────────────── */
  function initCarousels() {
    $$("[data-carousel]").forEach(function (car) {
      var track = $(".carousel__track", car);
      var slides = $$(".carousel__slide", car);
      if (!track || !slides.length) return;
      var n = slides.length, i = 0;
      var prev = $(".carousel__prev", car), next = $(".carousel__next", car);
      var now = $(".carousel__now", car), total = $(".carousel__total", car);
      var prog = $(".carousel__progress", car);
      var play = $(".carousel__play", car);
      var live = $(".carousel__live", car);
      var delay = parseInt(car.getAttribute("data-autoplay"), 10) || 0;
      var timer = null, hovering = false;
      if (total) total.textContent = roman(n);
      slides.forEach(function (s, k) {
        s.setAttribute("role", "group");
        s.setAttribute("aria-roledescription", "슬라이드");
        if (!s.hasAttribute("aria-label")) s.setAttribute("aria-label", (k + 1) + " / " + n);
      });
      var go = function (k, announce) {
        i = (k + n) % n;
        track.style.translate = (-100 * i) + "% 0";
        slides.forEach(function (s, j) { s.setAttribute("aria-hidden", j === i ? "false" : "true"); s.inert = j !== i; });
        if (now) now.textContent = roman(i + 1);
        if (prog) prog.style.setProperty("--glint-x", (n > 1 ? 100 - (i / (n - 1)) * 100 : 50) + "%");
        if (live && announce) live.textContent = slides[i].getAttribute("aria-label");
      };
      var stop = function () { clearInterval(timer); timer = null; };
      var start = function () {
        stop();
        if (!delay || reduced() || (play && play.getAttribute("aria-pressed") !== "true")) return;
        timer = setInterval(function () { if (!hovering) go(i + 1, false); }, delay);
      };
      on(prev, "click", function () { go(i - 1, true); start(); });
      on(next, "click", function () { go(i + 1, true); start(); });
      on(car, "keydown", function (e) {
        if (e.target.closest("input, textarea, select")) return;
        if (e.key === "ArrowRight") { e.preventDefault(); go(i + 1, true); start(); }
        if (e.key === "ArrowLeft") { e.preventDefault(); go(i - 1, true); start(); }
      });
      on(car, "mouseenter", function () { hovering = true; });
      on(car, "mouseleave", function () { hovering = false; });
      on(car, "focusin", function () { hovering = true; });
      on(car, "focusout", function () { hovering = false; });
      if (play) {
        if (!delay || reduced()) play.setAttribute("aria-pressed", "false");
        on(play, "click", function () {
          var p = play.getAttribute("aria-pressed") === "true";
          play.setAttribute("aria-pressed", p ? "false" : "true");
          play.setAttribute("aria-label", p ? "자동 넘김 켜기" : "자동 넘김 멈추기");
          start();
        });
      }
      // 스와이프
      var sx = null;
      on(track, "pointerdown", function (e) { sx = e.clientX; });
      on(track, "pointerup", function (e) {
        if (sx == null) return;
        var dx = e.clientX - sx; sx = null;
        if (Math.abs(dx) > 48) { go(dx < 0 ? i + 1 : i - 1, true); start(); }
      });
      go(parseInt(car.getAttribute("data-start"), 10) || 0, false);
      start();
    });
  }

  /* ── 14. 마키 (28px/s) ─────────────────────────────────────────────── */
  function initMarquees() {
    $$("[data-marquee]").forEach(function (m) {
      var track = $(".marquee__track", m);
      var group = track && $(".marquee__group", track);
      if (!group) return;
      if ($$(".marquee__group", track).length < 2) {
        var clone = group.cloneNode(true);
        clone.setAttribute("aria-hidden", "true");
        track.appendChild(clone);
      }
      var speed = parseFloat(m.getAttribute("data-speed")) || 28;
      var setDur = function () { m.style.setProperty("--marquee-dur", (group.getBoundingClientRect().width / speed).toFixed(1) + "s"); };
      setDur();
      if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(setDur);
    });
  }

  /* ── 15. 페이지네이션 ──────────────────────────────────────────────── */
  function initPagers() {
    $$("[data-pager]").forEach(function (p) {
      var total = parseInt(p.getAttribute("data-total"), 10) || 1;
      var cur = parseInt(p.getAttribute("data-current"), 10) || 1;
      var prev = $(".pager__prev", p), next = $(".pager__next", p);
      var curEl = $(".pager__cur", p), totEl = $(".pager__total", p);
      var forId = p.getAttribute("data-pager-for");
      var target = forId && doc.getElementById(forId);
      var render = function () {
        if (curEl) curEl.textContent = cur;
        if (totEl) totEl.textContent = total;
        if (prev) prev.disabled = cur <= 1;
        if (next) next.disabled = cur >= total;
        p.setAttribute("data-current", cur);
        if (target) $$("[data-page]", target).forEach(function (r) { r.hidden = String(cur) !== r.getAttribute("data-page"); });
        p.dispatchEvent(new CustomEvent("pager:change", { bubbles: true, detail: { page: cur } }));
      };
      on(prev, "click", function () { if (cur > 1) { cur -= 1; render(); } });
      on(next, "click", function () { if (cur < total) { cur += 1; render(); } });
      render();
    });
  }

  /* ── 16. 표 — 정렬 · 선택 ──────────────────────────────────────────── */
  function cellValue(td, type) {
    var raw = (td.getAttribute("data-value") || td.textContent).trim();
    if (type === "num") { var n = parseFloat(raw.replace(/[^\d.-]/g, "")); return isNaN(n) ? -Infinity : n; }
    return raw;
  }
  function initTables() {
    $$(".table").forEach(function (table) {
      var tbody = table.tBodies[0];
      if (!tbody) return;
      $$("th .table__sort", table).forEach(function (btn) {
        var th = btn.closest("th");
        on(btn, "click", function () {
          var idx = Array.prototype.indexOf.call(th.parentNode.children, th);
          var type = th.getAttribute("data-type") || "text";
          var dir = th.getAttribute("aria-sort") === "ascending" ? "descending" : "ascending";
          $$("th[aria-sort]", table).forEach(function (o) { if (o !== th) o.setAttribute("aria-sort", "none"); });
          th.setAttribute("aria-sort", dir);
          var rows = $$("tr", tbody).filter(function (r) { return !r.classList.contains("table__empty"); });
          rows.sort(function (a, b) {
            var x = cellValue(a.children[idx], type), y = cellValue(b.children[idx], type);
            var r = type === "num" ? x - y : String(x).localeCompare(String(y), "ko");
            return dir === "ascending" ? r : -r;
          });
          rows.forEach(function (r) { tbody.appendChild(r); });
          var live = table.parentNode.querySelector("[data-sort-live]");
          if (live) live.textContent = btn.textContent.trim() + " 기준 " + (dir === "ascending" ? "오름차순" : "내림차순") + " 정렬";
        });
      });
      var all = $("thead .t-check input", table);
      var boxes = function () { return $$("tbody .t-check input", table); };
      var count = table.closest("section, .table-block, body").querySelector("[data-select-count]");
      var sync = function () {
        var b = boxes(), n = 0;
        b.forEach(function (x) {
          var tr = x.closest("tr");
          tr.setAttribute("aria-selected", x.checked ? "true" : "false");
          if (x.checked) n += 1;
        });
        if (all) { all.checked = n === b.length && n > 0; all.indeterminate = n > 0 && n < b.length; }
        if (count) count.textContent = n ? n + "건 선택" : "선택 없음";
      };
      on(table, "change", function (e) {
        if (e.target === all) boxes().forEach(function (x) { x.checked = all.checked; });
        sync();
      });
      if (boxes().length) sync();
    });
  }

  /* ── 17. 달력 ──────────────────────────────────────────────────────── */
  var DOW = ["일", "월", "화", "수", "목", "금", "토"];
  function parseList(s) {
    var out = [];
    (s || "").split(",").forEach(function (p) {
      p = p.trim();
      if (!p) return;
      var m = /^(\d+)-(\d+)$/.exec(p);
      if (m) { for (var k = +m[1]; k <= +m[2]; k++) out.push(k); } else out.push(+p);
    });
    return out;
  }
  function initCalendars() {
    $$("[data-calendar]").forEach(function (cal) {
      var y = parseInt(cal.getAttribute("data-year"), 10) || 2026;
      var m = parseInt(cal.getAttribute("data-month"), 10) || 11;
      var baseY = y, baseM = m;
      var sel = parseInt(cal.getAttribute("data-selected"), 10) || null;
      var selKey = sel ? y + "-" + m + "-" + sel : null;
      var today = cal.getAttribute("data-today") || "2026-11-20";
      var booked = parseList(cal.getAttribute("data-booked"));
      var range = parseList(cal.getAttribute("data-range"));
      var rangeNext = parseList(cal.getAttribute("data-range-next"));
      var offDay = cal.hasAttribute("data-off") ? parseInt(cal.getAttribute("data-off"), 10) : 1;
      var disableOff = cal.hasAttribute("data-disable-off");
      var minDay = cal.getAttribute("data-min");
      var name = cal.getAttribute("data-name") || "날짜";
      var out = $("[data-cal-output]", cal.parentNode) || $("[data-cal-output]", cal);
      cal.classList.add("cal");
      var html = '<div class="cal__head"><p class="cal__month" aria-live="polite"></p><div class="cal__nav">' +
        '<button type="button" class="btn btn--ghost btn--icon cal__prev" aria-label="이전 달"><span data-icon="chevron-left"></span></button>' +
        '<button type="button" class="btn btn--ghost btn--icon cal__next" aria-label="다음 달"><span data-icon="chevron-right"></span></button></div></div>' +
        '<div class="cal__dow" aria-hidden="true">' + DOW.map(function (d, k) { return '<span' + (k === offDay ? ' class="is-off"' : "") + ">" + d + "</span>"; }).join("") + "</div>" +
        '<div class="cal__grid" role="grid" aria-label="' + name + ' 선택"></div>';
      var legend = $(".cal__legend", cal);
      cal.insertAdjacentHTML("afterbegin", html);
      if (legend) cal.appendChild(legend);
      renderIcons(cal);
      var grid = $(".cal__grid", cal), title = $(".cal__month", cal);
      var focusDay = sel || 1;
      var draw = function (focus) {
        title.textContent = y + "년 " + m + "월";
        var first = new Date(y, m - 1, 1).getDay();
        var days = new Date(y, m, 0).getDate();
        var isBase = y === baseY && m === baseM;
        var isNext = (baseM === 12 ? (y === baseY + 1 && m === 1) : (y === baseY && m === baseM + 1));
        var cells = "", k, d;
        for (k = 0; k < first; k++) cells += '<span class="cal__day is-outside" aria-hidden="true"></span>';
        for (d = 1; d <= days; d++) {
          var wd = (first + d - 1) % 7;
          var key = y + "-" + m + "-" + d;
          var cls = ["cal__day"];
          var dis = false;
          if (wd === offDay) { cls.push("is-off"); if (disableOff) dis = true; }
          if (isBase && booked.indexOf(d) > -1) cls.push("is-booked");
          if ((isBase && range.indexOf(d) > -1) || (isNext && rangeNext.indexOf(d) > -1)) cls.push("is-range");
          if (minDay && key !== minDay) {
            var mp = minDay.split("-");
            if (new Date(y, m - 1, d) < new Date(+mp[0], +mp[1] - 1, +mp[2])) dis = true;
          }
          var label = m + "월 " + d + "일 " + DOW[wd] + "요일" + (wd === offDay ? " · 휴무" : "") + (cls.indexOf("is-booked") > -1 ? " · 예약 있음" : "") + (cls.indexOf("is-range") > -1 ? " · 전시 기간" : "");
          cells += '<button type="button" role="gridcell" class="' + cls.join(" ") + '" data-day="' + d + '" aria-label="' + label + '"' +
            (key === selKey ? ' aria-selected="true"' : ' aria-selected="false"') +
            (key === today ? ' aria-current="date"' : "") + (dis ? " disabled" : "") +
            ' tabindex="' + (d === focusDay ? 0 : -1) + '">' + d + "</button>";
        }
        grid.innerHTML = cells;
        if (focus) { var f = $("[data-day='" + focusDay + "']", grid); if (f) f.focus(); }
      };
      var choose = function (d) {
        selKey = y + "-" + m + "-" + d;
        focusDay = d;
        $$(".cal__day[data-day]", grid).forEach(function (b) { b.setAttribute("aria-selected", b.getAttribute("data-day") === String(d) ? "true" : "false"); });
        var wd = new Date(y, m - 1, d).getDay();
        if (out) out.textContent = y + "년 " + m + "월 " + d + "일 (" + DOW[wd] + ")";
        cal.dispatchEvent(new CustomEvent("calendar:select", { bubbles: true, detail: { year: y, month: m, day: d } }));
      };
      on(grid, "click", function (e) {
        var b = e.target.closest(".cal__day[data-day]");
        if (b && !b.disabled) choose(+b.getAttribute("data-day"));
      });
      on(grid, "keydown", function (e) {
        var b = e.target.closest(".cal__day[data-day]");
        if (!b) return;
        var d = +b.getAttribute("data-day"), days = new Date(y, m, 0).getDate(), n = null;
        if (e.key === "ArrowRight") n = d + 1;
        else if (e.key === "ArrowLeft") n = d - 1;
        else if (e.key === "ArrowDown") n = d + 7;
        else if (e.key === "ArrowUp") n = d - 7;
        else if (e.key === "Home") n = 1;
        else if (e.key === "End") n = days;
        if (n == null) return;
        e.preventDefault();
        focusDay = Math.max(1, Math.min(days, n));
        $$(".cal__day[data-day]", grid).forEach(function (x) { x.tabIndex = x.getAttribute("data-day") === String(focusDay) ? 0 : -1; });
        $("[data-day='" + focusDay + "']", grid).focus();
      });
      on($(".cal__prev", cal), "click", function () { m -= 1; if (m < 1) { m = 12; y -= 1; } focusDay = 1; draw(false); });
      on($(".cal__next", cal), "click", function () { m += 1; if (m > 12) { m = 1; y += 1; } focusDay = 1; draw(false); });
      draw(false);
      if (sel && out && !out.textContent.trim()) {
        var wd0 = new Date(y, m - 1, sel).getDay();
        out.textContent = y + "년 " + m + "월 " + sel + "일 (" + DOW[wd0] + ")";
      }
    });
  }

  /* ── 18. 칸반 — 드래그 · 키보드 이동 ───────────────────────────────── */
  function initBoards() {
    $$("[data-board]").forEach(function (board) {
      var live = $("[data-board-live]", board.parentNode) || (function () {
        var l = doc.createElement("p"); l.className = "vh"; l.setAttribute("aria-live", "assertive"); l.setAttribute("data-board-live", ""); board.parentNode.appendChild(l); return l;
      })();
      var cols = function () { return $$(".board__col", board); };
      var colName = function (col) { var n = $(".board__name", col); return n ? n.textContent.trim() : ""; };
      var recount = function () {
        cols().forEach(function (c) {
          var cnt = $(".board__count", c), list = $(".board__list", c);
          var n = $$(".task", list).length;
          if (cnt) cnt.textContent = n;
          var empty = $(".board__empty", list);
          if (empty) empty.hidden = n > 0;
        });
      };
      var dragging = null;
      on(board, "dragstart", function (e) {
        var t = e.target.closest(".task");
        if (!t) return;
        dragging = t;
        t.classList.add("is-dragging");
        try { e.dataTransfer.setData("text/plain", t.id || "task"); e.dataTransfer.effectAllowed = "move"; } catch (err) { /* 무시 */ }
      });
      on(board, "dragend", function () {
        if (dragging) dragging.classList.remove("is-dragging");
        dragging = null;
        $$(".board__list.is-over", board).forEach(function (l) { l.classList.remove("is-over"); });
      });
      on(board, "dragover", function (e) {
        var list = e.target.closest(".board__list");
        if (!list || !dragging) return;
        e.preventDefault();
        $$(".board__list.is-over", board).forEach(function (l) { if (l !== list) l.classList.remove("is-over"); });
        list.classList.add("is-over");
        var after = $$(".task:not(.is-dragging)", list).find(function (t) {
          var r = t.getBoundingClientRect(); return e.clientY < r.top + r.height / 2;
        });
        if (after) list.insertBefore(dragging, after); else list.insertBefore(dragging, $(".board__empty", list));
      });
      on(board, "drop", function (e) {
        var list = e.target.closest(".board__list");
        if (!list || !dragging) return;
        e.preventDefault();
        list.classList.remove("is-over");
        recount();
        live.textContent = ($(".task__title", dragging) || dragging).textContent.trim() + " — " + colName(list.closest(".board__col")) + "(으)로 옮김";
      });
      // 키보드: Space/Enter 들기 → ←→ 열 · ↑↓ 순서 → Space/Enter 놓기 · Esc 취소
      var lifted = null, origin = null;
      on(board, "keydown", function (e) {
        var t = e.target.closest(".task");
        if (!t) return;
        var title = ($(".task__title", t) || t).textContent.trim();
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          if (lifted === t) {
            t.classList.remove("is-lifted"); t.setAttribute("aria-grabbed", "false"); lifted = null; recount();
            live.textContent = title + " — " + colName(t.closest(".board__col")) + "에 놓음";
          } else {
            if (lifted) lifted.classList.remove("is-lifted");
            lifted = t; origin = { list: t.parentNode, next: t.nextSibling };
            t.classList.add("is-lifted"); t.setAttribute("aria-grabbed", "true");
            live.textContent = title + " 들어 올림. 왼쪽·오른쪽 화살표로 열을, 위·아래로 순서를 바꾸고 Enter 로 놓으세요.";
          }
          return;
        }
        if (e.key === "Escape" && lifted === t) {
          e.preventDefault();
          origin.list.insertBefore(t, origin.next);
          t.classList.remove("is-lifted"); lifted = null; recount(); t.focus();
          live.textContent = title + " 이동 취소";
          return;
        }
        if (lifted !== t) return;
        var list = t.parentNode, colList = cols(), ci = colList.indexOf(t.closest(".board__col"));
        if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
          e.preventDefault();
          var nc = colList[ci + (e.key === "ArrowRight" ? 1 : -1)];
          if (!nc) return;
          var nl = $(".board__list", nc);
          nl.insertBefore(t, $(".task", nl) || $(".board__empty", nl));
          t.focus(); recount();
          live.textContent = colName(nc) + " 열";
        } else if (e.key === "ArrowUp" || e.key === "ArrowDown") {
          e.preventDefault();
          var sib = e.key === "ArrowUp" ? t.previousElementSibling : t.nextElementSibling;
          if (!sib || !sib.classList.contains("task")) return;
          if (e.key === "ArrowUp") list.insertBefore(t, sib); else list.insertBefore(sib, t);
          t.focus();
        }
      });
      recount();
    });
  }

  /* ── 19. 폼 검증 · 버튼 로딩 · 스위치 ──────────────────────────────── */
  function fieldError(input, msg) {
    var field = input.closest(".field, .fieldset, .check, .radio") || input.parentNode;
    var holder = field.closest(".field, .fieldset") || field;
    var err = $(".field__error", holder);
    if (msg) {
      if (!err) {
        err = doc.createElement("p");
        err.className = "field__error";
        err.id = uid("err");
        holder.appendChild(err);
      }
      err.innerHTML = '<span data-icon="alert"></span>' + escapeHTML(msg);
      renderIcons(err);
      err.hidden = false;
      input.setAttribute("aria-invalid", "true");
      var ids = (input.getAttribute("aria-describedby") || "").split(" ").filter(Boolean);
      if (ids.indexOf(err.id) < 0) { ids.push(err.id); input.setAttribute("aria-describedby", ids.join(" ")); }
    } else {
      input.removeAttribute("aria-invalid");
      if (err) err.hidden = true;
    }
  }
  function validateInput(input) {
    if (input.disabled) return true;
    var v2 = input.type === "checkbox" ? input.checked : (input.value || "").trim();
    var msg = "";
    if (input.type === "radio") {
      var group = $$("input[name='" + input.name + "']", input.form);
      if (input.required && !group.some(function (r) { return r.checked; })) msg = input.getAttribute("data-msg") || "하나를 골라 주세요.";
    } else if (input.required && !v2) msg = input.getAttribute("data-msg") || "이 항목을 채워 주세요.";
    else if (v2 && input.type === "email" && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v2)) msg = "서신 주소 형식을 확인해 주세요. 예: salon@yunseul.kr";
    else if (v2 && input.type === "tel" && !/^0\d{1,2}-?\d{3,4}-?\d{4}$/.test(v2)) msg = "연락처 형식을 확인해 주세요. 예: 010-4127-0315";
    else if (v2 && input.pattern && !new RegExp("^(?:" + input.pattern + ")$").test(v2)) msg = input.getAttribute("data-msg") || "형식을 확인해 주세요.";
    fieldError(input, msg);
    return !msg;
  }
  function busy(btn, ms, fail, done) {
    var label = btn.innerHTML;
    btn.setAttribute("aria-busy", "true");
    btn.disabled = true;
    setTimeout(function () {
      btn.removeAttribute("aria-busy");
      btn.disabled = false;
      if (fail) {
        btn.classList.add("is-error");
        btn.textContent = "다시 시도";
        setTimeout(function () { btn.classList.remove("is-error"); btn.innerHTML = label; renderIcons(btn); }, 2400);
      }
      if (done) done(!fail);
    }, reduced() ? 300 : ms);
  }
  function initForms() {
    $$("form[data-validate]").forEach(function (form) {
      form.noValidate = true;
      on(form, "submit", function (e) {
        e.preventDefault();
        var inputs = $$("input, select, textarea", form).filter(function (i) { return i.type !== "hidden" && i.type !== "submit"; });
        var seen = {}, ok = true, firstBad = null;
        inputs.forEach(function (i) {
          if (i.type === "radio") { if (seen[i.name]) return; seen[i.name] = true; }
          if (!validateInput(i)) { ok = false; if (!firstBad) firstBad = i; }
        });
        var status = $("[data-form-status]", form);
        if (!ok) {
          if (status) { status.textContent = "표시한 항목을 확인해 주세요."; status.className = "form__status is-error"; }
          firstBad.focus();
          return;
        }
        var btn = $("[type='submit']", form);
        var fail = form.hasAttribute("data-fail");
        var finish = function (success) {
          if (status) {
            status.textContent = success ? (form.getAttribute("data-success") || "전달되었습니다.") : "전송하지 못했습니다. 잠시 후 다시 시도해 주세요.";
            status.className = "form__status " + (success ? "is-success" : "is-error");
          }
          if (success && form.hasAttribute("data-toast")) fireToastFrom(form);
        };
        if (btn) busy(btn, 1400, fail, finish); else finish(!fail);
      });
      on(form, "input", function (e) { if (e.target.getAttribute("aria-invalid") === "true") validateInput(e.target); });
      on(form, "change", function (e) { if (e.target.getAttribute("aria-invalid") === "true" || e.target.type === "radio") { if (e.target.getAttribute("aria-invalid") === "true" || $$("input[name='" + e.target.name + "'][aria-invalid='true']", form).length) validateInput(e.target); } });
    });
    doc.addEventListener("click", function (e) {
      var b = e.target.closest("[data-busy]");
      if (!b || b.type === "submit") return;
      busy(b, parseInt(b.getAttribute("data-busy"), 10) || 1600, b.hasAttribute("data-busy-fail"), function (ok) {
        if (ok && b.hasAttribute("data-toast")) fireToastFrom(b);
      });
    });
    // 스위치 상태 글자
    $$(".switch input").forEach(function (s) {
      var out = s.closest(".switch").querySelector(".switch__state");
      var sync = function () { if (out) out.textContent = s.checked ? "켬" : "끔"; };
      on(s, "change", sync); sync();
    });
    // 글자 수
    $$("[data-count-for]").forEach(function (c) {
      var t = doc.getElementById(c.getAttribute("data-count-for"));
      if (!t) return;
      var max = t.getAttribute("maxlength");
      var sync = function () { c.textContent = t.value.length + (max ? " / " + max : "자"); };
      on(t, "input", sync); sync();
    });
    // 누름 배지(필터)
    doc.addEventListener("click", function (e) {
      var b = e.target.closest("button[aria-pressed][data-toggle]");
      if (!b) return;
      var grp = b.getAttribute("data-toggle");
      if (grp) $$("button[data-toggle='" + grp + "']").forEach(function (o) { if (o !== b) o.setAttribute("aria-pressed", "false"); });
      b.setAttribute("aria-pressed", grp ? "true" : (b.getAttribute("aria-pressed") === "true" ? "false" : "true"));
    });
  }

  /* ── 20. 스텝 진행 ([data-stepper]) ────────────────────────────────── */
  function initSteppers() {
    $$("[data-stepper]").forEach(function (sp) {
      var panels = $$("[data-step-panel]", sp);
      var items = $$(".steps__item", sp);
      var i = Math.max(0, panels.findIndex(function (p) { return !p.hidden; }));
      var render = function (focus) {
        panels.forEach(function (p, k) { p.hidden = k !== i; });
        items.forEach(function (it, k) {
          it.classList.toggle("is-done", k < i);
          if (k === i) it.setAttribute("aria-current", "step"); else it.removeAttribute("aria-current");
        });
        var h = panels[i] && $("h1, h2, h3, legend", panels[i]);
        if (focus && h) { h.tabIndex = -1; h.focus(); }
      };
      on(sp, "click", function (e) {
        if (e.target.closest("[data-step-next]")) {
          var panel = panels[i];
          var bad = $$("input[required], select[required], textarea[required]", panel).filter(function (x) { return !validateInput(x); });
          if (bad.length) { bad[0].focus(); return; }
          if (i < panels.length - 1) { i += 1; render(true); }
        }
        if (e.target.closest("[data-step-prev]") && i > 0) { i -= 1; render(true); }
        var link = e.target.closest(".steps__link");
        if (link) { var k = items.indexOf(link.closest(".steps__item")); if (k > -1 && k < i) { i = k; render(true); } }
      });
      render(false);
    });
  }

  /* ── 21. 코드 복사 · 알림 닫기 · 모션 재생 ──────────────────────────── */
  function initMisc() {
    doc.addEventListener("click", function (e) {
      var c = e.target.closest("[data-copy]");
      if (c) {
        var src = doc.getElementById(c.getAttribute("data-copy"));
        var label = $(".code__copy-label", c) || c;
        var orig = label.textContent;
        var done = function (ok) {
          c.classList.add(ok ? "is-copied" : "is-error");
          label.textContent = ok ? "복사됨" : "복사 실패";
          setTimeout(function () { c.classList.remove("is-copied", "is-error"); label.textContent = orig; }, 2000);
        };
        if (src && navigator.clipboard) navigator.clipboard.writeText(src.textContent).then(function () { done(true); }, function () { done(false); });
        else done(false);
      }
      var d = e.target.closest("[data-dismiss]");
      if (d) {
        var al = d.closest(".alert");
        if (al) {
          var nextF = al.nextElementSibling && $(FOCUSABLE, al.nextElementSibling);
          al.classList.add("is-dismissed");
          if (nextF) nextF.focus();
        }
      }
      var r = e.target.closest("[data-motion-replay]");
      if (r) {
        var scope = doc.getElementById(r.getAttribute("data-motion-replay")) || doc;
        $$(".glint, .motion__reveal", scope).forEach(function (g) {
          var cls = g.classList.contains("motion__reveal") ? "is-playing" : "is-sweeping";
          g.classList.remove(cls);
          void g.offsetWidth;
          g.classList.add(cls);
        });
      }
    });
  }

  /* ── 공개 API ───────────────────────────────────────────────────────── */
  window.YS = {
    toast: toast,
    open: function (id) { openOverlay(doc.getElementById(id)); },
    close: function (id) { closeOverlay(doc.getElementById(id)); },
    setTheme: function (t) { storeSet(STORE_KEY, t); applyTheme(t); },
    render: function (ctx) { renderIcons(ctx); renderObjects(ctx); renderGauges(ctx); }
  };

  function init() {
    renderIcons();
    renderObjects();
    renderGauges();
    applyTheme(root.getAttribute("data-theme") || resolveTheme());
    initReveal();
    initCounter();
    initNav();
    initOverlays();
    initCommand();
    initTabs();
    initAccordion();
    initToasts();
    initPopovers();
    initCarousels();
    initMarquees();
    initPagers();
    initTables();
    initCalendars();
    initBoards();
    initForms();
    initSteppers();
    initMisc();
  }
  if (doc.readyState === "loading") doc.addEventListener("DOMContentLoaded", init);
  else init();
})();
