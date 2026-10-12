# COMPONENTS — 오선음악당 OSEON HALL v2 마크업 계약

index.html · pages/*.html을 맡은 에이전트는 **이 문서만 보고** 마크업한다. 디자인 근거와 세계관 값(날짜·가격·인물·ID)은 `DIRECTION.md`의 팩트 시트에서만 가져온다.

- 클래스는 BEM(`블록__요소--변형`). 상태는 가능하면 ARIA 속성으로 표시한다(`aria-current`, `aria-selected`, `aria-expanded`, `aria-pressed`, `aria-busy`, `aria-invalid`, `aria-disabled`, `disabled`, `hidden`). CSS가 이 속성을 읽는다.
- 장면 CSS(`index.css`, `pages/<name>.css`)도 **semantic 토큰만** 쓴다(2절). raw hex 금지, 인라인 `grid-template-columns` 금지(스팬 클래스 사용). `style="--val:75.8%"`처럼 커스텀 속성을 넣는 것은 허용.
- 아이콘은 인라인 SVG `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="…"/></svg>`. 색은 CSS가 `stroke: currentColor`로 준다. **presentation attribute에 `var()` 금지.** 아이콘 모음은 9절.
- 모노(JetBrains Mono)는 `code`·`command` 안에서만. 한글 라벨에 자간·대문자 변환 금지. `.t-caps`(+0.06em 대문자)는 `OSEON HALL`, `No.41` 같은 라틴·숫자에만.
- 텍스트 가운데 정렬 금지(flush-left). 숫자 열만 오른쪽 정렬.

---

## 0. 페이지 뼈대 (모든 HTML 공통)

```html
<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>매표 현황판 — 오선음악당</title>
<script>(function(){var d=document.documentElement;d.classList.add('js');try{var q=new URLSearchParams(location.search).get('theme');var s=localStorage.getItem('oseon-theme');var t=(q==='dark'||q==='light')?q:(s==='dark'||s==='light')?s:(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');d.setAttribute('data-theme',t);}catch(e){d.setAttribute('data-theme','light');}})();</script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;700;800;900&family=Gothic+A1:wght@400;500;700;800;900&family=JetBrains+Mono:wght@400;500&display=swap">
<link rel="stylesheet" href="styles.css">        <!-- pages: ../styles.css -->
<link rel="stylesheet" href="index.css">         <!-- pages: dashboard.css 등 장면 전용 1개 -->
</head>
<body>
<a class="skip" href="#main">본문으로 건너뛰기</a>
<!-- 3-1 navbar -->
<main id="main">
  <!-- index: P1 표지 포스터부터 / pages: 3-3 페이지 헤드부터 -->
</main>
<!-- 3-2 footer -->
<!-- 오버레이(모달·드로어·커맨드 팔레트)는 body 끝. 커맨드 팔레트(3-5)는 모든 HTML에 1개 -->
<script src="app.js"></script>                   <!-- pages: ../app.js -->
</body>
</html>
```

- `<title>`: `<화면 이름> — 오선음악당`. index는 `오선음악당 2026–27 시즌 포스터 연작`.
- localStorage 키 `oseon-theme`. 우선순위 `?theme=dark|light` → localStorage → 시스템.
- 인라인 스크립트가 `html.js`를 붙인다. rule-draw·grid-set 모션은 이 클래스가 있을 때만 0에서 시작한다.

---

## 1. 레이아웃 문법 (base.css)

### 1-1. 판 `.plate` — 포스터 한 장
```html
<section class="plate plate--grid plate--marks" aria-labelledby="p4-title">
  <span class="plate__rule" data-rule aria-hidden="true"></span>   <!-- 판 상단 8px 룰, 판마다 1개 -->
  <div class="grid">
    <div class="c-5">…</div>
    <div class="c-7">…</div>
  </div>
  <span class="cropnum cropnum--br" aria-hidden="true">41</span>  <!-- 크롭 숫자: 판 밖으로 잘림 -->
</section>
```
| 클래스 | 뜻 |
|---|---|
| `.plate` | 풀블리드 배경 + 여백(64/40/16px) 안 내용 + 위아래 1모듈(96/64px) 패딩 + `overflow: clip` |
| `.plate--ink` / `.plate--red` / `.plate--gray` / `.plate--paper` | 잉크 판(다크=#000 + 1px 프레임) / 레드 판(양 모드 동일, 밤의 판 룰 = #000) / 복사지 회색 / 종이. **판 안 컴포넌트 색은 자동 재매핑**(레드 판 안 primary 버튼 = 잉크 면, 링크·포커스 = 흰색) |
| `.plate--lit` | 조명 받은 종이(수정 3). 라이트는 종이 판과 같고, 밤에는 `#E9E7E2` 밝은 판 + 먹 글자로 남는다 — 종이 헤드(inbox · onboarding)가 밤에 잉크 헤드와 같은 검정 판이 되지 않게 |
| `.plate--grid` | **시그니처 1**: 단 경계 세로선 + 모듈 가로선이 보인다. `--cols`를 따라 12/8/4단 |
| `.plate--cols` | `.plate--grid`와 함께 쓰면 세로선만 |
| `.plate--marks` | 네 모서리 인쇄 재단선 |
| `.plate--tight` · `.plate--flush` · `.plate--screen` | 위아래 48px · 0 · 최소 100svh |
| `.plate__rule` (+ `--accent`) | 판 상단 8px 룰(레드 판에서는 흰색). `data-rule`이면 뷰포트 진입 시 왼쪽부터 그어진다 |
| `.on-ink` · `.on-red` | 판이 아닌 임의 컨테이너에 같은 색 재매핑 |
| `.gridlines` (+ `--gl-cols`, `--gl-row`) | 임의 상자에 4단 노출 그리드 |

**판 구분**: 판끼리는 8px 룰 또는 판 색 전환으로만 나눈다. 같은 분할을 연속 두 판에 쓰지 않는다. 판마다 레드는 한 덩어리.

### 1-2. 그리드 `.grid` — 12 / 8 / 4단
```html
<div class="grid">
  <div class="c-3">왼쪽 3단</div>
  <div class="c-8 s-5">5단 시작선부터 8단(4단은 비워 둠)</div>
</div>
```
- 데스크톱(≥1200) 12단·거터 24px, 태블릿(768–1199) 8단, 모바일(<768) 4단·거터 16px.
- `.c-1`…`.c-12` 스팬, `.s-1`…`.s-12` 시작선(데스크톱에서만). `.r-2`/`.r-3` 행 스팬. `.h-1`…`.h-6` 최소 높이 = 모듈 배수.
- 태블릿 자동 매핑: 2→2, 3→3, 4·5→3, 6→4, 7·8·9→5, 10→6, 11·12→8. 다르게 하려면 `.tc-1`…`.tc-8`, `.ts-1`…`.ts-5`.
- 모바일: 전부 4단 전폭. 반폭이 필요하면 `.mc-2`(또는 `.mc-1`·`.mc-3`).
- 허용 분할 3/9, 4/8, 5/7, 2/10, 2/5/5, 3/4/5. 6/6·4/4/4·3/3/3/3 금지. 판마다 최소 3단은 의도적으로 비운다(`.s-N`으로 띄우기).
- `.grid--stretch`(칸 높이 맞춤) `.grid--end` `.grid--rows-0` `.grid--rows-module`. 행 간격은 `--row-gap`으로 바꾼다.

### 1-3. 크롭 숫자 `.cropnum` — 시그니처 2
판보다 큰 활자. 부모가 `.plate`(이미 clip)이거나 `.crop`이어야 한다. 숫자는 최소 60%가 판 안에 남는다.
```html
<span class="cropnum cropnum--br" aria-hidden="true">26/27</span>
```
| 클래스 | 뜻 |
|---|---|
| `.cropnum--br` / `--tr` / `--bl` | 오른쪽 아래 / 오른쪽 위 / 왼쪽 아래에 절대 배치, 판 경계 밖으로 잘림. 미세 조정은 `--crop-x`, `--crop-y` |
| `.cropnum--flow` | 흐름 안에 두고 오른쪽만 넘침 |
| 크기 | 기본 `--fs-poster`(176–448px) · `--lg`(176–360) · `--md`(120–208) · `--sm`(96). 직접 `style="--crop-size:240px"` |
| `.cropnum--ko` | 한글(예: profile `서윤재`)은 Gothic A1 |
| `.cropnum--accent` | 레드 글자(흰 판에서만, 한 판에 하나) |

크롭 숫자는 장식이 아니라 데이터다: index `26/27`·`41`–`50`, dashboard `76`, kanban 컬럼 카운트, pricing `576`, product `41`, profile `서윤재`, 404 `404`. 같은 값을 화면에 텍스트로도 둔다(`aria-hidden` 크롭 + 읽히는 문장).

### 1-4. 레드 정사각 인덱스 `.sq` (크롭 숫자의 축약형)
```html
<span class="sq" aria-label="안 읽음 3통">3</span>   <!-- 24px -->
<span class="sq sq--md">12</span>                    <!-- 32px -->
<span class="sq sq--lg">41</span>                    <!-- 48px -->
<span class="sq sq--dot" aria-hidden="true"></span>  <!-- 8px 점 -->
```
변형 `--ink`(잉크 면) `--outline`(1px 테두리) `--muted`.

### 1-5. 오선 시그넷·워드마크 (로고·파비콘·푸터에만)
```html
<span class="signet" aria-hidden="true"></span>          <!-- 32px. --sm 24 · --lg 72 · --xl 160 -->
<a class="wordmark" href="index.html"><span class="signet" aria-hidden="true"></span>
  <span class="wordmark__text"><span class="wordmark__latin">OSEON HALL</span><span class="wordmark__ko">오선음악당</span></span></a>
```

### 1-6. 활자 유틸
| 클래스 | 크기(데스크톱/모바일) | 용도 |
|---|---|---|
| `.t-poster` | 176–448 / 176, 900 | 크롭 숫자 외 거대 활자(줄바꿈 없음) |
| `.t-display` | 56–144 / 56, 900 | 한글 포스터 제목 "선과 면" |
| `.t-h1` `.t-h2` `.t-h3` `.t-h4` | 72·48·32·24 / 40·32·24·20 | 페이지·판·블록·행 제목 |
| `.t-lead` `.t-body` `.t-small` `.t-caption` | 20·16·14·12 | 리드·본문·표·캡션 |
| `.t-caps` | +0.06em 대문자 | 라틴·숫자 전용 |
| `.t-num` | tabular-nums | 시간표·가격·좌석 수 |
| `.t-vertical` | 세로쓰기(모바일에서 가로로 돌아옴) | 판 왼쪽 단 세로 제목 |
| `.t-muted` `.t-accent` `.t-danger` `.t-success` `.t-warning` `.t-info` | 색 | |
| `.t-bold` `.t-heavy` `.t-black` `.t-ko` `.t-mono` `.t-right` `.t-nowrap` `.measure` `.measure--narrow` | | |

한 판 안에서 가장 큰 활자 : 본문 ≥ 8:1. 28–40px 중간 크기 남발 금지.

배치 유틸: `.stack`(세로, `--8 --24 --32 --48 --96`) `.cluster`(가로 줄바꿈, `--8 --24`) `.split`(양끝) `.flow` `.push-end`. 선: `.rule` `.rule--block`(2px) `.rule--plate`(8px) `.rule--soft` `.rule--accent` — `data-rule`을 붙이면 그어진다. 접근성: `.vh` `.skip` `.kbd`.

---

### 1-7. 시리즈 번호 표기 · 통화 기호 `.won`
- 시리즈 번호는 아라비아 숫자로 쓴다: 「새음악 시리즈 1」「새음악 시리즈 2」. 로마 숫자(글리프 U+2160·2161, 또는 라틴 I + 막대 처리)는 쓰지 않는다 — 글리프는 Gothic A1 폴백에서 'ㅣ'로, 막대 처리는 세리프 I 로 읽혀 그로테스크 단일 체계를 깬다. `<title>`·`aria-label`·`data-keywords`도 같은 숫자.
- 20px 이상 대형 금액의 ₩는 `<span class="won">₩</span>72,000`. 14px 이하 본문·표 금액은 그대로 `₩72,000`.

## 2. 장면 CSS에서 쓸 semantic 토큰

색: `--bg --surface --surface-2 --fg --fg-muted --fg-placeholder --rule --rule-soft --grid-line --plate-ink --on-plate-ink --plate-edge --plate-red --on-plate-red --grid-line-on-plate --fg-on-plate-muted --accent --on-accent --accent-hover --accent-text --link --focus --success-fg --warning-fg --info-fg --danger-fg --disabled-fill --disabled-fg --disabled-rule --overlay --tint-1 --tint-2 --tint-3 --tint-4 --poster-paper --on-poster-paper --poster-paper-grid --code-*`
- `--accent-text`: 레드를 **글자**로 쓸 때(다크에서 #FF5240). 면은 `--accent`.
- `--tint-1…4`: 잉크 농도 8/25/50/75% — 히트맵·불릿 범위. 칸마다 숫자를 함께 쓴다.

치수: `--margin --gutter --module --cols --baseline --s-half --s-1(8) --s-2(16) --s-3(24) --s-4(32) --s-5(40) --s-6(48) --s-7(56) --s-8(64) --s-12(96) --line-plate --line-block --line-hair --touch(44) --ctl-sm --ctl-md --ctl-lg --sq-xs --sq-sm --sq-md --sq-lg --nav-h`
활자: `--font-display --font-sans --font-ko --font-mono --fw-* --fs-* --lh-* --ls-*`
모션: `--dur-1(120) --dur-2(240) --dur-3(480) --dur-cut --dur-draw-sm --dur-draw-md --ease-rule --ease-linear`
층: `--z-nav --z-pop --z-layer --z-toast --z-grid`

그림자·blur·radius·그라데이션 토큰은 없다. 만들지 말 것.

---

## 3. 공통 셸 — 복사해서 쓰는 스니펫 (수정 금지, 경로·현재 표시만 바꾼다)

### 3-1. navbar

**현재 표시 규칙** (주 메뉴는 공연·회원·운영이 드롭다운 버튼, 시즌권만 링크. 버튼은 `is-current` 클래스, 메뉴 안 `<a>`와 모바일 판 링크는 `aria-current="page"`). 상단 내비만으로 404를 뺀 8개 화면에 닿는다(404는 index 화면 색인·푸터에서).

| 화면 | 주 메뉴 현재 | 메뉴 안 / 모바일 판 현재 |
|---|---|---|
| index · 404 | 없음 | 없음 |
| product | 공연(`is-current`) | 「선과 면」 OS26-041 |
| profile | 공연(`is-current`) — 상주 음악가는 공연 하위 | 상주 음악가 서윤재 |
| pricing | 시즌권(`aria-current="page"`) | 시즌권 |
| settings · onboarding | 회원(`is-current`) | 내 계정 / 오선 회원 가입 |
| dashboard · inbox · kanban | 운영(`is-current`) | 매표 현황 / 받은편지함 / 포스터 제작 보드 |

**index 경로 (`index.html`)**
```html
<header class="nav">
  <div class="nav__bar">
    <a class="nav__brand wordmark" href="index.html" aria-label="오선음악당 첫 화면">
      <span class="signet" aria-hidden="true"></span>
      <span class="wordmark__text"><span class="wordmark__latin">OSEON HALL</span><span class="wordmark__ko">오선음악당</span></span>
    </a>
    <nav class="nav__menu" aria-label="주 메뉴">
      <ul class="nav__list">
        <li class="menu">
          <button class="nav__link menu__trigger" type="button" aria-haspopup="menu" aria-expanded="false" aria-controls="nav-show">공연 <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg></button>
          <ul class="menu__list" id="nav-show" role="menu" aria-label="공연" hidden>
            <li role="none"><a class="menu__item" role="menuitem" href="pages/product.html"><span class="menu__text">「선과 면」 OS26-041</span><span class="menu__key">10.16</span></a></li>
            <li class="menu__sep" role="separator"></li>
            <li class="menu__label" role="presentation">음악가</li>
            <li role="none"><a class="menu__item" role="menuitem" href="pages/profile.html"><span class="menu__text">상주 음악가 서윤재</span></a></li>
          </ul>
        </li>
        <li><a class="nav__link" href="pages/pricing.html">시즌권</a></li>
        <li class="menu">
          <button class="nav__link menu__trigger" type="button" aria-haspopup="menu" aria-expanded="false" aria-controls="nav-member">회원 <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg></button>
          <ul class="menu__list" id="nav-member" role="menu" aria-label="회원" hidden>
            <li role="none"><a class="menu__item" role="menuitem" href="pages/settings.html"><span class="menu__text">내 계정</span><span class="menu__key">김도연</span></a></li>
            <li role="none"><a class="menu__item" role="menuitem" href="pages/onboarding.html"><span class="menu__text">오선 회원 가입</span><span class="menu__key">₩40,000</span></a></li>
          </ul>
        </li>
        <li class="menu">
          <button class="nav__link menu__trigger" type="button" aria-haspopup="menu" aria-expanded="false" aria-controls="nav-ops">운영 <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg></button>
          <ul class="menu__list menu__list--end" id="nav-ops" role="menu" aria-label="운영" hidden>
            <li role="none"><a class="menu__item" role="menuitem" href="pages/dashboard.html"><span class="menu__text">매표 현황</span><span class="menu__key">18:00</span></a></li>
            <li role="none"><a class="menu__item" role="menuitem" href="pages/inbox.html"><span class="menu__text">받은편지함</span><span class="menu__key">남궁윤</span></a></li>
            <li role="none"><a class="menu__item" role="menuitem" href="pages/kanban.html"><span class="menu__text">포스터 제작 보드</span><span class="menu__key">No.41–50</span></a></li>
          </ul>
        </li>
      </ul>
    </nav>
    <div class="nav__tools">
      <button class="nav__search" type="button" data-open="command" aria-haspopup="dialog">
        <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M10.5 17a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13zM15.5 15.5L20 20"/></svg>
        <span class="nav__search-label">공연·회원 검색</span><kbd class="kbd">⌘K</kbd>
      </button>
      <button class="iconbtn" type="button" data-grid-toggle aria-pressed="false" aria-label="구성 그리드 보기 (G)"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h16v16H4zM9.3 4v16M14.7 4v16M4 12h16"/></svg></button>
      <button class="iconbtn" type="button" data-theme-toggle aria-pressed="false" aria-label="밤 화면"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h16v16H4zM12 4v16M12 8h8M12 12h8M12 16h8"/></svg></button>
      <button class="iconbtn nav__burger" type="button" data-nav-toggle aria-expanded="false" aria-controls="nav-panel" aria-label="메뉴 열기"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 7h18M3 12h18M3 17h18"/></svg></button>
    </div>
  </div>
  <div class="nav__panel on-ink" id="nav-panel" hidden>
    <ul class="nav__panel-list">
      <li><a class="nav__panel-link" href="pages/product.html">공연 <small>OS26-041 – 050</small></a>
        <div class="nav__panel-sub"><a href="pages/product.html">「선과 면」 OS26-041</a><a href="pages/profile.html">상주 음악가 서윤재</a></div></li>
      <li><a class="nav__panel-link" href="pages/pricing.html">시즌권 <small>대극장 8 · ₩576,000</small></a></li>
      <li><a class="nav__panel-link" href="pages/settings.html">회원</a>
        <div class="nav__panel-sub"><a href="pages/settings.html">내 계정</a><a href="pages/onboarding.html">오선 회원 가입</a></div></li>
      <li><a class="nav__panel-link" href="pages/dashboard.html">운영</a>
        <div class="nav__panel-sub"><a href="pages/dashboard.html">매표 현황</a><a href="pages/inbox.html">받은편지함</a><a href="pages/kanban.html">제작 보드</a></div></li>
    </ul>
  </div>
</header>
```

**pages 경로 (`pages/*.html`)** — 위와 동일하되 경로만 다르다. 예: product 화면.
```html
<header class="nav">
  <div class="nav__bar">
    <a class="nav__brand wordmark" href="../index.html" aria-label="오선음악당 첫 화면">
      <span class="signet" aria-hidden="true"></span>
      <span class="wordmark__text"><span class="wordmark__latin">OSEON HALL</span><span class="wordmark__ko">오선음악당</span></span>
    </a>
    <nav class="nav__menu" aria-label="주 메뉴">
      <ul class="nav__list">
        <li class="menu">
          <button class="nav__link menu__trigger is-current" type="button" aria-haspopup="menu" aria-expanded="false" aria-controls="nav-show">공연 <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg></button>
          <ul class="menu__list" id="nav-show" role="menu" aria-label="공연" hidden>
            <li role="none"><a class="menu__item" role="menuitem" href="product.html" aria-current="page"><span class="menu__text">「선과 면」 OS26-041</span><span class="menu__key">10.16</span></a></li>
            <li class="menu__sep" role="separator"></li>
            <li class="menu__label" role="presentation">음악가</li>
            <li role="none"><a class="menu__item" role="menuitem" href="profile.html"><span class="menu__text">상주 음악가 서윤재</span></a></li>
          </ul>
        </li>
        <li><a class="nav__link" href="pricing.html">시즌권</a></li>
        <li class="menu">
          <button class="nav__link menu__trigger" type="button" aria-haspopup="menu" aria-expanded="false" aria-controls="nav-member">회원 <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg></button>
          <ul class="menu__list" id="nav-member" role="menu" aria-label="회원" hidden>
            <li role="none"><a class="menu__item" role="menuitem" href="settings.html"><span class="menu__text">내 계정</span><span class="menu__key">김도연</span></a></li>
            <li role="none"><a class="menu__item" role="menuitem" href="onboarding.html"><span class="menu__text">오선 회원 가입</span><span class="menu__key">₩40,000</span></a></li>
          </ul>
        </li>
        <li class="menu">
          <button class="nav__link menu__trigger" type="button" aria-haspopup="menu" aria-expanded="false" aria-controls="nav-ops">운영 <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg></button>
          <ul class="menu__list menu__list--end" id="nav-ops" role="menu" aria-label="운영" hidden>
            <li role="none"><a class="menu__item" role="menuitem" href="dashboard.html"><span class="menu__text">매표 현황</span><span class="menu__key">18:00</span></a></li>
            <li role="none"><a class="menu__item" role="menuitem" href="inbox.html"><span class="menu__text">받은편지함</span><span class="menu__key">남궁윤</span></a></li>
            <li role="none"><a class="menu__item" role="menuitem" href="kanban.html"><span class="menu__text">포스터 제작 보드</span><span class="menu__key">No.41–50</span></a></li>
          </ul>
        </li>
      </ul>
    </nav>
    <div class="nav__tools">
      <button class="nav__search" type="button" data-open="command" aria-haspopup="dialog">
        <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M10.5 17a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13zM15.5 15.5L20 20"/></svg>
        <span class="nav__search-label">공연·회원 검색</span><kbd class="kbd">⌘K</kbd>
      </button>
      <button class="iconbtn" type="button" data-grid-toggle aria-pressed="false" aria-label="구성 그리드 보기 (G)"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h16v16H4zM9.3 4v16M14.7 4v16M4 12h16"/></svg></button>
      <button class="iconbtn" type="button" data-theme-toggle aria-pressed="false" aria-label="밤 화면"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h16v16H4zM12 4v16M12 8h8M12 12h8M12 16h8"/></svg></button>
      <button class="iconbtn nav__burger" type="button" data-nav-toggle aria-expanded="false" aria-controls="nav-panel" aria-label="메뉴 열기"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 7h18M3 12h18M3 17h18"/></svg></button>
    </div>
  </div>
  <div class="nav__panel on-ink" id="nav-panel" hidden>
    <ul class="nav__panel-list">
      <li><a class="nav__panel-link" href="product.html" aria-current="page">공연 <small>OS26-041 – 050</small></a>
        <div class="nav__panel-sub"><a href="product.html" aria-current="page">「선과 면」 OS26-041</a><a href="profile.html">상주 음악가 서윤재</a></div></li>
      <li><a class="nav__panel-link" href="pricing.html">시즌권 <small>대극장 8 · ₩576,000</small></a></li>
      <li><a class="nav__panel-link" href="settings.html">회원</a>
        <div class="nav__panel-sub"><a href="settings.html">내 계정</a><a href="onboarding.html">오선 회원 가입</a></div></li>
      <li><a class="nav__panel-link" href="dashboard.html">운영</a>
        <div class="nav__panel-sub"><a href="dashboard.html">매표 현황</a><a href="inbox.html">받은편지함</a><a href="kanban.html">제작 보드</a></div></li>
    </ul>
  </div>
</header>
```
- 하위 화면(settings 예): `<button class="nav__link menu__trigger is-current" …>회원` + 메뉴 안 `<a class="menu__item" role="menuitem" href="settings.html" aria-current="page">`, 모바일 판은 `<a href="settings.html" aria-current="page">내 계정</a>`.
- 운영 하위 화면(inbox 예): 운영 버튼에 `is-current`, 메뉴 안 `받은편지함`과 모바일 판 하위 `받은편지함`에 `aria-current="page"`.

### 3-2. footer (잉크 판 3/9) — 모든 HTML 동일

**index 경로**
```html
<footer class="site-foot plate plate--ink">
  <div class="grid">
    <div class="c-3 site-foot__brand">
      <span class="signet signet--lg" aria-hidden="true"></span>
      <p class="site-foot__name">오선음악당</p>
      <p class="site-foot__addr">서울 중구 청계천로 248<br>우편번호 04563</p>
    </div>
    <div class="c-9 site-foot__cols">
      <div class="site-foot__col"><p class="site-foot__title">매표소</p><p>02-6450-0410</p><p>화–일 10:00–19:00 · 월 휴관</p><p>공연일은 공연 시작 시각까지</p></div>
      <div class="site-foot__col"><p class="site-foot__title">시즌</p><p>2026–27</p><p>포스터 No.38–50</p></div>
      <nav class="site-foot__col site-foot__col--links" aria-label="화면 색인"><p class="site-foot__title">화면 색인</p>
        <ul class="site-foot__links">
          <li><a href="index.html">시즌 포스터</a></li>
          <li><a href="pages/product.html">공연 OS26-041</a></li>
          <li><a href="pages/pricing.html">시즌권과 회원</a></li>
          <li><a href="pages/profile.html">상주 음악가</a></li>
          <li><a href="pages/onboarding.html">회원 가입</a></li>
          <li><a href="pages/settings.html">내 계정</a></li>
          <li><a href="pages/dashboard.html">매표 현황판</a></li>
          <li><a href="pages/inbox.html">받은편지함</a></li>
          <li><a href="pages/kanban.html">제작 보드</a></li>

          <li><a href="pages/404.html">없는 공연(404)</a></li>
        </ul></nav>
    </div>
  </div>
  <div class="site-foot__base"><span>© 2026 오선음악당</span><span>OSEON HALL · 그리드 G · 검색 ⌘K</span></div>
</footer>
```
**pages 경로 (`pages/*.html`)** — 위와 같고 링크 경로만 다르다. 현재 화면 링크에 `aria-current="page"`(예: dashboard). 404에서도 같은 푸터.
```html
<footer class="site-foot plate plate--ink">
  <div class="grid">
    <div class="c-3 site-foot__brand">
      <span class="signet signet--lg" aria-hidden="true"></span>
      <p class="site-foot__name">오선음악당</p>
      <p class="site-foot__addr">서울 중구 청계천로 248<br>우편번호 04563</p>
    </div>
    <div class="c-9 site-foot__cols">
      <div class="site-foot__col"><p class="site-foot__title">매표소</p><p>02-6450-0410</p><p>화–일 10:00–19:00 · 월 휴관</p><p>공연일은 공연 시작 시각까지</p></div>
      <div class="site-foot__col"><p class="site-foot__title">시즌</p><p>2026–27</p><p>포스터 No.38–50</p></div>
      <nav class="site-foot__col site-foot__col--links" aria-label="화면 색인"><p class="site-foot__title">화면 색인</p>
        <ul class="site-foot__links">
          <li><a href="../index.html">시즌 포스터</a></li>
          <li><a href="product.html">공연 OS26-041</a></li>
          <li><a href="pricing.html">시즌권과 회원</a></li>
          <li><a href="profile.html">상주 음악가</a></li>
          <li><a href="onboarding.html">회원 가입</a></li>
          <li><a href="settings.html">내 계정</a></li>
          <li><a href="dashboard.html" aria-current="page">매표 현황판</a></li>
          <li><a href="inbox.html">받은편지함</a></li>
          <li><a href="kanban.html">제작 보드</a></li>

          <li><a href="404.html">없는 공연(404)</a></li>
        </ul></nav>
    </div>
  </div>
  <div class="site-foot__base"><span>© 2026 오선음악당</span><span>OSEON HALL · 그리드 G · 검색 ⌘K</span></div>
</footer>
```

### 3-3. 페이지 헤드 (pages 전용, 잉크 판 + 크롭 숫자)
```html
<header class="pagehead plate plate--ink plate--grid">
  <span class="plate__rule plate__rule--accent" data-rule aria-hidden="true"></span>
  <div class="grid">
    <div class="c-7 pagehead__text">
      <nav class="crumbs" aria-label="현재 위치">
        <ol class="crumbs__list">
          <li class="crumbs__item"><a class="crumbs__link" href="../index.html">오선음악당</a></li>
          <li class="crumbs__item"><a class="crumbs__link" href="dashboard.html">운영</a></li>
          <li class="crumbs__item"><span class="crumbs__current" aria-current="page">매표 현황판</span></li>
        </ol>
      </nav>
      <h1 class="pagehead__title">매표 현황판</h1>
      <p class="pagehead__meta">10월 10일(토) 18:00 기준 · 남궁윤 로그인 · OS26-041 판매율 75.8%</p>
      <!-- 선택: <div class="pagehead__actions">버튼 1–2개</div> -->
    </div>
  </div>
  <span class="cropnum cropnum--br pagehead__num" aria-hidden="true">76</span>
</header>
```
위 스니펫은 기본형(dashboard)이다. 9개 화면은 "같은 시즌의 다른 호수" — 판 색 · 높이 · 크롭 위치 가운데 적어도 두 축을 바꾼다(수정 2, base.css `.pagehead--*` 변형):

| 화면 | header 클래스 | 판 | 높이 | 크롭 |
|---|---|---|---|---|
| dashboard | `pagehead plate plate--ink plate--grid` | 잉크 | 4 모듈 | `76` 오른쪽 아래 `cropnum--br` |
| inbox | `pagehead pagehead--m3 pagehead--paper pagehead--crop-top plate plate--lit plate--grid` | 종이(밤: 조명 받은 종이) | 3 | `12` 오른쪽 위 `cropnum--tr` |
| kanban | `pagehead pagehead--m5 pagehead--bottom plate plate--ink plate--grid` | 잉크(글은 판 바닥) · 판 룰 먹 | 5 | `3`(교정 열 카운트) 레드 `cropnum--br cropnum--one cropnum--accent kb-headnum` |
| product | `pagehead pagehead--m3 pagehead--crop-top plate plate--ink plate--grid` | 잉크 | 3 | `41` 오른쪽 위 `cropnum--tr` |
| profile | `pagehead pagehead--name plate plate--ink plate--grid` · 판 룰은 먹(`plate__rule`만) | 잉크 | 5 | `서윤재` `cropnum--bl cropnum--ko` — h1·메타 아래 행에서 시작해 오른쪽으로만 잘림(바닥 잘림 금지 — 받침 보존, 흐름 배치, 겹침·녹아웃 띠 없음) |
| settings | `pagehead pagehead--m2 pagehead--crop-left acct-head plate plate--ink plate--grid` · 판 룰 먹 | 잉크 낮은 띠 | 2 | `0712` 왼쪽 아래 `cropnum--bl`, 글은 6–12단 |
| onboarding | `pagehead onb-head plate plate--lit plate--grid` + `.grid` 안 `.onb-head__nums` | 종이(밤: 조명 받은 종이) | 내용 | 거대 단계 숫자 `1 2 3`(현재 레드·지난 먹·남은 회색)이 헤드. 숫자 줄 = 단계 탭과 같은 4–12단 · 같은 5/4/3 리듬, 숫자 바닥 = 탭 상단 룰 |
| pricing | 헤드 없음 — 레드 4단 판(`.price-hero`)에 crumbs + h1 | 레드 | 첫 화면 | `8`(「대극장 8」) |
| 404 | 헤드 없음 — 레드 풀블리드 판 | 레드 | 100vh | `4·0·4` 왼쪽 단 세로 스택(위아래 잘림), 태블릿 가로 오른쪽 아래, 모바일 가로 오른쪽 위(첫 화면 안) |

### 3-4. 운영 사이드바 (dashboard · inbox · kanban 공통, pages 경로)
```html
<div class="workspace">
  <aside class="workspace__side side-shell" id="ops-side" data-layer="side" aria-label="운영 메뉴">
    <div class="side-shell__scrim" data-close></div>
    <div class="side-shell__panel">
      <div class="side-shell__head"><span>운영</span><button class="iconbtn" type="button" data-close aria-label="운영 메뉴 닫기"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5l14 14M19 5L5 19"/></svg></button></div>
      <nav class="side" aria-label="운영">
        <div class="side__group"><p class="side__title">매표</p>
          <ul class="side__list">
            <li><a class="side__link" href="dashboard.html"><span class="side__label">매표 현황판</span><span class="side__count">214매</span></a></li>
          </ul></div>
        <div class="side__group"><p class="side__title">홍보디자인팀</p>
          <ul class="side__list">
            <li><a class="side__link" href="inbox.html"><span class="side__label">받은편지함</span><span class="sq" aria-label="받은편지함 12통">12</span></a></li>
            <li><a class="side__link" href="kanban.html"><span class="side__label">포스터 제작 보드</span><span class="side__count">No.41–50</span></a></li>
          </ul></div>
        <div class="side__group"><p class="side__title">오늘 할 일 · 10.10 토</p>
          <ol class="side__todo">
            <li><span class="side__todo-at">18:30</span><span class="side__todo-what">매표 마감 보고<small>차도희 팀장에게</small></span></li>
            <li><span class="side__todo-at">19:00</span><span class="side__todo-what">PR-044-B 2교 회신<small>진하람 · 게시 10/24</small></span></li>
            <li><span class="side__todo-at">10/12</span><span class="side__todo-what">외벽 조명 교체 입회<small>백승민 · 휴관일</small></span></li>
          </ol></div>
        <p class="side__foot">남궁윤 · 홍보디자인팀장</p>
      </nav>
    </div>
  </aside>
  <div class="workspace__main">
    <button class="side-open" type="button" data-open="ops-side" aria-haspopup="dialog"><span class="side-open__now">매표 현황판</span><span class="t-small t-muted">운영 메뉴</span></button>
    <!-- 화면 본문 -->
  </div>
</div>
```
- 현재 화면 링크에 `aria-current="page"`, `.side-open__now` 문구도 현재 화면 이름으로.
- `.workspace`는 페이지 헤드(3-3) **아래**, `<main>` 안에 둔다. 데스크톱 3/9, 태블릿 3/5, 모바일은 `side-open` 띠 + 왼쪽 드로어.
- settings는 같은 `.workspace` + `.side`에 항목만 "개인정보 · 알림 · 결제 수단 · 접근성 좌석 · 정기권 · 탈퇴"(같은 화면 앵커 `href="#notify"`, 현재는 `aria-current="true"`, 탈퇴는 `side__link--danger`), `id="account-side"`, 그룹 제목 "내 계정 M-204318".

### 3-5. 커맨드 팔레트 (모든 HTML의 body 끝에 1개, `id="command"` 고정)
```html
<div class="cmd" id="command" data-layer hidden>
  <div class="cmd__scrim" data-close></div>
  <div class="cmd__panel" role="dialog" aria-modal="true" aria-label="공연·회원·운영 검색">
    <div class="cmd__rule" data-rule aria-hidden="true"></div>
    <div class="cmd__field">
      <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M10.5 17a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13zM15.5 15.5L20 20"/></svg>
      <input class="cmd__input" role="combobox" aria-expanded="true" aria-autocomplete="list" placeholder="공연 번호, 곡, 회원번호" aria-label="검색어">
    </div>
    <ul class="cmd__list" role="listbox" aria-label="검색 결과">
      <li class="cmd__group" role="presentation">공연</li>
      <li class="cmd__item" role="option" data-href="pages/product.html" data-keywords="리게티 윤이상 하지온 열두 칸"><span class="cmd__label">새음악 시리즈 1 「선과 면」</span><span class="cmd__meta">OS26-041</span></li>
      <li class="cmd__item" role="option" data-href="pages/product.html" data-keywords="바흐 골드베르크"><span class="cmd__label">서윤재 피아노 리사이틀</span><span class="cmd__meta">OS26-042</span></li>
      <li class="cmd__item" role="option" data-href="pages/product.html" data-keywords="베토벤"><span class="cmd__label">베토벤 피아노 협주곡 제4번 · 교향곡 제7번</span><span class="cmd__meta">OS26-043</span></li>
      <li class="cmd__group" role="presentation">회원</li>
      <li class="cmd__item" role="option" data-href="pages/settings.html"><span class="cmd__label">내 계정 — 김도연</span><span class="cmd__meta">M-204318</span></li>
      <li class="cmd__item" role="option" data-href="pages/pricing.html"><span class="cmd__label">시즌 정기권 「대극장 8」</span><span class="cmd__meta">₩576,000</span></li>
      <li class="cmd__group" role="presentation">운영</li>
      <li class="cmd__item" role="option" data-href="pages/dashboard.html"><span class="cmd__label">매표 현황판</span><span class="cmd__meta">10.10 18:00</span></li>
      <li class="cmd__item" role="option" data-href="pages/kanban.html"><span class="cmd__label">포스터 제작 보드</span><span class="cmd__meta">No.41–50</span></li>
      <li class="cmd__item" role="option" data-href="pages/inbox.html"><span class="cmd__label">받은편지함</span><span class="cmd__meta">12</span></li>
    </ul>
    <p class="cmd__empty" hidden>‘<span data-cmd-query></span>’와 맞는 항목이 없습니다.</p>
    <div class="cmd__foot"><span><kbd class="kbd">↑↓</kbd>이동</span><span><kbd class="kbd">Enter</kbd>열기</span><span><kbd class="kbd">Esc</kbd>닫기</span></div>
  </div>
</div>
```
pages에서는 `data-href`를 `product.html` 등 같은 폴더 경로로.

---

## 4. 컴포넌트 32

각 항목: 마크업 → 변형·상태. 모든 예시 카피는 팩트 시트 값.

### accordion
```html
<div class="acc" data-single>                       <!-- data-single: 하나만 열림(선택) -->
  <div class="acc__item">
    <h3 class="acc__heading"><button class="acc__trigger" type="button" aria-expanded="true" aria-controls="faq-1">
      <span class="acc__no">01</span><span class="acc__title">휠체어석 예매 안내</span><span class="acc__icon" aria-hidden="true"></span></button></h3>
    <div class="acc__panel" id="faq-1"><p>대극장 1층 A·F구역 끝열에 휠체어석 12석이 있습니다. 동반 1인까지 50% 할인됩니다.</p></div>
  </div>
</div>
```
`.acc__no` 생략 가능. `.acc--lg`(질문 24px). 비활성 `disabled`. 열린 행은 2px 잉크 룰이 그어진다.

### alert
```html
<div class="alert alert--danger" role="alert">
  <div class="alert__head"><span class="alert__mark" aria-hidden="true"></span><strong class="alert__title">휴관</strong></div>
  <p class="alert__body">10월 12일(월)은 휴관합니다. 매표소는 13일(화) 10:00에 다시 엽니다.</p>
  <button class="iconbtn alert__close" type="button" data-dismiss aria-label="알림 닫기"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5l14 14M19 5L5 19"/></svg></button>
</div>
```
변형 `--info --success --warning --danger`(danger만 레드 면 정사각), `--plate`(잉크 판 전폭 띠, 판 패딩과 같은 여백), `--compact`. `.alert__actions` 안에 버튼. 비긴급은 `role="status"`.

### badge
```html
<span class="badge badge--success"><span class="badge__mark"></span>판매 중</span>
<span class="badge badge--warning">오픈 예정 10/13 10:00</span>
<span class="badge badge--soldout">매진</span>        <!-- 유일한 채움 배지 -->
<span class="badge badge--muted">종료</span>
<span class="badge badge--ink">No.41</span>
<button class="badge" type="button" aria-pressed="true">새음악</button>   <!-- 필터 칩 -->
```
변형 `--info --danger --lg`. 숫자 카운트는 `.sq`.

### breadcrumb
```html
<nav class="crumbs" aria-label="현재 위치"><ol class="crumbs__list">
  <li class="crumbs__item"><a class="crumbs__link" href="../index.html">오선음악당</a></li>
  <li class="crumbs__item"><a class="crumbs__link" href="product.html">공연</a></li>
  <li class="crumbs__item"><span class="crumbs__current crumbs__code" aria-current="page">OS26-041</span></li>
</ol></nav>
```

### button
```html
<button class="btn btn--primary" type="button"><span class="btn__label">좌석 선택</span><span class="btn__spin" aria-hidden="true"></span>
  <svg class="btn__arrow icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15M13 6l6 6-6 6"/></svg></button>
<button class="btn btn--secondary" type="button"><span class="btn__label">프로그램 보기</span></button>
<a class="btn btn--tertiary" href="product.html"><span class="btn__label">관람 안내</span></a>
<button class="btn btn--danger" type="button"><span class="btn__label">예매 취소</span></button>
<button class="iconbtn iconbtn--line" type="button" aria-label="다음 포스터">…</button>
```
- 변형: `--primary`(레드 면, 화면당 주 동작 1개) `--secondary`(1px 테두리, hover 잉크 반전) `--tertiary`(밑줄) `--ink`(잉크 면) `--danger`. 크기 `--sm`(40, 터치 환경 44) 기본 48 `--lg`(56) `--block`.
- 상태: hover 색만, `:active` 안쪽 2px 테두리, `aria-pressed="true"` 잉크 반전, `disabled`/`aria-disabled`, **로딩 `aria-busy="true"`** → 화살표 자리에 4칸 스피너(`.btn__spin` 요소가 있어야 함). 로딩 시연은 `data-busy-demo data-busy-label="저장 중" data-toast="저장했습니다."`.
- 아이콘 버튼 `.iconbtn`(44 정사각) `--line`(테두리) `--lg`(56). 반드시 `aria-label`.
- 묶음 `.btn-row`(간격 16) · `.btn-group`(헤어라인 공유). "무료로 시작하기 / 데모 보기" 쌍 금지.

### calendar
```html
<div class="cal" data-calendar data-output="sel-date">
  <div class="cal__head">
    <h3 class="cal__title"><span class="cal__month">10</span>2026년 10월</h3>
    <div class="cal__nav"><button class="iconbtn iconbtn--line" type="button" aria-label="9월">←</button><button class="iconbtn iconbtn--line" type="button" aria-label="11월">→</button></div>
  </div>
  <table class="cal__grid">
    <caption class="vh">2026년 10월 공연 달력</caption>
    <thead><tr><th scope="col" abbr="월요일">월</th><th scope="col" abbr="화요일">화</th><th scope="col" abbr="수요일">수</th><th scope="col" abbr="목요일">목</th><th scope="col" abbr="금요일">금</th><th scope="col" abbr="토요일">토</th><th scope="col" abbr="일요일">일</th></tr></thead>
    <tbody><tr>
      <td class="cal__cell cal__cell--out cal__cell--closed"><span class="cal__blank"><span class="cal__num">28</span></span></td>
      …
      <td class="cal__cell cal__cell--closed"><button class="cal__day" type="button" disabled aria-label="10월 5일 월요일 휴관"><span class="cal__num">5</span><span class="cal__note">휴관</span></button></td>
      <td class="cal__cell"><button class="cal__day" type="button" aria-current="date" aria-label="10월 10일 토요일, 오늘"><span class="cal__num">10</span></button></td>
      <td class="cal__cell"><button class="cal__day cal__day--event" type="button" aria-pressed="true" data-label="10월 16일(금) 19:30" aria-label="10월 16일 금요일, OS26-041 선과 면"><span class="cal__num">16</span><span class="cal__ev"><span class="sq" aria-hidden="true"></span>041</span></button></td>
      <td class="cal__cell"><button class="cal__day cal__day--event" type="button" aria-label="10월 24일 토요일, OS26-042 매진"><span class="cal__num">24</span><span class="cal__ev cal__ev--soldout"><span class="sq" aria-hidden="true"></span>042</span></button></td>
    </tr></tbody>
  </table>
  <div class="cal__legend"><span><i class="cal__swatch cal__swatch--today"></i>오늘</span><span><i class="cal__swatch cal__swatch--event"></i>공연</span><span><i class="cal__swatch cal__swatch--closed"></i>휴관(월)</span></div>
</div>
```
- 2026년 10월: 1일 = 목요일, 월요일 시작 5행(9/28 – 11/1). 월요일(5·12·19·26) = `cal__cell--closed` + `disabled`.
- 상태: 오늘 `aria-current="date"`(2px 잉크 테두리) · 선택 `aria-pressed="true"`(잉크 면 반전) · 공연일 `cal__day--event` · 매진 `cal__ev--soldout` · 다른 달 `cal__cell--out` · 비활성 `disabled`.
- `.cal--mini`(칸 48px, 공연 코드 숨김 + 점). 선택 결과는 `data-output="id"` 요소에 `data-label` 문장으로 들어가고 `calendar:select` 이벤트가 난다. 화살표 키로 날짜 이동.

### card (+ 포스터 판형 `.poster`)
```html
<article class="card">
  <div class="card__poster poster poster--red poster--diag" role="img" aria-label="포스터 No.41 선과 면">
    <span class="poster__title">선과 면</span><span class="poster__mark"></span>
    <span class="poster__no">41</span><span class="poster__sig">Oseon Hall 26/27</span>
  </div>
  <div class="card__body">
    <p class="card__kicker"><span>No.41</span><span>OS26-041</span><span>새음악 시리즈 1</span></p>
    <h3 class="card__title"><a class="card__link" href="product.html">「선과 면」 리게티 · 윤이상 · 하지온</a></h3>
    <p class="card__desc">하지온 〈열두 칸〉 위촉 초연 · 류세인 지휘, 오선 필하모닉</p>
    <dl class="card__band"><div><dt>날짜</dt><dd>10.16 금 19:30</dd></div><div><dt>홀</dt><dd>대극장</dd></div><div><dt>가격</dt><dd>₩20,000–60,000</dd></div></dl>
  </div>
</article>
```
- `.poster`(B 판형 1:1.414, 4×6 노출 그리드, 크기 단위 cqw): 색 `--red` `--ink` 기본(종이 — **다크에서도 밝은 조명 박스**) `--past`(종료 공연 회색). 구성 `--diag`(45° 활자) `--vertical`(세로쓰기 제목) `--numeral`(숫자 하나 거대 크롭, `poster__no`에 `7`) `--squares`(`<span class="poster__field"></span>` 정사각 리듬) `--lattice`(굵은 격자) `--plain`(그리드 없음). 요소 `poster__title`(한글) `poster__no` `poster__meta`(날짜·시각 2줄) `poster__mark`(레드 정사각) `poster__sig`. 제목 크기는 `style="--p-title:15cqw"`, 숫자는 `--p-no`로 조정.
- 카드 변형 `--row`(가로형: 포스터 5 : 정보 7) `--selected`/`aria-current="true"`(정보 위 8px 레드 룰) `--past` `aria-disabled="true"`. 카드 전체가 `card__link` 하나로 눌린다. 버튼은 `.card__actions`(링크 위로 올라옴).
- 묶음 `.card-set` = 큰 카드 1 + `card--row` 2(태블릿 이하 한 줄씩). 오른쪽 가로형 카드는 위에서부터 붙여 쌓는다(큰 카드 높이에 끌려 사이가 벌어지지 않음). 균등 카드 그리드 금지.

### carousel
```html
<div class="carousel carousel--bleed" data-carousel data-start="41" aria-roledescription="포스터 연작" aria-label="2026–27 시즌 포스터 연작">
  <div class="carousel__head">
    <p class="carousel__count"><span class="carousel__now">41</span><span class="carousel__total">/ 50</span><span class="carousel__label">2026–27 시즌 포스터 연작</span></p>
    <div class="carousel__nav">
      <button class="iconbtn iconbtn--line" type="button" data-carousel-prev aria-label="이전 포스터">…</button>
      <button class="iconbtn iconbtn--line" type="button" data-carousel-next aria-label="다음 포스터">…</button>
    </div>
  </div>
  <div class="carousel__rail" aria-hidden="true"><span class="carousel__thumb"></span></div>
  <ul class="carousel__track" tabindex="0" aria-label="포스터 41–50, 좌우 화살표로 넘기기">
    <li class="carousel__slide"><div class="poster poster--red poster--diag" aria-hidden="true">…</div>
      <p class="carousel__cap"><strong>선과 면</strong><span>10.16 금</span></p></li>
    …
  </ul>
</div>
```
쪽 번호는 `data-start + 현재 index`. 자동 재생 없음. `--bleed`는 판 오른쪽 끝까지 흘림. 데스크톱 3.4장 / 태블릿 2.3장 / 모바일 1장. 현재 슬라이드 `aria-current="true"`(캡션 위 2px 레드).

### code
```html
<div class="code">
  <div class="code__head"><span class="code__file">grid.tokens.css</span>
    <button class="code__copy" type="button" data-copy><svg class="icon icon--sm" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 8h12v12H8zM4 16V4h12"/></svg><span class="code__copy-label">복사</span></button></div>
  <pre class="code__body" tabindex="0"><code><span class="tok-c">/* 오선음악당 구성 그리드 */</span>
