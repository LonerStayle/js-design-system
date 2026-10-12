# COMPONENTS — 월간 쾅! 「쾅! 편집실」 v2 마크업 계약

index.html · pages/*.html 담당은 **이 문서만 보고** 마크업한다. 디자인 근거는 `DIRECTION.md`, 세계관 값(날짜·이름·ID·가격·수치)은 DIRECTION **2절 팩트 시트**만 쓴다.
클래스는 BEM(`블록__요소--변형`). 상태는 가능하면 ARIA(`aria-selected` `aria-current` `aria-expanded` `aria-pressed` `aria-busy` `aria-invalid` `disabled`)로 표시하고 CSS가 그 속성을 읽는다.

**절대 규칙 (어기면 테마가 무너진다)**
- 모든 표면은 **컷**이다: 3px 먹선 · 모서리 0 · **그림자 없음**. 위계는 컷 크기(행 수)와 먹선 굵기(3→4px)로만. `box-shadow`로 카드 띄우기 금지(효과음 글자만 예외).
- 시스템이 **말하면 풍선**(`.balloon`), **무언가 일어나면 효과음**(`.sfx` / `data-sfx`). 아이콘+테두리 상자형 알림 금지.
- 중간 톤은 **망점**(`.dots .dots-10|20|40|60`)뿐. 투명도로 연하게 만든 색, 그라디언트, 블러 금지. **망점 위에 본문 글자를 직접 올리지 않는다**(글자는 캡션 박스·말풍선·단색 컷 위).
- 섹션 시작은 가운데 정렬 제목이 아니라 컷 왼쪽 위 **노랑 캡션 박스**(`.caption--corner`, 내레이션: 「한편, 식자부에서는……」 「그날 밤 9시.」).
- 서체: 한글 제목 = Kirang Haerang(`.t-h1~3`, **22px 미만 금지**), 라틴 마스트헤드·숫자 = Bangers(`.t-mast` `.t-stat` `.t-latin`, **한글 없음** → 한글엔 쓰지 말 것. **숫자는 48px 이상 큰 스탯에만** — Bangers 이탤릭은 작은 크기에서 1과 7이 구분되지 않는다. 쪽 번호 · 표 숫자 · 배지 숫자 같은 작은 숫자는 Martian Mono 700), 초대형 효과음 = Black And White Picture(`.sfx--xl`, 화면당 1~2개), 본문·UI = Nanum Gothic, ID·가격·날짜 숫자 = Martian Mono(`.t-mono`, **라틴·숫자만** — `10/27(화)`는 `<span class="t-mono">10/27</span>(화)`로 나눈다). 한글에 양수 자간 금지.
- 장면 CSS(`index.css`, `pages/<name>.css`)도 **semantic 토큰만**(아래 1절). raw hex 금지, 인라인 `grid-template-columns` 금지(스팬 클래스 사용). `style="--val:75%"` 같은 커스텀 속성 주입만 허용.
- 아이콘은 인라인 SVG `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="…"/></svg>`. 색·굵기는 CSS가 준다(`stroke: currentColor`, 2.5px). **SVG presentation attribute에 `var()` 금지.** 이모지 금지. 아이콘만 있는 버튼은 `aria-label` 필수.
- `href="#"` · 인라인 onclick 금지. 효과음 boil(`.sfx--boil`)은 **화면당 1개**.

---

## 0. 페이지 뼈대 (모든 HTML 공통)

```html
<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>12월호 마감 상황판 — 월간 쾅! 편집실</title>
<script>(function(){try{var q=new URLSearchParams(location.search).get('theme');var s=localStorage.getItem('kwang-theme');var t=(q==='dark'||q==='light')?q:(s==='dark'||s==='light')?s:(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.setAttribute('data-theme',t);}catch(e){}})();</script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bangers&family=Kirang+Haerang&family=Black+And+White+Picture&family=Nanum+Gothic:wght@400;700;800&family=Martian+Mono:wght@400;700&display=swap">
<link rel="stylesheet" href="styles.css">        <!-- pages: ../styles.css -->
<link rel="stylesheet" href="index.css">         <!-- pages: dashboard.css 등 장면 전용 1개 -->
</head>
<body>
<a class="skip" href="#main">본문으로 건너뛰기</a>
<!-- 2절 셸: 마스트헤드 → 예고 띠 -->
<main id="main">…</main>
<!-- 2절 셸: 푸터 -->
<!-- 2절 셸: 사이트 메뉴 드로어 · 편집장 호출(⌘K) — body 끝 -->
<script src="app.js"></script>                    <!-- pages: ../app.js -->
</body>
</html>
```

- `localStorage` 키 `kwang-theme`. 우선순위 `?theme=dark|light` → 저장값 → 시스템. `?static`을 붙이면 컷 등장 연출 없이 최종 상태로 렌더(스크린샷용, 자동화 브라우저도 동일).
- `<title>` 형식: `<장면 이름> — 월간 쾅! 편집실` (index는 `쾅! 식자부 규격 만화 — 월간 쾅! 12월호 별책부록`).
- 토스트 영역(`.toasts`)은 app.js가 필요할 때 만든다. 직접 둘 필요 없음.

---

## 1. 토큰 (semantic.css) — 장면 CSS가 쓸 수 있는 목록

| 토큰 | light | dark (심야 마감) | 용도 |
|---|---|---|---|
| `--bg` | 갱지 `#FFFCF2` | 밤 거터 `#05071A` (+ body에 사이안 망점) | 거터 · 페이지 |
| `--bg-dot` | 사이안 | 밤 망점 `#2B5BD8` | 거터 망점 |
| `--surface` | 갱지 | 밤 컷 `#18225E` | 컷 면 |
| `--surface-pulp` | 누런 갱지 | `#222D72` | 엽서 · 두 번째 면 |
| `--surface-raised` | 갱지 | `#222D72` | 모달 · 팝오버 · 칸반 카드 |
| `--surface-sunk` | 누런 갱지 | 밤 거터 | 읽기 전용 입력 |
| `--slab-ink` / `--on-slab` / `--on-slab-muted` | 먹 / 갱지 / 달빛 보조 | `#000` / 달빛 / 달빛 보조 | 푸터 · 코드 · 펜선 딱지 |
| `--text` `--text-muted` | 먹 / `#5A5248` | 달빛 `#F6EFDA` / `#AEB7E0` | 글자 |
| `--link` | `#1442B8` | `#8FB4FF` | 링크 |
| `--danger-text` `--success-text` `--info-text` | 빨강 · 초록 · 파랑 | 네온 빨강 · 초록 · 사이안 | 상태 글자 |
| `--line` | 먹 | **먹(`#000`) 그대로** | 먹선 (밤에도 흰 선으로 뒤집지 않음) |
| `--line-ui` | 먹 | `#8C96C8` | 입력 · 체크 경계(3:1 이상) |
| `--accent` / `--on-accent` / `--accent-hot` / `--accent-dot` | 빨강판 / 흰 / 큰 효과음 빨강 / 빨강 위 먹 망점 | 같음 | 1순위 버튼 · 표지 |
| `--caption` / `--on-caption` | 노랑판 / 먹 | 같음(창문 불빛) | 캡션 박스 · 선택 |
| `--info` / `--on-info` | 사이안 / 먹 | 같음 | 정보 면 (흰 글자 금지) |
| `--pink` / `--on-pink` | 살색 / 먹 | 같음 | 살색 면 |
| `--select` / `--on-select` | 파랑 / 흰 | 노랑 / 먹 | 체크 · 라디오 채움 |
| `--balloon` / `--on-balloon` / `--balloon-line` | 갱지 / 먹 / 먹 | **같음**(풍선은 밤에도 흰 종이) | 말풍선 |
| `--dot-color` `--dot-hover` `--dot-ink` `--dot-sky` | 빨강 · 살색 · 먹 · 사이안 | 밤 망점 계열 | 망점 색 |
| `--sfx-fill` `--sfx-fill-alt` `--sfx-stroke` | 노랑 · 빨강 · 먹 | 노랑 · 네온 빨강 · 먹 | 효과음 |
| `--draft` | 논포토 블루 `#7FC4EE` | 같음 | 밑그림 · 비활성 · 스켈레톤 |
| `--selected-bar` | 빨강 | 같음 | 표 선택 행 띠 |
| `--focus-inner` / `--focus-outer` | 먹 / 노랑 | 노랑 / 먹 | 포커스 링 |
| `--cover` / `--cover-moon` | 빨강 / 노랑 | **밤 남색** / 노랑 보름달 | index 표지 |
| `--mast` / `--on-mast` | 노랑 / 먹 | 같음(밤의 간판) | 마스트헤드 |
| `--scrim-dot` `--scrim-base` | 먹 · 갱지 | 먹 · 밤 거터 | 모달 뒤 망점 |
| `--postcard` / `--on-postcard` / `--on-postcard-muted` / `--on-postcard-danger` / `--on-postcard-link` | 누런 갱지 / 먹 / 보조 / 빨강 글자 / 파랑 | **같음**(엽서는 밤에도 종이) | 독자엽서 면 (`.ctx-postcard`, `.list--pulp`) |
| `--lamp` | 노랑판 | 같음 | 스탠드 · 전등 원광(망점 20%로만) |

원시 토큰 중 장면이 직접 써도 되는 것: 서체 `--font-mast` `--font-display-ko` `--font-sfx` `--font-body` `--font-mono`, 크기 `--fs-*`, 간격 `--sp-1~12`, 지면 `--gutter` `--row` `--page-gap` `--line-w` `--line-w-heavy` `--breakout`, 망점 `--dot-pitch` `--dot-pitch-40` `--dot-pitch-60` `--dot-10~60`(40%는 `--dot-pitch-40`과 짝, 60%는 잉크 면 + 종이 점 반전과 `--dot-pitch-60` 짝 — 점 지름 ≤ 이웃 간격 × 0.6. 8px 피치에 40·60% 점을 찍으면 체크무늬가 된다), 모션 `--ease-*` `--dur-*`. 색 원시 토큰(`--ink-*`, `--night-*`, `--paper*`)은 장면에서 쓰지 않는다.

**잉크 문맥**: 노랑·사이안·살색·말풍선처럼 두 모드에서 같은 잉크인 면 안에서는 글자가 자동으로 먹이 된다(`.caption` `.balloon` `.cut--caption` `.cut--info` `.cut--pink` `.cut--paper` `.card--caption` `.card--info`). 빨강 면은 `.cut--accent`/`.card--accent`(흰 글자), 먹 면은 `.cut--ink`. 임의 요소에 같은 효과가 필요하면 `.ctx-paper` / `.ctx-accent` / `.ctx-ink`를 붙인다. **독자엽서**는 `.ctx-postcard`(밤에도 누런 갱지 + 먹 글자, 심야 책상 스탠드 아래 엽서). 엽서 리스트 `.list--pulp`는 이 문맥이 내장돼 있다.

---

## 2. 공통 셸 — 복사해서 그대로 쓴다 (모든 페이지 같은 마크업)

바뀌는 것은 **경로 접두사**와 **현재 페이지 표시(`aria-current="page"`)뿐**이다. 다른 문구·순서·링크를 추가하거나 빼지 않는다.

### 2-1. 페이지 이름표 (경로 · 마스트 링크 · 현재 표시)

| 파일 | 장면 제목 | 마스트 링크 현재 표시 | 사이드바 |
|---|---|---|---|
| `index.html` | 쾅! 식자부 규격 만화 (별책부록) | 없음 | 없음 |
| `pages/dashboard.html` | 12월호 마감 상황판 | 마감 상황판 | 있음 · 마감 상황판 |
| `pages/kanban.html` | 원고 공정판 | 원고 공정판 | 있음 · 원고 공정판 |
| `pages/inbox.html` | 원고·엽서함 | 수신함 | 있음 · 원고·엽서함 |
| `pages/settings.html` | 편집실 설정 | 없음 | 있음 · 편집실 설정 |
| `pages/product.html` | 단행본 『골목대장 쾅 5』 예약 | 단행본 | 없음 |
| `pages/pricing.html` | 구독 요금 | 구독 | 없음 |
| `pages/onboarding.html` | 정기구독 시작 | 구독 | 없음 |
| `pages/profile.html` | 작가 윤바람 | 없음 | 없음 |
| `pages/404.html` | 이번 호 휴재 | 없음 | 없음 |

### 2-2. 마스트헤드 (navbar) — index 경로

```html
<header class="mast">
  <div class="mast__inner">
    <a class="mast__brand" href="index.html" aria-label="월간 쾅! 편집실 — 별책부록 첫 쪽">
      <span class="mast__logo" aria-hidden="true">KWANG!</span>
      <span class="mast__name"><span>월간 쾅!</span><b>편집실</b></span>
    </a>
    <nav class="mast__nav" aria-label="주요 메뉴">
      <ul>
        <li><a class="mast__link" href="pages/dashboard.html">마감 상황판</a></li>
        <li><a class="mast__link" href="pages/kanban.html">원고 공정판</a></li>
        <li><a class="mast__link" href="pages/inbox.html">수신함</a></li>
        <li><a class="mast__link" href="pages/product.html">단행본</a></li>
        <li><a class="mast__link" href="pages/pricing.html">구독</a></li>
      </ul>
    </nav>
    <div class="mast__tools">
      <button class="mast__cmd" type="button" data-command-open aria-label="편집장 호출 (⌘K)">
        <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/></svg>
        <span class="mast__cmd-label">편집장 호출</span><kbd>⌘K</kbd>
      </button>
      <button class="mast__icon" type="button" data-theme-toggle aria-label="밤 장면으로 바꾸기">
        <svg class="icon icon-moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/></svg>
        <svg class="icon icon-sun" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4.5"/><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8"/></svg>
      </button>
      <button class="mast__icon mast__burger" type="button" data-open="site-drawer" aria-controls="site-drawer" aria-expanded="false" aria-label="메뉴 열기">
        <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
      </button>
    </div>
  </div>
</header>
```

**pages 경로**: `href="index.html"` → `href="../index.html"`, `href="pages/dashboard.html"` → `href="dashboard.html"`(나머지도 `pages/` 제거). 현재 페이지 링크에만 `aria-current="page"`(2-1 표). 예: dashboard
`<li><a class="mast__link" href="dashboard.html" aria-current="page">마감 상황판</a></li>`

### 2-3. 예고 띠 (marquee) — 마스트헤드 바로 아래, 모든 페이지 동일

```html
<div class="marquee" role="region" aria-label="다음 호 예고">
  <div class="marquee__viewport">
    <div class="marquee__track">
      <p class="marquee__group"><span>다음 호 예고</span><span class="marquee__star" aria-hidden="true">★</span><span>골목대장 쾅, 드디어 결승전!</span><span class="marquee__star" aria-hidden="true">★</span><span class="marquee__hot">12월호 11월 13일(금) 발매</span><span class="marquee__star" aria-hidden="true">★</span><span>신연재 「달려라 수박」 첫 화</span><span class="marquee__star" aria-hidden="true">★</span><span>10월 24일(토) 윤바람 작가 사인회 · 홍대 만화서점 「컷」</span><span class="marquee__star" aria-hidden="true">★</span></p>
      <p class="marquee__group" aria-hidden="true"><span>다음 호 예고</span><span class="marquee__star">★</span><span>골목대장 쾅, 드디어 결승전!</span><span class="marquee__star">★</span><span class="marquee__hot">12월호 11월 13일(금) 발매</span><span class="marquee__star">★</span><span>신연재 「달려라 수박」 첫 화</span><span class="marquee__star">★</span><span>10월 24일(토) 윤바람 작가 사인회 · 홍대 만화서점 「컷」</span><span class="marquee__star">★</span></p>
    </div>
  </div>
  <button class="marquee__toggle" type="button" data-marquee-toggle aria-pressed="false" aria-label="예고 띠 멈추기">
    <svg class="icon icon-pause" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14M16 5v14"/></svg>
    <svg class="icon icon-play" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5l12 7-12 7z"/></svg>
  </button>
</div>
```
두 `marquee__group`은 글자까지 똑같아야 이음매 없이 돈다(두 번째는 `aria-hidden`). reduced-motion이면 app.js가 멈춘 상태로 시작한다.

### 2-4. 편집실 앱 레이아웃 + 사이드바 (dashboard · kanban · inbox · settings 전용, pages 경로)

```html
<main id="main" class="app">
  <aside class="app__side">
    <nav class="side" aria-label="편집실">
      <span class="caption side__cap">편집실</span>
      <ul class="side__list">
        <li><a class="side__link" href="dashboard.html"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h7v9H4zM13 4h7v5h-7zM13 11h7v9h-7zM4 15h7v5H4z"/></svg>마감 상황판</a></li>
        <li><a class="side__link" href="kanban.html"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h4v16H4zM10 4h4v11h-4zM16 4h4v7h-4z"/></svg>원고 공정판</a></li>
        <li><a class="side__link" href="inbox.html"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16v12H4zM4 7l8 6 8-6"/></svg>원고·엽서함<span class="badge badge--count badge--red" aria-label="미답장 89통">89</span></a></li>
        <li><a class="side__link" href="settings.html"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"/></svg>편집실 설정</a></li>
        <li><a class="side__link" href="../index.html"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4h11l3 3v13H5zM9 9h6M9 13h6M9 17h4"/></svg>별책부록</a></li>
      </ul>
      <p class="side__due"><span class="side__due-num">D-6</span><span class="side__due-text">12월호 원고 마감<br><span class="t-mono">10/27</span>(화) <span class="t-mono">18:00</span></span></p>
    </nav>
  </aside>
  <div class="app__main">
    <!-- 장면: 컷들. 첫 컷은 .caption--corner 내레이션으로 시작 -->
  </div>
</main>
```
- 현재 페이지 `side__link`에 `aria-current="page"`. 문구·순서·D-6 캡션 고정.
- `<1080px`에서 `.app__side`는 숨고 같은 링크가 사이트 메뉴 드로어(2-6)에 있다.
- 사이드바 없는 페이지(index · product · pricing · onboarding · profile · 404)는 `<main id="main">` 안에 `.page` 지면을 쌓는다(3절).

### 2-5. 푸터 — index 경로

```html
<footer class="foot">
  <div class="foot__inner">
    <div class="foot__brand">
      <span class="foot__logo" aria-hidden="true">KWANG!</span>
      <p class="foot__next">다음 화에 계속……</p>
      <address class="foot__addr">
        <span>월간 쾅! 편집부 · 서울 마포구 와우산로29길 18, 3층 (홍대입구역 9번 출구 도보 7분)</span>
        <span>독자센터 02-3142-0732 · 평일 10:00~17:00 (점심 12:30~13:30 제외)</span>
        <span>dokja@kwang.kr · 원고 접수 wongo@kwang.kr</span>
      </address>
    </div>
    <nav class="foot__nav" aria-label="모든 페이지">
      <ul>
        <li><a href="pages/dashboard.html">마감 상황판</a></li>
        <li><a href="pages/kanban.html">원고 공정판</a></li>
        <li><a href="pages/inbox.html">원고·엽서함</a></li>
        <li><a href="pages/settings.html">편집실 설정</a></li>
        <li><a href="pages/onboarding.html">정기구독 시작</a></li>
        <li><a href="pages/pricing.html">구독 요금</a></li>
        <li><a href="pages/product.html">단행본 예약</a></li>
        <li><a href="pages/profile.html">작가 윤바람</a></li>
        <li><a href="pages/404.html">휴재 안내</a></li>
      </ul>
    </nav>
    <p class="foot__base"><span>(주)쾅코믹스 · 대표 홍마루 · 사업자등록번호 <span class="t-mono">214-87-03921</span></span><span>© 2026 (주)쾅코믹스</span></p>
  </div>
</footer>
```
**pages 경로**: `pages/` 접두사 제거(`dashboard.html` …). 현재 페이지 링크에 `aria-current="page"`. 판권 정의 목록(dl) 형식으로 바꾸지 않는다.
**`.foot--slim`**: 바로 위에 차례 미니 컷(`.nx`)이 있는 페이지(index · 404)는 `<footer class="foot foot--slim">` — 같은 마크업이지만 링크 그리드가 한 줄 텍스트 링크로 줄어 목차와 겹치지 않는다.

### 2-6. 사이트 메뉴 드로어 (햄버거, `<1080px`) — body 끝, index 경로

```html
<div class="drawer drawer--left" id="site-drawer" hidden>
  <div class="drawer__scrim" data-close></div>
  <div class="drawer__panel" role="dialog" aria-modal="true" aria-labelledby="site-drawer-title">
    <div class="drawer__head">
      <span class="caption" id="site-drawer-title">월간 쾅! 편집실</span>
      <button class="drawer__close" type="button" data-close aria-label="메뉴 닫기"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button>
    </div>
    <div class="drawer__body">
      <nav class="drawer__nav" aria-label="편집부">
        <p class="drawer__nav-label">편집부</p>
        <a class="drawer__link" href="pages/dashboard.html">마감 상황판</a>
        <a class="drawer__link" href="pages/kanban.html">원고 공정판</a>
        <a class="drawer__link" href="pages/inbox.html">원고·엽서함</a>
        <a class="drawer__link" href="pages/settings.html">편집실 설정</a>
        <p class="drawer__nav-label">독자</p>
        <a class="drawer__link" href="pages/product.html">단행본 예약</a>
        <a class="drawer__link" href="pages/pricing.html">구독 요금</a>
        <a class="drawer__link" href="pages/onboarding.html">정기구독 시작</a>
        <a class="drawer__link" href="pages/profile.html">작가 윤바람</a>
        <p class="drawer__nav-label">별책부록</p>
        <a class="drawer__link" href="index.html">쾅! 식자부 규격 만화</a>
      </nav>
    </div>
    <div class="drawer__foot">
      <button class="btn btn--ghost" type="button" data-theme-toggle data-theme-static-label aria-label="밤 장면 켜고 끄기"><span data-theme-label>불 끄기</span></button>
    </div>
  </div>
</div>
```
**pages 경로**: `pages/` 제거, `index.html` → `../index.html`. 현재 페이지 링크에 `aria-current="page"`.

### 2-7. 편집장 호출 (⌘K 커맨드 팔레트) — body 끝, index 경로

```html
<div class="cmdk" id="cmdk" hidden>
  <div class="cmdk__scrim" data-close></div>
  <div class="cmdk__panel" role="dialog" aria-modal="true" aria-labelledby="cmdk-title">
    <p class="cmdk__cap caption" id="cmdk-title">편집장 호출 <kbd>⌘K</kbd></p>
    <div class="cmdk__shout">
      <svg class="icon icon--lg" viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/></svg>
      <input class="cmdk__input" type="text" placeholder="원고 ID · 작품 · 작가 · 화면" aria-label="편집장 호출 검색" autocomplete="off">
    </div>
    <ul class="cmdk__list">
      <li class="cmdk__group" role="presentation">원고 열기</li>
      <li class="cmdk__item" data-href="pages/kanban.html" data-keywords="정새벽 지연"><span class="cmdk__id">KW-32-05</span><span class="cmdk__label">심야 편의점 히어로</span><span class="badge badge--draft">밑그림</span></li>
      <li class="cmdk__item" data-href="pages/kanban.html" data-keywords="서단비 지연"><span class="cmdk__id">KW-32-07</span><span class="cmdk__label">분식왕 떡순이</span><span class="badge badge--conti">콘티</span></li>
      <li class="cmdk__item" data-href="pages/kanban.html" data-keywords="윤바람"><span class="cmdk__id">KW-32-01</span><span class="cmdk__label">골목대장 쾅</span><span class="badge badge--letter">식자</span></li>
      <li class="cmdk__group" role="presentation">바로 가기</li>
      <li class="cmdk__item" data-href="pages/dashboard.html" data-keywords="대시보드 마감"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h7v9H4zM13 4h7v5h-7zM13 11h7v9h-7zM4 15h7v5H4z"/></svg><span class="cmdk__label">마감 상황판</span><span class="cmdk__hint">D-6</span></li>
      <li class="cmdk__item" data-href="pages/inbox.html" data-keywords="엽서 독자"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16v12H4zM4 7l8 6 8-6"/></svg><span class="cmdk__label">독자엽서함 열기</span><span class="cmdk__hint">미답장 89통</span></li>
      <li class="cmdk__item" data-href="pages/dashboard.html#calendar" data-keywords="달력 일정 인쇄"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16v14H4zM4 10h16M8 3v5M16 3v5"/></svg><span class="cmdk__label">마감 달력</span><span class="cmdk__hint">10/27 마감 · 10/30 입고</span></li>
      <li class="cmdk__group" role="presentation">편집실</li>
      <li class="cmdk__item" data-action="theme" data-keywords="다크 밤 테마"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/></svg><span class="cmdk__label">테마 바꾸기 (불 끄기 / 켜기)</span></li>
    </ul>
    <p class="cmdk__empty" hidden>그런 원고는 없어! 원고 ID를 다시 봐.</p>
    <div class="cmdk__foot"><span><kbd>↑↓</kbd>이동</span><span><kbd>Enter</kbd>열기</span><span><kbd>Esc</kbd>닫기</span></div>
  </div>
</div>
```
**pages 경로**: `data-href`에서 `pages/` 제거(index는 `../index.html`). `data-action="theme"`=테마 전환, `data-action="<요소 id>"`=그 모달/드로어 열기, `data-action="toast"` + `data-toast="…"`=토스트.

---

## 3. 레이아웃 문법 (base.css) — "만화 지면"

### `.page` + `.panels` — 지면 한 쪽 = 12단 × 72px 행, 거터 14px
```html
<section class="page" aria-labelledby="p4-title">
  <div class="panels">
    <div class="cut span-8 rows-6">…</div>
    <div class="cut span-4 rows-3">…</div>
    <div class="cut span-4 rows-3">…</div>
  </div>
  <p class="page__folio">p.4</p>            <!-- 쪽 번호: 바깥쪽 아래. 왼쪽 쪽은 page__folio--left -->
</section>
```
- 스팬 `.span-1~12`, 행 `.rows-1~10`. 행은 `minmax(72px, auto)`이고 `dense` 흐름이라 **한 행 묶음의 스팬 합을 12로 맞추면** 빈 칸이 생기지 않는다. 컷 높이는 행 수로 정한다(브리프 7-8).
- 페이지마다 **다른 컷 템플릿**(DIRECTION 6-3: `splash-2` `tier-3` `L-shape` `diagonal` `grid-9` `inset` `strip-4`). 같은 템플릿을 연속으로 쓰지 않는다. 한 쪽에 3~7컷.
- 반응형: `720~1079px` 6단(`span-7~12`→전폭, `span-4~6`→반폭, `.t-span-6`은 태블릿에서 전폭), `<720px` **웹툰 모드**(1단, 행 해제, 거터 10px). 장면 전환 칸 앞에 `.m-beat`를 붙이면 모바일에서 40px 쉼(시간이 흐르는 칸).
- 거터 망점(지면이 갈수록 진해짐): `.panels`에 `dots dots-10|20|40|60` + 색(`dots--sky` `dots--red` `dots--ink`)을 붙이면 **거터에만** 망점이 보인다(컷 면은 단색이라 글자는 안전).

### `.cut` — 컷 프레임 (S1 시그니처)
```html
<article class="cut span-6 rows-4">
  <span class="caption caption--corner">한편, 식자부에서는……</span>
  <span class="cut__no cut__no--end">03</span>
  <h2 class="t-h2">컷 나누는 법</h2>
  …
</article>
```
- 변형: `--heavy`/`--splash`(4px) `--flush`(패딩 0) `--roomy` `--pulp` `--paper` `--caption`(노랑) `--accent`(빨강·흰 글자) `--info`(사이안) `--pink` `--ink`(먹 면) `--draft`(논포토 점선) `--crop`(넘치는 마스트헤드 자르기) `--center` `--end` `--stack`.
- 컷 번호 `.cut__no`(Martian Mono 11px, 읽는 순서 01~07). 캡션이 왼쪽 위에 있으면 `.cut__no--end`.
- 상호작용 컷(`a.cut` / `button.cut` / `.cut--link`): hover = 살색 망점 10%, active = 살짝 눌림, 선택(`aria-selected="true"`·`aria-current`·`.is-selected`) = 먹선 4px + 위 노랑 캡션 탭, 비활성(`aria-disabled="true"`·`.is-draft`) = 논포토 점선.
- 캡션 박스가 붙은 컷은 자동으로 위 여백이 커진다.

### 사선 컷 `.cut-slant` (액션 장면, 페이지당 1개)
```html
<div class="cut-slant cut-slant--b span-12 rows-4"><div class="cut-slant__face">위 컷 (아래 경계가 사선)</div></div>
<div class="cut-slant cut-slant--t span-12 rows-4"><div class="cut-slant__face">아래 컷 (위 경계가 사선)</div></div>
```
**사선 컷 face는 clip-path라서 안에서 떠오르는 실제 메뉴 · 팝오버 · 툴팁이 잘린다. 사선 컷 안에는 정적 견본(`--static`)만 두고, 실제 트리거는 일반 컷에 둔다.**
바깥 = 먹 면, 안쪽 = 같은 polygon의 종이 면. `--slant`(기본 44px, 모바일 20px)로 기울기 조절. `--t`는 앞 컷과 사선이 맞물리도록 위로 당겨진다.

### 브레이크아웃 · 효과음 · 집중선
```html
<span class="sfx sfx--latin sfx--boil breakout breakout--tr" aria-hidden="true">KWANG!</span>   <!-- 컷 먹선을 24px 뚫고 나옴, 부모 컷은 position:relative(기본) -->
<span class="sfx" aria-hidden="true">쾅!</span>                 <!-- 한글 효과음: Kirang Haerang, 노랑 + 먹 테두리 + 먹 입체 -->
<span class="sfx sfx--red sfx--tilt-r" aria-hidden="true">우당탕!</span>
<span class="sfx sfx--xl sfx--red" aria-hidden="true">쾅!</span>  <!-- 72px 이상 초대형: Black And White Picture, 화면당 1~2개 -->
<div class="focuslines" aria-hidden="true"></div>             <!-- 집중선: 모달 뒤 · 404 전용, 절대 배치로 깔 것 -->
```
- 효과음은 항상 `aria-hidden="true"`. 의미는 옆 풍선·라벨이 전달한다. `--tilt`로 기울기(-8°~6°). 브레이크아웃은 페이지당 1~2개.
- 크기 변형 `.sfx--sm`(28px) / 기본(32~56px) / `.sfx--xl`. 라틴(`KWANG!` `D-6`)은 `.sfx--latin`.

### 망점 유틸 `.dots`
`class="dots dots-20 dots--red"` — 농도 `dots-10|20|40|60`, 색 `--red` `--sky` `--ink` `--yellow` `--deep`(빨강 면 위 먹). 배경색은 따로(`.cut--accent` 등). 조합 예: 빨강 점/종이 = 살색, 사이안 점/종이 = 하늘, 먹 점/노랑 = 그늘, 빨강 점/노랑 = 노을. **이 요소 안에 본문 글자를 두지 말 것.**

### 별 버스트 `.burst` (신연재 · 지연 · 발매 · 가장 많이 고름)
```html
<span class="burst">신연재</span>  <span class="burst burst--red">지연</span>
<span class="burst burst--sm">신연재</span>  <span class="burst burst--lg">가장 많이<br>고름</span>
<span class="burst burst--red breakout breakout--tr">지연</span>  <!-- .burst.breakout = position:absolute, 컷 밖으로 튀어나옴 -->
```

### 쾅돌이 (마스코트 SVG) — 표지 · 404 · 빈 상태
```html
<svg class="kd" viewBox="0 0 120 140" aria-hidden="true">
  <path class="kd__hair" d="M22 56 L12 30 L32 38 L28 10 L48 30 L58 2 L68 28 L86 8 L84 34 L106 26 L98 56 Z"/>
  <path class="kd__shirt" d="M28 104 Q60 94 92 104 L98 138 L22 138 Z"/>
  <path class="kd__hair" d="M58 108 L66 108 L60 120 L68 120 L54 134 L58 122 L52 122 Z"/>
  <circle class="kd__skin" cx="60" cy="68" r="34"/>
  <path class="kd__hair" d="M30 56 L40 40 L46 52 L56 34 L62 50 L74 34 L78 52 L90 42 L92 58 Q60 46 30 56 Z"/>
  <ellipse class="kd__ink" cx="48" cy="68" rx="4" ry="6"/><ellipse class="kd__ink" cx="72" cy="68" rx="4" ry="6"/>
  <path class="kd__line" d="M40 56 L54 60 M80 56 L66 60"/>
  <circle class="kd__cheek" cx="40" cy="82" r="5"/><circle class="kd__cheek" cx="80" cy="82" r="5"/>
  <path class="kd__ink" d="M48 84 Q60 98 72 84 Z"/>
</svg>
```
크기는 `.kd { width }`로(기본 120px). 파츠 클래스 `kd__hair`(빨강) `kd__skin`(종이) `kd__shirt`(노랑) `kd__ink` `kd__line` `kd__cheek` `kd__paper`(빈 원고지 등 소품). 포즈를 바꿀 땐 같은 파츠 클래스로 path만 추가한다.

### 컷 등장 연출
읽는 순서대로 등장시킬 컷에 `data-reveal`. app.js가 화면에 들어온 컷을 60ms 간격으로 `steps(3)` 펼친다(한 번만, reduced-motion·`?static`·자동화 브라우저면 처음부터 최종 상태). 펼침이 끝나면 `.is-revealed`가 붙어 clip-path를 걷으므로 컷 밖으로 튀어나오는 메뉴 · 팝오버 · 브레이크아웃도 잘리지 않는다.

### 가로 스크롤 힌트 `[data-scroll-hint]`
넘칠 수 있는 가로 띠(폴더 칩 · 공정판 · 표)의 바깥 요소에 `data-scroll-hint`, 실제 스크롤 요소에 `data-scroll`(없으면 첫 자식). app.js가 `.is-overflow`/`.is-end`를 토글하고 base.css가 오른쪽 페이드 + 「›」를 그린다. 위치만 다르면 장면 CSS에서 `::after`의 top/bottom만 덮어쓴다.

### 그 밖의 유틸
`.stack`(세로 16px, `--tight` 8 · `--loose` 32) `.cluster`(가로 줄바꿈 12px) `.split`(양끝) `.grow` · 타이포 `.t-mast` `.t-h1` `.t-h2` `.t-h3` `.t-stat` `.t-latin` `.t-mono` `.t-line`(대사 800) `.t-cap` `.t-small` `.t-muted` `.t-danger` `.t-success` `.t-num` `.prose` · 아이콘 `.icon`(20) `.icon--lg`(24) `.icon--sm`(16) · `.vh`(시각적 숨김) · `.skip`.

---

## 4. 말풍선 문법 (S2 시그니처, base.css)

| 종류 | 클래스 | 쓰는 곳 |
|---|---|---|
| 대사 | `.balloon` + 꼬리 `--tail-b`(아래·왼) `--tail-br`(아래·오) `--tail-t`(위·왼) `--tail-tr`(위·오) `--tail-l`(왼쪽 화자) `--tail-r` | toast · tooltip · popover · 성공 alert · 인물 대사 |
| 외침 | `.balloon.balloon--shout` | 오류 alert · 위험 확인 · 폼 오류 요약 · 편집장 고함 |
| 생각 | `.balloon.balloon--think` (오른쪽 꼬리 `--think-r`) | 정보 alert · 빈 상태 · 도움말 |
| 속삭임 | `.balloon.balloon--whisper` | 보조 안내 · 비활성 이유 |
| 캡션 | `.caption` (`--corner` `--paper` `--pulp` `--block` `--lg`) | 섹션 시작 · breadcrumb · 단계 라벨 · 표 캡션 |

```html
<p class="balloon balloon--tail-b"><span class="balloon__who">팀장 문하늘</span>말풍선 꼬리는 말하는 사람을 가리켜야 해.</p>
<p class="balloon balloon--shout">펜선도 안 들어간 원고가 세 편이야! 쾅! 하고 끝내자!</p>
<p class="balloon balloon--think">……칼퇴 가능할까?</p>
<p class="balloon balloon--whisper">(인쇄소엔 비밀이야)</p>
```
- 꼬리 위치는 `style="--tail-x: 40px"`(아래/위 꼬리) · `--tail-y`(옆 꼬리, 기본 가운데)로 조정. 한 줄 대사는 `.balloon--oval`, 작은 풍선은 `.balloon--sm`, 블록 폭은 `.balloon--block`.
- 풍선은 다크에서도 흰 종이 + 먹 글자다(자동).

---

## 5. 컴포넌트 32

### accordion — 독자 FAQ
```html
<div class="acc" data-accordion="single">
  <div class="acc__item">
    <h3 class="acc__heading"><button class="acc__head" type="button" aria-expanded="true" aria-controls="faq-1">
      <span class="acc__q" aria-hidden="true">Q</span><span class="acc__title">정기구독 책은 언제 도착하나요?</span><span class="acc__sign" aria-hidden="true"></span>
    </button></h3>
    <div class="acc__panel" id="faq-1"><div class="acc__body"><p>…</p></div></div>
  </div>
</div>
```
`data-accordion="single"`이면 하나만 열림(생략 시 여러 개). 열림 = 머리 노랑 캡션 탭 + `−`, 펼침은 steps(3). 비활성 = `<button disabled>`(점선 칸).

### alert — 화자가 말하는 풍선
```html
<!-- 성공: 대사 풍선 + 빠밤! -->
<div class="alert alert--success" role="status">
  <span class="alert__who">교정부</span>
  <div class="alert__bubble balloon balloon--tail-l"><strong class="alert__title">「할머니는 레슬러」 교정 완료</strong><p class="alert__text"><span class="t-mono">KW-32-03</span> 18쪽이 가장 먼저 입고됐어요.</p></div>
  <span class="alert__sfx sfx sfx--sm" aria-hidden="true">빠밤!</span>
</div>
<!-- 정보: 생각 풍선 -->
<div class="alert alert--info" role="status"><span class="alert__who">시스템</span><div class="alert__bubble balloon balloon--think"><strong class="alert__title">…</strong><p class="alert__text">…</p></div></div>
<!-- 경고: 노랑 캡션 + 먹 ! (닫기 가능) -->
<div class="alert alert--warn alert--closable" role="status"><span class="alert__who">차보름</span><div class="alert__bubble"><strong class="alert__title">…</strong><p class="alert__text">…</p></div>
  <button class="alert__close" type="button" data-dismiss aria-label="알림 닫기"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>
<!-- 오류: 외침 풍선 -->
<div class="alert alert--error" role="alert"><span class="alert__who">편집장</span><div class="alert__bubble balloon balloon--shout"><strong class="alert__title">「심야 편의점 히어로」 마감 위험!</strong><p class="alert__text">…</p></div></div>
```
`alert__who`는 2~3자 화자명(편집장 · 교정부 · 시스템 · 차보름) 또는 작은 `svg.kd`. 화자 없이 쓰려면 `.alert--no-who`. `data-dismiss` = 「휙!」 하고 사라짐.

### badge — 각진 딱지
```html
<span class="badge badge--conti">콘티</span> <span class="badge badge--draft">밑그림</span> <span class="badge badge--pen">펜선</span>
<span class="badge badge--tone">톤·채색</span> <span class="badge badge--letter">식자</span>
<span class="badge badge--done"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12l5 5 9-10"/></svg>교정 완료</span>
<span class="badge badge--mono">KW-32-05</span> <span class="badge badge--count badge--red">89</span>
<span class="badge badge--red|--yellow|--cyan|--pink|--ink|--danger">…</span>
<span class="burst burst--sm">신연재</span> <span class="burst burst--sm burst--red">지연</span>
```
공정 6단계 색은 고정(DIRECTION 9절). 상태 점은 `<span class="dot-mark dot-mark--red"></span>`.

### breadcrumb — 캡션 이어붙이기
```html
<nav class="crumbs" aria-label="현재 위치"><ol>
  <li><a href="dashboard.html">편집실</a></li>
  <li><a href="kanban.html">12월호</a></li>
  <li><span aria-current="page" class="t-mono">KW-32-05</span></li>
</ol></nav>
```

### button
```html
<button class="btn btn--primary" type="button" data-sfx="착!">원고 저장</button>       <!-- 빨강판 · 1순위 -->
<button class="btn btn--secondary" type="button" data-sfx="슈욱!">인쇄소로 보내기</button> <!-- 노랑 -->
<button class="btn btn--ghost" type="button">임시 보관</button>                         <!-- 종이 + 먹선 -->
<button class="btn btn--danger" type="button" data-sfx="휙!">원고 반려</button>        <!-- 종이 + 빨강 글자 -->
<button class="btn btn--info">…</button> <button class="btn btn--ink">…</button>
<button class="btn btn--icon btn--ghost" type="button" aria-label="다음 컷"><svg class="icon" …/></button>
<button class="btn btn--primary" aria-busy="true" data-loading-text="두근두근">보내는 중</button>  <!-- 로딩 -->
<button class="btn btn--primary" disabled>밑그림 상태</button>                                 <!-- 비활성 = 논포토 점선 -->
<button class="btn btn--ghost" aria-pressed="true">마감 주 보기</button>                         <!-- 토글 선택 = 노랑 4px -->
```
크기 `--sm`(44px) 기본(48px) `--lg`(56px) `--block`. 묶음 `.btn-row`(간격) / `.btn-group`(붙임). hover = **라벨 아래 10px 띠에만** 망점 20% + 1px 위(망점 위에 글자를 올리지 않는다). 상태표 같은 정적 견본은 `.is-hover` / `.is-pressed`, active = scale .96 + `data-sfx` 효과음. 효과음 단어 사전: 저장 「착!」 · 삭제 「휙!」 · 전송 「슈욱!」 · 오류 「쾅!」 · 완료 「빠밤!」 · 알림 「띵!」 · 드래그 놓기 「툭!」 · 새로고침 「휘리릭」 · 로딩 「두근두근」. `data-loading-demo="완료 메시지"`를 붙이면 1.6초 로딩 후 「빠밤!」 토스트(시연용).

### calendar — 7×N 규칙 컷
```html
<div class="cal" data-calendar>
  <div class="cal__head"><h3 class="cal__title">2026년 10월</h3>
    <div class="cal__nav"><button class="btn btn--icon btn--ghost" type="button" aria-label="이전 달">…</button><button class="btn btn--icon btn--ghost" type="button" aria-label="다음 달">…</button></div></div>
  <table class="cal__grid">
    <thead><tr><th scope="col">일</th><th scope="col">월</th>…<th scope="col">토</th></tr></thead>
    <tbody><tr>
      <td><button class="cal__day is-out" type="button" disabled><span class="cal__num">27</span></button></td>
      <td><button class="cal__day is-sun" type="button" data-date="10월 18일 일요일"><span class="cal__num">18</span></button></td>
      <td><button class="cal__day" type="button" aria-current="date" data-date="10월 21일 수요일"><span class="cal__num">21</span></button></td>
      <td><button class="cal__day" type="button" data-date="10월 27일 화요일"><span class="cal__num">27</span><span class="cal__ev cal__ev--deadline" data-full="12월호 원고 마감 18:00">원고 마감</span></button></td>
      <td><button class="cal__day" type="button"><span class="cal__num">30</span><span class="cal__ev cal__ev--print">인쇄 입고</span></button></td>
      <td><button class="cal__day" type="button"><span class="cal__num">13</span><span class="cal__ev cal__ev--release burst burst--sm">발매</span></button></td>
    </tr></tbody>
  </table>
  <p class="t-small" data-cal-output aria-live="polite">날짜를 누르면 일정이 나와요.</p>
</div>
```
2026년 10월 1일 = **목요일**(첫 줄은 9/27~9/30 `is-out`). 오늘 10/21(수) = `aria-current="date"`(먹선 4px + 「오늘」). 일정 `cal__ev--deadline`(빨강) `--print`(사이안) `--event`(살색: 사인회) 기본(종이) `--release`(노랑 별). 선택 = `aria-pressed`(노랑). 화살표·Home·End·Enter 지원. 모바일은 일정이 색 띠로 줄어든다.

### 차례 미니 컷 `.nx` (card.css) — "다음 화에 계속" 목차 (index p.11 · 404)
아이콘 카드 그리드 금지. 링크 하나 = 그 페이지의 대표 구도를 줄인 미니 컷 + 이름 + 한 줄 예고. 크기가 위계: 스플래시 1 + 중간 2 + 작은 6, 행 72px · dense.
```html
<nav class="panels panels--frame dots dots-20 dots--red nx" aria-label="다음 화">
  <a class="cut span-6 rows-4 nx__cut nx__cut--splash" href="pages/dashboard.html"><span class="nx__art nx-art--due" aria-hidden="true"><span class="nx-due__d">D-6</span></span><span class="nx__name">마감 상황판</span><span class="nx__teaser">…</span></a>
  <a class="cut span-6 rows-2 nx__cut nx__cut--mid" href="pages/kanban.html"><span class="nx__art nx-art--board" aria-hidden="true"><span class="nx-board__col"><i class="is-late"></i></span>…×6</span>…</a>
  <a class="cut span-2 rows-2 nx__cut" href="pages/inbox.html"><span class="nx__art nx-art--card" aria-hidden="true"><span class="nx-post"></span></span>…</a>
</nav>
<p class="caption caption--lg caption--paper nx-next">다음 화 예고 — 12월호 11/13(금) 발매. 골목대장 쾅, 드디어 결승전!</p>
```
미니 구도: `--due`(D-6 레터링) `--cover`(표지 마스트) `--board`(6열 먹선) `--book`(단행본 표지) `--card`(엽서) `--dots`(망점 강도 3칸, `.nx-dot--10|20|40`) `--four`(4컷) `--price`(버스트) `--vote`(1위 도장) `--rest`(집중선, `.nx__cut--rest`). 모바일은 2열(스플래시 · 중간은 전폭). 바로 아래 푸터는 `.foot--slim`.

### card — 컷
```html
<a class="card span-4 rows-5" href="profile.html">
  <span class="caption card__cap">인기투표 1위</span>
  <div class="card__body"><h3 class="card__title">골목대장 쾅</h3><p class="card__meta"><span>윤바람</span><span class="t-mono">1,184표</span></p><p class="card__text">12월호 32화 「결승전」. 24쪽.</p></div>
  <div class="card__foot"><span class="badge badge--letter">식자</span><span class="t-mono">KW-32-01</span></div>
</a>
<div class="card card--caption"><div class="card__body"><span class="t-small">정기구독자</span><span class="card__stat">6,212</span><span class="t-small t-muted">전월 대비 +184</span></div></div>
```
요소 `card__cap` `card__art`(그림 칸) `card__body` `card__title`(Kirang) `card__title--plain`(본문 800) `card__meta` `card__text` `card__stat`(Bangers 숫자) `card__foot` `card__no`. 면 `--pulp --caption --accent --info`. 크기: 지면 안에서는 `span-N rows-N`, 밖에서는 `--s/--m/--l`(L은 4px). 상태 `aria-selected`/`aria-pressed`/`.is-selected`(4px + 노랑 탭) · `.is-draft`(점선) · `aria-busy`. 지면 밖 묶음은 `.card-grid`.

### carousel — 컷 넘김
```html
<div class="carousel" data-carousel aria-label="지난 호 표지">
  <div class="carousel__viewport">
    <div class="carousel__flash" aria-hidden="true"></div>
    <div class="carousel__track">
      <div class="carousel__slide">…11월호 표지 (CSS/SVG)…</div>
      <div class="carousel__slide">…</div>
    </div>
  </div>
  <div class="carousel__bar">
    <button class="carousel__btn" type="button" data-carousel-prev aria-label="앞 컷"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg></button>
    <div class="carousel__count"><span><span data-carousel-current>1</span> / <span data-carousel-total>7</span></span>
      <span class="carousel__dots"><button class="carousel__dot" type="button" aria-label="1쪽"></button>…</span></div>
    <button class="carousel__btn" type="button" data-carousel-next aria-label="다음 컷"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg></button>
  </div>
  <p class="vh" aria-live="polite" data-carousel-live></p>
</div>
```
`data-carousel-loop`를 붙이면 끝에서 처음으로 돈다(없으면 양끝 버튼 비활성). ←→ 키 · 스와이프 지원.

### code — 원고 사양 쪽지
```html
<div class="code">
  <div class="code__head"><span class="caption">식자 규격 · CSS</span>
    <button class="code__copy" type="button" data-copy="code-cut"><span data-copy-label>복사</span></button></div>
  <pre class="code__pre" tabindex="0"><code id="code-cut"><span class="tk-s">.cut</span> {
  <span class="tk-k">border</span>: <span class="tk-v">var(--line-w)</span> solid <span class="tk-v">var(--line)</span>;
  <span class="tk-c">/* 컷에는 그림자가 없다 */</span>
}</code></pre>
</div>
```
토큰 색 `tk-k`(키·속성 노랑) `tk-v`(값 사이안) `tk-s`(선택자·문자열 살색) `tk-c`(주석) `tk-n`. 인라인 코드는 `<code class="code-inline">`. `data-copy`는 요소 id 또는 복사할 글자 그대로.

### command — 편집장 호출
셸 2-7 참고. index에 **열린 상태 정적 견본**을 둘 때는 `class="cmdk cmdk--static"`(hidden 없음, `.cmdk__scrim` 생략, `.cmdk__panel`은 `role="group" aria-label="편집장 호출 견본"`)으로 그 자리에 렌더하고, 옆에 실제로 여는 버튼 `<button class="btn btn--ink" type="button" data-command-open>편집장 호출 <kbd>⌘K</kbd></button>`을 함께 둔다. 정적 견본의 항목 하나에 `aria-selected="true"`.

### drawer — 세로 긴 컷 (원고 상세)
```html
<button class="btn btn--ghost" type="button" data-open="manuscript-0105" aria-expanded="false" aria-controls="manuscript-0105">원고 상세</button>
<div class="drawer" id="manuscript-0105" hidden>
  <div class="drawer__scrim" data-close></div>
  <div class="drawer__panel" role="dialog" aria-modal="true" aria-labelledby="ms-title">
    <div class="drawer__head"><span class="caption">원고 상세</span><button class="drawer__close" type="button" data-close aria-label="닫기"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>
    <h2 class="drawer__title" id="ms-title">심야 편의점 히어로</h2>
    <div class="drawer__body"><dl class="drawer__rows"><dt>원고 ID</dt><dd class="t-mono">KW-32-05</dd><dt>작가</dt><dd>정새벽</dd>…</dl></div>
    <div class="drawer__foot"><button class="btn btn--ghost" type="button" data-close>닫기</button><button class="btn btn--primary" type="button" data-sfx="띵!">독촉 보내기</button></div>
  </div>
