# COMPONENTS — 반죽섬 파티 v2 마크업 계약

index.html · pages/*.html 담당 에이전트는 **이 문서만 보고** 마크업한다. 디자인 근거와 세계관 값(날짜·인물·가격·ID)은 `DIRECTION.md`의 **팩트 시트**만 쓴다.
클래스는 BEM(`블록__요소--변형`). 상태는 가능하면 ARIA 속성으로 표시하고 CSS가 그 속성을 읽는다:
`aria-selected` · `aria-current` · `aria-expanded` · `aria-pressed` · `aria-checked` · `aria-busy` · `aria-invalid` · `aria-disabled` · `disabled`.

---

## 0. 페이지 뼈대 (모든 HTML 공통)

```html
<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>반죽섬 파티 — 상점 섬</title>
<script>(function(){var d=document.documentElement;d.classList.add('js');try{var q=new URLSearchParams(location.search).get('theme');var s=localStorage.getItem('banjuk-theme');var t=(q==='dark'||q==='light')?q:(s==='dark'||s==='light')?s:(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');d.setAttribute('data-theme',t);}catch(e){d.setAttribute('data-theme','light');}})();</script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fredoka:wdth,wght@75..125,500..700&family=Jua&family=Gowun+Dodum&family=Nunito:wght@400;600;800&family=DM+Mono:wght@400;500&family=Nanum+Gothic+Coding&display=swap">
<link rel="stylesheet" href="styles.css">        <!-- pages: ../styles.css -->
<link rel="stylesheet" href="index.css">         <!-- pages: product.css 등 장면 전용 1개 -->
</head>
<body>
  (셸: 1절 HUD 스니펫)
  <main id="main"> … 방(.room)들 … </main>
  (셸: 1절 바닥글 · 도크 스니펫)
  (오버레이: 커맨드 팔레트 1개 + 페이지의 모달·드로어·팝오버·메뉴는 body 끝에)
  <script src="app.js"></script>                <!-- pages: ../app.js -->
</body>
</html>
```

- `<head>` 인라인 스크립트는 **반드시 그대로**: `js` 클래스(착지 애니메이션용) + 테마 결정(`?theme=` → `localStorage['banjuk-theme']` → 시스템). 이게 없으면 `[data-land]` 오브젝트가 깜빡이거나 다크가 늦게 들어온다.
- 화면에 보이는 글은 전부 한국어. 예외: 워드마크 `BANJUK!`, `SEASON 7`·`NEW` 같은 라틴 배지(`.badge--latin`), ID(`BJ-2409-38172`, `SK-S7-014` …), 코드.
- 장면 CSS(`index.css`, `pages/*.css`)도 **semantic 토큰만**(2절). raw hex 금지, 인라인 `grid-template-columns` 금지(→ `.g12` + `.span-N`). 단 `style="--size:120px"`, `style="--val:42.5%"` 같은 **커스텀 속성 주입은 허용**.
- 아이콘은 인라인 SVG 24 그리드, `class="icon"` + `aria-hidden="true"`. 색·굵기는 CSS가 준다(`currentColor`, stroke 2.5). **presentation attribute에 `var()` 금지.** 크기: `.icon`(20) `.icon--lg`(24) `.icon--xl`(32). 9절에 이 시스템이 쓰는 아이콘 경로 정본이 있다.
- **이모지 금지.** 그림은 반죽이(`.dough`), CSS 오브젝트, 인라인 SVG로.

---

## 1. 공통 셸 — 복사해서 쓰는 스니펫 (수정 금지)

모든 화면은 아래 셸을 **글자 하나 바꾸지 않고** 복사한다. 바꿔도 되는 것은 `aria-current="page"`의 위치뿐이다(지금 화면의 링크로 옮긴다. 해당 링크가 없으면 지운다).

| 화면 | 위 | 아래 |
|---|---|---|
| index, onboarding, product, pricing, inbox, profile, settings, 404 | **플레이어 HUD** (1-1) | **바닥글** (1-3) + **도크** (1-2) |
| dashboard, kanban | **운영 HUD** (1-4) + **운영 레이아웃·사이드바** (1-5) | **바닥글** (1-3). 도크 없음 |

모든 화면 body 끝에 **커맨드 팔레트**(1-6) 1개.

### 1-1. 플레이어 HUD — index 경로 (`index.html`)

```html
<a class="skip" href="#main">본문으로 건너뛰기</a>
<header class="hud">
  <div class="hud__bar">
    <div class="hud__left">
      <a class="hud__player" href="pages/profile.html" aria-label="내 방: 콩떡대장, 레벨 62">
        <span class="ring" style="--val:.62"><span class="dough dough--mint dough--happy dough--avatar" aria-hidden="true"><span class="dough__face"><i class="dough__eye"></i><i class="dough__eye"></i><i class="dough__mouth"></i></span></span></span>
        <span class="hud__who"><span class="hud__name">콩떡대장</span><span class="hud__lv">Lv.62</span></span>
      </a>
      <nav class="hud__nav" aria-label="주 메뉴">
        <a class="hud__link" href="index.html" aria-current="page">로비</a>
        <a class="hud__link" href="pages/product.html">상점</a>
        <a class="hud__link" href="pages/pricing.html">패스</a>
        <a class="hud__link" href="pages/inbox.html">우편함</a>
        <a class="hud__link" href="pages/settings.html">설정</a>
      </nav>
    </div>
    <a class="hud__mark" href="index.html" aria-label="반죽섬 파티 로비">BANJUK<span>!</span></a>
    <div class="hud__right">
      <div class="hud__wallet" aria-label="보유 재화">
        <span class="hud__coin" data-wallet="jelly"><i class="jelly-ico"></i><b>2,340</b><span class="sr-only">젤리</span></span>
        <span class="hud__coin" data-wallet="coin"><i class="coin-ico"></i><b>18,650</b><span class="sr-only">코인</span></span>
      </div>
      <div class="hud__tools">
        <button class="btn btn--icon btn--sm" type="button" data-command-open aria-label="빠른 찾기 (⌘K)"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg></button>
        <button class="btn btn--icon btn--sm" type="button" data-theme-toggle aria-pressed="false" aria-label="밤 장면"><svg class="icon theme-ico--sun" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M2.5 12h2M19.5 12h2M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"/></svg><svg class="icon theme-ico--moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/></svg></button>
      </div>
    </div>
  </div>
</header>
```

### 1-1'. 플레이어 HUD — pages 경로 (`pages/*.html`, 예: product가 현재)

```html
<a class="skip" href="#main">본문으로 건너뛰기</a>
<header class="hud">
  <div class="hud__bar">
    <div class="hud__left">
      <a class="hud__player" href="profile.html" aria-label="내 방: 콩떡대장, 레벨 62">
        <span class="ring" style="--val:.62"><span class="dough dough--mint dough--happy dough--avatar" aria-hidden="true"><span class="dough__face"><i class="dough__eye"></i><i class="dough__eye"></i><i class="dough__mouth"></i></span></span></span>
        <span class="hud__who"><span class="hud__name">콩떡대장</span><span class="hud__lv">Lv.62</span></span>
      </a>
      <nav class="hud__nav" aria-label="주 메뉴">
        <a class="hud__link" href="../index.html">로비</a>
        <a class="hud__link" href="product.html" aria-current="page">상점</a>
        <a class="hud__link" href="pricing.html">패스</a>
        <a class="hud__link" href="inbox.html">우편함</a>
        <a class="hud__link" href="settings.html">설정</a>
      </nav>
    </div>
    <a class="hud__mark" href="../index.html" aria-label="반죽섬 파티 로비">BANJUK<span>!</span></a>
    <div class="hud__right">
      <div class="hud__wallet" aria-label="보유 재화">
        <span class="hud__coin" data-wallet="jelly"><i class="jelly-ico"></i><b>2,340</b><span class="sr-only">젤리</span></span>
        <span class="hud__coin" data-wallet="coin"><i class="coin-ico"></i><b>18,650</b><span class="sr-only">코인</span></span>
      </div>
      <div class="hud__tools">
        <button class="btn btn--icon btn--sm" type="button" data-command-open aria-label="빠른 찾기 (⌘K)"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg></button>
        <button class="btn btn--icon btn--sm" type="button" data-theme-toggle aria-pressed="false" aria-label="밤 장면"><svg class="icon theme-ico--sun" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M2.5 12h2M19.5 12h2M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"/></svg><svg class="icon theme-ico--moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/></svg></button>
      </div>
    </div>
  </div>
</header>
```

- 데스크톱(>1080px): 왼쪽 플레이어 칩(레벨 링 = `--val:.62`) + 내비 5개 · 가운데 워드마크 · 오른쪽 재화 2개 + ⌘K + 테마. ≤1080px: 내비가 숨고 도크가 나온다. ≤600px: 닉네임·코인 숨김. ≤400px: 재화 전부 숨김.
- 지금 화면이 내비에 없는 곳(onboarding, 404)은 `hud__link`의 `aria-current`를 모두 지운다. profile은 `<a class="hud__player" href="profile.html" aria-current="page" …>`처럼 플레이어 칩에 `aria-current="page"`를 붙인다(navbar.css가 칩을 눌린 홈 모양으로 그린다).
- 상단 내비가 닿는 곳은 로비·상점·패스·우편함·설정 + 플레이어 칩(profile) 6곳이다. 나머지(onboarding·dashboard·kanban·404)는 **모든 화면의 바닥글 섬 지도(1-3)**, index 섬 지도, ⌘K로 연결된다. 9개 페이지는 바닥글만으로 어디서든 닿는다.

#### 1-1''. 새 플레이어 변형 — onboarding(첫걸음 섬) 전용
처음 온 사람은 이름도 재화도 없다. 플레이어 칩과 지갑만 아래로 바꾸고 나머지는 1-1'과 같다.
```html
<a class="hud__player hud__player--new" href="#ob-title" aria-label="새 반죽이, 레벨 1 · 반죽이를 빚는 중">
  <span class="ring" style="--val:.04"><span class="dough dough--mint dough--surprised dough--avatar" aria-hidden="true"><span class="dough__face"><i class="dough__eye"></i><i class="dough__eye"></i><i class="dough__mouth"></i></span></span></span>
  <span class="hud__who"><span class="hud__name">새 반죽이</span><span class="hud__lv">Lv.1</span></span>
</a>
…
<!-- .hud__wallet 자리 -->
<span class="hud__coin hud__hello"><i class="hud__pulse" aria-hidden="true"></i>처음 오셨네요</span>
```
≤400px에서 `.hud__hello`는 지갑처럼 숨는다.
- `data-wallet="jelly"` 알약은 `[data-claim]` 보상 받기 버튼이 숫자를 올린다(20절).

### 1-2. 하단 도크 — index 경로 / pages 경로

```html
<nav class="dock" aria-label="하단 메뉴">
  <a class="dock__btn" href="pages/product.html"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 8h14l-1.2 12H6.2L5 8z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/></svg><span>상점</span></a>
  <a class="dock__btn" href="pages/pricing.html"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16v4a2 2 0 0 0 0 4v4H4v-4a2 2 0 0 0 0-4z"/><path d="M14 7v2M14 11.5v1M14 15v2"/></svg><span>패스</span></a>
  <a class="dock__btn dock__btn--home" href="index.html" aria-current="page"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M3.5 11L12 4l8.5 7"/><path d="M5.5 9.5V20h13V9.5"/><path d="M10 20v-5h4v5"/></svg><span>로비</span></a>
  <a class="dock__btn" href="pages/inbox.html"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="3.5"/><path d="M4.5 7.5l7.5 5.5 7.5-5.5"/></svg><span>우편</span><span class="badge badge--count badge--tomato badge--float" aria-label="새 우편 3통 (안 읽음 1 · 미수령 2)">3</span></a>
  <a class="dock__btn" href="pages/settings.html"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h9M19 6h1M4 12h3M11 12h9M4 18h11M19 18h1"/><circle cx="16" cy="6" r="2.2"/><circle cx="9" cy="12" r="2.2"/><circle cx="17" cy="18" r="2.2"/></svg><span>설정</span></a>
</nav>
```

```html
<nav class="dock" aria-label="하단 메뉴">
  <a class="dock__btn" href="product.html" aria-current="page"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 8h14l-1.2 12H6.2L5 8z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/></svg><span>상점</span></a>
  <a class="dock__btn" href="pricing.html"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16v4a2 2 0 0 0 0 4v4H4v-4a2 2 0 0 0 0-4z"/><path d="M14 7v2M14 11.5v1M14 15v2"/></svg><span>패스</span></a>
  <a class="dock__btn dock__btn--home" href="../index.html"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M3.5 11L12 4l8.5 7"/><path d="M5.5 9.5V20h13V9.5"/><path d="M10 20v-5h4v5"/></svg><span>로비</span></a>
  <a class="dock__btn" href="inbox.html"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="3.5"/><path d="M4.5 7.5l7.5 5.5 7.5-5.5"/></svg><span>우편</span><span class="badge badge--count badge--tomato badge--float" aria-label="새 우편 3통 (안 읽음 1 · 미수령 2)">3</span></a>
  <a class="dock__btn" href="settings.html"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h9M19 6h1M4 12h3M11 12h9M4 18h11M19 18h1"/><circle cx="16" cy="6" r="2.2"/><circle cx="9" cy="12" r="2.2"/><circle cx="17" cy="18" r="2.2"/></svg><span>설정</span></a>
</nav>
```

- ≤1080px에서만 보인다(그 위에선 `display:none`). 상단 HUD 내비가 같은 폭에서 숨기 때문이다(DIRECTION 5-7의 '≤600px'보다 넓게 잡았다). `body:has(.dock)`이 같은 ≤1080px에서 아래 여백을 자동으로 준다(base.css).
- 견본처럼 흐름 안에 그대로 그릴 때(폭과 상관없이 보임)는 `class="dock dock--static"` + `inert`.
- **새 플레이어 변형(onboarding):** 우편 버튼의 `badge`(새 우편 3통)를 지운다 — 3통은 콩떡대장의 값이다. `<a class="dock__btn" href="inbox.html"><svg …></svg><span>우편</span></a>`. HUD를 새 플레이어 변형으로 바꿨으면 도크도 같이 바꾼다.
- 가운데 로비만 버터 72px로 솟는다. profile·onboarding·404에서는 `aria-current`를 지운다.

### 1-3. 바닥글 — index 경로 / pages 경로

```html
<footer class="site-foot">
  <div class="site-foot__wrap">
    <div class="site-foot__board">
      <div class="site-foot__brand">
        <a class="hud__mark" href="index.html" aria-label="반죽섬 파티 로비">BANJUK<span>!</span></a>
        <p>4인 파티 게임 「반죽섬 파티」 · 모바일 · PC 크로스플레이</p>
        <div class="site-foot__cast" aria-hidden="true"><span class="dough dough--toma" style="--size:34px" aria-hidden="true"><span class="dough__face"><i class="dough__eye"></i><i class="dough__eye"></i><i class="dough__mouth"></i></span></span><span class="dough dough--mint dough--happy" style="--size:40px" aria-hidden="true"><span class="dough__face"><i class="dough__eye"></i><i class="dough__eye"></i><i class="dough__mouth"></i></span></span><span class="dough dough--butter" style="--size:30px" aria-hidden="true"><span class="dough__face"><i class="dough__eye"></i><i class="dough__eye"></i><i class="dough__mouth"></i></span></span><span class="dough dough--blue" style="--size:36px" aria-hidden="true"><span class="dough__face"><i class="dough__eye"></i><i class="dough__eye"></i><i class="dough__mouth"></i></span></span></div>
      </div>
      <nav class="site-foot__map" aria-label="섬 지도">
        <div class="site-foot__col"><h3>놀이</h3><a href="index.html" aria-current="page">로비</a><a href="pages/onboarding.html">첫걸음 섬</a><a href="pages/product.html">상점 섬</a><a href="pages/pricing.html">패스 섬</a><a href="pages/inbox.html">우편함 섬</a><a href="pages/profile.html">내 방</a><a href="pages/settings.html">설정 공방</a></div>
        <div class="site-foot__col"><h3>스튜디오</h3><a href="pages/dashboard.html">관제탑</a><a href="pages/kanban.html">공작소</a><a href="pages/404.html">미아 놀이터</a></div>
      </nav>
      <div class="site-foot__info">
        <p><b>고객센터</b>평일 10:00–19:00 (점심 12:30–13:30)<br>주말·공휴일은 문의 접수만 받아요.<br>게임 내 우편함 › 1:1 문의</p>
        <p><b>주물럭 스튜디오 주식회사</b>서울특별시 성동구 성수이로 118, 4층</p>
      </div>
      <p class="site-foot__legal"><span>© 2026 주물럭 스튜디오 · 반죽섬 파티 · 전체이용가</span><span>정기 점검 매주 목요일 06:00–08:00</span></p>
    </div>
  </div>
</footer>
```

```html
<footer class="site-foot">
  <div class="site-foot__wrap">
    <div class="site-foot__board">
      <div class="site-foot__brand">
        <a class="hud__mark" href="../index.html" aria-label="반죽섬 파티 로비">BANJUK<span>!</span></a>
        <p>4인 파티 게임 「반죽섬 파티」 · 모바일 · PC 크로스플레이</p>
        <div class="site-foot__cast" aria-hidden="true"><span class="dough dough--toma" style="--size:34px" aria-hidden="true"><span class="dough__face"><i class="dough__eye"></i><i class="dough__eye"></i><i class="dough__mouth"></i></span></span><span class="dough dough--mint dough--happy" style="--size:40px" aria-hidden="true"><span class="dough__face"><i class="dough__eye"></i><i class="dough__eye"></i><i class="dough__mouth"></i></span></span><span class="dough dough--butter" style="--size:30px" aria-hidden="true"><span class="dough__face"><i class="dough__eye"></i><i class="dough__eye"></i><i class="dough__mouth"></i></span></span><span class="dough dough--blue" style="--size:36px" aria-hidden="true"><span class="dough__face"><i class="dough__eye"></i><i class="dough__eye"></i><i class="dough__mouth"></i></span></span></div>
      </div>
      <nav class="site-foot__map" aria-label="섬 지도">
        <div class="site-foot__col"><h3>놀이</h3><a href="../index.html">로비</a><a href="onboarding.html">첫걸음 섬</a><a href="product.html" aria-current="page">상점 섬</a><a href="pricing.html">패스 섬</a><a href="inbox.html">우편함 섬</a><a href="profile.html">내 방</a><a href="settings.html">설정 공방</a></div>
        <div class="site-foot__col"><h3>스튜디오</h3><a href="dashboard.html">관제탑</a><a href="kanban.html">공작소</a><a href="404.html">미아 놀이터</a></div>
      </nav>
      <div class="site-foot__info">
        <p><b>고객센터</b>평일 10:00–19:00 (점심 12:30–13:30)<br>주말·공휴일은 문의 접수만 받아요.<br>게임 내 우편함 › 1:1 문의</p>
        <p><b>주물럭 스튜디오 주식회사</b>서울특별시 성동구 성수이로 118, 4층</p>
      </div>
      <p class="site-foot__legal"><span>© 2026 주물럭 스튜디오 · 반죽섬 파티 · 전체이용가</span><span>정기 점검 매주 목요일 06:00–08:00</span></p>
    </div>
  </div>
</footer>
```

- `</main>` 바로 뒤에 둔다. 마지막 방은 `.room--last`(바닥글과 겹침 여유).
- 섬 지도 링크의 `aria-current`만 현재 화면으로 옮긴다.

### 1-4. 운영 HUD (dashboard · kanban, pages 경로)

```html
<a class="skip" href="#main">본문으로 건너뛰기</a>
<header class="hud hud--ops">
  <div class="hud__bar">
    <div class="hud__left">
      <a class="hud__player" href="dashboard.html" aria-label="한소율, 라이브옵스 PD">
        <span class="ring ring--tomato" style="--val:1"><span class="dough dough--toma dough--avatar" aria-hidden="true"><span class="dough__face"><i class="dough__eye"></i><i class="dough__eye"></i><i class="dough__mouth"></i></span></span></span>
        <span class="hud__who"><span class="hud__name">한소율</span><span class="hud__lv t-jua">라이브옵스</span></span>
      </a>
    </div>
    <a class="hud__mark" href="../index.html" aria-label="반죽섬 파티 로비">BANJUK<span>!</span></a>
    <div class="hud__right">
      <span class="hud__coin hud__live" aria-label="현재 동시접속 41,860명"><i class="hud__pulse"></i><span>동접</span><b>41,860</b></span>
      <div class="hud__tools">
        <button class="btn btn--icon btn--sm" type="button" data-command-open aria-label="빠른 찾기 (⌘K)"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg></button>
        <button class="btn btn--icon btn--sm" type="button" data-theme-toggle aria-pressed="false" aria-label="밤 장면"><svg class="icon theme-ico--sun" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M2.5 12h2M19.5 12h2M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"/></svg><svg class="icon theme-ico--moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/></svg></button>
      </div>
    </div>
  </div>
</header>
```
- ≤600px: 동접 알약(`.hud__live`)은 숨기고 플레이어 HUD와 같은 압축형(얼굴 + 워드마크 + 아이콘 2개)이 된다. 워드마크는 `white-space: nowrap`이라 360px에서도 한 줄이다. 동접 숫자는 관제탑 본문에 크게 있다.

### 1-5. 운영 레이아웃 + 사이드바 (dashboard · kanban)

```html
<div class="ops-layout wrap">
<aside class="ops-side" aria-label="스튜디오 메뉴">
  <div class="ops-side__who"><span class="dough dough--toma dough--avatar dough--lg" aria-hidden="true"><span class="dough__face"><i class="dough__eye"></i><i class="dough__eye"></i><i class="dough__mouth"></i></span></span><div><p class="ops-side__name">한소율</p><p class="ops-side__role">라이브옵스 PD · 주물럭 스튜디오</p></div></div>
  <nav class="ops-side__group" aria-label="운영 화면">
    <p class="ops-side__label">운영</p>
    <a class="ops-side__link" href="dashboard.html" aria-current="page"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20h16"/><path d="M7 20v-8M12 20V5M17 20v-5"/></svg>관제탑</a>
    <a class="ops-side__link" href="kanban.html"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="4.5" width="17" height="15" rx="3.5"/><path d="M9.5 4.5v15M14.5 4.5v15"/></svg>공작소<span class="badge badge--count ops-side__count">12</span></a>
  </nav>
  <nav class="ops-side__group" aria-label="플레이어 화면">
    <p class="ops-side__label">플레이어 화면 확인</p>
    <a class="ops-side__link" href="../index.html"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M3.5 11L12 4l8.5 7"/><path d="M5.5 9.5V20h13V9.5"/><path d="M10 20v-5h4v5"/></svg>로비</a>
    <a class="ops-side__link" href="product.html"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 8h14l-1.2 12H6.2L5 8z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/></svg>상점</a>
    <a class="ops-side__link" href="pricing.html"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16v4a2 2 0 0 0 0 4v4H4v-4a2 2 0 0 0 0-4z"/><path d="M14 7v2M14 11.5v1M14 15v2"/></svg>패스</a>
    <a class="ops-side__link" href="inbox.html"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="3.5"/><path d="M4.5 7.5l7.5 5.5 7.5-5.5"/></svg>우편함</a>
  </nav>
  <p class="ops-side__foot"><b>시즌 7 「가을 반죽 축제」</b>17일차 · 종료까지 D-39<br>다음 점검 10/15(목) 06:00</p>
</aside>
  <main class="ops-main" id="main">
    … 운영 장면 (트레이·벤토) …
  </main>
</div>
```

- kanban에서는 `관제탑`의 `aria-current`를 `공작소`로 옮긴다. 공작소 카운트 12는 팩트 시트의 시즌 8 카드 수.
- ≤900px: 사이드바가 HUD 아래 가로 알약 줄로 접힌다(누가·라벨·바닥 정보 숨김, 끝 페이드).
- 운영 화면은 `.room` 대신 `.ops-layout` 안에서 `.tray` 벤토를 쓴다. 바닥은 body의 `--floor-sky`.

### 1-6. 커맨드 팔레트 — index 경로 / pages 경로 (body 끝, 화면마다 1개)

```html
<div class="cmdk" id="cmdk" role="dialog" aria-modal="true" aria-label="빠른 찾기" hidden>
  <div class="cmdk__box">
    <label class="cmdk__search"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg><span class="sr-only">찾을 것</span>
      <input class="cmdk__input" type="text" placeholder="섬 · 아이템 · 우편 찾기" role="combobox" aria-expanded="true" aria-controls="cmdk-list" aria-autocomplete="list" autocomplete="off" data-autofocus>
      <span class="kbd">Esc</span></label>
    <div class="cmdk__list" id="cmdk-list" role="listbox" aria-label="찾은 것">
      <div class="cmdk__section" role="group" aria-label="섬으로 가기">
        <p class="cmdk__group" aria-hidden="true">섬으로 가기</p>
        <a class="cmdk__opt" role="option" href="index.html" data-keywords="lobby 로비 홈"><span class="cmdk__ico"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M3.5 11L12 4l8.5 7"/><path d="M5.5 9.5V20h13V9.5"/><path d="M10 20v-5h4v5"/></svg></span><span class="cmdk__label">로비</span><span class="cmdk__hint">놀이 시작</span></a>
        <a class="cmdk__opt" role="option" href="pages/product.html" data-keywords="shop 상점 스킨"><span class="cmdk__ico cmdk__ico--tomato"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 8h14l-1.2 12H6.2L5 8z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/></svg></span><span class="cmdk__label">상점 섬 · 군고구마 토마</span><span class="cmdk__hint">590젤리</span></a>
        <a class="cmdk__opt" role="option" href="pages/pricing.html" data-keywords="pass 패스 시즌"><span class="cmdk__ico cmdk__ico--pink"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16v4a2 2 0 0 0 0 4v4H4v-4a2 2 0 0 0 0-4z"/><path d="M14 7v2M14 11.5v1M14 15v2"/></svg></span><span class="cmdk__label">패스 섬 · 말랑 패스</span><span class="cmdk__hint">티어 34 / 80</span></a>
        <a class="cmdk__opt" role="option" href="pages/inbox.html" data-keywords="mail 우편 보상"><span class="cmdk__ico cmdk__ico--blue"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="3.5"/><path d="M4.5 7.5l7.5 5.5 7.5-5.5"/></svg></span><span class="cmdk__label">우편함</span><span class="cmdk__hint">새 우편 3</span></a>
        <a class="cmdk__opt" role="option" href="pages/profile.html" data-keywords="profile 내방 트로피"><span class="cmdk__ico cmdk__ico--mint"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8.5" r="4"/><path d="M4.5 20a7.5 7.5 0 0 1 15 0"/></svg></span><span class="cmdk__label">내 방</span><span class="cmdk__hint">트로피 1,284</span></a>
        <a class="cmdk__opt" role="option" href="pages/settings.html" data-keywords="settings 설정 사운드 자녀"><span class="cmdk__ico"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h9M19 6h1M4 12h3M11 12h9M4 18h11M19 18h1"/><circle cx="16" cy="6" r="2.2"/><circle cx="9" cy="12" r="2.2"/><circle cx="17" cy="18" r="2.2"/></svg></span><span class="cmdk__label">설정 공방</span><span class="cmdk__hint">사운드 · 자녀 보호</span></a>
      </div>
      <div class="cmdk__section" role="group" aria-label="스튜디오">
        <p class="cmdk__group" aria-hidden="true">스튜디오</p>
        <a class="cmdk__opt" role="option" href="pages/dashboard.html" data-keywords="dashboard 관제 동접"><span class="cmdk__ico cmdk__ico--blue"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20h16"/><path d="M7 20v-8M12 20V5M17 20v-5"/></svg></span><span class="cmdk__label">관제탑</span><span class="cmdk__hint">동접 41,860</span></a>
        <a class="cmdk__opt" role="option" href="pages/kanban.html" data-keywords="kanban 공작소 시즌8"><span class="cmdk__ico cmdk__ico--mint"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="4.5" width="17" height="15" rx="3.5"/><path d="M9.5 4.5v15M14.5 4.5v15"/></svg></span><span class="cmdk__label">공작소 · 시즌 8 보드</span><span class="cmdk__hint">카드 12장</span></a>
      </div>
    </div>
    <div class="cmdk__empty" hidden><span class="dough dough--toma dough--surprised" style="--size:64px" aria-hidden="true"><span class="dough__face"><i class="dough__eye"></i><i class="dough__eye"></i><i class="dough__mouth"></i></span></span><strong>「<span data-cmdk-query></span>」은 섬 지도에 없어요</strong><span>섬 이름이나 아이템 이름으로 찾아 보세요.</span></div>
    <div class="cmdk__foot"><span><span class="kbd">↑</span><span class="kbd">↓</span> 고르기</span><span><span class="kbd">Enter</span> 가기</span><span><span class="kbd">Esc</span> 닫기</span></div>
  </div>
</div>
```

pages 경로는 링크만 다르다:

```html
<div class="cmdk" id="cmdk" role="dialog" aria-modal="true" aria-label="빠른 찾기" hidden>
  <div class="cmdk__box">
    <label class="cmdk__search"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg><span class="sr-only">찾을 것</span>
      <input class="cmdk__input" type="text" placeholder="섬 · 아이템 · 우편 찾기" role="combobox" aria-expanded="true" aria-controls="cmdk-list" aria-autocomplete="list" autocomplete="off" data-autofocus>
      <span class="kbd">Esc</span></label>
    <div class="cmdk__list" id="cmdk-list" role="listbox" aria-label="찾은 것">
      <div class="cmdk__section" role="group" aria-label="섬으로 가기">
        <p class="cmdk__group" aria-hidden="true">섬으로 가기</p>
        <a class="cmdk__opt" role="option" href="../index.html" data-keywords="lobby 로비 홈"><span class="cmdk__ico"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M3.5 11L12 4l8.5 7"/><path d="M5.5 9.5V20h13V9.5"/><path d="M10 20v-5h4v5"/></svg></span><span class="cmdk__label">로비</span><span class="cmdk__hint">놀이 시작</span></a>
        <a class="cmdk__opt" role="option" href="product.html" data-keywords="shop 상점 스킨"><span class="cmdk__ico cmdk__ico--tomato"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 8h14l-1.2 12H6.2L5 8z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/></svg></span><span class="cmdk__label">상점 섬 · 군고구마 토마</span><span class="cmdk__hint">590젤리</span></a>
        <a class="cmdk__opt" role="option" href="pricing.html" data-keywords="pass 패스 시즌"><span class="cmdk__ico cmdk__ico--pink"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16v4a2 2 0 0 0 0 4v4H4v-4a2 2 0 0 0 0-4z"/><path d="M14 7v2M14 11.5v1M14 15v2"/></svg></span><span class="cmdk__label">패스 섬 · 말랑 패스</span><span class="cmdk__hint">티어 34 / 80</span></a>
        <a class="cmdk__opt" role="option" href="inbox.html" data-keywords="mail 우편 보상"><span class="cmdk__ico cmdk__ico--blue"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="3.5"/><path d="M4.5 7.5l7.5 5.5 7.5-5.5"/></svg></span><span class="cmdk__label">우편함</span><span class="cmdk__hint">새 우편 3</span></a>
        <a class="cmdk__opt" role="option" href="profile.html" data-keywords="profile 내방 트로피"><span class="cmdk__ico cmdk__ico--mint"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8.5" r="4"/><path d="M4.5 20a7.5 7.5 0 0 1 15 0"/></svg></span><span class="cmdk__label">내 방</span><span class="cmdk__hint">트로피 1,284</span></a>
        <a class="cmdk__opt" role="option" href="settings.html" data-keywords="settings 설정 사운드 자녀"><span class="cmdk__ico"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h9M19 6h1M4 12h3M11 12h9M4 18h11M19 18h1"/><circle cx="16" cy="6" r="2.2"/><circle cx="9" cy="12" r="2.2"/><circle cx="17" cy="18" r="2.2"/></svg></span><span class="cmdk__label">설정 공방</span><span class="cmdk__hint">사운드 · 자녀 보호</span></a>
      </div>
      <div class="cmdk__section" role="group" aria-label="스튜디오">
        <p class="cmdk__group" aria-hidden="true">스튜디오</p>
        <a class="cmdk__opt" role="option" href="dashboard.html" data-keywords="dashboard 관제 동접"><span class="cmdk__ico cmdk__ico--blue"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20h16"/><path d="M7 20v-8M12 20V5M17 20v-5"/></svg></span><span class="cmdk__label">관제탑</span><span class="cmdk__hint">동접 41,860</span></a>
        <a class="cmdk__opt" role="option" href="kanban.html" data-keywords="kanban 공작소 시즌8"><span class="cmdk__ico cmdk__ico--mint"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="4.5" width="17" height="15" rx="3.5"/><path d="M9.5 4.5v15M14.5 4.5v15"/></svg></span><span class="cmdk__label">공작소 · 시즌 8 보드</span><span class="cmdk__hint">카드 12장</span></a>
      </div>
    </div>
    <div class="cmdk__empty" hidden><span class="dough dough--toma dough--surprised" style="--size:64px" aria-hidden="true"><span class="dough__face"><i class="dough__eye"></i><i class="dough__eye"></i><i class="dough__mouth"></i></span></span><strong>「<span data-cmdk-query></span>」은 섬 지도에 없어요</strong><span>섬 이름이나 아이템 이름으로 찾아 보세요.</span></div>
    <div class="cmdk__foot"><span><span class="kbd">↑</span><span class="kbd">↓</span> 고르기</span><span><span class="kbd">Enter</span> 가기</span><span><span class="kbd">Esc</span> 닫기</span></div>
  </div>
</div>
```

- `⌘K`/`Ctrl+K`, HUD 돋보기(`[data-command-open]`)로 열린다. 입력하면 텍스트 + `data-keywords`로 걸러지고 `↑↓ Enter`로 이동한다. 결과가 없으면 `.cmdk__empty`(놀란 토마)가 나오고 `[data-cmdk-query]`에 입력값이 들어간다.
- 결과 묶음은 `.cmdk__section`으로 감싼다(묶음 안 결과가 다 걸러지면 묶음 제목도 숨는다).

---

## 2. 장면 CSS에서 쓸 semantic 토큰

| 무리 | 토큰 |
|---|---|
| 바닥(방) | `--floor-sky` `--floor-mint` `--floor-butter` `--floor-peach` |
| 표면 | `--clay`(흰 반죽 · 밤엔 남색 반죽) `--clay-deep`(받침) `--surface-2`(2단 면·줄무늬) `--well`(홈) |
| 글자 | `--ink` `--ink-muted` (`--ink-faint`는 그래픽 전용, 글자 금지) `--link` |
| 반죽색 | `--tomato` `--mint` `--butter` `--blue` `--pink` + 각 `-deep`(받침) · 흰 반죽 위 글자 `--tomato-text` `--mint-text` `--butter-text` · 그래픽 전용 `--blue-bright` |
| 반죽 면 위 글자(모드 무관 고정) | `--on-butter` `--on-tomato` `--on-mint` `--on-pink` `--on-blue` |
| 밤색 트레이 | `--tray-night` `--tray-night-deep` `--tray-night-line` `--tray-night-text` `--tray-night-muted` |
| 상점 스킨(그래픽) | `--skin-sweet-potato(-deep)` `--skin-pumpkin(-deep)` `--skin-chestnut(-deep)` `--skin-choco(-deep)` |
| 그림자 재료 | `--slab`(요소별 자동 계산) `--well-shadow` `--focus` `--hi` `--lo` `--drop` `--ground` `--scrim` `--glow-lantern`(낮엔 빈 그림자 `0 0 0 transparent` — 그림자 목록에 합성해도 안전) `--text-slab` `--tip-bg`/`--tip-rim`(툴팁) `--code-rim`(밤 코드 트레이 윤곽) |
| 슬랩 두께 | `--slab-sm` 4 · `--slab-md` 6 · `--slab-lg` 8 · `--slab-xl` 12 |
| 차트 계열 | `--series-1`…`--series-6` (블루 → 토마 → 민트 → 버터 → 딸기 → 잉크) |
| 서체 | `--font-display`(Fredoka+Jua) `--font-hangul-bold`(Jua) `--font-label`(Nunito 800) `--font-body`(Nunito+고운돋움) `--font-mono` |
| 크기 | `--fs-lobby` 112/56 · `--fs-count` 80/48 · `--fs-h1` 60/38 · `--fs-h2` 42/30 · `--fs-h3` 28/23 · `--fs-h4` 21/19 · `--fs-body-lg` · `--fs-body` · `--fs-small` · `--fs-micro`(라틴 전용) |
| 여백 | `--sp-1` 4 · `--sp-2` 8 · `--sp-3` 12 · `--sp-4` 16 · `--sp-5` 24 · `--sp-6` 32 · `--sp-7` 48 · `--sp-8` 72 · `--sp-9` 112 |
| 반경 | `--r-pill` `--r-ctrl` 20 `--r-menu` 24 `--r-card` 32 `--r-modal` 40 `--r-tray`/`--r-room` 48 · 블롭 `--blob-toma` `--blob-mint` `--blob-butter` `--blob-blue` |
| 모션 | `--ease-squish` `--ease-boing` `--ease-out` · `--dur-press` 90 `--dur-release` 420 `--dur-hover` 260 `--dur-overlay` 240 `--dur-close` 160 `--dur-jelly` 600 `--dur-bob` 3.2s · keyframes `jelly` `bob` `wiggle` `land` `inflate` `drop-bounce` `knead` `squash-loop` |

### 시그니처 ① 슬랩을 장면 CSS에서 만드는 법
```css
.my-object {
  background: var(--butter);
  --slab-h: var(--slab-lg);          /* 두께 */
  --slab-color: var(--butter-deep);  /* 받침 = 같은 색의 deep */
  box-shadow: var(--slab);           /* 하이라이트·그늘·받침·바닥 그림자 5겹 자동 */
}
.my-object:focus-visible { outline: none; box-shadow: var(--slab), var(--focus); }  /* 링은 항상 합성 */
```
- 누를 수 있는 것은 슬랩, 받는 것(인풋·트랙·빈 칸)은 홈: `background: var(--well); box-shadow: var(--well-shadow);`
- 누름 모션은 `translate`/`scale` **개별 속성**으로(버튼이 그렇게 한다). `transform`은 `bob`·기울기 몫이라 겹치면 덮어쓴다.
- 반죽 면 위 글자는 위 표의 `--on-*` 고정색만. 흰 글자는 `--blue` 면에서만.
- 그림자용 커스텀 속성에 `none`을 넣지 않는다. `box-shadow: var(--slab), var(--x)`에서 `--x: none`이면 목록 전체가 무효가 되어 슬랩까지 사라진다(빈 그림자 `0 0 0 transparent`를 쓸 것).

---

## 3. 레이아웃 문법 (base.css)

### `.room` — 풀블리드 컬러 바닥 띠(방). 이전 방 위로 48px 겹쳐 올라온다
```html
<main id="main">
  <section class="room room--sky room--stage room--first" aria-labelledby="…">
    <div class="wrap"> … </div>
  </section>
  <section class="room room--mint" aria-labelledby="…"> <div class="wrap">…</div> </section>
  <section class="room room--butter room--tray room--last" …> … </section>