<span class="tok-k">:root</span> <span class="tok-p">{</span>
  --cols: <span class="tok-n">12</span>;
<span class="tok-p">}</span></code></pre>
</div>
```
행 번호는 app.js가 줄마다 `.code__line`으로 감싸 자동으로 붙인다(토큰 span이 줄을 넘지 않게). 강조 줄은 직접 `<span class="code__line code__line--mark">`. 토큰 `tok-k`(키) `tok-s`(문자열) `tok-n`(숫자, 레드) `tok-c`(주석) `tok-p`(구두점). 인라인은 `<code>`.

### command
3-5 셸 참고. 열린 상태 정적 견본은 `.cmd.cmd--static`(`data-layer`·`hidden` 없이, `id` 다르게, `cmd__input`에 `value="골드"`) — 견본 안에서도 필터·화살표가 동작한다. 선택 행 `aria-selected="true"`(레드 정사각 + 700), 비활성 `aria-disabled="true"`. ⌘K/Ctrl+K는 `.cmd[data-layer]`를 연다.

### drawer
```html
<button class="btn btn--primary" type="button" data-open="seat-drawer" aria-haspopup="dialog"><span class="btn__label">예매</span></button>
<div class="drawer" id="seat-drawer" data-layer hidden>
  <div class="drawer__scrim" data-close></div>
  <aside class="drawer__panel" role="dialog" aria-modal="true" aria-labelledby="seat-drawer-t">
    <div class="drawer__rule" data-rule aria-hidden="true"></div>
    <div class="drawer__head"><div><span class="drawer__kicker">OS26-041 · 10.16 금 19:30</span><h2 class="drawer__title" id="seat-drawer-t">좌석 요약</h2></div>
      <button class="iconbtn" type="button" data-close aria-label="닫기">…</button></div>
    <div class="drawer__body">
      <dl class="drawer__sum">
        <div><dt>좌석</dt><dd>1층 C구역 7열 12·13번</dd></div>
        <div><dt>등급</dt><dd>S석 × 2</dd></div>
        <div><dt>오선 회원 10%</dt><dd>−₩8,000</dd></div>
        <div class="drawer__total"><dt>합계</dt><dd>₩72,000</dd></div>
      </dl>
    </div>
    <div class="drawer__foot"><button class="btn btn--primary" type="button">…결제</button><button class="btn btn--secondary" type="button" data-close>…좌석 다시 고르기</button></div>
  </aside>
