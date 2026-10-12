# COMPONENTS — 겹판인쇄소 「겹판 견본 진 제7호」 마크업 계약

> 장면 에이전트(index · pages)는 이 문서의 마크업을 **그대로 복사**한다. 클래스를 새로 만들지 말고, 장면 전용 배치는 `index.css` / `pages/<name>.css` 에만 쓴다(semantic 토큰만, raw hex 금지).
> 값(날짜·인물·수치)은 `DIRECTION.md` 2절 팩트 시트만 쓴다. 기준 **2026년 10월 22일(목) 15:10**, 로그인 **한유리(실장)**.
> 표기: 본문 `2026년 10월 22일(목)`, 표·카드 `10.22(목)`. 요일은 모노 밖: `<span class="mono">10.22</span>(목)`.
> 모노(`.mono`, Martian Mono)는 **라틴·숫자에만**. 한글이 섞인 라벨은 `.label`(Noto Sans KR 500, 자간 0).
> 숫자 뒤에 한글 단위·요일이 붙으면 띄우지 말고 `.nu`로 한 덩어리: `<span class="nu"><span class="mono">4</span>건</span>`, `<span class="nu"><span class="mono">10.21</span>(수)</span>`. flex·grid 부모(버튼, 배지, 폴리오, 모바일 표 칸)의 gap 이 `4 건`처럼 벌리는 것을 막는다.

---

## 0. 페이지 뼈대

### 0-1. `<head>` — index.html

```html
<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>겹판 견본 진 제7호 — 겹판인쇄소</title>
<script>(function(){var r=document.documentElement,t=null;try{var q=new URLSearchParams(location.search).get('theme');if(q==='dark'||q==='light')t=q;else t=localStorage.getItem('gyeoppan-theme');}catch(e){}if(t!=='dark'&&t!=='light')t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';r.setAttribute('data-theme',t);r.classList.add('js');})();</script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Anybody:wdth,wght@75..150,500..900&family=Bagel+Fat+One&family=Schibsted+Grotesk:wght@400..800&family=Noto+Sans+KR:wght@400;500;700&family=Martian+Mono:wdth,wght@87.5,400..600&display=swap">
<link rel="stylesheet" href="styles.css">
<link rel="stylesheet" href="index.css">
</head>
```

### 0-2. `<head>` — pages/*.html

위와 같고 다음만 다르다. `<title>` 은 `<화면 이름> — 겹판 주문실` (예: `오늘의 판 — 겹판 주문실`).

```html
<link rel="stylesheet" href="../styles.css">
<link rel="stylesheet" href="dashboard.css">   <!-- 페이지이름.css -->
```

### 0-3. `<body>` 끝

```html
<!-- 조판 지시 창(⌘K) — 1-5 스니펫 -->
<script src="app.js"></script>      <!-- index -->
<script src="../app.js"></script>   <!-- pages -->
```

- 테마 스크립트는 반드시 `<head>` 안, CSS 앞(FOUC 방지). 우선순위 `?theme=dark|light` → localStorage(`gyeoppan-theme`) → 시스템. `html.js` 도 여기서 붙는다(리빌 대기 상태에 쓰인다).
- 토스트 영역·툴팁·서랍 가림막은 app.js 가 자동으로 만든다. 따로 넣지 않는다.
- 아이콘은 `<span data-icon="이름"></span>` → app.js 가 24px 격자 1.75px 라인 SVG(currentColor)로 채운다. 이름: `search close menu moon sun more chevron-left chevron-right chevron-down arrow-right arrow-left arrow-down check plus minus info alert danger success copy upload download pause play printer drum layers file inbox board chart tag user settings calendar scissors refresh trash pin phone send cart eye grip clock command`. 크기 `.icon--sm`(18) `.icon--lg`(32).

### 0-4. 화면 목록 · 셸

| 파일 | `<title>` 앞부분 | 셸 | 상단 띠지 현재 표시(`aria-current`) | 서랍 현재 표시 |
|---|---|---|---|---|
| `index.html` | 겹판 견본 진 제7호 | **사이트 셸** | 견본 진 | — |
| `pages/dashboard.html` | 오늘의 판 | **앱 셸** | 오늘의 판 | 오늘의 판 |
| `pages/inbox.html` | 분판 확인함 | **앱 셸** | 분판 확인함 | 분판 확인함 |
| `pages/kanban.html` | 작업 대기열 | **앱 셸** | 대기열 | 작업 대기열 |
| `pages/settings.html` | 작업실 설정 | **앱 셸** | (없음) | 설정 |
| `pages/profile.html` | 작가 문소라 | **앱 셸** | (없음) | 작가 문소라 |
| `pages/onboarding.html` | 첫 주문 접수 | 사이트 셸 | (없음) | — |
| `pages/pricing.html` | 단가표 | 사이트 셸 | 단가표 | — |
| `pages/product.html` | 겹판 포스터 №31 | 사이트 셸 | 포스터 상점 | — |
| `pages/404.html` | 파지 | 사이트 셸(서랍 없음) | (없음) | — |

- **사이트 셸** = `<div class="site">` 상단 띠지 + `<main id="main">` + 판권 푸터.
- **앱 셸** = `<div class="app">` 상단 띠지 + 작업 서랍 + `<main class="desk" id="main">` + 판권 푸터.
- 푸터의 현재 페이지 링크에도 `aria-current="page"`.

---

## 1. 공통 셸 스니펫 (복사해서 쓴다 — 바꾸는 곳은 `aria-current` 위치뿐)

### 1-1. 상단 띠지 — index.html 용

```html
<a class="skip-link" href="#main">본문으로 건너뛰기</a>
<header class="topbar">
  <a class="topbar__brand" href="index.html" aria-label="겹판인쇄소 견본 진 첫 쪽">
    <span class="reg" aria-hidden="true"></span>
    <span class="topbar__word plate" data-plate="겹판">겹판</span>
    <span class="topbar__sub" aria-hidden="true">GYEOPPAN<br>RISO</span>
  </a>
  <nav class="topbar__nav" id="site-nav" aria-label="주문실 화면">
    <div class="topbar__navhead"><span>주문실 화면</span><button class="btn btn--ghost btn--icon" type="button" data-offcanvas="site-nav" aria-label="메뉴 닫기"><span data-icon="close"></span></button></div>
    <ul class="topbar__list">
      <li><a class="topbar__link" href="index.html" aria-current="page">견본 진</a></li>
      <li><a class="topbar__link" href="pages/dashboard.html">오늘의 판</a></li>
      <li><a class="topbar__link" href="pages/kanban.html">대기열</a></li>
      <li><a class="topbar__link" href="pages/inbox.html">분판 확인함</a></li>
      <li><a class="topbar__link" href="pages/pricing.html">단가표</a></li>
      <li><a class="topbar__link" href="pages/product.html">포스터 상점</a></li>
    </ul>
  </nav>
  <div class="topbar__tools">
    <button class="btn btn--ghost topbar__cmd" type="button" data-command-open aria-label="조판 지시 창 열기(⌘K)"><span data-icon="search"></span><span class="topbar__cmd-label">주문·손님 찾기</span><kbd>⌘K</kbd></button>
    <button class="btn btn--ghost btn--icon theme-toggle" type="button" data-theme-toggle aria-pressed="false" aria-label="밤 교정 켜기"><span data-icon="moon" data-when="light"></span><span data-icon="sun" data-when="dark"></span></button>
    <button class="btn btn--ghost btn--icon topbar__menu" type="button" data-offcanvas="site-nav" aria-label="메뉴 열기"><span data-icon="menu"></span></button>
  </div>
</header>
```

### 1-2. 상단 띠지 — pages/*.html 용

1-1 과 같고 **경로만** 바꾼다. 앱 셸 페이지(dashboard·inbox·kanban·settings·profile)는 `.topbar__tools` 맨 앞에 **서랍 버튼**을 하나 더 넣는다(1100px 미만에서만 보인다).

