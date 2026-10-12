# COMPONENTS — 들메식물표본관(DMH) v2 마크업 계약

index.html · pages/*.html 담당 에이전트는 **이 문서와 DIRECTION.md만 보고** 마크업한다. 값(날짜·이름·번호·가격)은 DIRECTION.md `## 팩트 시트`의 값만 쓴다.
클래스는 BEM(`블록__요소--변형`). 상태는 가능한 한 ARIA 속성(`aria-current`, `aria-selected`, `aria-expanded`, `aria-pressed`, `aria-busy`, `aria-invalid`, `aria-disabled`, `disabled`, `hidden`)으로 표시하고 CSS가 그 속성을 읽는다.

목차: 0 페이지 뼈대 · 1 공통 셸(복사 전용) · 2 의미 토큰 · 3 레이아웃 · 4 시그니처 사물 · 5 컴포넌트 32 · 6 app.js 훅 · 7 아이콘 · 8 쓰지 말 것 · 부록 A 세밀화 원본

---

## 0. 페이지 뼈대

### index.html
```html
<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>들메식물표본관 — 표본 대지 규정</title>
<meta name="color-scheme" content="light dark">
<script>(function(){try{var q=new URLSearchParams(location.search).get('theme');var s=localStorage.getItem('dmh-theme');var t=(q==='dark'||q==='light')?q:(s==='dark'||s==='light')?s:(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.setAttribute('data-theme',t);}catch(e){}})();</script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cutive+Mono&family=Gowun+Batang:wght@400;700&family=Hi+Melody&family=IM+Fell+English+SC&family=IM+Fell+English:ital@0;1&family=Noto+Sans+KR:wght@400;500;700&family=Song+Myung&display=swap">
<link rel="stylesheet" href="styles.css">
<link rel="stylesheet" href="index.css">
</head>
<body>
<a class="skip" href="#main">본문으로 건너뛰기</a>
  ← 1-A navbar(index)
<main id="main"> … 장면 … </main>
  ← 1-F footer(index)
  ← 1-C 서랍 드로어(index) · 1-D 표본 찾기(index) · 장면 오버레이(모달·드로어)
<script src="app.js"></script>
</body>
</html>
```

### pages/*.html — 직원 셸 (표찰 띠 + 서랍 색인 + 작업 영역): dashboard · kanban · inbox
```html
<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>들메식물표본관 — 작업대</title>
<meta name="color-scheme" content="light dark">
<script>(function(){try{var q=new URLSearchParams(location.search).get('theme');var s=localStorage.getItem('dmh-theme');var t=(q==='dark'||q==='light')?q:(s==='dark'||s==='light')?s:(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.setAttribute('data-theme',t);}catch(e){}})();</script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cutive+Mono&family=Gowun+Batang:wght@400;700&family=Hi+Melody&family=IM+Fell+English+SC&family=IM+Fell+English:ital@0;1&family=Noto+Sans+KR:wght@400;500;700&family=Song+Myung&display=swap">
<link rel="stylesheet" href="../styles.css">
<link rel="stylesheet" href="dashboard.css">
</head>
<body>
<a class="skip" href="#main">본문으로 건너뛰기</a>
<div class="app">
    ← 1-B navbar(pages)
    ← 1-E 서랍 색인 sidebar (직원 셸 3화면에서만)
  <main class="work" id="main"> … 장면 … </main>
    ← 1-F footer(pages)
</div>
  ← 1-C 서랍 드로어(pages) · 1-D 표본 찾기(pages) · 장면 오버레이
<script src="../app.js"></script>
</body>
</html>
```
- `<title>`은 `들메식물표본관 — 화면이름`(작업대 · 공정 보드 · 편지함 · 상점 · 회원 안내 · 채집인 서연우 · 채집단 첫걸음 · 회원 설정 · 빈 대지).
- 장면 CSS는 index는 `index.css`, 페이지는 `pages/<name>.css` 하나만 추가. **semantic 토큰만**(2절) 쓴다. raw hex · 인라인 `grid-template-columns` 금지. `style="--x:18%"`처럼 커스텀 속성 주입만 허용.
- **셸은 두 가지뿐이다. 누구의 세션인지가 셸을 정한다.**
  | 셸 | 화면 | 구성 | 로그인 사용자 |
  |---|---|---|---|
  | **직원 셸** (`.app` = 표찰 띠 + 서랍 색인 + 작업 영역) | **dashboard · kanban · inbox** | 1-B navbar + 1-E 서랍 색인 + main.work + 1-F footer | 백도윤 · 표본 관리사 (서랍 색인 하단) |
  | **열람 셸** (표찰 띠만) | **pricing · product · profile · onboarding · settings · 404** | 1-B navbar + main.work + 1-F footer (`.app` 래퍼·서랍 색인 없음) | 화면 주인공(settings·onboarding = 윤하람 DC3-061, profile = 서연우 DC3-014)은 본문에서만 밝힌다 |
  ```html
  <!-- 열람 셸 -->
  <body><a class="skip" href="#main">본문으로 건너뛰기</a>
    (1-B navbar) <main id="main" class="work"> … </main> (1-F footer) (1-C 드로어 · 1-D ⌘K · 오버레이) <script src="../app.js"></script></body>
  ```
  공개 상점(product)과 회원 설정(settings)에 직원 작업 도구 셸을 쓰지 않는다(윤하람의 설정 화면 옆에 백도윤이 로그인돼 보이는 모순).
- `localStorage` 키 `dmh-theme`. 우선순위 `?theme=dark|light` → 저장값 → 시스템. `<head>` 인라인 스크립트가 FOUC를 막는다(위 뼈대에 포함).

---

## 1. 공통 셸 — 복사해서 그대로 쓴다

> 바꿀 수 있는 것은 **현재 위치 표시뿐**이다: 해당 링크에 `aria-current="page"`를 붙인다. 문구·순서·링크·아이콘을 고치지 않는다. 사이드바 활성 탭도 `aria-current="page"`.
> 현재 위치 대응: 열람실=index · 작업대=dashboard · 공정 보드/공정=kanban · 편지함/편지=inbox · 상점=product · 회원 안내=pricing · 설정=settings. profile·onboarding·404는 navbar·사이드바에 현재 표시 없음(바닥글 링크에만 표시).

### 1-A. navbar — index.html
```html
<header class="navbar">
  <div class="navbar__inner">
    <a class="navbar__brand" href="index.html" aria-label="들메식물표본관 열람실 첫 화면">
      <svg class="flora navbar__leaf" viewBox="0 0 40 40"  aria-hidden="true"><path d="M6 36 C14 28 22 18 34 6"/>
  <path d="M11.3 30.4 q-1 -9 -9 -11 q1 8 9 11z"/>
  <path d="M11.3 30.4 q9 1 11 9 q-8 -1 -11 -9z"/>
  <path d="M16.4 24.9 q-1 -9 -9 -11 q1 8 9 11z"/>
  <path d="M16.4 24.9 q9 1 11 9 q-8 -1 -11 -9z"/>
  <path d="M21.8 18.8 q-1 -9 -9 -11 q1 8 9 11z"/>
  <path d="M21.8 18.8 q9 1 11 9 q-8 -1 -11 -9z"/>
  <path d="M34 6 q-7 0 -9 6 q7 1 9 -6z"/></svg>
      <span class="navbar__name">들메식물표본관</span><span class="navbar__code sc">DMH</span>
    </a>
    <nav class="navbar__links" aria-label="주 메뉴">
      <a href="index.html">열람실</a>
      <a href="pages/dashboard.html">작업대</a>
      <a href="pages/kanban.html">공정 보드</a>
      <a href="pages/inbox.html">편지함</a>
      <a href="pages/product.html">상점</a>
      <a href="pages/pricing.html">회원 안내</a>
    </nav>
    <div class="navbar__tools">
      <button class="navbar__search" type="button" data-command-open aria-label="표본 찾기 (⌘K)"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5L21 21"/></svg><span>표본 찾기</span><kbd>⌘K</kbd></button>
      <button class="navbar__btn theme-toggle" type="button" data-theme-toggle aria-pressed="false" aria-label="밤 순찰 화면으로 바꾸기"><svg class="icon icon-moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/></svg><svg class="icon icon-sun" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M5.3 18.7l1.8-1.8M16.9 7.1l1.8-1.8"/></svg></button>
      <button class="navbar__btn navbar__menu" type="button" data-drawer-open="nav-drawer" aria-expanded="false" aria-label="서랍 열기"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="4" width="17" height="16"/><path d="M3.5 12h17M10 8h4M10 16h4"/></svg></button>
    </div>
  </div>
  <div class="ruler navbar__ruler" data-cm="auto" aria-hidden="true"></div>
</header>
```

### 1-B. navbar — pages/*.html
```html
<header class="navbar">
  <div class="navbar__inner">
    <a class="navbar__brand" href="../index.html" aria-label="들메식물표본관 열람실 첫 화면">
      <svg class="flora navbar__leaf" viewBox="0 0 40 40"  aria-hidden="true"><path d="M6 36 C14 28 22 18 34 6"/>
  <path d="M11.3 30.4 q-1 -9 -9 -11 q1 8 9 11z"/>
  <path d="M11.3 30.4 q9 1 11 9 q-8 -1 -11 -9z"/>
  <path d="M16.4 24.9 q-1 -9 -9 -11 q1 8 9 11z"/>
  <path d="M16.4 24.9 q9 1 11 9 q-8 -1 -11 -9z"/>
  <path d="M21.8 18.8 q-1 -9 -9 -11 q1 8 9 11z"/>
  <path d="M21.8 18.8 q9 1 11 9 q-8 -1 -11 -9z"/>
  <path d="M34 6 q-7 0 -9 6 q7 1 9 -6z"/></svg>
      <span class="navbar__name">들메식물표본관</span><span class="navbar__code sc">DMH</span>
    </a>
    <nav class="navbar__links" aria-label="주 메뉴">
      <a href="../index.html">열람실</a>
      <a href="dashboard.html">작업대</a>
      <a href="kanban.html">공정 보드</a>
      <a href="inbox.html">편지함</a>
      <a href="product.html">상점</a>
      <a href="pricing.html">회원 안내</a>
    </nav>
    <div class="navbar__tools">
      <button class="navbar__search" type="button" data-command-open aria-label="표본 찾기 (⌘K)"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5L21 21"/></svg><span>표본 찾기</span><kbd>⌘K</kbd></button>
      <button class="navbar__btn theme-toggle" type="button" data-theme-toggle aria-pressed="false" aria-label="밤 순찰 화면으로 바꾸기"><svg class="icon icon-moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/></svg><svg class="icon icon-sun" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M5.3 18.7l1.8-1.8M16.9 7.1l1.8-1.8"/></svg></button>
      <button class="navbar__btn navbar__menu" type="button" data-drawer-open="nav-drawer" aria-expanded="false" aria-label="서랍 열기"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="4" width="17" height="16"/><path d="M3.5 12h17M10 8h4M10 16h4"/></svg></button>
    </div>
  </div>
  <div class="ruler navbar__ruler" data-cm="auto" aria-hidden="true"></div>
</header>
```
- ≤1180px: 검색이 아이콘 버튼으로 줄어든다. ≤1023px: 링크가 숨고 "서랍"(44px) 버튼이 1-C 드로어를 연다.
- 축척자 숫자는 app.js가 폭에 맞춰 채운다(`data-cm="auto"`).

### 1-C. 서랍 드로어 (모바일 내비) — `</main>` 뒤, body 끝
index.html:
```html
<div class="drawer drawer--left" id="nav-drawer" role="dialog" aria-modal="true" aria-labelledby="nav-drawer-title" hidden>
  <div class="drawer__glassine" data-close></div>
  <section class="drawer__panel">
    <header class="drawer__head">
      <div><p class="drawer__kicker">들메식물표본관 <span class="sc">DMH</span></p><h2 class="drawer__title" id="nav-drawer-title">서랍</h2></div>
      <button class="btn btn--icon" type="button" data-close aria-label="서랍 닫기"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button>
    </header>
    <div class="drawer__body">
      <nav class="navlist" aria-label="주 메뉴(모바일)">
        <a href="index.html">열람실</a>
        <a href="pages/dashboard.html">작업대</a>
        <a href="pages/kanban.html">공정 보드</a>
        <a href="pages/inbox.html">편지함</a>
        <a href="pages/product.html">상점</a>
        <a href="pages/pricing.html">회원 안내</a>
      </nav>
    </div>
  </section>
</div>
```
pages/*.html (작업 도구 서랍 탭을 함께 담는다 — 사이드바 없는 화면에서도 같은 블록을 쓴다):
```html
<div class="drawer drawer--left" id="nav-drawer" role="dialog" aria-modal="true" aria-labelledby="nav-drawer-title" hidden>
  <div class="drawer__glassine" data-close></div>
  <section class="drawer__panel">
    <header class="drawer__head">
      <div><p class="drawer__kicker">들메식물표본관 <span class="sc">DMH</span></p><h2 class="drawer__title" id="nav-drawer-title">서랍</h2></div>
      <button class="btn btn--icon" type="button" data-close aria-label="서랍 닫기"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button>
    </header>
    <div class="drawer__body">
      <nav class="navlist" aria-label="주 메뉴(모바일)">
        <a href="../index.html">열람실</a>
        <a href="dashboard.html">작업대</a>
        <a href="kanban.html">공정 보드</a>
        <a href="inbox.html">편지함</a>
        <a href="product.html">상점</a>
        <a href="pricing.html">회원 안내</a>
      </nav>
      <p class="navlist__sub">작업 도구 서랍</p>
      <nav class="drawers" aria-label="서랍 색인(모바일)"><div class="drawers__list">
        <a class="drawers__tab" href="dashboard.html"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 9h18M5 9v11M19 9v11M7 9V5h10v4"/></svg><span class="drawers__label">작업대</span></a>
        <a class="drawers__tab" href="kanban.html"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="5" height="16"/><rect x="10" y="4" width="5" height="10"/><rect x="17" y="4" width="4" height="13"/></svg><span class="drawers__label">공정</span><span class="count">63</span></a>
        <a class="drawers__tab" href="inbox.html"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14"/><path d="M3 6l9 7 9-7"/></svg><span class="drawers__label">편지</span><span class="count">8</span></a>
        <a class="drawers__tab" href="../index.html#ledger"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3z"/><path d="M5 17a3 3 0 0 1 3-3h11"/></svg><span class="drawers__label">대장</span></a>
        <a class="drawers__tab" href="product.html"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8h16l-1.5 12h-13z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg><span class="drawers__label">상점</span></a>
        <a class="drawers__tab" href="settings.html"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1"/></svg><span class="drawers__label">설정</span></a>
      </div></nav>
    </div>
  </section>
</div>
```

### 1-D. 표본 찾기(⌘K) — body 끝, 화면마다 1개
index.html:
```html
<div class="cmd" id="cmd" role="dialog" aria-modal="true" aria-label="표본 찾기" hidden>
  <div class="cmd__glassine" data-close></div>
  <div class="cmd__box">
    <div class="cmd__bar"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5L21 21"/></svg><input class="cmd__input" type="text" placeholder="국명 · 학명 · 수장번호 · 채집인" aria-label="표본 찾기" autocomplete="off"><kbd class="cmd__esc">Esc</kbd></div>
    <div class="cmd__list">
      <div class="cmd__section"><p class="cmd__group">표본 · 수장 대장</p>
        <a class="cmd__item" href="index.html#ledger" data-search="참당귀 Angelica gigas DMH-024171 DMH024171"><span class="cmd__name">참당귀</span><i class="binomial">Angelica gigas</i><span class="cmd__no">DMH-024171</span></a>
        <a class="cmd__item" href="index.html#ledger" data-search="둥근이질풀 Geranium koreanum DMH-024168 DMH024168"><span class="cmd__name">둥근이질풀</span><i class="binomial">Geranium koreanum</i><span class="cmd__no">DMH-024168</span></a>
        <a class="cmd__item" href="index.html#ledger" data-search="물봉선 Impatiens textorii DMH-024166 DMH024166"><span class="cmd__name">물봉선</span><i class="binomial">Impatiens textorii</i><span class="cmd__no">DMH-024166</span></a>
        <a class="cmd__item" href="index.html#ledger" data-search="금강초롱꽃 Hanabusaya asiatica DMH-024163 DMH024163"><span class="cmd__name">금강초롱꽃</span><i class="binomial">Hanabusaya asiatica</i><span class="cmd__no">DMH-024163</span></a>
        <a class="cmd__item" href="index.html#ledger" data-search="동자꽃 Lychnis cognata DMH-024159 DMH024159"><span class="cmd__name">동자꽃</span><i class="binomial">Lychnis cognata</i><span class="cmd__no">DMH-024159</span></a>
        <a class="cmd__item" href="index.html#ledger" data-search="투구꽃 Aconitum jaluense DMH-024155 DMH024155"><span class="cmd__name">투구꽃</span><i class="binomial">Aconitum jaluense</i><span class="cmd__no">DMH-024155</span></a>
        <a class="cmd__item" href="index.html#ledger" data-search="산오이풀 Sanguisorba hakusanensis DMH-024150 DMH024150"><span class="cmd__name">산오이풀</span><i class="binomial">Sanguisorba hakusanensis</i><span class="cmd__no">DMH-024150</span></a>
        <a class="cmd__item" href="index.html#ledger" data-search="노루오줌 Astilbe rubra DMH-024138 DMH024138"><span class="cmd__name">노루오줌</span><i class="binomial">Astilbe rubra</i><span class="cmd__no">DMH-024138</span></a>
        <a class="cmd__item" href="index.html#ledger" data-search="큰앵초 Primula jesoana DMH-024117 DMH024117"><span class="cmd__name">큰앵초</span><i class="binomial">Primula jesoana</i><span class="cmd__no">DMH-024117</span></a>
        <a class="cmd__item" href="index.html#ledger" data-search="모데미풀 Megaleranthis saniculifolia DMH-024096 DMH024096"><span class="cmd__name">모데미풀</span><i class="binomial">Megaleranthis saniculifolia</i><span class="cmd__no">DMH-024096</span></a>
        <a class="cmd__item" href="index.html#ledger" data-search="얼레지 Erythronium japonicum DMH-024041 DMH024041"><span class="cmd__name">얼레지</span><i class="binomial">Erythronium japonicum</i><span class="cmd__no">DMH-024041</span></a>
        <a class="cmd__item" href="index.html#ledger" data-search="들메나무 Fraxinus mandshurica DMH-000001 DMH000001"><span class="cmd__name">들메나무</span><i class="binomial">Fraxinus mandshurica</i><span class="cmd__no">DMH-000001</span></a>
      </div>
      <div class="cmd__section"><p class="cmd__group">채집인 · 사람</p>
        <a class="cmd__item" href="pages/profile.html" data-search="서연우 DC3-014 시민 채집단 3기 · 채집번호 412번까지"><span class="cmd__name">서연우</span><span class="cmd__desc">시민 채집단 3기 · 채집번호 412번까지</span><span class="cmd__no">DC3-014</span></a>
        <a class="cmd__item" href="pages/settings.html" data-search="윤하람 DC3-061 시민 채집단 3기 · 8/26 가입"><span class="cmd__name">윤하람</span><span class="cmd__desc">시민 채집단 3기 · 8/26 가입</span><span class="cmd__no">DC3-061</span></a>
        <a class="cmd__item" href="pages/inbox.html" data-search="문해솔 — 관장 · 수석 큐레이터 · det. 서명"><span class="cmd__name">문해솔</span><span class="cmd__desc">관장 · 수석 큐레이터 · det. 서명</span><span class="cmd__no">—</span></a>
      </div>
      <div class="cmd__section"><p class="cmd__group">화면</p>
        <a class="cmd__item" href="index.html" data-search="열람실 표본 대지 규정 · 2026년 개정판 index"><span class="cmd__name">열람실</span><span class="cmd__desc">표본 대지 규정 · 2026년 개정판</span></a>
        <a class="cmd__item" href="pages/dashboard.html" data-search="작업대 백도윤의 작업대 · 오늘 손볼 대지 dashboard"><span class="cmd__name">작업대</span><span class="cmd__desc">백도윤의 작업대 · 오늘 손볼 대지</span></a>
        <a class="cmd__item" href="pages/kanban.html" data-search="공정 보드 공정 중 63점 · 6단계 kanban"><span class="cmd__name">공정 보드</span><span class="cmd__desc">공정 중 63점 · 6단계</span></a>
        <a class="cmd__item" href="pages/inbox.html" data-search="편지함 8통 · 대출 신청 LN-2026-031 inbox"><span class="cmd__name">편지함</span><span class="cmd__desc">8통 · 대출 신청 LN-2026-031</span></a>
        <a class="cmd__item" href="pages/product.html" data-search="상점 들메 오동나무 야외 압착기 ₩68,000 product"><span class="cmd__name">상점</span><span class="cmd__desc">들메 오동나무 야외 압착기 ₩68,000</span></a>
        <a class="cmd__item" href="pages/pricing.html" data-search="회원 안내 열람 무료 · 채집단 연 ₩48,000 pricing"><span class="cmd__name">회원 안내</span><span class="cmd__desc">열람 무료 · 채집단 연 ₩48,000</span></a>
        <a class="cmd__item" href="pages/profile.html" data-search="채집인 서연우 DC3-014 · 금강초롱꽃 채집인 profile"><span class="cmd__name">채집인 서연우</span><span class="cmd__desc">DC3-014 · 금강초롱꽃 채집인</span></a>
        <a class="cmd__item" href="pages/onboarding.html" data-search="채집단 첫걸음 윤하람 DC3-061 · 4단계 onboarding"><span class="cmd__name">채집단 첫걸음</span><span class="cmd__desc">윤하람 DC3-061 · 4단계</span></a>
        <a class="cmd__item" href="pages/settings.html" data-search="회원 설정 야장 단위 · 공개 범위 · 화면 settings"><span class="cmd__name">회원 설정</span><span class="cmd__desc">야장 단위 · 공개 범위 · 화면</span></a>
        <a class="cmd__item" href="pages/404.html" data-search="빈 대지 이 대지는 아직 비어 있습니다 404"><span class="cmd__name">빈 대지</span><span class="cmd__desc">이 대지는 아직 비어 있습니다</span></a>
      </div>
    </div>
    <p class="cmd__empty" hidden>“<span data-cmd-query></span>”에 맞는 표본이 없습니다. 국명·학명·수장번호로 찾아 보세요.</p>
    <footer class="cmd__foot"><span><kbd>↑</kbd><kbd>↓</kbd> 이동</span><span><kbd>Enter</kbd> 열기</span><span><kbd>Esc</kbd> 닫기</span></footer>
  </div>
</div>
```
pages/*.html: 링크만 다르다.
```html
<div class="cmd" id="cmd" role="dialog" aria-modal="true" aria-label="표본 찾기" hidden>
  <div class="cmd__glassine" data-close></div>
  <div class="cmd__box">
    <div class="cmd__bar"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5L21 21"/></svg><input class="cmd__input" type="text" placeholder="국명 · 학명 · 수장번호 · 채집인" aria-label="표본 찾기" autocomplete="off"><kbd class="cmd__esc">Esc</kbd></div>
    <div class="cmd__list">
      <div class="cmd__section"><p class="cmd__group">표본 · 수장 대장</p>
        <a class="cmd__item" href="../index.html#ledger" data-search="참당귀 Angelica gigas DMH-024171 DMH024171"><span class="cmd__name">참당귀</span><i class="binomial">Angelica gigas</i><span class="cmd__no">DMH-024171</span></a>
        <a class="cmd__item" href="../index.html#ledger" data-search="둥근이질풀 Geranium koreanum DMH-024168 DMH024168"><span class="cmd__name">둥근이질풀</span><i class="binomial">Geranium koreanum</i><span class="cmd__no">DMH-024168</span></a>
        <a class="cmd__item" href="../index.html#ledger" data-search="물봉선 Impatiens textorii DMH-024166 DMH024166"><span class="cmd__name">물봉선</span><i class="binomial">Impatiens textorii</i><span class="cmd__no">DMH-024166</span></a>
        <a class="cmd__item" href="../index.html#ledger" data-search="금강초롱꽃 Hanabusaya asiatica DMH-024163 DMH024163"><span class="cmd__name">금강초롱꽃</span><i class="binomial">Hanabusaya asiatica</i><span class="cmd__no">DMH-024163</span></a>
        <a class="cmd__item" href="../index.html#ledger" data-search="동자꽃 Lychnis cognata DMH-024159 DMH024159"><span class="cmd__name">동자꽃</span><i class="binomial">Lychnis cognata</i><span class="cmd__no">DMH-024159</span></a>
        <a class="cmd__item" href="../index.html#ledger" data-search="투구꽃 Aconitum jaluense DMH-024155 DMH024155"><span class="cmd__name">투구꽃</span><i class="binomial">Aconitum jaluense</i><span class="cmd__no">DMH-024155</span></a>
        <a class="cmd__item" href="../index.html#ledger" data-search="산오이풀 Sanguisorba hakusanensis DMH-024150 DMH024150"><span class="cmd__name">산오이풀</span><i class="binomial">Sanguisorba hakusanensis</i><span class="cmd__no">DMH-024150</span></a>
        <a class="cmd__item" href="../index.html#ledger" data-search="노루오줌 Astilbe rubra DMH-024138 DMH024138"><span class="cmd__name">노루오줌</span><i class="binomial">Astilbe rubra</i><span class="cmd__no">DMH-024138</span></a>
        <a class="cmd__item" href="../index.html#ledger" data-search="큰앵초 Primula jesoana DMH-024117 DMH024117"><span class="cmd__name">큰앵초</span><i class="binomial">Primula jesoana</i><span class="cmd__no">DMH-024117</span></a>
        <a class="cmd__item" href="../index.html#ledger" data-search="모데미풀 Megaleranthis saniculifolia DMH-024096 DMH024096"><span class="cmd__name">모데미풀</span><i class="binomial">Megaleranthis saniculifolia</i><span class="cmd__no">DMH-024096</span></a>
        <a class="cmd__item" href="../index.html#ledger" data-search="얼레지 Erythronium japonicum DMH-024041 DMH024041"><span class="cmd__name">얼레지</span><i class="binomial">Erythronium japonicum</i><span class="cmd__no">DMH-024041</span></a>
        <a class="cmd__item" href="../index.html#ledger" data-search="들메나무 Fraxinus mandshurica DMH-000001 DMH000001"><span class="cmd__name">들메나무</span><i class="binomial">Fraxinus mandshurica</i><span class="cmd__no">DMH-000001</span></a>
      </div>
      <div class="cmd__section"><p class="cmd__group">채집인 · 사람</p>
        <a class="cmd__item" href="profile.html" data-search="서연우 DC3-014 시민 채집단 3기 · 채집번호 412번까지"><span class="cmd__name">서연우</span><span class="cmd__desc">시민 채집단 3기 · 채집번호 412번까지</span><span class="cmd__no">DC3-014</span></a>
        <a class="cmd__item" href="settings.html" data-search="윤하람 DC3-061 시민 채집단 3기 · 8/26 가입"><span class="cmd__name">윤하람</span><span class="cmd__desc">시민 채집단 3기 · 8/26 가입</span><span class="cmd__no">DC3-061</span></a>
        <a class="cmd__item" href="inbox.html" data-search="문해솔 — 관장 · 수석 큐레이터 · det. 서명"><span class="cmd__name">문해솔</span><span class="cmd__desc">관장 · 수석 큐레이터 · det. 서명</span><span class="cmd__no">—</span></a>
      </div>
      <div class="cmd__section"><p class="cmd__group">화면</p>
        <a class="cmd__item" href="../index.html" data-search="열람실 표본 대지 규정 · 2026년 개정판 index"><span class="cmd__name">열람실</span><span class="cmd__desc">표본 대지 규정 · 2026년 개정판</span></a>
        <a class="cmd__item" href="dashboard.html" data-search="작업대 백도윤의 작업대 · 오늘 손볼 대지 dashboard"><span class="cmd__name">작업대</span><span class="cmd__desc">백도윤의 작업대 · 오늘 손볼 대지</span></a>
        <a class="cmd__item" href="kanban.html" data-search="공정 보드 공정 중 63점 · 6단계 kanban"><span class="cmd__name">공정 보드</span><span class="cmd__desc">공정 중 63점 · 6단계</span></a>
        <a class="cmd__item" href="inbox.html" data-search="편지함 8통 · 대출 신청 LN-2026-031 inbox"><span class="cmd__name">편지함</span><span class="cmd__desc">8통 · 대출 신청 LN-2026-031</span></a>
        <a class="cmd__item" href="product.html" data-search="상점 들메 오동나무 야외 압착기 ₩68,000 product"><span class="cmd__name">상점</span><span class="cmd__desc">들메 오동나무 야외 압착기 ₩68,000</span></a>
        <a class="cmd__item" href="pricing.html" data-search="회원 안내 열람 무료 · 채집단 연 ₩48,000 pricing"><span class="cmd__name">회원 안내</span><span class="cmd__desc">열람 무료 · 채집단 연 ₩48,000</span></a>
        <a class="cmd__item" href="profile.html" data-search="채집인 서연우 DC3-014 · 금강초롱꽃 채집인 profile"><span class="cmd__name">채집인 서연우</span><span class="cmd__desc">DC3-014 · 금강초롱꽃 채집인</span></a>
        <a class="cmd__item" href="onboarding.html" data-search="채집단 첫걸음 윤하람 DC3-061 · 4단계 onboarding"><span class="cmd__name">채집단 첫걸음</span><span class="cmd__desc">윤하람 DC3-061 · 4단계</span></a>
        <a class="cmd__item" href="settings.html" data-search="회원 설정 야장 단위 · 공개 범위 · 화면 settings"><span class="cmd__name">회원 설정</span><span class="cmd__desc">야장 단위 · 공개 범위 · 화면</span></a>
        <a class="cmd__item" href="404.html" data-search="빈 대지 이 대지는 아직 비어 있습니다 404"><span class="cmd__name">빈 대지</span><span class="cmd__desc">이 대지는 아직 비어 있습니다</span></a>
      </div>
    </div>
    <p class="cmd__empty" hidden>“<span data-cmd-query></span>”에 맞는 표본이 없습니다. 국명·학명·수장번호로 찾아 보세요.</p>
    <footer class="cmd__foot"><span><kbd>↑</kbd><kbd>↓</kbd> 이동</span><span><kbd>Enter</kbd> 열기</span><span><kbd>Esc</kbd> 닫기</span></footer>
  </div>
</div>
```
- 열기: ⌘K / Ctrl+K, `[data-command-open]` 버튼(navbar에 이미 있음). 필터는 `data-search` 문자열 기준(하이픈·공백 무시).
- 링크 대신 동작이 필요한 항목은 `<button class="cmd__item" type="button" data-toast-title="…" data-toast-text="…">`.

### 1-E. 서랍 색인 sidebar — 직원 셸(dashboard · kanban · inbox)에서만
```html
<nav class="drawers" aria-label="서랍 색인">
  <div class="drawers__list">
    <a class="drawers__tab" href="dashboard.html"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 9h18M5 9v11M19 9v11M7 9V5h10v4"/></svg><span class="drawers__label">작업대</span></a>
    <a class="drawers__tab" href="kanban.html"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="5" height="16"/><rect x="10" y="4" width="5" height="10"/><rect x="17" y="4" width="4" height="13"/></svg><span class="drawers__label">공정</span><span class="count">63</span></a>
    <a class="drawers__tab" href="inbox.html"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14"/><path d="M3 6l9 7 9-7"/></svg><span class="drawers__label">편지</span><span class="count">8</span></a>
    <a class="drawers__tab" href="../index.html#ledger"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3z"/><path d="M5 17a3 3 0 0 1 3-3h11"/></svg><span class="drawers__label">대장</span></a>
    <a class="drawers__tab" href="product.html"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8h16l-1.5 12h-13z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg><span class="drawers__label">상점</span></a>
    <a class="drawers__tab" href="settings.html"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1"/></svg><span class="drawers__label">설정</span></a>
  </div>
  <div class="drawers__foot"><a href="profile.html"><span class="avatar avatar--sm avatar--sap" aria-hidden="true">백</span><span>백도윤<br>표본 관리사</span></a></div>
</nav>
```
- 폭 88px, 한글 세로쓰기. 활성 탭은 manila 면이 작업 영역 쪽으로 12px 튀어나온다. ≤1023px에서 자동으로 숨는다(1-C 드로어가 대신).
- `.count`는 팩트 시트 값(공정 63 · 편지 8)만.

### 1-F. footer
index.html:
```html
<footer class="site-foot">
  <div class="site-foot__band">
    <div class="site-foot__id"><span class="barcode barcode--sm" data-code="DMH000001"></span><b>DMH · 들메식물표본관</b></div>
    <p class="site-foot__addr">강원특별자치도 인제군 기린면 곰배령길 212 · 열람실 화–토 09:30–17:30 · 033-463-0417</p>
    <div class="site-foot__tools"><span class="checker checker--sm" aria-hidden="true"></span><button class="navbar__btn theme-toggle" type="button" data-theme-toggle aria-pressed="false" aria-label="밤 순찰 화면으로 바꾸기"><svg class="icon icon-moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/></svg><svg class="icon icon-sun" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M5.3 18.7l1.8-1.8M16.9 7.1l1.8-1.8"/></svg></button></div>
  </div>
  <nav class="site-foot__links" aria-label="화면 목록">
    <a href="index.html">열람실</a>
    <a href="pages/dashboard.html">작업대</a>
    <a href="pages/kanban.html">공정 보드</a>
    <a href="pages/inbox.html">편지함</a>
    <a href="pages/product.html">상점</a>
    <a href="pages/pricing.html">회원 안내</a>
    <a href="pages/profile.html">채집인 서연우</a>
    <a href="pages/onboarding.html">채집단 첫걸음</a>
    <a href="pages/settings.html">회원 설정</a>
    <a href="pages/404.html">빈 대지</a>
  </nav>
</footer>
```
pages/*.html:
```html
<footer class="site-foot">
  <div class="site-foot__band">
    <div class="site-foot__id"><span class="barcode barcode--sm" data-code="DMH000001"></span><b>DMH · 들메식물표본관</b></div>
    <p class="site-foot__addr">강원특별자치도 인제군 기린면 곰배령길 212 · 열람실 화–토 09:30–17:30 · 033-463-0417</p>
    <div class="site-foot__tools"><span class="checker checker--sm" aria-hidden="true"></span><button class="navbar__btn theme-toggle" type="button" data-theme-toggle aria-pressed="false" aria-label="밤 순찰 화면으로 바꾸기"><svg class="icon icon-moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/></svg><svg class="icon icon-sun" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M5.3 18.7l1.8-1.8M16.9 7.1l1.8-1.8"/></svg></button></div>
  </div>
  <nav class="site-foot__links" aria-label="화면 목록">
    <a href="../index.html">열람실</a>
    <a href="dashboard.html">작업대</a>
    <a href="kanban.html">공정 보드</a>
    <a href="inbox.html">편지함</a>
    <a href="product.html">상점</a>
    <a href="pricing.html">회원 안내</a>
    <a href="profile.html">채집인 서연우</a>
    <a href="onboarding.html">채집단 첫걸음</a>
    <a href="settings.html">회원 설정</a>
    <a href="404.html">빈 대지</a>
  </nav>
</footer>
```
- 현재 화면 링크에 `aria-current="page"`. 정의 목록·판권 블록으로 바꾸지 않는다.

---

## 2. 장면 CSS에서 쓰는 의미 토큰 (semantic.css)

| 무리 | 토큰 |
|---|---|
| 면 | `--desk`(작업대) `--desk-deep`(라이트 테이블·사이드바) `--sheet`(대지) `--label`(라벨·입력) `--folder` `--folder-edge`(manila) `--glassine` `--glassine-fiber` `--tape` `--tape-edge` `--tape-fiber` |
| 잉크 | `--ink` `--ink-2` `--ink-3`(캡션) `--hairline`(장식 괘선, 텍스트·입력 테두리 금지) `--rule`(입력 테두리·표 머리) `--pencil` |
| 주색 | `--sap` `--sap-press` `--sap-tint` `--on-sap` · 2차색 `--stamp` `--stamp-tint` `--stamp-blend` |
| 포커스·현재 | `--focus` `--current` `--current-on` (낮=녹, 밤=작업등 `#F0C060` — 면 채움 금지, 표시선·링에만) |
| 상태 | `--ok` `--warn` `--danger` `--info` `--violet` · 옅은 면 `--ok-tint` `--warn-tint` `--info-tint` `--danger-tint` |
| 지역 폴더색 | `--region-gangwon` `--region-gyeongsang` `--region-jeolla` `--region-jeju` `--region-gyeonggi` · 아바타 글자 `--avatar-on` |
| 세밀화 | `--flora-line` `--flora-vein` `--flora-petal` `--flora-petal-fill`(보라) `--flora-petal-red` `--flora-petal-amber` |
| 히트맵·차트 | `--heat-0`~`--heat-4`(잎 녹 4단계) `--heat-on-low` `--heat-on-high` · 보정표 `--checker-frame` `--checker-1..3` |
| 그림자 | `--shadow-sheet`(대지) `--shadow-sheet-lift`(들기) `--shadow-raised`(모달·드로어) — 대지 외에는 그림자 없음 |
| 결 | `--sheet-grain`(대지 면에만) |

원시 토큰(tokens.css) 중 장면에서 써도 되는 것: 간격 `--sp-1..9`(4·8·12·16·24·32·48·72·112), 폰트 `--font-name/latin/latin-sc/record/ui/num/pencil`, 크기 `--t-*`, 모션 `--dur-*` `--ease-paper` `--ease-stamp`, 치수 `--cm`(28px) `--nav-h` `--side-w` `--tab-h` `--touch`(44px) `--grid-margin` `--grid-gutter`. 색 원시값(`--c-*`, `--leaf-*`)은 쓰지 않는다.

차트(월별 채집 선 차트·지역 막대·개화 히트맵)는 장면 CSS에서 그린다: 선은 `--sap`, 범주는 지역 폴더색 + **직접 라벨**, 히트맵 칸은 `--heat-1..4` + 칸 안 기호 ○◐●. SVG presentation attribute에 `var()` 금지 → `style="stroke:var(--sap)"` 또는 `currentColor`.

---

## 3. 레이아웃 (base.css)

### 작업대 · 그리드
```html
<section class="section">                  <!-- 위아래 112px(모바일 72px) -->
  <div class="bench">                       <!-- 최대 1344 + 좌우 48/32/16px. .bench--narrow(1040) .bench--wide(제한 없음) -->
    <div class="grid">                      <!-- 12단 · 거터 24 / ≤1024 8단 / ≤640 4단(전부 전폭) -->
      <div class="span-6">…</div>
      <div class="span-5 start-8">…</div>  <!-- 시작 칸: start-2…start-9 는 span-N 과 함께 -->
    </div>
  </div>
</section>
```
- ≤1024: span 1–2→2, 3–7→4(반폭), 8–11→전폭. 태블릿에서 전폭으로 키우려면 `.t-wide`. ≤640: 전부 전폭, `.m-half`만 반폭.
- `.grid--stretch`(칸 높이 맞춤 — 벽보형 빈칸 방지), `.grid--end`.
- **섹션마다 폭·분할을 바꾼다**(DIRECTION 9절). 같은 `bench + grid 6/6` 반복 금지.
- 흐름 도우미: `.stack`(세로 24) `.stack--sm`(12) `.stack--lg`(48) · `.cluster`(가로 줄바꿈 12) · `.split`(양끝).
- `.desk-deep` — 한 톤 어두운 전폭 띠(라이트 테이블, 서랍 앞판).

### 대지 · 폴더 탭 패널
```html
<div class="sheet">…</div>                              <!-- 대지: radius 0, 그림자 1종, 결 4 %. 패딩 32(모바일 16) -->
<div class="sheet sheet--specimen sheet--mount">…</div>  <!-- 29:42 규격 + 마운팅 여백 7 % (부모 폭 기준) -->
<section class="panel" aria-labelledby="p-ledger">
  <h2 class="ftab" id="p-ledger">수장 대장 <span class="sc">Registrum</span> <span class="ftab__count">24,117</span></h2>
  <div class="sheet">…</div>
</section>
```
- 수식: `.sheet--flat`(그림자 없음) `.sheet--bare`(패딩 0).
- 회전·겹침(데스크톱만, 모바일에서 자동 해제): `.tilt-l`(−1.2°) `.tilt-l-sm`(−0.6°) `.tilt-r`(+0.8°) `.tilt-r-sm`(+0.4°) · `.overlap-l` `.overlap-r`(−36px) `.overlap-t`(−32px). 회전 대지 안의 입력 요소는 회전 없는 형제 레이어에 둔다.
- 섹션 제목은 **항상 폴더 탭**(`.ftab`). 가운데정렬 "라벨→제목→부제" 헤더, eyebrow, "§ 번호" 금지. 메타(이름·번호·날짜·상태)는 블록 **우하단 라벨**로.

### 앱 셸 (pages)
`.app` = 그리드(nav / side + work / foot). `.work`는 작업 영역 패딩(48 위 · 좌우 `--grid-margin` · 112 아래). ≤1023 사이드바 숨김.

### 가로 스크롤 힌트
`<div class="scroll-x" data-scroll-hint>` — app.js가 넘침을 재서 `data-more="start|end|both"`를 달고 CSS가 가장자리를 페이드한다. 탭 줄·분류 경로·넓은 표·칸반에 쓴다.

---

## 4. 시그니처 사물 (base.css)

### 활자 클래스 — 세 목소리를 섞지 않는다
| 클래스 | 쓰임 |
|---|---|
| `.t-specimen` (Song Myung 96/52) · `.t-display` (60/38) · `h1/.t-h1` (40/30) · `.t-name` | **국명**(한글 식물 이름)과 화면 대제목 |
| `.binomial` / `.t-binomial-xl` + `<span class="auth">명명자</span>` | **학명**(라틴 이탤릭만). 한글 이탤릭 금지 |
| `h2/.t-h2` · `h3/.t-h3` · `.t-ui` · `.t-small` · `.t-field` | 라벨 프린터 고딕(UI·데이터) |
| `.record` / `.t-record` (Gowun Batang 17/1.75) | 채집 기록·서식지·안내 글 |
| `.id` (Cutive Mono) · `.fig` (Noto Sans KR + tabular-nums, 자간 0, 크기는 문장을 따름) · `.num-xl` (Gowun Batang 700 라이닝 숫자 72/48, `--font-figure`) + `.unit` | `.id` = 수장번호(DMH-)·대출(LN-)·회원(DC·DR-)·작업(WK-)·주문(DM-)·좌표·hex·코드 키만. `.fig` = 문장·표 속 개수·날짜·시각·온도·금액·해발. **Cutive Mono는 한글에 쓰지 않음** — `50매` `(금)`처럼 한글이 섞인 값은 `.fig`. 구 `.num`은 `.id`의 별칭으로만 남김 |
| `.sc` (Fell SC, 자간 .08em) | `HERBARIUM DEULME` `DET.` 같은 라틴 대문자 라벨. **한글 섞인 라벨에 쓰지 않음** |
| `.pencil` (Hi Melody 22/20) | 채집인 연필 메모 — **화면당 3곳 이하**, 정보 전달 필수 문구 금지 |
| `.muted` `.faint` `.nowrap` `.tabular` | 보조 |

대형 수치: `<p class="num-xl">24,117<span class="unit">점</span></p>`.

### 표본 라벨 `.label` (시그니처 ①)
대표 라벨(팩트 시트 글자 그대로):
```html
<div class="label">
  <p class="label__head"><span>들메식물표본관</span><span class="sc">Herbarium Deulme (DMH)</span></p>
  <p class="label__binomial">Hanabusaya asiatica <span class="auth">(Nakai) Nakai</span></p>
  <p class="label__name">금강초롱꽃 <small>초롱꽃과 <span class="sc">Campanulaceae</span></small></p>
  <dl class="label__fields">
    <div class="label__f label__f--wide"><dt class="label__k">산지</dt><dd class="label__v">강원특별자치도 인제군 기린면 진동리, 곰배령 북사면</dd></div>
    <div class="label__f label__f--wide"><dt class="label__k">좌표 · 해발</dt><dd class="label__v id">N 37°56′12″ E 128°28′40″ · 1,042 m</dd></div>
    <div class="label__f label__f--wide"><dt class="label__k">서식</dt><dd class="label__v label__v--record">신갈나무 숲 아래 반그늘, 습한 부엽토 사면. 꽃 5송이, 개체군 약 40포기.</dd></div>
    <div class="label__f"><dt class="label__k">채집</dt><dd class="label__v">2026. 8. 21. (금)</dd></div>
    <div class="label__f"><dt class="label__k">채집인</dt><dd class="label__v">서연우 <span class="fig">412</span></dd></div>
    <div class="label__f"><dt class="label__k">동정</dt><dd class="label__v">det. 문해솔 2026. 8. 25.</dd></div>
    <div class="label__f"><dt class="label__k">수장번호</dt><dd class="label__v id">DMH-024163</dd></div>
  </dl>
</div>
```
- 머리줄은 항상 `들메식물표본관` + `<span class="sc">Herbarium Deulme (DMH)</span>`. 필드 = `.label__f` > `dt.label__k`(11px) + `dd.label__v`. 넓은 필드 `.label__f--wide`. 기록 문장 `.label__v--record`. 하단 서명줄 `.label__foot`.
- 변형: `.label--compact`(카드용, 필드 2개, 머리줄 생략 가능) · `.label--vertical`(세로쓰기 국명, 칸반·404) — `<span class="label label--vertical">금강초롱꽃</span>`.
- 라벨은 **컨테이너 쿼리**로 폭 250px 이하에서 필드를 1단으로 접는다 → 라벨은 폭이 정해진 자리(그리드 칸, flex 늘림, `width` 지정, 절대배치 + `width`)에 둔다. 내용으로 폭이 정해지는 inline-block·float 금지(폭 0이 된다).
- 동정 쪽지(det. slip)는 `.slip`(5절 alert).
- 우하단 앵커: 대지 위에서 라벨은 `position:absolute; right; bottom; width: 42%`(표지 236px) 또는 그리드 끝 칸. 모바일은 그림 아래 −24px 겹침.

### 린넨 테이프 `.tape`
```html
<div class="sheet" style="position:relative">            <!-- 부모는 position: relative -->
  <span class="tape" style="--x:46%;--y:44%;--r:-4deg;--w:64px"></span>
  <span class="tape tape--tl"></span><span class="tape tape--tr"></span>   <!-- 위 가장자리 좌·우 프리셋 -->
  <span class="tape tape--sm tape--tc"></span>             <!-- 소형(10px) 가운데 -->
</div>
```
- `--x`(가운데 기준 가로 위치) `--y`(위에서) `--w`(56–96px) `--r`(±4° 이내). `.tape--long`(96px). 항상 가로 — 대각선 마스킹테이프 금지. 대지·모달·토스트·드로어·상품 도판·프로필 사진 자리에 2–3개.

### 수장 도장 `.stamp`
```html
<span class="stamp" data-date="2026.08.26"></span>                  <!-- 72px, app.js가 SVG(둘레 글자·날짜)를 그린다 -->
<span class="stamp stamp--sm" data-date="2026.08.26"></span>        <!-- 44px, 가운데 "수장" -->
<span class="stamp stamp--float" data-date="2026.08.26" style="--sx:10%;--sy:22%"></span>  <!-- 부모 우하단 기준 절대배치 -->
```
- 선택 속성: `data-text`(둘레 글자, 기본 "들메식물표본관 · 수장 · 강원 인제 ·"), `data-center`(가운데, 기본 "수장" — 결제 완료면 "결제", 승인이면 "승인"). `aria-label`이 자동으로 붙는다(장식이면 `aria-hidden="true"`).
- **수장 완료·승인·결제 완료에만, 화면당 2개 이하.** 찍는 모션: `DMH.stamp(el)` 또는 `[data-replay="stamp"][data-target="id"]`.

### cm 축척자 `.ruler` (시그니처 ②) — 1cm = 28px
```html
<div class="ruler" data-cm="12"></div>                 <!-- 가로 0–12cm, 눈금이 위 선에서 아래로 -->
<div class="ruler ruler--up" data-cm="auto"></div>    <!-- 아래 선에서 위로(바닥 가장자리) -->
<div class="ruler ruler--v" data-cm="auto" style="height:811px"></div>   <!-- 세로, 대지 오른쪽 가장자리 -->
<div class="ruler ruler--quiet" data-cm="auto"></div> <!-- 옅은 눈금 -->
```
`data-cm="auto"`면 요소 길이만큼, 숫자를 2cm마다 찍으려면 `data-every="2"`. 숫자 span은 app.js가 채운다. 쓰임: navbar 아래 가장자리, progress, range, steps, timeline, 세밀화 옆 치수선.

### 색상 보정표 `.checker`
`<span class="checker" aria-hidden="true"></span>`(16px 칸 12개) · `.checker--sm`(10px) · `.checker--v`(세로). 녹 3 · 지역 5 · 잉크 · rule · 대지 · 도장. 표지 대지 아래, footer, skeleton, 설정의 화면 미리보기.

### 바코드 `.barcode`
`<span class="barcode" data-code="DMH024163"></span>` → Code 128 모양 막대 + 아래 숫자. `.barcode--sm`(20px). 표지 대지 좌상단, 상품, footer.

### 글라신 봉투 `.envelope`
```html
<span class="envelope"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><span class="envelope__cap">씨앗 7알</span></span>
```
84 × 112px, `<i>` 하나가 씨앗 한 알(최대 7). 대지 우상단.

### 치수선 `.dimline`
`<p class="dimline">30 × 44 cm</p>` — 양끝 꺾쇠 + 가운데 숫자(연필색). 세밀화·상품 그림 옆.

### 아바타 `.avatar`
`<span class="avatar avatar--sap" aria-hidden="true">문</span>` + 이름 텍스트를 옆에. 색: `--sap`(문해솔·백도윤·이세린) `--info`(서연우·윤하람) `--violet`(김나래) `--bark`(오태경) `--ochre`(권다온) `--ink`(정민구). 크기 `--sm`(28) 기본 36 `--lg`(56). 사진 금지.

### 세밀화 `.flora`
```html
<svg class="flora" viewBox="0 0 300 600" data-draw aria-hidden="true"> …부록 A 원본… </svg>
```
- 선 굵기는 CSS `--sw`(기본 1.25) — **viewBox 1단위 ≈ 화면 1px**로 그린다(원본은 대지 560px 높이 기준). 축소해서 쓰면 `.flora--mid`(1.8) `.flora--thumb`(2.6) 또는 `style="--sw:2"`로 보정. `vector-effect` 금지(드로잉 모션이 깨짐).
- 부분 클래스: `.vein`(잎맥 .75) `.petal`(보라 면) `.petal--red` `.petal--amber` `.dim`(옅은 선 — 잔뿌리) `.dot`(채운 점). 채색은 꽃잎에만.
- `data-draw`: 화면에 들어오면 1600ms 펜 드로잉(선마다 지연). 다시 그리기 `[data-replay="draw"][data-target="svg-id"]`. 화면당 대표 1–2개에만.
- 그림은 언제나 실제 표본 하나이고 근처에 그 표본의 라벨이나 학명이 있다. 의미 없는 덩굴·곡선 장식 금지.

---

## 5. 컴포넌트 32 (알파벳순)

### accordion — 검색표(분류 열쇠) `components/accordion.css`
```html
<div class="key" data-accordion>
<div class="key__item"><h4 class="key__head"><button class="key__btn" aria-expanded="true" aria-controls="k1a"><span class="key__no">1a</span><span class="key__q">꽃부리는 종 모양이고 아래로 처진다</span><span class="key__to">→ 2</span></button></h4>
<div class="key__body" id="k1a"><div class="key__item"><h4 class="key__head"><button class="key__btn" aria-expanded="true" aria-controls="k2a"><span class="key__no">2a</span><span class="key__q">꽃받침 갈래 사이에 부속체가 없다</span><span class="key__to">→ 3</span></button></h4><div class="key__body" id="k2a"><p class="key__result"><span class="t-name">금강초롱꽃속</span><i class="binomial">Hanabusaya</i><a href="#ledger">서랍 14</a></p></div></div>
<div class="key__item"><h4 class="key__head"><button class="key__btn" aria-expanded="false" aria-controls="k2b"><span class="key__no">2b</span><span class="key__q">꽃받침 갈래 사이에 젖혀진 부속체가 있다</span><span class="key__to">→ 초롱꽃속</span></button></h4><div class="key__body" id="k2b"><p class="key__text">초롱꽃속 Campanula — 서랍 13</p></div></div></div></div>
<div class="key__item"><h4 class="key__head"><button class="key__btn" aria-expanded="false" aria-controls="k1b"><span class="key__no">1b</span><span class="key__q">꽃부리는 나팔 모양이고 위를 향한다</span><span class="key__to">→ 4</span></button></h4><div class="key__body" id="k1b"><p class="key__text">도라지속 · 잔대속으로 갑니다.</p></div></div></div>
```
- `data-accordion="single"`이면 같은 층에서 하나만 펼침. 머리 = 번호(Cutive) + 질문(기록체) + 갈 곳. 끝 갈래는 `.key__result`(국명 + 학명 + 서랍 링크) 또는 `.key__text`.
- 상태: hover · focus-visible · `aria-expanded` · `aria-disabled="true"`. 자주 묻는 질문(pricing)도 같은 블록을 쓰고 번호 칸에 `Q1` `Q2`…를 적는다(질문은 `.key__q`, 답은 `.key__text`).

### alert — 동정 쪽지 `.slip` `components/alert.css`
```html
<aside class="slip slip--cave" role="note">
  <p class="slip__head">주의<span class="sc">CAVE</span></p>
  <div><p class="slip__title">꽃자루 털 재확인</p><p class="slip__text"><span class="binomial">Aconitum jaluense</span> 로 보기에는 꽃자루의 굽은 털이 적습니다.</p></div>
  <p class="slip__sign"><span class="pencil">오태경</span><span class="fig">2026. 8. 26.</span></p>
</aside>
```
- 종류(머리 글자 = 라틴 양식명): `.slip--det`(DET. 동정·녹) `.slip--note`(NOTE 안내·청) `.slip--acc`(ACC. 수장 완료·녹, 안에 `<span class="stamp stamp--sm">` 가능) `.slip--cave`(CAVE 주의·황토) `.slip--tox`(TOX. 유독·도장색, `role="alert"`).
- 닫기: `<button class="slip__close" type="button" data-dismiss aria-label="쪽지 닫기">(x 아이콘)</button>`. 행동 버튼 줄: `<div class="slip__actions">`.
- 겹쳐 쌓기: `<div class="slip-stack">` 안에 여러 장(−12px 겹침 + 미세 회전, 모바일 해제).

### badge — 소형 라벨 쪽지 `components/badge.css`
```html
<span class="badge badge--gangwon">강원</span>
<span class="badge badge--stage" data-stage="drying">건조 5/7일</span>   <!-- intake ○ · drying ◔ · mounting ◑ · det ◕ · photo ● · stored ✓ -->
<span class="badge badge--tox">투구꽃 — 맨손 금지</span>                  <!-- TOX. 머리 자동 -->
<span class="badge badge--stamped">수장 완료</span>                       <!-- 미니 도장 변형, 수장 완료에만 -->
<button class="badge badge--jeju" type="button" aria-pressed="false">제주 1,906</button>   <!-- 필터 -->
<span class="count">63</span>                                             <!-- 개수 칸 -->
```
상태색: `--ok --warn --info --danger --muted`, 크기 `--sm`. 묶음 `.badge-row`.

### breadcrumb — 분류 계통 경로 `components/breadcrumb.css`
```html
<nav class="crumbs crumbs--taxon" aria-label="분류 계통"><ol class="crumbs__list scroll-x" data-scroll-hint>
<li class="crumbs__item"><a href="#ledger"><span class="crumbs__rank">계</span>식물계</a></li><li class="crumbs__item"><a href="#ledger"><span class="crumbs__rank">문</span>속씨식물문</a></li><li class="crumbs__item"><a href="#ledger"><span class="crumbs__rank">강</span>목련강</a></li><li class="crumbs__item"><a href="#ledger"><span class="crumbs__rank">목</span>국화목</a></li><li class="crumbs__item"><a href="#ledger"><span class="crumbs__rank">과</span>초롱꽃과</a></li><li class="crumbs__item"><a href="#ledger"><span class="crumbs__rank">속</span>금강초롱꽃속</a></li><li class="crumbs__item"><span aria-current="page"><span class="crumbs__rank">종</span>금강초롱꽃</span></li></ol></nav>
<nav class="crumbs" aria-label="현재 위치"><ol class="crumbs__list"><li class="crumbs__item"><a href="index.html">열람실</a></li><li class="crumbs__item"><a href="#ledger">초롱꽃과</a></li><li class="crumbs__item"><span aria-current="page" class="id">DMH-024163</span></li></ol></nav>
```
- 일반 화면: `열람실 › 초롱꽃과 › DMH-024163`. 표본 화면: `.crumbs--taxon`(계급 11px 위 + 마지막 종 국명 Song Myung).

### button `components/button.css`
```html
<button class="btn" type="button">야장 저장</button>                 <!-- 주: 눌린 잎 녹 -->
<button class="btn btn--line" type="button">임시 보관</button>        <!-- 보조: 1px 잉크 -->
<button class="btn btn--ghost" type="button">지우기</button>          <!-- 밑줄 -->
<button class="btn btn--danger" type="button">폐기 신청</button>      <!-- 도장색 테두리 / 꽉 찬 위험 .btn--danger-solid -->
<button class="btn btn--sm">…</button> <button class="btn btn--lg">…</button> <button class="btn btn--block">…</button>
<button class="btn" disabled>비활성</button>                          <!-- 점선 테두리 -->
<button class="btn" aria-busy="true"><span class="bolt" aria-hidden="true"></span>저장 중</button>
<button class="btn btn--icon btn--line" type="button" aria-label="대지 메뉴">(dots 아이콘)</button>
<button class="btn btn--line" type="button" aria-pressed="true">낮 채집</button>
<div class="btn-group" role="group" aria-label="화면">
  <button class="btn btn--line btn--sm" type="button" data-theme-set="light">낮 채집</button>
  <button class="btn btn--line btn--sm" type="button" data-theme-set="dark">밤 순찰</button>
  <button class="btn btn--line btn--sm" type="button" data-theme-set="system">시스템</button>
</div>
```
- 높이 44(소 36·대 52), 반경 2px. 링크 버튼은 `<a class="btn" href="pages/…">`. 키 힌트 `<kbd class="btn__kbd">⌘K</kbd>`.
- 로딩 시연: `<button class="btn" data-busy-demo="1500" data-busy-text="출력 중" data-done-title="라벨을 다시 출력했습니다"><span class="btn__label">라벨 다시 출력</span></button>` — `.btn__label` 글자가 바뀌고 볼트가 돈다.
- 줄: `.btn-row`, `.btn-row--end`, 모바일 세로 `.btn-row--stack`.

### calendar — 채집 달력 `components/calendar.css`
```html
<div class="cal" data-calendar><div class="cal__head"><h3 class="cal__title"><span class="fig">2026</span>년 8월</h3><div class="cal__nav"><button class="btn btn--icon btn--line" aria-label="7월"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg></button><button class="btn btn--icon btn--line" aria-label="9월"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg></button></div></div>
<table class="cal__grid" aria-label="2026년 8월 채집 달력"><thead><tr><th scope="col" abbr="일요일">일</th><th scope="col" abbr="월요일">월</th><th scope="col">화</th><th scope="col">수</th><th scope="col">목</th><th scope="col">금</th><th scope="col">토</th></tr></thead><tbody><tr><td class="is-out"></td><td class="is-out"></td><td class="is-out"></td><td class="is-out"></td><td class="is-out"></td><td class="is-out"></td><td><button class="cal__day is-past" type="button" aria-label="8월 1일 토요일">1</button></td></tr><tr><td><button class="cal__day is-sun is-closed is-past" type="button" aria-label="8월 2일 일요일 휴관">2</button></td><td><button class="cal__day is-closed is-past" type="button" aria-label="8월 3일 월요일 휴관">3</button></td><td><button class="cal__day is-past" type="button" aria-label="8월 4일 화요일">4</button></td><td><button class="cal__day is-past" type="button" aria-label="8월 5일 수요일">5</button></td><td><button class="cal__day is-past" type="button" aria-label="8월 6일 목요일">6</button></td><td><button class="cal__day is-past" type="button" aria-label="8월 7일 금요일">7</button></td><td><button class="cal__day is-past" type="button" aria-label="8월 8일 토요일">8</button></td></tr><tr><td><button class="cal__day is-sun is-closed is-past" type="button" aria-label="8월 9일 일요일 휴관">9</button></td><td><button class="cal__day is-closed is-past" type="button" aria-label="8월 10일 월요일 휴관">10</button></td><td><button class="cal__day is-past" type="button" aria-label="8월 11일 화요일">11</button></td><td><button class="cal__day is-past" type="button" aria-label="8월 12일 수요일">12</button></td><td><button class="cal__day is-past" type="button" aria-label="8월 13일 목요일">13</button></td><td><button class="cal__day is-past" type="button" aria-label="8월 14일 금요일">14</button></td><td><button class="cal__day is-past" type="button" aria-label="8월 15일 토요일">15</button></td></tr><tr><td><button class="cal__day is-sun is-closed is-past" type="button" aria-label="8월 16일 일요일 휴관">16</button></td><td><button class="cal__day is-closed is-past" type="button" aria-label="8월 17일 월요일 휴관">17</button></td><td><button class="cal__day is-past" type="button" aria-label="8월 18일 화요일">18</button></td><td><button class="cal__day is-past" type="button" aria-label="8월 19일 수요일">19</button></td><td><button class="cal__day is-past" type="button" aria-label="8월 20일 목요일">20</button></td><td><span class="tip-wrap"><button class="cal__day is-past" type="button" aria-label="8월 21일 금요일, 금강초롱꽃 채집 · 서연우 412" aria-describedby="ct21">21<span class="cal__dots"><i class="cal__dot cal__dot--violet"></i></span></button><span class="tip tip--bottom" role="tooltip" id="ct21">금강초롱꽃 채집 · 서연우 412</span></span></td><td><button class="cal__day is-past" type="button" aria-label="8월 22일 토요일">22</button></td></tr><tr><td><button class="cal__day is-sun is-closed is-past" type="button" aria-label="8월 23일 일요일 휴관">23</button></td><td><button class="cal__day is-closed is-past" type="button" aria-label="8월 24일 월요일 휴관">24</button></td><td><button class="cal__day is-past" type="button" aria-label="8월 25일 화요일">25</button></td><td><button class="cal__day is-past" type="button" aria-label="8월 26일 수요일">26</button></td><td><button class="cal__day" type="button" aria-current="date" aria-label="8월 27일 목요일">27</button></td><td><span class="tip-wrap"><button class="cal__day" type="button" aria-label="8월 28일 금요일, 촬영대 2번 · DMH-024163" aria-describedby="ct28">28<span class="cal__dots"><i class="cal__dot cal__dot--info"></i></span></button><span class="tip tip--bottom" role="tooltip" id="ct28">촬영대 2번 · DMH-024163</span></span></td><td><span class="tip-wrap"><button class="cal__day" type="button" aria-label="8월 29일 토요일, 정기 채집 07:00 곰배령" aria-describedby="ct29">29<span class="cal__dots"><i class="cal__dot"></i></span></button><span class="tip tip--bottom" role="tooltip" id="ct29">정기 채집 07:00 곰배령</span></span></td></tr><tr><td><button class="cal__day is-sun is-closed" type="button" aria-label="8월 30일 일요일 휴관">30</button></td><td><button class="cal__day is-closed" type="button" aria-label="8월 31일 월요일 휴관">31</button></td><td class="is-out"></td><td class="is-out"></td><td class="is-out"></td><td class="is-out"></td><td class="is-out"></td></tr></tbody></table>
<div class="cal__legend"><span><i class="swatch-today"></i>오늘</span><span><i class="swatch-closed"></i>휴관(일·월)</span><span><i class="cal__dot"></i>정기 채집</span></div></div>
```
- 2026년 8월은 토요일(8/1) 시작 → 앞 빈칸 6개. 일·월 = 휴관 `.is-closed`(해치), 일요일 숫자 `.is-sun`, 오늘 8/27 `aria-current="date"`, 지난 날 `.is-past`, 선택 `aria-pressed="true"`(app.js), 날짜 없는 칸 `<td class="is-out">`.
- 행사일: `.cal__dots > .cal__dot(.cal__dot--violet|--info|--warn|--stamp)` + `.tip-wrap`/`.tip--bottom` 툴팁(양끝 열은 CSS가 자동 정렬). 행사 목록은 `.cal__events > .cal__event`(날짜 num + 내용).
- 선택한 날짜 문구를 보이려면 `data-cal-output="요소id"`.

### card — 미니 대지 `components/card.css`
```html
<a class="specimen" href="pages/profile.html">
  <span class="tape tape--sm tape--tc"></span>
  <span class="specimen__no">DMH-024163</span>
  <div class="specimen__plate"><svg class="flora flora--mid" viewBox="0 0 300 600" aria-hidden="true">…</svg></div>
  <div class="label label--compact specimen__label">
    <p class="label__binomial">Hanabusaya asiatica</p>
    <p class="label__name">금강초롱꽃</p>
    <dl class="label__fields">
      <div class="label__f"><dt class="label__k">채집</dt><dd class="label__v">08-21 (금)</dd></div>
      <div class="label__f"><dt class="label__k">채집인</dt><dd class="label__v">서연우 412</dd></div>
    </dl>
  </div>
</a>
```
- 29:42 세로, 그림 62 %, 라벨이 그림을 −16px 덮는다. 상태: hover(2px 들기) · focus-visible · `aria-current="true"`/`aria-selected="true"`/`.is-selected`(녹 테두리, selected는 "✓ 선택" 꼬리표) · `aria-disabled="true"`(대출 중 — 점선) · `aria-busy="true"`(빗금 자리).
- `.specimen--wide`(가로 4:3, 상품 목록·함께 쓰는 것). 줄: `.specimen-row`(자동 채움 190px, 모바일 2열) · `.specimen-row--wide`.
- 일반 내용 블록 `.card`(대지) + `.card__title` `.card__body` + **우하단 메타** `.card__meta > span(b 필드명 + 값)`. `.card--flat` `.card--folder`. 링크면 `<a class="card">`.
- 끈 달린 라벨(값표·404·상품): `<div class="hangtag sway"><span class="hangtag__string"></span><div class="label">…</div></div>`, 여러 장은 `<div class="hangline">`로 한 끈에. `.sway`는 화면당 1개.

### carousel — 세밀화 도판 넘김 `components/carousel.css`
```html
<section class="plates" data-carousel aria-roledescription="도판 넘김" aria-label="세밀화 도판"><div class="plates__viewport"><ol class="plates__track"><li class="plates__slide" data-name="동자꽃"><article class="plate"><p class="plate__no">Tabula I</p><div class="plate__art"><svg class="flora" viewBox="0 0 200 300" data-draw aria-hidden="true"><path d="M100 296 C96 230 106 150 100 96"/>
  <path d="M98 250 L94.1 250.1 L90.2 250.4 L86.2 250.5 L82.4 250.5 L78.7 250.2 L75 249.6 L71.5 248.7 L68.1 247.5 L64.8 246 L61.6 244.1 L58.4 242.1 L55.4 239.8 L52.4 237.4 L49.5 234.9 L46.5 232.5 L43.5 230.2 L47.3 230.3 L51.1 230.3 L55 230.4 L58.8 230.4 L62.6 230.6 L66.3 231.1 L69.9 231.7 L73.4 232.7 L76.8 233.9 L80.1 235.5 L83.3 237.4 L86.3 239.6 L89.3 242.1 L92.2 244.7 L95.1 247.4 L98 250 Z"/>
  <path class="vein" d="M98 250 Q71.8 240.5 47.8 231.7"/>
  <path d="M102 250 L104.9 247.4 L107.8 244.7 L110.7 242.1 L113.7 239.6 L116.7 237.4 L119.9 235.5 L123.2 233.9 L126.6 232.7 L130.1 231.7 L133.7 231.1 L137.4 230.6 L141.2 230.4 L145 230.4 L148.9 230.3 L152.7 230.3 L156.5 230.2 L153.5 232.5 L150.5 234.9 L147.6 237.4 L144.6 239.8 L141.6 242.1 L138.4 244.1 L135.2 246 L131.9 247.5 L128.5 248.7 L125 249.6 L121.3 250.2 L117.6 250.5 L113.8 250.5 L109.8 250.4 L105.9 250.1 L102 250 Z"/>
  <path class="vein" d="M102 250 Q128.2 240.5 152.2 231.7"/>
  <path d="M98 196 L94.4 196.5 L90.7 197.1 L87 197.5 L83.4 197.8 L79.9 197.9 L76.5 197.6 L73.1 197 L69.9 196.1 L66.7 194.9 L63.6 193.4 L60.6 191.6 L57.7 189.6 L54.8 187.5 L51.9 185.3 L49 183.1 L46.1 181.1 L49.7 180.9 L53.3 180.6 L56.9 180.3 L60.4 180 L64 179.9 L67.5 180 L70.9 180.3 L74.2 181 L77.5 181.9 L80.6 183.2 L83.6 184.8 L86.6 186.7 L89.5 188.9 L92.3 191.2 L95.2 193.7 L98 196 Z"/>
  <path class="vein" d="M98 196 Q73.1 188.9 50.2 182.3"/>
  <path d="M102 196 L104.8 193.7 L107.7 191.2 L110.5 188.9 L113.4 186.7 L116.4 184.8 L119.4 183.2 L122.5 181.9 L125.8 181 L129.1 180.3 L132.5 180 L136 179.9 L139.6 180 L143.1 180.3 L146.7 180.6 L150.3 180.9 L153.9 181.1 L151 183.1 L148.1 185.3 L145.2 187.5 L142.3 189.6 L139.4 191.6 L136.4 193.4 L133.3 194.9 L130.1 196.1 L126.9 197 L123.5 197.6 L120.1 197.9 L116.6 197.8 L113 197.5 L109.3 197.1 L105.6 196.5 L102 196 Z"/>
  <path class="vein" d="M102 196 Q126.9 188.9 149.8 182.3"/>
  <path d="M98 146 L94.9 146.2 L91.7 146.5 L88.6 146.7 L85.6 146.8 L82.7 146.6 L79.9 146.1 L77.2 145.3 L74.7 144.2 L72.3 142.8 L70 141.2 L67.9 139.3 L65.8 137.1 L63.8 134.9 L61.8 132.6 L59.9 130.3 L57.8 128.1 L60.8 128.2 L63.8 128.1 L66.9 128 L69.9 128 L72.8 128.1 L75.7 128.5 L78.5 129 L81.1 129.9 L83.6 131 L86 132.5 L88.2 134.2 L90.3 136.3 L92.3 138.5 L94.2 141 L96.1 143.5 L98 146 Z"/>
  <path class="vein" d="M98 146 Q78.7 137.4 61 129.5"/>
  <path d="M102 146 L103.9 143.5 L105.8 141 L107.7 138.5 L109.7 136.3 L111.8 134.2 L114 132.5 L116.4 131 L118.9 129.9 L121.5 129 L124.3 128.5 L127.2 128.1 L130.1 128 L133.1 128 L136.2 128.1 L139.2 128.2 L142.2 128.1 L140.1 130.3 L138.2 132.6 L136.2 134.9 L134.2 137.1 L132.1 139.3 L130 141.2 L127.7 142.8 L125.3 144.2 L122.8 145.3 L120.1 146.1 L117.3 146.6 L114.4 146.8 L111.4 146.7 L108.3 146.5 L105.1 146.2 L102 146 Z"/>
  <path class="vein" d="M102 146 Q121.3 137.4 139 129.5"/>
  <path class="petal petal--red" d="M96.8 56.8 Q87.6 34 92.1 24 L100 30.4 L107.9 24 Q112.4 34 103.2 56.8 Z"/>
  <path class="vein" d="M100 55.2 L100 32.8"/>
  <path class="petal petal--red" d="M105.9 58.7 Q124.7 42.9 135.6 44.1 L132 53.6 L140.5 59.2 Q132.4 66.5 107.8 64.8 Z"/>
  <path class="vein" d="M108.4 61.3 L129.7 54.4"/>
  <path class="petal petal--red" d="M106.8 67.9 Q127.7 81 129.9 91.7 L119.7 91.2 L117.1 101 Q107.6 95.6 101.6 71.7 Z"/>
  <path class="vein" d="M105.2 71.1 L118.3 89.2"/>
  <path class="petal petal--red" d="M98.4 71.7 Q92.4 95.6 82.9 101 L80.3 91.2 L70.1 91.7 Q72.3 81 93.2 67.9 Z"/>
  <path class="vein" d="M94.8 71.1 L81.7 89.2"/>
  <path class="petal petal--red" d="M92.2 64.8 Q67.6 66.5 59.5 59.2 L68 53.6 L64.4 44.1 Q75.3 42.9 94.1 58.7 Z"/>
  <path class="vein" d="M91.6 61.3 L70.3 54.4"/>
  <circle cx="100" cy="64" r="4.8"/>
  <path d="M100 96 L100 78"/>
  <path class="petal petal--red" d="M150.4 124.1 Q152.1 111.9 156.6 108.7 L158.4 113.5 L163.4 112.7 Q162.9 118.1 153.2 125.7 Z"/>
  <path class="vein" d="M152.2 124.2 L157.8 114.5"/>
  <path class="petal petal--red" d="M153.9 127.2 Q166 125.1 170.4 128.3 L166.4 131.5 L168.7 136 Q163.4 137.2 153.2 130.3 Z"/>
  <path class="vein" d="M154.3 128.9 L165.3 131.2"/>
  <path class="petal petal--red" d="M152 131.4 Q157.7 142.3 156 147.5 L151.8 144.7 L148.1 148.3 Q145.4 143.6 148.8 131.7 Z"/>
  <path class="vein" d="M150.5 132.4 L151.6 143.5"/>
  <path class="petal petal--red" d="M147.4 130.9 Q138.8 139.8 133.3 139.8 L134.7 134.8 L130.1 132.5 Q133.8 128.4 146.1 128 Z"/>
  <path class="vein" d="M146 129.8 L135.7 134.3"/>
  <path class="petal petal--red" d="M146.4 126.4 Q135.4 121 133.7 115.8 L138.8 115.5 L139.6 110.5 Q144.6 112.7 148.8 124.3 Z"/>
  <path class="vein" d="M147.1 124.7 L139.6 116.4"/>
  <circle cx="150" cy="128" r="2.4"/>
  <path d="M104 150 Q128 140 146 136"/></svg></div><div class="plate__side"><p class="plate__note">권다온 세밀화 — 압착 전 생체를 보고 그렸습니다.</p><div class="label label--compact"><p class="label__binomial">Lychnis cognata <span class="auth">Maxim.</span></p><p class="label__name">동자꽃</p><dl class="label__fields"><div class="label__f"><dt class="label__k">수장번호</dt><dd class="label__v id">DMH-024159</dd></div><div class="label__f"><dt class="label__k">도판</dt><dd class="label__v">1 / 4</dd></div></dl></div></div></article></li><li class="plates__slide" data-name="투구꽃"><article class="plate"><p class="plate__no">Tabula II</p><div class="plate__art"><svg class="flora" viewBox="0 0 200 300" data-draw aria-hidden="true"><path d="M96 296 C92 220 110 140 104 30"/>
  <path d="M103 143.8 Q113 139.8 121 147.8"/>
  <path class="petal" d="M121 149.8 c-2.3 -11.5 0 -27.6 11.5 -34.5 c9.2 -4.6 18.4 2.3 18.4 16.1 c0 6.9 4.6 9.2 9.2 11.5 c-4.6 2.3 -11.5 2.3 -16.1 0 c-6.9 6.9 -16.1 9.2 -23 6.9z"/>
  <path class="petal" d="M0 0" transform="translate(121 149.8)"/>
  <path class="petal" d="M123.3 149.8 c2.3 9.2 11.5 13.8 18.4 9.2 c3.4 -2.3 4.6 -6.9 2.3 -9.2z"/>
  <path class="vein" d="M124.4 142.9 c0 -9.2 4.6 -18.4 11.5 -21.8"/>
  <path d="M104.2 121.6 Q94.2 117.6 86.2 125.6"/>
  <path class="petal" d="M86.2 127.6 c2.2 -10.8 0 -25.9 -10.8 -32.4 c-8.6 -4.3 -17.3 2.2 -17.3 15.1 c0 6.5 -4.3 8.6 -8.6 10.8 c4.3 2.2 10.8 2.2 15.1 0 c6.5 6.5 15.1 8.6 21.6 6.5z"/>
  <path class="petal" d="M0 0" transform="translate(86.2 127.6)"/>
  <path class="petal" d="M84 127.6 c-2.2 8.6 -10.8 13 -17.3 8.6 c-3.2 -2.2 -4.3 -6.5 -2.2 -8.6z"/>
  <path class="vein" d="M82.9 121.1 c0 -8.6 -4.3 -17.3 -10.8 -20.5"/>
  <path d="M105 98.5 Q115 94.5 123 102.5"/>
  <path class="petal" d="M123 104.5 c-2 -10.1 0 -24.2 10.1 -30.3 c8.1 -4 16.2 2 16.2 14.1 c0 6.1 4 8.1 8.1 10.1 c-4 2 -10.1 2 -14.1 0 c-6.1 6.1 -14.1 8.1 -20.2 6.1z"/>
  <path class="petal" d="M0 0" transform="translate(123 104.5)"/>
  <path class="petal" d="M125 104.5 c2 8.1 10.1 12.1 16.2 8.1 c3 -2 4 -6.1 2 -8.1z"/>
  <path class="vein" d="M126 98.5 c0 -8.1 4 -16.2 10.1 -19.2"/>
  <path d="M105.2 74.5 Q95.2 70.5 87.2 78.5"/>
  <path class="petal" d="M87.2 80.5 c1.9 -9.4 0 -22.6 -9.4 -28.2 c-7.5 -3.8 -15 1.9 -15 13.2 c0 5.6 -3.8 7.5 -7.5 9.4 c3.8 1.9 9.4 1.9 13.2 0 c5.6 5.6 13.2 7.5 18.8 5.6z"/>
  <path class="petal" d="M0 0" transform="translate(87.2 80.5)"/>
  <path class="petal" d="M85.4 80.5 c-1.9 7.5 -9.4 11.3 -15 7.5 c-2.8 -1.9 -3.8 -5.6 -1.9 -7.5z"/>
  <path class="vein" d="M84.4 74.9 c0 -7.5 -3.8 -15 -9.4 -17.9"/>
  <path d="M104.8 49.5 Q114.8 45.5 122.8 53.5"/>
  <path class="petal" d="M122.8 55.5 c-1.7 -8.7 0 -20.9 8.7 -26.1 c7 -3.5 13.9 1.7 13.9 12.2 c0 5.2 3.5 7 7 8.7 c-3.5 1.7 -8.7 1.7 -12.2 0 c-5.2 5.2 -12.2 7 -17.4 5.2z"/>
  <path class="petal" d="M0 0" transform="translate(122.8 55.5)"/>
  <path class="petal" d="M124.6 55.5 c1.7 7 8.7 10.4 13.9 7 c2.6 -1.7 3.5 -5.2 1.7 -7z"/>
  <path class="vein" d="M125.4 50.3 c0 -7 3.5 -13.9 8.7 -16.5"/>
  <path d="M94 236 L92.7 239.5 L91.4 243.8 L89.7 246.2 L88.4 250.6 L85.8 251.8 L83.9 255.5 L80.5 255.8 L77.9 258.5 L74.1 258.4 L70.7 260.2 L67.1 260.3 L63.7 261.4 L65.4 258.2 L66.1 254.7 L68.5 251.7 L69 248 L72.2 245.8 L73.1 242.5 L77 241.4 L78.7 239 L83.2 238.5 L85.8 237.2 L90.3 236.7 L94 236 Z"/>
  <path class="vein" d="M94 236 Q79.5 248.2 66.1 259.4"/>
  <path class="vein" d="M89.8 239.6 Q88.9 243.4 88.2 247.5"/>
  <path class="vein" d="M89.8 239.6 Q85.8 239.8 81.6 239.7"/>
  <path class="vein" d="M68.6 257.3 Q66.9 260.2 63.7 261.4"/>
  <path class="vein" d="M68.6 257.3 Q65.4 258.5 63.7 261.4"/>
  <path d="M94 236 L90.6 238.5 L86.7 241.7 L83.6 243 L79.7 246.2 L76.4 246 L72.4 248.4 L68.8 247 L64.6 248.2 L61 246.3 L56.5 246.2 L52.9 244.6 L48.9 243.9 L52.5 241.9 L55.3 239.2 L59.4 237.6 L62.2 234.6 L66.6 234.2 L69.5 231.8 L74 232.6 L77.1 231.3 L81.9 233 L85.2 233.2 L89.9 234.8 L94 236 Z"/>
  <path class="vein" d="M94 236 Q72.4 239.8 52.5 243.3"/>
  <path class="vein" d="M87.7 237.1 Q84.5 240.1 81.4 243.4"/>
  <path class="vein" d="M87.7 237.1 Q83.7 235.4 79.6 233.3"/>
  <path class="vein" d="M56.1 242.7 Q52.7 244.4 48.9 243.9"/>
  <path class="vein" d="M56.1 242.7 Q52.3 242.2 48.9 243.9"/>
  <path d="M94 236 L89.3 236.2 L83.8 236.9 L80 236.3 L74.5 237 L71.3 235 L66.1 234.8 L63.3 231.7 L58.5 230.4 L55.8 226.8 L51.5 224.3 L48.7 221 L45.1 218.2 L49.7 218.4 L53.9 217.6 L58.9 218.5 L63.2 217.5 L67.7 219.5 L71.9 219 L76 222.2 L79.7 222.8 L83.5 226.8 L86.7 228.8 L90.6 232.8 L94 236 Z"/>
  <path class="vein" d="M94 236 Q70.5 227.5 49 219.6"/>
  <path class="vein" d="M87.2 233.5 Q82.4 234.3 77.6 235.5"/>
  <path class="vein" d="M87.2 233.5 Q84.1 229.9 81.1 225.9"/>
  <path class="vein" d="M53 221.1 Q48.7 220.7 45.1 218.2"/>
  <path class="vein" d="M53 221.1 Q49.4 218.6 45.1 218.2"/>
  <path d="M94 236 L90.1 234.3 L85.4 232.5 L82.8 230.5 L78.1 228.7 L76.5 225.8 L72.5 223.5 L71.9 219.7 L68.8 216.6 L68.6 212.5 L66.4 208.7 L66 204.8 L64.6 200.9 L68.1 203 L71.9 204.1 L75.3 206.9 L79.3 207.8 L81.8 211.4 L85.4 212.6 L87 217 L89.6 219 L90.5 224 L92.1 227 L93 231.9 L94 236 Z"/>
  <path class="vein" d="M94 236 Q79.9 219.2 66.9 203.7"/>
  <path class="vein" d="M89.9 231.1 Q85.7 229.8 81.3 228.8"/>
  <path class="vein" d="M89.9 231.1 Q89.3 226.8 89.1 222.2"/>
  <path class="vein" d="M69.3 206.6 Q66.1 204.5 64.6 200.9"/>
  <path class="vein" d="M69.3 206.6 Q67.8 203 64.6 200.9"/>
  <path d="M94 236 L91.6 233.1 L88.5 229.8 L87.3 227.2 L84.2 223.9 L84.4 221 L82.2 217.5 L83.6 214.4 L82.6 210.8 L84.5 207.6 L84.7 203.7 L86.3 200.6 L87.1 197.1 L89.1 200.1 L91.7 202.5 L93.2 206 L96.1 208.4 L96.4 212.2 L98.8 214.6 L97.9 218.6 L99.1 221.2 L97.3 225.4 L97 228.3 L95.2 232.4 L94 236 Z"/>
  <path class="vein" d="M94 236 Q90.7 217.3 87.7 200.1"/>
  <path class="vein" d="M93 230.6 Q90.2 227.8 86.9 225.2"/>
  <path class="vein" d="M93 230.6 Q94.8 227 97 223.4"/>
  <path class="vein" d="M88.2 203.3 Q86.6 200.4 87.1 197.1"/>
  <path class="vein" d="M88.2 203.3 Q88.8 200 87.1 197.1"/>
  <path d="M98 200 L96.9 196.8 L95.3 193.2 L95.1 190.6 L93.5 187 L94.6 184.6 L93.8 181.1 L95.9 178.9 L96.1 175.6 L98.7 173.5 L100 170.3 L102.4 168.2 L104.1 165.6 L104.8 168.7 L106.2 171.4 L106.4 174.9 L108.1 177.7 L107.2 180.9 L108.5 183.7 L106.5 186.7 L106.7 189.3 L103.9 192.2 L102.8 194.5 L100.1 197.4 L98 200 Z"/>
  <path class="vein" d="M98 200 Q100.9 183.5 103.6 168.3"/>
  <path class="vein" d="M98.8 195.2 Q97.3 192.1 95.4 188.9"/>
  <path class="vein" d="M98.8 195.2 Q101.4 192.8 104.3 190.5"/>
  <path class="vein" d="M103.1 171.1 Q102.6 168.2 104.1 165.6"/>
  <path class="vein" d="M103.1 171.1 Q104.5 168.5 104.1 165.6"/>
  <path d="M98 200 L98.9 196.4 L99.7 192 L101.1 189.4 L101.9 185 L104.2 183.2 L105.6 179.3 L108.8 178.2 L111 175.1 L114.5 174.2 L117.6 171.8 L120.9 170.8 L124 169 L122.8 172.4 L122.4 175.8 L120.5 179.2 L120.3 182.9 L117.6 185.6 L117 188.9 L113.5 191 L112.1 193.6 L107.9 195.1 L105.6 196.9 L101.4 198.5 L98 200 Z"/>
  <path class="vein" d="M98 200 Q110.5 185.1 122 171.4"/>
  <path class="vein" d="M101.6 195.7 Q102.1 191.8 102.3 187.8"/>
  <path class="vein" d="M101.6 195.7 Q105.3 194.5 109.3 193.6"/>
  <path class="vein" d="M119.9 174 Q121.2 170.8 124 169"/>
  <path class="vein" d="M119.9 174 Q122.7 172.1 124 169"/>
  <path d="M98 200 L101 197.2 L104.4 193.6 L107.3 191.9 L110.6 188.3 L113.9 187.8 L117.6 184.9 L121.2 185.4 L125.3 183.6 L129.1 184.5 L133.5 183.7 L137.2 184.4 L141.2 184.3 L138 186.7 L135.6 189.7 L131.7 191.9 L129.4 195 L125.2 196.2 L122.7 199 L118.1 199.1 L115.2 200.8 L110.3 200.3 L107 200.8 L102.2 200.2 L98 200 Z"/>
  <path class="vein" d="M98 200 Q118.7 192.4 137.8 185.5"/>
  <path class="vein" d="M104.1 197.8 Q106.8 194.6 109.4 191"/>
  <path class="vein" d="M104.1 197.8 Q108.2 198.5 112.5 199.5"/>
  <path class="vein" d="M134.3 186.8 Q137.4 184.6 141.2 184.3"/>
  <path class="vein" d="M134.3 186.8 Q138.1 186.4 141.2 184.3"/>
  <path d="M98 200 L101.6 199 L105.8 197.5 L108.7 197.3 L112.9 195.8 L115.7 197 L119.7 196.2 L122.3 198.4 L126.1 198.8 L128.6 201.4 L132.2 202.8 L134.8 205.2 L137.9 207 L134.3 207.6 L131.2 209 L127.2 209.1 L124 210.8 L120.3 209.8 L117.1 211 L113.6 208.9 L110.6 209 L107.2 206.2 L104.5 205 L101 202.2 L98 200 Z"/>
  <path class="vein" d="M98 200 Q117.1 203.4 134.7 206.5"/>
  <path class="vein" d="M103.6 201 Q107.1 199.5 110.7 197.6"/>
  <path class="vein" d="M103.6 201 Q106.4 203.6 109.2 206.6"/>
  <path class="vein" d="M131.5 205.9 Q134.8 205.5 137.9 207"/>
  <path class="vein" d="M131.5 205.9 Q134.5 207.4 137.9 207"/>
  <path d="M98 200 L101.3 200.6 L105.2 201.1 L107.6 202.2 L111.5 202.6 L113 204.7 L116.5 205.8 L117.3 208.7 L120.1 210.6 L120.6 213.9 L122.7 216.6 L123.3 219.7 L124.8 222.5 L121.8 221.5 L118.6 221.4 L115.6 219.8 L112.3 219.9 L109.9 217.5 L106.9 217.2 L105.3 214 L103 212.9 L101.8 209.1 L100.3 206.9 L99.2 203.1 L98 200 Z"/>
  <path class="vein" d="M98 200 Q110.9 210.8 122.7 220.7"/>
  <path class="vein" d="M101.7 203.1 Q105.2 203.3 108.9 203.3"/>
  <path class="vein" d="M101.7 203.1 Q102.6 206.5 103.1 210.2"/>
  <path class="vein" d="M120.5 218.9 Q123.3 219.9 124.8 222.5"/>
  <path class="vein" d="M120.5 218.9 Q122 221.4 124.8 222.5"/></svg></div><div class="plate__side"><p class="plate__note">권다온 세밀화 — 압착 전 생체를 보고 그렸습니다.</p><div class="label label--compact"><p class="label__binomial">Aconitum jaluense <span class="auth">Kom.</span></p><p class="label__name">투구꽃</p><dl class="label__fields"><div class="label__f"><dt class="label__k">수장번호</dt><dd class="label__v id">DMH-024155</dd></div><div class="label__f"><dt class="label__k">도판</dt><dd class="label__v">2 / 4</dd></div></dl></div></div></article></li><li class="plates__slide" data-name="물봉선"><article class="plate"><p class="plate__no">Tabula III</p><div class="plate__art"><svg class="flora" viewBox="0 0 200 300" data-draw aria-hidden="true"><path d="M92 296 C86 210 112 150 104 60"/>
  <path d="M92 244 Q90.2 240.6 84.5 241.3"/>
  <path d="M84.5 241.3 L79.9 244.7 L76.1 246 L72.6 246.6 L68.2 247.6 L66 246.8 L61.7 247.3 L59.8 245.7 L55.7 245.7 L54 243.5 L50 243.1 L48.5 240.5 L44.7 239.6 L43.2 236.8 L39.6 235.4 L38.2 232.6 L34.8 230.7 L33.3 227.9 L30 225.5 L28.5 222.9 L26.2 220.1 L29.8 219.4 L32.7 218.3 L36.7 218.6 L39.6 217.4 L43.4 218.1 L46.4 216.9 L50 218.1 L52.9 217 L56.4 218.7 L59.3 217.7 L62.6 219.9 L65.3 219.3 L68.4 222 L70.9 222 L73.8 225.2 L76.1 225.9 L78.8 229.6 L81.2 232.2 L83.2 235.7 L84.5 241.3 Z"/>
  <path class="vein" d="M84.5 241.3 Q56.5 231.1 30.8 221.7"/>
  <path class="vein" d="M76.3 238.3 Q69.7 242.1 63.4 244.8"/>
  <path class="vein" d="M76.3 238.3 Q73.7 231.1 70.6 225"/>
  <path class="vein" d="M55.9 230.9 Q49 235.5 43.7 235.5"/>
  <path class="vein" d="M55.9 230.9 Q53.6 222.8 49.5 219.4"/>
  <path class="vein" d="M35.5 223.5 Q30.1 223.8 26.2 220.1"/>
  <path class="vein" d="M35.5 223.5 Q31.6 219.7 26.2 220.1"/>
  <path d="M100 214 Q105.9 211 107.8 212.1"/>
  <path d="M107.8 212.1 L109.4 206.8 L111.6 203.5 L114 201.2 L116.9 197.9 L119.1 197.4 L122.1 194.6 L124.4 195 L127.6 192.7 L130.1 193.6 L133.3 191.8 L135.9 193.1 L139.3 191.8 L141.9 193.3 L145.5 192.5 L148.1 194.1 L151.8 193.8 L154.4 195.3 L158.2 195.5 L160.8 196.9 L164 198 L161.7 200.5 L160 203 L156.8 205 L155.2 207.5 L151.8 209 L150.2 211.6 L146.7 212.6 L145.1 215.1 L141.5 215.6 L139.8 218 L136.1 217.9 L134.3 219.9 L130.5 219.4 L128.6 220.8 L124.6 219.7 L122.5 220.3 L118.4 218.7 L115.2 217.8 L111.7 216 L107.8 212.1 Z"/>
  <path class="vein" d="M107.8 212.1 Q134.8 205.3 159.6 199.1"/>
  <path class="vein" d="M115.6 210.1 Q118.7 203.3 122.1 197.7"/>
  <path class="vein" d="M115.6 210.1 Q121.6 214.7 127.2 218"/>
  <path class="vein" d="M135.3 205.2 Q138.2 197.5 142.3 194.6"/>
  <path class="vein" d="M135.3 205.2 Q141.5 210.6 146.4 211.2"/>
  <path class="vein" d="M155 200.3 Q159 197.1 164 198"/>
  <path class="vein" d="M155 200.3 Q160.1 201.3 164 198"/>
  <path d="M92 178 Q90.4 174.2 84.8 174.5"/>
  <path d="M84.8 174.5 L80.4 177.6 L76.9 178.8 L73.8 179.2 L69.8 180.1 L68.1 179.1 L64.3 179.5 L62.9 177.8 L59.4 177.7 L58.3 175.5 L55 174.9 L54 172.4 L50.9 171.3 L50.1 168.6 L47.2 167.1 L46.4 164.3 L43.8 162.3 L42.9 159.6 L40.5 157.2 L39.6 154.5 L38.1 151.7 L41.2 151.2 L43.9 150.3 L47.3 150.7 L50 149.6 L53.1 150.5 L55.8 149.4 L58.8 150.7 L61.5 149.7 L64.2 151.5 L66.8 150.7 L69.3 153 L71.7 152.5 L74 155.2 L76.1 155.3 L78.2 158.5 L80 159.3 L81.8 162.9 L83.4 165.6 L84.6 169.1 L84.8 174.5 Z"/>
  <path class="vein" d="M84.8 174.5 Q62.4 163.6 41.7 153.5"/>
  <path class="vein" d="M78.3 171.3 Q72 174.7 66.2 177.1"/>
  <path class="vein" d="M78.3 171.3 Q77.1 164.2 75.4 158.2"/>
  <path class="vein" d="M61.9 163.3 Q55.2 167.6 50.7 167.4"/>
  <path class="vein" d="M61.9 163.3 Q61.1 155.4 58.2 152"/>
  <path class="vein" d="M45.6 155.3 Q40.9 155.5 38.1 151.7"/>
  <path class="vein" d="M45.6 155.3 Q42.8 151.6 38.1 151.7"/>
  <path d="M100 146 Q105.7 142.5 107.4 143"/>
  <path d="M107.4 143 L107.8 137.7 L108.9 134.5 L110.4 132 L112.1 128.6 L113.8 128 L115.7 125.1 L117.6 125.3 L119.7 122.9 L121.9 123.6 L124.2 121.7 L126.5 122.8 L129 121.3 L131.4 122.6 L134.1 121.6 L136.5 123 L139.4 122.5 L141.8 123.8 L144.9 123.7 L147.2 124.9 L150.1 125.8 L148.6 128.4 L147.8 130.8 L145.5 133 L144.7 135.6 L142.3 137.2 L141.5 139.8 L138.9 141 L138 143.6 L135.2 144.3 L134.3 146.7 L131.3 146.9 L130.2 148.9 L127.1 148.6 L125.8 150.1 L122.4 149.4 L120.8 150.1 L117.2 148.8 L114.4 148.1 L111.3 146.5 L107.4 143 Z"/>
  <path class="vein" d="M107.4 143 Q127.9 134.7 146.7 127.1"/>
  <path class="vein" d="M113.4 140.6 Q114.6 133.8 116.3 128.1"/>
  <path class="vein" d="M113.4 140.6 Q119 144.6 124.1 147.6"/>
  <path class="vein" d="M128.3 134.6 Q129.2 126.9 131.9 123.9"/>
  <path class="vein" d="M128.3 134.6 Q134.3 139.4 138.3 139.7"/>
  <path class="vein" d="M143.2 128.5 Q145.8 125.1 150.1 125.8"/>
  <path class="vein" d="M143.2 128.5 Q147.5 129.2 150.1 125.8"/>
  <path d="M104 60 Q118 44 132 50"/>
  <path d="M132 50 c3 9 6 15 3 24"/>
  <path class="petal petal--red" d="M135 74 c-21 -3 -45 6 -51 24 c-4.5 15 6 27 21 24 c15 -3 24 -12 39 -9 c15 3 24 -6 24 -18 c0 -12 -12 -21 -33 -21z"/>
  <path class="petal petal--red" d="M102 119 c-9 9 -6 21 6 24 c12 1.5 21 -6 24 -18"/>
  <path d="M159 89 c12 3 18 12 15 21 c-1.5 6 -7.5 6 -9 1.5"/>
  <path class="vein" d="M96 95 c15 -9 33 -9 51 -3"/>
  <path class="vein" d="M93 107 c15 0 30 -3 45 -6"/>
  <path d="M100 122 Q84 108 66 112"/>
  <path d="M66 112 c-2.1 6.3 -4.2 10.5 -2.1 16.8"/>
  <path class="petal petal--red" d="M63.9 128.8 c14.7 -2.1 31.5 4.2 35.7 16.8 c3.2 10.5 -4.2 18.9 -14.7 16.8 c-10.5 -2.1 -16.8 -8.4 -27.3 -6.3 c-10.5 2.1 -16.8 -4.2 -16.8 -12.6 c0 -8.4 8.4 -14.7 23.1 -14.7z"/>
  <path class="petal petal--red" d="M87 160.3 c6.3 6.3 4.2 14.7 -4.2 16.8 c-8.4 1.1 -14.7 -4.2 -16.8 -12.6"/>
  <path d="M47.1 139.3 c-8.4 2.1 -12.6 8.4 -10.5 14.7 c1.1 4.2 5.2 4.2 6.3 1.1"/>
  <path class="vein" d="M91.2 143.5 c-10.5 -6.3 -23.1 -6.3 -35.7 -2.1"/>
  <path class="vein" d="M93.3 151.9 c-10.5 0 -21 -2.1 -31.5 -4.2"/></svg></div><div class="plate__side"><p class="plate__note">권다온 세밀화 — 압착 전 생체를 보고 그렸습니다.</p><div class="label label--compact"><p class="label__binomial">Impatiens textorii <span class="auth">Miq.</span></p><p class="label__name">물봉선</p><dl class="label__fields"><div class="label__f"><dt class="label__k">수장번호</dt><dd class="label__v id">DMH-024166</dd></div><div class="label__f"><dt class="label__k">도판</dt><dd class="label__v">3 / 4</dd></div></dl></div></div></article></li><li class="plates__slide" data-name="얼레지"><article class="plate"><p class="plate__no">Tabula IV</p><div class="plate__art"><svg class="flora" viewBox="0 0 200 300" data-draw aria-hidden="true"><path d="M100 296 C98 220 104 150 112 96 C116 80 118 72 116 64"/>
  <path class="petal" d="M116 70 Q118.6 122.4 135.1 54.5 Q132.6 118.4 118 72z"/>
  <path class="petal" d="M116 70 Q103 121.4 106.9 57.5 Q117 117.4 118 72z"/>
  <path class="petal" d="M116 70 Q88.7 111.4 81.3 59 Q102.7 107.4 118 72z"/>
  <path class="petal" d="M116 70 Q123.4 105.5 143.7 63.5 Q137.4 101.5 118 72z"/>
  <path class="petal" d="M116 70 Q95.8 111.3 94 65 Q109.8 107.3 118 72z"/>
  <path class="petal" d="M116 70 Q87.2 91.6 78.6 68 Q101.2 87.6 118 72z"/>
  <path d="M116 72 L112 96"/><path d="M116 72 L120 98"/><path d="M116 72 L116 100"/>
  <path d="M100 290 L93.5 282.5 L86.7 275.1 L80.2 267.7 L74.1 260 L68.5 252.2 L63.5 244.1 L59.2 235.7 L55.7 227 L52.8 218.1 L50.5 208.9 L48.8 199.4 L47.6 189.8 L46.6 180.1 L45.8 170.3 L45 160.6 L43.8 150.9 L49.7 158.7 L55.9 166.3 L62.1 173.9 L68.1 181.5 L73.9 189.3 L79.2 197.3 L84 205.5 L88.1 213.9 L91.6 222.6 L94.3 231.6 L96.4 240.9 L97.8 250.4 L98.7 260.2 L99.2 270.1 L99.5 280.1 L100 290 Z"/>
  <path class="vein" d="M100 290 Q73 223.2 48.2 161.8"/>
  <path d="M100 290 L100.4 280.7 L100.6 271.4 L101 262.1 L101.8 253 L103.1 244.1 L105 235.4 L107.6 227 L110.8 218.9 L114.7 211 L119.2 203.4 L124.1 195.9 L129.6 188.7 L135.3 181.6 L141.1 174.5 L146.9 167.4 L152.4 160.2 L151.4 169.2 L150.7 178.4 L150 187.5 L149.1 196.6 L148 205.6 L146.4 214.4 L144.3 223 L141.6 231.3 L138.3 239.4 L134.3 247.2 L129.6 254.8 L124.4 262.1 L118.6 269.2 L112.5 276.2 L106.2 283 L100 290 Z"/>
  <path class="vein" d="M100 290 Q125.2 227.7 148.3 170.4"/>
  <path class="vein" d="M70 200 q6 -4 10 1 q-4 6 -10 -1z"/>
  <path class="vein" d="M82 232 q6 -4 10 1 q-4 6 -10 -1z"/>
  <path class="vein" d="M64 248 q6 -4 10 1 q-4 6 -10 -1z"/>
  <path class="vein" d="M130 214 q6 -4 10 1 q-4 6 -10 -1z"/>
  <path class="vein" d="M122 246 q6 -4 10 1 q-4 6 -10 -1z"/>
  <path class="vein" d="M138 184 q6 -4 10 1 q-4 6 -10 -1z"/></svg></div><div class="plate__side"><p class="plate__note">권다온 세밀화 — 압착 전 생체를 보고 그렸습니다.</p><div class="label label--compact"><p class="label__binomial">Erythronium japonicum <span class="auth">Decne.</span></p><p class="label__name">얼레지</p><dl class="label__fields"><div class="label__f"><dt class="label__k">수장번호</dt><dd class="label__v id">DMH-024041</dd></div><div class="label__f"><dt class="label__k">도판</dt><dd class="label__v">4 / 4</dd></div></dl></div></div></article></li></ol></div>
<div class="plates__bar"><button class="plates__btn" data-prev aria-label="이전 도판"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg></button><p class="plates__count">도판 <b data-current>1</b> / <span data-total>4</span></p><button class="plates__btn" data-next aria-label="다음 도판"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg></button><button class="plates__btn plates__play" data-play aria-pressed="false" aria-label="넘겨보기 시작"><svg class="icon icon-play" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5l11 7-11 7z"/></svg><svg class="icon icon-pause" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14M16 5v14"/></svg></button><div class="plates__index"></div></div></section>
```
- 위 스니펫은 도판 4장으로 줄인 축약본(`data-total` 4)이다. 실제 화면은 DIRECTION 9절의 8장을 모두 넣고 `data-total`을 8로 쓴다(index.html 도판 구역이 원본).
- 자동 넘김 없음. ▶ 버튼을 눌러야 5.2초마다 넘어가고(`aria-pressed`), 마우스를 올리면 멈춘다. ←/→ 키, 밀기, 번호표(`.plates__index`는 비워 두면 app.js가 채운다). 처음·끝에서 이전/다음은 `disabled`(`data-loop`를 주면 순환).
- 슬라이드가 바뀌면 그 도판의 `data-draw` 세밀화를 다시 그린다. 도판은 DIRECTION 9절 순서(동자꽃·투구꽃·물봉선·얼레지·큰앵초·둥근이질풀·들메나무·금강초롱꽃).

### code — Darwin Core 레코드 `components/code.css`
```html
<figure class="dwc"><figcaption class="dwc__head"><span>Darwin Core 레코드 · <span class="id">DMH-024163</span></span><button class="btn btn--sm btn--line" type="button" data-copy="dwc1">복사</button></figcaption><pre class="dwc__pre" id="dwc1" tabindex="0"><code><span class="dwc__l"><span class="p">{</span></span>
<span class="dwc__l">  <span class="k">"catalogNumber"</span><span class="p">:</span> <span class="s">"DMH-024163"</span><span class="p">,</span></span>
<span class="dwc__l">  <span class="k">"scientificName"</span><span class="p">:</span> <span class="s">"Hanabusaya asiatica (Nakai) Nakai"</span><span class="p">,</span></span>
<span class="dwc__l">  <span class="k">"eventDate"</span><span class="p">:</span> <span class="s">"2026-08-21"</span><span class="p">,</span></span>
<span class="dwc__l">  <span class="k">"minimumElevationInMeters"</span><span class="p">:</span> <span class="n">1042</span><span class="p">,</span></span>
<span class="dwc__l">  <span class="k">"recordedBy"</span><span class="p">:</span> <span class="s">"서연우"</span></span>
<span class="dwc__l"><span class="p">}</span></span></code></pre></figure>
```
- 줄마다 `<span class="dwc__l">`(줄번호는 CSS). 토큰 `.k .s .n .p .c`. 강조 줄 `.dwc__l.is-hl`. 복사 `data-copy="pre의 id"`(완료 시 "복사됨" + 토스트). 인라인 코드는 `<code class="kbd-code">`.

### command — 표본 찾기 ⌘K `components/command.css`
실제 팔레트는 1-D 셸. index의 열린 견본(정적):
```html
<div class="cmd cmd--static" role="dialog" aria-label="표본 찾기 견본"><div class="cmd__box"><div class="cmd__bar"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5L21 21"/></svg><input class="cmd__input" value="초롱" aria-label="표본 찾기"><kbd class="cmd__esc">Esc</kbd></div>
<div class="cmd__list" role="listbox"><div class="cmd__section" role="group"><p class="cmd__group">국명</p><a class="cmd__item" role="option" aria-selected="true" href="dashboard.html"><span class="cmd__name">금강초롱꽃</span><i class="binomial">Hanabusaya asiatica</i><span class="cmd__no">DMH-024163</span></a><a class="cmd__item" role="option" href="dashboard.html"><span class="cmd__name">초롱꽃</span><i class="binomial">Campanula punctata</i><span class="cmd__no">DMH-022904</span></a></div>
<div class="cmd__section" role="group"><p class="cmd__group">화면</p><a class="cmd__item" role="option" href="dashboard.html"><span class="cmd__name">공정 보드</span><span class="cmd__desc">63점 · 6단계</span><span class="cmd__no">kanban</span></a></div></div>
<footer class="cmd__foot"><span><kbd>↑</kbd><kbd>↓</kbd> 이동</span><span><kbd>Enter</kbd> 열기</span><span><kbd>Esc</kbd> 닫기</span></footer></div></div>
```
- `.cmd--static`은 흐름 안에 열린 모습을 그린다(포커스 트랩 없음). 결과 행 `.cmd__item` = `.cmd__name` + `.binomial` 또는 `.cmd__desc` + `.cmd__no`. 활성 `aria-selected="true"`, 비활성 `aria-disabled="true"`.

### drawer — 대출 신청서 `components/drawer.css`
```html
<div class="drawer" id="d-loan" role="dialog" aria-modal="true" aria-labelledby="d-loan-title" hidden>
  <div class="drawer__glassine" data-close></div>
  <section class="drawer__panel">
    <span class="drawer__tab" aria-hidden="true">대출 신청서</span>
    <header class="drawer__head">
      <div><p class="drawer__kicker">대출 <span class="id">LN-2026-031</span> · 신청 대기</p><h2 class="drawer__title" id="d-loan-title">초롱꽃속 13점</h2></div>
      <button class="btn btn--icon" type="button" data-close aria-label="닫기">(x 아이콘)</button>
    </header>
    <div class="drawer__body"> …form 필드 · slip… </div>
    <footer class="drawer__foot"><button class="btn btn--line" type="button" data-close>보류</button><button class="btn" type="button" data-close data-toast-title="대출을 승인했습니다" data-toast-text="LN-2026-031 · 초롱꽃속 13점">대출 승인</button></footer>
  </section>
</div>
<button class="btn btn--line" type="button" data-drawer-open="d-loan" aria-expanded="false">대출 신청서</button>
```
- 오른쪽 420px(모바일 전폭), 왼쪽 가장자리 manila 손잡이. `.drawer--left`(왼쪽, 1-C). 정적 견본 `.drawer--static`(glassine·hidden 없이):
```html
<div class="drawer drawer--static" role="dialog" aria-labelledby="dt"><section class="drawer__panel"><span class="drawer__tab">대출 신청서</span>
<header class="drawer__head"><div><p class="drawer__kicker">대출 <span class="id">LN-2026-031</span> · 신청 대기</p><h2 class="drawer__title" id="dt">초롱꽃속 13점</h2></div></header>
<div class="drawer__body"><div class="field"><div class="field__box"><label class="field__name" for="d1">신청자</label><input class="field__control" id="d1" value="정민구 · 한빛대학교 생명과학과" readonly></div></div><div class="field"><div class="field__box"><label class="field__name" for="d2">반납 예정</label><input class="field__control fig" id="d2" value="2026-10-08"></div></div>
<aside class="slip slip--note" role="note"><p class="slip__head">안내<span class="sc">NOTE</span></p><div><p class="slip__text">대출 중 2건 73점 — 기관 연간 6건 중 3번째입니다.</p></div></aside></div>
<footer class="drawer__foot"><button class="btn btn--line">보류</button><button class="btn">대출 승인</button></footer></section></div>
```

### empty — 빈 대지 `components/empty.css`
```html
<section class="void" aria-labelledby="void-title">
  <span class="tape tape--tl"></span><span class="tape tape--tc void__tape-mid"></span><span class="tape tape--tr"></span>
  <span class="void__cross" aria-hidden="true"></span>
  <div class="void__text">
    <h2 class="void__title" id="void-title">이 대지는 아직 비어 있습니다.</h2>
    <p class="void__desc">찾으시는 표본은 다른 서랍에 있거나 아직 수장되지 않았습니다.</p>
    <button class="btn" type="button" data-command-open>표본 찾기</button>
  </div>
  <div class="label label--compact void__label">
    <p class="label__binomial">Indet.</p><p class="label__name">미동정</p>
    <dl class="label__fields"><div class="label__f"><dt class="label__k">수장번호</dt><dd class="label__v">없음</dd></div><div class="label__f"><dt class="label__k">채집인</dt><dd class="label__v">미상</dd></div></dl>
  </div>
</section>
```
`.void--mini`(카드 칸 안 견본) · `.void--specimen`(29:42). 행동 버튼은 1개.

### form — 라벨 칸 문법 `components/form.css`
```html
<form class="form" data-validate data-success-title="야장을 저장했습니다" data-success-text="서연우 412 · 금강초롱꽃 · 입고 대기">
<div class="form__row"><div class="field"><div class="field__box"><label class="field__name" for="f1">국명 <span class="field__req">필수</span></label><input class="field__control" id="f1" required value="금강초롱꽃"></div></div>
<div class="field"><div class="field__box"><label class="field__name" for="f2">학명</label><input class="field__control field__control--binomial" id="f2" value="Hanabusaya asiatica" list="dl1"></div><datalist id="dl1"><option value="Hanabusaya asiatica"><option value="Hanabusaya latisepala"></datalist></div></div>
<div class="form__row--3 form__row"><div class="field"><div class="field__box"><label class="field__name" for="f3">채집일</label><input class="field__control fig" id="f3" type="date" value="2026-08-21"></div></div>
<div class="field field--error"><div class="field__box"><label class="field__name" for="f4">좌표 <span class="field__req">필수</span></label><input class="field__control id" id="f4" aria-invalid="true" aria-describedby="f4-err" value="N 37°56′ E 128"></div><p class="field__msg field__msg--error" id="f4-err">도·분·초까지 적어 주세요 (예: N 37°56′12″).</p></div>
<div class="field"><div class="field__box field__box--select"><label class="field__name" for="f5">서식지</label><select class="field__control" id="f5"><option>숲 아래 반그늘</option><option>능선 초지</option><option>계곡 습지</option></select></div></div></div>
<div class="form__row"><div class="range"><div class="range__top"><label class="t-field" for="r1">해발</label><output class="range__out" for="r1">1,042 m</output></div><input class="range__input" id="r1" type="range" min="0" max="1700" step="1" value="1042" data-unit=" m"><div class="range__scale"><span>0</span><span>1,700 m</span></div></div>
<div class="field"><div class="field__box"><label class="field__name" for="f6">채집인 · 번호</label><input class="field__control" id="f6" disabled value="서연우 412"></div><p class="field__msg">채집인 번호는 자동으로 매깁니다.</p></div></div>
<div class="field"><div class="field__box"><label class="field__name" for="f7">메모</label><textarea class="field__control" id="f7">신갈나무 숲 아래 반그늘. 꽃 5송이, 개체군 약 40포기.</textarea></div></div>
<label class="drop"><input class="drop__input" type="file" accept="image/*" multiple data-max-mb="20"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h4l1.5-2h5L16 7h4v12H4z"/><circle cx="12" cy="13" r="3.5"/></svg><span class="drop__title">현장 사진을 대지에 올려 두세요</span><span class="drop__hint">한 장에 20 MB까지 · JPG, HEIC</span></label>
<fieldset class="choice-cards"><legend class="sr-only">서식지 유형</legend><label class="choice-card"><input type="radio" class="radio" name="h" checked>숲 아래 반그늘</label><label class="choice-card"><input type="radio" class="radio" name="h">능선 초지</label><label class="choice-card"><input type="radio" class="radio" name="h">계곡 습지</label></fieldset>
<div class="form__row"><div><label class="switch"><span class="switch__text">희귀종 좌표 비공개<small>시·군 단위까지만 공개합니다</small></span><input class="switch__input" type="checkbox" role="switch" checked disabled></label>
<label class="switch"><span class="switch__text">동정 회신 알림</span><input class="switch__input" type="checkbox" role="switch"></label></div>
<fieldset class="choice-group"><legend>확인</legend><label class="choice"><input type="checkbox" class="check" checked><span class="choice__text">채집 허가 제2026-인제-114호 범위 안에서 채집했습니다</span></label><label class="choice"><input type="checkbox" class="check" required><span class="choice__text">희귀·특산종 채집 금지 목록을 확인했습니다</span></label><label class="choice"><input type="radio" class="radio" name="x" disabled><span class="choice__text">대리 채집(비활성)</span></label></fieldset></div>
<div class="btn-row"><button class="btn" type="submit"><span class="btn__label">야장 저장</span></button><button class="btn btn--line" type="button">임시 보관</button><button class="btn btn--ghost" type="button" data-form-reset>지우기</button></div>
</form>
```
- 입력 칸 `.field > .field__box > label.field__name + .field__control` + `.field__msg`(도움말) / `.field__msg--error`(오류). 필수 표시 `<span class="field__req">필수</span>`, 선택 `.field__opt`.
- 변형: 번호·좌표 `.field__control.id` · 날짜·수량 `.field__control.fig` · 학명 `.field__control--binomial` · select는 `.field__box--select` · 단위 붙임 `.field__inline > input + .field__affix` · textarea(야장 괘선 28px).
- 상태: hover · focus-within(링) · 오류 `aria-invalid="true"`(또는 `.field--error`) · `disabled`(점선) · `readonly`.
- `.choice`(체크/라디오 행, 44px) · `.choice-group`(fieldset) · `.choice-cards > .choice-card`(라벨 칸 카드 라디오) · `.switch > .switch__text + input.switch__input[role=switch]`(트랙 = 미니 축척자, 끌 수 없는 항목은 `checked disabled` + `.switch__lock` 이유) · `.range`(축척자 트랙, `data-unit`, `.range__out`) · `.drop`(점선 대지 파일 올리기, `data-max-mb`) · `.search`(검색 칸).
- 검증: `<form data-validate data-success-title="…" data-success-text="…">` — 제출 시 `required/pattern/min/max`를 검사해 `aria-invalid` + 오류 문구(`data-error`로 문구 지정)를 달고 첫 칸에 포커스. 통과하면 제출 버튼 로딩 1.3초 → 성공 토스트. 오류 개수 요약은 `<p data-form-summary hidden>오류 <b data-error-count></b>곳</p>`. 초기화 `[data-form-reset]`.

### kanban — 공정 보드 `components/kanban.css`
```html
<div class="board" data-kanban data-toast><p class="board__hint sr-only" id="bh">Alt와 좌우 화살표로 공정을 옮깁니다.</p><section class="board__col" data-name="입고" aria-labelledby="col0"><h3 class="ftab board__head" id="col0">입고 <span class="ftab__count" data-count>9</span></h3><ul class="board__list" aria-label="입고 표본"><li class="kcard" data-no="DMH-024171" data-name="참당귀"><span class="label label--vertical kcard__name">참당귀</span><div class="kcard__body"><p class="kcard__binomial binomial">Angelica gigas</p><p class="kcard__no">DMH-024171</p><div class="kcard__meta"><span class="avatar avatar--sm avatar--sap">백</span><span class="kcard__due">08-28 (금)</span></div></div><button class="kcard__next" type="button"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></button></li></ul><p class="board__more">외 <span class="fig">8</span>점</p></section><section class="board__col" data-name="건조" aria-labelledby="col1"><h3 class="ftab board__head" id="col1">건조 <span class="ftab__count" data-count>14</span></h3><ul class="board__list" aria-label="건조 표본"><li class="kcard" data-no="DMH-024168" data-name="둥근이질풀"><span class="label label--vertical kcard__name">둥근이질풀</span><div class="kcard__body"><p class="kcard__binomial binomial">Geranium koreanum</p><p class="kcard__no">DMH-024168</p><div class="gauge gauge--mini" role="progressbar" aria-valuemin="0" aria-valuemax="7" aria-valuenow="5" style="--val:71.4%;--steps:7"><div class="gauge__top"><span class="gauge__name">건조</span><span class="gauge__value">5 / 7<span class="gauge__unit">일</span></span></div><div class="gauge__track"><span class="gauge__fill"></span></div></div><div class="kcard__meta"><span class="avatar avatar--sm avatar--sap">백</span><span class="kcard__due">08-29 (토)</span></div></div><button class="kcard__next" type="button"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></button></li><li class="kcard" data-no="DMH-024166" data-name="물봉선"><span class="label label--vertical kcard__name">물봉선</span><div class="kcard__body"><p class="kcard__binomial binomial">Impatiens textorii</p><p class="kcard__no">DMH-024166</p><div class="kcard__meta"><span class="avatar avatar--sm avatar--violet">김</span><span class="kcard__due">08-28 (금)</span></div></div><button class="kcard__next" type="button"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></button></li></ul><p class="board__more">외 <span class="fig">12</span>점</p></section><section class="board__col" data-name="동정" aria-labelledby="col2"><h3 class="ftab board__head" id="col2">동정 <span class="ftab__count" data-count>11</span></h3><ul class="board__list" aria-label="동정 표본"><li class="kcard is-flagged" data-no="DMH-024155" data-name="투구꽃"><span class="label label--vertical kcard__name">투구꽃</span><div class="kcard__body"><p class="kcard__binomial binomial">Aconitum jaluense</p><p class="kcard__no">DMH-024155</p><span class="badge badge--tox badge--sm">맨손 금지</span><div class="kcard__meta"><span class="avatar avatar--sm avatar--sap">문</span><span class="kcard__due">08-28 (금)</span></div></div><button class="kcard__next" type="button"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></button></li><li class="kcard" data-no="DMH-024150" data-name="산오이풀"><span class="label label--vertical kcard__name">산오이풀</span><div class="kcard__body"><p class="kcard__binomial binomial">Sanguisorba hakusanensis</p><p class="kcard__no">DMH-024150</p><div class="kcard__meta"><span class="avatar avatar--sm avatar--sap">문</span><span class="kcard__due">09-01 (화)</span></div></div><button class="kcard__next" type="button"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></button></li></ul><p class="board__more">외 <span class="fig">9</span>점</p></section><section class="board__col" data-name="마운팅" aria-labelledby="col3"><h3 class="ftab board__head" id="col3">마운팅 <span class="ftab__count" data-count>17</span></h3><ul class="board__list" aria-label="마운팅 표본"><li class="kcard" data-no="DMH-024163" data-name="금강초롱꽃"><span class="label label--vertical kcard__name">금강초롱꽃</span><div class="kcard__body"><p class="kcard__binomial binomial">Hanabusaya asiatica</p><p class="kcard__no">DMH-024163</p><div class="kcard__meta"><span class="avatar avatar--sm avatar--sap">백</span><span class="kcard__due">08-27 (목)</span></div></div><button class="kcard__next" type="button"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></button></li><li class="kcard" data-no="DMH-024159" data-name="동자꽃"><span class="label label--vertical kcard__name">동자꽃</span><div class="kcard__body"><p class="kcard__binomial binomial">Lychnis cognata</p><p class="kcard__no">DMH-024159</p><div class="kcard__meta"><span class="avatar avatar--sm avatar--sap">백</span><span class="kcard__due">08-31 (월)</span></div></div><button class="kcard__next" type="button"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></button></li></ul><p class="board__more">외 <span class="fig">15</span>점</p></section><section class="board__col" data-name="촬영" aria-labelledby="col4"><h3 class="ftab board__head" id="col4">촬영 <span class="ftab__count" data-count>8</span></h3><ul class="board__list" aria-label="촬영 표본"><li class="kcard" data-no="DMH-024138" data-name="노루오줌"><span class="label label--vertical kcard__name">노루오줌</span><div class="kcard__body"><p class="kcard__binomial binomial">Astilbe rubra</p><p class="kcard__no">DMH-024138</p><div class="kcard__meta"><span class="avatar avatar--sm avatar--sap">이</span><span class="kcard__due">08-28 (금)</span></div></div><button class="kcard__next" type="button"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></button></li></ul><p class="board__more">외 <span class="fig">7</span>점</p></section><section class="board__col" data-name="수장 대기" aria-labelledby="col5"><h3 class="ftab board__head" id="col5">수장 대기 <span class="ftab__count" data-count>4</span></h3><ul class="board__list" aria-label="수장 대기 표본"></ul><p class="board__more">대지 <span class="fig">4</span>매 — 서랍 배정 대기 · 어제 수장 큰앵초 <span class="id">DMH-024117</span></p></section></div>
```
- 열 6개 고정, 순서는 팩트 시트의 유일한 공정 순서(입고 9 · 건조 14 · 동정 11 · 마운팅 17 · 촬영 8 · 수장 대기 4), `[data-count]`는 app.js가 이동에 맞춰 고친다. `data-toast`가 있으면 이동마다 토스트.
- **수장 대기 열에는 표본 카드를 넣지 않는다.** 팩트 시트 12점 중 수장 대기 상태인 표본이 없다(모데미풀 DMH-024096은 수장 완료). kanban.html은 이름 없는 "대지 4매 더미" + "어제 수장한 대지(큰앵초 DMH-024117)"로 그린다.
- 카드 `li.kcard` = `.label--vertical.kcard__name`(국명) + `.kcard__body`(학명·번호·`.gauge--mini`·배지·`.kcard__meta`(아바타 + `.kcard__due`, 늦으면 `.is-late`)) + `.kcard__next`(다음 공정으로). 유독·문제 `.is-flagged`. 키보드: 카드 포커스 후 Alt+←/→ 이동, ↑↓ 같은 열, ←→ 이웃 열.

### list — 채집 목록 `components/list.css`
```html
<ul class="flist"><li><a class="flist__row" href="#ledger" ><span class="flist__thumb" aria-hidden="true"><svg class="flora" viewBox="0 0 32 32"  aria-hidden="true"><path d="M16 30 L16 18"/>
  <ellipse class="petal" cx="16" cy="6" rx="3.6" ry="3.6"/>
  <ellipse class="petal" cx="20.8" cy="9.5" rx="3.6" ry="3.6"/>
  <ellipse class="petal" cx="18.9" cy="15" rx="3.6" ry="3.6"/>
  <ellipse class="petal" cx="13.1" cy="15" rx="3.6" ry="3.6"/>
  <ellipse class="petal" cx="11.2" cy="9.5" rx="3.6" ry="3.6"/>
  <circle cx="16" cy="11" r="1.4"/>
  <path d="M16 24 l-7 -2 M16 24 l7 -2"/></svg></span><span class="flist__main"><b class="flist__name">둥근이질풀</b><i class="binomial">Geranium koreanum</i></span><span class="flist__meta"><span class="flist__no">서연우 409</span><span class="flist__sub">08-20</span></span></a></li><li><a class="flist__row" href="#ledger" aria-current="true"><span class="flist__thumb" aria-hidden="true"><svg class="flora" viewBox="0 0 32 32"  aria-hidden="true"><path d="M16 3 C15 10 17 18 16 30"/>
  <path class="petal" d="M16 6 q-6 1 -7 9 l2 -1 l1 2 l2 -1 l2 1 q1 -7 0 -10z"/>
  <path class="petal" d="M16 11 q6 1 7 8 l-2 -1 l-1 2 l-2 -1 l-2 1 q-1 -6 0 -9z"/>
  <path d="M16 24 q-6 -2 -9 1 q4 3 9 -1z"/>
  <path d="M16 22 q6 -3 9 0 q-4 3 -9 0z"/></svg></span><span class="flist__main"><b class="flist__name">금강초롱꽃</b><i class="binomial">Hanabusaya asiatica</i></span><span class="flist__meta"><span class="flist__no">서연우 412</span><span class="flist__sub">08-21</span></span></a></li><li><a class="flist__row" href="#ledger" ><span class="flist__thumb" aria-hidden="true"><svg class="flora" viewBox="0 0 32 32"  aria-hidden="true"><path d="M16 30 L16 14"/>
  <path d="M16 14 L9 9 M16 14 L16 7 M16 14 L23 9"/>
  <circle class="petal petal--red" cx="9" cy="8" r="3.4"/>
  <circle class="petal petal--red" cx="16" cy="5.5" r="3.4"/>
  <circle class="petal petal--red" cx="23" cy="8" r="3.4"/>
  <path d="M16 30 q-8 -1 -10 -6 q6 -1 10 6z"/></svg></span><span class="flist__main"><b class="flist__name">큰앵초</b><i class="binomial">Primula jesoana</i></span><span class="flist__meta"><span class="flist__no">서연우 318</span><span class="flist__sub">06-11</span></span></a></li><li><a class="flist__row" href="#ledger" ><span class="flist__thumb" aria-hidden="true"><svg class="flora" viewBox="0 0 32 32"  aria-hidden="true"><path d="M15 30 C15 22 17 14 18 8"/>
  <path class="petal" d="M18 8 q-6 4 -10 -2 q5 0 10 2z"/>
  <path class="petal" d="M18 8 q6 4 9 -2 q-5 0 -9 2z"/>
  <path class="petal" d="M18 8 q-1 6 -5 6"/>
  <path d="M15 30 q-8 -6 -9 -14"/>
  <path d="M15 30 q8 -6 9 -14"/></svg></span><span class="flist__main"><b class="flist__name">얼레지</b><i class="binomial">Erythronium japonicum</i></span><span class="flist__meta"><span class="flist__no">서연우 266</span><span class="flist__sub">04-18</span></span></a></li></ul>
```
- 행은 `a`·`button`·`div`. 현재 `aria-current="true"`. 썸네일은 부록 A의 32px 썸네일.
- 편지함 `.flist--inbox`: 썸네일 자리에 아바타, `.flist__subject`, 안 읽음 `.flist__row.is-unread`. 값 목록 `.flist--plain`.

### marquee — 입고 띠 `components/marquee.css`
```html
<div class="marquee" data-marquee role="region" aria-label="오늘 입고 띠"><div class="marquee__viewport"><div class="marquee__track"><ul class="marquee__list"><li><span class="id">DMH-024171</span><b>참당귀</b> 입고</li><li><span class="id">DMH-024168</span><b>둥근이질풀</b> 건조 5일째</li><li><span class="id">DMH-024166</span><b>물봉선</b> 건조 6일째</li><li><span class="id">DMH-024163</span><b>금강초롱꽃</b> 촬영 8/28 (금)</li><li class="is-warn"><span class="id">DMH-024155</span><b>투구꽃</b> 동정 대기 · 유독</li><li><span class="id">DMH-024117</span><b>큰앵초</b> 수장 완료</li></ul></div></div><button class="marquee__toggle" type="button" data-marquee-toggle aria-pressed="false" aria-label="입고 띠 멈추기"><svg class="icon icon-pause" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14M16 5v14"/></svg><svg class="icon icon-play" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5l11 7-11 7z"/></svg></button><div class="ruler ruler--quiet marquee__ruler" data-cm="auto" aria-hidden="true"></div></div>
```
- 사이트에 1곳(index 8장 · dashboard). 항목은 팩트 시트 공정 값만. 멈춤 버튼 필수.

### menu — 대지 메뉴 `components/menu.css`
```html
<div class="menu-wrap">
  <button class="btn btn--icon btn--line" type="button" data-menu="menu-sheet" aria-label="대지 메뉴">(dots 아이콘)</button>
  <ul class="menu menu--end" id="menu-sheet" hidden>
    <li class="menu__label" role="presentation">대지 <span class="id">DMH-024163</span></li>
    <li role="none"><button class="menu__item" type="button" data-toast-title="촬영을 요청했습니다" data-toast-tone="note">(camera 아이콘)촬영 요청<span class="menu__hint">08-28</span></button></li>
    <li role="none"><button class="menu__item" type="button">라벨 다시 출력</button></li>
    <li role="none"><button class="menu__item" type="button">서랍 옮기기</button></li>
    <li role="separator" class="menu__sep"></li>
    <li role="none"><button class="menu__item menu__item--danger" type="button">폐기 신청</button></li>
  </ul>
</div>
```
- role(menu/menuitem)·aria-expanded는 app.js가 붙인다. ↑↓ Home End, 첫 글자 이동, Esc·바깥 클릭·Tab 닫기. 선택형은 `role="menuitemradio" aria-checked`. 비활성 `disabled`. 오른쪽 정렬 `.menu--end`, 위로 `.menu--up`, 견본 `.menu--static`(hidden 없이).

### modal — 표본 상세 `components/modal.css`
```html
<div class="modal" id="m-specimen" role="dialog" aria-modal="true" aria-labelledby="m-specimen-title" hidden>
  <div class="modal__glassine" data-close></div>
  <div class="modal__sheet">
    <span class="tape" style="--x:22%;--r:-2deg"></span><span class="tape" style="--x:78%;--r:2deg"></span>
    <header class="modal__head">
      <div><p class="modal__kicker">표본 상세 · <span class="id">DMH-024163</span></p>
        <h2 class="modal__title" id="m-specimen-title">금강초롱꽃 <span class="binomial">Hanabusaya asiatica</span></h2></div>
      <button class="btn btn--icon" type="button" data-close aria-label="닫기">(x 아이콘)</button>
    </header>
    <div class="modal__body">
      <div class="modal__split"><div class="modal__plate">(세밀화)</div>(대표 라벨 .label)</div>
    </div>
    <footer class="modal__foot">
      <p class="modal__foot-note">마운팅 완료 · 촬영 8/28 (금)</p>
      <button class="btn btn--line" type="button" data-close>닫기</button>
      <button class="btn" type="button" data-close data-toast-title="촬영을 요청했습니다" data-toast-text="DMH-024163 · 촬영대 2번 · 8/28 (금)" data-toast-tone="note">촬영 요청</button>
    </footer>
  </div>
</div>
<button class="btn" type="button" data-modal-open="m-specimen" aria-expanded="false">표본 상세</button>
```
- 폭 640(`.modal--sm` 440 · `.modal--lg` 880), 모바일 하단 시트. 파괴적 확인 `.modal--danger`. 확인 버튼은 우하단(foot 오른쪽). 포커스 트랩·Esc·글라신 클릭 닫기·트리거로 포커스 복귀.
- index 라이트 테이블의 열린 견본: `.modal--static`을 붙이고 `hidden`·`aria-modal`을 뺀다(`role="dialog"`는 유지, glassine은 견본 영역만 덮음).

### motion — 모션 시연 `components/motion.css`
```html
<div class="motion-grid"><div class="motion-tile"><div class="motion-tile__stage"><span class="stamp" id="ms" data-date="2026.08.26"></span></div><p class="motion-tile__name">도장 찍기 <span class="id">180ms</span></p><button class="btn btn--sm btn--line" data-replay="stamp" data-target="ms">도장 찍기</button></div>
<div class="motion-tile"><div class="motion-tile__stage" id="mt2"><span class="motion-swatch"></span><span class="tape" style="--x:50%;--y:20px"></span></div><p class="motion-tile__name">테이프 붙이기 <span class="id">160ms</span></p><button class="btn btn--sm btn--line" data-replay="tape" data-target="mt2">테이프 붙이기</button></div></div>
```
- `data-replay` 종류: `draw`(세밀화 다시 그리기) · `stamp`(도장 찍기) · `tape`(테이프 붙이기) · `settle`(내려앉기) · `lift`(대지 들기) · `sway`(매달린 라벨 흔들기 토글, `aria-pressed`). `data-target`은 대상 id(없으면 같은 `.motion-tile` 안).
- **장면에서는 `.motion-grid` 진열을 쓰지 않는다**(카드에 하나씩 담은 갤러리 = 브리프 3절 금지). 동작 버튼은 실제 사물 옆에 둔다 — index 도판 구역의 `.pmargin`(도판 여백: 연필 지시선 + '이 도판에 하는 일' 줄 + 버튼, `data-target`은 캐러셀 `#plates-main`·`#plates-vp`·도판 위 `#plate-stamp`·`#plate-tapes`·걸어 둔 값표 `#msway`)이 기준. `.motion-grid`/`.motion-tile`은 컴포넌트 단독 테스트용으로만 남는다.
- 유틸: `.lift`(hover 들기) `.press`(누름 1px) `.sway`(4s, hover 정지). 전역 스크롤 페이드·패럴랙스 금지. `prefers-reduced-motion`이면 드로잉은 완성선, 도장·테이프는 최종 상태, 오버레이는 opacity만.

### navbar — 표찰 띠 `components/navbar.css`
1-A / 1-B 셸 그대로. 바닥글 `.site-foot`도 이 파일에 있다(1-F). 모바일 내비 목록 `.navlist`(1-C).

### pagination — 서랍 번호표 `components/pagination.css`
```html
<nav class="pager" aria-label="서랍 번호">
  <span class="pager__lead">서랍</span>
  <button class="pager__step" type="button" aria-label="앞 서랍">‹</button>
  <button class="pager__no" type="button">12</button><button class="pager__no" type="button">13</button>
  <button class="pager__no" type="button" aria-current="page">14</button>
  <button class="pager__no" type="button">15</button><span class="pager__gap" aria-hidden="true">…</span>
  <button class="pager__no" type="button">31</button>
  <button class="pager__step" type="button" aria-label="다음 서랍">›</button>
  <span class="pager__meta">312매 중 1–12</span>
</nav>
```
모바일은 현재 칸·화살표만 남는다(`.pager__no--keep`로 더 남길 수 있음). 끝이면 `disabled`.

### popover — 학명 쪽지 `components/popover.css`
```html
<span class="pop-wrap">
  <button class="pop-trigger binomial" type="button" data-popover="pop-hana">Hanabusaya asiatica</button>
  <div class="pop" id="pop-hana" role="dialog" aria-label="금강초롱꽃 학명 정보" hidden>
    <div class="label">
      <p class="label__head"><span>학명 쪽지</span><span class="sc">Campanulaceae</span></p>
      <p class="label__binomial">Hanabusaya asiatica <span class="auth">(Nakai) Nakai</span></p>
      <p class="label__name">금강초롱꽃</p>
      <dl class="label__fields">
        <div class="label__f"><dt class="label__k">과</dt><dd class="label__v">초롱꽃과</dd></div>
        <div class="label__f"><dt class="label__k">분포</dt><dd class="label__v">한국 특산 — 강원·경기 북부</dd></div>
      </dl>
      <div class="bloom"><p class="bloom__cap"><span>개화 달력</span><span>8–9월</span></p>
        <span class="bloom__m" data-v="0">1</span> … <span class="bloom__m" data-v="1">7</span><span class="bloom__m" data-v="3">8</span><span class="bloom__m" data-v="2">9</span> … <span class="bloom__m" data-v="0">12</span>
      </div>
    </div>
  </div>
</span>
```
- `.bloom__m` 12개, `data-v` 0 없음 · 1 봉오리 · 2 개화 · 3 절정. 오른쪽이 넘치면 app.js가 `.pop--end`. 견본은 **트리거 없이** `<span class="pop-trigger pop-trigger--open" aria-hidden="true">` + `.pop--static`(hidden 없이, id·`data-popover` 연결 금지 — app.js는 닫힌 상태에서 시작하므로 열린 견본에 실제 트리거를 걸면 첫 클릭이 헛돈다). 실제로 열리는 트리거는 hidden 상태의 별도 `.pop`을 가리킨다. 닫기 버튼이 필요하면 `.pop__close`.

### progress — 축척자 진행 바 `components/progress.css`
```html
<div class="gauge" role="progressbar" aria-labelledby="g-dry" aria-valuemin="0" aria-valuemax="7" aria-valuenow="5" aria-valuetext="건조 5일째, 7일 중" style="--val:71.4%;--steps:7">
  <div class="gauge__top"><span class="gauge__name" id="g-dry">건조 · 둥근이질풀</span><span class="gauge__value">5 / 7<span class="gauge__unit">일</span></span></div>
  <div class="gauge__track"><span class="gauge__fill"></span></div>
  <div class="gauge__scale"><span>0</span><span>7<span class="gauge__unit">일</span></span></div>
</div>
```
- `--val`(채움 %) `--steps`(큰 눈금 수). 상태 `.gauge--warn` `.gauge--error` `.gauge--done` · 값 모름 `aria-busy="true"`(빗금이 흐름). 작은 막대 `.gauge--mini`(칸반·표). JS로 갱신: `DMH.setProgress(el, 6)`(`data-unit="일"`이면 값 글자도 바꿈).
- 디지털화 82.1 % = `aria-valuemax="100" aria-valuenow="82.1" style="--val:82.1%"`.

### sidebar — 서랍 색인
1-E 셸 그대로. index의 견본(수장 대장 옆 서랍 색인)은 같은 마크업을 쓰되 링크를 `pages/…`로, 모바일 가로 탭 줄은 `<nav class="drawers drawers--row">`.

### skeleton `components/skeleton.css`
```html
<div class="skel" role="status" aria-label="표본 라벨 불러오는 중">
  <span class="checker checker--sm skel__checker" aria-hidden="true"></span>
  <div class="skel__label" aria-hidden="true">
    <span class="skel__line skel__line--lg"></span><span class="skel__line skel__line--md"></span>
    <div class="skel__fields"><span class="skel__cell"></span><span class="skel__cell"></span><span class="skel__cell"></span><span class="skel__cell"></span></div>
  </div>
</div>
```
- 장면에서는 따로 상자에 진열하지 말고 실제 목록 안의 상태로 둔다(index: 수장 대장 `tr.ledger__state--loading` 행, 빈 결과는 `tr.ledger__state--empty` 안의 `.void--row`).

그림 자리 `<span class="skel__plate"></span>`, 표 행 자리 `<div class="skel-row"><span class="skel__line"></span>…</div>`.

### spinner — 압착기 나비 볼트 `components/spinner.css`
```html
<span class="spinner" role="status"><span class="bolt" aria-hidden="true"></span><span class="spinner__text">대지를 불러오는 중</span></span>
<div class="spinner spinner--block" role="status"><span class="bolt bolt--lg" aria-hidden="true"></span><span class="spinner__text">Darwin Core 레코드를 만드는 중</span></div>
```
- 장면 안의 상태로 쓴다(index: Darwin Core 블록 하단 `.dwc__foot` — '다음 레코드 DMH-024138 노루오줌 — 촬영 사진을 붙여 만드는 중').

### steps — 공정 6단계 `components/steps.css`
```html
<ol class="steps" aria-label="표본 공정"><li class="steps__item" data-state="done"><span class="steps__dot"></span><span class="steps__name">입고</span><span class="steps__date">08-22</span></li><li class="steps__item" data-state="done"><span class="steps__dot"></span><span class="steps__name">건조</span><span class="steps__date">08-22</span></li><li class="steps__item" data-state="done"><span class="steps__dot"></span><span class="steps__name">동정</span><span class="steps__date">08-25</span></li><li class="steps__item" aria-current="step"><span class="steps__dot"></span><span class="steps__name">마운팅</span><span class="steps__date">08-27</span></li><li class="steps__item"><span class="steps__dot"></span><span class="steps__name">촬영</span><span class="steps__date">08-28</span></li><li class="steps__item"><span class="steps__dot"></span><span class="steps__name">수장</span><span class="steps__date">—</span></li></ol>
```
- `data-state="done|error"`, 현재 `aria-current="step"`. 단계 수가 6이 아니면 `style="--n:4"`(onboarding). 눌러서 이동하는 단계는 `<a class="steps__item">`/`<button class="steps__item">`. 세로 `.steps--vertical`.

### table — 수장 대장 `components/table.css`
```html
<div class="ledger-wrap">
<div class="bulkbar" data-bulkbar hidden><p class="bulkbar__count"><b data-bulk-count>0</b>점 선택</p><button class="btn btn--sm" data-bulk-action="촬영 대기">촬영 대기로</button><button class="btn btn--sm btn--line" data-bulk-action="라벨 다시 출력">라벨 다시 출력</button><button class="btn btn--sm btn--ghost" data-bulk-action="clear">선택 해제</button></div>
<div class="ledger-scroll"><table class="ledger ledger--cards" data-select-table><caption>이번 시즌 공정 대지 · 12점</caption><thead><tr><th class="ledger__check"><input type="checkbox" class="check" data-select-all aria-label="모두 선택"></th><th scope="col" aria-sort="descending"><button class="ledger__sort" type="button">수장번호</button></th><th scope="col">국명</th><th scope="col">학명</th><th scope="col">산지 · 해발</th><th scope="col" aria-sort="none"><button class="ledger__sort" type="button">채집일</button></th><th scope="col">채집인·번호</th><th scope="col">공정</th></tr></thead><tbody>
<tr><td class="ledger__check"><input type="checkbox" class="check" data-select-row data-no="DMH-024171" aria-label="DMH-024171 참당귀 선택"></td><td data-k="수장번호"><span class="id">DMH-024171</span></td><td class="k-head" data-k="국명"><b class="ledger__name">참당귀</b></td><td class="ledger__binomial k-wide" data-k="학명"><i class="binomial">Angelica gigas</i> <span class="auth">Nakai</span></td><td data-k="산지 · 해발" class="k-wide">인제 진동계곡 · 720 m</td><td data-k="채집일" class="ledger__date">08-24 <small>(월)</small></td><td data-k="채집인·번호">백도윤 1187</td><td data-k="공정"><span class="badge badge--stage badge--sm" data-stage="intake">입고</span></td></tr>
<tr><td class="ledger__check"><input type="checkbox" class="check" data-select-row data-no="DMH-024168" aria-label="DMH-024168 둥근이질풀 선택"></td><td data-k="수장번호"><span class="id">DMH-024168</span></td><td class="k-head" data-k="국명"><b class="ledger__name">둥근이질풀</b></td><td class="ledger__binomial k-wide" data-k="학명"><i class="binomial">Geranium koreanum</i> <span class="auth">Kom.</span></td><td data-k="산지 · 해발" class="k-wide">인제 곰배령 능선 · 1,090 m</td><td data-k="채집일" class="ledger__date">08-20 <small>(목)</small></td><td data-k="채집인·번호">서연우 409</td><td data-k="공정"><span class="badge badge--stage badge--sm" data-stage="drying">건조 5/7일</span></td></tr>
<tr><td class="ledger__check"><input type="checkbox" class="check" data-select-row data-no="DMH-024166" aria-label="DMH-024166 물봉선 선택"></td><td data-k="수장번호"><span class="id">DMH-024166</span></td><td class="k-head" data-k="국명"><b class="ledger__name">물봉선</b></td><td class="ledger__binomial k-wide" data-k="학명"><i class="binomial">Impatiens textorii</i> <span class="auth">Miq.</span></td><td data-k="산지 · 해발" class="k-wide">인제 방태산 적가리골 · 640 m</td><td data-k="채집일" class="ledger__date">08-19 <small>(수)</small></td><td data-k="채집인·번호">김나래 76</td><td data-k="공정"><span class="badge badge--stage badge--sm" data-stage="drying">건조 6/7일</span></td></tr>
<!-- … 팩트 시트 표본 12점을 같은 형식으로(DMH-024171 → DMH-000001) … -->
</tbody></table></div>
</div>
```
- 표는 `.ledger`, 모바일 라벨 카드가 필요하면 `.ledger--cards` + 각 `td`에 `data-k="필드명"`, 국명 칸 `.k-head`(카드 머리), 넓은 칸 `.k-wide`. 체크 `[data-select-all]`/`[data-select-row]`(+`data-no`), 일괄 동작 바 `[data-bulkbar]` 안 `[data-bulk-count]`·`[data-bulk-action="촬영 대기"]`·`data-bulk-action="clear"`.
- 정렬: `th[aria-sort] > button.ledger__sort` 누르면 그 열로 정렬(`data-sort`로 정렬 값 지정 가능).
- 학명은 한 줄(`.ledger__binomial`, 말줄임 금지), 날짜 `.ledger__date`(nowrap). 행 상태 `aria-selected` · `.is-error` · `.is-muted`, 빈 표 `<tr class="ledger__empty"><td colspan="8">…</td></tr>`, 불러오는 중 `.ledger-wrap[aria-busy="true"]`. 수식 `.ledger--flush`(대지 가장자리 맞춤) `.ledger--dense`.

### tabs — 지역 폴더 탭 `components/tabs.css`
```html
<div class="tabs" data-tabs><div class="tabs__bar scroll-x" data-scroll-hint><div class="tabs__list" role="tablist" aria-label="지역 폴더">
<button class="tabs__tab tabs__tab--all" role="tab" id="tb0" aria-controls="tp0" aria-selected="true">전체 <span class="count">24,117</span></button>
<button class="tabs__tab tabs__tab--gangwon" role="tab" id="tb1" aria-controls="tp1">강원 <span class="count">14,880</span></button>
<button class="tabs__tab tabs__tab--gyeongsang" role="tab" id="tb2" aria-controls="tp2">경상 <span class="count">3,402</span></button>
<button class="tabs__tab tabs__tab--jeolla" role="tab" id="tb3" aria-controls="tp3">전라 <span class="count">2,611</span></button>
<button class="tabs__tab tabs__tab--jeju" role="tab" id="tb4" aria-controls="tp4">제주 <span class="count">1,906</span></button>
<button class="tabs__tab tabs__tab--gyeonggi" role="tab" id="tb5" aria-controls="tp5" disabled>경기·서울 <span class="count">1,318</span></button>
</div></div>
<div class="tabs__panel" role="tabpanel" id="tp0" aria-labelledby="tb0" tabindex="0">…수장 대장(아래 table)…</div>
  <div class="tabs__panel" role="tabpanel" id="tp1" aria-labelledby="tb1" tabindex="0" hidden>…</div>
</div>
```
- 지역색 띠: `.tabs__tab--gangwon|gyeongsang|jeolla|jeju|gyeonggi|all` 또는 `style="--tab-c:var(--region-jeju)"`. 패널은 대지(`.tabs--flush` 패딩 0 · `.tabs--plain` 대지 없이). 대지 안 하위 탭 `.tabs--line`.
- ←→ Home End(app.js), 비활성 `disabled`. 탭 줄은 `.scroll-x[data-scroll-hint]`로 감싼다(모바일 페이드 힌트).

### timeline — 표본 이력 `components/timeline.css`
```html
<ol class="history"><li class="history__item" data-state="done"><time class="history__date" datetime="2026-08-21">08-21 <small>(금)</small></time><div class="history__body"><p class="history__title">채집 <span class="badge badge--sm badge--gangwon">강원</span></p><p class="history__who">서연우 412 · 곰배령 북사면 1,042 m</p><p class="history__memo">꽃 5송이, 이슬 맺힌 채로</p></div></li>
<li class="history__item" data-state="done"><time class="history__date" datetime="2026-08-22">08-22 <small>(토)</small></time><div class="history__body"><p class="history__title">건조 시작</p><p class="history__who">백도윤 · 건조기 1호 42 ℃</p></div></li>
<li class="history__item" data-state="done"><time class="history__date" datetime="2026-08-25">08-25 <small>(화)</small></time><div class="history__body"><p class="history__title">동정</p><p class="history__who">det. 문해솔</p></div></li>
<li class="history__item" aria-current="step"><time class="history__date" datetime="2026-08-27">08-27 <small>(목)</small></time><div class="history__body"><p class="history__title">마운팅 완료</p><p class="history__who">백도윤 · 린넨 테이프 3곳</p></div></li>
<li class="history__item" data-state="planned"><time class="history__date" datetime="2026-08-28">08-28 <small>(금)</small></time><div class="history__body"><p class="history__title">촬영 예정</p><p class="history__who">이세린 · 촬영대 2번</p></div></li></ol>
```
- 현재 `aria-current="step"`, 예정 `data-state="planned"`(점선), 문제 `data-state="error"`. 시각은 `<span class="history__time">10:40</span>`을 `time` 안에. 메모 `.history__memo`(연필), 긴 기록 `.history__text`.

### toast — 테이프 쪽지 `components/toast.css`
```html
<button class="btn" type="button" data-toast-title="야장을 저장했습니다" data-toast-text="서연우 412 · 금강초롱꽃" data-toast-tone="ok">저장</button>
<script>/* 또는 */ DMH.toast({ title: '대출을 승인했습니다', text: 'LN-2026-031 · 초롱꽃속 13점', tone: 'ok', sign: 'det. 문해솔' });</script>
```
- tone: `ok`(ACC., 미니 도장) · `note`(NOTE) · `cave`(CAVE) · `tox`(TOX.) · `det`(DET.). 4.8초, hover·포커스 시 멈춤, 닫기 44px. 데스크톱 우상단·모바일 하단. `.toast-zone`은 app.js가 만든다.
- index 견본은 정적으로:
```html
<div class="toast toast--ok toast--static" role="status">
  <span class="tape tape--sm" style="--x:20%;--r:-3deg"></span><span class="tape tape--sm" style="--x:80%;--r:2.5deg"></span>
  <p class="toast__head">수장<span class="sc">ACC.</span></p>
  <div class="toast__body"><p class="toast__title">수장 완료 — DMH-024117</p><p class="toast__text">큰앵초를 서랍 22에 넣었습니다.</p></div>
  <button class="toast__close" type="button" aria-label="알림 닫기">(x 아이콘)</button>
  <span class="stamp stamp--sm" data-date="2026.08.26"></span>
  <span class="toast__timer" aria-hidden="true"></span>
