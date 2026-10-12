# COMPONENTS — 되감기홈쇼핑 REWIND 99 v2 마크업 계약

index.html · pages/*.html 담당은 **이 문서만 보고** 마크업한다. 디자인 근거와 세계관 값(날짜·인물·상품·금액)은 `DIRECTION.md` 팩트 시트만 쓴다.
클래스는 BEM(`블록__요소--변형`). 상태는 가능하면 ARIA 속성(`aria-selected`, `aria-current`, `aria-expanded`, `aria-pressed`, `aria-busy`, `aria-invalid`, `disabled`)으로 표시한다. CSS가 그 속성을 읽는다.

이 테마의 모든 화면은 **바탕화면(.desk) 위의 창(.win)** 이다. 둥근 카드·섹션 헤더(라벨→제목→부제)·고정 max-width 컨테이너를 만들지 않는다. 장면 이름은 **창 타이틀 바**가 대신한다.

---

## 0. 페이지 뼈대 (모든 HTML 공통)

```html
<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>주조정실 — 되감기홈쇼핑 CH.99</title>
<script>(function(){try{var q=new URLSearchParams(location.search).get('theme');var s=localStorage.getItem('rewind99-theme');var t=(q==='dark'||q==='light')?q:(s==='dark'||s==='light')?s:(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.setAttribute('data-theme',t);}catch(e){}})();</script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Black+Han+Sans&family=DotGothic16&family=Nanum+Gothic:wght@400;700;800&family=Nanum+Gothic+Coding:wght@400;700&family=VT323&display=swap">
<link rel="stylesheet" href="../styles.css">        <!-- index: styles.css -->
<link rel="stylesheet" href="dashboard.css">        <!-- 장면 전용 1개 (index: index.css) -->
</head>
<body>
<a class="skip" href="#main">본문으로 건너뛰기</a>
<main id="main" class="desk desk--screen desk--floor">…</main>   <!-- 1절 셸 -->
<nav class="taskbar" aria-label="작업 표시줄">…</nav>             <!-- 1절 셸, body 직속 -->
<!-- 오버레이(실행 대화상자·모달·드로어)는 body 끝에 -->
<script src="../app.js"></script>                    <!-- index: app.js -->
</body>
</html>
```

- `localStorage` 키 `rewind99-theme`. `?theme=dark|light`가 최우선. 라이트 = "오후 재방송", 다크 = "새벽 생방송".
- 화면 기준 시각 **2026-10-10(토) 01:12:07 KST**, 방송 `EP.1287` 진행 중, 방송 중 상품은 항상 `RW-CS-0091 RW-99 워크스테레오`. 숫자는 팩트 시트에서만 가져온다.
- 장면 CSS(`index.css`, `pages/*.css`)도 **semantic 토큰만**(2절). raw hex 금지, 인라인 `grid-template-columns` 금지. `style="--val:62%"`, `style="--kanban-cols:4"`, `style="--cols:…"` 같은 커스텀 속성 주입은 허용.
- 서체: 한글 대제목 `Black Han Sans`(.t-3xl/.t-2xl/.crt__name), 창 제목·메뉴·아이콘 라벨 `DotGothic16`(자동), 본문 `Nanum Gothic`, OSD 숫자 `VT323`(.t-osd — **숫자·라틴 전용, 한글 넣지 말 것**), 코드 `Nanum Gothic Coding`.
- 자간: 넓은 자간은 `.t-latin`·`.t-osd`·`.osd-tag--latin`(라틴/숫자)만. 한글 라벨에 letter-spacing 금지.
- 아이콘은 **픽셀 마스크 아이콘** `.ico .ico--이름`(16px, `.ico--32`로 32px). 색은 `currentColor`. 아이콘만 있는 버튼엔 `aria-label`, 아이콘 span엔 `aria-hidden="true"`. 이모지 금지.
  사용 가능한 이름: `folder file tv chart cassette cart chat mail help info warn error check hourglass search gear calendar user trash play pause disk run live close min max arrow-down arrow-up arrow-right lp copy`
  색 보조: `.ico--folder-c`(폴더 노랑/황토), `.ico--doc-c`(문서 청록).
- SVG 직접 그릴 때 presentation attribute에 `var()` 금지 → 소품은 class(`.pa`~`.pf`, `.ps`)로 색을 받는다(1-6 참고).

---

## 1. 공통 셸 — 그대로 복사해서 쓴다 (모든 화면 같은 한 벌)

> 경로 규칙: **index는 `pages/xxx.html`**, **pages 안에서는 `xxx.html`과 `../index.html`**. 아래 두 벌 중 맞는 것을 복사하고, 현재 페이지에만 `aria-current="page"`를 단다. 항목 순서·문구·아이콘을 바꾸지 않는다.

### 1-1. 작업 표시줄 (navbar) — `<body>` 직속, `</main>` 바로 뒤

**index.html 용**

```html
<nav class="taskbar" aria-label="작업 표시줄">
  <div class="menu-anchor">
    <button class="taskbar__start" type="button" data-menu-trigger aria-controls="start-menu" aria-expanded="false" aria-haspopup="menu"><span class="taskbar__logo" aria-hidden="true"></span><span class="taskbar__start-label">시작</span></button>
    <div class="menu startmenu" id="start-menu" role="menu" aria-label="시작 메뉴" hidden>
      <div class="startmenu__banner" aria-hidden="true"><span>REWIND 99 <small>リワインド</small></span></div>
      <ul class="startmenu__list" role="none">
        <li role="none"><a class="menu__item" role="menuitem" href="index.html" aria-current="page"><span class="ico ico--tv" aria-hidden="true"></span><span>되감기 OS 99</span></a></li>
        <li role="none" class="menu__sep"></li>
        <li role="none"><a class="menu__item" role="menuitem" href="pages/dashboard.html"><span class="ico ico--chart" aria-hidden="true"></span><span>주조정실</span></a></li>
        <li role="none"><a class="menu__item" role="menuitem" href="pages/product.html"><span class="ico ico--cassette" aria-hidden="true"></span><span>RW-99 상품 정보</span></a></li>
        <li role="none"><a class="menu__item" role="menuitem" href="pages/pricing.html"><span class="ico ico--lp" aria-hidden="true"></span><span>되감기 클럽 멤버십</span></a></li>
        <li role="none"><a class="menu__item" role="menuitem" href="pages/kanban.html"><span class="ico ico--folder" aria-hidden="true"></span><span>다음 주 편성 회의</span></a></li>
        <li role="none"><a class="menu__item" role="menuitem" href="pages/inbox.html"><span class="ico ico--mail" aria-hidden="true"></span><span>되감기 메일</span></a></li>
        <li role="none"><a class="menu__item" role="menuitem" href="pages/profile.html"><span class="ico ico--user" aria-hidden="true"></span><span>내 컴퓨터</span></a></li>
        <li role="none"><a class="menu__item" role="menuitem" href="pages/onboarding.html"><span class="ico ico--disk" aria-hidden="true"></span><span>회원 옮기기 마법사</span></a></li>
        <li role="none"><a class="menu__item" role="menuitem" href="pages/settings.html"><span class="ico ico--gear" aria-hidden="true"></span><span>제어판</span></a></li>
        <li role="none" class="menu__sep"></li>
        <li role="none"><a class="menu__item" role="menuitem" href="pages/404.html"><span class="ico ico--error" aria-hidden="true"></span><span>방송 사고</span></a></li>
      </ul>
    </div>
  </div>
  <span class="taskbar__sep" aria-hidden="true"></span>
  <ul class="taskbar__tasks">
    <li><a class="taskbar__task" href="index.html" aria-current="page"><span class="ico ico--tv" aria-hidden="true"></span><span class="taskbar__task-label">CH.99 <span class="night-only">생방송</span><span class="day-only">재방송</span></span></a></li>
    <li><a class="taskbar__task" href="pages/dashboard.html"><span class="ico ico--chart" aria-hidden="true"></span><span class="taskbar__task-label">주조정실</span></a></li>
    <li><a class="taskbar__task" href="pages/inbox.html"><span class="ico ico--mail" aria-hidden="true"></span><span class="taskbar__task-label">되감기 메일</span><span class="count-badge" aria-hidden="true">14</span><span class="sr-only">안 읽은 메일 14통</span></a></li>
  </ul>
  <div class="taskbar__tray">
    <span class="taskbar__live"><span class="live-dot" aria-hidden="true"></span><span class="taskbar__live-num" data-live="4812" data-live-step="9">4,812</span><span class="sr-only">명 시청 중 (01:12:07 기준)</span></span>
    <button class="taskbar__icon-btn" type="button" data-command-open aria-label="실행 (⌘K)"><span class="ico ico--search" aria-hidden="true"></span></button>
    <button class="taskbar__icon-btn" type="button" data-theme-toggle aria-label="새벽 생방송 화면"><span class="ico ico--tv" aria-hidden="true"></span></button>
    <time class="taskbar__clock" datetime="2026-10-10T01:12">01:12</time>
  </div>
</nav>
```

**pages/*.html 용** — 위와 같고 링크만 다르다. 시작 메뉴와 작업 버튼 3개는 고정, **현재 페이지가 작업 버튼 3개에 없으면 4번째 `<li>`로 현재 페이지 버튼을 추가**(aria-current).

```html
<nav class="taskbar" aria-label="작업 표시줄">
  <div class="menu-anchor">
    <button class="taskbar__start" type="button" data-menu-trigger aria-controls="start-menu" aria-expanded="false" aria-haspopup="menu"><span class="taskbar__logo" aria-hidden="true"></span><span class="taskbar__start-label">시작</span></button>
    <div class="menu startmenu" id="start-menu" role="menu" aria-label="시작 메뉴" hidden>
      <div class="startmenu__banner" aria-hidden="true"><span>REWIND 99 <small>リワインド</small></span></div>
      <ul class="startmenu__list" role="none">
        <li role="none"><a class="menu__item" role="menuitem" href="../index.html"><span class="ico ico--tv" aria-hidden="true"></span><span>되감기 OS 99</span></a></li>
        <li role="none" class="menu__sep"></li>
        <li role="none"><a class="menu__item" role="menuitem" href="dashboard.html"><span class="ico ico--chart" aria-hidden="true"></span><span>주조정실</span></a></li>
        <li role="none"><a class="menu__item" role="menuitem" href="product.html"><span class="ico ico--cassette" aria-hidden="true"></span><span>RW-99 상품 정보</span></a></li>
        <li role="none"><a class="menu__item" role="menuitem" href="pricing.html"><span class="ico ico--lp" aria-hidden="true"></span><span>되감기 클럽 멤버십</span></a></li>
        <li role="none"><a class="menu__item" role="menuitem" href="kanban.html"><span class="ico ico--folder" aria-hidden="true"></span><span>다음 주 편성 회의</span></a></li>
        <li role="none"><a class="menu__item" role="menuitem" href="inbox.html"><span class="ico ico--mail" aria-hidden="true"></span><span>되감기 메일</span></a></li>
        <li role="none"><a class="menu__item" role="menuitem" href="profile.html"><span class="ico ico--user" aria-hidden="true"></span><span>내 컴퓨터</span></a></li>
        <li role="none"><a class="menu__item" role="menuitem" href="onboarding.html"><span class="ico ico--disk" aria-hidden="true"></span><span>회원 옮기기 마법사</span></a></li>
        <li role="none"><a class="menu__item" role="menuitem" href="settings.html"><span class="ico ico--gear" aria-hidden="true"></span><span>제어판</span></a></li>
        <li role="none" class="menu__sep"></li>
        <li role="none"><a class="menu__item" role="menuitem" href="404.html"><span class="ico ico--error" aria-hidden="true"></span><span>방송 사고</span></a></li>
      </ul>
    </div>
  </div>
  <span class="taskbar__sep" aria-hidden="true"></span>
  <ul class="taskbar__tasks">
    <li><a class="taskbar__task" href="../index.html"><span class="ico ico--tv" aria-hidden="true"></span><span class="taskbar__task-label">CH.99 생방송</span></a></li>
    <li><a class="taskbar__task" href="dashboard.html"><span class="ico ico--chart" aria-hidden="true"></span><span class="taskbar__task-label">주조정실</span></a></li>
    <li><a class="taskbar__task" href="inbox.html"><span class="ico ico--mail" aria-hidden="true"></span><span class="taskbar__task-label">되감기 메일</span><span class="count-badge" aria-hidden="true">14</span><span class="sr-only">안 읽은 메일 14통</span></a></li>
    <!-- 현재 페이지가 위 3개에 없으면: <li><a class="taskbar__task" href="settings.html" aria-current="page"><span class="ico ico--gear" aria-hidden="true"></span><span class="taskbar__task-label">제어판</span></a></li> -->
  </ul>
  <div class="taskbar__tray">
    <span class="taskbar__live"><span class="live-dot" aria-hidden="true"></span><span class="taskbar__live-num" data-live="4812" data-live-step="9">4,812</span><span class="sr-only">명 시청 중 (01:12:07 기준)</span></span>
    <button class="taskbar__icon-btn" type="button" data-command-open aria-label="실행 (⌘K)"><span class="ico ico--search" aria-hidden="true"></span></button>
    <button class="taskbar__icon-btn" type="button" data-theme-toggle aria-label="새벽 생방송 화면"><span class="ico ico--tv" aria-hidden="true"></span></button>
    <time class="taskbar__clock" datetime="2026-10-10T01:12">01:12</time>
  </div>
</nav>
```

페이지별 표기(창 타이틀·아이콘·시작 메뉴 이름) 정본:

| 파일 | 시작 메뉴 이름 | 앱 창 타이틀(`.win__title`) | 아이콘 |
|---|---|---|---|
| index.html | 되감기 OS 99 | (장면별 여러 창) | `tv` |
| dashboard | 주조정실 | 주조정실 — EP.1287 생방송 모니터 | `chart` |
| product | RW-99 상품 정보 | RW-99 워크스테레오 — 상품 정보 | `cassette` |
| pricing | 되감기 클럽 멤버십 | 되감기 클럽 멤버십 — 지금 이 가격 | `lp` |
| kanban | 다음 주 편성 회의 | 다음 주 편성 회의 — 41~42주차 | `folder` |
| inbox | 되감기 메일 | 되감기 메일 — 받은 편지함 (14) | `mail` |
| profile | 내 컴퓨터 | 내 컴퓨터 — 시청자 등록 정보 | `user` |
| onboarding | 회원 옮기기 마법사 | 되감기 회원 옮기기 마법사 | `disk` |
| settings | 제어판 | 제어판 | `gear` |
| 404 | 방송 사고 | 방송 사고 | `error` |

### 1-2. 앱 창 셸 + 푸터 (pages 공통) — `<main>` 내용

pages는 **최대화된 앱 창 1개**(+장면에 따라 겹친 보조 창). 앱 창 맨 아래 **상태 표시줄이 곧 푸터**다. 푸터 문구는 아래 한 줄만 쓴다(바꾸지 말 것).

```html
<main id="main" class="desk desk--screen desk--floor maximized">
  <section class="win" aria-labelledby="app-title">
    <header class="win__bar">
      <span class="ico ico--chart win__icon" aria-hidden="true"></span>
      <h1 class="win__title" id="app-title">주조정실 — EP.1287 생방송 모니터</h1>
      <div class="win__ctrls">
        <button class="win__ctrl win__ctrl--min" type="button" aria-label="말아 올리기"></button>
        <button class="win__ctrl win__ctrl--max" type="button" aria-label="최대화"></button>
        <button class="win__ctrl win__ctrl--close" type="button" aria-label="닫기"></button>
      </div>
    </header>
    <ul class="menubar" aria-label="주조정실 메뉴">
      <li class="menu-anchor"><button class="menubar__item" type="button" data-menu-trigger aria-controls="mb-file" aria-expanded="false" aria-haspopup="menu">파일(<u>F</u>)</button>
        <div class="menu" id="mb-file" role="menu" hidden>
          <a class="menu__item" role="menuitem" href="../index.html"><span class="ico ico--tv" aria-hidden="true"></span><span>바탕화면으로</span><span class="menu__key">Esc</span></a>
          <button class="menu__item" role="menuitem" type="button" data-command-open><span class="ico ico--run" aria-hidden="true"></span><span>실행…</span><span class="menu__key">⌘K</span></button>
        </div>
      </li>
      <li><button class="menubar__item" type="button">편집(<u>E</u>)</button></li>
      <li><button class="menubar__item" type="button">보기(<u>V</u>)</button></li>
      <li><button class="menubar__item" type="button">도움말(<u>H</u>)</button></li>
    </ul>
    <div class="win__body">
      <!-- 장면 내용 -->
    </div>
    <footer class="statusbar">
      <span class="statusbar__cell statusbar__cell--grow">© 1995–2026 REWIND 99 · ㈜되감기미디어 · 사업자 990-81-01995 · 고객센터 1599-0099</span>
      <span class="statusbar__cell">10월 10일(토) 01:12:07 기준</span>
    </footer>
  </section>
</main>
```

- 메뉴 막대 첫 항목 `파일(F)`의 드롭다운 두 줄(바탕화면으로/실행…)은 모든 페이지 공통. 나머지 메뉴(편집·보기·도움말)는 장면에 맞게 드롭다운을 달아도 되고 버튼만 둬도 된다.
- 오른쪽 상태 칸은 장면 정보로 바꿔도 된다(예: inbox `14통 · 안 읽음 3`), **왼쪽 저작권 칸은 고정**.
- 모바일(≤768): `.maximized`가 여백 8px로 줄고 창은 전폭, 메뉴 막대는 가로 스크롤 + 오른쪽 페이드.

**index.html 푸터**(S9 종료 화면 아래) — 같은 상태 표시줄을 종료 화면 맨 아래에 단독으로 둔다:

```html
<footer class="statusbar">
  <span class="statusbar__cell statusbar__cell--grow">© 1995–2026 REWIND 99 · ㈜되감기미디어 · 사업자 990-81-01995 · 고객센터 1599-0099</span>
  <span class="statusbar__cell">서울특별시 용산구 청파로 99, 지하 1층 B스튜디오</span>
</footer>
```

### 1-3. 사이드바 셸 — 탐색기 폴더 트리 (앱 창 **내부** 전용)

index에서는 페이지 레벨 고정 사이드바를 쓰지 않는다. inbox·settings·profile처럼 2단이 필요한 앱 창 안에서만 `.split`로 쓴다.

```html
<div class="win__body win__body--flush split">
  <nav class="tree" aria-label="폴더">
    <ul class="tree__list">
      <li class="tree__node">
        <div class="tree__row">
          <button class="tree__toggle" type="button" aria-expanded="true" aria-controls="tree-mail" aria-label="되감기 메일 접기"></button>
          <a class="tree__link" href="inbox.html"><span class="ico ico--mail" aria-hidden="true"></span><span class="tree__text">되감기 메일</span></a>
        </div>
        <ul class="tree__list" id="tree-mail">
          <li class="tree__node"><div class="tree__row"><a class="tree__link" href="inbox.html" aria-current="page"><span class="ico ico--folder" aria-hidden="true"></span><span class="tree__text">받은 편지함</span> <span class="tree__count">14</span></a></div></li>
          <li class="tree__node"><div class="tree__row"><a class="tree__link" href="inbox.html"><span class="ico ico--folder" aria-hidden="true"></span><span class="tree__text">반품 문의</span> <span class="tree__count">3</span></a></div></li>
          <li class="tree__node"><div class="tree__row"><a class="tree__link" href="inbox.html"><span class="ico ico--folder" aria-hidden="true"></span><span class="tree__text">검수 리포트</span></a></div></li>
        </ul>
      </li>
    </ul>
  </nav>
  <div class="split__main">…</div>
</div>
```

**index.html 용**(S7 `다음주 편성.폴더` 같은 탐색기 창 안 미니 트리) — 마크업은 같고 링크만 `pages/` 접두:

```html
<div class="win__body win__body--flush split">
  <nav class="tree" aria-label="폴더">
    <ul class="tree__list">
      <li class="tree__node">
        <div class="tree__row">
          <button class="tree__toggle" type="button" aria-expanded="true" aria-controls="tree-ix" aria-label="되감기 OS 99 접기"></button>
          <a class="tree__link" href="index.html"><span class="ico ico--tv" aria-hidden="true"></span><span class="tree__text">되감기 OS 99</span></a>
        </div>
        <ul class="tree__list" id="tree-ix">
          <li class="tree__node"><div class="tree__row"><a class="tree__link" href="pages/kanban.html" aria-current="page"><span class="ico ico--folder" aria-hidden="true"></span><span class="tree__text">다음 주 편성</span> <span class="tree__count">6</span></a></div></li>
          <li class="tree__node"><div class="tree__row"><a class="tree__link" href="pages/inbox.html"><span class="ico ico--folder" aria-hidden="true"></span><span class="tree__text">반품 문의</span> <span class="tree__count">3</span></a></div></li>
          <li class="tree__node"><div class="tree__row"><a class="tree__link" href="pages/dashboard.html"><span class="ico ico--file" aria-hidden="true"></span><span class="tree__text">주문집계.xls</span></a></div></li>
        </ul>
      </li>
    </ul>
  </nav>
  <div class="split__main">…</div>
</div>
```

`.split`(232px | 나머지), `.split--wide`(280px). ≤768에서 위아래로 쌓이고 트리는 최대 240px 높이 스크롤.

### 1-4. 실행 대화상자(⌘K) + 토스트 호스트 — `</nav>` 뒤, `<script>` 앞 (모든 화면)

```html
<div class="cmd" data-command hidden>
  <div class="cmd__backdrop" data-close></div>
  <div class="win cmd__box" role="dialog" aria-modal="true" aria-labelledby="cmd-title">
    <header class="win__bar"><span class="ico ico--run win__icon" aria-hidden="true"></span><h2 class="win__title" id="cmd-title">실행</h2>
      <div class="win__ctrls"><button class="win__ctrl win__ctrl--close" type="button" data-close aria-label="닫기"></button></div></header>
    <div class="cmd__body">
      <div class="cmd__intro"><span class="ico ico--32 ico--run" aria-hidden="true"></span><p>열 프로그램, 상품코드, 주문번호를 입력하세요.</p></div>
      <label class="cmd__field"><span>열기(<u>O</u>):</span><input class="input cmd__input" autocomplete="off" spellcheck="false"></label>
      <div class="cmd__list">
        <p class="cmd__group">프로그램</p>
        <button class="cmd__item" type="button" data-href="pages/dashboard.html" data-keywords="dashboard 주조정실 모니터"><span class="ico ico--chart" aria-hidden="true"></span><span class="cmd__label">주조정실</span><span class="cmd__hint">dashboard.exe</span></button>
        <button class="cmd__item" type="button" data-href="pages/inbox.html" data-keywords="inbox 메일 고객센터"><span class="ico ico--mail" aria-hidden="true"></span><span class="cmd__label">되감기 메일</span><span class="cmd__hint">inbox.exe</span></button>
        <button class="cmd__item" type="button" data-href="pages/kanban.html" data-keywords="kanban 편성 회의"><span class="ico ico--folder" aria-hidden="true"></span><span class="cmd__label">다음 주 편성 회의</span><span class="cmd__hint">kanban.exe</span></button>
        <button class="cmd__item" type="button" data-href="pages/settings.html" data-keywords="settings 제어판 설정"><span class="ico ico--gear" aria-hidden="true"></span><span class="cmd__label">제어판</span><span class="cmd__hint">settings.exe</span></button>
        <p class="cmd__group">상품</p>
        <button class="cmd__item" type="button" data-href="pages/product.html" data-keywords="RW-CS-0091 카세트 워크스테레오"><span class="ico ico--cassette" aria-hidden="true"></span><span class="cmd__label">RW-99 워크스테레오</span><span class="cmd__hint">RW-CS-0091</span></button>
        <button class="cmd__item" type="button" data-href="pages/product.html" data-keywords="RW-LP-0207 시티팝 LP"><span class="ico ico--lp" aria-hidden="true"></span><span class="cmd__label">시티팝 LP 「한강 드라이브 1989」</span><span class="cmd__hint">RW-LP-0207</span></button>
        <p class="cmd__group">명령</p>
        <button class="cmd__item" type="button" data-action="theme" data-keywords="다크 라이트 테마 화면 모드"><span class="ico ico--tv" aria-hidden="true"></span><span class="cmd__label">화면 모드 바꾸기 (오후 재방송 ↔ 새벽 생방송)</span><span class="cmd__hint">theme</span></button>
      </div>
      <p class="cmd__empty" hidden>‘<span data-cmd-query></span>’을(를) 찾을 수 없습니다. 이름을 정확히 입력했는지 확인하세요.</p>
    </div>
    <div class="win__foot"><button class="btn btn--default" type="button" data-cmd-ok>확인</button><button class="btn" type="button" data-close>취소</button></div>
  </div>
</div>
<div class="toasts" aria-live="polite" aria-atomic="false"></div>
```

위는 **index.html 용**. **pages/*.html 용**은 `.cmd__list`만 아래로 바꾼다(나머지 마크업 동일). 토스트 호스트는 없으면 app.js가 만든다.

```html
      <div class="cmd__list">
        <p class="cmd__group">프로그램</p>
        <button class="cmd__item" type="button" data-href="../index.html" data-keywords="index 바탕화면 생방송 홈"><span class="ico ico--tv" aria-hidden="true"></span><span class="cmd__label">되감기 OS 99</span><span class="cmd__hint">desktop.exe</span></button>
        <button class="cmd__item" type="button" data-href="dashboard.html" data-keywords="dashboard 주조정실 모니터"><span class="ico ico--chart" aria-hidden="true"></span><span class="cmd__label">주조정실</span><span class="cmd__hint">dashboard.exe</span></button>
        <button class="cmd__item" type="button" data-href="inbox.html" data-keywords="inbox 메일 고객센터"><span class="ico ico--mail" aria-hidden="true"></span><span class="cmd__label">되감기 메일</span><span class="cmd__hint">inbox.exe</span></button>
        <button class="cmd__item" type="button" data-href="kanban.html" data-keywords="kanban 편성 회의"><span class="ico ico--folder" aria-hidden="true"></span><span class="cmd__label">다음 주 편성 회의</span><span class="cmd__hint">kanban.exe</span></button>
        <button class="cmd__item" type="button" data-href="settings.html" data-keywords="settings 제어판 설정"><span class="ico ico--gear" aria-hidden="true"></span><span class="cmd__label">제어판</span><span class="cmd__hint">settings.exe</span></button>
        <p class="cmd__group">상품</p>
        <button class="cmd__item" type="button" data-href="product.html" data-keywords="RW-CS-0091 카세트 워크스테레오"><span class="ico ico--cassette" aria-hidden="true"></span><span class="cmd__label">RW-99 워크스테레오</span><span class="cmd__hint">RW-CS-0091</span></button>
        <button class="cmd__item" type="button" data-href="product.html" data-keywords="RW-LP-0207 시티팝 LP"><span class="ico ico--lp" aria-hidden="true"></span><span class="cmd__label">시티팝 LP 「한강 드라이브 1989」</span><span class="cmd__hint">RW-LP-0207</span></button>
        <p class="cmd__group">명령</p>
        <button class="cmd__item" type="button" data-action="theme" data-keywords="다크 라이트 테마 화면 모드"><span class="ico ico--tv" aria-hidden="true"></span><span class="cmd__label">화면 모드 바꾸기 (오후 재방송 ↔ 새벽 생방송)</span><span class="cmd__hint">theme</span></button>
      </div>
```

---

## 2. 레이아웃 문법 (base.css)

### 2-1. 바탕화면 `.desk`
```html
<main id="main" class="desk desk--screen desk--floor">
  <p class="desk__mark" aria-hidden="true">REWIND 99</p>      <!-- 오른쪽 아래 거대 워드마크(창 뒤로 가려짐) -->
  <p class="desk__kata" aria-hidden="true">リワインド</p>      <!-- 오른쪽 세로 가타카나 -->
  …창들…
</main>
```
- 32px 격자선이 보이는 바탕. `--screen` = 최소 100vh + 작업 표시줄 높이만큼 아래 여백. `--floor` = 하단 30% 원근 그리드(≥1024px만). `--bare` = 패딩 0.
- 창 좌상단은 32px 격자에 맞춘다(장면 CSS에서 `margin`/`translate`를 32의 배수로).

### 2-2. 창 `.win` — 모든 섹션·패널·카드의 단위
```html
<section class="win win--app" aria-labelledby="w-1">
  <header class="win__bar">
    <span class="ico ico--tv win__icon" aria-hidden="true"></span>
    <h2 class="win__title" id="w-1">되감기홈쇼핑.exe — CH.99 생방송</h2>
    <div class="win__ctrls">
      <button class="win__ctrl win__ctrl--min" type="button" aria-label="말아 올리기"></button>
      <button class="win__ctrl win__ctrl--max" type="button" aria-label="최대화"></button>
      <button class="win__ctrl win__ctrl--close" type="button" aria-label="닫기"></button>
    </div>
  </header>
  <ul class="menubar">…</ul>              <!-- 선택 -->
  <div class="toolbar">…</div>            <!-- 선택: .btn--flat + .toolbar__sep -->
  <div class="win__body">…</div>
  <div class="win__foot">버튼 오른쪽 정렬</div>   <!-- 선택, --split = 양끝 -->
  <footer class="statusbar">…</footer>    <!-- 선택 -->
</section>
```
- 폭: `--s`(360) `--m`(480) `--l`(640) `--app`(760) `--app-l`(960) `--max`(100%). ≤768에서 `--l/--app/--app-l`은 전폭.
- 상태: `win--inactive`(회색 타이틀 바), `is-front`(맨 앞), `win--glow`(**방송 창 하나에만** — 다크에서 핑크 발광), `win--shade`(말아 올림, JS), `win--zoomed`(최대화, JS).
- 내용: `win__body`(12px) `--lg`(16px) `--flush`(0) `--paper`(흰 파인 종이) `--stack`(자식 간 12px).
- 타이틀 바 버튼은 시각 20px. ≤768에서 히트 영역 44×44(바 위아래로 4px 넘침)로 자동 확장된다.
- 닫기 버튼(`win__ctrl--close`)은 오버레이 밖에서는 창을 숨기고 "되돌리기" 토스트를 띄운다. 꾸밈용으로만 둘 창이면 `.win__ctrls`를 아예 생략.
- 창 안 소제목은 `<h3 class="t-xl">` 또는 그룹 상자(`.groupbox`)를 쓴다. 라벨→제목→부제 3단 헤더 금지.
- `data-windows`를 단 컨테이너 안에서는 누른 창이 맨 앞으로 오고 나머지 타이틀이 비활성으로 바뀐다(계단식 장면에 사용). 항상 활성으로 둘 창은 `data-always-active`.

### 2-3. 배열 — 섹션마다 바꾼다 (같은 배열 연속 금지)
```html
<div class="cascade" data-windows> <section class="win">…</section> <section class="win">…</section> </div>  <!-- ① 계단식 +32/+32, 마지막 자식이 맨 위 -->
<div class="tile tile--2"> … </div>        <!-- ② 바둑판식, 간격 8px. --2 / --3 / 자동(최소 320px) -->
<main class="desk desk--screen maximized"> <section class="win">…</section> </main>  <!-- ③ 최대화 -->
```
- 타일 스팬: `.tile__wide`(2칸) `.tile__full`(전폭) `.tile__tall`(2행). `.tile--stretch`로 높이 맞춤(빈 칸 방지).
- 모바일: 계단식은 x 0 / y +16px(타이틀 바가 책갈피처럼 쌓임), 타일은 1열.
- 장면 간 리듬: `.scene`(위아래 96px, 모바일 48px) `.scene--tight`(48px).
- 가로 스크롤 영역: `.scroll-x` (넘치면 오른쪽 페이드, 끝에 닿으면 사라짐 — app.js).

### 2-4. 바탕 아이콘 `.desk-icons`
```html
<nav class="desk-icons" aria-label="바탕화면 바로 가기">
  <a class="desk-icon" href="pages/dashboard.html"><span class="desk-icon__img"><span class="ico ico--32 ico--chart" aria-hidden="true"></span></span><span class="desk-icon__label">주조정실</span></a>
  …
</nav>
```
세로 열(폭 80, 피치 88). `.desk-icons--row` = 가로. 선택: `aria-current="page"` 또는 `.is-selected`(라벨 select 바탕). ≤768 자동 4열.

### 2-5. 방송 화면 `.crt` — 시그니처 B (노을·스캔라인·OSD는 **이 안에서만**)
```html
<div class="crt">
  <div class="crt__picture">
    <span class="crt__sun crt__sun--left" aria-hidden="true"></span>
    <span class="crt__floor" aria-hidden="true"></span>
    <div class="crt__stage crt__stage--end">…소품 SVG(2-6)…</div>
    <p class="crt__osd crt__osd--tl">CH.99 <span class="live-dot" aria-hidden="true"></span> LIVE</p>
    <p class="crt__osd crt__osd--tr" data-timecode="01:12:07" data-timecode-prefix="SP ">SP 01:12:07</p>
    <p class="crt__osd crt__osd--bl crt__osd--mint">Q-05 <span class="ko">남은 37대</span></p>
  </div>
  <div class="crt__caption">
    <p class="crt__name">리퍼브 휴대용 카세트 플레이어 「RW-99 워크스테레오」</p>
    <p class="price-cut"><s class="price-cut__was">₩89,000</s><strong class="price-cut__now" data-count-from="89000" data-count-to="59900">₩59,900</strong><span class="price-cut__note">3개월 무이자 · 월 ₩19,967</span></p>
  </div>
</div>
```
- 화면비: 기본 16:10, `crt--tall`(4:3) `crt--wide`(16:9). `crt--flat` = 비네팅 약하게(작은 썸네일).
- `data-tune-on-load`: 페이지 첫 로드 때 **한 번** 채널 전환 노이즈(220ms). 화면당 메인 방송 화면 1개에만. reduced-motion이면 생략.
- 방송 관련 텍스트 링크(편성표 회차, 다시보기 등)는 `<a class="signal-link">` — 호버·포커스 때 1px RGB 스플릿(`--split`). OS 버튼에는 쓰지 않는다.
- OSD 위치 `--tl --tr --bl --br --center`, 색 `--hot`(핑크) `--mint`. OSD 안 한글은 `<span class="ko">`(VT323에 한글 금지).
- 소품 배치: `crt__stage--end`(오른쪽) + `crt__sun--left` / `--start` + `--sun--right`. 소품이 태양을 가리지 않게 반대로 둔다. 썸네일은 소품 없이 태양만.
- **노을 위에 글자를 직접 얹지 않는다.** 방송 텍스트는 자막 바(`crt__caption`)나 노란 가격 띠(`price-cut__now`) 위에만.
- 가격 깎기 크기: 기본(거대, 메인 방송), `price-cut--m`, `price-cut--s`(썸네일·채널).
- 컬러바: `.crt__picture.colorbars` (신호 없음·방송 사고).

### 2-6. 상품 소품 SVG (방송 화면 안 일러스트)
`<svg class="prop" viewBox="…" aria-hidden="true" focusable="false">` 안에서 class로만 색을 준다: `.pa`(밝은 플라스틱) `.pb`(잉크) `.pc`(청록) `.pd`(핑크) `.pe`(노랑) `.pf`(그늘 회보라) `.ps`(선만, 케이블 등). RW-99 정본:

```html
<svg class="prop" viewBox="0 0 240 150" aria-hidden="true" focusable="false">
  <path class="ps" d="M200 52 C 232 52, 238 104, 212 132"/>
  <rect class="pb" x="24" y="36" width="180" height="112"/>
  <rect class="pa" x="18" y="30" width="180" height="112"/>
  <rect class="pf" x="30" y="22" width="20" height="8"/><rect class="pf" x="54" y="22" width="20" height="8"/>
  <rect class="pd" x="78" y="20" width="20" height="10"/><rect class="pf" x="102" y="22" width="20" height="8"/>
  <rect class="pf" x="126" y="22" width="20" height="8"/>
  <rect class="pb" x="32" y="42" width="152" height="70"/>
  <rect class="pc" x="38" y="48" width="140" height="58"/>
  <rect class="pe" x="38" y="48" width="140" height="13"/>
  <rect class="pb" x="62" y="70" width="92" height="26"/>
  <circle class="pa" cx="80" cy="83" r="11"/><circle class="pb" cx="80" cy="83" r="4"/>
  <circle class="pa" cx="136" cy="83" r="11"/><circle class="pb" cx="136" cy="83" r="4"/>
  <rect class="pd" x="32" y="120" width="70" height="8"/>
  <rect class="pf" x="150" y="118" width="6" height="6"/><rect class="pf" x="160" y="118" width="6" height="6"/><rect class="pf" x="170" y="118" width="6" height="6"/>
  <rect class="pf" x="150" y="128" width="6" height="6"/><rect class="pf" x="160" y="128" width="6" height="6"/><rect class="pf" x="170" y="128" width="6" height="6"/>
</svg>
```
다른 상품(LP·삐삐·브라운관·흉상·야자수 네온)도 같은 6색 클래스와 직사각형·원 위주(픽셀 감)로 그린다. 흐릿한 radial·필터 금지.

### 2-7. 활자·베벨 유틸
- 활자: `.t-mega`(워드마크·404) `.t-3xl` `.t-2xl`(Black Han Sans) `.t-xl` `.t-lg` `.t-sm` `.t-xs` `.t-muted` `.t-sys`(DotGothic16) `.t-latin`(라틴·가나 +0.08em) `.t-osd` + `--s/--m/--l`(VT323) `.t-code` `.num`(tabular) `.t-primary .t-accent .t-success .t-danger .t-warning` `.prose`(문단 간격·링크) `a.link`.
- 베벨: `.bevel-out` `.bevel-in` `.bevel-well` `.well`(파인 종이 + 12px) `.well--flush` `.sep`(에칭 구분선) `.groupbox` + `.groupbox__label`(또는 `fieldset.groupbox > legend`).
- 그림자·반경: 창·버튼에 `box-shadow`로 그림자를 추가하지 않는다(베벨만). 반경은 `.crt`(18px)·LIVE 점·아바타만.

---

## 3. 장면 CSS에서 쓸 semantic 토큰

| 분류 | 토큰 |
|---|---|
| 바탕 | `--desk --desk-grid --desk-mark --desk-floor` |
| OS 면 | `--face --face-hi2 --paper --select-soft` |
| 베벨 | `--bevel-hi --bevel-lo --bevel-edge` · 합성 `--bevel-out --bevel-in --bevel-well --bevel-thin --bevel-pressed --etch --etch-hi` |
| 글자 | `--ink --ink-muted --ink-off --emboss` |
| 타이틀 바 | `--title-grad --title-a --title-b --title-off --title-ink --title-off-ink` |
| 액션 | `--primary --primary-press --on-primary --accent --select --on-select --focus --focus-ring` |
| 상태 | `--success --warning --warning-bg --danger --on-danger` |
| 풍선 | `--tooltip --on-tooltip` |
| 방송(모드 무관) | `--osd-bg --osd-ink --osd-ink-alt --osd-ink-hot --osd-text --osd-shadow --osd-tab --price --on-price --strike --crt-sky --crt-sun --crt-floor --crt-floor-line --crt-scan --crt-glass` |
| 베이퍼 4색 | `--vapor-pink --vapor-cyan --vapor-mint --vapor-purple --on-vapor` |
| 차트 | `--chart-1 --chart-2 --chart-3` (라이트: 마젠타/보라/청록, 다크: 핑크/퍼플/시안) |
| 방송 효과 | `--split`(호버 RGB 스플릿 text-shadow) `--crt-static`(노이즈 이미지) |
| 컨트롤 테두리 보강 | `--box-ring` `--box-ring-in`(다크에서만 1px 라벤더 테두리 — 체크·라디오·슬라이더 홈이 밤 바탕에 묻히지 않게, 라이트는 투명) |
| 기타 | `--bar-1…7`(컬러바) `--shutdown-bg --shutdown-ink`(종료 화면) `--dither`(체커 25%) `--win-glow` `--icon-folder --icon-doc` |
| 크기 | `--grid`(32) `--bar-h --menu-h --status-h --ctl-h --taskbar-h --hit` `--fs-*` `--sp-*` `--dur-*` |

금지 조합: `--primary` 글자를 `--desk` 위에 직접(라이트 4.17 미달) — 바탕 위 라벨은 `--ink` 또는 `--select` 칩.

---

## 4. 컴포넌트 32 (알파벳순)

### accordion — 도움말 트리 `[+]/[−]` + 점선
```html
<div class="acc" data-accordion="single">
  <div class="acc__item">
    <h3 class="acc__head"><button class="acc__btn" type="button" aria-expanded="true" aria-controls="faq-1" id="faq-1-h"><span class="acc__box" aria-hidden="true"></span><span class="ico ico--help" aria-hidden="true"></span><span class="acc__text">반품은 언제까지 되나요?</span></button></h3>
    <div class="acc__panel" id="faq-1" role="region" aria-labelledby="faq-1-h"><p>받은 날로부터 7일 안에 1599-0099로 접수해 주세요. 플래티넘 LP 회원은 30일입니다.</p></div>
  </div>
</div>
```
`data-accordion`(여러 개 펼침) / `="single"`(하나만). 펼친 항목은 제목이 select 바탕. 비활성 = `disabled`.

### alert — 메시지 상자 축소판
```html
<div class="alert alert--warn" role="alert">
  <span class="ico ico--32 ico--warn alert__icon" aria-hidden="true"></span>
  <div><p class="alert__title">남은 수량 37대</p><p class="alert__text">방송이 끝나면 정가 ₩89,000으로 돌아갑니다.</p></div>
  <div class="alert__actions"><button class="btn btn--sm" type="button" data-dismiss>확인</button></div>
</div>
```
변형 `--info`(ico--info) `--success`(ico--check) `--warn`(ico--warn, 위 노란 띠) `--error`(ico--error, 위 빨간 띠). `alert--inline` = 폼 위 한 줄(16px 아이콘). 정보성은 `role="status"`.

### badge — OSD 태그 · 개수 · 분류 태그
```html
<span class="osd-tag osd-tag--latin"><span class="live-dot" aria-hidden="true"></span>LIVE</span>
<span class="osd-tag">방송중</span>  <span class="osd-tag osd-tag--hot">품절임박</span>  <span class="osd-tag osd-tag--mint">재고 있음</span>  <span class="osd-tag osd-tag--fill">Q-05</span>
<span class="count-badge">14</span>
<span class="tag"><span class="tag__code">CS</span>카세트·테이프</span>  <span class="tag tag--success">결제완료</span>
```
- 방송 상태 = `osd-tag`(검정 바탕). 라틴만이면 `--latin`(VT323), 한글은 기본(Nanum Gothic 800, 자간 0). 색 `--hot --mint --white --fill`(노란 띠).
- `count-badge` = 빨간 사각 숫자(`--corner`로 부모 모서리에). 표·목록의 처리 상태는 OS `tag`(`--success --danger --accent --select`).

### breadcrumb — 탐색기 주소 표시줄
```html
<nav class="addr" aria-label="현재 위치">
  <span class="addr__label">주소</span>
  <div class="addr__field">
    <span class="ico ico--folder ico--folder-c" aria-hidden="true"></span>
    <ol class="addr__path"><li><a href="../index.html">되감기</a></li><li><a href="dashboard.html">생방송</a></li><li aria-current="page">EP.1287</li></ol>
    <span class="addr__drop" aria-hidden="true"><span class="ico ico--arrow-down"></span></span>
  </div>
  <a class="btn btn--sm" href="dashboard.html">이동</a>
</nav>
```
창 안 메뉴 막대 아래에 둔다. 마지막 항목은 링크 없이 `aria-current="page"`.

### button
```html
<button class="btn btn--primary btn--default" type="button">주문</button>
<button class="btn btn--default" type="submit">확인</button>
<button class="btn" type="button">취소</button>
<button class="btn" type="button" disabled>비활성</button>
<button class="btn" type="button" aria-busy="true">결제 중</button>
<button class="btn btn--icon" type="button" aria-label="검색"><span class="ico ico--search" aria-hidden="true"></span></button>
<button class="btn btn--flat" type="button"><span class="ico ico--copy" aria-hidden="true"></span>복사</button>
```
- 변형: `--primary`(주문 = 마젠타 면, **화면당 행동 1개**), `--default`(Enter 기본 = 바깥 1px 테두리), `--flat`(도구 막대), `--icon`, `--block`.
- 크기: `--sm`(24px, 모바일 44px) 기본 32px(모바일 44px) `--lg` 44px.
- 상태: hover(면 밝아짐) · `:active`/`.is-pressed`/`aria-pressed="true"`(파임 + 글자 1px 이동) · focus-visible(안쪽 점선 + 바깥 링) · `disabled`(엠보스) · `aria-busy="true"`(모래시계).
- 묶음: `.btn-row`(간격 8) `.btn-row--end` `.btn-group`(붙음). 대화상자 버튼 순서는 `확인/주문 → 취소` 오른쪽 정렬, 마법사는 `< 뒤로` | `다음 >` `취소`.

### calendar — 날짜/시간 등록 정보
```html
<div class="cal" data-calendar>
  <div class="cal__head">
    <span class="select-wrap"><select class="select" aria-label="월"><option selected>10월</option></select></span>
    <div class="spin"><input class="input" type="number" value="2026" aria-label="연도"><span class="spin__btns"><button class="spin__btn spin__btn--up" type="button" aria-label="다음 해"></button><button class="spin__btn spin__btn--down" type="button" aria-label="이전 해"></button></span></div>
  </div>
  <div class="cal__grid" role="group" aria-label="2026년 10월">
    <span class="cal__dow cal__dow--sun">일</span><span class="cal__dow">월</span>…<span class="cal__dow">토</span>
    <button class="cal__day cal__day--out cal__day--sun" type="button" disabled>27</button> …
    <button class="cal__day" type="button" aria-label="10월 1일 목요일 EP.1279">1<span class="cal__ep">EP.1279</span></button>
    <button class="cal__day cal__day--holiday" type="button" aria-label="10월 3일 토요일 개천절">3<span class="cal__note">개천절</span></button>
    <button class="cal__day cal__day--off" type="button" aria-label="10월 5일 월요일 휴방">5<span class="cal__note">휴방</span></button>
    <button class="cal__day cal__day--holiday cal__day--special" type="button">9<span class="cal__ep">EP.1286</span></button>
    <button class="cal__day cal__day--today" type="button" aria-pressed="true" aria-label="10월 10일 토요일 EP.1287 오늘">10<span class="cal__ep">EP.1287</span></button>
  </div>
  <p class="cal__legend"><span><i class="cal__swatch cal__swatch--off"></i>월요일 휴방</span><span><i class="cal__swatch cal__swatch--special"></i>특집</span><span><i class="cal__swatch cal__swatch--sel"></i>선택</span></p>
  <p class="t-sm">선택: <output data-calendar-output>10월 10일 토요일 EP.1287 오늘</output></p>
</div>
```
2026-10-01은 **목요일**(앞에 9/27~30 4칸). 수식: `--out`(전후 달) `--sun` `--off`(월요일 휴방 해칭) `--holiday` `--special`(노란 점: 특집) `--today`(점선). 선택 = `aria-pressed="true"`. 키보드 ←→ ±1일, ↑↓ ±7일.

### card — 작은 창(상품) · 집계 창(stat)
```html
<article class="win card">
  <header class="win__bar"><span class="ico ico--file win__icon" aria-hidden="true"></span><h3 class="win__title">RW-PG-0033</h3></header>
  <div class="crt crt--flat card__thumb"><div class="crt__picture"><span class="crt__sun" aria-hidden="true"></span><span class="crt__floor" aria-hidden="true"></span><p class="crt__osd crt__osd--tl"><span class="osd-tag osd-tag--fill">Q-02</span></p></div></div>
  <div class="card__body">
    <p class="card__name">무선호출기 모양 블루투스 알림기 「삐삐99」</p>
    <p class="card__meta">10월 10일(토) 00:00 방송 · 318개 판매</p>
    <p class="card__price"><s class="card__was">₩39,000</s><strong class="card__now">₩29,900</strong></p>
  </div>
  <div class="card__actions"><button class="btn btn--primary" type="button">주문</button><button class="btn" type="button">찜</button></div>
</article>

<section class="win" aria-labelledby="st-1">
  <header class="win__bar"><h3 class="win__title" id="st-1">콜 대기</h3></header>
  <div class="stat"><p class="stat__label">상담 대기 콜</p><p class="stat__value stat__value--hot">23<span class="stat__unit">콜</span></p><p class="stat__delta stat__delta--down">평균 대기 2분 14초</p><p class="stat__asof">01:12:07 기준</p></div>
</section>
```
카드 타이틀 바는 **상품코드(라틴·숫자)만** 쓴다(VT323 + 자간). 한글 이름은 `card__name`에. 링크 카드는 `<a class="win card card--link" href="product.html">`(호버 = OSD RGB 스플릿). `card--soldout`(흑백 + 회색 가격), 선택 `is-selected`. 통계 숫자 4개 가로줄 금지 — stat 창은 바둑판 타일 속 크기를 달리해 섞는다.

### carousel — 채널 넘기기
```html
<section class="channel" data-carousel aria-roledescription="carousel" aria-label="오늘 밤 방송 상품" tabindex="0">
  <div class="crt channel__screen">
    <div class="channel__slide" data-title="RW-99 워크스테레오" data-channel="Q-05">
      <div class="crt__picture">…sun/floor/stage…</div>
      <div class="crt__caption"><p class="crt__name">RW-99 워크스테레오</p><p class="price-cut price-cut--s"><s class="price-cut__was">₩89,000</s><strong class="price-cut__now">₩59,900</strong></p></div>
    </div>
    <div class="channel__slide" data-title="삐삐99" data-channel="Q-02" hidden>…</div>
    <p class="crt__osd crt__osd--tl">CH.99 <span data-carousel-osd>Q-05</span></p>
    <span class="channel__noise" aria-hidden="true"></span>
  </div>
  <div class="channel__remote">
    <button class="btn channel__btn" type="button" data-carousel-prev aria-label="이전 채널">CH ▼</button>
    <span class="channel__count"><b data-carousel-current>01</b>/05</span>
    <button class="btn channel__btn" type="button" data-carousel-next aria-label="다음 채널">CH ▲</button>
  </div>
</section>
```
첫 슬라이드만 보이고 나머지 `hidden`. 전환마다 채널 노이즈 220ms, ←/→, 스와이프. 자동 넘김 없음(상시 모션 예산). 선택적으로 `<div class="channel__dots"><button class="channel__dot" type="button" aria-label="1번 채널" aria-current="true"></button>…</div>`.

### code — 메모장 창
```html
<figure class="win code">
  <div class="win__bar win--inactive"><span class="ico ico--file win__icon" aria-hidden="true"></span><span class="win__title">config.sys - 메모장</span></div>
  <div class="code__body"><button class="btn btn--sm code__copy" type="button" data-copy>복사</button>
<pre><code><span class="tk-com">/* 주문 버튼 = 마젠타 면 */</span>
<span class="tk-key">.btn--primary</span> { background: <span class="tk-val">var(--primary)</span>; }</code></pre></div>
</figure>
```
하이라이트 `tk-key tk-val tk-str tk-com tk-tag`. 인라인 `<code class="inline">`, 키 `<kbd class="kbd">⌘</kbd>`.

### command — ⌘K 실행 대화상자
1-4 셸 그대로. 항목 `data-href`(이동) 또는 `data-action="theme"`(화면 모드) / `data-action="toast" data-toast-title=""`. 검색은 라벨 + `data-keywords`. ↑↓ 이동, Enter 실행, Esc 닫기, 포커스 트랩.
정적 견본(index S4): 바깥에 `cmd--static`을 붙이고 `hidden`·`aria-modal` 빼기, `.cmd__item` 하나에 `aria-selected="true"`.

### drawer — 가장자리 도킹 창
```html
<button class="btn" type="button" data-drawer-open="cart" aria-haspopup="dialog" aria-expanded="false">장바구니 (2)</button>
<div class="drawer" id="cart" hidden>
  <div class="drawer__backdrop" data-close></div>
  <aside class="win drawer__panel" role="dialog" aria-modal="true" aria-labelledby="cart-t">
    <header class="win__bar"><span class="ico ico--cart win__icon" aria-hidden="true"></span><h2 class="win__title" id="cart-t">장바구니 (2)</h2><div class="win__ctrls"><button class="win__ctrl win__ctrl--close" type="button" data-close aria-label="장바구니 닫기"></button></div></header>
    <div class="win__body drawer__body">
      <div class="drawer__line"><div class="crt crt--flat drawer__thumb"><div class="crt__picture"><span class="crt__sun"></span><span class="crt__floor"></span></div></div><span>RW-99 워크스테레오 × 1</span><span class="t-osd t-osd--s">₩59,900</span></div>
      <p class="drawer__sum"><span>합계</span><span class="t-osd">₩79,800</span></p>
    </div>
    <div class="win__foot drawer__foot"><button class="btn btn--primary btn--block" type="button">주문</button></div>
  </aside>
