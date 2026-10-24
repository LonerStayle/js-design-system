# gyeol · 컴포넌트 마크업 계약

index.html 과 pages/*.html 을 만드는 단계는 이 문서만 보고 마크업한다. 세계관, 카피, 숫자는 `DIRECTION.md` 2절 팩트 시트에 있는 값만 쓴다.

- 클래스는 BEM(`block__elem--mod`)으로 쓴다. 상태는 가능하면 **ARIA 속성**(`aria-selected`, `aria-expanded`, `aria-pressed`, `aria-current`, `aria-invalid`, `aria-busy`, `aria-disabled`)으로 표현하고, CSS가 그 속성을 읽는다.
- 인라인 `style` 은 CSS 변수 주입(`--value`, `--w`, `--h`, `--cols`, `--art-size`, `--chart-h`, `--slide-w`)에만 쓴다. 인라인 grid-template-columns, onclick, `href="#"` 는 쓰지 않는다.
- 장면 전용 레이아웃은 `index.css` / `pages/<name>.css` 에만 쓴다. 장면 CSS 도 semantic 토큰(`--surface`, `--ink-2`, `--line`, `--mood-a` …)만 쓴다. 원시 토큰(`--coral-500`, `--lilac-*`)과 hex는 쓰지 않는다.
- **메쉬는 무대에만, UI 면은 단색이다.** 그라디언트가 들어가는 곳은 (a) 무대 장면·페이지 무대 띠, (b) 커버 아트·아바타, (c) 진행선·활성 신호선, 이렇게 세 곳뿐이다. 버튼, 배지, 카드, 숫자 글자에는 그라디언트를 채우지 않는다.
- 메쉬 위에 바로 올리는 글자는 `--t-statement` 이상 크기뿐이다. 14px 이하 글자는 반드시 `.plate` 위에 둔다.

---

## 0. 공통 머리말 (모든 HTML)

```html
<!doctype html>
<html lang="ko" data-mood="001">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="theme-color" content="#F4F2F7">
<title>관제 콘솔 · gyeol</title>
<script>(function(){var d=document.documentElement,q=new URLSearchParams(location.search).get('theme'),t=(q==='dark'||q==='light')?q:null;if(!t){try{t=localStorage.getItem('gy-theme')}catch(e){}}if(t!=='dark'&&t!=='light'){t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}d.setAttribute('data-theme',t)})();</script>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Azeret+Mono:wght@400;500&family=Noto+Sans+KR:wght@300;400;500;700;900&family=Red+Hat+Display:wght@300;500;700;900&family=Red+Hat+Text:wght@400;500;700&display=swap">
<link rel="stylesheet" href="../styles.css">      <!-- index 는 styles.css -->
<link rel="stylesheet" href="dashboard.css">      <!-- 장면 전용. index 는 index.css -->
<script src="../app.js" defer></script>            <!-- index 는 app.js -->
</head>
```

- `localStorage` 키는 `gy-theme` 이다. URL `?theme=dark|light` 가 가장 우선이고, 이 값은 저장하지 않는다.
- `<title>` 형식은 `장면명 · gyeol` 이고, index 는 `결 3.0 키노트 〈소리의 색〉 · gyeol` 이다.
- `<html data-mood>` 는 그 페이지의 기본 무드다. 무드는 `001 014 037 062 090` 다섯 가지이고, 기본은 `001`(첫 소절)이다. 페이지별 권장값은 profile=`014`, 404=`001`(회색에서 시작), 그 외는 `001` 이다.
- 테마는 두 가지 장면이다. 라이트는 **2026-10-26(월) 14:00 낮 리허설**, 다크는 **2026-10-27(화) 19:00 본 행사**다. 낮과 밤에 따라 문구가 달라지는 곳은 `data-show-theme="light|dark"` 로 둘 다 써 둔다.

---

## 1. 공통 셸 스니펫 (복사해서 그대로 쓴다)

경로 차이는 index(`pages/x.html`)와 pages(`x.html`, `../index.html`)뿐이다. 나머지 마크업은 한 글자도 바꾸지 않는다. `aria-current="page"` 만 현재 페이지에 맞게 옮긴다.

### 1-1. navbar — index 경로

```html
<a class="skip-link" href="#main">본문으로 건너뛰기</a>
<header class="navbar">
  <div class="navbar__inner">
    <a class="navbar__brand" href="index.html" aria-label="결 3.0 키노트 처음으로"><span class="wordmark">gyeol</span><span class="navbar__version">결 3.0</span></a>
    <nav class="navbar__links" aria-label="주요">
      <a class="navbar__link" href="index.html" aria-current="page">키노트</a>
      <a class="navbar__link" href="pages/pricing.html">요금제</a>
      <a class="navbar__link" href="pages/product.html">결 오브</a>
      <a class="navbar__link" href="pages/profile.html">2026 결산</a>
      <a class="navbar__link" href="pages/dashboard.html">콘솔</a>
    </nav>
    <div class="navbar__end">
      <span class="badge badge--live" data-show-theme="dark">라이브</span>
      <span class="badge badge--outline" data-show-theme="light">리허설</span>
      <button type="button" class="navbar__search" data-command-open aria-label="명령 팔레트 열기"><span data-icon="search"></span><span class="navbar__search-label">장면·무드 찾기</span><kbd>⌘K</kbd></button>
      <button type="button" class="btn btn--quiet btn--icon navbar__more" data-menu="nav-more" data-align="end" aria-haspopup="menu" aria-expanded="false" aria-controls="nav-more" aria-label="페이지 메뉴"><span data-icon="menu"></span></button>
      <button type="button" class="btn btn--quiet btn--icon" data-theme-toggle aria-pressed="false" aria-label="밤 본 행사 장면으로 전환"><span class="theme-ic--moon" data-icon="moon"></span><span class="theme-ic--sun" data-icon="sun"></span></button>
    </div>
  </div>
  <div class="navbar__line" aria-hidden="true"><span class="navbar__fill"></span></div>
</header>
<div class="menu" id="nav-more" role="menu" aria-label="페이지" data-align="end" hidden>
  <a class="menu__item" role="menuitem" href="index.html" aria-current="page"><span data-icon="broadcast"></span><span class="menu__text">키노트</span></a>
  <a class="menu__item" role="menuitem" href="pages/pricing.html"><span data-icon="ticket"></span><span class="menu__text">요금제</span></a>
  <a class="menu__item" role="menuitem" href="pages/product.html"><span data-icon="orb"></span><span class="menu__text">결 오브</span></a>
  <a class="menu__item" role="menuitem" href="pages/profile.html"><span data-icon="star"></span><span class="menu__text">2026 결산</span></a>
  <hr class="menu__sep">
  <a class="menu__item" role="menuitem" href="pages/dashboard.html"><span data-icon="pulse"></span><span class="menu__text">런칭 콘솔</span></a>
</div>
```

### 1-2. navbar — pages 경로

`aria-current="page"` 는 현재 페이지에 맞춰 옮긴다. pricing → 요금제, product → 결 오브, profile → 2026 결산, dashboard·inbox·kanban·settings → 콘솔. onboarding·404 에는 붙이지 않는다.
**콘솔 4페이지(dashboard·inbox·kanban·settings)만** `navbar__inner` 맨 앞에 사이드바 여는 버튼(`panel-left` 아이콘, `aria-label="콘솔 메뉴"`)을 넣고, `navbar--flat`(1px 선, 진행선 없음)을 쓴다.
**콘솔 4페이지에는 오른쪽 ≡(`navbar__more`)와 `#nav-more` 메뉴를 넣지 않는다.** 아이콘 버튼이 두 개 겹치지 않게, 모바일에서는 사이드바 드로어 하나가 주요 링크(키노트 덱·요금제·결 오브·2026 결산)까지 품는다(1-5).

```html
<a class="skip-link" href="#main">본문으로 건너뛰기</a>
<header class="navbar">                       <!-- 콘솔 4페이지: class="navbar navbar--flat" -->
  <div class="navbar__inner">
    <!-- 콘솔 4페이지 전용 ↓ -->
    <button type="button" class="btn btn--quiet btn--icon navbar__menu-btn" data-open="sidebar" aria-controls="sidebar" aria-expanded="false" aria-label="콘솔 메뉴"><span data-icon="panel-left"></span></button>
    <!-- 콘솔 4페이지 전용 ↑ -->
    <a class="navbar__brand" href="../index.html" aria-label="결 3.0 키노트 처음으로"><span class="wordmark">gyeol</span><span class="navbar__version">결 3.0</span></a>
    <nav class="navbar__links" aria-label="주요">
      <a class="navbar__link" href="../index.html">키노트</a>
      <a class="navbar__link" href="pricing.html">요금제</a>
      <a class="navbar__link" href="product.html">결 오브</a>
      <a class="navbar__link" href="profile.html">2026 결산</a>
      <a class="navbar__link" href="dashboard.html">콘솔</a>
    </nav>
    <div class="navbar__end">
      <span class="badge badge--live" data-show-theme="dark">라이브</span>
      <span class="badge badge--outline" data-show-theme="light">리허설</span>
      <button type="button" class="navbar__search" data-command-open aria-label="명령 팔레트 열기"><span data-icon="search"></span><span class="navbar__search-label">장면·무드 찾기</span><kbd>⌘K</kbd></button>
      <!-- 콘솔 4페이지에서는 아래 navbar__more 버튼과 #nav-more 메뉴를 통째로 뺀다 ↓ -->
      <button type="button" class="btn btn--quiet btn--icon navbar__more" data-menu="nav-more" data-align="end" aria-haspopup="menu" aria-expanded="false" aria-controls="nav-more" aria-label="페이지 메뉴"><span data-icon="menu"></span></button>
      <button type="button" class="btn btn--quiet btn--icon" data-theme-toggle aria-pressed="false" aria-label="밤 본 행사 장면으로 전환"><span class="theme-ic--moon" data-icon="moon"></span><span class="theme-ic--sun" data-icon="sun"></span></button>
    </div>
  </div>
  <div class="navbar__line" aria-hidden="true"><span class="navbar__fill"></span></div>
</header>
<div class="menu" id="nav-more" role="menu" aria-label="페이지" data-align="end" hidden>   <!-- 콘솔 4페이지 제외 -->
  <a class="menu__item" role="menuitem" href="../index.html"><span data-icon="broadcast"></span><span class="menu__text">키노트</span></a>
  <a class="menu__item" role="menuitem" href="pricing.html"><span data-icon="ticket"></span><span class="menu__text">요금제</span></a>
  <a class="menu__item" role="menuitem" href="product.html"><span data-icon="orb"></span><span class="menu__text">결 오브</span></a>
  <a class="menu__item" role="menuitem" href="profile.html"><span data-icon="star"></span><span class="menu__text">2026 결산</span></a>
  <hr class="menu__sep">
  <a class="menu__item" role="menuitem" href="dashboard.html"><span data-icon="pulse"></span><span class="menu__text">런칭 콘솔</span></a>
</div>
```

- 폭에 따른 navbar 동작: 1100px 이하에서는 검색 라벨이 숨는다. 1024px 이하에서는 사이드바 버튼(panel-left)이 나타난다(콘솔). 900px 이하에서는 링크가 숨고, 콘솔이 아닌 페이지에서만 `navbar__more`(≡) 메뉴가 보인다. 901px 이상에서는 index 를 포함해 ≡ 를 숨긴다(링크가 다 보이므로). 640px 이하에서는 버전·배지가 숨고 검색이 44px 아이콘 버튼이 된다.
- 하단 3px 진행선 `navbar__fill` 은 app.js 가 `--progress`(스크롤 진행률)로 채운다. 색은 현재 무드 P1→P3 이다.
- 테마 토글 아이콘은 CSS가 바꾼다. 낮에는 달 아이콘, 밤에는 해 아이콘이 보인다. `aria-label` 과 `aria-pressed` 는 app.js 가 맞춘다.

### 1-3. footer (1종) — index 경로

```html
<footer class="site-footer">
  <div class="site-footer__inner">
    <div class="site-footer__brand">
      <a class="site-footer__word" href="index.html">gyeol</a>
      <p class="site-footer__tag">지금 기분을 색으로 고르면, 그 색의 음악이 이어집니다.</p>
    </div>
    <div class="site-footer__col"><h2>키노트</h2><ul>
      <li><a href="index.html">〈소리의 색〉 덱</a></li>
      <li><a href="pages/pricing.html">요금제</a></li>
      <li><a href="pages/product.html">결 오브</a></li>
    </ul></div>
    <div class="site-footer__col"><h2>청취자</h2><ul>
      <li><a href="pages/onboarding.html">결 3.0 첫 실행</a></li>
      <li><a href="pages/profile.html">2026 결산</a></li>
      <li><a href="pages/settings.html">앱 설정</a></li>
    </ul></div>
    <div class="site-footer__col"><h2>런칭 콘솔</h2><ul>
      <li><a href="pages/dashboard.html">관제 콘솔</a></li>
      <li><a href="pages/inbox.html">문의함</a></li>
      <li><a href="pages/kanban.html">큐시트 보드</a></li>
    </ul></div>
    <div class="site-footer__legal">
      <address>주식회사 결사운드 · 대표 한지수 · 서울 성동구 연무장길 41, 4층 (우 04782)<br>사업자등록번호 <span class="mono">214-88-04270</span> · 통신판매업 <span class="mono">2021-서울성동-01027</span></address>
      <p>고객센터 <span class="mono">1588-0427</span> · 평일 10:00–19:00 (점심 12:30–13:30) · help@gyeol.kr</p>
    </div>
  </div>
</footer>
```

### 1-4. footer — pages 경로

1-3과 같고 링크만 바꾼다. `index.html` → `../index.html`, `pages/x.html` → `x.html`. 현재 페이지 링크에는 `aria-current="page"` 를 단다.

```html
<footer class="site-footer">
  <div class="site-footer__inner">
    <div class="site-footer__brand">
      <a class="site-footer__word" href="../index.html">gyeol</a>
      <p class="site-footer__tag">지금 기분을 색으로 고르면, 그 색의 음악이 이어집니다.</p>
    </div>
    <div class="site-footer__col"><h2>키노트</h2><ul>
      <li><a href="../index.html">〈소리의 색〉 덱</a></li>
      <li><a href="pricing.html">요금제</a></li>
      <li><a href="product.html">결 오브</a></li>
    </ul></div>
    <div class="site-footer__col"><h2>청취자</h2><ul>
      <li><a href="onboarding.html">결 3.0 첫 실행</a></li>
      <li><a href="profile.html">2026 결산</a></li>
      <li><a href="settings.html">앱 설정</a></li>
    </ul></div>
    <div class="site-footer__col"><h2>런칭 콘솔</h2><ul>
      <li><a href="dashboard.html">관제 콘솔</a></li>
      <li><a href="inbox.html">문의함</a></li>
      <li><a href="kanban.html">큐시트 보드</a></li>
    </ul></div>
    <div class="site-footer__legal">
      <address>주식회사 결사운드 · 대표 한지수 · 서울 성동구 연무장길 41, 4층 (우 04782)<br>사업자등록번호 <span class="mono">214-88-04270</span> · 통신판매업 <span class="mono">2021-서울성동-01027</span></address>
      <p>고객센터 <span class="mono">1588-0427</span> · 평일 10:00–19:00 (점심 12:30–13:30) · help@gyeol.kr</p>
    </div>
  </div>
</footer>
```

### 1-5. sidebar + 콘솔 레이아웃 (dashboard · inbox · kanban · settings 전용, pages 경로)

```html
<div class="app">
  <aside class="sidebar" id="sidebar" aria-label="런칭 콘솔">
    <div class="sidebar__head"><span class="wordmark">gyeol</span><button type="button" class="btn btn--quiet btn--icon" data-close="sidebar" aria-label="콘솔 메뉴 닫기"><span data-icon="close"></span></button></div>
    <a class="sidebar__mood" href="../index.html#s03"><span class="sidebar__mesh mesh mesh--drift" aria-hidden="true"></span><span class="sidebar__mood-text"><span class="mono" data-mood-id>MOOD-001</span><b data-mood-name>첫 소절</b><span>지금 무대 무드</span></span></a>
    <p class="sidebar__heading">런칭 콘솔</p>
    <ul class="sidebar__list">
      <li><a class="sidebar__link" href="dashboard.html" aria-current="page"><span data-icon="pulse"></span><span class="sidebar__label">관제 콘솔</span><span class="sidebar__meta">20:42</span></a></li>
      <li><a class="sidebar__link" href="inbox.html"><span data-icon="inbox"></span><span class="sidebar__label">문의함</span><span class="sidebar__count" aria-label="안 읽은 문의 12건">12</span></a></li>
      <li><a class="sidebar__link" href="kanban.html"><span data-icon="columns"></span><span class="sidebar__label">큐시트 보드</span><span class="sidebar__meta">6 / 14</span></a></li>
      <li><a class="sidebar__link" href="settings.html"><span data-icon="sliders"></span><span class="sidebar__label">앱 설정</span></a></li>
    </ul>
    <p class="sidebar__heading">키노트</p>
    <ul class="sidebar__list">
      <li><a class="sidebar__link" href="../index.html"><span data-icon="broadcast"></span><span class="sidebar__label">〈소리의 색〉 덱</span></a></li>
      <li><a class="sidebar__link" href="pricing.html"><span data-icon="ticket"></span><span class="sidebar__label">요금제</span></a></li>
      <li><a class="sidebar__link" href="product.html"><span data-icon="orb"></span><span class="sidebar__label">결 오브 사전예약</span><span class="sidebar__meta">7,830</span></a></li>
      <li><a class="sidebar__link" href="profile.html"><span data-icon="star"></span><span class="sidebar__label">2026 결산</span></a></li>
    </ul>
    <div class="sidebar__foot"><span class="avatar" data-mood="014">하린</span><span><b>정하린</b><span>런칭 PM · harin@gyeol.kr</span></span></div>
  </aside>
  <main class="app__main" id="main">
    <section class="stage-band mesh mesh--drift" data-mesh-follow>   <!-- 페이지에서 메쉬가 허용되는 유일한 곳. 콘솔 띠에는 핸들을 두지 않는다(3-1) -->
      <div class="stage-band__inner">
        <div class="stack stack--2">
          <nav class="crumbs crumbs--on-mesh" aria-label="현재 위치"><ol><li><a href="dashboard.html">콘솔</a></li><li><span aria-current="page">관제</span></li></ol></nav>
          <h1 class="t-statement tnum">41,092명</h1>
          <p class="t-sub">이 지금 결 3.0 키노트를 보고 있어요</p>
        </div>
        <p class="plate plate--ink plate--stack"><span>10월 27일 화요일 <span class="mono">20:42</span></span><span>키노트 종료 32분 뒤 · 라이브 집계</span></p>
      </div>
    </section>
    <div class="app__body stack stack--5">
      … 단색 정보 영역(패널·표·차트) …
    </div>
  </main>
</div>
<!-- 그 뒤에 footer(1-4) -->
```

- 데스크톱(>1024)에서 사이드바는 240px 고정 열이다. 1024px 이하에서는 왼쪽에서 나오는 오프캔버스가 되고, navbar 버튼이 연다. 스크림, Esc, 포커스 트랩은 app.js 가 처리한다. `hidden` 속성은 붙이지 않는다.
- 사이드바 링크 메타는 팩트 시트 값을 쓴다. 문의함 12, 보드 완료 6/14, 오브 사전예약 7,830대.
- 콘솔 페이지 무대 띠 아래(`app__body`)에는 메쉬를 깔지 않는다.
- **무대 띠 구도는 페이지마다 다르다(같은 틀 반복 금지).**
  - dashboard: 숫자 "41,092명"이 우측 2/3 앵커(오른쪽 정렬), 왼쪽 1/3에 `[data-livechart-spark]` 미니 스파크라인 플레이트. 숫자는 `<span data-livechart-sync>` 로 아래 실시간 차트와 같은 값을 쓴다. 궤도 `mesh--drift-d`.
  - inbox: 168px 낮은 띠. 왼쪽 "문의 12건", 오른쪽에 발신자 무드 아바타 12개(`button.inbox-band__av[data-inbox-pick]`, 누르면 그 문의가 열림). 궤도 `mesh--drift-e`.
  - kanban: "6 / 14" 카운터와 14칸 큐 진행선(`.kb-band__ticks`)이 한 줄로 이어지는 가로 구도. 궤도 `mesh--drift-e`.
  - settings: 글자는 왼쪽, 오른쪽 열의 미리보기 오브(`.set-preview__stage`)가 띠 아래 가장자리를 뚫고 내려온다(>1100px). 궤도 `mesh--drift-f`.

### 1-6. 일반 페이지 레이아웃 (pricing · product · profile · onboarding · 404)

```html
<!-- navbar(1-2) -->
<main class="page" id="main">
  <section class="stage-band mesh">…무대 띠(선택)…</section>
  <div class="wrap">… 페이지 본문 …</div>
</main>
<!-- footer(1-4) -->
```
`.page` 는 navbar 높이(64px)만큼 위 여백을 준다. `.wrap` 은 1296px 폭에 좌우 세이프 에어리어를 둔다. onboarding·404 처럼 화면 전체가 무대인 페이지는 `<main class="page">` 안에 `.stage.mesh` 를 바로 두고, 무대가 첫 화면을 채운다.

### 1-7. index 키노트 덱 셸 (index 전용)

```html
<!-- navbar(1-1) -->
<main id="main" data-deck>
  <section class="stage stage--title mesh mesh--drift" id="s01" data-chapter="오프닝" data-mood="001" data-mesh-follow aria-labelledby="s01-t">
    …핸들 4개(3-1)…
    <div class="stage__inner">… <h1 class="t-stage" id="s01-t" data-reveal="headline">결 3.0</h1> …</div>
    <p class="stage__chapter" aria-hidden="true">오프닝</p>
  </section>
  <section class="stage stage--ink scope-dark" id="s02" data-chapter="한 문장" aria-label="한 문장">…</section>
  <section class="stage stage--bg" id="s04" data-chapter="숫자 하나">…</section>
  …
</main>
<div class="clicker" data-mood="001">   <!-- 하단 56px 반투명 단색 띠(--bg 88% + 1px 상단 라인) -->
  <span class="clicker__chapter" data-clicker-chapter>오프닝</span>
  <span class="clicker__nav">
    <button type="button" class="btn btn--plate btn--icon btn--sm" data-deck-prev aria-label="이전 장면"><span data-icon="chevron-left"></span></button>
    <button type="button" class="btn btn--plate btn--icon btn--sm" data-deck-next aria-label="다음 장면"><span data-icon="chevron-right"></span></button>
  </span>
  <span class="clicker__count" data-clicker-count><b>01</b><span> / 12</span></span>
  <span class="clicker__line" aria-hidden="true"></span>
</div>
<!-- footer(1-3) — 12장면 뒤 -->
```
- 클리커는 `--clicker-h: 56px` 띠다. 모든 덱 장면은 `padding-bottom ≥ 띠 높이 + 24px` 를 비운다. 잉크 장면에서는 app.js 가 띠에 `.scope-dark` 를 달아 밤 토큰으로 바꾸고, 푸터가 보이면 `.is-off` 로 걷는다. 640px 이하에서는 이전/다음·챕터를 숨기고 카운터만 우상단(navbar 아래 12px)에 붙는다.
- `[data-deck]` 아래의 `[data-chapter]` 장면이 슬라이드다. app.js 가 IntersectionObserver 로 클리커 챕터명, `07 / 12` 카운터, navbar·clicker 의 `data-mood` 를 갱신한다. ←/→/PageUp/PageDown 으로 장면을 옮긴다(입력 포커스·탭·캐러셀·칸반 안에서는 무시).
- 장면 바탕은 `.mesh`(메쉬) → `.stage--ink.scope-dark`(잉크 단색. 라이트 모드에서도 밤 토큰을 쓴다) → `.stage--bg`(바탕) 순서로 교대한다. 같은 바탕이 3장면 이상 이어지지 않게 한다. "하나 더" 장면만 `.stage--night.scope-dark` 다(양 모드 공통 #0A0910).
- 장면 안 앵커 배치(좌하단·중앙·좌상단·우측 2/3·풀블리드)는 `index.css` 에서 장면 id 로 잡는다.
- 목차 링크는 `<a href="#s03" data-scene-link>` 로 쓴다. 클릭하면 덱 이동이 되고, 현재 장면에 `aria-current="true"` 가 붙는다.

---

## 2. 토큰 요약 (semantic.css · tokens.css)

| 용도 | 토큰 |
|---|---|
| 면 | `--bg` 페이지 · `--surface` 패널·입력 · `--surface-2` 눌린 면·표 머리·스켈레톤 · `--surface-hover` `--surface-press` · `--stage-ink` 잉크 장면 |
| 글자 | `--ink` `--ink-2` `--ink-3` `--placeholder` |
| 괘선 | `--line` 헤어라인 · `--line-strong` · `--line-control` 입력 테두리 |
| 기본 버튼 | `--primary` / `--on-primary` (낮 잉크 필 → 밤 흰 필) `--primary-hover` `--primary-press` |
| 시그널 코랄 | `--signal` 채움(재생·라이브·사전예약) / `--on-signal`(채움 위 글자는 항상 잉크) · `--signal-ink` 코랄 글자·링크 · `--signal-tint` |
| 상태 | `--info` `--success` `--warning` `--danger` + 각 `-tint` |
| 무대 자막 면 | `--cue` / `--on-cue` `--on-cue-2` `--cue-link` `--cue-hover` `--on-cue-success/warning/danger/info` (툴팁·토스트·팝오버·마퀴, 양 모드 잉크) |
| 비활성 | `--disabled-bg` `--disabled-ink` `--disabled-line` |
| 포커스 | `--focus` (낮 울트라마린 / 밤 코랄) `--focus-inner` |
| 오버레이 | `--scrim` `--shadow-overlay` `--overlay-line` |
| 결 오브 실물 색 | `--orb-ink` `--orb-moon` `--orb-coral` (양 모드 동일) |
| 코드 | `--code-bg` `--code-ink` `--code-ink-2` `--code-key` `--code-str` `--code-num` `--code-prop` |
| **무드** | `--mood-1..4` 원색(커버 아트) · `--mood-day-0..4` 낮 무대 틴트 · `--mood-night-0..4` 밤 무대 · **`--mood-a` → `--mood-b` 진행선·활성 신호** |
| 타입 | `--t-stage` 88–248 · `--t-statement` 40–96 · `--t-headline` 30–52 · `--t-title` 24 · `--t-sub` 19–26(300) · `--t-lead` 19 · `--t-body` 17 · `--t-ui` 15 · `--t-small` 14 · `--t-caption` 12 |
| 폰트 | `--font-display` Red Hat Display+Noto Sans KR · `--font-text` Red Hat Text+Noto Sans KR · `--font-kr` · `--font-mono` Azeret Mono(한글은 Noto Sans KR 로 떨어진다) |
| 간격 | `--sp-1..10` = 4·8·12·16·24·32·40·64·96·128 · `--safe` clamp(20–72) |
| 반경 | `--r-badge 6` `--r-tip 8` `--r-art 12` `--r-input 14` `--r-plate 16` `--r-panel 24` `--r-pill 999` · 무대는 0 |
| 모션 | `--ease-stage` `--ease-ui` · `--dur-ui 160` `--dur-panel 320` `--dur-scene 640` `--dur-mood 900` `--dur-drift 10s` |
| 치수 | `--navbar-h 64` `--sidebar-w 240` `--drawer-w 440` `--tap 44` `--content-max 1296` |

**SVG**: presentation attribute 에 `var()` 를 쓰지 않는다. `<path style="stroke:var(--mood-a)">` 처럼 style 로 쓰거나, 클래스로 칠하거나(`.livechart__line`), `currentColor` 를 쓴다.

---

## 3. base.css 프리미티브와 시그니처

| 클래스 | 설명 |
|---|---|
| `.t-stage .t-statement .t-headline .t-title .t-sub .t-lead .t-body .t-small .t-caption` | 타입 스케일. 디스플레이는 900, `.t-sub` 은 300(극대비가 이 테마의 문법이다) |
| `.t-light .t-black` `.mono` `.tnum` `.latin` `.label-ko` | 웨이트, 모노(ID·hex·시각·카운터, 라틴·숫자에만), tabular 숫자, 라틴 자간, 한글 라벨 자간 0 |
| `.ink-2 .ink-3 .signal-ink .measure` | 보조색, 34em 폭 |
| `.wrap` `.grid-12` + `.span-3..9/.span-12` | 1296 컨테이너, 12단(≤900 전폭 스택) |
| `.stack` (`--2/3/5/6/8`) `.cluster` `.split` `.push` | 세로 스택, 줄바꿈 가로 묶음, 양끝 정렬 |
| `.panel` (`--flush`) `.panel__head` `.panel__title` | 단색 패널 24px, 그림자 없음 |
| `.plate` (`--ink` `--sm` `--text` `--stack`) | 메쉬 위 작은 글자를 올리는 단색 판(16px). 기본은 inline-flex(아이콘 + 글 한 덩어리 `<span>`). **글과 `.mono` 가 섞인 문장은 `--text`(inline-block) 를 쓰거나 글 전체를 `<span>` 하나로 감싼다** — 그대로 두면 글 조각이 따로 flex 아이템이 돼 '14:0 / 0' 처럼 끊긴다. `--stack` 은 두 줄(위 시각 · 아래 설명). `.plate .mono` 는 줄바꿈하지 않는다 |
| `.dot` `.divider` `.sr-only` `.skip-link` `.truncate` `.hide-sm` `.show-sm` | 유틸(≤640 기준) |
| `[data-show-theme="light|dark"]` | 낮·밤 장면별 표시 |

### 3-1. 시그니처 1 — 무드 메쉬 `.mesh`

```html
<section class="mesh mesh--drift" data-mood="014" data-mesh-follow>
  <span class="mesh__handle" data-p="1"><span class="mesh__label"><b>P1</b> <span data-mesh-hex="1">#00B8C8</span></span></span>
  <span class="mesh__handle" data-p="2" data-flip="x"><span class="mesh__label"><b>P2</b> <span data-mesh-hex="2">#2E5BFF</span></span></span>
  <span class="mesh__handle" data-p="3" data-flip="x y"><span class="mesh__label"><b>P3</b> <span data-mesh-hex="3">#9FF2E0</span></span></span>
  <span class="mesh__handle" data-p="4" data-flip="y"><span class="mesh__label"><b>P4</b> <span data-mesh-hex="4">#0B1F5C</span></span></span>
  …내용…
</section>
```
- 낮에는 `--mood-day-*` 틴트(잉크 글자 AAA), 밤에는 `--mood-night-*`(흰 글자 ≥6:1)를 쓰고 글자색이 흰색으로 바뀐다. blur와 블렌드 모드는 없다.
- **핸들은 글자 위에 얹히지 않는다.** 장면 내용(`.mesh > *`)은 z 3, 핸들은 z 2라 글자 뒤로 지나간다(404 복구 게임의 `button.mesh__handle` 만 z 4). 드리프트 궤도는 글자 앵커에 맞춰 고른다: `--drift`(A: 글자 좌측·좌하단 → 핸들은 상단 가장자리·우측 1/3), `--drift-b`(B: 중앙 패널 → 네 모서리), `--drift-c`(C: 좌상단 글자 + 아래 카드), `--drift-d`(D: 글자 우측), `--drift-e`(E: 낮은 띠, 위·아래 가장자리 줄), `--drift-f`(F: settings). 그래도 포인터 추종·좁은 폭에서 핸들(+라벨)이 글자 상자와 겹치면 app.js 핸들 가드가 `.is-veiled` 로 잠시 숨긴다.
- 변형: `--drift`(10s 제어점 드리프트, 화면 밖이면 정지) · `--soft`(넓은 퍼짐) · `--tight` · `--raw`(커버 아트와 같은 원색. **위에 글자 금지**, `.plate` 만) · `--mute`(회색 메쉬, `.lit-1..4` 로 색 복귀) · `--stage`(100svh).
- `data-mesh-follow` 를 달면 포인터에 가장 가까운 제어점이 ±6% 따라온다(터치·축소 모션에서는 꺼짐).
- `data-mesh-hex="1..4"` 는 app.js 가 **지금 실제로 칠해진 stop 값**(낮 = `--mood-day-N` 리허설 틴트, 밤·`.scope-dark` = `--mood-night-N`, `.mesh--raw` = 원색)으로 채운다. `data-mesh-pair` 를 함께 달면 "원색 → 낮|밤 실제 값"을 병기한다(index 03 해부 장면). 무드·테마가 바뀌면 같이 바뀐다.
- 모노 라벨 안의 한글(요일 등)은 `<span class="ko">화</span>` 로 감싼다(본문 글꼴 + 자간 0). 예: `10.27 <span class="ko">화</span>`.
- **핸들은 반드시 라벨과 함께 드러낸다.** 라벨 없는 14px 점은 렌더 찌꺼기처럼 보인다. 640px 이하에서는 라벨을 숨기지 않고 `P1` 만 남긴다(값 생략). 라벨을 둘 자리가 없는 띠·카드에는 핸들을 아예 두지 않는다.
- **핸들을 드러내는 곳은 정해져 있다:** index 01 오프닝 · 03 해부 · 10 출시 일정, profile 02 카드, onboarding 3단계, 404 복구 게임. index 06·12, 콘솔 4페이지·pricing 무대 띠, empty 견본에는 핸들이 없다.
- 404 처럼 아직 색이 돌아오지 않은 핸들(`aria-pressed="false"`)의 라벨은 `P1 비어 있음` 이다. 누르는 순간 실제 칠해진 값으로 채워진다(라벨이 거짓말하지 않게).
- index 10 은 궤도 `--drift-g`(G: 핸들은 장면 위 20% 띠 안에서만 좌우로) — 헤드라인 상자와 절대 겹치지 않는다. 대신 색은 세로로 길게(`--ms-day/--ms-night`) 번져 아래까지 칠한다.
- 페이드 반경: 낮은 `--ms-day`(기본 56% 62%)로 좁게 — 네 점이 '점'으로 읽힌다. 밤은 `--ms-night`(72% 78%)로 넓게 번진다. `--soft`·`--tight` 는 두 값을 함께 바꾼다.
- 핸들 위치는 CSS 변수가 정하므로 HTML에서 좌표를 주지 않는다.

### 3-2. 커버 아트 `.art` · 아바타 `.avatar`

```html
<span class="art" data-mood="062"></span>                 <!-- 부모 폭 100%, 정사각 12px -->
<span class="art art--40" data-mood="014"></span>         <!-- 20/40/56/64/96, --alt 배치 반전, --round 원형 -->
<span class="avatar" data-mood="014">하린</span>           <!-- 이니셜 2자 + 그 사람 무드 링. --28 --56 --72 -->
```
인물 무드: 한지수 001, 윤서하 037, 이도윤 062, 박태오 014, 최유리 090, 문가온 037, 강민재 062, 정하린 014, 김나래 014.

### 3-3. 시그니처 2 — 진행선

진행선은 그라디언트를 쓰는 유일한 UI 신호다. `.mood-line`(3px 유틸), navbar `navbar__fill`, `.clicker__line`, `.pager__line`, `.carousel__line`, `.kanban__line`, `.progress__fill`, `.steps` 완료 구간, `.toast__timer`, 활성 탭 밑줄, 사이드바 현재 항목, 재생 중인 목록 행에 적용되어 있다. 카운터는 언제나 `<b>현재</b> / 전체` 모노 쌍이다.

### 3-4. 무대 `.stage` · 무대 띠 `.stage-band`

| 클래스 | 설명 |
|---|---|
| `.stage` | 100svh 장면, 세이프 에어리어 padding, `display:grid` |
| `.stage--title` | 모바일에서도 100svh(타이틀 장면만) |
| `.stage--ink` / `.stage--bg` / `.stage--night` / `.stage--auto` | 잉크 단색(`--stage-ink`, 밤 #050409) / 바탕(`--stage-floor`, 밤 무대 바닥 #121019) / 절대 어둠(#0A0910, '하나 더' 전용) / 자동 높이 |
| `.stage__inner` | 1296 폭 |
| `.stage__chapter` `.stage__count` | 좌하단 챕터명(한글 14px), 우하단 카운터(모바일은 우상단) |
| `.stage-band` + `.stage-band__inner` | 페이지 상단 220–320px 메쉬 띠 |

### 3-5. 아이콘

`<span data-icon="play"></span>` 를 쓰면 app.js 가 24 그리드, 1.75 선, `currentColor` SVG 로 채우고 `aria-hidden` 을 단다. `.icon--sm` 16 / `.icon--lg` 24.
이름: `search sun moon close menu chevron-left chevron-right chevron-down chevron-up arrow-left arrow-right arrow-up-right check plus minus more info alert x-circle check-circle copy play pause prev next shuffle repeat volume volume-x heart heart-fill queue bell inbox columns sliders user users calendar clock send pulse orb music broadcast grid mesh external filter sort grip home ticket download upload refresh trash edit link logout headphones mail phone map-pin lock keyboard eye mic card box share device bluetooth wave flag star`
아이콘만 있는 버튼에는 반드시 `aria-label` 을 단다. 이모지는 쓰지 않는다.

---

## 4. 컴포넌트 32종

### accordion — 큐시트
```html
<div class="accordion" data-accordion="single">         <!-- single: 하나만 열림. 생략하면 여러 개 -->
  <div class="accordion__item is-live">                  <!-- is-live: 지금 진행 중인 큐(시각 옆 코랄 점) -->
    <h3 class="accordion__head">
      <button class="accordion__trigger" type="button" aria-expanded="true" aria-controls="cue-1912">
        <span class="accordion__time">19:12</span><span class="accordion__title">무드 메쉬</span><span class="accordion__meta">윤서하</span><span class="accordion__icon" aria-hidden="true"></span>
      </button>
    </h3>
    <div class="accordion__panel" id="cue-1912"><div class="accordion__body"><p>재생 중인 곡의 템포·조성·음색을 4개의 색 제어점으로 바꿔요.</p></div></div>
  </div>
</div>
```
상태: hover, focus-visible, 열림(`aria-expanded="true"` → 잉크 원 −, 시각 코랄), `disabled`. 320ms 높이 전환은 app.js 가 처리한다.

### alert
```html
<div class="alert alert--warning" role="status">   <!-- --info --success --warning --danger --signal · --band(전폭 띠) -->
  <span class="alert__icon" data-icon="alert"></span>
  <div class="alert__body">
    <p class="alert__title">송출 지연 1.8초</p>
    <p class="alert__text">CDN 서울 리전 부하가 올라갔어요. 박태오님이 확인 중이에요.</p>
    <div class="alert__actions"><button class="btn btn--sm" type="button">송출 상태 보기</button></div>
  </div>
  <button class="btn btn--quiet btn--icon btn--sm alert__close" type="button" data-dismiss aria-label="알림 닫기"><span data-icon="close"></span></button>
</div>
```
아이콘은 info=`info`, success=`check-circle`, warning=`alert`, danger=`x-circle` 이다. danger 에는 `role="alert"` 를 쓴다.

### badge
```html
<span class="badge badge--live">라이브</span>               <!-- 코랄 필 + 점 펄스. 진짜 라이브에만 -->
<span class="badge badge--success">배포 완료</span>         <!-- --success --warning --danger --info --signal : 점 + 텍스트 -->
<span class="badge badge--outline">무료</span>
<span class="badge badge--ink">플러스</span>
<span class="badge badge--mono">3.0.0 (3000.41)</span>
<span class="badge badge--count">12</span>
<span class="badge badge--mood" data-mood="014"><span class="art"></span>MOOD-014</span>
<span class="badge badge--dot">대기</span>   <!-- --lg 28px -->
```

### breadcrumb
```html
<nav class="crumbs" aria-label="현재 위치"><ol>
  <li><a href="dashboard.html">콘솔</a></li>
  <li><a href="kanban.html">런칭 보드</a></li>
  <li><span class="mono" aria-current="page">GY-412</span></li>
</ol></nav>
```
메쉬 위에 놓을 때는 `crumbs crumbs--on-mesh`(단색 필 플레이트)를 쓴다.

### button
```html
<button class="btn" type="button">결 플러스 시작</button>                       <!-- primary: 낮 잉크 필 / 밤 흰 필 -->
<button class="btn btn--signal" type="button"><span data-icon="play"></span>지금 재생</button>   <!-- 재생·사전예약·라이브 -->
<button class="btn btn--ghost" type="button">요금제 비교</button>
<button class="btn btn--quiet" type="button">나중에</button>
<button class="btn btn--danger" type="button">구독 해지</button>
<button class="btn btn--plate" type="button">무대 위 버튼</button>              <!-- 메쉬 위 단색 판 -->
<button class="btn btn--link" type="button">약관 보기</button>
<button class="btn btn--signal btn--stage" type="button">결 오브 사전예약</button>  <!-- 52px 무대 -->
<button class="btn btn--sm" type="button">저장</button>                      <!-- 36px, 터치 영역은 44 유지 -->
<button class="btn btn--ghost btn--icon" type="button" aria-label="좋아요" data-toggle-pressed aria-pressed="false" data-icon-on="heart-fill" data-label-on="좋아요 취소" data-label-off="좋아요"><span data-icon="heart"></span></button>
<a class="btn btn--block" href="pages/pricing.html">요금제 보기</a>
<div class="btn-row">…</div>
```
상태: `:hover` `:active`(0.97 축소) `:focus-visible` · `disabled` / `aria-disabled="true"` · 로딩 `aria-busy="true"`(글자 대신 4점 궤도. `data-busy="1400"` 을 달면 app.js 가 클릭 시 1.4초 로딩 후 `data-toast` 를 띄운다) · 토글 `aria-pressed="true"`(quiet·ghost 는 코랄 글자). 그라디언트 채움은 없다.

### calendar
```html
<div class="cal" data-calendar data-month="2026-10" data-today="2026-10-27" data-selected="2026-10-27"
     data-events="2026-09-15:베타,2026-10-26:리허설,2026-10-27:키노트:signal,2026-10-28:배포:signal,2026-11-20:오브 배송"></div>
<p class="cal__legend"><span><i class="is-signal"></i>키노트·배포</span><span><i></i>일정</span></p>
```
app.js 가 머리(월 이동)와 그리드를 그린다. 일요일과 2026년 공휴일(10/3, 10/5 대체, 10/9)은 코랄 글자다. `:signal` 이벤트는 코랄 점, 나머지는 울트라마린 점이다. 오늘은 잉크 링, 선택은 primary 필이다. 방향키, Home, End 로 이동한다. `gy:date` 이벤트를 낸다.

### card
```html
<!-- 곡 카드 -->
<a class="card card--track card--link" href="profile.html" data-mood="014">
  <span class="art"></span>
  <span class="card__body"><span class="card__title">성수동 4시 12분</span><span class="card__meta">오후의 정원 · 3:18</span><span class="card__id">TRK-174220</span></span>
</a>
<!-- 일반 패널 카드 -->
<article class="card">
  <p class="card__eyebrow">GY-412</p>
  <h3 class="card__title">00:00 배포 스토어 심사 확인</h3>
  <p class="card__text">iOS·Android 심사 결과를 23:40까지 확인해요.</p>
  <div class="card__foot"><span class="card__meta">강민재</span><span class="badge badge--warning">심사 대기</span></div>
</article>
<!-- 가로형 / 선택형(라디오 카드) -->
<a class="card card--row card--link" href="product.html" data-mood="001"><span class="art art--56"></span><span class="card__body"><span class="card__title">결 오브</span><span class="card__meta">₩189,000</span></span></a>
<label class="card card--link"><input class="sr-only" type="radio" name="plan" checked><span class="card__check"><span data-icon="check"></span></span><span class="card__title">결 플러스</span><span class="card__meta">₩8,900 / 월</span></label>
```
변형: `--ink`(무대 자막 면) `--sunken` `--flat` `--row` `--track`. 선택: `aria-selected|aria-pressed|aria-current="true"`, `.is-selected`, `label:has(:checked)` → 잉크 2px 테두리와 체크. 비활성: `aria-disabled="true"`. 그림자는 없다.

### carousel — 무드 팔레트
```html
<div class="carousel" data-carousel data-mood-sync>            <!-- data-mood-sync: 현재 슬라이드 무드를 페이지에 적용(값에 선택자를 주면 그 요소에) -->
  <div class="carousel__viewport" aria-label="무드 팔레트">
    <ul class="carousel__track">
      <li class="carousel__slide" data-mood="001"><div class="mood-slide mesh mesh--raw"><span class="plate"><span class="mood-slide__name">첫 소절</span><span class="mono">MOOD-001</span></span></div></li>
      <li class="carousel__slide" data-mood="014">…</li>
    </ul>
  </div>
  <div class="carousel__bar">
    <span class="carousel__count"><b data-carousel-current>1</b> / <span data-carousel-total>5</span></span>
    <span class="carousel__line" aria-hidden="true"><span></span></span>
    <span class="carousel__nav">
      <button class="btn btn--ghost btn--icon btn--sm" type="button" data-carousel-prev aria-label="이전 무드"><span data-icon="chevron-left"></span></button>
      <button class="btn btn--ghost btn--icon btn--sm" type="button" data-carousel-next aria-label="다음 무드"><span data-icon="chevron-right"></span></button>
    </span>
  </div>
</div>
```
스크롤 스냅, 스와이프, ←/→(뷰포트 포커스 시)로 넘긴다. `.carousel--peek`(82% 폭)과 `style="--slide-w:40%"` 처럼 폭을 주입할 수 있다.

### code
```html
<div class="code code--lines">
  <div class="code__head"><span class="code__file">mood-001.css</span>
    <button class="code__copy" type="button" data-copy-target="#code-mood"><span data-icon="copy"></span><span class="code__copy-label">복사</span></button></div>
  <pre><code id="code-mood"><span class="ln"><span class="tok-sel">[data-mood="001"]</span> {</span>
<span class="ln">  <span class="tok-prop">--m1</span>: <span class="tok-swatch" style="background:var(--mood-1)"></span><span class="tok-num">#FF4D2E</span>;  <span class="tok-com">/* 첫 소절 · P1 */</span></span>
<span class="ln">}</span></code></pre>
</div>
```
토큰 클래스: `tok-sel tok-prop tok-key tok-str tok-num tok-com tok-swatch`. 인라인 코드는 `<code class="inline">`. 복사는 `data-copy="문자열"` 또는 `data-copy-target` 이고, 누르면 "복사됨"과 토스트가 뜬다.

### command — ⌘K 팔레트
app.js 가 `#command` 를 자동 생성한다(이동 10개, 무드 5개, 테마·대기열·드리프트). 여는 트리거는 `data-command-open` 이 달린 요소이거나 ⌘K / Ctrl+K 다. 직접 마크업하지 않는다.
index 의 **열린 상태 정적 견본**:
```html
<div class="command command--static" role="dialog" aria-label="명령 팔레트 견본">
  <div class="command__panel">
    <div class="command__search"><span data-icon="search"></span><input class="command__input" type="text" value="새벽" aria-label="명령 검색"><kbd class="command__esc">esc</kbd></div>
    <div class="command__list" role="listbox" aria-label="명령">
      <div class="command__group" role="group" aria-label="무드 전환"><p class="command__heading">무드 전환</p>
        <div class="command__item" role="option" aria-selected="true" data-mood="014"><span class="art"></span><span class="command__label">새벽 수영장<span class="mono">MOOD-014</span></span><span class="command__hint">적용 ↵</span></div>
        <div class="command__item" role="option" aria-selected="false"><span data-icon="moon"></span><span class="command__label">낮 리허설 ↔ 밤 본 행사 전환</span><span class="command__kbd">⇧D</span></div>
      </div>
    </div>
    <div class="command__foot"><span><kbd>↑</kbd><kbd>↓</kbd>이동</span><span><kbd>↵</kbd>실행</span><span><kbd>esc</kbd>닫기</span></div>
  </div>
</div>
```
검색 결과가 없으면 "찾는 장면이 큐시트에 없어요." 가 보인다. 비활성 항목은 `aria-disabled="true"` 다.

