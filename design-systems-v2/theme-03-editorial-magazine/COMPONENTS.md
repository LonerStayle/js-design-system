# COMPONENTS — 월간 「행간」 v2 마크업 계약

index.html · pages/*.html을 맡은 에이전트는 **이 문서만 보고** 마크업한다. 왜 그런 모양인지는 `DIRECTION.md`에 있다.
클래스는 BEM(`블록__요소--변형`). 상태는 되도록 ARIA 속성(`aria-current` `aria-selected` `aria-expanded` `aria-pressed` `aria-busy` `aria-invalid` `disabled` `hidden`)으로 표시한다. CSS가 이 속성을 읽는다.

- 세계관 값(날짜·인물·지면·가격·수치)은 **DIRECTION.md 2절 팩트 시트만** 쓴다. 오늘 = 2026년 10월 10일(토).
- 장면 CSS(`index.css`, `pages/<name>.css`)도 **3절 semantic 토큰만**. raw hex 금지, 인라인 `grid-template-columns` 금지(→ 2절 스팬 클래스). `style="--val:62%"`처럼 커스텀 속성을 넣는 것은 허용.
- 아이콘은 인라인 SVG `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">…</svg>`. 선 색은 CSS가 `currentColor`로 준다. **presentation attribute에 `var()` 금지.**
- 한글이 섞인 라벨에 모노 폰트·넓은 자간 금지. `.folio` `.t-mono` `.badge--code`는 라틴·숫자 전용.
- 이미지 파일 금지 → 사진 자리는 2-6절 **조판 도판**(`.plate`)으로.

---

## 0. 페이지 뼈대

```html
<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>행간 2026.11 — 마감 보드</title>
<script>(function(){try{var d=document.documentElement,q=new URLSearchParams(location.search).get('theme'),s=null,m=null;try{s=localStorage.getItem('haenggan-theme');m=localStorage.getItem('haenggan-motion')}catch(e){}var t=(q==='dark'||q==='light')?q:(s==='dark'||s==='light')?s:(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');d.setAttribute('data-theme',t);if(m==='reduce')d.setAttribute('data-motion','reduce');}catch(e){}})();</script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400..900;1,6..96,400..900&family=Source+Serif+4:ital,opsz,wght@0,8..60,300..700;1,8..60,300..700&family=Hahmlet:wght@300..900&family=Noto+Serif+KR:wght@400;600&family=IBM+Plex+Sans+KR:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;600;700&amp;text=%E3%80%8C%E3%80%8D%E3%80%8E%E3%80%8F&amp;display=swap">   <!-- 낫표 「」『』 네 글자만(halt 반각용). 빼면 UI 글자의 낫표가 전각으로 벌어진다 -->
<link rel="stylesheet" href="styles.css">     <!-- pages: ../styles.css -->
<link rel="stylesheet" href="index.css">      <!-- pages: kanban.css 처럼 장면 전용 1개 -->
</head>
<body>
  (1-1 또는 1-2 마스트헤드)
  <main id="main"> … 지면들 … </main>          <!-- 편집국 4쪽은 1-5의 .desk 안에 main -->
  (pages는 1-4 바닥글 · index는 바닥글 없이 뒤표지로 끝난다 — 1-3)
  (1-6 ⌘K 색인 + 토스트 영역 — body 끝, 페이지마다 1벌)
  (그 페이지의 모달·서랍 — body 끝)
<script src="app.js"></script>                 <!-- pages: ../app.js -->
</body>
</html>
```

- 테마 결정 순서: **URL `?theme=dark|light` → localStorage `haenggan-theme` → 시스템**. 움직임 줄이기는 localStorage `haenggan-motion=reduce`.
- `<title>`은 `행간 2026.11 — <지면 이름>` 형식. index는 `행간 2026년 11월호 — 활판의 마지막 가을`.
- 페이지 폴리오(쪽번호)는 고정이다. 목차·사이드바·색인·바닥글이 모두 이 번호를 쓴다.

| 파일 | 지면 이름 | 쪽 | 마스트헤드 `aria-current` | 사이드바 |
|---|---|---|---|---|
| index.html | 행간 2026년 11월호 | p.001–112 · 표1–표4 | (없음 — 스크롤 위치로 바뀌지 않음) | 없음 |
| pages/onboarding.html | 광고 — 정기구독 안내면 「처음 펼치는 분께」 | p.002–003 | 없음 | 없음 |
| pages/dashboard.html | 편집국 탐방 | p.096 | 편집국 | `편집국 탐방` |
| pages/kanban.html | 마감 보드 | p.098 | 편집국 | `마감 보드` |
| pages/inbox.html | 독자 편지 | p.104 | 편집국 | `독자 편지` |
| pages/profile.html | 필진 — 한예린 | p.007 | 없음 | 없음 |
| pages/settings.html | 구독 계정 | p.108 | 없음 | `구독 계정` |
| pages/pricing.html | 정기구독 안내 | p.110 | 없음 (`정기구독` 단추가 현재 위치) | 없음 |
| pages/product.html | 다음 호 예고 · 단권 주문 | p.112 | 없음 | 없음 |
| pages/404.html | 낙장(落張) | p.— (쪽번호 없음 · ⌘K 색인으로만 접근) | 없음 | 없음 |

- 마스트헤드 현재 표시: 해당 `<a class="masthead__link">`에 `aria-current="true"`. 사이드바 현재 표시: 해당 `<a class="sidebar__link">`에 `aria-current="page"`. **그 외 셸 마크업은 한 글자도 바꾸지 않는다.**
- 마스트헤드 `지면 안내` 메뉴(`.masthead__menu`, `#menu-pages`)는 pages 9쪽으로 바로 가는 목록이다. 각 page에서는 **자기 쪽의 `.menu__item`에 `aria-current="page"`**를 단다(위 스니펫은 aria-current를 뺀 상태).
- 현재 쪽번호: index의 `.folio-now`(오른쪽 아래 상자)는 바깥 여백이 상자보다 넓은 ≥1400에서만, 그 여백 안에만 앉는다(본문 칼럼을 가리지 않게). 표지(표1)·뒤표지(표4)가 보이는 동안은 지면 자체 폴리오와 겹치므로 `.is-off`로 끈다. 값이 `표N`이면 `.is-ko`(고딕·자간 0). ≤1399에서는 app.js가 `.masthead__issue` 안에 `<span class="masthead__now" data-current-folio>`를 덧붙여 「제87호」 옆 글자로 찍는다(셸 마크업은 그대로). 고르는 규칙은 스크롤마다 "top이 뷰포트 50%보다 위인 마지막 `[data-folio]`"(폼의 `data-folio`는 제외). 한 지면 안에서 쪽이 바뀌는 모듈(p.078·p.080·p.087·p.103)에도 `data-folio`를 단다.
- 낫표 조판: 모든 글자는 `font-feature-settings`에 `"halt" 1`을 넣는다. `font:` 단축 속성은 font-feature-settings를 초기화하므로, `font:`를 쓰는 규칙에는 `font-feature-settings: "halt" 1`(필요하면 `"lnum" 1, "tnum" 1`과 함께)을 바로 뒤에 둔다. 낫표 앞뒤 공백은 한 칸.
- index의 지면 `id`는 `p-001`(표지) `p-004`(차례) `p-006`(편집장의 글) `p-024`(피처 도입) `p-026` `p-028` `p-054`(인터뷰) `p-078`(단신·동네·식탁, 4단 모듈) `p-088`(오버레이 견본) `p-100`(지난 호) `p-102`(편집국에서, 3단 칼럼) `p-back`(뒤표지 · 표4). 각 지면 루트에 `data-folio="p.024"`도 붙인다(현재 쪽 표시·쪽 이동이 읽는다).

---

## 1. 공통 셸 스니펫 — 복사해서 그대로 쓴다

### 1-1. 마스트헤드 · index.html 경로

```html
<a class="skip" href="#main">본문으로 건너뛰기</a>
<div class="read-rule" aria-hidden="true"></div>
<header class="masthead">
  <div class="masthead__bar">
    <a class="masthead__brand" href="index.html" aria-label="행간 2026년 11월호 첫 지면">
      <span class="masthead__mark">행간</span>
      <span class="masthead__issue"><b>2026.11</b> · 제87호</span>
    </a>
    <nav class="masthead__nav" id="site-nav" aria-label="섹션">
      <ul class="masthead__links" role="list">
        <li><a class="masthead__link" href="index.html#p-004">차례<span class="masthead__link-folio">p.004</span></a></li>
        <li><a class="masthead__link" href="index.html#p-024">특집<span class="masthead__link-folio">p.024</span></a></li>
        <li><a class="masthead__link" href="index.html#p-054">인터뷰<span class="masthead__link-folio">p.054</span></a></li>
        <li><a class="masthead__link" href="pages/dashboard.html">편집국<span class="masthead__link-folio">p.096</span></a></li>
        <li><a class="masthead__link" href="index.html#p-100">지난 호<span class="masthead__link-folio">p.100</span></a></li>
        <li class="menu masthead__menu"><button class="masthead__link masthead__more" type="button" data-menu aria-haspopup="menu" aria-controls="menu-pages">지면 안내<span class="masthead__link-folio">9쪽</span><svg class="icon icon--sm" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg></button>
          <div class="menu__list masthead__pages" id="menu-pages" role="menu" aria-label="편집국 · 독자 · 구독 지면" hidden>
          <p class="menu__label">편집국 · 독자 · 구독 지면</p>
          <a class="menu__item" role="menuitem" href="pages/onboarding.html">처음 펼치는 분께<span class="menu__kbd">p.002</span></a>
          <a class="menu__item" role="menuitem" href="pages/profile.html">필진 — 한예린<span class="menu__kbd">p.007</span></a>
          <a class="menu__item" role="menuitem" href="pages/dashboard.html">편집국 탐방<span class="menu__kbd">p.096</span></a>
          <a class="menu__item" role="menuitem" href="pages/kanban.html">마감 보드<span class="menu__kbd">p.098</span></a>
          <a class="menu__item" role="menuitem" href="pages/inbox.html">독자 편지<span class="menu__kbd">p.104</span></a>
          <a class="menu__item" role="menuitem" href="pages/settings.html">구독 계정<span class="menu__kbd">p.108</span></a>
          <a class="menu__item" role="menuitem" href="pages/pricing.html">정기구독 안내<span class="menu__kbd">p.110</span></a>
          <a class="menu__item" role="menuitem" href="pages/product.html">다음 호 예고 · 단권<span class="menu__kbd">p.112</span></a>
          <a class="menu__item" role="menuitem" href="pages/404.html">낙장 — 빠진 쪽<span class="menu__kbd">p.—</span></a>
          </div></li>
      </ul>
    </nav>
    <div class="masthead__tools">
      <button class="masthead__search" type="button" data-command-open aria-label="찾아보기 (⌘K)">
        <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6"/><path d="M15 15l5 5"/></svg>
        <span>찾아보기</span><span class="kbd">⌘K</span>
      </button>
      <button class="masthead__tool" type="button" data-theme-toggle aria-label="흑지(어두운 화면)로 바꾸기">
        <svg class="icon theme-icon__night" viewBox="0 0 24 24" aria-hidden="true"><path d="M19 14.5A7.5 7.5 0 0 1 9.5 5a7.5 7.5 0 1 0 9.5 9.5z"/></svg>
        <svg class="icon theme-icon__day" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4.5"/><path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M5.3 18.7l1.8-1.8M16.9 7.1l1.8-1.8"/></svg>
      </button>
      <a class="btn btn--primary btn--sm masthead__sub" href="pages/pricing.html">정기구독</a>
      <button class="masthead__tool masthead__burger" type="button" data-nav-toggle aria-controls="site-nav" aria-expanded="false" aria-label="섹션 메뉴 열기">
        <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h10"/></svg>
      </button>
    </div>
  </div>
</header>
```

### 1-2. 마스트헤드 · pages/*.html 경로

```html
<a class="skip" href="#main">본문으로 건너뛰기</a>
<div class="read-rule" aria-hidden="true"></div>
<header class="masthead">
  <div class="masthead__bar">
    <a class="masthead__brand" href="../index.html" aria-label="행간 2026년 11월호 첫 지면">
      <span class="masthead__mark">행간</span>
      <span class="masthead__issue"><b>2026.11</b> · 제87호</span>
    </a>
    <nav class="masthead__nav" id="site-nav" aria-label="섹션">
      <ul class="masthead__links" role="list">
        <li><a class="masthead__link" href="../index.html#p-004">차례<span class="masthead__link-folio">p.004</span></a></li>
        <li><a class="masthead__link" href="../index.html#p-024">특집<span class="masthead__link-folio">p.024</span></a></li>
        <li><a class="masthead__link" href="../index.html#p-054">인터뷰<span class="masthead__link-folio">p.054</span></a></li>
        <li><a class="masthead__link" href="dashboard.html">편집국<span class="masthead__link-folio">p.096</span></a></li>
        <li><a class="masthead__link" href="../index.html#p-100">지난 호<span class="masthead__link-folio">p.100</span></a></li>
        <li class="menu masthead__menu"><button class="masthead__link masthead__more" type="button" data-menu aria-haspopup="menu" aria-controls="menu-pages">지면 안내<span class="masthead__link-folio">9쪽</span><svg class="icon icon--sm" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg></button>
          <div class="menu__list masthead__pages" id="menu-pages" role="menu" aria-label="편집국 · 독자 · 구독 지면" hidden>
          <p class="menu__label">편집국 · 독자 · 구독 지면</p>
          <a class="menu__item" role="menuitem" href="onboarding.html">처음 펼치는 분께<span class="menu__kbd">p.002</span></a>
          <a class="menu__item" role="menuitem" href="profile.html">필진 — 한예린<span class="menu__kbd">p.007</span></a>
          <a class="menu__item" role="menuitem" href="dashboard.html">편집국 탐방<span class="menu__kbd">p.096</span></a>
          <a class="menu__item" role="menuitem" href="kanban.html">마감 보드<span class="menu__kbd">p.098</span></a>
          <a class="menu__item" role="menuitem" href="inbox.html">독자 편지<span class="menu__kbd">p.104</span></a>
          <a class="menu__item" role="menuitem" href="settings.html">구독 계정<span class="menu__kbd">p.108</span></a>
          <a class="menu__item" role="menuitem" href="pricing.html">정기구독 안내<span class="menu__kbd">p.110</span></a>
          <a class="menu__item" role="menuitem" href="product.html">다음 호 예고 · 단권<span class="menu__kbd">p.112</span></a>
          <a class="menu__item" role="menuitem" href="404.html">낙장 — 빠진 쪽<span class="menu__kbd">p.—</span></a>
          </div></li>
      </ul>
    </nav>
    <div class="masthead__tools">
      <button class="masthead__search" type="button" data-command-open aria-label="찾아보기 (⌘K)">
        <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6"/><path d="M15 15l5 5"/></svg>
        <span>찾아보기</span><span class="kbd">⌘K</span>
      </button>
      <button class="masthead__tool" type="button" data-theme-toggle aria-label="흑지(어두운 화면)로 바꾸기">
        <svg class="icon theme-icon__night" viewBox="0 0 24 24" aria-hidden="true"><path d="M19 14.5A7.5 7.5 0 0 1 9.5 5a7.5 7.5 0 1 0 9.5 9.5z"/></svg>
        <svg class="icon theme-icon__day" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4.5"/><path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M5.3 18.7l1.8-1.8M16.9 7.1l1.8-1.8"/></svg>
      </button>
      <a class="btn btn--primary btn--sm masthead__sub" href="pricing.html">정기구독</a>
      <button class="masthead__tool masthead__burger" type="button" data-nav-toggle aria-controls="site-nav" aria-expanded="false" aria-label="섹션 메뉴 열기">
        <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h10"/></svg>
      </button>
    </div>
  </div>
</header>
```

- index 첫 지면(표지)에는 `data-cover`를 붙인다: `<section class="cover scope-cover" id="p-001" data-folio="표1" data-cover>` (표지 쪽 표기는 `표1` — p.001은 속표지. `id="p-001"`은 링크 앵커로만 남긴다). app.js가 표지가 보이는 동안 마스트헤드를 투명(`.is-over` + `.scope-cover`)으로 바꾼다. pages에는 `data-cover`가 없다.
- `.read-rule`(상단 2px 주홍 읽기 진행 룰)은 모든 페이지에 둔다.

### 1-3. index에는 바닥글이 없다 — 뒤표지(표4)가 마지막 장

index의 마지막 장은 뒤표지다. 같은 먹색 사이트 푸터를 그 아래 또 붙이지 않는다(잡지의 물리 — 마지막 장 = 뒤표지). 판권 한 줄과 얇은 바로 가기 줄을 뒤표지 바닥(`.backcover__base`)에 흡수한다. `낙장(404)`은 여기에도 차례에도 싣지 않고 ⌘K 색인에서만 찾는다.

```html
<div class="backcover__base">
  <div class="backcover__imprint">
    <p class="backcover__colophon">발행처 행간사 · 서울 종로구 자하문로7길 23, 3층 · 독자센터 <span class="nowrap">02-735-0487</span>(평일 10:00–17:00) · 등록번호 종로 라00187 · 인쇄 을지인쇄</p>
    <nav class="backcover__links" aria-label="이번 호 바로 가기">
      <ul role="list">
        <li><a href="#p-004"><span class="pen">차례</span><span class="folio">p.004</span></a></li>
        <!-- 처음 펼치는 분께 p.002 · 필진 p.007 · 편집국 탐방 p.096 · 마감 보드 p.098 · 독자 편지 p.104 · 구독 계정 p.108 · 정기구독 안내 p.110 · 11월호 단권 p.112 -->
      </ul>
    </nav>
  </div>
  <div class="backcover__code">
    <div class="barcode"><span class="barcode__bars"></span><span class="barcode__num">9 772671 048006 11</span></div>
    <p class="backcover__issn">2026년 11월호 · 통권 제87호<br><span class="folio">ISSN 2671-0487</span> · ₩16,000</p>
    <span class="folio folio--ko backcover__folio">표4</span>
  </div>
</div>
```
- 뒤표지 격자는 `align-items: end` — 광고 카피·가격과 FAQ가 같은 아래 기준선에 서고, 오른쪽 위는 의도된 여백. 바코드·ISSN은 오른쪽 아래 모서리.

### 1-4. 바닥글(뒤표지 띠) · pages/*.html 경로

```html
<footer class="site-foot">
  <div class="site-foot__grid">
    <div class="site-foot__brand">
      <p class="site-foot__mark" aria-label="행간">행간<span>.</span></p>
      <p class="site-foot__issue"><b>2026년 11월호 · 통권 제87호</b><br>특집 「활판의 마지막 가을 — 서촌 인쇄 골목 24시」 · <span class="site-foot__date">10월 25일(일) 발행</span></p>
    </div>
    <nav aria-labelledby="foot-issue">
      <p class="site-foot__head" id="foot-issue">이번 호</p>
      <ul class="site-foot__links" role="list">
        <li><a href="../index.html#p-004"><span class="pen">차례</span><span class="folio">p.004</span></a></li>
        <li><a href="../index.html#p-024"><span class="pen">특집 1부</span><span class="folio">p.024</span></a></li>
        <li><a href="product.html"><span class="pen">11월호 단권</span><span class="folio">p.112</span></a></li>
        <li><a href="../index.html#p-100"><span class="pen">지난 호</span><span class="folio">p.100</span></a></li>
      </ul>
    </nav>
    <nav aria-labelledby="foot-sub">
      <p class="site-foot__head" id="foot-sub">구독</p>
      <ul class="site-foot__links" role="list">
        <li><a href="pricing.html"><span class="pen">정기구독 안내</span><span class="folio">p.110</span></a></li>
        <li><a href="onboarding.html"><span class="pen">처음 펼치는 분께</span><span class="folio">p.002</span></a></li>
        <li><a href="settings.html"><span class="pen">구독 계정</span><span class="folio">p.108</span></a></li>
      </ul>
    </nav>
    <nav aria-labelledby="foot-desk">
      <p class="site-foot__head" id="foot-desk">편집국</p>
      <ul class="site-foot__links" role="list">
        <li><a href="dashboard.html"><span class="pen">편집국 탐방</span><span class="folio">p.096</span></a></li>
        <li><a href="kanban.html"><span class="pen">마감 보드</span><span class="folio">p.098</span></a></li>
        <li><a href="inbox.html"><span class="pen">독자 편지</span><span class="folio">p.104</span></a></li>
        <li><a href="profile.html"><span class="pen">필진 — 한예린</span><span class="folio">p.007</span></a></li>
      </ul>
    </nav>
  </div>
  <div class="site-foot__base">
    <p>발행처 행간사 · 서울 종로구 자하문로7길 23, 3층 · 독자센터 02-735-0487(평일 10:00–17:00) · reader@haenggan.kr</p>
    <p><span class="folio">ISSN 2671-0487</span> · 등록번호 종로 라00187 · 인쇄 을지인쇄</p>
  </div>
</footer>
```

- 바닥글은 **pages 9쪽 모두 한 벌**이다(편집국 4쪽은 `.desk` 다음, body 직속). index에는 붙이지 않는다 — 1-3 뒤표지가 마지막 장. 낮 = 먹 면 / 밤 = 먹지 한 단계 + 주홍 윗선(흰 띠로 뒤집히지 않는다).

### 1-5. 편집국 사이드바 + `.desk` 셸 · pages/*.html (dashboard · kanban · inbox · settings)

- **판면 여백 고정**: `.desk__main` 안의 지면 래퍼(`.sheet`, `.kb`, `.mail` 등)는 공통 토큰 `--m-outer`(`clamp(20px, 5vw, 72px)`, 1440폭 72px)를 그대로 쓴다. 페이지 CSS에서 `--m-outer`를 다시 정의하지 않는다 — 네 페이지 모두 오른끝이 x=1368에서 마스트헤드·바닥글과 맞는다. 보드가 넓으면 칼럼 폭을 줄인다.

```html
<div class="desk">
  <aside class="sidebar" aria-label="편집국">
    <div class="sidebar__head">
      <span class="avatar avatar--ink" aria-hidden="true">윤</span>
      <span class="sidebar__who"><span class="sidebar__name">윤서경</span><span class="sidebar__role">발행인 겸 편집장</span></span>
    </div>
    <nav class="sidebar__nav" aria-label="편집국 메뉴">
      <div>
        <p class="sidebar__group">편집</p>
        <ul class="sidebar__list" role="list">
          <li><a class="sidebar__link" href="dashboard.html"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h7v7H4zM13 4h7v4h-7zM13 10h7v10h-7zM4 13h7v7H4z"/></svg><span class="sidebar__label">편집국 탐방</span><span class="sidebar__folio">p.096</span></a></li>
          <li><a class="sidebar__link" href="kanban.html"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h4v16H4zM10 4h4v10h-4zM16 4h4v13h-4z"/></svg><span class="sidebar__label">마감 보드</span><span class="sidebar__folio">p.098</span></a></li>
        </ul>
      </div>
      <div>
        <p class="sidebar__group">독자</p>
        <ul class="sidebar__list" role="list">
          <li><a class="sidebar__link" href="inbox.html"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18v12H3z"/><path d="M3 6l9 7 9-7"/></svg><span class="sidebar__label">독자 편지</span><span class="badge badge--count sidebar__badge" aria-label="미답 9통">9</span><span class="sidebar__folio">p.104</span></a></li>
          <li><a class="sidebar__link" href="profile.html"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 20c1.5-4 4.5-6 8-6s6.5 2 8 6"/></svg><span class="sidebar__label">필진 — 한예린</span><span class="sidebar__folio">p.007</span></a></li>
        </ul>
      </div>
      <div>
        <p class="sidebar__group">운영</p>
        <ul class="sidebar__list" role="list">
          <li><a class="sidebar__link" href="settings.html"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h10M18 7h2M4 17h4M12 17h8"/><path d="M14 4v6M8 14v6"/></svg><span class="sidebar__label">구독 계정</span><span class="sidebar__folio">p.108</span></a></li>
          <li><a class="sidebar__link" href="pricing.html"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16v14H4z"/><path d="M4 9h16M8 14h4"/></svg><span class="sidebar__label">정기구독 안내</span><span class="sidebar__folio">p.110</span></a></li>
          <li><a class="sidebar__link" href="product.html"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3h12v18H6z"/><path d="M9 7h6"/></svg><span class="sidebar__label">11월호 단권</span><span class="sidebar__folio">p.112</span></a></li>
        </ul>
      </div>
    </nav>
    <p class="sidebar__foot">원고 마감 <b>10월 14일(수) 18:00</b><br>인쇄 넘김 10월 20일(화) 10:00 · 을지인쇄</p>
  </aside>
  <main class="desk__main" id="main">
    <section class="sheet" data-folio="p.098"> … </section>
  </main>
</div>
```

index에서 사이드바 **컴포넌트를 시연**할 때만 아래 경로판을 쓴다(index의 레이아웃 셸로 쓰지 말 것 — 왼쪽 고정 목차 사이드바는 theme-30 문법이다).

```html
<aside class="sidebar" aria-label="편집국">
  <div class="sidebar__head">
    <span class="avatar avatar--ink" aria-hidden="true">윤</span>
    <span class="sidebar__who"><span class="sidebar__name">윤서경</span><span class="sidebar__role">발행인 겸 편집장</span></span>
  </div>
  <nav class="sidebar__nav" aria-label="편집국 메뉴">
    <div>
      <p class="sidebar__group">편집</p>
      <ul class="sidebar__list" role="list">
        <li><a class="sidebar__link" href="pages/dashboard.html"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h7v7H4zM13 4h7v4h-7zM13 10h7v10h-7zM4 13h7v7H4z"/></svg><span class="sidebar__label">편집국 탐방</span><span class="sidebar__folio">p.096</span></a></li>
        <li><a class="sidebar__link" href="pages/kanban.html"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h4v16H4zM10 4h4v10h-4zM16 4h4v13h-4z"/></svg><span class="sidebar__label">마감 보드</span><span class="sidebar__folio">p.098</span></a></li>
      </ul>
    </div>
    <div>
      <p class="sidebar__group">독자</p>
      <ul class="sidebar__list" role="list">
        <li><a class="sidebar__link" href="pages/inbox.html"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18v12H3z"/><path d="M3 6l9 7 9-7"/></svg><span class="sidebar__label">독자 편지</span><span class="badge badge--count sidebar__badge" aria-label="미답 9통">9</span><span class="sidebar__folio">p.104</span></a></li>
        <li><a class="sidebar__link" href="pages/profile.html"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 20c1.5-4 4.5-6 8-6s6.5 2 8 6"/></svg><span class="sidebar__label">필진 — 한예린</span><span class="sidebar__folio">p.007</span></a></li>
      </ul>
    </div>
    <div>
      <p class="sidebar__group">운영</p>
      <ul class="sidebar__list" role="list">
        <li><a class="sidebar__link" href="pages/settings.html"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h10M18 7h2M4 17h4M12 17h8"/><path d="M14 4v6M8 14v6"/></svg><span class="sidebar__label">구독 계정</span><span class="sidebar__folio">p.108</span></a></li>
        <li><a class="sidebar__link" href="pages/pricing.html"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16v14H4z"/><path d="M4 9h16M8 14h4"/></svg><span class="sidebar__label">정기구독 안내</span><span class="sidebar__folio">p.110</span></a></li>
        <li><a class="sidebar__link" href="pages/product.html"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3h12v18H6z"/><path d="M9 7h6"/></svg><span class="sidebar__label">11월호 단권</span><span class="sidebar__folio">p.112</span></a></li>
      </ul>
    </div>
  </nav>
  <p class="sidebar__foot">원고 마감 <b>10월 14일(수) 18:00</b><br>인쇄 넘김 10월 20일(화) 10:00 · 을지인쇄</p>
</aside>
```

- ≥1024: 왼쪽 264px 고정 열(교정지 면). <1024: 마스트헤드 바로 아래 가로 스크롤 띠로 바뀌고 오른쪽 끝 페이드 힌트, 그룹명·쪽번호·아이콘은 숨는다.

### 1-6. ⌘K 색인 + 토스트 영역 · body 끝 (index.html 경로)

```html
<div class="command" id="command">
  <div class="command__scrim" data-close></div>
  <div class="command__panel" role="dialog" aria-modal="true" aria-label="찾아보기 — 색인">
    <div class="command__bar"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6"/><path d="M15 15l5 5"/></svg><input class="command__input" type="text" placeholder="기사·필자·쪽번호 — 예: 활판, 한예린, 054" aria-label="찾을 말" role="combobox" aria-expanded="true" aria-controls="command-list" aria-autocomplete="list" autocomplete="off" data-autofocus><button class="btn btn--ghost btn--sm" type="button" data-close>닫기</button></div>
    <ul class="command__list" id="command-list" role="listbox" aria-label="색인">
      <li class="command__group" role="presentation"><p class="command__group-head" aria-hidden="true">ㄱ</p><ul class="command__items" role="group" aria-label="ㄱ">
        <li role="presentation"><a class="command__item" role="option" href="pages/settings.html" data-keywords="구독 설정 배송지 결제 레터 108"><span>구독 계정 <span class="command__item-sub">김하늘 · SUB-0048213</span></span><span class="leader__dots"></span><span class="leader__folio">108</span></a></li>
        <li role="presentation"><a class="command__item" role="option" href="index.html#a-c01" data-keywords="연재 C01 정은호 간판 받침 064"><span>골목의 문장 제14회 — 간판의 받침 <span class="command__item-sub">연재 · 정은호</span></span><span class="leader__dots"></span><span class="leader__folio">064</span></a></li>
      </ul></li>
      <li class="command__group" role="presentation"><p class="command__group-head" aria-hidden="true">ㄴ</p><ul class="command__items" role="group" aria-label="ㄴ">
        <li role="presentation"><a class="command__item" role="option" href="pages/404.html" data-keywords="404 없는 쪽 낙장 빠진 쪽"><span>낙장(落張) <span class="command__item-sub">빠진 쪽 안내</span></span><span class="leader__dots"></span><span class="leader__folio">—</span></a></li>
        <li role="presentation"><a class="command__item" role="option" href="index.html#a-d02" data-keywords="식탁 D02 국밥 한예린 090"><span>늦가을 국밥 순례 <span class="command__item-sub">식탁 · 한예린</span></span><span class="leader__dots"></span><span class="leader__folio">090</span></a></li>
      </ul></li>
      <li class="command__group" role="presentation"><p class="command__group-head" aria-hidden="true">ㄷ</p><ul class="command__items" role="group" aria-label="ㄷ">
        <li role="presentation"><a class="command__item" role="option" href="pages/inbox.html" data-keywords="편지함 박소율 104"><span>독자 편지 <span class="command__item-sub">10월 47통 · 미답 9통</span></span><span class="leader__dots"></span><span class="leader__folio">104</span></a></li>
        <li role="presentation"><a class="command__item" role="option" href="pages/product.html" data-keywords="구매 상품 단권 112"><span>단권 — 11월호 제87호 <span class="command__item-sub">₩16,000</span></span><span class="leader__dots"></span><span class="leader__folio">112</span></a></li>
        <li role="presentation"><a class="command__item" role="option" href="index.html#p-078" data-keywords="단신 대흥활판 식자실 별책부록 계단 이름 공모 078"><span>단신 — 대흥활판 식자실 · 계단 이름 공모 <span class="command__item-sub">정리 이도경 · 박소율</span></span><span class="leader__dots"></span><span class="leader__folio">078</span></a></li>
      </ul></li>
      <li class="command__group" role="presentation"><p class="command__group-head" aria-hidden="true">ㅁ</p><ul class="command__items" role="group" aria-label="ㅁ">
        <li role="presentation"><a class="command__item" role="option" href="pages/kanban.html" data-keywords="칸반 원고 교정 조판 098"><span>마감 보드 <span class="command__item-sub">강태민 · 6단계</span></span><span class="leader__dots"></span><span class="leader__folio">098</span></a></li>
      </ul></li>
      <li class="command__group" role="presentation"><p class="command__group-head" aria-hidden="true">ㅂ</p><ul class="command__items" role="group" aria-label="ㅂ">
        <li role="presentation"><a class="command__item" role="option" href="index.html#p-054" data-keywords="인터뷰 F03 054"><span>밤의 식자공 — 김순례(73) <span class="command__item-sub">특집 인터뷰 · 한예린</span></span><span class="leader__dots"></span><span class="leader__folio">054</span></a></li>
      </ul></li>
      <li class="command__group" role="presentation"><p class="command__group-head" aria-hidden="true">ㅇ</p><ul class="command__items" role="group" aria-label="ㅇ">
        <li role="presentation"><a class="command__item" role="option" href="index.html#a-d01" data-keywords="동네 D01 옥인동 계단 지도 오준석 080"><span>옥인동 계단 지도 <span class="command__item-sub">동네 · 오준석</span></span><span class="leader__dots"></span><span class="leader__folio">080</span></a></li>
        <li role="presentation"><a class="command__item" role="option" href="index.html#a-r01" data-keywords="리뷰 R01 책 이도경 072"><span>이달의 책 다섯 권 <span class="command__item-sub">리뷰 · 이도경 · 원고 D-4</span></span><span class="leader__dots"></span><span class="leader__folio">072</span></a></li>
        <li role="presentation"><a class="command__item" role="option" href="index.html#p-004" data-keywords="특집 2부 F02 인쇄 골목 오준석 042"><span>인쇄 골목 24시 <span class="command__item-sub">특집 2부 · 오준석 · 원고 D-4</span></span><span class="leader__dots"></span><span class="leader__folio">042</span></a></li>
      </ul></li>
      <li class="command__group" role="presentation"><p class="command__group-head" aria-hidden="true">ㅈ</p><ul class="command__items" role="group" aria-label="ㅈ">
        <li role="presentation"><a class="command__item" role="option" href="pages/pricing.html" data-keywords="가격 구독 110"><span>정기구독 안내 <span class="command__item-sub">1년 ₩160,000</span></span><span class="leader__dots"></span><span class="leader__folio">110</span></a></li>
        <li role="presentation"><a class="command__item" role="option" href="index.html#p-100" data-keywords="아카이브 캐러셀 100"><span>지난 호 <span class="command__item-sub">제86호 – 제82호</span></span><span class="leader__dots"></span><span class="leader__folio">100</span></a></li>
      </ul></li>
      <li class="command__group" role="presentation"><p class="command__group-head" aria-hidden="true">ㅊ</p><ul class="command__items" role="group" aria-label="ㅊ">
        <li role="presentation"><a class="command__item" role="option" href="index.html#p-004" data-keywords="목차 004"><span>차례 <span class="command__item-sub">11월호 목차</span></span><span class="leader__dots"></span><span class="leader__folio">004</span></a></li>
        <li role="presentation"><a class="command__item" role="option" href="pages/onboarding.html" data-keywords="온보딩 시작 002"><span>처음 펼치는 분께 <span class="command__item-sub">첫 정기구독 안내</span></span><span class="leader__dots"></span><span class="leader__folio">002</span></a></li>
      </ul></li>
      <li class="command__group" role="presentation"><p class="command__group-head" aria-hidden="true">ㅍ</p><ul class="command__items" role="group" aria-label="ㅍ">
        <li role="presentation"><a class="command__item" role="option" href="index.html#p-006" data-keywords="E01 006"><span>편집장의 글 「줄 사이에 남는 것」 <span class="command__item-sub">윤서경</span></span><span class="leader__dots"></span><span class="leader__folio">006</span></a></li>
        <li role="presentation"><a class="command__item" role="option" href="pages/dashboard.html" data-keywords="대시보드 통계 096"><span>편집국 탐방 <span class="command__item-sub">지면 배열표 · 마감 D-4</span></span><span class="leader__dots"></span><span class="leader__folio">096</span></a></li>
        <li role="presentation"><a class="command__item" role="option" href="pages/profile.html" data-keywords="프로필 기자 필진 007"><span>필진 — 한예린 <span class="command__item-sub">문화부 기자</span></span><span class="leader__dots"></span><span class="leader__folio">007</span></a></li>
      </ul></li>
      <li class="command__group" role="presentation"><p class="command__group-head" aria-hidden="true">ㅎ</p><ul class="command__items" role="group" aria-label="ㅎ">
        <li role="presentation"><a class="command__item" role="option" href="index.html#p-024" data-keywords="특집 F01 활판 024"><span>활판의 마지막 가을 <span class="command__item-sub">특집 1부 · 한예린</span></span><span class="leader__dots"></span><span class="leader__folio">024</span></a></li>
      </ul></li>
    </ul>
    <p class="command__empty" hidden>「<b data-command-query></b>」로 찾은 지면이 없습니다. 기사 제목, 필자 이름, 쪽번호(예: 054)로 찾아보세요.</p>
    <div class="command__foot"><span><span class="kbd">↑</span><span class="kbd">↓</span> 고르기</span><span><span class="kbd">↵</span> 펼치기</span><span><span class="kbd">esc</span> 닫기</span><span>색인 <span class="folio">p.—</span></span></div>
  </div>
</div>
<div class="toast-region" aria-live="polite" aria-relevant="additions"></div>
```

### 1-6′. ⌘K 색인 + 토스트 영역 · pages/*.html 경로

```html
<div class="command" id="command">
  <div class="command__scrim" data-close></div>
  <div class="command__panel" role="dialog" aria-modal="true" aria-label="찾아보기 — 색인">
    <div class="command__bar"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6"/><path d="M15 15l5 5"/></svg><input class="command__input" type="text" placeholder="기사·필자·쪽번호 — 예: 활판, 한예린, 054" aria-label="찾을 말" role="combobox" aria-expanded="true" aria-controls="command-list" aria-autocomplete="list" autocomplete="off" data-autofocus><button class="btn btn--ghost btn--sm" type="button" data-close>닫기</button></div>
    <ul class="command__list" id="command-list" role="listbox" aria-label="색인">
      <li class="command__group" role="presentation"><p class="command__group-head" aria-hidden="true">ㄱ</p><ul class="command__items" role="group" aria-label="ㄱ">
        <li role="presentation"><a class="command__item" role="option" href="settings.html" data-keywords="구독 설정 배송지 결제 레터 108"><span>구독 계정 <span class="command__item-sub">김하늘 · SUB-0048213</span></span><span class="leader__dots"></span><span class="leader__folio">108</span></a></li>
        <li role="presentation"><a class="command__item" role="option" href="../index.html#a-c01" data-keywords="연재 C01 정은호 간판 받침 064"><span>골목의 문장 제14회 — 간판의 받침 <span class="command__item-sub">연재 · 정은호</span></span><span class="leader__dots"></span><span class="leader__folio">064</span></a></li>
      </ul></li>
      <li class="command__group" role="presentation"><p class="command__group-head" aria-hidden="true">ㄴ</p><ul class="command__items" role="group" aria-label="ㄴ">
        <li role="presentation"><a class="command__item" role="option" href="404.html" data-keywords="404 없는 쪽 낙장 빠진 쪽"><span>낙장(落張) <span class="command__item-sub">빠진 쪽 안내</span></span><span class="leader__dots"></span><span class="leader__folio">—</span></a></li>
        <li role="presentation"><a class="command__item" role="option" href="../index.html#a-d02" data-keywords="식탁 D02 국밥 한예린 090"><span>늦가을 국밥 순례 <span class="command__item-sub">식탁 · 한예린</span></span><span class="leader__dots"></span><span class="leader__folio">090</span></a></li>
      </ul></li>
      <li class="command__group" role="presentation"><p class="command__group-head" aria-hidden="true">ㄷ</p><ul class="command__items" role="group" aria-label="ㄷ">
        <li role="presentation"><a class="command__item" role="option" href="inbox.html" data-keywords="편지함 박소율 104"><span>독자 편지 <span class="command__item-sub">10월 47통 · 미답 9통</span></span><span class="leader__dots"></span><span class="leader__folio">104</span></a></li>
        <li role="presentation"><a class="command__item" role="option" href="product.html" data-keywords="구매 상품 단권 112"><span>단권 — 11월호 제87호 <span class="command__item-sub">₩16,000</span></span><span class="leader__dots"></span><span class="leader__folio">112</span></a></li>
        <li role="presentation"><a class="command__item" role="option" href="../index.html#p-078" data-keywords="단신 대흥활판 식자실 별책부록 계단 이름 공모 078"><span>단신 — 대흥활판 식자실 · 계단 이름 공모 <span class="command__item-sub">정리 이도경 · 박소율</span></span><span class="leader__dots"></span><span class="leader__folio">078</span></a></li>
      </ul></li>
      <li class="command__group" role="presentation"><p class="command__group-head" aria-hidden="true">ㅁ</p><ul class="command__items" role="group" aria-label="ㅁ">
        <li role="presentation"><a class="command__item" role="option" href="kanban.html" data-keywords="칸반 원고 교정 조판 098"><span>마감 보드 <span class="command__item-sub">강태민 · 6단계</span></span><span class="leader__dots"></span><span class="leader__folio">098</span></a></li>
      </ul></li>
      <li class="command__group" role="presentation"><p class="command__group-head" aria-hidden="true">ㅂ</p><ul class="command__items" role="group" aria-label="ㅂ">
        <li role="presentation"><a class="command__item" role="option" href="../index.html#p-054" data-keywords="인터뷰 F03 054"><span>밤의 식자공 — 김순례(73) <span class="command__item-sub">특집 인터뷰 · 한예린</span></span><span class="leader__dots"></span><span class="leader__folio">054</span></a></li>
      </ul></li>
      <li class="command__group" role="presentation"><p class="command__group-head" aria-hidden="true">ㅇ</p><ul class="command__items" role="group" aria-label="ㅇ">
        <li role="presentation"><a class="command__item" role="option" href="../index.html#a-d01" data-keywords="동네 D01 옥인동 계단 지도 오준석 080"><span>옥인동 계단 지도 <span class="command__item-sub">동네 · 오준석</span></span><span class="leader__dots"></span><span class="leader__folio">080</span></a></li>
        <li role="presentation"><a class="command__item" role="option" href="../index.html#a-r01" data-keywords="리뷰 R01 책 이도경 072"><span>이달의 책 다섯 권 <span class="command__item-sub">리뷰 · 이도경 · 원고 D-4</span></span><span class="leader__dots"></span><span class="leader__folio">072</span></a></li>
        <li role="presentation"><a class="command__item" role="option" href="../index.html#p-004" data-keywords="특집 2부 F02 인쇄 골목 오준석 042"><span>인쇄 골목 24시 <span class="command__item-sub">특집 2부 · 오준석 · 원고 D-4</span></span><span class="leader__dots"></span><span class="leader__folio">042</span></a></li>
      </ul></li>
      <li class="command__group" role="presentation"><p class="command__group-head" aria-hidden="true">ㅈ</p><ul class="command__items" role="group" aria-label="ㅈ">
        <li role="presentation"><a class="command__item" role="option" href="pricing.html" data-keywords="가격 구독 110"><span>정기구독 안내 <span class="command__item-sub">1년 ₩160,000</span></span><span class="leader__dots"></span><span class="leader__folio">110</span></a></li>
        <li role="presentation"><a class="command__item" role="option" href="../index.html#p-100" data-keywords="아카이브 캐러셀 100"><span>지난 호 <span class="command__item-sub">제86호 – 제82호</span></span><span class="leader__dots"></span><span class="leader__folio">100</span></a></li>
      </ul></li>
      <li class="command__group" role="presentation"><p class="command__group-head" aria-hidden="true">ㅊ</p><ul class="command__items" role="group" aria-label="ㅊ">
        <li role="presentation"><a class="command__item" role="option" href="../index.html#p-004" data-keywords="목차 004"><span>차례 <span class="command__item-sub">11월호 목차</span></span><span class="leader__dots"></span><span class="leader__folio">004</span></a></li>
        <li role="presentation"><a class="command__item" role="option" href="onboarding.html" data-keywords="온보딩 시작 002"><span>처음 펼치는 분께 <span class="command__item-sub">첫 정기구독 안내</span></span><span class="leader__dots"></span><span class="leader__folio">002</span></a></li>
      </ul></li>
      <li class="command__group" role="presentation"><p class="command__group-head" aria-hidden="true">ㅍ</p><ul class="command__items" role="group" aria-label="ㅍ">
        <li role="presentation"><a class="command__item" role="option" href="../index.html#p-006" data-keywords="E01 006"><span>편집장의 글 「줄 사이에 남는 것」 <span class="command__item-sub">윤서경</span></span><span class="leader__dots"></span><span class="leader__folio">006</span></a></li>
        <li role="presentation"><a class="command__item" role="option" href="dashboard.html" data-keywords="대시보드 통계 096"><span>편집국 탐방 <span class="command__item-sub">지면 배열표 · 마감 D-4</span></span><span class="leader__dots"></span><span class="leader__folio">096</span></a></li>
        <li role="presentation"><a class="command__item" role="option" href="profile.html" data-keywords="프로필 기자 필진 007"><span>필진 — 한예린 <span class="command__item-sub">문화부 기자</span></span><span class="leader__dots"></span><span class="leader__folio">007</span></a></li>
      </ul></li>
      <li class="command__group" role="presentation"><p class="command__group-head" aria-hidden="true">ㅎ</p><ul class="command__items" role="group" aria-label="ㅎ">
        <li role="presentation"><a class="command__item" role="option" href="../index.html#p-024" data-keywords="특집 F01 활판 024"><span>활판의 마지막 가을 <span class="command__item-sub">특집 1부 · 한예린</span></span><span class="leader__dots"></span><span class="leader__folio">024</span></a></li>
      </ul></li>
    </ul>
    <p class="command__empty" hidden>「<b data-command-query></b>」로 찾은 지면이 없습니다. 기사 제목, 필자 이름, 쪽번호(예: 054)로 찾아보세요.</p>
    <div class="command__foot"><span><span class="kbd">↑</span><span class="kbd">↓</span> 고르기</span><span><span class="kbd">↵</span> 펼치기</span><span><span class="kbd">esc</span> 닫기</span><span>색인 <span class="folio">p.—</span></span></div>
  </div>
</div>
<div class="toast-region" aria-live="polite" aria-relevant="additions"></div>
```

- 색인 항목은 위 목록이 정본. 가나다 그룹 머리(ㄱ ㄴ ㄷ …) 순서를 지킨다. 항목을 더할 때도 오른쪽 쪽번호를 반드시 둔다.

---

> 사이드바 머리(`.sidebar__head`)는 **그 화면을 실제로 쓰는 편집국 사람**으로 바꿔 넣는다: dashboard·kanban = 윤서경(발행인 겸 편집장), settings(독자 구독 계정 관리) = 박소율(독자관리 · 구독 계정 담당), inbox(독자 편지함) = 박소율(독자관리 · 편지함 담당, 아바타 ‘박’). 독자 본인이 로그인한 화면처럼 보이게 하지 않는다.

## 2. 레이아웃 문법 (base.css)

### 2-1. 펼침면 `.spread` — 좌측 쪽 | 접지선 | 우측 쪽

```html
<section class="spread" id="p-026" data-folio="p.026">
  <div class="page page--verso">
    <p class="runhead"><b>행간</b> 2026.11 — 특집</p>
    … 왼쪽 쪽 내용 …
    <span class="folio">p.026</span>
  </div>
  <div class="page page--recto">
    <p class="runhead">활판의 마지막 가을 — <b>한예린</b></p>
    … 오른쪽 쪽 내용 …
    <span class="folio">p.027</span>
  </div>
  <div class="spread__cross"> … 접지선을 가로지르는 피처 제목·풀쿼트·도판만 … </div>
</section>
```

- 위 이중 룰(먹 3px + 2px + 1px)이 지면 경계다. 가운데 1px `--rule` 세로선 = 접지선.
- 판면 여백: 바깥 > 위 > 안쪽(제본). `.page--verso`는 왼쪽이 바깥, `.page--recto`는 오른쪽이 바깥.
- `.runhead`는 바깥 위, `.folio`는 바깥 아래 모서리에 자동으로 붙는다(`.page`의 **직계 자식**일 때).
- `.spread__cross`는 두 쪽을 걸친다(`grid-column: 1 / -1`). 본문 단은 절대 걸치지 않는다.
- 변형: `.spread--bare`(위 이중 룰 없음 — 표지 다음 등), `.spread--nofold`(접지선 없음), `.page--bleed`(쪽 여백 0 — 풀블리드 도판 쪽).
- <768: 낱장으로 접힌다. 오른쪽 쪽이 아래로 이어지고, 쪽 사이에 이중 룰, 폴리오는 남는다.

### 2-2. 낱장 `.sheet` — pages의 한 쪽

```html
<section class="sheet" data-folio="p.110">
  <p class="runhead"><b>행간</b> 2026.11 — 정기구독 안내</p>
  …
  <span class="folio">p.110</span>
</section>
```
`.sheet--verso`(폴리오 왼쪽 아래), `.sheet--bare`(위 이중 룰 없음).

### 2-3. 지면 안 격자 — `.grid`(12단) / `.grid--6`

```html
<div class="grid">
  <div class="span-7">…</div>
  <div class="span-5 self-end">…</div>
</div>
```
- `.span-1` … `.span-12`, `.start-2/3/4/5/7/8`, `.self-end` `.self-start`. **한 행 합 12**(`.grid--6`은 6).
- 지면마다 단 구성을 바꾼다(표지 0단 → 목차 1+2 → 1단 좁은 판 → 2단 → 3단 → 4단 모듈). 연속한 두 지면이 같은 단 수를 쓰지 않는다.
- ≤1023: 6단(스팬 2·3은 반, 나머지 전폭) · ≤767: 1단.

### 2-4. 부서 지면 모듈 `.modgrid` — 4단, 모듈 위 1.5px 먹 룰

```html
<div class="modgrid">
  <div class="mod mod--2">
    <div class="mod__head"><p class="kicker">독자 엽서</p><span class="folio">p.082</span></div>
    …
  </div>
  <div class="mod">…</div>
  <div class="mod">…</div>
</div>
```
`.mod`(1단) `.mod--2` `.mod--3` `.mod--4`(전폭) `.mod--tall`(2행). 한 행 합 4로 빈 칸 없이 채운다. ≤1023 2단 · ≤767 1단.

### 2-5. 본문 조판

| 클래스 | 쓰임 |
|---|---|
| `.prose` | 1단 본문(명조 17/1.75). 둘째 단락부터 들여쓰기 1em, 단락 사이 여백 없음 |
| `.measure` | 한글 1단 측정폭 34em |
| `.columns-2` `.columns-3` | 다단 본문(양끝 맞춤, 단 사이 헤어라인). ≤1023 3단→2단, ≤767 1단 |
| `.span-all` | 다단 안에서 단을 끊고 가로지르기 |
| `.dropcap` | 첫 글자 드롭캡(4행, 모바일 3행, 함렛 900, 별색) — `<p class="dropcap">` |
| `.pull` | 풀쿼트(위 먹 3px · 아래 1px, 함렛 300). 다단 안에서는 자동으로 단을 가로지른다 |
| `.lead-in` | 첫 줄을 고딕 600으로 |

```html
<blockquote class="pull"><span class="pull__mark">“</span>손으로 짠 글자는 줄 사이가 다르다.<cite class="pull__cite">— 김순례, 식자공 51년</cite></blockquote>
```

### 2-6. 조판 도판 `.plate` — 사진 자리 (4종 변주 + 먹 판)

```html
<figure class="figure">
  <div class="plate plate--hatch plate--wide" role="img" aria-label="활자 케이스 앞의 김순례 씨 — 먹 해칭 도판">
    <span class="plate__glyph plate__glyph--knock" aria-hidden="true">활</span>
    <span class="plate__mark folio">도판 1</span>
  </div>
  <figcaption class="plate-cap"><span>필운대로 뒷골목, 오전 5시 12분</span><b>사진 차도영</b></figcaption>
</figure>
```
- 면: `--hatch`(먹 해칭) `--spot`(주홍 별색 판) `--type`(교정지 면 + 초대형 크롭 활자) `--halftone`(망점) `--ink`(먹 판).
- 비율: 기본 4/5 · `--wide` 16/10 · `--square` · `--tall` 3/4 · `--fill`(부모 높이). 또는 `style="--ratio: 2 / 1"`.
- 글자: `.plate__glyph`(판 폭의 96%, 아래로 잘림) + `--knock`(바탕색으로 뚫기) `--spot` `--latin`(보도니 이탤릭) `--top` `--right` `--xl`(140% 크롭). 인라인 SVG 실루엣은 `.plate__svg`(선·면 색은 `style="fill:var(--text)"` 또는 `currentColor`).
- **같은 변주를 연속 두 번 쓰지 않는다.** 카드 안에서는 ≤767에서 자동 4/3.

### 2-7. 시그니처 유틸

| 클래스 | 쓰임 |
|---|---|
| `.folio` | 쪽번호 `p.024` — Plex Mono 11px, 라틴·숫자만. `.folio--spot` `.folio--ink` · 한글 쪽 표기(`표3` `표4`)는 `.folio--ko`(고딕·자간 0). 본문은 p.001–112 — 112를 넘는 쪽번호 금지, 정해지지 않은 쪽은 `p.—` |
| `.runhead` | 러닝헤드 `행간 2026.11 — 특집`(Plex Sans KR 12px). `<b>`는 먹 |
| `.kicker` | 주홍 6×6 사각 + 고딕 라벨. `--latin`(대문자 라틴만 자간) `--plain`(사각 없음) `--muted` |
| `.byline` | `글 <b>한예린</b> · 사진 <b>차도영</b>` |
| `.leader` + `__text` `__dots` `__folio` | 제목 · · · · 024 점선 리더 한 줄 |
| `.rule-double` `.rule-article` `.rule-item` `.double-top` | 룰 위계(지면 · 기사 · 항목) |
| `.barcode` > `.barcode__bars` + `.barcode__num` | 표지·뒤표지 바코드 |
| `.read-rule` | 상단 읽기 진행 룰(마스트헤드 스니펫에 포함) |
| `[data-current-folio]` | 이 요소의 글자를 현재 보이는 지면의 `data-folio`로 바꿔 준다 |
| `.ink-dry` | 잉크 마름 진입 모션 — **제호·피처 제목·드롭캡 문단에만** |
| `.pen` | 교정 펜 밑줄 hover(링크 안 텍스트 span에) · `.link`(본문 링크, 주홍) |

### 2-8. 활자 유틸

`.t-masthead`(제호 120–320px, 함렛 900) `.t-feature`(피처 제목 48–112px) `.t-h2` `.t-h3` `.t-h4` `.t-deck`(덱 — 한글은 함렛 300 자동) `.t-lead` `.t-body` `.t-ui` `.t-caption` `.t-small` `.t-mono` `.t-latin-caps` `.t-italic`(보도니 이탤릭 — **라틴만**) `.t-num` + `.t-num-xl` / `.t-num-lg`(보도니 큰 숫자 — **34px 이상에서만**, 작은 숫자는 함렛·Source Serif) `.t-muted` `.t-spot` `.t-success` `.t-warning` `.t-danger` `.t-right` `.t-center`(표지 제호 전용) `.tnum`
배치: `.stack`(`--tight` `--loose`) `.cluster` `.split` `.crop` · 접근성: `.vh` `.skip` · `.kbd` · 아이콘 `.icon` `--sm` `--lg` `--fill`

### 2-9. 장면 스코프 — 판의 잉크를 통째로 바꾼다

| 클래스 | 낮의 지면 | 흑지(밤) |
|---|---|---|
| `.scope-cover` | 주홍 전면, 종이색 글자 | 먹 전면, 주홍 제호(`--cover-mast`) |
| `.scope-back` | 먹 전면 | 먹 전면 + 주홍 제목(`--back-title`), 위 3px 주홍 룰(`--back-accent`) |
| `.scope-invert` | 먹 면 | 은박 면 |
| `.scope-surface` | 교정지 면(한 단계 짙은 종이) | 먹지 한 단계 |

스코프 안의 컴포넌트(단추·폼·룰·키커)는 손대지 않아도 그 판에 맞게 찍힌다. 표지 제호 색은 `color: var(--cover-mast)`, 큰 커버라인은 `var(--cover-strong)`.

---

## 3. 장면 CSS에서 쓸 semantic 토큰

색: `--bg --surface --surface-2 --field --layer --layer-paper --text --text-2 --text-3 --rule --rule-strong --spot --spot-text --spot-fill --on-spot-fill --success --warning --info --danger --invert-bg --invert-fg --invert-fg-2 --ink-face --on-ink-face --focus --hover-wash --scrim --cover-bg --cover-fg --cover-mast --cover-strong --back-bg --back-fg --foot-bg --foot-fg --foot-fg-2 --foot-rule --foot-accent`
활자: `--font-display`(함렛) `--font-display-ko` `--font-latin`(보도니) `--font-text` `--font-ui` `--font-mono` · 크기 `--fs-masthead --fs-cover-line --fs-feature --fs-h2 --fs-h3 --fs-h4 --fs-deck --fs-pull --fs-lead --fs-body --fs-col --fs-ui --fs-caption --fs-small --fs-kicker --fs-runhead --fs-folio --fs-num-xl --fs-num-lg` · 줄높이 `--lh-*` · 자간 `--tr-*` · `--measure`
간격·판면: `--sp-1 … --sp-10` `--m-inner --m-top --m-outer --m-bottom --col-gap` · 룰 `--w-hair --w-article --w-heavy --w-spot-bar` · `--offset`(겹친 종이 6px) `--tap`(44) `--tap-sm` `--nav-h`
모션: `--ease-ink --ease-turn --ease-pen --dur-ink --dur-turn --dur-pen --dur-layer --dur-fast` · 층 `--z-sticky --z-nav --z-pop --z-layer --z-toast`

규칙
- 별색 주홍(`--spot`)은 **찍히는 곳에만**: 표지 면, 드롭캡, 키커 사각, 진행 룰, 현재 위치 3px 바, 포커스 링, 별색 단추(화면당 1개). 카드 배경·아이콘·기본 단추에 바르지 않는다. 24px 미만 주홍 글자는 `--spot-text`.
- **주홍 면 vs 주홍 선**: 면(도판·별색 단추·도장·뱃지·표지 미니·책등)은 `--spot-fill` + 글자 `--on-spot-fill`. `--spot`·`--spot-text`는 글자·선 전용이다. 다크에서 `--spot`(#F26A4F)을 넓은 면에 바르면 코럴로 번쩍인다 → 면은 `--spot-fill`(#B5381F).
- 선택(반전) 상태 안의 보조 글자는 `--invert-text-2`(opacity 금지). 한글 여러 줄 대형 제목의 줄높이는 `--lh-display-ko`(1.05). `--lh-display`·`--lh-masthead`는 라틴·숫자·한 줄 제호 전용.
- 큰 가격(보도니 숫자)은 `<span class="t-num"><span class="cur">₩</span>160,000</span>` — ₩만 고딕 위첨자형. 표 안 작은 가격은 Plex 그대로.
- `.t-num`(디스플레이 숫자)은 `"lnum" 1, "pnum" 1` + `opsz 14` + 800. `tnum`은 표·폴리오처럼 세로 정렬이 필요한 작은 숫자에만 — 큰 보도니에 tnum을 걸면 좁은 1이 넓은 칸을 차지해 "₩1 60,000"처럼 비어 보인다. 4·1이 헤어라인으로 무너지는 큰 숫자(41 · 47 · D−4)는 함렛 900으로 찍는다.
- 120px 이상 주홍 글자·도판 글리프(표지 제호, `.plate__glyph--spot`, 단권 표지 제호, 드롭캡, 풀쿼트 따옴표)는 `--spot-display`(낮 #C7341C / 밤 #D2462B). `--spot`(밤 #F26A4F)은 키커·링크·폴리오 같은 24px 이하 글자·선 전용.
- 완료 칸(배열표 조판 완료, 112칸, 받은 호)은 `--done-bg` / `--done-fg`(낮 먹 / 밤 #4A443C 중간 톤). 은박 반전(`--invert-bg`)은 "현재 선택" 한 칸에만.
- `.fieldset`은 기본이 가로 흐름(선택지 사이 28px). 세로로 쌓으려면 `.fieldset--stack`.
- 손가락 화면(≤767 또는 pointer: coarse)에서는 `--tap-sm`이 44px가 된다. 시각 크기를 지켜야 하는 각주·약물 트리거는 `::after` 히트 영역으로 44px.
- 선택·활성·현재 = **반전**(`--invert-bg` / `--invert-fg`). 색으로 선택을 표시하지 않는다.
- "먹 면"이 필요한 장면(먹 판 도판, 책등, 표지 미니)은 `--ink-face` / `--on-ink-face` — 밤에도 은박 띠로 뒤집히지 않는다. 반전 토큰은 **상태**에만.
- radius 0 전역(아바타·라디오만 원). 그림자 없음 — 떠 있는 종이만 `box-shadow: var(--offset) var(--offset) 0 var(--layer-paper), var(--offset) var(--offset) 0 1px var(--rule-strong)` + 먹 1.5px 테두리.

---

## 4. 컴포넌트 32 (알파벳순)

### accordion — 「독자 문의 Q&A」
```html
<div class="accordion" data-accordion="single">   <!-- single: 하나만 열림. 생략하면 여러 개 -->
  <div class="accordion__item">
    <h3 class="accordion__head">
      <button class="accordion__trigger" type="button" aria-expanded="true" aria-controls="qa-1" id="qa-1-h">
        <span class="accordion__no">Q.01</span>
        <span class="accordion__title"><span class="pen">정기구독은 언제 발송되나요?</span></span>
        <span class="accordion__sign" aria-hidden="true"></span>
      </button>
    </h3>
    <div class="accordion__panel" id="qa-1" role="region" aria-labelledby="qa-1-h">
      <p>매달 23일에 발송합니다. 11월호는 10월 23일(금)에 떠납니다.</p>
      <span class="byline">답 <b>박소율</b> · 독자관리</span>
    </div>
  </div>
  <!-- 닫힌 항목: aria-expanded="false" + 패널에 hidden. 준비 중 항목: 버튼에 disabled -->
</div>
```
`.accordion--compact`(좁은 칸). 상태: hover(제목 교정 펜 밑줄) · active(교정지 면) · focus-visible(안쪽 주홍 링) · 열림 `aria-expanded="true"`(기호 − 주홍) · `disabled` · 답을 불러오는 중 = 패널에 `aria-busy="true"` + 안에 `.spinner`(다른 내용은 감춘다).

### alert — 「편집국 공지」 (배경 면 없음, 왼쪽 3px 상태색)
```html
<div class="alert alert--warning" role="status">
  <svg class="icon alert__icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.5L21 20H3z"/><path d="M12 10v4.5M12 16.6v1.2"/></svg>
  <div class="alert__body">
    <span class="alert__kicker">마감 임박</span>
    <p>원고 마감 10월 14일(수) 18:00. 특집 2부·리뷰가 아직 들어오지 않았습니다.</p>
    <span class="alert__meta">강태민 부편집장 · 10월 10일(토) 09:12</span>
    <div class="alert__actions"><button class="btn btn--secondary btn--sm" type="button">원고 독촉 보내기</button></div>
  </div>
  <button class="alert__close" type="button" aria-label="공지 닫기"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button>
</div>
```
`--info`(교정 메모) `--success`(조판 완료) `--warning`(마감 임박) `--danger`(반려 — `role="alert"`). `--band`(지면 맨 위 한 줄). 아이콘 path: 정보 `M4 4h16v16H4z` + `M12 10.5V17M12 7v1.2` · 완료 `M4 4h16v16H4z` + `M8 12.5l2.8 2.8L16.5 9` · 반려 `M4 4h16v16H4z` + `M8.5 8.5l7 7M15.5 8.5l-7 7`.

### badge — 섹션 코드 스탬프 · 상태 표기
```html
<span class="badge badge--current">특집</span>   <!-- 이번 호만 주홍 -->
<span class="badge">연재</span>
<span class="badge badge--muted">부록</span>
<span class="badge badge--code">HG-2611-F01</span>
<span class="badge badge--count" aria-label="미답 9통">9</span>
<button class="badge" type="button" aria-pressed="false" data-toggle>리뷰</button>   <!-- 필터 칩 -->

<span class="status status--success">조판 완료</span>
<span class="status status--info">교정 중</span>
<span class="status status--warning">원고 D-4</span>
<span class="status status--danger">반려 — 게재 동의 미확인</span>
<span class="status status--muted status--hollow">원고 대기</span>
```
`.badge--invert` `.badge--spot`. 상태는 색 + 사각 + 글자. `--spot`도 있다. 필터 칩(`button.badge`): hover · `aria-pressed="true"`(먹 반전) · `disabled`(점선).

### breadcrumb
```html
<nav class="crumbs" aria-label="현재 위치">
  <ol class="crumbs__list">
    <li class="crumbs__item"><a class="crumbs__link" href="../index.html">행간</a></li>
    <li class="crumbs__item"><a class="crumbs__link" href="../index.html#p-004">2026년 11월호</a></li>
    <li class="crumbs__item"><span aria-current="page">마감 보드</span><span class="crumbs__folio">p.098</span></li>
  </ol>
</nav>
```
구분자(짧은 점선 리더)는 CSS가 그린다.

### button
```html
<button class="btn btn--primary" type="button">원고 넘기기</button>          <!-- 먹 면 -->
<button class="btn btn--secondary" type="button">교정 요청</button>         <!-- 먹 1px 테두리 -->
<button class="btn btn--tertiary" type="button">지면 정보</button>          <!-- 밑줄 글자 -->
<button class="btn btn--spot" type="button">₩160,000 결제</button>          <!-- 별색: 결정 행위, 화면당 1개 -->
<button class="btn btn--ghost btn--icon" type="button" aria-label="이전 쪽"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg></button>
<button class="btn btn--primary" type="button" aria-busy="true" aria-disabled="true">인쇄 넘기는 중</button>   <!-- 로딩 -->
<button class="btn btn--secondary" type="button" disabled>조판 마감됨</button>                          <!-- 비활성: 점선 빈 판 -->
<a class="btn btn--primary btn--sm" href="pricing.html">정기구독</a>
```
크기 `--sm`(36) `--lg`(56) `--block` `--icon`. 상태: hover(한 단계 짙은 면) · active · focus-visible(주홍 2px + 2px) · disabled · `aria-busy`(윤전기 스피너가 라벨 앞에). `.btn__folio`(단추 안 쪽번호). 로딩 시연: `data-loading-demo="저장 중"` + 안쪽 `<span data-loading-label>교정본 저장</span>`(+ `data-toast…`이면 끝나고 토스트).

세그먼트(먹 반전 선택):
```html
<div class="seg" role="group" aria-label="지면 보기" data-toggle-group>
  <button class="seg__btn" type="button" aria-pressed="true">펼침면</button>
  <button class="seg__btn" type="button" aria-pressed="false">낱장</button>
  <button class="seg__btn" type="button" aria-pressed="false">배열표</button>
</div>
```
`.btn-row` = 단추 줄.

### calendar — 「11월호 제작 달력」 10월 판
```html
<div class="cal" data-calendar>
  <div class="cal__head">
    <h3 class="cal__title"><span class="t-num">10</span>월 <span class="folio">2026</span></h3>
    <div class="cal__nav">
      <button class="btn btn--ghost btn--icon btn--sm" type="button" aria-label="9월 보기"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg></button>
      <button class="btn btn--ghost btn--icon btn--sm" type="button" aria-label="11월 보기"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg></button>
    </div>
  </div>
  <table class="cal__grid" role="grid" aria-label="2026년 10월">
    <thead><tr><th class="cal__dow cal__dow--sun" scope="col">일</th><th class="cal__dow" scope="col">월</th><th class="cal__dow" scope="col">화</th><th class="cal__dow" scope="col">수</th><th class="cal__dow" scope="col">목</th><th class="cal__dow" scope="col">금</th><th class="cal__dow" scope="col">토</th></tr></thead>
    <tbody>
      <tr>
        <td><button class="cal__day cal__day--out cal__day--sun" type="button" disabled>27</button></td>
        <td><button class="cal__day cal__day--out" type="button" disabled>28</button></td>
        <td><button class="cal__day cal__day--out" type="button" disabled>29</button></td>
        <td><button class="cal__day cal__day--out" type="button" disabled>30</button></td>
        <td><button class="cal__day" type="button">1</button></td>
        <td><button class="cal__day" type="button">2</button></td>
        <td><button class="cal__day cal__day--holiday" type="button" data-label="10월 3일(토) 개천절 — 편집국 휴무">3<span class="cal__note">개천절</span></button></td>
      </tr>
      <!-- … 10월 10일(토) = 오늘 -->
      <!-- <td><button class="cal__day" type="button" aria-current="date" data-label="10월 10일(토) 오늘">10</button></td> -->
      <!-- 마감일 -->
      <!-- <td><button class="cal__day cal__day--deadline" type="button" aria-selected="true" data-label="10월 14일(수) 18:00 원고 마감 — D-4">14<span class="cal__note">원고 마감</span></button></td> -->
    </tbody>
  </table>
  <ul class="cal__legend"><li><span class="cal__key cal__key--deadline"></span>마감</li><li><span class="cal__key cal__key--holiday" aria-hidden="true">9</span>편집국 휴무</li><li><span class="cal__key cal__key--today"></span>오늘 10월 10일(토)</li><li><span class="cal__key cal__key--selected"></span>선택</li></ul>
  <p class="cal__output" data-cal-output aria-live="polite">10월 14일(수) 18:00 원고 마감 — D-4</p>
</div>
```
- 2026년 10월 1일 = 목요일. 일요일 칸은 `cal__day--sun`(주홍 숫자). 편집국 휴무(10월 3일(토) 개천절 · 10월 9일(금) 한글날)는 `cal__day--holiday`(주홍 숫자·메모, `cal__day--sun`과 같은 색) + `data-label`에 "편집국 휴무". 마감(14·19·20일) `--deadline`, 오늘 `aria-current="date"`, 선택 `aria-selected="true"`, 다른 달 `--out` + `disabled`.
- `.cal--compact`(좁은 칸: 44px 정사각, 메모 숨김). ≤767 자동 compact.
- 화살표 키로 날짜 이동, 클릭하면 `data-label`이 `[data-cal-output]`에 찍힌다.
- 편집국 휴무(10월 3일 개천절 · 10월 9일 한글날)는 `cal__day--holiday` + `<span class="cal__note">개천절</span>`. `cal__day--sat`/`--sun`을 겹쳐 쓰지 않는다(토요일 먹색이 이긴다). 범례에 `cal__key--holiday` 한 줄.

### card — 기사 카드 (테두리 없음, 위 1.5px 먹 룰)
```html
<article class="card">
  <div class="card__plate plate plate--hatch plate--tall" aria-hidden="true"><span class="plate__glyph plate__glyph--knock">활</span></div>
  <div class="card__meta"><span class="kicker">특집 1부</span><span class="folio">p.024–041</span></div>
  <h3 class="card__title"><a class="card__link" href="../index.html#p-024">활판의 마지막 가을</a></h3>
  <p class="card__deck">서촌 인쇄 골목에 남은 마지막 활판 공장 세 곳.</p>
  <p class="card__byline byline">글 <b>한예린</b> · 사진 차도영</p>
</article>
```
- `.card__link`가 카드 전체를 덮는다(hover = 제목 교정 펜 밑줄, focus = 카드 외곽 주홍 링).
- `⋯` 메뉴는 `.card__meta` 안에 `<div class="menu card__menu">…</div>`(menu 참조) — 링크 위에 떠서 눌린다.
- 변형: `--lead`(지면 대표 기사, 큰 제목 + 함렛 덱) `--text`(도판 없음) `--h`(가로: 도판 2 : 글 3, ≤767 세로) `--selected` 또는 `aria-current="true"`(위 3px 주홍) `--muted`(원고 대기). `.card__foot`(아래 헤어라인 + 메타 줄).
- 상태: hover·active(제목 밑줄 2→3px) · focus-visible(카드 외곽 주홍 링) · 불러오는 중 `aria-busy="true"`(제목·덱·바이라인·도판이 교정 전 덤미 띠로) · 오류 `.card--error`(위 룰 주홍) + `<p class="card__error"><svg class="icon">…</svg>원고 파일을 열지 못했습니다…</p>`.

### carousel — 「지난 호 표지」 86→82호 (낱장 넘김)
```html
<section class="carousel" data-carousel aria-roledescription="캐러셀" aria-label="지난 호 표지">
  <div class="carousel__viewport" tabindex="0" aria-label="지난 호 — 좌우 화살표로 넘기기">
    <div class="carousel__slide is-active" role="group" aria-roledescription="슬라이드" data-label="제86호">
      <figure class="carousel__figure">
        <div class="cover-mini cover-mini--ink">
          <span class="cover-mini__mast">행간</span>
          <span class="cover-mini__issue">2026.10<br>No.86</span>
          <span class="cover-mini__line">밤의 동네 빵집<span class="cover-mini__sub">새벽 세 시의 반죽</span></span>
        </div>
        <figcaption class="carousel__caption">
          <span class="carousel__issue">2026.10 · No.86</span>
          <span class="carousel__title">밤의 동네 빵집</span>
          <span class="carousel__text">새벽 세 시에 불을 켜는 서울의 빵집 아홉 곳.</span>
          <span class="status status--success">재고 있음 · ₩14,000</span>
        </figcaption>
      </figure>
    </div>
    <!-- 제85호 cover-mini--spot · 제84호 --halftone · 제83호 --hatch · 제82호 --type(<span class="cover-mini__art">茶</span>) -->
  </div>
  <div class="carousel__bar">
    <p class="carousel__count"><span class="carousel__count-issue" data-carousel-current>제86호</span><span class="carousel__count-sep" aria-hidden="true">·</span><span class="carousel__count-pos"><span data-carousel-index>1</span> / <span data-carousel-total>5</span></span></p>
    <ul class="carousel__dots" role="list">
      <li><button class="carousel__dot" type="button" data-carousel-dot aria-label="제86호">86</button></li>
      <!-- 85 84 83 82 -->
    </ul>
    <div class="carousel__ctrl">
      <button class="btn btn--secondary btn--icon" type="button" data-carousel-prev aria-label="더 최근 호"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg></button>
      <button class="btn btn--secondary btn--icon" type="button" data-carousel-next aria-label="더 지난 호"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg></button>
    </div>
  </div>
</section>
```
- 표지 미니 `.cover-mini` 변주: `--spot` `--ink` `--paper` `--hatch` `--halftone` `--type`. `--spot`·`--hatch`·`--halftone`·`--type`는 `<span class="cover-mini__art"></span>`(type은 안에 큰 글자 한 자)을 **mast 앞에** 둔다. 같은 변주를 이웃 슬라이드에 연달아 쓰지 않는다.
- 처음·끝에서 넘김 단추는 자동 비활성(점선). ←/→ 키 지원. ≤767 점(호수) 줄은 숨는다.

### code — 「조판 지시서」
```html
<figure class="code">
  <figcaption class="code__head"><span class="code__file">semantic.css — [data-theme="dark"]</span><button class="btn btn--ghost btn--sm" type="button" data-copy="#code-1" data-toast-folio="p.101">복사</button></figcaption>
  <pre class="code__pre" id="code-1" tabindex="0"><code><span class="code__line"><span class="tk-c">/* 밤 표지 = 먹 전면 + 주홍 제호 */</span></span><span class="code__line"><span class="tk-k">[data-theme="dark"]</span> <span class="tk-p">{</span></span><span class="code__line code__line--mark">  <span class="tk-k">--spot</span><span class="tk-p">:</span> <span class="tk-v">var(--vermilion-300)</span><span class="tk-p">;</span></span><span class="code__line"><span class="tk-p">}</span></span></code></pre>
