# COMPONENTS — 쨍 페스티벌 2026 v2 마크업 계약

index.html · pages/*.html을 맡은 에이전트는 **이 문서만 보고** 마크업한다. 디자인 근거와 세계관 값(날짜·인물·가격·ID·타임테이블 32팀)은 `DIRECTION.md` 2절 **팩트 시트**에만 있다. 거기 없는 값을 지어내지 않는다.
클래스는 BEM(`블록__요소--변형`). 상태는 가능하면 ARIA 속성(`aria-selected`, `aria-current`, `aria-expanded`, `aria-pressed`, `aria-busy`, `aria-invalid`, `aria-checked`, `disabled`)으로 표시하고 CSS가 그 속성을 읽는다.

**두 시그니처를 잊지 말 것.** ① 빌링 티어: 크기가 곧 서열. 같은 크기로 늘어놓은 목록(같은 높이 카드 4장, 같은 크기 KPI 4개)을 만들지 않는다. ② 무대색 블록: 색은 무대(장소)다. 핑크 ● 쨍 스테이지 / 블루 ■ 물결 스테이지 / 라임 ▲ 잔디 스테이지 / 오렌지 ◆ 귤 텐트. 색면은 틈 없이 맞붙고, 테두리·그림자·둥근 모서리·사선·회전은 쓰지 않는다.

---

## 0. 페이지 뼈대 (모든 HTML 공통)

```html
<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>판매 상황판 — 쨍 운영실</title>
<script>(function(){try{var q=new URLSearchParams(location.search).get('theme');var s=null;try{s=localStorage.getItem('jjaeng-theme');}catch(e){}var t=(q==='dark'||q==='light')?q:(s==='dark'||s==='light')?s:(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.setAttribute('data-theme',t);}catch(e){}})();</script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Mona+Sans:wdth,wght@75..125,400..900&family=Gothic+A1:wght@400;700;900&family=Spline+Sans+Mono:wght@500;700&display=swap">
<link rel="stylesheet" href="styles.css">        <!-- pages: ../styles.css -->
<link rel="stylesheet" href="index.css">         <!-- pages: dashboard.css 등 장면 전용 1개 -->
</head>
<body>
<a class="skip" href="#main">본문으로 건너뛰기</a>
<header class="nav">…</header>                 <!-- 4절 셸 스니펫 그대로 -->
<main id="main">…</main>                         <!-- 운영실 페이지는 4-3의 .ops 안에 main -->
<footer class="foot">…</footer>                  <!-- 4-4 셸 스니펫 그대로 -->
<!-- 층(모바일 내비 drawer · ⌘K · 모달 등)과 토스트 영역은 body 끝에 -->
<div class="toasts" data-toast-zone role="region" aria-label="알림"></div>
<script src="app.js"></script>                   <!-- pages: ../app.js -->
</body>
</html>
```

- `<title>`은 `장면 이름 — 쨍 페스티벌 2026`(관객용) 또는 `장면 이름 — 쨍 운영실`(운영용).
- `localStorage` 키는 `jjaeng-theme`. **`?theme=dark|light`가 최우선**, 그다음 저장값, 그다음 시스템 설정.
- 장면 CSS(`index.css`, `pages/<name>.css`)도 **semantic 토큰만**(2절) 쓴다. raw hex 금지, 인라인 `grid-template-columns` 금지(대신 `.s-*` 스팬 클래스). `style="--val:84.1%"`, `style="--at:60;--len:50"` 같은 커스텀 속성 주입만 허용.
- 아이콘은 인라인 SVG에 `class="icon"`(20px, `stroke: currentColor`가 CSS에서 붙음). **presentation attribute에 `var()` 금지.** 이모지 아이콘 금지. 3-0절에 정본 아이콘 경로가 있다.
- 금지: `href="#"`, 인라인 `onclick`, 이미지 파일(그림은 CSS 색면·SVG), 외부 JS/CSS 라이브러리.
- 보이는 글은 전부 한국어. 라틴은 워드마크 `JJAENG 2026`, 아티스트 라틴 병기, ID(`SET-1P4`, `JJ26-2D-048213`), hex, 시간·금액 숫자에만.
- **모노 폰트·넓은 자간(.t-code)은 라틴·숫자에만.** 한글이 섞인 라벨은 `.t-mono`도 쓰지 말고 본문 글꼴로.

---

## 1. 레이아웃 문법 (base.css)

페이지는 **풀블리드 가로 띠(band)를 위에서 아래로 쌓은 것**이다. 띠 바깥에 max-width 컨테이너를 두지 않는다. 띠마다 지배색·여백이 달라야 한다(같은 배경·같은 패딩이 두 번 연속 금지).

### `.band` — 띠 (여백은 티어가 정한다)
```html
<section class="band band--t2 tone-pink">…</section>
```
| 클래스 | 위아래 여백 | 쓰임 |
|---|---|---|
| `.band` | 48px | 본문 띠 |
| `.band--t1` | 40px | 헤드라이너 줄, 주인공 숫자 |
| `.band--t2` | 24px | T2 줄, 페이지 제목 |
| `.band--t3` | 16px | T3 줄, 장 제목 |
| `.band--t4` | 12px | T4 줄, 공지 띠 |
| `.band--flush` / `.band--x0` | 0 / 좌우 0 | 표·칸반·달력을 띠에 꽉 채울 때 |

좌우 여백은 항상 `--pad-x`(clamp 16~40px). 띠 오른쪽 끝 장 번호는 `<span class="band__end">03/08</span>`, 한 줄 정렬은 `.band__row`.

### `.grid` — 12단, gutter 0 (블록이 맞붙는다)
```html
<section class="grid grid--stretch">
  <div class="s-7 tone-pink cell">…</div>
  <div class="s-5 tone-blue cell cell--end">…</div>
</section>
```
- 스팬 `.s-1` ~ `.s-12`. **한 행 합 12.** 허용 분할 7/5, 8/4, 9/3, 5/7, 4/8, 12. 같은 크기 반복(6/6, 4/4/4, 3/3/3/3)은 표·달력·무대 4열처럼 데이터가 원래 같은 무게일 때만.
- ≤1024px: `.t-s-6`, `.t-s-12`로 태블릿 스팬. ≤640px: 4단으로 접히고 전부 풀폭. 반폭은 `.m-2`(숫자 칸 2개 나란히), `.m-1`, `.m-3`.
- 칸 안쪽 여백 `.cell`(24px 40px), `.cell--tight`, `.cell--flush`(0), 아래 정렬 `.cell--end`.
- 같은 색 면끼리 맞닿을 때만 이음선 `.seam-t/.seam-b/.seam-l`(3px). 굵은 규칙선은 `.rule-t/.rule-b`.

### `.stair` — 계단형 오른쪽 끝 (포스터의 날짜·무대 블록이 엇갈린 모양)
```html
<div class="stair">
  <div class="tone-yellow band band--t4">…</div>
  <div class="tone-violet band band--t4 w-9">…</div>
  <div class="tone-red band band--t4 w-6">…</div>
</div>
```
`.w-11 ~ .w-4`(12단 기준 폭). 왼쪽 끝은 항상 정렬. ≤640px에서 풀폭으로 펴진다.

### 색면 `.tone-*` — 면 + 그 안의 글자·링·버튼까지 한 번에
| 클래스 | 면 | 글자 | 안에서 바뀌는 것 |
|---|---|---|---|
| `.tone-pink` / `.tone-orange` / `.tone-lime` / `.tone-yellow` | 무대색·볕노랑 | 먹 | 링크·규칙선·포커스 링이 먹, 버튼 hover가 먹 면 flip, `·` 구분 기호 먹 |
| `.tone-blue` | 물결블루 | 흰 | 기본 버튼이 **노랑 면/블루 글자**, hover 라임 |
| `.tone-violet` | 밤보라(헤드라이너) | 흰 | 기본 버튼 노랑/먹 |
| `.tone-red` | 경보빨강 | 흰 | 낙뢰 경보·삭제 확인에만 |
| `.tone-ink` | 먹(모드 무관) | 흰 | 운영실 단면, 전광판 |
| `.tone-block` | 먹(라이트) / 밤 면(다크) | 흰 | navbar·sidebar와 같은 면 |
| `.tone-paper` / `.tone-surface` / `.tone-sunk` | 종이 / 패널 / 가라앉은 칸 | 본문 | 색면 안에서 종이로 되돌림 |
| `.tone-stage` + `data-stage` | 그 무대색 | 그 무대의 짝 글자 | 데이터가 무대를 가리킬 때 |

- **색면 위 글자 조합은 4-2 표의 것만.** 노랑 면 위 블루 글자(`.fg-blue`), 블루 면 위 노랑/라임 글자(`.fg-yellow`, `.fg-lime`), 라임·노랑 면 위 보라 글자(`.fg-violet`, **24px 이상 굵은 글자만**), 먹 면 위 핑크/오렌지/라임/노랑. 핑크↔블루, 핑크↔오렌지, 오렌지↔블루, 라임↔노랑, 보라↔블루는 **글자 금지**(면끼리만 맞붙임).
- 가장 시끄러운 이웃: **핑크|블루**, **오렌지|보라**, **라임|핑크**. 페이지 머리 블록은 이 세 쌍을 우선 맞붙인다.
- 카드·표·리스트처럼 자기 면을 종이로 칠하는 컴포넌트는 색면 안에 들어가도 글자가 자동으로 본문색으로 돌아온다(surface reset). 장면에서 색면 안에 종이 칸을 직접 만들 땐 `.on-surface`를 붙인다(변수와 함께 `color`도 본문색으로 되돌린다). 색면(tone-*) 패널 안의 탭은 고르지 않은 탭이 그 면의 글자색을 따르고 hover는 먹 면 + 볕노랑이다(tabs.css가 처리).
- 다크 모드에서도 **무대색 면 hex는 같다**(밤 무대 조명). 바뀌는 건 종이 → 밤하늘과 작은 색 글자뿐. 장면 CSS에서 다크용 색을 따로 고르지 말 것.

### 활자 유틸
| 클래스 | 크기 | 용도 |
|---|---|---|
| `.t-t1` | clamp(64px, 13vw, 208px) | **화면당 하나.** 헤드라이너, 워드마크 「쨍」, 주인공 숫자 |
| `.t-t2` | clamp(44px, 7.5vw, 120px) | T2 줄, 페이지 제목 |
| `.t-t3` | clamp(30px, 4.4vw, 72px) | T3 줄, 장 제목 |
| `.t-t4` | clamp(22px, 2.6vw, 40px) | T4 줄, 블록 제목 |
| `.t-lg` / `.t-sm` / `.t-xs` | 20 / 14 / 12px | 리드 / 보조 / 각주 |
| `.t-mono` | 13px Spline Sans Mono | 시간 `20:30`, ID, 금액 숫자 (**라틴·숫자만**) |
| `.t-code` | 13px 모노 대문자 + 0.06em | `SAT / SUN`, `IDENTITY KIT V3` 같은 라틴 라벨만 |

보조: `.t-latin`(라틴 자간 -0.02em), `.t-wide`(font-stretch 125% — 날짜·숫자 블록), `.t-narrow`(75% — 이름 줄), `.t-num`(tabular), `.t-strong`, `.t-heavy`, `.t-muted`, `.t-danger`, `.t-success`, `.t-pink/.t-blue/.t-lime/.t-orange/.t-violet`(종이·밤 위 무대색 글자, 대비 확보된 값), `.t-stage`(data-stage의 글자색), `.mark`(노랑 형광펜), `.measure`(36em), `.prose`.
- T1·T2는 line-height가 0.84·0.88이라 한글 획이 줄 상자 밖으로 조금 나온다. 바로 위아래에 다른 글을 붙일 때는 12px 이상 띄운다.
- Gothic A1은 400/700/900만 있다. 다른 웨이트 지정 금지(합성 볼드 차단됨).

### 시그니처 S1 — 빌링 줄 `.bill`
```html
<p class="bill bill--t2" data-fit>
  <span class="bill__name">물수제비</span><span class="bill__sep">·</span><span class="bill__name">오렌지기계</span>
</p>
<p class="bill bill--t3">
  <span class="bill__name">유리망치</span>
  <span class="bill__sep" data-stage="P"><span class="sym sym--st" aria-hidden="true"></span></span>
  <span class="bill__name">수영금지</span>
  <span class="bill__sep" data-stage="B"><span class="sym sym--st" aria-hidden="true"></span></span>
  <span class="bill__name">삼바고양이</span>
  <span class="bill__note">SET-1B3</span>
</p>
```
- 티어 `.bill--t1 ~ --t4`. 구분 기호는 `·`(색면별로 자동 대비색) 또는 다음 이름의 무대 기호(`.sym--st` + `data-stage`). 라틴 이름은 `.bill__name--latin`.
- `[data-fit]`: app.js가 font-stretch(75~125%) → font-size 순으로 줄을 띠 폭에 **양끝 맞춤**한다. 확대 상한 `data-fit-max="1.6"`(기본), 하한 `data-fit-min="0.4"`. 한 줄에 들어갈 분량만 넣을 것. ≤640px에서는 T1·T2 줄만 맞추고 T3·T4는 줄바꿈하며 흐른다.
- 누를 수 있는 이름(onboarding 찜, 라인업 → 아티스트):
```html
<button class="bill__pick" type="button" data-stage="P" data-pick aria-pressed="false"
  data-pick-on="볕들날을 찜했어요 · 토 20:30 쨍 스테이지" data-pick-off="볕들날 찜을 뺐어요">볕들날</button>
<a class="bill__pick" href="pages/profile.html">볕들날</a>
```
찜 = 그 무대색 면(먹 테), 시간 겹침 경고 = `.is-conflict`(이름 둘레 빨강 테 + 뒤에 「✕ 겹침」 배지 — 글자를 가르는 밑막대 금지) + 근처에 alert 문장. 판정은 그룹에 `data-pick-conflict`를 달면 app.js가 한다(아래 훅 표). 찜한 이름의 색면은 `padding .06em .08em` + `line-height 1.05`로 글리프보다 크게 — 위아래가 잘리면 안 된다. 비활성 `disabled`(줄긋기).

### 시그니처 S2 — 무대 기호 `.sym` · 무대 훅 `data-stage`
```html
<span class="stage-tag" data-stage="B"><span class="sym" aria-hidden="true"></span>물결 스테이지</span>
```
- `data-stage="P|B|L|O|A"`(쨍·물결·잔디·귤·전체) 하나로 면 `--st`, 짝 글자 `--on-st`, 종이 위 글자 `--st-text`, 기호 `--st-mask`(●■▲◆, 전체는 4칸 사각), hover 짝 `--st-flip-bg/--st-flip-fg`, 막대 `--st-bar`가 정해진다.
- `.sym`은 `currentColor`로 칠한 마스크 기호(1em). `.sym--st`는 무대색으로 칠함, `.sym--lg` 1.6em. 무대와 무관한 기호: `.sym--circle/--square/--triangle/--diamond/--cross/--four`.
- **색만으로 무대를 구분하지 않는다.** 항상 기호 + 무대 이름(또는 aria-label)과 함께.
- **무대 기호 ●■▲◆와 무대색 면(핑크·블루·라임·오렌지의 "무대" 의미)은 그 무대에 속한 데이터에만 쓴다.** 요일(토·일)은 `.dno` D1/D2, 셔틀·우천·운영 공지는 노랑(공지)·먹 면 + `.sym--four`(2×2 칸) 또는 글자 라벨, 수치 강조(최고 막대 등)는 노랑 면 + 먹 테를 쓴다.

### 가로 스크롤 영역
```html
<div class="table-wrap scroll-x">…</div>
```
`.scroll-x`, `.tabs__list`, `.kanban-wrap`는 app.js가 넘칠 때 `has-more`를 붙여 오른쪽 56px 페이드 힌트를 준다. 페이지 자체의 가로 넘침은 0이어야 한다(360px에서 확인).

---

## 2. 장면 CSS에서 쓸 semantic 토큰

| 무리 | 토큰 |
|---|---|
| 바탕·글자 | `--bg` `--surface` `--surface-sunk` `--text` `--text-muted` `--text-inverse` `--rule` `--seam-color` |
| 먹 면 | `--block` `--on-block` `--on-block-muted` `--block-hover` · 모드 무관 먹 `--fill-ink` `--on-ink` `--ink-raise` `--ink-line` `--ink-muted` `--ink-link` |
| 무대 면 | `--stage-pink` `--stage-blue` `--stage-lime` `--stage-orange` + 짝 글자 `--on-pink` `--on-blue` `--on-lime` `--on-orange` · `data-stage` 안에서 `--st` `--on-st` `--st-text` `--st-bar` |
| 보조 면 | `--fill-yellow`/`--on-yellow` `--fill-violet`/`--on-violet` `--fill-red`/`--on-red` · `--headliner`/`--on-headliner` `--notice`/`--on-notice` `--brand`/`--on-brand` |
| clash 글자 | `--clash-blue` `--clash-yellow` `--clash-lime` `--clash-violet` `--clash-pink` `--clash-orange` (4-2 표의 면 위에서만) |
| 종이·밤 위 색 글자 | `--pink-text` `--blue-text` `--lime-text` `--orange-text` `--violet-text` `--link` |
| 행동 | `--action` `--on-action` `--action-hover` `--on-action-hover` `--action-press` `--on-action-press` `--second` `--on-second` |
| 상태 | `--success-fill` `--on-success` `--success-text` `--warning-fill` `--on-warning` `--warning-text` `--danger-fill` `--on-danger` `--danger-text` `--disabled-fill` `--disabled-fg` |
| 입력 | `--field-fill` `--field-bar` `--field-bar-focus` · 포커스 `--focus-in` `--focus-out` |
| 기타 | `--overlay`(먹 70%) `--veil-ink` `--veil-paper` `--skeleton`(밤: night-600 — 가라앉은 칸 위에서도 보임) `--bar-fill`(차트 막대: 낮 먹 / 밤 흰) `--select-bg` `--select-fg` |
| 원시 비색 토큰(써도 됨) | 서체 `--font-display` `--font-display-ko` `--font-body` `--font-mono` · 크기 `--fs-t1~t4` `--fs-lg/body/sm/xs/mono` `--lh-t1~t4` · 간격 `--sp-1~10` `--pad-x` `--band-*` · 치수 `--seam` `--hit` `--nav-h` `--side-w` `--h-ctl*` · 모션 `--dur-*` `--ease-*` `--stagger` · 기호 `--mask-*` |

---

## 3. 컴포넌트 32 (알파벳순)

### 3-0. 정본 아이콘 (복사해서 쓴다)
```html
<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M10.5 3.5a7 7 0 1 1 0 14 7 7 0 0 1 0-14zM15.5 15.5 21 21"/></svg>   <!-- 찾기 -->
<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5l14 14M19 5L5 19"/></svg>   <!-- 닫기 -->
<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18M3 12h18M3 18h18"/></svg>   <!-- 메뉴 -->
<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 4l-8 8 8 8"/></svg>   <!-- 이전 -->
<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 4l8 8-8 8"/></svg>   <!-- 다음 -->
<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v16M4 12h16"/></svg>   <!-- 더하기 -->
<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h14M12 5l7 7-7 7"/></svg>   <!-- 이동(→) -->
<svg class="icon theme-icon--moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5z"/></svg>
<svg class="icon theme-icon--sun" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zM12 1v3M12 20v3M1 12h3M20 12h3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/></svg>
<svg class="icon icon-pause" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14M16 5v14"/></svg>
<svg class="icon icon--fill icon-play" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4l13 8-13 8z"/></svg>
```

### accordion — 질문 줄이 노랑으로 flip
```html
<div class="acc" data-accordion="single">           <!-- "single": 하나만 열림, 생략하면 여러 개 -->
  <div class="acc__item">
    <h3><button class="acc__head" type="button" id="faq-h1" aria-expanded="true" aria-controls="faq-p1">
      <span class="acc__idx">01</span><span class="acc__title">비 오면 공연 취소돼요?</span>
      <span class="acc__meta">QA-1012-064</span><span class="acc__icon" aria-hidden="true"></span>
    </button></h3>
    <div class="acc__panel" id="faq-p1" role="region" aria-labelledby="faq-h1">
      <p>비가 와도 진행해요. 낙뢰 경보 때만 공연을 멈춥니다.</p>
    </div>
  </div>
  …
</div>
```
상태: hover 먹 면, 열림 노랑 면 + `−`, 비활성 `aria-disabled="true"`. 촘촘한 판은 `.acc--compact`. 아코디언은 색면 안(예: `.tone-lime`)에 넣어도 되고 답 칸은 종이로 돌아온다.

### alert — 풀폭 띠, 왼쪽 64px 기호 칸
```html
<div class="alert alert--danger" role="alert">
  <span class="alert__sym" aria-hidden="true"><span class="sym"></span></span>
  <div class="alert__body">
    <p class="alert__title">결제가 거절됐어요</p>
    <p class="alert__text">카드 한도를 확인하거나 카카오페이·토스페이로 다시 결제해 주세요.</p>
    <div class="alert__actions"><a class="btn btn--sm" href="pricing.html">다시 결제하기</a></div>   <!-- 선택 -->
  </div>
  <button class="alert__close" type="button" data-dismiss aria-label="알림 닫기"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5l14 14M19 5L5 19"/></svg></button>
</div>
```
변형: `--danger`(✕ 빨강) `--warning`(● 노랑) `--success`(▲ 라임) `--info`(■ 블루). `.alert--solid`는 띠 전체가 그 색(낙뢰 경보·「비가 와도 진행해요」 공지). 위험·오류는 `role="alert"`, 나머지는 `role="status"` 또는 생략.

### badge — 손목밴드 칩 `.wb` (높이 28px, 직각, 알약 금지)
```html
<span class="wb" data-stage="P"><span class="wb__sym" aria-hidden="true"><span class="sym"></span></span><span class="wb__text">쨍 스테이지</span></span>
<span class="wb wb--outline" data-stage="P"><span class="wb__sym" aria-hidden="true"><span class="sym"></span></span><span class="wb__text">양일권</span><span class="wb__id">JJ26-2D-048213</span></span>
<span class="wb wb--ok"><span class="wb__sym" aria-hidden="true"><span class="sym"></span></span><span class="wb__text">판매 중</span></span>
<span class="wb wb--hot"><span class="wb__sym" aria-hidden="true"><span class="sym"></span></span><span class="wb__text">잔여 188매</span></span>
<span class="wb wb--soldout"><span class="wb__sym" aria-hidden="true"><span class="sym"></span></span><span class="wb__text">매진</span></span>
<span class="wb wb--t1"><span class="wb__text">T1</span></span>
<span class="wb wb--count"><span class="wb__text"><span class="vh">미답변 </span>12</span></span>
```
페스티벌 날 표시(무대와 무관): `<span class="dno dno--1">D1</span>`(토, 먹 면 + 노랑 글자) · `<span class="dno dno--2">D2</span>`(일, 노랑 면 + 먹 글자), 큰 것 `.dno--lg`. 요일 구분에 무대색·무대 기호를 쓰지 않는다.
상태 변형: `--ok`(▲ 라임) `--hot`(● 노랑, 마감 임박) `--soldout`(✕ 먹 반전) `--danger` `--info` `--new`(최종 라인업 추가) `--muted`. 티어 `--t1`(보라) `--t2`(핑크) `--t3`(먹) `--t4`(회색). 큰 것 `--lg`(36px). 묶음 `.wb-row`(6px 간격) / `.wb-row--flush`(맞붙음). `<a class="wb">`·`<button class="wb">`는 hover flip, `aria-pressed="true"` 선택, `disabled`.

### breadcrumb — 현재 위치만 굵고 한 단계 큼
```html
<nav class="crumbs" aria-label="현재 위치">
  <ol>
    <li><a href="dashboard.html">쨍 운영실</a></li>
    <li><a href="inbox.html">관객 문의</a></li>
    <li><span aria-current="page">볕들날이랑 오렌지기계 사이 이동 시간</span><span class="crumbs__id">QA-1014-047</span></li>
  </ol>
</nav>
```
≤640px에서는 바로 위 단계(‹) + 현재만 남는다.

### button — 직각 색면, hover = clash flip(90ms, 이동·그림자 없음)
```html
<button class="btn" type="button">타임테이블 보기</button>
<a class="btn btn--secondary" href="onboarding.html">내 타임테이블</a>
<button class="btn btn--ghost" type="button">환불 규정</button>
<button class="btn btn--notice" type="button">잔여 188매 · 피트권</button>
<button class="btn btn--headliner" type="button">볕들날 찜하기</button>
<button class="btn btn--danger" type="button">주문 취소</button>
<button class="btn btn--stage" data-stage="B" type="button"><span class="sym" aria-hidden="true"></span>물결 스테이지</button>
<button class="btn btn--link" type="button">자세히</button>
<button class="btn btn--icon" type="button" aria-label="닫기"><svg class="icon" …/></button>
<button class="btn" type="button">찾기 <span class="btn__kbd">⌘K</span></button>
```
| 변형 | 면/글자 → hover |
|---|---|
| 기본 | 블루/흰 → 노랑/블루 (다크: 라임/블루) |
| `--secondary` | 먹/흰 → 핑크/먹 |
| `--ghost` | 3px 테두리 → 글자색 면 |
| `--notice` | 노랑/먹 → 블루/노랑 |
| `--headliner` | 보라/흰 → 라임/보라 |
| `--danger` | 빨강/흰 → 먹/밝은 빨강 |
| `--stage` + `data-stage` | 무대색 → 그 무대의 flip 짝 |
| `--link` | 밑줄 글자 → 노랑 면 |

크기 `--sm`(44px) 기본(48px) `--lg`(56px) `--xl`(72px, T4 활자 — 가격 블록의 결제 버튼 하나에만). 모양 `--icon`(정사각), `--block`(풀폭, 양끝 정렬). 상태: `:active` 다른 짝, `aria-pressed="true"` 노랑(찜함·선택), `disabled`/`aria-disabled="true"` 회색, **로딩 `aria-busy="true"`**(글자 자리를 지키고 4칸 신호등이 건너뜀). 시연용 로딩은 `data-busy-demo="1400"` + `data-toast="…"`.
버튼끼리는 `.btn-row`(맞붙음) 또는 `.btn-row--gap`/`.cluster`. **「무료로 시작하기 / 데모 보기」 같은 CTA 쌍 금지.** 행동 하나를 정확한 동사로.

### calendar — 월 격자, 칸 사이 3px 이음선
```html
<div class="cal" data-calendar data-cal-month="2026-10" data-cal-min="2026-08" data-cal-max="2026-11"
     data-cal-events='{"2026-09-10":"2차 라인업 12팀","2026-10-31":{"t":"1일차","day":1},"2026-11-01":{"t":"2일차","day":2}}'>
  <div class="cal__head">
    <p class="cal__title"><span class="cal__month">10월</span><span class="cal__year">2026</span></p>
    <button class="cal__nav" type="button" aria-label="9월 보기" data-cal-step="-1"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 4l-8 8 8 8"/></svg></button>
    <button class="cal__nav" type="button" aria-label="11월 보기" data-cal-step="1"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 4l8 8-8 8"/></svg></button>
  </div>
  <div class="cal__grid">
    <span class="cal__dow cal__dow--sun">일</span><span class="cal__dow">월</span><span class="cal__dow">화</span><span class="cal__dow">수</span><span class="cal__dow">목</span><span class="cal__dow">금</span><span class="cal__dow cal__dow--sat">토</span>
    <span class="cal__day cal__day--muted"><span class="cal__num">27</span></span>          <!-- 9월 -->
    …
    <span class="cal__day cal__day--today"><span class="cal__num">14</span><span class="cal__ev">오늘 · 최종 라인업</span></span>
    <span class="cal__day cal__day--deadline"><span class="cal__num">23</span><span class="cal__ev">전액 환불 마감</span></span>
    <span class="cal__day cal__day--deadline"><span class="cal__num">28</span><span class="cal__ev">30% 환불 마감</span></span>
    <button class="cal__day" type="button" data-label="10월 30일(금)"><span class="cal__num">30</span><span class="cal__ev">판매 마감 23:59</span></button>
    <span class="cal__day cal__day--fest"><span class="cal__num">31</span><span class="cal__ev"><span class="dno dno--1">D1</span>1일차</span></span>
  </div>
  <div class="cal__foot">
    <span class="cal__key cal__key--fest">페스티벌 1·2일차</span><span class="cal__key cal__key--deadline">환불 마감</span><span class="cal__key cal__key--today">오늘</span>
    <span class="cal__out" data-cal-output aria-live="polite"></span>
  </div>
</div>
```
**2026년 10월 1일은 목요일**(앞 칸 9/27 일 ~ 9/30 수 4개). 11월 1일은 일요일. 페스티벌 날: 밤보라 면 + 10/31 `D1`, 11/01 `D2` (무대색·무대 기호를 빌리지 않는다. 주말 요일 머리도 굵기로만 표시). 고를 수 있는 날은 `button.cal__day`(선택 `aria-pressed`, 비활성 `disabled`). ≤640px에서 칸 안 글은 숨고 색·기호만 남는다.

### card → 블록 `.block` (무대색 머리 띠 + 몸통, 이웃과 맞붙음)
```html
<div class="blocks">
  <a class="block block--lg s-7" data-stage="P" href="profile.html">
    <div class="block__head">
      <div><p class="block__kicker"><span class="sym" aria-hidden="true"></span>쨍 스테이지 · 토 20:30</p><h3 class="block__name">볕들날</h3></div>
      <span class="block__id">AR-01</span>
    </div>
    <div class="block__body"><p class="block__text">4인조 밴드. 정규 3집 『한낮 블록』 2026년 5월 20일(수) 발매.</p></div>
    <div class="block__foot"><span>찜</span><span class="block__stat">3,120</span></div>
  </a>
  <div class="block s-5" data-stage="B">…</div>
</div>
```
- 크기 = 서열: `--xl`(머리 280px, T2 이름) `--lg`(180px, T3) 기본(T4) `--sm`. **한 더미 안에 크기를 섞는다.** 같은 크기 블록 3장 이상 나란히 금지.
- `.block--solid` 몸통까지 한 색, `.block--headliner` 머리 보라. 머리 없이 `data-stage`가 없으면 먹 머리.
- 링크 블록 hover/focus = 머리 띠 flip + 이름 밑줄. 선택 `aria-selected="true"`/`.is-selected` 노랑 머리, 비활성 `aria-disabled="true"`.
- 그림 칸(이미지 대신): `<div class="block__art" aria-hidden="true"><i></i><i></i><i></i></div>`.
- `.blocks`는 12단 맞붙음 그리드(≤640px 4단, `.m-2` 반폭).

### carousel — 지금·다음 무대 띠
```html
<div class="carousel" data-carousel aria-label="지금·다음 무대" aria-roledescription="캐러셀">
  <div class="carousel__viewport">
    <div class="carousel__slide" data-stage="P">
      <div>
        <p class="carousel__when"><span class="sym" aria-hidden="true"></span>지금 · 쨍 스테이지</p>
        <p class="carousel__title">물수제비</p>
        <p class="carousel__meta">SET-1P3 · 18:00–19:00</p>
      </div>
      <p class="carousel__aside">18:00</p>
    </div>
    <div class="carousel__slide" data-stage="B" hidden>…오렌지기계 SET-1B4 19:20–20:20…</div>
  </div>
  <div class="carousel__bar">
    <span class="carousel__count" data-carousel-count><b>1</b> / 4</span>
    <div class="carousel__dots"><button class="carousel__dot" type="button" data-stage="P" aria-label="1번째 무대"></button>…</div>
    <div class="carousel__ctrl">
      <button class="carousel__btn" type="button" data-carousel-prev aria-label="이전 무대"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 4l-8 8 8 8"/></svg></button>
      <button class="carousel__btn" type="button" data-carousel-next aria-label="다음 무대"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 4l8 8-8 8"/></svg></button>
    </div>
  </div>
</div>
```
←/→ 키, 점, 버튼으로 넘김. 넘길 때 띠 와이프. 슬라이드 색은 그 공연의 무대색.

### code — 먹 면 + 모노 13px
```html
<div class="code">
  <div class="code__head"><span class="code__file">semantic.css</span><button class="code__copy" type="button" data-copy>복사</button></div>
  <pre><code><span class="code__s">[data-stage="P"]</span> {
  <span class="code__k">--st</span>: <span class="code__v">var(--stage-pink)</span>; <span class="code__c">/* <span class="code__n">#FF3D8B</span> 쨍 스테이지 */</span>
}</code></pre>
</div>
```
토큰 이름 `.code__k`(노랑), 값 `.code__v`(흰), 선택자 `.code__s`(라임), 숫자·hex `.code__n`(핑크), 주석 `.code__c`. 색 견본 `<i class="code__sw" style="--sw: var(--stage-pink)"></i>`. 복사 버튼은 성공 시 라임 면 「복사됨」. 다른 요소를 복사하려면 `data-copy="#선택자"`. 본문 속 짧은 코드 `<code class="code--inline">--fs-t2</code>`.

### command — ⌘K: 위에서 떨어지는 풀폭 먹 띠 (페이지당 1개, body 끝)
4-5절 셸 스니펫을 그대로 쓴다. 정적 견본(index 운영실 장)은 같은 마크업에 `cmd--static`을 더하고 `hidden`·`role="dialog"`를 빼고 `aria-hidden="true"`, 입력칸 `tabindex="-1"`. 견본의 선택 행은 `aria-selected="true"`, 찾은 글자는 `<mark class="cmd__mark">볕</mark>`.
동작: ⌘K/Ctrl+K 토글, 입력 즉시 거르기(`data-keywords`로 동의어 추가), ↑/↓ 이동, Enter 열기(`data-href` 이동, 없으면 `data-toast` 문장), Esc 닫기, 포커스 트랩, 닫으면 연 버튼으로 포커스 복귀. 결과 없음 문장은 `.cmd__empty`.

### drawer — 오른쪽에서 밀려오는 풀높이 색 기둥
```html
<div class="drawer drawer--blue" id="set-drawer" hidden role="dialog" aria-modal="true" aria-labelledby="set-drawer-title">
  <div class="drawer__scrim" data-close></div>
  <div class="drawer__panel">
    <div class="drawer__head">
      <h2 class="drawer__title" id="set-drawer-title">오렌지기계 · SET-1B4</h2>
      <button class="drawer__close" type="button" data-close aria-label="닫기"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5l14 14M19 5L5 19"/></svg></button>
    </div>
    <div class="drawer__body">…</div>
    <div class="drawer__foot"><button class="btn" type="button" data-close>찜하기</button><button class="btn btn--ghost" type="button" data-close>닫기</button></div>
  </div>