</div>
```
오른쪽에서 들어옴(왼쪽은 `.drawer--left`). 정적 견본: `class="drawer drawer--static"`(hidden 없음, panel `role="group"`), 높이는 장면이 정한다(기본 최소 420px).

### empty — 빈 컷 + 쾅돌이 + 생각 풍선
```html
<div class="empty">
  <div class="empty__art"><svg class="kd" …>…</svg></div>
  <p class="empty__think balloon balloon--think" aria-hidden="true">……</p>
  <div class="empty__body"><p class="empty__title">미답장 엽서가 없어요</p><p class="empty__text">오늘은 칼퇴!</p><a class="btn btn--secondary btn--sm" href="inbox.html">지난 엽서 보기</a></div>
</div>
```
변형 `--compact` `--center`. 행동 버튼은 하나만.

### form
```html
<form class="stack" data-validate data-success="배송지를 바꿨어요." data-success-sfx="착!">
  <div class="form-errors balloon balloon--shout" hidden><strong>두 칸을 다시 봐 주세요!</strong><ul></ul></div>
  <div class="field">
    <label class="field__label" for="ship-name">받는 분 <span class="req" aria-hidden="true">*</span></label>
    <input class="input" id="ship-name" name="name" required autocomplete="name">
    <p class="field__hint">택배 상자에 적힐 이름이에요.</p>
    <!-- 오류 시 app.js가 <p class="field__error">를 만들고 aria-invalid · aria-describedby를 건다 -->
  </div>
  <div class="field"><label class="field__label" for="rd">독자 번호</label><input class="input input--mono" id="rd" value="RD-104823" readonly></div>
  <div class="input-group"><span class="input-group__addon">₩</span><input class="input input--mono" …></div>
  <div class="search"><svg class="icon" …/><input class="input" type="search" aria-label="엽서 찾기"></div>
  <select class="select">…</select> <textarea class="textarea">…</textarea>
  <label class="check"><input type="checkbox" checked>마감 알림 받기</label>
  <label class="radio"><input type="radio" name="ch" checked>문자</label>
  <button class="switch" type="button" role="switch" aria-checked="true"><span class="switch__track" aria-hidden="true"></span>효과음 모션</button>
  <div class="seg" role="radiogroup" aria-label="말풍선 글자 크기"><label><input type="radio" name="fs"><span>16px</span></label><label><input type="radio" name="fs" checked><span>17px</span></label><label><input type="radio" name="fs"><span>19px</span></label></div>
  <label class="choice"><input type="radio" name="plan" value="12m" checked><span>…플랜 카드 내용…</span></label>
  <input class="range" type="range" min="0" max="60" step="10" value="20" data-output="dot-out" data-unit="%"> <output id="dot-out"></output>
  <fieldset class="fieldset"><legend>배송지</legend>…</fieldset>
  <div class="form-grid"><div class="field">…</div><div class="field full">…</div></div>
  <button class="btn btn--primary" type="submit">저장</button>