</main>
```
- 바닥색 `--sky --mint --butter --peach`를 돌려 쓰고 **같은 색을 연달아 두지 않는다**.
- 구도 리듬: `room--stage`(상하 112) · 기본(72, 선반·더미) · `room--tray`(48). 이웃한 방은 다른 구도.
- 첫 방은 `room--first`(위 모서리 안 둥글림), 마지막 방은 `room--last`.
- 방 하나만 밤 장면으로: 방에 `data-theme="dark"`를 직접 주거나 `<button class="btn" data-theme-scope="#room-id" aria-label="이 방만 밤으로 바꾸기"><svg class="icon" data-scope-ico="moon" …></svg><svg class="icon" data-scope-ico="sun" … hidden></svg>이 방만 <span data-scope-label>밤으로</span></button>`(app.js가 토글). 라벨·아이콘·aria-label은 현재 상태가 아니라 **누르면 바뀔 상태**(낮인 방 → 달 + "밤으로", 밤인 방 → 해 + "낮으로")를 말한다. aria-pressed는 쓰지 않는다.

### `.wrap` — 최대 1320 + 좌우 여백 40(모바일 16)

### `.g12` — 12단 그리드(거터 24)
```html
<div class="g12"> <div class="span-7">…</div> <div class="span-5">…</div> </div>
```
- 스팬: `span-2 3 4 5 6 7 8 9 12`. ≤1024: 2→4, 3·4·5→6, 6 이상→12. ≤600: 전부 12(`.keep-half`를 붙인 2–6 스팬은 반폭 유지).
- `.g12--stretch`(칸 높이 맞춤 — 벽보형 빈칸 방지) `.g12--end`(아래 정렬).

### 이름표 — 방 왼쪽 위에 꽂힌 반죽 알약 (가운데정렬 "라벨+제목+부제" 금지)
```html
<div class="nametag-row">
  <h2 class="nametag" id="room-shop"><span class="nametag__pin"></span>반죽통</h2>
  <p class="nametag-note">설명은 한 줄까지, 없어도 된다</p>