</div>
```

### tooltip `components/tooltip.css`
```html
<span class="tip-wrap">
  <button class="btn btn--line btn--sm" type="button" aria-describedby="tip-dew">이슬점</button>
  <span class="tip" role="tooltip" id="tip-dew">진동리 10:40 기준 이슬점 16 ℃</span>
</span>
```
위치 `.tip--bottom` `.tip--right`, 가장자리 정렬 `.tip--start` `.tip--end`, 견본 `.tip--static`. hover·focus에서 보이고 Esc로 숨는다. 연필체 금지(정보 전달).

---

## 6. app.js 훅 요약

| 훅 | 동작 |
|---|---|
| `[data-theme-toggle]` | 낮 채집 ↔ 밤 순찰, `aria-pressed`·`aria-label` 자동 |
| `[data-theme-set="light|dark|system"]` | 버튼(aria-pressed) 또는 라디오(checked)로 화면 고르기(설정) |
| `[data-modal-open="id"]` `[data-drawer-open="id"]` `[data-close]` | 모달·드로어 열기/닫기 · 포커스 트랩 · Esc · 트리거 복귀 · 스크롤 잠금 |
| `[data-command-open]` · ⌘K/Ctrl+K | 표본 찾기(필터·↑↓·Enter) |
| `[data-popover="id"]` · `[data-menu="id"]` | 학명 쪽지 · 대지 메뉴(바깥 클릭·Esc) |
| `.tip-wrap` | 툴팁 Esc 숨김 |
| `[data-tabs]` · `[data-accordion]` | 탭(←→ Home End) · 검색표 |
| `[data-toast-title]` (+`-text` `-tone` `-sign`) · `DMH.toast({…})` | 토스트 |
| `[data-carousel]` | 도판 넘김(`[data-prev]` `[data-next]` `[data-play]` `[data-current]` `[data-total]` `.plates__index`) |
| `[data-select-table]` | 행 선택·일괄 동작 바·정렬 |
| `[data-calendar]` | 날짜 선택·화살표 이동(`data-cal-output`) |
| `[data-kanban]` (`data-toast`) | 드래그·Alt+←→·다음 공정 버튼·개수 갱신·안내(live) |
| `form[data-validate]` · `[data-form-reset]` · `[data-busy-demo]` | 검증·로딩·성공 토스트 |
| `.drop` · `.range__input` | 파일 목록 표시 · 축척자 채움/값 |
| `[data-marquee]` `[data-marquee-toggle]` | 입고 띠 복제·멈춤 |
| `.flora[data-draw]` · `[data-replay]` | 세밀화 드로잉 · 모션 시연 |
| `.stamp` · `.barcode[data-code]` · `.ruler[data-cm]` | 도장 SVG · 바코드 · 축척자 숫자 생성 |
| `[data-copy="id"]` · `[data-dismiss]` · `[data-scroll-hint]` | 복사 · 쪽지 닫기 · 가로 스크롤 페이드 |

전역 API `window.DMH`: `init(scope)`(동적 마크업 초기화) · `toast(opts)` · `setProgress(el, v)` · `stamp(el)` · `draw(svg)` · `open(id)` · `close(id)` · `setTheme('light'|'dark'|'system')`. 이벤트: `dmh:open` `dmh:close` `dmh:tab` `dmh:date` `dmh:saved` `dmh:command`.
`href="#"` · 인라인 onclick 없이 위 훅만으로 동작한다. 화면 안 이동은 실제 id(`#ledger` 등)로.