</figure>
```
줄마다 `.code__line`(줄번호 자동, `--mark` = 주홍 표시줄). 색은 3색만: `.tk-k`(먹) `.tk-v`(주홍) `.tk-c`(감청 주석) `.tk-p`(구두점). 본문 속 코드 `.code-inline`.

### command — ⌘K 「찾아보기」 색인
- 실제 팔레트는 **1-6 스니펫 그대로**(body 끝 1개). 여는 단추: `data-command-open`(마스트헤드에 이미 있음), 단축키 ⌘K / Ctrl+K.
- 정적 견본(index 오버레이 지면): 루트를 `<div class="command command--static">`로, 패널 `aria-modal="false"`, 입력 `readonly value="활"`, 첫 항목 `aria-selected="true"`. scrim은 빼고 `id`는 실제 것과 겹치지 않게.
- 항목: `<a class="command__item" role="option" href="…" data-keywords="검색어 별칭"><span>제목 <span class="command__item-sub">부제</span></span><span class="leader__dots"></span><span class="leader__folio">024</span></a>`.
- 상태: hover · 선택 `aria-selected="true"`(먹 반전) · active · `aria-disabled="true"` · 찾는 중 = `.command__list[aria-busy="true"]` + 목록 위 `<p class="command__status"><span class="spinner">…</span></p>` · 오류 = `<p class="command__status command__status--error"><svg class="icon">…</svg>색인을 불러오지 못했습니다</p>` · 결과 없음 = `.command__empty`.

### drawer — 「지면 정보」 오른쪽 서랍
```html
<div class="drawer" id="drawer-f02">
  <div class="drawer__scrim" data-close></div>
  <aside class="drawer__panel" role="dialog" aria-modal="true" aria-labelledby="drawer-f02-title" tabindex="-1">
    <div class="drawer__runhead"><p class="runhead"><b>지면 정보</b> · p.042–053</p><button class="drawer__close" type="button" data-close aria-label="닫기"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>
    <div class="drawer__head"><span class="badge badge--current">특집</span><h2 class="drawer__title" id="drawer-f02-title">인쇄 골목 24시</h2></div>
    <div class="drawer__body">
      <dl class="drawer__meta">
        <div class="drawer__row"><dt>기사 ID</dt><dd class="t-mono">HG-2611-F02</dd></div>
        <div class="drawer__row"><dt>필자</dt><dd>오준석 · 도시부</dd></div>
        <div class="drawer__row"><dt>단계</dt><dd><span class="status status--warning">원고 D-4</span></dd></div>
        <div class="drawer__row"><dt>쪽</dt><dd>12쪽 · p.042–053</dd></div>
      </dl>
    </div>
    <div class="drawer__foot"><button class="btn btn--secondary" type="button" data-close>닫기</button><button class="btn btn--primary" type="button">원고 열기</button></div>
  </aside>
