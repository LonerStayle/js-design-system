/* =====================================================================
   가선 시트룸 · app.js — GSA-STD-2026 화면 동작 (바닐라, 외부 라이브러리 없음)
   ---------------------------------------------------------------------
   테마      [data-theme-toggle] · URL ?theme=dark|light 최우선 → localStorage → 시스템
   레이어    [data-layer-toggle="grid|dims"] → :root[data-layer-grid|dims="off"]
   시트      .sheet 구역 띠(1–8 / A–F) · .sheet__frame[data-grid] 통심선 X1…X7
             .sheet[data-frame-draw] 프레임 그리기 · [data-draw] SVG 플로터 그리기
   커서      [data-crosshair] 십자선 + 도면 좌표 판독(pointer: fine, 모션 감소 시 끔)
   숫자      [data-count] 판독 · [data-countdown="27:40:00"] 마감 카운트다운
   오버레이  [data-open="id"] · [data-close] · Esc · 포커스 트랩 — modal / drawer / command / .side
             ⌘K · Ctrl+K → #command · [data-side-toggle] 960 미만 도면 세트 서랍
   부재      tabs · accordion · menu · popover · tooltip · toast · carousel · marquee · table 정렬/필터
             pagination · kanban(드래그 + 열 이동 메뉴 + Alt+←/→) · code 줄번호/복사 · form 검증(구름)
             range 치수 · segmented · calendar · sidebar 펼침 · [data-redraw] 다시 그리기
   공개 API  window.GSA = { toast, open, close, redraw, cloud, stamp, countTo, setStep, formatNum, setTheme }
   ===================================================================== */