</div>
```
오른쪽 기본, `drawer--left`. 작업 표시줄 위까지 높이. 정적 견본 = `drawer--static`.

### empty — 신호 없음
```html
<div class="empty">
  <div class="crt crt--flat empty__screen"><div class="crt__picture colorbars"><p class="crt__osd crt__osd--center">NO SIGNAL</p></div></div>
  <p class="empty__title">아직 찜한 방송이 없어요</p>
  <p class="empty__text">편성표에서 ♡를 누르면 방송 30분 전에 알려 드려요.</p>
  <a class="btn" href="../index.html">편성표 보기</a>
</div>
```
`empty--row` = 왼쪽 화면 + 오른쪽 글(좁으면 세로). 버튼은 1개.

### form — 대화상자 문법
```html
<form class="form" data-validate data-success-title="주문서를 저장했습니다" data-success-text="RW-261010-0417">
  <div class="alert alert--inline" data-form-summary hidden role="alert"><span class="ico ico--error alert__icon t-danger" aria-hidden="true"></span><p class="alert__text"><b data-form-count>0</b>개 항목을 확인해 주세요.</p></div>
  <div class="field">
    <label class="field__label" for="f-tel">연락처<span class="field__req" aria-hidden="true">*</span>:</label>
    <div class="field__control">
      <input class="input" id="f-tel" inputmode="tel" required pattern="01[0-9]-?[0-9]{3,4}-?[0-9]{4}" data-msg-pattern="010-1234-5678 형식으로 입력해 주세요." placeholder="010-0000-0000">
      <p class="field__hint">배송 기사님만 볼 수 있어요.</p>
      <p class="field__error" id="e-tel"></p>
    </div>
  </div>
  <div class="field"><label class="field__label" for="f-opt">옵션:</label><div class="field__control"><span class="select-wrap"><select class="select" id="f-opt"><option>본체 + 공테이프 C-60 1개</option><option>본체만</option></select></span></div></div>
  <div class="field"><label class="field__label" for="f-qty">수량:</label><div class="spin"><input class="input" id="f-qty" type="number" value="1" min="1" max="3"><span class="spin__btns"><button class="spin__btn spin__btn--up" type="button" aria-label="수량 늘리기"></button><button class="spin__btn spin__btn--down" type="button" aria-label="수량 줄이기"></button></span></div></div>
  <fieldset class="groupbox"><legend>결제 방법</legend>
    <div class="choice-list choice-list--row">
      <label class="radio"><input class="radio__box" type="radio" name="pay" checked><span class="radio__text">카드 3개월 무이자</span></label>
      <label class="radio"><input class="radio__box" type="radio" name="pay"><span class="radio__text">무통장 입금</span></label>
    </div>
  </fieldset>
  <div class="slider"><label class="field__label" for="f-scan">스캔라인 강도:</label><input class="slider__input" id="f-scan" type="range" min="0" max="10" value="6"><div class="slider__ticks" aria-hidden="true"></div><div class="slider__scale" aria-hidden="true"><span>없음</span><span>브라운관</span></div></div>
  <label class="check"><input class="check__box" type="checkbox" required data-msg-required="약관에 동의해야 주문할 수 있습니다."><span class="check__text">구매 조건 확인 및 결제 진행 동의 (필수)</span></label>
  <div class="form__actions form__actions--split"><button class="btn" type="button">&lt; 뒤로</button><span class="btn-row"><button class="btn btn--default" type="submit">다음 &gt;</button><button class="btn" type="button">취소</button></span></div>