</div>
<button class="btn btn--sm" type="button" data-open="set-drawer" aria-expanded="false" aria-controls="set-drawer">공연 상세</button>
```
기둥 색: 기본(종이/밤 면) `--pink`(모바일 내비) `--blue` `--block`(운영실 모바일 내비). 내비 기둥은 `.drawer__nav` + `.drawer__link`(T3 이름 줄, 현재 `aria-current="page"` 노랑, 오른쪽 `<small>` 보조). 정적 견본: `drawer--static`, `hidden`/`role` 빼고 `aria-hidden="true"`, 닫기는 `<span class="drawer__close">`.

### empty — 비어 있는 라인업 줄
```html
<div class="empty">
  <div class="empty__lines" aria-hidden="true"><i></i><i></i><i></i></div>
  <div>
    <h3 class="empty__title">아직 찜한 공연이 없어요</h3>
    <p class="empty__text">라인업에서 이름을 누르면 내 타임테이블에 들어가요.</p>
    <div class="empty__actions"><a class="btn" href="onboarding.html">라인업에서 고르기</a></div>
  </div>
</div>
```
좁은 칸 안에서는 `.empty--compact`. 행동은 하나만.

### form — 48px 입력칸, 아래 3px 막대
```html
<form class="form" data-validate data-success-toast="관객 정보를 저장했어요" data-error-toast="빠진 칸을 채워 주세요">
  <div class="form__row">
    <div class="field">
      <label class="field__label" for="buyer-name">이름<span class="field__req" aria-hidden="true">*</span></label>
      <input class="input" id="buyer-name" name="name" autocomplete="name" value="채민서" required>
    </div>
    <div class="field is-invalid">
      <label class="field__label" for="buyer-tel">휴대폰 번호<span class="field__req" aria-hidden="true">*</span></label>
      <input class="input input--mono" id="buyer-tel" type="tel" inputmode="numeric" value="010-2741-58"
        pattern="010-\d{4}-\d{4}" required aria-invalid="true" aria-describedby="buyer-tel-err">
      <p class="field__error" id="buyer-tel-err"><span class="sym" aria-hidden="true"></span>휴대폰 번호 11자리를 넣어 주세요</p>
    </div>
  </div>
  <div class="field">
    <label class="field__label" for="pay">결제 수단</label>
    <select class="select" id="pay"><option>카드</option><option>카카오페이</option><option>토스페이</option><option>무통장</option></select>
    <p class="field__hint">무통장은 주문 후 24시간 안에 입금해 주세요.</p>
  </div>
  <div class="field"><label class="field__label" for="memo">요청 사항 <span class="field__opt">선택</span></label><textarea class="textarea" id="memo"></textarea></div>
  <div class="input-group"><span class="input-group__affix">JJ26-</span><input class="input input--mono" aria-label="티켓 번호"><button class="btn" type="button">조회</button></div>
  <label class="check"><input type="checkbox" required><span class="check__box" aria-hidden="true"></span><span class="check__text">환불 규정을 읽었어요<small>10월 29일(목)부터 환불이 안 돼요</small></span></label>
  <label class="check" data-stage="P"><input type="checkbox" checked><span class="check__box" aria-hidden="true"></span><span class="check__text">쨍 스테이지</span></label>   <!-- 담당 무대: 체크되면 무대색 -->
  <label class="radio"><input type="radio" name="ship" checked><span class="radio__box" aria-hidden="true"></span><span class="radio__text">쨍 게이트 굿즈 부스에서 받기</span></label>
  <button class="switch" type="button" role="switch" aria-checked="true"><span class="switch__rail" aria-hidden="true"></span><span class="switch__state">켜짐</span>공연 15분 전 알림</button>
  <div class="form__actions"><button class="btn btn--lg" type="submit">다음 · 결제</button></div>