**index 섹션 id 고정**(셸·사이드바가 링크함): 수장 대장 장면(9절 6번 "대장 — 이번 시즌 공정 대지")의 `<section id="ledger">`.

---

## 7. 아이콘 (인라인 SVG, 24 격자, stroke = currentColor)

`.icon`(20px) `.icon--sm`(16) `.icon--lg`(24). 버튼 안에서만 쓰고 의미가 있으면 버튼에 `aria-label`. 아래 정본을 복사한다(새 아이콘도 같은 굵기·각진 끝).
```html
search  <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5L21 21"/></svg>
moon    <svg class="icon icon-moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/></svg>
sun     <svg class="icon icon-sun" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M5.3 18.7l1.8-1.8M16.9 7.1l1.8-1.8"/></svg>
drawer  <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="4" width="17" height="16"/><path d="M3.5 12h17M10 8h4M10 16h4"/></svg>
x       <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>
arrow   <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
left    <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>
right   <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>
play    <svg class="icon icon-play" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5l11 7-11 7z"/></svg>
pause   <svg class="icon icon-pause" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14M16 5v14"/></svg>
upload  <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 16V4M7 9l5-5 5 5M4 15v5h16v-5"/></svg>
camera  <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h4l1.5-2h5L16 7h4v12H4z"/><circle cx="12" cy="13" r="3.5"/></svg>
desk    <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 9h18M5 9v11M19 9v11M7 9V5h10v4"/></svg>
flow    <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="5" height="16"/><rect x="10" y="4" width="5" height="10"/><rect x="17" y="4" width="4" height="13"/></svg>
mail    <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14"/><path d="M3 6l9 7 9-7"/></svg>
book    <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3z"/><path d="M5 17a3 3 0 0 1 3-3h11"/></svg>
shop    <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8h16l-1.5 12h-13z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>
gear    <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1"/></svg>
dots    <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="5" cy="12" r="1.2"/><circle cx="12" cy="12" r="1.2"/><circle cx="19" cy="12" r="1.2"/></svg>
copy    <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="8" y="8" width="12" height="12"/><path d="M16 8V4H4v12h4"/></svg>
```