</div>
```
`.nametag--sm`(트레이 안 작은 이름표).

**이름표 공식 반복 금지.** 이름표 줄(`.nametag-row`)은 한 페이지 방의 절반 정도만 쓴다. 나머지 방은 아래 꼴 중 하나로 제목을 단다. 설명 줄은 대부분 지우고, 남길 때는 물건이나 트레이 안에 넣는다.
```html
<!-- ① 물건에 꽂힌 이름표: 부모(position:relative) 윗모서리에 반쯤 걸친다 (예: 두께 실험실 벤치, 80티어 선반) -->
<div class="lab__bench"><h2 class="nametag nametag--stuck" id="…"><span class="nametag__pin"></span>두께 실험실</h2> …</div>
<!-- ② 깃발: 지도·섬처럼 꽂아 두는 장면 (예: 섬 지도, onboarding 다음 섬). flag--blue / flag--tomato, 깃대 높이 --flag-h -->
<div class="flag"><span class="flag__pole" aria-hidden="true"></span><h2 class="flag__cloth" id="…">섬 지도</h2></div>
<!-- ③ 큰 오브젝트가 곧 제목: 글자 블록 더미(index), 리뷰 점수 덩어리(product), 오늘 판 수 큰 숫자(profile) — 장면 CSS에서 만든다 -->
```

### 트레이 · 홈 · 선반 · 더미 · 무대
```html
<div class="tray"><div class="tray__head"><h3 class="tray__title">…</h3><span class="tray__meta">…</span></div> …</div>
<div class="tray tray--lg">…</div>      <!-- 반경 48 · 패딩 32 -->  <div class="tray tray--flush">…</div>
<div class="well">…</div>              <!-- 파인 홈 -->