</form>
```
- `data-validate`: 제출 시 `required` `type=email` `pattern`(+`data-pattern-msg`) `minlength` `min/max` 검사 → 필드 아래 **작은 외침 풍선**(`.field__error`) + 요약(`.form-errors`, 있으면) + 「쾅!」. 통과하면 버튼 「두근두근」 0.9초 → `data-success` 토스트(「착!」). 이름은 라벨 글자 또는 `data-name`, 메시지 직접 지정은 `data-msg`.
- 정적 오류 견본: `<input … aria-invalid="true" aria-describedby="e1"><p class="field__error" id="e1">받는 분을 적어 주세요.</p>`.
- 입력 높이 48px, 비활성 = 논포토 점선, 읽기 전용 = 누런 면, focus = 먹 실선 + 노랑 링.

### kanban — 제작 공정 6열
```html
<div class="kanban" data-kanban aria-label="12월호 원고 공정판">
  <section class="kanban__col" data-stage="콘티" aria-labelledby="col-conti">
    <div class="kanban__head kanban__head--conti"><span class="caption" id="col-conti">콘티 <span class="kanban__count">1</span></span><span class="t-small t-muted">차보름</span></div>
    <ul class="kanban__list">
      <li class="kanban__card is-late" id="card-KW-32-07">
        <div class="kanban__top"><span class="kanban__id">KW-32-07</span>
          <div class="menu kanban__menu"><button class="btn btn--icon btn--ghost menu__trigger" type="button" data-menu="m-0107" aria-haspopup="menu" aria-expanded="false" aria-label="KW-32-07 원고 메뉴"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h.01M12 12h.01M19 12h.01"/></svg></button>
            <ul class="menu__list menu__list--end" id="m-0107" role="menu" hidden>
              <li role="none"><button class="menu__item" role="menuitem" type="button" data-move="next">다음 공정으로</button></li>
              <li role="none"><button class="menu__item" role="menuitem" type="button" data-move="prev">앞 공정으로</button></li>
            </ul></div></div>
        <p class="kanban__title">분식왕 떡순이</p>
        <p class="kanban__meta"><span>서단비</span><span class="t-mono">16쪽</span></p>
        <div class="prog prog--sm"><div class="prog__top"><span class="prog__name">공정</span><span class="prog__label">1/6단계</span></div><div class="prog__bar" role="progressbar" aria-valuenow="1" aria-valuemin="0" aria-valuemax="6" aria-label="공정 1/6단계 콘티"><span class="prog__fill" style="--val:16.7%"></span></div></div>  <!-- 선택: 진척은 '공정 n/6단계'만(팩트 시트에 쪽 단위 진척이 없다) -->
        <span class="kanban__late burst burst--sm burst--red">지연</span>
      </li>
      <li class="kanban__empty" hidden>비어 있음</li>
    </ul>
  </section>
  <!-- 밑그림(--draft) · 펜선(--pen) · 톤·채색(--tone) · 식자(--letter) · 교정 완료(--done) 순서 고정 -->