---

## 8. 쓰지 말 것 (이 시스템에서 깨지는 것)

- IM Fell English로 정보 숫자 쓰기(1이 대문자 I로 읽힘: "11점"→"II점"). 큰 숫자는 `.num-xl`/`--font-figure`만.
- 크림 양피지 바탕, 표·배지·버튼·KPI 숫자까지 세리프로 덮는 조판. 세리프는 국명(Song Myung)·학명(Fell)·기록(Gowun Batang)에만.
- 둥근 카드(반경은 0 — 도장·아바타·라디오·스위치 손잡이만 원), 대지 아닌 요소의 그림자, 테두리+그림자 이중.
- 대각선 마스킹테이프, 흐릿한 radial 얼룩, 덩굴·잎 장식 SVG, 이모지 아이콘.
- 한글에 Cutive Mono·Fell SC·0.05em 이상 자간·이탤릭.
- `--hairline`을 입력 테두리·텍스트로, `--leaf-600`을 작업대 위 글자로(대비 부족). 다크에서 작업등색 면 채우기.
- SVG presentation attribute의 `var()`(`stroke="var(--x)"`) — `style=""` 또는 `currentColor`.
- KPI 카드 4장 + 아이콘 칩, "큐레이터 평점" 같은 세계에 없는 지표, 화면마다 달라지는 숫자(팩트 시트만).
- eyebrow + 3줄 헤드라인 + CTA 2개 + 칩, 가운데정렬 섹션 헤더, "§ 번호", 판권 정의 목록, 왼쪽 고정 목차(theme-30 전용).
- 디자인 시스템 자기소개 카피("토큰 값만 바꾸면…", "상태까지 설계된…"). 모든 문구는 표본관 말투(입고·동정·마운팅·수장·대출).