</div>
```
`--left`(왼쪽 3단), 정적 견본 `--static`(`data-layer`·`hidden` 빼고).

### empty
```html
<div class="empty"><span class="empty__count" aria-hidden="true">0</span>
  <p class="empty__title">10월 13일(화)에는 공연이 없습니다.</p>
  <p class="empty__text">다음 공연은 10월 16일(금) 19:30 「선과 면」입니다.</p>
  <div class="empty__action"><a class="btn btn--secondary btn--sm" href="product.html"><span class="btn__label">다음 공연 보기</span></a></div>
</div>
```
`--compact`(숫자 숨김), `--error`(제목 앞 레드 정사각). 동작은 하나만. `.empty__count`는 먹으로 꽉 찬 크롭 숫자(시그니처 2 축약, 120–208px, 60% 이상 판 안)이고, 있으면 오른쪽에 숫자 자리만큼 여백이 자동으로 생겨 문장과 겹치지 않는다. 윤곽선 고스트 숫자는 쓰지 않는다.

### form
```html
<form class="fields" data-validate data-success="좌석을 담았습니다." data-success-text="1층 C구역 7열 12번">
  <div class="field">
    <label class="field__label" for="buyer">예매자 이름 <span class="field__req" aria-hidden="true">필수</span></label>
    <input class="input" id="buyer" name="buyer" required autocomplete="name" placeholder="예: 김도연" data-error="이름을 입력해 주세요.">
    <p class="field__error" hidden></p>
  </div>
  <div class="field">
    <label class="field__label" for="mno">회원번호 <span class="field__opt">선택</span></label>
    <input class="input" id="mno" value="M-204318" pattern="M-\d{6}" title="M- 뒤에 숫자 6자리" aria-describedby="mno-hint">
    <p class="field__hint" id="mno-hint">회원 10% 할인이 자동 적용됩니다.</p>
    <p class="field__error" hidden></p>
  </div>
  <div class="field"><label class="field__label" for="hall">홀</label>
    <div class="select"><select class="input" id="hall"><option>대극장</option><option>실내악홀</option></select></div></div>
  <fieldset class="fieldset"><legend class="fieldset__legend">좌석 등급</legend>
    <div class="choices">
      <label class="choice"><input type="radio" name="grade" value="R" required><span class="choice__title">R석</span><span class="choice__meta">1층 B–E구역 1–6열 · 잔여 42</span><span class="choice__price">₩60,000</span></label>
      <label class="choice"><input type="radio" name="grade" value="A"><span class="choice__title">A석</span><span class="choice__meta">3층 K–M구역 · 잔여 188</span><span class="choice__price">₩20,000</span></label>
    </div>
    <p class="field__error" hidden></p>
  </fieldset>
  <label class="check"><input class="check__input" type="checkbox" required><span class="check__box" aria-hidden="true"></span><span class="check__label">취소 수수료 규정 동의 <span class="check__sub">공연 7일 전까지 무료 · 6–1일 전 10% · 당일 취소 불가</span></span></label>
  <label class="radio"><input class="radio__input" type="radio" name="pick" checked><span class="radio__box" aria-hidden="true"></span><span class="radio__label">모바일 티켓</span></label>
  <label class="switch"><input class="switch__input" type="checkbox" role="switch" checked><span class="switch__track" aria-hidden="true"><span>끔</span><span>켬</span></span><span class="switch__label">공연 전날 알림톡</span></label>
  <div class="seg" role="radiogroup" aria-label="구분">
    <label class="seg__opt"><input type="radio" name="kind" checked><span>연 회원</span></label>
    <label class="seg__opt"><input type="radio" name="kind"><span>시즌권</span></label>
  </div>
  <div class="field"><span class="field__label" id="qty-l">수량</span>
    <div class="qty" role="group" aria-labelledby="qty-l">
      <button class="qty__btn" type="button" data-qty-dec aria-label="한 매 줄이기"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/></svg></button>
      <input class="qty__val" type="number" value="2" min="1" max="4" aria-label="매수">
      <button class="qty__btn" type="button" data-qty-inc aria-label="한 매 늘리기"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M12 5v14"/></svg></button>
    </div></div>
  <div class="form-actions"><button class="btn btn--primary" type="submit"><span class="btn__label">좌석 담기</span><span class="btn__spin" aria-hidden="true"></span><svg class="btn__arrow icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15M13 6l6 6-6 6"/></svg></button></div>