### drawer — 지금 재생 대기열
```html
<div class="drawer" id="queue" hidden role="dialog" aria-modal="true" aria-labelledby="queue-title">
  <div class="drawer__scrim" data-close="queue"></div>
  <div class="drawer__panel">
    <span class="drawer__grab" aria-hidden="true"></span>
    <div class="drawer__head"><div><h2 class="drawer__title" id="queue-title">지금 재생 대기열</h2><p class="drawer__sub">8곡 · 28분 39초</p></div>
      <button class="btn btn--quiet btn--icon" type="button" data-close="queue" aria-label="대기열 닫기"><span data-icon="close"></span></button></div>
    <div class="drawer__now mesh" data-mood="001"><span class="art art--56"></span><span class="plate"><b>첫 소절</b><span class="t-small ink-2">윤슬밴드</span></span></div>
    <div class="drawer__body"><p class="drawer__section">다음 곡</p><ul class="list list--compact">…</ul></div>
    <div class="drawer__foot"><button class="btn btn--ghost" type="button">비우기</button><button class="btn" type="button"><span data-icon="shuffle"></span>셔플</button></div>
  </div>
</div>
<button class="btn btn--ghost" type="button" data-open="queue" aria-controls="queue" aria-expanded="false"><span data-icon="queue"></span>대기열</button>
```
오른쪽 440px 패널이고, 640px 이하에서는 85svh 하단 시트가 된다. `drawer--left` 도 있다. 정적 견본은 `drawer drawer--static`(hidden 없이)으로 쓴다. 페이지에 `#queue` 가 있으면 Q 키로 열린다.