</form>
```
- 상태: hover 막대 6px, focus 블루 막대 + 이중 링, 오류 빨강 막대 + ✕ + 문장(`aria-invalid` + `aria-describedby`), `disabled` 회색 면, `readonly` 채움 없음.
- **빌링 선택지(권종 라디오가 빌링 크기)**:
```html
<div class="choice" role="radiogroup" aria-label="권종">
  <label class="choice__opt choice__opt--t2"><input type="radio" name="tk" checked><span class="choice__name">양일권</span><span class="choice__price">₩229,000</span><span class="choice__note">가장 많이 고름</span></label>
  <label class="choice__opt choice__opt--t3"><input type="radio" name="tk"><span class="choice__name">쨍 피트권</span><span class="choice__price">₩279,000</span><span class="choice__note">잔여 188매</span></label>
  <label class="choice__opt"><input type="radio" name="tk"><span class="choice__name">토요일권</span><span class="choice__price">₩139,000</span></label>
  <label class="choice__opt"><input type="radio" name="tk" disabled><span class="choice__name">얼리버드 양일권 · 매진</span><span class="choice__price">₩198,000</span></label>
</div>
```
- `form[data-validate]`: 제출 시 required/pattern/email 검사 → 첫 오류로 포커스 + `data-error-toast`. 통과하면 제출 버튼 로딩 0.9초 후 `data-success-toast`(+ `data-success-id`).

### kanban — 현장 운영 보드 (열 4개 고정 순서)
```html
<div class="kanban-wrap">
  <p class="kanban__hint" id="kanban-hint">카드에 포커스를 두고 ←/→로 열을 옮기고 ↑/↓로 카드 사이를 움직여요. 끌어서 옮겨도 돼요.</p>
  <div class="kanban" data-kanban>
    <section class="kanban__col" data-col="todo" aria-labelledby="col-todo">
      <header class="kanban__head"><h2 class="kanban__title" id="col-todo">할 일</h2><span class="kanban__count">5</span></header>
      <ol class="kanban__list" data-drop="할 일 · 끌어다 놓으면 고은별 팀장이 다시 배정해요">
        <li class="kcard" data-stage="A" id="op-123">
          <span class="kcard__bar" aria-hidden="true"></span>
          <div class="kcard__body">
            <div class="kcard__top"><span class="kcard__id">OP-123</span><span class="kcard__due">D-17</span></div>
            <p class="kcard__title">최종 라인업 반영 현장 사인물 재인쇄</p>
            <div class="kcard__meta"><span class="stage-tag"><span class="sym" aria-hidden="true"></span>전체</span><span>왕다인</span></div>
          </div>
        </li>
      </ol>
      <button class="kanban__add" type="button" data-toast="할 일에 새 작업 칸을 만들었어요">+ 작업 추가</button>
    </section>
    <section class="kanban__col" data-col="doing">…진행 중…</section>
    <section class="kanban__col" data-col="check">…현장 확인…</section>
    <section class="kanban__col" data-col="done">…끝…</section>
  </div>
  <p class="kanban__live" aria-live="polite"></p>
