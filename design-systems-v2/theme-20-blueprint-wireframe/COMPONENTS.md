# COMPONENTS — 가선 시트룸 GSA-STD-2026 마크업 계약

> 장면 에이전트(index · pages)는 이 문서의 마크업을 **그대로 복사**한다. 클래스 이름을 새로 만들지 말고, 필요한 장면 전용 배치는 `index.css` / `pages/<name>.css` 에만 쓴다(semantic 토큰만 사용).
> 값(날짜·인물·수치)은 `DIRECTION.md` 2절 팩트 시트만 쓴다. 기준일 **2026년 10월 15일(목) 14:20**, 로그인 **오태경**.
> 표기: 본문 `2026년 10월 15일(목)`, 표·표제란 `2026.10.15`. 요일은 모노 밖에 둔다: `<span class="mono">10.15</span> (목)`.

---

## 0. 페이지 뼈대 (모든 HTML 공통)

### 0-1. `<head>` — index.html

```html
<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>도면·화면 작성 기준 — 가선 시트룸</title>
<script>(function(){var r=document.documentElement,t=null;try{var q=new URLSearchParams(location.search).get('theme');if(q==='dark'||q==='light')t=q;else t=localStorage.getItem('gsa-theme');}catch(e){}if(t!=='dark'&&t!=='light')t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';r.setAttribute('data-theme',t);try{if(localStorage.getItem('gsa-layer-grid')==='off')r.setAttribute('data-layer-grid','off');if(localStorage.getItem('gsa-layer-dims')==='off')r.setAttribute('data-layer-dims','off');}catch(e){}r.classList.add('js');})();</script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Condensed:wght@200;300;400;500;600&family=IBM+Plex+Sans+KR:wght@300;400;500;600&family=IBM+Plex+Mono:wght@400;500&family=Nanum+Brush+Script&display=swap">
<link rel="stylesheet" href="styles.css">
<link rel="stylesheet" href="index.css">
</head>
```

### 0-2. `<head>` — pages/*.html

위와 같고 경로만 다르다. `<title>` 은 `<도면명> — 가선 시트룸`.

```html
<link rel="stylesheet" href="../styles.css">
<link rel="stylesheet" href="dashboard.css"> <!-- 페이지 이름.css -->
```

### 0-3. `<body>` 끝

```html
<script src="app.js"></script>        <!-- index -->
<script src="../app.js"></script>     <!-- pages -->
```

- 인라인 테마 스크립트는 **반드시** `<head>` 안, CSS보다 앞에 둔다(FOUC 방지, 우선순위 `?theme=` → localStorage → 시스템). `:root.js` 도 이 스크립트가 붙인다(`[data-draw]` 그리기 전 숨김에 쓰인다).
- 토스트 영역은 app.js 가 자동으로 만든다. 따로 넣지 않는다.

### 0-4. 화면 목록 (시트 번호 · 셸)

| 파일 | 시트 번호 | 도면명(표제란·title) | 셸 |
|---|---|---|---|
| `index.html` | `G-000` | 작성 기준 표지 | 사이트 셸(사이드바 없음) |
| `pages/dashboard.html` | `SR-101` | 발행 현황판 | **앱 셸**(사이드바) |
| `pages/inbox.html` | `SR-102` | 설계질의함 | **앱 셸** |
| `pages/kanban.html` | `SR-103` | 도면 작업 보드 | **앱 셸** |
| `pages/onboarding.html` | `SR-104` | 프로젝트 개설 | 사이트 셸 |
| `pages/pricing.html` | `SR-105` | 설계 용역 요율 | 사이트 셸 |
| `pages/product.html` | `SR-106` | 한칸 HK-3624 | 사이트 셸 |
| `pages/profile.html` | `SR-107` | 건축사 프로필 | **앱 셸** |
| `pages/settings.html` | `SR-108` | 시트 설정 | **앱 셸** |
| `pages/404.html` | `SR-404` (표제란 외곽선 번호는 `A-999`) | 시트 누락 | 사이트 셸 |

---

## 1. 레이아웃 문법 (base.css) — 「시트 · 통심선 · 표제란」

화면의 독립 단위는 **시트**다. 카드 그리드·가운데 섹션 헤더 대신 시트 안에 **도면(view)** 을 배치하고, 도면명은 **아래 왼쪽**에 단다.

### 1-1. 시트 프레임 + 통심선

```html
<section class="sheet" data-frame-draw aria-labelledby="g001-title">
  <div class="sheet__frame" data-grid="6">           <!-- data-grid=베이 수 → 통심선 X1…X7 (모바일 X1–X4) -->
    <div class="l-grid">
      <div class="view c-8"> … <div class="vtitle">…</div></div>
      <div class="view c-4"> … </div>
    </div>
  </div>
</section>
```

- 구역 띠(위·아래 1–8, 왼쪽·오른쪽 A–F)와 중심 표시 삼각형은 app.js 가 `.sheet` 마다 넣는다. 끄려면 `.sheet[data-no-zones]`.
- `data-grid` 가 없으면 통심선 없이 위 패딩 24px. 위쪽 가장자리 기호는 **항상 X**(가로 축)다. `data-grid-prefix` 로 Y 를 위쪽에 다는 것은 도면 문법 오류이니 쓰지 않는다(Y 는 세로 경계 쪽 기호).
- `data-frame-draw`: 처음 보일 때 프레임이 위 → 오른쪽 → 아래 → 왼쪽으로 그려지고 내용이 나타난다.
- `.sheet--flush` 프레임 패딩 0(표제란 세로 띠를 붙일 때), `.sheet--plain` 위 패딩 24px.
- 12단 그리드: `.l-grid` + `.c-2 … .c-12`. 1279 이하 `.c-lg-4/6/8/12`, 959 이하는 전부 한 줄(`.c-md-6` 만 반 폭 유지, 599 이하 한 줄). 인라인 `grid-template-columns` 금지.
- 흐름 프리미티브: `.l-stack`(+`--2/3/5/6/7`), `.l-row`(+`--tight/--between/--end/--top/--base`), `.l-push`.

### 1-2. 시트 사이 간격 = 실제 세로 치수 (치수 레이어)

```html
<div class="sheet-gap" aria-hidden="true"><span class="dim dim--v"><span class="dim__value">96</span></span></div>
```
모바일에서는 간격이 48로 줄어든다. 값도 `48`로 바꾸려면 `<span class="dim__value"><span class="hide-sm">96</span><span class="show-sm">48</span></span>`.

### 1-3. 도면명 「아래 왼쪽」 — 이 테마의 유일한 섹션 헤더

```html
<div class="vtitle">
  <span class="callout"><span class="callout__no">1</span><span class="callout__sheet">G-001</span></span>
  <div class="vtitle__rule">
    <h2 class="vtitle__name" id="g001-title">선 · 레이어</h2>
    <span class="vtitle__scale">S=1:1</span>
  </div>
  <p class="vtitle__note">CAD 레이어 9종 = 색 토큰</p>   <!-- 선택 -->
</div>
```
- `.view` 는 flex 세로이고 `.vtitle` 은 `margin-top:auto` 로 도면 아래에 붙는다. **위 가운데 제목, eyebrow 라벨, § 번호 금지.**
- 작은 도면: `.vtitle__name--sm`(20px), 작은 콜아웃 `.callout--sm`, 레드라인 콜아웃 `.callout--red`.

### 1-4. 표제란 (index 표지 세로형 / 장면 페이지)

세로형(≥1280 폭 280, 1279 이하 2칸 가로로 내려온다). 칸 순서 고정: 발주처 / 프로젝트 / 도면명 / 축척·단위 / 작성·검토·승인 / 리비전 표 / 발행일 / 시트 번호.

```html
<div class="sheet sheet--flush">
  <div class="sheet__frame">
    <div class="cover">                       <!-- 장면 CSS: grid-template-columns: minmax(0,1fr) var(--titleblock-w) (≥1280) -->
      <div class="view"> … 도면 … </div>
      <aside class="tb tb--v" aria-label="표제란">
        <div class="tb__cell"><span class="tb__label">발주처</span><span class="tb__value">가선건축사사무소</span></div>
        <div class="tb__cell"><span class="tb__label">프로젝트</span><span class="tb__value">GSA-STD-2026</span><span class="tb__sub">도면·화면 작성 기준 제2판</span></div>
        <div class="tb__cell tb__cell--wide"><span class="tb__label">도면명</span><span class="tb__value tb__value--lg">작성 기준 표지</span></div>
        <div class="tb__cell"><span class="tb__label">축척 · 단위</span><span class="tb__value"><span class="mono">NONE</span> · <span class="mono">mm</span></span></div>
        <div class="tb__cell"><span class="tb__label">작성 · 검토 · 승인</span>
          <dl class="tb__sign"><dt>작성</dt><dd>문서연</dd><dt>검토</dt><dd>오태경</dd><dt>승인</dt><dd>한지선</dd></dl></div>
        <div class="tb__cell tb__cell--wide"><span class="tb__label">리비전</span>
          <table class="tb__revs"><thead><tr><th scope="col">REV</th><th scope="col">날짜</th><th scope="col">내용</th></tr></thead>
            <tbody><tr><td>1</td><td class="mono">2024.03.04</td><td>제1판</td></tr><tr><td>2</td><td class="mono">2026.10.15</td><td>제2판</td></tr></tbody></table></div>
        <div class="tb__cell"><span class="tb__label">발행</span><span class="tb__value"><span class="mono">2026.10.15</span> (목)</span></div>
        <div class="tb__cell tb__cell--wide"><span class="tb__label">도면 목록</span>
          <nav class="tb__list" aria-label="도면 목록">
            <a href="#g001"><span class="mono">G-001</span>선 · 레이어</a>
            <a href="pages/dashboard.html"><span class="mono">SR-101</span>발행 현황판</a>
          </nav></div>
        <div class="tb__cell tb__cell--no"><span class="tb__label label">DWG NO.</span><span class="sheetno">G-000</span></div>
      </aside>
    </div>
  </div>
</div>
```
- `.sheetno` 는 외곽선 거대 숫자(160 / 모바일 88, 72px 미만 금지). 푸터용 `.sheetno--md`(88 / 모바일 72).
- `DWG NO.` 같은 라틴 라벨만 `.label`(대문자 자간). 한글 라벨은 `.tb__label`(자간 0).

### 1-5. 시그니처 ① 치수선 — 실제 값만

```html
<span class="dim"><span class="dim__value">4,200</span></span>                       <!-- 가로, 대상 위에 둔다 -->
<span class="dim dim--under"><span class="dim__value">44</span></span>              <!-- 대상 아래 -->
<span class="dim dim--v" style="height:44px"><span class="dim__value">44</span></span><!-- 세로(높이는 대상에 맞춘다) -->
<div class="dimchain">                                                               <!-- 치수 체인: --f 는 실제 값 비례 -->
  <span class="dim" style="--f:4200"><span class="dim__value">4,200</span></span>
  <span class="dim" style="--f:5400"><span class="dim__value">5,400</span></span>
  <span class="dim" style="--f:4200"><span class="dim__value">4,200</span></span>
</div>
```
- 변형: `.dim--ink`(잉크색) `.dim--red`(레드라인) `.dim--long`(보조선 24px) `.dim--keep`(치수 레이어를 꺼도 남김 — 진행률·칸반 WIP 등 정보 치수).
- 색은 전부 `currentColor`. 404 의 `?,???` 외에는 가짜 숫자 금지.
- 처음 보일 때 가운데에서 양쪽으로 자란다(app.js).
- `--f` 인라인 스타일은 grid-template 이 아니므로 허용한다(값 비례). 인라인 `style="height:…"` 도 치수 대상 크기 맞춤에만 쓴다.

### 1-6. 시그니처 ② 레드라인 구름 + △ + 손글씨 — 조치가 필요한 곳에만, 한 뷰포트 최대 2개