</div>
<button class="btn btn--secondary" type="button" data-drawer-open="drawer-f02">지면 정보</button>
```
`.drawer--left`(왼쪽). 정적 견본은 `.drawer--static`(scrim 빼고 `aria-modal="false"`). 닫힘 상태는 app.js가 `inert` + `aria-hidden`을 건다. 본문을 불러오는 중 = `.drawer__body[aria-busy="true"]` + 안에 `.spinner`.

### empty — 「백면(白面)」
```html
<div class="empty">
  <p class="empty__folio" aria-hidden="true">p.—</p>
  <p class="empty__title">아직 실린 글이 없습니다</p>
  <p class="empty__text">12월호 지면은 10월 28일(수) 14:00 기획 회의 뒤에 열립니다.</p>
  <div class="empty__action"><button class="btn btn--primary btn--sm" type="button">기획안 올리기</button></div>
</div>
```
`.empty--sm`(좁은 칸) `.empty--wide`(넓은 칸: 쪽번호 왼쪽 + `<div class="empty__body">` 안에 제목·글·행동). 상태 변형: `.empty--error`(불러오기 실패 — 재단선·`p.—`가 주홍, 행동 = "다시 열기") · `.empty--loading`(쪽번호 흐림 + 안에 `.spinner`).

### form — 「독자 엽서」
```html
<form class="postcard" data-validate data-folio="p.104" data-success-title="엽서를 보냈습니다" data-success-text="박소율 독자관리가 10월 16일(금)까지 답장합니다.">
  <div class="postcard__head"><h3 class="postcard__title">편집국에 한 줄</h3><span class="postcard__stamp"><span><b>행</b>우표<br>대신</span></span></div>
  <div class="form-grid">
    <div class="field">
      <label class="field__label" for="r-name">이름<span class="field__req" aria-hidden="true">*</span></label>
      <input class="input" id="r-name" required autocomplete="name" placeholder="송지안">
      <p class="field__error"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.5L21 20H3z"/><path d="M12 10v4.5M12 16.6v1.2"/></svg>이름을 적어 주세요.</p>
    </div>
    <div class="field">
      <label class="field__label" for="r-mail">답장 받을 메일<span class="field__req" aria-hidden="true">*</span></label>
      <input class="input" id="r-mail" type="email" required autocomplete="email">
      <p class="field__hint">답장은 이 주소로만 보냅니다.</p>
      <p class="field__error"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.5L21 20H3z"/><path d="M12 10v4.5M12 16.6v1.2"/></svg>메일 주소 형식이 맞지 않습니다.</p>
    </div>
    <div class="field">
      <label class="field__label" for="r-sec">어느 지면에 대해<span class="field__opt">선택</span></label>
      <div class="select"><select class="select__control" id="r-sec"><option>특집 1부 「활판의 마지막 가을」 p.024</option></select></div>
    </div>
    <div class="field"><label class="field__label" for="r-region">지역</label><input class="input" id="r-region" value="부산 수영" readonly></div>
    <div class="field field--full">
      <label class="field__label" for="r-msg">편지<span class="field__count" id="r-msg-count">0자</span></label>
      <textarea class="textarea textarea--lined" id="r-msg" required maxlength="400" data-count="r-msg-count"></textarea>
      <p class="field__error">…한 줄이라도 적어 주세요.</p>
    </div>
    <fieldset class="fieldset">
      <legend class="fieldset__legend">받는 방법</legend>
      <label class="radio"><input type="radio" name="r-via" checked> 메일로 답장</label>
      <label class="radio"><input type="radio" name="r-via"> 다음 호 독자 편지 지면에 실어도 좋음</label>
    </fieldset>
    <label class="check field--full"><input type="checkbox" checked><span>「행간 레터」도 받겠습니다<span class="check__sub">매달 25일 발송 · 24,310명 구독</span></span></label>
    <label class="switch"><input type="checkbox" role="switch" checked> 실명 공개</label>
    <div class="form-actions"><button class="btn btn--primary" type="submit">엽서 보내기</button><button class="btn btn--tertiary" type="reset">다시 쓰기</button></div>
  </div>