</form>
```
- 라벨은 왼쪽 112px + **콜론**, 니모닉 `<u>`. `field--stack`(라벨 위), `field--top`(텍스트영역 옆 라벨 위쪽 정렬). ≤560 자동 세로.
- 컨트롤: `.input` `.textarea` `.select`(반드시 `.select-wrap`으로 감쌈) `.spin` `.check`/`.radio`(픽셀 체크·팔각 점) `.slider`. 스위치 없음(체크박스로).
- 상태: hover · focus-visible · `disabled`(엠보스) · `readonly`(face 바탕) · `aria-invalid="true"`(빨간 2px) + `.field.is-invalid`/`.field__error.is-shown`.
- 금액 연동: `<strong data-total-for="f-qty" data-unit="59900">₩59,900</strong>`.

### kanban — 폴더 창 열 + 파일 카드
```html
<div class="kanban" data-kanban style="--kanban-cols:4">
  <section class="win kanban__col" aria-labelledby="k-src">
    <header class="win__bar"><span class="ico ico--folder win__icon" aria-hidden="true"></span><h3 class="win__title" id="k-src">소싱 중</h3><span class="kanban__count">1</span></header>
    <ul class="kanban__list" aria-labelledby="k-src">
      <li class="kanban__card" draggable="true" tabindex="0">
        <span class="ico ico--32 ico--file" aria-hidden="true"></span>
        <div><p class="kanban__name">EP.1293 쇼핑몰 분수 향 디퓨저</p><p class="kanban__file">ep1293.rwd</p><p class="kanban__meta">백승환 <span class="osd-tag">소싱</span></p></div>
      </li>
    </ul>
    <button class="kanban__add" type="button">+ 회차 파일 추가</button>
  </section>
  …