</form>
```
- `form[data-validate]`: 제출 시 required·pattern·type 검사 → `aria-invalid` + 같은 `.field`/`.fieldset` 안 `.field__error`에 문장(`data-error` 우선) → 첫 오류로 포커스. 통과하면 제출 버튼 `aria-busy` 0.9초 후 토스트(`data-success`).
- 입력 변형 `.input--lg`(검색 24px) `--sm` `--num`, `textarea.input`(박스), `.input-wrap`(왼쪽 아이콘 / 오른쪽 `.kbd`). 상태: hover 서피스2, focus 레드 룰 + outline, `aria-invalid`, `disabled`(점선), `readonly`.
- 배치 `.fields`(세로 32) `.fields--row`(자동 열) `.choices`(타일 자동 열).

### kanban
```html
<div class="kanban-wrap">
  <div class="kanban" data-kanban>
    <section class="kanban__col" data-stage="plan" aria-labelledby="kb-plan">
      <header class="kanban__head"><h2 class="kanban__name" id="kb-plan">기획</h2><span class="kanban__count" aria-label="1건">1</span></header>
      <ul class="kanban__list">
        <li class="kanban__card" draggable="true">
          <div class="kanban__thumb poster poster--ink" aria-hidden="true"><span class="poster__no">50</span></div>
          <div class="kanban__main">
            <span class="kanban__code">No.50 · PR-050-A</span>
            <h3 class="kanban__title">제야 음악회</h3>
            <span class="kanban__meta">담당 진하람 · 게시 12/10</span>
            <div class="kanban__actions">
              <button class="kanban__next" type="button" data-kanban-next>다음 단계로 →</button>
              <div class="menu"><button class="iconbtn menu__trigger" type="button" aria-haspopup="menu" aria-expanded="false" aria-controls="kb-50" aria-label="No.50 단계 옮기기">…</button>
                <ul class="menu__list menu__list--end" id="kb-50" role="menu" hidden>
                  <li class="menu__label" role="presentation">단계 옮기기</li>
                  <li role="none"><button class="menu__item" role="menuitemradio" type="button" data-kanban-move="plan"><span class="menu__text">기획</span></button></li>
                  <li role="none"><button class="menu__item" role="menuitemradio" type="button" data-kanban-move="design"><span class="menu__text">디자인</span></button></li>
                  <li role="none"><button class="menu__item" role="menuitemradio" type="button" data-kanban-move="proof"><span class="menu__text">교정</span></button></li>
                  <li role="none"><button class="menu__item" role="menuitemradio" type="button" data-kanban-move="print"><span class="menu__text">인쇄</span></button></li>
                  <li role="none"><button class="menu__item" role="menuitemradio" type="button" data-kanban-move="post"><span class="menu__text">게시</span></button></li>
                </ul></div>
            </div>
          </div>
        </li>
      </ul>
    </section>
    <!-- design · proof(data-limit="2") · print · post -->
  </div>