### empty
```html
<div class="empty">                                  <!-- --center: 가운데 1열 -->
  <div class="empty__mesh mesh mesh--mute" aria-hidden="true"><span class="mesh__handle" data-p="1"></span><span class="mesh__handle" data-p="2"></span><span class="mesh__handle" data-p="3"></span><span class="mesh__handle" data-p="4"></span></div>
  <div class="empty__body"><p class="empty__title">아직 고른 무드가 없어요</p><p class="empty__text">지금 기분에 맞는 색을 하나 골라 보세요.</p><a class="btn btn--sm" href="onboarding.html">무드 고르기</a></div>
</div>
```
버튼은 하나만 둔다. 404 장면의 색 복귀 동작은 6절 `data-restore` 를 본다.

### form
```html
<form class="stack stack--5" data-validate data-success="답장을 보냈어요" data-success-text="INQ-261027-031" data-reset>
  <div class="field-row">
    <div class="field"><label class="field__label" for="name">이름</label><input class="input" id="name" required value="정하린"></div>
    <div class="field"><label class="field__label" for="mail">이메일 <span class="field__opt">필수</span></label>
      <input class="input" id="mail" type="email" required data-error="이메일 형식을 확인해 주세요">
      <p class="field__hint">답장은 이 주소로 가요.</p>
      <p class="field__error"><span data-icon="alert"></span><span class="field__error-text">이메일 형식을 확인해 주세요</span></p></div>
  </div>
  <div class="field"><label class="field__label" for="q">문의 번호</label><div class="input-group"><span data-icon="search"></span><input class="input input--mono" id="q" placeholder="INQ-261027-031"></div></div>
  <div class="field"><label class="field__label" for="plan">요금제</label><span class="select"><select id="plan"><option>결 플러스 ₩8,900</option><option>결 듀오 ₩12,900</option><option>결 패밀리 ₩15,900</option></select></span></div>
  <div class="field"><label class="field__label" for="body">답장</label><textarea class="textarea" id="body" required></textarea></div>
  <div class="field"><label class="field__label" for="mix">무드 메쉬 강도</label>
    <div class="slider-field"><input class="slider" type="range" id="mix" min="0" max="100" value="64" data-suffix="%" data-var="--mesh-mix" data-var-target="#preview" data-var-unit="%"><output for="mix">64%</output></div></div>
  <label class="switch switch--block"><span class="switch__text">모션 줄이기<small>메쉬 드리프트를 멈춰요</small></span><input type="checkbox" role="switch"></label>
  <label class="check"><input type="checkbox" checked><span>무손실 24bit<span class="check__sub">셀룰러에서는 320kbps</span></span></label>
  <fieldset class="fieldset"><legend>결제 주기</legend><label class="radio"><input type="radio" name="cycle" checked>월간 ₩8,900</label><label class="radio"><input type="radio" name="cycle">연간 ₩89,000</label></fieldset>
  <div class="chips" role="radiogroup" aria-label="오브 색상">
    <label class="chip"><input type="radio" name="orb" value="ink" checked data-bind-attr="data-color" data-bind-target="#orb"><span class="chip__swatch" data-swatch="ink"></span>밤 잉크</label>
    <label class="chip"><input type="radio" name="orb" value="moon" data-bind-attr="data-color" data-bind-target="#orb"><span class="chip__swatch" data-swatch="moon"></span>달빛 화이트</label>
    <label class="chip"><input type="radio" name="orb" value="coral" data-bind-attr="data-color" data-bind-target="#orb"><span class="chip__swatch" data-swatch="coral"></span>첫 소절 코랄</label>
  </div>
  <div class="stepper" data-stepper><button type="button" data-step="-1" aria-label="수량 줄이기"><span data-icon="minus"></span></button><input type="number" value="1" min="1" max="2" aria-label="수량"><button type="button" data-step="1" aria-label="수량 늘리기"><span data-icon="plus"></span></button></div>
  <div class="form-actions"><p class="form-status" role="status"></p><button class="btn btn--ghost" type="reset">취소</button><button class="btn" type="submit">답장 보내기</button></div>
</form>
```
- 상태: hover, focus(2px 링 + 4px 헤일로), `aria-invalid="true"`(danger 테두리, `.field__error` 표시, 힌트 숨김), `disabled`, `readonly`, `aria-busy="true"`(.input-group 오른쪽 스피너).
- `form[data-validate]`: 제출하면 검증하고, 첫 오류로 포커스를 보내고, `.form-status` 에 "확인이 필요한 칸이 N개 있어요." 를 쓴다. 통과하면 submit 버튼이 1.1초 `aria-busy` 상태가 된 뒤 `data-success` 토스트를 띄운다.
- 스위치 on 은 코랄 필 + 잉크 노브다. 슬라이더 채움은 무드 진행선이다. 칩 스와치 `data-swatch="ink|moon|coral"` 은 결 오브 실물 색 토큰(`--orb-ink` `--orb-moon` `--orb-coral`, 양 모드 동일)으로 칠해진다.