</div>
```
끌기 중 = 점선 와이어프레임 고스트, 놓을 곳 = 디더. 키보드: Space 집기 → ←/→ 열 이동, ↑/↓ 순서 → Space 놓기. 개수는 JS가 갱신. 잠긴 카드 `kanban__card--locked`, 선택 `aria-selected="true"`. ≤768 가로 스냅 스크롤.

### list — 탐색기 자세히 보기
```html
<div class="filelist">
  <div class="filelist__head" aria-hidden="true"><span class="filelist__th">제목</span><span class="filelist__th">보낸 사람</span><span class="filelist__th filelist__hide-m">받은 시각</span></div>
  <ul class="filelist__body" role="listbox" aria-label="받은 편지함">
    <li class="filelist__row filelist__row--unread" role="option" aria-selected="true"><span class="filelist__name"><span class="ico ico--mail" aria-hidden="true"></span><span>테이프가 늘어나요 — RW-261009-1123</span></span><span class="filelist__col">박도현</span><span class="filelist__col filelist__hide-m">01:04</span></li>
    …
  </ul>
</div>
```
열 폭은 `style="--cols: minmax(0,2fr) 120px 96px"`로 조정(기본 2.2:1:1). 숫자 열 `filelist__col--num`, VT323 `--osd`. 링크 목록이면 `<a class="filelist__row" href>`(role 없이). listbox는 ↑↓/Home/End, Enter 시 `data-href` 이동, 선택 시 `rw:select` 이벤트. 짝수 줄무늬 없음. ≤768: 첫 두 열만.

### marquee — 자막 띠 뉴스 티커 (화면당 1개)
```html
<div class="ticker" data-marquee>
  <span class="ticker__tab">속보</span>
  <div class="ticker__viewport"><div class="ticker__track"><ul class="ticker__group">
    <li class="ticker__item">RW-99 남은 수량 <span class="t-osd">37</span>대</li>
    <li class="ticker__item">다음 방송 10월 11일(일) 00:00 시티팝 LP 재발매 특집</li>
    <li class="ticker__item">₩50,000 이상 3개월 무이자</li>
  </ul></div></div>
  <button class="ticker__pause" type="button" data-marquee-toggle aria-pressed="false" aria-label="자막 멈춤"><span class="ico ico--pause" aria-hidden="true"></span></button>