<div class="shelf-wrap"><div class="shelf" style="--shelf-w:1100px"> <div>오브젝트</div> … </div></div>
<!-- 높이 다른 오브젝트가 12px 흰 반죽 판 한 줄 위에. ≤900px 가로 스크롤 선반(스냅 + 끝 페이드).
     --shelf-w는 모바일에서 판 길이(내용 폭 이상으로) -->

<div class="pile"> <div class="tilt-n4">…</div> <div class="tilt-2">…</div> </div>
<!-- 겹쳐 쌓인 견본. 회전은 tilt-n4 · tilt-n2 · tilt-2 · tilt-3 네 개만. 읽는 글(문단·표·폼)은 기울이지 않는다 -->

<div class="disc"></div>   <!-- 무대 원판(버터, 받침 12). --d:520px · 변형 disc--mint/clay/pink/blue/tomato/choco(초코섬) -->
<div class="grounded">…</div>   <!-- 떠 있는 오브젝트 바로 아래 타원 접지 그림자 -->
```

### 스택 · 줄
`.stack`(세로 16) `.stack--sm`(8) `.stack--lg`(32) · `.cluster`(가로 줄바꿈 12) `.cluster--lg`(24) · `.btn-row`(버튼 줄, 받침 여유 포함) · `.scroll-x`(가로 스크롤 + 넘칠 때만 끝 페이드, app.js 자동).

### 타이포 유틸
| 클래스 | 쓰임 |
|---|---|
| `.t-lobby` | 로비 간판(Jua 112/56). **한 화면 1개** |
| `.t-count` | 큰 숫자(Fredoka 700 wdth 112, tabular) |
| `.dough-text` · `.dough-text--butter` | 반죽 글자 효과. `.t-lobby`·`.t-count`에만 |
| `.t-h1` `.t-h2` `.t-h3` `.t-h4` | 페이지·패널 제목(Fredoka+Jua) |
| `.t-jua` | 굵어야 하는 한글(고운돋움은 단일 굵기, 가짜 굵게 금지) |
| `.t-lead` `.t-small` `.t-muted` `.t-num` `.t-mono` `.t-latin` | 리드·보조·흐림·숫자·모노·라틴 |

ID(`PO-1010-07`, `CS-26-10-0137`, `PAY-…`, `MT-…`, `LO-…`)는 문장·제목 안에서도 `<span class="t-mono">…</span>`로 감싼다. `.t-mono`는 `white-space: nowrap`이라 본문의 `overflow-wrap: anywhere`에 ID가 중간에서 잘리지 않는다.

터치 타깃: ≤600px에서 `.btn--sm`·`.crumbs__stone`·`.tbl__sort`·`.code__copy`·바닥글 링크는 44px. 링크로 쓰는 배지(`a.badge`)는 보이는 알약은 26px 그대로, 누르는 영역만 `::after`로 넓힌다.
| `.t-micro` | **라틴·숫자 전용** 0.08em 대문자 라벨. 한글이 섞이면 쓰지 말고 `.t-jua` |

### 착지 등장 · 카운트업
- `<div data-land>` 의 **직계 자식**이 화면에 들어올 때 위에서 떨어져 젤리 착지(60ms 간격, 8개까지). 큰 방 전체에 걸지 말고 오브젝트 묶음에만.
- `<span class="t-count" data-countup="41860">41,860</span>` — 보일 때 0에서 700ms 카운트업(마크업엔 최종값을 적어 둔다).
- 상시 움직임(`bob`·마퀴)은 **한 뷰포트에 2개까지**.

---

## 4. 시그니처 ② 반죽이 (`.dough`)

```html
<span class="dough dough--mint dough--happy" style="--size:120px" aria-hidden="true"><span class="dough__face"><i class="dough__eye"></i><i class="dough__eye"></i><i class="dough__mouth"></i></span></span>
```
- 종류: `dough--toma` `--mint` `--butter` `--blue` `--pink` `--choco`(초코 반죽 — 남궁태오·초코섬 전용. ink 색은 밤에 흰색으로 뒤집혀 반죽이 사라지므로 반죽에는 쓰지 않는다) · 상점 스킨 `--potato`(군고구마) `--pumpkin`(호박) `--chestnut`(군밤).
- 표정: 기본 · `dough--happy`(∩) · `dough--surprised`(O o) · `dough--dizzy`(× 오류) · `dough--sleep`(— 빈 상태·로딩).
- 크기: `style="--size:120px"`(기본 96). 둥실: `dough--bob`(뷰포트당 2개 규칙 안에서). 시선: `data-gaze`(데스크톱에서 포인터 쪽 3px).
- 눈 깜빡임(4–7초)은 app.js가 모든 `.dough`에 자동. reduced-motion이면 꺼진다.
- **아바타**(프로필 사진 없는 사람): `.dough--avatar` + `--sm`(32) 기본(40) `--lg`(64)
```html
<span class="dough dough--pink dough--avatar" aria-hidden="true"><span class="dough__face"><i class="dough__eye"></i><i class="dough__eye"></i><i class="dough__mouth"></i></span></span>
```
  인물별 반죽색(팩트 시트): 한소율 toma · 백지환 blue · 오세린 pink · 정우빈 mint · 남궁태오 choco · 문가람 butter · 이채원 mint · 콩떡대장 mint(웃음).
  친구 12명(팩트 시트): 토마토주스 toma · 말랑한하루 mint · 버터굽는곰 butter · 블루베리잼잼 blue · 쿠션왕 butter · 젤리도둑 toma · 둥글레차 mint · 떡볶이공주 toma · 반죽장인88 pink · 감자밭주인 butter · 솜사탕기사 pink · 모찌모찌 mint. choco는 플레이어 아바타에 쓰지 않는다.
- 쓰는 자리는 DIRECTION 6절 목록만(로비 무대·빈 상태·토스트·스피너·404·온보딩 안내자·아바타). 운영 화면 데이터 영역에는 넣지 않는다.
- 재화 아이콘: `<i class="jelly-ico"></i>`(딸기색 젤리) `<i class="coin-ico"></i>`(버터 코인).

---

## 5. 컴포넌트 32 (알파벳순)

> 모든 누를 수 있는 컴포넌트는 같은 촉감: **hover** 2px 떠오르며 받침 +2 · **active** 꾹(받침 2px, 스쿼시 90ms) → 뗄 때 통(420ms 바운스) · **focus-visible** 흰 3px + 링 3px 합성 · **disabled** 받침 없는 납작한 홈 · **loading** `aria-busy="true"` · **error** `aria-invalid="true"` 또는 `data-state="error"` · **selected** `aria-pressed/selected/current`.

### accordion — 알약 줄, 열리면 눌린 채 + 내용은 홈
```html
<div class="acc" data-single>
  <div class="acc__item">
    <h3 class="acc__h"><button class="acc__trigger" type="button" aria-expanded="true" aria-controls="faq-1">말랑 패스를 사면 젤리를 돌려받나요?<span class="acc__knob" aria-hidden="true"></span></button></h3>
    <div class="acc__panel" id="faq-1" role="region"><p>…</p></div>
  </div>
  <div class="acc__item">
    <h3 class="acc__h"><button class="acc__trigger" type="button" aria-expanded="false" aria-controls="faq-2">…<span class="acc__knob" aria-hidden="true"></span></button></h3>
    <div class="acc__panel" id="faq-2" role="region" hidden><p>…</p></div>
  </div>