```html
<div class="cloud">                      <!-- 대상 바깥 10px 에 구름. --tight 4 / --loose 16 / --inset -10 -->
  …대상…
  <span class="rev rev--pin">C</span>    <!-- 구름 오른쪽 위 △ -->
</div>
<p class="hand">창대 <span class="mono">900 → 750</span> 아이들 눈높이 — 한</p>
```
- 성공·정보에는 쓰지 않는다. 성공 = `.badge.badge--stamp.badge--ok` 실선 도장.
- 위치를 따로 잡아야 할 때(SVG 위 등): 빈 요소 `<span class="cloud-ring" style="…위치…"></span>` 를 절대 배치(장면 CSS에서 위치 지정).
- △ 변형: `.rev`(레드라인 외곽), `.rev--ink`(지난 리비전), `.rev--planned`(파선, 예정), `.rev--solid`(빨간 면), `.rev--ok`, `.rev--lg`.
- 손글씨는 22px 이상, 숫자는 `.mono` 로 섞는다. 서명 문자는 `— 한`(한지선) · `— 오`(오태경).

### 1-7. 보조 기호

```html
<span class="bubble">X1</span>  <span class="bubble bubble--ko">가</span>  <span class="bubble bubble--lg">Y2</span>   <!-- 원형 그리드 기호 -->
<span class="level">+0</span>  <span class="level level--line">z 60 모달</span>                                       <!-- 레벨 ▽ -->
<div class="hatch" style="height:24px"></div>   <!-- 45° 해치 면: .hatch / .hatch--soft / .hatch--red -->
<span class="sym sym--ok"></span> <span class="sym sym--warn"></span> <span class="sym sym--red"></span> <span class="sym sym--ink"></span>
<span class="leader" style="--len:40px; --angle:-45deg"></span>   <!-- 지시선 -->
<div class="north" aria-label="방위표 — 북쪽 위">
  <svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="17" fill="none" stroke="currentColor" stroke-width="1"/><path d="M20 4 26 28 20 23 14 28Z" fill="currentColor"/></svg>
  <span class="label">NORTH</span></div>
<div class="scalebar" aria-label="축척 바 1:100, 0에서 4m">
  <div class="scalebar__bar"><span></span><span></span><span></span><span></span></div>
  <div class="scalebar__ticks"><span>0</span><span>2</span><span>4m</span></div></div>
```

### 1-8. 도면 SVG — 플로터 그리기 · 십자선 좌표 판독

```html
<div class="plan" data-crosshair>                                   <!-- 십자선: index 표지 · 404 한정 -->
  <svg data-draw data-plan data-plan-origin="0 10420" viewBox="-1600 -1800 17000 14000"
       role="img" aria-label="누하동 작은도서관 1층 평면도, 13,800 × 10,420">
    <g data-plot="1" fill="none" stroke="currentColor" stroke-width="18" opacity=".55">  <!-- 1 통심선 -->
      <path d="M0 -1200V11600M4200 -1200V11600M9600 -1200V11600M13800 -1200V11600" stroke-dasharray="600 150 100 150"/></g>
    <g data-plot="2" fill="none" stroke="currentColor" stroke-width="60"><rect width="13800" height="10420"/></g>  <!-- 2 벽 -->
    <g data-plot="3" …>문·창</g>  <g data-plot="4" …>치수</g>  <g data-plot="5" …>글자</g>  <g data-plot="6" …>레드라인</g>
  </svg>
</div>
```
- SVG 좌표는 **mm**. 선 굵기는 `vector-effect="non-scaling-stroke"` + `stroke-width="1"`(또는 `1.5`, `2`) 를 권장한다.
- 색은 `currentColor` 또는 `style="stroke:var(--redline)"`. **presentation attribute 에 `var()` 금지.**
- app.js 가 실선에 `pathLength="1"` 을 붙여 순서대로 긋고, 파선(`stroke-dasharray` 있음)·글자·면은 잉크가 번지듯 나타난다.
- `data-plan-origin="x y"` 를 주면 판독 Y가 위로 증가한다(평면도 원점 X1·Y1 교점). 판독 문구: `X 4,812 · Y 2,040`.
- 다시 그리기 버튼: `<button class="btn btn--secondary btn--sm" type="button" data-redraw="svg-id">다시 그리기</button>`.

---

## 2. 토큰 (semantic.css) — 장면 CSS 는 이것만 쓴다

| 무엇 | 토큰 |
|---|---|
| 면 | `--paper`(책상) `--paper-sheet`(시트 안) `--paper-sunk`(표 머리·입력·표제란 라벨) `--select`(선택 행) `--scrim` |
| 글자·선 | `--ink` `--ink-2` `--ink-3`(오목 면 위 금지) `--on-ink` `--line-control`(입력 경계) `--line-mid`(구획) `--line-center`(통심선) `--line-fine`(헤어라인) |
| 상태 | `--redline` `--redline-tint` `--on-redline` `--ok` `--warn` `--focus` |
| 해치 | `--hatch-fill` `--hatch-fill-soft` `--hatch-fill-red` `--hatch-fill-fine` |
| 선 묶음 | `--rule` `--rule-fine` `--rule-ink` `--rule-bold` `--rule-control` `--rule-dashed` |
| 서체 | `--type-display` `--type-body` `--type-label`(라틴 전용) `--type-mono`(숫자 전용) `--type-hand` |
| 크기 | `--fs-sheetno 160/88` `--fs-display 64/36` `--fs-h1 44/30` `--fs-h2 28/22` `--fs-h3 20/18` `--fs-body 15` `--fs-small 13` `--fs-label 11` `--fs-dim 12/11` `--fs-hand 26/22` |
| 간격 | `--space-1…10` = 4 8 12 16 24 32 48 64 96 128 · `--gap-sheet 96/48` `--pad-view 24/16` `--margin-sheet 24/12` |
| 치수 | `--touch 44` `--touch-dense 36` `--nav-h 56` `--sidebar-w 248` `--titleblock-w 280` `--sheet-max 1392` `--bubble 28` `--callout 44` |
| 겹 | `--z-sticky 10` `--z-nav 30` `--z-drawer 40` `--z-modal 60` `--z-command 70` `--z-toast 80` `--z-tip 90` `--z-cursor 100` |
| 모션 | `--ease-plot` `--ease-step` `--dur-tick 120` `--dur-base 240` `--dur-sheet 260` `--dur-frame 320` `--dur-draw 700` `--stagger 50` |

서체 규칙: 한글이 섞이면 `--type-body`(IBM Plex Sans KR), 자간 0. 큰 장면 제목은 `.t-h1`(KR 300). 라틴 대문자 라벨 `.label` 은 한 화면 5개 이하(`REV` `SCALE` `SHEET` `NORTH` `DWG NO.`). 숫자·ID·치수·시각·금액 숫자는 `.mono`(한글 금지, 줄바꿈 안 함). 한글 13px 미만 금지. 문자 역할 클래스: `.t-display .t-h1 .t-h2 .t-h3 .t-body .t-small .t-2 .t-3 .t-red .t-ok .t-warn .klabel`.

radius 0(원만 50%), 그림자 없음, 깊이는 선 굵기 1 → 2 → 3px. 그라디언트·흐린 얼룩·모눈 배경 금지.

---

## 3. 공통 셸 — **복사해서 쓰는 스니펫** (페이지마다 바꾸는 값은 ⟨ ⟩ 표시만)

### 3-1a. navbar — index.html

```html
<a class="skip-link" href="#main">본문 바로가기</a>
<header class="nav">
  <div class="nav__inner">
    <a class="nav__brand" href="index.html" aria-label="가선 시트룸 — 작성 기준 표지">
      <span class="bubble bubble--ko" aria-hidden="true">가</span>
      <span class="nav__name">가선 시트룸</span>
      <span class="nav__latin label">SHEETROOM</span>
    </a>
    <div class="nav__set">
      <span class="nav__set-no">NH-2604</span>
      <span class="nav__set-name">누하동 작은도서관</span>
      <span class="badge badge--rev">REV.C 발행 D-1</span>
    </div>
    <div class="nav__tools">
      <button class="nav__find nav__wide" type="button" data-open="command" aria-haspopup="dialog" aria-controls="command">
        <svg class="icon icon--sm" viewBox="0 0 18 18" aria-hidden="true"><circle cx="8" cy="8" r="5" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M12 12l4 4" stroke="currentColor" stroke-width="1.5"/></svg>
        시트 찾기 <span class="kbd">⌘K</span>
      </button>
      <span class="nav__sep nav__wide" aria-hidden="true"></span>
      <button class="nav__icon nav__wide" type="button" data-layer-toggle="grid" aria-pressed="true" aria-label="통심선 레이어" data-tip="통심선 레이어 켜기·끄기">
        <svg class="icon" viewBox="0 0 18 18" aria-hidden="true"><circle cx="5" cy="3.5" r="2.5" fill="none" stroke="currentColor" stroke-width="1.2"/><circle cx="13" cy="3.5" r="2.5" fill="none" stroke="currentColor" stroke-width="1.2"/><path d="M5 6v11M13 6v11" fill="none" stroke="currentColor" stroke-width="1.2" stroke-dasharray="4 1.5 1 1.5"/></svg>
      </button>
      <button class="nav__icon nav__wide" type="button" data-layer-toggle="dims" aria-pressed="true" aria-label="치수 레이어" data-tip="치수 레이어 켜기·끄기">
        <svg class="icon" viewBox="0 0 18 18" aria-hidden="true"><path d="M2 9h14M2 5.5v7M16 5.5v7M3 11l2-4M13 11l2-4" fill="none" stroke="currentColor" stroke-width="1.2"/></svg>
      </button>
      <button class="theme-toggle nav__wide" type="button" data-theme-toggle aria-pressed="false" aria-label="낮 장면 — 밤 장면으로 전환">
        <span class="theme-toggle__day">낮</span><span class="theme-toggle__night">밤</span>
      </button>
      <div class="menu nav__wide">
        <button class="nav__user" type="button" data-menu-trigger aria-haspopup="menu" aria-expanded="false" aria-controls="user-menu" aria-label="오태경 계정 메뉴">
          <span class="avatar" aria-hidden="true">오</span>
        </button>
        <div class="menu__panel menu__panel--end" id="user-menu" role="menu" hidden>
          <p class="menu__label">오태경 · 실장 · 검토 권한</p>
          <a class="menu__item" role="menuitem" href="pages/profile.html"><span></span><span>건축사 프로필</span><span class="menu__key">SR-107</span></a>
          <a class="menu__item" role="menuitem" href="pages/settings.html"><span></span><span>시트 설정</span><span class="menu__key">SR-108</span></a>
          <a class="menu__item" role="menuitem" href="pages/dashboard.html"><span></span><span>발행 현황판</span><span class="menu__key">SR-101</span></a>
        </div>
      </div>
      <button class="nav__icon nav__narrow" type="button" data-open="command" aria-haspopup="dialog" aria-controls="command" aria-label="시트 찾기">
        <svg class="icon" viewBox="0 0 18 18" aria-hidden="true"><circle cx="8" cy="8" r="5" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M12 12l4 4" stroke="currentColor" stroke-width="1.5"/></svg>
      </button>
      <button class="nav__icon nav__narrow" type="button" data-open="nav-drawer" aria-haspopup="dialog" aria-controls="nav-drawer" aria-label="메뉴 열기">
        <svg class="icon" viewBox="0 0 18 18" aria-hidden="true"><path d="M3 5h12M3 9h12M3 13h12" stroke="currentColor" stroke-width="1.5"/></svg>
      </button>
    </div>
  </div>
</header>
```

**외부 화면용 변형(pricing · product · onboarding).** 사내 진행 세트(`NH-2604 … REV.C 발행 D-1`)는 외부 고객에게 보이지 않는다. 위 스니펫에서 `.nav__set` 한 블록만 아래 값으로 바꾼다. 나머지 셸은 그대로다.