</div>
```
묶음은 JS가 복제. 일시정지 버튼 필수. reduced-motion이면 줄바꿈된 정적 목록.

### menu — 드롭다운 · 우클릭 · 시작 메뉴
```html
<div class="menu-anchor">
  <button class="btn" type="button" data-menu-trigger aria-controls="m-view" aria-expanded="false" aria-haspopup="menu">보기 ▾</button>
  <div class="menu" id="m-view" role="menu" hidden>
    <button class="menu__item" role="menuitemcheckbox" aria-checked="true" type="button"><span></span><span>스캔라인</span><span class="menu__key">F7</span></button>
    <button class="menu__item" role="menuitem" type="button"><span class="ico ico--tv" aria-hidden="true"></span><span>방송 창 최대화</span><span class="menu__key">F11</span></button>
    <div class="menu__sep" role="separator"></div>
    <button class="menu__item menu__item--sub" role="menuitem" type="button"><span></span><span>화면 모드</span></button>
    <button class="menu__item" role="menuitem" type="button" aria-disabled="true"><span></span><span>자막 끄기</span></button>
  </div>
</div>
```
- **항목 자식 순서 고정**: [아이콘 칸(`.ico` 또는 빈 `<span>`)] [이름] [단축키(선택)]. 체크형은 빈 칸 자리에 체크가 그려진다.
- `menuitemradio`는 같은 메뉴 안 하나만. `data-keep-open` = 눌러도 안 닫힘. `data-toast-title` = 누르면 토스트.
- 키보드: ↑↓/Home/End, 메뉴 막대에서 ←→로 옆 메뉴. 오른쪽 넘침은 자동 `menu--end`, 위로 열기 `menu--up`. 정적 견본 `menu--static`(+ `is-active`로 하이라이트 고정).

### modal — 대화상자
```html
<button class="btn" type="button" data-modal-open="dlg-limit" aria-haspopup="dialog">수량 변경</button>
<div class="modal" id="dlg-limit" hidden>
  <div class="modal__backdrop" data-close></div>
  <div class="win win--m modal__box" role="dialog" aria-modal="true" aria-labelledby="dlg-limit-t" aria-describedby="dlg-limit-d">
    <header class="win__bar"><h2 class="win__title" id="dlg-limit-t">RW-99 워크스테레오</h2><div class="win__ctrls"><button class="win__ctrl win__ctrl--close" type="button" data-close aria-label="닫기"></button></div></header>
    <div class="modal__body"><span class="ico ico--32 ico--error modal__icon modal__icon--error" aria-hidden="true"></span>
      <div class="modal__msg" id="dlg-limit-d"><p class="modal__title">수량을 늘릴 수 없습니다.</p><p>방송 상품은 1인 3대까지 주문할 수 있어요. 남은 수량 37대.</p></div></div>
    <div class="modal__foot"><button class="btn btn--default" type="button" data-close data-autofocus>확인</button><button class="btn" type="button" data-close>도움말</button></div>
  </div>