</div>
```
`data-single`이면 하나만 열린다. 비활성: 트리거 `disabled`.

### alert — 반죽색 면 + 해당 반죽이 얼굴
```html
<div class="alert alert--tomato" role="alert">
  <span class="alert__face"><!-- dough--toma dough--dizzy dough--avatar --></span>
  <div class="alert__body"><p class="alert__title">결제 젤리가 아직 안 들어왔어요</p><p class="alert__text">PAY-261009-57204 · ₩5,900 · 젤리 660</p>
    <div class="alert__actions"><button class="btn btn--sm" type="button">1:1 문의</button></div></div>
  <button class="alert__close" type="button" aria-label="알림 닫기"><!-- x 아이콘 --></button>
</div>
```
톤과 얼굴 짝: `--tomato`+토마 dizzy(오류) · `--butter`+버터 happy(보상·주의) · `--mint`+민트콩 happy(완료) · `--blue`+블루베 기본(안내). 한 줄형 `.alert--inline`. 닫기는 app.js가 처리(사라짐 모션 후 `hidden`). 정보성은 `role="status"`, 오류만 `role="alert"`.

### badge — 작은 알약 슬랩
```html
<span class="badge">원활</span>
<span class="badge badge--tomato"><span class="badge__bean badge__bean--butter"></span>혼잡</span>
<span class="badge badge--latin badge--butter">Season 7</span>
<span class="badge badge--flat">읽음</span>
<span class="badge badge--count badge--tomato">4</span>
```
종류 `--butter --mint --tomato --blue --pink --flat` · `--lg` · `--latin`(라틴 전용) · `--count`(숫자 방울) · `--float`(아이콘 버튼 모서리, 부모에 `position:relative` — `.btn`·`.dock__btn`은 이미 relative) · `--pop`(들어올 때 젤리). 상태 매핑(팩트 시트): 섬 혼잡=tomato, 원활=기본, 점검 예정=flat+bean · 우편 미수령=butter, 안 읽음=blue, 읽음=flat, 수령 완료=mint.

### breadcrumb — 징검다리 조약돌
```html
<nav class="crumbs" aria-label="현재 위치"><ol class="crumbs__list">
  <li class="crumbs__item"><a class="crumbs__stone" href="../index.html">로비</a></li>
  <li class="crumbs__item"><a class="crumbs__stone" href="product.html">상점 섬</a></li>
  <li class="crumbs__item"><span class="crumbs__stone" aria-current="page">군고구마 토마</span></li>
</ol></nav>
```

### button
```html
<button class="btn btn--primary btn--lg" type="button">구매하기 590젤리</button>
<button class="btn btn--blue" type="button">친구 초대</button>
<button class="btn" type="button">나중에</button>
<button class="btn btn--danger" type="button">계정 삭제</button>
<button class="btn btn--mint btn--sm" type="button"><svg class="icon">…</svg>준비 완료</button>
<button class="btn btn--ghost" type="button">규칙 보기</button>
<button class="btn btn--icon" type="button" aria-label="더 보기"><svg class="icon">…</svg></button>
<button class="btn btn--xl btn--primary btn--bob btn--lantern" type="button"><svg class="icon">…</svg>놀이 시작</button>
```
- 종류: `--primary`(버터 = 시작·구매·확인, **주 행동만**) `--blue`(보조) 기본(흰 반죽) `--danger`(토마) `--mint` `--pink` `--ghost`(링크).
- 크기: `--sm` 40 · 기본 48 · `--lg` 64 · `--xl` 88(Jua, 화면당 1개) · `--icon` 원형 48(`--icon btn--sm` 44) · `--block` 전폭.
- 주 CTA 1개만: `--bob`(둥실) + `--lantern`(밤에 랜턴 빛).
- 상태: `disabled`/`aria-disabled="true"`(납작) · `aria-busy="true"`(꼬마 반죽 스쿼시 — 데모는 `data-demo-busy`) · `aria-pressed="true"`(눌린 채, `.btn--toggle`은 버터로 물듦) · `data-state="error"`(토마 받침 + 도리도리; 폼 제출 실패 시 app.js가 자동).
- 숫자 알약: `<span class="btn__count">3</span>`.

### calendar — 2026년 10월(10/1 목 시작)
```html
<div class="cal" data-calendar>
  <div class="cal__head"><h3 class="cal__title">2026<span>년</span> 10<span>월</span></h3>
    <div class="cal__nav"><button class="btn btn--icon btn--sm" type="button" aria-label="9월">…</button><button class="btn btn--icon btn--sm" type="button" aria-label="11월">…</button></div></div>
  <div class="cal__grid" role="grid" aria-label="2026년 10월">
    <div class="cal__row" role="row"><span class="cal__dow cal__dow--sun" role="columnheader">일</span>…<span class="cal__dow cal__dow--sat" role="columnheader">토</span></div>
    <div class="cal__row" role="row">
      <button class="cal__day cal__day--out" type="button" role="gridcell" aria-pressed="false" aria-label="9월 27일"><span class="cal__num">27</span></button> …
      <button class="cal__day cal__day--maint" type="button" role="gridcell" aria-pressed="false" aria-label="10월 1일" data-note="10월 1일 · 목요일 정기 점검 06:00–08:00"><span class="cal__num">1</span><span class="cal__evs" aria-hidden="true"><i class="cal__ev cal__ev--butter"></i></span></button> …
      <button class="cal__day" type="button" role="gridcell" aria-pressed="false" aria-current="date" aria-label="10월 10일 오늘" data-note="…"><span class="cal__num">10</span><span class="cal__label">오늘</span>…</button>
    </div> …
  </div>
  <div class="cal__legend"><span><i class="cal__ev cal__ev--butter"></i>시즌 7</span><span><i class="cal__ev cal__ev--tomato"></i>이벤트</span><span><i class="cal__legend-maint"></i>정기 점검</span></div>
  <p class="cal__out" data-cal-out aria-live="polite"></p>
</div>
```
- 트레이 안에 둔다. 일요일 칸은 `cal__day--sun`. 목요일(1·8·15·22·29)은 `cal__day--maint`. 오늘 10/10 `aria-current="date"`.
- 이벤트 떡 색: 시즌 7 butter · 할로윈 10/29–11/4 tomato · 점검 blue. 칸 라벨 `.cal__label`은 ≤600px에서 숨는다(떡만 남음).
- 고르면 `aria-pressed="true"` + `data-cal-out`에 `data-note`가 들어간다. 화살표 ←→↑↓로 이동.

### card
```html
<a class="card card--hero" href="product.html">
  <div class="card__thumb card__thumb--butter"><!-- dough--potato --><span class="badge badge--latin badge--tomato">New</span></div>
  <p class="card__kicker">SK-S7-014 · 스킨</p><h3 class="card__title">군고구마 토마</h3>
  <p class="card__text">…</p>
  <div class="card__foot"><span class="card__price"><i class="jelly-ico"></i>590<small>젤리</small></span><span class="badge badge--butter">평점 4.8</span></div>