```html
<!-- pricing -->
<div class="nav__set nav__set--ext">
  <span class="nav__set-no">SR-105</span>
  <span class="nav__set-name">설계 용역 요율</span>
  <span class="badge badge--ink">VAT 별도</span>
</div>
<!-- product -->
<div class="nav__set nav__set--ext">
  <span class="nav__set-no">HK-3624</span>
  <span class="nav__set-name">한칸 목조 모듈</span>
  <span class="badge badge--ink">10월 제작 슬롯 <span class="mono">2/6</span></span>
</div>
<!-- onboarding -->
<div class="nav__set nav__set--ext">
  <span class="nav__set-no">YH-2607</span>
  <span class="nav__set-name">연희동 단독주택</span>
  <span class="badge badge--ink">개설 중</span>
</div>
```

### 3-1b. navbar — pages/*.html

3-1a 와 **같은 마크업**에서 링크 경로만 바꾼다:

```html
<a class="nav__brand" href="../index.html" aria-label="가선 시트룸 — 작성 기준 표지">
…
          <a class="menu__item" role="menuitem" href="profile.html"><span></span><span>건축사 프로필</span><span class="menu__key">SR-107</span></a>
          <a class="menu__item" role="menuitem" href="settings.html"><span></span><span>시트 설정</span><span class="menu__key">SR-108</span></a>
          <a class="menu__item" role="menuitem" href="dashboard.html"><span></span><span>발행 현황판</span><span class="menu__key">SR-101</span></a>
```
(나머지 줄은 한 글자도 바꾸지 않는다. 600 미만에서는 `.nav__wide` 가 숨고 `.nav__narrow` 두 버튼이 보인다.)

### 3-2. 모바일 메뉴 서랍 `#nav-drawer` — `</footer>` 뒤, 모든 페이지

index 판(pages 판은 아래 표의 경로로 바꾼다: `index.html`→`../index.html`, `pages/x.html`→`x.html`). 현재 페이지 링크에 `aria-current="page"`.

```html
<div class="drawer" id="nav-drawer" hidden>
  <div class="drawer__scrim"></div>
  <div class="drawer__panel" role="dialog" aria-modal="true" aria-labelledby="nav-drawer-title">
    <span class="drawer__grip" aria-hidden="true"></span>
    <div class="drawer__head">
      <div><h2 class="drawer__title" id="nav-drawer-title">도면 목록</h2><p class="drawer__sub"><span class="mono">NH-2604</span> 누하동 작은도서관 · REV.C 발행 D-1</p></div>
      <button class="btn btn--ghost btn--icon" type="button" data-close aria-label="메뉴 닫기"><svg class="icon" viewBox="0 0 18 18" aria-hidden="true"><path d="M4 4l10 10M14 4 4 14" stroke="currentColor" stroke-width="1.5"/></svg></button>
    </div>
    <div class="drawer__body">
      <section class="drawer__section">
        <h3 class="drawer__section-title">보기</h3>
        <label class="switch"><input class="switch__input" type="checkbox" checked data-layer-toggle="grid"><span class="switch__track" aria-hidden="true"><span class="switch__off">OFF</span><span class="switch__on">ON</span></span><span class="switch__label">통심선 레이어</span></label>
        <label class="switch"><input class="switch__input" type="checkbox" checked data-layer-toggle="dims"><span class="switch__track" aria-hidden="true"><span class="switch__off">OFF</span><span class="switch__on">ON</span></span><span class="switch__label">치수 레이어</span></label>
        <button class="theme-toggle" type="button" data-theme-toggle aria-pressed="false" aria-label="낮 장면 — 밤 장면으로 전환"><span class="theme-toggle__day">낮</span><span class="theme-toggle__night">밤</span></button>
      </section>
      <section class="drawer__section">
        <h3 class="drawer__section-title">도면 목록</h3>
        <nav class="nav-sheetlist" aria-label="도면 목록">
          <a href="index.html"><span class="mono">G-000</span>작성 기준 표지</a>
          <a href="pages/dashboard.html"><span class="mono">SR-101</span>발행 현황판</a>
          <a href="pages/inbox.html"><span class="mono">SR-102</span>설계질의함</a>
          <a href="pages/kanban.html"><span class="mono">SR-103</span>도면 작업 보드</a>
          <a href="pages/onboarding.html"><span class="mono">SR-104</span>프로젝트 개설</a>
          <a href="pages/pricing.html"><span class="mono">SR-105</span>설계 용역 요율</a>
          <a href="pages/product.html"><span class="mono">SR-106</span>한칸 HK-3624</a>
          <a href="pages/profile.html"><span class="mono">SR-107</span>건축사 프로필</a>
          <a href="pages/settings.html"><span class="mono">SR-108</span>시트 설정</a>
          <a href="pages/404.html"><span class="mono">SR-404</span>시트 누락</a>
        </nav>
      </section>
      <section class="drawer__section">
        <h3 class="drawer__section-title">로그인</h3>
        <p class="l-row l-row--tight"><span class="avatar" aria-hidden="true">오</span>오태경 · 실장 · 검토 권한</p>
      </section>
    </div>
  </div>
</div>
```

### 3-3. 앱 셸 — 사이드바 「도면 세트 탐색기」 + 본문 (dashboard · inbox · kanban · profile · settings)

```html
<div class="app">
  <!-- 3-1b navbar -->
  <div class="app__body">
    <aside class="side" id="side" aria-label="도면 세트 탐색기">
      <button class="btn btn--ghost btn--icon side__close" type="button" data-close aria-label="도면 세트 닫기"><svg class="icon" viewBox="0 0 18 18" aria-hidden="true"><path d="M4 4l10 10M14 4 4 14" stroke="currentColor" stroke-width="1.5"/></svg></button>
      <div class="side__head">
        <p class="side__set"><span class="side__set-no">NH-2604</span><span class="side__set-name">누하동 작은도서관</span></p>
        <p class="side__meta">도면 <span class="mono">64</span>장 · 발행 준비 <span class="mono">47</span> · 검토 중 <span class="mono">11</span> · 수정 중 <span class="mono">6</span></p>
      </div>
      <nav class="side__nav" aria-label="시트룸 화면">
        <div class="side__section">
          <p class="side__label">화면</p>
          <a class="side__link" href="dashboard.html"⟨ aria-current="page"⟩><span class="side__no">101</span><span>발행 현황판</span><span></span></a>
          <a class="side__link" href="inbox.html"><span class="side__no">102</span><span>설계질의함</span><span class="count count--red" aria-label="미결 9건">9</span></a>
          <a class="side__link" href="kanban.html"><span class="side__no">103</span><span>도면 작업 보드</span><span></span></a>
          <a class="side__link" href="profile.html"><span class="side__no">107</span><span>건축사 프로필</span><span></span></a>
          <a class="side__link" href="settings.html"><span class="side__no">108</span><span>시트 설정</span><span></span></a>
        </div>
        <div class="side__section">
          <p class="side__label">도면 세트</p>
          <button class="side__group-btn" type="button" aria-expanded="true" aria-controls="side-a"><span class="side__caret" aria-hidden="true"></span><span>건축 <span class="side__disc">A</span></span><span class="side__count"><b>29</b>/38</span></button>
          <div class="side__sheets" id="side-a">
            <a class="side__sheet" href="kanban.html"><span class="side__no">A-101</span><span class="side__name" title="지하1층 평면도">지하1층 평면도</span><span></span></a>
            <a class="side__sheet side__sheet--red" href="kanban.html"><span class="side__no">A-102</span><span class="side__name" title="1층 평면도">1층 평면도</span><span class="side__state side__state--red" role="img" aria-label="수정 중">▲</span></a>
            <a class="side__sheet" href="kanban.html"><span class="side__no">A-103</span><span class="side__name" title="2층 평면도">2층 평면도</span><span class="side__state side__state--warn" role="img" aria-label="검토 중">○</span></a>
            <a class="side__sheet side__sheet--red" href="kanban.html"><span class="side__no">A-501</span><span class="side__name" title="계단 C 상세도">계단 C 상세도</span><span class="side__state side__state--red" role="img" aria-label="수정 중">▲</span></a>
            <a class="side__sheet side__sheet--red" href="kanban.html"><span class="side__no">A-502</span><span class="side__name" title="열람실 창호 상세도">열람실 창호 상세도</span><span class="side__state side__state--red" role="img" aria-label="수정 중">▲</span></a>
          </div>
          <button class="side__group-btn" type="button" aria-expanded="false" aria-controls="side-s"><span class="side__caret" aria-hidden="true"></span><span>구조 <span class="side__disc">S</span></span><span class="side__count"><b>9</b>/12</span></button>
          <div class="side__sheets" id="side-s" hidden>
            <a class="side__sheet" href="kanban.html"><span class="side__no">S-201</span><span class="side__name" title="기초 구조평면도">기초 구조평면도</span><span class="side__state side__state--ok" role="img" aria-label="발행 준비">■</span></a>
            <a class="side__sheet side__sheet--red" href="kanban.html"><span class="side__no">S-301</span><span class="side__name" title="2층 바닥 구조평면도">2층 바닥 구조평면도</span><span class="side__state side__state--red" role="img" aria-label="수정 중">▲</span></a>
          </div>
          <button class="side__group-btn" type="button" aria-expanded="false" aria-controls="side-m"><span class="side__caret" aria-hidden="true"></span><span>기계 <span class="side__disc">M</span></span><span class="side__count"><b>5</b>/8</span></button>
          <div class="side__sheets" id="side-m" hidden>
            <a class="side__sheet" href="kanban.html"><span class="side__no">M-101</span><span class="side__name" title="급배수 위생 평면도">급배수 위생 평면도</span><span class="side__state side__state--warn" role="img" aria-label="검토 중">○</span></a>
          </div>
          <button class="side__group-btn" type="button" aria-expanded="false" aria-controls="side-e"><span class="side__caret" aria-hidden="true"></span><span>전기 <span class="side__disc">E</span></span><span class="side__count"><b>4</b>/6</span></button>
          <div class="side__sheets" id="side-e" hidden>
            <a class="side__sheet" href="kanban.html"><span class="side__no">E-101</span><span class="side__name" title="전등 평면도">전등 평면도</span><span class="side__state side__state--ok" role="img" aria-label="발행 준비">■</span></a>
          </div>
        </div>
      </nav>
      <div class="side__foot">
        <div class="meter"><span class="meter__key">A</span><span class="meter__bar" style="--v:76%"><span></span></span><span class="meter__val"><b>29</b>/38</span></div>
        <div class="meter"><span class="meter__key">S</span><span class="meter__bar" style="--v:75%"><span></span></span><span class="meter__val"><b>9</b>/12</span></div>
        <div class="meter"><span class="meter__key">M</span><span class="meter__bar" style="--v:62.5%"><span></span></span><span class="meter__val"><b>5</b>/8</span></div>
        <div class="meter"><span class="meter__key">E</span><span class="meter__bar" style="--v:66.7%"><span></span></span><span class="meter__val"><b>4</b>/6</span></div>
      </div>
    </aside>
    <div class="side-scrim" aria-hidden="true"></div>

    <main class="app__main" id="main">
      <div class="l-row l-row--between page-head">
        <nav class="crumbs" aria-label="도면 경로"><ol class="crumbs__list">
          <li class="crumbs__item"><a class="crumbs__link mono" href="dashboard.html">NH-2604</a></li>
          <li class="crumbs__item"><span class="crumbs__current" aria-current="page">⟨발행 현황판⟩</span></li>
        </ol></nav>
        <button class="btn btn--secondary btn--sm only-narrow" type="button" data-side-toggle="side" aria-controls="side" aria-expanded="false">도면 세트</button>
      </div>
      <!-- 시트들 -->
    </main>
  </div>
  <!-- 3-5 footer -->
</div>
```
- 960 미만에서 사이드바는 왼쪽 서랍이 된다(`[data-side-toggle]` 이 열고, Esc·바깥 누름·`data-close` 가 닫는다). 다른 마크업은 필요 없다.
- `.side-scrim` 은 반드시 `.side` 바로 다음 형제로 둔다.

