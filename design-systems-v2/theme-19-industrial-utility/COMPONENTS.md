# COMPONENTS — 반월장비창고 BW-STD 19 마크업 계약

index.html · pages/*.html 담당은 **이 문서만 보고** 마크업한다. 디자인 근거와 세계관 값은 `DIRECTION.md`(특히 `## 2. 팩트 시트`).
클래스는 BEM(`블록__요소--변형`). 상태는 가능한 한 ARIA 속성(`aria-selected` `aria-current` `aria-expanded` `aria-pressed` `aria-busy` `aria-invalid` `aria-disabled` `disabled` `hidden`)으로 표시하고 CSS가 그 속성을 읽는다.
**셸(navbar · 사이드바 · footer · 공통 오버레이)은 3절 스니펫을 글자 하나 바꾸지 말고 복사**한다. 바꿔도 되는 것은 표시된 `aria-current` 위치와 사이드바의 「현재 위치」 라벨 두 칸뿐이다.

---

## 0. 페이지 뼈대 (모든 HTML 공통)

```html
<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>반월장비창고 — 창고 상황판</title>
<script>(function(){var d=document.documentElement,q=null,s=null,m=false;try{q=new URLSearchParams(location.search).get('theme');}catch(e){}try{s=localStorage.getItem('bwd-theme');}catch(e){}try{m=window.matchMedia&&matchMedia('(prefers-color-scheme: dark)').matches;}catch(e){}d.setAttribute('data-theme',(q==='dark'||q==='light')?q:(s==='dark'||s==='light')?s:(m?'dark':'light'));})();</script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Saira+Stencil:wdth,wght@50..125,100..900&family=Barlow+Condensed:wght@500;600;700;800&family=Black+Han+Sans&family=IBM+Plex+Sans+KR:wght@400;500;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap">
<link rel="stylesheet" href="styles.css">        <!-- pages: ../styles.css -->
<link rel="stylesheet" href="index.css">         <!-- pages: dashboard.css 처럼 장면 전용 1개 (pages/ 안) -->
</head>
<body>
<a class="skip-link" href="#main">본문으로 건너뛰기</a>
…3-1 navbar…
<main id="main">…</main>                          <!-- 앱 셸 화면은 3-2의 .app 안 main.app__main -->
…3-3 footer…
…3-4 공통 오버레이(조회기 · 토스트 자리)…
<script src="app.js"></script>                    <!-- pages: ../app.js -->
</body>
</html>
```

- 테마 저장 키 `bwd-theme`. 우선순위 `?theme=dark|light` → localStorage → 시스템. `<html>`에 `data-theme`를 하드코딩하지 않는다.
- `<title>`은 `반월장비창고 — <화면 이름>`. index는 `반월장비창고 — BW-STD 19 현장 표준 규격 제3판`.
- 장면 CSS(`index.css`, `pages/<name>.css`)도 **semantic 토큰만**(2절). raw hex 금지, 인라인 `grid-template-columns` 금지(1절 스팬 클래스나 장면 CSS 클래스 사용). `style="--cells:8; --target:85; --tilt:4deg"` 같은 **커스텀 속성 주입은 허용**.
- 금지: `href="#"`(실제 경로나 `#id`), 인라인 `onclick`, 이미지 파일(도면·사물은 인라인 SVG), 이모지, Lorem·홍길동·「○○」·「카드 제목」·「버튼」 같은 더미.
- **SVG presentation attribute에 `var()` 금지.** `stroke="currentColor"` 또는 CSS 클래스(`.ico`, `.accent`)로 색을 준다.
- 세계관 기준 시각은 **2026년 10월 14일 수요일 06:40**(주간조 투입 10분 전). 날짜·주소·인물·ID·가격은 DIRECTION 팩트 시트 값만.

### 화면 목록 (셸 선택 기준)

| 파일 | 화면 이름 | 위치 코드 | 셸 | navbar `aria-current` | 사이드바 `aria-current` |
|---|---|---|---|---|---|
| index.html | BW-STD 19 현장 표준 라벨·사양서 규격 | B-07-3 (표지) | 사이트 셸 3-1a | 없음 | — |
| pages/dashboard.html | 창고 상황판 | D-00-1 | **앱 셸** 3-1c + 3-2 | 상황판 | 상황판 |
| pages/inbox.html | 거래처 요청함 | R-00-1 | **앱 셸** | 요청함 | 요청함 |
| pages/kanban.html | 정비 작업 지시판 | W-00-1 | **앱 셸** | 작업 지시 | 작업 지시 |
| pages/profile.html | 박태용 정비 반장 | E-0117 | **앱 셸** | 없음 | 프로필 |
| pages/settings.html | 설정 | S-00-1 | **앱 셸** | 없음 | 설정 |
| pages/product.html | 2.5톤 전동 지게차 FB25 | B-07-3 | 사이트 셸 3-1b | 장비 사양 | — |
| pages/pricing.html | 정비 보전 계약 | P-00-1 | 사이트 셸 3-1b | 보전 계약 | — |
| pages/onboarding.html | 신규 거래처 등록 | N-00-1 | 사이트 셸 3-1b | 없음 | — |
| pages/404.html | 미등록 위치 | Z-00-0 | 사이트 셸 3-1b | 없음 | — |

- 이 문서 예시가 가리키는 앵커: dashboard는 `#out`(오늘 출고 표) `#late`(점검 지연 목록) `#fleet`(장비 214대 와플/목록) id를 반드시 가진다. kanban 열 머리 건수(`[data-count]`)는 팩트 값(접수 4 · 부품 대기 5 · 작업 중 6 · 검수 4)을 적는다 — 카드를 일부만 그려도 app.js는 이동할 때 ±1만 반영한다.

---

## 1. 레이아웃 문법 (base.css) — 「팔레트 랙」

### 컨테이너 · 그리드

```html
<div class="wrap">…</div>                                 <!-- 최대 1392px + 측면 40px(≤768: 16px) -->
<div class="grid-12">
  <div class="span-8">…</div><div class="span-4">…</div>   <!-- span-3/4/5/6/7/8/9/12, ≤1024·≤640에서 자동 접힘 -->
</div>
<div class="stack" style="--stack-gap:24px">…</div>      <!-- 세로 쌓기 -->
<div class="cluster">…</div>                              <!-- 가로 줄바꿈 묶음 -->
<div class="split">…</div>                                <!-- 양 끝 정렬 -->
<div class="panel">…</div>  <div class="panel panel--sunk">…</div>   <!-- 고정 설비 판(직사각, 2px) -->
```

- 섹션마다 리듬을 바꾼다(DIRECTION 6-4): 표지 0 여백 풀블리드, 색 띠 사이 0, 사양서 행 44px, 랙 단 사이 48px, 타공판 64px 격자. 공통 max-width 하나로 전부 감싸지 말 것.
- 가운데 정렬은 404 경고 표지만. 숫자는 우측 정렬(`.num`).

### 랙(업라이트 + 주황 빔 + 베이) — 콘텐츠가 빔 위에 얹힌다

```html
<section class="rack">                                  <!-- 단 사이 48px -->
  <div class="rack__tier">                              <!-- 4베이 그리드, 하단 2px 잉크 + 12px 주황 빔, 좌우 업라이트 -->
    <div class="rack__bay">                             <!-- 1베이. --2 / --3 / --4 로 폭 -->
      <div class="rack-label rack-label--sm"><span class="rack-label__code">A-01-1</span><span class="rack-label__name">버튼</span></div>
      …내용(하단 정렬)…
    </div>
    <div class="rack__bay rack__bay--2">…</div>
    <div class="rack__bay">…</div>
  </div>
</section>
<div class="beam"></div>                                <!-- 빔만 따로(표지 라벨 아래 등) -->
<span class="upright" aria-hidden="true"></span>        <!-- 기둥만 따로(flex 안에서 세로로 늘어남) -->
```

- 베이 사이 업라이트는 자동(두 번째 베이부터). ≤1024 2열, ≤640 1열(업라이트 숨김, 빔 유지).
- 칸 위 빈 공간이 120px를 넘으면 내용량을 조정한다(브리프 7-8).

### 경고 띠 — **위험·차단·잠금이 있을 때만** (구분선·장식 금지)

```html
<div class="hazard-band" role="presentation"></div>     <!-- 16px 띠: 바리케이드, 위험 구역 경계 -->
<div class="hazard-frame">…</div>                       <!-- 8px 경고 띠 테두리: 「위험 구역」 계정 비활성화 -->
<div class="is-locked-zone" aria-disabled="true">…</div> <!-- 잠긴 기능 위 옅은 줄무늬 -->
```

---

## 2. 토큰 (semantic.css) — 장면 CSS는 이것만

| 무리 | 토큰 |
|---|---|
| 면 | `--bg`(콘크리트/야간 에폭시) `--surface`(라벨지·강판) `--surface-2`(눌린 면·표 머리) `--surface-3`(비활성·휴무) |
| 글자 | `--ink` `--ink-2` `--muted`(캡션 하한) |
| 선 | `--edge`(2px 구조선) `--edge-on-color`(안전색 면 테두리) `--line-mid`(표 내부) `--line-soft`(장식 전용) |
| 안전색 면 | `--yellow` `--yellow-deep` `--orange` `--red` `--red-deep` `--green` `--green-deep` `--blue` `--blue-deep` |
| 안전색 위 글자 | `--on-yellow` `--on-orange` `--on-red` `--on-green` `--on-blue` |
| 안전색 텍스트 | `--yellow-text` `--orange-text` `--red-text` `--green-text` `--blue-text` `--link` |
| 옅은 면 | `--yellow-tint` + `--on-yellow-tint`, `--red-tint` |
| 물리 사물(모드 무관 재질) | `--label-stock` + `--on-label`(랙 라벨지·반사 라벨) · `--steel` `--steel-2` `--on-steel` `--steel-muted` `--steel-line`(스텐실 강판·코드) · `--signboard` + `--on-signboard`(전광 게시판) · `--hazard-a` `--hazard-b` |
| 패턴 | `--hazard`(14px 줄무늬) `--hazard-fine`(6px) `--barcode` `--hatch`(1px 사선) |
| 그림자 | `--shadow-hard`(4px) `--shadow-sm`(2px) `--drop-hard` `--drop-sm`(clip-path 요소용 filter) `--shadow-ink` |
| 기타 | `--scrim` `--focus-ring` `--focus-halo` `--tooltip-bg/fg` `--hole-bg`(꼬리표 구멍 안 색, 5절) |
| 원시(tokens.css) 중 장면에서 써도 되는 것 | 간격 `--sp-1…10`(4·8·12·16·24·32·48·64·96·128), 서체 `--ff-stencil` `--ff-label` `--ff-kr-display` `--ff-body` `--ff-mono`, 크기 `--fs-*`, 모션 `--t-snap/move/travel` `--ease-snap/swing`, `--chamfer-l/m/s`, `--bw` `--bw-strong`, `--grid-*` `--beam-h` `--upright-w` |

**다크 = 22시 이후 야간 창고.** 노랑·주황 면은 반사 도료라 그대로 밝고, 랙 라벨지(`--label-stock`)는 손전등 받은 흰 라벨로 남는다. 다크에서 안전색을 탁하게 바꾸거나 패널을 흰 띠로 뒤집지 말 것.

### 서체 규칙 (DIRECTION 5절 요약)

| 클래스 | 쓰임 |
|---|---|
| `.t-stencil` | Saira Stencil — 위치 코드·대형 번호(라틴·숫자 전용). 크기는 장면이 `font-size: var(--fs-code-xxl…m)`로 |
| `.t-kr1` `.t-kr2` `.t-kr3` / `h1` `h2` `h3` | Black Han Sans — **24px 이상 한글 제목만** |
| `.t-h4` / `h4` | Plex Sans KR 700 20px |
| `.t-latin` | Barlow Condensed 대문자 0.08em — `RACK` `QTY` `REV` `S/N` `IN` `OUT` `LOTO`만, **한글 금지**, 한 화면 3개 이하 |
| `.t-label` | 한글 UI 라벨 13px 700 자간 0 |
| `.t-mono` / `.id` | IBM Plex Mono — 자산번호·SKU·WO·시각 |
| `.t-num` | Barlow Condensed 700 tabular — 표·명판 숫자 |
| `.t-muted` `.t-body-s` `.num` `.sr-only` | 보조 |

---

## 3. 공통 셸 — **복사해서 쓰는 스니펫**

### 3-1a. navbar — index.html (사이트 셸)

```html
<header class="navbar">
  <div class="navbar__inner">
    <a class="wordmark" href="index.html" aria-label="반월장비창고 — BW-STD 19 규격집으로">
      <span class="wordmark__plate" aria-hidden="true">BW</span>
      <span class="wordmark__text"><span class="wordmark__en">BANWOL DEPOT</span><span class="wordmark__kr">반월장비창고</span></span>
    </a>
    <nav aria-label="주요 화면">
      <ul class="navbar__links" id="nav-links">
        <li><a class="navbar__link" href="pages/dashboard.html">상황판</a></li>
        <li><a class="navbar__link" href="pages/kanban.html">작업 지시</a></li>
        <li><a class="navbar__link" href="pages/inbox.html">요청함</a></li>
        <li><a class="navbar__link" href="pages/product.html">장비 사양</a></li>
        <li><a class="navbar__link" href="pages/pricing.html">보전 계약</a></li>
      </ul>
    </nav>
    <div class="navbar__tools">
      <span class="navbar__shift"><span class="led led--live" aria-hidden="true"></span>주간조 <span class="t-num">06:30–14:30</span></span>
      <button type="button" class="navbar__search" data-command-open aria-label="위치·자산 조회 (⌘K)">
        <svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8V4h4M16 4h4v4M20 16v4h-4M8 20H4v-4M4 12h16"/></svg>
        <span>위치·자산 조회</span><span class="kbd">⌘K</span>
      </button>
      <button type="button" class="lightswitch" data-theme-toggle aria-pressed="false" aria-label="조명 스위치">
        <span class="lightswitch__body" aria-hidden="true"></span>
      </button>
      <a class="navbar__user" href="pages/profile.html" aria-label="박태용 정비 반장 프로필"><i aria-hidden="true">박태</i><span>박태용</span></a>
      <button type="button" class="navbar__menu-btn btn btn--icon btn--ghost" data-nav-toggle aria-controls="nav-links" aria-expanded="false" aria-label="메뉴 열기">
        <svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
      </button>
    </div>
  </div>
</header>
```

### 3-1b. navbar — pages/ 사이트 셸 (product · pricing · onboarding · 404)

`aria-current="page"`는 product → 「장비 사양」, pricing → 「보전 계약」 링크에만 붙인다. onboarding · 404는 없음.

```html
<header class="navbar">
  <div class="navbar__inner">
    <a class="wordmark" href="../index.html" aria-label="반월장비창고 — BW-STD 19 규격집으로">
      <span class="wordmark__plate" aria-hidden="true">BW</span>
      <span class="wordmark__text"><span class="wordmark__en">BANWOL DEPOT</span><span class="wordmark__kr">반월장비창고</span></span>
    </a>
    <nav aria-label="주요 화면">
      <ul class="navbar__links" id="nav-links">
        <li><a class="navbar__link" href="dashboard.html">상황판</a></li>
        <li><a class="navbar__link" href="kanban.html">작업 지시</a></li>
        <li><a class="navbar__link" href="inbox.html">요청함</a></li>
        <li><a class="navbar__link" href="product.html">장비 사양</a></li>
        <li><a class="navbar__link" href="pricing.html">보전 계약</a></li>
      </ul>
    </nav>
    <div class="navbar__tools">
      <span class="navbar__shift"><span class="led led--live" aria-hidden="true"></span>주간조 <span class="t-num">06:30–14:30</span></span>
      <button type="button" class="navbar__search" data-command-open aria-label="위치·자산 조회 (⌘K)">
        <svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8V4h4M16 4h4v4M20 16v4h-4M8 20H4v-4M4 12h16"/></svg>
        <span>위치·자산 조회</span><span class="kbd">⌘K</span>
      </button>
      <button type="button" class="lightswitch" data-theme-toggle aria-pressed="false" aria-label="조명 스위치">
        <span class="lightswitch__body" aria-hidden="true"></span>
      </button>
      <a class="navbar__user" href="profile.html" aria-label="박태용 정비 반장 프로필"><i aria-hidden="true">박태</i><span>박태용</span></a>
      <button type="button" class="navbar__menu-btn btn btn--icon btn--ghost" data-nav-toggle aria-controls="nav-links" aria-expanded="false" aria-label="메뉴 열기">
        <svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
      </button>
    </div>
  </div>
</header>
```

### 3-1c. navbar — pages/ 앱 셸 (dashboard · inbox · kanban · profile · settings)

`navbar--app` + 메뉴 버튼이 사이드바를 연다(1024px 이하). `aria-current="page"`는 화면 목록 표대로 옮긴다(아래는 dashboard).

```html
<header class="navbar navbar--app">
  <div class="navbar__inner">
    <a class="wordmark" href="../index.html" aria-label="반월장비창고 — BW-STD 19 규격집으로">
      <span class="wordmark__plate" aria-hidden="true">BW</span>
      <span class="wordmark__text"><span class="wordmark__en">BANWOL DEPOT</span><span class="wordmark__kr">반월장비창고</span></span>
    </a>
    <nav aria-label="주요 화면">
      <ul class="navbar__links" id="nav-links">
        <li><a class="navbar__link" href="dashboard.html" aria-current="page">상황판</a></li>
        <li><a class="navbar__link" href="kanban.html">작업 지시</a></li>
        <li><a class="navbar__link" href="inbox.html">요청함</a></li>
        <li><a class="navbar__link" href="product.html">장비 사양</a></li>
        <li><a class="navbar__link" href="pricing.html">보전 계약</a></li>
      </ul>
    </nav>
    <div class="navbar__tools">
      <span class="navbar__shift"><span class="led led--live" aria-hidden="true"></span>주간조 <span class="t-num">06:30–14:30</span></span>
      <button type="button" class="navbar__search" data-command-open aria-label="위치·자산 조회 (⌘K)">
        <svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8V4h4M16 4h4v4M20 16v4h-4M8 20H4v-4M4 12h16"/></svg>
        <span>위치·자산 조회</span><span class="kbd">⌘K</span>
      </button>
      <button type="button" class="lightswitch" data-theme-toggle aria-pressed="false" aria-label="조명 스위치">
        <span class="lightswitch__body" aria-hidden="true"></span>
      </button>
      <a class="navbar__user" href="profile.html" aria-label="박태용 정비 반장 프로필"><i aria-hidden="true">박태</i><span>박태용</span></a>
      <button type="button" class="navbar__menu-btn btn btn--icon btn--ghost" data-sidebar-open aria-controls="sidebar" aria-expanded="false" aria-label="구역 안내판 열기">
        <svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
      </button>
    </div>
  </div>
</header>
```

### 3-2. 앱 셸 — 사이드바 「구역 안내판」 + 본문 (pages/ 앱 셸 5개)

navbar 바로 다음에 둔다. 바꾸는 곳: ① `.sidebar__loc` 안 라벨의 코드·이름(화면 목록 표의 위치 코드·화면 이름) ② 해당 링크의 `aria-current="page"`(아래는 dashboard). 숫자 `19`(진행 작업지시)·`8`(미처리 요청)은 팩트 시트 값이라 고정.

```html
<div class="app">
  <aside class="sidebar" id="sidebar" aria-label="구역 안내판">
    <button type="button" class="sidebar__close" data-sidebar-close aria-label="구역 안내판 닫기">
      <svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>
    </button>
    <div class="sidebar__loc">
      <span class="sidebar__loc-cap">현재 위치</span>
      <div class="rack-label rack-label--sm"><span class="rack-label__code">D-00-1</span><span class="rack-label__name">창고 상황판</span></div>
    </div>
    <nav class="sidebar__nav" aria-label="구역">
      <div class="sidebar__group">
        <p class="sidebar__title">현장</p>
        <ul class="sidebar__list">
          <li><a class="sidebar__link" href="dashboard.html" aria-current="page"><svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="8" height="8"/><rect x="13" y="3" width="8" height="8"/><rect x="3" y="13" width="8" height="8"/><rect x="13" y="13" width="8" height="8"/></svg>상황판<span class="sidebar__code">D-00-1</span></a></li>
          <li><a class="sidebar__link" href="kanban.html"><svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 8l5-5h13v18H8l-5-5z"/><path d="M9 12h0"/></svg>작업 지시<span class="count">19</span></a></li>
          <li><a class="sidebar__link" href="inbox.html"><svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 13h5l2 3h4l2-3h5"/><path d="M3 13l3-9h12l3 9v7H3z"/></svg>요청함<span class="count count--alert">8</span></a></li>
        </ul>
      </div>
      <div class="sidebar__group">
        <p class="sidebar__title">장비</p>
        <ul class="sidebar__list">
          <li><a class="sidebar__link" href="product.html"><svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 3h10l4 4v14H5z"/><path d="M9 11h6M9 15h6"/></svg>장비 사양<span class="sidebar__code">B-07-3</span></a></li>
          <li><a class="sidebar__link" href="pricing.html"><svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/></svg>보전 계약<span class="sidebar__code">P-00-1</span></a></li>
          <li><a class="sidebar__link" href="onboarding.html"><svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><circle cx="9" cy="7" r="4"/><path d="M3 21v-2a6 6 0 0 1 6-6h1M18 14v7M14.5 17.5h7"/></svg>신규 거래처<span class="sidebar__code">N-00-1</span></a></li>
        </ul>
      </div>
      <div class="sidebar__group">
        <p class="sidebar__title">내 정보</p>
        <ul class="sidebar__list">
          <li><a class="sidebar__link" href="profile.html"><svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14"/><circle cx="9" cy="11" r="2.5"/><path d="M5.5 17c.8-1.6 2-2.4 3.5-2.4s2.7.8 3.5 2.4M15 10h3M15 14h3"/></svg>프로필<span class="sidebar__code">E-0117</span></a></li>
          <li><a class="sidebar__link" href="settings.html"><svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12"/><rect x="14" y="4" width="4" height="4"/><rect x="8" y="10" width="4" height="4"/><rect x="16" y="16" width="4" height="4"/></svg>설정<span class="sidebar__code">S-00-1</span></a></li>
        </ul>
      </div>
    </nav>
    <div class="sidebar__foot">
      <span class="led led--live" aria-hidden="true"></span>주간조 <b>06:30–14:30</b><br>
      무재해 <b>412</b>일째 · 2026.10.14(수)
    </div>
  </aside>
  <div class="sidebar-scrim" data-sidebar-close></div>
  <main class="app__main" id="main">
    <header class="page-head">
      <div class="rack-label rack-label--lg">
        <span class="rack-label__code">D-00-1</span>
        <h1 class="rack-label__name">창고 상황판</h1>
        <span class="rack-label__bar"><span>261014 0640</span></span>
        <span class="rack-label__meta"><span class="t-latin">REV</span><b>3</b></span>
      </div>
      <div class="page-head__row">
        <p class="page-head__meta"><b>2026년 10월 14일(수) 06:40</b> · 주간조 투입 10분 전</p>
        <div class="btn-row">…화면 주 행동…</div>
      </div>
    </header>
    …장면…
  </main>
</div>
```

### 3-3. footer 「장비 명판」

index.html:

```html
<footer class="site-foot">
  <div class="wrap">
    <div class="nameplate">
      <div class="nameplate__brand">
        <div class="nameplate__mark">
          <span class="wordmark__plate" aria-hidden="true">BW</span>
          <p class="nameplate__name">반월장비창고<span class="nameplate__en">BANWOL EQUIPMENT DEPOT</span></p>
        </div>
        <nav class="nameplate__links" aria-label="바닥글">
          <a href="index.html">BW-STD 19 규격집</a>
          <a href="pages/dashboard.html">상황판</a>
          <a href="pages/product.html">장비 사양</a>
          <a href="pages/pricing.html">보전 계약</a>
          <a href="pages/onboarding.html">신규 거래처 등록</a>
          <a href="pages/settings.html">설정</a>
          <a href="pages/404.html">미등록 위치</a>
        </nav>
      </div>
      <dl class="nameplate__spec">
        <div class="nameplate__row"><dt>상호</dt><dd>반월장비창고</dd></div>
        <div class="nameplate__row"><dt>대표전화</dt><dd><span class="t-num">031-494-0719</span></dd></div>
        <div class="nameplate__row nameplate__row--wide"><dt>주소</dt><dd>경기도 안산시 단원구 해봉로 237 반월장비창고 제2창고동 (반월국가산단 4블록)</dd></div>
        <div class="nameplate__row"><dt>긴급출동</dt><dd><span class="t-num">031-494-0799</span> · 24시간</dd></div>
        <div class="nameplate__row"><dt>사업자</dt><dd><span class="t-num">134-86-20719</span></dd></div>
        <div class="nameplate__row"><dt>운영</dt><dd>평일 06:30–22:00 · 토 08:00–13:00 · 일·공휴일 휴무</dd></div>
        <div class="nameplate__row"><dt>규격</dt><dd>BW-STD 19 제3판 (2026.09 개정)</dd></div>
      </dl>
      <p class="nameplate__warn"><svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3L22 20H2z"/><path d="M12 10v4.5M12 17v.5"/></svg>지게차 통로 보행 금지 — 안전모·안전화 착용 후 출입</p>
    </div>
  </div>
</footer>
```

pages/*.html (앱 셸 화면은 `.app` 닫은 뒤에 둔다):

```html
<footer class="site-foot">
  <div class="wrap">
    <div class="nameplate">
      <div class="nameplate__brand">
        <div class="nameplate__mark">
          <span class="wordmark__plate" aria-hidden="true">BW</span>
          <p class="nameplate__name">반월장비창고<span class="nameplate__en">BANWOL EQUIPMENT DEPOT</span></p>
        </div>
        <nav class="nameplate__links" aria-label="바닥글">
          <a href="../index.html">BW-STD 19 규격집</a>
          <a href="dashboard.html">상황판</a>
          <a href="product.html">장비 사양</a>
          <a href="pricing.html">보전 계약</a>
          <a href="onboarding.html">신규 거래처 등록</a>
          <a href="settings.html">설정</a>
          <a href="404.html">미등록 위치</a>
        </nav>
      </div>
      <dl class="nameplate__spec">
        <div class="nameplate__row"><dt>상호</dt><dd>반월장비창고</dd></div>
        <div class="nameplate__row"><dt>대표전화</dt><dd><span class="t-num">031-494-0719</span></dd></div>
        <div class="nameplate__row nameplate__row--wide"><dt>주소</dt><dd>경기도 안산시 단원구 해봉로 237 반월장비창고 제2창고동 (반월국가산단 4블록)</dd></div>
        <div class="nameplate__row"><dt>긴급출동</dt><dd><span class="t-num">031-494-0799</span> · 24시간</dd></div>
        <div class="nameplate__row"><dt>사업자</dt><dd><span class="t-num">134-86-20719</span></dd></div>
        <div class="nameplate__row"><dt>운영</dt><dd>평일 06:30–22:00 · 토 08:00–13:00 · 일·공휴일 휴무</dd></div>
        <div class="nameplate__row"><dt>규격</dt><dd>BW-STD 19 제3판 (2026.09 개정)</dd></div>
      </dl>
      <p class="nameplate__warn"><svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3L22 20H2z"/><path d="M12 10v4.5M12 17v.5"/></svg>지게차 통로 보행 금지 — 안전모·안전화 착용 후 출입</p>
    </div>
  </div>
</footer>
```

### 3-4. 공통 오버레이 — 위치·자산 조회기(⌘K) + 토스트 자리

모든 HTML의 `</footer>` 뒤, `<script>` 앞에 둔다. ⌘K / Ctrl+K / `/` 로 열리고, navbar의 `[data-command-open]`도 같은 조회기를 연다.

index.html:

```html
<div class="command" id="command" hidden>
  <div class="command__scrim"></div>
  <div class="command__box" role="dialog" aria-modal="true" aria-label="위치·자산 조회">
    <div class="command__field">
      <svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8V4h4M16 4h4v4M20 16v4h-4M8 20H4v-4M4 12h16"/></svg>
      <input class="command__input" type="text" role="combobox" aria-expanded="false" aria-controls="command-list" aria-autocomplete="list" aria-label="위치 코드, 자산번호, 작업지시로 조회" placeholder="위치 코드 · 자산번호 · 작업지시" autocomplete="off" spellcheck="false">
      <button type="button" class="command__close" data-command-close aria-label="조회기 닫기"><svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button>
    </div>
    <div class="command__list" role="listbox" id="command-list" aria-label="조회 결과">
      <p class="command__group" role="presentation">화면</p>
      <div class="command__opt" role="option" aria-selected="false" data-href="pages/dashboard.html" data-keywords="상황판 대시보드 d001"><span class="loc">D-00-1</span><span class="command__name">창고 상황판<small>오늘 출고 12건 · 06:40 기준</small></span></div>
      <div class="command__opt" role="option" aria-selected="false" data-href="pages/kanban.html" data-keywords="작업지시 칸반 정비 w001"><span class="loc">W-00-1</span><span class="command__name">정비 작업 지시판<small>진행 19건</small></span></div>
      <div class="command__opt" role="option" aria-selected="false" data-href="pages/inbox.html" data-keywords="요청함 거래처 긴급 r001"><span class="loc">R-00-1</span><span class="command__name">거래처 요청함<small>미처리 8건 · 긴급출동 1건</small></span><span class="badge badge--ban">긴급</span></div>
      <div class="command__opt" role="option" aria-selected="false" data-href="pages/pricing.html" data-keywords="보전 계약 요금 p001"><span class="loc">P-00-1</span><span class="command__name">정비 보전 계약<small>정기 보전 A 월 ₩890,000</small></span></div>
      <div class="command__opt" role="option" aria-selected="false" data-href="pages/onboarding.html" data-keywords="신규 거래처 등록 n001"><span class="loc">N-00-1</span><span class="command__name">신규 거래처 등록</span></div>
      <div class="command__opt" role="option" aria-selected="false" data-href="pages/settings.html" data-keywords="설정 라벨 프린터 s001"><span class="loc">S-00-1</span><span class="command__name">설정<small>알림 · 라벨 프린터 · 교대 시간</small></span></div>
      <div class="command__opt" role="option" aria-selected="false" data-href="index.html" data-keywords="규격집 bw-std 19"><span class="loc loc--out">STD-19</span><span class="command__name">BW-STD 19 규격집<small>제3판 · 2026.09 개정</small></span></div>
      <p class="command__group" role="presentation">장비</p>
      <div class="command__opt" role="option" aria-selected="false" data-href="pages/product.html" data-keywords="bw-fl-0214 지게차 fb25 b073"><span class="loc">B-07-3</span><span class="command__name">2.5톤 전동 지게차 FB25<small>BW-FL-0214 · 일 ₩98,000</small></span><span class="badge badge--idle">대기</span></div>
      <div class="command__opt" role="option" aria-selected="false" data-href="pages/kanban.html" data-keywords="bw-fl-0156 지게차 fb15 b052 사용금지"><span class="loc loc--ban">B-05-2</span><span class="command__name">1.5톤 전동 지게차 FB15<small>BW-FL-0156 · 마스트 체인 마모</small></span><span class="badge badge--ban">사용 금지</span></div>
      <div class="command__opt" role="option" aria-selected="false" data-href="pages/inbox.html" data-keywords="bw-awp-0012 붐 고소작업대 y01"><span class="loc loc--out">Y-01</span><span class="command__name">붐 고소작업대 14m<small>BW-AWP-0012 · 성진프레스</small></span><span class="badge badge--rent">임대 중</span></div>
      <div class="command__opt" role="option" aria-selected="false" data-href="pages/dashboard.html" data-keywords="bw-gen-0031 발전기 d111 점검지연"><span class="loc">D-11-1</span><span class="command__name">디젤 발전기 60kVA<small>BW-GEN-0031</small></span><span class="badge badge--late">점검 지연</span></div>
      <p class="command__group" role="presentation">작업지시</p>
      <div class="command__opt" role="option" aria-selected="false" data-href="pages/kanban.html" data-keywords="wo-2610-031 시저 유압"><span class="loc loc--out">C-02-1</span><span class="command__name">시저 고소작업대 8m 정비<small>WO-2610-031 · 한도윤</small></span><span class="badge badge--check">작업 중</span></div>
    </div>
    <p class="command__empty" hidden>「<b data-command-query></b>」에 맞는 위치·자산이 없습니다. 위치 코드는 「B-07-3」처럼 구역-열-단으로 입력합니다.</p>
    <div class="command__foot"><span><span class="kbd">↑</span><span class="kbd">↓</span>이동</span><span><span class="kbd">↵</span>열기</span><span><span class="kbd">esc</span>닫기</span></div>
  </div>
</div>
<div class="toast-zone" aria-live="polite" aria-relevant="additions"></div>
```

pages/*.html:

```html
<div class="command" id="command" hidden>
  <div class="command__scrim"></div>
  <div class="command__box" role="dialog" aria-modal="true" aria-label="위치·자산 조회">
    <div class="command__field">
      <svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8V4h4M16 4h4v4M20 16v4h-4M8 20H4v-4M4 12h16"/></svg>
      <input class="command__input" type="text" role="combobox" aria-expanded="false" aria-controls="command-list" aria-autocomplete="list" aria-label="위치 코드, 자산번호, 작업지시로 조회" placeholder="위치 코드 · 자산번호 · 작업지시" autocomplete="off" spellcheck="false">
      <button type="button" class="command__close" data-command-close aria-label="조회기 닫기"><svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button>
    </div>
    <div class="command__list" role="listbox" id="command-list" aria-label="조회 결과">
      <p class="command__group" role="presentation">화면</p>
      <div class="command__opt" role="option" aria-selected="false" data-href="dashboard.html" data-keywords="상황판 대시보드 d001"><span class="loc">D-00-1</span><span class="command__name">창고 상황판<small>오늘 출고 12건 · 06:40 기준</small></span></div>
      <div class="command__opt" role="option" aria-selected="false" data-href="kanban.html" data-keywords="작업지시 칸반 정비 w001"><span class="loc">W-00-1</span><span class="command__name">정비 작업 지시판<small>진행 19건</small></span></div>
      <div class="command__opt" role="option" aria-selected="false" data-href="inbox.html" data-keywords="요청함 거래처 긴급 r001"><span class="loc">R-00-1</span><span class="command__name">거래처 요청함<small>미처리 8건 · 긴급출동 1건</small></span><span class="badge badge--ban">긴급</span></div>
      <div class="command__opt" role="option" aria-selected="false" data-href="pricing.html" data-keywords="보전 계약 요금 p001"><span class="loc">P-00-1</span><span class="command__name">정비 보전 계약<small>정기 보전 A 월 ₩890,000</small></span></div>
      <div class="command__opt" role="option" aria-selected="false" data-href="onboarding.html" data-keywords="신규 거래처 등록 n001"><span class="loc">N-00-1</span><span class="command__name">신규 거래처 등록</span></div>
      <div class="command__opt" role="option" aria-selected="false" data-href="settings.html" data-keywords="설정 라벨 프린터 s001"><span class="loc">S-00-1</span><span class="command__name">설정<small>알림 · 라벨 프린터 · 교대 시간</small></span></div>
      <div class="command__opt" role="option" aria-selected="false" data-href="../index.html" data-keywords="규격집 bw-std 19"><span class="loc loc--out">STD-19</span><span class="command__name">BW-STD 19 규격집<small>제3판 · 2026.09 개정</small></span></div>
      <p class="command__group" role="presentation">장비</p>
      <div class="command__opt" role="option" aria-selected="false" data-href="product.html" data-keywords="bw-fl-0214 지게차 fb25 b073"><span class="loc">B-07-3</span><span class="command__name">2.5톤 전동 지게차 FB25<small>BW-FL-0214 · 일 ₩98,000</small></span><span class="badge badge--idle">대기</span></div>
      <div class="command__opt" role="option" aria-selected="false" data-href="kanban.html" data-keywords="bw-fl-0156 지게차 fb15 b052 사용금지"><span class="loc loc--ban">B-05-2</span><span class="command__name">1.5톤 전동 지게차 FB15<small>BW-FL-0156 · 마스트 체인 마모</small></span><span class="badge badge--ban">사용 금지</span></div>
      <div class="command__opt" role="option" aria-selected="false" data-href="inbox.html" data-keywords="bw-awp-0012 붐 고소작업대 y01"><span class="loc loc--out">Y-01</span><span class="command__name">붐 고소작업대 14m<small>BW-AWP-0012 · 성진프레스</small></span><span class="badge badge--rent">임대 중</span></div>
      <div class="command__opt" role="option" aria-selected="false" data-href="dashboard.html" data-keywords="bw-gen-0031 발전기 d111 점검지연"><span class="loc">D-11-1</span><span class="command__name">디젤 발전기 60kVA<small>BW-GEN-0031</small></span><span class="badge badge--late">점검 지연</span></div>
      <p class="command__group" role="presentation">작업지시</p>
      <div class="command__opt" role="option" aria-selected="false" data-href="kanban.html" data-keywords="wo-2610-031 시저 유압"><span class="loc loc--out">C-02-1</span><span class="command__name">시저 고소작업대 8m 정비<small>WO-2610-031 · 한도윤</small></span><span class="badge badge--check">작업 중</span></div>
    </div>
    <p class="command__empty" hidden>「<b data-command-query></b>」에 맞는 위치·자산이 없습니다. 위치 코드는 「B-07-3」처럼 구역-열-단으로 입력합니다.</p>
    <div class="command__foot"><span><span class="kbd">↑</span><span class="kbd">↓</span>이동</span><span><span class="kbd">↵</span>열기</span><span><span class="kbd">esc</span>닫기</span></div>
  </div>
</div>
<div class="toast-zone" aria-live="polite" aria-relevant="additions"></div>
```

---

## 4. 아이콘 (인라인 SVG, `class="ico"`, `viewBox="0 0 24 24"`, `aria-hidden="true"`)

선 2px · 각진 끝(`stroke-linecap: square`). 크기 `.ico--sm`(16) 기본(20) `.ico--lg`(24) `.ico--xl`(40). 색은 `currentColor`. **상태는 색 + 아이콘 + 한글 라벨 셋을 함께** 쓴다.

| 이름 | `<svg class="ico" viewBox="0 0 24 24" aria-hidden="true">` 안쪽 |
|---|---|
| 경고(삼각) | `<path d="M12 3L22 20H2z"/><path d="M12 10v4.5M12 17v.5"/>` |
| 금지(원+사선) | `<circle cx="12" cy="12" r="9"/><path d="M5.6 5.6l12.8 12.8"/>` |
| 지시(원) | `<circle cx="12" cy="12" r="9"/><path d="M12 7v6M12 16v1"/>` |
| 안내(사각) | `<rect x="3" y="3" width="18" height="18"/><path d="M12 10.5V17M12 7v.5"/>` |
| 확인(체크) | `<path d="M5 12.5l4.5 4.5L19 7.5"/>` · 상자 체크 `<rect x="3" y="3" width="18" height="18"/><path d="M7 12.5l3.2 3.2L17 8.8"/>` |
| 닫기 | `<path d="M6 6l12 12M18 6L6 18"/>` |
| 스캐너(조회) | `<path d="M4 8V4h4M16 4h4v4M20 16v4h-4M8 20H4v-4M4 12h16"/>` |
| 메뉴 | `<path d="M4 6h16M4 12h16M4 18h16"/>` |
| 이전 / 다음 | `<path d="M15 5l-7 7 7 7"/>` / `<path d="M9 5l7 7-7 7"/>` |
| 더하기 / 빼기 | `<path d="M5 12h14M12 5v14"/>` / `<path d="M5 12h14"/>` |
| 라벨 프린터 | `<path d="M6 9V3h12v6M6 17H3V9h18v8h-3M6 14h12v7H6z"/>` |
| 잠금(LOTO) | `<rect x="5" y="11" width="14" height="10"/><path d="M8 11V7a4 4 0 0 1 8 0v4M12 15v2"/>` |
| 꼬리표 | `<path d="M3 8l5-5h13v18H8l-5-5z"/><path d="M9 12h0"/>` |
| 재생 / 정지 | `<path class="fill" d="M7 5l12 7-12 7z"/>` / `<path d="M8 5v14M16 5v14"/>` |

---

## 5. 시그니처

### 5-1. ① 정비 꼬리표 (모따기 45° + 펀치 구멍)

`.badge .card .toast .popover__panel .modal__box .kcard .tag .hangtag` 는 모두 꼬리표 형상이다(base.css가 `::before`/`::after`로 그림 — 이 요소들에 `::before`/`::after`를 장면 CSS에서 덮어쓰지 말 것). 그림자는 `filter: drop-shadow`(`--tf-shadow`)라 `box-shadow`를 주지 않는다.

```html
<!-- 범용 꼬리표 블록 -->
<div class="tag">…</div>
<div class="tag tf--ok">…</div>      <!-- 사용 가능: 초록 면 흰 글자 -->
<div class="tag tf--check">…</div>   <!-- 점검 중: 노랑 면 검정 글자 -->
<div class="tag tf--ban">…</div>     <!-- 사용 금지: 빨강 면 흰 글자 -->
<div class="tag tf--late">…</div>    <!-- 점검 지연: 주황 면 -->
<div class="tag tf--info">…</div>    <!-- 정보: 라벨지 면 -->
```

조절 변수(장면 CSS에서 `style` 또는 클래스로): `--tf-c`(모따기 16/12/6) `--tf-bw`(테두리) `--tf-face` `--tf-edge` `--tf-ring` `--tf-hole-r` `--tf-hole-x` `--tf-hole-y` `--tf-shadow` `--tf-pad`.

**구멍 안 색 `--hole-bg`.** 구멍은 꼬리표가 놓인 바탕색으로 칠한다(기본 `--bg`). `.panel` `.table-wrap` `.slip` `.tabs__panel` `.drawer__panel` `.command__box` `.shiftcal` `.accordion` `.empty` `.navbar` `.sidebar` `.carousel` `.bench` `.nameplate` `.rack-label` 안은 자동으로 `--surface`, 꼬리표 안의 꼬리표(카드 안 배지)는 부모 면 색이 된다. **장면이 다른 색 면(예: 타공판, 강판, 노랑 띠) 위에 꼬리표를 놓으면 그 면 요소에 `--hole-bg: var(--…)`를 같이 선언**한다.

### 5-2. 매달린 꼬리표 (장면 전용: index 표지 · 열쇠함 · product 점검 꼬리표 · pricing 권장 표시)

```html
<div class="hang" style="--tilt:4deg">
  <svg class="hang__wire" viewBox="0 0 40 56" aria-hidden="true"><path d="M20 0v20c0 8-6 12-6 20s6 10 6 16"/></svg>
  <a class="hangtag tf--info" href="pages/dashboard.html">
    <span class="t-latin">D-00-1</span>
    <p class="t-kr3">창고 상황판</p>
    <p class="t-body-s">06:40 교대 전 현황 · 출고 12건</p>
  </a>
</div>
```

- `--tilt` −3°~4°(모바일 ≤2°). hover/focus-within 시 240ms 흔들림(`tag-swing`), reduced-motion이면 기울기만.
- 위 두 모서리 모따기 + 구멍 위 중앙(28px). 링크면 `<a class="hangtag">`, 정보만이면 `<div>`.
- 일반 카드·목록은 기울이지 않는다.

### 5-3. ② 랙 위치 라벨 (모든 머리말·식별자의 형식)

```html
<!-- 기본 72px (섹션 머리말) -->
<div class="rack-label">
  <span class="rack-label__code">A-01-1</span>
  <h2 class="rack-label__name">버튼 · 꼬리표 · 입력</h2>
  <span class="rack-label__bar"><span>BW-STD-19-A011</span></span>   <!-- 바코드 + 하단 숫자 -->
  <span class="rack-label__meta"><span class="t-latin">QTY</span><b>14</b></span>
</div>
<!-- 페이지 제목 96px -->
<div class="rack-label rack-label--lg">…<h1 class="rack-label__name">창고 상황판</h1>…</div>
<!-- 작은 칸 머리 40px (랙 칸 · 칸반 열 · 사이드바 · 드로어) — bar/meta는 생략 가능 -->
<div class="rack-label rack-label--sm"><span class="rack-label__code">B-07-3</span><span class="rack-label__name">2.5톤 전동 지게차</span></div>
```

- 섹션은 **가운데 정렬 제목 대신 항상 이 라벨로 시작**한다. 라벨은 섹션 폭 전체.
- ≤768: 코드 + 품명 한 줄(첫 행은 내용만큼 자라고 위아래 8px 여백), 바코드(120px)·수량(왼쪽 정렬)은 아래 줄로 접힘(자동). 바코드만 있거나 수량만 있으면 아래 줄 전체를 쓴다.
- **코드 칸에는 위치 코드만**: `구역-열` · `구역-열-단` 또는 부모에서 파생(`B-07-3·1`, `L-05-2`, `B-00-2`). `FB25` `IT` `4×8` 같은 라틴 약어는 메타 칸(`<span class="t-latin">FB25</span><b>10</b>`)으로 보낸다.
- 다크에서도 라벨지는 밝은 반사 라벨(자동).

### 5-4. 위치 코드 칩 · 식별자 · 표시등

```html
<span class="loc">B-07-3</span>                 <!-- 노랑 스텐실 칩 -->
<span class="loc loc--lg">C-02-1</span>         <!-- 44px -->
<span class="loc loc--out">Y-01</span>          <!-- 라벨지(야외·랙 밖) -->
<span class="loc loc--ban">B-05-2</span>        <!-- 사용 금지 위치 -->
<span class="id">BW-FL-0214</span>              <!-- 모노 식별자 -->
<span class="led"></span> <span class="led led--warn"></span> <span class="led led--ban"></span>
<span class="led led--live" aria-hidden="true"></span>   <!-- 1s steps(2) 점멸, reduced-motion 켜짐 고정 -->
```

---

## 6. 컴포넌트 32종

### accordion — 사양서 접이 행

```html
<div class="accordion" data-accordion="single">          <!-- single: 하나만 열림(생략 시 여러 개) -->
  <div class="accordion__item">
    <h3 class="accordion__heading"><button class="accordion__head" type="button" aria-expanded="true" aria-controls="acc-bat">
      <span class="accordion__no">01</span>
      <span class="accordion__title">배터리<small>80 V 400 Ah 리튬인산철</small></span>
      <span class="accordion__mark" aria-hidden="true"></span>
    </button></h3>
    <div class="accordion__panel" id="acc-bat">
      <dl class="spec-rows"><dt>완충 시간</dt><dd>2시간 30분</dd><dt>연속 가동</dt><dd>약 8시간 (1교대)</dd></dl>
    </div>
  </div>
  <div class="accordion__item">
    <h3 class="accordion__heading"><button class="accordion__head" type="button" aria-expanded="false" aria-controls="acc-mast">…</button></h3>
    <div class="accordion__panel" id="acc-mast" hidden>…</div>
  </div>
</div>
```
상태: 열림 `aria-expanded="true"`(노랑 6px 바 + 노랑 +/− 박스) · hover · focus-visible(안쪽 링) · 비활성 `disabled`.

### alert — 안전보건표지 4종 (+ 정비 중 배너)

```html
<div class="alert alert--warn" role="status">            <!-- --warn 경고 · --ban 금지 · --order 지시 · --info 안내 -->
  <span class="alert__sign"><svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3L22 20H2z"/><path d="M12 10v4.5M12 17v.5"/></svg></span>
  <div class="alert__body">
    <strong class="alert__title">점검 지연 7대</strong>
    <p class="alert__text">BW-GEN-0031 디젤 발전기 60kVA를 포함한 7대의 정기 점검이 기한을 넘겼습니다.</p>
    <div class="alert__actions"><a class="btn btn--secondary btn--sm" href="dashboard.html#late">지연 목록</a></div>
  </div>
  <button class="alert__close" type="button" aria-label="알림 닫기"><svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button>
</div>
```
- 아이콘: warn=경고 삼각, ban=금지, order=지시 원, info=안내 사각(4절).
- `alert--working`: 하단에서 경고 띠가 흐르는 「정비 중」 배너(이 상태에만). `alert--compact`: 한 줄짜리.
- 금지 알림은 `role="alert"`, 나머지 `role="status"`. 닫기는 app.js가 `hidden` 처리.

### badge — 미니 꼬리표

```html
<span class="badge badge--ok"><svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>사용 가능</span>
<span class="badge badge--check">점검 중</span>
<span class="badge badge--ban">사용 금지</span>
<span class="badge badge--rent">임대 중</span>
<span class="badge badge--idle">대기</span>
<span class="badge badge--late">점검 지연</span>
<span class="badge badge--off">반납 완료</span>      <!-- 비활성·종료 -->
<span class="count">19</span> <span class="count count--alert">8</span> <span class="count count--warn">7</span>   <!-- 숫자 칸(꼬리표 아님) -->
```
상태 어휘는 팩트 시트의 장비 상태(대기·임대 중·정비 중·점검 지연·사용 금지)와 꼬리표(사용 가능·점검 중·사용 금지)만 쓴다.

### breadcrumb — 위치 코드 체인

```html
<nav class="breadcrumb" aria-label="위치">
  <ol>
    <li><a href="dashboard.html">제2창고동</a></li>
    <li><a href="dashboard.html">B구역</a></li>
    <li><a href="dashboard.html">07열</a></li>
    <li><span class="loc" aria-current="location">B-07-3</span></li>
  </ol>
</nav>
```
구분자는 CSS가 그리는 2px 사선. 링크 높이 44px.

### button

```html
<button type="button" class="btn btn--primary">출고 확정</button>       <!-- 노랑 면 · 주 행동 -->
<button type="button" class="btn btn--secondary">라벨 출력</button>    <!-- 라벨지 면 -->
<button type="button" class="btn btn--danger">사용 금지 지정</button>  <!-- 빨강, 누르는 동안 하단 경고 띠 -->
<button type="button" class="btn btn--ok">사용 가능 처리</button>
<button type="button" class="btn btn--ghost">취소</button>              <!-- 그림자 없음 -->
<button type="button" class="btn btn--primary btn--lg">임대 신청 <span class="btn__num">₩98,000</span></button>
<button type="button" class="btn btn--secondary btn--sm">새로고침</button>   <!-- 36px, 터치·≤768에서 44px -->
<button type="button" class="btn btn--secondary btn--icon" aria-label="라벨 출력"><svg class="ico" …/></button>
<a class="btn btn--primary btn--block" href="product.html">장비 사양 보기</a>
<div class="btn-row btn-row--end">…</div>
```
상태: hover · `:active`(2px 들어가고 그림자 0) · focus-visible · `disabled`/`aria-disabled="true"`(콘크리트 면) · `aria-busy="true"`(경광등) · `data-state="error"` · `data-state="done"` · 토글 선택 `aria-pressed="true"`(잉크 면, 눌린 채).
시연용 진행 버튼: `data-busy-demo`(실패 시연 `data-busy-demo="fail"`) + `data-busy-text="라벨 출력 중"` `data-done-text="출력 완료"` + 라벨은 `<span data-label>`. `data-toast-title`이 있으면 완료 후 토스트.

### calendar — 교대 근무표 (주 단위)

```html
<div class="shiftcal">
  <div class="shiftcal__head">
    <p class="shiftcal__title">교대 근무표 <span class="id">2026.10.12 – 10.18</span></p>
    <div class="shiftcal__nav">
      <button type="button" aria-label="이전 주"><svg class="ico" …이전/></button>
      <button type="button" aria-label="다음 주" disabled><svg class="ico" …다음/></button>
    </div>
  </div>
  <div class="shiftcal__grid">
    <span class="shiftcal__corner"></span>
    <span class="shiftcal__rowhead">주간조<span class="id">06:30–14:30</span></span>
    <span class="shiftcal__rowhead">오후조<span class="id">14:00–22:00</span></span>
    <!-- 날짜 7개: 월~일. 각 day = 머리 + 주간 칸 + 오후 칸(마지막 칸에 --last) -->
    <div class="shiftcal__day">
      <span class="shiftcal__dayhead"><span class="shiftcal__date">12</span><span class="shiftcal__dow">월</span></span>
      <button type="button" class="shiftcal__slot" data-shift="주간" aria-label="10월 12일 월 주간조 오미란"><span class="shiftcal__who">오미란</span><span class="shiftcal__note">출고 9건</span></button>
      <button type="button" class="shiftcal__slot shiftcal__slot--last" data-shift="오후"><span class="shiftcal__who">윤성호</span></button>
    </div>
    <div class="shiftcal__day shiftcal__day--today">          <!-- 오늘 10/14(수) -->
      <span class="shiftcal__dayhead shiftcal__dayhead--today"><span class="shiftcal__date">14</span><span class="shiftcal__dow">수 · 오늘</span></span>
      <button type="button" class="shiftcal__slot shiftcal__slot--today" data-shift="주간">…</button>
      <button type="button" class="shiftcal__slot shiftcal__slot--today shiftcal__slot--last" data-shift="오후">…</button>
    </div>
    <div class="shiftcal__day">                               <!-- 일요일 휴무 -->
      <span class="shiftcal__dayhead shiftcal__dayhead--off"><span class="shiftcal__date">18</span><span class="shiftcal__dow">일</span></span>
      <span class="shiftcal__slot shiftcal__slot--off" data-shift="주간"><span class="shiftcal__note">휴무 · 긴급출동만</span></span>
      <span class="shiftcal__slot shiftcal__slot--off shiftcal__slot--last" data-shift="오후"><span class="shiftcal__note">휴무</span></span>
    </div>
  </div>
  <p class="sr-only" data-shift-out aria-live="polite"></p>
</div>
```
상태: 선택 `aria-pressed="true"`(잉크 면, app.js가 한 칸만) · 결원 `shiftcal__slot--gap`(노랑 tint) · 휴무 `--off`(해칭) · 토요일 오후는 휴무(운영 08:00–13:00). ≤768에서 날짜별 가로 줄로 바뀐다(`data-shift`가 칸 머리로 보임).

### card — 장비 꼬리표

```html
<a class="card" href="product.html">
  <div class="card__head"><span class="id">BW-FL-0214</span><span class="badge badge--idle">대기</span></div>
  <h3 class="card__title">2.5톤 전동 지게차 FB25</h3>
  <div class="card__specs"><span>정격 <b>2,500</b>kg</span><span>인상 <b>4,500</b>mm</span></div>
  <div class="card__foot"><span class="loc">B-07-3</span><span class="card__price">₩98,000<small>/일</small></span></div>
</a>
<div class="card card--ban">…<p class="card__body">마스트 체인 마모 — 부품 대기</p>…</div>   <!-- --ok / --check / --ban 꼬리표 면 -->
<div class="card-row">…카드 여러 장…</div>     <!-- auto-fill 260px -->
```
상태: 링크·`button.card`·`.card--interactive` hover(−2px 들어 올림) · active · focus-visible · 선택 `aria-selected/aria-pressed="true"` 또는 `.card--selected`(4px 노랑 테두리) · 비활성 `.card--disabled`/`aria-disabled="true"` · 로딩은 skeleton의 `.skel--card`로 대체.

### carousel — 도면 판

```html
<div class="carousel" aria-roledescription="도면 판" aria-label="FB25 도면">
  <div class="carousel__viewport">
    <div class="carousel__track">
      <figure class="carousel__slide" aria-roledescription="도면" aria-label="1 / 3 측면도">
        <div class="carousel__plate">
          <svg viewBox="0 0 320 180" aria-hidden="true">…2px 선도, 강조선은 class="accent"…</svg>
          <span class="carousel__scale">1칸 = 250 mm</span>
        </div>
        <figcaption class="carousel__caption"><b>측면도</b><span>최대 인상 높이 4,500 mm · 포크 길이 1,070 mm · 하중 중심 500 mm</span></figcaption>
      </figure>
      <figure class="carousel__slide" aria-roledescription="도면" aria-label="2 / 3 정면도">…</figure>
      <figure class="carousel__slide" aria-roledescription="도면" aria-label="3 / 3 후면도">…</figure>
    </div>
  </div>
  <div class="carousel__bar">
    <span class="carousel__count" data-carousel-count aria-hidden="true">1<span>/3</span></span>
    <div class="carousel__nums" role="tablist" aria-label="도면 선택">
      <button type="button" class="carousel__num" role="tab" aria-selected="true"><b>1</b><span>측면</span></button>
      <button type="button" class="carousel__num" role="tab" aria-selected="false"><b>2</b><span>정면</span></button>
      <button type="button" class="carousel__num" role="tab" aria-selected="false"><b>3</b><span>후면</span></button>
    </div>
    <button type="button" class="carousel__btn" data-carousel-prev aria-label="이전 도면"><svg class="ico" …이전/></button>
    <button type="button" class="carousel__btn" data-carousel-next aria-label="다음 도면"><svg class="ico" …다음/></button>
  </div>
</div>
```
도면 SVG는 `fill:none; stroke:currentColor`(CSS가 줌) — SVG 속성에 `var()` 금지. 화살표 키 ←/→ 이동, 끝에서 버튼 `disabled`.

### code — 라벨 프린터 ZPL · 규격 스니펫 (양 모드 강판 면)

```html
<div class="code">
  <div class="code__tab">
    <span class="code__file">label-100x50.zpl</span>
    <span class="code__meta">ZPL II · 203dpi</span>
    <button type="button" class="code__copy"><span data-label>복사</span></button>
  </div>
  <pre class="code__pre"><code><span class="code__l"><span class="tk-k">^XA</span></span><span class="code__l"><span class="tk-c">; 랙 위치 라벨 100×50mm</span></span><span class="code__l code__l--hl"><span class="tk-k">^FO</span><span class="tk-n">40,30</span><span class="tk-k">^A0N</span>,<span class="tk-n">120</span>,<span class="tk-n">100</span><span class="tk-k">^FD</span><span class="tk-s">B-07-3</span><span class="tk-k">^FS</span></span><span class="code__l"><span class="tk-k">^XZ</span></span></code></pre>
</div>
```
한 줄 = `.code__l`(줄번호 자동). 토큰 `.tk-k` 명령 · `.tk-s` 값 · `.tk-n` 숫자 · `.tk-c` 주석. 강조 줄 `.code__l--hl`. 인라인 코드는 `<code>`, 키 `<span class="kbd">⌘K</span>`. 복사 버튼은 app.js가 `data-state="done"`·「복사됨」.

### command — ⌘K 위치·자산 조회기

공통 오버레이(3-4)에 이미 있다. index의 「잠금·표지 보드」 견본은 열린 상태 정적 렌더:

```html
<div class="command command--static" id="cmd-sample">
  <div class="command__box" role="dialog" aria-label="위치·자산 조회 견본">
    <div class="command__field">…스캐너 아이콘 + <input class="command__input" role="combobox" aria-expanded="true" aria-controls="cmd-sample-list" aria-label="위치·자산 조회" value="지게차"> …</div>
    <div class="command__list" role="listbox" id="cmd-sample-list">
      <p class="command__group" role="presentation">장비</p>
      <div class="command__opt" role="option" aria-selected="true">…</div>
    </div>
    <p class="command__empty" hidden>「<b data-command-query></b>」에 맞는 위치·자산이 없습니다.</p>
    <div class="command__foot">…</div>
  </div>
</div>
<button type="button" class="btn btn--secondary" data-command-open>조회기 열기 <span class="kbd">⌘K</span></button>
```
옵션: `data-href`(이동) · `data-keywords`(검색어 보강) · `aria-disabled="true"`. 결과 행 = 코드 칩 + `.command__name`(+`<small>`) + 상태 배지. ↑↓ Home End Enter, 입력 즉시 필터, 0건이면 `.command__empty`.

### drawer — 오른쪽 셔틀 패널 (440px)

```html
<button type="button" class="btn btn--secondary" data-drawer-open="drawer-fl0214">장비 상세</button>

<div class="drawer" id="drawer-fl0214" hidden>
  <div class="drawer__scrim"></div>
  <aside class="drawer__panel" role="dialog" aria-modal="true" aria-labelledby="drawer-fl0214-t">
    <div class="drawer__head">
      <div class="rack-label"><span class="rack-label__code">B-07-3</span><h2 class="rack-label__name" id="drawer-fl0214-t">FB25 지게차</h2></div>
      <button type="button" class="drawer__close" data-drawer-close aria-label="닫기"><svg class="ico" …닫기/></button>
    </div>
    <div class="drawer__body">
      <section class="drawer__section"><h3>상태</h3>…</section>
    </div>
    <div class="drawer__foot"><button type="button" class="btn btn--secondary" data-drawer-close>닫기</button><button type="button" class="btn btn--primary">임대 배정</button></div>
  </aside>
</div>
```
왼쪽에서 나오면 `drawer--left`. 정적 견본은 `drawer drawer--static`(hidden 없이, scrim 없이). Esc·스크림 클릭 닫기, 포커스 트랩, 닫으면 트리거로 포커스 복귀.

### empty — 빈 칸

```html
<div class="empty">
  <svg class="empty__art" viewBox="0 0 160 128" aria-hidden="true">
    <rect class="post" x="4" y="4" width="8" height="120"/><rect class="post" x="148" y="4" width="8" height="120"/>
    <rect class="bay" x="22" y="18" width="116" height="80"/>
    <rect class="beam-face" x="12" y="104" width="136" height="2"/><rect class="beam-paint" x="12" y="106" width="136" height="12"/>
  </svg>
  <div class="empty__body">
    <span class="loc">C-11-4</span>
    <p class="empty__title">이 위치에 적재된 물품이 없습니다</p>
    <p class="empty__text">마지막 반출 2026.10.08(목) · 재고관리 주임 정하늘</p>
    <button type="button" class="btn btn--primary btn--sm">입고 등록</button>
  </div>
</div>
```
작은 빈 칸(검색 0건 등)은 `empty empty--compact`.

### form

```html
<form class="stack" data-validate data-ok-title="반입 등록 완료" data-ok-text="랙 라벨을 출력했습니다." data-ok-code="IN-261014-03">
  <div class="form-grid">
    <div class="field">
      <label class="field__label" for="f-asset">자산번호 <span class="field__req">필수</span></label>
      <div class="field__control field__control--icon">
        <svg class="ico" …스캐너/>
        <input class="input is-mono" id="f-asset" required autocomplete="off">
      </div>
      <p class="field__hint">바코드를 찍거나 직접 입력</p>
    </div>
    <div class="field">
      <label class="field__label" for="f-load">정격 하중</label>
      <div class="field__control"><input class="input" id="f-load" type="number" inputmode="numeric" value="2500"><span class="field__unit">kg</span></div>
    </div>
    <div class="field">                                       <!-- 오류 상태: field--invalid + aria-invalid -->
      <label class="field__label" for="f-loc">보관 위치 <span class="field__req">필수</span></label>
      <div class="field__control"><input class="input is-mono" id="f-loc" required pattern="[A-F]-[0-2][0-9]-[1-5]" aria-describedby="f-loc-err"></div>
      <p class="field__error" id="f-loc-err"><svg class="ico" …금지/>단은 1–5까지만 있습니다. 「B-07-3」처럼 입력하세요.</p>
    </div>
    <div class="field"><label class="field__label" for="f-kind">장비 종류</label><select class="select" id="f-kind"><option>전동 지게차 (FL)</option></select></div>
    <div class="field field--full"><label class="field__label" for="f-note">인계 메모 <span class="field__opt">선택</span></label><textarea class="textarea" id="f-note"></textarea></div>
  </div>
  <fieldset class="fieldset"><legend>임대 기간</legend>
    <div class="seg"><label><input type="radio" name="per" checked><span>일</span></label><label><input type="radio" name="per"><span>주</span></label><label><input type="radio" name="per"><span>월</span></label></div>
  </fieldset>
  <label class="check"><input type="checkbox" required><span class="check__box"></span><span class="check__text">지게차 통로 보행 금지 확인<small>확인하지 않으면 출입증이 나오지 않습니다</small></span></label>
  <label class="radio"><input type="radio" name="code" checked><span class="radio__box"></span><span class="radio__text">Code128</span></label>
  <button type="button" class="rocker" role="switch" aria-checked="true"><span class="rocker__body" aria-hidden="true"><span class="rocker__knob"></span></span><span class="rocker__text">점검 꼬리표 만료 D-7 알림<small>만료 7일 전 문자</small></span></button>
  <div class="stepper"><button type="button" data-step="-1" aria-label="수량 줄이기"><svg class="ico" …빼기/></button><input type="number" value="1" min="1" max="5" inputmode="numeric" aria-label="수량"><button type="button" data-step="1" aria-label="수량 늘리기"><svg class="ico" …더하기/></button></div>
  <div class="alert alert--ban alert--compact" data-form-summary hidden>…입력 확인…</div>
  <div class="form-actions"><span class="form-actions__note">VAT 별도</span><button type="button" class="btn btn--ghost">취소</button><button type="submit" class="btn btn--primary" data-busy-text="라벨 출력 중" data-done-text="출력 완료"><span data-label>반입 등록</span></button></div>
</form>
```
- 상태: hover · focus-visible · `disabled`(해칭) · `readonly`(점선) · 오류 `aria-invalid="true"` 또는 `.field--invalid`(빨강 2px + 왼쪽 6px 경고 띠 + `.field__error`) · 통과 `.field--valid` + `.field__ok` · 체크 `:indeterminate` · 로커 `aria-checked`/`disabled`.
- `form[data-validate]`: 제출 시 필수·pattern·min/max 검사 → 첫 오류로 포커스 → 통과하면 제출 버튼 `aria-busy`(「라벨 출력 중」) → 완료 + 토스트(`data-ok-*`). 체크박스 오류는 `.check--invalid`가 같이 붙는다.
- 묶음 `.fieldset`(오류 `.fieldset--invalid`), 2열 `.form-grid`(`.field--full`), 하단 `.form-actions`.

### kanban — 정비 작업 지시판

```html
<div class="kanban">
  <section class="kanban__col" aria-label="접수">
    <div class="kanban__head"><div class="rack-label rack-label--sm"><span class="rack-label__code">W-01</span><h3 class="rack-label__name">접수</h3><span class="rack-label__meta"><b data-count>4</b></span></div></div>
    <div class="kanban__list">
      <article class="kcard" id="wo-2610-039" aria-roledescription="작업지시 꼬리표">
        <div class="kcard__top"><span class="kcard__wo">WO-2610-039</span><span class="badge badge--idle">접수</span></div>
        <p class="kcard__title">오일 필터·벨트 교체</p>
        <p class="kcard__asset">BW-CMP-0052 · D-04-1</p>
        <div class="kcard__foot"><span class="kcard__who"><i aria-hidden="true">한도</i>한도윤</span><span class="kcard__due">10/16(금)</span></div>
      </article>
      <button type="button" class="kanban__add">작업지시 추가</button>
    </div>
  </section>
  <section class="kanban__col" aria-label="검수">
    …
    <div class="kanban__list" data-deny="ban">              <!-- 사용 금지 꼬리표를 받지 않는 칸 -->
      <span class="kanban__deny-note">사용 금지 장비는 검수에 놓을 수 없음</span>
      …
    </div>
  </section>
</div>
```
- 카드 변형: `kcard--ban`(빨강 꼬리표, 사용 금지 장비) · `kcard--check`(노랑, 긴급) · `kcard--done`(완료). 마감 지남 `kcard__due--late`.
- 동작: 드래그 이동(놓는 칸 `is-over`) · 금지 칸 `is-denied`(경고 띠) · 키보드: 카드 포커스 → Space/Enter 집기(`is-grabbed`) → ←/→ 열 이동 → Space 놓기, Esc 취소. 열 머리 `[data-count]` 자동 갱신.
- 열 = 랙 베이(사이 업라이트 자동), 열 바닥 = 주황 빔. 모바일 가로 스크롤 + 스냅.

### list — 출고 전표 줄

```html
<div class="slip">
  <div class="slip__head"><span>오늘 출고 전표</span><span class="id">2026.10.14</span></div>
  <ul>
    <li class="slip__item"><a class="slip__row" href="dashboard.html#out"><span class="loc">B-08-1</span>
      <span class="slip__main"><span class="slip__name">3톤 디젤 지게차 FD30</span><span class="slip__sub">대원정밀(주) · 김경호 과장</span></span>
      <span class="slip__meta"><span class="slip__qty">1<small>대</small></span><span class="slip__time">07:30</span></span></a></li>
  </ul>
</div>
```
행 상태: hover · focus-visible · 선택 `aria-current="true"`/`aria-selected="true"`/`.slip__item--selected`(왼쪽 노랑 4px) · `.slip__item--ban`(왼쪽 8px 경고 띠) · `.slip__item--done`(취소선) · `.slip__item--unread`(노랑 사각) · `aria-disabled="true"`.

### marquee — 전광 안전 게시판

```html
<div class="signboard" role="region" aria-label="전광 안전 게시판">
  <span class="signboard__tag"><span class="led led--live" aria-hidden="true"></span><span>안전 게시</span></span>
  <div class="signboard__viewport">
    <div class="signboard__track">
      <span class="signboard__item">무재해 <b>412</b>일째</span>
      <span class="signboard__item">지게차 통로 보행 금지</span>
      <span class="signboard__item">오늘 출고 마감 <b>15:00</b></span>
      <span class="signboard__item">B구역 07열 바닥 보수 — 우회 통로 이용</span>
    </div>
  </div>
  <button type="button" class="signboard__toggle" aria-pressed="false" aria-label="게시판 흐름 멈춤"></button>
</div>
```
항목은 한 번만 적는다(app.js가 이음매용 복제를 `aria-hidden`으로 붙이고 속도를 맞춤). hover·focus 정지, 정지 버튼, reduced-motion이면 정지 상태로 시작. 양 모드 검정 띠 + 노랑 글자.

### menu — 드롭다운

```html
<div class="menu">
  <button type="button" class="btn btn--secondary" data-menu-toggle aria-haspopup="menu" aria-expanded="false" aria-controls="menu-fl0214">장비 조작</button>
  <div class="menu__list" role="menu" id="menu-fl0214" aria-label="장비 조작" hidden>   <!-- 오른쪽 정렬: menu__list--end -->
    <p class="menu__label">BW-FL-0214</p>
    <button class="menu__item" role="menuitem" type="button"><svg class="ico" …라벨 프린터/>라벨 출력<span class="menu__hint">P</span></button>
    <button class="menu__item" role="menuitemcheckbox" aria-checked="true" type="button">상황판에 고정</button>
    <button class="menu__item" role="menuitem" aria-disabled="true" type="button">임대 연장(계약 없음)</button>
    <div class="menu__sep" role="separator"></div>
    <button class="menu__item menu__item--danger" role="menuitem" type="button" data-modal-open="modal-loto"><svg class="ico" …금지/>사용 금지 지정</button>
  </div>
</div>
```
열면 첫 항목 포커스, ↑↓ Home End, Esc(트리거로 복귀), 바깥 클릭·Tab 닫기. 정적 견본은 `menu menu--static` + 목록 `hidden` 없이.

### modal — 대형 꼬리표

```html
<button type="button" class="btn btn--primary" data-modal-open="modal-out01">출고 확정</button>

<div class="modal" id="modal-out01" hidden>
  <div class="modal__scrim"></div>
  <div class="modal__box" role="dialog" aria-modal="true" aria-labelledby="modal-out01-t">
    <div class="modal__head">
      <span class="modal__code">OUT-01</span>
      <h2 class="modal__title" id="modal-out01-t">출고 확정</h2>
      <button type="button" class="modal__close" data-modal-close aria-label="닫기"><svg class="ico" …닫기/></button>
    </div>
    <div class="modal__body"><p>대원정밀(주) 김경호 과장 앞으로 BW-FL-0187 3톤 디젤 지게차를 07:30에 출고합니다.</p></div>
    <div class="modal__foot">
      <span class="modal__foot-note">반월산단 내 2시간 배송</span>
      <button type="button" class="btn btn--ghost" data-modal-close>취소</button>
      <button type="button" class="btn btn--primary" data-modal-close data-autofocus data-toast="ok" data-toast-title="출고 확정" data-toast-code="OUT-261014-01">출고 확정</button>
    </div>
  </div>
</div>
```
- 파괴적: `modal modal--danger` + `role="alertdialog"`(경고 띠 8px 테두리, 코드 칸 빨강, 기본 포커스는 「취소」에 `data-autofocus`). 코드 칸에는 대상 위치 코드(`B-05-2`)만 쓰고, 현장 약어는 제목 안 `<span class="badge badge--ban modal__tagline">LOTO</span>`로 둔다.
- 넓게 `modal__box--wide`(760px). 정적 견본 `modal modal--static`(hidden·scrim 없이, `aria-modal="false"`).
- Esc·스크림·`[data-modal-close]` 닫기, 포커스 트랩, 스크롤 잠금, 트리거로 포커스 복귀. 모바일은 아래에서 올라오는 시트.

### motion — 동작 시험대

```html
<div class="bench">
  <div class="bench__cell">
    <div class="bench__head"><span class="bench__name">누름</span><span class="bench__spec">80ms</span></div>
    <div class="bench__stage"><span class="bench__puck" data-motion-subject></span></div>
    <button type="button" class="bench__play" data-motion-play="m-press">재생</button>
  </div>
  <!-- m-swing(꼬리표 흔들림, 퍽에 style="transform-origin:50% 0") · m-print(라벨 출력) · m-shuttle(셔틀, 무대 bench__stage--track) · m-steps(진행: <div class="bench__rail"><div class="bench__bar" data-motion-subject></div></div>) -->
</div>
```
재사용 클래스 `.m-press .m-swing .m-print .m-shuttle .m-steps`는 어떤 요소에도 붙일 수 있다. 300ms 넘는 UI 모션·스크롤 리빌·패럴랙스 금지.

### navbar — 3-1 스니펫 그대로

조명 스위치(`.lightswitch[data-theme-toggle]`)는 주간=노랑 로커 위 / 야간=로커 아래 + 노랑 표시등. 사용자 칩 이니셜 「박태」. ≤1180 교대 칩·조회 글자 숨김, ≤920 링크가 드롭다운(사이트 셸) 또는 사이드바 셔틀(앱 셸), ≤480 사용자 칩 숨김.

### pagination

```html
<nav class="pager" aria-label="장비 목록 페이지">
  <a class="pager__step" href="dashboard.html?p=1#fleet" aria-disabled="true">이전</a>
  <ol class="pager__list">
    <li><a class="pager__num" href="dashboard.html?p=1#fleet" aria-current="page">1</a></li>
    <li><a class="pager__num" href="dashboard.html?p=2#fleet">2</a></li>
    <li class="pager__hide-sm"><a class="pager__num" href="dashboard.html?p=3#fleet">3</a></li>
    <li><span class="pager__gap">…</span></li>
    <li><a class="pager__num" href="dashboard.html?p=11#fleet">11</a></li>
  </ol>
  <a class="pager__step" href="dashboard.html?p=2#fleet">다음</a>
  <span class="pager__info"><b>214</b>대 중 1–20</span>
</nav>
```
시연용 버튼형: `<button class="pager__num">` + 이전/다음에 `data-pager-prev` / `data-pager-next`(app.js가 `aria-current`·비활성 갱신, `[data-pager-out]`에 현재 번호).

### popover — 작은 꼬리표

```html
<div class="popover">
  <button type="button" class="loc loc--lg" data-popover-toggle aria-expanded="false" aria-controls="pop-b073">B-07-3</button>
  <div class="popover__panel" id="pop-b073" role="dialog" aria-label="위치 B-07-3" hidden>   <!-- 오른쪽 정렬: popover__panel--end -->
    <span class="popover__arrow" aria-hidden="true"></span>
    <p class="popover__title">B구역 07열 3단</p>
    <dl class="popover__rows"><dt>적재</dt><dd>BW-FL-0214</dd><dt>최근 점검</dt><dd>2026.10.08</dd></dl>
    <p class="popover__foot">정하늘 주임 · 10/08 라벨 교체</p>
  </div>
</div>
```
바깥 클릭·Esc 닫기. 정적 견본 `popover popover--static`.

### progress — 10칸 분절 막대

```html
<div class="meter" data-value="82">
  <div class="meter__top"><span class="meter__label">배터리 잔량 <small>BW-FL-0214</small></span><span class="meter__value" data-meter-out>82<small>%</small></span></div>
  <div class="meter__bar" role="progressbar" aria-label="배터리 잔량" aria-valuemin="0" aria-valuemax="100"><div class="meter__fill"></div></div>
</div>
<!-- 목표 마커(bullet chart) + 위험 적재 주황 -->
<div class="meter" data-value="91.2" data-hot-at="95">
  …<div class="meter__bar" role="progressbar" aria-label="A구역 적재율" aria-valuemin="0" aria-valuemax="100"><div class="meter__fill"></div><span class="meter__target" style="--target:85" data-label="목표 85"></span></div>
</div>
```
- `data-value`(0~100) → app.js가 10칸 단위 `--cells`, `aria-valuenow`, `[data-meter-out]` 숫자 갱신. JS 없이 쓰려면 `.meter__fill`에 `style="--cells:8"`.
- 변형 `meter--hot`/`data-hot-at`(≥값이면 주황) · `meter--ok` · `meter--ban` · `meter--sm` · 진행 중(값 모름) `meter--indeterminate`. 시연 버튼 `data-meter-step="10" aria-controls="<meter id>"`.

### sidebar — 3-2 스니펫 그대로

현재 항목 = 노랑 면 + 왼쪽 6px 잉크. 그룹명 Plex 700 12px. 1024 이하 셔틀 오프캔버스(스크림, Esc, 포커스 트랩, 닫기 44px).

정적 견본(index 열쇠함 등)은 `class="sidebar sidebar--static"` — 어느 폭에서도 오프캔버스로 바뀌지 않고, app.js 는 `.sidebar:not(.sidebar--static)` 만 열고 닫는다.

### skeleton — 적재 예정 칸

```html
<div class="skel skel--card"><span class="skel__cap">적재 예정 칸</span><span class="skel skel--line"></span><span class="skel skel--line skel--w60"></span></div>
<span class="skel skel--title"></span>
<span class="skel skel--line"></span><span class="skel skel--line skel--w40"></span>
<span class="skel skel--chip"></span>  <div class="skel skel--row"></div>  <div class="skel skel--block"></div>
```
점선 테두리 + 1px 사선 해칭 고정. 반짝임·깜빡임 없음. 감싸는 영역에 `aria-busy="true"`.

### spinner — 경광등

```html
<span class="beacon beacon--m" role="status"><span class="sr-only">불러오는 중</span></span>   <!-- --s 16 · --m 24 · --l 40 · --red 정지 대기 -->
<span class="loading"><span class="beacon beacon--m" aria-hidden="true"></span>재고 수치를 불러오는 중</span>
<div class="loading loading--block" role="status"><span class="beacon beacon--l" aria-hidden="true"></span>상황판 갱신 중</div>
```

### steps — 바닥 통로 번호

```html
<ol class="aisle">                                         <!-- ≤640 자동 세로, 좁은 칸은 aisle--v -->
  <li class="aisle__step aisle__step--done"><span class="aisle__plate"><svg class="ico" …확인/></span><span class="aisle__label">사업자 정보</span><span class="aisle__sub">사업자등록증 확인</span></li>
  <li class="aisle__step aisle__step--done"><span class="aisle__plate">2</span><span class="aisle__label">현장 주소·출입 시간</span></li>
  <li class="aisle__step aisle__step--current" aria-current="step"><span class="aisle__plate">3</span><span class="aisle__label">안전 수칙 확인</span><span class="aisle__sub">1개 항목 미확인</span></li>
  <li class="aisle__step aisle__step--todo"><span class="aisle__plate">4</span><span class="aisle__label">출입증 발급</span></li>
</ol>
```
상태: 완료 `--done`(초록 + 체크 아이콘 권장) · 현재 `--current`(노랑 + 하드 그림자) · 이후 `--todo`(점선) · 오류 `--error`(빨강). 지나온 단계로 돌아갈 수 있으면 번호판을 `<a class="aisle__plate" href="…">`로.

### table — 사양표 · 재고표

```html
<div class="table-wrap" data-select-table>
  <div class="table-bulk"><span class="table-bulk__count"><b data-bulk-count>0</b>건 선택</span>
    <div class="btn-row"><button type="button" class="btn btn--primary btn--sm" data-bulk-action data-toast-code="OUT-261014">출고 확정</button></div></div>
  <div class="table-wrap__scroll">
    <table class="table">
      <caption>오늘 출고 예정 <small>12건 · 06:40 기준</small></caption>
      <thead><tr>
        <th class="col-check"><label class="check"><input type="checkbox" data-check-all aria-label="전체 선택"><span class="check__box"></span></label></th>
        <th aria-sort="ascending"><button class="table__sort" type="button">전표</button></th>
        <th>위치</th><th>장비</th><th>거래처</th>
        <th class="num" aria-sort="none"><button class="table__sort" type="button">일 임대료</button></th>
        <th>상태</th>
      </tr></thead>
      <tbody>
        <tr><td class="col-check"><label class="check"><input type="checkbox" aria-label="OUT-261014-01 선택"><span class="check__box"></span></label></td>
          <td><span class="id">OUT-261014-01</span></td><td><span class="loc">B-08-1</span></td>
          <td>3톤 디젤 지게차 FD30<small>BW-FL-0187</small></td><td>대원정밀(주)</td>
          <td class="num" data-sort="110000">₩110,000</td><td data-status><span class="badge badge--rent">임대 중</span></td></tr>
        <tr class="table__row--ban">…사용 금지 행: 체크박스 disabled…</tr>
        <tr class="table__row--late">…점검 지연 행…</tr>
      </tbody>
    </table>
  </div>
  <div class="table-foot"><span>VAT 별도</span><span>정하늘 주임 갱신</span></div>
</div>
```
- 정렬: `th[aria-sort]` 안 `<button class="table__sort">`(숫자 열은 `td[data-sort]`에 원값). 선택 행 `aria-selected="true"`(app.js). `[data-bulk-action]`이 선택 행을 확정 처리 + 토스트, `[data-status]` 칸을 「출고 확정」 배지로 바꿈.
- 행 변형 `table__row--ban`(왼쪽 8px 경고 띠) · `--late`(노랑 tint) · `--muted`. 모바일은 가로 스크롤 + 오른쪽 32px 페이드(자동).
- 사양표: `<table class="table table--spec">` + `<th scope="row">정격 하중</th><td class="num">2,500<span class="unit">kg</span></td>`, 행 44px.

### tabs — 서랍 손잡이

```html
<div class="tabs">
  <div class="tabs__bar">
    <div class="tabs__list" role="tablist" aria-label="장비 정보">
      <button class="tabs__tab" role="tab" id="tab-spec" aria-controls="panel-spec" aria-selected="true" type="button">사양</button>
      <button class="tabs__tab" role="tab" id="tab-log" aria-controls="panel-log" aria-selected="false" type="button">점검 이력 <span class="count">5</span></button>
      <button class="tabs__tab" role="tab" id="tab-rent" aria-controls="panel-rent" aria-selected="false" type="button">임대 조건</button>
    </div>
  </div>
  <div class="tabs__panel" role="tabpanel" id="panel-spec" aria-labelledby="tab-spec" tabindex="0">…</div>
  <div class="tabs__panel" role="tabpanel" id="panel-log" aria-labelledby="tab-log" tabindex="0" hidden>…</div>
  <div class="tabs__panel" role="tabpanel" id="panel-rent" aria-labelledby="tab-rent" tabindex="0" hidden>…</div>
</div>
```
←/→ Home End, 로빙 tabindex. 비활성 탭 `aria-disabled="true"`(해칭). 줄이 넘치면 오른쪽 페이드 힌트(자동, 바탕이 `--bg`가 아니면 `.tabs`에 `--fade-to: var(--surface)`).

### timeline — 점검 이력부

```html
<ol class="logbook">
  <li class="logbook__item">
    <span class="logbook__date">2026.10.08<small>목</small></span>
    <span class="logbook__node logbook__node--ok logbook__node--now" aria-hidden="true"></span>
    <div class="logbook__body">
      <p class="logbook__title">정기 점검 합격 — 꼬리표 IT-58213 발급</p>
      <p class="logbook__text">브레이크·경음기·후진 경보 이상 없음. 다음 점검 2026.11.08.</p>
      <div class="logbook__meta"><b>박태용</b><span class="id">WO-2610-008</span></div>
    </div>
  </li>
</ol>
```
노드 `--ok` 초록 · `--check` 노랑 · `--ban` 빨강 · `--info` 파랑 · `--now` 최신(노랑 링). 노드 색만으로 뜻을 전하지 말고 제목에 상태 단어를 쓴다.

### toast — 라벨 출력

```html
<button type="button" class="btn btn--secondary" data-toast="ok" data-toast-title="출고 2건 확정" data-toast-text="출고 전표를 라벨 프린터로 보냈습니다." data-toast-code="OUT-261014-01">출고 확정</button>
<script>/* 또는 */ BWD.toast({ type: "warn", title: "재주문점 미달 23종", text: "P-4410-207 마스트 체인 외", code: "" });</script>
```
`type`: `ok` · `warn` · `ban` · `info`. 오른쪽 위(모바일 아래)에서 라벨 출력 모션, 4초 후 닫힘(hover·focus 중 정지), 닫기 44px. 정적 견본:
```html
<div class="toast toast--static toast--ok">
  <span class="toast__icon"><svg class="ico" …상자 체크/></span>
  <div class="toast__body"><strong class="toast__title">출고 2건 확정</strong><p class="toast__text">출고 전표를 라벨 프린터로 보냈습니다.</p><span class="toast__code">OUT-261014-01</span></div>
  <button type="button" class="toast__close" aria-label="알림 닫기"><svg class="ico" …닫기/></button>
