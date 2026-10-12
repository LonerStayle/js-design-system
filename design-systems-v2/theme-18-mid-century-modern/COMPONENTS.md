# 제비항공 JEBI AIR — 컴포넌트 사용서 (v2)

> 기준 문서: `DIRECTION.md`(아트 디렉션·팩트 시트). 이 문서는 **마크업 계약**이다.
> 장면(index.html, pages/*.html)을 만드는 사람은 여기 마크업을 그대로 복사하고, 데이터는 DIRECTION.md 2절 팩트 시트 값만 쓴다.
> 클래스 접두는 `jb-`, BEM(`.jb-block__el--mod`). 컴포넌트 CSS는 semantic 토큰만 쓴다. 장면 CSS(`index.css`, `pages/<name>.css`)도 semantic 토큰만 쓴다.

## 목차
0. [문서 머리(head) — index · pages](#0-문서-머리head)
1. [공통 셸 A — 승객 셸 (navbar · 모바일 메뉴 · ⌘K · footer)](#1-공통-셸-a--승객-셸)
2. [공통 셸 B — 직원 셸 (sidebar · topbar · ⌘K)](#2-공통-셸-b--직원-셸)
3. [지면·시그니처 프리미티브 (base.css)](#3-지면시그니처-프리미티브-basecss)
4. [32개 컴포넌트](#4-32개-컴포넌트)
5. [app.js 동작 계약](#5-appjs-동작-계약)
6. [아이콘 path 모음](#6-아이콘-path-모음)
7. [지킬 것](#7-지킬-것)

---

## 0. 문서 머리(head)

### index.html
```html
<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>2026 가을·겨울 운항 안내 — 제비항공</title>
<script>(function(){try{var q=new URLSearchParams(location.search).get('theme');var s=null;try{s=localStorage.getItem('jebi-theme');}catch(e){}var t=(q==='dark'||q==='light')?q:(s==='dark'||s==='light')?s:(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.setAttribute('data-theme',t);}catch(e){document.documentElement.setAttribute('data-theme','light');}})();</script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Black+Han+Sans&family=League+Spartan:wght@500;700;800&family=Yellowtail&family=Yeon+Sung&family=IBM+Plex+Sans+KR:wght@400;500;700&family=Jost:wght@400;500;600&family=Courier+Prime:wght@400;700&display=swap">
<link rel="stylesheet" href="styles.css">
<link rel="stylesheet" href="index.css">
</head>
```
`</body>` 바로 앞: `<script src="app.js"></script>`

### pages/<name>.html
위와 같고 경로만 다르다.
```html
<link rel="stylesheet" href="../styles.css">
<link rel="stylesheet" href="<name>.css">
...
<script src="../app.js"></script>
```
- 테마 결정 순서: `?theme=dark|light` → localStorage `jebi-theme` → 시스템. 인라인 스크립트는 위 한 줄을 그대로 쓴다(FOUC 방지).
- 폰트는 이 `<link>` 한 줄만. CSS `@import`로 폰트를 부르지 않는다.
- `<title>`은 「화면 이름 — 제비항공」.

---

## 1. 공통 셸 A — 승객 셸

쓰는 곳: **index, pricing, product, onboarding, profile, settings, 404**.
구성: 건너뛰기 링크 → `header.jb-nav` → `main#main` → `footer.jb-footer` → 모바일 메뉴 드로어 → ⌘K 팔레트 → 스크립트.
- footer 워드마크 묶음(손글씨 `Jebi` + 「제비항공 JEBI AIR」)은 navbar.css가 16px 간격과 J 꼬리용 아래 여백 12px을 준다. 마크업은 아래 스니펫 그대로.
- index처럼 바로 위 지면이 cheat-xl 부메랑으로 끝나는 장면만 `<footer class="jb-footer jb-footer--after-cover">`로 위 치트라인을 뺀다(띠가 연달아 두 번 나오지 않게).
현재 화면 링크에 `aria-current="page"`를 붙인다(navbar와 모바일 메뉴 **둘 다**). index에서는 navbar 링크에 현재 표시가 없다(브로셔가 첫 장이고 워드마크가 index로 간다).

### 1-A. index 경로 (index.html)
```html
<body>
<a class="jb-skip" href="#main">본문으로 건너뛰기</a>
<header class="jb-nav">
  <div class="jb-nav__inner">
    <a class="jb-nav__brand jb-wordmark" href="index.html" aria-label="제비항공 운항 안내 첫 장으로"><span class="jb-wordmark__script" aria-hidden="true">Jebi</span><span class="jb-wordmark__name">제비항공</span></a>
    <nav class="jb-nav__primary" aria-label="주요 메뉴">
      <ul class="jb-nav__links">
        <li><a class="jb-nav__link" href="pages/dashboard.html">운항 현황판</a></li>
        <li><a class="jb-nav__link" href="pages/inbox.html">문의함</a></li>
        <li><a class="jb-nav__link" href="pages/kanban.html">캠페인 보드</a></li>
        <li><a class="jb-nav__link" href="pages/pricing.html">운임표</a></li>
        <li><a class="jb-nav__link" href="pages/product.html">숄더백</a></li>
        <li><a class="jb-nav__link" href="pages/onboarding.html">제비클럽 가입</a></li>
        <li><a class="jb-nav__link" href="pages/profile.html">내 정보</a></li>
        <li><a class="jb-nav__link" href="pages/settings.html">설정</a></li>
      </ul>
    </nav>
    <div class="jb-nav__tools">
      <button type="button" class="jb-nav__search" data-command-open aria-haspopup="dialog" aria-label="편명·예약번호·공항 찾기"><svg class="jb-icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/></svg><span class="jb-nav__search-text" aria-hidden="true">찾기</span><kbd class="jb-kbd" aria-hidden="true">⌘K</kbd></button>
      <button type="button" class="jb-nav__icon-btn" data-theme-toggle aria-label="밤 화면" aria-pressed="false"><svg class="jb-icon jb-theme-icon--sun" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4.5"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"/></svg><svg class="jb-icon jb-theme-icon--moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M19.5 14.5A8 8 0 0 1 9.5 4.5a8 8 0 1 0 10 10z"/></svg></button>
      <button type="button" class="jb-nav__icon-btn jb-nav__menu-btn" data-drawer-open="jb-nav-drawer" aria-controls="jb-nav-drawer" aria-expanded="false" aria-label="전체 메뉴"><svg class="jb-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h10"/></svg></button>
    </div>
  </div>
</header>

<main id="main">
  <!-- 장면 -->
</main>

<footer class="jb-footer">
  <div class="jb-footer__inner">
    <div class="jb-footer__brand">
      <a class="jb-wordmark" href="index.html"><span class="jb-wordmark__script" aria-hidden="true">Jebi</span><span class="jb-wordmark__name">제비항공 JEBI AIR</span></a>
      <p class="jb-footer__tag">1959년 김포에서 프로펠러기 두 대로 날기 시작했습니다.</p>
    </div>
    <div>
      <p class="jb-footer__title">고객센터</p>
      <a class="jb-footer__tel" href="tel:15991959">1599-1959</a>
      <p class="jb-footer__text">매일 <span class="jb-mono">07:00–22:00</span><br><a href="mailto:help@jebiair.kr">help@jebiair.kr</a></p>
    </div>
    <div>
      <p class="jb-footer__title">본사 · 카운터</p>
      <p class="jb-footer__text">서울 강서구 공항대로59길 18, 제비빌딩 4층<br>김포공항 국내선 1층 J 카운터</p>
    </div>
  </div>
  <div class="jb-footer__bottom"><span>제비항공은 가상의 항공사입니다.</span><span>© 1959–2026 제비항공</span></div>
</footer>

<div class="jb-drawer jb-drawer--left" id="jb-nav-drawer" hidden>
  <div class="jb-drawer__scrim"></div>
  <div class="jb-drawer__panel" role="dialog" aria-modal="true" aria-labelledby="jb-nav-drawer-title">
    <div class="jb-drawer__head">
      <h2 class="jb-drawer__title" id="jb-nav-drawer-title">전체 메뉴<span class="jb-drawer__sub">2026 가을·겨울 운항 안내</span></h2>
      <button type="button" class="jb-drawer__close" data-close aria-label="메뉴 닫기"><svg class="jb-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button>
    </div>
    <nav class="jb-drawer__body" aria-label="전체 메뉴">
      <p class="jb-navlist__group">승객</p>
      <ul class="jb-navlist">
        <li><a href="index.html">운항 안내 브로셔<span class="jb-navlist__note">P. 01–09</span></a></li>
        <li><a href="pages/pricing.html">운임표<span class="jb-navlist__note">₩39,000부터</span></a></li>
        <li><a href="pages/product.html">1959 복각 숄더백</a></li>
        <li><a href="pages/onboarding.html">제비클럽 가입<span class="jb-navlist__note">3,000깃털</span></a></li>
        <li><a href="pages/profile.html">내 제비클럽</a></li>
        <li><a href="pages/settings.html">계정 설정</a></li>
      </ul>
      <p class="jb-navlist__group">직원 화면</p>
      <ul class="jb-navlist">
        <li><a href="pages/dashboard.html">운항 현황판</a></li>
        <li><a href="pages/inbox.html">고객센터 문의함<span class="jb-navlist__note">12건</span></a></li>
        <li><a href="pages/kanban.html">캠페인 보드</a></li>
      </ul>
    </nav>
    <div class="jb-drawer__foot"><span class="jb-small">고객센터 <a href="tel:15991959">1599-1959</a> · 매일 07:00–22:00</span></div>
  </div>
</div>

<div class="jb-command" id="jb-command" hidden>
  <div class="jb-command__scrim"></div>
  <div class="jb-command__box" role="dialog" aria-modal="true" aria-label="편명·예약번호·공항 찾기">
    <div class="jb-command__search">
      <svg class="jb-icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/></svg>
      <input class="jb-command__input" type="text" placeholder="편명, 예약번호, 공항" aria-label="찾을 내용" data-autofocus autocomplete="off">
      <button type="button" class="jb-btn jb-btn--ghost jb-btn--sm" data-close>닫기</button>
    </div>
    <div class="jb-command__list">
      <div class="jb-command__group" aria-labelledby="jb-cg-flight"><p class="jb-command__group-label" id="jb-cg-flight">오늘 운항편</p>
        <div class="jb-command__item" data-keywords="JB305 제주 탑승 산호호" data-href="pages/dashboard.html"><span class="jb-tailchip jb-tailchip--coral"></span><span class="jb-command__title"><span class="jb-mono">JB 305</span> 김포 → 제주</span><span class="jb-command__meta">10:50 탑승 중</span></div>
        <div class="jb-command__item" data-keywords="JB601 포항경주 수속 아보카도호" data-href="pages/dashboard.html"><span class="jb-tailchip jb-tailchip--avocado"></span><span class="jb-command__title"><span class="jb-mono">JB 601</span> 김포 → 포항경주</span><span class="jb-command__meta">11:10 수속 중</span></div>
        <div class="jb-command__item" data-keywords="JB307 제주 지연 청록호" data-href="pages/dashboard.html"><span class="jb-tailchip jb-tailchip--teal"></span><span class="jb-command__title"><span class="jb-mono">JB 307</span> 김포 → 제주</span><span class="jb-command__meta">12:45 지연 25분</span></div>
        <div class="jb-command__item" data-keywords="JB309 제주 산호호" data-href="pages/dashboard.html"><span class="jb-tailchip jb-tailchip--coral"></span><span class="jb-command__title"><span class="jb-mono">JB 309</span> 김포 → 제주</span><span class="jb-command__meta">14:30 예정</span></div>
      </div>
      <div class="jb-command__group" aria-labelledby="jb-cg-pnr"><p class="jb-command__group-label" id="jb-cg-pnr">예약</p>
        <div class="jb-command__item" data-keywords="R4TW8N 오세린 7A" data-href="pages/profile.html"><svg class="jb-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16v3a2 2 0 0 0 0 4v3H4v-3a2 2 0 0 0 0-4z"/><path d="M14 7v10" stroke-dasharray="2 2"/></svg><span class="jb-command__title"><span class="jb-mono">R4TW8N</span> 오세린 · 7A</span><span class="jb-command__meta">10.17(토)</span></div>
      </div>
      <div class="jb-command__group" aria-labelledby="jb-cg-page"><p class="jb-command__group-label" id="jb-cg-page">화면</p>
        <div class="jb-command__item" data-href="index.html" data-keywords="브로셔 운항 안내 시간표"><span class="jb-command__title">운항 안내 브로셔</span><span class="jb-command__meta">P. 01–09</span></div>
        <div class="jb-command__item" data-href="pages/pricing.html" data-keywords="운임 가격 세이버 스탠더드 플렉스 제비패스"><span class="jb-command__title">운임표</span><span class="jb-command__meta">승객</span></div>
        <div class="jb-command__item" data-href="pages/product.html" data-keywords="숄더백 굿즈 가방"><span class="jb-command__title">1959 복각 숄더백</span><span class="jb-command__meta">승객</span></div>
        <div class="jb-command__item" data-href="pages/onboarding.html" data-keywords="가입 제비클럽 회원"><span class="jb-command__title">제비클럽 가입</span><span class="jb-command__meta">승객</span></div>
        <div class="jb-command__item" data-href="pages/profile.html" data-keywords="내 정보 프로필 깃털"><span class="jb-command__title">내 제비클럽</span><span class="jb-command__meta">승객</span></div>
        <div class="jb-command__item" data-href="pages/settings.html" data-keywords="설정 알림 결제"><span class="jb-command__title">계정 설정</span><span class="jb-command__meta">승객</span></div>
        <div class="jb-command__item" data-href="pages/dashboard.html" data-keywords="현황판 대시보드 탑승률"><span class="jb-command__title">운항 현황판</span><span class="jb-command__meta">직원</span></div>
        <div class="jb-command__item" data-href="pages/inbox.html" data-keywords="문의함 고객센터 상담"><span class="jb-command__title">고객센터 문의함</span><span class="jb-command__meta">직원</span></div>
        <div class="jb-command__item" data-href="pages/kanban.html" data-keywords="캠페인 칸반 보드"><span class="jb-command__title">캠페인 보드</span><span class="jb-command__meta">직원</span></div>
      </div>
    </div>
    <p class="jb-command__empty" hidden>찾는 편이 없어요. 편명은 JB와 숫자 세 자리예요.</p>
    <div class="jb-command__foot"><span><kbd class="jb-kbd">↑</kbd><kbd class="jb-kbd">↓</kbd> 고르기</span><span><kbd class="jb-kbd">Enter</kbd> 열기</span><span><kbd class="jb-kbd">Esc</kbd> 닫기</span></div>
  </div>
</div>

<script src="app.js"></script>
</body>
```

### 1-B. pages 경로 (pricing · product · onboarding · profile · settings · 404)
1-A와 **마크업이 같고 경로만 바뀐다.** 아래가 그대로 복사할 전체 셸이다(예: pricing — `aria-current`를 자기 화면으로 옮길 것).
```html
<body>
<a class="jb-skip" href="#main">본문으로 건너뛰기</a>
<header class="jb-nav">
  <div class="jb-nav__inner">
    <a class="jb-nav__brand jb-wordmark" href="../index.html" aria-label="제비항공 운항 안내 첫 장으로"><span class="jb-wordmark__script" aria-hidden="true">Jebi</span><span class="jb-wordmark__name">제비항공</span></a>
    <nav class="jb-nav__primary" aria-label="주요 메뉴">
      <ul class="jb-nav__links">
        <li><a class="jb-nav__link" href="dashboard.html">운항 현황판</a></li>
        <li><a class="jb-nav__link" href="inbox.html">문의함</a></li>
        <li><a class="jb-nav__link" href="kanban.html">캠페인 보드</a></li>
        <li><a class="jb-nav__link" href="pricing.html" aria-current="page">운임표</a></li>
        <li><a class="jb-nav__link" href="product.html">숄더백</a></li>
        <li><a class="jb-nav__link" href="onboarding.html">제비클럽 가입</a></li>
        <li><a class="jb-nav__link" href="profile.html">내 정보</a></li>
        <li><a class="jb-nav__link" href="settings.html">설정</a></li>
      </ul>
    </nav>
    <div class="jb-nav__tools">
      <button type="button" class="jb-nav__search" data-command-open aria-haspopup="dialog" aria-label="편명·예약번호·공항 찾기"><svg class="jb-icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/></svg><span class="jb-nav__search-text" aria-hidden="true">찾기</span><kbd class="jb-kbd" aria-hidden="true">⌘K</kbd></button>
      <button type="button" class="jb-nav__icon-btn" data-theme-toggle aria-label="밤 화면" aria-pressed="false"><svg class="jb-icon jb-theme-icon--sun" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4.5"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"/></svg><svg class="jb-icon jb-theme-icon--moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M19.5 14.5A8 8 0 0 1 9.5 4.5a8 8 0 1 0 10 10z"/></svg></button>
      <button type="button" class="jb-nav__icon-btn jb-nav__menu-btn" data-drawer-open="jb-nav-drawer" aria-controls="jb-nav-drawer" aria-expanded="false" aria-label="전체 메뉴"><svg class="jb-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h10"/></svg></button>
    </div>
  </div>
</header>

<main id="main">
  <!-- 장면 -->
</main>

<footer class="jb-footer">
  <div class="jb-footer__inner">
    <div class="jb-footer__brand">
      <a class="jb-wordmark" href="../index.html"><span class="jb-wordmark__script" aria-hidden="true">Jebi</span><span class="jb-wordmark__name">제비항공 JEBI AIR</span></a>
      <p class="jb-footer__tag">1959년 김포에서 프로펠러기 두 대로 날기 시작했습니다.</p>
    </div>
    <div>
      <p class="jb-footer__title">고객센터</p>
      <a class="jb-footer__tel" href="tel:15991959">1599-1959</a>
      <p class="jb-footer__text">매일 <span class="jb-mono">07:00–22:00</span><br><a href="mailto:help@jebiair.kr">help@jebiair.kr</a></p>
    </div>
    <div>
      <p class="jb-footer__title">본사 · 카운터</p>
      <p class="jb-footer__text">서울 강서구 공항대로59길 18, 제비빌딩 4층<br>김포공항 국내선 1층 J 카운터</p>
    </div>
  </div>
  <div class="jb-footer__bottom"><span>제비항공은 가상의 항공사입니다.</span><span>© 1959–2026 제비항공</span></div>
</footer>

<div class="jb-drawer jb-drawer--left" id="jb-nav-drawer" hidden>
  <div class="jb-drawer__scrim"></div>
  <div class="jb-drawer__panel" role="dialog" aria-modal="true" aria-labelledby="jb-nav-drawer-title">
    <div class="jb-drawer__head">
      <h2 class="jb-drawer__title" id="jb-nav-drawer-title">전체 메뉴<span class="jb-drawer__sub">2026 가을·겨울 운항 안내</span></h2>
      <button type="button" class="jb-drawer__close" data-close aria-label="메뉴 닫기"><svg class="jb-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button>
    </div>
    <nav class="jb-drawer__body" aria-label="전체 메뉴">
      <p class="jb-navlist__group">승객</p>
      <ul class="jb-navlist">
        <li><a href="../index.html">운항 안내 브로셔<span class="jb-navlist__note">P. 01–09</span></a></li>
        <li><a href="pricing.html" aria-current="page">운임표<span class="jb-navlist__note">₩39,000부터</span></a></li>
        <li><a href="product.html">1959 복각 숄더백</a></li>
        <li><a href="onboarding.html">제비클럽 가입<span class="jb-navlist__note">3,000깃털</span></a></li>
        <li><a href="profile.html">내 제비클럽</a></li>
        <li><a href="settings.html">계정 설정</a></li>
      </ul>
      <p class="jb-navlist__group">직원 화면</p>
      <ul class="jb-navlist">
        <li><a href="dashboard.html">운항 현황판</a></li>
        <li><a href="inbox.html">고객센터 문의함<span class="jb-navlist__note">12건</span></a></li>
        <li><a href="kanban.html">캠페인 보드</a></li>
      </ul>
    </nav>
    <div class="jb-drawer__foot"><span class="jb-small">고객센터 <a href="tel:15991959">1599-1959</a> · 매일 07:00–22:00</span></div>
  </div>
</div>

<div class="jb-command" id="jb-command" hidden>
  <div class="jb-command__scrim"></div>
  <div class="jb-command__box" role="dialog" aria-modal="true" aria-label="편명·예약번호·공항 찾기">
    <div class="jb-command__search">
      <svg class="jb-icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/></svg>
      <input class="jb-command__input" type="text" placeholder="편명, 예약번호, 공항" aria-label="찾을 내용" data-autofocus autocomplete="off">
      <button type="button" class="jb-btn jb-btn--ghost jb-btn--sm" data-close>닫기</button>
    </div>
    <div class="jb-command__list">
      <div class="jb-command__group" aria-labelledby="jb-cg-flight"><p class="jb-command__group-label" id="jb-cg-flight">오늘 운항편</p>
        <div class="jb-command__item" data-keywords="JB305 제주 탑승 산호호" data-href="dashboard.html"><span class="jb-tailchip jb-tailchip--coral"></span><span class="jb-command__title"><span class="jb-mono">JB 305</span> 김포 → 제주</span><span class="jb-command__meta">10:50 탑승 중</span></div>
        <div class="jb-command__item" data-keywords="JB601 포항경주 수속 아보카도호" data-href="dashboard.html"><span class="jb-tailchip jb-tailchip--avocado"></span><span class="jb-command__title"><span class="jb-mono">JB 601</span> 김포 → 포항경주</span><span class="jb-command__meta">11:10 수속 중</span></div>
        <div class="jb-command__item" data-keywords="JB307 제주 지연 청록호" data-href="dashboard.html"><span class="jb-tailchip jb-tailchip--teal"></span><span class="jb-command__title"><span class="jb-mono">JB 307</span> 김포 → 제주</span><span class="jb-command__meta">12:45 지연 25분</span></div>
        <div class="jb-command__item" data-keywords="JB309 제주 산호호" data-href="dashboard.html"><span class="jb-tailchip jb-tailchip--coral"></span><span class="jb-command__title"><span class="jb-mono">JB 309</span> 김포 → 제주</span><span class="jb-command__meta">14:30 예정</span></div>
      </div>
      <div class="jb-command__group" aria-labelledby="jb-cg-pnr"><p class="jb-command__group-label" id="jb-cg-pnr">예약</p>
        <div class="jb-command__item" data-keywords="R4TW8N 오세린 7A" data-href="profile.html"><svg class="jb-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16v3a2 2 0 0 0 0 4v3H4v-3a2 2 0 0 0 0-4z"/><path d="M14 7v10" stroke-dasharray="2 2"/></svg><span class="jb-command__title"><span class="jb-mono">R4TW8N</span> 오세린 · 7A</span><span class="jb-command__meta">10.17(토)</span></div>
      </div>
      <div class="jb-command__group" aria-labelledby="jb-cg-page"><p class="jb-command__group-label" id="jb-cg-page">화면</p>
        <div class="jb-command__item" data-href="../index.html" data-keywords="브로셔 운항 안내 시간표"><span class="jb-command__title">운항 안내 브로셔</span><span class="jb-command__meta">P. 01–09</span></div>
        <div class="jb-command__item" data-href="pricing.html" data-keywords="운임 가격 세이버 스탠더드 플렉스 제비패스"><span class="jb-command__title">운임표</span><span class="jb-command__meta">승객</span></div>
        <div class="jb-command__item" data-href="product.html" data-keywords="숄더백 굿즈 가방"><span class="jb-command__title">1959 복각 숄더백</span><span class="jb-command__meta">승객</span></div>
        <div class="jb-command__item" data-href="onboarding.html" data-keywords="가입 제비클럽 회원"><span class="jb-command__title">제비클럽 가입</span><span class="jb-command__meta">승객</span></div>
        <div class="jb-command__item" data-href="profile.html" data-keywords="내 정보 프로필 깃털"><span class="jb-command__title">내 제비클럽</span><span class="jb-command__meta">승객</span></div>
        <div class="jb-command__item" data-href="settings.html" data-keywords="설정 알림 결제"><span class="jb-command__title">계정 설정</span><span class="jb-command__meta">승객</span></div>
        <div class="jb-command__item" data-href="dashboard.html" data-keywords="현황판 대시보드 탑승률"><span class="jb-command__title">운항 현황판</span><span class="jb-command__meta">직원</span></div>
        <div class="jb-command__item" data-href="inbox.html" data-keywords="문의함 고객센터 상담"><span class="jb-command__title">고객센터 문의함</span><span class="jb-command__meta">직원</span></div>
        <div class="jb-command__item" data-href="kanban.html" data-keywords="캠페인 칸반 보드"><span class="jb-command__title">캠페인 보드</span><span class="jb-command__meta">직원</span></div>
      </div>
    </div>
    <p class="jb-command__empty" hidden>찾는 편이 없어요. 편명은 JB와 숫자 세 자리예요.</p>
    <div class="jb-command__foot"><span><kbd class="jb-kbd">↑</kbd><kbd class="jb-kbd">↓</kbd> 고르기</span><span><kbd class="jb-kbd">Enter</kbd> 열기</span><span><kbd class="jb-kbd">Esc</kbd> 닫기</span></div>
  </div>
</div>

<script src="../app.js"></script>
</body>
```
- 404에는 navbar·모바일 메뉴 링크 어디에도 `aria-current`를 두지 않는다.
- 바꾸는 곳은 `aria-current` 위치 두 군데뿐이다. 링크 순서·문구·푸터 문구를 페이지마다 바꾸지 않는다.
- navbar는 1280px 이하에서 링크를 숨기고 햄버거(모바일 메뉴 드로어)로 바뀐다. 560px 이하에서 찾기 버튼은 아이콘만 남는다(그래서 `aria-label`이 필요하다).

---

## 2. 공통 셸 B — 직원 셸

쓰는 곳: **dashboard(한지우), inbox(문가람), kanban(장하윤)** — 전부 `pages/` 경로.
구성: 건너뛰기 → `.jb-staff`(밤하늘 사이드바 + 본문) → ⌘K 팔레트(1-B의 `#jb-command` 블록을 그대로) → `../app.js`. **푸터 없음.**
1024px 이하에서 사이드바는 왼쪽 오프캔버스가 되고 topbar 햄버거(`data-side-toggle`)로 연다. Esc·딤 클릭으로 닫힌다.

바꾸는 곳 세 군데: ① 사이드바 `aria-current`, ② `.jb-side__user`의 사람, ③ topbar 제목·메타.

| 화면 | 사이드바 현재 | 사용자(아바타 글자·색) | topbar 제목 / 메타 |
|---|---|---|---|
| dashboard | 운항 현황판 | 한지우 · 수익관리팀 과장 (`한`, `--teal`) | 운항 현황판 / 10월 12일 (월) 10:40 기준 · 24편 |
| inbox | 고객센터 문의함 | 문가람 · 고객경험팀 상담원 (`문`, `--sun`) | 고객센터 문의함 / 새 문의 12건 · 매일 07:00–22:00 |
| kanban | 캠페인 보드 | 장하윤 · 브랜드팀 아트디렉터 (`장`, `--coral`) | 봄바람 타고 여수로 / 2027 봄 캠페인 · 게재 3월 2일 (화) |

```html
<body>
<a class="jb-skip" href="#main">본문으로 건너뛰기</a>
<div class="jb-staff">
  <aside class="jb-side" id="jb-side" aria-label="직원 메뉴">
    <a class="jb-side__brand" href="../index.html"><span class="jb-wordmark"><span class="jb-wordmark__script" aria-hidden="true">Jebi</span><span class="jb-wordmark__name">제비항공</span></span><span class="jb-side__unit">운항본부 업무 화면</span></a>
    <div class="jb-side__cheat" aria-hidden="true"></div>
    <p class="jb-side__group" id="side-g1">오늘의 일</p>
    <ul class="jb-side__nav" aria-labelledby="side-g1">
      <li><a class="jb-side__link" href="dashboard.html" aria-current="page"><svg class="jb-icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="4" width="7" height="7"/><rect x="13" y="4" width="7" height="7"/><rect x="4" y="13" width="7" height="7"/><rect x="13" y="13" width="7" height="7"/></svg>운항 현황판</a></li>
      <li><a class="jb-side__link" href="inbox.html"><svg class="jb-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 13l2.5-8h11L20 13v6H4z"/><path d="M4 13h5l1 2h4l1-2h5"/></svg>고객센터 문의함<span class="jb-side__count" aria-label="새 문의 12건">12</span></a></li>
      <li><a class="jb-side__link" href="kanban.html"><svg class="jb-icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="4" width="16" height="16"/><path d="M9.5 4v16M14.5 4v16"/></svg>캠페인 보드<span class="jb-side__count jb-side__count--muted" aria-label="카드 14장">14</span></a></li>
    </ul>
    <p class="jb-side__group" id="side-g2">승객 화면</p>
    <ul class="jb-side__nav" aria-labelledby="side-g2">
      <li><a class="jb-side__link" href="../index.html"><svg class="jb-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h6a2 2 0 0 1 2 2v12a2 2 0 0 0-2-2H4z"/><path d="M20 5h-6a2 2 0 0 0-2 2v12a2 2 0 0 1 2-2h6z"/></svg>운항 안내 브로셔</a></li>
      <li><a class="jb-side__link" href="pricing.html"><svg class="jb-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16v3a2 2 0 0 0 0 4v3H4v-3a2 2 0 0 0 0-4z"/><path d="M14 7v10" stroke-dasharray="2 2"/></svg>운임표</a></li>
      <li><a class="jb-side__link" href="product.html"><svg class="jb-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 9h14l-1 11H6z"/><path d="M9 9V7a3 3 0 0 1 6 0v2"/></svg>숄더백</a></li>
    </ul>
    <div class="jb-side__foot">
      <p class="jb-side__clock"><span class="jb-side__date">2026년 10월 12일 (월)</span><span class="jb-side__time">기준 시각 <strong>10:40</strong></span></p>
      <div class="jb-side__user"><span class="jb-avatar" aria-hidden="true">한</span><span><span class="jb-side__name">한지우</span><span class="jb-side__role">수익관리팀 과장</span></span></div>
    </div>
  </aside>
  <div class="jb-staff__scrim"></div>
  <div class="jb-staff__main">
    <header class="jb-topbar">
      <button type="button" class="jb-nav__icon-btn jb-topbar__menu-btn" data-side-toggle aria-controls="jb-side" aria-expanded="false" aria-label="직원 메뉴 열기"><svg class="jb-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h10"/></svg></button>
      <h1 class="jb-topbar__title">운항 현황판</h1>
      <span class="jb-topbar__meta">10월 12일 (월) 10:40 기준 · 24편</span>
      <div class="jb-topbar__tools">
        <button type="button" class="jb-nav__search" data-command-open aria-haspopup="dialog" aria-label="편명·예약번호·공항 찾기"><svg class="jb-icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/></svg><span class="jb-nav__search-text" aria-hidden="true">찾기</span><kbd class="jb-kbd" aria-hidden="true">⌘K</kbd></button>
        <button type="button" class="jb-nav__icon-btn" data-theme-toggle aria-label="밤 화면" aria-pressed="false"><svg class="jb-icon jb-theme-icon--sun" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4.5"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"/></svg><svg class="jb-icon jb-theme-icon--moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M19.5 14.5A8 8 0 0 1 9.5 4.5a8 8 0 1 0 10 10z"/></svg></button>
      </div>
    </header>
    <!-- (선택) 출발 안내 마키: 4절 marquee를 topbar 바로 아래에 -->
    <main id="main" class="jb-staff__content">
      <!-- 장면 -->
    </main>
  </div>
</div>

<!-- 1-B의 <div class="jb-command" id="jb-command" hidden> … </div> 블록을 그대로 -->

<script src="../app.js"></script>
</body>
```
- 아바타 색 변형: `jb-avatar`(청록, 기본) · `jb-avatar--coral` · `jb-avatar--sun` · `jb-avatar--avocado`.
- inbox처럼 본문을 화면 높이에 맞춰 3열로 쓰는 장면은 `jb-staff__content`의 패딩을 장면 CSS에서만 조정한다.
- 본문 윗 패딩은 토큰 `--staff-pad-top`(데스크톱 28px · 720 이하 20px)이다. 풀블리드 머리 지면은 `margin-top: calc(var(--staff-pad-top) * -1)`로 붙인다(숫자를 직접 쓰지 말 것).

---

## 3. 지면·시그니처 프리미티브 (base.css)

### 지면(풀블리드 섹션) — 판 4종 + 표지
```html
<section class="jb-sheet jb-sheet--a jb-sheet--teal" aria-labelledby="p01-title">
  <p class="jb-folio"><span>P. 01</span> — <span class="jb-folio__name">표지</span></p>
  …
</section>
```
| 판 | 클래스 | 여백(데스크톱/모바일) | 용도 |
|---|---|---|---|
| A 색면 광고판 | `jb-sheet--a` | 120 / 72 | 표지·글자 견본·엽서·뒤표지 |
| B 광고 본문판 | `jb-sheet--b` | 96·72 / 56·48 | 헤드라인 + 작은 글씨 3단 + 스타버스트 |
| C 3단 접지판 | `jb-sheet--c` + `.jb-fold` | 64 / 40 | 4/4/4, 점선 접지선 |
| D 안전 안내 카드판 | `jb-sheet--d` + `.jb-safety` | 88 / 56 | 2×3 번호 칸 |
| 표지 | `jb-sheet--cover`(A와 함께) | `min-height: max(720px,100svh)` | 한 페이지 1회 |

색: `--paper`(용지) `--raised` `--sunk` `--teal` `--coral` `--night` `--deep` `--sea`(시폼) `--salmon`(연어). 색면 지면 안에서는 `--fg`·`--line`이 그 면용으로 바뀌고, 카드·입력·오버레이는 자동으로 용지 글자색으로 돌아온다(`.jb-paper-scope` 규칙). 다크에서 `--sea`·`--salmon`은 짙은 청록·산호 패널로 바뀐다.
- 같은 판을 연속 두 번 쓰지 않는다. 섹션 머리는 「라벨 → 제목 → 부제」가 아니라 모서리 `jb-folio` + 카피 헤드라인.
- `jb-folio--left`: 쪽 번호를 왼쪽 위에.

### 12단 그리드
```html
<div class="jb-grid jb-grid--center">
  <div class="jb-span-6">…카피(1–6단)…</div>
  <div class="jb-span-6">…일러스트(7–12단)…</div>
</div>
<div class="jb-grid">
  <div class="jb-span-8">…헤드라인…</div>
  <div class="jb-span-3 jb-start-10">…스타버스트·쿠폰…</div>
</div>
```
`jb-span-{3,4,5,6,7,8,9,12}`는 폭, `jb-start-{1,5,6,7,8,9,10}`은 시작 단. 둘을 같이 써도 된다. `jb-md-12`·`jb-md-6`은 1024 이하 재배치. 720 이하에서는 모든 칸이 1단으로 쌓인다. 정렬: `jb-grid--center|--end|--stretch`. 흐름 유틸 `jb-stack`(세로, `--stack`), `jb-cluster`(가로 줄바꿈), `jb-split`(양끝).

### 작은 글씨 3단 · 3단 접지 · 안전 안내 카드
```html
<div class="jb-fine">
  <div><h4>꼬리색은 기체에만</h4><p>산호·해바라기·청록·아보카도는 기체 네 대의 꼬리 색입니다.</p></div>
  <div><h4>해바라기 판 위에는 잉크만</h4><p>…</p></div>
  <div><h4>밤 장면</h4><p>…</p></div>
</div>

<div class="jb-fold">
  <div class="jb-fold__panel"><h3 class="jb-fold__title">누르는 것</h3>…</div>
  <div class="jb-fold__panel"><h3 class="jb-fold__title">적는 것</h3>…</div>
  <div class="jb-fold__panel"><h3 class="jb-fold__title">알리는 것</h3>…</div>
</div>

<section class="jb-safety" aria-label="좌석 주머니 안전 안내">
  <div class="jb-safety__cell">
    <div class="jb-safety__head"><span class="jb-safety__no">1</span><h3 class="jb-safety__title">모달</h3></div>
    …정적 견본… <button type="button" class="jb-btn jb-btn--sm jb-btn--ghost" data-modal-open="m-change">직접 열어 보기</button>
  </div>
  … 6칸 …
</section>
```

### 시그니처 ① 치트라인
```html
<span class="jb-cheat" aria-hidden="true"></span>          <!-- cheat-m 직선 3줄 (24px) -->
<span class="jb-cheat jb-cheat--s" aria-hidden="true"></span> <!-- cheat-s (13px) -->
<span class="jb-cheat jb-cheat--xl" aria-hidden="true"></span><!-- cheat-xl (40px) -->
<span class="jb-cheat jb-cheat--v" aria-hidden="true"></span> <!-- 세로 cheat-s -->

<!-- 휘어 오르는 치트라인: 지면 전환용, 한 페이지 최대 2회. data-draw면 화면 진입 시 한 번 그려진다 -->
<div class="jb-cheatline" data-draw aria-hidden="true"><span class="jb-cheatline__run"></span><svg class="jb-cheatline__end" viewBox="0 0 180 160"><path pathLength="1" d="M0 125H20A125 125 0 0 0 145 0"/><path pathLength="1" d="M0 140H20A140 140 0 0 0 160 0"/><path pathLength="1" d="M0 155H20A155 155 0 0 0 175 0"/></svg></div>
```
변형: `jb-cheatline--m`(0.6배), `jb-cheatline--flip`(좌우 반전). 컴포넌트 안의 치트라인(탭·메뉴·카드·모달·토스트·표 머리)은 각 컴포넌트가 이미 그린다.

### 시그니처 ② 스타버스트 플래시 (한 뷰포트 최대 2개)
```html
<a class="jb-starburst" href="pages/pricing.html"><span class="jb-starburst__top">편도</span><span class="jb-starburst__price">₩39,000</span><span class="jb-starburst__bottom">부터</span></a>
<span class="jb-starburst jb-starburst--m"><span class="jb-starburst__big">4대</span></span>
<span class="jb-starburst jb-starburst--s" aria-label="지연"><span class="jb-starburst__big">!</span></span>
```
크기 168(기본, 모바일 132) · `--m` 96 · `--s` 44. `jb-starburst--coral`은 산호 면(지연 표시 등). 링크·버튼이면 hover/focus에 +12° 회전. 가운데 정렬은 여기와 404 숫자에만 허용.

### 보조 모티프
```html
<span class="jb-tailchip jb-tailchip--coral" aria-hidden="true"></span>산호호   <!-- --coral --sun --teal --avocado, --lg -->
<div class="jb-window"><svg viewBox="0 0 200 250" preserveAspectRatio="xMidYMid slice" role="img" aria-label="한라산과 해">…</svg></div>
<span class="jb-avatar jb-avatar--coral" aria-hidden="true">장</span>         <!-- --lg 56×70 -->
<div class="jb-coupon"><span class="jb-coupon__cut" aria-hidden="true">(가위 아이콘)</span><p class="jb-label-ko">가을바람 특가</p><p class="jb-coupon__title">10.13(화) 10:00 오픈</p><p class="jb-small">김포–제주 편도 ₩19,900부터 · 600석</p></div>
```
- 꼬리날개 칩은 **기체 4대를 가리킬 때만** 쓴다(산호호·해바라기호·청록호·아보카도호).
- `jb-coupon`은 기본 -8° 기울기, `jb-coupon--flat`은 0°. 폭 최대 300px이므로 3단 이상 칸에 둔다.
- 판 어긋남 `jb-misreg`(산호 뒤판) · `jb-misreg--plate`(청록 뒤판)은 **평면 일러스트 SVG에만** 쓴다. UI 컴포넌트에 쓰지 않는다.

### 평면 일러스트 색판 (SVG 클래스)
SVG presentation attribute에 `var()`를 쓰지 않는다. 대신 클래스로 칠한다.
`jb-ill-sky` `jb-ill-sky-deep` `jb-ill-orb`(낮 해/밤 달) `jb-ill-cloud` `jb-ill-ground` `jb-ill-plate` `jb-ill-hull`(크림 동체) `jb-ill-window`(밤에 불 켜짐) `jb-ill-ink` `jb-ill-coral` `jb-ill-sun` `jb-ill-teal` `jb-ill-avocado` `jb-ill-salmon` `jb-ill-seafoam` `jb-ill-stroke`(선) `jb-ill-stripe-1|2|3`(치트라인 선, `stroke-width` 속성은 숫자로) `jb-ill-route`(점선 항로, currentColor) `jb-ill-prop`(프로펠러 잔상).
```html
<svg viewBox="0 0 200 250" role="img" aria-label="한라산과 해, 부메랑 구름">
  <rect class="jb-ill-sky" width="200" height="250"/>
  <circle class="jb-ill-orb" cx="142" cy="74" r="30"/>
  <path class="jb-ill-cloud" d="M14 104 Q40 84 70 98 Q86 88 104 100 Q76 112 40 110 Q22 112 14 104 Z"/>
  <g class="jb-misreg--plate"><path class="jb-ill-ground" d="M-10 250 L86 140 Q100 128 114 140 L214 250 Z"/></g>
  <path class="jb-ill-hull" d="M86 140 Q100 128 114 140 L106 148 L100 142 L94 149 Z"/>
  <rect class="jb-ill-sky-deep" y="214" width="200" height="36"/>
</svg>
```

### 글자
| 클래스 | 쓰임 |
|---|---|
| `jb-cover` | 표지 헤드라인(한 화면 1회). 줄은 `<br>`로 직접 끊는다(한 줄 8~14자) |
| `jb-display` `jb-h1` `jb-h2` `jb-h3` | 펼침면 헤드라인 · 페이지 제목 · 블록 제목 · 카드 제목 |
| `jb-lead` `jb-small` `jb-muted` | 광고 리드 · 작은 글씨 · 보조색 |
| `jb-micro` | **라틴 대문자 라벨만**(`GMP → CJU`, `FARE`). 한글 금지 |
| `jb-label-ko` | 한글 라벨(13px, 자간 0) |
| `jb-mono` / `jb-ticket` | 편명·예약번호·시간·좌석·등록번호·금액 표 숫자 |
| `jb-price` | 큰 가격(League Spartan) |
| `jb-script` | 손글씨 콜아웃(Yeon Sung, -4°, 12자 이하, 한 화면 2회 이하). `jb-script--latin`은 Yellowtail |
| `jb-num` | 표 숫자 정렬(tabular-nums)만 |

### 이륙 진입 · 가로 스크롤 힌트
- `data-reveal`: 화면에 들어올 때 왼쪽 아래 → 오른쪽 위로 한 번 들어온다. `data-reveal-group`을 부모에 두면 자식이 40ms(10개 이상 30ms) 간격으로 차례로 들어온다.
- `jb-scroll-x`: 가로 스크롤 래퍼. app.js가 `data-scroll`로 양끝 페이드를 붙인다(표·탭·칸반은 자동).
- `jb-flyin`: 표지 비행기. 장면 CSS가 `offset-path`를 주면 6s 동안 한 번 날아 들어와 멈춘다.

---

## 4. 32개 컴포넌트

상태 표기: hover · focus-visible(2px 잉크 실선 + 바깥 3px 해바라기 링, 공통) · active · disabled · loading · error · selected. 표시가 없는 상태는 그 컴포넌트에 해당 없음.

### accordion — 운임 규정의 「작은 글씨」
```html
<div class="jb-accordion" data-accordion="single">
  <div class="jb-accordion__item">
    <h3 class="jb-accordion__heading"><button type="button" class="jb-accordion__trigger" id="acc-saver-t" aria-expanded="true" aria-controls="acc-saver"><span class="jb-accordion__label">세이버 운임은 환불되나요?</span><span class="jb-accordion__aside">₩39,000</span><span class="jb-accordion__icon" aria-hidden="true"></span></button></h3>
    <div class="jb-accordion__panel" id="acc-saver" role="region" aria-labelledby="acc-saver-t"><div class="jb-accordion__body"><p>세이버는 변경·환불이 되지 않아요. 출발 전에 취소하면 세금만 돌려 드립니다.</p></div></div>
  </div>
  <div class="jb-accordion__item">
    <h3 class="jb-accordion__heading"><button type="button" class="jb-accordion__trigger" id="acc-bag-t" aria-expanded="false" aria-controls="acc-bag"><span class="jb-accordion__label">기내에 들고 탈 수 있는 짐</span><span class="jb-accordion__icon" aria-hidden="true"></span></button></h3>
    <div class="jb-accordion__panel" id="acc-bag" role="region" aria-labelledby="acc-bag-t" hidden><div class="jb-accordion__body"><p>10kg 가방 1개와 개인 소지품 1개. 모든 운임 공통이에요.</p></div></div>
  </div>
</div>
```
- `data-accordion="single"`: 하나만 열림. 값 없이 `data-accordion`이면 여러 개 열림.
- 상태: 열림(`aria-expanded="true"` → 왼쪽 세로 치트라인 + 해바라기 원 안의 ×), hover(라벨 밑줄), disabled(`disabled` → 회색, 점선 원).

### alert — 왼쪽 6px 색띠 + 2px 잉크 테두리
```html
<div class="jb-alert jb-alert--warn" role="status">
  <svg class="jb-alert__icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.5L21.5 20h-19z"/><path d="M12 10v4.5"/><path d="M12 17.4v.1"/></svg>
  <div class="jb-alert__body">
    <p class="jb-alert__title"><span class="jb-mono">JB 307</span> 제주 측풍으로 25분 지연</p>
    <p class="jb-alert__text">김포 출발이 12:20에서 12:45로 바뀌었어요. 청록호 다음 편 JB 308 제주 출발도 14:35로 밀립니다.</p>
    <p class="jb-alert__meta">운항기획팀 서민재 · 10:32</p>
    <div class="jb-alert__actions"><button type="button" class="jb-btn jb-btn--sm jb-btn--ink">승객 문자 보내기</button></div>
  </div>
  <button type="button" class="jb-alert__close" data-dismiss aria-label="알림 닫기"><svg class="jb-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button>
</div>
```
톤: `--info`(청록, 종) · `--warn`(해바라기, 삼각) · `--danger`(산호, 원+!) · `--ok`(아보카도, 원+체크). 위험은 `role="alert"`, 나머지는 `role="status"`. 닫기 `[data-dismiss]`.

### badge — 알약 3종
```html
<span class="jb-badge jb-badge--status jb-badge--arrived">도착</span>
<span class="jb-badge jb-badge--status jb-badge--airborne">운항 중</span>
<span class="jb-badge jb-badge--status jb-badge--boarding">탑승 중</span>
<span class="jb-badge jb-badge--status jb-badge--checkin">수속 중</span>
<span class="jb-badge jb-badge--status jb-badge--delayed">지연 25분</span>
<span class="jb-badge jb-badge--status jb-badge--cancelled">결항</span>
<span class="jb-badge jb-badge--status jb-badge--scheduled">예정</span>

<span class="jb-badge jb-badge--coral">산호호</span>   <!-- 면: --coral --sun --teal --avocado --night -->
<span class="jb-badge jb-badge--outline">스탠더드</span> <!-- 테두리: --outline, 흐린 테두리: --soft -->
<span class="jb-badge jb-badge--flash" aria-label="새 문의 12건">12</span> <!-- 44px 스타버스트, 숫자만. --sm 32px -->
```
`jb-badge--lg`는 32px 높이. 상태 배지 문구는 위 7개(도착·운항 중·탑승 중·수속 중·지연·결항·예정)만 쓴다.

### breadcrumb — 부메랑 항로 점선 화살표
```html
<nav class="jb-breadcrumb" aria-label="현재 위치">
  <ol>
    <li><a href="dashboard.html">운항 관리</a></li>
    <li><a href="dashboard.html?month=10">10월</a></li>
    <li><span aria-current="page">오늘</span></li>
  </ol>
</nav>
```

### button — 가전 푸시 버튼
```html
<button type="button" class="jb-btn">가을바람 특가 예약</button>                  <!-- primary 산호 -->
<button type="button" class="jb-btn jb-btn--secondary">시간표 펼치기</button>     <!-- 청록 -->
<button type="button" class="jb-btn jb-btn--ink">탑승권 받기</button>             <!-- 밤하늘 -->
<button type="button" class="jb-btn jb-btn--sun">알림 신청</button>               <!-- 해바라기(잉크 글자) -->
<button type="button" class="jb-btn jb-btn--ok">회원카드 받기</button>            <!-- 아보카도 -->
<button type="button" class="jb-btn jb-btn--ghost">취소</button>                  <!-- 2px 테두리 -->
<button type="button" class="jb-btn jb-btn--danger">좌석 취소</button>            <!-- 산호 테두리 -->
<a class="jb-btn jb-btn--link" href="pricing.html">운임 규정 보기</a>

<button type="button" class="jb-btn jb-btn--sm">작게 44</button>
<button type="button" class="jb-btn jb-btn--lg">크게 60</button>
<button type="button" class="jb-btn jb-btn--block">전체 폭</button>
<button type="button" class="jb-btn jb-btn--secondary jb-btn--icon" aria-label="이전"><svg class="jb-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg></button>

<button type="button" class="jb-btn" disabled>매진</button>                       <!-- 점선 테두리 -->
<button type="button" class="jb-btn jb-btn--secondary" aria-busy="true"><span>결제 중</span></button> <!-- 프로펠러 로딩 -->
<button type="button" class="jb-btn jb-btn--secondary" data-busy-demo="1800" data-toast="ok" data-toast-title="좌석 7A를 잡았어요" data-toast-text="JB 309 · 10월 17일 (토) 14:30">좌석 잡기</button>
```
- 아이콘+글자: `<svg class="jb-icon">…</svg><span>좌석 잡기</span>`(로딩 때 글자를 숨기려면 `<span>`으로 감싼다).
- 상태: hover(턱 4px, 1px 떠오름) · active(턱이 접히며 2px 내려감) · focus-visible · disabled(점선) · loading(`aria-busy="true"`).
- 다크: 산호 버튼 글자는 잉크(#111A2B)로 바뀐다(토큰이 처리).
- 묶음: `<div class="jb-btn-row">…</div>`. 확정 버튼은 오른쪽.

### calendar — 월 달력
```html
<div class="jb-cal" data-calendar data-month="2026-10" data-min="2026-10" data-max="2026-12" data-today="2026-10-12"
     data-sale="2026-10-13,2026-10-14,2026-10-15,2026-10-16,2026-10-17,2026-10-18,2026-10-19" data-off="2026-10-26" data-selected="2026-10-17">
  <div class="jb-cal__head"><h3 class="jb-cal__title">2026년 10월</h3><div class="jb-cal__nav"><button type="button" data-cal-prev aria-label="이전 달"><svg class="jb-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg></button><button type="button" data-cal-next aria-label="다음 달"><svg class="jb-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg></button></div></div>
  <table class="jb-cal__grid"><thead><tr><th scope="col">일</th><th scope="col">월</th><th scope="col">화</th><th scope="col">수</th><th scope="col">목</th><th scope="col">금</th><th scope="col">토</th></tr></thead><tbody></tbody></table>
  <div class="jb-cal__legend"><span><i class="jb-cal__swatch jb-cal__swatch--sale"></i>가을바람 특가 예약</span><span><i class="jb-cal__swatch jb-cal__swatch--pick"></i>고른 날</span><span><i class="jb-cal__swatch jb-cal__swatch--off"></i>운항 없음</span></div>
  <p class="jb-cal__out">고른 날: <span data-cal-output>11월 7일 (토)</span></p>
</div>
```
- `tbody`는 app.js가 채운다(요일은 실제 달력). 특가일 해바라기 원, 운항 없는 날 해칭+취소선(`disabled`), 선택일 청록 면(`aria-pressed="true"`), 오늘 잉크 고리.
- 키보드: 날짜 위에서 ←→↑↓. 선택 시 `jb:date` 이벤트(`detail.date`).
- 가을바람 특가 탑승 기간은 11.01(일)~12.18(금)이다. `data-sale`에 그 날짜를 넣는다.

### card — 기본 · panel · window · ticket
```html
<article class="jb-card">
  <div class="jb-card__head"><h3 class="jb-card__title">1959 복각 기내 숄더백</h3><span class="jb-card__code">GD-261012-007</span></div>
  <div class="jb-card__body"><p>코튼 캔버스에 비닐 코팅. 34×26×12cm, 620g.</p></div>
  <div class="jb-card__foot"><span class="jb-card__price">₩48,000</span><span class="jb-badge jb-badge--outline">48,000깃털</span></div>
</article>

<!-- 꼬리색이 정해진 카드: 상단 띠가 그 한 색 -->
<article class="jb-card jb-card--teal">…</article>

<!-- panel: 꼬리색 색면 -->
<a class="jb-card jb-card--panel jb-card--teal" href="pricing.html"><div class="jb-card__head"><h3 class="jb-card__title">김포–제주</h3><span class="jb-card__code">GMP–CJU</span></div><div class="jb-card__body"><p>1시간 10분 · 하루 8왕복<br>세이버 편도 ₩39,000</p></div></a>

<!-- window: 비행기 창 일러스트 -->
<article class="jb-card jb-card--window jb-card--coral">
  <div class="jb-card__window"><div class="jb-window"><svg viewBox="0 0 200 250" preserveAspectRatio="xMidYMid slice" role="img" aria-label="한라산과 해">…</svg></div></div>
  <div class="jb-card__head"><h3 class="jb-card__title">산호호</h3><span class="jb-card__code">HL5301</span></div>
  <div class="jb-card__body"><p>오늘 김포–제주 3왕복</p></div>
</article>

<!-- ticket: 탑승권 (본권 | 절취 스텁) -->
<article class="jb-card jb-card--ticket" aria-label="오세린 님 탑승권">
  <div class="jb-card__main">
    <div class="jb-split"><p class="jb-card__meta">탑승권 · 스탠더드</p><span class="jb-badge jb-badge--coral">산호호</span></div>
    <div class="jb-card__route">
      <span class="jb-card__port"><span class="jb-card__port-code">GMP</span><span class="jb-card__port-city">김포 14:30</span></span>
      <svg class="jb-card__route-arc" viewBox="0 0 72 30" aria-hidden="true"><path d="M2 26 Q36 -6 70 22"/></svg>
      <span class="jb-card__port"><span class="jb-card__port-code">CJU</span><span class="jb-card__port-city">제주 15:40</span></span>
    </div>
    <dl class="jb-card__fields">
      <div><dt>편명</dt><dd>JB 309</dd></div><div><dt>날짜</dt><dd>10.17(토)</dd></div><div><dt>좌석</dt><dd>7A</dd></div>
      <div><dt>탑승구 마감</dt><dd>14:20</dd></div><div><dt>예약번호</dt><dd>R4TW8N</dd></div>
    </dl>
  </div>
  <div class="jb-card__stub">
    <div><p class="jb-card__meta">탑승 순번</p><p class="jb-card__seq">023</p></div>
    <p class="jb-card__meta"><span class="jb-mono">JB 309 · 7A</span></p>
    <svg class="jb-card__barcode" viewBox="0 0 120 44" preserveAspectRatio="none" aria-hidden="true"><rect x="0" width="3" height="44"/><rect x="6" width="1.5" height="44"/><rect x="10" width="4" height="44"/><rect x="17" width="1.5" height="44"/><rect x="21" width="3" height="44"/><rect x="27" width="1.5" height="44"/><rect x="31" width="5" height="44"/><rect x="39" width="2" height="44"/><rect x="44" width="1.5" height="44"/><rect x="48" width="4" height="44"/><rect x="55" width="2" height="44"/><rect x="60" width="3" height="44"/><rect x="66" width="1.5" height="44"/><rect x="70" width="5" height="44"/><rect x="78" width="1.5" height="44"/><rect x="82" width="3" height="44"/><rect x="88" width="2" height="44"/><rect x="93" width="4" height="44"/><rect x="100" width="1.5" height="44"/><rect x="104" width="3" height="44"/><rect x="110" width="2" height="44"/><rect x="115" width="5" height="44"/></svg>
  </div>
</article>
```
- 상태: `a.jb-card`/`.jb-card--link` hover(면 색 바뀜 + 제목 밑줄) · active · focus-visible · selected(`aria-selected="true"` 또는 `.is-selected`, 청록 테두리) · disabled(`aria-disabled="true"`, 점선).
- 탑승권 펀치 구멍 색은 바탕을 따른다. 용지 외 바탕 위에 둘 때는 장면 CSS에서 `--ticket-hole`을 그 바탕 토큰으로 준다. 600px 이하에서 스텁이 아래로 내려간다.
- 카드 안에 카드를 넣지 않는다.

### carousel — 행선지 엽서
```html
<div class="jb-carousel" data-carousel aria-roledescription="캐러셀" aria-label="행선지 엽서">
  <div class="jb-carousel__viewport"><ul class="jb-carousel__track">
    <li class="jb-carousel__slide" role="group" aria-roledescription="엽서" aria-label="1 / 4" data-title="제주">
      <div class="jb-window"><svg viewBox="0 0 200 250" preserveAspectRatio="xMidYMid slice" role="img" aria-label="한라산">…</svg></div>
      <h3 class="jb-carousel__title">제주</h3>
      <p class="jb-carousel__meta">김포에서 1시간 10분 · 하루 8왕복</p>
      <p class="jb-carousel__price">세이버 편도 <strong>₩39,000</strong></p>
    </li>
    <!-- 여수 55분·2왕복·₩45,000 / 울산 55분·1왕복·₩42,000 / 포항경주 50분·1왕복·₩42,000 -->
  </ul></div>
  <div class="jb-carousel__controls">
    <button type="button" class="jb-btn jb-btn--ghost jb-btn--icon" data-carousel-prev aria-label="이전 엽서"><svg class="jb-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg></button>
    <span class="jb-carousel__count" data-carousel-count>01 / 04</span>
    <button type="button" class="jb-btn jb-btn--ghost jb-btn--icon" data-carousel-next aria-label="다음 엽서"><svg class="jb-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg></button>
    <span class="jb-carousel__name" data-carousel-name></span>
    <p class="jb-carousel__live jb-sr-only" aria-live="polite"></p>
  </div>
</div>
```
한 화면 장수: 모바일 1 · 720+ 2 · 1100+ 3. `jb-carousel--duo`는 최대 2장(product 함께 보는 상품). 처음·끝에서 이전·다음이 비활성. ←→ 키, 스와이프.

### code — 인쇄소 작업 지시서
```html
<div class="jb-code">
  <div class="jb-code__head"><p class="jb-code__label">작업 지시 — 색판<span class="jb-code__file">tokens.css</span></p><button type="button" class="jb-btn jb-btn--sm jb-btn--ghost" data-copy><span data-copy-label>복사</span></button></div>
  <pre class="jb-code__pre"><code><span class="jb-code__line"><span class="tk-c">/* 해바라기 판 위에는 잉크만 */</span></span><span class="jb-code__line"><span class="tk-p">--tail-coral</span>: <span class="tk-v">#C63D22</span>;</span><span class="jb-code__line"><span class="tk-p">--on-sun</span>: <span class="tk-k">var</span>(<span class="tk-p">--c-ink-900</span>);</span></code></pre>
</div>
```
줄마다 `jb-code__line`(줄 번호 자동). 토큰 색 `.tk-c` 주석 · `.tk-p` 속성 · `.tk-v` 값 · `.tk-s` 문자열 · `.tk-k` 키워드. 복사 후 2초간 「복사했어요」 + 아보카도. 인라인: `<code class="jb-inline-code">`, 키: `<kbd class="jb-kbd">Esc</kbd>`.

### command — ⌘K 편명·예약번호·공항 찾기
실제 팔레트는 1절 셸에 이미 있다(페이지마다 하나, `id="jb-command"`). ⌘K/Ctrl+K 또는 `[data-command-open]`으로 연다.
정적 견본(index P.06)은 `jb-command--static`을 붙이고 **id를 셸과 다르게** 준다.
```html
<div class="jb-command jb-command--static"><div class="jb-command__box" role="search" aria-label="찾기 견본">
  <div class="jb-command__search"><svg class="jb-icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/></svg><input class="jb-command__input" type="text" value="JB 30" aria-label="찾을 내용"></div>
  <div class="jb-command__list"><div class="jb-command__group" aria-labelledby="demo-cg-1"><p class="jb-command__group-label" id="demo-cg-1">오늘 운항편</p>
    <div class="jb-command__item" data-keywords="JB305" data-toast="info" data-toast-title="JB 305 · 10:50 탑승 중"><span class="jb-tailchip jb-tailchip--coral"></span><span class="jb-command__title"><span class="jb-mono">JB 305</span> 김포 → 제주</span><span class="jb-command__meta">10:50 탑승 중</span></div>
  </div></div>
  <p class="jb-command__empty" hidden>찾는 편이 없어요.</p>
</div></div>
```
- 결과행: `data-href`(이동) 또는 `data-toast*`(알림). 검색어는 `data-keywords` + 글자에서 찾는다(공백 무시).
- 상태: 활성 행(`aria-selected="true"`, 시폼 면 + 왼쪽 치트라인) · hover · 결과 없음(`jb-command__empty`).
- ↑↓ 이동, Enter 실행, Esc 닫기. 입력은 `role="combobox"` + `aria-activedescendant`(app.js가 배선).

### drawer — 오른쪽 패널(모바일 아래 시트)
```html
<button type="button" class="jb-btn jb-btn--secondary" data-drawer-open="d-cabin">기내 판매 메뉴</button>

<div class="jb-drawer" id="d-cabin" hidden>
  <div class="jb-drawer__scrim"></div>
  <div class="jb-drawer__panel" role="dialog" aria-modal="true" aria-labelledby="d-cabin-t">
    <div class="jb-drawer__head"><h2 class="jb-drawer__title" id="d-cabin-t">기내 판매 메뉴<span class="jb-drawer__sub">JB 305 · 산호호</span></h2><button type="button" class="jb-drawer__close" data-close aria-label="닫기"><svg class="jb-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>
    <div class="jb-drawer__body">…</div>
    <div class="jb-drawer__foot"><span class="jb-mono">₩4,000</span><button type="button" class="jb-btn jb-btn--sm" data-close>담기</button></div>
  </div>
</div>
```
`jb-drawer--left`는 왼쪽(모바일 메뉴). 정적 견본은 `jb-drawer jb-drawer--static`(hidden 없이, `role="dialog"`만 두고 `aria-modal`은 뺀다). Esc·딤·`[data-close]` 닫기, 포커스 트랩, 닫으면 연 버튼으로 포커스 복귀.

### empty — 빈 하늘
```html
<div class="jb-empty">
  <svg class="jb-empty__art" viewBox="0 0 160 112" aria-hidden="true"><rect class="jb-empty__sky" x="0" y="0" width="160" height="112"/><path class="jb-empty__route" d="M12 92 Q80 20 148 70"/><path class="jb-empty__cloud" d="M34 66 Q58 44 86 58 Q102 48 120 60 Q94 74 62 72 Q42 74 34 66 Z"/><polygon class="jb-empty__star" points="128,14 131,22 139,20 134,27 140,33 132,33 130,41 126,34 118,37 122,30 116,24 124,23"/></svg>
  <div class="jb-empty__body">
    <p class="jb-empty__title">이 날은 띄울 비행기가 없어요</p>
    <p class="jb-empty__text">10월 26일 (월) 포항경주 노선은 정비로 쉽니다. 27일 (화) 11:10 편부터 다시 떠요.</p>
    <button type="button" class="jb-btn jb-btn--sm jb-btn--secondary">다른 날 보기</button>
  </div>
</div>
```
`jb-empty--compact`는 작은 칸용. 버튼은 1개만.

### form — 탑승권 기입란
```html
<form class="jb-paper-scope" data-validate data-toast="ok" data-toast-title="탑승객 정보를 저장했어요" novalidate>
  <div class="jb-form-grid">
    <div class="jb-field"><label class="jb-label" for="f-name">탑승객 이름<span class="jb-label__req" aria-hidden="true">*</span></label><input class="jb-input" id="f-name" required autocomplete="name" aria-describedby="f-name-help f-name-err"><p class="jb-help" id="f-name-help">신분증과 같은 이름으로 적어 주세요.</p><p class="jb-error" id="f-name-err"></p></div>
    <div class="jb-field"><label class="jb-label" for="f-birth">생년월일</label><input class="jb-input jb-input--mono" id="f-birth" inputmode="numeric" pattern="[0-9]{6}" data-error-pattern="숫자 6자리로 적어 주세요. 예: 920314" placeholder="YYMMDD" required aria-describedby="f-birth-err"><p class="jb-error" id="f-birth-err"></p></div>
    <div class="jb-field"><label class="jb-label" for="f-from">출발 공항</label><span class="jb-select-wrap"><select class="jb-select" id="f-from"><option>김포 GMP</option><option>제주 CJU</option><option>여수 RSU</option><option>울산 USN</option><option>포항경주 KPO</option></select></span></div>
    <div class="jb-field"><label class="jb-label" for="f-pnr">예약번호</label><input class="jb-input jb-input--mono" id="f-pnr" value="R4TW8N" readonly></div>
    <div class="jb-field jb-full"><label class="jb-label" for="f-memo">요청 사항<span class="jb-label__opt">선택</span></label><textarea class="jb-textarea" id="f-memo" placeholder="휠체어, 기내식 알레르기 등"></textarea></div>
  </div>

  <fieldset class="jb-fieldset"><legend class="jb-label">운임</legend>
    <label class="jb-option"><input class="jb-radio__input" type="radio" name="fare" value="saver" required><span class="jb-option__body"><span class="jb-option__title">세이버</span><span class="jb-option__meta">위탁 수하물 없음 · 변경 불가</span></span><span class="jb-option__price">₩39,000</span></label>
    <label class="jb-option"><input class="jb-radio__input" type="radio" name="fare" value="standard" checked><span class="jb-option__body"><span class="jb-option__title">스탠더드</span><span class="jb-option__meta">15kg · 변경 수수료 ₩10,000</span></span><span class="jb-option__price">₩59,000</span></label>
    <label class="jb-option"><input class="jb-radio__input" type="radio" name="fare" value="flex"><span class="jb-option__body"><span class="jb-option__title">플렉스</span><span class="jb-option__meta">20kg + 앞열 좌석 · 변경·환불 무료</span></span><span class="jb-option__price">₩89,000</span></label>
  </fieldset>

  <label class="jb-check"><input class="jb-check__input" type="checkbox"><span class="jb-check__text">위탁 수하물 15kg 추가<small>₩15,000</small></span></label>
  <label class="jb-radio"><input class="jb-radio__input" type="radio" name="seat" checked><span>창가</span></label>
  <label class="jb-switch"><input class="jb-switch__input" type="checkbox" role="switch" checked><span class="jb-switch__text">특가 알림<small>가을바람 특가 오픈 10분 전</small></span><span class="jb-switch__state">켜짐</span></label>
  <label class="jb-switch jb-switch--row"><input class="jb-switch__input" type="checkbox" role="switch"><span class="jb-switch__text">지연 알림</span><span class="jb-switch__state">꺼짐</span></label>

  <div class="jb-input-group"><span class="jb-input-group__addon">₩</span><input class="jb-input" inputmode="numeric" aria-label="쓸 깃털" value="18,420"></div>

  <div class="jb-form-actions"><button type="button" class="jb-btn jb-btn--ghost">취소</button><button class="jb-btn">저장</button></div>
</form>
```
- 상태: hover(아래선 청록) · focus(4면 테두리 + 해바라기 링) · error(`aria-invalid="true"` + `jb-error`, 산호 굵은 아래선) · disabled(점선 아래선) · readonly(우물 면) · 체크·라디오 checked/indeterminate · 운임 타일 선택(시폼 면).
- `form[data-validate]`: 제출 시 브라우저 검증 → 첫 오류로 포커스, 오류 문구를 `jb-error`에 쓴다(`data-error-required`, `data-error-pattern`으로 문구 지정). 통과하면 `jb:submit` 이벤트 + `data-toast*` 알림.
- 스위치 `jb-switch__state`는 켜짐/꺼짐 글자를 app.js가 바꾼다(`data-on`/`data-off`로 다른 문구). `data-reduce-motion-toggle`이 붙은 스위치는 화면 움직임을 끈다(설정 「움직임 줄이기」).
- 색면 지면 위에 폼을 둘 때는 `jb-paper-scope`로 감싸 용지 글자색으로 돌린다.

### kanban — 캠페인 보드
```html
<div class="jb-kanban" data-kanban aria-label="2027 봄 캠페인 카드 보드">
  <section class="jb-kanban__col" data-stage="idea" aria-labelledby="k-idea">
    <header class="jb-kanban__head"><h2 class="jb-kanban__title" id="k-idea">아이디어</h2><span class="jb-kanban__count">2</span></header>
    <ul class="jb-kanban__list" aria-labelledby="k-idea">
      <li class="jb-kanban__card">
        <div class="jb-kanban__top"><span class="jb-kanban__id">BR-121</span></div>
        <p class="jb-kanban__card-title">여수 밤바다 엽서 6종 세트</p>
        <div class="jb-kanban__meta"><span class="jb-kanban__who"><span class="jb-avatar jb-avatar--sun" aria-hidden="true">백</span>백승아</span><span class="jb-kanban__due">11.20</span></div>
      </li>
    </ul>
  </section>
  <!-- data-stage: idea(용지) · draft(연어) · review(해바라기) · queued(시폼) · live(청록) -->
</div>
```
- 마감 임박 `jb-kanban__due--soon`(산호). 잠긴 카드 `aria-disabled="true"`. 열 끝 추가 버튼은 목록의 마지막 `<li>`로 감싼다(`<ul>` 바로 아래 `<button>`은 HTML로 유효하지 않다): `<li class="jb-kanban__add"><button type="button" class="jb-kanban__add-btn">+ 카드 추가</button></li>`. app.js는 카드를 이 `li` 앞에 끼운다.
- 끌어 놓기 + 키보드(카드에서 Space/Enter 잡기 → ←→ 열 이동, ↑↓ 순서 → Space 놓기, Esc 취소). 개수는 app.js가 갱신하고 결과를 낭독한다.
- 상태: hover(청록 테두리) · 끄는 중(반투명) · 잡음(-2° + 해바라기 링) · 놓을 곳(시폼 + 청록 점선).

### list — 행 리스트
```html
<ul class="jb-list">
  <li><a class="jb-list__row" href="dashboard.html"><span class="jb-list__lead">10.12</span><span class="jb-list__main"><span class="jb-list__title">JB 307 제주 측풍 지연 안내</span><span class="jb-list__sub">운항기획팀 서민재</span></span><span class="jb-list__end"><span class="jb-badge jb-badge--status jb-badge--delayed">지연</span></span></a></li>
  <li><a class="jb-list__row" href="../index.html" aria-current="true"><span class="jb-list__lead">10.05</span><span class="jb-list__main"><span class="jb-list__title">2026 가을·겨울 운항 안내 발행</span><span class="jb-list__sub">브로셔 웹판 · 9쪽</span></span><span class="jb-list__end"><span class="jb-badge jb-badge--outline">공지</span></span></a></li>
  <li><div class="jb-list__row"><span class="jb-list__lead">10.13</span><span class="jb-list__main"><span class="jb-list__title">가을바람 특가 10:00 오픈</span><span class="jb-list__sub">600석 한정 · 편도 ₩19,900부터</span></span><span class="jb-list__end"><span class="jb-list__unread" role="img" aria-label="안 읽음"></span></span></div></li>
</ul>
```
행은 `a`·`button`(상호작용) 또는 `div`(정보). 상태: hover(우물 면) · 현재/선택(`aria-current="true"`·`aria-selected="true"`, 시폼 면 + 왼쪽 치트라인). `jb-list--compact`, `jb-list--plain`(위아래 굵은 선 없음). 480 이하에서 `lead`가 위로 올라간다.

### marquee — 출발 안내 띠
```html
<div class="jb-marquee" aria-label="오늘 출발 안내">
  <span class="jb-marquee__label"><svg class="jb-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5c.9 0 1.5.8 1.5 1.8V9l7 4v2l-7-2v4.5l2.2 1.7V21L12 20l-3.7 1v-1.8l2.2-1.7V13l-7 2v-2l7-4V4.3c0-1 .6-1.8 1.5-1.8z"/></svg>출발 안내</span>
  <div class="jb-marquee__viewport"><ul class="jb-marquee__track">
    <li class="jb-marquee__item"><svg class="jb-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5c.9 0 1.5.8 1.5 1.8V9l7 4v2l-7-2v4.5l2.2 1.7V21L12 20l-3.7 1v-1.8l2.2-1.7V13l-7 2v-2l7-4V4.3c0-1 .6-1.8 1.5-1.8z"/></svg>JB 305 <span class="jb-marquee__ko">제주</span> 10:50 <strong class="jb-marquee__ko">탑승 중</strong></li>
    <li class="jb-marquee__item jb-marquee__item--alert">…JB 307 <span class="jb-marquee__ko">제주</span> 12:20 → 12:45 <strong class="jb-marquee__ko">지연</strong></li>
  </ul></div>
  <button type="button" class="jb-marquee__toggle" data-marquee-toggle aria-label="출발 안내 멈추기"><svg class="jb-icon jb-icon--pause" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6v12M15 6v12"/></svg><svg class="jb-icon jb-icon--play" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l10.5-6.5z"/></svg></button>
</div>
```
항목은 한 벌만 쓴다(app.js가 두 번째 벌을 `aria-hidden`으로 복제). 한글은 `jb-marquee__ko`로 감싼다(모노 자간을 한글에 쓰지 않기 위해). hover·focus 시 정지, 정지 버튼, 움직임 줄이기에서는 정지 목록.

### menu — 드롭다운
```html
<button type="button" class="jb-btn jb-btn--ghost" data-menu-trigger="menu-seat" aria-controls="menu-seat">좌석 옵션</button>
<div class="jb-menu" id="menu-seat" role="menu" aria-label="좌석 옵션" hidden>
  <p class="jb-menu__label">JB 309 · 7A</p>
  <button type="button" class="jb-menu__item" role="menuitem">창가로 변경<span class="jb-menu__hint">7A</span></button>
  <button type="button" class="jb-menu__item" role="menuitem">앞열 업그레이드<span class="jb-menu__hint">플렉스 ₩89,000</span></button>
  <button type="button" class="jb-menu__item" role="menuitem" aria-disabled="true">비상구 좌석 (만석)</button>
  <hr class="jb-menu__sep">
  <button type="button" class="jb-menu__item jb-menu__item--danger" role="menuitem">좌석 취소</button>
</div>
```
- 트리거 ↓/↑로 열고 첫/끝 항목에 포커스. ↑↓ Home End 이동, Esc·바깥 클릭 닫기, 고르면 닫힘(`data-keep-open`이면 유지). 오른쪽 끝 정렬은 패널에 `data-align="end"`.
- 체크형: `role="menuitemradio" aria-checked="true"`.
- 상태: hover/focus/`is-active`(왼쪽 치트라인 + 면) · disabled · 위험(산호).
- 정적 견본: `class="jb-menu jb-menu--static"`(hidden 없이).

### modal — 확인 대화상자
```html
<button type="button" class="jb-btn" data-modal-open="m-change">예약 변경</button>
<div class="jb-modal" id="m-change" hidden>
  <div class="jb-modal__scrim"></div>
  <div class="jb-modal__box" role="dialog" aria-modal="true" aria-labelledby="m-change-t">
    <div class="jb-modal__head"><h2 class="jb-modal__title" id="m-change-t">예약을 변경할까요?</h2><button type="button" class="jb-modal__close" data-close aria-label="닫기"><svg class="jb-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>
    <div class="jb-modal__body"><p>R4TW8N · JB 309 · 10월 17일 (토) 14:30. 스탠더드 운임은 변경 수수료 <strong>₩10,000</strong>이 붙어요.</p></div>
    <div class="jb-modal__foot"><button type="button" class="jb-btn jb-btn--ghost" data-close>그대로 두기</button><button type="button" class="jb-btn" data-close data-toast="ok" data-toast-title="변경 요청을 받았어요">변경하기</button></div>
  </div>
</div>
```
`jb-modal__box--wide`는 760px. 탈퇴 확인처럼 위험한 확정은 `jb-btn--danger`. 정적 견본은 `jb-modal jb-modal--static`(scrim 없이, 상자에 `aria-modal` 빼기). 480 이하에서 버튼이 전체 폭으로 세로로 쌓인다(확정이 위).

### motion — 「활주와 이륙」 시연
```html
<div class="jb-motion">
  <div class="jb-motion__cell"><div class="jb-motion__stage"><div class="jb-takeoff is-playing" id="mo-takeoff"><span></span><span></span><span></span></div></div><p class="jb-motion__name">이륙 진입</p><p class="jb-motion__spec">420ms · translate(-24px, 10px)</p><button type="button" class="jb-btn jb-btn--sm jb-btn--ghost" data-motion-play="mo-takeoff">다시 재생</button></div>
  <div class="jb-motion__cell"><div class="jb-motion__stage"><div class="jb-cheatline jb-cheatline--m" data-draw id="mo-cheat" aria-hidden="true"><span class="jb-cheatline__run"></span><svg class="jb-cheatline__end" viewBox="0 0 180 160"><path pathLength="1" d="M0 125H20A125 125 0 0 0 145 0"/><path pathLength="1" d="M0 140H20A140 140 0 0 0 160 0"/><path pathLength="1" d="M0 155H20A155 155 0 0 0 175 0"/></svg></div></div><p class="jb-motion__name">치트라인 그리기</p><p class="jb-motion__spec">900ms · stroke-dashoffset</p><button type="button" class="jb-btn jb-btn--sm jb-btn--ghost" data-motion-play="mo-cheat">다시 재생</button></div>
  <div class="jb-motion__cell"><div class="jb-motion__stage"><span class="jb-starburst jb-starburst--m jb-flash-demo is-playing" id="mo-flash"><span class="jb-starburst__top">편도</span><span class="jb-starburst__price">₩19,900</span></span></div><p class="jb-motion__name">스타버스트 회전</p><p class="jb-motion__spec">320ms · cubic-bezier(.34,1.56,.64,1)</p><button type="button" class="jb-btn jb-btn--sm jb-btn--ghost" data-motion-play="mo-flash">다시 재생</button></div>
  <div class="jb-motion__cell"><div class="jb-motion__stage"><!-- spinner --lg --></div><p class="jb-motion__name">프로펠러</p><p class="jb-motion__spec">900ms · linear</p></div>
</div>
```
`data-motion-play`에 대상 id(공백으로 여러 개). 색면 지면 위에 두어도 칸은 용지 면으로 돌아온다.

### navbar — 승객 셸 상단
1절의 `header.jb-nav` 그대로. 하단 cheat-m은 CSS가 그린다. 링크 현재 표시 = 밤하늘 알약(`aria-current="page"`). hover = 우물 면. 테마 토글은 해/달 아이콘이 바뀌고 `aria-pressed`가 갱신된다.

### pagination — 알약 숫자
```html
<nav class="jb-pager" aria-label="운항표 쪽">
  <ul>
    <li><span class="jb-pager__link jb-pager__link--step" aria-disabled="true"><svg class="jb-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg><span class="jb-sr-only">이전 쪽</span></span></li>
    <li><a class="jb-pager__link" href="dashboard.html?page=1" aria-current="page">1</a></li>
    <li><a class="jb-pager__link" href="dashboard.html?page=2">2</a></li>
    <li><a class="jb-pager__link jb-pager__link--step" href="dashboard.html?page=2"><svg class="jb-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg><span class="jb-sr-only">다음 쪽</span></a></li>
  </ul>
</nav>
```
현재 쪽 = 밤하늘 면 + 턱. 비활성 = 점선(링크 대신 `span`). 생략 `<li><span class="jb-pager__gap" aria-hidden="true">…</span></li>`. 쪽 정보 `<span class="jb-pager__info">24편 중 1–12</span>`.

### popover — 말풍선
```html
<button type="button" class="jb-btn jb-btn--ghost" data-popover-trigger="pop-bag" aria-controls="pop-bag">기내 반입 10kg</button>
<div class="jb-popover" id="pop-bag" role="dialog" aria-labelledby="pop-bag-t" hidden>
  <div class="jb-popover__head"><p class="jb-popover__title" id="pop-bag-t">기내 반입 수하물</p><button type="button" class="jb-popover__close" data-close aria-label="닫기"><svg class="jb-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>
  <div class="jb-popover__body"><p>모든 운임 공통이에요.</p><dl><dt>가방</dt><dd>10kg × 1</dd><dt>소지품</dt><dd>1개</dd></dl></div>
</div>
```
app.js가 트리거 아래(공간이 없으면 위)에 놓고 꼬리를 트리거에 맞춘다. 바깥 클릭·Esc 닫기. 정적 견본은 `jb-popover jb-popover--static`, `role="note"`.

### progress — 치트라인 줄무늬 막대 · 비행 경과
```html
<div class="jb-progress">
  <div class="jb-progress__head"><span>오늘 좌석 판매</span><span class="jb-progress__value">1,437 / 1,680석 · 85.5%</span></div>
  <div class="jb-progress__bar" role="progressbar" aria-valuenow="85.5" aria-valuemin="0" aria-valuemax="100" aria-label="오늘 좌석 판매율">
    <span class="jb-progress__track"><span class="jb-progress__fill"></span></span>
    <svg class="jb-progress__plane" viewBox="0 0 24 24" aria-hidden="true"><path class="jb-plane-body" transform="rotate(90 12 12)" d="M12 2.5c.9 0 1.5.8 1.5 1.8V9l7 4v2l-7-2v4.5l2.2 1.7V21L12 20l-3.7 1v-1.8l2.2-1.7V13l-7 2v-2l7-4V4.3c0-1 .6-1.8 1.5-1.8z"/></svg>
  </div>
</div>

<!-- 작은 막대(청록 단색, 비행기 없음) -->
<div class="jb-progress jb-progress--sm">…aria-valuenow="23" aria-valuemax="40"… (성층권까지 23 / 40회)</div>

<!-- 비행 경과: 부메랑 항로 -->
<div class="jb-progress jb-progress--route">
  <p class="jb-progress__head"><span>JB 304 비행 경과</span><span class="jb-progress__value">14%</span></p>
  <svg class="jb-progress__route" viewBox="0 0 400 110" role="progressbar" aria-valuenow="14" aria-valuemin="0" aria-valuemax="100" aria-label="JB 304 제주에서 김포까지 비행 경과"><path class="jb-progress__route-base" pathLength="100" d="M20 92 Q200 -18 380 92"/><path class="jb-progress__route-done" pathLength="100" d="M20 92 Q200 -18 380 92"/><circle class="jb-progress__route-port" cx="20" cy="92" r="7"/><circle class="jb-progress__route-port" cx="380" cy="92" r="7"/><g class="jb-progress__route-plane"><path class="jb-plane-body" transform="translate(-12 -12) rotate(90 12 12)" d="M12 2.5c.9 0 1.5.8 1.5 1.8V9l7 4v2l-7-2v4.5l2.2 1.7V21L12 20l-3.7 1v-1.8l2.2-1.7V13l-7 2v-2l7-4V4.3c0-1 .6-1.8 1.5-1.8z"/></g></svg>
  <div class="jb-progress__ports"><span class="jb-progress__port"><span class="jb-progress__code">CJU</span><span class="jb-progress__city">제주 10:30</span></span><span class="jb-progress__port"><span class="jb-progress__code">GMP</span><span class="jb-progress__city">김포 11:40 도착 예정</span></span></div>
</div>
```
값은 `aria-valuenow`만 쓰면 app.js가 채움 폭을 맞춘다(`JB.setProgress(el, 값)`으로 갱신). 불확정: `.jb-progress__bar`에 `data-indeterminate`(aria-valuenow 생략).

### sidebar — 직원 셸
2절 `aside.jb-side` 그대로. 활성 항목 = 왼쪽 세로 cheat-s + 크림 8% 면 + 해바라기 아이콘. 카운트 `jb-side__count`(해바라기) / `--muted`. index에서 축소 견본으로 보일 때는 `<aside class="jb-side jb-side--static">`(id 없이, `jb-side__foot` 포함 가능). 1024 이하 오프캔버스는 셸의 `.jb-staff__scrim`이 있어야 한다.

### skeleton — 색판 스윕
```html
<div class="jb-skel-group" aria-busy="true" aria-label="운항표 불러오는 중">
  <span class="jb-skel jb-skel--title"></span>
  <div class="jb-skel-row"><span class="jb-skel jb-skel--avatar"></span><span class="jb-skel jb-skel--line"></span></div>
  <span class="jb-skel jb-skel--line jb-skel--short"></span>
  <span class="jb-skel jb-skel--block"></span>
  <span class="jb-skel jb-skel--pill"></span>
</div>
```

### spinner — 3엽 프로펠러
```html
<span class="jb-spinner jb-spinner--labeled" role="status"><svg class="jb-spinner__prop" viewBox="0 0 48 48" aria-hidden="true"><g class="jb-spinner__blades"><ellipse cx="24" cy="12" rx="5" ry="11"/><ellipse cx="24" cy="12" rx="5" ry="11" transform="rotate(120 24 24)"/><ellipse cx="24" cy="12" rx="5" ry="11" transform="rotate(240 24 24)"/></g><circle class="jb-spinner__hub" cx="24" cy="24" r="6"/></svg><span class="jb-spinner__label">좌석 배치도를 불러오는 중</span></span>
```
`--labeled`가 없으면 글자는 화면에서 숨고 낭독만 된다(움직임 줄이기에서는 글자가 보인다). 크기 `--sm` 20 · 기본 32 · `--lg` 56.

### steps — 예약 4단계
```html
<ol class="jb-steps" aria-label="예약 단계">
  <li class="jb-steps__item jb-steps__item--done"><span class="jb-steps__dot"><svg class="jb-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></span><span class="jb-steps__label">여정</span><span class="jb-steps__sub">10.17(토) 김포 → 제주</span></li>
  <li class="jb-steps__item jb-steps__item--done"><span class="jb-steps__dot"><svg class="jb-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></span><span class="jb-steps__label">좌석</span><span class="jb-steps__sub">7A 창가</span></li>
  <li class="jb-steps__item" aria-current="step"><span class="jb-steps__dot"><svg class="jb-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5c.9 0 1.5.8 1.5 1.8V9l7 4v2l-7-2v4.5l2.2 1.7V21L12 20l-3.7 1v-1.8l2.2-1.7V13l-7 2v-2l7-4V4.3c0-1 .6-1.8 1.5-1.8z"/></svg></span><span class="jb-steps__label">결제</span><span class="jb-steps__sub">스탠더드 ₩59,000</span></li>
  <li class="jb-steps__item"><span class="jb-steps__dot">4</span><span class="jb-steps__label">탑승권</span><span class="jb-steps__sub">탑승구 마감 14:20</span></li>
</ol>
```
단계 수가 3·5이면 `jb-steps--3`·`jb-steps--5`. app.js가 단계를 넘기는 동적 단계는 점 안에 `<span class="jb-steps__no">1</span><svg class="jb-icon jb-steps__ok">(체크)</svg>`를 함께 넣으면 완료 시 steps.css가 체크로 바꿔 준다. 완료 = 청록 면 체크 + 실선 항로, 현재 = 해바라기 원 + 비행기, 예정 = 점선 원 + 점선 항로.
가입 흐름처럼 패널을 넘기는 경우: 패널 묶음에 `data-stepper id="join"`, 패널마다 `data-step`(첫 패널 외 `hidden`), 버튼 `data-step-next`/`data-step-prev`, 단계 표시에 `data-steps-for="join"`. 다음으로 갈 때 그 패널 입력을 검증한다.

### table — 운항표
```html
<div class="jb-table-wrap">
  <table class="jb-table" data-table-select data-count-target="sel-count">
    <caption class="jb-sr-only">2026년 10월 12일 (월) 운항표</caption>
    <thead><tr>
      <th scope="col" class="jb-table__check"><label class="jb-check"><input class="jb-check__input" type="checkbox" aria-label="모두 고르기"></label></th>
      <th scope="col">편명</th><th scope="col">구간</th>
      <th scope="col" class="jb-table__num" aria-sort="ascending"><button type="button" class="jb-table__sort">출발<svg class="jb-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V5M7 10l5-5 5 5"/></svg></button></th>
      <th scope="col" class="jb-table__num" aria-sort="none"><button type="button" class="jb-table__sort">도착<svg class="jb-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V5M7 10l5-5 5 5"/></svg></button></th>
      <th scope="col">기체</th><th scope="col">10:40 기준</th>
    </tr></thead>
    <tbody>
      <tr><td class="jb-table__check"><label class="jb-check"><input class="jb-check__input" type="checkbox" aria-label="JB 301 고르기"></label></td><td class="jb-table__flight">JB 301</td><td class="jb-table__route">김포 → 제주</td><td class="jb-table__num" data-sort="07:10">07:10</td><td class="jb-table__num">08:20</td><td><span class="jb-table__plane"><span class="jb-tailchip jb-tailchip--coral"></span>산호호</span></td><td><span class="jb-badge jb-badge--status jb-badge--arrived">도착</span></td></tr>
      <tr><td class="jb-table__check">…</td><td class="jb-table__flight">JB 307</td><td class="jb-table__route">김포 → 제주</td><td class="jb-table__num" data-sort="12:45"><span class="jb-table__was">12:20</span><span class="jb-table__now">12:45</span></td><td class="jb-table__num">13:55</td><td><span class="jb-table__plane"><span class="jb-tailchip jb-tailchip--teal"></span>청록호</span></td><td><span class="jb-badge jb-badge--status jb-badge--delayed">지연 25분</span></td></tr>
    </tbody>
  </table>
</div>
<div class="jb-table-foot"><p class="jb-table-note"><span id="sel-count">0편 선택</span> · 24편 중 12편 · 10:40 기준</p><!-- pagination --></div>
```
- 머리 = 밤하늘 면 + 아래 cheat-s. 숫자 열 `jb-table__num`(오른쪽 정렬, 모노). 한글이 섞인 숫자 칸(「1시간 10분」)은 `jb-table__num jb-table__num--ko`(한글 UI 글꼴). 본문 행 머리 `<th scope="row">`도 table.css가 칠한다. 정렬 버튼은 터치 타깃 44px. 정렬은 `th[aria-sort] > button.jb-table__sort`(클릭으로 오름/내림 전환, `data-sort`로 정렬 값 지정).
- 행 상태: hover · 선택(`aria-selected="true"`, 체크박스로 자동). 선택이 없으면 `data-table-select`와 체크 열을 빼면 된다.
- 최소 폭 680px(`--table-min`을 장면 CSS에서 바꿀 수 있다). 좁은 화면에서는 래퍼가 가로 스크롤 + 오른쪽 페이드. `jb-table--dense`는 촘촘한 행. 합계 행은 `tfoot`.

### tabs — 밑줄형 텍스트 탭
```html
<div class="jb-tabs" data-tabs>
  <div class="jb-tabs__list" role="tablist" aria-label="운항표 보기">
    <button type="button" class="jb-tabs__tab" role="tab" id="tab-dep" aria-controls="pn-dep" aria-selected="true">출발 <span class="jb-tabs__count">12</span></button>
    <button type="button" class="jb-tabs__tab" role="tab" id="tab-arr" aria-controls="pn-arr" aria-selected="false">도착 <span class="jb-tabs__count">12</span></button>
    <button type="button" class="jb-tabs__tab jb-tabs__tab--alert" role="tab" id="tab-late" aria-controls="pn-late" aria-selected="false">지연 <span class="jb-tabs__count">1</span></button>
    <button type="button" class="jb-tabs__tab" role="tab" id="tab-x" aria-controls="pn-x" aria-selected="false" disabled>결항</button>
  </div>
  <div class="jb-tabs__panel" role="tabpanel" id="pn-dep" aria-labelledby="tab-dep" tabindex="0">…</div>
  <div class="jb-tabs__panel" role="tabpanel" id="pn-arr" aria-labelledby="tab-arr" tabindex="0" hidden>…</div>
  …
</div>
```
활성 = 잉크 굵게 + 아래 cheat-s(왼쪽에서 펼쳐짐). hover = 치트라인 1/4. disabled = 취소선. ←→ Home End. 넘치면 가로 스크롤 + 페이드. 세로형(설정 화면): `jb-tabs jb-tabs--vertical`(860 이하에서 가로로 바뀜).

### timeline — 오늘의 여정
```html
<ol class="jb-timeline" aria-label="JB 305 오늘의 여정">
  <li class="jb-timeline__item jb-timeline__item--done"><span class="jb-timeline__time">09:40</span><span class="jb-timeline__node"></span><div class="jb-timeline__body"><p class="jb-timeline__title">카운터 개장</p><p class="jb-timeline__text">김포 국내선 1층 J 카운터</p></div></li>
  <li class="jb-timeline__item jb-timeline__item--done"><span class="jb-timeline__time">10:30</span><span class="jb-timeline__node"></span><div class="jb-timeline__body"><p class="jb-timeline__title">수속 마감</p><p class="jb-timeline__text">70석 중 66석 수속 · 이어서 탑승 시작</p></div></li>
  <li class="jb-timeline__item jb-timeline__item--now" aria-current="step"><span class="jb-timeline__time">10:40</span><span class="jb-timeline__node"></span><div class="jb-timeline__body"><p class="jb-timeline__title">탑승구 마감 <span class="jb-timeline__now-tag">지금</span></p><p class="jb-timeline__text">정윤호 기장 · 산호호 HL5301</p></div></li>
  <li class="jb-timeline__item"><span class="jb-timeline__time">10:50</span><span class="jb-timeline__node"></span><div class="jb-timeline__body"><p class="jb-timeline__title">김포 출발</p></div></li>
  <li class="jb-timeline__item"><span class="jb-timeline__time">12:00</span><span class="jb-timeline__node"></span><div class="jb-timeline__body"><p class="jb-timeline__title">제주 도착</p><p class="jb-timeline__text">이어서 12:40 JB 306으로 김포 귀환</p></div></li>
</ol>
```
시각은 팩트 시트 규칙(카운터 개장 = 출발 70분 전, 수속 마감 = 20분 전, 탑승구 마감 = 10분 전)으로 계산한다. 10:40 기준 JB 305의 「지금」은 탑승구 마감이다. 완료 = 청록 원 + 실선, 현재 = 작은 스타버스트, 예정 = 테두리 원 + 점선. 날짜가 붙는 기록(profile 최근 탑승)은 시각 칸에 `10.03`처럼 쓰고 `jb-timeline--compact`.

### toast — 아래 왼쪽 쌓임
```html
<button type="button" class="jb-btn jb-btn--sun" data-toast="warn" data-toast-title="JB 307 25분 지연" data-toast-text="12:20 → 12:45 · 제주 측풍">지연 알리기</button>
<script>/* 또는 */ JB.toast({ title: '좌석 7A를 잡았어요', text: 'JB 309 · 10월 17일 (토) 14:30', tone: 'ok' });</script>
```
톤 `info`·`ok`·`warn`·`danger`. 5.2초 후 사라지고(마우스·포커스가 오면 멈춤) 최대 4장. 쌓임 영역(`.jb-toasts`, `aria-live="polite"`)은 app.js가 만든다.
정적 견본:
```html
<div class="jb-toasts jb-toasts--static">
  <div class="jb-toast jb-toast--ok"><svg class="jb-toast__icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M8 12.5l2.8 2.8L16.5 9.5"/></svg><div class="jb-toast__body"><p class="jb-toast__title">좌석 7A를 잡았어요</p><p class="jb-toast__text">JB 309 · 10월 17일 (토) 14:30</p></div><button type="button" class="jb-toast__close" aria-label="알림 닫기"><svg class="jb-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>
</div>
```

### tooltip — 밤하늘 말풍선
```html
<span class="jb-tip"><button type="button" class="jb-btn jb-btn--ghost jb-btn--sm" aria-describedby="tip-7a"><span class="jb-mono">7A</span></button><span class="jb-tip__bubble" role="tooltip" id="tip-7a"><span class="jb-mono">7A</span> — 창가, 날개 앞</span></span>
```
hover·focus로 열리고 Esc로 숨는다. 화면 가장자리에 걸리면 app.js가 말풍선을 안쪽으로 밀고 꼬리는 트리거를 계속 가리킨다. 변형 `--bottom`(아래) · `--start`/`--end`(왼/오른 끝 정렬) · `--wrap`(여러 줄, 최대 240px). 정적으로 열린 견본은 `jb-tip is-open jb-tip--static`(Esc로 닫히지 않는다). 밤하늘 지면(`jb-sheet--night`·`--deep`·`jb-on-night`) 위에서는 tooltip.css가 크림 테두리를 덧댄다.

---

## 5. app.js 동작 계약

| 속성/클래스 | 동작 |
|---|---|
| `[data-theme-toggle]` | 낮/밤 전환, localStorage `jebi-theme`, `aria-pressed`. `?theme=`이 있으면 URL도 갱신 |
| `[data-modal-open="id"]` `[data-drawer-open="id"]` | 모달·드로어 열기(포커스 트랩, 스크롤 잠금, Esc·딤·`[data-close]` 닫기, 포커스 복귀) |
| `[data-command-open]` · ⌘K/Ctrl+K | 커맨드 팔레트 |
| `[data-side-toggle]` | 직원 사이드바 오프캔버스(1024 이하) |
| `[data-tabs]` · `[data-accordion]` · `[data-carousel]` · `[data-calendar]` · `[data-kanban]` · `[data-stepper]` | 각 컴포넌트 초기화 |
| `[data-menu-trigger]` · `[data-popover-trigger]` | 떠 있는 패널(바깥 클릭·Esc 닫기, 위치 자동) |
| `[data-toast]` + `data-toast-title` / `data-toast-text` | 클릭하면 토스트 |
| `[data-busy-demo="ms"]` | 버튼 로딩 시연(끝나면 `data-toast*`가 있으면 토스트) |
| `[data-dismiss]` | 가장 가까운 `.jb-alert`/`[data-dismissible]` 닫기 |
| `form[data-validate]` | 검증 + 오류 문구 + `jb:submit` |
| `[data-copy]` | `.jb-code` 안 코드 복사 |
| `[data-motion-play="id …"]` | 모션 다시 재생 |
| `[data-marquee-toggle]` | 마키 정지/재생 |
| `table[data-table-select]` + `data-count-target` | 행 선택·전체 선택·개수 표시 |
| `[data-view-set="detail"][data-view-for="id"]` (+`data-view-focus`) | 컨테이너 `data-view` 전환(inbox 모바일 목록 ↔ 본문) |
| `[data-bind-target="id"]` (+`data-bind-attr`) | 입력 값을 다른 요소 속성으로(product 색상 선택 → 일러스트 면) |
| `[data-reduce-motion-toggle]` | `html.jb-reduce-motion` 켜고 끄기 |
| `[data-reveal]` · `[data-reveal-group]` · `.jb-cheatline[data-draw]` · `.jb-flyin` | 화면 진입 시 한 번 재생(움직임 줄이기면 최종 상태) |

공개 API `window.JB`: `toast({title,text,tone,duration})`, `open(el)`, `close(el)`, `applyTheme('light'|'dark')`, `setProgress(bar, value)`, `play(el)`, `init(scope)`(동적으로 넣은 마크업 초기화).
이벤트: `jb:open` `jb:close` `jb:tab` `jb:date` `jb:step` `jb:submit`.

---

## 6. 아이콘 path 모음
모두 `<svg class="jb-icon" viewBox="0 0 24 24" aria-hidden="true">…</svg>`(2px 선, currentColor, 둥근 끝). 크기 `jb-icon--sm` 16 · 기본 20 · `--lg` 24. 이모지 금지.

| 이름 | path |
|---|---|
| 비행기 | `<path d="M12 2.5c.9 0 1.5.8 1.5 1.8V9l7 4v2l-7-2v4.5l2.2 1.7V21L12 20l-3.7 1v-1.8l2.2-1.7V13l-7 2v-2l7-4V4.3c0-1 .6-1.8 1.5-1.8z"/>` |
| 찾기 | `<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/>` |
| 해 / 달 | `<circle cx="12" cy="12" r="4.5"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"/>` / `<path d="M19.5 14.5A8 8 0 0 1 9.5 4.5a8 8 0 1 0 10 10z"/>` |
| 메뉴 / 닫기 | `<path d="M4 7h16M4 12h16M4 17h10"/>` / `<path d="M6 6l12 12M18 6L6 18"/>` |
| 이전 / 다음 | `<path d="M15 5l-7 7 7 7"/>` / `<path d="M9 5l7 7-7 7"/>` |
| 체크 | `<path d="M5 12.5l4.5 4.5L19 7.5"/>` |
| 좌석 | `<path d="M7 4v9a2 2 0 0 0 2 2h7l2 5"/><path d="M7 19h8"/><path d="M11 15v4"/>` |
| 탑승권 | `<path d="M4 7h16v3a2 2 0 0 0 0 4v3H4v-3a2 2 0 0 0 0-4z"/><path d="M14 7v10" stroke-dasharray="2 2"/>` |
| 가방 | `<path d="M5 9h14l-1 11H6z"/><path d="M9 9V7a3 3 0 0 1 6 0v2"/>` |
| 기내 수하물 | `<rect x="6" y="7" width="12" height="13"/><path d="M9.5 7V4h5v3M9 11v5M15 11v5"/>` |
| 현황판 | `<rect x="4" y="4" width="7" height="7"/><rect x="13" y="4" width="7" height="7"/><rect x="4" y="13" width="7" height="7"/><rect x="13" y="13" width="7" height="7"/>` |
| 문의함 | `<path d="M4 13l2.5-8h11L20 13v6H4z"/><path d="M4 13h5l1 2h4l1-2h5"/>` |
| 보드 | `<rect x="4" y="4" width="16" height="16"/><path d="M9.5 4v16M14.5 4v16"/>` |
| 브로셔 | `<path d="M4 5h6a2 2 0 0 1 2 2v12a2 2 0 0 0-2-2H4z"/><path d="M20 5h-6a2 2 0 0 0-2 2v12a2 2 0 0 1 2-2h6z"/>` |
| 종(정보) | `<path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15z"/><path d="M10 20.5a2 2 0 0 0 4 0"/>` |
| 성공 | `<circle cx="12" cy="12" r="9"/><path d="M8 12.5l2.8 2.8L16.5 9.5"/>` |
| 경고 | `<path d="M12 3.5L21.5 20h-19z"/><path d="M12 10v4.5"/><path d="M12 17.4v.1"/>` |
| 위험 | `<circle cx="12" cy="12" r="9"/><path d="M12 7.5v5.5"/><path d="M12 16.4v.1"/>` |
| 정렬 화살표 | `<path d="M12 19V5M7 10l5-5 5 5"/>` |
| 더보기 | `<circle cx="5" cy="12" r="1.3"/><circle cx="12" cy="12" r="1.3"/><circle cx="19" cy="12" r="1.3"/>` |
| 정지 / 재생 | `<path d="M9 6v12M15 6v12"/>` / `<path d="M8 5.5v13l10.5-6.5z"/>` |
| 가위(쿠폰) | `<circle cx="6" cy="7" r="2.5"/><circle cx="6" cy="17" r="2.5"/><path d="M8 8.5L20 17M8 15.5L20 7"/>` |

---

## 7. 지킬 것
- **데이터는 팩트 시트 값만.** 날짜·요일(2026.10.12 월 기준), 편명, 시각, 기체, 운임, 인물, ID 체계를 새로 지어내지 않는다. 「○○」「Lorem」 같은 자리표시자 금지.
- 꼬리 4색(산호·해바라기·청록·아보카도)은 **기체 데이터에만** 칠한다. 해바라기 면 위 글자는 언제나 잉크.
- 스타버스트는 한 뷰포트 최대 2개. 휘어 오르는 치트라인은 한 페이지 최대 2회.
- 반경은 세 가지뿐: 지면·표·패널 0 / 입력·작은 카드 6px / 버튼·배지·탭 알약. 일러스트 창·아바타·엽서는 창 프레임(`--r-window`).
- 블러 그림자 금지. 오버레이는 2px 잉크 테두리 + 딤.
- 넓은 자간·모노는 라틴·숫자에만. 한글 라벨은 자간 0, 13px 이상.
- 정렬은 좌측. 가운데 정렬 섹션 머리 금지(스타버스트 내부·404 숫자만 예외).
- SVG presentation attribute에 `var()` 금지 → `jb-ill-*` 클래스 또는 `currentColor`.
- `href="#"`, 인라인 `onclick`, 인라인 `grid-template-columns`, 외부 JS/CSS 라이브러리, 이미지 파일 금지. 장면 레이아웃은 `index.css` / `pages/<name>.css`에만 쓴다.
- 터치 타깃 44px. 표·탭·칸반의 가로 넘침은 래퍼 안에서만(페이지 가로 스크롤 0).
- 다크는 「밤 비행 21:00」 장면이다. 꼬리색은 이름을 유지하고 밝기만 올라간다. 다크 산호 버튼 글자는 잉크.