</a>
<button class="card card--sm" type="button" aria-pressed="true">…</button>           <!-- 고른 카드 -->
<div class="card card--sm" aria-disabled="true"><span class="badge badge--flat">품절</span>…</div>
<div class="card card--butter"><p class="card__kicker">말랑 패스</p><p class="card__stat">₩9,900</p>…</div>
```
- 크기 `--sm` · 기본 · `--hero` — **같은 크기 카드를 줄줄이 반복하지 말 것**(중요도대로 크기를 가른다). `--flush`(패딩 0).
- 면 `--butter --mint --blue --tomato --pink`. 썸네일 바닥 `card__thumb--mint/butter/peach`(기본 sky), 높이 `style="--thumb-h:200px"`.
- `a.card` · `button.card` · `.card--press`만 눌린다. 선택 `aria-pressed/aria-selected="true"` 또는 `.is-selected`(블루 테두리 + 눌린 채).
- 큰 숫자 `.card__stat`(뒤에 `<small>단위</small>`).

### carousel — 선반 위 칸들, 자동 회전 없음
```html
<div class="carousel" data-carousel aria-roledescription="회전 선반" aria-label="80티어 보상 선반" style="--slide-w:200px">
  <div class="carousel__viewport" tabindex="0"><ul class="carousel__track">
    <li class="carousel__slide"><div class="card card--sm">…</div></li> …
  </ul></div>
  <div class="carousel__controls">
    <button class="btn btn--icon carousel__prev" type="button" aria-label="이전 칸">…</button>
    <div class="carousel__dots"></div><span class="carousel__status" data-carousel-status></span>
    <button class="btn btn--icon carousel__next" type="button" aria-label="다음 칸">…</button>
  </div>
</div>
```
점(`.carousel__dots`)은 app.js가 만든다. 스와이프·스냅·←→ 키. 모바일 칸 폭 `--slide-w-m`(기본 72vw).
- 시작 칸: 상자에 `data-start="3"`(0부터) 또는 슬라이드에 `data-carousel-start`. 칸이 8개 이상이면 app.js가 `.carousel--many`를 붙이고, ≤600px에서 점을 숨기고 `1 / 14` 숫자만 남긴다(숫자는 줄바꿈 없음).
- 전체 중 일부만 올린 선반(예: 80티어 중 33–46): 상자에 `data-range-start="33" data-range-total="80" data-range-label="티어"`를 주면 카운터가 칸 순번 대신 보이는 범위 `티어 33–39 / 80`을 쓴다. 안에 `[data-carousel-strip]`(pricing의 `.pc-strip`)을 두면 app.js가 현재 창 위치를 `--win-l`·`--win-w`로 넣는다.
- 장난감 상자(index `.toybox`)는 ≤600px에서 app.js가 뚜껑 제목을 `.toybox__toggle` 버튼(aria-expanded)으로 감싸 아코디언이 된다. 첫 상자만 열리고, 주소 #조각이 닫힌 상자 안을 가리키면 연다.

### code — 밤색 트레이(양 모드 공통)
```html
<figure class="code"><figcaption class="code__bar"><span class="code__file">season7/pass.json</span><button class="code__copy" type="button"><span data-copy-label>복사</span></button></figcaption>
<pre class="code__pre"><code><span class="code__line">{</span><span class="code__line">  <span class="tk-p">"sku"</span>: <span class="tk-s">"SK-S7-014"</span>,</span><span class="code__line">}</span></code></pre></figure>
```
줄은 `.code__line`(번호 자동, 강조 `.code__line--hl`). 토큰 `.tk-k .tk-s .tk-n .tk-p .tk-c .tk-f`. 인라인 키 `<span class="kbd">⌘K</span>`. 아무 버튼에나 `data-copy-text="BJ-2409-38172"`를 주면 그 값을 복사 + 토스트.

### command — 1-6 셸 참고 (정적 견본은 아래)
```html
<div class="cmdk cmdk--static" role="presentation"><div class="cmdk__box">
  <div class="cmdk__search"><svg class="icon">…</svg><span class="cmdk__input" style="display:flex;align-items:center">탑쌓</span></div>
  <div class="cmdk__list" role="listbox" aria-label="찾은 것 견본"><p class="cmdk__group">미니게임</p>
    <div class="cmdk__opt" role="option" aria-selected="true"><span class="cmdk__ico">…</span><span class="cmdk__label">꾹꾹 탑쌓기 연습장</span><span class="cmdk__hint">로테이션 2번째</span></div></div>
</div></div>
```
`.cmdk__ico` 색 `--mint --tomato --pink --blue`(기본 버터). 선택 줄 = 블루 면.

### drawer — 오른쪽 반죽 판 / 모바일 아래 시트
```html
<button class="btn" type="button" data-open="party-drawer" aria-expanded="false">파티 보기</button>
<div class="drawer" id="party-drawer" role="dialog" aria-modal="true" aria-labelledby="party-drawer-title" hidden>
  <div class="drawer__panel"><span class="drawer__handle" aria-hidden="true"></span>
    <div class="drawer__head"><h2 class="drawer__title" id="party-drawer-title">파티 · 3 / 4</h2><button class="btn btn--icon btn--sm" type="button" data-close aria-label="닫기">…</button></div>
    <div class="drawer__body">…</div>
    <div class="drawer__foot"><button class="btn" type="button" data-close>닫기</button><button class="btn btn--primary" type="button">친구 초대</button></div>
  </div>
</div>
```
왼쪽에서: `.drawer--left`. 정적 견본: `.drawer.drawer--static`(hidden 없이, `role="presentation"`, 안의 버튼 `tabindex="-1"`).

### empty — 반죽이가 상황을 연기
```html
<div class="empty">
  <div class="empty__scene empty__scene--inbox" aria-hidden="true"><span class="empty__box"></span><!-- dough--blue dough--sleep --><span class="empty__zz">z z</span></div>
  <p class="empty__title">우편함이 텅 비었어요</p><p class="empty__text">…</p><a class="btn btn--primary" href="profile.html">친구 목록 보기</a>
</div>
<div class="empty"><div class="empty__scene empty__scene--search" aria-hidden="true"><!-- dough--toma dough--surprised --><span class="empty__lens"></span></div>…</div>
```
버튼은 1개. 좁은 칸은 `.empty--compact`.

### form
```html
<form class="tray tray--lg stack stack--lg" data-validate data-success-title="반죽이 이름을 지었어요" novalidate>
  <div class="form-grid">
    <div class="field"><div class="field__row"><label class="field__label" for="nick">반죽이 이름 <span class="field__req">필수</span></label><span class="field__count" id="nick-count">0 / 12</span></div>
      <input class="input" id="nick" required data-max="12" data-count="nick-count" placeholder="예: 말랑콩" aria-describedby="nick-hint nick-error">
      <p class="field__hint" id="nick-hint">한글·영문·숫자 12자까지</p><p class="field__error" id="nick-error" hidden></p></div>
    <div class="field"><label class="field__label" for="isle">자주 가는 섬</label><span class="select-wrap"><select class="select" id="isle">…</select></span></div>
    <div class="field form-grid__full"><label class="field__label" for="msg">1:1 문의 내용</label><textarea class="textarea" id="msg"></textarea></div>
  </div>
  <div class="form-actions"><button class="btn" type="reset">비우기</button><button class="btn btn--primary" type="submit">이름 짓기</button></div>
</form>
```
- **폼은 흰 반죽(`.tray`) 위에** — 오류 글자색 대비가 하늘 바닥 위에선 미달이다.
- 인풋: `.input`(`--sm --lg --mono`), 아이콘 `.input-wrap` + `.input-wrap__icon` / 끝 버튼 `.input-wrap__end`. `readonly` · `disabled` · `aria-invalid="true"`(토마 테두리 + 흔들림) · `.is-valid`.
- 검증(`data-validate`): `required` · `minlength` · `data-max` · `pattern` · `type="email"`. 메시지 커스텀 `data-error-required/-short/-long/-pattern`. 오류 문구는 `aria-describedby`에 연결된 `.field__error`에 app.js가 넣는다. 통과하면 제출 버튼 로딩 → 성공 토스트(`data-success-title/-text`) + `banjuk:submitted` 이벤트.
- 체크박스(민트 떡이 툭) / 라디오(블루 콩):
```html
<label class="check"><input class="check__input" type="checkbox" checked><span class="check__box"></span><span class="check__label">친구 초대 <small>보조 설명</small></span></label>
<label class="radio"><input class="radio__input" type="radio" name="ctl" checked><span class="radio__dot"></span><span class="radio__label">가상 조이스틱</span></label>
```
- 고르기 알약(색 변형·패스 고르기): `<label class="choice"><input class="choice__input" type="radio" name="clr" checked><span class="choice__face">군고구마</span></label>`
- 스위치(젤리 손잡이):
```html
<button class="switch" role="switch" aria-checked="false" type="button"><span class="switch__track"><span class="switch__knob"></span></span><span class="switch__label">진동 <small data-switch-state data-on="켬" data-off="끔">끔</small></span></button>
```
- 슬라이더: `<div class="range-field field"><div class="range-field__head"><label class="field__label" for="bgm">배경음</label><output class="range-field__out" for="bgm">70</output></div><input class="range" id="bgm" type="range" min="0" max="100" value="70"></div>` (채움색 `.range--mint/--blue/--tomato` — 채움은 하이라이트 + 받침 띠가 있는 슬랩, 나머지 트랙은 홈. 단위 `data-unit`). app.js가 값을 입력과 `.range-field`에 `--range-val`(0–1) + `data-value`로 내보내므로, 장면 CSS가 `calc(… * var(--range-val))`로 슬라이더에 따라 모양을 바꿀 수 있다.
- 스테퍼(자녀 보호 플레이 시간):
```html
<div class="stepper" data-stepper data-min="0.5" data-max="6" data-step="0.5" data-value="2" data-format="hm">
  <button class="btn btn--icon btn--sm" type="button" data-step="-1" aria-label="30분 줄이기">…</button>
  <output class="stepper__value" aria-live="polite">2</output>
  <button class="btn btn--icon btn--sm" type="button" data-step="1" aria-label="30분 늘리기">…</button>
</div>
```
  `data-format="hm"` → "2시간 30분", 아니면 숫자 + `data-unit`.
- 묶음 `.fieldset` + `.fieldset__legend`, 두 칸 `.form-grid`(≤600 한 칸), 전폭 `.form-grid__full`.

### kanban — 시즌 8 보드
```html
<div class="kanban" data-kanban aria-label="시즌 8 업데이트 보드">
  <section class="kanban__col kanban__col--sky" data-col="기획">
    <header class="kanban__head"><h3 class="kanban__title">기획</h3><span class="badge badge--count kanban__count">3</span></header>
    <ul class="kanban__list">
      <li class="kcard"><div class="kcard__top"><!-- dough--avatar dough--sm (담당자 색) --><span class="kcard__id">LO-235</span></div>
        <p class="kcard__title">신규 미니게임 「얼음 땡」 규칙서</p>
        <div class="kcard__meta"><span class="kcard__who">정우빈</span><span class="kcard__due">10/21</span></div></li>
    </ul>
  </section> …
</div>
```
- 열 바닥색은 열마다 다르게: `--sky --mint --butter --peach --well`. 열 순서 기획 · 아트 · 개발 · QA · 출시 대기.
- 마우스는 6px 끌면 집힌다. **터치는 280ms 꾹 누른 뒤에만 집히고**, 그 전에 움직이면 화면이 스크롤된다(카드가 화면을 덮는 모바일에서 스크롤이 막히지 않게). 키보드(Space 집기 → ←→ 열 / ↑↓ 순서 → Space 놓기, Esc 취소)는 app.js. 카운트 배지 자동 갱신. 놓을 때 `banjuk:kanban` 이벤트(`detail.col`).
- 마감 지남 `.kcard__due--late`, 급함 배지는 `.kcard__top` 끝에. 열 아래 추가 버튼 `.kanban__add`.
- 좁은 컨테이너(운영 레이아웃 본문 약 1028px)에 다섯 열을 모두 맞출 때 `.kanban--fit`: ≥1200px에서 열이 `minmax(0,1fr)`로 줄고 가로 스크롤이 없다. 그보다 좁으면 기본처럼 가로 스크롤.

### list — 알약 줄
```html
<ul class="plist">
  <li><a class="plist__row plist__row--unread" href="inbox.html"><!-- avatar --><span class="plist__main"><span class="plist__title">시즌 7 티어 34 달성 보상: 젤리 60</span><span class="plist__sub">반죽섬 운영팀 · PO-1010-07</span></span><span class="plist__end"><span class="badge badge--butter is-keep">미수령</span><span class="plist__time">15:02</span></span></a></li>
  <li><a class="plist__row" href="…" aria-current="true">…</a></li>
