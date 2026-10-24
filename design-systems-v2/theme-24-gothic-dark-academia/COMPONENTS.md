# COMPONENTS — 석루서고 v2 마크업 계약

index.html · pages/*.html 담당은 **이 문서만 보고** 마크업한다. 디자인 근거와 세계관 값은 `DIRECTION.md`(특히 `## 팩트 시트`)에 있다. 이름·날짜·번호·가격은 팩트 시트에 있는 값만 쓴다.
클래스는 BEM(`블록__요소--변형`)이다. 상태는 되도록 ARIA 속성(`aria-selected` · `aria-current` · `aria-expanded` · `aria-pressed` · `aria-busy` · `aria-invalid` · `disabled`)으로 표시하고, CSS가 그 속성을 읽는다.

**두 시그니처를 기억할 것**
1. **장서 카드와 날짜도장**: 데이터는 카드(`.card`, 붉은 여백선 + 막대 구멍)에 담고, 상태는 날짜도장(`.stamp`)으로 찍는다. 알약 배지는 쓰지 않는다.
2. **주서와 각주**: 흑 한 색으로 쓰고 구조만 주서로 표시한다. 장 번호, 두문자, ¶, 각주 번호, 현재 위치가 여기에 해당한다. 설명은 본문에 넣지 않고 각주(`.fn` → `.apparatus` · `.gloss` · `.field__help`)로 내린다.

**금지**: 금색(`--gold`)을 글자·테두리·버튼에 쓰기(장식 SVG만 허용) · 블랙레터(`.black`, `--font-black`)를 워드마크·표제지 라틴·간기 이외에 쓰기(장 번호 포함 — 장 번호는 `--font-numeral` Crimson Pro 600) · 책등·표지 같은 물건 색에 글자용 의미 토큰 쓰기(`--pigment-*` + `--night-dim`) · 데이터 라벨에 로마숫자 쓰기 · 한글에 Special Elite·넓은 자간 쓰기 · `href="#"` · 인라인 onclick · 인라인 `grid-template-columns` · raw hex. 단, `style="--val:81.4%"`, `--h`, `--w`, `--from`, `--span`, `--tilt`, `--n`처럼 **커스텀 속성을 주입하는 것은 허용**한다.

---

## 0. 페이지 뼈대 (모든 HTML 공통)

```html
<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>오늘 밤 서고 일지 — 석루서고</title>
<script>(function(){try{var q=new URLSearchParams(location.search).get('theme');var s=localStorage.getItem('seokru-theme');var t=(q==='dark'||q==='light')?q:(s==='dark'||s==='light')?s:(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.setAttribute('data-theme',t);}catch(e){document.documentElement.setAttribute('data-theme','light');}})();</script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Crimson+Pro:ital,wght@0,400;0,600;1,400&family=Grenze+Gotisch:wght@500;800&family=Nanum+Gothic+Coding:wght@400;700&family=Nanum+Myeongjo:wght@400;700;800&family=Nanum+Pen+Script&family=Noto+Serif+KR:wght@600;700;900&family=Special+Elite&display=swap">
<link rel="stylesheet" href="styles.css">     <!-- pages: ../styles.css -->
<link rel="stylesheet" href="index.css">      <!-- pages: dashboard.css 같은 장면 전용 1개 -->
</head>
<body>
<a class="skip" href="#main">본문으로 건너뛰기</a>
<!-- 3절 셸: 러닝헤드 -->
<main id="main">…</main>
<!-- 3절 셸: 간기 푸터 -->
<!-- 오버레이(모달 · 드로어 · 서가 검색 카드)는 body 끝에. 서가 검색 카드는 모든 페이지에 1개 -->
<script src="app.js"></script>               <!-- pages: ../app.js -->
</body>
</html>
```

- `localStorage` 키는 `seokru-theme`이다. 우선순위는 `?theme=dark|light` → localStorage → 시스템 설정 순이다.
- `<title>` 형식: `장면 이름 — 석루서고` (index는 `석루서고 조판 규범`).
- 화면에 보이는 라벨은 모두 한국어로 쓴다. 예외는 워드마크 `Seokru`, 표제지 라틴 `Bibliotheca Seokru`, 간기 `Explicit`, 서양 서명 원어(이탤릭 `.book`), 청구기호·ID, 코드·파일명이다.
- 장면 CSS(`index.css`, `pages/*.css`)에서도 **semantic 토큰만** 쓴다(2절 목록 참고).
- 아이콘은 인라인 SVG로 넣는다: `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="…"/></svg>`. 선 1.5px, 색은 CSS의 `stroke: currentColor`가 정한다. **presentation attribute에 `var()`를 쓰지 않는다.** SVG 안에서 토큰 색이 필요하면 `style="fill:var(--rubric)"`이나 아래 `.lamp__*`처럼 클래스를 쓴다.

### 아이콘 정본 (path 그대로 복사)
| 이름 | 마크업 안쪽 |
|---|---|
| 검색 | `<circle cx="10.5" cy="10.5" r="6"/><path d="M15 15l5 5"/>` |
| 램프(테마 토글) | `<path d="M5 11l3-6h8l3 6z"/><path d="M12 11v8M8 19h8"/>` |
| 차례(메뉴) | `<path d="M4 7h16M4 12h16M4 17h10"/>` |
| 서랍(사이드바 열기) | `<rect x="4" y="5" width="16" height="14"/><path d="M4 12h16M10 8.5h4M10 15.5h4"/>` |
| 닫기 | `<path d="M6 6l12 12M18 6L6 18"/>` |
| 이전 · 다음 | `<path d="M15 5l-7 7 7 7"/>` · `<path d="M9 5l7 7-7 7"/>` |
| 확인 | `<path d="M5 12l5 5 9-10"/>` |
| 위험(삼각) | `<path d="M12 3l9 17H3z"/><path d="M12 10v4M12 17v.5"/>` |
| 습도(물방울) | `<path d="M12 3c3 5 6 8 6 12a6 6 0 01-12 0c0-4 3-7 6-12z"/>` |
| 안내 | `<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/>` |

### 녹색 갓 램프 SVG (스피너 · 모션 · 권두화 소품)
```html
<svg class="lamp" viewBox="0 0 36 44" aria-hidden="true">
  <polygon class="lamp__cone" points="9,17 27,17 35,44 1,44"/>
  <path class="lamp__shade" d="M5 17 L10 6 H26 L31 17 Z"/>
  <rect class="lamp__brass" x="15" y="2" width="6" height="4"/>
</svg>
```
`.lamp--lg`(64×78). 빛 원뿔(`.lamp__cone`)은 낮에는 석웅황, 밤에는 램프 빛(`--lamp-beam`)으로 칠해진다. **권두화의 큰 빛 원뿔**은 윤곽이 있는 SVG 다각형으로 그리고 `style="fill:var(--lamp-light);opacity:var(--lamp-cone)"`를 준다. 낮에는 0, 밤에는 .14가 되어 램프가 켜지고 꺼진다. radial-gradient 얼룩은 금지다.

---

## 1. 토큰 (semantic.css — 장면 CSS가 쓸 수 있는 이름)

| 무리 | 이름 |
|---|---|
| 면 | `--page` 피지/밤 참나무 · `--leaf` 카드 용지 · `--leaf-raised` 떠 있는 카드 · `--leaf-sunk` 오목한 면·책 접힘 |
| 글자 | `--ink` · `--ink-2` · `--ink-3`(캡션·각주, 최소) |
| 선 | `--rule` 입력·표 머리(3:1↑) · `--hairline` 장식 괘(경계·텍스트 금지) · `--ruling` 바탕 괘 |
| 주서 | `--rubric` · `--rubric-tint`(선택 바탕) · `--on-rubric` · `--rubric-on-tint`(tint 위 글자: 밤에는 피지색) |
| 주 버튼 | `--ink-fill` · `--ink-fill-hover` · `--on-ink-fill` |
| 잉크 블록(모드 불변) | `--ink-block` · `--on-ink-block` · `--on-ink-block-2` · `--rubric-on-block` · `--gold-on-block` |
| 안료(상태) | `--verdigris` 성공·열람 가능 · `--lapis` 정보·예약 · `--orpiment` 경고 글자 · `--orpiment-fill` 경고 면 · `--stamp` 날짜도장 보라 · 각 `-tint` |
| 장식 전용 | `--gold` (SVG 테두리·장서표·후원 인장 테두리만) |
| 서랍 | `--wood` · `--wood-edge` · `--on-wood` · `--on-wood-2` · `--plaque` · `--on-plaque` · `--plaque-edge` |
| 권두화 | `--lamp-glass` · `--lamp-light` · `--lamp-cone`(0 / .14) · `--lamp-beam` · `--window-pane`(낮 하늘 / 밤 `#18202B`) |
| 그림자 | `--shadow-lift` 카드 들림 · `--shadow-lift-sm` · `--shadow-hole` 구멍 · `--shadow-well` 서랍 칸 · `--scrim` |
| 글꼴 | `--font-black` · `--font-title` · `--font-text` · `--font-text-ko` · `--font-ui` · `--font-type` · `--font-type-ko` · `--font-hand` |
| 크기 | `--t-numeral` 360/168 · `--t-title-page` 128/60 · `--t-chapter` 64/38 · `--t-h2` 36/26 · `--t-h3` 22/19 · `--t-initial` · `--t-text` 18/16 · `--t-gloss` 14 · `--t-foot` 13 · `--t-ui` 15 · `--t-type` · `--t-call` · `--t-stamp` · `--t-hand` · `--t-run` |
| 간격 | `--s-1`4 `--s-2`8 `--s-3`12 `--s-4`16 `--s-5`24 `--s-6`32 `--s-7`48 `--s-8`72 `--s-9`96 `--s-10`144 · 판면 `--m-inner`48 `--m-top`72 `--m-outer`96 `--m-bottom`144 · `--col-text`680 `--col-gap`56 `--col-gloss`280 · `--gutter`16 |
| 모양 · 모션 | `--r-card` 2px(카드 용지만) · `--ease-ink` · `--ease-stamp` · `--d-hover`120 `--d-stamp`160 `--d-pull`240 `--d-overlay`280 `--d-pulled`320 `--d-lamp`360 `--d-reveal`420 |

---

## 2. 레이아웃 문법 (base.css)

### 다섯 개의 손 (글꼴 유틸)
| 클래스 | 쓰는 곳 |
|---|---|
| `.t-numeral` | 장 번호(Crimson Pro 600 로마숫자, 주서) |
| `.t-title-page` | 표제지 "조판 규범" |
| `.t-chapter` `.t-h2` `.t-h3` | 장 표제 · 절 제목 (Noto Serif KR) |
| `.t-ui` | 컨트롤 같은 무게의 라벨 |
| `.type` / `.type-ko` | 카드 타자 글씨 (라틴 Special Elite, 한글 Nanum Gothic Coding) |
| `.call` | 청구기호·등록번호·ID (`W 823.7 S545f`, `SR-0018442`, `RQ-261022-07`) — **한글 금지** |
| `.hand` | 사서 연필 메모 — 화면당 3곳 이하, 필수 정보 금지 |
| `.black` | 블랙레터 — 워드마크·`Bibliotheca`·`Explicit`만 |
| `.rubric` `.muted` `.meta` `.num` `.book` `.pilcrow` | 주서 글자 · 보조 · 캡션 · 표 숫자 · 서양 서명 이탤릭 · ¶ |

### `.folio` — 필사본 한 장 (본문 단 + 방주 단)
```html
<article class="folio">                     <!-- 방주 오른쪽(recto). 방주 왼쪽은 .folio--verso -->
  <div class="prose">
    <p class="has-initial">필사본은 검은 철잉크로 쓰고 … 주서는 구조에만 쓴다<a class="fn" href="#fn1-1" id="r1-1">1</a>.</p>
    <aside class="gloss">                    <!-- 방주: 바로 다음 문단과 같은 높이에 걸린다 -->
      <p><span class="fn">1</span>오배자 철잉크 <span class="call">#1E1912</span> · 피지 위 13.80:1</p>
      <p class="hand">주서는 한 화면에 다섯 번 넘게 쓰지 말 것</p>
    </aside>
    <p>금박은 채식에만 쓴다. …</p>
  </div>
  <figure class="figure folio__wide">        <!-- 도판이 방주 단까지 넘어온다(1016px) -->
    <div class="figure__plate">…</div>
    <figcaption class="figure__cap"><b>도판 1-1</b>안료 시험 획</figcaption>
  </figure>
  <div class="apparatus"><ol>
    <li id="fn1-1"><span class="apparatus__no">1</span><span>잉크 대비는 WCAG 2.x 상대 휘도로 계산했다.</span></li>
  </ol></div>
</article>
```
- 여백 비율은 안:위:바깥:아래 = 48:72:96:144이고, 본문 단은 최대 680px이다. `.folio--flush-top` · `--flush-bottom`을 붙이면 위·아래 여백을 0으로 만든다.
- `.prose` 안 문단은 첫 문단만 들여쓰지 않고 이후 문단을 1em 들여쓴다. 문단 사이는 띄우지 않는다. 장 첫 문단에는 `.has-initial`(주서 두문자 3줄 드롭)을 붙인다. 두문자를 따로 지정하려면 `<span class="initial">필</span>`을 쓴다.
- ≤1024px에서는 방주가 문단 뒤의 **인라인 방주**가 된다(왼쪽에 2px 주서 괘).
- 각주 번호는 `<a class="fn" href="#…">1</a>` 형식이다. 방주 안의 번호는 `<span class="fn">1</span>`로 쓴다.

### 장 표제
```html
<!-- 잉크 블록 전폭 (제1장 등). 다크에서도 검다 -->
<section class="ink-block chapter reveal" id="ch1" data-chapter-title="잉크와 안료" data-chapter-no="I">
  <div class="chapter-head chapter-head--block">
    <span class="chapter-head__no" aria-hidden="true">I</span>
    <div><h2 class="chapter-head__title">잉크와 안료</h2><p class="chapter-head__lede">흑과 주, 두 색으로 쓴다.</p></div>
  </div>
</section>

<!-- 판면 안 장 표제 (verso 등) — 번호 200px: .chapter-head__no--sm -->
<header class="chapter-head reveal" data-chapter-title="활자" data-chapter-no="II">
  <span class="chapter-head__no chapter-head__no--sm" aria-hidden="true">II</span>
  <h2 class="chapter-head__title">활자</h2>
</header>
```
- `data-chapter-title` / `data-chapter-no`가 있으면 스크롤에 따라 러닝헤드 가운데 제목이 바뀐다. 번호를 비우면 ¶로 표시된다.
- `.reveal`을 붙이면 뷰포트에 들어올 때 한 번 나타난다(420ms, 번호는 120ms 늦게). JS가 없거나 `reduced-motion`이면 처음부터 보인다.
- 모바일(≤640)에서는 번호가 표제 위에 단독으로 선다(168px).

### `.spread` — 펼침면 두 쪽 + 가운데 책 접힘
```html
<section class="spread">
  <div class="spread__page">왼쪽 쪽</div>
  <div class="spread__fold" aria-hidden="true"></div>
  <div class="spread__page">오른쪽 쪽</div>
</section>
```
≤900px에서는 한 쪽씩 세로로 쌓이고 접힘은 12px 가로 띠가 된다.

### 그 밖의 프리미티브
- `.wrap`(최대 1160 + 좌우 48/16) · `.wrap--ledger`(장부 1016 폭) · `.stack`(`--stack` 간격) · `.cluster`(`--cluster` 간격) · `.split`
- `.ruled`(32px 바탕 괘선, 필사 본문 배경) · `.hatch`(45° 해칭 면) · `.double-rule`(위 3px 이중 괘)
- `.leader` + `.leader__fill`: 차례의 점선 리더 → `<a class="leader" href="#ch1"><span class="t-numeral …">I</span><span>잉크와 안료</span><span class="leader__fill"></span><span>3쪽</span></a>`
- `.figure` / `.figure__plate` / `.figure__cap` — 캡션은 `<b>도판 4-2</b>열람 신청서 (열린 상태)` 형식으로 쓴다.

### `.desk` — 업무 도구 셸 (dashboard · inbox · kanban · settings)
```html
<div class="desk">
  <aside class="desk__side" id="desk-side" aria-label="업무 서랍"> <!-- 3절 사이드바 스니펫 --> </aside>
  <main class="desk__main" id="main">…</main>
</div>
```
사이드바는 264px이고 sticky로 고정된다. ≤900px에서는 사이드바가 왼쪽 서랍(드로어)이 되며, 러닝헤드의 `[data-sidebar-toggle]` 버튼으로 연다(스크림·Esc·포커스 트랩은 JS가 처리한다).

---

## 3. 공통 셸 스니펫 (복사해서 쓴다 — 바꾸는 곳은 주석 표시만)

### 3-1. 러닝헤드 navbar — **index.html 경로**
```html
<header class="runhead">
  <div class="runhead__bar">
    <a class="runhead__mark" href="index.html" aria-label="석루서고 조판 규범 차례로"><span class="runhead__seokru">Seokru</span><span class="runhead__ko">석루서고</span></a>
    <p class="runhead__title"><span class="runhead__no" data-runhead-no aria-hidden="true"></span><span data-runhead-title>조판 규범 · 표제지</span></p>
    <div class="runhead__tools">
      <button class="runhead__search" type="button" data-command-open="shelf-search"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6"/><path d="M15 15l5 5"/></svg><span class="runhead__search-label">서가 검색</span><kbd>⌘K</kbd></button>
      <button class="runhead__tool" type="button" data-theme-toggle><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 11l3-6h8l3 6z"/><path d="M12 11v8M8 19h8"/></svg><span class="runhead__tool-label" data-theme-label>밤 열람실로</span></button>
      <div class="menu-anchor">
        <button class="runhead__tool" type="button" data-menu-trigger="toc-menu" aria-controls="toc-menu" aria-haspopup="true"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h10"/></svg><span class="runhead__tool-label">열람 기록부</span></button>
        <div class="menu" id="toc-menu" role="menu" hidden>
          <p class="menu__label">조판 규범</p>
          <a class="menu__item" role="menuitem" href="index.html" aria-current="page">차례</a>
          <div class="menu__sep" role="separator"></div>
          <p class="menu__label">서고 업무</p>
          <a class="menu__item" role="menuitem" href="pages/dashboard.html">오늘 밤 서고 일지</a>
          <a class="menu__item" role="menuitem" href="pages/inbox.html">서신함</a>
          <a class="menu__item" role="menuitem" href="pages/kanban.html">수선 공방 작업대</a>
          <div class="menu__sep" role="separator"></div>
          <p class="menu__label">회원 서가</p>
          <a class="menu__item" role="menuitem" href="pages/onboarding.html">열람증 발급</a>
          <a class="menu__item" role="menuitem" href="pages/settings.html">열람증 설정</a>
          <a class="menu__item" role="menuitem" href="pages/pricing.html">회원 등급</a>
          <a class="menu__item" role="menuitem" href="pages/product.html">「야장」 필사 노트</a>
          <a class="menu__item" role="menuitem" href="pages/profile.html">진서람의 열람 기록</a>
          <a class="menu__item" role="menuitem" href="pages/404.html">빈 서가</a>
        </div>
      </div>
    </div>
  </div>
</header>
```

### 3-2. 러닝헤드 navbar — **pages/*.html 경로**
index 스니펫과 같다. 다른 곳은 다음 다섯 군데뿐이다.
```html
<header class="runhead">
  <div class="runhead__bar">
    <a class="runhead__mark" href="../index.html" aria-label="석루서고 조판 규범 차례로"><span class="runhead__seokru">Seokru</span><span class="runhead__ko">석루서고</span></a>
    <!-- ① 가운데 제목: 이 페이지 이름(아래 표). 번호는 ¶ -->
    <p class="runhead__title"><span class="runhead__no runhead__no--mark" aria-hidden="true"></span><span>오늘 밤 서고 일지</span></p>
    <div class="runhead__tools">
      <!-- ② 업무 도구 4장(dashboard · inbox · kanban · settings)만: 사이드바 열기 버튼을 맨 앞에 추가 -->
      <button class="runhead__tool runhead__side-toggle" type="button" data-sidebar-toggle aria-controls="desk-side" aria-label="업무 서랍 열기"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="5" width="16" height="14"/><path d="M4 12h16M10 8.5h4M10 15.5h4"/></svg></button>
      <button class="runhead__search" type="button" data-command-open="shelf-search"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6"/><path d="M15 15l5 5"/></svg><span class="runhead__search-label">서가 검색</span><kbd>⌘K</kbd></button>
      <button class="runhead__tool" type="button" data-theme-toggle><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 11l3-6h8l3 6z"/><path d="M12 11v8M8 19h8"/></svg><span class="runhead__tool-label" data-theme-label>밤 열람실로</span></button>
      <div class="menu-anchor">
        <button class="runhead__tool" type="button" data-menu-trigger="toc-menu" aria-controls="toc-menu" aria-haspopup="true"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h10"/></svg><span class="runhead__tool-label">열람 기록부</span></button>
        <div class="menu" id="toc-menu" role="menu" hidden>
          <p class="menu__label">조판 규범</p>
          <a class="menu__item" role="menuitem" href="../index.html">차례</a>
          <div class="menu__sep" role="separator"></div>
          <p class="menu__label">서고 업무</p>
          <!-- ③ 현재 페이지 항목에만 aria-current="page" -->
          <a class="menu__item" role="menuitem" href="dashboard.html" aria-current="page">오늘 밤 서고 일지</a>
          <a class="menu__item" role="menuitem" href="inbox.html">서신함</a>
          <a class="menu__item" role="menuitem" href="kanban.html">수선 공방 작업대</a>
          <a class="menu__item" role="menuitem" href="settings.html">열람증 설정</a>
          <div class="menu__sep" role="separator"></div>
          <p class="menu__label">회원 서가</p>
          <a class="menu__item" role="menuitem" href="onboarding.html">열람증 발급</a>
          <a class="menu__item" role="menuitem" href="pricing.html">회원 등급</a>
          <a class="menu__item" role="menuitem" href="product.html">「야장」 필사 노트</a>
          <a class="menu__item" role="menuitem" href="profile.html">진서람의 열람 기록</a>
          <a class="menu__item" role="menuitem" href="404.html">빈 서가</a>
        </div>
      </div>
    </div>
  </div>
</header>
```
④ 경로는 `../index.html`과 같은 폴더의 `*.html`이다. ⑤ 메뉴 `aria-current`는 페이지마다 하나뿐이다.

| 페이지 | 러닝헤드 가운데 제목 · `<title>` 앞부분 |
|---|---|
| dashboard | 오늘 밤 서고 일지 |
| inbox | 서신함 |
| kanban | 수선 공방 작업대 |
| settings | 열람증 설정 |
| onboarding | 열람증 발급 |
| pricing | 회원 등급 |
| product | 「야장」 필사 노트 |
| profile | 진서람의 열람 기록 |
| 404 | 빈 서가 |

### 3-3. 간기 푸터 — **index.html 전용** (간기 `Explicit` 문단은 필사본인 index에만)
```html
<footer class="colophon">
  <div class="colophon__inner">
    <p class="colophon__explicit"><span class="black">Explicit</span>이 필사본은 2026년 10월 22일 목요일 밤 11시 10분, 정동 석루관 대열람실 사서 데스크에서 채이수가 마쳤다. 감수 한도경.</p>
    <div class="colophon__cols">
      <p><span class="colophon__head">석루서고</span>서울특별시 중구 정동길 41-9 석루관<br>02-735-1931 · desk@seokru.kr</p>
      <p><span class="colophon__head">야간 열람실</span>화–토 18:00–02:00 (입실 마감 00:30)<br>일·월 휴관</p>
      <p><span class="colophon__head">수선 공방 접수</span>수·토 13:00–17:00<br>귀중본 사전 열람 예약제</p>
    </div>
    <nav class="colophon__links" aria-label="열람 기록부">
      <a href="index.html" aria-current="page">차례</a>
      <a href="pages/dashboard.html">서고 일지</a>
      <a href="pages/inbox.html">서신함</a>
      <a href="pages/kanban.html">수선 공방</a>
      <a href="pages/onboarding.html">열람증 발급</a>
      <a href="pages/settings.html">열람증 설정</a>
      <a href="pages/pricing.html">회원 등급</a>
      <a href="pages/product.html">야장 노트</a>
      <a href="pages/profile.html">열람 기록</a>
      <a href="pages/404.html">빈 서가</a>
    </nav>
    <p class="colophon__fine">© 2026 석루서고 · <span class="call">BIBLIOTHECA SEOKRU</span> · 1931 준공 · 2021 개관</p>
  </div>
</footer>
```

### 3-4. 페이지 푸터 — **pages/*.html 경로** (간기 없음)
pages 9장은 필사본이 아니므로 간기 문장을 쓰지 않는다. 주소 · 열람 시간 · 수선 접수 · 내비 · ©만 두고, 맨 위에 페이지별 기록 한 줄(`colophon__record`, `data-record`=페이지 이름)을 둔다.
```html
<footer class="colophon">
  <div class="colophon__inner">
    <!-- ① 페이지별 기록 한 줄 — 아래 표의 문구 그대로 -->
    <p class="colophon__record" data-record="dashboard">26.10.22 23:10 기록 · 야간 사서 채이수 (L-07)</p>
    <div class="colophon__cols">
      <p><span class="colophon__head">석루서고</span>서울특별시 중구 정동길 41-9 석루관<br>02-735-1931 · desk@seokru.kr</p>
      <p><span class="colophon__head">야간 열람실</span>화–토 18:00–02:00 (입실 마감 00:30)<br>일·월 휴관</p>
      <p><span class="colophon__head">수선 공방 접수</span>수·토 13:00–17:00<br>귀중본 사전 열람 예약제</p>
    </div>
    <!-- ② 현재 페이지 링크에만 aria-current="page" -->
    <nav class="colophon__links" aria-label="열람 기록부">
      <a href="../index.html">차례</a>
      <a href="dashboard.html">서고 일지</a>
      <a href="inbox.html">서신함</a>
      <a href="kanban.html">수선 공방</a>
      <a href="onboarding.html">열람증 발급</a>
      <a href="settings.html">열람증 설정</a>
      <a href="pricing.html">회원 등급</a>
      <a href="product.html">야장 노트</a>
      <a href="profile.html">열람 기록</a>
      <a href="404.html">빈 서가</a>
    </nav>
    <p class="colophon__fine">© 2026 석루서고 · <span class="call">BIBLIOTHECA SEOKRU</span> · 1931 준공 · 2021 개관</p>
  </div>
</footer>
```

| 페이지 | `data-record` 문구 |
|---|---|
| dashboard | 26.10.22 23:10 기록 · 야간 사서 채이수 (L-07) |
| inbox | 서신함 · 26.10.22 23:10 기준 · 야간 사서 채이수 |
| kanban | 수선 기록 · 26.10.22 23:10 · 담당 모윤재 |
| settings | 열람증 석-1187 · 26.10.21 가입 · 다음 결제 11.21 |
| onboarding | 열람증 발급 창구 · 26.10.22 23:10 |
| pricing | 회원 등급 · 2026년 10월 기준 · 부가세 포함 |
| product | 석루서고 상점 · 평일 15시 전 주문 당일 발송 |
| profile | 열람 기록 · 진서람 석-0412 · 26.10.22 23:10 기준 |
| 404 | 빈 자리 기록 · 26.10.22 23:10 · 사서 데스크 채이수 |

index의 간기(12구역)는 3-3 푸터가 맡는다. 간기 문장은 바꾸지 않고, pages에는 옮겨 쓰지 않는다.

### 3-5. 카드 서랍 사이드바 (업무 서랍) — **사서 업무 도구 3장 전용: dashboard · inbox · kanban** (index에는 쓰지 않음)
```html
<aside class="desk__side" id="desk-side" aria-label="업무 서랍">
  <nav class="cabinet" aria-label="업무 도구">
    <div class="cabinet__head">
      <span class="seal seal--staff" aria-hidden="true">채</span>
      <span class="cabinet__who"><span class="cabinet__name">채이수</span><span class="cabinet__role">야간 사서 · <span class="call">L-07</span></span></span>
      <button class="cabinet__close" type="button" data-sidebar-close aria-label="업무 서랍 닫기"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button>
    </div>
    <p class="cabinet__group">업무 서랍</p>
    <ul class="cabinet__list">
      <!-- 현재 페이지 서랍에만 aria-current="page" -->
      <li><a class="cabinet__drawer" href="dashboard.html" aria-current="page"><span class="cabinet__plaque">서고 일지</span><span class="count" aria-label="신청 대기 5건">5</span><span class="knob" aria-hidden="true"></span></a></li>
      <li><a class="cabinet__drawer" href="inbox.html"><span class="cabinet__plaque">서신함</span><span class="count" aria-label="편지 8통">8</span><span class="knob" aria-hidden="true"></span></a></li>
      <li><a class="cabinet__drawer" href="kanban.html"><span class="cabinet__plaque">수선 공방</span><span class="count count--quiet" aria-label="진행 9건">9</span><span class="knob" aria-hidden="true"></span></a></li>
      <li><a class="cabinet__drawer" href="settings.html"><span class="cabinet__plaque">열람증 설정</span><span class="knob" aria-hidden="true"></span></a></li>
    </ul>
    <p class="cabinet__group">회원 서가</p>
    <ul class="cabinet__list">
      <li><a class="cabinet__drawer" href="../index.html"><span class="cabinet__plaque">조판 규범</span><span class="knob" aria-hidden="true"></span></a></li>
      <li><a class="cabinet__drawer" href="profile.html"><span class="cabinet__plaque">열람 기록</span><span class="knob" aria-hidden="true"></span></a></li>
    </ul>
    <div class="cabinet__foot"><strong>10월 22일 목요일 23:10</strong><br>대열람실 19 / 24 · 귀중본실 4 / 6<br>수장고 19.4 ℃ · 48 %</div>
  </nav>
</aside>
```
- **업무 서랍(위 스니펫)은 사서가 로그인한 dashboard · inbox · kanban 3장에만 쓴다.** 회원이 로그인한 settings에는 아래 3-5b "회원 서랍"을 쓴다. 회원 화면에 사서 업무 서랍·서고 현황을 보이지 않는다.

### 3-5b. 회원 서랍 — **settings 전용** (회원 은가람 로그인)
```html
<aside class="desk__side" id="desk-side" aria-label="회원 서랍">
  <nav class="cabinet cabinet--member" aria-label="회원 메뉴">
    <div class="cabinet__head">
      <span class="seal seal--member" aria-hidden="true">은</span><span class="cabinet__who"><span class="cabinet__name">은가람</span><span class="cabinet__role">열람 회원 · <span class="call">석-1187</span></span></span>
      <button class="cabinet__close" type="button" data-sidebar-close aria-label="회원 서랍 닫기"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button>
    </div>
    <p class="cabinet__group">회원 서랍</p>
    <ul class="cabinet__list">
      <li><a class="cabinet__drawer" href="settings.html" aria-current="page"><span class="cabinet__plaque">열람증 설정</span><span class="knob" aria-hidden="true"></span></a></li>
      <li><a class="cabinet__drawer" href="profile.html"><span class="cabinet__plaque">열람 기록</span><span class="knob" aria-hidden="true"></span></a></li>
      <li><a class="cabinet__drawer" href="pricing.html"><span class="cabinet__plaque">회원 등급</span><span class="knob" aria-hidden="true"></span></a></li>
      <li><a class="cabinet__drawer" href="../index.html"><span class="cabinet__plaque">조판 규범</span><span class="knob" aria-hidden="true"></span></a></li>
    </ul>
    <div class="cabinet__foot"><strong>다음 결제 11/21 토 ₩15,000</strong><br>오늘 밤 신청 <span class="call">RQ-261022-09</span> · A3</div>
  </nav>
</aside>
```
러닝헤드의 서랍 열기 버튼 `aria-label`은 "회원 서랍 열기"로 바꾼다. 개수 배지(count)는 회원 서랍에 두지 않는다.
- 회원용 5장(onboarding · pricing · product · profile · 404)에는 사이드바를 두지 않고 `.folio`/`.spread` 판면으로 짠다.

### 3-6. 서가 검색 카드 — 모든 HTML의 body 끝 (⌘K)
```html
<div class="command" id="shelf-search" data-command hidden>
  <div class="command__scrim" data-close></div>
  <div class="command__card" role="dialog" aria-modal="true" aria-label="서가 검색">
    <div class="command__bar">
      <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6"/><path d="M15 15l5 5"/></svg>
      <input class="command__input" type="text" placeholder="서명 · 청구기호 · 등록번호" aria-label="서가 검색어" aria-controls="shelf-search-list" data-autofocus>
      <kbd>Esc</kbd>
    </div>
    <ul class="command__list" id="shelf-search-list" role="listbox" aria-label="검색 결과">
      <li class="command__group" role="presentation">장서</li>
      <li class="command__item" role="option" data-keywords="frankenstein 셸리 SR-0018442"><span class="command__call">W 823.7 S545f</span><span class="command__name">『프랑켄슈타인』<span class="book">Frankenstein</span></span><span class="command__where">R2 열람 중</span></li>
      <li class="command__item" role="option" data-keywords="dracula 스토커 SR-0019006"><span class="command__call">W 823.8 S874d</span><span class="command__name">『드라큘라』<span class="book">Dracula</span></span><span class="command__where">귀중본 · 신청제</span></li>
      <li class="command__item" role="option" data-keywords="연암집 박지원 SR-0007702"><span class="command__call">古 811.98 박79ㅇ v.3</span><span class="command__name">『연암집』 권3 필사본</span><span class="command__where">수선 중</span></li>
      <li class="command__item" role="option" data-keywords="secret history 타트 SR-0031904"><span class="command__call">W 813.54 T194s</span><span class="command__name">『비밀의 계절』<span class="book">The Secret History</span></span><span class="command__where">열람 가능</span></li>
      <li class="command__group" role="presentation">서고의 방</li>
      <li class="command__item" role="option" data-href="pages/dashboard.html" data-keywords="일지 대시보드"><span class="command__call command__call--room" aria-hidden="true">¶</span><span class="command__name">오늘 밤 서고 일지</span><span class="command__where">업무 도구</span></li>
      <li class="command__item" role="option" data-href="pages/kanban.html" data-keywords="수선 공방 칸반"><span class="command__call command__call--room" aria-hidden="true">¶</span><span class="command__name">수선 공방 작업대</span><span class="command__where">업무 도구</span></li>
    </ul>
    <p class="command__empty" hidden>이 청구기호의 책은 서가에 없습니다.<span class="hand">다른 서가에 꽂혀 있을 수 있음</span></p>
    <div class="command__foot"><span>↑↓ 이동</span><span>Enter 열기</span><span>Esc 닫기</span></div>
  </div>
</div>
```
pages에서는 `data-href` 경로를 `dashboard.html`처럼 같은 폴더 기준으로 바꾼다. `data-href`가 없는 장서 항목을 고르면 "서가 위치를 찾았습니다" 토스트가 뜬다.

---

## 4. 컴포넌트 32 (가나다 아님 — 파일명 순)

### accordion — 열람 규칙 조문
```html
<div class="accordion" data-accordion="single">   <!-- 여러 개 열기: data-accordion -->
  <div class="accordion__item">
    <h3 class="accordion__head"><button class="accordion__btn" type="button" id="rule-1-h" aria-expanded="true" aria-controls="rule-1">
      <span class="accordion__no">제1조</span><span class="accordion__title">연필만 쓴다</span><span class="accordion__mark" aria-hidden="true"></span>
    </button></h3>
    <div class="accordion__panel" id="rule-1" role="region" aria-labelledby="rule-1-h">
      <div class="accordion__inner"><div class="accordion__body"><p>잉크·만년필·형광펜은 대열람실 입구 서랍 사물함에 맡긴다.</p></div></div>
    </div>
  </div>
</div>
```
`.accordion__no` 뒤에 " ¶"가 자동으로 붙는다. 비활성 조문은 버튼에 `disabled`를 준다. 열림 상태는 JS가 `.is-open`과 `aria-expanded`를 맞춘다.

### alert — 경고
```html
<div class="alert alert--warn" role="status">
  <svg class="icon alert__icon" viewBox="0 0 24 24" aria-hidden="true">…물방울…</svg>
  <div class="alert__body"><b class="alert__title">수장고 습도 53 % 감지</b><p class="alert__text">10/20 11:20 · 제습 후 48 %로 돌아왔습니다.</p>
    <div class="alert__actions"><a href="dashboard.html">환경 기록 보기</a></div></div>
  <button class="alert__close" type="button" aria-label="경고 닫기" data-dismiss><svg class="icon icon--sm" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button>
</div>
```
변형은 `--danger`(주서, `role="alert"`) · `--warn`(석웅황) · `--info`(석청) · `--ok`(녹청) · `--band`(페이지 맨 위 띠)이다.

### badge — 날짜도장 · 숫자 · 밀랍 인장
```html
<span class="stamp stamp--ok">열람 가능</span>
<span class="stamp stamp--lent stamp--tilt-c">대출 중</span>
<span class="stamp stamp--rare stamp--tilt-a">귀중본</span>
<span class="stamp stamp--repair">수선 중</span>
<span class="stamp stamp--info">복제 중</span>
<span class="stamp stamp--date">26.10.22</span>           <!-- 날짜·시각·연도: --date(숫자만 자간) -->
<span class="stamp stamp--muted stamp--sm">대기</span>
<span class="count">5</span> <span class="count count--quiet">9</span>
<span class="seal seal--staff">채</span> <span class="seal seal--member">진</span> <span class="seal seal--patron">남</span>
<span class="who"><span class="seal seal--staff seal--sm" aria-hidden="true">한</span><span><span class="who__name">한도경</span><span class="who__role">서고장 · 서지학자</span></span></span>
```
- 크기는 `--sm` · `--lg`, 기울기는 `--tilt-a`(−4°) `--tilt-b`(−1.5°) `--tilt-c`(+1°) `--tilt-d`(+2°) `--flat`이다. 기본은 −3°이며, 한 줄에 여러 개를 놓을 때는 기울기를 섞는다.
- 상태 색: 열람 가능·반납 완료·승인 = `--ok` · 대출 중·열람 중 = `--lent` · 귀중본·반려 = `--rare` · 수선 중·경보 = `--repair` · 예약·복제 중 = `--info`. **연도는 상태가 아니므로** 표에서는 `.call` 텍스트로 쓴다. 연도에 도장을 쓰는 곳은 타임라인뿐이다.
- 인장: 서고 직원 = `--staff` · 회원 = `--member` · 후원 장서인 = `--patron`(금박 테두리). 크기는 `--sm` 28 · 기본 40 · `--lg` 64 · `--xl` 96이다.
- `.stamp-row`는 도장 여러 개를 놓는 줄이다. 찍히는 순간을 보여 주려면 JS로 `.is-stamping`을 붙인다.

### breadcrumb — 러닝헤드형
```html
<nav class="crumbs" aria-label="현재 위치"><ol class="crumbs__list">
  <li class="crumbs__item"><a href="../index.html">석루서고</a></li>
  <li class="crumbs__item"><a href="dashboard.html">귀중본실</a></li>
  <li class="crumbs__item"><span aria-current="page">『프랑켄슈타인』</span></li>
</ol></nav>
```

### button
```html
<button class="btn btn--primary" type="button">열람 신청</button>
<button class="btn btn--secondary" type="button">서가 위치 보기</button>
<button class="btn btn--ghost" type="button">신청 취소</button>
<button class="btn btn--danger" type="button">열람증 반납</button>
<button class="btn btn--danger-line" type="button">신청 철회</button>
<button class="btn btn--primary" type="button" aria-busy="true">불러오는 중</button>   <!-- 램프 갓 맥동 -->
<button class="btn btn--primary" type="button" disabled>마감됨</button>
<button class="btn btn--secondary btn--icon" type="button" aria-label="닫기"><svg class="icon" …/></button>
<button class="btn btn--secondary" type="button" aria-pressed="true">창가 자리</button>
```
- 크기: 기본 44 · `--sm` 36(**밀집 표 안에서만**) · `--lg` 52. 그 밖에 `--block`(전폭), `.btn-row`(`--end`)가 있다.
- 로딩 시연: `data-busy-demo="1600"` + 안쪽 `<span data-busy-label>…</span>`. `data-toast*`를 함께 주면 로딩이 끝난 뒤 토스트가 뜬다.
- `.ink-block` 안의 보조·고스트 버튼은 색이 자동으로 바뀐다.

### calendar — 열람 달력
```html
<div class="cal" data-calendar>
  <div class="cal__head">
    <button class="cal__nav" type="button" aria-label="9월"><svg class="icon" …이전…/></button>
    <h3 class="cal__title">2026년 10월</h3>
    <button class="cal__nav" type="button" aria-label="11월"><svg class="icon" …다음…/></button>
  </div>
  <table class="cal__grid">
    <thead><tr><th scope="col">일</th><th scope="col">월</th><th scope="col">화</th><th scope="col">수</th><th scope="col">목</th><th scope="col">금</th><th scope="col">토</th></tr></thead>
    <tbody>
      <tr><td class="cal__cell--out"></td><td class="cal__cell--out"></td><td class="cal__cell--out"></td><td class="cal__cell--out"></td>
          <td><button class="cal__day" type="button" aria-label="10월 1일 목요일">1</button></td>
          <td><button class="cal__day cal__day--read" type="button" aria-label="10월 2일 금요일, 열람함">2</button></td>
          <td><button class="cal__day" type="button" aria-label="10월 3일 토요일 개천절">3</button></td></tr>
      <tr><td class="cal__cell--closed"><button class="cal__day cal__day--closed" type="button" disabled aria-label="10월 4일 일요일 휴관">4</button></td> …
      … <td><button class="cal__day cal__day--today cal__day--read" type="button" aria-current="date" aria-label="10월 22일 목요일, 오늘">22</button></td> …
    </tbody>
  </table>
  <div class="cal__legend"><span><i class="cal__key cal__key--closed"></i>휴관</span><span><i class="cal__key cal__key--read"></i>열람한 날</span><span><i class="cal__key cal__key--today"></i>오늘</span></div>
  <p class="cal__output" data-cal-output>날짜를 고르십시오.</p>
</div>
```
2026년 10월은 목요일(1일)에 시작한다. 휴관일은 일·월(4·5·11·12·18·19·25·26)이고 `cal__cell--closed` + 버튼 `disabled`로 표시한다. 행사(필사회)가 있는 날은 `--event`, 선택한 날은 `aria-selected="true"`(JS)로 표시하며, 방향키로 날짜를 옮길 수 있다.

### card — 장서 카드 (시그니처 1)
```html
<article class="card">
  <span class="card__call"><span>W 823.7</span> <span>S545f</span></span>
  <span class="card__entry">Shelley, Mary Wollstonecraft, 1797–1851.</span>
  <div class="card__body">
    <p class="card__indent">Frankenstein; or, The Modern Prometheus.</p>
    <p class="card__indent ko">프랑켄슈타인 — 개정판. 런던: Colburn &amp; Bentley, 1831.</p>
    <p class="card__indent">xii, 202 p. : 권두화 1장 ; 17 cm.</p>
    <p class="card__indent card__note ko">주기: 저자 서문 신판 수록. 1950년 수해 흔적, 2022년 재제책(모윤재).</p>
    <p class="card__indent ko">1. 고딕 소설  2. 영국 문학 — 19세기   I. 서명</p>
  </div>
  <div class="card__foot"><span class="card__regno">SR-0018442</span><span class="card__holder">석루서고</span></div>
  <span class="stamp stamp--date card__stamp stamp--tilt-a">26.10.22</span>       <!-- 선택 -->
  <span class="card__pencil">권두화 접힘 주의 — 받침대 30° 이하</span>            <!-- 선택, 연필 메모 -->
</article>
```
- 청구기호는 **두 개의 `<span>`**으로 쓴다(데스크톱에서는 두 줄, ≤640에서는 한 줄 머리). 카드 안 한글 문장에는 `ko` 클래스를 붙여 타자체(Nanum Gothic Coding)로 쓴다.
- 비율은 5:3 가로형이고, 내용이 넘치면 카드가 늘어난다. ≤640에서는 청구기호가 위로 올라가고 도장·연필 메모는 흐름 안으로 들어간다.
- 변형:
  - `--plain`: 청구기호 열이 없는 카드
  - `--auto`: 비율 해제
  - `--tilt`: −2°, 표제지에 끼운 카드
  - `--lifted`: 들린 그림자
  - `--interactive` 또는 `a.card`: hover·focus 때 2px 들림
  - `--no-hole`: 막대 구멍 없음
- 상태: `aria-selected="true"`/`.is-selected`(주서 외곽) · `aria-disabled="true"` · `.is-error`
- **세로 색인 카드** `card--index` (3:5, 위로 솟은 탭):
  `<article class="card card--index"><span class="card__tab">UI 007</span><span class="card__call">UI 007</span><div class="card__body">…</div></article>` · 탭 위치는 `style="--tab-x:96px"`로 정한다.
- **대출카드** `card--loan` (줄 친 열람 기록표):
```html
<div class="card card--loan">
  <div class="loan__head"><span class="loan__title">대출카드</span><span class="call">W 823.7 S545f</span></div>
  <table class="loan__table">
    <thead><tr><th scope="col">날짜</th><th scope="col">열람자</th><th scope="col">좌석</th></tr></thead>
    <tbody>
      <tr><td><span class="stamp stamp--sm stamp--date stamp--tilt-b">26.09.18</span></td><td>진서람</td><td class="call">R2</td></tr>
      <tr class="is-now"><td><span class="stamp stamp--sm stamp--date">26.10.22</span></td><td>진서람 (열람 중)</td><td class="call">R2</td></tr>
      <tr class="loan__empty" aria-hidden="true"><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>     <!-- 빈 줄: 스크린리더에서 숨긴다 -->
    </tbody>
  </table>
</div>
```
- **쪽지 카드** `card--slip`: 구멍과 비율이 없는 작은 면이다.

**서랍 속 겹친 카드** `.cardstack` (index 6구역 카드 서랍, list 대용)
```html
<section class="case">
  <div class="case__front"><span class="knob" aria-hidden="true"></span><span class="plaque"><span class="call">UI 001–032</span>석루서고 조판 규범</span><span class="knob" aria-hidden="true"></span></div>
  <div class="case__well">
    <div class="cardstack" style="--card-h:320px">
      <article class="card cardstack__item">
        <button class="cardstack__tab" type="button" aria-controls="ui-005-body"><span>UI 005 · <span class="ko">버튼(button)</span></span><span class="stamp stamp--sm stamp--date">9쪽</span></button>
        <div class="card__body type ko" id="ui-005-body">…정의 · 작은 실물 시연 · 용례 링크…</div>
        <div class="card__foot"><span class="card__regno">UI 005</span><span class="card__holder">석루서고</span></div>
      </article>
      <article class="card cardstack__item is-pulled">…처음부터 당겨진 카드 1장…</article>
    </div>
  </div>
</section>
```
카드마다 위 36px(모바일 44px) 띠만 보이도록 겹친다. 띠(버튼)를 누르면 그 카드가 당겨져 전체가 보이고, 나머지 카드는 불투명도가 0.6으로 내려간다. 한 서랍에서 당길 수 있는 카드는 한 장이다. 카드 높이는 `--card-h`로 지정하고, 내용은 그 높이 안에 넣는다. `.case`(참나무 서랍 몸체), `.plaque`(놋쇠 명패), `.knob`(손잡이)는 다른 곳에서도 쓸 수 있다.

### carousel — 신착 고서 넘기기
```html
<div class="carousel" data-carousel tabindex="0" aria-roledescription="서가" aria-label="신착 고서">
  <div class="carousel__shelf">
    <button class="carousel__spine" type="button" style="--h:250px;--w:54px">비밀의 계절</button>
    <button class="carousel__spine carousel__spine--rubric" type="button" style="--h:220px;--w:46px">드라큘라</button>
    <button class="carousel__spine carousel__spine--wood" type="button" style="--h:270px;--w:60px">실낙원 1</button>
    <button class="carousel__spine carousel__spine--vellum" type="button" style="--h:200px;--w:42px">규합총서</button>
    <button class="carousel__spine carousel__spine--lapis" type="button" style="--h:236px;--w:50px">오트란토 성</button>
  </div>
  <div class="carousel__stage">
    <div class="carousel__slide" data-title="『비밀의 계절』" role="group" aria-roledescription="책">
      <div class="carousel__cover"><svg viewBox="0 0 200 300" aria-hidden="true">…표지(style="stroke:currentColor")…</svg></div>
      <article class="card card--plain card--auto">…</article>
    </div>
    <div class="carousel__slide" data-title="『드라큘라』" role="group" aria-roledescription="책" hidden>…</div>
    …
    <div class="carousel__controls">
      <button class="btn btn--secondary btn--icon" type="button" data-carousel-prev aria-label="이전 책">…</button>
      <span class="carousel__count" data-carousel-count>1 / 5</span>
      <button class="btn btn--secondary btn--icon" type="button" data-carousel-next aria-label="다음 책">…</button>
      <span class="carousel__name" data-carousel-name></span>
      <span class="sr-only" aria-live="polite" data-carousel-live></span>
    </div>
  </div>
</div>
```
책등 순서와 슬라이드 순서를 맞춘다. 책등을 누르거나 ← → 키를 누르면 넘어가고, 현재 책등에는 `aria-current="true"`가 붙는다. 책등 색 변형: 기본 잉크 · `--rubric` · `--wood` · `--lapis` · `--verdigris` · `--vellum`.

### code — 필사 원문
```html
<div class="code">
  <div class="code__head"><span>원문 · <span class="code__file">tokens.css</span></span><button class="code__copy" type="button" data-copy><span data-copy-label>베끼기</span></button></div>
  <pre><code><span class="code__line"><span class="code__c">/* 필사본 2색 */</span></span><span class="code__line"><span class="code__k">--ink</span>: <span class="code__v">#1E1912</span>;</span></code></pre>