</div>
```
단계 `plan 기획 · design 디자인 · proof 교정 · print 인쇄 · post 게시`. 카운트·빈 칸 문구·마지막 단계 버튼 비활성·이동 메뉴 체크는 app.js가 갱신. `data-limit` 초과 시 카운트 레드. 옮긴 카드는 2px 레드 룰이 그어진다. 마우스 드래그도 된다. 모바일(<768) 가로 띠는 열이 제 내용 높이만큼만 차고, app.js가 띠 높이를 지금 보이는 열에 맞춘다(짧은 열 아래 빈 꼬리 없음, 수정 3). `.kanban__actions`는 한 줄 고정(⋯ 메뉴가 아랫줄로 떨어지지 않음). 상태 `kanban__card--blocked`(보류), `aria-current="true"`. **주의:** `--blocked`는 CSS가 카드 위에 "보류" 라벨을 자동으로 붙인다(`::before`). 마크업에 "보류" 글자를 다시 쓰지 말고 meta에는 사유만 적는다(예: "곡 순서 확인 대기").

### list
```html
<ol class="list">
  <li class="list__item list__item--now"><span class="list__lead">19:30<small>10.16 금</small></span>
    <div class="list__main"><a class="list__link list__title" href="product.html">새음악 시리즈 1 「선과 면」</a><span class="list__sub">대극장 · 리게티 · 윤이상 · 하지온</span></div>
    <span class="list__end">359석<small>잔여</small></span></li>