---

## 부록 A. 세밀화 원본 (인라인 SVG — 복사해서 쓴다)

원본은 `class="flora"`만 달려 있다. 대표 그림에는 `data-draw`와 `id`, 크기는 CSS(`height`)로 준다. 축소 사용 시 `--sw` 보정(4절). 같은 그림을 화면 안에서 여러 번 쓰는 것은 괜찮지만 하나의 대지에는 하나의 표본만.

### 금강초롱꽃 — 대표 표본(전체 개체 + 뿌리)
<!-- 금강초롱꽃 Hanabusaya asiatica — 대표 표본, 렌더 높이 560px 기준 viewBox="0 0 300 600" -->
```html
<svg class="flora" viewBox="0 0 300 600" aria-hidden="true">
  <path d="M146 458 C128 360 196 210 178 46"/>
  <path d="M143 458 C133 482 130 516 137 548 C141 566 150 572 154 558 C160 530 159 492 151 458"/>
  <path class="vein" d="M146 470 C142 500 143 528 147 556"/>
  <path class="dim" d="M139 492 C114 504 100 526 86 546"/>
  <path class="dim" d="M138 520 C118 540 112 560 100 584"/>
  <path class="dim" d="M154 498 C176 512 190 534 204 548"/>
  <path class="dim" d="M155 532 C170 552 174 572 184 592"/>
  <path class="dim" d="M141 540 C130 556 126 572 118 594"/>
  <path class="dim" d="M150 560 C150 576 146 588 150 598"/>
  <path d="M147.3 364.3 Q141.6 360.1 132 359.9"/>
  <path d="M132 359.9 L122.9 368.3 L115.1 372.1 L107.9 373.9 L98.7 377.5 L94.1 375.6 L85.2 378 L81.2 374.4 L72.5 375.7 L68.9 370.8 L60.6 371 L57.2 365.3 L49.2 364.3 L45.9 358.2 L38.3 356 L35 349.8 L27.7 346.5 L24.3 340.5 L17.4 336 L13.9 330.3 L8.9 324.6 L16.2 322.4 L22.1 319.4 L30.4 319.3 L36.4 316 L44.4 317 L50.4 313.5 L58.1 315.7 L64.1 312.3 L71.4 315.6 L77.3 312.6 L84.3 317.2 L90 315 L96.6 320.6 L101.9 319.7 L108.2 326.5 L113.1 327.3 L119 335.2 L124.2 340.6 L128.7 347.9 L132 359.9 Z"/>
  <path class="vein" d="M132 359.9 Q72.9 342.9 18.6 327.4"/>
  <path class="vein" d="M114.7 354.9 Q101.3 364.7 88.6 371.8"/>
  <path class="vein" d="M114.7 354.9 Q108.5 339.5 101.5 326.8"/>
  <path class="vein" d="M93.2 348.8 Q78.9 361.5 66.9 366"/>
  <path class="vein" d="M93.2 348.8 Q87.8 330.4 80.1 320.2"/>
  <path class="vein" d="M71.7 342.6 Q57.7 354.2 46.7 355.3"/>
  <path class="vein" d="M71.7 342.6 Q66 325.3 57.2 318.6"/>
  <path class="vein" d="M50.1 336.4 Q37.3 344.1 27.4 341.3"/>
  <path class="vein" d="M50.1 336.4 Q43.3 323.1 33.4 320.3"/>
  <path class="vein" d="M28.6 330.2 Q17.4 332.1 8.9 324.6"/>
  <path class="vein" d="M28.6 330.2 Q20.1 322.8 8.9 324.6"/>
  <path d="M148.9 353 Q158.7 349.1 164.5 349.1"/>
  <path d="M164.5 349.1 L168 337.7 L172.7 330.8 L177.8 325.8 L183.9 318.3 L188.6 317.7 L194.9 311.3 L200 312.4 L206.6 307.2 L212.1 309.5 L219 305.3 L224.6 308.4 L231.8 305.4 L237.5 308.9 L245 307.1 L250.7 310.6 L258.4 309.9 L264.1 313.3 L272.2 313.7 L277.8 316.8 L284.8 319.1 L279.7 324.5 L276.2 329.9 L269.3 334 L265.9 339.6 L258.7 342.6 L255.3 348.5 L247.8 350.3 L244.4 356.1 L236.7 356.8 L233.1 362.2 L225.1 361.8 L221.4 366.4 L213.1 364.8 L209.1 368.2 L200.5 365.6 L196.1 367.2 L187.2 363.5 L180.3 361.5 L172.9 357.5 L164.5 349.1 Z"/>
  <path class="vein" d="M164.5 349.1 Q222.2 334.7 275.3 321.5"/>
  <path class="vein" d="M181.3 344.9 Q187.9 330.3 195.1 318.2"/>
  <path class="vein" d="M181.3 344.9 Q194 354.8 206 362"/>
  <path class="vein" d="M202.4 339.7 Q208.2 322.1 216 312.6"/>
  <path class="vein" d="M202.4 339.7 Q215.8 352.4 227.2 357.2"/>
  <path class="vein" d="M223.4 334.4 Q229.5 317.9 238.2 311.7"/>
  <path class="vein" d="M223.4 334.4 Q236.5 346.1 247.1 347.5"/>
  <path class="vein" d="M244.5 329.2 Q251.5 316.6 261.2 314.2"/>
  <path class="vein" d="M244.5 329.2 Q256.6 337 266.3 334.6"/>
  <path class="vein" d="M265.5 323.9 Q274 317 284.8 319.1"/>
  <path class="vein" d="M265.5 323.9 Q276.3 326.1 284.8 319.1"/>
  <path d="M152 333.7 Q148.3 333.6 140.6 337.4"/>
  <path d="M140.6 337.4 L138.2 348.2 L134.4 354.9 L130.2 359.8 L125.2 367 L121 367.9 L115.7 374.1 L111 373.4 L105.4 378.6 L100.4 376.8 L94.4 381 L89.1 378.5 L82.9 381.7 L77.4 378.8 L70.8 380.9 L65.4 377.9 L58.5 379.1 L53.1 376.3 L45.8 376.3 L40.5 373.8 L34 372 L38.2 366.8 L41 361.6 L47 357.4 L49.7 352 L55.9 348.8 L58.6 343.2 L65.2 341.1 L67.9 335.5 L74.8 334.4 L77.6 329.3 L84.9 329.2 L87.9 324.7 L95.5 325.7 L98.9 322.3 L106.8 324.3 L110.8 322.5 L119 325.5 L125.4 326.9 L132.3 330.1 L140.6 337.4 Z"/>
  <path class="vein" d="M140.6 337.4 Q89.4 354 42.4 369.3"/>
  <path class="vein" d="M125.6 342.3 Q120.7 356.2 115.1 367.8"/>
  <path class="vein" d="M125.6 342.3 Q113.5 333.9 102.1 327.9"/>
  <path class="vein" d="M107 348.3 Q103 364.9 96.6 374.2"/>
  <path class="vein" d="M107 348.3 Q94 337.3 83.4 333.6"/>
  <path class="vein" d="M88.4 354.4 Q84 370 76.6 376.2"/>
  <path class="vein" d="M88.4 354.4 Q75.7 344.3 66 343.6"/>
  <path class="vein" d="M69.7 360.4 Q64.2 372.5 55.7 375.3"/>
  <path class="vein" d="M69.7 360.4 Q58.2 353.9 49.7 356.7"/>
  <path class="vein" d="M51.1 366.5 Q43.9 373.4 34 372"/>
  <path class="vein" d="M51.1 366.5 Q41.2 365.1 34 372"/>
  <path d="M154 321.9 Q161.7 321.7 165.4 325.6"/>
  <path d="M165.4 325.6 L173.3 318.6 L180 315.5 L186.2 314.1 L194.1 311.3 L197.9 313 L205.5 311.1 L208.8 314.3 L216.1 313.4 L219 317.7 L226.1 317.8 L228.8 322.7 L235.5 323.8 L238 329.1 L244.4 331.2 L247 336.6 L253 339.7 L255.6 344.9 L261.4 348.9 L264.1 353.9 L268.1 358.9 L261.9 360.7 L256.8 363.1 L249.8 363 L244.6 365.7 L237.9 364.6 L232.6 367.5 L226.3 365.4 L221 368.2 L215 365.1 L209.9 367.6 L204.2 363.5 L199.3 365.2 L193.9 360.2 L189.4 360.9 L184.3 354.9 L180.2 354 L175.4 347.1 L171.3 342.3 L167.7 335.9 L165.4 325.6 Z"/>
  <path class="vein" d="M165.4 325.6 Q214.7 341.6 260.1 356.3"/>
  <path class="vein" d="M179.8 330.2 Q191.5 322.2 202.4 316.4"/>
  <path class="vein" d="M179.8 330.2 Q184.5 343.6 190 354.8"/>
  <path class="vein" d="M197.7 336.1 Q210.3 325.5 220.5 321.9"/>
  <path class="vein" d="M197.7 336.1 Q201.7 352 207.8 360.9"/>
  <path class="vein" d="M215.7 341.9 Q227.9 332.3 237.2 331.6"/>
  <path class="vein" d="M215.7 341.9 Q219.9 356.9 227.1 362.9"/>
  <path class="vein" d="M233.7 347.8 Q244.8 341.5 253 344.2"/>
  <path class="vein" d="M233.7 347.8 Q239 359.4 247.2 362.1"/>
  <path class="vein" d="M251.7 353.6 Q261.2 352.3 268.1 358.9"/>
  <path class="vein" d="M251.7 353.6 Q258.6 360.2 268.1 358.9"/>
  <path d="M158.3 297.6 Q157 293.2 151.8 292.9"/>
  <path d="M151.8 292.9 L143.6 296.4 L137.4 297.1 L132.1 296.5 L124.9 296.7 L122.3 294.3 L115.7 293.8 L113.8 290.3 L107.7 289.1 L106.4 284.9 L100.8 283 L99.9 278.3 L94.7 275.6 L94 270.7 L89.4 267.3 L88.7 262.3 L84.6 258.3 L83.8 253.4 L80.2 248.6 L79.3 243.9 L77.4 238.8 L82.8 239.1 L87.6 238.5 L93.2 240.4 L98.1 239.7 L103.2 242.3 L108.2 241.4 L112.8 244.8 L117.8 243.9 L121.9 248 L126.6 247.4 L130.2 252.2 L134.6 252.1 L137.7 257.6 L141.5 258.2 L144.1 264.4 L147.1 266.1 L149.2 273 L151.3 277.9 L152.6 284 L151.8 292.9 Z"/>
  <path class="vein" d="M151.8 292.9 Q116.1 266.9 83.2 243"/>
  <path class="vein" d="M141.4 285.3 Q129.9 288.6 119.5 290.4"/>
  <path class="vein" d="M141.4 285.3 Q141 273.3 139.4 262.9"/>
  <path class="vein" d="M128.4 275.8 Q115.5 281 106.3 281.1"/>
  <path class="vein" d="M128.4 275.8 Q129.3 262 126.6 253.2"/>
  <path class="vein" d="M115.3 266.4 Q103 270.9 95.3 268.9"/>
  <path class="vein" d="M115.3 266.4 Q115.8 253.2 111.5 246.5"/>
  <path class="vein" d="M102.3 256.9 Q91.7 259 85.8 254.6"/>
  <path class="vein" d="M102.3 256.9 Q101 246.2 95 241.9"/>
  <path class="vein" d="M89.3 247.4 Q81.3 245.9 77.4 238.8"/>
  <path class="vein" d="M89.3 247.4 Q85.4 240.3 77.4 238.8"/>
  <path d="M160.5 285.1 Q165.7 280.7 166.8 280.2"/>
  <path d="M166.8 280.2 L165.9 272.1 L167 266.5 L168.9 261.9 L170.7 255.5 L173.4 253.8 L175.7 248 L179.2 247.2 L182 242.1 L186 242 L189.3 237.4 L193.7 237.8 L197.4 233.8 L201.9 234.4 L206.1 231.1 L210.7 231.7 L215.4 229 L220 229.5 L225.1 227.5 L229.5 227.8 L234.6 227.3 L232.9 232 L232.1 236.4 L228.9 240.9 L228.2 245.4 L224.5 249.3 L224 253.9 L219.8 257.2 L219.2 261.8 L214.5 264.4 L213.7 268.8 L208.6 270.8 L207.5 274.7 L201.8 276.1 L200.2 279.4 L194.1 280.2 L191.7 282.4 L185.1 282.7 L180.2 283.4 L174.5 283 L166.8 280.2 Z"/>
  <path class="vein" d="M166.8 280.2 Q199.3 254.8 229.3 231.4"/>
  <path class="vein" d="M176.3 272.8 Q176.4 261.8 177.7 252.3"/>
  <path class="vein" d="M176.3 272.8 Q187 275.3 196.6 276.4"/>
  <path class="vein" d="M188.2 263.5 Q187.1 251 189.4 242.8"/>
  <path class="vein" d="M188.2 263.5 Q200.1 267.7 208.6 267.4"/>
  <path class="vein" d="M200 254.3 Q199.4 242.3 203.2 235.9"/>
  <path class="vein" d="M200 254.3 Q211.5 257.8 218.6 255.7"/>
  <path class="vein" d="M211.9 245 Q212.9 235.1 218.3 230.9"/>
  <path class="vein" d="M211.9 245 Q221.7 246.4 227.1 242.2"/>
  <path class="vein" d="M223.7 235.7 Q227.2 229 234.6 227.3"/>
  <path class="vein" d="M223.7 235.7 Q231.1 234 234.6 227.3"/>
  <path d="M170.7 224.8 Q139.7 190.8 108.7 220.8"/>
  <path d="M152.1 208.8 q-9 -12 -20 -10 q7 7 20 10z"/>
  <path class="petal" d="M116.3 222.7 L114.8 229.4 L113.6 236.1 L112.6 242.9 L111.8 249.8 L111.2 256.7 L110.8 263.6 L110.6 270.6 L110.6 277.6 L110.7 284.7 L111 291.8 L111.5 299 L112.1 306.2 Q112.1 309.9 108.9 311.3 Q106.5 309.5 105.5 302 Q101.4 307.2 98.2 308.6 Q95.8 306.9 94.8 299.3 Q90.7 304.6 87.5 305.9 Q85.1 304.2 84.1 296.7 Q80 301.9 76.8 303.3 Q74.4 301.5 73.4 294 Q69.3 299.2 66.1 300.6 Q63.7 298.9 62.7 291.3 L69.6 288.5 L73.3 282.4 L76.9 276.3 L80.4 270.1 L83.6 263.9 L86.7 257.6 L89.6 251.3 L92.4 244.9 L94.9 238.5 L97.2 232 L99.3 225.5 L101.1 218.9 Z"/>
  <path class="vein" d="M110.8 231.5 Q105.7 270.8 101 299.2"/>
  <path class="vein" d="M106.3 230.4 Q96.8 268.5 89.9 296.4"/>
  <path class="vein" d="M101.9 229.3 Q87.9 266.3 78.8 293.6"/>
  <path d="M114.4 223.9 L126.3 240.4"/>
  <path d="M108.3 222.4 L105.1 235.1"/>
  <path d="M102.3 220.9 L83.9 229.8"/>
  <path d="M175.6 188.8 Q205.6 154.8 235.6 184.8"/>
  <path d="M193.6 172.8 q9 -12 20 -10 q-7 7 -20 10z"/>
  <path class="petal" d="M243 183.2 L244.5 189.7 L246.3 196.1 L248.4 202.5 L250.6 208.9 L253 215.2 L255.6 221.4 L258.4 227.7 L261.4 233.8 L264.5 240 L267.7 246.1 L271.2 252.2 L274.8 258.3 Q276.3 261.6 274.2 264.1 Q271.4 263.7 267.3 257.4 Q266 263.8 263.8 266.3 Q261 265.9 256.9 259.6 Q255.6 266 253.4 268.5 Q250.6 268.1 246.6 261.8 Q245.2 268.2 243.1 270.7 Q240.3 270.3 236.2 264 Q234.9 270.4 232.7 272.9 Q229.9 272.5 225.8 266.2 L230.6 260.8 L231.2 253.9 L231.7 247 L232.1 240.1 L232.2 233.2 L232.3 226.4 L232.1 219.6 L231.7 212.9 L231.2 206.2 L230.5 199.5 L229.5 192.9 L228.3 186.4 Z"/>
  <path class="vein" d="M241.9 193.3 Q254.2 229.9 262.2 256.8"/>
  <path class="vein" d="M237.6 194.2 Q245.6 231.7 251.4 259.1"/>
  <path class="vein" d="M233.3 195.1 Q237 233.6 240.7 261.4"/>
  <path d="M241.8 185.1 L259.2 194.5"/>
  <path d="M236 186.4 L238.6 198.9"/>
  <path d="M230.1 187.6 L218.1 203.2"/>
  <path d="M179.6 147.1 Q153.6 113.1 127.6 143.1"/>
  <path d="M164 131.1 q-9 -12 -20 -10 q7 7 20 10z"/>
  <path class="petal" d="M134.6 144.6 L133.4 150.8 L132.5 157.1 L131.8 163.5 L131.3 169.8 L131 176.2 L130.9 182.7 L130.9 189.1 L131.1 195.7 L131.4 202.2 L131.9 208.8 L132.6 215.4 L133.4 222 Q133.4 225.7 130.6 226.9 Q128.2 225.6 127.2 218.4 Q123.5 223.5 120.6 224.8 Q118.3 223.5 117.2 216.3 Q113.5 221.4 110.6 222.7 Q108.3 221.3 107.3 214.2 Q103.6 219.3 100.7 220.5 Q98.4 219.2 97.3 212.1 Q93.6 217.2 90.7 218.4 Q88.4 217.1 87.3 209.9 L93.6 207.1 L96.9 201.3 L100 195.5 L103 189.7 L105.8 183.8 L108.4 177.9 L110.9 172 L113.2 166 L115.4 159.9 L117.3 153.9 L119 147.8 L120.5 141.6 Z"/>
  <path class="vein" d="M129.8 152.9 Q126.3 189.5 122.9 215.9"/>
  <path class="vein" d="M125.7 152 Q118.1 187.7 112.5 213.7"/>
  <path class="vein" d="M121.5 151.2 Q109.8 186 102.2 211.5"/>
  <path d="M132.9 145.8 L144.4 160.7"/>
  <path d="M127.2 144.6 L124.7 156.5"/>
  <path d="M121.6 143.4 L105 152.3"/>
  <path d="M181.1 104.4 Q204.1 70.4 227.1 100.4"/>
  <path d="M194.9 88.4 q9 -12 20 -10 q-7 7 -20 10z"/>
  <path class="petal" d="M233.7 98.5 L235.5 104.2 L237.5 109.8 L239.8 115.4 L242.2 121 L244.8 126.5 L247.6 131.9 L250.5 137.4 L253.5 142.7 L256.7 148 L260.1 153.3 L263.6 158.6 L267.2 163.7 Q268.9 166.8 267 169 Q264.5 169.1 260.4 163.5 Q259.6 169.5 257.7 171.7 Q255.2 171.8 251 166.2 Q250.2 172.2 248.3 174.4 Q245.8 174.5 241.6 168.8 Q240.8 174.9 238.9 177.1 Q236.4 177.2 232.3 171.5 Q231.5 177.6 229.5 179.8 Q227 179.9 222.9 174.2 L226.9 169.1 L227.1 162.8 L227.1 156.5 L227.1 150.3 L226.8 144.1 L226.4 138 L225.9 131.9 L225.1 125.9 L224.3 119.9 L223.2 114 L221.9 108.1 L220.4 102.3 Z"/>
  <path class="vein" d="M233.3 107.6 Q246.8 139.7 255.6 163.3"/>
  <path class="vein" d="M229.4 108.7 Q239 141.9 245.9 166.1"/>
  <path class="vein" d="M225.6 109.8 Q231.2 144.1 236.2 168.9"/>
  <path d="M232.8 100.2 L249.2 107.5"/>
  <path d="M227.5 101.8 L230.6 112.8"/>
  <path d="M222.2 103.3 L212.1 118.2"/>
  <path d="M179.4 60.7 Q162.4 26.7 145.4 56.7"/>
  <path d="M169.2 44.7 q-9 -12 -20 -10 q7 7 20 10z"/>
  <path class="petal" d="M151.6 57.6 L151 62.9 L150.7 68.2 L150.5 73.6 L150.4 79 L150.6 84.4 L150.9 89.8 L151.3 95.3 L151.9 100.7 L152.6 106.2 L153.5 111.7 L154.5 117.2 L155.6 122.8 Q155.9 126.1 153.5 127 Q151.3 126.5 150 120.1 Q147.1 124.9 144.7 125.8 Q142.5 125.3 141.2 118.8 Q138.2 123.7 135.9 124.5 Q133.7 124 132.3 117.6 Q129.4 122.4 127 123.3 Q124.9 122.8 123.5 116.3 Q120.6 121.2 118.2 122.1 Q116.1 121.5 114.7 115.1 L120 112.4 L122.4 107.4 L124.8 102.3 L127 97.2 L129.1 92.1 L131 87 L132.8 81.9 L134.4 76.7 L135.9 71.5 L137.2 66.3 L138.3 61.1 L139.2 55.8 Z"/>
  <path class="vein" d="M148 64.8 Q147.4 95.8 146.1 118.2"/>
  <path class="vein" d="M144.3 64.3 Q140 94.7 136.9 116.9"/>
  <path class="vein" d="M140.7 63.8 Q132.7 93.7 127.8 115.6"/>
  <path d="M150.2 58.7 L161.3 70.6"/>
  <path d="M145.2 58 L143.8 68.1"/>
  <path d="M140.2 57.3 L126.3 65.7"/>
</svg>
```