</div>
```
뒤 배경은 어둡게 하지 않고 체커 디더. 열리면 뒤 창 타이틀이 모두 비활성. 4프레임 줌으로 열림, Esc·포커스 트랩. 아이콘 `modal__icon--info/--warn/--error`, 아이콘 없는 본문 `modal__body--plain`. 정적 견본(S1 주문 대화상자, S4) = 바깥 `modal modal--static`, `hidden`·`aria-modal` 제거. ≤768 하단 시트.

### motion — 모션 토큰 시연
```html
<div class="win motion">
  <div class="motion__row"><span class="motion__name">창 열기<span class="motion__token">--dur-open 160ms steps(4)</span></span><div class="motion__stage"><div class="mo-open" id="mo-open"></div></div><button class="btn btn--sm" type="button" data-motion-play="mo-open">재생</button></div>
  <div class="motion__row"><span class="motion__name">채널 노이즈<span class="motion__token">--dur-channel 220ms</span></span><div class="motion__stage"><div class="crt crt--flat mo-channel" id="mo-ch"><div class="crt__picture"><span class="crt__sun"></span><span class="crt__floor"></span></div></div></div><button class="btn btn--sm" type="button" data-motion-play="mo-ch">재생</button></div>
  <div class="motion__row"><span class="motion__name">가격 롤링<span class="motion__token">--dur-count 900ms</span></span><div class="motion__stage"><span class="mo-count" id="mo-count" data-count-from="89000" data-count-to="59900" data-count-manual>₩59,900</span></div><button class="btn btn--sm" type="button" data-motion-play="mo-count">재생</button></div>
  <div class="motion__row"><span class="motion__name">릴 회전<span class="motion__token">--dur-reel 1.6s</span></span><div class="motion__stage">(spinner의 svg.reel)</div><span></span></div>
