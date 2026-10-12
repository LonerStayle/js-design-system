# 윤슬 YUNSEUL · 컴포넌트 마크업 계약

> 기준: `DIRECTION.md`(팩트 시트·판 문법·시그니처). 이 문서는 **index.html과 pages/*.html을 쓰는 장면 작업자가 그대로 복사해 쓰는 마크업**이다.
> 모든 예시 문구·숫자는 팩트 시트 값이다. 새 값이 필요하면 DIRECTION.md 팩트 시트에 먼저 추가한다.
> 시그니처 두 개를 잊지 말 것 — **① 윤슬 라인**(한 점에서만 빛나는 1px 헤어라인) · **② 스포트라이트 오브젝트**(직접 그린 보석·시계 + 조명 하나).

---

## 0. 공통 머리말 (모든 HTML)

```html
<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>살롱 장부 — 윤슬</title>
<script>(function(){try{var q=/[?&]theme=(dark|light)\b/.exec(location.search);var t=q?q[1]:localStorage.getItem("yunseul-theme");if(!t)t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";document.documentElement.setAttribute("data-theme",t);document.documentElement.classList.add("js")}catch(e){document.documentElement.setAttribute("data-theme","dark")}})();</script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Jost:wght@300;400;500&family=Noto+Serif+KR:wght@200;300;500&family=Noto+Sans+KR:wght@300;400;500&family=Red+Hat+Mono:wght@300;400&display=swap">
<link rel="stylesheet" href="styles.css">          <!-- pages: ../styles.css -->
<link rel="stylesheet" href="index.css">           <!-- pages: dashboard.css 등 장면 CSS 하나 -->
<script src="app.js" defer></script>               <!-- pages: ../app.js -->
</head>
```

- 테마 결정 순서: **URL `?theme=` > localStorage(`yunseul-theme`) > 시스템**. 인라인 스크립트가 `<html data-theme>`과 `.js`를 FOUC 없이 단다.
- `.js` 클래스가 있어야 `[data-reveal]` 진입 모션이 숨김에서 시작한다(JS 없으면 바로 보임).
- 장면 CSS(index.css, pages/*.css)는 **semantic 토큰만** 쓴다. raw hex · 인라인 `grid-template-columns` · `href="#"` · 인라인 onclick 금지.

---

## 1. 토큰 요약 (semantic.css)

| 토큰 | 밤(정본) | 낮 | 쓰임 |
|---|---|---|---|
| `--bg-void` / `--bg` / `--surface` / `--raised` | #050607 / #08090B / #0F1114 / #16191D | #DCDBD7 / #E7E6E3 / #F3F2EF / #FBFAF8 | 판 바깥 / 페이지 / 표·폼 / 메뉴·모달 |
| `--spot-core` | #1E2125 | #F7F6F3 | 스포트라이트 중심 |
| `--line` / `--line-strong` / `--line-input` | 장식 / 행 구분 / 입력 테두리(3:1) | | 상태 전달에 line·line-strong 금지 |
| `--text` / `--text-muted` / `--text-subtle` | 펄 / 캡션 / 메타(12px 이상, spot-core 위 금지) | | |
| `--platinum` | #C8CCD2 | #4A4E55 | 활성·포커스·진행 채움 |
| `--glint` | #FFF4E2 | #111214 | 윤슬 라인의 정점(낮에는 흑연 선 위 가장 짙은 점) |
| `--glint-point` | #FFF4E2 | #15171A | 점으로 찍히는 빛(상태 점·초침·진행 머리) |
| `--primary-bg` / `--on-primary` | 펄 / 오닉스 | 흑칠 / 새틴 | 주 버튼 |
| `--success` `--warning` `--danger` `--info` | 비취 / 호박 / 장미 가넷 / 새벽 하늘 | 같은 계열 짙게 | 항상 한글 단어와 함께 |
| `--glint-line` · `--glint-line-v` · `--glint-line-solid` | 그라디언트 | | 윤슬 라인 배경 |
| `--obj-*` | 보석·금속 재질 | 모드 무관 | **오브젝트 SVG 안에서만** |

- 금(gold) 계열 hex는 UI 어디에도 없다(warning 호박색 제외). 보석 색은 버튼·배지·링크에 쓰지 않는다.
- radius 0(예외: 아바타·다이얼·진주·상태 점·스위치 트랙). 그림자 없음(낮의 오버레이만 `--shadow-overlay`).
- `[data-scene="night"]`: 라이트 문서 안에서도 밤 토큰과 어두운 배경을 유지하는 판. index 표지(I)·회전 진열대(VI)·쉼표(VII), 404 전체.

모션 토큰: `--ease-silk` 입장 · `--ease-exit` 퇴장 · `--dur-micro 240ms` · `--dur-panel 480ms`(퇴장 240) · `--dur-reveal 900ms` · `--dur-glint 1200ms` · `--dur-tide 9000ms` · `--dur-second 60s`.

---

## 2. base.css 프리미티브

### 텍스트 역할
| 클래스 | 폰트 | 용도 |
|---|---|---|
| `.cover-title` | Noto Serif KR 200 / Cormorant 300, `--fs-cover` | 표지 한 단어(`물비늘`) |
| `.plate-title` | 같은 폰트, `--fs-plate` | 판 제목 한 줄 |
| `.title` · `.h3` | Noto Serif KR 300 | 페이지 제목 · 소제목 |
| `.lede` | Noto Sans KR 300 18px muted | 판 아래 한 줄 설명 |
| `.label-latin` | Jost 500 대문자 자간 0.24em | **라틴·숫자 전용** (`NO. 04`, `PLATINUM`) |
| `.label` | Noto Sans KR 500 12px 자간 0 | 한글 라벨 |
| `.roman` | Cormorant italic | 플레이트 번호 `IV` · 캐러셀 카운터 · 단계(steps) 번호에만 쓴다. 섹션·플랜·칸반 열·카드 인덱스·질문 앞에는 쓰지 않는다 |
| `.num` · `.price` | Cormorant 300 lining tabular, 줄바꿈 금지 | 금액 `₩312,000,000` |
| `.mono` | Red Hat Mono 12px | ID · 시리얼 · 칼리버 |
| `.link` | 백금 밑줄 + hover 윤슬 스윕 | 본문 링크 |
| `.kbd` | 1px 테두리 mono | `⌘K` |

### 워드마크
```html
<span class="wordmark"><span class="wordmark__latin">YUNSEUL</span><span class="wordmark__ko">윤슬</span></span>
```

### 시그니처 ① 윤슬 라인
```html
<span class="glint"></span>                       <!-- 구분선. 빛점은 50% 에 고정 -->
<span class="glint glint--sweep"></span>          <!-- 화면에 들어올 때 한 번 스윕(app.js) -->
<span class="glint glint--tide"></span>           <!-- 표지 전용, 9000ms 주기 -->
<span class="glint glint--v"></span>              <!-- 세로 -->
```
`--glint-x`(0–100%)로 빛점 위치를 지정할 수 있다. 축소 모션에서는 50%에 정지.

### 시그니처 ② 스포트라이트 + 오브젝트
```html
<section class="plate plate--full spot" data-scene="night" data-plate="I" id="plate-i">
  <span data-object="ring" data-gem="sapphire" aria-label="첫 물결 — 플래티넘 링, 쿠션컷 실론 사파이어 5.12ct" data-reveal="object"></span>
  <div class="corner corner--bl" data-reveal="caption"> … </div>
</section>
```
- `.spot` 은 그 요소의 배경을 무대 조명 타원으로 만든다. 위치·크기: `--spot-x`(기본 61.8%) `--spot-y`(46%) `--spot-w`(34%) `--spot-h`(42%). `.spot--left`(38.2%), `.spot--center`, `.spot--void`(바닥이 `--bg-void`). 모바일은 자동으로 가로 타원(64% × 30%).
- **조명은 오브젝트가 있을 때만.** 오브젝트 없는 판에 `.spot` 금지(radial 얼룩 금지).
- `data-object` 종류 — app.js 가 SVG 를 그린다(viewBox 400, 정사각):

| 값 | 그림 | `data-gem` | 쓰이는 작품 |
|---|---|---|---|
| `ring` | 쿠션컷 스톤 + 헤일로 + 플래티넘 밴드 | `sapphire`(기본) `padparadscha` `aqua` `spinel` `diamond` | No.01 첫 물결, No.09 수면의 별(padparadscha) |
| `drop` | 스터드 + 바일 + 진주 / 페어컷 원석 | `pearl`(기본) 또는 원석 | No.04 달그림자(pearl), No.03 새벽 수면(aqua) |
| `pendant` | V자 체인 + 베일 + 위가 뾰족한 페어컷 원석 + 아랫단 헤일로 (스터드·와이어 없음) | `sapphire`(기본) `emerald` | No.06 깊은 물(sapphire), BS-2610-05 차은결 님 에메랄드 펜던트(emerald) |
| `necklace` | 물비늘 반원 18개 + 페어셰이프 펜던트 | — | No.02 물비늘, No.12 윤슬, No.11 밤바다 |
| `bracelet` | 다이아몬드 타원 띠 | — | No.05 잔물결, No.08 썰물 |
| `dial` (= `watch`) | 38mm 다이얼 · 60눈금 · 시·분·초침. `data-dial` 변형: 없음 = 문페이즈 창(자정 문페이즈) / `tourbillon` = 6시 방향 오픈 케이지, 문페이즈 없음, 케이지가 60s에 한 바퀴(자정 투르비용 YS-W-2603) / `nacre` = 자개 다이얼 · 다이아 점 인덱스 · 짙은 바늘 · 청색 초침(이연수 님의 여명 YS-W-1802) | — · `data-time="19:40"` | 자정 문페이즈 · 자정 투르비용 · 여명 |
| `setting` | 빈 프롱 세팅 | — | 빈 상태 · 404 |

- 크기는 부모가 정한다(`width`). 정사각.
- `aria-label`이 있으면 `role="img"`, 없으면 장식(`aria-hidden`).
- 실루엣(칸반·밀착 인화지·작은 썸네일): `class="object--silhouette"` — 1px 선만, 조명·광택 없음.
- 오브젝트 위 반짝임은 SVG 안에 이미 1–2개 들어 있다. 추가로 찍을 때만 `<span class="sparkle" style="left:40%;top:30%"></span>`(판 안 position:relative 기준). 판 하나에 반짝임 2개 이하.

### 판 · 모서리 · 캡션
| 클래스 | 뜻 |
|---|---|
| `.plate` | 장면 단위. `min-height: 72svh`, 안쪽 여백 `--inset-plate`(48/32/20). 판 사이 간격 0, 경계는 배경 톤과 1px `--line` |
| `.plate--full` | index 판(100svh). 모바일 높이는 index.css 에서 88svh |
| `.plate--void` | 바닥을 `--bg-void`로(판 교차 리듬) |
| `.corner--tl/tr/bl/br` | 판 모서리에 inset 거리로 고정된 텍스트 |
| `.g24` · `.g12` | 24단(장면, 거터 16) · 12단(실무, 거터 24) 그리드 — 열 배치는 장면 CSS 에서 `grid-column` 으로 |
| `.scene-head` | 내부 도구 페이지 상단 장면(최대 72svh, 오브젝트 하나 + 모서리 텍스트) |

캡션 문법(네 줄 이하, 좌정렬):
```html
<div class="caption">
  <span class="caption__no">No. 04</span>
  <span class="caption__name">달그림자</span>
  <span class="caption__spec">플래티넘 · 남양 백진주 13.2mm · 다이아몬드 1.92ct</span>
  <span class="caption__id">YS-HJ26-04</span>
</div>
```
가격이 필요하면 `<span class="caption__price">₩68,000,000</span>`을 이름 다음에.

### 진입 모션
`data-reveal="light"`(조명 600ms) → `"object"`(120ms 지연) → `"caption"`(240ms 지연). 값 없는 `data-reveal`은 지연 0. 뷰당 움직이는 요소 최대 2개.

### index 플레이트 카운터
```html
<p class="counter" data-counter aria-hidden="true"><span class="roman counter__now">I</span><span class="roman">/</span><span class="roman">XV</span></p>
```
각 판에 `data-plate="IV"`. 화면 가운데에 온 판의 번호로 바뀐다. 데스크톱 우하단, 모바일은 내비 아래 우상단.

### 아이콘
`<span data-icon="search"></span>` — app.js 가 1px 선 SVG 를 채운다. 크기 `.icon--sm`(16) `.icon--lg`(24).
사용 가능: `search close plus minus check chevron-left chevron-right chevron-down chevron-up arrow-right arrow-left sun moon menu calendar letter ledger board gem watch user users settings logout copy alert info clock phone pause play more filter salon certificate care lock external drag sparkle`. 아이콘만 있는 버튼은 반드시 `aria-label`.

### 기타
`.avatar`(원, 이니셜 Noto Serif KR) · `.vh`(스크린리더 전용) · `.skip`(본문 건너뛰기) · `.stack`(`--stack-gap`) · `.row`(`--row-gap`).

---

## 3. 복사해서 쓰는 공통 셸 (그대로 붙여 넣을 것)

> 셸은 아래 스니펫 **그대로**. 페이지마다 링크 순서·문구·푸터를 바꾸지 않는다. 바꾸는 것은 `aria-current` 위치 하나뿐.
> 링크 지도 — 컬렉션 `index.html` · 시계 `index.html#plate-v`(자정 판) · 메종 `pages/pricing.html` · 뷰잉 예약 `pages/onboarding.html` · 작품 상세 `pages/product.html` · 소장가 계정 `pages/profile.html` · 연락과 보관 `pages/settings.html` · 살롱 장부 `pages/dashboard.html` · 서신함 `pages/inbox.html` · 공정 보드 `pages/kanban.html` · 빈 세팅 `pages/404.html`.

### 3-1. 고객 내비 — index.html 경로

```html
<a class="skip" href="#main">본문으로 건너뛰기</a>
<header class="nav">
  <div class="nav__inner">
    <button type="button" class="btn btn--ghost btn--icon nav__burger" aria-expanded="false" aria-controls="nav-sheet" aria-label="메뉴 열기"><span data-icon="menu"></span></button>
    <ul class="nav__links">
      <li><a class="nav__link" href="index.html" aria-current="page">컬렉션</a></li>
      <li><a class="nav__link" href="index.html#plate-v">시계</a></li>
      <li><a class="nav__link" href="pages/pricing.html">메종</a></li>
    </ul>
    <a class="nav__mark" href="index.html" aria-label="윤슬 컬렉션 북 처음으로"><span class="wordmark"><span class="wordmark__latin">YUNSEUL</span><span class="wordmark__ko">윤슬</span></span></a>
    <div class="nav__tools">
      <button type="button" class="nav__search" data-open="cmd" aria-label="작품·고객·예약 검색"><span data-icon="search"></span><span class="nav__search-label">검색</span><span class="kbd">⌘K</span></button>
      <a class="btn btn--secondary btn--sm nav__reserve" href="pages/onboarding.html">뷰잉 예약</a>
      <button type="button" class="btn btn--ghost btn--icon nav__theme" data-theme-toggle><span class="icon-sun" data-icon="sun"></span><span class="icon-moon" data-icon="moon"></span></button>
    </div>
  </div>
  <div class="nav__sheet" id="nav-sheet" hidden>
    <ul class="nav__sheet-links">
      <li><a href="index.html" aria-current="page">컬렉션</a></li>
      <li><a href="index.html#plate-v">시계</a></li>
      <li><a href="pages/pricing.html">메종</a></li>
      <li><a href="pages/onboarding.html">뷰잉 예약</a></li>
      <li><a href="pages/profile.html">소장가 계정</a></li>
    </ul>
    <div class="nav__sheet-foot"><span>청담 메종 · 서울 강남구 압구정로 446</span><span>화–토 11:00–20:00 · 일 12:00–18:00 · 월 휴무</span><span>02-512-1987</span></div>
  </div>
</header>
<main id="main"> … </main>
```

### 3-2. 고객 내비 — pages/*.html 경로 (product · pricing · onboarding · profile · settings · 404)

```html
<a class="skip" href="#main">본문으로 건너뛰기</a>
<header class="nav">
  <div class="nav__inner">
    <button type="button" class="btn btn--ghost btn--icon nav__burger" aria-expanded="false" aria-controls="nav-sheet" aria-label="메뉴 열기"><span data-icon="menu"></span></button>
    <ul class="nav__links">
      <li><a class="nav__link" href="../index.html">컬렉션</a></li>
      <li><a class="nav__link" href="../index.html#plate-v">시계</a></li>
      <li><a class="nav__link" href="pricing.html">메종</a></li>
    </ul>
    <a class="nav__mark" href="../index.html" aria-label="윤슬 컬렉션 북 처음으로"><span class="wordmark"><span class="wordmark__latin">YUNSEUL</span><span class="wordmark__ko">윤슬</span></span></a>
    <div class="nav__tools">
      <button type="button" class="nav__search" data-open="cmd" aria-label="작품·고객·예약 검색"><span data-icon="search"></span><span class="nav__search-label">검색</span><span class="kbd">⌘K</span></button>
      <a class="btn btn--secondary btn--sm nav__reserve" href="onboarding.html">뷰잉 예약</a>
      <button type="button" class="btn btn--ghost btn--icon nav__theme" data-theme-toggle><span class="icon-sun" data-icon="sun"></span><span class="icon-moon" data-icon="moon"></span></button>
    </div>
  </div>
  <div class="nav__sheet" id="nav-sheet" hidden>
    <ul class="nav__sheet-links">
      <li><a href="../index.html">컬렉션</a></li>
      <li><a href="../index.html#plate-v">시계</a></li>
      <li><a href="pricing.html">메종</a></li>
      <li><a href="onboarding.html">뷰잉 예약</a></li>
      <li><a href="profile.html">소장가 계정</a></li>
    </ul>
    <div class="nav__sheet-foot"><span>청담 메종 · 서울 강남구 압구정로 446</span><span>화–토 11:00–20:00 · 일 12:00–18:00 · 월 휴무</span><span>02-512-1987</span></div>
  </div>
</header>
<main id="main"> … </main>
```
`aria-current="page"` 위치: product → `컬렉션`(데스크톱 링크·시트 둘 다), pricing → `메종`, onboarding → 시트의 `뷰잉 예약` + `.nav__reserve`에 `aria-current="page"`, profile·settings → 시트의 `소장가 계정`, 404 → 없음.
- 내비는 고정(fixed)·투명으로 시작한다. `<main>`의 첫 판은 자동으로 내비 높이만큼 위 여백을 받는다(`.plate--full` 또는 `data-under-nav`가 붙은 첫 판은 내비 아래로 깔린다 — 표지처럼).
- 내비 바로 아래 판이 `data-scene="night"`이면 app.js 가 내비에도 밤 토큰을 건다. 스크롤 24px 이후 `--bg` 92% 면 + 아래 윤슬 라인.

### 3-3. 내부 도구 셸 — pages/*.html 경로 (dashboard · inbox · kanban)

```html
<a class="skip" href="#main">본문으로 건너뛰기</a>
<div class="shell">
  <nav class="side" id="side" aria-label="메종 내부 메뉴">
    <div class="side__mark">
      <a href="dashboard.html" aria-label="살롱 장부 처음으로"><span class="wordmark"><span class="wordmark__latin">YUNSEUL</span><span class="wordmark__ko">메종 내부 · 청담</span></span></a>
      <button type="button" class="btn btn--ghost btn--icon side__close" data-side-toggle aria-controls="side" aria-label="메뉴 닫기"><span data-icon="close"></span></button>
    </div>
    <div class="side__nav">
      <div class="side__group">
        <p class="side__group-label">11월 20일(금) 프리뷰</p>
        <ul class="side__list">
          <li><a class="side__link" href="dashboard.html"><span data-icon="ledger"></span><span class="side__label">살롱 장부</span><span class="side__count">10</span></a></li>
          <li><a class="side__link" href="inbox.html"><span data-icon="letter"></span><span class="side__label">서신함</span><span class="side__count is-alert">3</span></a></li>
          <li><a class="side__link" href="kanban.html"><span data-icon="board"></span><span class="side__label">공정 보드</span><span class="side__count">10</span></a></li>
        </ul>
      </div>
      <div class="side__group">
        <p class="side__group-label">고객 화면</p>
        <ul class="side__list">
          <li><a class="side__link" href="../index.html"><span data-icon="gem"></span><span class="side__label">컬렉션 북</span></a></li>
          <li><a class="side__link" href="product.html"><span data-icon="sparkle"></span><span class="side__label">작품 상세 · 달그림자</span></a></li>
          <li><a class="side__link" href="pricing.html"><span data-icon="care"></span><span class="side__label">케어와 비스포크</span></a></li>
          <li><a class="side__link" href="onboarding.html"><span data-icon="calendar"></span><span class="side__label">뷰잉 예약</span></a></li>
          <li><a class="side__link" href="profile.html"><span data-icon="user"></span><span class="side__label">소장가 이연수</span></a></li>
          <li><a class="side__link" href="settings.html"><span data-icon="settings"></span><span class="side__label">연락과 보관</span></a></li>
        </ul>
      </div>
    </div>
    <div class="side__user">
      <span class="avatar">서</span>
      <span class="side__user-text"><span class="side__user-name">서지안</span><br><span class="side__user-role">수석 CA · 청담 메종</span></span>
      <button type="button" class="btn btn--ghost btn--icon" data-theme-toggle><span class="icon-sun" data-icon="sun"></span><span class="icon-moon" data-icon="moon"></span></button>
    </div>
  </nav>
  <div class="side-scrim" aria-hidden="true"></div>
  <div class="shell__main">
    <header class="shell__top">
      <button type="button" class="btn btn--ghost btn--icon shell__menu" data-side-toggle aria-controls="side" aria-expanded="false" aria-label="메뉴 열기"><span data-icon="menu"></span></button>
      <p class="shell__top-title"><span class="shell__top-full">청담 메종 3층 프라이빗 살롱 · 11월 20일(금) 19:40</span><span class="shell__top-short">3층 살롱 · 19:40</span></p>
      <div class="shell__top-tools">
        <button type="button" class="nav__search" data-open="cmd" aria-label="작품·고객·예약 검색"><span data-icon="search"></span><span class="kbd">⌘K</span></button>
      </div>
    </header>
    <main id="main">
      <p class="shell__when" aria-hidden="true">청담 메종 3층 프라이빗 살롱 · 11월 20일(금) 19:40</p>
      …
    </main>
    <!-- 3-5 푸터(pages 경로) 그대로 -->
  </div>
</div>
```
- 현재 페이지 링크에만 `aria-current="page"` (dashboard → 살롱 장부, inbox → 서신함, kanban → 공정 보드).
- 테마 토글은 내비·사이드바 모두 `[data-theme-toggle]` 안에 `.icon-sun`·`.icon-moon` 두 아이콘을 넣는다(현재 조명만 보인다). `aria-pressed`·`aria-label`은 app.js 가 단다.
- 1024px 미만에서 사이드바는 왼쪽 시트가 된다(`.shell__menu`로 열고 Esc·스크림·닫기 버튼으로 닫음). 닫힌 시트는 `visibility: hidden`(퇴장 240ms 뒤)이라 Tab 이 들어가지 않고, 열린 동안은 시트 안에서만 Tab 이 돈다(app.js 포커스 트랩).
- **모바일 축약 규칙(<720px)**: 상단바 제목은 `.shell__top-short`("3층 살롱 · 19:40") 한 줄만, `nowrap + ellipsis`. 전체 문구는 `<main>` 첫 줄 `.shell__when`이 장면 헤더 위에 받는다. 두 줄로 접히는 상단바 금지.

### 3-4. 공통 푸터 — index.html 경로

```html
<footer class="foot">
  <span class="glint foot__line"></span>
  <div class="foot__grid">
    <div class="foot__mark"><span class="wordmark"><span class="wordmark__latin">YUNSEUL</span><span class="wordmark__ko">윤슬 · 1987</span></span></div>
    <p class="foot__addr"><span>청담 메종 — 서울 강남구 압구정로 446 · 성수 아틀리에 — 서울 성동구 연무장7길 12</span><span>화–토 11:00–20:00 · 일 12:00–18:00 · 월 휴무(사전 예약 상담만)</span><span>02-512-1987 · salon@yunseul.kr · 카카오톡 채널 「윤슬 메종」</span></p>
    <nav class="foot__links" aria-label="바닥글">
      <a href="pages/pricing.html">케어와 비스포크</a>
      <a href="pages/onboarding.html">뷰잉 예약</a>
      <a href="pages/profile.html">소장가 계정</a>
      <a href="pages/settings.html">연락과 보관</a>
      <a href="pages/dashboard.html">메종 내부</a>
    </nav>
  </div>
  <div class="foot__fine"><span>© 1987–2026 윤슬 메종 · 창립자 윤해담</span><span>모든 작품가는 부가세 포함입니다.</span></div>
</footer>
```

### 3-5. 공통 푸터 — pages/*.html 경로 (고객·내부 모든 페이지가 이것 하나)

```html
<footer class="foot">
  <span class="glint foot__line"></span>
  <div class="foot__grid">
    <div class="foot__mark"><span class="wordmark"><span class="wordmark__latin">YUNSEUL</span><span class="wordmark__ko">윤슬 · 1987</span></span></div>
    <p class="foot__addr"><span>청담 메종 — 서울 강남구 압구정로 446 · 성수 아틀리에 — 서울 성동구 연무장7길 12</span><span>화–토 11:00–20:00 · 일 12:00–18:00 · 월 휴무(사전 예약 상담만)</span><span>02-512-1987 · salon@yunseul.kr · 카카오톡 채널 「윤슬 메종」</span></p>
    <nav class="foot__links" aria-label="바닥글">
      <a href="pricing.html">케어와 비스포크</a>
      <a href="onboarding.html">뷰잉 예약</a>
      <a href="profile.html">소장가 계정</a>
      <a href="settings.html">연락과 보관</a>
      <a href="dashboard.html">메종 내부</a>
    </nav>
  </div>
  <div class="foot__fine"><span>© 1987–2026 윤슬 메종 · 창립자 윤해담</span><span>모든 작품가는 부가세 포함입니다.</span></div>
</footer>
```

### 3-6. 커맨드 팔레트 (모든 HTML `</body>` 바로 앞, 경로 무관)

`data-href="~/…"`는 app.js 가 styles.css 위치(테마 루트) 기준으로 풀어 준다 — index·pages 어디서나 이 스니펫 그대로.

```html
<div class="cmd" id="cmd" hidden>
  <div class="cmd__scrim" data-close></div>
  <div class="cmd__panel" role="dialog" aria-modal="true" aria-label="작품·고객·예약 검색">
    <div class="cmd__field">
      <span data-icon="search"></span>
      <input class="cmd__input" type="text" placeholder="작품, 고객, 예약번호" aria-label="검색어" role="combobox" aria-expanded="true" aria-controls="cmd-list" aria-autocomplete="list" data-autofocus>
      <span class="kbd">esc</span>
      <span class="glint"></span>
    </div>
    <div class="cmd__list" id="cmd-list" role="listbox" aria-label="검색 결과">
      <div class="cmd__group" role="group" aria-label="작품"><p class="cmd__group-label">작품</p>
        <div class="cmd__item" role="option" data-href="~/index.html#plate-i" data-keywords="링 사파이어 홀드"><span class="cmd__item-id">YS-HJ26-01</span><span class="cmd__item-title">첫 물결</span><span class="cmd__item-meta">링 · 홀드</span></div>
        <div class="cmd__item" role="option" data-href="~/pages/product.html" data-keywords="진주 이어링"><span class="cmd__item-id">YS-HJ26-04</span><span class="cmd__item-title">달그림자</span><span class="cmd__item-meta">드롭 이어링 · 전시 중</span></div>
        <div class="cmd__item" role="option" data-href="~/index.html#plate-vi" data-keywords="브레이슬릿 다이아몬드"><span class="cmd__item-id">YS-HJ26-05</span><span class="cmd__item-title">잔물결</span><span class="cmd__item-meta">브레이슬릿 · 상담 2건</span></div>
        <div class="cmd__item" role="option" data-href="~/index.html#plate-v" data-keywords="시계 투르비용 한정"><span class="cmd__item-id">YS-W-2603</span><span class="cmd__item-title">자정 투르비용</span><span class="cmd__item-meta">2/7 남음</span></div>
      </div>
      <div class="cmd__group" role="group" aria-label="고객"><p class="cmd__group-label">고객</p>
        <div class="cmd__item" role="option" data-href="~/pages/profile.html" data-keywords="프리베 YC-04127"><span class="cmd__item-id">YC-04127</span><span class="cmd__item-title">이연수</span><span class="cmd__item-meta">프리베 · 2014년 3월</span></div>
      </div>
      <div class="cmd__group" role="group" aria-label="예약"><p class="cmd__group-label">예약</p>
        <div class="cmd__item" role="option" data-href="~/pages/dashboard.html" data-keywords="이연수 첫 물결 상담"><span class="cmd__item-id">RV-261120-04</span><span class="cmd__item-title">이연수 님 · 첫 물결</span><span class="cmd__item-meta">19:00 상담 중</span></div>
        <div class="cmd__item" role="option" data-href="~/pages/dashboard.html" data-keywords="류세온 윤슬 도착"><span class="cmd__item-id">RV-261120-06</span><span class="cmd__item-title">류세온 님 · 윤슬</span><span class="cmd__item-meta">19:40 도착</span></div>
      </div>
      <div class="cmd__group" role="group" aria-label="화면"><p class="cmd__group-label">화면</p>
        <div class="cmd__item" role="option" data-href="~/pages/dashboard.html"><span class="cmd__item-id">장면 01</span><span class="cmd__item-title">살롱 장부</span><span class="cmd__item-meta">내부</span></div>
        <div class="cmd__item" role="option" data-href="~/pages/inbox.html"><span class="cmd__item-id">장면 02</span><span class="cmd__item-title">서신함</span><span class="cmd__item-meta">미답 3</span></div>
        <div class="cmd__item" role="option" data-href="~/pages/kanban.html"><span class="cmd__item-id">장면 03</span><span class="cmd__item-title">아틀리에 공정 보드</span><span class="cmd__item-meta">내부</span></div>
        <div class="cmd__item" role="option" data-href="~/pages/product.html"><span class="cmd__item-id">장면 04</span><span class="cmd__item-title">No.04 달그림자</span><span class="cmd__item-meta">작품 상세</span></div>
        <div class="cmd__item" role="option" data-href="~/pages/pricing.html"><span class="cmd__item-id">장면 05</span><span class="cmd__item-title">케어와 비스포크</span><span class="cmd__item-meta">가격표</span></div>
        <div class="cmd__item" role="option" data-href="~/pages/onboarding.html"><span class="cmd__item-id">장면 06</span><span class="cmd__item-title">프라이빗 뷰잉 예약</span><span class="cmd__item-meta">4단계</span></div>
        <div class="cmd__item" role="option" data-href="~/pages/profile.html"><span class="cmd__item-id">장면 07</span><span class="cmd__item-title">소장가 이연수 님</span><span class="cmd__item-meta">개인 컬렉션 북</span></div>
        <div class="cmd__item" role="option" data-href="~/pages/settings.html"><span class="cmd__item-id">장면 08</span><span class="cmd__item-title">연락과 보관</span><span class="cmd__item-meta">설정</span></div>
        <div class="cmd__item" role="option" data-href="~/pages/404.html"><span class="cmd__item-id">장면 09</span><span class="cmd__item-title">빈 세팅</span><span class="cmd__item-meta">404</span></div>
      </div>
    </div>
    <p class="cmd__empty" hidden>찾는 작품이 없습니다. 작품 번호(YS-HJ26-04)나 고객 성함으로 찾아 보세요.</p>
    <div class="cmd__foot"><span><span class="kbd">↑</span><span class="kbd">↓</span> 고르기</span><span><span class="kbd">↵</span> 열기</span><span><span class="kbd">esc</span> 닫기</span></div>
  </div>
</div>
```
토스트 영역(`.toaster`)은 app.js 가 필요할 때 만든다. 따로 넣지 않는다.

---

## 4. 컴포넌트 32종

공통 상태 규칙 — hover: 색 변화 또는 윤슬 스윕(배경 면 변화 최소) · focus-visible: 2px 백금 아웃라인 offset 4px(+ 아래 윤슬) · active: 불투명도 0.86 또는 면 한 단계 · disabled: `--text-subtle` + 점선/면 제거 · loading: `aria-busy="true"`(초침 스윕) · error: `aria-invalid="true"` + `--danger` + 한글 문장 · selected: `aria-selected`/`aria-current`/`aria-pressed` + 세로 또는 가로 윤슬 라인. 상태는 색만으로 전달하지 않는다.

### accordion — 헤어라인 행, 가는 십자
```html
<div class="acc" data-single>
  <div class="acc__item">
    <h3 class="acc__heading"><button class="acc__trigger" type="button" aria-expanded="true" aria-controls="acc-1" id="acc-1-h">원석과 감정<span class="acc__meta">GC-26-0398</span><span class="acc__cross" aria-hidden="true"></span></button></h3>
    <div class="acc__panel" id="acc-1" role="region" aria-labelledby="acc-1-h"><div class="acc__inner"><div class="acc__body"><p>남양 백진주 13.2mm, 다이아몬드 1.92ct. 감정 — 오세라(GIA G.G.).</p></div></div></div>
  </div>
  …
</div>
```
`data-single`이면 하나만 열린다. 닫힌 패널은 app.js 가 `inert`. 비활성: 버튼 `disabled`. 작게: `.acc--compact`.

### alert — 면 없음, 세로 윤슬 + 한글 상태 라벨
```html
<div class="alert alert--warning" role="status">
  <p class="alert__label"><span data-icon="clock"></span>홀드 만료 임박</p>
  <p class="alert__text">No.06 깊은 물 홀드가 11월 24일(화)에 끝납니다.</p>
  <div class="alert__actions"><button class="btn btn--ghost" type="button" data-open="hold-modal">홀드 연장</button></div>
  <button class="btn btn--ghost btn--icon alert__close" type="button" aria-label="알림 닫기" data-dismiss><span data-icon="close"></span></button>
</div>
```
톤: `--info`(감정서 발행) `--success`(소장 결정) `--warning`(홀드) `--danger`(취소·오류 — `role="alert"`). 여러 개는 `.alert-stack`.

### badge — 1px 테두리, 채움 금지
```html
<span class="badge badge--exhibit">전시 중</span>
<span class="badge badge--hold">홀드</span>
<span class="badge badge--sold">소장 결정</span>
<span class="badge badge--making">제작 중</span>
<span class="badge badge--nfs">비매</span>
<span class="badge badge--danger">취소</span>
<span class="badge badge--serial">No. 5/7</span>
<span class="badge badge--count">12</span>
<!-- 고르는 배지(필터) — 같은 data-toggle 값끼리 하나만 눌림 -->
<button class="badge" type="button" aria-pressed="true" data-toggle="kind">전체</button>
<button class="badge" type="button" aria-pressed="false" data-toggle="kind">링</button>
```
상태 텍스트(표·리스트 안) — `.status`(점 + 한글):
`status--live`(상담 중·도착) `--done`(완료·소장 결정) `--hold`(홀드·미답) `--plan`(예정·읽음) `--info` `--cancel`(취소).

### breadcrumb — 짧은 사선 구분자
```html
<nav class="crumb" aria-label="현재 위치"><ol>
  <li><a href="../index.html">컬렉션</a></li>
  <li><a href="../index.html#plate-xii">물비늘</a></li>
  <li><span aria-current="page">No.04 달그림자</span></li>
</ol></nav>
```

### button — 동사 라벨
```html
<button class="btn btn--primary" type="button">뷰잉 예약</button>
<button class="btn btn--secondary" type="button">서신 보내기</button>
<button class="btn btn--ghost" type="button">홀드 연장</button>
<button class="btn btn--danger btn--sm" type="button">예약 취소</button>
<button class="btn btn--secondary btn--icon" type="button" aria-label="이전 작품"><span data-icon="chevron-left"></span></button>
<button class="btn btn--primary btn--lg" type="button">소장 결정 기록 <span class="btn__meta">₩94,500,000</span></button>
<button class="btn btn--secondary" type="button" aria-pressed="true">전시 중만</button>
<!-- 로딩 시연: 1600ms 초침 스윕 후 완료(토스트) / data-busy-fail 이면 '다시 시도' 오류 상태 -->
<button class="btn btn--primary" type="button" data-busy="1600" data-toast="RV-261127-03 예약을 잡았습니다">예약 확정</button>
```
크기: 기본 48 · `--sm` 44 · `--lg` 56 · `--icon` 44×44 · `--block`. 상태: `disabled`, `aria-busy="true"`, `.is-error`. 묶음: `.btn-row`.

### calendar — 숫자만, 월요일 휴무 열
```html
<div data-calendar data-year="2026" data-month="11" data-selected="20" data-today="2026-11-20"
     data-booked="20,21,24,27" data-range="21-30" data-range-next="1-12" data-name="뷰잉 날짜">
  <div class="cal__legend"><span><i class="cal__key-dot"></i>예약 있음</span><span><i class="cal__key-line"></i>일반 공개 전시(11/21–12/12)</span><span><i class="cal__key-glint"></i>선택</span></div>
</div>
<p class="cal__output" data-cal-output aria-live="polite"></p>
```
옵션: `data-off="1"`(휴무 요일, 기본 월) · `data-disable-off`(휴무일 선택 불가 — 고객 예약) · `data-min="2026-11-21"`(이전 날짜 비활성). 화살표·Home·End 키 이동. 선택 시 `calendar:select` 이벤트.

### card — 캡션 카드(박스 금지)
```html
<div class="card-row">
  <a class="card" href="product.html">
    <div class="card__plate spot"><span data-object="drop"></span></div>
    <div class="card__caption caption">
      <span class="caption__no">No. 04</span><span class="caption__name">달그림자</span>
      <span class="caption__spec">플래티넘 · 남양 백진주 13.2mm</span>
      <span class="card__foot"><span class="caption__price">₩68,000,000</span><span class="badge badge--exhibit">전시 중</span></span>
    </div>
  </a>
</div>
```
상태: hover 조명 +8% · `.is-selected`/`aria-current`(판 안쪽 1px 백금) · `.card--sold`(소장 완료·비매 — 오브젝트가 어둠으로 물러남) · `.is-loading`(판 대신 `<span class="skel__block">`). 가로형: `.card--row`(프로필 홀드 카드).

### carousel — 회전 진열대
```html
<div class="carousel" data-carousel data-autoplay="7000" aria-roledescription="캐러셀" aria-label="회전 진열대 — 물비늘 열두 점">
  <div class="carousel__viewport"><div class="carousel__track">
    <div class="carousel__slide spot" aria-label="I / XII — 첫 물결">
      <div class="carousel__scene"><span data-object="ring"></span>
        <div class="caption"><span class="caption__no">No. 01</span><span class="caption__name">첫 물결</span><span class="caption__spec">플래티넘 · 실론 사파이어 5.12ct · 다이아몬드 0.86ct</span><span class="caption__id">YS-HJ26-01</span></div></div>
    </div>
    …
  </div></div>
  <div class="carousel__bar">
    <span class="carousel__count"><span class="roman carousel__now">I</span><span class="roman">/</span><span class="roman carousel__total">XII</span></span>
    <span class="carousel__progress" aria-hidden="true"></span>
    <button type="button" class="carousel__btn carousel__play" aria-pressed="true" aria-label="자동 넘김 멈추기"><span class="carousel__play-on" data-icon="pause"></span><span class="carousel__play-off" data-icon="play"></span></button>
    <button type="button" class="carousel__btn carousel__prev" aria-label="이전 작품"><span data-icon="chevron-left"></span></button>
    <button type="button" class="carousel__btn carousel__next" aria-label="다음 작품"><span data-icon="chevron-right"></span></button>
    <p class="vh carousel__live" aria-live="polite"></p>
  </div>
</div>
```
← → 키 · 스와이프 · hover/포커스 중 일시정지 · 축소 모션이면 자동 재생 꺼짐. 회전 진열대 판은 `data-scene="night"`.

### code — 토큰 사용 예시 전용
```html
<figure class="code">
  <figcaption class="code__head"><span class="code__file">fonts · head</span>
    <button type="button" class="code__copy" data-copy="code-fonts"><span data-icon="copy" class="icon--sm"></span><span class="code__copy-label">복사</span></button></figcaption>
  <pre class="code__pre" tabindex="0"><code id="code-fonts"><span class="tk-c">/* 윤슬 라인 */</span>