</div>
```
줄마다 `.code__line`으로 감싸면 왼쪽에 주서 줄 번호가 붙는다. `.code__c`는 주석, `.code__k`는 속성 이름, `.code__v`는 값이다. 복사하면 "베꼈습니다"가 표시된다. 본문 속 짧은 코드는 `<code>`, 키 표기는 `<kbd>`로 쓴다.

### command — 서가 검색 카드
3-6 스니펫을 쓴다. **정적 열린 견본**(index 도판 4-3)은 루트를 `<div class="command command--static" data-command id="shelf-search-sample">`로 바꾸고, `hidden`·스크림을 빼고, 카드를 `role="group" aria-label="서가 검색 견본"`으로 둔다. 견본 안에서도 입력하면 실제로 걸러진다. 옆에 `<button class="btn btn--secondary" type="button" data-command-open="shelf-search">⌘K로 실제 열기</button>`를 둔다.

### drawer — 반납함 트레이
```html
<button class="btn btn--secondary" type="button" data-drawer-open="return-tray">반납함 열기</button>

<div class="drawer" id="return-tray" hidden>
  <div class="drawer__scrim" data-close></div>
  <div class="drawer__panel" role="dialog" aria-modal="true" aria-labelledby="return-tray-t">
    <div class="drawer__head"><span class="knob" aria-hidden="true"></span><h2 class="drawer__title" id="return-tray-t">오늘 밤 반납함 · 4책</h2>
      <button class="drawer__close" type="button" data-close aria-label="반납함 닫기"><svg class="icon" …닫기…/></button></div>
    <div class="drawer__body"> <!-- .list 또는 .card 여러 장 --> </div>
    <div class="drawer__foot"><button class="btn btn--ghost" type="button" data-close>나중에</button><button class="btn btn--primary" type="button" data-toast="ok" data-toast-title="반납을 기록했습니다">반납 기록</button></div>
  </div>
