# COMPONENTS — 여백미술관 YEOBAEK v2 마크업 계약

> 기준은 `DIRECTION.md`다. 이 문서는 "그 기준을 HTML로 어떻게 쓰는가"만 적는다.
> 장면(index·pages) 작성자는 **3절 셸 스니펫을 그대로 복사**하고, 경로와 현재 표시(`aria-current`)만 바꾼다.
> 값(날짜·주소·가격·인물·ID)은 DIRECTION.md 2절 팩트 시트에 있는 것만 쓴다. 오늘 = 2026년 10월 11일(일) 15:40.

목차: 0 페이지 뼈대 · 1 레이아웃 문법 · 2 장면 CSS용 토큰 · 3 공통 셸 · 4 컴포넌트 32 · 5 열린 상태 견본 · 6 app.js 계약 · 7 반응형·접근성 · 8 쓰지 말 것

---

## 0. 페이지 뼈대 (모든 HTML 공통)

```html
<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>오늘의 전시장 — 여백미술관</title>
<script>(function(){try{var q=new URLSearchParams(location.search).get('theme');var s=localStorage.getItem('yeobaek-theme');var t=(q==='dark'||q==='light')?q:(s==='dark'||s==='light')?s:(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.setAttribute('data-theme',t);}catch(e){document.documentElement.setAttribute('data-theme','light');}})();</script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Gothic+A1:wght@100;200;300;400;600;800&family=Host+Grotesk:wght@300;400;600&family=JetBrains+Mono:wght@400&display=swap">
<link rel="stylesheet" href="../styles.css">        <!-- index 는 styles.css -->
<link rel="stylesheet" href="dashboard.css">        <!-- 장면 CSS 1개: index 는 index.css, 페이지는 pages/<name>.css -->
</head>
<body>                                              <!-- 학예실·계정 화면(dashboard·inbox·kanban·settings)은 <body class="app"> -->
  <!-- 3-1 navbar -->
  <main id="main"> … </main>                         <!-- app 화면은 3-3 사이드바 구조 안의 main -->
  <!-- 3-2 footer -->
  <!-- 3-4 커맨드 팔레트 (body 끝, id="command" 고정) -->
<script src="../app.js"></script>                    <!-- index 는 app.js -->
</body>
</html>
```

- 테마 결정 순서: `?theme=dark|light` → `localStorage['yeobaek-theme']` → 시스템. 인라인 스크립트는 위 한 줄만 허용(FOUC 방지). 그 외 인라인 스크립트·onclick 금지.
- `<title>`은 "장면 이름 — 여백미술관". index는 `한 가지 색의 두께 — 여백미술관 전시 도록`.
- 폰트: Gothic A1(한글 전부, 대형 숫자 100), Host Grotesk(라틴·숫자), JetBrains Mono(소장품 번호·시각). 세리프·이탤릭 0. 굵기는 100/200/300/400/600/800만.

---

## 1. 레이아웃 문법 (base.css)

### 1-1. 벽 `.wall` + 그리드 `.grid`
페이지는 섹션이 아니라 **벽의 연속**이다.
```html
<section class="wall" aria-labelledby="room1-t">
  <div class="grid">
    <div class="at-1 w-6"> … </div>          <!-- 1단에서 시작, 6단 차지 -->
    <figure class="work work--aside at-8 w-5"> … </figure>
  </div>
</section>
```
| 클래스 | 뜻 |
|---|---|
| `.wall` | 최대 1440, 바깥 여백 120(1440) / 48(≤1024) / 20(≤640). `.wall + .wall` 사이 240 / 160 / 120 |
| `.wall--bleed` | 풀블리드(블랙박스 방, 교정띠 실물 판, 출품 목록 전폭 표) |
| `.wall--room` | 면이 칠해진 방의 위아래 144(모바일 96) 패딩. 블랙박스: `<section class="wall--room" data-theme="dark">` 안에 `.wall` |
| `.wall--tight` | 바로 앞뒤 벽 간격을 96으로(같은 전시실 안의 두 번째 벽) |
| `.grid` | 12단(거터 24) → ≤640 4단(거터 16). 행 간격 48 / 32 |
| `.grid--base` | 칸들의 **아랫변** 정렬(제목과 도판의 기준선 맞추기) |
| `.grid--hang` | 칸들의 **세로 중심** 정렬(살롱 걸이) |
| `.at-1`…`.at-12` / `.w-1`…`.w-12` | 시작 단 / 차지 단. 작품은 8단을 넘지 않는다(블랙박스·출품 목록 제외) |
| `.t-at-*` `.t-w-*` | ≤1024 덮어쓰기(필요할 때만) |
| `.m-at-1`…`4` / `.m-w-1`…`4` | ≤640 덮어쓰기. 지정하지 않으면 모바일에서 전폭 |
| `.self-end` `.self-center` `.self-start` | 칸 단위 정렬 |

규칙: 화면 가운데 정렬 금지 · 같은 시작 단을 두 벽 연속으로 쓰지 않는다 · 빈 여백 안에는 기준점(작품 번호·캡션·걸이선) 하나.

### 1-2. 걸이선 `.hang-line`
```html
<div class="grid grid--hang hang-line"> … </div>
```
그리드 세로 중앙에 1px `--rule-faint` 수평선(미술관 걸이 높이). 선 위에 걸린 글자 버튼은 자동으로 벽색 바탕, 다른 요소는 `.on-wall`을 붙인다. 390에서는 선이 사라진다(살롱 1열). **index 1전시실 벽에서만** 쓴다.

### 1-3. 캡션 `.cap` — 시그니처 A (4줄 고정)
```html
<figcaption class="cap">
  <span class="cap__l1"><span class="cat">Cat. 07</span><b class="cap__who">권무영</b></span>
  <span class="cap__l2">「묘법 반복 12」, 1977</span>
  <span class="cap__l3">종이에 흑연</span>
  <span class="cap__l4">76 × 56 cm · <span class="mono">YB 2019.014</span></span>
</figcaption>
```
① 번호 + 작가(800) ② 「제목」, 연도 ③ 재료·기법 ④ 크기 · 소장 번호. 제목은 이탤릭이 아니라 낫표 「」. 위젯·상품·카드 등 **모든 의미 있는 대상**이 이 형식을 따른다(번호 자리에 `W-03`, `L-2027-02`, `p. 120` 등). 반전 면 위에서는 `.cap--invert`.

### 1-4. 교정띠 — 시그니처 B
```html
<span class="gs" aria-hidden="true"></span>                 <!-- 8px 띠 (도판 아래 "기록 사진" 표시) -->
<span class="gs gs--lg" aria-hidden="true"></span>          <!-- 24px -->
<div class="gs-scale" aria-hidden="true"><span></span>×11</div>   <!-- 칸마다 A 1 2 3 4 M 6 7 8 9 B 라벨 -->
```
A→B 11칸, 칸 사이 간격 0. 다크에서도 같은 값(작품과 같은 규칙). 진행·스피너·스켈레톤·단계·게이지·히트맵이 모두 이 띠를 쓴다.

명도 칸 `.tone-0`…`.tone-10`(배경 + 자동 글자색) · 히트맵 `.heat.heat--8|7|11` — **칸마다 숫자를 인쇄**한다:
```html
<div class="heat heat--8"><span class="tone-2">96</span><span class="tone-4">148</span> … </div>
```
값 → 칸 매핑은 장면에서 정한다(예: 0–11 구간을 균등 분할). 범례는 `.gs-scale--sm`.

