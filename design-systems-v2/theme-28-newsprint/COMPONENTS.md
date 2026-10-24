# 여명일보 · 컴포넌트 마크업 계약 (theme-28 newsprint v2)

index.html·pages/*.html 을 만드는 단계는 **이 문서와 `DIRECTION.md`만 보고** 마크업한다.
세계관·날짜·인물·가격은 `DIRECTION.md` 2절 팩트 시트 값만 쓴다(기준 지면 2026년 10월 27일 화요일자, 제22,184호).

- 클래스는 BEM(`block__elem--mod`). 상태는 가능하면 ARIA 속성(`aria-selected` `aria-expanded` `aria-current` `aria-pressed` `aria-busy` `aria-invalid` `hidden`)으로 표현하고 CSS가 그 속성을 읽는다.
- 인라인 `style`은 **CSS 변수 주입에만** 쓴다(`style="--value:80.5%"`, `style="--ratio:16/9"`). 인라인 grid-template-columns · onclick · `href="#"` 금지.
- 장면 CSS(`index.css`, `pages/<name>.css`)도 semantic 토큰만 쓴다. 원시 토큰(`--c-*`)·hex 금지.
- radius 0, 그림자 없음(얹힌 종이 = 호외 판·메뉴·기사 검색만 `var(--sheet-shadow)`), 그라디언트 없음(접힘선 `.fold`만).
- 한글 라벨에 넓은 자간·모노 금지. 모노(`.mono`)는 기사 ID·시각·전화번호·hex 같은 **라틴·숫자에만**.
- 이모지 금지. 아이콘은 `data-icon`(아래) 또는 조판 기호 ◆ ▶ ※ ■ ›.

---

## 0. 공통 머리말 (모든 HTML)

```html
<!doctype html>
<html lang="ko" class="no-js">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>편집국 상황판 · 여명일보</title>
<script>(function(){var d=document.documentElement,t=null;try{var q=new URLSearchParams(location.search).get('theme');if(q==='dark'||q==='light')t=q}catch(e){}if(!t){try{t=localStorage.getItem('ym-theme')}catch(e){}}if(t!=='dark'&&t!=='light'){t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}d.setAttribute('data-theme',t)})();</script>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Black+Han+Sans&family=Gothic+A1:wght@400;600;800&family=Hahmlet:wght@500;700;900&family=IBM+Plex+Mono:wght@400;500&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,700;1,6..72,400&family=Noto+Serif+KR:wght@400;600;900&display=swap">
<link rel="stylesheet" href="../styles.css">      <!-- index 는 styles.css -->
<link rel="stylesheet" href="dashboard.css">      <!-- 장면 전용. index 는 index.css -->
<script src="../app.js" defer></script>           <!-- index 는 app.js -->
</head>
```
- 테마 키 `ym-theme`. 우선순위: URL `?theme=dark|light`(저장 안 함) → localStorage → `prefers-color-scheme`.
- `<title>` 형식: `<장면 이름> · 여명일보` (index 는 `여명일보 · 2026년 10월 27일 화요일자`).

---

## 1. 복사해서 쓰는 공통 셸

**모든 페이지가 아래 셸을 글자 그대로 복사한다.** 바꾸는 곳은 딱 두 가지:
① 경로(index 판 / pages 판), ② 현재 페이지 링크 하나에만 `aria-current="page"`.
- navbar 면 색인 줄에 없는 페이지(onboarding · 404)는 navbar 에는 `aria-current`를 달지 않는다. settings 는 「내 구독」에 단다.
- footer 판권 줄에는 10개 화면이 모두 실려 있으므로 **모든 페이지가** 자기 링크에 `aria-current="page"`를 단다(onboarding → 「구독 신청」, 404 → 「바로잡습니다」).
- **면 번호(A1·B8 등)는 실제 지면에만 붙인다.** 조판실 도구(상황판·면 배열·송고함·기자 페이지)와 독자서비스(구독 안내·그날의 1면·내 구독)는 면이 아니므로 면 번호 대신 `.nav__group` 묶음 라벨(「조판실」「독자서비스」) 아래에 둔다. 면 번호와 면 이름은 DIRECTION.md 「36면 면 배정표」만 따른다.
- **면 머리(`.runhead__page`)·면 경로(`.crumbs`)도 같은 규칙.** 지면이 아닌 화면은 `조판실 · 편집국 상황판`, `독자서비스 · 구독 신청`, `독자서비스 · 구독자 설정`, `기자 페이지 · 사회부`처럼 「묶음 · 화면 이름」으로 쓴다. 경로는 `여명일보 › 조판실 · 기자 페이지 › 사회부 문해담`, `여명일보 › 독자서비스 · 구독 안내 › 구독 신청`. `A1 하단 광고`, `A3 사회` 같은 면 번호는 index 지면(A1·A9·A27·B7)에서만 쓴다. 「1면 하단 광고에서 오려 낸 쿠폰」 같은 서사는 쿠폰 부제 등 본문 안에만 남긴다.
- 셸 순서: `skip-link` → `.ticker`(속보 띠) → `header.nav` → 본문(`main#main` 또는 `.desk`) → `footer.site-foot` → (페이지의 오버레이들) → 페이지 끝.

### 1-A. 속보 띠 + navbar — index 경로판 (`index.html`)

```html
<body>
<a class="skip-link" href="#main">본문 바로가기</a>
<div class="ticker" role="region" aria-label="속보">
  <span class="ticker__label">속보</span>
  <div class="ticker__viewport">
    <div class="ticker__track">
      <p class="ticker__run">
        <span class="ticker__item"><span class="mono">05:30</span> 대전역 동광장 임시 정류장 27일 오전 5시 30분부터 운영</span>
        <span class="ticker__item">시내버스 41개 노선 11월 3일 첫차부터 전면 개편 — 바뀐 노선도 A3면</span>
        <span class="ticker__item">갑천 둔치 「밤 도서관」 31일 토요일 오후 6시 개장</span>
        <span class="ticker__item">대덕 산간 첫 서리, 아침 최저 영하 1도</span>
      </p>
    </div>
  </div>
  <button class="ticker__toggle" type="button" data-ticker-toggle aria-pressed="false" aria-label="속보 띠 멈추기"><span data-icon="pause"></span><span class="ticker__toggle-text">정지</span></button>
</div>
<header class="nav">
  <div class="sheet nav__bar">
    <a class="nav__brand" href="index.html" aria-label="여명일보 1면으로"><span class="nav__wordmark">여명일보</span><span class="nav__hanja">黎明日報</span></a>
    <p class="nav__edition"><span class="edition"><span class="latin">50</span>판</span><time datetime="2026-10-27">2026년 10월 27일 화요일</time></p>
    <div class="nav__tools">
      <button class="nav__search" type="button" data-cmd-open aria-label="기사 검색 (⌘K)"><span data-icon="search"></span><span class="nav__search-text">기사·기자·면 검색</span><kbd class="kbd">⌘K</kbd></button>
      <button class="nav__mode" type="button" data-theme-toggle aria-pressed="false" aria-label="야간판(다크 모드)으로 전환">
        <span class="nav__mode-opt nav__mode-opt--light"><span data-icon="sun"></span><span class="nav__mode-text">주간판</span></span>
        <span class="nav__mode-opt nav__mode-opt--dark"><span data-icon="moon"></span><span class="nav__mode-text">야간판</span></span>
      </button>
      <a class="btn btn--primary btn--sm nav__cta" href="pages/onboarding.html">구독 신청</a>
    </div>
  </div>
  <nav class="sheet nav__index" aria-label="오늘의 지면">
    <div class="nav__scroller">
      <ul class="nav__list">
        <li class="nav__item"><a class="nav__link" href="index.html" aria-current="page"><span class="nav__pg">A1</span>1면</a></li>
        <li class="nav__group"><span class="nav__group-label">조판실</span></li>
        <li class="nav__item"><a class="nav__link" href="pages/dashboard.html">상황판</a></li>
        <li class="nav__item"><a class="nav__link" href="pages/kanban.html">면 배열</a></li>
        <li class="nav__item"><a class="nav__link" href="pages/inbox.html">제보·송고함</a></li>
        <li class="nav__item"><a class="nav__link" href="pages/profile.html">기자 페이지</a></li>
        <li class="nav__group"><span class="nav__group-label">독자서비스</span></li>
        <li class="nav__item"><a class="nav__link" href="pages/pricing.html">구독 안내</a></li>
        <li class="nav__item"><a class="nav__link" href="pages/product.html">그날의 1면</a></li>
        <li class="nav__item nav__item--push"><a class="nav__link" href="pages/settings.html">내 구독</a></li>
      </ul>
    </div>
    <span class="nav__rule" aria-hidden="true"></span>
  </nav>
</header>
```

### 1-B. 속보 띠 + navbar — pages 경로판 (`pages/*.html`)

1-A 와 **완전히 같은 마크업**에서 링크만 바꾼다(아래는 바뀌는 줄 전부). 예시는 dashboard(현재 = 상황판).
```html
    <a class="nav__brand" href="../index.html" aria-label="여명일보 1면으로">…</a>
      <a class="btn btn--primary btn--sm nav__cta" href="onboarding.html">구독 신청</a>
        <li class="nav__item"><a class="nav__link" href="../index.html"><span class="nav__pg">A1</span>1면</a></li>
        <li class="nav__group"><span class="nav__group-label">조판실</span></li>
        <li class="nav__item"><a class="nav__link" href="dashboard.html" aria-current="page">상황판</a></li>
        <li class="nav__item"><a class="nav__link" href="kanban.html">면 배열</a></li>
        <li class="nav__item"><a class="nav__link" href="inbox.html">제보·송고함</a></li>
        <li class="nav__item"><a class="nav__link" href="profile.html">기자 페이지</a></li>
        <li class="nav__group"><span class="nav__group-label">독자서비스</span></li>
        <li class="nav__item"><a class="nav__link" href="pricing.html">구독 안내</a></li>
        <li class="nav__item"><a class="nav__link" href="product.html">그날의 1면</a></li>
        <li class="nav__item nav__item--push"><a class="nav__link" href="settings.html">내 구독</a></li>
```
- 조판실(내부) 페이지(dashboard · inbox · kanban)는 `.nav__edition` 뒤에 `<span class="nav__desk">조판실</span>` 한 개를 덧붙여도 된다(모바일에서 자동 숨김). 그 외 변형 금지.

### 1-C. 판권 줄 footer — index 경로판

```html
<footer class="site-foot">
  <div class="sheet">
    <div class="site-foot__rule" aria-hidden="true"></div>
    <nav class="site-foot__links" aria-label="지면 색인">
      <ul class="site-foot__list">
        <li><a class="site-foot__link" href="index.html" aria-current="page"><span class="mono">A1</span>1면</a></li>
        <li><a class="site-foot__link" href="pages/dashboard.html">편집국 상황판</a></li>
        <li><a class="site-foot__link" href="pages/profile.html">기자 문해담</a></li>
        <li><a class="site-foot__link" href="pages/inbox.html">제보·송고함</a></li>
        <li><a class="site-foot__link" href="pages/kanban.html">면 배열</a></li>
        <li><a class="site-foot__link" href="pages/pricing.html">구독 안내</a></li>
        <li><a class="site-foot__link" href="pages/product.html">그날의 1면</a></li>
        <li><a class="site-foot__link" href="pages/onboarding.html">구독 신청</a></li>
        <li><a class="site-foot__link" href="pages/settings.html">구독자 설정</a></li>
        <li><a class="site-foot__link" href="pages/404.html">바로잡습니다</a></li>
      </ul>
    </nav>
    <p class="site-foot__imprint">발행인·편집인 한석주 · 대전광역시 중구 중앙로 112 여명빌딩 · 대표 <span class="mono">042-250-0100</span> · 독자서비스 <span class="mono">042-250-0114</span> · 제보 <span class="mono">042-250-0119</span> · 정기간행물 등록 대전 가00012 · 제22,184호</p>
    <p class="site-foot__copy"><span class="site-foot__mark">여명일보</span> 黎明日報 · 1953년 9월 15일 창간 · 해보다 먼저 문 앞에 · © 1953–2026 여명일보</p>
  </div>
</footer>
```

### 1-D. 판권 줄 footer — pages 경로판

1-C 와 같고 `href`만 바꾼다: `index.html` → `../index.html`, `pages/xxx.html` → `xxx.html`. `aria-current="page"`는 현재 페이지 링크로 옮긴다(dashboard 이면 `dashboard.html` 링크에, 404 이면 `404.html` 「바로잡습니다」에).

### 1-E. 조판실 사이드바 + 본문 (pages 전용 — dashboard · inbox · kanban)

navbar 바로 다음, footer 바로 앞에 놓는다. `main` 대신 `.desk` 안의 `main.desk__main#main`이 본문이다. 현재 페이지 링크에만 `aria-current="page"`. 독자용 페이지(pricing · product · onboarding · settings · profile · 404)는 사이드바 없이 `<main id="main" class="sheet">`를 쓴다.
```html
<div class="desk">
  <aside class="side" aria-label="조판실 면 색인">
    <button class="side__toggle" type="button" data-side-toggle aria-controls="side-body" aria-expanded="true">조판실 면 색인</button>
    <div class="side__body" id="side-body">
      <p class="side__title">여명 조판실 <span class="mono">desk.yeomyeong.kr</span></p>
      <div class="side__group">
        <p class="side__heading">오늘 밤 50판</p>
        <a class="side__link" href="dashboard.html" aria-current="page"><span class="side__text">편집국 상황판</span><span class="leader"></span><span class="side__pg side__pg--ui">50판</span></a>
        <a class="side__link" href="kanban.html"><span class="side__text">면 배열 보드</span><span class="leader"></span><span class="side__pg side__pg--ui">쪽지 16</span></a>
        <a class="side__link" href="inbox.html"><span class="side__text">제보·송고함</span><span class="count count--spot side__badge">7</span><span class="leader"></span><span class="side__pg side__pg--ui">214건</span></a>
      </div>
      <div class="side__group">
        <p class="side__heading">기자</p>
        <a class="side__link" href="profile.html"><span class="side__text">사회부 문해담</span><span class="leader"></span><span class="side__pg side__pg--ui">사회부</span></a>
      </div>
      <div class="side__group">
        <p class="side__heading">독자 지면</p>
        <a class="side__link" href="../index.html"><span class="side__text">오늘의 1면</span><span class="leader"></span><span class="side__pg">A1</span></a>
        <a class="side__link" href="pricing.html"><span class="side__text">구독 안내</span><span class="leader"></span><span class="side__pg side__pg--ui">월 ₩20,000~</span></a>
        <a class="side__link" href="product.html"><span class="side__text">그날의 1면</span><span class="leader"></span><span class="side__pg side__pg--ui">₩29,000~</span></a>
        <a class="side__link" href="settings.html"><span class="side__text">구독자 설정</span><span class="leader"></span><span class="side__pg">—</span></a>
      </div>
      <div class="side__group side__group--duty">
        <p class="side__heading">오늘 밤 당번</p>
        <p class="side__row"><span>야간 데스크</span><span class="leader"></span><span>차윤서</span></p>
        <p class="side__row"><span>교열</span><span class="leader"></span><span>표선아</span></p>
        <p class="side__row"><span>사진</span><span class="leader"></span><span>노은별</span></p>
        <p class="side__row"><span>조판</span><span class="leader"></span><span>6층 4명</span></p>
        <p class="side__row"><span>윤전</span><span class="leader"></span><span>여명인쇄센터 2대</span></p>
      </div>
      <p class="side__foot">야간 데스크 차윤서 편집부장<br>50판 강판 <span class="mono">01:20</span> · 윤전 <span class="mono">01:35</span></p>
    </div>
  </aside>
  <main class="desk__main" id="main">
    <div class="runhead" data-rule-in><span class="runhead__page">조판실 · 편집국 상황판</span><span class="runhead__date">2026년 10월 26일 월요일 밤</span><span class="runhead__paper">여명 조판실</span></div>
    <!-- 장면 -->
  </main>
</div>
```
- 「새 제보 7」 숫자(`count--spot` 7)는 셸 고정값. inbox 장면의 미확인 제보도 7건으로 맞춘다.
- <1024 에서 사이드바는 본문 위로 올라가 「조판실 면 색인 ▼」 단추로 접힌다(app.js 가 처음엔 접힌 상태로 둔다).

### 1-F. 기사 검색 팔레트 (모든 페이지 공통 — footer 다음)

navbar 의 ⌘K 단추와 단축키가 이 요소를 연다. **모든 페이지에 하나씩** 둔다. 결과 항목 `data-href`는 경로판에 맞춘다(아래는 index 판, pages 판은 `index.html`→`../index.html`, `pages/x.html`→`x.html`).
```html
<div class="cmd" id="cmd" data-cmd hidden role="dialog" aria-modal="true" aria-label="기사 검색">
  <div class="cmd__scrim" data-close></div>
  <div class="cmd__panel">
    <div class="cmd__search"><span data-icon="search"></span><input class="cmd__input" placeholder="기사 제목·기자·면 번호로 찾기" aria-label="기사 검색"><kbd class="kbd">Esc</kbd></div>
    <ul class="cmd__list" id="cmd-list">
      <li class="cmd__group" role="presentation">오늘 1면</li>
      <li class="cmd__opt" data-href="index.html" data-keywords="버스 노선 교통"><span class="cmd__page">A1</span><span class="cmd__title">시내버스 41개 노선 26년 만에 전면 개편</span><span class="cmd__by">문해담</span></li>
      <li class="cmd__opt" data-href="pages/inbox.html"><span class="cmd__page">A1</span><span class="cmd__title"><span class="tag tag--spot">단독</span>갑천 둔치에 '밤 도서관' 연다</span><span class="cmd__by">고태석</span></li>
      <li class="cmd__opt" data-href="index.html"><span class="cmd__page">A1</span><span class="cmd__title">원도심 은행동 상가 '밤 10시까지' 연장 영업 시범</span><span class="cmd__by">고태석</span></li>
      <li class="cmd__opt" data-href="index.html"><span class="cmd__page">A27</span><span class="cmd__title"><span class="tag">사설</span>노선 개편, 첫 주 혼선부터 줄여야</span><span class="cmd__by">논설위원실</span></li>
      <li class="cmd__group" role="presentation">지면 바로 가기</li>
      <li class="cmd__opt" data-href="pages/dashboard.html"><span class="cmd__page cmd__page--ui">조판실</span><span class="cmd__title">편집국 상황판 · 50판</span><span class="cmd__by">조판실</span></li>
      <li class="cmd__opt" data-href="pages/kanban.html"><span class="cmd__page cmd__page--ui">조판실</span><span class="cmd__title">면 배열 보드</span><span class="cmd__by">조판실</span></li>
      <li class="cmd__opt" data-href="pages/profile.html"><span class="cmd__page cmd__page--ui">조판실</span><span class="cmd__title">기자 페이지 — 문해담</span><span class="cmd__by">사회부</span></li>
      <li class="cmd__opt" data-href="pages/pricing.html"><span class="cmd__page cmd__page--ui">독자</span><span class="cmd__title">구독 안내 · 월 ₩20,000부터</span><span class="cmd__by">독자서비스</span></li>
      <li class="cmd__opt" data-href="pages/product.html"><span class="cmd__page cmd__page--ui">독자</span><span class="cmd__title">「그날의 1면」 복각본</span><span class="cmd__by">독자서비스</span></li>
    </ul>
    <p class="cmd__empty" hidden>「<span data-cmd-query></span>」에 맞는 기사가 없습니다. 제보는 042-250-0119.</p>
    <div class="cmd__foot"><span><kbd class="kbd">↑↓</kbd>이동</span><span><kbd class="kbd">↵</kbd>열기</span><span class="hide-sm"><kbd class="kbd">Esc</kbd>닫기</span></div>
  </div>
</div>
</body></html>
```

---

## 2. 토큰 요약 (semantic.css — 장면 CSS 는 이것만)

| 용도 | 토큰 |
|---|---|
| 지면 | `--paper`(갱지/먹 판) `--paper-fold`(접힘 아래·보조 면) `--paper-box`(박스 기사·입력 칸·팝오버) |
| 먹 | `--ink`(본문·괘선) `--ink-75`(부제·2차) `--ink-55`(캡션·메타, 최소 4.6:1) `--rule-hair`(0.5px 괘, **글자 금지**) |
| 별색 | `--spot`(면·괘선·제호 첫 글자) `--spot-text`(작은 주홍 글자) `--spot-tint`(위험 바탕) `--on-spot` — **[단독]·[속보]·위험·포커스·제호에만** |
| 상태 | `--ok` `--warn` `--info` + 각 `-tint` |
| 반전 먹칠 | `--inverse` / `--on-inverse` `--on-inverse-2` (1차 단추·오늘 날짜·현재 면) |
| 띠 | `--band` / `--on-band` `--on-band-2` (전보·교열 메모·속보 머리 — 야간판에서 흰 띠로 뒤집히지 않음) |
| 조판 명령 판 | `--plate` `--on-plate` `--on-plate-2` `--plate-rule` |
| 망점 | `--dot`(점 색) · `--ht-10/20/30/40/60/80`(background-image 값) · `--ht-step`(5px) |
| 괘선 | `--rule-0`(0.5 헤어) `--rule-1` `--rule-2` `--rule-4`(border 값) · `--rule-double` `--rule-double-spot`(높이 7px background 값) |
| 그림자 | `--sheet-shadow`(6px 하드 오프셋, 얹힌 종이 전용) `--press-shadow`(2px, 1차 단추 hover) |
| 서체 | `--font-masthead`(Hahmlet 900) `--font-hanja` `--font-headline`(Black Han Sans) `--font-head-serif`(Hahmlet 700) `--font-body`(Noto Serif KR) `--font-ui`(Gothic A1) `--font-latin`(Newsreader) `--font-mono`(IBM Plex Mono) |
| 크기 | `--fs-masthead` `--fs-hd-6/4/3/2/1` `--fs-deck` `--fs-body 16` `--fs-col 15` `--fs-ui 14` `--fs-caption 13` `--fs-folio 12` `--fs-figure` |
| 간격 | `--sp-1..8` = 4·8·12·16·24·32·48·64 · `--col-gap 24` · `--v-module 52`(세로 단) · `--touch 44` |
| 모션 | `--dur-press 90` `--dur-fold 120` `--dur-fast 140` `--dur-base 200` `--dur-rule 480` `--dur-ticker 48s` `--ease-press` |

**SVG**: presentation attribute 에 `var()` 금지. `style="fill:var(--dot)"`, `style="fill:url(#ht40)"`, `stroke="currentColor"`만.

---

## 3. base.css 프리미티브

### 활자
| 클래스 | 쓰임 |
|---|---|
| `.masthead` + `.masthead__hanja` | 제호 「여명일보」 Hahmlet 900 · 黎明日報. index 제호부·404 에만 |
| `.hd-6` `.hd-4` | 6단·4단 제목 — Black Han Sans(견출 고딕). 1면 톱·접힘 아래 톱 |
| `.hd-3` `.hd-2` | 3단·2단 제목 — Hahmlet 700. 사설·칼럼·세로 기사 |
| `.hd-1` | 1단 단신 제목 — Gothic A1 800 |
| `.deck` | 부제(왼쪽 3px 먹 괘, 고딕 600). 이탤릭 금지 |
| `.col-text` (+ `.cols-2` `.cols-3`) | 단 본문 15/1.72. **음절 단위 줄바꿈(word-break: normal + line-break: strict) + 양끝 맞춤** — keep-all 로 좁은 단을 양끝 맞추면 어절 사이가 벌어진다. 600px 미만·한글 18자보다 좁은 단(`.col-text--narrow`)은 왼쪽 맞춤. 둘째 문단부터 1em 들여쓰기. `.dateline`=【대전】 |
| `.body` | 일반 본문 16/1.75 |
| `.caption` + `.caption__credit` | 사진 캡션 + 「사진=노은별 기자」 |
| `.folio` | 판권·면 머리·메타 12px |
| `.figure-num` + `.figure-num__unit` + `.figure-num__cur` | 큰 숫자(부수·가격·남은 시간) Newsreader opsz72 tabular. **큰 금액의 ₩는 반드시 `<span class="figure-num__cur">₩</span>`**(고딕 600 · 0.42em · 위첨자) — 숫자 높이 그대로 찍으면 둔탁하다 |
| `--fs-min` (12px) | 읽어야 하는 글자의 최소 크기. 장식 축소면(`.minipage`)은 `aria-hidden` 처리하고 읽을 면 이름은 바깥 12px 캡션으로 |
| `.mono` `.latin` `.latin-i` `.num` `.ui` `.ink-75` `.ink-55` `.spot-text` `.strong` `.vert`(세로쓰기) `.kbd` | 보조 |

### 판면
| 클래스 | 설명 |
|---|---|
| `.sheet` | 판면 폭 1320 + 여백 32/24/16 |
| `.grid` + `.s-2 .s-3 .s-4 .s-5 .s-6 .s-7 .s-8 .s-9 .s-10 .s-12` | 12소단(2소단 = 1단). 600–1023 은 6소단(s-2~5 → 3, s-6 이상 → 전폭, `.t-2/.t-4/.t-6`로 재지정), <600 은 1단 |
| `.ruled` `.ruled--hair` `.ruled--t-off` | 기사 왼쪽 gap 중앙의 단 괘선(1px / 0.5px). <600 에선 위 가로 헤어라인. 박스 테두리 대신 이것 |
| `.runhead` > `.runhead__page` + `.runhead__date` + `.runhead__paper` | 면 머리(4px 먹 괘 + `A3 · 사회 ─── 날짜 ─── 여명일보`). `data-rule-in` 주면 진입 시 괘선이 그어짐 |
| `.fold` > `.fold__label`「접는 선」 / `.below-fold` | 접힘선과 접힘 아래 면(`--paper-fold`) |
| `.rule-0 .rule-1 .rule-2 .rule-4 .rule-dbl .rule-dbl--spot` | 괘선 줄(`<hr class="rule-dbl">`), `.draw-rule` 로드 시 1회 긋기 |
| `.stack(--1/2/3/5/6/8)` `.row(--between/--end/--top)` `.push` `.vm-1/3/5`(세로 단 최소 높이) | 쌓기·줄 |
| `.desk` > `.side` + `.desk__main` | 조판실 셸(1-E) |
| `.site-foot*` | 판권 줄(1-C) |

### 망점 사진 — 시그니처 ②
```html
<figure class="photo">
  <div class="photo__plate ht--10" style="--ratio:16/8">
    <svg viewBox="0 0 640 320" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <rect x="0" y="236" width="640" height="84" style="fill:url(#ht40)"/>          <!-- 바닥 -->
      <rect x="238" y="96" width="370" height="140" style="fill:url(#ht60)"/>        <!-- 버스 몸체 -->
      <rect x="256" y="112" width="70" height="56" style="fill:url(#ht20)"/>         <!-- 창 -->
      <circle cx="300" cy="240" r="22" style="fill:var(--dot)"/>                     <!-- 바퀴 -->
      <g style="fill:url(#ht80)"><circle cx="172" cy="150" r="13"/><rect x="156" y="166" width="32" height="74"/></g>  <!-- 사람 -->
    </svg>
    <span class="photo__tag">사진</span>
  </div>
  <figcaption class="caption">26일 오후 대전역 동광장 정류장에서 시민들이 바뀐 노선도를 살펴보고 있다. <span class="caption__credit">사진=노은별 기자</span></figcaption>
</figure>
```
- 패턴 id(app.js 가 페이지마다 자동 주입): `#ht10 #ht20 #ht30 #ht40 #ht60 #ht80`(5px 망점 농도), `#ht-hi`(야간판 하이라이트 전용), `#ht-fine`(3px 촘촘), `#ht-hatch`(사선). 단색 먹은 `style="fill:var(--dot)"`, 종이색 구멍은 `style="fill:var(--paper)"`.
- 피사체는 기하 실루엣(사각·원·선)으로 단순하게. 캡션 없는 망점 금지.
- **야간판은 반전하지 않는다.** 패턴 점 반지름이 `--ph-r-*`로 바뀌어 어두운 피사체는 성긴 점, 바탕은 `--ph-bg`(교정지 75% 성긴 점), SVG 안의 `var(--dot)` 먹은 판색(무점), `var(--paper)` 하이라이트는 `#ht-hi`(최대 45%)가 된다. 그래서 밤 장면을 그릴 때도 「먹 = 어두움, 종이 = 밝음」으로만 칠하면 두 모드가 같은 명암으로 나온다. 패턴을 사진 밖 장식에 쓰지 말 것(야간판 매핑이 사진 기준이다).
- `.photo__plate` 바탕 망점: 기본 `--ht-20`, `.ht--10/20/30/40/60/80`로 바꿈. `.photo__plate--plain` 바탕 없음. `--ratio` 기본 3/2. 링크 안·`.story` hover 시 망점이 5→4px로 촘촘해짐.
- HTML 요소에 망점 면을 깔 때: `class="ht ht--40"`.
- `.avatar`(`--sm 32` 기본 40 `--lg 64` `--xl 96`) > `.avatar__i` 이니셜 1자: `<span class="avatar"><span class="avatar__i">문</span></span>`

### 조판 기호·이음
- `.jump` 「→A3면에 계속」, `.jump.jump--related` 「▶관련기사 A4면」 (a 요소, 실제 페이지로 연결)
- `.mark-diamond`(◆) `.mark-square`(■) `.mark-note`(※) — 앞에 기호를 붙임
- `.leader` — flex 줄 안의 점선 리더 (제목 ····· 면 번호)
- `.pip` — 8px 원 (색은 `color`)
- **교정 쪽지** `.proof`(+`.proof--line` 왼쪽 지시선, 길이 `style="--proof-line:48px"`) > `.proof__k`(규격, 모노) + 설명. index 에서 지면 위 편집부 주홍 주석으로 스펙을 적을 때 쓴다:
  `<p class="proof proof--line"><span class="proof__k">.hd-6 80/1.06</span>6단 톱 제목 — Black Han Sans</p>`

### 아이콘
`<span data-icon="search"></span>` → app.js 가 18px 선 SVG(currentColor)로 채운다.
이름: `search close sun moon chevron-left chevron-right chevron-down chevron-up plus minus check pause play menu more arrow-right arrow-left copy edit trash print bell user lock download refresh calendar clock pin send filter external grid paper`
아이콘만 있는 단추는 반드시 `aria-label`.

---

## 4. 컴포넌트 32종

### accordion — 단신 묶음
```html
<div class="acc" data-single>                       <!-- data-single: 하나만 열림 · .acc--plain: ◆ 없음 -->
  <div class="acc__item">
    <h3 class="acc__head"><button class="acc__btn" aria-expanded="true" aria-controls="faq-1">
      <span class="acc__title">신문이 오지 않았어요</span><span class="acc__meta">독자서비스</span><span class="acc__sign" aria-hidden="true"></span>
    </button></h3>
    <div class="acc__panel" id="faq-1"><p>평일 오전 9시까지 042-250-0114로 알려 주시면 지국에서 다시 배달합니다.</p></div>
  </div>
</div>
```
열림 ▼ / 닫힘 ▶ / 비활성(`disabled`) ─. app.js: 클릭 토글·`hidden` 동기화·↑↓ Home End. 내용은 높이만 120ms 로 드러남.

### alert — 알림 상자
```html
<div class="alert alert--warn" role="status">        <!-- --info --ok --warn --danger(role="alert") --fix(정정보도) · 띠형 + .alert--banner -->
  <span class="alert__tag">주의</span>
  <div class="alert__body"><strong class="alert__title">50판 강판까지 1시간 40분</strong><span class="alert__text">A1 톱 기사가 아직 「대기」입니다.</span><a class="alert__action" href="kanban.html">면 배열 보기</a></div>
  <button class="alert__close" data-dismiss aria-label="알림 닫기"><span data-icon="close"></span></button>
</div>
```
말머리 대괄호는 CSS가 붙인다(마크업엔 「주의」만). `.alert--fix` = 위아래 주홍 쌍괘의 「바로잡습니다」 상자(404 주인공). `data-dismiss`(값 없으면 가장 가까운 `.alert`, 값 있으면 그 id).

### badge — 꺾쇠 말머리 · 상태 · 숫자 · 판
```html
<span class="tag tag--spot">단독</span>   <span class="tag">사설</span>   <span class="tag tag--quiet">알림</span>
<span class="tag tag--block">사설</span>  <span class="tag tag--block tag--spot">號外</span>
<span class="status" data-status="done">강판</span>     <!-- done 강판 · set 조판 · proof 교열 · desk 데스크 · wait 대기(빈 핍) · late 마감 초과 -->
<span class="count">29</span> <span class="count count--spot">7</span> <span class="count count--line">36</span>
<span class="edition"><span class="latin">50</span>판</span>  <span class="edition edition--spot">…</span>
```
`.tag` 크기 `--sm`(12) `--md`(14), 기본은 부모 글자의 0.86em. 주홍(`--spot`)은 [단독]·[속보]·호외만.

### breadcrumb — 면 경로
```html
<nav class="crumbs" aria-label="면 경로"><ol class="crumbs__list">
  <li class="crumbs__item"><a class="crumbs__link crumbs__home" href="../index.html">여명일보</a></li>
  <li class="crumbs__item"><a class="crumbs__link" href="profile.html"><span class="crumbs__page">A3</span>사회</a></li>
  <li class="crumbs__item"><span aria-current="page">교통</span></li>
</ol></nav>
```
<600 에서 가운데 단계가 「› … ›」로 줄어든다.

### button — 활판 단추
```html
<button class="btn btn--primary" type="button">구독 신청</button>
```
변형: `--primary`(먹 면, hover 2px 하드 오프셋 → 누르면 0) · 기본(1px 먹 테두리) · `--danger`(주홍 면) · `--danger-line` · `--text`(밑줄) · `--quiet`(테두리 없음).
크기: `--sm`(36, 터치 기기 44) · 기본 44 · `--lg` 52 · `--icon`(정사각, `aria-label` 필수) · `--block`.
상태: `:disabled`/`aria-disabled="true"`(점선 테두리) · `aria-busy="true"`(앞에 윤전 롤러) · `data-state="error"`(앞에 [실패]) · `data-state="done"`([완료]) · `aria-pressed="true"`(선택 = 위 4px 먹 괘).
부속: `<span class="btn__count">7</span>` `<kbd class="btn__kbd">⌘K</kbd>`, 묶음 `.btn-group`.
app.js: `data-busy="1200"` 누르면 그 ms 동안 로딩 후 `data-toast` 전보, `data-busy-fail="문구"` 실패 시연, `data-done` 완료 표시. 단추 안 `<span data-label>`이 있으면 `data-busy-text`로 바뀌었다 돌아옴.

### calendar — 발행 달력
```html
<div class="cal" data-calendar data-month="2026-11" data-today="2026-10-27" data-min="2026-10-28" data-selected="2026-11-03"
     data-marks="2026-10-31:밤 도서관;2026-11-03:노선 개편" data-cal-output="#start-date, .start-date-copy">
  <div class="cal__legend">
    <span class="cal__key"><span class="cal__swatch cal__swatch--today"></span>오늘</span>
    <span class="cal__key"><span class="cal__swatch cal__swatch--sel"></span>고른 날</span>
    <span class="cal__key"><span class="cal__swatch cal__swatch--off"></span>일요일 휴간</span>
  </div>
</div>
<p>배달 시작일: <strong id="start-date">2026년 11월 3일 화요일</strong></p>
```
app.js 가 머리(‹ 2026년 11월 ›)와 7×6 괘선 격자를 그린다. 일요일 = 사선 「휴간」(고를 수 없음), 오늘 = 먹 반전(`aria-current="date"`), 고른 날 = 주홍 안쪽 괘(`aria-pressed`), `data-marks` 날은 ◆ 메모. 키보드 ←→↑↓ PageUp/Down Enter. `data-min`보다 앞 날짜는 고를 수 없다(`.cal__day--locked` + `aria-disabled` — 숫자만 `--ink-55`, 취소선·회색 칠 없음). 표식 종류 `날짜:정지:stop`은 `.cal__day--stop`(망점 판 + ◆정지)으로, 고를 수 있는지와 무관하게 같은 모양이다 — 「고를 수 없음」과 「정지」를 한 스타일로 섞지 말 것. 고르면 `data-cal-output` 선택자에 맞는 **모든** 요소의 글자 갱신 + `calendar:select` 이벤트.

### card — 박스 기사
```html
<article class="story">                                  <!-- --h(사진 오른쪽) --box(박스 면) --spot(주홍 머리) --thin(1px 머리) --void(취소) -->
  <p class="story__kicker"><span class="tag tag--spot">단독</span><span>A3 사회</span></p>
  <figure class="photo"><div class="photo__plate ht--30"></div><figcaption class="caption">엑스포다리 아래 「밤 도서관」 예정지. <span class="caption__credit">사진=노은별 기자</span></figcaption></figure>
  <h3 class="story__title hd-2"><a href="inbox.html">갑천 둔치에 '밤 도서관' 연다</a></h3>
  <p class="story__deck">31일부터 매주 토요일 오후 6시~10시</p>
  <p class="story__meta"><span class="story__byline">고태석 기자</span><span>10월 26일 21:40</span></p>
</article>
```
가로형은 `.story--h` > `.story__body`(kicker·title·text·meta) + `figure.photo`. 제목 링크가 카드 전체를 덮는다(hover: 밑줄 2px, 망점 촘촘). 선택 `aria-current="true"`. **같은 폭 카드를 나란히 늘어놓지 말 것** — 단 수로 크기 차이를 둔다.

### carousel — 지면 넘김
```html
<section class="carousel" data-carousel aria-roledescription="carousel" aria-label="지면 넘김">
  <div class="carousel__viewport">
    <article class="carousel__slide" data-label="A1" aria-roledescription="slide" aria-label="A1 종합">
      <div class="minipage"><span class="minipage__mast">여명일보</span><span class="minipage__hd"></span><span class="minipage__photo"></span><span class="minipage__side"></span><span class="minipage__ad"></span><span class="minipage__no">A1</span></div>
      <p class="carousel__label"><span class="mono">A1</span>종합 — 버스 노선 전면 개편</p>
    </article>
    <article class="carousel__slide" data-label="A2" aria-roledescription="slide" aria-label="A2 종합" hidden>…</article>
  </div>
  <div class="carousel__bar">
    <button class="carousel__btn" type="button" data-carousel-prev aria-label="이전 면">‹ 이전 면</button>
    <p class="carousel__count" aria-live="polite"><span data-carousel-current>A1</span> <span class="carousel__total">/ 36</span></p>
    <button class="carousel__btn" type="button" data-carousel-next aria-label="다음 면">다음 면 ›</button>
  </div>
  <div class="carousel__index"><button class="carousel__pg" type="button" aria-current="true">A1</button><button class="carousel__pg" type="button">A2</button></div>
</section>
```
넘김은 끊어 바꾸기(이동 애니메이션 없음), 처음·끝에서 단추 비활성, ←→ 키. **`.minipage`**(한 면 축소본)는 드로어·상황판 36면 배열표·복각본 미리보기에서도 같은 마크업을 쓴다. 변형 `--text`(사진 없는 면) `--ad`(광고면). 마스트 글자 크기 `style="--mp-mast:10px"`.

### code — 조판 명령
```html
<figure class="code">
  <figcaption class="code__head"><span class="code__name">styles.css</span><button class="code__copy" type="button" data-copy>복사</button></figcaption>
  <pre class="code__pre" tabindex="0"><code><span class="code__c">/* 1면 톱 — 6단 제목 */</span>
