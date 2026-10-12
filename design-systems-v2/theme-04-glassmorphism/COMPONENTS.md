# 윤슬홈 · 컴포넌트 마크업 계약

다음 단계(index.html, pages/*.html) 에이전트는 **이 문서와 `DIRECTION.md`(세계관·팩트 시트)만 보고** 마크업한다.
수치·이름·시각은 DIRECTION.md 팩트 시트 값만 쓴다(기준 2026년 10월 10일 토요일, 라이트 17:42 / 다크 22:40, 본문 데이터의 모든 시각은 17:42 이전).

- 클래스는 BEM(`block__elem--mod`). 상태는 가능한 한 **ARIA 속성**(`aria-pressed`, `aria-selected`, `aria-expanded`, `aria-invalid`, `aria-busy`, `aria-current`)으로 표현하고 CSS가 그 속성을 읽는다.
- 인라인 `style`은 **CSS 변수 주입에만**(`--v`, `--c`, `--r`, `--i`, `--n`, `--t`, `--w`). 인라인 grid-template-columns, onclick, `href="#"` 금지.
- 장면 CSS(`index.css`, `pages/<name>.css`)도 의미 토큰만(`--glass-2`, `--text-2`, `--primary` …). `tokens.css` 원시값(`--teal-700`, `--dusk-*`)·hex 금지.
- SVG presentation attribute에 `var()` 금지 → `style="stroke:var(--x)"` 또는 `currentColor`.
- 아이콘은 `<span data-icon="이름"></span>`(app.js가 SVG로 채움). 이모지 금지. 아이콘만 있는 버튼은 `aria-label` 필수.
- 한글 라벨에 자간 확장·모노 금지. 모노(`.mono`, `.t-mono`)는 `YS-LGT-101`, `4.2.1`, `H-024` 같은 라틴·숫자에만.

---

## 0. 공통 머리말 (모든 HTML)

```html
<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>알림 센터 · 윤슬홈</title>
<meta name="description" content="…">
<script>(function(){var d=document.documentElement,q=new URLSearchParams(location.search).get('theme'),t=(q==='dark'||q==='light')?q:null;if(!t){try{t=localStorage.getItem('ys-theme')}catch(e){}}if(t!=='dark'&&t!=='light'){t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}d.setAttribute('data-theme',t)})();</script>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Outfit:wght@200;300;400;500;600;700&family=Gothic+A1:wght@200;300;400;500;700;800&family=DM+Mono:wght@400;500&display=swap">
<link rel="stylesheet" href="../styles.css">   <!-- index 는 styles.css -->
<link rel="stylesheet" href="inbox.css">       <!-- 장면 전용: index 는 index.css, 페이지는 pages/<name>.css -->
<script src="../app.js" defer></script>        <!-- index 는 app.js -->
</head>
```
- `localStorage` 키 **`ys-theme`**. URL `?theme=dark|light`가 최우선(저장하지 않음).
- `<title>` 형식: `<페이지 이름> · 윤슬홈` (index는 `주원네 집 17:42 · 윤슬홈`).

### body 골격 (순서 고정)
```html
<body>
<a class="skip-link" href="#main">본문으로 건너뛰기</a>
<div class="scene" aria-hidden="true"></div>      <!-- z0 창밖 장면. 비워 두면 app.js 가 하늘·해/달·검단산·스카이라인·다리·윤슬을 그린다 -->
<!-- 1. 상태 바 (§1-1) -->
<!-- 2. (선택) 단지 공지 마키 (§1-2) — .app 밖, 상태 바 바로 아래 -->
<div class="app" id="main">                       <!-- 후퇴(시그니처 B)되는 층. 모든 본문은 여기 안 -->
  … 페이지 본문 (pages 는 §1-3 방 레일 레이아웃) …
  <!-- 4. 한 줄 푸터 (§1-5) -->
</div>
<!-- 3. 독 (§1-4) -->
<!-- 5. 공통 오버레이: 커맨드 팔레트 (§1-6) + 이 페이지의 모달·드로어·메뉴·팝오버 -->
</body>
```
- 오버레이(모달·드로어·커맨드·메뉴·팝오버)는 **반드시 `.app` 밖, body 직속**. `.app` 은 열릴 때 `scale(.955)` 로 물러나므로 안에 두면 같이 줄어든다.
- 상태 바·독·마키는 오버레이가 열리면 app.js가 `inert` 처리한다.

---

## 1. 복사해서 쓰는 셸 스니펫 (전 페이지 동일 — 고치지 말고 그대로 붙인다)

경로 규칙: index는 `pages/xxx.html`, pages 안에서는 `xxx.html` 과 `../index.html`.
현재 페이지 표시는 **독의 해당 `<a>`에 `aria-current="page"` 하나만** 옮긴다(아래 예시는 index 기준).

### 1-1. 상태 바 (navbar)

**index.html 용**
```html
<header class="statusbar glass glass--z2">
  <div class="statusbar__start">
    <a class="wordmark" href="index.html" aria-label="윤슬홈 홈 보드"><span class="wordmark__mark"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9h7M9 13h11M6 17h8"/></svg></span><span class="wordmark__text">yunseul <b>home</b></span></a>
    <button class="statusbar__home" type="button" data-menu="menu-home" aria-expanded="false"><span data-menu-label>주원네 집</span><span data-icon="chevron-down"></span></button>
  </div>
  <div class="statusbar__center">
    <time class="statusbar__time" data-clock datetime="2026-10-10"><span class="only-light">17:42</span><span class="only-dark">22:40</span></time>
    <span class="statusbar__date">10월 10일 토요일</span>
    <span class="statusbar__weather"><span class="only-light" data-icon="sun"></span><span class="only-dark" data-icon="moon"></span><span class="only-light">맑음 17°</span><span class="only-dark">맑음 13°</span></span>
    <span class="statusbar__basis only-dark">데이터 17:42 기준</span>
  </div>
  <div class="statusbar__end">
    <button class="statusbar__search" type="button" data-command-open aria-label="기기·장면·설정 찾기"><span data-icon="search"></span><span>찾기</span><kbd>⌘K</kbd></button>
    <a class="btn btn--icon has-count" href="pages/inbox.html" aria-label="알림 센터, 읽지 않음 12건"><span data-icon="bell"></span><span class="badge-count">12</span></a>
    <button class="btn btn--icon" type="button" data-theme-toggle aria-label="밤 장면(다크)으로 전환"><span data-icon="moon"></span></button>
  </div>
</header>
<div class="menu glass glass--z3" id="menu-home" aria-label="집 전환">
  <button class="menu__item" role="menuitemradio" aria-checked="true" type="button"><span data-icon="home"></span>주원네 집</button>
  <div class="menu__sep" role="separator"></div>
  <a class="menu__item" role="menuitem" href="pages/settings.html"><span data-icon="gear"></span>집 설정</a>
</div>
```

**pages/*.html 용** — 차이는 ① 맨 앞 방 레일 버튼(1023px 이하에서만 보임) ② 경로.
```html
<header class="statusbar glass glass--z2">
  <div class="statusbar__start">
    <button class="btn btn--icon statusbar__rail" type="button" data-rail-open aria-expanded="false" aria-controls="rail" aria-label="방 목록 열기"><span data-icon="menu"></span></button>
    <a class="wordmark" href="../index.html" aria-label="윤슬홈 홈 보드"><span class="wordmark__mark"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9h7M9 13h11M6 17h8"/></svg></span><span class="wordmark__text">yunseul <b>home</b></span></a>
    <button class="statusbar__home" type="button" data-menu="menu-home" aria-expanded="false"><span data-menu-label>주원네 집</span><span data-icon="chevron-down"></span></button>
  </div>
  <div class="statusbar__center">
    <time class="statusbar__time" data-clock datetime="2026-10-10"><span class="only-light">17:42</span><span class="only-dark">22:40</span></time>
    <span class="statusbar__date">10월 10일 토요일</span>
    <span class="statusbar__weather"><span class="only-light" data-icon="sun"></span><span class="only-dark" data-icon="moon"></span><span class="only-light">맑음 17°</span><span class="only-dark">맑음 13°</span></span>
    <span class="statusbar__basis only-dark">데이터 17:42 기준</span>
  </div>
  <div class="statusbar__end">
    <button class="statusbar__search" type="button" data-command-open aria-label="기기·장면·설정 찾기"><span data-icon="search"></span><span>찾기</span><kbd>⌘K</kbd></button>
    <a class="btn btn--icon has-count" href="inbox.html" aria-label="알림 센터, 읽지 않음 12건"><span data-icon="bell"></span><span class="badge-count">12</span></a>
    <button class="btn btn--icon" type="button" data-theme-toggle aria-label="밤 장면(다크)으로 전환"><span data-icon="moon"></span></button>
  </div>
</header>
<div class="menu glass glass--z3" id="menu-home" aria-label="집 전환">
  <button class="menu__item" role="menuitemradio" aria-checked="true" type="button"><span data-icon="home"></span>주원네 집</button>
  <div class="menu__sep" role="separator"></div>
  <a class="menu__item" role="menuitem" href="settings.html"><span data-icon="gear"></span>집 설정</a>
</div>
```
- 레일이 없는 페이지(404, pricing, product, onboarding)는 `statusbar__rail` 버튼을 **빼고** 쓴다.
- 시계는 `data-clock`: 두 span이 테마로 토글되고, 실제로 흐른 분만큼 진행한다(숫자 교체 fade).
- `.statusbar__basis` 는 밤 장면(22:40)에서만 보인다 — 본문 데이터가 17:42 기준임을 시계 옆에서 밝힌다. 1023px 이하에서는 날짜와 함께 접히지 않으므로 그대로 두고, 767px 이하는 가운데 묶음 전체가 숨는다.

### 1-2. 단지 공지 마키 (선택 — index, dashboard, inbox 에서만)
```html
<div class="marquee marquee--bar glass">
  <span class="marquee__label"><span data-icon="building"></span>단지 공지</span>
  <div class="marquee__viewport"><div class="marquee__track"><div class="marquee__group">
    <span class="marquee__item"><strong>104동 승강기 점검</strong> 10/14(수) 10:00–12:00</span>
    <span class="marquee__item"><strong>9월 관리비 ₩241,380</strong> 납부 마감 10/31(토)</span>
    <span class="marquee__item"><strong>보일러 점검 방문</strong> 10/17(토) 10:00</span>
  </div></div></div>
  <button class="btn btn--icon btn--sm marquee__toggle" type="button" data-marquee-toggle aria-pressed="false" aria-label="공지 흐름 일시정지"><span data-icon="pause"></span></button>
</div>
```
`.marquee--bar` 가 상태 바 아래 여백(12px · 좌우 `--gutter`)을 잡는다. 호버·포커스 시 정지, 일시정지 버튼 필수, 감속 모션에서는 정적 가로 스크롤.

### 1-3. 방 레일 (sidebar) — pages 의 앱 레이아웃
dashboard · inbox · kanban · profile · settings 에서 쓴다. 레일 + 본문 2단:
```html
<div class="app" id="main">
  <div class="app__layout">
    <aside class="rail glass glass--z2" id="rail" aria-label="방">
      <div class="rail__head"><span class="rail__home">주원네 집</span><span class="rail__addr">윤슬힐 104동 1802호</span></div>
      <button class="btn btn--icon btn--sm rail__close" type="button" data-rail-close aria-label="방 목록 닫기"><span data-icon="close"></span></button>
      <nav class="rail__nav" aria-label="방 목록">
        <ul class="rail__list">
          <li><a class="rail__item" href="dashboard.html" aria-current="page"><span class="rail__glyph"><span data-icon="home"></span></span>집 전체<span class="rail__count">27</span></a></li>
        </ul>
        <p class="rail__group">방</p>
        <ul class="rail__list">
          <li><a class="rail__item" href="dashboard.html#room-living"><span class="rail__glyph"><span data-icon="sofa"></span></span>거실<span class="rail__lit"><span class="sr-only">켜진 조명 있음</span></span><span class="rail__count">7</span></a></li>
          <li><a class="rail__item" href="dashboard.html#room-kitchen"><span class="rail__glyph"><span data-icon="dish"></span></span>주방<span class="rail__count">3</span></a></li>
          <li><a class="rail__item" href="dashboard.html#room-master"><span class="rail__glyph"><span data-icon="bed"></span></span>안방<span class="rail__count">4</span></a></li>
          <li><a class="rail__item" href="dashboard.html#room-doha"><span class="rail__glyph"><span data-icon="lamp"></span></span>도하 방<span class="rail__lit"><span class="sr-only">켜진 조명 있음</span></span><span class="rail__count">3</span></a></li>
          <li><a class="rail__item" href="dashboard.html#room-study"><span class="rail__glyph"><span data-icon="bulb"></span></span>서재<span class="rail__count">0</span></a></li>
          <li><a class="rail__item" href="dashboard.html#room-entry"><span class="rail__glyph"><span data-icon="door"></span></span>현관<span class="rail__count">3</span></a></li>
          <li><a class="rail__item" href="dashboard.html#room-bath"><span class="rail__glyph"><span data-icon="drop"></span></span>욕실<span class="rail__count">1</span></a></li>
          <li><a class="rail__item" href="dashboard.html#room-balcony"><span class="rail__glyph"><span data-icon="washer"></span></span>발코니<span class="rail__count">2</span></a></li>
        </ul>
        <p class="rail__group">관리</p>
        <ul class="rail__list">
          <li><a class="rail__item" href="inbox.html"><span class="rail__glyph"><span data-icon="bell"></span></span>알림 센터<span class="rail__count">12</span></a></li>
          <li><a class="rail__item" href="kanban.html"><span class="rail__glyph"><span data-icon="columns"></span></span>가족 할 일<span class="rail__count">10</span></a></li>
          <li><a class="rail__item" href="profile.html"><span class="rail__glyph"><span data-icon="user"></span></span>이주원</a></li>
          <li><a class="rail__item" href="settings.html"><span class="rail__glyph"><span data-icon="gear"></span></span>집 설정</a></li>
        </ul>
      </nav>
      <div class="rail__foot"><span class="spinner spinner--sm" aria-hidden="true"></span><div><strong>윤슬 허브 H2 · 4.2.1</strong>4.3.0 다운로드 62%</div></div>
    </aside>
    <main class="app__main">
      … 페이지 본문 …
    </main>
  </div>
  <!-- 한 줄 푸터 (§1-5) -->
</div>
```
- `aria-current="page"` 는 현재 페이지 항목에만(대시보드=집 전체, inbox=알림 센터 …). 방 항목은 dashboard의 방 앵커(`id="room-living"` 등)로 간다 — dashboard는 이 8개 id를 실제로 가져야 한다.
- 방별 기기 수 합계 27 = 거실 7 · 주방 3 · 안방 4 · 도하 방 3 · 서재 0 · 현관 3 · 욕실 1 · 발코니 2 + 집 전체(`YS-*-0xx`) 4.
- 1023px 이하: 레일은 왼쪽 시트가 된다. 상태 바의 `[data-rail-open]` 으로 열림, 스크림 클릭·Esc·`[data-rail-close]` 로 닫힘, 포커스 트랩.

### 1-4. 독 (전 페이지 공통 이동)
**index.html 용** (pages 안에서는 `pages/` 접두를 빼고, 첫 항목 href 를 `../index.html` 로)
```html
<nav class="dock glass glass--z2" aria-label="앱 이동">
  <div class="dock__scroll" data-scroll-hint>
    <ul class="dock__list">
      <li><a class="dock__app dock__app--home rim sweep" href="index.html" aria-current="page" data-tip="홈 보드"><span data-icon="grid"></span><span class="dock__label">홈 보드</span></a></li>
      <li><a class="dock__app rim sweep" href="pages/dashboard.html" data-tip="주원네 집"><span data-icon="home"></span><span class="dock__label">주원네 집</span></a></li>
      <li><a class="dock__app rim sweep has-count" href="pages/inbox.html" data-tip="알림 센터"><span data-icon="bell"></span><span class="dock__label">알림 센터, 읽지 않음 12건</span><span class="badge-count" aria-hidden="true">12</span></a></li>
      <li><a class="dock__app rim sweep" href="pages/kanban.html" data-tip="가족 할 일"><span data-icon="columns"></span><span class="dock__label">가족 할 일</span></a></li>
      <li><a class="dock__app rim sweep" href="pages/onboarding.html" data-tip="기기 연결"><span data-icon="plug"></span><span class="dock__label">기기 연결</span></a></li>
      <li class="dock__sep" aria-hidden="true"></li>
      <li><a class="dock__app rim sweep" href="pages/product.html" data-tip="윤슬 스토어"><span data-icon="bag"></span><span class="dock__label">윤슬 스토어</span></a></li>
      <li><a class="dock__app rim sweep" href="pages/pricing.html" data-tip="멤버십"><span data-icon="star"></span><span class="dock__label">멤버십</span></a></li>
      <li><a class="dock__app rim sweep" href="pages/profile.html" data-tip="이주원"><span data-icon="user"></span><span class="dock__label">이주원</span></a></li>
      <li><a class="dock__app rim sweep" href="pages/settings.html" data-tip="집 설정"><span data-icon="gear"></span><span class="dock__label">집 설정</span></a></li>
    </ul>
  </div>
</nav>
```
- 구성 고정: **런치패드(홈 보드 = index) + 앱 8개**(주원네 집 · 알림 센터 · 가족 할 일 · 기기 연결 | 윤슬 스토어 · 멤버십 · 이주원 · 집 설정). 오류 화면(404 "연결 끊긴 방")은 독에 넣지 않는다 — index 앱 서랍과 설정 위험 영역의 "연결 끊긴 방 · 보기" 링크로만 간다.
- 아이콘마다 `data-tip` 필수: hover(마우스)·focus-visible 300ms 뒤 위쪽에 z3 짙은 유리 툴팁 라벨이 뜬다(tooltip 컴포넌트 재사용). 스크린 리더용 `.dock__label`도 그대로 둔다.
- 순서·아이콘·라벨 고정. `aria-current="page"` 만 현재 페이지로 옮긴다(아래 6px 점 + 2px 밝은 테두리가 따라간다).
- 데스크톱 56px 아이콘 + 호버 확대, 모바일 44px 가로 스크롤 + 페이드 힌트. body에 `padding-bottom` 이 이미 잡혀 있어 본문이 독에 가리지 않는다.

### 1-4b. 접힌 방 레일 (`.rail--slim`)
본문이 첫 화면 주인공인 페이지(알림 센터)는 같은 레일 마크업에 `rail--slim` 만 더한다. ≥1024px 에서 72px 아이콘 열로 접히고 항목 이름은 `data-tip="거실"` 툴팁 + 스크린 리더 텍스트로 남는다. 1023px 이하는 일반 레일 시트와 같다.
```html
<aside class="rail rail--slim glass glass--z2" id="rail" aria-label="방"> … <a class="rail__item" href="dashboard.html#room-living" data-tip="거실">…</a> … </aside>
```

### 1-5. 한 줄 푸터 (전 페이지 동일 — 다른 푸터를 만들지 않는다)
```html
<footer class="footline glass">
  <span class="footline__grp"><span>윤슬홈 허브 H2</span><span>펌웨어 4.2.1</span></span><span class="footline__grp"><span>윤슬힐 104동 1802호</span><span><a href="pages/settings.html">집 설정</a></span></span>
</footer>
```
pages 에서는 `href="settings.html"`. `.app` 안 마지막 요소로 둔다.

### 1-6. 공통 오버레이 — 커맨드 팔레트 (⌘K, 전 페이지)
상태 바의 `[data-command-open]` 과 ⌘K/Ctrl+K 가 연다. 결과 항목은 페이지와 무관하게 동일(경로만 바꾼다).
```html
<div class="overlay cmd" id="cmd" aria-label="기기·장면·설정 찾기">
  <div class="overlay__scrim" data-close></div>
  <div class="cmd__panel glass glass--z3">
    <div class="cmd__field"><span data-icon="search"></span><input class="cmd__input" type="text" placeholder="기기·장면·설정 찾기" aria-label="기기·장면·설정 찾기" role="combobox" aria-expanded="true" aria-autocomplete="list"><kbd>esc</kbd></div>
    <div class="cmd__list" role="listbox">
      <div class="cmd__group" role="group" aria-label="기기"><div class="cmd__group-label" aria-hidden="true">기기</div>
        <div class="cmd__item" role="option" data-keywords="빨래 발코니" data-toast-text="17:05 세탁 완료 · 건조기 대기"><span class="cmd__glyph"><span data-icon="washer"></span></span><span class="cmd__text"><span class="cmd__title">세탁기</span><span class="cmd__meta">발코니 · 완료 17:05</span></span><kbd>↵</kbd></div>
        <div class="cmd__item" role="option" data-keywords="빨래 발코니"><span class="cmd__glyph"><span data-icon="dryer"></span></span><span class="cmd__text"><span class="cmd__title">건조기</span><span class="cmd__meta">발코니 · 대기</span></span><kbd>↵</kbd></div>
        <div class="cmd__item" role="option" data-keywords="조명 호박"><span class="cmd__glyph cmd__glyph--lamp"><span data-icon="lamp"></span></span><span class="cmd__text"><span class="cmd__title">무드등 L2</span><span class="cmd__meta">거실 · 켜짐 40% · 2,200K</span></span><kbd>↵</kbd></div>
        <div class="cmd__item" role="option" data-keywords="공기 필터"><span class="cmd__glyph"><span data-icon="air"></span></span><span class="cmd__text"><span class="cmd__title">공기청정기 A3</span><span class="cmd__meta">거실 · 15:12부터 응답 없음</span></span><kbd>↵</kbd></div>
      </div>
      <div class="cmd__group" role="group" aria-label="장면"><div class="cmd__group-label" aria-hidden="true">장면</div>
        <div class="cmd__item" role="option" data-toast-text="메인등 70% · 무드등 40% · 에어컨 24°C"><span class="cmd__glyph cmd__glyph--accent"><span data-icon="sofa"></span></span><span class="cmd__text"><span class="cmd__title">귀가</span><span class="cmd__meta">17:00–22:00 도어락 열림</span></span><kbd>↵</kbd></div>
        <div class="cmd__item" role="option" data-toast-text="메인등 꺼짐 · 무드등 15% · 커튼 닫힘"><span class="cmd__glyph cmd__glyph--accent"><span data-icon="film"></span></span><span class="cmd__text"><span class="cmd__title">영화</span><span class="cmd__meta">수동</span></span><kbd>↵</kbd></div>
        <div class="cmd__item" role="option" data-toast-text="23:00 전체 소등 · 보일러 안방 23°C"><span class="cmd__glyph cmd__glyph--accent"><span data-icon="bed"></span></span><span class="cmd__text"><span class="cmd__title">취침</span><span class="cmd__meta">매일 23:00</span></span><kbd>↵</kbd></div>
      </div>
      <div class="cmd__group" role="group" aria-label="이동"><div class="cmd__group-label" aria-hidden="true">이동</div>
        <div class="cmd__item" role="option" data-href="pages/inbox.html"><span class="cmd__glyph"><span data-icon="bell"></span></span><span class="cmd__text"><span class="cmd__title">알림 센터</span><span class="cmd__meta">읽지 않음 12건</span></span><kbd>↵</kbd></div>
        <div class="cmd__item" role="option" data-href="pages/settings.html" data-keywords="방해금지 자동화"><span class="cmd__glyph"><span data-icon="gear"></span></span><span class="cmd__text"><span class="cmd__title">집 설정</span><span class="cmd__meta">방해금지 23:00–07:00</span></span><kbd>↵</kbd></div>
      </div>
    </div>
    <div class="cmd__empty" hidden><span data-icon="search"></span><strong><span data-cmd-query></span> 일치하는 항목이 없어요</strong><span>기기 이름이나 방 이름으로 찾아보세요.</span></div>
    <div class="cmd__foot"><span><kbd>↑</kbd><kbd>↓</kbd>이동</span><span><kbd>↵</kbd>실행</span><span><kbd>esc</kbd>닫기</span></div>
  </div>
</div>
```
- pages 에서는 `data-href="inbox.html"`, `data-href="settings.html"`.
- 동작: 입력 필터(제목·`data-keywords`·메타), 일치 부분 `<mark>`, 그룹 자동 숨김, ↑↓·↵, `data-href` 이동 / 없으면 토스트(`data-toast-text`). 빈 결과 문구는 조사까지 자동: "‘세탁기’와 일치하는 항목이 없어요", "‘보일러실’과 …".
- 열리면 `.app` 후퇴. 정적 견본은 `class="overlay cmd is-static"` (스크림 없이 그 자리에 열린 상태로 렌더).

---

## 2. 토큰 요약 (semantic.css)

| 용도 | 토큰 |
|---|---|
| 유리 3층 | `--glass-1` z1 (.48, 글자는 `--text`만) · `--glass-2` z2 본문 면 · `--glass-3` z3 오버레이 · `--glass-clear` 장식 전용(글자 금지) · `--glass-solid` 폴백 · `--glass-hover` `--glass-press` `--glass-sunken`(안쪽 홈) · `--glass-ink`/`--on-glass-ink`(툴팁·코드: 두 모드 모두 짙은 유리) · `--glass-offline` |
| 빛 림 | `--rim` `--rim-hi`(hover +10%) `--rim-ink` `--sheen`(윗변 반사) `--sweep` |
| 선 | `--hairline` `--hairline-strong` `--line-control`(입력 테두리 ≥3:1) `--line-control-hover` `--track` |
| 글자 | `--text` `--text-2` `--text-3` `--placeholder` |
| 윤슬 틸 | `--primary` `--primary-hover` `--on-primary` `--primary-soft` `--primary-line` `--ring` `--ring-glow` |
| 켜진 것 | `--lamp`(채움·글로우, 라이트에서 글자 금지) `--lamp-ink`(따뜻한 글자) `--lamp-glow` `--lamp-soft` · `--tile-on`(켜진 판) `--tile-on-text` `--tile-on-accent` `--tile-on-lamp` |
| 상태 | `--success` `--warning` `--danger` `--info` + `-soft` · `--on-danger` · `--badge-count`/`--on-badge-count` |
| 깊이 | `--shadow-z1` `--shadow-z2` `--shadow-z3` `--shadow-lift`(드래그) `--shadow-press` `--scrim` |
| 기타 | `--kelvin-warm/mid/cool` · `--code-*` · `--tone-1..4`/`--on-tone-1..4`(아바타) · `--skel` · 장면 `--sky-*` `--horizon` `--sun` `--river` `--glint` `--skyline` · 미니 장면 `--ms-*` |
| 스케일 (tokens) | 타입 `--t-clock-size 168→96` `--t-readout-xl 88→64` `--t-readout 48→40` `--t-title 32→26` `--t-h2 22→20` `--t-h3 17` `--t-body 15` `--t-label 13` `--t-caption 12` `--t-mono 12.5` / 간격 `--sp-1..11` = 4·8·12·16·20·24·32·40·56·80·120 / 반경 `--r-sheet 40` `--r-widget 24` `--r-control 12` `--r-chip 8` `--r-line 6` `--r-pill` / `--gutter 56·32·16` `--statusbar-h 56·52` `--rail-w 232` `--drawer-w 380` `--touch 44` |
| 모션 | `--ease-sheet` `--ease-pop` `--ease-out` · `--dur-press 110` `--dur-quick 180` `--dur-slide 220` `--dur-close 300` `--dur-sheet 420` `--dur-sweep 900` `--stagger 60` |

**대비 규칙**: z1(`.glass--z1`, 마키, 칸반 열, 푸터) 위에는 `--text`만. 색 글자(primary·상태색·`--text-2/3`)는 z2 이상에서만.

## 3. base.css 프리미티브

| 클래스 | 설명 |
|---|---|
| `.glass` + `.glass--z1/z2/z3` `.glass--bare`(텍스트 없는 z1 — 보드 바탕·도해 판, .40 · saturate 180%) `.glass--clear` `.glass--ink` `.glass--sheet`(반경 40) `.glass--hover`(내부 링크가 있는 판에 스윕) | **시그니처 A**: 유리 면(윗변 12px 반사 `--sheen-top` + 판 색) + 1.5px 빛 림(`::before`, 광원 쪽 정지점 알파 1) + 바깥 1px 빛 테(`--rim-outer`) + 스윕(`::after`). 층 그림자는 y 8 / 24 / 48 · blur 16 / 48 / 80 으로 확실히 갈린다. 짙은 유리(`.glass--ink`, `.code`)는 윗변 반사 없음(`--g-top: none`). `a/button/[role=tab]/[tabindex=0]` 인 `.glass` 는 hover·focus-visible 에 자동으로 빛이 한 번 지나간다. **`.glass` 요소의 `::before/::after` 는 다른 용도로 쓰지 말 것** |
| `.rim` `.sweep` | 유리가 아닌 요소에 림·스윕만 붙일 때(독 아이콘 등) |
| `.app` · `[data-receded]` · `.receded` | **시그니처 B**: 오버레이가 열리면 body에 `data-receded` → `.app` 이 `scale(.955) translateY(8px)` + blur 3px, 장면은 어두워짐. `.receded` 는 index 견본용 정적 후퇴 |
| `.overlay` `.overlay__scrim` `.is-open` `.is-static` | 모달·드로어·커맨드 공통 뼈대 |
| `.cq` | container-type(보드의 부모에 둔다). **보드 셀 크기는 가장 가까운 컨테이너의 `100cqi` 로 계산된다** — 패딩 있는 `.panel`/`.widget` 안에 보드를 두면 모바일에서 그 패딩만큼 넘친다. 보드를 감싼 바로 위 요소에 `.cq`(또는 `container-type: inline-size`)를 준다 |
| `.board` (`--4` `--6` `--8` `--fit`) | **셀 보드**: 정사각 셀 84px(12열)·76px(8열)·모바일 4열 가변, `grid-auto-flow: dense`. 컨테이너 폭 기준(`@container`). ① 컨테이너 ≤1199px 이면 12열 보드는 8열 — **방 레일이 있는 페이지의 `.app__main` 은 1440에서도 1112px 이므로 페이지 보드는 8열이 기본**(셀을 꽉 채우려면 `board--fit`). ② 컨테이너 ≤767px 이면 `--4`/`--6` 포함 **모든 보드가 `!important` 4열** — 데스크톱의 좁은 옆 열(≈584px)에 6열을 두려면 더 넓은 조상(섹션)을 컨테이너로 삼는다 |
| `.cell` + `.cell--s` 1×1 · `--m` 2×1 · `--l` 2×2 · `--w` 4×2 · `--t` 1×2 · `--xl` 4×4 · `--list` 6×`--rows` / 자유 `style="--c:3;--r:2"` | 위젯 크기. 모바일(4열)에서 4 초과는 자동 4. **모바일 크기를 따로 주려면 `--c-m`/`--r-m`**(예: `style="--c:3;--r:3;--c-m:4"`) — 인라인 `--c` 를 `!important` 없이 덮는다 |
| `.app__frame` `.app__layout` `.app__main` `.gutter` | 셸 레이아웃 (index는 `.app__frame` 또는 장면 CSS로 직접, pages는 `.app__layout`) |
| `.stack` (`--2/3/5/6/7/9`) `.row` (`--wrap/--between/--end/--top`) `.push` `.grow` | 스택·행 |
| `.overlap` | 앞 판이 뒤 판 모서리를 `translate(−24px, 32px)` 로 덮는다(모바일은 가로 0 · 세로 16 — 화면 왼쪽 밖으로 밀리지 않게. 감속 모션에서도 같은 값) |
| `.scroll-x` / `[data-scroll-hint]` | 가로 스크롤 + 넘칠 때 자동 페이드 힌트(두 선택자 모두 같은 마스크, 페이드 폭은 `--fade`, 기본 40px · 독 28px) |
| `.t-clock` `.t-readout-xl` `.t-readout` `.t-title` `.t-h2` `.t-h3` `.t-body` `.t-small` `.t-label` `.t-caption` `.t-mono`/`.mono` · `.t-2` `.t-3` `.t-primary` `.t-lamp` `.t-success` `.t-warning` `.t-danger` `.t-strong` `.tnum` `.unit`(숫자 옆 작은 단위 `23.5<span class="unit">°C</span>`) | 타입 — **얇고 거대한 숫자(200) ↔ 작고 굵은 한글 라벨(600–700)** 대비 |
| `.group-label` | OS 그룹 라벨(13px 600, 아이콘 16). 섹션 머리는 이것만 — 가운데 정렬 "라벨→제목→부제" 금지 |
| `.group-label--float` | **장면(z0) 위에 바로 놓는 라벨은 반드시 이것** — z1 유리 알약 + `--text`. 맨 장면 위 `--text-2` 글자는 라이트 스카이라인·강 띠(`#3B4F75`/`#5B87C0`) 위에서 4.5:1 미만 |
| `.is-focus-visible` | 포커스 상태 정적 견본(스펙 시트용, `:focus-visible` 과 같은 값) |
| `.only-light` `.only-dark` | 테마별 텍스트(시계 17:42 / 22:40, 날씨 17° / 13°) |
| `.avatar` (`--sm` 24 `--lg` 48 `--xl` 72, `data-tone="1..4"`) `.avatars` | 원형 이니셜(이름 1자: 주·서·도·순) |
| `kbd` `.divider` `.sr-only` `.skip-link` `.truncate` `.dot` `.hide-sm` `.show-sm` `.hide-md` `.show-md` | 유틸 |

### 아이콘 이름
`home search bell sun moon cloud close chevron-left chevron-right chevron-down chevron-up check plus minus more bulb lamp pendant thermo snow wind drop air lock unlock door camera shield bolt washer dryer dish sensor hub wifi wifi-off car package building calendar clock user users gear sliders grid inbox columns tag bag paw play pause refresh alert info check-circle x-circle trash edit copy link logout key film sunrise sofa bed speaker curtain battery filter pin arrow-right arrow-left grip menu command leaf star chart card plug phone eye download external glint`
크기: 기본 20 · `.ico--sm` 16 · `.ico--lg` 24 · `.ico--xl` 32.

### app.js 공통 훅 (요약)
| 속성 | 동작 |
|---|---|
| `[data-theme-toggle]` | 노을↔밤 전환 + 저장, 아이콘·라벨 자동 갱신 |
| `[data-open="id"]` / `[data-close]` | 모달·드로어 열기/닫기(후퇴·포커스 트랩·Esc·포커스 복귀) |
| `[data-command-open]`, ⌘K | 커맨드 팔레트 |
| `[data-menu="id"]` · `[data-longpress-menu="id"]` | 메뉴(클릭) · 컨텍스트 메뉴(길게 누름 500ms·우클릭·Shift+F10). `[data-menu-scope]` 부모의 나머지 칸은 물러남 |
| `[data-popover="id"]` | 팝오버(8px 떨어져 뜸, 바깥 클릭·Esc 닫힘) |
| `[data-tip="라벨"]` | 툴팁(300ms) |
| `[data-toast]` + `data-toast-title/-text/-src/-icon/-tone/-time` | 알림 배너. JS: `ysToast({title, text, src, icon, tone})` |
| `[data-busy="ms"]` (+`data-busy-result="error"`, `data-done-label`, 안쪽 `<span data-label>`) | 로딩 → 완료/실패 시연 |
| `[data-dismiss]` / `[data-dismiss="id"]` | 알림·배너 닫기 |
| `[data-copy="#id"]` | 복사 + "복사됨" |
| `[data-bind="#target" data-bind-attr="data-billing"]` | 라디오 그룹 값 → 대상 속성(월/연 요금, 무드등 색상 등). 대상 안의 `[data-show-when="값"]` 은 선택 값과 같을 때만 보인다(범용 show/hide — 페이지마다 `.only-month` 같은 유틸을 새로 만들지 않는다) |
| `[data-wizard]` + `[data-wizard-panel]` `[data-wizard-next]` `[data-wizard-prev]` | 단계 마법사(steps 갱신) |
| `[data-select-list]` + 행 `data-show="#pane"` + 판 `data-pane` | 목록 단일 선택 → 상세 판 전환(inbox) |
| `[data-wipe]` | 포인터 위치를 `--mx/--my` 로(404 김 서린 창 닦기). 감속·터치에서는 미동작 → CSS 기본값(중앙)으로 설계 |
| `[data-rise]` (+ 부모 `[data-rise-group]` — 시차는 한 번에 화면에 들어온 묶음 안에서 다시 매겨 최대 8×60ms) · `[data-motion-replay="#id"]` · `[data-sweep-play=".sel"]` · `[data-recede-demo]` · `[data-ease-play="#id"]` | 등장 스태거 · 다시 보기 · 스윕 재생 · 후퇴 시연 · 이징 공 굴리기 |

---

## 4. 컴포넌트 32종

### accordion — 펼치기 모듈 (접히면 M 알약 → 펼치면 반경 24)
```html
<div class="acc" data-acc-single>
  <section class="acc__item glass is-lit">                 <!-- is-lit: 켜진 조명이 있는 방 → 글리프 앰버 -->
    <h3 class="acc__heading"><button class="acc__trigger" type="button" aria-expanded="true" aria-controls="acc-living" id="acc-living-t">
      <span class="acc__glyph"><span data-icon="sofa"></span></span><span class="acc__title">거실</span><span class="acc__meta">기기 7 · 켜짐 3</span><span class="acc__chev"><span data-icon="chevron-down"></span></span>
    </button></h3>
    <div class="acc__panel" id="acc-living" role="region" aria-labelledby="acc-living-t"><div class="acc__inner"><div class="acc__body">
      <ul class="list list--dense">…</ul>
    </div></div></div>
  </section>
</div>
```
`data-acc-single` 이면 하나만 열림. 비활성: `<button … disabled>`.

### alert — 시스템 경고 시트
```html
<div class="alert alert--danger glass" role="alert">     <!-- --info --success --warning --danger · 띠형 .alert--strip -->
  <span class="alert__glyph"><span data-icon="wifi-off"></span></span>
  <div class="alert__body">
    <strong class="alert__title">공기청정기 A3 연결이 끊겼어요</strong>
    <span class="alert__text">15:12부터 응답이 없어요. 필터 잔량도 8%예요.</span>
    <div class="alert__actions"><button class="btn btn--sm btn--primary" type="button" data-busy="1400" data-toast data-toast-title="공기청정기 A3를 다시 찾는 중이에요"><span data-label>다시 연결</span></button><a class="btn btn--sm btn--quiet" href="pages/product.html">필터 ₩32,000</a></div>
  </div>
  <button class="btn btn--icon btn--sm alert__close" type="button" data-dismiss aria-label="알림 닫기"><span data-icon="close"></span></button>
</div>
```
상태색은 글리프와 왼쪽 2px 빛 줄에만. 경고·성공은 `role="status"`.

### badge
```html
<span class="badge badge--online">온라인</span>
<span class="badge badge--offline">오프라인</span>          <!-- 회색 유리 + 점선 링 -->
<span class="badge badge--rec">녹화 중</span>              <!-- 점이 깜박임 -->
<span class="badge badge--warning">필터 8%</span>  <span class="badge badge--danger">배터리 0%</span>
<span class="badge badge--info">건조 중 24분</span>  <span class="badge badge--lamp">켜짐 70%</span>  <span class="badge badge--done">완료</span>
<span class="badge badge--mono">YS-LGT-101</span>  <span class="badge badge--plain">점 없는 알약</span>  .badge--sm(24px · 12.5px · 500 — 한글 획이 뭉치지 않게)
<span class="badge badge--rec badge--on-media">녹화 중</span>   <!-- 사진·영상 프레임 위: 짙은 유리 + 흰 글자 -->
<!-- 아이콘 위 숫자 원 -->
<a class="btn btn--icon has-count" href="…" aria-label="알림 센터, 읽지 않음 12건"><span data-icon="bell"></span><span class="badge-count">12</span></a>
<span class="badge-dot"></span>
```

### breadcrumb — 시트 머리의 경로
```html
<nav class="crumbs" aria-label="경로"><ol class="crumbs__list">
  <li class="crumbs__item"><a class="crumbs__link" href="../index.html"><span data-icon="home"></span>주원네 집</a></li>
  <li class="crumbs__item"><a class="crumbs__link" href="dashboard.html#room-living">거실</a></li>
  <li class="crumbs__item"><span class="crumbs__current" aria-current="page">무드등 L2</span></li>
</ol></nav>
```
559px 이하에서 처음·마지막만 남고 "… ›" 로 축약.

### button
```html
<button class="btn btn--primary" type="button">귀가 장면 실행</button>   <!-- 불투명 틸 = 행동 -->
<button class="btn" type="button">기기 상세</button>                     <!-- 기본 = z2 유리 알약 -->
<button class="btn btn--quiet" type="button">전원 끄기</button>          <!-- 글자 + 림만 -->
<button class="btn btn--danger" type="button">허브 초기화</button>        <!-- 유리 위 위험색 글자 · 확정용 .btn--danger-solid -->
<button class="btn btn--icon" type="button" aria-label="더 보기"><span data-icon="more"></span></button>
```
크기 `--sm`(36, 터치 44) 기본 44 `--lg`(52) `--block` `--icon`. 부속 `.btn__kbd`, `.btn__count`. 묶음 `.btn-row`(`--stack-sm`: 559px 이하 세로).
상태: `:hover` 유리 밝아짐+스윕 · `:focus-visible` 2px 링 · `:active` scale .96 · `disabled`/`aria-disabled` · `aria-busy="true"`(스피너, `data-busy`로 시연) · `aria-pressed="true"`(켜짐 = 불투명 판) · `data-state="error"`(흔들림) · `data-state="done"`.

### calendar
위젯(L 2×2, 읽기 전용):
```html
<div class="cell cell--l glass widget widget--tight">
  <div class="cal" aria-label="2026년 10월">
    <div class="cal__head"><span class="cal__month">10월</span><span class="cal__year">2026</span></div>
    <div class="cal__grid">
      <span class="cal__dow cal__dow--sun">일</span><span class="cal__dow">월</span>…<span class="cal__dow">토</span>
      <span class="cal__d cal__d--out cal__d--sun">27</span>…<span class="cal__d">1</span>…
      <span class="cal__d is-today" aria-current="date">10</span>
      <span class="cal__d has-event" data-ev="warning">14</span>  <!-- 승강기 점검 -->
      <span class="cal__d has-event">17</span>                    <!-- 보일러 점검 -->
      <span class="cal__d has-event">20</span>                    <!-- 허브 업데이트 -->
      <span class="cal__d has-event" data-ev="danger">31</span>   <!-- 관리비 마감 -->
    </div>
  </div>
</div>
```
2026년 10월 1일은 **목요일** → 첫 줄 `27 28 29 30`(9월, `--out`) + `1 2 3`. 일요일 칸 `cal__d--sun`. 점 색 `data-ev="lamp|danger|warning"`(기본 primary).
큰 판(`.cal.cal--full`): 날짜를 `<button class="cal__d …" type="button" data-summary="10월 14일 · 104동 승강기 점검 10:00–12:00">14</button>` 로 쓰고 아래 `<p data-cal-out>` 에 요약 출력. 일정 목록 `ul.cal__agenda > li.cal__ev(--today) > time + span`.

### card = 위젯 · 타일 · 판
```html
<!-- 셀 위젯 -->
<div class="cell cell--w glass widget">
  <div class="widget__head"><span class="group-label"><span data-icon="bolt"></span>전기 · 10월</span><span class="badge badge--online badge--sm">−8.4%</span></div>
  <div class="widget__value">₩28,940</div>                    <!-- --xl(88) / 기본(48) / --sm(30) -->
  <div class="widget__sub">이번 달 예상 196kWh</div>
  <div class="widget__foot"><span class="live">17:42 갱신</span></div>  <!-- 실시간 표기 필수. 오래된 값은 .live--stale -->
</div>
<!-- 오프라인 위젯 -->
<div class="cell cell--m glass widget widget--tight widget--offline">…<span class="live live--stale">15:12부터 응답 없음</span></div>

<!-- 제어 센터 타일: M 알약 -->
<button class="cell cell--m tile glass" type="button" aria-pressed="true" data-on="켜짐 70%" data-off="꺼짐" data-longpress-menu="menu-living-main">
  <span class="tile__glyph"><span data-icon="bulb"></span></span>
  <span class="tile__text"><span class="tile__name">거실 메인등</span><span class="tile__state">켜짐 70%</span></span>
</button>
<!-- S 원형(이름은 aria-label) · 조명 아닌 것은 .tile--accent(틸) -->
<button class="cell cell--s tile tile--s tile--accent glass" type="button" aria-pressed="false" aria-label="외출 모드"><span class="tile__glyph"><span data-icon="logout"></span></span></button>
<!-- 오프라인 타일 (누르면 "응답하지 않아요" 토스트) -->
<button class="cell cell--m tile tile--offline glass" type="button" aria-pressed="false" aria-disabled="true">…<span class="tile__state">15:12부터 응답 없음</span></button>
<!-- 위젯 안 S 타일 4개 묶음 -->
<div class="cell cell--l glass widget widget--tight"><div class="tile-row" style="--n:2"> …S 타일 4개… </div></div>

<!-- 자유 크기 판 -->
<section class="panel glass" aria-labelledby="p-dev">         <!-- .panel--sheet(반경 40, 패딩 16) · .panel--flush(표·목록이 가장자리까지) -->
  <div class="panel__head"><h2 class="panel__title" id="p-dev">등록 기기</h2><div class="panel__actions"><button class="btn btn--sm">…</button></div></div>
  …
  <div class="panel__foot">17:42 갱신</div>
</section>
<dl class="kv"><dt>밝기</dt><dd>40%</dd><dt>색온도</dt><dd>2,200K</dd></dl>   <!-- 상세 정의 행 -->
```
켜짐 규칙: 타일은 유리 → 불투명 판(`--tile-on`) 으로 바뀌며 조명 타일은 앰버 글로우. 클릭으로 토글되고 `data-on/off` 문구로 상태 줄이 바뀐다.

### carousel — 장면 미리보기
```html
<div class="carousel" data-carousel aria-label="장면 미리보기" aria-roledescription="캐러셀">
  <div class="carousel__viewport" tabindex="0"><ul class="carousel__track">
    <li class="carousel__slide glass"><div class="mini-scene mini-scene--morning"></div><div class="carousel__cap"><span class="carousel__title">아침</span><span class="carousel__meta">평일 07:00 · 메인등 40% · 4,000K</span></div></li>
    <li class="carousel__slide glass"><div class="mini-scene mini-scene--out"></div>…외출…</li>
    <li class="carousel__slide glass"><div class="mini-scene mini-scene--home"><span class="mini-scene__lamp"></span></div>…귀가…</li>
    <li class="carousel__slide glass"><div class="mini-scene mini-scene--movie"><span class="mini-scene__lamp"></span></div>…영화…</li>
    <li class="carousel__slide glass"><div class="mini-scene mini-scene--sleep"></div>…취침…</li>
  </ul></div>
  <div class="carousel__bar"><div class="pager-dots" data-carousel-dots></div>
    <button class="btn btn--icon btn--sm" type="button" data-carousel-prev aria-label="이전 장면"><span data-icon="chevron-left"></span></button>
    <button class="btn btn--icon btn--sm" type="button" data-carousel-next aria-label="다음 장면"><span data-icon="chevron-right"></span></button></div>
</div>
```
자동 회전 없음. 점은 JS가 만든다. ←→ 키. 슬라이드 폭 `style="--slide-w:260px"` 로 조절 가능. `mini-scene` 은 앱 서랍 아이콘 그림에도 재사용.

### code — 자동화 규칙
```html
<div class="code glass glass--ink code--numbered">
  <div class="code__head"><span class="code__file">home-arrival.yaml</span><span class="code__label">자동화 규칙</span>
    <button class="btn btn--sm code__copy" type="button" data-copy="#code-home"><span data-icon="copy"></span><span data-label>복사</span></button></div>
<pre id="code-home"><code><span class="ln"><span class="tok-key">scene</span><span class="tok-punct">:</span> <span class="tok-str">"귀가"</span></span><span class="ln is-hl">  <span class="tok-key">lock</span><span class="tok-punct">:</span> <span class="tok-str">YS-SEC-001</span>  <span class="tok-com"># 현관 도어락</span></span>…</code></pre>
</div>
```
머리는 줄바꿈된다: 767px 이하에서 파일명 + 복사 버튼이 첫 줄, 규칙 라벨은 둘째 줄(파일명은 nowrap — 장면 CSS에서 따로 고치지 말 것). 토큰 `.tok-key .tok-str .tok-num .tok-bool .tok-com .tok-punct`, 줄 `.ln`(`.is-hl` 강조). **원문은 DIRECTION 팩트 시트 '귀가 규칙 원문'(home-arrival.yaml, 15줄) 하나뿐** — index·settings 모두 그대로 쓰고, 줄여야 하면 앞 10줄을 자른 뒤 `… 5줄 더`를 붙인다. 본문 속 ID는 `<code class="code-inline">YS-LGT-101</code>`.

### command — §1-6 참조 (전 페이지 공통 셸)

### drawer — 기기 상세 시트
```html
<div class="overlay drawer" id="drawer-lamp" aria-labelledby="drawer-lamp-t">      <!-- 왼쪽: .drawer--left -->
  <div class="overlay__scrim" data-close></div>
  <aside class="drawer__sheet glass glass--z3">
    <div class="drawer__grab" aria-hidden="true"></div>
    <header class="drawer__head"><div class="drawer__titles"><nav class="crumbs" aria-label="경로">…</nav><h2 class="drawer__title" id="drawer-lamp-t">무드등 L2</h2><span class="drawer__sub">거실 · YS-LGT-102 · 켜짐 40%</span></div>
      <button class="btn btn--icon" type="button" data-close aria-label="닫기"><span data-icon="close"></span></button></header>
    <div class="drawer__body"><section class="drawer__section">…</section></div>
    <footer class="drawer__foot"><button class="btn" type="button" data-close>끄기</button><button class="btn btn--primary" type="button">장면에 추가</button></footer>
  </aside>
</div>
<button class="btn" type="button" data-open="drawer-lamp">기기 상세</button>
```
데스크톱 오른쪽 380px 떠 있는 판, 767px 이하 아래 시트(그랩바). 정적 견본: `class="overlay drawer is-static"`.

### empty
```html
<div class="empty glass">                                   <!-- 작은 판: .empty--compact -->
  <div class="empty__slots" aria-hidden="true"><span></span><span></span><span class="is-target"><span data-icon="plus"></span></span><span></span><span></span><span></span></div>
  <p class="empty__title">이 방에는 아직 기기가 없어요</p>
  <p class="empty__text">서재에 조명이나 센서를 연결하면 여기에 위젯으로 놓여요.</p>
  <div class="empty__actions"><a class="btn btn--primary" href="onboarding.html"><span data-icon="plus"></span>기기 추가</a></div>
</div>
```
점선 슬롯 6칸(두 번째는 M 폭). 서재(기기 0대)가 기본 사례.

### form
```html
<form class="form" data-validate data-success-title="방문 차량을 등록했어요" data-success-text="12가 3456 · 18:30–21:00" data-success-icon="car">
  <div class="field">
    <label class="field__label" for="car">차량번호<span class="field__req" aria-hidden="true">*</span></label>
    <input class="input" id="car" name="car" required data-pattern="^\d{2,3}[가-힣]\s?\d{4}$" data-pattern-msg="차량번호는 ‘12가 3456’ 형식으로 입력해 주세요." data-required-msg="차량번호를 입력해 주세요." placeholder="12가 3456">
    <p class="field__hint">숫자 2–3자리 + 한글 1자 + 숫자 4자리</p>
    <p class="field__error"><span data-icon="alert"></span><span data-msg>차량번호는 ‘12가 3456’ 형식으로 입력해 주세요.</span></p>
  </div>
  <div class="form__row">…두 칸 이상 자동 줄바꿈…</div>
  <button class="btn btn--primary" type="submit"><span data-label>등록</span></button>
</form>
```
- 입력: `.input`(48, 반경 12, 유리) · `.input--area` · `.input--mono` · 아이콘/접미사 `.input-wrap` · 선택 `<div class="select"><select class="input">…</select></div>`.
- 상태: 포커스(2px 링+글로우) · `aria-invalid="true"`(아래 2px 위험색 빛 줄 + `.field__error` 자동 표시) · `disabled` · `readonly`. 정적 오류 견본은 `aria-invalid="true"` 를 직접 쓴다.
- 세그먼트: `<div class="seg" role="radiogroup" aria-label="방"><label class="seg__opt"><input type="radio" name="room" value="living" checked><span>거실</span></label>…</div>` (`.seg--block` 전폭)
- 체크: `<label class="check"><input type="checkbox"><span class="check__box"></span><span>도착하면 알림<span class="check__sub">현관 카메라 감지 시</span></span></label>` · 라디오 `.radio` + `.radio__box`
- 스위치: `<label class="switch"><input type="checkbox" role="switch" checked><span class="switch__track"></span><span>현관 카메라 녹화</span></label>` (`.switch--lamp` 켜지면 앰버)
- 스테퍼: `<div class="stepper" data-stepper data-min="18" data-max="28" data-step="0.5" data-unit="°C" data-value="24"><button class="stepper__btn" type="button" data-step="-1" aria-label="목표 온도 내리기"><span data-icon="minus"></span></button><span class="stepper__value">24.0°C</span><button class="stepper__btn" type="button" data-step="1" aria-label="목표 온도 올리기"><span data-icon="plus"></span></button></div>`
- **세로 슬라이더(T 1×2 조명)**: `<div class="cell cell--t glass vslider vslider--lamp" role="slider" tabindex="0" aria-label="거실 메인등 밝기" aria-valuemin="0" aria-valuemax="100" aria-valuenow="70" data-zero="꺼짐"><span class="vslider__fill"></span><span class="vslider__value">70%</span><span class="vslider__icon" data-icon="bulb"></span></div>` — 드래그·↑↓·PageUp/Down·Home/End, 놓을 때 2px 튕김. 조명이 아니면 `--lamp` 를 뺀다.
- 색온도: `<input class="range range--kelvin" type="range" min="2200" max="6500" step="50" value="3000" data-format="kelvin" data-out="#k-out" aria-label="색온도">` + `<div class="range-scale"><span>2,200K</span><span>6,500K</span></div>` (`data-format`: kelvin·percent·celsius)

### kanban — 가족 할 일
```html
<div class="kanban" data-kanban>
  <section class="kanban__col glass glass--z1" aria-labelledby="col-todo">
    <header class="kanban__head"><h3 class="kanban__title" id="col-todo">할 일</h3><span class="kanban__count">4</span></header>
    <ol class="kanban__list" aria-labelledby="col-todo">
      <li class="kcard glass" tabindex="0">
        <div class="kcard__top"><span class="kcard__id">H-024</span><span class="badge badge--warning badge--sm">필터 8%</span></div>
        <p class="kcard__title">공기청정기 필터 교체</p>
        <div class="kcard__foot"><span class="kcard__due kcard__due--soon"><span data-icon="calendar"></span>10/13(화)</span><span class="avatar avatar--sm" data-tone="1"><span class="sr-only">담당 이주원, </span>주</span></div>
      </li>
    </ol>
  </section>
  <section class="kanban__col glass glass--z1" data-done>…완료 열 (카드 자동 취소선)… <div class="kb-slot" aria-hidden="true">여기로 끌어 완료 처리</div></section>
  <!-- 덜 찬 레인: min-height 로 늘리지 말고 레인이 내용을 감싸게(align-self: start). 끝에 카드 한 장 높이의 드롭 슬롯(.kb-slot, 열 어디에 놓아도 그 열로 들어감).
       긴 레인: 위 3장 + '1건 더' 접기(<li class="kcard" data-fold> + <button data-expand="#열id" aria-expanded="false">) -->
</div>
```
마우스 드래그 / 터치 길게 누름(280ms)으로 카드가 z3로 떠오름(2° 기울임 + 큰 그림자), 열 개수 자동 갱신. 키보드: Space/Enter 집기 → ←→ 열 · ↑↓ 순서 → Space 놓기 · Esc 취소. 정적 "떠오른" 견본은 `.kcard.is-dragging`. 열 4개: 할 일 / 진행 중 / 확인 필요 / 완료.

### list
```html
<ul class="list glass" data-select-list>                      <!-- .list--plain(판 없이) · .list--dense(52) -->
  <li><button class="list__row is-unread" type="button" data-show="#pane-elevator">
    <span class="list__icon list__icon--app" data-tone="accent"><span data-icon="building"></span></span>
    <div class="list__text"><span class="list__title">104동 승강기 점검 안내</span><span class="list__sub">윤슬힐 관리사무소 · 10/14(수) 10:00–12:00</span></div>
    <div class="list__end"><time>14:10</time><span class="list__unread" aria-label="읽지 않음"></span></div>
  </button></li>
  <li><div class="list__row">… <div class="list__end"><label class="switch"><input type="checkbox" role="switch" checked aria-label="거실 메인등"><span class="switch__track"></span></label></div></div></li>
  <!-- 행 끝 스위치도 라벨 높이 44px(.list__end .switch { min-height: var(--touch) }) — 행이 div 라 스위치 자체가 타깃이다 -->
</ul>
<p class="list-group-label">보안</p>                       <!-- 설정 앱 그룹 라벨 -->
```
아이콘 톤 `data-tone="lamp|accent|success|warning|danger|offline"`, 앱 아이콘형 `.list__icon--app`. 선택 `aria-selected="true"` / 현재 `aria-current`(불투명 알약). 끝에 화살표 `<span class="list__chev" data-icon="chevron-right"></span>`. 구분선은 아이콘 열 뒤에서 시작.

### marquee — §1-2

### menu — 컨텍스트 메뉴
```html
<div class="board" data-menu-scope>
  <button class="cell cell--m tile glass" … data-longpress-menu="menu-moodlamp">…</button>
</div>
<div class="menu glass glass--z3" id="menu-moodlamp" aria-label="무드등 L2">
  <div class="menu__head">무드등 L2 · 거실</div>
  <button class="menu__item" role="menuitem" type="button"><span data-icon="sliders"></span>밝기·색온도</button>
  <button class="menu__item" role="menuitem" type="button" data-open="drawer-lamp"><span data-icon="info"></span>기기 상세</button>
  <button class="menu__item" role="menuitemcheckbox" aria-checked="true" type="button"><span data-icon="sofa"></span>귀가 장면에 포함</button>
  <div class="menu__sep" role="separator"></div>
  <button class="menu__item menu__item--danger" role="menuitem" type="button" data-toast data-toast-title="기기를 삭제하려면 집 설정에서 확인이 필요해요" data-toast-tone="danger" data-toast-icon="trash"><span data-icon="trash"></span>기기 삭제</button>
</div>
```
버튼 메뉴는 `data-menu="id"`(aria-haspopup·aria-expanded 자동). 단일 선택 `role="menuitemradio"`(트리거 안 `[data-menu-label]` 갱신). ↑↓ Home End, Esc(포커스 복귀). 정적 견본 `.menu.is-static`.

### modal — 확인 시트
```html
<div class="overlay modal" id="modal-door" role="alertdialog" aria-labelledby="modal-door-t" aria-describedby="modal-door-d">
  <div class="overlay__scrim" data-close></div>
  <div class="modal__sheet glass glass--z3">
    <span class="modal__glyph"><span data-icon="door"></span></span>         <!-- --danger · --lamp -->
    <h2 class="modal__title" id="modal-door-t">현관 문을 열까요?</h2>
    <p class="modal__text" id="modal-door-d">현관 도어락 D7 · 배터리 74%. 18:30 김순례 님 방문이 예정돼 있어요.</p>
    <div class="modal__actions"><button class="btn" type="button" data-close>취소</button><button class="btn btn--primary" type="button" data-close data-toast data-toast-title="현관 문을 열었어요" data-toast-icon="unlock">문 열기</button></div>
  </div>
</div>
<button class="btn" type="button" data-open="modal-door">문 열기</button>
```
반경 40 · 버튼 반경 24(동심). 559px 이하 아래 정렬 + 버튼 세로. **index 견본**: 후퇴한 미니 보드 위에 정적으로:
```html
<div class="modal-specimen" style="position:relative">            <!-- 장면 CSS에서 크기·반경 지정 -->
  <div class="receded">…미니 보드(.board + 타일)…</div>
  <div class="overlay modal is-static" role="dialog" aria-label="견본: 현관 문 열기 확인"><div class="overlay__scrim"></div><div class="modal__sheet glass glass--z3">…</div></div>
</div>
```

### motion
```html
<div class="board" data-rise-group id="rise-demo">
  <div class="cell cell--m glass widget" data-rise>…</div>   <!-- --i 는 그룹 순서대로 자동 -->
</div>
<button class="btn btn--sm" type="button" data-motion-replay="#rise-demo"><span data-icon="refresh"></span>다시 보기</button>
<button class="btn btn--sm" type="button" data-sweep-play="#sweep-demo .tile">빛 지나가기</button>
<div class="recede-demo glass" id="recede-demo"><div class="recede-demo__back">…</div><div class="recede-demo__front glass glass--z3">…</div></div>
<button class="btn btn--sm" type="button" data-recede-demo="#recede-demo" aria-pressed="false">물러나기</button>
<div class="ease-chip" id="ease-sheet" style="--curve: var(--ease-sheet)"><span class="ease-chip__name">ease-sheet · 420ms</span><div class="ease-chip__track"><span class="ease-chip__ball"></span></div></div>
<button class="btn btn--sm" type="button" data-ease-play="#ease-sheet">재생</button>
<p class="motion-note">움직임 줄이기 설정이 켜져 있어 최종 상태만 보여요.</p>   <!-- 감속 모션에서만 보임 -->
```
판 `.motion-stage`(+ `.motion-stage__cap`). `[data-rise]` 는 **기본이 보이는 상태**다. app.js 가 초기화 때 '화면 밖'에 있는 것에만 `.is-pending`(투명)을 붙이고, 화면에 들어오면 `.is-in` 으로 떠오른다. 인쇄(`@media print`·`beforeprint`)와 로드 3초 뒤에는 남은 pending 을 전부 푼다 — 전체 페이지 캡처·썸네일·앵커 점프에서 내용이 사라지지 않는다.

### navbar — §1-1 상태 바 · §1-4 독 · §1-5 푸터

### pagination
```html
<div class="pager-dots" role="group" aria-label="장면 쪽">
  <button class="pager-dots__dot" type="button" aria-current="true" aria-label="1쪽"></button><button class="pager-dots__dot" type="button" aria-label="2쪽"></button>
</div>
<div class="pager" data-pager-for="device-table">
  <button class="pager__btn" type="button" data-page="prev" aria-label="이전 쪽"><span data-icon="chevron-left"></span></button>
  <span class="pager__label" aria-live="polite">1 <span>/ 3</span></span>
  <button class="pager__btn" type="button" data-page="next" aria-label="다음 쪽"><span data-icon="chevron-right"></span></button>
</div>
```
숫자 버튼 나열 금지. 표는 `<table id="device-table" data-page-size="6">` 와 짝지으면 자동.

### popover — 미니 조절판
```html
<button class="cell cell--m tile glass" type="button" data-popover="pop-kelvin" aria-expanded="false">…무드등 L2…</button>
<div class="popover glass glass--z3" id="pop-kelvin" role="dialog" aria-label="무드등 L2 색온도">
  <div class="popover__head"><span class="popover__title">색온도</span><span class="popover__value" id="pk-out">2,200K</span></div>
  <input class="range range--kelvin" id="pk" type="range" min="2200" max="6500" step="50" value="2200" data-format="kelvin" data-out="#pk-out" aria-label="색온도">
  <div class="popover__presets" role="group" aria-label="색상">
    <button class="popover__swatch popover__swatch--warm" type="button" aria-pressed="true" data-range="#pk" data-value="2200" aria-label="호박 2,200K"></button>
    <button class="popover__swatch popover__swatch--mid" type="button" data-range="#pk" data-value="4000" aria-label="서리 4,000K"></button>
    <button class="popover__swatch popover__swatch--cool" type="button" data-range="#pk" data-value="6500" aria-label="심해 6,500K"></button>
  </div>
  <p class="popover__text">17:42 갱신 · 배터리 12시간</p>
</div>
```
꼬리 없음, 트리거에서 8px. 바깥 클릭·Esc 닫힘. 정적 `.popover.is-static`. (`data-popover` 가 붙은 타일은 토글 대신 팝오버를 연다.)

### progress
```html
<div class="meter"><div class="meter__head"><span class="meter__label">허브 4.3.0 다운로드</span><span class="meter__value">62%</span></div>
  <div class="meter__bar" role="progressbar" aria-label="허브 4.3.0 다운로드" aria-valuenow="62" aria-valuemin="0" aria-valuemax="100" style="--v:62"></div>
  <div class="meter__foot">10/20(화) 자동 업데이트 예정</div></div>
<!-- .meter--lg(28px 알약) · --warning · --danger · --lamp · --indeterminate -->

<div class="ring-wrap ring-wrap--warning" role="meter" aria-label="필터 잔량" aria-valuenow="8" aria-valuemin="0" aria-valuemax="100" style="--ring-size:64px">
  <svg class="ring" viewBox="0 0 48 48" aria-hidden="true"><circle class="ring__track" cx="24" cy="24" r="20" pathLength="100"/><circle class="ring__fill" cx="24" cy="24" r="20" pathLength="100" style="--v:8"/></svg>
  <span class="ring__label">8%</span></div>

<div class="gauge" role="meter" aria-label="거실 온도 23.5도, 목표 24도" aria-valuenow="23.5" aria-valuemin="16" aria-valuemax="30" style="--gauge-size:160px">
  <svg viewBox="0 0 120 120" aria-hidden="true"><circle class="gauge__track" cx="60" cy="60" r="52" pathLength="100"/><circle class="gauge__fill" cx="60" cy="60" r="52" pathLength="100" style="--v:54"/></svg>
  <span class="gauge__tick" style="--t:57"></span>
  <div class="gauge__center"><span class="gauge__value">23.5°</span><span class="gauge__note">목표 24°C</span></div>
  <div class="gauge__scale"><span>16°</span><span>30°</span></div></div>
<!-- 270° 아크. --v·--t 는 0–100 (16–30°C 구간이면 (값−16)/14×100). 기본 앰버(따뜻함) · .gauge--cool · .gauge--success(공기질) -->

<div class="bullet"><div class="bullet__bar" role="img" aria-label="이번 달 예상 196kWh, 9월 214kWh" style="--v:82;--t:90"></div>
  <div class="bullet__legend"><span>예상 <strong>196kWh</strong></span><span>9월 214kWh</span></div></div>
```
숫자와 목표는 항상 텍스트로 함께(색만으로 구간 표시 금지).

### sidebar — §1-3 방 레일

### skeleton — 카메라 로딩
```html
<div class="skel-cam" aria-busy="true" aria-label="현관 카메라 영상 불러오는 중"><span class="spinner spinner--lg" aria-hidden="true"></span><span class="skel-cam__cap">영상 불러오는 중</span></div>
<div class="skel-group" aria-hidden="true"><div class="skel-row"><span class="skel skel--circle"></span><div class="skel-group grow"><span class="skel skel--title"></span><span class="skel skel--line" style="--w:80%"></span></div></div></div>
<!-- .skel--block style="--h:120px" -->
```

### spinner
```html
<span class="spinner" role="status" aria-label="허브 연결 중"></span>       <!-- --sm 16 · 기본 20 · --lg 32 · --xl 48, 색은 currentColor -->
<span class="spinner-row"><span class="spinner" aria-hidden="true"></span>허브 연결 중</span>
```

### steps — 기기 연결 4단계
```html
<div data-wizard data-finish-title="공기청정기 A3를 다시 연결했어요" data-finish-text="거실 · 17:42 갱신">
  <ol class="steps" aria-label="기기 연결 단계">          <!-- 559px 이하 세로 · 가로 유지 .steps--keep -->
    <li class="steps__item" data-state="done"><span class="steps__node">1</span><span class="steps__label">전원 확인</span></li>
    <li class="steps__item" data-state="current"><span class="steps__node">2</span><span class="steps__label">Wi-Fi 선택</span><span class="steps__meta">Yunseul_1802_5G</span></li>
    <li class="steps__item" data-state="todo"><span class="steps__node">3</span><span class="steps__label">방 지정</span><span class="steps__meta">거실</span></li>
    <li class="steps__item" data-state="todo"><span class="steps__node">4</span><span class="steps__label">이름 확인</span></li>
  </ol>
  <section data-wizard-panel><h2 class="t-h2">…</h2>…</section> ×4
  <div class="btn-row"><button class="btn" type="button" data-wizard-prev>이전</button><button class="btn btn--primary" type="button" data-wizard-next><span data-label>다음</span></button></div>
</div>
```
`data-state`: done(불투명 판 + 체크) · current(틸 + 링) · todo · error(`.steps__meta` 위험색). 마법사 밖에서 정적으로 쓸 때는 `<ol class="steps" style="--n:4;--p:.33">` 로 진행선 길이 지정.

### table — 기기 표
```html
<section class="panel glass panel--flush table-wrap" aria-labelledby="t-dev">
  <div class="panel__head"><h2 class="panel__title" id="t-dev">등록 기기 27대</h2><span class="push"><span class="badge badge--online">온라인 25</span><span class="badge badge--offline">오프라인 2</span></span></div>
  <div class="table-scroll" style="--table-max-h:520px">
    <table class="table table--stack" id="device-table" data-page-size="8">
      <caption class="sr-only">등록 기기 목록, 17:42 갱신</caption>
      <thead><tr><th scope="col" aria-sort="none"><button class="table__sort" type="button">기기</button></th><th scope="col">ID</th><th scope="col" aria-sort="none"><button class="table__sort" type="button">방</button></th><th scope="col">상태</th><th scope="col" class="num" aria-sort="none"><button class="table__sort" type="button">전력</button></th></tr></thead>
      <tbody>
        <tr><td class="table__primary"><span class="table__name"><span class="list__icon" data-tone="lamp"><span data-icon="bulb"></span></span>거실 메인등</span></td><td class="mono">YS-LGT-101</td><td>거실</td><td class="table__status"><span class="badge badge--lamp">켜짐 70%</span></td><td class="num" data-sort="12">12W</td></tr>
        <tr class="is-offline">…공기청정기 A3 · <span class="badge badge--offline">오프라인</span>…</tr>
        <tr aria-selected="true">…선택 행…</tr>
      </tbody>
    </table>
  </div>
  <div class="table-foot"><span>17:42 갱신</span><div class="pager" data-pager-for="device-table">…</div></div>
</section>
```
- 정렬: `th[aria-sort] > button.table__sort`. 숫자 정렬은 `td[data-sort]`(없으면 글자에서 숫자 추출).
- 639px(컨테이너) 이하 `.table--stack`: 1줄 = `.table__primary` + `.table__status`, 2줄 = 나머지 칸이 "·"로 이어진 메타.

### tabs — 방 필터
```html
<div class="tabs">
  <div class="tabs__track glass glass--z2">
    <div class="tabs__list scroll-x" role="tablist" aria-label="방 필터">
      <span class="tabs__ink" aria-hidden="true"></span>
      <button class="tabs__tab" role="tab" type="button" id="tab-all" aria-selected="true" aria-controls="panel-all">전체 <span class="tabs__count">27</span></button>
      <button class="tabs__tab" role="tab" type="button" id="tab-living" aria-selected="false" aria-controls="panel-living">거실 <span class="tabs__count">7</span></button>
      …
    </div>
  </div>
  <div class="tabs__panel" role="tabpanel" id="panel-all" aria-labelledby="tab-all" tabindex="0">…</div>
  <div class="tabs__panel" role="tabpanel" id="panel-living" aria-labelledby="tab-living" tabindex="0" hidden>…</div>
</div>
```
불투명 알약(`.tabs__ink`)이 220ms로 미끄러짐. ←→ Home End. 좁으면 가로 스크롤 + 오른쪽 페이드.

### timeline — 오늘 집 기록
```html
<ol class="tl" aria-label="오늘 집 기록">
  <li class="tl__row tl__row--muted"><time class="tl__time" datetime="2026-10-10T15:48">15:48</time><div class="tl__event glass"><span class="tl__glyph" data-tone="accent"><span data-icon="door"></span></span><span class="tl__text"><strong>도하 귀가</strong> <span>지문 · 귀가 장면</span></span></div></li>
  <li class="tl__row tl__row--now"><time class="tl__time" datetime="2026-10-10T17:40">17:40</time><div class="tl__event glass"><span class="tl__glyph"><span data-icon="download"></span></span><span class="tl__text"><strong>허브 4.3.0 다운로드</strong> <span>62%</span></span></div></li>
</ol>
```
글리프 톤 `data-tone="lamp|accent|danger|success|warning"`. 가장 최근 `--now`, 지난 일 `--muted`.

### toast — OS 알림 배너
JS로 띄움: `<button data-toast data-toast-src="단지 택배" data-toast-title="택배가 도착했어요" data-toast-text="무인택배함 B-12 · 늘봄마켓" data-toast-icon="package">` 또는 `ysToast({…})`. 우상단(모바일 상단 중앙)에서 떨어지고, 여러 개면 뒤 배너가 작아져 깊이 스택(호버 시 펼침), 5.2초 뒤 사라짐(호버·포커스 시 정지).
정적 스택 견본:
```html
<div class="toast-stack">
  <div class="toast glass glass--z3" role="status"><span class="toast__app"><span data-icon="package"></span></span>
    <div class="toast__top"><span class="toast__src">단지 택배</span><span class="toast__time">16:20</span></div>
    <div class="toast__body"><strong class="toast__title">택배가 도착했어요</strong><span class="toast__text">무인택배함 B-12 · 늘봄마켓</span></div>
    <button class="btn btn--icon btn--sm toast__close" type="button" data-dismiss aria-label="알림 닫기"><span data-icon="close"></span></button></div>
</div>
```
앱 아이콘 톤 `data-tone="lamp|danger|success|neutral"`(기본 틸). 배너 안 행동 `.toast__actions`.

### tooltip
```html
<button class="btn btn--icon" type="button" aria-label="방해금지" data-tip="방해금지 23:00–07:00"><span data-icon="moon"></span></button>
<span class="tooltip is-static">거실 메인등 <kbd>L</kbd></span>   <!-- 정적 견본 -->
```
두 모드 모두 짙은 유리 + 밝은 글자, 300ms 지연, focus-visible에도 뜸, Esc로 닫힘. 독 아이콘은 모두 `data-tip`.

---

## 5. 장면 작성 체크리스트

1. 첫 화면에 eyebrow·2줄 헤드라인·CTA 쌍·통계 4개 줄 금지. 섹션 머리는 `.group-label` 만.
2. 위젯은 `.board` + `.cell--*` 로만 크기를 갖는다. 벽보형 빈칸은 `dense` + 셀 배수로 없앤다.
3. 섹션마다 최소 한 판은 `.overlap` 로 다른 판 모서리를 덮는다. 가운데 정렬 고정폭 컨테이너 반복 금지.
4. 오버레이는 열린 정적 견본(`.is-static`) + 실제 트리거(`data-open` 등)를 둘 다.
5. 시각·금액·ID·이름은 팩트 시트 값만. 날짜 표기 `10/14(수)`, 금액 `₩241,380`, 시각 24시간제 `17:42`.
6. 360/390px 가로 스크롤 0, 터치 타깃 44px, 다크는 "밤 장면"(틸 → 다리 조명 시안, 켜진 타일은 밝은 판 + 앰버 글로우).
7. 장면(z0) 위 글자는 전부 유리 위에: 섹션 라벨은 `.group-label--float`, 타임라인은 유리 판 안. 사진·영상 위 배지는 `.badge--on-media`.
8. 옆 패널(~540px) 안의 작은 표는 `.table--stack` 대신 일반 `.table` + `.table-scroll` — `.table--stack` 은 컨테이너 ≤639px 에서 2줄 행으로 바뀐다.
9. 테마에 따라 달라지는 것은 **크롬의 시계·날씨만**(`.only-light`/`.only-dark` 두 벌: 라이트 17:42 · 맑음 17° / 다크 22:40 · 맑음 13°). 본문 데이터는 두 모드 모두 17:42 기준 — 다크는 "같은 데이터를 밤 창 앞에서 보는 것"이다. 상태 바 `.statusbar__basis`("데이터 17:42 기준")와 index 잠금 시계 아래 캡션으로 기준을 밝히고, 본문에 `only-dark` 시각 분기(만료됨·22:40 갱신 등)를 만들지 않는다(DIRECTION 팩트 시트).
10. 오버레이(모달·드로어·커맨드·메뉴·팝오버)는 `.app` 밖 body 직계. 방 레일 시트는 `.app` 안에 있으므로 app.js 가 열 때 `html[data-rail-open-state]` 로 `.app` 을 크롬 위로 올리고 스크림을 레일 바로 앞에 넣는다 — 레일 마크업을 옮기지 말 것.