### kanban — 런칭 큐시트 보드
```html
<div class="kanban" data-kanban>                                   <!-- 컬럼 수는 style="--cols:4" -->
  <section class="kanban__col" data-col="prep" aria-labelledby="col-prep">
    <div class="kanban__head"><h3 class="kanban__title" id="col-prep">준비</h3><span class="kanban__count" data-kanban-count></span></div>
    <div class="kanban__line" aria-hidden="true"><span></span></div>
    <ul class="kanban__cards">
      <li class="kanban__card" id="GY-412">
        <div class="kanban__top"><span class="kanban__id">GY-412</span><span class="kanban__time">23:40</span></div>
        <p class="kanban__name">00:00 배포 스토어 심사 확인</p>
        <div class="kanban__foot"><span class="kanban__who"><span class="avatar avatar--28" data-mood="062">민재</span>강민재</span><span class="badge badge--warning">심사 대기</span></div>
      </li>
    </ul>
    <button class="kanban__add" type="button"><span data-icon="plus"></span>큐 추가</button>
  </section>
  … 리허설(rehearsal) · 본방(live) …
  <section class="kanban__col" data-col="done" data-col-done>…</section>   <!-- 완료 열: 옮기면 data-done="true" -->
</div>
```
카드 상태: `data-done="true"`(완료 꼬리표), `data-blocked="true"`(danger 좌측 바), 드래그 중 `.is-dragging`, 키보드로 든 상태 `aria-grabbed="true"`. 열 위로 드래그하면 `.is-over` 하이라이트가 생긴다. 헤더 카운터 `완료 / 전체` 와 진행선은 app.js 가 계산한다. 카드 일부만 꺼내 보이는 발췌 보드(index 피처 월)는 열에 `data-total="N"`(pages/kanban.html 정본 열 합계: 준비 2 · 리허설 3 · 본방 3 · 완료 6)을 달아 `0 / 2 · 0 / 3 · 0 / 3 · 6 / 6` 이 정본과 같게 나오게 한다. 발췌 카드의 ID·제목·시각·담당·배지는 kanban.html 문자열을 한 글자도 바꾸지 않는다. 키보드: Space/Enter 로 들기, ←/→ 열 이동, ↑/↓ 순서, Space 로 내려놓기, Esc 취소. Alt+화살표는 즉시 이동이다.