.hd-6 { font: 400 80px/1.06 "Black Han Sans"; }</code></pre>
</figure>
```
주간판에서도 먹 판. 구문색 없음, 주석만 `.code__c`. 줄 번호 `.code__ln`. 인라인은 `<code>`. `data-copy`(값 없으면 같은 `.code`의 pre, 값 있으면 그 선택자) → 「복사됨」.

### command — 기사 검색 (⌘K)
실동작 요소는 1-F(셸). index 의 **열린 견본**은 같은 마크업에 `.cmd--static`, `hidden`·`aria-modal` 없이, 입력에 값(예: `value="노선"`)을 넣어 둔다 — 제자리에 렌더되고 필터·화살표도 그대로 동작한다. 항목은 `면 · 제목 · 기자` 3열, `data-href` 있으면 Enter/클릭 시 이동, 없으면 「열람」 전보. 일치 글자는 주홍 밑줄 `<mark>`로 표시된다.

### drawer — 지면 보기 패널
```html
<button class="btn" type="button" data-open="drawer-a3">A3면 미리 보기</button>
<div class="drawer" id="drawer-a3" hidden role="dialog" aria-modal="true" aria-labelledby="drawer-a3-t">   <!-- .drawer--left 왼쪽 -->
  <div class="drawer__scrim" data-close></div>
  <aside class="drawer__panel">
    <header class="drawer__head"><p class="folio drawer__folio"><span class="mono">A3</span> · 사회 · 50판</p><h2 class="drawer__title" id="drawer-a3-t">A3 사회면 미리보기</h2><button class="drawer__close" type="button" data-close aria-label="지면 보기 닫기"><span data-icon="close"></span></button></header>
    <div class="drawer__body"><div class="minipage">…</div><p class="caption">강판 23:12 · 기사 9건 · 광고 5단</p></div>
    <footer class="drawer__foot"><button class="btn" type="button" data-close>닫기</button><button class="btn btn--primary" type="button" data-busy="1200" data-toast="A3 사회면 강판 완료" data-toast-tag="완료" data-toast-tone="ok"><span data-label>A3면 강판</span></button></footer>
  </aside>