<span class="tk-s">.tabs__tab::after</span> { <span class="tk-p">background</span>: <span class="tk-v">var(--glint-line-solid)</span>; }</code></pre>
</figure>
```
토큰 색: `.tk-c` 주석 · `.tk-p` 속성 · `.tk-v` 값 · `.tk-s` 셀렉터 · `.tk-k` 키워드. 복사 성공 `.is-copied`(복사됨) / 실패 `.is-error`. 인라인: `<code class="code-inline">--glint</code>`.

### command — 3-6 스니펫. 열린 상태 정적 견본은 `.cmd.cmd--static`(스크림 없이 패널만, `hidden` 빼고, `id` 다르게). 트리거: `data-open="cmd"` 또는 ⌘K/Ctrl+K. ↑↓ Enter Esc, 입력하면 일치 부분에 밑줄(`<mark>`).

### drawer — 오른쪽 440px
```html
<button class="btn btn--secondary" type="button" data-open="rv-04">예약 상세</button>
<div class="drawer" id="rv-04" hidden>
  <div class="drawer__scrim" data-close></div>
  <aside class="drawer__panel" role="dialog" aria-modal="true" aria-labelledby="rv-04-t">
    <div class="drawer__head"><div><p class="drawer__eyebrow">RV-261120-04 · 19:00</p><h2 class="drawer__title" id="rv-04-t">이연수 님 — 첫 물결 상담</h2></div>
      <button class="btn btn--ghost btn--icon drawer__close" type="button" aria-label="닫기" data-close><span data-icon="close"></span></button></div>
    <div class="drawer__body">
      <dl class="facts">
        <div class="facts__row"><dt>회원</dt><dd>YC-04127 · 프리베 · 2014년 3월 첫 구매</dd></div>
        <div class="facts__row"><dt>담당 CA</dt><dd>서지안</dd></div>
        <div class="facts__row"><dt>관심 작품</dt><dd>No.01 첫 물결 · <span class="num">₩312,000,000</span></dd></div>
        <div class="facts__row"><dt>홀드</dt><dd>11월 27일(금)까지</dd></div>
      </dl>
    </div>
    <div class="drawer__foot"><button class="btn btn--primary" type="button" data-close data-toast="No.01 첫 물결 — 이연수 님 소장 결정이 기록되었습니다">소장 결정 기록</button><button class="btn btn--secondary" type="button">서신 보내기</button></div>
  </aside>