</div>
```
열 머리 색: 할 일 먹 / 진행 중 블루 / 현장 확인 노랑 / 끝 라임. 카드 막대 = 작업의 무대(`data-stage`, 전체는 4색 줄무늬). 급함 `.kcard--urgent`, 끝 열 카드는 자동 줄긋기, 잡힌 카드 `.is-grabbed`(노랑). app.js가 장수 숫자와 aria-live 문장을 갱신한다. ≤900px은 가로 스크롤(열 256px). **빈 드롭존**: 각 `.kanban__list`의 `data-drop` 문장이 카드 아래 남는 높이를 `--surface-sunk` 면으로 채운다(최소 64px, 열 색 틴트 금지) — 카드 수가 다른 열 아래에 흰 빈칸이 남지 않는다.

### list — 56px 행, 왼쪽 무대 기호 칸, 오른쪽 모노 시간
```html
<ul class="list">
  <li><a class="list__row" href="profile.html" data-stage="P">
    <span class="list__sym" aria-hidden="true"><span class="sym"></span></span>
    <span class="list__main"><span class="list__title">볕들날</span><span class="list__sub">쨍 스테이지 · 오렌지기계에서 걸어서 6분</span></span>
    <span class="list__end"><span class="list__time">20:30</span><span class="wb wb--t1"><span class="wb__text">T1</span></span></span>
  </a></li>
</ul>
```
행은 `<a>`/`<button class="list__row">`/`<div>`. 상태: hover 노랑 flip, 현재 `aria-current="true"`/`.is-active` 먹 반전, 안 읽음 `.is-unread`(노랑 정사각 + 먹 테 — 경보빨강은 오류·삭제·낙뢰 전용). 미답변처럼 상태를 말해야 하면 오른쪽에 노랑 손목밴드 `wb--hot`(「● 미답변 · 8분」)을 두고 제목 앞 점은 끈다. 무대 관련 행은 채널 칸을 칠하지 말고 제목 앞에 무대 이름표(●쨍)를 붙인다, 비활성 `aria-disabled`. 촘촘한 `.list--compact`(48px).

### marquee — 전광판 1줄 (화면당 최대 1개)
```html
<div class="marquee" data-marquee>
  <span class="marquee__label">전광판</span>
  <div class="marquee__viewport"><div class="marquee__track"><div class="marquee__group">
    <span class="marquee__item" data-stage="P"><span class="sym" aria-hidden="true"></span><span class="marquee__time">14:00</span>최종 라인업 공개 · <b>수영금지</b> 쨍 스테이지 합류</span>
    <span class="marquee__item" data-stage="B"><span class="sym" aria-hidden="true"></span>일요일 물결 스테이지 19:20 <b>분홍트랙터</b></span>
    <span class="marquee__item"><span class="sym sym--four" aria-hidden="true"></span>셔틀 11:00 ~ 23:00 · 월드컵경기장역 1번 출구 · 10분 간격 무료</span>
  </div></div></div>
  <button class="marquee__toggle" type="button" data-marquee-toggle aria-pressed="false" aria-label="전광판 멈추기">
    <svg class="icon icon-pause" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14M16 5v14"/></svg>
    <svg class="icon icon--fill icon-play" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4l13 8-13 8z"/></svg>
  </button>
</div>
```
노랑(기본) / `--ink` / `--pink`. app.js가 그룹을 복제해 이음매 없이 흐르게 한다. hover·focus 시 멈춤, 버튼으로 멈춤. reduced-motion이면 정지한 한 줄. **내용은 실제 현장 소식만**(팩트 시트 시각·이름). 색 이름 나열 금지.

### menu — 버튼 아래 맞붙는 먹 블록
```html
<div class="menu-wrap">
  <button class="btn btn--ghost btn--sm" type="button" aria-haspopup="menu" aria-expanded="false" aria-controls="sort-menu">정렬 · <span data-menu-value>받은 시각순</span></button>
  <ul class="menu" id="sort-menu" role="menu" hidden>
    <li class="menu__label" role="presentation">문의 정렬</li>
    <li role="none"><button class="menu__item" type="button" role="menuitemradio" aria-checked="true">받은 시각순</button></li>
    <li role="none"><button class="menu__item" type="button" role="menuitemradio" aria-checked="false">미답변 먼저</button></li>
    <li class="menu__sep" role="separator"></li>
    <li role="none"><button class="menu__item" type="button" role="menuitem" data-toast="QA-1014-047을 읽음으로 바꿨어요"><span class="sym sym--square" aria-hidden="true"></span>읽음으로 표시<span class="menu__kbd">R</span></button></li>
    <li role="none"><button class="menu__item menu__item--danger" type="button" role="menuitem">문의 지우기</button></li>
    <li role="none"><button class="menu__item" type="button" role="menuitem" disabled>병합 (권한 없음)</button></li>
  </ul>
</div>
```
오른쪽 끝 정렬 `.menu--end`(화면 밖이면 app.js가 자동). ↓로 열기, ↑/↓/Home/End 이동, Esc 닫고 버튼으로 포커스 복귀, 바깥 클릭 닫기. 선택된 radio 값은 `[data-menu-value]`에 반영. 정적 견본: `menu--static`(hidden 없이), 항목에 `tabindex="-1"`, 목록에 `aria-label="견본"`.

### modal — 화면을 가로지르는 풀폭 색 띠 (위에서 떨어짐)
```html
<div class="modal" id="pay-modal" hidden role="dialog" aria-modal="true" aria-labelledby="pay-modal-title">
  <div class="modal__scrim" data-close></div>
  <div class="modal__band">
    <div class="modal__main">
      <p class="modal__kicker"><span class="sym sym--four" aria-hidden="true"></span>결제 확인 · 2 / 3</p>
      <h2 class="modal__title" id="pay-modal-title">양일권 1매를 결제할까요?</h2>
      <p class="modal__text">10월 23일(금)까지는 전액, 28일(수)까지는 30%를 빼고 돌려드려요. 29일(목)부터는 환불이 안 돼요.</p>
      <div class="modal__actions">
        <button class="btn btn--lg" type="button" data-close data-toast="결제를 마쳤어요" data-toast-tone="success" data-toast-id="JJ26-2D-048213">₩229,000 결제하기</button>
        <button class="btn btn--ghost btn--lg" type="button" data-close>다시 고를게요</button>
      </div>
    </div>
    <div class="modal__side">
      <p class="t-sm t-muted">결제 금액</p>
      <p class="modal__big">₩229,000</p>
      <p class="t-mono">ORD-261014-0391</p>
    </div>
    <button class="modal__close" type="button" data-close aria-label="닫기"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5l14 14M19 5L5 19"/></svg></button>
  </div>