```html
<a class="skip-link" href="#main">본문으로 건너뛰기</a>
<header class="topbar">
  <a class="topbar__brand" href="../index.html" aria-label="겹판인쇄소 견본 진 첫 쪽">
    <span class="reg" aria-hidden="true"></span>
    <span class="topbar__word plate" data-plate="겹판">겹판</span>
    <span class="topbar__sub" aria-hidden="true">GYEOPPAN<br>RISO</span>
  </a>
  <nav class="topbar__nav" id="site-nav" aria-label="주문실 화면">
    <div class="topbar__navhead"><span>주문실 화면</span><button class="btn btn--ghost btn--icon" type="button" data-offcanvas="site-nav" aria-label="메뉴 닫기"><span data-icon="close"></span></button></div>
    <ul class="topbar__list">
      <li><a class="topbar__link" href="../index.html">견본 진</a></li>
      <li><a class="topbar__link" href="dashboard.html">오늘의 판</a></li>
      <li><a class="topbar__link" href="kanban.html">대기열</a></li>
      <li><a class="topbar__link" href="inbox.html">분판 확인함</a></li>
      <li><a class="topbar__link" href="pricing.html">단가표</a></li>
      <li><a class="topbar__link" href="product.html">포스터 상점</a></li>
    </ul>
  </nav>
  <div class="topbar__tools">
    <!-- 앱 셸 페이지만: -->
    <button class="btn btn--ghost btn--icon sidebar__toggle" type="button" data-offcanvas="work-drawer" aria-label="작업 서랍 열기"><span data-icon="board"></span></button>
    <!-- 공통: -->
    <button class="btn btn--ghost topbar__cmd" type="button" data-command-open aria-label="조판 지시 창 열기(⌘K)"><span data-icon="search"></span><span class="topbar__cmd-label">주문·손님 찾기</span><kbd>⌘K</kbd></button>
    <button class="btn btn--ghost btn--icon theme-toggle" type="button" data-theme-toggle aria-pressed="false" aria-label="밤 교정 켜기"><span data-icon="moon" data-when="light"></span><span data-icon="sun" data-when="dark"></span></button>
    <button class="btn btn--ghost btn--icon topbar__menu" type="button" data-offcanvas="site-nav" aria-label="메뉴 열기"><span data-icon="menu"></span></button>
  </div>
</header>
```

현재 페이지 링크에만 `aria-current="page"` 를 단다(0-4 표). 1100px 미만에서 `.topbar__nav` 는 오른쪽에서 들어오는 메뉴 판, `#site-nav` 를 `data-offcanvas` 로 연다. 포커스 트랩·Esc·가림막(먹 망점)은 app.js.

### 1-3. 작업 서랍(sidebar) — 앱 셸 페이지(pages 경로)

`.app` 바로 안, `header.topbar` 다음에 둔다. 현재 항목에만 `aria-current="page"`. 숫자(27·6)와 드럼 잔량은 팩트 시트 값 고정.

```html
<aside class="sidebar" id="work-drawer" aria-label="작업 서랍">
  <div class="sidebar__head"><span>작업 서랍</span><button class="btn btn--ghost btn--icon" type="button" data-offcanvas="work-drawer" aria-label="서랍 닫기"><span data-icon="close"></span></button></div>
  <div class="sidebar__group">
    <p class="sidebar__title">작업</p>
    <ul class="sidebar__list">
      <li><a class="sidebar__link" href="dashboard.html"><span class="inkchip" aria-hidden="true"><i class="ink-p"></i><i class="ink-b"></i></span>오늘의 판</a></li>
      <li><a class="sidebar__link" href="kanban.html"><span class="inkchip" aria-hidden="true"><i class="ink-b"></i><i class="ink-t"></i></span>작업 대기열<span class="count" aria-label="열린 작업 27건">27</span></a></li>
      <li><a class="sidebar__link" href="inbox.html"><span class="inkchip" aria-hidden="true"><i class="ink-p"></i><i class="ink-y"></i></span>분판 확인함<span class="count count--pink" aria-label="미확인 6건">6</span></a></li>
    </ul>
  </div>
  <div class="sidebar__group">
    <p class="sidebar__title">손님</p>
    <ul class="sidebar__list">
      <li><a class="sidebar__link" href="onboarding.html"><span class="inkchip" aria-hidden="true"><i class="ink-b"></i><i class="ink-r"></i></span>첫 주문 접수</a></li>
      <li><a class="sidebar__link" href="pricing.html"><span class="inkchip" aria-hidden="true"><i class="ink-y"></i><i class="ink-k"></i></span>단가표</a></li>
      <li><a class="sidebar__link" href="product.html"><span class="inkchip" aria-hidden="true"><i class="ink-p"></i><i class="ink-b"></i><i class="ink-y"></i></span>포스터 상점</a></li>
      <li><a class="sidebar__link" href="profile.html"><span class="inkchip" aria-hidden="true"><i class="ink-p"></i><i class="ink-b"></i></span>작가 문소라</a></li>
    </ul>
  </div>
  <div class="sidebar__group">
    <p class="sidebar__title">작업실</p>
    <ul class="sidebar__list">
      <li><a class="sidebar__link" href="settings.html"><span class="inkchip" aria-hidden="true"><i class="ink-k"></i></span>설정</a></li>
    </ul>
  </div>
  <div class="sidebar__drums">
    <p class="sidebar__drums-title"><span>드럼 잔량</span><span class="mono">15:10</span></p>
    <ul class="drumlvl" aria-label="잉크 드럼 잔량">
      <li class="drumlvl__row is-low ink-p" aria-label="형광 핑크 18%, 부족"><span class="drumlvl__code">P</span><span class="drumlvl__bar"><i data-v="18"></i></span><span class="drumlvl__val">18%</span></li>
      <li class="drumlvl__row ink-b" aria-label="블루 54%"><span class="drumlvl__code">B</span><span class="drumlvl__bar"><i data-v="54"></i></span><span class="drumlvl__val">54%</span></li>
      <li class="drumlvl__row ink-y" aria-label="옐로 71%"><span class="drumlvl__code">Y</span><span class="drumlvl__bar"><i data-v="71"></i></span><span class="drumlvl__val">71%</span></li>
      <li class="drumlvl__row ink-t" aria-label="틸 39%"><span class="drumlvl__code">T</span><span class="drumlvl__bar"><i data-v="39"></i></span><span class="drumlvl__val">39%</span></li>
      <li class="drumlvl__row ink-r" aria-label="브라이트 레드 62%"><span class="drumlvl__code">R</span><span class="drumlvl__bar"><i data-v="62"></i></span><span class="drumlvl__val">62%</span></li>
      <li class="drumlvl__row ink-k" aria-label="먹 80%"><span class="drumlvl__code">K</span><span class="drumlvl__bar"><i data-v="80"></i></span><span class="drumlvl__val">80%</span></li>
    </ul>
  </div>
  <div class="sidebar__user"><span class="avatar avatar--sm" aria-hidden="true">한</span><div><strong>한유리</strong><span>실장 · 주문/견적</span></div></div>
</aside>
```

### 1-4. 판권 푸터 — 모든 페이지 동일

index 경로:

```html
<footer class="colophon">
  <div class="colorbar colophon__bar" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>
  <div class="colophon__inner">
    <div>
      <div class="colophon__mark"><span class="reg" aria-hidden="true"></span><span class="colophon__name plate plate--1" data-plate="겹판인쇄소">겹판인쇄소</span></div>
      <p class="colophon__addr">겹판인쇄소 · 서울 중구 수표로 47-2, 3층 · <span class="mono">02-2273-0721</span> · 화–토 <span class="mono">11:00–20:00</span>(일·월 휴무)</p>
      <p class="colophon__edition">겹판 견본 진 제7호 · 2026 가을 · <span class="mono">120</span>부 중 웹판</p>
    </div>
    <nav class="colophon__nav" aria-label="견본 진과 주문실 화면">
      <ul>
        <li><a href="index.html" aria-current="page">견본 진</a></li>
        <li><a href="pages/dashboard.html">오늘의 판</a></li>
        <li><a href="pages/inbox.html">분판 확인함</a></li>
        <li><a href="pages/kanban.html">작업 대기열</a></li>
        <li><a href="pages/onboarding.html">첫 주문 접수</a></li>
        <li><a href="pages/pricing.html">단가표</a></li>
        <li><a href="pages/product.html">포스터 상점</a></li>
        <li><a href="pages/profile.html">작가 문소라</a></li>
        <li><a href="pages/settings.html">작업실 설정</a></li>
        <li><a href="pages/404.html">파지 쪽</a></li>
      </ul>
    </nav>
  </div>
</footer>
```

pages 경로: 위와 같고 링크만 `../index.html`, `dashboard.html`, `inbox.html` … `404.html`. `aria-current="page"` 는 그 페이지 링크로 옮긴다.

### 1-5. 조판 지시 창(⌘K) — 모든 페이지 `</body>` 앞

index 경로(pages 는 `pages/` 를 떼고 index 는 `../index.html`):