</div>
```
열린 견본: `.drawer.drawer--static`(hidden·aria-modal 없음). 200ms 오른쪽에서 밀려옴, 스크림 망점 즉시.

### empty — 백지 면
```html
<div class="empty">                                     <!-- .empty--center 가운데 쌓기 -->
  <div class="empty__frame" aria-hidden="true"><span class="empty__label">사진 대기</span></div>
  <p class="empty__title">A28 사진 칸이 비어 있습니다</p>
  <p class="empty__text">첫 서리 사진 2매가 데스크에 있습니다. 데스크 마감 00:10.</p>
  <a class="btn empty__action" href="inbox.html">송고함 열기</a>
</div>
```
틀 = 조판 대지의 「사진 들어갈 자리」 X 표시 + 10% 망점. 할 일 링크는 1개만. `.empty`는 자기 폭을 재는 컨테이너라, 480px보다 좁은 단에 놓이면 뷰포트와 상관없이 1열로 쌓인다.

### form — 신청 쿠폰
```html
<form class="coupon form" data-validate novalidate data-success="배달 신청을 접수했습니다. 유성어은지국 YS-04에서 연락드립니다." data-success-tag="접수">
  <span class="coupon__cut">오리는 선</span>
  <p class="coupon__title">여명일보 구독 신청</p>
  <div class="form-grid">
    <div class="field"><label class="field__label" for="sub-name">받는 분<span class="field__req">*</span></label><input class="input" id="sub-name" required value="엄재희"></div>
    <div class="field"><label class="field__label" for="sub-tel">연락처<span class="field__req">*</span></label><input class="input input--num" id="sub-tel" required inputmode="tel" placeholder="010-0000-0000" data-error="연락처를 적어 주세요"></div>
    <div class="field field--full"><label class="field__label" for="sub-addr">배달 주소</label><input class="input" id="sub-addr" value="대전광역시 유성구 어은로 57"><p class="field__hint">유성어은지국 YS-04에 자동 배정됩니다</p></div>
    <div class="field"><label class="field__label" for="sub-plan">상품</label><div class="select-wrap"><select class="select" id="sub-plan"><option>종이 + 디지털 지면 · ₩24,000</option><option>종이 신문 · ₩20,000</option></select></div></div>
    <div class="field"><label class="field__label" for="sub-amt">연간 선납</label><div class="input-group"><span class="input-group__affix">₩</span><input class="input input--num" id="sub-amt" value="216,000" readonly></div></div>
    <div class="field field--full"><label class="field__label" for="sub-memo">배달 위치 메모</label><textarea class="textarea" id="sub-memo" maxlength="80">현관 앞 우유 투입구 옆</textarea><span class="field__count">13 / 80자</span></div>
  </div>
  <fieldset class="fieldset"><legend class="fieldset__legend">배달 요일</legend>
    <div class="seg" role="radiogroup" aria-label="배달 요일">
      <span class="seg__opt"><input class="seg__input" type="radio" name="days" id="days-6" checked><label class="seg__label" for="days-6">월~토</label></span>
      <span class="seg__opt"><input class="seg__input" type="radio" name="days" id="days-5"><label class="seg__label" for="days-5">평일만</label></span>
    </div>
  </fieldset>
  <label class="check"><input class="check__box" type="checkbox" checked><span class="check__text">문 앞 배달 사진 받기<small>배달원이 사진을 전보로 보냅니다</small></span></label>
  <label class="radio"><input class="radio__box" type="radio" name="pay" checked><span>자동이체</span></label>
  <label class="switch"><input class="switch__input" type="checkbox" role="switch" checked><span class="switch__track" aria-hidden="true"></span>전보 알림</label>
  <div class="form__foot"><button class="btn btn--primary" type="submit" data-busy="900">신청서 보내기</button><span class="form__note">독자서비스 042-250-0114 · 평일 06:00~18:00</span></div>