</div>
<button class="btn" type="button" data-open="pay-modal" aria-expanded="false" aria-controls="pay-modal">결제 확인</button>
```
띠 색: 노랑(기본) `--blue` `--violet`(헤드라이너 관련) `--danger`(지우기 확인). 오른쪽 칸 없이 `--solo`. 동작: 포커스 트랩, Esc·막(scrim)·닫기 버튼으로 닫힘, 닫으면 연 버튼으로 복귀, 첫 포커스는 `[data-autofocus]` 또는 첫 버튼. 정적 견본: `.modal--static` + `aria-hidden="true"`, `hidden`/`role` 빼고 버튼 대신 `<span class="btn">`.

### motion — 모션 문법 4종 실연 (index 운영실 장)
같은 크기 카드 4장으로 진열하지 않는다. 주인공 = 실제 빌링 줄이 칠해지는 풀폭 띠, 나머지는 `.stair` 계단형 폭 가로 띠. 다시 재생은 띠 오른쪽 끝 `.motion__play` 하나.
```html
<div class="motion stair">
  <div class="motion__cell motion__cell--hero">
    <div class="motion__wipe">
      <p class="motion__row motion__row--t1"><span class="bill__name">볕들날</span></p>
      <p class="motion__row motion__row--t2"><span class="motion__half" data-stage="P">물수제비</span><span class="motion__half" data-stage="B">오렌지기계</span></p>
      <p class="motion__row motion__row--t4"><span>김볕나</span><span>도토리레이서</span>…</p>
    </div>
    <div class="motion__info"><p class="motion__name">줄 와이프</p><p class="motion__spec">480ms · 줄마다 70ms</p><p class="motion__text">…</p></div>
    <button class="motion__play" type="button" data-motion-play aria-label="줄 와이프 다시 재생"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12a8 8 0 1 0 2.4-5.7M4 4v5h5"/></svg><span class="motion__play-text">다시 재생</span></button>
  </div>
  <div class="motion__cell motion__cell--band w-9">
    <div class="motion__info">…띠 떨어짐 320ms…</div>
    <div class="motion__stage"><div class="motion__drop">결제 확인 · 양일권 1매 ₩229,000</div></div>
    <button class="motion__play" …>…</button>
  </div>
  <div class="motion__cell motion__cell--band w-7">…색 뒤집기 (.motion__flip .btn)…</div>
  <div class="motion__cell motion__cell--band w-6">…전광판 (.motion__ticker > .marquee--ink)…</div>
  <p class="motion__note w-6">움직임 줄이기를 켠 기기에서는 …</p>
</div>
```
- 등장 와이프: 띠·줄에 `data-reveal`, 묶음은 부모에 `data-reveal-group`(자식마다 70ms씩 늦게). 화면에 들어올 때 한 번.
- 카운트업: `<span data-count="1284">1,284</span>`(최종 글자를 그대로 적는다. 한 번만 600ms). dashboard 주인공 숫자 하나에만.
- 금지: bounce·회전·지터·hover 이동·그림자 커짐·패럴랙스·연속 패턴 배경.

### navbar — 64px 먹 띠
4-1(관객용) · 4-2(운영실) 셸 스니펫을 **그대로** 복사한다. 상태: 메뉴 hover 핑크 면, 현재 페이지 `aria-current="page"` 노랑 면, 도구 버튼 hover 노랑. ≤960px 메뉴 줄이 숨고 메뉴 버튼(→ drawer)이 나온다.

### pagination — 현재 쪽만 T3 블루 면
```html
<nav class="pager" aria-label="문의 목록 쪽">
  <ul class="pager__list">
    <li><a class="pager__link pager__link--step" href="inbox.html" aria-disabled="true" tabindex="-1"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 4l-8 8 8 8"/></svg><span>이전</span></a></li>
    <li><a class="pager__link" href="inbox.html" aria-current="page" aria-label="1쪽">1</a></li>
    <li><a class="pager__link" href="inbox.html" aria-label="2쪽">2</a></li>
    <li><a class="pager__link" href="inbox.html" aria-label="3쪽">3</a></li>
    <li><a class="pager__link" href="inbox.html" aria-label="4쪽">4</a></li>
    <li><a class="pager__link pager__link--step" href="inbox.html"><span>다음</span><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 4l8 8-8 8"/></svg></a></li>
  </ul>
  <span class="pager__total">고른 문의 12건 · 1 / 4</span>
</nav>
```
쪽 수는 실제 데이터로 계산하고 `pager__total`에 "무엇의 몇 건인지"를 함께 적는다(index 견본: 고른 문의 12건 ÷ 3행 = 4쪽 / inbox: 12건이 한 쪽 → `1 / 1`). 생략 기호 `.pager__gap`(…)은 **실제로 건너뛰는 구간에서만** 쓴다(`1 2 … 9 10`). 연속한 숫자 사이에 두지 않는다. ≤640px에서 `.pager__far`와 이전/다음 글자가 숨는다.

### popover — 기준 요소에 맞붙는 노랑 블록 (공연 상세)
```html
<div class="pop-wrap">
  <button class="tl__set pop-anchor" type="button" data-popover aria-expanded="false" aria-controls="pop-1p4">…</button>
  <div class="popover" id="pop-1p4" role="dialog" aria-label="볕들날 공연 상세" hidden>
    <p class="popover__kicker" data-stage="P"><span class="sym" aria-hidden="true"></span>쨍 스테이지 · T1</p>
    <p class="popover__title">볕들날</p>
    <p class="popover__meta">SET-1P4 · 10.31 토 20:30–21:50</p>
    <p class="popover__text">정규 3집 『한낮 블록』 · 찜 3,120명</p>
    <div class="popover__actions"><button class="btn btn--sm" type="button" data-pick aria-pressed="false" data-stage="P" data-pick-on="볕들날을 찜했어요">찜하기</button><a class="btn btn--sm btn--ghost" href="profile.html">아티스트 보기</a></div>
    <button class="popover__close" type="button" aria-label="닫기" data-popover aria-controls="pop-1p4"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5l14 14M19 5L5 19"/></svg></button>
  </div>
</div>
```
`.popover--end`(오른쪽 맞춤, 화면 밖이면 자동) `.popover--above`. 열린 동안 기준 요소(`.pop-anchor`)는 제 면색(무대색)을 지키고 5px 노랑 안쪽 테만 두른다 — 팝오버 안에 기준 요소 이름을 다시 쓰지 않는다. 타임테이블 블록에 붙일 때는 `.pop-wrap` 대신 블록 바로 뒤 형제로 `<div class="popover" style="--at:450">`를 `.tl__lane` 안에 둔다(`.tl__lane > .popover` 규칙이 블록 위쪽에 맞붙인다). Esc·바깥 클릭으로 닫힘. 정적 견본: `.popover--static`(hidden 없이, 버튼 대신 span).

### progress — 굵은 막대 + 끝에 T4 숫자
```html
<div class="progress">
  <div class="progress__label"><span>토요일 판매</span><span class="t-mono">20,184 / 24,000</span></div>
  <div class="progress__track" role="progressbar" aria-label="토요일 판매율" aria-valuenow="84.1" aria-valuemin="0" aria-valuemax="100"><span class="progress__fill"></span></div>
  <span class="progress__value">84.1<small>%</small></span>
</div>
```
판매율은 **먹 채움 + 노랑 남은 칸**(기본). 무대별 찜 수처럼 무대에 속한 값은 `.progress--stage` + `data-stage`. 두께 `--thick`(32px) `--thin`(8px), 위험 `--danger`, 불확정 `--busy`. app.js가 `aria-valuenow`로 `--val`을 채운다(`JJ.setProgress(bar, 값)`으로 갱신). 권종 분할 막대: `<div class="progress__seg"><span data-stage="P" style="--val:30%"></span>…<span></span></div>`(마지막 칸 = 남은 자리 노랑).

### sidebar — 운영실 왼쪽 먹 기둥 248px
4-3 셸 스니펫을 그대로. 현재 위치 노랑 면 + 왼쪽 6px 블루 막대, 미답변 숫자는 `.wb--count`. ≤900px에서 숨고 navbar 메뉴 버튼이 운영실 drawer를 연다. index에서 정적 견본으로 보일 땐 `.side--static`.

### skeleton — 직각 블록, 2단 깜빡임
```html
<div class="skel-stack" aria-busy="true" aria-label="불러오는 중">
  <span class="skel skel--title"></span><span class="skel skel--line"></span><span class="skel skel--line is-short"></span><span class="skel skel--chip"></span>
</div>
<div class="skel-row"><span class="skel skel--sym"></span><span class="skel skel--line"></span></div>
```
`--t1`(주인공 숫자 자리) `--block`(160px). 빛 쓸기 없음.

### spinner — 무대 기호 4개 신호등 (회전 없음)
```html
<span class="spinner" role="status" aria-label="불러오는 중"><i></i><i></i><i></i><i></i></span>
<span class="spinner spinner--lg" role="status"><i></i><i></i><i></i><i></i><span class="spinner__label">판매 숫자를 다시 세는 중</span></span>
```
`--sm` 12px / 기본 24px / `--lg` 40px. 색면 안에서는 꺼진 칸 색이 자동으로 바뀐다.

### steps — 현재 단계만 T3 노랑 면
```html
<div class="steps" data-stepper>
  <ol class="steps__list">
    <li class="steps__item" data-state="done"><button type="button" data-step-go="1"><span class="steps__no">1</span>&nbsp;<span class="steps__name">권종</span></button></li>
    <li class="steps__item" data-state="current" aria-current="step"><span class="steps__no">2</span><span class="steps__name">관객 정보</span></li>
    <li class="steps__item" data-state="next"><span class="steps__no">3</span><span class="steps__name">결제</span></li>
  </ol>
  <span class="steps__count" data-step-count>2 / 3</span>
  <!-- 같은 data-stepper 안에 패널: <section data-step>…</section> × 3, 현재 외 hidden -->
  <!-- 넘김 버튼: data-step-next / data-step-prev / data-step-go="번호" -->
</div>
```
지난 단계 라임 ▲(되돌아가기 버튼), 다음 단계 흐린 글자, 오류 단계 `.is-error`. ≤640px에서 현재 단계 이름만 보인다(나머지 이름은 시각적으로만 숨겨 접근 이름을 남긴다). 지난 단계 링크·버튼은 칸 전체를 덮어 52×56px 이상 터치 타깃을 지킨다.

### table — 머리줄 먹 면, 무대 열은 기호 + 색 칸
```html
<div class="table-wrap scroll-x">
  <table class="table table--hover table--sticky">
    <caption>권종별 판매 · 10월 14일(수) 15:20 기준</caption>
    <thead><tr>
      <th scope="col" aria-sort="none"><button class="table__sort" type="button">권종</button></th>
      <th scope="col">무대 구역</th>
      <th scope="col" class="num" aria-sort="descending"><button class="table__sort" type="button" data-sort="num">판매</button></th>
      <th scope="col" class="num">가격</th>
      <th scope="col">상태</th>
    </tr></thead>
    <tbody>
      <tr><th scope="row">양일권</th><td class="table__stage" data-stage="A"><span><span class="sym" aria-hidden="true"></span>전체</span></td><td class="num" data-value="6820">6,820</td><td class="num mono">₩229,000</td><td><span class="wb wb--ok">…판매 중…</span></td></tr>
      <tr><th scope="row">쨍 피트권</th><td class="table__stage" data-stage="P"><span><span class="sym" aria-hidden="true"></span>쨍 앞</span></td><td class="num" data-value="1812">1,812</td><td class="num mono">₩279,000</td><td><span class="wb wb--hot">…잔여 188매…</span></td></tr>
      <tr class="is-dim"><th scope="row"><span class="table__strong">얼리버드 양일권</span></th>…<td><span class="wb wb--soldout">…매진…</span></td></tr>
    </tbody>
    <tfoot><tr><th scope="row">합계</th><td></td><td class="num">…</td><td></td><td></td></tr></tfoot>
  </table>