### 들메나무 잎 — 워드마크 34px
<!-- 들메나무 잎 워드마크 — 34px viewBox="0 0 40 40" -->
```html
<svg class="flora" viewBox="0 0 40 40" aria-hidden="true">
  <path d="M6 36 C14 28 22 18 34 6"/>
  <path d="M11.3 30.4 q-1 -9 -9 -11 q1 8 9 11z"/>
  <path d="M11.3 30.4 q9 1 11 9 q-8 -1 -11 -9z"/>
  <path d="M16.4 24.9 q-1 -9 -9 -11 q1 8 9 11z"/>
  <path d="M16.4 24.9 q9 1 11 9 q-8 -1 -11 -9z"/>
  <path d="M21.8 18.8 q-1 -9 -9 -11 q1 8 9 11z"/>
  <path d="M21.8 18.8 q9 1 11 9 q-8 -1 -11 -9z"/>
  <path d="M34 6 q-7 0 -9 6 q7 1 9 -6z"/>
</svg>
```

### 들메나무 우상복엽
<!-- 들메나무 Fraxinus mandshurica 우상복엽 viewBox="0 0 200 300" -->
```html
<svg class="flora" viewBox="0 0 200 300" aria-hidden="true">
  <path d="M100 292 C98 224 104 130 100 70"/>
  <path d="M99.6 244 Q100.2 241.5 96.8 243"/>
  <path d="M96.8 243 L91.9 243.1 L85.9 243.4 L82 243.2 L75.9 243.7 L72.4 242.5 L66.4 242.8 L63.2 240.6 L57.5 240.1 L54.7 237.1 L49.3 235.8 L46.6 232.3 L41.5 230.1 L38.8 226.6 L34 223.7 L31.2 220.5 L27.3 217.6 L32.1 218 L36.3 217.4 L41.8 218.2 L46.2 217.2 L51.5 218.8 L55.8 217.9 L60.8 220.3 L64.9 219.9 L69.6 223.2 L73.4 223.5 L77.8 227.6 L81.3 228.9 L85.6 233.2 L88.7 235.6 L93.1 239.7 L96.8 243 Z"/>
  <path class="vein" d="M96.8 243 Q63.5 230.8 32.7 219.6"/>
  <path class="vein" d="M87.1 239.4 Q80.5 240.3 73.7 241.7"/>
  <path class="vein" d="M87.1 239.4 Q82.6 234.5 78.3 229"/>
  <path class="vein" d="M70.9 233.5 Q63.5 236.5 57 236.9"/>
  <path class="vein" d="M70.9 233.5 Q67.1 226.5 62.5 222"/>
  <path class="vein" d="M54.6 227.6 Q47.5 229.8 41.9 228.1"/>
  <path class="vein" d="M54.6 227.6 Q50.6 221.4 45.2 219"/>
  <path class="vein" d="M38.4 221.7 Q32.4 221 27.3 217.6"/>
  <path class="vein" d="M38.4 221.7 Q33.4 218.3 27.3 217.6"/>
  <path d="M99.6 244 Q103.1 241.5 102.5 243"/>
  <path d="M102.5 243 L106.2 239.7 L110.6 235.6 L113.7 233.2 L118 228.9 L121.5 227.6 L125.9 223.5 L129.7 223.2 L134.4 219.9 L138.5 220.3 L143.5 217.9 L147.8 218.8 L153.1 217.2 L157.5 218.2 L163 217.4 L167.2 218 L172 217.6 L168.1 220.5 L165.3 223.7 L160.5 226.6 L157.8 230.1 L152.7 232.3 L150 235.8 L144.6 237.1 L141.8 240.1 L136.1 240.6 L132.9 242.8 L126.9 242.5 L123.4 243.7 L117.3 243.2 L113.4 243.4 L107.4 243.1 L102.5 243 Z"/>
  <path class="vein" d="M102.5 243 Q135.8 230.8 166.6 219.6"/>
  <path class="vein" d="M112.2 239.4 Q116.7 234.5 121 229"/>
  <path class="vein" d="M112.2 239.4 Q118.8 240.3 125.6 241.7"/>
  <path class="vein" d="M128.4 233.5 Q132.2 226.5 136.8 222"/>
  <path class="vein" d="M128.4 233.5 Q135.8 236.5 142.3 236.9"/>
  <path class="vein" d="M144.7 227.6 Q148.7 221.4 154.1 219"/>
  <path class="vein" d="M144.7 227.6 Q151.8 229.8 157.4 228.1"/>
  <path class="vein" d="M160.9 221.7 Q165.9 218.3 172 217.6"/>
  <path class="vein" d="M160.9 221.7 Q166.9 221 172 217.6"/>
  <path d="M100.2 206.5 Q100.8 204.1 97.3 205.7"/>
  <path d="M97.3 205.7 L92.8 206.2 L87.3 206.9 L83.7 207 L78.1 208 L74.8 207.1 L69.3 207.8 L66.3 206 L61 206 L58.2 203.3 L53.2 202.5 L50.5 199.4 L45.7 197.7 L43 194.5 L38.5 192.1 L35.7 189.3 L31.9 186.9 L36.4 186.9 L40.2 186 L45.4 186.4 L49.3 185.1 L54.3 186.2 L58.2 185 L62.9 187 L66.7 186.2 L71.1 189 L74.7 189 L79 192.5 L82.3 193.5 L86.5 197.3 L89.5 199.3 L93.7 202.9 L97.3 205.7 Z"/>
  <path class="vein" d="M97.3 205.7 Q65.9 196.7 37.1 188.4"/>
  <path class="vein" d="M88.2 203.1 Q82.1 204.4 75.9 206.3"/>
  <path class="vein" d="M88.2 203.1 Q83.8 198.7 79.5 193.8"/>
  <path class="vein" d="M72.9 198.7 Q66.3 202.1 60.4 203"/>
  <path class="vein" d="M72.9 198.7 Q69.1 192.3 64.5 188.4"/>
  <path class="vein" d="M57.7 194.3 Q51.3 196.9 45.9 195.7"/>
  <path class="vein" d="M57.7 194.3 Q53.6 188.7 48.5 186.9"/>
  <path class="vein" d="M42.4 189.9 Q36.8 189.8 31.9 186.9"/>
  <path class="vein" d="M42.4 189.9 Q37.6 187.1 31.9 186.9"/>
  <path d="M100.2 206.5 Q103.6 204.1 103.1 205.7"/>
  <path d="M103.1 205.7 L106.7 202.9 L110.9 199.3 L113.9 197.3 L118.1 193.5 L121.4 192.5 L125.7 189 L129.2 189 L133.7 186.2 L137.5 187 L142.2 185 L146.1 186.2 L151.1 185.1 L155 186.4 L160.2 186 L164 186.9 L168.4 186.9 L164.7 189.3 L161.9 192.1 L157.4 194.5 L154.7 197.7 L149.9 199.4 L147.2 202.5 L142.2 203.3 L139.4 206 L134.1 206 L131.1 207.8 L125.6 207.1 L122.3 208 L116.7 207 L113.1 206.9 L107.6 206.2 L103.1 205.7 Z"/>
  <path class="vein" d="M103.1 205.7 Q134.5 196.7 163.3 188.4"/>
  <path class="vein" d="M112.2 203.1 Q116.6 198.7 120.9 193.8"/>
  <path class="vein" d="M112.2 203.1 Q118.3 204.4 124.5 206.3"/>
  <path class="vein" d="M127.5 198.7 Q131.3 192.3 135.8 188.4"/>
  <path class="vein" d="M127.5 198.7 Q134.1 202.1 140 203"/>
  <path class="vein" d="M142.7 194.3 Q146.8 188.7 151.9 186.9"/>
  <path class="vein" d="M142.7 194.3 Q149.1 196.9 154.5 195.7"/>
  <path class="vein" d="M158 189.9 Q162.8 187.1 168.4 186.9"/>
  <path class="vein" d="M158 189.9 Q163.6 189.8 168.4 186.9"/>
  <path d="M100.9 168.5 Q101.5 166.2 98 167.9"/>
  <path d="M98 167.9 L93.9 168.7 L88.9 169.8 L85.6 170.2 L80.6 171.6 L77.5 171 L72.6 172 L69.7 170.5 L64.9 170.9 L62.2 168.6 L57.6 168.2 L54.9 165.4 L50.5 164.2 L47.9 161.4 L43.6 159.5 L40.9 157 L37.3 155 L41.4 154.6 L44.8 153.5 L49.6 153.5 L53.1 152 L57.7 152.7 L61.2 151.2 L65.6 152.7 L69 151.7 L73.2 154.1 L76.5 153.8 L80.5 156.8 L83.6 157.5 L87.6 160.8 L90.5 162.5 L94.5 165.5 L98 167.9 Z"/>
  <path class="vein" d="M98 167.9 Q68.9 161.7 42.1 156"/>
  <path class="vein" d="M89.5 166.1 Q84.1 167.9 78.5 170.1"/>
  <path class="vein" d="M89.5 166.1 Q85.2 162.3 81.1 158"/>
  <path class="vein" d="M75.3 163.1 Q69.5 166.8 64.1 168.1"/>
  <path class="vein" d="M75.3 163.1 Q71.5 157.3 67.2 154"/>
  <path class="vein" d="M61.2 160.1 Q55.5 163.1 50.6 162.3"/>
  <path class="vein" d="M61.2 160.1 Q57.2 155.1 52.4 153.8"/>
  <path class="vein" d="M47 157.1 Q41.9 157.4 37.3 155"/>
  <path class="vein" d="M47 157.1 Q42.5 154.8 37.3 155"/>
  <path d="M100.9 168.5 Q104.4 166.2 103.9 167.9"/>
  <path d="M103.9 167.9 L107.3 165.5 L111.4 162.5 L114.2 160.8 L118.3 157.5 L121.3 156.8 L125.4 153.8 L128.6 154.1 L132.9 151.7 L136.3 152.7 L140.7 151.2 L144.2 152.7 L148.8 152 L152.3 153.5 L157 153.5 L160.5 154.6 L164.5 155 L161 157 L158.3 159.5 L154 161.4 L151.4 164.2 L146.9 165.4 L144.3 168.2 L139.7 168.6 L136.9 170.9 L132.1 170.5 L129.3 172 L124.3 171 L121.2 171.6 L116.2 170.2 L113 169.8 L108 168.7 L103.9 167.9 Z"/>
  <path class="vein" d="M103.9 167.9 Q133 161.7 159.7 156"/>
  <path class="vein" d="M112.3 166.1 Q116.6 162.3 120.8 158"/>
  <path class="vein" d="M112.3 166.1 Q117.8 167.9 123.3 170.1"/>
  <path class="vein" d="M126.5 163.1 Q130.3 157.3 134.7 154"/>
  <path class="vein" d="M126.5 163.1 Q132.4 166.8 137.7 168.1"/>
  <path class="vein" d="M140.6 160.1 Q144.7 155.1 149.4 153.8"/>
  <path class="vein" d="M140.6 160.1 Q146.3 163.1 151.3 162.3"/>
  <path class="vein" d="M154.8 157.1 Q159.4 154.8 164.5 155"/>
  <path class="vein" d="M154.8 157.1 Q159.9 157.4 164.5 155"/>
  <path d="M101.4 131.6 Q101.9 129.4 98.4 131.1"/>
  <path d="M98.4 131.1 L94.7 132.2 L90.3 133.6 L87.4 134.2 L82.9 135.8 L80.1 135.5 L75.7 136.9 L73 135.6 L68.7 136.4 L66.1 134.4 L61.9 134.3 L59.4 131.9 L55.3 131.1 L52.8 128.6 L48.8 127.1 L46.3 125 L43 123.3 L46.6 122.7 L49.6 121.4 L53.9 121 L57 119.4 L61.2 119.7 L64.2 118 L68.3 119.1 L71.3 117.9 L75.3 119.8 L78.2 119.4 L82 121.9 L84.8 122.4 L88.7 125.2 L91.3 126.5 L95.2 129.1 L98.4 131.1 Z"/>
  <path class="vein" d="M98.4 131.1 Q71.8 127.4 47.3 124"/>
  <path class="vein" d="M90.7 130.1 Q85.8 132.1 81 134.6"/>
  <path class="vein" d="M90.7 130.1 Q86.6 126.8 82.6 123"/>
  <path class="vein" d="M77.7 128.2 Q72.6 132.2 67.9 133.8"/>
  <path class="vein" d="M77.7 128.2 Q73.9 123 69.8 120.2"/>
  <path class="vein" d="M64.8 126.4 Q59.8 129.6 55.3 129.3"/>
  <path class="vein" d="M64.8 126.4 Q60.9 122 56.5 121.1"/>
  <path class="vein" d="M51.8 124.6 Q47.2 125.2 43 123.3"/>
  <path class="vein" d="M51.8 124.6 Q47.6 122.7 43 123.3"/>
  <path d="M101.4 131.6 Q104.9 129.4 104.4 131.1"/>
  <path d="M104.4 131.1 L107.6 129.1 L111.5 126.5 L114.1 125.2 L117.9 122.4 L120.7 121.9 L124.6 119.4 L127.5 119.8 L131.5 117.9 L134.5 119.1 L138.5 118 L141.6 119.7 L145.8 119.4 L148.9 121 L153.1 121.4 L156.2 122.7 L159.8 123.3 L156.5 125 L153.9 127.1 L149.9 128.6 L147.4 131.1 L143.3 131.9 L140.8 134.3 L136.6 134.4 L134 136.4 L129.7 135.6 L127 136.9 L122.6 135.5 L119.8 135.8 L115.4 134.2 L112.5 133.6 L108 132.2 L104.4 131.1 Z"/>
  <path class="vein" d="M104.4 131.1 Q131 127.4 155.5 124"/>
  <path class="vein" d="M112.1 130.1 Q116.2 126.8 120.2 123"/>
  <path class="vein" d="M112.1 130.1 Q116.9 132.1 121.8 134.6"/>
  <path class="vein" d="M125.1 128.2 Q128.9 123 133 120.2"/>
  <path class="vein" d="M125.1 128.2 Q130.1 132.2 134.9 133.8"/>
  <path class="vein" d="M138 126.4 Q141.9 122 146.3 121.1"/>
  <path class="vein" d="M138 126.4 Q143 129.6 147.4 129.3"/>
  <path class="vein" d="M150.9 124.6 Q155.2 122.7 159.8 123.3"/>
  <path class="vein" d="M150.9 124.6 Q155.6 125.2 159.8 123.3"/>
  <path d="M101.2 101.2 Q101.7 99.1 98.2 101"/>
  <path d="M98.2 101 L95 102.2 L91.2 103.9 L88.6 104.6 L84.7 106.5 L82.2 106.4 L78.3 108 L75.9 107 L72.1 108 L69.7 106.3 L65.9 106.5 L63.5 104.4 L59.8 103.9 L57.5 101.7 L53.8 100.6 L51.4 98.8 L48.4 97.5 L51.5 96.6 L54.2 95.1 L58 94.5 L60.6 92.7 L64.4 92.7 L67 91 L70.7 91.7 L73.3 90.4 L76.9 91.9 L79.5 91.3 L83.1 93.4 L85.6 93.6 L89.2 96 L91.6 97.1 L95.2 99.3 L98.2 101 Z"/>
  <path class="vein" d="M98.2 101 Q74.3 99.3 52.3 97.7"/>
  <path class="vein" d="M91.3 100.5 Q87.1 102.7 82.9 105.4"/>
  <path class="vein" d="M91.3 100.5 Q87.4 97.6 83.7 94.4"/>
  <path class="vein" d="M79.6 99.7 Q75.3 103.7 71.2 105.6"/>
  <path class="vein" d="M79.6 99.7 Q75.9 95 72.1 92.6"/>
  <path class="vein" d="M68 98.8 Q63.7 102.2 59.7 102.2"/>
  <path class="vein" d="M68 98.8 Q64.2 94.9 60.3 94.4"/>
  <path class="vein" d="M56.3 98 Q52.3 98.9 48.4 97.5"/>
  <path class="vein" d="M56.3 98 Q52.4 96.6 48.4 97.5"/>
  <path d="M101.2 101.2 Q104.7 99.1 104.2 101"/>
  <path d="M104.2 101 L107.2 99.3 L110.8 97.1 L113.3 96 L116.8 93.6 L119.3 93.4 L122.9 91.3 L125.5 91.9 L129.1 90.4 L131.8 91.7 L135.4 91 L138.1 92.7 L141.8 92.7 L144.5 94.5 L148.3 95.1 L150.9 96.6 L154.1 97.5 L151.1 98.8 L148.7 100.6 L145 101.7 L142.6 103.9 L138.9 104.4 L136.5 106.5 L132.8 106.3 L130.4 108 L126.6 107 L124.1 108 L120.3 106.4 L117.7 106.5 L113.9 104.6 L111.3 103.9 L107.4 102.2 L104.2 101 Z"/>
  <path class="vein" d="M104.2 101 Q128.2 99.3 150.2 97.7"/>
  <path class="vein" d="M111.2 100.5 Q115 97.6 118.8 94.4"/>
  <path class="vein" d="M111.2 100.5 Q115.4 102.7 119.6 105.4"/>
  <path class="vein" d="M122.8 99.7 Q126.5 95 130.4 92.6"/>
  <path class="vein" d="M122.8 99.7 Q127.1 103.7 131.3 105.6"/>
  <path class="vein" d="M134.5 98.8 Q138.2 94.9 142.2 94.4"/>
  <path class="vein" d="M134.5 98.8 Q138.7 102.2 142.7 102.2"/>
  <path class="vein" d="M146.1 98 Q150 96.6 154.1 97.5"/>
  <path class="vein" d="M146.1 98 Q150.2 98.9 154.1 97.5"/>
  <path d="M100 72 L98.1 67.9 L95.7 63 L94.6 59.6 L92.1 54.7 L92.2 51.3 L90.3 46.4 L91.6 43 L90.7 38.2 L92.8 34.7 L93 29.9 L95.4 26.4 L96.5 21.6 L98.6 18.1 L100 14 L101.4 18.1 L103.5 21.6 L104.6 26.4 L107 29.9 L107.2 34.7 L109.3 38.2 L108.4 43 L109.7 46.4 L107.8 51.3 L107.9 54.7 L105.4 59.6 L104.3 63 L101.9 67.9 L100 72 Z"/>
  <path class="vein" d="M100 72 Q100 44.2 100 18.5"/>
  <path class="vein" d="M100 63.9 Q97.2 59.2 93.8 54.6"/>
  <path class="vein" d="M100 63.9 Q102.8 59.2 106.2 54.6"/>
  <path class="vein" d="M100 43.6 Q95.2 38.9 93.8 34.3"/>
  <path class="vein" d="M100 43.6 Q104.8 38.9 106.2 34.3"/>
  <path class="vein" d="M100 23.3 Q98.7 18.6 100 14"/>
  <path class="vein" d="M100 23.3 Q101.3 18.6 100 14"/>
</svg>
```