</form>
```
- 입력 `.input` `.textarea`(`--lined` 공책 줄) `.select > .select__control` `.input--num`(모노 숫자) `.input-group`(+ `.input-group__affix` 또는 붙는 `.btn`) `.search > svg.icon + .input.input--search`.
- 상태: hover · focus-visible(주홍 링) · `aria-invalid="true"`(+ 부모 `.field.is-invalid` → 오류 문구가 보이고 도움말은 숨음) · `disabled`(점선 빈 판) · `readonly`(교정지 면). · 확인됨 `.field.is-valid`(올리브 테두리 + `<p class="field__ok"><svg class="icon">…</svg>서울 마포구 성미산로17길 42 확인</p>`) · 확인 중 `.input[aria-busy="true"]`(오른끝에 멈춘 윤전기 표시) · 체크·라디오·스위치 active(교정지 면).
- `form[data-validate]`: 제출 시 `[required]`·email·pattern 검사 → 첫 오류로 초점 + 토스트, 통과하면 제출 단추 `aria-busy` 0.9초 뒤 성공 토스트(`data-success-title` `data-success-text` `data-folio`).
- 체크박스 설명이 있으면 글자를 `<span>`으로 한 번 감싼다(위 예). `.switch__state`(스위치 옆 "켜짐/꺼짐" 글자 — app.js가 체크 상태에 맞춰 바꾼다. 다른 문구는 `data-on`·`data-off`). `.form-grid`(2열, ≤599 1열) · `.field--full` · `.postcard`(엽서 판: 위 점선 절취선 + 우표 칸).

### kanban — 「마감 보드」 6열
```html
<div class="board" data-board>
  <section class="board__col">
    <header class="board__head"><h2 class="board__title"><span class="board__no">03</span>원고</h2><span class="board__count">2건</span></header>
    <ul class="board__list" role="list">
      <li class="board__card board__card--due" id="card-f02">
        <span class="board__id"><span>HG-2611-F02</span><span>p.042–053</span></span>
        <span class="board__card-title">특집 2부 「인쇄 골목 24시」</span>
        <span class="board__meta"><span>오준석</span><span class="board__due">10.14(수) 18:00</span></span>
        <button class="board__move" type="button">단계 이동 ▾</button>
      </li>
      <li class="board__empty" hidden>여기로 끌어 놓기</li>
    </ul>
  </section>
  <!-- 01 기획 · 02 취재 · 03 원고 · 04 교정 · 05 조판 · 06 인쇄 넘김 -->
  <p class="board__live vh" aria-live="polite"></p>