</div>
```
정적 견본: `.drawer.drawer--static`(부모 `position: relative` 안에서 열린 채, `hidden`·`aria-modal` 빼기). 왼쪽: `.drawer--left`.

### empty — 빈 프롱 세팅 + 한 줄
```html
<div class="empty">
  <div class="empty__plate spot"><span data-object="setting"></span></div>
  <div class="empty__body">
    <p class="empty__text">아직 소장하신 작품이 없습니다.</p>
    <p class="empty__hint">물비늘 열두 점은 11월 21일(토)부터 2층 갤러리에서 보실 수 있습니다.</p>
    <a class="btn btn--secondary btn--sm" href="../index.html">컬렉션 보기</a>
  </div>
</div>
```
판 크기(404): `.empty.empty--plate` — 오브젝트가 61.8%/44%에 조명을 받고 문장은 좌하단.

### form — 밑줄 입력
```html
<form class="form" data-validate data-success="RV-261127-03 · 11월 27일(금) 15:00 예약을 받았습니다." data-toast="뷰잉 예약을 받았습니다 — 서지안 CA가 하루 안에 서신을 드립니다">
  <div class="form-grid">
    <div class="field"><label class="field__label" for="f-name">성함 <span class="field__req">필수</span></label><input class="input" id="f-name" value="이연수" required></div>
    <div class="field"><label class="field__label" for="f-tel">연락처 <span class="field__req">필수</span></label><input class="input" id="f-tel" type="tel" placeholder="010-0000-0000" required></div>
    <div class="field is-wide"><label class="field__label" for="f-piece">관심 작품</label>
      <span class="select"><select class="input" id="f-piece"><option>No.01 첫 물결 · 링</option><option>No.04 달그림자 · 드롭 이어링</option></select></span>
      <p class="field__hint">홀드 중인 작품도 뷰잉은 가능합니다.</p></div>
  </div>
  <fieldset class="fieldset"><legend>방문 시각 — 11월 27일(금)</legend>
    <div class="slots">
      <label class="slot"><input type="radio" name="time" disabled><span>11:00</span></label>
      <label class="slot"><input type="radio" name="time" required><span>13:00</span></label>
      <label class="slot"><input type="radio" name="time" checked><span>15:00</span></label>
    </div>
  </fieldset>
  <label class="check"><input type="checkbox" checked><span>3층 프라이빗 살롱에서 보겠습니다<span class="check__sub">90분 · 동반 1인까지</span></span></label>
  <label class="radio"><input type="radio" name="confirm" checked><span>서신으로 확인</span></label>
  <label class="switch"><span>카카오 알림톡</span><span class="row"><span class="switch__state"></span><input type="checkbox" role="switch" checked></span></label>
  <div class="field"><label class="field__label" for="f-letter">전하실 말씀</label><textarea class="input input--letter" id="f-letter" maxlength="400"></textarea><span class="field__count" data-count-for="f-letter"></span></div>
  <div class="form__actions"><button class="btn btn--primary" type="submit">뷰잉 예약</button><span class="form__note">예약 확인은 하루 안에 서신으로 드립니다.</span></div>
  <p class="form__status" data-form-status aria-live="polite"></p>