</form>
```
- 쿠폰(`.coupon`)은 점선 가위선 서식. 쿠폰이 아닌 설정 서식은 `.form`만.
- 입력 = 밑줄 2px 먹(hover 박스 면, focus 주홍 밑줄), `aria-invalid="true"` 주홍 밑줄+분홍 바탕, `disabled` 점선 밑줄, `readonly` 헤어라인. `.field--busy` 확인 중 망점.
- 오류 문구 `<p class="field__error">…</p>`(앞에 [확인] 자동). app.js 는 `form[data-validate]`에 `noValidate`를 자동으로 붙인다(브라우저 기본 말풍선이 먼저 떠서 submit 이 막히지 않게 — 마크업에도 `novalidate`를 적어 둔다). app.js `form[data-validate]`: 제출 시 required·pattern·email 검사 → 첫 오류로 포커스, 통과하면 `data-success` 전보. `data-validate="go"` + `action` 있으면 성공 후 이동.
- 체크 □ 안에 ■, 라디오 ◇ 안에 ◆, 스위치 = 직각 막대 「켬/끔」, 세그먼트 = 먹 반전 선택.
- `textarea[maxlength]` + 같은 `.field` 안 `.field__count` 자동 갱신.

### kanban — 면 배열 보드
```html
<div class="board" data-kanban>                       <!-- 열 수가 5가 아니면 style="--board-cols:4" -->
  <section class="board__col" aria-labelledby="col-proof">
    <header class="board__head"><h3 class="board__name" id="col-proof">교열</h3><span class="count">1</span><span class="board__due">00:40</span><span class="board__sub">표선아 교열부 차장</span></header>
    <ol class="board__list">
      <li class="slip slip--lead" id="slip-a01">        <!-- --lead(A1 톱, 주홍) --late(마감 초과) aria-disabled="true"(고정) -->
        <div class="slip__top"><span class="slip__id">YM20261027-A01-0001</span><span class="slip__page">A1</span></div>
        <h4 class="slip__title"><span class="tag tag--spot">톱</span>시내버스 41개 노선 26년 만에 전면 개편</h4>
        <p class="slip__meta"><span><span class="num">2,480</span>자</span><span>6단</span><span class="slip__note">교정 4건 · 23:38</span></p>   <!-- 조각마다 span 하나, 가운뎃점은 CSS 가 붙인다 -->
        <div class="slip__foot"><span class="slip__by"><span class="avatar avatar--sm"><span class="avatar__i">문</span></span>문해담</span>
          <span class="slip__move"><button type="button" data-move="prev" aria-label="이전 단계로">‹</button><button type="button" data-move="next" aria-label="다음 단계로">›</button></span></div>
      </li>
      <li class="board__empty" hidden>쪽지 없음</li>
    </ol>
    <p class="board__tally">쪽지 <b>1</b>장 · 원고 <b>2,480</b>자</p>   <!-- 열 바닥 집계 — app.js 가 옮길 때마다 다시 센다 -->
  </section>
  <!-- 취재 · 데스크 · 교열 · 조판 · 강판 (23:40 기준 A1 톱은 「교열」 — DIRECTION 쪽지 16장 표) -->