</div>
```

### tooltip

```html
<span class="tip">
  <button type="button" class="btn btn--secondary btn--icon" aria-describedby="tip-loc" aria-label="위치 코드 설명"><svg class="ico" …안내/></button>
  <span class="tip__bubble" role="tooltip" id="tip-loc">구역-열-단 · 예: B-07-3</span>
</span>
```
위치 `tip--below` · `tip--start` · `tip--end`. hover/focus 120ms 뒤 표시, Esc로 숨김. 정적 견본 `tip tip--static`. 반전 면(라이트 검정 / 다크 밝은 회색), 화살표 없음.

---

## 7. app.js 연결 고리 한눈에

| 속성 / API | 동작 |
|---|---|
| `[data-theme-toggle]` | 주간/야간 조명 전환, `bwd-theme` 저장, `aria-pressed`·`aria-label` 갱신 |
| `[data-modal-open="id"]` `[data-modal-close]` | 모달 열기/닫기(스크림·Esc 포함) |
| `[data-drawer-open="id"]` `[data-drawer-close]` | 드로어 |
| `[data-command-open]`, ⌘K / Ctrl+K / `/` | 조회기(`.command:not(.command--static)` 첫 번째) |
| `[data-sidebar-open]` `[data-sidebar-close]` | 앱 셸 사이드바 셔틀(≤1024) |
| `[data-nav-toggle]` | 사이트 셸 모바일 링크 드롭다운 |
| `[data-menu-toggle]` `[data-popover-toggle]` (+ `aria-controls`) | 메뉴 · 팝오버 |
| `[role=tablist]` / `.accordion__head` / `.carousel` | 탭 · 아코디언 · 캐러셀 |
| `[data-toast]` + `data-toast-title/-text/-code`, `BWD.toast({})` | 토스트 |
| `[data-busy-demo]` | 버튼 진행 → 완료/실패 시연 |
| `form[data-validate]` + `data-ok-title/-text/-code`, `[data-form-summary]` | 폼 검사 · 제출 피드백 |
| `button.rocker[role=switch]` (+ `[data-rocker-state]`) | 로커 스위치 |
| `.stepper [data-step]` | 수량 스텝퍼(min/max에서 버튼 비활성) |
| `.meter[data-value]`, `[data-meter-step]`, `BWD.setMeter(el, v)` | 진행률 |
| `[data-select-table]` `[data-check-all]` `[data-bulk-count]` `[data-bulk-action]` `[data-status]` | 표 선택 · 일괄 처리 |
| `.table__sort` | 정렬(`td[data-sort]` 원값). 높이 44px(th 패딩 12px만큼 음수 여백으로 칸 전체를 덮는 터치 타깃) |
| `.kanban` `[data-count]` `.kanban__list[data-deny="ban"]` | 칸반 드래그·키보드 이동 |
| `.shiftcal button.shiftcal__slot` `[data-shift-out]` | 근무 칸 선택 |
| `.signboard` `.signboard__toggle` | 게시판 복제·정지 |
| `[data-motion-play="m-…"]` + `[data-motion-subject]` | 동작 시험대 |
| `button.pager__num` `[data-pager-prev]` `[data-pager-next]` `[data-pager-out]` | 시연용 페이지 번호 |
| `.code__copy` / `.alert__close` / `.tip` Esc | 복사 · 알림 닫기 · 툴팁 숨김 |
| `.table-wrap` `.tabs__bar` `.scroll-hint > .scroll-x` | 가로 넘침 페이드 힌트(`data-overflow` · `data-at-end`) |
| `BWD.openModal(id)` `BWD.openDrawer(id)` `BWD.announce(msg)` `BWD.setTheme(t)` | 장면 스크립트용 |

---

## 8. 장면 작업 점검표

- [ ] 첫 화면이 eyebrow+헤드라인+CTA 2개+칩 공식이 아니다. 가운데 정렬 섹션 헤더 없음 — 섹션은 랙 라벨로 시작.
- [ ] 경고 띠는 위험·차단·잠금 의미가 있는 곳에만. 리벳은 footer 명판에만.
- [ ] Black Han Sans는 24px 이상 한글 제목만. 한글이 섞인 라벨에 넓은 자간·대문자·모노 금지.
- [ ] 노랑 면은 라이트에서 항상 2px 잉크 테두리(컴포넌트는 자동, 장면에서 노랑 면을 직접 칠할 때 `border: var(--bw) solid var(--edge-on-color)`).
- [ ] 360/390px 가로 넘침 0, 터치 타깃 44px, 다크 모드도 「야간 창고」로 확인.
- [ ] 꼬리표(.tag · .kcard · .card 등)를 --bg 가 아닌 면(타공판 · 강판 · 노랑 띠) 위에 놓으면 그 면 요소에 `--hole-bg` 를 함께 선언한다(5-1).
- [ ] 알림 안의 버튼은 `a.btn` 이어도 알림 글자색을 물려받지 않는다(alert.css `a:not(.btn)`).
- [ ] progress 목표 눈금 라벨(`data-label` 값이 있을 때)은 막대 아래 18px 를 차지한다 — 미터를 여러 줄로 쌓아도 겹치지 않음.
- [ ] 표 셀은 가로 스크롤 안에서 최소 6.5em(숫자 · 체크 칸 제외) — 한글 장비명이 세로로 쌓이지 않는다.
- [ ] 정적 조회기 견본(.command--static)은 로드 때 페이지를 스크롤하지 않는다(app.js).
- [ ] 수치는 팩트 시트와 일치: 214대 = 147 + 41 + 19 + 7, 적재율 82.4%, 출고 12건, 요청 8건(긴급 1), 작업지시 19건(4·5·6·4), 무재해 412일.

### 도면 판 측면 선도(FB25) — index·product 공용
`svg.fl-side`(viewBox 0 0 356 242)는 index 03 사양서와 product 도면 판이 **같은 마크업**을 쓴다. 클래스: `fl-fill`(면 = `--surface`), `fl-hatch`(지면 해칭), `fl-ghost`(최대 인상 위치 점선), `fl-dim`(치수선 1.5px `currentColor` = `--orange-text`, `fl-arrow` 화살촉, `text` = Plex Mono 12). 선 두께는 `vector-effect: non-scaling-stroke`로 확대·축소와 무관하게 2px/1.5px 고정. 축척 표기는 오른쪽 위 `carousel__scale`.