</ul>
```
안 읽음 `.plist__row--unread`(토마 점 + Jua 제목) · 선택 `aria-current`/`aria-selected="true"` · 비활성 `aria-disabled`. 조밀형 `.plist--flat`, 두 줄 허용 `.plist--wrap`. ≤600px에서 끝 배지는 숨는다(남길 것은 `.is-keep`).

### marquee — 오늘 미니게임 로테이션(사이트에서 한 곳)
```html
<div class="marquee" data-marquee>
  <div class="marquee__viewport"><ul class="marquee__track">
    <li class="marquee__item"><span class="marquee__bean marquee__bean--tomato"></span>반죽 굴리기 레이스</li>
    <li class="marquee__item"><span class="marquee__bean marquee__bean--butter"></span>꾹꾹 탑쌓기</li>
    <li class="marquee__item"><span class="marquee__bean"></span>말랑 피구</li>
    <li class="marquee__item"><span class="marquee__bean marquee__bean--blue"></span>젤리 줍기</li>
    <li class="marquee__item"><span class="marquee__bean marquee__bean--pink"></span>반죽 술래잡기 <small>평균 4분 12초</small></li>
  </ul></div>
  <button class="marquee__toggle" type="button" aria-pressed="false" aria-label="흐르는 띠 멈추기"><!-- pause 아이콘 class="icon is-pause" --><!-- play 아이콘 class="icon is-play" --></button>
</div>
```
복제·속도는 app.js. 호버·포커스·정지 버튼·reduced-motion에서 멈춘다.

### menu — 흰 반죽 상자
```html
<button class="btn btn--sm" type="button" data-menu="party-menu" aria-haspopup="menu" aria-expanded="false" aria-controls="party-menu">…파티 메뉴</button>
<div class="menu" id="party-menu" role="menu" aria-label="파티 메뉴">
  <p class="menu__label">파티</p>
  <button class="menu__item" role="menuitem" type="button"><svg class="icon">…</svg>친구 초대</button>
  <button class="menu__item" role="menuitemradio" aria-checked="true" type="button">…빠른 매칭</button>
  <hr class="menu__sep">
  <button class="menu__item menu__item--danger" role="menuitem" type="button">…파티 나가기</button>
</div>
```
패널은 body 끝 아무 데나(app.js가 열 때 body로 옮겨 fixed 배치). 화살표/Home/End/Esc/Tab, 바깥 누르면 닫힘. 열어 둘 항목 `data-keep-open`. 단축키 표기 `.menu__kbd`. 정적 견본 `.menu.menu--static`(`role="menu"`, 항목 `tabindex="-1"`).

### modal — 반죽이가 걸터앉은 상자
```html
<button class="btn btn--primary" type="button" data-open="buy-modal" aria-expanded="false">구매하기</button>
<div class="modal" id="buy-modal" role="dialog" aria-modal="true" aria-labelledby="buy-modal-title" hidden>
  <div class="modal__box"><span class="modal__perch"><!-- dough--butter dough--happy --></span>
    <button class="btn btn--icon btn--sm modal__close" type="button" data-close aria-label="닫기">…</button>
    <h2 class="modal__title" id="buy-modal-title">군고구마 토마를 살까요?</h2>
    <div class="modal__body"><p>젤리 <strong>590</strong>개를 써요. 구매 후 남는 젤리는 <strong>1,750</strong>개예요.</p></div>
    <div class="modal__actions"><button class="btn" type="button" data-close>그만두기</button><button class="btn btn--primary" type="button" data-close data-toast="reward" data-toast-title="군고구마 토마를 샀어요">590젤리로 구매</button></div>
  </div>
</div>
```
트리거 위치에서 부풀어 등장, Esc·바깥·`data-close`로 닫히고 포커스는 트리거로 돌아간다. 위험 확인(계정 삭제)은 걸터앉은 반죽이를 `dough--toma dough--dizzy`로, 확정 버튼 `btn--danger`. 넓게 `.modal--wide`. 정적 견본 `.modal.modal--static`(`role="presentation"`, `style="background:var(--scrim)"`, 버튼 `tabindex="-1"`).

### motion — 이징 견본
```html
<div class="motion-lab">
  <div class="motion-lab__item"><div class="motion-lab__stage"><span class="motion-puck" id="pk-squish"></span></div>
    <p class="motion-lab__name">꾹</p><p class="motion-lab__spec">90ms · .3,0,.6,1</p>
    <button class="btn btn--sm" type="button" data-motion-play="squish" data-target="pk-squish">눌러 보기</button></div> …
</div>
```
`data-motion-play` = `squish` `boing` `jelly` `bob`. 퍽 색 `.motion-puck--mint/--blue/--tomato`.

### navbar — 1절 셸 스니펫 그대로
워드마크 단독 사용: `<a class="hud__mark" href="…" aria-label="반죽섬 파티 로비">BANJUK<span>!</span></a>`. 레벨 링은 progress의 `.ring`.

### pagination
```html
<nav class="pager" aria-label="우편 페이지"><ul class="pager__list">
  <li><a class="pager__btn pager__btn--nav" aria-disabled="true" aria-label="이전 페이지">…</a></li>
  <li><a class="pager__btn" href="inbox.html" aria-current="page">1</a></li>
  <li class="pager__item--far"><a class="pager__btn" href="inbox.html">2</a></li>
  <li class="pager__gap" aria-hidden="true">…</li>
  <li><a class="pager__btn pager__btn--nav" href="inbox.html" aria-label="다음 페이지">…</a></li>
</ul><span class="pager__info">우편 46통 중 1–10</span></nav>
```
`href="#"` 금지 — 실제 링크가 없으면 `<button class="pager__btn" type="button">`(app.js가 `aria-current`를 옮긴다). ≤600px에서 `.pager__item--far`는 숨는다.

### popover — 말풍선 반죽
```html
<button class="btn btn--sm btn--blue" type="button" data-popover="isle-choco" aria-expanded="false" aria-controls="isle-choco">초코섬 상태</button>
<div class="pop" id="isle-choco" role="dialog" aria-label="초코섬 상태">
  <p class="pop__title">초코섬 · 점검 예정</p><p class="pop__body">10/15(목) 06:00 서버 증설. 지금 동접 <strong>5,150</strong>.</p>
  <div class="pop__actions"><button class="btn btn--sm" type="button">다른 섬 보기</button></div>
</div>
```
아래 공간이 없으면 위로 뜬다(꼬리 방향 자동). 정적 견본 `.pop.pop--static`.

### progress — 홈 트랙 + 슬랩 채움
```html
<div class="meter-field">
  <div class="meter-field__head"><span class="meter-field__label">말랑 패스 티어</span><span class="meter-field__value"><b>34</b> / 80</span></div>
  <div class="meter meter--pass" role="progressbar" aria-label="말랑 패스 티어" aria-valuemin="0" aria-valuemax="80" aria-valuenow="34" style="--val:42.5%">
    <span class="meter__fill"></span><span class="meter__rider"><!-- dough--mint dough--happy --></span></div>
</div>
<div class="meter meter--blue meter--loading" role="progressbar" aria-label="초코섬 서버 증설"><span class="meter__fill"></span></div>
<div class="meter meter--tomato" … aria-invalid="true" style="--val:40%"><span class="meter__fill"></span></div><p class="meter-field__error">…</p>
<span class="ring ring--butter" style="--val:.425"><span class="ring__value">34</span></span>
```
색 기본 mint · `--butter --blue --tomato --pink` · `--sm`(10px) · `--pass`(24px + 탄 반죽이, 위 여백 40 포함) · `--loading` · 오류 `aria-invalid`. 눈금 `<span class="meter__ticks"><i></i>…</span>`. 원형 `.ring`(`--ring-size` `--ring-w`, 색 `--butter --blue --tomato`).

### sidebar — 1-5 셸 그대로 (운영 화면 전용)

### skeleton
```html
<div class="skel-row"><span class="skel skel--blob"></span>
  <div class="skel-group" aria-busy="true"><span class="sr-only">우편을 불러오는 중</span><span class="skel skel--title"></span><span class="skel skel--line"></span><span class="skel skel--short"></span></div></div>
```
`skel--pill` `skel--card`. 카드 통째로는 `.card[aria-busy="true"]` 안에 skeleton.

### spinner — 스쿼시하는 버터 반죽(회전 원형 금지)
```html
<span class="spinner" role="status"><span class="spinner__blob" aria-hidden="true"></span><span class="spinner__label">매칭 중… 9초</span></span>
```
`--sm`(가로, 20) · `--lg`(80) · `--mint`. 라벨을 숨기려면 `spinner__label sr-only`.

### steps — 징검다리 섬
```html
<ol class="steps" aria-label="반죽이 만들기 단계">
  <li class="steps__item steps__item--done"><span class="steps__isle"><svg class="icon">check</svg></span><span class="steps__text"><span class="steps__label">색 고르기</span><span class="steps__sub">민트 반죽</span></span></li>
  <li class="steps__item" aria-current="step"><span class="steps__isle">2</span><span class="steps__text"><span class="steps__label">모양 주무르기</span></span></li>
  <li class="steps__item"><span class="steps__isle">3</span><span class="steps__text"><span class="steps__label">이름 짓기</span></span></li>
  <li class="steps__item"><span class="steps__isle">4</span><span class="steps__text"><span class="steps__label">연습 경기</span></span></li>
</ol>
```
- `.steps__text`는 모든 폭에서 세로로 쌓인다(라벨 아래 `.steps__sub` 한 줄). 가로형은 가운데, `.steps--vertical`·≤600px은 왼쪽 정렬.
오류 단계 `.steps__item--error`. 세로형 `.steps--vertical`(≤600px 자동).

### table — 트레이 안 표
```html
<div class="tbl-wrap"><table class="tbl tbl--cards" data-select-count="pay-sel">
  <thead><tr>
    <th class="tbl__check"><label class="check"><input class="check__input" type="checkbox" data-select-all aria-label="모두 고르기"><span class="check__box"></span></label></th>
    <th aria-sort="none"><button class="tbl__sort" type="button">결제</button></th>
    <th class="tbl__num" aria-sort="descending"><button class="tbl__sort" type="button">금액</button></th><th>상태</th></tr></thead>
  <tbody>
    <tr><td class="tbl__check"><label class="check"><input class="check__input" type="checkbox" data-row-select aria-label="PAY-261010-58213"><span class="check__box"></span></label></td>
      <td class="tbl__primary tbl__id">PAY-261010-58213</td><td class="tbl__num" data-label="금액" data-sort="19900">₩19,900</td><td data-label="상태"><span class="badge badge--mint">지급 완료</span></td></tr>
  </tbody></table></div>