</div>
```
app.js: 끌어 옮기기(데스크톱) + ‹ › 단추(키보드·터치 폴백), 열 머리 숫자·빈 칸 표시·끝 열 단추 비활성 자동 갱신, 스크린리더 안내, `kanban:move` 이벤트. 마감 지난 열 시각 `.board__due--late`. 열 바닥 `.board__tally`(쪽지 수·글자 합). <600 에서는 공정 순서대로 위아래로 쌓는다(가로 스냅 스크롤은 가장 긴 열 높이만큼 짧은 열 아래를 비게 해서 쓰지 않는다). `.slip__page`는 줄바꿈하지 않는다.

### list — 기사 목록
```html
<ul class="list">                                       <!-- --toc(면 색인) --brief(◆ 단신) --ranked(번호) -->
  <li class="list__item is-new"><time class="list__time">23:12</time>
    <div class="list__main"><a class="list__title" href="inbox.html"><span class="tag tag--spot">속보</span>대전역 임시 정류장 05:30 운영</a><span class="list__meta">고태석 · 1,120자</span></div>
    <span class="list__page">A1</span></li>
</ul>
<ul class="list list--toc">
  <li class="list__item"><a class="list__title" href="pages/profile.html">사회 — 바뀐 노선도 41개 전면</a><span class="leader"></span><span class="list__page">A3</span></li>