</div>
<p class="vh" data-sort-live aria-live="polite"></p>
```
상태: 정렬된 머리 노랑 면 + ▲/▼(`aria-sort`), 행 hover 노랑(`.table--hover`), 선택 행 `aria-selected="true"` 블루, 흐린 행 `.is-dim`. 숫자 열 `.num`(오른쪽, tabular), ID·금액 `.mono`, 체크 열 `.table__check`. `.table--compact`, 첫 열 고정 `.table--sticky`. ≤640px 최소 폭 600px로 가로 스크롤 + 페이드. 표는 8~15행의 실제 팩트 데이터.

### tabs — 이름 줄, 선택된 이름 뒤에 색 블록
```html
<div class="tabs">
  <div class="tabs__list" role="tablist" aria-label="공연 날">
    <button class="tabs__tab" role="tab" id="tab-sat" aria-controls="panel-sat" aria-selected="true" data-stage="P">토 10.31 <span class="tabs__meta">16팀</span></button>
    <button class="tabs__tab" role="tab" id="tab-sun" aria-controls="panel-sun" aria-selected="false" data-stage="B">일 11.01 <span class="tabs__meta">16팀</span></button>
  </div>
  <div class="tabs__panel" role="tabpanel" id="panel-sat" aria-labelledby="tab-sat" tabindex="0">…</div>
  <div class="tabs__panel" role="tabpanel" id="panel-sun" aria-labelledby="tab-sun" tabindex="0" hidden>…</div>
</div>
```
선택 면: `data-stage`가 있으면 그 무대색, 없으면 노랑. ←/→/Home/End, 로빙 tabindex는 app.js. 작은 필터 줄 `.tabs--sm`, settings 세로 탭 `.tabs--vertical` + 탭 목록에 `aria-orientation="vertical"`(≤760px 가로로). 넘치면 가로 스크롤 + 페이드.

### timeline — 타임테이블 축소판 (`.tl`) · 사건 목록 (`.tl-list`)
```html
<div class="scroll-x">
  <div class="tl" style="--span: 540">                       <!-- 13:00~22:00 = 540분. --at·--len은 13:00 기준 분 -->
    <div class="tl__corner">시간</div>
    <div class="tl__heads">
      <div class="tl__head" data-stage="P"><span class="sym" aria-hidden="true"></span>쨍<span class="tl__head-name"> 스테이지</span></div>
      <div class="tl__head" data-stage="B"><span class="sym" aria-hidden="true"></span>물결<span class="tl__head-name"> 스테이지</span></div>
      <div class="tl__head" data-stage="L"><span class="sym" aria-hidden="true"></span>잔디<span class="tl__head-name"> 스테이지</span></div>
      <div class="tl__head" data-stage="O"><span class="sym" aria-hidden="true"></span>귤<span class="tl__head-name"> 텐트</span></div>
    </div>
    <ol class="tl__ticks" aria-hidden="true"><li style="--at:0">13:00</li><li style="--at:60">14:00</li>…<li style="--at:480">21:00</li></ol>
    <div class="tl__lanes">
      <div class="tl__lane" data-stage="P">
        <button class="tl__set tl__set--t3" type="button" style="--at:60;--len:50" aria-label="수영금지 14:00–14:50 쨍 스테이지"><span class="tl__time">14:00</span><span class="tl__name">수영금지</span></button>
        <button class="tl__set tl__set--t1" type="button" style="--at:450;--len:80"><span class="tl__time">20:30</span><span class="tl__name">볕들날</span></button>
      </div>
      <div class="tl__lane" data-stage="B">…</div>
      <div class="tl__lane" data-stage="L">…</div>
      <div class="tl__lane" data-stage="O">…</div>
      <div class="tl__now" style="--at:340"><span>지금 <b>18:40</b></span></div>   <!-- 견본일 때만. 라벨은 왼쪽 시간 칸에 붙는다 -->
    </div>
  </div>
</div>
```
- 블록 크기·글자 = 빌링: `--t1`(보라 면, 30px) `--t2`(22px) `--t3`(18px) T4 기본. 칸 시간은 팩트 시트 무대별 시간 칸 그대로(예: 물결 4번째 19:20–20:20 → `--at:380;--len:60`).
- 상태: hover flip, 찜 `aria-pressed="true"`(노랑+먹 이중 테), 팝오버 열림 `aria-expanded="true"` = 무대색 유지 + 노랑 안쪽 테. 「지금」 라벨은 왼쪽 시간 칸 안에 붙는다(블록 이름을 가리지 않음). 촘촘한 `.tl--compact`(1분 0.9px).
- ≤640px에서 `.scroll-x` 안의 `.tl`은 최소 560px로 가로 스크롤한다(무대 이름은 한 글자로 줄어듦).
- 사건 목록:
```html
<ol class="tl-list">
  <li class="tl-list__item" data-stage="B"><span class="tl-list__time">19:20</span><span class="tl-list__text">오렌지기계 · 물결 스테이지</span></li>
  <li class="tl-list__item is-now" data-stage="P"><span class="tl-list__time">20:30</span><span class="tl-list__text">볕들날 · 쨍 스테이지 (걸어서 6분)</span></li>
</ol>
```

### toast — 아래에서 올라오는 풀폭 띠
JS로 띄운다(마크업 직접 작성 X):
```html
<button class="btn" type="button" data-pick aria-pressed="false" data-stage="P" data-pick-on="볕들날을 찜했어요 · 토 20:30 쨍 스테이지" data-pick-off="볕들날 찜을 뺐어요">찜하기</button>
<button class="btn" type="button" data-toast="저장했어요" data-toast-title="설정" data-toast-tone="success" data-toast-id="OP-STAFF-07">저장</button>
<script>/* 또는 */ JJ.toast({ title: '찜했어요', text: '볕들날 · 토 20:30 쨍 스테이지', stage: 'P' });</script>
```
`tone`: 기본 노랑 · `success` 라임 · `danger` 빨강(`role="alert"`) · `info` 블루 · `stage: 'P|B|L|O'` 무대색. 4.5초 후 닫힘, hover·focus 시 멈춤, 최대 3개 쌓임. 영역은 0절의 `.toasts[data-toast-zone]`.
정적 견본(index):
```html
<div class="toasts toasts--static" aria-hidden="true">
  <div class="toast toast--static" data-stage="P">
    <span class="toast__sym"><span class="sym"></span></span>
    <div class="toast__body"><strong class="toast__title">찜했어요</strong><span class="toast__text">볕들날 · 토 20:30 쨍 스테이지</span></div>
    <div class="toast__end"><span class="toast__close"><svg class="icon" viewBox="0 0 24 24"><path d="M5 5l14 14M19 5L5 19"/></svg></span></div>
    <span class="toast__timer"></span>
  </div>
</div>
```
`.toasts--static`은 문서 흐름 안에 그려진다(고정 위치 아님).

### tooltip — 먹 블록(다크: 노랑), 꼬리 없음, 기준 위에 맞붙음
```html
<span class="tip">
  <button class="btn btn--icon btn--sm btn--ghost" type="button" aria-label="이동 시간" aria-describedby="tip-walk"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h14M12 5l7 7-7 7"/></svg></button>
  <span class="tip__bubble" role="tooltip" id="tip-walk">쨍 → 물결 걸어서 <span class="t-mono">6분</span></span>
</span>
```
hover·focus로 보이고 Esc로 숨는다. `.tip--end`(오른쪽 맞춤) `.tip--below`. 정적 견본 `.tip__bubble--static`.

---

## 4. 공통 셸 스니펫 (복사해서 그대로 쓴다)

규칙: 아래 마크업에서 **바꿀 수 있는 것은 `aria-current="page"`의 위치뿐**이다. 메뉴 순서·문구·링크·푸터 문장은 모든 HTML이 같다. index.html은 루트, 나머지 9개는 `pages/`.

### 4-1. 관객용 navbar (index · pricing · product · profile · onboarding · 404)

**index.html 경로판** (현재 = 라인업)
```html
<header class="nav">
  <a class="nav__brand" href="index.html" aria-label="쨍 페스티벌 2026 라인업으로">
    <span class="nav__mark" aria-hidden="true">쨍</span>
    <span class="nav__word"><span class="nav__code">JJAENG 2026</span><span class="nav__tag">10.31 토 — 11.01 일 · 난지한강공원</span></span>
  </a>
  <nav class="nav__nav" aria-label="주 메뉴">
    <ul class="nav__menu">
      <li><a class="nav__link" href="index.html" aria-current="page">라인업</a></li>
      <li><a class="nav__link" href="index.html#timetable">타임테이블</a></li>
      <li><a class="nav__link" href="pages/pricing.html">티켓</a></li>
      <li><a class="nav__link" href="pages/product.html">굿즈</a></li>
    </ul>
  </nav>
  <div class="nav__tools">
    <button class="nav__btn nav__btn--cmd" type="button" data-open="cmd" aria-label="찾기 (⌘K)">
      <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M10.5 3.5a7 7 0 1 1 0 14 7 7 0 0 1 0-14zM15.5 15.5 21 21"/></svg>
      <span class="nav__btn-label">찾기</span><span class="kbd">⌘K</span>
    </button>
    <button class="nav__btn nav__btn--icon" type="button" data-theme-toggle aria-pressed="false" aria-label="밤 화면으로 바꾸기">
      <svg class="icon theme-icon--moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5z"/></svg>
      <svg class="icon theme-icon--sun" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zM12 1v3M12 20v3M1 12h3M20 12h3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/></svg>
    </button>
    <a class="nav__btn nav__btn--cta" href="pages/pricing.html">티켓 사기</a>
    <button class="nav__btn nav__burger" type="button" data-open="nav-drawer" aria-expanded="false" aria-controls="nav-drawer" aria-label="메뉴 열기">
      <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
    </button>
  </div>
</header>
```

**pages/*.html 경로판** (예: pricing — `aria-current`는 해당 메뉴에만. product = 굿즈, pricing = 티켓. profile·onboarding·404에는 `aria-current` 없음)
```html
<header class="nav">
  <a class="nav__brand" href="../index.html" aria-label="쨍 페스티벌 2026 라인업으로">
    <span class="nav__mark" aria-hidden="true">쨍</span>
    <span class="nav__word"><span class="nav__code">JJAENG 2026</span><span class="nav__tag">10.31 토 — 11.01 일 · 난지한강공원</span></span>
  </a>
  <nav class="nav__nav" aria-label="주 메뉴">
    <ul class="nav__menu">
      <li><a class="nav__link" href="../index.html">라인업</a></li>
      <li><a class="nav__link" href="../index.html#timetable">타임테이블</a></li>
      <li><a class="nav__link" href="pricing.html" aria-current="page">티켓</a></li>
      <li><a class="nav__link" href="product.html">굿즈</a></li>
    </ul>
  </nav>
  <div class="nav__tools">
    <button class="nav__btn nav__btn--cmd" type="button" data-open="cmd" aria-label="찾기 (⌘K)">
      <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M10.5 3.5a7 7 0 1 1 0 14 7 7 0 0 1 0-14zM15.5 15.5 21 21"/></svg>
      <span class="nav__btn-label">찾기</span><span class="kbd">⌘K</span>
    </button>
    <button class="nav__btn nav__btn--icon" type="button" data-theme-toggle aria-pressed="false" aria-label="밤 화면으로 바꾸기">
      <svg class="icon theme-icon--moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5z"/></svg>
      <svg class="icon theme-icon--sun" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zM12 1v3M12 20v3M1 12h3M20 12h3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/></svg>
    </button>
    <a class="nav__btn nav__btn--cta" href="pricing.html">티켓 사기</a>
    <button class="nav__btn nav__burger" type="button" data-open="nav-drawer" aria-expanded="false" aria-controls="nav-drawer" aria-label="메뉴 열기">
      <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
    </button>
  </div>