</div>
```
오른쪽에서 열리고, ≤640에서는 아래에서 올라온다. Esc를 누르거나 스크림을 누르면 닫히고, 포커스는 서랍 안에 갇혔다가 닫힌 뒤 여는 버튼으로 돌아간다. 정적 견본은 `.drawer--static`으로 만들고 `hidden`과 스크림을 빼며, 패널에는 `role="group"`을 준다.

### empty — 빈 서랍
```html
<div class="empty">
  <div class="empty__card" aria-hidden="true"><span class="empty__call">청구기호: —</span><span class="empty__line"></span><span class="empty__line"></span><span class="empty__line"></span></div>
  <p class="empty__title">이 서랍에는 아직 카드가 없습니다</p>
  <p class="empty__text">첫 열람 기록이 생기면 이 자리에 대출카드가 꽂힙니다.</p>
  <p class="hand">아직 아무도 꺼내 보지 않은 서랍</p>
  <button class="btn btn--secondary" type="button">첫 카드 쓰기</button>
</div>
```
`.empty--compact` 변형이 있다. 행동 버튼은 하나만 둔다.

### form — 열람 신청서
```html
<form class="form form--two" data-validate novalidate
      data-toast="ok" data-toast-title="열람 신청을 받았습니다" data-toast-text="RQ-261022-09 · 대열람실 A3">
  <p class="alert alert--danger" data-form-summary role="alert" hidden></p>
  <div class="field">
    <label class="field__label" for="rq-member">회원번호<span class="fn">1</span></label>
    <input class="input input--type" id="rq-member" name="member" required aria-describedby="rq-member-help" value="석-1187">
    <p class="field__help" id="rq-member-help"><span class="fn">1</span>열람증 앞면 왼쪽 위의 번호.</p>
    <p class="field__error"></p>
  </div>
  <div class="field">
    <label class="field__label" for="rq-call">청구기호<span class="fn">2</span><span class="field__req" aria-hidden="true">*</span></label>
    <input class="input input--type" id="rq-call" required data-error="청구기호를 적어 주십시오. 장서 카드 왼쪽 위에 있습니다." placeholder="W 813.54 T194s">
    <p class="field__help"><span class="fn">2</span>모르면 서가 검색(⌘K)으로 찾는다.</p>
    <p class="field__error"></p>
  </div>
  <div class="field">
    <label class="field__label" for="rq-seat">열람석</label>
    <div class="select-wrap"><select class="select" id="rq-seat"><option>대열람실 A3 · 창가</option><option>귀중본실 R1</option></select></div>
  </div>
  <div class="field field--wide"><label class="field__label" for="rq-why">열람 목적 <span class="field__opt">(선택)</span></label><textarea class="textarea" id="rq-why"></textarea></div>
  <fieldset class="fieldset"><legend class="fieldset__legend">서약</legend>
    <div class="choice-group choice-group--row">
      <label class="choice"><input class="check" type="checkbox" required> 연필만 쓴다</label>
      <label class="choice"><input class="radio" type="radio" name="side" checked> 창가 자리</label>
      <label class="choice"><input class="check" type="checkbox" disabled> 촬영 <span class="choice__hint">귀중본 불가</span></label>
    </div>
  </fieldset>
  <label class="switch"><input class="switch__input" type="checkbox" role="switch" checked> 반납 30분 전 알림 <span class="switch__state" data-switch-state data-on="켜짐" data-off="꺼짐">켜짐</span></label>
  <div class="signline"><span class="signline__label">신청인</span><span class="signline__ink">은가람</span></div>
  <div class="form__actions"><button class="btn btn--primary" type="submit">신청서 내기</button><button class="btn btn--ghost" type="reset">다시 쓰기</button><span data-form-stamp="접수"></span></div>