</div>
```
열 최소폭 156px(앱 셸 1440에서 가로 스크롤 없이 6열). 지연 버스트 `.kanban__late`는 카드 **오른쪽 아래**로 튀어나온다(오른쪽 위 ⋯ 메뉴를 덮지 않게, 카드에 아래 여백 자동). 드래그 놓기 = 「툭!」 + 매수 갱신 + `aria-live` 안내. 키보드 = 카드 메뉴 `data-move="next|prev"`. 이동 시 `kw:kanban-move` 이벤트. 원고 9편 배치는 팩트 시트 표 그대로(콘티1 · 밑그림1 · 펜선1 · 톤·채색2 · 식자2 · 교정 완료2).

### list — 컷 칸막이 리스트
```html
<ul class="list list--pulp">
  <li class="list__item is-unread"><span class="list__no">088</span>
    <div class="list__main"><a class="list__link" href="inbox.html#PC-1021-088"><span class="list__title">할머니는 레슬러 단행본은 언제 나와요?</span></a><span class="list__sub"><span class="t-mono">PC-1021-088</span> · 우편 · 10/21</span></div>
    <div class="list__end"><span class="badge badge--yellow">미답장</span></div></li>
</ul>
```
행 전체 클릭 = `list__link`(가상 덮개). 선택 = 링크에 `aria-current="true"` 또는 행 `.is-selected`(노랑), 안 읽음 `.is-unread`(빨강 점), 흐림 `.is-muted`. 테두리 없이 `.list--bare`.

### marquee — 셸 2-3. 먹 띠 변형 `.marquee--ink`.

### menu
```html
<div class="menu">
  <button class="btn btn--ghost menu__trigger" type="button" data-menu="m-sort" aria-haspopup="menu" aria-expanded="false">정렬</button>
  <ul class="menu__list" id="m-sort" role="menu" hidden>
    <li class="menu__label" role="presentation">원고 정렬</li>
    <li role="none"><button class="menu__item" role="menuitemradio" aria-checked="true" type="button">마감 임박 순</button></li>
    <li class="menu__sep" role="separator"></li>
    <li role="none"><button class="menu__item menu__item--danger" role="menuitem" type="button" data-sfx="휙!">원고 반려</button></li>
  </ul>