</header>
```

**관객용 모바일 내비 drawer** (body 끝, index 경로판 — pages에서는 `pages/` 접두어를 빼고 `index.html` → `../index.html`)
```html
<div class="drawer drawer--pink" id="nav-drawer" hidden role="dialog" aria-modal="true" aria-label="메뉴">
  <div class="drawer__scrim" data-close></div>
  <div class="drawer__panel">
    <div class="drawer__head">
      <p class="drawer__title">메뉴</p>
      <button class="drawer__close" type="button" data-close aria-label="메뉴 닫기"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5l14 14M19 5L5 19"/></svg></button>
    </div>
    <nav class="drawer__nav" aria-label="주 메뉴">
      <a class="drawer__link" href="index.html" aria-current="page">라인업 <small>32팀</small></a>
      <a class="drawer__link" href="index.html#timetable">타임테이블</a>
      <a class="drawer__link" href="pages/pricing.html">티켓 <small>₩89,000부터</small></a>
      <a class="drawer__link" href="pages/product.html">굿즈</a>
      <a class="drawer__link" href="pages/onboarding.html">내 타임테이블</a>
    </nav>
    <div class="drawer__body"><p class="t-sm">셔틀 11:00 ~ 23:00 · 월드컵경기장역 1번 출구 · 10분 간격 무료</p></div>
  </div>
</div>
```
pages 경로판:
```html
<div class="drawer drawer--pink" id="nav-drawer" hidden role="dialog" aria-modal="true" aria-label="메뉴">
  <div class="drawer__scrim" data-close></div>
  <div class="drawer__panel">
    <div class="drawer__head">
      <p class="drawer__title">메뉴</p>
      <button class="drawer__close" type="button" data-close aria-label="메뉴 닫기"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5l14 14M19 5L5 19"/></svg></button>
    </div>
    <nav class="drawer__nav" aria-label="주 메뉴">
      <a class="drawer__link" href="../index.html">라인업 <small>32팀</small></a>
      <a class="drawer__link" href="../index.html#timetable">타임테이블</a>
      <a class="drawer__link" href="pricing.html">티켓 <small>₩89,000부터</small></a>
      <a class="drawer__link" href="product.html">굿즈</a>
      <a class="drawer__link" href="onboarding.html">내 타임테이블</a>
    </nav>
    <div class="drawer__body"><p class="t-sm">셔틀 11:00 ~ 23:00 · 월드컵경기장역 1번 출구 · 10분 간격 무료</p></div>
  </div>
</div>
```
현재 페이지에 해당하는 `.drawer__link`에 `aria-current="page"`.

### 4-2. 운영실 navbar (dashboard · inbox · kanban · settings — 모두 pages/)
```html
<header class="nav">
  <a class="nav__brand" href="dashboard.html" aria-label="쨍 운영실 판매 상황판으로">
    <span class="nav__mark" aria-hidden="true">쨍</span>
    <span class="nav__word"><span class="nav__code">JJAENG OPS</span><span class="nav__tag">쨍 운영실 · ops.jjaeng.kr</span></span>
  </a>
  <p class="nav__status"><span class="sym sym--four" aria-hidden="true"></span>최종 라인업 공개 후 <b>1,284매</b> · 미답변 문의 <b>12건</b> · 10.14 수 15:20</p>
  <div class="nav__tools">
    <button class="nav__btn nav__btn--cmd" type="button" data-open="cmd" aria-label="찾기 (⌘K)">
      <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M10.5 3.5a7 7 0 1 1 0 14 7 7 0 0 1 0-14zM15.5 15.5 21 21"/></svg>
      <span class="nav__btn-label">찾기</span><span class="kbd">⌘K</span>
    </button>
    <button class="nav__btn nav__btn--icon" type="button" data-theme-toggle aria-pressed="false" aria-label="밤 화면으로 바꾸기">
      <svg class="icon theme-icon--moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5z"/></svg>
      <svg class="icon theme-icon--sun" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zM12 1v3M12 20v3M1 12h3M20 12h3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/></svg>
    </button>
    <a class="nav__btn nav__btn--cta" href="../index.html">관객 화면</a>
    <button class="nav__btn nav__burger" type="button" data-open="ops-drawer" aria-expanded="false" aria-controls="ops-drawer" aria-label="운영실 메뉴 열기">
      <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
    </button>
  </div>
</header>
```
운영실 상단 수치(1,284매 · 12건 · 10.14 수 15:20)는 팩트 시트 고정값이다. 바꾸지 않는다.

### 4-3. 운영실 sidebar + 본문 틀 (pages 경로판)
```html
<div class="ops">
  <aside class="side" aria-label="운영실 메뉴">
    <div class="side__group">
      <p class="side__label">쨍 운영실</p>
      <ul class="side__list">
        <li><a class="side__link" href="dashboard.html" aria-current="page"><span>판매 상황판</span></a></li>
        <li><a class="side__link" href="inbox.html"><span>관객 문의</span><span class="wb wb--count"><span class="wb__text"><span class="vh">미답변 </span>12</span></span></a></li>
        <li><a class="side__link" href="kanban.html"><span>현장 운영</span></a></li>
        <li><a class="side__link" href="settings.html"><span>계정 설정</span></a></li>
      </ul>
    </div>
    <div class="side__group">
      <p class="side__label">관객 화면</p>
      <ul class="side__list">
        <li><a class="side__link" href="../index.html"><span>라인업 포스터</span></a></li>
        <li><a class="side__link" href="pricing.html"><span>티켓</span></a></li>
      </ul>
    </div>
    <div class="side__stages" aria-hidden="true"><span data-stage="P"></span><span data-stage="B"></span><span data-stage="L"></span><span data-stage="O"></span></div>
    <div class="side__foot">
      <p class="side__user">나도윤 · 관객지원</p>
      <p class="side__meta">OP-STAFF-07</p>
    </div>
  </aside>
  <main class="ops__main" id="main">
    …장면…
  </main>
</div>
```
`aria-current="page"`는 현재 페이지 하나에만(dashboard / inbox / kanban / settings).
**index 운영실 장의 정적 견본판**: `<aside class="side side--static" aria-label="운영실 메뉴 견본">`, 링크는 `pages/dashboard.html` · `pages/inbox.html` · `pages/kanban.html` · `pages/settings.html` · `index.html` · `pages/pricing.html`. 나머지는 같다.

**운영실 모바일 drawer** (body 끝, ≤900px에서 sidebar 대신):
```html
<div class="drawer drawer--block" id="ops-drawer" hidden role="dialog" aria-modal="true" aria-label="운영실 메뉴">
  <div class="drawer__scrim" data-close></div>
  <div class="drawer__panel">
    <div class="drawer__head">
      <p class="drawer__title">쨍 운영실</p>
      <button class="drawer__close" type="button" data-close aria-label="메뉴 닫기"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5l14 14M19 5L5 19"/></svg></button>
    </div>
    <nav class="drawer__nav" aria-label="운영실 메뉴">
      <a class="drawer__link" href="dashboard.html" aria-current="page">판매 상황판</a>
      <a class="drawer__link" href="inbox.html">관객 문의 <small>미답변 12</small></a>
      <a class="drawer__link" href="kanban.html">현장 운영</a>
      <a class="drawer__link" href="settings.html">계정 설정</a>
      <a class="drawer__link" href="../index.html">관객 화면</a>
    </nav>
    <div class="drawer__body"><p class="t-sm">나도윤 · 관객지원 · OP-STAFF-07</p></div>
  </div>
</div>
```

### 4-4. footer (전 페이지 동일, `aria-current`만 해당 링크에)

**index.html 경로판**
```html
<footer class="foot">
  <div class="foot__stripes" aria-hidden="true"><span data-stage="P"></span><span data-stage="B"></span><span data-stage="L"></span><span data-stage="O"></span></div>
  <div class="foot__body">
    <p class="foot__mark"><span class="nav__mark" aria-hidden="true">쨍</span>쨍 페스티벌 2026 · 10.31 토 — 11.01 일 · 난지한강공원</p>
    <ul class="foot__links" aria-label="모든 페이지">
      <li><a href="index.html" aria-current="page">라인업</a></li>
      <li><a href="pages/dashboard.html">판매 상황판</a></li>
      <li><a href="pages/inbox.html">관객 문의</a></li>
      <li><a href="pages/kanban.html">현장 운영</a></li>
      <li><a href="pages/onboarding.html">내 타임테이블</a></li>
      <li><a href="pages/pricing.html">티켓</a></li>
      <li><a href="pages/product.html">굿즈</a></li>
      <li><a href="pages/profile.html">볕들날</a></li>
      <li><a href="pages/settings.html">설정</a></li>
      <li><a href="pages/404.html">없는 페이지 안내</a></li>
    </ul>
    <p class="foot__line">주최 (주)쨍컴퍼니 · 서울 마포구 동교로 211, 4층 · 대표 서보라 · 사업자등록번호 105-88-61427</p>
    <p class="foot__line">관객센터 <a href="mailto:help@jjaeng.kr">help@jjaeng.kr</a> · 02-6953-1031 (평일 10:00~18:00, 페스티벌 당일 10:00~23:00) · 아티스트·소속사 문의 <a href="mailto:artist@jjaeng.kr">artist@jjaeng.kr</a></p>
    <p class="foot__line">개최지 난지한강공원 잔디마당 일대 (서울 마포구 한강난지로 162) · 비가 와도 진행하고, 낙뢰 경보 때만 공연을 멈춰요.</p>
  </div>
</footer>
```

**pages/*.html 경로판** (예: dashboard)
```html
<footer class="foot">
  <div class="foot__stripes" aria-hidden="true"><span data-stage="P"></span><span data-stage="B"></span><span data-stage="L"></span><span data-stage="O"></span></div>
  <div class="foot__body">
    <p class="foot__mark"><span class="nav__mark" aria-hidden="true">쨍</span>쨍 페스티벌 2026 · 10.31 토 — 11.01 일 · 난지한강공원</p>
    <ul class="foot__links" aria-label="모든 페이지">
      <li><a href="../index.html">라인업</a></li>
      <li><a href="dashboard.html" aria-current="page">판매 상황판</a></li>
      <li><a href="inbox.html">관객 문의</a></li>
      <li><a href="kanban.html">현장 운영</a></li>
      <li><a href="onboarding.html">내 타임테이블</a></li>
      <li><a href="pricing.html">티켓</a></li>
      <li><a href="product.html">굿즈</a></li>
      <li><a href="profile.html">볕들날</a></li>
      <li><a href="settings.html">설정</a></li>
      <li><a href="404.html">없는 페이지 안내</a></li>
    </ul>
    <p class="foot__line">주최 (주)쨍컴퍼니 · 서울 마포구 동교로 211, 4층 · 대표 서보라 · 사업자등록번호 105-88-61427</p>
    <p class="foot__line">관객센터 <a href="mailto:help@jjaeng.kr">help@jjaeng.kr</a> · 02-6953-1031 (평일 10:00~18:00, 페스티벌 당일 10:00~23:00) · 아티스트·소속사 문의 <a href="mailto:artist@jjaeng.kr">artist@jjaeng.kr</a></p>
    <p class="foot__line">개최지 난지한강공원 잔디마당 일대 (서울 마포구 한강난지로 162) · 비가 와도 진행하고, 낙뢰 경보 때만 공연을 멈춰요.</p>
  </div>