</ul>
<ul class="list list--brief"><li class="list__item"><span class="list__title">첫 서리 대덕 산간 영하 1도</span></li></ul>
```
상태: `.is-new`(주홍 핍) · `aria-current="true"`(선택, 왼쪽 4px 먹) · `.list__item--read` · `.list__item--off`(취소선). 링크 제목이 행 전체를 덮는다.
**선택 목록 + 열람 판**(inbox): 목록 `ul[data-select-list="mail"]` 안 항목에 `data-select="열람판 id"`, 열람판들에 `data-select-panel="mail"` → 누르면 해당 판만 보이고 `aria-current` 이동.
```html
<ul class="list" data-select-list="mail"><li class="list__item" aria-current="true"><button class="list__title" type="button" data-select="read-0047">…</button></li></ul>
<article id="read-0047" data-select-panel="mail">…</article><article id="read-0046" data-select-panel="mail" hidden>…</article>
```

### marquee — 속보 띠
셸 1-A 의 `.ticker` 그대로. 항목은 `.ticker__item`(◆ 구분 자동), 한 벌만 쓰면 app.js 가 이음새 없는 복제를 붙인다. hover·focus 정지, 정지 단추(`data-ticker-toggle`), reduced-motion 이면 흐르지 않음. 본문 안에 띠를 또 쓸 때도 같은 마크업.

### menu — 편집 메뉴
```html
<div class="menu">
  <button class="btn btn--sm menu__trigger" type="button" aria-haspopup="menu" aria-expanded="false" aria-controls="menu-a01">편집 <span data-icon="chevron-down"></span></button>
  <div class="menu__list" id="menu-a01" role="menu" hidden>          <!-- --end 오른쪽 정렬 · --up 위로 · --static 열린 견본 -->
    <p class="menu__label">A1 톱 기사</p>
    <button class="menu__item" type="button" role="menuitem" data-toast="제목 고치기 창을 열었습니다"><span data-icon="edit"></span>제목 고치기<span class="menu__kbd">E</span></button>
    <button class="menu__item" type="button" role="menuitemcheckbox" aria-checked="true">[단독] 말머리</button>
    <button class="menu__item" type="button" role="menuitem" aria-disabled="true">45판으로 되돌리기</button>
    <div class="menu__sep" role="separator"></div>
    <button class="menu__item menu__item--danger" type="button" role="menuitem"><span data-icon="trash"></span>지면에서 빼기</button>
  </div>
</div>
```
app.js: 열면 첫 항목 포커스, ↑↓ Home End, Esc(트리거로 복귀), 바깥 클릭·Tab 닫힘, `menuitemcheckbox`/`menuitemradio`(`data-group`) 토글, `data-toast`. 열린 견본: `.menu__list--static`(`hidden` 없이) + 트리거 `aria-expanded="true"`.

### modal — 호외(號外) 판
```html
<button class="btn" type="button" data-open="extra-bus">호외 판 열기</button>
<div class="modal" id="extra-bus" hidden role="dialog" aria-modal="true" aria-labelledby="extra-bus-t">   <!-- --wide 760 · --danger 주홍 쌍괘 -->
  <div class="modal__scrim" data-close></div>
  <div class="modal__sheet">
    <button class="modal__close" type="button" data-close aria-label="호외 닫기"><span data-icon="close"></span></button>
    <p class="modal__flag"><span class="modal__hanja">號外</span></p>
    <h2 class="modal__title" id="extra-bus-t">버스 노선 개편 첫날 안내</h2>
    <p class="modal__deck">11월 3일 화요일 첫차부터 41개 노선이 바뀝니다</p>
    <div class="modal__body"><p>대전역 동광장 임시 정류장은 27일 오전 5시 30분부터 운영합니다.</p></div>
    <div class="modal__actions"><button class="btn" type="button" data-close>닫기</button><a class="btn btn--primary" href="profile.html">A3면 노선도 보기</a></div>
  </div>
</div>
```
app.js: `[data-open="id"]`로 열기, `[data-close]`·Esc·스크림으로 닫기, 포커스 트랩, 연 단추로 포커스 복귀, 배경 스크롤 잠금. 첫 포커스는 `[data-autofocus]`가 있으면 그것. 열린 견본: `.modal.modal--static`(hidden·aria-modal 없음). 얹힌 종이(호외 판·기사 검색·편집 메뉴)의 그림자는 `--sheet-shadow` = `6px 6px 0 var(--shadow-hard)` — 야간판은 판보다 한 단 밝은 「종이 겹」 슬래브 `--shadow-hard`(#2B2620) + 슬래브 둘레 1px `--shadow-edge`, 쌍괘는 `--sheet-edge`(야간판 교정지 55%). `--ink`로 그림자를 직접 쓰지 말 것(야간판에서 크림 띠가 빛난다).

### motion — 윤전 견본
```html
<div class="motion">
  <div class="motion__item"><div class="motion__stage"><span class="motion__rule"></span></div><p class="motion__name">괘선 긋기</p><p class="motion__spec">480ms · scaleX 0→1</p><button class="btn btn--sm" type="button" data-motion-play>다시 긋기</button></div>
  <div class="motion__item"><div class="motion__stage"><p class="motion__wire">[알림] A3면 강판 완료</p></div><p class="motion__name">전보</p><p class="motion__spec">140ms · translateY −100%→0</p><button class="btn btn--sm" type="button" data-motion-play>다시 보내기</button></div>
  <div class="motion__item"><div class="motion__stage"><span class="motion__press">구독 신청</span></div><p class="motion__name">활판 누름</p><p class="motion__spec">90ms · 2px 오프셋→0</p><button class="btn btn--sm" type="button" data-motion-play>다시 누르기</button></div>
  <div class="motion__item"><div class="motion__stage"><span class="motion__sheet">號外</span></div><p class="motion__name">호외 판</p><p class="motion__spec">200ms · −12px→0</p><button class="btn btn--sm" type="button" data-motion-play>다시 펼치기</button></div>
  <div class="motion__item"><div class="motion__stage"><span class="motion__cut"><span>A1 종합</span><span>A3 사회</span></span></div><p class="motion__name">끊어 바꾸기</p><p class="motion__spec">0ms · steps(1)</p><button class="btn btn--sm" type="button" data-motion-play>다시 넘기기</button></div>
  <div class="motion__item"><div class="motion__stage"><span class="motion__dots"></span></div><p class="motion__name">망점 촘촘</p><p class="motion__spec">기사 hover · 5px→4px</p><button class="btn btn--sm" type="button" data-motion-play>다시 보기</button></div>