</form>
```
- 입력 변형: `.input--num`(금액·수량, Cormorant) · `.input--area` · `.input--letter`(편지지 줄) · 검색 `<span class="search"><span data-icon="search"></span><input class="input" type="search"></span>`.
- 상태: `readonly`(점선), `disabled`(파선), `aria-invalid="true"` + `<p class="field__error" id="…"><span data-icon="alert"></span>연락처를 채워 주세요.</p>`(app.js 가 제출 시 자동 생성·`aria-describedby` 연결).
- 검증: required · `type="email"`(salon@yunseul.kr 형식) · `type="tel"`(010-4127-0315 형식) · `pattern`(+`data-msg`). `data-fail`을 달면 전송 실패 경로 시연.

### kanban — 아틀리에 공정 보드
```html
<div class="board-wrap"><div class="board" data-board aria-label="성수 아틀리에 공정 보드">
  <section class="board__col" aria-labelledby="col-1"><header class="board__head"><h3 class="board__name" id="col-1">스케치</h3><span class="board__count">2</span></header>
    <ul class="board__list">
      <li class="task" draggable="true" tabindex="0" aria-roledescription="이동 가능한 카드" aria-grabbed="false">
        <span class="task__thumb"><span data-object="ring" class="object--silhouette"></span></span>
        <div><span class="task__id">BS-2611-02</span><p class="task__title">송다인 님 약혼 링 · 오벌 다이아몬드 1.5ct</p><p class="task__meta"><span>윤채희</span><span>11월 28일(토)</span></p></div>
      </li>
      <li class="board__empty" hidden>비어 있음</li>
    </ul>
  </section>
  …(원석 확보 II · 왁스·주조 III · 세팅 IV · 연마·검수 V · 인도 대기 VI)
