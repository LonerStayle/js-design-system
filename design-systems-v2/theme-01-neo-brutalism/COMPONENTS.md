# COMPONENTS — 판판레코드 v2 마크업 계약

index.html · pages/*.html 담당 에이전트는 **이 문서만 보고** 마크업한다. 디자인 근거는 `DIRECTION.md`.
클래스는 BEM(`블록__요소--변형`). 상태는 가능하면 ARIA 속성(`aria-selected`, `aria-current`, `aria-expanded`, `aria-pressed`, `aria-busy`, `aria-invalid`, `disabled`)으로 표시한다. CSS가 그 속성을 읽는다.

---

## 0. 페이지 뼈대 (모든 HTML 공통)

```html
<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>판판레코드 — 운영 보드</title>
<script>(function(){try{var q=new URLSearchParams(location.search).get('theme');var s=localStorage.getItem('panpan-theme');var t=(q==='dark'||q==='light')?q:(s==='dark'||s==='light')?s:(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.setAttribute('data-theme',t);}catch(e){}})();</script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@700;800;900&family=Gasoek+One&family=IBM+Plex+Sans+KR:wght@400;500;700&family=IBM+Plex+Mono:wght@400;600&display=swap">
<link rel="stylesheet" href="styles.css">          <!-- pages: ../styles.css -->
<link rel="stylesheet" href="index.css">           <!-- pages: dashboard.css 등 장면 전용 1개 -->
</head>
<body>
<a class="skip" href="#main">본문으로 건너뛰기</a>
<div class="marquee">…</div>          <!-- 사이트 최상단 1곳만 -->
<header class="nav">…</header>      <!-- 정본 8칸: 3절 navbar -->
<main id="main">…</main>
<footer class="wall site-foot">…</footer>   <!-- pages 공통 바닥글: 3절 navbar 아래 site-foot (index는 판권면이 대신) -->
<!-- 오버레이(모달·드로어·커맨드)는 body 끝에 -->
<script src="app.js"></script>        <!-- pages: ../app.js -->
</body>
</html>
```

- `localStorage` 키는 `panpan-theme`. `?theme=dark|light`가 최우선.
- **세계관 정본 (모든 화면이 이 값만 쓴다)**: 달력은 **2026년**(오늘 = 10월 10일 토, 10/1 목요일 시작). 정기 휴무 월요일(10/5·12·19·26), 임시 휴무 10월 15일(목), 판판 라이브 #118 = 10월 24일(토) 20:00, 41주차 = 10.05 월 – 10.11 일. 영업 **화–목 13–21 · 금 13–23 · 토 12–21 · 일 12–20**, 중고 매입 **화·목 13:00–19:00**. 주소 **서울 마포구 망원로7길 41, 지하 1층**. 카탈로그 번호는 한 판에 하나(PP-0412 지하 3층, PP-0398 썰물, PP-0389 시티 라이트 77, PP-0371 분식 연합, U-1187 흐린 날 정전, U-1152 전파 중고 …) — 같은 번호를 다른 판에 붙이지 않는다.
- 화면에 보이는 라벨은 한국어. 라틴 대문자 코드(THEME, CART, WEEK …) 대신 `밝기 · 장바구니 · 주차`. 예외: PANPAN 워드마크, PP-/U- 카탈로그 번호, M/NM/VG 등급, 코드·파일명.
- 장면 CSS(`index.css`, `pages/*.css`)도 **semantic 토큰만** 쓴다(아래 2절 목록). raw hex 금지, 인라인 `grid-template-columns` 금지(대신 스팬 클래스). 단 `style="--val:62%"` 같은 커스텀 속성 주입은 허용.
- 아이콘은 인라인 SVG: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="…"/></svg>`. 색은 CSS가 `stroke: currentColor`로 준다. **presentation attribute에 `var()` 금지.** 범용 아이콘 클래스는 `.icon`(20px) / `.icon--lg`(24px).

---

## 1. 레이아웃 문법 (base.css)

### `.wall` — 규칙선 벽보 그리드 (12단, gap 3px = 잉크 선, 풀블리드)
```html
<section class="wall">
  <div class="span-9 cell--crop">…</div>
  <div class="span-3">…</div>
</section>
```
- **한 행의 스팬 합은 반드시 12.** 빈 칸은 선 색(라이트=검정, 다크=흰색) 덩어리로 보인다.
- 허용 분할: 7/5, 8/4, 9/3, 3/9, 5/7, 4/8 (+ 12 전폭). 균등 분할(4/4/4, 3/3/3/3, 6/6)은 데이터 표·캘린더·모션 시연만.
- 반응형 자동 매핑: ≤1024 8단(9→5, 3→3, 7→5, 5→3, 8→5, 4→3, 6→4, 2→2) · ≤768 4단(전부 전폭, `.span-2`/`.cell--half`만 반폭) · ≤480 2단(전부 전폭, `.cell--half`만 반폭 — 숫자 칸용).
- 칸 수식: `.cell--flush`(패딩 0, 표·달력·칸반을 칸에 꽉 채울 때) `.cell--alt`(회색) `.cell--accent`(레드) `.cell--highlight`(옐로) `.cell--ink`(잉크 슬랩색) `.cell--crop`(넘치는 mega 타이포 자르기) `.cell--stack`(세로 16px 간격) `.cell--end`(아래 정렬) `.row-2`(2행 차지, ≤768 해제).
- 칸 안에 컴포넌트를 넣을 땐 컴포넌트 바깥 보더가 규칙선과 겹친다 → `.card--bare`, `.tbl-wrap--bare`, 또는 `.cell--flush` + 컴포넌트 보더 유지 중 택1.
- **`.cell--crop` 안에 `.sticker--pin`을 두지 말 것**(잘린다). 스티커는 형제 칸이나 crop 없는 칸에.

### `.slab` — 한 색 면 풀블리드 띠 (세로 72px / 모바일 48px)
```html
<section class="slab slab--red"><div class="slab__body">…</div></section>
```
변형 `--red --yellow --cobalt --green --ink`, `--tight`(48px). `.slab__body`는 9/12 폭(오른쪽 3단 비움, ≤768 해제). 잉크·옐로 슬랩 안 버튼은 그림자 색이 자동으로 바뀐다(`.on-ink`를 임의 컨테이너에 붙여도 동일).

### `.crate-layout` — 왼쪽 3단 고정 인덱스 + 오른쪽 9단
```html
<section class="crate-layout">
  <aside class="crate-layout__index"><div class="crate-layout__pin">
    <nav class="side side--bare" aria-label="부품 인덱스">…</nav>
  </div></aside>
  <div class="crate-layout__body">…</div>      <!-- 패딩 0: crate-layout__body--flush -->
</section>
```
`__pin`은 sticky top 72px. ≤768에서 한 열로 쌓이고 sidebar는 가로 칸막이 띠가 된다.

### `.catrow` — 섹션 머리 = 카탈로그 행 [2 번호][7 제목][3 메타]
```html
<div class="catrow catrow--accent">
  <span class="catrow__no">PP-05</span>
  <h2 class="catrow__title">부품 32</h2>
  <span class="catrow__meta">부품 32 · 10.08 수정</span>
</div>
```
`--accent`/`--highlight`는 번호 칸 색, `--small`은 제목 축소. **가운데 정렬 섹션 머리·부제 금지.**
연속된 `.wall/.slab/.catrow/.crate-layout/.nav`는 맞닿은 3px 선이 자동으로 한 줄로 겹친다.

### 활자 유틸
| 클래스 | 용도 |
|---|---|
| `.t-mega` `.t-d1` `.t-d2` `.t-d3` | 디스플레이(Big Shoulders → 한글은 Gasoek). **32px 미만에 쓰지 말 것** |
| `.t-poster` | 한글을 Gasoek로 강제(32px 이상에서만) |
| `.t-num` | Big Shoulders 숫자(가격·잔여석·날짜) |
| `.t-h1` `.t-h2` `.t-h3` | Plex Sans KR 700 패널 제목 |
| `.t-label` | 한글 라벨: Plex Sans KR 12 / 700 / 자간 0 (`--font-label`). `.t-label--ko`는 이전 판 호환 별칭 |
| `.t-code` | 코드·숫자 라벨: Plex Mono 12 / 600 / +.08em / 대문자 / 단어 사이 -.2em — 한글이 없는 것만 |
| `.t-mono` `.t-muted` `.t-danger` `.t-success` `.t-sm` `.t-xs` `.t-right` `.mark`(옐로 형광) | |
| `.measure` | 읽는 글 최대 62ch |
| `.stack` `.cluster` `.split` `.gutter` `.flow` `.crop` | 배치 |
| `.deflist` | `<dl class="deflist"><dt>발행</dt><dd>판판레코드 디자인실</dd>…` 판권·메타 |
| `.vh` `.skip` `.kbd` | 숨김 텍스트 · 건너뛰기 · 키캡 |

### 시그니처 1 — `.sticker` (가격 스티커)
```html
<div class="card card--poster has-sticker"> … <span class="sticker sticker--pin">₩38,000</span></div>
```
- 색: 기본 옐로 / `--red`(매진·위험) / `--green` / `--cobalt` / `--plain`(종이).
- 크기: 기본 12px, `--lg` 14px, `--xl` 18px. 기울기는 형제 순서로 -4°/-2°/3° 자동 순환, 고정하려면 `.tilt-a|b|c`.
- `--pin`: 부모 오른쪽 위 모서리에 걸침(부모에 `position:relative` 필요 → `.has-sticker`). 왼쪽은 `--pin-left`.
- `--flat`: 회전·그림자 제거(표·리스트 안). `--stamp`: 등장 시 스탬프 모션.

### 그림자 규칙
`.press`(또는 `.btn`, `.card--poster`)만 6px 하드 섀도 + 프레스. 정적 패널·표·폼 그룹에 그림자 금지.

---

## 2. 장면 CSS에서 쓸 semantic 토큰

색: `--bg --surface --surface-2 --fg --fg-muted --rule --shadow-ink --accent --on-accent --highlight --on-highlight --link --focus --success-fill --on-success --success-fg --danger-fill --on-danger --danger-fg --warning-fill --on-warning --info-fill --on-info --invert --on-invert --slab-ink --on-slab-ink --slab-edge --disabled-fill --disabled-fg --print-ink --on-print-ink --print-paper --on-print-paper --print-red --print-yellow --print-cobalt --print-green --overlay`
합성: `--shadow --shadow-up --shadow-left --shadow-sticker --shadow-0 --line(3px 선) --line-thin(2px 선)`
치수(테마 무관): `--fs-* --font-display --font-poster --font-ui --font-mono --s-4…--s-120 --gutter --bw --bw-thin --off --rise --tab-h --tab-h-on --t-press --t-snap --t-stamp --ease-snap --ease-stamp --nav-h --sticky-top --z-*`

규칙: 색 면 위 글자는 항상 `--on-*`. 레드 면에 흰 글자 금지.

---

## 3. 컴포넌트 32 (알파벳순)

### accordion — 크레이트 칸막이 (펼친 머리만 12px 솟고 옐로)
```html
<div class="acc" data-accordion="single">           <!-- 여러 개 동시: data-accordion -->
  <div class="acc__item">
    <h3><button class="acc__head" id="q1" aria-expanded="true" aria-controls="a1">
      <span class="acc__idx">A</span><span class="acc__title">중고 등급은 누가 매기나요?</span>
      <span class="acc__icon" aria-hidden="true"></span></button></h3>
    <div class="acc__panel" id="a1" role="region" aria-labelledby="q1"><p>…</p></div>
  </div>
</div>
```
JS: 클릭 토글, `hidden` 동기화. 비활성 항목 `aria-disabled="true"`. 부제 `<span class="acc__sub">`(title 안).

### alert — 슬랩형 띠
```html
<div class="alert alert--warning" role="status">   <!-- --info --warning --danger(role="alert") --success -->
  <span class="alert__mark" aria-hidden="true">!</span>   <!-- 정보 i · 경고 ! · 위험 × · 성공 ✓ -->
  <div class="alert__body"><p class="alert__title">10월 15일(목) 매장 휴무</p><p class="alert__text">…</p>
    <div class="alert__actions"><a class="btn btn--sm" href="…">…</a></div></div>
  <button class="alert__close" type="button" aria-label="닫기" data-dismiss><svg …><path d="M5 5l14 14M19 5L5 19"/></svg></button>
</div>
```
`--slab`: 좌우 보더 없이 화면 폭 띠. JS: `[data-dismiss]` → 가장 가까운 `.alert`(또는 `[data-dismissible]`) 숨김.

### badge — 스티커 축소판
`<span class="badge badge--green"><span class="badge__mark"></span>재고 있음</span>`
색 `--yellow --red --green --cobalt --ink --muted`(기본 종이). `--grade`(등급 `NM` `VG+`, 모노 대문자) `--mono`(PP 번호) `--count`(숫자). 표·리스트 안은 그대로(회전 0). 카드 모서리에 붙일 땐 `--pin`(절대 위치 + 회전 + 3px 그림자) 또는 제자리 `--stuck`, 기울기 `.tilt-a|c`.

### breadcrumb
```html
<nav class="crumbs" aria-label="현재 위치"><ol>
  <li><a href="…">매장</a></li><li><a href="…">중고</a></li><li><a href="…">포크</a></li>
  <li><span aria-current="page">PP-0412</span></li></ol></nav>
```

### button
`<button class="btn btn--primary" type="button">장바구니에 담기</button>`
- 변형: `--primary`(레드) `--secondary`/기본(종이) `--highlight`(옐로) `--ghost`(보더만, 그림자 없음) `--danger`(잉크 면 + 레드 글자).
- 크기: 기본 48 · `--sm` 40(터치 44 보정) · `--lg` 56 · `--icon`(정사각, `aria-label` 필수) · `--block`.
- 내부: `<svg class="btn__icon">`, 보조 숫자 `<span class="btn__meta">2장</span>`.
- 상태: `disabled` / `aria-disabled="true"`, 로딩 `aria-busy="true"`(글자 숨기고 레코드 회전). 묶음 `.btn-row`.
- JS 시연: `data-busy-demo="1600"` → 클릭 시 1.6초 로딩, 같이 `data-toast…`가 있으면 끝난 뒤 토스트.

### calendar — 판판 라이브 공연 달력
```html
<div class="cal" data-calendar>
  <div class="cal__head">
    <p class="cal__title"><span class="cal__year">2026.10</span><span class="cal__sub">판판 라이브 4회</span></p>
    <button class="cal__nav" type="button" aria-label="이전 달"><svg …/></button>
    <button class="cal__nav" type="button" aria-label="다음 달"><svg …/></button>
  </div>
  <div class="cal__grid">
    <span class="cal__dow cal__dow--sun">일</span> … <span class="cal__dow">토</span>
    <span class="cal__day cal__day--muted"><span class="cal__num">28</span></span>
    <span class="cal__day cal__day--today"><span class="cal__num">10</span><span class="cal__event">오늘</span></span>
    <button class="cal__day cal__day--show" type="button" data-label="10월 24일(토) #118 흑백전화">
      <span class="cal__num">24</span><span class="cal__event">#118 흑백전화</span><span class="cal__seat">잔여 38석</span></button>
    <button class="cal__day cal__day--soldout" type="button" data-label="…">
      <span class="cal__num">3</span><span class="cal__event">#115 모래사장</span><span class="sticker sticker--red">매진</span></button>
    <span class="cal__day cal__day--closed"><span class="cal__num">6</span><span class="cal__event">정기 휴무</span></span>
  </div>
  <div class="cal__foot"><span class="cal__key cal__key--show">공연</span><span class="cal__key cal__key--soldout">매진</span><span class="cal__key cal__key--today">오늘</span><span data-cal-output></span></div>
</div>
```
42칸(6주) 또는 35칸을 채울 것(빈 칸 금지). JS: `button.cal__day` 클릭 → `aria-pressed` 단일 선택, `[data-cal-output]`에 `data-label` 표시, `pp:date` 이벤트. 월 이동 버튼은 JS 없음(링크로 바꾸거나 `aria-disabled`). ≤640에서 공연명·좌석은 숨고 색만 남는다.

### card — 정적 패널 / 포스터 링크 카드 / 앨범 커버
```html
<div class="card">                                  <!-- 정적: 보더만 -->
  <div class="card__head"><h3 class="card__title">매입 검수 대기</h3><span class="badge">C-03</span></div>
  <div class="card__body"><p class="card__text">…</p></div>
  <div class="card__foot">…</div>
</div>
<a class="card card--poster card--yellow" href="pages/product.html">   <!-- 포스터: 그림자 + 프레스 -->
  <span class="card__media"><span class="cover cover--heukbaek"><span class="cover__no">PP-0412</span><span class="cover__title">지하 3층</span></span></span>
  <span class="card__body"><span class="card__kicker">PP-0412</span><span class="card__title">흑백전화 〈지하 3층〉</span><span class="card__meta">12" 180g</span></span>
  <span class="sticker sticker--pin">₩38,000</span>
</a>
```
- 포스터 색 `--red --yellow --ink --cobalt`. 카드 안에 버튼이 따로 있으면 `<a>` 대신 `<div class="card card--poster">` + 제목에 `<a class="card__link">`(전체 덮음).
- 요소: `__kicker __title __title--display(32px+) __meta __text __price __media`. `--bare`(칸 안), `--alt`, 상태 `.is-selected`/`aria-selected`, `aria-disabled`.
- **`.cover`**(이미지 파일 대신 CSS 커버, 정사각) — **아티스트마다 한 벌**, 같은 그림을 다른 판에 돌려 쓰지 않는다:
  `cover--heukbaek`(흑백전화: 종이+잉크 가로 줄+레드 버튼) `--moraesajang`(모래사장: 옐로 하늘+종이 모래+썰물 자국) `--ohusesiban`(오후세시반: 코발트+기운 옐로 사각) `--natjam`(낮잠클럽: 잉크+수평선의 옐로 해) `--gimbap`(김밥천국단: 그린+김밥 단면) `--soeum`(소음주의보: 잉크+어긋난 레드 직선) `--panpan`(판판 자체 상품: 종이+잘린 레드 사각).
  같은 아티스트의 다른 판은 `.cover--alt`(색만 바뀐 한 벌). 자식 `.cover__no`, `.cover__title`(커버 폭 300px 이상이면 Gasoek, 아니면 Plex 700 자동). `--framed`는 3px 테두리. 커버 색은 `--print-*` 고정 토큰이라 다크에서도 그대로(인쇄물).
  손님이 찍은 **실물 사진**(재킷 닳음·라벨 클로즈업 등)은 앨범 커버가 아니라 장면 CSS의 회색 사진 자리(`inbox.css .photo`)로 그린다.

### carousel — 크레이트 넘기기
```html
<div class="flip" data-carousel aria-label="이번 주 입고">
  <div class="flip__stage">
    <div class="flip__item" data-title="흑백전화 〈지하 3층〉"><span class="cover cover--heukbaek">…</span></div>
    <div class="flip__item" data-title="모래사장 〈썰물〉"><span class="cover cover--moraesajang">…</span></div>
    …
  </div>
  <div class="flip__bar">
    <button class="flip__btn" type="button" data-carousel-prev aria-label="이전 판"><svg …><path d="M15 5l-7 7 7 7"/></svg></button>
    <div class="flip__caption" aria-live="polite"><span class="flip__name" data-carousel-name></span><span class="flip__count" data-carousel-count></span></div>
    <button class="flip__btn" type="button" data-carousel-next aria-label="다음 판"><svg …><path d="M9 5l7 7-7 7"/></svg></button>
  </div>
</div>
```
JS: `data-pos` 계산(현재 0, 뒤 1–3, 넘긴 판 past), 비현재 판 `inert`, `03 / 12` 표기, ←/→ 키, 스와이프. 시작 판은 `data-current`. 점 인디케이터 금지.

### code
```html
<div class="code">
  <div class="code__bar"><span class="code__file"><b>●</b>tokens.css</span>
    <button class="code__copy" type="button" data-copy><span data-copy-label>복사</span></button></div>
  <pre class="code__pre"><code><span class="code__line"><span class="tk-k">--red-500</span>: <span class="tk-n">#FF3B1F</span>;</span><span class="code__line code__line--hl">…</span></code></pre>
</div>
```
한 줄 = `.code__line`(줄번호 자동). 토큰 색 `.tk-k`(키·속성, 옐로) `.tk-s`(문자열) `.tk-n`(숫자·값) `.tk-f`(함수) `.tk-c`(주석). 강조 줄 `--hl`. 인라인은 `<code class="code-inline">`. JS: `[data-copy]` 복사 + "복사됨" 1.6초.

### command — ⌘K 팔레트 (body 끝에 1개)
```html
<div class="cmd" id="cmd" data-command hidden>
  <div class="cmd__backdrop" data-close></div>
  <div class="cmd__box" role="dialog" aria-modal="true" aria-label="판 찾기">
    <div class="cmd__field"><svg …/><input class="cmd__input" type="text" placeholder="앨범, 아티스트, PP 번호" aria-label="검색어"><span class="kbd">ESC</span></div>
    <ul class="cmd__list">
      <li class="cmd__group" role="presentation">판</li>
      <li class="cmd__item" data-href="pages/product.html" data-keywords="지하3층 흑백전화 lp">
        <span class="cmd__code">PP-0412</span><span class="cmd__name">흑백전화 〈지하 3층〉<span class="cmd__hint">12" 180g · ₩38,000</span></span><span class="badge badge--green">재고 40</span></li>
      <li class="cmd__group" role="presentation">바로 가기</li>
      <li class="cmd__item" data-theme-toggle><span class="cmd__code">THEME</span><span class="cmd__name">밝기 바꾸기</span><span class="kbd">T</span></li>
    </ul>
    <p class="cmd__empty" hidden>찾는 판이 없어요. 재입고 알림을 걸어 두세요.</p>
    <div class="cmd__foot"><span><span class="kbd">↑↓</span>이동</span><span><span class="kbd">↵</span>열기</span></div>
  </div>
</div>
```
여는 버튼: `[data-command-open]`(값 생략 시 첫 `[data-command]`). ⌘K / Ctrl+K 토글. JS: 필터(텍스트 + `data-keywords`), ↑↓ 선택, Enter/클릭 → `data-href` 이동, 아니면 항목 자체의 클릭 훅(`data-theme-toggle`, `data-toast…`, `data-modal-open` 등) 실행 후 닫힘. 포커스 트랩·Esc.

### drawer — 오른쪽 장바구니·필터·모바일 메뉴
```html
<div class="drawer" id="cart" hidden>                 <!-- 왼쪽: drawer--left -->
  <div class="drawer__backdrop" data-close></div>
  <aside class="drawer__panel" role="dialog" aria-modal="true" aria-labelledby="cart-t">
    <div class="drawer__head"><div class="drawer__heading"><p class="drawer__no">장바구니 · 2장</p><h2 class="drawer__title" id="cart-t">담은 판</h2></div>
      <button class="drawer__close" type="button" aria-label="닫기" data-close><svg …/></button></div>
    <div class="drawer__body">…</div>                 <!-- 패딩 0: drawer__body--flush -->
    <div class="drawer__foot"><p class="drawer__sum"><span>합계</span><b>₩57,000</b></p><button class="btn btn--primary btn--block" type="button">주문하기</button></div>
  </aside>
</div>
```
여는 버튼 `[data-drawer-open="cart"]`(가능하면 `aria-expanded="false"` 함께). **모바일 메뉴**는 같은 드로어에 `<ul class="drawer__nav"><li><a href="…" aria-current="page"><span>01</span>신보</a></li>…</ul>`를 `drawer__body--flush`에 넣고 navbar의 `.nav__burger`가 연다.

### empty — 빈 크레이트
```html
<div class="empty">                                    <!-- 가운데: empty--center, 작게: empty--sm -->
  <div class="empty__crate" aria-hidden="true"></div>
  <p class="empty__code">C-07 · 0장</p>
  <p class="empty__title">크레이트가 비었어요</p>
  <p class="empty__text">C-07에 넣을 판이 아직 검수 중이에요.</p>
  <a class="btn btn--sm" href="…">다른 크레이트 보기</a>
</div>
```

### form
```html
<form data-validate novalidate data-toast="success" data-toast-title="매입 견적 요청 접수" data-toast-text="한도윤 님이 내일까지 연락드려요.">
  <div class="form-grid">                                      <!-- 2단, ≤640 1단, 전폭: field--wide -->
    <div class="field">
      <label class="field__label" for="name">이름 <span class="field__req">필수</span></label>
      <input class="input" id="name" required autocomplete="name">
      <p class="field__hint">매장 픽업 시 확인해요.</p>
      <span class="field__error" hidden>이름을 적어 주세요</span>
    </div>
    <div class="field"><label class="field__label" for="g">장르</label>
      <div class="select"><select id="g"><option>재즈</option></select></div></div>
    <div class="field"><label class="field__label" for="p">매입가 <span class="field__aside">장당</span></label>
      <div class="affix"><span class="affix__pre">₩</span><input class="input input--mono" id="p" inputmode="numeric"></div></div>
    <div class="field field--wide"><label class="field__label" for="m">메모</label><textarea class="textarea" id="m"></textarea></div>
  </div>
  <div class="input-row"><input class="input" aria-label="쿠폰"><button class="btn" type="button">적용</button></div>
  <label class="check"><input type="checkbox"> 판 상태 사진 첨부</label>
  <label class="radio"><input type="radio" name="pick"> 매장 방문</label>
  <label class="switch"><input type="checkbox" role="switch" checked> 입고 알림 <span class="switch__state" data-on="켜짐" data-off="꺼짐">켜짐</span></label>
  <fieldset class="fieldset"><legend>좋아하는 장르</legend>
    <div class="choice-grid">
      <label class="choice"><input type="checkbox" name="genre" value="folk"><span class="choice__title">포크</span><span class="choice__text">모래사장 · 46장</span></label>
      …</div></fieldset>
  <div class="form-actions"><button class="btn btn--primary" type="submit">견적 요청</button></div>
</form>
```
- 입력 변형 `.input--mono` `.input--lg`, 상태 `disabled` `readonly` `aria-invalid="true"`(또는 `.field--error`).
- `.choice`(고르기 칸: 장르·수령 방법·요금제) — 체크/라디오 모두, 선택 시 옐로 면. 모서리 스티커 넣기 가능.
- 검색 폼: `<form role="search">` + `.input-row`.
- JS `form[data-validate]`: submit 시 `required`/type/pattern 검사 → `aria-invalid`, `.field--error`, 같은 `.field`(또는 `.fieldset`) 안 `.field__error` 표시 + `aria-describedby` 연결, 첫 오류에 포커스. 통과하면 submit 버튼 0.9초 로딩 → `data-toast*` 토스트 → `pp:valid` 이벤트. 입력하면 오류 해제. 스위치 `.switch__state` 글자 자동 변경.

### kanban — 매입 검수 보드
```html
<div class="board" data-kanban>
  <section class="board__col" aria-label="입고 대기">          <!-- 마지막 완료 열: board__col--done -->
    <header class="board__head">
      <h3 class="board__tab"><span class="board__idx">01</span><span class="board__name">입고 대기</span><span class="sticker board__count" data-count>2</span></h3>
      <span class="board__sum">₩96,000</span></header>
    <ul class="board__list">
      <li class="kcard" data-title="소음주의보 〈전파〉">
        <span class="kcard__no">C-07 · 매입 #2241</span><span class="kcard__title">소음주의보 〈전파〉</span><span class="kcard__artist">12" · 2019 초판</span>
        <span class="badge badge--grade badge--yellow badge--pin">VG</span>
        <span class="kcard__foot"><span class="kcard__who">한도윤</span><span>₩42,000</span></span></li>
    </ul>
    <!-- 비었을 때 표시할 문구(선택): <p class="board__empty">아직 없음</p> 를 board__list 뒤에 -->
  </section>
</div>
```
오늘 처리할 카드: `.kcard--flag` + 카드 안 첫 자식 `<span class="sticker sticker--red kcard__today">오늘<span class="vh"> 처리</span></span>`(왼쪽 위 모서리에 −2° 레드 스티커). **왼쪽 색 띠(사이드 스트라이프)는 쓰지 않는다** — 강조는 스티커 하나로. JS: `draggable`/`tabindex` 자동, 드래그(`.is-dragging`, 목록 `.is-over`), 키보드(Space/Enter 집기 → ←/→ 열 이동 · ↑/↓ 순서 → Space 내려놓기, Esc 취소), `[data-count]` 자동 갱신, 라이브 영역 안내. 열 이름은 `.board__name`에서 읽는다.

### list — 영수증형 룰 행
```html
<ol class="receipt">                                       <!-- 번호 없는 형: receipt--plain -->
  <li><a class="receipt__row" href="…">
    <span class="receipt__no">PP-0412</span>
    <span class="receipt__main"><span class="receipt__title">흑백전화 〈지하 3층〉 재발매</span><span class="receipt__sub">12" 180g · C-02</span></span>
    <span class="receipt__amt">₩38,000<small>1장</small></span></a></li>
  <li><div class="receipt__row receipt__row--total"><span class="receipt__no">합계</span><span class="receipt__main"><span class="receipt__title">3장</span></span><span class="receipt__amt">₩81,000</span></div></li>
</ol>
```
행은 `a` · `button` · `div` 모두 가능. 상태 `.is-selected`/`aria-current="true"`(옐로), `receipt__row--unread`(레드 사각 표식, 문의함), 금액 `receipt__amt--minus`.

### marquee — 사이트 최상단 1곳만
```html
<div class="marquee">
  <div class="marquee__viewport"><div class="marquee__track">
    <ul class="marquee__group">
      <li class="marquee__item"><b>오늘 입고</b>흑백전화 〈지하 3층〉 재발매 180g 40장</li>
      <li class="marquee__item"><b>공연</b>10월 24일(토) 판판 라이브 #118 흑백전화 · 잔여 38석</li>
      <li class="marquee__item"><b>매입</b>중고 LP 매입 접수 화·목 13:00–19:00</li>
    </ul>
  </div></div>
  <button class="marquee__toggle" type="button" data-marquee-toggle aria-pressed="false" aria-label="흐르는 소식 정지"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 4h4v16H6zM14 4h4v16h-4z"/></svg><span>정지</span></button>
</div>
```
묶음은 1개만 쓴다(JS가 `aria-hidden` 복제본 생성). hover/focus 일시정지, 정지 버튼, reduced-motion이면 멈춘 한 줄. 항목이 짧으면 화면폭보다 넓게 6개 이상.

### menu — 떠 있는 리스트
```html
<div class="menu-wrap">
  <button class="btn btn--sm" type="button" data-menu-trigger aria-haspopup="menu" aria-controls="m-order">주문 관리</button>
  <div class="menu" id="m-order" role="menu" hidden>          <!-- 오른쪽 정렬: menu--end, 위로: menu--up -->
    <div class="menu__label" role="presentation">PP-0412</div>
    <button class="menu__item" role="menuitem" type="button"><svg …/>픽업으로 변경<span class="menu__key">P</span></button>
    <hr class="menu__sep">
    <button class="menu__item menu__item--danger" role="menuitem" type="button"><span></span>주문 취소</button>
  </div>
</div>
```
항목 그리드는 [아이콘 20][이름][단축키] — 아이콘이 없으면 빈 `<span></span>`. 체크형 `role="menuitemcheckbox" aria-checked="true"`. JS: 클릭/↓로 열기, ↑↓ Home End 이동, Esc·바깥 클릭·Tab 닫기, 항목 선택 시 닫힘(`data-keep-open`으로 유지), 오른쪽 넘침 자동 `menu--end`.

### modal — 위쪽에 찍히는 확인창
```html
<div class="modal" id="m-book" hidden>                       <!-- 넓게: modal--wide, 잉크 머리: modal--ink -->
  <div class="modal__backdrop" data-close></div>
  <div class="modal__box" role="dialog" aria-modal="true" aria-labelledby="m-book-t">
    <div class="modal__head"><div class="modal__heading"><p class="modal__no">판판 라이브 #118</p><h2 class="modal__title" id="m-book-t">2석 예매할까요?</h2></div>
      <button class="modal__close" type="button" aria-label="닫기" data-close><svg …/></button></div>
    <div class="modal__body">…</div>
    <div class="modal__foot"><button class="btn" type="button" data-close>다시 고르기</button><button class="btn btn--primary" type="button">₩56,000 결제</button></div>
  </div>
</div>
```
여는 버튼 `[data-modal-open="m-book"]`. 제목은 32px 디스플레이(짧게, 2줄 이내). 초기 포커스는 `[data-autofocus]` → 없으면 첫 포커스 요소. 포커스 트랩·Esc·배경 클릭 닫기·트리거로 포커스 복귀·스크롤 잠금. `pp:open`/`pp:close` 이벤트.

### motion — 모션 시연 칸
```html
<div class="mo">
  <div class="mo__name"><span class="mo__title">프레스</span><span class="mo__token">--t-press 90ms</span></div>
  <div class="mo__stage"><span class="mo__obj mo__obj--press" id="mo-press">담기</span></div>
  <div class="mo__foot"><span class="mo__note">올라왔다 박힌다</span><button class="btn btn--sm" type="button" data-motion-play="mo-press">재생</button></div>
</div>
```
물체: `mo__obj--press` · `--stamp` · `--rise` · `--spin`(안에 `<span class="spin spin--xl"></span>`, 버튼은 `aria-pressed`로 정지/재생). 프레스 3프레임: `<div class="filmstrip"><div class="filmstrip__frame"><button class="btn btn--primary is-hover">…</button><span class="filmstrip__cap">02 -2,-2 / 8px</span></div>…` (`.is-hover`, `.is-pressed` 고정 상태).

### navbar — 룰 그리드 한 줄 (정본 8칸, 모든 화면 같은 한 벌)
```html
<header class="nav">
  <a class="nav__brand" href="index.html" aria-label="판판레코드 하우스 스타일 북 처음으로"><span class="nav__mark">PANPAN</span><span class="nav__sub">판판레코드 · 망원</span></a>
  <ul class="nav__links">                                     <!-- 반드시 두 번째 자식 -->
    <li><a class="nav__link" href="pages/dashboard.html"><span>01</span>운영</a></li>
    <li><a class="nav__link" href="pages/inbox.html"><span>02</span>문의</a></li>
    <li><a class="nav__link" href="pages/kanban.html"><span>03</span>검수</a></li>
    <li><a class="nav__link" href="pages/onboarding.html"><span>04</span>가입</a></li>
    <li><a class="nav__link" href="pages/pricing.html"><span>05</span>구독</a></li>
    <li><a class="nav__link" href="pages/product.html" aria-current="page"><span>06</span>상품</a></li>
    <li><a class="nav__link" href="pages/profile.html"><span>07</span>수집가</a></li>
    <li><a class="nav__link" href="pages/settings.html"><span>08</span>설정</a></li>
  </ul>
  <button class="nav__search" type="button" data-command-open>…<span>판 찾기</span>…<span class="kbd">⌘K</span></button>
  <button class="nav__btn nav__theme" type="button" data-theme-toggle aria-label="다크 모드"><svg class="i-moon" …/><svg class="i-sun" …/></button>
  <button class="nav__btn nav__burger" type="button" data-drawer-open="nav-drawer" aria-label="메뉴 열기" aria-expanded="false"><svg …/></button>
</header>
```
- 번호는 index '장면 9'의 번호와 같다(01 dashboard … 08 settings, 09 404는 메뉴에 넣지 않고 바닥글·드로어에만). pages 안에서는 `href="dashboard.html"`처럼 상대 경로, 워드마크는 `../index.html`.
- 현재 화면은 `aria-current="page"` → 옐로 칸. 404·스타일 북에는 현재 칸 없음.
- 메뉴 칸들이 남는 폭을 나눠 가진다(flex 1) → 1440에서 빈 칸이 생기지 않는다.
- sticky top 0. ≤768에서 링크 숨김 → 버거가 드로어(`#nav-drawer` 안 `.drawer__nav`)를 연다 — **버거와 드로어를 반드시 같이 넣을 것**. 드로어 목록은 아래 바닥글 지도와 같은 10칸(00 스타일 북 … 09 팔린 판).

### site-foot — pages 공통 바닥글 (navbar.css)
```html
<footer class="wall site-foot">          <!-- main 바로 뒤. 위 여백 없이 마지막 섹션 3px 선에 붙는다 -->
  <div class="span-7 cell--ink site-foot__shop">
    <p class="site-foot__mark" aria-hidden="true">PANPAN</p>
    <div class="site-foot__info">
      <address class="site-foot__addr"><b>판판레코드 망원</b>서울 마포구 망원로7길 41, 지하 1층<br>판판 라이브 매월 4회 · 안쪽 40석</address>
      <dl class="site-foot__hours"><dt>화–목</dt><dd>13:00–21:00</dd><dt>금</dt><dd>13:00–23:00</dd><dt>토</dt><dd>12:00–21:00</dd><dt>일</dt><dd>12:00–20:00</dd><dt>월</dt><dd>정기 휴무</dd><dt>매입</dt><dd>화·목 13:00–19:00</dd></dl>
    </div>
  </div>
  <nav class="span-5 cell--flush site-foot__map" aria-label="판판레코드 모든 화면">
    <p class="site-foot__label">판판레코드 지도 · 10칸</p>
    <ol class="site-foot__list">
      <li><a href="../index.html"><span>00</span>스타일 북</a></li>
      <li><a href="dashboard.html" aria-current="page"><span>01</span>운영 보드</a></li> …(02 문의함 03 검수 보드 04 회원 가입 05 정기 구독 06 상품 〈지하 3층〉 07 수집가 김하람 08 매장 설정 09 팔린 판)
    </ol>
  </nav>
</footer>
```
페이지 CSS에서 `.site-foot`에 margin을 주지 않는다(`main + .site-foot`이 −3px로 선을 합친다).

### pagination — 칸막이 손잡이 번호
```html
<nav class="pager" aria-label="목록 페이지">
  <a class="pager__step" href="…" aria-label="이전 페이지"><svg …/><span>이전</span></a>   <!-- 처음: aria-disabled="true" -->
  <ol class="pager__list">
    <li><a class="pager__tab" href="…">01</a></li>
    <li><a class="pager__tab" href="…" aria-current="page">02</a></li>
    <li class="pager__far"><a class="pager__tab" href="…">03</a></li>   <!-- ≤480 숨김 -->
    <li><span class="pager__gap">…</span></li>
    <li><a class="pager__tab" href="…">12</a></li>
  </ol>
  <a class="pager__step" href="…" aria-label="다음 페이지"><span>다음</span><svg …/></a>
  <span class="pager__info">412장 중 25–48</span>
</nav>
```

### popover — 스티커형 말풍선
```html
<div class="pop-wrap">
  <button class="btn btn--sm btn--ghost" type="button" data-popover-trigger aria-controls="pop-grade">등급표</button>
  <div class="popover" id="pop-grade" role="dialog" aria-label="중고 등급" hidden>        <!-- 옐로: popover--yellow, 아래 정렬: popover--below -->
    <div class="popover__head"><div><p class="popover__no">GRADE</p><p class="popover__title">VG+는 이런 판</p></div>
      <button class="popover__close" type="button" aria-label="닫기" data-close><svg …/></button></div>
    <p>잔기스는 보이지만 재생 시 튀지 않아요.</p>
    <div class="popover__foot">…</div>
  </div>
</div>
```
JS: 토글, 첫 포커스 요소로 이동, Esc·바깥 클릭 닫기, 오른쪽 넘침 시 `popover--flip`. ≤480은 아래 왼쪽 정렬.

### progress — 막대 · 좌석
```html
<div class="meter">                                       <!-- 채움 색: meter--success/--warning/--info, 스티커 없이: meter--plain -->
  <div class="meter__head"><span class="meter__label" id="mt">이번 달 매출</span><span class="meter__value">₩18,420,000 / ₩20,000,000</span></div>
  <div class="meter__bar" role="progressbar" aria-labelledby="mt" aria-valuenow="92" aria-valuemin="0" aria-valuemax="100">
    <div class="meter__fill"></div><span class="meter__tag sticker" data-auto>92%</span></div>
</div>
<div class="seats">
  <p class="seats__sum"><span class="seats__big">38</span><span class="seats__of">/ 40석 남음 · #118</span></p>
  <p class="seats__stage" aria-hidden="true">무대</p>
  <div class="seats__grid" data-seats="40" data-taken="9,10" data-mine="21"></div>
</div>
```
JS: `aria-valuenow` → `--val` 폭 계산, `data-auto` 스티커는 % 자동. `Panpan.setProgress(barEl, 값)`. 불확정 로딩은 `.meter[aria-busy="true"]`. 좌석 칸은 JS가 생성(20열, ≤480 10열), `data-taken`/`data-mine`은 좌석 번호 목록.

### sidebar — 세로 칸막이
```html
<nav class="side" aria-label="설정 메뉴">                  <!-- 규칙선 위(crate-layout__index, 벽보 칸 경계)에 놓으면 side--bare -->
  <ul class="side__group">
    <li class="side__label">매장</li>
    <li><a class="side__item" href="…"><span class="side__idx">01</span>영업시간</a></li>
    <li><a class="side__item" href="…" aria-current="page"><span class="side__idx">02</span>공연 예매<span class="side__count">3</span></a></li>
  </ul>
</nav>
```
항목 그리드 [인덱스 32][이름][개수]. 활성(`aria-current` 또는 `.is-active`)은 오른쪽 선을 넘어 12px 튀어나온다 → 부모가 `overflow:hidden`이면 안 됨. ≤768 가로 칸막이 띠로 바뀜(아래 선이 필요하면 `side--bar`). 문의함 폴더 같은 탭형 필터도 이걸로. 항목 높이는 `--tab-h` 44 / 활성 `--tab-h-on` 56. **≤480에서 항목이 4개 이상이면 `side--grid`** — 가로 띠가 오른쪽에서 말없이 잘리지 않게 칸막이를 줄바꿈(열 수 `--side-cols`, 기본 2, 문의함 폴더 3).

### skeleton
```html
<div class="skel-row" aria-busy="true"><span class="skel-label">불러오는 중</span>
  <span class="skel skel--avatar"></span>
  <div class="skel-stack"><span class="skel skel--title"></span><span class="skel skel--line"></span><span class="skel skel--line skel--short"></span></div>
</div>
```
조각: `--line --short --title --price --square --avatar --btn`. shimmer 없음(0.9s 명도 토글).

### spinner — 레코드
`<span class="spin-wrap" role="status"><span class="spin"></span><span class="spin__label">불러오는 중</span></span>`
크기 `spin--sm`(20) 기본(40) `--lg`(72) `--xl`(120). 큰 영역용 `.spin-block`. 라벨은 항상 같이(reduced-motion에서 회전 멈춤).

### steps — 예매 단계
```html
<ol class="steps">
  <li class="steps__item steps__item--done"><span class="steps__no">1</span><span class="steps__name">좌석</span><span class="steps__meta">C-3, C-4</span></li>
  <li class="steps__item" aria-current="step"><span class="steps__no">2</span><span class="steps__name">정보</span></li>
  <li class="steps__item"><span class="steps__no">3</span><span class="steps__name">결제</span></li>
  <li class="steps__item"><span class="steps__no">4</span><span class="steps__name">완료</span></li>
</ol>
```
`--done`(잉크 반전 + ✓) / `aria-current="step"`(옐로 + 12px 솟음) / `--error`(레드). 완료 단계로 돌아가기 링크는 `<a class="steps__item steps__item--done">`.

### table — 매출·주문 표
```html
<div class="tbl-wrap">                                    <!-- 칸 안: tbl-wrap--bare -->
  <table class="tbl tbl--stack" data-table-select data-count-target="sel-count">   <!-- 촘촘: tbl--compact, 줄무늬: tbl--zebra -->
    <caption>오늘 주문 12건 · <span id="sel-count">선택 없음</span></caption>
    <thead><tr>
      <th class="tbl__check"><input class="tbl-check" type="checkbox" aria-label="전체 선택"></th>
      <th scope="col" aria-sort="none"><button class="tbl__sort" type="button">번호</button></th>
      <th scope="col">앨범</th>
      <th scope="col" class="num" aria-sort="descending"><button class="tbl__sort" type="button">금액</button></th>
    </tr></thead>
    <tbody>
      <tr><td class="tbl__check"><input class="tbl-check" type="checkbox" aria-label="PP-0412 선택"></td>
        <td class="mono" data-label="번호">PP-0412</td>
        <td class="tbl__wide" data-label="앨범">흑백전화 〈지하 3층〉<span class="tbl__sub">12" 180g</span></td>
        <td class="num" data-label="금액" data-sort="38000">₩38,000</td></tr>
    </tbody>
  </table>
</div>
```
- 숫자 열 `.num`(머리 th에도), 코드 열 `.mono`, 행 작업 열 `.tbl__act`, 선택 `aria-selected="true"`/`.is-selected`, 비활성 행 `.is-disabled`, 합계 `<tfoot>`.
- 정렬: `th[aria-sort]` 안 `.tbl__sort` 버튼 → JS가 오름/내림 토글(숫자는 ₩·쉼표·원·장·석·% 제거 후 비교, 값 지정은 `data-sort`).
- 선택: `table[data-table-select]` + `.tbl-check` → 전체/부분(indeterminate) 동기화, 행 `aria-selected`, `data-count-target` 요소에 "N건 선택".
- ≤640 `.tbl--stack`: 행이 2단 정의 목록 → **모든 td에 `data-label` 필수**, 넓은 칸 `.tbl__wide`.
- ≤640 **전표 행**(주문·매출 표 권장): 번호 칸에 `.tbl__key`, 상태 칸에 `.tbl__state`를 붙이면 라벨 없이 3줄 전표로 쌓인다 — `[체크 44] [번호·시각 / 제목(.tbl__wide) 굵게 / 나머지 칸] [상태 위 · 금액(.num) 아래]`. 라벨은 화면에서만 숨고 읽기 프로그램에는 남는다. 합계 `<tfoot>`은 한 줄.

### tabs — 가로 칸막이
```html
<div class="tabs" data-tabs>                               <!-- 패널 테두리 없이: tabs--bare -->
  <div class="tabs__list" role="tablist" aria-label="장르">
    <button class="tabs__tab" role="tab" id="tab-folk" aria-controls="pn-folk" aria-selected="true"><span class="tabs__idx">A</span>포크<span class="tabs__count">46</span></button>
    <button class="tabs__tab" role="tab" id="tab-shoe" aria-controls="pn-shoe"><span class="tabs__idx">B</span>슈게이즈</button>
  </div>
  <div class="tabs__panel" role="tabpanel" id="pn-folk" aria-labelledby="tab-folk" tabindex="0">…</div>
  <div class="tabs__panel" role="tabpanel" id="pn-shoe" aria-labelledby="tab-shoe" tabindex="0" hidden>…</div>
</div>
```
JS: roving tabindex, ←/→ Home End 자동 활성(비활성 탭 건너뜀), `hidden` 동기화, `pp:tab` 이벤트. 세로 탭 목록은 `aria-orientation="vertical"`(↑/↓).

### timeline — 연혁·주문 추적
```html
<ol class="tl">                                           <!-- 데스크톱 가로형: tl--row -->
  <li class="tl__item tl__item--done"><span class="tl__date">10.08 14:02</span><span class="tl__title">주문 접수</span><span class="tl__text">…</span></li>
  <li class="tl__item tl__item--current"><span class="tl__date">10.09 09:10</span><span class="tl__title">배송 중</span></li>  <!-- "지금" 스티커 자동 -->
  <li class="tl__item tl__item--todo"><span class="tl__date">예정</span><span class="tl__title">도착</span></li>
</ol>
```

### toast — 스탬프로 찍히는 알림
마크업 없이 트리거만:
`<button class="btn" type="button" data-toast="success" data-toast-title="장바구니에 담았어요" data-toast-text="흑백전화 〈지하 3층〉 · ₩38,000" data-toast-no="PP-0412">담기</button>`
톤 `data-toast=""`(옐로) `success` `danger`(role=alert) `info` `plain`. 코드: `Panpan.toast({ title, text, tone, no, duration })`(`duration: 0`이면 자동 닫힘 없음). 4.5초 뒤 즉시 사라짐, hover/focus 동안 정지, 최대 3개. 위치: 우상단(≤480 하단). `.toast-zone`은 JS가 만든다.

### tooltip — 소형 옐로 스티커
```html
<span class="tip">                                         <!-- 아래로: tip--below, 오른쪽 기준: tip--end -->
  <button class="tip__term" type="button" aria-describedby="tip-vg">VG+</button>
  <span class="tip__bubble" role="tooltip" id="tip-vg">재생 시 잡음이 조금 있지만 튀지 않는 상태</span>
</span>
```
hover/focus 300ms 지연, Esc로 숨김. 대상이 버튼이면 `.btn`을 그대로 써도 된다. 아이콘 버튼의 이름을 툴팁에만 의존하지 말 것(`aria-label` 별도).

---

## 4. app.js 훅 요약

| 속성 / 선택자 | 동작 |
|---|---|
| `[data-theme-toggle]` | 라이트↔다크, localStorage 저장, `aria-pressed` |
| `[data-modal-open="id"]` `[data-drawer-open="id"]` `[data-close]` | 열기 / 닫기(가장 가까운 모달·드로어·커맨드·팝오버·메뉴) |
| `[data-command]` `[data-command-open]` ⌘K | 커맨드 팔레트 |
| `[data-menu-trigger]` `[data-popover-trigger]` (+ `aria-controls`) | 떠 있는 레이어 |
| `[data-tabs]` `[data-accordion]` `[data-carousel]` `[data-calendar]` `[data-kanban]` | 각 컴포넌트 초기화 |
| `table[data-table-select]` `.tbl__sort` | 표 선택·정렬 |
| `form[data-validate]` | 검증 + 성공 토스트 |
| `[data-toast]` `[data-busy-demo]` `[data-dismiss]` `[data-copy]` `[data-motion-play]` `[data-marquee-toggle]` `[data-seats]` | 시연 동작 |
| `window.Panpan` | `toast()` `setProgress()` `setTheme()` `open(id)` `close(id)` `init(scope)` |

Esc는 맨 위 레이어부터 닫는다. 모달·드로어·커맨드는 포커스 트랩 + `html.is-locked` 스크롤 잠금.

---

## 5. 쓰지 말 것 (이 시스템에서 깨지는 것)

- `.wall` 행 스팬 합 ≠ 12, 카드 사이 `gap`, 가운데 정렬 섹션 머리, 정적 패널에 그림자.
- 32px 미만 Gasoek(`.t-d*`, `.t-poster`, `--font-display`/`--font-poster` 직접 지정 포함).
- 점·격자·노이즈·radial 배경, 그라디언트, blur, opacity 페이드, 스크롤 리빌.
- 캐러셀 점 인디케이터, 브라우저 창 목업, 통계 숫자 4개 가로줄.
- 사이드 스트라이프(카드·인용·필드 왼쪽 색 띠/inset 그림자 막대)로 강조하기 — 강조는 시그니처 1(스티커)로.
- 떠 있는 부품(메뉴·모달·드로어·커맨드)을 스펙 시트에서 버튼만 두고 설명 한 줄로 때우기 — 열린 상태 정지 견본(index.css `.spec`)을 같이 둔다. 견본에는 `.modal`/`.drawer`/`.cmd`/`.marquee` 루트 클래스를 쓰지 않는다(app.js가 숨기거나 움직인다) — 안쪽 클래스(`.modal__box`, `.drawer__panel`, `.cmd__box`, `.marquee__group`)만.
- 모바일 검증: `docs/design-v2/shot.sh`는 폭 500 미만이면 iframe으로 진짜 뷰포트를 만든다. 라이트 확인은 반드시 `theme=light`를 넘길 것(안 넘기면 시스템 다크를 따라간다).