</div>
```

### navbar — 작업 표시줄 + 메뉴 막대
1-1, 1-2 셸 그대로. 메뉴 막대 항목 `menubar__item`(니모닉 `<u>`), 열린 상태 `aria-expanded="true"`(파임). 작업 버튼 현재 = `aria-current="page"`(눌림 + 디더). ≤768: 시작 라벨·작업 라벨·시계 숨김, 아이콘 44px.

### pagination — 상태 표시줄 안
```html
<div class="statusbar"><div class="statusbar__cell statusbar__cell--grow">
  <nav class="pager" aria-label="주문 목록 페이지">
    <a class="pager__btn pager__btn--text" aria-disabled="true">◀ 이전</a>
    <ol class="pager__list">
      <li><a class="pager__btn" href="dashboard.html" aria-current="page">1</a></li>
      <li><a class="pager__btn" href="dashboard.html">2</a></li>
      <li class="pager__far"><a class="pager__btn" href="dashboard.html">3</a></li>
      <li class="pager__gap" aria-hidden="true">…</li>
      <li><a class="pager__btn" href="dashboard.html">87</a></li>
    </ol>
    <a class="pager__btn pager__btn--text" href="dashboard.html">다음 ▶</a>
    <span class="pager__count"><span class="t-osd">1–12</span> / <span class="t-osd">1,041</span>건</span>
  </nav>
</div></div>
```
1,041건 ÷ 12 = 87쪽. 비활성은 `href` 없이 `aria-disabled="true"`. `pager__far`는 ≤768 숨김.

### popover — 풍선 도움말
```html
<span class="pop-anchor">
  <button class="btn" type="button" data-popover-trigger aria-controls="bal-pre" aria-expanded="false">선주문이란?</button>
  <div class="balloon" id="bal-pre" role="dialog" aria-labelledby="bal-pre-t" hidden>
    <p class="balloon__title" id="bal-pre-t"><span class="ico ico--info" aria-hidden="true"></span>방송 5분 전 선주문</p>
    <p>골드 테이프 회원은 다음 방송 23:55부터 미리 주문할 수 있어요.</p>
    <button class="balloon__close" type="button" data-close aria-label="풍선 닫기"></button>
  </div>
</span>
```
바깥 클릭·Esc로 닫힘. 오른쪽 넘침은 자동 `balloon--flip`, 위로 `balloon--up`. 정적 견본 `balloon--static`(닫기 버튼은 `data-dismiss`).

### progress — 방송 게이지 / OS 막대
```html
<div class="gauge" role="group" aria-label="RW-99 남은 수량">
  <div class="gauge__head"><span class="gauge__label">RW-99 남은 수량</span><span class="gauge__num">37<small>/120</small></span></div>
  <div class="gauge__track" role="progressbar" aria-valuenow="37" aria-valuemin="0" aria-valuemax="120" aria-label="남은 수량 37대 / 120대"><div class="gauge__fill"></div></div>
  <p class="gauge__note">01:12:07 기준 · 31% 남음</p>
</div>
<div class="progress">
  <p class="progress__label"><span>추억을 복사하는 중…</span><span class="t-osd">64%</span></p>
  <div class="progress__track" role="progressbar" aria-valuenow="64" aria-valuemin="0" aria-valuemax="100" aria-label="설치 진행률"><div class="progress__fill"></div></div>
</div>
```
`aria-valuenow`만 바꾸면 JS가 `--val` 갱신. `gauge--low`(노랑), `progress--success/--danger/--busy`(행진).

### sidebar — 1-3 셸 참조
`.tree` + `.split`. 하위 목록 접기 = `tree__toggle[aria-expanded]` + `aria-controls`. 선택 = `aria-current="page"` 또는 `is-selected`. 개수 `tree__count`(VT323).

### skeleton — 신호 수신 중
```html
<div class="skeleton" aria-busy="true" aria-label="주문 목록 불러오는 중">
  <span class="skeleton__label">TUNING…</span>
  <span class="noise noise--title"></span><span class="noise noise--line"></span><span class="noise noise--line noise--short"></span>
</div>
<span class="noise noise--thumb"></span>   <!-- 방송 썸네일 자리 -->
```
`noise--block`(120px) `noise--osd`(검정 바탕). reduced-motion이면 스캔 바 없이 정지 노이즈.

### spinner — 카세트 릴
```html
<div class="spinner spinner--block" role="status">
  <svg class="reel" viewBox="0 0 72 46" aria-hidden="true"><rect class="reel__shell" x="1" y="1" width="70" height="44"/><rect class="reel__label" x="6" y="5" width="60" height="8"/><rect class="reel__window" x="14" y="18" width="44" height="18"/><rect class="reel__tape" x="22" y="31" width="28" height="3"/><g class="reel__hub"><circle cx="24" cy="27" r="7"/><rect class="reel__tooth" x="23" y="21" width="2" height="4"/><rect class="reel__tooth" x="23" y="29" width="2" height="4"/><rect class="reel__tooth" x="18" y="26" width="4" height="2"/><rect class="reel__tooth" x="26" y="26" width="4" height="2"/></g><g class="reel__hub"><circle cx="48" cy="27" r="7"/><rect class="reel__tooth" x="47" y="21" width="2" height="4"/><rect class="reel__tooth" x="47" y="29" width="2" height="4"/><rect class="reel__tooth" x="42" y="26" width="4" height="2"/><rect class="reel__tooth" x="50" y="26" width="4" height="2"/></g></svg>
  <span class="spinner__label">되감는 중…</span>
</div>
<span class="spinner spinner--s" role="status"><span class="ico ico--hourglass" aria-hidden="true"></span>확인 중…</span>
```
`spinner--block`(세로 가운데) / 기본(가로 인라인). 큰 릴 `reel--l`.

### steps — 설치 마법사 단계
```html
<ol class="steps">
  <li class="steps__item is-done">상품 확인<span class="steps__sub">RW-CS-0091 × 1</span></li>
  <li class="steps__item" aria-current="step">배송지<span class="steps__sub">서울 용산구</span></li>
  <li class="steps__item">결제</li>
  <li class="steps__item">완료</li>
</ol>
```
완료 = 초록 픽셀 체크, 현재 = ▶ + 볼드 + 파인 바탕, 미래 = 번호. ≤768에서 가로 스크롤 한 줄로 바뀐다(세로 유지하려면 `steps--keep`). 항상 가로면 `steps--row`.

### table — 스프레드시트
```html
<div class="sheet">
  <div class="sheet__formula"><span class="sheet__ref">A1</span><span class="sheet__fx" aria-hidden="true">fx</span><output class="sheet__value">RW-261010-0417</output></div>
  <div class="sheet__scroll">
    <table class="sheet__table" data-sortable>
      <caption class="sr-only">EP.1287 주문 집계 (01:12:07 기준)</caption>
      <thead><tr><th class="sheet__corner" aria-hidden="true"></th>
        <th scope="col" aria-sort="none"><button class="sheet__sort" type="button">주문번호</button></th>
        <th scope="col" aria-sort="none"><button class="sheet__sort" type="button">고객</button></th>
        <th scope="col" aria-sort="descending"><button class="sheet__sort" type="button">금액</button></th>
        <th scope="col" class="sheet__hide-m"><span>상태</span></th></tr></thead>
      <tbody>
        <tr><th scope="row" class="sheet__rowhead">1</th><td class="code">RW-261010-0417</td><td>김나래</td><td class="num-r" data-sort="59900">₩59,900</td><td class="sheet__hide-m"><span class="tag tag--success">결제완료</span></td></tr>
      </tbody>
      <tfoot><tr><th scope="row" class="sheet__rowhead">Σ</th><td colspan="2">합계</td><td class="num-r">₩…</td><td class="sheet__hide-m"></td></tr></tfoot>
    </table>
  </div>
