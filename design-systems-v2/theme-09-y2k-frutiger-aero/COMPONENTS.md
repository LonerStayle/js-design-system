# COMPONENTS — 소다넷 sodanet v2 마크업 계약

index.html과 pages/*.html 담당 에이전트는 **이 문서만 보고** 마크업한다. 디자인 근거와 세계관 수치는 `DIRECTION.md`(특히 `## 팩트 시트`)에 있다. 화면에 나오는 날짜, 시각, 금액, 이름, ID는 팩트 시트 값만 쓴다.

- 클래스는 BEM(`블록__요소--변형`)을 쓴다. 상태는 ARIA 속성(`aria-current`, `aria-selected`, `aria-expanded`, `aria-pressed`, `aria-busy`, `aria-invalid`, `disabled`, `hidden`)으로 표시하고, CSS가 그 속성을 읽는다.
- 시그니처는 두 개다. **젤리 `.gel`**은 누를 수 있거나 진행을 보여 주는 모든 것에 쓰고, **구슬 `.orb`**는 아이콘, 아바타, 순번, 데이터 점에 쓴다. 이 두 가지 말고 다른 장식(반짝이, 크롬 글자, 무지개)은 만들지 않는다.
- 반경은 다섯 단계만 쓴다. 스킨 프레임 20, 박스 12, 입력·창 10, 탭 14/0, 알약 999, 구슬 50%. 장면 CSS에서 새 반경 값을 만들지 않는다.
- 장면 CSS(`index.css`, `pages/<name>.css`)도 **semantic 토큰만** 쓴다(2절). raw hex와 인라인 `grid-template-columns`는 금지다. 대신 `style="--val:72%"`처럼 커스텀 속성을 주입하는 것은 허용한다.
- 아이콘은 인라인 SVG로 넣는다: `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="…"/></svg>`. 선 색은 CSS가 `currentColor`로 준다. **SVG presentation attribute에 `var()`를 쓰면 안 된다.** 색을 지정해야 하면 `style="stroke:var(--link)"`를 쓴다. 이모지 아이콘은 금지다.
- 넓은 자간(`.caps`)은 라틴 대문자 라벨(`TODAY`, `TOTAL`, `NOW PLAYING`, `BGM`)에만 쓴다. 한글 라벨은 자간 0이다.
- `href="#"`과 인라인 `onclick`은 금지다. 모든 링크는 실제 파일로 연결한다.

---

## 0. 페이지 뼈대 (모든 HTML 공통)

```html
<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>소다넷 — 내 홈피 관리</title>
<script>(function(){try{var q=new URLSearchParams(location.search).get('theme');var s=localStorage.getItem('sodanet-theme');var t=(q==='dark'||q==='light')?q:(s==='dark'||s==='light')?s:(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.setAttribute('data-theme',t);}catch(e){}})();</script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=DotGothic16&family=Jua&family=Nanum+Gothic:wght@400;700;800&family=Nanum+Gothic+Coding:wght@400;700&family=Nunito+Sans:wght@400;600;700;800&family=Varela+Round&display=swap">
<link rel="stylesheet" href="styles.css">        <!-- pages: ../styles.css -->
<link rel="stylesheet" href="index.css">         <!-- pages: <name>.css (장면 전용 1개) -->
</head>
<body>
<a class="skip" href="#main">본문으로 건너뛰기</a>
<div class="desktop" aria-hidden="true"><div class="desktop__day"></div><div class="desktop__night"></div><div class="bubbles"></div></div>
<header class="topbar">…</header>          <!-- 1-1 셸 스니펫 그대로 -->
<div class="skin">
  <main id="main">…</main>
  <footer class="portal-foot">…</footer>     <!-- 1-4 셸 스니펫 그대로 (스킨의 마지막 자식) -->
</div>
<!-- 오버레이(모달·드로어)는 body 끝. 커맨드 팔레트·토스트 스택은 app.js가 만든다 -->
<script src="app.js"></script>              <!-- pages: ../app.js -->
</body>
</html>
```

- `localStorage` 키는 `sodanet-theme`이다. 우선순위는 `?theme=dark|light`, localStorage, 시스템 설정 순이다.
- `.desktop`은 고정 바탕화면이다. 낮 장면(하늘에서 초원 언덕까지)과 밤 장면(별이 뜬 밤 물가)을 겹쳐 두고 opacity를 교차시킨다. 물방울 `.bubble`은 app.js가 채운다(데스크톱 12개, 760px 미만 6개).
- 테마 이름은 "낮 스킨"(14:20)과 "밤 스킨"(23:40)이다. 다크 모드를 반전색으로 만들지 않는다. 브랜드 하늘색은 밤에도 하늘색으로 유지한다.

---

## 1. 셸 스니펫 (복사해서 쓴다 — 고치지 말 것)

경로 규칙: **index.html은 `pages/…`, pages/*.html은 `../index.html`과 같은 폴더 이름(`dashboard.html`)**으로 적는다. 아래에 두 벌을 모두 적어 두었다.

### 1-1. navbar — 로고 바 + 매달린 아쿠아 탭

탭에 붙이는 `aria-current="page"` 규칙은 이렇다. index는 **홈**, profile·dashboard·settings·onboarding은 **미니홈**, inbox는 **쪽지**, product·pricing은 **스킨샵**, kanban은 **크리에이터**에 붙인다. 404에는 아무 탭에도 붙이지 않는다. BGM 탭은 `dashboard.html#bgm`(대시보드의 "BGM 재생 순위" 박스, `id="bgm"`)으로 간다.
`topbar__menu`(내 박스 열기, ☰) 버튼은 **모든 페이지에 고정**이다. 지우지 않는다(390에서 로고 위치가 페이지마다 튀지 않게). 왼쪽 내 박스 열이 없는 페이지(inbox·kanban·onboarding·product·profile·404)는 `</header>` 바로 뒤에 1-2절의 **드로어 판**(`.sidebar.sidebar--drawer#mybox`)을 둔다. 데스크톱에서는 숨고 760px 미만에서 ☰ 로 열린다.
탭 줄(`.fade-x`)은 활성 탭으로 자동 스크롤된다. 오른쪽뿐 아니라 왼쪽에도 잘린 탭이 있으면(`scrollLeft > 0`) app.js가 `.is-scrolled`를 붙여 왼쪽 32px 하늘 페이드를 띄운다.

**index.html 판**
```html
<header class="topbar">
  <div class="topbar__bar">
    <button class="topbar__menu orb orb--white orb-btn" type="button" data-sidebar-open aria-controls="mybox" aria-expanded="false" aria-label="내 박스 열기"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 7h14M5 12h14M5 17h14"/></svg></button>
    <a class="logo" href="index.html" aria-label="소다넷 첫 화면"><span class="logo__mark" aria-hidden="true">s<span class="logo__o"></span>danet</span></a>
    <button class="searchpill" type="button" data-command-open aria-label="소다넷 통합검색 열기">
      <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/></svg>
      <span class="searchpill__text">홈피 주소, BGM, 스킨 검색</span><kbd>⌘K</kbd><span class="searchpill__go gel" aria-hidden="true">검색</span>
    </button>
    <div class="topbar__tools">
      <a class="orb orb--white orb-btn" href="pages/inbox.html" aria-label="새 쪽지 3통"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="5.5" width="17" height="13" rx="2.5"/><path d="M4 7l8 6 8-6"/></svg><span class="orb__count" aria-hidden="true">3</span></a>
      <a class="coin" href="pages/pricing.html" aria-label="방울 340방울, 충전하기"><span class="orb orb--amber orb--s" aria-hidden="true"></span><b>340</b><span>방울</span></a>
      <button class="orb orb--white orb-btn themebtn" type="button" data-theme-toggle aria-pressed="false" aria-label="밤 스킨으로 바꾸기">
        <svg class="icon themebtn__sun" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.2M12 19.3v2.2M4.6 4.6l1.6 1.6M17.8 17.8l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.6 19.4l1.6-1.6M17.8 6.2l1.6-1.6"/></svg>
        <svg class="icon themebtn__moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M19.5 14.5A8 8 0 0 1 9.5 4.5a8 8 0 1 0 10 10z"/></svg>
      </button>
    </div>
  </div>
  <nav class="tabbar" aria-label="소다넷 메뉴">
    <div class="fade-x"><ul class="tabbar__list fade-x__scroll">
      <li><a class="tabbar__tab gel gel--mist" href="index.html" aria-current="page"><span class="orb orb--sky" aria-hidden="true"><svg class="icon" viewBox="0 0 24 24"><path d="M4 11l8-6.5 8 6.5"/><path d="M6.5 9.5V19h11V9.5"/></svg></span>홈</a></li>
      <li><a class="tabbar__tab gel gel--mist" href="pages/profile.html"><span class="orb orb--lime" aria-hidden="true"><svg class="icon" viewBox="0 0 24 24"><circle cx="12" cy="9" r="3.5"/><path d="M5 19.5c1.2-3.5 4-5 7-5s5.8 1.5 7 5"/></svg></span>미니홈</a></li>
      <li><a class="tabbar__tab gel gel--mist" href="pages/dashboard.html#bgm"><span class="orb orb--amber" aria-hidden="true"><svg class="icon" viewBox="0 0 24 24"><path d="M9 18V6l10-2v12"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="16.5" cy="16" r="2.5"/></svg></span>BGM</a></li>
      <li><a class="tabbar__tab gel gel--mist" href="pages/inbox.html"><span class="orb orb--red" aria-hidden="true"><svg class="icon" viewBox="0 0 24 24"><rect x="3.5" y="5.5" width="17" height="13" rx="2.5"/><path d="M4 7l8 6 8-6"/></svg></span>쪽지</a></li>
      <li><a class="tabbar__tab gel gel--mist" href="pages/product.html"><span class="orb orb--aqua" aria-hidden="true"><svg class="icon" viewBox="0 0 24 24"><rect x="3.5" y="5" width="17" height="14" rx="2.5"/><path d="M3.5 15l5-4 4 3 3-2 5 4"/></svg></span>스킨샵</a></li>
      <li><a class="tabbar__tab gel gel--mist" href="pages/kanban.html"><span class="orb orb--white" aria-hidden="true"><svg class="icon" viewBox="0 0 24 24"><path d="M14.5 4.5l5 5L9 20H4v-5z"/></svg></span>크리에이터</a></li>
    </ul></div>
  </nav>
</header>
```

**pages/*.html 판** (다른 점은 경로뿐이다. `aria-current`는 위 규칙에 따라 옮긴다)
```html
<header class="topbar">
  <div class="topbar__bar">
    <button class="topbar__menu orb orb--white orb-btn" type="button" data-sidebar-open aria-controls="mybox" aria-expanded="false" aria-label="내 박스 열기"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 7h14M5 12h14M5 17h14"/></svg></button>
    <a class="logo" href="../index.html" aria-label="소다넷 첫 화면"><span class="logo__mark" aria-hidden="true">s<span class="logo__o"></span>danet</span></a>
    <button class="searchpill" type="button" data-command-open aria-label="소다넷 통합검색 열기">
      <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/></svg>
      <span class="searchpill__text">홈피 주소, BGM, 스킨 검색</span><kbd>⌘K</kbd><span class="searchpill__go gel" aria-hidden="true">검색</span>
    </button>
    <div class="topbar__tools">
      <a class="orb orb--white orb-btn" href="inbox.html" aria-label="새 쪽지 3통"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="5.5" width="17" height="13" rx="2.5"/><path d="M4 7l8 6 8-6"/></svg><span class="orb__count" aria-hidden="true">3</span></a>
      <a class="coin" href="pricing.html" aria-label="방울 340방울, 충전하기"><span class="orb orb--amber orb--s" aria-hidden="true"></span><b>340</b><span>방울</span></a>
      <button class="orb orb--white orb-btn themebtn" type="button" data-theme-toggle aria-pressed="false" aria-label="밤 스킨으로 바꾸기">
        <svg class="icon themebtn__sun" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.2M12 19.3v2.2M4.6 4.6l1.6 1.6M17.8 17.8l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.6 19.4l1.6-1.6M17.8 6.2l1.6-1.6"/></svg>
        <svg class="icon themebtn__moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M19.5 14.5A8 8 0 0 1 9.5 4.5a8 8 0 1 0 10 10z"/></svg>
      </button>
    </div>
  </div>
  <nav class="tabbar" aria-label="소다넷 메뉴">
    <div class="fade-x"><ul class="tabbar__list fade-x__scroll">
      <li><a class="tabbar__tab gel gel--mist" href="../index.html"><span class="orb orb--sky" aria-hidden="true"><svg class="icon" viewBox="0 0 24 24"><path d="M4 11l8-6.5 8 6.5"/><path d="M6.5 9.5V19h11V9.5"/></svg></span>홈</a></li>
      <li><a class="tabbar__tab gel gel--mist" href="profile.html"><span class="orb orb--lime" aria-hidden="true"><svg class="icon" viewBox="0 0 24 24"><circle cx="12" cy="9" r="3.5"/><path d="M5 19.5c1.2-3.5 4-5 7-5s5.8 1.5 7 5"/></svg></span>미니홈</a></li>
      <li><a class="tabbar__tab gel gel--mist" href="dashboard.html#bgm"><span class="orb orb--amber" aria-hidden="true"><svg class="icon" viewBox="0 0 24 24"><path d="M9 18V6l10-2v12"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="16.5" cy="16" r="2.5"/></svg></span>BGM</a></li>
      <li><a class="tabbar__tab gel gel--mist" href="inbox.html"><span class="orb orb--red" aria-hidden="true"><svg class="icon" viewBox="0 0 24 24"><rect x="3.5" y="5.5" width="17" height="13" rx="2.5"/><path d="M4 7l8 6 8-6"/></svg></span>쪽지</a></li>
      <li><a class="tabbar__tab gel gel--mist" href="product.html"><span class="orb orb--aqua" aria-hidden="true"><svg class="icon" viewBox="0 0 24 24"><rect x="3.5" y="5" width="17" height="14" rx="2.5"/><path d="M3.5 15l5-4 4 3 3-2 5 4"/></svg></span>스킨샵</a></li>
      <li><a class="tabbar__tab gel gel--mist" href="kanban.html"><span class="orb orb--white" aria-hidden="true"><svg class="icon" viewBox="0 0 24 24"><path d="M14.5 4.5l5 5L9 20H4v-5z"/></svg></span>크리에이터</a></li>
    </ul></div>
  </nav>
</header>
```

- 로고 바(72px)의 반투명 블러는 **이 바 하나에만** 쓴다. 다른 곳에 `backdrop-filter`를 쓰지 않는다.
- 760px 미만에서는 검색 알약이 44px 구슬로 접히고, 480px 미만에서는 방울 칩이 사라진다(방울은 내 박스에서 볼 수 있다). 탭 줄은 가로로 스크롤되고 오른쪽 페이드 힌트가 나온다. 현재 탭은 app.js가 보이는 위치로 스크롤해 준다.

### 1-2. sidebar — 내 박스 열(232px)

포털 3단의 왼쪽 칸에 넣는다. `id="mybox"`는 고정이고, 760px 미만에서는 왼쪽에서 나오는 드로어가 된다(`topbar__menu`로 연다). `navbox__item`의 `aria-current="page"`는 현재 페이지에 옮겨 붙인다. 아래는 **pages 판**이고, index 판은 각 `href` 앞에 `pages/`를 붙인다.

- **박스 순서 고정**: 내 정보 → 바로가기 → 오늘의 기분(`.box.mood`) → (선택) 지금 입은 스킨(`.box.wearbox`). 오늘의 기분까지는 포털 왼쪽 열이 있는 모든 페이지(index·dashboard·pricing·settings)에 넣는다. 지금 입은 스킨은 본문에 같은 박스·항목이 없는 페이지(index·pricing)에만 넣는다(dashboard는 본문에 '지금 입은 스킨' 박스, settings는 폼에 같은 그룹이 있다).
- **1100px 이상에서 왼쪽 열은 `position: sticky; top: 16px; align-self: start`** (페이지 CSS에 한 줄) — 가운데 열이 길어도 왼쪽에 1000px짜리 빈 띠가 생기지 않게 스크롤을 따라온다.
- **드로어 판**: 왼쪽 열이 없는 페이지는 `<aside class="sidebar sidebar--drawer" id="mybox" aria-label="내 박스">`로 바꾸고 내 정보 + 바로가기 두 박스만 넣는다(`portal__left` 클래스 없음).

```html
<aside class="portal__left sidebar" id="mybox" aria-label="내 박스">
  <div class="sidebar__close"><span>내 박스</span><button class="orb orb--white orb-btn" type="button" data-close aria-label="내 박스 닫기"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>
  <section class="box userbox" aria-labelledby="ub-t">
    <div class="box__head"><h2 class="box__tab gel" id="ub-t">내 정보</h2><a class="box__more" href="settings.html">설정 ›</a></div>
    <div class="box__body">
      <div class="userbox__who"><span class="orb orb--lime orb--l" aria-hidden="true">여</span><div><p class="userbox__name">여름물빛<small> 님</small></p><p class="userbox__id">yeoreum · 소다 플러스</p></div></div>
      <div class="counter lcd" role="group" aria-label="방문자 오늘 128명, 전체 48,215명, 14시 20분 기준">
        <span class="counter__label">TODAY</span><b class="counter__value">128</b>
        <span class="counter__label">TOTAL</span><b class="counter__value">48,215</b>
        <span class="counter__note">10.10(토) 14:20 기준</span>
      </div>
      <div class="userbox__stats">
        <a class="userbox__stat userbox__stat--amber" href="pricing.html"><span class="orb orb--amber orb--s" aria-hidden="true"></span>방울<b>340</b></a>
        <a class="userbox__stat" href="inbox.html"><span class="orb orb--red orb--s" aria-hidden="true"></span>새 쪽지<b>3</b></a>
      </div>
      <div class="userbox__actions"><a class="btn gel btn--s btn--block" href="profile.html">내 미니홈 가기</a></div>
    </div>
  </section>
  <nav class="box navbox" aria-labelledby="nb-t">
    <div class="box__head"><h2 class="box__tab gel" id="nb-t">바로가기</h2></div>
    <ul class="navbox__list">
      <li><a class="navbox__item" href="dashboard.html"><span class="orb orb--aqua" aria-hidden="true"><svg class="icon" viewBox="0 0 24 24"><path d="M4 19.5h16M7 16v-4M12 16V8M17 16v-6"/></svg></span><span class="navbox__label">내 홈피 관리</span><span class="navbox__count">128</span></a></li>
      <li><a class="navbox__item" href="profile.html"><span class="orb orb--sky" aria-hidden="true"><svg class="icon" viewBox="0 0 24 24"><path d="M4 11l8-6.5 8 6.5"/><path d="M6.5 9.5V19h11V9.5"/></svg></span><span class="navbox__label">미니홈</span><span class="navbox__count">2,031</span></a></li>
      <li><a class="navbox__item" href="inbox.html"><span class="orb orb--red" aria-hidden="true"><svg class="icon" viewBox="0 0 24 24"><rect x="3.5" y="5.5" width="17" height="13" rx="2.5"/><path d="M4 7l8 6 8-6"/></svg></span><span class="navbox__label">쪽지함</span><span class="navbox__count">3 / 214</span></a></li>
      <li><a class="navbox__item" href="kanban.html"><span class="orb orb--lime" aria-hidden="true"><svg class="icon" viewBox="0 0 24 24"><path d="M14.5 4.5l5 5L9 20H4v-5z"/></svg></span><span class="navbox__label">스킨 보드</span><span class="navbox__count">10</span></a></li>
      <li><a class="navbox__item" href="pricing.html"><span class="orb orb--amber" aria-hidden="true"><svg class="icon" viewBox="0 0 24 24"><path d="M12 4c3 4 5 6.5 5 9a5 5 0 0 1-10 0c0-2.5 2-5 5-9z"/></svg></span><span class="navbox__label">방울 충전</span><span class="navbox__count">340</span></a></li>
      <li><a class="navbox__item" href="onboarding.html"><span class="orb orb--sky" aria-hidden="true"><svg class="icon" viewBox="0 0 24 24"><path d="M4 11l8-6.5 8 6.5"/><path d="M6.5 9.5V19h11V9.5"/><path d="M12 11.5v5M9.5 14h5"/></svg></span><span class="navbox__label">홈피 개설 · 복구</span><span class="navbox__count">2/4</span></a></li>
      <li><a class="navbox__item" href="settings.html"><span class="orb orb--white" aria-hidden="true"><svg class="icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M12 3.5v2.5M12 18v2.5M3.5 12H6M18 12h2.5M6 6l1.8 1.8M16.2 16.2L18 18M6 18l1.8-1.8M16.2 7.8L18 6"/></svg></span><span class="navbox__label">홈피 설정</span><span class="navbox__count"></span></a></li>
    </ul>
  </nav>
  <section class="box mood" aria-labelledby="md-t">
    <div class="box__head"><h2 class="box__tab gel gel--lime" id="md-t">오늘의 기분</h2></div>
    <div class="box__body mood__body">
      <span class="mood__sky" aria-hidden="true"><span class="mood__sun"></span></span>
      <div><p class="mood__word">맑음</p><p class="t-cap">한글날 연휴 둘째 날 · 홈피 제목 「여름이 사는 물가」</p></div>
    </div>
  </section>
  <section class="box wearbox" aria-labelledby="wr-t">   <!-- 선택: index·pricing -->
    <div class="box__head"><h2 class="box__tab gel gel--white" id="wr-t">지금 입은 스킨</h2><a class="box__more" href="product.html">바꾸기 ›</a></div>
    <a class="wearbox__body" href="product.html"><span class="skinthumb skinthumb--dew" aria-hidden="true"></span><span class="wearbox__text"><b>아침이슬 2026</b><span>SK-2026-0412 · 공방장</span><small>19:00~07:00 밤 스킨 자동 전환 켬</small></span></a>
  </section>
</aside>
```

### 1-3. 소다플레이어 — 데스크톱 오른쪽 열, 760px 미만 하단 도킹

포털 3단을 쓰는 페이지는 `.portal__right`의 첫 자식으로 넣는다. 오른쪽 열이 없는 페이지(inbox, kanban, onboarding, pricing, settings, 404)는 `player--mini`를 붙여 `body` 끝에 둔다. `player--mini`는 **데스크톱에서도 화면 아래에 붙는 도킹 띠**다(스킨 프레임과 같은 폭, 높이 `--dock-h` 64px, 위쪽만 둥근 모서리). 순서는 이전·재생·다음 구슬 → LCD 한 줄(곡명 + DotGothic `01:27 / 03:42` + 이퀄라이저) → 볼륨. 떠 있는 알약은 쓰지 않는다(본문을 가린다). 모바일(760 미만)에서는 모든 `.player`가 같은 띠로 내려가고 LCD에는 곡명 + 시간만 남는다. 한 페이지에 플레이어는 하나만 둔다. app.js가 `body.has-dock`(모바일 아래 여백 88px)과 `body.has-mini-dock`(데스크톱 아래 여백 64+24px, 토스트 스택도 띠 위로)을 붙인다. profile의 책 안 BGM 줄(`.mh-bgm .player--mini`)만 예외로 데스크톱에서 제자리에 둔다.

곡명(`.player__title`)은 **기본이 왼쪽 정렬 정적 텍스트 + 말줄임**이다. LCD 칸보다 길 때만 app.js가 `.is-overflow`와 `--mq-dist`(넘친 폭)를 붙여 `translateX(0) → -(넘친 폭)`으로 천천히 왕복한다. 오른쪽 밖에서 흘러 들어오는 마키는 쓰지 않는다(빈 LCD에 글자 조각만 보이는 순간이 생긴다).

```html
<section class="player" data-player data-autoplay aria-label="소다플레이어">   <!-- 오른쪽 열이 없으면 class="player player--mini" -->
  <div class="player__bar gel gel--bar"><span>소다플레이어</span><span class="caps">BGM</span></div>
  <div class="player__body">
    <div class="player__screen lcd">
      <div class="player__row"><span class="caps">NOW PLAYING</span><span class="player__state">재생 중 · 반복</span></div>
      <div class="player__title"><span class="player__marquee" data-player-title>투명한 오후 — 물빛밴드</span></div>
      <div class="player__meta"><span class="player__time"><span data-player-now>01:27</span><span class="lcd__dim"> / <span data-player-len>03:42</span></span></span><span class="eq" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i></span></div>
      <div class="player__seek" aria-hidden="true"><span></span></div>
    </div>
    <div class="player__ctrls">
      <button class="orb orb--white orb-btn orb-btn--s" type="button" data-player-prev aria-label="이전 곡"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 6v12M18 6l-8 6 8 6z"/></svg></button>
      <button class="orb orb--sky orb-btn player__play" type="button" data-player-toggle aria-pressed="true" aria-label="일시정지"><svg class="icon icon--play" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5l11 6.5-11 6.5z"/></svg><svg class="icon icon--pause" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6v12M15 6v12"/></svg></button>
      <button class="orb orb--white orb-btn orb-btn--s" type="button" data-player-next aria-label="다음 곡"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M17 6v12M6 6l8 6-8 6z"/></svg></button>
      <label class="player__vol"><svg class="icon icon--s" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9.5h3.5L12 6v12l-4.5-3.5H4z"/><path d="M15.5 9a4 4 0 0 1 0 6"/></svg><span class="sr-only">볼륨</span><input class="range" type="range" min="0" max="100" value="70" data-player-volume></label>
    </div>
  </div>
  <ol class="player__list" aria-label="재생목록">
    <li><button class="player__track" type="button" aria-current="true" data-title="투명한 오후" data-artist="물빛밴드" data-len="3:42"><span class="orb orb--amber" aria-hidden="true">1</span><span class="player__track-name">투명한 오후<small>물빛밴드</small></span><span class="player__track-len">3:42</span></button></li>
    <li><button class="player__track" type="button" data-title="버블 레터" data-artist="하이틴소다" data-len="3:18"><span class="orb orb--sky" aria-hidden="true">2</span><span class="player__track-name">버블 레터<small>하이틴소다</small></span><span class="player__track-len">3:18</span></button></li>
    <li><button class="player__track" type="button" data-title="초록 언덕" data-artist="윈디힐즈" data-len="4:05"><span class="orb orb--lime" aria-hidden="true">3</span><span class="player__track-name">초록 언덕<small>윈디힐즈</small></span><span class="player__track-len">4:05</span></button></li>
    <li><button class="player__track" type="button" data-title="수평선 라디오" data-artist="블루세이브" data-len="3:51"><span class="orb orb--slate" aria-hidden="true">4</span><span class="player__track-name">수평선 라디오<small>블루세이브</small></span><span class="player__track-len">3:51</span></button></li>
    <li><button class="player__track" type="button" data-title="여름이 남긴 쪽지" data-artist="해랑" data-len="4:27"><span class="orb orb--slate" aria-hidden="true">5</span><span class="player__track-name">여름이 남긴 쪽지<small>해랑</small></span><span class="player__track-len">4:27</span></button></li>
  </ol>
</section>
```

- `data-autoplay`가 있으면 load 시 '재생 중' 모습(일시정지 아이콘, 이퀄라이저)으로 열리지만, **시계는 사용자가 처음 화면을 누르거나 키를 칠 때까지 팩트 시트 값 01:27에 멈춰 있다**(브라우저 자동 재생 정책 고증). 움직임 줄이기가 켜져 있으면 일시정지 상태로 시작한다.

### 1-4. 포털 푸터 — 1종 고정, `.skin`의 마지막 자식

**index 판**
```html
<footer class="portal-foot">
  <ul class="portal-foot__links"><li><a href="index.html">회사소개</a></li><li><a href="pages/404.html">이용약관</a></li><li><strong><a href="pages/404.html">개인정보처리방침</a></strong></li><li><a href="pages/404.html">청소년보호정책</a></li><li><a href="pages/settings.html">고객센터</a></li></ul>
  <p>(주)소다넷 · 대표 강물결 · 서울특별시 마포구 월드컵북로58길 9, 소다빌딩 7층 · 사업자등록번호 <span class="nowrap">118-86-20031</span> · 고객센터 <span class="nowrap">1670-0715</span></p>
  <p class="portal-foot__copy">Copyright © SODANET Corp. All rights reserved.</p>
</footer>
```
**pages 판**
```html
<footer class="portal-foot">
  <ul class="portal-foot__links"><li><a href="../index.html">회사소개</a></li><li><a href="404.html">이용약관</a></li><li><strong><a href="404.html">개인정보처리방침</a></strong></li><li><a href="404.html">청소년보호정책</a></li><li><a href="settings.html">고객센터</a></li></ul>
  <p>(주)소다넷 · 대표 강물결 · 서울특별시 마포구 월드컵북로58길 9, 소다빌딩 7층 · 사업자등록번호 <span class="nowrap">118-86-20031</span> · 고객센터 <span class="nowrap">1670-0715</span></p>
  <p class="portal-foot__copy">Copyright © SODANET Corp. All rights reserved.</p>
</footer>
```
(약관류 문서는 이 테마에 없다. 그래서 링크는 404 장면("주소가 바뀌었거나 2011년에 문을 닫은 홈피일 수 있어요")으로 보낸다.)

### 1-5. 공지 marquee — 탭 바로 아래, `main`의 첫 자식 (index와 앱 페이지 공통)

```html
<div class="marquee" data-marquee>
  <span class="marquee__label gel gel--amber">공지</span>
  <div class="marquee__viewport"><div class="marquee__track">
    <span class="marquee__item"><b>[공지]</b> 10월 13일(화) 02:00~05:00 서버 점검</span>
    <span class="marquee__item"><b>[이벤트]</b> 가을 스킨 페스타 10.31(토)까지 전 품목 20%</span>
    <span class="marquee__item"><b>[BGM]</b> 투명한 오후 7일째 1위</span>
  </div></div>
  <button class="marquee__pause orb orb--white orb-btn" type="button" data-marquee-pause aria-pressed="false" aria-label="공지 흐름 멈추기"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6v12M15 6v12"/></svg></button>
</div>
```

---

## 2. 레이아웃 문법 (base.css)

| 클래스 | 쓰임 |
|---|---|
| `.skin` | 고정폭 스킨 프레임(최대 1200). 위 6px 하늘 젤리 레일 아래로 매달린 활성 탭이 이어진다. `main`과 `footer`를 감싼다. |
| `.portal` > `.portal__left` / `.portal__main` / `.portal__right` | 포털 3단 `232 \| 1fr \| 300`. 1099px 이하에서는 `1fr \| 300` 2단이 되고 왼쪽 열은 위쪽 가로 띠로 바뀐다. 760px 미만에서는 1단이 된다. |
| `.portal--2` | 왼쪽 + 본문 2단(오른쪽 열 없음, 플레이어는 `player--mini`). |
| `.portal--wide` | 본문 + 오른쪽 2단(왼쪽 열 없음). |
| `.grid12` + `.span-3/4/5/6/7/8/9/12` | 12단 모자이크. **한 행의 스팬 합은 12**가 되게 맞춘다. 칸 높이가 어긋나 빈 칸이 생기지 않도록 짝지을 것(브리프 7-8). 필요하면 `.grid12--stretch`를 붙인다. 1099px 이하에서는 3·4·5가 6으로, 7·8·9가 12로 바뀌고, 760px 미만에서는 모두 전폭이다. |
| `.cols-2`, `.cols-3` | 균등 분할. 박스 안의 작은 묶음에만 쓴다. |
| `.stack` (`--s` 8 / `--m` 12 / 기본 16 / `--l` 24), `.cluster`, `.spread` | 세로·가로 묶음. |
| `.scene` (위아래 96px, 모바일 64px), `.scene--tight` (48px) | **넓은 구간.** 하늘이 보이는 빈 공간이다. 촘촘한 포털 구간과 번갈아 둔다. |
| `.scene__title`, `.scene__lede` | 바탕화면(하늘) 위에 바로 놓이는 글자. 흰 글자에 하늘 그림자를 준다. |
| `.fade-x` > `.fade-x__scroll` | 가로 스크롤과 오른쪽 32px 페이드 힌트. 끝에 닿으면 힌트가 사라진다. |
| `.window` > `.window__bar.gel.gel--bar` (+ `.window__title`, `.window__ctrls` > `.winbtn--min/max/close`) + `.window__body` + `.window__foot` | **Aero 창.** 모달, 드로어, 토스트, 코드, 바탕화면 구간 견본이 모두 이 창을 쓴다. 창 컨트롤 구슬은 지름 16이고 터치 영역은 44다. |
| `.lcd` (+ `.lcd__dim`) | 어두운 LCD 창(라이트 모드에서도 어둡다). 카운터와 플레이어에 쓴다. |

**바탕화면 구간(full-bleed)**: `.skin` 밖으로 나와 하늘·언덕 위에 창 몇 개를 겹쳐 띄우는 구간이다. 페이지당 최대 1곳만 둔다. 마크업은 `</div><!-- .skin 끝 --> <section class="scene">…</section> <div class="skin">…`처럼 스킨을 끊고 다시 여는 방식이 아니라, **`.skin` 앞이나 뒤에 형제로 `section.scene`을 둔다.** 장면 CSS에서 창 위치(겹침 40~80px)를 정한다. 이때 index.css나 pages/*.css에서는 semantic 토큰과 `.window`만 쓴다.

**활자 유틸**: `.t-hero`(Jua 64→40) `.t-h1`(44→30) `.t-h2`(30→24) `.t-h3`(22→20) `.t-box`(17) `.t-portal`(14→15) `.t-cap`(12.5→13, 약한 색) `.t-lcd`(DotGothic16 숫자) `.t-mono` `.t-num`(tabular) `.t-muted` `.caps`(라틴 대문자 라벨 전용) `.t-amber/.t-success/.t-danger/.t-aqua`(상태 글자색).
**DotGothic16(`.t-lcd`, `.counter__value`, `.player__time`)은 숫자와 라틴에만 쓴다.** 한글을 넣지 않는다.

### 시그니처 A — 젤리 `.gel`

`<button class="btn gel gel--lime">`처럼 쓴다. `.gel`은 기본이 하늘색이고, 색 변형은 `--sky --lime --amber --red --aqua --white --mist --slate --bar`다. `a`, `button`, `label`, `summary`에 붙이면 자동으로 누름 동작(호버 2px 떠오름, 누름 스쿼시, 스프링 복원)이 생긴다. 다른 요소에 누름 동작을 주려면 `.gel--press`를 붙인다. 캡 모양을 바꾸려면 `--cap-r`, `--cap-rb`, `--cap-h`를 지정한다(사각형 부품은 `--cap-r:10px; --cap-rb:3px`).

**가독성 규칙(흰 글자 젤리)**: 캡은 높이 42%, 위 .85 → 아래 .15 → 가장자리 투명으로 페이드한다. 흰 글자를 얹는 젤리(sky·red·bar, 창 타이틀바, 박스 탭)는 라이트에서 캡 세기를 낮춘다 — sky·red는 `--gloss-cap-o-ink`(.5), 창 바·`.box__tab`은 `--gloss-cap-o-bar`(.4). 글자 그림자는 `0 -1px 0` + `0 1px 2px` 두 겹(진한 남색)으로 캡 위 글자 윗부분을 받친다. 배경 레이어로 캡을 그리는 흰 글자 부품(표 머리, 툴팁, 메뉴 활성 항목, 가격 알약)은 `--gloss-cap` 대신 `--gloss-cap-ink`를 쓴다. 호버는 캡을 1로 올리지 않고 `--cap-k: 1.15`(15% 증폭)만 준다. 아이콘 그림자는 여러 겹 text-shadow를 받을 수 없으므로 `filter: var(--icon-drop)`.
**쓰지 않는 곳**: 본문 박스의 면, 표 셀, 입력칸 안쪽(입력칸은 오목하게 만든다).

### 시그니처 B — 구슬 `.orb`

`<span class="orb orb--lime orb--l" aria-hidden="true">여</span>`처럼 쓴다. 크기는 `--xs`12 `--s`22 `--m`32(기본) `--l`44 `--xl`64이고, 색은 젤리와 같은 이름을 쓴다. 안에 `.icon` SVG를 넣으면 크기가 56%로 맞춰진다.
누를 수 있는 아이콘 버튼은 `class="orb orb--white orb-btn" aria-label="…"`로 만든다(44px, `orb-btn--s`는 36px에 터치 영역 44). 숫자 꼬리표는 `<span class="orb__count">3</span>`이다.

---

## 3. 장면 CSS에서 쓸 semantic 토큰

- 면: `--surface-skin`(스킨) `--surface`(박스) `--surface-2`(교차행) `--surface-head`(머리 띠 그라디언트) `--surface-raised`(창·메뉴 흰 에나멜) `--surface-sunken`(입력) `--surface-hover` `--surface-select`
- 글자: `--text` `--text-muted` `--text-subtle` `--link` `--link-hover` `--logo` `--on-scene`(하늘 아래쪽 글자) `--on-scene-strong`(하늘 위 큰 글자) + `--scene-ts`(그 그림자)
- 선: `--rim` `--border-strong` `--line` `--line-strong` `--winbar-rim`
- 상태 글자: `--info-ink` `--aqua-ink` `--amber-ink` `--success-ink` `--danger-ink` `--holiday` / 틴트 면: `--tint-info/warn/danger/success`
- 젤리 색: `--gel-{sky|lime|amber|red|aqua|white|mist|slate}-{top|bottom|ink}` · `--gloss-cap` `--gloss-cap-ink` `--gloss-cap-o` `--gloss-cap-o-ink` `--gloss-cap-o-bar` `--icon-drop` `--gloss-floor` `--gel-hi` `--gel-drop` `--orb-shine` `--orb-deep`
- 장면 그림: `--sky-zenith` `--sky-mid` `--sky-horizon` `--hill-back` `--hill-front` `--water` `--bubble-rim` `--bubble-body` `--bubble-shine` `--scene-stars` `--sky-day` `--sky-night` `--hills-day` `--hills-night` `--flare` `--flare-ring`
- 스킨 썸네일 물감(모드 무관): `--th-sky` `--th-sky-deep` `--th-sky-pale` `--th-dawn` `--th-sun` `--th-cream` `--th-coral` `--th-fish` `--th-grass` `--th-grass-deep` `--th-water` `--th-night` `--th-night-2` `--th-glow` `--th-white` `--th-snow`
- 차트: `--chart-bar-top` `--chart-bar-bottom`(이번 주 막대) `--chart-prev`(지난주 점선) `--chart-grid` `--chart-peak`(최고치 라벨)
- LCD: `--lcd-bg` `--lcd-ink` `--lcd-dim` `--lcd-grid` `--eq-top` `--eq-bottom`
- 그림자: `--shadow-box` `--shadow-frame` `--shadow-win` `--shadow-pop` `--inset` · 포커스 `--focus` `--focus-glow` · 딤 `--scrim`
- 반경: `--r-frame` `--r-box` `--r-input` `--r-tab` `--r-pill` `--r-orb` · 간격 `--sp-1…9`(4·8·12·16·24·32·48·64·96) · 모션 `--ease-spring` `--ease-out` `--dur-press` `--dur-release` `--dur-ui` `--dur-pop`

---

## 4. 컴포넌트 32 (알파벳순)

### accordion — FAQ 젤리 띠
```html
<div class="acc" data-single>   <!-- data-single: 하나만 열림 -->
  <div class="acc__item is-open">
    <h3><button class="acc__head gel" type="button" aria-expanded="true" aria-controls="faq-1">
      <span class="acc__q">Q</span><span class="acc__title">옛날 홈피 데이터는 어떻게 되살리나요?</span>
      <span class="acc__sign orb orb--white" aria-hidden="true"><svg class="icon acc__plus" viewBox="0 0 24 24"><path d="M12 6v12M6 12h12"/></svg><svg class="icon acc__minus" viewBox="0 0 24 24"><path d="M6 12h12"/></svg></span>
    </button></h3>
    <div class="acc__panel" id="faq-1"><div class="acc__inner"><div class="acc__body"><p>홈피 개설 마법사 2단계에서 2004~2011년 아이디로 로그인하면 사진첩·다이어리·방명록을 그대로 불러와요.</p></div></div></div>
  </div>
</div>
```
- 닫힌 항목은 `is-open`을 빼고 `aria-expanded="false"`로 둔다. 닫힌 머리는 반투명 하늘 젤리, 열린 머리는 진한 하늘 젤리다. 펼침은 260ms다.

### alert — 포털 알림 띠
```html
<div class="alert alert--warn" role="status">
  <span class="orb orb--amber" aria-hidden="true">!</span>
  <div class="alert__body"><p class="alert__title">10월 13일(화) 02:00~05:00 서버 점검이 있어요.</p><p class="alert__text">점검 동안 홈피·쪽지·BGM을 쓸 수 없어요.</p><a class="alert__action" href="inbox.html">점검 안내 쪽지 보기 ›</a></div>
</div>
```
- 변형 `--info`(하늘 `i`) `--warn`(앰버 `!`) `--danger`(빨강 `×`) `--success`(라임 `✓`)는 구슬 색과 짝을 맞춘다. 박스 안에 따로 놓을 때는 `alert--inline`을 붙인다. 닫기가 필요하면 `<button class="orb orb--white orb-btn orb-btn--s alert__close" aria-label="알림 닫기">`를 넣는다.

### badge — 젤리 알약 · 숫자 구슬
```html
<span class="badge gel gel--red badge--latin">NEW</span>
<span class="badge gel gel--amber badge--latin">HOT</span>
<span class="badge gel gel--lime">페스타 20%</span>
<span class="badge gel gel--lime">완료</span> <span class="badge gel gel--amber">선물 대기</span> <span class="badge gel">심사 중</span> <span class="badge gel gel--slate">취소</span>
<span class="badge gel gel--lime badge--l">48방울</span>      <!-- 가격 큰 알약 -->
<span class="badge badge--soft">5방울</span>                   <!-- 젤리 없는 연한 알약 -->
<span class="count">3</span> <span class="count count--sky">12</span> <span class="count count--slate">2</span>
```
- `badge--latin`은 NEW, HOT 같은 라틴 대문자에만 붙인다(자간 .04em).

### breadcrumb
```html
<nav aria-label="현재 위치"><ol class="crumbs"><li><a href="../index.html">소다넷</a></li><li><a href="product.html">스킨샵</a></li><li><span aria-current="page">아침이슬 2026</span></li></ol></nav>
```

### button — 젤리 알약
```html
<button class="btn gel" type="button">확인</button>                         <!-- 주요(하늘) -->
<a class="btn gel gel--lime" href="pricing.html">방울 충전</a>               <!-- 구매·충전 -->
<button class="btn gel gel--amber" type="button">48방울 쓰기</button>       <!-- 방울 사용 -->
<button class="btn gel gel--red" type="button">물친구 끊기</button>          <!-- 위험 -->
<button class="btn gel gel--white" type="button">취소</button>               <!-- 보조 -->
<button class="btn gel btn--s" type="button">작게 36</button>  <button class="btn gel btn--l" type="button">크게 56</button>  <a class="btn gel btn--block">…</a>
<button class="btn gel" type="button" disabled>비활성</button>
<button class="btn gel gel--lime" type="submit" aria-busy="true"><span class="btn__label">충전 중</span></button>   <!-- 로딩: 라벨 자리에 구슬 스피너 -->
<button class="btn gel gel--white" type="button" aria-pressed="true">눌림 유지</button>
<button class="btn gel" type="button"><span class="btn__label"><svg class="icon" …/>BGM 듣기</span></button>
<button class="linkbtn" type="button">더보기 ›</button>                       <!-- 글자 링크형 -->
<div class="btn-row btn-row--end">…</div>
```
- 아이콘 버튼은 `.orb.orb-btn`(2절)이다. 로딩 상태를 쓸 버튼은 라벨을 반드시 `.btn__label`로 감싼다. `data-loading-demo`를 붙이면 누를 때 1.6초 동안 로딩 상태를 보여 준다.

### calendar — 홈피 다이어리 달력 (2026년 10월, 일요일 시작, 1일 = 목)
```html
<table class="cal"><caption>10월<small>2026</small></caption>
  <thead><tr><th class="cal__dow cal__dow--sun" scope="col">일</th><th class="cal__dow" scope="col">월</th>…<th class="cal__dow cal__dow--sat" scope="col">토</th></tr></thead>
  <tbody>
    <tr><td><button class="cal__day is-sun is-out" type="button" disabled><span class="cal__num">27</span></button></td> … <td><button class="cal__day" type="button"><span class="cal__num">1</span><span class="cal__marks"><i class="cal__mark cal__mark--diary"></i></span></button></td> …</tr>
    <tr>… <td><button class="cal__day is-holiday" type="button" aria-label="10월 9일 한글날, 다이어리 있음"><span class="cal__num">9</span><span class="cal__marks"><i class="cal__mark cal__mark--diary"></i></span></button></td>
          <td><button class="cal__day is-sat is-today" type="button" aria-current="date" aria-pressed="true" aria-label="10월 10일 토요일 오늘"><span class="cal__num">10</span>…</button></td></tr>
  </tbody></table>
<div class="cal__legend"><span><i class="cal__mark cal__mark--diary"></i>다이어리</span><span><i class="cal__mark cal__mark--event"></i>점검</span><span><i class="cal__mark cal__mark--end"></i>페스타 끝</span></div>
```
- 날짜별 표시는 이렇게 한다. 3일(토, 개천절)은 `is-sat is-holiday`, 9일(금, 한글날)은 `is-holiday`, 13일(화) 점검은 `cal__mark--event`, 31일(토) 페스타 종료는 `cal__mark--end`. 일요일은 `is-sun`, 토요일은 `is-sat`, 이웃 달 날짜는 `is-out disabled`다. 날짜를 누르면 app.js가 선택(`aria-pressed`)을 옮긴다. 박스 안에 넣을 때는 `.box__body`를 쓴다.

### card — 포털 박스 `.box` · 스킨 상품 카드
```html
<section class="box" aria-labelledby="bx-1">
  <div class="box__head"><h2 class="box__tab gel" id="bx-1"><span class="orb orb--white" aria-hidden="true">…</span>최근 방명록</h2><a class="box__more" href="profile.html#guestbook">더보기 ›</a></div>
  <div class="box__body">…</div>          <!-- --flush(패딩 0, 목록·표용) · --tight -->
  <div class="box__foot">…</div>
</section>
```
- 머리 띠 라벨 `.box__tab`도 젤리이므로 `gel--lime`, `gel--amber`, `gel--white`로 바꿀 수 있다. 오른쪽에는 `.box__more` 링크나 `.box__meta`(예: "14:20 기준")를 둔다. 띠 밑줄 색을 라임이나 앰버로 바꾸려면 `box--lime`이나 `box--amber`를 붙인다. 박스 전체가 링크면 `a.box.box--link`로 만든다. 키-값 행은 `<dl class="kv"><dt>다음 결제</dt><dd>11.08(일) ₩4,900</dd></dl>`로 쓴다.
- **박스에는 항상 내용이 있어야 한다.** 컴포넌트를 하나씩 담아 진열하는 갤러리는 금지다.
```html
<article class="box skincard">
  <div class="skinthumb skinthumb--dew" role="img" aria-label="아침 하늘과 이슬 구슬이 있는 스킨 미리보기"><span class="skinthumb__tag badge gel gel--red badge--latin">HOT</span></div>
  <div class="skincard__body">
    <span class="skincard__id">SK-2026-0412</span>
    <h3 class="skincard__name"><a href="product.html">아침이슬 2026</a></h3>   <!-- 링크가 카드 전체를 덮는다 -->
    <div class="skincard__price"><s>60방울</s><span class="badge gel gel--lime badge--l">48방울</span></div>
    <p class="skincard__meta">판매 1,284 · 평점 4.8 (리뷰 312)</p>
  </div>
</article>
```
- 썸네일 변형과 스킨은 이렇게 짝짓는다. `--dew` 아침이슬 2026, `--night` 밤바다 정류장, `--cream` 소다 크림, `--aquarium` 수족관의 오후, `--folder` 하늘색 폴더, `--grass` 초원 바탕화면, `--sunset` 노을 MP3, `--snow` 첫눈 오는 화면보호기, `--play` 비눗방울 운동장. 금붕어 어항에는 `--aquarium`을 쓴다. 썸네일은 모드와 상관없이 같은 색이다(상품 고유색).

### carousel — 메인 배너 롤링
```html
<section class="carousel" data-carousel aria-roledescription="carousel" aria-label="메인 배너">
  <div class="carousel__viewport"><div class="carousel__track">
    <div class="carousel__slide" role="group" aria-roledescription="slide" aria-label="1 / 3">
      <div class="banner">
        <span class="banner__flare" aria-hidden="true"></span>                              <!-- 렌즈 플레어: index 배너 1곳만 -->
        <div class="banner__art" aria-hidden="true"><span class="banner__drop"></span><span class="banner__drop"></span><span class="banner__drop"></span></div>
        <div class="banner__kicker"><span class="badge gel gel--lime">전 품목 20%</span></div>
        <p class="banner__title">가을 스킨 페스타</p>
        <p class="banner__sub">10.31(토)까지 전 품목 20% — 아침이슬 2026은 48방울</p>
        <div class="banner__actions"><a class="btn gel gel--lime" href="pages/product.html">스킨샵 가기</a></div>
      </div>
    </div>
    <div class="carousel__slide" role="group" aria-roledescription="slide" aria-label="2 / 3"><div class="banner banner--water">…투명한 오후…</div></div>
    <div class="carousel__slide" role="group" aria-roledescription="slide" aria-label="3 / 3"><div class="banner banner--dawn">…옛 홈피 되살리기…</div></div>
  </div></div>
  <button class="carousel__prev orb orb--white orb-btn" type="button" data-carousel-prev aria-label="이전 배너"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M14.5 6l-6 6 6 6"/></svg></button>
  <button class="carousel__next orb orb--white orb-btn" type="button" data-carousel-next aria-label="다음 배너"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M9.5 6l6 6-6 6"/></svg></button>
  <div class="carousel__bar">
    <button class="carousel__dot" type="button" aria-label="1번 배너"></button><button class="carousel__dot" type="button" aria-label="2번 배너"></button><button class="carousel__dot" type="button" aria-label="3번 배너"></button>
    <button class="carousel__pause orb orb--white orb-btn" type="button" data-carousel-pause aria-pressed="false" aria-label="자동 넘김 멈추기"><svg class="icon icon--pause" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6v12M15 6v12"/></svg><svg class="icon icon--play" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5l11 6.5-11 6.5z"/></svg></button>
  </div>
</section>
```
- `.banner`는 모드별 장면 토큰으로 그려진다(낮에는 맑은 하늘과 초원, 밤에는 별이 뜬 밤 물가). 다크 모드에서 배너 옆에 "밤 스킨 '밤바다 정류장' 곧 출시" 배지를 보이려면 장면 CSS에서 `[data-theme="dark"]` 선택자로 노출한다. `.banner__note`는 배너 왼쪽 아래 작은 캡션이다. 760px 미만에서는 좌우 화살표가 숨고 구슬 점 3개와 정지 버튼만 남는다(←→ 키는 계속 동작).

### code — 스킨 HTML 꾸미기 창
```html
<figure class="codewin window">
  <figcaption class="window__bar gel gel--bar"><span class="window__title">스킨 꾸미기.html</span><button class="btn gel gel--white btn--s codewin__copy" type="button" data-copy="code-skin">복사</button></figcaption>
  <pre class="code" id="code-skin" tabindex="0"><code><span class="code__line"><span class="tok-com">&lt;!-- 홈피 제목 흐르기 (marquee 대신) --&gt;</span></span><span class="code__line"><span class="tok-tag">&lt;p</span> <span class="tok-attr">class</span>=<span class="tok-str">"title-flow"</span><span class="tok-tag">&gt;</span>여름이 사는 물가<span class="tok-tag">&lt;/p&gt;</span></span></code></pre>
</figure>
```
- 한 줄에 `.code__line` 하나를 쓰면 줄번호가 자동으로 붙는다. 강조할 줄에는 `code__line--mark`를 붙인다. 줄 사이에 공백이나 줄바꿈 문자를 넣지 말 것(`pre` 안에서는 그대로 보인다).

### command — ⌘K 소다넷 통합검색
- 실제 팔레트는 **app.js가 `#cmd`를 자동으로 만든다**(그룹: 홈피 / BGM / 스킨 / 쪽지, 페이지 경로는 자동으로 보정된다). 여는 방법은 `data-command-open` 버튼(로고 바의 검색 알약)이나 ⌘K / Ctrl+K다. ↑↓로 이동하고, ↵로 열고, Esc로 닫는다. 결과가 없으면 "'노을'과 일치하는 결과가 없어요."가 나온다.
- index의 열린 상태 정적 견본(브리프 7-7)은 이렇게 넣는다. 정적 견본도 실제로 입력에 따라 결과가 걸러진다.
```html
<div class="cmd cmd--static"><div class="cmd__panel">
  <div class="cmd__search"><span class="cmd__brand">sodanet</span><input class="cmd__input" type="search" value="투명" aria-label="검색어 (견본)" role="combobox" aria-expanded="true" aria-controls="cmd-demo"><button class="btn gel cmd__go" type="button">검색</button></div>
  <div class="cmd__box"><div id="cmd-demo" role="listbox" aria-label="검색 결과 견본">
    <div class="cmd__group" role="group" aria-labelledby="cd-g1"><div class="cmd__label" id="cd-g1">BGM</div>
      <a class="cmd__item" role="option" id="cd-1" aria-selected="true" href="pages/dashboard.html#bgm"><span class="orb orb--amber" aria-hidden="true">…</span><span class="cmd__text">투명한 오후 — 물빛밴드<small>BGM-30871 · 3:42 · 5방울</small></span><kbd>↵</kbd></a></div>
  </div><p class="cmd__empty" hidden></p>
  <div class="cmd__foot" aria-hidden="true"><span>↑↓ 이동</span><span>↵ 열기</span><span>Esc 닫기</span></div></div>
</div></div>
```

### drawer — 물친구 목록 (오른쪽 360 / 모바일 아래 시트)
```html
<div class="drawer" id="friends" hidden>
  <div class="drawer__scrim" data-close></div>
  <aside class="drawer__panel window" role="dialog" aria-modal="true" aria-labelledby="friends-t">
    <span class="drawer__grab" aria-hidden="true"></span>
    <div class="window__bar gel gel--bar"><h2 class="window__title" id="friends-t">물친구 142명</h2><div class="window__ctrls"><button class="winbtn winbtn--close" type="button" data-close aria-label="닫기"><span class="winbtn__dot"><svg viewBox="0 0 10 10" aria-hidden="true"><path d="M2.5 2.5l5 5M7.5 2.5l-5 5"/></svg></span></button></div></div>
    <div class="drawer__search"><input class="input" type="search" placeholder="물친구 이름" aria-label="물친구 찾기"></div>
    <ul class="drawer__body">
      <li class="friend"><span class="friend__avatar"><span class="orb orb--lime" aria-hidden="true">해</span><span class="friend__on orb orb--lime" aria-hidden="true"></span></span><span class="friend__name">해랑해랑<small>haerang</small></span><span class="friend__state friend__state--on">접속 중</span></li>
      <li class="friend"><span class="friend__avatar"><span class="orb orb--sky" aria-hidden="true">바</span></span><span class="friend__name">바다건너<small>bada_yoon</small></span><span class="friend__state">어제</span></li>
    </ul>
    <div class="drawer__foot"><button class="btn gel gel--white" type="button" data-close>닫기</button></div>
  </aside>
</div>
<button class="btn gel gel--white" type="button" data-open="friends" aria-haspopup="dialog">물친구 목록</button>
```
- 정적 견본은 `class="drawer drawer--static"`에서 `hidden`과 `aria-modal`을 빼고, 흐름 안의 창 하나로 둔다.

### empty — 큰 물방울 안 그림
```html
<div class="empty">
  <div class="empty__drop"><svg viewBox="0 0 64 64" aria-hidden="true"><rect x="12" y="16" width="40" height="32" rx="5"/><path d="M12 40l11-9 9 7 7-5 13 10"/><circle cx="41" cy="26" r="4"/></svg></div>
  <p class="empty__title">아직 사진이 없어요</p>
  <p class="empty__text">2004년 사진첩은 홈피 개설 마법사에서 불러올 수 있어요.</p>
  <a class="btn gel" href="onboarding.html">사진 불러오기</a>
</div>
```
- 작은 칸에는 `empty--s`를 붙인다. SVG는 `stroke: currentColor`를 따른다. 색을 바꿔야 하면 `style="color:var(--aqua-ink)"`를 `.empty__drop`에 준다.

### form
```html
<form class="stack" data-validate data-success="home.sodanet.kr/yeoreum 주소를 지켰어요.">
  <div class="field"><label class="field__label" for="f-id">아이디<span class="req">*</span></label>
    <div class="inputgroup"><span class="inputgroup__addon">home.sodanet.kr/</span><input class="input input--mono" id="f-id" required pattern="[a-z0-9]{4,16}" data-error="아이디는 영문 소문자·숫자 4~16자로 입력해 주세요."></div>
    <p class="field__hint">영문 소문자·숫자 4~16자</p></div>
  <div class="field"><label class="field__label" for="f-title">홈피 제목</label><input class="input" id="f-title" value="여름이 사는 물가"></div>
  <div class="field"><label class="field__label" for="f-skin">스킨</label><select class="select" id="f-skin"><option>아침이슬 2026</option></select></div>
  <div class="field"><label class="field__label" for="f-bio">소개</label><textarea class="textarea" id="f-bio">그림 그리는 여름</textarea></div>
  <input class="input input--mono" value="home.sodanet.kr/yeoreum" readonly aria-label="홈피 주소">
  <fieldset class="choices"><legend>방명록 공개 범위</legend>
    <label class="radio"><input type="radio" name="gb" checked><span class="radio__dot"></span>전체</label>
    <label class="radio"><input type="radio" name="gb"><span class="radio__dot"></span>물친구만</label>
    <label class="radio"><input type="radio" name="gb"><span class="radio__dot"></span>나만</label></fieldset>
  <label class="check"><input type="checkbox" checked><span class="check__box"></span>옛 홈피 사진첩도 불러오기</label>
  <label class="switch"><input type="checkbox" role="switch" checked><span class="switch__rail"></span><span class="switch__text">BGM 자동 재생<small>홈피에 들어오면 바로 재생</small></span></label>
  <label class="field"><span class="field__label">볼륨</span><input class="range" type="range" min="0" max="100" value="70"></label>
  <div class="form-actions"><button class="btn gel gel--white" type="reset">다시 쓰기</button><button class="btn gel gel--lime" type="submit"><span class="btn__label">저장</span></button></div>
</form>
```
- 오류 상태를 정적으로 보여 줄 때는 입력에 `aria-invalid="true" aria-describedby="f-id-err"`를 주고 `<p class="field__error" id="f-id-err">아이디는 영문 소문자·숫자 4~16자로 입력해 주세요.</p>`를 둔다. `form[data-validate]`는 app.js가 required, pattern, minlength를 검사한다. 오류 문장은 `data-error`로 정하고, 제출에 성공하면 `data-success` 문장으로 토스트가 뜬다.
- 2열 배치는 `.form-grid`를 쓰고, 전폭 칸에는 `.field--full`을 붙인다. 비활성은 `disabled`(점선 테두리), 읽기 전용은 `readonly`다.

### kanban — 물방울공방 스킨 보드
```html
<div class="kanban" data-kanban style="--cols:4">
  <section class="kanban__col" aria-labelledby="kc-1">
    <div class="box__head"><h3 class="box__tab gel gel--white kanban__name" id="kc-1">아이디어</h3><span class="count count--slate kanban__count">3</span></div>
    <div class="kanban__list">
      <article class="kcard" id="SK-2026-0451" draggable="true" tabindex="0" aria-roledescription="옮길 수 있는 카드">
        <div class="skinthumb skinthumb--snow"></div>
        <div class="kcard__top"><span class="kcard__id">SK-2026-0451</span><span class="badge gel gel--white">12월 목표</span></div>
        <p class="kcard__title">첫눈 오는 화면보호기</p>
        <p class="kcard__meta"><span>도윤서</span><span>아이디어</span></p>
      </article>
    </div>
  </section>
  …제작 중(`gel` 하늘, `count--sky`) · 심사 대기(`gel--amber`, `count`) · 판매 중(`gel--lime`)…
</div>
<p class="kanban__hint">카드를 끌거나, 카드에서 스페이스를 눌러 잡은 뒤 ←→ 로 열을 옮기고 스페이스로 놓아요.</p>
```
- 제작 중 카드에는 진행바를 넣는다: `<div class="progress progress--s" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" aria-label="제작 진행" style="--val:60%"><span class="progress__fill"></span></div>`. 열 개수는 app.js가 다시 센다. `--cols`는 열 수와 같게 맞춘다. 760px 미만에서는 열이 82vw씩 가로로 스냅된다.

- **미니 보드(`.kanban--mini`, index 전용 요약)**: 열마다 대표 카드 1장 + `<a class="kanban__more" href="kanban.html">외 n장 · 카드 이름…</a>` 한 줄. 열에 `data-more="n"`을 달면 app.js가 개수 구슬을 `보이는 카드 + n`으로 센다. 끌어 놓기 점선 자리는 열이 비었을 때만 나타난다(전체 보드 kanban.html 에서는 항상).

### list — 포털 목록 · 순위 · 실시간 검색어
```html
<ul class="plist">
  <li><a class="plist__row" href="inbox.html"><span class="plist__title"><span class="plist__tag">[점검]</span>10월 13일(화) 02:00~05:00 서버 점검</span><span class="plist__meta">10.10</span></a></li>
</ul>
<ol class="plist">
  <li><a class="plist__row" href="dashboard.html#bgm"><span class="orb plist__rank plist__rank--1" aria-hidden="true">1</span><span class="plist__title">투명한 오후<small>물빛밴드</small></span><span class="plist__num">1,204회</span></a></li>
  <!-- --2 하늘 · --3 라임 · --n(4위 이하) 작은 회청 구슬 -->
</ol>
```
- 정적 행은 `<div class="plist__row">`로, 새 항목은 `.is-unread`(굵게)로 쓴다. 제목을 줄바꿈하려면 `plist--wrap`을 붙인다. 순위 변동은 `.plist__move--up`(▲2), `--down`(▼1), `--new`(NEW)로 표시한다.
- **실시간 검색어 티커**: 3초마다 한 줄씩 롤링하고, 호버하거나 포커스하면 멈춘다. 1~10위를 모두 넣는다.
```html
<section class="box ticker" data-ticker aria-labelledby="tk-t">
  <div class="box__head"><h2 class="box__tab gel gel--amber" id="tk-t">실시간 검색어</h2><span class="box__meta">14:20 기준</span></div>
  <div class="ticker__window" id="tk-list"><ol class="plist">…<li><a class="plist__row" href="…"><span class="orb plist__rank plist__rank--1" aria-hidden="true">1</span><span class="plist__title">가을 스킨 페스타</span><span class="plist__move plist__move--up">▲2</span></a></li>…</ol></div>
  <button class="linkbtn ticker__toggle" type="button" data-ticker-toggle aria-expanded="false" aria-controls="tk-list"><span data-ticker-label>1~10위 펼치기</span><svg class="icon icon--s" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9.5l6 6 6-6"/></svg></button>
</section>
```

### marquee — 공지 흐름 띠
- 마크업은 1-5절의 스니펫을 그대로 쓴다. app.js가 항목을 복제해 이음매 없이 흐르게 하고, 폭에 맞춰 속도(약 60px/s)를 정한다. 호버하거나 포커스하거나 정지 버튼을 누르면 멈춘다. 움직임 줄이기가 켜져 있으면 첫 줄만 정적으로 보인다.

### menu — 더보기 / 우클릭
```html
<div class="menu-wrap">
  <button class="orb orb--white orb-btn orb-btn--s" type="button" data-menu="m-haerang" aria-haspopup="menu" aria-expanded="false" aria-label="서해랑 홈피 더보기"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 12h.01M12 12h.01M18 12h.01"/></svg></button>
  <ul class="menu" id="m-haerang" role="menu" aria-label="서해랑 홈피 메뉴" hidden>
    <li role="none"><a class="menu__item" role="menuitem" href="profile.html"><span class="orb orb--sky" aria-hidden="true"></span>홈피 가기</a></li>
    <li role="none"><a class="menu__item" role="menuitem" href="inbox.html"><span class="orb orb--lime" aria-hidden="true"></span>쪽지 보내기</a></li>
    <li role="none"><button class="menu__item" role="menuitem" type="button" data-toast="초록 언덕을 서해랑님께 선물했어요 (5방울)"><span class="orb orb--amber" aria-hidden="true"></span>BGM 선물하기</button></li>
    <li role="separator" class="menu__sep"></li>
    <li role="none"><button class="menu__item menu__item--danger" role="menuitem" type="button">물친구 끊기</button></li>
  </ul>
</div>
```
- 기본 정렬은 트리거 오른쪽 끝이다. 왼쪽에 맞추려면 `menu--left`를 붙인다. 행에 `data-contextmenu="m-haerang"`을 주면 그 행에서 우클릭할 때 포인터 위치에 메뉴가 열린다. ↑↓/Home/End로 이동하고 Esc로 닫는다. 정적 견본은 `class="menu menu--static"`에서 `hidden`을 빼서 만든다.

### modal — Aero 창 대화상자
```html
<div class="modal" id="dlg-buy" hidden>
  <div class="modal__scrim" data-close></div>
  <div class="modal__win window" role="dialog" aria-modal="true" aria-labelledby="dlg-buy-t" aria-describedby="dlg-buy-d">
    <div class="window__bar gel gel--bar"><span class="window__title" id="dlg-buy-t">스킨 구매</span><div class="window__ctrls"><button class="winbtn winbtn--close" type="button" data-close aria-label="닫기"><span class="winbtn__dot"><svg viewBox="0 0 10 10" aria-hidden="true"><path d="M2.5 2.5l5 5M7.5 2.5l-5 5"/></svg></span></button></div></div>
    <div class="modal__body"><span class="orb orb--amber" aria-hidden="true"><svg class="icon" viewBox="0 0 24 24"><path d="M12 4c3 4 5 6.5 5 9a5 5 0 0 1-10 0c0-2.5 2-5 5-9z"/></svg></span>
      <div class="modal__msg"><p class="modal__title">아침이슬 2026 스킨을 48방울에 구매할까요?</p><p class="modal__text" id="dlg-buy-d">구매하면 바로 내 홈피에 입혀져요. 남는 방울은 292방울이에요.</p></div></div>
    <div class="window__foot"><button class="btn gel gel--white" type="button" data-close>취소</button><button class="btn gel" type="button" data-close data-toast="아침이슬 2026을 홈피에 입혔어요" data-toast-tone="sky">구매하기</button></div>
  </div>
</div>
<button class="btn gel gel--lime" type="button" data-open="dlg-buy" aria-haspopup="dialog">구매하기</button>
```
- 넓은 창은 `modal--wide`(640)다. 정적 견본은 `class="modal modal--static"`에서 `hidden`, 스크림, `aria-modal`을 빼서 만든다. 창 컨트롤 3구슬(최소화·최대화·닫기)은 견본 창에서만 쓴다. 실제 대화상자에는 닫기만 둔다.

### motion — 효과 미리보기 창 (효과를 칸마다 진열하지 않는다)
효과 6가지를 같은 크기 카드로 늘어놓지 않고, Aero 창 하나 안의 **실제 포털 박스**(`.box.fx`)에서 함께 돌린다. 하늘은 8초 주기로 낮↔밤 크로스페이드(600ms), 티커는 3초마다 한 줄, 진행바는 줄무늬 1.2s. 버튼(`.mo-squash`)이 `data-replay="<.fx id>"`를 가지면 누를 때마다 스쿼시 → 도착 배지 스프링 복원(`.mo-pop`) → 물방울 상승을 처음부터 재생한다. 수치는 창 아래 상태 표시줄 한 줄에만 적는다.
```html
<section class="span-7 fxwin window" aria-labelledby="mo-t">
  <div class="window__bar gel gel--bar"><h3 class="window__title" id="mo-t"><span class="orb orb--aqua" aria-hidden="true"></span>효과 미리보기 — 여름이 사는 물가</h3>
    <div class="window__ctrls" aria-hidden="true"><span class="winbtn winbtn--min"><span class="winbtn__dot"><svg viewBox="0 0 10 10"><path d="M2.5 5h5"/></svg></span></span><span class="winbtn winbtn--max"><span class="winbtn__dot"><svg viewBox="0 0 10 10"><rect x="2.5" y="2.5" width="5" height="5" rx="1"/></svg></span></span><span class="winbtn winbtn--close"><span class="winbtn__dot"><svg viewBox="0 0 10 10"><path d="M2.5 2.5l5 5M7.5 2.5l-5 5"/></svg></span></span></div></div>
  <div class="fxwin__body">
    <p class="motion__reduced">움직임 줄이기가 켜져 있어 정지 화면으로 보여드려요.</p>
    <div class="box fx is-playing" id="fx-stage">
      <div class="fx__sky" aria-hidden="true">
        <span class="fx__day"></span><span class="fx__night"></span>
        <span class="mo-bubble"></span><span class="mo-bubble"></span><span class="mo-bubble"></span>
        <span class="fx__clock"><span class="fx__clock-day">14:20 맑음</span><span class="fx__clock-night">23:40 밤 물가</span></span>
      </div>
      <div class="fx__ticker"><span class="fx__ticker-tag">실시간</span><div class="mo-ticker" aria-live="off"><ol><li><span class="orb plist__rank plist__rank--1" aria-hidden="true">1</span>가을 스킨 페스타</li><li><span class="orb plist__rank plist__rank--2" aria-hidden="true">2</span>투명한 오후</li><li><span class="orb plist__rank plist__rank--3" aria-hidden="true">3</span>홈피 복구</li><li><span class="orb plist__rank plist__rank--1" aria-hidden="true">1</span>가을 스킨 페스타</li></ol></div></div>
      <div class="fx__load">
        <div class="progress__row"><span>방명록 2,031개 불러오는 중</span><b>58%</b></div>
        <div class="progress" role="progressbar" aria-valuenow="58" aria-valuemin="0" aria-valuemax="100" aria-label="방명록 불러오기" style="--val:58%"><span class="progress__fill"></span></div>
      </div>
      <div class="fx__act">
        <button class="btn gel mo-squash" type="button" data-replay="fx-stage">파도타기 다시 보기</button>
        <span class="fx__done mo-pop"><span class="orb orb--lime orb--s" aria-hidden="true"></span>해랑해랑 홈피 도착</span>
        <button class="btn gel gel--white btn--s fx__night-btn" type="button" data-theme-toggle aria-pressed="false" aria-label="밤 스킨으로 바꾸기"><span data-theme-label>밤 스킨</span></button>
      </div>
    </div>
  </div>
  <p class="fxwin__status"><span>누름 <b>scale(1.04, .92) 90ms</b></span><span>복원 <b>cubic-bezier(.34,1.56,.64,1) 420ms</b></span><span>티커 <b>3s 한 줄</b></span><span>줄무늬 <b>1.2s linear</b></span><span>낮↔밤 <b>600ms</b></span><span>물방울 <b>2.4s 위로</b></span></p>
</section>
```

### navbar
- 1-1절의 셸 스니펫을 그대로 쓴다.

### pagination — 게시판 페이지 번호
```html
<nav aria-label="방명록 쪽"><ul class="pager">
  <li><a class="pager__btn" href="profile.html" aria-label="이전 쪽" aria-disabled="true"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M14.5 6l-6 6 6 6"/></svg></a></li>
  <li><a class="pager__btn" href="profile.html" data-page aria-current="page">1</a></li>
  <li><a class="pager__btn" href="profile.html" data-page>2</a></li><li><a class="pager__btn" href="profile.html" data-page>3</a></li>
  <li><span class="pager__gap">…</span></li><li><a class="pager__btn" href="profile.html" data-page>407</a></li>
  <li><a class="pager__btn" href="profile.html" aria-label="다음 쪽"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M9.5 6l6 6-6 6"/></svg></a></li>
</ul></nav>
```
- `data-page`가 있는 버튼을 누르면 app.js가 현재 쪽 표시만 옮긴다(시연용).

### popover — 미니 프로필 말풍선
```html
<span class="pop-wrap">
  <button class="nametag" type="button" data-popover="pp-haerang" aria-expanded="false" aria-controls="pp-haerang">해랑해랑</button>
  <div class="popover" id="pp-haerang" role="dialog" aria-label="해랑해랑 미니 프로필" hidden>
    <div class="popover__head"><span class="orb orb--lime" aria-hidden="true">해</span><div><p class="popover__name">해랑해랑</p><p class="popover__id">haerang · 물친구</p></div></div>
    <p class="popover__text">중학교 동창. 오늘 14:05 파도타기.</p>
    <div class="popover__actions"><a class="btn gel btn--s" href="profile.html">홈피 가기</a><a class="btn gel gel--white btn--s" href="inbox.html">쪽지 보내기</a></div>
  </div>
</span>
```
- 기본은 트리거 가운데 아래에 열린다. 왼쪽에 맞추려면 `popover--start`를 붙인다. 바깥을 클릭하거나 Esc를 누르면 닫힌다. 정적 견본은 `popover popover--static`에서 `hidden`을 빼서 만든다.

### progress — Aqua 진행바 (원형 진행은 쓰지 않는다)
```html
<div class="progress__row"><span>홈피 복구 중</span><b>72%</b></div>
<div class="progress progress--l" role="progressbar" aria-valuenow="72" aria-valuemin="0" aria-valuemax="100" aria-label="홈피 복구" style="--val:72%"><span class="progress__fill"></span></div>
<p class="progress__note">사진첩 1,206장 · 다이어리 418편</p>
```
- 색은 `progress--lime`과 `--amber`, 크기는 `--s`(10)와 `--l`(26)이다. 100%여서 줄무늬를 멈추려면 `progress--done`을 붙인다.

### sidebar
- 1-2절의 셸 스니펫을 그대로 쓴다.

### skeleton
```html
<div aria-busy="true" aria-label="방명록 불러오는 중">
  <div class="skel-row"><span class="skel skel--orb"></span><div><span class="skel skel--line"></span><span class="skel skel--line skel--short"></span></div></div>
  <span class="skel skel--block"></span>
</div>
```

### spinner — 구슬 8개
```html
<span class="spinner" role="status" aria-label="불러오는 중"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></span>
<span class="spin-label"><span class="spinner spinner--s" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></span>2005년 사진첩 찾는 중</span>
```
- 크기는 `--s`(22)와 `--l`(64), 색은 `--lime`과 `--aqua`다(currentColor 기반).

### steps — 홈피 개설 마법사
```html
<ol class="steps" style="--n:4; --done:.333">      <!-- --done = 완료 구간 비율 (현재 2단계 → 1/3) -->
  <li class="steps__item is-done"><span class="steps__node orb" aria-hidden="true">✓</span><span class="steps__label">아이디 정하기<small>yeoreum</small></span></li>
  <li class="steps__item" aria-current="step"><span class="steps__node orb" aria-hidden="true">2</span><span class="steps__label">옛 홈피 불러오기<small>2004~2011</small></span></li>
  <li class="steps__item"><span class="steps__node orb" aria-hidden="true">3</span><span class="steps__label">첫 스킨 고르기</span></li>
  <li class="steps__item"><span class="steps__node orb" aria-hidden="true">4</span><span class="steps__label">첫 BGM</span></li>
</ol>
<div class="steps__nav"><a class="btn gel gel--white" href="onboarding.html">‹ 이전</a><span class="steps__count">4단계 중 2단계</span><button class="btn gel" type="button">다음 ›</button></div>
```
- 세로형(onboarding 왼쪽)은 `steps steps--v`다. 각 `li`에 화면 낭독용 상태를 붙이려면 `<span class="sr-only">완료</span>`를 넣는다.

### table — 충전·구매 내역
```html
<div class="tbl-wrap">
  <table class="tbl tbl--stack" data-sortable>
    <caption>최근 충전·구매 내역 · 10.10(토) 14:20 기준</caption>
    <thead><tr><th scope="col" aria-sort="none"><button class="tbl__sort" type="button">주문 번호</button></th><th scope="col">내용</th><th scope="col" class="num" aria-sort="none" data-type="num"><button class="tbl__sort" type="button">금액</button></th><th scope="col">일시</th><th scope="col">상태</th></tr></thead>
    <tbody>
      <tr><td class="tbl__main mono" data-label="주문">CH-20261010-00418</td><td data-label="내용">100방울 충전 (+5)</td><td class="num" data-label="금액" data-value="9900">₩9,900</td><td data-label="일시">10.10 13:52</td><td data-label="상태"><span class="badge gel gel--lime">완료</span></td></tr>
    </tbody>
    <tfoot><tr><td colspan="2">10월 합계</td><td class="num">₩9,900</td><td colspan="2"></td></tr></tfoot>
  </table>
</div>
```
- `tbl--stack`을 붙이면 760px 미만에서 행이 2줄 목록이 된다. 첫 칸 `.tbl__main`이 1줄에 오고, 나머지 칸은 `data-label`을 앞에 달고 2줄에 이어진다. 그래서 **모든 칸에 `data-label`을 단다.** 정렬할 숫자 칸에는 `data-value`(순수 숫자)를 준다. 높이를 제한하려면 `style="--tbl-max:420px"`로 머리줄을 sticky로 고정한다. 8~15행을 쓴다.

### tabs — 아쿠아 탭
```html
<div class="tabs">
  <div class="fade-x"><div class="tabs__list fade-x__scroll" role="tablist" aria-label="쪽지함">
    <button class="tabs__tab gel gel--mist" role="tab" id="t-in" aria-selected="true" aria-controls="p-in">받은 쪽지 <span class="count">214</span></button>
    <button class="tabs__tab gel gel--mist" role="tab" id="t-out" aria-selected="false" aria-controls="p-out">보낸 쪽지</button>
    <button class="tabs__tab gel gel--mist" role="tab" id="t-keep" aria-selected="false" aria-controls="p-keep">보관함</button>
  </div></div>
  <div class="tabs__panel" id="p-in" role="tabpanel" aria-labelledby="t-in" tabindex="0">…</div>
  <div class="tabs__panel" id="p-out" role="tabpanel" aria-labelledby="t-out" tabindex="0" hidden>…</div>
  <div class="tabs__panel" id="p-keep" role="tabpanel" aria-labelledby="t-keep" tabindex="0" hidden>…</div>
</div>
```
- 패널에 박스 면이 이어져야 하면 `tabs--fill`을 붙인다. **박스 머리 띠 안의 소형 탭**은 `.box` 안에서 `.box__head` 대신 `<div class="tabs tabs--box">`를 쓴다(목록은 패널 안에 바로 넣는다).
- 월간/연간 같은 2~3개짜리 알약 스위치는 `<div class="tabs__list seg" role="tablist" aria-label="결제 주기">` 안에 같은 `tabs__tab` 버튼을 둔다. 바깥 `.fade-x`는 필요 없다. 탭이 바뀔 때 `sodanet:tab` 이벤트가 버블링되므로 장면 스크립트 없이 패널만으로 금액을 바꿀 수 있다(₩4,900 패널과 ₩49,000 패널).

### timeline — 오늘 내 홈피 소식
```html
<ol class="tline">
  <li class="tline__item"><time class="tline__time" datetime="2026-10-10T09:00">09:00</time><span class="tline__node orb orb--amber" aria-hidden="true">!</span><div class="tline__body"><b>운영자 마루</b> 점검 안내 쪽지<p>10.13(화) 02:00~05:00</p></div></li>
  <li class="tline__item"><time class="tline__time" datetime="2026-10-10T11:32">11:32</time><span class="tline__node orb orb--sky" aria-hidden="true"></span><div class="tline__body"><b>도윤서</b>님이 쪽지를 보냈어요</div></li>
  <li class="tline__item"><time class="tline__time" datetime="2026-10-10T13:52">13:52</time><span class="tline__node orb orb--lime" aria-hidden="true"></span><div class="tline__body">100방울 충전<p>₩9,900 · 카드</p></div></li>
  <li class="tline__item is-now"><time class="tline__time" datetime="2026-10-10T14:05">14:05</time><span class="tline__node orb orb--aqua" aria-hidden="true"></span><div class="tline__body"><b>서해랑</b>님이 파도타기로 다녀갔어요</div></li>
</ol>
```

### toast — "띠링" 알림 창
- 실제 토스트는 트리거에 `data-toast="서해랑님이 홈피에 다녀갔어요" data-toast-from="해" data-toast-tone="lime" data-toast-time="14:05 · 파도타기"`(+ 선택 `data-toast-title`)를 붙이면 app.js가 만든다. 오른쪽 아래(모바일에서는 미니 플레이어 위)에 뜨고 4.5초 뒤 가라앉는다. 스크립트에서는 `window.sodanet.toast({ text, from, tone, time, title })`로 띄운다.
- 정적 견본:
```html
<div class="toast toast--static window">
  <div class="window__bar gel gel--bar"><span class="window__title">소다넷 알림</span><div class="window__ctrls"><button class="winbtn winbtn--close" type="button" aria-label="알림 닫기"><span class="winbtn__dot"><svg viewBox="0 0 10 10" aria-hidden="true"><path d="M2.5 2.5l5 5M7.5 2.5l-5 5"/></svg></span></button></div></div>
  <div class="toast__body"><span class="orb orb--lime" aria-hidden="true">해</span><p class="toast__msg"><b>서해랑</b>님이 홈피에 다녀갔어요<span class="toast__time">14:05 · 파도타기</span></p></div>
</div>
```

### tooltip — 하늘 젤리 알약
```html
<span class="tip">
  <button class="orb orb--white orb-btn orb-btn--s" type="button" aria-describedby="tip-bang" aria-label="방울이란?"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5"/><path d="M12 11v5M12 8h.01"/></svg></button>
  <span class="tip__bubble" role="tooltip" id="tip-bang">1방울 = ₩100</span>
</span>
```
- 300ms 뒤에 나타나고 Esc로 닫힌다. 아래로 띄우려면 `tip--below`를 붙인다. 항상 보이는 견본은 `tip--static`이다.

---

## 5. app.js 훅 요약

| 속성 / 클래스 | 동작 |
|---|---|
| `[data-theme-toggle]` | 낮 스킨과 밤 스킨을 바꾸고 localStorage에 저장한다. 라벨("밤 스킨으로 바꾸기" / "낮 스킨으로 바꾸기")과 `aria-pressed`를 갱신하고, 하늘을 600ms 동안 크로스페이드한다. |
| `.bubbles` | 바탕화면 물방울을 만든다. 움직임 줄이기가 켜져 있으면 정지 상태로 만든다. |
| `.portal__* > .box`, `[data-pop] > *` | load 시 1회, 화면 안 박스 최대 8개를 60ms 스태거로 팝한다. 스크롤 리빌은 없다. |
| `[data-open="id"]` / `[data-close]` | 모달과 드로어를 열고 닫는다. 포커스 트랩, Esc, 닫은 뒤 트리거로 포커스 복귀를 처리한다. |
| `[data-sidebar-open]` + `.sidebar#mybox` | 760px 미만에서 내 박스를 드로어로 연다. |
| `[data-command-open]`, ⌘K / Ctrl+K | 통합검색을 연다. `#cmd`는 자동으로 만든다. `.cmd--static`도 입력에 따라 거른다. |
| `[role=tablist]` > `[role=tab][aria-controls]` | 탭을 전환한다. ←→/Home/End를 지원하고 `sodanet:tab` 이벤트를 보낸다. |
| `.acc__head` (`.acc[data-single]`) | 아코디언을 펼치고 접는다. |
| `[data-toast]`, `window.sodanet.toast()` | "띠링" 토스트를 띄운다. |
| `[data-popover="id"]`, `[data-menu="id"]`, `[data-contextmenu="id"]` | 팝오버, 메뉴, 우클릭 메뉴를 연다. 바깥 클릭이나 Esc로 닫히고, 메뉴는 화살표 키로 이동한다. |
| `[data-carousel]` (+ `-prev/-next/-pause`, `.carousel__dot`) | 6초마다 자동으로 넘기고, 호버·포커스·움직임 줄이기 상태에서는 멈춘다. |
| `[data-ticker]` + `[data-ticker-toggle]` | 실시간 검색어를 롤링하고 펼친다. |
| `[data-marquee]` (+ `[data-marquee-pause]`) | 공지 흐름 띠를 복제해 흐르게 한다. |
| `[data-player]` (+ `data-autoplay`, `-toggle/-prev/-next/-volume`, `.player__track`) | 소다플레이어를 재생하고, 시간 표시와 재생목록 전환을 처리한다. |
| `input.range` | 채움 비율 `--val`을 동기화한다. |
| `[data-kanban]` | HTML5 드래그 앤 드롭과 키보드 이동을 처리하고, 열 개수와 라이브 안내를 갱신한다. |
| `form[data-validate]` (+ `data-error`, `data-success`) | 폼을 검사하고, 오류 문장과 성공 토스트를 띄운다. |
| `[data-loading-demo]`, `[data-copy="id"]`, `.pager__btn[data-page]`, `.cal__day`, `[data-replay="id"]` | 각각 로딩 시연, 코드 복사, 쪽 표시, 날짜 선택, 모션 다시 보기를 처리한다. |
| `table[data-sortable]` `th > .tbl__sort` (`data-type="num"`) | 표를 정렬한다. |

---

## 6. 쓰지 말 것 (이 시스템에서 깨지는 것)

- 반투명 서리 유리 판(`backdrop-filter`)은 로고 바 외에는 쓰지 않는다. 소다넷의 패널은 불투명한 에나멜이다(theme-04 문법과 겹친다).
- 보라, 핑크 네온, 크롬 금속 글자, 별 반짝이 장식은 쓰지 않는다. 빛은 젤리 캡과 물방울 하이라이트로만 표현한다. 렌즈 플레어는 index 배너 1곳에만 쓴다.
- 흐릿한 radial 얼룩 배경은 금지다. radial-gradient는 구슬과 물방울 하이라이트 안에서만 쓴다. 장면은 하늘, 언덕, 물방울 같은 구체적인 그림으로 그린다.
- KPI 숫자 카드 4장을 진열하지 않는다. 방문자 수는 LCD 카운터 하나에 담는다. 원형 도넛이나 원형 진행도 쓰지 않는다.
- "왼쪽 고정 목차 사이드바 + 문서형 스펙", "§ 번호 + 섹션 제목", 가운데 정렬 "라벨, 제목, 부제" 헤더를 반복하지 않는다. 섹션 머리는 박스의 아쿠아 탭 라벨이거나, 바탕화면 위 `.scene__title` 한 줄이다.
- 모든 박스를 같은 크기 카드 그리드로 깔지 않는다. 촘촘한 포털 구간과 넓은 장면 구간을 번갈아 둔다.
- 한글에 DotGothic16을 쓰거나 넓은 자간을 주지 않는다. 이모지 아이콘, `href="#"`, 인라인 `onclick`, SVG 속성 안 `var()`는 금지다.
- 다크 모드에서 젤리를 회색으로 만들거나 브랜드 하늘색을 라벤더나 청록으로 바꾸지 않는다. 밤 장면에서 젤리는 안에서 빛난다.