</ol>
```
`--dense`, `--plain`(번호 없음), 행 `--now`/`aria-current="true"`(레드 점) `--past`. 링크 행은 행 전체가 눌린다. 모바일(<768)은 `번호 64px | 내용 | 끝 값` 3열 — `.list__end`(분류·수치)는 첫 줄 오른쪽에 14px로 붙는다(수정 3).

### marquee
```html
<div class="marquee" aria-label="로비 전광판">
  <div class="marquee__viewport"><div class="marquee__track">
    <ul class="marquee__group">
      <li class="marquee__item"><strong>10.16 금 19:30</strong> 새음악 시리즈 1 「선과 면」 <em>잔여 359석</em></li>
      <li class="marquee__item"><strong>10.24 토 17:00</strong> 서윤재 피아노 리사이틀 <em>매진</em></li>
    </ul>
  </div></div>
  <button class="marquee__toggle" type="button" aria-pressed="false" aria-label="전광판 멈추기">
    <svg class="icon icon-pause" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14M16 5v14"/></svg>
    <svg class="icon icon-play" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5l12 7-12 7z"/></svg></button>
</div>
```
그룹은 하나만 쓴다(app.js가 `aria-hidden` 복제). hover·focus 정지, 감속 모션이면 정적 가로 목록.

### menu
```html
<div class="menu">
  <button class="btn btn--secondary btn--sm menu__trigger" type="button" aria-haspopup="menu" aria-expanded="false" aria-controls="m-41"><span class="btn__label">더보기</span></button>
  <ul class="menu__list" id="m-41" role="menu" hidden>
    <li class="menu__label" role="presentation">공연</li>
    <li role="none"><button class="menu__item" role="menuitem" type="button" data-toast="10월 16일 일정을 캘린더에 추가했습니다."><span class="menu__text">캘린더에 추가</span><span class="menu__key">C</span></button></li>
    <li role="none"><button class="menu__item" role="menuitemradio" aria-checked="true" type="button"><span class="menu__text">공연일 순</span></button></li>
    <li role="none"><button class="menu__item" role="menuitem" aria-disabled="true" type="button"><span class="menu__text">잔여석 순(집계 중)</span></button></li>
    <li class="menu__sep" role="separator"></li>
    <li role="none"><button class="menu__item menu__item--danger" role="menuitem" type="button"><span class="menu__text">예매 취소</span></button></li>
  </ul>
</div>
```
위치 `menu__list--end`(오른쪽 맞춤) `--up`. 정적 견본 `menu__list--static`(hidden 없이) — 단독으로 두거나, 트리거(`aria-expanded="true"`)와 같은 `.menu` 안에 두면 트리거 아래 8px로 쌓인다. 키보드 ↑↓ Home End 첫 글자, Esc는 트리거로 포커스 복귀.

### modal
```html
<button class="btn btn--danger" type="button" data-open="dlg-cancel" aria-haspopup="dialog"><span class="btn__label">예매 취소</span></button>
<div class="modal modal--danger" id="dlg-cancel" data-layer hidden>
  <div class="modal__scrim" data-close></div>
  <div class="modal__panel" role="dialog" aria-modal="true" aria-labelledby="dlg-cancel-t">
    <div class="modal__rule" data-rule aria-hidden="true"></div>
    <div class="modal__head"><div><span class="modal__kicker">T2610-084315</span><h2 class="modal__title" id="dlg-cancel-t">예매를 취소할까요?</h2></div>
      <button class="iconbtn" type="button" data-close aria-label="닫기"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5l14 14M19 5L5 19"/></svg></button></div>
    <div class="modal__body"><p>공연 6일 전이라 취소 수수료 10%(₩3,600)가 붙습니다.</p>
      <dl class="modal__facts"><dt>공연</dt><dd>OS26-041 「선과 면」</dd><dt>좌석</dt><dd>1층 C구역 7열 12번</dd><dt>환불</dt><dd>₩32,400 (₩36,000 − 수수료 ₩3,600)</dd></dl></div>
    <div class="modal__foot"><button class="btn btn--danger" type="button" data-close data-toast="예매를 취소했습니다."><span class="btn__label">예매 취소</span></button>
      <button class="btn btn--secondary" type="button" data-close><span class="btn__label">유지</span></button></div>
  </div>
</div>
```
패널은 그리드 2단 시작선 · 1모듈 아래(7단 폭). `--danger`는 상단 룰이 레드. 첫 포커스를 정하려면 `data-autofocus`. 정적 견본 `modal--static`(`data-layer`·`hidden` 빼고, `id` 다르게) — 딤 면 위에 패널이 놓인 모습 그대로.

### motion
```html
<div class="motion" id="motion-demo">
  <div class="motion__spec"><p class="motion__name">rule-draw</p>
    <dl class="motion__values"><dt>대상</dt><dd>판 룰 · 블록 룰 · 진행 바</dd><dt>시간</dt><dd>480ms</dd><dt>곡선</dt><dd>cubic-bezier(.2, 0, 0, 1)</dd></dl>
    <button class="btn btn--tertiary" type="button" data-motion-replay aria-controls="motion-demo"><span class="btn__label">다시 긋기</span></button></div>
  <div class="motion__stage">
    <div class="motion__lane"><span class="motion__lane-label">판 룰 8px</span><span class="motion__bar" data-rule></span></div>
    <div class="motion__lane"><span class="motion__lane-label">블록 룰 2px</span><span class="motion__bar motion__bar--block motion__bar--accent" data-rule></span></div>
    <div class="motion__lane"><span class="motion__lane-label">감속 모션</span><span class="motion__bar motion__bar--still"></span></div>
    <div class="motion__curve gridlines"><svg viewBox="0 0 100 50" preserveAspectRatio="none" aria-hidden="true">
      <path class="motion__curve-guide" d="M0 50 L100 0"/><path class="motion__curve-path" d="M0 50 C20 50 0 0 100 0"/></svg></div>
    <div class="motion__axis"><span>0ms</span><span>240</span><span>480ms</span></div>
  </div>