### 3-4. 사이트 셸 — onboarding · pricing · product · 404 (사이드바 없음), index 도 같다

```html
<div class="app">
  <!-- 3-1a(index) / 3-1b(pages) navbar -->
  <main class="page-main" id="main">
    <!-- 시트들 (.sheet + .sheet-gap) -->
  </main>
  <!-- 3-5 footer -->
</div>
```

### 3-5. footer 「표제란」 — 모든 페이지 같은 마크업. 바뀌는 값은 ⟨발주처⟩ · ⟨프로젝트⟩ · ⟨도면명⟩ · ⟨시트 번호⟩ · `aria-current`

**표제란의 발주처·프로젝트 칸은 그 화면이 다루는 일에 따라 정해진다(같은 페이지 안의 다른 표제란과 모순되면 안 된다).**

| 화면 | 발주처 칸 | 프로젝트 칸 |
|---|---|---|
| index (`G-000`) | `발주처` 가선건축사사무소 | `<span class="mono">GSA-STD-2026</span> 도면·화면 작성 기준 제2판` |
| dashboard · inbox · kanban · profile · settings · 404 | `발주처` 종로구 | `<span class="mono">NH-2604</span> 누하동 작은도서관 신축공사` |
| pricing (`SR-105`) | `발주처` 가선건축사사무소 | `설계 용역 요율 · 단독주택 · 근린생활시설` |
| product (`SR-106`) | `발주처` 가선건축사사무소 | `한칸 <span class="mono">HK-3624</span> 목조 모듈 서재` |
| onboarding (`SR-104`) | `개설` 정유나 (라벨도 바꾼다) | `<span class="mono">YH-2607</span> 연희동 단독주택` |

- 600 미만에서 가로형 표제란은 2칸 그리드(`gap: 0`)가 된다. 칸 사이 선은 **짝수 칸 왼쪽 · 3번째 칸부터 위** 한 방향씩만 긋고, `DWG NO.` 칸은 전체 폭 + 굵은 위 선이다(base.css). 칸을 더하거나 빼지 말 것 — 7칸 순서가 바뀌면 선 규칙이 어긋난다.
- 시트 본문에 자체 표제란이 있는 화면(404)은 600 미만에서 본문 표제란을 도면명 · 리비전 · 시트 번호 3칸으로 줄이고, 도면 목록은 footer 에만 둔다.

pages 판:

```html
<footer class="site-foot">
  <div class="site-foot__inner">
    <div class="tb tb--h" role="group" aria-label="표제란">
      <!-- 발주처·프로젝트 칸은 위 표대로(앱 화면 5개 · 404 = 종로구 / NH-2604) -->
      <div class="tb__cell"><span class="tb__label">⟨발주처⟩</span><span class="tb__value">⟨종로구⟩</span></div>
      <div class="tb__cell"><span class="tb__label">프로젝트</span><span class="tb__value">⟨<span class="mono">NH-2604</span> 누하동 작은도서관 신축공사⟩</span></div>
      <div class="tb__cell"><span class="tb__label">도면명</span><span class="tb__value">⟨발행 현황판⟩</span></div>
      <div class="tb__cell"><span class="tb__label">축척 · 단위</span><span class="tb__value"><span class="mono">NONE</span> · <span class="mono">mm</span></span></div>
      <div class="tb__cell"><span class="tb__label">작성 · 검토 · 승인</span><dl class="tb__sign"><dt>작성</dt><dd>문서연</dd><dt>검토</dt><dd>오태경</dd><dt>승인</dt><dd>한지선</dd></dl></div>
      <div class="tb__cell"><span class="tb__label">발행</span><span class="tb__value mono">2026.10.15</span></div>
      <div class="tb__cell tb__cell--no"><span class="tb__label label">DWG NO.</span><span class="sheetno sheetno--md">⟨SR-101⟩</span></div>
    </div>
    <div class="site-foot__bottom">
      <p class="site-foot__addr">가선건축사사무소 · 서울 종로구 자하문로7길 23, 2층 · <span class="mono">02-736-4120</span><br><span class="mono">studio@gaseon.kr</span> · 평일 <span class="mono">09:30–18:30</span></p>
      <nav aria-label="도면 목록"><ul class="site-foot__list">
        <li><a href="../index.html"><span class="mono">G-000</span>작성 기준 표지</a></li>
        <li><a href="dashboard.html"><span class="mono">SR-101</span>발행 현황판</a></li>
        <li><a href="inbox.html"><span class="mono">SR-102</span>설계질의함</a></li>
        <li><a href="kanban.html"><span class="mono">SR-103</span>도면 작업 보드</a></li>
        <li><a href="onboarding.html"><span class="mono">SR-104</span>프로젝트 개설</a></li>
        <li><a href="pricing.html"><span class="mono">SR-105</span>설계 용역 요율</a></li>
        <li><a href="product.html"><span class="mono">SR-106</span>한칸 HK-3624</a></li>
        <li><a href="profile.html"><span class="mono">SR-107</span>건축사 프로필</a></li>
        <li><a href="settings.html"><span class="mono">SR-108</span>시트 설정</a></li>
        <li><a href="404.html"><span class="mono">SR-404</span>시트 누락</a></li>
      </ul></nav>
    </div>
  </div>
</footer>
```

index 판: 발주처 `가선건축사사무소`, 프로젝트 `GSA-STD-2026 도면·화면 작성 기준 제2판`, 도면명 `작성 기준 표지`, 시트 번호 `G-000`, 링크 경로 `index.html`(aria-current="page") / `pages/dashboard.html` … `pages/404.html`. 404 페이지의 푸터 시트 번호는 `SR-404`(본문 표제란의 외곽선 번호만 `A-999`).

### 3-6. 시트 찾기 ⌘K `#command` — 모든 페이지, `</footer>` 뒤

pages 판(index 판은 `../index.html`→`index.html`, `x.html`→`pages/x.html`):

```html
<div class="command" id="command" hidden>
  <div class="command__scrim"></div>
  <div class="command__panel" role="dialog" aria-modal="true" aria-label="시트 찾기">
    <div class="command__search">
      <svg class="icon" viewBox="0 0 18 18" aria-hidden="true"><circle cx="8" cy="8" r="5" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M12 12l4 4" stroke="currentColor" stroke-width="1.5"/></svg>
      <input class="command__input" type="text" role="combobox" aria-expanded="true" aria-controls="command-list" aria-autocomplete="list" placeholder="시트 번호 · 도면명 · 화면" autocomplete="off">
      <button class="btn btn--ghost btn--sm" type="button" data-close>닫기</button>
    </div>
    <div class="command__list" id="command-list" role="listbox" aria-label="찾은 항목">
      <div class="command__group" role="group" aria-label="화면">
        <p class="command__group-head" aria-hidden="true">화면</p>
        <a class="command__item" role="option" href="../index.html"><span class="command__no">G-000</span><span class="command__name">작성 기준 표지</span><span></span></a>
        <a class="command__item" role="option" href="dashboard.html"><span class="command__no">SR-101</span><span class="command__name">발행 현황판</span><span></span></a>
        <a class="command__item" role="option" href="inbox.html"><span class="command__no">SR-102</span><span class="command__name">설계질의함</span><span class="count count--red">9</span></a>
        <a class="command__item" role="option" href="kanban.html"><span class="command__no">SR-103</span><span class="command__name">도면 작업 보드</span><span></span></a>
        <a class="command__item" role="option" href="onboarding.html"><span class="command__no">SR-104</span><span class="command__name">프로젝트 개설</span><span></span></a>
        <a class="command__item" role="option" href="pricing.html"><span class="command__no">SR-105</span><span class="command__name">설계 용역 요율</span><span></span></a>
        <a class="command__item" role="option" href="product.html"><span class="command__no">SR-106</span><span class="command__name">한칸 HK-3624</span><span></span></a>
        <a class="command__item" role="option" href="profile.html"><span class="command__no">SR-107</span><span class="command__name">건축사 프로필</span><span></span></a>
        <a class="command__item" role="option" href="settings.html"><span class="command__no">SR-108</span><span class="command__name">시트 설정</span><span></span></a>
      </div>
      <div class="command__group" role="group" aria-label="REV.C 시트">
        <p class="command__group-head" aria-hidden="true">REV.C 시트</p>
        <a class="command__item" role="option" href="kanban.html" data-keywords="평면 1층"><span class="command__no">A-102</span><span class="command__name">1층 평면도</span><span class="badge badge--red">수정 중</span></a>
        <a class="command__item" role="option" href="kanban.html" data-keywords="평면 2층"><span class="command__no">A-103</span><span class="command__name">2층 평면도</span><span class="badge badge--warn">검토 중</span></a>
        <a class="command__item" role="option" href="kanban.html" data-keywords="단면"><span class="command__no">A-301</span><span class="command__name">종단면도</span><span class="badge badge--warn">검토 중</span></a>
        <a class="command__item" role="option" href="inbox.html" data-keywords="계단 난간 RFI-NH-034"><span class="command__no">A-501</span><span class="command__name">계단 C 상세도</span><span class="badge badge--red">수정 중</span></a>
        <a class="command__item" role="option" href="kanban.html" data-keywords="창대 창호 RL-NH-118"><span class="command__no">A-502</span><span class="command__name">열람실 창호 상세도</span><span class="badge badge--red">수정 중</span></a>
        <a class="command__item" role="option" href="kanban.html" data-keywords="구조 기초"><span class="command__no">S-201</span><span class="command__name">기초 구조평면도</span><span class="badge badge--ok">발행 준비</span></a>
        <a class="command__item" role="option" href="kanban.html" data-keywords="구조 보 B3"><span class="command__no">S-301</span><span class="command__name">2층 바닥 구조평면도</span><span class="badge badge--red">수정 중</span></a>
      </div>
      <div class="command__group" role="group" aria-label="설계질의">
        <p class="command__group-head" aria-hidden="true">설계질의</p>
        <a class="command__item" role="option" href="inbox.html" data-keywords="RFI 난간 장은비"><span class="command__no">RFI-034</span><span class="command__name">계단 C 난간 높이 1,100 vs 1,200</span><span class="badge badge--red">미결</span></a>
        <a class="command__item" role="option" href="inbox.html" data-keywords="RFI 도장 집성목"><span class="command__no">RFI-033</span><span class="command__name">열람실 집성목 보 노출 마감 도장 사양</span><span class="badge badge--red">미결</span></a>
      </div>
      <p class="command__empty" hidden><span class="mono">?,???</span>「<span data-command-echo></span>」 항목이 도면 목록에 없습니다.</p>
    </div>
    <div class="command__foot"><span><span class="kbd">↑</span><span class="kbd">↓</span> 이동</span><span><span class="kbd">↵</span> 열기</span><span><span class="kbd">esc</span> 닫기</span></div>
  </div>
</div>
```

### 3-7. 마감 순서 (모든 HTML)

```
<body>
  <div class="app"> navbar → (app__body | page-main) → footer </div>
  #nav-drawer → #command → (페이지 전용 modal/drawer) →
  <script src="(../)app.js"></script>
</body>
```

---

## 4. 아이콘 (인라인 SVG, `class="icon"`, `viewBox="0 0 18 18"`, `aria-hidden="true"`, 색 = currentColor)