```html
<div class="command" id="command" role="dialog" aria-modal="true" aria-label="조판 지시 창" hidden>
  <div class="command__scrim" data-close></div>
  <div class="command__sheet">
    <div class="command__bar"><span data-icon="search"></span><input class="command__input" type="text" placeholder="주문 번호, 손님, 동작" aria-label="주문 번호·손님·동작 찾기" autocomplete="off"><kbd>Esc</kbd></div>
    <div class="command__list">
      <p class="command__group">주문</p>
      <a class="command__item" href="pages/kanban.html" data-keywords="장터 포스터 2호기"><span class="inkchip" aria-hidden="true"><i class="ink-y"></i><i class="ink-p"></i></span><span class="command__item-main"><strong>장터 안내 포스터</strong><span>백가온 · 2호기 인쇄 중</span></span><span class="command__item-end">GP-2610-045</span></a>
      <a class="command__item" href="pages/kanban.html" data-keywords="진 1호기"><span class="inkchip" aria-hidden="true"><i class="ink-p"></i><i class="ink-b"></i></span><span class="command__item-main"><strong>「뒷골목 진 제12호」</strong><span>이하람 · 1호기 75%</span></span><span class="command__item-end">GP-2610-038</span></a>
      <a class="command__item" href="pages/inbox.html" data-keywords="그림책 분판"><span class="inkchip" aria-hidden="true"><i class="ink-p"></i><i class="ink-b"></i><i class="ink-y"></i></span><span class="command__item-main"><strong>그림책 더미 「도롱뇽의 밤」</strong><span>피윤서 · 분판 확인</span></span><span class="command__item-end">GP-2610-044</span></a>
      <p class="command__group">화면</p>
      <a class="command__item" href="pages/dashboard.html"><span data-icon="chart"></span><span class="command__item-main"><strong>오늘의 판</strong><span>4,860면 · 계획 7,200</span></span><span class="command__item-end">G D</span></a>
      <a class="command__item" href="pages/pricing.html"><span data-icon="tag"></span><span class="command__item-main"><strong>단가표</strong><span>판비 ₩5,000/도</span></span><span class="command__item-end">G P</span></a>
      <p class="command__group">동작</p>
      <button class="command__item" type="button" data-theme-toggle data-keep-label data-keywords="다크 밤 낮 테마"><span data-icon="moon"></span><span class="command__item-main"><strong>밤 교정 켜고 끄기</strong><span>23:10 야간 작업 화면</span></span><span class="command__item-end">⌘J</span></button>
    </div>
    <p class="command__empty" hidden>‘<strong data-command-query></strong>’에 맞는 주문·손님이 없어요.</p>
    <div class="command__foot"><span><kbd>↑↓</kbd>고르기</span><span><kbd>Enter</kbd>열기</span><span><kbd>Esc</kbd>닫기</span></div>
  </div>
</div>
```

---

## 2. 판면 문법 (base.css) — 「접지한 진의 스프레드」

### 2-1. 스프레드 · 제본선 · 폴리오

```html
<section class="spread spread--type" aria-labelledby="ch-type">       <!-- --w: 기본 1320 / --type 1440 / --queue 1240 / --full 100vw -->
  <div class="spread__page"> … 왼쪽 쪽 … <p class="folio folio--abs"><span class="mono">P.06</span> 활자 — <span class="folio__drums"><span class="inkchip" aria-hidden="true"><i class="ink-b"></i><i class="ink-p"></i></span>블루 / 핑크</span></p></div>
  <div class="spread__spine" aria-hidden="true"></div>                 <!-- 제본선 64px + 스테이플 2개 -->
  <div class="spread__across inkface ink-p" aria-hidden="true"></div>  <!-- 제본선을 건너는 잉크 면(위치·크기는 장면 CSS) -->
  <div class="spread__page"> … 오른쪽 쪽 … <p class="folio folio--abs"><span class="mono">P.07</span></p></div>
</section>
```

- 오른쪽 쪽은 `.spread__spine ~ .spread__page` 로 잡는다(마지막 자식 여부와 무관). 두 쪽 높이가 크게 다르면 짧은 쪽에 내용을 옮기거나 `position: sticky` 제목 판으로 채운다 — 제본선만 길게 남는 빈 쪽 금지.

- 1100px 미만: 두 쪽이 위아래로 쌓이고 제본선은 점선 접는 선이 된다. 폴리오는 쪽 끝으로 흐른다.
- 섹션 머리 공통 부품은 없다. 장 구분은 **폴리오**만. 장 제목 자리는 매 장 바꾼다(왼쪽 위 거대 / `.vertical` 세로쓰기 / 색면 안 반전 / 제본선을 건너는 두 단어).
- 장 사이 간격: `.gap-72` `.gap-112` `.gap-168` (같은 값 3번 연속 금지).
- 모바일 쪽 사이 접는 선: `<p class="foldline"><span>P.04</span></p>`.

### 2-2. 그리드 · 묶음

| 클래스 | 뜻 |
|---|---|
| `.wrap` (`--ink` 1320 · `--type` 1440 · `--queue` 1240 · `--read` 680 · `--full`) | 바깥 여백(16→72px) 포함 최대폭 |
| `.cols` (6단) / `.cols.cols--12` + `.span-1…12` `.span-all` | 단 간격 24. 1100 미만 12단→6단, 720 미만 1단 |
| `.stack` (`--sm` `--lg`) · `.cluster` · `.split` | 세로 묶음 · 가로 줄바꿈 묶음 · 양끝 정렬 |

### 2-3. 낱장 판형

`.sheet` (`--a4` 1:1.414 · `--a5` · `--a6` 가로 1.414:1 · `--strip` 띠지 · `--gangji` 갱지 면 · `--free` 비율 해제). 720 미만에서 A4/A5 비율은 풀린다. 낱장끼리 겹치기: 부모 `.sheaf`(최대 24px).

### 2-4. 인쇄소 흔적

```html
<span class="reg reg--abs reg--tl" aria-hidden="true"></span>     <!-- 정합 마크 ⊕ 20px (tl/tr/bl/br, .reg--lg 40px) — 표지·포스터·모달 모서리에만 -->
<span class="cropmarks" aria-hidden="true"></span>                 <!-- 재단선: position:relative 인 낱장 안에 둔다(바깥 12px, 길이 16px). 색은 --crop-mark(바깥 문맥 색) 라 .paper-light 안에서도 흑지 위에 보인다 -->
<div class="colorbar" aria-hidden="true"><i></i>×12</div>          <!-- 드럼 6색 + 망점 10/20/40/60/80/100 — 표지 아래·푸터에만 -->
<span class="stamp">7/120<small>2026 가을</small></span>             <!-- 에디션 도장(tilt-3). .stamp--lg 120px, .stamp--pink -->
```

기울기 `.tilt-1`(-0.6°) `.tilt-2`(1.2°) `.tilt-3`(-2.5°, 스티커·도장 전용). **한 뷰포트에 최대 2개. 표·폼·본문 단락은 기울이지 않는다.**

### 2-5. 시그니처 ① 2판 겹침 — 디스플레이 글자

```html
<h1 class="h-cover plate" data-plate="겹판">겹판</h1>
```