(() => {
  'use strict';

  const doc = document;
  const root = doc.documentElement;
  const $ = (s, el = doc) => el.querySelector(s);
  const $$ = (s, el = doc) => Array.from(el.querySelectorAll(s));
  const mqReduce = matchMedia('(prefers-reduced-motion: reduce)');
  const mqDark = matchMedia('(prefers-color-scheme: dark)');
  const mqFine = matchMedia('(pointer: fine)');
  const mqNarrow = matchMedia('(max-width: 959px)');
  const reduced = () => mqReduce.matches;
  const DUR = { tick: 120, base: 240, sheet: 260, frame: 320, draw: 700, stagger: 50 };
  const KEY = { theme: 'gsa-theme', grid: 'gsa-layer-grid', dims: 'gsa-layer-dims' };
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* 저장 불가: 무시 */ } },
  };
  const formatNum = (n, d = 0) => Number(n).toLocaleString('ko-KR', { minimumFractionDigits: d, maximumFractionDigits: d });
  const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
  const visible = (el) => !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length);
  let uid = 0;
  const ensureId = (el, p = 'gsa') => el.id || (el.id = `${p}-${++uid}`);

  /* ── 1. 테마 ─────────────────────────────────────────────────── */
  function resolveTheme() {
    let q = null;
    try { q = new URLSearchParams(location.search).get('theme'); } catch (e) { /* noop */ }
    if (q === 'dark' || q === 'light') return q;
    const s = store.get(KEY.theme);
    if (s === 'dark' || s === 'light') return s;
    return mqDark.matches ? 'dark' : 'light';
  }
  function setTheme(t, persist = false) {
    root.setAttribute('data-theme', t);
    if (persist) store.set(KEY.theme, t);
    $$('[data-theme-toggle]').forEach((b) => {
      b.setAttribute('aria-pressed', String(t === 'dark'));
      b.setAttribute('aria-label', t === 'dark' ? '밤 장면 — 낮 장면으로 전환' : '낮 장면 — 밤 장면으로 전환');
    });
  }
  function initTheme() {
    setTheme(resolveTheme());
    doc.addEventListener('click', (e) => {
      const b = e.target.closest('[data-theme-toggle]');
      if (!b) return;
      setTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark', true);
    });
    mqDark.addEventListener?.('change', () => {
      let q = null;
      try { q = new URLSearchParams(location.search).get('theme'); } catch (e) { /* noop */ }
      if (!q && !store.get(KEY.theme)) setTheme(mqDark.matches ? 'dark' : 'light');
    });
  }

  /* ── 2. 레이어 (통심선 · 치수) ───────────────────────────────── */
  function setLayer(name, on, persist = true) {
    if (on) root.removeAttribute(`data-layer-${name}`); else root.setAttribute(`data-layer-${name}`, 'off');
    if (persist) store.set(KEY[name], on ? 'on' : 'off');
    $$(`[data-layer-toggle="${name}"]`).forEach((el) => {
      if (el.matches('input[type="checkbox"]')) el.checked = on;
      else el.setAttribute('aria-pressed', String(on));
    });
  }
  function initLayers() {
    ['grid', 'dims'].forEach((n) => setLayer(n, store.get(KEY[n]) !== 'off', false));
    doc.addEventListener('click', (e) => {
      const b = e.target.closest('button[data-layer-toggle]');
      if (!b) return;
      const n = b.dataset.layerToggle;
      setLayer(n, root.getAttribute(`data-layer-${n}`) === 'off');
    });
    doc.addEventListener('change', (e) => {
      const i = e.target.closest('input[data-layer-toggle]');
      if (i) setLayer(i.dataset.layerToggle, i.checked);
    });
  }

  /* ── 3. 시트: 구역 띠 · 통심선 ───────────────────────────────── */
  function buildZones(sheet) {
    if (sheet.hasAttribute('data-no-zones') || $(':scope > .sheet__zones', sheet)) return;
    const z = doc.createElement('div');
    z.className = 'sheet__zones';
    z.setAttribute('aria-hidden', 'true');
    const nums = [1, 2, 3, 4, 5, 6, 7, 8].map((n) => `<span>${n}</span>`).join('');
    const lets = ['A', 'B', 'C', 'D', 'E', 'F'].map((l) => `<span>${l}</span>`).join('');
    z.innerHTML = `<div class="zone-row zone-row--top">${nums}</div><div class="zone-row zone-row--bottom">${nums}</div>`
      + `<div class="zone-col zone-col--left">${lets}</div><div class="zone-col zone-col--right">${lets}</div>`
      + '<i class="zone-mark zone-mark--t"></i><i class="zone-mark zone-mark--b"></i><i class="zone-mark zone-mark--l"></i><i class="zone-mark zone-mark--r"></i>';
    sheet.prepend(z);
  }
  function buildGrid(frame) {
    if ($(':scope > .gridlayer', frame)) return;
    const bays = Math.max(1, parseInt(frame.dataset.grid, 10) || 6);
    const prefix = 'X'; // 위쪽 가장자리 = 가로 축 X (Y 는 세로 경계 기호라 여기 쓰지 않는다)
    const g = doc.createElement('div');
    g.className = 'gridlayer';
    g.setAttribute('aria-hidden', 'true');
    g.style.setProperty('--bays-d', String(bays));
    let html = '';
    for (let i = 0; i <= bays; i++) {
      html += `<span class="gridlayer__bubble" data-i="${i}"${i === bays ? ' data-last' : ''} style="--i:${i}">${prefix}${i + 1}</span>`;
    }
    g.innerHTML = html;
    frame.prepend(g);
  }
  function initSheets(scope = doc) {
    $$('.sheet', scope).forEach(buildZones);
    $$('.sheet__frame[data-grid]', scope).forEach(buildGrid);
  }

  /* ── 4. 그리기: SVG 플로터 · 프레임 · 치수 · 구름 ─────────────── */
  const SHAPES = 'path, line, polyline, polygon, circle, rect, ellipse';
  function prepPlot(svg) {
    if (svg.dataset.plotReady) return;
    svg.dataset.plotReady = '1';
    const groups = $$('[data-plot]', svg);
    const order = (el) => {
      const g = el.closest('[data-plot]');
      return g ? parseInt(g.dataset.plot, 10) || 0 : 0;
    };
    const counters = {};
    $$(`${SHAPES}, text`, svg).forEach((el) => {
      if (el.closest('defs, pattern, mask, clipPath, marker, symbol')) return;
      const o = order(el);
      counters[o] = (counters[o] || 0) + 1;
      const i = o * 6 + Math.min(counters[o] - 1, 7);
      el.style.setProperty('--plot-i', String(i));
      const cs = getComputedStyle(el);
      const dashed = el.hasAttribute('stroke-dasharray') || (cs.strokeDasharray && cs.strokeDasharray !== 'none');
      const stroked = cs.stroke && cs.stroke !== 'none';
      if (el.tagName.toLowerCase() === 'text' || dashed || !stroked || el.classList.contains('plot-fade')) {
        el.classList.add('plot-fade');
      } else {
        el.setAttribute('pathLength', '1');
        el.classList.add('plot-line');
      }
    });
    svg.dataset.plotSpan = String((groups.length ? Math.max(...groups.map((g) => parseInt(g.dataset.plot, 10) || 0)) : 0) * 6 + 8);
  }
  function plot(svg) {
    if (!svg) return;
    prepPlot(svg);
    svg.setAttribute('data-plotted', '');
    if (reduced()) return;
    svg.classList.remove('is-plotting');
    void svg.getBoundingClientRect();
    svg.classList.add('is-plotting');
    const total = (parseInt(svg.dataset.plotSpan, 10) || 8) * DUR.stagger + DUR.draw + 120;
    clearTimeout(svg._plotT);
    svg._plotT = setTimeout(() => svg.classList.remove('is-plotting'), total);
    $$('.cloud, .cloud-ring', svg.closest('[data-redraw-scope]') || svg.parentElement || svg).forEach((c) => drawCloud(c, total - DUR.draw));
  }
  function drawFrame(sheet) {
    const f = $(':scope > .sheet__frame', sheet);
    if (!f || reduced()) return;
    f.classList.add('is-framing');
    setTimeout(() => {
      f.classList.remove('is-framing');
      f.classList.add('is-framed');
      setTimeout(() => f.classList.remove('is-framed'), DUR.tick + 40);
    }, DUR.frame);
  }
  function growDim(d) {
    if (reduced()) return;
    d.classList.add('is-growing');
    setTimeout(() => d.classList.remove('is-growing'), DUR.base + 200);
  }
  function drawCloud(c, delay = 0) {
    if (reduced()) return;
    setTimeout(() => {
      c.classList.remove('is-drawing');
      void c.offsetWidth;
      c.classList.add('is-drawing');
      setTimeout(() => c.classList.remove('is-drawing'), DUR.draw + DUR.tick + 40);
    }, Math.max(0, delay));
  }
  function stamp(el) {
    if (!el) return;
    el.classList.remove('is-stamping');
    void el.offsetWidth;
    el.classList.add('is-stamping');
    setTimeout(() => el.classList.remove('is-stamping'), 260);
  }
  function initDrawing(scope = doc) {
    const io = 'IntersectionObserver' in window ? new IntersectionObserver((entries, obs) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        const el = en.target;
        obs.unobserve(el);
        if (el.matches('[data-draw]')) plot(el);
        else if (el.matches('.sheet[data-frame-draw]')) drawFrame(el);
        else if (el.matches('.dim')) growDim(el);
        else if (el.matches('.cloud, .cloud-ring')) drawCloud(el);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.01 }) : null;
    $$('[data-draw]', scope).forEach((svg) => { prepPlot(svg); io ? io.observe(svg) : plot(svg); });
    $$('.sheet[data-frame-draw]', scope).forEach((s) => io && io.observe(s));
    $$('.dim', scope).forEach((d) => io && !d.closest('[data-draw]') && io.observe(d));
    $$('.cloud, .cloud-ring', scope).forEach((c) => io && !c.closest('[data-draw]') && io.observe(c));
    doc.addEventListener('click', (e) => {
      const b = e.target.closest('[data-redraw]');
      if (!b) return;
      const target = doc.getElementById(b.dataset.redraw);
      if (target && target.matches('[data-draw]')) plot(target);
      else if (target) $$('[data-draw]', target).forEach(plot);
      if (reduced()) toast({ title: '모션 감소 설정', text: '시스템의 동작 줄이기 설정에 따라 완성된 도면을 바로 보여 줍니다.', tone: 'info' });
    });
  }

  /* ── 5. 십자선 커서 + 도면 좌표 판독 ─────────────────────────── */
  function initCrosshair() {
    const zones = $$('[data-crosshair]');
    if (!zones.length) return;
    let x = null;
    const build = () => {
      x = doc.createElement('div');
      x.className = 'xhair';
      x.hidden = true;
      x.setAttribute('aria-hidden', 'true');
      x.innerHTML = '<i class="xhair__h"></i><i class="xhair__v"></i><span class="xhair__read"></span>';
      doc.body.append(x);
    };
    zones.forEach((zone) => {
      const svg = zone.matches('svg[data-plan]') ? zone : $('svg[data-plan]', zone);
      const origin = (svg?.dataset.planOrigin || '').split(/[\s,]+/).map(Number);
      zone.addEventListener('pointermove', (e) => {
        if (!mqFine.matches || reduced() || e.pointerType !== 'mouse') return;
        if (!x) build();
        x.hidden = false;
        zone.classList.add('is-xhair');
        const h = $('.xhair__h', x), v = $('.xhair__v', x), r = $('.xhair__read', x);
        h.style.transform = `translateY(${e.clientY}px)`;
        v.style.transform = `translateX(${e.clientX}px)`;
        let mx = 0, my = 0;
        if (svg && svg.getScreenCTM) {
          const m = svg.getScreenCTM();
          if (m) {
            const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse());
            mx = origin.length === 2 && !Number.isNaN(origin[0]) ? p.x - origin[0] : p.x;
            my = origin.length === 2 && !Number.isNaN(origin[1]) ? origin[1] - p.y : p.y;
          }
        }
        r.textContent = `X ${formatNum(Math.round(mx))} · Y ${formatNum(Math.round(my))}`;
        const rw = r.offsetWidth, rh = r.offsetHeight;
        let lx = e.clientX + 12, ly = e.clientY + 12;
        if (lx + rw > innerWidth - 8) lx = e.clientX - rw - 12;
        if (ly + rh > innerHeight - 8) ly = e.clientY - rh - 12;
        r.style.transform = `translate(${lx}px, ${ly}px)`;
      });
      zone.addEventListener('pointerleave', () => { if (x) x.hidden = true; zone.classList.remove('is-xhair'); });
    });
  }

  /* ── 6. 숫자 판독 · 카운트다운 ───────────────────────────────── */
  function countTo(el, to, opt = {}) {
    const d = opt.decimals ?? (parseInt(el.dataset.decimals, 10) || 0);
    const prefix = opt.prefix ?? (el.dataset.prefix || '');
    const suffix = opt.suffix ?? (el.dataset.suffix || '');
    const write = (v) => { el.textContent = `${prefix}${formatNum(v, d)}${suffix}`; };
    if (reduced()) { write(to); return; }
    const steps = 12, dur = 600;
    let k = 0;
    clearInterval(el._countT);
    write(0);
    el._countT = setInterval(() => {
      k++;
      write(k >= steps ? to : (to * k) / steps);
      if (k >= steps) clearInterval(el._countT);
    }, dur / steps);
  }
  function initCounts() {
    const els = $$('[data-count]');
    const io = 'IntersectionObserver' in window ? new IntersectionObserver((ents, obs) => {
      ents.forEach((en) => { if (en.isIntersecting) { obs.unobserve(en.target); countTo(en.target, parseFloat(en.target.dataset.count)); } });
    }, { threshold: 0.4 }) : null;
    els.forEach((el) => (io ? io.observe(el) : countTo(el, parseFloat(el.dataset.count))));

    $$('[data-countdown]').forEach((el) => {
      const [h, m, s] = el.dataset.countdown.split(':').map((n) => parseInt(n, 10) || 0);
      let left = h * 3600 + m * 60 + s;
      const pad = (n) => String(n).padStart(2, '0');
      const write = () => {
        const hh = Math.floor(left / 3600), mm = Math.floor((left % 3600) / 60), ss = left % 60;
        el.textContent = `${pad(hh)}:${pad(mm)}:${pad(ss)}`;
        el.setAttribute('datetime', `PT${hh}H${mm}M${ss}S`);
      };
      write();
      el.setAttribute('aria-live', 'off');
      setInterval(() => { if (left > 0) { left--; write(); } }, 1000);
    });
  }

  /* ── 7. 오버레이 스택 (modal · drawer · command · side) ──────── */
  const stack = [];
  const kindOf = (el) => (el.classList.contains('side') ? 'side'
    : el.classList.contains('command') ? 'command'
      : el.classList.contains('drawer') ? 'drawer' : 'modal');
  function lock() { root.classList.toggle('is-locked', stack.length > 0); }
  function plotCallout(trigger) {
    if (!trigger || reduced()) return;
    const r = trigger.getBoundingClientRect();
    const c = doc.createElementNS('http://www.w3.org/2000/svg', 'svg');
    c.setAttribute('class', 'plot-callout');
    c.setAttribute('viewBox', '0 0 44 44');
    c.setAttribute('aria-hidden', 'true');
    c.innerHTML = '<circle cx="22" cy="22" r="21" pathLength="1"/><line x1="1" y1="22" x2="43" y2="22" pathLength="1"/>';
    c.style.left = `${r.left + r.width / 2}px`;
    c.style.top = `${r.top + r.height / 2}px`;
    doc.body.append(c);
    setTimeout(() => c.remove(), DUR.base + 260);
  }
  function openOverlay(el, trigger) {
    if (!el) return;
    if (stack.some((s) => s.el === el)) return;
    const kind = kindOf(el);
    if (kind === 'side' && !mqNarrow.matches) return;
    closeFloats();
    const entry = { el, kind, trigger: trigger || doc.activeElement };
    stack.push(entry);
    if (kind === 'side') {
      el.classList.add('is-open');
      el.setAttribute('role', 'dialog');
      el.setAttribute('aria-modal', 'true');
    } else {
      el.hidden = false;
      el.classList.remove('is-closing');
      if (!reduced()) {
        el.classList.add('is-opening');
        setTimeout(() => el.classList.remove('is-opening'), DUR.sheet + 60);
      }
      if (kind === 'modal') plotCallout(entry.trigger);
    }
    $$(`[aria-controls="${el.id}"]`).forEach((t) => t.setAttribute('aria-expanded', 'true'));
    lock();
    const target = $('[data-autofocus]', el) || (kind === 'command' ? $('.command__input', el) : null)
      || $$(FOCUSABLE, el).find((n) => visible(n) && !n.closest('[data-close]') && !n.matches('[data-close]'))
      || $$(FOCUSABLE, el).find(visible);
    setTimeout(() => (target || el).focus({ preventScroll: true }), kind === 'side' ? 30 : 0);
    if (kind === 'command') commandReset(el);
    el.dispatchEvent(new CustomEvent('gsa:open', { bubbles: true }));
  }
  function closeOverlay(el, restore = true) {
    const i = stack.findIndex((s) => s.el === el);
    if (i < 0) return;
    const [entry] = stack.splice(i, 1);
    $$(`[aria-controls="${el.id}"]`).forEach((t) => t.setAttribute('aria-expanded', 'false'));
    if (entry.kind === 'side') {
      el.classList.remove('is-open');
      el.removeAttribute('role');
      el.removeAttribute('aria-modal');
    } else if (reduced()) {
      el.hidden = true;
    } else {
      el.classList.remove('is-opening');
      el.classList.add('is-closing');
      setTimeout(() => { el.hidden = true; el.classList.remove('is-closing'); }, entry.kind === 'drawer' ? DUR.base : DUR.tick + 20);
    }
    lock();
    if (restore && entry.trigger && doc.contains(entry.trigger)) entry.trigger.focus({ preventScroll: true });
    el.dispatchEvent(new CustomEvent('gsa:close', { bubbles: true }));
  }
  function trap(e) {
    const top = stack[stack.length - 1];
    if (!top || e.key !== 'Tab') return;
    const items = $$(FOCUSABLE, top.el).filter(visible);
    if (!items.length) { e.preventDefault(); return; }
    const first = items[0], last = items[items.length - 1];
    if (!top.el.contains(doc.activeElement)) { e.preventDefault(); first.focus(); return; }
    if (e.shiftKey && doc.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && doc.activeElement === last) { e.preventDefault(); first.focus(); }
  }
  function initOverlays() {
    doc.addEventListener('click', (e) => {
      const o = e.target.closest('[data-open]:not([data-open=""])');
      if (o) { e.preventDefault(); openOverlay(doc.getElementById(o.dataset.open), o); return; }
      const st = e.target.closest('[data-side-toggle]');
      if (st) { const side = doc.getElementById(st.dataset.sideToggle || 'side') || $('.side'); if (side) (side.classList.contains('is-open') ? closeOverlay(side) : openOverlay(side, st)); return; }
      const c = e.target.closest('[data-close]');
      if (c) {
        const host = c.dataset.close ? doc.getElementById(c.dataset.close) : c.closest('.modal, .drawer, .command, .side');
        if (host) { e.preventDefault(); closeOverlay(host); }
        return;
      }
      const scrim = e.target.closest('.modal__scrim, .drawer__scrim, .command__scrim');
      if (scrim) { closeOverlay(scrim.parentElement); return; }
      if (e.target.matches('.side-scrim')) { const s = e.target.previousElementSibling; if (s) closeOverlay(s); }
    });
    doc.addEventListener('keydown', trap);
    mqNarrow.addEventListener?.('change', () => {
      if (!mqNarrow.matches) stack.filter((s) => s.kind === 'side').forEach((s) => closeOverlay(s.el, false));
    });
  }

  /* ── 8. 시트 찾기 ⌘K ─────────────────────────────────────────── */
  function commandReset(cmd) {
    const input = $('.command__input', cmd);
    if (input) { input.value = ''; commandFilter(cmd, ''); }
  }
  function commandItems(cmd) { return $$('.command__item', cmd).filter((i) => !i.hidden && i.getAttribute('aria-disabled') !== 'true'); }
  function commandSelect(cmd, item) {
    $$('.command__item[aria-selected="true"]', cmd).forEach((i) => i.setAttribute('aria-selected', 'false'));
    const input = $('.command__input', cmd);
    if (!item) { input?.removeAttribute('aria-activedescendant'); return; }
    item.setAttribute('aria-selected', 'true');
    input?.setAttribute('aria-activedescendant', ensureId(item, 'cmd'));
    item.scrollIntoView({ block: 'nearest' });
  }
  function commandFilter(cmd, q) {
    const query = q.trim().toLowerCase();
    let shown = 0;
    $$('.command__item', cmd).forEach((item) => {
      const name = $('.command__name', item);
      if (name && !name.dataset.raw) name.dataset.raw = name.textContent;
      const hay = `${item.textContent} ${item.dataset.keywords || ''}`.toLowerCase();
      const hit = !query || hay.includes(query);
      item.hidden = !hit;
      if (hit) shown++;
      if (name) {
        const raw = name.dataset.raw;
        const at = query ? raw.toLowerCase().indexOf(query) : -1;
        name.textContent = '';
        if (at >= 0) {
          const mk = doc.createElement('mark');
          mk.textContent = raw.slice(at, at + query.length);
          name.append(raw.slice(0, at), mk, raw.slice(at + query.length));
        } else name.textContent = raw;
      }
    });
    $$('.command__group', cmd).forEach((g) => { g.hidden = !$$('.command__item', g).some((i) => !i.hidden); });
    const empty = $('.command__empty', cmd);
    if (empty) {
      empty.hidden = shown > 0;
      const echo = $('[data-command-echo]', empty);
      if (echo) echo.textContent = q.trim();
    }
    commandSelect(cmd, commandItems(cmd)[0]);
  }
  function commandRun(cmd, item) {
    if (!item) return;
    const href = item.getAttribute('href') || item.dataset.href;
    if (item.dataset.toast) toast({ title: item.dataset.toast, tone: 'info' });
    closeOverlay(cmd, !href);
    if (href) location.href = href;
  }
  function initCommand() {
    $$('.command:not(.command--static)').forEach((cmd) => {
      const input = $('.command__input', cmd);
      if (!input) return;
      input.addEventListener('input', () => commandFilter(cmd, input.value));
      input.addEventListener('keydown', (e) => {
        const items = commandItems(cmd);
        const cur = items.findIndex((i) => i.getAttribute('aria-selected') === 'true');
        if (e.key === 'ArrowDown') { e.preventDefault(); commandSelect(cmd, items[(cur + 1) % items.length]); }
        else if (e.key === 'ArrowUp') { e.preventDefault(); commandSelect(cmd, items[(cur - 1 + items.length) % items.length]); }
        else if (e.key === 'Home') { e.preventDefault(); commandSelect(cmd, items[0]); }
        else if (e.key === 'End') { e.preventDefault(); commandSelect(cmd, items[items.length - 1]); }
        else if (e.key === 'Enter') { e.preventDefault(); commandRun(cmd, items[cur]); }
      });
      cmd.addEventListener('click', (e) => {
        const item = e.target.closest('.command__item');
        if (!item || item.getAttribute('aria-disabled') === 'true') return;
        e.preventDefault();
        commandRun(cmd, item);
      });
      cmd.addEventListener('pointermove', (e) => {
        const item = e.target.closest('.command__item');
        if (item && item.getAttribute('aria-selected') !== 'true' && !item.hidden) commandSelect(cmd, item);
      });
    });
    doc.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
        const cmd = $('#command') || $('.command:not(.command--static)');
        if (!cmd) return;
        e.preventDefault();
        if (stack.some((s) => s.el === cmd)) closeOverlay(cmd); else openOverlay(cmd, doc.activeElement);
      }
    });
  }

  /* ── 9. 메뉴 · 팝오버 (떠 있는 부재) ─────────────────────────── */
  let openFloat = null; // { panel, trigger, kind }
  function closeFloats(restore = false) {
    if (!openFloat) return;
    const { panel, trigger } = openFloat;
    panel.hidden = true;
    trigger?.setAttribute('aria-expanded', 'false');
    openFloat = null;
    if (restore && trigger) trigger.focus();
  }
  const menuItems = (panel) => $$('[role^="menuitem"]', panel).filter((i) => !i.hidden && i.getAttribute('aria-disabled') !== 'true' && !i.disabled);
  function openMenu(trigger, focusLast = false) {
    const panel = doc.getElementById(trigger.getAttribute('aria-controls'));
    if (!panel) return;
    closeFloats();
    panel.hidden = false;
    trigger.setAttribute('aria-expanded', 'true');
    openFloat = { panel, trigger, kind: 'menu' };
    // 화면 오른쪽을 넘으면 끝 정렬로 뒤집는다
    panel.classList.remove('menu__panel--flip');
    const r = panel.getBoundingClientRect();
    if (r.right > innerWidth - 8) panel.classList.add('menu__panel--end');
    if (r.bottom > innerHeight - 8 && trigger.getBoundingClientRect().top > r.height + 16) panel.classList.add('menu__panel--up');
    if (!reduced()) { panel.classList.add('is-opening'); setTimeout(() => panel.classList.remove('is-opening'), DUR.base); }
    const items = menuItems(panel);
    (focusLast ? items[items.length - 1] : items[0])?.focus();
  }
  function placePop(panel, trigger) {
    if (panel.parentElement !== doc.body) doc.body.append(panel);
    panel.hidden = false;
    const r = trigger.getBoundingClientRect();
    const w = panel.offsetWidth, h = panel.offsetHeight;
    const tx = r.left + r.width / 2;
    let leader = 20;
    let left = tx - leader + 17;
    const maxLeft = innerWidth - w - 12;
    if (left > maxLeft) { leader += left - maxLeft; left = maxLeft; }
    if (left < 12) { leader = Math.max(20, leader - (12 - left)); left = 12; }
    leader = Math.min(Math.max(leader, 20), w - 8);
    let top = r.bottom + 21;
    let side = 'bottom';
    if (top + h > innerHeight - 8 && r.top - 21 - h > 8) { top = r.top - 21 - h; side = 'top'; }
    panel.dataset.side = side;
    panel.style.setProperty('--leader-x', `${leader}px`);
    panel.style.left = `${left + scrollX}px`;
    panel.style.top = `${top + scrollY}px`;
  }
  function openPop(trigger) {
    const panel = doc.getElementById(trigger.dataset.popover);
    if (!panel) return;
    closeFloats();
    trigger.setAttribute('aria-controls', panel.id);
    trigger.setAttribute('aria-expanded', 'true');
    placePop(panel, trigger);
    openFloat = { panel, trigger, kind: 'pop' };
    if (!reduced()) { panel.classList.add('is-opening'); setTimeout(() => panel.classList.remove('is-opening'), DUR.base); }
    const f = $$(FOCUSABLE, panel).find(visible);
    if (!panel.hasAttribute('tabindex')) panel.setAttribute('tabindex', '-1');
    (f || panel).focus({ preventScroll: true });
  }
  function initFloats() {
    doc.addEventListener('click', (e) => {
      if (e.target.closest('[data-close-pop]')) { e.preventDefault(); closeFloats(true); return; }
      const mt = e.target.closest('[data-menu-trigger]');
      if (mt) {
        e.preventDefault();
        if (openFloat && openFloat.trigger === mt) closeFloats(); else openMenu(mt);
        return;
      }
      const pt = e.target.closest('[data-popover]');
      if (pt) {
        e.preventDefault();
        if (openFloat && openFloat.trigger === pt) closeFloats(); else openPop(pt);
        return;
      }
      const item = e.target.closest('[role^="menuitem"]');
      if (item && openFloat && openFloat.panel.contains(item)) {
        if (item.getAttribute('aria-disabled') === 'true') { e.preventDefault(); return; }
        if (item.getAttribute('role') === 'menuitemcheckbox') {
          item.setAttribute('aria-checked', String(item.getAttribute('aria-checked') !== 'true'));
          return;
        }
        if (item.getAttribute('role') === 'menuitemradio') {
          $$('[role="menuitemradio"]', openFloat.panel).forEach((r) => r.setAttribute('aria-checked', String(r === item)));
        }
        if (item.dataset.toast) toast({ title: item.dataset.toast, text: item.dataset.toastText, tone: item.dataset.toastTone || 'info' });
        const t = openFloat.trigger;
        closeFloats();
        if (!item.getAttribute('href') && !item.dataset.open) t?.focus();
        return;
      }
      if (openFloat && !openFloat.panel.contains(e.target)) closeFloats();
    });
    doc.addEventListener('keydown', (e) => {
      const mt = e.target.closest?.('[data-menu-trigger]');
      if (mt && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) { e.preventDefault(); openMenu(mt, e.key === 'ArrowUp'); return; }
      if (!openFloat) return;
      const { panel, kind } = openFloat;
      if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); closeFloats(true); return; }
      if (kind === 'menu') {
        const items = menuItems(panel);
        const i = items.indexOf(doc.activeElement);
        if (e.key === 'ArrowDown') { e.preventDefault(); items[(i + 1) % items.length]?.focus(); }
        else if (e.key === 'ArrowUp') { e.preventDefault(); items[(i - 1 + items.length) % items.length]?.focus(); }
        else if (e.key === 'Home') { e.preventDefault(); items[0]?.focus(); }
        else if (e.key === 'End') { e.preventDefault(); items[items.length - 1]?.focus(); }
        else if (e.key === 'Tab') closeFloats();
        else if (e.key.length === 1 && /\S/.test(e.key)) {
          const hit = items.find((n, k) => k > i && n.textContent.trim().startsWith(e.key)) || items.find((n) => n.textContent.trim().startsWith(e.key));
          hit?.focus();
        }
      }
    }, true);
    addEventListener('resize', () => { if (openFloat?.kind === 'pop') placePop(openFloat.panel, openFloat.trigger); });
    addEventListener('scroll', () => { if (openFloat?.kind === 'menu' && !openFloat.panel.closest('.side, .drawer, .modal')) { /* 메뉴는 트리거와 함께 흐른다 */ } }, { passive: true });
  }

  /* ── 10. 툴팁 ────────────────────────────────────────────────── */
  function initTips() {
    let tip = null, cur = null, t = 0;
    const show = (el) => {
      if (!tip) {
        tip = doc.createElement('div');
        tip.className = 'tip';
        tip.id = 'gsa-tip';
        tip.setAttribute('role', 'tooltip');
        doc.body.append(tip);
      }
      cur = el;
      tip.textContent = el.dataset.tip;
      el.setAttribute('aria-describedby', 'gsa-tip');
      const r = el.getBoundingClientRect();
      tip.style.left = '0px';
      tip.style.top = '0px';
      tip.classList.add('is-visible');
      const w = tip.offsetWidth, h = tip.offsetHeight;
      let left = Math.min(Math.max(8, r.left + r.width / 2 - w / 2), innerWidth - w - 8);
      let top = r.top - h - 10;
      let side = 'top';
      if (top < 8) { top = r.bottom + 10; side = 'bottom'; }
      tip.dataset.side = side;
      tip.style.setProperty('--leader-x', `${Math.min(Math.max(6, r.left + r.width / 2 - left), w - 6)}px`);
      tip.style.left = `${left}px`;
      tip.style.top = `${top}px`;
    };
    const hide = () => {
      clearTimeout(t);
      if (!tip || !cur) return;
      tip.classList.remove('is-visible');
      cur.removeAttribute('aria-describedby');
      cur = null;
    };
    doc.addEventListener('pointerover', (e) => {
      const el = e.target.closest('[data-tip]');
      if (!el || el === cur || e.pointerType === 'touch') return;
      clearTimeout(t);
      t = setTimeout(() => show(el), 160);
    });
    doc.addEventListener('pointerout', (e) => {
      const el = e.target.closest('[data-tip]');
      if (el && !el.contains(e.relatedTarget)) hide();
    });
    doc.addEventListener('focusin', (e) => { const el = e.target.closest?.('[data-tip]'); if (el && el.matches(':focus-visible')) show(el); });
    doc.addEventListener('focusout', (e) => { if (e.target.closest?.('[data-tip]')) hide(); });
    doc.addEventListener('keydown', (e) => { if (e.key === 'Escape' && cur) hide(); });
    addEventListener('scroll', hide, { passive: true });
  }

  /* ── 11. 토스트 ──────────────────────────────────────────────── */
  function toastRegion() {
    let r = $('.toasts:not(.toasts--static)');
    if (!r) {
      r = doc.createElement('div');
      r.className = 'toasts';
      r.setAttribute('aria-live', 'polite');
      r.setAttribute('aria-relevant', 'additions');
      doc.body.append(r);
    }
    return r;
  }
  function dismissToast(t) {
    if (!t || t.classList.contains('is-closing')) return;
    if (reduced()) { t.remove(); return; }
    t.classList.add('is-closing');
    setTimeout(() => t.remove(), 160 + DUR.tick + 40);
  }
  function toast(opt = {}) {
    const { title = '', text = '', tone = 'info', ref = '', action = null, duration = 5000 } = opt;
    const region = toastRegion();
    const t = doc.createElement('div');
    t.className = `toast toast--${tone}`;
    t.setAttribute('role', tone === 'red' ? 'alert' : 'status');
    t.style.setProperty('--toast-dur', `${duration}ms`);
    t.innerHTML = `<span class="toast__sym" aria-hidden="true"></span><div class="toast__body"></div>`
      + '<button class="btn btn--ghost btn--icon toast__close" type="button" aria-label="알림 닫기"><svg class="icon" viewBox="0 0 18 18" aria-hidden="true"><path d="M4 4l10 10M14 4 4 14" fill="none" stroke="currentColor" stroke-width="1.5"/></svg></button>'
      + (duration ? '<span class="toast__timer" aria-hidden="true"></span>' : '');
    const body = $('.toast__body', t);
    if (ref) { const r = doc.createElement('span'); r.className = 'toast__ref'; r.textContent = ref; body.append(r); }
    const h = doc.createElement('strong'); h.className = 'toast__title'; h.textContent = title; body.append(h);
    if (text) { const p = doc.createElement('span'); p.className = 'toast__text'; p.textContent = text; body.append(p); }
    if (action) {
      const a = doc.createElement('div'); a.className = 'toast__actions';
      const b = doc.createElement(action.href ? 'a' : 'button');
      b.className = 'btn btn--secondary btn--sm';
      b.textContent = action.label;
      if (action.href) b.href = action.href; else { b.type = 'button'; b.addEventListener('click', () => { action.onClick?.(); dismissToast(t); }); }
      a.append(b); body.append(a);
    }
    $('.toast__close', t).addEventListener('click', () => dismissToast(t));
    region.append(t);
    if (!reduced()) { t.classList.add('is-opening'); setTimeout(() => t.classList.remove('is-opening'), DUR.base); }
    const list = $$('.toast:not(.is-closing)', region);
    if (list.length > 3) dismissToast(list[0]);
    if (duration) {
      let left = duration, start = Date.now(), timer = setTimeout(() => dismissToast(t), left);
      const pause = () => { clearTimeout(timer); left -= Date.now() - start; };
      const resume = () => { start = Date.now(); clearTimeout(timer); timer = setTimeout(() => dismissToast(t), Math.max(800, left)); };
      t.addEventListener('pointerenter', pause); t.addEventListener('pointerleave', resume);
      t.addEventListener('focusin', pause); t.addEventListener('focusout', resume);
    }
    return t;
  }
  function initToasts() {
    doc.addEventListener('click', (e) => {
      const b = e.target.closest('[data-toast]');
      if (!b || b.closest('[role="menu"]') || b.classList.contains('command__item')) return;
      toast({ title: b.dataset.toast, text: b.dataset.toastText || '', tone: b.dataset.toastTone || 'ok', ref: b.dataset.toastRef || '' });
    });
    $$('.toasts--static .toast__close').forEach((c) => c.addEventListener('click', () => dismissToast(c.closest('.toast'))));
  }

  /* ── 12. 탭 ──────────────────────────────────────────────────── */
  function selectTab(tab, focus = true) {
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
    list.dispatchEvent(new CustomEvent('gsa:tab', { bubbles: true, detail: { tab, value: tab.dataset.value } }));
  }
  function initTabs() {
    $$('[role="tablist"]').forEach((list) => {
      const tabs = $$('[role="tab"]', list);
      const sel = tabs.find((t) => t.getAttribute('aria-selected') === 'true') || tabs[0];
      if (sel) selectTab(sel, false);
      list.addEventListener('click', (e) => {
        const t = e.target.closest('[role="tab"]');
        if (t && !t.disabled && t.getAttribute('aria-disabled') !== 'true') selectTab(t);
      });
      list.addEventListener('keydown', (e) => {
        const all = $$('[role="tab"]', list).filter((t) => !t.disabled && t.getAttribute('aria-disabled') !== 'true');
        const i = all.indexOf(doc.activeElement);
        if (i < 0) return;
        const vert = list.getAttribute('aria-orientation') === 'vertical';
        const next = vert ? 'ArrowDown' : 'ArrowRight', prev = vert ? 'ArrowUp' : 'ArrowLeft';
        let n = null;
        if (e.key === next) n = all[(i + 1) % all.length];
        else if (e.key === prev) n = all[(i - 1 + all.length) % all.length];
        else if (e.key === 'Home') n = all[0];
        else if (e.key === 'End') n = all[all.length - 1];
        if (n) { e.preventDefault(); selectTab(n); }
      });
    });
  }

  /* ── 13. 아코디언 · 사이드바 묶음 ────────────────────────────── */
  function setAcc(trigger, open) {
    const panel = doc.getElementById(trigger.getAttribute('aria-controls'));
    trigger.setAttribute('aria-expanded', String(open));
    if (!panel) return;
    if (panel.classList.contains('acc__panel')) {
      if (open) panel.setAttribute('data-expanded', ''); else panel.removeAttribute('data-expanded');
      panel.inert = !open;
    } else panel.hidden = !open;
  }
  function initAcc() {
    $$('.acc__trigger, .side__group-btn').forEach((t) => setAcc(t, t.getAttribute('aria-expanded') === 'true'));
    doc.addEventListener('click', (e) => {
      const t = e.target.closest('.acc__trigger, .side__group-btn');
      if (!t || t.disabled) return;
      const open = t.getAttribute('aria-expanded') !== 'true';
      const acc = t.closest('.acc[data-single]');
      if (acc && open) $$('.acc__trigger[aria-expanded="true"]', acc).forEach((o) => o !== t && setAcc(o, false));
      setAcc(t, open);
    });
  }

  /* ── 14. 가로 스크롤 페이드 힌트 ─────────────────────────────── */
  function updateScroll(el) {
    const max = el.scrollWidth - el.clientWidth;
    el.toggleAttribute('data-more-start', el.scrollLeft > 2);
    el.toggleAttribute('data-more-end', max > 2 && el.scrollLeft < max - 2);
  }
  function initScrollx() {
    const els = $$('.scrollx');
    els.forEach((el) => { updateScroll(el); el.addEventListener('scroll', () => updateScroll(el), { passive: true }); });
    if ('ResizeObserver' in window) { const ro = new ResizeObserver((ents) => ents.forEach((en) => updateScroll(en.target))); els.forEach((el) => ro.observe(el)); }
    else addEventListener('resize', () => els.forEach(updateScroll));
  }

  /* ── 15. 캐러셀 「시트 넘기기」 ──────────────────────────────── */
  function initCarousel(c) {
    const track = $('.carousel__track', c);
    if (!track) return;
    const slides = $$('.carousel__slide', track);
    const counter = $('.carousel__counter', c);
    const bar = $('.carousel__bar', c);
    const prev = $('[data-carousel-prev]', c), next = $('[data-carousel-next]', c);
    const pad = (n) => String(n).padStart(2, '0');
    let cur = 0;
    const update = () => {
      const left = track.scrollLeft;
      let best = 0, d = Infinity;
      slides.forEach((s, i) => { const dd = Math.abs(s.offsetLeft - track.offsetLeft - left - 4); if (dd < d) { d = dd; best = i; } });
      if (track.scrollLeft + track.clientWidth >= track.scrollWidth - 4) best = Math.max(best, slides.length - 1 - Math.max(0, Math.floor(track.clientWidth / (slides[0]?.offsetWidth || 1)) - 1));
      cur = best;
      slides.forEach((s, i) => { s.classList.toggle('is-current', i === cur); s.setAttribute('aria-label', `${pad(i + 1)} / ${pad(slides.length)}`); });
      if (counter) counter.innerHTML = `<b>${pad(cur + 1)}</b> / ${pad(slides.length)}`;
      if (bar) bar.style.setProperty('--progress', `${((cur + 1) / slides.length) * 100}%`);
      if (prev) prev.disabled = track.scrollLeft <= 2;
      if (next) next.disabled = track.scrollLeft >= track.scrollWidth - track.clientWidth - 2;
    };
    const go = (i) => {
      const s = slides[Math.max(0, Math.min(slides.length - 1, i))];
      if (s) track.scrollTo({ left: s.offsetLeft - track.offsetLeft - 4, behavior: reduced() ? 'auto' : 'smooth' });
    };
    prev?.addEventListener('click', () => go(cur - 1));
    next?.addEventListener('click', () => go(cur + 1));
    track.addEventListener('scroll', () => { cancelAnimationFrame(track._raf); track._raf = requestAnimationFrame(update); }, { passive: true });
    track.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); go(cur + 1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(cur - 1); }
    });
    if (!track.hasAttribute('tabindex')) track.tabIndex = 0;
    update();
    addEventListener('resize', update);
  }

  /* ── 16. 발행 공지 띠 ────────────────────────────────────────── */
  function initMarquee(m) {
    const track = $('.marquee__track', m);
    const group = $('.marquee__group', track);
    if (!track || !group) return;
    if ($$('.marquee__group', track).length === 1) {
      const clone = group.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      $$('a, button', clone).forEach((n) => { n.tabIndex = -1; });
      track.append(clone);
    }
    const btn = $('[data-marquee-toggle]', m);
    btn?.addEventListener('click', () => {
      const paused = !m.classList.contains('is-paused');
      m.classList.toggle('is-paused', paused);
      btn.setAttribute('aria-pressed', String(paused));
      btn.setAttribute('aria-label', paused ? '공지 띠 다시 흐르기' : '공지 띠 멈추기');
    });
  }

  /* ── 17. 일람표: 정렬 · 필터 · 행 선택 ───────────────────────── */
  function cellValue(row, idx) {
    const cell = row.cells[idx];
    if (!cell) return '';
    const raw = cell.dataset.sort ?? cell.textContent.trim();
    const n = parseFloat(raw.replace(/[₩,\s㎡%장건]/g, ''));
    return /^[-₩\d,.\s㎡%장건]+$/.test(raw) && !Number.isNaN(n) ? n : raw;
  }
  function sortTable(btn) {
    const th = btn.closest('th');
    const table = th.closest('table');
    const tbody = table.tBodies[0];
    const idx = Array.from(th.parentElement.cells).indexOf(th);
    const dir = th.getAttribute('aria-sort') === 'ascending' ? 'descending' : 'ascending';
    $$('thead th[aria-sort]', table).forEach((h) => h.setAttribute('aria-sort', 'none'));
    th.setAttribute('aria-sort', dir);
    const rows = Array.from(tbody.rows).filter((r) => !r.classList.contains('tbl__empty'));
    rows.sort((a, b) => {
      const x = cellValue(a, idx), y = cellValue(b, idx);
      const c = typeof x === 'number' && typeof y === 'number' ? x - y : String(x).localeCompare(String(y), 'ko', { numeric: true });
      return dir === 'ascending' ? c : -c;
    });
    rows.forEach((r) => tbody.append(r));
    const live = $('[data-sort-status]', table.closest('.tbl-wrap')?.parentElement || doc);
    if (live) live.textContent = `${btn.textContent.trim()} ${dir === 'ascending' ? '오름차순' : '내림차순'} 정렬`;
  }
  function filterTable(input) {
    const table = doc.getElementById(input.dataset.tableFilter);
    if (!table) return;
    const q = input.value.trim().toLowerCase();
    let n = 0;
    Array.from(table.tBodies[0].rows).forEach((r) => {
      if (r.classList.contains('tbl__empty')) return;
      const hit = !q || r.textContent.toLowerCase().includes(q);
      r.hidden = !hit;
      if (hit) n++;
    });
    const empty = $('.tbl__empty', table);
    if (empty) empty.hidden = n > 0;
    const count = $(`[data-filter-count="${table.id}"]`);
    if (count) count.textContent = formatNum(n);
  }
  function initTables() {
    doc.addEventListener('click', (e) => {
      const s = e.target.closest('.tbl__sort');
      if (s) { sortTable(s); return; }
      const row = e.target.closest('.tbl tbody tr[data-href]');
      if (row && !e.target.closest('a, button, input, label, select')) { location.href = row.dataset.href; return; }
      const sel = e.target.closest('.tbl[data-selectable] tbody tr');
      if (sel && !e.target.closest('a, button, input, label, select')) {
        $$('tr[aria-selected="true"]', sel.parentElement).forEach((r) => r !== sel && r.setAttribute('aria-selected', 'false'));
        sel.setAttribute('aria-selected', String(sel.getAttribute('aria-selected') !== 'true'));
      }
    });
    doc.addEventListener('input', (e) => { if (e.target.matches('[data-table-filter]')) filterTable(e.target); });
    $$('.tbl tbody tr[data-href]').forEach((r) => {
      if (!r.hasAttribute('tabindex')) r.tabIndex = 0;
      r.addEventListener('keydown', (e) => { if (e.key === 'Enter') location.href = r.dataset.href; });
    });
  }

  /* ── 18. 페이지 매김 ─────────────────────────────────────────── */
  function renderPager(p) {
    const total = parseInt(p.dataset.total, 10) || 1;
    const cur = Math.min(Math.max(1, parseInt(p.dataset.current, 10) || 1), total);
    const list = $('.pager__list', p);
    if (!list) return;
    const pad = (n) => String(n).padStart(2, '0');
    const pages = new Set([1, total, cur - 1, cur, cur + 1]);
    if (cur <= 3) [2, 3, 4].forEach((n) => pages.add(n));
    if (cur >= total - 2) [total - 3, total - 2, total - 1].forEach((n) => pages.add(n));
    const nums = [...pages].filter((n) => n >= 1 && n <= total).sort((a, b) => a - b);
    let html = `<button class="pager__btn pager__btn--edge" type="button" data-page="prev" aria-label="이전 쪽"${cur === 1 ? ' disabled' : ''}>‹</button>`;
    nums.forEach((n, i) => {
      if (i && n - nums[i - 1] > 1) html += '<span class="pager__gap" aria-hidden="true">…</span>';
      html += `<button class="pager__btn" type="button" data-page="${n}" aria-label="${n}쪽"${n === cur ? ' aria-current="page"' : ''}>${pad(n)}</button>`;
    });
    html += `<button class="pager__btn pager__btn--edge" type="button" data-page="next" aria-label="다음 쪽"${cur === total ? ' disabled' : ''}>›</button>`;
    list.innerHTML = html;
    const info = $('[data-pager-current]', p);
    if (info) info.textContent = `${pad(cur)} / ${pad(total)}`;
  }
  function initPagers() {
    $$('[data-pager]').forEach((p) => {
      renderPager(p);
      p.addEventListener('click', (e) => {
        const b = e.target.closest('[data-page]');
        if (!b || b.disabled) return;
        const total = parseInt(p.dataset.total, 10) || 1;
        let cur = parseInt(p.dataset.current, 10) || 1;
        const v = b.dataset.page;
        cur = v === 'prev' ? cur - 1 : v === 'next' ? cur + 1 : parseInt(v, 10);
        p.dataset.current = String(Math.min(Math.max(1, cur), total));
        renderPager(p);
        ($(`[data-page="${p.dataset.current}"]`, p) || $('[aria-current]', p))?.focus();
        p.dispatchEvent(new CustomEvent('gsa:page', { bubbles: true, detail: { page: parseInt(p.dataset.current, 10) } }));
      });
    });
  }

  /* ── 19. 칸반: 드래그 · 열 이동 메뉴 · Alt+←/→ ──────────────── */
  function kbUpdate(kb) {
    $$('.kb__col', kb).forEach((col) => {
      const list = $('.kb__list', col);
      const n = $$('.kb-card', list).length;
      const c = $('.kb__count', col);
      if (c) c.textContent = String(n);
      const wip = parseInt(col.dataset.wip, 10);
      col.classList.toggle('is-over-wip', !!wip && n > wip);
      let empty = $('.kb__empty', list);
      if (!n && !empty) { empty = doc.createElement('p'); empty.className = 'kb__empty'; empty.textContent = '시트 없음 — 여기로 끌어 놓기'; list.append(empty); }
      if (n && empty) empty.remove();
    });
  }
  function kbMove(card, list, announce = true) {
    const kb = card.closest('.kb');
    list.append(card);
    kbUpdate(kb);
    if (!reduced()) { card.classList.remove('is-moved'); void card.offsetWidth; card.classList.add('is-moved'); }
    if (announce) {
      const col = list.closest('.kb__col');
      const name = col?.dataset.colName || $('.kb__title', col)?.firstChild?.textContent?.trim() || '';
      const no = $('.kb-card__no', card)?.textContent.trim() || '';
      toast({ title: `${no} → ${name}`, text: '작업 보드 열을 옮겼습니다.', tone: 'ok', duration: 3200 });
    }
  }
  function initKanban(kb) {
    let drag = null;
    $$('.kb-card', kb).forEach((card) => {
      card.setAttribute('draggable', 'true');
      if (!card.hasAttribute('tabindex')) card.tabIndex = 0;
    });
    kb.addEventListener('dragstart', (e) => {
      const card = e.target.closest('.kb-card');
      if (!card) return;
      drag = card;
      card.classList.add('is-dragging');
      e.dataTransfer.effectAllowed = 'move';
      try { e.dataTransfer.setData('text/plain', $('.kb-card__no', card)?.textContent || ''); } catch (err) { /* noop */ }
    });
    kb.addEventListener('dragend', () => { drag?.classList.remove('is-dragging'); drag = null; $$('.kb__list.is-over', kb).forEach((l) => l.classList.remove('is-over')); });
    kb.addEventListener('dragover', (e) => {
      const list = e.target.closest('.kb__list');
      if (!list || !drag) return;
      e.preventDefault();
      $$('.kb__list.is-over', kb).forEach((l) => l !== list && l.classList.remove('is-over'));
      list.classList.add('is-over');
    });
    kb.addEventListener('dragleave', (e) => { const list = e.target.closest('.kb__list'); if (list && !list.contains(e.relatedTarget)) list.classList.remove('is-over'); });
    kb.addEventListener('drop', (e) => {
      const list = e.target.closest('.kb__list');
      if (!list || !drag) return;
      e.preventDefault();
      list.classList.remove('is-over');
      const before = e.target.closest('.kb-card');
      if (before && before !== drag) { list.insertBefore(drag, before); kbUpdate(kb); } else if (drag.parentElement !== list) kbMove(drag, list);
    });
    // 키보드: 카드에서 Alt+←/→
    kb.addEventListener('keydown', (e) => {
      const card = e.target.closest('.kb-card');
      if (!card || e.target !== card || !e.altKey || (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight')) return;
      e.preventDefault();
      const cols = $$('.kb__col', kb);
      const i = cols.indexOf(card.closest('.kb__col'));
      const to = cols[i + (e.key === 'ArrowRight' ? 1 : -1)];
      if (to) { kbMove(card, $('.kb__list', to)); card.focus(); }
    });
    // 「열 이동」 메뉴 — 카드의 .kb-card__move 버튼이 연다
    kb.addEventListener('click', (e) => {
      const btn = e.target.closest('.kb-card__move');
      if (!btn) return;
      e.preventDefault();
      e.stopPropagation();
      const card = btn.closest('.kb-card');
      let panel = $('#kb-move-menu');
      if (!panel) {
        panel = doc.createElement('div');
        panel.className = 'menu__panel menu__panel--end';
        panel.id = 'kb-move-menu';
        panel.setAttribute('role', 'menu');
        panel.hidden = true;
      }
      const here = card.closest('.kb__col');
      panel.innerHTML = `<p class="menu__label">열 이동</p>${$$('.kb__col', kb).map((col, i) => {
        const name = col.dataset.colName || `열 ${i + 1}`;
        const same = col === here;
        return `<button class="menu__item" type="button" role="menuitem" data-kb-to="${i}"${same ? ' aria-disabled="true"' : ''}><span></span><span>${name}</span><span class="menu__key">${same ? '현재' : ''}</span></button>`;
      }).join('')}`;
      const host = btn.closest('.kb-card__top') || btn.parentElement;
      host.style.position = 'relative';
      host.append(panel);
      btn.setAttribute('aria-haspopup', 'menu');
      btn.setAttribute('aria-controls', 'kb-move-menu');
      panel.onclick = (ev) => {
        const it = ev.target.closest('[data-kb-to]');
        if (!it || it.getAttribute('aria-disabled') === 'true') return;
        const to = $$('.kb__col', kb)[parseInt(it.dataset.kbTo, 10)];
        closeFloats();
        kbMove(card, $('.kb__list', to));
        btn.focus();
      };
      if (openFloat && openFloat.trigger === btn) closeFloats(); else openMenu(btn);
    }, true);
    kbUpdate(kb);
  }

  /* ── 20. 코드 주기 블록: 줄번호 · 복사 ───────────────────────── */
  async function copyText(text) {
    try { await navigator.clipboard.writeText(text); return true; } catch (e) {
      const ta = doc.createElement('textarea');
      ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
      doc.body.append(ta); ta.select();
      let ok = false;
      try { ok = doc.execCommand('copy'); } catch (err) { ok = false; }
      ta.remove();
      return ok;
    }
  }
  function initCode() {
    $$('.code__pre code').forEach((code) => {
      if ($('.code__line', code)) return;
      const lines = code.innerHTML.replace(/\n$/, '').split('\n');
      code.innerHTML = lines.map((l) => `<span class="code__line">${l || ' '}</span>`).join('');
    });
    doc.addEventListener('click', async (e) => {
      const b = e.target.closest('[data-copy]');
      if (!b) return;
      const src = b.dataset.copy ? doc.getElementById(b.dataset.copy) : b.closest('.code')?.querySelector('code');
      const text = src ? $$('.code__line', src).map((l) => l.textContent).join('\n') || src.textContent : b.dataset.copyText || '';
      const ok = await copyText(text);
      const label = $('.code__copy-label', b) || b;
      const orig = b.dataset.label || label.textContent;
      b.dataset.label = orig;
      label.textContent = ok ? '복사됨' : '복사 실패';
      b.setAttribute('data-copied', '');
      setTimeout(() => { label.textContent = orig; b.removeAttribute('data-copied'); }, 1600);
    });
  }

  /* ── 21. 폼: 검증(구름) · range 치수 · 세그먼트 ─────────────── */
  const MSG = {
    valueMissing: '필수 입력입니다.',
    typeMismatch: '형식을 확인하세요.',
    patternMismatch: '형식을 확인하세요.',
    rangeUnderflow: (i) => `${formatNum(i.min)} 이상이어야 합니다.`,
    rangeOverflow: (i) => `${formatNum(i.max)} 이하여야 합니다.`,
    tooShort: (i) => `${i.minLength}자 이상 입력하세요.`,
    stepMismatch: '단위를 확인하세요.',
  };
  function fieldError(input, msg) {
    const field = input.closest('.field');
    if (!field) return;
    const box = $('.field__box', field);
    const err = $('.field__error', field);
    if (msg) {
      input.setAttribute('aria-invalid', 'true');
      field.classList.add('is-error');
      if (err) { err.textContent = msg; ensureId(err, 'err'); input.setAttribute('aria-describedby', err.id); }
      if (box && !box.classList.contains('cloud')) { box.classList.add('cloud'); drawCloud(box); }
    } else {
      input.removeAttribute('aria-invalid');
      field.classList.remove('is-error');
      box?.classList.remove('cloud');
      const hint = $('.field__hint', field);
      if (hint) input.setAttribute('aria-describedby', ensureId(hint, 'hint')); else input.removeAttribute('aria-describedby');
    }
  }
  function validate(input) {
    if (!input.willValidate) return true;
    const v = input.validity;
    if (v.valid && !input.dataset.match) { fieldError(input, null); return true; }
    if (input.dataset.match) {
      const other = doc.getElementById(input.dataset.match);
      if (other && other.value !== input.value) { fieldError(input, input.dataset.errorMatch || '값이 일치하지 않습니다.'); return false; }
      if (v.valid) { fieldError(input, null); return true; }
    }
    const key = Object.keys(MSG).find((k) => v[k]);
    const custom = input.dataset.error;
    const m = custom || (typeof MSG[key] === 'function' ? MSG[key](input) : MSG[key]) || '값을 확인하세요.';
    fieldError(input, m);
    return false;
  }
  function syncRange(r) {
    const input = $('.range__input', r);
    if (!input) return;
    const min = parseFloat(input.min) || 0, max = parseFloat(input.max) || 100, val = parseFloat(input.value);
    r.style.setProperty('--p', `${((val - min) / (max - min)) * 100}%`);
    const unit = r.dataset.unit || '';
    const vEl = $('.range__dim .dim__value', r);
    if (vEl) vEl.textContent = `${formatNum(val)}${unit}`;
    $$(`[data-range-out="${input.id}"]`).forEach((o) => { o.textContent = `${formatNum(val)}${o.dataset.unit ?? unit}`; });
  }
  function initForms() {
    doc.addEventListener('focusout', (e) => {
      const i = e.target;
      if (i.matches?.('.field__input') && (i.value || i.closest('.field.is-error'))) validate(i);
    });
    doc.addEventListener('input', (e) => {
      const i = e.target;
      if (i.matches('.field__input') && i.closest('.field.is-error')) validate(i);
      const r = i.closest('.range');
      if (r) syncRange(r);
      const counter = i.dataset.counter && doc.getElementById(i.dataset.counter);
      if (counter) counter.textContent = `${formatNum(i.value.length)} / ${formatNum(i.maxLength)}`;
    });
    doc.addEventListener('submit', (e) => {
      const f = e.target;
      if (!f.matches('[data-validate]')) return;
      e.preventDefault();
      const inputs = $$('.field__input, .check__input, .radio__input', f).filter((i) => i.willValidate);
      const bad = inputs.filter((i) => !validate(i));
      if (bad.length) {
        bad[0].focus();
        toast({ title: `입력 확인 ${bad.length}건`, text: '구름으로 표시한 칸을 고치세요.', tone: 'red', duration: 4000 });
        return;
      }
      const btn = $('[type="submit"]', f);
      if (btn) {
        btn.setAttribute('aria-busy', 'true');
        if (!$('.spinner', btn)) btn.insertAdjacentHTML('beforeend', spinnerSVG(18));
      }
      setTimeout(() => {
        btn?.removeAttribute('aria-busy');
        toast({ title: f.dataset.success || '저장했습니다.', text: f.dataset.successText || '', tone: 'ok', ref: f.dataset.successRef || '' });
        f.dispatchEvent(new CustomEvent('gsa:submitted', { bubbles: true }));
      }, reduced() ? 0 : 900);
    });
    $$('.range').forEach(syncRange);
    // 세그먼트: 그룹 안에서 하나만 눌림
    doc.addEventListener('click', (e) => {
      const b = e.target.closest('.seg__btn');
      if (!b || b.disabled) return;
      const seg = b.closest('.seg');
      const attr = seg.getAttribute('role') === 'radiogroup' ? 'aria-checked' : 'aria-pressed';
      $$('.seg__btn', seg).forEach((x) => { x.setAttribute(attr, String(x === b)); if (attr === 'aria-checked') x.tabIndex = x === b ? 0 : -1; });
      seg.dispatchEvent(new CustomEvent('gsa:seg', { bubbles: true, detail: { value: b.dataset.value ?? b.textContent.trim(), button: b } }));
    });
    doc.addEventListener('keydown', (e) => {
      const b = e.target.closest?.('.seg[role="radiogroup"] .seg__btn');
      if (!b || !['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) return;
      e.preventDefault();
      const all = $$('.seg__btn:not(:disabled)', b.closest('.seg'));
      const i = all.indexOf(b);
      const n = all[(i + (e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : -1) + all.length) % all.length];
      n.focus(); n.click();
    });
    // 버튼 로딩 시연: [data-busy="1200"]
    doc.addEventListener('click', (e) => {
      const b = e.target.closest('[data-busy]');
      if (!b || b.getAttribute('aria-busy') === 'true') return;
      b.setAttribute('aria-busy', 'true');
      if (!$('.spinner', b)) b.insertAdjacentHTML('beforeend', spinnerSVG(18));
      setTimeout(() => {
        b.removeAttribute('aria-busy');
        if (b.dataset.busyToast) toast({ title: b.dataset.busyToast, tone: 'ok' });
      }, parseInt(b.dataset.busy, 10) || 1200);
    });
  }
  function spinnerSVG(size = 24) {
    const cls = size <= 16 ? ' spinner--16' : size >= 40 ? ' spinner--40' : '';
    return `<svg class="spinner${cls}" viewBox="0 0 24 24" aria-hidden="true"><circle class="spinner__track" cx="12" cy="12" r="9"/><circle class="spinner__arc" cx="12" cy="12" r="9" pathLength="1"/><g class="spinner__pen"><circle cx="12" cy="3" r="1.6"/></g></svg>`;
  }

  /* ── 22. 달력 ────────────────────────────────────────────────── */
  function selectDay(day, focus = false) {
    const cal = day.closest('.cal');
    $$('.cal__day[aria-pressed="true"]', cal).forEach((d) => d.setAttribute('aria-pressed', 'false'));
    day.setAttribute('aria-pressed', 'true');
    $$('.cal__day', cal).forEach((d) => { d.tabIndex = d === day ? 0 : -1; });
    if (focus) day.focus();
    const ag = $('[data-cal-agenda]', cal);
    if (ag) {
      const head = $('[data-cal-agenda-date]', cal);
      if (head) head.textContent = day.dataset.label || day.getAttribute('aria-label') || '';
      const items = (day.dataset.agenda || '').split(';').map((s) => s.trim()).filter(Boolean);
      ag.innerHTML = '';
      if (!items.length) { const li = doc.createElement('li'); li.className = 'cal__event'; li.innerHTML = '<time>—</time><span></span>'; li.lastChild.textContent = '일정 없음'; ag.append(li); }
      items.forEach((it) => {
        const [time, title] = it.split('|');
        const li = doc.createElement('li'); li.className = 'cal__event';
        const t = doc.createElement('time'); t.textContent = time || '';
        const s = doc.createElement('span'); s.textContent = title || '';
        li.append(t, s); ag.append(li);
      });
    }
    cal.dispatchEvent(new CustomEvent('gsa:day', { bubbles: true, detail: { day } }));
  }
  function initCalendar() {
    $$('.cal').forEach((cal) => {
      const days = $$('.cal__day:not(:disabled)', cal);
      const sel = days.find((d) => d.getAttribute('aria-pressed') === 'true') || days.find((d) => d.getAttribute('aria-current') === 'date') || days[0];
      days.forEach((d) => { d.tabIndex = d === sel ? 0 : -1; if (!d.hasAttribute('aria-pressed')) d.setAttribute('aria-pressed', 'false'); });
      cal.addEventListener('click', (e) => { const d = e.target.closest('.cal__day'); if (d && !d.disabled) selectDay(d); });
      cal.addEventListener('keydown', (e) => {
        const d = e.target.closest('.cal__day');
        if (!d) return;
        const all = $$('.cal__day', cal);
        const i = all.indexOf(d);
        const delta = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: 7, ArrowUp: -7 }[e.key];
        if (delta === undefined) return;
        e.preventDefault();
        let n = all[i + delta];
        while (n && n.disabled) n = all[all.indexOf(n) + Math.sign(delta)];
        if (n) selectDay(n, true);
      });
    });
  }

  /* ── 23. 단계 ────────────────────────────────────────────────── */
  function setStep(steps, index) {
    $$('.steps__item', steps).forEach((it, i) => {
      it.dataset.state = i < index ? 'done' : i === index ? 'current' : 'todo';
      if (i === index) it.setAttribute('aria-current', 'step'); else it.removeAttribute('aria-current');
      const b = $('.steps__btn', it);
      if (b) b.disabled = i > index;
    });
  }

  /* ── 24. 전역 Esc ────────────────────────────────────────────── */
  function initEsc() {
    doc.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape' || openFloat) return;
      const top = stack[stack.length - 1];
      if (top) { e.preventDefault(); closeOverlay(top.el); }
    });
  }

  /* ── 25. 초기화 ──────────────────────────────────────────────── */
  function init() {
    initTheme();
    initLayers();
    initSheets();
    initOverlays();
    initCommand();
    initFloats();
    initTips();
    initToasts();
    initTabs();
    initAcc();
    initScrollx();
    $$('.carousel').forEach(initCarousel);
    $$('.marquee').forEach(initMarquee);
    initTables();
    initPagers();
    $$('.kb').forEach(initKanban);
    initCode();
    initForms();
    initCalendar();
    initEsc();
    initDrawing();
    initCrosshair();
    initCounts();
    root.classList.add('is-ready');
  }

  window.GSA = {
    toast,
    open: (id, trigger) => openOverlay(typeof id === 'string' ? doc.getElementById(id) : id, trigger),
    close: (id) => closeOverlay(typeof id === 'string' ? doc.getElementById(id) : id),
    redraw: (el) => plot(typeof el === 'string' ? doc.getElementById(el) : el),
    cloud: drawCloud,
    stamp,
    countTo,
    setStep,
    formatNum,
    setTheme: (t) => setTheme(t, true),
    spinner: spinnerSVG,
  };

  // 테마는 <head> 인라인 스크립트가 먼저 정한다. 여기서는 토글 상태와 나머지 동작을 붙인다.
  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', init); else init();
})();