| 이름 | 경로 |
|---|---|
| 닫기 | `<path d="M4 4l10 10M14 4 4 14" stroke="currentColor" stroke-width="1.5"/>` |
| 찾기 | `<circle cx="8" cy="8" r="5" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M12 12l4 4" stroke="currentColor" stroke-width="1.5"/>` |
| 메뉴 | `<path d="M3 5h12M3 9h12M3 13h12" stroke="currentColor" stroke-width="1.5"/>` |
| 이전 / 다음 | `<path d="M11 4 6 9l5 5" fill="none" stroke="currentColor" stroke-width="1.5"/>` / `<path d="M7 4l5 5-5 5" …/>` |
| 더 보기 | `<circle cx="4" cy="9" r="1.3" fill="currentColor"/><circle cx="9" cy="9" r="1.3" fill="currentColor"/><circle cx="14" cy="9" r="1.3" fill="currentColor"/>` |
| 열 이동 | `<path d="M3 9h12M12 6l3 3-3 3M6 6 3 9l3 3" fill="none" stroke="currentColor" stroke-width="1.4"/>` |
| 통심선 레이어 | 3-1a 참고 |
| 치수 레이어 | 3-1a 참고 |
| 복사 | `<rect x="6" y="6" width="9" height="9" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M3 12V3h9" fill="none" stroke="currentColor" stroke-width="1.4"/>` |
| 멈춤 | `<path d="M6 4v10M12 4v10" stroke="currentColor" stroke-width="1.6"/>` |
| 첨부 도면 | `<path d="M3 2h8l4 4v10H3z" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M11 2v4h4" fill="none" stroke="currentColor" stroke-width="1.4"/>` |
| 내려받기 | `<path d="M9 2v10M5 8l4 4 4-4M3 15h12" fill="none" stroke="currentColor" stroke-width="1.5"/>` |

아이콘만 있는 버튼에는 `aria-label` 필수(필요하면 `data-tip` 도). 이모지 금지.

---

## 5. 컴포넌트 32종

공통: radius 0, 그림자 없음, 기본 1px · 강조 2px, 터치 44px, focus-visible = 2px 링 + 2px 오프셋(밤에는 시안 형광펜). 한글 라벨에는 자간·모노 금지.

### accordion — 「일반 사항」 주기 목록

```html
<div class="acc" data-single>                     <!-- data-single: 하나만 펼침(선택) -->
  <div class="acc__item">
    <h3 class="acc__head"><button class="acc__trigger" type="button" aria-expanded="true" aria-controls="acc-1">
      <span class="acc__num">1.</span><span>치수 단위는 mm로 한다.</span><span class="acc__cross" aria-hidden="true"></span></button></h3>
    <div class="acc__panel" id="acc-1"><div class="acc__inner"><div class="acc__content">
      <p>단위를 따로 적지 않은 치수는 모두 <span class="mono">mm</span>이다. 면적은 ㎡로 소수 첫째 자리까지 쓴다.</p>
    </div></div></div>
  </div>
</div>
```
상태: hover = `--select` 면, 펼침 = 십자가 −로 회전, disabled = `button[disabled]`. 펼친 패널에는 app.js 가 `data-expanded` 를 붙이고(오버레이 트리거 `data-open` 과 이름이 겹치지 않게), 닫힌 패널은 `inert` 처리한다. 처음부터 펼쳐 둘 패널은 `data-expanded` 를 미리 적는다. `.acc--plain` 은 위 1px.

### alert — 정보 · 경고 · 확인 · 위험(구름)

```html
<div class="alert" role="status"><span class="alert__sym" aria-hidden="true">i</span>
  <div class="alert__body"><p class="alert__title">설명회 장소 확정</p><p class="alert__text">10.19(월) 10:00 종로구청 별관 3층 회의실</p></div></div>

<div class="alert alert--warn" role="status"><span class="alert__sym" aria-hidden="true"></span>
  <div class="alert__body"><p class="alert__title">검토 중 11장</p><p class="alert__text">REV.C 발행까지 27시간 40분</p></div></div>

<div class="alert alert--ok" role="status"><span class="alert__sym" aria-hidden="true"></span>
  <div class="alert__body"><p class="alert__title">S-201 발행 준비 완료</p></div></div>

<div class="alert alert--danger cloud" role="alert"><span class="rev rev--pin">C</span>
  <span class="alert__sym" aria-hidden="true"><span class="sym sym--red"></span></span>
  <div class="alert__body"><p class="alert__title">RFI-NH-034 미결</p>
    <p class="alert__text">계단 C 난간 높이 1,100 vs 1,200 — 회신 기한 10.16(금) 12:00</p>
    <p class="hand alert__hand">오늘 안에 확정 — 오</p>
    <div class="alert__actions"><a class="btn btn--danger btn--sm" href="inbox.html">회신 작성</a></div></div></div>
```
닫기 버튼은 `.alert__close.btn.btn--ghost.btn--icon` 을 마지막 칸에. 페이지 맨 위 배너는 `.alert--banner`(흐름 안, 다른 요소를 덮지 않는다).

### badge — 시트 상태 도장

```html
<span class="badge badge--ok">발행 준비</span>
<span class="badge badge--warn">검토 중</span>
<span class="badge badge--red">수정 중</span>
<span class="badge badge--rev">REV.C</span>              <!-- 잉크 면 Mono -->
<span class="badge badge--rev-red">D-1</span>
<span class="badge badge--ink">작도</span> <span class="badge badge--mono">1:100</span>
<span class="badge badge--stamp badge--ok">발행 준비</span> <!-- 성공 도장(구름 대신) -->
<span class="count">38</span> <span class="count count--ink">47</span> <span class="count count--red">9</span>
```
둥근 알약 금지.

### breadcrumb — 도면 경로

```html
<nav class="crumbs" aria-label="도면 경로"><ol class="crumbs__list">
  <li class="crumbs__item"><a class="crumbs__link mono" href="dashboard.html">NH-2604</a></li>
  <li class="crumbs__item"><a class="crumbs__link" href="kanban.html">건축</a></li>
  <li class="crumbs__item"><span class="crumbs__current mono" aria-current="page">A-102</span></li>
</ol></nav>
```

### button

```html
<button class="btn btn--primary" type="button">REV.C 발행</button>
<button class="btn btn--secondary" type="button">검토 요청</button>
<button class="btn btn--ghost" type="button">도면 목록</button>
<button class="btn btn--danger" type="button">프로젝트 삭제</button>
<button class="btn btn--danger-line" type="button">보관</button>
<button class="btn btn--secondary btn--sm" type="button">조밀(표 안, 데스크톱 36)</button>
<button class="btn btn--primary btn--lg" type="submit">계약 문의</button>
<button class="btn btn--secondary btn--icon" type="button" aria-label="더 보기">…아이콘…</button>
<button class="btn btn--primary" type="button" disabled>발행 불가</button>           <!-- 파선 테두리 -->
<button class="btn btn--secondary" type="button" aria-busy="true"><span>저장</span>⟨spinner⟩</button>
<button class="btn btn--secondary" type="button" data-busy="1200" data-busy-toast="TR-NH-007 저장">저장</button> <!-- 로딩 시연 -->
<button class="btn btn--secondary" type="button" aria-pressed="true">레드라인만</button>   <!-- 토글 -->
```
hover = 테두리 2px + 네 모서리 4px 크로스 틱, active = 1px 눌림, focus-visible = 링 6px 오프셋.
세그먼트: `<div class="seg" role="radiogroup" aria-label="건물 용도"><button class="seg__btn" type="button" role="radio" aria-checked="true">단독주택</button><button class="seg__btn" type="button" role="radio" aria-checked="false" tabindex="-1">근린생활시설</button></div>` — 클릭·방향키로 바뀌고 `gsa:seg` 이벤트(`detail.value` = `data-value` 또는 글자)를 낸다. `aria-pressed` 형도 된다.
버튼 묶음: `.btn-group`.

### calendar — 2026년 10월

```html
<div class="cal">
  <div class="cal__head"><p class="cal__title">2026년 10월 <span class="mono">2026.10</span></p>
    <div class="cal__nav-group"><button class="btn btn--secondary btn--icon btn--sm" type="button" aria-label="9월" disabled>‹</button><button class="btn btn--secondary btn--icon btn--sm" type="button" aria-label="11월" disabled>›</button></div></div>
  <table class="cal__grid">
    <thead><tr><th scope="col">일</th><th scope="col">월</th><th scope="col">화</th><th scope="col">수</th><th scope="col">목</th><th scope="col">금</th><th scope="col">토</th></tr></thead>
    <tbody>
      <tr>
        <td><button class="cal__day cal__day--out" type="button" disabled>27</button></td> … 
        <td><button class="cal__day" type="button" aria-label="10월 1일 목요일">1</button></td>
        <td><button class="cal__day" type="button">2</button></td>
        <td><button class="cal__day cal__day--off" type="button">3</button></td>
      </tr>
      <tr>
        <td><button class="cal__day cal__day--off" type="button">11</button></td>
        <td><button class="cal__day" type="button" aria-label="10월 12일 월요일, 구조 협의 회의" data-label="10월 12일 (월)" data-agenda="10:00|구조 협의 회의(온구조)"><span>12</span><span class="cal__marks"><i class="cal__mark cal__mark--meet"></i></span></button></td>
        <td><button class="cal__day" type="button" data-label="10월 13일 (화)" data-agenda="—|설비 도면 M-101~108 접수">13</button></td>
        <td><button class="cal__day" type="button" data-label="10월 14일 (수)" data-agenda="—|종로구 사전 검토 회신(의견 4건)">14</button></td>
        <td><button class="cal__day" type="button" aria-current="date" aria-pressed="true" data-label="10월 15일 (목)" data-agenda="16:00|내부 최종 검토 회의(오태경)"><span>15</span><span class="cal__marks"><i class="cal__mark cal__mark--meet"></i></span></button></td>
        <td><button class="cal__day" type="button" data-label="10월 16일 (금)" data-agenda="12:00|RFI-NH-034 회신 기한;18:00|REV.C 발행"><span>16</span><span class="cal__marks"><i class="cal__mark cal__mark--issue"></i></span></button></td>
        <td><button class="cal__day cal__day--off" type="button">17</button></td>
      </tr>
      <tr><td><button class="cal__day cal__day--off" type="button">18</button></td>
        <td><button class="cal__day" type="button" data-label="10월 19일 (월)" data-agenda="10:00|CM 착공도면 설명회(종로구청 별관 3층)"><span>19</span><span class="cal__marks"><i class="cal__mark cal__mark--meet"></i></span></button></td> … </tr>
    </tbody>
  </table>
  <ul class="cal__legend"><li><i class="cal__mark cal__mark--issue"></i>발행</li><li><i class="cal__mark cal__mark--meet"></i>회의</li><li><i class="cal__today-key"></i>오늘</li></ul>
  <div class="cal__agenda"><p class="t-small t-2" data-cal-agenda-date>10월 15일 (목)</p><ul data-cal-agenda></ul></div>
</div>
```
2026년 10월 1일은 **목요일**(첫 줄은 9/27–30 이월 칸 + 10/1–3). 오늘 = `aria-current="date"`(2px 사각), 선택 = `aria-pressed="true"`(밑줄 2px), 주말 = `.cal__day--off`(가는 해치). 방향키 ±1/±7 이동, 일정은 `data-agenda="시각|내용;시각|내용"`.

### card — 도면 한 장

```html
<a class="card" href="product.html">
  <span class="dim card__dim"><span class="dim__value">3,600</span></span>   <!-- 선택 -->
  <div class="card__view"><svg viewBox="0 0 160 100" aria-hidden="true">…</svg></div>
  <div class="card__body"><p>탄화 삼나무 외장, 바닥 8.64㎡.</p></div>   <!-- 선택 -->
  <div class="card__foot">
    <span class="callout callout--sm"><span class="callout__no">1</span><span class="callout__sheet">SR-106</span></span>
    <span><span class="card__title">한칸 HK-3624 정면도</span><span class="card__sub">외곽 3,600 × 2,400</span></span>
    <span class="card__scale">S=1:50</span>
  </div>
</a>
```
비링크 카드는 `div.card`, 클릭 가능한 div 는 `.card--interactive`. 선택 `aria-current="true"`/`.is-selected`, 빈 슬롯 `.card--dashed`, 비활성 `aria-disabled="true"`.