</div>
```
로드 시 1회 재생, 단추로 다시. 페이드는 없다.

### navbar — 면 머리 띠
셸 1-A/1-B 그대로. `data-theme-toggle`은 주간판/야간판 중 현재 쪽이 먹 반전으로 표시되고 app.js 가 `aria-pressed`·`aria-label`을 갱신한다. <1024: 판 표기 숨김, 검색은 아이콘 단추. 면 색인 줄은 가로 스크롤 + 오른쪽 끝 「›」 표시. <600: 한자 숨김, 주간판/야간판은 해·달 아이콘만.

### pagination — 면 번호
```html
<nav class="folios" aria-label="면 번호">
  <ul class="folios__list">
    <li><a class="folios__step" href="kanban.html" aria-label="이전 면">‹ <span class="folios__step-text">이전</span></a></li>
    <li class="folios__item--far"><a class="folios__link" href="kanban.html">A1</a></li>
    <li><a class="folios__link" href="kanban.html">A2</a></li>
    <li><a class="folios__link" href="kanban.html" aria-current="page">A3</a></li>
    <li><a class="folios__link" href="kanban.html">A4</a></li>
    <li><span class="folios__gap">…</span></li>
    <li class="folios__item--far"><a class="folios__link" href="kanban.html">A28</a></li>
    <li class="folios__item--next"><a class="folios__step" href="kanban.html" aria-label="다음 면"><span class="folios__step-text">다음</span> ›</a></li>
  </ul>
  <p class="folios__summary">본지 A섹션 28면 중 3면</p>
</nav>
```
현재 면 먹 반전. 처음·끝 단추는 `aria-disabled="true"`. 시연용으로 링크를 눌러도 이동하지 않게 하려면 `nav`에 `data-folios`.

### popover — 교정 쪽지
```html
<div class="pop">
  <button class="btn btn--sm pop__trigger" type="button" aria-expanded="false" aria-controls="note-a01">교정 쪽지 <span class="count count--spot">1</span></button>
  <div class="pop__panel" id="note-a01" role="dialog" aria-label="교정 쪽지" hidden>     <!-- --end · --up · --static 열린 견본 -->
    <p class="pop__kicker">표선아</p>
    <p class="pop__title">A1 톱 원고 교정 4건</p>
    <p class="pop__text">띄어쓰기 2곳, 「모두」 삭제, 「6시」 → 「5시 30분」. 「26년 만에」는 2000년 개편 기준 — 확인 끝. <span class="mono">YM20261027-A01-0001</span></p>
    <div class="pop__actions"><button class="btn btn--sm btn--primary" type="button" data-toast="교정을 반영했습니다" data-toast-tag="교정">반영</button><button class="btn btn--sm btn--text" type="button">무시</button></div>
    <button class="pop__close" type="button" aria-label="쪽지 닫기"><span data-icon="close"></span></button>
  </div>
</div>
```
주홍 1px 테두리 + 위 4px 주홍, 꼬리 없는 직각. 「교정 」 접두는 CSS가 붙임. app.js: 토글, Esc·바깥 클릭·포커스 이탈로 닫힘.

### progress — 강판 진척
```html
<div class="meter">                                       <!-- --sm --lg --warn --late --busy(양 모름) -->
  <div class="meter__head"><span class="meter__label">50판 강판 진척</span><span class="meter__value">29<small>/36면</small></span></div>
  <div class="meter__bar" role="progressbar" aria-valuenow="29" aria-valuemin="0" aria-valuemax="36" aria-label="50판 강판 진척"><span class="meter__fill" style="--value:80.5%"></span></div>
  <span class="meter__note">조판 4 · 교열 2 · 대기 1 (A1)</span>
</div>
<div class="meter meter--stack">
  <div class="meter__bar" role="img" aria-label="강판 29, 조판 4, 교열 2, 대기 1"><span class="meter__seg meter__seg--done" style="--value:80.5%"></span><span class="meter__seg meter__seg--set" style="--value:11.1%"></span><span class="meter__seg meter__seg--proof" style="--value:5.6%"></span></div>
  <div class="meter__legend"><span class="meter__key meter__key--done">강판 29</span><span class="meter__key meter__key--set">조판 4</span><span class="meter__key meter__key--proof">교열 2</span><span class="meter__key meter__key--wait">대기 1</span></div>
</div>
```
남은 부분 = 망점, 채운 부분 = 먹. 색 구분 대신 망점 농도로 상태를 나눈다.

### sidebar — 면 색인 단
셸 1-E 그대로. `.side__link` = 글자 + `.leader` + `.side__pg`(Newsreader 면 번호 — **실제 면에만**). 면이 아닌 도구·독자서비스는 `.side__pg--ui`(고딕 12px 현황 값: 50판·쪽지 16·214건). 링크가 아닌 줄(당번표)은 `.side__row`. 현재 면 먹 반전, 숫자 배지는 `.side__badge`. 비활성 `aria-disabled="true"`. 조판실 셸(`.desk > .side`)은 ≥1024 에서 단 괘가 본문 끝까지 내려가고 내용(`.side__body`)만 sticky. 본문 단 안에서 다시 쓸 때는 `.side--inline`(sticky·높이 제한·왼쪽 32px·단 괘·현재 면 −8px 돌출을 끈다).

### skeleton — 조판 대기
```html
<div class="skel-story" aria-busy="true" aria-label="A1 톱 조판 대기">
  <span class="skel skel--title"></span><span class="skel skel--photo"></span>
  <span class="skel skel--line"></span><span class="skel skel--line"></span><span class="skel skel--line"></span>
  <span class="skel-story__note">A1 톱 — 조판 대기</span>
</div>
```
망점 10% ↔ 20% 두 농도가 1.2s steps 로 교대(반짝임·페이드 없음). `.skel--avatar` `.skel--chip`.

### spinner — 윤전 롤러
```html
<span class="roller" role="status" aria-label="불러오는 중"><i></i><i></i><i></i><i></i></span>   <!-- --sm 14 · 기본 20 · --lg 40 · --spot -->
<span class="loading"><span class="roller roller--sm" aria-hidden="true"><i></i><i></i><i></i><i></i></span>A1 조판 대기 중</span>
```
사각 4칸이 시계 방향으로 차례 먹칠. 원형 스피너 금지.

### steps — 제작 공정
```html
<ol class="process">                                   <!-- 칸 수가 5가 아니면 style="--steps:4" · .process--v 세로 -->
  <li class="process__step" data-state="done"><span class="process__no"></span><span class="process__name">송고</span><span class="process__meta"><span class="mono">21:12</span></span></li>
  <li class="process__step" data-state="done"><span class="process__no"></span><span class="process__name">데스크</span><span class="process__meta">차윤서</span></li>
  <li class="process__step" data-state="current" aria-current="step"><span class="process__no"></span><span class="process__name">교열</span><span class="process__meta">표선아</span></li>
  <li class="process__step"><span class="process__no"></span><span class="process__name">조판</span><span class="process__meta">6층</span></li>
  <li class="process__step"><span class="process__no"></span><span class="process__name">강판</span><span class="process__meta"><span class="mono">01:20</span></span></li>
</ol>
```
번호(01·02…)는 CSS 카운터. `data-state`: `done`(위 4px 먹 + ✓) · `current`(위 4px 주홍 + 「진행」) · `error`(주홍 점선 + [반려]) · 없음(헤어라인). <600 세로 쌓기.
**마법사**(onboarding): 감싸는 요소에 `data-wizard`, 단계 패널마다 `data-wizard-panel`(첫 판 외 `hidden`), 다음 `data-wizard-next`, 이전 `data-wizard-prev`. app.js 가 현재 패널의 required 를 검사하고 `.process__step`의 `data-state`/`aria-current`를 맞춘다. 지난 단계 칸을 누르면 돌아간다.
```html
<div data-wizard>
  <ol class="process" style="--steps:4">…4칸…</ol>
  <section data-wizard-panel><h2 class="hd-3">상품 고르기</h2>…<button class="btn btn--primary" type="button" data-wizard-next>다음 — 배달 주소</button></section>
  <section data-wizard-panel hidden><h2 class="hd-3">배달 주소</h2>…<button class="btn" type="button" data-wizard-prev>이전</button><button class="btn btn--primary" type="button" data-wizard-next>다음</button></section>