### list
```html
<ul class="list list--divided">                           <!-- --compact 52px -->
  <li><a class="list__row" href="profile.html" aria-current="true" data-mood="001">   <!-- 지금 재생: 좌측 진행선 + 이퀄라이저 -->
    <span class="list__index">01</span><span class="art art--40"></span>
    <span class="list__main"><span class="list__title">첫 소절</span><span class="list__sub">윤슬밴드 · <span class="mono">TRK-311502</span></span></span>
    <span class="list__end"><span class="list__eq" aria-hidden="true"><i></i><i></i><i></i></span>3:42</span></a></li>
</ul>
<!-- 선택형(문의함) -->
<div class="list list--divided" role="listbox" aria-label="문의">
  <div class="list__row is-unread" role="option" aria-selected="true" id="INQ-261027-031" tabindex="0">
    <span class="avatar" data-mood="037">서하</span>
    <span class="list__main"><span class="list__title">무드 메쉬 보도자료 확인 요청</span><span class="list__text">20:31 · 키노트 영상 링크와 3.0 스크린샷 5장을 보내 주실 수 있을까요?</span></span>
    <span class="list__end">20:31</span></div>
</div>
```
상태: hover, active, `aria-current="true"`(재생 중), `aria-selected="true"`(선택), `.is-unread`(굵게 + 코랄 점), `aria-disabled="true"`. 플레이어가 멈추면 재생 행에 `data-paused` 가 붙어 이퀄라이저가 멈춘다. 선택하면 `gy:select` 이벤트가 나간다.