### carousel — 시트 넘기기

```html
<div class="carousel">
  <div class="carousel__track" aria-label="납품 사례" style="--slide-w: minmax(240px, 32%)">
    <div class="carousel__slide">
      <div class="carousel__thumb"><svg viewBox="0 0 120 80" aria-hidden="true">…</svg></div>
      <div class="carousel__cap"><span class="carousel__no">HK-2610-017</span><span class="carousel__name">⟨납품지⟩</span><span class="carousel__sub">탄화 삼나무 · 데크</span></div>
    </div>
    …
  </div>
  <div class="carousel__controls">
    <button class="btn btn--secondary btn--icon" type="button" data-carousel-prev aria-label="이전 시트">‹아이콘›</button>
    <span class="carousel__counter"><b>01</b> / 06</span><span class="carousel__bar"></span>
    <button class="btn btn--secondary btn--icon" type="button" data-carousel-next aria-label="다음 시트">›아이콘›</button>
  </div>
</div>
```
스크롤 스냅, 현재 = 2px(`.is-current`), 트랙 포커스 후 ←/→, 끝에서 버튼 disabled.

### code — 주기(註記) 블록

```html
<div class="code">
  <div class="code__head"><span class="code__file">semantic.css</span>
    <div class="code__tools"><span class="label code__lang">CSS</span>
      <button class="code__copy" type="button" data-copy><span class="code__copy-label">복사</span></button></div></div>
  <pre class="code__pre"><code><span class="code__c">/* G-REDL 레드라인 */</span>
<span class="code__k">--redline</span>: <span class="code__v">#B8291B</span>;</code></pre>
</div>
```
줄번호는 app.js 가 `.code__line` 으로 감싸 붙인다. 강조 줄 `.code__line--mark`, 바뀐 값 `.code__r`. 인라인 코드 `<code class="inline">`.

### command — 3-6 스니펫 그대로

정적 견본(index D-503): `.command.command--static` 안에 `.command__panel`(role="group"), 입력은 `readonly tabindex="-1"`.

### drawer — 도면함 서랍

```html
<button class="btn btn--secondary" type="button" data-open="rl-drawer" aria-haspopup="dialog" aria-controls="rl-drawer">레드라인 상세</button>

<div class="drawer" id="rl-drawer" hidden>
  <div class="drawer__scrim"></div>
  <div class="drawer__panel" role="dialog" aria-modal="true" aria-labelledby="rl-drawer-title">
    <span class="drawer__grip" aria-hidden="true"></span>
    <div class="drawer__head">
      <div><h2 class="drawer__title" id="rl-drawer-title">RL-NH-118</h2><p class="drawer__sub">A-502 · 한지선 · <span class="mono">10.15 11:05</span></p></div>
      <button class="btn btn--ghost btn--icon" type="button" data-close aria-label="서랍 닫기">✕아이콘</button>
    </div>
    <div class="drawer__body">
      <section class="drawer__section"><h3 class="drawer__section-title">요청</h3>
        <dl class="drawer__kv"><dt>시트</dt><dd><span class="mono">A-502</span> 열람실 창호 상세도</dd><dt>내용</dt><dd>창대 높이 <span class="mono">900 → 750</span>(어린이 눈높이)</dd></dl></section>
    </div>
    <div class="drawer__foot"><button class="btn btn--secondary" type="button" data-close>닫기</button><button class="btn btn--primary" type="button" data-close data-toast="RL-NH-118 반영 완료">반영 완료</button></div>
  </div>
</div>
```
왼쪽 서랍 `.drawer--left`. 정적 견본 `.drawer.drawer--static`(해치 위에 서랍 절반, `hidden` 없음, panel role="group").

### empty — 빈 시트

```html
<div class="empty">
  <div class="empty__dim"><span class="dim"><span class="dim__value">—</span></span></div>
  <div class="empty__box"><p class="empty__no">E-102</p><p class="empty__title">도면 없음</p>
    <p class="empty__text">전기 2층 전등 평면도가 아직 등록되지 않았습니다.</p>
    <button class="btn btn--secondary btn--sm" type="button">시트 등록</button></div>
</div>
```
작은 판 `.empty--sm`. 행동 버튼은 하나만.

### form

```html
<form class="form" data-validate data-success="회신 초안 저장" data-success-ref="RFI-NH-034" novalidate>
  <div class="form__row">
    <div class="field">
      <label class="field__label" for="rail-h">난간 높이 <span class="field__req">필수</span></label>
      <div class="field__box"><input class="field__input field__input--num" id="rail-h" type="number" value="1200" min="1200" required data-error="공공건축 난간은 1,200 이상입니다."><span class="field__unit">mm</span></div>
      <p class="field__hint">건축물의 피난·방화구조 등의 기준에 관한 규칙</p>
      <p class="field__error" role="alert"></p>
    </div>
    <div class="field">
      <label class="field__label" for="scale">기본 축척</label>
      <div class="field__box field__box--select"><select class="field__input" id="scale"><option>1:100</option><option>1:50</option></select></div>
    </div>
  </div>
  <div class="field"><label class="field__label" for="memo">회신 근거 <span class="field__opt">선택</span></label>
    <div class="field__box"><textarea class="field__input" id="memo" maxlength="400" data-counter="memo-count"></textarea></div>
    <p class="field__hint"><span class="mono" id="memo-count">0 / 400</span></p></div>
  <fieldset class="fieldset fieldset--row"><legend class="fieldset__legend">알림 대상</legend>
    <label class="check"><input class="check__input" type="checkbox" checked> 장은비</label>
    <label class="check"><input class="check__input" type="checkbox"> 남궁하린</label></fieldset>
  <fieldset class="fieldset fieldset--row"><legend class="fieldset__legend">회신 기한</legend>
    <label class="radio"><input class="radio__input" type="radio" name="due" checked> <span class="mono">10.16 12:00</span></label>
    <label class="radio"><input class="radio__input" type="radio" name="due"> <span class="mono">10.19 10:00</span></label></fieldset>
  <label class="switch"><input class="switch__input" type="checkbox" checked><span class="switch__track" aria-hidden="true"><span class="switch__off">OFF</span><span class="switch__on">ON</span></span><span class="switch__label">발행 알림<span class="switch__sub">REV 발행 시 협력사 메일</span></span></label>
  <div class="range" data-unit="㎡">
    <div class="range__dim"><span class="dim dim--ink dim--keep"><span class="dim__value">240㎡</span></span></div>
    <input class="range__input" id="area" type="range" min="60" max="600" step="10" value="240" aria-label="연면적">
    <div class="range__scale"><span>60</span><span>600</span></div>
  </div>
  <output data-range-out="area" data-unit="㎡">240㎡</output>
  <div class="form__actions"><button class="btn btn--ghost" type="reset">되돌리기</button><button class="btn btn--primary" type="submit">회신 저장</button></div>
</form>
```
- 오류: 칸을 떠날 때·제출할 때 app.js 가 `aria-invalid` + `.field.is-error` + `.field__box.cloud`(구름이 그려진다) + 메시지. 정적 견본은 직접 `class="field is-error"` · `class="field__box cloud"` · `aria-invalid="true"` 를 쓴다.
- 확인 상태 `.field.is-ok`(실선 ok 테두리), 읽기 전용 `readonly`(오목 면), 비활성 `disabled`(파선).
- 앞 단위 `.field__unit--pre`, 앞 아이콘 `.field__icon`. 블록형 선택지 `.check--block` / `.radio--block`(+ `.check__meta`).
- 줄 배치 `.form__row`(2칸) `.form__row--3`(3칸), 모바일 1칸.
- 제출 성공 시 `gsa:submitted` 이벤트 + 토스트(`data-success`, `data-success-text`, `data-success-ref`). 레이어와 묶는 스위치는 `data-layer-toggle="grid|dims"`.

### kanban — 도면 작업 보드

```html
<div class="kb" aria-label="REV.C 도면 작업 보드">
  <section class="kb__col" data-col-name="작도" data-wip="4" aria-label="작도">
    <header class="kb__head">
      <p class="kb__title">작도 <span class="kb__count">4</span></p>
      <div class="kb__wip"><span class="kb__wip-label">한도</span><span class="dim dim--keep"><span class="dim__value">4</span></span></div>
    </header>
    <div class="kb__list">
      <article class="kb-card cloud" aria-label="A-102 1층 평면도, 수정 중, 레드라인 3건">
        <span class="rev rev--pin">3</span>
        <div class="kb-card__top"><span class="kb-card__no">A-102</span>
          <button class="btn btn--ghost btn--icon btn--sm kb-card__move" type="button" aria-label="A-102 열 이동">⟨열 이동 아이콘⟩</button></div>
        <p class="kb-card__name">1층 평면도</p>
        <div class="kb-card__meta"><span class="kb-card__who"><span class="avatar avatar--sm" aria-hidden="true">문</span>문서연</span>
          <span class="kb-card__issues"><span class="sym sym--red" aria-hidden="true"></span>3</span></div>
      </article>
      <article class="kb-card" aria-label="A-503 지붕 처마 상세도">
        <div class="kb-card__top"><span class="kb-card__no">A-503</span><button class="btn btn--ghost btn--icon btn--sm kb-card__move" type="button" aria-label="A-503 열 이동">…</button></div>
        <p class="kb-card__name">지붕 처마 상세도</p>
        <div class="kb-card__meta"><span class="kb-card__who"><span class="avatar avatar--sm" aria-hidden="true">백</span>백도윤</span><span class="mono">1:10</span></div>
      </article>
    </div>
  </section>
  <!-- 내부 검토(data-wip=5) · 협력사 검토(4) · 발행 준비(6) -->
</div>
```
- 열: `작도`(4) · `내부 검토`(5) · `협력사 검토`(4) · `발행 준비`(6). 협력사 카드의 이니셜은 `.avatar--ext`(파선 원).
- 드래그 앤 드롭, 카드 포커스 후 **Alt+←/→**, `.kb-card__move` 메뉴로 열 이동 → 개수·WIP 초과(레드라인 치수)·빈 열 문구를 app.js 가 갱신하고 토스트로 알린다.
- 구름(`.cloud`)은 「수정 중」 카드에만, 한 뷰포트 2개 이하.

### list — 도면 목록 행

```html
<ul class="slist">
  <li><a class="slist__row is-new" href="inbox.html">
    <span class="slist__no">RL-118</span>
    <span class="slist__main"><span class="slist__name">열람실 창대 높이 900 → 750</span><span class="slist__sub"><span class="mono">A-502</span> · 한지선</span></span>
    <span class="slist__end"><span class="slist__time">11:05</span></span></a></li>
  <li><a class="slist__row" href="inbox.html" aria-current="true">…</a></li>
  <li><div class="slist__row is-done">…<span class="slist__end"><span class="badge badge--ok">회신 완료</span></span></div></li>
</ul>
```
번호 열 88px(긴 ID는 `.slist--wide` 112px), 조밀 `.slist--dense`. 상태: `.is-new`(레드라인 번호 + ▲) `.is-unread` `.is-done` `aria-current`/`aria-selected`/`.is-selected` `aria-disabled`. 키-값 목록 `.kv`.

### marquee — 발행 공지 띠