<p class="tbl-foot"><span id="pay-sel"></span><span>…</span></p>
```
- 숫자 `.tbl__num`(정렬값 `data-sort`), ID `.tbl__id`, 이름+아바타 `.tbl__name`, 강조 `.tbl__strong`, 조밀 `.tbl--dense`.
- 정렬은 `th[aria-sort]` 안 `.tbl__sort`, 선택은 `data-select-all`/`data-row-select`(행 `aria-selected` 자동, 개수는 `data-select-count`가 가리키는 요소에).
- `.tbl--cards`: ≤600px에서 줄이 카드로. 각 `td`에 `data-label`, 줄 제목 칸은 `.tbl__primary`. 행 체크박스(`td.tbl__check`)가 있으면 카드 첫 줄 오른쪽 끝에 붙는다. 쓰지 않으면 표는 `.tbl-wrap` 안에서 가로 스크롤.

### tabs — 홈 레일 + 버터 인디케이터
```html
<div class="tabs" data-tabs>
  <div class="tabs__rail"><div class="tabs__list" role="tablist" aria-label="설정 공방">
    <button class="tabs__tab" role="tab" id="tab-sound" aria-controls="panel-sound" aria-selected="true">사운드</button>
    <button class="tabs__tab" role="tab" id="tab-alarm" aria-controls="panel-alarm" aria-selected="false">알림 <span class="badge badge--count badge--tomato">2</span></button>
    <span class="tabs__ink" aria-hidden="true"></span>
  </div></div>
  <div class="tabs__panel" role="tabpanel" id="panel-sound" aria-labelledby="tab-sound" tabindex="0">…</div>
  <div class="tabs__panel" role="tabpanel" id="panel-alarm" aria-labelledby="tab-alarm" tabindex="0" hidden>…</div>
</div>
```
`.tabs__ink`는 탭 목록의 **마지막 자식**. 전폭 `.tabs--block`. ←→ Home End. 넘치면 가로 스크롤 + 끝 페이드(자동). `banjuk:tab` 이벤트.

### timeline — 반죽 끈 + 콩
```html
<ol class="tline">
  <li class="tline__item"><span class="tline__bean tline__bean--butter" aria-hidden="true"></span><p class="tline__time">9/24 목 10:00</p><p class="tline__title">시즌 7 「가을 반죽 축제」 시작</p></li>
  <li class="tline__item tline__item--now"><span class="tline__bean" aria-hidden="true"></span><p class="tline__time">10/10 토 15:20 · 지금</p><p class="tline__title">…</p><p class="tline__text">…</p><div class="tline__meta"><span class="badge">…</span></div></li>
  <li class="tline__item tline__item--future"><span class="tline__bean" aria-hidden="true"></span>…</li>
</ol>
```
콩 색 `--tomato --butter --blue --pink`(기본 민트).

### toast — 떨어져 튀는 알약
```html
<button class="btn btn--mint" type="button" data-toast="success" data-toast-title="저장했어요" data-toast-text="배경음 70">저장</button>
<!-- JS: Banjuk.toast({ tone: 'reward', title: '젤리 60 받았어요', text: '보유 젤리 2,400' }) -->
<div class="toast toast--success toast--static" role="status"><span class="toast__face"><!-- dough--mint dough--happy --></span><div class="toast__body"><p class="toast__title">…</p><p class="toast__text">…</p></div><button class="toast__close" type="button" aria-label="알림 닫기">…</button></div>
```
톤 `success`(민트콩 웃음) `error`(토마 어지러움, role=alert) `info`(블루베) `reward`(버터 웃음). 4.5초 뒤 닫힘, 호버·포커스 시 멈춤. 존(`.toast-zone`)은 app.js가 만든다(HUD 아래 오른쪽, 모바일 위쪽 전폭).

### tooltip — 잉크 알약
```html
<span class="tip"><button class="btn btn--icon" type="button" aria-label="우편함" aria-describedby="tip-mail">…</button><span class="tip__bubble" role="tooltip" id="tip-mail">새 우편 3통</span></span>
```
아래로: `.tip--bottom`. 단축키 `<span class="tip__kbd">⌘K</span>`. Esc로 숨김.
- 색: 낮 `#1D2142`, 밤 `#0B0F26`(밤 표면 `#1F2752`와 갈라지도록 더 짙게) + 1px 밝은 테(`--tip-rim`).

---

## 6. app.js 훅 요약

| 훅 | 동작 |
|---|---|
| `[data-theme-toggle]` | 낮/밤 전환 + `localStorage['banjuk-theme']`. `?theme=dark|light`가 최우선 |
| `[data-theme-scope="#id"]` | 그 요소만 밤/낮 전환(`[data-scope-label]`·`[data-scope-ico]`·aria-label을 다음 행동으로 갱신) |
| `[data-open="id"]` · `[data-close]` | 모달·드로어·커맨드 열기/닫기(포커스 트랩·Esc·스크롤 잠금·바깥 클릭) |
| `[data-command-open]` · ⌘K/Ctrl+K | 커맨드 팔레트 |
| `[data-popover="id"]` · `[data-menu="id"]` | 팝오버 · 메뉴 |
| `.tabs` · `.acc` · `[data-carousel]` · `[data-calendar]` · `[data-kanban]` · `[data-marquee]` · `.tbl` | 각 컴포넌트 자동 초기화 |
| `[data-toast]` + `data-toast-title/-text` · `Banjuk.toast({tone,title,text})` | 토스트 |
| `.switch[role=switch]` · `.range` · `[data-stepper]` | 스위치 · 슬라이더 값 · 스테퍼 |
| `[data-pick-group data-pick-target="#el" data-pick-attr="data-skin" data-pick-label="#name"]` 안의 `button[aria-pressed][data-value][data-label]` | 하나만 고르기 → 대상 속성 바꾸고 젤리 흔들림 (`banjuk:pick`) |
| `form[data-validate]` · `[data-count="id"]` | 검증 · 글자 수 |
| `[data-claim="60" data-claim-kind="jelly|coin"]` (+`data-claim-done`, `[data-claim-label]`, `data-claim-badge='[data-mail-state="PO-1010-07"]'`) | 보상 받기: 로딩 → 비활성 + HUD 재화 카운트업 + 보상 토스트. `data-claim-badge` 선택자에 걸린 상태 배지(목록 줄·편지 머리)는 '수령 완료'(민트)로 바뀐다 |
| `[data-demo-busy]` | 1.6초 로딩 시연 |
| `.code__copy` · `[data-copy-text]` | 복사 + 토스트 |
| `[data-countup="N"]` · `[data-land]` | 보일 때 카운트업 · 자식 착지 |
| `.dough` (자동 깜빡임) · `.dough[data-gaze]` | 반죽이 눈 |
| `[data-motion-play][data-target]` | 모션 견본 재생 |
| `.alert__close` · `.pager button.pager__btn` | 알림 닫기 · 버튼형 페이지 번호 |
| 이벤트 | `banjuk:open` `banjuk:close` `banjuk:tab` `banjuk:switch` `banjuk:pick` `banjuk:kanban` `banjuk:submitted` |

`Banjuk.open(id)` · `Banjuk.close(id)` · `Banjuk.setTheme('dark')`도 있다. 장면 전용 동작이 더 필요하면 인라인 `<script>`/onclick 대신 위 데이터 훅을 조합한다.

---

## 7. 정적 견본 규칙 (index의 "열린 상태" 전시)

오버레이는 글로 설명하지 말고 **열린 상태를 정적으로 렌더한 견본 + 실제로 여는 트리거**를 둘 다 둔다.
- 견본: `.modal--static` `.drawer--static` `.cmdk--static` `.menu--static` `.pop--static` · `.toast--static`. 견본 컨테이너는 `role="presentation"`(메뉴는 `role="menu"` 유지), 안의 버튼은 `tabindex="-1"`, 견본 id는 실제 오버레이 id와 겹치지 않게.
- 견본 배경 딤은 `style="background:var(--scrim)"`이나 장면 CSS에서. 브라우저 창 목업(●●● URL바) 금지.

---

## 8. 쓰지 말 것

- 가운데정렬 "작은 라벨 → 제목 → 부제" 섹션 헤더 반복 → 이름표(3절).
- 모든 카드 같은 크기·같은 반경 그리드, 컴포넌트를 둥근 카드에 하나씩 진열하는 갤러리.
- 3–4px 잉크 테두리(01 네오브루탈 문법). 클레이의 경계는 선이 아니라 **두께(받침)**.
- 파스텔을 버튼 면으로. 파스텔은 바닥에만, 오브젝트는 진한 반죽색.
- 흐린 radial-gradient 얼룩 배경(`.grounded` 접지 그림자는 오브젝트 바로 아래에만).
- 흰 글자를 토마토·민트·버터·딸기 면에, `--tomato-text`·`--mint-text`를 바닥(하늘·민트) 위에.
- 넓은 자간·모노를 한글에(라틴·숫자만).
- `href="#"`, 인라인 onclick, 인라인 `grid-template-columns`, 이미지 파일, 외부 JS/CSS(폰트 제외), 이모지, SVG 속성 안의 `var()`.
- 팩트 시트에 없는 날짜·요일·가격·인물·주소. "○○", Lorem, "Card title".

---

## 9. 아이콘 정본 (24 그리드 · `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">…</svg>`)

```text
search: <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>
sun: <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M2.5 12h2M19.5 12h2M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"/></svg>
moon: <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/></svg>
home: <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M3.5 11L12 4l8.5 7"/><path d="M5.5 9.5V20h13V9.5"/><path d="M10 20v-5h4v5"/></svg>
bag: <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 8h14l-1.2 12H6.2L5 8z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/></svg>
ticket: <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16v4a2 2 0 0 0 0 4v4H4v-4a2 2 0 0 0 0-4z"/><path d="M14 7v2M14 11.5v1M14 15v2"/></svg>
mail: <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="3.5"/><path d="M4.5 7.5l7.5 5.5 7.5-5.5"/></svg>
sliders: <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h9M19 6h1M4 12h3M11 12h9M4 18h11M19 18h1"/><circle cx="16" cy="6" r="2.2"/><circle cx="9" cy="12" r="2.2"/><circle cx="17" cy="18" r="2.2"/></svg>
x: <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>
left: <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>
right: <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>
check: <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>
plus: <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>
minus: <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/></svg>
copy: <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="8" y="8" width="12" height="12" rx="3"/><path d="M16 8V6.5A2.5 2.5 0 0 0 13.5 4h-7A2.5 2.5 0 0 0 4 6.5v7A2.5 2.5 0 0 0 6.5 16H8"/></svg>
play: <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5l10.5 6.5L8 18.5z"/></svg>
pause: <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.5 5.5v13M15.5 5.5v13"/></svg>
more: <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="5.5" cy="12" r="1.2"/><circle cx="12" cy="12" r="1.2"/><circle cx="18.5" cy="12" r="1.2"/></svg>
tower: <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20h16"/><path d="M7 20v-8M12 20V5M17 20v-5"/></svg>
board: <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="4.5" width="17" height="15" rx="3.5"/><path d="M9.5 4.5v15M14.5 4.5v15"/></svg>
gift: <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="9" width="17" height="11" rx="2.5"/><path d="M12 9v11M3.5 13.5h17"/><path d="M12 9C10 5 6.5 5 6.5 7.2S9.5 9 12 9zm0 0c2-4 5.5-4 5.5-1.8S14.5 9 12 9z"/></svg>
users: <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="9" cy="9" r="3.5"/><path d="M3 20a6 6 0 0 1 12 0"/><circle cx="17" cy="8" r="2.5"/><path d="M16.5 14a4.5 4.5 0 0 1 4.5 5"/></svg>
trash: <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M9.5 7V4.5h5V7M6.5 7l1 13h9l1-13"/></svg>
bell: <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 16v-5a6 6 0 0 1 12 0v5l1.5 2h-15z"/><path d="M10 21h4"/></svg>
arrow: <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
map: <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M3.5 6.5l5-2 7 2.5 5-2v13l-5 2-7-2.5-5 2z"/><path d="M8.5 4.5v13M15.5 7v13"/></svg>
flag: <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 21V4"/><path d="M5 4.5h11l-2 4 2 4H5"/></svg>
user: <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8.5" r="4"/><path d="M4.5 20a7.5 7.5 0 0 1 15 0"/></svg>
```
