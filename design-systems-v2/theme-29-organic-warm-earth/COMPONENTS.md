# COMPONENTS — 볕바른장 v2 마크업 계약

index.html · pages/*.html 담당은 **이 문서만 보고** 마크업한다. 디자인 근거와 세계관 값은 `DIRECTION.md`(특히 `## 팩트 시트`).
클래스는 BEM(`블록__요소--변형`). 상태는 가능한 한 ARIA 속성(`aria-selected` · `aria-current` · `aria-expanded` · `aria-pressed` · `aria-checked` · `aria-busy` · `aria-invalid` · `disabled`)으로 표시하고, CSS가 그 속성을 읽는다.
**셸(navbar · footer · 공통 오버레이 · 집하장 칠판 사이드바)은 3절 스니펫을 글자 하나 바꾸지 말고 복사**한다. 바꿔도 되는 것은 표시된 `aria-current` 위치(와 칠판 아래 로그인한 사람 한 줄)뿐이다.

---

## 0. 페이지 뼈대 (모든 HTML 공통)

```html
<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>볕바른장 — 상강 장날 전단</title>
<script>(function(){var d=document.documentElement;d.classList.add('js');try{var q=new URLSearchParams(location.search).get('theme');var s=localStorage.getItem('byeot-theme');var t=(q==='dark'||q==='light')?q:(s==='dark'||s==='light')?s:(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');d.setAttribute('data-theme',t);}catch(e){d.setAttribute('data-theme','light');}})();</script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=East+Sea+Dokdo&family=Nanum+Gothic:wght@400;700;800&family=Zilla+Slab:wght@500;700&family=Overpass+Mono:wght@400;600&display=swap">
<link rel="stylesheet" href="styles.css">      <!-- pages: ../styles.css -->
<link rel="stylesheet" href="index.css">       <!-- pages: dashboard.css 처럼 장면 전용 1개 (pages/ 안) -->
</head>
<body>
<a class="skip" href="#main">본문으로 건너뛰기</a>
<header class="nav">…3-1 스니펫…</header>
<main id="main">…</main>                         <!-- 사이드바 페이지는 3-4 셸 안의 main -->
<footer class="foot">…3-2 스니펫…</footer>
…3-3 공통 오버레이(장터 안내소 · 토스트 자리)…
<script src="app.js"></script>                   <!-- pages: ../app.js -->
</body>
</html>
```

- 테마 저장 키 `byeot-theme`. 우선순위 `?theme=dark|light` → localStorage → 시스템. `<html>`에 `data-theme`를 하드코딩하지 않는다.
- `<title>`은 `볕바른장 — <장면 이름>`: index `볕바른장 — 상강 장날 전단`, product `볕바른장 — 문당리 밤고구마`, pricing `볕바른장 — 꾸러미 가격표`, onboarding `볕바른장 — 첫 꾸러미 신청`, profile `볕바른장 — 생산자 김순례`, inbox `볕바른장 — 쪽지함`, kanban `볕바른장 — 44주차 작업판`, dashboard `볕바른장 — 장날 현황판`, settings `볕바른장 — 구독 관리`, 404 `볕바른장 — 장 파함`.
- 장면 CSS(`index.css`, `pages/<name>.css`)도 **semantic 토큰만**(2절 목록). raw hex·rgba 금지, 인라인 `grid-template-columns` 금지(1절 스팬 클래스 사용). `style="--ill:150px; --v:62%; --n:6"` 같은 **커스텀 속성 주입은 허용**.
- 금지: `href="#"`(실제 경로나 `#id`), 인라인 `onclick`, 이미지 파일(농산물은 `data-ill`, 아이콘은 `data-icon`), 이모지, 영어 더미 카피, "○○" 같은 자리 채움.
- 세계관 기준 시각은 **2026년 10월 24일 토요일 09:40 (상강 장날, 장 열기 20분 전)**. 요일·주소·시간·가격·ID·사람은 DIRECTION 팩트 시트 값만.
- 인주 번짐 SVG 필터(`#ink-rough`)는 app.js가 body에 한 번 넣는다. 페이지에 따로 넣지 않는다.

---

## 1. 레이아웃 문법 (base.css)

"펼친 3단 전단 위에 좌판을 차린다." 인접한 두 띠는 바탕·폭·위아래 간격 중 적어도 둘이 달라야 한다.

### `.band` — 풀블리드 색 띠
```html
<section class="band band--sun pinked-b pad-112"> <div class="wrap">…</div> </section>
```
| 클래스 | 바탕 / 글자 | 비고 |
|---|---|---|
| `band--kraft` | 크라프트 / 먹 | 기본 지면 |
| `band--gangji` | 갱지 / 먹 | 밝은 지면 |
| `band--sun` | 볕 / 먹 — **밤: 어두운 흙 면 + 알전구 줄 + 전구색 글자** | 첫 화면 머리 |
| `band--cabbage` | 배추 면 / 갱지 글자 | 꾸러미 신청 · 단계 |
| `band--stamp` | 인주 면 / 연한 글자 | 손도장 견본 · 마퀴 |
| `band--ochre` | 황토 면 / 연한 글자 (24px 이상 굵은 글자만) | 404 노을 |
| `band--chalk` | 칠판 먹 / 크라프트 글자 | |

- 위아래 간격: `pad-112` · `pad-88` · `pad-72` · `pad-0` (모바일에서 자동으로 줄어듦). 인접 띠와 같은 값 금지.
- 가위로 오린 가장자리: `pinked-b`(아래 톱니) · `pinked-t`(위 톱니). 톱니가 다음 지면 위로 10px 걸친다. 블롭·물결 곡선 금지.

### 폭
- `.wrap` = 최대 1320px + 좌우 24px(모바일 16px). `.wrap.wrap--narrow` = 1120px.

### `.g12` — 12단 그리드 (≤1024px 6단, ≤640px 4단에서 모두 한 줄)
스팬: `c-2` `c-3` `c-4` `c-5` `c-6` `c-7` `c-8` `c-9` `c-12`. 전단 지면은 **4/4/4 · 5/7 · 3/5/4** 로 나눈다. 카드 등분 그리드(`repeat(n,1fr)`)는 표·달력 외에 쓰지 않는다.

### `.fold` — 3단 접지선
`.g12.fold` 단 사이에 세로 점선(2px, 8/6)을 긋는다. 1024px 이하에서 접지선이 가로로 눕는다. `.fold--wide` = 거터 2배.
```html
<div class="wrap g12 fold"> <div class="c-4">…</div> <div class="c-4">…</div> <div class="c-4">…</div> </div>
```

### `.plank` — 좌판 선 (바닥 정렬)
물건(가격표·일러스트·견본)을 6px 먹 널빤지 위에 **바닥 정렬**로 놓는다. 줄이 바뀌면 줄마다 널빤지가 생긴다. 높이가 달라도 빈 칸이 생기지 않는다. 기울기는 자식 안쪽 요소에 준다(널빤지는 수평 유지).
```html
<ul class="plank" role="list">
  <li class="drop-in"><span class="ill" data-ill="goguma" style="--ill:150px"></span>
      <span class="tag tilt-a"><span class="tag__name">밤고구마 3kg</span><span class="tag__price">19,000</span></span></li>
  …
</ul>
```
변형: `plank--tight`(간격 16px). 볕 띠 안에서는 널빤지가 띠 글자색, 배추·인주 띠 안에서는 currentColor.

### 그 밖의 원시
- `.stack` / `.stack--l`(세로 16/32px) · `.cluster`(가로 줄바꿈 12px) · `.btn-row`
- `.scroller` — 가로 스크롤 줄 + 오른쪽 페이드 힌트(끝에 닿으면 app.js가 `.is-end`로 페이드 제거)
- `.paper` — 갱지 쪽지(그림자 있음) · `paper--flat`(선만) · `paper--lined`(줄 친 갱지) · `paper--pinked`(위 핑킹)
- 기울기(쪽지·가격표·도장만): `tilt-a`(−2°) `tilt-b`(−1.2°) `tilt-c`(0.8°) `tilt-d`(1.5°), 또는 부모에 `.tilts`(자식을 4개 값으로 돌려 씀). hover/focus 시 0°로 선다. 본문·표·입력칸은 기울이지 않는다.
- `.memo` — 여백 손글씨 메모 + 손그림 화살표. `memo--left`는 화살표가 오른쪽.
  ```html
  <p class="memo"><svg class="memo__arrow" viewBox="0 0 44 30" aria-hidden="true"><path d="M42 4C30 2 14 6 6 22M6 22l-2-9M6 22l9-3"/></svg>숫자는 Zilla Slab</p>
  ```
- `.nametag` — 견본 위 손글씨 이름표 쪽지.
- `.drop-in` — 화면에 들어오면 툭 놓임(40ms 차례, 10개 초과 20ms). `.stagger`(자식에 `--i` 자동).
- `.sunrise` — 첫 화면 볕 띠에 1회: 위에서 아래로 빛이 차오름(900ms).

### 활자 유틸
| 클래스 | 폰트 | 데스크톱 / 모바일 |
|---|---|---|
| `t-hand-xxl` `t-hand-xl` `t-hand-l` `t-hand-m` `t-hand-s` | East Sea Dokdo (매직 손글씨) | 176·112·64·40·28 / 96·68·44·32·26 |
| `t-h1` `t-h2` `t-h3` | Nanum Gothic 800 | 44·30·21 / 30·24·19 |
| `t-body` `t-small` `t-micro` | Nanum Gothic | 16·14·12 |
| `t-price-l` `t-price-m` | Zilla Slab 700 (인쇄 가격) | 56·28 / 40·24 |
| `t-mono` | Overpass Mono — **라틴·숫자만** | 13 |
| `num` | Zilla Slab 숫자(표 숫자 폭 맞춤) | |
| `unit` | 숫자 뒤 "원·kg·상자" (0.55배 Nanum Gothic 700) | |
| `hand` | 손글씨 글꼴만 | |
| `t-dim` | 보조 글자색 | |

규칙: 손글씨는 한 화면에 3곳까지(제목 1 + 가격표 + 메모), 본문은 손글씨 금지, 손글씨는 28px 미만으로 쓰지 않는다. 넓은 자간·모노는 한글 라벨에 쓰지 않는다.

---

## 2. 장면 CSS에서 쓸 semantic 토큰

| 무리 | 토큰 |
|---|---|
| 종이 | `--kraft` `--gangji` `--kraft-sunk` `--cardboard` (별칭 `--bg` `--surface` `--surface-sunk`) |
| 글자 | `--ink` `--ink-2` (별칭 `--text` `--text-2`) |
| 선 | `--line`(장식·접지선) `--line-strong`(입력 테두리) |
| 인주 | `--stamp`(면) `--stamp-ink`(글자·포커스) `--stamp-edge`(버튼 밑단) `--on-stamp` `--dojang-c`(도장 테두리색, 밤엔 밝은 주홍) |
| 장터 색 | `--sun` + `--on-sun` · `--cabbage`(글자) `--cabbage-fill`(면) + `--on-cabbage` · `--leaf` + `--on-leaf` · `--ochre`(면) `--ochre-ink`(글자) + `--on-ochre` · `--goguma`(글자) · `--indigo`(글자) · `--persimmon`(대봉감 일러스트) · `--on-cardboard` |
| 면 · 일러스트 전용 | `--goguma-fill` + `--on-goguma-fill` · `--indigo-fill` + `--on-indigo-fill` · `--leaf-fill` · `--ill-white`(무·달걀·쌀자루 흰 면) · `--ill-ink`(일러스트 속 검은 면) · `--ill-line`(일러스트 외곽선, 밤엔 밝은 선) · `--ill-stroke`(2 / 밤 1.5). **SVG 면·지층·아바타·차트 막대는 반드시 `*-fill`** — 밤의 `--goguma`(#D88AAE)·`--indigo`(#8FB0D6)는 글자 전용이라 면에 쓰면 분홍·하늘색으로 뜬다 |
| 상태 | `--ok` `--warn` `--danger` `--info` `--focus` |
| 볕 띠 | `--band-sun-bg` `--band-sun-text` `--band-sun-text-2` `--bulbs`(밤 알전구 줄 배경 레이어, 낮엔 none) |
| 칠판 | `--chalk` `--chalk-text` `--chalk-dim` `--chalk-line` `--chalk-stamp` |
| 덮개·선택 | `--hover-wash` `--select-wash` `--scrim` `--fold-shade` |
| 그림자 | `--shadow-paper`(얹힌 종이) `--shadow-lift`(들린 쪽지·모달) `--shadow-drop`(filter용) — 위에 얹힌 종이에만 |
| 원시(tokens) | 간격 `--s-1`…`--s-28`, `--max` `--max-narrow` `--gutter` `--edge` `--plank` `--zz` `--touch`, 반경 `--r-paper`(2) `--r-input`(3) `--r-round`, 모션 `--dur-*` `--ease-*` `--stagger`, 기울기 `--tilt-*`, 질감 `--tex-corrugate` `--tex-ink-mask`, 가장자리 `--tear-a/b/c` |

볕 띠를 직접 칠할 때는 `background: var(--bulbs), var(--band-sun-bg);` 처럼 **두 레이어**로 쓴다(밤에 알전구 줄이 보이게).

- 목록 리셋 `:where(ul[class], ol[class]) { padding: 0 }`은 우선순위 0이다 — 장면 CSS에서 `.ruler { padding: … }`처럼 클래스 하나로 padding을 줘도 이긴다.
- `.drop-in`은 처음부터 보인다. 첫 페인트 뒤 화면에 들어올 때만 app.js가 `.is-in`을 붙여 한 번 툭 놓는다(전체 페이지 스크린샷 · JS 없음에서도 물건이 보임).

---

## 3. 공통 셸 — 복사해서 쓰는 스니펫

### 3-1. navbar · 전단 머리띠

**index.html 용** (`aria-current="page"`는 지금 화면 한 곳에만):
```html
<header class="nav">
  <div class="nav__inner">
    <a class="nav__brand" href="index.html">
      <span class="dojang nav__seal" aria-hidden="true">볕</span>
      <span class="nav__word">볕바른장</span>
    </a>
    <nav class="nav__menu" id="nav-menu" aria-label="주 메뉴">
      <ul class="nav__list">
        <li><a class="nav__link" href="index.html" aria-current="page">장날 전단</a></li>
        <li><a class="nav__link" href="pages/product.html">이번 주 꾸러미</a></li>
        <li><a class="nav__link" href="pages/pricing.html">꾸러미 가격표</a></li>
        <li><a class="nav__link" href="pages/onboarding.html">첫 꾸러미 신청</a></li>
        <li><a class="nav__link" href="pages/profile.html">생산자</a></li>
        <li><a class="nav__link" href="pages/inbox.html">쪽지함</a></li>
        <li><a class="nav__link" href="pages/kanban.html">작업판</a></li>
        <li><a class="nav__link" href="pages/dashboard.html">장날 현황판</a></li>
        <li><a class="nav__link" href="pages/settings.html">구독 관리</a></li>
      </ul>
    </nav>
    <div class="nav__tools">
      <span class="tag tag--mini nav__next">다음 장날 <b class="num">11/14</b>(토)</span>
      <button class="btn btn--icon" type="button" data-open="#command" aria-label="장터 안내소 검색 (⌘K)"><svg class="icon" data-icon="search"></svg></button>
      <button class="btn btn--icon" type="button" data-theme-toggle aria-label="밤 장면으로 바꾸기"><svg class="icon icon-sun" data-icon="sun"></svg><svg class="icon icon-moon" data-icon="moon"></svg></button>
      <button class="btn btn--icon nav__toggle" type="button" data-nav-toggle aria-expanded="false" aria-controls="nav-menu" aria-label="메뉴 펼치기"><svg class="icon" data-icon="menu"></svg></button>
    </div>
  </div>
</header>
```

**pages/*.html 용** (예: product.html — `aria-current`를 그 페이지 링크로 옮긴다. 404는 어디에도 두지 않는다):
```html
<header class="nav">
  <div class="nav__inner">
    <a class="nav__brand" href="../index.html">
      <span class="dojang nav__seal" aria-hidden="true">볕</span>
      <span class="nav__word">볕바른장</span>
    </a>
    <nav class="nav__menu" id="nav-menu" aria-label="주 메뉴">
      <ul class="nav__list">
        <li><a class="nav__link" href="../index.html">장날 전단</a></li>
        <li><a class="nav__link" href="product.html" aria-current="page">이번 주 꾸러미</a></li>
        <li><a class="nav__link" href="pricing.html">꾸러미 가격표</a></li>
        <li><a class="nav__link" href="onboarding.html">첫 꾸러미 신청</a></li>
        <li><a class="nav__link" href="profile.html">생산자</a></li>
        <li><a class="nav__link" href="inbox.html">쪽지함</a></li>
        <li><a class="nav__link" href="kanban.html">작업판</a></li>
        <li><a class="nav__link" href="dashboard.html">장날 현황판</a></li>
        <li><a class="nav__link" href="settings.html">구독 관리</a></li>
      </ul>
    </nav>
    <div class="nav__tools">
      <span class="tag tag--mini nav__next">다음 장날 <b class="num">11/14</b>(토)</span>
      <button class="btn btn--icon" type="button" data-open="#command" aria-label="장터 안내소 검색 (⌘K)"><svg class="icon" data-icon="search"></svg></button>
      <button class="btn btn--icon" type="button" data-theme-toggle aria-label="밤 장면으로 바꾸기"><svg class="icon icon-sun" data-icon="sun"></svg><svg class="icon icon-moon" data-icon="moon"></svg></button>
      <button class="btn btn--icon nav__toggle" type="button" data-nav-toggle aria-expanded="false" aria-controls="nav-menu" aria-label="메뉴 펼치기"><svg class="icon" data-icon="menu"></svg></button>
    </div>
  </div>
</header>
```
- 높이 72px(모바일 60), 아래 가장자리 핑킹 오림. 현재 항목 = 인주 밑줄 3px + 작은 도장 점.
- 1280px 이하에서 "다음 장날" 가격표가 빠지고, **1180px 이하에서 메뉴가 "펼치기" 버튼 → 쪽지 메뉴**로 바뀐다(9개 메뉴가 1024~1180 사이에서 넘치지 않도록 DIRECTION의 1024 기준을 1180으로 올림). Esc·바깥 클릭·링크 클릭으로 닫힘.
- 머리띠 바로 아래 첫 띠가 `band--sun`이면 톱니가 볕 위로 걸쳐 오린 종이처럼 보인다.

### 3-2. footer · 뜯는 연락처 전단 꼬리

조각 10칸 = 화면 9개 + 이미 뜯겨 나간 빈칸 1개(6번째, 고정). 지금 화면 조각은 반쯤 뜯긴 볕색 조각이 된다(`aria-current="page"`). 900px 이하에서 3열×3행 가로쓰기(빈칸은 숨김).

**index.html 용**:
```html
<footer class="foot">
  <div class="foot__sheet">
    <div class="foot__head">
      <span class="foot__word">볕바른장</span>
      <p class="foot__info"><span><b>집하장</b> 충남 홍성군 홍동면 홍동로 245</span><span>평일 <span class="num">08:00–17:00</span> (점심 12–13시)</span><span><b>장날</b> 둘째·넷째 토 <span class="num">10:00–15:00</span> · 망원 마당</span></p>
      <span class="foot__call">☎ 041-631-0245</span>
    </div>
    <nav aria-label="화면 조각">
      <ul class="foot__tabs">
        <li><a class="foot__tab" href="index.html" aria-current="page"><span class="foot__name">장날 전단</span><span class="foot__tel">041-631-0245</span></a></li>
        <li><a class="foot__tab" href="pages/product.html"><span class="foot__name">이번 주 꾸러미</span><span class="foot__tel">041-631-0245</span></a></li>
        <li><a class="foot__tab" href="pages/pricing.html"><span class="foot__name">꾸러미 가격표</span><span class="foot__tel">041-631-0245</span></a></li>
        <li><a class="foot__tab" href="pages/onboarding.html"><span class="foot__name">첫 꾸러미 신청</span><span class="foot__tel">041-631-0245</span></a></li>
        <li><a class="foot__tab" href="pages/profile.html"><span class="foot__name">생산자</span><span class="foot__tel">041-631-0245</span></a></li>
        <li class="foot__torn-cell" aria-hidden="true"><div class="foot__torn"></div></li>
        <li><a class="foot__tab" href="pages/inbox.html"><span class="foot__name">쪽지함</span><span class="foot__tel">041-631-0245</span></a></li>
        <li><a class="foot__tab" href="pages/kanban.html"><span class="foot__name">작업판</span><span class="foot__tel">041-631-0245</span></a></li>
        <li><a class="foot__tab" href="pages/dashboard.html"><span class="foot__name">장날 현황판</span><span class="foot__tel">041-631-0245</span></a></li>
        <li><a class="foot__tab" href="pages/settings.html"><span class="foot__name">구독 관리</span><span class="foot__tel">041-631-0245</span></a></li>
      </ul>
    </nav>
    <p class="foot__fine"><span>© 2026 볕바른장 협동조합 · 홍동면 소농 23가구</span><span>택배 우체국 · 송장 <span class="t-mono">6089-2643-0187</span></span></p>
  </div>
</footer>
```

**pages/*.html 용** (예: product.html):
```html
<footer class="foot">
  <div class="foot__sheet">
    <div class="foot__head">
      <span class="foot__word">볕바른장</span>
      <p class="foot__info"><span><b>집하장</b> 충남 홍성군 홍동면 홍동로 245</span><span>평일 <span class="num">08:00–17:00</span> (점심 12–13시)</span><span><b>장날</b> 둘째·넷째 토 <span class="num">10:00–15:00</span> · 망원 마당</span></p>
      <span class="foot__call">☎ 041-631-0245</span>
    </div>
    <nav aria-label="화면 조각">
      <ul class="foot__tabs">
        <li><a class="foot__tab" href="../index.html"><span class="foot__name">장날 전단</span><span class="foot__tel">041-631-0245</span></a></li>
        <li><a class="foot__tab" href="product.html" aria-current="page"><span class="foot__name">이번 주 꾸러미</span><span class="foot__tel">041-631-0245</span></a></li>
        <li><a class="foot__tab" href="pricing.html"><span class="foot__name">꾸러미 가격표</span><span class="foot__tel">041-631-0245</span></a></li>
        <li><a class="foot__tab" href="onboarding.html"><span class="foot__name">첫 꾸러미 신청</span><span class="foot__tel">041-631-0245</span></a></li>
        <li><a class="foot__tab" href="profile.html"><span class="foot__name">생산자</span><span class="foot__tel">041-631-0245</span></a></li>
        <li class="foot__torn-cell" aria-hidden="true"><div class="foot__torn"></div></li>
        <li><a class="foot__tab" href="inbox.html"><span class="foot__name">쪽지함</span><span class="foot__tel">041-631-0245</span></a></li>
        <li><a class="foot__tab" href="kanban.html"><span class="foot__name">작업판</span><span class="foot__tel">041-631-0245</span></a></li>
        <li><a class="foot__tab" href="dashboard.html"><span class="foot__name">장날 현황판</span><span class="foot__tel">041-631-0245</span></a></li>
        <li><a class="foot__tab" href="settings.html"><span class="foot__name">구독 관리</span><span class="foot__tel">041-631-0245</span></a></li>
      </ul>
    </nav>
    <p class="foot__fine"><span>© 2026 볕바른장 협동조합 · 홍동면 소농 23가구</span><span>택배 우체국 · 송장 <span class="t-mono">6089-2643-0187</span></span></p>
  </div>
</footer>
```

### 3-3. 공통 오버레이 (body 끝, `<script>` 바로 앞) — 장터 안내소(⌘K) · 토스트 자리

**index.html 용** (pages는 아래 `href`에서 `pages/`를 빼고 `index.html` → `../index.html`):
```html
<div class="layer command" id="command" hidden>
  <div class="layer__scrim" data-close></div>
  <div class="command__sheet" role="dialog" aria-modal="true" aria-label="장터 안내소">
    <label class="command__ask" for="command-input">무엇을 찾으세요?</label>
    <div class="command__field"><svg class="icon" data-icon="search"></svg><input class="command__input" id="command-input" type="text" role="combobox" aria-expanded="true" aria-controls="command-list" aria-autocomplete="list" autocomplete="off" placeholder="품목 · 생산자 · 화면"></div>
    <ul class="command__list" id="command-list" role="listbox" aria-label="찾은 것">
      <li class="command__group" role="presentation"><span class="command__group-name" role="presentation">품목</span>
        <ul role="group" aria-label="품목">
          <li role="presentation"><a class="command__item" role="option" href="pages/product.html" data-keywords="고구마 PM-014"><span class="ill" data-ill="goguma"></span><span class="command__label">문당리 밤고구마<small>3kg · 19,000원</small></span><span class="command__hint">PM-014</span></a></li>
          <li role="presentation"><a class="command__item" role="option" href="pages/product.html" data-keywords="감 PM-061"><span class="ill" data-ill="gam"></span><span class="command__label">장곡 대봉감<small>5kg · 28,000원</small></span><span class="command__hint">PM-061</span></a></li>
          <li role="presentation"><a class="command__item" role="option" href="pages/product.html" data-keywords="버섯 PM-051"><span class="ill" data-ill="pyogo"></span><span class="command__label">참나무 표고<small>500g · 18,000원</small></span><span class="command__hint">PM-051</span></a></li>
          <li role="presentation"><a class="command__item" role="option" href="pages/pricing.html" data-keywords="김장 PM-022"><span class="ill" data-ill="baechu"></span><span class="command__label">김장 절임배추<small>20kg · 46,000원 · 11/26 발송 예약</small></span><span class="command__hint">PM-022</span></a></li>
        </ul></li>
      <li class="command__group" role="presentation"><span class="command__group-name" role="presentation">생산자</span>
        <ul role="group" aria-label="생산자">
          <li role="presentation"><a class="command__item" role="option" href="pages/profile.html" data-keywords="NG-01 문당리"><span class="avatar avatar--s avatar--goguma">순</span><span class="command__label">김순례<small>문당리 · 밤고구마 · 들깨</small></span><span class="command__hint">NG-01</span></a></li>
          <li role="presentation"><a class="command__item" role="option" href="pages/inbox.html" data-keywords="NG-12 쌈채소 서리"><span class="avatar avatar--s avatar--indigo">늘</span><span class="command__label">이하늘<small>금평리 · 쌈채소 · 허브</small></span><span class="command__hint">NG-12</span></a></li>
        </ul></li>
      <li class="command__group" role="presentation"><span class="command__group-name" role="presentation">화면</span>
        <ul role="group" aria-label="화면">
          <li role="presentation"><a class="command__item" role="option" href="pages/dashboard.html"><svg class="icon" data-icon="chart"></svg><span class="command__label">장날 현황판</span><span class="command__hint">09:40</span></a></li>
          <li role="presentation"><a class="command__item" role="option" href="pages/kanban.html"><svg class="icon" data-icon="board"></svg><span class="command__label">44주차 작업판</span><span class="command__hint">10/29</span></a></li>
          <li role="presentation"><a class="command__item" role="option" href="pages/settings.html"><svg class="icon" data-icon="gear"></svg><span class="command__label">구독 관리</span><span class="command__hint">BB-0412</span></a></li>
        </ul></li>
    </ul>
    <p class="command__empty" hidden><span class="hand">그건 장에 없어요</span>품목 이름이나 생산자 이름으로 찾아보세요.</p>
    <div class="command__foot"><span><kbd>↑</kbd><kbd>↓</kbd> 고르기</span><span><kbd>Enter</kbd> 열기</span><span><kbd>Esc</kbd> 닫기</span></div>
  </div>
</div>
<div class="toasts" aria-live="polite"></div>
```
- 장바구니 쪽지(drawer)와 주문서(modal)는 쓰는 화면(index · product · pricing)만 같은 자리(body 끝)에 둔다 — 7절 drawer/modal 스니펫.

### 3-4. 집하장 칠판 사이드바 — dashboard · kanban · inbox · settings

머리띠(3-1)와 꼬리(3-2) 사이에 `.app`으로 감싼다. `aria-current`는 지금 화면 한 곳. **칠판은 사무국 직원 화면이다** — 네 화면 모두 `chalk__foot`은 한정민 사무장으로 같다. settings도 "사무국이 구독자 BB-0412 정유나 님 구독을 여는 화면"으로 짠다(제목 `구독자 BB-0412 정유나 님 구독`, 경로 `구독 관리 › BB-0412`). 구독자 본인용 셸은 만들지 않는다.
```html
<div class="app">
  <aside class="chalk" aria-label="집하장 칠판">
    <a class="chalk__brand" href="../index.html"><span class="dojang" aria-hidden="true">볕</span><span><span class="chalk__word">볕바른장</span><span class="chalk__where">홍동 집하장</span></span></a>
    <p class="chalk__date">10월 24일 토요일<small>상강 장날 · 장 열기 20분 전</small></p>
    <nav class="chalk__nav" aria-label="집하장 메뉴">
      <div class="chalk__group">
        <span class="chalk__label">오늘</span>
        <ul>
          <li><a class="chalk__link" href="dashboard.html" aria-current="page"><svg class="icon" data-icon="chart"></svg>장날 현황판</a></li>
          <li><a class="chalk__link" href="kanban.html"><svg class="icon" data-icon="board"></svg>작업판<span class="count">14</span></a></li>
          <li><a class="chalk__link" href="inbox.html"><svg class="icon" data-icon="note"></svg>쪽지함<span class="count count--stamp">2</span></a></li>
        </ul>
      </div>
      <div class="chalk__group">
        <span class="chalk__label">구독</span>
        <ul>
          <li><a class="chalk__link" href="settings.html"><svg class="icon" data-icon="gear"></svg>구독 관리</a></li>
          <li><a class="chalk__link" href="../index.html"><svg class="icon" data-icon="flyer"></svg>장날 전단</a></li>
        </ul>
      </div>
    </nav>
    <div class="chalk__foot"><span class="avatar avatar--sun">정</span><span class="chalk__who">한정민<small>볕바른장 사무장</small></span></div>
  </aside>
  <main class="app__main" id="main">
    …장면…
  </main>
</div>
```
- 900px 이하: 칠판이 위쪽 한 줄(가로 스크롤 + 오른쪽 페이드)로 바뀐다. 날짜·라벨·사람 줄은 숨김.

---

## 4. 시그니처 ① 인주 손도장 `.dojang`

```html
<span class="dojang" aria-hidden="true">발송</span>                          <!-- 56px 원, −8° -->
<span class="dojang dojang--l dojang--4">볕바른장<small>산지직송</small></span> <!-- 140px, 네 글자 -->
<span class="dojang dojang--m dojang--hand">장날</span>                      <!-- 88px, 손글씨 글자 -->
<span class="dojang dojang--sq dojang--m">산지<br>직송</span>                <!-- 사각 낙관 -->
<span class="dojang dojang--fill dojang--m">품절</span>                      <!-- 인주가 꽉 찬 도장 -->
```
| 크기 | `dojang--xs` 24 · `dojang--s` 40 · 기본 56 · `dojang--m` 88 · `dojang--l` 140 |
|---|---|
| 글자 수 | 기본 0.3배(2자) · `dojang--1`(한 자, 0.46) · `dojang--3` · `dojang--4` · `dojang--hand`(손글씨). `<small>`은 아래 작은 줄 |
| 모양 | `dojang--sq`(사각 낙관 −4°) · `dojang--fill`(꽉 찬 면) |
| 색 | 기본 인주 · `--ok`(배추) `--info`(쪽빛) `--warn`(황토) `--muted`(먹) `--sun`(볕 띠 위) `--on`(currentColor) |
| 찍기 | `.is-stamping` 붙이면 260ms 찍기 모션. 다시 찍기 버튼: `<button data-restamp="#id">` |

- 바깥 3px + 안쪽 1px 이중 원, 인주 얼룩 mask, 56px 이상은 `#ink-rough` 번짐 필터. 낮은 `multiply`, 밤은 밝은 주홍 테두리로 바탕과 분리.
- 쓰이는 곳: 브랜드 "볕", 상태 배지, 활성 메뉴 점, 체크박스, 완료 단계, "제일 많이 받음", 토스트, 404 "없는 길", 빈 상태.
- 장식 도장은 `aria-hidden="true"`. 뜻이 있는 도장(상태)은 옆에 글자로도 쓰거나 `role="img" aria-label="품절"`.

## 5. 시그니처 ② 골판지 가격표 `.tag`

```html
<span class="tag tag--hung tilt-a">                       <!-- 끈 달린 가격표 -->
  <span class="tag__name">밤고구마 3kg</span>             <!-- 손글씨 40px -->
  <span class="tag__price">19,000</span>                  <!-- 손글씨 64px -->
</span>
<span class="tag tag--b">
  <span class="tag__name">식구 꾸러미</span>
  <span class="tag__price--print">36,000<span class="unit">원</span></span>  <!-- 인쇄 가격 Zilla Slab -->
  <span class="tag__meta">3–4인 · 매주</span>
</span>
<span class="tag tag--mini">다음 장날 <b class="num">11/14</b>(토)</span>
```
| 가장자리 | 기본(a) · `tag--b` · `tag--c` — 손으로 뜯은 다각형 3종. 왼쪽 위 펀치 구멍은 진짜 구멍(뒤가 비친다) |
|---|---|
| 면 | 기본 골판지 · `tag--gangji` · `tag--sun` · `tag--stamp` |
| 크기 | 기본 · `tag--s`(이름 28 / 인쇄 가격 28) · `tag--mini`(한 줄 14px) |
| 끈 | `tag--hung` |
| 놓기 | `.is-dropping`(320ms) 또는 부모 `.drop-in` |

쓰이는 곳: 가격(pricing 3장 · product · index), KPI 숫자(dashboard "412상자"), 칸반 수량 꼬리표(`.count`), 캐러셀 라벨, 페이지네이션 현재 쪽, 툴팁.

---

## 6. 아이콘 · 농산물 일러스트

```html
<svg class="icon" data-icon="search"></svg>                     <!-- 22px 선 아이콘, app.js가 그린다 -->
<span class="ill" data-ill="goguma" style="--ill:150px"></span>  <!-- 판화 같은 2색 일러스트 -->
```
- 아이콘(`data-icon`): search close menu chev-left chev-right chev-down arrow-right arrow-left check plus minus sun moon cart basket calendar box truck leaf sprout note mail board chart user users gear flyer tag phone pin clock warn info frost trash copy edit send more scissors logout pause play replay filter stamp sort print card bell door grip. 크기 `icon--s`(18) `icon--l`(28). 버튼 안 아이콘만 있으면 버튼에 `aria-label`.
- 일러스트(`data-ill`, 120×120): goguma(밤고구마) baechu(배추) mu(동치미무) gam(대봉감) pyogo(표고) jjokpa(쪽파) kong(쥐눈이콩) oil(들기름) hobak(늙은호박) egg(유정란) ssal(햅쌀) sagwa(사과) ssam(쌈채소) basket(소쿠리) box(꾸러미 상자) · empty-stall(빈 좌판, 4:3).
  크기는 `style="--ill:96px"`. 장식이면 그대로(자동 `aria-hidden`), 뜻이 있으면 `role="img" aria-label="밤고구마"`.
- 색은 CSS 클래스(`.f-goguma` 등)로 칠한다. SVG presentation attribute에 `var()`를 쓰지 않는다. 직접 SVG를 그릴 때도 `style="fill:var(--x)"` 또는 `currentColor`.

---

## 7. 컴포넌트 32 (알파벳순)

### accordion — 보관법 · 손질법 쪽지 접기
```html
<div class="acc" data-single>
  <div class="acc__item">
    <h3 class="acc__head"><button class="acc__btn" type="button" aria-expanded="true" aria-controls="faq-1">꾸러미를 한 주 건너뛸 수 있나요?</button></h3>
    <div class="acc__panel" id="faq-1"><p>주문 마감(화요일 23:59) 전까지 구독 관리에서 <strong>건너뛰기</strong>를 켜면 됩니다.</p></div>
  </div>
  <div class="acc__item">
    <h3 class="acc__head"><button class="acc__btn" type="button" aria-expanded="false" aria-controls="faq-2">상자가 깨져 왔어요</button></h3>
    <div class="acc__panel" id="faq-2" hidden><p>…</p></div>
  </div>
</div>
```
열림 표시 = 오른쪽 위 접힌 종이 모서리가 펴짐. `data-single`이면 하나만 열림. 비활성: `disabled`.

### alert — 마을 회관 공고문
```html
<div class="alert alert--frost" role="status">
  <span class="dojang dojang--s alert__stamp" aria-hidden="true">서리</span>
  <div><strong class="alert__title">서리 경보 — 쌈채소 30% 피해</strong>
       <p class="alert__body">44주차 쌈채소 모둠은 400g → 300g으로 조정합니다.</p>
       <div class="alert__actions"><a class="btn btn--paper btn--s" href="inbox.html">쪽지 보기</a></div></div>
  <button class="alert__close" type="button" data-dismiss aria-label="공고 닫기"><svg class="icon" data-icon="close"></svg></button>
</div>
```
변형: `alert--frost`(서리 · 쪽빛) `alert--due`(마감 임박 · 볕) `alert--soldout`(품절 · 인주, `role="alert"`) `alert--ok`(완료 · 배추) · `alert--strip`(그림자 없는 점선 띠 공고). 닫기는 `data-dismiss`.

### badge — 작은 도장 · 수량 꼬리표 · 아바타
```html
<span class="badge">품절</span>
<span class="badge badge--ok">수확 완료</span>
<span class="badge badge--info"><svg class="icon" data-icon="frost"></svg>서리</span>
<span class="badge badge--warn">수확 지연</span>
<span class="badge badge--muted">지난 장</span>
<span class="badge badge--solid">예약 312/400</span>
<span class="badge badge--seal">산지직송</span>
<span class="badge badge--round">새</span>
<span class="count">14</span> <span class="count count--stamp">2</span>   <!-- 수량 미니 가격표 -->
<span class="dot"></span> <span class="dot dot--ok"></span>               <!-- 새 쪽지 점 -->
<span class="avatar avatar--goguma">순</span>                             <!-- 아래 글자표 그대로, 손글씨 -->
```
**아바타 글자 규칙:** 성을 뺀 이름의 **첫 글자**. 단 순우리말 두 글자 이름(하늘 · 가람)은 첫 글자가 흔한 음절이라 **끝 글자**를 쓴다. 사람이 아닌 곳은 이름 첫 글자. 아래 표가 전부이고, 새 사람이 생기면 표에 먼저 더한다.

| 누구 | 글자 | 색 |
|---|---|---|
| 한정민 (사무국 · A1 사무국 천막) | 정 | `avatar--sun` |
| 윤가람 (포장·발송 · B1 김장 예약판) | 람 | `avatar--cabbage` |
| 김순례 NG-01 | 순 | `avatar--goguma` |
| 박동수 NG-04 | 동 | `avatar--cabbage` |
| 이하늘 NG-12 | 늘 | `avatar--indigo` |
| 최영자 NG-07 | 영 | `avatar--ochre` |
| 오덕만 NG-09 | 덕 | `avatar--ink2` |
| 송미경 NG-15 | 미 | `avatar--stamp` |
| 정유나 BB-0412 | 유 | `avatar--indigo` |
| 조민재 BB-0877 | 민 | `avatar--ochre` |
| 서지원 BB-1284 (새 구독자) | 지 | `avatar--cabbage` |
| 우체국 홍동 | 우 | `avatar--ink2` |
| 망원 마당 관리인 | 망 | `avatar--ink2` |
| 홍성군 농업기술센터 | 농 | `avatar--ink2` |
| 공동 수매 (햅쌀) | 쌀 | `avatar--sun` |
| 이름 없는 농가 NG-03·05·11·20 | 농 | `avatar--ochre` / `--ink2` / `--goguma` |

`avatar--goguma` · `avatar--indigo`는 `--goguma-fill` · `--indigo-fill` 면을 쓴다(밤에도 깊은 색). 크기 `avatar--s`(32) `avatar--l`(72).

### breadcrumb — 발자국 점
```html
<nav class="crumbs" aria-label="위치"><ol>
  <li><a href="../index.html">홍동</a></li>
  <li><a href="profile.html">문당리</a></li>
  <li><span aria-current="page">김순례 농가</span></li>
</ol></nav>
```

### button — 인주 면 · 갱지 쪽지 · 밑줄 · 도장 아이콘
```html
<button class="btn btn--primary" type="button">꾸러미 담기</button>          <!-- 인주 면 + 3px 밑단, 누르면 도장 찍힘 -->
<button class="btn btn--paper" type="button">생산자 이야기</button>         <!-- 보조 -->
<button class="btn btn--cabbage" type="button">발송 처리</button>
<button class="btn btn--sun" type="button">장날 길 찾기</button>
<button class="btn btn--danger" type="button">구독 해지</button>
<button class="btn btn--ghost" type="button">건너뛰기</button>             <!-- 배추·인주 띠 위: btn--ghost btn--on-dark -->
<button class="btn btn--icon" type="button" aria-label="장바구니"><svg class="icon" data-icon="cart"></svg></button>
<a class="btn btn--paper" href="pricing.html">꾸러미 가격표</a>
```
크기 `btn--s`(36, 터치 기기 44) · `btn--l`(56) · `btn--block`. 상태: hover · focus-visible · `:active`(종이를 누름: 2px 내려가고 밑단 사라짐) · `disabled`/`aria-disabled="true"`(빛바랜 빗금) · `aria-busy="true"`(도는 도장, 글자는 `<span>`으로 감쌀 것) · `aria-pressed="true"`(켜짐 = 먹 면).
로딩 시연: `data-loading="1600"` (+ `data-toast="주문서를 보냈습니다" data-toast-body data-toast-seal="접수"` 이면 끝나고 토스트).

### calendar — 24절기 장날 달력
```html
<div class="cal" data-cal-month="2026-10"></div>
```
app.js가 일요일 시작 격자를 그린다: 장날(둘째·넷째 토) = 인주 원 + "장날", 절기 = 손글씨 절기명, 오늘(10/24) = 볕 면, 고르면 먹 테두리(`aria-pressed`) + 아래 한 줄 안내("10월 24일(토) · 절기… · 상강 장날 10:00–15:00 망원 마당"). 화살표 키로 날짜 이동, 이전/다음 달 버튼.
옵션: `data-cal-today="2026-10-24"` · `data-cal-selected="2026-11-14"` · `data-cal-nav="off"`(달 넘김 버튼 없음). 너비는 부모를 따르며 최대 520px.

### card — 갱지 쪽지 (진열용 아님)
```html
<article class="card card--link">
  <span class="card__kicker">생산자 NG-01 · 문당리</span>
  <h3 class="card__title"><a href="profile.html">김순례 농가</a></h3>
  <p class="card__body">농사 41년, 밭 1,980㎡(600평). 올해 밤고구마는 10월 22일(목)에 캤다.</p>
  <div class="card__foot"><span class="badge badge--ok">수확 완료</span><span class="num">19,000원</span></div>
</article>

<div class="card card--produce card--pinked">
  <span class="ill" data-ill="gam"></span>
  <h3 class="card__title">장곡 대봉감 5kg</h3>
  <span class="tag tag--s"><span class="tag__price--print">28,000<span class="unit">원</span></span></span>
</div>

<div class="card card--farmer">
  <span class="avatar avatar--l avatar--goguma">순</span>
  <div class="card__who"><span class="card__name">김순례</span><span class="card__id">NG-01</span><span class="t-small t-dim">홍동면 문당리 · 밤고구마 · 들깨</span></div>
</div>
```
변형: `card--pinked`(위 핑킹) `card--sunk` `card--flat` `card--link`(전체가 링크, 들림) · 상태 `.is-selected`/`aria-selected="true"`(인주 테두리) · `.is-disabled`(품절) · 모서리 도장 `<span class="card__corner dojang dojang--s">품절</span>`.

### carousel — 이번 주 꾸러미 10가지
```html
<div class="carousel" aria-roledescription="캐러셀" aria-label="상강 꾸러미 10가지">
  <div class="carousel__head">
    <h2 class="t-hand-m">상강 꾸러미 10가지</h2>
    <div class="carousel__ctrl">
      <span class="carousel__status" aria-live="polite">1 / 10</span>
      <button class="btn btn--icon" type="button" data-carousel="prev" aria-label="이전 품목"><svg class="icon" data-icon="chev-left"></svg></button>
      <button class="btn btn--icon" type="button" data-carousel="next" aria-label="다음 품목"><svg class="icon" data-icon="chev-right"></svg></button>
    </div>
  </div>
  <div class="carousel__viewport" tabindex="0" aria-label="품목 넘기기">
    <ul class="carousel__track">
      <li class="carousel__slide"><span class="ill" data-ill="goguma"></span><span class="tag tag--mini">밤고구마 1kg</span></li>
      … (팩트 시트 10가지 그대로: 가을배추 1통 · 동치미무 1개 · 쪽파 한 단 · 참나무 표고 200g · 대봉감 3개 · 쥐눈이콩 300g · 햇들기름 소병(100ml) · 늙은호박 ¼쪽 · 유정란 10구)
    </ul>
  </div>
  <div class="carousel__names"><button class="carousel__name" type="button">밤고구마</button> … </div>
</div>
```
점 대신 품목 이름 줄(현재 = 인주 밑줄, `aria-current="true"` 자동). 좌판 널빤지 한 줄 위에 바닥 정렬. ←/→ 키.

### code — 등사지 쪽지
```html
<div class="code">
  <div class="code__head"><span class="code__file">GET /v1/kkureomi/2644</span>
    <button class="code__copy" type="button" data-copy="#code-order"><svg class="icon icon--s" data-icon="copy"></svg><span class="code__copy-label">복사</span></button></div>
  <pre class="code__pre" id="code-order" tabindex="0"><code><span class="tk-c">// 44주차 식구 꾸러미 (서지원 BB-1284 · 첫 주문)</span>
{ <span class="tk-p">"order"</span>: <span class="tk-s">"BK-2644-0301"</span>, <span class="tk-p">"price"</span>: <span class="tk-n">36000</span> }</code></pre>
</div>
```
토큰 색: `tk-k`(키워드) `tk-s`(문자열) `tk-n`(숫자) `tk-c`(주석) `tk-p`(속성). 인라인 코드는 `<code>`만.

### command — ⌘K 장터 안내소
실제 레이어는 3-3 스니펫. 지면에 펼친 견본은 레이어 대신 `.command.command--static`(scrim 없음, `hidden` 없음, 결과 하나에 `aria-selected="true"`):
```html
<div class="command command--static">
  <div class="command__sheet" role="dialog" aria-label="장터 안내소 견본">
    <label class="command__ask" for="cmd-demo">무엇을 찾으세요?</label>
    <div class="command__field"><svg class="icon" data-icon="search"></svg><input class="command__input" id="cmd-demo" role="combobox" aria-expanded="true" aria-controls="cmd-demo-list" value="고구"></div>
    <ul class="command__list" id="cmd-demo-list" role="listbox" aria-label="찾은 것">…3-3과 같은 구조, 첫 항목 aria-selected="true"…</ul>
    <div class="command__foot">…</div>
  </div>
</div>
```
검색은 글자 + `data-keywords`로 거른다(띄어쓰기 무시). ↑/↓ 고르기 · Enter 열기 · Esc 닫기 · ⌘K/Ctrl+K 열고 닫기. 결과 없으면 `.command__empty`.

### drawer — 장바구니 쪽지 (오른쪽에서 밀려 들어옴)
```html
<div class="layer drawer" id="cart" hidden>
  <div class="layer__scrim" data-close></div>
  <div class="drawer__panel" role="dialog" aria-modal="true" aria-labelledby="cart-title" data-cart>
    <div class="drawer__head"><h2 class="drawer__title" id="cart-title">장바구니 쪽지</h2>
      <button class="drawer__x" type="button" data-close aria-label="닫기"><svg class="icon" data-icon="close"></svg></button></div>
    <div class="drawer__body">
      <div class="cart-line" data-price="19000">
        <span class="cart-line__name">문당리 밤고구마 3kg</span><span class="cart-line__meta">김순례 NG-01</span>
        <span class="cart-line__price">19,000원</span>
        <div class="qty"><button type="button" data-qty-step="-1" aria-label="하나 빼기"><svg class="icon" data-icon="minus"></svg></button><input type="number" value="1" min="0" max="9" aria-label="밤고구마 수량"><button type="button" data-qty-step="1" aria-label="하나 더"><svg class="icon" data-icon="plus"></svg></button></div>
      </div>
    </div>
    <div class="drawer__foot">
      <div class="drawer__sum"><span class="drawer__note">배송비 포함 · <span data-cart-count>1</span>가지</span>
        <span class="tag tag--sun tag--s"><span class="tag__price--print"><span data-cart-total>19,000</span><span class="unit">원</span></span></span></div>
      <button class="btn btn--primary btn--block" type="button" data-open="#order">주문서 쓰기</button>
    </div>
  </div>
</div>
<button class="btn btn--paper" type="button" data-open="#cart"><svg class="icon" data-icon="basket"></svg>장바구니</button>
```
수량을 바꾸면 줄 금액 · 합계 · 개수가 다시 계산된다(`data-cart` 안의 `data-price`). 지면 견본: `.drawer.drawer--static`(레이어·scrim·hidden 없이). 합계 가격표는 줄어들지 않는다(`.drawer__sum .tag { flex: none }`, 가격 `nowrap`) — 메모가 길어도 `43,00 / 0원`처럼 끊기지 않는다. '주문서 쓰기'로 모달을 열면 드로어는 접힌다.

### empty — 빈 좌판
```html
<div class="empty">
  <div class="empty__ill"><span class="ill" data-ill="empty-stall"></span><span class="dojang dojang--m" aria-hidden="true">다음<small>11/14</small></span></div>
  <div><span class="empty__msg">오늘은 장이 파했어요</span>
       <p class="empty__sub">다음 장날은 11월 14일(토) 입동 장날이에요.</p>
       <div class="empty__actions"><a class="btn btn--paper" href="../index.html">장날 전단 보기</a></div></div>
</div>
```
작은 빈칸: `empty--compact`(일러스트 96px, 손글씨 40px) — 예: 일러스트 `basket`, "아직 들어온 주문이 없어요".

### form — 신청 엽서
```html
<form class="postcard" data-validate novalidate data-success="첫 꾸러미 신청을 받았습니다" data-success-body="첫 도착 10월 31일(토)" data-success-seal="접수">
  <div class="postcard__stamp-box"><span class="dojang dojang--s dojang--1">볕</span></div>
  <h2 class="postcard__title">첫 꾸러미 신청 엽서</h2>
  <p class="postcard__lead">③ 받는 날 · 주소</p>
  <div class="postcard__body">
    <fieldset class="field">
      <legend class="field__label">꾸러미 크기</legend>
      <div class="picks">
        <label class="pick"><input type="radio" name="size" value="solo"><span class="tag tag--s tag--gangji"><span class="tag__name">홀로</span><span class="tag__price--print">23,000</span></span><span class="dojang dojang--s pick__mark" aria-hidden="true">선택</span></label>
        <label class="pick"><input type="radio" name="size" value="family" checked><span class="tag tag--s tag--gangji"><span class="tag__name">식구</span><span class="tag__price--print">36,000</span></span><span class="dojang dojang--s pick__mark" aria-hidden="true">선택</span></label>
        <label class="pick"><input type="radio" name="size" value="big"><span class="tag tag--s tag--gangji"><span class="tag__name">큰집</span><span class="tag__price--print">52,000</span></span><span class="dojang dojang--s pick__mark" aria-hidden="true">선택</span></label>
      </div>
    </fieldset>
    <fieldset class="field">
      <legend class="field__label">못 먹는 것</legend>
      <div class="checks">
        <label class="check check--strike"><input type="checkbox" checked><span class="check__box"></span><span class="check__text">고수</span></label>
        <label class="check check--strike"><input type="checkbox" checked><span class="check__box"></span><span class="check__text">생강</span></label>
      </div>
    </fieldset>
    <div class="field__row">
      <div class="field">
        <label class="field__label" for="zip">우편번호 <span class="req" aria-hidden="true">*</span></label>
        <input class="input" id="zip" name="zip" inputmode="numeric" pattern="[0-9]{5}" required value="0397" aria-invalid="true" aria-describedby="zip-err">
        <p class="field__error" id="zip-err"><span class="dojang dojang--xs" aria-hidden="true">확인</span>우편번호는 숫자 5자리예요</p>
      </div>
      <div class="field">
        <label class="field__label" for="day">받는 날</label>
        <select class="select" id="day"><option>토요일 (금 발송)</option><option>금요일 (목 발송)</option></select>
      </div>
    </div>
    <div class="field">
      <label class="field__label" for="addr">주소</label>
      <input class="input" id="addr" value="서울 마포구 성미산로 22" required>
      <p class="field__hint">공동현관 비밀번호는 쪽지로 따로 남겨 주세요</p>
    </div>
    <div class="form-actions"><button class="btn btn--primary" type="submit">엽서 보내기</button><a class="btn btn--ghost" href="onboarding.html">이전 단계</a></div>
  </div>
</form>
```
- 엽서 견본 값은 **새 구독자 서지원 BB-1284**(첫 신청 · 서울 마포구 성미산로 22, 우편번호 03977 — 오류 견본은 4자리 `0397`). 정유나는 이미 받는 구독자라 신청 엽서에 쓰지 않는다. `망원로8길 34`는 장터 주소라 받는 곳 값으로 쓰지 않는다.
- 입력: `.input` `.select` `.textarea`, 단위 `.input-group > .input + .input-group__unit`(kg·상자·원). 상태: hover · focus(인주 밑줄 3px) · `aria-invalid="true"` · `disabled`(점선 밑줄) · `readonly`.
- 체크 = 인주 원 도장 + 체크(`.check`), `check--strike`(체크하면 글자에 먹줄 — 못 먹는 것), `check--radio`(동그라미 단일 선택). 묶음 `.checks`.
- 라디오 = 가격표 고르기(`.picks > .pick`): 고르면 볕 면 + 위로 들리고 "선택" 도장.
- 두 칸 고르기 `.seg`(매주/격주):
  ```html
  <div class="seg" role="radiogroup" aria-label="받는 주기"><label><input type="radio" name="cycle" data-cycle="weekly" checked><span>매주</span></label><label><input type="radio" name="cycle" data-cycle="biweekly"><span>격주</span></label></div>
  <span class="num" data-price-weekly="36000" data-price-biweekly="37500">36,000</span>  <!-- 바꾸면 숫자가 바뀌고 가격표가 다시 놓인다 -->
  <span data-cycle-label>매주</span>
  ```
- 스위치 = 볕 노브: `<button class="switch" type="button" role="switch" aria-checked="true" data-on="받음" data-off="안 받음"><span class="switch__track"></span>카카오 알림톡 <span class="switch__state">받음</span></button>`
- 수량: `.qty`(drawer 참고). 검증: `form[data-validate]` 제출 시 `required`/`pattern` 확인 → 틀린 칸 `aria-invalid` + `.field__error` 보임 + 첫 칸 포커스, 맞으면 로딩 → 토스트.

### kanban — 44주차 작업판
```html
<div class="board" style="--cols:4">
  <section class="board__col" aria-labelledby="col-wait">
    <div class="board__head"><h3 class="board__title" id="col-wait">수확 대기</h3><span class="count" data-count>5</span>
      <div class="boxes boxes--s" data-value="5" data-max="14" data-unit="장"><span class="boxes__label"></span></div></div>
    <ul class="board__list" data-empty="비었어요">
      <li class="kcard is-warn" tabindex="0" aria-describedby="kb-help">
        <span class="count kcard__tail">40</span>
        <span class="kcard__title">쌈채소 모둠 300g</span><span class="kcard__id">PM-031</span>
        <div class="kcard__meta"><span class="avatar avatar--s avatar--indigo">늘</span>이하늘 · 금평리</div>
        <div class="kcard__foot"><span class="badge badge--info">서리</span>10/29(목) 수확</div>
      </li>
    </ul>
  </section>
  … 선별 · 포장 · <section class="board__col" data-done>발송 완료</section>
</div>
<p class="sr-only" id="kb-help">←, → 키로 옆 단계로 옮기고 ↑, ↓ 키로 같은 단계 안에서 움직입니다.</p>
```
옮기면 열 개수(`data-count`)가 다시 세지고, `data-done` 열의 카드는 `.is-done`. 끌어 놓기도 된다. 상태 `.is-lifted` `.is-dragging` `.board__list.is-over` `.is-warn`(서리) `.is-done`. 빈 열은 `data-empty` 글자를 손글씨로. 1024px 이하 가로 스크롤(열 82%).
일괄 처리 바는 table의 `.bulkbar`를 그대로 쓴다.

### list — 장부 줄
```html
<ul class="ledger">
  <li><a class="ledger__row is-unread" href="inbox.html" aria-current="true">
    <span class="avatar avatar--indigo">늘</span>
    <span class="ledger__main"><span class="ledger__name">이하늘 <span class="t-mono">NG-12</span></span>
      <span class="ledger__text">쌈채소 서리 피해 30% — 44주차 400g → 300g 조정 부탁</span></span>
    <span class="ledger__time">08:47</span></a></li>
  <li><div class="ledger__row"><span class="avatar avatar--goguma">순</span>
    <span class="ledger__main"><span class="ledger__name">김순례</span><span class="ledger__text">햇들기름 이번 주</span></span>
    <span class="ledger__qty">40<span class="unit">병</span></span></div></li>
</ul>
```
변형 `ledger--compact`. 정의형 장부: `<dl class="ledger-dl"><dt>다음 도착</dt><dd>10월 31일(토)</dd>…</dl>`.
**목록 → 읽기 화면 전환(쪽지함 모바일)**: 감싸는 요소에 `data-panes data-pane="list"`, 목록 칸 `.panes__list`, 읽기 칸 `.panes__detail`(id), 목록 줄에 `data-pane-open="#letter"`, 돌아가기 `<button class="btn btn--ghost panes__back" type="button" data-pane-back>쪽지 목록</button>`. 900px 이하에서 한 번에 한 칸만 보인다.

### marquee — 장날 안내 띠
```html
<div class="marquee marquee--stamp">
  <div class="marquee__viewport"><div class="marquee__track">
    <ul class="marquee__group">
      <li class="marquee__item">상강 장날 · 10월 24일(토) 10:00–15:00</li>
      <li class="marquee__item">망원 마당 좌판 14자리</li>
      <li class="marquee__item">밤고구마 3kg 19,000원</li>
      <li class="marquee__item">김장 절임배추 예약 312/400상자</li>
    </ul>
  </div></div>
  <button class="marquee__toggle" type="button" data-marquee-toggle aria-pressed="false" aria-label="안내 띠 멈추기"><svg class="icon" data-icon="pause"></svg></button>
</div>
```
기본 = 볕 바탕(밤엔 알전구 띠), `marquee--stamp` = 인주 면. app.js가 그룹을 한 벌 복제(aria-hidden). 40초 한 바퀴, hover·포커스·멈춤 버튼으로 정지, reduced-motion이면 멈춘 줄(가로 스크롤).

### menu — 쪽지 드롭다운
```html
<div class="menu-wrap">
  <button class="btn btn--paper" type="button" data-menu="#box-menu">꾸러미 설정 <svg class="icon" data-icon="chev-down"></svg></button>
  <ul class="menu" id="box-menu" role="menu" aria-label="꾸러미 설정" hidden>
    <li role="none"><button class="menu__item" role="menuitem" type="button"><svg class="icon" data-icon="calendar"></svg>11/7 꾸러미 건너뛰기</button></li>
    <li role="none"><button class="menu__item" role="menuitem" type="button"><svg class="icon" data-icon="box"></svg>크기 바꾸기</button></li>
    <li role="separator" class="menu__sep"></li>
    <li role="none"><button class="menu__item menu__item--danger" role="menuitem" type="button"><svg class="icon" data-icon="logout"></svg>구독 해지</button></li>
  </ul>
</div>
```
`menu--left`(왼쪽 정렬) · 머리 `<li><span class="menu__label">정렬</span></li>` · 고르기 `role="menuitemradio" aria-checked` / `menuitemcheckbox` · 비활성 `aria-disabled="true"` · 누른 뒤 안 닫기 `data-keep`. ↑/↓/Home/End · Esc(트리거로 포커스) · Tab · 바깥 클릭. 지면 견본 `menu menu--static`(hidden 없이, `z-index:auto` — 바로 위에서 열린 진짜 메뉴가 견본 밑으로 깔리지 않는다).

### modal — 떨어진 주문서 쪽지
```html
<div class="layer modal" id="order" hidden>
  <div class="layer__scrim" data-close></div>
  <div class="modal__sheet" role="dialog" aria-modal="true" aria-labelledby="order-title">
    <div class="modal__head"><span class="dojang dojang--s" aria-hidden="true">주문</span>
      <h2 class="modal__title" id="order-title">주문서 확인<span class="modal__sub">BK-2644-0187 · 정유나 BB-0412</span></h2>
      <button class="modal__x" type="button" data-close aria-label="닫기"><svg class="icon" data-icon="close"></svg></button></div>
    <div class="modal__body"><table class="modal__lines"><tbody>
      <tr><td>식구 꾸러미 (매주)</td><td>36,000원</td></tr><tr><td>햇들기름 350ml</td><td>24,000원</td></tr><tr><td>합계</td><td>60,000원</td></tr>
    </tbody></table></div>
    <div class="modal__cut" aria-hidden="true"><svg class="icon" data-icon="scissors"></svg></div>
    <div class="modal__foot"><button class="btn btn--ghost" type="button" data-close>더 담기</button>
      <button class="btn btn--primary" type="button" data-close data-toast="주문서를 보냈습니다" data-toast-body="10월 31일(토) 도착" data-toast-seal="접수">주문서 보내기</button></div>
  </div>
</div>
<button class="btn btn--primary" type="button" data-open="#order">주문서 열기</button>
```
위에서 떨어져 −1.2°로 놓인다(모바일 0°). 포커스 트랩 · Esc · scrim 클릭 · 닫히면 트리거로 포커스 복귀. 지면 견본: `<div class="modal modal--static">`(layer · scrim · hidden 없이 `.modal__sheet`만).

### motion — 찍기 · 놓기 · 볕 차오름 시연
```html
<div class="motion-demo">
  <div class="motion-demo__cell"><div class="motion-demo__stage"><span class="dojang dojang--m" id="mo-stamp">찍기</span></div>
    <span class="motion-demo__name">찍기</span><span class="motion-demo__spec">260ms · cubic-bezier(.2,1.5,.4,1)</span>
    <button class="btn btn--paper btn--s" type="button" data-replay="#mo-stamp" data-motion="stamp">다시 보기</button></div>
  <div class="motion-demo__cell"><div class="motion-demo__stage"><span class="tag" id="mo-drop"><span class="tag__name">놓기</span></span></div>
    <span class="motion-demo__name">놓기</span><span class="motion-demo__spec">320ms · cubic-bezier(.3,1.35,.5,1)</span>
    <button class="btn btn--paper btn--s" type="button" data-replay="#mo-drop" data-motion="drop">다시 보기</button></div>
  <div class="motion-demo__cell"><div class="motion-demo__stage"><span class="motion-demo__sun" id="mo-sun" aria-hidden="true"><span class="motion-demo__sun-title">상강 장날</span><span class="motion-demo__sun-plank"><span class="ill" data-ill="goguma"></span><span class="ill" data-ill="gam"></span><span class="ill" data-ill="baechu"></span></span></span></div>
    <span class="motion-demo__name">볕 차오름</span><span class="motion-demo__spec">900ms · clip-path</span>
    <button class="btn btn--paper btn--s" type="button" data-replay="#mo-sun" data-motion="sun">다시 보기</button></div>
</div>
```
볕 차오름 견본은 빈 노란 네모가 아니라 **첫 화면을 작게 오린 조각**(손글씨 "상강 장날" + 좌판 3가지)이 위에서 아래로 드러나는 모습이다.
`motion-demo__note`에 reduced-motion 설명: "움직임 줄이기를 켜면 찍힌 상태·놓인 상태로 바로 보이고 안내 띠는 멈춥니다."

### navbar · footer
3-1 · 3-2 스니펫 그대로.

### pagination — 장부 쪽수
```html
<nav class="pager" aria-label="출하 장부 쪽"><ul>
  <li><a class="pager__btn pager__btn--step" href="kanban.html" aria-label="이전 쪽" aria-disabled="true"><svg class="icon" data-icon="chev-left"></svg></a></li>
  <li><a class="pager__btn" href="kanban.html" aria-current="page">1</a></li>
  <li><a class="pager__btn" href="kanban.html">2</a></li>
  <li><span class="pager__gap">…</span></li>
  <li><a class="pager__btn" href="kanban.html">12</a></li>
  <li><a class="pager__btn pager__btn--step" href="kanban.html" aria-label="다음 쪽"><svg class="icon" data-icon="chev-right"></svg></a></li>
</ul></nav>
```
현재 쪽 = 작은 가격표. 시연용으로 쪽이 실제로 넘어가게 하려면 `<nav class="pager" data-demo>` + `<button class="pager__btn" type="button">`, 이전/다음 버튼에 `data-step="prev|next"`, 안내 `<span class="pager__info" data-total="12">1쪽 / 12쪽</span>`.

### popover — 생산자 명함 쪽지
```html
<div class="pop-wrap">
  <button class="btn btn--paper" type="button" data-popover="#card-kim">좌판 A3 · 김순례</button>
  <div class="popover" id="card-kim" role="dialog" aria-label="김순례 생산자 명함" hidden>
    <div class="popover__head"><span class="avatar avatar--goguma">순</span><div><span class="popover__name">김순례</span><span class="popover__id">NG-01</span></div></div>
    <dl class="popover__rows"><dt>마을</dt><dd>홍동면 문당리</dd><dt>품목</dt><dd>밤고구마 · 들깨</dd><dt>농사</dt><dd>41년</dd></dl>
    <span class="popover__memo">들기름 시연 12:30</span>
  </div>
</div>
```
위치 `popover--top` · `popover--end`(오른쪽 끝 맞춤) · `popover--start`(왼쪽 끝 맞춤 — 화면 왼쪽 가장자리 트리거, 좌판 A1–A3 · B1–B3). 바깥 클릭 · Esc(트리거로 포커스). 지면에 열린 견본: `popover popover--static`(hidden 없이, `role="group"`).

### progress — 상자 칸 채우기
```html
<div class="boxes boxes--l" data-value="7" data-max="10" data-unit="상자" aria-label="식구 꾸러미 포장"><span class="boxes__label"></span></div>
<div class="boxes" data-value="389" data-max="412" data-unit="상자 도착" aria-label="43주차 도착 확인"><span class="boxes__label"></span></div>
<div class="boxes boxes--busy" data-value="0" data-max="10" aria-label="세는 중"><span class="boxes__label">세는 중</span></div>
```
app.js가 칸(최대 10, `data-cells`로 바꿈)과 `role="progressbar"` 값을 채운다. 변형 `boxes--s` `boxes--l` `boxes--warn`(볕) `boxes--done`. 원형 진행 없음. 칸 줄은 `flex-wrap` · `max-width:100%`이고 `boxes--l` 칸은 `clamp(18px, 7.5vw, 30px)`로 줄어든다(360px에서 넘치지 않음). 작업판 열 머리 `.boxes`는 카드를 옮기면 app.js가 다시 그린다.
판매 가로 막대(값 직접 표기):
```html
<ul class="hbar">
  <li class="hbar__row hbar__row--goguma" style="--v:92%"><span class="hbar__name">밤고구마</span><span class="hbar__track"><span class="hbar__fill"></span><span class="hbar__val">₩1,862,000</span></span></li>
</ul>
```
색 `hbar__row--goguma/cabbage/leaf/sun/stamp/indigo`(기본 황토) — 고구마·잎·쪽빛 막대는 `*-fill` 토큰.

### sidebar — 집하장 칠판
3-4 스니펫 그대로.

### skeleton — 아직 안 쓴 가격표
```html
<div class="skel-card" aria-busy="true"><span class="sr-only">불러오는 중</span>
  <span class="skel skel--avatar"></span>
  <div class="skel-lines"><span class="skel skel--hand" style="--w:50%"></span><span class="skel skel--line" style="--w:90%"></span></div>
</div>
<span class="skel skel--tag"></span>  <span class="skel skel--block"></span>
```

### spinner — 도는 도장 · 절구 공이
```html
<span class="spin" role="status"><span class="spin__seal" aria-hidden="true">볕</span>장부 펴는 중</span>
<span class="spin spin--pestle" role="status"><span class="spin__dots" aria-hidden="true"><i></i><i></i><i></i></span>들기름 짜는 중</span>
```
`spin--l` = 64px 도장. 글자를 안 보이게 하려면 글자를 `<span class="sr-only">`로.

### steps — 수확 → 선별 → 포장 → 발송 → 도착
```html
<ol class="steps" id="box-steps">
  <li class="steps__item is-done"><span class="steps__mark"></span><span class="steps__text"><span class="steps__name">수확</span><span class="steps__when">10/22(목)</span></span></li>
  <li class="steps__item is-done"><span class="steps__mark"></span><span class="steps__text"><span class="steps__name">선별</span><span class="steps__when">10/22(목)</span></span></li>
  <li class="steps__item" aria-current="step"><span class="steps__mark"></span><span class="steps__text"><span class="steps__name">포장</span><span class="steps__when">10/23(금) 오전</span></span></li>
  <li class="steps__item"><span class="steps__mark"></span><span class="steps__text"><span class="steps__name">발송</span><span class="steps__when">10/23(금) 오후</span></span></li>
  <li class="steps__item"><span class="steps__mark"></span><span class="steps__text"><span class="steps__name">도착</span><span class="steps__when">10/24(토)</span></span></li>
</ol>
<button class="btn btn--sun" type="button" data-steps-next="#box-steps">다음 단계</button>
<button class="btn btn--ghost" type="button" data-steps-prev="#box-steps">이전</button>
```
완료 = "완료" 인주 도장(새로 끝난 단계는 찍기 모션), 현재 = 볕 면 + 인주 밑줄, 앞으로 = 점선 원, 문제 = `.is-error`. 세로 `steps--v`(640px 이하 자동). 배추 띠 위에서는 도장이 볕색으로 바뀐다. 온보딩 4단계 엽서도 같은 마크업.

### table — 출하 장부
```html
<div data-select-scope>
  <div class="bulkbar" hidden><span class="bulkbar__count">선택한 <span class="num" data-bulk-count>0</span>건</span>
    <div class="bulkbar__actions"><button class="btn btn--sun btn--s" type="button" data-toast="선택한 품목을 발송 처리했습니다" data-toast-seal="발송">발송 처리</button><button class="btn btn--ghost btn--s" type="button" data-bulk-clear>선택 풀기</button></div></div>
  <div class="tbl-wrap tbl-wrap--cards">
    <table class="tbl">
      <caption>43주차 출하 장부<small>10월 24일 09:40 기준</small></caption>
      <thead><tr>
        <th class="is-check"><label class="check"><input type="checkbox" data-select-all aria-label="모두 고르기"><span class="check__box"></span></label></th>
        <th scope="col" aria-sort="none"><button class="tbl__sort" type="button">품목</button></th>
        <th scope="col">코드</th>
        <th scope="col" class="is-num" data-sort="num" aria-sort="none"><button class="tbl__sort" type="button">가격</button></th>
        <th scope="col">상태</th>
      </tr></thead>
      <tbody>
        <tr>
          <td class="is-check"><label class="check"><input type="checkbox" data-select-row aria-label="밤고구마 고르기"><span class="check__box"></span></label></td>
          <td class="tbl__lead" data-label="품목"><span class="tbl__item">문당리 밤고구마<small>김순례 NG-01 · 3kg</small></span></td>
          <td class="is-mono" data-label="코드">PM-014</td>
          <td class="is-num" data-label="가격" data-value="19000">19,000원</td>
          <td data-label="상태"><span class="badge badge--ok">판매 중</span></td>
        </tr>
        <tr class="is-muted">… 서리태 PM-043 · <span class="badge">품절</span></tr>
      </tbody>
      <tfoot><tr><td colspan="3">합계</td><td class="is-num">…</td><td></td></tr></tfoot>
    </table>
  </div>
</div>
```
- 정렬: `<th data-sort="num|text" aria-sort="none">` 안의 `.tbl__sort` 버튼(오름 ↔ 내림, 값은 `data-value` 우선). 숫자 열 `is-num`(오른쪽 · Zilla Slab), 코드 열 `is-mono`.
- 선택: 행 체크 = 도장, 선택 행 `aria-selected="true"`(자동) = 인주 씻김 + 왼쪽 막대, 모두 고르기(반쯤 선택 표시), `.bulkbar`가 나타나 개수 표시.
- `tbl-wrap--cards`: 640px 이하에서 행이 "장부 카드"가 된다 — 각 `td`에 `data-label`, 머리 칸은 `tbl__lead`. 넣지 않으면 가로 스크롤.
- 품절 · 지난 행 `tr.is-muted`.

### tabs — 서류철 인덱스 탭
```html
<div class="tabs">
  <div class="tabs__list" role="tablist" aria-label="밤고구마 안내">
    <button class="tabs__tab" role="tab" id="tab-keep" aria-selected="true" aria-controls="panel-keep">보관법</button>
    <button class="tabs__tab" role="tab" id="tab-cook" aria-selected="false" aria-controls="panel-cook">손질법</button>
    <button class="tabs__tab" role="tab" id="tab-farm" aria-selected="false" aria-controls="panel-farm">생산자</button>
  </div>
  <div class="tabs__panel" role="tabpanel" id="panel-keep" aria-labelledby="tab-keep" tabindex="0"><p>신문지에 싸서 12–15℃ 그늘에 두세요.</p></div>
  <div class="tabs__panel" role="tabpanel" id="panel-cook" aria-labelledby="tab-cook" tabindex="0" hidden>…</div>
  <div class="tabs__panel" role="tabpanel" id="panel-farm" aria-labelledby="tab-farm" tabindex="0" hidden>…</div>
</div>
```
←/→ · Home/End. 탭 줄이 넘치면 가로 스크롤 + 오른쪽 페이드(끝에 닿으면 사라짐). 탭 안 개수 `<span class="count">3</span>`.

### timeline — 24절기 띠 · 오늘의 장날 일정
```html
<ol class="terms" style="--n:6">
  <li class="terms__item is-past"><span class="terms__dot"></span><span class="ill" data-ill="ssam"></span><span class="terms__name">추분</span><span class="terms__date">9/23</span><span class="terms__crop">햇땅콩, 토란</span></li>
  <li class="terms__item is-past">… 한로 10/8 · 햅쌀, 들깨 (ill: ssal)</li>
  <li class="terms__item is-now" aria-current="date">… 상강 10/23 · 밤고구마, 대봉감, 표고 (ill: goguma)</li>
  <li class="terms__item">… 입동 11/7 · 배추, 무, 쪽파 (ill: baechu)</li>
  <li class="terms__item">… 소설 11/22 · 절임배추, 늙은호박 (ill: hobak)</li>
  <li class="terms__item">… 대설 12/7 · 시래기, 메주콩 (ill: kong)</li>
</ol>

<ol class="day">
  <li class="day__item is-done"><span class="day__time">09:00</span><span class="day__dot"></span><span class="day__what">천막 14동 세우기<small>망원 마당 관리인 확인</small></span></li>
  <li class="day__item is-now"><span class="day__time">09:40</span><span class="day__dot"></span><span class="day__what">좌판 차리기 <span class="day__now">지금</span><small>13자리 출점</small></span></li>
  <li class="day__item"><span class="day__time">10:00</span><span class="day__dot"></span><span class="day__what">장 열림</span></li>
  <li class="day__item"><span class="day__time">12:30</span><span class="day__dot"></span><span class="day__what">햇들기름 짜기 시연<small>김순례 · 좌판 A3</small></span></li>
  <li class="day__item"><span class="day__time">15:00</span><span class="day__dot"></span><span class="day__what">파장</span></li>
</ol>
```
`terms`는 640px 이하에서 세로가 된다. 축은 새끼줄 무늬, 지금 절기 = 인주 원.

### toast — 쪽지 + 도장
```js
Byeot.toast({ title: '43주차 412상자 집하 완료', body: '우체국 홍동 · 어제 18:30', seal: '발송', tone: 'ok' })
```
또는 아무 버튼에 `data-toast="제목" data-toast-body="…" data-toast-seal="발송" data-toast-tone="ok|warn"`. 4초 뒤 사라짐(마우스·포커스가 있으면 멈춤), 최대 3장. 자리는 3-3의 `.toasts`.
지면 견본:
```html
<div class="toast toast--static toast--ok" role="status"><span class="dojang dojang--s" aria-hidden="true">발송</span>
  <div><strong class="toast__title">43주차 412상자 집하 완료</strong><span class="toast__body">우체국 홍동 · 어제 18:30</span></div>
  <button class="toast__x" type="button" aria-label="알림 닫기"><svg class="icon" data-icon="close"></svg></button></div>
```

### tooltip — 작은 가격표 꼬리
```html
<span class="tip">
  <button class="btn btn--icon" type="button" aria-label="보관 온도" aria-describedby="tip-keep"><svg class="icon" data-icon="info"></svg></button>
  <span class="tip__bubble" role="tooltip" id="tip-keep">12–15℃ 그늘에 두세요</span>
</span>
```
hover · focus 시 표시, Esc로 숨김. 아래로: `tip--below`. 가장자리 맞춤: `tip--start`(꼬리표를 트리거 왼쪽 끝에) · `tip--end`(오른쪽 끝에) — 화면 왼쪽 16px 안쪽 트리거는 반드시 `tip--start`. 모바일 말풍선 최대 폭 `100vw − 32px`. 지면에 펼친 견본: `tip tip--static`.

---

## 8. app.js 훅 요약 (전역 `window.Byeot`)

| 훅 | 하는 일 |
|---|---|
| `[data-theme-toggle]` | 낮/밤 전환 + `byeot-theme` 저장. 쿼리 `?theme=`가 첫 화면 최우선 |
| `svg[data-icon]` · `[data-ill]` | 아이콘 · 일러스트 그리기 (`Byeot.paint(el)` 로 새 내용도) |
| `[data-open="#id"]` · `[data-close]` | 레이어(modal · drawer · command) 열기/닫기, 포커스 트랩, Esc, 포커스 복귀. 드로어 안에서 모달을 열면 드로어는 접힌다(Esc 한 번에 다 닫힘) |
| ⌘K / Ctrl+K | `.layer.command` 열고 닫기 |
| `[role=tablist]` | 탭 (←/→ · Home/End, `aria-orientation="vertical"`이면 ↑/↓) |
| `.acc__btn` | 아코디언 (`.acc[data-single]`) |
| `[data-toast]` · `Byeot.toast()` | 토스트 |
| `[data-popover="#id"]` | 팝오버 |
| `[data-menu="#id"]` | 메뉴 (↑/↓ · Home/End · Esc · Tab) |
| `.carousel` + `[data-carousel=prev|next]` | 캐러셀 (이름 줄 · 상태 글자 자동) |
| `[data-loading]` | 버튼 로딩 시연 |
| `.btn--primary` 클릭 | 도장 찍힘 모션 |
| `[data-dismiss]` | 공고(`.alert` · `[data-dismissible]`) 닫기 |
| `[data-restamp]` · `[data-replay][data-motion]` | 도장 다시 찍기 · 모션 다시 보기 |
| `.cal[data-cal-month]` | 24절기 장날 달력 그리기 · 고르기 · 달 넘김 · 화살표 키 |
| `.tbl__sort` · `[data-select-scope]` | 표 정렬 · 선택 · 일괄 처리 바 (고른 줄 `tr[aria-selected]`, 고른 작업판 카드 `.kcard.is-selected`) |
| `.board` | 작업판 키보드 이동 · 끌어 놓기 · 개수 · 열 머리 상자 칸 갱신 |
| `form[data-validate]` | 엽서 검증 → 로딩 → 토스트 |
| `.switch[role=switch]` · `.qty` · `[data-cart]` · `[data-cycle]` | 스위치 · 수량 · 장바구니 합계 · 매주/격주 가격 |
| `.marquee` · `[data-marquee-toggle]` | 안내 띠 복제 · 멈춤 |
| `.boxes[data-value]` | 상자 칸 진행 |
| `.drop-in` · `.stagger` | 툭 놓기 진입(기본은 보임, 첫 페인트 뒤 화면에 들어올 때 한 번) · 차례 |
| `[data-nav-toggle]` | 머리띠 쪽지 메뉴 |
| `.scroller` `.tabs__list` `.carousel__names` `.chalk__nav` | 오른쪽 페이드 힌트 |
| `[data-copy="#id"]` | 복사 |
| `[data-panes]` · `[data-pane-open]` · `[data-pane-back]` | 목록 → 읽기 화면 전환 |
| `.pager[data-demo]` · `[data-steps-next|prev]` | 쪽수 · 단계 시연 |

---

## 9. 쓰지 말 것

- 랜딩 공식(eyebrow → 큰 헤드라인 → 문단 → CTA 쌍 → 칩), 가운데 정렬 "라벨 → 제목 → 부제" 섹션 머리, 컴포넌트를 둥근 카드에 하나씩 담은 갤러리, 통계 숫자 4칸 가로줄, 브라우저 창 목업.
- 블롭 · 물결 디바이더 · radial 얼룩 배경, 둥근 모서리 일괄(종이 2px · 입력 3px · 도장/아바타 원 외에는 각), 모든 것에 같은 그림자.
- 세리프 글꼴, 실내 사물(램프 · 담요 · 머그) — 15 휘게와 겹친다. 이 세계는 **바깥 장터 · 햇볕 · 흙 · 인주 · 매직 글씨**.
- 손글씨 본문, 28px 미만 손글씨, 한글 라벨에 넓은 자간 · 모노.
- 이모지, 영어 카피, `$`, "○○", 팩트 시트에 없는 사람 · 가격 · 날짜. 2026-10-24는 **토요일**.
- SVG presentation attribute의 `var()`, `href="#"`, 인라인 `onclick`, 인라인 `grid-template-columns`, 이미지 파일, 외부 JS/CSS 라이브러리.