```html
<div class="marquee" aria-label="발행 공지">
  <span class="marquee__tag"><span class="sym sym--red" aria-hidden="true"></span><span class="marquee__tag-label">발행 공지</span></span>
  <div class="marquee__viewport"><div class="marquee__track"><div class="marquee__group">
    <span class="marquee__item marquee__item--red">REV.C 발행 <span class="mono">10.16</span> (금) <span class="mono">18:00</span></span>
    <span class="marquee__item">내부 최종 검토 <span class="mono">10.15</span> (목) <span class="mono">16:00</span> · 오태경</span>
    <span class="marquee__item">CM 착공도면 설명회 <span class="mono">10.19</span> (월) <span class="mono">10:00</span> · 종로구청 별관 3층</span>
    <span class="marquee__item">열린 레드라인 <span class="mono">23</span>건 · 미결 RFI <span class="mono">9</span>건</span>
  </div></div></div>
  <button class="btn btn--ghost btn--icon marquee__toggle" type="button" data-marquee-toggle aria-pressed="false" aria-label="공지 띠 멈추기">⟨멈춤 아이콘⟩</button>
</div>
```
app.js 가 그룹을 한 번 복제(aria-hidden)한다. hover·focus·정지 버튼·모션 감소 시 멈춘다. 속도 `style="--marquee-dur:40s"`.

### menu — 컨텍스트 메뉴

```html
<div class="menu">
  <button class="btn btn--secondary" type="button" data-menu-trigger aria-haspopup="menu" aria-expanded="false" aria-controls="sheet-menu">시트 메뉴</button>
  <div class="menu__panel" id="sheet-menu" role="menu" hidden>
    <p class="menu__label">A-102 · 1층 평면도</p>
    <button class="menu__item" role="menuitem" type="button" data-toast="A-102 검토 요청"><span></span><span>검토 요청</span><span class="menu__key">⌘R</span></button>
    <button class="menu__item" role="menuitemcheckbox" aria-checked="true" type="button"><span></span><span>통심선 표시</span><span></span></button>
    <button class="menu__item" role="menuitem" type="button" aria-disabled="true"><span></span><span>발행(승인 필요)</span><span></span></button>
    <div class="menu__sep" role="separator"></div>
    <button class="menu__item menu__item--danger" role="menuitem" type="button" data-open="confirm-delete"><span></span><span>시트 삭제</span><span class="menu__key">⌫</span></button>
  </div>
</div>
```
첫 칸 18px 는 아이콘·체크 자리. 끝 정렬 `.menu__panel--end`, 위로 `.menu__panel--up`(화면 밖이면 app.js 가 자동). ↑↓ Home End 글자 이동 Esc Tab. 정적 견본 `.menu__panel.menu__panel--static`(hidden 없이, 항목 `tabindex="-1"`).

### modal — 상세도 확대

```html
<button class="btn btn--primary" type="button" data-open="rfi-modal" aria-haspopup="dialog" aria-controls="rfi-modal">회신 확정</button>

<div class="modal" id="rfi-modal" hidden>
  <div class="modal__scrim"></div>
  <div class="modal__panel" role="dialog" aria-modal="true" aria-labelledby="rfi-modal-title">
    <button class="btn btn--ghost btn--icon modal__close" type="button" data-close aria-label="닫기">✕아이콘</button>
    <div class="modal__body">
      <p class="modal__lead">계단 C 난간 높이를 <span class="mono">1,200</span>으로 확정합니다. A-501 상세 3과 A-401이 함께 바뀝니다.</p>
      <div class="modal__view"><svg …>…상세 도면…</svg></div>          <!-- 선택 -->
      <dl class="modal__kv"><dt>요청</dt><dd>장은비 · <span class="mono">RFI-NH-034</span></dd><dt>회신 기한</dt><dd><span class="mono">2026.10.16</span> (금) <span class="mono">12:00</span></dd></dl>
    </div>
    <div class="modal__titleband">
      <span class="callout"><span class="callout__no">3</span><span class="callout__sheet">A-501</span></span>
      <div class="vtitle__rule"><h2 class="modal__title" id="rfi-modal-title">계단 C 난간 상세</h2><span class="vtitle__scale">S=1:10</span></div>
    </div>
    <div class="modal__foot"><button class="btn btn--ghost" type="button" data-close>취소</button>
      <button class="btn btn--primary" type="button" data-close data-toast="RFI-NH-034 회신 확정" data-toast-ref="A-501/C">회신 확정</button></div>
  </div>
</div>
```
크기 `.modal--sm`(460) `.modal--lg`(880). 위험 확인 `.modal--danger`(빨간 프레임·제목, 구름 없음). 열면 트리거 자리에 콜아웃 원이 그려지고 시트가 위에서 아래로 출력된다. 포커스 트랩·Esc·바깥 누름 닫기·트리거로 포커스 복귀. 정적 견본 `.modal.modal--static`(panel role="group").

### motion — 다시 그리기 시연

```html
<div class="motion">
  <div class="motion__stage"><svg id="plan-demo" data-draw viewBox="…" role="img" aria-label="1층 평면도 축소">…data-plot 그룹…</svg></div>
  <div class="motion__bar">
    <ol class="motion__order"><li><span class="mono">1</span>통심선</li><li><span class="mono">2</span>벽</li><li><span class="mono">3</span>문·창</li><li><span class="mono">4</span>치수</li><li><span class="mono">5</span>글자</li><li><span class="mono">6</span>레드라인</li></ol>
    <button class="btn btn--secondary btn--sm" type="button" data-redraw="plan-demo">다시 그리기</button>
  </div>
  <p class="motion__note">동작 줄이기 설정이 켜져 있으면 완성된 도면을 바로 보여 줍니다.</p>
  <dl class="motion__tokens"><dt>--ease-plot</dt><dd>cubic-bezier(.45, 0, .2, 1)</dd><dd class="mono">그리기</dd> …</dl>
</div>
```
모션 유틸: `[data-draw]`(SVG), `.sheet[data-frame-draw]`, `[data-count="47"]`(숫자 판독, `data-prefix="₩"` `data-suffix="장"` `data-decimals`), `<time class="mono" data-countdown="27:40:00">27:40:00</time>`(1초씩 줄어든다), `GSA.stamp(el)`(REV.0 도장 1.08 → 1), `GSA.cloud(el)`(구름 다시 그리기). fade-up · translateY 등장 금지.

### navbar — 3-1 스니펫 그대로

### pagination

```html
<nav class="pager" data-pager data-total="9" data-current="3" aria-label="시트 목록 쪽">
  <div class="pager__list">
    <!-- JS 없을 때 보이는 정적 판. app.js 가 같은 구조로 다시 그린다 -->
    <button class="pager__btn pager__btn--edge" type="button" data-page="prev" aria-label="이전 쪽">‹</button>
    <button class="pager__btn" type="button" data-page="1" aria-label="1쪽">01</button>
    <button class="pager__btn" type="button" data-page="3" aria-label="3쪽" aria-current="page">03</button>
    <button class="pager__btn pager__btn--edge" type="button" data-page="next" aria-label="다음 쪽">›</button>
  </div>
  <p class="pager__info">쪽 <span class="mono" data-pager-current>03 / 09</span></p>
</nav>
```
모바일은 ‹ 현재 › 만. 바뀌면 `gsa:page`(`detail.page`).

### popover — 지시선 주석

```html
<button class="btn btn--secondary" type="button" data-popover="note-118">주석</button>
<div class="pop" id="note-118" role="dialog" aria-label="RL-NH-118 주석" hidden>
  <div class="pop__head"><div><p class="pop__ref">3/A-502</p><p class="pop__title">열람실 창호 상세</p></div>
    <button class="btn btn--ghost btn--icon pop__close" type="button" data-close-pop aria-label="닫기">✕아이콘</button></div>
  <div class="pop__body"><p>창대 높이 <span class="mono">750</span>, 하부 고정창 <span class="mono">450</span>.</p>
    <dl class="pop__kv"><dt>요청</dt><dd>한지선 · <span class="mono">10.15 11:05</span></dd></dl></div>
  <div class="pop__actions"><a class="btn btn--secondary btn--sm" href="kanban.html">A-502 열기</a></div>
</div>
```
app.js 가 패널을 body 로 옮겨 대상 아래(공간이 없으면 위)에 놓고 45° 지시선 끝을 대상 중심에 맞춘다. 바깥 누름·Esc 닫기. 폭 `style="--pop-w:320px"`. 정적 견본 `.pop.pop--static`(hidden 없이).

### progress — 해치 막대 + 치수 눈금

```html
<div class="prog" style="--v:76%">
  <div class="prog__head"><span class="prog__label">건축 A</span><span class="prog__meta"><span class="mono">29/38</span></span></div>
  <div class="prog__track" role="progressbar" aria-valuenow="76" aria-valuemin="0" aria-valuemax="100" aria-label="건축 시트 발행 준비 29/38">
    <div class="prog__scale" aria-hidden="true"><span>0</span><span>50</span><span>100</span></div>
    <div class="prog__bar"><span class="prog__fill"></span></div>
  </div>
  <span class="prog__value">76%</span>
</div>
```
변형 `.prog--ok` `.prog--red` `.prog--bare`(눈금 없음) `.prog--busy`(값 모름, 해치가 흐른다) `.prog--full`. 분야별 소형 줄 `.meter`(3-3 사이드바 참고). 원형 진행 금지. 분야별 값: A 29/38 = 76% · S 9/12 = 75% · M 5/8 = 63% · E 4/6 = 67%.

### sidebar — 3-3 스니펫 그대로

### skeleton — 미작도

```html
<div aria-busy="true" aria-label="시트 목록 불러오는 중">
  <div class="skel-row" aria-hidden="true"><span class="skel"></span><span class="skel"></span><span class="skel"></span></div>
  <div class="skel-card" aria-hidden="true"><span class="skel skel--thumb"></span><span class="skel skel--title"></span><span class="skel skel--line"></span><span class="skel skel--line is-short"></span></div>
</div>
```
`.skel`(X자 보조선 있는 칸) `.skel--block` `.skel--thumb`(A1 비율) `.skel--line` `.skel--title` `.skel--circle`. 반짝임 없음, 파선만 천천히 흐른다.

### spinner — 원을 긋는 펜

```html
<svg class="spinner" viewBox="0 0 24 24" role="img" aria-label="불러오는 중"><circle class="spinner__track" cx="12" cy="12" r="9"/><circle class="spinner__arc" cx="12" cy="12" r="9" pathLength="1"/><g class="spinner__pen"><circle cx="12" cy="3" r="1.6"/></g></svg>
```
크기 `.spinner--16` / 기본 24 / `.spinner--40`. 라벨과 함께 `<span class="loading">⟨spinner--16⟩PDF 묶는 중</span>`. JS 로 만들 때 `GSA.spinner(16)`.

### steps — 발행 절차

```html
<ol class="steps">
  <li class="steps__item" data-state="done"><span class="steps__node" aria-hidden="true"></span><span class="steps__label">레드라인 마감</span><span class="steps__meta"><span class="mono">10.14</span> (수)</span></li>
  <li class="steps__item" data-state="done"><span class="steps__node" aria-hidden="true"></span><span class="steps__label">협력사 회신</span><span class="steps__meta"><span class="mono">10.15</span> (목)</span></li>
  <li class="steps__item" data-state="current" aria-current="step"><span class="steps__node" aria-hidden="true"></span><span class="steps__label">내부 최종 검토</span><span class="steps__meta"><span class="mono">16:00</span> 오태경</span></li>
  <li class="steps__item" data-state="todo"><span class="steps__node" aria-hidden="true"></span><span class="steps__label">대표 승인</span><span class="steps__meta">한지선</span></li>
  <li class="steps__item" data-state="todo"><span class="steps__node" aria-hidden="true"></span><span class="steps__label">REV.C 발행</span><span class="steps__meta"><span class="mono">10.16 18:00</span></span></li>
</ol>
```
번호는 CSS 카운터. 완료 = 잉크 면 원 + 실선, 현재 = 2px 원, 미완 = 파선 원 + 일점쇄선, 오류 `data-state="error"`. 세로형 `.steps--v`(모바일은 자동 세로, 유지하려면 `.steps--keep`). 단계로 돌아가는 버튼형: `<li class="steps__item" data-state="done"><button class="steps__btn" type="button"><span class="steps__node"></span><span class="steps__label">대지</span></button></li>`. 이동은 `GSA.setStep(olEl, index)`.