</div>
```
- 끌어 옮기기(드래그 중 = 먹 반전 `.is-dragging`, 놓을 열 `.is-over` = 위 3px 주홍) + 키보드 대안 `.board__move` → 단계 메뉴가 자동 생성된다. 개수(`.board__count`)·빈 칸(`.board__empty`)은 자동 갱신.
- 카드 변형: `--due`(마감 임박 황토 왼쪽 3px) `--done`(조판 완료, 제목 회색). 상태: hover · active · focus-visible · 드래그 중 `.is-dragging`(먹 반전) · 잠김 `aria-disabled="true"`(점선, 인쇄 넘김 뒤 이동 불가) · 옮기는 중 `aria-busy="true"` · 놓을 수 없는 열 `.board__col.is-blocked`(위 3px 주홍 + 점선). 빈 열은 `<li class="board__empty">비어 있음 — 취재는 10월 7일(수)에 끝났습니다</li>`. `.board--mini`(index 「편집국에서」 3열 미니 — 767px 이하에서는 가로 스크롤 대신 열 머리 + 카드를 세로로 쌓는다).
- 열이 넘치면 가로 스크롤 + 오른쪽 끝 페이드.

### list — 목차형(toc) · 필진 명단(roster) · 규칙선 행(rows)
```html
<ol class="toc">
  <li class="toc__group">
    <p class="toc__group-head">특집 — 활판의 마지막 가을</p>
    <ol class="toc__items" role="list">
      <li class="toc__item"><a class="toc__link" href="#p-024"><span class="toc__title">활판의 마지막 가을<small>특집 1부 · 한예린</small></span><span class="leader__dots"></span><span class="toc__folio">024</span></a></li>
    </ol>
  </li>