</form>
```
- 오류 상태: JS가 `aria-invalid="true"`와 `.field.is-invalid`를 붙이고 `.field__error`에 `data-error` 문장을 채운다(주서 ✕ + 문장, 도움말 숨김). 정적으로 오류를 보여 줄 때는 이 두 가지와 문장을 직접 넣는다.
- 제출에 성공하면 버튼이 로딩 상태가 되었다가 토스트가 뜨고, `[data-form-stamp]` 자리에 "접수" 도장이 찍힌다.
- 입력 변형: `.input--type`(청구기호·번호 타자체), `.input-affix` + `.input-affix__fix`(₩ · 석- 앞붙임), `disabled`(점선), `readonly`(점선 밑줄)
- `.form--two`는 2단이다(`.field--wide`는 전폭). ≤640에서는 1단이 된다.

### kanban — 수선 공방 작업대
```html
<div class="kanban-wrap">
  <div class="kanban" data-kanban aria-label="수선 공방 공정">
    <section class="kanban__col" aria-labelledby="k-in">
      <header class="kanban__head"><span class="kanban__no" aria-hidden="true">I</span><h3 class="kanban__name" id="k-in">입고</h3><span class="count count--quiet" data-count>2</span></header>
      <ol class="kanban__list">
        <li class="kanban__card" tabindex="0" draggable="true" data-title="『규합총서』" aria-describedby="kanban-help">
          <span class="kanban__id">BD-2026-121</span>
          <h4 class="kanban__title">『규합총서』 필사본</h4>
          <p class="kanban__dmg">실 끊김 · 표지 들뜸</p>
          <div class="kanban__foot">
            <span class="kanban__tagwrap"><span class="kanban__thread" aria-hidden="true"></span><span class="kanban__tag">마감 11.07</span></span>
            <span class="seal seal--staff seal--sm" aria-label="담당 모윤재">모</span>
          </div>
          <div class="kanban__move"><button type="button" data-move="prev">이전 공정</button><button type="button" data-move="next">다음 공정으로</button></div>
        </li>
      </ol>
    </section>
    <!-- 6열: I 입고 · II 상태 진단 · III 해체·세척 · IV 보수·배접 · V 재제책 · VI 반환 대기 -->
  </div>