### table — 일람표

```html
<div class="tbl-wrap scrollx">
  <div class="tbl-bar"><p class="tbl-bar__title">REV.C 시트 일람표</p>
    <div class="field__box"><input class="field__input" type="search" placeholder="시트 번호·도면명" aria-label="일람표 거르기" data-table-filter="sheet-table"></div>
    <p class="tbl-bar__meta"><span class="mono" data-filter-count="sheet-table">21</span>장</p></div>
  <table class="tbl tbl--sticky tbl--hover" id="sheet-table" data-selectable>
    <caption class="sr-only">REV.C 시트 일람표, 21장</caption>
    <thead><tr>
      <th scope="col" aria-sort="ascending"><button class="tbl__sort" type="button">시트 번호 <span class="tbl__arrows" aria-hidden="true"></span></button></th>
      <th scope="col" aria-sort="none"><button class="tbl__sort" type="button">도면명 <span class="tbl__arrows" aria-hidden="true"></span></button></th>
      <th scope="col">축척</th>
      <th scope="col" aria-sort="none"><button class="tbl__sort" type="button">담당 <span class="tbl__arrows" aria-hidden="true"></span></button></th>
      <th scope="col" class="r" aria-sort="none"><button class="tbl__sort" type="button">레드라인 <span class="tbl__arrows" aria-hidden="true"></span></button></th>
      <th scope="col">REV.C 상태</th>
    </tr></thead>
    <tbody>
      <tr><td class="tbl__no">A-001</td><td>도면 목록 및 일반사항</td><td class="mono">NONE</td><td>문서연</td><td class="num">0</td><td><span class="badge badge--ok">발행 준비</span></td></tr>
      <tr class="is-red"><td class="tbl__no">A-102</td><td>1층 평면도</td><td class="mono">1:100</td><td>문서연</td><td class="num">3</td><td><span class="badge badge--red">수정 중</span></td></tr>
      …
      <tr class="tbl__empty" hidden><td colspan="6">맞는 시트가 없습니다.</td></tr>
    </tbody>
  </table>
  <div class="tbl-foot"><span>발행 준비 <span class="mono">47</span> · 검토 중 <span class="mono">11</span> · 수정 중 <span class="mono">6</span></span><span data-sort-status aria-live="polite"></span></div>
</div>
```
- 정렬: 머리 버튼 → `aria-sort` 전환, 정렬된 열 머리에 열 폭 틱. 숫자(`₩ , ㎡ % 장 건` 제거 후)는 수 비교, 나머지 한국어 비교. 정렬 값을 따로 주려면 `<td data-sort="…">`.
- 행 이동 `tr[data-href="kanban.html"]`(Enter 지원), 행 선택 `table[data-selectable]` → `aria-selected`. 레드라인 행 `.is-red`, 흐린 행 `.is-muted`. 조밀 `.tbl--dense`. 최소 폭 `style="--tbl-min:880px"`.
- 모바일: 가로 스크롤 + 첫 열 sticky + 오른쪽 페이드(`.scrollx`). 카드로 바꾸지 않는다.

### tabs — 분야 탭

```html
<div class="tabs">
  <div class="tabs__bar"><div class="tabs__list scrollx" role="tablist" aria-label="분야">
    <button class="tabs__tab" role="tab" id="tab-a" aria-selected="true" aria-controls="panel-a"><span class="tabs__key">A</span>건축 <span class="count">38</span></button>
    <button class="tabs__tab" role="tab" id="tab-s" aria-selected="false" aria-controls="panel-s" tabindex="-1"><span class="tabs__key">S</span>구조 <span class="count">12</span></button>
    <button class="tabs__tab" role="tab" aria-selected="false" aria-disabled="true" tabindex="-1"><span class="tabs__key">L</span>조경</button>
  </div></div>
  <div class="tabs__panel" role="tabpanel" id="panel-a" aria-labelledby="tab-a" tabindex="0">…</div>
  <div class="tabs__panel" role="tabpanel" id="panel-s" aria-labelledby="tab-s" tabindex="0" hidden>…</div>
</div>
```
←/→ Home End, 바뀌면 `gsa:tab`(`detail.value` = `data-value`). 패널을 테두리로 감싸려면 `.tabs--boxed`, 작은 탭 `.tabs--sm`(설정·상품 도면 전환).

### timeline — 리비전 이력

```html
<ol class="tl">
  <li class="tl__item is-done"><span class="tl__node"><span class="rev rev--ink">0</span></span><span class="tl__date">2026.06.30</span>
    <div class="tl__body"><p class="tl__title">기본설계 발행</p></div></li>
  <li class="tl__item is-done"><span class="tl__node"><span class="rev rev--ink">A</span></span><span class="tl__date">2026.08.14</span>
    <div class="tl__body"><p class="tl__title">종로구 1차 협의 반영</p><p class="tl__text">1층 북측 출입구 이동</p></div></li>
  <li class="tl__item is-current"><span class="tl__node"><span class="rev rev--ink">B</span></span><span class="tl__date">2026.09.25</span>
    <div class="tl__body"><p class="tl__title">구조 협의 반영</p><p class="tl__text">기초 보 춤 600 → 700</p></div></li>
  <li class="tl__item is-planned"><span class="tl__node"><span class="rev rev--planned">C</span></span><span class="tl__date">2026.10.16</span>
    <div class="tl__body"><p class="tl__title">착공 도면 발행 예정</p><div class="tl__meta"><span class="badge badge--rev">D-1</span></div></div></li>
</ol>
```
썸네일 있는 항목(프로필 준공작): `li.tl__item.tl__item--thumb` + `.tl__body` 안 `<div class="tl__thumb"><svg …/></div>`.

### toast — 발행 알림

```js
GSA.toast({ title: 'S-201 발행 준비 완료', text: '남궁하린 확인 · 14:12', tone: 'ok', ref: 'TR-NH-007' });
GSA.toast({ title: '새 설계질의 — 계단 C 난간', text: '장은비 · 13:52', tone: 'red', ref: 'RFI-NH-034', action: { label: '열기', href: 'inbox.html' } });
```
선언형: `<button … data-toast="제목" data-toast-text="본문" data-toast-tone="ok|red|info" data-toast-ref="ID">`. 오른쪽 아래, 최대 3개, 5초(hover·focus 시 멈춤), 닫을 때 빨간 취소선. 정적 견본:

```html
<div class="toasts toasts--static">
  <div class="toast toast--ok"><span class="toast__sym" aria-hidden="true"></span>
    <div class="toast__body"><span class="toast__ref">TR-NH-007</span><strong class="toast__title">S-201 발행 준비 완료</strong><span class="toast__text">남궁하린 확인 · 14:12</span></div>
    <button class="btn btn--ghost btn--icon toast__close" type="button" aria-label="알림 닫기">✕아이콘</button></div>
</div>
```

### tooltip — 짧은 주석

```html
<button class="btn btn--secondary btn--icon" type="button" aria-label="A-102 작업 메뉴" data-tip="A-102 작업 메뉴">…</button>
<span class="tip tip--static">A-102 · 1층 평면도 · 문서연</span>   <!-- 정적 견본 -->
```
hover(160ms 지연)·키보드 포커스에 뜨고 Esc·스크롤에 사라진다. 터치에서는 뜨지 않으므로 핵심 정보는 툴팁에만 두지 않는다.

---

## 6. app.js 연결 고리 한눈에

| 속성 / 클래스 | 동작 |
|---|---|
| `[data-theme-toggle]` | 낮 ↔ 밤, localStorage `gsa-theme`. URL `?theme=` 최우선. `[data-scene-time]` 글자를 `14:20` / `23:40` 으로 바꾼다 |
| `[data-layer-toggle="grid\|dims"]` | 버튼(aria-pressed) 또는 체크박스. `:root[data-layer-grid/dims="off"]` |
| `.sheet` / `.sheet__frame[data-grid]` | 구역 띠 · 통심선 생성 |
| `.sheet[data-frame-draw]` · `[data-draw]` · `.dim` · `.cloud` | 처음 보일 때 그리기 |
| `[data-redraw="id"]` | 다시 그리기 |
| `[data-crosshair]` + `svg[data-plan][data-plan-origin]` | 십자선 + mm 좌표 판독(마우스·모션 허용 시) |
| `[data-count]` · `[data-countdown]` | 숫자 판독 · 카운트다운 |
| `[data-open="id"]` · `[data-close]` · `[data-close="id"]` | modal · drawer · command 열고 닫기(포커스 트랩, Esc, 바깥 누름) |
| ⌘K / Ctrl+K | `#command` |
| `[data-side-toggle="side"]` | 960 미만 사이드바 서랍 |
| `[data-menu-trigger]` + `aria-controls` | 메뉴 |
| `[data-popover="id"]` · `[data-close-pop]` | 팝오버 |
| `[data-tip]` | 툴팁 |
| `[data-toast]` / `GSA.toast()` | 토스트 |
| `[role=tablist]` | 탭 |
| `.acc__trigger` · `.side__group-btn` | 펼침 |
| `.scrollx` | 끝 페이드 힌트 |
| `.carousel` · `.marquee` · `.kb` · `[data-pager]` · `.cal` | 각 부재 |
| `.tbl__sort` · `[data-table-filter]` · `tr[data-href]` · `table[data-selectable]` | 일람표 |
| `.code` · `[data-copy]` | 줄번호 · 복사 |
| `form[data-validate]` · `.range` · `[data-range-out]` · `.seg` · `[data-busy]` · `[data-counter]` | 폼 |

이벤트: `gsa:open` `gsa:close` `gsa:tab` `gsa:seg` `gsa:page` `gsa:day` `gsa:submitted`.
API: `GSA.toast(opts)` `GSA.open(id)` `GSA.close(id)` `GSA.redraw(id)` `GSA.cloud(el)` `GSA.stamp(el)` `GSA.countTo(el, n)` `GSA.setStep(ol, i)` `GSA.formatNum(n, d)` `GSA.setTheme('dark')` `GSA.spinner(size)`.
장면 전용 계산(요율 계산기·한칸 합계 등)은 페이지 끝 `<script>` 에서 이 API와 이벤트만 써서 짠다(인라인 onclick 금지).

---

## 7. 장면 작업 점검표

- [ ] 첫 화면이 랜딩 공식(eyebrow → 큰 헤드라인 → CTA 2개 → 칩)이 아니다. 시트 + 도면 + 아래 왼쪽 도면명이다.
- [ ] 같은 구도의 시트를 연달아 두지 않았다(평면 · 입면 · 단면 · 상세 · 일람표).
- [ ] 구름은 조치가 필요한 곳에만, 뷰포트당 2개 이하. 성공은 도장.
- [ ] 치수 값은 실제 값만(404의 `?,???` 예외).
- [ ] 날짜·요일·인물·수치는 팩트 시트 값(2026.10.15 목, 오태경 로그인, 64장 = 47/11/6).
- [ ] 한글에 모노·넓은 자간 없음. `.label` 은 라틴만, 화면당 5개 이하.
- [ ] 셸(navbar · 사이드바 · footer · #nav-drawer · #command) 은 3절 스니펫 그대로, 바뀐 값은 도면명·시트 번호·aria-current 뿐.
- [ ] SVG presentation attribute 에 `var()` 없음. `href="#"`·인라인 onclick·인라인 grid-template-columns 없음.
- [ ] 1440 / 390 × 낮 / 밤 스크린샷 확인, 390에서 가로 넘침 0, 터치 44px.