### 동자꽃
<!-- 동자꽃 Lychnis cognata viewBox="0 0 200 300" -->
```html
<svg class="flora" viewBox="0 0 200 300" aria-hidden="true">
  <path d="M100 296 C96 230 106 150 100 96"/>
  <path d="M98 250 L94.1 250.1 L90.2 250.4 L86.2 250.5 L82.4 250.5 L78.7 250.2 L75 249.6 L71.5 248.7 L68.1 247.5 L64.8 246 L61.6 244.1 L58.4 242.1 L55.4 239.8 L52.4 237.4 L49.5 234.9 L46.5 232.5 L43.5 230.2 L47.3 230.3 L51.1 230.3 L55 230.4 L58.8 230.4 L62.6 230.6 L66.3 231.1 L69.9 231.7 L73.4 232.7 L76.8 233.9 L80.1 235.5 L83.3 237.4 L86.3 239.6 L89.3 242.1 L92.2 244.7 L95.1 247.4 L98 250 Z"/>
  <path class="vein" d="M98 250 Q71.8 240.5 47.8 231.7"/>
  <path d="M102 250 L104.9 247.4 L107.8 244.7 L110.7 242.1 L113.7 239.6 L116.7 237.4 L119.9 235.5 L123.2 233.9 L126.6 232.7 L130.1 231.7 L133.7 231.1 L137.4 230.6 L141.2 230.4 L145 230.4 L148.9 230.3 L152.7 230.3 L156.5 230.2 L153.5 232.5 L150.5 234.9 L147.6 237.4 L144.6 239.8 L141.6 242.1 L138.4 244.1 L135.2 246 L131.9 247.5 L128.5 248.7 L125 249.6 L121.3 250.2 L117.6 250.5 L113.8 250.5 L109.8 250.4 L105.9 250.1 L102 250 Z"/>
  <path class="vein" d="M102 250 Q128.2 240.5 152.2 231.7"/>
  <path d="M98 196 L94.4 196.5 L90.7 197.1 L87 197.5 L83.4 197.8 L79.9 197.9 L76.5 197.6 L73.1 197 L69.9 196.1 L66.7 194.9 L63.6 193.4 L60.6 191.6 L57.7 189.6 L54.8 187.5 L51.9 185.3 L49 183.1 L46.1 181.1 L49.7 180.9 L53.3 180.6 L56.9 180.3 L60.4 180 L64 179.9 L67.5 180 L70.9 180.3 L74.2 181 L77.5 181.9 L80.6 183.2 L83.6 184.8 L86.6 186.7 L89.5 188.9 L92.3 191.2 L95.2 193.7 L98 196 Z"/>
  <path class="vein" d="M98 196 Q73.1 188.9 50.2 182.3"/>
  <path d="M102 196 L104.8 193.7 L107.7 191.2 L110.5 188.9 L113.4 186.7 L116.4 184.8 L119.4 183.2 L122.5 181.9 L125.8 181 L129.1 180.3 L132.5 180 L136 179.9 L139.6 180 L143.1 180.3 L146.7 180.6 L150.3 180.9 L153.9 181.1 L151 183.1 L148.1 185.3 L145.2 187.5 L142.3 189.6 L139.4 191.6 L136.4 193.4 L133.3 194.9 L130.1 196.1 L126.9 197 L123.5 197.6 L120.1 197.9 L116.6 197.8 L113 197.5 L109.3 197.1 L105.6 196.5 L102 196 Z"/>
  <path class="vein" d="M102 196 Q126.9 188.9 149.8 182.3"/>
  <path d="M98 146 L94.9 146.2 L91.7 146.5 L88.6 146.7 L85.6 146.8 L82.7 146.6 L79.9 146.1 L77.2 145.3 L74.7 144.2 L72.3 142.8 L70 141.2 L67.9 139.3 L65.8 137.1 L63.8 134.9 L61.8 132.6 L59.9 130.3 L57.8 128.1 L60.8 128.2 L63.8 128.1 L66.9 128 L69.9 128 L72.8 128.1 L75.7 128.5 L78.5 129 L81.1 129.9 L83.6 131 L86 132.5 L88.2 134.2 L90.3 136.3 L92.3 138.5 L94.2 141 L96.1 143.5 L98 146 Z"/>
  <path class="vein" d="M98 146 Q78.7 137.4 61 129.5"/>
  <path d="M102 146 L103.9 143.5 L105.8 141 L107.7 138.5 L109.7 136.3 L111.8 134.2 L114 132.5 L116.4 131 L118.9 129.9 L121.5 129 L124.3 128.5 L127.2 128.1 L130.1 128 L133.1 128 L136.2 128.1 L139.2 128.2 L142.2 128.1 L140.1 130.3 L138.2 132.6 L136.2 134.9 L134.2 137.1 L132.1 139.3 L130 141.2 L127.7 142.8 L125.3 144.2 L122.8 145.3 L120.1 146.1 L117.3 146.6 L114.4 146.8 L111.4 146.7 L108.3 146.5 L105.1 146.2 L102 146 Z"/>
  <path class="vein" d="M102 146 Q121.3 137.4 139 129.5"/>
  <path class="petal petal--red" d="M96.8 56.8 Q87.6 34 92.1 24 L100 30.4 L107.9 24 Q112.4 34 103.2 56.8 Z"/>
  <path class="vein" d="M100 55.2 L100 32.8"/>
  <path class="petal petal--red" d="M105.9 58.7 Q124.7 42.9 135.6 44.1 L132 53.6 L140.5 59.2 Q132.4 66.5 107.8 64.8 Z"/>
  <path class="vein" d="M108.4 61.3 L129.7 54.4"/>
  <path class="petal petal--red" d="M106.8 67.9 Q127.7 81 129.9 91.7 L119.7 91.2 L117.1 101 Q107.6 95.6 101.6 71.7 Z"/>
  <path class="vein" d="M105.2 71.1 L118.3 89.2"/>
  <path class="petal petal--red" d="M98.4 71.7 Q92.4 95.6 82.9 101 L80.3 91.2 L70.1 91.7 Q72.3 81 93.2 67.9 Z"/>
  <path class="vein" d="M94.8 71.1 L81.7 89.2"/>
  <path class="petal petal--red" d="M92.2 64.8 Q67.6 66.5 59.5 59.2 L68 53.6 L64.4 44.1 Q75.3 42.9 94.1 58.7 Z"/>
  <path class="vein" d="M91.6 61.3 L70.3 54.4"/>
  <circle cx="100" cy="64" r="4.8"/>
  <path d="M100 96 L100 78"/>
  <path class="petal petal--red" d="M150.4 124.1 Q152.1 111.9 156.6 108.7 L158.4 113.5 L163.4 112.7 Q162.9 118.1 153.2 125.7 Z"/>
  <path class="vein" d="M152.2 124.2 L157.8 114.5"/>
  <path class="petal petal--red" d="M153.9 127.2 Q166 125.1 170.4 128.3 L166.4 131.5 L168.7 136 Q163.4 137.2 153.2 130.3 Z"/>
  <path class="vein" d="M154.3 128.9 L165.3 131.2"/>
  <path class="petal petal--red" d="M152 131.4 Q157.7 142.3 156 147.5 L151.8 144.7 L148.1 148.3 Q145.4 143.6 148.8 131.7 Z"/>
  <path class="vein" d="M150.5 132.4 L151.6 143.5"/>
  <path class="petal petal--red" d="M147.4 130.9 Q138.8 139.8 133.3 139.8 L134.7 134.8 L130.1 132.5 Q133.8 128.4 146.1 128 Z"/>
  <path class="vein" d="M146 129.8 L135.7 134.3"/>
  <path class="petal petal--red" d="M146.4 126.4 Q135.4 121 133.7 115.8 L138.8 115.5 L139.6 110.5 Q144.6 112.7 148.8 124.3 Z"/>
  <path class="vein" d="M147.1 124.7 L139.6 116.4"/>
  <circle cx="150" cy="128" r="2.4"/>
  <path d="M104 150 Q128 140 146 136"/>
</svg>
```

### 투구꽃
<!-- 투구꽃 Aconitum jaluense viewBox="0 0 200 300" -->
```html
<svg class="flora" viewBox="0 0 200 300" aria-hidden="true">
  <path d="M96 296 C92 220 110 140 104 30"/>
  <path d="M103 143.8 Q113 139.8 121 147.8"/>
  <path class="petal" d="M121 149.8 c-2.3 -11.5 0 -27.6 11.5 -34.5 c9.2 -4.6 18.4 2.3 18.4 16.1 c0 6.9 4.6 9.2 9.2 11.5 c-4.6 2.3 -11.5 2.3 -16.1 0 c-6.9 6.9 -16.1 9.2 -23 6.9z"/>
  <path class="petal" d="M0 0" transform="translate(121 149.8)"/>
  <path class="petal" d="M123.3 149.8 c2.3 9.2 11.5 13.8 18.4 9.2 c3.4 -2.3 4.6 -6.9 2.3 -9.2z"/>
  <path class="vein" d="M124.4 142.9 c0 -9.2 4.6 -18.4 11.5 -21.8"/>
  <path d="M104.2 121.6 Q94.2 117.6 86.2 125.6"/>
  <path class="petal" d="M86.2 127.6 c2.2 -10.8 0 -25.9 -10.8 -32.4 c-8.6 -4.3 -17.3 2.2 -17.3 15.1 c0 6.5 -4.3 8.6 -8.6 10.8 c4.3 2.2 10.8 2.2 15.1 0 c6.5 6.5 15.1 8.6 21.6 6.5z"/>
  <path class="petal" d="M0 0" transform="translate(86.2 127.6)"/>
  <path class="petal" d="M84 127.6 c-2.2 8.6 -10.8 13 -17.3 8.6 c-3.2 -2.2 -4.3 -6.5 -2.2 -8.6z"/>
  <path class="vein" d="M82.9 121.1 c0 -8.6 -4.3 -17.3 -10.8 -20.5"/>
  <path d="M105 98.5 Q115 94.5 123 102.5"/>
  <path class="petal" d="M123 104.5 c-2 -10.1 0 -24.2 10.1 -30.3 c8.1 -4 16.2 2 16.2 14.1 c0 6.1 4 8.1 8.1 10.1 c-4 2 -10.1 2 -14.1 0 c-6.1 6.1 -14.1 8.1 -20.2 6.1z"/>
  <path class="petal" d="M0 0" transform="translate(123 104.5)"/>
  <path class="petal" d="M125 104.5 c2 8.1 10.1 12.1 16.2 8.1 c3 -2 4 -6.1 2 -8.1z"/>
  <path class="vein" d="M126 98.5 c0 -8.1 4 -16.2 10.1 -19.2"/>
  <path d="M105.2 74.5 Q95.2 70.5 87.2 78.5"/>
  <path class="petal" d="M87.2 80.5 c1.9 -9.4 0 -22.6 -9.4 -28.2 c-7.5 -3.8 -15 1.9 -15 13.2 c0 5.6 -3.8 7.5 -7.5 9.4 c3.8 1.9 9.4 1.9 13.2 0 c5.6 5.6 13.2 7.5 18.8 5.6z"/>
  <path class="petal" d="M0 0" transform="translate(87.2 80.5)"/>
  <path class="petal" d="M85.4 80.5 c-1.9 7.5 -9.4 11.3 -15 7.5 c-2.8 -1.9 -3.8 -5.6 -1.9 -7.5z"/>
  <path class="vein" d="M84.4 74.9 c0 -7.5 -3.8 -15 -9.4 -17.9"/>
  <path d="M104.8 49.5 Q114.8 45.5 122.8 53.5"/>
  <path class="petal" d="M122.8 55.5 c-1.7 -8.7 0 -20.9 8.7 -26.1 c7 -3.5 13.9 1.7 13.9 12.2 c0 5.2 3.5 7 7 8.7 c-3.5 1.7 -8.7 1.7 -12.2 0 c-5.2 5.2 -12.2 7 -17.4 5.2z"/>
  <path class="petal" d="M0 0" transform="translate(122.8 55.5)"/>
  <path class="petal" d="M124.6 55.5 c1.7 7 8.7 10.4 13.9 7 c2.6 -1.7 3.5 -5.2 1.7 -7z"/>
  <path class="vein" d="M125.4 50.3 c0 -7 3.5 -13.9 8.7 -16.5"/>
  <path d="M94 236 L92.7 239.5 L91.4 243.8 L89.7 246.2 L88.4 250.6 L85.8 251.8 L83.9 255.5 L80.5 255.8 L77.9 258.5 L74.1 258.4 L70.7 260.2 L67.1 260.3 L63.7 261.4 L65.4 258.2 L66.1 254.7 L68.5 251.7 L69 248 L72.2 245.8 L73.1 242.5 L77 241.4 L78.7 239 L83.2 238.5 L85.8 237.2 L90.3 236.7 L94 236 Z"/>
  <path class="vein" d="M94 236 Q79.5 248.2 66.1 259.4"/>
  <path class="vein" d="M89.8 239.6 Q88.9 243.4 88.2 247.5"/>
  <path class="vein" d="M89.8 239.6 Q85.8 239.8 81.6 239.7"/>
  <path class="vein" d="M68.6 257.3 Q66.9 260.2 63.7 261.4"/>
  <path class="vein" d="M68.6 257.3 Q65.4 258.5 63.7 261.4"/>
  <path d="M94 236 L90.6 238.5 L86.7 241.7 L83.6 243 L79.7 246.2 L76.4 246 L72.4 248.4 L68.8 247 L64.6 248.2 L61 246.3 L56.5 246.2 L52.9 244.6 L48.9 243.9 L52.5 241.9 L55.3 239.2 L59.4 237.6 L62.2 234.6 L66.6 234.2 L69.5 231.8 L74 232.6 L77.1 231.3 L81.9 233 L85.2 233.2 L89.9 234.8 L94 236 Z"/>
  <path class="vein" d="M94 236 Q72.4 239.8 52.5 243.3"/>
  <path class="vein" d="M87.7 237.1 Q84.5 240.1 81.4 243.4"/>
  <path class="vein" d="M87.7 237.1 Q83.7 235.4 79.6 233.3"/>
  <path class="vein" d="M56.1 242.7 Q52.7 244.4 48.9 243.9"/>
  <path class="vein" d="M56.1 242.7 Q52.3 242.2 48.9 243.9"/>
  <path d="M94 236 L89.3 236.2 L83.8 236.9 L80 236.3 L74.5 237 L71.3 235 L66.1 234.8 L63.3 231.7 L58.5 230.4 L55.8 226.8 L51.5 224.3 L48.7 221 L45.1 218.2 L49.7 218.4 L53.9 217.6 L58.9 218.5 L63.2 217.5 L67.7 219.5 L71.9 219 L76 222.2 L79.7 222.8 L83.5 226.8 L86.7 228.8 L90.6 232.8 L94 236 Z"/>
  <path class="vein" d="M94 236 Q70.5 227.5 49 219.6"/>
  <path class="vein" d="M87.2 233.5 Q82.4 234.3 77.6 235.5"/>
  <path class="vein" d="M87.2 233.5 Q84.1 229.9 81.1 225.9"/>
  <path class="vein" d="M53 221.1 Q48.7 220.7 45.1 218.2"/>
  <path class="vein" d="M53 221.1 Q49.4 218.6 45.1 218.2"/>
  <path d="M94 236 L90.1 234.3 L85.4 232.5 L82.8 230.5 L78.1 228.7 L76.5 225.8 L72.5 223.5 L71.9 219.7 L68.8 216.6 L68.6 212.5 L66.4 208.7 L66 204.8 L64.6 200.9 L68.1 203 L71.9 204.1 L75.3 206.9 L79.3 207.8 L81.8 211.4 L85.4 212.6 L87 217 L89.6 219 L90.5 224 L92.1 227 L93 231.9 L94 236 Z"/>
  <path class="vein" d="M94 236 Q79.9 219.2 66.9 203.7"/>
  <path class="vein" d="M89.9 231.1 Q85.7 229.8 81.3 228.8"/>
  <path class="vein" d="M89.9 231.1 Q89.3 226.8 89.1 222.2"/>
  <path class="vein" d="M69.3 206.6 Q66.1 204.5 64.6 200.9"/>
  <path class="vein" d="M69.3 206.6 Q67.8 203 64.6 200.9"/>
  <path d="M94 236 L91.6 233.1 L88.5 229.8 L87.3 227.2 L84.2 223.9 L84.4 221 L82.2 217.5 L83.6 214.4 L82.6 210.8 L84.5 207.6 L84.7 203.7 L86.3 200.6 L87.1 197.1 L89.1 200.1 L91.7 202.5 L93.2 206 L96.1 208.4 L96.4 212.2 L98.8 214.6 L97.9 218.6 L99.1 221.2 L97.3 225.4 L97 228.3 L95.2 232.4 L94 236 Z"/>
  <path class="vein" d="M94 236 Q90.7 217.3 87.7 200.1"/>
  <path class="vein" d="M93 230.6 Q90.2 227.8 86.9 225.2"/>
  <path class="vein" d="M93 230.6 Q94.8 227 97 223.4"/>
  <path class="vein" d="M88.2 203.3 Q86.6 200.4 87.1 197.1"/>
  <path class="vein" d="M88.2 203.3 Q88.8 200 87.1 197.1"/>
  <path d="M98 200 L96.9 196.8 L95.3 193.2 L95.1 190.6 L93.5 187 L94.6 184.6 L93.8 181.1 L95.9 178.9 L96.1 175.6 L98.7 173.5 L100 170.3 L102.4 168.2 L104.1 165.6 L104.8 168.7 L106.2 171.4 L106.4 174.9 L108.1 177.7 L107.2 180.9 L108.5 183.7 L106.5 186.7 L106.7 189.3 L103.9 192.2 L102.8 194.5 L100.1 197.4 L98 200 Z"/>
  <path class="vein" d="M98 200 Q100.9 183.5 103.6 168.3"/>
  <path class="vein" d="M98.8 195.2 Q97.3 192.1 95.4 188.9"/>
  <path class="vein" d="M98.8 195.2 Q101.4 192.8 104.3 190.5"/>
  <path class="vein" d="M103.1 171.1 Q102.6 168.2 104.1 165.6"/>
  <path class="vein" d="M103.1 171.1 Q104.5 168.5 104.1 165.6"/>
  <path d="M98 200 L98.9 196.4 L99.7 192 L101.1 189.4 L101.9 185 L104.2 183.2 L105.6 179.3 L108.8 178.2 L111 175.1 L114.5 174.2 L117.6 171.8 L120.9 170.8 L124 169 L122.8 172.4 L122.4 175.8 L120.5 179.2 L120.3 182.9 L117.6 185.6 L117 188.9 L113.5 191 L112.1 193.6 L107.9 195.1 L105.6 196.9 L101.4 198.5 L98 200 Z"/>
  <path class="vein" d="M98 200 Q110.5 185.1 122 171.4"/>
  <path class="vein" d="M101.6 195.7 Q102.1 191.8 102.3 187.8"/>
  <path class="vein" d="M101.6 195.7 Q105.3 194.5 109.3 193.6"/>
  <path class="vein" d="M119.9 174 Q121.2 170.8 124 169"/>
  <path class="vein" d="M119.9 174 Q122.7 172.1 124 169"/>
  <path d="M98 200 L101 197.2 L104.4 193.6 L107.3 191.9 L110.6 188.3 L113.9 187.8 L117.6 184.9 L121.2 185.4 L125.3 183.6 L129.1 184.5 L133.5 183.7 L137.2 184.4 L141.2 184.3 L138 186.7 L135.6 189.7 L131.7 191.9 L129.4 195 L125.2 196.2 L122.7 199 L118.1 199.1 L115.2 200.8 L110.3 200.3 L107 200.8 L102.2 200.2 L98 200 Z"/>
  <path class="vein" d="M98 200 Q118.7 192.4 137.8 185.5"/>
  <path class="vein" d="M104.1 197.8 Q106.8 194.6 109.4 191"/>
  <path class="vein" d="M104.1 197.8 Q108.2 198.5 112.5 199.5"/>
  <path class="vein" d="M134.3 186.8 Q137.4 184.6 141.2 184.3"/>
  <path class="vein" d="M134.3 186.8 Q138.1 186.4 141.2 184.3"/>
  <path d="M98 200 L101.6 199 L105.8 197.5 L108.7 197.3 L112.9 195.8 L115.7 197 L119.7 196.2 L122.3 198.4 L126.1 198.8 L128.6 201.4 L132.2 202.8 L134.8 205.2 L137.9 207 L134.3 207.6 L131.2 209 L127.2 209.1 L124 210.8 L120.3 209.8 L117.1 211 L113.6 208.9 L110.6 209 L107.2 206.2 L104.5 205 L101 202.2 L98 200 Z"/>
  <path class="vein" d="M98 200 Q117.1 203.4 134.7 206.5"/>
  <path class="vein" d="M103.6 201 Q107.1 199.5 110.7 197.6"/>
  <path class="vein" d="M103.6 201 Q106.4 203.6 109.2 206.6"/>
  <path class="vein" d="M131.5 205.9 Q134.8 205.5 137.9 207"/>
  <path class="vein" d="M131.5 205.9 Q134.5 207.4 137.9 207"/>
  <path d="M98 200 L101.3 200.6 L105.2 201.1 L107.6 202.2 L111.5 202.6 L113 204.7 L116.5 205.8 L117.3 208.7 L120.1 210.6 L120.6 213.9 L122.7 216.6 L123.3 219.7 L124.8 222.5 L121.8 221.5 L118.6 221.4 L115.6 219.8 L112.3 219.9 L109.9 217.5 L106.9 217.2 L105.3 214 L103 212.9 L101.8 209.1 L100.3 206.9 L99.2 203.1 L98 200 Z"/>
  <path class="vein" d="M98 200 Q110.9 210.8 122.7 220.7"/>
  <path class="vein" d="M101.7 203.1 Q105.2 203.3 108.9 203.3"/>
  <path class="vein" d="M101.7 203.1 Q102.6 206.5 103.1 210.2"/>
  <path class="vein" d="M120.5 218.9 Q123.3 219.9 124.8 222.5"/>
  <path class="vein" d="M120.5 218.9 Q122 221.4 124.8 222.5"/>
</svg>
```

### 물봉선
<!-- 물봉선 Impatiens textorii viewBox="0 0 200 300" -->
```html
<svg class="flora" viewBox="0 0 200 300" aria-hidden="true">
  <path d="M92 296 C86 210 112 150 104 60"/>
  <path d="M92 244 Q90.2 240.6 84.5 241.3"/>
  <path d="M84.5 241.3 L79.9 244.7 L76.1 246 L72.6 246.6 L68.2 247.6 L66 246.8 L61.7 247.3 L59.8 245.7 L55.7 245.7 L54 243.5 L50 243.1 L48.5 240.5 L44.7 239.6 L43.2 236.8 L39.6 235.4 L38.2 232.6 L34.8 230.7 L33.3 227.9 L30 225.5 L28.5 222.9 L26.2 220.1 L29.8 219.4 L32.7 218.3 L36.7 218.6 L39.6 217.4 L43.4 218.1 L46.4 216.9 L50 218.1 L52.9 217 L56.4 218.7 L59.3 217.7 L62.6 219.9 L65.3 219.3 L68.4 222 L70.9 222 L73.8 225.2 L76.1 225.9 L78.8 229.6 L81.2 232.2 L83.2 235.7 L84.5 241.3 Z"/>
  <path class="vein" d="M84.5 241.3 Q56.5 231.1 30.8 221.7"/>
  <path class="vein" d="M76.3 238.3 Q69.7 242.1 63.4 244.8"/>
  <path class="vein" d="M76.3 238.3 Q73.7 231.1 70.6 225"/>
  <path class="vein" d="M55.9 230.9 Q49 235.5 43.7 235.5"/>
  <path class="vein" d="M55.9 230.9 Q53.6 222.8 49.5 219.4"/>
  <path class="vein" d="M35.5 223.5 Q30.1 223.8 26.2 220.1"/>
  <path class="vein" d="M35.5 223.5 Q31.6 219.7 26.2 220.1"/>
  <path d="M100 214 Q105.9 211 107.8 212.1"/>
  <path d="M107.8 212.1 L109.4 206.8 L111.6 203.5 L114 201.2 L116.9 197.9 L119.1 197.4 L122.1 194.6 L124.4 195 L127.6 192.7 L130.1 193.6 L133.3 191.8 L135.9 193.1 L139.3 191.8 L141.9 193.3 L145.5 192.5 L148.1 194.1 L151.8 193.8 L154.4 195.3 L158.2 195.5 L160.8 196.9 L164 198 L161.7 200.5 L160 203 L156.8 205 L155.2 207.5 L151.8 209 L150.2 211.6 L146.7 212.6 L145.1 215.1 L141.5 215.6 L139.8 218 L136.1 217.9 L134.3 219.9 L130.5 219.4 L128.6 220.8 L124.6 219.7 L122.5 220.3 L118.4 218.7 L115.2 217.8 L111.7 216 L107.8 212.1 Z"/>
  <path class="vein" d="M107.8 212.1 Q134.8 205.3 159.6 199.1"/>
  <path class="vein" d="M115.6 210.1 Q118.7 203.3 122.1 197.7"/>
  <path class="vein" d="M115.6 210.1 Q121.6 214.7 127.2 218"/>
  <path class="vein" d="M135.3 205.2 Q138.2 197.5 142.3 194.6"/>
  <path class="vein" d="M135.3 205.2 Q141.5 210.6 146.4 211.2"/>
  <path class="vein" d="M155 200.3 Q159 197.1 164 198"/>
  <path class="vein" d="M155 200.3 Q160.1 201.3 164 198"/>
  <path d="M92 178 Q90.4 174.2 84.8 174.5"/>
  <path d="M84.8 174.5 L80.4 177.6 L76.9 178.8 L73.8 179.2 L69.8 180.1 L68.1 179.1 L64.3 179.5 L62.9 177.8 L59.4 177.7 L58.3 175.5 L55 174.9 L54 172.4 L50.9 171.3 L50.1 168.6 L47.2 167.1 L46.4 164.3 L43.8 162.3 L42.9 159.6 L40.5 157.2 L39.6 154.5 L38.1 151.7 L41.2 151.2 L43.9 150.3 L47.3 150.7 L50 149.6 L53.1 150.5 L55.8 149.4 L58.8 150.7 L61.5 149.7 L64.2 151.5 L66.8 150.7 L69.3 153 L71.7 152.5 L74 155.2 L76.1 155.3 L78.2 158.5 L80 159.3 L81.8 162.9 L83.4 165.6 L84.6 169.1 L84.8 174.5 Z"/>
  <path class="vein" d="M84.8 174.5 Q62.4 163.6 41.7 153.5"/>
  <path class="vein" d="M78.3 171.3 Q72 174.7 66.2 177.1"/>
  <path class="vein" d="M78.3 171.3 Q77.1 164.2 75.4 158.2"/>
  <path class="vein" d="M61.9 163.3 Q55.2 167.6 50.7 167.4"/>
  <path class="vein" d="M61.9 163.3 Q61.1 155.4 58.2 152"/>
  <path class="vein" d="M45.6 155.3 Q40.9 155.5 38.1 151.7"/>
  <path class="vein" d="M45.6 155.3 Q42.8 151.6 38.1 151.7"/>
  <path d="M100 146 Q105.7 142.5 107.4 143"/>
  <path d="M107.4 143 L107.8 137.7 L108.9 134.5 L110.4 132 L112.1 128.6 L113.8 128 L115.7 125.1 L117.6 125.3 L119.7 122.9 L121.9 123.6 L124.2 121.7 L126.5 122.8 L129 121.3 L131.4 122.6 L134.1 121.6 L136.5 123 L139.4 122.5 L141.8 123.8 L144.9 123.7 L147.2 124.9 L150.1 125.8 L148.6 128.4 L147.8 130.8 L145.5 133 L144.7 135.6 L142.3 137.2 L141.5 139.8 L138.9 141 L138 143.6 L135.2 144.3 L134.3 146.7 L131.3 146.9 L130.2 148.9 L127.1 148.6 L125.8 150.1 L122.4 149.4 L120.8 150.1 L117.2 148.8 L114.4 148.1 L111.3 146.5 L107.4 143 Z"/>
  <path class="vein" d="M107.4 143 Q127.9 134.7 146.7 127.1"/>
  <path class="vein" d="M113.4 140.6 Q114.6 133.8 116.3 128.1"/>
  <path class="vein" d="M113.4 140.6 Q119 144.6 124.1 147.6"/>
  <path class="vein" d="M128.3 134.6 Q129.2 126.9 131.9 123.9"/>
  <path class="vein" d="M128.3 134.6 Q134.3 139.4 138.3 139.7"/>
  <path class="vein" d="M143.2 128.5 Q145.8 125.1 150.1 125.8"/>
  <path class="vein" d="M143.2 128.5 Q147.5 129.2 150.1 125.8"/>
  <path d="M104 60 Q118 44 132 50"/>
  <path d="M132 50 c3 9 6 15 3 24"/>
  <path class="petal petal--red" d="M135 74 c-21 -3 -45 6 -51 24 c-4.5 15 6 27 21 24 c15 -3 24 -12 39 -9 c15 3 24 -6 24 -18 c0 -12 -12 -21 -33 -21z"/>
  <path class="petal petal--red" d="M102 119 c-9 9 -6 21 6 24 c12 1.5 21 -6 24 -18"/>
  <path d="M159 89 c12 3 18 12 15 21 c-1.5 6 -7.5 6 -9 1.5"/>
  <path class="vein" d="M96 95 c15 -9 33 -9 51 -3"/>
  <path class="vein" d="M93 107 c15 0 30 -3 45 -6"/>
  <path d="M100 122 Q84 108 66 112"/>
  <path d="M66 112 c-2.1 6.3 -4.2 10.5 -2.1 16.8"/>
  <path class="petal petal--red" d="M63.9 128.8 c14.7 -2.1 31.5 4.2 35.7 16.8 c3.2 10.5 -4.2 18.9 -14.7 16.8 c-10.5 -2.1 -16.8 -8.4 -27.3 -6.3 c-10.5 2.1 -16.8 -4.2 -16.8 -12.6 c0 -8.4 8.4 -14.7 23.1 -14.7z"/>
  <path class="petal petal--red" d="M87 160.3 c6.3 6.3 4.2 14.7 -4.2 16.8 c-8.4 1.1 -14.7 -4.2 -16.8 -12.6"/>
  <path d="M47.1 139.3 c-8.4 2.1 -12.6 8.4 -10.5 14.7 c1.1 4.2 5.2 4.2 6.3 1.1"/>
  <path class="vein" d="M91.2 143.5 c-10.5 -6.3 -23.1 -6.3 -35.7 -2.1"/>
  <path class="vein" d="M93.3 151.9 c-10.5 0 -21 -2.1 -31.5 -4.2"/>
</svg>
```

### 얼레지
<!-- 얼레지 Erythronium japonicum viewBox="0 0 200 300" -->
```html
<svg class="flora" viewBox="0 0 200 300" aria-hidden="true">
  <path d="M100 296 C98 220 104 150 112 96 C116 80 118 72 116 64"/>
  <path class="petal" d="M116 70 Q118.6 122.4 135.1 54.5 Q132.6 118.4 118 72z"/>
  <path class="petal" d="M116 70 Q103 121.4 106.9 57.5 Q117 117.4 118 72z"/>
  <path class="petal" d="M116 70 Q88.7 111.4 81.3 59 Q102.7 107.4 118 72z"/>
  <path class="petal" d="M116 70 Q123.4 105.5 143.7 63.5 Q137.4 101.5 118 72z"/>
  <path class="petal" d="M116 70 Q95.8 111.3 94 65 Q109.8 107.3 118 72z"/>
  <path class="petal" d="M116 70 Q87.2 91.6 78.6 68 Q101.2 87.6 118 72z"/>
  <path d="M116 72 L112 96"/><path d="M116 72 L120 98"/><path d="M116 72 L116 100"/>
  <path d="M100 290 L93.5 282.5 L86.7 275.1 L80.2 267.7 L74.1 260 L68.5 252.2 L63.5 244.1 L59.2 235.7 L55.7 227 L52.8 218.1 L50.5 208.9 L48.8 199.4 L47.6 189.8 L46.6 180.1 L45.8 170.3 L45 160.6 L43.8 150.9 L49.7 158.7 L55.9 166.3 L62.1 173.9 L68.1 181.5 L73.9 189.3 L79.2 197.3 L84 205.5 L88.1 213.9 L91.6 222.6 L94.3 231.6 L96.4 240.9 L97.8 250.4 L98.7 260.2 L99.2 270.1 L99.5 280.1 L100 290 Z"/>
  <path class="vein" d="M100 290 Q73 223.2 48.2 161.8"/>
  <path d="M100 290 L100.4 280.7 L100.6 271.4 L101 262.1 L101.8 253 L103.1 244.1 L105 235.4 L107.6 227 L110.8 218.9 L114.7 211 L119.2 203.4 L124.1 195.9 L129.6 188.7 L135.3 181.6 L141.1 174.5 L146.9 167.4 L152.4 160.2 L151.4 169.2 L150.7 178.4 L150 187.5 L149.1 196.6 L148 205.6 L146.4 214.4 L144.3 223 L141.6 231.3 L138.3 239.4 L134.3 247.2 L129.6 254.8 L124.4 262.1 L118.6 269.2 L112.5 276.2 L106.2 283 L100 290 Z"/>
  <path class="vein" d="M100 290 Q125.2 227.7 148.3 170.4"/>
  <path class="vein" d="M70 200 q6 -4 10 1 q-4 6 -10 -1z"/>
  <path class="vein" d="M82 232 q6 -4 10 1 q-4 6 -10 -1z"/>
  <path class="vein" d="M64 248 q6 -4 10 1 q-4 6 -10 -1z"/>
  <path class="vein" d="M130 214 q6 -4 10 1 q-4 6 -10 -1z"/>
  <path class="vein" d="M122 246 q6 -4 10 1 q-4 6 -10 -1z"/>
  <path class="vein" d="M138 184 q6 -4 10 1 q-4 6 -10 -1z"/>
</svg>
```