### marquee — 무대 하단 자막 띠
```html
<div class="marquee" data-mood="001">
  <span class="marquee__label"><span class="dot"></span>지금 재생</span>
  <div class="marquee__viewport"><div class="marquee__track"><div class="marquee__group">
    <span class="marquee__item"><span class="art"></span><b>첫 소절</b> — 윤슬밴드 <span class="mono">TRK-311502</span></span>
    <span class="marquee__item">라이브 동시 시청 <b>68,214명</b> <span class="mono">20:21</span></span>
    <span class="marquee__item">결 오브 사전예약 <b>20:00</b>부터</span>
  </div></div></div>
  <button class="marquee__toggle" type="button" aria-label="자막 띠 멈춤" data-toggle-pressed aria-pressed="false" data-icon-on="play" data-label-on="자막 띠 재생" data-label-off="자막 띠 멈춤"><span data-icon="pause"></span></button>
</div>
```
app.js 가 그룹을 복제해 이음매 없이 흐르게 한다. 호버, 포커스, `[data-paused]`, 토글 버튼 `aria-pressed="true"` 상태에서는 멈춘다. 축소 모션이면 정지하고 가로 스크롤로 바뀐다. 속도는 `style="--marquee-dur:60s"` 로 준다.

### menu
```html
<button class="btn btn--ghost btn--sm" type="button" data-menu="track-menu" aria-haspopup="menu" aria-expanded="false" aria-controls="track-menu">더 보기<span data-icon="chevron-down"></span></button>
<div class="menu" id="track-menu" role="menu" aria-label="곡 메뉴" hidden>     <!-- data-align="start|center|end" -->
  <p class="menu__label mono">TRK-311502</p>
  <button class="menu__item" role="menuitem" type="button"><span data-icon="queue"></span><span class="menu__text">대기열에 추가</span><span class="menu__kbd">Q</span></button>
  <button class="menu__item" role="menuitemradio" aria-checked="true" data-group="mood" data-mood-set="001" type="button"><span class="art" data-mood="001"></span><span class="menu__text">첫 소절 무드</span><span class="menu__check" data-icon="check"></span></button>
  <button class="menu__item" role="menuitemcheckbox" aria-checked="false" data-keep-open type="button"><span data-icon="download"></span><span class="menu__text">오프라인 저장</span><span class="menu__check" data-icon="check"></span></button>
  <button class="menu__item" role="menuitem" aria-disabled="true" type="button"><span data-icon="lock"></span><span class="menu__text">무손실 다운로드 · 플러스</span></button>
  <hr class="menu__sep">
  <button class="menu__item menu__item--danger" role="menuitem" type="button"><span data-icon="trash"></span><span class="menu__text">재생목록에서 빼기</span></button>
</div>
```
트리거 아래에 고정 배치되고, 공간이 없으면 위로 뒤집힌다. ↑/↓/Home/End 로 이동하고 Esc 로 닫으면 포커스가 트리거로 돌아간다. 바깥을 클릭해도 닫힌다. 정적 견본은 `menu menu--static`(hidden 없이)으로 쓴다.

### modal — 결 오브 사전예약 확인
```html
<div class="modal" id="reserve" hidden role="dialog" aria-modal="true" aria-labelledby="reserve-title">   <!-- --wide 720 · --alert 메쉬 띠 없음 -->
  <div class="modal__scrim" data-close="reserve"></div>
  <div class="modal__panel">
    <div class="modal__band mesh mesh--soft" data-mood="001"><span class="plate plate--sm mono">ORB-261027-00418</span></div>
    <button class="btn btn--plate btn--icon btn--sm modal__close" type="button" data-close="reserve" aria-label="닫기"><span data-icon="close"></span></button>
    <div class="modal__body">
      <h2 class="modal__title" id="reserve-title">결 오브를 예약할까요?</h2>
      <p class="modal__text">1차 배송은 11월 20일 금요일에 시작해요. 1인 최대 2대까지 예약할 수 있어요.</p>
      <dl class="modal__summary"><dt>색상</dt><dd>첫 소절 코랄</dd><dt>수량</dt><dd>2대</dd><dt>결제 금액</dt><dd class="mono">₩378,000</dd></dl>
    </div>
    <div class="modal__foot"><button class="btn btn--ghost" type="button" data-close="reserve">다시 고르기</button>
      <button class="btn btn--signal" type="button" data-busy="1200" data-toast="사전예약이 접수됐어요" data-toast-text="ORB-261027-00418 · 11월 20일 배송" data-toast-tone="success">사전예약 확정</button></div>
  </div>
</div>
<button class="btn btn--signal" type="button" data-open="reserve" aria-controls="reserve" aria-expanded="false">사전예약</button>
```
포커스 트랩, Esc, 스크림 클릭 닫기, 포커스 복귀, 스크롤 잠금은 app.js 가 처리한다. 모바일에서는 하단에 붙는다. 정적 견본은 `modal modal--static`(hidden 없이)이다.

### motion
```html
<h2 class="t-statement" data-reveal="headline">모든 곡에는 색이 있습니다.</h2>   <!-- y 24px→0, 640ms -->
<p class="t-sub" data-reveal>템포, 조성, 음색.</p>                               <!-- y 12px→0 · "fade" 는 투명도만 -->
<div class="grid-12" data-reveal-stagger>…타일…</div>                         <!-- 자식 60ms 스태거 -->
<!-- 무드 전환 데모(페이지 전체 무드가 바뀐다) -->
<div class="mood-picker" role="radiogroup" aria-label="무드">
  <label class="mood-picker__opt" data-mood="001"><input type="radio" name="mood" data-mood-set="001" checked><span class="art"></span><span class="mood-picker__name"><b>첫 소절</b><span class="mono">MOOD-001</span></span></label>
  <label class="mood-picker__opt" data-mood="014"><input type="radio" name="mood" data-mood-set="014"><span class="art"></span><span class="mood-picker__name"><b>새벽 수영장</b><span class="mono">MOOD-014</span></span></label>
</div>
<!-- 드리프트 토글 -->
<button class="btn btn--ghost btn--sm" type="button" data-drift-toggle aria-pressed="true"><span data-icon="wave"></span><span class="drift-on">드리프트 멈춤</span><span class="drift-off">드리프트 재개</span></button>
```
`data-mood-set` 에 `data-mood-target="#s03"` 을 주면 그 요소에만 적용된다. 장면당 움직임은 메쉬 드리프트 하나와 진입 1회로 끝낸다. JS가 없으면 reveal 요소가 처음부터 보인다. 축소 모션에서는 전부 정지한 최종 상태로 보인다.