</div>
```
오른쪽 정렬 `menu__list--end`(넘치면 자동). ↑↓ Home End Esc, Tab이면 닫힘. 체크형 `menuitemcheckbox`, 라디오형 `menuitemradio`. 정적 견본 `menu__list--static`(hidden 없음, 트리거 `aria-expanded="true"`).

### modal — 스플래시 컷
```html
<button class="btn btn--danger" type="button" data-open="reject-3204" aria-expanded="false">원고 반려</button>
<div class="modal" id="reject-3204" hidden>
  <div class="modal__scrim" data-close></div>
  <div class="modal__lines" aria-hidden="true"></div>
  <div class="modal__box" role="dialog" aria-modal="true" aria-labelledby="rj-title">
    <div class="modal__head"><span class="caption">원고 반려</span><button class="modal__close" type="button" data-close aria-label="닫기"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>
    <h2 class="modal__title" id="rj-title">이 원고를 밑그림으로 돌려보낼까?</h2>
    <div class="modal__body"><p><span class="t-mono">KW-32-04</span> 옥상 탐정단 · 지금 펜선 단계. 작가 한다온에게 알림이 갑니다.</p></div>
    <div class="modal__foot"><button class="btn btn--ghost" type="button" data-close>취소</button><button class="btn btn--primary" type="button" data-close data-sfx="휙!" data-autofocus>돌려보내기</button></div>
  </div>