### 1-5. 도판(CSS 작품) `.plate`
```html
<div class="plate plate--ink plate--portrait" role="img" aria-label="권무영 「무제 74-3」 — 검은 유채 면에 가는 가로 결"></div>
```
| 작품 | 클래스 | 비율 기본 |
|---|---|---|
| Cat. 01 권무영 유채 | `.plate--ink` | 정사각 |
| Cat. 07 흑연 사선 | `.plate--graphite` | `.plate--tall` 권장 |
| Cat. 14 흑연 가로선 | `.plate--line` | |
| Cat. 19 염선희 한지 겹 | `.plate--paper` | |
| Cat. 30 차경민 사진 | `.plate--window` | `.plate--photo` |
| Cat. 41 나은솔 영상 | `.plate--video` | `.plate--film` |
| Cat. 52 윤태오 흑철 | `.plate--steel` | `.plate--column` |
| Cat. 64 작업 노트 | `.plate--notes` | `.plate--wide` |
비율: `.plate--sq` `--portrait`(130/162) `--tall`(56/76) `--wide`(4/3) `--photo` `--film`(16/9) `--column`(1/2). 다크에서 도판은 같은 톤을 유지하고 1px 테두리, 검은 작품(ink·video)은 한 단 밝은 판(#1F1F1F) 위에 놓인다(자동).

### 1-6. 활자·기호 유틸
| 클래스 | 쓰임 |
|---|---|
| `.numeral` | Gothic A1 100, `clamp(120px,18vw,280px)` — 표지 `64`, 404, 대시보드 `1,284`, 생몰년. 숫자만 |
| `.t-title` | 전시 제목(Gothic A1 200, 최대 76px) |
| `.t-room` | 전시실·페이지 제목(300, 최대 44px). **각 페이지 h1은 `.t-room` 또는 `.t-title`** |
| `.t-h3` `.t-lead` `.t-ui` `.t-caption` `.t-2` `.t-3` `.t-heavy` | 작은 제목, 서문(300 20px 1.85), UI 15px, 캡션 13px, 2·3차 색, 800 |
| `.prose > p`, `.measure` | 본문 단 30em(약 32자) |
| `.cat` | `Cat. 07` Host 600 12px 0.06em — **라틴·숫자에만** |
| `.num` | Host + tnum(금액·수치). `.won` 금액 줄바꿈 금지 |
| `.mono` | `YB 2019.031`, `L-2026-07`, `15:40` |
| `.latin` | `YEOBAEK` 같은 라틴 워드 |
| `.loc` | **모든 h1 위 장면 위치 한 줄** `<p class="loc"><span>3층</span><span>제4전시실 「기록」</span></p>` (구분 `·` 자동). `Room 2` 같은 라틴 금지 |
| `.link` | 밑줄이 왼→오로 자라는 텍스트 링크. `.link--quiet`(2차 색), `.link--rest`(평소 밑줄) |
| `.sym--ok|warn|error|info` | `■ 정상` `◩ 주의` `▲ 기준 초과`(반전 블록) `□ 대기` — 유채색 없이 기호 + 문구 |

---

## 2. 장면 CSS에서 쓸 semantic 토큰

장면 CSS(`index.css`, `pages/*.css`)는 아래 토큰만 쓴다(raw hex 금지). 다크 값을 따로 만들지 않는다.

| 토큰 | 쓰임 |
|---|---|
| `--bg` `--surface` `--surface-2` | 벽 / 벽의 그늘 / 눌린 면 |
| `--text` `--text-2` `--text-3` `--text-disabled` | 본문 / 캡션 / 보조(surface 위 14px 이하 금지) / 비활성 |
| `--rule-faint` `--rule` `--rule-strong` | 장식선 / 입력·표 경계 / 2px 머리·활성 |
| `--invert-bg` `--invert-text` `--invert-text-2` | 선택·눌림·주 버튼·경보 (다크에서 넓은 면 금지) |
| `--tone-0`…`--tone-10`, `--gs-strip` | 교정띠·작품 명도(모드 무관) |
| `--plate-ink` `--plate-deep` `--plate-mid` `--plate-light` `--plate-paper` `--plate-white` `--plate-edge` | CSS 작품을 새로 그릴 때 |
| `--scrim` `--lights-bg` | 오버레이 / 소등 |
| `--sp-1`…`--sp-11` (4·8·12·16·24·32·48·64·96·144·240) | 여백 |
| `--fs-*` `--lh-*` `--fw-*` `--ff-*` | 활자 |
| `--wall-margin` `--wall-gutter` `--wall-gap` `--nav-h` `--side-w` `--touch` `--row` `--row-dense` | 치수 |
| `--ease-light` `--ease-out` `--dur-hover|lights|layer|on` | 모션 |

---

## 3. 공통 셸 — 복사해서 쓰는 스니펫 (수정 금지, 경로·현재 표시만 바꾼다)

### 3-0. 셸 배치 규칙
| 화면 | 셸 |
|---|---|
| index · pricing · product · profile · onboarding · 404 | `<body>` + navbar(3-1) + `<main id="main">` + footer(3-2) + 커맨드(3-4) |
| dashboard · inbox · kanban | `<body class="app">` + navbar + `.app__body`(학예실 사이드바 3-3-A + `main.app__main`) + footer + 커맨드 |
| settings | `<body class="app">` + navbar + `.app__body`(회원 계정 사이드바 3-3-B + `main.app__main`) + footer + 커맨드 |

### 3-1. navbar

**현재 표시 규칙** — 주 메뉴 링크와 모바일 시트 링크에 `aria-current="page"`.
| 화면 | 주 메뉴 현재 | 모바일 시트 현재 |
|---|---|---|
| index | 전시 | 01 전시 |
| profile | 소장품 | 02 소장품 |
| onboarding | 없음(주 버튼 `관람 예약`이 이 화면) | 시트 아래 `관람 예약` 버튼은 그대로 |
| product | 뮤지엄숍 | 04 뮤지엄숍 |
| pricing | 회원 | 05 회원 |
| dashboard · inbox · kanban · settings | 없음 | 시트 하단 학예실 목록의 해당 링크 |
| 404 | 없음 | 없음 |
`방문`은 index의 방문 안내 벽(`id="visit"`)으로 가는 앵커라 현재 표시하지 않는다.

**index 경로 (`index.html`)**
```html
<a class="skip" href="#main">본문으로 건너뛰기</a>
<header class="nav">
  <div class="nav__bar">
    <a class="nav__mark" href="index.html" aria-label="여백미술관 처음으로"><span class="nav__ko">여백미술관</span><span class="nav__latin">YEOBAEK</span></a>
    <nav class="nav__links" aria-label="주 메뉴">
      <ul>
        <li><a class="nav__link" href="index.html" aria-current="page">전시</a></li>
        <li><a class="nav__link" href="pages/profile.html">소장품</a></li>
        <li><a class="nav__link" href="index.html#visit">방문</a></li>
        <li><a class="nav__link" href="pages/product.html">뮤지엄숍</a></li>
        <li><a class="nav__link" href="pages/pricing.html">회원</a></li>
      </ul>
    </nav>
    <div class="nav__tools">
      <button class="nav__search" type="button" data-open="command" aria-haspopup="dialog" aria-expanded="false"><span class="nav__search-label">찾기</span><kbd>⌘K</kbd></button>
      <button class="theme-toggle" type="button" data-theme-toggle aria-pressed="false" aria-label="밤 화면"><span class="theme-toggle__opt" data-opt="light">낮</span><span class="theme-toggle__sep" aria-hidden="true">/</span><span class="theme-toggle__opt" data-opt="dark">밤</span></button>
      <a class="btn btn--primary btn--sm nav__cta" href="pages/onboarding.html"><span class="btn__label">관람 예약</span></a>
      <button class="nav__menu-btn" type="button" data-nav-toggle aria-expanded="false" aria-controls="nav-sheet">메뉴</button>
    </div>
  </div>
  <div class="nav__sheet" id="nav-sheet" role="dialog" aria-modal="true" aria-label="전체 메뉴" hidden>
    <ul class="nav__sheet-list">
      <li><a class="nav__sheet-link" href="index.html" aria-current="page"><span class="cat">01</span><span>전시</span><small>「한 가지 색의 두께」</small></a></li>
      <li><a class="nav__sheet-link" href="pages/profile.html"><span class="cat">02</span><span>소장품</span><small>1,140점</small></a></li>
      <li><a class="nav__sheet-link" href="index.html#visit"><span class="cat">03</span><span>방문</span><small>화–일 10:00</small></a></li>
      <li><a class="nav__sheet-link" href="pages/product.html"><span class="cat">04</span><span>뮤지엄숍</span><small>도록 ₩38,000</small></a></li>
      <li><a class="nav__sheet-link" href="pages/pricing.html"><span class="cat">05</span><span>회원</span><small>「벽·방·관」</small></a></li>
    </ul>
    <div class="nav__sheet-sub">
      <p class="loc"><span>학예실</span><span>계정</span></p>
      <a href="pages/dashboard.html">오늘의 전시장</a>
      <a href="pages/inbox.html">학예실 메일함</a>
      <a href="pages/kanban.html">작품 반입 보드</a>
      <a href="pages/settings.html">회원 계정</a>
    </div>
    <a class="btn btn--primary btn--block" href="pages/onboarding.html"><span class="btn__label">관람 예약</span></a>
  </div>
</header>
```

**pages 경로 (`pages/*.html`)** — 예: profile 화면. 경로만 다르고 마크업은 같다.
```html
<a class="skip" href="#main">본문으로 건너뛰기</a>
<header class="nav">
  <div class="nav__bar">
    <a class="nav__mark" href="../index.html" aria-label="여백미술관 처음으로"><span class="nav__ko">여백미술관</span><span class="nav__latin">YEOBAEK</span></a>
    <nav class="nav__links" aria-label="주 메뉴">
      <ul>
        <li><a class="nav__link" href="../index.html">전시</a></li>
        <li><a class="nav__link" href="profile.html" aria-current="page">소장품</a></li>
        <li><a class="nav__link" href="../index.html#visit">방문</a></li>
        <li><a class="nav__link" href="product.html">뮤지엄숍</a></li>
        <li><a class="nav__link" href="pricing.html">회원</a></li>
      </ul>
    </nav>
    <div class="nav__tools">
      <button class="nav__search" type="button" data-open="command" aria-haspopup="dialog" aria-expanded="false"><span class="nav__search-label">찾기</span><kbd>⌘K</kbd></button>
      <button class="theme-toggle" type="button" data-theme-toggle aria-pressed="false" aria-label="밤 화면"><span class="theme-toggle__opt" data-opt="light">낮</span><span class="theme-toggle__sep" aria-hidden="true">/</span><span class="theme-toggle__opt" data-opt="dark">밤</span></button>
      <a class="btn btn--primary btn--sm nav__cta" href="onboarding.html"><span class="btn__label">관람 예약</span></a>
      <button class="nav__menu-btn" type="button" data-nav-toggle aria-expanded="false" aria-controls="nav-sheet">메뉴</button>
    </div>
  </div>
  <div class="nav__sheet" id="nav-sheet" role="dialog" aria-modal="true" aria-label="전체 메뉴" hidden>
    <ul class="nav__sheet-list">
      <li><a class="nav__sheet-link" href="../index.html"><span class="cat">01</span><span>전시</span><small>「한 가지 색의 두께」</small></a></li>
      <li><a class="nav__sheet-link" href="profile.html" aria-current="page"><span class="cat">02</span><span>소장품</span><small>1,140점</small></a></li>
      <li><a class="nav__sheet-link" href="../index.html#visit"><span class="cat">03</span><span>방문</span><small>화–일 10:00</small></a></li>
      <li><a class="nav__sheet-link" href="product.html"><span class="cat">04</span><span>뮤지엄숍</span><small>도록 ₩38,000</small></a></li>
      <li><a class="nav__sheet-link" href="pricing.html"><span class="cat">05</span><span>회원</span><small>「벽·방·관」</small></a></li>
    </ul>
    <div class="nav__sheet-sub">
      <p class="loc"><span>학예실</span><span>계정</span></p>
      <a href="dashboard.html">오늘의 전시장</a>
      <a href="inbox.html">학예실 메일함</a>
      <a href="kanban.html">작품 반입 보드</a>
      <a href="settings.html">회원 계정</a>
    </div>
    <a class="btn btn--primary btn--block" href="onboarding.html"><span class="btn__label">관람 예약</span></a>
  </div>
</header>
```
- 학예실 화면(inbox 예): 주 메뉴에는 현재 표시 없음, 시트 하단 `<a href="inbox.html" aria-current="page">학예실 메일함</a>`.
- navbar의 `관람 예약`이 그 화면의 주 버튼 1개다. 본문에 또 주 버튼이 필요하면(담기, 예약 확정, 저장) 그 화면의 **가장 중요한 행동 하나**에만 쓰고 나머지는 보조(`.btn`)·텍스트(`.btn--text`).

### 3-2. footer — 모든 HTML 동일

**index 경로**
```html
<footer class="foot">
  <div class="wall">
    <div class="grid foot__grid">
      <div class="at-1 w-4">
        <a class="foot__mark" href="index.html">여백미술관<span class="latin">YEOBAEK MUSEUM</span></a>
        <p>서울 종로구 삼청로 87-4 (우 03052)<br>지하 1층–지상 3층</p>
        <p>전화 <span class="num">02-730-0487</span> · visit@yeobaek.kr</p>
      </div>
      <div class="at-5 w-4">
        <span class="foot__h">관람 시간</span>
        <p>화–일 10:00–18:00 (입장 마감 17:30)<br>수·토 21:00까지 (입장 마감 20:30)</p>
        <span class="foot__h">휴관</span>
        <p>매주 월요일 · 1월 1일 · 추석 당일</p>
      </div>
      <nav class="at-9 w-4" aria-label="장면 목록">
        <span class="foot__h">장면</span>
        <div class="foot__links">
          <a href="index.html" aria-current="page">전시 도록</a>
          <a href="pages/dashboard.html">학예실</a>
          <a href="pages/inbox.html">메일함</a>
          <a href="pages/kanban.html">반입 보드</a>
          <a href="pages/onboarding.html">첫 방문</a>
          <a href="pages/pricing.html">관람료</a>
          <a href="pages/product.html">뮤지엄숍</a>
          <a href="pages/profile.html">작가 아카이브</a>
          <a href="pages/settings.html">계정</a>
        </div>
        <p class="foot__copy">© 2026 여백미술관</p>
      </nav>
    </div>
    <span class="gs" aria-hidden="true"></span>
  </div>
</footer>
```

**pages 경로** — 예: dashboard 화면(현재 화면 링크에만 `aria-current="page"`, 404는 어느 링크에도 붙이지 않는다).
```html
<footer class="foot">
  <div class="wall">
    <div class="grid foot__grid">
      <div class="at-1 w-4">
        <a class="foot__mark" href="../index.html">여백미술관<span class="latin">YEOBAEK MUSEUM</span></a>
        <p>서울 종로구 삼청로 87-4 (우 03052)<br>지하 1층–지상 3층</p>
        <p>전화 <span class="num">02-730-0487</span> · visit@yeobaek.kr</p>
      </div>
      <div class="at-5 w-4">
        <span class="foot__h">관람 시간</span>
        <p>화–일 10:00–18:00 (입장 마감 17:30)<br>수·토 21:00까지 (입장 마감 20:30)</p>
        <span class="foot__h">휴관</span>
        <p>매주 월요일 · 1월 1일 · 추석 당일</p>
      </div>
      <nav class="at-9 w-4" aria-label="장면 목록">
        <span class="foot__h">장면</span>
        <div class="foot__links">
          <a href="../index.html">전시 도록</a>
          <a href="dashboard.html" aria-current="page">학예실</a>
          <a href="inbox.html">메일함</a>
          <a href="kanban.html">반입 보드</a>
          <a href="onboarding.html">첫 방문</a>
          <a href="pricing.html">관람료</a>
          <a href="product.html">뮤지엄숍</a>
          <a href="profile.html">작가 아카이브</a>
          <a href="settings.html">계정</a>
        </div>
        <p class="foot__copy">© 2026 여백미술관</p>
      </nav>
    </div>
    <span class="gs" aria-hidden="true"></span>
  </div>
</footer>
```
`.app` 화면에서는 푸터가 사이드바 오른쪽 열에 맞춰 자동 정렬된다(sidebar.css). README·CHECKLIST 링크 금지.

### 3-3. 사이드바 (pages 경로 전용)

구조(공통):
```html
<body class="app">
  <!-- 3-1 navbar (pages 경로) -->
  <div class="app__body">
    <!-- 3-3-A 또는 3-3-B -->
    <main class="app__main" id="main">
      <p class="loc"><span>학예실</span><span>10월 11일(일)</span><span class="num">15:40</span></p>
      <h1 class="t-room">오늘의 전시장</h1>
      …
    </main>
  </div>
  <!-- 3-2 footer (pages 경로) -->
  <!-- 3-4 커맨드 (pages 경로) -->
</body>
```

**3-3-A. 학예실 사이드바 (dashboard · inbox · kanban)** — 예: dashboard. 현재 화면 링크에 `aria-current="page"`.
```html
<aside class="side scroll-hint" aria-label="학예실 메뉴">
  <div class="side__scroll">
    <p class="side__who"><b>문지아</b>수석 학예사 · 학예실</p>
    <div class="side__group">
      <p class="side__label">전시장</p>
      <ul class="side__list">
        <li><a class="side__link" href="dashboard.html" aria-current="page"><span class="side__text">오늘의 전시장</span><span class="side__meta">346명</span></a></li>
        <li><a class="side__link" href="kanban.html"><span class="side__text">작품 반입 보드</span><span class="side__meta">2.5 개막</span></a></li>
      </ul>
    </div>
    <div class="side__group">
      <p class="side__label">소장품</p>
      <ul class="side__list">
        <li><a class="side__link" href="../index.html#catalogue"><span class="side__text">출품 목록</span><span class="side__meta">64</span></a></li>
        <li><a class="side__link" href="profile.html"><span class="side__text">작가 아카이브</span><span class="side__meta">권무영</span></a></li>
      </ul>
    </div>
    <div class="side__group">
      <p class="side__label">운영</p>
      <ul class="side__list">
        <li><a class="side__link" href="inbox.html"><span class="side__text">학예실 메일함</span><span class="count" aria-label="읽지 않음 4통">4</span></a></li>
        <li><a class="side__link" href="settings.html"><span class="side__text">회원 계정</span><span class="side__meta">3,912</span></a></li>
      </ul>
    </div>
    <p class="side__foot"><span class="side__date">2026.10.11 일</span>15:40 기준 · 관내 346명<span class="gs" aria-hidden="true"></span></p>
  </div>
</aside>
```
- index의 출품 목록 벽은 `id="catalogue"`, 방문 안내 벽은 `id="visit"`로 둔다(사이드바·내비가 이 앵커를 가리킨다).
- inbox 메일함 수: 12통 중 읽지 않음 4통(`count` 4). 다른 화면도 같은 값.

**3-3-B. 회원 계정 사이드바 (settings 전용)** — 같은 마크업 문법, 그룹만 다르다. 섹션 앵커에 `aria-current="true"`(스크롤 위치에 맞춰 장면이 바꿔도 된다).
```html
<aside class="side scroll-hint" aria-label="회원 계정 메뉴">
  <div class="side__scroll">
    <p class="side__who"><b>김서하</b>개인 연회원 「벽」 · <span class="mono">M-26-01847</span></p>
    <div class="side__group">
      <p class="side__label">회원 계정</p>
      <ul class="side__list">
        <li><a class="side__link" href="#account" aria-current="true"><span class="side__text">계정</span></a></li>
        <li><a class="side__link" href="#booking"><span class="side__text">예약</span><span class="side__meta">1</span></a></li>
        <li><a class="side__link" href="#notify"><span class="side__text">알림</span></a></li>
        <li><a class="side__link" href="#display"><span class="side__text">표시</span></a></li>
        <li><a class="side__link" href="#membership"><span class="side__text">멤버십</span><span class="side__meta">「벽」</span></a></li>
      </ul>
    </div>
    <div class="side__group">
      <p class="side__label">미술관</p>
      <ul class="side__list">
        <li><a class="side__link" href="pricing.html"><span class="side__text">관람료와 멤버십</span></a></li>
        <li><a class="side__link" href="onboarding.html"><span class="side__text">관람 예약</span></a></li>
      </ul>
    </div>
    <p class="side__foot"><span class="side__date">2026.10.11 일</span>다음 예약 10월 14일(수) 19:00<span class="gs" aria-hidden="true"></span></p>
  </div>
</aside>
```
≤1024에서 사이드바는 nav 아래 가로 스크롤 줄로 접힌다(누구·라벨·하단은 숨김, 오른쪽 페이드 힌트).

### 3-4. 커맨드 팔레트 — 모든 HTML의 body 끝에 1개 (`id="command"` 고정)

**index 경로** (pages에서는 `data-href`의 `pages/`를 지우고, `index.html` 링크는 `../index.html`)
```html
<div class="cmd" id="command" data-layer hidden>
  <div class="cmd__scrim" data-close></div>
  <div class="cmd__panel" role="dialog" aria-modal="true" aria-label="소장품 찾기">
    <div class="cmd__field">
      <label class="cmd__label" for="command-q">소장품 찾기</label>
      <input class="cmd__input" id="command-q" type="text" placeholder="작가, 작품 제목, Cat. 번호" autocomplete="off">
      <button class="cmd__esc" type="button" data-close>닫기</button>
    </div>
    <ul class="cmd__list" aria-label="찾은 항목">
      <li class="cmd__group" role="presentation">출품작</li>
      <li class="cmd__item" data-href="pages/profile.html" data-keywords="무제 유채"><span class="cat">Cat. 01</span><span><span class="cmd__who">권무영</span>「무제 74-3」</span><span class="cmd__meta">1전시실</span></li>
      <li class="cmd__item" data-href="pages/profile.html" data-keywords="묘법 흑연"><span class="cat">Cat. 07</span><span><span class="cmd__who">권무영</span>「묘법 반복 12」</span><span class="cmd__meta">1전시실</span></li>
      <li class="cmd__item" data-href="pages/profile.html" data-keywords="선 겨울"><span class="cat">Cat. 14</span><span><span class="cmd__who">권무영</span>「선 — 1980년 겨울」</span><span class="cmd__meta">1전시실</span></li>
      <li class="cmd__item" data-href="index.html#catalogue" data-keywords="한지"><span class="cat">Cat. 19</span><span><span class="cmd__who">염선희</span>「겹 21」</span><span class="cmd__meta">2전시실</span></li>
      <li class="cmd__item" data-href="index.html#catalogue" data-keywords="대여 해안미술관 L-2026-07"><span class="cat">Cat. 22</span><span><span class="cmd__who">염선희</span>「겹 9」</span><span class="cmd__meta">대여 중</span></li>
      <li class="cmd__item" data-href="index.html#catalogue" data-keywords="사진 젤라틴"><span class="cat">Cat. 30</span><span><span class="cmd__who">차경민</span>「북향 창 3」</span><span class="cmd__meta">2전시실</span></li>
      <li class="cmd__item" data-href="index.html#catalogue" data-keywords="영상 먹"><span class="cat">Cat. 41</span><span><span class="cmd__who">나은솔</span>「먹이 마르는 시간」</span><span class="cmd__meta">3전시실</span></li>
      <li class="cmd__item" data-href="index.html#catalogue" data-keywords="조각 철"><span class="cat">Cat. 52</span><span><span class="cmd__who">윤태오</span>「흑철 7」</span><span class="cmd__meta">4전시실</span></li>
      <li class="cmd__item" data-href="pages/profile.html" data-keywords="노트 재단 기탁"><span class="cat">Cat. 64</span><span><span class="cmd__who">권무영</span>작업 노트 1974–1979</span><span class="cmd__meta">4전시실</span></li>
      <li class="cmd__group" role="presentation">장면</li>
      <li class="cmd__item" data-href="pages/dashboard.html" data-keywords="학예실 입장 계측"><span class="cat">p. 212</span><span>학예실 — 오늘의 전시장</span><span class="cmd__meta">학예실</span></li>
      <li class="cmd__item" data-href="pages/inbox.html" data-keywords="메일"><span class="cat">p. 216</span><span>학예실 메일함</span><span class="cmd__meta">4통</span></li>
      <li class="cmd__item" data-href="pages/kanban.html" data-keywords="반입 종이의 무게"><span class="cat">p. 220</span><span>작품 반입 보드</span><span class="cmd__meta">2027. 2. 5</span></li>
      <li class="cmd__item" data-href="pages/onboarding.html" data-keywords="예약 가입 첫 방문"><span class="cat">p. 008</span><span>첫 방문 — 회원 가입과 관람 예약</span><span class="cmd__meta">관람 예약</span></li>
      <li class="cmd__item" data-href="pages/pricing.html" data-keywords="관람료 멤버십 회원"><span class="cat">p. 010</span><span>관람료와 멤버십</span><span class="cmd__meta">₩12,000</span></li>
      <li class="cmd__item" data-href="pages/product.html" data-keywords="도록 숍"><span class="cat">p. 244</span><span>전시 도록 「한 가지 색의 두께」</span><span class="cmd__meta">₩38,000</span></li>
      <li class="cmd__item" data-href="pages/profile.html" data-keywords="작가 아카이브 연보"><span class="cat">p. 196</span><span>작가 아카이브 — 권무영</span><span class="cmd__meta">1938–2011</span></li>
      <li class="cmd__item" data-href="pages/settings.html" data-keywords="계정 설정 알림"><span class="cat">p. 260</span><span>회원 계정 — 김서하</span><span class="cmd__meta">M-26-01847</span></li>
    </ul>
    <p class="cmd__empty" hidden><b>「<span data-cmd-query></span>」와 맞는 소장품이 없습니다.</b>작가 이름이나 Cat. 번호로 다시 찾아 보세요.</p>
    <p class="cmd__foot"><span><kbd>↑↓</kbd> 이동</span><span><kbd>Enter</kbd> 열기</span><span><kbd>Esc</kbd> 닫기</span></p>
  </div>
</div>
```

---

## 4. 컴포넌트 32

공통: radius 0 · 그림자 0 · 유채색 0 · 경계는 ①헤어라인 ②`--surface` 면 ③반전 면 중 하나만 · 선택·눌림 = **0ms 즉시 반전** · 호버 = 밑줄이 왼→오로 자람(120ms). 아이콘 대신 글자(`닫기`, `메뉴`, `이전/다음`, `+/−`, `↑↓`, `›`).

### accordion — 「작품 해설」
```html
<div class="acc" data-single>
  <div class="acc__item">
    <h3><button class="acc__head" type="button" aria-expanded="true" aria-controls="ac-07">
      <span class="cat acc__cat">Cat. 07</span>
      <span class="acc__title">「묘법 반복 12」<small>권무영 · 1977 · 종이에 흑연</small></span>
      <span class="acc__sign" aria-hidden="true"></span>
    </button></h3>
    <div class="acc__panel" id="ac-07"><p>…</p></div>
  </div>
</div>
```
상태: `aria-expanded`(+ / −), `disabled`(— 표시), 눌림 반전. `data-single` = 하나만 열림. 펼친 본문 30em.

### alert
```html
<div class="alert alert--error" role="alert">
  <div class="alert__body"><span class="alert__title">4전시실 진열장 C 습도 57%</span><p>기준 50±5% 초과 · 13:12 감지 · 담당 임소정</p></div>
  <button class="alert__close" type="button" data-dismiss>닫기</button>
</div>
```
`--ok` ■ / `--warn` ◩ / `--info` □(왼쪽 2px 선) / `--error` ▲(반전 블록, `role="alert"`). 오류 알림은 화면당 1개. 닫기는 선택.

### badge
```html
<span class="badge">대여 중</span>              <!-- [대여 중] 꺾쇠는 CSS가 붙인다 -->
<span class="badge badge--strong">보존 처리</span>
<span class="badge badge--muted">철수됨</span>
<span class="badge badge--alert">기준 초과</span>  <!-- 반전 -->
<span class="count">4</span>                      <!-- 숫자 배지 18px 반전 사각 -->
<span class="count count--quiet">12</span>
```

### breadcrumb — 위치 표기
```html
<nav class="crumbs" aria-label="위치"><ol>
  <li><a href="../index.html">2층</a></li>
  <li><a href="../index.html#catalogue">2전시실 「면」</a></li>
  <li><span aria-current="page">Cat. 19</span></li>
</ol></nav>
```

### button
```html
<button class="btn btn--primary" type="button"><span class="btn__label">예약 확정</span></button>
<button class="btn" type="button"><span class="btn__label">도록 담기</span> <span class="btn__meta">₩38,000</span></button>
<button class="btn btn--text" type="button"><span class="btn__label">출품 목록 전체</span></button>
```
| 상태 | 표기 |
|---|---|
| hover | 보조·텍스트: 밑줄 자람 / 주: 한 단 밝은 먹 |
| active · `aria-pressed="true"` | 즉시 반전 |
| focus-visible | 2px 외곽선 + 2px 벽색 오프셋 |
| `disabled` / `aria-disabled="true"` | 회색 테두리·글자(주 = `--surface-2` 면) |
| `.is-loading` + `aria-busy="true"` | 글자 대신 미니 교정띠 깜빡임. `data-busy-demo`로 1.6초 시연 |
크기: 기본 48(모바일 56), `.btn--sm` 36(모바일 44), `.btn--block`, `.btn--icon`(44 정사각, 글자 1자 + `aria-label`). 묶음 `.btn-row`.

### calendar — 전시 일정 달력 (월요일 시작)
```html
<div class="cal" data-calendar>
  <div class="cal__head">
    <h3 class="cal__title"><span class="num">2026</span>년 <span class="num">10</span>월</h3>
    <div class="cal__nav"><button type="button" disabled>이전 달</button><button type="button">다음 달</button></div>
  </div>
  <table class="cal__grid">
    <thead><tr><th scope="col">월</th><th scope="col">화</th><th scope="col">수</th><th scope="col">목</th><th scope="col">금</th><th scope="col">토</th><th scope="col">일</th></tr></thead>
    <tbody>
      <tr>
        <td><button class="cal__day cal__day--out" type="button" disabled><span class="cal__n">28</span></button></td>
        … <td><button class="cal__day" type="button" data-date="2026-10-01" data-label="10월 1일(목)"><span class="cal__n">1</span></button></td> …
      </tr>
      <tr>
        <td><button class="cal__day cal__day--closed" type="button" disabled aria-label="10월 5일(월) 휴관"><span class="cal__n">5</span></button></td>
        … <td><button class="cal__day cal__day--night" type="button" data-date="2026-10-07" data-label="10월 7일(수) 야간 개관"><span class="cal__n">7</span><span class="cal__ev">야간 해설 19:00</span></button></td> …
        <td><button class="cal__day" type="button" aria-current="date" data-date="2026-10-11" data-label="10월 11일(일) 오늘"><span class="cal__n">11</span><span class="cal__ev">오늘</span></button></td>
      </tr>
    </tbody>
  </table>
  <div class="cal__legend"><span class="cal__key"><span class="cal__swatch cal__swatch--closed"></span>휴관(월)</span><span class="cal__key"><span class="cal__swatch cal__swatch--night"></span>야간 개관 21:00</span><span class="cal__key"><span class="cal__swatch cal__swatch--today"></span>오늘</span></div>
  <p class="cal__out t-caption">선택: <span data-cal-output>10월 14일(수)</span></p>
</div>
```
2026년 10월: 1일 = 목요일. 월요일(5·12·19·26) = `--closed`, 수·토(3·7·10·14·17·21·24·28·31) = `--night`, 11일 = 오늘(`aria-current="date"`, 반전), 선택 = `aria-selected="true"`(안쪽 2px 선). 화살표 ±1/±7, Home/End. `calendar:select` 이벤트(`detail.date`). 작은 판형 `.cal--compact`(행사 문구 숨김, 칸 44px).

### card — 도판 + 캡션 `.work` / 위젯 `.widget`
```html
<figure class="work work--aside">
  <div class="work__plate">
    <div class="plate plate--paper" role="img" aria-label="염선희 「겹 21」 — 한지를 겹쳐 붙인 사각"></div>
    <span class="gs" aria-hidden="true"></span>
  </div>
  <figcaption class="cap"> …4줄… </figcaption>
</figure>

<a class="work" href="product.html">  <!-- 인터랙티브: 캡션 첫 줄 밑줄 자람, 눌림 = 캡션 반전 -->
  <div class="work__plate"><div class="plate plate--notes plate--wide" role="img" aria-label="…"></div></div>
  <span class="cap"> …4줄… <span class="cap__extra"><span class="cap__price">₩54,000</span><span class="badge">재고 12</span></span></span>
</a>
```
- `.work--aside` 캡션이 도판 **오른쪽 아래 바깥**(캡션 윗변 = 도판 아랫변). 캡션 열이 약 13em이라 그리드에서 2–3단 더 준다(예: 도판 4단 + 캡션 → `w-6`). `.work--aside-start` = 캡션이 왼쪽(벽 오른쪽 끝에 건 작품). 390에서는 캡션이 아래 16px.
- 상태: `.is-selected`(도판 둘레 2px 선 + "■ 선택됨"), `.is-withdrawn`(빈 자국 + 회색 캡션), 불러오는 중 = skeleton.
- 대시보드 위젯(카드 대신):
```html
<section class="widget" aria-labelledby="w3-t">
  <p class="widget__head"><span class="cat">W-03</span><span class="widget__name" id="w3-t">환경 계측</span><span>2전시실 「면」</span><span class="widget__meta">15:40</span></p>
  …
</section>
```
`.widget--quiet` = 위 1px 선. KPI 카드 4개 가로줄 금지.

### carousel — 「도판 넘기기」
```html
<div class="slides" data-carousel data-total="64" data-first="17" aria-roledescription="carousel" aria-label="도판 넘기기">
  <div class="slides__viewport">
    <figure class="slides__item work work--aside" aria-roledescription="slide" aria-label="도 17 / 64"> … </figure>
    <figure class="slides__item work work--aside" hidden aria-roledescription="slide" aria-label="도 18 / 64"> … </figure>
  </div>
  <div class="slides__foot">
    <button class="slides__btn" type="button" data-carousel-prev>이전</button>
    <div class="slides__mid">
      <p class="slides__count">도 <b data-carousel-index>17</b> / 64</p>
      <div class="progress progress--sm" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="27" aria-label="도판 진행"><div class="progress__track"><span class="progress__fill"></span></div><span class="progress__val" data-fixed>p. 120</span></div>
    </div>
    <button class="slides__btn" type="button" data-carousel-next>다음</button>
  </div>
  <p class="sr-only" aria-live="polite"></p>
</div>
```
넘김 = 점등(이동 0). ←→ 키. `data-first` = 첫 장의 도판 번호, `data-total` = 전체. `data-no-loop` 이면 끝에서 버튼 비활성. 점 내비가 필요하면 `.slides__dots > button.slides__dot[aria-label="도 17"]`.

### code — 소장품 레코드
```html
<figure class="code">
  <figcaption class="code__head"><span><b>YB 2019.001</b> 소장품 레코드 · JSON</span><button class="code__copy" type="button" data-copy>복사</button></figcaption>
  <pre class="code__pre"><code><span class="ln">{</span><span class="ln">  <span class="k">"cat"</span>: <span class="n">1</span>,</span><span class="ln is-hl">  <span class="k">"artist"</span>: <span class="s">"권무영"</span></span><span class="ln">}</span></code></pre>
</figure>
```
한 줄 = `.ln`(줄번호 자동). 구문: `.k` 키 · `.s` 문자열(2차 색) · `.n` 숫자(밑줄) · `.c` 주석. 강조 줄 `.is-hl`. 인라인은 `.code-inline`.

### command — ⌘K 「소장품 찾기」
셸 3-4를 쓴다. 열기: `[data-open="command"]` 또는 ⌘K/Ctrl+K. 결과 행 = `.cmd__item`(Cat./작가/제목/메타), 선택 = `aria-selected`(반전), 비활성 = `aria-disabled="true"`, 이동 = `data-href`, 다른 레이어 열기 = `data-open-after="id"`, 검색어 보조 = `data-keywords`. 정적 견본은 5절.

### drawer — 「작품 상세」 오른쪽 480px
```html
<div class="drawer" id="drw-cat19" data-layer hidden>
  <div class="drawer__scrim" data-close></div>
  <div class="drawer__panel" role="dialog" aria-modal="true" aria-labelledby="drw-cat19-t">
    <div class="drawer__head"><h2 class="drawer__title" id="drw-cat19-t">작품 상세 · Cat. 19</h2><button class="drawer__close" type="button" data-close>닫기</button></div>
    <div class="drawer__body">
      <div class="drawer__plate"><div class="plate plate--paper" role="img" aria-label="…"></div><span class="gs" aria-hidden="true"></span></div>
      <div class="cap"> …4줄… </div>
      <p class="drawer__text">…해설…</p>
      <dl class="drawer__dl"><dt>소장 번호</dt><dd class="mono">YB 2021.047</dd><dt>수집</dt><dd>2021년 · 작가 기증</dd></dl>
    </div>
    <div class="drawer__foot"><a class="btn" href="profile.html"><span class="btn__label">작가 아카이브</span></a></div>
  </div>
</div>
```
트리거: `<button class="btn" type="button" data-open="drw-cat19" aria-haspopup="dialog">`. 열림 = 스크림 페이드 + 오른쪽에서 24px(이 테마 유일한 이동). `drawer__head`에 브레드크럼을 둘 수 있다.

### empty — 빈 벽
```html
<div class="empty">
  <div class="empty__wall" aria-hidden="true"><span class="empty__mark"></span></div>
  <div class="cap">
    <span class="cap__l1"><span class="cat">Cat. —</span><b class="cap__who">철수됨</b></span>
    <span class="cap__l2">이 자리는 비어 있습니다</span>
    <span class="cap__l3">Cat. 30–35 광 노출 휴식 · 11월 20일(금)</span>
    <a class="link empty__action" href="../index.html#catalogue">출품 목록으로</a>
  </div>
</div>
```
못 자국 2점 + 희미한 사각 자국 + 캡션. 목록 안 작은 빈 상태 = `.empty--inline`.

### form
```html
<form data-validate data-demo data-success="회원 정보를 저장했습니다" class="form-grid">
  <div class="field">
    <label class="field__label" for="m-name"><b>이름</b><span class="field__req"></span></label>
    <input class="field__input" id="m-name" name="name" required value="김서하" autocomplete="name">
  </div>
  <div class="field">
    <label class="field__label" for="m-mail"><b>메일</b></label>
    <input class="field__input" id="m-mail" type="email" required aria-describedby="m-mail-h">
    <p class="field__hint" id="m-mail-h">예약 확인 메일을 보냅니다.</p>
    <p class="field__error">메일 주소 형식이 아닙니다.</p>   <!-- 생략하면 app.js 가 만든다 -->
  </div>
  <div class="field span-2"><label class="field__label" for="m-memo"><b>요청 사항</b></label><textarea class="field__area" id="m-memo"></textarea></div>
  <div class="field"><label class="field__label" for="m-time"><b>관람 시간</b></label><select class="field__select" id="m-time"><option>11:00 도슨트 해설</option></select></div>
  <div class="field"><label class="field__label" for="m-fee"><b>후원 금액</b></label><div class="field__group"><span class="field__affix">₩</span><input class="field__input" id="m-fee" inputmode="numeric"></div></div>
  <button class="btn btn--primary" type="submit"><span class="btn__label">저장</span></button>
</form>
```
- 입력 = 아래선만. hover = 선 진하게, focus = 2px, 오류 = `.field.is-invalid` + `aria-invalid` + ▲ 문구 + 2px, disabled = 점선, readonly = 희미한 선, 확인 중 = `.field.is-loading`.
- `data-validate`: required / `type=email` / `pattern`(+`data-msg-pattern`) / `minlength` 검사, 첫 오류에 포커스. `data-demo` = 제출을 막고 0.9초 로딩 후 `data-success` 토스트 + `form:success` 이벤트.
- 체크·라디오(사각):
```html
<label class="check"><input type="checkbox" checked><span class="check__box"></span>전시 개막 소식 받기</label>
<label class="radio"><input type="radio" name="tier" checked><span class="check__box"></span>「벽」 개인</label>
```
- 스위치(글자 "끔/켬") — 선택된 쪽 칸이 반전(꺼짐도 「끔」 칸 반전), 안 된 쪽은 투명 + text-3. 상태에 따라 바뀌는 보조 문구는 `<span data-when-off>` / `<span data-when-on>`:
```html
<div class="switch"><span class="switch__text" id="sw1">야간 해설 알림<small>매주 수 19:00</small></span><button class="switch__btn" type="button" role="switch" aria-checked="false" aria-labelledby="sw1"></button></div>
```
- 세그먼트(radiogroup) — settings의 "밤 / 낮 / 시스템"은 `data-theme-choice`를 붙이면 실제 테마가 바뀐다:
```html
<div class="seg" role="radiogroup" aria-label="화면 밝기">
  <button class="seg__opt" type="button" role="radio" data-theme-choice="light">낮</button>
  <button class="seg__opt" type="button" role="radio" data-theme-choice="dark">밤</button>
  <button class="seg__opt" type="button" role="radio" data-theme-choice="system">시스템</button>
</div>
```
- 수량: `<div class="qty"><button type="button" aria-label="수량 줄이기">−</button><input type="number" value="1" min="1" max="5" aria-label="수량"><button type="button" aria-label="수량 늘리기">+</button></div>` (`qty:change` 이벤트)

### kanban — 「작품 반입 보드」
```html
<div class="board-wrap scroll-hint">
  <div class="board" data-kanban>
    <div class="board__col" id="col-loan">
      <p class="board__head"><span class="board__step">01</span><span class="board__name">대여 협의</span><span class="board__n">2</span></p>
      <div class="board__list">
        <article class="kcard" tabindex="0" aria-label="L-2027-02 염선희 「겹 30」">
          <div class="cap"> …4줄(번호 자리에 L-2027-02)… </div>
          <div class="kcard__meta"><span>백승호</span><span class="num">11.04</span></div>
          <div class="progress progress--sm" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="18" aria-label="상태 점검 진행"><div class="progress__track"><span class="progress__fill"></span></div><span class="progress__val">18%</span></div>
          <div class="kcard__menu menu">
            <button class="menu__trigger menu__trigger--bare" type="button" aria-label="L-2027-02 다른 단계로 옮기기">옮기기</button>
            <ul class="menu__list menu__list--end" role="menu">
              <li role="none"><button class="menu__item" role="menuitem" type="button" data-kanban-move="col-ship">운송 예약<span class="menu__key">02</span></button></li>
              …
            </ul>
          </div>
        </article>
        <p class="board__empty" hidden>이 단계의 작품이 없습니다</p>
      </div>
    </div>
    …
  </div>
</div>
```
열(DIRECTION 11절): 대여 협의 · 운송 예약 · 상태 점검 · 설치 · 캡션 확정. 끌어 놓기 + 키보드 대안(카드 메뉴), 이동 시 열 수 갱신·토스트(되돌리기). 상태: `.kcard--blocked`(왼쪽 2px 선 + ◩ 사유), `aria-selected="true"`(반전), 포커스 = 왼쪽 2px 선. 열 머리 sticky. 모바일 = 열 단위 스냅 가로 스크롤.

### list — 출품 목록 행
```html
<ul class="cat-list" data-select-list>
  <li><button class="cat-list__row is-unread" type="button" data-key="m1">
    <span class="cat cat-list__no">09:12</span>
    <span class="cat-list__main"><b>해안미술관 등록과</b>Cat. 22·23 반환 일정 확인<span class="cat-list__sub">운송 10월 27일(화) 09:00 상차</span></span>
    <span class="cat-list__meta">대여</span>
  </button></li>
</ul>
```
행 56(`.cat-list--dense` 44, 선택 행 안쪽 여백 12 유지). 메일 행 `.cat-list--mail`(inbox와 index C-24가 같은 행, 선택 여부와 상관없이 안쪽 여백 8). 선택 = `aria-selected`/`aria-current`(반전). `.is-unread` = ■ 표시. `data-select-list` 안에서는 클릭 시 단일 선택 + `list:select` 이벤트. 차례형 `.cat-list--toc`(메타 뒤 →).

### marquee — 입구 안내판
```html
<div class="marquee">
  <span class="marquee__label">오늘 안내</span>
  <div class="marquee__viewport"><div class="marquee__track"><div class="marquee__group">
    <span class="marquee__item">오늘 <span class="num">11:00 · 14:00 · 16:00</span> 도슨트 해설</span>
    <span class="marquee__item">10월 17일(토) <span class="num">15:00</span> 큐레이터 토크 「선을 반복한다는 것」</span>
    <span class="marquee__item">수·토 <span class="num">21:00</span>까지 야간 개관</span>
  </div></div></div>
  <button class="marquee__toggle" type="button" aria-pressed="false">멈춤</button>
</div>
```
60px/s. 호버·포커스·멈춤 버튼으로 정지. reduced-motion이면 전체 목록이 멈춘 채 보인다.

### menu
```html
<div class="menu">
  <button class="menu__trigger" type="button">정렬</button>
  <ul class="menu__list" role="menu" aria-label="정렬">
    <li role="none"><button class="menu__item" role="menuitemradio" aria-checked="true" type="button" data-value="cat">출품 번호순<span class="menu__key">1</span></button></li>
    <li role="none"><button class="menu__item" role="menuitemradio" aria-checked="false" type="button" data-value="name">작가 가나다순<span class="menu__key">2</span></button></li>
    <li class="menu__sep" role="separator"></li>
    <li role="none"><button class="menu__item" role="menuitem" aria-disabled="true" type="button">연도순<span class="menu__key">3</span></button></li>
    <li role="none"><button class="menu__item menu__item--danger" role="menuitem" type="button">대여 해지</button></li>
  </ul>
</div>
```
트리거 바로 다음 `.menu__list`면 id 불필요(app.js가 연결). 열림 = 트리거 반전, 항목 hover/포커스 = 반전, 선택 = ■ + 800, ↑↓ Home End Esc, `menu:select` 이벤트. 오른쪽 정렬 `.menu__list--end`, 위로 `--up`. 그룹 이름 `.menu__label`.

### modal — 「관람 예약 확인」
```html
<div class="modal" id="dlg-booking" data-layer hidden>
  <div class="modal__scrim" data-close></div>
  <div class="modal__panel" role="dialog" aria-modal="true" aria-labelledby="dlg-booking-t">
    <div class="modal__no"><span class="modal__no-label">예약 번호</span><span class="sr-only">YB-261011-0042</span><span class="modal__no-val" aria-hidden="true"><span><small>기관</small>YB</span><span><small>날짜</small>261011</span><span><small>순번</small>0042</span></span></div>
    <div class="modal__body">
      <p class="loc"><span>관람 예약</span><span>확인</span></p>
      <h2 class="modal__title" id="dlg-booking-t">관람 예약 확인</h2>
      <div class="cap">
        <span class="cap__l1"><b class="cap__who">김서하</b><span class="cat">M-26-01847</span></span>
        <span class="cap__l2">10월 14일(수) 19:00 야간 해설</span>
        <span class="cap__l3">일반 1 · 야간 관람</span>
        <span class="cap__l4">₩8,000 · 회원 무료 입장 적용 ₩0</span>
      </div>
      <div class="modal__actions"><button class="btn btn--primary" type="button" data-close><span class="btn__label">예약 확정</span></button><button class="btn btn--text" type="button" data-close><span class="btn__label">날짜 바꾸기</span></button></div>
    </div>
    <button class="modal__close" type="button" data-close>닫기</button>
  </div>
</div>
```
트리거 `[data-open="dlg-booking"]`. 포커스 트랩·Esc·스크림 클릭·포커스 복귀·스크롤 잠금. 한 열 확인창 `.modal--plain`, 경고(탈퇴 확인 등) `.modal--plain.modal--alert`. 390에서는 아래에 붙는 시트.

### motion — 점등 · 반전 · 소등 견본
```html
<div class="motion-demo">
  <div class="motion-demo__item" data-motion="light"><div class="motion-demo__stage"><div class="plate plate--ink" aria-hidden="true"></div><span class="motion-demo__cap">Cat. 01</span></div><b>점등</b><span class="motion-demo__spec">opacity 0→1 · 720ms · 캡션 +160ms</span></div>
  <div class="motion-demo__item" data-motion="invert"><div class="motion-demo__stage"><button class="btn" type="button" aria-pressed="false"><span class="btn__label">눌러 보기</span></button></div><b>반전</b><span class="motion-demo__spec">0ms · 흑↔백</span></div>
  <div class="motion-demo__item" data-motion="lights"><div class="motion-demo__stage"><div class="plate plate--paper" aria-hidden="true"></div><span class="motion-demo__lights"></span></div><b>소등</b><span class="motion-demo__spec">200ms + 200ms</span></div>
</div>
<p class="motion-demo__note"><button class="btn btn--sm" type="button" data-motion-play><span class="btn__label">다시 재생</span></button> 움직임 줄이기 설정에서는 모두 즉시 바뀝니다.</p>
```
- 장면 진입 점등: 도판·캡션 묶음에 `data-light`(화면에 들어오면 켜짐, 한 번에 최대 3개, 캡션은 160ms 늦게). 한 화면에 `data-light`를 남발하지 말 것(표·목록에는 쓰지 않는다).
- `.light-on` 클래스 = 즉시 점등 애니메이션.
- 테마 토글은 자동으로 소등(먹 덮개 0→1→0).

### navbar
셸 3-1. 상태: 링크 hover = 밑줄 자람, 현재 = 800 + 아래 2px, 검색 눌림 = 반전, 낮/밤 = 현재 모드 글자가 반전 사각. ≤960 = 워드마크 + 낮/밤 + "메뉴"(시트 열림 시 "닫기"·반전, Esc 닫기).

### pagination — 「도 17 / 64」
링크형(장면 이동):
```html
<nav class="pager" aria-label="도판 쪽수">
  <a class="pager__step" href="…" rel="prev">이전</a>
  <ol class="pager__nums">
    <li><a class="pager__num is-edge" href="…">1</a></li><li><span class="pager__gap">…</span></li>
    <li><a class="pager__num" href="…">16</a></li><li><a class="pager__num" href="…" aria-current="page">17</a></li><li><a class="pager__num" href="…">18</a></li>
    <li><span class="pager__gap">…</span></li><li><a class="pager__num is-edge" href="…">64</a></li>
  </ol>
  <p class="pager__count">도 <b>17</b> / 64</p>
  <a class="pager__step" href="…" rel="next">다음</a>
</nav>
```
버튼형(같은 화면 안): `<div class="pager" data-pager data-total="64">` + `button.pager__num` + `button[data-pager-prev|next]` + `[data-pager-index]` → `pager:change`. 비활성 끝 = `aria-disabled="true"`/`disabled`. 390에서는 현재·처음·끝만 남는다(`.is-edge`). 양끝 정렬 `.pager--split`.

### popover — 캡션 패널
```html
<div class="pop">
  <button class="pop__trigger" type="button" data-popover="pop-cat14">Cat. 14 상세</button>
  <div class="pop__panel" id="pop-cat14" aria-label="Cat. 14 상세">
    <p class="pop__head"><b>Cat. 14 상세</b><span>1전시실</span></p>
    <div class="cap"> …4줄… </div>
    <span class="gs" aria-hidden="true"></span>
    <p class="pop__foot"><a class="link" href="profile.html">작가 아카이브</a><button class="pop__close" type="button" data-pop-close>닫기</button></p>
  </div>
</div>
```
폭 280, 1px 진한 테두리, 그림자 없음. 열림 = 트리거 반전. 바깥 클릭·Esc 닫기, 화면 밖이면 자동으로 오른쪽 정렬. `--end` `--up` 수동 지정 가능.

### progress (+ 계측 게이지)
```html
<div class="progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="66" aria-label="도록 1쇄 판매">
  <span class="progress__label"><b>도록 1쇄 판매</b><span class="num">1,326 / 2,000부</span></span>
  <div class="progress__track"><span class="progress__fill"></span></div>
  <span class="progress__val">66%</span>
</div>
```
교정띠가 왼쪽부터 채워짐(빈 칸 = 외곽선 11칸, 채운 칸 아래 2px 선). 값은 `aria-valuenow`로만 준다(app.js가 `--v`로 옮김, `Yeobaek.setProgress(el, n)`). 변형: `--sm`(8px), `--busy`(불확정 깜빡임), `.is-error`(▲ + 2px 테두리), 100%면 ■ 자동. `progress__val[data-fixed]`는 글자를 바꾸지 않는다.

게이지(환경 계측 — 기준 범위 + 현재값):
```html
<div class="gauge is-over" data-at="57" data-from="45" data-to="55">
  <div class="gauge__head"><span>4전시실 진열장 C 습도 · 기준 50±5%</span><span class="gauge__val">57<small>%</small></span></div>
  <div class="gauge__bar"><span class="gauge__range"></span><span class="gauge__mark"></span></div>
  <div class="gauge__scale"><span>0</span><span>50</span><span>100</span></div>
</div>
```
`data-at|from|to`는 0–100 위치(%). 단위가 다르면 장면에서 환산(예: 조도 0–200 lux → 50 lux = 25). 기준 초과 = `.is-over`(값이 반전 블록).

### sidebar
셸 3-3. 상태: hover = 밑줄, 눌림 = 반전, 현재 = 왼쪽 2px 선 + 800 + 벽색 바탕(접힌 줄에서는 아래 2px), `aria-disabled="true"` = 회색.

### skeleton
```html
<div class="skel skel--aside" aria-busy="true" aria-label="도판 불러오는 중">
  <div class="skel__plate"></div>
  <div class="skel__cap"><span class="skel__line"></span><span class="skel__line"></span><span class="skel__line"></span><span class="skel__line"></span></div>
</div>
<div class="skel skel--row" aria-hidden="true"><span class="skel__line"></span><span class="skel__line"></span><span class="skel__line"></span></div>
```
도판 → 캡션 1~4줄 순서로 깜빡임. 도판 비율은 `--ratio` 대신 같은 판형의 `.plate--*`와 맞춘다(필요하면 장면 CSS에서 `.skel__plate { aspect-ratio: … }`).

### spinner — 미니 교정띠
```html
<span class="spin" role="status"><span class="spin__cells" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></span><span class="spin__text">불러오는 중</span></span>
```
`<i>` 정확히 11개. `.spin--lg`(12px 칸), `.spin--quiet`(문구 숨김, 스크린리더용 유지). reduced-motion = M 칸만 켜진 정지 상태.

### steps — 1·2·3단계
```html
<ol class="steps">
  <li class="steps__item is-done"><span class="steps__no">1</span><span><span class="steps__name">회원 정보</span><span class="steps__state">완료</span></span><span class="steps__patch" aria-hidden="true"></span></li>
  <li class="steps__item" aria-current="step"><span class="steps__no">2</span><span><span class="steps__name">관람 날짜·시간</span><span class="steps__state">진행 중</span></span><span class="steps__patch" aria-hidden="true"></span></li>
  <li class="steps__item"><span class="steps__no">3</span><span><span class="steps__name">확인</span><span class="steps__state">대기</span></span><span class="steps__patch" aria-hidden="true"></span></li>
</ol>
```
지난 단계 ■ / 현재 반전 번호 + ◩ / 다음 □ / 오류 `.is-error` ▲. 오른쪽 위 패치는 "지나온 만큼 짙어진다" — 완료한 단계만 제 명도로 채움(1 → 3, 2 → 6, 3 → B), 현재 = 반전, 대기 = 외곽선 □. 패치 둘레 1px `--rule`(다크에서 B가 벽에 묻히지 않게). 완료 번호칸은 `--surface-2` 채운 면. 4·5단계는 `.steps--4|5`.
마법사: 컨테이너 `[data-stepper]` 안에 `.steps` + 패널 `[data-step-panel]`(첫 패널 외 `hidden`) + `[data-step-next]`(현재 패널 필수값 검사 후 이동) / `[data-step-prev]` / `[data-step-go="0"]` → `steps:change`.

### table — 출품 목록
```html
<div class="table-wrap">
  <table class="cat-table cat-table--stack">
    <caption><b>출품 목록</b> · 64점 · 4개 전시실</caption>
    <thead><tr>
      <th scope="col" aria-sort="ascending"><button class="cat-table__sort" type="button">Cat.</button></th>
      <th scope="col"><button class="cat-table__sort" type="button">작가 · 제목</button></th>
      <th scope="col">재료·기법</th>
      <th scope="col" class="num"><button class="cat-table__sort" type="button">크기 cm</button></th>
      <th scope="col">상태</th>
    </tr></thead>
    <tbody>
      <tr class="cat-table__group"><th colspan="5" scope="colgroup">1전시실 「선」<span>2층 · Cat. 01–18</span></th></tr>
    </tbody>
    <tbody>
      <tr>
        <td class="cat">Cat. 01</td>
        <td class="cat-table__lead"><span class="cat-table__who">권무영</span> 「무제 74-3」<span class="cat-table__sub">1974</span></td>
        <td class="cat-table__2">캔버스에 유채</td>
        <td class="num" data-sort="162" data-label="크기">162 × 130</td>
        <td class="cat-table__end"><span class="sym sym--ok">전시 중</span></td>
      </tr>
    </tbody>
  </table>
  <p class="sr-only" aria-live="polite" data-sort-live></p>
</div>
```
- 머리 2px 상단선 + sticky(`--sticky-top`, 기본 nav 높이 64). sticky를 위해 `.table-wrap`에는 overflow를 걸지 않는다. 열이 많아 가로 스크롤이 필요한 표만 `.table-wrap--scroll.scroll-hint`(그 표는 sticky 포기).
- 정렬: 버튼 클릭 → `aria-sort` 순환, 숫자 열은 `data-sort`의 값으로. **tbody 단위로 정렬**되므로 전시실 구분 머리는 각 그룹을 별도 `<tbody>`로 나눈다.
- 행: hover = `--surface`, 선택 = `aria-selected`(반전), 주의 = `.is-warn`(왼쪽 2px), 흐림 = `.is-muted`. 체크 선택: 첫 열 `<label class="check"><input type="checkbox" data-select-row aria-label="Cat. 01 선택"><span class="check__box"></span></label>`, 머리 `data-select-all`, 개수 `[data-select-count]`.
- 밀도 7: `.cat-table--dense`(44px 행). 합계 `tfoot`.
- 390 `.cat-table--stack`: 첫 칸(Cat.) 왼쪽 열, `.cat-table__lead` 본문 첫 줄, `.cat-table__end` 오른쪽 위, 나머지는 캡션 줄(`data-label` 접두). thead는 화면에서 숨고 그룹 머리가 sticky.

### tabs
```html
<div class="tabs">
  <div class="tabs__bar scroll-hint">
    <div class="tabs__list" role="tablist" aria-label="작가 아카이브">
      <button class="tabs__tab" role="tab" type="button" id="tab-chron" aria-selected="true" aria-controls="tp-chron">연보 <span class="tabs__n">14</span></button>
      <button class="tabs__tab" role="tab" type="button" id="tab-works" aria-selected="false" aria-controls="tp-works">작품 <span class="tabs__n">7</span></button>
      <button class="tabs__tab" role="tab" type="button" id="tab-refs" aria-selected="false" aria-controls="tp-refs">문헌 <span class="tabs__n">22</span></button>
    </div>
  </div>
  <div class="tabs__panel" role="tabpanel" id="tp-chron" aria-labelledby="tab-chron" tabindex="0"> … </div>
  <div class="tabs__panel" role="tabpanel" id="tp-works" aria-labelledby="tab-works" tabindex="0" hidden> … </div>
  <div class="tabs__panel" role="tabpanel" id="tp-refs" aria-labelledby="tab-refs" tabindex="0" hidden> … </div>
</div>
```
활성 = 800 + 아래 2px, hover = 1px 선 자람, disabled = 회색. ←→ Home End. 넘치면 오른쪽 페이드(자동). 작은 탭 `.tabs--sm`.
**필터 탭**(패널 없이 목록을 거른다 — index 출품 목록의 전체/선/면/그림자): `.tabs__list[data-filter-for="catalogue"]` + 각 탭 `data-filter="*|선|면|그림자"`(aria-controls 없음) → 범위 `#catalogue` 안의 `[data-filter-item][data-tags="선 …"]` 표시/숨김, `[data-filter-group="선"]` 그룹 머리, `[data-filter-count]`에 개수.

### timeline — 작가 연보 / 전시 일정
```html
<ol class="chron">
  <li class="chron__item is-key"><span class="chron__year">1938</span><div class="chron__body"><b>전남 강진 출생</b></div></li>
  <li class="chron__item"><span class="chron__year">1974<small>36세</small></span><div class="chron__body"><p>「무제 74-3」 제작 — 유채 단색 연작 시작</p></div></li>
</ol>
<ol class="chron chron--date">
  <li class="chron__item is-now"><span class="chron__year">10. 11 일</span><div class="chron__body"><b>오늘</b><p>입장 1,284명 · 관내 346명</p></div></li>
  <li class="chron__item is-future"><span class="chron__year">10. 17 토</span><div class="chron__body"><b>큐레이터 토크</b><p>「선을 반복한다는 것」 문지아 · 15:00 강당</p></div></li>
</ol>
```
`.is-key`(채운 점·본문 진하게) · `.is-now`(연도 반전) · `.is-future`(점선). 작가 연보의 사건 문장은 장면에서 만들되 생몰년(1938–2011)·작품 연도는 팩트 시트를 따른다.

### toast
```js
Yeobaek.toast({ cat: 'Cat. 22', title: '반환 일정이 등록되었습니다', msg: '10월 27일(화) · 해안미술관(부산)', undo: true, tone: 'ok' });
```
또는 트리거 버튼: `data-toast="반환 일정이 등록되었습니다" data-toast-cat="Cat. 22" data-toast-msg="…" data-toast-undo data-toast-tone="ok|error"`.
화면 오른쪽 아래 캡션 블록(낮 = 반전 면, 밤 = 한 단 밝은 면 + 선), 4초(호버·포커스 시 멈춤), "되돌리기"·"닫기" 글자 버튼, 최대 3개. 오류 = `role="alert"` + ▲.

### tooltip — 2줄 캡션
```html
<span class="tip">
  <button class="tip__term" type="button">Cat. 14</button>
  <span class="tip__bubble"><span class="tip__l1">권무영 「선 — 1980년 겨울」</span>한지에 흑연, 연필 · 94 × 63 cm</span>
</span>
```
첫 자식이 트리거(자동 `aria-describedby`). 반전 면 12px, 화살표 없음, 4px 간격. 호버·포커스로 보이고 Esc로 숨김, 터치는 탭 토글. `--below` `--end`. 핵심 정보는 툴팁에만 두지 않는다.

---

## 5. 열린 상태 견본 규칙 (index 3전시실 「그림자」 블랙박스 등)

오버레이는 글로 설명하지 않는다. **정적 견본 + 실제로 여는 트리거("직접 열기")** 둘 다.
| 컴포넌트 | 정적 견본 | 실제 |
|---|---|---|
| modal | `.modal.modal--static` 안 `.modal__panel role="group"` | `[data-open="dlg-…"]` + `.modal[data-layer][hidden]` |
| drawer | 높이를 준 칸 안에 `.drawer.drawer--static` | `[data-open="drw-…"]` + `.drawer[data-layer][hidden]` |
| command | `.cmd.cmd--static`(입력 `value="권무영"`, 결과 3행, 첫 행 자동 선택) | 셸의 `#command`, `[data-open="command"]` |
| menu | `ul.menu__list.menu__list--static`(항목 `tabindex="-1"`) | `.menu__trigger` |
| popover | `.pop__panel.pop__panel--static` | `[data-popover]` |
| tooltip | `.tip__bubble.tip__bubble--static` | `.tip` |
| toast | `div.toasts.toasts--static > .toast` | `[data-toast]` / `Yeobaek.toast()` |
- 정적 견본의 `id`는 실제 레이어와 겹치지 않게 다른 값. 견본 패널은 `role="dialog"` 대신 `role="group"` + `aria-label`.
- 블랙박스 방: `<section class="wall--room" data-theme="dark">` — 섹션에만 밤 토큰이 적용된다(라이트 페이지 안의 검은 방). 각 견본 아래 캡션(`Cat. S-1` …) + 트리거.

---

## 6. app.js 계약 요약

| 속성 / API | 동작 |
|---|---|
| `[data-theme-toggle]` | 낮/밤 전환(소등 400ms), `yeobaek-theme` 저장, `aria-pressed`. `?theme=`가 최우선 |
| `[data-theme-choice="light|dark|system"]` | 세그먼트에서 테마 선택(system = 저장 삭제) |
| `[data-light]` | 화면 진입 시 점등(.is-lit) |
| `[data-open="id"]` → `#id[data-layer]` | 모달·드로어·커맨드 열기. 포커스 트랩, Esc, `[data-close]`, 포커스 복귀, 스크롤 잠금. `layer:open` / `layer:close` 이벤트 |
| ⌘K / Ctrl+K | `#command` 토글. 입력 필터(`data-keywords` 포함), ↑↓ Enter, `data-href` 이동, `data-open-after` |
| `[role="tablist"]` | 탭(←→ Home End). `data-filter-for` 필터 탭 |
| `.acc__head` / `.acc[data-single]` | 아코디언 |
| `[data-toast]`, `Yeobaek.toast()` | 토스트 |
| `[data-popover]`, `.menu__trigger`, `.tip` | 팝오버·메뉴·툴팁(하나만 열림, 바깥 클릭·Esc). `menu:select` |
| `[data-carousel]` | 캐러셀(`data-total`, `data-first`, `data-no-loop`) |
| `.marquee` | 복제 + 속도 계산 + 멈춤 버튼 |
| `[role="progressbar"]`, `.gauge[data-at|from|to]`, `Yeobaek.setProgress()` | 진행·게이지 |
| `[data-calendar]` | 날짜 선택 · 화살표 · `[data-cal-output]` · `calendar:select` |
| `.cat-table__sort`, `[data-select-row]`, `[data-select-all]`, `[data-select-count]` | 표 정렬·선택 |
| `[data-kanban]`, `[data-kanban-move="열 id"]` | 칸반 끌어 놓기·키보드 이동·개수 갱신 |
| `form[data-validate]`(+`data-demo`, `data-success`) | 검증·로딩·성공 토스트 |
| `.switch__btn[role=switch]`, `.seg[role=radiogroup]`, `.qty` | 스위치·세그먼트·수량 |
| `[data-nav-toggle]` | 모바일 시트("메뉴"/"닫기") |
| `.scroll-hint` | 가로 넘침 페이드 힌트 |
| `[data-stepper]` · `[data-step-panel]` · `[data-step-next|prev|go]` | 단계 마법사 |
| `[data-copy]` | 코드 복사("복사됨") |
| `[data-pager]` | 버튼 페이지네이션 |
| `[data-select-list]` | 목록 단일 선택(`list:select`) |
| `[data-views]` + `[data-view-set="read"]`(+`data-view-focus`) | 컨테이너 `data-view` 전환(inbox 모바일 목록 ↔ 읽기). 장면 CSS에서 `[data-view="read"] .inbox__list { display: none; }` |
| `[data-dismiss]`, `[data-busy-demo]`, `[data-motion-play]` | 알림 닫기 · 로딩 시연 · 모션 재생 |
장면별 인라인 스크립트 금지. 상태 전환은 위 속성과 이벤트로만.

---

## 7. 반응형 · 접근성 체크

- 360/390 가로 넘침 0. 넓은 표는 `--stack`, 칸반은 `.board-wrap`, 탭은 자동 가로 스크롤. 대형 숫자(`.numeral`)는 clamp라 넘치지 않지만, 한 줄에 4자리 이상이면 장면에서 확인.
- 터치 타깃 44px: 탭, 날짜 칸(모바일 52), 사이드 링크, 페이지 번호, 푸터 링크(모바일), 글자 버튼(`.btn--text` 44) 충족. 새 버튼은 `.btn` 계열만.
- 아이콘이 없으니 글자 버튼이 기본이다. 기호만 있는 버튼(−, +)은 `aria-label` 필수. CSS 작품은 `role="img"` + `aria-label`, 교정띠·장식은 `aria-hidden="true"`.
- 대비: `--text-3`은 `--bg` 위에서만(라이트 4.54). `--surface` 위 14px 이하 글자는 `--text-2`.
- 밤 = 블랙박스: 도판·교정띠는 같은 톤, 검은 작품은 한 단 밝은 판. 반전 면(흰 면)은 선택된 1칸·주 버튼·경보에만. 장면 CSS에서 다크 색을 따로 만들지 않는다.
- `prefers-reduced-motion`: 점등·소등 0ms, 마퀴 정지(전체 노출), 스피너 = M 칸 정지, 스켈레톤 정지.
- 한글 라벨 자간 0. 넓은 자간은 `.cat` `.latin`(라틴·숫자)에만. 500·700 굵기 금지.

## 8. 쓰지 말 것

eyebrow + 2줄 헤드라인 + CTA 2–3개 + 통계 4개 첫 화면 · 가운데 정렬 "라벨 → 제목 → 부제" 섹션 헤더 반복 · `§ 번호 + 제목` · 판권 정의 목록 · 왼쪽 고정 목차 사이드바(index) · 컴포넌트를 박스에 하나씩 담은 갤러리 · KPI 카드 4개 가로줄 · 도넛 차트 · 둥근 모서리·그림자·blur·그라디언트 면·radial 얼룩 · 유채색(경고색 포함) · 슬레이트(푸른 기 회색) · 원형 스피너·햄버거 아이콘·이모지 · 세리프·이탤릭 · fade-up·스케일 팝·스태거 · "또렷하게/광활한 여백/모든 상태를 갖춘" 류 자기소개 카피 · Lorem·플레이스홀더·"○○" · `href="#"` · 인라인 onclick · 인라인 `grid-template-columns` · 이미지 파일.
