# COMPONENTS — 모닥 MODAK v2 마크업 계약

index.html · pages/*.html 담당은 **이 문서만 보고** 마크업한다. 디자인 근거와 세계관 값은 `DIRECTION.md`(특히 `## 팩트 시트`).
클래스는 BEM(`블록__요소--변형`). 상태는 가능한 한 ARIA 속성(`aria-selected`, `aria-current`, `aria-expanded`, `aria-pressed`, `aria-busy`, `aria-invalid`, `disabled`)으로 표시하고, CSS가 그 속성을 읽는다.
**셸(navbar · footer · 사이드바 · 공통 오버레이)은 3절 스니펫을 글자 하나 바꾸지 말고 복사**한다. 바꿔도 되는 것은 표시된 `aria-current` 위치뿐이다.

---

## 0. 페이지 뼈대 (모든 HTML 공통)

```html
<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>모닥의 집 — 오늘의 쇼룸</title>
<script>(function(){var d=document.documentElement;d.classList.add('js');try{var q=new URLSearchParams(location.search).get('theme');var s=localStorage.getItem('modak-theme');var t=(q==='dark'||q==='light')?q:(s==='dark'||s==='light')?s:(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');d.setAttribute('data-theme',t);}catch(e){d.setAttribute('data-theme','light');}})();</script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,600;12..96,800&family=Gowun+Dodum&family=Sunflower:wght@500;700&family=Nanum+Pen+Script&family=DM+Mono:wght@400;500&display=swap">
<link rel="stylesheet" href="styles.css">      <!-- pages: ../styles.css -->
<link rel="stylesheet" href="index.css">       <!-- pages: dashboard.css 처럼 장면 전용 1개 (pages/ 안) -->
</head>
<body>
<a class="skip" href="#main">본문으로 건너뛰기</a>
<header class="nav">…3-1 스니펫…</header>
<main id="main">…</main>                         <!-- 운영 페이지는 3-4 사이드바 셸 안의 main -->
<footer class="foot">…3-2 스니펫…</footer>
…3-3 공통 오버레이(커맨드 · 장바구니 · 모바일 메뉴 · 토스트)…
<script src="app.js"></script>                   <!-- pages: ../app.js -->
</body>
</html>
```

- 테마 저장 키는 `modak-theme`. 우선순위 `?theme=dark|light` → localStorage → 시스템. `<html>`에 `data-theme`를 하드코딩하지 않는다.
- `<title>`은 `모닥의 집 — <화면 이름>` 형식(index는 `모닥의 집 — 2026 겨울 카탈로그`).
- 장면 CSS(`index.css`, `pages/<name>.css`)도 **semantic 토큰만**(2절 목록). raw hex 금지, 인라인 `grid-template-columns` 금지(1절 스팬 클래스 사용). 단 `style="--x:62%; --obj-w:180px"` 같은 **커스텀 속성 주입은 허용**.
- 금지: `href="#"`(실제 경로나 `#id`), 인라인 `onclick`, 이미지 파일(사물은 `data-obj`), 이모지, 영어 더미 카피.
- 세계관 기준 시각은 **2026년 12월 18일 금요일 16:10**. 요일·주소·영업시간·가격·ID는 DIRECTION 팩트 시트 값만 쓴다.

### 화면 ↔ 방 색 (점 · 띠 · 첫 면 색을 고를 때 기준)

| 파일 | 화면 이름(보이는 글자) | `data-room` |
|---|---|---|
| index.html | 모닥의 집 둘러보기 · 2026 겨울 카탈로그 | 방마다 다름 |
| pages/dashboard.html | 오늘의 쇼룸 | butter |
| pages/inbox.html | 상담함 | fjord |
| pages/kanban.html | 스타일링 보드 | oak |
| pages/onboarding.html | 우리 집 취향 찾기 | sage |
| pages/pricing.html | 홈스타일링 요금 | rose |
| pages/product.html | 솜솜 양모 담요 | ember |
| pages/profile.html | 스타일리스트 정이안 | butter |
| pages/settings.html | 내 계정 · 오지민 | fjord |
| pages/404.html | 닫힌 다락 문 | attic |

index의 방 id(네비 방 지도가 이 id로 이동하고, 보이는 방의 점에 불이 켜진다): `#living`(거실·butter) `#kitchen`(부엌·sage) `#study`(창가 서재·fjord) `#dining`(식탁방·oak) `#bedroom`(침실·rose) `#workshop`(공방·ember) `#attic`(다락·attic).
대시보드는 사이드바 링크용으로 `#orders`(주문 장부) `#tours`(투어 달력) `#stock`(담요 재고) id를 반드시 가진다.

---

## 1. 레이아웃 문법 (base.css)

### `.room` — 풀블리드 방 면 (공통 max-width 컨테이너 없음)

```html
<section class="room room--tall room--floored" data-room="butter" id="living" aria-labelledby="living-title">
  <div class="g12">
    <div class="span-5 stack">…제목 · 문단 · 범례…</div>
    <div class="span-7 scene scene--sink">…사물…</div>
  </div>
</section>
```

- `data-room="butter|sage|fjord|oak|rose|ember|attic|door|paper"` → `--here`(면) `--here-floor`(바닥) `--here-ink` `--here-ink-2` `--here-dot`이 정해진다. 그 안의 컴포넌트(버튼 `--room`, 탭, 콜아웃, 메모)가 알아서 맞춘다.
- `.room--tall` = `min-height: min(92svh, 880px)`(거실 · 침실). `.room--floored` = 아래 128px(모바일 72px) 바닥 띠 + 3px 걸레받이. `.room--tight` = 위아래 72px.
- 방과 방은 **맞붙는다**(사이 여백 없음). 좌우 여백은 방이 `--gutter-x`로 갖는다.
- 다락(`attic`) · 문간(`door`)은 어두운 면 — 글자는 `--here-ink`가 자동으로 밝아진다.
- 방 면 위의 `.link` · `.btn--quiet` · `em` · `.memo`는 `--here-accent` / `--here-pencil`로 색이 자동으로 바뀐다(장면 CSS에서 `color: var(--brand)`를 방 면 위 글자에 직접 쓰지 말 것).

### `.g12` — 12단 그리드 (900px 이상에서 스팬, 그 아래는 모두 12단)
`span-3` `span-4` `span-5` `span-6` `span-7` `span-8` `span-9` `span-12`, 정렬 `end` `start`, 640–899px 반반은 `md-6`.
방마다 비율을 바꾼다: 5/7, 4/8, 7/5(사물이 왼쪽), 12(파노라마).

### 그 밖의 원시
- `.stack`(세로, 간격 `--stack`) · `.cluster`(가로 줄바꿈, 간격 `--cluster`) · `.measure`(34em).
- `.scene` = 사물이 바닥에 서는 무대(flex, 아래 정렬). `.scene--sink` = 바닥 띠 안으로 발을 들인다(바닥 띠가 있는 방에서).
- `.sheet` = 탁자 위 종이 면(--paper-raised, 2px). `.sheet--sunken` `.sheet--pad-s`. 기울이기 `.tilt-l` `.tilt-l2` `.tilt-r` `.tilt-r2`(±0.6–1.2deg, 720px 이하 0). 표 · 폼 내부는 기울이지 않는다 — 종이 전체만.
- `.dot`(방 색 사각 점, `.dot--round` 원) — 반드시 `data-room`과 함께.

### 활자 유틸
`.t-room`(방 제목 48–112) `.t-display` `.t-h1` `.t-h2` `.t-h3` `.t-h4` `.t-lead` `.t-body` `.t-small` `.t-caption`(13, 최소치) `.t-label`(Sunflower) `.t-num-xl` `.t-num`(Bricolage 800) `.t-tab`(표 숫자) `.t-hand` `.t-hand-lg`(손글씨, 최소 24px) `.t-mono`(라틴·숫자 전용) `.t-muted` `.t-wordmark`.
- 한글 제목은 Gowun Dodum 한 굵기 — **위계는 크기로만** 만든다. 굵게가 필요하면 `<strong>`(Sunflower 500). `<em>`은 장작색 밑줄(한글 이탤릭 금지).
- 넓은 자간과 모노는 라틴·숫자에만. 한글 라벨 자간 0.

---

## 2. 장면 CSS에서 쓸 semantic 토큰

| 묶음 | 토큰 |
|---|---|
| 종이 · 글자 | `--paper` `--paper-raised` `--paper-sunken` `--ink` `--ink-2` `--ink-on-room` `--line` `--line-strong` `--shade-mix` |
| 장작 · 연필 · 램프 | `--brand` `--brand-hover` `--brand-press` `--on-brand` `--brand-soft` `--pencil` `--lamp` `--glow-op` |
| 방 | `--room-{butter,sage,fjord,oak,rose,ember,attic,door}` `--floor-{…}` `--dot-{…}` `--on-attic` `--on-door` `--on-door-2` · 현재 방 `--here` `--here-floor` `--here-ink` `--here-ink-2` `--here-dot` |
| 방 위 글자 강조 | `--here-accent` `--here-accent-hover`(링크 · 조용한 버튼 · em · 활성 탭 밑줄) `--here-pencil`(연필 메모 · 손글씨 · 화살표). 종이 면 = 장작/연필, 버터·세이지·피오르·오크·로즈 면 = 연필(장작 글자는 방 면 위 3.1–3.7:1로 미달), 공방 면 = 잉크, 다락·문간 = 램프빛. `.sheet` `.letter` `.note` `.card__body` 같은 종이 면 안에서는 다시 장작 |
| 상태 | `--ok` `--warn` `--danger` `--info` + 각 `-soft` |
| 상품 색 | `--swatch-{butter,pine,snow,tangerine,firewood,sage,charcoal}` (팩트 시트 BT · SL · NB · GK · JG · SG · SC) |
| 레이어 | `--shadow-float` `--float-edge` `--scrim` `--focus-ink` `--focus-halo` |
| 사물 | `--obj-ink` `--obj-wood` `--obj-wood-d` `--obj-fabric` `--obj-chair` `--obj-shade` `--obj-mug` `--obj-ceramic` `--obj-door` `--obj-shadow` … (사물 색을 바꿀 땐 이 변수를 덮어쓴다) |
| 간격 · 크기 | `--sp-1…10`(4 8 12 16 24 32 48 72 112 160) `--gutter-x` `--gutter` `--room-pad` `--floor-h` `--nav-h` `--tap` |
| 반경 | `--r-room`(0) `--r-furniture`(6) `--r-knob`(999) `--r-paper`(2) `--r-quilt`(24) |
| 모션 | `--ease-settle` `--ease-pull` `--dur-touch` `--dur-open` `--dur-close` `--dur-room` `--dur-lamp` `--dur-flame` `--dur-steam` |

그림자 규칙: 정적인 면은 그림자 없음. 사물은 SVG 안의 바닥 타원 그림자, 떠 있는 레이어만 `--shadow-float`.

---

## 3. 공통 셸 — 복사해서 쓰는 스니펫

### 3-1. navbar (문간 바)

**index.html 판**

```html
<header class="nav">
  <div class="nav__bar">
    <a class="nav__brand" href="index.html"><span class="nav__mark">MODAK</span><span class="nav__name">모닥의 집</span></a>
    <nav class="nav__rooms" aria-label="방 지도">
      <a class="nav__room" data-room="butter" href="index.html#living"><span class="dot dot--round"></span>거실</a>
      <a class="nav__room" data-room="sage" href="index.html#kitchen"><span class="dot dot--round"></span>부엌</a>
      <a class="nav__room" data-room="fjord" href="index.html#study"><span class="dot dot--round"></span>창가 서재</a>
      <a class="nav__room" data-room="oak" href="index.html#dining"><span class="dot dot--round"></span>식탁방</a>
      <a class="nav__room" data-room="rose" href="index.html#bedroom"><span class="dot dot--round"></span>침실</a>
      <a class="nav__room" data-room="ember" href="index.html#workshop"><span class="dot dot--round"></span>공방</a>
      <a class="nav__room" data-room="attic" href="index.html#attic"><span class="dot dot--round"></span>다락</a>
    </nav>
    <div class="nav__tools">
      <div class="menu-anchor">
        <button class="nav__more" type="button" data-menu-trigger aria-controls="nav-pages" aria-expanded="false" aria-haspopup="menu">다른 화면<svg data-icon="chevron-down"></svg></button>
        <div class="menu" id="nav-pages" role="menu" aria-label="다른 화면" hidden>
          <a class="menu__item" role="menuitem" href="pages/dashboard.html"><span class="dot" data-room="butter"></span>오늘의 쇼룸</a>
          <a class="menu__item" role="menuitem" href="pages/inbox.html"><span class="dot" data-room="fjord"></span>상담함</a>
          <a class="menu__item" role="menuitem" href="pages/kanban.html"><span class="dot" data-room="oak"></span>스타일링 보드</a>
          <a class="menu__item" role="menuitem" href="pages/onboarding.html"><span class="dot" data-room="sage"></span>우리 집 취향 찾기</a>
          <a class="menu__item" role="menuitem" href="pages/pricing.html"><span class="dot" data-room="rose"></span>홈스타일링 요금</a>
          <a class="menu__item" role="menuitem" href="pages/product.html"><span class="dot" data-room="ember"></span>솜솜 양모 담요</a>
          <a class="menu__item" role="menuitem" href="pages/profile.html"><span class="dot" data-room="butter"></span>스타일리스트 정이안</a>
          <a class="menu__item" role="menuitem" href="pages/settings.html"><span class="dot" data-room="fjord"></span>내 계정 · 오지민</a>
          <a class="menu__item" role="menuitem" href="pages/404.html"><span class="dot" data-room="attic"></span>닫힌 다락 문</a>
        </div>
      </div>
      <button class="nav__find" type="button" data-command-open aria-label="집 안에서 찾기"><svg data-icon="search"></svg><span class="nav__find-text">찾기</span><kbd class="kbd">⌘K</kbd></button>
      <button class="btn btn--icon nav__cart" type="button" data-drawer-open="cart" aria-controls="cart" aria-expanded="false" aria-label="장바구니, 물건 3가지"><svg data-icon="cart"></svg><span class="count" aria-hidden="true">3</span></button>
      <button class="cord" type="button" data-theme-toggle aria-pressed="false" aria-label="밤 장면으로 바꾸기"><span class="cord__string"></span><span class="cord__bead"></span></button>
      <button class="btn btn--icon nav__burger" type="button" data-drawer-open="nav-sheet" aria-controls="nav-sheet" aria-expanded="false" aria-label="메뉴 열기"><svg data-icon="menu"></svg></button>
    </div>
  </div>
</header>
```

**pages/*.html 판** — 지금 화면의 메뉴 항목에 `aria-current="page"`를 하나 붙인다(예: dashboard면 `href="dashboard.html"` 항목).

```html
<header class="nav">
  <div class="nav__bar">
    <a class="nav__brand" href="../index.html"><span class="nav__mark">MODAK</span><span class="nav__name">모닥의 집</span></a>
    <nav class="nav__rooms" aria-label="방 지도">
      <a class="nav__room" data-room="butter" href="../index.html#living"><span class="dot dot--round"></span>거실</a>
      <a class="nav__room" data-room="sage" href="../index.html#kitchen"><span class="dot dot--round"></span>부엌</a>
      <a class="nav__room" data-room="fjord" href="../index.html#study"><span class="dot dot--round"></span>창가 서재</a>
      <a class="nav__room" data-room="oak" href="../index.html#dining"><span class="dot dot--round"></span>식탁방</a>
      <a class="nav__room" data-room="rose" href="../index.html#bedroom"><span class="dot dot--round"></span>침실</a>
      <a class="nav__room" data-room="ember" href="../index.html#workshop"><span class="dot dot--round"></span>공방</a>
      <a class="nav__room" data-room="attic" href="../index.html#attic"><span class="dot dot--round"></span>다락</a>
    </nav>
    <div class="nav__tools">
      <div class="menu-anchor">
        <button class="nav__more" type="button" data-menu-trigger aria-controls="nav-pages" aria-expanded="false" aria-haspopup="menu">다른 화면<svg data-icon="chevron-down"></svg></button>
        <div class="menu" id="nav-pages" role="menu" aria-label="다른 화면" hidden>
          <a class="menu__item" role="menuitem" href="dashboard.html"><span class="dot" data-room="butter"></span>오늘의 쇼룸</a>
          <a class="menu__item" role="menuitem" href="inbox.html"><span class="dot" data-room="fjord"></span>상담함</a>
          <a class="menu__item" role="menuitem" href="kanban.html"><span class="dot" data-room="oak"></span>스타일링 보드</a>
          <a class="menu__item" role="menuitem" href="onboarding.html"><span class="dot" data-room="sage"></span>우리 집 취향 찾기</a>
          <a class="menu__item" role="menuitem" href="pricing.html"><span class="dot" data-room="rose"></span>홈스타일링 요금</a>
          <a class="menu__item" role="menuitem" href="product.html"><span class="dot" data-room="ember"></span>솜솜 양모 담요</a>
          <a class="menu__item" role="menuitem" href="profile.html"><span class="dot" data-room="butter"></span>스타일리스트 정이안</a>
          <a class="menu__item" role="menuitem" href="settings.html"><span class="dot" data-room="fjord"></span>내 계정 · 오지민</a>
          <a class="menu__item" role="menuitem" href="404.html"><span class="dot" data-room="attic"></span>닫힌 다락 문</a>
        </div>
      </div>
      <button class="nav__find" type="button" data-command-open aria-label="집 안에서 찾기"><svg data-icon="search"></svg><span class="nav__find-text">찾기</span><kbd class="kbd">⌘K</kbd></button>
      <button class="btn btn--icon nav__cart" type="button" data-drawer-open="cart" aria-controls="cart" aria-expanded="false" aria-label="장바구니, 물건 3가지"><svg data-icon="cart"></svg><span class="count" aria-hidden="true">3</span></button>
      <button class="cord" type="button" data-theme-toggle aria-pressed="false" aria-label="밤 장면으로 바꾸기"><span class="cord__string"></span><span class="cord__bead"></span></button>
      <button class="btn btn--icon nav__burger" type="button" data-drawer-open="nav-sheet" aria-controls="nav-sheet" aria-expanded="false" aria-label="메뉴 열기"><svg data-icon="menu"></svg></button>
    </div>
  </div>
</header>
```

- 1200px 미만은 방 지도가 숨고, 760px 미만은 워드마크 + 찾기 + 장바구니 + 줄 스위치 + 메뉴 버튼만 남는다(메뉴 = 3-3의 `#nav-sheet` 드로어).
- 줄 스위치(`.cord`)가 유일한 테마 토글이다. 다른 곳(다락 · 설정 미리보기)에 큰 줄 `.cord.cord--lg`를 더 둘 수 있다(10절 navbar 아래 참고).

### 3-2. footer (문간 · 코코아)

**index.html 판**

```html
<footer class="foot">
  <div class="foot__inner">
    <div class="foot__tag">
      <p class="foot__mark"><b>MODAK</b><span>모닥의 집</span></p>
      <address>서울 종로구 부암동 백석동길 27<br>02-391-2718 · hello@modak-home.kr</address>
      <ul class="foot__hours">
        <li><span>화–목</span><span class="t-tab">11:00–19:00</span></li>
        <li><span>금·토</span><span><span class="t-tab">11:00–21:00</span> · 램프 타임 <span class="t-tab">19:00</span>부터</span></li>
        <li><span>일</span><span class="t-tab">11:00–18:00</span></li>
        <li><span>월</span><span>쉬어요</span></li>
      </ul>
    </div>
    <nav class="foot__rooms" aria-label="다른 방으로">
      <h2 class="foot__h">다른 방으로</h2>
      <ul>
        <li><a class="foot__link" href="pages/dashboard.html"><span class="dot" data-room="butter"></span>오늘의 쇼룸</a></li>
        <li><a class="foot__link" href="pages/inbox.html"><span class="dot" data-room="fjord"></span>상담함</a></li>
        <li><a class="foot__link" href="pages/kanban.html"><span class="dot" data-room="oak"></span>스타일링 보드</a></li>
        <li><a class="foot__link" href="pages/onboarding.html"><span class="dot" data-room="sage"></span>우리 집 취향 찾기</a></li>
        <li><a class="foot__link" href="pages/pricing.html"><span class="dot" data-room="rose"></span>홈스타일링 요금</a></li>
        <li><a class="foot__link" href="pages/product.html"><span class="dot" data-room="ember"></span>솜솜 양모 담요</a></li>
        <li><a class="foot__link" href="pages/profile.html"><span class="dot" data-room="butter"></span>스타일리스트 정이안</a></li>
        <li><a class="foot__link" href="pages/settings.html"><span class="dot" data-room="fjord"></span>내 계정 · 오지민</a></li>
        <li><a class="foot__link" href="pages/404.html"><span class="dot" data-room="attic"></span>닫힌 다락 문</a></li>
      </ul>
    </nav>
  </div>
  <p class="foot__line"><span><a class="foot__home" href="index.html"><span class="t-wordmark">MODAK</span></a> · 모닥의 집 · 2026 겨울 카탈로그</span><span>상담 카카오톡 채널 “모닥의 집” · 평균 첫 답장 38분</span></p>
</footer>
```

**pages/*.html 판** — 지금 화면 링크에 `aria-current="page"`.

```html
<footer class="foot">
  <div class="foot__inner">
    <div class="foot__tag">
      <p class="foot__mark"><b>MODAK</b><span>모닥의 집</span></p>
      <address>서울 종로구 부암동 백석동길 27<br>02-391-2718 · hello@modak-home.kr</address>
      <ul class="foot__hours">
        <li><span>화–목</span><span class="t-tab">11:00–19:00</span></li>
        <li><span>금·토</span><span><span class="t-tab">11:00–21:00</span> · 램프 타임 <span class="t-tab">19:00</span>부터</span></li>
        <li><span>일</span><span class="t-tab">11:00–18:00</span></li>
        <li><span>월</span><span>쉬어요</span></li>
      </ul>
    </div>
    <nav class="foot__rooms" aria-label="다른 방으로">
      <h2 class="foot__h">다른 방으로</h2>
      <ul>
        <li><a class="foot__link" href="dashboard.html"><span class="dot" data-room="butter"></span>오늘의 쇼룸</a></li>
        <li><a class="foot__link" href="inbox.html"><span class="dot" data-room="fjord"></span>상담함</a></li>
        <li><a class="foot__link" href="kanban.html"><span class="dot" data-room="oak"></span>스타일링 보드</a></li>
        <li><a class="foot__link" href="onboarding.html"><span class="dot" data-room="sage"></span>우리 집 취향 찾기</a></li>
        <li><a class="foot__link" href="pricing.html"><span class="dot" data-room="rose"></span>홈스타일링 요금</a></li>
        <li><a class="foot__link" href="product.html"><span class="dot" data-room="ember"></span>솜솜 양모 담요</a></li>
        <li><a class="foot__link" href="profile.html"><span class="dot" data-room="butter"></span>스타일리스트 정이안</a></li>
        <li><a class="foot__link" href="settings.html"><span class="dot" data-room="fjord"></span>내 계정 · 오지민</a></li>
        <li><a class="foot__link" href="404.html"><span class="dot" data-room="attic"></span>닫힌 다락 문</a></li>
      </ul>
    </nav>
  </div>
  <p class="foot__line"><span><a class="foot__home" href="../index.html"><span class="t-wordmark">MODAK</span></a> · 모닥의 집 · 2026 겨울 카탈로그</span><span>상담 카카오톡 채널 “모닥의 집” · 평균 첫 답장 38분</span></p>
</footer>
```

### 3-3. 공통 오버레이 (body 끝, `<script>` 바로 앞) — 커맨드 팔레트 · 장바구니 커튼 · 모바일 메뉴 · 토스트 자리

**index.html 판**

```html
<!-- 공통 오버레이 — body 끝, <script> 바로 앞 -->
<div class="cmd" id="cmd" data-command hidden>
  <div class="cmd__scrim"></div>
  <div class="cmd__box" role="dialog" aria-modal="true" aria-label="집 안에서 찾기">
    <div class="cmd__field"><svg data-icon="search"></svg><input class="cmd__input" type="text" placeholder="물건, 주문번호, 고객 이름" aria-label="찾을 말" role="combobox" aria-expanded="true" aria-controls="cmd-list" autocomplete="off"><kbd class="kbd">Esc</kbd></div>
    <ul class="cmd__list" id="cmd-list" role="listbox" aria-label="찾은 것">
      <li class="cmd__group" role="presentation"><p class="cmd__group-label">거실</p>
        <a class="cmd__opt" href="pages/product.html" data-keywords="솜솜 양모 담요 MD-TX-104 버터 솔잎 눈밭 귤껍질"><span class="dot" data-room="butter"></span><span class="cmd__opt-main"><span class="cmd__opt-title">솜솜 양모 담요</span><span class="cmd__opt-sub">MD-TX-104 · 버터 · 솔잎 · 눈밭 · 귤껍질</span></span><span class="cmd__opt-meta cmd__opt-meta--price">₩168,000</span></a>
        <a class="cmd__opt" href="index.html#living" data-keywords="오름 펜던트 램프 MD-LT-021 조명"><span class="dot" data-room="butter"></span><span class="cmd__opt-main"><span class="cmd__opt-title">오름 펜던트 램프</span><span class="cmd__opt-sub">MD-LT-021 · 지름 38cm</span></span><span class="cmd__opt-meta cmd__opt-meta--price">₩289,000</span></a>
        <a class="cmd__opt" href="index.html#living" data-keywords="둥지 라운지 체어 MD-FN-052 의자 가구"><span class="dot" data-room="butter"></span><span class="cmd__opt-main"><span class="cmd__opt-title">둥지 라운지 체어</span><span class="cmd__opt-sub">MD-FN-052 · 세이지 부클레</span></span><span class="cmd__opt-meta cmd__opt-meta--price">₩1,480,000</span></a>
      </li>
      <li class="cmd__group" role="presentation"><p class="cmd__group-label">부엌</p>
        <a class="cmd__opt" href="index.html#kitchen" data-keywords="도톰 머그 MD-TW-210 컵"><span class="dot" data-room="sage"></span><span class="cmd__opt-main"><span class="cmd__opt-title">도톰 머그</span><span class="cmd__opt-sub">MD-TW-210 · 380ml</span></span><span class="cmd__opt-meta cmd__opt-meta--price">₩26,000</span></a>
        <a class="cmd__opt" href="index.html#kitchen" data-keywords="밤불 밀랍초 3개입 MD-CD-301 초 향"><span class="dot" data-room="sage"></span><span class="cmd__opt-main"><span class="cmd__opt-title">밤불 밀랍초 3개입</span><span class="cmd__opt-sub">MD-CD-301 · 연소 약 9시간</span></span><span class="cmd__opt-meta cmd__opt-meta--price">₩19,000</span></a>
      </li>
      <li class="cmd__group" role="presentation"><p class="cmd__group-label">주문</p>
        <a class="cmd__opt" href="pages/dashboard.html" data-keywords="MDK-261218-0417 류다온 주문 배송 준비"><span class="dot" data-room="oak"></span><span class="cmd__opt-main"><span class="cmd__opt-title">류다온 · 솜솜 양모 담요 버터</span><span class="cmd__opt-sub">배송 준비 · 12월 21일(월) 도착</span></span><span class="cmd__opt-meta">MDK-261218-0417</span></a>
        <a class="cmd__opt" href="pages/inbox.html" data-keywords="CS-31207 류다온 상담 패브릭 샘플"><span class="dot" data-room="oak"></span><span class="cmd__opt-main"><span class="cmd__opt-title">류다온 · 거실 패브릭 샘플 상담</span><span class="cmd__opt-sub">소파 패브릭 샘플 4종 · 답장 기다리는 중</span></span><span class="cmd__opt-meta">CS-31207</span></a>
      </li>
      <li class="cmd__group" role="presentation"><p class="cmd__group-label">고객 · 사람</p>
        <a class="cmd__opt" href="pages/settings.html" data-keywords="오지민 M-20418 정릉동 고객 계정"><span class="dot" data-room="rose"></span><span class="cmd__opt-main"><span class="cmd__opt-title">오지민</span><span class="cmd__opt-sub">성북구 정릉동 · 회원</span></span><span class="cmd__opt-meta">M-20418</span></a>
        <a class="cmd__opt" href="pages/profile.html" data-keywords="정이안 홈스타일리스트 스타일링"><span class="dot" data-room="butter"></span><span class="cmd__opt-main"><span class="cmd__opt-title">정이안 스타일리스트</span><span class="cmd__opt-sub">7년 · 128개의 방</span></span><span class="cmd__opt-meta">ST-26</span></a>
      </li>
      <li class="cmd__group" role="presentation"><p class="cmd__group-label">다른 화면</p>
        <a class="cmd__opt" href="pages/kanban.html" data-keywords="스타일링 보드 칸반 설치"><span class="dot" data-room="oak"></span><span class="cmd__opt-main"><span class="cmd__opt-title">스타일링 보드</span><span class="cmd__opt-sub">진행 중 17건 · 다음 주 설치 6건</span></span></a>
        <a class="cmd__opt" href="pages/pricing.html" data-keywords="홈스타일링 요금 가격 한 구석 한 방 온 집"><span class="dot" data-room="rose"></span><span class="cmd__opt-main"><span class="cmd__opt-title">홈스타일링 요금</span><span class="cmd__opt-sub">한 구석 · 한 방 · 온 집</span></span></a>
        <a class="cmd__opt" href="pages/onboarding.html" data-keywords="우리 집 취향 찾기 온보딩"><span class="dot" data-room="sage"></span><span class="cmd__opt-main"><span class="cmd__opt-title">우리 집 취향 찾기</span><span class="cmd__opt-sub">4단계 · 3분</span></span></a>
      </li>
    </ul>
    <p class="cmd__empty" hidden>“<span data-cmd-query></span>”은(는) 집 안에서 찾지 못했어요. 상품 코드(MD-…)나 주문번호(MDK-…)로도 찾을 수 있어요.</p>
    <div class="cmd__foot"><span><kbd class="kbd">↑</kbd><kbd class="kbd">↓</kbd> 고르기</span><span><kbd class="kbd">Enter</kbd> 열기</span><span><kbd class="kbd">Esc</kbd> 닫기</span></div>
  </div>
</div>

<div class="drawer" id="cart" hidden>
  <div class="drawer__scrim"></div>
  <div class="drawer__panel" role="dialog" aria-modal="true" aria-labelledby="cart-title">
    <div class="drawer__rod" aria-hidden="true"></div>
    <div class="drawer__head">
      <div><h2 class="drawer__title" id="cart-title">장바구니</h2><p class="drawer__sub">물건 3가지 · 12월 21일(월) 도착 예정</p></div>
      <button class="btn btn--icon" type="button" data-close aria-label="장바구니 닫기"><svg data-icon="close"></svg></button>
    </div>
    <div class="drawer__body">
      <div class="cart-line"><span class="cart-line__thumb" data-room="rose" data-swatch="BT"><span class="obj" data-obj="blanket"></span></span><div><p class="cart-line__name">솜솜 양모 담요</p><p class="cart-line__opt">버터 · 1장</p></div><span class="cart-line__price">₩168,000</span></div>
      <div class="cart-line"><span class="cart-line__thumb" data-room="ember"><span class="obj" data-obj="candle"></span></span><div><p class="cart-line__name">밤불 밀랍초 3개입</p><p class="cart-line__opt">2세트</p></div><span class="cart-line__price">₩38,000</span></div>
      <div class="cart-line"><span class="cart-line__thumb" data-room="sage"><span class="obj" data-obj="mug"></span></span><div><p class="cart-line__name">도톰 머그</p><p class="cart-line__opt">숯 · 1개</p></div><span class="cart-line__price">₩26,000</span></div>
    </div>
    <div class="drawer__foot">
      <div class="receipt">
        <div class="receipt__row receipt__row--sub"><span class="receipt__name">배송 (₩50,000 이상)</span><span class="receipt__lead"></span><span class="receipt__amt">무료</span></div>
        <div class="receipt__row receipt__row--total"><span class="receipt__name">합계</span><span class="receipt__lead"></span><span class="receipt__amt">₩232,000</span></div>
      </div>
      <button class="btn btn--primary btn--lg btn--block" type="button" data-busy-demo="1200" data-busy-done="주문을 받았어요 · MDK-261218-0418">주문하기</button>
    </div>
  </div>
</div>

<div class="drawer" id="nav-sheet" hidden>
  <div class="drawer__scrim"></div>
  <div class="drawer__panel" role="dialog" aria-modal="true" aria-labelledby="nav-sheet-title">
    <div class="drawer__rod" aria-hidden="true"></div>
    <div class="drawer__head">
      <h2 class="drawer__title" id="nav-sheet-title">모닥의 집</h2>
      <button class="btn btn--icon" type="button" data-close aria-label="메뉴 닫기"><svg data-icon="close"></svg></button>
    </div>
    <div class="drawer__body">
      <nav aria-label="모바일 메뉴">
        <div class="nav-sheet__group"><p class="nav-sheet__label">방 둘러보기</p>
          <a class="nav-sheet__link" href="index.html#living"><span class="dot" data-room="butter"></span>거실</a>
          <a class="nav-sheet__link" href="index.html#kitchen"><span class="dot" data-room="sage"></span>부엌</a>
          <a class="nav-sheet__link" href="index.html#study"><span class="dot" data-room="fjord"></span>창가 서재</a>
          <a class="nav-sheet__link" href="index.html#dining"><span class="dot" data-room="oak"></span>식탁방</a>
          <a class="nav-sheet__link" href="index.html#bedroom"><span class="dot" data-room="rose"></span>침실</a>
          <a class="nav-sheet__link" href="index.html#workshop"><span class="dot" data-room="ember"></span>공방</a>
          <a class="nav-sheet__link" href="index.html#attic"><span class="dot" data-room="attic"></span>다락</a>
        </div>
        <div class="nav-sheet__group"><p class="nav-sheet__label">다른 화면</p>
          <a class="nav-sheet__link" href="pages/dashboard.html"><span class="dot" data-room="butter"></span>오늘의 쇼룸</a>
          <a class="nav-sheet__link" href="pages/inbox.html"><span class="dot" data-room="fjord"></span>상담함</a>
          <a class="nav-sheet__link" href="pages/kanban.html"><span class="dot" data-room="oak"></span>스타일링 보드</a>
          <a class="nav-sheet__link" href="pages/onboarding.html"><span class="dot" data-room="sage"></span>우리 집 취향 찾기</a>
          <a class="nav-sheet__link" href="pages/pricing.html"><span class="dot" data-room="rose"></span>홈스타일링 요금</a>
          <a class="nav-sheet__link" href="pages/product.html"><span class="dot" data-room="ember"></span>솜솜 양모 담요</a>
          <a class="nav-sheet__link" href="pages/profile.html"><span class="dot" data-room="butter"></span>스타일리스트 정이안</a>
          <a class="nav-sheet__link" href="pages/settings.html"><span class="dot" data-room="fjord"></span>내 계정 · 오지민</a>
          <a class="nav-sheet__link" href="pages/404.html"><span class="dot" data-room="attic"></span>닫힌 다락 문</a>
        </div>
      </nav>
    </div>
  </div>
</div>

<div class="toasts" aria-live="polite" aria-relevant="additions"></div>
```

**pages/*.html 판**

```html
<!-- 공통 오버레이 — body 끝, <script> 바로 앞 -->
<div class="cmd" id="cmd" data-command hidden>
  <div class="cmd__scrim"></div>
  <div class="cmd__box" role="dialog" aria-modal="true" aria-label="집 안에서 찾기">
    <div class="cmd__field"><svg data-icon="search"></svg><input class="cmd__input" type="text" placeholder="물건, 주문번호, 고객 이름" aria-label="찾을 말" role="combobox" aria-expanded="true" aria-controls="cmd-list" autocomplete="off"><kbd class="kbd">Esc</kbd></div>
    <ul class="cmd__list" id="cmd-list" role="listbox" aria-label="찾은 것">
      <li class="cmd__group" role="presentation"><p class="cmd__group-label">거실</p>
        <a class="cmd__opt" href="product.html" data-keywords="솜솜 양모 담요 MD-TX-104 버터 솔잎 눈밭 귤껍질"><span class="dot" data-room="butter"></span><span class="cmd__opt-main"><span class="cmd__opt-title">솜솜 양모 담요</span><span class="cmd__opt-sub">MD-TX-104 · 버터 · 솔잎 · 눈밭 · 귤껍질</span></span><span class="cmd__opt-meta cmd__opt-meta--price">₩168,000</span></a>
        <a class="cmd__opt" href="../index.html#living" data-keywords="오름 펜던트 램프 MD-LT-021 조명"><span class="dot" data-room="butter"></span><span class="cmd__opt-main"><span class="cmd__opt-title">오름 펜던트 램프</span><span class="cmd__opt-sub">MD-LT-021 · 지름 38cm</span></span><span class="cmd__opt-meta cmd__opt-meta--price">₩289,000</span></a>
        <a class="cmd__opt" href="../index.html#living" data-keywords="둥지 라운지 체어 MD-FN-052 의자 가구"><span class="dot" data-room="butter"></span><span class="cmd__opt-main"><span class="cmd__opt-title">둥지 라운지 체어</span><span class="cmd__opt-sub">MD-FN-052 · 세이지 부클레</span></span><span class="cmd__opt-meta cmd__opt-meta--price">₩1,480,000</span></a>
      </li>
      <li class="cmd__group" role="presentation"><p class="cmd__group-label">부엌</p>
        <a class="cmd__opt" href="../index.html#kitchen" data-keywords="도톰 머그 MD-TW-210 컵"><span class="dot" data-room="sage"></span><span class="cmd__opt-main"><span class="cmd__opt-title">도톰 머그</span><span class="cmd__opt-sub">MD-TW-210 · 380ml</span></span><span class="cmd__opt-meta cmd__opt-meta--price">₩26,000</span></a>
        <a class="cmd__opt" href="../index.html#kitchen" data-keywords="밤불 밀랍초 3개입 MD-CD-301 초 향"><span class="dot" data-room="sage"></span><span class="cmd__opt-main"><span class="cmd__opt-title">밤불 밀랍초 3개입</span><span class="cmd__opt-sub">MD-CD-301 · 연소 약 9시간</span></span><span class="cmd__opt-meta cmd__opt-meta--price">₩19,000</span></a>
      </li>
      <li class="cmd__group" role="presentation"><p class="cmd__group-label">주문</p>
        <a class="cmd__opt" href="dashboard.html" data-keywords="MDK-261218-0417 류다온 주문 배송 준비"><span class="dot" data-room="oak"></span><span class="cmd__opt-main"><span class="cmd__opt-title">류다온 · 솜솜 양모 담요 버터</span><span class="cmd__opt-sub">배송 준비 · 12월 21일(월) 도착</span></span><span class="cmd__opt-meta">MDK-261218-0417</span></a>
        <a class="cmd__opt" href="inbox.html" data-keywords="CS-31207 류다온 상담 패브릭 샘플"><span class="dot" data-room="oak"></span><span class="cmd__opt-main"><span class="cmd__opt-title">류다온 · 거실 패브릭 샘플 상담</span><span class="cmd__opt-sub">소파 패브릭 샘플 4종 · 답장 기다리는 중</span></span><span class="cmd__opt-meta">CS-31207</span></a>
      </li>
      <li class="cmd__group" role="presentation"><p class="cmd__group-label">고객 · 사람</p>
        <a class="cmd__opt" href="settings.html" data-keywords="오지민 M-20418 정릉동 고객 계정"><span class="dot" data-room="rose"></span><span class="cmd__opt-main"><span class="cmd__opt-title">오지민</span><span class="cmd__opt-sub">성북구 정릉동 · 회원</span></span><span class="cmd__opt-meta">M-20418</span></a>
        <a class="cmd__opt" href="profile.html" data-keywords="정이안 홈스타일리스트 스타일링"><span class="dot" data-room="butter"></span><span class="cmd__opt-main"><span class="cmd__opt-title">정이안 스타일리스트</span><span class="cmd__opt-sub">7년 · 128개의 방</span></span><span class="cmd__opt-meta">ST-26</span></a>
      </li>
      <li class="cmd__group" role="presentation"><p class="cmd__group-label">다른 화면</p>
        <a class="cmd__opt" href="kanban.html" data-keywords="스타일링 보드 칸반 설치"><span class="dot" data-room="oak"></span><span class="cmd__opt-main"><span class="cmd__opt-title">스타일링 보드</span><span class="cmd__opt-sub">진행 중 17건 · 다음 주 설치 6건</span></span></a>
        <a class="cmd__opt" href="pricing.html" data-keywords="홈스타일링 요금 가격 한 구석 한 방 온 집"><span class="dot" data-room="rose"></span><span class="cmd__opt-main"><span class="cmd__opt-title">홈스타일링 요금</span><span class="cmd__opt-sub">한 구석 · 한 방 · 온 집</span></span></a>
        <a class="cmd__opt" href="onboarding.html" data-keywords="우리 집 취향 찾기 온보딩"><span class="dot" data-room="sage"></span><span class="cmd__opt-main"><span class="cmd__opt-title">우리 집 취향 찾기</span><span class="cmd__opt-sub">4단계 · 3분</span></span></a>
      </li>
    </ul>
    <p class="cmd__empty" hidden>“<span data-cmd-query></span>”은(는) 집 안에서 찾지 못했어요. 상품 코드(MD-…)나 주문번호(MDK-…)로도 찾을 수 있어요.</p>
    <div class="cmd__foot"><span><kbd class="kbd">↑</kbd><kbd class="kbd">↓</kbd> 고르기</span><span><kbd class="kbd">Enter</kbd> 열기</span><span><kbd class="kbd">Esc</kbd> 닫기</span></div>
  </div>
</div>

<div class="drawer" id="cart" hidden>
  <div class="drawer__scrim"></div>
  <div class="drawer__panel" role="dialog" aria-modal="true" aria-labelledby="cart-title">
    <div class="drawer__rod" aria-hidden="true"></div>
    <div class="drawer__head">
      <div><h2 class="drawer__title" id="cart-title">장바구니</h2><p class="drawer__sub">물건 3가지 · 12월 21일(월) 도착 예정</p></div>
      <button class="btn btn--icon" type="button" data-close aria-label="장바구니 닫기"><svg data-icon="close"></svg></button>
    </div>
    <div class="drawer__body">
      <div class="cart-line"><span class="cart-line__thumb" data-room="rose" data-swatch="BT"><span class="obj" data-obj="blanket"></span></span><div><p class="cart-line__name">솜솜 양모 담요</p><p class="cart-line__opt">버터 · 1장</p></div><span class="cart-line__price">₩168,000</span></div>
      <div class="cart-line"><span class="cart-line__thumb" data-room="ember"><span class="obj" data-obj="candle"></span></span><div><p class="cart-line__name">밤불 밀랍초 3개입</p><p class="cart-line__opt">2세트</p></div><span class="cart-line__price">₩38,000</span></div>
      <div class="cart-line"><span class="cart-line__thumb" data-room="sage"><span class="obj" data-obj="mug"></span></span><div><p class="cart-line__name">도톰 머그</p><p class="cart-line__opt">숯 · 1개</p></div><span class="cart-line__price">₩26,000</span></div>
    </div>
    <div class="drawer__foot">
      <div class="receipt">
        <div class="receipt__row receipt__row--sub"><span class="receipt__name">배송 (₩50,000 이상)</span><span class="receipt__lead"></span><span class="receipt__amt">무료</span></div>
        <div class="receipt__row receipt__row--total"><span class="receipt__name">합계</span><span class="receipt__lead"></span><span class="receipt__amt">₩232,000</span></div>
      </div>
      <button class="btn btn--primary btn--lg btn--block" type="button" data-busy-demo="1200" data-busy-done="주문을 받았어요 · MDK-261218-0418">주문하기</button>
    </div>
  </div>
</div>

<div class="drawer" id="nav-sheet" hidden>
  <div class="drawer__scrim"></div>
  <div class="drawer__panel" role="dialog" aria-modal="true" aria-labelledby="nav-sheet-title">
    <div class="drawer__rod" aria-hidden="true"></div>
    <div class="drawer__head">
      <h2 class="drawer__title" id="nav-sheet-title">모닥의 집</h2>
      <button class="btn btn--icon" type="button" data-close aria-label="메뉴 닫기"><svg data-icon="close"></svg></button>
    </div>
    <div class="drawer__body">
      <nav aria-label="모바일 메뉴">
        <div class="nav-sheet__group"><p class="nav-sheet__label">방 둘러보기</p>
          <a class="nav-sheet__link" href="../index.html#living"><span class="dot" data-room="butter"></span>거실</a>
          <a class="nav-sheet__link" href="../index.html#kitchen"><span class="dot" data-room="sage"></span>부엌</a>
          <a class="nav-sheet__link" href="../index.html#study"><span class="dot" data-room="fjord"></span>창가 서재</a>
          <a class="nav-sheet__link" href="../index.html#dining"><span class="dot" data-room="oak"></span>식탁방</a>
          <a class="nav-sheet__link" href="../index.html#bedroom"><span class="dot" data-room="rose"></span>침실</a>
          <a class="nav-sheet__link" href="../index.html#workshop"><span class="dot" data-room="ember"></span>공방</a>
          <a class="nav-sheet__link" href="../index.html#attic"><span class="dot" data-room="attic"></span>다락</a>
        </div>
        <div class="nav-sheet__group"><p class="nav-sheet__label">다른 화면</p>
          <a class="nav-sheet__link" href="dashboard.html"><span class="dot" data-room="butter"></span>오늘의 쇼룸</a>
          <a class="nav-sheet__link" href="inbox.html"><span class="dot" data-room="fjord"></span>상담함</a>
          <a class="nav-sheet__link" href="kanban.html"><span class="dot" data-room="oak"></span>스타일링 보드</a>
          <a class="nav-sheet__link" href="onboarding.html"><span class="dot" data-room="sage"></span>우리 집 취향 찾기</a>
          <a class="nav-sheet__link" href="pricing.html"><span class="dot" data-room="rose"></span>홈스타일링 요금</a>
          <a class="nav-sheet__link" href="product.html"><span class="dot" data-room="ember"></span>솜솜 양모 담요</a>
          <a class="nav-sheet__link" href="profile.html"><span class="dot" data-room="butter"></span>스타일리스트 정이안</a>
          <a class="nav-sheet__link" href="settings.html"><span class="dot" data-room="fjord"></span>내 계정 · 오지민</a>
          <a class="nav-sheet__link" href="404.html"><span class="dot" data-room="attic"></span>닫힌 다락 문</a>
        </div>
      </nav>
    </div>
  </div>
</div>

<div class="toasts" aria-live="polite" aria-relevant="additions"></div>
```

### 3-4. 사이드바 셸 — 운영 페이지(dashboard · inbox · kanban)만

`<header class="nav">` 바로 아래, `<main>` 대신 이 셸을 쓴다. 지금 화면 링크에 `aria-current="page"`. 960px 미만에서는 위쪽 가로 띠(스크롤 + 오른쪽 페이드)로 바뀐다.

```html
<div class="shell">
  <aside class="side" aria-label="쇼룸 운영">
    <div class="side__who"><span class="avatar" data-room="fjord">하늘</span><span class="side__who-text"><span class="side__who-name">백하늘</span><span class="side__who-role">쇼룸 매니저 · 모닥의 집</span></span></div>
    <div class="side__group">
      <p class="side__label">오늘 일</p>
      <ul class="side__list">
        <li><a class="side__link" href="dashboard.html"><span class="dot" data-room="butter"></span>오늘의 쇼룸</a></li>
        <li><a class="side__link" href="inbox.html"><span class="dot" data-room="fjord"></span>상담함<span class="count" aria-label="미답 6건">6</span></a></li>
        <li><a class="side__link" href="kanban.html"><span class="dot" data-room="oak"></span>스타일링 보드<span class="count count--quiet" aria-label="진행 중 17건">17</span></a></li>
      </ul>
    </div>
    <div class="side__group">
      <p class="side__label">쇼룸 장부</p>
      <ul class="side__list">
        <li><a class="side__link" href="dashboard.html#orders"><span class="dot" data-room="oak"></span>주문 장부</a></li>
        <li><a class="side__link" href="dashboard.html#tours"><span class="dot" data-room="rose"></span>투어 달력</a></li>
        <li><a class="side__link" href="dashboard.html#stock"><span class="dot" data-room="sage"></span>담요 재고</a></li>
      </ul>
    </div>
    <div class="side__status" role="status">
      <p class="side__status-head"><span class="pill__dot pill__dot--lamp"></span>지금 영업 중</p>
      <p>램프 타임 <b>19:00</b>부터 · 남은 투어 5팀<br><b>16:30</b> 2팀 · <b>19:30</b> 3팀</p>
    </div>
  </aside>
  <main class="shell__main" id="main">
    …
  </main>
</div>
```

---

## 4. 시그니처 ① — 사물 일러스트

```html
<span class="obj" data-obj="chair-blanket" aria-hidden="true"></span>
<span class="obj obj--hang" data-obj="pendant" style="--cord:180px" aria-hidden="true"></span>
<span class="obj" data-obj="blanket" data-swatch="GK" style="--obj-w:220px" aria-hidden="true"></span>
```

app.js가 빈 `[data-obj]`에 SVG를 채운다. 크기는 `--obj-w`(폭, 높이는 비율대로). 색은 토큰이 칠하므로 밤에는 자동으로 밤 장면이 된다(램프 · 초만 빛 원뿔이 켜짐).

| `data-obj` | 사물 | 기본 폭 | 바꿀 수 있는 색 변수 |
|---|---|---|---|
| `pendant` | 오름 펜던트 램프(빛 원뿔 포함, 그림자 없음 — 천장에 매달림). `.obj--hang` + `--cord`로 위쪽 줄 길이 | 200 | `--obj-shade` |
| `tablelamp` | 등불 테이블 램프 | 120 | `--obj-shade` |
| `candle` | 밤불 밀랍초(불꽃 흔들림, 빛은 밤에만) | 44 | — |
| `mug` | 도톰 머그(김 3줄) | 72 | `--obj-mug` |
| `blanket` | 접힌 솜솜 양모 담요 2장(뜨개 줄 + 술) | 180 | `data-swatch` 또는 `--obj-fabric` |
| `chair` / `chair-blanket` | 둥지 라운지 체어 / 좌석 위 접힌 담요 | 260 | `--obj-chair`, `--obj-fabric` |
| `stool` | 나무결 오크 스툴 | 120 | — |
| `sidetable` / `sidetable-set` | 소담 사이드 테이블 / 그 위 머그 + 초 | 150 | `--obj-mug` |
| `shelf` | 차곡 오크 선반(책 · 화병 · 머그 · 초 · 담요 · 바구니) | 240 | — |
| `window` | 4분할 노을 창(산 실루엣 + 해) — **index 거실 한 곳 전용** | 196 | `data-sky` |
| `window-french` | 바닥까지 닿는 두 짝 프렌치 창 + 묶어 둔 리넨 커튼 — 창가 서재 | 200 | `data-sky`, `--obj-curtain` |
| `window-curtain` | 커튼을 친 창(가운데 틈으로 하늘 한 줄) — 침실 | 180 | `data-sky`, `--obj-curtain` |
| `window-sidelite` | 현관문 옆 세로 유리 — settings 현관 | 56 | `data-sky` |
| `window-square` | 작은 정사각 창 + 반만 가린 카페 커튼 — 한 구석 · 미니 방 견본 | 130 | `data-sky`, `--obj-curtain` |
| `skylight` | 경사 지붕 천창(올려다본 밤하늘 · 초승달 · 유리 위 눈) — 다락 · 404 | 240 | `data-sky="night"` |
| `porthole` | 나무 테 둥근 창(밤하늘 · 달) — index 다락 | 200 | `data-sky="night"` |
| `door` / `door-lit` | 방 문 / 닫힌 다락 문 + 문틈 램프 빛(404) | 110 / 190 | `--obj-door` |
| `plant` | 올리브 화분 | 110 | — |
| `cat` | 웅크려 자는 보리(치즈색 코리안숏헤어) | 150 | — |
| `yarn` | 실타래 | 80 | `--obj-yarn` |
| `frame` | 걸린 액자 | 120 | — |
| `bed` | 침대(담요 덮인) | 380 | `--obj-fabric` |
| `desk` | 창가 책상 | 260 | — |
| `sofa` | 3인용 소파 정면(등쿠션 셋 · 좌방석 셋 · 쿠션 하나) | 300 | `data-cover` |
| `loveseat` | 2인용 소파 — 둥근 등받이 · 나무 팔걸이 · 높은 다리 | 240 | `data-cover` |
| `daybed` | 등받이 없는 데이베드 — 원통 베개 · 접어 둔 담요 | 300 | `data-cover`, `data-swatch` |
| `blanket-drape` | 팔걸이에 늘어진 담요 클로즈업(뜨개 코 · 띠 · 술 · 라벨) — product 전용 | 400 | `data-swatch` |
| `rug` | 비스듬히 본 양모 러그(띠 두 줄 + 앞 술). 문 앞 도어매트로도 | 300 | `--obj-wool`, `data-swatch`(가운데 띠) |
| `swatches` | 나무 봉에 건 패브릭 샘플 4종(세이지 부클레 · 장작 가죽 · 눈밭 리넨 · 버터 양모) — inbox 주인공 | 200 | — |
| `shoerack` | 현관 신발장(운동화 · 털신 · 장화 · 열쇠) — settings 주인공 | 240 | — |
| `parcel` | 모닥 크라프트 택배 상자(테이프 · 송장) | 120 | — |
| `arrow-curve` / `arrow-straight` | 연필 메모 화살표(굽은 1종 · 곧은 1종) | 96 / 80 | `color` |

- **크기 덮어쓰기**: base.css의 기본 폭은 `:where(.obj[data-obj=…])`로 감싸 특이도가 0이다. 장면 CSS의 단일 클래스(`.my-scene__chair { --obj-w: 40cqw }`)가 그대로 이긴다.
- **빛 원뿔**: `pendant` · `tablelamp`의 원뿔(`.o-glow`)은 위→아래로 사라지는 그라디언트(app.js가 `#mdk-glow-day|night`를 한 번 넣음), 밤엔 `screen`. 테이블 램프 · 초는 끝에 빛 웅덩이(`.o-pool`)가 있다. 펜던트를 걸 땐 **원뿔이 의자 · 탁자 같은 대상 위에서 끝나게** 높이를 맞춘다(허공에서 끝나면 실패).
- **창 하늘 = 장면 시각 `data-sky`**: `dusk`(해질녘 노을, 기본) · `day`(맑은 낮) · `snow`(눈 오는 구름 하늘 + 눈송이, 해 없음) · `night`(밤하늘 + 별 + 달). 창 사물이나 그 장면에 단다. 값은 가장 가까운 `data-theme`의 `--sky-*`를 따르므로 밤 모드에선 dusk · day도 밤하늘이 되고, **다락 · 404처럼 밤인 방은 `night`로 고정**한다(낮 하늘 창 금지).
- **소파 천 `data-cover`**: `SC`(숯 + 버터 쿠션) · `BT`(버터 + 장작) · `JG`(장작 가죽 + 눈밭) · `NB`(눈밭 리넨 + 솔잎) · `SL`(솔잎 + 귤껍질) · `GK`(귤껍질 + 눈밭). 같은 소파를 되풀이하지 않도록 장면마다 형태 · 천을 나눈다 — 지금 배정: index 다락 견본 `loveseat JG` · dashboard `loveseat SC` · inbox `sofa JG` · pricing 한 방 `sofa NB` / 온 집 `loveseat SL` · onboarding `loveseat GK` · profile 상도동 `sofa SC` · settings 화면 견본 `daybed SL`.
- **창 배정**: 거실 `window`(dusk) · 창가 서재 `window-french`(snow) · 다락 `porthole`(night) · 404 · profile 망원동 다락방 `skylight`(night) · settings 현관 `window-sidelite`(snow) · settings 침실 카드 · onboarding 저녁 카드 `window-curtain` · pricing 한 구석 · inbox · profile 부암동 서재 · 미니 방 견본 `window-square`.
- 밤의 러그는 `--obj-wool`(낮 = 눈밭, 밤 = 코코아 양모 #6B5A4C). 채도 0 회색 금지.
- 흰 물건(베개 · 시트 · 운동화 · 냉장고)은 `--obj-linen` / `--obj-linen-d`(낮 = 종이 #FFFAF3, 밤 = **촛불에 비친 린넨 #8C7A68**). 밤 장미 벽(#4D2C33) 위에서도 침대 베개가 묻히지 않는다. 베개(`.o-pillow`)는 밤에 램프빛 1.5px 테를 받는다.
- **페이지마다 주인공 사물 하나** — 같은 클립아트 세트를 돌려 쓰지 않는다. 라운지 체어 + 펜던트 조합은 index 거실 · 다락 두 곳에만, 고양이 보리(`cat`)는 index 거실 · 404 두 곳에만.

  | 페이지 | 주인공 사물 |
  |---|---|
  | index | 거실 체어 + 펜던트 · 다락 독서 구석 · 보리 |
  | dashboard | 집 단면(방마다 불) · 해 길이 호 |
  | inbox | `swatches` 패브릭 샘플 4종 |
  | kanban | 평면 배치도 |
  | onboarding | 소파 + 러그로 채워지는 빈 방 |
  | pricing | 한 구석 = 창가 스툴 + 러그 · 한 방 = 소파 · 온 집 = 집 단면 |
  | product | `blanket-drape` 담요 클로즈업 |
  | profile | 끝낸 방 띠(침실 · 부엌 · 상도동 소파 · 서재) |
  | settings | `shoerack` 현관 신발장 + `parcel` 택배 상자 |
  | 404 | 닫힌 다락 문 + 보리 |
- 사물은 **바닥선 위에 선다**: `.scene`(아래 정렬) 안에 두거나, 장면 CSS에서 `position:absolute; bottom:…`으로 바닥선에 맞춘다. 사물끼리 겹칠 땐 뒤 → 앞 순서로 마크업.
- 문 7개 팔레트처럼 같은 사물을 색만 바꿔 줄 세울 땐 `style="--obj-door: var(--room-sage)"`.
- 램프 끄기: `.obj.is-off`(빛 원뿔 · 전구 꺼짐). 촛불 · 김은 화면에 보일 때만 움직인다(app.js가 `.is-live`). **한 화면에 움직이는 불꽃은 최대 2개.**
- 장식 SVG 곡선 · 출처 없는 빛 얼룩 금지. 빛은 반드시 그것을 내는 사물에 붙어 있다.

---

## 5. 시그니처 ② — 카탈로그 콜아웃 · 범례 · 연필 메모

```html
<!-- 장면 위 번호: 부모가 position:relative. --x/--y는 장면 안 위치, --len/--ang은 지시선 -->
<span class="callout" style="--x:58%; --y:6%; --len:40px; --ang:150deg">1</span>

<!-- 사물 좌표에서 계산하는 지시선(권장): 장면에 container-type:inline-size + --ar(높이 ÷ 폭).
     --cx/--cy 번호 자리, --tx/--ty 사물에 닿는 끝점(장면 % · 단위 없음). 끝점엔 6px 점이 찍혀 '닿음'을 보여 준다 -->
<span class="callout callout--to" style="--cx:8; --cy:60; --tx:20.5; --ty:74">2</span>

<!-- 방 왼쪽 아래 범례 -->
<ol class="legend">
  <li class="legend__item"><span class="legend__no">1</span><span class="legend__name">오름 펜던트 램프</span><span class="legend__price">₩289,000</span></li>
  <li class="legend__item"><span class="legend__no">2</span><span class="legend__name">둥지 라운지 체어</span><span class="legend__price">₩1,480,000</span></li>
</ol>

<!-- 연필 메모: 사람의 한마디 (뷰포트당 최대 2개, 숫자·시각·가격은 손글씨로 쓰지 않는다) -->
<p class="memo" style="--rot:-3deg"><span>의자 위 담요는<br>만져 보셔도 돼요</span><span class="obj" data-obj="arrow-curve" aria-hidden="true"></span></p>
```

- `.callout--static`은 글 흐름 안의 번호(지시선 없음). 다락 · 문간 위에서는 색이 자동 반전.
- `.memo--lg`(40px), `.memo--flip`(화살표가 왼쪽), `.memo--free`(장면 안 `position:absolute` 메모 — 좁은 부모 폭에 눌려 한 단어씩 접히지 않게 `max-width:none` + `nowrap`).

---

## 6. 아이콘

```html
<svg data-icon="search"></svg>           <!-- app.js가 24 그리드 1.75px 선으로 채운다 → .icon 20px -->
<svg class="icon--lg" data-icon="cart"></svg>   <!-- 24px · .icon--sm 16px -->
```

이름: `search close menu chevron-down chevron-up chevron-left chevron-right arrow-right arrow-left check plus minus info ok warn danger more cart calendar home chat board sliders user trash copy undo edit play pause replay lamp sun moon truck pin clock phone heart star filter send door bell card screen chart box grip attach`.
아이콘만 있는 버튼은 반드시 `aria-label`. 직접 SVG를 그려도 되지만 `stroke`/`fill`에 `var()`를 쓰지 말 것(`.icon`이 `currentColor`로 칠한다).

---

## 7. 컴포넌트 32 (알파벳순)

### accordion — 서랍
```html
<div class="acc" data-accordion="single">
  <div class="acc__item">
    <h3><button class="acc__head" type="button" aria-expanded="true" aria-controls="faq-wash"><span class="acc__q">세탁은 어떻게 하나요?</span><span class="acc__knob" aria-hidden="true"></span></button></h3>
    <div class="acc__panel" id="faq-wash"><div class="acc__inner"><div class="acc__body"><p>찬물 손세탁 뒤 눕혀서 말려 주세요. 드라이클리닝도 괜찮아요.</p></div></div></div>
  </div>
  …
</div>
```
`data-accordion`(여러 개 열림) / `="single"`(하나만). 닫힌 서랍의 나무 손잡이엔 + 각인, 열면 손잡이가 반 바퀴 돌며 세로 홈이 누워 − 각인이 된다(+ 닫힘 · − 열림 관례). 열린 서랍은 왼쪽 3px 장작 손잡이 선. 머리 오른쪽에 메타가 필요하면 `<span class="acc__meta">`.

### alert — 종이 쪽지
```html
<div class="note note--warn" role="status">
  <span class="note__icon"><svg data-icon="warn"></svg></span>
  <div><p class="note__title">귤껍질 담요가 4장 남았어요</p><p class="note__body">버터 34 · 솔잎 21 · 눈밭 9 · 귤껍질 4장. 오늘 안에 재주문해 주세요.</p>
    <div class="note__actions"><a class="btn btn--quiet btn--sm" href="dashboard.html#stock">재고 보기</a></div></div>
  <button class="btn btn--icon btn--sm note__close" type="button" data-dismiss aria-label="쪽지 닫기"><svg data-icon="close"></svg></button>
</div>
```
톤 `note--ok|warn|danger|info`(아이콘 `ok|warn|danger|info`와 짝). `.note--soft` = 상태색 연한 바탕. 위험은 `role="alert"`.

### badge — 꼬리표 · 알약 · 숫자 · 아바타 · 색 점
```html
<span class="tag tag--low">4장 남음</span>          <!-- 꼬리표: tag(크라프트) --new --low --sold --info --brand --room -->
<span class="pill pill--ok"><svg data-icon="check"></svg>배송 준비</span>   <!-- --ok --warn --danger --info --line --brand -->
<span class="pill" data-room="rose">패브릭</span>      <!-- 카테고리 = 방 색 -->
<span class="pill" data-room="butter"><span class="pill__dot pill__dot--lamp"></span>불 켜짐</span>
<span class="count">6</span>  <span class="count count--quiet">17</span>
<span class="avatar" data-room="sage">이안</span>   <!-- --sm 32 · 기본 40 · --lg 56 · --xl 96 / .avatar-stack -->
<span class="sw" data-swatch="GK"></span>   <!-- 상품 색 점, --lg 28px -->
```
분류 ↔ 방 색: 조명 butter · 테이블웨어 sage · 가구 oak · 패브릭 rose · 초·향 ember. 아바타 이니셜은 이름 두 글자(정이안 → 이안).

### breadcrumb
```html
<nav class="crumbs" aria-label="현재 위치"><ol>
  <li><a href="../index.html">모닥의 집</a></li><li><a href="../index.html#bedroom">패브릭</a></li><li><span aria-current="page">솜솜 양모 담요</span></li>
</ol></nav>
```
구분자(작은 문지방)는 CSS가 그린다.

### button — 나무 손잡이
```html
<button class="btn btn--primary btn--lg" type="button">투어 예약하기</button>
<button class="btn btn--primary" type="button" aria-busy="true">담는 중</button>   <!-- 로딩 -->
<button class="btn btn--primary" type="button" disabled>품절</button>
<button class="btn btn--secondary" type="button">색 비교하기</button>
<a class="btn btn--quiet" href="pricing.html">스타일링 요금 보기<svg data-icon="arrow-right"></svg></a>
<button class="btn btn--room" type="button">방 면 위에서만</button>
<button class="btn btn--icon btn--secondary" type="button" aria-label="더 보기"><svg data-icon="more"></svg></button>
```
크기 `--lg`(52) · 기본(44) · `--sm`(36 — `pointer: coarse` 또는 640px 이하에서는 컴포넌트가 자동으로 44px로 올린다. 아이콘 `--sm`도 44×44). `--block` 꽉 차게. 줄 세우기 `.btn-row`(`--end`). **CTA 쌍("시작하기/데모 보기") 금지** — 한 장면에 주 버튼 하나.
시연: `data-busy-demo="1400" data-busy-done="예약을 확인했어요"`.

### calendar — 투어 달력 (월요일 시작)
```html
<div class="cal" data-calendar>
  <div class="cal__head"><p class="cal__title"><b>2026</b>년 <b>12</b>월 투어</p>
    <div class="cal__nav"><button class="btn btn--icon btn--sm" type="button" aria-label="11월 보기"><svg data-icon="chevron-left"></svg></button><button class="btn btn--icon btn--sm" type="button" aria-label="2027년 1월 보기"><svg data-icon="chevron-right"></svg></button></div></div>
  <div class="cal__grid" role="grid" aria-label="2026년 12월">
    <div class="cal__dow" role="row"><span role="columnheader">월</span><span role="columnheader">화</span><span role="columnheader">수</span><span role="columnheader">목</span><span role="columnheader">금</span><span role="columnheader">토</span><span role="columnheader">일</span></div>
    <div class="cal__week" role="row">
      <button class="cal__day is-out" type="button" disabled tabindex="-1"><span class="cal__n">30</span></button>   <!-- 11/30 월 -->
      <button class="cal__day" type="button" disabled aria-label="12월 1일 화요일 · 지난 날"><span class="cal__n">1</span></button>
      …
    </div>
    <div class="cal__week" role="row">
      <button class="cal__day is-closed" type="button" disabled><span class="cal__n">14</span><span class="cal__left">휴무</span></button>
      …
      <button class="cal__day is-today is-few" type="button" aria-label="12월 18일 금요일 · 빈자리 2" data-label="12월 18일 금요일 · 빈자리 2"><span class="cal__n">18</span><span class="cal__left">2자리</span></button>
      <button class="cal__day is-full" type="button" disabled><span class="cal__n">19</span><span class="cal__left">마감</span></button>
      <button class="cal__day" type="button" aria-selected="true" aria-label="12월 20일 일요일 · 빈자리 4" data-label="12월 20일 일요일 · 빈자리 4"><span class="cal__n">20</span><span class="cal__left">4자리</span></button>
    </div>
  </div>
  <div class="cal__legend"><span><i class="cal__key cal__key--today"></i>오늘</span><span><i class="cal__key cal__key--sel"></i>고른 날</span><span><i class="cal__key cal__key--closed"></i>휴무</span><span>숫자 = 그날 남은 투어 자리</span></div>
  <p class="t-small t-muted">고른 날: <span data-calendar-out>12월 20일 일요일 · 빈자리 4</span></p>
</div>
```
2026년 12월 1일은 **화요일**. 월요일 칸(12/7·14·21·28)은 `is-closed`. 지난 날(1–17일)은 `disabled`. 빈자리는 칸 안에 글자로(`4자리`, `2자리`=`is-few`, `마감`=`is-full`). **"남은 N팀"은 아직 올 손님(오늘 남은 투어 5팀), "N자리 · 빈자리 N"은 예약할 수 있는 빈 자리** — 두 말을 섞지 않는다. 고를 수 있는 칸은 `aria-label`과 `data-label`(고른 날 글자)을 둘 다 단다(스크린리더가 "18 2자리"만 읽지 않게). 작은 날짜 고르기는 `.cal--mini`(빈자리 숨김). **날짜별 빈자리는 DIRECTION 팩트 시트 "12월 투어 달력" 표 값만 쓴다**(18일 2 · 19일 마감 · 20일 4 · 22일 6 · 23일 5 · 24일 3 · 25일 1 · 26일 마감 · 27일 2 · 29일 8 · 30일 7 · 31일 3). 2자리 이하는 `is-few`. 400px 이하에선 칸 사이 2px, 달력을 감싼 `.sheet`가 좌우로 12px 넓어져 칸 폭 44px 이상을 지킨다. 이전/다음 달 버튼은 `btn--sm`이어도 터치 화면에선 44px이 된다.

### card — 상품 · 정보 · 고르기
```html
<!-- 상품: 면 = 분류 방 색(data-room), 사물 = 상품 색(data-swatch) -->
<article class="card card--product" data-room="rose" data-swatch="BT">
  <div class="card__room"><span class="tag tag--low">귤껍질 4장 남음</span><span class="obj" data-obj="blanket"></span></div>
  <div class="card__body">
    <p class="card__code">MD-TX-104</p>
    <h3 class="card__name"><a href="product.html">솜솜 양모 담요</a></h3>
    <div class="card__meta"><span class="card__price">₩168,000</span>
      <span class="card__swatches" aria-label="색 4가지"><span class="sw" data-swatch="BT"></span><span class="sw" data-swatch="SL"></span><span class="sw" data-swatch="NB"></span><span class="sw" data-swatch="GK"></span></span></div>
  </div>
</article>

<!-- 정보: 위 4px 방 색 띠 -->
<article class="card card--info" data-room="butter">
  <p class="card__label">12월 1–18일 매출</p>
  <p class="card__num">₩61,840,000</p>
  <p class="card__delta"><svg class="icon--sm" data-icon="chart"></svg>11월 같은 기간보다 28%</p>
  <p class="memo" style="--rot:-2deg">어제보다 3팀 많아요</p>
</article>

<!-- 고르기(온보딩): label + 숨긴 input -->
<label class="card card--pick card--product" data-room="sage">
  <input class="sr-only" type="radio" name="room" value="kitchen">
  <span class="card__check"><svg data-icon="check"></svg></span>
  <span class="card__room"><span class="obj" data-obj="shelf" style="--obj-w:150px"></span></span>
  <span class="card__body"><span class="card__name">부엌</span></span>
</label>
```
크기 변주 `.card--tall`(3:4) `.card--wide`(16:9) 또는 `style="--card-ratio:…"`. 같은 카드 3개 균등 그리드 금지. `.is-soldout` = 사물 흐리게. 정보 카드 숫자 옆 연필 메모는 화면당 2개 한도 안에서.

### carousel — 이번 주 들어온 물건
```html
<section class="carousel" data-carousel aria-roledescription="캐러셀" aria-label="이번 주 들어온 물건">
  <div class="carousel__head"><h3 class="carousel__title">이번 주 들어온 물건</h3>
    <div class="carousel__ctrl"><button class="carousel__btn" type="button" data-carousel-prev aria-label="이전 물건"><svg data-icon="chevron-left"></svg></button><span class="carousel__count" data-carousel-count aria-live="polite"></span><button class="carousel__btn" type="button" data-carousel-next aria-label="다음 물건"><svg data-icon="chevron-right"></svg></button></div></div>
  <div class="carousel__track" aria-label="물건 목록">
    <div class="carousel__slide carousel__slide--l">…card--product…</div>
    <div class="carousel__slide carousel__slide--s">…</div>
    <div class="carousel__slide carousel__slide--m">…</div>
  </div>
</section>
```
폭 `--s`(210) `--m`(260) `--l`(340)을 섞는다. 자동재생 없음, 점 인디케이터 없음(카운터 "3 / 8").

### code — 레시피 카드
```html
<figure class="code">
  <figcaption class="code__head"><span class="code__title">방 색을 바꾸는 법</span><span class="code__lang">html</span>
    <button class="code__copy" type="button" data-copy><svg data-icon="copy"></svg><span data-copy-label>복사</span></button></figcaption>
  <pre tabindex="0"><code><span class="tk-c">&lt;!-- 거실 면 --&gt;</span>
&lt;<span class="tk-k">section</span> <span class="tk-n">class</span>=<span class="tk-s">"room room--floored"</span> <span class="tk-n">data-room</span>=<span class="tk-s">"butter"</span>&gt;</code></pre>
</figure>
```
토큰 색 `.tk-c`(주석) `.tk-k`(키워드) `.tk-s`(문자열) `.tk-n`(이름) `.tk-p`(숫자).

### command — ⌘K "집 안에서 찾기"
루트는 3-3 공통 오버레이에 이미 있다(페이지당 1개). 여는 법: `⌘K / Ctrl+K`, 또는 `data-command-open` 버튼.
`.cmd__opt`에 `data-keywords`를 주면 그 말로도 찾는다. 결과 행 = 방 색 점 + 제목/부제 + 메타(코드는 `.cmd__opt-meta`, 가격은 `--price`).
**정적 견본(index 침실)**: 루트 `.cmd` 없이 `<div class="cmd__box cmd__box--static" role="dialog" aria-label="집 안에서 찾기 견본">…</div>` — 안쪽 마크업은 같고 첫 결과에 `aria-selected="true"`, 찾는 말 부분은 `<mark>`.

### drawer — 커튼
```html
<div class="drawer" id="filters" hidden>
  <div class="drawer__scrim"></div>
  <div class="drawer__panel" role="dialog" aria-modal="true" aria-labelledby="filters-title">
    <div class="drawer__rod" aria-hidden="true"></div>
    <div class="drawer__head"><div><h2 class="drawer__title" id="filters-title">…</h2><p class="drawer__sub">…</p></div><button class="btn btn--icon" type="button" data-close aria-label="닫기"><svg data-icon="close"></svg></button></div>
    <div class="drawer__body">…</div>
    <div class="drawer__foot">…</div>
  </div>
</div>
<button class="btn btn--secondary" type="button" data-drawer-open="filters" aria-controls="filters" aria-expanded="false">…</button>
```
오른쪽에서 위→아래로 풀린다. 왼쪽은 `.drawer--left`. 장바구니 한 줄은 `.cart-line`(썸네일 = 방 색 면 + 사물). **정적 견본**: `<div class="drawer__panel drawer__panel--static" role="dialog" aria-label="…">`(루트 `.drawer` 없이).

### empty — 빈 방
```html
<div class="empty" data-room="sage">
  <div class="empty__room"><span class="empty__perch"><span class="obj" data-obj="mug"></span><span class="obj" data-obj="stool"></span></span></div>
  <div class="empty__text"><h3 class="empty__title">장바구니가 아직 비어 있어요</h3><p>거실부터 천천히 둘러보세요.</p><a class="btn btn--primary" href="../index.html#living">거실로 가기</a></div>
</div>
```
사물 하나(또는 스툴 위 머그) + 한 문장 + 버튼 하나. `.empty--flat` = 종이 면 없이.

### form — 편지지
```html
<form class="letter" data-validate data-success="19:30 램프 타임 투어를 잡았어요" data-success-text="TR-1218-15 · 30분 전에 문자로 알려 드릴게요">
  <h2 class="letter__title">투어 예약</h2><p class="letter__sub">한 팀 최대 4명, 45분 동안 둘러봐요.</p>
  <div class="form-grid">
    <div class="field">
      <label class="field__label" for="tour-name">이름 <span class="field__req">필수</span></label>
      <input class="input" id="tour-name" name="name" required autocomplete="name">
    </div>
    <div class="field">
      <label class="field__label" for="tour-tel">연락처 <span class="field__req">필수</span></label>
      <input class="input" id="tour-tel" type="tel" required autocomplete="tel" aria-describedby="tour-tel-help">
      <p class="field__help" id="tour-tel-help">하루 전 문자로 알려 드려요.</p>
    </div>
    <div class="field">
      <label class="field__label" for="tour-slot">시간</label>
      <div class="select-wrap"><select class="select" id="tour-slot"><option>16:30 해질녘</option><option selected>19:30 램프 타임</option></select></div>
    </div>
    <fieldset class="fieldset" data-required-group data-error="몇 분이 오시는지 골라 주세요.">
      <legend>인원</legend>
      <div class="chips">
        <label class="chip"><input type="radio" name="ppl" value="1"><span class="chip__face">1명</span></label>
        <label class="chip"><input type="radio" name="ppl" value="2" checked><span class="chip__face">2명</span></label>
        <label class="chip"><input type="radio" name="ppl" value="4" disabled><span class="chip__face">4명</span></label>
        <!-- 사유가 붙은 못 고르는 칩: 취소선은 날짜에만 → <span class="chip__face"><span class="chip__off">19일 토</span>&nbsp;· 마감</span> -->
      </div>
    </fieldset>
    <div class="field field--full">
      <div class="field__row"><label class="field__label" for="tour-req">요청 사항 <span class="field__opt">선택</span></label><span class="field__memo" aria-hidden="true">선택 사항이에요</span></div>
      <textarea class="textarea" id="tour-req" placeholder="예: 거실 러그 크기를 같이 봐 주세요"></textarea>
    </div>
    <div class="field--full choice-list">
      <label class="switch"><input type="checkbox" role="switch" checked><span class="switch__track" aria-hidden="true"></span>램프 타임 소식 받기<span class="switch__state" aria-hidden="true"></span></label>
      <label class="check"><input type="checkbox">고양이 보리가 있어도 괜찮아요</label>
      <label class="radio"><input type="radio" name="pay" checked>현장 결제</label>
    </div>
    <div class="form-actions"><span class="form-actions__note">예약번호는 TR-1218-15로 나가요</span><button class="btn btn--primary btn--lg" type="submit">예약하기</button></div>
  </div>
</form>
```
- 오류 상태(정적으로 보여 줄 때): `.field.is-invalid` + `aria-invalid="true"` + `<p class="field__error" id="…"><svg data-icon="danger"></svg><span>숫자만, 010-0000-0000 모양으로 적어 주세요.</span></p>`(입력에 `aria-describedby`).
- 오류 문구 덮어쓰기: 입력에 `data-error`(비었을 때) · `data-error-format`(모양이 틀렸을 때). `type="email|tel"`, `pattern`, `minlength` 검사.
- 비활성 `disabled`(점선 테두리), 읽기 전용 `readonly`. 앞 붙이 `.input-group` + `.input-group__pre`(₩), 뒤 붙이 `.input-group--post` + `.input-group__post`(명).
- 수량 `<div class="stepper" data-stepper><button type="button" data-step="-1" aria-label="하나 빼기"><svg data-icon="minus"></svg></button><input type="number" value="1" min="1" max="4" aria-label="수량"><button type="button" data-step="1" aria-label="하나 더하기"><svg data-icon="plus"></svg></button></div>`.
- 색 고르기(상품 · 온보딩): `<div class="chips" data-swatch-pick data-swatch-target="#blanket-stage" role="radiogroup" aria-label="색">` 안에 `<label class="chip"><input type="radio" name="color" value="GK" data-name="귤껍질" data-room="ember"><span class="chip__face"><span class="sw" data-swatch="GK"></span>귤껍질</span></label>` → 대상의 `data-swatch`(와 대상이 `data-room`을 가졌다면 방 색까지)가 바뀌고 `[data-swatch-name]` 글자가 바뀐다.
- 스위치 `.switch--split` = 글자 왼쪽, 토글 오른쪽(설정 목록).

### kanban — 신발장 보드
```html
<!-- 칸 최소 폭은 --board-col(기본 248px). 좁은 본문(사이드바 옆 1018px 등)에선 장면 CSS가 --board-col: 190px로 낮춘다.
     넘칠 수 있으면 <div data-scroll-hint>로 감싸 오른쪽 페이드를 준다 -->
<div class="board" data-kanban aria-label="스타일링 진행">
  <section class="board__col" aria-labelledby="col-1">
    <div class="board__head"><h3 class="board__name" id="col-1">상담 접수</h3><span class="board__n">4</span></div>
    <ul class="board__list" aria-labelledby="col-1">
      <li class="board__card" data-room="fjord">
        <span class="board__code">ST-26-101</span>
        <p class="board__title">문가람 · 후암동 창가 서재</p>
        <p class="board__meta"><span>한 구석</span><span>₩190,000</span></p>
        <div class="board__foot"><span class="avatar avatar--sm" data-room="sage" title="정이안">이안</span><span class="board__date">12/19 첫 통화</span></div>
      </li>
    </ul>
    <button class="board__add" type="button"><svg data-icon="plus"></svg>상담 더하기</button>
  </section>
  …
</div>
```
카드 `data-room` = 고객 방 색(DIRECTION 팩트 시트 "고객 명부"의 방). **카드 문구 · 번호는 고객 명부 값만.** 일부 카드만 보여 주는 견본(index)은 `<span class="board__n" data-more="2">4</span>`처럼 화면 밖 카드 수를 `data-more`로 적어 실제 개수를 유지한다. 끌어 놓기 + 키보드(Space/Enter 집기 → ←/→ 열 · ↑/↓ 순서 → Space 놓기, Esc 취소). 열 숫자는 자동 갱신. 모바일은 열 82vw 가로 스냅.

### list — 영수증 · 명단 · 대화 목록
```html
<div class="receipt">
  <div class="receipt__row"><span class="receipt__name">솜솜 양모 담요<small>버터 · MD-TX-104-BT</small></span><span class="receipt__lead"></span><span class="receipt__amt">₩168,000</span></div>
  <div class="receipt__row receipt__row--sub"><span class="receipt__name">배송</span><span class="receipt__lead"></span><span class="receipt__amt">무료</span></div>
  <div class="receipt__row receipt__row--total"><span class="receipt__name">합계</span><span class="receipt__lead"></span><span class="receipt__amt">₩206,000</span></div>
  <p class="receipt__stamp">MDK-261218-0417 · 16:02</p>
</div>

<ul class="roster">
  <li class="roster__row is-done"><span class="roster__time">15:00</span><span class="roster__who"><span class="roster__name">허윤재 외 1명</span><span class="roster__sub">TR-1218-09</span></span><span class="pill pill--ok">다녀감</span></li>
  <li class="roster__row is-next"><span class="roster__time">16:30</span><span class="roster__who"><span class="roster__name">송가을 외 2명</span><span class="roster__sub">TR-1218-10 · 해질녘</span></span><span class="pill pill--info">20분 뒤</span></li>
</ul>

<ul class="rows">  <!-- 상담함 목록 -->
  <li><a class="rows__item is-unread" href="inbox.html" aria-current="true">
    <span class="avatar" data-room="butter">다온</span>
    <span class="rows__main"><span class="rows__title">류다온</span><span class="rows__text">거실 소파 패브릭 샘플 4종 받아볼 수 있나요?</span></span>
    <span class="rows__meta"><span>15:42</span><span class="count">2</span></span></a></li>
</ul>
```

### marquee — 공방의 리본 띠
```html
<div class="ribbon" data-marquee>
  <button class="ribbon__toggle" type="button" data-marquee-toggle aria-label="리본 띠 멈추기"><svg class="icon-pause" data-icon="pause"></svg><svg class="icon-play" data-icon="play"></svg></button>
  <div class="ribbon__viewport"><div class="ribbon__track"><ul class="ribbon__group">
    <li class="ribbon__item">오늘 들어온 물건</li>
    <li class="ribbon__item">밤불 밀랍초 3개입 <b>120</b>세트</li>
    <li class="ribbon__item">뭉게 울 러그 눈밭 <b>6</b>장</li>
  </ul></div></div>
</div>
```
그룹 복제는 app.js. 페이지당 1곳(index 공방 · 대시보드 정도). 감속 모드 = 정적 목록.

### menu — 메모지
```html
<div class="menu-anchor">
  <button class="btn btn--icon" type="button" data-menu-trigger aria-controls="order-0417-menu" aria-expanded="false" aria-haspopup="menu" aria-label="MDK-261218-0417 더보기"><svg data-icon="more"></svg></button>
  <div class="menu" id="order-0417-menu" role="menu" aria-label="주문 더보기" hidden>
    <p class="menu__label">MDK-261218-0417</p>
    <button class="menu__item" role="menuitem" type="button"><svg data-icon="truck"></svg>배송 조회</button>
    <button class="menu__item" role="menuitem" type="button"><svg data-icon="edit"></svg>배송지 바꾸기</button>
    <div class="menu__sep" role="separator"></div>
    <button class="menu__item menu__item--danger" role="menuitem" type="button"><svg data-icon="trash"></svg>주문 취소</button>
  </div>
</div>
```
`.menu--left`(왼쪽 기준) `.menu--up`(위로). 단일 선택 항목은 `role="menuitemradio" aria-checked`. ↑/↓/Home/End, Esc · 바깥 클릭으로 닫힘. **정적 견본**: `.menu.menu--static`(hidden 없이).

### modal — 펼친 이불
```html
<div class="modal" id="cancel-tour" hidden>
  <div class="modal__scrim"></div>
  <div class="modal__box" role="dialog" aria-modal="true" aria-labelledby="cancel-tour-title" data-room="rose">
    <div class="modal__art" aria-hidden="true"><span class="obj" data-obj="tablelamp" style="--obj-w:70px"></span><span class="obj" data-obj="candle" style="--obj-w:28px"></span></div>  <!-- 선택 -->
    <button class="btn btn--icon modal__close" type="button" data-close aria-label="닫기"><svg data-icon="close"></svg></button>
    <div class="modal__body">
      <h2 class="modal__title" id="cancel-tour-title">19:30 램프 타임 예약을 취소할까요?</h2>
      <p class="modal__text">12월 18일 금요일 · TR-1218-12 · 진새봄 님 외 1명. 취소하면 오늘 램프 타임 자리가 하나 더 열려요.</p>
    </div>
    <div class="modal__actions"><button class="btn btn--secondary" type="button" data-close>그대로 둘게요</button><button class="btn btn--primary" type="button" data-close data-toast="예약을 취소했어요" data-toast-tone="info">예약 취소</button></div>
  </div>
</div>
<button class="btn btn--secondary" type="button" data-modal-open="cancel-tour" aria-controls="cancel-tour" aria-expanded="false">예약 취소</button>
```
주 버튼이 맨 오른쪽. 위험 확인은 `.modal--danger`(제목 빨강) + 주 버튼 문구에 무엇을 하는지. 처음 포커스는 `data-autofocus`로 지정 가능. 모바일 = 아래에서 올라오는 시트. `.modal__box--wide`(720). 사실 목록 `.modal__facts`(`<dl>`). **정적 견본**: `.modal__box.modal__box--static`(루트 `.modal` 없이).

### motion — 시연 패널
```html
<div class="motion">
  <div class="motion__demo">
    <div class="motion__stage" data-room="butter" id="demo-lamp"><span class="obj is-off" data-obj="pendant"></span></div>
    <div class="motion__info"><span class="motion__name"><b>램프 켜기</b><span class="motion__token">--dur-lamp 1200ms</span>   <!-- 한글이 섞이면: --dur-room 700ms · 120ms <span class="motion__ko">늦게</span> --></span>
      <button class="btn btn--icon btn--secondary" type="button" data-motion-play="demo-lamp" aria-label="램프 켜기 다시 재생"><svg data-icon="replay"></svg></button></div>
  </div>
  <!-- 촛불(candle) · 김(mug) · 방 리빌(<span class="motion__box"></span><span class="motion__box"></span>) 같은 구조 -->
</div>
```
스크롤 리빌: 요소에 `.reveal`(사물은 `.reveal.reveal--late`, 120ms 늦게). 감속 모드에서는 바로 보인다.

### navbar · footer
3절 스니펫. 큰 줄 스위치(다락 · 설정 화면 미리보기):
```html
<button class="cord cord--lg" type="button" data-theme-toggle aria-pressed="false" aria-label="밤 장면으로 바꾸기"><span class="cord__string"></span><span class="cord__bead"></span><span class="cord__label" data-theme-label data-day="당겨서 밤으로" data-night="당겨서 낮으로"></span></button>
```
`[data-theme-label]`은 어디에 두든 낮/밤에 따라 `data-day`/`data-night` 글자로 바뀐다(기본 "낮"/"밤").

### pagination — 문 번호판
```html
<nav class="pager" aria-label="주문 장부 쪽">
  <a class="pager__step" href="dashboard.html#orders" aria-disabled="true"><svg data-icon="chevron-left"></svg><span>이전</span></a>
  <ol><li><a class="pager__n" href="dashboard.html#orders" aria-current="page">1</a></li><li><a class="pager__n" href="dashboard.html#orders">2</a></li><li><span class="pager__gap">…</span></li><li><a class="pager__n" href="dashboard.html#orders">14</a></li></ol>
  <a class="pager__step" href="dashboard.html#orders"><span>다음</span><svg data-icon="chevron-right"></svg></a>
  <p class="pager__info">382건 중 1–27</p>
</nav>
```

### popover — 메모 쪽지
```html
<div class="pop-anchor">
  <button class="chip__face" type="button" data-popover-trigger aria-controls="pop-gk" aria-expanded="false"><span class="sw" data-swatch="GK"></span>귤껍질</button>
  <div class="pop" id="pop-gk" role="dialog" aria-label="귤껍질 색 이야기" data-swatch="GK" hidden>
    <div class="pop__head"><span class="pop__chip"></span><div><p class="pop__title">귤껍질</p><p class="pop__code">GK</p></div></div>
    <p class="pop__text">해 질 녘 벽에 비친 귤빛. 4장 남았어요.</p>
  </div>
</div>
```
`.pop--right`(오른쪽 기준). 화면 밖으로 나가면 app.js가 뒤집는다. **정적 견본**: `.pop.pop--static`.

### progress — 뜨개 코 · 실타래
```html
<div class="knit">
  <div class="knit__label"><span class="knit__name" id="knit-1">담요 한 장 뜨는 중</span><span class="knit__pct"></span></div>
  <div class="knit__bar" role="progressbar" aria-valuenow="62" aria-valuemin="0" aria-valuemax="100" aria-labelledby="knit-1"><span class="knit__fill"></span></div>
</div>
<span class="skein" role="progressbar" aria-valuenow="62" aria-valuemin="0" aria-valuemax="100" aria-label="이번 주 투어 채운 비율"><span class="skein__pct"></span></span>
```
색 `.knit--ok|warn|lamp`. 퍼센트 대신 다른 글자를 쓰려면 `.knit__pct`에 `data-static`(예: `4 / 6`). 값 모름 `.knit--busy`. `.skein--sm`(56). JS: `Modak.setProgress(el, 80)`.

### sidebar
3-4 스니펫(운영 페이지 전용). 데스크톱에서 `.shell`이 사이드바 열(264px)을 페이지 끝까지 벽색으로 칠하고, `.side`만 화면에 붙어 따라온다. 셸 밖에 견본으로 둘 땐 `.side.side--static`(붙지 않음 · 내용 높이 · 좁은 화면에서도 세로).

### skeleton — 빈 액자
```html
<div class="skel-card" aria-busy="true" aria-label="물건을 불러오는 중">
  <span class="skel skel--frame"></span><span class="skel skel--title"></span><span class="skel skel--line"></span><span class="skel skel--line is-short"></span>
</div>
```
`.skel--circle`(아바타, `--av`), `--ratio`로 액자 비율.

### spinner — 감기는 실타래
```html
<span class="spinner" role="status"><span class="sr-only">불러오는 중</span></span>   <!-- --sm 20 · 기본 32 · --lg 48 -->
<p class="loading-row"><span class="spinner spinner--sm" aria-hidden="true"></span>상담함을 여는 중…</p>
```

### steps — 집 짓기 순서
```html
<ol class="steps">
  <li class="steps__item is-done"><span class="steps__mark"></span><span class="steps__text"><span class="steps__name">상담</span><span class="steps__sub">12월 2일</span></span></li>
  <li class="steps__item" aria-current="step"><span class="steps__mark"></span><span class="steps__text"><span class="steps__name">제안 2안</span><span class="steps__sub">지금</span></span></li>
  <li class="steps__item"><span class="steps__mark"></span><span class="steps__text"><span class="steps__name">배치 동행</span><span class="steps__sub">12월 23일</span></span></li>
</ol>
```
번호는 CSS 카운터. `.steps--vertical`, 600px 이하는 자동 세로(`.steps--keep`이면 가로 유지).

### table — 식탁 위 장부
```html
<div class="table-wrap" tabindex="0" role="region" aria-label="오늘 주문 장부">
  <table class="table table--cards" data-table-select data-selected-count="orders-picked">
    <caption>12월 18일 주문 27건 중 8건</caption>
    <thead><tr>
      <th class="check-cell"><label class="check"><input type="checkbox" data-select-all aria-label="모두 고르기"></label></th>
      <th scope="col"><button class="table__sort" type="button">주문</button></th>
      <th scope="col">고객</th><th scope="col">물건</th><th scope="col">상태</th>
      <th scope="col" class="num" aria-sort="descending"><button class="table__sort" type="button">금액</button></th>
    </tr></thead>
    <tbody>
      <tr>
        <td class="check-cell"><label class="check"><input type="checkbox" data-select-row aria-label="MDK-261218-0417 고르기"></label></td>
        <td class="code-cell" data-label="주문">MDK-261218-0417</td>
        <td data-label="고객"><span class="table__who"><span class="avatar" data-room="butter">다온</span>류다온</span></td>
        <td data-label="물건"><span class="table__item"><span class="dot" data-room="rose"></span>솜솜 양모 담요 · 버터</span></td>
        <td data-label="상태"><span class="pill pill--ok">배송 준비</span></td>
        <td class="num" data-label="금액">₩168,000</td>
      </tr>
    </tbody>
    <tfoot><tr><td colspan="5">8건 합계</td><td class="num">₩2,991,000</td></tr></tfoot>
  </table>
</div>
<p id="orders-picked" class="t-small t-muted" aria-live="polite"></p>
```
`.table--cards`는 720px 미만에서 카드형 행(각 `td`에 `data-label` 필수, 한 줄 전체는 `.is-wide`). caption은 카드 폭 전체로, tfoot 합계는 카드 폭 한 줄(이름 · 금액)로 컴포넌트가 처리한다 — 장면 CSS에서 따로 고치지 않는다. 주문 행 값은 팩트 시트 "오늘 주문 장부"(MDK-261218-0410~0417) 그대로. `.table--dense`(44px 행). 정렬값이 글자와 다르면 `td[data-sort]`. 720px 이상에서 `.table--cards`는 최소 폭 680px, `.table__item`은 최소 10em — 좁아지면 물건 칸을 짓누르지 않고 `.table-wrap`이 옆으로 밀린다.

`.table--ledger`(+ `.table--cards`): 칸 순서가 **고르기 · 주문 · 고객 · 물건 · 상태 · 금액**인 주문 장부 전용. 720px 미만에서 라벨 없는 두 줄 압축형(1줄 아바타 · 고객 · 주문번호 …… 금액 / 2줄 물건 …… 상태 배지, 행 약 80px).

### tabs — 방 문패
```html
<div class="tabs" data-tabs>
  <div class="tabs__scroller"><div class="tabs__list" role="tablist" aria-label="기간">
    <button class="tabs__tab" role="tab" aria-selected="true" aria-controls="p-today">오늘 <span class="count">27</span></button>
    <button class="tabs__tab" role="tab" aria-selected="false" aria-controls="p-week">이번 주</button>
    <button class="tabs__tab" role="tab" aria-selected="false" aria-controls="p-month">12월</button>
  </div></div>
  <div class="tabs__panel" id="p-today">…</div>
  <div class="tabs__panel" id="p-week" hidden>…</div>
  <div class="tabs__panel" id="p-month" hidden>…</div>
</div>
```
모바일 오른쪽 페이드 힌트는 `.tabs__scroller` 배경색에 맞춰야 하므로 종이 위면 `style="--tabs-bg: var(--paper-raised)"`.

**앵커 탭**(패널을 모두 펼쳐 둔 화면 — settings): `<nav class="tabs__scroller" data-anchor-tabs><div class="tabs__list"><a class="tabs__tab" href="#st-me" aria-current="true">…</a>…</div></nav>`. 문패는 해당 구획으로 가는 바로 가기이고, 지금 보이는 구획의 문패에 `aria-current`가 붙는다. 잘리는 폭에선 목록에 오른쪽 40px mask 페이드.

### timeline — 해 길이 위의 하루
```html
<ol class="tl" style="--tl-bg: var(--paper-raised)">   <!-- 놓인 면의 색 -->
  <li class="tl__item tl__item--sun"><time class="tl__time">07:43</time><span class="tl__dot"></span><div class="tl__body"><p class="tl__title">해 뜸</p></div></li>
  <li class="tl__item is-done" data-room="butter"><time class="tl__time">11:00</time><span class="tl__dot"></span><div class="tl__body"><p class="tl__title">문 열기 · 첫 투어 2팀</p></div></li>
  <li class="tl__item tl__item--now"><time class="tl__time">16:10</time><span class="tl__dot"></span><div class="tl__body"><p class="tl__title">지금<span class="tl__now-label">램프 켬</span></p></div></li>
  <li class="tl__item tl__item--sun tl__item--sunset"><time class="tl__time">17:17</time><span class="tl__dot"></span><div class="tl__body"><p class="tl__title">해 짐</p></div></li>
  <li class="tl__item is-night" data-room="ember"><time class="tl__time">19:30</time><span class="tl__dot"></span><div class="tl__body"><p class="tl__title">램프 타임 투어 3팀</p><p class="tl__text">TR-1218-12 ~ 14</p></div></li>
</ol>
```
해 진 뒤 행은 `.is-night`(선이 밤색).

### toast — 협탁 위 쪽지
```html
<button class="btn btn--primary" type="button" data-toast="솜솜 양모 담요(버터)를 담았어요" data-toast-text="장바구니 물건 3가지" data-toast-undo="되돌리기">장바구니에 담기</button>
```
또는 JS `Modak.toast({ title, text, tone: 'ok|warn|danger|info', undo: '되돌리기', onUndo })`. 자리(`.toasts`)는 3-3에 있다. **정적 견본**:
```html
<div class="toast toast--static toast--ok" role="status"><span class="toast__icon"><svg data-icon="ok"></svg></span><p class="toast__text"><b>솜솜 양모 담요(버터)를 담았어요</b><span class="toast__sub">장바구니 물건 3가지</span></p><div class="toast__actions"><button class="toast__undo" type="button">되돌리기</button><button class="btn btn--icon btn--sm toast__close" type="button" aria-label="쪽지 닫기"><svg data-icon="close"></svg></button></div></div>
```

### tooltip — 꼬리표
```html
<span class="tip-wrap"><button class="btn btn--icon" type="button" aria-label="소재 정보" aria-describedby="tip-wool"><svg data-icon="info"></svg></button><span class="tip" id="tip-wool" role="tooltip">무게 <b>1.4kg</b> · 뉴질랜드 양모 100%</span></span>
```
위가 기본, 아래는 `.tip--below`, 오른쪽 기준은 `.tip--end`(app.js가 화면 오른쪽 끝을 넘는 꼬리표에 자동으로 붙인다 — 숨은 꼬리표가 가로 스크롤을 만들지 않게). Esc로 숨김. **정적 견본**: `.tip.tip--static`.

---

## 8. app.js 훅 요약

| 속성 / 선택자 | 동작 |
|---|---|
| `[data-theme-toggle]` | 줄 스위치: 낮↔밤, localStorage `modak-theme`, `aria-pressed`, 당김 애니메이션 + 원형 불빛 번짐 |
| `[data-theme-label]` (`data-day`/`data-night`) | 지금 장면 이름 글자 |
| `[data-obj]` · `svg[data-icon]` | 사물 · 아이콘 SVG 채우기 |
| `[data-modal-open]` `[data-drawer-open]` `[data-open]` = id · `[data-close]` | 모달 · 드로어 열기/닫기(포커스 트랩, Esc, 딤 클릭, 포커스 되돌리기, 스크롤 잠금) |
| `[data-command]` · `[data-command-open]` · ⌘K/Ctrl+K | 커맨드 팔레트(거르기, ↑↓ Enter) |
| `[data-menu-trigger]` `[data-popover-trigger]` + `aria-controls` | 메뉴 · 팝오버(바깥 클릭 · Esc, 화면 밖이면 뒤집기) |
| `[data-tabs]` `[data-accordion]` `[data-carousel]` `[data-calendar]` `[data-kanban]` `[data-marquee]` `[data-stepper]` `[data-swatch-pick]` | 각 컴포넌트 |
| `[data-scene-pick]` (라디오 value = `light` · `dark` · `system`) | 화면 장면 고르기: 낮 · 밤은 `setTheme`, `system`은 저장값을 지우고 기기 설정을 따름(토스트). 줄 스위치를 당기면 라디오도 따라옴 |
| `[data-scroll-hint]` (래퍼 > 첫 자식 = 가로 스크롤 영역) | 넘칠 때 `.is-scrollable`, 끝까지 밀면 `.is-end` — 오른쪽 페이드는 장면 CSS가 그린다 |
| `table .table__sort` · `table[data-table-select]` | 정렬 · 고르기 |
| `form[data-validate]` | 검증 + 성공 토스트(`data-success`, `data-success-text`) |
| `[data-toast…]` `[data-busy-demo]` `[data-dismiss]` `[data-copy]` `[data-motion-play]` | 시연 동작 |
| `.reveal` | 화면에 들어오면 `.is-in`(700ms 내려앉기) |
| `window.Modak` | `toast()` `setTheme()` `setProgress()` `open(id)` `close(id)` `init(scope)` `icon(name)` |

이벤트: `modak:theme` `modak:open` `modak:close` `modak:tab` `modak:date` `modak:submitted`.

---

## 9. 쓰지 말 것

- 첫 화면 랜딩 공식(작은 라벨 → 거대 헤드라인 → CTA 2개 → 칩 4개), 통계 숫자 4개 가로줄, 가운데 정렬 섹션 머리 반복, 모든 방 같은 폭·같은 카드 그리드.
- **왼쪽 고정 목차 사이드바 + 문서형 스펙**, "§ 번호" 반복, 판권/문서 정보 정의 목록(theme-30 · 01 문법).
- 회색 석회벽 + 모노 라벨로 가득한 기술 사양서 톤. 이 집의 첫 인상은 **큰 방 색 면 + 사물**이다.
- 크림 + 세리프 서재 감성, 리넨 점 텍스처, radial 얼룩 배경, 흐린 빛 얼룩(빛은 램프 · 초에만).
- 모든 것에 같은 radius · 같은 그림자. 정적인 면에 그림자.
- 한글에 넓은 자간 · 모노 · 가짜 볼드 · 이탤릭. 손글씨로 본문 · 숫자 · 가격 쓰기, 화면당 연필 메모 3개 이상.
- 공방(ember) 면 위 13px 이하 글자, 낮 모드에서 `--lamp` 글자.
- 오버레이를 버튼과 설명 한 줄로 때우기 — 열린 상태 정적 견본(`--static`)과 실제 트리거를 둘 다. 견본에 루트 클래스(`.modal` `.drawer` `.cmd` `.ribbon`)를 쓰지 말 것.
- 셸 스니펫 변형(페이지마다 다른 푸터 · 다른 메뉴 항목).