</div>
```
`data-rule` 요소는 뷰포트 진입 시 그어지고(판마다 60ms 순차, 최대 6개), `data-motion-replay`가 다시 긋는다. 세로선은 `data-rule="v"`. 화면당 모션 장치 2개 상한(rule-draw + hover). 요소 이동·페이드업 금지.

### navbar
3-1 셸. 다른 곳에 nav 변형을 만들지 않는다.

### pagination
```html
<nav class="pager" aria-label="공연 목록 쪽" data-pager>
  <p class="pager__summary"><strong data-pager-now>03</strong> / 12쪽</p>
  <ul class="pager__list">
    <li><button class="iconbtn iconbtn--line pager__step" type="button" data-pager-prev aria-label="이전 쪽">←</button></li>
    <li class="pager__item--far"><button class="pager__link" type="button">01</button></li>
    <li><button class="pager__link" type="button">02</button></li>
    <li><button class="pager__link" type="button" aria-current="page">03</button></li>
    <li><button class="pager__link" type="button">04</button></li>
    <li class="pager__item--far"><span class="pager__gap">…</span></li>
    <li class="pager__item--far"><button class="pager__link" type="button">12</button></li>
    <li><button class="iconbtn iconbtn--line pager__step" type="button" data-pager-next aria-label="다음 쪽">→</button></li>
  </ul>
</nav>
```
현재 쪽 = 레드 정사각. 모바일은 `pager__item--far` 숨김 — 6쪽 이상이면 app.js가 쪽을 바꿀 때마다 첫·끝 쪽과 현재 ±1 쪽을 뺀 나머지에 `--far`를 다시 붙인다(가운데 번호가 빠지지 않음, 수정 3). 마크업의 `--far`는 첫 렌더용. 실제 이동이 필요하면 `<a class="pager__link" href="?page=4">`(app.js는 button만 다룸).

### popover
```html
<div class="pop">
  <button class="btn btn--tertiary pop__trigger" type="button" data-popover aria-expanded="false" aria-controls="pop-s"><span class="btn__label">S석 가격 안내</span></button>
  <div class="pop__panel" id="pop-s" role="dialog" aria-label="S석 가격 안내" hidden>
    <p class="pop__title">S석 · 새음악 시리즈</p>
    <dl class="pop__rows"><div><dt>정가</dt><dd>₩40,000</dd></div><div><dt>오선 회원</dt><dd>₩36,000</dd></div><div><dt>만 24세 이하</dt><dd>₩20,000</dd></div></dl>
  </div>
</div>
```
꼬리 대신 수직 지시선 + 눈금. `pop__panel--end` `--up`. 정적 견본 `.pop.pop--static` — 패널만 두거나, 트리거(`aria-expanded="true"`) 바로 뒤에 패널을 두면 지시선 길이만큼 띄워 트리거 글자를 긋지 않는다. 바깥 클릭·Esc로 닫힘, 안쪽 `[data-pop-close]`.

### progress (+ 불릿 차트)
```html
<div class="progress">
  <div class="progress__head"><span class="progress__label" id="p41">OS26-041 판매율</span><span class="progress__value">75.8<small>%</small></span></div>
  <div class="progress__track" role="progressbar" aria-labelledby="p41" aria-valuenow="75.8" aria-valuemin="0" aria-valuemax="100" style="--val:75.8%;--target:85%">
    <span class="progress__bar" data-rule></span><span class="progress__target"><span>목표 85%</span></span></div>
  <p class="progress__note">1,127 / 1,486석 · 잔여 359석</p>
</div>

<div class="bullets">
  <div class="bullet bullet--hit" style="--val:87.6%;--target:85%"><span class="bullet__label">OS26-043<small>베토벤 4·7</small></span>
    <span class="bullet__track"><span class="bullet__bar" data-rule></span><span class="bullet__target"></span></span><span class="bullet__value">87.6%</span></div>
</div>
<div class="bullets__legend"><span><i class="bullets__key"></i>판매</span><span><i class="bullets__key bullets__key--target"></i>목표 85%</span><span><i class="bullets__key bullets__key--range"></i>60% 미만</span></div>
```
progress 변형 `--lg`(96px 숫자) `--sm` `--done`(레드 바) `--error` `--paused` `--indeterminate`(4칸 계단 이동). 목표 마커가 없으면 `progress__target` 생략. 불릿 `--hit`(목표 달성 레드 점), 범위 경계 `--range-1`(기본 60%).

### sidebar
3-4 셸. `.side__link` 상태: `aria-current="page"|"true"`(레드 정사각 + 700) · hover 레드 글자 · `aria-disabled="true"` · `--danger`. 오른쪽 `.side__count` 또는 `.sq`.

### skeleton
```html
<div class="skel" aria-busy="true" aria-live="polite">
  <span class="skel__status"><span class="spinner spinner--sm" aria-hidden="true"></span>불러오는 중</span>
  <span class="skel__block skel__block--title"></span>
  <span class="skel__block skel__block--line"></span>
  <span class="skel__block skel__block--line skel__block--short"></span>
  <span class="skel__block skel__block--num"></span>
</div>
<div class="skel skel--card" aria-busy="true"><span class="skel__block skel__block--poster"></span><span class="skel__block skel__block--line"></span></div>
```
블록 `--title --line --short --num --poster --sq`, 크기 직접 `style="--w:40%;--h:48px"`. 표 행 자리 `.skel__row`(2/7/3). 반짝임 없음.

### spinner
```html
<span class="spinner" role="status" aria-label="불러오는 중"></span>          <!-- 24px. --sm 16 · --lg 48 -->
<span class="spinner-wrap"><span class="spinner" aria-hidden="true"></span><span class="spinner-wrap__text" role="status">좌석 배치도를 불러오는 중</span></span>
<div class="spinner-block">…</div>                                           <!-- 판 단위 로딩 -->
```
원형 금지. 감속 모션이면 정지(문장은 그대로).

### steps
```html
<ol class="steps" aria-label="회원 가입 단계">
  <li class="steps__item steps__item--done"><button class="steps__link" type="button" data-step-go="0"><span class="steps__num">1</span><span class="steps__label">관심 시리즈</span></button></li>
  <li class="steps__item" aria-current="step"><span class="steps__num">2</span><span class="steps__label">선호 좌석</span><span class="steps__desc">대극장 단면에서 구역 선택</span></li>
  <li class="steps__item"><span class="steps__num">3</span><span class="steps__label">알림</span></li>
</ol>
```
현재 = 상단 8px 레드 룰 + 잉크 숫자, 완료 = 체크 정사각, 예정 = 흐린 숫자, 오류 `steps__item--error`. `.steps--sm`(48px 숫자). 3단계 칸 리듬 5/4/3(현재 칸이 5)은 768 이상에서만 — 모바일은 균등 칸(완료 단계 이름이 두 줄로 꺾이지 않게, 수정 3).
**단계 마법사**: 감싸는 요소에 `data-stepper`, 패널마다 `data-step-panel`(현재 것 외 `hidden`), 버튼 `data-step-next`(패널 안 required 검사 후 진행) · `data-step-prev` · `data-step-go="0"`. app.js가 `aria-current`·`--done`을 갱신하고 새 패널 제목으로 포커스, `stepper:change` 이벤트.

### table
```html
<div class="table-shell"><div class="table-wrap">
  <table class="table table--hover table--stack">
    <caption class="table__caption">다가오는 공연 <small>10월 10일(토) 18:00 기준</small></caption>
    <thead><tr>
      <th scope="col" class="sel"><label class="check"><input class="check__input" type="checkbox" data-select-all aria-label="모두 선택"><span class="check__box" aria-hidden="true"></span></label></th>
      <th scope="col" aria-sort="ascending"><button class="table__sort" type="button">공연</button></th>
      <th scope="col">제목</th>
      <th scope="col" class="num" aria-sort="none"><button class="table__sort" type="button">판매율</button></th>
      <th scope="col">상태</th></tr></thead>
    <tbody>
      <tr class="is-now">
        <td class="sel" data-label="선택"><label class="check"><input class="check__input" type="checkbox" data-select-row aria-label="OS26-041 선택"><span class="check__box" aria-hidden="true"></span></label></td>
        <td class="code-col" data-label="공연">OS26-041</td>
        <td data-label="제목">새음악 시리즈 1 「선과 면」<span class="table__sub">대극장 · 류세인</span></td>
        <td class="num" data-label="판매율">75.8%</td>
        <td data-label="상태"><span class="badge badge--success">판매 중</span></td></tr>
    </tbody>
    <tfoot><tr><th scope="row" colspan="3">41주차 합계</th><td class="num">1,388매</td><td></td></tr></tfoot>
  </table>
</div></div>
```
- 숫자 열 `.num`(오른쪽 정렬, 정렬 시 숫자 비교·값 없는 행은 아래). 정렬 값을 따로 주려면 `<td data-sort="20261016">`.
- 행 상태 `aria-selected="true"`(왼쪽 레드 4px) · `.is-now`(레드 점 — 첫 칸이 `.sel` 체크박스면 다음 칸 여백에 내어 걸어 코드 열 정렬 유지) · `.is-past`(흐림). `--hover` `--dense`. 최소 폭 640px(`--table-min`으로 조정) — 넘치면 `.table-shell`에 오른쪽 페이드.
- `--stack`: 모바일에서 행마다 2열 정의 블록 → **모든 td에 `data-label` 필수**. 열이 적은 비교 표(pricing · settings)에만 쓴다. 라벨 규칙은 tbody에만 걸린다(tfoot은 한 줄 flex, 셀 들여쓰기·고정 높이 없음 — 장면의 강조 열 규칙이 tfoot까지 번지지 않게 명시도 (0,3,2)로 막는다, 수정 3).
- 표 안 링크(`a:not([class])`)는 패딩 없이 밑줄을 글자에 붙이고, 누르는 높이는 `::before`(위아래 12px)로 넓힌다. a에 padding을 주면 배경 밑줄이 패딩 바닥으로 내려가 아래 부제를 긋는다(수정 3).
- `--lines`: 목록형 표(매표 일지 · 다가오는 공연)의 모바일 2줄 압축(행 약 88px). 셀마다 `data-cell` — `key`(공연 코드) · `when`(날짜·시각) · `end`(판매율, 1줄 오른쪽) · `title`(2줄) · `state`(배지, 2줄 오른쪽) · `meta`(홀, 3줄 작게) · `count`(판매/좌석, 3줄 오른쪽). 선택 체크박스 `.sel`은 1줄 왼쪽. `.is-now` 레드 점은 코드 앞에 붙는다.

### tabs
```html
<div class="tabs">
  <div class="tabs__bar">
    <div class="tabs__list" role="tablist" aria-label="공연 정보">
      <button class="tabs__tab" role="tab" type="button" id="t-notes" aria-selected="true" aria-controls="p-notes">곡 해설</button>
      <button class="tabs__tab" role="tab" type="button" id="t-cast" aria-selected="false" aria-controls="p-cast">출연자 <span class="tabs__count">3</span></button>
      <button class="tabs__tab" role="tab" type="button" id="t-visit" aria-selected="false" aria-controls="p-visit">관람 안내</button>
    </div>
  </div>
  <div class="tabs__panel" id="p-notes">…</div>
  <div class="tabs__panel" id="p-cast" hidden>…</div>
  <div class="tabs__panel" id="p-visit" hidden>…</div>