</div></div>
```
기한 D-1~D-3: `<span class="task__due--soon">11월 21일(토) 14:00 · D-1</span>`, 지남: `.task__due--over`. 드래그 또는 키보드(Space/Enter 들기 → ← → 열, ↑ ↓ 순서 → Enter 놓기, Esc 취소). 열 개수는 자동 갱신, 이동은 스크린리더로 안내. `.is-done` · `aria-disabled="true"`.

### list — 헤어라인 장부 줄
```html
<ul class="ledger">
  <li><a class="ledger__row is-unread" href="inbox.html" aria-current="true">
    <span class="ledger__time">19:12</span>
    <span class="ledger__main"><span class="ledger__title">첫 물결, 한 주만 더 생각할 시간을 주시겠어요</span><span class="ledger__sub">이연수 · LT-26-1107</span></span>
    <span class="ledger__end"><span class="status status--hold">미답</span></span>
  </a></li>
</ul>
```
`.is-unread`(시각 앞 글린트 점) · `aria-current`/`aria-selected`/`.is-selected`(면 + 세로 윤슬) · `.is-muted`(취소 — 취소선) · 여백 없는 판: `.ledger--flush`. 짧은 사실 목록: `.facts`(드로어 예시).

### marquee — 작품명 띠(28px/s)
```html
<div class="marquee" data-marquee><div class="marquee__track"><ul class="marquee__group">
  <li><span class="marquee__no">01</span>첫 물결</li><li><span class="marquee__no">02</span>물비늘</li> … <li><span class="marquee__no">12</span>윤슬</li>