### navbar
1-1, 1-2 셸 스니펫을 그대로 쓴다.

### pagination
```html
<nav class="pager" data-pager data-page="4" data-total="18" data-size="12" data-count="214" aria-label="문의 페이지">  <!-- --compact: 진행선 없음 -->
  <button class="btn btn--ghost btn--sm" type="button" data-pager-prev><span data-icon="chevron-left"></span><span class="pager__word">이전</span></button>
  <div class="pager__mid"><span class="pager__count"><b data-pager-current>4</b> / <span data-pager-total>18</span></span><span class="pager__line" aria-hidden="true"><span></span></span><span class="pager__range" data-pager-range></span></div>
  <button class="btn btn--ghost btn--sm" type="button" data-pager-next><span class="pager__word">다음</span><span data-icon="chevron-right"></span></button>
</nav>
```
처음과 끝에서는 이전·다음 버튼이 disabled 된다. `37–48 / 214건` 범위는 자동으로 계산된다. 640px 이하에서는 44px 아이콘 버튼이 된다. `gy:page` 이벤트를 낸다.

### popover
```html
<button class="btn btn--ghost btn--sm" type="button" data-popover="stream-pop" aria-expanded="false" aria-controls="stream-pop">송출 상태</button>
<div class="popover" id="stream-pop" role="dialog" aria-label="송출 상태" hidden>    <!-- data-align="start|center|end" -->
  <div class="popover__head"><div><p class="popover__title">송출 지연 1.8초</p><p class="popover__sub">20:42 기준 · 서울 리전</p></div>
    <button class="popover__close" type="button" data-close aria-label="닫기"><span data-icon="close"></span></button></div>
  <div class="popover__body">오류율 <b>0.04%</b>
    <dl class="popover__kv"><dt>동시 시청</dt><dd class="mono">41,092</dd><dt>최고</dt><dd class="mono">68,214 · 20:21</dd></dl></div>
  <div class="popover__foot"><a href="dashboard.html">관제 콘솔에서 보기</a></div>
</div>
```
잉크 면에 흰 글자를 쓴다(양 모드 공통, 무대 자막). 화살표는 app.js 가 붙인다. 정적 견본은 `popover popover--static` 에 `<span class="popover__arrow" aria-hidden="true"></span>` 를 직접 넣는다.

### progress
```html
<div class="progress">
  <div class="progress__head"><span class="progress__label">스토어 심사</span><span class="progress__value">72%</span></div>
  <div class="progress__track" role="progressbar" aria-valuenow="72" aria-valuemin="0" aria-valuemax="100" aria-label="스토어 심사"><span class="progress__fill" style="--value:72%"></span></div>
  <div class="progress__foot"><span>iOS 통과</span><span>Android 심사 중</span></div>
</div>
```
변형: 기본 3px · `--thick` 8px(업로드) · `--indeterminate` · `--scrub`(플레이어, `.progress__knob` 추가). 상태: `data-state="error|done|paused"`. `.progress__value` 에는 숫자만 쓴다(한글 상태는 label 이나 foot 에 쓴다).

### sidebar
1-5 셸 스니펫을 그대로 쓴다(콘솔 4페이지 전용).

### skeleton
```html
<div class="skeleton" aria-busy="true" aria-label="곡 불러오는 중">
  <div class="skel-row"><span class="skel skel--art"></span><div class="stack"><span class="skel skel--title" style="--w:60%"></span><span class="skel" style="--w:40%"></span></div></div>
</div>
<div class="skel-card"><span class="skel skel--art" style="--w:100%"></span><span class="skel skel--title" style="--w:70%"></span><span class="skel" style="--w:45%"></span></div>
```
`skel--display`(48px) `skel--circle` `skel--pill` 도 있다. 시머는 무드 색 10%이고, 축소 모션이면 정지한다.

### spinner — 4개 제어점 궤도
```html
<span class="spinner" role="status"><svg viewBox="0 0 24 24" aria-hidden="true"><circle class="spinner__p1" cx="12" cy="3.5" r="2.6"/><circle class="spinner__p2" cx="20.5" cy="12" r="2.6"/><circle class="spinner__p3" cx="12" cy="20.5" r="2.6"/><circle class="spinner__p4" cx="3.5" cy="12" r="2.6"/></svg>무드 불러오는 중</span>
```
크기는 `--sm` 16 · 기본 24 · `--lg` 40 · `--xl` 64 이고, `--mono` 는 currentColor 다. 글자 없이 쓸 때는 `aria-label="불러오는 중"` 을 단다.

### steps — 키노트 큐 진행
```html
<ol class="steps" data-step="2" aria-label="첫 실행 단계">            <!-- --vertical -->
  <li class="steps__item"><span class="steps__dot">1</span><span class="steps__text"><span class="steps__label">지금 기분 고르기</span><span class="steps__meta">MOOD</span></span></li>
  <li class="steps__item"><span class="steps__dot">2</span><span class="steps__text"><span class="steps__label">좋아하는 곡 3개</span><span class="steps__meta">TRK</span></span></li>
  <li class="steps__item"><span class="steps__dot">3</span><span class="steps__text"><span class="steps__label">메쉬 생성</span><span class="steps__meta">P1–P4</span></span></li>
  <li class="steps__item"><span class="steps__dot">4</span><span class="steps__text"><span class="steps__label">알림 허용</span><span class="steps__meta">00:00</span></span></li>
</ol>
```
`data-step` 을 주면 app.js 가 done(체크, 잉크 원, 무드 진행선), current(`aria-current="step"`), todo 상태를 붙인다. 오류 단계는 `data-state="error"` 다. 위저드 안에서는 `button.steps__dot[data-goto="2"]` 로 바로 이동한다. 640px 이하에서는 현재 단계 라벨만 보인다.

### table
```html
<div class="table-wrap">
  <table class="table table--stack">                          <!-- --stack: 640 이하에서 2열 카드 행 -->
    <caption>최근 사전예약 <span class="t-small">20:42 기준 · 결 오브 7,830대</span></caption>
    <thead><tr>
      <th scope="col">주문</th><th scope="col">지역</th><th scope="col">색상</th>
      <th scope="col" class="num" aria-sort="none"><button class="table__sort" type="button">수량</button></th>
      <th scope="col" class="num" aria-sort="descending"><button class="table__sort" type="button">시각</button></th>
    </tr></thead>
    <tbody>
      <tr class="is-new"><td class="id" data-label="주문">ORB-261027-00418</td><td data-label="지역">서울 성동구</td><td data-label="색상">첫 소절 코랄</td><td class="num" data-label="수량">2</td><td class="num" data-label="시각" data-sort="2041">20:41</td></tr>
    </tbody>
  </table>
</div>
```
숫자 열은 `.num`(Azeret Mono 우정렬), ID 열은 `.id` 다. 정렬은 `.table__sort` 클릭으로 하고 `aria-sort` 가 토글된다(`data-sort` 값을 우선한다). 행 상태: hover, `aria-selected="true"`, `.is-new`(무드 좌측 바). 빈 상태는 `<tr class="table__empty"><td colspan="5">…</td></tr>`, 로딩은 `.table-wrap[aria-busy="true"]` 다. 모바일 카드 행에서 넓게 쓸 칸은 `data-span="2"` 다.

### tabs
```html
<div class="tabs">                                        <!-- 밑줄형(기본, 무드 진행선) · --pill 세그먼트 · --stage 무대 크기 -->
  <div class="tabs__list" role="tablist" aria-label="키노트 장면">
    <button class="tabs__tab" role="tab" id="tab-mesh" aria-controls="panel-mesh" aria-selected="true">무드 메쉬 <span class="tabs__count">128</span></button>
    <button class="tabs__tab" role="tab" id="tab-demo" aria-controls="panel-demo">라이브 데모</button>
    <button class="tabs__tab" role="tab" id="tab-plan" aria-controls="panel-plan" disabled>요금제</button>
  </div>
  <div class="tabs__panel" role="tabpanel" id="panel-mesh" aria-labelledby="tab-mesh">…</div>
  <div class="tabs__panel" role="tabpanel" id="panel-demo" aria-labelledby="tab-demo">…</div>
  <div class="tabs__panel" role="tabpanel" id="panel-plan" aria-labelledby="tab-plan">…</div>
</div>
```
←/→/Home/End 로 이동하는 로빙 tabindex 다. 넘치면 가로 스크롤과 양끝 페이드 힌트(`data-overflow`)가 붙는다. `aria-orientation="vertical"` 도 지원한다. `gy:tab` 이벤트를 낸다.

### timeline
```html
<ol class="timeline">                                   <!-- --h: 가로(출시 일정, 760 이하 세로) -->
  <li class="timeline__item" data-state="past"><span class="timeline__time">19:44</span><span class="timeline__rail"><span class="timeline__dot"></span></span>
    <div class="timeline__body"><p class="timeline__title">요금제</p><p class="timeline__meta">최유리 · 플러스 ₩8,900</p></div></li>
  <li class="timeline__item" data-state="now" aria-current="step"><span class="timeline__time">19:52</span><span class="timeline__rail"><span class="timeline__dot"></span></span>
    <div class="timeline__body"><p class="timeline__title">하나 더 — 결 오브</p><p class="timeline__meta">한지수 · ₩189,000</p><span class="badge badge--live timeline__tag">지금</span></div></li>
  <li class="timeline__item" data-state="next"><span class="timeline__time">20:03</span><span class="timeline__rail"><span class="timeline__dot"></span></span>
    <div class="timeline__body"><p class="timeline__title">출시 일정</p><p class="timeline__meta">10월 28일 00:00 배포</p></div></li>
</ol>
```
past 구간은 무드 진행선, now 는 코랄 점 + 핑 애니메이션, next 는 흐린 제목이다. 가로형은 각 점 아래 `timeline__body` 가 단색 플레이트가 되므로 메쉬 무대 위에 놓아도 된다.

### toast
```html
<!-- JS -->
gy.toast({ title: '사전예약이 접수됐어요', text: 'ORB-261027-00418', tone: 'success', action: '보기', onAction: fn, duration: 5000 });
<!-- 선언형 트리거 -->
<button class="btn" type="button" data-toast="무드를 저장했어요" data-toast-text="MOOD-014 새벽 수영장" data-toast-tone="success" data-toast-action="되돌리기">저장</button>
<!-- index 정적 견본 -->
<div class="toast toast--static toast--success" role="status"><span class="toast__icon" data-icon="check-circle"></span>
  <div class="toast__body"><p class="toast__title">사전예약이 접수됐어요</p><p class="toast__text"><span class="mono">ORB-261027-00418</span> · 11월 20일 배송</p></div>
  <button type="button" class="toast__close" aria-label="알림 닫기"><span data-icon="close"></span></button><span class="toast__timer" aria-hidden="true"></span></div>
```
하단 중앙의 무대 자막 바(잉크 면)다. tone 은 `success|warning|danger|(info)` 이다. 아래 진행선이 자동 닫힘 타이머이고, 호버나 포커스 중에는 멈춘다. 동시에 최대 3개까지 뜬다.