</div>
<p class="sr-only" id="kanban-help">카드에서 ] 키는 다음 공정, [ 키는 이전 공정입니다.</p>
```
꼬리표 변형은 `--due`(임박, 석웅황)와 `--late`(지연, 주서)이고, 급한 카드에는 `.is-urgent`를 붙인다. 카드를 옮기면 건수(`data-count`)와 이전·다음 버튼의 비활성 상태, 빈 열 표시가 저절로 바뀌고 aria-live로 안내된다. ≤640에서는 열이 가로로 스크롤되고 오른쪽에 페이드가 생긴다.

### list — 서랍 속 카드 행
```html
<ul class="list">
  <li><a class="list__row" href="profile.html">
    <span class="list__call">W 823.7 S545f</span>
    <span class="list__main"><span class="list__title">『프랑켄슈타인』<span class="book">Frankenstein</span></span><span class="list__meta">진서람 · R2 · 반납 01:30</span></span>
    <span class="list__end"><span class="stamp stamp--sm stamp--lent">열람 중</span></span>
  </a></li>
</ul>
```
변형: `.list--seals`는 첫 열을 인장 아바타로 바꾸고(서신함 봉투 목록), `.list--compact`는 행을 줄인다. 상태: `aria-current="true"`/`aria-selected="true"`(주서 왼쪽 괘 + tint), `.is-unread`(¶ + 굵게). 링크나 버튼이 아닌 행에 hover 들림을 주려면 `.list__row--interactive`를 붙인다.

### marquee — 날짜도장 띠
```html
<div class="marquee" data-marquee>
  <div class="marquee__viewport"><div class="marquee__track">
    <ul class="marquee__group">
      <li class="marquee__item"><span class="stamp stamp--sm stamp--date">26.10.22</span>『오트란토 성』 반납 · A16</li>
      <li class="marquee__item"><span class="stamp stamp--sm stamp--date stamp--tilt-c">26.10.22</span>『프랑켄슈타인』 반납 예정 01:30 · R2</li>
    </ul>
    <ul class="marquee__group" aria-hidden="true"> …같은 항목 그대로 복제… </ul>
  </div></div>
  <button class="marquee__toggle" type="button" data-marquee-toggle aria-pressed="false"><span data-marquee-label>정지</span></button>
</div>
```
초당 40px로 흐르며(JS가 띠 폭에 맞춰 계산한다), hover·focus 때 멈춘다. `reduced-motion`에서는 정적인 목록이 된다.

### menu — 쪽지 메뉴
```html
<div class="menu-anchor">
  <button class="btn btn--secondary" type="button" data-menu-trigger="book-menu" aria-controls="book-menu" aria-haspopup="true">이 장서</button>
  <div class="menu" id="book-menu" role="menu" hidden>        <!-- 왼쪽 정렬: .menu--start -->
    <p class="menu__label">이 장서</p>
    <button class="menu__item" role="menuitem" type="button">열람 신청</button>
    <a class="menu__item" role="menuitem" href="profile.html">대출카드 보기<span class="menu__hint">⌘L</span></a>
    <button class="menu__item" role="menuitem" type="button" aria-disabled="true">복제 신청 (귀중본 불가)</button>
    <div class="menu__sep" role="separator"></div>
    <button class="menu__item menu__item--danger" role="menuitem" type="button">신청 철회</button>
  </div>
</div>
```
↑↓ · Home · End로 항목을 옮기고, Esc를 누르면 닫히며 포커스가 트리거로 돌아간다. 바깥을 눌러도 닫힌다. 하나만 고르는 항목은 `role="menuitemradio" aria-checked`로 만들고, 고른 뒤에도 메뉴를 열어 두려면 `data-keep-open`을 준다. 정적 견본은 `.menu--static`에서 `hidden`을 빼고 `aria-label`을 단다.

### modal — 열람 신청 확인서
```html
<button class="btn btn--primary" type="button" data-modal-open="rq-confirm">신청서 확인</button>

<div class="modal" id="rq-confirm" hidden>
  <div class="modal__scrim" data-close></div>
  <div class="modal__card" role="dialog" aria-modal="true" aria-labelledby="rq-confirm-t">
    <header class="modal__head">
      <span class="modal__call">W 813.54
T194s</span>
      <h2 class="modal__title" id="rq-confirm-t">열람 신청 확인서</h2>
      <button class="modal__close" type="button" data-close aria-label="닫기"><svg class="icon" …닫기…/></button>
    </header>
    <div class="modal__body">
      <dl class="modal__rows"><dt>신청 번호</dt><dd>RQ-261022-09</dd><dt>신청자</dt><dd>은가람 석-1187</dd><dt>장서</dt><dd>『비밀의 계절』 SR-0031904</dd><dt>열람석</dt><dd>대열람실 A3 · 22:55</dd></dl>
      <div class="modal__approve"><span class="modal__approve-label">사서 승인</span><span class="modal__stampbox">도장 자리</span></div>
    </div>
    <footer class="modal__foot"><button class="btn btn--secondary" type="button" data-close>취소</button><button class="btn btn--primary" type="button" data-close data-toast="ok" data-toast-title="열람 신청을 받았습니다">신청</button></footer>
  </div>
</div>
```
`.modal__call`은 `white-space: pre-line`이라 줄바꿈이 그대로 두 줄로 보인다. 승인된 상태는 `.modal__stampbox` 안에 `<span class="stamp stamp--ok stamp--tilt-a">승인 26.10.22</span>`를 넣어 표시한다. 변형 `.modal--danger`는 열람증 반납 확인용이다(위 4px 주서). 더 넓은 카드는 `.modal__card--wide`(760)이다. 정적 견본은 `.modal--static`에서 `hidden`과 스크림을 빼고 `role="group"`을 준다. ≤640에서는 아래에서 올라온다.

### motion — 모션 견본 판 (index 제7장)
```html
<div class="motion-board">
  <div class="motion-board__cell">
    <div class="motion-board__stage" id="mv-pull"><div class="motion-pull"><span class="motion-pull__card"></span><span class="motion-pull__card"></span><span class="motion-pull__card"></span></div></div>
    <p class="motion-board__name">카드 당기기</p><p class="motion-board__spec">320ms · ease-ink</p>
    <button class="btn btn--secondary btn--sm" type="button" data-motion-play="mv-pull">재생</button>
  </div>
  <div class="motion-board__cell"><div class="motion-board__stage" id="mv-stamp"><span class="stamp stamp--lg stamp--date">26.10.22</span></div>… data-motion-play="mv-stamp"</div>
  <div class="motion-board__cell"><div class="motion-board__stage" id="mv-ch"><div class="motion-chapter"><span class="motion-chapter__no">VII</span><span class="motion-chapter__title">움직임</span></div></div>… data-motion-play="mv-ch"</div>
  <div class="motion-board__cell"><div class="motion-board__stage"><svg class="lamp lamp--lg motion-lamp" id="mv-lamp" data-motion-toggle viewBox="0 0 36 44" aria-hidden="true">…램프…</svg></div>
    … <button class="btn btn--secondary btn--sm" type="button" data-motion-play="mv-lamp" aria-pressed="false">켜기</button></div>
</div>
```
`data-motion-play`는 대상에 `.is-playing`을 다시 붙여 애니메이션을 재생한다. 대상에 `data-motion-toggle`이 있으면 `.is-lit`을 껐다 켠다. 감속 곡선 도해는 `svg.motion-curve` 안에서 `.motion-curve__axis` · `__line` · `__line--stamp` · `__label`로 그린다.

### navbar — 러닝헤드 · footer — 간기
3-1 ~ 3-4 스니펫을 그대로 쓴다. 높이는 56(모바일 52)이고, 아래에 이중 괘(1px 잉크 + 3px 간격 + 1px 헤어라인)가 붙으며 sticky로 고정된다. ≤1024에서는 검색이 아이콘만 남고, ≤640에서는 가운데 제목과 도구 라벨이 숨겨진다(도구는 44px 아이콘).

### pagination — 장부 쪽 넘기기
```html
<nav class="pager" aria-label="장서 대장 쪽">
  <a class="pager__step" href="dashboard.html?p=2" rel="prev">이전 장</a>
  <ol class="pager__tabs">
    <li><a class="pager__tab pager__tab--edge" href="dashboard.html?p=1">1</a></li>
    <li><a class="pager__tab" href="dashboard.html?p=2">2</a></li>
    <li><a class="pager__tab" href="dashboard.html?p=3" aria-current="page">3</a></li>
    <li><a class="pager__tab" href="dashboard.html?p=4">4</a></li>
    <li><span class="pager__gap" aria-hidden="true">…</span></li>
    <li><a class="pager__tab pager__tab--edge" href="dashboard.html?p=12">12</a></li>
  </ol>
  <span class="pager__pos"><b>3 / 12</b> 장</span>
  <a class="pager__step" href="dashboard.html?p=4" rel="next">다음 장</a>
</nav>
```
처음·끝에서 단계 링크는 `aria-disabled="true"`로 둔다. ≤640에서는 현재 쪽과 `--edge` 탭만 남는다.

### popover — 청구기호 미리보기 쪽지
```html
<span class="popover-anchor">
  <button class="btn btn--ghost" type="button" data-popover-trigger="pv-otranto" aria-controls="pv-otranto">W 823.6 W219c</button>
  <div class="popover" id="pv-otranto" role="dialog" aria-label="『오트란토 성』 미리보기" hidden>   <!-- 오른쪽 정렬: .popover--end -->
    <span class="popover__call">W 823.6 W219c</span>
    <span class="popover__title">『오트란토 성』 <span class="book">The Castle of Otranto</span></span>
    <p class="popover__text">호레이스 월폴 · 런던 판 · 1791. 2층 서가 W-3.</p>
    <div class="popover__foot"><span class="stamp stamp--sm stamp--ok">열람 가능</span><button class="btn btn--ghost btn--sm" type="button" data-float-close>닫기</button></div>
  </div>
</span>
```
`data-float-close` 또는 Esc로 닫는다. 화면 밖으로 넘치면 JS가 정렬을 뒤집는다. 정적 견본은 `.popover--static`이다.

### progress — 장부 괘선 위 잉크 선
```html
<div class="progress">
  <div class="progress__label"><span class="progress__name">카드 목록 전산화</span><span class="progress__value"><b>33,577</b> / 41,260책 · 81.4 %</span></div>
  <div class="progress__bar" role="progressbar" aria-label="카드 목록 전산화" aria-valuemin="0" aria-valuemax="41260" aria-valuenow="33577"><span class="progress__fill"></span></div>
  <p class="progress__foot">백시온 · 2024년 착수</p>
</div>
```
`aria-valuenow`는 JS가 `--val`로 옮긴다. 목표 범위는 `<span class="progress__target" style="--from:45%;--span:5%"></span>`(해칭)로 표시하고, 눈금 글자는 `.progress__scale`에 둔다. 변형: `--rubric` · `--warn` · `--thick` · `--busy`(정해지지 않은 진행). 원형 진행은 쓰지 않는다. 바꿀 때는 `Seokru.setProgress(bar, 값)`을 쓴다.

### sidebar — 카드 서랍 앞판
3-5 스니펫을 쓴다. 현재 서랍은 6px 앞으로 빠지고 명패 앞에 주서 ¶가 붙는다. 낮에는 놋쇠 명패, 밤에는 나무 위 피지색 글자와 놋쇠 테두리다.

### skeleton — 아직 타자되지 않은 카드
```html
<div class="skeleton skeleton--card" aria-busy="true">
  <span class="sr-only">장서 카드를 불러오는 중</span>
  <span class="skeleton__line skeleton__line--title"></span>
  <span class="skeleton__line" style="--w:88%"></span>
  <span class="skeleton__line" style="--w:70%"></span>
</div>
<div class="skeleton skeleton--row" aria-hidden="true"><span class="skeleton__line skeleton__line--call"></span><span class="skeleton__line"></span><span class="skeleton__stamp"></span></div>
```

### spinner — 램프 맥동
```html
<div class="spinner" role="status"><svg class="lamp" …(0절 램프)…></svg>불러오는 중</div>
<div class="spinner spinner--quatrefoil" role="status"><span class="quatrefoil" aria-hidden="true"><i></i><i></i><i></i><i></i></span>장서 대장을 넘기는 중</div>
```
가운데에 놓으려면 `.spinner--block`을 쓴다. 빛 원뿔은 회전하지 않고 1.6s 주기로 밝아졌다 어두워진다.

### steps — 열람 절차
```html
<ol class="steps" style="--n:4">
  <li class="steps__item is-done"><span class="steps__no" aria-hidden="true">Ⅰ</span><span class="steps__name">신청</span><span class="stamp stamp--sm stamp--date">22:55</span></li>
  <li class="steps__item is-done"><span class="steps__no" aria-hidden="true">Ⅱ</span><span class="steps__name">승인</span><span class="stamp stamp--sm stamp--ok stamp--tilt-c">23:02</span></li>
  <li class="steps__item" aria-current="step"><span class="steps__no" aria-hidden="true">Ⅲ</span><span class="steps__name">착석</span><span class="steps__meta">A3 · 입실 마감 00:30</span></li>
  <li class="steps__item"><span class="steps__no" aria-hidden="true">Ⅳ</span><span class="steps__name">반납</span><span class="steps__meta">02:00 전</span></li>
</ol>
```
로마숫자는 장식이므로 `aria-hidden`을 주고, 한글 단계명은 반드시 함께 쓴다. 오류 단계는 `.is-error`, 세로 배치는 `.steps--vertical`(≤640에서는 자동)이다. 온보딩에서 지난 단계로 돌아가는 링크는 `.steps__link`로 만든다.
steps의 로마숫자는 40px 이하이므로 Noto Serif KR 900이다(40px 초과 장 번호는 Crimson Pro 600). 페이지 CSS에서 번호 글꼴을 덮어쓰지 않는다. 단계 칸 전체가 누르는 자리가 되도록 `.steps__link::after { inset: 0 }`로 히트 영역을 넓힌다.

### table — 장서 대장 · 신청 장부
순서는 **표제 → (선택 시) 일괄 바 → 표 머리**다. 일괄 바가 표제 위에 붙어 제목을 누르지 않게, 표제는 표 밖 제목 요소로 두고 `<caption>`은 `sr-only`로 남긴다.
```html
<h3 class="entry__head">열람 신청 대기 · 5건</h3>
<div class="bulkbar" id="rq-bulk" hidden>
  <span class="bulkbar__count">선택 <b data-bulk-count>0</b>건</span>
  <button class="btn btn--primary btn--sm" type="button" data-bulk-action="approve">일괄 승인</button>
  <button class="btn btn--ghost btn--sm" type="button" data-bulk-action="reject">반려</button>
  <button class="btn btn--ghost btn--sm" type="button" data-bulk-action="clear">선택 해제</button>
</div>
<div class="ledger-wrap">
  <table class="ledger ledger--cards" data-table-select data-bulk="rq-bulk">
    <caption class="sr-only">열람 신청 대기 · 5건</caption>
    <thead><tr>
      <th class="ledger__check" scope="col"><input class="check" type="checkbox" data-select-all aria-label="전체 선택"></th>
      <th scope="col" aria-sort="ascending"><button class="ledger__sort" type="button">번호<span class="ledger__sort-icon" aria-hidden="true"></span></button></th>
      <th scope="col">신청자</th><th scope="col">장서</th><th scope="col">좌석</th>
      <th scope="col" class="ledger__num" aria-sort="none"><button class="ledger__sort" type="button">신청 시각<span class="ledger__sort-icon" aria-hidden="true"></span></button></th>
      <th scope="col">상태</th>
    </tr></thead>
    <tbody>
      <tr>
        <td class="ledger__check"><input class="check" type="checkbox" data-row-select aria-label="RQ-261022-07 선택"></td>
        <td class="ledger__call" data-label="번호">RQ-261022-07</td>
        <td data-label="신청자">진서람 석-0412</td>
        <td class="ledger__title" data-label="장서">『한중록』 필사본<span class="book">복제본으로 대체 안내</span></td>
        <td class="ledger__call" data-label="좌석">R2</td>
        <td class="ledger__num" data-label="신청 시각" data-sort="22:41">22:41</td>
        <td data-label="상태" data-status><span class="stamp stamp--sm stamp--info">복제 안내</span></td>
      </tr>
    </tbody>
  </table>
</div>
<p class="sr-only" aria-live="polite" data-sort-live></p>
```
- 정렬: `.ledger__sort`를 누르면 `aria-sort`가 바뀌고 행이 다시 쌓인다. 정렬 값이 따로 있으면 `data-sort`에 넣는다.
- 선택: 행이 `aria-selected="true"`(주서 tint)가 되고, 일괄 바에 n건이 표시된다. 일괄 승인·반려를 누르면 `[data-status]` 칸에 도장이 새로 찍힌다.
- 열 클래스: `.ledger__num`(오른쪽 정렬, 표 숫자), `.ledger__call`, `.ledger__title`(+ `.book` 원어), `.ledger__actions`
- 변형: `.ledger--dense`, `tfoot`(합계 줄, 아래 이중 괘), 빈 상태 `<tr class="ledger__state"><td colspan="7">…</td></tr>`
- **`.ledger--cards`**: ≤640에서 행마다 장서 카드 축약형 3줄이 된다 — 1줄 `data-label="청구기호"`(또는 `"번호"`) 타자 13px + `data-label="상태"` 도장 오른쪽, 2줄 `.ledger__title` 명조 600, 3줄 나머지 칸을 ` · `로 잇는 메타(`"신청자"`·`"등록번호"`가 첫 메타). 체크 상자는 왼쪽 붉은 여백선 안. `data-label` 이름을 이 규칙대로 붙인다. 가로 스크롤 표를 원하면 이 클래스를 빼고 `.ledger-wrap`에 맡긴다.

### tabs — 서랍 색인 탭
```html
<div class="tabs" data-tabs>
  <div class="tabs__rail"><div class="tabs__list" role="tablist" aria-label="열람증 설정">
    <button class="tabs__tab" role="tab" type="button" id="set-tab-1" aria-controls="set-panel-1" aria-selected="true"><span class="tabs__label">기본 정보</span></button>
    <button class="tabs__tab" role="tab" type="button" id="set-tab-2" aria-controls="set-panel-2" aria-selected="false"><span class="tabs__label">알림</span><span class="count">2</span></button>
  </div></div>
  <div class="tabs__panel" role="tabpanel" id="set-panel-1" aria-labelledby="set-tab-1" tabindex="0">…</div>
  <div class="tabs__panel" role="tabpanel" id="set-panel-2" aria-labelledby="set-tab-2" tabindex="0" hidden>…</div>
</div>
```
← → · Home · End로 탭을 옮긴다. 탭 줄이 넘치면 오른쪽 페이드 힌트가 생긴다(JS가 `.is-scrollable`/`.is-end`를 붙인다). 판면 안에서 가볍게 쓸 때는 `.tabs--line`(장부 머리형)을 쓴다. 비활성 탭은 `disabled`로 둔다.

### timeline — 석루관 연혁
```html
<ol class="timeline">
  <li class="timeline__item"><span class="timeline__when stamp stamp--sm stamp--date">1931</span><div><p class="timeline__title">석루관 준공</p><p class="timeline__text">성공회 신학교 도서관으로 지은 2층 석조 건물.</p></div></li>
  <li class="timeline__item timeline__item--loss"><span class="timeline__when stamp stamp--sm stamp--date stamp--rare stamp--tilt-c">1950</span><div><p class="timeline__title">전쟁으로 장서 절반 소실</p></div></li>
  <li class="timeline__item timeline__item--now"><span class="timeline__when stamp stamp--sm stamp--date stamp--tilt-a">2026.9</span><div><p class="timeline__title">필사회 「밤의 필사」 3기</p></div></li>
</ol>
```

### toast — 반납 쪽지
- 버튼 트리거: `data-toast="ok|warn|info|danger"` + `data-toast-title` + `data-toast-text` + (선택) `data-toast-stamp="26.10.22 23:10"`. 도장 글자를 빼려면 `data-toast-stamp=""`를 준다.
- 스크립트에서 띄우기: `Seokru.toast({ title: '기록했습니다', text: '『오트란토 성』 반납 · A16', tone: 'ok', stamp: '26.10.22 23:10' })`. 5초 뒤 내려가고, hover하면 멈춘다. 닫기 버튼의 이름은 "알림 닫기"다.
- 정적 견본(쪽지 3장 겹침):
```html
<div class="toast-stack">
  <div class="toast toast--info">…</div>
  <div class="toast toast--ok">…</div>
  <div class="toast"><div><b class="toast__title">기록했습니다</b><p class="toast__text">『오트란토 성』 반납 · A16</p><span class="stamp stamp--sm stamp--date toast__stamp">26.10.22 23:10</span></div>
    <button class="toast__close" type="button" aria-label="알림 닫기"><svg class="icon icon--sm" …닫기…/></button></div>
</div>
```
테마 토글을 누르면 "밤 열람실로 옮겼습니다 · 램프를 켰습니다" 또는 "낮 열람실로 옮겼습니다" 토스트가 자동으로 뜬다.

### tooltip — 잉크 쪽지
```html
<span class="tip">
  <button class="btn btn--secondary btn--icon" type="button" aria-label="반납 마감" aria-describedby="tip-due"><svg class="icon" …/></button>
  <span class="tooltip" role="tooltip" id="tip-due">반납 마감 01:30 · 귀중본실</span>   <!-- 아래로: .tooltip--below, 왼쪽 기준: .tooltip--start -->
</span>
```
300ms 지연 뒤 hover·focus로 나타나고, Esc를 누르면 숨는다. 정적 견본은 `<span class="tooltip tooltip--static" role="tooltip">…</span>`이다.

---

## 5. JS 계약 요약 (app.js)

| 속성 · 클래스 | 동작 |
|---|---|
| `[data-theme-toggle]` + `[data-theme-label]` | 낮/밤 전환, `aria-pressed`, 라벨 "밤 열람실로/낮 열람실로", 토스트 |
| `[data-modal-open=id]` · `[data-drawer-open=id]` · `[data-close]` | 열기/닫기, Esc, 포커스 트랩·복귀, 스크롤 잠금. 첫 포커스는 `[data-autofocus]` |
| `.command[data-command]` · `[data-command-open=id]` · ⌘K/Ctrl+K | 서가 검색 열기, 걸러내기, ↑↓ Enter, `data-href` 이동 |
| `[data-menu-trigger]` · `[data-popover-trigger]` (+`aria-controls`) | 쪽지 메뉴·팝오버, 바깥 클릭·Esc 닫기 |
| `[data-tabs]` · `[data-accordion]` · `[data-carousel]` · `[data-calendar]` · `[data-kanban]` · `[data-marquee]` | 각 컴포넌트 절 참고 |
| `table[data-table-select][data-bulk=id]` · `.ledger__sort` | 선택·일괄 바·정렬 |
| `form[data-validate]` | 검증, 오류 각주, 접수 도장, 토스트 |
| `[data-toast…]` · `[data-busy-demo]` · `[data-dismiss]` · `[data-copy]` · `[data-motion-play]` | 토스트 · 로딩 시연 · 경고 닫기 · 원문 복사 · 모션 재생 |
| `.cardstack__tab` | 서랍 카드 당기기 |
| `.reveal` · `[data-chapter-title]`(+`data-chapter-no`) · `[data-runhead-title]` · `[data-runhead-no]` | 장 등장 · 러닝헤드 현재 장 |
| `[data-sidebar-toggle]` · `[data-sidebar-close]` | ≤900 서랍 사이드바 |
| `[role=progressbar][aria-valuenow]` | `--val` 동기화 |
| `window.Seokru` | `toast()` · `openLayer()` · `closeLayer()` · `init(scope)` · `setProgress(bar, v)` |