</ul></div></div>
```
app.js 가 복제본(aria-hidden)을 붙이고 폭에 맞춰 속도를 계산한다. hover·포커스 시 정지, 축소 모션이면 정지 + 가로 스크롤. 작게: `.marquee--sm`.

### menu — 작품 동작
```html
<div class="menu">
  <button class="btn btn--secondary btn--sm" type="button" data-menu aria-haspopup="menu" aria-controls="piece-menu">작품 동작 <span data-icon="chevron-down" class="icon--sm"></span></button>
  <ul class="menu__list" id="piece-menu" role="menu" aria-label="작품 동작">
    <li class="menu__label" role="presentation">No.01 첫 물결</li>
    <li role="none"><button class="menu__item" role="menuitem" type="button" data-open="rv-04"><span data-icon="calendar"></span>뷰잉 예약 잡기</button></li>
    <li role="none"><button class="menu__item" role="menuitemradio" aria-checked="true" type="button"><span data-icon="clock"></span><span class="menu__text">홀드 — 11월 27일(금)까지</span></button></li>
    <li role="none"><button class="menu__item" role="menuitem" type="button" aria-disabled="true"><span data-icon="certificate"></span>감정서 재발행</button></li>
    <li role="separator" class="menu__sep"></li>
    <li role="none"><button class="menu__item menu__item--danger" role="menuitem" type="button" data-toast="No.01 홀드를 해제했습니다" data-toast-tone="warning">홀드 해제</button></li>
  </ul>