</footer>
```
운영실 페이지에서는 footer가 `.ops` 바깥(아래)에 온다. 판권 정의 목록(dl) 금지. 한 줄 문장들만.

### 4-5. ⌘K 커맨드 팔레트 (모든 HTML body 끝에 1개)

**index.html 경로판**
```html
<div class="cmd" id="cmd" data-command hidden role="dialog" aria-modal="true" aria-label="찾기">
  <div class="cmd__scrim" data-close></div>
  <div class="cmd__band">
    <div class="cmd__bar">
      <span class="sym sym--four" aria-hidden="true"></span>
      <input class="cmd__input" type="text" placeholder="아티스트·공연·페이지 찾기" aria-label="찾을 말" autocomplete="off" data-autofocus>
      <span class="cmd__esc">ESC</span>
      <button class="cmd__close" type="button" data-close aria-label="찾기 닫기"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5l14 14M19 5L5 19"/></svg></button>
    </div>
    <ul class="cmd__list">
      <li class="cmd__group">아티스트 · 찜 많은 순</li>
      <li class="cmd__item" data-stage="P" data-href="pages/profile.html" data-keywords="byeotdeulnal 헤드라이너"><span class="cmd__sym"><span class="sym"></span></span><span class="cmd__main"><span class="cmd__name">볕들날</span><span class="cmd__kind">아티스트 · T1</span></span><span class="cmd__meta">SET-1P4 · 토 20:30</span></li>
      <li class="cmd__item" data-stage="P" data-toast="번개다방 · 일 20:30 쨍 스테이지" data-keywords="lightning dabang 헤드라이너"><span class="cmd__sym"><span class="sym"></span></span><span class="cmd__main"><span class="cmd__name">번개다방</span><span class="cmd__kind">아티스트 · T1</span></span><span class="cmd__meta">SET-2P4 · 일 20:30</span></li>
      <li class="cmd__item" data-stage="B" data-toast="오렌지기계 · 토 19:20 물결 스테이지" data-keywords="orange machine"><span class="cmd__sym"><span class="sym"></span></span><span class="cmd__main"><span class="cmd__name">오렌지기계</span><span class="cmd__kind">아티스트 · T2</span></span><span class="cmd__meta">SET-1B4 · 토 19:20</span></li>
      <li class="cmd__item" data-stage="P" data-toast="물수제비 · 토 18:00 쨍 스테이지" data-keywords="mulsujebi"><span class="cmd__sym"><span class="sym"></span></span><span class="cmd__main"><span class="cmd__name">물수제비</span><span class="cmd__kind">아티스트 · T2</span></span><span class="cmd__meta">SET-1P3 · 토 18:00</span></li>
      <li class="cmd__item" data-stage="B" data-toast="분홍트랙터 · 일 19:20 물결 스테이지" data-keywords="pink tractor 최종 추가"><span class="cmd__sym"><span class="sym"></span></span><span class="cmd__main"><span class="cmd__name">분홍트랙터</span><span class="cmd__kind">아티스트 · T2</span></span><span class="cmd__meta">SET-2B4 · 일 19:20</span></li>
      <li class="cmd__item" data-stage="P" data-toast="오리배 · 일 18:00 쨍 스테이지" data-keywords="duck boat"><span class="cmd__sym"><span class="sym"></span></span><span class="cmd__main"><span class="cmd__name">오리배</span><span class="cmd__kind">아티스트 · T2</span></span><span class="cmd__meta">SET-2P3 · 일 18:00</span></li>
      <li class="cmd__item" data-stage="P" data-toast="수영금지 · 토 14:00 쨍 스테이지" data-keywords="no swimming 최종 추가"><span class="cmd__sym"><span class="sym"></span></span><span class="cmd__main"><span class="cmd__name">수영금지</span><span class="cmd__kind">아티스트 · T3</span></span><span class="cmd__meta">SET-1P1 · 토 14:00</span></li>
      <li class="cmd__group">관객 화면</li>
      <li class="cmd__item" data-href="index.html#timetable" data-keywords="시간표 timetable"><span class="cmd__sym"><span class="sym sym--four"></span></span><span class="cmd__main"><span class="cmd__name">타임테이블</span><span class="cmd__kind">라인업 포스터</span></span><span class="cmd__meta">32팀</span></li>
      <li class="cmd__item" data-href="pages/pricing.html" data-keywords="티켓 예매 환불"><span class="cmd__sym"><span class="sym sym--four"></span></span><span class="cmd__main"><span class="cmd__name">티켓</span><span class="cmd__kind">페이지</span></span><span class="cmd__meta">₩229,000</span></li>
      <li class="cmd__item" data-href="pages/product.html" data-keywords="티셔츠 굿즈"><span class="cmd__sym"><span class="sym sym--four"></span></span><span class="cmd__main"><span class="cmd__name">라인업 블록 티셔츠</span><span class="cmd__kind">굿즈</span></span><span class="cmd__meta">GD-TEE</span></li>
      <li class="cmd__item" data-href="pages/onboarding.html" data-keywords="찜 내 시간표"><span class="cmd__sym"><span class="sym sym--four"></span></span><span class="cmd__main"><span class="cmd__name">내 타임테이블 만들기</span><span class="cmd__kind">페이지</span></span><span class="cmd__meta">3단계</span></li>
      <li class="cmd__group">쨍 운영실</li>
      <li class="cmd__item" data-href="pages/dashboard.html" data-keywords="판매 매출"><span class="cmd__sym"><span class="sym sym--four"></span></span><span class="cmd__main"><span class="cmd__name">판매 상황판</span><span class="cmd__kind">운영실</span></span><span class="cmd__meta">1,284매</span></li>
      <li class="cmd__item" data-href="pages/inbox.html" data-keywords="문의 qa"><span class="cmd__sym"><span class="sym sym--four"></span></span><span class="cmd__main"><span class="cmd__name">관객 문의</span><span class="cmd__kind">운영실</span></span><span class="cmd__meta">미답변 12</span></li>
      <li class="cmd__item" data-href="pages/kanban.html" data-keywords="작업 op 현장"><span class="cmd__sym"><span class="sym sym--four"></span></span><span class="cmd__main"><span class="cmd__name">현장 운영 보드</span><span class="cmd__kind">운영실</span></span><span class="cmd__meta">OP 12장</span></li>
      <li class="cmd__item" data-href="pages/settings.html" data-keywords="계정 알림 설정"><span class="cmd__sym"><span class="sym sym--four"></span></span><span class="cmd__main"><span class="cmd__name">계정 설정</span><span class="cmd__kind">운영실</span></span><span class="cmd__meta">OP-STAFF-07</span></li>
    </ul>
    <p class="cmd__empty" hidden>찾는 이름이 라인업에 없어요. 아티스트 한글·라틴 이름, 공연 ID로 찾아보세요.</p>
    <div class="cmd__foot"><span><span class="kbd">↑</span> <span class="kbd">↓</span> 고르기</span><span><span class="kbd">↵</span> 열기</span><span><span class="kbd">ESC</span> 닫기</span></div>
  </div>
</div>
```
**pages 경로판**: 위와 같고 `data-href`만 바꾼다 — `pages/profile.html` → `profile.html`, `pages/pricing.html` → `pricing.html`, `pages/product.html` → `product.html`, `pages/onboarding.html` → `onboarding.html`, `pages/dashboard.html` → `dashboard.html`, `pages/inbox.html` → `inbox.html`, `pages/kanban.html` → `kanban.html`, `pages/settings.html` → `settings.html`, `index.html#timetable` → `../index.html#timetable`. 항목·순서·문구는 바꾸지 않는다.

---

## 5. app.js 훅 요약

| 훅 | 동작 |
|---|---|
| `[data-theme-toggle]` | 낮/밤 전환 + localStorage(`jjaeng-theme`), `aria-pressed`·`aria-label` 자동. 안의 `[data-theme-label]` 글자도 바꿈 |
| `?theme=dark\|light` | 최우선. 저장하지 않음 |
| `[data-open="id"]` / `[data-close]` | 모달·드로어·커맨드 열고 닫기(포커스 트랩, Esc, 스크롤 잠금, 연 버튼으로 복귀). 첫 포커스 `[data-autofocus]` |
| `[data-command]` | ⌘K/Ctrl+K, 거르기, ↑/↓/Enter, `data-href`·`data-toast`·`data-keywords` |
| `[aria-haspopup="menu"][aria-controls]` · `[data-popover][aria-controls]` | 메뉴·팝오버 토글, 바깥 클릭·Esc 닫기, 메뉴 화살표 이동, `[data-menu-value]` 반영 |
| `[role="tablist"]` | 탭 선택·키보드·패널 hidden |
| `[data-accordion]` (`="single"`) | 아코디언 |
| `[data-toast]` + `data-toast-title/-tone/-stage/-id` · `JJ.toast({…})` | 토스트 |
| `[data-dismiss]` | 가장 가까운 `.alert`/`.toast`/`[data-dismissible]` 닫기 |
| `[data-busy-demo="ms"]` | 버튼 로딩 시연 후 `data-toast` |
| `[data-carousel]` · `[data-carousel-prev/next]` · `[data-carousel-count]` | 캐러셀 |
| `[data-marquee]` · `[data-marquee-toggle]` | 전광판 복제·멈춤 |
| `[data-fit]` (`data-fit-max/min`) | 빌링 줄 양끝 맞춤. 동적으로 내용을 바꾼 뒤엔 `JJ.refit()` |
| `[data-reveal]` · `[data-reveal-group]` | 화면에 들어올 때 한 번 와이프 |
| `[data-count="1284"]` | 카운트업 한 번 |
| `.table__sort` (`data-sort="num"`, 칸 `data-value`) · `[data-sort-live]` | 표 정렬 + 안내 |
| `[data-kanban]` | 칸반 키보드·끌기·장수·aria-live |
| `[data-calendar]` · `button.cal__day[data-label]` · `[data-cal-output]` | 날짜 선택 |
| `[data-calendar][data-cal-month]` · `.cal__nav[data-cal-step="-1/1"]` · `data-cal-min/max` · `data-cal-events` | 달 넘김. 처음 달은 마크업 그대로 되살리고, 다른 달은 날짜 칸을 새로 그린다(문자열 = 노랑 마감 칸, `{t, stage}` = 무대색 페스티벌 칸). 범위 밖이면 버튼 disabled |
| `form[data-validate]` + `data-success-toast/-id`, `data-error-toast` | 폼 검증 |
| `[data-stepper]` · `[data-step]` · `[data-step-next/prev/go]` · `[data-step-count]` | 단계 넘김 |
| `[data-pick]` (`aria-pressed`, `data-pick-on/off`) · `[data-pick-group]` · `[data-pick-count]` | 찜 토글 + 개수 |
| `[data-pick-group][data-pick-conflict]` + 각 `[data-pick]`에 `data-day` `data-start` `data-end` `data-stage` `data-set` · 선택 `[data-pick-conflict-alert]` > `[data-pick-conflict-text]` | 같은 날 시간 겹침 → `.is-conflict` + 알림 문장. 결과를 `jj:picks` 이벤트(`detail.on/clash/lines`)로 알려 장면이 목록·지도를 다시 그린다 |
| `[role="switch"]` (+ `.switch__state`) | 스위치 켜짐/꺼짐 |
| `[data-copy]` (`="#선택자"`) | 복사 + 「복사됨」 |
| `[data-motion-play]` | 모션 실연 칸 재생 |
| `[role="progressbar"][aria-valuenow]` · `JJ.setProgress(bar, v)` | 진행 막대 |
| 이벤트 | `jj:open` `jj:close` `jj:tab` `jj:step` `jj:date` `jj:submit` (bubbles) |

---

## 6. 쓰지 말 것

- 둥근 모서리, 그림자, 사선·회전(`rotate`, `skew`, `clip-path` 다각형), 그라디언트 배경, 흐린 radial 얼룩, 파스텔 틴트(무대색 10~20%).
- hover 시 이동(translate)·확대·그림자. hover는 **색 짝 바꾸기(clash flip)** 하나.
- 같은 크기 KPI 4개, 같은 높이 카드 그리드, 원형 도넛, 「오늘의 인사이트」 카드, 무지개 순환 막대(무대와 무관한 색 돌려쓰기).
- eyebrow 라벨 + 거대 헤드라인 + 부연 + CTA 2개로 시작하는 첫 화면, 가운데 정렬 섹션 머리(작은 라벨 → 제목 → 부제) 반복, 「§ 번호 + 제목」, 왼쪽 고정 목차 사이드바(theme-30 전용).
- 노랑·라임 면 위 흰 글자, 핑크 면 위 블루 글자 등 4-2 표 밖 조합. 경보빨강을 장식에 쓰기.
- 한글에 모노 폰트·넓은 자간, Gothic A1에 400/700/900 외 웨이트, `-webkit-text-stroke`.
- 팩트 시트에 없는 날짜·요일·가격·이름·ID, 「○○」 같은 플레이스홀더, 디자인 시스템 자랑 문구(「토큰만 바꾸면…」).