</div>
```
반려는 항상 **한 단계 앞 공정**으로 돌려보낸다(펜선 → 밑그림). 대상 원고의 현재 공정은 DIRECTION 팩트 시트 원장을 따른다. 위험 확인은 `.modal--danger` + 제목 위 `<p class="modal__shout balloon balloon--shout">정말?!</p>`. 넓은 판 `.modal--lg`. 정적 견본 `class="modal modal--static"`(hidden 없음, box `role="group"`). 포커스 트랩 · Esc · 바깥(망점) 클릭 닫기 · 트리거로 포커스 복귀는 app.js.

### motion — 효과음 사전 + 모션 토큰
```html
<div class="sfx-dict">
  <button class="sfx-dict__btn" type="button" data-sfx="착!"><span class="sfx-dict__word" aria-hidden="true">착!</span><span class="sfx-dict__when">저장</span></button>
  …휙!(삭제) 슈욱!(전송) 쾅!(오류) 빠밤!(완료) 띵!(알림) 툭!(드래그 놓기)…
</div>
<table class="motion-table"><thead><tr><th>토큰</th><th>값</th><th>쓰임</th></tr></thead><tbody><tr><td>--ease-pop</td><td>cubic-bezier(.2, 1.6, .4, 1)</td><td>풍선 · 배지 · 효과음이 튀어나옴</td></tr>…</tbody></table>
<div class="motion-demo" id="md-1">
  <div class="motion-demo__lane" data-ease="pop"><span class="motion-demo__puck"></span><span class="motion-demo__label">--ease-pop</span></div>
  <div class="motion-demo__lane" data-ease="cut"><span class="motion-demo__puck"></span><span class="motion-demo__label">--ease-cut</span></div>
  <div class="motion-demo__lane" data-ease="out"><span class="motion-demo__puck"></span><span class="motion-demo__label">--ease-out</span></div>