</div>
```

### table — 시세표
```html
<div class="tbl-cap"><h3 class="tbl-cap__title">10월 발행부수</h3><span class="tbl-cap__unit">단위: 부 · 10월 26일 기준</span></div>
<div class="tbl-wrap" tabindex="0" role="region" aria-label="10월 발행부수 표">
  <table class="tbl" data-selectable>                  <!-- .tbl--compact · data-selectable 행 클릭 선택 -->
    <thead><tr>
      <th scope="col"><button class="tbl__sort" type="button">지국</button></th>
      <th scope="col">코드</th>
      <th scope="col" class="num" aria-sort="descending"><button class="tbl__sort" type="button">부수</button></th>
      <th scope="col" class="num"><button class="tbl__sort" type="button">전주 대비</button></th>
      <th scope="col">상태</th>
    </tr></thead>
    <tbody>
      <tr><th scope="row">둔산지국</th><td class="mono">SG-02</td><td class="num">4,812</td><td class="num"><span class="tbl__up">1.8%</span></td><td><span class="status" data-status="done">배달 완료</span></td></tr>
    </tbody>
    <tfoot><tr><th scope="row">31곳 합계</th><td></td><td class="num">68,400</td><td class="num"><span class="tbl__up">0.9%</span></td><td></td></tr></tfoot>
  </table>
</div>
```
위아래 쌍괘(wrap 이 그림), 행 사이 헤어라인, 세로선 없음. 숫자 `.num` 오른쪽·tabular(Newsreader) — ○·─·한글 문구 칸에는 `.num` 대신 `.mark`(가운데·고딕). 정렬 머리는 터치 기기에서 누르는 면 44px. 등락 `.tbl__up`(▲ 녹) `.tbl__down`(▼ 주홍) `.tbl__flat`(─). 선택 행 `aria-selected="true"`, 흐린 행 `.is-muted`. 정렬 머리를 누르면 `aria-sort` 순환 + 행 재정렬(숫자 칸은 `data-value`로 정렬값 지정 가능). <600: 표 최소 폭 560(`style="--tbl-min:640px"`로 조정) + 가로 스크롤 + 「표를 옆으로 밀어 보세요 ›」.

### tabs — 면 색인 탭
```html
<div class="tabs">                                     <!-- .tabs--boxed 면 번호 칸 -->
  <div class="tabs__bar"><div class="tabs__list" role="tablist" aria-label="지면">
    <button class="tabs__tab" role="tab" id="tab-a1" aria-controls="panel-a1" aria-selected="true" type="button"><span class="mono">A1</span>종합</button>
    <button class="tabs__tab" role="tab" id="tab-a3" aria-controls="panel-a3" aria-selected="false" type="button"><span class="mono">A3</span>사회 <span class="count">12</span></button>
  </div></div>
  <div class="tabs__panel" role="tabpanel" id="panel-a1" aria-labelledby="tab-a1" tabindex="0">…</div>
  <div class="tabs__panel" role="tabpanel" id="panel-a3" aria-labelledby="tab-a3" tabindex="0" hidden>…</div>
</div>
```
선택 = 위 4px 먹 괘 + 굵게. 전환 0ms. ←→ Home End, 비활성 `disabled`(취소선). 넘치면 app.js 가 오른쪽 끝 「›」 표시를 붙였다가 끝까지 밀면 뗀다.

### timeline — 마감 시각표
```html
<ol class="deadline">
  <li class="deadline__item" data-state="past"><time class="deadline__time">21:40</time><div class="deadline__body"><p class="deadline__title"><span class="edition"><span class="latin">40</span>판</span>초판 강판</p></div></li>
  <li class="deadline__item" data-state="now"><time class="deadline__time">23:40</time><div class="deadline__body"><p class="deadline__title">A1 톱 교열</p><p class="deadline__note">문해담 · <span class="mono">YM20261027-A01-0001</span></p></div></li>
  <li class="deadline__item" data-state="next"><time class="deadline__time">01:20</time><div class="deadline__body"><p class="deadline__title"><span class="edition edition--spot"><span class="latin">50</span>판</span>최종 강판</p><p class="deadline__note">36면 중 29면 강판</p></div></li>
  <li class="deadline__item"><time class="deadline__time">01:35</time><div class="deadline__body"><p class="deadline__title">윤전 시작</p></div></li>
</ol>
```
`data-state`: `past`(망점 마커 + 「완료」) · `now`(주홍, 「지금」) · `next`(먹 마커, 큰 제목) · `late`(주홍 취소선) · 없음(빈 마커).
**남은 시간 큰 숫자**(대시보드): `<time class="figure-num" data-countdown="2026-10-27T01:20:00+09:00" data-now="2026-10-26T23:40:00+09:00">01:40:00</time>` — 장면 시각에서 출발해 1초씩 줄어든다(0 이 되면 `.is-late`).

### toast — 전보 띠
```js
YM.toast({ tag: '완료', text: 'A3 사회면 강판 완료', meta: '23:12', tone: 'ok', action: { label: 'A3면', href: 'kanban.html' } });
```
또는 마크업 트리거: `<button class="btn" type="button" data-toast="A3 사회면 강판 완료" data-toast-tag="완료" data-toast-tone="ok" data-toast-meta="23:12">…</button>`
`tone`: (기본 주홍 밑괘) `ok` `warn` `info` `danger`(주홍 띠). 화면 위에서 띠로 내려와 5초 뒤 같은 길로 퇴장, hover·focus 중엔 멈춤, 최대 3장.
쌓인 견본(index):
```html
<div class="wire wire--static" aria-label="전보 견본">
  <div class="wire__item wire__item--ok"><span class="wire__tag">완료</span><p class="wire__text">A3 사회면 강판 완료<span class="mono">23:12</span></p><div class="wire__end"><button class="wire__close" type="button" aria-label="전보 닫기"><span data-icon="close"></span></button></div></div>
  <div class="wire__item"><span class="wire__tag">속보</span><p class="wire__text">대전역 동광장 임시 정류장 05:30 운영</p><div class="wire__end"><a class="wire__action" href="index.html">1면</a><button class="wire__close" type="button" aria-label="전보 닫기"><span data-icon="close"></span></button></div></div>
</div>
```

### tooltip — 교열 메모
```html
<span class="tip">
  <button class="tip__term" type="button" aria-describedby="tip-gangpan">강판</button>
  <span class="tip__bubble" role="tooltip" id="tip-gangpan">지면 조판을 끝내고 윤전으로 넘기는 일 · <span class="mono">01:20</span></span>
</span>
```
아이콘 단추에도 같은 구조(`.tip` > `button.btn--icon` + `.tip__bubble`). 위치 `--below` `--start` `--end`, 견본 `--static`(z-index 없음 — 옆에서 연 메뉴를 덮지 않는다). hover·focus 즉시 표시(페이드 없음), Esc 로 닫힘. 숨은 말풍선은 `display:none`이라 스크롤 폭에 잡히지 않는다. 터치 기기에서 점선 용어의 누르는 면은 44px.

---

## 5. app.js 이벤트·API 요약

| 훅 | 동작 |
|---|---|
| `[data-theme-toggle]` | 주간판 ↔ 야간판, localStorage `ym-theme` |
| `[data-open="id"]` / `[data-close]` | 모달·드로어·검색 열고 닫기, Esc, 포커스 트랩·복귀 |
| `[data-cmd-open]`, ⌘K / Ctrl+K | 기사 검색 팔레트(`.cmd[data-cmd]`) |
| `[data-toast]` (+`-tag` `-tone` `-meta`) | 전보 |
| `[data-busy="ms"]` (+`data-busy-fail` `data-done` `data-busy-text`) | 로딩 시연 |
| `[data-dismiss]` · `[data-copy]` · `[data-motion-play]` · `[data-ticker-toggle]` · `[data-side-toggle]` | 알림 닫기 · 복사 · 모션 재생 · 속보 정지 · 사이드바 접기 |
| `[data-calendar]` · `[data-carousel]` · `[data-kanban]` · `.tbl__sort` · `.tabs` · `.acc` · 메뉴 · 팝오버 | 각 절 참고 |
| `form[data-validate]` · `[data-wizard]` | 서식 검사 · 단계 마법사 |
| `[data-bind="#선택자"]` (+`data-bind-text`) | 입력·선택값이 다른 요소 글자를 바꿈(예: 복각본 날짜 → 미리보기 제호 아래 날짜) |
| `[data-select-list]` / `[data-select]` / `[data-select-panel]` | 목록 선택 → 열람 판 전환 |
| `[data-countdown]` + `[data-now]` | 마감 카운트다운 |
| `[data-rule-in]` | 화면에 들어올 때 괘선 긋기(면 머리 등) |
| `[data-folios]` | 면 번호 시연(이동 없이 현재 면만 바뀜) |
| `window.YM` | `toast(opts)` `setTheme('dark'\|'light')` `open(id)` `close(id)` `announce(msg)` `paintIcons(el)` |
| 이벤트 | `overlay:open` `overlay:close` `calendar:select` `kanban:move` `wizard:step` |