</ol>

<ul class="roster" role="list">
  <li><a class="roster__item" href="profile.html"><span class="avatar avatar--spot" aria-hidden="true">한</span><span><span class="roster__name">한예린</span><span class="roster__role">문화부 기자 · 특집 메인</span></span><span class="roster__count"><b>3</b>이번 호</span></a></li>
</ul>

<ul class="rows" role="list">
  <li class="rows__item"><span class="rows__key">판형</span><span class="rows__val">230 × 297mm · 무선철</span></li>
</ul>
```
- toc: `.toc--lg`(목차 지면용 큰 제목·쪽번호) · `.toc__no`(앞 번호) · 현재 항목 `aria-current="true"`(왼쪽 3px 주홍) · `.is-disabled`. roster 항목 active · focus-visible · `aria-disabled="true"`. rows 값 오류 `.rows__item--error`.
- avatar: 기본(교정지 면) `--spot` `--ink` · 크기 `--sm`(32) `--lg`(72). 현재 필진 `aria-current="true"`.

### marquee — 「책등」 지난 호가 서가처럼 흐른다
```html
<div class="spines" data-marquee>
  <div class="spines__head"><p class="kicker">책등 — 지난 호</p><button class="btn btn--ghost btn--sm" type="button" data-marquee-toggle aria-pressed="false"><span data-marquee-label>일시정지</span></button></div>
  <div class="spines__window">
    <ul class="spines__track" role="list">
      <li class="spine spine--ink"><span class="spine__no">86</span><span class="spine__title">밤의 동네 빵집</span><span class="spine__mast">행간</span></li>
      <li class="spine spine--spot"><span class="spine__no">85</span><span class="spine__title">일곱 개의 골목</span><span class="spine__mast">행간</span></li>
      <!-- 84 여름, 수영장의 건축(기본) · 83 장마와 우산 수리점(--hatch) · 82 종로의 마지막 다방(--paper) … -->
    </ul>
    <ul class="spines__track" aria-hidden="true" role="list"> … 위 목록 그대로 한 번 더(이음매 없는 반복) … </ul>
