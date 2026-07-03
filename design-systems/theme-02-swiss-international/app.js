/* ============================================================================
   THEME-02 · SWISS INTERNATIONAL · app.js
   ----------------------------------------------------------------------------
   All interactions in dependency-free vanilla JS. Works from file:// on every
   page (load once, near the end of <body>). Every module guards on element
   presence and uses event delegation, so it is safe & idempotent anywhere.

   Public API (window.Swiss):
     toast(opts) · openModal(id) · closeTop() · openCmdk() · setTheme(name)
   Data-attribute hooks are documented inline next to each module.
   ========================================================================== */
(function () {
  "use strict";

  var doc = document;
  var root = doc.documentElement;
  var Swiss = {};
  window.Swiss = Swiss;

  /* -- tiny helpers -------------------------------------------------------- */
  function $(sel, ctx) { return (ctx || doc).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || doc).querySelectorAll(sel)); }
  function on(el, ev, fn, opts) { if (el) el.addEventListener(ev, fn, opts); }
  function focusables(el) {
    return $$('a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])', el)
      .filter(function (n) { return n.offsetParent !== null || n === doc.activeElement; });
  }
  var prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* =======================================================================
     THEME · light / dark, persisted
     Hook: [data-action="toggle-theme"]
     ======================================================================= */
  var THEME_KEY = 'swiss-theme';
  function setTheme(name) {
    root.setAttribute('data-theme', name);
    try { localStorage.setItem(THEME_KEY, name); } catch (e) {}
    $$('[data-action="toggle-theme"]').forEach(function (b) {
      b.setAttribute('aria-pressed', String(name === 'dark'));
      var lbl = b.querySelector('[data-theme-label]');
      if (lbl) lbl.textContent = name === 'dark' ? 'Dark' : 'Light';
    });
  }
  Swiss.setTheme = setTheme;
  (function initTheme() {
    var saved;
    try { saved = localStorage.getItem(THEME_KEY); } catch (e) {}
    if (saved) { setTheme(saved); }
    else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) { setTheme('dark'); }
    else { setTheme('light'); }
  })();

  /* =======================================================================
     GRID OVERLAY · 12-column red overlay toggle
     Hook: [data-action="toggle-grid"]   ·   keyboard: g
     ======================================================================= */
  function buildGridOverlay() {
    if ($('.grid-overlay')) return;
    var ov = doc.createElement('div');
    ov.className = 'grid-overlay';
    ov.setAttribute('aria-hidden', 'true');
    var cols = 12;
    for (var i = 0; i < cols; i++) {
      var c = doc.createElement('span');
      c.className = 'grid-overlay__col';
      ov.appendChild(c);
    }
    doc.body.appendChild(ov);
  }
  function toggleGrid(force) {
    buildGridOverlay();
    var on_ = doc.body.classList.toggle('grid-overlay-on', force);
    $$('[data-action="toggle-grid"]').forEach(function (b) { b.setAttribute('aria-pressed', String(on_)); });
  }
  Swiss.toggleGrid = toggleGrid;

  /* =======================================================================
     GLOBAL CLICK DELEGATION for [data-action]
     ======================================================================= */
  on(doc, 'click', function (e) {
    var t = e.target.closest('[data-action]');
    if (!t) return;
    var action = t.getAttribute('data-action');
    switch (action) {
      case 'toggle-theme': setTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'); break;
      case 'toggle-grid': toggleGrid(); break;
      case 'open-cmdk': e.preventDefault(); openCmdk(); break;
      case 'toggle-sidebar': {
        var sel = t.getAttribute('data-target');
        var sb = sel ? $(sel) : $('.sidebar');
        if (sb) { var c = sb.classList.toggle('is-collapsed'); t.setAttribute('aria-pressed', String(c)); }
        break;
      }
    }
  });

  /* =======================================================================
     OVERLAYS · shared scrim + Esc stack (modal · drawer · cmdk)
     Hooks: [data-open-modal="#id"] [data-close-modal]
            [data-open-drawer="#id"] [data-close-drawer]
     ======================================================================= */
  var scrim = null;
  var stack = [];      // [{el, restore}]
  function getScrim() {
    if (!scrim) {
      scrim = doc.createElement('div');
      scrim.className = 'scrim';
      doc.body.appendChild(scrim);
      on(scrim, 'click', function () { closeTop(); });
    }
    return scrim;
  }
  function lockScroll(lock) { doc.body.style.overflow = lock ? 'hidden' : ''; }

  function openOverlay(el) {
    if (!el || stack.some(function (s) { return s.el === el; })) return;
    var restore = doc.activeElement;
    getScrim().classList.add('is-open');
    el.classList.add('is-open');
    el.removeAttribute('hidden');
    el.setAttribute('aria-hidden', 'false');
    stack.push({ el: el, restore: restore });
    lockScroll(true);
    // focus first sensible target
    var f = el.querySelector('[data-autofocus]') || focusables(el)[0];
    if (f) setTimeout(function () { f.focus(); }, prefersReduced ? 0 : 60);
  }
  function closeOverlay(el) {
    var idx = -1;
    stack.forEach(function (s, i) { if (s.el === el) idx = i; });
    if (idx === -1) return;
    var entry = stack.splice(idx, 1)[0];
    el.classList.remove('is-open');
    el.setAttribute('aria-hidden', 'true');
    if (!stack.length) { getScrim().classList.remove('is-open'); lockScroll(false); }
    if (entry.restore && entry.restore.focus) entry.restore.focus();
  }
  function closeTop() { if (stack.length) closeOverlay(stack[stack.length - 1].el); }
  Swiss.closeTop = closeTop;
  Swiss.openModal = function (id) { openOverlay($(id[0] === '#' ? id : '#' + id)); };

  on(doc, 'click', function (e) {
    var openM = e.target.closest('[data-open-modal]');
    if (openM) { e.preventDefault(); openOverlay($(openM.getAttribute('data-open-modal'))); return; }
    var openD = e.target.closest('[data-open-drawer]');
    if (openD) { e.preventDefault(); openOverlay($(openD.getAttribute('data-open-drawer'))); return; }
    if (e.target.closest('[data-close-modal],[data-close-drawer],[data-close-overlay]')) { closeTop(); return; }
    // click on modal backdrop area (outside the panel)
    var modal = e.target.closest('.modal, .cmdk');
    if (modal && e.target === modal) closeTop();
  });

  // Focus trap + Esc for the whole stack
  on(doc, 'keydown', function (e) {
    if (e.key === 'Escape' && stack.length) { e.preventDefault(); closeTop(); return; }
    if (e.key === 'Tab' && stack.length) {
      var top = stack[stack.length - 1].el;
      var f = focusables(top);
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && doc.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && doc.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  /* =======================================================================
     TOASTS · stacked, auto-dismiss
     API: Swiss.toast({title, text, variant, duration})
     Hook: [data-toast] with data-title/data-text/data-variant
     ======================================================================= */
  function toastRegion() {
    var r = $('.toast-region');
    if (!r) { r = doc.createElement('div'); r.className = 'toast-region'; r.setAttribute('role', 'region'); r.setAttribute('aria-label', 'Notifications'); doc.body.appendChild(r); }
    return r;
  }
  var ICONS = {
    success: '<svg viewBox="0 0 16 16" stroke="currentColor" stroke-width="1.5" fill="none"><path d="M3 8.5l3 3 7-7"/></svg>',
    danger: '<svg viewBox="0 0 16 16" stroke="currentColor" stroke-width="1.5" fill="none"><path d="M8 4v5M8 11.5v.5"/><rect x="1.5" y="1.5" width="13" height="13"/></svg>',
    warning: '<svg viewBox="0 0 16 16" stroke="currentColor" stroke-width="1.5" fill="none"><path d="M8 2L1.5 14h13L8 2zM8 6.5v3.5M8 12v.2"/></svg>',
    info: '<svg viewBox="0 0 16 16" stroke="currentColor" stroke-width="1.5" fill="none"><circle cx="8" cy="8" r="6.5"/><path d="M8 7.5v3.5M8 5v.2"/></svg>'
  };
  Swiss.toast = function (opts) {
    opts = opts || {};
    var region = toastRegion();
    var el = doc.createElement('div');
    el.className = 'toast' + (opts.variant ? ' toast--' + opts.variant : '');
    el.setAttribute('role', 'status');
    var icon = ICONS[opts.variant] || '';
    el.innerHTML =
      (icon ? '<span class="toast__icon" style="color:var(--color-' + (opts.variant === 'success' ? 'success' : opts.variant === 'danger' ? 'danger' : opts.variant === 'warning' ? 'warning' : 'info') + ')">' + icon + '</span>' : '') +
      '<div class="toast__body">' +
        (opts.title ? '<div class="toast__title">' + opts.title + '</div>' : '') +
        (opts.text ? '<div class="toast__text">' + opts.text + '</div>' : '') +
      '</div>' +
      '<button class="toast__close" aria-label="Dismiss"><svg viewBox="0 0 16 16" width="14" height="14" stroke="currentColor" stroke-width="1.5"><path d="M4 4l8 8M12 4l-8 8"/></svg></button>';
    region.appendChild(el);
    requestAnimationFrame(function () { el.classList.add('is-visible'); });
    function dismiss() {
      el.classList.add('is-leaving'); el.classList.remove('is-visible');
      setTimeout(function () { el.remove(); }, 260);
    }
    on(el.querySelector('.toast__close'), 'click', dismiss);
    var dur = opts.duration == null ? 4200 : opts.duration;
    if (dur > 0) setTimeout(dismiss, dur);
    return dismiss;
  };
  on(doc, 'click', function (e) {
    var t = e.target.closest('[data-toast]');
    if (!t) return;
    Swiss.toast({ title: t.getAttribute('data-title'), text: t.getAttribute('data-text'), variant: t.getAttribute('data-variant') });
  });

  /* =======================================================================
     TABS  ·  [data-tabs] > [role=tablist] > [role=tab][aria-controls=panelId]
     ======================================================================= */
  function activateTab(tab) {
    var list = tab.closest('[role="tablist"]');
    if (!list) return;
    $$('[role="tab"]', list).forEach(function (t) {
      var sel = t === tab;
      t.setAttribute('aria-selected', String(sel));
      t.tabIndex = sel ? 0 : -1;
      var panel = doc.getElementById(t.getAttribute('aria-controls'));
      if (panel) panel.hidden = !sel;
    });
  }
  on(doc, 'click', function (e) {
    var tab = e.target.closest('[role="tab"]');
    if (tab) { activateTab(tab); }
  });
  on(doc, 'keydown', function (e) {
    var tab = e.target.closest('[role="tab"]');
    if (!tab) return;
    var tabs = $$('[role="tab"]', tab.closest('[role="tablist"]'));
    var i = tabs.indexOf(tab), n = tabs.length;
    var next;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = tabs[(i + 1) % n];
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = tabs[(i - 1 + n) % n];
    else if (e.key === 'Home') next = tabs[0];
    else if (e.key === 'End') next = tabs[n - 1];
    if (next) { e.preventDefault(); next.focus(); activateTab(next); }
  });

  /* =======================================================================
     ACCORDION  ·  .accordion__trigger[aria-controls=panelId][aria-expanded]
     ======================================================================= */
  on(doc, 'click', function (e) {
    var trg = e.target.closest('.accordion__trigger');
    if (!trg) return;
    var panel = doc.getElementById(trg.getAttribute('aria-controls'));
    var open = trg.getAttribute('aria-expanded') === 'true';
    var single = trg.closest('[data-accordion="single"]');
    if (single && !open) {
      $$('.accordion__trigger', single).forEach(function (o) {
        if (o !== trg) { o.setAttribute('aria-expanded', 'false'); var p = doc.getElementById(o.getAttribute('aria-controls')); if (p) p.classList.remove('is-open'); }
      });
    }
    trg.setAttribute('aria-expanded', String(!open));
    if (panel) panel.classList.toggle('is-open', !open);
  });

  /* =======================================================================
     SEGMENTED CONTROL & generic .is-active toggler with optional panels
     Hook: [data-segmented] with .segmented__item[data-panel="#id"]
           or  [data-toggle-group] with [data-value] (e.g. price month/year)
     ======================================================================= */
  on(doc, 'click', function (e) {
    var item = e.target.closest('.segmented__item, [data-seg-item]');
    if (!item) return;
    var group = item.closest('.segmented, [data-segmented], [data-toggle-group]');
    if (!group) return;
    $$('.segmented__item, [data-seg-item]', group).forEach(function (n) { n.setAttribute('aria-selected', 'false'); n.classList.remove('is-active'); });
    item.setAttribute('aria-selected', 'true'); item.classList.add('is-active');
    // panel switching
    var panelSel = item.getAttribute('data-panel');
    if (panelSel) {
      var scope = group.getAttribute('data-panels') ? $(group.getAttribute('data-panels')) : doc;
      $$('[data-seg-panel]', scope).forEach(function (p) { p.hidden = true; });
      var panel = $(panelSel); if (panel) panel.hidden = false;
    }
    // value broadcast (e.g. billing toggle)
    var val = item.getAttribute('data-value');
    if (val && group.hasAttribute('data-toggle-group')) {
      var targetSel = group.getAttribute('data-bind');
      $$(targetSel || '[data-bind-value]').forEach(function (n) {
        var map = n.getAttribute('data-' + val);
        if (map != null) n.textContent = map;
      });
      group.dispatchEvent(new CustomEvent('seg:change', { detail: { value: val }, bubbles: true }));
    }
  });

  /* =======================================================================
     DROPDOWN / MENU / POPOVER  ·  toggle .is-open, outside-click, Esc
     Hook: .dropdown > [data-dropdown-trigger] + .dropdown__menu
           .popover  > [data-popover-trigger] + .popover__pop
     ======================================================================= */
  function closeAllPoppers(except) {
    $$('.dropdown.is-open, .popover.is-open, .combobox .listbox.is-open, .datepicker.is-open').forEach(function (n) {
      if (except && (n === except || n.contains(except))) return;
      n.classList.remove('is-open');
      var trg = n.querySelector('[aria-expanded="true"]');
      if (trg) trg.setAttribute('aria-expanded', 'false');
      var lb = n.querySelector('.listbox.is-open'); if (lb) lb.classList.remove('is-open');
    });
  }
  on(doc, 'click', function (e) {
    var trg = e.target.closest('[data-dropdown-trigger],[data-popover-trigger]');
    if (trg) {
      var wrap = trg.closest('.dropdown, .popover');
      var isOpen = wrap.classList.contains('is-open');
      closeAllPoppers();
      if (!isOpen) { wrap.classList.add('is-open'); trg.setAttribute('aria-expanded', 'true'); }
      else { wrap.classList.remove('is-open'); trg.setAttribute('aria-expanded', 'false'); }
      return;
    }
    if (!e.target.closest('.dropdown, .popover, .combobox, .datepicker')) closeAllPoppers();
    // close menu after choosing an item
    var mi = e.target.closest('.menu__item');
    if (mi && !mi.hasAttribute('aria-disabled')) { setTimeout(closeAllPoppers, 10); }
  });
  on(doc, 'keydown', function (e) { if (e.key === 'Escape') closeAllPoppers(); });

  /* =======================================================================
     COMBOBOX / custom SELECT  ·  filter + select
     Hook: .combobox > .combobox__trigger[aria-expanded] + .listbox > .listbox__option
     ======================================================================= */
  on(doc, 'click', function (e) {
    var trg = e.target.closest('.combobox__trigger');
    if (trg) {
      var box = trg.closest('.combobox');
      var lb = box.querySelector('.listbox');
      var open = trg.getAttribute('aria-expanded') === 'true';
      closeAllPoppers();
      if (!open) { trg.setAttribute('aria-expanded', 'true'); lb.classList.add('is-open'); box.classList.add('is-open'); }
      return;
    }
    var opt = e.target.closest('.listbox__option');
    if (opt) {
      var box2 = opt.closest('.combobox');
      if (box2) {
        var multi = box2.hasAttribute('data-multi');
        if (multi) {
          opt.setAttribute('aria-selected', opt.getAttribute('aria-selected') === 'true' ? 'false' : 'true');
        } else {
          $$('.listbox__option', box2).forEach(function (o) { o.setAttribute('aria-selected', 'false'); });
          opt.setAttribute('aria-selected', 'true');
          var label = box2.querySelector('.combobox__value');
          if (label) { label.textContent = opt.getAttribute('data-label') || opt.textContent.trim(); label.classList.remove('is-placeholder'); }
          closeAllPoppers();
        }
      }
    }
  });
  // filter combobox by typing
  on(doc, 'input', function (e) {
    var inp = e.target.closest('[data-combobox-filter]');
    if (!inp) return;
    var box = inp.closest('.combobox') || $(inp.getAttribute('data-combobox-filter'));
    var q = inp.value.toLowerCase();
    var any = false;
    $$('.listbox__option', box).forEach(function (o) {
      var match = o.textContent.toLowerCase().indexOf(q) !== -1;
      o.hidden = !match; if (match) any = true;
    });
    var empty = box.querySelector('.listbox__empty');
    if (empty) empty.hidden = any;
  });

  /* =======================================================================
     CHIP INPUT  ·  add on Enter, remove on click / Backspace
     Hook: .chip-input > .chip-input__field
     ======================================================================= */
  function makeChip(text) {
    var c = doc.createElement('span');
    c.className = 'chip';
    c.innerHTML = '<span>' + text + '</span><button class="chip__remove" aria-label="Remove ' + text + '"><svg viewBox="0 0 12 12" stroke="currentColor" stroke-width="1.4"><path d="M3 3l6 6M9 3l-6 6"/></svg></button>';
    return c;
  }
  on(doc, 'keydown', function (e) {
    var field = e.target.closest('.chip-input__field');
    if (!field) return;
    var wrap = field.closest('.chip-input');
    if (e.key === 'Enter' && field.value.trim()) {
      e.preventDefault();
      wrap.insertBefore(makeChip(field.value.trim()), field);
      field.value = '';
    } else if (e.key === 'Backspace' && !field.value) {
      var chips = $$('.chip', wrap);
      if (chips.length) chips[chips.length - 1].remove();
    }
  });
  on(doc, 'click', function (e) {
    var rm = e.target.closest('.chip__remove');
    if (rm) rm.closest('.chip').remove();
  });

  /* =======================================================================
     SLIDER value display · STEPPER · RATING · TOGGLE label
     ======================================================================= */
  on(doc, 'input', function (e) {
    var s = e.target.closest('input[type="range"][data-slider]');
    if (s) {
      var out = $(s.getAttribute('data-slider')) || s.closest('.slider').querySelector('[data-slider-value]');
      if (out) out.textContent = (s.getAttribute('data-prefix') || '') + s.value + (s.getAttribute('data-suffix') || '');
    }
  });
  on(doc, 'click', function (e) {
    var step = e.target.closest('[data-step]');
    if (step) {
      var input = step.closest('.stepper').querySelector('.stepper__input');
      var min = input.min !== '' ? +input.min : -Infinity;
      var max = input.max !== '' ? +input.max : Infinity;
      var v = (+input.value || 0) + (+step.getAttribute('data-step'));
      input.value = Math.max(min, Math.min(max, v));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    }
    var star = e.target.closest('[data-rating-value]');
    if (star) {
      var rate = star.closest('[data-rating]');
      var val = +star.getAttribute('data-rating-value');
      $$('[data-rating-value]', rate).forEach(function (st) { st.classList.toggle('is-on', +st.getAttribute('data-rating-value') <= val); });
      var hidden = rate.querySelector('input[type="hidden"]'); if (hidden) hidden.value = val;
      var lbl = rate.querySelector('.rating__value'); if (lbl) lbl.textContent = val.toFixed(1);
    }
  });
  on(doc, 'change', function (e) {
    var tog = e.target.closest('input[data-toggle]');
    if (tog) {
      var st = tog.closest('.toggle').querySelector('[data-toggle-state]');
      if (st) st.textContent = tog.checked ? (tog.getAttribute('data-on') || 'On') : (tog.getAttribute('data-off') || 'Off');
    }
  });

  /* =======================================================================
     TABLE  ·  sort + select-all + row select
     Hook: th[data-sortable] (with .table__sort) · [data-select-all] · [data-row-select]
     ======================================================================= */
  on(doc, 'click', function (e) {
    var sortBtn = e.target.closest('.table__sort');
    if (sortBtn) {
      var th = sortBtn.closest('th');
      var table = th.closest('table');
      var idx = Array.prototype.indexOf.call(th.parentNode.children, th);
      var cur = th.getAttribute('aria-sort');
      var dir = cur === 'ascending' ? 'descending' : 'ascending';
      $$('th', th.parentNode).forEach(function (h) { h.removeAttribute('aria-sort'); });
      th.setAttribute('aria-sort', dir);
      var tbody = table.tBodies[0];
      var rows = $$('tr', tbody);
      rows.sort(function (a, b) {
        var av = cellVal(a.children[idx]), bv = cellVal(b.children[idx]);
        if (av < bv) return dir === 'ascending' ? -1 : 1;
        if (av > bv) return dir === 'ascending' ? 1 : -1;
        return 0;
      });
      rows.forEach(function (r) { tbody.appendChild(r); });
    }
  });
  function cellVal(td) {
    if (!td) return '';
    var d = td.getAttribute('data-sort-value');
    if (d != null) { var n = parseFloat(d); return isNaN(n) ? d.toLowerCase() : n; }
    var txt = td.textContent.trim().replace(/[$,%]/g, '');
    var num = parseFloat(txt);
    return isNaN(num) ? td.textContent.trim().toLowerCase() : num;
  }
  on(doc, 'change', function (e) {
    var all = e.target.closest('[data-select-all]');
    if (all) {
      var table = all.closest('table');
      $$('[data-row-select]', table).forEach(function (cb) { cb.checked = all.checked; setRowSel(cb); });
      updateBulk(table);
    }
    var rs = e.target.closest('[data-row-select]');
    if (rs) {
      setRowSel(rs);
      var table2 = rs.closest('table');
      var boxes = $$('[data-row-select]', table2);
      var checked = boxes.filter(function (b) { return b.checked; });
      var head = table2.querySelector('[data-select-all]');
      if (head) { head.checked = checked.length === boxes.length; head.indeterminate = checked.length > 0 && checked.length < boxes.length; }
      updateBulk(table2);
    }
  });
  function setRowSel(cb) { var tr = cb.closest('tr'); if (tr) tr.setAttribute('aria-selected', String(cb.checked)); }
  function updateBulk(table) {
    var count = $$('[data-row-select]', table).filter(function (b) { return b.checked; }).length;
    var bar = $('[data-bulk-count]', table.closest('[data-table-scope]') || doc) || $('[data-bulk-count]');
    if (bar) bar.textContent = count;
    var region = $('[data-bulk-bar]');
    if (region) region.hidden = count === 0;
  }

  /* =======================================================================
     COMMAND PALETTE (⌘K / Ctrl+K)
     Hook: #command-palette.cmdk with .cmdk__input and .cmdk__item[href|data-action]
     ======================================================================= */
  function openCmdk() {
    var c = $('#command-palette');
    if (!c) return;
    openOverlay(c);
    var input = $('.cmdk__input', c);
    if (input) { input.value = ''; filterCmdk(c, ''); setTimeout(function () { input.focus(); }, 60); }
    setActiveItem(c, $$('.cmdk__item', c).filter(function (i) { return !i.hidden; })[0]);
  }
  Swiss.openCmdk = openCmdk;
  function filterCmdk(c, q) {
    q = q.toLowerCase();
    var any = false;
    $$('.cmdk__item', c).forEach(function (it) {
      var hit = it.textContent.toLowerCase().indexOf(q) !== -1;
      it.hidden = !hit; if (hit) any = true;
    });
    $$('.cmdk__group-label', c).forEach(function (g) {
      var sib = g.nextElementSibling, visible = false;
      while (sib && sib.classList.contains('cmdk__item')) { if (!sib.hidden) visible = true; sib = sib.nextElementSibling; }
      g.hidden = !visible;
    });
    var empty = $('.cmdk__empty', c); if (empty) empty.hidden = any;
    setActiveItem(c, $$('.cmdk__item', c).filter(function (i) { return !i.hidden; })[0]);
  }
  function setActiveItem(c, item) {
    $$('.cmdk__item', c).forEach(function (i) { i.classList.remove('is-active'); });
    if (item) { item.classList.add('is-active'); item.scrollIntoView({ block: 'nearest' }); }
  }
  on(doc, 'input', function (e) { var inp = e.target.closest('.cmdk__input'); if (inp) filterCmdk(inp.closest('.cmdk'), inp.value); });
  on(doc, 'keydown', function (e) {
    var isMeta = (e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K');
    if (isMeta) { e.preventDefault(); var open = stack.some(function (s) { return s.el.id === 'command-palette'; }); open ? closeTop() : openCmdk(); return; }
    if (!stack.length || stack[stack.length - 1].el.id !== 'command-palette') return;
    var c = stack[stack.length - 1].el;
    var items = $$('.cmdk__item', c).filter(function (i) { return !i.hidden; });
    var active = c.querySelector('.cmdk__item.is-active');
    var i = items.indexOf(active);
    if (e.key === 'ArrowDown') { e.preventDefault(); setActiveItem(c, items[Math.min(items.length - 1, i + 1)]); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActiveItem(c, items[Math.max(0, i - 1)]); }
    else if (e.key === 'Enter' && active) { e.preventDefault(); runCmdkItem(active); }
  });
  on(doc, 'click', function (e) { var it = e.target.closest('.cmdk__item'); if (it) runCmdkItem(it); });
  function runCmdkItem(it) {
    var act = it.getAttribute('data-action');
    var href = it.getAttribute('href') || it.getAttribute('data-href');
    closeTop();
    if (act === 'toggle-theme') setTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
    else if (act === 'toggle-grid') toggleGrid();
    else if (act === 'toast') Swiss.toast({ title: it.getAttribute('data-title') || 'Command run', variant: 'success' });
    else if (href && href !== '#') window.location.href = href;
  }

  /* =======================================================================
     WIZARD  ·  [data-wizard] step navigation
     ======================================================================= */
  on(doc, 'click', function (e) {
    var btn = e.target.closest('[data-wizard-next],[data-wizard-prev],[data-wizard-go]');
    if (!btn) return;
    var wiz = btn.closest('[data-wizard]');
    if (!wiz) return;
    var panels = $$('[data-wizard-panel]', wiz);
    var cur = panels.findIndex(function (p) { return !p.hidden; });
    var next = cur;
    if (btn.hasAttribute('data-wizard-next')) next = Math.min(panels.length - 1, cur + 1);
    else if (btn.hasAttribute('data-wizard-prev')) next = Math.max(0, cur - 1);
    else if (btn.hasAttribute('data-wizard-go')) next = +btn.getAttribute('data-wizard-go');
    if (next === cur && !btn.hasAttribute('data-wizard-go')) {
      if (btn.hasAttribute('data-wizard-next')) Swiss.toast({ title: 'Setup complete', variant: 'success' });
    }
    panels.forEach(function (p, i) { p.hidden = i !== next; });
    updateWizardSteps(wiz, next);
  });
  function updateWizardSteps(wiz, idx) {
    var steps = $$('[data-step-index]', wiz);
    steps.forEach(function (s, i) {
      s.classList.remove('steps__step--current', 'steps__step--done', 'steps-vert__step--current', 'steps-vert__step--done');
      var vert = s.classList.contains('steps-vert__step');
      if (i < idx) s.classList.add(vert ? 'steps-vert__step--done' : 'steps__step--done');
      else if (i === idx) s.classList.add(vert ? 'steps-vert__step--current' : 'steps__step--current');
    });
    var prog = wiz.querySelector('[data-wizard-progress]');
    if (prog) prog.style.width = ((idx) / Math.max(1, $$('[data-wizard-panel]', wiz).length - 1) * 100) + '%';
  }

  /* =======================================================================
     KANBAN  ·  HTML5 drag & drop between columns
     Hook: [data-kanban] container, [data-kanban-col] columns, .kanban-card[draggable]
     ======================================================================= */
  (function kanban() {
    var dragged = null;
    on(doc, 'dragstart', function (e) {
      var card = e.target.closest('.kanban-card');
      if (!card) return;
      dragged = card; card.classList.add('is-dragging');
      e.dataTransfer.effectAllowed = 'move';
      try { e.dataTransfer.setData('text/plain', card.getAttribute('data-id') || ''); } catch (x) {}
    });
    on(doc, 'dragend', function () { if (dragged) { dragged.classList.remove('is-dragging'); dragged = null; } $$('.kanban-card.is-drop-target,[data-kanban-col].is-drop').forEach(function (n) { n.classList.remove('is-drop-target', 'is-drop'); }); refreshCounts(); });
    on(doc, 'dragover', function (e) {
      var col = e.target.closest('[data-kanban-col]');
      if (!col || !dragged) return;
      e.preventDefault();
      var after = cardAfter(col, e.clientY);
      var list = col.querySelector('[data-kanban-list]') || col;
      if (after == null) list.appendChild(dragged); else list.insertBefore(dragged, after);
    });
    function cardAfter(col, y) {
      var cards = $$('.kanban-card:not(.is-dragging)', col);
      var closest = null, closestOffset = -Infinity;
      cards.forEach(function (c) {
        var box = c.getBoundingClientRect();
        var offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closestOffset) { closestOffset = offset; closest = c; }
      });
      return closest;
    }
    function refreshCounts() {
      $$('[data-kanban-col]').forEach(function (col) {
        var n = $$('.kanban-card', col).length;
        var c = col.querySelector('[data-kanban-count]');
        if (c) c.textContent = n;
      });
    }
  })();

  /* =======================================================================
     CAROUSEL  ·  prev/next + dots (scroll-snap)
     ======================================================================= */
  on(doc, 'click', function (e) {
    var btn = e.target.closest('[data-carousel-next],[data-carousel-prev]');
    if (btn) {
      var car = btn.closest('.carousel') || $(btn.getAttribute('data-carousel'));
      var track = $('.carousel__track', car);
      var slide = $('.carousel__slide', track);
      var w = slide ? slide.getBoundingClientRect().width + parseFloat(getComputedStyle(track).gap || 0) : track.clientWidth;
      track.scrollBy({ left: btn.hasAttribute('data-carousel-next') ? w : -w, behavior: prefersReduced ? 'auto' : 'smooth' });
    }
    var dot = e.target.closest('.carousel__dot');
    if (dot) {
      var car2 = dot.closest('.carousel');
      var track2 = $('.carousel__track', car2);
      var i = $$('.carousel__dot', car2).indexOf(dot);
      var slides = $$('.carousel__slide', track2);
      if (slides[i]) track2.scrollTo({ left: slides[i].offsetLeft - track2.offsetLeft, behavior: prefersReduced ? 'auto' : 'smooth' });
    }
  });
  // sync dots on scroll
  $$('.carousel').forEach(function (car) {
    var track = $('.carousel__track', car);
    if (!track) return;
    on(track, 'scroll', function () {
      var slides = $$('.carousel__slide', track);
      var dots = $$('.carousel__dot', car);
      if (!dots.length) return;
      var idx = 0, min = Infinity;
      slides.forEach(function (s, i) { var d = Math.abs(s.offsetLeft - track.offsetLeft - track.scrollLeft); if (d < min) { min = d; idx = i; } });
      dots.forEach(function (d, i) { d.classList.toggle('is-active', i === idx); });
    }, { passive: true });
  });

  /* =======================================================================
     CONTEXT MENU  ·  [data-context-menu="#id"] → show #id at cursor
     ======================================================================= */
  on(doc, 'contextmenu', function (e) {
    var host = e.target.closest('[data-context-menu]');
    if (!host) return;
    e.preventDefault();
    var menu = $(host.getAttribute('data-context-menu'));
    if (!menu) return;
    $$('.context-menu.is-open').forEach(function (m) { m.classList.remove('is-open'); });
    menu.style.left = Math.min(e.clientX, window.innerWidth - menu.offsetWidth - 8) + 'px';
    menu.style.top = Math.min(e.clientY, window.innerHeight - menu.offsetHeight - 8) + 'px';
    menu.classList.add('is-open');
  });
  on(doc, 'click', function () { $$('.context-menu.is-open').forEach(function (m) { m.classList.remove('is-open'); }); });

  /* =======================================================================
     DATEPICKER + standalone CALENDAR renderer
     Hook: [data-calendar] (renders into) · [data-datepicker] (input + popover)
     ======================================================================= */
  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var DOW = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
  function renderCalendar(host, state) {
    var y = state.year, m = state.month;
    var first = new Date(y, m, 1);
    var startDow = (first.getDay() + 6) % 7; // Monday-first
    var daysInMonth = new Date(y, m + 1, 0).getDate();
    var daysPrev = new Date(y, m, 0).getDate();
    var todayStr = state.todayStr;
    var html = '';
    html += '<div class="calendar__head"><div class="calendar__title">' + MONTHS[m] + ' <span class="month">' + y + '</span></div>' +
      '<div class="calendar__nav">' +
      '<button class="calendar__nav-btn" data-cal-prev aria-label="Previous month"><svg viewBox="0 0 16 16" stroke="currentColor" stroke-width="1.4"><path d="M10 3L5 8l5 5"/></svg></button>' +
      '<button class="calendar__nav-btn" data-cal-next aria-label="Next month"><svg viewBox="0 0 16 16" stroke="currentColor" stroke-width="1.4"><path d="M6 3l5 5-5 5"/></svg></button>' +
      '</div></div>';
    html += '<div class="calendar__grid" role="grid">';
    DOW.forEach(function (d) { html += '<div class="calendar__dow" role="columnheader">' + d + '</div>'; });
    for (var p = 0; p < startDow; p++) { html += '<button class="calendar__day is-muted" tabindex="-1" disabled>' + (daysPrev - startDow + 1 + p) + '</button>'; }
    for (var d2 = 1; d2 <= daysInMonth; d2++) {
      var ds = y + '-' + String(m + 1).padStart(2, '0') + '-' + String(d2).padStart(2, '0');
      var cls = 'calendar__day';
      if (ds === todayStr) cls += ' is-today';
      if (ds === state.selected) cls += ' is-selected';
      html += '<button class="' + cls + '" data-date="' + ds + '">' + d2 + '</button>';
    }
    html += '</div>';
    host.innerHTML = html;
  }
  function todayState() {
    var n = new Date();
    var ts = n.getFullYear() + '-' + String(n.getMonth() + 1).padStart(2, '0') + '-' + String(n.getDate()).padStart(2, '0');
    return { year: n.getFullYear(), month: n.getMonth(), selected: null, todayStr: ts };
  }
  $$('[data-calendar]').forEach(function (host) {
    host._state = todayState();
    renderCalendar(host, host._state);
  });
  $$('[data-datepicker]').forEach(function (dp) {
    var pop = dp.querySelector('[data-calendar-pop]');
    if (pop) { pop._state = todayState(); renderCalendar(pop, pop._state); }
  });
  on(doc, 'click', function (e) {
    // open datepicker
    var dpTrg = e.target.closest('[data-datepicker-trigger]');
    if (dpTrg) { var dp = dpTrg.closest('.datepicker'); closeAllPoppers(); dp.classList.toggle('is-open'); return; }
    // month nav
    var navP = e.target.closest('[data-cal-prev]'), navN = e.target.closest('[data-cal-next]');
    if (navP || navN) {
      var host = (navP || navN).closest('[data-calendar],[data-calendar-pop]');
      var st = host._state;
      st.month += navN ? 1 : -1;
      if (st.month > 11) { st.month = 0; st.year++; } if (st.month < 0) { st.month = 11; st.year--; }
      renderCalendar(host, st); return;
    }
    // pick a day
    var day = e.target.closest('.calendar__day[data-date]');
    if (day) {
      var host2 = day.closest('[data-calendar],[data-calendar-pop]');
      host2._state.selected = day.getAttribute('data-date');
      renderCalendar(host2, host2._state);
      var dpWrap = day.closest('.datepicker');
      if (dpWrap) {
        var input = dpWrap.querySelector('input');
        if (input) input.value = day.getAttribute('data-date');
        dpWrap.classList.remove('is-open');
      }
    }
  });

  /* =======================================================================
     COPY TO CLIPBOARD  ·  [data-copy="#target" | text]
     ======================================================================= */
  on(doc, 'click', function (e) {
    var btn = e.target.closest('[data-copy]');
    if (!btn) return;
    var val = btn.getAttribute('data-copy');
    var text = val && val[0] === '#' ? ($(val) ? $(val).textContent : '') : (val || (btn.closest('.code') ? btn.closest('.code').querySelector('pre').textContent : ''));
    var done = function () {
      var lbl = btn.querySelector('[data-copy-label]') || btn;
      var prev = lbl.textContent; lbl.textContent = 'Copied'; setTimeout(function () { lbl.textContent = prev; }, 1400);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, done);
    else done();
  });

  /* =======================================================================
     SCROLLSPY for in-page section nav (gallery/README hubs)
     Hook: [data-spy] nav links → href="#sectionId"; sections with that id
     ======================================================================= */
  (function scrollspy() {
    var links = $$('[data-spy] a[href^="#"]');
    if (!links.length || !('IntersectionObserver' in window)) return;
    var map = {};
    links.forEach(function (l) { var id = l.getAttribute('href').slice(1); var s = doc.getElementById(id); if (s) map[id] = l; });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          links.forEach(function (l) { l.removeAttribute('aria-current'); });
          if (map[en.target.id]) map[en.target.id].setAttribute('aria-current', 'true');
        }
      });
    }, { rootMargin: '-30% 0px -65% 0px' });
    Object.keys(map).forEach(function (id) { io.observe(doc.getElementById(id)); });
  })();

  /* =======================================================================
     READY
     ======================================================================= */
  on(doc, 'keydown', function (e) {
    // press "g" (not in input) toggles grid overlay — Swiss signature shortcut
    if (e.key === 'g' && !/^(INPUT|TEXTAREA|SELECT)$/.test((e.target.tagName || '')) && !e.metaKey && !e.ctrlKey && !e.altKey) {
      toggleGrid();
    }
  });

  doc.documentElement.classList.add('js-ready');
})();