### 큰앵초
<!-- 큰앵초 Primula jesoana viewBox="0 0 200 300" -->
```html
<svg class="flora" viewBox="0 0 200 300" aria-hidden="true">
  <path d="M100 290 C98 220 102 160 100 96"/>
  <path d="M100 96 Q84.4 84 65.4 79"/>
  <path class="petal petal--red" d="M64.3 68.7 Q60.5 61.2 62.2 58 L65.4 60.1 L68.5 58 Q70.2 61.2 66.4 68.7 Z"/>
  <path class="vein" d="M65.4 68.1 L65.4 60.9"/>
  <path class="petal petal--red" d="M67.3 69.3 Q73.1 63.4 76.8 64 L75.7 67.6 L78.7 70 Q76.1 72.6 67.9 71.3 Z"/>
  <path class="vein" d="M68.1 70.1 L75 67.9"/>
  <path class="petal petal--red" d="M67.6 72.3 Q75 76 75.5 79.7 L71.8 79.8 L70.5 83.4 Q67.1 81.8 65.9 73.5 Z"/>
  <path class="vein" d="M67 73.3 L71.3 79.2"/>
  <path class="petal petal--red" d="M64.8 73.5 Q63.6 81.8 60.2 83.4 L58.9 79.8 L55.2 79.7 Q55.7 76 63.1 72.3 Z"/>
  <path class="vein" d="M63.7 73.3 L59.4 79.2"/>
  <path class="petal petal--red" d="M62.8 71.3 Q54.6 72.6 52 70 L55 67.6 L54 64 Q57.6 63.4 63.5 69.3 Z"/>
  <path class="vein" d="M62.6 70.1 L55.7 67.9"/>
  <circle cx="65.4" cy="71" r="1.6"/>
  <path d="M100 96 Q91 75.2 80 66.6"/>
  <path class="petal petal--red" d="M79.3 56.1 Q76.3 48.3 78.5 45.3 L81.3 47.7 L84.7 46 Q86 49.5 81.3 56.4 Z"/>
  <path class="vein" d="M80.3 55.7 L81.2 48.5"/>
  <path class="petal petal--red" d="M82.1 57.1 Q88.6 51.9 92.2 53 L90.7 56.5 L93.4 59.1 Q90.5 61.5 82.5 59.1 Z"/>
  <path class="vein" d="M82.8 58 L90 56.6"/>
  <path class="petal petal--red" d="M82 60.1 Q89 64.7 89 68.4 L85.3 68.1 L83.6 71.4 Q80.5 69.4 80.2 61.1 Z"/>
  <path class="vein" d="M81.4 61.1 L84.9 67.4"/>
  <path class="petal petal--red" d="M79.2 61 Q76.9 69 73.4 70.2 L72.6 66.5 L68.9 65.9 Q69.8 62.4 77.6 59.6 Z"/>
  <path class="vein" d="M78 60.6 L73.1 66"/>
  <path class="petal petal--red" d="M77.4 58.5 Q69.1 58.9 66.9 55.9 L70.1 53.9 L69.5 50.2 Q73.2 50 78.3 56.6 Z"/>
  <path class="vein" d="M77.4 57.3 L70.8 54.3"/>
  <circle cx="80" cy="58.6" r="1.6"/>
  <path d="M100 96 Q100 72 100 62"/>
  <path class="petal petal--red" d="M99.6 51.5 Q97.6 43.4 100.1 40.6 L102.6 43.4 L106.2 42.1 Q107.1 45.7 101.6 52 Z"/>
  <path class="vein" d="M100.7 51.2 L102.5 44.2"/>
  <path class="petal petal--red" d="M102.3 52.8 Q109.4 48.5 112.8 50 L110.9 53.2 L113.2 56.2 Q110.1 58.2 102.4 54.9 Z"/>
  <path class="vein" d="M102.9 53.8 L110.1 53.3"/>
  <path class="petal petal--red" d="M101.8 55.8 Q108.2 61.2 107.8 64.9 L104.1 64.1 L102 67.2 Q99.1 64.9 99.9 56.6 Z"/>
  <path class="vein" d="M101.1 56.7 L103.8 63.4"/>
  <path class="petal petal--red" d="M98.9 56.3 Q95.7 64 92 64.7 L91.6 61 L88 60 Q89.4 56.5 97.5 54.7 Z"/>
  <path class="vein" d="M97.8 55.8 L92.2 60.5"/>
  <path class="petal petal--red" d="M97.5 53.6 Q89.1 53 87.3 49.8 L90.7 48.2 L90.6 44.5 Q94.3 44.7 98.6 51.9 Z"/>
  <path class="vein" d="M97.6 52.5 L91.4 48.6"/>
  <circle cx="100" cy="54" r="1.6"/>
  <path d="M100 96 Q109 75.2 120 66.6"/>
  <path class="petal petal--red" d="M119.9 56 Q118.9 47.7 121.7 45.3 L123.9 48.4 L127.6 47.5 Q128 51.2 121.8 56.7 Z"/>
  <path class="vein" d="M121 55.9 L123.6 49.1"/>
  <path class="petal petal--red" d="M122.4 57.6 Q130 54.2 133.1 56.1 L130.9 59.1 L132.8 62.4 Q129.5 63.9 122.3 59.7 Z"/>
  <path class="vein" d="M122.9 58.7 L130.1 59.1"/>
  <path class="petal petal--red" d="M121.6 60.5 Q127.2 66.7 126.4 70.3 L122.8 69.1 L120.4 71.9 Q117.8 69.2 119.6 61.1 Z"/>
  <path class="vein" d="M120.7 61.3 L122.6 68.3"/>
  <path class="petal petal--red" d="M118.6 60.7 Q114.5 68 110.8 68.3 L110.8 64.5 L107.4 63 Q109.2 59.8 117.5 59 Z"/>
  <path class="vein" d="M117.6 60.1 L111.5 64.1"/>
  <path class="petal petal--red" d="M117.5 57.9 Q109.4 56.2 107.9 52.8 L111.5 51.7 L111.9 47.9 Q115.5 48.6 118.8 56.3 Z"/>
  <path class="vein" d="M117.8 56.8 L112.1 52.2"/>
  <circle cx="120" cy="58.6" r="1.6"/>
  <path d="M100 96 Q115.6 84 134.6 79"/>
  <path class="petal petal--red" d="M134.8 68.4 Q134.9 60.1 138 58.1 L139.8 61.4 L143.5 61 Q143.5 64.7 136.7 69.4 Z"/>
  <path class="vein" d="M136 68.5 L139.4 62"/>
  <path class="petal petal--red" d="M137.1 70.4 Q145.1 67.9 148 70.2 L145.4 72.9 L146.9 76.3 Q143.4 77.5 136.8 72.4 Z"/>
  <path class="vein" d="M137.5 71.5 L144.6 72.8"/>
  <path class="petal petal--red" d="M136 73.2 Q140.8 80 139.5 83.4 L136.2 81.8 L133.4 84.3 Q131.2 81.3 133.9 73.5 Z"/>
  <path class="vein" d="M135 73.8 L136.1 81"/>
  <path class="petal petal--red" d="M133 73 Q128 79.7 124.3 79.5 L124.8 75.8 L121.6 73.9 Q123.7 70.9 132.1 71.1 Z"/>
  <path class="vein" d="M132.1 72.3 L125.5 75.4"/>
  <path class="petal petal--red" d="M132.3 70 Q124.4 67.4 123.4 63.8 L127.1 63.1 L127.9 59.5 Q131.4 60.6 133.8 68.6 Z"/>
  <path class="vein" d="M132.7 68.9 L127.6 63.7"/>
  <circle cx="134.6" cy="71" r="1.6"/>
  <path d="M100 290 Q78 268 60 250"/><path d="M100 290 Q124 270 142 256"/>
  <path d="M54 236 L37.8 264.1 L34.1 257.7 L27.5 254.6 L26.8 247.3 L22.1 241.6 L24.6 234.7 L22.7 227.6 L27.9 222.4 L29.2 215.2 L36.1 212.7 L40.3 206.6 L47.6 207.3 L54 203.6 L60.4 207.3 L67.7 206.6 L71.9 212.7 L78.8 215.2 L80.1 222.4 L85.3 227.6 L83.4 234.7 L85.9 241.6 L81.2 247.3 L80.5 254.6 L73.9 257.7 L70.2 264.1 Z"/>
  <path class="vein" d="M54 236 L28.9 240.4"/>
  <path class="vein" d="M54 236 L34.5 219.6"/>
  <path class="vein" d="M54 236 L54 210.5"/>
  <path class="vein" d="M54 236 L73.5 219.6"/>
  <path class="vein" d="M54 236 L79.1 240.4"/>
  <path d="M148 242 L132.9 268.2 L129.5 262.2 L123.2 259.3 L122.6 252.5 L118.2 247.3 L120.6 240.8 L118.8 234.2 L123.7 229.3 L124.8 222.6 L131.3 220.2 L135.2 214.6 L142.1 215.2 L148 211.8 L153.9 215.2 L160.8 214.6 L164.7 220.2 L171.2 222.6 L172.3 229.3 L177.2 234.2 L175.4 240.8 L177.8 247.3 L173.4 252.5 L172.8 259.3 L166.5 262.2 L163.1 268.2 Z"/>
  <path class="vein" d="M148 242 L124.6 246.1"/>
  <path class="vein" d="M148 242 L129.8 226.7"/>
  <path class="vein" d="M148 242 L148 218.2"/>
  <path class="vein" d="M148 242 L166.2 226.7"/>
  <path class="vein" d="M148 242 L171.4 246.1"/>
</svg>
```

### 둥근이질풀
<!-- 둥근이질풀 Geranium koreanum viewBox="0 0 200 300" -->
```html
<svg class="flora" viewBox="0 0 200 300" aria-hidden="true">
  <path d="M100 296 C94 220 108 150 96 96"/>
  <path class="petal" d="M93.4 64.2 Q81.6 46 96 36.7 Q110.4 46 98.6 64.2 Z"/>
  <path class="vein" d="M96 63 L96 45"/>
  <path class="petal" d="M100.7 65.8 Q114.4 48.9 127.7 59.7 Q123.3 76.3 102.3 70.7 Z"/>
  <path class="vein" d="M102.7 67.8 L119.7 62.3"/>
  <path class="petal" d="M101.5 73.2 Q121.8 81 115.6 96.9 Q98.5 97.9 97.3 76.2 Z"/>
  <path class="vein" d="M100.1 75.7 L110.7 90.2"/>
  <path class="petal" d="M94.7 76.2 Q93.5 97.9 76.4 96.9 Q70.2 81 90.5 73.2 Z"/>
  <path class="vein" d="M91.9 75.7 L81.3 90.2"/>
  <path class="petal" d="M89.7 70.7 Q68.7 76.3 64.3 59.7 Q77.6 48.9 91.3 65.8 Z"/>
  <path class="vein" d="M89.3 67.8 L72.3 62.3"/>
  <circle cx="96" cy="70" r="3.8"/>
  <path class="petal" d="M145.7 128.1 Q142.7 114.8 153.1 112.5 Q159.6 121 148.7 129.2 Z"/>
  <path class="vein" d="M147.5 127.9 L151.3 117.3"/>
  <path class="petal" d="M149.7 130.5 Q161.3 123.5 166.8 132.7 Q160.7 141.5 149.5 133.7 Z"/>
  <path class="vein" d="M150.4 132.2 L161.6 132.5"/>
  <path class="petal" d="M148.5 135 Q158.8 143.9 151.7 152 Q141.5 148.9 145.5 135.9 Z"/>
  <path class="vein" d="M147.2 136.2 L150.3 147"/>
  <path class="petal" d="M143.9 135.3 Q138.6 147.8 128.8 143.6 Q128.5 132.9 142.1 132.7 Z"/>
  <path class="vein" d="M142.4 134.5 L133.1 140.7"/>
  <path class="petal" d="M142.2 131 Q128.6 129.9 129.6 119.2 Q139.7 115.7 144.1 128.5 Z"/>
  <path class="vein" d="M142.5 129.3 L133.7 122.4"/>
  <circle cx="146" cy="132" r="2.4"/>
  <path d="M104 160 Q130 150 142 150"/>
  <path d="M98 232 L96.9 235 L95.8 238.6 L94.4 240.7 L93.3 244.3 L91 245.4 L89.5 248.5 L86.6 248.8 L84.3 251 L81.2 251 L78.3 252.5 L75.3 252.6 L72.4 253.5 L73.8 250.8 L74.4 247.9 L76.4 245.3 L76.9 242.1 L79.5 240.3 L80.3 237.5 L83.6 236.5 L85 234.5 L88.8 234.1 L91.1 233 L94.9 232.6 L98 232 Z"/>
  <path class="vein" d="M98 232 Q85.7 242.3 74.4 251.8"/>
  <path class="vein" d="M94.4 235 Q93.6 238.3 93.1 241.8"/>
  <path class="vein" d="M94.4 235 Q91.1 235.2 87.5 235.1"/>
  <path class="vein" d="M76.5 250.1 Q75 252.5 72.4 253.5"/>
  <path class="vein" d="M76.5 250.1 Q73.8 251.1 72.4 253.5"/>
  <path d="M98 232 L95.1 234.1 L91.8 236.8 L89.2 237.9 L85.9 240.6 L83.1 240.5 L79.7 242.5 L76.7 241.3 L73.1 242.3 L70 240.7 L66.3 240.7 L63.2 239.3 L59.9 238.7 L62.8 237 L65.2 234.7 L68.8 233.4 L71.1 230.8 L74.8 230.5 L77.2 228.4 L81.1 229.1 L83.7 228 L87.7 229.5 L90.6 229.6 L94.6 231 L98 232 Z"/>
  <path class="vein" d="M98 232 Q79.7 235.2 62.9 238.2"/>
  <path class="vein" d="M92.7 232.9 Q90 235.4 87.3 238.3"/>
  <path class="vein" d="M92.7 232.9 Q89.3 231.5 85.8 229.8"/>
  <path class="vein" d="M66 237.6 Q63.1 239.1 59.9 238.7"/>
  <path class="vein" d="M66 237.6 Q62.8 237.3 59.9 238.7"/>
  <path d="M98 232 L94 232.2 L89.4 232.7 L86.2 232.3 L81.5 232.8 L78.8 231.2 L74.4 231 L72 228.4 L68 227.2 L65.7 224.2 L62 222.1 L59.7 219.3 L56.7 217 L60.5 217.1 L64.1 216.4 L68.3 217.2 L71.9 216.3 L75.8 218 L79.3 217.6 L82.7 220.3 L85.9 220.8 L89.1 224.2 L91.9 225.9 L95.1 229.3 L98 232 Z"/>
  <path class="vein" d="M98 232 Q78.2 224.8 59.9 218.1"/>
  <path class="vein" d="M92.2 229.9 Q88.2 230.6 84.1 231.6"/>
  <path class="vein" d="M92.2 229.9 Q89.6 226.8 87.1 223.4"/>
  <path class="vein" d="M63.3 219.4 Q59.6 219 56.7 217"/>
  <path class="vein" d="M63.3 219.4 Q60.3 217.3 56.7 217"/>
  <path d="M98 232 L94.7 230.5 L90.8 229 L88.5 227.3 L84.5 225.9 L83.2 223.4 L79.8 221.4 L79.3 218.2 L76.7 215.6 L76.5 212.1 L74.7 208.9 L74.3 205.6 L73.1 202.3 L76.1 204.1 L79.3 205 L82.2 207.4 L85.6 208.1 L87.7 211.2 L90.7 212.2 L92.1 215.9 L94.3 217.6 L95.1 221.8 L96.4 224.4 L97.1 228.5 L98 232 Z"/>
  <path class="vein" d="M98 232 Q86.1 217.8 75.1 204.7"/>
  <path class="vein" d="M94.5 227.8 Q91 226.8 87.2 225.9"/>
  <path class="vein" d="M94.5 227.8 Q94.1 224.2 93.9 220.3"/>
  <path class="vein" d="M77.1 207.1 Q74.4 205.3 73.1 202.3"/>
  <path class="vein" d="M77.1 207.1 Q75.8 204.1 73.1 202.3"/>
  <path d="M98 232 L96 229.5 L93.4 226.8 L92.3 224.5 L89.7 221.7 L89.9 219.3 L88 216.4 L89.2 213.7 L88.3 210.7 L90 207.9 L90.1 204.7 L91.5 202 L92.2 199.1 L93.8 201.6 L96.1 203.6 L97.3 206.7 L99.8 208.6 L100 211.8 L102.1 213.9 L101.3 217.3 L102.3 219.5 L100.8 223 L100.6 225.5 L99.1 229 L98 232 Z"/>
  <path class="vein" d="M98 232 Q95.2 216.2 92.6 201.6"/>
  <path class="vein" d="M97.2 227.4 Q94.8 225.1 92 222.9"/>
  <path class="vein" d="M97.2 227.4 Q98.7 224.4 100.5 221.4"/>
  <path class="vein" d="M93.1 204.3 Q91.7 201.9 92.2 199.1"/>
  <path class="vein" d="M93.1 204.3 Q93.6 201.5 92.2 199.1"/>
  <path d="M100 196 L99.1 193.4 L97.8 190.4 L97.6 188.2 L96.3 185.2 L97.2 183.3 L96.5 180.4 L98.2 178.6 L98.5 175.8 L100.6 174.1 L101.7 171.5 L103.6 169.8 L105 167.6 L105.6 170.1 L106.8 172.4 L106.9 175.2 L108.3 177.6 L107.6 180.2 L108.6 182.5 L107 185 L107.2 187.1 L104.9 189.5 L104 191.5 L101.7 193.9 L100 196 Z"/>
  <path class="vein" d="M100 196 Q102.4 182.3 104.6 169.8"/>
  <path class="vein" d="M100.7 192 Q99.4 189.4 97.8 186.8"/>
  <path class="vein" d="M100.7 192 Q102.8 190 105.2 188.1"/>
  <path class="vein" d="M104.2 172.1 Q103.8 169.7 105 167.6"/>
  <path class="vein" d="M104.2 172.1 Q105.4 170 105 167.6"/>
  <path d="M100 196 L100.8 193 L101.4 189.4 L102.5 187.2 L103.2 183.6 L105.1 182.1 L106.3 178.9 L108.9 178 L110.7 175.4 L113.7 174.7 L116.2 172.7 L118.9 171.9 L121.5 170.4 L120.5 173.2 L120.2 176 L118.6 178.9 L118.4 181.8 L116.2 184.1 L115.7 186.9 L112.8 188.5 L111.7 190.7 L108.2 192 L106.3 193.4 L102.8 194.7 L100 196 Z"/>
  <path class="vein" d="M100 196 Q110.3 183.7 119.8 172.4"/>
  <path class="vein" d="M103 192.4 Q103.4 189.3 103.6 185.9"/>
  <path class="vein" d="M103 192.4 Q106 191.5 109.3 190.7"/>
  <path class="vein" d="M118.1 174.5 Q119.2 171.9 121.5 170.4"/>
  <path class="vein" d="M118.1 174.5 Q120.4 173 121.5 170.4"/>
  <path d="M100 196 L102.5 193.7 L105.3 190.7 L107.7 189.3 L110.4 186.3 L113.2 185.9 L116.2 183.5 L119.2 183.9 L122.5 182.5 L125.7 183.2 L129.3 182.6 L132.4 183.1 L135.7 183 L133.1 185 L131.1 187.5 L127.9 189.3 L126 191.9 L122.5 192.9 L120.4 195.1 L116.6 195.3 L114.2 196.7 L110.2 196.2 L107.5 196.6 L103.4 196.2 L100 196 Z"/>
  <path class="vein" d="M100 196 Q117.1 189.8 132.9 184"/>
  <path class="vein" d="M105 194.2 Q107.3 191.5 109.4 188.6"/>
  <path class="vein" d="M105 194.2 Q108.4 194.8 112 195.6"/>
  <path class="vein" d="M130 185.1 Q132.6 183.3 135.7 183"/>
  <path class="vein" d="M130 185.1 Q133.1 184.8 135.7 183"/>
  <path d="M100 196 L103 195.2 L106.4 193.9 L108.9 193.8 L112.3 192.6 L114.6 193.5 L117.9 192.9 L120 194.7 L123.2 195 L125.3 197.2 L128.3 198.3 L130.4 200.3 L132.9 201.8 L130 202.3 L127.4 203.5 L124.1 203.5 L121.5 204.9 L118.4 204.1 L115.8 205.1 L112.9 203.3 L110.4 203.4 L107.6 201.1 L105.3 200.1 L102.5 197.8 L100 196 Z"/>
  <path class="vein" d="M100 196 Q115.8 198.8 130.4 201.4"/>
  <path class="vein" d="M104.6 196.8 Q107.5 195.6 110.5 194.1"/>
  <path class="vein" d="M104.6 196.8 Q106.9 199 109.2 201.4"/>
  <path class="vein" d="M127.7 200.9 Q130.4 200.5 132.9 201.8"/>
  <path class="vein" d="M127.7 200.9 Q130.2 202.1 132.9 201.8"/>
  <path d="M100 196 L102.7 196.5 L106 196.9 L107.9 197.8 L111.2 198.2 L112.4 199.9 L115.3 200.8 L116 203.2 L118.2 204.8 L118.7 207.5 L120.4 209.7 L120.9 212.2 L122.1 214.6 L119.6 213.8 L117 213.7 L114.5 212.4 L111.8 212.4 L109.8 210.5 L107.4 210.2 L106 207.6 L104.1 206.6 L103.1 203.5 L101.9 201.7 L101 198.6 L100 196 Z"/>
  <path class="vein" d="M100 196 Q110.6 204.9 120.4 213.1"/>
  <path class="vein" d="M103.1 198.6 Q106 198.8 109 198.7"/>
  <path class="vein" d="M103.1 198.6 Q103.8 201.4 104.2 204.4"/>
  <path class="vein" d="M118.6 211.6 Q120.9 212.5 122.1 214.6"/>
  <path class="vein" d="M118.6 211.6 Q119.8 213.7 122.1 214.6"/>
</svg>
```

### 들메 오동나무 야외 압착기 분해도(상품)
<!-- 들메 오동나무 야외 압착기 분해도 viewBox="0 0 300 220" -->
```html
<svg class="flora" viewBox="0 0 300 220" aria-hidden="true">
  <path d="M30 30 l200 0 l30 -18 l-200 0 z"/>
  <path class="vein" d="M55.0 30 l30 -18"/>
  <path class="vein" d="M80.0 30 l30 -18"/>
  <path class="vein" d="M105.0 30 l30 -18"/>
  <path class="vein" d="M130.0 30 l30 -18"/>
  <path class="vein" d="M155.0 30 l30 -18"/>
  <path class="vein" d="M180.0 30 l30 -18"/>
  <path class="vein" d="M205.0 30 l30 -18"/>
  <path class="dim" d="M40 70 l200 0 l30 -18"/>
  <path class="dim" d="M34 92 l200 0 l28 -16 l-200 0 z"/>
  <path class="dim" d="M34 110 l200 0 l28 -16 l-200 0 z"/>
  <path class="dim" d="M34 128 l200 0 l28 -16 l-200 0 z"/>
  <path d="M30 168 l200 0 l30 -18 l-200 0 z"/>
  <path class="vein" d="M55.0 168 l30 -18"/>
  <path class="vein" d="M80.0 168 l30 -18"/>
  <path class="vein" d="M105.0 168 l30 -18"/>
  <path class="vein" d="M130.0 168 l30 -18"/>
  <path class="vein" d="M155.0 168 l30 -18"/>
  <path class="vein" d="M180.0 168 l30 -18"/>
  <path class="vein" d="M205.0 168 l30 -18"/>
  <path d="M70 20 l0 170"/><path d="M200 20 l0 170"/>
  <path d="M60 20 l20 0"/><path d="M190 20 l20 0"/>
</svg>
```


### 32px 썸네일 (목록·커맨드·칸반 보조) — `viewBox="0 0 32 32"`, `--sw` 1.25 그대로
`kumgang`
```html
<svg class="flora" viewBox="0 0 32 32" aria-hidden="true">
  <path d="M16 3 C15 10 17 18 16 30"/>
  <path class="petal" d="M16 6 q-6 1 -7 9 l2 -1 l1 2 l2 -1 l2 1 q1 -7 0 -10z"/>
  <path class="petal" d="M16 11 q6 1 7 8 l-2 -1 l-1 2 l-2 -1 l-2 1 q-1 -6 0 -9z"/>
  <path d="M16 24 q-6 -2 -9 1 q4 3 9 -1z"/>
  <path d="M16 22 q6 -3 9 0 q-4 3 -9 0z"/>
</svg>
```

`dongja`
```html
<svg class="flora" viewBox="0 0 32 32" aria-hidden="true">
  <path d="M16 30 L16 16"/>
  <path class="petal petal--red" d="M16 12 l0 -8"/>
  <path class="petal petal--red" d="M16 12 l7.6 -2.5"/>
  <path class="petal petal--red" d="M16 12 l4.7 6.5"/>
  <path class="petal petal--red" d="M16 12 l-4.7 6.5"/>
  <path class="petal petal--red" d="M16 12 l-7.6 -2.5"/>
  <circle cx="16" cy="12" r="7.5" class="petal petal--red"/>
  <circle cx="16" cy="12" r="1.6"/>
</svg>
```

`tugu`
```html
<svg class="flora" viewBox="0 0 32 32" aria-hidden="true">
  <path d="M15 30 C15 22 17 14 16 4"/>
  <path class="petal" d="M16 8 c-1 -3 2 -5 5 -4 c2 1 2 4 0 6 c-2 1 -4 0 -5 -2z"/>
  <path class="petal" d="M15 16 c1 -3 -2 -5 -5 -4 c-2 1 -2 4 0 6 c2 1 4 0 5 -2z"/>
  <path d="M15 24 l-6 -3 M15 24 l6 -3 M15 24 l0 -5"/>
</svg>
```

`mulbong`
```html
<svg class="flora" viewBox="0 0 32 32" aria-hidden="true">
  <path d="M8 4 Q10 14 8 30"/>
  <path d="M9 10 q6 -3 10 0"/>
  <path class="petal petal--red" d="M19 10 c5 -1 8 4 6 9 c-2 4 -7 3 -8 -1 c-1 -3 0 -6 2 -8z"/>
  <path d="M20 19 q-2 5 2 7"/>
</svg>
```

`eolleji`
```html
<svg class="flora" viewBox="0 0 32 32" aria-hidden="true">
  <path d="M15 30 C15 22 17 14 18 8"/>
  <path class="petal" d="M18 8 q-6 4 -10 -2 q5 0 10 2z"/>
  <path class="petal" d="M18 8 q6 4 9 -2 q-5 0 -9 2z"/>
  <path class="petal" d="M18 8 q-1 6 -5 6"/>
  <path d="M15 30 q-8 -6 -9 -14"/>
  <path d="M15 30 q8 -6 9 -14"/>
</svg>
```

`aengcho`
```html
<svg class="flora" viewBox="0 0 32 32" aria-hidden="true">
  <path d="M16 30 L16 14"/>
  <path d="M16 14 L9 9 M16 14 L16 7 M16 14 L23 9"/>
  <circle class="petal petal--red" cx="9" cy="8" r="3.4"/>
  <circle class="petal petal--red" cx="16" cy="5.5" r="3.4"/>
  <circle class="petal petal--red" cx="23" cy="8" r="3.4"/>
  <path d="M16 30 q-8 -1 -10 -6 q6 -1 10 6z"/>
</svg>
```

`ijil`
```html
<svg class="flora" viewBox="0 0 32 32" aria-hidden="true">
  <path d="M16 30 L16 18"/>
  <ellipse class="petal" cx="16" cy="6" rx="3.6" ry="3.6"/>
  <ellipse class="petal" cx="20.8" cy="9.5" rx="3.6" ry="3.6"/>
  <ellipse class="petal" cx="18.9" cy="15" rx="3.6" ry="3.6"/>
  <ellipse class="petal" cx="13.1" cy="15" rx="3.6" ry="3.6"/>
  <ellipse class="petal" cx="11.2" cy="9.5" rx="3.6" ry="3.6"/>
  <circle cx="16" cy="11" r="1.4"/>
  <path d="M16 24 l-7 -2 M16 24 l7 -2"/>
</svg>
```

`deulme`
```html
<svg class="flora" viewBox="0 0 32 32" aria-hidden="true">
  <path d="M6 28 C12 22 18 14 26 5"/>
  <path d="M11 23 q-1 -6 -6 -7 q1 5 6 7z"/>
  <path d="M11 23 q6 1 7 6 q-5 -1 -7 -6z"/>
  <path d="M17 16 q-1 -6 -6 -7 q1 5 6 7z"/>
  <path d="M17 16 q6 1 7 6 q-5 -1 -7 -6z"/>
  <path d="M26 5 q-5 0 -6 4 q5 1 6 -4z"/>
</svg>
```

`danggwi`
```html
<svg class="flora" viewBox="0 0 32 32" aria-hidden="true">
  <path d="M16 30 L16 14"/>
  <path d="M16 14 L6.6 10.9"/>
  <path d="M16 14 L10.3 6.6"/>
  <path d="M16 14 L16 5"/>
  <path d="M16 14 L21.7 6.6"/>
  <path d="M16 14 L25.4 10.9"/>
  <circle class="petal" cx="6.6" cy="10.9" r="2.2"/>
  <circle class="petal" cx="10.3" cy="6.6" r="2.2"/>
  <circle class="petal" cx="16" cy="5" r="2.2"/>
  <circle class="petal" cx="21.7" cy="6.6" r="2.2"/>
  <circle class="petal" cx="25.4" cy="10.9" r="2.2"/>
</svg>
```

`noru`
```html
<svg class="flora" viewBox="0 0 32 32" aria-hidden="true">
  <path d="M16 30 L16 4"/>
  <path class="petal petal--red" d="M16 6.0 l-2.0 2 M16 6.0 l2.0 2"/>
  <path class="petal petal--red" d="M16 9.4 l-2.9 2 M16 9.4 l2.9 2"/>
  <path class="petal petal--red" d="M16 12.8 l-3.8 2 M16 12.8 l3.8 2"/>
  <path class="petal petal--red" d="M16 16.2 l-4.7 2 M16 16.2 l4.7 2"/>
  <path class="petal petal--red" d="M16 19.6 l-5.6 2 M16 19.6 l5.6 2"/>
  <path class="petal petal--red" d="M16 23.0 l-6.5 2 M16 23.0 l6.5 2"/>
</svg>
```

`sanoi`
```html
<svg class="flora" viewBox="0 0 32 32" aria-hidden="true">
  <path d="M14 30 C14 20 16 12 18 6"/>
  <path class="petal petal--red" d="M18 6 q5 2 6 10 q-1 3 -3 1 q-2 -6 -3 -11z"/>
  <path class="petal petal--red" d="M15 14 q-5 2 -6 9 q1 3 3 1 q1 -6 3 -10z"/>
</svg>
```

`modemi`
```html
<svg class="flora" viewBox="0 0 32 32" aria-hidden="true">
  <path d="M16 30 L16 16"/>
  <path class="petal" d="M16 11 q-2 -4 0 -8 q2 2 -0 8z"/>
  <path class="petal" d="M16 11 q1.8 -1.2 7.6 -2.5 q0.1 0.6 -7.6 2.5z"/>
  <path class="petal" d="M16 11 q0.4 3.2 4.7 6.5 q0.8 -1.6 -4.7 -6.5z"/>
  <path class="petal" d="M16 11 q-4.4 3.2 -4.7 6.5 q3.2 -1.6 4.7 -6.5z"/>
  <path class="petal" d="M16 11 q-5.8 -1.2 -7.6 -2.5 q3.9 0.6 7.6 2.5z"/>
  <circle cx="16" cy="11" r="1.6"/>
</svg>
```