<!-- 한 트랙의 폭이 창(spines__window)보다 넓어야 이음매에 빈 선반이 생기지 않는다(1920 기준 30권 이상).
     책등 제목이 7자를 넘으면 6자 이내 약칭을 보이고 전체 제목은 .vh로: <span class="spine__title" data-full="활판의 마지막 가을"><span aria-hidden="true">활판의 가을</span><span class="vh">활판의 마지막 가을</span></span> --> 
  </div>
</div>
```
변주 `--spot` `--ink` `--paper` `--hatch`(기본 = 교정지 면). hover·focus·일시정지 시 멈춤. 움직임 줄이기면 멈춘 채 가로 스크롤 + 복제 줄 숨김. 책등 제목은 12자 안쪽(넘치면 말줄임).

### menu — 기사 `⋯` 메뉴
```html
<div class="menu">
  <button class="btn btn--ghost btn--icon btn--sm menu__trigger" type="button" data-menu aria-haspopup="menu" aria-controls="menu-f02" aria-label="기사 메뉴"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h.01M12 12h.01M19 12h.01" stroke-width="3"/></svg></button>
  <div class="menu__list" id="menu-f02" role="menu">
    <p class="menu__label">특집 2부 「인쇄 골목 24시」</p>
    <button class="menu__item" role="menuitem" type="button">지면 이동<span class="menu__kbd">M</span></button>
    <button class="menu__item" role="menuitem" type="button">필자 변경</button>
    <button class="menu__item" role="menuitem" type="button" data-toast="교정을 요청했습니다" data-toast-text="장미숙 교정·교열에게 전달" data-toast-folio="p.042">교정 요청<span class="menu__kbd">⌘E</span></button>
    <div class="menu__sep" role="separator"></div>
    <button class="menu__item menu__item--danger" role="menuitem" type="button">지면에서 빼기</button>
  </div>
</div>
```
↑↓ Home End 이동, Esc 닫고 단추로 초점 복귀, 바깥 클릭 닫기. 화면 밖으로 넘치면 `.menu--left` / `.menu--up` 자동(고정하려면 `.menu`에 `data-menu-fixed` + 클래스 직접). 항목 앞 아이콘 `<svg class="icon">`. 비활성 `disabled`, 체크형 `role="menuitemcheckbox" aria-checked="true"`. 정적 견본 `.menu__list.menu__list--static`(trigger 없이). 상태: hover·focus-visible(먹 반전) · active(한 단계 옅은 먹) · 위험 항목 hover(주홍 면) · `disabled`.

### modal — 「정기구독 신청 확인」
```html
<div class="modal" id="modal-subscribe">
  <div class="modal__scrim" data-close></div>
  <div class="modal__panel" role="dialog" aria-modal="true" aria-labelledby="modal-subscribe-title" tabindex="-1">
    <div class="modal__head"><p class="runhead">정기구독 · 신청 확인</p><button class="modal__close" type="button" data-close aria-label="닫기"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>
    <div class="modal__body">
      <h2 class="modal__title" id="modal-subscribe-title">1년 12권을 받아 보시겠어요?</h2>
      <p class="modal__text">첫 호는 11월호(제87호)이며 10월 23일(금)에 발송합니다. 별책부록 「서촌 활자 지도」가 함께 갑니다.</p>
      <dl class="modal__sum">
        <div class="modal__sum-row"><dt>상품</dt><dd>정기구독 1년(12권)</dd></div>
        <div class="modal__sum-row"><dt>받는 곳</dt><dd>서울 성북구 · 최수민</dd></div>
        <div class="modal__sum-row modal__sum-row--total"><dt>결제 금액</dt><dd><span class="cur">₩</span>160,000</dd></div>
      </dl>
    </div>
    <div class="modal__foot">
      <span class="folio modal__folio">p.088</span>
      <div class="modal__actions"><button class="btn btn--secondary" type="button" data-close>다시 고르기</button><button class="btn btn--spot" type="button" data-close data-toast="정기구독을 신청했습니다" data-toast-text="주문 ORD-261010-0173 · 첫 호 10월 23일(금) 발송" data-toast-folio="p.110">₩160,000 결제</button></div>
    </div>
  </div>
</div>
<button class="btn btn--spot" type="button" data-modal-open="modal-subscribe">1년 정기구독 신청</button>
```
열림: 종이가 내려앉음(불투명 + 오프셋 0→6px). 포커스 트랩·Esc·scrim 클릭 닫기·닫으면 여는 단추로 초점 복귀. `[data-autofocus]`로 첫 초점 지정. ≤479 아래쪽에 붙는다. 정적 견본 `.modal.modal--static`(scrim 없이, `aria-modal="false"`). 상태: 결제 처리 중 = `.modal__panel[aria-busy="true"]`(본문 잠금, 닫기 숨김) + 결정 단추 `aria-busy` · 실패 = 본문 끝 `<p class="modal__error" role="alert"><svg class="icon">…</svg>카드 승인이 거절되었습니다. 다른 결제수단을 골라 주세요.</p>`(왼쪽 3px 주홍, 평소 `hidden`).

### motion — 모션 3종 실연
```html
<div class="motion-demo">
  <div class="motion-demo__cell">
    <p class="motion-demo__title">잉크 마름</p>
    <div class="motion-demo__stage"><p class="motion-demo__word ink-dry">행<span class="t-spot">간</span></p></div>
    <p class="motion-demo__spec">blur 3px→0 · opacity .3→1 · 640ms</p>
    <div class="motion-demo__foot"><button class="btn btn--secondary btn--sm" type="button" data-motion-replay="ink">다시 찍기</button></div>
  </div>
  <div class="motion-demo__cell">
    <p class="motion-demo__title">교정 펜 밑줄</p>
    <div class="motion-demo__stage"><a class="motion-demo__pen pen" href="#p-024">특집 1부로 가기</a></div>
    <p class="motion-demo__spec">background-size 0→100% · 2px · 220ms</p>
  </div>
  <div class="motion-demo__cell">
    <p class="motion-demo__title">낱장 넘김</p>
    <div class="motion-demo__stage">
      <div class="turner" data-turner data-turner-wrap data-turner-quiet>
        <div class="turner__sheet is-active"><p class="motion-demo__word">p.024</p></div>
        <div class="turner__sheet turner__sheet--b"><p class="motion-demo__word">p.026</p></div>
      </div>
    </div>
    <p class="motion-demo__spec">clip-path inset(0 0 0 100%)→0 · 420ms</p>
    <div class="motion-demo__foot"><button class="btn btn--secondary btn--sm" type="button" data-motion-replay="turn">한 장 넘기기</button></div>
  </div>
</div>
<label class="switch"><input type="checkbox" role="switch" data-motion-toggle> 움직임 줄이기 <span class="switch__state">꺼짐</span></label>
```
- `data-motion-toggle`(체크박스 또는 `aria-pressed` 단추) = 페이지 전체 움직임 줄이기(`html[data-motion="reduce"]`, 저장됨).
- **낱장 넘김 `.turner`**는 온보딩 3장에도 쓴다:
```html
<div class="stack" data-turner>
  <ol class="steps steps--pages"> <li class="steps__item"><span class="steps__no">p.01</span><span class="steps__label">관심 지면</span></li> … </ol>
  <p class="steps__count" data-turn-count></p>                <!-- "p.01 / 03" 자동 -->
  <div class="turner">
    <section class="turner__sheet is-active" aria-labelledby="s1"> <h2 id="s1" data-turn-focus>…</h2> … </section>
    <section class="turner__sheet"> … </section>
    <section class="turner__sheet"> … </section>
  </div>
  <button class="btn btn--secondary" type="button" data-turn="prev">앞 장</button>
  <button class="btn btn--primary" type="button" data-turn="next">다음 장</button>
  <a class="btn btn--spot" href="pricing.html" data-turn-last>구독 시작하기</a>   <!-- 마지막 장에서만 보임 -->
</div>
```
`data-turn="0"`처럼 0부터 세는 번호로 바로 이동. `[data-turner]` 안의 `.steps__item`은 현재 장에 맞춰 완료·현재·예정이 자동으로 바뀐다. `data-turner-wrap`(끝에서 처음으로) `data-turner-quiet`(넘긴 뒤 초점 이동 안 함).

### navbar — 「마스트헤드 띠」
**1-1 / 1-2 스니펫 그대로.** 구성: 워드마크 `행간`(함렛 900) + `2026.11 · 제87호` · 가운데 섹션 5개(차례·특집·인터뷰·편집국·지난 호) · 찾아보기 ⌘K · 테마 토글(`data-theme-toggle`, 낮 = 반달 / 밤 = 해 아이콘) · 정기구독. 아래 이중 룰. ≤899 섹션은 `data-nav-toggle` 단추로 여는 낱장 패널(각 항목 옆 쪽번호), ≤479 정기구독 단추 숨김. 현재 섹션 = 먹 반전. 바닥글(`.site-foot`)도 navbar.css에 있다(1-4, pages 전용).

### pagination — 「쪽 넘김」
```html
<nav class="pager" aria-label="쪽 넘김">
  <a class="pager__step" href="#p-006" rel="prev"><span aria-hidden="true">←</span><span class="pager__folio">p.006</span></a>
  <ol class="pager__pages" role="list">
    <li><a class="pager__page" href="#p-001">p.001</a></li>
    <li><span class="pager__gap">…</span></li>
    <li class="is-near"><a class="pager__page" href="#p-024" aria-current="page">p.024–025</a></li>
    <li class="is-near"><a class="pager__page" href="#p-026">p.026–027</a></li>
    <li><span class="pager__gap">…</span></li>
    <li><a class="pager__page" href="#p-back">표4</a></li>
  </ol>
  <a class="pager__step" href="#p-026" rel="next"><span class="pager__folio">p.026</span><span aria-hidden="true">→</span></a>
  <form class="pager__jump" data-pager-jump data-max="112"><label for="jump-folio">쪽 번호</label><input class="input input--num" id="jump-folio" inputmode="numeric" placeholder="054"><button class="btn btn--secondary btn--sm" type="submit">펼치기</button></form>
</nav>
```
- 처음/끝: 넘김 단추에 `aria-disabled="true"`(점선). ≤767 `.is-near` 항목만 보인다. 넘기는 중 `.pager[aria-busy="true"]`. 쪽 번호 입력 오류는 `.input[aria-invalid="true"]`.
- 쪽 이동: `id="p-054"` 지면이 있으면 그리로, 1–112 밖이면 경고 토스트, 범위 안인데 지면이 없으면 "인쇄본에만 실렸습니다" 토스트.
- 목록형 페이지(독자 편지 등)도 같은 모양을 쓴다(`p.104` 대신 `1–20통`처럼 범위 글자를 넣어도 된다).

### popover — 「각주」
```html
<p>…「손으로 짠 글자는 줄 사이가 다르다」고 그는 말한다.<span class="fn"><button class="fn__ref" type="button" data-popover aria-controls="fn-1" aria-label="각주 1">1</button><span class="popover" id="fn-1" role="note"><span class="popover__no">각주 1 <span class="folio">p.026</span></span><span class="popover__title">행간(行間)</span><span class="popover__body">줄과 줄 사이의 간격. 활판에서는 납 「인테르」를 끼워 조절한다.</span></span></span></p>
```
- 문단 안에 들어가므로 **모두 `<span>`**(div 금지). 화면 밖으로 넘치면 `--right` / `--up` 자동.
- Esc · 바깥 클릭으로 닫힘, 닫히면 위첨자로 초점 복귀. 정적 견본 `<span class="popover popover--static" role="note">`.

### progress — 「11월호 제작 진행」 112칸 + 진행 막대
```html
<div class="pagebar" data-pagebar data-done="46" data-proof="28" data-wait="30" data-ad="8" role="img" aria-label="11월호 112쪽 중 조판 완료 46쪽, 교정 중 28쪽, 원고 대기 30쪽, 광고 8쪽">
  <div class="pagebar__summary"><p class="pagebar__pct">41<small>% 조판 완료</small></p><span class="t-small t-muted">112쪽 · 표지 4쪽 별도</span></div>
  <div class="pagebar__cells"></div>
  <dl class="pagebar__legend">
    <div><dt><span class="pagebar__key pagebar__cell--done"></span>조판 완료</dt><dd>46</dd></div>
    <div><dt><span class="pagebar__key pagebar__cell--proof"></span>교정 중</dt><dd>28</dd></div>
    <div><dt><span class="pagebar__key pagebar__cell--wait"></span>원고 대기</dt><dd>30</dd></div>
    <div><dt><span class="pagebar__key pagebar__cell--ad"></span>광고</dt><dd>8</dd></div>
  </dl>