</div>
```
2px 레드 밑줄 하나가 이동한다(app.js가 `.tabs__ink` 생성). ← → Home End, 비활성 `aria-disabled="true"`. `--lg`(판 머리용 24px). 모바일에서 넘치면 오른쪽 페이드. 카운트는 `.tabs__count` 또는 `.sq`.

### timeline
```html
<ol class="tl">
  <li class="tl__item tl__item--done"><p class="tl__when">09.29<small>화</small></p>
    <div class="tl__body"><h3 class="tl__title">PR-041-C 3교 교정 회신</h3><p class="tl__meta">문태석 · 레드 85% 망점 확인</p></div></li>
  <li class="tl__item tl__item--now" aria-current="step"><p class="tl__when">10.10<small>토 · 오늘</small></p>
    <div class="tl__body"><h3 class="tl__title">로비 기둥 게시</h3><p class="tl__meta">백승민 · 청계천 쪽 외벽 게시대</p>
      <div class="tl__tags"><span class="badge badge--success">게시 완료</span></div></div></li>
  <li class="tl__item tl__item--future"><p class="tl__when">10.16<small>금 19:30</small></p>
    <div class="tl__body"><h3 class="tl__title">공연 당일</h3><p class="tl__text">하우스 오픈 18:30</p></div></li>
</ol>
```
`--dense`. 현재 = 레드 정사각 + 레드 날짜, 완료 = 잉크 정사각, 예정 = 테두리 + 점선 축.

### toast
```html
<!-- 동작: 버튼에 data-toast="문장" data-toast-text="보조 문장" data-toast-tone="success|info" data-toast-action="실행 취소" -->
<button class="btn btn--primary" type="button" data-toast="좌석을 담았습니다." data-toast-text="1층 C구역 7열 12번 · ₩40,000" data-toast-action="실행 취소">…</button>
<!-- 스크립트: Oseon.toast({ title, text, tone, action, onAction, duration }) -->

<!-- 정적 견본 -->
<div class="toaster toaster--static"><div class="toast"><span class="toast__mark" aria-hidden="true"></span>
  <div class="toast__body"><p class="toast__title">좌석을 담았습니다.</p><p class="toast__text">1층 C구역 7열 12번 · ₩40,000</p></div>
  <div class="toast__actions"><button class="toast__action" type="button">실행 취소</button></div></div></div>
```
왼쪽 아래 여백선, 4단 폭, `role="status" aria-live="polite"`(자동 생성), 5초 뒤 사라짐(hover·focus 중 정지), 최대 3개. 톤 `--success`(체크 테두리 정사각) `--info`(테두리 정사각), 기본 = 레드 정사각.

### tooltip
```html
<span class="tip">
  <button class="iconbtn iconbtn--line" type="button" aria-describedby="tip-fee" aria-label="수수료 안내">…</button>
  <span class="tip__bubble" role="tooltip" id="tip-fee">예매 수수료는 없습니다.</span>
</span>
<span class="tip__bubble tip__bubble--static">예매 수수료는 없습니다.</span>   <!-- 정적 견본: 단독이면 위 지시선, .tip 바로 뒤에 두면 왼쪽 지시선 -->
```
hover 300ms 뒤 / focus 즉시, Esc로 숨김, 화면 오른쪽에 닿으면 자동 `--end`. `--up` 위치. 긴 설명은 popover로.

---

## 5. 열린 상태 견본 규칙 (index P7 등)

오버레이는 글로 설명하지 않는다. **정적 견본 + 실제 트리거 둘 다** 둔다.
| 컴포넌트 | 정적 견본 | 실제 |
|---|---|---|
| modal | `.modal.modal--static` | `[data-open="dlg-…"]` + `.modal[data-layer][hidden]` |
| drawer | `.drawer.drawer--static` | `[data-open]` + `.drawer[data-layer][hidden]` |
| command | `.cmd.cmd--static` (`value="골드"`) | 셸의 `#command`, 버튼은 `data-open="command"` |
| menu | `.menu__list.menu__list--static` | `.menu__trigger` |
| popover | `.pop.pop--static` | `[data-popover]` |
| tooltip | `.tip__bubble--static` | `.tip` |
| toast | `.toaster--static` | `[data-toast]` |

정적 견본 안의 `id`는 실제 레이어와 겹치지 않게 다른 값을 쓴다.

---

## 6. app.js 계약 요약

| 속성 / API | 동작 |
|---|---|
| `[data-theme-toggle]` | 낮/밤 전환, `oseon-theme` 저장, `aria-pressed`. `?theme=`가 최우선 |
| `[data-grid-toggle]`, `g` 키 | 전체 12단 오버레이(`html.grid-on`) |
| `[data-open="id"]` → `[data-layer]` | 모달·드로어·커맨드·사이드 드로어 열기. 포커스 트랩, Esc, 딤(`data-close`) 클릭, 포커스 복귀, 스크롤 잠금. 사이드는 `data-layer="side"` |
| `[data-close]` | 가장 가까운 레이어 닫기 |
| ⌘K / Ctrl+K | `.cmd[data-layer]` 열기·닫기. 입력 필터(`data-keywords` 포함), ↑↓ Enter, `data-href`로 이동 |
| `.tabs` | 탭 선택·키보드·잉크선 |
| `.acc__trigger`, `.acc[data-single]` | 아코디언 |
| `[data-toast]`, `Oseon.toast()` | 토스트 |
| `[data-popover]` · `.menu__trigger` · `.tip` | 팝오버 · 메뉴 · 툴팁 |
| `[data-carousel]`(+`data-start`) | 캐러셀 |
| `.marquee` | 복제 + 일시정지 |
| `[data-rule]` · `.plate--grid` · `[data-motion-replay]` | 선 긋기 · 그리드 켜기 · 다시 긋기 |
| `form[data-validate]` · `.qty` · `[data-busy-demo]` | 검증 · 수량 · 로딩 시연 |
| `[data-calendar]`(+`data-output`) | 날짜 선택(`calendar:select`) |
| `[data-kanban]` · `[data-kanban-next]` · `[data-kanban-move]` | 칸반 이동·카운트 |
| `.table__sort` · `[data-select-all]` · `[data-select-row]` | 표 정렬 · 행 선택 |
| `[data-nav-toggle]` | 모바일 판 메뉴 |
| `[data-stepper]` · `[data-step-panel]` · `[data-step-next|prev|go]` | 단계 마법사 |
| `[data-views]` + `[data-view-set="read"]`(+`aria-controls`) | 컨테이너 `data-view` 전환(inbox 모바일: 목록 → 읽기 → 뒤로 `data-view-set="list"`). `[data-view-focus="read"]`로 포커스 |
| `[data-copy]` | 코드 복사 |
| `[data-pager]` | button 페이지네이션(`pager:change`) |
| `[data-dismiss]` | 알림 닫기 |

장면 전용 상태 전환이 더 필요하면 `data-view` 패턴(장면 CSS에서 `[data-view="read"] .inbox__list { display:none }`)으로 해결한다. 페이지별 인라인 스크립트·onclick 금지.

---

## 7. 반응형·접근성 체크

- 360/390에서 가로 넘침 0: 크롭 숫자는 반드시 `.plate`/`.crop` 안. 넓은 표는 `.table-wrap` 또는 `--stack`. 칸반은 `.kanban-wrap`.
- 터치 타깃 44px: `.iconbtn`, 탭, 날짜 칸, 사이드 링크, 페이지네이션, 푸터 링크(모바일) 모두 충족. 새 버튼은 `.btn`/`.iconbtn`만 쓴다.
- 아이콘 버튼 `aria-label` 필수. 크롭 숫자·포스터 장식은 `aria-hidden="true"` + 같은 정보의 텍스트.
- 다크 = 밤 장면: 잉크 판은 #000 + 1px 프레임, 레드 면은 그대로, 종이 포스터는 밝은 조명 박스로 남는다. 장면 CSS에서 다크용 색을 따로 만들지 말고 토큰만 쓴다.
- `prefers-reduced-motion`: 선은 그려진 상태, 마퀴·스피너 정지, 탭 밑줄 즉시 이동(motion.css가 처리).

## 8. 쓰지 말 것

eyebrow + 거대 헤드라인 + CTA 2개 + 칩 첫 화면, 가운데 정렬 섹션 헤더, "§ 번호 + 제목" 반복, 판권 정의 목록 블록, 왼쪽 고정 목차 사이드바(index), 컴포넌트를 박스에 하나씩 담은 갤러리, 색 스와치 띠, 둥근 모서리·그림자·blur·그라데이션 면, 원형 스피너, 이모지, 디자인 시스템 자기소개 카피, 영문 견본 단어, `href="#"`.

## 9. 아이콘 path (24 viewBox, stroke)

| 이름 | d |
|---|---|
| 오른쪽 화살표 | `M4 12h15M13 6l6 6-6 6` |
| 왼쪽 화살표 | `M20 12H5M11 6l-6 6 6 6` |
| 아래 꺾쇠 | `M6 9l6 6 6-6` |
| 닫기 | `M5 5l14 14M19 5L5 19` |
| 검색 | `M10.5 17a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13zM15.5 15.5L20 20` |
| 그리드 | `M4 4h16v16H4zM9.3 4v16M14.7 4v16M4 12h16` |
| 테마(반 빗금 정사각) | `M4 4h16v16H4zM12 4v16M12 8h8M12 12h8M12 16h8` |
| 메뉴 | `M3 7h18M3 12h18M3 17h18` |
| 더보기(정사각 3) | `M5 11h2v2H5zM11 11h2v2h-2zM17 11h2v2h-2z` |
| 더하기 / 빼기 | `M5 12h14M12 5v14` / `M5 12h14` |
| 일시정지 / 재생 | `M8 5v14M16 5v14` / `M7 5l12 7-12 7z` |
| 복사 | `M8 8h12v12H8zM4 16V4h12` |
| 안내(i) | `M4 4h16v16H4zM12 11v6M12 7v1` |
| 체크 | `M5 12l5 5 9-10` |
| 좌석 | `M6 4h12v10H6zM4 14h16v4H4zM6 18v2M18 18v2` |
| 달력 | `M4 6h16v14H4zM4 10h16M8 3v4M16 3v4` |
| 편지 | `M3 6h18v12H3zM3 6l9 7 9-7` |