### tooltip
```html
<button class="btn btn--quiet btn--icon" type="button" aria-label="대기열" data-tooltip="대기열 열기" data-tooltip-kbd="Q"><span data-icon="queue"></span></button>
<div class="tooltip tooltip--static" role="tooltip">대기열 열기<span class="tooltip__kbd">Q</span></div>   <!-- 정적 견본 -->
```
호버 300ms 또는 키보드 포커스로 뜨고 Esc 로 닫힌다. `aria-describedby` 는 자동이다. 잉크 면(양 모드 공통)이다.

---

## 5. 시연 위젯 (장면에서 재사용)

### 플레이어 `[data-player]` (index 06 라이브 데모, product 미리듣기)
```html
<div class="player" data-player data-duration="222" data-position="94" data-mood="001">
  <span class="art art--96"></span>
  <p class="player__title">첫 소절</p><p class="player__artist">윤슬밴드 · <span class="mono">TRK-311502</span></p>
  <div class="progress progress--scrub"><div class="progress__track" data-player-progress aria-label="재생 위치"><span class="progress__fill"></span><span class="progress__knob"></span></div>
    <div class="progress__foot"><span class="mono" data-player-time>1:34</span><span class="mono" data-player-duration>3:42</span></div></div>
  <div class="btn-row">
    <button class="btn btn--quiet btn--icon" type="button" data-player-prev aria-label="처음으로"><span data-icon="prev"></span></button>
    <button class="btn btn--signal btn--icon btn--stage" type="button" data-player-toggle aria-pressed="false" aria-label="재생"><span data-icon="play"></span></button>
    <button class="btn btn--quiet btn--icon" type="button" aria-label="다음 곡"><span data-icon="next"></span></button>
  </div>
</div>
```
`.player*` 레이아웃은 장면 CSS 에서 잡는다. 재생 위치 트랙은 slider 역할이고 ←/→ 5초, PageUp/PageDown 30초씩 움직인다. `data-autoplay` 를 주면 재생 상태로 시작한다(축소 모션이면 무시). `gy:player` 이벤트를 낸다.

### 실시간 차트 `[data-livechart]` (dashboard 동시 시청자)
```html
<div class="livechart" data-livechart data-base="41092" data-max="70000"
     data-start="19:00" data-end="20:42" data-peak-time="20:21" data-ticks="20000,40000,60000"
     data-anchors="19:00=24600,19:12=39800,19:31=52300,19:44=55900,19:52=61700,20:03=64900,20:10=66300,20:21=68214,20:30=55400,20:42=41092"
     data-cues="19:00=오프닝,19:12=무드 메쉬,19:31=라이브 데모,19:44=요금제,19:52=하나 더,20:03=출시 일정,20:10=종료" style="--chart-h:260px">
  <div class="split"><p><span class="t-headline tnum" data-livechart-value>41,092</span> <span class="t-small ink-3">명 동시 시청</span></p>
    <button class="btn btn--ghost btn--sm" type="button" data-livechart-toggle aria-pressed="false"><span data-icon="pause"></span><span class="livechart__toggle-label">일시정지</span></button></div>
  <div class="livechart__plot" role="img" aria-label="오늘 밤 동시 시청자 추이 19:00–20:42 …"></div>
</div>
```
- 본 차트는 **송출 전체 창**(19:00–20:42, 15초 간격)이다. 0–70,000 축에서 최근 90초만 그리면 한 줄 평선이 되므로 쓰지 않는다. y 라벨(`data-ticks`)은 플롯 왼쪽 거터, 키노트 큐(`data-cues`)는 점선 세로 마커 + 아래 두 줄 엇갈린 라벨(≤640px 은 시각만, 하나 걸러).
- 앵커(`data-anchors`) 사이를 부드럽게 잇고 구간 가운데서만 ±0.4% 흔든다 — 앵커 값(최고 68,214 · 20:21, 지금 41,092 · 20:42)은 흔들리지 않는다. 최고점에 점 + 라벨.
- 오른쪽 끝 90초(7점)만 '라이브 구간'(시그널 4px 선 + 링 점)으로 강조하고 1.5초마다 정본 ±30명 안에서 갱신한다. 같은 라이브 90초를 `[data-livechart-sync]`(무대 띠 숫자)와 `[data-livechart-spark]`(미니 스파크라인)에도 그린다. 스파크라인은 90초 min–max 로 확대한 것이므로 라벨에 반드시 **"최근 90초 확대"** 라고 쓴다.
- 일시정지하면 라이브 구간이 회색이 된다. `data-start-paused` 를 주면 멈춘 채 시작한다. 축소 모션이면 자동 갱신하지 않는다. 표 대체 데이터(큐 시점별 값)는 `<details>` 로 페이지에 함께 둔다.

### 결 오브 `.orb` (index 11 · product · settings 공통, components/orb.css)
```html
<div class="orb" data-color="ink|moon|coral" data-mood="001" aria-hidden="true">
  <span class="orb__surface"></span>   <!-- 무드 메쉬 표면(원색, 핸들 없음) -->
  <span class="orb__veil"></span>      <!-- 선택: settings 미리보기의 메쉬 강도(--mesh-mix) -->
  <span class="orb__shine"></span>     <!-- 스페큘러 하이라이트 + 음영 -->
  <span class="orb__base"></span>      <!-- 받침 = 고른 색상의 타원 퍽 -->
</div>
```
- 한 제품은 어디서나 같은 모양이다. 구를 가로로 잘라 아래를 셸 색으로 칠하지 않는다(그릇·렌더 오류처럼 보인다). 셸은 구 아래를 받치는 타원 퍽이다.
- 크기는 `--orb-size`(기본 min(440px, 32vw)), `.orb--sm` = 96px(설정 연결 기기). product 치수 도면도 같은 실루엣(원 + 아래 타원 받침)으로 그린다.

### 위저드 `[data-wizard]` (onboarding)
```html
<div data-wizard data-current="1">
  <span class="pager__line" data-wizard-line aria-hidden="true"><span></span></span>
  <p class="pager__count" data-wizard-count><b>1</b> / 4</p>
  <ol class="steps">…button.steps__dot[data-goto]…</ol>
  <section data-wizard-step="1"><h2 class="t-statement">지금 기분은 어떤 색인가요?</h2>…<input required …></section>
  <section data-wizard-step="2" hidden>…</section>
  <div class="btn-row"><button class="btn btn--ghost" type="button" data-wizard-prev>이전</button><button class="btn" type="button" data-wizard-next>다음</button><a class="btn btn--signal" href="../index.html" data-wizard-done hidden>결 3.0 시작</a></div>
</div>
```
'다음'을 누르면 현재 단계의 필수 입력을 검증한다. 단계가 바뀌면 제목으로 포커스가 이동한다. 진행선과 `2 / 4` 카운터는 자동으로 갱신된다.

### 색 복귀 `[data-restore]` (404)
```html
<div class="stage mesh mesh--mute" data-restore="#go-home">
  <button class="mesh__handle" data-p="1" type="button" aria-pressed="false" aria-label="P1 색 되돌리기"></button>
  … data-p 2·3·4 …
  <p class="plate"><span class="mono" data-restore-count>0 / 4</span> 제어점 복귀</p>
  <a class="btn btn--signal" id="go-home" href="../index.html" aria-disabled="true">키노트로 돌아가기</a>
</div>
<a class="btn btn--ghost" href="../index.html">바로 키노트로</a>   <!-- 처음부터 쓸 수 있는 탈출구 -->
```
핸들을 누르면 그 제어점의 색이 돌아온다(`lit-N`). 4개가 모두 돌아오면 대상의 disabled/aria-disabled 가 풀린다.

### 기타 선언형 속성
| 속성 | 동작 |
|---|---|
| `data-open="id"` / `data-close="id"` (값 없으면 가장 가까운 오버레이) | modal·drawer·sidebar·command 열기/닫기 |
| `data-popover="id"` · `data-menu="id"` | 플로팅 패널 토글 |
| `data-command-open` · `data-theme-toggle` | ⌘K 팔레트 · 낮/밤 전환(View Transitions 원형 클립) |
| `data-mood-set="014"` (+`data-mood-target`) | 무드 전환(900ms 보간) |
| `data-mood-name` · `data-mood-id` | 현재 무드 이름·ID 텍스트 자동 채움 |
| `data-bind-attr="data-color" data-bind-target="#orb"` | change 시 대상 속성에 value 반영(product 오브 색) |
| `data-var="--x" data-var-target data-var-unit` (slider) | 슬라이더 값을 CSS 변수로 주입(settings 미리보기) |
| `data-toggle-pressed` (+`data-icon-on` `data-label-on/off`) | aria-pressed 토글 |
| `data-busy="ms"` | 로딩 후 `data-toast` |
| `data-dismiss` | 가장 가까운 `.alert`/`[data-dismissible]` 제거 |
| `data-copy` · `data-copy-target` | 클립보드 복사 |
| `data-drift-toggle` (값=선택자) | 메쉬 드리프트 정지/재개 |

키보드: ⌘K/Ctrl+K 팔레트, ⇧D 낮/밤, Q 대기열, Esc 닫기, ←/→ 장면 이동(index).
JS API: `window.gy = { init, open, close, toast, setTheme, toggleTheme, setMood, setStep, wizardGo, icon, icons, hydrateIcons, moods }` — 동적으로 넣은 DOM 은 `gy.init(el)` 을 호출한다.
이벤트(`gy:*`, 버블링): theme mood open close tab toast page date step kanban-move sort select submit restore player scene carousel.

---

## 6. 점검표 (장면 작성 후)

- 첫 화면이 랜딩 공식(칩 → 그라디언트 헤드라인 → CTA 2개)이 아닌가. 가운데 정렬 "라벨 → 제목 → 부제" 헤더가 반복되지 않는가.
- 메쉬가 무대·무대 띠·커버 아트에만 있는가. 정보 영역 뒤로 메쉬가 흐르지 않는가.
- 14px 이하 글자가 메쉬 위에 직접 놓이지 않았는가(`.plate` 사용).
- 연속한 두 장면이 같은 앵커·같은 바탕을 쓰지 않는가.
- 모노·넓은 자간이 한글에 걸리지 않았는가. ID, hex, 시각, 금액 숫자만 `.mono` 를 쓴다.
- 다크에서 코랄은 코랄, 울트라마린은 울트라마린인가. 라벤더로 바뀌지 않았는가.
- 360/390px 에서 가로 스크롤이 0인가. 터치 타깃이 44px 인가.
- 팩트 시트 밖의 이름, 날짜, 금액이 없는가. 2026-10-27 은 화요일이다.