</div>
```
- 칸은 app.js가 그린다. 지면 순서대로 섞어 그리려면 `data-map="DDDDPPAW…"`(D 조판 완료 · P 교정 중 · W 원고 대기 · A 광고, 112자) — dashboard의 **지면 배열표(flatplan)**는 이 방식. 열 수는 `style="--pb-cols:16"`(기본 28, ≤767 14).
```html
<div class="meter" role="progressbar" aria-valuenow="71" aria-valuemin="0" aria-valuemax="100" aria-label="10월호 판매율">
  <div class="meter__label"><span>10월호 판매율</span><span class="meter__value">71.4%</span></div>
  <div class="meter__track"><div class="meter__fill" style="--val:71.4%"></div></div>
</div>
```
`.meter--spot` `--warning` `--success` `--busy`(값 모를 때 해칭, `aria-valuenow` 생략) `--thin`. `--danger`(지연 — 막대·수치 주홍).

### sidebar — 편집국 내비
**1-5 스니펫 그대로.** 현재 항목 = 먹 반전 + 왼쪽 3px 주홍(`aria-current="page"`). 미답 수 `.badge--count.sidebar__badge`. 비활성 항목 `aria-disabled="true"`.

### skeleton — 「교정 전 지면」
```html
<div class="skel" aria-busy="true" aria-label="지면을 불러오는 중">
  <span class="skel__bar skel__bar--kicker"></span>
  <span class="skel__bar skel__bar--title"></span>
  <span class="skel__bar skel__bar--title"></span>
  <span class="skel__bar skel__bar--deck"></span>
  <div class="skel__cols">
    <div><span class="skel__bar"></span><span class="skel__bar"></span><span class="skel__bar skel__bar--mid"></span></div>
    <div><span class="skel__bar"></span><span class="skel__bar skel__bar--short"></span></div>
  </div>
</div>
```
움직임 없음. 도판 자리는 X자 박스로 그리지 않는다(와이어프레임처럼 보인다) — 텍스트 띠와 단 구성만 남긴다. 표·목록 덤미: `<div class="skel__row"><span class="skel__avatar"></span><span class="skel__bar" style="--w:40%"></span></div>`. `.skel__cols--3`.

### spinner — 「윤전기」
```html
<span class="spinner"><span class="spinner__wheel" aria-hidden="true"></span><span class="spinner__label">지면을 불러오는 중</span></span>
```
라벨은 항상 같이. `.spinner--lg`(40px) `.spinner--block`(블록, 위아래 여백). 움직임 줄이기면 멈추고 라벨 끝에 "…". 단추 안에서는 스피너를 따로 넣지 않는다 — `.btn[aria-busy="true"]`가 같은 윤전기를 그린다.

### steps — 「인쇄 일정」
```html
<ol class="steps">
  <li class="steps__item steps__item--done"><span class="steps__no">01</span><span class="steps__label">기획</span><span class="steps__date">9월 21일(월)</span></li>
  <li class="steps__item steps__item--done"><span class="steps__no">02</span><span class="steps__label">취재</span><span class="steps__date">10월 7일(수)</span></li>
  <li class="steps__item" aria-current="step"><span class="steps__no">03</span><span class="steps__label">원고</span><span class="steps__date">10월 14일(수) 18:00</span><span class="steps__flag">D-4</span></li>
  <li class="steps__item steps__item--todo"><span class="steps__no">04</span><span class="steps__label">교정</span><span class="steps__date">10월 15일 – 16일</span></li>
  <li class="steps__item steps__item--todo"><span class="steps__no">05</span><span class="steps__label">조판</span><span class="steps__date">10월 19일(월)</span></li>
  <li class="steps__item steps__item--todo"><span class="steps__no">06</span><span class="steps__label">인쇄 넘김</span><span class="steps__date">10월 20일(화) 10:00</span></li>
</ol>
```
`--late`(지연, 황토). `--error`(멈춤 — 을지인쇄 회신 대기 등, 주홍 + 번호 뒤 `!`). `.steps--pages`(온보딩 쪽 진행, 모바일에서도 가로) + `.steps__count`. ≤767 세로 목록.

### table — 「11월호 지면 진행표」
```html
<div class="tbl-wrap" role="region" aria-labelledby="tbl-flat" tabindex="0">
  <table class="tbl" data-sortable>
    <caption class="tbl__caption" id="tbl-flat"><span class="tbl__caption-row"><span class="tbl__caption-title"><b>표 3</b> 11월호 지면 진행표</span><span class="folio">p.012</span></span></caption>
    <thead><tr>
      <th scope="col"><button class="tbl__sort" type="button" data-sort="text">기사 ID</button></th>
      <th scope="col" aria-sort="ascending"><button class="tbl__sort" type="button" data-sort="text">지면</button></th>
      <th scope="col">제목</th>
      <th scope="col">필자</th>
      <th scope="col">단계</th>
      <th scope="col" class="num"><button class="tbl__sort" type="button" data-sort="num">쪽수</button></th>
    </tr></thead>
    <tbody>
      <tr><td class="mono">HG-2611-F01</td><td class="mono">p.024–041</td><td class="tbl__title">특집 1부 「활판의 마지막 가을」<span class="tbl__sub">사진 차도영</span></td><td>한예린</td><td><span class="status status--info">교정 중</span></td><td class="num">18</td></tr>
      <tr aria-selected="true"> … 선택 행 = 먹 반전 + 왼쪽 주홍 … </tr>
    </tbody>
  </table>
</div>
```
- 머리 위 먹 3px, 아래 1.5px, 행 1px. 숫자 칸 `.num`(오른끝, tnum), ID·쪽 `.mono`. 정렬값이 글자와 다르면 칸에 `data-sort-value`.
- 표는 최소 폭 720px — 좁은 화면에서 가로 스크롤 + 오른쪽 끝 페이드. 칸이 적은 표는 `.tbl--fit`. `tfoot` 합계 줄 지원. `.tbl--dense` `.tbl--striped`.
- 상태: 행 hover · 선택 `aria-selected="true"`(먹 반전 + 왼쪽 주홍) · 정렬 `aria-sort` · 불러오는 중 `table.tbl[aria-busy="true"]` · 상태 행 `<tr class="tbl__state"><td colspan="6">…</td></tr>`(빈 결과) / `.tbl__state--error`(불러오기 실패, 왼쪽 3px 주홍).

### tabs — 섹션 탭
```html
<div class="tabs" data-tabs>
  <div class="tabs__scroller">
    <div class="tabs__list" role="tablist" aria-label="11월호 섹션">
      <button class="tabs__tab" role="tab" id="tab-f" aria-controls="panel-f" aria-selected="true">특집 <span class="tabs__count">3</span></button>
      <button class="tabs__tab" role="tab" id="tab-c" aria-controls="panel-c" aria-selected="false">연재 <span class="tabs__count">1</span></button>
      <button class="tabs__tab" role="tab" id="tab-x" aria-controls="panel-x" aria-selected="false" disabled>별책 <span class="tabs__count">0</span></button>
    </div>
  </div>
  <div class="tabs__panels">
    <div class="tabs__panel" role="tabpanel" id="panel-f" aria-labelledby="tab-f" tabindex="0">…</div>
    <div class="tabs__panel" role="tabpanel" id="panel-c" aria-labelledby="tab-c" tabindex="0" hidden>…</div>
    <div class="tabs__panel" role="tabpanel" id="panel-x" aria-labelledby="tab-x" tabindex="0" hidden></div>
  </div>
</div>
```
선택 탭 = 먹 반전 + 위 3px 주홍, 높이 44px. ←/→ Home End(자동 활성), 패널은 낱장 넘김. 넘치면 가로 스크롤 + 끝 페이드. 밑줄형 변형은 없다 — settings 구독 계정 탭도 같은 먹 반전(밤에는 은박 반전)을 쓴다. 상태: hover · active · focus-visible · 선택 · `disabled` · 패널을 불러오는 중 `.tabs__panel[aria-busy="true"]` + 안에 `.spinner` 또는 `.skel`.

### timeline — 「행간 7년」
```html
<ol class="timeline">
  <li class="timeline__item"><p class="timeline__year">2019</p><div class="timeline__body"><p class="timeline__date">2019.09 · No.1</p><h4 class="timeline__title">창간호 「서촌의 첫 문장」</h4><p class="timeline__text">자하문로7길 3층 편집국, 첫 발행 4,000부.</p></div></li>
  <li class="timeline__item timeline__item--now"><p class="timeline__year">2026</p><div class="timeline__body"><p class="timeline__date">2026.11 · No.87</p><h4 class="timeline__title">「활판의 마지막 가을」</h4><p class="timeline__text">10월 25일(일) 발행 · 18,500부.</p></div></li>
</ol>
```
`--now`(주홍) `--cont`(같은 해 다음 줄 — 연도 숨김) `--muted`. `.timeline--compact`(연도 없이 짧은 이력 — 편지 처리·주문 추적).

### toast — 「교정 완료」
- 영역은 1-6 스니펫의 `.toast-region` 1개. 띄우기: 아무 단추에 `data-toast="교정 완료" data-toast-text="특집 1부 18쪽 — 장미숙" data-toast-kind="success" data-toast-folio="p.024"`, 또는 `Haenggan.toast({ title, text, kind, folio, duration })`.
- kind: `success` `info` `warning` `danger`(role=alert) `spot`. 5초 뒤 사라지고 hover·focus 동안 멈춘다.
- 정적 견본:
```html
<div class="toast toast--success toast--static" role="status">
  <svg class="icon toast__icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h16v16H4z"/><path d="M8 12.5l2.8 2.8L16.5 9"/></svg>
  <div class="toast__body"><p class="toast__title">교정 완료</p><p class="toast__text">특집 1부 18쪽 — 장미숙</p></div>
  <span class="folio toast__folio">p.024</span>
  <button class="toast__close" type="button" aria-label="알림 닫기"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button>
</div>
```

### tooltip — 약물 풀이
```html
<span class="tip"><button class="tip__trigger" type="button">「」</button><span class="tip__bubble"><b>홑낫표</b> — 글·기사 제목에 쓴다</span></span>
<span class="tip"><button class="tip__trigger tip__trigger--text" type="button">겹낫표</button><span class="tip__bubble"><b>『 』 겹낫표</b> — 책·잡지 이름</span></span>
```
hover·focus에 표시(먹 면 + 종이 글자, 화살표 없음), Esc로 숨김, `aria-describedby`는 app.js가 잇는다. 오른쪽이 넘치면 자동으로 오른끝 정렬. `.tip--below` `.tip--right`. 정적 견본 `.tip--static`. 트리거 active · focus-visible · `disabled`(점선).

---

## 5. app.js 훅 요약

| 속성 / 클래스 | 동작 |
|---|---|
| `[data-theme-toggle]` | 낮의 지면 ↔ 흑지. localStorage `haenggan-theme`, `?theme=`가 있으면 URL도 갱신. 안에 `[data-theme-label]`이 있으면 글자도 바꿈 |
| `[data-motion-toggle]` | 움직임 줄이기(체크박스 또는 aria-pressed 단추). localStorage `haenggan-motion` |
| `.read-rule` · `[data-cover]` · `[data-current-folio]` · `[data-folio]` | 읽기 진행 룰 · 표지 위 투명 마스트헤드 · 현재 쪽번호 |
| `.ink-dry` | 화면에 들어오면 `.is-dry` |
| `[data-modal-open=id]` `[data-drawer-open=id]` `[data-open=id]` `[data-command-open]` `[data-close]` | 층 열기/닫기 + 포커스 트랩 + Esc + 초점 복귀 + 스크롤 잠금 |
| ⌘K / Ctrl+K | 색인 열기/닫기, 입력으로 거르기(`data-keywords` 포함), ↑↓ Enter |
| `[data-menu]` + `aria-controls` | 메뉴 |
| `[data-popover]` + `aria-controls` | 각주 팝오버 |
| `[data-tabs]` | 탭 |
| `[data-accordion]` (`="single"`) | 아코디언 |
| `[data-toast]` + `data-toast-text/-kind/-folio` · `Haenggan.toast()` | 토스트 |
| `[data-loading-demo]` | 단추 로딩 1.6초 시연 |
| `[data-carousel]` + `data-carousel-prev/next/dot/current/total` | 캐러셀 |
| `[data-turner]` + `data-turn="next|prev|번호"` · `data-turn-count` · `data-turn-last` · `data-turn-focus` | 낱장 넘김(온보딩) |
| `[data-motion-replay="ink|turn"]` | 모션 시연 다시 보기 |
| `[data-marquee-toggle]` | 책등 일시정지 |
| `table[data-sortable]` + `.tbl__sort[data-sort="text|num"]` | 표 정렬 |
| `[data-board]` | 마감 보드 끌어 옮기기 + 단계 이동 메뉴 |
| `[data-calendar]` + `[data-cal-output]` | 날짜 고르기 |
| `[data-pagebar]` (`data-done/proof/wait/ad` 또는 `data-map`) | 112칸 진행 막대 |
| `[data-pager-jump]` (`data-max`) | 쪽 번호로 가기 |
| `form[data-validate]` · `[data-count=id]` | 엽서 검증 · 글자 수 |
| `[data-toggle-group]` 안의 `[aria-pressed]` · `[data-toggle][aria-pressed]` | 단일 선택 · 개별 토글 |
| `[data-copy="#id"]` | 복사 + 토스트 |
| `[data-nav-toggle]` | 모바일 섹션 패널 |
| `.alert__close` | 공지 숨김 |
| 공개 API | `Haenggan.toast(opts)` `Haenggan.open(id)` `Haenggan.close(id)` `Haenggan.theme('dark')` |

---

## 6. 쓰지 말 것

- 가운데 정렬 "작은 라벨 → 제목 → 부제" 섹션 머리, `§ 번호 + 섹션 제목` 반복, 판권 정의 목록 블록 — 위치는 **러닝헤드 + 폴리오**가 말한다.
- 둥근 모서리, 은은한 그림자, radial-gradient 얼룩, 인디고/보라 그라디언트, 이모지 아이콘.
- 별색 주홍을 기본 단추·카드 배경·아이콘 색으로 바르기. 한 화면에 주홍 면 단추 둘 이상.
- 보도니(`--font-latin`)로 한글이 섞인 제목이나 34px 미만 숫자 쓰기(헤어라인이 무너진다) → 함렛·Source Serif.
- 한글 라벨에 모노 폰트·넓은 자간, 한글에 이탤릭.
- KPI 카드 4개 가로줄, 영문 대문자 그룹명(NEWSROOM 등), 플레이스홀더(○○, Lorem, John Doe, Acme).
- `href="#"`, 인라인 onclick, 인라인 `grid-template-columns`, 이미지 파일, 외부 JS/CSS(폰트 제외), SVG presentation attribute의 `var()`.
- fade-up 스태거·바운스·패럴랙스·3D 플립·스크롤 스크럽(모션은 3종만).