</div>
<button class="btn btn--ink" type="button" data-motion-run="md-1">움직여 보기</button>
```
`data-sfx="단어"`를 붙인 아무 요소나 누르면 그 자리에서 효과음이 터진다. 스크립트에서는 `KW.sfx(요소, '빠밤!')`.

### navbar — 셸 2-2. 푸터는 2-5(`.foot`).

### pagination
```html
<nav class="pager" aria-label="엽서 쪽" data-pager>
  <a class="pager__item pager__item--nav" href="inbox.html?p=2" aria-label="앞 쪽"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg></a>
  <a class="pager__item" href="inbox.html?p=1">1</a>
  <a class="pager__item" href="inbox.html?p=3" aria-current="page">3</a>
  <span class="pager__gap" aria-hidden="true">…</span>
  <a class="pager__item" href="inbox.html?p=12">12</a>
  <a class="pager__item pager__item--nav" href="inbox.html?p=4" aria-label="다음 쪽"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg></a>
  <span class="pager__info t-mono">1,284통 중 25–36</span>
</nav>
```
시연용 버튼형: `<button class="pager__item" type="button" data-page="3">` + `data-page-prev`/`data-page-next`(app.js가 현재 쪽 이동). 모바일에서 멀리 있는 쪽은 `.is-far`로 숨김. 비활성 = `aria-disabled="true"`. 쪽 번호 숫자는 **Martian Mono 700 · 15px**(Bangers 금지: `107`이 `101`로 읽힌다). 마지막 쪽은 실제 계산값(엽서 1,284통 ÷ 12 = `107`, ÷ 5 = `257`).

### popover — 대사 풍선
```html
<span class="pop">
  <button class="pop__trigger" type="button" data-popover="pop-yoon" aria-expanded="false" aria-controls="pop-yoon">윤바람</button>
  <div class="popover balloon balloon--tail-t" id="pop-yoon" role="dialog" aria-label="작가 정보" hidden>
    <strong class="popover__title">윤바람 작가</strong>
    <p class="popover__meta">「골목대장 쾅」 · 11월호 인기투표 1위 <span class="t-mono">1,184</span>표</p>
    <dl class="popover__rows"><dt>사인회</dt><dd>10/24(토) 14:00 · 「컷」</dd></dl>
    <div class="popover__actions"><a class="btn btn--sm btn--secondary" href="profile.html">작가 페이지</a></div>
  </div>
</span>
```
**문장 안 인라인 트리거**(`<p>` 안)에서는 div · dl을 쓸 수 없으니 `<span class="popover …">` + `<span class="popover__rows"><span>사인회</span><span>10/24(토)</span></span>`처럼 span으로 쓴다(`.popover__rows`는 grid라 그대로 동작). 폭 280px. 오른쪽으로 넘치면 app.js가 `popover--end` + `balloon--tail-tr`로 뒤집는다. 정적 견본 `popover popover--static`(hidden 없음, 트리거 `aria-expanded="true"`).

### progress — 망점 진척 바
```html
<div class="prog">
  <div class="prog__top"><span class="prog__name">골목대장 쾅 · 식자</span><span class="prog__label">18/24쪽</span></div>
  <div class="prog__bar" role="progressbar" aria-valuenow="18" aria-valuemin="0" aria-valuemax="24" aria-label="골목대장 쾅 진척"><span class="prog__fill" style="--val:75%"></span></div>
</div>
```
색 `--cyan --yellow --ink --done`, 얇게 `--sm`, 지연 표시 `--late`, 값 모름 `--busy`. 공정 분포 막대: `<div class="prog-stack"><span class="badge--conti" style="--n:1">콘티 1</span>…</div>`(각 칸에 badge 색 클래스 + `--n`=매수). 원형 진척은 쓰지 않는다.

### sidebar — 셸 2-4. settings의 세로 탭으로 쓸 때는 5절 tabs의 `.tabs--vertical`을 쓴다.

### skeleton — 밑그림
```html
<div class="sk-cut" aria-busy="true" aria-label="원고 불러오는 중">
  <span class="sk-cut__note">밑그림 중……</span>
  <div class="sk-row"><span class="sk sk--square"></span><div class="sk-group"><span class="sk sk--title"></span><span class="sk sk--line w-80"></span><span class="sk sk--line w-60"></span></div></div>
</div>
```
조각 `sk--title --line(.w-80/.w-60/.w-40) --block --square --btn`. 회색 블록·깜빡임 금지(논포토 연필 해칭이 그려진다).

### spinner
```html
<span class="spin" role="status"><span class="spin__word" aria-hidden="true">두근두근</span><span class="spin__text">원고 받는 중</span></span>
<span class="spin" role="status"><span class="spin__dots" aria-hidden="true"><i></i><i></i><i></i></span><span class="vh">불러오는 중</span></span>
```
큰 글자 `spin__word--lg`. 회전 원형 스피너 금지.

### steps — 컷 번호 띠
```html
<ol class="steps" aria-label="정기구독 단계">
  <li class="steps__item is-done"><span class="steps__no"></span><span class="steps__label">고르기<span class="steps__sub">12개월 ₩66,000</span></span></li>
  <li class="steps__item" aria-current="step"><span class="steps__no"></span><span class="steps__label">받는 곳</span></li>
  <li class="steps__item"><span class="steps__no"></span><span class="steps__label">좋아하는 연재</span></li>
  <li class="steps__item"><span class="steps__no"></span><span class="steps__label">결제</span></li>
</ol>
```
번호는 CSS 카운터가 넣는다. 끝난 단계 = 먹 면 + 체크, 현재 = 노랑 4px, 오류 `.is-error`, 잠김 `aria-disabled`. 링크로 쓰려면 `li` 안 대신 `a.steps__item`. 모바일은 현재 단계만 이름이 보인다(나머지 이름은 시각적으로 숨김).

### table — 가로 긴 컷 안의 먹선 칸
```html
<div class="tbl-cut">
  <div class="tbl-cut__head"><span class="caption">12월호 원고 원장 · 10/21(수) 16:40 기준</span><div class="tbl-cut__tools"><span class="t-small t-muted" data-select-count>선택 없음</span></div></div>
  <div class="tbl-scroll" tabindex="0" role="region" aria-label="원고 원장">
    <table class="tbl tbl--stack" data-sortable>
      <thead><tr>
        <th class="sel" scope="col"><label class="check"><input type="checkbox" data-select-all aria-label="전체 선택"></label></th>
        <th scope="col" aria-sort="ascending"><button class="tbl__sort" type="button">원고 ID</button></th>
        <th scope="col"><button class="tbl__sort" type="button">작품</button></th>
        <th scope="col">작가</th>
        <th scope="col" class="num"><button class="tbl__sort" type="button">쪽수</button></th>
        <th scope="col">공정</th>
      </tr></thead>
      <tbody>
        <tr class="is-late"><td class="sel"><label class="check"><input type="checkbox" data-select-row aria-label="KW-32-05 선택"></label></td>
          <td class="id" data-label="원고 ID">KW-32-05</td><td data-label="작품">심야 편의점 히어로</td><td data-label="작가">정새벽</td>
          <td class="num" data-label="쪽수">20</td><td data-label="공정"><span class="badge badge--draft">밑그림</span></td></tr>
      </tbody>
      <tfoot><tr><th scope="row" colspan="4">연재 합계</th><td class="num" data-unit="쪽">152</td><td></td></tr></tfoot>
    </table>
  </div>
  <div class="tbl-cut__foot"><span>연재 9편 · 152쪽</span><!-- pagination --></div>
  <p class="vh" aria-live="polite" data-sort-live></p>