</div>
```
열 머리 버튼으로 정렬(`aria-sort` 갱신, 행 번호 재부여). 숫자 정렬은 `data-sort`(없으면 ₩·쉼표 제거 후 파싱). 셀 클릭/화살표 = 2px 잉크 테두리 + 수식 입력줄 갱신(`B4`). 행 선택 `tr[aria-selected="true"]`. 아래 시트 탭(선택): `<div class="sheet__tabs"><span class="sheet__tab" aria-current="true">EP.1287</span><span class="sheet__tab">EP.1286</span></div>`. 표 8~15행.

### tabs — 등록 정보 탭
```html
<div class="tabs" data-tabs>
  <div class="tabs__list" role="tablist" aria-label="화면 등록 정보">
    <button class="tabs__tab" role="tab" id="tab-c" aria-controls="pan-c" aria-selected="true" type="button">색 구성표</button>
    <button class="tabs__tab" role="tab" id="tab-f" aria-controls="pan-f" aria-selected="false" type="button">글꼴</button>
    <button class="tabs__tab" role="tab" id="tab-x" aria-controls="pan-x" aria-selected="false" type="button" aria-disabled="true">고급</button>
  </div>
  <div class="tabs__panel" role="tabpanel" id="pan-c" aria-labelledby="tab-c" tabindex="0">…</div>
  <div class="tabs__panel" role="tabpanel" id="pan-f" aria-labelledby="tab-f" tabindex="0" hidden>…</div>
  <div class="tabs__panel" role="tabpanel" id="pan-x" aria-labelledby="tab-x" tabindex="0" hidden>…</div>
</div>
```
←→/Home/End(자동 활성). ≤768: 탭 44px + 가로 스크롤 페이드.

### timeline — 방송 큐시트 / 주문 기록
```html
<ol class="cue">
  <li class="cue__item is-done"><time class="cue__tc">00:00</time><div class="cue__block"><p class="cue__q">Q-01 · RW-CS-0102</p><p class="cue__title">공테이프 C-60 10개 묶음</p><p class="cue__meta">448개 · ₩8,915,200</p></div></li>
  <li class="cue__item" aria-current="true"><time class="cue__tc">01:05<small>진행</small></time><div class="cue__block"><p class="cue__q">Q-05 · RW-CS-0091 <span class="osd-tag osd-tag--hot">▶ 방송중</span></p><p class="cue__title">리퍼브 휴대용 카세트 플레이어 「RW-99 워크스테레오」</p><p class="cue__meta">83 / 120대 · 한유리 · 진도윤 시연</p></div></li>
  <li class="cue__item"><time class="cue__tc">01:30</time>…</li>
</ol>
```
지난 큐 `is-done`(흐림), 현재 `aria-current="true"`(마젠타 탭), 쉬는 구간 `cue__item--break`(해칭). 주문 기록은 `cue__tc`에 날짜(`10.10`)·`<small>01:09</small>`, `cue--compact`.

### toast — 시스템 트레이 풍선
```html
<button class="btn" type="button" data-toast-demo data-toast-title="주문 폭주" data-toast-text="RW-99 1분 사이 12건 주문" data-toast-tone="broadcast">알림 띄우기</button>
<script>/* 또는 */ Rewind.toast({ title: '결제완료', text: 'RW-261010-0417 · ₩59,900', tone: 'success' });</script>
```
`tone`: `info success warn error broadcast`(검정 브라운관 아이콘 = 방송 알림). 4초 후 닫힘(호버·포커스 중 정지), `action: { label, run }`. 작업 표시줄 트레이 위로 솟는다. 정적 견본:
```html
<div class="toasts toasts--static" aria-live="polite">
  <div class="toast toast--broadcast" role="status"><span class="toast__icon toast__icon--broadcast" aria-hidden="true"><span class="ico ico--tv"></span></span><div><p class="toast__title">주문 폭주</p><p class="toast__text">RW-99 1분 사이 <span class="t-osd">12</span>건</p></div><button class="toast__close" type="button" aria-label="알림 닫기"></button></div>
</div>
```

### tooltip — 노란 사각 툴팁
```html
<span class="tip"><button class="btn btn--icon" type="button" aria-label="상품코드로 찾기"><span class="ico ico--search" aria-hidden="true"></span></button><span class="tip__bubble">상품코드로 찾기 (Ctrl+F)</span></span>
```
500ms 지연(포커스는 즉시), Esc로 숨김, 화면 가장자리에서는 JS가 좌/우 정렬을 자동 전환. 위로 `tip--up`. 항상 보이는 견본 `tip--show`. 트리거와 `aria-describedby`는 JS가 연결.

### 상태 매트릭스 (hover / focus-visible / active / disabled / loading / error / selected)

| 컴포넌트 | hover | focus-visible | active·눌림 | disabled | loading | error | selected·현재 |
|---|---|---|---|---|---|---|---|
| button | 면 밝아짐 | 안쪽 점선 + 바깥 2px 링 | 파임 + 글자 1px 이동 (`.is-pressed`) | 엠보스 글자 | `aria-busy` 모래시계 | — | `aria-pressed` |
| input·select·textarea | 안쪽 3px 연한 테 | 점선 + 링 | — | face 바탕 + 엠보스 | — | `aria-invalid` 빨간 2px + `.field__error` | `readonly` face 바탕 |
| check·radio·slider | 상자 연하게 | 링 + 글자 점선 | — | 회색 체크 + 엠보스 | — | `aria-invalid` 빨간 2px | `:checked` 픽셀 체크/점 |
| tabs | 면 밝아짐 | 점선 + 링 | — | `aria-disabled` 엠보스 | — | — | `aria-selected` 2px 솟음 |
| menu·startmenu | select 바탕 | select 바탕 | — | `aria-disabled` 엠보스 | — | — | `aria-checked` 체크 · `aria-current` 연한 바탕 |
| list·table·tree·kanban·calendar | 연한 select | 점선 + 안쪽 링 | 표 머리 파임 | `--disabled`/`disabled` 엠보스 | skeleton `noise` | `t-danger` 셀 | `aria-selected`/`aria-current`/`aria-pressed` select 바탕 |
| pagination | 면 밝아짐 | 점선 + 링 | 파임 | `aria-disabled` 엠보스 | — | — | `aria-current="page"` select 파임 |
| accordion | 제목 밑줄 | 점선 | — | `disabled` 엠보스 | — | — | 펼침 = 제목 select 바탕 |
| carousel | — | 리모컨 버튼 링 | 채널 노이즈 220ms | — | — | — | `01/05` + 점 `aria-current` |
| card | 이름 밑줄 + OSD 스플릿 | 링 | — | `card--soldout` 흑백 | `noise--thumb` | — | `is-selected` 컬러 타이틀 |
| taskbar | 면 밝아짐 | 점선 + 링 | 파임 | — | — | — | `aria-current` 파임 + 디더 |
| alert·toast·modal | — | 닫기 점선 | — | — | spinner | `--error`/`tone:'error'` (`role=alert`) | — |

---

## 5. app.js 훅 요약

| 속성/클래스 | 동작 |
|---|---|
| `[data-theme-toggle]` · `input[data-theme-choice][value=light|dark]` | 테마 전환(+localStorage). 라벨 `[data-theme-label]` → 오후 재방송 / 새벽 생방송 |
| `[data-modal-open=id]` `[data-drawer-open=id]` `[data-close]` | 모달·드로어 열기/닫기, Esc, 포커스 트랩, 스크롤 잠금, `html.has-dialog` |
| `[data-command]` `[data-command-open]` ⌘K/Ctrl+K | 실행 대화상자 |
| `[data-popover-trigger][aria-controls]` `[data-menu-trigger][aria-controls]` | 풍선·메뉴(바깥 클릭 닫힘, 화살표) |
| `[data-windows]` · `.win__ctrl--min/--max/--close` | 창 앞으로·말기·최대화·닫기(되돌리기 토스트) |
| `[data-tabs]` `[data-accordion]` | 탭 · 아코디언 |
| `Rewind.toast()` `[data-toast-demo]` | 트레이 풍선 |
| `[data-carousel]` | 채널 넘기기 |
| `table[data-sortable]` · `.sheet` | 정렬 · 셀 선택 → 수식 입력줄 |
| `[data-calendar]` `[data-calendar-output]` | 날짜 선택 |
| `[data-kanban]` | 끌기 + 키보드 이동 |
| `form[data-validate]` `[data-form-summary]` | 검증·요약·성공 토스트 |
| `[data-marquee]` `[data-marquee-toggle]` | 자막 띠 복제·정지 |
| `[data-copy]` | 메모장 복사 |
| `[role=progressbar][aria-valuenow]` | `--val` 동기화 |
| `[data-count-to]` (+`data-count-from`, `data-count-format="int"`, `data-count-manual`) | 화면에 들어오면 1회 숫자 롤링 |
| `.crt[data-tune-on-load]` | 첫 로드 1회 채널 노이즈 |
| `[data-live="기준값"][data-live-step]` | 4초마다 1틱(탭 숨김·reduced-motion 정지) |
| `[data-timecode="01:12:07"][data-timecode-prefix]` | 1초씩 증가하는 타임코드 |
| `[data-motion-play=id]` `[data-busy-demo=ms]` `[data-dismiss]` | 모션 재생 · 버튼 로딩 · 닫기 |
| `.tree__toggle` · `.filelist__body[role=listbox]` · `.spin__btn` · `[data-total-for][data-unit]` | 트리 접기 · 목록 선택 · 스핀 · 금액 계산 |
| `.scroll-x` `.menubar` `.tabs__list` `.kanban` `.steps` | 넘침 페이드 힌트 |

한 화면에서 **상시 움직이는 것은 방송 화면 1개(LIVE 점·타임코드) + 자막 띠 1개**까지. `data-live`는 화면당 2개 이하.

---

## 6. 쓰지 말 것

- 노을 그라디언트·스캔라인·글로우를 `.crt` 밖(바탕·창 크롬·버튼)에 쓰기. 다크 핑크 발광은 방송 창 하나에만(`win--glow`).
- 둥근 모서리, 유리(blur) 카드, 은은한 drop-shadow, 알약 버튼. 창 위에 그림자를 따로 얹지 않는다.
- 텍스트 그라디언트·네온 text-shadow 글로우(OSD의 `2px 2px 0` 검정 그림자만 허용), 한 단어 강조색.
- VT323·`.t-latin`에 한글 넣기, 한글 라벨에 자간.
- `href="#"`, 인라인 onclick, 인라인 grid-template-columns, 이미지 파일, 이모지 아이콘.
- 라벨→제목→부제 섹션 헤더, 기능 칩, CTA 2개 쌍, 통계 숫자 4개 가로줄, 디자인 시스템 홍보 문구.
- 팩트 시트에 없는 날짜·요일·금액·인물. 플레이스홀더(`○○`, 홍길동 등).