- 글자 자체 = 2번 판(블루), `::before` = 1번 판(핑크)이 `--mis-3` 만큼 어긋나 multiply(밤 screen)로 겹친다. `data-plate` 는 글자와 **같은 문구**.
- 어긋남: 기본 `--mis-3` · `.plate--2`(3/2px) · `.plate--1`(1.5/-1px) · `.plate--0`(정합).
- 드럼 교체: `.plate--py`(옐로→핑크) `.plate--yb` `.plate--pt` `.plate--br`. 블루 면 위 반전 제목: `.plate--reverse`(종이색 글자 + 핑크 판).
- 32px 이상 디스플레이에만. 본문·표 숫자·입력값에는 쓰지 않는다.
- **줄바꿈은 `<br>` 금지**: `::before { content: attr(data-plate) }` 는 `<br>` 을 따라가지 않아 핑크 판이 다른 줄로 찍힌다. 줄은 `max-width`(em)로 나눈다.
- **밤**: screen 겹침은 핑크×블루를 라일락으로 날린다. 그래서 밤의 `.plate` 는 1번 판(형광 핑크) 실면이 위, 2번 판(블루)이 밑에서 어긋나 비친다(base.css). 낱장(`.poster`·`.paper-light`) 안은 낮 그대로 multiply.
- 큰 블루 면(`.inkface.ink-b`)은 `--face-blue`(밤 #3D5FCB) + `--on-face-blue`(흰 잉크) — 밤에도 블루가 파스텔로 바래지 않는다.
- 먹(K) 잉크 면은 `--ink-black`(밤에도 먹) + `--k-edge` 키라인. 흰 잉크 띠로 뒤집지 않는다.

활자 클래스: `.h-cover`(248/104) `.h-poster`(136/64) `.h-d2`(64/38) `.h1`(44/30) `.h2`(30/23) — Bagel Fat One. `.h3`(21/18, Noto 700). `.numeral`(Anybody wdth150 900, 112/56, `.numeral--narrow` wdth75). `.display`(라틴 제목). `.mono` `.caps`(라틴 대문자 라벨만) `.label`(한글 라벨) `.lead` `.small` `.muted` `.vertical`.

### 2-6. 시그니처 ② 망점 · 잉크 결

```html
<div class="dots dots--40 ink-b"></div>            <!-- 블루 40% 망점 면. 10/20/40/60/80/100 -->
<div class="inkface ink-p">…글자…</div>             <!-- 잉크 면(결 마스크는 ::before 면에만 — 글자는 깨끗) -->
<div class="inkface inkface--round ink-p"></div>    <!-- 둥근 해 -->
<div class="inkface inkface--over ink-b"></div>     <!-- 2번 판 면: 아래 면과 겹침색을 만든다 -->
<div class="inkface inkface--soft ink-b">…</div>    <!-- 글자 얹는 면: 결 절반 -->
```

- 잉크 지정 유틸: `.ink-p` `.ink-b` `.ink-y` `.ink-t` `.ink-r` `.ink-k` → `--c`(잉크) `--on`(그 위 글자색) 설정. 틸 면 위에 작은 글자가 얹히면 `.ink-t--text`(진한 틸 #006B70 면).
- **형광 잉크(핑크·옐로·레드) 위 글자는 먹**(`--on-fluo`), 블루·겹침 면 위는 종이색(`--on-deep`). 형광 잉크를 글자색으로 쓰지 않는다(낮). 핑크 글자가 꼭 필요하면 `--text-pink`.
- `.inkface` 는 120px 이상 넓은 면에만. 본문 위 전면 그레인 금지.
- 인쇄물 낱장(`.poster`, `.paper-light`)은 밤 화면에서도 모조지 + multiply 로 남는다(흑지 위에 놓인 종이).

### 2-7. 망점 초상

`<span class="avatar avatar--pink avatar--lg" role="img" aria-label="문소라">문</span>` — 글자는 시각적으로 숨김(초상만 보임), 이름은 aria-label. 크기 `--sm`32 · 기본44 · `--lg`96 · `--xl`200. 색 `--pink` `--blue` `--teal`.

---

## 3. 부품 32종

모든 부품 상태: hover · focus-visible(블루 키라인 2px + 핑크 판 3px 어긋남) · active · disabled · loading · error · selected 를 아래 속성으로 낸다. 반경은 0(스티커·아바타·토글만 pill). 그림자 없음, 검정 굵은 테두리 없음.

### accordion — 접지한 리플릿

```html
<div class="accordion" data-single>   <!-- data-single: 하나만 열림 -->
  <div class="accordion__item is-open">
    <h3 class="accordion__head"><button class="accordion__trigger" type="button" aria-expanded="true" aria-controls="faq-1"><span class="accordion__label">분판 파일은 어떻게 보내나요?</span><span class="accordion__icon" aria-hidden="true"></span></button></h3>
    <div class="accordion__panel" id="faq-1"><div class="accordion__inner"><div class="accordion__body"><p>판마다 흑백(그레이스케일) PDF 한 장씩 보내 주세요. 검정 100%가 잉크 100%예요.</p></div></div></div>
  </div>
</div>
```
열린 행 = 핑크 판 띠 6px + 위→아래 와이프. 닫힌 패널은 app.js 가 `inert`. 비활성 `aria-disabled="true"`.

### alert — 작업 지시 쪽지(띠지)

```html
<div class="alert alert--warn" role="status">            <!-- --info(기본) --warn --danger(role="alert") --success · .alert--band = 띠 전체 채움 -->
  <div class="alert__block"><span data-icon="alert"></span></div>
  <div class="alert__body">
    <p class="alert__title">형광 핑크 잔량 18%</p>
    <p class="alert__text"><span class="mono">10/24</span>(토) <span class="mono">11:00</span> 2통 입고 예정이에요.</p>
    <div class="alert__actions"><button class="btn btn--sm btn--ghost" type="button">입고 알림 받기</button></div>
  </div>
  <button class="btn btn--ghost btn--icon alert__close" type="button" data-dismiss aria-label="쪽지 닫기"><span data-icon="close"></span></button>
</div>
```
아이콘: info · alert · danger · success · clock.

### badge — 스티커 · 잉크 칩 · 숫자 칩

```html
<span class="badge ink-p">인쇄 중</span>                 <!-- 상태 스티커 — 아래 「상태 = 스티커 하나」 표대로만 -->
<span class="badge badge--dots">접수</span>              <!-- 대기(점선 테두리) -->
<span class="badge badge--line ink-b">1호기</span>       <!-- 키라인만 -->
<span class="badge badge--sticker ink-y">장터</span>     <!-- 기운 스티커(Bagel) -->
<span class="badge badge--sm ink-p">…</span>             <!-- 표 안 -->
<span class="inkchip" role="img" aria-label="핑크+블루"><i class="ink-p"></i><i class="ink-b"></i></span>   <!-- --lg 22 · --xl 44 -->
<span class="count">27</span> <span class="count count--pink">6</span>
```

**상태 = 스티커 하나 (고정).** index 대기열 표 · dashboard 작업 일지 · kanban 카드/쪽지 · profile 진행 중 주문 모두 이 클래스만 쓴다. 표 안은 `badge--sm` 만 덧붙인다.

| 상태(대기열 단) | 클래스 | 모양 |
|---|---|---|
| 접수 · 분판 확인 대기 | `badge badge--dots` | 먹 망점 점선 테두리 |
| 분판 확인 | `badge ink-b` | 블루 채움 |
| 인쇄 중 · N호기 | `badge ink-p` | 핑크 채움 |
| 인쇄 대기(1호기 다음 차례) | `badge badge--line ink-p` | 핑크 키라인 |
| 건조·제본 | `badge ink-y` | 옐로 채움 |
| 출고 대기 · 오늘 출고 | `badge ink-t--text` | 틸 채움 |
| 출고 완료 | `badge badge--line ink-b` | 블루 키라인 |
| 납기 오늘(덧붙임) | `badge ink-r` | 레드 채움 |

`badge--sticker ink-y`(장터)는 상태가 아니라 카드 위에 붙인 쪽지다.

### breadcrumb — 작업 경로

```html
<nav class="crumbs" aria-label="작업 경로"><ol><li><a href="dashboard.html">주문실</a></li><li><a href="kanban.html">작업 대기열</a></li><li><span aria-current="page"><span class="mono">GP-2610-045</span></span></li></ol></nav>
```

### button — 잉크 면 + 2번 판 키라인

```html
<button class="btn btn--primary" type="button">견적 보내기</button>      <!-- 핑크 면 + 먹 글자 + 블루 키라인 -->
<button class="btn btn--secondary" type="button">판 걸기</button>        <!-- 블루 면 + 종이 글자 + 핑크 키라인 -->
<button class="btn btn--ghost" type="button">분판 보기</button>          <!-- 키라인만, hover 블루 망점 -->
<button class="btn btn--danger" type="button">주문 보류</button>         <!-- 레드 면 + 먹 글자 -->
<button class="btn btn--yellow" type="button">장터 접수</button>
<button class="btn btn--text" type="button">자세히</button>              <!-- 표 안 보조 동작 -->
<button class="btn btn--ghost btn--icon" type="button" aria-label="작업 메뉴"><span data-icon="more"></span></button>
```
크기 `--sm`(36, 데스크톱 표 안만 · 터치 기기 44) · 기본 44 · `--lg` 56 · `--block`. 상태: `:disabled`/`aria-disabled` 먹 망점·키라인 없음 · `aria-busy="true"` + `<span class="btn__spin" aria-hidden="true"></span>`(키라인이 드럼처럼 왕복) · `data-state="error"` 레드 키라인 · `aria-pressed="true"` 겹침 면(토글). 묶음 `.btn-row`. 시연: `data-busy="1200"`(로딩 후 `data-toast` 있으면 토스트).

### calendar — 리소 달력 포스터

```html
<div class="cal" data-calendar>
  <div class="cal__head">
    <p class="cal__month"><span class="numeral plate plate--2" data-plate="10">10</span><span class="cal__year"><strong>2026년 10월</strong>장터 달력</span></p>
    <div class="cal__nav"><button class="btn btn--ghost btn--icon" type="button" aria-label="9월" aria-disabled="true"><span data-icon="chevron-left"></span></button><button class="btn btn--ghost btn--icon" type="button" aria-label="11월" aria-disabled="true"><span data-icon="chevron-right"></span></button></div>
  </div>
  <div class="cal__grid">
    <span class="cal__dow cal__dow--sun">일</span><span class="cal__dow">월</span>…<span class="cal__dow">토</span>
    <button class="cal__day cal__day--out" type="button" aria-label="9월 27일">27</button>        <!-- 9/27–30 앞 칸 -->
    <button class="cal__day" type="button" aria-label="10월 1일(목)">1</button>
    <button class="cal__day cal__day--holiday" type="button" aria-label="10월 9일(금) 한글날 휴무">9<span class="cal__note">한글날</span></button>
    <button class="cal__day is-today" type="button" aria-label="10월 22일(목) 오늘" data-summary="10월 22일(목) · 인쇄 중 3건">22<span class="cal__note">오늘</span></button>
    <button class="cal__day" type="button" aria-label="10월 24일(토) 형광 핑크 입고">24<span class="cal__ev" aria-hidden="true"><i class="ink-p"></i><i class="ink-b"></i></span><span class="cal__note">핑크 입고</span></button>
    <button class="cal__day is-span is-span-start" type="button" aria-label="10월 31일(토) 을지 작은책 장터"><span class="cal__band" aria-hidden="true"></span>31<span class="cal__note">장터</span></button>
    <button class="cal__day cal__day--out is-span is-span-end" type="button" aria-label="11월 1일(일) 을지 작은책 장터"><span class="cal__band" aria-hidden="true"></span>1<span class="cal__note">장터</span></button>
  </div>
  <ul class="cal__legend"><li><span class="cal__swatch cal__swatch--today"></span>오늘</li><li><span class="cal__swatch cal__swatch--span"></span>을지 작은책 장터</li></ul>
  <p class="cal__output" aria-live="polite"></p>
</div>
```
2026년 10월 1일 = 목. 일·월 휴무 날은 `.cal__day--closed`. 선택 = `aria-pressed="true"`(겹침 면, app.js), 방향키 이동.

### card — 낱장 시트

```html
<article class="card">                                  <!-- a.card = 링크 낱장(hover 키라인 슬립) · --a4 --a5 --a6 --strip --gangji --ink(+ .ink-b) -->
  <span class="card__band ink-p" aria-hidden="true"></span>   <!-- 또는 .card__band--2 (두 판) -->
  <div class="card__head"><p class="card__kicker"><span class="mono">GP-2610-045</span> · 2호기</p><span class="badge badge--sm ink-p">인쇄 중</span></div>
  <h3 class="card__title">장터 안내 포스터</h3>
  <p class="card__body">옐로판 300/300 완료, 핑크판 184/300.</p>
  <p class="card__meta"><span>백가온</span><span>A3 · 300장</span></p>
  <div class="card__foot"><span><span class="mono">10.23</span>(금)</span><button class="btn btn--sm btn--ghost" type="button">상세</button></div>
</article>
```
재단선: `.card--crop` + 안에 `<span class="cropmarks" aria-hidden="true"></span>`. 상태 `.is-selected` · `.is-disabled` · `data-state="error"` · `aria-busy`.

### carousel — 포스터 넘기기 (+ 포스터 아트)

```html
<div class="carousel" data-carousel aria-label="겹판 포스터">
  <div class="carousel__viewport"><div class="carousel__track">
    <div class="carousel__slide" data-caption="№31 밤의 인쇄골목">
      <div class="poster poster--n31" role="img" aria-label="겹판 포스터 №31 「밤의 인쇄골목」 — 셔터 내린 골목, 3층 창문만 핑크"><span class="poster__plate poster__plate--b"></span><span class="poster__plate poster__plate--p"></span><span class="poster__plate poster__plate--y"></span><span class="poster__no">№31</span></div>
      <p class="carousel__caption"><strong>「밤의 인쇄골목」</strong><span>문소라 · 3도 · <span class="mono">₩32,000</span></span></p>
    </div>
    <!-- №28 poster--n28 (plate--t, plate--p) · №29 poster--n29 (plate--y, plate--b) · №30 poster--n30 is-soldout (p, y, b) -->
  </div></div>
  <div class="carousel__controls"><div class="carousel__dots"></div><span class="carousel__count"></span>
    <div class="carousel__btns"><button class="btn btn--ghost btn--icon" type="button" data-carousel-prev aria-label="이전 포스터"><span data-icon="chevron-left"></span></button><button class="btn btn--ghost btn--icon" type="button" data-carousel-next aria-label="다음 포스터"><span data-icon="chevron-right"></span></button></div></div>
</div>
```
점(현재 = 두 판 겹친 점)은 app.js 가 만든다. ←/→ · 스와이프.
**분판 보기**(product): `<button class="btn btn--ghost" type="button" data-plate-toggle="p" data-target="#poster-31" aria-pressed="true">핑크판</button>` (b·y 같음) → 해당 판 켜고 끄기. `data-register="#poster-31"` → 판 정합(어긋남 0). 품절 `.is-soldout`.

### code — 분판 지시서

```html
<figure class="code">
  <figcaption class="code__head"><span class="code__file">분판 지시서 <span class="mono">RUN-1022-03.txt</span></span><button class="btn btn--ghost btn--sm code__copy" type="button" data-copy><span data-copy-label>복사</span></button></figcaption>
  <pre class="code__body"><code><span class="code__line"><span class="tk-k">order</span>: <span class="tk-s">"GP-2610-045"</span></span><span class="code__line is-hl"><span class="tk-k">plate</span>: <span class="tk-s">"P"</span>  <span class="tk-c"># 형광 핑크 · 2호기</span></span><span class="code__line"><span class="tk-k">sheets</span>: <span class="tk-n">300</span></span></code></pre>
</figure>
```
줄 번호는 CSS 카운터(`.code__line` 마다). 인라인 `<code class="inline">`.

### command — 조판 지시 창(⌘K)

전역 1개는 1-5 스니펫. index 의 **열린 상태 견본**은 `.command.command--static`(hidden·scrim 없이) 안에 같은 구조, 입력값을 미리 채워 두면(`value="장터"`) app.js 가 필터·`<mark>` 를 적용한다. 트리거 `data-command-open` · ⌘K/Ctrl+K. 항목 = `a[href]` 또는 다른 훅(`data-open`, `data-toast`, `data-theme-toggle`)을 가진 `button`. `data-keywords` 로 검색어 추가, `data-keep-open` 이면 실행 후 안 닫힘.

### drawer — 종이 서랍

```html
<button class="btn btn--ghost" type="button" data-open="dr-045">주문 상세</button>
<div class="drawer" id="dr-045" role="dialog" aria-modal="true" aria-labelledby="dr-045-t" hidden>   <!-- .drawer--left -->
  <div class="drawer__scrim" data-close></div>
  <div class="drawer__sheet">
    <header class="drawer__head"><p class="drawer__kicker"><span class="mono">GP-2610-045</span><span class="badge badge--sm ink-p">인쇄 중</span></p><h2 class="drawer__title" id="dr-045-t">장터 안내 포스터</h2><button class="btn btn--ghost btn--icon drawer__close" type="button" data-close aria-label="서랍 닫기"><span data-icon="close"></span></button></header>
    <div class="drawer__body"><dl class="spec"><dt>손님</dt><dd>백가온 · 을지 작은책 장터</dd><dt>규격</dt><dd>A3 · 옐로→핑크 2도 · <span class="mono">300</span>장</dd><dt>납기</dt><dd><span class="mono">10.23</span>(금)</dd></dl></div>
    <footer class="drawer__foot"><button class="btn btn--ghost" type="button" data-close>닫기</button><button class="btn btn--secondary" type="button">출고 처리</button></footer>
  </div>
</div>
```
정적 견본 `.drawer.drawer--static`(hidden 없음, scrim 없음).

### empty — 빈 드럼

```html
<div class="empty">   <!-- .empty--center -->
  <span class="empty__drum" aria-hidden="true"></span>
  <div class="empty__body"><p class="empty__title">빈 드럼이에요</p><p class="empty__text">틸 드럼에 걸린 작업이 없어요. 장터 안내 리플릿을 걸 수 있어요.</p><button class="btn btn--secondary" type="button">작업 걸기</button></div>
</div>
```

### form — 주문 전표

```html
<form class="fields" data-validate data-success="전표를 받았어요" data-success-text="GP-2610-043 · 견적은 1시간 안에 보내요">
  <div class="field"><label class="field__label" for="o-name">주문자<span class="field__req" aria-hidden="true">*</span></label><input class="input" id="o-name" required data-required="주문자 이름을 적어 주세요." value="서지안"></div>
  <div class="field"><label class="field__label" for="o-qty">부수</label><div class="input-group"><input class="input input--num" id="o-qty" type="number" min="50" value="200" data-min="최소 주문은 50장이에요."><span class="input-group__addon">부</span></div><p class="field__hint">최소 주문 50장</p></div>
  <div class="field"><label class="field__label" for="o-paper">종이</label><span class="select"><select id="o-paper"><option>모조 100g · ₩60</option><option>모조 150g · ₩95</option><option>재생 갱지 80g · ₩40</option><option>색지 120g · ₩120</option><option>크라프트 180g · ₩140</option></select></span></div>
  <div class="field"><label class="field__label" for="o-file">블루판 파일</label><input class="input input--mono" id="o-file" value="yeonhui_B.pdf" aria-invalid="true" aria-describedby="o-file-err"><p class="field__error" id="o-file-err" data-static><span data-icon="alert"></span><span>블루판 파일이 RGB예요. 흑백(그레이스케일)으로 보내 주세요.</span></p></div>
  <div class="field field--wide"><label class="field__label" for="o-memo">요청 <span class="field__opt">선택</span></label><textarea class="textarea" id="o-memo"></textarea></div>
</form>
```
- 체크 `<label class="check"><input type="checkbox" checked><span class="check__box" aria-hidden="true"></span><span>중철 제본</span></label>` · 라디오 `.radio`/`.radio__box` · 토글 `<label class="toggle"><input type="checkbox" role="switch"><span class="toggle__track" aria-hidden="true"></span><span>장터 주간 야간 작업</span></label>`.
- 슬라이더 `<div class="range"><input class="range__input" id="warn" type="range" min="5" max="50" value="20" data-format="{v}%"><output class="range__out" for="warn">20%</output></div>`.
- 세그먼트(필터) `<div class="segment" role="radiogroup" aria-label="인쇄기"><label><input type="radio" name="m" checked><span>전체</span></label>…</div>`.
- 드럼 고르기 `<fieldset class="cluster" data-max="2"><legend class="field__label">잉크 고르기(2도)</legend><label class="drumpick"><input type="checkbox" name="ink" value="B"><span class="drumpick__face"><span class="drumpick__ink ink-b"></span>블루 <span class="mono">B</span></span></label>…</fieldset>` — `data-max` 를 넘기면 나머지가 비활성, `gyeop:drums` 이벤트(detail.picked).
- 분판 파일 `<label class="dropzone"><input type="file" accept="application/pdf"><span data-icon="upload"></span><span>판별 흑백 PDF를 놓아 주세요</span><span class="mono" data-file-name></span></label>` (`data-state="error"`).
- 상태: `aria-invalid="true"` 레드 판 띠 · `data-state="ok"` · `:disabled` 먹 망점 · `[readonly]` 점선 괘선. 배치 `.fields`(2단, `.field--wide`) · `.choices`(`--col`).

### kanban — 작업 대기열 벽

```html
<div class="kanban scroll-x" data-kanban aria-label="작업 대기열">   <!-- --kcols 기본 5 -->
  <section class="kanban__col ink-p" data-status="printing" data-extra="0" aria-labelledby="kc-3">
    <header class="kanban__head"><span class="kanban__count" aria-hidden="true">3</span><h3 class="kanban__name" id="kc-3">인쇄 중<span class="kanban__sub">1호기 · 2호기</span></h3></header>
    <ol class="kanban__list" role="list">
      <li class="kcard" data-id="GP-2610-038">
        <div class="kcard__top"><span class="kcard__id">GP-2610-038</span><span class="inkchip" role="img" aria-label="핑크+블루"><i class="ink-p"></i><i class="ink-b"></i></span></div>
        <p class="kcard__title">「뒷골목 진 제12호」</p>
        <p class="kcard__meta">A5 중철 20쪽 · <span class="mono">150</span>부</p>
        <div class="meter meter--sm" role="progressbar" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100" aria-label="1호기 진행"><div class="meter__head"><span class="meter__label">1호기</span><span class="meter__value">1,120/1,500면</span></div><div class="meter__track"><span class="meter__fill"></span></div></div>
        <div class="kcard__foot"><span class="kcard__who">이하람</span><span class="kcard__due is-soon"><span class="mono">10.24</span>(토)</span></div>
      </li>
    </ol>
  </section>
</div>
```
- 열 머리 숫자 색 = 열의 `.ink-*`(접수 `ink-b` · 분판 확인 `ink-y` 대신 `ink-b`… 장면에서 자유, 단 형광 옐로 숫자는 쓰지 않는다). 건수가 카드 수보다 많으면 `data-extra="나머지 건수"`(app.js 가 `카드 수 + extra` 로 다시 센다) + `<p class="kanban__more">외 7건</p>`.
- 장터 쪽지: `<span class="badge badge--sticker ink-y kcard__sticker">장터</span>`.
- 상태: `.is-grabbed`(키보드로 집음) · `.is-dragging` · `data-state="error"` · `aria-disabled`. 키보드: Space/Enter 집기 → ←/→ 열, ↑/↓ 순서 → Space 놓기, Esc 취소. 이동 시 `gyeop:move`(detail.id, to).

### list — 주문 쪽지 목록

```html
<ul class="slips">   <!-- .slips--compact -->
  <li class="slips__item is-unread">     <!-- .is-selected / .is-done / data-state="error" -->
    <span class="slips__lead"><span class="inkchip inkchip--lg" aria-hidden="true"><i class="ink-p"></i><i class="ink-b"></i></span></span>
    <div class="slips__main"><p class="slips__title">옐로판 선 굵기 0.15pt</p><p class="slips__sub">피윤서 · <span class="mono">MSG-2610-118</span></p></div>
    <div class="slips__end"><span class="slips__num">GP-2610-044</span><span class="slips__when"><span class="mono">14:52</span></span></div>
    <a class="slips__link" href="inbox.html" aria-label="피윤서 메시지 열기"></a>   <!-- 행 전체 링크(선택) -->
  </li>
</ul>
```

### marquee — 띠지

```html
<div class="marquee" data-marquee>   <!-- .marquee--pink -->
  <div class="marquee__viewport"><div class="marquee__track"><div class="marquee__group">
    <span class="marquee__item">장터 접수 마감 <span class="mono">10/27</span>(화) <span class="mono">18:00</span></span>
    <span class="marquee__item">형광 핑크 입고 <span class="mono">10/24</span>(토)</span>
    <span class="marquee__item">을지 작은책 장터 겹판 부스 <span class="mono">B-14</span></span>
  </div></div></div>
  <button class="marquee__toggle" type="button"><span data-icon="pause" data-when="running"></span><span data-icon="play" data-when="paused"></span></button>
</div>
```
그룹은 app.js 가 한 번 복제(aria-hidden). hover/포커스/버튼으로 멈춤, reduced-motion 이면 처음부터 멈춤.

### menu — 작업 메뉴(⋯)

```html
<div class="menu menu--end">   <!-- --end 오른쪽 정렬 · --up 위로 -->
  <button class="btn btn--ghost btn--icon menu__trigger" type="button" aria-haspopup="menu" aria-controls="mn-045" aria-label="GP-2610-045 작업 메뉴"><span data-icon="more"></span></button>
  <div class="menu__list" id="mn-045" role="menu">
    <p class="menu__label"><span class="mono">GP-2610-045</span></p>
    <button class="menu__item" type="button" role="menuitem"><span data-icon="refresh"></span>판 다시 걸기<kbd>R</kbd></button>
    <button class="menu__item" type="button" role="menuitem" data-open="m-reprint"><span data-icon="printer"></span>교정쇄 한 장</button>
    <button class="menu__item" type="button" role="menuitem" aria-disabled="true"><span data-icon="scissors"></span>재단 넘기기</button>
    <hr class="menu__sep">
    <button class="menu__item menu__item--danger" type="button" role="menuitem"><span data-icon="trash"></span>주문 보류</button>
  </div>
</div>
```
정적 견본 `.menu__list.menu__list--static`. `role="menuitemcheckbox"/"menuitemradio"` + `aria-checked` 지원. ↑↓ Home End Esc.

### modal — 교정쇄 한 장

```html
<div class="modal" id="m-reprint" role="dialog" aria-modal="true" aria-labelledby="m-reprint-t" hidden>   <!-- .modal--danger 레드 키라인 -->
  <div class="modal__scrim" data-close></div>
  <div class="modal__sheet">
    <span class="reg reg--tl" aria-hidden="true"></span><span class="reg reg--tr" aria-hidden="true"></span><span class="reg reg--bl" aria-hidden="true"></span><span class="reg reg--br" aria-hidden="true"></span>
    <header class="modal__head"><p class="modal__kicker"><span class="mono">GP-2610-045</span> · 2호기</p><h2 class="modal__title" id="m-reprint-t">핑크판 다시 찍을까요?</h2><button class="btn btn--ghost btn--icon modal__close" type="button" data-close aria-label="닫기"><span data-icon="close"></span></button></header>
    <div class="modal__body"><p>판 어긋남 <span class="mono">1.4mm</span>. 허용치 ±1mm를 넘어 핑크판 <span class="mono">38</span>장을 파지로 돌려요.</p></div>
    <footer class="modal__foot"><button class="btn btn--ghost" type="button" data-close>그대로 두기</button><button class="btn btn--danger" type="button" data-close data-toast="핑크판을 다시 걸었어요" data-toast-text="RUN-1022-04 · 38장" data-toast-tone="success">다시 찍기</button></footer>
  </div>
</div>
```
트리거 `data-open="m-reprint"`. 포커스 트랩·Esc·포커스 복귀·스크롤 잠금은 app.js. 정적 견본 `.modal.modal--static`(hidden·scrim·close 없이).

### motion — 판 찍힘

- 리빌(2도 인쇄 순서):
```html
<div class="print" data-print>
  <span class="print__plate print__plate--1 inkface ink-p" aria-hidden="true"></span>   <!-- 위치·크기는 장면 CSS -->
  <span class="print__plate print__plate--2 inkface ink-b" aria-hidden="true"></span>
  <div class="print__text">…</div>
</div>
```
  화면에 들어오면 1회: 1번 판 와이프 → 60ms 뒤 2번 판(`--mis-3`→`--mis-2`) → 글자. 목록 스태거 `data-print-list`(자식마다 60ms). no-JS·reduced-motion = 최종 상태.
- 견본(index): `.motion-demo#md` > `.motion-demo__cell` > `.motion-demo__stage`(`.motion-demo__sq--1/--2` · `.motion-demo__word[data-plate="판"]` · `.stamp.motion-demo__stamp`) + `<button class="btn btn--ghost btn--sm" type="button" data-replay="md">다시 찍기</button>`. `data-replay` 는 `[data-print]` 요소 id 도 받는다.
- 도장 찍힘 유틸 `.stamp-in`.

### navbar — 상단 띠지

1-1 / 1-2 스니펫 그대로.

### pagination — 쪽 번호

```html
<nav class="pager" data-pager data-total="27" data-per="8" aria-label="작업 일지 쪽">
  <button class="pager__btn" type="button" data-pager-prev aria-label="이전 쪽"><span data-icon="chevron-left"></span></button>
  <ul class="pager__list"><li><button class="pager__page" type="button" aria-current="page">1</button></li><li><button class="pager__page" type="button">2</button></li><li><button class="pager__page" type="button">3</button></li><li class="pager__far"><button class="pager__page" type="button">4</button></li></ul>
  <button class="pager__btn" type="button" data-pager-next aria-label="다음 쪽"><span data-icon="chevron-right"></span></button>
  <p class="pager__info" data-pager-info></p>
</nav>
```
`.pager__far` 는 720 미만에서 숨김, `.pager__gap` = `…`. 쪽 바뀜 `gyeop:page`.

### popover — 견본 칩

```html
<div class="popover">
  <button class="btn btn--ghost" type="button" data-popover-trigger aria-controls="pop-pb">핑크 × 블루</button>
  <div class="popover__panel" id="pop-pb" role="dialog" aria-label="핑크 × 블루 겹침 견본">
    <p class="popover__title"><span class="inkchip inkchip--lg" aria-hidden="true"><i class="ink-p"></i><i class="ink-b"></i></span>핑크 × 블루</p>
    <dl class="popover__rows"><dt>겹침색</dt><dd class="mono">#321871</dd><dt>쓰인 작업</dt><dd>이번 달 <span class="mono">9</span>건</dd></dl>
  </div>
</div>
```
꼬리 대신 2번 판 키라인이 트리거 쪽으로 어긋남(위로 열리면 자동 `data-side="top"`). 정적 견본 `.popover__panel--static`.

### progress — 인쇄 진행 · 드럼 · 누적 · 겹침 막대

```html
<div class="meter" role="progressbar" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100" aria-label="1호기 「뒷골목 진 제12호」">
  <div class="meter__head"><span class="meter__label">1호기 · 「뒷골목 진 제12호」</span><span class="meter__value">1,120/1,500면</span></div>
  <div class="meter__track"><span class="meter__fill"></span></div>
</div>
```
`--sm` `--lg` · `--low`(부족: 핑크 판만 + 경고) · `--done` · `--indeterminate`. 2호기 판별 진행: 트랙 안에 `<span class="meter__fill meter__fill--y" data-v="100"></span><span class="meter__fill meter__fill--p2" data-v="61"></span>`. 값은 `aria-valuenow` 또는 `data-v` → app.js 가 `--v` 로.

드럼 원통:
```html
<div class="drums">
  <div class="drum ink-p is-low" role="meter" aria-valuenow="18" aria-valuemin="0" aria-valuemax="100" aria-label="형광 핑크 잔량 18%, 10/24 입고">
    <div class="drum__can"><span class="drum__ink"></span></div>
    <div class="drum__label"><span class="drum__code">P</span><span class="drum__name">형광 핑크</span><span class="drum__val">18%</span></div>
  </div>
  <!-- B 54 · Y 71 · T 39 · R 62 · K 80 -->
</div>
```
100% 누적 막대(대기열 상태):
```html
<div class="stackbar" role="img" aria-label="열린 작업 27건: 접수 9, 분판 확인 6, 인쇄 중 3, 건조·제본 5, 출고 대기 4">
  <div class="stackbar__bar"><span class="stackbar__seg stackbar__seg--dots ink-b" data-n="9"></span><span class="stackbar__seg ink-b" data-n="6"></span><span class="stackbar__seg ink-p" data-n="3"></span><span class="stackbar__seg ink-y" data-n="5"></span><span class="stackbar__seg ink-t" data-n="4"></span></div>
  <ul class="stackbar__legend"><li class="ink-b"><i></i>접수 <span class="mono">9</span></li>…</ul>
</div>
```
계획 × 실제 겹침 막대(dashboard 10영업일):
```html
<div class="barpair" role="img" aria-label="최근 10영업일 계획 대비 실제 면수">
  <div class="barpair__col" data-plan="56" data-real="54"><span class="barpair__plan"></span><span class="barpair__real"></span><span class="barpair__over"></span></div>
  …
  <div class="barpair__col is-live" data-plan="100" data-real="68"><span class="barpair__plan"></span><span class="barpair__real"></span><span class="barpair__over"></span></div>
</div>
<div class="barpair__axis"><span><span class="mono">10.8</span></span>…<span class="is-today"><span class="mono">10.22</span></span></div>
```
`data-plan`/`data-real` = 최대값(7,200면 등) 대비 %. 세 구간: 0→min(계획, 실제) = 달성분 `--chart-over` 실면(낮 #321871 · 밤 #7B3FE4) / 실제가 모자라면 그 위 계획까지 블루 40% 망점만 / 계획을 넘기면 그 위 실제까지 핑크 실면만. 진행 중(`is-live`)은 달성 실면 꼭대기에 핑크 띠. 원형 진행·도넛 금지.

### sidebar — 작업 서랍

1-3 스니펫 그대로.

### skeleton — 망점 판 대기

```html
<div class="skel-group" aria-busy="true" aria-label="작업 일지 불러오는 중"><span class="skel skel--title"></span><span class="skel skel--line"></span><span class="skel skel--short"></span></div>
```
`--block`(120) `--poster`(A3 비율) `--circle`.

### spinner — 드럼 회전

`<span class="spinner" role="status" aria-label="마스터 만드는 중"></span>` · `.spinner--lg`(40) · 글과 함께 `<span class="spinner-row"><span class="spinner" aria-hidden="true"></span>마스터 만드는 중</span>`.

### steps — 판 진행 순서

```html
<ol class="steps">   <!-- .steps--vertical · .steps--keep(모바일에서도 가로 유지) · 720 미만 자동 세로 -->
  <li class="steps__item is-done"><span class="steps__mark" aria-hidden="true"></span><span class="steps__label">마스터</span><span class="steps__meta"><span class="mono">10:40</span></span></li>
  <li class="steps__item is-done"><span class="steps__mark" aria-hidden="true"></span><span class="steps__label">1도 · 옐로판</span></li>
  <li class="steps__item is-current" aria-current="step"><span class="steps__mark" aria-hidden="true"></span><span class="steps__label">2도 · 핑크판</span></li>
  <li class="steps__item"><span class="steps__mark" aria-hidden="true"></span><span class="steps__label">건조</span></li>
  <li class="steps__item"><span class="steps__mark" aria-hidden="true"></span><span class="steps__label">재단·제본</span></li>
</ol>
```
완료 = 두 판 겹친 원(✓) · 현재 = 핑크 원 · 예정 = 망점 원 · `.is-error` 레드. 온보딩은 `a.steps__item`(돌아가기 링크).

### table — 작업 일지

```html
<div class="table-wrap">
  <table class="table table--cards" data-selectable>
    <caption>작업 일지 · <span class="mono">10.22</span>(목) <span class="mono">15:10</span></caption>
    <thead><tr>
      <th scope="col"><button class="table__sort" type="button">주문 번호</button></th>
      <th scope="col">작업</th><th scope="col">손님</th><th scope="col">규격 · 잉크</th>
      <th scope="col" class="num"><button class="table__sort" type="button">수량</button></th>
      <th scope="col">상태</th><th scope="col">납기</th>
    </tr></thead>
    <tbody>
      <tr class="is-selected">
        <td class="id" data-label="주문 번호">GP-2610-038</td>
        <td class="strong" data-label="작업">「뒷골목 진 제12호」</td>
        <td data-label="손님">이하람</td>
        <td data-label="규격·잉크"><span class="inkchip" aria-hidden="true"><i class="ink-p"></i><i class="ink-b"></i></span>A5 중철 20쪽 · P+B 2도</td>
        <td class="num" data-label="수량" data-sort="150">150부</td>
        <td data-label="상태"><span class="badge badge--sm ink-p">인쇄 중 · 1호기</span></td>
        <td data-label="납기"><span class="mono">10.24</span>(토)</td>
      </tr>
    </tbody>
  </table>
</div>
```
- `.table--cards` = 720 미만에서 카드 행(첫 칸 ID · 둘째 칸 작업명이 머리, 나머지는 `data-label`). **가로 스크롤 금지.**
- 정렬은 `th > button.table__sort`(app.js, `aria-sort`), 숫자 정렬값은 `data-sort`. 행 선택 `data-selectable` → `.is-selected`. 상태 `tr.is-muted` · `tr[data-state="error"]`. 빈 결과 `<tr class="table__empty"><td colspan="7">…</td></tr>`.

### tabs — 색인 탭

```html
<div class="tabs">
  <div class="tabs__list" role="tablist" aria-label="작업실 설정">
    <button class="tabs__tab" type="button" role="tab" aria-selected="true" aria-controls="tp-drum">드럼·잉크</button>
    <button class="tabs__tab" type="button" role="tab" aria-selected="false" aria-controls="tp-paper">종이</button>
    <button class="tabs__tab" type="button" role="tab" aria-selected="false" aria-controls="tp-hours">영업시간</button>
    <button class="tabs__tab" type="button" role="tab" aria-selected="false" aria-controls="tp-alert">알림 <span class="count">2</span></button>
    <button class="tabs__tab tabs__tab--danger" type="button" role="tab" aria-selected="false" aria-controls="tp-danger">위험</button>
  </div>
  <div class="tabs__panel" id="tp-drum">…</div>
  <div class="tabs__panel" id="tp-paper" hidden>…</div>
</div>
```
선택 = 핑크×블루 겹침 면 + 종이 글자. ←/→ Home End. 넘치면 오른쪽 페이드(app.js `.has-more-end`). 비활성 `aria-disabled="true"`.

### timeline — 판 기록

```html
<ol class="timeline">
  <li class="timeline__item"><span class="timeline__time">13:20</span><span class="timeline__mark"><span class="inkchip" aria-hidden="true"><i class="ink-y"></i></span></span><div class="timeline__body"><p class="timeline__title">옐로판 300/300 완료</p><p class="timeline__text"><span class="mono">RUN-1022-02</span> · 2호기</p></div></li>
  <li class="timeline__item is-now"><span class="timeline__time">15:10</span><span class="timeline__mark"><span class="inkchip" aria-hidden="true"><i class="ink-p"></i></span></span><div class="timeline__body"><p class="timeline__title">핑크판 184/300</p><p class="timeline__text"><span class="mono">RUN-1022-03</span></p></div></li>
  <li class="timeline__item is-later"><span class="timeline__time">15:40</span><span class="timeline__mark"><span class="inkchip" aria-hidden="true"><i class="ink-b"></i></span></span><div class="timeline__body"><p class="timeline__title">1호기 드럼 교체(핑크→옐로)</p></div></li>
</ol>
```
`.is-now` 핑크 원 겹침 + 「지금」 스티커 · `.is-later` 망점 칩 · `data-state="error"`.

### toast — 배지기 트레이 쪽지

JS: `gyeop.toast({ title: '출고 완료', text: 'GP-2610-031 포스터 80장', tone: 'success' })` (tone: info · success · warn · danger, `ms: 0` 이면 안 사라짐). 마크업 훅: `<button data-toast="제목" data-toast-text="본문" data-toast-tone="success">`.
정적 견본:
```html
<div class="toast toast--success toast--static" role="status">
  <div class="toast__body"><p class="toast__title"><span data-icon="success"></span>견적을 보냈어요</p><p class="toast__text"><span class="mono">GP-2610-043</span> · 서지안 · <span class="mono">₩388,000</span></p></div>
  <button class="btn btn--ghost btn--icon toast__close" type="button" aria-label="쪽지 닫기"><span data-icon="close"></span></button>
</div>
```

### tooltip — 스티커 라벨

`<button class="btn btn--ghost btn--icon" type="button" data-tip="핑크×블루 겹침 #321871" aria-label="겹침색 보기"><span data-icon="info"></span></button>` — hover·focus 로 뜨고 Esc 로 닫힘. 숫자·hex 는 자동으로 모노. 정적 견본 `<span class="tooltip tooltip--static">핑크×블루 <span class="mono">#321871</span></span>`.

---

## 4. app.js 훅 요약

| 훅 | 동작 |
|---|---|
| `[data-theme-toggle]` | 낮/밤 교정 전환 + localStorage. `aria-pressed`·`aria-label` 자동(`data-keep-label` 이면 라벨 유지) |
| `[data-open="id"]` / `[data-close]` | 모달·드로어·커맨드 열고 닫기(포커스 트랩, Esc, 포커스 복귀, 스크롤 잠금) |
| `[data-offcanvas="id"]` | 메뉴 판(`#site-nav`)·작업 서랍(`#work-drawer`) 열고 닫기 + 먹 망점 가림막 |
| `[data-command-open]`, ⌘K/Ctrl+K | 조판 지시 창 |
| `.menu__trigger[aria-controls]` · `[data-popover-trigger][aria-controls]` | 메뉴·팝오버 |
| `[data-tip]` | 툴팁 |
| `[data-toast]` `[data-toast-text]` `[data-toast-tone]` | 토스트 |
| `[role="tablist"]` · `.accordion__trigger` · `[data-carousel]` · `[data-marquee]` · `[data-calendar]` · `[data-kanban]` · `[data-pager]` | 각 부품 |
| `.table__sort` · `table[data-selectable]` | 표 정렬·행 선택 |
| `aria-valuenow`(.meter/.drum) · `data-v` `data-n` `data-plan` `data-real` · `.range__input` | 값 → CSS 변수 |
| `[data-print]` · `[data-print-list]` · `[data-replay]` | 리빌·다시 찍기 |
| `[data-plate-toggle][data-target]` · `[data-register]` | 포스터 분판 보기·정합 |
| `[data-busy="ms"]` · `[data-copy]` · `[data-dismiss]` | 로딩 시연·복사·쪽지 닫기 |
| `form[data-validate]` · `fieldset[data-max]` · `.dropzone` | 전표 검사·드럼 개수 제한·파일 |
| `.scroll-x` · `.tabs__list` · `.kanban` | 가로 넘침 페이드 힌트 |
| 이벤트 | `gyeop:theme` `gyeop:open` `gyeop:close` `gyeop:tab` `gyeop:move` `gyeop:page` `gyeop:drums` |
| 전역 | `window.gyeop.toast()` `.setTheme('dark')` `.open(id)` `.close(id)` `.icons(scope)` `.values(scope)` |

---

## 5. 장면 에이전트가 지킬 것

1. 한 화면(장) 잉크는 **2도 + 먹**, 최대 3도. 장마다 건 드럼을 폴리오에 적는다(P.02–03 잉크 장만 6색 예외).
2. 중간 톤은 망점(`.dots--*`)만. 투명도·그라디언트로 톤 내지 않는다. 흐릿한 radial 얼룩·블러·글로우 금지.
3. 그림자·둥근 카드·검정 굵은 테두리 금지. 테두리는 2번 판 키라인(블루 2px) 또는 잉크 면 가장자리.
4. 형광 위 글자 = 먹, 블루·겹침 위 = 종이색. 본문·표 숫자·입력값은 어긋나지 않는다.
5. 한글 라벨에 모노·넓은 자간 금지(`.label`). 요일은 모노 밖.
6. 기울인 요소는 뷰포트당 2개까지. 표·폼·본문은 기울이지 않는다.
7. 장면 CSS 에서 raw hex 금지, semantic 토큰만. SVG presentation attribute 에 `var()` 금지(`style="fill:var(--ink-pink)"` 또는 `currentColor`).
8. 다크(23:10 야간 작업)도 같은 데이터. 핑크는 핑크로 남는다. 포스터 아트는 밤에도 종이 위 인쇄물.