</div>
```
↓ ↑ Home End Esc · 바깥 클릭 닫기. 위로 열기 `.menu__list--up`, 왼쪽 맞춤 `.menu__list--start`. 정적 견본 `.menu__list--static`(hidden·id 없이).

### modal — 하단 1/3 지점, 상단 윤슬
```html
<div class="modal" id="hold-modal" hidden>
  <div class="modal__scrim" data-close></div>
  <div class="modal__panel" role="dialog" aria-modal="true" aria-labelledby="hold-t">
    <p class="modal__eyebrow">YS-HJ26-01 · 이연수 님</p>
    <h2 class="modal__title" id="hold-t">No.01 홀드를 11월 27일(금)까지 연장할까요?</h2>
    <div class="modal__body"><p>연장하면 7일 동안 다른 고객의 뷰잉 예약이 막힙니다.</p></div>
    <div class="modal__foot"><button class="btn btn--primary" type="button" data-close data-toast="No.01 첫 물결 홀드를 11월 27일(금)까지 연장했습니다">홀드 연장</button><button class="btn btn--ghost" type="button" data-close>그대로 두기</button></div>
    <button class="btn btn--ghost btn--icon modal__close" type="button" aria-label="닫기" data-close><span data-icon="close"></span></button>
  </div>
</div>
```
포커스 트랩 · Esc · 스크림 클릭 · 닫으면 트리거로 포커스 복귀. 첫 포커스는 `data-autofocus` 요소. 모바일은 하단 시트. 정적 견본 `.modal.modal--static`.

### motion — 시그니처 시연
```html
<div class="motion" id="motion-demo">
  <div class="motion__row"><div class="motion__name"><b>윤슬 스윕</b><span>1200ms · ease-silk</span></div><div class="motion__stage"><span class="glint"></span></div><button class="btn btn--ghost btn--sm" type="button" data-motion-replay="motion-demo">다시 비추기</button></div>
  <div class="motion__row"><div class="motion__name"><b>플레이트 진입</b><span>900ms · y 12px</span></div><div class="motion__stage"><span class="motion__reveal">달그림자</span></div><span></span></div>
  <div class="motion__row"><div class="motion__name"><b>초침</b><span>60s linear</span></div><div class="motion__stage"><span class="motion__hand" aria-hidden="true"></span></div><span></span></div>
</div>
```
`data-motion-replay`가 범위 안의 `.glint`와 `.motion__reveal`을 다시 재생한다.

### navbar — 3-1 / 3-2 스니펫

### pagination — 룩북 넘김
```html
<div class="pager" data-pager data-total="2" data-current="1" data-pager-for="ledger-pages">
  <button type="button" class="pager__btn pager__prev" aria-label="이전 장"><span data-icon="chevron-left"></span></button>
  <span class="pager__now" aria-live="polite"><span class="pager__cur">1</span><span class="pager__sep">/</span><span class="pager__total">2</span></span>
  <button type="button" class="pager__btn pager__next" aria-label="다음 장"><span data-icon="chevron-right"></span></button>
</div>
```
`data-pager-for`의 요소 안에서 `data-page="1|2"`인 행만 보인다. 양 끝에서 버튼 비활성. `pager:change` 이벤트.

### popover — 캐럿 설명
```html
<span class="pop">
  <button type="button" class="pop__trigger" data-popover aria-controls="pop-ct">5.12ct</button>
  <span class="pop__panel" id="pop-ct" role="dialog" aria-label="캐럿 설명">
    <span class="pop__title">캐럿(ct)</span>
    <span class="pop__body">보석의 무게 단위입니다. 1ct는 0.2g — 첫 물결의 실론 사파이어는 1.024g입니다.</span>
    <span class="pop__meta">GC-26-0377 · 오세라 G.G.</span>
  </span>
</span>
```
`.pop__panel--end`(오른쪽 맞춤) · `--up` · 정적 `--static`. Esc·바깥 클릭으로 닫힘.

### progress — 선형 · 불릿 · 다이얼 게이지
```html
<div class="progress" role="progressbar" aria-valuenow="68" aria-valuemin="0" aria-valuemax="100" aria-label="4분기 목표 달성">
  <div class="progress__head"><span class="progress__label">4분기 목표 ₩4,200,000,000</span><span class="progress__value">68.4%</span></div>
  <div class="progress__track"><span class="progress__fill" style="--value:68.4%"></span></div>
  <span class="progress__note">누적 ₩2,874,000,000</span>
</div>
<div class="bullet"><div class="bullet__head"><span>11월 1–20일</span><span class="num">₩1,768,000,000</span></div>
  <div class="bullet__track"><span class="bullet__fill" style="--value:84%"></span><span class="bullet__target" style="--target:66.7%" data-label="20일 목표"></span></div></div>
<div data-gauge="68.4" data-target="100" data-gauge-label="4분기 목표" data-time="19:40" role="img" aria-label="4분기 목표 68.4% 달성, 바늘 19시 40분"></div>
```
상태: `.is-complete`(비취 + '완료') · `.is-error` · `.is-paused` · `.progress--indeterminate`. `--value`·`--target`은 인라인 스타일 커스텀 프로퍼티로만(그리드 속성 아님). 게이지는 60눈금 중 값만큼 백금, 목표 눈금은 빛점, 바늘은 19:40 + 초침.

### sidebar — 3-3 스니펫. 접힌 견본(index 판 XI): `<nav class="side side--compact" aria-label="…">`(아이콘만, 사용자 아바타).

### skeleton — 빛점이 지나가는 면
```html
<div class="skel" aria-busy="true" aria-label="장부 불러오는 중">
  <span class="skel__line skel__line--title"></span><span class="skel__line"></span><span class="skel__line skel__line--short"></span>
</div>
<div class="skel__row"><span class="skel__line"></span><span class="skel__line"></span><span class="skel__line"></span></div>
```
`.skel__block`(4:5 썸네일) · `.skel__circle`(아바타).

### spinner — 초침 스윕
```html
<span class="spinner" role="status"><span class="vh">불러오는 중</span></span>
<span class="spinner spinner--lg" role="status"><span class="vh">불러오는 중</span></span>
<span class="spinner-row"><span class="spinner" aria-hidden="true"></span>장부 불러오는 중</span>
```

### steps — 로마 숫자 단계
```html
<div data-stepper>
  <ol class="steps" aria-label="뷰잉 예약 단계">
    <li class="steps__item is-done"><button type="button" class="steps__link"><span class="steps__num roman">I</span><span class="steps__label">방문 목적</span></button></li>
    <li class="steps__item is-done"><button type="button" class="steps__link"><span class="steps__num roman">II</span><span class="steps__label">관심 작품</span></button></li>
    <li class="steps__item" aria-current="step"><span class="steps__num roman">III</span><span class="steps__label">일시</span><span class="steps__hint">11월 27일(금)</span></li>
    <li class="steps__item"><span class="steps__num roman">IV</span><span class="steps__label">확인</span></li>
  </ol>
  <section data-step-panel hidden>…</section>
  <section data-step-panel hidden>…</section>
  <section data-step-panel>… <button type="button" class="btn btn--ghost" data-step-prev>이전</button><button type="button" class="btn btn--primary" data-step-next>다음 — 확인</button></section>
  <section data-step-panel hidden>…</section>