</div>
```
- 정렬: `table[data-sortable]` + 머리 `button.tbl__sort` → `aria-sort` 토글(숫자·₩·쪽은 숫자로 비교, 값이 다르면 `td[data-sort]`).
- 선택: `data-select-all` / `data-select-row` → 행 `aria-selected="true"`(살색 망점 + 왼쪽 6px 빨강 띠), 개수는 `[data-select-count]`.
- 셀 `.num`(오른쪽 Martian Mono) `.id` `.sel` `.act`. 행 `.is-late`(ID 빨강) `.is-muted`.
- `.tbl--stack`이면 `<720px`에서 행이 작은 컷 카드로 쌓인다 → **모든 td에 `data-label`** 필수(라벨 열 104px 고정). 아니면 `.tbl-scroll`이 가로 스크롤. 합계 행(tfoot)은 모바일에서 한 줄 flex(`td[data-unit]`이면 단위가 붙는다).
- `.tbl--stack.tbl--compact` = 행 카드를 **2줄로 압축**(라벨 없음): 1줄 [`td.id` · `.tbl__main` · `.tbl__tag`], 2줄 [`.tbl__sub` · `td.num`]. 8행 이상 원장은 이쪽을 쓴다.

### tabs — 작은 컷 줄
```html
<div class="tabs" data-tabs>
  <div class="tabs__bar">
    <div class="tabs__list" role="tablist" aria-label="원고 보기">
      <button class="tabs__tab" role="tab" type="button" id="tab-all" aria-selected="true" aria-controls="panel-all">전체 9편</button>
      <button class="tabs__tab" role="tab" type="button" id="tab-late" aria-selected="false" aria-controls="panel-late">지연 <span class="badge badge--red">2</span></button>
    </div>
  </div>
  <div class="tabs__panel" id="panel-all">…</div>
  <div class="tabs__panel" id="panel-late" hidden>…</div>
</div>
```
←→ Home End(자동 활성), 전환 = 컷이 steps(3)로 펼쳐지며 집중선 번쩍. 넘치면 오른쪽 페이드 + 「›」 힌트(`.tabs__bar`가 자동 처리). 세로 탭(settings): `.tabs.tabs--vertical` + tablist에 `aria-orientation="vertical"`(모바일에서 가로로 바뀜). 비활성 탭 `aria-disabled="true"`.

### timeline — 제작 공정 세로 띠
```html
<ol class="tl">
  <li class="tl__item is-done"><time class="tl__time" datetime="2026-10-12T11:20"><b>10/12</b>11:20</time><span class="tl__mark" aria-hidden="true"></span>
    <div class="tl__body"><span class="caption">콘티 승인</span><p class="tl__who">차보름</p></div></li>
  <li class="tl__item is-done"><time class="tl__time" datetime="2026-10-19T10:05"><b>10/19</b>10:05</time><span class="tl__mark" aria-hidden="true"></span>
    <div class="tl__body"><span class="caption">밑그림 시작</span><p class="tl__who">정새벽</p></div></li>
  <li class="tl__item is-now"><time class="tl__time" datetime="2026-10-21T16:40"><b>10/21</b>16:40</time><span class="tl__mark" aria-hidden="true"></span>
    <div class="tl__body"><span class="caption">밑그림 14쪽까지</span><p class="balloon balloon--tail-l tl__line"><span class="balloon__who">작가 정새벽</span>목요일까지 펜선 들어갑니다!</p></div></li>
  <li class="tl__item is-next"><time class="tl__time" datetime="2026-10-27T18:00"><b>10/27</b>18:00</time><span class="tl__mark" aria-hidden="true"></span>
    <div class="tl__body"><span class="caption">원고 마감</span></div></li>
  <li class="tl__item is-next"><time class="tl__time" datetime="2026-10-30T10:00"><b>10/30</b>10:00</time><span class="tl__mark" aria-hidden="true"></span>
    <div class="tl__body"><span class="caption">인쇄소 입고 · 파주 한빛 오프셋</span></div></li>
</ol>
```
상태 `is-done`(먹 칸) `is-now`(빨강 칸 4px) `is-next`(점선).

### toast
스크립트: `KW.toast({ who: '쾅! 편집실', text: '설정을 저장했어요.', sfx: '착!', tone: 'success' })` (`tone`: success | error | 생략). 버튼: `<button class="btn btn--ghost" type="button" data-toast="KW-32-03 교정 완료 처리했어요." data-toast-who="교정부" data-toast-sfx="빠밤!">…</button>`. 3.6초 후 쏙(마우스·포커스가 올라가면 멈춤), 최대 3개.
정적 견본:
```html
<div class="toasts toasts--static">
  <div class="toast toast--static balloon balloon--tail-br" role="status"><span class="toast__who">쾅! 편집실</span><p class="toast__text">설정을 저장했어요.</p>
    <button class="toast__close" type="button" aria-label="닫기"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button>
    <span class="toast__sfx sfx sfx--sm" aria-hidden="true">착!</span></div>
</div>
```

### tooltip — 작은 대사 풍선
```html
<span class="tip">
  <button class="btn btn--icon btn--ghost" type="button" aria-label="교정 완료로 표시" aria-describedby="tip-done"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12l5 5 9-10"/></svg></button>
  <span class="tip__bubble" role="tooltip" id="tip-done">교정 완료로 표시</span>
</span>
```
hover · focus로 위에 뜬다. 아래로 `.tip--below`, 왼쪽 정렬 `.tip--start`, 정적 견본 `.tip--open`. Esc로 숨김.

---

## 6. 아이콘 path 모음 (viewBox 0 0 24 24, `class="icon"`)

| 이름 | path |
|---|---|
| 찾기 | `<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/>` |
| 달(밤으로) | `<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>` |
| 해(낮으로) | `<circle cx="12" cy="12" r="4.5"/><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8"/>` |
| 메뉴 | `<path d="M4 6h16M4 12h16M4 18h16"/>` |
| 닫기 | `<path d="M6 6l12 12M18 6L6 18"/>` |
| 왼쪽 / 오른쪽 | `<path d="M15 6l-6 6 6 6"/>` / `<path d="M9 6l6 6-6 6"/>` |
| 아래 | `<path d="M6 9l6 6 6-6"/>` |
| 체크 | `<path d="M5 12l5 5 9-10"/>` |
| 더하기 | `<path d="M12 5v14M5 12h14"/>` |
| 더보기 | `<path d="M5 12h.01M12 12h.01M19 12h.01"/>` (stroke 3.5 권장) |
| 상황판 | `<path d="M4 4h7v9H4zM13 4h7v5h-7zM13 11h7v9h-7zM4 15h7v5H4z"/>` |
| 공정판 | `<path d="M4 4h4v16H4zM10 4h4v11h-4zM16 4h4v7h-4z"/>` |
| 엽서·메일 | `<path d="M4 7h16v12H4zM4 7l8 6 8-6"/>` |
| 설정 | `<circle cx="12" cy="12" r="3"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"/>` |
| 원고(문서) | `<path d="M5 4h11l3 3v13H5zM9 9h6M9 13h6M9 17h4"/>` |
| 달력 | `<path d="M4 6h16v14H4zM4 10h16M8 3v5M16 3v5"/>` |
| 책 | `<path d="M4 5h7a2 2 0 0 1 2 2v13H6a2 2 0 0 1-2-2zM20 5h-5a2 2 0 0 0-2 2v13h7z"/>` |
| 사람 | `<circle cx="12" cy="8" r="4"/><path d="M4 21c1-4.5 4-6.5 8-6.5s7 2 8 6.5"/>` |
| 종(알림) | `<path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4zM10 21h4"/>` |
| 복사 | `<path d="M8 8h11v12H8zM5 16V4h11"/>` |
| 장바구니 | `<path d="M3 4h3l2 11h11l2-8H7M9 20h.01M18 20h.01"/>` |
| 번개 | `<path d="M13 2L5 14h6l-1 8 8-12h-6z"/>` |
| 일시정지 / 재생 | `<path d="M8 5v14M16 5v14"/>` / `<path d="M7 5l12 7-12 7z"/>` |

---

## 7. app.js 동작 요약 (데이터 속성 계약)

| 속성 · 클래스 | 동작 |
|---|---|
| `[data-theme-toggle]` | 낮/밤 전환 + 저장. `aria-pressed`, `aria-label`(낮/밤 장면으로 바꾸기) 자동. 안의 `[data-theme-label]`은 「불 끄기/불 켜기」 |
| `[data-sfx="착!"]` | 누르면 그 위에 효과음이 떴다 사라짐(reduced-motion이면 생략) |
| `[data-open="id"]` / `[data-close]` | 모달 · 드로어 · 커맨드 열기/닫기 (포커스 트랩, Esc, 스크롤 잠금, 포커스 복귀). 첫 포커스는 `[data-autofocus]` |
| `[data-command-open]`, ⌘K / Ctrl+K | 편집장 호출. 항목 `data-href` / `data-action` / `data-keywords` |
| `[data-popover="id"]` | 팝오버 토글(바깥 클릭·Esc 닫기, 오른쪽 넘치면 뒤집기) |
| `[data-menu="id"]` | 메뉴 토글(↑↓ Home End, 항목 클릭 시 닫힘, `data-keep-open`이면 유지) |
| `[data-tabs]` | 탭 |
| `[data-accordion]` / `="single"` | 아코디언 |
| `[data-toast]` + `data-toast-who/-sfx/-tone`, `KW.toast()` | 토스트 |
| `[data-carousel]` (+ `data-carousel-loop`) | 캐러셀 |
| `table[data-sortable]`, `[data-select-all]` `[data-select-row]` `[data-select-count]` | 표 정렬 · 선택 |
| `[data-calendar]` + `[data-cal-output]` | 날짜 선택 · 화살표 이동 · 일정 출력 |
| `[data-kanban]` + `[data-move]` | 칸반 드래그 · 키보드 이동 · 「툭!」 |
| `form[data-validate]` (+ `data-success` `data-success-who` `data-success-sfx`) | 폼 검증 · 외침 풍선 오류 · 성공 토스트 |
| `[data-marquee-toggle]` | 예고 띠 정지/재생 |
| `[data-copy]` (+ `[data-copy-label]`) | 복사 + 「착!」 |
| `[data-loading-demo="메시지"]` | 로딩 시연 |
| `button[role="switch"]` | `aria-checked` 토글 |
| `[data-dismiss]` (값 = 닫을 조상 선택자, 기본 `.alert`) | 「휙!」 하고 닫기 |
| `[data-pager]` + `data-page` `data-page-prev/next` | 버튼형 쪽 번호 시연 |
| `input[type=range][data-output="id"]` (+ `data-unit`) | 값 출력 |
| `[data-motion-run="id"]` | 모션 시연 토글 |
| `[data-reveal]` | 컷 등장(60ms 간격, steps(3), 1회) |
| `.tabs__bar` / `[data-scroll-hint]` | 가로 넘침 힌트(`is-overflow` `is-end`) |

이벤트: `kw:kanban-move`(detail: card, col), `kw:submitted`(폼 성공).