</div>
```
`data-step-next`는 현재 패널의 required 를 검사한 뒤 넘긴다. 완료된 단계 버튼으로 되돌아갈 수 있다. `.is-error`(파선 아닌 가넷 선).

### table — 헤어라인 장부
```html
<div class="table-wrap">
  <table class="table table--ledger table--inset">
    <caption class="vh">11월 20일(금) 프리뷰 장부 10건</caption>
    <thead><tr>
      <th class="t-check"><label class="check"><input type="checkbox" aria-label="전체 선택"></label></th>
      <th aria-sort="ascending" data-type="text"><button class="table__sort" type="button">시각</button></th>
      <th>예약번호</th>
      <th aria-sort="none" data-type="text"><button class="table__sort" type="button">고객</button></th>
      <th>담당 CA</th><th>관심 작품</th>
      <th class="t-num" aria-sort="none" data-type="num"><button class="table__sort" type="button">작품가</button></th>
      <th>상태</th>
    </tr></thead>
    <tbody>
      <tr>
        <td class="t-check"><label class="check"><input type="checkbox" aria-label="이연수 님 선택"></label></td>
        <td class="t-time">19:00</td><td class="t-mono">RV-261120-04</td>
        <td class="cell-main">이연수</td><td class="t-muted">서지안</td><td>No.01 첫 물결</td>
        <td class="t-num">₩312,000,000</td>
        <td class="cell-end"><span class="status status--live">상담 중</span></td>
      </tr>
      <tr class="is-muted">… <td class="cell-end"><span class="status status--cancel">취소 · 11월 27일(금)로 변경</span></td></tr>
    </tbody>
  </table>
</div>
<div class="table__foot"><span data-select-count></span><span class="vh" data-sort-live aria-live="polite"></span></div>
```
- 정렬: `<th aria-sort data-type="num|text">` 안 `<button class="table__sort">`. "가격 문의"처럼 숫자가 아닌 칸은 `data-value="0"`.
- 선택: 체크하면 행 `aria-selected="true"`(면 + 좌측 세로 윤슬), 머리 체크박스는 전체/부분(indeterminate). 개수는 `[data-select-count]`.
- 모바일(<720) `.table--ledger`: 1행 = `.cell-main` + `.cell-end`, 2행 = 나머지 작은 회색. 숨길 칸은 `.cell-hide-sm`.

### tabs — 텍스트만, 활성 밑줄 = 윤슬
```html
<div class="tabs">
  <div class="tabs__bar"><div class="tabs__list" role="tablist" aria-label="장부 상태">
    <button class="tabs__tab" role="tab" id="tab-all" aria-selected="true" aria-controls="panel-all">전체 <span class="tabs__count">10</span></button>
    <button class="tabs__tab" role="tab" id="tab-live" aria-selected="false" aria-controls="panel-live">상담 중 <span class="tabs__count">2</span></button>
    <button class="tabs__tab" role="tab" id="tab-plan" aria-selected="false" aria-controls="panel-plan">예정 <span class="tabs__count">3</span></button>
    <button class="tabs__tab" role="tab" id="tab-done" aria-selected="false" aria-controls="panel-done">완료 <span class="tabs__count">3</span></button>
    <button class="tabs__tab" role="tab" id="tab-cancel" aria-selected="false" aria-controls="panel-cancel">취소 <span class="tabs__count">1</span></button>
  </div></div>
  <div class="tabs__panel" role="tabpanel" id="panel-all" aria-labelledby="tab-all" tabindex="0">…</div>
  <div class="tabs__panel" role="tabpanel" id="panel-live" aria-labelledby="tab-live" tabindex="0" hidden>…</div>
</div>
```
← → Home End. 넘치면 `.tabs__bar[data-overflow]`로 양 끝 페이드 힌트(배경이 `--bg`가 아닌 면 위라면 `--tabs-bg`로 지정).

### timeline — 세로 스파인, 지금 = 글린트 점
```html
<ol class="tl">
  <li class="tl__item is-past"><span class="tl__time">18:20</span><div class="tl__body"><span class="tl__title">한소이 님 — No.03 새벽 수면 소장 결정</span><span class="tl__meta">백하린 · <span class="mono">RV-261120-02</span></span></div></li>
  <li class="tl__item tl__item--now"><span class="tl__time">19:40</span><div class="tl__body"><span class="tl__now-label">지금</span><span class="tl__title">류세온 님 도착 — No.12 윤슬</span><span class="tl__meta">서지안 · 3층 살롱</span></div></li>
  <li class="tl__item"><span class="tl__time">20:00</span><div class="tl__body"><span class="tl__title">차은결 님 — No.07 물안개</span><span class="tl__meta">백하린</span></div></li>
  <li class="tl__item is-cancel"><span class="tl__time">21:00</span><div class="tl__body"><span class="tl__title">장이준 님 — 11월 27일(금)로 변경</span><span class="tl__meta">서지안</span></div></li>
</ol>
```
좁은 열: `.tl--compact`. 항목 링크: `<a class="tl__link">`.

### toast — 오른쪽 아래, 6000ms
트리거: `<button … data-toast="No.03 새벽 수면 — 한소이 님 소장 결정이 기록되었습니다" data-toast-tone="success" data-toast-label="기록됨">` · JS: `YS.toast({ text, tone: "success|warning|danger|info", label })`. hover 하면 시간이 멈춘다. 정적 견본:
```html
<div class="toast toast--success toast--static"><span class="toast__label">기록됨</span><p class="toast__text">No.03 새벽 수면 — 한소이 님 소장 결정이 기록되었습니다</p><button type="button" class="btn btn--ghost btn--icon toast__close" aria-label="알림 닫기"><span data-icon="close"></span></button></div>
```

### tooltip — 400ms 지연, 화살표 없음
```html
<span class="tip"><button type="button" class="btn btn--secondary btn--icon" aria-label="감정서" aria-describedby="tip-gc"><span data-icon="certificate"></span></button><span class="tip__bubble" role="tooltip" id="tip-gc">감정서 GC-26-0398 · 오세라 발행</span></span>
```
아래로 `.tip--bottom`, 왼쪽 맞춤(화면 왼쪽 끝 근처) `.tip--start`, 정적 `.tip__bubble--static`. Esc 로 숨김.

---

## 5. 장면 작성 체크

1. 첫 화면은 오브젝트 하나 + 모서리 글자. eyebrow·CTA 쌍·통계 4칸·가운데 정렬 섹션 헤더 금지. 판 중앙부는 오브젝트와 어둠의 몫, 글자는 판 면적 15% 이하.
2. 판 종류 A 단독 · B 이면 · C 쉼표 · D 밀착 인화를 교차(같은 종류 연속 금지). 오브젝트 중심은 61.8% 또는 38.2%.
3. 판 사이 간격 0. 경계는 `--bg` ↔ `--bg-void`와 1px `--line`(또는 `.glint`).
4. 넓은 자간은 라틴·숫자만(`.label-latin`, `.caption__no`). 한글 라벨은 `.label`(자간 0). 굵기 600 이상 금지 — 위계는 크기와 여백.
5. 숫자·금액은 `.num`/`.price`(줄바꿈 금지). `₩`를 따로 떼지 않는다.
6. 다크 모드는 "프리뷰 밤 19:40", 라이트는 "11월 21일(토) 14:00 갤러리". 밤 판(`data-scene="night"`)은 라이트에서도 어둡다. 두 모드, 1440 · 390 모두 스크린샷으로 확인.
7. 오버레이(모달·드로어·메뉴·팝오버·커맨드)는 index 에서 **정적으로 열린 견본 + 실제 트리거**를 둘 다 둔다.
8. 모든 날짜·요일·시각·이름·금액·ID는 DIRECTION.md 팩트 시트 값만.
9. 장면 CSS 에 raw hex 금지 — 필요한 색이 없으면 semantic.css 에 토큰을 먼저 제안.
10. 축소 모션: 글린트 50% 정지, 초침 19:40:00, 캐러셀 자동 재생 끔, 진입 즉시 최종 상태 — 시스템이 처리하므로 장면에서 별도 애니메이션을 만들면 같은 규칙을 지킨다.
